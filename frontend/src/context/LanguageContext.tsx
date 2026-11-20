import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  isBn: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  formatCrTk: (amountInCr: number | undefined | null) => string;
  formatNumber: (num: number | string | undefined | null) => string;
  formatBDDate: (dateStr: string | undefined | null) => string;
}

const STORAGE_KEY = 'civicgrid-language';

// English to Bengali Numeral converter
export function toBengaliNumerals(input: number | string): string {
  const str = String(input);
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

// Translations Dictionary
const TRANSLATIONS: Record<string, { en: string; bn: string }> = {
  // Navigation & Branding
  'app.name': { en: 'CivicGrid', bn: 'সিভিকগ্রিড' },
  'app.tagline': { en: 'Smart City OS', bn: 'স্মার্ট সিটি ওএস' },
  'app.subtitle': { en: 'Public Infrastructure Planning & GIS Monitoring', bn: 'সরকারি অবকাঠামো পরিকল্পনা ও জিআইএস নজরদারি' },
  
  // Navigation Tabs
  'nav.map': { en: 'Civic GIS Map', bn: 'নাগরিক জিআইএস ম্যাপ' },
  'nav.analytics': { en: 'Analytics & Gantt', bn: 'বিশ্লেষণ ও গ্যান্ট চার্ট' },
  'nav.proposals': { en: 'DPP & RCPSP Lab', bn: 'ডিপিপি ও সিডিউলিং ল্যাব' },
  'nav.approvals': { en: 'Approvals (ECNEC/MOP)', bn: 'অনুমোদন (একনেক/মপ)' },
  'nav.progress': { en: 'Agency Progress Desk', bn: 'দপ্তর অগ্রগতি ডেস্ক' },
  'nav.admin': { en: 'Admin & Audit', bn: 'অ্যাডমিন ও অডিট' },
  'nav.ai': { en: 'AI Urban Advisor', bn: 'এআই নগর উপদেষ্টা' },

  // Roles
  'role.citizen': { en: 'Citizen', bn: 'সাধারণ নাগরিক' },
  'role.sysadmin': { en: 'System Admin', bn: 'সিস্টেম অ্যাডমিন' },
  'role.ecnec': { en: 'ECNEC Approving Official', bn: 'একনেক অনুমোদন কর্মকর্তা' },
  'role.mop': { en: 'Ministry of Planning (MOP)', bn: 'পরিকল্পনা মন্ত্রণালয় (মপ)' },
  'role.exec_lgd': { en: 'Executing Officer (LGD)', bn: 'বাস্তবায়ন কর্মকর্তা (এলজিডি)' },
  'role.exec_moedu': { en: 'Executing Officer (MOEDU)', bn: 'বাস্তবায়ন কর্মকর্তা (শিক্ষা)' },
  'role.exec_pwd': { en: 'Executing Officer (PWD)', bn: 'বাস্তবায়ন কর্মকর্তা (গণপূর্ত)' },

  // Statuses
  'status.running': { en: 'Running', bn: 'চলমান' },
  'status.delayed': { en: 'Delayed', bn: 'বিলম্বিত' },
  'status.completed': { en: 'Completed', bn: 'সমাপ্ত' },
  'status.approved': { en: 'Approved', bn: 'অনুমোদিত' },
  'status.proposed': { en: 'Proposed', bn: 'প্রস্তাবিত' },
  'status.at_risk': { en: 'At Risk', bn: 'ঝুঁকিপূর্ণ' },
  'status.on_track': { en: 'On Track', bn: 'গতিশীল / যথাসময়ে' },
  'status.not_started': { en: 'Not Started', bn: 'শুরু হয়নি' },

  // Common UI Actions
  'action.search': { en: 'Search projects, zones, agencies...', bn: 'প্রকল্প, জোন, দপ্তর অনুসন্ধান করুন...' },
  'action.sync': { en: 'Sync & Recalculate', bn: 'সিঙ্ক ও পুনঃগণনা' },
  'action.syncing': { en: 'Syncing...', bn: 'সিঙ্ক হচ্ছে...' },
  'action.synced': { en: 'Synced!', bn: 'সিঙ্ক সম্পন্ন!' },
  'action.switch_role': { en: 'Switch Role', bn: 'ভূমিকা পরিবর্তন' },
  'action.report_issue': { en: 'Report Civic Issue', bn: 'নাগরিক সমস্যা রিপোর্ট' },
  'action.theme_dark': { en: 'Switch to Light Mode', bn: 'লাইট মোডে যান' },
  'action.theme_light': { en: 'Switch to Dark Mode', bn: 'ডার্ক মোডে যান' },
  'action.view_details': { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  'action.filter_all': { en: 'All', bn: 'সকল' },
  'action.apply': { en: 'Apply', bn: 'প্রয়োগ করুন' },
  'action.reset': { en: 'Reset', bn: 'রিসেট' },
  'action.close': { en: 'Close', bn: 'বন্ধ করুন' },
  'action.export': { en: 'Export Data', bn: 'ডাটা এক্সপোর্ট' },

  // Currency & Unit Labels
  'currency.cr_tk': { en: 'Cr Tk', bn: 'কোটি টাকা' },
  'currency.tk': { en: 'Tk', bn: 'টাকা' },
  'unit.years': { en: 'Years', bn: 'বছর' },
  'unit.days': { en: 'Days', bn: 'দিন' },
  'unit.projects': { en: 'Projects', bn: 'প্রকল্প' },
  'unit.zones': { en: 'Municipal Zones', bn: 'পৌর অঞ্চল' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  const isBn = language === 'bn';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist language', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return fallback || key;
    return isBn ? entry.bn : entry.en;
  };

  const formatNumber = (num: number | string | undefined | null): string => {
    if (num === undefined || num === null) return '0';
    const val = String(num);
    return isBn ? toBengaliNumerals(val) : val;
  };

  const formatCrTk = (amountInCr: number | undefined | null): string => {
    if (amountInCr === undefined || amountInCr === null) {
      return isBn ? '০ কোটি টাকা' : '৳0 Cr Tk';
    }
    const formattedNum = Number(amountInCr).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    if (isBn) {
      return `৳${toBengaliNumerals(formattedNum)} কোটি টাকা`;
    }
    return `৳${formattedNum} Cr Tk`;
  };

  const formatBDDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return isBn ? 'অনির্দিষ্ট' : 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const day = d.getDate();
      const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNamesBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
      const month = isBn ? monthNamesBn[d.getMonth()] : monthNamesEn[d.getMonth()];
      const year = d.getFullYear();

      if (isBn) {
        return `${toBengaliNumerals(day)} ${month}, ${toBengaliNumerals(year)}`;
      }
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isBn,
        setLanguage,
        toggleLanguage,
        t,
        formatCrTk,
        formatNumber,
        formatBDDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
