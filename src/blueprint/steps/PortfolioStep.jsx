import { WizardField, RepeatableList } from '../components/WizardControls';
import { blueprintActions } from '../blueprintReducer';
import { PORTFOLIO_TYPES } from '../blueprintData';

const formatINR = (v) => `₹${Number(v).toLocaleString('en-IN')}`;
const typeOptions = PORTFOLIO_TYPES.map((t) => ({ value: t.id, label: t.label }));

export default function PortfolioStep({ profile, dispatch }) {
  const total = profile.portfolio.reduce((s, p) => s + (Number(p.currentValue) || 0), 0);

  return (
    <div className="bp-fields">
      <p className="bp-step-intro">
        Add each investment you currently hold — mutual funds, stocks, FDs, PPF, gold, property,
        anything. Skip this step entirely if you're starting fresh.
      </p>

      <RepeatableList
        items={profile.portfolio}
        addLabel="Add an investment"
        emptyHint="No investments added yet."
        onAdd={() => dispatch(blueprintActions.addPortfolioEntry())}
        onRemove={(id) => dispatch(blueprintActions.removePortfolioEntry(id))}
        renderItem={(entry) => (
          <div className="bp-repeatable-grid">
            <WizardField
              label="Type" value={entry.type} options={typeOptions}
              onChange={(v) => dispatch(blueprintActions.updatePortfolioEntry(entry.id, 'type', v))}
            />
            <WizardField
              label="Current Value" value={entry.currentValue} prefix="₹" min={0}
              onChange={(v) => dispatch(blueprintActions.updatePortfolioEntry(entry.id, 'currentValue', v))}
            />
            <WizardField
              label="Invested Amount (optional)" value={entry.investedAmount} prefix="₹" min={0} allowEmpty
              onChange={(v) => dispatch(blueprintActions.updatePortfolioEntry(entry.id, 'investedAmount', v))}
              hint="Lets us estimate gains & tax on this holding"
            />
            <WizardField
              label="Years Held (optional)" value={entry.yearsHeld} min={0} max={50} allowEmpty
              onChange={(v) => dispatch(blueprintActions.updatePortfolioEntry(entry.id, 'yearsHeld', v))}
              hint="Assumed long-term if left blank"
            />
          </div>
        )}
      />

      {total > 0 && <div className="bp-live-summary">Total current portfolio value: {formatINR(total)}</div>}
    </div>
  );
}
