import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import { calculateHRA, formatCurrency } from '../../utils/calculations';
import { Building2 } from 'lucide-react';

export default function HRACalculator() {
  const [basic, setBasic] = useState(50000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rent, setRent] = useState(15000);
  const [metro, setMetro] = useState(true);

  const results = useMemo(() => calculateHRA(basic * 12, hraReceived * 12, rent * 12, metro), [basic, hraReceived, rent, metro]);

  return (
    <CalculatorLayout title="HRA Calculator" description="Calculate HRA exemption for tax saving" icon={Building2} category="insurance-tax">
      <div className="calc-inputs">
        <SliderInput label="Basic Salary (Monthly)" value={basic} onChange={setBasic} min={5000} max={500000} step={1000} prefix="₹" id="hra-basic" />
        <SliderInput label="HRA Received (Monthly)" value={hraReceived} onChange={setHraReceived} min={0} max={200000} step={500} prefix="₹" id="hra-received" />
        <SliderInput label="Rent Paid (Monthly)" value={rent} onChange={setRent} min={0} max={200000} step={500} prefix="₹" id="hra-rent" />
        <div className="toggle-group">
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Metro City?</label>
          <label className="toggle-switch">
            <input type="checkbox" checked={metro} onChange={e => setMetro(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="HRA Exemption (Annual)" value={results.exemption} className="highlight full-width" />
          <ResultDisplay label="Taxable HRA" value={results.taxableHRA} />
        </div>
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 12 }}>Exemption Calculation (Min of 3)</h4>
          {[
            { label: '1. Actual HRA received', value: results.breakdown.actualHRA },
            { label: `2. Rent paid − 10% of Basic`, value: results.breakdown.rentMinus10Percent },
            { label: `3. ${metro ? '50' : '40'}% of Basic Salary`, value: results.breakdown.percentOfBasic },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: item.value === results.exemption ? 'var(--green)' : 'var(--text-primary)' }}>
                {formatCurrency(item.value)} {item.value === results.exemption && '✓'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  );
}
