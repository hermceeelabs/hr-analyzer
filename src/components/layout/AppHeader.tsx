'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { useTheme, ACCENT_PRESETS } from '@/lib/theme/ThemeProvider';
import { downloadHRTemplateCSV, downloadHRTemplateXLSX } from '@/lib/analytics/template';
import UploadModal from '@/components/upload/UploadModal';
import { UserRole } from '@/types/qms';
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
  ShieldCheck,
  UserCheck,
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
    userRole,
    setUserRole,
  } = useHR();

  const { isDark, toggleDark, accentHex, setAccentHex } = useTheme();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateOpen] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const themePanelRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const roles: UserRole[] = [
    'Administrator',
    'HR Manager',
    'HR Officer',
    'Quality Manager',
    'Quality Reviewer',
    'Employee',
    'Auditor',
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) {
        setIsThemePanelOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 shrink-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg transition-colors duration-200">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Portal Title & Record Count */}
          <div>
            <h1 className="text-sm font-bold text-navy-950 dark:text-white leading-tight tracking-tight flex items-center gap-2">
              <span>Business Operations Portal</span>
              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300 px-2 py-0.5 rounded border border-brand-200/60">
                QMS &amp; HR
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading Portal Services…
                </span>
              ) : (
                <>
                  Active Records:{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{allRecords.length.toLocaleString()}</span>
                  {' '}employees •{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">50+</span> controlled documents
                </>
              )}
            </p>
          </div>

          {/* Right: Controls & RBAC Role Switcher */}
          <div className="flex items-center gap-2">

            {/* RBAC Role Switcher */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => setIsRoleDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-300 hover:bg-brand-100/60 text-xs font-bold transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-bold">{userRole}</span>
                <ChevronDown className="w-3 h-3 text-brand-500 shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs space-y-0.5">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                    Switch Active User Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        userRole === r
                          ? 'bg-brand-50 dark:bg-slate-700/80 font-bold text-brand-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span>{r}</span>
                      {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Data Source Badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors ${
                dataSourceMode === 'demo'
                  ? dbError || isRlsBlocked
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700'
                  : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700'
              }`}
            >
              {dataSourceMode === 'demo' ? (
                <>
                  <Database className="w-3 h-3" />
                  <span>Supabase Active</span>
                  {dbError || isRlsBlocked ? (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  )}
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>Uploaded Dataset</span>
                </>
              )}
            </div>

            {/* Download Template */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Templates</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isTemplateDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setIsTemplateOpen(false)}
                >
                  <button
                    onClick={() => {
                      downloadHRTemplateCSV();
                      setIsTemplateOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download CSV Template</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadHRTemplateXLSX();
                      setIsTemplateOpen(false);
                    }}
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white text-xs font-semibold transition-all shadow-sm"
              style={{ backgroundColor: accentHex }}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Theme Panel */}
            <div className="relative" ref={themePanelRef}>
              <button
                onClick={() => setIsThemePanelOpen((v) => !v)}
                title="Theme settings"
                className="flex items-center justify-center w-7 h-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Palette className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              </button>

              {isThemePanelOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Mode
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (isDark) toggleDark();
                        }}
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
                        onClick={() => {
                          if (!isDark) toggleDark();
                        }}
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

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Accent Colour
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {ACCENT_PRESETS.map((preset) => (
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
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
    </header>
  );
}
