'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { DocumentStatus } from '@/types/qms';
import { DocumentStatusBadge } from '@/components/common/PortalUiComponents';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  History,
  Send,
  Archive,
  Plus,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export default function DocumentDetailView() {
  const {
    qmsDocuments,
    selectedDocumentId,
    setSelectedDocumentId,
    updateDocumentStatus,
    addDocumentVersion,
    userRole,
  } = useHR();

  const [newVersionNum, setNewVersionNum] = useState('');
  const [versionDesc, setVersionDesc] = useState('');
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const doc = qmsDocuments.find((d) => d.id === selectedDocumentId) || qmsDocuments[0];

  if (!doc) return null;

  const handleStatusChange = (newStatus: DocumentStatus) => {
    updateDocumentStatus(doc.id, newStatus, commentText);
    setCommentText('');
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionNum || !versionDesc) return;
    addDocumentVersion(doc.id, newVersionNum, versionDesc);
    setNewVersionNum('');
    setVersionDesc('');
    setIsVersionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedDocumentId(null)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Document Register</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded border border-brand-200/60">
                {doc.docNumber}
              </span>
              <span className="text-xs text-slate-500">• {doc.docType}</span>
              <span className="text-xs text-slate-500">• {doc.department}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 dark:text-white">{doc.title}</h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <DocumentStatusBadge status={doc.status} />
            <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
              v{doc.currentVersion}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{doc.description}</p>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* External Google Workspace integration placeholder */}
          {doc.googleDriveUrl ? (
            <a
              href={doc.googleDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Open in Google Workspace</span>
            </a>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium italic">
              Google Workspace Drive Location: Connected to Org Storage
            </span>
          )}

          {/* Workflow Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {doc.status === 'Draft' && (
              <button
                onClick={() => handleStatusChange('Under Review')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Review</span>
              </button>
            )}

            {(doc.status === 'Under Review' || doc.status === 'Changes Requested') && (
              <>
                <button
                  onClick={() => handleStatusChange('Approved')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Document</span>
                </button>
                <button
                  onClick={() => handleStatusChange('Changes Requested')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>
              </>
            )}

            {doc.status === 'Approved' && (
              <button
                onClick={() => handleStatusChange('Active')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Publish as Active</span>
              </button>
            )}

            <button
              onClick={() => setIsVersionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-navy-200 dark:border-slate-700 text-navy-900 dark:text-white font-semibold text-xs hover:bg-navy-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Version</span>
            </button>

            {doc.status !== 'Archived' && (
              <button
                onClick={() => handleStatusChange('Archived')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 font-semibold text-xs flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Grid & Version History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadata Sidebar (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-100 dark:border-slate-800">
            Document Control Metadata
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Document Owner</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{doc.ownerName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Department</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{doc.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Effective Date</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{doc.effectiveDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Next Scheduled Review</span>
              <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{doc.reviewDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Last Updated</span>
              <span className="font-mono text-slate-500">{doc.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Version History Timeline (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-brand-600" />
              <span>Version History Timeline</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">
              {(doc.versions || []).length} Retained Versions
            </span>
          </div>

          <div className="space-y-4">
            {(doc.versions || []).map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-xs text-navy-900 dark:text-white">v{ver.versionNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ver.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ver.status === 'Superseded'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ver.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{ver.createdAt}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{ver.changeDescription}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Author: {ver.createdBy}</span>
                  {ver.approvedBy && <span className="text-emerald-600 font-semibold">Approved by {ver.approvedBy}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Version Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Create New Document Version</h3>
            <form onSubmit={handleCreateVersion} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Version Number</label>
                <input
                  type="text"
                  value={newVersionNum}
                  onChange={(e) => setNewVersionNum(e.target.value)}
                  placeholder="e.g. 2.2 or 3.0"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Change Description / Revision Notes</label>
                <textarea
                  rows={3}
                  value={versionDesc}
                  onChange={(e) => setVersionDesc(e.target.value)}
                  placeholder="Summarize key changes and clauses revised in this iteration..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs"
                >
                  Save &amp; Submit Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
