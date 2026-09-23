import { Sparkles, RotateCcw } from 'lucide-react';
import HealthScoreCard from './HealthScoreCard';
import CashFlowSummary from './CashFlowSummary';
import GoalsBreakdown from './GoalsBreakdown';
import AllocationCard from './AllocationCard';
import WealthProjectionChart from './WealthProjectionChart';
import TaxEfficiencyCard from './TaxEfficiencyCard';
import InsuranceGapCard from './InsuranceGapCard';
import ActionPlanCard from './ActionPlanCard';
import ReportPreviewTeaser from './ReportPreviewTeaser';
import './BlueprintResults.css';

export default function BlueprintResults({ plan, onReset }) {
  const { profile } = plan;
  const goalCount = plan.goalsAnalysis.goals.length;

  return (
    <div className="bp-page">
      <div className="container">
        <div className="bp-results-header animate-fade-in">
          <Sparkles size={24} className="bp-sparkle" />
          <h1>{profile.name ? `${profile.name}'s` : 'Your'} Financial Blueprint</h1>
          <p className="bp-results-subtitle">
            A complete plan across <strong>{goalCount} goal{goalCount === 1 ? '' : 's'}</strong>, built from what you told us
          </p>
          <button className="btn btn-secondary" onClick={onReset} id="bp-reset-btn">
            <RotateCcw size={14} /> Start Over
          </button>
        </div>

        <div className="bp-results-grid">
          <HealthScoreCard score={plan.healthScore} />
          <CashFlowSummary plan={plan} />
          <GoalsBreakdown goalsAnalysis={plan.goalsAnalysis} />
          <AllocationCard allocation={plan.overallAllocation} instruments={plan.instruments} />
          <WealthProjectionChart projection={plan.projection} />
          <TaxEfficiencyCard goalsTax={plan.goalsTax} portfolioTax={plan.portfolioTax} />
          <InsuranceGapCard lifeInsurance={plan.lifeInsurance} healthInsurance={plan.healthInsurance} />
          <ActionPlanCard actions={plan.actions} />
        </div>

        <ReportPreviewTeaser plan={plan} />
      </div>
    </div>
  );
}
