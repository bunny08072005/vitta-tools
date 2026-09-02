import { useParams } from 'react-router-dom';
import { getCalculatorBySlug } from '../data/calculators';

// Investment
import SIPCalculator from '../calculators/investment/SIPCalculator';
import LumpsumCalculator from '../calculators/investment/LumpsumCalculator';
import StepUpSIPCalculator from '../calculators/investment/StepUpSIPCalculator';
import MutualFundCalculator from '../calculators/investment/MutualFundCalculator';
import CAGRCalculator from '../calculators/investment/CAGRCalculator';
import XIRRCalculator from '../calculators/investment/XIRRCalculator';
import SWPCalculator from '../calculators/investment/SWPCalculator';

// Fixed Income
import FDCalculator from '../calculators/fixed-income/FDCalculator';
import RDCalculator from '../calculators/fixed-income/RDCalculator';
import PPFCalculator from '../calculators/fixed-income/PPFCalculator';
import NPSCalculator from '../calculators/fixed-income/NPSCalculator';
import BondYieldCalculator from '../calculators/fixed-income/BondYieldCalculator';

// Loans
import EMICalculator from '../calculators/loans/EMICalculator';
import HomeLoanCalculator from '../calculators/loans/HomeLoanCalculator';
import CarLoanCalculator from '../calculators/loans/CarLoanCalculator';

// Planning
import GoalPlanning from '../calculators/planning/GoalPlanning';
import RetirementPlanning from '../calculators/planning/RetirementPlanning';
import FIRECalculator from '../calculators/planning/FIRECalculator';
import EmergencyFundCalculator from '../calculators/planning/EmergencyFundCalculator';
import NetWorthTracker from '../calculators/planning/NetWorthTracker';
import InflationCalculator from '../calculators/planning/InflationCalculator';
import AssetAllocationCalculator from '../calculators/planning/AssetAllocationCalculator';

// Insurance & Tax
import InsuranceNeedCalculator from '../calculators/insurance-tax/InsuranceNeedCalculator';
import HumanLifeValueCalculator from '../calculators/insurance-tax/HumanLifeValueCalculator';
import TaxCalculator from '../calculators/insurance-tax/TaxCalculator';
import HRACalculator from '../calculators/insurance-tax/HRACalculator';

const calculatorComponents = {
  'sip-calculator': SIPCalculator,
  'lumpsum-calculator': LumpsumCalculator,
  'stepup-sip-calculator': StepUpSIPCalculator,
  'mutual-fund-calculator': MutualFundCalculator,
  'cagr-calculator': CAGRCalculator,
  'xirr-calculator': XIRRCalculator,
  'swp-calculator': SWPCalculator,
  'fd-calculator': FDCalculator,
  'rd-calculator': RDCalculator,
  'ppf-calculator': PPFCalculator,
  'nps-calculator': NPSCalculator,
  'bond-yield-calculator': BondYieldCalculator,
  'emi-calculator': EMICalculator,
  'home-loan-calculator': HomeLoanCalculator,
  'car-loan-calculator': CarLoanCalculator,
  'goal-planning': GoalPlanning,
  'retirement-planning': RetirementPlanning,
  'fire-calculator': FIRECalculator,
  'emergency-fund': EmergencyFundCalculator,
  'net-worth-tracker': NetWorthTracker,
  'inflation-calculator': InflationCalculator,
  'asset-allocation': AssetAllocationCalculator,
  'insurance-need': InsuranceNeedCalculator,
  'human-life-value': HumanLifeValueCalculator,
  'tax-calculator': TaxCalculator,
  'hra-calculator': HRACalculator,
};

export default function CalculatorPage() {
  const { slug } = useParams();
  const Component = calculatorComponents[slug];

  if (!Component) {
    return (
      <div className="calc-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 100 }}>
          <h2>Calculator not found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>The calculator "{slug}" doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <Component />;
}
