import { WizardField } from '../components/WizardControls';

const formatINR = (v) => `₹${Number(v).toLocaleString('en-IN')}`;

export default function ExpensesStep({ profile, update }) {
  const totalIncome = (Number(profile.monthlyIncome) || 0) + (Number(profile.otherIncome) || 0);
  const totalOutflow = (Number(profile.monthlyExpenses) || 0) + (Number(profile.emiPayments) || 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalOutflow) / totalIncome) * 100) : 0;

  return (
    <div className="bp-fields">
      <WizardField label="Monthly Living Expenses" value={profile.monthlyExpenses} onChange={(v) => update('monthlyExpenses', v)} prefix="₹" min={0} hint="Rent, groceries, utilities, transport, subscriptions, food" />
      <WizardField label="Total Monthly EMIs" value={profile.emiPayments} onChange={(v) => update('emiPayments', v)} prefix="₹" min={0} hint="Home loan + car loan + personal loan + credit card EMIs" />
      <WizardField label="Emergency Fund / Liquid Savings" value={profile.emergencyFund} onChange={(v) => update('emergencyFund', v)} prefix="₹" min={0} hint="Savings account + liquid fund balance you can access immediately" />
      <div className="bp-live-summary">Total outflow: {formatINR(totalOutflow)}/month · Savings rate: {savingsRate}%</div>
    </div>
  );
}
