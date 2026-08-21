import { EmployeeRecord, EmployeeRawRecord, HRFilterState, DataSourceMode, CustomReport, DataQualityMetrics, OverallKPIs } from '@/types/hr';

// Portal Module Navigation Types
export type PortalModule =
  | 'dashboard'
  | 'hr'
  | 'qms'
  | 'documents'
  | 'approvals'
  | 'templates'
  | 'reports'
  | 'audit'
  | 'settings';

export type HrSubTab =
  | 'overview'
  | 'directory'
  | 'departments'
  | 'onboarding'
  | 'training'
  | 'documents'
  | 'analytics'
  | 'attrition'
  | 'compensation'
  | 'satisfaction'
  | 'performance'
  | 'career'
  | 'demographics';

export type QmsSubTab =
  | 'overview'
  | 'document-control'
  | 'policies'
  | 'sops'
  | 'work-instructions'
  | 'audits'
  | 'non-conformances'
  | 'capa';

// Role-Based Access Control (RBAC) Roles
export type UserRole =
  | 'Administrator'
  | 'HR Manager'
  | 'HR Officer'
  | 'Quality Manager'
  | 'Quality Reviewer'
  | 'Employee'
  | 'Auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

// Document Status Lifecycle
export type DocumentStatus =
  | 'Draft'
  | 'Under Review'
  | 'Changes Requested'
  | 'Approved'
  | 'Active'
  | 'Superseded'
  | 'Archived';

export type DocumentType =
  | 'Policy'
  | 'SOP'
  | 'Work Instruction'
  | 'Procedure'
  | 'Form'
  | 'Template'
  | 'Record'
  | 'Handbook';

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: string; // e.g. "1.0", "2.1"
  filePath?: string;
  createdBy: string;
  createdAt: string;
  changeDescription: string;
  status: DocumentStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  versionNumber: string;
  reviewerName: string;
  reviewerRole: UserRole;
  decision: 'Pending' | 'Approved' | 'Changes Requested' | 'Rejected';
  comment?: string;
  dueDate: string;
  completedAt?: string;
}

export interface QmsDocument {
  id: string;
  docNumber: string; // e.g. "QMS-SOP-001"
  title: string;
  docType: DocumentType;
  department: string;
  ownerId: string;
  ownerName: string;
  status: DocumentStatus;
  currentVersion: string;
  effectiveDate: string;
  reviewDate: string;
  description: string;
  filePath?: string;
  googleDriveUrl?: string;
  createdAt: string;
  updatedAt: string;
  versions?: DocumentVersion[];
  approvals?: DocumentApproval[];
}

export interface PortalTemplate {
  id: string;
  name: string;
  category: 'HR' | 'QMS' | 'Administration';
  description: string;
  owner: string;
  version: string;
  lastUpdated: string;
  filePath?: string;
  docType: DocumentType;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g., "Approved Quality Policy v2.1"
  module: PortalModule;
  recordTitle: string;
  timestamp: string;
  details?: string;
}

export interface AuditRecord {
  id: string;
  auditNumber: string; // e.g., "AUD-2026-004"
  title: string;
  auditType: 'ISO 9001 Internal' | 'External Recertification' | 'Supplier Quality' | 'Document Control';
  department: string;
  auditorName: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  findingsCount: number;
}

export interface NonConformanceRecord {
  id: string;
  ncNumber: string; // e.g., "NC-2026-005"
  title: string;
  department: string;
  severity: 'Low' | 'Minor' | 'Major' | 'Critical';
  loggedBy: string;
  loggedDate: string;
  description: string;
  status: 'Open' | 'CAPA Pending' | 'Resolved';
}

export interface CapaRecord {
  id: string;
  capaNumber: string; // e.g., "CAPA-013"
  title: string;
  rootCause: string;
  correctiveAction: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'Verification Pending' | 'Closed';
}

export interface EmployeeProfile {
  id: string;
  empId: string; // e.g., "EMP-0142"
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  managerName: string;
  employmentStatus: 'Active' | 'On Leave' | 'Terminated' | 'Contractor';
  startDate: string;
  avatarUrl?: string;
  documentsCount: number;
  completedTrainingCount: number;
  pendingTrainingCount: number;
  leaveBalanceDays: number;
  performanceRating: number;
}

