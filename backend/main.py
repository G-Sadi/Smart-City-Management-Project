import os
import sys
import json
import logging
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
import io
import csv
import time
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy import create_engine, func, or_
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

from models import (
    Base, Agency, UserType, Constraint, Project, Proposal, Component, CitizenFeedback, IngestionAudit
)
from schemas import (
    LoginRequest, TokenResponse, UserOut,
    ProjectOut, ProjectDetailOut, ProjectProgressUpdate,
    ProposalOut, ProposalCreate, ProposalApproveRequest, ProposalRejectRequest, TimeframeSuggestionOut,
    ComponentOut, ComponentProgressUpdate,
    AgencyOut, ConstraintOut, ConstraintCreate,
    CitizenFeedbackCreate, CitizenFeedbackOut,
    IngestionAuditOut, AIAdvisorRequest, AIAdvisorResponse
)
from csv_loader import ingest_all_csvs
from scheduler_engine import RCPSPScheduler
from ai_service import generate_ai_advisor_response

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smart_city_api")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smart_city.db")
SECRET_KEY = os.getenv("SECRET_KEY", "smart-city-planning-secret-key-2026-super-secure")
ALGORITHM = "HS256"
# Determine DATA_DIR reliably
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_DIR = os.getenv("DATA_DIR")
if not DATA_DIR or not os.path.exists(DATA_DIR):
    possible_paths = [
        os.path.join(PROJECT_ROOT, "data"),
        os.path.join(BASE_DIR, "data"),
        "data",
        "../data"
    ]
    for p in possible_paths:
        if os.path.exists(p) and os.path.isdir(p):
            DATA_DIR = os.path.abspath(p)
            break
if not DATA_DIR:
    DATA_DIR = os.path.join(PROJECT_ROOT, "data")
logger.info(f"Resolved DATA_DIR: {DATA_DIR}")

# Create Database Engine
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CivicGrid — Smart City Infrastructure Planning & Monitoring API",
    description="Backend API for CivicGrid Public Infrastructure Planning, RCPSP Scheduling & GIS Monitoring System",
    version="2.0.0"
)

# CORS Setup
origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in origins_env.split(",")] if origins_env != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    if not token:
        # Default public guest access
        return {"username": "guest", "role": "APP", "committee": "Citizen Public User", "agency": None}
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return {"username": "guest", "role": "APP", "committee": "Citizen Public User", "agency": None}

class DBWatcherHandler(FileSystemEventHandler):
    last_trigger = 0.0

    def on_modified(self, event):
        # Watch both database file and data directory
        if "smart_city.db" in event.src_path or event.src_path.endswith(".csv"):
            now = time.time()
            if now - self.last_trigger > 3.0:  # 3-second debounce
                self.last_trigger = now
                logger.info(f"File Watcher detected change in {event.src_path}. Synchronizing & recalculating schedules...")
                try:
                    db = SessionLocal()
                    scheduler = RCPSPScheduler(db)
                    scheduler.recalculate_all_schedules()
                    db.close()
                    logger.info("Background recalculation completed successfully.")
                except Exception as ex:
                    logger.error(f"Error in File Watcher recalculation: {ex}")

file_observer = None

def start_file_watcher():
    global file_observer
    try:
        handler = DBWatcherHandler()
        file_observer = Observer()
        # Watch backend dir for sqlite db changes
        file_observer.schedule(handler, path=os.path.dirname(os.path.abspath(__file__)), recursive=False)
        # Watch data dir for CSV modifications
        if os.path.exists(DATA_DIR):
            file_observer.schedule(handler, path=DATA_DIR, recursive=False)
        file_observer.start()
        logger.info("Live Database & CSV File Watcher active.")
    except Exception as e:
        logger.warning(f"Could not start File Watcher: {e}")

