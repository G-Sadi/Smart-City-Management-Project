import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, ShieldAlert, Lightbulb, Activity, 
  MessageSquare, Layers, Cpu, CheckCircle2, Key, X, 
  HelpCircle, ArrowRight, ShieldCheck, Database 
} from 'lucide-react';
import { AIAdvisorResponse } from '../types';
import { api } from '../api';

const BYOK_KEY_STORAGE = 'civicgrid_byok_gemini_key';

export const AIAdvisorPanel: React.FC = () => {
  const [queryType, setQueryType] = useState('bottleneck');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);

  // BYOK (Bring Your Own Key) State
  const [isByokModalOpen, setIsByokModalOpen] = useState(false);
  const [byokKey, setByokKey] = useState<string>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem(BYOK_KEY_STORAGE) || '' : '';
  });
  const [byokInput, setByokInput] = useState('');

  const handleSaveByokKey = () => {
    const trimmed = byokInput.trim();
    if (trimmed) {
      sessionStorage.setItem(BYOK_KEY_STORAGE, trimmed);
      setByokKey(trimmed);
      setIsByokModalOpen(false);
    }
  };

  const handleClearByokKey = () => {
    sessionStorage.removeItem(BYOK_KEY_STORAGE);
    setByokKey('');
    setByokInput('');
  };

  const handleQuery = async (type = queryType, promptText = customPrompt) => {
    setLoading(true);
    const activePrompt = promptText.trim() || undefined;

    // Check if client has a BYOK Gemini key saved in sessionStorage
    if (byokKey) {
      try {
        const fullPrompt = 
          `You are the Chief AI Urban Planning & Infrastructure Advisor for the CivicGrid Smart City Management System.\n` +
          `Task: ${activePrompt || `Perform a strategic infrastructure analysis for category: ${type}`}\n\n` +
          `Respond in high-value, crisp executive Markdown. Provide: \n` +
          `1. Executive Summary & Root Cause\n` +
          `2. Concrete Schedule & Resource Bottlenecks\n` +
          `3. Strategic Engineering / DPP Recommendations\n`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${byokKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }]
            })
          }
        );

        if (!geminiRes.ok) {
          const errData = await geminiRes.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Gemini API returned status ${geminiRes.status}`);
        }

        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

        setResponse({
          analysis: text,
          bottlenecks: [
            'Live analysis generated via direct client session',
            'Evaluated under Google Gemini 2.5 Flash model parameters'
          ],
          recommendations: [
            'Apply municipal RCPSP timeframe optimization before approving DPP submissions.',
            'Review contractor liquidity milestones periodically.'
          ],
          metrics: {
            model: 'gemini-2.5-flash',
            timestamp: new Date().toISOString(),
            mode: 'BYOK Client Direct'
          },
          source: 'gemini-2.5-flash (Live BYOK Client Stream)'
        });
        setLoading(false);
        return;
      } catch (err: any) {
        console.warn('BYOK Gemini direct call failed, falling back to engine:', err);
        alert(`BYOK Gemini Call Notice: ${err.message}. Falling back to CivicGrid engine.`);
      }
    }

    // Default: query via API abstraction (FastAPI or Browser Engine)
    try {
      const res = await api.getAIAdvice(
        type,
        undefined,
        undefined,
        activePrompt
      );
      setResponse(res);
    } catch (err: any) {
      alert(`AI Advisor query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sampleChips = [
    { label: '🏛️ Which agency has the highest delay risk?', prompt: 'Which agency has the highest delay risk?' },
    { label: '📍 Summarize budget utilization by zone', prompt: 'Summarize budget utilization by zone' },
    { label: '⛓️ Which projects block downstream dependencies?', prompt: 'Which projects block downstream dependencies?' },
    { label: '💬 Synthesize citizen sentiment on road construction', prompt: 'Synthesize citizen sentiment on road construction' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl space-y-3 border border-emerald-700/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Urban Advisor & Infrastructure Copilot</h2>
              <p className="text-xs text-emerald-100">
                Powered by <strong>Gemini 2.5 Flash</strong> & CivicGrid RCPSP Constraint Engine
              </p>
            </div>
          </div>

          {/* BYOK Status Pill / Button */}
          <div className="flex items-center space-x-2">
            {byokKey ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Live Gemini BYOK Active</span>
                <button
                  onClick={handleClearByokKey}
                  className="hover:text-white p-0.5 rounded transition"
                  title="Remove Key"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsByokModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-emerald-100 hover:text-white transition shadow-sm"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Enable Live Gemini Key (BYOK)</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-emerald-100/90 max-w-3xl leading-relaxed">
          Zero-API mode runs on our embedded deterministic intelligence engine using actual Code Samurai municipal datasets.
          Optionally attach your temporary Gemini key (cleared automatically on tab close) to unlock live generative multimodal guidance.
        </p>
      </div>

      {/* Query Selector Tabs & Natural Language Search */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setQueryType('bottleneck'); handleQuery('bottleneck'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              queryType === 'bottleneck'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DPP Timeframe Windows</span>
          </button>
        </div>

        {/* Natural Language Prompt Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI advisor a specific municipal question (e.g. 'Which agency has the highest delay risk?')..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery(queryType, customPrompt)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

        {/* Quick Question Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Suggested:</span>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomPrompt(chip.prompt);
                handleQuery(queryType, chip.prompt);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advisor Response Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Synthesizing municipal datasets and RCPSP scheduling constraints...
          </p>
          <span className="text-[11px] text-slate-400">
            Evaluating 134 projects across 12 executing agencies and 15 zones.
          </span>
        </div>
      ) : response ? (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 animate-fade-in">
          {/* Header & Source Badge */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Civic Intelligence Diagnostic Output</span>
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
                  <li key={i} dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-4">
            {response.analysis}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            AI Urban Advisor Ready
          </p>
          <p className="text-[11px] text-slate-500">
            Select an analysis query above or enter a custom municipal planning question to generate diagnostic recommendations.
          </p>
        </div>
      )}

      {/* Optional BYOK Gemini Key Modal */}
      {isByokModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsByokModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Key className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Enable Live Gemini 2.5 Flash</h3>
                  <span className="text-[11px] text-slate-400">Optional Bring-Your-Own-Key Mode</span>
                </div>
              </div>
              <button 
                onClick={() => setIsByokModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste your temporary Google Gemini API key to query <code>gemini-2.5-flash</code> directly from your browser.
              Your key is saved <strong>strictly in sessionStorage</strong> and deleted automatically when you close this browser tab.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={byokInput}
                onChange={e => setByokInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsByokModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveByokKey}
                disabled={!byokInput.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                Activate Live Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
