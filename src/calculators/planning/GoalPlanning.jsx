import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { goalSIP, inflationAdjusted } from '../../utils/calculations';
import { Goal } from 'lucide-react';

export default function GoalPlanning() {
  const [target, setTarget] = useState(2000000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(6);

  const results = useMemo(() => {
    const inflatedTarget = inflationAdjusted(target, inflation, years);
    const sip = goalSIP(inflatedTarget, rate, years);
    const totalInvested = sip * years * 12;
    return { inflatedTarget: Math.round(inflatedTarget), sip: Math.round(sip), totalInvested: Math.round(totalInvested), gains: Math.round(inflatedTarget - totalInvested) };
  }, [target, years, rate, inflation]);

  const chartData = {
    labels: ['Your SIP Investment', 'Returns by Market'],
    datasets: [{ data: [results.totalInvested, Math.max(0, results.gains)], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="Goal Planning" description="How much to invest monthly to reach your financial goal" icon={Goal} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Goal Amount (Today's Value)" value={target} onChange={setTarget} min={50000} max={100000000} step={50000} prefix="₹" id="goal-target" />
        <SliderInput label="Time to Goal" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="goal-years" />
        <SliderInput label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" id="goal-rate" />
        <SliderInput label="Inflation Rate" value={inflation} onChange={setInflation} min={0} max={12} step={0.5} suffix="%" id="goal-inflation" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Required Monthly SIP" value={results.sip} className="highlight full-width" />
          <ResultDisplay label="Future Goal (Inflation Adj.)" value={results.inflatedTarget} />
          <ResultDisplay label="Total Investment" value={results.totalInvested} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
