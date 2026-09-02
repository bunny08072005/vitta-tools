import { useState } from 'react';

export default function SliderInput({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', id }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSlider = (e) => {
    onChange(Number(e.target.value));
  };

  const handleInput = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val === '' || val === '.') {
      onChange(min);
      return;
    }
    const num = Number(val);
    onChange(Math.min(max, Math.max(min, num)));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-input-group" id={id}>
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        <div className={`slider-value-box ${isFocused ? 'focused' : ''}`}>
          {prefix && <span className="slider-prefix">{prefix}</span>}
          <input
            type="text"
            className="slider-number-input"
            value={value}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
        value={value}
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
