'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import {
  groupByAgeGroup,
  groupByGender,
  groupByMaritalStatus,
  groupByEducationField,
  groupByDepartment,
} from '@/lib/analytics/engine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { UserCheck, Users, Heart, GraduationCap } from 'lucide-react';

const COLORS = ['#0062d6', '#369eff', '#7cc2ff', '#0b3876', '#1e293b', '#64748b'];

export default function DemographicsTab() {
  const { filteredRecords } = useHR();

  const genderData = groupByGender(filteredRecords);
  const maritalData = groupByMaritalStatus(filteredRecords);
  const eduData = groupByEducationField(filteredRecords);
  const ageData = groupByAgeGroup(filteredRecords);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-navy-900">Demographic Analytics</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Comprehensive diversity and demographic analysis across Gender, Marital Status, Education, and Age Groups.
          </p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gender Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Gender Distribution</h3>
          <p className="text-xs text-navy-500 mb-4">Headcount and percentage breakdown</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {genderData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marital Status Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Marital Status Distribution</h3>
          <p className="text-xs text-navy-500 mb-4">Headcount across marital status tiers</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maritalData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {maritalData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[(idx + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education Field Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Education Field Breakdown</h3>
          <p className="text-xs text-navy-500 mb-4">Educational backgrounds of workforce</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eduData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Group Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Age Group Breakdown</h3>
          <p className="text-xs text-navy-500 mb-4">Age brackets distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
