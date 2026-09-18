import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { calculateEMI } from '../../utils/calculations';
import { Calculator } from 'lucide-react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const emi = calculateEMI(principal, rate, years);
    const total = emi * years * 12;
    return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - principal) };
  }, [principal, rate, years]);

  const chartData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [{ data: [principal, results.interest], backgroundColor: ['#6366f1', '#ef4444'] }],
  };

  return (
    <CalculatorLayout title="EMI Calculator" description="Calculate monthly EMI for any loan" icon={Calculator} category="loans">
      <div className="calc-inputs">
        <SliderInput label="Loan Amount" value={principal} onChange={setPrincipal} min={10000} max={250000000} step={10000} prefix="₹" id="emi-principal" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.1} suffix="%" id="emi-rate" />
        <SliderInput label="Loan Tenure" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="emi-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Monthly EMI" value={results.emi} className="highlight full-width" />
          <ResultDisplay label="Total Interest" value={results.interest} />
          <ResultDisplay label="Total Payment" value={results.total} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateEMIReport } = await import('../../utils/pdfReport');
            await generateEMIReport({ principal, rate, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
