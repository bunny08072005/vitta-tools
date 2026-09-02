import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../utils/calculations';

export default function ResultDisplay({ label, value, type = 'currency', className = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const start = prevValue.current;
    const end = typeof value === 'number' ? value : 0;
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (end - start) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value]);

  const formatted = type === 'currency'
    ? formatCurrency(Math.round(displayValue))
    : type === 'percent'
      ? `${displayValue.toFixed(2)}%`
      : Math.round(displayValue).toLocaleString('en-IN');

  const colorClass = type === 'currency' && value > 0 ? 'positive' : '';

  return (
    <div className={`result-item ${className}`}>
      <span className="result-label">{label}</span>
      <span className={`result-value mono ${colorClass}`}>{formatted}</span>
    </div>
  );
}
