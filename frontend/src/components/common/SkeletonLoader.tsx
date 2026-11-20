import React from 'react';

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonStatsRibbon: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2"
        >
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};
