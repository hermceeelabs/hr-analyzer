'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { validateUploadedDataset } from '@/lib/analytics/validation';
import { downloadHRTemplateCSV, downloadHRTemplateXLSX } from '@/lib/analytics/template';
import { EmployeeRawRecord } from '@/types/hr';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Download,
  Info,
} from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const { handleFileUpload } = useHR();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ReturnType<
    typeof validateUploadedDataset
  > | null>(null);

  const processFile = (fileToProcess: File) => {
    setIsProcessing(true);
    setValidationResult(null);

    const fileName = fileToProcess.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse<EmployeeRawRecord>(fileToProcess, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rawRecords = results.data;
          const validation = validateUploadedDataset(rawRecords);
          setValidationResult(validation);
          setIsProcessing(false);
        },
        error: (err) => {
          setValidationResult({
            isValid: false,
            errors: [`CSV Parsing Error: ${err.message}`],
            warnings: [],
            totalRowsParsed: 0,
          });
          setIsProcessing(false);
        },
      });
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRecords = XLSX.utils.sheet_to_json<EmployeeRawRecord>(worksheet);

          const validation = validateUploadedDataset(rawRecords);
          setValidationResult(validation);
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown Excel reading error';
          setValidationResult({
            isValid: false,
            errors: [`Excel Parsing Error: ${errorMsg}`],
            warnings: [],
            totalRowsParsed: 0,
          });
        }
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(fileToProcess);
    } else {
      setValidationResult({
        isValid: false,
        errors: ['Invalid file format. Please upload a .csv or .xlsx file.'],
        warnings: [],
        totalRowsParsed: 0,
      });
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleApplyDataset = () => {
    if (validationResult?.isValid && validationResult.records) {
      // Re-parse raw file to pass to store
      if (file?.name.endsWith('.csv')) {
        Papa.parse<EmployeeRawRecord>(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (res) => {
            handleFileUpload(validationResult.records!, res.data);
            onClose();
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json<EmployeeRawRecord>(worksheet);
          handleFileUpload(validationResult.records!, raw);
          onClose();
        };
        reader.readAsArrayBuffer(file!);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-navy-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-base tracking-tight">Upload HR Dataset</h3>
          </div>
          <button onClick={onClose} className="text-navy-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-navy-600">
            Upload a CSV or Excel (.xlsx) file containing your HR dataset. Uploaded records will temporarily replace the demo database for your current session.
          </p>

          {/* Template Banner */}
          <div className="bg-brand-50/60 border border-brand-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-950 font-medium">
              <Info className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Need the required HR column structure?</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={downloadHRTemplateCSV}
                className="px-2.5 py-1 rounded bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100 flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span>CSV</span>
              </button>
              <button
                onClick={downloadHRTemplateXLSX}
                className="px-2.5 py-1 rounded bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100 flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3 text-blue-600" />
                <span>XLSX</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-navy-200 rounded-xl p-6 text-center hover:border-brand-500 hover:bg-brand-50/30 transition-all cursor-pointer relative"
          >
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-navy-400 mx-auto mb-2" />
            <div className="font-bold text-navy-800 text-sm">
              {file ? file.name : 'Drag and drop your file here, or click to browse'}
            </div>
            <div className="text-navy-400 mt-1 text-[11px]">
              Supports CSV (.csv) or Excel (.xlsx) files up to 25MB
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-3 text-center text-brand-800 font-medium animate-pulse">
              Validating dataset structure and columns...
            </div>
          )}

          {/* Validation Feedback */}
          {validationResult && !isProcessing && (
            <div className="space-y-3">
              {validationResult.isValid ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Dataset Validated Successfully</div>
                    <div className="text-[11px] text-emerald-800 mt-0.5">
                      Parsed <span className="font-semibold">{validationResult.totalRowsParsed}</span> employee records ready for session analysis.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Validation Errors Detected</div>
                    <ul className="list-disc list-inside text-[11px] mt-1 space-y-0.5 text-rose-800">
                      {validationResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <div className="font-bold mb-0.5 text-amber-900">Validation Warnings:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                    {validationResult.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-navy-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyDataset}
              disabled={!validationResult?.isValid}
              className={`px-4 py-2 rounded-lg font-semibold text-white shadow-xs transition-all ${
                validationResult?.isValid
                  ? 'bg-brand-900 hover:bg-brand-800 cursor-pointer'
                  : 'bg-navy-300 cursor-not-allowed'
              }`}
            >
              Apply Uploaded Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
