/* ============================================
   Vitta Financial Blueprint — static reference data
   Shared vocabulary for goals, portfolio instrument
   types, and the initial wizard state shape.
   ============================================ */

import {
  Clock, Home, Car, GraduationCap, Gem, Plane, Rocket, Sparkles,
  TrendingUp, LineChart, Landmark, Coins, Award, Building2, PiggyBank, Layers,
} from 'lucide-react';

// === GOAL TYPES ===
// `retirement` is always present in a plan (pre-seeded, locked — can't be removed,
// only its target age is editable) since it's the one goal every profile implicitly
// has. Every other type is added freely and repeatably by the user.
export const GOAL_TYPES = [
  { id: 'retirement', label: 'Retirement', icon: Clock, locked: true },
  { id: 'home', label: 'Buy a Home', icon: Home },
  { id: 'car', label: 'Buy a Car', icon: Car },
  { id: 'education', label: "Child's Education", icon: GraduationCap },
  { id: 'marriage', label: "Child's / Own Marriage", icon: Gem },
  { id: 'vacation', label: 'Dream Vacation', icon: Plane },
  { id: 'business', label: 'Starting a Business', icon: Rocket },
  { id: 'custom', label: 'Other Goal', icon: Sparkles },
];

export const getGoalType = (id) => GOAL_TYPES.find((g) => g.id === id) || GOAL_TYPES[GOAL_TYPES.length - 1];

// === PORTFOLIO / PAST INVESTMENT TYPES ===
// `defaultReturn` seeds the wealth projection for existing holdings; `taxClass`
// tells blueprintTax.js which capital-gains rule applies at withdrawal.
export const PORTFOLIO_TYPES = [
  { id: 'equity_mf', label: 'Equity Mutual Funds', icon: TrendingUp, defaultReturn: 12, taxClass: 'equity' },
  { id: 'stocks', label: 'Direct Stocks', icon: LineChart, defaultReturn: 13, taxClass: 'equity' },
  { id: 'debt_mf', label: 'Debt Mutual Funds', icon: Landmark, defaultReturn: 7.5, taxClass: 'debt' },
  { id: 'fd_rd', label: 'FD / RD', icon: PiggyBank, defaultReturn: 7, taxClass: 'debt' },
  { id: 'ppf', label: 'PPF', icon: Coins, defaultReturn: 7.1, taxClass: 'exempt' },
  { id: 'epf', label: 'EPF', icon: Coins, defaultReturn: 8.15, taxClass: 'exempt' },
  { id: 'nps', label: 'NPS', icon: Award, defaultReturn: 10, taxClass: 'nps' },
  { id: 'gold', label: 'Gold (ETF / SGB / Physical)', icon: Coins, defaultReturn: 8.5, taxClass: 'gold' },
  { id: 'real_estate', label: 'Real Estate', icon: Building2, defaultReturn: 8, taxClass: 'realEstate' },
  { id: 'other', label: 'Other', icon: Layers, defaultReturn: 8, taxClass: 'debt' },
];

export const getPortfolioType = (id) => PORTFOLIO_TYPES.find((p) => p.id === id) || PORTFOLIO_TYPES[PORTFOLIO_TYPES.length - 1];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const CITY_TIER_OPTIONS = [
  { value: 'tier1', label: 'Metro — Delhi, Mumbai, Bangalore, Hyderabad' },
  { value: 'tier2', label: 'Tier 2 — Jaipur, Lucknow, Kochi, Pune' },
  { value: 'tier3', label: 'Tier 3 / Rural' },
];

let idCounter = 0;
export const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

export const makeGoal = (overrides = {}) => ({
  id: nextId('goal'),
  type: 'custom',
  name: '',
  targetAmountToday: 1000000,
  targetAge: 35,
  priority: 'medium',
  currentProvision: 0,
  ...overrides,
});

export const makePortfolioEntry = (overrides = {}) => ({
  id: nextId('port'),
  type: 'equity_mf',
  currentValue: 100000,
  investedAmount: '',
  yearsHeld: '',
  ...overrides,
});

export const defaultBlueprintProfile = {
  // Personal
  name: '',
  age: 30,
  gender: 'male',
  maritalStatus: 'single',
  dependents: 0,
  cityTier: 'tier1',

  // Income
  monthlyIncome: 75000,
  otherIncome: 0,

  // Expenses
  monthlyExpenses: 35000,
  emiPayments: 0,
  emergencyFund: 100000,

  // Existing portfolio (repeatable)
  portfolio: [],

  // Insurance
  termCover: 0,
  termPremium: 0,
  healthCover: 0,
  healthFamilyFloater: false,
  healthPremium: 0,

  // Goals — retirement is always present
  goals: [
    { id: 'retirement', type: 'retirement', name: 'Retirement', targetAge: 60, priority: 'high', currentProvision: 0 },
  ],

  // Risk
  riskProfile: null,
};
