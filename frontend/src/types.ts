export interface ComponentItem {
  component_id: string;
  project_id?: string;
  proposal_id?: string;
  ececuting_agency: string;
  component_type: string;
  depends_on?: string;
  budget_ratio: number;
  allocated_cost?: number;
  completion_pct: number;
  spent_cost: number;
  planned_start_date?: string;
  planned_end_date?: string;
  projected_start_date?: string;
  projected_end_date?: string;
  remaining_duration_years?: number;
  status: string;
}

export interface CitizenFeedback {
  id: number;
  project_id: string;
  citizen_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Project {
  project_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  exec: string;
  cost: number;
  timespan: number;
  goal?: string;
  start_date: string;
  completion: number;
  actual_cost: number;
  planned_end_date?: string;
  projected_end_date?: string;
  status: 'Running' | 'Delayed' | 'Approved' | 'Proposed' | 'Completed' | string;
  average_rating?: number;
  feedback_count?: number;
}

export interface ProjectDetail extends Project {
  components: ComponentItem[];
  feedbacks: CitizenFeedback[];
}

export interface Proposal {
  proposal_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  exec: string;
  cost: number;
  timespan: number;
  goal?: string;
  proposal_date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  approving_authority: 'ECNEC' | 'MOP' | string;
  suggested_start_date?: string;
  suggested_end_date?: string;
  review_notes?: string;
  components: ComponentItem[];
}

export interface TimeframeSuggestion {
  optimal_start_date: string;
  optimal_end_date: string;
  timespan_years: number;
  bottleneck_constraint?: string;
  constraint_details: Record<string, any>;
  is_immediate: boolean;
  earliest_available_slot_reason: string;
}

export interface Agency {
  code: string;
  name: string;
  type: 'EXEC' | 'APPROV' | string;
  description?: string;
  active_projects_count?: number;
  active_components_count?: number;
  total_budget_allocated?: number;
}

export interface ConstraintItem {
  id: number;
  code: string;
  max_limit: number;
  constraint_type: 'executing_agency_limit' | 'location_limit' | 'yearly_funding' | 'blackout_period' | string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface SanitizationAuditItem {
  file: string;
  row: number;
  record_id: string;
  violation_type: string;
  action_taken: string;
  reason: string;
  data?: any;
}

export interface IngestionAudit {
  id: number;
  timestamp: string;
  total_files: number;
  total_rows_read: number;
  total_rows_loaded: number;
  total_bad_rows: number;
  summary: Record<string, { read: number; loaded: number; bad: number }>;
  bad_rows: SanitizationAuditItem[];
}

export interface AlgorithmBenchmark {
  makespan_saved_days: number;
  makespan_saved_months: number;
  makespan_reduction_pct: number;
  idle_time_reduction_pct: number;
  conflicts_resolved_count: number;
  agency_conflicts_resolved: number;
  location_conflicts_resolved: number;
  blackout_conflicts_resolved: number;
  budget_conflicts_resolved: number;
  constraint_compliance_pct: number;
  zero_violations_verified: boolean;
  baseline_makespan_days: number;
  optimized_makespan_days: number;
  cpm_critical_path_length_days: number;
}

export interface DAGNode {
  id: string;
  project_id: string;
  project_name: string;
  agency: string;
  comp_type: string;
  completion_pct: number;
  cost: number;
  status: string;
  is_critical: boolean;
  downstream_count: number;
}

export interface DAGEdge {
  from: string;
  to: string;
}

export interface BottleneckRisk {
  component_id: string;
  project_id: string;
  project_name: string;
  agency: string;
  completion_pct: number;
  downstream_components_blocked: number;
  downstream_budget_at_risk_cr_tk: number;
  risk_score: number;
  is_critical_path: boolean;
}

export interface DependencyDAGData {
  is_dag: boolean;
  cycles_detected: number;
  cycles: string[][];
  total_nodes: number;
  total_edges: number;
  critical_path_length: number;
  nodes: DAGNode[];
  edges: DAGEdge[];
  top_bottlenecks: BottleneckRisk[];
}

export interface DBStatus {
  status: string;
  last_updated: string;
  projects_count: number;
  components_count: number;
  db_engine: string;
}

export interface AnalyticsOverview {
  total_projects: number;
  total_proposals: number;
  pending_proposals: number;
  approved_proposals: number;
  total_budget_cr_tk: number;
  actual_spent_cr_tk: number;
  average_completion_pct: number;
  running_projects: number;
  delayed_projects: number;
  completed_projects: number;
  active_components: number;
  average_rating: number;
  total_feedbacks: number;
}

export interface PlannedVsProjectedSeries {
  year: string;
  planned_budget: number;
  projected_budget: number;
  actual_spent: number;
  active_projects: number;
}

export interface LocationDistribution {
  location: string;
  project_count: number;
  total_budget: number;
  avg_completion: number;
  limit: number;
}

export interface ReasoningTrace {
  summary: string;
  durationMs: number;
  steps: string[];
}

export interface GenerativeMetricPill {
  label: string;
  value: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';
}

export interface GenerativeSeverityItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string;
  agency?: string;
  projectId?: string;
}

export interface WhatIfSimulationResult {
  isSimulation: boolean;
  scenarioTitle: string;
  parameters: {
    targetType: 'agency' | 'zone' | 'project' | 'budget';
    targetName: string;
    delayDays?: number;
    budgetCudPct?: number;
  };
  baselineMakespanDays: number;
  simulatedMakespanDays: number;
  makespanDeltaDays: number;
  newlyDelayedProjectsCount: number;
  affectedProjects: Array<{
    project_id: string;
    name: string;
    exec: string;
    originalEnd?: string;
    newProjectedEnd?: string;
    slippageDays: number;
  }>;
  fiscalImpactCrTk: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  reasoningTrace?: ReasoningTrace;
  artifacts?: {
    metricPills?: GenerativeMetricPill[];
    severityTable?: GenerativeSeverityItem[];
    clickableProjects?: string[];
    clickableZones?: string[];
    whatIfSimulation?: WhatIfSimulationResult;
    actionButtons?: Array<{
      action: 'map' | 'gantt' | 'whatif' | 'ecnec_memo';
      label: string;
      icon?: string;
    }>;
  };
  source?: string;
}

export interface AIStatusResponse {
  connected: boolean;
  provider: string;
  model: string;
  latency_ms: number;
  projects_indexed: number;
}

export interface AIAdvisorResponse {
  analysis: string;
  bottlenecks: string[];
  recommendations: string[];
  metrics: Record<string, any>;
  source: string;
  reasoning_trace?: ReasoningTrace;
  artifacts?: {
    metricPills?: GenerativeMetricPill[];
    severityTable?: GenerativeSeverityItem[];
    clickableProjects?: string[];
    clickableZones?: string[];
    whatIfSimulation?: WhatIfSimulationResult;
    actionButtons?: Array<{
      action: 'map' | 'gantt' | 'whatif' | 'ecnec_memo';
      label: string;
      icon?: string;
    }>;
  };
}

export interface User {
  username: string;
  role: 'SYSADMIN' | 'ECNEC' | 'MOP' | 'EXEC' | 'APP' | string;
  committee?: string;
  agency?: string;
}

// ----------------- Predictive Risk & Overrun Types -----------------
export type RiskTier = 'Low' | 'Elevated' | 'Critical';

export interface ProjectRiskForecast {
  project_id: string;
  name: string;
  risk_score: number; // 0 - 100
  risk_tier: RiskTier;
  delay_probability_pct: number;
  forecasted_final_cost: number; // in Crore Tk
  forecasted_overrun_pct: number;
  predicted_delay_days: number;
  top_risk_drivers: string[];
  variance_factors: {
    critical_path_strain: number; // 0 - 100
    agency_workload_stress: number; // 0 - 100
    schedule_slippage: number; // 0 - 100
    citizen_friction: number; // 0 - 100
    historical_burn_pace: number; // 0 - 100
  };
}

// ----------------- Live Municipal Telemetry Types -----------------
export interface ZoneTelemetry {
  zone_id: string;
  name: string;
  latitude: number;
  longitude: number;
  traffic_index: number; // 0 - 100%
  noise_db: number; // 40 - 100 dB
  aqi: number; // 50 - 300
  field_crews: number;
  active_projects: string[];
}

export interface CityTelemetrySnapshot {
  timestamp: string;
  overall_traffic_congestion: number; // 0 - 100%
  peak_noise_db: number;
  avg_aqi: number;
  active_field_crews: number;
  zones: ZoneTelemetry[];
  hotspot_alert?: {
    zone: string;
    traffic_index: number;
    related_project_id?: string;
    related_project_name?: string;
    message: string;
  };
}

// ----------------- Citizen Civic Reporting Types -----------------
export type CivicIssueCategory =
  | 'Traffic Bottleneck'
  | 'Road Damage'
  | 'Waterlogging'
  | 'Work Stalled'
  | 'Safety Hazard'
  | string;

export interface CivicIssue {
  id: string;
  project_id: string;
  project_name?: string;
  category: CivicIssueCategory;
  description: string;
  citizen_name: string;
  citizen_phone?: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  upvotes: number;
  has_upvoted?: boolean;
  status: 'Open' | 'Under Investigation' | 'Remediated';
  created_at: string;
}

// ----------------- Immutable Audit Chain Types -----------------
export interface AuditChainEntry {
  index: number;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  prev_hash: string;
  hash: string;
  verified?: boolean;
}

export interface AuditVerificationResult {
  valid: boolean;
  chain_length: number;
  latest_hash: string;
  violations: string[];
  verified_at: string;
}

// ----------------- Scale Benchmark Types -----------------
export interface ScaleBenchmarkResult {
  total_projects: number;
  total_components: number;
  total_constraints: number;
  execution_time_ms: number;
  throughput_items_per_sec: number;
  dag_acyclic: boolean;
  precedence_satisfaction_pct: number;
  resource_conflicts_resolved: number;
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

