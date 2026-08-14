'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { CustomReport } from '@/types/hr';
import ReportPreview from './ReportPreview';
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Printer,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

export default function ReportBuilder() {
  const {
    customReports,
    saveReport,
    deleteReport,
    filterState,
    dataSourceMode,
    kpis,
  } = useHR();

  const [activeReport, setActiveReport] = useState<CustomReport | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Form State
  const [title, setTitle] = useState('Executive HR Analytics Report');
  const [executiveSummary, setExecutiveSummary] = useState(
    `This report summarizes key workforce indicators, attrition risks, and compensation insights based on the active dataset.`
  );
  const [commentary, setCommentary] = useState(
    `Key Observations:\n1. Attrition rate is currently at ${kpis.attritionRate}% across the evaluated headcount.\n2. Overtime working hours continue to show a strong correlation with departure likelihood.\n3. Compensation review is recommended for job roles with elevated tenure and delayed promotion intervals.`
  );

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

  const handleCreateNewReport = () => {
    const newReport: CustomReport = {
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
    };

    saveReport(newReport);
    setActiveReport(newReport);
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
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-navy-900">Session Report Builder</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Build print-ready management reports with customized metrics, visual charts, and executive commentary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPreviewMode ? (
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-3.5 py-1.5 rounded-lg border border-navy-200 text-navy-800 font-semibold text-xs hover:bg-navy-50 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-navy-600" />
              <span>Edit Report Configuration</span>
            </button>
          ) : (
            <button
              onClick={handleCreateNewReport}
              className="px-4 py-1.5 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Saved Session Reports Column */}
          <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs h-fit space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <h3 className="text-sm font-bold text-navy-900">Saved Reports (Session)</h3>
              <span className="text-xs text-navy-500 font-medium">
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
                        ? 'bg-brand-50 border-brand-300 text-brand-950 font-semibold'
                        : 'border-navy-100 hover:bg-navy-50 text-navy-800'
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
                      <div className="text-[10px] text-navy-500 mt-0.5">{rpt.createdAt}</div>
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
                <div className="text-xs text-navy-400 italic py-4 text-center">
                  No saved reports in current session. Fill out the form and generate your first management report.
                </div>
              )}
            </div>
          </div>

          {/* Report Configuration Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-6 shadow-xs space-y-5 text-xs">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 block text-xs">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-navy-900 font-semibold focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 block text-xs">Executive Summary</label>
              <textarea
                rows={2}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-navy-900 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Select KPIs */}
            <div className="space-y-2">
              <label className="font-bold text-navy-900 block text-xs">
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
                          ? 'bg-brand-50 border-brand-300 text-brand-900 font-semibold'
                          : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                      }`}
                    >
                      <span className="text-[11px]">{kpi}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Visualizations */}
            <div className="space-y-2">
              <label className="font-bold text-navy-900 block text-xs">
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
                          ? 'bg-brand-50 border-brand-300 text-brand-900 font-semibold'
                          : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                      }`}
                    >
                      <span className="text-[11px]">{chart}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commentary */}
            <div className="space-y-1.5">
              <label className="font-bold text-navy-900 block text-xs">Observations & Managerial Commentary</label>
              <textarea
                rows={4}
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-navy-900 font-mono text-[11px] focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Generate Button */}
            <div className="pt-3 border-t border-navy-100 flex justify-end">
              <button
                onClick={handleCreateNewReport}
                className="px-5 py-2.5 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-bold flex items-center gap-2 shadow-sm"
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
