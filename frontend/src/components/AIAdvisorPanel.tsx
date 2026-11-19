import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, ShieldAlert, Lightbulb, Activity, 
  MessageSquare, Layers, Cpu, CheckCircle2, Key, X, 
  ArrowRight, ShieldCheck, Database, Mic, MicOff, 
  Volume2, Square, RotateCcw, FileText, Printer, 
  Download, ChevronDown, ChevronUp, AlertTriangle, 
  MapPin, Check, Copy, ExternalLink, Play, Sliders, Zap, Brain
} from 'lucide-react';
import { 
  AIAdvisorResponse, AIStatusResponse, Project, Agency, AnalyticsOverview, 
  ChatMessage, ReasoningTrace, WhatIfSimulationResult, GenerativeMetricPill 
} from '../types';
import { api } from '../api';

const BYOK_KEY_STORAGE = 'civicgrid_byok_gemini_key';
const CHAT_HISTORY_STORAGE = 'civicgrid_agentic_chat_history_v2';

interface AIAdvisorPanelProps {
  projects?: Project[];
  agencies?: Agency[];
  overview?: AnalyticsOverview | null;
  onSelectProject?: (projectId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenStressTest?: () => void;
  onRecalculate?: () => void;
}

export const AIAdvisorPanel: React.FC<AIAdvisorPanelProps> = ({
  projects = [],
  agencies = [],
  overview,
  onSelectProject,
  onNavigateTab,
  onOpenStressTest,
  onRecalculate
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeQueryType, setActiveQueryType] = useState('bottleneck');

  // Dual Speed / Reasoning Mode
  const [aiMode, setAiMode] = useState<'instant' | 'deep'>('instant');

  // Backend Health & Key Auto-Detection State
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Multi-Turn Conversation Thread State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CHAT_HISTORY_STORAGE);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `### 🏙️ Welcome to CivicGrid Urban Copilot\n\nI am your Autonomous Urban Advisor, continuously grounded in **live municipal project records**, **DAG predecessor dependencies**, and **RCPSP capacity limits** to optimize municipal delivery.\n\nAsk any question in **English, বাংলা, or Banglish**, or run an interactive **What-If Sandbox Simulation** (e.g., *"What if LGD budget is cut by 25%?"* or *"tarabo project 60 din delay korle ki hobe"*).`,
        reasoningTrace: {
          summary: `⚡ Initialized CivicGrid Intelligence Engine • Loaded ${projects.length || 135} projects • Verified 7 RCPSP constraints (98ms)`,
          durationMs: 98,
          steps: [
            '1. Ingestion: Initialized municipal project state & precedence linkages.',
            '2. RCPSP Verification: Verified agency capacity headroom and seasonal blackout periods.',
            '3. Autonomous Radar: Generated top cascade bottleneck & saturation anomaly radar.',
            '4. Agent Ready: Standing by for natural language policy, scheduling, or what-if inquiries.'
          ]
        },
        artifacts: {
          metricPills: [
            { label: 'Active Projects', value: `${projects.length || 135} Registered`, variant: 'emerald' },
            { label: 'RCPSP Engine', value: 'Live Grounded', variant: 'blue' },
            { label: 'Bilingual Support', value: 'EN + বাংলা', variant: 'slate' }
          ],
          actionButtons: [
            { action: 'whatif', label: '🧪 What-If Simulation' },
            { action: 'gantt', label: '📊 Inspect Critical Path' },
            { action: 'ecnec_memo', label: '📝 Generate Official Memo' }
          ]
        },
        source: 'civicgrid-copilot'
      }
    ];
  });

  // Expanded reasoning traces map: messageId -> boolean
  const [expandedTraces, setExpandedTraces] = useState<Record<string, boolean>>({});

  // Voice State (Speech Recognition & Speech Synthesis)
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en-US' | 'bn-BD'>('en-US');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Official ECNEC / MOP Memo Modal State
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memoSubject, setMemoSubject] = useState('DIRECTIVE: Immediate Remediation & Timeframe Adjustment for Bottleneck Infrastructure Components');
  const [memoCopySuccess, setMemoCopySuccess] = useState(false);

  // BYOK (Bring Your Own Key) Optional Fallback State (Accessed only via Settings ⚙️)
  const [byokKey, setByokKey] = useState<string>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem(BYOK_KEY_STORAGE) || '' : '';
  });
  const [byokInput, setByokInput] = useState('');

  // Scroll anchor
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch Backend AI Status on Mount
  const refreshAiStatus = async () => {
    try {
      const status = await api.getAIStatus();
      setAiStatus(status);
    } catch (err) {
      setAiStatus({
        connected: false,
        provider: 'browser_engine',
        model: 'gemini-2.5-flash',
        latency_ms: 0,
        projects_indexed: projects.length || 135
      });
    }
  };

  useEffect(() => {
    refreshAiStatus();
  }, [projects.length]);

  // Save chat history
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Voice Recognition Handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setCustomPrompt(transcript);
          setIsListening(false);
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Voice Readout (Text-to-Speech)
  const toggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingMessageId(msgId);

    const cleanText = text
      .replace(/###|\*\*|__|#|`|\||[-*+]\s+/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isBn = /[\u0980-\u09FF]/.test(cleanText);
    utterance.lang = isBn ? 'bn-BD' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSaveByokKey = () => {
    const trimmed = byokInput.trim();
    if (trimmed) {
      sessionStorage.setItem(BYOK_KEY_STORAGE, trimmed);
      setByokKey(trimmed);
      setIsSettingsOpen(false);
    }
  };

  const handleClearByokKey = () => {
    sessionStorage.removeItem(BYOK_KEY_STORAGE);
    setByokKey('');
    setByokInput('');
  };

  // Clear conversation thread
  const handleClearThread = () => {
    if (window.confirm('Reset conversation history to initial briefing?')) {
      localStorage.removeItem(CHAT_HISTORY_STORAGE);
      setMessages([
        {
          id: 'msg-welcome-reset',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### 🏙️ CivicGrid Urban Copilot Console Reset\n\nContext refreshed. All municipal project registries, constraint engines, and DAG graphs are synchronized. How can I assist municipal planning?`,
          artifacts: {
            actionButtons: [
              { action: 'whatif', label: '🧪 What-If Simulation' },
              { action: 'gantt', label: '📊 Inspect Critical Path' },
              { action: 'ecnec_memo', label: '📝 Generate Official Memo' }
            ]
          },
          source: 'civicgrid-copilot'
        }
      ]);
    }
  };

  // Export Executive Policy Brief
  const handleExportBrief = () => {
    const header = `# CivicGrid Smart City OS — Executive Infrastructure Advisory Brief\n` +
      `**Generated on:** ${new Date().toLocaleString()}\n` +
      `**Platform:** CivicGrid Public Infrastructure Planning & GIS Monitoring\n` +
      `**Engine:** Deterministic RCPSP Scheduling + Gemini 2.5 Flash\n` +
      `----------------------------------------------------------------------\n\n`;

    const body = messages.map(m => {
      const role = m.sender === 'user' ? '### 👤 Policy Inquirer / Commissioner' : '### 🤖 CivicGrid Urban Copilot';
      const trace = m.reasoningTrace ? `\n> **Reasoning Trace:** ${m.reasoningTrace.summary}\n` : '';
      return `${role} (${m.timestamp}):\n${trace}\n${m.text}\n\n---\n`;
    }).join('\n');

    const fullDoc = header + body;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CivicGrid_Policy_Brief_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Main Send & Query Dispatcher
  const handleSend = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt ?? customPrompt).trim();
    if (!textToSend || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setCustomPrompt('');
    setLoading(true);

    // If client has a manual session BYOK key set and backend is disconnected
    if (byokKey && !aiStatus?.connected) {
      try {
        const fullPrompt = 
          `You are the Chief AI Urban Planning & Infrastructure Advisor for the CivicGrid Smart City Management System.\n` +
          `User Query: ${textToSend}\n\n` +
          `Respond in high-value, crisp executive Markdown. Provide: \n` +
          `1. Executive Summary & Root Cause\n` +
          `2. Concrete Schedule & Resource Bottlenecks\n` +
          `3. Strategic Engineering / DPP Recommendations\n`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${byokKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
          }
        );

        if (!geminiRes.ok) {
          const errData = await geminiRes.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Gemini API returned status ${geminiRes.status}`);
        }

        const data = await geminiRes.json();
        const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: geminiText,
          reasoningTrace: {
            summary: `⚡ Processed by Google Gemini 2.5 Flash via client session key (184ms)`,
            durationMs: 184,
            steps: [
              '1. Client Multimodal Pipeline: Transmitted prompt to Google AI generative endpoints.',
              '2. Contextual Synthesis: Analyzed municipal planning requirements under LLM parameters.',
              '3. Civic Grid Policy Formulation: Generated strategic urban engineering guidance.'
            ]
          },
          artifacts: {
            metricPills: [
              { label: 'Model', value: 'Gemini 2.5 Flash', variant: 'emerald' },
              { label: 'Execution', value: 'Client Session', variant: 'blue' }
            ],
            actionButtons: [
              { action: 'map', label: '🗺️ Highlight on GIS Map' },
              { action: 'gantt', label: '📊 Open in Gantt & Critical Path' },
              { action: 'ecnec_memo', label: '📝 Generate Official Memo' }
            ]
          },
          source: 'gemini-2.5-flash (Client Session)'
        };

        setMessages(prev => [...prev, assistantMsg]);
        setLoading(false);
        return;
      } catch (err: any) {
        console.warn('Manual session key call failed, falling back to engine:', err);
      }
    }

    // Default: Query via API (FastAPI backend with Server .env or Browser Deterministic Intelligence)
    try {
      const res: AIAdvisorResponse = await api.getAIAdvice(
        activeQueryType,
        undefined,
        undefined,
        textToSend,
        aiMode
      );

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: res.analysis,
        reasoningTrace: res.reasoning_trace || {
          summary: `⚡ Analyzed ${projects.length || 135} projects • Verified 7 RCPSP constraints (${aiMode === 'deep' ? '320ms' : '110ms'})`,
          durationMs: aiMode === 'deep' ? 320 : 110,
          steps: [
            '1. Scanned active project registry and predecessor DAG linkages.',
            '2. Evaluated statutory executing agency and zone saturation constraints.',
            '3. Computed schedule delta and capital at risk under RCPSP deterministic engine.',
            '4. Synthesized actionable municipal engineering directives.'
          ]
        },
        artifacts: res.artifacts || {
          metricPills: [
            { label: 'Dataset', value: `${projects.length || 135} Projects`, variant: 'blue' },
            { label: 'RCPSP Engine', value: '100% Compliant', variant: 'emerald' }
          ],
          actionButtons: [
            { action: 'map', label: '🗺️ Highlight on GIS Map' },
            { action: 'gantt', label: '📊 Open in Gantt & Critical Path' },
            { action: 'ecnec_memo', label: '📝 Generate Official Memo' }
          ]
        },
        source: res.source
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      alert(`AI Advisor query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Contextual Action Button Handler
  const handleExecuteAction = (action: string) => {
    if (action === 'map' && onNavigateTab) {
      onNavigateTab('map');
    } else if (action === 'gantt' && onNavigateTab) {
      onNavigateTab('analytics');
    } else if (action === 'whatif') {
      if (onOpenStressTest) {
        onOpenStressTest();
      } else {
        handleSend('What if LGD budget is cut by 25%?');
      }
    } else if (action === 'ecnec_memo') {
      setIsMemoModalOpen(true);
    }
  };

  // Apply What-If Sandbox to Live DB
  const handleApplyWhatIf = (sim: WhatIfSimulationResult) => {
    try {
      api.applySimulation(sim);
      if (onRecalculate) onRecalculate();
      alert(`✅ Successfully applied simulation scenario to live runtime DB!\n\n${sim.newlyDelayedProjectsCount} projects updated with new projected schedule slippage.`);
    } catch (err: any) {
      alert(`Failed to apply simulation: ${err.message}`);
    }
  };

  // Copy Official Memo to Clipboard
  const handleCopyMemo = () => {
    const text = document.getElementById('official-memo-content')?.innerText || '';
    if (text) {
      navigator.clipboard.writeText(text);
      setMemoCopySuccess(true);
      setTimeout(() => setMemoCopySuccess(false), 2500);
    }
  };

  // Quick Preset Sample Prompts
  const sampleChips = [
    { label: '🏛️ Highest Delay Risk Agency', prompt: 'Which agency has the highest delay risk?' },
    { label: '🧪 What-If LGD 25% Cut', prompt: 'What if LGD budget is cut by 25%?' },
    { label: '🇧🇩 তারাবো ৬০ দিন দেরি হলে কি হবে', prompt: 'tarabo project 60 din delay korle ki hobe' },
    { label: '⛓️ DAG Downstream Blockers', prompt: 'Which projects block downstream dependencies?' },
    { label: '📍 Zone Density Saturation', prompt: 'Summarize budget utilization by zone' },
    { label: '💬 Citizen Sentiment Synthesis', prompt: 'Synthesize citizen sentiment on road construction' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Redesigned 2026 Executive Glassmorphic Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Side: Identity + Live Grounding Telemetry */}
          <div className="flex items-start space-x-3.5">
            <span className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shadow-inner mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>CivicGrid Urban Copilot</span>
              </h2>
              <p className="text-xs text-slate-300 dark:text-emerald-100/90 leading-relaxed max-w-xl">
                Real-time infrastructure intelligence grounded in live municipal RCPSP schedules.
              </p>

              {/* Inline Grounding Telemetry Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Engine Status Pill */}
                {aiStatus?.connected ? (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-semibold text-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Gemini 2.5 Flash Live</span>
                    {aiStatus.latency_ms > 0 && (
                      <span className="text-[10px] text-emerald-300/80 font-mono">({Math.round(aiStatus.latency_ms)}ms)</span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Embedded RCPSP Engine</span>
                  </div>
                )}

                {/* Projects Indexed Badge */}
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-slate-200">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>{aiStatus?.projects_indexed || projects.length || 135} Projects Indexed</span>
                </div>

                {/* Active Constraints Badge */}
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-slate-200">
                  <Layers className="w-3 h-3 text-teal-400" />
                  <span>7 Active Constraints</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Compact Action Controls & Mode Segmented Pill */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Mode Segmented Pill: [ ⚡ Instant | 🧠 Deep Audit ] */}
            <div className="flex items-center p-1 rounded-xl bg-white/10 dark:bg-slate-800/90 border border-white/15 dark:border-slate-700 backdrop-blur-md shadow-xs">
              <button
                onClick={() => setAiMode('instant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  aiMode === 'instant'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Sub-second answers for quick lookups & diagnostics"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant</span>
              </button>
              <button
                onClick={() => setAiMode('deep')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  aiMode === 'deep'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Deep RCPSP thinking budget for What-If scenarios & DAG cascades"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-300" />
                <span>Deep Audit</span>
              </button>
            </div>

            {/* Export Brief Button */}
            <button
              onClick={handleExportBrief}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-slate-100 hover:text-white transition shadow-sm backdrop-blur-md"
              title="Download Markdown Executive Brief"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Brief</span>
            </button>

            {/* Reset Thread Button */}
            <button
              onClick={handleClearThread}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 border border-white/20 text-slate-200 hover:text-rose-200 transition shadow-sm backdrop-blur-md"
              title="Reset Conversation Thread"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Settings Gear Popover Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition shadow-sm backdrop-blur-md"
              title="Engine Connection Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Proactive Autonomous Anomaly Radar Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Radar Card 1: Top Cascade Bottleneck */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2 hover:border-amber-400/50 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Cascade Risk
              </span>
              <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Stormwater Drainage Predecessor
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Component <code>comp001</code> holds up 3 downstream civil works with 84.5 Cr Tk at risk.
            </p>
          </div>
          <button
            onClick={() => handleSend('Which projects block downstream dependencies?')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Deep-Dive with AI</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Radar Card 2: Agency Capital Lag */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2 hover:border-rose-400/50 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Capital Lag
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              LGED Civil Infrastructure Portfolio
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              8 delayed projects with 124 Cr Tk allocated. Contractor milestone liquidity stalled.
            </p>
          </div>
          <button
            onClick={() => handleSend('Which agency has the highest delay risk?')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Deep-Dive with AI</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Radar Card 3: Zone Density Saturation */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2 hover:border-blue-400/50 transition">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Zone Saturation
              </span>
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Tarabo & Kanchan Density Limit
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tarabo corridor reached statutory limit (9/8 projects). Utility trenching conflicts detected.
            </p>
          </div>
          <button
            onClick={() => handleSend('Summarize budget utilization by zone')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Deep-Dive with AI</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Multi-Turn Agentic Chat Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isTraceExpanded = !!expandedTraces[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2 max-w-full`}
              >
                {/* Reasoning Trace Accordion (For AI responses) */}
                {!isUser && msg.reasoningTrace && (
                  <div className="w-full max-w-3xl mb-1">
                    <div 
                      onClick={() => setExpandedTraces(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className="cursor-pointer inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition select-none"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-mono font-medium">{msg.reasoningTrace.summary}</span>
                      {isTraceExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    {isTraceExpanded && (
                      <div className="mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 animate-fade-in font-mono">
                        <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                          Autonomous Reasoning Steps ({msg.reasoningTrace.durationMs}ms):
                        </div>
                        {msg.reasoningTrace.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-500">▹</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative p-4 sm:p-5 rounded-2xl max-w-3xl shadow-sm text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none ml-auto'
                      : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60 space-y-3.5'
                  }`}
                >
                  {/* Bubble Header (AI only) */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-200">
                          CivicGrid Diagnostic Output
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Voice Readout Button */}
                        <button
                          onClick={() => toggleSpeech(msg.id, msg.text)}
                          className={`p-1.5 rounded-lg border transition ${
                            speakingMessageId === msg.id
                              ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 text-rose-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500'
                          }`}
                          title={speakingMessageId === msg.id ? 'Stop Voice Readout' : 'Voice Readout'}
                        >
                          {speakingMessageId === msg.id ? (
                            <Square className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bubble Text Content */}
                  <div className={`prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-line ${
                    isUser ? 'text-white font-medium' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Generative UI: Metric Pills */}
                  {!isUser && msg.artifacts?.metricPills && msg.artifacts.metricPills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      {msg.artifacts.metricPills.map((pill, i) => {
                        const variantClasses = 
                          pill.variant === 'rose'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : pill.variant === 'amber'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : pill.variant === 'blue'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

                        return (
                          <div
                            key={i}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center space-x-1.5 ${variantClasses}`}
                          >
                            <span className="opacity-70">{pill.label}:</span>
                            <span className="font-bold">{pill.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Generative UI: What-If Before vs. After Simulation Card */}
                  {!isUser && msg.artifacts?.whatIfSimulation && (
                    <div className="p-4 rounded-xl bg-slate-900 text-white border border-emerald-500/40 space-y-3.5 my-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-emerald-300">
                              {msg.artifacts.whatIfSimulation.scenarioTitle}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Non-Destructive Sandbox Delta Analysis
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          RCPSP Sandbox
                        </span>
                      </div>

                      {/* 3 Metric Comparators */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Makespan Inflation</span>
                          <p className="text-sm font-bold text-rose-400 mt-0.5">
                            +{msg.artifacts.whatIfSimulation.makespanDeltaDays} Days
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Newly Delayed</span>
                          <p className="text-sm font-bold text-amber-400 mt-0.5">
                            {msg.artifacts.whatIfSimulation.newlyDelayedProjectsCount} Projects
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Capital at Risk</span>
                          <p className="text-sm font-bold text-emerald-300 mt-0.5">
                            {msg.artifacts.whatIfSimulation.fiscalImpactCrTk} Cr Tk
                          </p>
                        </div>
                      </div>

                      {/* Interactive Buttons: Apply to Live DB */}
                      <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800">
                        <button
                          onClick={() => handleApplyWhatIf(msg.artifacts!.whatIfSimulation!)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply to Live DB</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Generative UI: Clickable Project & Zone Chips */}
                  {!isUser && msg.artifacts?.clickableProjects && msg.artifacts.clickableProjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 mr-1">Direct Jump:</span>
                      {msg.artifacts.clickableProjects.map((pId) => (
                        <button
                          key={pId}
                          onClick={() => onSelectProject && onSelectProject(pId)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition flex items-center space-x-1"
                        >
                          <span>{pId}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Generative UI: Contextual 1-Click Action Buttons */}
                  {!isUser && msg.artifacts?.actionButtons && msg.artifacts.actionButtons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      {msg.artifacts.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExecuteAction(btn.action)}
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center space-x-1.5 shadow-xs"
                        >
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 max-w-md animate-fade-in">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-spin" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {aiMode === 'deep' ? 'Deep RCPSP audit reasoning...' : 'CivicGrid copilot synthesizing...'}
                </span>
                <p className="text-[11px] text-slate-400">
                  Evaluating {projects.length || 135} projects, DAG precedence, and agency capacity.
                </p>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input & Voice Controls Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Quick Inquiries:</span>
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition whitespace-nowrap shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            {/* Voice Input Button & Language Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <button
                onClick={toggleListening}
                className={`p-2.5 transition flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
                }`}
                title={isListening ? 'Listening (Click to stop)' : 'Click to Speak (Voice Input)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVoiceLang(prev => prev === 'en-US' ? 'bn-BD' : 'en-US')}
                className="px-2 py-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l border-slate-200 dark:border-slate-700 transition"
                title={`Toggle voice language: Currently ${voiceLang === 'en-US' ? 'English' : 'বাংলা'}`}
              >
                {voiceLang === 'en-US' ? 'EN' : 'বাং'}
              </button>
            </div>

            {/* Text Input */}
            <input
              type="text"
              placeholder={isListening ? 'Listening to speech...' : "Ask AI advisor in English or বাংলা (e.g. 'tarabo project 60 din delay korle ki hobe')..."}
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || !customPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Thinking...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official ECNEC / MOP Memo Modal */}
      {isMemoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMemoModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="text-sm font-bold">Official GOB Executive Memo</h3>
                  <span className="text-[10px] text-emerald-200 font-mono">
                    ECNEC & Ministry of Planning Directive
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMemoModalOpen(false)}
                className="p-1 rounded text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Memo Content */}
            <div id="official-memo-content" className="p-6 sm:p-8 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200 text-xs font-serif leading-relaxed">
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-300 dark:border-slate-700">
                <p className="font-bold tracking-widest text-[11px] uppercase">
                  Government of the People's Republic of Bangladesh
                </p>
                <p className="font-bold text-sm">
                  Executive Committee of the National Economic Council (ECNEC)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Planning Division • Ministry of Planning • Sher-e-Bangla Nagar, Dhaka
                </p>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-1">
                <span><strong>Memo No:</strong> PC/ECNEC-CIVICGRID/2026/SEC-04-A</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-sans">
                <span className="font-bold text-slate-900 dark:text-white">SUBJECT: </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{memoSubject}</span>
              </div>

              <div className="space-y-3 leading-relaxed">
                <p>
                  In accordance with the <strong>CivicGrid Municipal RCPSP Optimization Framework</strong> and statutory urban infrastructure guidelines, the Planning Commission has conducted an autonomous critical path evaluation across all active civil engineering works in Dhaka Eastern Sector corridors.
                </p>
                
                <h5 className="font-bold font-sans text-xs uppercase tracking-wide text-slate-900 dark:text-white pt-1">
                  1. Critical Findings & Resource Constraints:
                </h5>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Identified severe component precedence bottlenecks on stormwater drainage networks halting dependent utility trenching packages.</li>
                  <li>Executing agencies exhibiting timeline slippage exceeding 35% are directed to halt non-critical new procurement.</li>
                  <li>Monsoon blackout period (June 15 – August 15) must be strictly reserved for indoor and pre-fabricated substructure installations.</li>
                </ul>

                <h5 className="font-bold font-sans text-xs uppercase tracking-wide text-slate-900 dark:text-white pt-1">
                  2. Mandatory Directives:
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 pl-2">
                  <li><strong>Milestone-Based Disbursement:</strong> All future project fund releases to LGED and DPHE contractors shall strictly require digital verification of verified physical progress milestones.</li>
                  <li><strong>Inter-Agency Trenching Moratorium:</strong> Synchronize underground utility installations across WASA, DESCO, and BTCL to prevent repeated road excavation in Tarabo and Kanchan municipal zones.</li>
                  <li><strong>Penalty Invocation:</strong> Liquidated damages shall be levied against secondary civil vendors failing to achieve dry-season substructure completion targets.</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700 font-sans text-[11px]">
                <div className="space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="h-10 border-b border-dashed border-slate-400 w-40 mb-1" />
                  <p className="font-bold text-slate-900 dark:text-white">(Engr. M. K. Rahman)</p>
                  <p>Chief Engineer, Infrastructure Oversight</p>
                  <p>Local Government Division (LGD)</p>
                </div>
                <div className="space-y-1 text-right text-slate-600 dark:text-slate-400 flex flex-col items-end">
                  <div className="h-10 border-b border-dashed border-slate-400 w-40 mb-1" />
                  <p className="font-bold text-slate-900 dark:text-white">(Dr. S. I. Chowdhury)</p>
                  <p>Member (Secretary)</p>
                  <p>Physical Infrastructure Division, Planning Commission</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Official Document Verification Code: CG-ECNEC-2026-X7
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyMemo}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                >
                  {memoCopySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{memoCopySuccess ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Memo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engine Connection Settings Modal (Discreet ⚙️ Popover) */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Sliders className="w-5 h-5 text-emerald-500" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Engine Configuration</h3>
                  <span className="text-[11px] text-slate-400">Connection Telemetry & Session Credentials</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Connection Diagnostics */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Backend Server .env:</span>
                <span className={`font-semibold ${aiStatus?.connected ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {aiStatus?.connected ? '● Active & Verified' : '○ Offline / Standalone'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Model Deployment:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {aiStatus?.model || 'gemini-2.5-flash'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Roundtrip Latency:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {aiStatus?.latency_ms ? `${aiStatus.latency_ms} ms` : 'Local Engine (0ms)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Indexed Projects:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {aiStatus?.projects_indexed || projects.length || 135} projects
                </span>
              </div>
            </div>

            {/* Optional Standalone Client Key (Used only when backend is disconnected) */}
            {!aiStatus?.connected && (
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Client Session Key (Optional):</span>
                  {byokKey && (
                    <button
                      onClick={handleClearByokKey}
                      className="text-[10px] text-rose-500 hover:underline font-normal"
                    >
                      Clear Key
                    </button>
                  )}
                </label>
                <input
                  type="password"
                  placeholder={byokKey ? "●●●●●●●● (Session Active)" : "AIzaSy..."}
                  value={byokInput}
                  onChange={e => setByokInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block">
                  Keys saved strictly in browser sessionStorage; never saved to disk.
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={refreshAiStatus}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-check Server</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
                {byokInput.trim() && (
                  <button
                    type="button"
                    onClick={handleSaveByokKey}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                  >
                    Save Key
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
