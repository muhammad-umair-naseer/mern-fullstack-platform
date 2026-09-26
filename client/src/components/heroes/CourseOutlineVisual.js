import React, { useEffect, useRef, useState } from 'react';
import { Award, Check, ClipboardCheck, Pause, Play } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PhotoVisual from '../PhotoVisual';
import './CourseOutlineVisual.css';

gsap.registerPlugin(useGSAP);

const pad = (n) => String(n).padStart(2, '0');

// Rows shown at once in the syllabus window. Kept in step with the window
// height in CourseOutlineVisual.css (four rows of --row).
const VISIBLE = 4;

// Progress mode: the pause before the climb, and the time per row.
const CLIMB_DELAY = 1100;
const CLIMB_STEP = 240;

// Tour mode: how long the rows fade before the tour starts again.
const REWIND_MS = 380;

/**
 * The course page hero: the course's cover photograph in the house frame,
 * a slowly turning seal over its corner, and laid across its lower edge a
 * small syllabus card with the course's own chapter titles, then the final
 * exam and the certificate.
 *
 * Two modes, both driven by real data:
 *   tour      (not enrolled) a copper rule fills under the current row and
 *             the list steps down chapter by chapter to the certificate,
 *             then starts again. The rule's own CSS animation is the clock,
 *             so pausing, scrolling away and reduced motion all stop the
 *             same thing.
 *   progress  (enrolled) the list climbs once from chapter 1 to where the
 *             learner is, ticking the chapters they have cleared, and rests
 *             there with the current row's rule showing how far into that
 *             chapter they are.
 *
 * With reduced motion the card sits still: the first rows in tour mode, the
 * learner's own chapter in progress mode.
 *
 *   photo      { src, alt }
 *   chapters   [{ title, done, fraction }] in order
 *   mode       'tour' | 'progress'
 *   current    row the learner is on (progress mode): a chapter index,
 *              chapters.length for the final exam, +1 for the certificate
 *   certified  the learner holds the certificate
 *   note       short mono line for the card's foot
 */
