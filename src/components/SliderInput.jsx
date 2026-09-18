import { useState, useEffect } from 'react';

export default function SliderInput({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', id }) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (!isFocused) {
      setText(String(value));
    }
  }, [value, isFocused]);

  const handleSlider = (e) => {
    onChange(Number(e.target.value));
  };

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setText(raw);
    if (raw === '' || raw === '.') return;
    const num = Number(raw);
    if (!Number.isNaN(num)) onChange(num);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    const num = Number(text);
    const clamped = Math.min(max, Math.max(min, Number.isNaN(num) ? min : num));
    onChange(clamped);
    setText(String(clamped));
  };

  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  return (
    <div className="slider-input-group" id={id}>
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        <div className={`slider-value-box ${isFocused ? 'focused' : ''}`}>
          {prefix && <span className="slider-prefix">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            className="slider-number-input"
            value={text}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {suffix && <span className="slider-suffix">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        className="range-slider"
        min={min}
        max={max}
        step={step}
        value={clampedValue}
        onChange={handleSlider}
        style={{
          background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${percentage}%, var(--bg-elevated) ${percentage}%, var(--bg-elevated) 100%)`
        }}
      />
      <div className="slider-range-labels">
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
}
