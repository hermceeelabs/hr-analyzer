'use client';

import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

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
    /*
      Spacer div keeps the collapsed sidebar width (w-16) in the flex layout
      so the main content doesn't shift when the sidebar expands.
      The actual <aside> floats over the content via absolute positioning
      and is clipped within a fixed container that is inset from the top by the
      header height (~56 px) so it never overlaps the header.
    */
    <div className="relative shrink-0 w-16">
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-4 top-[4.5rem] bottom-6
          flex flex-col
          rounded-2xl border border-white/10
          shadow-2xl
          transition-all duration-300 ease-in-out
          overflow-hidden
          z-50
          ${isHovered ? 'w-60' : 'w-14'}
        `}
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Main Navigation */}
        <div className="p-2.5 shrink-0">
          <div
            className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 transition-opacity duration-200 whitespace-nowrap ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Navigation
          </div>

          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setActiveTab(item.id as 'dashboard' | 'employees' | 'reports' | 'quality')
                  }
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`}
                  title={!isHovered ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Analytics Sub-Navigation */}
        {activeTab === 'dashboard' && (
          <div className="px-2.5 pb-2.5 flex-1 overflow-y-auto overflow-x-hidden border-t border-white/8">
            <div
              className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mt-2.5 mb-2 transition-opacity duration-200 whitespace-nowrap ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Modules
            </div>

            <nav className="space-y-0.5">
              {analyticsSubNav.map((sub) => {
                const Icon = sub.icon;
                const isSubActive = activeAnalyticsSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveAnalyticsSubTab(sub.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all ${
                      isSubActive
                        ? 'bg-white/10 text-blue-300 font-semibold border-l-2 border-blue-400'
                        : 'text-slate-400 hover:bg-white/6 hover:text-white'
                    }`}
                    title={!isHovered ? sub.label : undefined}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSubActive ? 'text-blue-400' : 'text-slate-500'
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap transition-opacity duration-200 ${
                        isHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {sub.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Footer */}
        <div
          className={`px-4 py-3 border-t border-white/8 text-[10px] text-slate-500 shrink-0 transition-opacity duration-200 whitespace-nowrap ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="font-semibold text-slate-400">Enterprise HR Suite</div>
          <div>v1.0.0</div>
        </div>
      </aside>
    </div>
  );
}
