import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import { fireNumber, goalSIP } from '../../utils/calculations';
import { Flame } from 'lucide-react';

export default function FIRECalculator() {
  const [annualExpense, setAnnualExpense] = useState(500000);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [rate, setRate] = useState(12);

  const results = useMemo(() => {
    const target = fireNumber(annualExpense, withdrawalRate);
    const gap = Math.max(0, target - currentSavings);
    // Estimate years to FIRE
    let yearsToFire = 0;
    if (gap > 0 && rate > 0) {
      for (let y = 1; y <= 50; y++) {
        const monthlySIP = goalSIP(gap, rate, y);
        if (monthlySIP < annualExpense / 12 * 0.5) { yearsToFire = y; break; }
      }
      if (yearsToFire === 0) yearsToFire = 50;
    }
    const monthlySIP = yearsToFire > 0 ? Math.round(goalSIP(gap, rate, yearsToFire)) : 0;
    return { fireNumber: Math.round(target), gap: Math.round(gap), yearsToFire, monthlySIP, monthlyPassive: Math.round(annualExpense / 12) };
  }, [annualExpense, withdrawalRate, currentSavings, rate]);

  return (
    <CalculatorLayout title="FIRE Calculator" description="Financial Independence, Retire Early" icon={Flame} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Annual Expenses" value={annualExpense} onChange={setAnnualExpense} min={100000} max={5000000} step={10000} prefix="₹" id="fire-expense" />
        <SliderInput label="Safe Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} min={2} max={6} step={0.5} suffix="%" id="fire-swr" />
        <SliderInput label="Current Savings/Investments" value={currentSavings} onChange={setCurrentSavings} min={0} max={50000000} step={50000} prefix="₹" id="fire-savings" />
        <SliderInput label="Expected Return (p.a.)" value={rate} onChange={setRate} min={5} max={15} step={0.5} suffix="%" id="fire-rate" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="FIRE Number" value={results.fireNumber} className="highlight full-width" />
          <ResultDisplay label="Gap to FIRE" value={results.gap} />
          <ResultDisplay label="Monthly Passive Income" value={results.monthlyPassive} />
          <ResultDisplay label="Est. Years to FIRE" value={results.yearsToFire} type="number" />
          <ResultDisplay label="Required Monthly SIP" value={results.monthlySIP} />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 16 }}>
          💡 FIRE Number = Annual Expenses ÷ Safe Withdrawal Rate. Once your investments reach this number,
          you can live off the returns without depleting your corpus.
        </p>
      </div>
    </CalculatorLayout>
  );
}
