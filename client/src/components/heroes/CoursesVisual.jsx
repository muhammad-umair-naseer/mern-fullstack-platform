import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Award, Pause, Play } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { coursesPhoto } from '../../assets/unique';
import { courseCover } from '../../data/courseCovers';
import './CoursesVisual.css';
import Photo from '../Photo.jsx';

gsap.registerPlugin(useGSAP);

// Warm tints keyed off the `accent` each course file declares, so covers that
// sit side by side still read as different books without leaving the palette.
const TINTS = {
  violet: '#DDD3C8',
  sky: '#D6DDD5',
  emerald: '#CFD9C3',
  amber: '#ECD6AE',
  fuchsia: '#EAD2C4',
  rose: '#E0BEA9',
  cyan: '#CAD7D0',
  indigo: '#D3CCC1',
  orange: '#E9C8A5',
};

const STOP = /^(the|and|for|with|of|to|a|an)$/i;

/**
 * Monogram for a cover: two initials ("Data Structures & Algorithms" -> "DS"),
 * or the language itself when the title opens with one that initials would
 * lose ("C++ Development" -> "C++").
 */
export const monogram = (title = '') => {
  const words = title
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w) && !STOP.test(w));
  if (words[0] && /^[A-Za-z]{1,2}(\+\+|#)$/.test(words[0])) return words[0];
  return words
    .slice(0, 2)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, '')[0].toUpperCase())
    .join('');
};

const pad = (n) => String(n).padStart(2, '0');

// The fan's running order: one course from each category in turn, so the
// covers side by side are different subjects (the catalogue order keeps a
// subject's courses together, so it would open on a hand of AI courses).
// Each keeps its catalogue number.
const dealOrder = (courses) => {
  const shelves = new Map();
  courses.forEach((course, i) => {
    const key = course.category || '';
    if (!shelves.has(key)) shelves.set(key, []);
    shelves.get(key).push({ course, number: i + 1 });
  });
  const piles = [...shelves.values()];
  const out = [];
  for (let round = 0; out.length < courses.length; round += 1) {
    piles.forEach((pile) => {
      if (pile[round]) out.push(pile[round]);
    });
  }
  return out;
};

/**
 * A course cover in the house edition style: a warm tint, a copper hairline
 * frame, and the category and catalogue number in mono. The portrait form
 * (the hero's fan) carries the course's photograph and title; the wide form
 * (the grid, for a course that has no photograph yet) sets the monogram
 * large in the italic serif and leaves the title to the card below it.
 * Always decorative: the title is said elsewhere.
 *
 *   course   { slug, coverKey, title, category, accent }
 *   number   catalogue number shown as "Nº 07" (optional)
 *   wide     landscape form for the grid
 *   children anything for the foot of the portrait cover
 */
export function CourseCover({ course, number, wide = false, children }) {
  const photo = wide ? null : courseCover(course.slug) || courseCover(course.coverKey);
  return (
    <div
      className={`cv-cover${wide ? ' cv-cover--wide' : ''}${photo ? ' has-photo' : ''}`}
      style={{ '--tint': TINTS[course.accent] || TINTS.violet }}
      aria-hidden="true"
    >
      <span className="cv-cover-top">
        <span className="cv-cover-cat">{course.category}</span>
        {number != null && <span className="tabular">Nº {pad(number)}</span>}
      </span>
      {photo ? (
        <span className="cv-cover-photo">
          <Photo src={photo.src} srcSet={photo.srcSet} avifSrcSet={photo.avifSrcSet} sizes="(max-width: 760px) 30vw, 12vw" alt="" decoding="async" />
        </span>
      ) : (
        <span className="cv-cover-mark">{monogram(course.title)}</span>
      )}
      {!wide && <span className="cv-cover-title">{course.title}</span>}
      {children}
    </div>
  );
}

/**
 * The Courses hero: a student at a sunlit table, and laid over the photo a
 * fan of five course covers, each with its own photograph, held like a hand
 * of cards. The fan deals open on
 * arrival; then a copper rule fills along the front cover and the whole fan
 * turns one place, the left-most cover dropping away and the next course
 * coming in from the right. A chip carries the catalogue count and a slowly
 * turning seal says what finishing earns.
 *
 * The clock is the rule's own CSS animation (its animationend turns the fan),
 * so hovering the fan, scrolling it out of view and the pause button all stop
 * the same thing. Hovering also spreads the hand a little. On fine pointers
 * the layers shift a few pixels against the cursor. With reduced motion the
 * fan rests, open, on the first course.
 *
 *   courses  [{ slug, title, category, accent, chapterCount }] in catalogue order
 *   total    number for the count chip
 */
