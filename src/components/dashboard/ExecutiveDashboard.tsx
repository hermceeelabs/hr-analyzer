'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  Building2,
  Users,
  FileCheck2,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const { kpis, qmsDocuments, employeeDirectory, auditLogs, setActiveModule, setActiveHrSubTab, setSelectedDocumentId } = useHR();

  // Compute QMS summary numbers
  const totalDocs = qmsDocuments.length;
  const activeDocs = qmsDocuments.filter((d) => d.status === 'Active').length;
  const underReviewDocs = qmsDocuments.filter((d) => d.status === 'Under Review').length;
  const changesRequestedDocs = qmsDocuments.filter((d) => d.status === 'Changes Requested').length;

  const pendingApprovals = qmsDocuments.filter(
    (d) => d.status === 'Under Review' || d.status === 'Changes Requested'
  );

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Context Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Central Business Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Executive Operations &amp; QMS Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Centralized management dashboard unifying workforce indicators, quality management standards, document control compliance, and pending approval workflows.
          </p>
        </div>
      </div>

      {/* Cross-Module KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* HR Card */}
        <div
          onClick={() => {
            setActiveModule('hr');
            setActiveHrSubTab('directory');
          }}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workforce</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white">
              {employeeDirectory.length || kpis.totalEmployees}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="text-emerald-600 font-semibold">{kpis.activeEmployees} Active</span>
              <span>•</span>
              <span>{kpis.attritionRate}% Attrition Rate</span>
            </div>
          </div>
        </div>

        {/* QMS Active Docs Card */}
        <div
          onClick={() => setActiveModule('documents')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Documents</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white">{activeDocs}</div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span>{totalDocs} Controlled Total</span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">100% ISO Compliant</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div
          onClick={() => setActiveModule('approvals')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white">{underReviewDocs + changesRequestedDocs}</div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="text-amber-600 font-semibold">{underReviewDocs} Under Review</span>
              <span>•</span>
              <span className="text-rose-600 font-semibold">{changesRequestedDocs} Revisions</span>
            </div>
          </div>
        </div>

        {/* Training & Quality Audits */}
        <div
          onClick={() => setActiveModule('qms')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Status</span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">98.4%</div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span>0 Major Non-Conformances</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split: Action Items & Recent System Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Actionable Pending Approvals */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-navy-950 dark:text-white">Actionable Workflow Queue</h2>
              <p className="text-xs text-slate-500">Controlled documents requiring review, changes, or authorization</p>
            </div>
            <button
              onClick={() => setActiveModule('approvals')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View All Queue →
            </button>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocumentId(doc.id);
                  setActiveModule('documents');
                }}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-brand-300 dark:hover:border-brand-500 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">{doc.docNumber}</span>
                    <span className="text-xs font-bold text-navy-900 dark:text-white truncate">{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Owner: {doc.ownerName}</span>
                    <span>•</span>
                    <span>Department: {doc.department}</span>
                    <span>•</span>
                    <span>Version {doc.currentVersion}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      doc.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Audit Trail Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-navy-950 dark:text-white">Recent System Activity</h2>
            <button
              onClick={() => setActiveModule('audit')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Audit Log →
            </button>
          </div>

          <div className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-navy-900 dark:text-slate-200 truncate">{log.action}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{log.userName}</span>
                    <span>•</span>
                    <span>{log.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
