import { Target } from 'lucide-react';
import { WizardField, RepeatableList } from '../components/WizardControls';
import { blueprintActions } from '../blueprintReducer';
import { GOAL_TYPES, PRIORITY_OPTIONS } from '../blueprintData';

const goalTypeOptions = GOAL_TYPES.filter((g) => g.id !== 'retirement').map((g) => ({ value: g.id, label: g.label }));

export default function GoalsStep({ profile, dispatch }) {
  const retirementGoal = profile.goals.find((g) => g.type === 'retirement');
  const otherGoals = profile.goals.filter((g) => g.type !== 'retirement');

  return (
    <div className="bp-fields">
      <div className="bp-goal-locked">
        <div className="bp-goal-locked-title">
          <Target size={16} /> Retirement <span className="bp-goal-locked-tag">Always included</span>
        </div>
        <div className="bp-repeatable-grid">
          <WizardField
            label="Target Retirement Age" value={retirementGoal.targetAge} min={profile.age + 1} max={80}
            onChange={(v) => dispatch(blueprintActions.updateGoal(retirementGoal.id, 'targetAge', v))}
          />
          <WizardField
            label="Already Saved for Retirement (optional)" value={retirementGoal.currentProvision} prefix="₹" min={0}
            onChange={(v) => dispatch(blueprintActions.updateGoal(retirementGoal.id, 'currentProvision', v))}
            hint="e.g. EPF/NPS balance earmarked specifically for retirement"
          />
        </div>
      </div>

      <p className="bp-step-intro">
        Add any other goals — a home, a car, a wedding, your children's education, a dream trip,
        or anything else you're saving toward.
      </p>

      <RepeatableList
        items={otherGoals}
        addLabel="Add a goal"
        emptyHint="No other goals added yet — retirement above is always included."
        onAdd={() => dispatch(blueprintActions.addGoal())}
        onRemove={(id) => dispatch(blueprintActions.removeGoal(id))}
        renderItem={(goal) => (
          <div className="bp-repeatable-grid">
            <WizardField
              label="Goal Type" value={goal.type} options={goalTypeOptions}
              onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'type', v))}
            />
            {goal.type === 'custom' && (
              <WizardField
                label="Goal Name" type="text" value={goal.name} placeholder="e.g. Start a business"
                onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'name', v))}
              />
            )}
            <WizardField
              label="Target Amount (Today's Value)" value={goal.targetAmountToday} prefix="₹" min={0}
              onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'targetAmountToday', v))}
            />
            <WizardField
              label="Your Age at Target" value={goal.targetAge} min={profile.age + 1} max={90}
              onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'targetAge', v))}
              hint="Your age when you'll need this amount"
            />
            <WizardField
              label="Priority" value={goal.priority} options={PRIORITY_OPTIONS}
              onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'priority', v))}
            />
            <WizardField
              label="Already Saved (optional)" value={goal.currentProvision} prefix="₹" min={0}
              onChange={(v) => dispatch(blueprintActions.updateGoal(goal.id, 'currentProvision', v))}
            />
          </div>
        )}
      />
    </div>
  );
}
