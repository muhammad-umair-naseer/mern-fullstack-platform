import { ScrollTrigger } from 'gsap/ScrollTrigger';

// How long after the last scroll a refresh can still arrive and undo it. On a
// busy phone the footer's refresh has been seen landing a second late.
const SETTLE_MS = 2000;

// Input that means the learner has taken the scroll over.
const TAKEOVER = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

/**
 * Scrolls an element into view after a swap, and keeps it there while the
 * page settles.
 *
 * Swapping a question paper for its result (or back) changes the page height.
 * The footer answers any height change with ScrollTrigger.refresh(), and a
 * refresh puts the scroll position back where it found it, which cancels a
 * smooth scroll already in flight: the learner was left at the foot of the
 * page, thousands of pixels below their score. So the scroll starts on the
 * next frame and is re-issued after every refresh for a short while, unless
 * the learner scrolls themselves in the meantime. Presentation only. Returns
 * a cleanup.
 */
export default function bringIntoView(el, { block = 'start' } = {}) {
  if (!el || typeof el.scrollIntoView !== 'function') return () => {};

  const reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = true;
  let frame = 0;
  let timer = 0;

  const scroll = () => {
    if (!active) return;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
    // The watch runs from the latest scroll, so slow frames cannot end it
    // before a late refresh has been answered.
    window.clearTimeout(timer);
    timer = window.setTimeout(stop, SETTLE_MS);
  };

  // Two frames on: the swap has laid out, and a refresh has finished putting
  // back the page's own scroll-behavior (it switches it off while it measures).
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(scroll);
    });
  };

  function stop() {
    if (!active) return;
    active = false;
    window.cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    ScrollTrigger.removeEventListener('refresh', schedule);
    TAKEOVER.forEach((type) => window.removeEventListener(type, stop));
  }

  ScrollTrigger.addEventListener('refresh', schedule);
  TAKEOVER.forEach((type) => window.addEventListener(type, stop, { passive: true }));
  schedule();

  return stop;
}
