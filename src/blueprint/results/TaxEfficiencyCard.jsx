import { Info } from 'lucide-react';
import { formatCurrency, formatCompact } from '../../utils/calculations';

export default function TaxEfficiencyCard({ goalsTax, portfolioTax }) {
  const { rows, totals } = goalsTax;
  const estimatedPortfolioRows = portfolioTax.rows.filter((r) => r.estimated);

  return (
    <div className="bp-tax-card glass-card" id="bp-tax-efficiency">
      <h3>Tax Efficiency — Pre-Tax vs. Post-Tax</h3>
      <p className="bp-goals-sub">Estimated capital-gains tax on your projected goal corpus, at today's FY 2025-26 rules.</p>

      <div className="bp-proj-stats">
        <div className="bp-proj-stat"><span className="bp-proj-stat-label">Pre-Tax Corpus (All Goals)</span><span className="mono bp-proj-stat-value">{formatCompact(totals.preTaxCorpus)}</span></div>
        <div className="bp-proj-stat"><span className="bp-proj-stat-label">Estimated Tax</span><span className="mono bp-proj-stat-value" style={{ color: 'var(--red)' }}>{formatCompact(totals.tax)}</span></div>
        <div className="bp-proj-stat"><span className="bp-proj-stat-label">Post-Tax Corpus</span><span className="mono bp-proj-stat-value" style={{ color: 'var(--green)' }}>{formatCompact(totals.postTaxCorpus)}</span></div>
      </div>

      <div className="bp-tax-table">
        <div className="bp-tax-tr bp-tax-th">
          <span>Goal</span><span>Pre-Tax</span><span>Tax</span><span>Post-Tax</span><span>Rate</span>
        </div>
        {rows.map((r) => (
          <div className="bp-tax-tr" key={r.id}>
            <span className="bp-tax-bold">{r.label}</span>
            <span className="mono">{formatCompact(r.preTaxCorpus)}</span>
            <span className="mono" style={{ color: 'var(--red)' }}>{formatCompact(r.tax)}</span>
            <span className="mono bp-tax-bold">{formatCompact(r.postTaxCorpus)}</span>
            <span className="mono">{r.effectiveTaxRate}%</span>
          </div>
        ))}
      </div>

      {estimatedPortfolioRows.length > 0 && (
        <div className="bp-tax-portfolio">
          <h4>Your Existing Portfolio</h4>
          <p className="bp-goals-sub">Based on the invested amounts you entered:</p>
          <div className="bp-proj-stats">
            <div className="bp-proj-stat"><span className="bp-proj-stat-label">Current Value</span><span className="mono bp-proj-stat-value">{formatCurrency(portfolioTax.totals.currentValue)}</span></div>
            <div className="bp-proj-stat"><span className="bp-proj-stat-label">Gains So Far</span><span className="mono bp-proj-stat-value">{formatCurrency(portfolioTax.totals.gains)}</span></div>
            <div className="bp-proj-stat"><span className="bp-proj-stat-label">If Redeemed Today (Post-Tax)</span><span className="mono bp-proj-stat-value" style={{ color: 'var(--green)' }}>{formatCurrency(portfolioTax.totals.postTaxValue)}</span></div>
          </div>
        </div>
      )}

      <div className="bp-tax-disclaimer">
        <Info size={14} style={{ minWidth: 14, marginTop: 2 }} />
        <span>
          Illustrative estimate only, not tax advice. Assumes equity LTCG at 12.5% (over ₹1.25L/yr exemption) or
          20% STCG, debt/gold/real-estate gains at your estimated marginal slab or 12.5% flat after the relevant
          long-term holding period, and PPF/EPF as tax-free. Actual liability depends on rules at the time of withdrawal.
        </span>
      </div>
    </div>
  );
}
