from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, ForeignKey, Text, Boolean
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Agency(Base):
    __tablename__ = "agencies"

    code = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # 'EXEC' or 'APPROV'
    description = Column(Text, nullable=True)

    projects = relationship("Project", back_populates="agency")
    proposals = relationship("Proposal", back_populates="agency")
    components = relationship("Component", back_populates="agency")


class UserType(Base):
    __tablename__ = "user_types"

    code = Column(String(50), primary_key=True, index=True)
    committee = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)


class Constraint(Base):
    __tablename__ = "constraints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(100), nullable=False, index=True)  # agency code, location name, etc.
    max_limit = Column(Float, nullable=False)
    constraint_type = Column(String(100), nullable=False, index=True)
    # constraint_type: 'executing_agency_limit', 'location_limit', 'yearly_funding', 'blackout_period'
    start_date = Column(Date, nullable=True)  # for blackout constraints
    end_date = Column(Date, nullable=True)    # for blackout constraints
    description = Column(Text, nullable=True)


class Project(Base):
    __tablename__ = "projects"

    project_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    exec = Column(String(50), ForeignKey("agencies.code"), nullable=False, index=True)
    cost = Column(Float, nullable=False)  # in Crore Tk
    timespan = Column(Integer, nullable=False)  # in Years
    goal = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    completion = Column(Float, default=0.0)  # Completion %
    actual_cost = Column(Float, default=0.0)  # in Crore Tk

    # Calculated / dynamic runtime scheduling fields
    planned_end_date = Column(Date, nullable=True)
    projected_end_date = Column(Date, nullable=True)
    status = Column(String(50), default="Running", index=True)  # 'Running', 'Delayed', 'Completed', 'Approved', 'Proposed', 'Canceled'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    agency = relationship("Agency", back_populates="projects")
    components = relationship("Component", back_populates="project", cascade="all, delete-orphan")
    feedbacks = relationship("CitizenFeedback", back_populates="project", cascade="all, delete-orphan")


class Proposal(Base):
    __tablename__ = "proposals"

    proposal_id = Column(String(50), primary_key=True, index=True)  # e.g. 'prop3072'
    name = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    exec = Column(String(50), ForeignKey("agencies.code"), nullable=False, index=True)
    cost = Column(Float, nullable=False)  # in Crore Tk
    timespan = Column(Integer, nullable=False)  # in Years
    goal = Column(Text, nullable=True)
    proposal_date = Column(Date, nullable=False)

    # Workflow & Approval fields
    status = Column(String(50), default="Pending", index=True)  # 'Pending', 'Approved', 'Rejected'
    approving_authority = Column(String(50), nullable=False)  # 'MOP' (cost <= 50) or 'ECNEC' (cost > 50)
    suggested_start_date = Column(Date, nullable=True)
    suggested_end_date = Column(Date, nullable=True)
    review_notes = Column(Text, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    agency = relationship("Agency", back_populates="proposals")
    components = relationship("Component", back_populates="proposal", cascade="all, delete-orphan")


class Component(Base):
    __tablename__ = "components"

    component_id = Column(String(50), primary_key=True, index=True)  # e.g. 'comp1459'
    project_id = Column(String(50), ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=True, index=True)
    proposal_id = Column(String(50), ForeignKey("proposals.proposal_id", ondelete="CASCADE"), nullable=True, index=True)
    ececuting_agency = Column(String(50), ForeignKey("agencies.code"), nullable=False, index=True)
    component_type = Column(String(50), nullable=False)  # 'goods', 'works', 'services'
    depends_on = Column(String(50), nullable=True, index=True)  # parent component_id
    budget_ratio = Column(Float, nullable=False, default=0.5)

    # Dynamic execution tracking
    allocated_cost = Column(Float, nullable=True)
    completion_pct = Column(Float, default=0.0)
    spent_cost = Column(Float, default=0.0)
    planned_start_date = Column(Date, nullable=True)
    planned_end_date = Column(Date, nullable=True)
    projected_start_date = Column(Date, nullable=True)
    projected_end_date = Column(Date, nullable=True)
    remaining_duration_years = Column(Float, nullable=True)
    status = Column(String(50), default="Pending", index=True)

    agency = relationship("Agency", back_populates="components")
    project = relationship("Project", back_populates="components")
    proposal = relationship("Proposal", back_populates="components")


class CitizenFeedback(Base):
    __tablename__ = "citizen_feedbacks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(50), ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False, index=True)
    citizen_name = Column(String(100), default="Anonymous Citizen")
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="feedbacks")


class IngestionAudit(Base):
    __tablename__ = "ingestion_audits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    total_files = Column(Integer, default=0)
    total_rows_read = Column(Integer, default=0)
    total_rows_loaded = Column(Integer, default=0)
    total_bad_rows = Column(Integer, default=0)
    summary_json = Column(Text, nullable=True)  # JSON breakdown
    bad_rows_log = Column(Text, nullable=True)  # Detailed log with file, row #, reason
