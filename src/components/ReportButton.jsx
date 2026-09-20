import { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import './ReportButton.css';

export default function ReportButton({ onGenerate, label = 'Download PDF Report' }) {
  const [salutation, setSalutation] = useState('');
  const [forName, setForName] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleClick = async () => {
    setGenerating(true);
    try {
      const trimmed = forName.trim();
      const fullName = trimmed ? `${salutation} ${trimmed}`.trim() : '';
      await onGenerate(fullName);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="report-download">
      <div className="report-download-label">
        <FileText size={15} />
        <span>Get a personalized PDF report with your inputs, key figures and a detailed breakdown where it applies</span>
      </div>
      <div className="report-download-row">
        <select
          className="input-field report-salutation"
          value={salutation}
          onChange={(e) => setSalutation(e.target.value)}
          aria-label="Title"
        >
          <option value="">Title</option>
          <option value="Mr.">Mr.</option>
          <option value="Ms.">Ms.</option>
          <option value="Mrs.">Mrs.</option>
        </select>
        <input
          type="text"
          className="input-field report-name"
          placeholder="Name (Optional)"
          value={forName}
          onChange={(e) => setForName(e.target.value)}
          maxLength={60}
        />
        <button className="btn btn-primary" onClick={handleClick} disabled={generating} id="report-download-btn">
          {generating ? <Loader2 size={18} className="report-spin" /> : <Download size={18} />}
          {generating ? 'Generating…' : label}
        </button>
      </div>
    </div>
  );
}
