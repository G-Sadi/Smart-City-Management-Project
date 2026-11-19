import logging
from datetime import date, datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple, Set
import heapq
import networkx as nx
from sqlalchemy.orm import Session

from models import Project, Proposal, Component, Constraint, Agency

logger = logging.getLogger(__name__)

def add_days(d: date, days: int) -> date:
    return d + timedelta(days=days)

def add_years(d: date, years: float) -> date:
    days = int(round(years * 365.25))
    return d + timedelta(days=days)

def date_to_str(d: Optional[date]) -> Optional[str]:
    return d.isoformat() if d else None

class RCPSPScheduler:
    """
    Deterministic Resource-Constrained Project Scheduling (RCPSP) Solver & Dynamic Recalculator.
    Enforces all 4 core constraints:
      1. Component Interdependencies (DAG with cycle detection)
      2. Agency Concurrency Limit (max active components per agency)
      3. Location & Blackout Constraints (location concurrency limits + blackout dates)
      4. Yearly Budget Constraints (expenditure cap per fiscal/calendar year)
    """

    def __init__(self, db: Session):
        self.db = db
        self.load_constraints()

    def load_constraints(self):
        """Loads and indexes constraints from DB."""
        self.agency_limits: Dict[str, int] = {}
        self.location_limits: Dict[str, int] = {}
        self.yearly_funding: Dict[str, float] = {}
        self.blackout_periods: List[Dict[str, Any]] = []

        constraints = self.db.query(Constraint).all()
        for c in constraints:
            ctype = c.constraint_type
            code = c.code.strip()
            if ctype == "executing_agency_limit":
                self.agency_limits[code] = int(c.max_limit)
            elif ctype == "location_limit":
                self.location_limits[code] = int(c.max_limit)
            elif ctype == "yearly_funding":
                self.yearly_funding[code] = float(c.max_limit)
            elif ctype == "blackout_period":
                self.blackout_periods.append({
                    "code": code,
                    "start_date": c.start_date,
                    "end_date": c.end_date,
                    "description": c.description
                })

        # Sensible defaults for unconstrained entities
        self.default_agency_limit = 50
        self.default_location_limit = 15

    def get_agency_limit(self, agency_code: str) -> int:
        return self.agency_limits.get(agency_code, self.default_agency_limit)

    def get_location_limit(self, location: str) -> int:
        return self.location_limits.get(location, self.default_location_limit)

    def get_yearly_funding(self, agency_code: str) -> Optional[float]:
        return self.yearly_funding.get(agency_code)

    def build_dependency_graph(self) -> nx.DiGraph:
        """Constructs Directed Acyclic Graph of all components with cycle detection."""
        G = nx.DiGraph()
        components = self.db.query(Component).all()
        for comp in components:
            G.add_node(
                comp.component_id,
                project_id=comp.project_id,
                proposal_id=comp.proposal_id,
                agency=comp.ececuting_agency,
                budget_ratio=comp.budget_ratio,
                status=comp.status,
                completion_pct=comp.completion_pct
            )

        for comp in components:
            if comp.depends_on and comp.depends_on.strip():
                parent_id = comp.depends_on.strip()
                if G.has_node(parent_id):
                    G.add_edge(parent_id, comp.component_id)
                else:
                    logger.warning(f"Dependency parent {parent_id} not found for {comp.component_id}")

        if not nx.is_directed_acyclic_graph(G):
            cycles = list(nx.simple_cycles(G))
            raise ValueError(f"Dependency cycle detected in project components: {cycles}")

        return G

    def check_blackout(self, start_date: date, end_date: date, location: Optional[str] = None, agency: Optional[str] = None) -> Tuple[bool, Optional[date], Optional[str]]:
        """Checks if interval overlaps with any blackout periods."""
        for bp in self.blackout_periods:
            b_code = bp["code"]
            b_start = bp["start_date"]
            b_end = bp["end_date"]
            if not b_start or not b_end:
                continue

            # Check if this blackout applies to this location or agency (or ALL)
            if b_code != "ALL" and b_code != location and b_code != agency:
                continue

            # Overlap condition: start <= b_end and end >= b_start
            if start_date <= b_end and end_date >= b_start:
                # Suggest next available day after blackout ends
                next_available = add_days(b_end, 1)
                return True, next_available, bp.get("description") or f"Blackout period for {b_code}"

        return False, None, None

    def recalculate_all_schedules(self) -> Dict[str, Any]:
        """
        Recalculates planned and projected dates for all active projects and components.
        Applies dynamic formula:
          Remaining_Duration = Original_Duration * ((100 - Current_Completion_Pct) / 100)
        Cascades delays to downstream components in the DAG.
        """
        today = date.today()
        projects = self.db.query(Project).all()
        components = self.db.query(Component).filter(Component.project_id.isnot(None)).all()

        comp_dict: Dict[str, Component] = {c.component_id: c for c in components}
        proj_dict: Dict[str, Project] = {p.project_id: p for p in projects}

        # Build DAG
        G = self.build_dependency_graph()

        # Track active yearly spend: agency -> year -> amount
        yearly_spend: Dict[str, Dict[int, float]] = {}

        # 1. Update component durations and initial dates
        for cid, comp in comp_dict.items():
            proj = proj_dict.get(comp.project_id)
            if not proj:
                continue

            original_duration_years = float(proj.timespan)
            completion = comp.completion_pct if comp.completion_pct is not None else 0.0

            # Dynamic formula:
            remaining_duration_years = max(0.0, original_duration_years * ((100.0 - completion) / 100.0))
            comp.remaining_duration_years = round(remaining_duration_years, 3)

            # Planned start & end
            planned_start = proj.start_date
            planned_end = add_years(planned_start, original_duration_years)
            comp.planned_start_date = planned_start
            comp.planned_end_date = planned_end

            # Projected start & end
            if completion >= 100.0:
                comp.status = "Completed"
                comp.projected_start_date = comp.planned_start_date
                comp.projected_end_date = comp.planned_end_date
            elif completion > 0.0:
                comp.status = "Running"
                comp.projected_start_date = planned_start
                # If behind schedule, projected end pushes out from today
                remaining_end_from_today = add_years(today, remaining_duration_years)
                comp.projected_end_date = max(planned_end, remaining_end_from_today)
                if comp.projected_end_date > planned_end:
                    comp.status = "Delayed"
            else:
                comp.status = "Running" if planned_start <= today else "Approved"
                comp.projected_start_date = planned_start
                comp.projected_end_date = planned_end

            # Allocated cost
            comp.allocated_cost = round(proj.cost * comp.budget_ratio, 4)
            if comp.spent_cost is None or comp.spent_cost == 0.0:
                comp.spent_cost = round(comp.allocated_cost * (completion / 100.0), 4)

        # 2. Topological cascade for dependent components
        for cid in nx.topological_sort(G):
            if cid not in comp_dict:
                continue
            comp = comp_dict[cid]
            preds = list(G.predecessors(cid))
            if preds:
                # Component cannot start before all predecessors finish
                max_pred_end = max(
                    (comp_dict[p].projected_end_date for p in preds if p in comp_dict and comp_dict[p].projected_end_date),
                    default=None
                )
                if max_pred_end and comp.projected_start_date and comp.projected_start_date < max_pred_end:
                    # Cascade delay
                    delay_days = (max_pred_end - comp.projected_start_date).days
                    comp.projected_start_date = max_pred_end
                    if comp.projected_end_date:
                        comp.projected_end_date = add_days(comp.projected_end_date, delay_days)
                    if comp.status != "Completed":
                        comp.status = "Delayed"

        # 3. Roll up to Projects
        for pid, proj in proj_dict.items():
            proj_comps = [c for c in components if c.project_id == pid]
            if not proj_comps:
                continue

            max_proj_end = max((c.projected_end_date for c in proj_comps if c.projected_end_date), default=proj.planned_end_date)
            proj.projected_end_date = max_proj_end

            # Weighted average completion
            total_ratio = sum(c.budget_ratio for c in proj_comps) or 1.0
            avg_completion = sum(c.completion_pct * (c.budget_ratio / total_ratio) for c in proj_comps)
            proj.completion = round(avg_completion, 2)

            # Total actual cost spent
            total_spent = sum(c.spent_cost for c in proj_comps)
            proj.actual_cost = round(total_spent, 4)

            # Overall project status
            if proj.completion >= 100.0:
                proj.status = "Completed"
            elif max_proj_end and max_proj_end > proj.planned_end_date:
                proj.status = "Delayed"
            elif proj.start_date <= today:
                proj.status = "Running"
            else:
                proj.status = "Approved"

        self.db.commit()

        return {
            "recalculated_at": datetime.utcnow().isoformat(),
            "projects_updated": len(projects),
            "components_updated": len(components)
        }

    def suggest_optimal_timeframe(
        self,
        cost: float,
        timespan_years: int,
        exec_agency: str,
        location: str,
        earliest_start: Optional[date] = None,
        dependencies: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        RCPSP Solver: Computes the earliest possible start and end dates with minimum project timespan
        for a new DPP proposal, respecting all 4 constraints:
          1. Predecessor Dependencies
          2. Agency Concurrency Limit
          3. Location Concurrency Limit & Blackout Windows
          4. Yearly Budget Constraints
        """
        if earliest_start is None:
            earliest_start = date.today() + timedelta(days=1)

        candidate_start = earliest_start
        bottleneck_reason = "No constraint bottleneck; scheduled at earliest requested date."
        bottleneck_type = None
        constraint_details: Dict[str, Any] = {}

        # 1. Dependency Constraint Check
        if dependencies:
            comp_dict = {c.component_id: c for c in self.db.query(Component).all()}
            for dep_id in dependencies:
                dep_comp = comp_dict.get(dep_id.strip())
                if dep_comp and dep_comp.projected_end_date:
                    if dep_comp.projected_end_date >= candidate_start:
                        candidate_start = add_days(dep_comp.projected_end_date, 1)
                        bottleneck_type = "dependency"
                        bottleneck_reason = f"Waiting for predecessor component '{dep_id}' to complete on {dep_comp.projected_end_date}."
                        constraint_details["dependency"] = dep_id

        # Retrieve active projects and their components for interval checking
        active_comps = self.db.query(Component, Project).join(Project, Component.project_id == Project.project_id).filter(
            Project.status.in_(["Running", "Approved", "Delayed"])
        ).all()

        agency_max = self.get_agency_limit(exec_agency)
        loc_max = self.get_location_limit(location)
        yearly_funding_cap = self.get_yearly_funding(exec_agency)

        # Iteratively search for the earliest valid start date (day-stepping or milestone-stepping)
        max_search_days = 365 * 10  # 10 year search window max
        days_tested = 0
        step_days = 7  # weekly resolution for fast realistic simulation

        while days_tested < max_search_days:
            candidate_end = add_years(candidate_start, float(timespan_years))

            # A. Check Blackout Constraints
            is_blackout, next_avail, desc = self.check_blackout(candidate_start, candidate_end, location, exec_agency)
            if is_blackout and next_avail:
                candidate_start = next_avail
                bottleneck_type = "blackout"
                bottleneck_reason = f"Restricted timeframe: {desc}. Shifted to {next_avail}."
                constraint_details["blackout"] = desc
                continue

            # B. Check Agency Concurrency Limit at candidate_start
            active_agency_count = 0
            active_location_count = 0

            for comp, proj in active_comps:
                c_start = comp.projected_start_date or proj.start_date
                c_end = comp.projected_end_date or proj.planned_end_date
                if not c_start or not c_end:
                    continue

                # Check overlap with candidate period
                if candidate_start <= c_end and candidate_end >= c_start:
                    if comp.ececuting_agency == exec_agency:
                        active_agency_count += 1
                    if proj.location == location:
                        active_location_count += 1

            if active_agency_count >= agency_max:
                # Agency concurrency full! Advance candidate_start
                bottleneck_type = "agency_concurrency"
                bottleneck_reason = f"Agency {exec_agency} concurrency limit reached ({active_agency_count}/{agency_max} active components)."
                constraint_details["agency_concurrency"] = {
                    "agency": exec_agency, "active": active_agency_count, "limit": agency_max
                }
                candidate_start = add_days(candidate_start, step_days)
                days_tested += step_days
                continue

            # C. Check Location Concurrency Limit
            if active_location_count >= loc_max:
                # Location concurrency full!
                bottleneck_type = "location_concurrency"
                bottleneck_reason = f"Location {location} concurrency limit reached ({active_location_count}/{loc_max} active components)."
                constraint_details["location_concurrency"] = {
                    "location": location, "active": active_location_count, "limit": loc_max
                }
                candidate_start = add_days(candidate_start, step_days)
                days_tested += step_days
                continue

            # D. Check Yearly Funding Constraint
            if yearly_funding_cap:
                # Calculate agency spend in candidate start's year
                target_year = candidate_start.year
                annual_cost_for_proposal = cost / max(1, timespan_years)

                year_existing_spend = 0.0
                for comp, proj in active_comps:
                    if comp.ececuting_agency == exec_agency:
                        c_start = comp.projected_start_date or proj.start_date
                        c_end = comp.projected_end_date or proj.planned_end_date
                        if c_start and c_end and c_start.year <= target_year <= c_end.year:
                            comp_annual_cost = (comp.allocated_cost or (proj.cost * comp.budget_ratio)) / max(1, proj.timespan)
                            year_existing_spend += comp_annual_cost

                if (year_existing_spend + annual_cost_for_proposal) > yearly_funding_cap:
                    # Defer to next fiscal year (Jan 1 of next year)
                    bottleneck_type = "yearly_budget"
                    bottleneck_reason = f"Yearly budget cap of {yearly_funding_cap} Cr Tk exceeded for {exec_agency} in {target_year} (Current: {round(year_existing_spend, 2)} Cr Tk). Deferred to next fiscal year."
                    constraint_details["yearly_budget"] = {
                        "agency": exec_agency, "year": target_year, "cap": yearly_funding_cap, "spend": round(year_existing_spend, 2)
                    }
                    candidate_start = date(target_year + 1, 1, 1)
                    days_tested += 365
                    continue

            # All constraints passed!
            break

        optimal_end = add_years(candidate_start, float(timespan_years))
        is_immediate = (candidate_start == earliest_start)

        return {
            "optimal_start_date": candidate_start,
            "optimal_end_date": optimal_end,
            "timespan_years": timespan_years,
            "bottleneck_constraint": bottleneck_type,
            "constraint_details": constraint_details,
            "is_immediate": is_immediate,
            "earliest_available_slot_reason": bottleneck_reason
        }

    def analyze_bottlenecks(self) -> Dict[str, Any]:
        """Provides holistic citywide analysis of active bottlenecks across agencies & locations."""
        active_comps = self.db.query(Component, Project).join(Project, Component.project_id == Project.project_id).filter(
            Project.status.in_(["Running", "Approved", "Delayed"])
        ).all()

        agency_counts: Dict[str, int] = {}
        location_counts: Dict[str, int] = {}

        for comp, proj in active_comps:
            agency_counts[comp.ececuting_agency] = agency_counts.get(comp.ececuting_agency, 0) + 1
            location_counts[proj.location] = location_counts.get(proj.location, 0) + 1

        agency_utilization = []
        for ag, cnt in agency_counts.items():
            limit = self.get_agency_limit(ag)
            pct = round((cnt / limit) * 100, 1) if limit else 0
            agency_utilization.append({
                "agency": ag,
                "active_components": cnt,
                "limit": limit,
                "utilization_pct": pct,
                "is_critical": pct >= 80.0
            })

        location_utilization = []
        for loc, cnt in location_counts.items():
            limit = self.get_location_limit(loc)
            pct = round((cnt / limit) * 100, 1) if limit else 0
            location_utilization.append({
                "location": loc,
                "active_components": cnt,
                "limit": limit,
                "utilization_pct": pct,
                "is_critical": pct >= 80.0
            })

        return {
            "agency_utilization": sorted(agency_utilization, key=lambda x: x["utilization_pct"], reverse=True),
            "location_utilization": sorted(location_utilization, key=lambda x: x["utilization_pct"], reverse=True),
            "total_active_components": len(active_comps)
        }
