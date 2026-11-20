"""
CivicGrid Deterministic Predictive Risk & Cost Overrun Engine
Evaluates 5 multi-factor operational vectors:
1. Schedule Slippage (projected vs planned baseline)
2. Historical Burn Pace (expenditure rate vs physical completion)
3. Critical Path Strain (dependency DAG depth & predecessor blockers)
4. Agency Workload Stress (concurrent project load)
5. Citizen Friction (feedback ratings & active civic hazard reports)
"""
from typing import Dict, Any, List, Optional
from datetime import date, datetime

def calculate_project_risk(
    project_dict: Dict[str, Any],
    components: List[Dict[str, Any]] = None,
    feedbacks: List[Dict[str, Any]] = None,
    civic_issues: List[Dict[str, Any]] = None,
    agency_active_count: int = 2
) -> Dict[str, Any]:
    components = components or []
    feedbacks = feedbacks or []
    civic_issues = civic_issues or []

    project_id = project_dict.get("project_id", "")
    name = project_dict.get("name", "")
    status = project_dict.get("status", "Running")
    completion = float(project_dict.get("completion") or 0.0)
    cost = max(1.0, float(project_dict.get("cost") or 1.0))
    actual_cost = float(project_dict.get("actual_cost") or 0.0)
    planned_end = project_dict.get("planned_end_date")
    projected_end = project_dict.get("projected_end_date")
    exec_agency = project_dict.get("exec", "")

    # Completed check
    if status == "Completed" or completion >= 100.0:
        return {
            "project_id": project_id,
            "name": name,
            "risk_score": 5,
            "risk_tier": "Low",
            "delay_probability_pct": 2,
            "forecasted_final_cost": round(actual_cost or cost, 2),
            "forecasted_overrun_pct": 0.0,
            "predicted_delay_days": 0,
            "top_risk_drivers": ["Project has successfully concluded with zero open critical constraints."],
            "variance_factors": {
                "critical_path_strain": 0,
                "agency_workload_stress": 5,
                "schedule_slippage": 0,
                "citizen_friction": 5,
                "historical_burn_pace": 0,
            }
        }

    # 1. Schedule Slippage
    slippage_days = 0
    if planned_end and projected_end:
        try:
            d_planned = planned_end if isinstance(planned_end, (date, datetime)) else datetime.strptime(str(planned_end)[:10], "%Y-%m-%d").date()
            d_proj = projected_end if isinstance(projected_end, (date, datetime)) else datetime.strptime(str(projected_end)[:10], "%Y-%m-%d").date()
            slippage_days = max(0, (d_proj - d_planned).days)
        except Exception:
            slippage_days = 180 if status == "Delayed" else 0
    elif status == "Delayed":
        slippage_days = 180

    f_slip = min(100, int((slippage_days / 365.0) * 60))
    if status == "Delayed":
        f_slip = max(f_slip, 65)

    # 2. Historical Burn Pace
    spent_ratio = actual_cost / cost
    comp_ratio = max(0.05, completion / 100.0)
    burn_pace = spent_ratio / comp_ratio
    f_burn = 10
    if burn_pace > 1.0:
        f_burn = min(100, int((burn_pace - 1.0) * 85 + 20))
    elif completion < 20.0 and actual_cost > cost * 0.3:
        f_burn = 70

    # 3. Critical Path Strain
    proj_comps = [c for c in components if c.get("project_id") == project_id or not c.get("project_id")]
    has_pending_dep = False
    max_dep_depth = 0
    for c in proj_comps:
        dep = c.get("depends_on")
        if dep:
            max_dep_depth = max(max_dep_depth, 2)
            parent = next((p for p in proj_comps if p.get("component_id") == dep), None)
            if parent and float(parent.get("completion_pct") or 0.0) < 60.0:
                has_pending_dep = True
    f_cpath = min(100, max_dep_depth * 25 + (35 if has_pending_dep else 10))

    # 4. Agency Workload Stress
    f_agency = min(100, int((agency_active_count / 5.0) * 60 + 15))

    # 5. Citizen Friction
    proj_feedbacks = [f for f in feedbacks if f.get("project_id") == project_id]
    if proj_feedbacks:
        avg_rating = sum(float(f.get("rating", 3.0)) for f in proj_feedbacks) / len(proj_feedbacks)
    else:
        avg_rating = float(project_dict.get("average_rating") or 3.5)

    proj_issues = [i for i in civic_issues if i.get("project_id") == project_id and i.get("status") != "Remediated"]
    issue_upvotes = sum(int(i.get("upvotes") or 1) for i in proj_issues)

    rating_score = max(0.0, (5.0 - avg_rating) * 15.0)
    issue_score = min(50.0, len(proj_issues) * 12.0 + issue_upvotes * 2.0)
    f_cit = min(100, int(rating_score + issue_score))

    # Composite Score
    composite = min(100, max(5, int(
        f_slip * 0.28 +
        f_burn * 0.24 +
        f_cpath * 0.20 +
        f_agency * 0.14 +
        f_cit * 0.14
    )))

    if composite >= 70:
        risk_tier = "Critical"
    elif composite >= 40:
        risk_tier = "Elevated"
    else:
        risk_tier = "Low"

    if status == "Delayed":
        delay_prob = min(99, max(75, int(composite * 0.95 + 5)))
    else:
        delay_prob = min(95, max(5, int(composite * 0.88 + 4)))

    overrun_mult = 1.0
    if composite >= 40:
        overrun_mult += ((composite - 30) / 100.0) * 0.38

    forecasted_cost = round(cost * overrun_mult, 2)
    overrun_pct = round(((forecasted_cost - cost) / cost) * 100.0, 1)

    base_delay = slippage_days if slippage_days > 0 else (120 if status == "Delayed" else 0)
    pred_delay_days = int(base_delay + ((composite - 40) * 2.8 if composite > 40 else 0))

    top_drivers = []
    if f_slip >= 50:
        top_drivers.append(
            f"Timeline slippage: projected completion is {slippage_days} days behind DPP baseline."
            if slippage_days > 0 else "Status flagged as Delayed by municipal monitoring committee."
        )
    if f_burn >= 45:
        top_drivers.append(
            f"Budget burn pace: spent ৳{actual_cost:.1f} Cr ({int(spent_ratio*100)}%) against {completion}% physical completion."
        )
    if f_cpath >= 45:
        top_drivers.append(
            "Critical path dependency bottleneck: prerequisite component progress lagging under 60%."
            if has_pending_dep else "High component dependency density along structural execution path."
        )
    if f_cit >= 40:
        top_drivers.append(
            f"Elevated citizen friction: {len(proj_issues)} active hazard reports ({issue_upvotes} community upvotes)."
            if proj_issues else f"Below-average citizen satisfaction score ({avg_rating:.1f} / 5.0)."
        )
    if f_agency >= 55:
        top_drivers.append(f"Executing agency {exec_agency} is handling {agency_active_count} concurrent active projects.")

    if not top_drivers:
        top_drivers.append("Execution pacing is currently within planned fiscal and temporal limits.")

    return {
        "project_id": project_id,
        "name": name,
        "risk_score": composite,
        "risk_tier": risk_tier,
        "delay_probability_pct": delay_prob,
        "forecasted_final_cost": forecasted_cost,
        "forecasted_overrun_pct": overrun_pct,
        "predicted_delay_days": pred_delay_days,
        "top_risk_drivers": top_drivers[:3],
        "variance_factors": {
            "critical_path_strain": f_cpath,
            "agency_workload_stress": f_agency,
            "schedule_slippage": f_slip,
            "citizen_friction": f_cit,
            "historical_burn_pace": f_burn,
        }
    }