# ----------------- Startup Lifecycle -----------------
@app.on_event("startup")
def startup_event():
    """Initializes and seeds database from actual CSVs if not already populated."""
    db = SessionLocal()
    try:
        proj_count = db.query(Project).count()
        if proj_count == 0:
            logger.info("Database is empty. Initiating initial CSV ingestion from /data...")
            actual_data_path = "data" if os.path.exists("data") else os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
            report = ingest_all_csvs(actual_data_path, db)
            logger.info(f"Initial ingestion finished: {report['total_rows_loaded']} rows loaded.")
            # Run initial schedule calculation
            scheduler = RCPSPScheduler(db)
            scheduler.recalculate_all_schedules()
            logger.info("Initial RCPSP schedule recalculation complete.")
        else:
            logger.info(f"Database contains {proj_count} existing projects. Ready.")
        
        # Start watcher
        start_file_watcher()
    except Exception as e:
        logger.error(f"Error during startup data initialization: {e}", exc_info=True)
    finally:
        db.close()

@app.on_event("shutdown")
def shutdown_event():
    global file_observer
    if file_observer:
        try:
            file_observer.stop()
            file_observer.join(timeout=2)
            logger.info("File Watcher stopped cleanly.")
        except Exception:
            pass

# ----------------- Auth Endpoints -----------------
DEMO_USERS = {
    "admin": {"username": "admin", "role": "SYSADMIN", "committee": "System Admin", "agency": None},
    "ecnec_officer": {"username": "ecnec_officer", "role": "ECNEC", "committee": "Executive Committee of the National Economic Council", "agency": None},
    "mop_officer": {"username": "mop_officer", "role": "MOP", "committee": "Ministry of Planning", "agency": None},
    "lgd_officer": {"username": "lgd_officer", "role": "EXEC", "committee": "Local Government Division", "agency": "LGD"},
    "moedu_officer": {"username": "moedu_officer", "role": "EXEC", "committee": "Ministry of Education", "agency": "MOEDU"},
    "pwd_officer": {"username": "pwd_officer", "role": "EXEC", "committee": "Bangladesh Public Works Department", "agency": "PWD"},
    "citizen": {"username": "citizen", "role": "APP", "committee": "Citizen Application User", "agency": None},
}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(creds: LoginRequest):
    uname = creds.username.lower().strip()
    user_info = DEMO_USERS.get(uname)
    if not user_info:
        # Fallback dynamic user
        role = creds.role or "APP"
        user_info = {
            "username": creds.username,
            "role": role,
            "committee": f"{role} User Group",
            "agency": creds.agency
        }

    token = create_access_token(user_info)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(**user_info)
    )

@app.post("/api/auth/quick-login", response_model=TokenResponse)
def quick_login(role_type: str = Query(..., description="SYSADMIN, ECNEC, MOP, EXEC_LGD, EXEC_MOEDU, EXEC_PWD, APP")):
    role_map = {
        "SYSADMIN": "admin",
        "ECNEC": "ecnec_officer",
        "MOP": "mop_officer",
        "EXEC_LGD": "lgd_officer",
        "EXEC_MOEDU": "moedu_officer",
        "EXEC_PWD": "pwd_officer",
        "APP": "citizen",
        "CITIZEN": "citizen"
    }
    user_key = role_map.get(role_type, "citizen")
    user_info = DEMO_USERS.get(user_key)
    token = create_access_token(user_info)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(**user_info)
    )

@app.get("/api/auth/me", response_model=UserOut)
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return UserOut(
        username=user.get("username", "guest"),
        role=user.get("role", "APP"),
        committee=user.get("committee"),
        agency=user.get("agency")
    )

