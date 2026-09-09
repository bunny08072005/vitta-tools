import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import './CalculatorLayout.css';

export default function CalculatorLayout({ title, description, icon: Icon, category, children }) {
  return (
    <div className="calc-page">
      <div className="container">
        <Link to={category ? `/category/${category}` : '/'} className="calc-back" id="calc-back-btn">
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="calc-header animate-fade-in">
          {Icon && (
            <div className="calc-header-icon">
              <Icon size={28} />
            </div>
          )}
          <div>
            <h1 className="calc-title">{title}</h1>
            {description && <p className="calc-description">{description}</p>}
          </div>
        </div>

        <div className="calc-body animate-fade-in-up">
          {children}
        </div>

        <p className="calc-tool-disclaimer">
          <Info size={14} />
          Educational estimate only, not investment advice. Vitta is not SEBI-registered as an
          Investment Adviser or Research Analyst.
        </p>
      </div>
    </div>
  );
}
