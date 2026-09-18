import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { lumpsumFutureValue, calculateCAGR } from '../../utils/calculations';
import { BarChart3 } from 'lucide-react';

export default function MutualFundCalculator() {
  const [invested, setInvested] = useState(100000);
  const [currentVal, setCurrentVal] = useState(180000);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const cagr = calculateCAGR(invested, currentVal, years);
    const gains = currentVal - invested;
    const gainPercent = ((gains / invested) * 100);
    return { cagr: Math.round(cagr * 100) / 100, gains, gainPercent: Math.round(gainPercent * 100) / 100, absoluteReturn: gains };
  }, [invested, currentVal, years]);

  const chartData = {
    labels: ['Invested', 'Returns'],
    datasets: [{ data: [invested, Math.max(0, results.gains)], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="Mutual Fund Returns" description="Calculate mutual fund investment returns with CAGR" icon={BarChart3} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Amount Invested" value={invested} onChange={setInvested} min={1000} max={50000000} step={1000} prefix="₹" id="mf-invested" />
        <SliderInput label="Current Value" value={currentVal} onChange={setCurrentVal} min={1000} max={250000000} step={1000} prefix="₹" id="mf-current" />
        <SliderInput label="Investment Period" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="mf-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="CAGR" value={results.cagr} type="percent" className="highlight full-width" />
          <ResultDisplay label="Total Returns" value={results.gains} />
          <ResultDisplay label="Absolute Return %" value={results.gainPercent} type="percent" />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateMutualFundReport } = await import('../../utils/pdfReport');
            await generateMutualFundReport({ invested, currentVal, years, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
