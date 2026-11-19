import React from 'react';
import {
  Building2, MapPin, BarChart3, FileSpreadsheet,
  ShieldCheck, RefreshCw, Sun, Moon, Sparkles, UserCheck, CheckCircle2
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onOpenQuickLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
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
  darkMode,
  setDarkMode,
  onSyncRecalculate,
  isSyncing,
  syncSuccess,
  isBackendConnected
}) => {
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
      case 'SYSADMIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300';
      case 'ECNEC': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300';
      case 'MOP': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300';
      case 'EXEC': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300';
      default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 ring-1 ring-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">CivicGrid</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Smart City OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Public Infrastructure Planning & GIS Monitoring</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-3">
            {/* Live Engine Status Badge */}
            {isBackendConnected ? (
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium">Connected to FastAPI Backend</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-700 dark:text-teal-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="font-medium">Live Demo Mode (Browser Engine)</span>
              </div>
            )}

            {/* Manual Sync & Recalculate Button */}
            <button
              onClick={onSyncRecalculate}
              disabled={isSyncing}
              title="Synchronize Database changes and recalculate all RCPSP schedules"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${syncSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Synced & Recalculated!' : 'Sync & Recalculate'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User / Quick Login Button */}
            <button
              onClick={onOpenQuickLogin}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${getRoleBadgeColor(user?.role)}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{user ? `${user.role}${user.agency ? ` (${user.agency})` : ''}` : 'Citizen (Guest)'}</span>
              <span className="opacity-60 underline text-[10px]">Switch</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
