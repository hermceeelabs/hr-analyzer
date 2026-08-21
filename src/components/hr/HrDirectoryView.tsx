'use client';

import React, { useState, useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { EmployeeProfile } from '@/types/qms';
import { PageHeader } from '@/components/common/PortalUiComponents';
import { Search, ChevronRight, X, Mail, Phone } from 'lucide-react';

export default function HrDirectoryView() {
  const { employeeDirectory } = useHR();
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  const departments = ['All', 'Research & Development', 'Sales', 'Human Resources'];
  const statuses = ['All', 'Active', 'On Leave', 'Terminated'];

  const filteredDirectory = useMemo(() => {
    return employeeDirectory.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || emp.employmentStatus === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employeeDirectory, searchQuery, deptFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <PageHeader
        title="Corporate Employee Directory"
        subtitle="Centralized workforce profiles, organizational hierarchy, training records, and personnel documents."
        badge={
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            Showing <span className="text-navy-900 dark:text-white font-bold">{filteredDirectory.length}</span> of {employeeDirectory.length} Profiles
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, position, or email..."
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
                  Department: {d}
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

      {/* Directory Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Department &amp; Position</th>
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredDirectory.slice(0, 30).map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-navy-950 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-xs">
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-500">{emp.empId}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{emp.position}</div>
                    <div className="text-[11px] text-slate-400">{emp.department}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{emp.managerName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        emp.employmentStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : emp.employmentStatus === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{emp.startDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employee Profile</span>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg">
                {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-950 dark:text-white">{selectedEmployee.name}</h2>
                <div className="text-xs font-semibold text-brand-600 dark:text-brand-400">{selectedEmployee.position}</div>
                <div className="text-xs text-slate-500">{selectedEmployee.department}</div>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Employee ID</span>
                <span className="font-mono font-bold text-navy-900 dark:text-white">{selectedEmployee.empId}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Status</span>
                <span className="font-bold text-emerald-600">{selectedEmployee.employmentStatus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Direct Manager</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedEmployee.managerName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Start Date</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{selectedEmployee.startDate}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs border-t pt-4 border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Information</div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEmployee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEmployee.phone}</span>
              </div>
            </div>

            {/* Documents & Training Summary */}
            <div className="space-y-3 border-t pt-4 border-slate-100 dark:border-slate-800 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">Personnel Records &amp; Compliance</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <div className="text-lg font-bold text-brand-600">{selectedEmployee.documentsCount}</div>
                  <div className="text-[10px] text-slate-500">Docs Logged</div>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <div className="text-lg font-bold text-emerald-600">{selectedEmployee.completedTrainingCount}</div>
                  <div className="text-[10px] text-slate-500">Training Done</div>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <div className="text-lg font-bold text-purple-600">{selectedEmployee.leaveBalanceDays} d</div>
                  <div className="text-[10px] text-slate-500">Leave Rem.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
