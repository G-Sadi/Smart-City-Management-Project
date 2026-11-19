import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Calendar, Clock, CheckCircle2, 
  AlertTriangle, Download, RefreshCw, Layers, MapPin, Building2,
  Printer, GitBranch, ArrowRight, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import { AnalyticsOverview, PlannedVsProjectedSeries, LocationDistribution, Agency, Project } from '../types';
import { api } from '../api';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark } = useTheme();
  const [timelineSeries, setTimelineSeries] = useState<PlannedVsProjectedSeries[]>([]);
  const [locationDist, setLocationDist] = useState<LocationDistribution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Gantt filter state
  const [ganttAgency, setGanttAgency] = useState<string>('ALL');
  const [ganttStatus, setGanttStatus] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getPlannedVsProjected(),
      api.getLocationDistribution(),
      api.getProjects()
    ])
      .then(([seriesData, locData, projData]) => {
        setTimelineSeries(seriesData);
        setLocationDist(locData);
        setProjects(projData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics series:', err);
        setLoading(false);
      });
  }, []);

  const handleExportCsv = async () => {
    if (api.isBackendConnected()) {
      window.open('/api/projects/export/csv', '_blank');
      return;
    }
    try {
      const projList = projects.length > 0 ? projects : await api.getProjects();
      const headers = [
        "Project ID", "Name", "Location", "Agency", "Cost (Cr Tk)", "Timespan (Yrs)",
        "Start Date", "Planned End Date", "Projected End Date", "Completion %",
        "Actual Cost (Cr Tk)", "Status", "Goal"
      ];
      const rows = projList.map(p => [
        `"${p.project_id}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${p.location || ''}"`,
        `"${p.exec || ''}"`,
        p.cost,
        p.timespan,
        p.start_date || '',
        p.planned_end_date || '',
        p.projected_end_date || '',
        p.completion,
        p.actual_cost,
        `"${p.status || ''}"`,
        `"${(p.goal || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civicgrid_revised_schedule_export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export CSV failed:', err);
    }
  };

  const handleExportJson = async () => {
    if (api.isBackendConnected()) {
      window.open('/api/projects/export/json', '_blank');
      return;
    }
    try {
      const projList = projects.length > 0 ? projects : await api.getProjects();
      const exportBundle = {
        app: "CivicGrid Smart City OS",
        exported_at: new Date().toISOString(),
        total_projects: projList.length,
        overview: overview,
        projects: projList
      };
      const jsonContent = JSON.stringify(exportBundle, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civicgrid_full_audit_state.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export JSON failed:', err);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Filter projects for Gantt view
  const ganttProjects = projects
    .filter(p => {
      if (ganttAgency !== 'ALL' && p.exec !== ganttAgency) return false;
      if (ganttStatus !== 'ALL' && p.status !== ganttStatus) return false;
      return true;
    })
    .slice(0, 15); // Top 15 for readable Gantt inspection

  // Gantt time range calculations (2021 to 2028 = 7 years = 84 months)
  const baseYear = 2021;
  const totalYears = 8;

  const getMonthOffset = (dateStr?: string) => {
    if (!dateStr) return 0;
    const parts = dateStr.split('-');
    if (parts.length < 2) return 0;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return Math.max(0, (y - baseYear) * 12 + (m - 1));
  };

  const getDurationMonths = (startStr?: string, endStr?: string) => {
    const s = getMonthOffset(startStr);
    const e = getMonthOffset(endStr);
    return Math.max(6, e - s);
  };

  return (
    <div className="space-y-6 print-container">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Planned vs. Projected Infrastructure Analytics & Gantt Projections</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time RCPSP timeline variance, annual capital expenditure, and municipal saturation metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            title="Download JSON state"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Full Audit JSON</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive PDF</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Charts: Planned vs Projected Budget & Project Count */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Annual Budget Composed Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
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
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={isDark ? 0.4 : 0.8} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} stroke={isDark ? '#475569' : '#cbd5e1'} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} stroke={isDark ? '#475569' : '#cbd5e1'} unit=" Cr" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} stroke={isDark ? '#475569' : '#cbd5e1'} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} ${name === 'Active Projects' ? 'Projects' : 'Cr Tk'}`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: isDark ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: isDark ? '#cbd5e1' : '#475569' }} />
                <Bar yAxisId="left" dataKey="planned_budget" name="Planned Budget" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar yAxisId="left" dataKey="projected_budget" name="Projected Budget" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Line yAxisId="left" type="monotone" dataKey="actual_spent" name="Actual Spent" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="active_projects" name="Active Projects" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Saturation Bar Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Location Density & Concurrency Limits</span>
            </h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationDist.slice(0, 7)} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={isDark ? 0.4 : 0.8} />
                <XAxis type="number" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} stroke={isDark ? '#475569' : '#cbd5e1'} />
                <YAxis dataKey="location" type="category" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} stroke={isDark ? '#475569' : '#cbd5e1'} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Projects`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: isDark ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: isDark ? '#cbd5e1' : '#475569' }} />
                <Bar dataKey="project_count" name="Active Projects" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="limit" name="Max Concurrency Limit" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Gantt Timeline & RCPSP Dependency Schedule */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Interactive Gantt Timeline: Baseline Planned vs. RCPSP Projected</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing start dates, baseline finish dates, and schedule delay extensions.
            </p>
          </div>

          <div className="flex items-center space-x-2 no-print">
            <select
              value={ganttAgency}
              onChange={e => setGanttAgency(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Agencies</option>
              {agencies.filter(a => a.type === 'EXEC').map(a => (
                <option key={a.code} value={a.code}>{a.code}</option>
              ))}
            </select>

            <select
              value={ganttStatus}
              onChange={e => setGanttStatus(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="Running">Running</option>
              <option value="Delayed">Delayed Only ⚠️</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Gantt Timeline Header Years */}
        <div className="overflow-x-auto">
          <div className="min-w-[650px] space-y-2">
            {/* Year Scale Bar */}
            <div className="grid grid-cols-12 text-[11px] font-mono font-bold text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-800">
              <div className="col-span-4">Project Entity</div>
              <div className="col-span-8 grid grid-cols-8 text-center">
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
                <span>2027</span>
                <span>2028</span>
              </div>
            </div>

            {/* Gantt Rows */}
            {ganttProjects.map(p => {
              const startOffset = getMonthOffset(p.start_date);
              const plannedDur = getDurationMonths(p.start_date, p.planned_end_date);
              const projDur = getDurationMonths(p.start_date, p.projected_end_date || p.planned_end_date);
              const isDelayed = p.status === 'Delayed';

              // Convert months to percentage of 96 total months (8 years)
              const totalMonths = totalYears * 12;
              const leftPct = Math.min(90, Math.max(0, (startOffset / totalMonths) * 100));
              const plannedWidthPct = Math.min(100 - leftPct, Math.max(4, (plannedDur / totalMonths) * 100));
              const delayExtraPct = isDelayed 
                ? Math.min(100 - leftPct - plannedWidthPct, Math.max(3, ((projDur - plannedDur) / totalMonths) * 100))
                : 0;

              return (
                <div key={p.project_id} className="grid grid-cols-12 items-center py-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-lg transition text-xs">
                  {/* Left Label */}
                  <div className="col-span-4 pr-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-[10px] text-slate-500">{p.project_id}</span>
                      <h5 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{p.name}</h5>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      📍 {p.location} • 🏛️ {p.exec} • {p.completion}% complete
                    </span>
                  </div>

                  {/* Right Timeline Bar Container */}
                  <div className="col-span-8 relative h-7 bg-slate-100/60 dark:bg-slate-800/60 rounded-md overflow-hidden">
                    {/* Planned Bar */}
                    <div
                      className="absolute top-1.5 h-4 bg-emerald-500/90 rounded-sm shadow-xs flex items-center justify-end pr-1 text-[9px] font-bold text-white transition-all"
                      style={{
                        left: `${leftPct}%`,
                        width: `${plannedWidthPct}%`
                      }}
                      title={`Planned: ${p.start_date} to ${p.planned_end_date}`}
                    >
                      <span className="hidden sm:inline">{p.planned_end_date?.substring(0, 7)}</span>
                    </div>

                    {/* Delay Extension Bar if delayed */}
                    {isDelayed && delayExtraPct > 0 && (
                      <div
                        className="absolute top-1.5 h-4 bg-rose-500 rounded-r-sm shadow-xs flex items-center justify-center text-[9px] font-bold text-white transition-all"
                        style={{
                          left: `${leftPct + plannedWidthPct}%`,
                          width: `${delayExtraPct}%`
                        }}
                        title={`Projected Delay: finishes ${p.projected_end_date}`}
                      >
                        <span className="hidden sm:inline">⚠️ Delay</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
