import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { photos } from '../../assets/lux';
import { serviceHeroPhoto } from '../../data/serviceImages';
import './ServicesVisual.css';

gsap.registerPlugin(useGSAP);

// Each service's own photograph, in the tall crop made for heroes, so the
// picture always shows the thing the front name offers.
const photoFor = (s) => (s && serviceHeroPhoto(s.slug)) || photos.serviceWeb;
const pad = (n) => String(n).padStart(2, '0');

// Rows further than this from the front are parked, invisible, at this
// distance, so one wrapping round the drum never sweeps across the window.
const PARK = 3;

// The seal's ring of text: a circle of radius 38 in a 100-unit box.
const RING = 'M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0';
const RING_LEN = 2 * Math.PI * 38;

/**
 * The Services hero: a turning index of every service, over that service's
 * own photograph.
 *
 * A glass panel holds a drum of service names; the front one is set large
 * in ink while a copper rule fills, then the drum turns up a notch and the
 * next comes forward. Behind it the photograph wipes upward to the next
 * service's picture, and a small seal keeps count, ringed by the four
 * disciplines with the front service's one lit.
 *
 * The clock is the rule's own CSS animation (its animationend turns the
 * drum), so hovering the panel, scrolling away and the pause button all stop
 * the same thing. With reduced motion the rule never runs and everything
 * rests on the first service. The grid below lists every service, so the
 * whole visual except the pause button is hidden from assistive technology.
 *
 *   services  [{ slug, title, category }]  in the order the grid shows them
 */
export default function ServicesVisual({ services = [] }) {
  const root = useRef(null);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const n = services.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A few pixels of pointer depth between the layers, on fine pointers only.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', root.current).map((el) => ({
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
    { scope: root }
  );

  // Fetch the next photograph during this dwell, so its wipe never opens
  // onto a picture that is still loading.
  const nextSrc = n > 1 ? photoFor(services[(step + 1) % n]).src : null;
  useEffect(() => {
    if (!motionOK || !nextSrc) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = nextSrc;
  }, [motionOK, nextSrc]);

  if (!n) return null;

  const at = (k) => services[((k % n) + n) % n];
  const running = motionOK && inView && !paused && n > 1;
  const front = at(step);
  const categories = services.reduce((acc, s) => (acc.includes(s.category) ? acc : [...acc, s.category]), []);

  // The photograph only changes when the next service has a different one.
  // The layer on top is keyed by the step its run of the same picture began
  // at, so a new picture mounts (and wipes in) while the one it covers keeps
  // its node and stays put underneath.
  const runStart = (k) => {
    const src = photoFor(at(k)).src;
    let s = k;
    while (s > 0 && s > k - n && photoFor(at(s - 1)).src === src) s -= 1;
    return s;
  };
  // A layer's class never changes once mounted: swapping it would restart
  // the covered picture's zoom halfway through the next wipe.
  const top = runStart(step);
  const layers = [];
  if (top > 0) {
    const under = runStart(top - 1);
    layers.push({ key: under, photo: photoFor(at(under)), fresh: under > 0 });
  }
  layers.push({ key: top, photo: photoFor(front), fresh: top > 0 });

  const onAnimationEnd = (e) => {
    if (e.animationName === 'svx-progress' && running) setStep((s) => s + 1);
  };

  return (
    <div className={`svx${running ? ' is-running' : ''}${paused ? ' is-paused' : ''}`} ref={root}>
      <div className="svx-frame" aria-hidden="true">
        <div className="svx-drift">
          {layers.map(({ key, photo, fresh }) => (
            <div className={`svx-layer${fresh ? ' is-fresh' : ''}`} key={key}>
              <img src={photo.src} alt="" decoding="async" />
            </div>
          ))}
        </div>
        <span className="lx-pv-sheen" />
      </div>

      <div className="svx-seal-pos" data-depth="-12" aria-hidden="true">
        <div className="svx-seal lx-glass">
          {categories.length > 1 && (
            <svg className="svx-ring" viewBox="0 0 100 100">
              <defs>
                <path id="svx-ring-path" d={RING} />
              </defs>
              <text>
                <textPath href="#svx-ring-path" textLength={RING_LEN} lengthAdjust="spacing">
                  {/* Non-breaking spaces: a plain one at the end of the
                      path collapses and the last dot meets the first name. */}
                  {categories.map((c) => (
                    <tspan key={c} className={c === front.category ? 'is-on' : undefined}>
                      {`${c} · `}
                    </tspan>
                  ))}
                </textPath>
              </text>
            </svg>
          )}
          <span className="svx-seal-core">
            <span className="svx-seal-num tabular" key={step}>
              {pad((step % n) + 1)}
            </span>
            <span className="svx-seal-label">of {n}</span>
          </span>
        </div>
      </div>

      <div className="svx-panel-pos" data-depth="14" aria-hidden="true">
        <div className="svx-panel" onAnimationEnd={onAnimationEnd}>
          <p className="svx-head">
            <span className="svx-cat" key={front.category}>
              {front.category}
            </span>
          </p>

          <div className="svx-drum">
            {services.map((s, i) => {
              // Signed distance from the front, the short way round.
              let d = (((i - step) % n) + n) % n;
              if (d > n / 2) d -= n;
              const far = Math.abs(d) > 2;
              const pos = far ? Math.sign(d) * PARK : d;
              return (
                <div
                  className="svx-row"
                  data-d={far ? 'far' : Math.abs(d)}
                  key={s.slug}
                  style={{ '--d': pos }}
                >
                  <span className="svx-row-num tabular">{pad(i + 1)}</span>
                  <span className="svx-row-title">{s.title}</span>
                </div>
              );
            })}
          </div>

          <span className="svx-rule">
            <span className={`svx-rule-fill${step === 0 ? ' is-first' : ''}`} key={step} />
          </span>
        </div>
      </div>

      {motionOK && n > 1 && (
        <button
          type="button"
          className="svx-toggle lx-glass"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the rotating list of services' : 'Pause the rotating list of services'}
        >
          {paused ? (
            <Play size={14} fill="currentColor" aria-hidden="true" />
          ) : (
            <Pause size={14} fill="currentColor" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
