import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ChartDisplay from '../../components/ChartDisplay';
import { retirementCorpus, goalSIP } from '../../utils/calculations';
import { Clock } from 'lucide-react';

export default function RetirementPlanning() {
  const [age, setAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);
  const [expense, setExpense] = useState(40000);
  const [inflation, setInflation] = useState(6);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(8);

  const results = useMemo(() => {
    const yearsToRetire = retireAge - age;
    const yearsInRetirement = 25;
    const corpus = retirementCorpus(expense, inflation, yearsToRetire, yearsInRetirement, postReturn);
    const monthlySIP = goalSIP(corpus, preReturn, yearsToRetire);
    const totalInvested = monthlySIP * yearsToRetire * 12;
    const futureExpense = expense * Math.pow(1 + inflation / 100, yearsToRetire);
    return { corpus: Math.round(corpus), monthlySIP: Math.round(monthlySIP), totalInvested: Math.round(totalInvested), futureExpense: Math.round(futureExpense), yearsToRetire };
  }, [age, retireAge, expense, inflation, preReturn, postReturn]);

  const chartData = {
    labels: ['Your Investment', 'Market Returns'],
    datasets: [{ data: [results.totalInvested, Math.max(0, results.corpus - results.totalInvested)], backgroundColor: ['#06b6d4', '#22c55e'] }],
  };

  return (
    <CalculatorLayout title="Retirement Planning" description="Calculate the corpus you need to retire comfortably" icon={Clock} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Current Age" value={age} onChange={setAge} min={18} max={60} id="ret-age" />
        <SliderInput label="Retirement Age" value={retireAge} onChange={setRetireAge} min={age + 1} max={75} id="ret-retire-age" />
        <SliderInput label="Monthly Expenses (Today)" value={expense} onChange={setExpense} min={5000} max={500000} step={1000} prefix="₹" id="ret-expense" />
        <SliderInput label="Inflation Rate" value={inflation} onChange={setInflation} min={2} max={12} step={0.5} suffix="%" id="ret-inflation" />
        <SliderInput label="Pre-Retirement Return" value={preReturn} onChange={setPreReturn} min={5} max={20} step={0.5} suffix="%" id="ret-pre" />
        <SliderInput label="Post-Retirement Return" value={postReturn} onChange={setPostReturn} min={3} max={12} step={0.5} suffix="%" id="ret-post" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Corpus Needed" value={results.corpus} className="highlight full-width" />
          <ResultDisplay label="Monthly SIP Required" value={results.monthlySIP} />
          <ResultDisplay label="Future Monthly Expense" value={results.futureExpense} />
        </div>
        <ChartDisplay type="doughnut" data={chartData} height={240} />
      </div>
    </CalculatorLayout>
  );
}
