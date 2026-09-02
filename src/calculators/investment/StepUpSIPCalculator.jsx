import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { stepUpSipFutureValue, stepUpSipTotalInvested } from '../../utils/calculations';
import { ArrowUpRight } from 'lucide-react';

export default function StepUpSIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);

  const results = useMemo(() => {
    const fv = stepUpSipFutureValue(monthly, rate, years, stepUp);
    const invested = stepUpSipTotalInvested(monthly, years, stepUp);
    return { fv: Math.round(fv), invested: Math.round(invested), gains: Math.round(fv - invested) };
  }, [monthly, rate, years, stepUp]);

  const chartData = {
    labels: ['Invested', 'Returns'],
    datasets: [{ data: [results.invested, results.gains], backgroundColor: ['#06b6d4', '#6366f1'] }],
  };

  return (
    <CalculatorLayout title="Step-up SIP Calculator" description="SIP with annual step-up percentage increase" icon={ArrowUpRight} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Starting Monthly SIP" value={monthly} onChange={setMonthly} min={500} max={200000} step={500} prefix="₹" id="stepup-monthly" />
        <SliderInput label="Annual Step-up" value={stepUp} onChange={setStepUp} min={1} max={50} step={1} suffix="%" id="stepup-percent" />
        <SliderInput label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" id="stepup-rate" />
        <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="stepup-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Total Value" value={results.fv} className="highlight full-width" />
          <ResultDisplay label="Total Invested" value={results.invested} />
          <ResultDisplay label="Wealth Gained" value={results.gains} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
