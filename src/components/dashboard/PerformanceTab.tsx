'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
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
import { Award, Zap } from 'lucide-react';

export default function PerformanceTab() {
  const { filteredRecords, kpis } = useHR();

  const perfRating = groupByPerformanceRating(filteredRecords);
  const deptPerf = groupByDepartment(filteredRecords);
  const rolePerf = groupByJobRole(filteredRecords);
  const levelPerf = groupByJobLevel(filteredRecords);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-navy-900">Performance Rating Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Evaluation of employee performance ratings and their relationship with salary hikes, training, and retention. Average Performance Score:{' '}
            <span className="font-bold text-navy-900">{kpis.averagePerformance} / 4.0</span>.
          </p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance Rating Distribution */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Performance Rating Distribution</h3>
          <p className="text-xs text-navy-500 mb-4">Headcount breakdown by performance tier</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfRating} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance vs Salary Hike % */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Performance Rating vs Salary Hike %</h3>
          <p className="text-xs text-navy-500 mb-4">Average salary increase percentage by performance tier</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfRating} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Avg Hike']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgHike" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Average Performance by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Departmental performance rating score</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerf} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} / 4.0`, 'Avg Rating']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgPerformance" fill="#4338ca" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance vs Training Sessions */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Performance vs Training Sessions</h3>
          <p className="text-xs text-navy-500 mb-4">Average training sessions completed by performance rating</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfRating} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} sessions`, 'Avg Training']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="avgTraining" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
