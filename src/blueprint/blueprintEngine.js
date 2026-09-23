/* ============================================
   Vitta Financial Blueprint — planning engine
   Rule-based educational financial estimation engine,
   goal-based (unlike src/ai/PlanningEngine.js, which
   only ever models one implicit goal: retirement).
   100% client-side, zero data sent anywhere. Output is
   illustrative only and is not personalized investment,
   insurance or tax advice.
   ============================================ */

import { insuranceNeed, humanLifeValue } from '../utils/calculations';
import { analyzeGoal, prioritizeAndAllocate } from './blueprintGoals';
import { estimateGoalPostTaxCorpus, estimatePortfolioGainsTax } from './blueprintTax';
import { getPortfolioType } from './blueprintData';

export class BlueprintEngine {
  constructor(profile) {
    this.profile = profile;
    this.totalMonthlyIncome = (profile.monthlyIncome || 0) + (profile.otherIncome || 0);
    this.annualIncome = this.totalMonthlyIncome * 12;
  }

  // === CASH FLOW ===
  calculateSavingsRate() {
    const income = this.totalMonthlyIncome;
    const { monthlyExpenses = 0, emiPayments = 0 } = this.profile;
    const totalOutflow = monthlyExpenses + emiPayments;
    const savings = Math.max(0, income - totalOutflow);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      monthlySavings: savings,
      savingsRate: Math.round(savingsRate * 10) / 10,
      status: savingsRate >= 35 ? 'excellent' : savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'needs-improvement' : 'critical',
    };
  }

  // === EMERGENCY FUND ===
  assessEmergencyFund() {
    const { monthlyExpenses = 0, emiPayments = 0, emergencyFund = 0 } = this.profile;
    const monthlyNeed = monthlyExpenses + emiPayments;
    const required = monthlyNeed * 6;
    const monthsCovered = monthlyNeed > 0 ? emergencyFund / monthlyNeed : 0;
    const gap = Math.max(0, required - emergencyFund);

    return {
      required: Math.round(required),
      current: emergencyFund,
      gap: Math.round(gap),
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      status: monthsCovered >= 6 ? 'adequate' : monthsCovered >= 3 ? 'partial' : 'critical',
    };
  }

  // === PORTFOLIO ===
  currentPortfolioValue() {
    return (this.profile.portfolio || []).reduce((sum, p) => sum + (Number(p.currentValue) || 0), 0);
  }

  assessPortfolioTax() {
    return estimatePortfolioGainsTax(this.profile.portfolio || [], getPortfolioType);
  }

  // === GOALS ===
  analyzeGoals() {
    const { age, inflation = 6, monthlyExpenses = 0, emiPayments = 0, riskProfile } = this.profile;
    const context = { currentAge: age, inflation, monthlyExpenses, emiPayments, riskProfile: riskProfile || 'moderate' };
    const analyzed = (this.profile.goals || []).map((g) => analyzeGoal(g, context));
    const savings = this.calculateSavingsRate();
    const allocation = prioritizeAndAllocate(analyzed, savings.monthlySavings * 0.85); // keep ~15% buffer, mirrors PlanningEngine's 80% investable convention
    return allocation; // { goals, totalRequiredSIP, availableSurplus, isFullyAffordable, shortfall }
  }

  // === GOAL TAX EFFICIENCY (post-tax corpus per goal) ===
  analyzeGoalsTax(goalsAnalysis) {
    const rows = goalsAnalysis.goals.map((g) => {
      const postTax = estimateGoalPostTaxCorpus({
        totalCorpus: g.futureValueTarget,
        totalInvested: g.totalInvested,
        allocation: g.allocation,
        yearsToTarget: g.yearsToTarget,
        annualIncome: this.annualIncome,
      });
      return { id: g.id, label: g.label, yearsToTarget: g.yearsToTarget, ...postTax };
    });
    const totals = rows.reduce(
      (acc, r) => ({
        preTaxCorpus: acc.preTaxCorpus + r.preTaxCorpus,
        tax: acc.tax + r.tax,
        postTaxCorpus: acc.postTaxCorpus + r.postTaxCorpus,
      }),
      { preTaxCorpus: 0, tax: 0, postTaxCorpus: 0 }
    );
    return { rows, totals };
  }

  // === OVERALL RECOMMENDED ALLOCATION (age + risk based summary) ===
  calculateOverallAllocation() {
    const { age, riskProfile = 'moderate' } = this.profile;
    let equityPercent = Math.max(20, Math.min(80, 100 - age));
    const modifiers = { conservative: -15, moderate: 0, aggressive: 12 };
    equityPercent = Math.max(15, Math.min(85, equityPercent + (modifiers[riskProfile] || 0)));
    equityPercent = Math.round(equityPercent);

    const remaining = 100 - equityPercent;
    const debtPercent = Math.round(remaining * 0.60);
    const goldPercent = Math.round(remaining * 0.25);
    const reitPercent = Math.max(0, remaining - debtPercent - goldPercent);

    return { equity: equityPercent, debt: debtPercent, gold: goldPercent, reit: reitPercent, riskProfile };
  }

  // NOTE: naming specific fund categories/schemes tailored to a user's personal
  // inputs can read as personalized investment advice. Keep instrument names
  // generic/illustrative until this feature is gated behind proper SEBI
  // Investment Adviser registration (mirrors the same note in PlanningEngine.js).
  mapToInstruments(allocation) {
    const instruments = [];
    if (allocation.equity > 0) {
      instruments.push({ name: 'Nifty 50 Index Fund', category: 'Equity', percentOfTotal: Math.round(allocation.equity * 0.45) });
      instruments.push({ name: this.profile.age < 40 ? 'Flexi-cap / Mid-cap Fund' : 'Large-cap Fund', category: 'Equity', percentOfTotal: Math.round(allocation.equity * 0.30) });
      instruments.push({ name: this.annualIncome > 500000 ? 'ELSS Tax Saver Fund' : 'Nifty Next 50 Index Fund', category: 'Equity', percentOfTotal: Math.round(allocation.equity * 0.25) });
    }
    if (allocation.debt > 0) {
      instruments.push({ name: 'PPF', category: 'Debt', percentOfTotal: Math.round(allocation.debt * 0.45) });
      if (this.profile.age < 55) instruments.push({ name: 'NPS Tier-I', category: 'Debt', percentOfTotal: Math.round(allocation.debt * 0.30) });
      instruments.push({ name: 'Short-term Debt Fund / FD', category: 'Debt', percentOfTotal: Math.round(allocation.debt * 0.25) });
    }
    if (allocation.gold > 0) instruments.push({ name: 'Gold ETF / Sovereign Gold Bond', category: 'Gold', percentOfTotal: allocation.gold });

    const total = instruments.reduce((s, i) => s + i.percentOfTotal, 0);
    if (total !== 100 && total > 0 && instruments.length) instruments[0].percentOfTotal += 100 - total;
    return instruments;
  }

  // === COMBINED WEALTH PROJECTION (existing portfolio + total allocated SIP) ===
  projectCombinedWealth(goalsAnalysis) {
    const retirementGoal = (this.profile.goals || []).find((g) => g.type === 'retirement');
    const maxYears = Math.max(1, ...goalsAnalysis.goals.map((g) => g.yearsToTarget), (retirementGoal?.targetAge || this.profile.age + 30) - this.profile.age);

    const overallAllocation = this.calculateOverallAllocation();
    const rate = (overallAllocation.equity / 100) * 12 + (overallAllocation.debt / 100) * 7.5 + (overallAllocation.gold / 100) * 8.5 + (overallAllocation.reit / 100) * 9;
    const r = rate / 100 / 12;

    const monthlyInvestment = goalsAnalysis.goals.reduce((s, g) => s + g.allocatedSIP, 0);
    const existingValue = this.currentPortfolioValue();

    const projection = [];
    for (let year = 1; year <= maxYears; year++) {
      const n = year * 12;
      const existingFV = existingValue * Math.pow(1 + rate / 100, year);
      const sipFV = r === 0 ? monthlyInvestment * n : monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const corpus = existingFV + sipFV;
      const invested = existingValue + monthlyInvestment * n;
      projection.push({ year, age: this.profile.age + year, invested: Math.round(invested), corpus: Math.round(corpus), gains: Math.round(corpus - invested) });
    }

    return {
      projectedReturn: Math.round(rate * 10) / 10,
      projectionData: projection,
      monthlyInvestment: Math.round(monthlyInvestment),
      finalCorpus: projection.length ? projection[projection.length - 1].corpus : existingValue,
      totalInvested: projection.length ? projection[projection.length - 1].invested : existingValue,
    };
  }

  // === LIFE INSURANCE GAP ===
  // Cross-checks two standard methods and recommends the higher figure, same
  // idea as the site's Old-vs-New tax regime comparison — show both, be transparent.
  assessLifeInsuranceGap(goalsAnalysis) {
    const { age, dependents = 0, termCover = 0, monthlyExpenses = 0, cityTier } = this.profile;
    const retirementGoal = (this.profile.goals || []).find((g) => g.type === 'retirement');
    const yearsToRetire = Math.max(1, (retirementGoal?.targetAge || age + 30) - age);
    const annualExpenses = monthlyExpenses * 12;

    const hlv = Math.max(0, humanLifeValue(this.annualIncome, annualExpenses, yearsToRetire, 8));

    const futureCosts = (goalsAnalysis.goals || [])
      .filter((g) => g.type === 'education' || g.type === 'marriage')
      .reduce((s, g) => s + g.futureValueTarget, 0);
    const needMethod = Math.max(0, insuranceNeed(this.annualIncome, Math.min(yearsToRetire, 20), 0, termCover, futureCosts));

    const recommendedCover = Math.max(hlv, needMethod);
    const gap = Math.max(0, recommendedCover - termCover);

    return {
      humanLifeValue: Math.round(hlv),
      needBasedCover: Math.round(needMethod),
      recommendedCover: Math.round(recommendedCover),
      existingCover: termCover,
      gap: Math.round(gap),
      hasDependents: dependents > 0,
      status: gap <= 0 ? 'adequate' : gap < recommendedCover * 0.3 ? 'partial' : 'critical',
      cityTier,
    };
  }

  // === HEALTH INSURANCE GAP ===
  assessHealthInsuranceGap() {
    const { cityTier = 'tier1', maritalStatus, dependents = 0, healthCover = 0 } = this.profile;
    const familySize = 1 + (maritalStatus === 'married' ? 1 : 0) + dependents;

    const tiers = {
      tier1: [[600000, 500000], [1200000, 1000000], [2500000, 2000000], [Infinity, 5000000]],
      tier2: [[600000, 300000], [1200000, 750000], [2500000, 1500000], [Infinity, 3000000]],
      tier3: [[600000, 300000], [1200000, 500000], [2500000, 1000000], [Infinity, 2000000]],
    };
    const table = tiers[cityTier] || tiers.tier1;
    const bracket = table.find(([ceiling]) => this.annualIncome < ceiling) || table[table.length - 1];
    const recommendedCover = Math.max(500000, bracket[1]);
    const gap = Math.max(0, recommendedCover - healthCover);

    return {
      recommendedCover,
      existingCover: healthCover,
      gap: Math.round(gap),
      familySize,
      status: gap <= 0 ? 'adequate' : gap < recommendedCover * 0.3 ? 'partial' : 'critical',
    };
  }

  // === FINANCIAL HEALTH SCORE ===
  calculateHealthScore(goalsAnalysis, lifeInsurance, healthInsurance) {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();

    let savingsScore = savings.savingsRate >= 35 ? 20 : savings.savingsRate >= 25 ? 17 : savings.savingsRate >= 20 ? 14 : savings.savingsRate >= 10 ? 8 : 3;
    let emergencyScore = emergency.monthsCovered >= 6 ? 15 : emergency.monthsCovered >= 4 ? 10 : emergency.monthsCovered >= 2 ? 6 : 2;

    let insuranceScore = 0;
    const lifeOk = lifeInsurance.status === 'adequate' || !lifeInsurance.hasDependents;
    const healthOk = healthInsurance.status === 'adequate';
    if (lifeOk && healthOk) insuranceScore = 15;
    else if (lifeOk || healthOk) insuranceScore = 9;
    else insuranceScore = 2;

    const dti = this.totalMonthlyIncome > 0 ? ((this.profile.emiPayments || 0) / this.totalMonthlyIncome) * 100 : 0;
    let debtScore = dti === 0 ? 15 : dti <= 20 ? 13 : dti <= 35 ? 9 : dti <= 50 ? 5 : 1;

    const portfolioTax = this.assessPortfolioTax();
    let diversifyScore = 0;
    const classesHeld = new Set((this.profile.portfolio || []).map((p) => getPortfolioType(p.type).taxClass));
    diversifyScore = Math.min(15, classesHeld.size * 4);

    const readinessPercent = goalsAnalysis.totalRequiredSIP > 0
      ? Math.min(100, Math.round((goalsAnalysis.availableSurplus / goalsAnalysis.totalRequiredSIP) * 100))
      : 100;
    let goalScore = readinessPercent >= 100 ? 20 : readinessPercent >= 80 ? 16 : readinessPercent >= 60 ? 12 : readinessPercent >= 40 ? 8 : 3;

    const total = savingsScore + emergencyScore + insuranceScore + debtScore + diversifyScore + goalScore;
    const score = Math.min(100, total);

    return {
      score,
      breakdown: {
        savingsRate: { score: savingsScore, max: 20, label: 'Savings Rate' },
        emergencyFund: { score: emergencyScore, max: 15, label: 'Emergency Fund' },
        insurance: { score: insuranceScore, max: 15, label: 'Insurance Cover' },
        debtRatio: { score: debtScore, max: 15, label: 'Debt Ratio' },
        diversification: { score: diversifyScore, max: 15, label: 'Diversification' },
        goalReadiness: { score: goalScore, max: 20, label: 'Goal Readiness' },
      },
      grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F',
      label: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : score >= 40 ? 'Needs Work' : 'Critical',
      _portfolioTax: portfolioTax, // stashed so generateFullPlan doesn't recompute it
    };
  }

  // === ACTION PLAN ===
  generateActionPlan(goalsAnalysis, lifeInsurance, healthInsurance) {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();
    const actions = [];

    if (emergency.status === 'critical') {
      actions.push({ priority: 'critical', title: 'Build Emergency Fund', description: `You have ${emergency.monthsCovered} months of expenses saved — build up to 6 months (~₹${emergency.required.toLocaleString('en-IN')}).`, link: '/calculator/emergency-fund' });
    }
    if (lifeInsurance.status === 'critical' && lifeInsurance.hasDependents) {
      actions.push({ priority: 'critical', title: 'Get Term Life Insurance', description: `Estimated additional cover needed: ₹${lifeInsurance.gap.toLocaleString('en-IN')}.`, link: '/calculator/insurance-need' });
    }
    if (healthInsurance.status === 'critical') {
      actions.push({ priority: 'critical', title: 'Get Health Insurance', description: `Recommended cover for your family size: ₹${healthInsurance.recommendedCover.toLocaleString('en-IN')}.`, link: '/calculator/human-life-value' });
    }
    if (!goalsAnalysis.isFullyAffordable) {
      actions.push({ priority: 'critical', title: 'Your Goals Need More Than You Can Currently Invest', description: `Required monthly investment across all goals is ₹${goalsAnalysis.totalRequiredSIP.toLocaleString('en-IN')}, but your surplus is ₹${goalsAnalysis.availableSurplus.toLocaleString('en-IN')}. Consider re-prioritizing, extending timelines, or increasing income.`, link: '/financial-plan' });
    }

    if (emergency.status === 'partial') {
      actions.push({ priority: 'important', title: 'Strengthen Emergency Fund', description: `${Math.ceil(6 - emergency.monthsCovered)} more months of cover needed.`, link: '/calculator/emergency-fund' });
    }
    if (savings.savingsRate >= 10 && savings.savingsRate < 20) {
      actions.push({ priority: 'important', title: 'Boost Savings Rate to 20%', description: `Currently at ${savings.savingsRate}%. Review discretionary spending to free up more for your goals.`, link: '/calculator/sip-calculator' });
    }
    if (lifeInsurance.status === 'partial') {
      actions.push({ priority: 'important', title: 'Top Up Life Insurance', description: `Additional cover of ₹${lifeInsurance.gap.toLocaleString('en-IN')} recommended.`, link: '/calculator/insurance-need' });
    }

    actions.push({ priority: 'optimize', title: 'Automate Your Goal SIPs', description: 'Set up auto-debit SIPs matching the allocation for each goal so investing stays consistent.', link: '/calculator/sip-calculator' });
    if (this.annualIncome > 500000) {
      actions.push({ priority: 'optimize', title: 'Optimize Tax Savings', description: 'Maximize 80C/80D deductions and compare Old vs New tax regime.', link: '/calculator/tax-calculator' });
    }
    actions.push({ priority: 'optimize', title: 'Review Annually', description: 'Revisit this plan once a year, or after any major life event, to keep it accurate.', link: '/financial-plan' });

    return actions;
  }

  // === FULL PLAN ===
  generateFullPlan() {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();
    const goalsAnalysis = this.analyzeGoals();
    const goalsTax = this.analyzeGoalsTax(goalsAnalysis);
    const overallAllocation = this.calculateOverallAllocation();
    const instruments = this.mapToInstruments(overallAllocation);
    const projection = this.projectCombinedWealth(goalsAnalysis);
    const lifeInsurance = this.assessLifeInsuranceGap(goalsAnalysis);
    const healthInsurance = this.assessHealthInsuranceGap();
    const healthScore = this.calculateHealthScore(goalsAnalysis, lifeInsurance, healthInsurance);
    const portfolioTax = healthScore._portfolioTax;
    delete healthScore._portfolioTax;
    const actions = this.generateActionPlan(goalsAnalysis, lifeInsurance, healthInsurance);

    return {
      profile: this.profile,
      savings,
      emergency,
      goalsAnalysis,
      goalsTax,
      overallAllocation,
      instruments,
      projection,
      lifeInsurance,
      healthInsurance,
      healthScore,
      portfolioTax,
      actions,
      currentPortfolioValue: this.currentPortfolioValue(),
    };
  }
}
