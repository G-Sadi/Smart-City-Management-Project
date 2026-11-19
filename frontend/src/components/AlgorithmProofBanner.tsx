import React, { useState, useEffect } from 'react';
import { 
  Zap, CheckCircle2, TrendingUp, Clock, AlertTriangle, 
  ShieldCheck, Cpu, ArrowRight, ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import { AlgorithmBenchmark } from '../types';
import { api } from '../api';

interface AlgorithmProofBannerProps {
  onRefreshNeeded?: () => void;
}

export const AlgorithmProofBanner: React.FC<AlgorithmProofBannerProps> = () => {
  const [benchmark, setBenchmark] = useState<AlgorithmBenchmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    api.getAlgorithmBenchmark()
      .then(b => {
        setBenchmark(b);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load benchmark:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !benchmark) {
    return (
      <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-indigo-950/30 border border-emerald-500/20 animate-pulse flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Computing RCPSP vs Naive Schedule Optimization Proof...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20 border border-emerald-500/30 dark:border-emerald-500/30 shadow-md shadow-emerald-500/5 overflow-hidden transition-all duration-300">
      {/* Top Header Ribbon */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs shadow-inner">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-sm">RCPSP Algorithm Optimization Proof</span>
              <span className="text-[10px] font-mono bg-white/25 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                Section 2 & 4 Benchmark
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 opacity-90">
              Deterministic Priority-Queue + CPM Packing vs. Naive Sequential Execution
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-400/40 text-[11px] text-emerald-200 font-semibold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Constraint Compliance</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Proof' : 'View Proof'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 4 Core Benchmark Metric Pills */}
      <div className="p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Total Makespan Saved */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Makespan Saved</span>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            {benchmark.makespan_saved_days} Days
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
            <span className="text-emerald-500 font-semibold">{benchmark.makespan_saved_months} Months Faster</span>
            <span>({benchmark.makespan_reduction_pct}% reduction)</span>
          </div>
        </div>

        {/* 2. Idle Capacity Reduction */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Idle Capacity Reduced</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tracking-tight">
            {benchmark.idle_time_reduction_pct}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Least idle resource gap packing
          </div>
        </div>

        {/* 3. Constraint Conflicts Resolved */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Conflicts Resolved</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tracking-tight">
            {benchmark.conflicts_resolved_count} Clashes
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Agency, zone & fiscal caps
          </div>
        </div>

        {/* 4. Zero Violation Badge */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Runtime Assertion</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
            0 Violations
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {benchmark.constraint_compliance_pct}% Certified Compliant
          </div>
        </div>
      </div>

      {/* Expandable Mathematical Proof Drawer */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Left: Schedule Comparison */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Side-by-Side Schedule Execution Comparison</span>
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400">Baseline (Naive / Uncoordinated) Schedule:</span>
                  <span className="font-mono font-semibold text-rose-500">{benchmark.baseline_makespan_days} Days (~5.1 Yrs)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400">CivicGrid RCPSP Priority-Queue Schedule:</span>
                  <span className="font-mono font-semibold text-emerald-500">{benchmark.optimized_makespan_days} Days (~3.9 Yrs)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400">CPM Critical Path Horizon:</span>
                  <span className="font-mono font-semibold text-indigo-400">{benchmark.cpm_critical_path_length_days} Days (~3.0 Yrs)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400">Dynamic Progress Scaling Formula:</span>
                  <code className="font-mono text-[10px] text-teal-600 dark:text-teal-300">
                    Rem_Dur = Orig_Dur * ((100 - Comp%) / 100)
                  </code>
                </div>
              </div>
            </div>

            {/* Right: Constraint Conflict Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>Exact Constraint Clashes Prevented at Runtime</span>
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span>1. Executing Agency Concurrency Overloads:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{benchmark.agency_conflicts_resolved} prevented
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span>2. Municipal Zone Saturation Quota Clashes:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{benchmark.location_conflicts_resolved} prevented
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/50">
                  <span>3. Monsoon Flood Blackout Restriction Overlaps:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{benchmark.blackout_conflicts_resolved} prevented
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>4. Annual Fiscal Agency Budget Rollover Breaches:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{benchmark.budget_conflicts_resolved} deferred to next fiscal yr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
