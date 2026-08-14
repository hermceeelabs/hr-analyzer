'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { CustomReport } from '@/types/hr';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
  groupByOvertime,
} from '@/lib/analytics/engine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Printer, Edit3, Database, FileSpreadsheet, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CustomReportWithComparison extends CustomReport {
  enableComparison?: boolean;
  periodALabel?: string;
  periodBLabel?: string;
  kpisA?: any;
  kpisB?: any;
}

interface ReportPreviewProps {
  report: CustomReportWithComparison;
  onEdit: () => void;
}

export default function ReportPreview({ report, onEdit }: ReportPreviewProps) {
  const { filteredRecords, kpis } = useHR();

  const handlePrint = () => {
    window.print();
  };

  const deptData = groupByDepartment(filteredRecords);
  const otData = groupByOvertime(filteredRecords);

  const getKPIValue = (title: string, targetKpis = kpis) => {
    switch (title) {
      case 'Total Headcount':
        return targetKpis.totalEmployees.toLocaleString();
      case 'Active Employees':
        return targetKpis.activeEmployees.toLocaleString();
      case 'Attrition Rate':
        return `${targetKpis.attritionRate}%`;
      case 'Average Monthly Income':
        return `$${targetKpis.averageSalary.toLocaleString()}`;
      case 'Average Workforce Age':
        return `${targetKpis.averageAge} yrs`;
      case 'Average Tenure':
        return `${targetKpis.averageTenure} yrs`;
      case 'Overtime Rate':
        return `${targetKpis.overtimeRate}%`;
      case 'Avg Job Satisfaction':
        return `${targetKpis.averageJobSatisfaction} / 5`;
      default:
        return 'N/A';
    }
  };

  const getKPIRawVal = (title: string, targetKpis = kpis) => {
    switch (title) {
      case 'Total Headcount': return targetKpis.totalEmployees;
      case 'Active Employees': return targetKpis.activeEmployees;
      case 'Attrition Rate': return targetKpis.attritionRate;
      case 'Average Monthly Income': return targetKpis.averageSalary;
      case 'Average Workforce Age': return targetKpis.averageAge;
      case 'Average Tenure': return targetKpis.averageTenure;
      case 'Overtime Rate': return targetKpis.overtimeRate;
      case 'Avg Job Satisfaction': return targetKpis.averageJobSatisfaction;
      default: return 0;
    }
  };

  // Compute Delta with proper contextual formatting (Rate % vs Currency $ vs Count)
  const getKPIDeltaMeta = (title: string, valA: number, valB: number) => {
    const diff = valB - valA;
    if (Math.abs(diff) < 0.01) {
      return { text: '0.0', type: 'neutral', icon: Minus };
    }

    const isRate = title.includes('Rate') || title.includes('Satisfaction');
    const isCurrency = title.includes('Income') || title.includes('Salary');
    const isInteger = title.includes('Headcount') || title.includes('Employees') || title.includes('Count');
    const formattedDiff = isCurrency
      ? `$${Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : isRate
      ? `${Math.abs(diff).toFixed(1)}%`
      : isInteger
      ? `${Math.abs(diff).toLocaleString()}`
      : `${Math.abs(diff).toFixed(1)}`;

    const text = diff > 0 ? `+${formattedDiff}` : `-${formattedDiff}`;

    // Contextual badge coloring: Attrition Rate increase is negative/danger (red)
    let badgeType: 'success' | 'danger' | 'neutral' = 'neutral';
    if (title === 'Attrition Rate' || title === 'Overtime Rate') {
      badgeType = diff > 0 ? 'danger' : 'success';
    } else {
      badgeType = diff > 0 ? 'success' : 'danger';
    }

    return {
      text,
      badgeType,
      icon: diff > 0 ? TrendingUp : TrendingDown,
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (Marked print:hidden so it NEVER appears in PDF exports) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-navy-100 dark:border-slate-800 shadow-xs print:hidden transition-colors duration-200">
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg border border-navy-200 dark:border-slate-700 text-navy-700 dark:text-slate-300 font-semibold text-xs hover:bg-navy-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Report</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Print Document Container */}
      <div className="bg-white rounded-xl border border-navy-200 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-8 text-navy-900 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
        
        {/* Document Header */}
        <div className="border-b border-navy-900/20 pb-6 flex items-start justify-between break-inside-avoid">
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
        <div className="bg-navy-50/70 rounded-lg p-4 border border-navy-100 text-xs break-inside-avoid">
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
        <div className="space-y-2 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
            Executive Summary
          </h2>
          <p className="text-xs text-navy-700 leading-relaxed">{report.executiveSummary}</p>
        </div>

        {/* Key Metrics / Period Comparison View */}
        {report.selectedKPIs.length > 0 && (
          <div className="space-y-3 break-inside-avoid">
            <div className="flex items-center justify-between border-b pb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                {report.enableComparison ? 'Period / Cohort Comparative Metrics' : 'Key Metrics'}
              </h2>
              {report.enableComparison && (
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {report.periodALabel || 'Cohort A'} vs {report.periodBLabel || 'Cohort B'}
                </span>
              )}
            </div>

            {report.enableComparison && report.kpisA && report.kpisB ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.selectedKPIs.map((kpiTitle) => {
                    const valA = getKPIRawVal(kpiTitle, report.kpisA);
                    const valB = getKPIRawVal(kpiTitle, report.kpisB);
                    const meta = getKPIDeltaMeta(kpiTitle, valA, valB);
                    const IconComponent = meta.icon;

                    return (
                      <div key={kpiTitle} className="p-3 bg-navy-50/50 rounded-lg border border-navy-100 flex items-center justify-between break-inside-avoid">
                        <div>
                          <div className="text-[10px] font-bold text-navy-500 uppercase">{kpiTitle}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div>
                              <div className="text-[9px] text-navy-400 font-semibold">{report.periodALabel || 'Group A'}</div>
                              <div className="text-sm font-extrabold text-navy-900">{getKPIValue(kpiTitle, report.kpisA)}</div>
                            </div>
                            <div className="text-navy-300 font-bold">vs</div>
                            <div>
                              <div className="text-[9px] text-navy-400 font-semibold">{report.periodBLabel || 'Group B'}</div>
                              <div className="text-sm font-extrabold text-navy-900">{getKPIValue(kpiTitle, report.kpisB)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Corrected Delta Badge */}
                        <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                          meta.badgeType === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : meta.badgeType === 'danger'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <IconComponent className="w-3 h-3" />
                          <span>{meta.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.selectedKPIs.map((kpiTitle) => (
                  <div key={kpiTitle} className="p-3 bg-navy-50/50 rounded-lg border border-navy-100 text-center break-inside-avoid">
                    <div className="text-[10px] font-bold text-navy-500 uppercase">{kpiTitle}</div>
                    <div className="text-xl font-extrabold text-navy-950 mt-1">
                      {getKPIValue(kpiTitle)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Visualizations */}
        {report.selectedCharts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1 break-inside-avoid">
              Selected Visualizations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.selectedCharts.includes('Department Breakdown') && (
                <div className="border border-navy-100 rounded-lg p-4 break-inside-avoid">
                  <div className="text-xs font-bold text-navy-800 mb-2">Headcount by Department</div>
                  <div className="h-48">
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
                <div className="border border-navy-100 rounded-lg p-4 break-inside-avoid">
                  <div className="text-xs font-bold text-navy-800 mb-2">Attrition Rate by Department (%)</div>
                  <div className="h-48">
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
                <div className="border border-navy-100 rounded-lg p-4 break-inside-avoid">
                  <div className="text-xs font-bold text-navy-800 mb-2">Attrition Rate by Overtime (%)</div>
                  <div className="h-48">
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
                <div className="border border-navy-100 rounded-lg p-4 break-inside-avoid">
                  <div className="text-xs font-bold text-navy-800 mb-2">Average Salary by Department ($)</div>
                  <div className="h-48">
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
        <div className="space-y-2 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
            Observations & Commentary
          </h2>
          <pre className="text-xs text-navy-800 font-sans whitespace-pre-wrap leading-relaxed bg-navy-50/40 p-4 rounded-lg border border-navy-100">
            {report.commentary}
          </pre>
        </div>

        {/* Data Source Footer */}
        <div className="pt-6 border-t border-navy-100 flex items-center justify-between text-[11px] text-navy-500 font-medium break-inside-avoid">
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
