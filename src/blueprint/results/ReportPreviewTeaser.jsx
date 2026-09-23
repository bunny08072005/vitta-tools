import { useState } from 'react';
import { track } from '@vercel/analytics/react';
import { FileText, Download, Loader2, ShieldCheck, Table2, ListChecks, Sparkles } from 'lucide-react';
import { usePaywall } from '../usePaywall';
import { BLUEPRINT_PRICE_LABEL, BLUEPRINT_PAYWALL_ENABLED } from '../../config/pricing';

export default function ReportPreviewTeaser({ plan }) {
  const [name, setName] = useState(plan.profile.name || '');
  const [generating, setGenerating] = useState(false);

  // receipt is only ever set post-purchase, from usePaywall's verified
  // Razorpay callback — see usePaywall.js. undefined during the free/launch
  // period, so the PDF is unstamped, exactly as before.
  const generate = async (receipt) => {
    setGenerating(true);
    try {
      const { generateBlueprintReport } = await import('../../utils/pdfReport');
      await generateBlueprintReport(plan, name.trim(), receipt);
      track('blueprint_pdf_downloaded', { paid: BLUEPRINT_PAYWALL_ENABLED });
    } finally {
      setGenerating(false);
    }
  };

  const { purchase, status, error, paywallEnabled } = usePaywall({ name, onUnlocked: generate });
  const busy = generating || status === 'processing';

  return (
    <div className="bp-report-teaser glass-card animate-fade-in-up" id="bp-report-teaser">
      <div className="bp-report-teaser-glow" aria-hidden="true" />

      <div className="bp-report-teaser-grid">
        <div className="bp-report-teaser-copy">
          <span className="section-label"><FileText size={14} /> Complete PDF Blueprint</span>
          <h3>Take this plan with you</h3>
          <p>
            A branded, multi-page PDF with every section above — health score, goal-by-goal funding
            plan, allocation, tax efficiency, insurance gap and your full action plan.
          </p>
          <ul className="bp-report-teaser-features">
            <li><Table2 size={15} /> Every table &amp; chart from this page, print-ready</li>
            <li><ListChecks size={15} /> Your full input record, for future reference</li>
            <li><ShieldCheck size={15} /> Generated in your browser — nothing leaves your device</li>
          </ul>
        </div>

        <div className="bp-price-card">
          {!paywallEnabled && (
            <span className="bp-price-badge"><Sparkles size={12} /> Launch Offer</span>
          )}

          <div className="bp-price-tag">
            {paywallEnabled ? (
              <span className="bp-price-now">{BLUEPRINT_PRICE_LABEL}</span>
            ) : (
              <>
                <span className="bp-price-strike">{BLUEPRINT_PRICE_LABEL}</span>
                <span className="bp-price-free">FREE</span>
              </>
            )}
          </div>
          <span className="bp-price-sub">
            {paywallEnabled ? 'One-time · No subscription' : `Free while we're in launch — normally ${BLUEPRINT_PRICE_LABEL}`}
          </span>

          <input
            type="text"
            className="input-field bp-price-input"
            placeholder="Name for the report (optional)"
            aria-label="Name for the report (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          <button className="btn btn-primary bp-price-btn" onClick={purchase} disabled={busy} id="bp-download-report">
            {busy ? <Loader2 size={18} className="bp-spin" /> : <Download size={18} />}
            {busy ? 'Generating…' : paywallEnabled ? 'Get My Full PDF' : 'Download Complete PDF'}
          </button>

          {error && <span className="bp-report-teaser-error">{error}</span>}
        </div>
      </div>
    </div>
  );
}
