'use client';

import React, { useState, useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { groupByDepartment, groupByJobRole, groupByJobLevel } from '@/lib/analytics/engine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Smile, Info, Percent, Hash } from 'lucide-react';

export default function SatisfactionTab() {
  const { filteredRecords } = useHR();
  const [viewMode, setViewMode] = useState<'avg' | 'total'>('avg');

  const deptSat = groupByDepartment(filteredRecords);
  const roleSat = groupByJobRole(filteredRecords);
  const levelSat = groupByJobLevel(filteredRecords);

  const dimensionsOverview = useMemo(() => {
    if (filteredRecords.length === 0) return [];
    const len = filteredRecords.length;

    const env = filteredRecords.reduce((a, b) => a + b.environmentSatisfaction, 0) / len;
    const inv = filteredRecords.reduce((a, b) => a + b.jobInvolvement, 0) / len;
    const sat = filteredRecords.reduce((a, b) => a + b.jobSatisfaction, 0) / len;
    const rel = filteredRecords.reduce((a, b) => a + b.relationshipSatisfaction, 0) / len;
    const wlb = filteredRecords.reduce((a, b) => a + b.workLifeBalance, 0) / len;

    return [
      { dimension: 'Environment', score: Number(env.toFixed(2)), fullMark: 5 },
      { dimension: 'Job Involvement', score: Number(inv.toFixed(2)), fullMark: 5 },
      { dimension: 'Job Satisfaction', score: Number(sat.toFixed(2)), fullMark: 5 },
      { dimension: 'Relationship', score: Number(rel.toFixed(2)), fullMark: 5 },
      { dimension: 'Work-Life Balance', score: Number(wlb.toFixed(2)), fullMark: 5 },
    ];
  }, [filteredRecords]);

  const satVsAttritionData = useMemo(() => {
    const active = filteredRecords.filter((r) => !r.attrition);
    const departed = filteredRecords.filter((r) => r.attrition);

    const calcAvg = (arr: typeof filteredRecords, key: keyof typeof filteredRecords[0]) =>
      arr.length > 0
        ? Number((arr.reduce((a, b) => a + Number(b[key]), 0) / arr.length).toFixed(2))
        : 0;

    return [
      {
        dimension: 'Environment',
        Active: calcAvg(active, 'environmentSatisfaction'),
        Departed: calcAvg(departed, 'environmentSatisfaction'),
      },
      {
        dimension: 'Job Involvement',
        Active: calcAvg(active, 'jobInvolvement'),
        Departed: calcAvg(departed, 'jobInvolvement'),
      },
      {
        dimension: 'Job Satisfaction',
        Active: calcAvg(active, 'jobSatisfaction'),
        Departed: calcAvg(departed, 'jobSatisfaction'),
      },
      {
        dimension: 'Relationship',
        Active: calcAvg(active, 'relationshipSatisfaction'),
        Departed: calcAvg(departed, 'relationshipSatisfaction'),
      },
      {
        dimension: 'Work-Life Balance',
        Active: calcAvg(active, 'workLifeBalance'),
        Departed: calcAvg(departed, 'workLifeBalance'),
      },
    ];
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Consistent View Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Satisfaction & Employee Engagement</h2>
          </div>
          <p className="text-xs text-navy-500 dark:text-slate-400 mt-1">
            Multi-dimensional evaluation of employee experience across 5 core satisfaction indicators (Scale 1-5).
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setViewMode('avg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'avg'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Average Score (1-5)</span>
          </button>
          <button
            onClick={() => setViewMode('total')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'total'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Headcount</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50/70 dark:bg-slate-800/40 border border-amber-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3 text-xs text-navy-800 dark:text-slate-300">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-navy-900 dark:text-white">Observed Relationship Note:</span> Correlations between satisfaction scores and employee attrition represent empirical associations within the dataset.
          These findings are presented as observed patterns and do not imply direct causality.
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5-Dimension Overview Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Satisfaction Dimensions Overview</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Average scores out of 5.0 rating scale</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionsOverview} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} / 5.0`, 'Avg Score']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction vs Attrition Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Satisfaction vs Attrition Status</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Comparison of scores between Active and Departed employees</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satVsAttritionData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} / 5.0`, name]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Active" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Departed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction by Department */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
            {viewMode === 'avg' ? 'Job Satisfaction by Department' : 'Headcount by Department'}
          </h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">
            {viewMode === 'avg' ? 'Mean job satisfaction score across departments' : 'Total employee headcount'}
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSat} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={viewMode === 'avg' ? [0, 5] : undefined} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [viewMode === 'avg' ? `${val} / 5.0` : `${val} staff`, viewMode === 'avg' ? 'Job Satisfaction' : 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={viewMode === 'avg' ? 'avgSatisfaction' : 'total'} fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work-Life Balance by Department */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Work-Life Balance by Department</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Mean work-life balance score by department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSat} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} / 5.0`, 'Work-Life Balance']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgWorkLifeBalance" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
