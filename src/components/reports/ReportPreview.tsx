'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { CustomReport } from '@/types/hr';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
  groupByAgeGroup,
  groupByGender,
  groupByOvertime,
  groupByPerformanceRating,
} from '@/lib/analytics/engine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Printer, Edit3, Database, FileSpreadsheet } from 'lucide-react';

interface ReportPreviewProps {
  report: CustomReport;
  onEdit: () => void;
}

export default function ReportPreview({ report, onEdit }: ReportPreviewProps) {
  const { filteredRecords, kpis, dataSourceMode } = useHR();

  const handlePrint = () => {
    window.print();
  };

  const deptData = groupByDepartment(filteredRecords);
  const roleData = groupByJobRole(filteredRecords);
  const levelData = groupByJobLevel(filteredRecords);
  const otData = groupByOvertime(filteredRecords);
  const perfData = groupByPerformanceRating(filteredRecords);

  const getKPIValue = (title: string) => {
    switch (title) {
      case 'Total Headcount':
        return kpis.totalEmployees.toLocaleString();
      case 'Active Employees':
        return kpis.activeEmployees.toLocaleString();
      case 'Attrition Rate':
        return `${kpis.attritionRate}%`;
      case 'Average Monthly Income':
        return `$${kpis.averageSalary.toLocaleString()}`;
      case 'Average Workforce Age':
        return `${kpis.averageAge} yrs`;
      case 'Average Tenure':
        return `${kpis.averageTenure} yrs`;
      case 'Overtime Rate':
        return `${kpis.overtimeRate}%`;
      case 'Avg Job Satisfaction':
        return `${kpis.averageJobSatisfaction} / 5`;
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-navy-100 shadow-xs print:hidden">
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg border border-navy-200 text-navy-700 font-semibold text-xs hover:bg-navy-50 flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Report</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Print Document Container */}
      <div className="bg-white rounded-xl border border-navy-200 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-8 text-navy-900 print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-navy-900/20 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
              Management Intelligence Report
            </div>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">{report.title}</h1>
            <div className="text-xs text-navy-500 font-medium mt-1">Generated on {report.createdAt}</div>
          </div>
          <div className="text-right text-xs text-navy-500 font-semibold">
            <div>Enterprise HR Analytics</div>
            <div className="text-[11px] text-navy-400">Strictly Confidential</div>
          </div>
        </div>

        {/* Reporting Context / Selected Filters */}
        <div className="bg-navy-50/70 rounded-lg p-4 border border-navy-100 text-xs">
          <div className="font-bold text-navy-900 uppercase tracking-wider mb-2 text-[11px]">
            Reporting Context & Filters Applied:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-navy-700">
            <div>
              Department: <span className="font-semibold">{report.filters.department || 'All'}</span>
            </div>
            <div>
              Job Role: <span className="font-semibold">{report.filters.jobRole || 'All'}</span>
            </div>
            <div>
              Job Level: <span className="font-semibold">{report.filters.jobLevel || 'All'}</span>
            </div>
            <div>
              Gender: <span className="font-semibold">{report.filters.gender || 'All'}</span>
            </div>
            <div>
              Overtime: <span className="font-semibold">{report.filters.overTime || 'All'}</span>
            </div>
            <div>
              Salary Slab: <span className="font-semibold">{report.filters.salarySlab || 'All'}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
            Executive Summary
          </h2>
          <p className="text-xs text-navy-700 leading-relaxed">{report.executiveSummary}</p>
        </div>

        {/* Key Metrics */}
        {report.selectedKPIs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {report.selectedKPIs.map((kpiTitle) => (
                <div key={kpiTitle} className="p-3 bg-navy-50/50 rounded-lg border border-navy-100 text-center">
                  <div className="text-[10px] font-bold text-navy-500 uppercase">{kpiTitle}</div>
                  <div className="text-xl font-extrabold text-navy-950 mt-1">
                    {getKPIValue(kpiTitle)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Visualizations */}
        {report.selectedCharts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
              Selected Visualizations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.selectedCharts.includes('Department Breakdown') && (
                <div className="border border-navy-100 rounded-lg p-4">
                  <div className="text-xs font-bold text-navy-800 mb-2">Headcount by Department</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Bar dataKey="total" fill="#0062d6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {report.selectedCharts.includes('Attrition by Department') && (
                <div className="border border-navy-100 rounded-lg p-4">
                  <div className="text-xs font-bold text-navy-800 mb-2">Attrition Rate by Department (%)</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} unit="%" />
                        <Bar dataKey="attritionRate" fill="#e11d48" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {report.selectedCharts.includes('Attrition by Overtime') && (
                <div className="border border-navy-100 rounded-lg p-4">
                  <div className="text-xs font-bold text-navy-800 mb-2">Attrition Rate by Overtime (%)</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={otData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} unit="%" />
                        <Bar dataKey="attritionRate" fill="#f43f5e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {report.selectedCharts.includes('Salary by Department') && (
                <div className="border border-navy-100 rounded-lg p-4">
                  <div className="text-xs font-bold text-navy-800 mb-2">Average Salary by Department ($)</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} unit="$" />
                        <Bar dataKey="avgSalary" fill="#059669" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Observations / Commentary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
            Observations & Commentary
          </h2>
          <pre className="text-xs text-navy-800 font-sans whitespace-pre-wrap leading-relaxed bg-navy-50/40 p-4 rounded-lg border border-navy-100">
            {report.commentary}
          </pre>
        </div>

        {/* Data Source Footer */}
        <div className="pt-6 border-t border-navy-100 flex items-center justify-between text-[11px] text-navy-500 font-medium">
          <div className="flex items-center gap-1.5">
            {report.dataSource === 'demo' ? (
              <>
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Source: Supabase Demo Database (public.employees)</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>Data Source: Uploaded Session Dataset</span>
              </>
            )}
          </div>
          <div>Report ID: {report.id}</div>
        </div>

      </div>
    </div>
  );
}
