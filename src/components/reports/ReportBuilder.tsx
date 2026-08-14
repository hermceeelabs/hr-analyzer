'use client';

import React, { useState, useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { CustomReport, EmployeeRecord } from '@/types/hr';
import ReportPreview from './ReportPreview';
import {
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { calculateOverallKPIs, applyFilters } from '@/lib/analytics/engine';
import { evaluateRuleInsights, DEFAULT_PROMOTION_CONFIG, PromotionRuleConfig } from '@/lib/analytics/rules';

export default function ReportBuilder() {
  const {
    customReports,
    saveReport,
    deleteReport,
    filterState,
    dataSourceMode,
    allRecords,
    filteredRecords,
    kpis,
  } = useHR();

  const [activeReport, setActiveReport] = useState<CustomReport | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Period / Cohort Comparison State
  const [enableComparison, setEnableComparison] = useState(false);
  const [periodAFilter, setPeriodAFilter] = useState<'All' | 'Sales' | 'Research & Development' | 'Human Resources'>('Sales');
  const [periodBFilter, setPeriodBFilter] = useState<'All' | 'Sales' | 'Research & Development' | 'Human Resources'>('Research & Development');
  const [periodALabel, setPeriodALabel] = useState('Sales Dept');
  const [periodBLabel, setPeriodBLabel] = useState('R&D Dept');

  // Promotion Rule Config
  const [promoConfig, setPromoConfig] = useState<PromotionRuleConfig>(DEFAULT_PROMOTION_CONFIG);

  // Form State
  const [title, setTitle] = useState('Executive HR Analytics Report');
  const [executiveSummary, setExecutiveSummary] = useState(
    `This report summarizes key workforce indicators, attrition risks, and compensation insights based on the active dataset.`
  );

  // Dynamically compute rule-based empirical insights for current dataset
  const empiricalInsights = evaluateRuleInsights(filteredRecords, kpis);
  const defaultCommentary = empiricalInsights.length > 0
    ? `Empirical Observations (Computed Engine):\n` + empiricalInsights.map((ins, i) => `${i + 1}. [${ins.confidence} Confidence] ${ins.statement}`).join('\n')
    : `Key Observations:\n1. Attrition rate is currently at ${kpis.attritionRate}% across evaluated headcount.\n2. Sample size requires additional data points for high-confidence correlation.`;

  const [commentary, setCommentary] = useState(defaultCommentary);

  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([
    'Total Headcount',
    'Active Employees',
    'Attrition Rate',
    'Average Monthly Income',
    'Average Tenure',
  ]);

  const [selectedCharts, setSelectedCharts] = useState<string[]>([
    'Department Breakdown',
    'Attrition by Department',
    'Attrition by Overtime',
    'Salary by Department',
  ]);

  const availableKPIs = [
    'Total Headcount',
    'Active Employees',
    'Attrition Rate',
    'Average Monthly Income',
    'Average Workforce Age',
    'Average Tenure',
    'Overtime Rate',
    'Avg Job Satisfaction',
  ];

  const availableCharts = [
    'Department Breakdown',
    'Job Role Breakdown',
    'Attrition by Department',
    'Attrition by Overtime',
    'Attrition by Job Level',
    'Salary by Department',
    'Salary Hike by Performance',
    'Satisfaction Overview',
    'Career & Promotion Review',
  ];

  // Calculated Period Comparisons
  const recordsA = useMemo(() => {
    if (!enableComparison || periodAFilter === 'All') return allRecords;
    return allRecords.filter(r => r.department === periodAFilter);
  }, [allRecords, enableComparison, periodAFilter]);

  const recordsB = useMemo(() => {
    if (!enableComparison || periodBFilter === 'All') return allRecords;
    return allRecords.filter(r => r.department === periodBFilter);
  }, [allRecords, enableComparison, periodBFilter]);

  const kpisA = useMemo(() => calculateOverallKPIs(recordsA), [recordsA]);
  const kpisB = useMemo(() => calculateOverallKPIs(recordsB), [recordsB]);

  const handleCreateNewReport = () => {
    const newReport: CustomReport & {
      enableComparison?: boolean;
      periodALabel?: string;
      periodBLabel?: string;
      kpisA?: typeof kpis;
      kpisB?: typeof kpis;
      recordsA?: EmployeeRecord[];
      recordsB?: EmployeeRecord[];
      empiricalInsights?: typeof empiricalInsights;
    } = {
      id: `report-${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      filters: { ...filterState },
      selectedKPIs: [...selectedKPIs],
      selectedCharts: [...selectedCharts],
      executiveSummary,
      commentary,
      dataSource: dataSourceMode,
      enableComparison,
      periodALabel: enableComparison ? periodALabel : undefined,
      periodBLabel: enableComparison ? periodBLabel : undefined,
      kpisA: enableComparison ? kpisA : undefined,
      kpisB: enableComparison ? kpisB : undefined,
      recordsA: enableComparison ? recordsA : undefined,
      recordsB: enableComparison ? recordsB : undefined,
      empiricalInsights,
    };

    saveReport(newReport as any);
    setActiveReport(newReport as any);
    setIsPreviewMode(true);
  };

  const toggleKPI = (kpi: string) => {
    setSelectedKPIs((prev) =>
      prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
    );
  };

  const toggleChart = (chart: string) => {
    setSelectedCharts((prev) =>
      prev.includes(chart) ? prev.filter((item) => item !== chart) : [...prev, chart]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Marked print:hidden */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Session Report Builder</h2>
          </div>
          <p className="text-xs text-navy-500 dark:text-slate-400 mt-1">
            Build print-ready management reports with empirical rule-based insights, period comparison, customized metrics, and visual charts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPreviewMode ? (
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-3.5 py-1.5 rounded-lg border border-navy-200 dark:border-slate-700 text-navy-800 dark:text-slate-200 font-semibold text-xs hover:bg-navy-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-navy-600 dark:text-slate-400" />
              <span>Edit Report Configuration</span>
            </button>
          ) : (
            <button
              onClick={handleCreateNewReport}
              className="px-4 py-1.5 rounded-lg bg-brand-900 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Generate & Preview Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Builder Form vs Report Preview */}
      {isPreviewMode && activeReport ? (
        <ReportPreview report={activeReport} onEdit={() => setIsPreviewMode(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          
          {/* Saved Session Reports Column */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs h-fit space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-navy-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-navy-900 dark:text-white">Saved Reports (Session)</h3>
              <span className="text-xs text-navy-500 dark:text-slate-400 font-medium">
                {customReports.length} saved
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {customReports.length > 0 ? (
                customReports.map((rpt) => (
                  <div
                    key={rpt.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      activeReport?.id === rpt.id
                        ? 'bg-brand-50 dark:bg-slate-800 border-brand-300 dark:border-brand-500 text-brand-950 dark:text-white font-semibold'
                        : 'border-navy-100 dark:border-slate-800 hover:bg-navy-50 dark:hover:bg-slate-800/60 text-navy-800 dark:text-slate-300'
                    }`}
                    onClick={() => {
                      setActiveReport(rpt);
                      setTitle(rpt.title);
                      setExecutiveSummary(rpt.executiveSummary);
                      setCommentary(rpt.commentary);
                      setSelectedKPIs(rpt.selectedKPIs);
                      setSelectedCharts(rpt.selectedCharts);
                      setIsPreviewMode(true);
                    }}
                  >
                    <div>
                      <div className="font-bold">{rpt.title}</div>
                      <div className="text-[10px] text-navy-500 dark:text-slate-400 mt-0.5">{rpt.createdAt}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(rpt.id);
                        if (activeReport?.id === rpt.id) setActiveReport(null);
                      }}
                      className="p-1 text-navy-400 hover:text-rose-600 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-navy-400 dark:text-slate-500 italic py-4 text-center">
                  No saved reports in current session. Fill out the form and generate your first management report.
                </div>
              )}
            </div>
          </div>

          {/* Report Configuration Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-6 shadow-xs space-y-5 text-xs transition-colors duration-200">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 dark:text-slate-200 block text-xs">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-navy-900 font-semibold focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Period / Department Comparison Section */}
            <div className="p-4 rounded-xl border border-brand-200 dark:border-slate-800 bg-brand-50/40 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-navy-900 dark:text-white text-xs">
                  <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Comparative Period / Segment Analysis</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-900 dark:text-brand-300">
                  <input
                    type="checkbox"
                    checked={enableComparison}
                    onChange={(e) => setEnableComparison(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Enable Period/Cohort Comparison</span>
                </label>
              </div>

              {enableComparison && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-200/60 dark:border-slate-700">
                  <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-navy-200 dark:border-slate-800">
                    <label className="font-bold text-navy-900 dark:text-slate-200 block text-[11px]">Primary Group (Cohort A)</label>
                    <input
                      type="text"
                      value={periodALabel}
                      onChange={(e) => setPeriodALabel(e.target.value)}
                      placeholder="Label e.g. Q1 2026 or Sales"
                      className="w-full px-2.5 py-1.5 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded text-xs"
                    />
                    <select
                      value={periodAFilter}
                      onChange={(e) => setPeriodAFilter(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded text-xs font-semibold"
                    >
                      <option value="All">All Departments</option>
                      <option value="Sales">Sales</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>

                  <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-navy-200 dark:border-slate-800">
                    <label className="font-bold text-navy-900 dark:text-slate-200 block text-[11px]">Comparison Group (Cohort B)</label>
                    <input
                      type="text"
                      value={periodBLabel}
                      onChange={(e) => setPeriodBLabel(e.target.value)}
                      placeholder="Label e.g. Q2 2026 or R&D"
                      className="w-full px-2.5 py-1.5 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded text-xs"
                    />
                    <select
                      value={periodBFilter}
                      onChange={(e) => setPeriodBFilter(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded text-xs font-semibold"
                    >
                      <option value="All">All Departments</option>
                      <option value="Sales">Sales</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Promotion Threshold Rule Settings */}
            <div className="p-4 rounded-xl border border-navy-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 space-y-3">
              <div className="flex items-center gap-2 font-bold text-navy-900 dark:text-white text-xs">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Configurable Rule Engine Thresholds</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <label className="font-semibold text-navy-700 dark:text-slate-300 block mb-1">
                    Min Tenure Years (Promotion Rule): {promoConfig.minTenureYears} yrs
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={promoConfig.minTenureYears}
                    onChange={(e) => setPromoConfig((p) => ({ ...p, minTenureYears: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-navy-700 dark:text-slate-300 block mb-1">
                    Min Delay Since Promotion: {promoConfig.minYearsSincePromotion} yrs
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={promoConfig.minYearsSincePromotion}
                    onChange={(e) => setPromoConfig((p) => ({ ...p, minYearsSincePromotion: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 dark:text-slate-200 block text-xs">Executive Summary</label>
              <textarea
                rows={2}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-navy-900 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Select KPIs */}
            <div className="space-y-2">
              <label className="font-bold text-navy-900 dark:text-slate-200 block text-xs">
                Select Key Metrics to Include ({selectedKPIs.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableKPIs.map((kpi) => {
                  const isChecked = selectedKPIs.includes(kpi);
                  return (
                    <button
                      type="button"
                      key={kpi}
                      onClick={() => toggleKPI(kpi)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-brand-50 dark:bg-slate-800 border-brand-300 dark:border-brand-500 text-brand-900 dark:text-white font-semibold'
                          : 'border-navy-200 dark:border-slate-700 text-navy-600 dark:text-slate-400 hover:bg-navy-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-[11px]">{kpi}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Visualizations */}
            <div className="space-y-2">
              <label className="font-bold text-navy-900 dark:text-slate-200 block text-xs">
                Select Visualizations to Include ({selectedCharts.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableCharts.map((chart) => {
                  const isChecked = selectedCharts.includes(chart);
                  return (
                    <button
                      type="button"
                      key={chart}
                      onClick={() => toggleChart(chart)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-brand-50 dark:bg-slate-800 border-brand-300 dark:border-brand-500 text-brand-900 dark:text-white font-semibold'
                          : 'border-navy-200 dark:border-slate-700 text-navy-600 dark:text-slate-400 hover:bg-navy-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-[11px]">{chart}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commentary */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 dark:text-slate-200 block text-xs">Empirical Observations & Managerial Commentary</label>
              <textarea
                rows={4}
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-navy-900 font-mono text-[11px] focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Generate Button */}
            <div className="pt-3 border-t border-navy-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleCreateNewReport}
                className="px-5 py-2.5 rounded-lg bg-brand-900 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Generate Management Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
