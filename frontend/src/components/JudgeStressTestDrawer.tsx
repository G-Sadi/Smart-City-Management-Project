import React, { useState } from 'react';
import { 
  Sliders, AlertTriangle, RotateCcw, TrendingDown, 
  DollarSign, Download, CheckCircle2, RefreshCw, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { Project } from '../types';
import { api } from '../api';

interface JudgeStressTestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onRecalculated: () => void;
}

export const JudgeStressTestDrawer: React.FC<JudgeStressTestDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  onRecalculated,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedAgency, setSelectedAgency] = useState<string>('LGD');
  const [executing, setExecuting] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const runningProjects = projects.filter(p => p.status === 'Running' || p.status === 'Delayed');

  const handleApplyScenario = async (scenario: string) => {
    setExecuting(true);
    setLastActionMessage(null);
    try {
      const res = await api.applySimulationScenario(scenario, selectedProjectId || undefined, selectedAgency);
      setLastActionMessage(res.message);
      onRecalculated();
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Judge Stress-Test Simulator
                </h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Section 4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct DB Mutation & Dynamic RCPSP Cascade Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-700/40 text-amber-800 dark:text-amber-200 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Judge Hackathon Evaluation Tool:</strong> Apply instant runtime mutations to database records (budget cut, work rollback, fiscal cap freeze). Watch the RCPSP dynamic engine recalculate downstream schedules in real time!
            </p>
          </div>

          {/* Target Project Selection */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Target Running Project for Mutation:
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="">Default: First Active Running Project</option>
              {runningProjects.map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_id} — {p.name} ({p.exec}, {p.cost} Cr, {p.completion}%)
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Trigger Buttons */}
          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 block">
              1-Click Mutation Scenarios:
            </span>

            {/* Scenario 1: Budget Cut (-30%) */}
            <button
              onClick={() => handleApplyScenario('budget_cut')}
              disabled={executing}
              className="w-full text-left p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 shadow-sm transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  <span>1. Simulate Budget Cut (-30% Funds)</span>
                </span>
                <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded font-mono font-bold">
                  Cost -30%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reduces project capital allocation by 30%. Recomputes component ratios and tests funding shortfall resilience.
              </p>
            </button>

            {/* Scenario 2: Work Rollback (-25% Completion) */}
            <button
              onClick={() => handleApplyScenario('rollback_work')}
              disabled={executing}
              className="w-full text-left p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 shadow-sm transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>2. Simulate Work Rollback (-25% Progress)</span>
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  Comp -25%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Rolls back progress: applies <code className="font-mono">Remaining_Duration = Original_Duration * ((100 - Completion%) / 100)</code> and cascades delays to downstream DAG dependents.
              </p>
            </button>

            {/* Scenario 3: Fiscal Freeze */}
            <button
              onClick={() => handleApplyScenario('freeze_budget')}
              disabled={executing}
              className="w-full text-left p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 shadow-sm transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-indigo-500" />
                  <span>3. Simulate Fiscal Budget Freeze</span>
                </span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                  Cap Frozen
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tightens yearly expenditure cap for agency {selectedAgency} to current spent amount, forcing new proposals to rollover to next fiscal year.
              </p>
            </button>

            {/* Scenario 4: Reset to Baseline Dataset */}
            <button
              onClick={() => handleApplyScenario('reset_baseline')}
              disabled={executing}
              className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                  <span>4. Reset to Clean Municipal Baseline</span>
                </span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  /data/*.csv
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Restores original unmodified dataset from /data/*.csv and clears simulation changes.
              </p>
            </button>
          </div>

          {/* Feedback Status Box */}
          {lastActionMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Dynamic Recalculation Complete:</span>
                <span>{lastActionMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with 1-Click Export Revised CSV */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
          <button
            onClick={() => api.exportRevisedProjectsCsv()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Revised Timeframes (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
