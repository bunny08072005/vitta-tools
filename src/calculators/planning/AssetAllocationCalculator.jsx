import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ChartDisplay from '../../components/ChartDisplay';
import { Layers } from 'lucide-react';

export default function AssetAllocationCalculator() {
  const [age, setAge] = useState(25);
  const [risk, setRisk] = useState('moderate');

  const allocation = useMemo(() => {
    let equity = Math.max(20, Math.min(85, 110 - age));
    const mod = { conservative: -15, moderate: 0, aggressive: 10 };
    equity = Math.max(15, Math.min(90, equity + (mod[risk] || 0)));
    const remaining = 100 - equity;
    return { equity: Math.round(equity), debt: Math.round(remaining * 0.6), gold: Math.round(remaining * 0.25), reit: remaining - Math.round(remaining * 0.6) - Math.round(remaining * 0.25) };
  }, [age, risk]);

  const chartData = {
    labels: ['Equity (Stocks/MF)', 'Debt (FD/PPF/Bonds)', 'Gold (ETF/SGB)', 'REITs / Others'],
    datasets: [{ data: [allocation.equity, allocation.debt, allocation.gold, allocation.reit], backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="Asset Allocation" description="Estimate a sample portfolio split using standard age and risk-profile formulas" icon={Layers} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Your Age" value={age} onChange={setAge} min={18} max={70} id="aa-age" />
        <div className="input-group">
          <label>Risk Profile</label>
          <select className="calc-select" value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="conservative">Conservative — Safety first</option>
            <option value="moderate">Moderate — Balanced growth</option>
            <option value="aggressive">Aggressive — Maximum growth</option>
          </select>
        </div>
      </div>
      <div className="calc-results">
        <ChartDisplay type="doughnut" data={chartData} height={260} />
        <div className="result-grid">
          <div className="result-item"><span className="result-label">Equity</span><span className="result-value mono" style={{color:'#6366f1'}}>{allocation.equity}%</span></div>
          <div className="result-item"><span className="result-label">Debt</span><span className="result-value mono" style={{color:'#06b6d4'}}>{allocation.debt}%</span></div>
          <div className="result-item"><span className="result-label">Gold</span><span className="result-value mono" style={{color:'#f59e0b'}}>{allocation.gold}%</span></div>
          <div className="result-item"><span className="result-label">REITs</span><span className="result-value mono" style={{color:'#22c55e'}}>{allocation.reit}%</span></div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
