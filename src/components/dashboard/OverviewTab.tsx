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
  CartesianGrid,
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
  PieChart as PieIcon,
  Heart,
} from 'lucide-react';

export default function OverviewTab() {
  const { kpis, filteredRecords } = useHR();

  const deptData = groupByDepartment(filteredRecords);
  const roleData = groupByJobRole(filteredRecords);
  const levelData = groupByJobLevel(filteredRecords);
  const ageData = groupByAgeGroup(filteredRecords);
  const genderData = groupByGender(filteredRecords);
  const maritalData = groupByMaritalStatus(filteredRecords);

  const totalHeadcount = filteredRecords.length || 1;

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

      {/* Compact Demographic Stat Rows (Replaces oversized Donut Chart cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Gender Stat Row */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-2 mb-3">
            <PieIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">Gender Distribution Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genderData.map((g) => {
              const pct = ((g.total / totalHeadcount) * 100).toFixed(1);
              return (
                <div key={g.category} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{g.category}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{g.total}</span>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marital Status Stat Row */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-4 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">Marital Status Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {maritalData.map((m) => {
              const pct = ((m.total / totalHeadcount) * 100).toFixed(1);
              return (
                <div key={m.category} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{m.category}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{m.total}</span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Headcount by Department</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Total workforce distribution across departments</p>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Headcount by Job Role</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Distribution across key organizational roles</p>
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

        {/* Age Group Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Age Group Distribution</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Generational breakdown of the organization</p>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-navy-100 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">Employees by Job Level</h3>
          <p className="text-xs text-navy-500 dark:text-slate-400 mb-4">Hierarchical distribution across Levels 1-5</p>
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

      </div>
    </div>
  );
}