export default function CourseOutlineVisual({
  photo,
  chapters = [],
  mode = 'tour',
  current = 0,
  certified = false,
  note,
}) {
  const root = useRef(null);
  const tour = mode === 'tour';

  const rows = [
    ...chapters.map((c, i) => ({
      key: `c${i}`,
      kind: 'chapter',
      title: c.title,
      done: !!c.done,
      fraction: c.fraction || 0,
      num: pad(i + 1),
    })),
    { key: 'final', kind: 'final', title: 'Final exam', done: certified, fraction: 0 },
    { key: 'cert', kind: 'cert', title: 'Certificate', done: certified, fraction: certified ? 1 : 0 },
  ];
  const total = rows.length;
  const last = total - 1;
  const target = Math.min(Math.max(current, 0), last);

  const [motionOK, setMotionOK] = useState(false);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);
  const [rewinding, setRewinding] = useState(false);
  // The first row waits for the card to land before its rule starts.
  const [lapped, setLapped] = useState(false);
  const [step, setStep] = useState(tour ? 0 : target);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOK(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Progress mode: start at chapter 1 and climb to where the learner is.
  // Without motion, simply be there.
  useEffect(() => {
    if (tour) {
      setStep(0);
      return undefined;
    }
    if (!motionOK || target === 0) {
      setStep(target);
      return undefined;
    }
    setStep(0);
    let n = 0;
    let timer = window.setTimeout(function climb() {
      n += 1;
      setStep(n);
      if (n < target) timer = window.setTimeout(climb, CLIMB_STEP);
    }, CLIMB_DELAY);
    return () => window.clearTimeout(timer);
  }, [tour, target, motionOK]);

  // Tour mode: when the certificate's rule has filled, fade the rows, go
  // back to chapter 1 while nothing is showing, and fade them in again.
  useEffect(() => {
    if (!rewinding) return undefined;
    let back;
    const out = window.setTimeout(() => {
      setStep(0);
      back = window.setTimeout(() => setRewinding(false), 60);
    }, REWIND_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(back);
    };
  }, [rewinding]);

  // A few pixels of depth against the pointer, on the layer wrappers only.
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

  const looping = motionOK && tour;
  const held = paused || !inView || rewinding;

  const onAnimationEnd = (e) => {
    if (!looping || e.animationName !== 'lx-cov-fill') return;
    setLapped(true);
    if (step >= last) setRewinding(true);
    else setStep((s) => s + 1);
  };

  // The current row sits second in the window, so the row just finished
  // stays in view above it.
  const offset = Math.min(Math.max(step - 1, 0), Math.max(total - VISIBLE, 0));
  // Nothing lies below the certificate, so the window drops its lower fade.
  const atEnd = offset >= Math.max(total - VISIBLE, 0);
  const shown = Math.min(step + 1, chapters.length);

  const stateOf = (row, i) => {
    const done = tour ? i < step : row.done && i <= step;
    return `${done ? ' is-done' : ''}${i === step ? ' is-active' : ''}`;
  };

  const classes = [
    'lx-cov',
    tour ? 'is-tour' : 'is-progress',
    looping ? 'is-looping' : '',
    looping && !lapped ? 'is-fresh' : '',
    motionOK ? 'is-moving' : '',
    held ? 'is-held' : '',
    rewinding ? 'is-rewinding' : '',
    atEnd ? 'is-end' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={root}>
      <div className="lx-cov-photo" data-depth="8">
        <PhotoVisual photo={photo} ratio="5 / 4" />
      </div>

      <div className="lx-cov-seal-pos" data-depth="-14" aria-hidden="true">
        <div className="lx-cov-seal lx-glass">
          <svg className="lx-cov-seal-ring" viewBox="0 0 120 120">
            <defs>
              <path id="lx-cov-seal-path" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
            </defs>
            <text>
              <textPath href="#lx-cov-seal-path" textLength="268" lengthAdjust="spacing">
                Free course · Verifiable certificate ·
              </textPath>
            </text>
          </svg>
          <Award className="lx-cov-seal-icon" size={24} strokeWidth={1.4} />
        </div>
      </div>

      <div className="lx-cov-card-pos" data-depth="14" aria-hidden="true">
        <div className="lx-cov-card">
          <div className="lx-cov-head">
            <span>{tour ? 'Syllabus' : 'Your route'}</span>
            <span className="lx-cov-count tabular">
              {pad(shown)} / {pad(chapters.length)}
            </span>
          </div>

          <div className="lx-cov-window">
            <ol className="lx-cov-track" style={{ '--off': offset }} onAnimationEnd={onAnimationEnd}>
              {rows.map((row, i) => (
                <li
                  key={row.key}
                  className={`lx-cov-row is-${row.kind}${stateOf(row, i)}`}
                  style={{ '--f': row.fraction }}
                >
                  <span className="lx-cov-mark">
                    {(tour ? i < step : row.done && i <= step) ? (
                      <Check size={12} strokeWidth={2.6} />
                    ) : row.kind === 'final' ? (
                      <ClipboardCheck size={12} strokeWidth={2} />
                    ) : row.kind === 'cert' ? (
                      <Award size={13} strokeWidth={1.8} />
                    ) : (
                      <span className="tabular">{row.num}</span>
                    )}
                  </span>
                  <span className="lx-cov-name">{row.title}</span>
                  <span className="lx-cov-fill" />
                </li>
              ))}
            </ol>
          </div>

          <div className="lx-cov-foot">
            <span className="lx-cov-rule">
              <span style={{ '--p': last ? step / last : 1 }} />
            </span>
            {note && <span className="tabular">{note}</span>}
          </div>
        </div>
      </div>

      {motionOK && (
        <button
          type="button"
          className="lx-cov-toggle lx-glass"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the course preview' : 'Pause the course preview'}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
