import {
  Project, ProjectDetail, Proposal, ComponentItem, Agency,
  ConstraintItem, IngestionAudit, AnalyticsOverview,
  PlannedVsProjectedSeries, LocationDistribution,
  AIAdvisorResponse, TimeframeSuggestion, User
} from './types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('samurai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errObj = await res.json();
      errMsg = errObj.detail || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  quickLogin: async (roleType: string): Promise<{ access_token: string; user: User }> => {
    const data = await request<{ access_token: string; user: User }>(`/auth/quick-login?role_type=${roleType}`, {
      method: 'POST',
    });
    localStorage.setItem('samurai_token', data.access_token);
    localStorage.setItem('samurai_user', JSON.stringify(data.user));
    return data;
  },

  getMe: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('samurai_token');
    localStorage.removeItem('samurai_user');
  },

  // Projects
  getProjects: async (params?: { location?: string; agency?: string; status?: string; search?: string; min_rating?: number }): Promise<Project[]> => {
    const q = new URLSearchParams();
    if (params?.location) q.append('location', params.location);
    if (params?.agency) q.append('agency', params.agency);
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.min_rating) q.append('min_rating', String(params.min_rating));
    return request<Project[]>(`/projects?${q.toString()}`);
  },

  getProjectDetail: async (id: string): Promise<ProjectDetail> => {
    return request<ProjectDetail>(`/projects/${id}`);
  },

  updateProjectProgress: async (id: string, completion: number, actual_cost?: number, component_updates?: any[]): Promise<ProjectDetail> => {
    return request<ProjectDetail>(`/projects/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ completion, actual_cost, component_updates }),
    });
  },

  submitCitizenFeedback: async (id: string, rating: number, comment: string, citizen_name?: string) => {
    return request(`/projects/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment, citizen_name }),
    });
  },

  // Proposals
  getProposals: async (params?: { authority?: string; agency?: string; status?: string }): Promise<Proposal[]> => {
    const q = new URLSearchParams();
    if (params?.authority) q.append('authority', params.authority);
    if (params?.agency) q.append('agency', params.agency);
    if (params?.status) q.append('status', params.status);
    return request<Proposal[]>(`/proposals?${q.toString()}`);
  },

  suggestTimeframe: async (cost: number, timespan: number, exec_agency: string, location: string, dependency_id?: string): Promise<TimeframeSuggestion> => {
    const q = new URLSearchParams({
      cost: String(cost),
      timespan: String(timespan),
      exec_agency,
      location,
    });
    if (dependency_id) q.append('dependency_id', dependency_id);
    return request<TimeframeSuggestion>(`/proposals/suggest-timeframe?${q.toString()}`, {
      method: 'POST',
    });
  },

  createProposal: async (data: {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    exec: string;
    cost: number;
    timespan: number;
    goal?: string;
    components?: any[];
  }): Promise<Proposal> => {
    return request<Proposal>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  approveProposal: async (id: string, notes?: string, approved_start_date?: string) => {
    return request<{ message: string; project_id: string }>(`/proposals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ review_notes: notes, approved_start_date }),
    });
  },

  rejectProposal: async (id: string, reason: string) => {
    return request<{ message: string; reason: string }>(`/proposals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejection_reason: reason }),
    });
  },

  // Components
  getComponents: async (params?: { agency?: string; project_id?: string; status?: string }): Promise<ComponentItem[]> => {
    const q = new URLSearchParams();
    if (params?.agency) q.append('agency', params.agency);
    if (params?.project_id) q.append('project_id', params.project_id);
    if (params?.status) q.append('status', params.status);
    return request<ComponentItem[]>(`/components?${q.toString()}`);
  },

  updateComponentProgress: async (componentId: string, completion_pct: number, spent_cost?: number): Promise<ComponentItem> => {
    return request<ComponentItem>(`/components/${componentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ component_id: componentId, completion_pct, spent_cost }),
    });
  },

  // Agencies & Constraints
  getAgencies: async (): Promise<Agency[]> => {
    return request<Agency[]>('/agencies');
  },

  getConstraints: async (): Promise<ConstraintItem[]> => {
    return request<ConstraintItem[]>('/constraints');
  },

  createConstraint: async (c: Partial<ConstraintItem>): Promise<ConstraintItem> => {
    return request<ConstraintItem>('/constraints', {
      method: 'POST',
      body: JSON.stringify(c),
    });
  },

  deleteConstraint: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`/constraints/${id}`, {
      method: 'DELETE',
    });
  },

  // Sync & Recalculate Button
  syncAndRecalculate: async (): Promise<{ status: string; message: string; details: any; bottlenecks: any }> => {
    return request('/sync-recalculate', {
      method: 'POST',
    });
  },

  // Audit & CSV Ingestion
  reingestCsv: async (): Promise<any> => {
    return request('/ingest-csv', {
      method: 'POST',
    });
  },

  getAuditReports: async (): Promise<IngestionAudit[]> => {
    return request<IngestionAudit[]>('/audit-report');
  },

  // AI Advisor
  getAIAdvice: async (query_type: string, project_id?: string, proposal_id?: string, user_prompt?: string): Promise<AIAdvisorResponse> => {
    return request<AIAdvisorResponse>('/ai-advisor', {
      method: 'POST',
      body: JSON.stringify({ query_type, project_id, proposal_id, user_prompt }),
    });
  },

  // Analytics
  getAnalyticsOverview: async (): Promise<AnalyticsOverview> => {
    return request<AnalyticsOverview>('/analytics/overview');
  },

  getPlannedVsProjected: async (): Promise<PlannedVsProjectedSeries[]> => {
    return request<PlannedVsProjectedSeries[]>('/analytics/planned-vs-projected');
  },

  getLocationDistribution: async (): Promise<LocationDistribution[]> => {
    return request<LocationDistribution[]>('/analytics/location-distribution');
  },
};
