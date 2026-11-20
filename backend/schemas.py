from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator

# ----------------- Auth Schemas -----------------
class LoginRequest(BaseModel):
    username: str
    password: Optional[str] = "civicgrid2026"
    role: Optional[str] = None  # Quick demo role: SYSADMIN, ECNEC, MOP, EXEC, APP
    agency: Optional[str] = None

class UserOut(BaseModel):
    username: str
    role: str
    committee: Optional[str] = None
    agency: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ----------------- Agency Schemas -----------------
class AgencyBase(BaseModel):
    code: str
    name: str
    type: str
    description: Optional[str] = None

class AgencyOut(AgencyBase):
    active_projects_count: Optional[int] = 0
    active_components_count: Optional[int] = 0
    total_budget_allocated: Optional[float] = 0.0

    class Config:
        from_attributes = True

# ----------------- Constraint Schemas -----------------
class ConstraintBase(BaseModel):
    code: str
    max_limit: float
    constraint_type: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None

class ConstraintCreate(ConstraintBase):
    pass

class ConstraintOut(ConstraintBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- Component Schemas -----------------
class ComponentBase(BaseModel):
    component_id: str
    ececuting_agency: str
    component_type: str
    depends_on: Optional[str] = None
    budget_ratio: float = 0.5

class ComponentCreate(ComponentBase):
    project_id: Optional[str] = None
    proposal_id: Optional[str] = None

class ComponentProgressUpdate(BaseModel):
    component_id: str
    completion_pct: float = Field(..., ge=0.0, le=100.0)
    spent_cost: Optional[float] = None

class ComponentOut(ComponentBase):
    project_id: Optional[str] = None
    proposal_id: Optional[str] = None
    allocated_cost: Optional[float] = None
    completion_pct: float = 0.0
    spent_cost: float = 0.0
    planned_start_date: Optional[date] = None
    planned_end_date: Optional[date] = None
    projected_start_date: Optional[date] = None
    projected_end_date: Optional[date] = None
    remaining_duration_years: Optional[float] = None
    status: str = "Pending"

    class Config:
        from_attributes = True

# ----------------- Project Schemas -----------------
class ProjectBase(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    exec: str
    cost: float
    timespan: int
    goal: Optional[str] = None
    start_date: date

class ProjectCreate(ProjectBase):
    project_id: str

class ProjectProgressUpdate(BaseModel):
    completion: float = Field(..., ge=0.0, le=100.0)
    actual_cost: Optional[float] = None
    component_updates: Optional[List[ComponentProgressUpdate]] = None

class CitizenFeedbackBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str
    citizen_name: Optional[str] = "Anonymous Citizen"

class CitizenFeedbackCreate(CitizenFeedbackBase):
    pass

class CitizenFeedbackOut(CitizenFeedbackBase):
    id: int
    project_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectOut(ProjectBase):
    project_id: str
    completion: float
    actual_cost: float
    planned_end_date: Optional[date] = None
    projected_end_date: Optional[date] = None
    status: str
    average_rating: Optional[float] = None
    feedback_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ProjectDetailOut(ProjectOut):
    components: List[ComponentOut] = []
    feedbacks: List[CitizenFeedbackOut] = []

    class Config:
        from_attributes = True

# ----------------- Proposal Schemas -----------------
class ProposalComponentInput(BaseModel):
    component_type: str = "works"
    budget_ratio: float = 0.5
    depends_on: Optional[str] = None

class ProposalCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    exec: str
    cost: float
    timespan: int
    goal: Optional[str] = None
    proposal_date: Optional[date] = None
    components: Optional[List[ProposalComponentInput]] = None

class ProposalApproveRequest(BaseModel):
    approved_start_date: Optional[date] = None
    review_notes: Optional[str] = "Approved by authority"

class ProposalRejectRequest(BaseModel):
    rejection_reason: str = "Proposal rejected due to budget or schedule conflicts"

class TimeframeSuggestionOut(BaseModel):
    optimal_start_date: date
    optimal_end_date: date
    timespan_years: int
    bottleneck_constraint: Optional[str] = None
    constraint_details: Dict[str, Any] = {}
    is_immediate: bool = False
    earliest_available_slot_reason: str

class ProposalOut(BaseModel):
    proposal_id: str
    name: str
    location: str
    latitude: float
    longitude: float
    exec: str
    cost: float
    timespan: int
    goal: Optional[str] = None
    proposal_date: date
    status: str
    approving_authority: str
    suggested_start_date: Optional[date] = None
    suggested_end_date: Optional[date] = None
    review_notes: Optional[str] = None
    components: List[ComponentOut] = []

    class Config:
        from_attributes = True

# ----------------- Ingestion & Audit Schemas -----------------
class IngestionAuditOut(BaseModel):
    id: int
    timestamp: datetime
    total_files: int
    total_rows_read: int
    total_rows_loaded: int
    total_bad_rows: int
    summary: Dict[str, Any] = {}
    bad_rows: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

# ----------------- AI Advisor Schemas -----------------
class AIStatusResponse(BaseModel):
    connected: bool
    provider: str = "server_env"
    model: str = "gemini-2.5-flash"
    latency_ms: float = 0.0
    projects_indexed: int = 0

class AIAdvisorRequest(BaseModel):
    query_type: str = "bottleneck"  # 'bottleneck', 'feedback_summary', 'dpp_recommendation', 'general'
    project_id: Optional[str] = None
    proposal_id: Optional[str] = None
    user_prompt: Optional[str] = None
    mode: str = "instant"  # 'instant' or 'deep'

class AIChatRequest(BaseModel):
    prompt: str
    mode: str = "instant"  # 'instant' or 'deep'
    project_id: Optional[str] = None
    proposal_id: Optional[str] = None

class AIAdvisorResponse(BaseModel):
    analysis: str
    bottlenecks: List[str] = []
    recommendations: List[str] = []
    metrics: Dict[str, Any] = {}
    source: str = "gemini-2.5-flash"  # or 'rule-based-fallback'
    reasoning_trace: Optional[Dict[str, Any]] = None
    artifacts: Optional[Dict[str, Any]] = None

# ----------------- Civic Issue Schemas -----------------
class CivicIssueCreate(BaseModel):
    project_id: str
    category: str
    description: str
    citizen_name: Optional[str] = "Anonymous Citizen"
    citizen_phone: Optional[str] = None
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: Optional[str] = None

class CivicIssueOut(BaseModel):
    id: str
    project_id: str
    project_name: Optional[str] = None
    category: str
    description: str
    citizen_name: str
    citizen_phone: Optional[str] = None
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: Optional[str] = None
    upvotes: int = 1
    status: str = "Open"
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Governance Audit & Scale Schemas -----------------
class AuditLogOut(BaseModel):
    id: int
    timestamp: datetime
    action: str
    actor: str
    details: str
    prev_hash: str
    hash: str

    class Config:
        from_attributes = True

class ScaleBenchmarkOut(BaseModel):
    total_projects: int
    total_components: int
    total_constraints: int
    execution_time_ms: float
    throughput_items_per_sec: float
    dag_acyclic: bool
    precedence_satisfaction_pct: float
    resource_conflicts_resolved: int
    status: str
    timestamp: str

