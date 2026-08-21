'use client';

import React, { useState } from 'react';
import { X, FileText, Plus, AlertOctagon, CheckSquare, Calendar } from 'lucide-react';
import { DocumentType, DocumentStatus } from '@/types/qms';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BaseModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-navy-950 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 1. New Document Modal
export function NewDocumentModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { docNumber: string; title: string; docType: DocumentType; department: string; ownerName: string; description: string }) => void;
}) {
  const [docNumber, setDocNumber] = useState(`QMS-SOP-00${Math.floor(Math.random() * 90) + 10}`);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('SOP');
  const [department, setDepartment] = useState('Quality Management');
  const [ownerName, setOwnerName] = useState('Sarah Jenkins');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({ docNumber, title, docType, department, ownerName, description });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create New Controlled Document">
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Number</label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono font-semibold"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-semibold"
            >
              <option value="Policy">Policy</option>
              <option value="SOP">SOP</option>
              <option value="Work Instruction">Work Instruction</option>
              <option value="Procedure">Procedure</option>
              <option value="Handbook">Handbook</option>
              <option value="Form">Form</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Risk-Based Auditing Procedure"
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
            >
              <option value="Quality Management">Quality Management</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Owner</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Scope &amp; Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief scope, compliance standards, and document purpose..."
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs shadow-xs"
          >
            Create &amp; Log Draft
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 2. Log Non-Conformance Modal
export function LogNonConformanceModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { ncNumber: string; title: string; department: string; severity: 'Low' | 'Minor' | 'Major' | 'Critical'; description: string }) => void;
}) {
  const [ncNumber, setNcNumber] = useState(`NC-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [severity, setSeverity] = useState<'Low' | 'Minor' | 'Major' | 'Critical'>('Minor');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({ ncNumber, title, department, severity, description });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log Quality Non-Conformance Incident">
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">NC Reference #</label>
            <input
              type="text"
              value={ncNumber}
              onChange={(e) => setNcNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono font-semibold"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
            >
              <option value="Low">Low</option>
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Incident Summary</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Delayed Safety Checklist Sign-off"
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department Involved</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
          >
            <option value="Operations">Operations</option>
            <option value="Quality Management">Quality Management</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Information Technology">Information Technology</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Incident Details</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the quality deviation, impact, and immediate containment action..."
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs"
          >
            Log Non-Conformance
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 3. Schedule Audit Modal
export function ScheduleAuditModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { auditNumber: string; title: string; auditType: any; department: string; auditorName: string; scheduledDate: string }) => void;
}) {
  const [auditNumber, setAuditNumber] = useState(`AUD-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [title, setTitle] = useState('');
  const [auditType, setAuditType] = useState('ISO 9001 Internal');
  const [department, setDepartment] = useState('Quality Management');
  const [auditorName, setAuditorName] = useState('Michael Chang');
  const [scheduledDate, setScheduledDate] = useState('2026-10-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({ auditNumber, title, auditType, department, auditorName, scheduledDate });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Schedule ISO Quality Audit">
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Audit Code #</label>
            <input
              type="text"
              value={auditNumber}
              onChange={(e) => setAuditNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono font-semibold"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Audit Category</label>
            <select
              value={auditType}
              onChange={(e) => setAuditType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-semibold"
            >
              <option value="ISO 9001 Internal">ISO 9001 Internal</option>
              <option value="External Recertification">External Recertification</option>
              <option value="Supplier Quality">Supplier Quality</option>
              <option value="Document Control">Document Control</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Audit Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Department Compliance Audit"
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lead Auditor</label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            Schedule Audit
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// 4. Issue CAPA Modal
export function IssueCapaModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { capaNumber: string; title: string; rootCause: string; correctiveAction: string; assignedTo: string; dueDate: string }) => void;
}) {
  const [capaNumber, setCapaNumber] = useState(`CAPA-0${Math.floor(Math.random() * 90) + 10}`);
  const [title, setTitle] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [assignedTo, setAssignedTo] = useState('Marcus Vance');
  const [dueDate, setDueDate] = useState('2026-09-30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({ capaNumber, title, rootCause, correctiveAction, assignedTo, dueDate });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Issue Corrective & Preventive Action (CAPA)">
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CAPA Ref #</label>
            <input
              type="text"
              value={capaNumber}
              onChange={(e) => setCapaNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-mono font-semibold"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Assigned Owner</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Action Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Automated Access Deprovisioning Enforcement"
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white font-bold"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Root Cause Analysis (5-Why Summary)</label>
          <textarea
            rows={2}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="Identified root cause..."
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Corrective Action Plan</label>
          <textarea
            rows={2}
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            placeholder="Steps to eliminate root cause and prevent recurrence..."
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs shadow-xs"
          >
            Issue CAPA
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
