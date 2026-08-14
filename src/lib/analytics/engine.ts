import { EmployeeRecord, OverallKPIs, GroupedAggregation, HRFilterState } from '@/types/hr';

// --- KPI CALCULATIONS ---

export function calculateTotalEmployees(records: EmployeeRecord[]): number {
  return records.length;
}

export function calculateActiveEmployees(records: EmployeeRecord[]): number {
  return records.filter((r) => !r.attrition).length;
}

export function calculateAttritionCount(records: EmployeeRecord[]): number {
  return records.filter((r) => r.attrition).length;
}

export function calculateAttritionRate(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const count = calculateAttritionCount(records);
  return Number(((count / records.length) * 100).toFixed(1));
}

export function calculateRetentionRate(records: EmployeeRecord[]): number {
  if (records.length === 0) return 100;
  return Number((100 - calculateAttritionRate(records)).toFixed(1));
}

export function calculateAverageSalary(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.monthlyIncome, 0);
  return Math.round(sum / records.length);
}

export function calculateMedianSalary(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sorted = [...records].map((r) => r.monthlyIncome).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function calculateAverageAge(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.age, 0);
  return Number((sum / records.length).toFixed(1));
}

export function calculateAverageTenure(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.yearsAtCompany, 0);
  return Number((sum / records.length).toFixed(1));
}

export function calculateOvertimeRate(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const otCount = records.filter((r) => r.overTime).length;
  return Number(((otCount / records.length) * 100).toFixed(1));
}

export function calculateAverageJobSatisfaction(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.jobSatisfaction, 0);
  return Number((sum / records.length).toFixed(2));
}

export function calculateAveragePerformance(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.performanceRating, 0);
  return Number((sum / records.length).toFixed(2));
}

export function calculateAverageTraining(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.trainingTimesLastYear, 0);
  return Number((sum / records.length).toFixed(1));
}

export function calculateAverageDistance(records: EmployeeRecord[]): number {
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.distanceFromHome, 0);
  return Number((sum / records.length).toFixed(1));
}

export function calculateOverallKPIs(records: EmployeeRecord[]): OverallKPIs {
  return {
    totalEmployees: calculateTotalEmployees(records),
    activeEmployees: calculateActiveEmployees(records),
    attritionCount: calculateAttritionCount(records),
    attritionRate: calculateAttritionRate(records),
    retentionRate: calculateRetentionRate(records),
    averageSalary: calculateAverageSalary(records),
    medianSalary: calculateMedianSalary(records),
    averageAge: calculateAverageAge(records),
    averageTenure: calculateAverageTenure(records),
    overtimeRate: calculateOvertimeRate(records),
    averageJobSatisfaction: calculateAverageJobSatisfaction(records),
    averagePerformance: calculateAveragePerformance(records),
    averageTraining: calculateAverageTraining(records),
    averageDistance: calculateAverageDistance(records),
  };
}

// --- GROUPING & AGGREGATION FUNCTIONS ---

export function groupRecordsByField(
  records: EmployeeRecord[],
  keyExtractor: (r: EmployeeRecord) => string
): GroupedAggregation[] {
  const groups: Record<string, EmployeeRecord[]> = {};

  for (const rec of records) {
    const key = keyExtractor(rec) || 'Unspecified';
    if (!groups[key]) groups[key] = [];
    groups[key].push(rec);
  }

  return Object.entries(groups).map(([category, items]) => {
    const total = items.length;
    const attritionCount = items.filter((r) => r.attrition).length;
    const active = total - attritionCount;
    const attritionRate = total > 0 ? Number(((attritionCount / total) * 100).toFixed(1)) : 0;
    const avgSalary = total > 0 ? Math.round(items.reduce((a, b) => a + b.monthlyIncome, 0) / total) : 0;
    const avgHike = total > 0 ? Number((items.reduce((a, b) => a + b.percentSalaryHike, 0) / total).toFixed(1)) : 0;
    const avgTenure = total > 0 ? Number((items.reduce((a, b) => a + b.yearsAtCompany, 0) / total).toFixed(1)) : 0;
    const avgSatisfaction = total > 0 ? Number((items.reduce((a, b) => a + b.jobSatisfaction, 0) / total).toFixed(2)) : 0;
    const avgPerformance = total > 0 ? Number((items.reduce((a, b) => a + b.performanceRating, 0) / total).toFixed(2)) : 0;
    const avgWorkLifeBalance = total > 0 ? Number((items.reduce((a, b) => a + b.workLifeBalance, 0) / total).toFixed(2)) : 0;
    const avgTraining = total > 0 ? Number((items.reduce((a, b) => a + b.trainingTimesLastYear, 0) / total).toFixed(1)) : 0;

    return {
      category,
      total,
      active,
      attritionCount,
      attritionRate,
      avgSalary,
      avgHike,
      avgTenure,
      avgSatisfaction,
      avgPerformance,
      avgWorkLifeBalance,
      avgTraining,
    };
  });
}

