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
import {
  PortalModule,
  HrSubTab,
  QmsSubTab,
  UserRole,
  QmsDocument,
  PortalTemplate,
  AuditLogEntry,
  EmployeeProfile,
  DocumentStatus,
} from '@/types/qms';
import { fetchSupabaseEmployees } from '@/lib/supabase/employees';
import { normalizeRawDataset } from '@/lib/analytics/normalize';
import { applyFilters, calculateOverallKPIs } from '@/lib/analytics/engine';
import { computeDataQualityMetrics } from '@/lib/analytics/validation';
import { MOCK_QMS_DOCUMENTS, MOCK_TEMPLATES, MOCK_AUDIT_LOGS } from '@/lib/data/mockQmsData';
import { generateEmployeeDirectory } from '@/lib/data/mockEmployeeDirectory';

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
  // Navigation & Role State
  activeModule: PortalModule;
  setActiveModule: (module: PortalModule) => void;
  activeHrSubTab: HrSubTab;
  setActiveHrSubTab: (tab: HrSubTab) => void;
  activeQmsSubTab: QmsSubTab;
  setActiveQmsSubTab: (tab: QmsSubTab) => void;

  // Legacy tab state compatibility
  activeTab: 'dashboard' | 'employees' | 'reports' | 'quality';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'reports' | 'quality') => void;
  activeAnalyticsSubTab: string;
  setActiveAnalyticsSubTab: (sub: string) => void;

  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Data Source & Employee State
  dataSourceMode: DataSourceMode;
  setDataSourceMode: (mode: DataSourceMode) => void;
  rawDemoRecords: EmployeeRawRecord[];
  rawUploadedRecords: EmployeeRawRecord[];
  allRecords: EmployeeRecord[];
  filteredRecords: EmployeeRecord[];
  employeeDirectory: EmployeeProfile[];
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;

  // Filter & Quality State
  filterState: HRFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<HRFilterState>>;
  resetFilters: () => void;
  isLoading: boolean;
  dbError: string | null;
  isRlsBlocked: boolean;

  // Custom Reports
  customReports: CustomReport[];
  saveReport: (report: CustomReport) => void;
  deleteReport: (id: string) => void;
  handleFileUpload: (records: EmployeeRecord[], raw: EmployeeRawRecord[]) => void;
  clearUploadedData: () => void;
  refetchDemoData: () => Promise<void>;

  // QMS & Documents State & Actions
  qmsDocuments: QmsDocument[];
  templates: PortalTemplate[];
  auditLogs: AuditLogEntry[];
  updateDocumentStatus: (docId: string, newStatus: DocumentStatus, comment?: string) => void;
  addDocumentVersion: (docId: string, newVersionNumber: string, changeDescription: string) => void;
  createDocument: (doc: Omit<QmsDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  logAuditAction: (action: string, module: PortalModule, recordTitle: string, details?: string) => void;

  kpis: OverallKPIs;
  dataQuality: DataQualityMetrics;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export function HRProvider({ children }: { children: React.ReactNode }) {
  // Primary Navigation Module & SubTabs
  const [activeModule, setActiveModule] = useState<PortalModule>('dashboard');
  const [activeHrSubTab, setActiveHrSubTab] = useState<HrSubTab>('analytics');
  const [activeQmsSubTab, setActiveQmsSubTab] = useState<QmsSubTab>('overview');

  // RBAC Simulator Role
  const [userRole, setUserRole] = useState<UserRole>('Quality Manager');

  // Data Sources
  const [dataSourceMode, setDataSourceMode] = useState<DataSourceMode>('demo');
  const [rawDemoRecords, setRawDemoRecords] = useState<EmployeeRawRecord[]>([]);
  const [rawUploadedRecords, setRawUploadedRecords] = useState<EmployeeRawRecord[]>([]);
  const [uploadedRecords, setUploadedRecords] = useState<EmployeeRecord[]>([]);
  const [demoRecords, setDemoRecords] = useState<EmployeeRecord[]>([]);

  // QMS & Portal Entities State
  const [qmsDocuments, setQmsDocuments] = useState<QmsDocument[]>(MOCK_QMS_DOCUMENTS);
  const [templates] = useState<PortalTemplate[]>(MOCK_TEMPLATES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<HRFilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isRlsBlocked, setIsRlsBlocked] = useState<boolean>(false);

  // Custom Reports State
  const [customReports, setCustomReports] = useState<CustomReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hr_analyzer_custom_reports');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved custom reports', e);
        }
      }
    }
    return [];
  });

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

  const refetchDemoData = loadDemoData;

  // Active records depending on Data Source Mode
  const allRecords = useMemo(() => {
    return dataSourceMode === 'demo' ? demoRecords : uploadedRecords;
  }, [dataSourceMode, demoRecords, uploadedRecords]);

  const rawActiveRecords = useMemo(() => {
    return dataSourceMode === 'demo' ? rawDemoRecords : rawUploadedRecords;
  }, [dataSourceMode, rawDemoRecords, rawUploadedRecords]);

  // Filtered records for analytics
  const filteredRecords = useMemo(() => {
    return applyFilters(allRecords, filterState);
  }, [allRecords, filterState]);

  // Enhanced 100+ Employee Directory Profiles
  const employeeDirectory = useMemo(() => {
    return generateEmployeeDirectory(allRecords);
  }, [allRecords]);

  // Overall KPIs
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
      const existingIdx = prev.findIndex((r) => r.id === report.id);
      let updated: CustomReport[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = report;
      } else {
        updated = [report, ...prev];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('hr_analyzer_custom_reports', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteReport = useCallback((id: string) => {
    setCustomReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hr_analyzer_custom_reports', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Audit Logger Helper
  const logAuditAction = useCallback(
    (action: string, module: PortalModule, recordTitle: string, details?: string) => {
      const newEntry: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        userId: `user-${Date.now().toString().slice(-4)}`,
        userName: userRole === 'Quality Manager' ? 'Marcus Vance' : 'Current User',
        userRole,
        action,
        module,
        recordTitle,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details,
      };
      setAuditLogs((prev) => [newEntry, ...prev]);
    },
    [userRole]
  );

  // QMS Actions
  const updateDocumentStatus = useCallback(
    (docId: string, newStatus: DocumentStatus, comment?: string) => {
      setQmsDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id !== docId) return doc;
          const updatedDoc = {
            ...doc,
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          logAuditAction(
            `Updated document status to ${newStatus}`,
            'documents',
            doc.docNumber,
            comment || `Status transitioned from ${doc.status} to ${newStatus}`
          );
          return updatedDoc;
        })
      );
    },
    [logAuditAction]
  );

  const addDocumentVersion = useCallback(
    (docId: string, newVersionNumber: string, changeDescription: string) => {
      setQmsDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id !== docId) return doc;
          const newVer = {
            id: `ver-${Date.now()}`,
            documentId: docId,
            versionNumber: newVersionNumber,
            createdBy: userRole === 'Quality Manager' ? 'Marcus Vance' : 'Current User',
            createdAt: new Date().toISOString().split('T')[0],
            changeDescription,
            status: 'Draft' as DocumentStatus,
          };
          const updatedDoc = {
            ...doc,
            currentVersion: newVersionNumber,
            status: 'Under Review' as DocumentStatus,
            updatedAt: new Date().toISOString().split('T')[0],
            versions: [newVer, ...(doc.versions || [])],
          };
          logAuditAction(
            `Created new version ${newVersionNumber}`,
            'documents',
            doc.docNumber,
            changeDescription
          );
          return updatedDoc;
        })
      );
    },
    [logAuditAction, userRole]
  );

  const createDocument = useCallback(
    (docData: Omit<QmsDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newDoc: QmsDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setQmsDocuments((prev) => [newDoc, ...prev]);
      logAuditAction(`Created document ${newDoc.docNumber}`, 'documents', newDoc.title);
    },
    [logAuditAction]
  );

  // Legacy tab state mapping helpers
  const activeTab: 'dashboard' | 'employees' | 'reports' | 'quality' = useMemo(() => {
    if (activeModule === 'reports') return 'reports';
    if (activeModule === 'hr' && activeHrSubTab === 'directory') return 'employees';
    return 'dashboard';
  }, [activeModule, activeHrSubTab]);

  const setActiveTab = useCallback((tab: 'dashboard' | 'employees' | 'reports' | 'quality') => {
    if (tab === 'reports') {
      setActiveModule('reports');
    } else if (tab === 'employees') {
      setActiveModule('hr');
      setActiveHrSubTab('directory');
    } else if (tab === 'quality') {
      setActiveModule('qms');
      setActiveQmsSubTab('overview');
    } else {
      setActiveModule('dashboard');
    }
  }, []);

  const activeAnalyticsSubTab = activeHrSubTab;
  const setActiveAnalyticsSubTab = useCallback((sub: string) => {
    setActiveModule('hr');
    setActiveHrSubTab(sub as HrSubTab);
  }, []);

  return (
    <HRContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeHrSubTab,
        setActiveHrSubTab,
        activeQmsSubTab,
        setActiveQmsSubTab,
        activeTab,
        setActiveTab,
        activeAnalyticsSubTab,
        setActiveAnalyticsSubTab,
        userRole,
        setUserRole,
        dataSourceMode,
        setDataSourceMode,
        rawDemoRecords,
        rawUploadedRecords,
        allRecords,
        filteredRecords,
        employeeDirectory,
        selectedDocumentId,
        setSelectedDocumentId,
        filterState,
        setFilterState,
        resetFilters,
        isLoading,
        dbError,
        isRlsBlocked,
        customReports,
        saveReport,
        deleteReport,
        handleFileUpload,
        clearUploadedData,
        refetchDemoData,
        qmsDocuments,
        templates,
        auditLogs,
        updateDocumentStatus,
        addDocumentVersion,
        createDocument,
        logAuditAction,
        kpis,
        dataQuality,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
}
