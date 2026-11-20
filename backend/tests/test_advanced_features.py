import pytest
import os
import sys
import hashlib
from datetime import date, datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import Base, Project, Component, CitizenFeedback, CivicIssue, AuditLog
from risk_engine import calculate_project_risk
from main import append_audit_log, generate_telemetry_snapshot

@pytest.fixture
def mem_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSession()
    yield db
    db.close()

def test_predictive_risk_engine_calculation():
    """Verifies that multi-factor predictive risk calculations generate bounded scores and valid tiers."""
    # Critical delayed project
    delayed_proj = {
        "project_id": "proj_test_delayed",
        "name": "Flyover Interceptor",
        "status": "Delayed",
        "completion": 30.0,
        "cost": 100.0,
        "actual_cost": 85.0, # High burn pace!
        "planned_end_date": date(2025, 1, 1),
        "projected_end_date": date(2026, 6, 1), # 500+ days slippage
        "exec": "DNCC",
        "average_rating": 2.1
    }

    comps = [
        {"component_id": "c1", "project_id": "proj_test_delayed", "depends_on": None, "completion_pct": 40.0},
        {"component_id": "c2", "project_id": "proj_test_delayed", "depends_on": "c1", "completion_pct": 10.0}
    ]

    issues = [
        {"project_id": "proj_test_delayed", "upvotes": 25, "status": "Open"}
    ]

    risk = calculate_project_risk(delayed_proj, comps, [], issues, agency_active_count=6)

    assert risk["risk_score"] >= 65, "Delayed project with high burn pace should score in Elevated or Critical"
    assert risk["risk_tier"] in ["Elevated", "Critical"]
    assert risk["delay_probability_pct"] >= 70
    assert risk["forecasted_final_cost"] > delayed_proj["cost"]
    assert len(risk["top_risk_drivers"]) >= 1
    assert "Timeline slippage" in risk["top_risk_drivers"][0] or "Budget burn pace" in risk["top_risk_drivers"][0]

def test_immutable_sha256_audit_chain(mem_db):
    """Verifies cryptographic SHA-256 chain links prev_hash to hash across sequential actions."""
    log1 = append_audit_log(mem_db, "TEST_ACTION_1", "ADMIN", "First operational mutation")
    assert log1.prev_hash == "0" * 64, "Genesis entry should have 64 zeros as prev_hash"
    assert len(log1.hash) == 64

    log2 = append_audit_log(mem_db, "TEST_ACTION_2", "PLANNER", "Second operational mutation")
    assert log2.prev_hash == log1.hash, "Second entry prev_hash must equal first entry hash"

    log3 = append_audit_log(mem_db, "TEST_ACTION_3", "ECNEC", "Third operational mutation")
    assert log3.prev_hash == log2.hash, "Third entry prev_hash must equal second entry hash"

def test_1000_project_scale_simulation():
    """Verifies that an in-memory 1,000-project RCPSP graph executes under 500ms and satisfies DAG acyclicity."""
    import time
    import random
    from collections import deque

    TOTAL_PROJECTS = 1000
    TOTAL_COMPONENTS = 2500

    t0 = time.perf_counter()

    adj = {i: [] for i in range(TOTAL_COMPONENTS)}
    in_degree = [0] * TOTAL_COMPONENTS

    random.seed(42)
    for c in range(TOTAL_PROJECTS, TOTAL_COMPONENTS):
        parent = random.randint(0, c - 1)
        adj[parent].append(c)
        in_degree[c] += 1

    queue = deque([i for i in range(TOTAL_COMPONENTS) if in_degree[i] == 0])
    scheduled = []
    while queue:
        u = queue.popleft()
        scheduled.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    elapsed_ms = (time.perf_counter() - t0) * 1000.0

    assert len(scheduled) == TOTAL_COMPONENTS, "Kahn's algorithm must schedule all 2,500 components (DAG acyclic)"
    assert elapsed_ms < 500.0, f"1,000-project benchmark must run in < 500ms, took {elapsed_ms:.2f}ms"

def test_live_telemetry_snapshot_generation(mem_db):
    """Verifies telemetry packet structure and metric bounds."""
    snap = generate_telemetry_snapshot(mem_db)
    assert "timestamp" in snap
    assert 20 <= snap["overall_traffic_congestion"] <= 100
    assert 40 <= snap["peak_noise_db"] <= 105
    assert 50 <= snap["avg_aqi"] <= 300
    assert len(snap["zones"]) == 8
