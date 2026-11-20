import React, { useState } from 'react';
import {
  Building2, MapPin, BarChart3, FileSpreadsheet,
  ShieldCheck, RefreshCw, Sun, Moon, Sparkles, UserCheck, 
  CheckCircle2, Search, Menu, X, Command
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import civicgridLogo from '../assets/civicgrid-logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onOpenQuickLogin: () => void;
  onOpenCommandPalette: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  onSyncRecalculate: () => void;
  isSyncing: boolean;
  syncSuccess: boolean;
  isBackendConnected?: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenQuickLogin,
  onOpenCommandPalette,
  onSyncRecalculate,
  isSyncing,
  syncSuccess,
  isBackendConnected
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'map', label: 'Civic GIS Map', icon: MapPin },
    { id: 'analytics', label: 'Analytics & Gantt', icon: BarChart3 },
    { id: 'proposals', label: 'DPP & RCPSP Lab', icon: FileSpreadsheet },
    { id: 'approvals', label: 'Approvals (ECNEC/MOP)', icon: CheckCircle2 },
    { id: 'progress', label: 'Agency Progress Desk', icon: Building2 },
    { id: 'admin', label: 'Admin & Audit', icon: ShieldCheck },
    { id: 'ai', label: 'AI Urban Advisor', icon: Sparkles },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SYSADMIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'ECNEC': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'MOP': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'EXEC': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer select-none flex-shrink-0" onClick={() => setActiveTab('map')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/25 ring-1 ring-white/20 bg-[#0B1120] flex items-center justify-center">
              <img src={civicgridLogo} alt="CivicGrid Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">CivicGrid</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Smart City OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Public Infrastructure Planning & GIS Monitoring
              </p>
            </div>
          </div>

          {/* Center: Global Search Command Bar (Ctrl+K) */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search projects, zones, agencies...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-2xs">
                <span>Ctrl K</span>
              </kbd>
            </button>
          </div>

          {/* Right: Actions Toolbar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Engine Status Pill */}
            {isBackendConnected ? (
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-[11px]">FastAPI Connected</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-700 dark:text-teal-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="font-semibold text-[11px]">Live Browser Engine</span>
              </div>
            )}

            {/* Sync & Recalculate Button */}
            <button
              onClick={onSyncRecalculate}
              disabled={isSyncing}
              title="Synchronize Database changes and recalculate all RCPSP schedules"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                syncSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync & Recalculate'}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/60 shadow-xs cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* User / Quick Login Button */}
            <button
              onClick={onOpenQuickLogin}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-xs ${getRoleBadgeColor(user?.role)}`}
              title="Switch user role"
            >
              <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-none">
                {user ? `${user.role}${user.agency ? ` (${user.agency})` : ''}` : 'Citizen'}
              </span>
              <span className="opacity-60 underline text-[10px] hidden sm:inline">Switch</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation (Scrollable Pill Bar) */}
        <div className="hidden sm:flex space-x-1 overflow-x-auto pb-1.5 scrollbar-none pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1 animate-fade-in">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
