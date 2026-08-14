'use client';

import React, { useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  groupByDepartment,
  groupByDistanceBand,
  groupByBusinessTravel,
} from '@/lib/analytics/engine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Briefcase, AlertCircle, Award, Compass, MapPin } from 'lucide-react';

export default function CareerTab() {
  const { filteredRecords, kpis } = useHR();

  const deptData = groupByDepartment(filteredRecords);
  const distanceData = groupByDistanceBand(filteredRecords);
  const travelData = groupByBusinessTravel(filteredRecords);

  // Promotion Candidate Analytical Flag Count
  const promotionCandidates = useMemo(() => {
    return filteredRecords.filter((r) => r.promotionCandidateFlag);
  }, [filteredRecords]);

  // Average years since promotion by department
  const promoByDept = useMemo(() => {
    return deptData.map((d) => {
      const recordsInDept = filteredRecords.filter((r) => r.department === d.category);
      const avgPromo =
        recordsInDept.length > 0
          ? Number(
              (
                recordsInDept.reduce((a, b) => a + b.yearsSinceLastPromotion, 0) /
                recordsInDept.length
              ).toFixed(1)
            )
          : 0;
      return {
        category: d.category,
        avgYearsSincePromotion: avgPromo,
        avgTenure: d.avgTenure,
      };
    });
  }, [deptData, filteredRecords]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-navy-900">Career, Mobility & Training Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Tenure, career progression, commute distance, and training sessions. Average Tenure:{' '}
            <span className="font-bold text-navy-900">{kpis.averageTenure} yrs</span> (Avg Distance:{' '}
            <span className="font-bold text-navy-900">{kpis.averageDistance} km</span>).
          </p>
        </div>
      </div>

      {/* Promotion Review Indicator Banner */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex items-start gap-3 text-xs text-purple-950">
        <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-purple-900">
            Promotion Review Analytical Indicator Flag ({promotionCandidates.length} employees identified)
          </div>
          <div className="mt-0.5 text-purple-800">
            Defined threshold: Employees with <span className="font-semibold">≥ 5 years tenure at company</span> and{' '}
            <span className="font-semibold">≥ 4 years since last promotion</span>.
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            * Note: This analytical indicator highlights employees who meet specific tenure parameters for HR talent review and does not imply automatic promotion eligibility.
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Average Tenure by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Company Tenure by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Mean years at company per department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit=" yrs" />
                <Tooltip
                  formatter={(val: number) => [`${val} yrs`, 'Avg Tenure']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgTenure" fill="#7e22ce" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Years Since Last Promotion by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Years Since Last Promotion by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Average years elapsed since last promotion</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promoByDept} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit=" yrs" />
                <Tooltip
                  formatter={(val: number) => [`${val} yrs`, 'Avg Years Since Promotion']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgYearsSincePromotion" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Distance Band */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition Rate by Distance from Home Band</h3>
          <p className="text-xs text-navy-500 mb-4">Impact of commute distance on employee turnover rate</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distanceData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Attrition Rate']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="attritionRate" fill="#c026d3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Travel vs Attrition */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition Rate by Business Travel Frequency</h3>
          <p className="text-xs text-navy-500 mb-4">Turnover rates across travel commitments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Attrition Rate']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="attritionRate" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
