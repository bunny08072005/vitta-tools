import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { BLUEPRINT_PAYWALL_ENABLED, BLUEPRINT_PRICE_LABEL } from '../config/pricing';
import './BlueprintBanner.css';

export default function BlueprintBanner() {
  return (
    <Link to="/financial-plan" className="blueprint-banner" id="blueprint-banner">
      <span className="blueprint-banner-icon"><Compass size={22} /></span>
      <div className="blueprint-banner-copy">
        <div className="blueprint-banner-title-row">
          <p className="blueprint-banner-title">Get a complete financial plan, not just one number</p>
          {!BLUEPRINT_PAYWALL_ENABLED && (
            <span className="blueprint-banner-price">
              <span className="blueprint-banner-price-strike">{BLUEPRINT_PRICE_LABEL}</span> FREE
            </span>
          )}
        </div>
        <p className="blueprint-banner-text">
          Income, goals — home, car, marriage, children's education, retirement — insurance and
          existing investments, turned into one goal-by-goal plan with post-tax return projections.
          The downloadable PDF report is free for now, usually {BLUEPRINT_PRICE_LABEL}.
        </p>
      </div>
      <span className="blueprint-banner-cta">Build My Plan <ArrowRight size={16} /></span>
    </Link>
  );
}
