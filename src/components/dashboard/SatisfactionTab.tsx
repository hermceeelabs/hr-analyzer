'use client';

import React, { useMemo } from 'react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { Smile, HeartHandshake, Info } from 'lucide-react';

export default function SatisfactionTab() {
  const { filteredRecords } = useHR();

  const deptSat = groupByDepartment(filteredRecords);
  const roleSat = groupByJobRole(filteredRecords);
  const levelSat = groupByJobLevel(filteredRecords);

  // 5 Dimensions Average Overview
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

  // Satisfaction vs Attrition (Active vs Departed comparison across dimensions)
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
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-navy-900">Satisfaction & Employee Engagement</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Multi-dimensional evaluation of employee experience across 5 core satisfaction indicators (Scale 1-5).
          </p>
        </div>
      </div>

      {/* Causal Claim Warning Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-navy-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-navy-900">Observed Relationship Note:</span> Correlations between satisfaction scores and employee attrition represent empirical associations within the dataset.
          These findings are presented as observed patterns and do not imply direct causality.
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5-Dimension Overview Bar */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Satisfaction Dimensions Overview</h3>
          <p className="text-xs text-navy-500 mb-4">Average scores out of 5.0 rating scale</p>
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
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Satisfaction vs Attrition Status</h3>
          <p className="text-xs text-navy-500 mb-4">Comparison of scores between Active and Departed employees</p>
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
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Job Satisfaction by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Mean job satisfaction score across departments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSat} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} / 5.0`, 'Job Satisfaction']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgSatisfaction" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work-Life Balance by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Work-Life Balance by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Mean work-life balance score by department</p>
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
