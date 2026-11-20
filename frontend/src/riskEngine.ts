import { Project, ComponentItem, CitizenFeedback, CivicIssue, ProjectRiskForecast, RiskTier } from './types';

/**
 * CivicGrid Deterministic Predictive Risk & Cost Overrun Engine
 * Evaluates 5 multi-factor operational vectors:
 * 1. Schedule Slippage (projected vs planned baseline)
 * 2. Historical Burn Pace (expenditure rate vs physical completion)
 * 3. Critical Path Strain (dependency DAG depth & predecessor blockers)
 * 4. Agency Workload Stress (concurrent project load)
 * 5. Citizen Friction (feedback ratings & active civic hazard reports)
 */
export function calculateProjectRiskForecast(
  project: Project,
  components: ComponentItem[] = [],
  feedbacks: CitizenFeedback[] = [],
  civicIssues: CivicIssue[] = [],
  agencyActiveCount: number = 2
): ProjectRiskForecast {
  // If project is completed, risk is minimal
  if (project.status === 'Completed' || project.completion >= 100) {
    return {
      project_id: project.project_id,
      name: project.name,
      risk_score: 5,
      risk_tier: 'Low',
      delay_probability_pct: 2,
      forecasted_final_cost: Number((project.actual_cost || project.cost).toFixed(2)),
      forecasted_overrun_pct: 0,
      predicted_delay_days: 0,
      top_risk_drivers: ['Project has successfully concluded with zero open critical constraints.'],
      variance_factors: {
        critical_path_strain: 0,
        agency_workload_stress: 5,
        schedule_slippage: 0,
        citizen_friction: 5,
        historical_burn_pace: 0,
      },
    };
  }

  // 1. Schedule Slippage Factor (0 - 100)
  let slippageDays = 0;
  if (project.planned_end_date && project.projected_end_date) {
    const planned = new Date(project.planned_end_date).getTime();
    const projected = new Date(project.projected_end_date).getTime();
    slippageDays = Math.max(0, Math.round((projected - planned) / (1000 * 60 * 60 * 24)));
  } else if (project.status === 'Delayed') {
    slippageDays = 180;
  }
  let fSlip = Math.min(100, Math.round((slippageDays / 365) * 60));
  if (project.status === 'Delayed') fSlip = Math.max(fSlip, 65);

  // 2. Historical Burn Pace Factor (0 - 100)
  const spent = project.actual_cost || 0;
  const budget = Math.max(1, project.cost);
  const spentRatio = spent / budget;
  const compRatio = Math.max(0.05, (project.completion || 0) / 100);
  const burnPace = spentRatio / compRatio; // e.g. 1.5 means spending 50% faster than completion
  let fBurn = 10;
  if (burnPace > 1.0) {
    fBurn = Math.min(100, Math.round((burnPace - 1.0) * 85 + 20));
  } else if (project.completion < 20 && spent > budget * 0.3) {
    fBurn = 70;
  }

  // 3. Critical Path Strain Factor (0 - 100)
  const projComps = components.filter(c => c.project_id === project.project_id || !c.project_id);
  let hasPendingDependency = false;
  let maxDepDepth = 0;
  projComps.forEach(c => {
    if (c.depends_on) {
      maxDepDepth = Math.max(maxDepDepth, 2);
      const parent = projComps.find(p => p.component_id === c.depends_on);
      if (parent && parent.completion_pct < 60) {
        hasPendingDependency = true;
      }
    }
  });
  let fCpath = Math.min(100, maxDepDepth * 25 + (hasPendingDependency ? 35 : 10));

  // 4. Agency Workload Stress Factor (0 - 100)
  let fAgency = Math.min(100, Math.round((agencyActiveCount / 5) * 60 + 15));

  // 5. Citizen Friction Factor (0 - 100)
  const projFeedbacks = feedbacks.filter(f => f.project_id === project.project_id);
  const avgRating = projFeedbacks.length > 0
    ? projFeedbacks.reduce((acc, f) => acc + f.rating, 0) / projFeedbacks.length
    : (project.average_rating || 3.5);

  const projIssues = civicIssues.filter(i => i.project_id === project.project_id && i.status !== 'Remediated');
  const issueUpvotes = projIssues.reduce((acc, i) => acc + i.upvotes, 0);

  const ratingScore = Math.max(0, (5 - avgRating) * 15);
  const issueScore = Math.min(50, projIssues.length * 12 + issueUpvotes * 2);
  let fCit = Math.min(100, Math.round(ratingScore + issueScore));

  // Weighted Composite Risk Score (0 - 100)
  const compositeScore = Math.min(100, Math.max(5, Math.round(
    fSlip * 0.28 +
    fBurn * 0.24 +
    fCpath * 0.20 +
    fAgency * 0.14 +
    fCit * 0.14
  )));

  let risk_tier: RiskTier = 'Low';
  if (compositeScore >= 70) risk_tier = 'Critical';
  else if (compositeScore >= 40) risk_tier = 'Elevated';

  // Delay probability
  const delay_probability_pct = project.status === 'Delayed'
    ? Math.min(99, Math.max(75, Math.round(compositeScore * 0.95 + 5)))
    : Math.min(95, Math.max(5, Math.round(compositeScore * 0.88 + 4)));

  // Forecasted Overrun & Final Cost
  let overrunMultiplier = 1.0;
  if (compositeScore >= 40) {
    overrunMultiplier += ((compositeScore - 30) / 100) * 0.38;
  }
  const forecasted_final_cost = Number((budget * overrunMultiplier).toFixed(2));
  const forecasted_overrun_pct = Number((((forecasted_final_cost - budget) / budget) * 100).toFixed(1));

  // Additional predicted delay days
  const baseDelay = slippageDays > 0 ? slippageDays : (project.status === 'Delayed' ? 120 : 0);
  const predicted_delay_days = Math.round(baseDelay + (compositeScore > 40 ? (compositeScore - 40) * 2.8 : 0));

  // Explainable Top Drivers
  const top_risk_drivers: string[] = [];
  if (fSlip >= 50) {
    top_risk_drivers.push(
      slippageDays > 0
        ? `Timeline slippage: projected completion is ${slippageDays} days behind original DPP milestone.`
        : 'Status flagged as Delayed by municipal monitoring committee.'
    );
  }
  if (fBurn >= 45) {
    top_risk_drivers.push(
      `Budget burn pace: spent ৳${spent.toFixed(1)} Cr (${Math.round(spentRatio * 100)}%) against ${project.completion}% physical progress.`
    );
  }
  if (fCpath >= 45) {
    top_risk_drivers.push(
      hasPendingDependency
        ? 'Critical path dependency bottleneck: prerequisite component progress lagging under 60%.'
        : 'High component dependency density along structural execution path.'
    );
  }
  if (fCit >= 40) {
    top_risk_drivers.push(
      projIssues.length > 0
        ? `Elevated citizen friction: ${projIssues.length} active hazard reports (${issueUpvotes} community upvotes).`
        : `Below-average citizen satisfaction score (${avgRating.toFixed(1)} / 5.0).`
    );
  }
  if (fAgency >= 55) {
    top_risk_drivers.push(`Executing agency ${project.exec} is handling ${agencyActiveCount} concurrent active projects.`);
  }

  if (top_risk_drivers.length === 0) {
    top_risk_drivers.push('Execution pacing is currently within planned fiscal and temporal limits.');
  }

  return {
    project_id: project.project_id,
    name: project.name,
    risk_score: compositeScore,
    risk_tier,
    delay_probability_pct,
    forecasted_final_cost,
    forecasted_overrun_pct,
    predicted_delay_days,
    top_risk_drivers: top_risk_drivers.slice(0, 3),
    variance_factors: {
      critical_path_strain: fCpath,
      agency_workload_stress: fAgency,
      schedule_slippage: fSlip,
      citizen_friction: fCit,
      historical_burn_pace: fBurn,
    },
  };
}
