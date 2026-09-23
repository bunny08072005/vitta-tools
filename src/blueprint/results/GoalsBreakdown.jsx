import { formatCompact } from '../../utils/calculations';

const priorityColor = { high: 'var(--red)', medium: 'var(--amber)', low: 'var(--text-muted)' };

export default function GoalsBreakdown({ goalsAnalysis }) {
  return (
    <div className="bp-goals-card glass-card" id="bp-goals-breakdown">
      <h3>Goal-by-Goal Plan</h3>
      <p className="bp-goals-sub">Each goal gets its own timeline-appropriate investment mix and required monthly SIP.</p>

      <div className="bp-goals-list">
        {goalsAnalysis.goals.map((g) => {
          const Icon = g.icon;
          return (
            <div className="bp-goal-row" key={g.id}>
              <div className="bp-goal-row-top">
                <div className="bp-goal-row-name">
                  {Icon && <Icon size={16} />}
                  <span>{g.label}</span>
                  <span className="bp-goal-priority" style={{ color: priorityColor[g.priority] }}>{g.priority}</span>
                </div>
                <span className={`bp-goal-badge ${g.affordable ? 'ok' : 'warn'}`}>
                  {g.affordable ? 'Fully funded' : 'Underfunded'}
                </span>
              </div>

              <div className="bp-goal-row-stats">
                <div><span className="bp-goal-stat-label">Target (in {g.yearsToTarget}y)</span><span className="bp-goal-stat-value mono">{formatCompact(g.futureValueTarget)}</span></div>
                <div><span className="bp-goal-stat-label">Required SIP</span><span className="bp-goal-stat-value mono">{formatCompact(g.requiredMonthlySIP)}/mo</span></div>
                <div><span className="bp-goal-stat-label">Allocated SIP</span><span className="bp-goal-stat-value mono" style={{ color: g.affordable ? 'var(--green)' : 'var(--amber)' }}>{formatCompact(g.allocatedSIP)}/mo</span></div>
                <div><span className="bp-goal-stat-label">Already Covered</span><span className="bp-goal-stat-value mono">{g.fundedPercent}%</span></div>
              </div>

              <div className="bp-goal-bar">
                <div className="bp-goal-bar-fill" style={{ width: `${Math.min(100, (g.allocatedSIP / Math.max(1, g.requiredMonthlySIP)) * 100)}%`, background: g.affordable ? 'var(--green)' : 'var(--amber)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
