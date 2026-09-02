import { useState, useMemo } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import SliderInput from '../../components/SliderInput';
import ResultDisplay from '../../components/ResultDisplay';
import { bondYTM } from '../../utils/calculations';
import { BadgePercent } from 'lucide-react';

export default function BondYieldCalculator() {
  const [face, setFace] = useState(1000);
  const [coupon, setCoupon] = useState(8);
  const [price, setPrice] = useState(950);
  const [years, setYears] = useState(5);

  const ytm = useMemo(() => bondYTM(face, coupon, price, years), [face, coupon, price, years]);

  return (
    <CalculatorLayout title="Bond Yield Calculator" description="Calculate Yield to Maturity (YTM)" icon={BadgePercent} category="fixed-income">
      <div className="calc-inputs">
        <SliderInput label="Face Value" value={face} onChange={setFace} min={100} max={100000} step={100} prefix="₹" id="bond-face" />
        <SliderInput label="Coupon Rate" value={coupon} onChange={setCoupon} min={1} max={15} step={0.1} suffix="%" id="bond-coupon" />
        <SliderInput label="Current Market Price" value={price} onChange={setPrice} min={100} max={200000} step={10} prefix="₹" id="bond-price" />
        <SliderInput label="Years to Maturity" value={years} onChange={setYears} min={1} max={30} suffix=" yrs" id="bond-years" />
      </div>
      <div className="calc-results">
        <div className="result-grid">
          <ResultDisplay label="Yield to Maturity" value={Math.round(ytm * 100) / 100} type="percent" className="highlight full-width" />
          <ResultDisplay label="Annual Coupon" value={face * coupon / 100} />
          <ResultDisplay label="Capital Gain/Loss" value={face - price} />
        </div>
      </div>
    </CalculatorLayout>
  );
}
