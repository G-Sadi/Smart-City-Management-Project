import os
import logging
from typing import Dict, Any, List, Optional
from datetime import date
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from models import Project, Proposal, Component, Constraint, CitizenFeedback
from scheduler_engine import RCPSPScheduler

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def rule_based_bottleneck_analysis(scheduler: RCPSPScheduler, db: Session, project_id: Optional[str] = None) -> Dict[str, Any]:
    """Deterministic rule-based advisor fallback when Gemini API key is unset or offline."""
    bottlenecks_data = scheduler.analyze_bottlenecks()
    agency_utils = bottlenecks_data.get("agency_utilization", [])
    loc_utils = bottlenecks_data.get("location_utilization", [])

    high_agencies = [a for a in agency_utils if a.get("is_critical")]
    high_locs = [l for l in loc_utils if l.get("is_critical")]

    bottlenecks: List[str] = []
    recommendations: List[str] = []

    for ha in high_agencies[:3]:
        bottlenecks.append(f"Agency {ha['agency']} is heavily loaded at {ha['utilization_pct']}% capacity ({ha['active_components']}/{ha['limit']} active components).")
        recommendations.append(f"Cap new project allocations for {ha['agency']} or outsource non-critical works to partner agencies (e.g. LGED / BPDB).")

    for hl in high_locs[:3]:
        bottlenecks.append(f"Location {hl['location']} has reached {hl['utilization_pct']}% density limit ({hl['active_components']}/{hl['limit']} concurrent components).")
        recommendations.append(f"Prioritize completing finishing stages in {hl['location']} before opening new construction sites to minimize civic disruption.")

    # Project-specific checks
    target_project = None
    if project_id:
        target_project = db.query(Project).filter_by(project_id=project_id).first()
        if target_project:
            planned_end = target_project.planned_end_date
            projected_end = target_project.projected_end_date
            if projected_end and planned_end and projected_end > planned_end:
                delay_months = round((projected_end - planned_end).days / 30.4, 1)
                bottlenecks.append(f"Project '{target_project.name}' is delayed by approx {delay_months} months (Completion: {target_project.completion}% vs 100% expected).")
                recommendations.append(f"Conduct rapid procurement review for '{target_project.name}' and release milestone disbursement to accelerate works.")

    analysis = (
        f"### Infrastructure Bottleneck & Risk Report\n\n"
        f"Citywide monitoring identified **{len(high_agencies)} executing agencies** and **{len(high_locs)} municipal zones** "
        f"currently operating above recommended capacity thresholds (>80% utilization).\n\n"
        f"#### Key Observations:\n"
        + "".join([f"- {b}\n" for b in bottlenecks[:5]])
        + f"\n#### Strategic Recommendations:\n"
        + "".join([f"1. {r}\n" for r in recommendations[:4]])
    )

    return {
        "analysis": analysis,
        "bottlenecks": bottlenecks,
        "recommendations": recommendations,
        "metrics": {
            "critical_agencies": len(high_agencies),
            "critical_locations": len(high_locs),
            "total_active_components": bottlenecks_data.get("total_active_components", 0)
        },
        "source": "rule-based-fallback"
    }

def rule_based_feedback_summary(db: Session, project_id: Optional[str] = None) -> Dict[str, Any]:
    query = db.query(CitizenFeedback)
    if project_id:
        query = query.filter_by(project_id=project_id)
    feedbacks = query.order_by(CitizenFeedback.created_at.desc()).limit(100).all()

    if not feedbacks:
        return {
            "analysis": "No citizen feedback records currently submitted for this selection.",
            "bottlenecks": [],
            "recommendations": ["Promote citizen feedback collection via the public civic portal."],
            "metrics": {"total_feedbacks": 0, "avg_rating": 0},
            "source": "rule-based-fallback"
        }

    avg_rating = round(sum(f.rating for f in feedbacks) / len(feedbacks), 2)
    low_ratings = [f for f in feedbacks if f.rating <= 2]
    high_ratings = [f for f in feedbacks if f.rating >= 4]

    common_concerns = [f.comment for f in low_ratings[:5]]
    recommendations = [
        "Address citizen safety concerns regarding road diversions and dust suppression.",
        "Publish monthly public progress updates on the civic portal to boost transparency.",
        "Prioritize citizen complaint resolution within 7 business days."
    ]

    analysis = (
        f"### Citizen Sentiment & Public Satisfaction Overview\n\n"
        f"- **Total Submissions Analyzed:** {len(feedbacks)}\n"
        f"- **Average Citizen Satisfaction Score:** {avg_rating} / 5.0 ⭐\n"
        f"- **Critical Concerns Logged:** {len(low_ratings)} complaints (rating <= 2)\n"
        f"- **Positive Commendations:** {len(high_ratings)} reviews (rating >= 4)\n\n"
        f"#### Common Citizen Feedback Themes:\n"
        + "".join([f"- *\"{c}\"*\n" for c in common_concerns])
    )

    return {
        "analysis": analysis,
        "bottlenecks": [f"Negative citizen sentiment flagged on {len(low_ratings)} reviews."],
        "recommendations": recommendations,
        "metrics": {"total_feedbacks": len(feedbacks), "avg_rating": avg_rating},
        "source": "rule-based-fallback"
    }

