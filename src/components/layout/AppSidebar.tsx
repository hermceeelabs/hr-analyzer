'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { PortalModule, HrSubTab, QmsSubTab } from '@/types/qms';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Clock,
  Copy,
  FileBarChart,
  History,
  Settings,
  PieChart,
  TrendingDown,
  DollarSign,
  Smile,
  Award,
  Briefcase,
  UserCheck,
  ChevronDown,
  Building2,
  FolderKanban,
  FileCheck2,
  CheckSquare,
  AlertOctagon,
} from 'lucide-react';

export default function AppSidebar() {
  const {
    activeModule,
    setActiveModule,
    activeHrSubTab,
    setActiveHrSubTab,
    activeQmsSubTab,
    setActiveQmsSubTab,
    setSelectedDocumentId,
  } = useHR();

  const [isHovered, setIsHovered] = useState(false);

  const mainModules: { id: PortalModule; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hr', label: 'HR Module', icon: Users },
    { id: 'qms', label: 'QMS Module', icon: ShieldCheck },
    { id: 'documents', label: 'Document Register', icon: FileText },
    { id: 'approvals', label: 'Approvals Hub', icon: Clock },
    { id: 'templates', label: 'Templates Library', icon: Copy },
    { id: 'reports', label: 'Custom Reports', icon: FileBarChart },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  const hrSubNav: { id: HrSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'analytics', label: 'HR Analytics', icon: PieChart },
    { id: 'directory', label: 'Employee Directory', icon: UserCheck },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'onboarding', label: 'Onboarding', icon: FolderKanban },
    { id: 'training', label: 'Training & Development', icon: Award },
    { id: 'documents', label: 'HR Personnel Docs', icon: FileCheck2 },
  ];

  const qmsSubNav: { id: QmsSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'QMS Overview', icon: ShieldCheck },
    { id: 'document-control', label: 'Document Control', icon: FileText },
    { id: 'policies', label: 'Quality Policies', icon: FileCheck2 },
    { id: 'sops', label: 'SOPs', icon: FileText },
    { id: 'work-instructions', label: 'Work Instructions', icon: CheckSquare },
    { id: 'audits', label: 'Internal Audits', icon: History },
    { id: 'non-conformances', label: 'Non-Conformances', icon: AlertOctagon },
    { id: 'capa', label: 'CAPA Workflow', icon: CheckSquare },
  ];

  return (
    <div className="relative shrink-0 w-16">
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-4 top-1/2 -translate-y-1/2
          flex flex-col
          rounded-2xl border border-white/10
          shadow-2xl
          transition-all duration-300 ease-in-out
          overflow-hidden
          z-50
          max-h-[calc(100vh-2rem)]
          ${isHovered ? 'w-64' : 'w-14'}
        `}
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Main Navigation Modules */}
        <div className="p-2.5 shrink-0">
          <div
            className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 transition-opacity duration-200 whitespace-nowrap ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Portal Modules
          </div>

          <nav className="space-y-0.5">
            {mainModules.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    if (item.id === 'documents') setSelectedDocumentId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-bold'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`}
                  title={!isHovered ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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

        {/* HR Sub-Navigation */}
        {activeModule === 'hr' && (
          <div className="px-2.5 pb-2.5 flex-1 overflow-y-auto overflow-x-hidden border-t border-white/8">
            <div
              className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mt-2.5 mb-2 transition-opacity duration-200 whitespace-nowrap ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              HR Section
            </div>

            <nav className="space-y-0.5">
              {hrSubNav.map((sub) => {
                const Icon = sub.icon;
                const isSubActive = activeHrSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveHrSubTab(sub.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all ${
                      isSubActive
                        ? 'bg-white/10 text-blue-300 font-bold border-l-2 border-blue-400'
                        : 'text-slate-400 hover:bg-white/6 hover:text-white'
                    }`}
                    title={!isHovered ? sub.label : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-blue-400' : 'text-slate-500'}`} />
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

        {/* QMS Sub-Navigation */}
        {activeModule === 'qms' && (
          <div className="px-2.5 pb-2.5 flex-1 overflow-y-auto overflow-x-hidden border-t border-white/8">
            <div
              className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mt-2.5 mb-2 transition-opacity duration-200 whitespace-nowrap ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              QMS Section
            </div>

            <nav className="space-y-0.5">
              {qmsSubNav.map((sub) => {
                const Icon = sub.icon;
                const isSubActive = activeQmsSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveQmsSubTab(sub.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all ${
                      isSubActive
                        ? 'bg-white/10 text-emerald-300 font-bold border-l-2 border-emerald-400'
                        : 'text-slate-400 hover:bg-white/6 hover:text-white'
                    }`}
                    title={!isHovered ? sub.label : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-slate-500'}`} />
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
          <div className="font-semibold text-slate-300">Business Operations Portal</div>
          <div>QMS &amp; HR Suite v2.0</div>
        </div>
      </aside>
    </div>
  );
}
