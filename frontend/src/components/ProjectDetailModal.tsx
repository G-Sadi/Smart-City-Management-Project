import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Building2, Calendar, DollarSign, Star, 
  Send, AlertTriangle, CheckCircle2, Clock, GitFork, MessageSquarePlus 
} from 'lucide-react';
import { ProjectDetail } from '../types';
import { api } from '../api';

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
      // reload project
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {project?.project_id || projectId}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                project?.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                project?.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                {project?.status}
              </span>
              {project?.average_rating ? (
                <span className="flex items-center space-x-1 text-xs text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{project.average_rating} ({project.feedback_count} reviews)</span>
                </span>
              ) : null}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {project?.name || 'Loading Project Details...'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-3">
              <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{project?.location}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /><span>{project?.exec}</span></span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading project specifications and components...
            </div>
          ) : project ? (
            <>
              {/* Project Goals / Narrative */}
              {project.goal && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">Project Goal & Strategic Scope:</strong>
                  {project.goal}
                </div>
              )}

              {/* Key Timeline & Cost KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Approved Budget</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {project.cost} <span className="text-xs font-normal text-slate-500">Cr Tk</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Spent: {project.actual_cost} Cr Tk</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Planned Timespan</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {project.timespan} <span className="text-xs font-normal text-slate-500">Years</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Start: {project.start_date}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Planned Completion</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {project.planned_end_date || 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Baseline deadline</span>
                </div>

                <div className={`p-3 rounded-xl border ${
                  project.status === 'Delayed'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                }`}>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Projected Completion</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {project.projected_end_date || project.planned_end_date}
                  </span>
                  <span className="text-[10px] block mt-1 font-semibold text-slate-600 dark:text-slate-300">
                    {project.status === 'Delayed' ? '⚠️ Delayed vs Baseline' : '✅ On Schedule'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Overall Civil Works Completion</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{project.completion}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, project.completion)}%` }} 
                  />
                </div>
              </div>

              {/* Project Components Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Project Sub-Components & DAG Structure ({project.components.length})</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Component ID</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Agency</th>
                        <th className="py-2.5 px-3">Predecessor (DAG)</th>
                        <th className="py-2.5 px-3">Budget Ratio</th>
                        <th className="py-2.5 px-3">Allocated Cost</th>
                        <th className="py-2.5 px-3">Completion %</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {project.components.map(comp => (
                        <tr key={comp.component_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                            {comp.component_id}
                          </td>
                          <td className="py-2.5 px-3 capitalize font-medium">{comp.component_type}</td>
                          <td className="py-2.5 px-3">{comp.ececuting_agency}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            {comp.depends_on ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold">
                                🔗 {comp.depends_on}
                              </span>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">{(comp.budget_ratio * 100).toFixed(0)}%</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {comp.allocated_cost || (project.cost * comp.budget_ratio).toFixed(2)} Cr
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold">{comp.completion_pct}%</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              comp.status === 'Completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                              comp.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            }`}>
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Citizen Ratings & Feedback Section */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Citizen Feedback & Quality Ratings ({project.feedbacks.length})</span>
                  </h3>
                </div>

                {/* Rating Form */}
                <form onSubmit={handleSubmitFeedback} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Submit Your Public Feedback as a Citizen</h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-500 mr-1">Rating:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star className={`w-5 h-5 ${
                            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                          }`} />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name / Ward (Optional)"
                      value={citizenName}
                      onChange={e => setCitizenName(e.target.value)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-52 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Write your citizen observation (e.g. road diversions, safety, works progress)..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={submittingFeedback || !comment.trim()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingFeedback ? 'Posting...' : 'Post Review'}</span>
                    </button>
                  </div>
                  {feedbackSuccess && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      ✅ Thank you! Your feedback has been recorded in the civic registry.
                    </p>
                  )}
                </form>

                {/* Feedback List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {project.feedbacks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No feedback submitted yet. Be the first citizen to review this project!</p>
                  ) : (
                    project.feedbacks.map(fb => (
                      <div key={fb.id} className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{fb.citizen_name}</span>
                          <div className="flex items-center space-x-1">
                            <div className="flex text-amber-400">
                              {[...Array(fb.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 ml-1">
                              {new Date(fb.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{fb.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
