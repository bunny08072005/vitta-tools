import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Calculator, FileText, ChevronDown } from 'lucide-react';
import { categories, getPopularCalculators } from '../data/calculators';
import ReportShowcase from './ReportShowcase';
import './Hero.css';

export default function Hero() {
  const popular = getPopularCalculators();

  return (
    <section className="hero" id="hero-section">
      <div className="container hero-content">
        {/* Badge */}
        <div className="hero-badge animate-fade-in">
          <Calculator size={14} />
          26+ Free Calculators
        </div>

        {/* Main heading */}
        <h1 className="hero-title animate-fade-in">
          Plan your money with
          <span className="accent-text"> clarity</span>
        </h1>

        <p className="hero-subtitle animate-fade-in">
          Calculators for SIPs, loans, taxes, and retirement, plus a guided planning tool to help you
          estimate your investments — free, private, and built for Indian investors.
        </p>

        {/* PDF reports highlight — jumps to the showcase section below */}
        <a href="#reports" className="hero-report-pill animate-fade-in" id="hero-report-pill">
          <FileText size={18} />
          <span><strong>Every calculator</strong> comes with a personalized PDF report</span>
          <ChevronDown size={16} />
        </a>

        {/* CTA buttons */}
        <div className="hero-ctas animate-fade-in">
          <Link to="/category/investment" className="btn btn-primary btn-lg" id="hero-cta-calc">
            Explore Calculators
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="hero-trust animate-fade-in">
          {['Free Forever', 'No Sign-up', 'Instant Results', '100% Private'].map(badge => (
            <div key={badge} className="trust-item">
              <CheckCircle size={14} />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* PDF reports showcase */}
        <ReportShowcase />

        {/* Popular calculators */}
        <div className="hero-popular">
          <h3 className="popular-title">Most Popular</h3>
          <div className="popular-grid stagger-children">
            {popular.map(calc => (
              <Link to={`/calculator/${calc.slug}`} key={calc.id} className="popular-card glass-card" id={`popular-${calc.id}`}>
                <div className="popular-icon">
                  <calc.icon size={22} />
                </div>
                <div className="popular-info">
                  <h4>{calc.name}</h4>
                  <p>{calc.description}</p>
                </div>
                <ArrowRight size={16} className="popular-arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <div className="hero-categories">
          <h3 className="popular-title">Browse by Category</h3>
          <div className="category-grid stagger-children">
            {categories.map(cat => (
              <Link to={`/category/${cat.id}`} key={cat.id} className="category-card glass-card" id={`cat-${cat.id}`}>
                <div className="category-icon" style={{ background: `${cat.color}1a`, color: cat.color }}>
                  <cat.icon size={26} strokeWidth={1.75} />
                </div>
                <h4>{cat.name}</h4>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
