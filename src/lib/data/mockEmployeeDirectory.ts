import { EmployeeProfile } from '@/types/qms';
import { EmployeeRecord } from '@/types/hr';

// Helper to generate a realistic employee directory profile combining IBM HR dataset attributes with directory fields
export function generateEmployeeDirectory(employeeRecords: EmployeeRecord[]): EmployeeProfile[] {
  const positionsByDept: Record<string, string[]> = {
    'Research & Development': [
      'Senior Research Scientist',
      'Software Engineer',
      'Data Scientist',
      'Laboratory Technician',
      'R&D Project Lead',
      'Systems Architect',
      'Product Development Specialist',
    ],
    Sales: [
      'Enterprise Account Executive',
      'Sales Operations Manager',
      'Regional Sales Director',
      'Business Development Representative',
      'Client Success Manager',
      'Technical Sales Engineer',
    ],
    'Human Resources': [
      'HR Business Partner',
      'Talent Acquisition Specialist',
      'Compensation & Benefits Analyst',
      'HR Operations Coordinator',
      'Learning & Development Lead',
    ],
  };

  const firstNames = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
    'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
    'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Jackson',
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  ];

  const managersByDept: Record<string, string[]> = {
    'Research & Development': ['Marcus Vance', 'Dr. Aris Thorne', 'Dr. Helen Vance'],
    Sales: ['Robert Sterling', 'Catherine Blake', 'David Miller'],
    'Human Resources': ['Elena Rostova', 'Rachel Green'],
  };

  return employeeRecords.map((emp, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 7) % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    const dept = emp.department || 'Research & Development';
    const deptPositions = positionsByDept[dept] || positionsByDept['Research & Development'];
    const position = deptPositions[index % deptPositions.length];
    const managerList = managersByDept[dept] || managersByDept['Research & Development'];
    const managerName = managerList[index % managerList.length];

    // Estimate start date based on yearsAtCompany
    const refYear = 2026;
    const startYear = refYear - Math.round(emp.yearsAtCompany || 1);
    const startMonth = String((index % 12) + 1).padStart(2, '0');
    const startDay = String(((index * 5) % 28) + 1).padStart(2, '0');

    return {
      id: emp.id,
      empId: emp.empId || `EMP-${(index + 1).toString().padStart(4, '0')}`,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hr-analyzer.local`,
      phone: `+1 (555) ${(100 + (index % 899)).toString()}-${(1000 + ((index * 3) % 8999)).toString()}`,
      department: dept,
      position,
      managerName,
      employmentStatus: emp.attrition ? 'Terminated' : (index % 17 === 0 ? 'On Leave' : 'Active'),
      startDate: `${startYear}-${startMonth}-${startDay}`,
      documentsCount: 2 + (index % 5),
      completedTrainingCount: Math.max(1, emp.trainingTimesLastYear || 2),
      pendingTrainingCount: index % 3 === 0 ? 1 : 0,
      leaveBalanceDays: 12 + (index % 15),
      performanceRating: emp.performanceRating || 3,
    };
  });
}
