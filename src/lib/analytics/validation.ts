import { EmployeeRawRecord, DataQualityMetrics, UploadValidationResult } from '@/types/hr';
import { normalizeRawDataset } from './normalize';

export const REQUIRED_HR_COLUMNS = [
  'EmpID',
  'Age',
  'Department',
  'JobRole',
  'MonthlyIncome',
  'Attrition',
  'Gender',
  'OverTime',
];

export const EXPECTED_ALL_COLUMNS = [
  'EmpID',
  'Age',
  'AgeGroup',
  'Attrition',
  'BusinessTravel',
  'DailyRate',
  'Department',
  'DistanceFromHome',
  'Education',
  'EducationField',
  'EmployeeCount',
  'EmployeeNumber',
  'EnvironmentSatisfaction',
  'Gender',
  'HourlyRate',
  'JobInvolvement',
  'JobLevel',
  'JobRole',
  'JobSatisfaction',
  'MaritalStatus',
  'MonthlyIncome',
  'SalarySlab',
  'MonthlyRate',
  'NumCompaniesWorked',
  'Over18',
  'OverTime',
  'PercentSalaryHike',
  'PerformanceRating',
  'RelationshipSatisfaction',
  'StandardHours',
  'StockOptionLevel',
  'TotalWorkingYears',
  'TrainingTimesLastYear',
  'WorkLifeBalance',
  'YearsAtCompany',
  'YearsInCurrentRole',
  'YearsSinceLastPromotion',
  'YearsWithCurrManager',
];

export function computeDataQualityMetrics(rawRecords: EmployeeRawRecord[]): DataQualityMetrics {
  const totalRecords = rawRecords.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      uniqueEmpIds: 0,
      duplicateEmpIdsCount: 0,
      duplicateEmpIds: [],
      columnMissingCounts: {},
      columnMissingPercentages: {},
      overallCompleteness: 100,
      potentialInvalidValues: [],
    };
  }

  // Count EmpIDs & check duplicates
  const empIdCounts = new Map<string, number>();
  let nullEmpIdCount = 0;

  rawRecords.forEach((r) => {
    const empId = r.EmpID ?? r.empId ?? r.EmployeeNumber;
    if (empId === undefined || empId === null || String(empId).trim() === '') {
      nullEmpIdCount++;
    } else {
      const key = String(empId).trim();
      empIdCounts.set(key, (empIdCounts.get(key) || 0) + 1);
    }
  });

  const duplicateEmpIds: string[] = [];
  empIdCounts.forEach((count, key) => {
    if (count > 1) duplicateEmpIds.push(key);
  });

  const uniqueEmpIds = empIdCounts.size;
  const duplicateEmpIdsCount = duplicateEmpIds.length;

  // Missing values analysis
  const columnMissingCounts: Record<string, number> = {};
  const columnMissingPercentages: Record<string, number> = {};
  let totalCellCount = 0;
  let totalMissingCells = 0;

  EXPECTED_ALL_COLUMNS.forEach((col) => {
    let missing = 0;
    rawRecords.forEach((rec) => {
      totalCellCount++;
      const val = rec[col] ?? rec[col.toLowerCase()];
      if (val === undefined || val === null || String(val).trim() === '' || String(val).trim() === 'N/A') {
        missing++;
        totalMissingCells++;
      }
    });
    columnMissingCounts[col] = missing;
    columnMissingPercentages[col] = Number(((missing / totalRecords) * 100).toFixed(1));
  });

  const overallCompleteness = totalCellCount > 0 
    ? Number((((totalCellCount - totalMissingCells) / totalCellCount) * 100).toFixed(1))
    : 100;

  // Check potential invalid values
  const potentialInvalidValues: Array<{ field: string; description: string; count: number }> = [];

  let invalidAgeCount = 0;
  let invalidIncomeCount = 0;
  let invalidSatisfactionCount = 0;

  rawRecords.forEach((r) => {
    const age = Number(r.Age);
    if (!isNaN(age) && (age < 18 || age > 100)) invalidAgeCount++;

    const income = Number(r.MonthlyIncome);
    if (!isNaN(income) && income < 0) invalidIncomeCount++;

    const sat = Number(r.JobSatisfaction);
    if (!isNaN(sat) && (sat < 1 || sat > 5)) invalidSatisfactionCount++;
  });

  if (nullEmpIdCount > 0) {
    potentialInvalidValues.push({
      field: 'EmpID',
      description: 'Records missing an Employee ID identifier',
      count: nullEmpIdCount,
    });
  }

  if (invalidAgeCount > 0) {
    potentialInvalidValues.push({
      field: 'Age',
      description: 'Age values out of standard workforce range (<18 or >100)',
      count: invalidAgeCount,
    });
  }

  if (invalidIncomeCount > 0) {
    potentialInvalidValues.push({
      field: 'MonthlyIncome',
      description: 'Negative or invalid Monthly Income values',
      count: invalidIncomeCount,
    });
  }

  if (invalidSatisfactionCount > 0) {
    potentialInvalidValues.push({
      field: 'JobSatisfaction',
      description: 'Satisfaction rating values outside 1-5 scale',
      count: invalidSatisfactionCount,
    });
  }

  return {
    totalRecords,
    uniqueEmpIds,
    duplicateEmpIdsCount,
    duplicateEmpIds,
    columnMissingCounts,
    columnMissingPercentages,
    overallCompleteness,
    potentialInvalidValues,
  };
}

export function validateUploadedDataset(rawRecords: EmployeeRawRecord[]): UploadValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawRecords || rawRecords.length === 0) {
    return {
      isValid: false,
      errors: ['Uploaded file contains no data or could not be parsed.'],
      warnings: [],
      totalRowsParsed: 0,
    };
  }

  const sampleRow = rawRecords[0];
  const presentColumns = Object.keys(sampleRow);
  const presentNormalized = presentColumns.map((c) => c.toLowerCase().trim());

  // Check required columns
  REQUIRED_HR_COLUMNS.forEach((reqCol) => {
    const found = presentNormalized.includes(reqCol.toLowerCase());
    if (!found) {
      errors.push(`Missing required column: ${reqCol}`);
    }
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
      totalRowsParsed: rawRecords.length,
    };
  }

  // Row-level validations
  let invalidIncomeCount = 0;
  let invalidAgeCount = 0;
  const empIds = new Set<string>();
  let duplicateCount = 0;

  rawRecords.forEach((r, idx) => {
    const age = Number(r.Age);
    if (isNaN(age) || age < 18) {
      invalidAgeCount++;
    }

    const income = Number(r.MonthlyIncome);
    if (isNaN(income) || income <= 0) {
      invalidIncomeCount++;
    }

    const empId = r.EmpID ?? r.empId ?? r.EmployeeNumber ?? `row-${idx}`;
    const key = String(empId).trim();
    if (empIds.has(key)) {
      duplicateCount++;
    } else {
      empIds.add(key);
    }
  });

  if (invalidIncomeCount > 0) {
    errors.push(`${invalidIncomeCount} records contain invalid or missing MonthlyIncome values.`);
  }

  if (invalidAgeCount > 0) {
    warnings.push(`${invalidAgeCount} records contain unusual or non-numeric Age values.`);
  }

  if (duplicateCount > 0) {
    warnings.push(`Dataset contains ${duplicateCount} duplicate EmpID entries.`);
  }

  const isValid = errors.length === 0;
  const records = isValid ? normalizeRawDataset(rawRecords) : undefined;

  return {
    isValid,
    errors,
    warnings,
    totalRowsParsed: rawRecords.length,
    records,
  };
}
