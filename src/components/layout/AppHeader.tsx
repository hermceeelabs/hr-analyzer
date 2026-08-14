'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { useTheme, ACCENT_PRESETS } from '@/lib/theme/ThemeProvider';
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
  Sun,
  Moon,
  Palette,
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

  const { isDark, toggleDark, accentHex, setAccentHex } = useTheme();

  const [isUploadModalOpen, setIsUploadModalOpen]     = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateOpen]   = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen]       = useState(false);
  const themePanelRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Close theme panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) {
        setIsThemePanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    /*
      The header is sticky at the top of the right column.
      Its INNER wrapper uses the same max-width + padding as the
      content area below it, so everything lines up perfectly.
    */
    <header className="sticky top-0 z-30 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* ── Left: title + record count ── */}
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              HR Analytics
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading data…
                </span>
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredRecords.length.toLocaleString()}</span>
                  {' '}of{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{allRecords.length.toLocaleString()}</span>
                  {' '}employee records
                </>
              )}
            </p>
          </div>

          {/* ── Right: controls ── */}
          <div className="flex items-center gap-2">

            {/* Data Source Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                dataSourceMode === 'demo'
                  ? dbError || isRlsBlocked
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700'
                  : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700'
              }`}
            >
              {dataSourceMode === 'demo' ? (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Demo DB</span>
                  {dbError || isRlsBlocked
                    ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  }
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Demo DB</span>
              </button>
            )}

            {/* Download Template */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateOpen(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Template</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isTemplateDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setIsTemplateOpen(false)}
                >
                  <button
                    onClick={() => { downloadHRTemplateCSV(); setIsTemplateOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download CSV Template</span>
                  </button>
                  <button
                    onClick={() => { downloadHRTemplateXLSX(); setIsTemplateOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Download Excel (XLSX)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Dataset */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold transition-all shadow-sm"
              style={{ backgroundColor: accentHex }}
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Dataset</span>
            </button>

            {/* ─── Theme Panel ─────────────────────────────── */}
            <div className="relative" ref={themePanelRef}>
              <button
                onClick={() => setIsThemePanelOpen(v => !v)}
                title="Theme settings"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Palette className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              </button>

              {isThemePanelOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4">

                  {/* Dark / Light toggle */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Mode
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { if (isDark) toggleDark(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          !isDark
                            ? 'border-transparent text-white shadow'
                            : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        style={!isDark ? { backgroundColor: accentHex } : {}}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        Light
                      </button>
                      <button
                        onClick={() => { if (!isDark) toggleDark(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          isDark
                            ? 'border-transparent text-white shadow'
                            : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        style={isDark ? { backgroundColor: accentHex } : {}}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* Accent colour presets */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Accent Colour
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {ACCENT_PRESETS.map(preset => (
                        <button
                          key={preset.hex}
                          title={preset.name}
                          onClick={() => setAccentHex(preset.hex)}
                          className="w-9 h-9 rounded-lg transition-all hover:scale-110 focus:outline-none relative"
                          style={{ backgroundColor: preset.hex }}
                        >
                          {accentHex === preset.hex && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-2 h-2 bg-white rounded-full shadow" />
                            </span>
                          )}
                        </button>
                      ))}
                      {/* Custom colour picker */}
                      <button
                        title="Custom colour"
                        onClick={() => colorInputRef.current?.click()}
                        className="w-9 h-9 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-slate-400 transition-all text-slate-400 text-[10px] font-bold"
                      >
                        +
                        <input
                          ref={colorInputRef}
                          type="color"
                          value={accentHex}
                          onChange={e => setAccentHex(e.target.value)}
                          className="sr-only"
                        />
                      </button>
                    </div>

                    {/* Current colour swatch */}
                    <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <div
                        className="w-6 h-6 rounded-md shadow-sm shrink-0"
                        style={{ backgroundColor: accentHex }}
                      />
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase">
                        {accentHex}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ─────────────────────────────────────────────── */}

          </div>
        </div>
      </div>

      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
    </header>
  );
}