export function groupByDepartment(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.department);
}

export function groupByJobRole(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.jobRole);
}

export function groupByJobLevel(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => `Level ${r.jobLevel}`).sort((a, b) => a.category.localeCompare(b.category));
}

export function groupByGender(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.gender);
}

export function groupByAgeGroup(records: EmployeeRecord[]): GroupedAggregation[] {
  const order = ['18-29', '30-39', '40-49', '50+'];
  const agg = groupRecordsByField(records, (r) => r.ageGroup);
  return agg.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

export function groupBySalarySlab(records: EmployeeRecord[]): GroupedAggregation[] {
  const order = ['< $5k', '$5k - $10k', '$10k - $15k', '$15k+'];
  const agg = groupRecordsByField(records, (r) => r.salarySlab);
  return agg.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

export function groupByMaritalStatus(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.maritalStatus);
}

export function groupByEducationField(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.educationField);
}

export function groupByBusinessTravel(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => r.businessTravel);
}

export function groupByOvertime(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => (r.overTime ? 'Overtime (Yes)' : 'No Overtime'));
}

export function groupByDistanceBand(records: EmployeeRecord[]): GroupedAggregation[] {
  const order = ['0-5 km (Near)', '6-10 km (Moderate)', '11-20 km (Far)', '20+ km (Very Far)'];
  const agg = groupRecordsByField(records, (r) => r.distanceBand);
  return agg.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

export function groupByPerformanceRating(records: EmployeeRecord[]): GroupedAggregation[] {
  return groupRecordsByField(records, (r) => `Rating ${r.performanceRating}`).sort((a, b) => a.category.localeCompare(b.category));
}

// --- FILTERING ENGINE ---

export function applyFilters(records: EmployeeRecord[], filters: HRFilterState): EmployeeRecord[] {
  return records.filter((r) => {
    if (filters.department && filters.department !== 'All' && r.department !== filters.department) {
      return false;
    }
    if (filters.jobRole && filters.jobRole !== 'All' && r.jobRole !== filters.jobRole) {
      return false;
    }
    if (filters.jobLevel && filters.jobLevel !== 'All' && `Level ${r.jobLevel}` !== filters.jobLevel) {
      return false;
    }
    if (filters.gender && filters.gender !== 'All' && r.gender !== filters.gender) {
      return false;
    }
    if (filters.ageGroup && filters.ageGroup !== 'All' && r.ageGroup !== filters.ageGroup) {
      return false;
    }
    if (filters.maritalStatus && filters.maritalStatus !== 'All' && r.maritalStatus !== filters.maritalStatus) {
      return false;
    }
    if (filters.educationField && filters.educationField !== 'All' && r.educationField !== filters.educationField) {
      return false;
    }
    if (filters.businessTravel && filters.businessTravel !== 'All' && r.businessTravel !== filters.businessTravel) {
      return false;
    }
    if (filters.overTime && filters.overTime !== 'All') {
      const isOt = filters.overTime === 'Yes';
      if (r.overTime !== isOt) return false;
    }
    if (filters.salarySlab && filters.salarySlab !== 'All' && r.salarySlab !== filters.salarySlab) {
      return false;
    }
    if (filters.attrition && filters.attrition !== 'All') {
      const isAttr = filters.attrition === 'Yes';
      if (r.attrition !== isAttr) return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = r.empId.toLowerCase().includes(q);
      const matchRole = r.jobRole.toLowerCase().includes(q);
      const matchDept = r.department.toLowerCase().includes(q);
      if (!matchId && !matchRole && !matchDept) return false;
    }
    return true;
  });
}
