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
import { Project, Agency, AnalyticsOverview, User } from './types';
import { api } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('map');
  const [projects, setProjects] = useState<Project[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals & UI states
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('samurai_theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Sync dark mode class with html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('samurai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('samurai_theme', 'light');
    }
  }, [darkMode]);

  // Load User from LocalStorage or fetch current user
  useEffect(() => {
    const savedUser = localStorage.getItem('samurai_user');
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
      .catch(() => {});
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSyncRecalculate={handleSyncRecalculate}
        isSyncing={isSyncing}
        syncSuccess={syncSuccess}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          />
        )}

        {activeTab === 'admin' && (
          <AdminAuditConsole
            agencies={agencies}
            onRefreshNeeded={loadCoreData}
          />
        )}

        {activeTab === 'ai' && (
          <AIAdvisorPanel />
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

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Code Samurai 2026</strong> • Plan Public Projects in Your City • RCPSP Scheduling Engine
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
