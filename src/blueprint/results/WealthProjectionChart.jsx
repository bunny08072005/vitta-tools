import ChartDisplay from '../../components/ChartDisplay';
import { formatCompact } from '../../utils/calculations';

export default function WealthProjectionChart({ projection }) {
  const { projectionData, finalCorpus, totalInvested, projectedReturn, monthlyInvestment } = projection;

  const interval = projectionData.length <= 20 ? 1 : projectionData.length <= 30 ? 2 : 5;
  const filtered = projectionData.filter((d, i) => i === 0 || d.year % interval === 0 || i === projectionData.length - 1);

  const chartData = {
    labels: filtered.map((d) => `Age ${d.age}`),
    datasets: [
      { label: 'Projected Corpus', data: filtered.map((d) => d.corpus), borderColor: '#1B6B3A', backgroundColor: 'rgba(27, 107, 58, 0.08)', fill: true, pointRadius: filtered.length <= 15 ? 3 : 0, pointHoverRadius: 7, pointBackgroundColor: '#1B6B3A' },
      { label: 'Amount Invested', data: filtered.map((d) => d.invested), borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.04)', fill: true, pointRadius: 0, pointHoverRadius: 5 },
    ],
  };

  const multiplier = totalInvested > 0 ? (finalCorpus / totalInvested).toFixed(1) : '0';

  return (
    <div className="bp-proj-card glass-card" id="bp-wealth-projection">
      <h3>Combined Wealth Projection</h3>
      <p className="bp-goals-sub">Your current portfolio plus every goal's allocated SIP, growing together over time.</p>

      <div className="bp-proj-stats">
        {[
          { label: 'Projected Corpus', value: formatCompact(finalCorpus), color: 'var(--green)' },
          { label: 'You Invest', value: formatCompact(totalInvested), color: 'var(--text-primary)' },
          { label: 'Total Monthly SIP', value: formatCompact(monthlyInvestment), color: 'var(--text-primary)' },
          { label: 'Blended Return / Multiple', value: `${projectedReturn}% · ${multiplier}x`, color: 'var(--accent-glow)' },
        ].map((s, i) => (
          <div className="bp-proj-stat" key={i}>
            <span className="bp-proj-stat-label">{s.label}</span>
            <span className="mono bp-proj-stat-value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div
        role="img"
        aria-label={`Projected corpus grows from your current investments to ${formatCompact(finalCorpus)} by age ${projectionData[projectionData.length - 1]?.age ?? ''}, against ${formatCompact(totalInvested)} invested.`}
      >
        <ChartDisplay type="line" data={chartData} height={240} />
      </div>
    </div>
  );
}
