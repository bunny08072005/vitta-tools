import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { sipFutureValue, formatCurrency, sipProjection } from '../../utils/calculations';
import { TrendingUp } from 'lucide-react';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const fv = sipFutureValue(monthly, rate, years);
    const invested = monthly * years * 12;
    const gains = fv - invested;
    const projection = sipProjection(monthly, rate, years);
    return { fv: Math.round(fv), invested, gains: Math.round(gains), projection };
  }, [monthly, rate, years]);

  const chartData = {
    labels: ['Invested Amount', 'Est. Returns'],
    datasets: [{ data: [results.invested, results.gains], backgroundColor: ['#06b6d4', '#1B6B3A'] }],
  };

  const lineData = {
    labels: results.projection.map(d => `Y${d.year}`),
    datasets: [
      { label: 'Corpus Value', data: results.projection.map(d => d.value), borderColor: '#1B6B3A', backgroundColor: 'rgba(27,107,58,0.1)' },
      { label: 'Amount Invested', data: results.projection.map(d => d.invested), borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.05)' },
    ],
  };

  return (
    <CalculatorLayout title="SIP Calculator" description="Calculate returns on your Systematic Investment Plan" icon={TrendingUp} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Monthly Investment" value={monthly} onChange={setMonthly} min={100} max={1000000} step={100} prefix="₹" id="sip-monthly" />
        <SliderInput label="Expected Return Rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" id="sip-rate" />
        <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={40} suffix=" yrs" id="sip-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Total Value" value={results.fv} className="highlight full-width" />
          <ResultDisplay label="Invested Amount" value={results.invested} />
          <ResultDisplay label="Est. Returns" value={results.gains} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateSIPReport } = await import('../../utils/pdfReport');
            await generateSIPReport({ monthly, rate, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={220} />
        <ChartDisplay type="line" data={lineData} height={200} />
      </div>
    </CalculatorLayout>
  );
}
