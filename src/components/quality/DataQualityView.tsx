'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import KPICard from '@/components/common/KPICard';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  Search,
  Database,
} from 'lucide-react';

export default function DataQualityView() {
  const { dataQuality, dataSourceMode } = useHR();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-navy-900">Data Quality & Completeness Audit</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Automated dataset health diagnostics. Active Source Mode:{' '}
            <span className="font-bold text-navy-900">
              {dataSourceMode === 'demo' ? 'Supabase Demo Database' : 'Uploaded Dataset'}
            </span>.
          </p>
        </div>
      </div>

      {/* Primary Data Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Completeness"
          value={`${dataQuality.overallCompleteness}%`}
          subtitle="Non-null value fill rate across schema"
          badgeText={dataQuality.overallCompleteness > 95 ? 'Excellent' : 'Needs Review'}
          badgeType={dataQuality.overallCompleteness > 95 ? 'success' : 'warning'}
          icon={FileCheck}
        />

        <KPICard
          title="Total Dataset Rows"
          value={dataQuality.totalRecords.toLocaleString()}
          subtitle="Evaluated records count"
          badgeText="Total"
          badgeType="info"
          icon={Layers}
        />

        <KPICard
          title="Unique EmpID Count"
          value={dataQuality.uniqueEmpIds.toLocaleString()}
          subtitle="Distinct employee identifier keys"
          badgeText="Keys"
          badgeType="neutral"
          icon={Search}
        />

        <KPICard
          title="Duplicate EmpIDs"
          value={dataQuality.duplicateEmpIdsCount.toLocaleString()}
          subtitle="Multiple records sharing same ID"
          badgeText={dataQuality.duplicateEmpIdsCount === 0 ? 'Clean' : 'Duplicates'}
          badgeType={dataQuality.duplicateEmpIdsCount === 0 ? 'success' : 'danger'}
          icon={AlertTriangle}
        />
      </div>

      {/* Potential Invalid Values Diagnostic Alert */}
      {dataQuality.potentialInvalidValues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Potential Value Anomalies Detected ({dataQuality.potentialInvalidValues.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {dataQuality.potentialInvalidValues.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 text-navy-800">
                <div className="font-bold text-navy-900 flex items-center justify-between">
                  <span>Field: {item.field}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                    {item.count} records
                  </span>
                </div>
                <div className="text-[11px] text-navy-600 mt-1">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate EmpIDs List if any */}
      {dataQuality.duplicateEmpIds.length > 0 && (
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Duplicate Employee Identifiers</h3>
          <p className="text-xs text-navy-500 mb-3">The following EmpIDs appear in multiple rows</p>
          <div className="flex flex-wrap gap-2">
            {dataQuality.duplicateEmpIds.map((id) => (
              <span key={id} className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs font-bold">
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Values Breakdown Grid */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-navy-900 mb-1">Column-Level Completeness & Null Analysis</h3>
        <p className="text-xs text-navy-500 mb-4">Detailed missing value count per source data column</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(dataQuality.columnMissingCounts).map(([col, missingCount]) => {
            const pctMissing = dataQuality.columnMissingPercentages[col] || 0;
            const pctComplete = 100 - pctMissing;

            return (
              <div key={col} className="p-3 rounded-lg border border-navy-100 bg-navy-50/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-navy-900">{col}</div>
                  <div className="text-[11px] text-navy-500 mt-0.5">
                    {missingCount === 0 ? '100% Complete' : `${missingCount} missing (${pctMissing}%)`}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                    missingCount === 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {pctComplete.toFixed(0)}% Fill
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
