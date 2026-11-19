import React, { useState, useEffect } from 'react';
import { 
  GitFork, AlertOctagon, CheckCircle2, ShieldCheck, 
  ArrowRight, Search, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Layers
} from 'lucide-react';
import { DependencyDAGData, BottleneckRisk, DAGNode } from '../types';
import { api } from '../api';

export const DependencyRiskMatrix: React.FC = () => {
  const [dagData, setDagData] = useState<DependencyDAGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<DAGNode | null>(null);
  const [filterAgency, setFilterAgency] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    api.getDependencyDAG()
      .then(data => {
        setDagData(data);
        if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load DAG data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !dagData) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
        <GitFork className="w-6 h-6 mx-auto mb-2 text-emerald-400 animate-spin" />
        <span>Constructing Cross-Project Dependency Directed Acyclic Graph (DAG)...</span>
      </div>
    );
  }

  // Filter nodes for the SVG canvas
  const filteredNodes = dagData.nodes.filter(n => {
    if (filterAgency !== 'ALL' && n.agency !== filterAgency) return false;
    return true;
  });

  const agencies = Array.from(new Set(dagData.nodes.map(n => n.agency)));

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Badges */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cross-Project Dependency Graph & Critical Path Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Topological DAG mapping {dagData.total_nodes} components and {dagData.total_edges} interdependencies
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cycle Detector Badge */}
          {dagData.cycles_detected === 0 ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Cycles Detected (100% DAG Verified)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <span>{dagData.cycles_detected} Circular Dependencies Detected!</span>
            </div>
          )}

          {/* Critical Path Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-400/30 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Critical Path: {dagData.critical_path_length} Chained Nodes</span>
          </div>
        </div>
      </div>

      {/* Top 5 Bottlenecks Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Top 5 Cascading Bottleneck Risks (Domino Delay Score)</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Components whose delay produces the largest citywide cascade across downstream dependent contracts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Component ID</th>
                <th className="py-2.5 px-3">Parent Project</th>
                <th className="py-2.5 px-3">Agency</th>
                <th className="py-2.5 px-3">Completion</th>
                <th className="py-2.5 px-3">Blocked Downstream</th>
                <th className="py-2.5 px-3">Budget at Risk</th>
                <th className="py-2.5 px-3 text-right">Domino Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {dagData.top_bottlenecks.map((risk, index) => (
                <tr 
                  key={risk.component_id} 
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${
                    selectedNode?.id === risk.component_id ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                  }`}
                  onClick={() => {
                    const found = dagData.nodes.find(n => n.id === risk.component_id);
                    if (found) setSelectedNode(found);
                  }}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <span>{risk.component_id}</span>
                    {risk.is_critical_path && (
                      <span className="text-[9px] bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 px-1.5 py-0.2 rounded font-sans font-semibold">
                        Critical
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                    {risk.project_name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                      {risk.agency}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-12 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${risk.completion_pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${risk.completion_pct}%` }}
                        />
                      </div>
                      <span className="text-[11px]">{risk.completion_pct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                    +{risk.downstream_components_blocked} components
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {risk.downstream_budget_at_risk_cr_tk} Cr Tk
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-xs">
                      {risk.risk_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual SVG DAG Canvas */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Dependency Canvas
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              (Rose: Critical Path • Emerald: Normal Path • Amber: High Downstream Risk)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterAgency}
              onChange={(e) => setFilterAgency(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Agencies ({dagData.total_nodes})</option>
              {agencies.map(ag => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>

            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Visualization viewport */}
        <div className="w-full h-80 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 overflow-auto relative p-4 flex items-center justify-center">
          <div 
            className="transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg width="860" height="280" className="overflow-visible">
              <defs>
                <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker id="arrow-critical" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* Sample topological level-based rendering */}
              {/* Level 0 -> Level 1 -> Level 2 -> Level 3 -> Level 4 */}
              <g>
                {/* Visual Dependency Edges */}
                <path d="M 120 70 C 180 70, 200 110, 260 110" stroke="#f43f5e" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-critical)" strokeDasharray="4 2" />
                <path d="M 260 110 C 320 110, 340 90, 410 90" stroke="#f43f5e" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-critical)" />
                <path d="M 410 90 C 470 90, 500 140, 570 140" stroke="#f43f5e" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-critical)" />
                <path d="M 570 140 C 630 140, 670 100, 740 100" stroke="#f43f5e" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-critical)" />

                {/* Normal Edges */}
                <path d="M 120 190 C 180 190, 200 150, 260 150" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-normal)" opacity="0.6" />
                <path d="M 260 190 C 320 190, 360 210, 410 210" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-normal)" opacity="0.6" />
                <path d="M 410 210 C 470 210, 520 180, 570 180" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-normal)" opacity="0.6" />

                {/* Nodes */}
                {/* Node 1: Critical Root */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[0] || null)}
                >
                  <circle cx="120" cy="70" r="26" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="120" y="66" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0001</text>
                  <text x="120" y="79" textAnchor="middle" className="text-[8px] fill-rose-500 font-bold">LGD • 40%</text>
                  <text x="120" y="108" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Primary Drainage</text>
                </g>

                {/* Node 2: Critical Intermediate */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[1] || null)}
                >
                  <circle cx="260" cy="110" r="26" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="260" y="106" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0002</text>
                  <text x="260" y="119" textAnchor="middle" className="text-[8px] fill-rose-500 font-bold">PWD • 25%</text>
                  <text x="260" y="148" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Substructure Bed</text>
                </g>

                {/* Node 3: Critical Intermediate */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[2] || null)}
                >
                  <circle cx="410" cy="90" r="26" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="410" y="86" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0003</text>
                  <text x="410" y="99" textAnchor="middle" className="text-[8px] fill-rose-500 font-bold">RHD • 15%</text>
                  <text x="410" y="128" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Arterial Pavement</text>
                </g>

                {/* Node 4: Critical Penultimate */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[3] || null)}
                >
                  <circle cx="570" cy="140" r="26" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="570" y="136" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0004</text>
                  <text x="570" y="149" textAnchor="middle" className="text-[8px] fill-rose-500 font-bold">MOEDU • 0%</text>
                  <text x="570" y="178" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">School Foundation</text>
                </g>

                {/* Node 5: Terminal */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[4] || null)}
                >
                  <circle cx="740" cy="100" r="26" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2" />
                  <text x="740" y="96" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0005</text>
                  <text x="740" y="109" textAnchor="middle" className="text-[8px] fill-emerald-500 font-bold">LGD • 0%</text>
                  <text x="740" y="138" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Civic Center</text>
                </g>

                {/* Parallel Branch Node A */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[5] || null)}
                >
                  <circle cx="120" cy="190" r="24" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2" />
                  <text x="120" y="186" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0006</text>
                  <text x="120" y="199" textAnchor="middle" className="text-[8px] fill-emerald-500 font-bold">PWD • 80%</text>
                  <text x="120" y="226" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Utility Ducts</text>
                </g>

                {/* Parallel Branch Node B */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(dagData.nodes[6] || null)}
                >
                  <circle cx="260" cy="190" r="24" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2" />
                  <text x="260" y="186" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-white">comp0007</text>
                  <text x="260" y="199" textAnchor="middle" className="text-[8px] fill-emerald-500 font-bold">LGD • 50%</text>
                  <text x="260" y="226" textAnchor="middle" className="text-[9px] fill-slate-500 font-sans">Secondary Drains</text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Selected Component Inspector Panel */}
        {selectedNode && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                {selectedNode.id}
              </span>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedNode.project_name}</span>
                <span className="text-slate-400 text-[11px] block">
                  Executing Agency: <strong>{selectedNode.agency}</strong> • Type: {selectedNode.comp_type} • Cost: {selectedNode.cost} Cr Tk
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 font-mono">
              <span className="text-slate-500">Progress: <strong>{selectedNode.completion_pct}%</strong></span>
              <span className="text-rose-500 font-bold">Downstream Blocked: +{selectedNode.downstream_count}</span>
              {selectedNode.is_critical && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[10px] font-bold uppercase">
                  Critical Path
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
