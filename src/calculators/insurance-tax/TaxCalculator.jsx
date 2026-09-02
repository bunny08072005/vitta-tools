import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { calculateTax, formatCurrency } from '../../utils/calculations';
import { Receipt } from 'lucide-react';

export default function TaxCalculator() {
  const [income, setIncome] = useState(1000000);
  const [ded80C, setDed80C] = useState(150000);
  const [ded80D, setDed80D] = useState(25000);
  const [hra, setHra] = useState(0);
  const [other, setOther] = useState(0);

  const results = useMemo(() => calculateTax(income, ded80C, ded80D, hra, other), [income, ded80C, ded80D, hra, other]);

  const chartData = {
    labels: ['Old Regime Tax', 'New Regime Tax'],
    datasets: [{ data: [results.old.total, results.new.total], backgroundColor: ['#f59e0b', '#6366f1'] }],
  };

  return (
    <CalculatorLayout title="Tax Calculator" description="Compare Old vs New regime — FY 2025-26" icon={Receipt} category="insurance-tax">
      <div className="calc-inputs">
        <SliderInput label="Gross Annual Income" value={income} onChange={setIncome} min={250000} max={50000000} step={10000} prefix="₹" id="tax-income" />
        <SliderInput label="Section 80C (Old Regime)" value={ded80C} onChange={setDed80C} min={0} max={150000} step={1000} prefix="₹" id="tax-80c" />
        <SliderInput label="Section 80D Health Insurance" value={ded80D} onChange={setDed80D} min={0} max={100000} step={1000} prefix="₹" id="tax-80d" />
        <SliderInput label="HRA Exemption" value={hra} onChange={setHra} min={0} max={500000} step={1000} prefix="₹" id="tax-hra" />
        <SliderInput label="Other Deductions" value={other} onChange={setOther} min={0} max={500000} step={1000} prefix="₹" id="tax-other" />
      </div>
      <div className="calc-results">
        <div style={{ padding: 16, background: results.betterRegime === 'New' ? 'var(--accent-soft)' : 'var(--amber-soft)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: results.betterRegime === 'New' ? 'var(--accent-glow)' : 'var(--amber)' }}>
            ✨ {results.betterRegime} Regime saves you {formatCurrency(Math.abs(results.savings))}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, color: 'var(--amber)' }}>Old Regime</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxable Income</p>
            <p className="mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{formatCurrency(results.old.taxableIncome)}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tax + Cess</p>
            <p className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--amber)' }}>{formatCurrency(results.old.total)}</p>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, color: 'var(--accent-glow)' }}>New Regime</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxable Income</p>
            <p className="mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{formatCurrency(results.new.taxableIncome)}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tax + Cess</p>
            <p className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-glow)' }}>{formatCurrency(results.new.total)}</p>
          </div>
        </div>
        <ChartDisplay type="bar" data={chartData} height={180} />
      </div>
    </CalculatorLayout>
  );
}
