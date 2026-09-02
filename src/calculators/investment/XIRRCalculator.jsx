import { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import ResultDisplay from '../../components/ResultDisplay';
import { calculateXIRR } from '../../utils/calculations';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';

export default function XIRRCalculator() {
  const [cashflows, setCashflows] = useState([
    { date: '2020-01-01', amount: -100000 },
    { date: '2021-01-01', amount: -50000 },
    { date: '2023-06-15', amount: 200000 },
  ]);

  const addCashflow = () => setCashflows([...cashflows, { date: new Date().toISOString().split('T')[0], amount: 0 }]);
  const removeCashflow = (i) => setCashflows(cashflows.filter((_, idx) => idx !== i));
  const updateCashflow = (i, field, val) => {
    const updated = [...cashflows];
    updated[i] = { ...updated[i], [field]: field === 'amount' ? Number(val) : val };
    setCashflows(updated);
  };

  const xirr = (() => {
    try {
      const cfs = cashflows.map(cf => ({ date: new Date(cf.date), amount: cf.amount }));
      return calculateXIRR(cfs);
    } catch { return 0; }
  })();

  return (
    <CalculatorLayout title="XIRR Calculator" description="Calculate returns on irregular cashflows" icon={RefreshCw} category="investment">
      <div className="calc-inputs">
        <h4 style={{ fontSize: '0.95rem', marginBottom: 8 }}>Cash Flows</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>Use negative amounts for investments, positive for redemptions</p>
        {cashflows.map((cf, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input type="date" className="input-field" value={cf.date} onChange={e => updateCashflow(i, 'date', e.target.value)} style={{ flex: 1 }} />
            <input type="number" className="input-field mono" value={cf.amount} onChange={e => updateCashflow(i, 'amount', e.target.value)} style={{ flex: 1 }} placeholder="Amount" />
            <button onClick={() => removeCashflow(i)} className="btn btn-ghost" style={{ padding: 8, color: 'var(--red)' }}><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={addCashflow} className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}><Plus size={14} /> Add Cash Flow</button>
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="XIRR" value={Math.round(xirr * 100) / 100} type="percent" className="highlight full-width" />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 16 }}>
          XIRR accounts for the timing of each cash flow, giving you the true annualized return.
          Negative amounts = money invested, Positive = money received back.
        </p>
      </div>
    </CalculatorLayout>
  );
}
