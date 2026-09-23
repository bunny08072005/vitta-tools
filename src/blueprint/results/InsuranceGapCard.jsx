import { formatCompact } from '../../utils/calculations';

const statusColor = { adequate: 'var(--green)', partial: 'var(--amber)', critical: 'var(--red)' };
const statusLabel = { adequate: 'Adequate', partial: 'Partial Gap', critical: 'Critical Gap' };

export default function InsuranceGapCard({ lifeInsurance, healthInsurance }) {
  return (
    <div className="bp-ins-card glass-card" id="bp-insurance-gap">
      <h3>Insurance Gap</h3>

      <div className="bp-ins-section">
        <div className="bp-ins-section-top">
          <h4>Term Life Insurance</h4>
          <span className="bp-goal-badge" style={{ color: statusColor[lifeInsurance.status], borderColor: statusColor[lifeInsurance.status] }}>
            {statusLabel[lifeInsurance.status]}
          </span>
        </div>
        <div className="bp-proj-stats">
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Human Life Value Method</span><span className="mono bp-proj-stat-value">{formatCompact(lifeInsurance.humanLifeValue)}</span></div>
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Needs-Based Method</span><span className="mono bp-proj-stat-value">{formatCompact(lifeInsurance.needBasedCover)}</span></div>
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Existing Cover</span><span className="mono bp-proj-stat-value">{formatCompact(lifeInsurance.existingCover)}</span></div>
        </div>
        {lifeInsurance.gap > 0 ? (
          <div className="bp-cf-verdict bp-cf-verdict-bad">
            Consider an additional <strong className="mono">{formatCompact(lifeInsurance.gap)}</strong> of term cover
            (recommended: {formatCompact(lifeInsurance.recommendedCover)}, the higher of the two methods above).
          </div>
        ) : (
          <div className="bp-cf-verdict bp-cf-verdict-good">✓ Your term cover meets or exceeds both estimates.</div>
        )}
      </div>

      <div className="bp-ins-section">
        <div className="bp-ins-section-top">
          <h4>Health Insurance</h4>
          <span className="bp-goal-badge" style={{ color: statusColor[healthInsurance.status], borderColor: statusColor[healthInsurance.status] }}>
            {statusLabel[healthInsurance.status]}
          </span>
        </div>
        <div className="bp-proj-stats">
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Recommended Cover</span><span className="mono bp-proj-stat-value">{formatCompact(healthInsurance.recommendedCover)}</span></div>
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Existing Cover</span><span className="mono bp-proj-stat-value">{formatCompact(healthInsurance.existingCover)}</span></div>
          <div className="bp-proj-stat"><span className="bp-proj-stat-label">Family Size</span><span className="mono bp-proj-stat-value">{healthInsurance.familySize}</span></div>
        </div>
        {healthInsurance.gap > 0 ? (
          <div className="bp-cf-verdict bp-cf-verdict-bad">
            Consider topping up by <strong className="mono">{formatCompact(healthInsurance.gap)}</strong>, based on your
            city and family size.
          </div>
        ) : (
          <div className="bp-cf-verdict bp-cf-verdict-good">✓ Your health cover looks adequate for your family size.</div>
        )}
      </div>
    </div>
  );
}
