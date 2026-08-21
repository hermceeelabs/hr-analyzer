'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { PageHeader } from '@/components/common/PortalUiComponents';
import { BaseModal } from '@/components/common/QmsModals';
import { Copy, Plus } from 'lucide-react';

export default function TemplateLibrary() {
  const { templates, createDocument, setActiveModule, logAuditAction } = useHR();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HR Form');

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Corporate Template Library"
        subtitle="Standardized company document templates for HR forms, QMS SOPs, quality policies, and audit checklists."
        action={
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Template</span>
          </button>
        }
      />

      <BaseModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Corporate Document Template"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title) return;
            logAuditAction('Uploaded Template', 'templates', title, `Category: ${category}`);
            setIsUploadModalOpen(false);
            setTitle('');
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Template Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Employee Exit Knowledge Transfer Form"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-semibold"
            >
              <option value="HR Form">HR Form</option>
              <option value="QMS SOP">QMS SOP</option>
              <option value="Quality Policy">Quality Policy</option>
              <option value="Audit Checklist">Audit Checklist</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select File (.docx, .pdf, Google Docs)</label>
            <input
              type="file"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs shadow-xs"
            >
              Upload &amp; Register Template
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-400 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60">
                  {tpl.category}
                </span>
                <span className="font-mono text-xs text-slate-400">v{tpl.version}</span>
              </div>
              <h3 className="text-sm font-bold text-navy-950 dark:text-white leading-snug">{tpl.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Owner: {tpl.owner}</span>
              <button
                onClick={() => {
                  createDocument({
                    docNumber: `QMS-TPL-00${Math.floor(Math.random() * 90) + 10}`,
                    title: `Draft: ${tpl.name}`,
                    docType: tpl.category === 'QMS' ? 'SOP' : 'Form',
                    department: 'Quality Management',
                    ownerName: tpl.owner,
                    description: `New draft generated from template: ${tpl.name}`,
                    ownerId: 'emp-curr',
                    status: 'Draft',
                    currentVersion: '1.0',
                    effectiveDate: new Date().toISOString().split('T')[0],
                    reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  });
                  setActiveModule('documents');
                }}
                className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Use Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
