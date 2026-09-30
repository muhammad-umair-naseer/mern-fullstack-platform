/**
 * Decorative loops hold still while nobody is using the page.
 *
 * Every page runs a few endless CSS loops: a drifting hero photo, a sheen, a
 * floating chip, the Apply Now pulse. Each is cheap on its own, but while any
 * of them runs the browser redraws the window, blurred glass included, sixty
 * times a second for as long as the tab is open. Three seconds after the last
 * scroll, pointer, touch or key, every endless loop is marked [data-idle],
 * which index.css pauses where it stands; the next movement unmarks them.
 *
 * Only endless animations are touched, plus the few "clocks" that drive the
 * hero slideshows (a rule filling up; its animationend turns the slide), so
 * a paused clock stops its slideshow on the current slide. Entrances and the
 * certificate being drawn always finish, and loaders keep turning while a
 * tool works on a file.
 * Marking with an attribute rather than calling Animation.pause() leaves CSS
 * in charge, so rules like the marquee's pause-on-hover keep working.
 */
const IDLE_MS = 3000;
const KEEP_MOVING = '.lx-route-loading, .animate-spin, .animate-ping, .animate-pulse, .animate-bounce, [data-keep-moving]';
// The hero slideshows' clocks (components/heroes/*Visual.js).
const CLOCKS = new Set(['svx-progress', 'cv-progress', 'bv-progress', 'iv-fill', 'lx-cov-fill']);

let timer = 0;
let idle = false;
const marked = new Set();

const endlessLoops = () =>
  document.getAnimations().filter((a) => {
    const target = a.effect && a.effect.target;
    if (!target || !target.closest || a.playState !== 'running') return false;
    if (a.effect.getComputedTiming().iterations !== Infinity && !CLOCKS.has(a.animationName)) return false;
    return !target.closest(KEEP_MOVING);
  });

const settle = () => {
  idle = true;
  // JavaScript-driven ambient motion (the tools orbit) listens for these.
  window.dispatchEvent(new Event('cx:idle'));
  for (const a of endlessLoops()) {
    a.effect.target.setAttribute('data-idle', '');
    marked.add(a.effect.target);
  }
};

const wake = () => {
  clearTimeout(timer);
  timer = setTimeout(settle, IDLE_MS);
  if (!idle) return;
  idle = false;
  window.dispatchEvent(new Event('cx:active'));
  marked.forEach((el) => el.removeAttribute('data-idle'));
  marked.clear();
};

export default function startIdleMotion() {
  if (typeof document === 'undefined' || typeof document.getAnimations !== 'function') return;
  // The prerender is a headless browser: a snapshot must never carry paused loops.
  if (navigator.webdriver) return;
  document.querySelectorAll('[data-idle]').forEach((el) => el.removeAttribute('data-idle'));
  ['scroll', 'wheel', 'pointermove', 'pointerdown', 'keydown', 'touchstart', 'resize', 'focus'].forEach((type) =>
    window.addEventListener(type, wake, { passive: true, capture: true })
  );
  wake();
}
