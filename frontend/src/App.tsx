import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProposalCreator } from './components/ProposalCreator';
import { ApprovingPortal } from './components/ApprovingPortal';
import { ProgressUpdateDesk } from './components/ProgressUpdateDesk';
import { AdminAuditConsole } from './components/AdminAuditConsole';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AIAdvisorPanel } from './components/AIAdvisorPanel';
import { QuickLoginModal } from './components/QuickLoginModal';
import { ExecutiveKpiRibbon } from './components/ExecutiveKpiRibbon';
import { CommandPalette } from './components/CommandPalette';
import { JudgeStressTestDrawer } from './components/JudgeStressTestDrawer';
import { Project, Agency, AnalyticsOverview, User } from './types';
import { api, subscribeBackendStatus, checkBackendHealth, subscribeDBChanges } from './api';
import { useTheme } from './context/ThemeContext';
import { Sliders, CheckCircle2 } from 'lucide-react';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('map');
  const [projects, setProjects] = useState<Project[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  // Modals & UI states
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);
  const [dbNotification, setDbNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subscribe to live DB mutations (polling or socket updates)
  useEffect(() => {
    const unsub = subscribeDBChanges(() => {
      setDbNotification('Direct DB Change Detected — Schedules Recalculated');
      loadCoreData();
      setTimeout(() => setDbNotification(null), 4500);
    });
    return () => unsub();
  }, []);

  // Load User from LocalStorage or fetch current user
  useEffect(() => {
    const savedUser = localStorage.getItem('civicgrid_user') || localStorage.getItem('samurai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
    api.getMe()
      .then(u => {
        if (u && u.username !== 'guest') setUser(u);
      })
      .catch(() => { });
  }, []);

  // Check backend health & subscribe to connection status
  useEffect(() => {
    const unsub = subscribeBackendStatus(status => {
      setIsBackendConnected(status);
    });
    checkBackendHealth();
    return () => unsub();
  }, []);

  // Main Data Loader
  const loadCoreData = async () => {
    try {
      const [projData, agencyData, overviewData] = await Promise.all([
        api.getProjects(),
        api.getAgencies(),
        api.getAnalyticsOverview()
      ]);
      setProjects(projData);
      setAgencies(agencyData);
      setOverview(overviewData);
    } catch (err) {
      console.error('Error loading core dataset:', err);
    }
  };

  useEffect(() => {
    loadCoreData();
  }, []);

  // Manual "Sync & Recalculate DB" handler
  const handleSyncRecalculate = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      await api.syncAndRecalculate();
      await loadCoreData();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onSyncRecalculate={handleSyncRecalculate}
        isSyncing={isSyncing}
        syncSuccess={syncSuccess}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Content Area with generous top spacing to prevent sticky navbar clipping */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 pb-12 transition-all">
        {/* Executive Real-Time KPI Ribbon */}
        <ExecutiveKpiRibbon 
          overview={overview} 
          projects={projects} 
        />
        {activeTab === 'map' && (
          <MapView
            projects={projects}
            onSelectProject={(id) => setSelectedProjectId(id)}
            selectedProjectId={selectedProjectId}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            overview={overview}
            agencies={agencies}
            onRefresh={loadCoreData}
          />
        )}

        {activeTab === 'proposals' && (
          <ProposalCreator
            agencies={agencies}
            onProposalCreated={() => {
              loadCoreData();
              setActiveTab('approvals');
            }}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovingPortal
            user={user}
            onActionComplete={loadCoreData}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressUpdateDesk
            user={user}
            projects={projects}
            onProgressUpdated={loadCoreData}
            onOpenStressTest={() => setIsStressTestOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminAuditConsole
            agencies={agencies}
            onRefreshNeeded={loadCoreData}
            onOpenStressTest={() => setIsStressTestOpen(true)}
          />
        )}

        {activeTab === 'ai' && (
          <AIAdvisorPanel
            projects={projects}
            agencies={agencies}
            overview={overview}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenStressTest={() => setIsStressTestOpen(true)}
            onRecalculate={handleSyncRecalculate}
          />
        )}
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onRefreshNeeded={loadCoreData}
      />

      {/* 1-Click Quick Demo Login Modal */}
      <QuickLoginModal
        isOpen={isQuickLoginOpen}
        onClose={() => setIsQuickLoginOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          // Smart redirect based on role
          if (u.role === 'ECNEC' || u.role === 'MOP') setActiveTab('approvals');
          else if (u.role === 'EXEC') setActiveTab('progress');
          else if (u.role === 'SYSADMIN') setActiveTab('admin');
        }}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        agencies={agencies}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          setActiveTab('map');
        }}
        onSelectLocation={() => setActiveTab('map')}
        onSelectAgency={() => setActiveTab('progress')}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Judge Runtime Stress-Test Simulator Drawer (Section 4) */}
      <JudgeStressTestDrawer
        isOpen={isStressTestOpen}
        onClose={() => setIsStressTestOpen(false)}
        projects={projects}
        onRecalculated={loadCoreData}
      />

      {/* Floating Judge Stress-Test Launcher Pill */}
      <button
        onClick={() => setIsStressTestOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xl flex items-center space-x-2 transition hover:scale-105 cursor-pointer no-print"
        title="Open Judge Stress-Test Simulator (Section 4)"
      >
        <Sliders className="w-4 h-4" />
        <span>Judge Simulator</span>
      </button>

      {/* Real-time DB Mutation Toast Notification */}
      {dbNotification && (
        <div className="fixed bottom-20 right-6 z-50 p-4 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-center space-x-3 text-xs font-bold border border-emerald-400/40 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{dbNotification}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>CivicGrid</strong> • Smart City OS • Public Infrastructure Planning & GIS Monitoring
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Loaded from <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/data/*.csv</code> (134 Projects, 134 Proposals, 536 Components)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
