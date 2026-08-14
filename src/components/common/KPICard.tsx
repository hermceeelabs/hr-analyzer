'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'neutral' | 'warning' | 'danger' | 'success' | 'info';
  icon?: LucideIcon;
  formatAsMoney?: boolean;
  formatAsPercent?: boolean;
}

export default function KPICard({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'neutral',
  icon: Icon,
}: KPICardProps) {
  const badgeStyles = {
    neutral: 'bg-navy-100 text-navy-700 border-navy-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="text-2xl font-extrabold text-navy-900 tracking-tight my-1">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-navy-50/80 text-xs">
        {subtitle && <span className="text-navy-500 font-medium">{subtitle}</span>}
        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeStyles[badgeType]}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
