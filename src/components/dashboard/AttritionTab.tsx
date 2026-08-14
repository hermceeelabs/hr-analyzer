'use client';

import React, { useState } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
  groupByAgeGroup,
  groupByGender,
  groupBySalarySlab,
  groupByOvertime,
  groupByBusinessTravel,
  groupByMaritalStatus,
  groupByEducationField,
} from '@/lib/analytics/engine';
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
import { TrendingDown, AlertTriangle, CheckCircle, Percent, Hash } from 'lucide-react';

export default function AttritionTab() {
  const { filteredRecords, kpis } = useHR();
  const [metricMode, setMetricMode] = useState<'rate' | 'count'>('rate');

  const deptAttr = groupByDepartment(filteredRecords);
  const roleAttr = groupByJobRole(filteredRecords);
  const levelAttr = groupByJobLevel(filteredRecords);
  const ageAttr = groupByAgeGroup(filteredRecords);
  const genderAttr = groupByGender(filteredRecords);
  const slabAttr = groupBySalarySlab(filteredRecords);
  const otAttr = groupByOvertime(filteredRecords);
  const travelAttr = groupByBusinessTravel(filteredRecords);
  const maritalAttr = groupByMaritalStatus(filteredRecords);
  const eduAttr = groupByEducationField(filteredRecords);

  const dataKey = metricMode === 'rate' ? 'attritionRate' : 'attritionCount';
  const unitLabel = metricMode === 'rate' ? '%' : 'emp';

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Mode Switcher */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-navy-900">Attrition & Retention Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Analyzing workforce turnover across 10 key organizational dimensions. Overall Attrition Rate:{' '}
            <span className="font-bold text-navy-900">{kpis.attritionRate}%</span> ({kpis.attritionCount} departures out of {kpis.totalEmployees} employees).
          </p>
        </div>

        {/* Toggle Rate vs Count */}
        <div className="flex items-center gap-1 bg-navy-50 p-1 rounded-lg border border-navy-200 shrink-0 text-xs">
          <button
            onClick={() => setMetricMode('rate')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              metricMode === 'rate'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-brand-600" />
            <span>Attrition Rate (%)</span>
          </button>

          <button
            onClick={() => setMetricMode('count')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              metricMode === 'count'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-navy-600" />
            <span>Attrition Count (Headcount)</span>
          </button>
        </div>
      </div>

      {/* Grid of Attrition Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attrition by Department */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Attrition by Department</h3>
              <p className="text-xs text-navy-500">Departmental turnover comparison</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Overtime */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Attrition by Overtime Status</h3>
              <p className="text-xs text-navy-500">Impact of overtime working hours on turnover</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={otAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Job Role */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs col-span-1 lg:col-span-2">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Job Role</h3>
          <p className="text-xs text-navy-500 mb-4">Granular view of turnover rates across specific job roles</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleAttr} margin={{ top: 10, right: 20, left: 0, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#be123c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Job Level */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Job Level</h3>
          <p className="text-xs text-navy-500 mb-4">Turnover rates from Level 1 (Entry) to Level 5 (Executive)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Age Group */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Age Group</h3>
          <p className="text-xs text-navy-500 mb-4">Age demographic turnover susceptibility</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#9f1239" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Salary Slab */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Salary Slab</h3>
          <p className="text-xs text-navy-500 mb-4">Turnover rate relative to compensation tier</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slabAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Business Travel */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Business Travel</h3>
          <p className="text-xs text-navy-500 mb-4">Travel frequency vs turnover likelihood</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#881337" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Marital Status & Gender */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Marital Status</h3>
          <p className="text-xs text-navy-500 mb-4">Marital demographic turnover breakdown</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maritalAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Education Field */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Attrition by Education Field</h3>
          <p className="text-xs text-navy-500 mb-4">Educational background turnover correlation</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eduAttr} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit={unitLabel} />
                <Tooltip
                  formatter={(val: number) => [
                    metricMode === 'rate' ? `${val}%` : `${val} departures`,
                    metricMode === 'rate' ? 'Attrition Rate' : 'Departures',
                  ]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={dataKey} fill="#be123c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
