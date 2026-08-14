'use client';

import React, { useMemo } from 'react';
import { useHR } from '@/lib/store/useHRStore';
import { Filter, RotateCcw, Search, ChevronDown } from 'lucide-react';

export default function FilterPanel() {
  const { allRecords, filterState, setFilterState, resetFilters } = useHR();

  // Dynamically extract unique option values from active dataset
  const options = useMemo(() => {
    const depts = new Set<string>();
    const roles = new Set<string>();
    const levels = new Set<string>();
    const genders = new Set<string>();
    const ageGroups = new Set<string>();
    const marital = new Set<string>();
    const eduFields = new Set<string>();
    const travel = new Set<string>();
    const slabs = new Set<string>();

    allRecords.forEach((r) => {
      if (r.department) depts.add(r.department);
      if (r.jobRole) roles.add(r.jobRole);
      if (r.jobLevel) levels.add(`Level ${r.jobLevel}`);
      if (r.gender) genders.add(r.gender);
      if (r.ageGroup) ageGroups.add(r.ageGroup);
      if (r.maritalStatus) marital.add(r.maritalStatus);
      if (r.educationField) eduFields.add(r.educationField);
      if (r.businessTravel) travel.add(r.businessTravel);
      if (r.salarySlab) slabs.add(r.salarySlab);
    });

    return {
      departments: ['All', ...Array.from(depts).sort()],
      jobRoles: ['All', ...Array.from(roles).sort()],
      jobLevels: ['All', ...Array.from(levels).sort()],
      genders: ['All', ...Array.from(genders).sort()],
      ageGroups: ['All', ...Array.from(ageGroups).sort()],
      maritalStatuses: ['All', ...Array.from(marital).sort()],
      educationFields: ['All', ...Array.from(eduFields).sort()],
      businessTravels: ['All', ...Array.from(travel).sort()],
      salarySlabs: ['All', ...Array.from(slabs).sort()],
    };
  }, [allRecords]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filterState).forEach(([key, val]) => {
      if (key !== 'searchQuery' && val !== 'All') count++;
      if (key === 'searchQuery' && val.trim() !== '') count++;
    });
    return count;
  }, [filterState]);

  const handleChange = (key: string, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-xs mb-6">
      
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-100 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Interactive Filter Panel
          </h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold">
              {activeFilterCount} active
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-navy-600 hover:text-rose-600 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        
        {/* Search */}
        <div className="col-span-2 sm:col-span-2 space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Search Employee</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-navy-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Role, Department..."
              value={filterState.searchQuery}
              onChange={(e) => handleChange('searchQuery', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-navy-200 rounded-lg text-navy-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Department</label>
          <select
            value={filterState.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.departments.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Job Role */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Job Role</label>
          <select
            value={filterState.jobRole}
            onChange={(e) => handleChange('jobRole', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.jobRoles.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Job Level */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Job Level</label>
          <select
            value={filterState.jobLevel}
            onChange={(e) => handleChange('jobLevel', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.jobLevels.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Attrition Status */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Attrition Status</label>
          <select
            value={filterState.attrition}
            onChange={(e) => handleChange('attrition', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Yes">Left (Attrition = Yes)</option>
            <option value="No">Active (Attrition = No)</option>
          </select>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Gender</label>
          <select
            value={filterState.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.genders.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Age Group */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Age Group</label>
          <select
            value={filterState.ageGroup}
            onChange={(e) => handleChange('ageGroup', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.ageGroups.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Overtime */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">OverTime</label>
          <select
            value={filterState.overTime}
            onChange={(e) => handleChange('overTime', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            <option value="All">All Overtime</option>
            <option value="Yes">Overtime Yes</option>
            <option value="No">Overtime No</option>
          </select>
        </div>

        {/* Business Travel */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Business Travel</label>
          <select
            value={filterState.businessTravel}
            onChange={(e) => handleChange('businessTravel', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.businessTravels.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Marital Status */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Marital Status</label>
          <select
            value={filterState.maritalStatus}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.maritalStatuses.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Slab */}
        <div className="space-y-1">
          <label className="font-semibold text-navy-700 block text-[11px]">Salary Slab</label>
          <select
            value={filterState.salarySlab}
            onChange={(e) => handleChange('salarySlab', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-navy-200 rounded-lg text-navy-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
          >
            {options.salarySlabs.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
