import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 max-w-md mx-auto my-6">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
          >
            {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
