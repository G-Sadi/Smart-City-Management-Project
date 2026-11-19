import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileSpreadsheet, RefreshCw, AlertTriangle, 
  CheckCircle2, Plus, Trash2, Database, Eye, Terminal, Clock 
} from 'lucide-react';
import { IngestionAudit, ConstraintItem, Agency } from '../types';
import { api } from '../api';

interface AdminAuditConsoleProps {
  agencies: Agency[];
  onRefreshNeeded: () => void;
}

export const AdminAuditConsole: React.FC<AdminAuditConsoleProps> = ({
  agencies,
  onRefreshNeeded
}) => {
  const [audits, setAudits] = useState<IngestionAudit[]>([]);
  const [constraints, setConstraints] = useState<ConstraintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReingesting, setIsReingesting] = useState(false);
  const [reingestMsg, setReingestMsg] = useState<string | null>(null);

  // New constraint form state
  const [newCode, setNewCode] = useState('');
  const [newLimit, setNewLimit] = useState<number>(10);
  const [newType, setNewType] = useState('executing_agency_limit');
  const [newDesc, setNewDesc] = useState('');
  const [isCreatingConstraint, setIsCreatingConstraint] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [auditData, constraintData] = await Promise.all([
        api.getAuditReports(),
        api.getConstraints()
      ]);
      setAudits(auditData);
      setConstraints(constraintData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReingest = async () => {
    setIsReingesting(true);
    setReingestMsg(null);
    try {
      const res = await api.reingestCsv();
      setReingestMsg(`Ingestion completed! Loaded ${res.total_rows_loaded} rows from ${res.total_files} files.`);
      await loadData();
      onRefreshNeeded();
      setTimeout(() => setReingestMsg(null), 5000);
    } catch (err: any) {
      alert(`Ingestion failed: ${err.message}`);
    } finally {
      setIsReingesting(false);
    }
  };

  const handleCreateConstraint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setIsCreatingConstraint(true);
    try {
      await api.createConstraint({
        code: newCode.trim(),
        max_limit: newLimit,
        constraint_type: newType,
        description: newDesc.trim() || undefined
      });
      setNewCode('');
      setNewDesc('');
      await loadData();
      onRefreshNeeded();
    } catch (err: any) {
      alert(`Failed to create constraint: ${err.message}`);
    } finally {
      setIsCreatingConstraint(false);
    }
  };

  const handleDeleteConstraint = async (id: number) => {
    if (!confirm('Are you sure you want to remove this constraint? Schedule will be recalculated immediately.')) return;
    try {
      await api.deleteConstraint(id);
      await loadData();
      onRefreshNeeded();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const latestAudit = audits.length > 0 ? audits[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-2 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">System Administrator & Ingestion Audit Console</h2>
          </div>

          <button
            onClick={handleReingest}
            disabled={isReingesting}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReingesting ? 'animate-spin' : ''}`} />
            <span>{isReingesting ? 'Sanitizing & Ingesting...' : 'Re-ingest CSVs from /data'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Inspect automated CSV data sanitization reports, bad-row filters, foreign-key audits, and live constraint models.
          The live Database File Watcher continuously monitors changes to the SQLite database and raw data files.
        </p>
      </div>

      {reingestMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{reingestMsg}</span>
        </div>
      )}

      {/* Latest Ingestion Audit Report Card (Module A) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Latest CSV Ingestion & Sanitization Audit Report</span>
          </h3>
          {latestAudit && (
            <span className="text-xs text-slate-400">
              Audit Timestamp: {new Date(latestAudit.timestamp).toLocaleString()}
            </span>
          )}
        </div>

        {latestAudit ? (
          <div className="space-y-4">
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">Total Files Processed</span>
                <strong className="text-lg text-slate-900 dark:text-white">{latestAudit.total_files} CSVs</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">Total Rows Read</span>
                <strong className="text-lg text-slate-900 dark:text-white">{latestAudit.total_rows_read} Rows</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">Successfully Ingested</span>
                <strong className="text-lg text-emerald-700 dark:text-emerald-300">{latestAudit.total_rows_loaded} Rows</strong>
              </div>
              <div className={`p-3.5 rounded-xl border ${
                latestAudit.total_bad_rows > 0
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <span className="text-[11px] block">Filtered Bad Rows</span>
                <strong className="text-lg">{latestAudit.total_bad_rows} Rows</strong>
              </div>
            </div>

            {/* Per-File Ingestion Breakdown */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Dataset Source File</th>
                    <th className="py-2.5 px-3">Total Rows Read</th>
                    <th className="py-2.5 px-3">Loaded Clean Rows</th>
                    <th className="py-2.5 px-3">Sanitized Bad Rows</th>
                    <th className="py-2.5 px-3">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {Object.entries(latestAudit.summary).map(([fileName, stats]) => (
                    <tr key={fileName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {fileName}
                      </td>
                      <td className="py-2.5 px-3">{stats.read}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {stats.loaded}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-rose-500">
                        {stats.bad}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          Verified Clean
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bad Rows Log Detail (if any) */}
            {latestAudit.bad_rows && latestAudit.bad_rows.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Filtered Bad Rows Log ({latestAudit.bad_rows.length})</span>
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] font-mono">
                  {latestAudit.bad_rows.map((bad, i) => (
                    <div key={i} className="p-1.5 rounded bg-white/60 dark:bg-black/30 text-rose-700 dark:text-rose-300">
                      [{bad.file}: Row {bad.row}] Reason: {bad.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No audit reports generated yet. Click "Re-ingest CSVs from /data" above to run an audit.
          </div>
        )}
      </div>

      {/* Constraints Manager (Module B) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Database className="w-4 h-4 text-purple-500" />
          <span>Active RCPSP Constraints & Concurrency Quota Engine</span>
        </h3>

        {/* Existing Constraints Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase">
              <tr>
                <th className="py-2.5 px-3">Target Code</th>
                <th className="py-2.5 px-3">Constraint Type</th>
                <th className="py-2.5 px-3">Max Limit / Ceiling</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {constraints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-900 dark:text-white">
                    {c.code}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      {c.constraint_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {c.max_limit} {c.constraint_type === 'yearly_funding' ? 'Cr Tk' : 'Units'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {c.description || 'Statutory Code Samurai limit'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteConstraint(c.id)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove constraint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Constraint Form */}
        <form onSubmit={handleCreateConstraint} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New System Constraint / Blackout Window</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Target Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. LGD, Tarabo, Monsoon"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Constraint Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                <option value="executing_agency_limit">Agency Concurrency Limit</option>
                <option value="location_limit">Location Concurrency Limit</option>
                <option value="yearly_funding">Yearly Funding Cap (Cr Tk)</option>
                <option value="blackout_period">Blackout Period / Restriction</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Max Limit</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={newLimit}
                onChange={e => setNewLimit(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isCreatingConstraint || !newCode.trim()}
                className="w-full py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Constraint</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
