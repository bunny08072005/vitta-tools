/* ============================================
   Vitta AI — Planning Engine v2
   Rule-based educational financial estimation engine
   100% client-side, zero data sent anywhere.
   Output is illustrative only and is not personalized
   investment advice.
   ============================================ */

export class PlanningEngine {
  constructor(profile) {
    this.profile = profile;
    // Include other income in total monthly income
    this.totalMonthlyIncome = (profile.monthlyIncome || 0) + (profile.otherIncome || 0);
  }

  // === SAVINGS ANALYSIS ===
  calculateSavingsRate() {
    const income = this.totalMonthlyIncome;
    const { monthlyExpenses = 0, emiPayments = 0 } = this.profile;
    const totalOutflow = monthlyExpenses + emiPayments;
    const savings = Math.max(0, income - totalOutflow);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      monthlySavings: savings,
      savingsRate: Math.round(savingsRate * 10) / 10,
      idealRate: 20,
      gap: Math.max(0, 20 - savingsRate),
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
      required,
      current: emergencyFund,
      gap,
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      status: monthsCovered >= 6 ? 'adequate' : monthsCovered >= 3 ? 'partial' : 'critical',
      recommendation: gap > 0
        ? `Build ₹${Math.round(gap).toLocaleString('en-IN')} more in emergency fund (${Math.ceil(6 - monthsCovered)} months of expenses needed)`
        : 'Your emergency fund covers 6+ months of expenses ✓',
    };
  }

  // === INSURANCE GAP ===
  assessInsurance() {
    const { age, existingLifeCover = 0, dependents = 0 } = this.profile;
    const annualIncome = this.totalMonthlyIncome * 12;

    // HLV-based multiplier (decreases with age)
    const multiplier = age < 30 ? 15 : age < 35 ? 12 : age < 40 ? 10 : age < 50 ? 8 : 6;
    const idealCover = annualIncome * multiplier;
    const gap = Math.max(0, idealCover - existingLifeCover);

    return {
      idealCover,
      currentCover: existingLifeCover,
      gap,
      multiplier,
      hasDependents: dependents > 0,
      status: gap <= 0 ? 'adequate' : gap < idealCover * 0.3 ? 'partial' : 'critical',
      recommendation: dependents === 0
        ? 'No dependents — life insurance need is lower, but a basic term plan is commonly considered'
        : gap > 0
          ? `Estimated additional term life cover: ₹${Math.round(gap).toLocaleString('en-IN')} (${multiplier}x your annual income)`
          : 'Life insurance coverage is adequate based on this estimate ✓',
    };
  }

  // === ASSET ALLOCATION ===
  calculateAssetAllocation() {
    const { age, riskProfile = 'moderate' } = this.profile;

    // Base equity = 100 - age (more conservative than 110 for India)
    let equityPercent = Math.max(20, Math.min(80, 100 - age));

    // Risk modifier
    const modifiers = { conservative: -15, moderate: 0, aggressive: 12 };
    equityPercent = Math.max(15, Math.min(85, equityPercent + (modifiers[riskProfile] || 0)));
    equityPercent = Math.round(equityPercent);

    const remaining = 100 - equityPercent;
    const debtPercent = Math.round(remaining * 0.60);
    const goldPercent = Math.round(remaining * 0.25);
    const reitPercent = Math.max(0, remaining - debtPercent - goldPercent);

    return {
      equity: equityPercent,
      debt: debtPercent,
      gold: goldPercent,
      reit: reitPercent,
      riskProfile,
      rationale: `Based on age ${age} with ${riskProfile} risk profile`,
    };
  }

  // === INSTRUMENT MAPPING ===
  // NOTE: Naming specific fund categories/schemes tailored to a user's personal
  // financial inputs can read as personalized investment advice. Before this
  // feature is enabled for real users, keep instrument names generic/illustrative
  // (e.g. "index fund", "tax-saving fund") or gate this behind proper SEBI
  // Investment Adviser registration.
  mapToInstruments(allocation) {
    const { age } = this.profile;
    const annualIncome = this.totalMonthlyIncome * 12;
    const instruments = [];

    // Equity instruments
    if (allocation.equity > 0) {
      const eqShare = allocation.equity;
      instruments.push({
        name: 'Nifty 50 Index Fund',
        category: 'Equity',
        percentOfTotal: Math.round(eqShare * 0.45),
        reason: 'Low-cost broad market exposure — core holding',
      });

      if (age < 40) {
        instruments.push({
          name: 'Flexi-cap / Mid-cap Fund',
          category: 'Equity',
          percentOfTotal: Math.round(eqShare * 0.30),
          reason: 'Higher growth potential for younger investors',
        });
      } else {
        instruments.push({
          name: 'Large-cap Fund',
          category: 'Equity',
          percentOfTotal: Math.round(eqShare * 0.30),
          reason: 'Stable large-cap growth for wealth preservation',
        });
      }

      if (annualIncome > 500000) {
        instruments.push({
          name: 'ELSS Tax Saver Fund',
          category: 'Equity',
          percentOfTotal: Math.round(eqShare * 0.25),
          reason: '80C tax saving + equity growth — 3-year lock-in',
        });
      } else {
        instruments.push({
          name: 'Nifty Next 50 Index Fund',
          category: 'Equity',
          percentOfTotal: Math.round(eqShare * 0.25),
          reason: 'Next 50 large-cap companies for diversification',
        });
      }
    }

    // Debt instruments
    if (allocation.debt > 0) {
      instruments.push({
        name: 'PPF (Public Provident Fund)',
        category: 'Debt',
        percentOfTotal: Math.round(allocation.debt * 0.45),
        reason: '7.1% tax-free returns + 80C benefit (15-year lock-in)',
      });

      if (age < 55) {
        instruments.push({
          name: 'NPS Tier-I',
          category: 'Debt',
          percentOfTotal: Math.round(allocation.debt * 0.30),
          reason: 'Extra ₹50K tax benefit under 80CCD(1B) + pension',
        });
      }

      instruments.push({
        name: 'Short-term Debt Fund / FD',
        category: 'Debt',
        percentOfTotal: Math.round(allocation.debt * 0.25),
        reason: 'Liquidity + stability for medium-term goals',
      });
    }

    // Gold
    if (allocation.gold > 0) {
      instruments.push({
        name: 'Gold ETF / Sovereign Gold Bond',
        category: 'Gold',
        percentOfTotal: allocation.gold,
        reason: 'Inflation hedge + portfolio diversification',
      });
    }

    // Normalize percentOfTotal to sum to 100
    const totalPercent = instruments.reduce((s, inst) => s + inst.percentOfTotal, 0);
    if (totalPercent !== 100 && totalPercent > 0) {
      const diff = 100 - totalPercent;
      instruments[0].percentOfTotal += diff; // adjust first instrument
    }

    return instruments;
  }

  // === SIP PLAN ===
  calculateSIPPlan(allocation, instruments) {
    const savings = this.calculateSavingsRate();
    // Use 80% of savings for investments (keep 20% buffer)
    const monthlyInvestable = Math.round(savings.monthlySavings * 0.80);

    return instruments.map(inst => ({
      ...inst,
      monthlySIP: Math.round((inst.percentOfTotal / 100) * monthlyInvestable),
      annualAmount: Math.round((inst.percentOfTotal / 100) * monthlyInvestable * 12),
    }));
  }

  // === WEALTH PROJECTION ===
  projectWealth(monthlyInvestment, allocationPercents) {
    const yearsToRetire = Math.max(1, (this.profile.retirementAge || 60) - this.profile.age);

    // Weighted average return based on allocation
    const weightedReturn =
      (allocationPercents.equity / 100) * 12 +
      (allocationPercents.debt / 100) * 7.5 +
      (allocationPercents.gold / 100) * 8.5 +
      ((allocationPercents.reit || 0) / 100) * 9;

    const r = weightedReturn / 100 / 12;
    const projection = [];

    // Include existing investments as starting corpus
    const existingInvestments = this.profile.existingInvestments || 0;

    for (let year = 1; year <= yearsToRetire; year++) {
      const n = year * 12;

      // Future value of existing investments (lumpsum compounding)
      const existingFV = existingInvestments * Math.pow(1 + weightedReturn / 100, year);

      // Future value of SIP
      const sipFV = r === 0
        ? monthlyInvestment * n
        : monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

      const totalCorpus = existingFV + sipFV;
      const totalInvested = existingInvestments + monthlyInvestment * n;

      projection.push({
        year,
        age: this.profile.age + year,
        invested: Math.round(totalInvested),
        corpus: Math.round(totalCorpus),
        gains: Math.round(totalCorpus - totalInvested),
      });
    }

    return {
      projectedReturn: Math.round(weightedReturn * 10) / 10,
      projectionData: projection,
      finalCorpus: projection.length > 0 ? projection[projection.length - 1].corpus : 0,
      totalInvested: projection.length > 0 ? projection[projection.length - 1].invested : 0,
    };
  }

  // === RETIREMENT READINESS ===
  assessRetirement(projection) {
    const { monthlyExpenses = 0, emiPayments = 0, retirementAge = 60, age } = this.profile;
    const yearsToRetire = retirementAge - age;
    const inflationRate = 6;
    const lifeExpectancy = 85;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Future monthly expenses at retirement (inflation-adjusted)
    const futureMonthlyExpense = (monthlyExpenses + emiPayments * 0.3) * Math.pow(1 + inflationRate / 100, yearsToRetire);
    const annualExpense = futureMonthlyExpense * 12;

    // Required corpus using present value of annuity for retirement years
    // Assuming post-retirement return of 7% and inflation of 5% → real return ~2%
    const realReturnPost = 0.02;
    let requiredCorpus;
    if (realReturnPost === 0) {
      requiredCorpus = annualExpense * yearsInRetirement;
    } else {
      requiredCorpus = annualExpense * (1 - Math.pow(1 + realReturnPost, -yearsInRetirement)) / realReturnPost;
    }

    const gap = Math.max(0, requiredCorpus - projection.finalCorpus);

    return {
      requiredCorpus: Math.round(requiredCorpus),
      projectedCorpus: projection.finalCorpus,
      gap: Math.round(gap),
      futureMonthlyExpense: Math.round(futureMonthlyExpense),
      yearsToRetire,
      status: gap <= 0 ? 'on-track' : gap < requiredCorpus * 0.3 ? 'close' : 'behind',
      readinessPercent: requiredCorpus > 0 ? Math.min(100, Math.round((projection.finalCorpus / requiredCorpus) * 100)) : 100,
    };
  }

  // === FINANCIAL HEALTH SCORE ===
  calculateHealthScore() {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();
    const insurance = this.assessInsurance();
    const allocation = this.calculateAssetAllocation();
    const instruments = this.mapToInstruments(allocation);
    const sipPlan = this.calculateSIPPlan(allocation, instruments);
    const totalMonthlySIP = sipPlan.reduce((sum, s) => sum + s.monthlySIP, 0);
    const projection = this.projectWealth(totalMonthlySIP, allocation);
    const retirement = this.assessRetirement(projection);

    // Each category scored independently
    let savingsScore = 0;
    if (savings.savingsRate >= 35) savingsScore = 20;
    else if (savings.savingsRate >= 25) savingsScore = 17;
    else if (savings.savingsRate >= 20) savingsScore = 14;
    else if (savings.savingsRate >= 10) savingsScore = 8;
    else savingsScore = 3;

    let emergencyScore = 0;
    if (emergency.monthsCovered >= 6) emergencyScore = 15;
    else if (emergency.monthsCovered >= 4) emergencyScore = 10;
    else if (emergency.monthsCovered >= 2) emergencyScore = 6;
    else emergencyScore = 2;

    let insuranceScore = 0;
    if (insurance.status === 'adequate') insuranceScore = 15;
    else if (insurance.status === 'partial') insuranceScore = 9;
    else if (!insurance.hasDependents) insuranceScore = 12;
    else insuranceScore = 2;

    let debtScore = 0;
    const dti = this.totalMonthlyIncome > 0 ? ((this.profile.emiPayments || 0) / this.totalMonthlyIncome) * 100 : 0;
    if (dti === 0) debtScore = 15;
    else if (dti <= 20) debtScore = 13;
    else if (dti <= 35) debtScore = 9;
    else if (dti <= 50) debtScore = 5;
    else debtScore = 1;

    let diversifyScore = 0;
    if (allocation.equity >= 20) diversifyScore += 5;
    if (allocation.debt >= 10) diversifyScore += 5;
    if (allocation.gold >= 5) diversifyScore += 5;

    let retirementScore = 0;
    if (retirement.readinessPercent >= 100) retirementScore = 20;
    else if (retirement.readinessPercent >= 80) retirementScore = 16;
    else if (retirement.readinessPercent >= 60) retirementScore = 12;
    else if (retirement.readinessPercent >= 40) retirementScore = 8;
    else retirementScore = 3;

    const total = savingsScore + emergencyScore + insuranceScore + debtScore + diversifyScore + retirementScore;
    const score = Math.min(100, total);

    return {
      score,
      breakdown: {
        savingsRate: { score: savingsScore, max: 20, label: 'Savings Rate' },
        emergencyFund: { score: emergencyScore, max: 15, label: 'Emergency Fund' },
        insurance: { score: insuranceScore, max: 15, label: 'Insurance Cover' },
        debtRatio: { score: debtScore, max: 15, label: 'Debt Ratio' },
        diversification: { score: diversifyScore, max: 15, label: 'Diversification' },
        retirement: { score: retirementScore, max: 20, label: 'Retirement Ready' },
      },
      grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F',
      label: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : score >= 40 ? 'Needs Work' : 'Critical',
    };
  }

  // === ACTION ITEMS ===
  generateActionPlan() {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();
    const insurance = this.assessInsurance();
    const actions = [];

    // Priority 1 — Critical
    if (emergency.status === 'critical') {
      actions.push({
        priority: 'critical',
        title: 'Build Emergency Fund',
        description: emergency.recommendation,
        link: '/calculator/emergency-fund',
      });
    }

    if (insurance.status === 'critical' && insurance.hasDependents) {
      actions.push({
        priority: 'critical',
        title: 'Get Term Life Insurance',
        description: insurance.recommendation,
        link: '/calculator/insurance-need',
      });
    }

    if (savings.savingsRate < 10) {
      actions.push({
        priority: 'critical',
        title: 'Increase Savings Rate',
        description: `Your savings rate is only ${savings.savingsRate}%. Target at least 20% — review subscriptions, dining, and discretionary spending.`,
        link: '/calculator/goal-planning',
      });
    }

    // Priority 2 — Important
    if (emergency.status === 'partial') {
      actions.push({
        priority: 'important',
        title: 'Strengthen Emergency Fund',
        description: emergency.recommendation,
        link: '/calculator/emergency-fund',
      });
    }

    if (savings.savingsRate >= 10 && savings.savingsRate < 20) {
      const needed = Math.round(0.2 * this.totalMonthlyIncome - savings.monthlySavings);
      actions.push({
        priority: 'important',
        title: 'Boost Savings to 20%',
        description: `Current rate: ${savings.savingsRate}%. Redirect ₹${Math.max(0, needed).toLocaleString('en-IN')}/month more to investments.`,
        link: '/calculator/sip-calculator',
      });
    }

    // Priority 3 — Optimize
    if (savings.monthlySavings > 0) {
      actions.push({
        priority: 'optimize',
        title: 'Start/Increase SIP',
        description: `Set up auto-debit SIP of ₹${Math.round(savings.monthlySavings * 0.5).toLocaleString('en-IN')}/month in index funds for long-term compounding.`,
        link: '/calculator/sip-calculator',
      });
    }

    if (this.totalMonthlyIncome * 12 > 500000) {
      actions.push({
        priority: 'optimize',
        title: 'Optimize Tax Savings',
        description: 'Maximize ₹1.5L in ELSS/PPF (80C) + ₹50K in NPS (80CCD). Compare Old vs New regime.',
        link: '/calculator/tax-calculator',
      });
    }

    actions.push({
      priority: 'optimize',
      title: 'Annual Portfolio Review',
      description: 'Rebalance your portfolio yearly to maintain target equity:debt ratio as markets move.',
      link: '/calculator/asset-allocation',
    });

    return actions;
  }

  // === FULL PLAN SUMMARY ===
  generateFullPlan() {
    const savings = this.calculateSavingsRate();
    const emergency = this.assessEmergencyFund();
    const insurance = this.assessInsurance();
    const allocation = this.calculateAssetAllocation();
    const instruments = this.mapToInstruments(allocation);
    const sipPlan = this.calculateSIPPlan(allocation, instruments);
    const totalMonthlySIP = sipPlan.reduce((sum, s) => sum + s.monthlySIP, 0);
    const projection = this.projectWealth(totalMonthlySIP, allocation);
    const retirement = this.assessRetirement(projection);
    const healthScore = this.calculateHealthScore();
    const actions = this.generateActionPlan();

    return {
      profile: this.profile,
      savings,
      emergency,
      insurance,
      allocation,
      instruments,
      sipPlan,
      projection,
      retirement,
      healthScore,
      actions,
      totalMonthlySIP,
    };
  }
}
