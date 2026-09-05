import {
  TrendingUp, Landmark, Home, Target, Shield,
  Calculator, PiggyBank, IndianRupee, BarChart3, ArrowUpRight,
  ArrowDownRight, Percent, Building2, Car, Goal, Flame,
  Umbrella, Heart, Receipt, Award, Coins, LineChart,
  Wallet, Clock, BadgePercent, RefreshCw, Layers
} from 'lucide-react';

export const categories = [
  {
    id: 'investment',
    name: 'Investment',
    description: 'Plan your investments with SIP, Lumpsum, and mutual fund tools',
    icon: TrendingUp,
    color: '#1B6B3A',
  },
  {
    id: 'fixed-income',
    name: 'Fixed Income & Savings',
    description: 'Calculate returns on FD, RD, PPF, NPS and bonds',
    icon: Landmark,
    color: '#06b6d4',
  },
  {
    id: 'loans',
    name: 'Loans',
    description: 'EMI calculations for home, car, and personal loans',
    icon: Home,
    color: '#f59e0b',
  },
  {
    id: 'planning',
    name: 'Planning & Goals',
    description: 'Retirement, FIRE, goal planning, and net worth tracking',
    icon: Target,
    color: '#22c55e',
  },
  {
    id: 'insurance-tax',
    name: 'Insurance & Tax',
    description: 'Insurance needs, human life value, and tax calculators',
    icon: Shield,
    color: '#a855f7',
  },
];

export const calculators = [
  // Investment
  { id: 'sip', name: 'SIP Calculator', slug: 'sip-calculator', category: 'investment', icon: TrendingUp, description: 'Calculate returns on your Systematic Investment Plan', popular: true },
  { id: 'lumpsum', name: 'Lumpsum Calculator', slug: 'lumpsum-calculator', category: 'investment', icon: IndianRupee, description: 'Calculate returns on a one-time investment' },
  { id: 'stepup-sip', name: 'Step-up SIP', slug: 'stepup-sip-calculator', category: 'investment', icon: ArrowUpRight, description: 'SIP with annual step-up percentage increase' },
  { id: 'mutual-fund', name: 'Mutual Fund Returns', slug: 'mutual-fund-calculator', category: 'investment', icon: BarChart3, description: 'Calculate mutual fund investment returns with CAGR' },
  { id: 'cagr', name: 'CAGR Calculator', slug: 'cagr-calculator', category: 'investment', icon: LineChart, description: 'Find the Compound Annual Growth Rate of investments' },
  { id: 'xirr', name: 'XIRR Calculator', slug: 'xirr-calculator', category: 'investment', icon: RefreshCw, description: 'Calculate returns on irregular cashflows' },
  { id: 'swp', name: 'SWP Calculator', slug: 'swp-calculator', category: 'investment', icon: ArrowDownRight, description: 'Plan systematic withdrawals from your investments' },

  // Fixed Income
  { id: 'fd', name: 'FD Calculator', slug: 'fd-calculator', category: 'fixed-income', icon: Landmark, description: 'Calculate Fixed Deposit maturity amount', popular: true },
  { id: 'rd', name: 'RD Calculator', slug: 'rd-calculator', category: 'fixed-income', icon: PiggyBank, description: 'Calculate Recurring Deposit maturity amount' },
  { id: 'ppf', name: 'PPF Calculator', slug: 'ppf-calculator', category: 'fixed-income', icon: Coins, description: 'Calculate Public Provident Fund returns over 15 years', popular: true },
  { id: 'nps', name: 'NPS Calculator', slug: 'nps-calculator', category: 'fixed-income', icon: Award, description: 'Plan your National Pension System investments' },
  { id: 'bond-yield', name: 'Bond Yield', slug: 'bond-yield-calculator', category: 'fixed-income', icon: BadgePercent, description: 'Calculate Yield to Maturity of bonds' },

  // Loans
  { id: 'emi', name: 'EMI Calculator', slug: 'emi-calculator', category: 'loans', icon: Calculator, description: 'Calculate monthly EMI for any loan amount', popular: true },
  { id: 'home-loan', name: 'Home Loan', slug: 'home-loan-calculator', category: 'loans', icon: Building2, description: 'Home loan EMI with full amortization schedule', popular: true },
  { id: 'car-loan', name: 'Car Loan', slug: 'car-loan-calculator', category: 'loans', icon: Car, description: 'Calculate car loan EMI and total interest' },

  // Planning
  { id: 'goal', name: 'Goal Planning', slug: 'goal-planning', category: 'planning', icon: Goal, description: 'Plan investments to reach your financial goals' },
  { id: 'retirement', name: 'Retirement Planning', slug: 'retirement-planning', category: 'planning', icon: Clock, description: 'Calculate the corpus needed for comfortable retirement', popular: true },
  { id: 'fire', name: 'FIRE Calculator', slug: 'fire-calculator', category: 'planning', icon: Flame, description: 'Financial Independence, Retire Early calculator' },
  { id: 'emergency', name: 'Emergency Fund', slug: 'emergency-fund', category: 'planning', icon: Umbrella, description: 'Calculate how much emergency fund you need' },
  { id: 'networth', name: 'Net Worth Tracker', slug: 'net-worth-tracker', category: 'planning', icon: Wallet, description: 'Track and calculate your total net worth' },
  { id: 'inflation', name: 'Inflation Calculator', slug: 'inflation-calculator', category: 'planning', icon: Percent, description: 'See how inflation impacts your money over time' },
  { id: 'asset-allocation', name: 'Asset Allocation', slug: 'asset-allocation', category: 'planning', icon: Layers, description: 'Get recommended asset allocation based on your profile' },

  // Insurance & Tax
  { id: 'insurance', name: 'Insurance Need', slug: 'insurance-need', category: 'insurance-tax', icon: Shield, description: 'Calculate how much life insurance cover you need' },
  { id: 'hlv', name: 'Human Life Value', slug: 'human-life-value', category: 'insurance-tax', icon: Heart, description: 'Calculate the economic value of your life' },
  { id: 'tax', name: 'Tax Calculator', slug: 'tax-calculator', category: 'insurance-tax', icon: Receipt, description: 'Compare Old vs New tax regime for FY 2025-26', popular: true },
  { id: 'hra', name: 'HRA Calculator', slug: 'hra-calculator', category: 'insurance-tax', icon: Building2, description: 'Calculate HRA exemption under both tax regimes' },
];

export const getCalculatorsByCategory = (categoryId) =>
  calculators.filter(c => c.category === categoryId);

export const getPopularCalculators = () =>
  calculators.filter(c => c.popular);

export const getCalculatorBySlug = (slug) =>
  calculators.find(c => c.slug === slug);

export const getCategoryById = (id) =>
  categories.find(c => c.id === id);
