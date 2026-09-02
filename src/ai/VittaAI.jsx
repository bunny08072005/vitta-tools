import { useState } from 'react';
import { Sparkles, User, Wallet, CreditCard, PiggyBank, Target, Shield, ArrowRight, ArrowLeft, RotateCcw, Info } from 'lucide-react';
import { AdvisoryEngine } from './AdvisoryEngine';
import HealthScore from './HealthScore';
import InvestmentPlan from './InvestmentPlan';
import WealthProjection from './WealthProjection';
import ActionItems from './ActionItems';
import RiskQuiz from './RiskQuiz';
import './VittaAI.css';

const defaultProfile = {
  age: 25,
  gender: 'male',
  cityTier: 'tier1',
  maritalStatus: 'single',
  monthlyIncome: 50000,
  otherIncome: 0,
  monthlyExpenses: 25000,
  emiPayments: 0,
  emergencyFund: 50000,
  existingInvestments: 0,
  existingLifeCover: 0,
  dependents: 0,
  retirementAge: 60,
  annualIncome: 600000,
  riskProfile: 'moderate',
};

const steps = [
  { id: 'profile', label: 'Profile', icon: User, subtitle: 'Tell us about yourself' },
  { id: 'income', label: 'Income', icon: Wallet, subtitle: 'Your earning details' },
  { id: 'expenses', label: 'Expenses', icon: CreditCard, subtitle: 'Monthly outflows' },
  { id: 'assets', label: 'Assets', icon: PiggyBank, subtitle: 'Current savings & investments' },
  { id: 'goals', label: 'Goals', icon: Target, subtitle: 'Plan your retirement' },
  { id: 'risk', label: 'Risk Profile', icon: Shield, subtitle: 'Quick 5-question quiz' },
];

const formatINR = (val) => `₹${val.toLocaleString('en-IN')}`;

