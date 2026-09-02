import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import { humanLifeValue } from '../../utils/calculations';
import { Heart } from 'lucide-react';

export default function HumanLifeValueCalculator() {
  const [income, setIncome] = useState(600000);
  const [expenses, setExpenses] = useState(200000);
  const [yearsToRetire, setYearsToRetire] = useState(30);
  const [discount, setDiscount] = useState(6);

  const hlv = useMemo(() => Math.round(humanLifeValue(income, expenses, yearsToRetire, discount)), [income, expenses, yearsToRetire, discount]);

  return (
    <CalculatorLayout title="Human Life Value" description="Calculate the economic value of your life" icon={Heart} category="insurance-tax">
      <div className="calc-inputs">
        <SliderInput label="Annual Income" value={income} onChange={setIncome} min={100000} max={10000000} step={50000} prefix="₹" id="hlv-income" />
        <SliderInput label="Annual Personal Expenses" value={expenses} onChange={setExpenses} min={0} max={5000000} step={10000} prefix="₹" id="hlv-expense" />
        <SliderInput label="Years to Retirement" value={yearsToRetire} onChange={setYearsToRetire} min={1} max={40} id="hlv-years" />
        <SliderInput label="Discount Rate" value={discount} onChange={setDiscount} min={2} max={12} step={0.5} suffix="%" id="hlv-discount" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Human Life Value" value={hlv} className="highlight full-width" />
          <ResultDisplay label="Annual Net Contribution" value={income - expenses} />
          <ResultDisplay label="Years Remaining" value={yearsToRetire} type="number" />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 16 }}>
          HLV = Present value of your future earnings minus personal expenses. This is the minimum life insurance cover your family needs.
        </p>
      </div>
    </CalculatorLayout>
  );
}
