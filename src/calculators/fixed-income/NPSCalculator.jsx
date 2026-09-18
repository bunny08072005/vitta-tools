import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import ReportButton from '../../components/ReportButton';
import { npsCalculation } from '../../utils/calculations';
import { Award } from 'lucide-react';

export default function NPSCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(30);
  const [annuity, setAnnuity] = useState(40);

  const results = useMemo(() => npsCalculation(monthly, rate, years, annuity), [monthly, rate, years, annuity]);

  const chartData = {
    labels: ['Lumpsum (Tax-free)', 'Annuity Purchase'],
    datasets: [{ data: [results.lumpsum, results.annuityAmount], backgroundColor: ['#6366f1', '#f59e0b'] }],
  };

  return (
    <CalculatorLayout title="NPS Calculator" description="Plan your National Pension System investments" icon={Award} category="fixed-income">
      <div className="calc-inputs">
        <SliderInput label="Monthly Contribution" value={monthly} onChange={setMonthly} min={500} max={500000} step={500} prefix="₹" id="nps-monthly" />
        <SliderInput label="Expected Return (p.a.)" value={rate} onChange={setRate} min={5} max={14} step={0.5} suffix="%" id="nps-rate" />
        <SliderInput label="Years till Retirement" value={years} onChange={setYears} min={1} max={40} suffix=" yrs" id="nps-years" />
        <SliderInput label="Annuity %" value={annuity} onChange={setAnnuity} min={40} max={100} suffix="%" id="nps-annuity" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Total Corpus" value={results.totalCorpus} className="highlight full-width" />
          <ResultDisplay label="Lumpsum Payout" value={results.lumpsum} />
          <ResultDisplay label="Annuity Investment" value={results.annuityAmount} />
          <ResultDisplay label="Total Invested" value={results.totalInvested} />
          <ResultDisplay label="Wealth Gained" value={results.wealthGained} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateNPSReport } = await import('../../utils/pdfReport');
            await generateNPSReport({ monthly, rate, years, annuity, results, forName });
          }}
        />
        <ChartDisplay type="doughnut" data={chartData} height={220} />
      </div>
    </CalculatorLayout>
  );
}
