/* ============================================
   Vitta Financial Blueprint — per-goal engine
   Each goal gets its own horizon-appropriate asset
   allocation (a 2-year car goal shouldn't carry the
   same equity load as a 25-year retirement goal),
   its own required SIP, and a combined affordability
   pass across every goal in the plan.
   ============================================ */

import { inflationAdjusted, retirementCorpus, lumpsumFutureValue, goalSIP } from '../utils/calculations';
import { getGoalType } from './blueprintData';

const LIFE_EXPECTANCY = 85;
// 8% p.a. — matches the site's own RetirementPlanning.jsx calculator default (a more
// conservative, largely-debt mix post-retirement), so this tool's retirement corpus
// doesn't diverge sharply from what the standalone Retirement calculator would show
// for the same inputs.
const POST_RETIREMENT_RETURN = 8;

// === HORIZON-CAPPED ASSET ALLOCATION ===
// Base equity weight scales with time-to-goal, then nudged by risk profile —
// same modifier convention as the site's other allocation logic (see
// src/ai/PlanningEngine.js's calculateAssetAllocation), just horizon-based
// instead of age-based since a plan now has goals of very different lengths.
export function calculateGoalAllocation(yearsToTarget, riskProfile = 'moderate') {
  let baseEquity;
  if (yearsToTarget <= 2) baseEquity = 10;
  else if (yearsToTarget <= 5) baseEquity = 30;
  else if (yearsToTarget <= 7) baseEquity = 45;
  else if (yearsToTarget <= 12) baseEquity = 60;
  else baseEquity = 72;

  const modifiers = { conservative: -15, moderate: 0, aggressive: 12 };
  let equity = Math.max(10, Math.min(85, baseEquity + (modifiers[riskProfile] || 0)));
  equity = Math.round(equity);

  const remaining = 100 - equity;
  const debt = Math.round(remaining * 0.60);
  const gold = Math.round(remaining * 0.25);
  const reit = Math.max(0, remaining - debt - gold);

  return { equity, debt, gold, reit };
}

export function blendedReturn(allocation) {
  return (
    (allocation.equity / 100) * 12 +
    (allocation.debt / 100) * 7.5 +
    (allocation.gold / 100) * 8.5 +
    ((allocation.reit || 0) / 100) * 9
  );
}

// === SINGLE GOAL ANALYSIS ===
export function analyzeGoal(goal, { currentAge, inflation = 6, monthlyExpenses = 0, emiPayments = 0, riskProfile = 'moderate' }) {
  const goalType = getGoalType(goal.type);
  const yearsToTarget = Math.max(1, (goal.targetAge || currentAge + 1) - currentAge);
  const isRetirement = goal.type === 'retirement';

  let futureValueTarget;
  if (isRetirement) {
    const futureMonthlyExpense = (monthlyExpenses + emiPayments * 0.3);
    const yearsInRetirement = Math.max(5, LIFE_EXPECTANCY - (goal.targetAge || currentAge + 30));
    futureValueTarget = retirementCorpus(futureMonthlyExpense, inflation, yearsToTarget, yearsInRetirement, POST_RETIREMENT_RETURN);
  } else {
    futureValueTarget = inflationAdjusted(goal.targetAmountToday || 0, inflation, yearsToTarget);
  }

  const allocation = calculateGoalAllocation(yearsToTarget, riskProfile);
  const rate = blendedReturn(allocation);

  const currentProvision = Number(goal.currentProvision) || 0;
  const currentProvisionFV = lumpsumFutureValue(currentProvision, rate, yearsToTarget);
  const remainingTarget = Math.max(0, futureValueTarget - currentProvisionFV);
  const requiredMonthlySIP = goalSIP(remainingTarget, rate, yearsToTarget);
  const fundedPercent = futureValueTarget > 0 ? Math.min(100, Math.round((currentProvisionFV / futureValueTarget) * 100)) : 100;

  return {
    id: goal.id,
    type: goal.type,
    label: isRetirement ? 'Retirement' : (goal.name?.trim() || goalType.label),
    icon: goalType.icon,
    priority: goal.priority || 'medium',
    targetAge: goal.targetAge,
    yearsToTarget,
    isRetirement,
    targetAmountToday: isRetirement ? null : Math.round(goal.targetAmountToday || 0),
    futureValueTarget: Math.round(futureValueTarget),
    allocation,
    blendedRatePct: Math.round(rate * 10) / 10,
    currentProvision,
    currentProvisionFV: Math.round(currentProvisionFV),
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    fundedPercent,
    totalInvested: Math.round(currentProvision + requiredMonthlySIP * yearsToTarget * 12),
  };
}

// === COMBINED AFFORDABILITY ACROSS ALL GOALS ===
// Greedy allocation by priority (High -> Medium -> Low), then by nearest target
// date within the same priority, so the surplus funds the most urgent / most
// important goals first and flags whichever ones don't fit.
export function prioritizeAndAllocate(analyzedGoals, availableSurplus) {
  const priorityRank = { high: 0, medium: 1, low: 2 };
  const ordered = [...analyzedGoals].sort((a, b) => {
    const pr = (priorityRank[a.priority] ?? 1) - (priorityRank[b.priority] ?? 1);
    return pr !== 0 ? pr : a.yearsToTarget - b.yearsToTarget;
  });

  const totalRequiredSIP = analyzedGoals.reduce((s, g) => s + g.requiredMonthlySIP, 0);
  let remainingSurplus = Math.max(0, availableSurplus);

  const allocated = ordered.map((g) => {
    const funded = Math.min(g.requiredMonthlySIP, remainingSurplus);
    remainingSurplus -= funded;
    return { ...g, allocatedSIP: Math.round(funded), affordable: funded >= g.requiredMonthlySIP - 1 };
  });

  // Restore original (as-entered) order for display, keep the allocation numbers computed above.
  const byId = new Map(allocated.map((g) => [g.id, g]));
  const goals = analyzedGoals.map((g) => byId.get(g.id));

  return {
    goals,
    totalRequiredSIP: Math.round(totalRequiredSIP),
    availableSurplus: Math.round(Math.max(0, availableSurplus)),
    isFullyAffordable: totalRequiredSIP <= availableSurplus + 1,
    shortfall: Math.max(0, Math.round(totalRequiredSIP - availableSurplus)),
  };
}
