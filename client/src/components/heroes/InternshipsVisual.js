import React, { useEffect, useRef, useState } from 'react';
import { Award, Pause, Play } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PhotoVisual from '../PhotoVisual';
import './InternshipsVisual.css';

gsap.registerPlugin(useGSAP);

// Short names for the ticket, so each track sits on one line of display
// type. Keyed by the track ids on the Internships page; anything not listed
// falls back to its full title without the bracketed stack.
const SHORT = {
  mern: 'Full-stack web',
  frontend: 'Frontend engineering',
  backend: 'Backend & APIs',
  aiml: 'AI & machine learning',
  python: 'Python & automation',
  mobile: 'Mobile apps',
  uiux: 'UI/UX design',
  marketing: 'Digital marketing & SEO',
  wordpress: 'WordPress & e-commerce',
  cpp: 'C++ & algorithms',
  database: 'Databases & SQL',
  qa: 'QA & testing',
};

const SEAL = 'Certificate on completion\u00a0\u00a0\u00b7\u00a0\u00a0Free\u00a0\u00a0\u00b7\u00a0\u00a0';
const pad = (n) => String(n).padStart(2, '0');
const nameOf = (t) => SHORT[t.id] || t.title.replace(/\s*\(.*\)\s*/, '');

/**
 * The Internships hero: the team photograph in the house frame, a paper pass
 * over its lower-left corner and a slowly turning seal on its upper-right.
 *
 * The pass rolls through the internship tracks one at a time. Its clock is
 * the copper rule's own CSS animation (animationend advances the track), so
 * hover, scrolling out of view and the pause button all stop the same thing;
 * the pause button also holds the seal and the photograph's sheen.
 *
 * With reduced motion, before hydration, or with a single track, the pass
 * rests on the first track with its rule full. The pass repeats the track
 * list in the form below, so its text is hidden from assistive technology.
 *
 *   photo   { src, alt }
 *   tracks  [{ id, title, category }]
 */
export default function InternshipsVisual({ photo, tracks = [] }) {
  const scope = useRef(null);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const n = tracks.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A few pixels of pointer depth on fine pointers, on the positioning
  // wrappers only, so it never fights the entrances inside them.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', scope.current).map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope }
  );

  const cycling = motionOK && n > 1;
  const running = cycling && inView && !paused && !hover;
  const cur = n ? tick % n : 0;
  const prev = n ? (tick - 1 + n) % n : 0;
  // Neighbouring tracks often share a category; the category line only
  // rolls when it actually changes, and otherwise holds still.
  const catRolls = tick > 0 && tracks[prev].category !== tracks[cur].category;

  const onRuleEnd = (e) => {
    if (e.animationName === 'iv-fill' && running) setTick((t) => t + 1);
  };

  const cls = ['iv'];
  if (cycling) cls.push('is-cycling');
  if (running) cls.push('is-running');
  if (paused) cls.push('is-paused');

  return (
    <div className={cls.join(' ')} ref={scope}>
      <PhotoVisual photo={photo} />

      <div className="iv-seal-pos" data-depth="-12" aria-hidden="true">
        <div className="iv-seal lx-glass">
          <svg className="iv-seal-ring" viewBox="0 0 120 120" focusable="false">
            <defs>
              <path id="iv-seal-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
            </defs>
            <text>
              <textPath href="#iv-seal-path" textLength="282" lengthAdjust="spacing">
                {SEAL}
              </textPath>
            </text>
          </svg>
          <span className="iv-seal-mark">
            <Award size={20} strokeWidth={1.6} />
          </span>
        </div>
      </div>

      {n > 0 && (
        <div className="iv-pass-pos" data-depth="16">
          <div
            className="iv-pass-shadow"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
          >
            <div className="iv-pass">
              <div className="iv-pass-body" aria-hidden="true">
                <p className="iv-pass-top">
                  <span className="iv-roll iv-roll--cat">
                    {catRolls && (
                      <span className="iv-roll-item is-out" key={`co${tick}`}>
                        {tracks[prev].category}
                      </span>
                    )}
                    <span
                      className={`iv-roll-item${catRolls ? ' is-in' : ''}`}
                      key={`ci${tracks[cur].category}${Math.floor(tick / (n || 1))}`}
                    >
                      {tracks[cur].category}
                    </span>
                  </span>
                  <span className="iv-pass-count tabular">
                    <span className="iv-roll iv-roll--num">
                      {tick > 0 && (
                        <span className="iv-roll-item is-out" key={`no${tick}`}>
                          {pad(prev + 1)}
                        </span>
                      )}
                      <span className={`iv-roll-item${tick > 0 ? ' is-in' : ''}`} key={`ni${tick}`}>
                        {pad(cur + 1)}
                      </span>
                    </span>
                    <span className="iv-pass-of">/ {pad(n)}</span>
                  </span>
                </p>

                <p className="iv-roll iv-roll--name">
                  {tick > 0 && (
                    <span className="iv-roll-item is-out" key={`to${tick}`}>
                      {nameOf(tracks[prev])}
                    </span>
                  )}
                  <span className={`iv-roll-item${tick > 0 ? ' is-in' : ''}`} key={`ti${tick}`}>
                    {nameOf(tracks[cur])}
                  </span>
                </p>

                <span className="iv-rule">
                  <span
                    className={`iv-rule-fill${tick === 0 ? ' is-first' : ''}`}
                    key={tick}
                    onAnimationEnd={onRuleEnd}
                  />
                </span>

                <span className="iv-tear" />

                <dl className="iv-fields">
                  <div>
                    <dt>Duration</dt>
                    <dd>1 to 3 months</dd>
                  </div>
                  <div>
                    <dt>Fee</dt>
                    <dd>None, ever</dd>
                  </div>
                </dl>
              </div>

              {cycling && (
                <button
                  type="button"
                  className="iv-toggle"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Play the rotating internship tracks' : 'Pause the rotating internship tracks'}
                >
                  {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
