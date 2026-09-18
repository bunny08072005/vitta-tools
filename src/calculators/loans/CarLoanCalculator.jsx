import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { calculateEMI } from '../../utils/calculations';
import { Car } from 'lucide-react';

export default function CarLoanCalculator() {
  const [price, setPrice] = useState(800000);
  const [down, setDown] = useState(200000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const loan = price - down;
    const emi = calculateEMI(loan, rate, years);
    const total = emi * years * 12;
    return { loan, emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - loan), totalCost: Math.round(total + down) };
  }, [price, down, rate, years]);

  const chartData = {
    labels: ['Down Payment', 'Loan Principal', 'Interest'],
    datasets: [{ data: [down, results.loan, results.interest], backgroundColor: ['#22c55e', '#6366f1', '#ef4444'] }],
  };

  return (
    <CalculatorLayout title="Car Loan Calculator" description="Calculate car loan EMI and total cost" icon={Car} category="loans">
      <div className="calc-inputs">
        <SliderInput label="Car Price" value={price} onChange={setPrice} min={100000} max={50000000} step={10000} prefix="₹" id="car-price" />
        <SliderInput label="Down Payment" value={down} onChange={v => setDown(Math.min(v, price))} min={0} max={price} step={10000} prefix="₹" id="car-down" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={5} max={18} step={0.1} suffix="%" id="car-rate" />
        <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={7} suffix=" yrs" id="car-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Monthly EMI" value={results.emi} className="highlight full-width" />
          <ResultDisplay label="Loan Amount" value={results.loan} />
          <ResultDisplay label="Total Interest" value={results.interest} />
          <ResultDisplay label="Total Cost of Car" value={results.totalCost} className="full-width" />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateCarLoanReport } = await import('../../utils/pdfReport');
            await generateCarLoanReport({ price, down, rate, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
