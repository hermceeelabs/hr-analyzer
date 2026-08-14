'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  Smile,
  Award,
  Briefcase,
  UserCheck,
  PieChart,
} from 'lucide-react';

export default function AppSidebar() {
  const { activeTab, setActiveTab, activeAnalyticsSubTab, setActiveAnalyticsSubTab } = useHR();

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck },
  ];

  const analyticsSubNav = [
    { id: 'overview', label: 'Workforce Overview', icon: PieChart },
    { id: 'attrition', label: 'Attrition Analytics', icon: TrendingDown },
    { id: 'compensation', label: 'Compensation Analytics', icon: DollarSign },
    { id: 'satisfaction', label: 'Satisfaction & Engagement', icon: Smile },
    { id: 'performance', label: 'Performance Analytics', icon: Award },
    { id: 'career', label: 'Career & Experience', icon: Briefcase },
    { id: 'demographics', label: 'Demographics', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col shrink-0 border-r border-navy-800 min-h-[calc(100vh-80px)]">
      {/* Primary Section */}
      <div className="p-4 border-b border-navy-800/80">
        <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-3 px-2">
          Navigation
        </div>
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as 'dashboard' | 'employees' | 'reports' | 'quality')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-navy-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Analytics Deep Dives Sub-Navigation (Visible when Dashboard is selected) */}
      {activeTab === 'dashboard' && (
        <div className="p-4 flex-1">
          <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-3 px-2">
            Analytical Modules
          </div>
          <nav className="space-y-1">
            {analyticsSubNav.map((sub) => {
              const Icon = sub.icon;
              const isSubActive = activeAnalyticsSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveAnalyticsSubTab(sub.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    isSubActive
                      ? 'bg-navy-800 text-brand-300 font-semibold border-l-2 border-brand-500 pl-2.5'
                      : 'text-navy-300 hover:bg-navy-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSubActive ? 'text-brand-400' : 'text-navy-400'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Footer info */}
      <div className="p-4 border-t border-navy-800 text-[11px] text-navy-400 space-y-1 mt-auto">
        <div className="font-semibold text-navy-300">Enterprise HR Suite</div>
        <div>Version 1.0.0 (Production)</div>
      </div>
    </aside>
  );
}
