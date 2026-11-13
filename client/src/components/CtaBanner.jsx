import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { photos } from '../assets/lux';
import './CtaBanner.css';
import Photo from './Photo.jsx';

export default function CtaBanner() {
  const scope = useRevealOnScroll();

  // The light drifting over the photograph runs only while the panel is in
  // view, so an off-screen loop never costs a frame.
  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-live', entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [scope]);

  return (
    <section className="lx-cta" ref={scope} aria-labelledby="cta-heading">
      <div className="lx-wrap">
        <div className="lx-cta-panel" data-reveal-media>
          <div className="lx-cta-drift" data-parallax="6">
            <Photo src={photos.cta.src} srcSet={photos.cta.srcSet} avifSrcSet={photos.cta.avifSrcSet} sizes="100vw" alt="" loading="lazy" decoding="async" width="2000" height="1125" />
          </div>
          <div className="lx-cta-content">
            <span className="lx-label" data-reveal><span className="lx-label-num">06</span>Have something to build?</span>
            <h2 id="cta-heading" className="lx-cta-title" data-reveal>
              Tell us <em>what you need.</em>
            </h2>
            {/* The client's draft opened this sentence with "We reply within one
                working day". Nothing in the repo or in any published policy
                commits us to that window, and a turnaround time is the kind of
                promise a prospect will hold us to, so the timing is gone and the
                sentence now describes what the reply contains instead. Put the
                clock back in only once there is a written response-time SLA to
                point at. */}
            <p className="lx-cta-desc" data-reveal>
              Questions, a rough estimate, or an honest &ldquo;not a fit&rdquo;. No sales call.
            </p>
            <div className="lx-cta-actions" data-reveal>
              <Link to="/contact" className="btn lx-btn">
                Start a project
                <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
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
                className="lx-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message on WhatsApp (opens in a new tab)"
              >
                <MessageCircle size={16} aria-hidden="true" focusable="false" /> Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
