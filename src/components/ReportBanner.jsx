import { FileText } from 'lucide-react';
import './ReportBanner.css';

export default function ReportBanner() {
  return (
    <div className="report-banner">
      <span className="report-banner-icon">
        <FileText size={20} />
      </span>
      <div>
        <p className="report-banner-title">Every calculator here comes with a personalized PDF report</p>
        <p className="report-banner-text">
          Get your inputs and key figures, plus a detailed breakdown where it applies, in a branded
          PDF with your name on it. Free, no sign-up.
        </p>
      </div>
    </div>
  );
}
