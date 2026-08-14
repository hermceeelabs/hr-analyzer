import { describe, it, expect } from 'vitest';
import { normalizeRawRecord } from '../normalize';
import { calculateOverallKPIs, applyFilters } from '../engine';
import { evaluateRuleInsights, isPromotionCandidate } from '../rules';
import { INITIAL_FILTERS } from '../../store/useHRStore';

describe('HR Analytics Engine & Rules Unit Tests', () => {
  const sampleRawData = [
    { id: '1', Age: 35, Department: 'Sales', Attrition: 'Yes', OverTime: 'Yes', MonthlyIncome: 6000, YearsAtCompany: 6, YearsSinceLastPromotion: 4 },
    { id: '2', Age: 28, Department: 'Sales', Attrition: 'No', OverTime: 'No', MonthlyIncome: 4500, YearsAtCompany: 2, YearsSinceLastPromotion: 1 },
    { id: '3', Age: 42, Department: 'Research & Development', Attrition: 'No', OverTime: 'Yes', MonthlyIncome: 12000, YearsAtCompany: 10, YearsSinceLastPromotion: 5 },
    { id: '4', Age: 50, Department: 'Research & Development', Attrition: 'No', OverTime: 'No', MonthlyIncome: 15000, YearsAtCompany: 12, YearsSinceLastPromotion: 2 },
  ];

  it('normalizes raw records correctly and sets promotion flags', () => {
    const norm = normalizeRawRecord(sampleRawData[0], 0);
    expect(norm.age).toBe(35);
    expect(norm.department).toBe('Sales');
    expect(norm.attrition).toBe(true);
    expect(norm.overTime).toBe(true);
    expect(norm.promotionCandidateFlag).toBe(true);
  });

  it('tracks defaulted fields metadata for incomplete records', () => {
    const incompleteRaw = { id: '99', Department: 'Sales' };
    const norm = normalizeRawRecord(incompleteRaw, 0);
    expect(norm._meta?.isDefaulted).toBe(true);
    expect(norm._meta?.defaultedFields).toContain('Age');
  });

  it('calculates accurate overall KPIs across dataset', () => {
    const records = sampleRawData.map((r, i) => normalizeRawRecord(r, i));
    const kpis = calculateOverallKPIs(records);
    expect(kpis.totalEmployees).toBe(4);
    expect(kpis.attritionCount).toBe(1);
    expect(kpis.attritionRate).toBe(25);
    expect(kpis.retentionRate).toBe(75);
  });

  it('applies department filters accurately', () => {
    const records = sampleRawData.map((r, i) => normalizeRawRecord(r, i));
    const filtered = applyFilters(records, { ...INITIAL_FILTERS, department: 'Sales' });
    expect(filtered.length).toBe(2);
    expect(filtered.every((r) => r.department === 'Sales')).toBe(true);
  });

  it('centralized promotion rule evaluates tenure and promotion delay correctly', () => {
    expect(isPromotionCandidate({ yearsAtCompany: 5, yearsSinceLastPromotion: 4 })).toBe(true);
    expect(isPromotionCandidate({ yearsAtCompany: 3, yearsSinceLastPromotion: 4 })).toBe(false);
  });

  it('rule engine guards against insufficient sample size', () => {
    const records = sampleRawData.map((r, i) => normalizeRawRecord(r, i));
    const kpis = calculateOverallKPIs(records);
    const insights = evaluateRuleInsights(records, kpis);
    expect(insights.length).toBe(1);
    expect(insights[0].id).toBe('insufficient-sample');
  });
});
