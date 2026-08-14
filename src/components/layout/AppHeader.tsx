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
  Loader2,
} from 'lucide-react';

export default function AppHeader() {
  const {
    dataSourceMode,
    clearUploadedData,
    dbError,
    isRlsBlocked,
    isLoading,
    allRecords,
    filteredRecords,
  } = useHR();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-navy-100 sticky top-0 z-30 shadow-sm shrink-0">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Title + record count */}
          <div>
            <h1 className="text-lg font-bold text-navy-900 leading-tight tracking-tight">
              HR Analytics
            </h1>
            <p className="text-[11px] text-navy-500 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-brand-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading data…
                </span>
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-navy-800">{filteredRecords.length}</span> of{' '}
                  <span className="font-semibold text-navy-800">{allRecords.length}</span> employee records
                </>
              )}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* Data Source Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-colors ${
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
                  <span>Demo DB</span>
                  {dbError || isRlsBlocked ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Uploaded Dataset</span>
                </>
              )}
            </div>

            {/* Return to Demo DB */}
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

            {/* Download Template Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-200 bg-white text-navy-800 hover:bg-navy-50 text-xs font-semibold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-navy-600" />
                <span>Template</span>
                <ChevronDown className="w-3 h-3 text-navy-400" />
              </button>

              {isTemplateDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-navy-200 rounded-lg shadow-lg py-1 z-50 text-xs"
                  onMouseLeave={() => setIsTemplateDropdownOpen(false)}
                >
                  <button
                    onClick={() => { downloadHRTemplateCSV(); setIsTemplateDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-navy-700 hover:bg-brand-50 hover:text-brand-900 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download CSV Template</span>
                  </button>
                  <button
                    onClick={() => { downloadHRTemplateXLSX(); setIsTemplateDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-navy-700 hover:bg-brand-50 hover:text-brand-900 flex items-center gap-2 border-t border-navy-100"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Excel (XLSX)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Dataset */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
    </header>
  );
}
