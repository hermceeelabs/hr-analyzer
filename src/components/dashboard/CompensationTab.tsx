'use client';

import React, { useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
  groupBySalarySlab,
  groupByGender,
  groupByPerformanceRating,
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
import { DollarSign, Percent, TrendingUp, Info } from 'lucide-react';

export default function CompensationTab() {
  const { filteredRecords, kpis } = useHR();

  const deptComp = groupByDepartment(filteredRecords);
  const roleComp = groupByJobRole(filteredRecords);
  const levelComp = groupByJobLevel(filteredRecords);
  const slabComp = groupBySalarySlab(filteredRecords);
  const genderComp = groupByGender(filteredRecords);
  const perfComp = groupByPerformanceRating(filteredRecords);

  // Observed gender salary comparison
  const genderDiffAnalysis = useMemo(() => {
    const male = genderComp.find((g) => g.category.toLowerCase() === 'male');
    const female = genderComp.find((g) => g.category.toLowerCase() === 'female');
    if (!male || !female) return null;

    const maleAvg = male.avgSalary;
    const femaleAvg = female.avgSalary;
    const diff = Math.abs(maleAvg - femaleAvg);
    const pctDiff = femaleAvg > 0 ? Number(((diff / femaleAvg) * 100).toFixed(1)) : 0;

    return {
      maleAvg,
      femaleAvg,
      diff,
      pctDiff,
      higher: maleAvg > femaleAvg ? 'Male' : 'Female',
    };
  }, [genderComp]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-navy-900">Compensation & Salary Hike Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Analyzing monthly income, salary slabs, and salary hike percentages. Mean Monthly Income:{' '}
            <span className="font-bold text-navy-900">${kpis.averageSalary.toLocaleString()}</span> (Median: ${kpis.medianSalary.toLocaleString()}).
          </p>
        </div>
      </div>

      {/* Observed Neutral Analytical Note Banner */}
      {genderDiffAnalysis && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-navy-800">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-navy-900">Observed Average Salary Difference (Demographic):</span>{' '}
            Observed average monthly income for Female employees is{' '}
            <span className="font-semibold text-navy-900">${genderDiffAnalysis.femaleAvg.toLocaleString()}</span> versus{' '}
            <span className="font-semibold text-navy-900">${genderDiffAnalysis.maleAvg.toLocaleString()}</span> for Male employees
            (Observed difference of <span className="font-semibold text-navy-900">${genderDiffAnalysis.diff.toLocaleString()}</span> / {genderDiffAnalysis.pctDiff}%).
            <span className="block mt-1 text-[11px] text-navy-500 font-normal">
              * Note: These are observed empirical aggregations across raw records and do not control for confounding variables such as Job Level, Role, or Years of Experience.
            </span>
          </div>
        </div>
      )}

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Average Salary by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Monthly Income by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Mean compensation across organizational units</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptComp} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="$" />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Avg Income']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgSalary" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Hike % by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Percent Salary Hike by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Mean salary increase percentage</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptComp} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Avg Hike']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgHike" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Salary by Job Role */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs col-span-1 lg:col-span-2">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Monthly Income by Job Role</h3>
          <p className="text-xs text-navy-500 mb-4">Role-based average compensation comparison</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleComp} margin={{ top: 10, right: 20, left: 10, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="$" />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Avg Income']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgSalary" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary by Job Level */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Salary by Job Level</h3>
          <p className="text-xs text-navy-500 mb-4">Progression of compensation from Level 1 to Level 5</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelComp} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="$" />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Avg Income']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgSalary" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Hike by Performance Rating */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Salary Hike % by Performance Rating</h3>
          <p className="text-xs text-navy-500 mb-4">Pay for performance correlation</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfComp} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Avg Hike']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgHike" fill="#065f46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Slab Distribution */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Headcount by Salary Slab</h3>
          <p className="text-xs text-navy-500 mb-4">Distribution across monthly income bands</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slabComp} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Salary Comparison Bar */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Observed Salary by Gender</h3>
          <p className="text-xs text-navy-500 mb-4">Observed average monthly income split by gender</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderComp} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="$" />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Avg Income']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgSalary" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
