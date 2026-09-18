import { useState } from 'react';
import { Send, Mail, Phone, MapPin, ExternalLink, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, sent, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '527b13be-ecdb-4584-babc-aeb272fc7cba',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: 'Vitta Contact Form',
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact-section section" id="contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">
            <Mail size={14} />
            Get in Touch
          </span>
          <h2>Contact Us</h2>
          <p>Have a question, suggestion, or business inquiry? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          {/* Contact info */}
          <div className="contact-info">
            <div className="contact-card glass-card">
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:vittahub.in@gmail.com">vittahub.in@gmail.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+919000872375">+91 9000872375</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Location</h4>
                  <p>YSR Kadapa, Andhra Pradesh, India</p>
                </div>
              </div>
            </div>

            <a
              href="https://pvhemanth.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link glass-card"
              id="portfolio-link"
            >
              <ExternalLink size={20} />
              <div>
                <h4>View My Portfolio</h4>
                <p>Check out my work and projects</p>
              </div>
            </a>
          </div>

          {/* Contact form */}
          <form className="contact-form glass-card" onSubmit={handleSubmit} id="contact-form">
            <div className="input-group">
              <label htmlFor="contact-name">Name</label>
              <input
                type="text"
                id="contact-name"
                className="input-field"
                placeholder="Your name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                id="contact-email"
                className="input-field"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className="input-field"
                placeholder="Tell us what's on your mind..."
                rows="5"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={status === 'sending'}
              id="contact-submit"
            >
              {status === 'sending' ? 'Sending...' : status === 'sent' ? (
                <><CheckCircle size={18} /> Sent!</>
              ) : (
                <><Send size={18} /> Send Message</>
              )}
            </button>

            {status === 'error' && (
              <p className="form-error">Something went wrong. Please try again or email directly.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
