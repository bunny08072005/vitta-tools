import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { lumpsumFutureValue } from '../../utils/calculations';
import { IndianRupee } from 'lucide-react';

export default function LumpsumCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const fv = lumpsumFutureValue(principal, rate, years);
    return { fv: Math.round(fv), invested: principal, gains: Math.round(fv - principal) };
  }, [principal, rate, years]);

  const chartData = {
    labels: ['Invested', 'Returns'],
    datasets: [{ data: [results.invested, results.gains], backgroundColor: ['#06b6d4', '#6366f1'] }],
  };

  return (
    <CalculatorLayout title="Lumpsum Calculator" description="Calculate returns on a one-time investment" icon={IndianRupee} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Investment Amount" value={principal} onChange={setPrincipal} min={1000} max={50000000} step={1000} prefix="₹" id="lump-principal" />
        <SliderInput label="Expected Return Rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" id="lump-rate" />
        <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={40} suffix=" yrs" id="lump-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Total Value" value={results.fv} className="highlight full-width" />
          <ResultDisplay label="Invested" value={results.invested} />
          <ResultDisplay label="Returns" value={results.gains} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateLumpsumReport } = await import('../../utils/pdfReport');
            await generateLumpsumReport({ principal, rate, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
