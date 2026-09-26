import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { blogPhoto } from '../../assets/unique';
import './BlogVisual.css';

const sketch = blogPhoto;
const pad = (n) => String(n).padStart(2, '0');

/**
 * The Writing hero: a pencil sketch on a sunlit desk, with a deck of frosted
 * title cards laid over it. The front card holds while a copper rule fills,
 * then lifts off the pile and the next title comes forward; a small index of
 * topics marks which one the front card belongs to.
 *
 * The clock is the rule's own CSS animation (its animationend advances the
 * deck), so hovering, scrolling away and the pause button all stop the same
 * thing. The pause button also holds the photo's drift and sheen and the
 * index's float, so one press stills the whole visual. With reduced motion
 * the rule never runs and the deck rests on the first title.
 *
 *   posts  [{ slug, title, label, minutes }]
 */
export default function BlogVisual({ posts = [] }) {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const n = posts.length;

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

  if (!n) return null;

  const running = motionOK && inView && !paused && n > 1;
  const current = posts[active % n].label;
  const topics = posts.reduce((acc, p) => (acc.includes(p.label) ? acc : [...acc, p.label]), []);

  // Front card, the two behind it, and the one that just lifted off.
  const slots = [];
  const seen = new Set();
  const place = (offset, pos) => {
    const i = (((active + offset) % n) + n) % n;
    if (seen.has(posts[i].slug)) return;
    seen.add(posts[i].slug);
    slots.push({ post: posts[i], i, pos });
  };
  place(0, '0');
  place(1, '1');
  place(2, '2');
  if (active > 0) place(-1, 'out');
  // Render in post order and stack with z-index (see data-pos in the CSS).
  // A card that keeps its place in the DOM keeps its running transition;
  // if React moved the node, the lift-off would jump straight to its end.
  slots.sort((a, b) => a.i - b.i);

  const onAnimationEnd = (e) => {
    if (e.animationName === 'bv-progress' && running) setActive((a) => a + 1);
  };

  return (
    <div className={`bv${running ? ' is-running' : ''}${paused ? ' is-paused' : ''}`} ref={root}>
      <div className="bv-frame" aria-hidden="true">
        <div className="bv-drift">
          <img src={sketch.src} alt="" decoding="async" />
        </div>
        <span className="lx-pv-sheen" />
      </div>

      {topics.length > 1 && (
        <ul className="bv-topics lx-glass" aria-hidden="true">
          {topics.map((t) => (
            <li key={t} className={t === current ? 'is-on' : undefined}>
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="bv-deck" aria-hidden="true" onAnimationEnd={onAnimationEnd}>
        {slots.map(({ post, i, pos }) => (
          <div className="bv-card lx-glass" data-pos={pos} key={post.slug}>
            <div className="bv-card-inner">
              <p className="bv-card-meta">
                <span className="bv-card-cat">{post.label}</span>
                <span className="tabular">{post.minutes} min read</span>
              </p>
              <p className="bv-card-title">{post.title}</p>
              <p className="bv-card-foot">
                <span className="bv-rule">
                  <span className="bv-rule-fill" />
                </span>
                <span className="bv-card-count tabular">
                  {pad(i + 1)} / {pad(n)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {motionOK && n > 1 && (
        <button
          type="button"
          className="bv-toggle lx-glass"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the rotating post titles' : 'Pause the rotating post titles'}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
