import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Building2, MapPin, HardHat, FileSpreadsheet, 
  ArrowRight, Sparkles, CheckCircle2, Clock 
} from 'lucide-react';
import { Project, Agency } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  agencies: Agency[];
  onSelectProject: (projectId: string) => void;
  onSelectLocation?: (location: string) => void;
  onSelectAgency?: (agencyCode: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  agencies,
  onSelectProject,
  onSelectLocation,
  onSelectAgency,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter matching projects
  const matchedProjects = q
    ? projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.project_id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.exec.toLowerCase().includes(q) ||
        (p.goal && p.goal.toLowerCase().includes(q))
      ).slice(0, 6)
    : projects.slice(0, 4);

  // Filter matching agencies
  const matchedAgencies = q
    ? agencies.filter(a =>
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  // Filter matching locations
  const allLocations = Array.from(new Set(projects.map(p => p.location))).sort();
  const matchedLocations = q
    ? allLocations.filter(loc => loc.toLowerCase().includes(q)).slice(0, 3)
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects, agencies, municipal zones, or ID... (e.g. Daudpur, LGED, proj001)"
            className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            ESC to close
          </span>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Projects Group */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Infrastructure Projects ({matchedProjects.length})
              </div>
              <div className="space-y-1">
                {matchedProjects.map(p => (
                  <div
                    key={p.project_id}
                    onClick={() => {
                      onSelectProject(p.project_id);
                      if (onNavigateTab) onNavigateTab('map');
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        p.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        p.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{p.project_id}</span>
                          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {p.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          📍 {p.location} • 🏛️ {p.exec} • 💰 {p.cost} Cr Tk • {p.completion}% done
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agencies Group */}
          {matchedAgencies.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Executing Agencies
              </div>
              <div className="space-y-1">
                {matchedAgencies.map(a => (
                  <div
                    key={a.code}
                    onClick={() => {
                      if (onSelectAgency) onSelectAgency(a.code);
                      if (onNavigateTab) onNavigateTab('progress');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                        <HardHat className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 mr-2">{a.code}</span>
                        <span className="text-[11px] text-slate-500">{a.name}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">View Portfolio →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Group */}
          {matchedLocations.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Municipal Zones
              </div>
              <div className="space-y-1">
                {matchedLocations.map(loc => (
                  <div
                    key={loc}
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(loc);
                      if (onNavigateTab) onNavigateTab('map');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">{loc}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Filter on Map →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedProjects.length === 0 && matchedAgencies.length === 0 && matchedLocations.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <Search className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p>No matching projects or entities found for "{query}".</p>
              <p className="text-[11px] text-slate-500">Try searching by zone name (e.g. Daudpur) or agency (e.g. LGD).</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Navigation:</span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">↵</kbd>
              <span>to select</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">esc</kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">CivicGrid Command</span>
        </div>
      </div>
    </div>
  );
};
