import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Table2, ListChecks, UserRound, ShieldCheck } from 'lucide-react';
import { calculators } from '../data/calculators';
import { sipFutureValue, sipProjection } from '../utils/calculations';
import './ReportShowcase.css';

const FEATURES = [
  {
    icon: Table2,
    title: 'Full breakdown',
    text: 'Year-by-year growth, loan amortization schedules, tax regime comparisons and more, for most calculators.',
  },
  {
    icon: ListChecks,
    title: 'Your inputs on record',
    text: 'Every assumption you entered is listed beside the key figures, so it is easy to revisit later.',
  },
  {
    icon: UserRound,
    title: 'Made for you',
    text: 'Add your name and it appears on the report, along with the date it was generated.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'Reports are created in your browser. Your name and numbers never leave your device.',
  },
];

// The preview uses the SIP calculator's own defaults and formulas, and the same "Rs." format
// as the real PDF, so what visitors see here matches what they get when they download it.
const SAMPLE = { monthly: 5000, rate: 12, years: 10 };
const rs = (n) => `Rs. ${Math.round(n).toLocaleString('en-IN')}`;

function ReportPreview() {
  const { monthly, rate, years } = SAMPLE;
  const fv = Math.round(sipFutureValue(monthly, rate, years));
  const invested = monthly * years * 12;
  // More rows than fit: the page clips them under a fade, so it reads as a longer document
  const rows = sipProjection(monthly, rate, years).slice(0, 7);
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="rs-preview" role="img" aria-label="Preview of a Vitta SIP Investment Report PDF">
      <div className="rs-page">
        <div className="rs-letterhead">
          <img src="/logo.svg" alt="" className="rs-logo" />
          <div className="rs-brand">
            <span className="rs-brand-name">Vitta</span>
            <span className="rs-brand-tag">PLAN · GROW · PROTECT</span>
          </div>
          <span className="rs-site">vittahub.in</span>
        </div>

        <div className="rs-body">
          <div className="rs-doc-title">SIP Investment Report</div>
          <div className="rs-doc-sub">Systematic Investment Plan projection, generated using the Vitta SIP Calculator.</div>
          <div className="rs-doc-meta">
            <strong>Your Name</strong>
            <span>Generated on {date}</span>
          </div>

          <div className="rs-stats">
            <div className="rs-stat rs-stat-highlight">
              <div className="rs-stat-label">Total Value</div>
              <div className="rs-stat-value">{rs(fv)}</div>
            </div>
            <div className="rs-stat">
              <div className="rs-stat-label">Invested Amount</div>
              <div className="rs-stat-value">{rs(invested)}</div>
            </div>
            <div className="rs-stat">
              <div className="rs-stat-label">Est. Returns</div>
              <div className="rs-stat-value">{rs(fv - invested)}</div>
            </div>
            <div className="rs-stat">
              <div className="rs-stat-label">Growth Multiple</div>
              <div className="rs-stat-value">{(fv / invested).toFixed(2)}x</div>
            </div>
          </div>

          <div className="rs-doc-heading">Your Inputs</div>
          <dl className="rs-kv">
            <dt>Monthly Investment</dt>
            <dd>{rs(monthly)}</dd>
            <dt>Expected Return Rate (p.a.)</dt>
            <dd>{rate}%</dd>
            <dt>Time Period</dt>
            <dd>{years} years</dd>
          </dl>

          <div className="rs-doc-heading">Year-by-Year Growth</div>
          <div className="rs-table">
            <div className="rs-tr rs-th">
              <span>Year</span>
              <span>Total Invested</span>
              <span>Corpus Value</span>
              <span>Wealth Gained</span>
            </div>
            <div className="rs-tbody">
              {rows.map((d) => (
                <div className="rs-tr" key={d.year}>
                  <span className="rs-bold">Year {d.year}</span>
                  <span>{rs(d.invested)}</span>
                  <span className="rs-bold">{rs(d.value)}</span>
                  <span className="rs-green">{rs(d.gains)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportShowcase() {
  return (
    <section className="report-showcase animate-fade-in" id="reports" aria-labelledby="reports-heading">
      <div className="rs-card">
        <div className="rs-copy">
          <span className="section-label">
            <FileText size={14} />
            PDF Reports
          </span>
          <h2 className="rs-title" id="reports-heading">Every calculation, in a report worth keeping</h2>
          <p className="rs-lead">
            Vitta doesn&apos;t stop at a number on the screen. Each of our {calculators.length} calculators
            can turn your results into a branded PDF report, free to download with no sign-up.
          </p>

          <ul className="rs-features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rs-feature">
                <span className="rs-feature-icon"><Icon size={18} /></span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rs-actions">
            <Link to="/calculator/sip-calculator" className="btn btn-primary" id="reports-cta">
              See it in the SIP Calculator
              <ArrowRight size={18} />
            </Link>
            <span className="rs-note">Free · No sign-up · Save, print or share</span>
          </div>
        </div>

        <ReportPreview />
      </div>
    </section>
  );
}