export default function CoursesVisual({ courses = [], total }) {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const deck = useMemo(() => dealOrder(courses), [courses]);
  const n = deck.length;

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

  // A few pixels of depth against the pointer. GSAP moves the layer
  // wrappers only; everything inside keeps its own CSS animation.
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

  const running = motionOK && inView && !paused && n > 1;

  // Warm the photographs of the next two covers to come in from the right,
  // so a cover never arrives with an empty window.
  useEffect(() => {
    if (!running) return;
    [3, 4].forEach((k) => {
      const { course } = deck[(active + k) % n];
      const photo = courseCover(course.slug) || courseCover(course.coverKey);
      if (photo) new Image().src = photo.src;
    });
  }, [active, deck, n, running]);

  // The hand: the front cover, two either side, and the one that just
  // dropped off the left. Keys are positions on an endless strip (not
  // indexes into the list), so every cover keeps its DOM node and its
  // running transition as the fan turns, and a course that comes round
  // again arrives as a fresh card.
  const slots = [];
  if (n) {
    const seen = new Set();
    const place = (offset, pos) => {
      const v = active + offset;
      const i = ((v % n) + n) % n;
      if (seen.has(i)) return;
      seen.add(i);
      slots.push({ v, i, pos, deal: Math.abs(offset) });
    };
    place(0, '0');
    place(1, '1');
    place(-1, '-1');
    place(2, '2');
    place(-2, '-2');
    if (active > 0) place(-3, 'out');
    slots.sort((a, b) => a.v - b.v);
  }

  const onAnimationEnd = (e) => {
    if (e.animationName === 'cv-progress' && running) setActive((a) => a + 1);
  };

  return (
    <div
      className={`cv${active === 0 ? ' is-fresh' : ''}${running ? ' is-running' : ''}${paused ? ' is-paused' : ''}`}
      ref={root}
    >
      <div className="cv-layer cv-layer--photo" data-depth="8">
        <div className="cv-frame" aria-hidden="true">
          <div className="cv-drift">
            <Photo src={coursesPhoto.src} srcSet={coursesPhoto.srcSet} avifSrcSet={coursesPhoto.avifSrcSet} sizes="(max-width: 760px) 80vw, 34vw" alt="" decoding="async" />
          </div>
          <span className="lx-pv-sheen" />
        </div>
      </div>

      <div className="cv-layer cv-layer--count" data-depth="-16" aria-hidden="true">
        <p className="cv-count lx-glass">
          <span className="cv-count-value tabular">{total}</span>
          <span className="cv-count-label">free courses</span>
        </p>
      </div>

      <div className="cv-layer cv-layer--seal" data-depth="14" aria-hidden="true">
        <div className="cv-seal lx-glass">
          <svg className="cv-seal-ring" viewBox="0 0 120 120">
            <defs>
              <path id="cv-seal-path" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
            </defs>
            <text>
              <textPath href="#cv-seal-path" textLength="268" lengthAdjust="spacing">
                Verifiable certificate · Free course ·
              </textPath>
            </text>
          </svg>
          <Award className="cv-seal-icon" size={26} strokeWidth={1.4} />
        </div>
      </div>

      {n > 0 && (
        <div className="cv-layer cv-layer--fan" data-depth="-10">
          <div className="cv-fan" aria-hidden="true" onAnimationEnd={onAnimationEnd}>
            {slots.map(({ v, i, pos, deal }) => {
              const { course: c, number } = deck[i];
              return (
                <div className="cv-card" data-pos={pos} key={v} style={{ '--d': deal }}>
                  <CourseCover course={c} number={number}>
                    <span className="cv-cover-foot">
                      <span className="cv-rule">
                        <span className="cv-rule-fill" />
                      </span>
                      <span className="tabular">{c.chapterCount} chapters</span>
                    </span>
                  </CourseCover>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {motionOK && n > 1 && (
        <button
          type="button"
          className="cv-toggle lx-glass"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the turning course covers' : 'Pause the turning course covers'}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
