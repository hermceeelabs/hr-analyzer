import { EmployeeRecord, OverallKPIs } from '@/types/hr';

// Minimum sample size required to compute statistically meaningful flags/insights
export const MIN_SAMPLE_SIZE_THRESHOLD = 15;

export interface RuleInsight {
  id: string;
  category: 'attrition' | 'promotion' | 'compensation' | 'satisfaction';
  title: string;
  statement: string;
  type: 'danger' | 'warning' | 'positive' | 'info';
  confidence: 'High' | 'Medium' | 'Low';
  supportingMetric: string;
  sampleSize: number;
}

export interface PromotionRuleConfig {
  minTenureYears: number;
  minYearsSincePromotion: number;
}

export const DEFAULT_PROMOTION_CONFIG: PromotionRuleConfig = {
  minTenureYears: 5,
  minYearsSincePromotion: 4,
};

/**
 * Centralized evaluation rule for promotion candidacy.
 */
export function isPromotionCandidate(
  record: Partial<EmployeeRecord>,
  config: PromotionRuleConfig = DEFAULT_PROMOTION_CONFIG
): boolean {
  const tenure = Number(record.yearsAtCompany ?? 0);
  const sincePromotion = Number(record.yearsSinceLastPromotion ?? 0);
  return tenure >= config.minTenureYears && sincePromotion >= config.minYearsSincePromotion;
}

/**
 * Centralized Engine for Generating Empirical Data Insights.
 * Replaces hardcoded assumptions with dynamic statistical threshold checks.
 */
export function evaluateRuleInsights(
  records: EmployeeRecord[],
  kpis: OverallKPIs
): RuleInsight[] {
  const insights: RuleInsight[] = [];
  const total = records.length;

  if (total < MIN_SAMPLE_SIZE_THRESHOLD) {
    insights.push({
      id: 'insufficient-sample',
      category: 'attrition',
      title: 'Small Sample Size Warning',
      statement: `Filtered sample contains only ${total} employee records (below the threshold of ${MIN_SAMPLE_SIZE_THRESHOLD}). Insights are disabled to prevent skewed conclusions.`,
      type: 'info',
      confidence: 'Low',
      supportingMetric: `n = ${total}`,
      sampleSize: total,
    });
    return insights;
  }

  // ── 1. Overtime Attrition Impact Check ─────────────────────────────────────
  const otRecords = records.filter((r) => r.overTime);
  const noOtRecords = records.filter((r) => !r.overTime);

  if (otRecords.length >= MIN_SAMPLE_SIZE_THRESHOLD && noOtRecords.length >= MIN_SAMPLE_SIZE_THRESHOLD) {
    const otAttritionRate = (otRecords.filter((r) => r.attrition).length / otRecords.length) * 100;
    const noOtAttritionRate = (noOtRecords.filter((r) => r.attrition).length / noOtRecords.length) * 100;
    const delta = otAttritionRate - noOtAttritionRate;

    if (delta >= 5.0) {
      insights.push({
        id: 'ot-attrition-correlation',
        category: 'attrition',
        title: 'Elevated Overtime Attrition Risk',
        statement: `Overtime employees exhibit an attrition rate of ${otAttritionRate.toFixed(
          1
        )}%, which is +${delta.toFixed(1)}% higher than non-overtime staff (${noOtAttritionRate.toFixed(
          1
        )}%).`,
        type: 'danger',
        confidence: otRecords.length >= 30 ? 'High' : 'Medium',
        supportingMetric: `+${delta.toFixed(1)}% Overtime Delta`,
        sampleSize: otRecords.length,
      });
    } else {
      insights.push({
        id: 'ot-attrition-neutral',
        category: 'attrition',
        title: 'Overtime Attrition Neutrality',
        statement: `Overtime shows no statistically significant correlation with turnover (Delta: ${delta.toFixed(
          1
        )}%).`,
        type: 'info',
        confidence: 'High',
        supportingMetric: `${delta.toFixed(1)}% Delta`,
        sampleSize: otRecords.length,
      });
    }
  }

  // ── 2. Promotion Stagnation vs Departure ────────────────────────────────────
  const promoCandidates = records.filter((r) => r.promotionCandidateFlag);
  if (promoCandidates.length >= 5) {
    const promoAttrition = (promoCandidates.filter((r) => r.attrition).length / promoCandidates.length) * 100;
    if (promoAttrition > kpis.attritionRate + 3) {
      insights.push({
        id: 'promo-stagnation-risk',
        category: 'promotion',
        title: 'Promotion Stagnation Departure Correlation',
        statement: `Employees waiting 4+ years for promotion have an elevated turnover rate of ${promoAttrition.toFixed(
          1
        )}% (vs company average ${kpis.attritionRate.toFixed(1)}%).`,
        type: 'warning',
        confidence: promoCandidates.length >= 15 ? 'High' : 'Medium',
        supportingMetric: `${promoCandidates.length} Stagnant Employees`,
        sampleSize: promoCandidates.length,
      });
    }
  }

  // ── 3. Pay Equity & Performance Rating vs Hike ─────────────────────────────
  const topPerformers = records.filter((r) => r.performanceRating >= 4);
  if (topPerformers.length >= 5) {
    const avgTopHike = topPerformers.reduce((acc, r) => acc + r.percentSalaryHike, 0) / topPerformers.length;
    insights.push({
      id: 'top-performer-reward',
      category: 'compensation',
      title: 'Performance Reward Alignment',
      statement: `Top performing employees (Rating 4) receive an average salary hike of ${avgTopHike.toFixed(
        1
      )}%.`,
      type: avgTopHike >= 15 ? 'positive' : 'warning',
      confidence: topPerformers.length >= 15 ? 'High' : 'Medium',
      supportingMetric: `${avgTopHike.toFixed(1)}% Avg Hike`,
      sampleSize: topPerformers.length,
    });
  }

  return insights;
}