def generate_ai_advisor_response(
    query_type: str,
    db: Session,
    project_id: Optional[str] = None,
    proposal_id: Optional[str] = None,
    user_prompt: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calls Gemini 2.5 Flash via google-genai SDK if GEMINI_API_KEY is available;
    falls back cleanly to deterministic domain rule-based engine.
    """
    scheduler = RCPSPScheduler(db)

    # If no Gemini API key configured, use deterministic rule-based response
    if not GEMINI_API_KEY:
        if query_type == "feedback_summary":
            return rule_based_feedback_summary(db, project_id)
        else:
            return rule_based_bottleneck_analysis(scheduler, db, project_id)

    # Attempt Gemini API call
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)

        # Build context
        bottlenecks_data = scheduler.analyze_bottlenecks()
        active_comps = bottlenecks_data.get("total_active_components", 0)
        agency_utils = bottlenecks_data.get("agency_utilization", [])[:5]
        loc_utils = bottlenecks_data.get("location_utilization", [])[:5]

        context_info = (
            f"Current City Infrastructure State:\n"
            f"- Total active components: {active_comps}\n"
            f"- Top agency load: {agency_utils}\n"
            f"- Top location density: {loc_utils}\n"
        )

        if project_id:
            p = db.query(Project).filter_by(project_id=project_id).first()
            if p:
                context_info += (
                    f"\nTarget Project: {p.name} ({p.project_id})\n"
                    f"Location: {p.location}, Agency: {p.exec}, Cost: {p.cost} Cr Tk, Completion: {p.completion}%\n"
                    f"Planned End: {p.planned_end_date}, Projected End: {p.projected_end_date}, Status: {p.status}\n"
                )

        if proposal_id:
            prop = db.query(Proposal).filter_by(proposal_id=proposal_id).first()
            if prop:
                context_info += (
                    f"\nTarget Proposal: {prop.name} ({prop.proposal_id})\n"
                    f"Location: {prop.location}, Agency: {prop.exec}, Cost: {prop.cost} Cr Tk, Timespan: {prop.timespan} years\n"
                    f"Approving Authority: {prop.approving_authority}, Status: {prop.status}\n"
                )

        prompt = (
            f"You are the Chief AI Urban Planning & Infrastructure Advisor for the CivicGrid Smart City Management System.\n"
            f"Context Data:\n{context_info}\n\n"
            f"User Prompt / Task: {user_prompt or f'Perform a deep analysis for {query_type}.'}\n\n"
            f"Respond with high-value, actionable municipal engineering guidance formatted in clean GitHub Markdown.\n"
            f"Include:\n"
            f"1. Executive Summary & Root Cause\n"
            f"2. Specific Bottlenecks & Risk Factors\n"
            f"3. Concrete Engineering / DPP Recommendations\n"
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        raw_text = response.text or ""
        return {
            "analysis": raw_text,
            "bottlenecks": [
                f"Critical load on {agency_utils[0]['agency']} ({agency_utils[0]['utilization_pct']}%)" if agency_utils else "Capacity strain detected",
                f"High urban density in {loc_utils[0]['location']} ({loc_utils[0]['utilization_pct']}%)" if loc_utils else "Zone congestion"
            ],
            "recommendations": [
                "Re-sequence overlapping civil works using RCPSP schedule guidance.",
                "Enforce strict supplier SLA contracts on delayed components."
            ],
            "metrics": {
                "active_components": active_comps,
                "top_agency": agency_utils[0]["agency"] if agency_utils else "N/A"
            },
            "source": "gemini-2.5-flash"
        }

    except Exception as e:
        logger.warning(f"Gemini API invocation failed ({e}), falling back to rule-based engine.")
        fallback = rule_based_bottleneck_analysis(scheduler, db, project_id)
        fallback["source"] = "rule-based-fallback (API exception)"
        return fallback
