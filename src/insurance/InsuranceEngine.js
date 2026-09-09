/* ============================================
   Vitta Insurance — Comparison Engine
   AI-powered insurance plan matching algorithm.
   Output is illustrative and for comparison only —
   not a personalized insurance recommendation.
   100% client-side
   ============================================ */

import { termInsurancePlans, healthInsurancePlans, formatINR } from './insuranceData';

export class InsuranceEngine {
  constructor(profile) {
    this.profile = profile;
  }

  // === TERM INSURANCE RECOMMENDATION ===
  recommendTermInsurance() {
    const {
      age, gender, monthlyIncome, annualIncome,
      dependents, existingLifeCover = 0,
      maritalStatus, isSmoker = false,
    } = this.profile;

    // Calculate ideal cover: HLV method
    const incomeMultiplier = age < 30 ? 15 : age < 35 ? 12 : age < 40 ? 10 : age < 50 ? 8 : 6;
    const idealCover = annualIncome * incomeMultiplier;
    const additionalCoverNeeded = Math.max(0, idealCover - existingLifeCover);

    // Round to nearest 5L
    const recommendedCover = Math.ceil(additionalCoverNeeded / 500000) * 500000;
    const isAdequatelyCovered = recommendedCover <= 0;

    // Calculate policy term (till 60 or 65)
    const recommendedTerm = Math.max(10, Math.min(40, 60 - age));

    // Filter by age eligibility only — clamp cover into each plan's own
    // min/max range instead of excluding plans whose range doesn't happen
    // to contain the exact recommended figure (e.g. low income needing
    // less than every insurer's minimum sum assured, or already-adequately
    // -covered users with a recommendedCover of 0).
    const scoredPlans = termInsurancePlans
      .filter(plan => age >= plan.minAge && age <= plan.maxAge)
      .map(plan => {
        const coverForPlan = Math.min(plan.maxCover, Math.max(plan.minCover, recommendedCover));

        // Find nearest valid term
        const validTerms = plan.policyTerm.filter(t => t >= 10);
        const nearestTerm = validTerms.reduce((prev, curr) =>
          Math.abs(curr - recommendedTerm) < Math.abs(prev - recommendedTerm) ? curr : prev
        );

        const annualPremium = plan.getAnnualPremium(age, coverForPlan, nearestTerm);
        const monthlyPremium = Math.round(annualPremium / 12);

        return {
          ...plan,
          recommendedCover: coverForPlan,
          recommendedTerm: nearestTerm,
          annualPremium,
          monthlyPremium,
          _rawPremium: annualPremium,
          _rawClaim: plan.claimRatio,
          _rawFeatures: plan.features.length + plan.riders.length,
        };
      });

    // Normalize scores across all plans for a meaningful spread
    if (scoredPlans.length > 0) {
      const premiums = scoredPlans.map(p => p._rawPremium);
      const minP = Math.min(...premiums), maxP = Math.max(...premiums);
      const claims = scoredPlans.map(p => p._rawClaim);
      const minC = Math.min(...claims), maxC = Math.max(...claims);
      const features = scoredPlans.map(p => p._rawFeatures);
      const minF = Math.min(...features), maxF = Math.max(...features);

      scoredPlans.forEach(plan => {
        // Lower premium = higher score (0-35 points)
        const premNorm = maxP > minP ? 1 - (plan._rawPremium - minP) / (maxP - minP) : 0.5;
        // Higher claim ratio = higher score (0-40 points)
        const claimNorm = maxC > minC ? (plan._rawClaim - minC) / (maxC - minC) : 0.5;
        // More features = higher score (0-25 points)
        const featNorm = maxF > minF ? (plan._rawFeatures - minF) / (maxF - minF) : 0.5;

        const rawScore = premNorm * 35 + claimNorm * 40 + featNorm * 25;
        // Map 0-100 raw score to 72-98 display range
        plan.score = Math.round(72 + (rawScore / 100) * 26);
      });
    }

    scoredPlans.sort((a, b) => b.score - a.score);

    return {
      idealCover,
      existingCover: existingLifeCover,
      additionalCoverNeeded,
      recommendedCover,
      recommendedTerm,
      incomeMultiplier,
      isAdequatelyCovered,
      plans: scoredPlans,
      summary: this._generateTermSummary(recommendedCover, recommendedTerm, age, dependents, isAdequatelyCovered, existingLifeCover, idealCover),
    };
  }

