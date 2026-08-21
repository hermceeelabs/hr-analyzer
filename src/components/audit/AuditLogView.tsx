'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { PortalModule } from '@/types/qms';
import { ShieldCheck, Search, Filter, Clock, UserCheck, FileText } from 'lucide-react';

export default function AuditLogView() {
  const { auditLogs } = useHR();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('All');

  const modules = ['All', 'qms', 'documents', 'hr'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-navy-950 dark:text-white">System Audit &amp; Compliance Log</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, audit-ready stream of user activities, document status changes, approvals, and employee record updates.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
          {filteredLogs.length} Total Audit Records
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, or record title..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:bg-slate-800 dark:text-white"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  Module: {m.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">User &amp; Role</th>
                <th className="py-3.5 px-4">Action Summary</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record</th>
                <th className="py-3.5 px-4 font-mono">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-navy-950 dark:text-white">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-brand-600 dark:text-brand-400 font-semibold">{log.recordTitle}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
