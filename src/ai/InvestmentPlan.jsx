import ChartDisplay from '../components/ChartDisplay';
import { formatCurrency } from '../utils/calculations';

export default function InvestmentPlan({ plan }) {
  const { allocation, sipPlan, totalMonthlySIP, savings } = plan;

  const allocationData = {
    labels: ['Equity', 'Debt', 'Gold', 'REITs'],
    datasets: [{
      data: [allocation.equity, allocation.debt, allocation.gold, allocation.reit],
      backgroundColor: ['#1B6B3A', '#06b6d4', '#C5A55A', '#10b981'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="ip-card glass-card" id="investment-plan">
      <h3>Investment Plan</h3>

      <div className="ip-summary">
        <div className="ip-stat">
          <span className="ip-stat-label">Monthly SIP</span>
          <span className="ip-stat-value mono" style={{ color: 'var(--green)' }}>{formatCurrency(totalMonthlySIP)}</span>
        </div>
        <div className="ip-stat">
          <span className="ip-stat-label">Savings Rate</span>
          <span className="ip-stat-value mono">{savings.savingsRate}%</span>
        </div>
      </div>

      <ChartDisplay type="doughnut" data={allocationData} height={180} />

      <div className="ip-instruments">
        <h4>Monthly SIP Breakdown</h4>
        {sipPlan.filter(s => s.monthlySIP > 0).map((inst, i) => {
          const catColor = inst.category === 'Equity' ? '#1B6B3A' : inst.category === 'Debt' ? '#06b6d4' : inst.category === 'Gold' ? '#C5A55A' : '#10b981';
          return (
            <div className="ip-row" key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{ width: 3, height: 28, borderRadius: 2, background: catColor, minWidth: 3 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inst.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{inst.category} · {inst.percentOfTotal}%</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{formatCurrency(inst.monthlySIP)}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .ip-card { padding: 24px; }
        .ip-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
        .ip-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .ip-stat { padding: 12px; background: var(--glass); border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center; }
        .ip-stat-label { font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 500; }
        .ip-stat-value { font-size: 1.15rem; font-weight: 650; display: block; letter-spacing: -0.02em; }
        .ip-instruments { margin-top: 16px; }
        .ip-instruments h4 { font-size: 0.82rem; margin-bottom: 10px; color: var(--text-muted); font-weight: 500; }
        .ip-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color); gap: 12px; }
        .ip-row:last-child { border-bottom: none; }
      `}</style>
    </div>
  );
}
