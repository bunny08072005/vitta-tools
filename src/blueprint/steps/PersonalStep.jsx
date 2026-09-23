import { WizardField } from '../components/WizardControls';
import { CITY_TIER_OPTIONS } from '../blueprintData';

export default function PersonalStep({ profile, update }) {
  return (
    <div className="bp-fields">
      <WizardField
        label="Your Name" type="text" required
        value={profile.name} onChange={(v) => update('name', v)}
        placeholder="e.g. Rohan Sharma"
        hint="Appears on your plan and PDF report"
      />
      <WizardField label="Your Age" value={profile.age} onChange={(v) => update('age', v)} min={18} max={80} hint="Used to shape goal timelines and asset allocation" />
      <WizardField
        label="Gender" value={profile.gender} onChange={(v) => update('gender', v)}
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]}
      />
      <WizardField
        label="Marital Status" value={profile.maritalStatus} onChange={(v) => update('maritalStatus', v)}
        options={[{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }]}
      />
      <WizardField label="Number of Dependents" value={profile.dependents} onChange={(v) => update('dependents', v)} min={0} max={10} hint="People financially dependent on you (children, parents, spouse)" />
      <WizardField label="City" value={profile.cityTier} onChange={(v) => update('cityTier', v)} options={CITY_TIER_OPTIONS} hint="Used for cost-of-living & insurance cover adjustments" />
    </div>
  );
}
