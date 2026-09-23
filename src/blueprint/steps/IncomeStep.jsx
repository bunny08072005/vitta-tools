import { WizardField } from '../components/WizardControls';

const formatINR = (v) => `₹${Number(v).toLocaleString('en-IN')}`;

export default function IncomeStep({ profile, update }) {
  const total = (Number(profile.monthlyIncome) || 0) + (Number(profile.otherIncome) || 0);

  return (
    <div className="bp-fields">
      <WizardField label="Monthly Take-Home Salary" value={profile.monthlyIncome} onChange={(v) => update('monthlyIncome', v)} prefix="₹" min={0} hint="After-tax salary credited to your bank account" />
      <WizardField label="Other Monthly Income" value={profile.otherIncome} onChange={(v) => update('otherIncome', v)} prefix="₹" min={0} hint="Freelance, rental, side business, dividends, etc." />
      {total > 0 && (
        <div className="bp-live-summary">Total monthly income: {formatINR(total)} · Annual: {formatINR(total * 12)}</div>
      )}
    </div>
  );
}