export default function VittaAI() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);
  const [plan, setPlan] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const updateProfile = (key, value) => {
    setProfile(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'monthlyIncome') updated.annualIncome = value * 12;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleRiskComplete = (riskProfile) => {
    const updatedProfile = { ...profile, riskProfile, annualIncome: profile.monthlyIncome * 12 };
    setProfile(updatedProfile);
    const engine = new AdvisoryEngine(updatedProfile);
    setPlan(engine.generateFullPlan());
    setShowResults(true);
  };

  const handleReset = () => {
    setProfile(defaultProfile);
    setPlan(null);
    setShowResults(false);
    setCurrentStep(0);
  };

  // Computed summaries shown at bottom of each step
  const getStepSummary = () => {
    switch (steps[currentStep].id) {
      case 'income': {
        const total = profile.monthlyIncome + profile.otherIncome;
        return total > 0 ? `Total monthly income: ${formatINR(total)} · Annual: ${formatINR(total * 12)}` : null;
      }
      case 'expenses': {
        const total = profile.monthlyExpenses + profile.emiPayments;
        const savingsRate = profile.monthlyIncome > 0 ? Math.round(((profile.monthlyIncome - total) / profile.monthlyIncome) * 100) : 0;
        return `Total outflow: ${formatINR(total)}/month · Savings rate: ${savingsRate}%`;
      }
      case 'assets': {
        const total = profile.emergencyFund + profile.existingInvestments;
        return `Total saved/invested: ${formatINR(total)}`;
      }
      default: return null;
    }
  };

  const renderField = (label, value, key, opts = {}) => {
    const { type = 'number', hint, prefix, suffix, min, max, options: selectOpts } = opts;

    if (selectOpts) {
      return (
        <div className="wizard-field" key={key}>
          <label>{label}</label>
          <select className="calc-select" value={value} onChange={e => updateProfile(key, e.target.value)}>
            {selectOpts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {hint && <span className="field-hint">{hint}</span>}
        </div>
      );
    }

    return (
      <div className="wizard-field" key={key}>
        <label>{label}</label>
        <div className="wizard-input-wrap">
          {prefix && <span className="wizard-input-prefix">{prefix}</span>}
          <input
            type={type}
            className={`input-field ${prefix ? 'mono' : ''}`}
            value={value}
            onChange={e => {
              const raw = e.target.value;
              if (raw === '' || raw === '-') { updateProfile(key, ''); return; }
              const num = Number(raw);
              if (!isNaN(num)) updateProfile(key, num);
            }}
            onBlur={() => {
              const num = Number(value);
              if (isNaN(num) || value === '') { updateProfile(key, min ?? 0); return; }
              updateProfile(key, Math.max(min ?? 0, max != null ? Math.min(max, num) : num));
            }}
            style={prefix ? { paddingLeft: 32 } : undefined}
          />
          {suffix && <span className="wizard-input-suffix">{suffix}</span>}
        </div>
        {hint && <span className="field-hint">{hint}</span>}
        {prefix === '₹' && value > 0 && (
          <span className="field-preview">{formatINR(value)}/month · {formatINR(value * 12)}/year</span>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'profile':
        return (
          <div className="wizard-fields">
            {renderField('Your Age', profile.age, 'age', { min: 18, max: 80, hint: 'We use this to recommend the right asset allocation' })}
            {renderField('Gender', profile.gender, 'gender', {
              options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ],
            })}
            {renderField('Marital Status', profile.maritalStatus, 'maritalStatus', {
              options: [
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
              ],
            })}
            {renderField('City', profile.cityTier, 'cityTier', {
              options: [
                { value: 'tier1', label: 'Metro — Delhi, Mumbai, Bangalore, Hyderabad' },
                { value: 'tier2', label: 'Tier 2 — Jaipur, Lucknow, Kochi, Pune' },
                { value: 'tier3', label: 'Tier 3 / Rural' },
              ],
              hint: 'Used for cost-of-living adjustments',
            })}
            {renderField('Number of Dependents', profile.dependents, 'dependents', { min: 0, max: 10, hint: 'People financially dependent on you (children, parents, spouse)' })}
          </div>
        );

      case 'income':
        return (
          <div className="wizard-fields">
            {renderField('Monthly Take-Home Salary', profile.monthlyIncome, 'monthlyIncome', { prefix: '₹', min: 0, hint: 'After-tax salary credited to your bank account' })}
            {renderField('Other Monthly Income', profile.otherIncome, 'otherIncome', { prefix: '₹', min: 0, hint: 'Freelance, rental, side business, dividends, etc.' })}
          </div>
        );

      case 'expenses':
        return (
          <div className="wizard-fields">
            {renderField('Monthly Living Expenses', profile.monthlyExpenses, 'monthlyExpenses', { prefix: '₹', min: 0, hint: 'Rent, groceries, utilities, transport, subscriptions, food, shopping' })}
            {renderField('Total Monthly EMIs', profile.emiPayments, 'emiPayments', { prefix: '₹', min: 0, hint: 'Home loan + car loan + personal loan + credit card EMIs' })}
          </div>
        );

      case 'assets':
        return (
          <div className="wizard-fields">
            {renderField('Emergency Fund / Liquid Savings', profile.emergencyFund, 'emergencyFund', { prefix: '₹', min: 0, hint: 'Savings account + liquid fund balance you can access immediately' })}
            {renderField('Total Investments Value', profile.existingInvestments, 'existingInvestments', { prefix: '₹', min: 0, hint: 'Mutual funds, stocks, FDs, PPF, NPS, gold, real estate — combined current value' })}
            {renderField('Life Insurance Cover', profile.existingLifeCover, 'existingLifeCover', { prefix: '₹', min: 0, hint: 'Total sum assured of all your term/life insurance policies' })}
          </div>
        );

      case 'goals':
        return (
          <div className="wizard-fields">
            {renderField('Target Retirement Age', profile.retirementAge, 'retirementAge', { min: profile.age + 1, max: 80, hint: `${profile.retirementAge - profile.age} years from now` })}
            <div className="wizard-note">
              <Info size={16} style={{ color: 'var(--accent-glow)', minWidth: 16 }} />
              <div>
                <strong>What we'll calculate:</strong>
                <ul style={{ margin: '6px 0 0 16px', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  <li>Retirement corpus needed (adjusted for {profile.retirementAge - profile.age} years of inflation)</li>
                  <li>Monthly SIP amount to reach your goal</li>
                  <li>Optimal asset allocation for your age & risk</li>
                  <li>Which instruments to invest in and how much</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'risk':
        return <RiskQuiz onComplete={handleRiskComplete} />;

      default:
        return null;
    }
  };

  if (showResults && plan) {
    return (
      <div className="ai-page">
        <div className="container">
          <div className="ai-results-header animate-fade-in">
            <Sparkles size={24} className="ai-sparkle" />
            <h1>Your Financial Blueprint</h1>
            <p className="ai-results-subtitle">
              Personalized plan for <strong>{profile.age}-year-old</strong> earning <strong>{formatINR(profile.monthlyIncome)}/month</strong>
            </p>
            <button className="btn btn-secondary" onClick={handleReset} id="ai-reset-btn">
              <RotateCcw size={14} /> Recalculate
            </button>
          </div>
          <div className="ai-results-grid">
            <HealthScore score={plan.healthScore} />
            <InvestmentPlan plan={plan} />
            <WealthProjection projection={plan.projection} retirement={plan.retirement} />
            <ActionItems actions={plan.actions} />
          </div>
        </div>
      </div>
    );
  }

  const stepSummary = getStepSummary();

  return (
    <div className="ai-page">
      <div className="container">
        <div className="ai-header animate-fade-in">
          <div className="ai-badge">
            <Sparkles size={14} />
            AI-Powered Advisory
          </div>
          <h1>Vitta AI Financial Advisor</h1>
          <p>Answer a few questions to get a personalized investment plan</p>
        </div>

        {/* Progress */}
        <div className="wizard-progress">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`wizard-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => index < currentStep && setCurrentStep(index)}
            >
              <div className="step-dot"><step.icon size={14} /></div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Step card */}
        <div className="wizard-card glass-card animate-scale-in" key={currentStep}>
          <div className="wizard-card-header">
            <div>
              <h3>{steps[currentStep].label}</h3>
              <p className="wizard-subtitle">{steps[currentStep].subtitle}</p>
            </div>
            <span className="step-counter">{currentStep + 1}/{steps.length}</span>
          </div>

          {renderStepContent()}

          {/* Live summary */}
          {stepSummary && (
            <div className="wizard-live-summary">
              {stepSummary}
            </div>
          )}

          {/* Navigation */}
          {steps[currentStep].id !== 'risk' && (
            <div className="wizard-nav">
              <button className="btn btn-ghost" onClick={handleBack} disabled={currentStep === 0} id="wizard-back">
                <ArrowLeft size={15} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNext} id="wizard-next">
                {currentStep === steps.length - 2 ? 'Take Risk Quiz' : 'Continue'} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
