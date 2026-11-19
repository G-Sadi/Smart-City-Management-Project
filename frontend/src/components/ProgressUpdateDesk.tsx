import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, Sliders, CheckCircle2, AlertTriangle, 
  ArrowRight, RefreshCw, DollarSign, Calendar, GitBranch 
} from 'lucide-react';
import { Project, ProjectDetail, ComponentItem, User } from '../types';
import { api } from '../api';

interface ProgressUpdateDeskProps {
  user: User | null;
  projects: Project[];
  onProgressUpdated: () => void;
}

export const ProgressUpdateDesk: React.FC<ProgressUpdateDeskProps> = ({
  user,
  projects,
  onProgressUpdated
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Form states
  const [overallCompletion, setOverallCompletion] = useState<number>(0);
  const [actualCost, setActualCost] = useState<number>(0);
  const [componentCompletions, setComponentCompletions] = useState<Record<string, number>>({});
  const [componentCosts, setComponentCosts] = useState<Record<string, number>>({});

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [filterAgency, setFilterAgency] = useState<string>(user?.agency || 'ALL');

  // Filter projects for this agency if specified
  const filteredProjects = projects.filter(p => {
    if (filterAgency !== 'ALL' && p.exec !== filterAgency) return false;
    return true;
  });

  // Select initial project if none selected
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredProjects[0].project_id);
    }
  }, [filteredProjects, selectedProjectId]);

  // Load project details when selection changes
  useEffect(() => {
    if (!selectedProjectId) return;
    setLoadingDetail(true);
    api.getProjectDetail(selectedProjectId)
      .then(data => {
        setProjectDetail(data);
        setOverallCompletion(data.completion);
        setActualCost(data.actual_cost);
        const compMap: Record<string, number> = {};
        const costMap: Record<string, number> = {};
        data.components.forEach(c => {
          compMap[c.component_id] = c.completion_pct;
          costMap[c.component_id] = c.spent_cost;
        });
        setComponentCompletions(compMap);
        setComponentCosts(costMap);
        setLoadingDetail(false);
      })
      .catch(err => {
        console.error('Failed to load project details:', err);
        setLoadingDetail(false);
      });
  }, [selectedProjectId]);

  const handleComponentSliderChange = (cid: string, val: number) => {
    const updated = { ...componentCompletions, [cid]: val };
    setComponentCompletions(updated);

    // Auto-compute weighted overall completion
    if (projectDetail) {
      let totalRatio = 0;
      let weightedSum = 0;
      projectDetail.components.forEach(c => {
        const ratio = c.budget_ratio || 0.5;
        totalRatio += ratio;
        const compVal = updated[c.component_id] ?? c.completion_pct;
        weightedSum += compVal * ratio;
      });
      const avg = totalRatio > 0 ? Math.round(weightedSum / totalRatio) : val;
      setOverallCompletion(avg);
    }
  };

  const handleComponentCostChange = (cid: string, costVal: number) => {
    const updated = { ...componentCosts, [cid]: costVal };
    setComponentCosts(updated);
    const sum = Object.values(updated).reduce((acc, curr) => acc + curr, 0);
    setActualCost(Number(sum.toFixed(2)));
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const compUpdates = projectDetail?.components.map(c => ({
        component_id: c.component_id,
        completion_pct: componentCompletions[c.component_id] ?? c.completion_pct,
        spent_cost: componentCosts[c.component_id] ?? c.spent_cost
      }));

      await api.updateProjectProgress(
        selectedProjectId,
        overallCompletion,
        actualCost,
        compUpdates
      );

      // Refresh project detail
      const refreshed = await api.getProjectDetail(selectedProjectId);
      setProjectDetail(refreshed);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 4000);
      onProgressUpdated();
    } catch (err: any) {
      alert(`Progress update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white shadow-lg space-y-2">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <Sliders className="w-5 h-5 text-emerald-300" />
          </span>
          <h2 className="text-xl font-bold tracking-tight">Executing Agency Progress Desk & Dynamic Recalculator</h2>
        </div>
        <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
          Submit monthly civil progress updates, expenditures, or component rollbacks. The system dynamically executes
          the formula: <code className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-200">Remaining_Duration = Original_Duration * ((100 - Current_Completion_Pct) / 100)</code>
          and automatically cascades timeline shifts to all downstream dependent components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Project Selector (4 cols) */}
        <div className="md:col-span-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Assigned Projects ({filteredProjects.length})
            </h3>
            {user?.agency && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                {user.agency}
              </span>
            )}
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredProjects.map(p => {
              const isSelected = p.project_id === selectedProjectId;
              return (
                <div
                  key={p.project_id}
                  onClick={() => setSelectedProjectId(p.project_id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{p.project_id}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                      p.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      p.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>{p.location} • {p.exec}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.completion}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Update Form (8 cols) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          {loadingDetail ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
              Loading component tree...
            </div>
          ) : projectDetail ? (
            <form onSubmit={handleSaveProgress} className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {projectDetail.project_id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{projectDetail.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: <strong>{projectDetail.location}</strong> • Executing Agency: <strong>{projectDetail.exec}</strong> • Total Budget: <strong>{projectDetail.cost} Cr Tk</strong>
                  </p>
                </div>
              </div>

              {/* Dynamic Timeline Calculation Card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Start Date</span>
                  <strong className="text-slate-900 dark:text-white">{projectDetail.start_date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Baseline Planned End</span>
                  <strong className="text-slate-900 dark:text-white">{projectDetail.planned_end_date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Projected Completion</span>
                  <strong className={`font-bold ${projectDetail.status === 'Delayed' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {projectDetail.projected_end_date}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Schedule Status</span>
                  <strong className="text-slate-800 dark:text-slate-200">{projectDetail.status}</strong>
                </div>
              </div>

              {/* Sub-Components Interactive Progress Sliders */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Sub-Component Progress & Cost Tracking</span>
                </h4>

                {projectDetail.components.map(comp => {
                  const currentCompPct = componentCompletions[comp.component_id] ?? comp.completion_pct;
                  const currentCompCost = componentCosts[comp.component_id] ?? comp.spent_cost;
                  const allocatedCost = comp.allocated_cost || (projectDetail.cost * comp.budget_ratio);

                  return (
                    <div
                      key={comp.component_id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                            {comp.component_id}
                          </span>
                          <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {comp.component_type}
                          </span>
                          {comp.depends_on && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                              Depends on: {comp.depends_on}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          <span>Allocated: <strong>{allocatedCost.toFixed(2)} Cr</strong></span>
                          <span>Spent: <strong>{currentCompCost.toFixed(2)} Cr</strong></span>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                          <span>Civil Completion Percentage</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentCompPct}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={currentCompPct}
                          onChange={e => handleComponentSliderChange(comp.component_id, Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>

                      {/* Spent Cost Input */}
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-slate-500">Actual Expenditure To Date:</span>
                        <div className="relative w-36">
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            value={currentCompCost}
                            onChange={e => handleComponentCostChange(comp.component_id, Number(e.target.value))}
                            className="w-full text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          />
                          <span className="absolute right-2 top-1 text-[10px] text-slate-400">Cr Tk</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Project Rollup Card */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Overall Project Progress</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400">{overallCompletion}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Actual Cost Spent</span>
                  <strong className="text-base text-slate-900 dark:text-white">{actualCost} / {projectDetail.cost} Cr Tk</strong>
                </div>
                <div className="flex-1 md:flex-initial flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>{isUpdating ? 'Cascading Recalculation...' : 'Save & Cascade Recalculation'}</span>
                  </button>
                </div>
              </div>

              {updateSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Progress recorded! Downstream DAG dates and project timeline recalculated dynamically.</span>
                </div>
              )}
            </form>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Select a project from the left panel to begin updating progress.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
