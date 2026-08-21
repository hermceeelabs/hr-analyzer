'use client';

import React from 'react';
import { DocumentStatus } from '@/types/qms';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className = '' }: DocumentStatusBadgeProps) {
  const styles: Record<DocumentStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'Changes Requested': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    Approved: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    Draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    Superseded: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    Archived: 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${styles[status] || styles.Draft} ${className}`}>
      {status}
    </span>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-navy-950 dark:text-white">{title}</h1>
          {badge}
        </div>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