# ----------------- Projects Endpoints -----------------
@app.get("/api/projects", response_model=List[ProjectOut])
def list_projects(
    location: Optional[str] = None,
    agency: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)

    if location:
        query = query.filter(Project.location.ilike(f"%{location}%"))
    if agency:
        query = query.filter(Project.exec == agency)
    if status_filter:
        query = query.filter(Project.status == status_filter)
    if search:
        s = f"%{search}%"
        query = query.filter(or_(Project.name.ilike(s), Project.goal.ilike(s), Project.location.ilike(s), Project.project_id.ilike(s)))

    projects = query.all()
    results = []

    for p in projects:
        # compute average rating
        f_query = db.query(
            func.avg(CitizenFeedback.rating),
            func.count(CitizenFeedback.id)
        ).filter(CitizenFeedback.project_id == p.project_id).first()

        avg_r = round(float(f_query[0]), 1) if f_query and f_query[0] is not None else None
        f_cnt = int(f_query[1]) if f_query else 0

        if min_rating is not None and (avg_r is None or avg_r < min_rating):
            continue

        p_dict = {
            "project_id": p.project_id,
            "name": p.name,
            "location": p.location,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "exec": p.exec,
            "cost": p.cost,
            "timespan": p.timespan,
            "goal": p.goal,
            "start_date": p.start_date,
            "completion": p.completion,
            "actual_cost": p.actual_cost,
            "planned_end_date": p.planned_end_date,
            "projected_end_date": p.projected_end_date,
            "status": p.status,
            "average_rating": avg_r,
            "feedback_count": f_cnt
        }
        results.append(ProjectOut(**p_dict))

    return results

