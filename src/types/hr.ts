export interface EmployeeRawRecord {
  id?: string;
  EmpID?: string | number | null;
  Age?: number | string | null;
  AgeGroup?: string | null;
  Attrition?: string | null;
  BusinessTravel?: string | null;
  DailyRate?: number | string | null;
  Department?: string | null;
  DistanceFromHome?: number | string | null;
  Education?: number | string | null;
  EducationField?: string | null;
  EmployeeCount?: number | string | null;
  EmployeeNumber?: number | string | null;
  EnvironmentSatisfaction?: number | string | null;
  Gender?: string | null;
  HourlyRate?: number | string | null;
  JobInvolvement?: number | string | null;
  JobLevel?: number | string | null;
  JobRole?: string | null;
  JobSatisfaction?: number | string | null;
  MaritalStatus?: string | null;
  MonthlyIncome?: number | string | null;
  SalarySlab?: string | null;
  MonthlyRate?: number | string | null;
  NumCompaniesWorked?: number | string | null;
  Over18?: string | null;
  OverTime?: string | null;
  PercentSalaryHike?: number | string | null;
  PerformanceRating?: number | string | null;
  RelationshipSatisfaction?: number | string | null;
  StandardHours?: number | string | null;
  StockOptionLevel?: number | string | null;
  TotalWorkingYears?: number | string | null;
  TrainingTimesLastYear?: number | string | null;
  WorkLifeBalance?: number | string | null;
  YearsAtCompany?: number | string | null;
  YearsInCurrentRole?: number | string | null;
  YearsSinceLastPromotion?: number | string | null;
  YearsWithCurrManager?: number | string | null;
  [key: string]: unknown;
}

export interface EmployeeRecord {
  id: string;
  empId: string;
  age: number;
  ageGroup: string;
  attrition: boolean; // true = Yes (Left), false = No (Active)
  attritionRaw: string;
  businessTravel: string;
  dailyRate: number;
  department: string;
  distanceFromHome: number;
  education: number;
  educationField: string;
  employeeNumber: number;
  environmentSatisfaction: number;
  gender: string;
  hourlyRate: number;
  jobInvolvement: number;
  jobLevel: number;
  jobRole: string;
  jobSatisfaction: number;
  maritalStatus: string;
  monthlyIncome: number;
  salarySlab: string;
  monthlyRate: number;
  numCompaniesWorked: number;
  over18: string;
  overTime: boolean; // true = Yes, false = No
  overTimeRaw: string;
  percentSalaryHike: number;
  performanceRating: number;
  relationshipSatisfaction: number;
  standardHours: number;
  stockOptionLevel: number;
  totalWorkingYears: number;
  trainingTimesLastYear: number;
  workLifeBalance: number;
  yearsAtCompany: number;
  yearsInCurrentRole: number;
  yearsSinceLastPromotion: number;
  yearsWithCurrManager: number;
  // Analytical Flags
  promotionCandidateFlag: boolean; // e.g. yearsAtCompany >= 5 && yearsSinceLastPromotion >= 4
  distanceBand: string;
}

export interface HRFilterState {
  department: string;
  jobRole: string;
  jobLevel: string;
  gender: string;
  ageGroup: string;
  maritalStatus: string;
  educationField: string;
  businessTravel: string;
  overTime: string;
  salarySlab: string;
  attrition: string;
  searchQuery: string;
}

export type DataSourceMode = 'demo' | 'uploaded';

export interface DataQualityMetrics {
  totalRecords: number;
  uniqueEmpIds: number;
  duplicateEmpIdsCount: number;
  duplicateEmpIds: string[];
  columnMissingCounts: Record<string, number>;
  columnMissingPercentages: Record<string, number>;
  overallCompleteness: number;
  potentialInvalidValues: Array<{
    field: string;
    description: string;
    count: number;
  }>;
}

export interface UploadValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalRowsParsed: number;
  records?: EmployeeRecord[];
}

export interface GroupedAggregation {
  category: string;
  total: number;
  active: number;
  attritionCount: number;
  attritionRate: number;
  avgSalary: number;
  avgHike: number;
  avgTenure: number;
  avgSatisfaction: number;
  avgPerformance: number;
  avgWorkLifeBalance: number;
  avgTraining: number;
}

export interface OverallKPIs {
  totalEmployees: number;
  activeEmployees: number;
  attritionCount: number;
  attritionRate: number;
  retentionRate: number;
  averageSalary: number;
  medianSalary: number;
  averageAge: number;
  averageTenure: number;
  overtimeRate: number;
  averageJobSatisfaction: number;
  averagePerformance: number;
  averageTraining: number;
  averageDistance: number;
}

export interface CustomReport {
  id: string;
  title: string;
  createdAt: string;
  filters: Partial<HRFilterState>;
  selectedKPIs: string[];
  selectedCharts: string[];
  executiveSummary: string;
  commentary: string;
  dataSource: DataSourceMode;
  enableComparison?: boolean;
  comparisonMode?: 'cohort' | 'date';
  periodALabel?: string;
  periodBLabel?: string;
  kpisA?: OverallKPIs;
  kpisB?: OverallKPIs;
  recordsA?: EmployeeRecord[];
  recordsB?: EmployeeRecord[];
}
