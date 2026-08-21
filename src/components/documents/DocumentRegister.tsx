'use client';

import React, { useState, useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { DocumentStatus, DocumentType } from '@/types/qms';
import { Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, Clock, ExternalLink, ChevronRight } from 'lucide-react';

export default function DocumentRegister() {
  const { qmsDocuments, setSelectedDocumentId, setActiveModule } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const departments = ['All', 'Quality Management', 'Human Resources', 'Operations', 'Information Technology'];
  const docTypes: (DocumentType | 'All')[] = ['All', 'Policy', 'SOP', 'Work Instruction', 'Procedure', 'Handbook', 'Form'];
  const statuses: (DocumentStatus | 'All')[] = ['All', 'Active', 'Under Review', 'Changes Requested', 'Superseded', 'Archived'];

  const filteredDocs = useMemo(() => {
    return qmsDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = deptFilter === 'All' || doc.department === deptFilter;
      const matchesType = typeFilter === 'All' || doc.docType === typeFilter;
      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;

      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [qmsDocuments, searchQuery, deptFilter, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-navy-950 dark:text-white">Central Controlled Document Register</h1>
          <p className="text-xs text-slate-500 mt-1">
            Master repository of controlled policies, standard operating procedures, work instructions, and company records.
          </p>
        </div>
        <button
          onClick={() => alert('Demo Mode: New Document Wizard can be configured around company workflow requirements.')}
          className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 dark:bg-brand-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Multi-Parameter Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, doc #, owner..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:bg-slate-800 dark:text-white"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  Dept: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Doc Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:bg-slate-800 dark:text-white"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  Type: {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:bg-slate-800 dark:text-white"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Register Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">Doc # &amp; Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Ver</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Review Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocumentId(doc.id);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-navy-950 dark:text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <div className="font-mono text-[11px] text-brand-600 dark:text-brand-400">{doc.docNumber}</div>
                        <div className="font-bold">{doc.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {doc.docType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{doc.department}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{doc.ownerName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">v{doc.currentVersion}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : doc.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : doc.status === 'Changes Requested'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{doc.reviewDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-navy-50 hover:bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-white font-semibold text-[11px]">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
