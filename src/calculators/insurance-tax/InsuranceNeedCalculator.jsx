import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { insuranceNeed } from '../../utils/calculations';
import { Shield } from 'lucide-react';

export default function InsuranceNeedCalculator() {
  const [income, setIncome] = useState(600000);
  const [yearsReplace, setYearsReplace] = useState(15);
  const [liabilities, setLiabilities] = useState(2000000);
  const [futureCosts, setFutureCosts] = useState(1000000);
  const [existing, setExisting] = useState(500000);

  const results = useMemo(() => {
    const need = insuranceNeed(income, yearsReplace, liabilities, existing, futureCosts);
    return { need: Math.max(0, Math.round(need)), incomeReplacement: income * yearsReplace, total: income * yearsReplace + liabilities + futureCosts };
  }, [income, yearsReplace, liabilities, futureCosts, existing]);

  const chartData = {
    labels: ['Income Replacement', 'Liabilities', 'Future Costs', 'Existing Cover'],
    datasets: [{ data: [income * yearsReplace, liabilities, futureCosts, existing], backgroundColor: ['#6366f1', '#ef4444', '#f59e0b', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="Insurance Need" description="Calculate how much life insurance you need" icon={Shield} category="insurance-tax">
      <div className="calc-inputs">
        <SliderInput label="Annual Income" value={income} onChange={setIncome} min={100000} max={10000000} step={50000} prefix="₹" id="ins-income" />
        <SliderInput label="Years to Replace Income" value={yearsReplace} onChange={setYearsReplace} min={5} max={30} id="ins-years" />
        <SliderInput label="Outstanding Liabilities" value={liabilities} onChange={setLiabilities} min={0} max={50000000} step={100000} prefix="₹" id="ins-liab" />
        <SliderInput label="Future Costs (Education etc.)" value={futureCosts} onChange={setFutureCosts} min={0} max={20000000} step={100000} prefix="₹" id="ins-future" />
        <SliderInput label="Existing Life Cover" value={existing} onChange={setExisting} min={0} max={50000000} step={100000} prefix="₹" id="ins-existing" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Insurance You Need" value={results.need} className="highlight full-width" />
          <ResultDisplay label="Income Replacement" value={results.incomeReplacement} />
          <ResultDisplay label="Existing Cover" value={existing} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
