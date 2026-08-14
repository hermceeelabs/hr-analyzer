'use client';

import React, { useState, useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { EmployeeRecord } from '@/types/hr';
import {
  Users,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

type SortField = keyof EmployeeRecord;

export default function EmployeeTable() {
  const { filteredRecords } = useHR();

  const [sortField, setSortField] = useState<SortField>('empId');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting
  const sortedRecords = useMemo(() => {
    const records = [...filteredRecords];
    records.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return records;
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-navy-300" />;
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-brand-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-xs overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-4 border-b border-navy-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" />
          <h2 className="text-sm font-bold text-navy-900">Employee Master Directory</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-800 text-xs font-semibold">
            {sortedRecords.length} records
          </span>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-xs text-navy-600 font-medium">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-navy-200 rounded-md bg-white text-navy-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-semibold"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-navy-800">
          <thead className="bg-navy-50/80 border-b border-navy-100 text-navy-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => handleSort('empId')}
                className="px-4 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Emp ID</span>
                  {renderSortIcon('empId')}
                </div>
              </th>
              <th
                onClick={() => handleSort('age')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Age</span>
                  {renderSortIcon('age')}
                </div>
              </th>
              <th
                onClick={() => handleSort('department')}
                className="px-4 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  {renderSortIcon('department')}
                </div>
              </th>
              <th
                onClick={() => handleSort('jobRole')}
                className="px-4 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Job Role</span>
                  {renderSortIcon('jobRole')}
                </div>
              </th>
              <th
                onClick={() => handleSort('jobLevel')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Level</span>
                  {renderSortIcon('jobLevel')}
                </div>
              </th>
              <th
                onClick={() => handleSort('gender')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Gender</span>
                  {renderSortIcon('gender')}
                </div>
              </th>
              <th
                onClick={() => handleSort('monthlyIncome')}
                className="px-4 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Monthly Salary</span>
                  {renderSortIcon('monthlyIncome')}
                </div>
              </th>
              <th
                onClick={() => handleSort('attrition')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Attrition</span>
                  {renderSortIcon('attrition')}
                </div>
              </th>
              <th
                onClick={() => handleSort('overTime')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Overtime</span>
                  {renderSortIcon('overTime')}
                </div>
              </th>
              <th
                onClick={() => handleSort('yearsAtCompany')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Tenure</span>
                  {renderSortIcon('yearsAtCompany')}
                </div>
              </th>
              <th
                onClick={() => handleSort('jobSatisfaction')}
                className="px-3 py-3 cursor-pointer hover:bg-navy-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Satisfaction</span>
                  {renderSortIcon('jobSatisfaction')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100 font-medium">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[11px] font-bold text-navy-900">
                    {r.empId}
                  </td>
                  <td className="px-3 py-2.5">{r.age}</td>
                  <td className="px-4 py-2.5">{r.department}</td>
                  <td className="px-4 py-2.5">{r.jobRole}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-navy-100 text-navy-700 text-[10px] font-bold">
                      L{r.jobLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">{r.gender}</td>
                  <td className="px-4 py-2.5 font-semibold text-navy-900">
                    ${r.monthlyIncome.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        r.attrition
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {r.attrition ? 'Yes (Left)' : 'No (Active)'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.overTime ? 'bg-amber-100 text-amber-800' : 'bg-navy-100 text-navy-600'
                      }`}
                    >
                      {r.overTime ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">{r.yearsAtCompany} yrs</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{r.jobSatisfaction}</span>
                      <span className="text-[10px] text-navy-400">/5</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-navy-500 font-medium">
                  No employee records match the active filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-navy-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-navy-600 font-medium">
        <div>
          Showing Page <span className="font-bold text-navy-900">{currentPage}</span> of{' '}
          <span className="font-bold text-navy-900">{totalPages}</span> ({sortedRecords.length} total filtered employees)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-navy-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-navy-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
