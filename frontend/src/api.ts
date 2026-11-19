import {
  Project, ProjectDetail, Proposal, ComponentItem, Agency,
  ConstraintItem, IngestionAudit, AnalyticsOverview,
  PlannedVsProjectedSeries, LocationDistribution,
  AIAdvisorResponse, TimeframeSuggestion, User
} from './types';
import { browserEngine } from './browserEngine';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Connection state tracking
let isBackendOnline: boolean | null = null;
const listeners: Array<(online: boolean) => void> = [];

export function subscribeBackendStatus(fn: (online: boolean) => void) {
  listeners.push(fn);
  if (isBackendOnline !== null) fn(isBackendOnline);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function setBackendStatus(status: boolean) {
  if (isBackendOnline !== status) {
    isBackendOnline = status;
    listeners.forEach(fn => fn(status));
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${API_BASE}/analytics/overview`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    const online = res.ok;
    setBackendStatus(online);
    return online;
  } catch {
    setBackendStatus(false);
    return false;
  }
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('civicgrid_token') || localStorage.getItem('samurai_token');
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
  isBackendConnected: () => isBackendOnline === true,

  // Auth
  quickLogin: async (roleType: string): Promise<{ access_token: string; user: User }> => {
    if (await checkBackendHealth()) {
      try {
        const data = await request<{ access_token: string; user: User }>(`/auth/quick-login?role_type=${roleType}`, {
          method: 'POST',
        });
        localStorage.setItem('civicgrid_token', data.access_token);
        localStorage.setItem('civicgrid_user', JSON.stringify(data.user));
        localStorage.setItem('samurai_token', data.access_token);
        localStorage.setItem('samurai_user', JSON.stringify(data.user));
        return data;
      } catch (e) {
        console.warn('Backend login failed, using browser auth fallback', e);
      }
    }

    // Fallback in-browser quick login
    const roleMap: Record<string, User> = {
      SYSADMIN: { username: 'admin', role: 'SYSADMIN', committee: 'System Admin' },
      ECNEC: { username: 'ecnec_officer', role: 'ECNEC', committee: 'Executive Committee of the National Economic Council' },
      MOP: { username: 'mop_officer', role: 'MOP', committee: 'Ministry of Planning' },
      EXEC_LGD: { username: 'lgd_officer', role: 'EXEC', committee: 'Local Government Division', agency: 'LGD' },
      EXEC_MOEDU: { username: 'moedu_officer', role: 'EXEC', committee: 'Ministry of Education', agency: 'MOEDU' },
      EXEC_PWD: { username: 'pwd_officer', role: 'EXEC', committee: 'Public Works Department', agency: 'PWD' },
      APP: { username: 'citizen', role: 'APP', committee: 'Citizen Application User' },
    };

    const user = roleMap[roleType] || roleMap.APP;
    localStorage.setItem('civicgrid_token', 'browser-demo-token');
    localStorage.setItem('civicgrid_user', JSON.stringify(user));
    localStorage.setItem('samurai_token', 'browser-demo-token');
    localStorage.setItem('samurai_user', JSON.stringify(user));
    return { access_token: 'browser-demo-token', user };
  },

  getMe: async (): Promise<User> => {
    if (await checkBackendHealth()) {
      try {
        return await request<User>('/auth/me');
      } catch {
        // fallback
      }
    }
    const saved = localStorage.getItem('civicgrid_user') || localStorage.getItem('samurai_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return { username: 'guest', role: 'APP', committee: 'Citizen Public User' };
  },

  logout: () => {
    localStorage.removeItem('civicgrid_token');
    localStorage.removeItem('civicgrid_user');
    localStorage.removeItem('samurai_token');
    localStorage.removeItem('samurai_user');
  },

  // Projects
  getProjects: async (params?: { location?: string; agency?: string; status?: string; search?: string; min_rating?: number }): Promise<Project[]> => {
    if (await checkBackendHealth()) {
      try {
        const q = new URLSearchParams();
        if (params?.location) q.append('location', params.location);
        if (params?.agency) q.append('agency', params.agency);
        if (params?.status) q.append('status', params.status);
        if (params?.search) q.append('search', params.search);
        if (params?.min_rating) q.append('min_rating', String(params.min_rating));
        return await request<Project[]>(`/projects?${q.toString()}`);
      } catch (err) {
        console.warn('Backend getProjects failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getProjects(params);
  },

  getProjectDetail: async (id: string): Promise<ProjectDetail> => {
    if (await checkBackendHealth()) {
      try {
        return await request<ProjectDetail>(`/projects/${id}`);
      } catch (err) {
        console.warn('Backend getProjectDetail failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getProjectDetail(id);
  },

  updateProjectProgress: async (id: string, completion: number, actual_cost?: number, component_updates?: any[]): Promise<ProjectDetail> => {
    if (await checkBackendHealth()) {
      try {
        return await request<ProjectDetail>(`/projects/${id}/progress`, {
          method: 'PUT',
          body: JSON.stringify({ completion, actual_cost, component_updates }),
        });
      } catch (err) {
        console.warn('Backend update failed, falling back to browser engine', err);
      }
    }
    return browserEngine.updateProjectProgress(id, completion, actual_cost, component_updates);
  },

  submitCitizenFeedback: async (id: string, rating: number, comment: string, citizen_name?: string) => {
    if (await checkBackendHealth()) {
      try {
        return await request(`/projects/${id}/feedback`, {
          method: 'POST',
          body: JSON.stringify({ rating, comment, citizen_name }),
        });
      } catch (err) {
        console.warn('Backend feedback submit failed, falling back to browser engine', err);
      }
    }
    return browserEngine.submitCitizenFeedback(id, rating, comment, citizen_name);
  },

  // Proposals
  getProposals: async (params?: { authority?: string; agency?: string; status?: string }): Promise<Proposal[]> => {
    if (await checkBackendHealth()) {
      try {
        const q = new URLSearchParams();
        if (params?.authority) q.append('authority', params.authority);
        if (params?.agency) q.append('agency', params.agency);
        if (params?.status) q.append('status', params.status);
        return await request<Proposal[]>(`/proposals?${q.toString()}`);
      } catch (err) {
        console.warn('Backend getProposals failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getProposals(params);
  },

  suggestTimeframe: async (cost: number, timespan: number, exec_agency: string, location: string, dependency_id?: string): Promise<TimeframeSuggestion> => {
    if (await checkBackendHealth()) {
      try {
        const q = new URLSearchParams({
          cost: String(cost),
          timespan: String(timespan),
          exec_agency,
          location,
        });
        if (dependency_id) q.append('dependency_id', dependency_id);
        return await request<TimeframeSuggestion>(`/proposals/suggest-timeframe?${q.toString()}`, {
          method: 'POST',
        });
      } catch (err) {
        console.warn('Backend suggestTimeframe failed, falling back to browser engine', err);
      }
    }
    return browserEngine.suggestOptimalTimeframe(cost, timespan, exec_agency, location, dependency_id);
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
    if (await checkBackendHealth()) {
      try {
        return await request<Proposal>('/proposals', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn('Backend createProposal failed, falling back to browser engine', err);
      }
    }
    return browserEngine.createProposal(data);
  },

  approveProposal: async (id: string, notes?: string, approved_start_date?: string) => {
    if (await checkBackendHealth()) {
      try {
        return await request<{ message: string; project_id: string }>(`/proposals/${id}/approve`, {
          method: 'POST',
          body: JSON.stringify({ review_notes: notes, approved_start_date }),
        });
      } catch (err) {
        console.warn('Backend approve failed, falling back to browser engine', err);
      }
    }
    return browserEngine.approveProposal(id, notes, approved_start_date);
  },

  rejectProposal: async (id: string, reason: string) => {
    if (await checkBackendHealth()) {
      try {
        return await request<{ message: string; reason: string }>(`/proposals/${id}/reject`, {
          method: 'POST',
          body: JSON.stringify({ rejection_reason: reason }),
        });
      } catch (err) {
        console.warn('Backend reject failed, falling back to browser engine', err);
      }
    }
    return browserEngine.rejectProposal(id, reason);
  },

  // Components
  getComponents: async (params?: { agency?: string; project_id?: string; status?: string }): Promise<ComponentItem[]> => {
    if (await checkBackendHealth()) {
      try {
        const q = new URLSearchParams();
        if (params?.agency) q.append('agency', params.agency);
        if (params?.project_id) q.append('project_id', params.project_id);
        if (params?.status) q.append('status', params.status);
        return await request<ComponentItem[]>(`/components?${q.toString()}`);
      } catch (err) {
        console.warn('Backend getComponents failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getComponents(params);
  },

  updateComponentProgress: async (componentId: string, completion_pct: number, spent_cost?: number): Promise<ComponentItem> => {
    if (await checkBackendHealth()) {
      try {
        return await request<ComponentItem>(`/components/${componentId}/progress`, {
          method: 'PUT',
          body: JSON.stringify({ component_id: componentId, completion_pct, spent_cost }),
        });
      } catch (err) {
        console.warn('Backend updateComponentProgress failed, falling back to browser engine', err);
      }
    }
    return browserEngine.updateComponentProgress(componentId, completion_pct, spentCostSafe(spent_cost));
  },

  // Agencies & Constraints
  getAgencies: async (): Promise<Agency[]> => {
    if (await checkBackendHealth()) {
      try {
        return await request<Agency[]>('/agencies');
      } catch (err) {
        console.warn('Backend getAgencies failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getAgencies();
  },

  getConstraints: async (): Promise<ConstraintItem[]> => {
    if (await checkBackendHealth()) {
      try {
        return await request<ConstraintItem[]>('/constraints');
      } catch (err) {
        console.warn('Backend getConstraints failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getConstraints();
  },

  createConstraint: async (c: Partial<ConstraintItem>): Promise<ConstraintItem> => {
    if (await checkBackendHealth()) {
      try {
        return await request<ConstraintItem>('/constraints', {
          method: 'POST',
          body: JSON.stringify(c),
        });
      } catch (err) {
        console.warn('Backend createConstraint failed, falling back to browser engine', err);
      }
    }
    return browserEngine.createConstraint(c);
  },

  deleteConstraint: async (id: number): Promise<{ message: string }> => {
    if (await checkBackendHealth()) {
      try {
        return await request<{ message: string }>(`/constraints/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Backend deleteConstraint failed, falling back to browser engine', err);
      }
    }
    return browserEngine.deleteConstraint(id);
  },

  // Sync & Recalculate Button
  syncAndRecalculate: async (): Promise<{ status: string; message: string; details: any; bottlenecks: any }> => {
    if (await checkBackendHealth()) {
      try {
        return await request('/sync-recalculate', {
          method: 'POST',
        });
      } catch (err) {
        console.warn('Backend sync failed, recalculating in browser', err);
      }
    }
    browserEngine.recalculateAllSchedules();
    return {
      status: 'success',
      message: 'Browser Engine synchronized and RCPSP schedules recalculated successfully.',
      details: { recalculated_at: new Date().toISOString() },
      bottlenecks: {},
    };
  },

  // Audit & CSV Ingestion
  reingestCsv: async (): Promise<any> => {
    if (await checkBackendHealth()) {
      try {
        return await request('/ingest-csv', {
          method: 'POST',
        });
      } catch (err) {
        console.warn('Backend reingest failed, resetting browser storage', err);
      }
    }
    return browserEngine.reingestCsv();
  },

  getAuditReports: async (): Promise<IngestionAudit[]> => {
    if (await checkBackendHealth()) {
      try {
        return await request<IngestionAudit[]>('/audit-report');
      } catch (err) {
        console.warn('Backend getAuditReports failed, using browser audits', err);
      }
    }
    return browserEngine.getAuditReports();
  },

  // AI Advisor
  getAIAdvice: async (query_type: string, project_id?: string, proposal_id?: string, user_prompt?: string): Promise<AIAdvisorResponse> => {
    if (await checkBackendHealth()) {
      try {
        return await request<AIAdvisorResponse>('/ai-advisor', {
          method: 'POST',
          body: JSON.stringify({ query_type, project_id, proposal_id, user_prompt }),
        });
      } catch (err) {
        console.warn('Backend AI advisor failed, falling back to browser intelligence engine', err);
      }
    }
    return browserEngine.getAIAdvice(query_type, project_id, proposal_id, user_prompt);
  },

  // Analytics
  getAnalyticsOverview: async (): Promise<AnalyticsOverview> => {
    if (await checkBackendHealth()) {
      try {
        return await request<AnalyticsOverview>('/analytics/overview');
      } catch (err) {
        console.warn('Backend getAnalyticsOverview failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getAnalyticsOverview();
  },

  getPlannedVsProjected: async (): Promise<PlannedVsProjectedSeries[]> => {
    if (await checkBackendHealth()) {
      try {
        return await request<PlannedVsProjectedSeries[]>('/analytics/planned-vs-projected');
      } catch (err) {
        console.warn('Backend getPlannedVsProjected failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getPlannedVsProjected();
  },

  getLocationDistribution: async (): Promise<LocationDistribution[]> => {
    if (await checkBackendHealth()) {
      try {
        return await request<LocationDistribution[]>('/analytics/location-distribution');
      } catch (err) {
        console.warn('Backend getLocationDistribution failed, falling back to browser engine', err);
      }
    }
    return browserEngine.getLocationDistribution();
  },
};

function spentCostSafe(val?: number): number | undefined {
  return val !== undefined ? val : undefined;
}
