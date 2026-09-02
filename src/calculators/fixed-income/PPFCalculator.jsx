import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { ppfCalculation } from '../../utils/calculations';
import { Coins } from 'lucide-react';

export default function PPFCalculator() {
  const [annual, setAnnual] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const results = useMemo(() => ppfCalculation(annual, rate, years), [annual, rate, years]);

  const chartData = {
    labels: ['Total Invested', 'Interest Earned'],
    datasets: [{ data: [results.totalInvested, results.interest], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  const lineData = {
    labels: results.yearData.map(d => `Y${d.year}`),
    datasets: [{ label: 'PPF Balance', data: results.yearData.map(d => d.balance), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }],
  };

  return (
    <CalculatorLayout title="PPF Calculator" description="Public Provident Fund returns over 15 years" icon={Coins} category="fixed-income">
      <div className="calc-inputs">
        <SliderInput label="Annual Deposit" value={annual} onChange={setAnnual} min={500} max={150000} step={500} prefix="₹" id="ppf-annual" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" id="ppf-rate" />
        <SliderInput label="Duration" value={years} onChange={setYears} min={15} max={50} suffix=" yrs" id="ppf-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Maturity Amount" value={results.maturity} className="highlight full-width" />
          <ResultDisplay label="Total Invested" value={results.totalInvested} />
          <ResultDisplay label="Interest Earned" value={results.interest} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={200} />
        <ChartDisplay type="line" data={lineData} height={200} />
      </div>
    </CalculatorLayout>
  );
}
