import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import { calculateCAGR } from '../../utils/calculations';
import { LineChart } from 'lucide-react';

export default function CAGRCalculator() {
  const [initial, setInitial] = useState(100000);
  const [final_, setFinal] = useState(300000);
  const [years, setYears] = useState(5);

  const cagr = useMemo(() => calculateCAGR(initial, final_, years), [initial, final_, years]);

  return (
    <CalculatorLayout title="CAGR Calculator" description="Find the Compound Annual Growth Rate" icon={LineChart} category="investment">
      <div className="calc-inputs">
        <SliderInput label="Initial Value" value={initial} onChange={setInitial} min={1000} max={10000000} step={1000} prefix="₹" id="cagr-init" />
        <SliderInput label="Final Value" value={final_} onChange={setFinal} min={1000} max={100000000} step={1000} prefix="₹" id="cagr-final" />
        <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="cagr-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="CAGR" value={Math.round(cagr * 100) / 100} type="percent" className="highlight full-width" />
          <ResultDisplay label="Absolute Returns" value={final_ - initial} />
          <ResultDisplay label="Absolute Return %" value={Math.round(((final_ - initial) / initial) * 10000) / 100} type="percent" />
        </div>
      </div>
    </CalculatorLayout>
  );
}
