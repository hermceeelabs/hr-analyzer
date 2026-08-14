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
import EmployeeTable from '@/components/employees/EmployeeTable';
import DataQualityView from '@/components/quality/DataQualityView';
import ReportBuilder from '@/components/reports/ReportBuilder';
import { AlertTriangle, RefreshCw, Database, Terminal, CheckCircle2 } from 'lucide-react';

export default function HRAnalyticsApp() {
  const {
    activeTab,
    activeAnalyticsSubTab,
    isLoading,
    dbError,
    isRlsBlocked,
    dataSourceMode,
    allRecords,
    refetchDemoData,
  } = useHR();

  const renderDashboardModule = () => {
    switch (activeAnalyticsSubTab) {
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

  const renderActiveMainTab = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeTable />;
      case 'reports':
        return <ReportBuilder />;
      case 'quality':
        return <DataQualityView />;
      case 'dashboard':
      default:
        return renderDashboardModule();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Top Application Shell Header */}
      <AppHeader />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto my-4 px-4 sm:px-6 lg:px-8 gap-6">
        
        {/* Navigation Sidebar */}
        <AppSidebar />

        {/* Workspace Main Panel */}
        <main className="flex-1 min-w-0">
          
          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-xl border border-navy-100 p-12 text-center shadow-xs my-8 space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
              <div className="text-sm font-bold text-navy-900">Connecting to Supabase public.employees...</div>
              <div className="text-xs text-navy-500">Retrieving HR records and initializing analytics engine...</div>
            </div>
          )}

          {/* Database Connection Error State */}
          {!isLoading && dbError && dataSourceMode === 'demo' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-xs my-4 text-amber-950 space-y-4">
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

          {/* RLS Policy Guidance Notice (When connected but 0 records returned due to Supabase RLS) */}
          {!isLoading && !dbError && isRlsBlocked && dataSourceMode === 'demo' && (
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-6 shadow-xs mb-6 text-amber-950 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-amber-950">
                    Supabase Row Level Security (RLS) Policy Required
                  </h3>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    Connected to <code className="bg-white border px-1.5 py-0.5 rounded font-mono text-navy-900">public.employees</code>, but 0 records were returned because Row Level Security (RLS) is enabled on the table without a public SELECT policy.
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
                  After running the SQL query above in Supabase, click <span className="font-semibold">Refresh Data</span> below.
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

          {/* Main Application Content */}
          {!isLoading && (
            <>
              {/* Interactive Filter Panel (Available on Dashboard and Employees tabs) */}
              {(activeTab === 'dashboard' || activeTab === 'employees') && <FilterPanel />}

              {/* View Container */}
              {renderActiveMainTab()}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
