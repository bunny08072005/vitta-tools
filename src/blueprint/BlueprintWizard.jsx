import { useReducer, useState, useEffect } from 'react';
import { track } from '@vercel/analytics/react';
import { Sparkles, User, Wallet, CreditCard, PiggyBank, Shield, Target, ArrowRight, ArrowLeft, History } from 'lucide-react';
import { blueprintReducer, blueprintActions } from './blueprintReducer';
import { defaultBlueprintProfile } from './blueprintData';
import { BlueprintEngine } from './blueprintEngine';
import { loadDraft, saveDraft, clearDraft } from './blueprintStorage';
import PersonalStep from './steps/PersonalStep';
import IncomeStep from './steps/IncomeStep';
import ExpensesStep from './steps/ExpensesStep';
import PortfolioStep from './steps/PortfolioStep';
import InsuranceStep from './steps/InsuranceStep';
import GoalsStep from './steps/GoalsStep';
import RiskStep from './steps/RiskStep';
import BlueprintResults from './results/BlueprintResults';
import './BlueprintWizard.css';

const STEPS = [
  { id: 'personal', label: 'About You', icon: User, subtitle: 'A few details to personalize your plan' },
  { id: 'income', label: 'Income', icon: Wallet, subtitle: 'Your earning details' },
  { id: 'expenses', label: 'Expenses', icon: CreditCard, subtitle: 'Monthly outflows & emergency fund' },
  { id: 'portfolio', label: 'Investments', icon: PiggyBank, subtitle: "What you already hold — add as many as you like" },
  { id: 'insurance', label: 'Insurance', icon: Shield, subtitle: 'Your existing term & health cover' },
  { id: 'goals', label: 'Goals', icon: Target, subtitle: "Retirement, and anything else you're saving for" },
  { id: 'risk', label: 'Risk Profile', icon: Sparkles, subtitle: 'Quick 5-question quiz' },
];

// Safe to build a plan straight from a restored draft that already has a risk
// profile — generateFullPlan() is pure/synchronous, but a corrupted or
// schema-mismatched old draft shouldn't be able to crash the page on load.
function tryGeneratePlan(profile) {
  try {
    return new BlueprintEngine(profile).generateFullPlan();
  } catch {
    return null;
  }
}

export default function BlueprintWizard() {
  const [initialDraft] = useState(() => loadDraft());
  // Computed once, up front, so the two states below don't each redo the work.
  const [initialPlan] = useState(() => (initialDraft?.profile?.riskProfile ? tryGeneratePlan(initialDraft.profile) : null));

  const [profile, dispatch] = useReducer(blueprintReducer, undefined, () => ({
    ...defaultBlueprintProfile,
    ...(initialDraft?.profile || {}),
  }));
  const [currentStep, setCurrentStep] = useState(() => {
    const step = initialDraft?.currentStep;
    return typeof step === 'number' && step >= 0 && step < STEPS.length ? step : 0;
  });
  const [plan, setPlan] = useState(initialPlan);
  const [showResults, setShowResults] = useState(!!initialPlan);
  const [draftDismissed, setDraftDismissed] = useState(false);

  // Persist on every change — small JSON blob, stays entirely on-device.
  // Skip saving the untouched default state: without this guard, resetting
  // (clearDraft()) is immediately followed by this same effect re-running on
  // the now-default profile/step and writing a fresh "draft" right back —
  // which loadDraft() can't tell apart from real progress, since it's still
  // a non-null profile object. The result: the "restored your progress"
  // banner would reappear on the very next visit after "Start fresh."
  useEffect(() => {
    const hasProgress = currentStep > 0 || profile.name.trim().length > 0;
    if (hasProgress) saveDraft({ profile, currentStep });
  }, [profile, currentStep]);

  const update = (key, value) => dispatch(blueprintActions.updateField(key, value));
  const step = STEPS[currentStep];

  const canProceed = () => (step.id === 'personal' ? profile.name.trim().length > 0 : true);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) setCurrentStep((s) => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleRiskComplete = (riskProfile) => {
    const finalProfile = { ...profile, riskProfile };
    dispatch(blueprintActions.setRiskProfile(riskProfile));
    const generated = new BlueprintEngine(finalProfile).generateFullPlan();
    setPlan(generated);
    setShowResults(true);
    track('blueprint_plan_generated', { goalCount: generated.goalsAnalysis.goals.length });
  };

  const handleReset = () => {
    dispatch(blueprintActions.reset());
    setPlan(null);
    setShowResults(false);
    setCurrentStep(0);
    clearDraft();
  };

  if (showResults && plan) {
    return <BlueprintResults plan={plan} onReset={handleReset} />;
  }

  const renderStep = () => {
    switch (step.id) {
      case 'personal': return <PersonalStep profile={profile} update={update} />;
      case 'income': return <IncomeStep profile={profile} update={update} />;
      case 'expenses': return <ExpensesStep profile={profile} update={update} />;
      case 'portfolio': return <PortfolioStep profile={profile} dispatch={dispatch} />;
      case 'insurance': return <InsuranceStep profile={profile} update={update} />;
      case 'goals': return <GoalsStep profile={profile} dispatch={dispatch} />;
      case 'risk': return <RiskStep onComplete={handleRiskComplete} />;
      default: return null;
    }
  };

  const showDraftBanner = !!initialDraft && !draftDismissed;

  return (
    <div className="bp-page">
      <div className="container">
        <div className="bp-header animate-fade-in">
          <div className="bp-badge"><Sparkles size={14} /> Financial Planning</div>
          <h1>Vitta Financial Blueprint</h1>
          <p>A complete, goal-based financial plan — free, in your browser, no sign-up</p>
        </div>

        {showDraftBanner && (
          <div className="bp-draft-banner animate-fade-in" role="status">
            <History size={16} />
            <span>We restored your progress from last time.</span>
            <button
              type="button"
              className="bp-draft-banner-action"
              onClick={() => { handleReset(); setDraftDismissed(true); }}
            >
              Start fresh instead
            </button>
          </div>
        )}

        <div className="bp-progress">
          {STEPS.map((s, index) => (
            <button
              type="button"
              key={s.id}
              className={`bp-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
              disabled={index >= currentStep}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <span className="bp-step-dot"><s.icon size={14} /></span>
              <span className="bp-step-label">{s.label}</span>
            </button>
          ))}
          <div className="bp-progress-line">
            <div className="bp-progress-fill" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="bp-card glass-card animate-scale-in" key={currentStep}>
          <div className="bp-card-header">
            <div>
              <h3 aria-live="polite">{step.label}</h3>
              <p className="bp-subtitle">{step.subtitle}</p>
            </div>
            <span className="bp-step-counter">{currentStep + 1}/{STEPS.length}</span>
          </div>

          {renderStep()}

          {step.id !== 'risk' && (
            <div className="bp-nav">
              <button className="btn btn-ghost" onClick={handleBack} disabled={currentStep === 0} id="bp-back">
                <ArrowLeft size={15} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed()} id="bp-next">
                {currentStep === STEPS.length - 2 ? 'Take Risk Quiz' : 'Continue'} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
