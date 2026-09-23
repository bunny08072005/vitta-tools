/* ============================================
   Vitta Financial Blueprint — post-tax return estimator
   Illustrative capital-gains treatment under current
   (FY 2025-26) Indian tax rules. This is a simplified,
   educational ESTIMATE only — not tax advice. Actual
   liability depends on exact holding periods, redemption
   tranches, indexation history (for pre-2023 debt funds),
   surcharge, and rules current at the time of withdrawal.
   100% client-side, same disclaimer posture as the rest
   of the site (see CalculatorLayout.jsx's footer note).
   ============================================ */

import { calculateTax } from '../utils/calculations';

// === MARGINAL SLAB RATE ===
// Rather than asking the user for their tax bracket separately, derive it by
// nudging the income already collected through the site's own calculateTax()
// slab tables and reading off the effective marginal rate (New Regime, since
// that's the default for most taxpayers today). This keeps calculations.js the
// single source of truth for slab rates — if they change, this stays correct.
export const getMarginalSlabRate = (annualIncome) => {
  const income = Math.max(0, annualIncome || 0);
  const bump = 100000; // 1L step avoids rounding/rebate-cliff noise from a tiny delta
  const base = calculateTax(income, 0, 0, 0, 0);
  const bumped = calculateTax(income + bump, 0, 0, 0, 0);
  const rate = (bumped.new.total - base.new.total) / bump;
  return Math.max(0, Math.min(0.3, rate));
};

// === PER-INSTRUMENT-CLASS TAX ===
export const equityLTCGTax = (gains, exemption = 125000) => Math.max(0, (gains || 0) - exemption) * 0.125;
export const equitySTCGTax = (gains) => Math.max(0, gains || 0) * 0.20;
export const slabTax = (gains, annualIncome) => Math.max(0, gains || 0) * getMarginalSlabRate(annualIncome);
export const longTermFlatTax = (gains) => Math.max(0, gains || 0) * 0.125; // gold / real estate, >24 months, no indexation

// taxClass -> tax(gains, { holdingYears, annualIncome })
function taxForClass(taxClass, gains, { holdingYears = 2, annualIncome = 0 } = {}) {
  switch (taxClass) {
    case 'equity':
      return holdingYears >= 1 ? equityLTCGTax(gains) : equitySTCGTax(gains);
    case 'debt':
      // Post-April-2023 rule: no LTCG/indexation benefit for debt funds — always slab rate.
      return slabTax(gains, annualIncome);
    case 'gold':
    case 'realEstate':
      return holdingYears >= 2 ? longTermFlatTax(gains) : slabTax(gains, annualIncome);
    case 'nps':
      // Simplified: up to 60% of NPS corpus is tax-free lumpsum on maturity; the
      // remaining 40% must go into an annuity (taxed later as pension income, not
      // as a capital gain now). We treat the modelled corpus as effectively
      // tax-exempt today rather than double-model the future annuity income.
      return 0;
    case 'exempt': // PPF / EPF — standard EEE assumption
    default:
      return 0;
  }
}

// === EXISTING PORTFOLIO (today's holdings) ===
// Only meaningful when the user gave an invested amount; otherwise gains can't
// be estimated and we report the holding as-is with zero assumed tax.
export function estimateInstrumentPostTax({ taxClass, currentValue = 0, investedAmount, holdingYears }) {
  const hasCost = investedAmount !== '' && investedAmount !== null && investedAmount !== undefined && Number(investedAmount) > 0;
  const gains = hasCost ? Math.max(0, currentValue - Number(investedAmount)) : 0;
  const years = holdingYears === '' || holdingYears === null || holdingYears === undefined ? 2 : Number(holdingYears);
  const tax = hasCost ? taxForClass(taxClass, gains, { holdingYears: years }) : 0;
  return {
    gains: Math.round(gains),
    tax: Math.round(tax),
    postTaxValue: Math.round(currentValue - tax),
    estimated: hasCost,
  };
}

export function estimatePortfolioGainsTax(portfolioEntries = [], getPortfolioType) {
  const rows = portfolioEntries.map((entry) => {
    const type = getPortfolioType(entry.type);
    const result = estimateInstrumentPostTax({
      taxClass: type.taxClass,
      currentValue: Number(entry.currentValue) || 0,
      investedAmount: entry.investedAmount,
      holdingYears: entry.yearsHeld,
    });
    return { ...entry, typeLabel: type.label, ...result };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      currentValue: acc.currentValue + (Number(r.currentValue) || 0),
      gains: acc.gains + r.gains,
      tax: acc.tax + r.tax,
      postTaxValue: acc.postTaxValue + r.postTaxValue,
    }),
    { currentValue: 0, gains: 0, tax: 0, postTaxValue: 0 }
  );

  return { rows, totals };
}

// === PROJECTED GOAL CORPUS (future, at maturity) ===
// Splits the projected gains across the goal's own asset allocation (equity /
// debt / gold) and applies each slice's own capital-gains rule, assuming a
// single lump redemption at the goal's target year.
export function estimateGoalPostTaxCorpus({ totalCorpus, totalInvested, allocation, yearsToTarget, annualIncome }) {
  const gains = Math.max(0, totalCorpus - totalInvested);
  const equityGains = gains * ((allocation.equity || 0) / 100);
  const debtGains = gains * ((allocation.debt || 0) / 100);
  // REITs don't have their own capital-gains rule modelled here — lumped into
  // the same "gold-like" long-term-flat-rate bucket as a reasonable estimate.
  const goldGains = gains * (((allocation.gold || 0) + (allocation.reit || 0)) / 100);

  const equityTax = taxForClass('equity', equityGains, { holdingYears: yearsToTarget, annualIncome });
  const debtTax = taxForClass('debt', debtGains, { annualIncome });
  const goldTax = taxForClass('gold', goldGains, { holdingYears: yearsToTarget, annualIncome });

  const tax = equityTax + debtTax + goldTax;
  const postTaxCorpus = totalCorpus - tax;

  return {
    preTaxCorpus: Math.round(totalCorpus),
    gains: Math.round(gains),
    tax: Math.round(tax),
    postTaxCorpus: Math.round(postTaxCorpus),
    effectiveTaxRate: gains > 0 ? Math.round((tax / gains) * 1000) / 10 : 0,
    breakdown: {
      equity: Math.round(equityTax),
      debt: Math.round(debtTax),
      gold: Math.round(goldTax),
    },
  };
}
