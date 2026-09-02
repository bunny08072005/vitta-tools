import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import ChartDisplay from '../../components/ChartDisplay';
import { formatCurrency } from '../../utils/calculations';
import { Wallet, Plus, Trash2 } from 'lucide-react';

const defaultAssets = [
  { name: 'Bank Savings', value: 100000 },
  { name: 'Fixed Deposits', value: 200000 },
  { name: 'Mutual Funds', value: 150000 },
  { name: 'Stocks', value: 50000 },
];

const defaultLiabilities = [
  { name: 'Home Loan', value: 2000000 },
  { name: 'Credit Card', value: 30000 },
];

export default function NetWorthTracker() {
  const [assets, setAssets] = useState(defaultAssets);
  const [liabilities, setLiabilities] = useState(defaultLiabilities);

  const totalAssets = useMemo(() => assets.reduce((s, a) => s + a.value, 0), [assets]);
  const totalLiab = useMemo(() => liabilities.reduce((s, l) => s + l.value, 0), [liabilities]);
  const netWorth = totalAssets - totalLiab;

  const addItem = (type) => {
    if (type === 'asset') setAssets([...assets, { name: 'New Asset', value: 0 }]);
    else setLiabilities([...liabilities, { name: 'New Liability', value: 0 }]);
  };

  const updateItem = (type, i, field, val) => {
    const list = type === 'asset' ? [...assets] : [...liabilities];
    list[i] = { ...list[i], [field]: field === 'value' ? Number(val) : val };
    type === 'asset' ? setAssets(list) : setLiabilities(list);
  };

  const removeItem = (type, i) => {
    type === 'asset' ? setAssets(assets.filter((_, idx) => idx !== i)) : setLiabilities(liabilities.filter((_, idx) => idx !== i));
  };

  const chartData = {
    labels: ['Total Assets', 'Total Liabilities'],
    datasets: [{ data: [totalAssets, totalLiab], backgroundColor: ['#22c55e', '#ef4444'] }],
  };

  const renderList = (items, type) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input-field" value={item.name} onChange={e => updateItem(type, i, 'name', e.target.value)} style={{ flex: 1 }} />
          <input className="input-field mono" type="number" value={item.value} onChange={e => updateItem(type, i, 'value', e.target.value)} style={{ width: 120 }} />
          <button onClick={() => removeItem(type, i)} className="btn btn-ghost" style={{ padding: 6, color: 'var(--red)' }}><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => addItem(type)} className="btn btn-secondary btn-sm"><Plus size={14} /> Add</button>
    </div>
  );

  return (
    <CalculatorLayout title="Net Worth Tracker" description="Track your total net worth" icon={Wallet} category="planning">
      <div className="calc-inputs">
        <h4 style={{ fontSize: '0.95rem', color: 'var(--green)' }}>Assets</h4>
        {renderList(assets, 'asset')}
        <h4 style={{ fontSize: '0.95rem', color: 'var(--red)', marginTop: 16 }}>Liabilities</h4>
        {renderList(liabilities, 'liability')}
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <div className="result-item highlight full-width">
            <span className="result-label">Net Worth</span>
            <span className={`result-value mono ${netWorth >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(netWorth)}</span>
          </div>
          <div className="result-item"><span className="result-label">Total Assets</span><span className="result-value mono" style={{ color: 'var(--green)' }}>{formatCurrency(totalAssets)}</span></div>
          <div className="result-item"><span className="result-label">Total Liabilities</span><span className="result-value mono" style={{ color: 'var(--red)' }}>{formatCurrency(totalLiab)}</span></div>
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={220} />
      </div>
    </CalculatorLayout>
  );
}
