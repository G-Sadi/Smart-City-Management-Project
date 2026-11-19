import React, { useState } from 'react';
import { 
  Sparkles, Send, ShieldAlert, Lightbulb, Activity, 
  MessageSquare, Layers, Cpu, CheckCircle2 
} from 'lucide-react';
import { AIAdvisorResponse } from '../types';
import { api } from '../api';

export const AIAdvisorPanel: React.FC = () => {
  const [queryType, setQueryType] = useState('bottleneck');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);

  const handleQuery = async (type = queryType, promptText = customPrompt) => {
    setLoading(true);
    try {
      const res = await api.getAIAdvice(
        type,
        undefined,
        undefined,
        promptText.trim() || undefined
      );
      setResponse(res);
    } catch (err: any) {
      alert(`AI Advisor query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl space-y-2 border border-emerald-700/50">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </span>
          <h2 className="text-xl font-bold tracking-tight">AI Urban Advisor & Infrastructure Copilot</h2>
        </div>
        <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
          Powered by <strong>Gemini 2.5 Flash</strong> via the official Google GenAI SDK (with deterministic domain-rule fallback).
          Analyzes real-time RCPSP bottlenecks, municipal saturation quotas, citizen sentiment, and optimal DPP project windows.
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setQueryType('bottleneck'); handleQuery('bottleneck'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              queryType === 'bottleneck'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Schedule Bottlenecks & Overload</span>
          </button>

          <button
            onClick={() => { setQueryType('feedback_summary'); handleQuery('feedback_summary'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              queryType === 'feedback_summary'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Citizen Sentiment Synthesis</span>
          </button>

          <button
            onClick={() => { setQueryType('dpp_recommendation'); handleQuery('dpp_recommendation'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              queryType === 'dpp_recommendation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DPP Window Recommendations</span>
          </button>
        </div>

        {/* Custom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI advisor a specific municipal question (e.g. 'How can LGD resolve Daudpur road delays?')..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery(queryType, customPrompt)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleQuery(queryType, customPrompt)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Analyzing...' : 'Ask Advisor'}</span>
          </button>
        </div>
      </div>

      {/* Advisor Response Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
          <p>Analyzing cross-agency capacity, location limits, and RCPSP scheduling constraints...</p>
        </div>
      ) : response ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 animate-fade-in">
          {/* Header & Source Badge */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Advisor Intelligence Output</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Source: {response.source}
            </span>
          </div>

          {/* Key Bottlenecks Highlight Cards */}
          {response.bottlenecks && response.bottlenecks.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Identified Schedule & Resource Bottlenecks</span>
              </h4>
              <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1 list-disc list-inside">
                {response.bottlenecks.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategic Recommendations */}
          {response.recommendations && response.recommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Strategic Engineering & Policy Recommendations</span>
              </h4>
              <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1 list-disc list-inside">
                {response.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Narrative */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-700/60 pt-4">
            {response.analysis}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
          <p>Select an option above to generate an instant infrastructure intelligence brief.</p>
        </div>
      )}
    </div>
  );
};
