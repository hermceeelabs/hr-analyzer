import { EmployeeRawRecord, EmployeeRecord } from '@/types/hr';
import { isPromotionCandidate } from './rules';

export interface RecordNormalizationMeta {
  isDefaulted: boolean;
  defaultedFields: string[];
}

export function normalizeRawRecord(raw: EmployeeRawRecord, index: number): EmployeeRecord & { _meta?: RecordNormalizationMeta } {
  const defaultedFields: string[] = [];

  // Helper to safely get numeric value and track if defaulted
  const getNum = (val: unknown, fieldName: string, fallback = 0): number => {
    if (val === null || val === undefined || val === '') {
      defaultedFields.push(fieldName);
      return fallback;
    }
    const num = Number(val);
    if (isNaN(num)) {
      defaultedFields.push(fieldName);
      return fallback;
    }
    return num;
  };

  // Helper to safely get string value
  const getStr = (val: unknown, fieldName: string, fallback = 'N/A'): string => {
    if (val === null || val === undefined || val === '') {
      defaultedFields.push(fieldName);
      return fallback;
    }
    return String(val).trim();
  };

  // Resolve EmpID
  const rawEmpId = raw.EmpID ?? raw.empId ?? raw.emp_id ?? raw.EmployeeNumber ?? raw.id;
  const empId = rawEmpId ? String(rawEmpId).trim() : `EMP-${(index + 1).toString().padStart(4, '0')}`;

  const age = getNum(raw.Age, 'Age', 30);
  const attritionRaw = getStr(raw.Attrition ?? raw.attrition, 'Attrition', 'No');
  const attrition = attritionRaw.toLowerCase() === 'yes' || attritionRaw.toLowerCase() === 'true';

  const overTimeRaw = getStr(raw.OverTime ?? raw.overTime ?? raw.overtime, 'OverTime', 'No');
  const overTime = overTimeRaw.toLowerCase() === 'yes' || overTimeRaw.toLowerCase() === 'true';

  const distance = getNum(raw.DistanceFromHome ?? raw.distanceFromHome, 'DistanceFromHome', 0);

  // Determine Distance Band
  let distanceBand = '0-5 km (Near)';
  if (distance > 20) {
    distanceBand = '20+ km (Very Far)';
  } else if (distance > 10) {
    distanceBand = '11-20 km (Far)';
  } else if (distance > 5) {
    distanceBand = '6-10 km (Moderate)';
  }

  const yearsAtCompany = getNum(raw.YearsAtCompany ?? raw.yearsAtCompany, 'YearsAtCompany', 0);
  const yearsSincePromotion = getNum(raw.YearsSinceLastPromotion ?? raw.yearsSinceLastPromotion, 'YearsSinceLastPromotion', 0);

  // Use centralized rules engine for promotion candidacy
  const promotionCandidateFlag = isPromotionCandidate({ yearsAtCompany, yearsSinceLastPromotion });

  // Age group fallback if not provided
  let ageGroup = getStr(raw.AgeGroup ?? raw.ageGroup, 'AgeGroup', '');
  if (!ageGroup || ageGroup === 'N/A') {
    if (age < 30) ageGroup = '18-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else ageGroup = '50+';
  }

  // Salary slab fallback if not provided
  const monthlyIncome = getNum(raw.MonthlyIncome ?? raw.monthlyIncome, 'MonthlyIncome', 0);
  let salarySlab = getStr(raw.SalarySlab ?? raw.salarySlab, 'SalarySlab', '');
  if (!salarySlab || salarySlab === 'N/A') {
    if (monthlyIncome < 5000) salarySlab = '< $5k';
    else if (monthlyIncome < 10000) salarySlab = '$5k - $10k';
    else if (monthlyIncome < 15000) salarySlab = '$10k - $15k';
    else salarySlab = '$15k+';
  }

  return {
    id: String(raw.id || `emp-${index}-${empId}`),
    empId,
    age,
    ageGroup,
    attrition,
    attritionRaw,
    businessTravel: getStr(raw.BusinessTravel ?? raw.businessTravel, 'BusinessTravel', 'Travel_Rarely'),
    dailyRate: getNum(raw.DailyRate ?? raw.dailyRate, 'DailyRate', 0),
    department: getStr(raw.Department ?? raw.department, 'Department', 'Research & Development'),
    distanceFromHome: distance,
    education: getNum(raw.Education ?? raw.education, 'Education', 3),
    educationField: getStr(raw.EducationField ?? raw.educationField, 'EducationField', 'Other'),
    employeeNumber: getNum(raw.EmployeeNumber ?? raw.employeeNumber, 'EmployeeNumber', index + 1),
    environmentSatisfaction: getNum(raw.EnvironmentSatisfaction ?? raw.environmentSatisfaction, 'EnvironmentSatisfaction', 3),
    gender: getStr(raw.Gender ?? raw.gender, 'Gender', 'Unspecified'),
    hourlyRate: getNum(raw.HourlyRate ?? raw.hourlyRate, 'HourlyRate', 0),
    jobInvolvement: getNum(raw.JobInvolvement ?? raw.jobInvolvement, 'JobInvolvement', 3),
    jobLevel: getNum(raw.JobLevel ?? raw.jobLevel, 'JobLevel', 1),
    jobRole: getStr(raw.JobRole ?? raw.jobRole, 'JobRole', 'Staff'),
    jobSatisfaction: getNum(raw.JobSatisfaction ?? raw.jobSatisfaction, 'JobSatisfaction', 3),
    maritalStatus: getStr(raw.MaritalStatus ?? raw.maritalStatus, 'MaritalStatus', 'Single'),
    monthlyIncome,
    salarySlab,
    monthlyRate: getNum(raw.MonthlyRate ?? raw.monthlyRate, 'MonthlyRate', 0),
    numCompaniesWorked: getNum(raw.NumCompaniesWorked ?? raw.numCompaniesWorked, 'NumCompaniesWorked', 0),
    over18: getStr(raw.Over18 ?? raw.over18, 'Over18', 'Y'),
    overTime,
    overTimeRaw,
    percentSalaryHike: getNum(raw.PercentSalaryHike ?? raw.percentSalaryHike, 'PercentSalaryHike', 0),
    performanceRating: getNum(raw.PerformanceRating ?? raw.performanceRating, 'PerformanceRating', 3),
    relationshipSatisfaction: getNum(raw.RelationshipSatisfaction ?? raw.relationshipSatisfaction, 'RelationshipSatisfaction', 3),
    standardHours: getNum(raw.StandardHours ?? raw.standardHours, 'StandardHours', 80),
    stockOptionLevel: getNum(raw.StockOptionLevel ?? raw.stockOptionLevel, 'StockOptionLevel', 0),
    totalWorkingYears: getNum(raw.TotalWorkingYears ?? raw.totalWorkingYears, 'TotalWorkingYears', 0),
    trainingTimesLastYear: getNum(raw.TrainingTimesLastYear ?? raw.trainingTimesLastYear, 'TrainingTimesLastYear', 0),
    workLifeBalance: getNum(raw.WorkLifeBalance ?? raw.workLifeBalance, 'WorkLifeBalance', 3),
    yearsAtCompany,
    yearsInCurrentRole: getNum(raw.YearsInCurrentRole ?? raw.yearsInCurrentRole, 'YearsInCurrentRole', 0),
    yearsSinceLastPromotion: yearsSincePromotion,
    yearsWithCurrManager: getNum(raw.YearsWithCurrManager ?? raw.yearsWithCurrManager, 'YearsWithCurrManager', 0),
    promotionCandidateFlag,
    distanceBand,
    _meta: {
      isDefaulted: defaultedFields.length > 0,
      defaultedFields,
    },
  };
}

export function normalizeRawDataset(rawRecords: EmployeeRawRecord[]): EmployeeRecord[] {
  return rawRecords.map((raw, index) => normalizeRawRecord(raw, index));
}
