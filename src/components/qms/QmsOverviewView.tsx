'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { QmsSubTab } from '@/types/qms';
import { DocumentStatusBadge } from '@/components/common/PortalUiComponents';
import {
  ShieldCheck,
  FileCheck2,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Search,
  Plus,
  AlertOctagon,
  CheckSquare,
  Calendar,
  History,
} from 'lucide-react';

export default function QmsOverviewView() {
  const { qmsDocuments, activeQmsSubTab, setActiveModule, setSelectedDocumentId } = useHR();

  const total = qmsDocuments.length;
  const active = qmsDocuments.filter((d) => d.status === 'Active').length;
  const underReview = qmsDocuments.filter((d) => d.status === 'Under Review').length;
  const changesReq = qmsDocuments.filter((d) => d.status === 'Changes Requested').length;

  // Filter documents based on active QMS subtab
  const displayedDocs = qmsDocuments.filter((doc) => {
    if (activeQmsSubTab === 'policies') return doc.docType === 'Policy' || doc.docType === 'Handbook';
    if (activeQmsSubTab === 'sops') return doc.docType === 'SOP' || doc.docType === 'Procedure';
    if (activeQmsSubTab === 'work-instructions') return doc.docType === 'Work Instruction';
    return true; // overview or document-control shows all
  });

  // Render specific subtab content for Audits, Non-Conformances, and CAPA
  if (activeQmsSubTab === 'audits') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-navy-950 dark:text-white">Internal &amp; External Quality Audits</h1>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled ISO 9001 compliance audits, audit checklists, auditor logs, and findings.
            </p>
          </div>
          <button
            onClick={() => alert('Demo Mode: Schedule Audit wizard can be configured to client specifications.')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Audit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Q3 Internal Audit</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Scheduled</span>
            </div>
            <div className="text-sm font-bold text-navy-950 dark:text-white">ISO 9001 Annual Recertification Audit</div>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 14 - Oct 16, 2026</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Document Control Audit</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">Completed</span>
            </div>
            <div className="text-sm font-bold text-navy-950 dark:text-white">Q2 Document Versioning &amp; Archival Audit</div>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>0 Major Non-Conformances</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Supplier Quality Audit</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">In Progress</span>
            </div>
            <div className="text-sm font-bold text-navy-950 dark:text-white">Key IT Hardware Supplier Audit</div>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Reviewing SLA Attachments</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeQmsSubTab === 'non-conformances') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-navy-950 dark:text-white">Non-Conformance Incident Register</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track quality deviations, process non-conformances, and customer quality feedback.
            </p>
          </div>
          <button
            onClick={() => alert('Demo Mode: Log Non-Conformance modal can be connected to custom workflow form.')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Non-Conformance</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-navy-950 dark:text-white">Logged Quality Non-Conformances</h2>
            <span className="text-xs font-semibold text-slate-500">1 Open • 2 Resolved</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-600">NC-2026-004</span>
                  <span className="text-xs font-bold text-navy-950 dark:text-white">Delayed Safety Equipment Training Sign-off</span>
                </div>
                <div className="text-[11px] text-slate-500">Department: Operations • Severity: Minor • Logged: Aug 10, 2026</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                CAPA Pending
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">NC-2026-003</span>
                  <span className="text-xs font-bold text-navy-950 dark:text-white">Document Control Version Tag Discrepancy</span>
                </div>
                <div className="text-[11px] text-slate-500">Department: Quality Management • Severity: Low • Resolved: Jul 28, 2026</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeQmsSubTab === 'capa') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-navy-950 dark:text-white">Corrective &amp; Preventive Action (CAPA) Workflow</h1>
            <p className="text-xs text-slate-500 mt-1">
              Root-cause analysis (5-Why), corrective action implementation, and effectiveness verification.
            </p>
          </div>
          <button
            onClick={() => alert('Demo Mode: Issue CAPA wizard can be linked to incident logging.')}
            className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New CAPA</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="p-4 rounded-xl border border-brand-200 dark:border-slate-800 bg-brand-50/40 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-brand-600">CAPA-012</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Verification Pending</span>
            </div>
            <h3 className="text-xs font-bold text-navy-950 dark:text-white">Automated System Access Deprovisioning Enforcement</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Root Cause: Manual handoff between HR exit workflow and IT access revoking. Corrective Action: Automated Supabase trigger integrated with employee termination status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default Overview / Document Control view
  return (
    <div className="space-y-6">
      {/* QMS Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-navy-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ISO 9001:2015 Quality Management System</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">QMS Compliance &amp; Document Control</h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Controlled document repository, quality policies, audit schedules, non-conformance logging, and corrective action workflows.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Controlled Total</div>
          <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">{total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Documents in Register</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Active &amp; Effective</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{active}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Approved Release Version</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Under Review</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{underReview}</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Awaiting Manager Sign-off</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Revisions Requested</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{changesReq}</div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Requires Author Updates</div>
        </div>
      </div>

      {/* Document Control List Filtered by Subtab */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-navy-950 dark:text-white capitalize">
              {activeQmsSubTab === 'policies'
                ? 'Quality Policies & Handbooks'
                : activeQmsSubTab === 'sops'
                ? 'Standard Operating Procedures (SOPs)'
                : activeQmsSubTab === 'work-instructions'
                ? 'Work Instructions & Checklists'
                : 'Active Quality Documents'}
            </h2>
            <p className="text-xs text-slate-500">ISO 9001 controlled repository documents</p>
          </div>
          <button
            onClick={() => setActiveModule('documents')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Full Document Register →
          </button>
        </div>

        <div className="space-y-3">
          {displayedDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocumentId(doc.id);
                setActiveModule('documents');
              }}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{doc.docNumber}</span>
                  <span className="text-xs font-bold text-navy-950 dark:text-white">{doc.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>{doc.docType}</span>
                  <span>•</span>
                  <span>{doc.department}</span>
                  <span>•</span>
                  <span>Review Date: {doc.reviewDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">v{doc.currentVersion}</span>
                <DocumentStatusBadge status={doc.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
