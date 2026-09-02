import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { generateAmortization, formatCurrency } from '../../utils/calculations';
import { Building2 } from 'lucide-react';

export default function HomeLoanCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const results = useMemo(() => generateAmortization(principal, rate, years), [principal, rate, years]);

  const chartData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [{ data: [principal, results.totalInterest], backgroundColor: ['#6366f1', '#ef4444'] }],
  };

  const barData = {
    labels: results.schedule.map(d => `Y${d.year}`),
    datasets: [
      { label: 'Principal', data: results.schedule.map(d => d.principal), backgroundColor: '#6366f1' },
      { label: 'Interest', data: results.schedule.map(d => d.interest), backgroundColor: 'rgba(239,68,68,0.6)' },
    ],
  };

  return (
    <CalculatorLayout title="Home Loan Calculator" description="Home loan EMI with amortization schedule" icon={Building2} category="loans">
      <div className="calc-inputs">
        <SliderInput label="Loan Amount" value={principal} onChange={setPrincipal} min={100000} max={100000000} step={100000} prefix="₹" id="hl-principal" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={5} max={15} step={0.1} suffix="%" id="hl-rate" />
        <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="hl-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Monthly EMI" value={results.emi} className="highlight full-width" />
          <ResultDisplay label="Total Interest" value={results.totalInterest} />
          <ResultDisplay label="Total Payment" value={results.totalPayment} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={200} />
        <h4 style={{ fontSize: '0.9rem', marginTop: 16 }}>Yearly Breakdown</h4>
        <ChartDisplay type="bar" data={barData} height={200} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
      </div>
    </CalculatorLayout>
  );
}
