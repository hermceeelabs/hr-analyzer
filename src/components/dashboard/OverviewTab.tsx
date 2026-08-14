'use client';

import React from 'react';
import { useHR } from '@/lib/store/useHRStore';
import KPICard from '@/components/common/KPICard';
import {
  groupByDepartment,
  groupByJobRole,
  groupByJobLevel,
  groupByAgeGroup,
  groupByGender,
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
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Users,
  UserCheck,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  Zap,
  Smile,
} from 'lucide-react';

const COLOR_PALETTE = ['#0062d6', '#369eff', '#7cc2ff', '#0b3876', '#1e293b', '#64748b'];

export default function OverviewTab() {
  const { kpis, filteredRecords } = useHR();

  const deptData = groupByDepartment(filteredRecords);
  const roleData = groupByJobRole(filteredRecords);
  const levelData = groupByJobLevel(filteredRecords);
  const ageData = groupByAgeGroup(filteredRecords);
  const genderData = groupByGender(filteredRecords);
  const maritalData = groupByMaritalStatus(filteredRecords);
  const eduData = groupByEducationField(filteredRecords);

  return (
    <div className="space-y-6">
      
      {/* Executive Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Headcount"
          value={kpis.totalEmployees.toLocaleString()}
          subtitle="Total workforce records"
          badgeText="Total"
          badgeType="info"
          icon={Users}
        />

        <KPICard
          title="Active Employees"
          value={kpis.activeEmployees.toLocaleString()}
          subtitle={`${kpis.retentionRate}% retention rate`}
          badgeText="Active"
          badgeType="success"
          icon={UserCheck}
        />

        <KPICard
          title="Attrition Rate"
          value={`${kpis.attritionRate}%`}
          subtitle={`${kpis.attritionCount} employees departed`}
          badgeText={kpis.attritionRate > 15 ? 'Elevated' : 'Normal'}
          badgeType={kpis.attritionRate > 15 ? 'warning' : 'neutral'}
          icon={TrendingDown}
        />

        <KPICard
          title="Average Monthly Income"
          value={`$${kpis.averageSalary.toLocaleString()}`}
          subtitle={`Median: $${kpis.medianSalary.toLocaleString()}`}
          badgeText="Compensation"
          badgeType="info"
          icon={DollarSign}
        />

        <KPICard
          title="Average Workforce Age"
          value={`${kpis.averageAge} yrs`}
          subtitle="Demographic baseline"
          badgeText="Age"
          badgeType="neutral"
          icon={Calendar}
        />

        <KPICard
          title="Average Tenure"
          value={`${kpis.averageTenure} yrs`}
          subtitle="Years at company"
          badgeText="Tenure"
          badgeType="neutral"
          icon={Clock}
        />

        <KPICard
          title="Overtime Rate"
          value={`${kpis.overtimeRate}%`}
          subtitle="Working overtime hours"
          badgeText={kpis.overtimeRate > 25 ? 'High' : 'Optimal'}
          badgeType={kpis.overtimeRate > 25 ? 'warning' : 'neutral'}
          icon={Zap}
        />

        <KPICard
          title="Avg Job Satisfaction"
          value={`${kpis.averageJobSatisfaction} / 5`}
          subtitle="1-5 rating scale"
          badgeText="Satisfaction"
          badgeType="success"
          icon={Smile}
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Headcount by Department</h3>
          <p className="text-xs text-navy-500 mb-4">Total workforce distribution across departments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#0062d6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Role Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Headcount by Job Role</h3>
          <p className="text-xs text-navy-500 mb-4">Distribution across key organizational roles</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={110} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#369eff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown (Donut) */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Gender Distribution</h3>
          <p className="text-xs text-navy-500 mb-4">Workforce headcount split by gender</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
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

        {/* Age Group Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Age Group Distribution</h3>
          <p className="text-xs text-navy-500 mb-4">Generational breakdown of the organization</p>
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
                <Bar dataKey="total" fill="#0b3876" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Level Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Employees by Job Level</h3>
          <p className="text-xs text-navy-500 mb-4">Hierarchical distribution across Levels 1-5</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} employees`, 'Headcount']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total" fill="#7cc2ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marital Status Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 mb-1">Marital Status Breakdown</h3>
          <p className="text-xs text-navy-500 mb-4">Demographic marital distribution</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maritalData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {maritalData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[(index + 2) % COLOR_PALETTE.length]} />
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

      </div>
    </div>
  );
}
