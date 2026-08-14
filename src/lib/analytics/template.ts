import { EXPECTED_ALL_COLUMNS } from './validation';
import * as XLSX from 'xlsx';

export const SAMPLE_TEMPLATE_ROWS = [
  {
    EmpID: 'EMP-0001',
    Age: 41,
    AgeGroup: '40-49',
    Attrition: 'No',
    BusinessTravel: 'Travel_Rarely',
    DailyRate: 1102,
    Department: 'Sales',
    DistanceFromHome: 1,
    Education: 2,
    EducationField: 'Life Sciences',
    EmployeeCount: 1,
    EmployeeNumber: 1,
    EnvironmentSatisfaction: 2,
    Gender: 'Female',
    HourlyRate: 94,
    JobInvolvement: 3,
    JobLevel: 2,
    JobRole: 'Sales Executive',
    JobSatisfaction: 4,
    MaritalStatus: 'Single',
    MonthlyIncome: 5993,
    SalarySlab: '$5k - $10k',
    MonthlyRate: 19479,
    NumCompaniesWorked: 8,
    Over18: 'Y',
    OverTime: 'Yes',
    PercentSalaryHike: 11,
    PerformanceRating: 3,
    RelationshipSatisfaction: 1,
    StandardHours: 80,
    StockOptionLevel: 0,
    TotalWorkingYears: 8,
    TrainingTimesLastYear: 0,
    WorkLifeBalance: 1,
    YearsAtCompany: 6,
    YearsInCurrentRole: 4,
    YearsSinceLastPromotion: 0,
    YearsWithCurrManager: 5,
  },
  {
    EmpID: 'EMP-0002',
    Age: 32,
    AgeGroup: '30-39',
    Attrition: 'Yes',
    BusinessTravel: 'Travel_Frequently',
    DailyRate: 850,
    Department: 'Research & Development',
    DistanceFromHome: 12,
    Education: 4,
    EducationField: 'Medical',
    EmployeeCount: 1,
    EmployeeNumber: 2,
    EnvironmentSatisfaction: 4,
    Gender: 'Male',
    HourlyRate: 60,
    JobInvolvement: 2,
    JobLevel: 1,
    JobRole: 'Research Scientist',
    JobSatisfaction: 2,
    MaritalStatus: 'Married',
    MonthlyIncome: 3400,
    SalarySlab: '< $5k',
    MonthlyRate: 14000,
    NumCompaniesWorked: 1,
    Over18: 'Y',
    OverTime: 'No',
    PercentSalaryHike: 15,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StandardHours: 80,
    StockOptionLevel: 1,
    TotalWorkingYears: 5,
    TrainingTimesLastYear: 3,
    WorkLifeBalance: 3,
    YearsAtCompany: 3,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 2,
  },
];

export function downloadHRTemplateCSV(): void {
  const headers = EXPECTED_ALL_COLUMNS.join(',');
  const rows = SAMPLE_TEMPLATE_ROWS.map((row) =>
    EXPECTED_ALL_COLUMNS.map((col) => {
      const val = (row as Record<string, unknown>)[col] ?? '';
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(',')
  ).join('\n');

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'HR_Analytics_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadHRTemplateXLSX(): void {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_TEMPLATE_ROWS, {
    header: EXPECTED_ALL_COLUMNS,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HR Data Template');
  XLSX.writeFile(workbook, 'HR_Analytics_Template.xlsx');
}
