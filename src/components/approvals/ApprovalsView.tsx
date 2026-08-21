'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function ApprovalsView() {
  const { qmsDocuments, updateDocumentStatus, setSelectedDocumentId, setActiveModule } = useHR();

  const pendingDocs = qmsDocuments.filter(
    (d) => d.status === 'Under Review' || d.status === 'Changes Requested'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-navy-950 dark:text-white">Document Review &amp; Approval Action Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized queue for quality managers, HR officers, and department heads to review and approve controlled documents.
          </p>
        </div>
        <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
          {pendingDocs.length} Documents Pending Action
        </div>
      </div>

      {/* Pending Approval Cards */}
      <div className="space-y-4">
        {pendingDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{doc.docNumber}</span>
                  <span className="text-xs text-slate-500">• {doc.docType}</span>
                </div>
                <h3 className="text-base font-bold text-navy-950 dark:text-white">{doc.title}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center ${
                  doc.status === 'Under Review'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {doc.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">{doc.description}</p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 space-x-3">
                <span>Owner: <strong className="text-slate-700 dark:text-slate-200">{doc.ownerName}</strong></span>
                <span>•</span>
                <span>Dept: <strong className="text-slate-700 dark:text-slate-200">{doc.department}</strong></span>
                <span>•</span>
                <span>Version: <strong className="font-mono text-slate-700 dark:text-slate-200">v{doc.currentVersion}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDocumentId(doc.id);
                    setActiveModule('documents');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  View Details
                </button>
                <button
                  onClick={() => updateDocumentStatus(doc.id, 'Approved', 'Approved in Approval Action Center')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => updateDocumentStatus(doc.id, 'Changes Requested', 'Revisions requested in Approval Action Center')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Request Revisions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