  // === HEALTH INSURANCE RECOMMENDATION ===
  recommendHealthInsurance() {
    const {
      age, monthlyIncome, annualIncome,
      cityTier = 'tier1', familySize = 1,
      maritalStatus, existingHealthCover = 0,
    } = this.profile;

    // Calculate recommended cover based on city & income
    let recommendedCover;
    if (cityTier === 'tier1') {
      recommendedCover = annualIncome < 600000 ? 500000
        : annualIncome < 1200000 ? 1000000
        : annualIncome < 2500000 ? 2000000
        : 5000000;
    } else if (cityTier === 'tier2') {
      recommendedCover = annualIncome < 600000 ? 300000
        : annualIncome < 1200000 ? 750000
        : annualIncome < 2500000 ? 1500000
        : 3000000;
    } else {
      recommendedCover = annualIncome < 600000 ? 300000
        : annualIncome < 1200000 ? 500000
        : annualIncome < 2500000 ? 1000000
        : 2000000;
    }

    // Minimum ₹5L for everyone
    recommendedCover = Math.max(500000, recommendedCover);

    const scoredPlans = healthInsurancePlans
      .filter(plan => age >= plan.minAge && age <= plan.maxAge)
      .map(plan => {
        // Find nearest cover option
        const validCovers = plan.coverOptions.filter(c => c >= recommendedCover * 0.5);
        const nearestCover = validCovers.length > 0
          ? validCovers.reduce((prev, curr) =>
            Math.abs(curr - recommendedCover) < Math.abs(prev - recommendedCover) ? curr : prev
          )
          : plan.coverOptions[plan.coverOptions.length - 1];

        const annualPremium = plan.getAnnualPremium(age, nearestCover, familySize);
        const monthlyPremium = Math.round(annualPremium / 12);

        return {
          ...plan,
          selectedCover: nearestCover,
          annualPremium,
          monthlyPremium,
          _rawPremium: annualPremium,
          _rawClaim: plan.claimRatio,
          _rawFeatures: plan.features.length,
          _coverMatch: nearestCover >= recommendedCover ? 1 : 0.5,
        };
      });

    // Normalize scores across all plans
    if (scoredPlans.length > 0) {
      const premiums = scoredPlans.map(p => p._rawPremium);
      const minP = Math.min(...premiums), maxP = Math.max(...premiums);
      const claims = scoredPlans.map(p => p._rawClaim);
      const minC = Math.min(...claims), maxC = Math.max(...claims);
      const features = scoredPlans.map(p => p._rawFeatures);
      const minF = Math.min(...features), maxF = Math.max(...features);

      scoredPlans.forEach(plan => {
        const premNorm = maxP > minP ? 1 - (plan._rawPremium - minP) / (maxP - minP) : 0.5;
        const claimNorm = maxC > minC ? (plan._rawClaim - minC) / (maxC - minC) : 0.5;
        const featNorm = maxF > minF ? (plan._rawFeatures - minF) / (maxF - minF) : 0.5;
        const coverBonus = plan._coverMatch;

        const rawScore = premNorm * 30 + claimNorm * 35 + featNorm * 20 + coverBonus * 15;
        plan.score = Math.round(72 + (rawScore / 100) * 26);
      });
    }

    scoredPlans.sort((a, b) => b.score - a.score);

    return {
      recommendedCover,
      existingCover: existingHealthCover,
      familySize,
      cityTier,
      plans: scoredPlans,
      summary: this._generateHealthSummary(recommendedCover, familySize, cityTier),
    };
  }

  // === SUMMARIES ===
  _generateTermSummary(cover, term, age, dependents, isAdequatelyCovered, existingCover, idealCover) {
    if (isAdequatelyCovered) {
      return [
        `Your existing life cover of ${formatINR(existingCover)} already meets or exceeds your ideal cover of ${formatINR(idealCover)}.`,
        `Based on the income-replacement method, you're adequately insured right now.`,
        `The plans below show what each insurer's minimum term policy would cost, in case you'd still like to diversify or add cover.`,
      ];
    }
    const points = [];
    points.push(`Based on your income, you need approximately ${formatINR(cover)} of term life coverage.`);
    points.push(`A ${term}-year policy will cover you until age ${age + term}.`);
    if (dependents > 0) {
      points.push(`With ${dependents} dependent${dependents > 1 ? 's' : ''}, adequate life cover is critical.`);
    } else {
      points.push(`Even without dependents, a basic term plan is recommended for future planning.`);
    }
    points.push(`Term insurance is the most affordable way to get high life coverage.`);
    return points;
  }

  _generateHealthSummary(cover, familySize, cityTier) {
    const cityName = cityTier === 'tier1' ? 'metro city' : cityTier === 'tier2' ? 'tier-2 city' : 'tier-3 city';
    const points = [];
    points.push(`For a ${familySize}-member family in a ${cityName}, we recommend minimum ${formatINR(cover)} health cover.`);
    points.push(`Medical inflation in India runs at 14% annually — health insurance is essential.`);
    if (familySize > 1) {
      points.push(`A family floater plan is more cost-effective than individual plans.`);
    }
    points.push(`Always check cashless hospital network in your city before choosing.`);
    return points;
  }
}
