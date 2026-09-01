import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
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
              <Sparkles size={15} /> Have something to build?
            </span>
            <h2 className="cta-banner-title">
              Tell us <span className="cta-gradient-text">what you need</span>.
            </h2>
            {/* The client's draft opened this sentence with "We reply within one
                working day". Nothing in the repo or in any published policy
                commits us to that window, and a turnaround time is the kind of
                promise a prospect will hold us to, so the timing is gone and the
                sentence now describes what the reply contains instead. Put the
                clock back in only once there is a written response-time SLA to
                point at. */}
            <p className="cta-banner-desc">
              We reply with questions, a rough estimate, or an honest
              &ldquo;this isn&rsquo;t a fit&rdquo;. No sales call required to get
              an answer.
            </p>
            <div className="cta-banner-actions">
              <Link to="/contact" className="btn btn-primary cta-btn-main">
                Start a project <ArrowRight size={18} />
              </Link>
              {/* Leaves the SPA, so this is an <a> and not a <Link>. rel carries
                  both tokens rather than noopener alone: eslint's
                  jsx-no-target-blank wants noreferrer unconditionally, and CRA
                  promotes that warning to a build failure whenever CI is set.
                  Nothing here needs the referrer, so satisfying the rule costs
                  us nothing and beats disabling it. The accessible name spells
                  out the new tab because the visible label cannot — this file
                  has no visually-hidden class of its own to lean on. */}
              <a
                href="https://wa.me/923475769500"
                className="btn btn-secondary cta-btn-sub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message on WhatsApp (opens in a new tab)"
              >
                <MessageCircle size={18} aria-hidden="true" focusable="false" /> Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
