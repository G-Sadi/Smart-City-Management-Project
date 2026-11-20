import React, { useState, useEffect } from 'react';
import {
  Building2, MapPin, BarChart3, FileSpreadsheet,
  ShieldCheck, RefreshCw, Sun, Moon, Sparkles, UserCheck,
  CheckCircle2, Search, Menu, X, Command, Sliders, Languages
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
  onOpenStressTest?: () => void;
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
  isBackendConnected,
  onOpenStressTest
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { isBn, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const tabs = [
    { id: 'map', labelKey: 'nav.map', fallback: 'Civic GIS Map', icon: MapPin },
    { id: 'analytics', labelKey: 'nav.analytics', fallback: 'Analytics & Gantt', icon: BarChart3 },
    { id: 'proposals', labelKey: 'nav.proposals', fallback: 'DPP & RCPSP Lab', icon: FileSpreadsheet },
    { id: 'approvals', labelKey: 'nav.approvals', fallback: 'Approvals (ECNEC/MOP)', icon: CheckCircle2 },
    { id: 'progress', labelKey: 'nav.progress', fallback: 'Agency Progress Desk', icon: Building2 },
    { id: 'admin', labelKey: 'nav.admin', fallback: 'Admin & Audit', icon: ShieldCheck },
    { id: 'ai', labelKey: 'nav.ai', fallback: 'AI Urban Advisor', icon: Sparkles },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SYSADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'ECNEC':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'MOP':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'EXEC':
      case 'EXEC_LGD':
      case 'EXEC_MOEDU':
      case 'EXEC_PWD':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  const getDisplayRoleName = (u: User | null) => {
    if (!u || u.role === 'APP') return isBn ? 'নাগরিক' : 'Citizen';
    if (u.role === 'SYSADMIN') return isBn ? 'অ্যাডমিন' : 'Admin';
    if (u.role === 'ECNEC') return isBn ? 'একনেক' : 'ECNEC';
    if (u.role === 'MOP') return isBn ? 'মপ' : 'MOP';
    if (u.agency) return `${u.agency}`;
    return u.role;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Left: Brand Identity */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none flex-shrink-0"
            onClick={() => setActiveTab('map')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/25 ring-1 ring-white/20 bg-[#0B1120] flex items-center justify-center flex-shrink-0">
              <img src={civicgridLogo} alt="CivicGrid Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  {t('app.name')}
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {t('app.tagline')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Center: Global Search Command Bar (Ctrl+K) */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition shadow-2xs"
            >
              <div className="flex items-center space-x-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{t('action.search')}</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-2xs">
                <span>Ctrl K</span>
              </kbd>
            </button>
          </div>

          {/* Right: Actions Toolbar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="Search (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher Pill (EN / বাংলা) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition cursor-pointer shadow-2xs"
              title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              aria-label="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="font-mono text-[11px]">{isBn ? 'বাংলা' : 'EN'}</span>
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
                <span className="font-semibold text-[11px]">Browser Engine</span>
              </div>
            )}

            {/* Sync & Recalculate Button (Desktop & Tablet) */}
            <button
              onClick={onSyncRecalculate}
              disabled={isSyncing}
              title="Synchronize Database changes and recalculate all RCPSP schedules"
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                syncSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing ? t('action.syncing') : syncSuccess ? t('action.synced') : t('action.sync')}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/60 shadow-xs cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title={isDark ? t('action.theme_dark') : t('action.theme_light')}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-xs ${getRoleBadgeColor(user?.role)}`}
              title="Switch user role"
            >
              <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[120px]">
                {getDisplayRoleName(user)}
              </span>
              <span className="opacity-60 underline text-[10px] ml-1">{isBn ? 'পরিবর্তন' : 'Switch'}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition min-w-[38px] min-h-[38px] flex items-center justify-center"
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
                <span>{t(tab.labelKey, tab.fallback)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with Dimmed Backdrop */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 right-0 w-[85vw] max-w-xs h-[100dvh] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0B1120] flex items-center justify-center ring-1 ring-white/10">
                  <img src={civicgridLogo} alt="CivicGrid Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {t('app.name')}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      OS
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role & Language Bar inside Mobile Drawer */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn ? 'বর্তমান ভূমিকা:' : 'Active Role:'}
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuickLogin();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeColor(user?.role)}`}
                >
                  {getDisplayRoleName(user)} ▾
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn ? 'ভাষা:' : 'Language:'}
                </span>
                <button
                  onClick={toggleLanguage}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {isBn ? 'বাংলা (BN)' : 'English (EN)'}
                </button>
              </div>
            </div>

            {/* Tab Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
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
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{t(tab.labelKey, tab.fallback)}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer Actions */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2 safe-bottom">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSyncRecalculate();
                }}
                disabled={isSyncing}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? t('action.syncing') : t('action.sync')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
