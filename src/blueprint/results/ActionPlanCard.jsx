import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

const ICONS = { critical: AlertTriangle, important: AlertCircle, optimize: Lightbulb };
const COLORS = { critical: { bg: 'var(--red-soft)', c: 'var(--red)' }, important: { bg: 'var(--amber-soft)', c: 'var(--amber)' }, optimize: { bg: 'var(--green-soft)', c: 'var(--green)' } };
const LABELS = { critical: 'Critical', important: 'Important', optimize: 'Optimize' };

export default function ActionPlanCard({ actions }) {
  return (
    <div className="bp-actions-card glass-card" id="bp-action-plan">
      <h3>Action Plan</h3>
      <p className="bp-goals-sub">Prioritized steps to close the gaps found in this plan.</p>
      <div className="bp-actions-list">
        {actions.map((a, i) => {
          const Icon = ICONS[a.priority] || Lightbulb;
          const col = COLORS[a.priority] || COLORS.optimize;
          return (
            <div className="bp-action-row" key={i} style={{ borderLeftColor: col.c }}>
              <div className="bp-action-row-inner">
                <span className="bp-action-icon" style={{ background: col.bg, color: col.c }}><Icon size={18} /></span>
                <div className="bp-action-body">
                  <div className="bp-action-title-row">
                    <h4>{a.title}</h4>
                    <span className="bp-action-tag" style={{ background: col.bg, color: col.c }}>{LABELS[a.priority] || a.priority}</span>
                  </div>
                  <p>{a.description}</p>
                  {a.link && a.link !== '/financial-plan' && (
                    <Link to={a.link} className="bp-action-link">Use Calculator <ArrowRight size={14} /></Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
