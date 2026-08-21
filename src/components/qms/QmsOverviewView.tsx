'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { QmsSubTab, AuditRecord, NonConformanceRecord, CapaRecord } from '@/types/qms';
import { DocumentStatusBadge } from '@/components/common/PortalUiComponents';
import { ScheduleAuditModal, LogNonConformanceModal, IssueCapaModal } from '@/components/common/QmsModals';
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
  const { qmsDocuments, activeQmsSubTab, setActiveModule, setSelectedDocumentId, logAuditAction } = useHR();

  const [audits, setAudits] = useState<AuditRecord[]>([
    {
      id: 'aud-1',
      auditNumber: 'AUD-2026-001',
      title: 'ISO 9001 Annual Recertification Audit',
      auditType: 'External Recertification',
      department: 'Quality Management',
      auditorName: 'Michael Chang',
      scheduledDate: '2026-10-14',
      status: 'Scheduled',
      findingsCount: 0,
    },
    {
      id: 'aud-2',
      auditNumber: 'AUD-2026-002',
      title: 'Q2 Document Versioning & Archival Audit',
      auditType: 'Document Control',
      department: 'Quality Management',
      auditorName: 'Sarah Jenkins',
      scheduledDate: '2026-06-20',
      status: 'Completed',
      findingsCount: 0,
    },
    {
      id: 'aud-3',
      auditNumber: 'AUD-2026-003',
      title: 'Key IT Hardware Supplier Audit',
      auditType: 'Supplier Quality',
      department: 'Information Technology',
      auditorName: 'Alexander Hayes',
      scheduledDate: '2026-08-18',
      status: 'In Progress',
      findingsCount: 1,
    },
  ]);

  const [nonConformances, setNonConformances] = useState<NonConformanceRecord[]>([
    {
      id: 'nc-1',
      ncNumber: 'NC-2026-004',
      title: 'Delayed Safety Equipment Training Sign-off',
      department: 'Operations',
      severity: 'Minor',
      loggedBy: 'David O\'Connor',
      loggedDate: '2026-08-10',
      description: 'Quarterly HSE safety training completion fell below the 95% threshold for plant staff.',
      status: 'CAPA Pending',
    },
    {
      id: 'nc-2',
      ncNumber: 'NC-2026-003',
      title: 'Document Control Version Tag Discrepancy',
      department: 'Quality Management',
      severity: 'Low',
      loggedBy: 'Sarah Jenkins',
      loggedDate: '2026-07-28',
      description: 'Minor header version number misalignment resolved during internal review.',
      status: 'Resolved',
    },
  ]);

  const [capas, setCapas] = useState<CapaRecord[]>([
    {
      id: 'capa-1',
      capaNumber: 'CAPA-012',
      title: 'Automated System Access Deprovisioning Enforcement',
      rootCause: 'Manual handoff between HR exit workflow and IT access revoking.',
      correctiveAction: 'Automated Supabase database trigger integrated with employee termination status.',
      assignedTo: 'Marcus Vance',
      dueDate: '2026-09-30',
      status: 'Verification Pending',
    },
  ]);

  // Modal Visibility States
  const [isScheduleAuditModalOpen, setIsScheduleAuditModalOpen] = useState(false);
  const [isLogNcModalOpen, setIsLogNcModalOpen] = useState(false);
  const [isIssueCapaModalOpen, setIsIssueCapaModalOpen] = useState(false);

  const total = qmsDocuments.length;
  const active = qmsDocuments.filter((d) => d.status === 'Active').length;
  const underReview = qmsDocuments.filter((d) => d.status === 'Under Review').length;
  const changesReq = qmsDocuments.filter((d) => d.status === 'Changes Requested').length;

  const displayedDocs = qmsDocuments.filter((doc) => {
    if (activeQmsSubTab === 'policies') return doc.docType === 'Policy' || doc.docType === 'Handbook';
    if (activeQmsSubTab === 'sops') return doc.docType === 'SOP' || doc.docType === 'Procedure';
    if (activeQmsSubTab === 'work-instructions') return doc.docType === 'Work Instruction';
    return true;
  });

  // Audits Subpage View
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
            onClick={() => setIsScheduleAuditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Audit</span>
          </button>
        </div>

        <ScheduleAuditModal
          isOpen={isScheduleAuditModalOpen}
          onClose={() => setIsScheduleAuditModalOpen(false)}
          onSubmit={(data) => {
            const newAudit: AuditRecord = {
              ...data,
              id: `aud-${Date.now()}`,
              status: 'Scheduled',
              findingsCount: 0,
            };
            setAudits([newAudit, ...audits]);
            logAuditAction(`Scheduled ${data.auditType} (${data.auditNumber})`, 'qms', data.title);
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audits.map((aud) => (
            <div key={aud.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{aud.auditNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    aud.status === 'Completed'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : aud.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {aud.status}
                </span>
              </div>
              <div className="text-sm font-bold text-navy-950 dark:text-white">{aud.title}</div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Auditor: {aud.auditorName}</span>
                <span className="font-mono">{aud.scheduledDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Non-Conformances Subpage View
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
            onClick={() => setIsLogNcModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Non-Conformance</span>
          </button>
        </div>

        <LogNonConformanceModal
          isOpen={isLogNcModalOpen}
          onClose={() => setIsLogNcModalOpen(false)}
          onSubmit={(data) => {
            const newNc: NonConformanceRecord = {
              ...data,
              id: `nc-${Date.now()}`,
              loggedBy: 'Current User',
              loggedDate: new Date().toISOString().split('T')[0],
              status: 'Open',
            };
            setNonConformances([newNc, ...nonConformances]);
            logAuditAction(`Logged Non-Conformance ${data.ncNumber}`, 'qms', data.title, `Severity: ${data.severity}`);
          }}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-navy-950 dark:text-white">Logged Quality Non-Conformances</h2>
            <span className="text-xs font-semibold text-slate-500">{nonConformances.length} Incidents</span>
          </div>

          <div className="space-y-3">
            {nonConformances.map((nc) => (
              <div key={nc.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-600">{nc.ncNumber}</span>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">{nc.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dept: {nc.department} • Severity: <strong className="text-rose-600">{nc.severity}</strong> • Logged: {nc.loggedDate}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    nc.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : nc.status === 'CAPA Pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {nc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CAPA Subpage View
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
            onClick={() => setIsIssueCapaModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New CAPA</span>
          </button>
        </div>

        <IssueCapaModal
          isOpen={isIssueCapaModalOpen}
          onClose={() => setIsIssueCapaModalOpen(false)}
          onSubmit={(data) => {
            const newCapa: CapaRecord = {
              ...data,
              id: `capa-${Date.now()}`,
              status: 'Open',
            };
            setCapas([newCapa, ...capas]);
            logAuditAction(`Issued Corrective Action ${data.capaNumber}`, 'qms', data.title, `Assigned to: ${data.assignedTo}`);
          }}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          {capas.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-brand-200 dark:border-slate-800 bg-brand-50/40 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-600">{c.capaNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{c.status}</span>
              </div>
              <h3 className="text-xs font-bold text-navy-950 dark:text-white">{c.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Root Cause:</strong> {c.rootCause} <br />
                <strong>Corrective Plan:</strong> {c.correctiveAction}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                <span>Assigned: {c.assignedTo}</span>
                <span>Due Date: {c.dueDate}</span>
              </div>
            </div>
          ))}
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
