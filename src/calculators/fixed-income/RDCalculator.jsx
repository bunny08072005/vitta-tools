import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { rdMaturity } from '../../utils/calculations';
import { PiggyBank } from 'lucide-react';

export default function RDCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const maturity = rdMaturity(monthly, rate, years);
    const invested = monthly * years * 12;
    return { maturity: Math.round(maturity), invested, interest: Math.round(maturity - invested) };
  }, [monthly, rate, years]);

  const chartData = {
    labels: ['Total Deposits', 'Interest Earned'],
    datasets: [{ data: [results.invested, results.interest], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="RD Calculator" description="Calculate Recurring Deposit maturity amount" icon={PiggyBank} category="fixed-income">
      <div className="calc-inputs">
        <SliderInput label="Monthly Deposit" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} prefix="₹" id="rd-monthly" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" id="rd-rate" />
        <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={10} suffix=" yrs" id="rd-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Maturity Amount" value={results.maturity} className="highlight full-width" />
          <ResultDisplay label="Total Deposited" value={results.invested} />
          <ResultDisplay label="Interest Earned" value={results.interest} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
