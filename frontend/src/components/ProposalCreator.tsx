import React, { useState } from 'react';
import { 
  Sparkles, Calendar, DollarSign, Clock, MapPin, Building2, 
  AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, Cpu, GitFork, FileText 
} from 'lucide-react';
import { TimeframeSuggestion, Agency } from '../types';
import { api } from '../api';
import { AlgorithmProofBanner } from './AlgorithmProofBanner';
import { DependencyRiskMatrix } from './DependencyRiskMatrix';

interface ProposalCreatorProps {
  agencies: Agency[];
  onProposalCreated: () => void;
}

export const ProposalCreator: React.FC<ProposalCreatorProps> = ({
  agencies,
  onProposalCreated
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Daudpur');
  const [latitude, setLatitude] = useState(23.6193);
  const [longitude, setLongitude] = useState(90.5036);
  const [execAgency, setExecAgency] = useState('LGD');
  const [cost, setCost] = useState<number>(25.0);
  const [timespan, setTimespan] = useState<number>(3);
  const [goal, setGoal] = useState('');
  const [dependencyId, setDependencyId] = useState('');

  // Subtab State: DPP Formulator vs. Dependency DAG
  const [activeSubTab, setActiveSubTab] = useState<'formulator' | 'dag'>('formulator');

  // RCPSP Suggestion State
  const [suggestion, setSuggestion] = useState<TimeframeSuggestion | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const execAgencies = agencies.filter(a => a.type === 'EXEC');

  // Trigger RCPSP Solver
  const handleSuggestTimeframe = async () => {
    setIsSolving(true);
    setErrorMessage('');
    try {
      const res = await api.suggestTimeframe(
        cost,
        timespan,
        execAgency,
        location,
        dependencyId.trim() || undefined
      );
      setSuggestion(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to solve RCPSP schedule');
    } finally {
      setIsSolving(false);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Project Name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await api.createProposal({
        name,
        location,
        latitude,
        longitude,
        exec: execAgency,
        cost,
        timespan,
        goal: goal.trim() || undefined,
        components: [
          { component_type: 'goods', budget_ratio: 0.4, depends_on: dependencyId.trim() || null },
          { component_type: 'works', budget_ratio: 0.6, depends_on: null }
        ]
      });

      setSubmitSuccess(true);
      setName('');
      setGoal('');
      setSuggestion(null);
      setTimeout(() => setSubmitSuccess(false), 4000);
      onProposalCreated();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const authorityTag = cost <= 50.0 ? 'MOP (<= 50 Cr)' : 'ECNEC (> 50 Cr)';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Subtab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('formulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'formulator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. DPP Formulator & RCPSP Solver</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dag')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeSubTab === 'dag'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>2. Dependency DAG & Risk Graph</span>
        </button>
      </div>

      {activeSubTab === 'dag' ? (
        <DependencyRiskMatrix />
      ) : (
        <>
          {/* Section 2 & 4 Algorithm Benchmark Proof */}
          <AlgorithmProofBanner />

          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-lg space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <Cpu className="w-5 h-5 text-emerald-300" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">DPP Proposal Formulation & RCPSP Optimization Engine</h2>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Draft a new Development Project Proforma (DPP). Before submitting for approval, run the deterministic
              Resource-Constrained Project Scheduling (RCPSP) solver to pinpoint the earliest valid start date without
              violating agency capacity limits, location saturation quotas, or yearly budget allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Project Parameters & Civil Specifications</span>
          </h3>

          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Water Treatment Plant & Supply Extension"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Location / Zone
                </label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Daudpur">Daudpur (Max Limit: 8)</option>
                  <option value="Kanchan">Kanchan (Max Limit: 5)</option>
                  <option value="Pabna">Pabna (Max Limit: 1)</option>
                  <option value="Tarabo">Tarabo</option>
                  <option value="Golakandail">Golakandail</option>
                  <option value="Bhulta">Bhulta</option>
                  <option value="Rupganj">Rupganj</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Executing Agency
                </label>
                <select
                  value={execAgency}
                  onChange={e => setExecAgency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {execAgencies.map(a => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                  {execAgencies.length === 0 && (
                    <>
                      <option value="LGD">LGD (Limit: 75 components)</option>
                      <option value="MOEDU">MOEDU (Limit: 25 components)</option>
                      <option value="PWD">PWD (Funding: 500 Cr)</option>
                      <option value="LGED">LGED</option>
                      <option value="BBA">BBA</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Cost (Crore BDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={cost}
                    onChange={e => setCost(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400">Cr Tk</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  Approval Authority: <strong className="text-emerald-600 dark:text-emerald-400">{authorityTag}</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Timespan (Years)
                </label>
                <select
                  value={timespan}
                  onChange={e => setTimespan(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={1}>1 Year (Fast Track / Parks)</option>
                  <option value={3}>3 Years (Standard Schools / Facilities)</option>
                  <option value={5}>5 Years (Major Hospitals / Heavy Civil)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={e => setLatitude(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={e => setLongitude(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Predecessor Component ID (DAG Dependency - Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. comp4708 or comp1322 (must finish before this proposal starts)"
                value={dependencyId}
                onChange={e => setDependencyId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Strategic Goal / Justification
              </label>
              <textarea
                rows={2}
                placeholder="Brief justification for this municipal infrastructure investment..."
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>DPP proposal created successfully! Forwarded to {authorityTag} for approval review.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSuggestTimeframe}
                disabled={isSolving}
                className="flex-1 py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <Sparkles className={`w-4 h-4 text-emerald-500 ${isSolving ? 'animate-spin' : ''}`} />
                <span>{isSolving ? 'Solving RCPSP...' : 'Suggest Optimal Timeframe'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting DPP...' : 'Submit DPP Proposal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* RCPSP Recommendation Panel (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>RCPSP Scheduling Advisor Preview</span>
            </h3>

            {suggestion ? (
              <div className="space-y-4 animate-fade-in">
                {/* Dates card */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <span>Algorithm Recommendation</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-[10px]">
                      {suggestion.is_immediate ? '⚡ Immediate Slot' : '⏳ Queued / Shifted'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Recommended Start</span>
                      <strong className="text-sm text-slate-900 dark:text-white">{suggestion.optimal_start_date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Projected End</span>
                      <strong className="text-sm text-slate-900 dark:text-white">{suggestion.optimal_end_date}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottleneck analysis badge */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Constraint Impact
                  </span>
                  
                  {suggestion.bottleneck_constraint ? (
                    <div className="flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-semibold text-amber-700 dark:text-amber-400 capitalize">
                          {suggestion.bottleneck_constraint.replace('_', ' ')}
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          {suggestion.earliest_available_slot_reason}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>All 4 constraints clear. Immediate start approved.</span>
                    </div>
                  )}
                </div>

                {/* Constraint Breakdown Checkmarks */}
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>1. Agency Capacity ({execAgency}):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Evaluated</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>2. Location Saturation ({location}):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Evaluated</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>3. Annual Funding Ceiling:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Evaluated</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>4. DAG Dependencies:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Acyclic Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs">
                  Fill in the project parameters on the left and click <strong>"Suggest Optimal Timeframe"</strong> to query the RCPSP solver.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