@app.get("/api/projects/{project_id}", response_model=ProjectDetailOut)
def get_project_detail(project_id: str, db: Session = Depends(get_db)):
    proj = db.query(Project).filter_by(project_id=project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    comps = db.query(Component).filter_by(project_id=project_id).all()
    feedbacks = db.query(CitizenFeedback).filter_by(project_id=project_id).order_by(CitizenFeedback.created_at.desc()).all()

    f_query = db.query(func.avg(CitizenFeedback.rating), func.count(CitizenFeedback.id)).filter(CitizenFeedback.project_id == project_id).first()
    avg_r = round(float(f_query[0]), 1) if f_query and f_query[0] is not None else None
    f_cnt = int(f_query[1]) if f_query else 0

    return ProjectDetailOut(
        project_id=proj.project_id,
        name=proj.name,
        location=proj.location,
        latitude=proj.latitude,
        longitude=proj.longitude,
        exec=proj.exec,
        cost=proj.cost,
        timespan=proj.timespan,
        goal=proj.goal,
        start_date=proj.start_date,
        completion=proj.completion,
        actual_cost=proj.actual_cost,
        planned_end_date=proj.planned_end_date,
        projected_end_date=proj.projected_end_date,
        status=proj.status,
        average_rating=avg_r,
        feedback_count=f_cnt,
        components=[ComponentOut.model_validate(c) for c in comps],
        feedbacks=[CitizenFeedbackOut.model_validate(f) for f in feedbacks]
    )

@app.put("/api/projects/{project_id}/progress", response_model=ProjectDetailOut)
def update_project_progress(
    project_id: str,
    update_data: ProjectProgressUpdate,
    db: Session = Depends(get_db)
):
    """
    Module D: Dynamic Progress Reporting & Real-Time Recalculation.
    Recalculates remaining component duration dynamically:
      Remaining_Duration = Original_Duration * ((100 - Current_Completion_Pct) / 100)
    Cascades revised dates to all downstream dependent components.
    """
    proj = db.query(Project).filter_by(project_id=project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    comps = db.query(Component).filter_by(project_id=project_id).all()

    if update_data.component_updates:
        comp_map = {c.component_id: c for c in comps}
        for cu in update_data.component_updates:
            c = comp_map.get(cu.component_id)
            if c:
                c.completion_pct = cu.completion_pct
                if cu.spent_cost is not None:
                    c.spent_cost = cu.spent_cost
                else:
                    c.spent_cost = round((c.allocated_cost or (proj.cost * c.budget_ratio)) * (cu.completion_pct / 100.0), 4)
    else:
        # Uniformly apply to components
        for c in comps:
            c.completion_pct = update_data.completion
            c.spent_cost = round((c.allocated_cost or (proj.cost * c.budget_ratio)) * (update_data.completion / 100.0), 4)

    proj.completion = update_data.completion
    if update_data.actual_cost is not None:
        proj.actual_cost = update_data.actual_cost
    else:
        proj.actual_cost = sum(c.spent_cost for c in comps)

    db.commit()

    # Trigger RCPSP dynamic recalculation
    scheduler = RCPSPScheduler(db)
    scheduler.recalculate_all_schedules()

    return get_project_detail(project_id, db)

@app.post("/api/projects/{project_id}/feedback", response_model=CitizenFeedbackOut)
def submit_citizen_feedback(
    project_id: str,
    feedback: CitizenFeedbackCreate,
    db: Session = Depends(get_db)
):
    proj = db.query(Project).filter_by(project_id=project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    fb = CitizenFeedback(
        project_id=project_id,
        citizen_name=feedback.citizen_name or "Civic Observer",
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return CitizenFeedbackOut.model_validate(fb)

# ----------------- Proposals Endpoints -----------------
@app.get("/api/proposals", response_model=List[ProposalOut])
def list_proposals(
    authority: Optional[str] = None,  # 'ECNEC' or 'MOP'
    agency: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Proposal)
    if authority:
        query = query.filter(Proposal.approving_authority == authority.upper())
    if agency:
        query = query.filter(Proposal.exec == agency)
    if status_filter:
        query = query.filter(Proposal.status == status_filter)

    proposals = query.order_by(Proposal.proposal_date.desc()).all()
    results = []
    for p in proposals:
        comps = db.query(Component).filter_by(proposal_id=p.proposal_id).all()
        p_dict = {
            "proposal_id": p.proposal_id,
            "name": p.name,
            "location": p.location,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "exec": p.exec,
            "cost": p.cost,
            "timespan": p.timespan,
            "goal": p.goal,
            "proposal_date": p.proposal_date,
            "status": p.status,
            "approving_authority": p.approving_authority,
            "suggested_start_date": p.suggested_start_date,
            "suggested_end_date": p.suggested_end_date,
            "review_notes": p.review_notes,
            "components": [ComponentOut.model_validate(c) for c in comps]
        }
        results.append(ProposalOut(**p_dict))
    return results

@app.post("/api/proposals/suggest-timeframe", response_model=TimeframeSuggestionOut)
def suggest_timeframe(
    cost: float = Query(..., ge=0.1),
    timespan: int = Query(..., ge=1, le=10),
    exec_agency: str = Query(...),
    location: str = Query(...),
    dependency_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    scheduler = RCPSPScheduler(db)
    deps = [dependency_id] if dependency_id else None
    res = scheduler.suggest_optimal_timeframe(
        cost=cost,
        timespan_years=timespan,
        exec_agency=exec_agency,
        location=location,
        dependencies=deps
    )
    return TimeframeSuggestionOut(**res)

@app.post("/api/proposals", response_model=ProposalOut)
def create_proposal(
    prop_in: ProposalCreate,
    db: Session = Depends(get_db)
):
    import uuid
    # Generate unique proposal id
    new_id = f"prop_{uuid.uuid4().hex[:8]}"
    while db.query(Proposal).filter_by(proposal_id=new_id).first():
        new_id = f"prop_{uuid.uuid4().hex[:8]}"

    # Determine authority
    auth = "MOP" if prop_in.cost <= 50.0 else "ECNEC"

    # Compute suggested timeframe
    scheduler = RCPSPScheduler(db)
    tf = scheduler.suggest_optimal_timeframe(
        cost=prop_in.cost,
        timespan_years=prop_in.timespan,
        exec_agency=prop_in.exec,
        location=prop_in.location
    )

    prop = Proposal(
        proposal_id=new_id,
        name=prop_in.name,
        location=prop_in.location,
        latitude=prop_in.latitude,
        longitude=prop_in.longitude,
        exec=prop_in.exec,
        cost=prop_in.cost,
        timespan=prop_in.timespan,
        goal=prop_in.goal,
        proposal_date=prop_in.proposal_date or date.today(),
        status="Pending",
        approving_authority=auth,
        suggested_start_date=tf["optimal_start_date"],
        suggested_end_date=tf["optimal_end_date"],
        review_notes=f"Auto-analyzed optimal start: {tf['optimal_start_date']}. {tf['earliest_available_slot_reason']}"
    )
    db.add(prop)
    db.commit()

    # Create components with guaranteed unique IDs
    comp_inputs = prop_in.components or [
        {"component_type": "goods", "budget_ratio": 0.4, "depends_on": None},
        {"component_type": "works", "budget_ratio": 0.6, "depends_on": None}
    ]

    created_comps = []
    for c_in in comp_inputs:
        cid = f"comp_{uuid.uuid4().hex[:8]}"
        while db.query(Component).filter_by(component_id=cid).first():
            cid = f"comp_{uuid.uuid4().hex[:8]}"
        c_type = getattr(c_in, "component_type", None) or c_in.get("component_type", "works")
        ratio = getattr(c_in, "budget_ratio", None) or c_in.get("budget_ratio", 0.5)
        dep = getattr(c_in, "depends_on", None) or c_in.get("depends_on")
        comp = Component(
            component_id=cid,
            proposal_id=new_id,
            ececuting_agency=prop_in.exec,
            component_type=c_type,
            depends_on=dep,
            budget_ratio=ratio,
            allocated_cost=round(prop_in.cost * ratio, 4),
            status="Pending"
        )
        db.add(comp)
        created_comps.append(comp)

    db.commit()

    return ProposalOut(
        proposal_id=prop.proposal_id,
        name=prop.name,
        location=prop.location,
        latitude=prop.latitude,
        longitude=prop.longitude,
        exec=prop.exec,
        cost=prop.cost,
        timespan=prop.timespan,
        goal=prop.goal,
        proposal_date=prop.proposal_date,
        status=prop.status,
        approving_authority=prop.approving_authority,
        suggested_start_date=prop.suggested_start_date,
        suggested_end_date=prop.suggested_end_date,
        review_notes=prop.review_notes,
        components=[ComponentOut.model_validate(c) for c in created_comps]
    )

@app.post("/api/proposals/{proposal_id}/approve", response_model=Dict[str, Any])
def approve_proposal(
    proposal_id: str,
    req: ProposalApproveRequest,
    db: Session = Depends(get_db)
):
    prop = db.query(Proposal).filter_by(proposal_id=proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    prop.status = "Approved"
    prop.approved_at = datetime.utcnow()
    prop.review_notes = req.review_notes

    # Convert Proposal to active Project
    new_pid = prop.proposal_id.replace("prop", "proj")
    start_d = req.approved_start_date or prop.suggested_start_date or date.today()
    planned_end = prop.suggested_end_date or (start_d + timedelta(days=prop.timespan * 365))

    existing_proj = db.query(Project).filter_by(project_id=new_pid).first()
    if not existing_proj:
        proj = Project(
            project_id=new_pid,
            name=prop.name,
            location=prop.location,
            latitude=prop.latitude,
            longitude=prop.longitude,
            exec=prop.exec,
            cost=prop.cost,
            timespan=prop.timespan,
            goal=prop.goal,
            start_date=start_d,
            completion=0.0,
            actual_cost=0.0,
            planned_end_date=planned_end,
            projected_end_date=planned_end,
            status="Approved"
        )
        db.add(proj)

        # Move components
        comps = db.query(Component).filter_by(proposal_id=prop.proposal_id).all()
        for c in comps:
            c.project_id = new_pid
            c.status = "Approved"

    db.commit()

    # Recalculate schedule
    scheduler = RCPSPScheduler(db)
    recalc = scheduler.recalculate_all_schedules()

    return {
        "message": f"Proposal {proposal_id} approved successfully and transitioned to project {new_pid}.",
        "project_id": new_pid,
        "schedule_status": recalc
    }

@app.post("/api/proposals/{proposal_id}/reject", response_model=Dict[str, Any])
def reject_proposal(
    proposal_id: str,
    req: ProposalRejectRequest,
    db: Session = Depends(get_db)
):
    prop = db.query(Proposal).filter_by(proposal_id=proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    prop.status = "Rejected"
    prop.review_notes = req.rejection_reason
    db.commit()
    return {"message": f"Proposal {proposal_id} rejected.", "reason": req.rejection_reason}

# ----------------- Components Endpoints -----------------
@app.get("/api/components", response_model=List[ComponentOut])
def list_components(
    agency: Optional[str] = None,
    project_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Component)
    if agency:
        query = query.filter(Component.ececuting_agency == agency)
    if project_id:
        query = query.filter(Component.project_id == project_id)
    if status_filter:
        query = query.filter(Component.status == status_filter)

    comps = query.all()
    return [ComponentOut.model_validate(c) for c in comps]

@app.put("/api/components/{component_id}/progress", response_model=ComponentOut)
def update_single_component_progress(
    component_id: str,
    update_data: ComponentProgressUpdate,
    db: Session = Depends(get_db)
):
    comp = db.query(Component).filter_by(component_id=component_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")

    comp.completion_pct = update_data.completion_pct
    if update_data.spent_cost is not None:
        comp.spent_cost = update_data.spent_cost
    else:
        comp.spent_cost = round((comp.allocated_cost or 0.0) * (update_data.completion_pct / 100.0), 4)

    db.commit()

    # Dynamic cascade recalculation
    scheduler = RCPSPScheduler(db)
    scheduler.recalculate_all_schedules()

    db.refresh(comp)
    return ComponentOut.model_validate(comp)

# ----------------- Agencies & Constraints CRUD -----------------
@app.get("/api/agencies", response_model=List[AgencyOut])
def list_agencies(db: Session = Depends(get_db)):
    agencies = db.query(Agency).all()
    results = []
    for a in agencies:
        active_p = db.query(Project).filter(Project.exec == a.code, Project.status.in_(["Running", "Approved", "Delayed"])).count()
        active_c = db.query(Component).filter(Component.ececuting_agency == a.code, Component.status.in_(["Running", "Approved", "Delayed"])).count()
        budget = db.query(func.sum(Project.cost)).filter(Project.exec == a.code).scalar() or 0.0
        results.append(AgencyOut(
            code=a.code,
            name=a.name,
            type=a.type,
            description=a.description,
            active_projects_count=active_p,
            active_components_count=active_c,
            total_budget_allocated=round(float(budget), 2)
        ))
    return results

@app.get("/api/constraints", response_model=List[ConstraintOut])
def list_constraints(db: Session = Depends(get_db)):
    constraints = db.query(Constraint).all()
    return [ConstraintOut.model_validate(c) for c in constraints]

@app.post("/api/constraints", response_model=ConstraintOut)
def create_constraint(c_in: ConstraintCreate, db: Session = Depends(get_db)):
    c = Constraint(
        code=c_in.code,
        max_limit=c_in.max_limit,
        constraint_type=c_in.constraint_type,
        start_date=c_in.start_date,
        end_date=c_in.end_date,
        description=c_in.description
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    # Recalculate schedule under new constraints
    scheduler = RCPSPScheduler(db)
    scheduler.recalculate_all_schedules()
    return ConstraintOut.model_validate(c)

@app.delete("/api/constraints/{constraint_id}")
def delete_constraint(constraint_id: int, db: Session = Depends(get_db)):
    c = db.query(Constraint).filter_by(id=constraint_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Constraint not found")
    db.delete(c)
    db.commit()
    # Recalculate
    scheduler = RCPSPScheduler(db)
    scheduler.recalculate_all_schedules()
    return {"message": "Constraint deleted and schedule recalculated."}

# ----------------- Database Sync & Recalculate Button -----------------
@app.post("/api/sync-recalculate")
def sync_and_recalculate(db: Session = Depends(get_db)):
    """Manual 'Sync & Recalculate DB' endpoint for immediate recalculation across all timelines."""
    scheduler = RCPSPScheduler(db)
    res = scheduler.recalculate_all_schedules()
    bottlenecks = scheduler.analyze_bottlenecks()
    return {
        "status": "success",
        "message": "Database and RCPSP schedules synchronized successfully.",
        "details": res,
        "bottlenecks": bottlenecks
    }

# ----------------- Ingestion & Audit -----------------
@app.post("/api/ingest-csv")
def reingest_csvs(db: Session = Depends(get_db)):
    """Triggers ingestion of CSVs from /data, validates records, generates sanitization audit."""
    actual_data_path = "data" if os.path.exists("data") else os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    report = ingest_all_csvs(actual_data_path, db)
    scheduler = RCPSPScheduler(db)
    scheduler.recalculate_all_schedules()
    return report

@app.get("/api/audit-report", response_model=List[Dict[str, Any]])
def get_audit_reports(db: Session = Depends(get_db)):
    audits = db.query(IngestionAudit).order_by(IngestionAudit.timestamp.desc()).limit(10).all()
    results = []
    for a in audits:
        results.append({
            "id": a.id,
            "timestamp": a.timestamp.isoformat(),
            "total_files": a.total_files,
            "total_rows_read": a.total_rows_read,
            "total_rows_loaded": a.total_rows_loaded,
            "total_bad_rows": a.total_bad_rows,
            "summary": json.loads(a.summary_json or "{}"),
            "bad_rows": json.loads(a.bad_rows_log or "[]")
        })
    return results

# ----------------- AI Copilot Module -----------------
@app.post("/api/ai-advisor", response_model=AIAdvisorResponse)
def ai_advisor(req: AIAdvisorRequest, db: Session = Depends(get_db)):
    res = generate_ai_advisor_response(
        query_type=req.query_type,
        db=db,
        project_id=req.project_id,
        proposal_id=req.proposal_id,
        user_prompt=req.user_prompt
    )
    return AIAdvisorResponse(**res)

# ----------------- Analytics & Dashboards -----------------
@app.get("/api/analytics/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()
    total_proposals = db.query(Proposal).count()
    pending_proposals = db.query(Proposal).filter_by(status="Pending").count()
    approved_proposals = db.query(Proposal).filter_by(status="Approved").count()

    total_budget = db.query(func.sum(Project.cost)).scalar() or 0.0
    actual_spent = db.query(func.sum(Project.actual_cost)).scalar() or 0.0

    avg_comp = db.query(func.avg(Project.completion)).scalar() or 0.0

    running_count = db.query(Project).filter_by(status="Running").count()
    delayed_count = db.query(Project).filter_by(status="Delayed").count()
    completed_count = db.query(Project).filter_by(status="Completed").count()

    active_comps = db.query(Component).filter(Component.project_id.isnot(None), Component.status.in_(["Running", "Approved", "Delayed"])).count()

    # Average citizen rating
    avg_rating = db.query(func.avg(CitizenFeedback.rating)).scalar() or 0.0
    total_feedbacks = db.query(CitizenFeedback).count()

    return {
        "total_projects": total_projects,
        "total_proposals": total_proposals,
        "pending_proposals": pending_proposals,
        "approved_proposals": approved_proposals,
        "total_budget_cr_tk": round(float(total_budget), 2),
        "actual_spent_cr_tk": round(float(actual_spent), 2),
        "average_completion_pct": round(float(avg_comp), 2),
        "running_projects": running_count,
        "delayed_projects": delayed_count,
        "completed_projects": completed_count,
        "active_components": active_comps,
        "average_rating": round(float(avg_rating), 1),
        "total_feedbacks": total_feedbacks
    }

@app.get("/api/analytics/planned-vs-projected")
def get_planned_vs_projected(db: Session = Depends(get_db)):
    """Provides time-series aggregation for Planned vs Projected Timeline & Budget in Recharts."""
    projects = db.query(Project).all()
    yearly_data: Dict[int, Dict[str, float]] = {}

    for p in projects:
        start_year = p.start_date.year
        planned_end_year = p.planned_end_date.year if p.planned_end_date else (start_year + p.timespan)
        projected_end_year = p.projected_end_date.year if p.projected_end_date else planned_end_year

        min_y = min(start_year, 2021)
        max_y = max(projected_end_year, 2028)

        # Distribute annual cost
        annual_cost = p.cost / max(1, p.timespan)
        actual_annual = p.actual_cost / max(1, p.timespan)

        for y in range(start_year, planned_end_year + 1):
            if y not in yearly_data:
                yearly_data[y] = {"year": y, "planned_budget": 0.0, "projected_budget": 0.0, "actual_spent": 0.0, "active_projects": 0}
            yearly_data[y]["planned_budget"] += annual_cost

        for y in range(start_year, projected_end_year + 1):
            if y not in yearly_data:
                yearly_data[y] = {"year": y, "planned_budget": 0.0, "projected_budget": 0.0, "actual_spent": 0.0, "active_projects": 0}
            yearly_data[y]["projected_budget"] += annual_cost
            yearly_data[y]["active_projects"] += 1

        for y in range(start_year, min(datetime.now().year + 1, planned_end_year + 1)):
            if y in yearly_data:
                yearly_data[y]["actual_spent"] += actual_annual

    chart_series = []
    for y in sorted(yearly_data.keys()):
        item = yearly_data[y]
        chart_series.append({
            "year": str(y),
            "planned_budget": round(item["planned_budget"], 2),
            "projected_budget": round(item["projected_budget"], 2),
            "actual_spent": round(item["actual_spent"], 2),
            "active_projects": int(item["active_projects"])
        })

    return chart_series

@app.get("/api/analytics/location-distribution")
def get_location_distribution(db: Session = Depends(get_db)):
    locs = db.query(
        Project.location,
        func.count(Project.project_id).label("project_count"),
        func.sum(Project.cost).label("total_cost"),
        func.avg(Project.completion).label("avg_completion")
    ).group_by(Project.location).all()

    scheduler = RCPSPScheduler(db)

    results = []
    for l in locs:
        limit = scheduler.get_location_limit(l[0])
        results.append({
            "location": l[0],
            "project_count": l[1],
            "total_budget": round(float(l[2] or 0), 2),
            "avg_completion": round(float(l[3] or 0), 1),
            "limit": limit
        })
    return sorted(results, key=lambda x: x["total_budget"], reverse=True)

# ----------------- Export CSV / JSON -----------------
@app.get("/api/projects/export/csv")
def export_projects_csv(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Project ID", "Name", "Location", "Agency", "Cost (Cr Tk)", "Timespan (Yrs)",
        "Start Date", "Planned End Date", "Projected End Date", "Completion %",
        "Actual Cost (Cr Tk)", "Status", "Goal"
    ])
    for p in projects:
        writer.writerow([
            p.project_id, p.name, p.location, p.exec, p.cost, p.timespan,
            p.start_date, p.planned_end_date, p.projected_end_date, p.completion,
            p.actual_cost, p.status, p.goal
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=civicgrid_revised_schedule_export.csv"}
    )

@app.get("/api/projects/export/json")
def export_projects_json(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    items = []
    for p in projects:
        items.append({
            "project_id": p.project_id,
            "name": p.name,
            "location": p.location,
            "exec": p.exec,
            "cost": p.cost,
            "timespan": p.timespan,
            "start_date": str(p.start_date),
            "planned_end_date": str(p.planned_end_date),
            "projected_end_date": str(p.projected_end_date),
            "completion": p.completion,
            "actual_cost": p.actual_cost,
            "status": p.status,
            "goal": p.goal
        })
    return JSONResponse(
        content=items,
        headers={"Content-Disposition": "attachment; filename=revised_schedule_export.json"}
    )

# ----------------- Serve Frontend Static Build -----------------
from fastapi.staticfiles import StaticFiles

frontend_dist = os.path.join(PROJECT_ROOT, "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/Smart-City-Management-Project", StaticFiles(directory=frontend_dist, html=True), name="frontend_subpath")
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
    logger.info(f"Mounted production frontend from: {frontend_dist}")
