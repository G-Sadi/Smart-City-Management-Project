import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Calendar, Clock, CheckCircle2, 
  AlertTriangle, Download, RefreshCw, Layers, MapPin, Building2 
} from 'lucide-react';
import { AnalyticsOverview, PlannedVsProjectedSeries, LocationDistribution, Agency } from '../types';
import { api } from '../api';

interface AnalyticsDashboardProps {
  overview: AnalyticsOverview | null;
  agencies: Agency[];
  onRefresh: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  overview,
  agencies,
  onRefresh
}) => {
  const [timelineSeries, setTimelineSeries] = useState<PlannedVsProjectedSeries[]>([]);
  const [locationDist, setLocationDist] = useState<LocationDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getPlannedVsProjected(),
      api.getLocationDistribution()
    ])
      .then(([seriesData, locData]) => {
        setTimelineSeries(seriesData);
        setLocationDist(locData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics series:', err);
        setLoading(false);
      });
  }, []);

  const handleExportCsv = () => {
    window.open('/api/projects/export/csv', '_blank');
  };

  const handleExportJson = () => {
    window.open('/api/projects/export/json', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Planned vs. Projected Infrastructure Analytics & Gantt Projections</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time RCPSP timeline variance, annual capital expenditure, and municipal saturation metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Capital Budget</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {overview.total_budget_cr_tk.toLocaleString()} <span className="text-xs font-normal text-slate-500">Cr Tk</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
              Actual Spent: {overview.actual_spent_cr_tk} Cr Tk
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Civil Progress Velocity</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {overview.average_completion_pct}%
            </div>
            <span className="text-[10px] text-slate-400 block">
              Across {overview.total_projects} active projects
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Schedule Health</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {overview.running_projects} <span className="text-xs font-normal text-emerald-600 font-semibold">Running</span>
              </span>
              {overview.delayed_projects > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  {overview.delayed_projects} Delayed
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">
              {overview.completed_projects} Completed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pending DPP Proposals</span>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {overview.pending_proposals} <span className="text-xs font-normal text-slate-500">In Pipeline</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Avg Citizen Rating: {overview.average_rating} ⭐ ({overview.total_feedbacks} reviews)
            </span>
          </div>
        </div>
      )}

      {/* Main Charts: Planned vs Projected Budget & Project Count */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Annual Budget Composed Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Annual Expenditure: Planned vs. Projected Timeline (Crore BDT)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Fiscal Years 2021 - 2028</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineSeries} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit=" Cr" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} ${name === 'Active Projects' ? 'Projects' : 'Cr Tk'}`,
                    name
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="planned_budget" name="Planned Budget" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar yAxisId="left" dataKey="projected_budget" name="Projected Budget" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Line yAxisId="left" type="monotone" dataKey="actual_spent" name="Actual Spent" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="active_projects" name="Active Projects" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Saturation Bar Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Location Density & Concurrency Limits</span>
            </h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationDist.slice(0, 7)} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="location" type="category" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Projects`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="project_count" name="Active Projects" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="limit" name="Max Concurrency Limit" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agency Load and Concurrency Overview */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>Executing Agency Capacity & Concurrency Quota Monitor</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agencies.filter(a => a.type === 'EXEC').map(ag => (
            <div key={ag.code} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{ag.code}</span>
                <span className="text-[10px] text-slate-400">{ag.active_projects_count} Projects</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{ag.name}</p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs">
                <span>Active Sub-Components:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{ag.active_components_count}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total Budget Portfolio:</span>
                <strong className="text-slate-800 dark:text-slate-200">{ag.total_budget_allocated?.toLocaleString()} Cr</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
