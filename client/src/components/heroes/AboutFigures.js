import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutFigures.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The About page's four figures, set as an editorial row rather than four
 * boxes: a hairline over each, a large serif numeral, one line of label.
 *
 * Each digit sits in its own mask on a strip of ten, ending on the real
 * digit. The stylesheet parks every strip on that last digit, so the
 * prerendered page, a reader without script and reduced motion all see the
 * finished number. On scroll, GSAP rewinds the strips and rolls them home
 * like an odometer, one column settling after another.
 *
 *   items  [{ number, label }]  number is a string ("2025", "50+", "34")
 */
export default function AboutFigures({ items }) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cols = gsap.utils.toArray('.lx-af-item', scope.current);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: 'top 82%', once: true },
        });

        cols.forEach((col, i) => {
          const at = i * 0.14;
          const strips = col.querySelectorAll('.lx-af-strip');
          const quiet = col.querySelectorAll('.lx-af-idx, .lx-af-label, .lx-af-suffix');

          tl.fromTo(
            col.querySelector('.lx-af-rule'),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: 'expo.out' },
            at
          )
            .fromTo(
              strips,
              { y: 0, yPercent: 0 },
              { y: 0, yPercent: -90, duration: (j) => 1.6 + j * 0.22, ease: 'expo.out' },
              at + 0.05
            )
            .fromTo(
              quiet,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' },
              at + 0.25
            );
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} className="lx-af" aria-label="Cortexis in figures">
      <div className="lx-wrap">
        <ul className="lx-af-row">
          {items.map((item, i) => (
            <li className="lx-af-item" key={item.label}>
              <span className="lx-af-rule" aria-hidden="true" />
              <span className="lx-af-idx" aria-hidden="true">{`0${i + 1}`}</span>
              <p className="lx-af-num">
                <span className="visually-hidden">{item.number}</span>
                <Odometer value={item.number} />
              </p>
              <p className="lx-af-label">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// "50+" becomes two rolling digits and a still copper plus.
function Odometer({ value }) {
  return (
    <span className="lx-af-digits" aria-hidden="true">
      {[...String(value)].map((ch, j) =>
        /\d/.test(ch) ? (
          <span className="lx-af-mask" key={j}>
            <span className="lx-af-sizer">{ch}</span>
            <span className="lx-af-strip">
              {/* Ten steps counting up to the real digit, which is last. */}
              {Array.from({ length: 10 }, (_, k) => (
                <span key={k}>{(Number(ch) + k + 1) % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span className="lx-af-suffix" key={j}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   The rest of the About page, below the figures. They live here, beside
   the figures, so the page's own styles stay in one stylesheet. The page
   has no closing call of its own: the footer opens with one ("Build the
   future with us"), and a second, directly above it, only repeated it.
   ──────────────────────────────────────────────────────────────────────── */

// Frames open to this radius; it matches --r-lg, which GSAP cannot read.
const R_LG = '28px';

/**
 * What drives us: three tall photographic plates, the middle one set lower.
 * Each frame opens upward from its bottom edge as it arrives, the picture
 * settling inside it, then its glass caption rises. While the page scrolls
 * each picture drifts a few percent against its frame. Under reduced motion,
 * or without script, the plates are simply there.
 *
 *   items  [{ key, title, text, photo: { src, alt } }]
 */
export function AboutDrivers({ items }) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.lx-ad-plate', scope.current).forEach((plate, i) => {
          const frame = plate.querySelector('.lx-ad-frame');
          const img = plate.querySelector('.lx-ad-frame img');
          const cap = plate.querySelectorAll('.lx-ad-cap > *');

          gsap
            .timeline({ scrollTrigger: { trigger: plate, start: 'top 88%', once: true } })
            .fromTo(
              frame,
              { clipPath: `inset(100% 0% 0% 0% round ${R_LG})` },
              { clipPath: `inset(0% 0% 0% 0% round ${R_LG})`, duration: 1.5, ease: 'expo.out', delay: i * 0.12, clearProps: 'clipPath' }
            )
            .fromTo(img, { scale: 1.3 }, { scale: 1.1, duration: 2, ease: 'expo.out' }, '<')
            .fromTo(
              cap,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' },
              '<0.45'
            );

          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} className="lx-ad" aria-labelledby="mvp-heading">
      <div className="lx-wrap">
        <div className="lx-ad-head">
          <span className="lx-label">Our DNA</span>
          <h2 id="mvp-heading" className="lx-h2">
            What drives <em>us.</em>
          </h2>
        </div>
        <ul className="lx-ad-row">
          {items.map((item, i) => (
            <li className="lx-ad-plate" key={item.key}>
              <div className="lx-ad-frame">
                <div className="lx-ad-zoom">
                  <img src={item.photo.src} alt={item.photo.alt} loading="lazy" decoding="async" width="840" height="1200" />
                </div>
              </div>
              <div className="lx-ad-cap lx-glass">
                <span className="lx-ad-idx" aria-hidden="true">{`0${i + 1}`}</span>
                <h3 className="lx-ad-title">{item.title}</h3>
                <p className="lx-ad-text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Our story, and the public company record beside it: one photograph that
 * drifts against the scroll, a line of history, three working rules, and the
 * SECP register facts with a way to check them.
 *
 *   photo         { src, alt }
 *   chips         short strings
 *   registration  SITE.registration
 */
export function AboutStory({ photo, chips, registration }) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = scope.current;
        const frame = root.querySelector('.lx-as-frame');
        const img = root.querySelector('.lx-as-frame img');

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top 78%', once: true } })
          .fromTo(
            frame,
            { clipPath: `inset(0% 100% 0% 0% round ${R_LG})` },
            { clipPath: `inset(0% 0% 0% 0% round ${R_LG})`, duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' }
          )
          .fromTo(img, { scale: 1.3 }, { scale: 1.1, duration: 2.2, ease: 'expo.out' }, '<0.2')
          .fromTo(
            root.querySelectorAll('.lx-as-copy > *'),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, clearProps: 'transform' },
            '<0.3'
          )
          .fromTo(
            root.querySelectorAll('.lx-as-chip'),
            { opacity: 0, x: -14 },
            { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'transform' },
            '<0.35'
          );

        gsap
          .timeline({ scrollTrigger: { trigger: root.querySelector('.lx-as-record'), start: 'top 86%', once: true } })
          .fromTo(
            root.querySelector('.lx-as-record'),
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }
          )
          .fromTo(
            root.querySelectorAll('.lx-as-fact'),
            { '--rule': 0 },
            { '--rule': 1, duration: 1.2, ease: 'expo.out', stagger: 0.1 },
            '<0.2'
          )
          .fromTo(
            root.querySelectorAll('.lx-as-fact dd'),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'transform' },
            '<0.15'
          );

        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          }
        );
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} className="lx-as" aria-labelledby="story-heading">
      <div className="lx-wrap lx-as-grid">
        <figure className="lx-as-media">
          <div className="lx-as-frame">
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width="1000" height="1388" />
          </div>
        </figure>

        <div className="lx-as-body">
          <div className="lx-as-copy">
            <span className="lx-label">Our story</span>
            <h2 id="story-heading" className="lx-h2">
              From a small <em>studio.</em>
            </h2>
            <p className="lx-as-lede">We began by helping local teams digitize their workflows.</p>
          </div>

          <ul className="lx-as-chips" aria-label="How we work">
            {chips.map((c) => (
              <li className="lx-as-chip" key={c}>{c}</li>
            ))}
          </ul>

          {/* A real, checkable company record. Several of our own articles
              tell readers to verify a company on the SECP register before
              trusting it, which was hollow while this page offered nothing to
              verify. Public register facts only: no director names, no CNICs,
              no personal contact details, and not the street address on the
              filing, which is a home. The register is a name search, so the
              link says to look us up rather than promising a one-click record. */}
          <div className="lx-as-record lx-glass">
            <h3 id="registration-heading" className="lx-as-record-title">
              A registered company <em>in Pakistan.</em>
            </h3>
            <dl className="lx-as-facts">
              <div className="lx-as-fact">
                <dt>Registered name</dt>
                <dd>Cortexis Solution Hub (Private) Limited</dd>
              </div>
              <div className="lx-as-fact">
                <dt>Incorporated</dt>
                <dd>2 September 2025, under the {registration.act}</dd>
              </div>
              <div className="lx-as-fact">
                <dt>Registered office</dt>
                <dd>Pakistan</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
