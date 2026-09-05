import { useState } from 'react';
import {
  Shield, Heart, Sparkles, ArrowRight, RotateCcw, X,
  CheckCircle, Star, Award, Phone, Mail, MessageCircle,
  Users, Building2, IndianRupee, Calendar, UserCheck,
} from 'lucide-react';
import { InsuranceEngine } from './InsuranceEngine';
import { formatINR } from './insuranceData';
import './Insurance.css';

const defaultTermProfile = {
  age: 30, gender: 'male', monthlyIncome: 50000, annualIncome: 600000,
  dependents: 2, maritalStatus: 'married', existingLifeCover: 0, isSmoker: false,
};

const defaultHealthProfile = {
  age: 30, gender: 'male', monthlyIncome: 50000, annualIncome: 600000,
  cityTier: 'tier1', familySize: 2, existingHealthCover: 0, maritalStatus: 'married',
};

export default function InsuranceAdvisor() {
  const [insuranceType, setInsuranceType] = useState(null);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState(null);
  const [pipPlan, setPipPlan] = useState(null); // PIP modal state

  const startFlow = (type) => {
    setInsuranceType(type);
    setProfile(type === 'term' ? { ...defaultTermProfile } : { ...defaultHealthProfile });
    setResults(null);
  };

  const updateProfile = (key, value) => {
    setProfile(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'monthlyIncome') updated.annualIncome = value * 12;
      return updated;
    });
  };

  const handleAnalyze = () => {
    const engine = new InsuranceEngine(profile);
    setResults(insuranceType === 'term' ? engine.recommendTermInsurance() : engine.recommendHealthInsurance());
  };

  const handleReset = () => {
    setInsuranceType(null); setProfile(null); setResults(null); setPipPlan(null);
  };

  // === PIP Contact Modal ===
  const renderPipModal = () => {
    if (!pipPlan) return null;
    return (
      <div className="pip-overlay" onClick={() => setPipPlan(null)}>
        <div className="pip-modal" onClick={e => e.stopPropagation()}>
          <div className="pip-header">
            <div>
              <h3>Get This Plan</h3>
              <p>Contact our experts to buy or learn more</p>
            </div>
            <button className="pip-close" onClick={() => setPipPlan(null)} id="pip-close">
              <X size={18} />
            </button>
          </div>

          <div className="pip-plan-info">
            <div className="ins-plan-logo">
              {typeof pipPlan.logo === 'string' && pipPlan.logo ? 
                <img src={pipPlan.logo} alt={pipPlan.insurer} className="ins-logo-img" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /> : null}
              <span className="ins-logo-fallback" style={typeof pipPlan.logo === 'string' && pipPlan.logo ? {display:'none'} : {display:'flex'}}>{pipPlan.insurer?.[0] || 'V'}</span>
            </div>
            <div>
              <div className="pip-plan-name">{pipPlan.insurer} — {pipPlan.name}</div>
              <div className="pip-plan-premium">
                {formatINR(pipPlan.annualPremium)}/year · {formatINR(pipPlan.monthlyPremium)}/month
              </div>
            </div>
          </div>

          <div className="pip-body">
            <a href="tel:+919000872375" className="pip-contact-row" id="pip-call">
              <div className="pip-contact-icon" style={{ background: 'linear-gradient(135deg, #1B6B3A, #145A2E)' }}>
                <Phone size={20} />
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+91 9000872375</p>
              </div>
            </a>

            <a href="https://wa.me/919000872375?text=Hi%2C%20I%27m%20interested%20in%20the%20insurance%20plan%20recommended%20by%20Vitta" target="_blank" rel="noopener noreferrer" className="pip-contact-row" id="pip-whatsapp">
              <div className="pip-contact-icon" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                <MessageCircle size={20} />
              </div>
              <div>
                <h4>WhatsApp</h4>
                <p>Quick chat with our team</p>
              </div>
            </a>

            <a href="mailto:pvenkatahemanth2005@gmail.com?subject=Insurance%20Inquiry%20-%20Vitta&body=Hi%2C%20I%27m%20interested%20in%20an%20insurance%20plan%20recommended%20by%20Vitta%20AI." className="pip-contact-row" id="pip-email">
              <div className="pip-contact-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>pvenkatahemanth2005@gmail.com</p>
              </div>
            </a>
          </div>

          <p className="pip-disclaimer">
            Vitta is an advisory platform. Policies are issued by respective insurance companies.
            Our experts will help you through the entire buying process — free of charge.
          </p>
        </div>
      </div>
    );
  };

  // === Type Selection ===
  if (!insuranceType) {
    return (
      <div className="insurance-page">
        <div className="container">
          <div className="ins-header animate-fade-in">
            <div className="ins-badge"><Sparkles size={16} /> AI-Powered Insurance Advisor</div>
            <h1>Find Your Ideal Insurance</h1>
            <p>Get personalized insurance recommendations based on your age, income, and family needs — powered by AI analysis.</p>
          </div>
          <div className="ins-type-selector animate-fade-in-up">
            <div className="ins-type-card glass-card" onClick={() => startFlow('term')} id="ins-type-term">
              <div className="ins-type-icon" style={{ background: 'linear-gradient(135deg, #1B6B3A, #145A2E)' }}><Shield size={32} color="white" /></div>
              <h3>Term Insurance</h3>
              <p>Protect your family's financial future with pure life coverage at affordable premiums</p>
            </div>
            <div className="ins-type-card glass-card" onClick={() => startFlow('health')} id="ins-type-health">
              <div className="ins-type-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><Heart size={32} color="white" /></div>
              <h3>Health Insurance</h3>
              <p>Cover medical expenses for you and your family with cashless hospitalization</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Input Form ===
  if (!results) {
    return (
      <div className="insurance-page">
        <div className="container">
          <div className="ins-header animate-fade-in">
            <div className="ins-badge">{insuranceType === 'term' ? <Shield size={16} /> : <Heart size={16} />}{insuranceType === 'term' ? 'Term Insurance' : 'Health Insurance'} Advisor</div>
            <h1>{insuranceType === 'term' ? 'Find Your Ideal Term Plan' : 'Find Your Ideal Health Plan'}</h1>
            <p>Tell us about yourself and we'll recommend the best plans for you</p>
          </div>
          <div className="ins-form glass-card animate-scale-in">
            <div className="ins-form-header">
              <h3>Your Details</h3>
              <button className="btn btn-ghost" onClick={handleReset} id="ins-back">← Change Type</button>
            </div>
            <div className="ins-form-fields">
              <div className="ins-form-row">
                <div className="ins-field">
                  <label><Calendar size={16} /> Your Age</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="input-field" value={profile.age} onChange={e => { const raw = e.target.value; if (raw === '') { updateProfile('age', ''); return; } const num = Number(raw); if (!isNaN(num)) updateProfile('age', num); }} onBlur={() => { const num = Number(profile.age); if (isNaN(num) || profile.age === '') updateProfile('age', 30); else updateProfile('age', Math.max(18, Math.min(65, num))); }} id="ins-age" />
                  <span className="ins-field-hint">Between 18 – 65 years</span>
                </div>
                <div className="ins-field">
                  <label><UserCheck size={16} /> Gender</label>
                  <select className="calc-select" value={profile.gender} onChange={e => updateProfile('gender', e.target.value)} id="ins-gender">
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="ins-field">
                <label><IndianRupee size={16} /> Monthly Income (Take-home)</label>
                <div className="ins-field-wrap">
                  <span className="ins-field-prefix">₹</span>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" className="input-field has-prefix" value={profile.monthlyIncome} onChange={e => { const raw = e.target.value; if (raw === '') { updateProfile('monthlyIncome', ''); return; } const num = Number(raw); if (!isNaN(num)) updateProfile('monthlyIncome', num); }} onBlur={() => { const num = Number(profile.monthlyIncome); if (isNaN(num) || profile.monthlyIncome === '') updateProfile('monthlyIncome', 0); else updateProfile('monthlyIncome', Math.max(0, num)); }} id="ins-income" />
                </div>
                {profile.monthlyIncome > 0 && <span className="ins-field-hint" style={{ color: 'var(--accent-glow)' }}>Annual: {formatINR(profile.monthlyIncome * 12)}</span>}
              </div>
              {insuranceType === 'term' && (
                <>
                  <div className="ins-form-row">
                    <div className="ins-field">
                      <label><Users size={16} /> Number of Dependents</label>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" className="input-field" value={profile.dependents} onChange={e => { const raw = e.target.value; if (raw === '') { updateProfile('dependents', ''); return; } const num = Number(raw); if (!isNaN(num)) updateProfile('dependents', num); }} onBlur={() => { const num = Number(profile.dependents); if (isNaN(num) || profile.dependents === '') updateProfile('dependents', 0); else updateProfile('dependents', Math.max(0, Math.min(10, num))); }} id="ins-dependents" />
                      <span className="ins-field-hint">Spouse, children, parents</span>
                    </div>
                    <div className="ins-field">
                      <label>Marital Status</label>
                      <select className="calc-select" value={profile.maritalStatus} onChange={e => updateProfile('maritalStatus', e.target.value)} id="ins-marital">
                        <option value="single">Single</option><option value="married">Married</option>
                      </select>
                    </div>
                  </div>
                  <div className="ins-field">
                    <label><Shield size={16} /> Existing Life Insurance Cover</label>
                    <div className="ins-field-wrap">
                      <span className="ins-field-prefix">₹</span>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" className="input-field has-prefix" value={profile.existingLifeCover} onChange={e => { const raw = e.target.value; if (raw === '') { updateProfile('existingLifeCover', ''); return; } const num = Number(raw); if (!isNaN(num)) updateProfile('existingLifeCover', num); }} onBlur={() => { const num = Number(profile.existingLifeCover); if (isNaN(num) || profile.existingLifeCover === '') updateProfile('existingLifeCover', 0); else updateProfile('existingLifeCover', Math.max(0, num)); }} id="ins-existing-cover" />
                    </div>
                    <span className="ins-field-hint">Total sum assured of existing term/life policies (0 if none)</span>
                  </div>
                  <div className="ins-field">
                    <label>Smoker / Tobacco User?</label>
                    <select className="calc-select" value={profile.isSmoker ? 'yes' : 'no'} onChange={e => updateProfile('isSmoker', e.target.value === 'yes')} id="ins-smoker">
                      <option value="no">No</option><option value="yes">Yes</option>
                    </select>
                  </div>
                </>
              )}
              {insuranceType === 'health' && (
                <>
                  <div className="ins-form-row">
                    <div className="ins-field">
                      <label><Users size={16} /> Family Size (to cover)</label>
                      <select className="calc-select" value={profile.familySize} onChange={e => updateProfile('familySize', Number(e.target.value))} id="ins-family-size">
                        <option value={1}>Just Me</option><option value={2}>Me + Spouse</option><option value={3}>Me + Spouse + 1 Child</option><option value={4}>Me + Spouse + 2 Children</option><option value={5}>Me + Spouse + 2 Children + Parents</option>
                      </select>
                    </div>
                    <div className="ins-field">
                      <label><Building2 size={16} /> City Tier</label>
                      <select className="calc-select" value={profile.cityTier} onChange={e => updateProfile('cityTier', e.target.value)} id="ins-city">
                        <option value="tier1">Metro — Delhi, Mumbai, Bangalore</option><option value="tier2">Tier 2 — Jaipur, Pune, Kochi</option><option value="tier3">Tier 3 / Rural</option>
                      </select>
                      <span className="ins-field-hint">Medical costs vary significantly by city</span>
                    </div>
                  </div>
                  <div className="ins-field">
                    <label><Heart size={16} /> Existing Health Insurance Cover</label>
                    <div className="ins-field-wrap">
                      <span className="ins-field-prefix">₹</span>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" className="input-field has-prefix" value={profile.existingHealthCover} onChange={e => { const raw = e.target.value; if (raw === '') { updateProfile('existingHealthCover', ''); return; } const num = Number(raw); if (!isNaN(num)) updateProfile('existingHealthCover', num); }} onBlur={() => { const num = Number(profile.existingHealthCover); if (isNaN(num) || profile.existingHealthCover === '') updateProfile('existingHealthCover', 0); else updateProfile('existingHealthCover', Math.max(0, num)); }} id="ins-existing-health" />
                    </div>
                    <span className="ins-field-hint">Corporate group cover + personal cover (0 if none)</span>
                  </div>
                </>
              )}
            </div>
            <div className="ins-form-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAnalyze} id="ins-analyze">
                <Sparkles size={18} /> Get AI Recommendations <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Results ===
  const isTerm = insuranceType === 'term';

  return (
    <div className="insurance-page">
      <div className="container">
        <div className="ins-results animate-fade-in">
          <div className="ins-results-header">
            <Sparkles size={24} style={{ color: 'var(--accent-glow)', marginBottom: 10 }} />
            <h1>{isTerm ? 'Your Term Insurance Recommendations' : 'Your Health Insurance Recommendations'}</h1>
            <p className="ins-results-subtitle">
              Personalized for <strong>{profile.age}-year-old {profile.gender}</strong> earning <strong>{formatINR(profile.monthlyIncome)}/month</strong>
              {isTerm && profile.dependents > 0 && <> with <strong>{profile.dependents} dependent{profile.dependents > 1 ? 's' : ''}</strong></>}
              {!isTerm && <> covering <strong>{profile.familySize} member{profile.familySize > 1 ? 's' : ''}</strong></>}
            </p>
            <button className="btn btn-secondary" onClick={handleReset} id="ins-reset"><RotateCcw size={15} /> Start Over</button>
          </div>

          {/* Summary */}
          <div className="ins-summary-card glass-card">
            <div className="ins-summary-grid">
              <div className="ins-summary-item">
                <div className="ins-summary-label">Recommended Cover</div>
                <div className="ins-summary-value accent">
                  {isTerm && results.isAdequatelyCovered ? 'Already Covered ✓' : formatINR(results.recommendedCover)}
                </div>
              </div>
              <div className="ins-summary-item">
                <div className="ins-summary-label">{isTerm ? 'Policy Term' : 'Family Size'}</div>
                <div className="ins-summary-value">{isTerm ? `${results.recommendedTerm} Years` : results.familySize}</div>
              </div>
              <div className="ins-summary-item">
                <div className="ins-summary-label">{isTerm ? 'Income Multiplier' : 'City Type'}</div>
                <div className="ins-summary-value" style={!isTerm ? { fontSize: '1.3rem' } : undefined}>
                  {isTerm ? `${results.incomeMultiplier}x` : results.cityTier === 'tier1' ? 'Metro' : results.cityTier === 'tier2' ? 'Tier 2' : 'Tier 3'}
                </div>
              </div>
            </div>
            <div className="ins-summary-points">
              {results.summary.map((point, i) => (
                <div key={i} className="ins-summary-point"><CheckCircle size={18} /><span>{point}</span></div>
              ))}
            </div>
          </div>

          {/* Plan Cards */}
          {results.plans.length === 0 ? (
            <div className="ins-summary-card glass-card" style={{ textAlign: 'center', padding: 32 }}>
              <p>No plans matched your profile's age range. Please contact our experts below for personalized options.</p>
            </div>
          ) : (
          <>
          <h3 className="ins-plans-title">
            <Award size={22} />
            {isTerm && results.isAdequatelyCovered
              ? `${results.plans.length} Plans You Could Still Consider`
              : `Top ${results.plans.length} Recommended Plans`}
          </h3>

          <div className="ins-plans-grid">
            {results.plans.map((plan, index) => (
              <div key={plan.id} className="ins-plan-card glass-card">
                {/* Top */}
                <div className="ins-plan-top">
                  <div className="ins-plan-brand">
                    <div className="ins-plan-logo">
                      <img src={plan.logo} alt={plan.insurer} className="ins-logo-img" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      <span className="ins-logo-fallback" style={{display:'none'}}>{plan.insurer?.[0]}</span>
                    </div>
                    <div>
                      <h4>{plan.name}</h4>
                      <span className="ins-plan-insurer">{plan.insurer}</span>
                    </div>
                    {index === 0 && <span className="ins-best-badge"><Star size={14} /> Best Match</span>}
                  </div>
                  <div className="ins-plan-score">
                    <div className="ins-score-circle">{plan.score}</div>
                    <span className="ins-score-label">Match Score</span>
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="ins-plan-body">
                  <div className="ins-plan-detail">
                    <span className="ins-plan-detail-label">{isTerm ? 'Sum Assured' : 'Coverage'}</span>
                    <span className="ins-plan-detail-value">{formatINR(isTerm ? plan.recommendedCover : plan.selectedCover)}</span>
                  </div>
                  <div className="ins-plan-detail">
                    <span className="ins-plan-detail-label">Annual Premium</span>
                    <span className="ins-plan-detail-value green">{formatINR(plan.annualPremium)}</span>
                    <span className="ins-plan-detail-sub">≈ {formatINR(plan.monthlyPremium)}/month</span>
                  </div>
                  <div className="ins-plan-detail">
                    <span className="ins-plan-detail-label">{isTerm ? 'Policy Term' : 'Claim Ratio'}</span>
                    <span className="ins-plan-detail-value">{isTerm ? `${plan.recommendedTerm} Yrs` : `${plan.claimRatio}%`}</span>
                    {isTerm && <span className="ins-plan-detail-sub">Till age {profile.age + plan.recommendedTerm}</span>}
                  </div>
                </div>

                {/* Extra Details */}
                <div className="ins-plan-extras">
                  {isTerm ? (
                    <>
                      <div className="ins-extra-item"><span className="ins-extra-label">Claim Ratio</span><span className="ins-extra-value">{plan.claimRatio}%</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Tax Benefit</span><span className="ins-extra-value">{plan.taxBenefit || 'Sec 80C'}</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Medical Test</span><span className="ins-extra-value">{plan.medicalRequired || 'Based on age'}</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Payout Options</span><span className="ins-extra-value">{(plan.payoutOptions || []).length} modes</span></div>
                    </>
                  ) : (
                    <>
                      <div className="ins-extra-item"><span className="ins-extra-label">Waiting Period</span><span className="ins-extra-value">{plan.waitingPeriod || '30 days'}</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Co-payment</span><span className="ins-extra-value">{plan.coPay || 'None'}</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Room Rent</span><span className="ins-extra-value">{plan.roomRent || 'No limit'}</span></div>
                      <div className="ins-extra-item"><span className="ins-extra-label">Renewability</span><span className="ins-extra-value">{plan.renewability || 'Lifelong'}</span></div>
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="ins-plan-features">
                  {plan.features.map((f, fi) => (
                    <span key={fi} className="ins-feature-tag"><CheckCircle size={14} />{f}</span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="ins-plan-highlights">
                  {plan.highlights.map((hl, hi) => (
                    <span key={hi} className="ins-highlight"><Star size={14} />{hl}</span>
                  ))}
                </div>

                {/* Footer with PIP trigger */}
                <div className="ins-plan-footer">
                  <div className="ins-claim-ratio">
                    {isTerm ? <>Claim Settlement: <span className="ins-claim-value">{plan.claimRatio}%</span></> :
                      <>Pre/Post Hosp: <span className="ins-claim-value">{plan.prePostHosp || '60/180 days'}</span></>}
                  </div>
                  <button className="btn btn-primary" onClick={() => setPipPlan(plan)} id={`ins-get-${plan.id}`}>
                    <Phone size={16} /> Get This Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
          )}

          {/* CTA */}
          <div className="ins-cta-section">
            <h2>Need Help Choosing?</h2>
            <p>Our insurance experts can help you compare plans, explain riders, and guide you through the buying process — completely free.</p>
            <div className="ins-cta-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => setPipPlan({ logo: '', insurer: 'Vitta', name: 'Expert Consultation', annualPremium: 0, monthlyPremium: 0 })} id="ins-cta-contact">
                <Phone size={18} /> Contact Our Experts
              </button>
              <a href="mailto:pvenkatahemanth2005@gmail.com" className="btn btn-secondary btn-lg" id="ins-cta-email">
                <Mail size={18} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PIP Modal */}
      {renderPipModal()}
    </div>
  );
}
