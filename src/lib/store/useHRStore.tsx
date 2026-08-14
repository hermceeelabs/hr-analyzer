'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  EmployeeRecord,
  EmployeeRawRecord,
  HRFilterState,
  DataSourceMode,
  CustomReport,
  DataQualityMetrics,
  OverallKPIs,
} from '@/types/hr';
import { fetchSupabaseEmployees } from '@/lib/supabase/employees';
import { normalizeRawDataset } from '@/lib/analytics/normalize';
import { applyFilters, calculateOverallKPIs } from '@/lib/analytics/engine';
import { computeDataQualityMetrics } from '@/lib/analytics/validation';

export const INITIAL_FILTERS: HRFilterState = {
  department: 'All',
  jobRole: 'All',
  jobLevel: 'All',
  gender: 'All',
  ageGroup: 'All',
  maritalStatus: 'All',
  educationField: 'All',
  businessTravel: 'All',
  overTime: 'All',
  salarySlab: 'All',
  attrition: 'All',
  searchQuery: '',
};

interface HRContextType {
  dataSourceMode: DataSourceMode;
  setDataSourceMode: (mode: DataSourceMode) => void;
  rawDemoRecords: EmployeeRawRecord[];
  rawUploadedRecords: EmployeeRawRecord[];
  allRecords: EmployeeRecord[];
  filteredRecords: EmployeeRecord[];
  filterState: HRFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<HRFilterState>>;
  resetFilters: () => void;
  isLoading: boolean;
  dbError: string | null;
  isRlsBlocked: boolean;
  activeTab: 'dashboard' | 'employees' | 'reports' | 'quality';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'reports' | 'quality') => void;
  activeAnalyticsSubTab: string;
  setActiveAnalyticsSubTab: (sub: string) => void;
  customReports: CustomReport[];
  saveReport: (report: CustomReport) => void;
  deleteReport: (id: string) => void;
  handleFileUpload: (records: EmployeeRecord[], raw: EmployeeRawRecord[]) => void;
  clearUploadedData: () => void;
  refetchDemoData: () => Promise<void>;
  kpis: OverallKPIs;
  dataQuality: DataQualityMetrics;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [dataSourceMode, setDataSourceMode] = useState<DataSourceMode>('demo');
  const [rawDemoRecords, setRawDemoRecords] = useState<EmployeeRawRecord[]>([]);
  const [rawUploadedRecords, setRawUploadedRecords] = useState<EmployeeRawRecord[]>([]);
  const [uploadedRecords, setUploadedRecords] = useState<EmployeeRecord[]>([]);
  const [demoRecords, setDemoRecords] = useState<EmployeeRecord[]>([]);

  const [filterState, setFilterState] = useState<HRFilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isRlsBlocked, setIsRlsBlocked] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'reports' | 'quality'>('dashboard');
  const [activeAnalyticsSubTab, setActiveAnalyticsSubTab] = useState<string>('overview');

  const [customReports, setCustomReports] = useState<CustomReport[]>([]);

  // Load Demo Data from Supabase
  const loadDemoData = useCallback(async () => {
    setIsLoading(true);
    setDbError(null);
    setIsRlsBlocked(false);

    const result = await fetchSupabaseEmployees();

    if (result.error) {
      setDbError(result.error);
      setRawDemoRecords([]);
      setDemoRecords([]);
    } else if (result.data) {
      setRawDemoRecords(result.data);
      const normalized = normalizeRawDataset(result.data);
      setDemoRecords(normalized);
      setIsRlsBlocked(result.isRlsBlocked || false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDemoData();
  }, [loadDemoData]);

  // Active records depending on Data Source Mode
  const allRecords = useMemo(() => {
    return dataSourceMode === 'demo' ? demoRecords : uploadedRecords;
  }, [dataSourceMode, demoRecords, uploadedRecords]);

  const rawActiveRecords = useMemo(() => {
    return dataSourceMode === 'demo' ? rawDemoRecords : rawUploadedRecords;
  }, [dataSourceMode, rawDemoRecords, rawUploadedRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return applyFilters(allRecords, filterState);
  }, [allRecords, filterState]);

  // KPIs
  const kpis = useMemo(() => {
    return calculateOverallKPIs(filteredRecords);
  }, [filteredRecords]);

  // Data Quality Metrics
  const dataQuality = useMemo(() => {
    return computeDataQualityMetrics(rawActiveRecords);
  }, [rawActiveRecords]);

  const resetFilters = useCallback(() => {
    setFilterState(INITIAL_FILTERS);
  }, []);

  const handleFileUpload = useCallback((records: EmployeeRecord[], raw: EmployeeRawRecord[]) => {
    setUploadedRecords(records);
    setRawUploadedRecords(raw);
    setDataSourceMode('uploaded');
    setFilterState(INITIAL_FILTERS);
  }, []);

  const clearUploadedData = useCallback(() => {
    setUploadedRecords([]);
    setRawUploadedRecords([]);
    setDataSourceMode('demo');
    setFilterState(INITIAL_FILTERS);
  }, []);

  const saveReport = useCallback((report: CustomReport) => {
    setCustomReports((prev) => {
      const idx = prev.findIndex((r) => r.id === report.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = report;
        return next;
      }
      return [report, ...prev];
    });
  }, []);

  const deleteReport = useCallback((id: string) => {
    setCustomReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = {
    dataSourceMode,
    setDataSourceMode,
    rawDemoRecords,
    rawUploadedRecords,
    allRecords,
    filteredRecords,
    filterState,
    setFilterState,
    resetFilters,
    isLoading,
    dbError,
    isRlsBlocked,
    activeTab,
    setActiveTab,
    activeAnalyticsSubTab,
    setActiveAnalyticsSubTab,
    customReports,
    saveReport,
    deleteReport,
    handleFileUpload,
    clearUploadedData,
    refetchDemoData: loadDemoData,
    kpis,
    dataQuality,
  };

  return <HRContext.Provider value={value}>{children}</HRContext.Provider>;
}

export function useHR() {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
}
