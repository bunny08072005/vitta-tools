/* ============================================
   Vitta Financial Blueprint — wizard state reducer
   Profile has scalar fields plus two repeatable
   lists (portfolio, goals), which is more than
   plain useState comfortably handles.
   ============================================ */

import { defaultBlueprintProfile, makeGoal, makePortfolioEntry } from './blueprintData';

export function blueprintReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.key]: action.value };

    case 'ADD_PORTFOLIO_ENTRY':
      return { ...state, portfolio: [...state.portfolio, makePortfolioEntry(action.overrides)] };

    case 'UPDATE_PORTFOLIO_ENTRY':
      return {
        ...state,
        portfolio: state.portfolio.map((p) => (p.id === action.id ? { ...p, [action.key]: action.value } : p)),
      };

    case 'REMOVE_PORTFOLIO_ENTRY':
      return { ...state, portfolio: state.portfolio.filter((p) => p.id !== action.id) };

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, makeGoal(action.overrides)] };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.id ? { ...g, [action.key]: action.value } : g)),
      };

    case 'REMOVE_GOAL':
      // Retirement is always present — the UI never renders a remove button for it,
      // but guard here too in case a stray action ever slips through.
      return {
        ...state,
        goals: state.goals.filter((g) => !(g.id === action.id && g.type !== 'retirement')),
      };

    case 'SET_RISK_PROFILE':
      return { ...state, riskProfile: action.riskProfile };

    case 'RESET':
      return defaultBlueprintProfile;

    default:
      return state;
  }
}

export const blueprintActions = {
  updateField: (key, value) => ({ type: 'UPDATE_FIELD', key, value }),
  addPortfolioEntry: (overrides) => ({ type: 'ADD_PORTFOLIO_ENTRY', overrides }),
  updatePortfolioEntry: (id, key, value) => ({ type: 'UPDATE_PORTFOLIO_ENTRY', id, key, value }),
  removePortfolioEntry: (id) => ({ type: 'REMOVE_PORTFOLIO_ENTRY', id }),
  addGoal: (overrides) => ({ type: 'ADD_GOAL', overrides }),
  updateGoal: (id, key, value) => ({ type: 'UPDATE_GOAL', id, key, value }),
  removeGoal: (id) => ({ type: 'REMOVE_GOAL', id }),
  setRiskProfile: (riskProfile) => ({ type: 'SET_RISK_PROFILE', riskProfile }),
  reset: () => ({ type: 'RESET' }),
};
