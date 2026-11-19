import React from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Building2, User, 
  ArrowRight, Landmark, HardHat, Sparkles 
} from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../api';

interface QuickLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const QuickLoginModal: React.FC<QuickLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const roles = [
    {
      roleType: 'SYSADMIN',
      title: 'System Administrator',
      badge: 'Admin Access',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
      icon: ShieldCheck,
      desc: 'Full CRUD across agencies, constraints, projects; Ingestion Audit Report viewer; DB Watcher control.',
    },
    {
      roleType: 'ECNEC',
      title: 'ECNEC Approving Official',
      badge: 'Authority > 50 Cr',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
      icon: Landmark,
      desc: 'Executive Committee of the National Economic Council. Reviews & approves major mega-projects (> 50 Crore BDT).',
    },
    {
      roleType: 'MOP',
      title: 'Ministry of Planning (MOP)',
      badge: 'Authority <= 50 Cr',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
      icon: CheckCircle2,
      desc: 'Planning Commission desk. Reviews and approves medium-scale municipal projects (up to 50 Crore BDT).',
    },
    {
      roleType: 'EXEC_LGD',
      title: 'Executing Official (LGD)',
      badge: 'Agency: LGD',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      icon: HardHat,
      desc: 'Local Government Division. Drafts DPP proposals, suggests optimal start dates, and updates component progress.',
    },
    {
      roleType: 'EXEC_MOEDU',
      title: 'Executing Official (MOEDU)',
      badge: 'Agency: MOEDU',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      icon: HardHat,
      desc: 'Ministry of Education. Manages primary and secondary school infrastructure across municipal zones.',
    },
    {
      roleType: 'EXEC_PWD',
      title: 'Executing Official (PWD)',
      badge: 'Agency: PWD',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      icon: HardHat,
      desc: 'Public Works Department. Monitors national civil structures and yearly funding budget caps (500 Cr ceiling).',
    },
    {
      roleType: 'APP',
      title: 'Citizen (Public Portal)',
      badge: 'Public Access',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      icon: User,
      desc: 'General public civic viewer. Explore GIS maps, inspect project status, rate 1-5 stars, and submit feedback.',
    },
  ];

  const handleSelectRole = async (roleType: string) => {
    try {
      const res = await api.quickLogin(roleType);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      alert(`Quick login failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>1-Click Quick Demo Login (Role-Based Access)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any role card below to instantly test role-specific workflows and dashboards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-2.5">
          {roles.map(r => {
            const Icon = r.icon;
            return (
              <div
                key={r.roleType}
                onClick={() => handleSelectRole(r.roleType)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                        {r.title}
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${r.badgeColor}`}>
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {r.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition flex-shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
