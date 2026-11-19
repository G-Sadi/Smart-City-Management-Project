import pytest
import os
import tempfile
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import networkx as nx

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models import Base, Agency, Project, Proposal, Component, Constraint, UserType, IngestionAudit
from scheduler_engine import RCPSPScheduler, add_years, add_days
from csv_loader import ingest_all_csvs

@pytest.fixture
def test_db():
    """Creates a temporary in-memory SQLite database for deterministic tests."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSession()

    # Seed baseline fixtures
    lgd = Agency(code="LGD", name="Local Government Division", type="EXEC", description="Municipal infrastructure")
    pwd = Agency(code="PWD", name="Public Works Department", type="EXEC", description="Building works")
    mop = Agency(code="MOP", name="Ministry of Planning", type="APPROV", description="Planning approvals")
    db.add_all([lgd, pwd, mop])

    # Seed constraints
    c1 = Constraint(code="LGD", max_limit=2.0, constraint_type="executing_agency_limit")
    c2 = Constraint(code="Daudpur", max_limit=1.0, constraint_type="location_limit")
    c3 = Constraint(code="PWD", max_limit=100.0, constraint_type="yearly_funding")
    c4 = Constraint(
        code="Daudpur",
        max_limit=0.0,
        constraint_type="blackout_period",
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 30),
        description="Monsoon Flood Risk Blackout"
    )
    db.add_all([c1, c2, c3, c4])
    db.commit()

    yield db
    db.close()


def test_1_dirty_csv_filtering_and_bad_fk_rejection(test_db):
    """
    Test Case 1 (Section 1):
    Verifies that malformed rows (negative cost, missing fields, orphaned agency FK)
    are strictly filtered and recorded in the granular sanitization audit log.
    """
    with tempfile.TemporaryDirectory() as tmp_dir:
        # Create minimal agencies CSV
        agencies_csv = os.path.join(tmp_dir, "agencies.csv")
        with open(agencies_csv, "w", encoding="utf-8") as f:
            f.write("code,name,type,description\n")
            f.write("LGD,Local Government Division,EXEC,Valid\n")

        # Create dirty projects CSV
        projects_csv = os.path.join(tmp_dir, "projects.csv")
        with open(projects_csv, "w", encoding="utf-8") as f:
            f.write("project_id,name,location,latitude,longitude,exec,cost,timespan,goal,start_date,completion,actual_cost\n")
            # Valid row
            f.write("proj9001,Valid Drainage,Daudpur,23.82,90.62,LGD,40.0,2,Flood defense,2026-01-01,0,0\n")
            # Dirty Row 1: Negative cost
            f.write("proj9002,Negative Budget,Daudpur,23.82,90.62,LGD,-15.0,2,Invalid,2026-01-01,0,0\n")
            # Dirty Row 2: Malformed Date
            f.write("proj9003,Bad Date Project,Daudpur,23.82,90.62,LGD,20.0,1,Invalid,32-13-2026,0,0\n")
            # Dirty Row 3: Orphan FK agency
            f.write("proj9004,Orphan Agency,Daudpur,23.82,90.62,UNKNOWN_AGENCY,25.0,2,Invalid,2026-01-01,0,0\n")

        report = ingest_all_csvs(tmp_dir, test_db)

        # 1 valid row loaded, 3 bad rows rejected
        assert report["file_summary"]["projects.csv"]["loaded"] == 1
        assert report["file_summary"]["projects.csv"]["bad"] == 3
        assert len(report["bad_rows_log"]) == 3

        # Verify reasons and violation types
        violations = [b["violation_type"] for b in report["bad_rows_log"]]
        assert "Negative Cost/Timespan/Completion" in violations
        assert "Malformed Date" in violations
        assert "Orphan Agency FK" in violations


def test_2_agency_concurrency_cap_enforcement(test_db):
    """
    Test Case 2 (Section 2):
    Enforces agency concurrency ceiling (e.g., LGD max 2 active components).
    Adding a 3rd concurrent component must shift the suggested start date.
    """
    scheduler = RCPSPScheduler(test_db)

    # Project 1 for LGD
    p1 = Project(
        project_id="p_lgd_1", name="Drainage 1", location="ZoneA", latitude=23.8, longitude=90.6,
        exec="LGD", cost=20.0, timespan=1, start_date=date(2026, 1, 1),
        planned_end_date=date(2026, 12, 31), projected_end_date=date(2026, 12, 31),
        status="Running"
    )
    c1 = Component(
        component_id="c_lgd_1", project_id="p_lgd_1", ececuting_agency="LGD",
        component_type="works", budget_ratio=1.0, allocated_cost=20.0,
        planned_start_date=date(2026, 1, 1), planned_end_date=date(2026, 12, 31),
        projected_start_date=date(2026, 1, 1), projected_end_date=date(2026, 12, 31),
        status="Running"
    )

    # Project 2 for LGD (filling agency capacity of 2)
    p2 = Project(
        project_id="p_lgd_2", name="Drainage 2", location="ZoneB", latitude=23.8, longitude=90.6,
        exec="LGD", cost=20.0, timespan=1, start_date=date(2026, 1, 1),
        planned_end_date=date(2026, 12, 31), projected_end_date=date(2026, 12, 31),
        status="Running"
    )
    c2 = Component(
        component_id="c_lgd_2", project_id="p_lgd_2", ececuting_agency="LGD",
        component_type="works", budget_ratio=1.0, allocated_cost=20.0,
        planned_start_date=date(2026, 1, 1), planned_end_date=date(2026, 12, 31),
        projected_start_date=date(2026, 1, 1), projected_end_date=date(2026, 12, 31),
        status="Running"
    )

    test_db.add_all([p1, c1, p2, c2])
    test_db.commit()

    # Suggest timeframe for 3rd component for LGD starting 2026-03-01
    tf = scheduler.suggest_optimal_timeframe(
        cost=15.0,
        timespan_years=1,
        exec_agency="LGD",
        location="ZoneC",
        earliest_start=date(2026, 3, 1)
    )

    # Since LGD is at max capacity (2/2) until 2026-12-31, start date MUST be deferred
    assert tf["is_immediate"] is False
    assert tf["bottleneck_constraint"] == "agency_concurrency"
    assert tf["optimal_start_date"] > date(2026, 12, 30)


def test_3_location_concurrency_and_blackout_avoidance(test_db):
    """
    Test Case 3 (Section 2 & 4):
    Verifies that proposals scheduled during a location blackout window
    (Daudpur 2026-06-01 to 2026-06-30) are automatically shifted after the blackout ends.
    """
    scheduler = RCPSPScheduler(test_db)

    tf = scheduler.suggest_optimal_timeframe(
        cost=10.0,
        timespan_years=1,
        exec_agency="PWD",
        location="Daudpur",
        earliest_start=date(2026, 6, 10)  # During blackout!
    )

    # Start date must be shifted after blackout (after June 30, 2026)
    assert tf["is_immediate"] is False
    assert tf["bottleneck_constraint"] == "blackout"
    assert tf["optimal_start_date"] >= date(2026, 7, 1)


def test_4_yearly_budget_cap_and_fiscal_rollover(test_db):
    """
    Test Case 4 (Section 2):
    PWD has yearly funding cap of 100 Cr Tk.
    If an existing project consumes 90 Cr Tk in 2026, proposing a 30 Cr Tk 1-year project
    exceeds 100 Cr Tk and must be deferred to the next fiscal year (2027-01-01).
    """
    p_pwd = Project(
        project_id="p_pwd_heavy", name="Complex Building", location="Dhaka",
        latitude=23.7, longitude=90.4, exec="PWD", cost=90.0, timespan=1,
        start_date=date(2026, 1, 1), planned_end_date=date(2026, 12, 31),
        projected_end_date=date(2026, 12, 31), status="Running"
    )
    c_pwd = Component(
        component_id="c_pwd_heavy", project_id="p_pwd_heavy", ececuting_agency="PWD",
        component_type="works", budget_ratio=1.0, allocated_cost=90.0,
        planned_start_date=date(2026, 1, 1), planned_end_date=date(2026, 12, 31),
        projected_start_date=date(2026, 1, 1), projected_end_date=date(2026, 12, 31),
        status="Running"
    )
    test_db.add_all([p_pwd, c_pwd])
    test_db.commit()

    scheduler = RCPSPScheduler(test_db)
    tf = scheduler.suggest_optimal_timeframe(
        cost=30.0,
        timespan_years=1,
        exec_agency="PWD",
        location="Gazipur",
        earliest_start=date(2026, 2, 1)
    )

    # Must be deferred to next fiscal year 2027-01-01
    assert tf["is_immediate"] is False
    assert tf["bottleneck_constraint"] == "yearly_budget"
    assert tf["optimal_start_date"] >= date(2027, 1, 1)


def test_5_cross_project_dag_dependency_and_cycle_detection(test_db):
    """
    Test Case 5 (Section 2 & 5):
    Verifies Directed Acyclic Graph (DAG) construction, predecessor completion requirement,
    and circular dependency detection guardrails.
    """
    scheduler = RCPSPScheduler(test_db)

    # Component A in Project 1
    p1 = Project(project_id="p_dag_1", name="Water Mains", location="ZoneA", latitude=23.8, longitude=90.4,
                 exec="LGD", cost=50.0, timespan=2, start_date=date(2026, 1, 1), status="Running")
    cA = Component(component_id="comp_water_main", project_id="p_dag_1", ececuting_agency="LGD",
                   component_type="works", completion_pct=40.0, allocated_cost=50.0,
                   planned_start_date=date(2026, 1, 1), planned_end_date=date(2027, 12, 31),
                   projected_start_date=date(2026, 1, 1), projected_end_date=date(2027, 12, 31),
                   status="Running")

    # Component B in Project 2 depends on Component A
    p2 = Project(project_id="p_dag_2", name="Surface Road", location="ZoneA", latitude=23.8, longitude=90.4,
                 exec="PWD", cost=30.0, timespan=1, start_date=date(2026, 1, 1), status="Running")
    cB = Component(component_id="comp_surface_road", project_id="p_dag_2", ececuting_agency="PWD",
                   component_type="works", depends_on="comp_water_main", completion_pct=0.0,
                   allocated_cost=30.0, planned_start_date=date(2026, 1, 1), planned_end_date=date(2026, 12, 31),
                   status="Pending")

    test_db.add_all([p1, cA, p2, cB])
    test_db.commit()

    # Recalculate schedules
    scheduler.recalculate_all_schedules()

    test_db.refresh(cB)
    # Component B cannot start until Component A projected end date
    assert cB.projected_start_date >= cA.projected_end_date

    # Cycle detector verification
    dag_info = scheduler.get_dependency_dag_and_risks()
    assert dag_info["is_dag"] is True
    assert dag_info["cycles_detected"] == 0


def test_6_section_4_dynamic_recalculation_after_rollback(test_db):
    """
    Test Case 6 (Section 4):
    Tests dynamic formula:
      Remaining_Duration = Original_Duration * ((100 - Completion_Pct) / 100)
    Simulating a work rollback (reducing completion from 80% to 20%) must
    immediately extend the remaining duration and push out projected end date.
    """
    scheduler = RCPSPScheduler(test_db)

    p = Project(
        project_id="p_dyn", name="Flyover Section", location="Khulna", latitude=22.8, longitude=89.5,
        exec="PWD", cost=100.0, timespan=2, start_date=date(2026, 1, 1),
        completion=80.0, status="Running"
    )
    c = Component(
        component_id="c_dyn", project_id="p_dyn", ececuting_agency="PWD",
        component_type="works", budget_ratio=1.0, allocated_cost=100.0,
        completion_pct=80.0, status="Running"
    )
    test_db.add_all([p, c])
    test_db.commit()

    # Initial recalculation at 80%
    scheduler.recalculate_all_schedules()
    test_db.refresh(c)
    assert c.remaining_duration_years == pytest.approx(0.4, 0.05)  # 2 yrs * 20% = 0.4 yrs

    # Simulate Judge Work Rollback: Completion drops from 80% to 20%
    c.completion_pct = 20.0
    test_db.commit()

    # Dynamic recalculation
    scheduler.recalculate_all_schedules()
    test_db.refresh(c)

    # Remaining duration must expand to: 2 yrs * (100 - 20) / 100 = 1.6 yrs
    assert c.remaining_duration_years == pytest.approx(1.6, 0.05)
    # Projected end date must be pushed forward
    assert c.projected_end_date > date(2027, 6, 1)
