'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { downloadHRTemplateCSV, downloadHRTemplateXLSX } from '@/lib/analytics/template';
import UploadModal from '@/components/upload/UploadModal';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export default function AppHeader() {
  const {
    dataSourceMode,
    clearUploadedData,
    dbError,
    isRlsBlocked,
    allRecords,
    filteredRecords,
  } = useHR();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-navy-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-900 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                HR
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy-900 tracking-tight leading-tight">
                  HR Analytics
                </h1>
                <p className="text-xs font-medium text-navy-500">
                  Workforce Overview & Employee Insights
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Data Source Badge & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Data Source Mode Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-colors ${
                dataSourceMode === 'demo'
                  ? dbError || isRlsBlocked
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {dataSourceMode === 'demo' ? (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Data Source: Demo Database</span>
                  {dbError || isRlsBlocked ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 ml-1" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                  )}
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Data Source: Uploaded Dataset</span>
                </>
              )}
            </div>

            {/* Return to Demo DB if in Uploaded mode */}
            {dataSourceMode === 'uploaded' && (
              <button
                onClick={clearUploadedData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50 text-xs font-semibold transition-all shadow-xs"
                title="Return to Supabase Demo Database"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Demo DB</span>
              </button>
            )}

            {/* Download HR Template Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-200 bg-white text-navy-800 hover:bg-navy-50 text-xs font-semibold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-navy-600" />
                <span>Download Template</span>
                <ChevronDown className="w-3 h-3 text-navy-400" />
              </button>

              {isTemplateDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-navy-200 rounded-lg shadow-lg py-1 z-50 text-xs"
                  onMouseLeave={() => setIsTemplateDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      downloadHRTemplateCSV();
                      setIsTemplateDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-navy-700 hover:bg-brand-50 hover:text-brand-900 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download CSV Template</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadHRTemplateXLSX();
                      setIsTemplateDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-navy-700 hover:bg-brand-50 hover:text-brand-900 flex items-center gap-2 border-t border-navy-100"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Excel (XLSX)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Dataset Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
          </div>
        </div>

        {/* Record count summary bar */}
        <div className="mt-3 pt-3 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500 font-medium">
          <div>
            Showing <span className="font-semibold text-navy-900">{filteredRecords.length}</span> of{' '}
            <span className="font-semibold text-navy-900">{allRecords.length}</span> total employee records
          </div>
          {dbError && dataSourceMode === 'demo' && (
            <div className="text-amber-700 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{dbError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
    </header>
  );
}
