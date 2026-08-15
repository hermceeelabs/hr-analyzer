'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { CustomReport, OverallKPIs } from '@/types/hr';
import {
  groupByDepartment,
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
import { Printer, Edit3, Database, FileSpreadsheet } from 'lucide-react';

/* ─────────────── Types ─────────────── */

interface CustomReportWithComparison extends CustomReport {
  enableComparison?: boolean;
  comparisonMode?: 'cohort' | 'date';
  periodALabel?: string;
  periodBLabel?: string;
  dateRangeA?: { start: string; end: string };
  dateRangeB?: { start: string; end: string };
  kpisA?: OverallKPIs;
  kpisB?: OverallKPIs;
}

interface ReportPreviewProps {
  report: CustomReportWithComparison;
  onEdit: () => void;
}

/* ─────────────── Card taxonomy ─────────────── */

type CardCategory =
  | 'composition'   // count / headcount → neutral Δ + composition bar
  | 'neutral'       // averages (age, tenure, income, satisfaction) → neutral Δ, no color
  | 'directional';  // rates where higher/lower is clearly good/bad → semantic color

interface CardMeta {
  category: CardCategory;
  unit: string;          // e.g. 'employees', '$', 'yrs', 'pp', ''
  prefix?: string;       // e.g. '$' for currency
  favorableDirection?: 'lower' | 'higher'; // only for directional
  isRate?: boolean;      // the value itself is a %, so delta is in pp
  isCurrency?: boolean;
  isInteger?: boolean;
}

const CARD_TAXONOMY: Record<string, CardMeta> = {
  'Total Headcount':       { category: 'composition', unit: 'employees', isInteger: true },
  'Active Employees':      { category: 'composition', unit: 'employees', isInteger: true },
  'Attrition Rate':        { category: 'directional', unit: 'pp', isRate: true, favorableDirection: 'lower' },
  'Average Monthly Income': { category: 'neutral', unit: '', prefix: '$', isCurrency: true },
  'Average Workforce Age': { category: 'neutral', unit: 'yrs' },
  'Average Tenure':        { category: 'neutral', unit: 'yrs' },
  'Overtime Rate':         { category: 'directional', unit: 'pp', isRate: true, favorableDirection: 'lower' },
  'Avg Job Satisfaction':  { category: 'directional', unit: '', favorableDirection: 'higher' },
};

const DEFAULT_META: CardMeta = { category: 'neutral', unit: '' };

/* ─────────────── Component ─────────────── */

export default function ReportPreview({ report, onEdit }: ReportPreviewProps) {
  const { filteredRecords, kpis, allRecords } = useHR();

  const handlePrint = () => {
    window.print();
  };

  const deptData = groupByDepartment(filteredRecords);
  const otData = groupByOvertime(filteredRecords);

  /* ── KPI value extraction ── */

  const getKPIFormatted = (title: string, targetKpis: OverallKPIs = kpis) => {
    switch (title) {
      case 'Total Headcount':        return targetKpis.totalEmployees.toLocaleString();
      case 'Active Employees':       return targetKpis.activeEmployees.toLocaleString();
      case 'Attrition Rate':         return `${targetKpis.attritionRate}%`;
      case 'Average Monthly Income': return `$${targetKpis.averageSalary.toLocaleString()}`;
      case 'Average Workforce Age':  return `${targetKpis.averageAge} yrs`;
      case 'Average Tenure':         return `${targetKpis.averageTenure} yrs`;
      case 'Overtime Rate':          return `${targetKpis.overtimeRate}%`;
      case 'Avg Job Satisfaction':   return `${targetKpis.averageJobSatisfaction} / 5`;
      default:                       return 'N/A';
    }
  };

  const getKPIRaw = (title: string, targetKpis: OverallKPIs = kpis): number => {
    switch (title) {
      case 'Total Headcount':        return targetKpis.totalEmployees;
      case 'Active Employees':       return targetKpis.activeEmployees;
      case 'Attrition Rate':         return targetKpis.attritionRate;
      case 'Average Monthly Income': return targetKpis.averageSalary;
      case 'Average Workforce Age':  return targetKpis.averageAge;
      case 'Average Tenure':         return targetKpis.averageTenure;
      case 'Overtime Rate':          return targetKpis.overtimeRate;
      case 'Avg Job Satisfaction':   return targetKpis.averageJobSatisfaction;
      default:                       return 0;
    }
  };

  /* ── Delta formatting ── */

  const formatDelta = (absDiff: number, meta: CardMeta): string => {
    if (meta.isCurrency) return `$${absDiff.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (meta.isInteger)  return absDiff.toLocaleString();
    if (meta.isRate)     return `${absDiff.toFixed(1)} pp`;
    return absDiff.toFixed(meta.unit === 'yrs' ? 1 : 2);
  };

  const unitSuffix = (meta: CardMeta): string => {
    if (meta.isRate || meta.isCurrency || !meta.unit) return '';
    return ` ${meta.unit}`;
  };

  /* ── Composition helpers (total-pool share) ── */

  const totalPoolSize = allRecords.length;

  const getCompositionShares = (valA: number, valB: number) => {
    const other = Math.max(0, totalPoolSize - valA - valB);
    const pctA = totalPoolSize > 0 ? (valA / totalPoolSize * 100) : 0;
    const pctB = totalPoolSize > 0 ? (valB / totalPoolSize * 100) : 0;
    const pctO = totalPoolSize > 0 ? (other / totalPoolSize * 100) : 0;
    return { other, pctA, pctB, pctO };
  };

  /* ── Render helpers ── */

  const labelA = report.periodALabel || 'Group A';
  const labelB = report.periodBLabel || 'Group B';

  const renderComparisonCards = (kpisA: OverallKPIs, kpisB: OverallKPIs) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {report.selectedKPIs.map((kpiTitle) => {
          const meta = CARD_TAXONOMY[kpiTitle] || DEFAULT_META;
          const valA = getKPIRaw(kpiTitle, kpisA);
          const valB = getKPIRaw(kpiTitle, kpisB);
          const diff = valB - valA;
          const absDiff = Math.abs(diff);
          const isZero = absDiff < 0.01;
          const formattedDelta = formatDelta(absDiff, meta);
          const suffix = unitSuffix(meta);

          // Which group is higher?
          const higherLabel = diff > 0 ? labelB : labelA;

          if (meta.category === 'composition') {
            return renderCompositionCard(kpiTitle, meta, kpisA, kpisB, valA, valB, diff, absDiff, isZero, formattedDelta, suffix, higherLabel);
          }
          if (meta.category === 'directional') {
            return renderDirectionalCard(kpiTitle, meta, kpisA, kpisB, valA, valB, diff, absDiff, isZero, formattedDelta, suffix, higherLabel);
          }
          return renderNeutralCard(kpiTitle, meta, kpisA, kpisB, valA, valB, diff, absDiff, isZero, formattedDelta, suffix, higherLabel);
        })}
      </div>
    );
  };

  /* ── COMPOSITION CARD ── */
  const renderCompositionCard = (
    kpiTitle: string, meta: CardMeta,
    kpisA: OverallKPIs, kpisB: OverallKPIs,
    valA: number, valB: number,
    diff: number, absDiff: number, isZero: boolean,
    formattedDelta: string, suffix: string, higherLabel: string,
  ) => {
    const { pctA, pctB, pctO } = getCompositionShares(valA, valB);

    return (
      <div key={kpiTitle} className="p-3.5 bg-navy-50/40 rounded-lg border border-navy-100 break-inside-avoid">
        {/* Title */}
        <div className="text-[10px] font-bold text-navy-500 uppercase tracking-wide mb-2">{kpiTitle}</div>

        {/* Primary values */}
        <div className="flex items-end gap-4 mb-2.5">
          <div>
            <div className="text-[9px] text-navy-400 font-semibold">{labelA}</div>
            <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisA)}</div>
          </div>
          <div className="text-navy-300 font-bold text-xs pb-0.5">vs</div>
          <div>
            <div className="text-[9px] text-navy-400 font-semibold">{labelB}</div>
            <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisB)}</div>
          </div>
        </div>

        {/* Neutral delta badge */}
        <div className="flex items-center gap-2 mb-2">
          {!isZero ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-400">Δ</span> {formattedDelta}{suffix}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-400">
              No difference
            </span>
          )}
          {!isZero && (
            <span className="text-[9px] text-slate-500 font-medium">
              {higherLabel} +{formattedDelta}
            </span>
          )}
        </div>

        {/* Composition proportion bar */}
        <div className="space-y-1">
          <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            <div
              className="bg-blue-400/80 transition-all"
              style={{ width: `${pctA}%` }}
              title={`${labelA}: ${pctA.toFixed(1)}%`}
            />
            <div
              className="bg-indigo-500/80 transition-all"
              style={{ width: `${pctB}%` }}
              title={`${labelB}: ${pctB.toFixed(1)}%`}
            />
            {pctO > 0.5 && (
              <div
                className="bg-slate-300/80 transition-all"
                style={{ width: `${pctO}%` }}
                title={`Other: ${pctO.toFixed(1)}%`}
              />
            )}
          </div>
          <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400/80" />
              {labelA} {pctA.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500/80" />
              {labelB} {pctB.toFixed(0)}%
            </span>
            {pctO > 0.5 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300/80" />
                Other {pctO.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── NEUTRAL CARD ── */
  const renderNeutralCard = (
    kpiTitle: string, meta: CardMeta,
    kpisA: OverallKPIs, kpisB: OverallKPIs,
    valA: number, valB: number,
    diff: number, absDiff: number, isZero: boolean,
    formattedDelta: string, suffix: string, higherLabel: string,
  ) => {
    return (
      <div key={kpiTitle} className="p-3.5 bg-navy-50/40 rounded-lg border border-navy-100 flex items-center justify-between break-inside-avoid">
        <div>
          <div className="text-[10px] font-bold text-navy-500 uppercase tracking-wide mb-2">{kpiTitle}</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-[9px] text-navy-400 font-semibold">{labelA}</div>
              <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisA)}</div>
            </div>
            <div className="text-navy-300 font-bold text-xs pb-0.5">vs</div>
            <div>
              <div className="text-[9px] text-navy-400 font-semibold">{labelB}</div>
              <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisB)}</div>
            </div>
          </div>
        </div>

        {/* Neutral delta — no color, no arrow */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {!isZero ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600">
                <span className="text-slate-400">Δ</span> {formattedDelta}{suffix}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {higherLabel} +{meta.prefix || ''}{formattedDelta}{suffix}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-400">
              No difference
            </span>
          )}
        </div>
      </div>
    );
  };

  /* ── DIRECTIONAL / PERFORMANCE CARD ── */
  const renderDirectionalCard = (
    kpiTitle: string, meta: CardMeta,
    kpisA: OverallKPIs, kpisB: OverallKPIs,
    valA: number, valB: number,
    diff: number, absDiff: number, isZero: boolean,
    formattedDelta: string, suffix: string, higherLabel: string,
  ) => {
    // Determine if the delta is favorable, unfavorable, or zero
    let sentiment: 'favorable' | 'unfavorable' | 'neutral' = 'neutral';
    if (!isZero) {
      if (meta.favorableDirection === 'lower') {
        // Lower is better → if B is higher than A, that's unfavorable
        sentiment = diff > 0 ? 'unfavorable' : 'favorable';
      } else {
        // Higher is better → if B is higher than A, that's favorable
        sentiment = diff > 0 ? 'favorable' : 'unfavorable';
      }
    }

    const badgeClasses = {
      favorable:   'bg-emerald-50 border-emerald-200 text-emerald-700',
      unfavorable: 'bg-rose-50 border-rose-200 text-rose-700',
      neutral:     'bg-slate-50 border-slate-200 text-slate-500',
    }[sentiment];

    const dotColor = {
      favorable:   'bg-emerald-500',
      unfavorable: 'bg-rose-500',
      neutral:     'bg-slate-400',
    }[sentiment];

    // For rate differences: show which group has the worse value
    const worseLabel = meta.favorableDirection === 'lower'
      ? (diff > 0 ? labelB : labelA)
      : (diff > 0 ? labelA : labelB);

    return (
      <div key={kpiTitle} className="p-3.5 bg-navy-50/40 rounded-lg border border-navy-100 flex items-center justify-between break-inside-avoid">
        <div>
          <div className="text-[10px] font-bold text-navy-500 uppercase tracking-wide mb-2">{kpiTitle}</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-[9px] text-navy-400 font-semibold">{labelA}</div>
              <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisA)}</div>
            </div>
            <div className="text-navy-300 font-bold text-xs pb-0.5">vs</div>
            <div>
              <div className="text-[9px] text-navy-400 font-semibold">{labelB}</div>
              <div className="text-lg font-extrabold text-navy-900 leading-tight">{getKPIFormatted(kpiTitle, kpisB)}</div>
            </div>
          </div>
        </div>

        {/* Directional delta — semantic color */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {!isZero ? (
            <>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-semibold ${badgeClasses}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
                {higherLabel} +{formattedDelta}
              </span>
              {sentiment === 'unfavorable' && (
                <span className="text-[9px] text-rose-400 font-medium">
                  Unfavorable
                </span>
              )}
              {sentiment === 'favorable' && (
                <span className="text-[9px] text-emerald-400 font-medium">
                  Favorable
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-400">
              No difference
            </span>
          )}
        </div>
      </div>
    );
  };

  /* ─────────────── RENDER ─────────────── */

  return (
    <div className="space-y-6">

      {/* Top Action Bar */}
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

        {/* Reporting Context */}
        <div className="bg-navy-50/70 rounded-lg p-4 border border-navy-100 text-xs break-inside-avoid">
          <div className="font-bold text-navy-900 uppercase tracking-wider mb-2 text-[11px]">
            Reporting Context &amp; Filters Applied:
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

        {/* Key Metrics / Period Comparison */}
        {report.selectedKPIs.length > 0 && (
          <div className="space-y-3 break-inside-avoid">
            <div className="flex items-center justify-between border-b pb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                {report.enableComparison ? 'Comparative Metrics' : 'Key Metrics'}
              </h2>
              {report.enableComparison && (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {labelA} vs {labelB}
                  </span>
                  {report.comparisonMode === 'date' && report.dateRangeA && report.dateRangeB && (
                    <span className="text-[9px] text-navy-400 font-medium">
                      {report.dateRangeA.start} → {report.dateRangeA.end} &nbsp;|&nbsp; {report.dateRangeB.start} → {report.dateRangeB.end}
                    </span>
                  )}
                  {report.comparisonMode === 'cohort' && (
                    <span className="text-[9px] text-navy-400 font-medium">
                      Segment comparison · stat difference
                    </span>
                  )}
                </div>
              )}
            </div>

            {report.enableComparison && report.kpisA && report.kpisB ? (
              <div className="space-y-2">
                {renderComparisonCards(report.kpisA, report.kpisB)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.selectedKPIs.map((kpiTitle) => (
                  <div key={kpiTitle} className="p-3 bg-navy-50/50 rounded-lg border border-navy-100 text-center break-inside-avoid">
                    <div className="text-[10px] font-bold text-navy-500 uppercase">{kpiTitle}</div>
                    <div className="text-xl font-extrabold text-navy-950 mt-1">
                      {getKPIFormatted(kpiTitle)}
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

        {/* Observations & Commentary */}
        <div className="space-y-2 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b pb-1">
            Observations &amp; Commentary
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
