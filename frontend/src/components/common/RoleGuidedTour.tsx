import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, ChevronRight, ShieldCheck, Landmark, HardHat,
  Users, CheckCircle2, MapPin, ArrowRight
} from 'lucide-react';
import { User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface RoleGuidedTourProps {
  user: User | null;
  onNavigateTab: (tab: string) => void;
}

export const RoleGuidedTour: React.FC<RoleGuidedTourProps> = ({ user, onNavigateTab }) => {
  const { isBn, t } = useLanguage();
  const role = user?.role || 'APP';
  const tourKey = `civicgrid_tour_dismissed_${role}`;

  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(tourKey);
      setIsDismissed(dismissed === 'true');
    } catch {
      setIsDismissed(false);
    }
  }, [role, tourKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(tourKey, 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  // Role-specific copy & actions
  let title = isBn ? 'নাগরিক পোর্টালে স্বাগতম!' : 'Welcome to CivicGrid Public Portal!';
  let desc = isBn
    ? 'আপনার এলাকার চলমান রাস্তাঘাট, স্কুল ও হাসপাতাল প্রকল্পের অগ্রগতি দেখুন, নাগরিক সমস্যা রিপোর্ট করুন এবং তারকা রেটিং দিন।'
    : 'Track nearby infrastructure progress in plain language, report local road or sanitation issues, and participate in civic ratings.';
  let primaryActionText = isBn ? 'জিআইএস ম্যাপ দেখুন' : 'Explore Civic Map';
  let primaryTab = 'map';
  let Icon = Users;
  let accentGradient = 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30';

  if (role === 'ECNEC' || role === 'MOP') {
    title = isBn
      ? `স্বাগতম ${role} অনুমোদনকারী কর্মকর্তা!`
      : `Welcome ${role} Approving Official!`;
    desc = isBn
      ? 'উচ্চ বাজেটের ডিপিপি প্রস্তাবসমূহ বিশ্লেষণ করুন, আরসিপিএসপি সিডিউল প্রভাব যাচাই করুন এবং মন্তব্যসহ অনুমোদন বা ফেরত পাঠান।'
      : 'Review high-impact DPP proposals, inspect RCPSP schedule & budget impacts before authorization, and record audit decisions.';
    primaryActionText = isBn ? 'অনুমোদন কিউতে যান' : 'Go to Approvals Queue';
    primaryTab = 'approvals';
    Icon = Landmark;
    accentGradient = 'from-rose-500/20 via-amber-500/10 to-transparent border-rose-500/30';
  } else if (role.startsWith('EXEC')) {
    title = isBn
      ? 'দপ্তর অগ্রগতি ডেস্কে স্বাগতম!'
      : 'Welcome to Agency Execution Workspace!';
    desc = isBn
      ? 'আপনার দপ্তরের বরাদ্দকৃত প্রকল্পের ফিজিক্যাল অগ্রগতি আপডেট করুন, ব্লকড কম্পোনেন্টের কারণ জানুন এবং বাজেট ট্র্যাক করুন।'
      : 'Submit field physical progress updates, monitor blocked components and predecessor dependencies, and prevent budget overruns.';
    primaryActionText = isBn ? 'অগ্রগতি ডেস্কে যান' : 'Open Progress Desk';
    primaryTab = 'progress';
    Icon = HardHat;
    accentGradient = 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30';
  } else if (role === 'SYSADMIN') {
    title = isBn
      ? 'সিস্টেম অ্যাডমিনিস্ট্রেটর কনসোলে স্বাগতম!'
      : 'Welcome to Admin & Governance Console!';
    desc = isBn
      ? 'সিএসভি ডাটা কোয়ালিটি নিরীক্ষণ করুন, অপরিবর্তনীয় SHA-256 অডিট চেইন পরীক্ষা করুন এবং সিটি কনস্ট্রেইন্ট পরিচালনা করুন।'
      : 'Inspect CSV ingestion quality, verify immutable SHA-256 audit blocks, and enforce municipal resource constraints.';
    primaryActionText = isBn ? 'অডিট কনসোল দেখুন' : 'View Audit Console';
    primaryTab = 'admin';
    Icon = ShieldCheck;
    accentGradient = 'from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/30';
  }

  return (
    <div className={`mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r ${accentGradient} bg-white dark:bg-slate-900 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in`}>
      <div className="flex items-start space-x-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700/80 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {isBn ? 'নির্দেশিকা' : 'Role Guide'}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
        <button
          onClick={() => {
            onNavigateTab(primaryTab);
            handleDismiss();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs flex items-center space-x-1"
        >
          <span>{primaryActionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={isBn ? 'বন্ধ করুন' : 'Dismiss tour'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
