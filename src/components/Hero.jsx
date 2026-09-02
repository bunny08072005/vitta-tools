import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { categories, getPopularCalculators } from '../data/calculators';
import './Hero.css';

export default function Hero() {
  const popular = getPopularCalculators();

  return (
    <section className="hero" id="hero-section">
      {/* Background effects */}
      <div className="hero-bg">
        <div className="hero-gradient-orb orb-1" />
        <div className="hero-gradient-orb orb-2" />
        <div className="hero-gradient-orb orb-3" />
        <div className="hero-grid" />
      </div>

      <div className="container hero-content">
        {/* Badge */}
        <div className="hero-badge animate-fade-in">
          <Sparkles size={14} />
          AI-Powered Financial Tools
        </div>

        {/* Main heading */}
        <h1 className="hero-title animate-fade-in">
          Your Financial Clarity,
          <span className="gradient-text"> Simplified</span>
        </h1>

        <p className="hero-subtitle animate-fade-in">
          26+ free financial calculators and an AI-powered advisor to help you plan investments,
          loans, taxes, and retirement — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="hero-ctas animate-fade-in">
          <Link to="/ai-advisor" className="btn btn-primary btn-lg" id="hero-cta-ai">
            <Sparkles size={18} />
            Try Vitta AI Advisor
          </Link>
          <Link to="/category/investment" className="btn btn-secondary btn-lg" id="hero-cta-calc">
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
                <div className="category-icon" style={{ background: cat.gradient }}>
                  <span style={{ fontSize: '1.8rem', lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>{cat.emoji}</span>
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
