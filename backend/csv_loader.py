import os
import glob
import json
import logging
from datetime import datetime, date
from typing import Dict, Any, List, Tuple
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import text

from models import (
    Base, Agency, UserType, Constraint, Project, Proposal, Component, IngestionAudit
)

logger = logging.getLogger(__name__)

def parse_date(date_str: Any) -> Optional[date]:
    if not date_str or pd.isna(date_str):
        return None
    date_str = str(date_str).strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None

def add_years_to_date(d: date, years: int) -> date:
    try:
        return d.replace(year=d.year + years)
    except ValueError:
        # Handle leap year Feb 29
        return d.replace(year=d.year + years, day=28)

def ingest_all_csvs(data_dir: str, db: Session) -> Dict[str, Any]:
    """
    Module A: Real CSV Ingestion & Bad Data Sanitization.
    Parses agencies.csv, user_types.csv, constraints.csv, projects.csv,
    proposals.csv, and components.csv from data_dir.
    Cleans malformed rows, validates foreign keys, logs bad rows,
    and returns a structured Ingestion Audit Report.
    """
    total_files = 0
    total_rows_read = 0
    total_rows_loaded = 0
    total_bad_rows = 0

    bad_rows_log: List[Dict[str, Any]] = []
    file_summary: Dict[str, Dict[str, int]] = {}

    # Ensure tables exist
    # 1. Ingest Agencies
    agencies_file = os.path.join(data_dir, "agencies.csv")
    valid_agencies = set()
    if os.path.exists(agencies_file):
        total_files += 1
        df_agencies = pd.read_csv(agencies_file).fillna("")
        file_rows_read = len(df_agencies)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_agencies.iterrows():
            row_num = idx + 2
            code = str(row.get("code", "")).strip()
            name = str(row.get("name", "")).strip()
            agency_type = str(row.get("type", "")).strip().upper()
            desc = str(row.get("description", "")).strip()

            if not code or not name:
                file_bad += 1
                bad_rows_log.append({
                    "file": "agencies.csv",
                    "row": row_num,
                    "reason": "Missing agency code or name",
                    "data": dict(row)
                })
                continue

            agency = db.query(Agency).filter_by(code=code).first()
            if not agency:
                agency = Agency(code=code, name=name, type=agency_type, description=desc)
                db.add(agency)
            else:
                agency.name = name
                agency.type = agency_type
                agency.description = desc
            valid_agencies.add(code)
            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["agencies.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }
    else:
        logger.warning(f"Agencies file not found at {agencies_file}")

    # 2. Ingest User Types
    user_types_file = os.path.join(data_dir, "user_types.csv")
    if os.path.exists(user_types_file):
        total_files += 1
        df_ut = pd.read_csv(user_types_file).fillna("")
        file_rows_read = len(df_ut)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_ut.iterrows():
            row_num = idx + 2
            code = str(row.get("code", "")).strip()
            committee = str(row.get("committee", "")).strip()
            desc = str(row.get("description", "")).strip()

            if not code or not committee:
                file_bad += 1
                bad_rows_log.append({
                    "file": "user_types.csv",
                    "row": row_num,
                    "reason": "Missing user type code or committee name",
                    "data": dict(row)
                })
                continue

            ut = db.query(UserType).filter_by(code=code).first()
            if not ut:
                ut = UserType(code=code, committee=committee, description=desc)
                db.add(ut)
            else:
                ut.committee = committee
                ut.description = desc
            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["user_types.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }

    # 3. Ingest Constraints
    constraints_file = os.path.join(data_dir, "constraints.csv")
    if os.path.exists(constraints_file):
        total_files += 1
        df_const = pd.read_csv(constraints_file).fillna("")
        file_rows_read = len(df_const)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_const.iterrows():
            row_num = idx + 2
            code = str(row.get("code", "")).strip()
            raw_limit = row.get("max_limit")
            c_type = str(row.get("constraint_type", "")).strip()

            try:
                max_limit = float(raw_limit)
                if max_limit < 0:
                    raise ValueError("Negative limit")
            except (ValueError, TypeError):
                file_bad += 1
                bad_rows_log.append({
                    "file": "constraints.csv",
                    "row": row_num,
                    "reason": f"Invalid max_limit: {raw_limit}",
                    "data": dict(row)
                })
                continue

            existing = db.query(Constraint).filter_by(code=code, constraint_type=c_type).first()
            if not existing:
                c = Constraint(code=code, max_limit=max_limit, constraint_type=c_type)
                db.add(c)
            else:
                existing.max_limit = max_limit
            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["constraints.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }

    # 4. Ingest Projects
    projects_file = os.path.join(data_dir, "projects.csv")
    valid_project_ids = set()
    if os.path.exists(projects_file):
        total_files += 1
        df_proj = pd.read_csv(projects_file).fillna("")
        file_rows_read = len(df_proj)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_proj.iterrows():
            row_num = idx + 2
            pid = str(row.get("project_id", "")).strip()
            name = str(row.get("name", "")).strip()
            loc = str(row.get("location", "")).strip()
            exec_agency = str(row.get("exec", "")).strip()
            start_date_parsed = parse_date(row.get("start_date"))

            # Validation checks
            if not pid or not name or not loc:
                file_bad += 1
                bad_rows_log.append({
                    "file": "projects.csv",
                    "row": row_num,
                    "reason": "Missing required project identifiers (project_id, name, or location)",
                    "data": dict(row)
                })
                continue

            if not start_date_parsed:
                file_bad += 1
                bad_rows_log.append({
                    "file": "projects.csv",
                    "row": row_num,
                    "reason": f"Malformed or missing start_date: {row.get('start_date')}",
                    "data": dict(row)
                })
                continue

            if exec_agency not in valid_agencies:
                file_bad += 1
                bad_rows_log.append({
                    "file": "projects.csv",
                    "row": row_num,
                    "reason": f"Orphaned agency reference '{exec_agency}' not in agencies.csv",
                    "data": dict(row)
                })
                continue

            try:
                lat = float(row.get("latitude", 0))
                lng = float(row.get("longitude", 0))
                cost = float(row.get("cost", 0))
                timespan = int(float(row.get("timespan", 1)))
                completion = float(row.get("completion", 0))
                actual_cost = float(row.get("actual_cost", 0))

                if cost < 0 or timespan <= 0 or completion < 0 or actual_cost < 0:
                    raise ValueError("Negative numbers not allowed in cost/timespan/completion")
            except (ValueError, TypeError) as ex:
                file_bad += 1
                bad_rows_log.append({
                    "file": "projects.csv",
                    "row": row_num,
                    "reason": f"Numeric parse error: {str(ex)}",
                    "data": dict(row)
                })
                continue

            planned_end = add_years_to_date(start_date_parsed, timespan)
            
            # Determine status
            if completion >= 100.0:
                status = "Completed"
            elif completion > 0.0:
                status = "Running"
            else:
                status = "Approved"

            existing_proj = db.query(Project).filter_by(project_id=pid).first()
            if not existing_proj:
                proj = Project(
                    project_id=pid,
                    name=name,
                    location=loc,
                    latitude=lat,
                    longitude=lng,
                    exec=exec_agency,
                    cost=cost,
                    timespan=timespan,
                    goal=str(row.get("goal", "")).strip(),
                    start_date=start_date_parsed,
                    completion=completion,
                    actual_cost=actual_cost,
                    planned_end_date=planned_end,
                    projected_end_date=planned_end,
                    status=status
                )
                db.add(proj)
            else:
                existing_proj.name = name
                existing_proj.location = loc
                existing_proj.latitude = lat
                existing_proj.longitude = lng
                existing_proj.exec = exec_agency
                existing_proj.cost = cost
                existing_proj.timespan = timespan
                existing_proj.goal = str(row.get("goal", "")).strip()
                existing_proj.start_date = start_date_parsed
                existing_proj.completion = completion
                existing_proj.actual_cost = actual_cost
                existing_proj.planned_end_date = planned_end

            valid_project_ids.add(pid)
            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["projects.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }

    # 5. Ingest Proposals
    proposals_file = os.path.join(data_dir, "proposals.csv")
    valid_proposal_ids = set()
    if os.path.exists(proposals_file):
        total_files += 1
        df_prop = pd.read_csv(proposals_file).fillna("")
        file_rows_read = len(df_prop)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_prop.iterrows():
            row_num = idx + 2
            # Note: in proposals.csv the id column is 'project_id' (e.g. 'prop3072')
            raw_id = str(row.get("project_id", "")).strip()
            name = str(row.get("name", "")).strip()
            loc = str(row.get("location", "")).strip()
            exec_agency = str(row.get("exec", "")).strip()
            prop_date_parsed = parse_date(row.get("proposal_date"))

            if not raw_id or not name:
                file_bad += 1
                bad_rows_log.append({
                    "file": "proposals.csv",
                    "row": row_num,
                    "reason": "Missing proposal ID or name",
                    "data": dict(row)
                })
                continue

            if not prop_date_parsed:
                file_bad += 1
                bad_rows_log.append({
                    "file": "proposals.csv",
                    "row": row_num,
                    "reason": f"Malformed or missing proposal_date: {row.get('proposal_date')}",
                    "data": dict(row)
                })
                continue

            if exec_agency not in valid_agencies:
                file_bad += 1
                bad_rows_log.append({
                    "file": "proposals.csv",
                    "row": row_num,
                    "reason": f"Orphaned agency reference '{exec_agency}' not in agencies.csv",
                    "data": dict(row)
                })
                continue

            try:
                lat = float(row.get("latitude", 0))
                lng = float(row.get("longitude", 0))
                cost = float(row.get("cost", 0))
                timespan = int(float(row.get("timespan", 1)))
                if cost < 0 or timespan <= 0:
                    raise ValueError("Cost or timespan cannot be negative/zero")
            except (ValueError, TypeError) as ex:
                file_bad += 1
                bad_rows_log.append({
                    "file": "proposals.csv",
                    "row": row_num,
                    "reason": f"Numeric parse error: {str(ex)}",
                    "data": dict(row)
                })
                continue

            # Authority tagging rule: <= 50 Crore Tk -> MOP, > 50 Crore Tk -> ECNEC
            approving_auth = "MOP" if cost <= 50.0 else "ECNEC"

            existing_prop = db.query(Proposal).filter_by(proposal_id=raw_id).first()
            if not existing_prop:
                prop = Proposal(
                    proposal_id=raw_id,
                    name=name,
                    location=loc,
                    latitude=lat,
                    longitude=lng,
                    exec=exec_agency,
                    cost=cost,
                    timespan=timespan,
                    goal=str(row.get("goal", "")).strip(),
                    proposal_date=prop_date_parsed,
                    status="Pending",
                    approving_authority=approving_auth
                )
                db.add(prop)
            else:
                existing_prop.name = name
                existing_prop.location = loc
                existing_prop.latitude = lat
                existing_prop.longitude = lng
                existing_prop.exec = exec_agency
                existing_prop.cost = cost
                existing_prop.timespan = timespan
                existing_prop.goal = str(row.get("goal", "")).strip()
                existing_prop.proposal_date = prop_date_parsed
                existing_prop.approving_authority = approving_auth

            valid_proposal_ids.add(raw_id)
            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["proposals.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }

    # 6. Ingest Components
    components_file = os.path.join(data_dir, "components.csv")
    if os.path.exists(components_file):
        total_files += 1
        df_comp = pd.read_csv(components_file).fillna("")
        file_rows_read = len(df_comp)
        file_loaded = 0
        file_bad = 0
        total_rows_read += file_rows_read

        for idx, row in df_comp.iterrows():
            row_num = idx + 2
            cid = str(row.get("component_id", "")).strip()
            pid = str(row.get("project_id", "")).strip()
            # Handle typo in header: 'ececuting_agency'
            exec_agency = str(row.get("ececuting_agency", "")).strip()
            comp_type = str(row.get("component_type", "")).strip()
            depends_on = str(row.get("depends_on", "")).strip()
            raw_ratio = row.get("budget ratio", 0.5)

            if not cid or not pid:
                file_bad += 1
                bad_rows_log.append({
                    "file": "components.csv",
                    "row": row_num,
                    "reason": "Missing component_id or project_id",
                    "data": dict(row)
                })
                continue

            try:
                budget_ratio = float(raw_ratio)
                if budget_ratio < 0 or budget_ratio > 1.0:
                    raise ValueError("Budget ratio must be between 0 and 1")
            except (ValueError, TypeError):
                file_bad += 1
                bad_rows_log.append({
                    "file": "components.csv",
                    "row": row_num,
                    "reason": f"Invalid budget ratio: {raw_ratio}",
                    "data": dict(row)
                })
                continue

            # Check foreign key: Does pid link to a Project or a Proposal?
            proj_ref = None
            prop_ref = None
            if pid in valid_project_ids:
                proj_ref = pid
            elif pid in valid_proposal_ids:
                prop_ref = pid
            else:
                file_bad += 1
                bad_rows_log.append({
                    "file": "components.csv",
                    "row": row_num,
                    "reason": f"Orphaned project_id '{pid}' not found in projects.csv or proposals.csv",
                    "data": dict(row)
                })
                continue

            # Calculate allocated cost if linked to project or proposal
            parent_cost = 0.0
            parent_start = None
            parent_timespan = 1
            if proj_ref:
                p = db.query(Project).filter_by(project_id=proj_ref).first()
                if p:
                    parent_cost = p.cost
                    parent_start = p.start_date
                    parent_timespan = p.timespan
            elif prop_ref:
                p = db.query(Proposal).filter_by(proposal_id=prop_ref).first()
                if p:
                    parent_cost = p.cost
                    parent_start = p.proposal_date
                    parent_timespan = p.timespan

            allocated_cost = round(parent_cost * budget_ratio, 4)

            existing_comp = db.query(Component).filter_by(component_id=cid).first()
            if not existing_comp:
                comp = Component(
                    component_id=cid,
                    project_id=proj_ref,
                    proposal_id=prop_ref,
                    ececuting_agency=exec_agency,
                    component_type=comp_type,
                    depends_on=depends_on if depends_on else None,
                    budget_ratio=budget_ratio,
                    allocated_cost=allocated_cost,
                    completion_pct=0.0,
                    spent_cost=0.0,
                    planned_start_date=parent_start,
                    planned_end_date=add_years_to_date(parent_start, parent_timespan) if parent_start else None,
                    status="Pending"
                )
                db.add(comp)
            else:
                existing_comp.project_id = proj_ref
                existing_comp.proposal_id = prop_ref
                existing_comp.ececuting_agency = exec_agency
                existing_comp.component_type = comp_type
                existing_comp.depends_on = depends_on if depends_on else None
                existing_comp.budget_ratio = budget_ratio
                existing_comp.allocated_cost = allocated_cost

            file_loaded += 1

        db.commit()
        total_rows_loaded += file_loaded
        total_bad_rows += file_bad
        file_summary["components.csv"] = {
            "read": file_rows_read, "loaded": file_loaded, "bad": file_bad
        }

    # Record Ingestion Audit report
    audit = IngestionAudit(
        total_files=total_files,
        total_rows_read=total_rows_read,
        total_rows_loaded=total_rows_loaded,
        total_bad_rows=total_bad_rows,
        summary_json=json.dumps(file_summary),
        bad_rows_log=json.dumps(bad_rows_log)
    )
    db.add(audit)
    db.commit()

    report = {
        "audit_id": audit.id,
        "timestamp": audit.timestamp.isoformat(),
        "total_files": total_files,
        "total_rows_read": total_rows_read,
        "total_rows_loaded": total_rows_loaded,
        "total_bad_rows": total_bad_rows,
        "file_summary": file_summary,
        "bad_rows_log": bad_rows_log
    }

    logger.info(f"Ingestion complete: {total_rows_loaded} rows loaded, {total_bad_rows} bad rows.")
    return report
