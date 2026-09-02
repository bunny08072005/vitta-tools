/* ============================================
   Vitta — Financial Calculation Utilities
   ============================================ */

// Format number as Indian currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toLocaleString('en-IN');
  return amount < 0 ? `-₹${formatted}` : `₹${formatted}`;
};

// Format as compact (₹1.5Cr, ₹25L, ₹50K)
export const formatCompact = (amount) => {
  const abs = Math.abs(amount);
  if (abs >= 1e7) return `₹${(amount / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(amount / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `₹${(amount / 1e3).toFixed(1)} K`;
  return formatCurrency(amount);
};

// Format percentage
export const formatPercent = (value, decimals = 2) =>
  `${Number(value).toFixed(decimals)}%`;

// === CORE FINANCIAL FORMULAS ===

// Future Value of SIP
export const sipFutureValue = (monthlyAmount, annualRate, years) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthlyAmount * n;
  return monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

// Future Value of Lumpsum
export const lumpsumFutureValue = (principal, annualRate, years) => {
  const r = annualRate / 100;
  return principal * Math.pow(1 + r, years);
};

// Step-up SIP Future Value
export const stepUpSipFutureValue = (monthlyAmount, annualRate, years, stepUpRate) => {
  let total = 0;
  let currentSIP = monthlyAmount;
  const r = annualRate / 100 / 12;

  for (let year = 0; year < years; year++) {
    for (let month = 0; month < 12; month++) {
      const monthsRemaining = (years - year) * 12 - month;
      total += currentSIP * Math.pow(1 + r, monthsRemaining);
    }
    currentSIP *= (1 + stepUpRate / 100);
  }
  return total;
};

// Total invested in Step-up SIP
export const stepUpSipTotalInvested = (monthlyAmount, years, stepUpRate) => {
  let total = 0;
  let currentSIP = monthlyAmount;
  for (let year = 0; year < years; year++) {
    total += currentSIP * 12;
    currentSIP *= (1 + stepUpRate / 100);
  }
  return total;
};

// SWP — Remaining corpus after withdrawals
export const swpCalculation = (corpus, monthlyWithdrawal, annualRate, years) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  let remaining = corpus;
  const data = [];

  for (let i = 0; i < n; i++) {
    remaining = remaining * (1 + r) - monthlyWithdrawal;
    if (remaining < 0) {
      data.push({ month: i + 1, corpus: 0 });
      break;
    }
    if ((i + 1) % 12 === 0) {
      data.push({ month: i + 1, corpus: Math.round(remaining) });
    }
  }
  return { finalCorpus: Math.max(0, Math.round(remaining)), data, totalWithdrawn: monthlyWithdrawal * Math.min(n, data.length > 0 ? data[data.length - 1].month : n) };
};

// EMI Calculation
export const calculateEMI = (principal, annualRate, years) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
};

// Amortization Schedule
export const generateAmortization = (principal, annualRate, years) => {
  const emi = calculateEMI(principal, annualRate, years);
  const r = annualRate / 100 / 12;
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;
  const schedule = [];

  for (let i = 1; i <= years * 12; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    yearPrincipal += principalPaid;
    yearInterest += interest;
    if (i % 12 === 0) {
      schedule.push({
        month: i,
        year: i / 12,
        emi: Math.round(emi),
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.max(0, Math.round(balance)),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }
  return { emi: Math.round(emi), totalPayment: Math.round(emi * years * 12), totalInterest: Math.round(emi * years * 12 - principal), schedule };
};

// CAGR
export const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
};

// XIRR (Newton-Raphson)
export const calculateXIRR = (cashflows) => {
  // cashflows: [{date: Date, amount: number}]
  if (!cashflows || cashflows.length < 2) return 0;

  const sortedCF = [...cashflows].sort((a, b) => a.date - b.date);
  const days = sortedCF.map(cf => (cf.date - sortedCF[0].date) / (1000 * 60 * 60 * 24));

  const xnpv = (rate) => {
    return sortedCF.reduce((sum, cf, i) => {
      return sum + cf.amount / Math.pow(1 + rate, days[i] / 365);
    }, 0);
  };

  const dxnpv = (rate) => {
    return sortedCF.reduce((sum, cf, i) => {
      const t = days[i] / 365;
      return sum - t * cf.amount / Math.pow(1 + rate, t + 1);
    }, 0);
  };

  let guess = 0.1;
  for (let i = 0; i < 100; i++) {
    const npv = xnpv(guess);
    const derivative = dxnpv(guess);
    if (Math.abs(derivative) < 1e-10) break;
    const newGuess = guess - npv / derivative;
    if (Math.abs(newGuess - guess) < 1e-7) return newGuess * 100;
    guess = newGuess;
  }
  return guess * 100;
};

// FD Maturity (Quarterly compounding)
export const fdMaturity = (principal, annualRate, years, compoundingFreq = 4) => {
  const r = annualRate / 100 / compoundingFreq;
  const n = years * compoundingFreq;
  return principal * Math.pow(1 + r, n);
};

// RD Maturity (Quarterly compounding)
export const rdMaturity = (monthlyDeposit, annualRate, years) => {
  const r = annualRate / 100 / 4;
  const n = years * 12;
  let maturity = 0;
  for (let i = 0; i < n; i++) {
    const quartersRemaining = (n - i) / 3;
    maturity += monthlyDeposit * Math.pow(1 + r, quartersRemaining);
  }
  return maturity;
};

// PPF (Annual compounding, 15 year lock-in)
export const ppfCalculation = (annualDeposit, annualRate, years = 15) => {
  let balance = 0;
  const yearData = [];
  for (let i = 1; i <= years; i++) {
    balance = (balance + annualDeposit) * (1 + annualRate / 100);
    yearData.push({ year: i, deposit: annualDeposit, balance: Math.round(balance) });
  }
  return { maturity: Math.round(balance), totalInvested: annualDeposit * years, interest: Math.round(balance - annualDeposit * years), yearData };
};

// NPS Calculation
export const npsCalculation = (monthlyContribution, annualReturn, years, annuityPercent = 40) => {
  const corpus = sipFutureValue(monthlyContribution, annualReturn, years);
  const annuityAmount = corpus * (annuityPercent / 100);
  const lumpsum = corpus - annuityAmount;
  const totalInvested = monthlyContribution * years * 12;
  return { totalCorpus: Math.round(corpus), annuityAmount: Math.round(annuityAmount), lumpsum: Math.round(lumpsum), totalInvested, wealthGained: Math.round(corpus - totalInvested) };
};

// Bond YTM (iterative)
export const bondYTM = (faceValue, couponRate, currentPrice, yearsToMaturity) => {
  const coupon = faceValue * couponRate / 100;
  let low = 0, high = 1;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    let price = 0;
    for (let t = 1; t <= yearsToMaturity; t++) {
      price += coupon / Math.pow(1 + mid, t);
    }
    price += faceValue / Math.pow(1 + mid, yearsToMaturity);
    if (price > currentPrice) low = mid;
    else high = mid;
  }
  return ((low + high) / 2) * 100;
};

// Goal Planning — required SIP
export const goalSIP = (targetAmount, annualRate, years) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return targetAmount / n;
  return targetAmount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

// Inflation adjusted future value
export const inflationAdjusted = (currentAmount, inflationRate, years) => {
  return currentAmount * Math.pow(1 + inflationRate / 100, years);
};

// Retirement corpus needed
export const retirementCorpus = (monthlyExpense, inflationRate, yearsToRetire, yearsInRetirement, postRetireReturn) => {
  const futureExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const annualExpense = futureExpense * 12;
  const realReturn = ((1 + postRetireReturn / 100) / (1 + inflationRate / 100) - 1);
  if (realReturn <= 0) return annualExpense * yearsInRetirement;
  const corpus = annualExpense * (1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn;
  return corpus;
};

// FIRE number
export const fireNumber = (annualExpenses, withdrawalRate = 4) => {
  return annualExpenses / (withdrawalRate / 100);
};

// Emergency Fund
export const emergencyFund = (monthlyExpenses, months = 6) => {
  return monthlyExpenses * months;
};

// Insurance Need
export const insuranceNeed = (annualIncome, yearsToReplace, liabilities, existingCover, futureCosts) => {
  return (annualIncome * yearsToReplace) + liabilities + futureCosts - existingCover;
};

// Human Life Value
export const humanLifeValue = (annualIncome, annualExpenses, yearsToRetire, discountRate) => {
  const netIncome = annualIncome - annualExpenses;
  const r = discountRate / 100;
  if (r === 0) return netIncome * yearsToRetire;
  return netIncome * (1 - Math.pow(1 + r, -yearsToRetire)) / r;
};

// Tax Calculator (FY 2025-26) — New vs Old Regime
export const calculateTax = (grossIncome, deductions80C = 0, deductions80D = 0, hra = 0, otherDeductions = 0) => {
  // Old Regime
  const oldTaxableIncome = Math.max(0, grossIncome - deductions80C - deductions80D - hra - otherDeductions - 50000); // 50K standard deduction
  let oldTax = 0;
  if (oldTaxableIncome > 250000) {
    const slabs = [
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ];
    let remaining = oldTaxableIncome - 250000;
    let prevLimit = 250000;
    for (const slab of slabs) {
      const slabAmount = Math.min(remaining, slab.limit - prevLimit);
      oldTax += slabAmount * slab.rate;
      remaining -= slabAmount;
      prevLimit = slab.limit;
      if (remaining <= 0) break;
    }
  }
  // Rebate u/s 87A old regime
  if (oldTaxableIncome <= 500000) oldTax = 0;
  const oldCess = oldTax * 0.04;
  const oldTotal = oldTax + oldCess;

  // New Regime (FY 2025-26)
  const newTaxableIncome = Math.max(0, grossIncome - 75000); // 75K standard deduction in new regime
  let newTax = 0;
  const newSlabs = [
    { from: 0, to: 400000, rate: 0 },
    { from: 400000, to: 800000, rate: 0.05 },
    { from: 800000, to: 1200000, rate: 0.10 },
    { from: 1200000, to: 1600000, rate: 0.15 },
    { from: 1600000, to: 2000000, rate: 0.20 },
    { from: 2000000, to: 2400000, rate: 0.25 },
    { from: 2400000, to: Infinity, rate: 0.30 },
  ];
  for (const slab of newSlabs) {
    if (newTaxableIncome > slab.from) {
      const taxableInSlab = Math.min(newTaxableIncome, slab.to) - slab.from;
      newTax += taxableInSlab * slab.rate;
    }
  }
  // Rebate u/s 87A new regime (up to 12L taxable income, max rebate 60K)
  if (newTaxableIncome <= 1200000) newTax = 0;
  // Marginal relief for income slightly above 12L
  if (newTaxableIncome > 1200000 && newTaxableIncome <= 1275000) {
    const excessIncome = newTaxableIncome - 1200000;
    newTax = Math.min(newTax, excessIncome);
  }
  const newCess = newTax * 0.04;
  const newTotal = newTax + newCess;

  return {
    old: { taxableIncome: oldTaxableIncome, tax: Math.round(oldTax), cess: Math.round(oldCess), total: Math.round(oldTotal) },
    new: { taxableIncome: newTaxableIncome, tax: Math.round(newTax), cess: Math.round(newCess), total: Math.round(newTotal) },
    savings: Math.round(oldTotal - newTotal),
    betterRegime: newTotal <= oldTotal ? 'New' : 'Old',
  };
};

// HRA Exemption
export const calculateHRA = (basicSalary, hraReceived, rentPaid, isMetro) => {
  const actualHRA = hraReceived;
  const rentMinus10 = Math.max(0, rentPaid - 0.1 * basicSalary);
  const percentOfBasic = (isMetro ? 0.5 : 0.4) * basicSalary;
  const exemption = Math.min(actualHRA, rentMinus10, percentOfBasic);
  return {
    exemption: Math.round(exemption),
    taxableHRA: Math.round(hraReceived - exemption),
    breakdown: {
      actualHRA: Math.round(actualHRA),
      rentMinus10Percent: Math.round(rentMinus10),
      percentOfBasic: Math.round(percentOfBasic),
    }
  };
};

// Year-by-year SIP projection
export const sipProjection = (monthlyAmount, annualRate, years) => {
  const data = [];
  for (let y = 1; y <= years; y++) {
    const invested = monthlyAmount * y * 12;
    const value = sipFutureValue(monthlyAmount, annualRate, y);
    data.push({ year: y, invested: Math.round(invested), value: Math.round(value), gains: Math.round(value - invested) });
  }
  return data;
};
