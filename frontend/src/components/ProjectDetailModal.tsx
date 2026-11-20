import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Building2, Calendar, DollarSign, Star, 
  Send, AlertTriangle, CheckCircle2, Clock, GitFork, 
  MessageSquarePlus, Layers, ShieldCheck, ArrowRight, Share2,
  TrendingUp, Gauge, ShieldAlert, FileText, Camera
} from 'lucide-react';
import { ProjectDetail, ProjectRiskForecast } from '../types';
import { api } from '../api';
import { calculateProjectRiskForecast } from '../riskEngine';

interface ProjectDetailModalProps {
  projectId: string | null;
  onClose: () => void;
  onRefreshNeeded?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  projectId,
  onClose,
  onRefreshNeeded
}) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [riskForecast, setRiskForecast] = useState<ProjectRiskForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    api.getProjectDetail(projectId)
      .then(data => {
        setProject(data);
        const forecast = calculateProjectRiskForecast(data, data.components, data.feedbacks);
        setRiskForecast(forecast);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load project details:', err);
        setLoading(false);
      });
  }, [projectId]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !comment.trim()) return;
    setSubmittingFeedback(true);
    try {
      await api.submitCitizenFeedback(projectId, rating, comment, citizenName.trim() || 'Civic Observer');
      setComment('');
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 3000);
      const updated = await api.getProjectDetail(projectId);
      setProject(updated);
      if (onRefreshNeeded) onRefreshNeeded();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-left"
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/40">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {project?.project_id || projectId}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  project?.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                  project?.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                }`}>
                  ● {project?.status || 'Active'}
                </span>
                <span className="text-xs text-slate-400">
                  📍 {project?.location}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {project?.name || 'Loading project dossier...'}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {loading || !project ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <div className="w-8 h-8 mx-auto border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p>Loading project dossier and sub-component graph...</p>
              </div>
            ) : (
              <>
                {/* Executive Summary Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Approved Budget</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{project.cost} Cr Tk</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Timespan: {project.timespan} Yrs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Disbursed Cost</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{project.actual_cost} Cr Tk</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {project.cost > 0 ? Math.round((project.actual_cost / project.cost) * 100) : 0}% of budget
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Civil Progress</span>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{project.completion}%</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {project.components.filter(c => c.completion_pct >= 100).length}/{project.components.length} components
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Projected Completion</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {project.projected_end_date || project.planned_end_date}
                    </span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${
                      project.status === 'Delayed' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {project.status === 'Delayed' ? '⚠️ Delayed vs Baseline' : '✅ On Baseline'}
                    </span>
                  </div>
                </div>

                {/* Predictive Risk & Cost Overrun Forecast Card */}
                {riskForecast && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                          Predictive Risk & Cost Overrun Forecast
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        riskForecast.risk_tier === 'Critical'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : riskForecast.risk_tier === 'Elevated'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        ● {riskForecast.risk_tier} Risk ({riskForecast.risk_score}/100)
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Delay Probability</span>
                        <span className="text-sm font-extrabold text-rose-400 font-mono">
                          {riskForecast.delay_probability_pct}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Forecasted Final Cost</span>
                        <span className="text-sm font-extrabold text-amber-400 font-mono">
                          ৳{riskForecast.forecasted_final_cost} Cr
                        </span>
                        <span className="text-[9px] text-slate-400 block">
                          +{riskForecast.forecasted_overrun_pct}% Overrun
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Predicted Slippage</span>
                        <span className="text-sm font-extrabold text-sky-400 font-mono">
                          +{riskForecast.predicted_delay_days} Days
                        </span>
                      </div>
                    </div>

                    {/* Top Risk Drivers */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Primary Predictive Drivers:
                      </span>
                      {riskForecast.top_risk_drivers.map((driver, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-xs text-slate-300">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span className="leading-snug">{driver}</span>
                        </div>
                      ))}
                    </div>

                    {/* Variance Factors Bar */}
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-5 gap-1.5 text-[9px] text-slate-400 text-center">
                      <div>
                        <span>Slippage</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-rose-500" style={{ width: `${riskForecast.variance_factors.schedule_slippage}%` }} />
                        </div>
                      </div>
                      <div>
                        <span>Cost Burn</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${riskForecast.variance_factors.historical_burn_pace}%` }} />
                        </div>
                      </div>
                      <div>
                        <span>DAG Strain</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${riskForecast.variance_factors.critical_path_strain}%` }} />
                        </div>
                      </div>
                      <div>
                        <span>Agency Load</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${riskForecast.variance_factors.agency_workload_stress}%` }} />
                        </div>
                      </div>
                      <div>
                        <span>Citizen Friction</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${riskForecast.variance_factors.citizen_friction}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overall Progress Bar */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Civil Works Execution Velocity</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{project.completion}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, project.completion)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Started: {project.start_date}</span>
                    <span>Target: {project.planned_end_date}</span>
                  </div>
                </div>

                {/* Project Goal & Scope */}
                {project.goal && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Goal & Municipal Purpose</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{project.goal}</p>
                  </div>
                )}

                {/* Component Breakdown & DAG Chain */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <GitFork className="w-4 h-4 text-emerald-500" />
                      <span>Sub-Components & Dependency Chain ({project.components.length})</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">RCPSP Precedence Enforced</span>
                  </div>

                  <div className="space-y-2">
                    {project.components.map(c => (
                      <div 
                        key={c.component_id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{c.component_id}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              c.component_type === 'works' 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {c.component_type}
                            </span>
                            <span className="text-[11px] text-slate-400">🏛️ {c.ececuting_agency}</span>
                          </div>

                          <span className={`text-[11px] font-bold ${
                            c.completion_pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {c.completion_pct}% Done
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, c.completion_pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>
                            Cost: <strong>{c.allocated_cost} Cr</strong> (Spent: {c.spent_cost} Cr)
                          </span>
                          {c.depends_on ? (
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <span>DAG Predecessor:</span>
                              <strong className="font-mono">{c.depends_on}</strong>
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Head of DAG</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citizen Feedback & Rating Submission */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Citizen Feedback & Public Sentiment</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Avg: {project.average_rating ? `${project.average_rating} ⭐` : 'Unrated'} ({project.feedbacks?.length || 0} reviews)
                    </span>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleSubmitFeedback} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rate this project:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition"
                          >
                            <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Your name / affiliation (optional)"
                        value={citizenName}
                        onChange={e => setCitizenName(e.target.value)}
                        className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Write public feedback on road quality, safety, delays..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="sm:col-span-2 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {feedbackSuccess && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Feedback posted successfully!</span>
                        </span>
                      )}
                      <div className="ml-auto">
                        <button
                          type="submit"
                          disabled={submittingFeedback || !comment.trim()}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingFeedback ? 'Posting...' : 'Submit Feedback'}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Reviews List */}
                  {project.feedbacks && project.feedbacks.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {project.feedbacks.map(fb => (
                        <div key={fb.id} className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{fb.citizen_name || 'Civic Observer'}</span>
                            <div className="flex items-center space-x-1 text-amber-400">
                              <span>{'★'.repeat(fb.rating)}</span>
                              <span className="text-slate-300 dark:text-slate-600">{'★'.repeat(5 - fb.rating)}</span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{fb.comment}</p>
                          <span className="text-[10px] text-slate-400 block">{new Date(fb.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No feedback submitted yet. Be the first to review this infrastructure project!</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
