import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import ReportButton from '../../components/ReportButton';
import { inflationAdjusted } from '../../utils/calculations';
import { Percent } from 'lucide-react';

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const future = inflationAdjusted(amount, rate, years);
    const purchasingPower = amount / Math.pow(1 + rate / 100, years);
    return { futureValue: Math.round(future), purchasingPower: Math.round(purchasingPower), loss: Math.round(amount - purchasingPower) };
  }, [amount, rate, years]);

  return (
    <CalculatorLayout title="Inflation Calculator" description="See how inflation impacts your money" icon={Percent} category="planning">
      <div className="calc-inputs">
        <SliderInput label="Current Amount" value={amount} onChange={setAmount} min={1000} max={50000000} step={1000} prefix="₹" id="inf-amount" />
        <SliderInput label="Inflation Rate" value={rate} onChange={setRate} min={1} max={15} step={0.5} suffix="%" id="inf-rate" />
        <SliderInput label="After Years" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="inf-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label={`₹${amount.toLocaleString('en-IN')} will feel like`} value={results.purchasingPower} className="highlight full-width" />
          <ResultDisplay label={`To buy what costs ₹${amount.toLocaleString('en-IN')} today`} value={results.futureValue} />
          <ResultDisplay label="Purchasing Power Lost" value={results.loss} />
        </div>
        <ReportButton
          onGenerate={async (forName) => {
            const { generateInflationReport } = await import('../../utils/pdfReport');
            await generateInflationReport({ amount, rate, years, results, forName });
          }}
        />
        <div style={{ padding: 16, background: 'var(--amber-soft)', borderRadius: 'var(--radius-md)', marginTop: 16 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--amber)', fontWeight: 500 }}>
            ⚠️ At {rate}% inflation, your ₹{amount.toLocaleString('en-IN')} will have the purchasing power of only ₹{results.purchasingPower.toLocaleString('en-IN')} in {years} years.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
