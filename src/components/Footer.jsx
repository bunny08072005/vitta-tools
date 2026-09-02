import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Globe, User } from 'lucide-react';
import { categories } from '../data/calculators';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.svg" alt="Vitta" style={{ width: 28, height: 28 }} />
              <span className="logo-text">Vitta</span>
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Plan · Grow · Protect</p>
            <p className="footer-tagline">
              Your Financial Clarity, Simplified. Free AI-powered financial calculators
              for everyone.
            </p>
            <div className="footer-contact-items">
              <a href="mailto:pvenkatahemanth2005@gmail.com" className="footer-contact-link">
                <Mail size={14} /> pvenkatahemanth2005@gmail.com
              </a>
              <a href="tel:+919000872375" className="footer-contact-link">
                <Phone size={14} /> +91 9000872375
              </a>
              <span className="footer-contact-link">
                <MapPin size={14} /> YSR Kadapa, Andhra Pradesh, India
              </span>
            </div>
          </div>

          {/* Calculator categories */}
          <div className="footer-col">
            <h4>Calculators</h4>
            <ul>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/ai-advisor">Vitta AI Advisor</Link></li>
              <li><Link to="/calculator/sip-calculator">SIP Calculator</Link></li>
              <li><Link to="/calculator/emi-calculator">EMI Calculator</Link></li>
              <li><Link to="/calculator/tax-calculator">Tax Calculator</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="https://videoportfolio-five.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={13} /> Portfolio
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Globe size={13} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <User size={13} /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Vittahub Private Ltd. All rights reserved.</p>
          <p className="footer-disclaimer">
            Disclaimer: All calculators provide estimates for educational purposes only.
            Please consult a certified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
