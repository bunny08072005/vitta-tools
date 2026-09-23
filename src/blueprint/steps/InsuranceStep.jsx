import { WizardField } from '../components/WizardControls';

export default function InsuranceStep({ profile, update }) {
  return (
    <div className="bp-fields">
      <p className="bp-step-intro">Term Life Insurance</p>
      <WizardField label="Existing Term Cover (Sum Assured)" value={profile.termCover} onChange={(v) => update('termCover', v)} prefix="₹" min={0} hint="Total sum assured of all your term/life insurance policies" />
      <WizardField label="Annual Term Premium" value={profile.termPremium} onChange={(v) => update('termPremium', v)} prefix="₹" min={0} />

      <p className="bp-step-intro" style={{ marginTop: 6 }}>Health Insurance</p>
      <WizardField label="Existing Health Cover" value={profile.healthCover} onChange={(v) => update('healthCover', v)} prefix="₹" min={0} hint="Total sum insured across your health policies" />
      <WizardField label="Family Floater Plan?" type="checkbox" value={profile.healthFamilyFloater} onChange={(v) => update('healthFamilyFloater', v)} />
      <WizardField label="Annual Health Premium" value={profile.healthPremium} onChange={(v) => update('healthPremium', v)} prefix="₹" min={0} />
    </div>
  );
}
