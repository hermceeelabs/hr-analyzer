'use client';

import React, { useState, useMemo } from 'react';
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
import { DollarSign, Info, Hash, Percent } from 'lucide-react';

export default function CompensationTab() {
  const { filteredRecords, kpis } = useHR();
  const [viewMode, setViewMode] = useState<'avg' | 'total'>('avg');

  const deptComp = groupByDepartment(filteredRecords);
  const roleComp = groupByJobRole(filteredRecords);
  const levelComp = groupByJobLevel(filteredRecords);
  const slabComp = groupBySalarySlab(filteredRecords);
  const genderComp = groupByGender(filteredRecords);
  const perfComp = groupByPerformanceRating(filteredRecords);

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
      
      {/* Header Banner with Consistent View Mode Toggle (Average $ vs Headcount) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Compensation & Salary Hike Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 dark:text-slate-400 mt-1">
            Analyzing monthly income, salary slabs, and salary hike percentages. Mean Monthly Income:{' '}
            <span className="font-bold text-navy-900 dark:text-white">${kpis.averageSalary.toLocaleString()}</span> (Median: ${kpis.medianSalary.toLocaleString()}).
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setViewMode('avg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'avg'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Average Value ($/%)</span>
          </button>
          <button
            onClick={() => setViewMode('total')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'total'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Headcount</span>
          </button>
        </div>
      </div>

      {/* Observed Neutral Analytical Note Banner */}
      {genderDiffAnalysis && (
        <div className="bg-blue-50/70 dark:bg-slate-800/40 border border-blue-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3 text-xs text-navy-800 dark:text-slate-300">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-navy-900 dark:text-white">Observed Average Salary Difference (Demographic):</span>{' '}
            Observed average monthly income for Female employees is{' '}
            <span className="font-semibold text-navy-900 dark:text-white">${genderDiffAnalysis.femaleAvg.toLocaleString()}</span> versus{' '}
            <span className="font-semibold text-navy-900 dark:text-white">${genderDiffAnalysis.maleAvg.toLocaleString()}</span> for Male employees
            (Observed difference of <span className="font-semibold text-navy-900 dark:text-white">${genderDiffAnalysis.diff.toLocaleString()}</span> / {genderDiffAnalysis.pctDiff}%).
            <span className="block mt-1 text-[11px] text-navy-500 dark:text-slate-400 font-normal">
              * Note: These are observed empirical aggregations across raw records and do not control for confounding variables such as Job Level, Role, or Years of Experience.
            </span>
          </div>
        </div>
      )}

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Average Salary by Department */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
            {viewMode === 'avg' ? 'Average Monthly Income by Department' : 'Headcount by Department'}
          </h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">
            {viewMode === 'avg' ? 'Mean compensation across organizational units' : 'Total employee count per department'}
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptComp} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={viewMode === 'avg' ? '$' : ''} />
                <Tooltip
                  formatter={(val: number) => [viewMode === 'avg' ? `$${val.toLocaleString()}` : `${val} staff`, viewMode === 'avg' ? 'Avg Income' : 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={viewMode === 'avg' ? 'avgSalary' : 'total'} fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Hike % by Department */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Average Percent Salary Hike by Department</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Mean salary increase percentage</p>
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

        {/* Salary by Job Level */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
            {viewMode === 'avg' ? 'Average Salary by Job Level' : 'Headcount by Job Level'}
          </h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Progression of compensation from Level 1 to Level 5</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelComp} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={viewMode === 'avg' ? '$' : ''} />
                <Tooltip
                  formatter={(val: number) => [viewMode === 'avg' ? `$${val.toLocaleString()}` : `${val} staff`, viewMode === 'avg' ? 'Avg Income' : 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={viewMode === 'avg' ? 'avgSalary' : 'total'} fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Hike by Performance Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Salary Hike % by Performance Rating</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Pay for performance correlation</p>
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

      </div>
    </div>
  );
}
