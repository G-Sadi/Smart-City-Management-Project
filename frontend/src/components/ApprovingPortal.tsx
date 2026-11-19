import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, Building2, MapPin, 
  Calendar, DollarSign, Filter, Clock, ShieldCheck, FileCheck 
} from 'lucide-react';
import { Proposal, User } from '../types';
import { api } from '../api';

interface ApprovingPortalProps {
  user: User | null;
  onActionComplete: () => void;
}

export const ApprovingPortal: React.FC<ApprovingPortalProps> = ({
  user,
  onActionComplete
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorityFilter, setAuthorityFilter] = useState<'ALL' | 'MOP' | 'ECNEC'>(
    user?.role === 'ECNEC' ? 'ECNEC' : user?.role === 'MOP' ? 'MOP' : 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState('Pending');

  // Action state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const auth = authorityFilter === 'ALL' ? undefined : authorityFilter;
      const status = statusFilter === 'ALL' ? undefined : statusFilter;
      const data = await api.getProposals({ authority: auth, status: status });
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [authorityFilter, statusFilter]);

  const handleApprove = async (prop: Proposal) => {
    const notes = prompt(`Enter approval notes for ${prop.name}:`, 'Approved per statutory DPP review standards.');
    if (notes === null) return;

    setActionLoadingId(prop.proposal_id);
    try {
      const res = await api.approveProposal(prop.proposal_id, notes);
      setActionSuccessMessage(res.message);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadProposals();
      onActionComplete();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (prop: Proposal) => {
    const reason = prompt(`Enter rejection reason for ${prop.name}:`, 'Proposal rejected due to location saturation or budget cap.');
    if (!reason) return;

    setActionLoadingId(prop.proposal_id);
    try {
      const res = await api.rejectProposal(prop.proposal_id, reason);
      setActionSuccessMessage(res.message);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadProposals();
      onActionComplete();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-2 border border-indigo-900/50">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <FileCheck className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold tracking-tight">Government / Approving Authority Portal</h2>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Statutory Development Project Proforma (DPP) Approval Desk. Under National Planning Guidelines:
          projects <strong>≤ 50 Crore BDT</strong> fall under the jurisdiction of the <strong>Ministry of Planning (MOP)</strong>;
          projects <strong>&gt; 50 Crore BDT</strong> require approval by the <strong>Executive Committee of the National Economic Council (ECNEC)</strong>.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Authority Filter:</span>
          </span>

          <button
            onClick={() => setAuthorityFilter('ALL')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              authorityFilter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Authorities
          </button>

          <button
            onClick={() => setAuthorityFilter('MOP')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              authorityFilter === 'MOP'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            MOP (Projects ≤ 50 Cr)
          </button>

          <button
            onClick={() => setAuthorityFilter('ECNEC')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              authorityFilter === 'ECNEC'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
            }`}
          >
            ECNEC (Projects &gt; 50 Cr)
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Proposals List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          Loading pending DPP submissions...
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p>No proposals matching the current authority or status filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map(prop => {
            const isMop = prop.cost <= 50.0;
            const isActing = actionLoadingId === prop.proposal_id;

            return (
              <div
                key={prop.proposal_id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {prop.proposal_id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isMop
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {prop.approving_authority} Authority
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      prop.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      prop.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Submission Date: {prop.proposal_date}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {prop.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Agency: <strong>{prop.exec}</strong></span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Budget: <strong>{prop.cost} Cr Tk</strong></span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Timespan: {prop.timespan} Yrs</span>
                      </span>
                    </div>

                    {prop.goal && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 line-clamp-2">
                        {prop.goal}
                      </p>
                    )}
                  </div>

                  {/* RCPSP Timeframe Insight */}
                  <div className="md:col-span-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      RCPSP Engine Scheduling Simulation
                    </span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Suggested Start:</span>
                      <strong className="text-slate-900 dark:text-white">{prop.suggested_start_date || 'Calculated on approval'}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Projected Completion:</span>
                      <strong className="text-slate-900 dark:text-white">{prop.suggested_end_date || 'Per timespan'}</strong>
                    </div>
                    {prop.review_notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                        "{prop.review_notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons for Pending Proposals */}
                {prop.status === 'Pending' && (
                  <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      onClick={() => handleReject(prop)}
                      disabled={isActing}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Proposal</span>
                    </button>

                    <button
                      onClick={() => handleApprove(prop)}
                      disabled={isActing}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isActing ? 'Processing...' : `Approve as ${prop.approving_authority}`}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
