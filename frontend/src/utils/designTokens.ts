/**
 * CivicGrid Unified Government-Grade Design System Tokens
 * Standardizes colors, status badges, focus rings, and elevation across all platform modules.
 */

export type ProjectStatusType = 'Running' | 'Delayed' | 'Completed' | 'Approved' | 'Proposed' | 'At Risk' | 'Blocked';

export interface StatusBadgeToken {
  bgLight: string;
  textLight: string;
  borderLight: string;
  bgDark: string;
  textDark: string;
  borderDark: string;
  dotColor: string;
  badgeClass: string;
  hex: string;
}

export const STATUS_TOKENS: Record<string, StatusBadgeToken> = {
  Running: {
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    bgDark: 'dark:bg-emerald-950/60',
    textDark: 'dark:text-emerald-300',
    borderDark: 'dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    hex: '#10b981',
  },
  Delayed: {
    bgLight: 'bg-rose-50',
    textLight: 'text-rose-700',
    borderLight: 'border-rose-200',
    bgDark: 'dark:bg-rose-950/60',
    textDark: 'dark:text-rose-300',
    borderDark: 'dark:border-rose-800',
    dotColor: 'bg-rose-500',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    hex: '#ef4444',
  },
  'At Risk': {
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-700',
    borderLight: 'border-amber-200',
    bgDark: 'dark:bg-amber-950/60',
    textDark: 'dark:text-amber-300',
    borderDark: 'dark:border-amber-800',
    dotColor: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    hex: '#f59e0b',
  },
  Blocked: {
    bgLight: 'bg-orange-50',
    textLight: 'text-orange-700',
    borderLight: 'border-orange-200',
    bgDark: 'dark:bg-orange-950/60',
    textDark: 'dark:text-orange-300',
    borderDark: 'dark:border-orange-800',
    dotColor: 'bg-orange-500',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    hex: '#ea580c',
  },
  Completed: {
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-700',
    borderLight: 'border-blue-200',
    bgDark: 'dark:bg-blue-950/60',
    textDark: 'dark:text-blue-300',
    borderDark: 'dark:border-blue-800',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    hex: '#3b82f6',
  },
  Approved: {
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-700',
    borderLight: 'border-purple-200',
    bgDark: 'dark:bg-purple-950/60',
    textDark: 'dark:text-purple-300',
    borderDark: 'dark:border-purple-800',
    dotColor: 'bg-purple-500',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    hex: '#8b5cf6',
  },
  Proposed: {
    bgLight: 'bg-indigo-50',
    textLight: 'text-indigo-700',
    borderLight: 'border-indigo-200',
    bgDark: 'dark:bg-indigo-950/60',
    textDark: 'dark:text-indigo-300',
    borderDark: 'dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    hex: '#6366f1',
  },
};

export function getStatusBadgeClass(status?: string): string {
  if (!status) return STATUS_TOKENS.Running.badgeClass;
  return STATUS_TOKENS[status]?.badgeClass || STATUS_TOKENS.Running.badgeClass;
}

export function getStatusColorHex(status?: string): string {
  if (!status) return STATUS_TOKENS.Running.hex;
  return STATUS_TOKENS[status]?.hex || STATUS_TOKENS.Running.hex;
}

// Focus ring standard for accessible keyboard navigation
export const FOCUS_RING =
  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-shadow';

// Card elevation and glassmorphic surface tokens
export const CARD_SURFACE =
  'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm rounded-2xl';

export const CARD_HEADER =
  'p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40 rounded-t-2xl';

export const DIALOG_SURFACE =
  'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl';
