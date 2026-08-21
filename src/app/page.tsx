'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import FilterPanel from '@/components/common/FilterPanel';
import OverviewTab from '@/components/dashboard/OverviewTab';
import AttritionTab from '@/components/dashboard/AttritionTab';
import CompensationTab from '@/components/dashboard/CompensationTab';
import SatisfactionTab from '@/components/dashboard/SatisfactionTab';
import PerformanceTab from '@/components/dashboard/PerformanceTab';
import CareerTab from '@/components/dashboard/CareerTab';
import DemographicsTab from '@/components/dashboard/DemographicsTab';
import DataQualityView from '@/components/quality/DataQualityView';
import ReportBuilder from '@/components/reports/ReportBuilder';

// Portal Module Views
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import HrDirectoryView from '@/components/hr/HrDirectoryView';
import QmsOverviewView from '@/components/qms/QmsOverviewView';
import DocumentRegister from '@/components/documents/DocumentRegister';
import DocumentDetailView from '@/components/documents/DocumentDetailView';
import ApprovalsView from '@/components/approvals/ApprovalsView';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import AuditLogView from '@/components/audit/AuditLogView';

import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

export default function BusinessOperationsPortal() {
  const {
    activeModule,
    activeHrSubTab,
    activeQmsSubTab,
    selectedDocumentId,
    isLoading,
    dbError,
    isRlsBlocked,
    dataSourceMode,
    refetchDemoData,
  } = useHR();

  // Render HR Analytics Sub-Tabs (preserves 100% of existing visualizations & computations)
  const renderHrAnalyticsModule = () => {
    switch (activeHrSubTab) {
      case 'attrition':
        return <AttritionTab />;
      case 'compensation':
        return <CompensationTab />;
      case 'satisfaction':
        return <SatisfactionTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'career':
        return <CareerTab />;
      case 'demographics':
        return <DemographicsTab />;
      case 'overview':
      default:
        return <OverviewTab />;
    }
  };

  // Render HR Module
  const renderHrModule = () => {
    switch (activeHrSubTab) {
      case 'directory':
        return <HrDirectoryView />;
      case 'departments':
      case 'onboarding':
      case 'training':
      case 'documents':
        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
            <h2 className="text-lg font-bold text-navy-950 dark:text-white capitalize">HR {activeHrSubTab} Section</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This demonstration section communicates how full personnel management, workflow onboarding checklists, and training records connect to the central dataset.
            </p>
          </div>
        );
      case 'analytics':
      default:
        return (
          <div className="space-y-4">
            <FilterPanel />
            {renderHrAnalyticsModule()}
          </div>
        );
    }
  };

  // Render QMS Module
  const renderQmsModule = () => {
    switch (activeQmsSubTab) {
      case 'document-control':
      case 'policies':
      case 'sops':
      case 'work-instructions':
      case 'audits':
      case 'non-conformances':
      case 'capa':
        return <QmsOverviewView />;
      case 'overview':
      default:
        return <QmsOverviewView />;
    }
  };

  // Render Main Active Portal Module
  const renderActivePortalModule = () => {
    switch (activeModule) {
      case 'hr':
        return renderHrModule();
      case 'qms':
        return renderQmsModule();
      case 'documents':
        return selectedDocumentId ? <DocumentDetailView /> : <DocumentRegister />;
      case 'approvals':
        return <ApprovalsView />;
      case 'templates':
        return <TemplateLibrary />;
      case 'reports':
        return <ReportBuilder />;
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <DataQualityView />;
      case 'dashboard':
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#0c111d] font-sans transition-colors duration-200">
      {/* Fixed Portal Sidebar */}
      <AppSidebar />

      {/* Right Column: Sticky Header + Scrollable Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#0c111d] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <AppHeader />

            {/* Supabase Connection Alert */}
            {!isLoading && dbError && dataSourceMode === 'demo' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-xs text-amber-950 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-base text-amber-900">Supabase Connection Notice</h3>
                    <p className="text-xs text-amber-800 mt-1">{dbError}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-amber-200/80">
                  <button
                    onClick={() => refetchDemoData()}
                    className="px-4 py-2 rounded-lg bg-amber-900 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-800 shadow-xs"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Connection</span>
                  </button>
                </div>
              </div>
            )}

            {/* RLS Policy Notice */}
            {!isLoading && !dbError && isRlsBlocked && dataSourceMode === 'demo' && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-6 shadow-xs text-amber-950 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-base text-amber-950">
                      Supabase Row Level Security (RLS) Policy Required
                    </h3>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      Connected to <code className="bg-white border px-1.5 py-0.5 rounded font-mono text-navy-900">public.employees</code>, but 0 records were returned because Row Level Security (RLS) is enabled without a public SELECT policy.
                    </p>
                  </div>
                </div>

                <div className="bg-navy-900 text-slate-200 p-4 rounded-lg font-mono text-xs space-y-2 border border-navy-800">
                  <div className="text-navy-400 font-sans text-[11px] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-brand-400" />
                    <span>Run this SQL command in your Supabase SQL Editor:</span>
                  </div>
                  <pre className="text-emerald-400 select-all overflow-x-auto p-2 bg-navy-950 rounded">
{`CREATE POLICY "Allow public read access"
ON public.employees
FOR SELECT
TO anon, authenticated
USING (true);`}
                  </pre>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-amber-800">
                    After running the SQL above in Supabase, click <span className="font-semibold">Refresh Data</span>.
                  </div>
                  <button
                    onClick={() => refetchDemoData()}
                    className="px-4 py-2 rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Data</span>
                  </button>
                </div>
              </div>
            )}

            {/* Portal Module Output */}
            {renderActivePortalModule()}

          </div>
        </main>
      </div>
    </div>
  );
}
