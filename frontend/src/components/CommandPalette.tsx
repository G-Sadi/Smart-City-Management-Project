import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, Building2, MapPin, HardHat, FileSpreadsheet,
  ArrowRight, Sparkles, CheckCircle2, Clock, Layers, ShieldCheck,
  AlertTriangle, Sun, Moon, Languages, UserCheck, RefreshCw, Command
} from 'lucide-react';
import { Project, Agency, ComponentItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  agencies: Agency[];
  components?: ComponentItem[];
  onSelectProject: (projectId: string) => void;
  onSelectLocation?: (location: string) => void;
  onSelectAgency?: (agencyCode: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenQuickLogin?: () => void;
  onSyncRecalculate?: () => void;
}

interface PaletteActionItem {
  id: string;
  type: 'action' | 'project' | 'agency' | 'location' | 'component';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  handler: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects = [],
  agencies = [],
  components = [],
  onSelectProject,
  onSelectLocation,
  onSelectAgency,
  onNavigateTab,
  onOpenQuickLogin,
  onSyncRecalculate,
}) => {
  const { isBn, t, toggleLanguage, formatCrTk } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const q = query.toLowerCase().trim();

  // Quick Action Items
  const quickActions: PaletteActionItem[] = useMemo(() => {
    return [
      {
        id: 'act-map-2d',
        type: 'action',
        title: isBn ? 'নাগরিক জিআইএস ম্যাপে যান' : 'Navigate to Civic GIS Map',
        subtitle: isBn ? '২ডি মানচিত্রে প্রকল্প ও সেন্সর মনিটরিং' : '2D Leaflet interactive municipal map & IoT telemetry',
        icon: MapPin,
        badge: 'Tab',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        handler: () => {
          onNavigateTab?.('map');
          onClose();
        },
      },
      {
        id: 'act-analytics-gantt',
        type: 'action',
        title: isBn ? 'গ্যান্ট চার্ট ও আরসিপিএসপি বিশ্লেষণ' : 'Analytics & RCPSP Gantt Schedule',
        subtitle: isBn ? 'সময়রেখা ও বাজেট বিশ্লেষণ ড্যাশবোর্ড' : 'Algorithmic timeline, idle reduction & budget analytics',
        icon: Clock,
        badge: 'Tab',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        handler: () => {
          onNavigateTab?.('analytics');
          onClose();
        },
      },
      {
        id: 'act-proposals',
        type: 'action',
        title: isBn ? 'নতুন ডিপিপি প্রস্তাব তৈরি করুন' : 'Draft New DPP Proposal',
        subtitle: isBn ? 'পরিকল্পনা কমিশনে ডিপিপি ও কম্পোনেন্ট জমা দিন' : 'Create new municipal project proposal & scheduling constraints',
        icon: FileSpreadsheet,
        badge: 'DPP',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        handler: () => {
          onNavigateTab?.('proposals');
          onClose();
        },
      },
      {
        id: 'act-approvals',
        type: 'action',
        title: isBn ? 'একনেক / পরিকল্পনা মন্ত্রণালয় অনুমোদন কিউ' : 'ECNEC / MOP Approvals Queue',
        subtitle: isBn ? '৫০ কোটি ঊর্ধ্ব ও মধ্যম প্রকল্পের অনুমোদন ডেস্ক' : 'Review & approve municipal projects with RCPSP preview',
        icon: CheckCircle2,
        badge: 'Authority',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        handler: () => {
          onNavigateTab?.('approvals');
          onClose();
        },
      },
      {
        id: 'act-progress',
        type: 'action',
        title: isBn ? 'দপ্তর ফিল্ড অগ্রগতি ডেস্ক' : 'Agency Field Progress Desk',
        subtitle: isBn ? 'ফিজিক্যাল অগ্রগতি ও ব্লকড কম্পোনেন্ট পরিচালনা' : 'Update physical progress & resolve dependency bottlenecks',
        icon: HardHat,
        badge: 'Field',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        handler: () => {
          onNavigateTab?.('progress');
          onClose();
        },
      },
      {
        id: 'act-ai',
        type: 'action',
        title: isBn ? 'এআই নগর উপদেষ্টা ও অবকাঠামো কপাইলট' : 'AI Urban Advisor & Copilot',
        subtitle: isBn ? 'ন্যাচারাল ল্যাঙ্গুয়েজ হোয়াট-ইফ সিমুলেশন ও পরামর্শ' : 'Interactive natural-language simulations & risk advisor',
        icon: Sparkles,
        badge: 'AI',
        badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
        handler: () => {
          onNavigateTab?.('ai');
          onClose();
        },
      },
      {
        id: 'act-switch-role',
        type: 'action',
        title: isBn ? 'ভূমিকা পরিবর্তন করুন (সিস্টেম ভূমিকা)' : 'Switch User Role (Demo Switcher)',
        subtitle: isBn ? 'নাগরিক, একনেক, পরিকল্পনা মন্ত্রণালয় বা দপ্তর ভূমিকা নিন' : 'Switch between Citizen, ECNEC, MOP, LGD, or Admin',
        icon: UserCheck,
        badge: 'Role',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        handler: () => {
          onOpenQuickLogin?.();
          onClose();
        },
      },
      {
        id: 'act-toggle-lang',
        type: 'action',
        title: isBn ? 'Switch to English Language' : 'বাংলা ভাষায় পরিবর্তন করুন',
        subtitle: isBn ? 'Change interface to English' : 'সমগ্র ইন্টারফেস বাংলায় প্রদর্শন করুন',
        icon: Languages,
        badge: 'i18n',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
        handler: () => {
          toggleLanguage();
          onClose();
        },
      },
      {
        id: 'act-toggle-theme',
        type: 'action',
        title: isDark ? (isBn ? 'লাইট মোডে পরিবর্তন করুন' : 'Switch to Light Theme') : (isBn ? 'ডার্ক মোডে পরিবর্তন করুন' : 'Switch to Dark Theme'),
        subtitle: isDark ? 'Enable accessible high-contrast light mode' : 'Enable deep midnight command center dark mode',
        icon: isDark ? Sun : Moon,
        badge: 'Theme',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        handler: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'act-sync-db',
        type: 'action',
        title: isBn ? 'ডাটাবেজ সিঙ্ক ও শিডিউল পুনঃগণনা' : 'Sync Database & Recalculate RCPSP',
        subtitle: isBn ? 'সকল কনস্ট্রেইন্ট যাচাই করে সময়রেখা আপডেট করুন' : 'Recompute scheduling DAG and refresh baseline state',
        icon: RefreshCw,
        badge: 'Sync',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        handler: () => {
          onSyncRecalculate?.();
          onClose();
        },
      },
    ];
  }, [isBn, isDark, onNavigateTab, onClose, onOpenQuickLogin, toggleLanguage, toggleTheme, onSyncRecalculate]);

  // Search Results Compilation
  const searchResults: PaletteActionItem[] = useMemo(() => {
    const results: PaletteActionItem[] = [];

    // Filter Quick Actions matching query
    if (q) {
      quickActions.forEach(act => {
        if (act.title.toLowerCase().includes(q) || act.subtitle.toLowerCase().includes(q)) {
          results.push(act);
        }
      });
    }

    // Filter Projects
    const matchedProjects = q
      ? projects.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.project_id.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.exec.toLowerCase().includes(q) ||
          (p.goal && p.goal.toLowerCase().includes(q))
        ).slice(0, 6)
      : projects.slice(0, 4);

    matchedProjects.forEach(p => {
      results.push({
        id: `proj-${p.project_id}`,
        type: 'project',
        title: p.name,
        subtitle: `${p.project_id} • 📍 ${p.location} • 🏛️ ${p.exec} • 💰 ${formatCrTk(p.cost)} • ${p.completion}% completed`,
        icon: Building2,
        badge: p.status,
        badgeColor:
          p.status === 'Running'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : p.status === 'Delayed'
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        handler: () => {
          onSelectProject(p.project_id);
          onNavigateTab?.('map');
          onClose();
        },
      });
    });

    // Filter Agencies
    const matchedAgencies = q
      ? agencies.filter(a => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)).slice(0, 3)
      : [];

    matchedAgencies.forEach(a => {
      results.push({
        id: `agency-${a.code}`,
        type: 'agency',
        title: `${a.code} — ${a.name}`,
        subtitle: isBn ? `${a.code} দপ্তরের পোর্টফোলিও দেখুন` : `Executing Agency Portfolio (${a.type})`,
        icon: HardHat,
        badge: 'Agency',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        handler: () => {
          onSelectAgency?.(a.code);
          onNavigateTab?.('progress');
          onClose();
        },
      });
    });

    // Filter Municipal Zones
    const allLocations = Array.from(new Set(projects.map(p => p.location))).sort();
    const matchedLocations = q
      ? allLocations.filter(loc => loc.toLowerCase().includes(q)).slice(0, 3)
      : [];

    matchedLocations.forEach(loc => {
      results.push({
        id: `loc-${loc}`,
        type: 'location',
        title: loc,
        subtitle: isBn ? `${loc} অঞ্চলের সকল প্রকল্প ফিল্টার করুন` : `Municipal Zone • Filter projects on GIS map`,
        icon: MapPin,
        badge: 'Zone',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
        handler: () => {
          onSelectLocation?.(loc);
          onNavigateTab?.('map');
          onClose();
        },
      });
    });

    // If query is empty, append default quick actions
    if (!q) {
      return [...quickActions.slice(0, 4), ...results];
    }

    return results;
  }, [q, quickActions, projects, agencies, isBn, formatCrTk, onSelectProject, onNavigateTab, onClose, onSelectAgency, onSelectLocation]);

  // Keyboard navigation listener (ArrowDown, ArrowUp, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          searchResults[selectedIndex].handler();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= searchResults.length) {
      setSelectedIndex(Math.max(0, searchResults.length - 1));
    }
  }, [searchResults.length, selectedIndex]);

  // Auto-scroll selected element into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isBn
                ? 'প্রকল্প, দপ্তর, জোন বা কমান্ড খুঁজুন... (যেমন: দাউদপুর, LGD, proj1080)'
                : 'Search projects, agencies, municipal zones, or actions... (e.g., Daudpur, LGD, Map, Gantt)'
            }
            className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 sm:p-3 space-y-1 flex-1">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={item.handler}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 shadow-2xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected
                              ? 'text-emerald-900 dark:text-emerald-300 font-bold'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-current ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400 translate-x-1'
                        : 'text-slate-400 opacity-40'
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <Search className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p>
                {isBn
                  ? `"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি`
                  : `No results found for "${query}"`}
              </p>
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? 'জোন (যেমন: Daudpur) বা দপ্তর (যেমন: LGD) দিয়ে খুঁজুন।'
                  : 'Try searching by municipal zone or agency code.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline">{isBn ? 'নেভিগেশন:' : 'Shortcuts:'}</span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↑↓</kbd>
              <span>{isBn ? 'মুভ' : 'navigate'}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↵</kbd>
              <span>{isBn ? 'নির্বাচন' : 'select'}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">esc</kbd>
              <span>{isBn ? 'বন্ধ' : 'close'}</span>
            </span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10px]">
            CivicGrid Command v2.6
          </span>
        </div>
      </div>
    </div>
  );
};
