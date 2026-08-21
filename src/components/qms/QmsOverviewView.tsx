'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { ShieldCheck, FileCheck2, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function QmsOverviewView() {
  const { qmsDocuments, setActiveModule, setActiveQmsSubTab, setSelectedDocumentId } = useHR();

  const total = qmsDocuments.length;
  const active = qmsDocuments.filter((d) => d.status === 'Active').length;
  const underReview = qmsDocuments.filter((d) => d.status === 'Under Review').length;
  const changesReq = qmsDocuments.filter((d) => d.status === 'Changes Requested').length;

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

      {/* Primary Document Control List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-navy-950 dark:text-white">Active Quality Policies &amp; Procedures</h2>
            <p className="text-xs text-slate-500">Core SOPs and ISO quality manual documents</p>
          </div>
          <button
            onClick={() => setActiveModule('documents')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Full Document Register →
          </button>
        </div>

        <div className="space-y-3">
          {qmsDocuments.map((doc) => (
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
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    doc.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : doc.status === 'Under Review'
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
    </div>
  );
}
