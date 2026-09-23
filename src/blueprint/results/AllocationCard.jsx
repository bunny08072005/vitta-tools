import ChartDisplay from '../../components/ChartDisplay';

export default function AllocationCard({ allocation, instruments }) {
  const chartData = {
    labels: ['Equity', 'Debt', 'Gold', 'REITs'],
    datasets: [{
      data: [allocation.equity, allocation.debt, allocation.gold, allocation.reit],
      backgroundColor: ['#1B6B3A', '#06b6d4', '#C5A55A', '#10b981'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="bp-alloc-card glass-card" id="bp-allocation">
      <h3>Recommended Portfolio Mix</h3>
      <p className="bp-goals-sub">A general reference allocation based on your age & risk profile — each goal above uses its own timeline-adjusted mix.</p>

      <div
        role="img"
        aria-label={`Recommended allocation: ${allocation.equity}% equity, ${allocation.debt}% debt, ${allocation.gold}% gold, ${allocation.reit}% REITs and other.`}
      >
        <ChartDisplay type="doughnut" data={chartData} height={180} />
      </div>

      <div className="bp-alloc-instruments">
        <h4>Illustrative Instruments</h4>
        {instruments.map((inst, i) => {
          const catColor = inst.category === 'Equity' ? '#1B6B3A' : inst.category === 'Debt' ? '#06b6d4' : '#C5A55A';
          return (
            <div className="bp-alloc-row" key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{ width: 3, height: 24, borderRadius: 2, background: catColor, minWidth: 3 }} />
                <span className="bp-alloc-row-name">{inst.name}</span>
              </div>
              <span className="mono bp-alloc-row-pct">{inst.percentOfTotal}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
