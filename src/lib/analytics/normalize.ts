import { EmployeeRawRecord, EmployeeRecord } from '@/types/hr';

export function normalizeRawRecord(raw: EmployeeRawRecord, index: number): EmployeeRecord {
  // Helper to safely get numeric value
  const getNum = (val: unknown, fallback = 0): number => {
    if (val === null || val === undefined || val === '') return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Helper to safely get string value
  const getStr = (val: unknown, fallback = 'N/A'): string => {
    if (val === null || val === undefined || val === '') return fallback;
    return String(val).trim();
  };

  // Resolve EmpID
  const rawEmpId = raw.EmpID ?? raw.empId ?? raw.emp_id ?? raw.EmployeeNumber ?? raw.id;
  const empId = rawEmpId ? String(rawEmpId).trim() : `EMP-${(index + 1).toString().padStart(4, '0')}`;

  const age = getNum(raw.Age, 30);
  const attritionRaw = getStr(raw.Attrition ?? raw.attrition, 'No');
  const attrition = attritionRaw.toLowerCase() === 'yes' || attritionRaw.toLowerCase() === 'true';

  const overTimeRaw = getStr(raw.OverTime ?? raw.overTime ?? raw.overtime, 'No');
  const overTime = overTimeRaw.toLowerCase() === 'yes' || overTimeRaw.toLowerCase() === 'true';

  const distance = getNum(raw.DistanceFromHome ?? raw.distanceFromHome, 0);

  // Determine Distance Band
  let distanceBand = '0-5 km (Near)';
  if (distance > 20) {
    distanceBand = '20+ km (Very Far)';
  } else if (distance > 10) {
    distanceBand = '11-20 km (Far)';
  } else if (distance > 5) {
    distanceBand = '6-10 km (Moderate)';
  }

  const yearsAtCompany = getNum(raw.YearsAtCompany ?? raw.yearsAtCompany, 0);
  const yearsSincePromotion = getNum(raw.YearsSinceLastPromotion ?? raw.yearsSinceLastPromotion, 0);

  // Promotion candidate threshold: at least 5 years at company and >= 4 years since promotion
  const promotionCandidateFlag = yearsAtCompany >= 5 && yearsSincePromotion >= 4;

  // Age group fallback if not provided
  let ageGroup = getStr(raw.AgeGroup ?? raw.ageGroup, '');
  if (!ageGroup || ageGroup === 'N/A') {
    if (age < 30) ageGroup = '18-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else ageGroup = '50+';
  }

  // Salary slab fallback if not provided
  const monthlyIncome = getNum(raw.MonthlyIncome ?? raw.monthlyIncome, 0);
  let salarySlab = getStr(raw.SalarySlab ?? raw.salarySlab, '');
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
    businessTravel: getStr(raw.BusinessTravel ?? raw.businessTravel, 'Travel_Rarely'),
    dailyRate: getNum(raw.DailyRate ?? raw.dailyRate, 0),
    department: getStr(raw.Department ?? raw.department, 'Research & Development'),
    distanceFromHome: distance,
    education: getNum(raw.Education ?? raw.education, 3),
    educationField: getStr(raw.EducationField ?? raw.educationField, 'Other'),
    employeeNumber: getNum(raw.EmployeeNumber ?? raw.employeeNumber, index + 1),
    environmentSatisfaction: getNum(raw.EnvironmentSatisfaction ?? raw.environmentSatisfaction, 3),
    gender: getStr(raw.Gender ?? raw.gender, 'Unspecified'),
    hourlyRate: getNum(raw.HourlyRate ?? raw.hourlyRate, 0),
    jobInvolvement: getNum(raw.JobInvolvement ?? raw.jobInvolvement, 3),
    jobLevel: getNum(raw.JobLevel ?? raw.jobLevel, 1),
    jobRole: getStr(raw.JobRole ?? raw.jobRole, 'Staff'),
    jobSatisfaction: getNum(raw.JobSatisfaction ?? raw.jobSatisfaction, 3),
    maritalStatus: getStr(raw.MaritalStatus ?? raw.maritalStatus, 'Single'),
    monthlyIncome,
    salarySlab,
    monthlyRate: getNum(raw.MonthlyRate ?? raw.monthlyRate, 0),
    numCompaniesWorked: getNum(raw.NumCompaniesWorked ?? raw.numCompaniesWorked, 0),
    over18: getStr(raw.Over18 ?? raw.over18, 'Y'),
    overTime,
    overTimeRaw,
    percentSalaryHike: getNum(raw.PercentSalaryHike ?? raw.percentSalaryHike, 0),
    performanceRating: getNum(raw.PerformanceRating ?? raw.performanceRating, 3),
    relationshipSatisfaction: getNum(raw.RelationshipSatisfaction ?? raw.relationshipSatisfaction, 3),
    standardHours: getNum(raw.StandardHours ?? raw.standardHours, 80),
    stockOptionLevel: getNum(raw.StockOptionLevel ?? raw.stockOptionLevel, 0),
    totalWorkingYears: getNum(raw.TotalWorkingYears ?? raw.totalWorkingYears, 0),
    trainingTimesLastYear: getNum(raw.TrainingTimesLastYear ?? raw.trainingTimesLastYear, 0),
    workLifeBalance: getNum(raw.WorkLifeBalance ?? raw.workLifeBalance, 3),
    yearsAtCompany,
    yearsInCurrentRole: getNum(raw.YearsInCurrentRole ?? raw.yearsInCurrentRole, 0),
    yearsSinceLastPromotion: yearsSincePromotion,
    yearsWithCurrManager: getNum(raw.YearsWithCurrManager ?? raw.yearsWithCurrManager, 0),
    promotionCandidateFlag,
    distanceBand,
  };
}

export function normalizeRawDataset(rawRecords: EmployeeRawRecord[]): EmployeeRecord[] {
  return rawRecords.map((raw, index) => normalizeRawRecord(raw, index));
}
