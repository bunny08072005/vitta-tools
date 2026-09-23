import { useId } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

// Reusable controlled field — text / number / select — shared by every step so
// each step file only has to describe its own fields, not re-implement input
// handling. Mirrors the input-clamping behavior already used across the site's
// calculators (see SliderInput.jsx / VittaAI.jsx's renderField).
//
// Every variant below pairs its <label> with its control via a useId()-generated
// id (unique per rendered instance, so repeated rows — e.g. one "Type" field per
// portfolio entry — never collide) instead of just nesting them visually, so
// screen readers announce the label when the field receives focus.
export function WizardField({ label, value, onChange, type = 'number', hint, prefix, suffix, min, max, options, required, placeholder, showMonthlyPreview, allowEmpty }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  if (options) {
    return (
      <div className="bp-field">
        <label htmlFor={id}>{label}{required && <span className="bp-required" aria-hidden="true">*</span>}</label>
        <select id={id} className="calc-select" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hintId}>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {hint && <span className="bp-field-hint" id={hintId}>{hint}</span>}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="bp-field">
        <label htmlFor={id}>{label}{required && <span className="bp-required" aria-hidden="true">*</span>}</label>
        <input
          id={id}
          type="text"
          className="input-field"
          value={value}
          placeholder={placeholder}
          maxLength={60}
          required={required}
          aria-required={required || undefined}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
        />
        {hint && <span className="bp-field-hint" id={hintId}>{hint}</span>}
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="bp-field">
        <label htmlFor={id}>{label}</label>
        <select id={id} className="calc-select" value={value ? 'yes' : 'no'} onChange={(e) => onChange(e.target.value === 'yes')} aria-describedby={hintId}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        {hint && <span className="bp-field-hint" id={hintId}>{hint}</span>}
      </div>
    );
  }

  return (
    <div className="bp-field">
      <label htmlFor={id}>{label}{required && <span className="bp-required" aria-hidden="true">*</span>}</label>
      <div className="bp-input-wrap">
        {prefix && <span className="bp-input-prefix" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={`input-field ${prefix ? 'mono' : ''}`}
          value={value}
          aria-describedby={hintId}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '' || raw === '-') { onChange(''); return; }
            const num = Number(raw);
            if (!isNaN(num)) onChange(num);
          }}
          onBlur={() => {
            const num = Number(value);
            if (isNaN(num) || value === '') {
              onChange(allowEmpty ? '' : (min ?? 0));
              return;
            }
            onChange(Math.max(min ?? 0, max != null ? Math.min(max, num) : num));
          }}
          style={prefix ? { paddingLeft: 32 } : undefined}
        />
        {suffix && <span className="bp-input-suffix" aria-hidden="true">{suffix}</span>}
      </div>
      {hint && <span className="bp-field-hint" id={hintId}>{hint}</span>}
      {showMonthlyPreview && prefix === '₹' && value > 0 && (
        <span className="bp-field-preview">{formatINR(value)}/month · {formatINR(value * 12)}/year</span>
      )}
    </div>
  );
}

// Add/remove chrome for the two repeatable lists (portfolio entries, goals).
// Items flagged `locked: true` (the retirement goal) render without a remove button.
export function RepeatableList({ items, onAdd, onRemove, addLabel = 'Add another', renderItem, emptyHint, getKey = (item) => item.id }) {
  return (
    <div className="bp-repeatable">
      {items.length === 0 && emptyHint && <p className="bp-repeatable-empty">{emptyHint}</p>}
      {items.map((item, index) => (
        <div className="bp-repeatable-row" key={getKey(item)}>
          <div className="bp-repeatable-row-body">{renderItem(item, index)}</div>
          {!item.locked && (
            <button type="button" className="bp-repeatable-remove" onClick={() => onRemove(item.id)} aria-label="Remove entry">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-secondary bp-repeatable-add" onClick={onAdd}>
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
