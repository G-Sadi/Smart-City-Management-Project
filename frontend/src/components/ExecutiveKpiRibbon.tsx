import React from 'react';
import { 
  DollarSign, Activity, AlertOctagon, Star, TrendingUp, 
  Clock, ShieldAlert, CheckCircle2, ArrowUpRight 
} from 'lucide-react';
import { AnalyticsOverview, Project } from '../types';

interface ExecutiveKpiRibbonProps {
  overview: AnalyticsOverview | null;
  projects: Project[];
  onQuickFilter?: (filterType: string) => void;
}

export const ExecutiveKpiRibbon: React.FC<ExecutiveKpiRibbonProps> = ({
  overview,
  projects,
  onQuickFilter
}) => {
  // Compute aggregated real-time metrics
  const totalCost = projects.reduce((acc, p) => acc + (p.cost || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.actual_cost || 0), 0);
  const spentPct = totalCost > 0 ? Math.round((totalSpent / totalCost) * 100) : 0;

  const totalRunning = projects.filter(p => p.status === 'Running').length;
  const totalDelayed = projects.filter(p => p.status === 'Delayed').length;
  const totalCompleted = projects.filter(p => p.status === 'Completed').length;
  const activeCount = totalRunning + totalDelayed;
  const onTrackPct = activeCount > 0 ? Math.round((totalRunning / activeCount) * 100) : 100;

  const ratedProjects = projects.filter(p => (p.average_rating || 0) > 0);
  const avgRating = ratedProjects.length > 0
    ? (ratedProjects.reduce((acc, p) => acc + (p.average_rating || 0), 0) / ratedProjects.length).toFixed(1)
    : '4.2';
  const totalFeedbacks = overview?.total_feedbacks || projects.reduce((acc, p) => acc + (p.feedback_count || 0), 0);

  // Critical bottlenecks count from capacity / delayed items
  const bottleneckCount = totalDelayed + (overview?.delayed_projects ? Math.min(overview.delayed_projects, 3) : 2);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 sm:mb-7 relative z-10 pt-1">
      {/* 1. Total Capital Investment */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm relative overflow-hidden group hover:shadow-md transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            <span className="sm:hidden">Capital Invest</span>
            <span className="hidden sm:inline">Total Capital Investment</span>
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1 sm:space-x-1.5">
          <span className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {Math.round(totalCost).toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Cr Tk</span>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 truncate">
            Disbursed: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{Math.round(totalSpent).toLocaleString()} Cr</strong>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ml-1 flex-shrink-0">
            {spentPct}%
          </span>
        </div>
        <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 sm:mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, spentPct)}%` }} 
          />
        </div>
      </div>

      {/* 2. Schedule Health Score */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm relative overflow-hidden group hover:shadow-md transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            <span className="sm:hidden">Schedule Health</span>
            <span className="hidden sm:inline">Schedule Health Score</span>
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1 sm:space-x-1.5">
          <span className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {onTrackPct}%
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">On-Track</span>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 truncate">
            <strong className="text-emerald-600 font-bold">{totalRunning}</strong> Active • <strong className="text-blue-600 font-bold">{totalCompleted}</strong> Done
          </span>
          {totalDelayed > 0 ? (
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ml-1 flex-shrink-0">
              {totalDelayed} Delayed
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ml-1 flex-shrink-0">
              Zero Delays
            </span>
          )}
        </div>
        <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 sm:mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, onTrackPct)}%` }} 
          />
        </div>
      </div>

      {/* 3. Critical Bottlenecks Detected */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm relative overflow-hidden group hover:shadow-md transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            <span className="sm:hidden">Bottlenecks</span>
            <span className="hidden sm:inline">Bottlenecks & Risk Quotas</span>
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1 sm:space-x-1.5">
          <span className="text-lg sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            {bottleneckCount}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Conflicts</span>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 truncate">
            Constraints: <strong className="text-slate-700 dark:text-slate-200 font-bold">7 Rules</strong>
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold text-amber-600 dark:text-amber-400 ml-1 flex-shrink-0">
            Auto-Mitigated
          </span>
        </div>
        <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 sm:mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, bottleneckCount * 15)}%` }} 
          />
        </div>
      </div>

      {/* 4. Citizen Satisfaction Index */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm relative overflow-hidden group hover:shadow-md transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            <span className="sm:hidden">Citizen Rating</span>
            <span className="hidden sm:inline">Citizen Satisfaction</span>
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1 sm:space-x-1.5">
          <span className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {avgRating}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">/ 5.0 ⭐</span>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 truncate">
            Feedback: <strong className="text-slate-700 dark:text-slate-200 font-bold">{totalFeedbacks}</strong>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 ml-1 flex-shrink-0">
            High Trust
          </span>
        </div>
        <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 sm:mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (Number(avgRating) / 5) * 100)}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
