import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import './CtaBanner.css';

export default function CtaBanner() {
  const scope = useRevealOnScroll();

  return (
    <section className="cta-banner-section" ref={scope} aria-label="Call to Action">
      <div className="container">
        <div className="cta-banner-card" data-reveal>
          <div className="cta-banner-glow" aria-hidden="true" />
          <div className="cta-banner-content">
            <span className="cta-banner-badge">
              <Sparkles size={15} /> Let's Build Together
            </span>
            <h2 className="cta-banner-title">
              Ready to Engineer Your Next <span className="cta-gradient-text">Intelligent Software</span>?
            </h2>
            <p className="cta-banner-desc">
              Whether you need bespoke enterprise applications, autonomous AI workflows, or a scalable SaaS platform, our team of senior engineers is ready to deliver.
            </p>
            <div className="cta-banner-actions">
              <Link to="/contact" className="btn btn-primary cta-btn-main">
                <PhoneCall size={18} /> Schedule Technical Consultation
              </Link>
              <Link to="/services" className="btn btn-secondary cta-btn-sub">
                Explore All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
