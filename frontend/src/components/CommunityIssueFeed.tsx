import React, { useState, useEffect } from 'react';
import { CivicIssue } from '../types';
import { api } from '../api';
import {
  ChevronUp, AlertCircle, MapPin, Clock, Camera, ThumbsUp,
  Filter, CheckCircle, RefreshCw
} from 'lucide-react';

interface CommunityIssueFeedProps {
  projectId?: string | null;
  onOpenReportModal: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const CommunityIssueFeed: React.FC<CommunityIssueFeedProps> = ({
  projectId,
  onOpenReportModal,
  onSelectProject,
}) => {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  const loadIssues = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCivicIssues(projectId || undefined);
      setIssues(data);
    } catch (err) {
      console.error('Failed to load civic issues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    // Load local upvoted IDs
    const saved = localStorage.getItem('civicgrid_user_upvotes');
    if (saved) {
      try {
        setUpvotedMap(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, [projectId]);

  const handleUpvote = async (issueId: string) => {
    const isAlreadyUpvoted = !!upvotedMap[issueId];
    if (isAlreadyUpvoted) return; // Prevent duplicate local vote

    // Optimistic UI update
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, upvotes: issue.upvotes + 1 };
      }
      return issue;
    }));

    const newMap = { ...upvotedMap, [issueId]: true };
    setUpvotedMap(newMap);
    localStorage.setItem('civicgrid_user_upvotes', JSON.stringify(newMap));

    try {
      await api.upvoteCivicIssue(issueId);
    } catch (err) {
      console.warn('Backend upvote sync failed, persisted locally', err);
    }
  };

  const filteredIssues = issues.filter(i => {
    if (filterCategory === 'All') return true;
    return i.category === filterCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
      {/* Header & Report Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Citizen Disruption & Hazard Feed
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
              {issues.length} Active Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Public ground observations influencing predictive risk & dispatch priority
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadIssues}
            title="Refresh Feed"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <span>+ Report Civic Issue</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {['All', 'Traffic Bottleneck', 'Waterlogging', 'Safety Hazard', 'Work Stalled', 'Road Damage'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-cyan-500 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No civic issues reported matching the current filter.
          </div>
        ) : (
          filteredIssues.map(issue => {
            const hasUpvoted = !!upvotedMap[issue.id];
            return (
              <div
                key={issue.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                {/* Upvote Button Column */}
                <button
                  onClick={() => handleUpvote(issue.id)}
                  disabled={hasUpvoted}
                  className={`flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg border transition-all ${
                    hasUpvoted
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-500'
                  }`}
                  title={hasUpvoted ? 'You upvoted this issue' : 'Upvote this issue to raise predictive risk weighting'}
                >
                  <ChevronUp className={`w-4 h-4 ${hasUpvoted ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-xs font-bold font-mono">{issue.upvotes}</span>
                </button>

                {/* Issue Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {issue.category}
                    </span>
                    {issue.project_id && (
                      <button
                        onClick={() => onSelectProject && onSelectProject(issue.project_id)}
                        className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                      >
                        [{issue.project_id}]
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {issue.location_name}
                    </span>
                    <span className="italic">Reported by {issue.citizen_name}</span>
                  </div>
                </div>

                {/* Photo Thumbnail if attached */}
                {issue.photo_url && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <img
                      src={issue.photo_url}
                      alt="Civic issue evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityIssueFeed;
