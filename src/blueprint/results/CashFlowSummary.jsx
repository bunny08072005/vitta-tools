import { formatCurrency } from '../../utils/calculations';

export default function CashFlowSummary({ plan }) {
  const { profile, savings, goalsAnalysis } = plan;
  const totalIncome = (Number(profile.monthlyIncome) || 0) + (Number(profile.otherIncome) || 0);
  const { totalRequiredSIP, availableSurplus, isFullyAffordable, shortfall } = goalsAnalysis;

  return (
    <div className="bp-cf-card glass-card" id="bp-cash-flow">
      <h3>Cash Flow Summary</h3>

      <div className="bp-cf-grid">
        <div className="bp-cf-stat"><span className="bp-cf-label">Monthly Income</span><span className="bp-cf-value mono">{formatCurrency(totalIncome)}</span></div>
        <div className="bp-cf-stat"><span className="bp-cf-label">Expenses + EMIs</span><span className="bp-cf-value mono">{formatCurrency((profile.monthlyExpenses || 0) + (profile.emiPayments || 0))}</span></div>
        <div className="bp-cf-stat"><span className="bp-cf-label">Monthly Surplus</span><span className="bp-cf-value mono" style={{ color: 'var(--green)' }}>{formatCurrency(savings.monthlySavings)}</span></div>
        <div className="bp-cf-stat"><span className="bp-cf-label">Savings Rate</span><span className="bp-cf-value mono">{savings.savingsRate}%</span></div>
      </div>

      <div className="bp-cf-divider" />

      <div className="bp-cf-grid">
        <div className="bp-cf-stat"><span className="bp-cf-label">Required for All Goals</span><span className="bp-cf-value mono">{formatCurrency(totalRequiredSIP)}/mo</span></div>
        <div className="bp-cf-stat"><span className="bp-cf-label">Available to Invest</span><span className="bp-cf-value mono">{formatCurrency(availableSurplus)}/mo</span></div>
      </div>

      {isFullyAffordable ? (
        <div className="bp-cf-verdict bp-cf-verdict-good">
          ✓ Your surplus fully covers every goal in this plan.
        </div>
      ) : (
        <div className="bp-cf-verdict bp-cf-verdict-bad">
          Shortfall of <strong className="mono">{formatCurrency(shortfall)}/mo</strong> — lower-priority goals below are only
          partially funded. Consider extending timelines, re-prioritizing, or growing income.
        </div>
      )}
    </div>
  );
}
