import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { swpCalculation } from '../../utils/calculations';
import { ArrowDownRight } from 'lucide-react';

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(30000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const results = useMemo(() => swpCalculation(corpus, withdrawal, rate, years), [corpus, withdrawal, rate, years]);

  const lineData = {
    labels: results.data.map(d => `Y${d.month / 12}`),
    datasets: [{ label: 'Remaining Corpus', data: results.data.map(d => d.corpus), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' }],
  };

  return (
    <CalculatorLayout title="SWP Calculator" description="Plan systematic withdrawals from your investments" icon={ArrowDownRight} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Total Corpus" value={corpus} onChange={setCorpus} min={100000} max={100000000} step={100000} prefix="₹" id="swp-corpus" />
        <SliderInput label="Monthly Withdrawal" value={withdrawal} onChange={setWithdrawal} min={1000} max={500000} step={1000} prefix="₹" id="swp-monthly" />
        <SliderInput label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" id="swp-rate" />
        <SliderInput label="Period" value={years} onChange={setYears} min={1} max={40} suffix=" yrs" id="swp-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Final Corpus" value={results.finalCorpus} className="highlight full-width" />
          <ResultDisplay label="Total Withdrawn" value={results.totalWithdrawn} />
          <ResultDisplay label="Initial Corpus" value={corpus} />
        </div>
        {results.data.length > 1 && <ChartDisplay type="line" data={lineData} height={220} />}
      </div>
    </CalculatorLayout>
  );
}
