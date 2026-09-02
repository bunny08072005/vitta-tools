import ChartDisplay from '../components/ChartDisplay';
import { formatCurrency, formatCompact } from '../utils/calculations';

export default function WealthProjection({ projection, retirement }) {
  const { projectionData, finalCorpus, totalInvested, projectedReturn } = projection;

  // Show every year for < 20 years, every 2 years for 20-30, every 5 for 30+
  const interval = projectionData.length <= 20 ? 1 : projectionData.length <= 30 ? 2 : 5;
  const filtered = projectionData.filter((d, i) => i === 0 || (d.year % interval === 0) || i === projectionData.length - 1);

  const chartData = {
    labels: filtered.map(d => `Age ${d.age}`),
    datasets: [
      {
        label: 'Projected Corpus',
        data: filtered.map(d => d.corpus),
        borderColor: '#1B6B3A',
        backgroundColor: 'rgba(27, 107, 58, 0.08)',
        fill: true,
        pointRadius: filtered.length <= 15 ? 3 : 0,
        pointHoverRadius: 7,
        pointBackgroundColor: '#1B6B3A',
      },
      {
        label: 'Amount Invested',
        data: filtered.map(d => d.invested),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.04)',
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const wealthMultiplier = totalInvested > 0 ? (finalCorpus / totalInvested).toFixed(1) : '0';

  return (
    <div className="wealth-proj glass-card" id="wealth-projection">
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Wealth Projection</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Projected Corpus', value: formatCompact(finalCorpus), color: 'var(--green)' },
          { label: 'You Invest', value: formatCompact(totalInvested), color: 'var(--text-primary)' },
          { label: 'Wealth Created', value: formatCompact(finalCorpus - totalInvested), color: 'var(--green)' },
          { label: 'Return / Multiplier', value: `${projectedReturn}% · ${wealthMultiplier}x`, color: 'var(--accent-glow)' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '10px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{s.label}</span>
            <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 650, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Hover on the chart to see exact corpus at any age →
        </span>
      </div>

      <ChartDisplay type="line" data={chartData} height={240} />

      {/* Retirement readiness */}
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Retirement Readiness</h4>
          <span className="mono" style={{
            fontSize: '0.85rem', fontWeight: 700,
            color: retirement.readinessPercent >= 70 ? 'var(--green)' : retirement.readinessPercent >= 40 ? 'var(--amber)' : 'var(--red)'
          }}>{retirement.readinessPercent}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{
            height: '100%', borderRadius: 4, transition: 'width 1s var(--ease-out)',
            width: `${Math.min(100, retirement.readinessPercent)}%`,
            background: retirement.readinessPercent >= 70 ? 'var(--green)' : retirement.readinessPercent >= 40 ? 'var(--amber)' : 'var(--red)',
          }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Required at retirement</span>
            <span className="mono" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCompact(retirement.requiredCorpus)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Your projected corpus</span>
            <span className="mono" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCompact(retirement.projectedCorpus)}</span>
          </div>
        </div>
        {retirement.gap > 0 && (
          <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--red-soft)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--red)', fontWeight: 500 }}>
              Shortfall of <span className="mono">{formatCompact(retirement.gap)}</span> — consider increasing monthly SIP or retirement age
            </span>
          </div>
        )}
        {retirement.gap <= 0 && (
          <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--green-soft)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 500 }}>
              ✓ You're on track to build enough corpus for retirement
            </span>
          </div>
        )}
      </div>

      <style>{`
        .wealth-proj { padding: 24px; grid-column: 1 / -1; }
        @media (max-width: 768px) {
          .wealth-proj div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
