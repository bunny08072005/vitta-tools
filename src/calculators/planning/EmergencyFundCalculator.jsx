import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ReportButton from '../../components/ReportButton';
import { emergencyFund } from '../../utils/calculations';
import { Umbrella } from 'lucide-react';

export default function EmergencyFundCalculator() {
  const [expense, setExpense] = useState(30000);
  const [months, setMonths] = useState(6);
  const [current, setCurrent] = useState(50000);

  const results = useMemo(() => {
    const required = emergencyFund(expense, months);
    const gap = Math.max(0, required - current);
    const covered = current / expense;
    return { required, gap, covered: Math.round(covered * 10) / 10 };
  }, [expense, months, current]);

  return (
    <CalculatorLayout title="Emergency Fund" description="Calculate how much emergency fund you need" icon={Umbrella} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Monthly Expenses" value={expense} onChange={setExpense} min={5000} max={2500000} step={1000} prefix="₹" id="emg-expense" />
        <SliderInput label="Months of Cover" value={months} onChange={setMonths} min={3} max={12} id="emg-months" />
        <SliderInput label="Current Emergency Savings" value={current} onChange={setCurrent} min={0} max={25000000} step={5000} prefix="₹" id="emg-current" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Required Fund" value={results.required} className="highlight full-width" />
          <ResultDisplay label="Gap to Fill" value={results.gap} />
          <ResultDisplay label="Months Covered" value={results.covered} type="number" />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateEmergencyFundReport } = await import('../../utils/pdfReport');
            await generateEmergencyFundReport({ expense, months, current, results, forName });
          }}
        />
        <div style={{ padding: 16, background: results.gap > 0 ? 'var(--red-soft)' : 'var(--green-soft)', borderRadius: 'var(--radius-md)', marginTop: 16 }}>
          <p style={{ fontSize: '0.85rem', color: results.gap > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 500 }}>
            {results.gap > 0
              ? `⚠️ You need ₹${results.gap.toLocaleString('en-IN')} more. Save ₹${Math.round(results.gap / 6).toLocaleString('en-IN')}/month for 6 months.`
              : '✅ Your emergency fund is adequate!'}
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
