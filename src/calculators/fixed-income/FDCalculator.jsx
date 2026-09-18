import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { fdMaturity } from '../../utils/calculations';
import { Landmark } from 'lucide-react';

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const maturity = fdMaturity(principal, rate, years);
    return { maturity: Math.round(maturity), interest: Math.round(maturity - principal) };
  }, [principal, rate, years]);

  const chartData = {
    labels: ['Principal', 'Interest Earned'],
    datasets: [{ data: [principal, results.interest], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="FD Calculator" description="Calculate Fixed Deposit maturity with quarterly compounding" icon={Landmark} category="fixed-income">
      <div className="calc-inputs">
        <SliderInput label="Deposit Amount" value={principal} onChange={setPrincipal} min={1000} max={50000000} step={1000} prefix="₹" id="fd-principal" />
        <SliderInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={1} max={15} step={0.1} suffix="%" id="fd-rate" />
        <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={10} suffix=" yrs" id="fd-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Maturity Amount" value={results.maturity} className="highlight full-width" />
          <ResultDisplay label="Principal" value={principal} />
          <ResultDisplay label="Interest Earned" value={results.interest} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateFDReport } = await import('../../utils/pdfReport');
            await generateFDReport({ principal, rate, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
