import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Puts a new page at the top, and puts the back button back where you were.
 *
 * A single page app keeps the same document between routes, so scroll position
 * carries over: click a course from halfway down the catalogue and you land
 * halfway down the course page. The browser never corrects this, because no
 * document was ever replaced.
 *
 * Three cases:
 *
 *   PUSH or REPLACE, no hash   go to the top, instantly
 *   any navigation with #hash  go to that element instead
 *   POP (back or forward)      put the reader back where they were
 *
 * The browser does attempt that last one itself, and gets it wrong here. It
 * restores the moment the route changes, while the page is still short: course
 * cards, tool lists and lesson bodies all arrive from the API a beat later. So
 * a reader 2,500px down the catalogue came back to 540px, which is the bottom
 * of a page that had not finished existing yet.
 *
 * Positions are therefore recorded per history entry and restored once the page
 * is actually tall enough to hold them, with a short deadline so a page that
 * never grows back simply stops trying rather than fighting the reader.
 *
 * Instant rather than smooth throughout: animating a whole page on every
 * navigation is disorienting, and it fights the arrival animations that already
 * run at the top of each page.
 */

// Module level so it survives route changes. Keyed on the history entry rather
// than the path, so two visits to the same page keep their own positions.
const positions = new Map();

const RESTORE_DEADLINE_MS = 1200;
const HASH_DEADLINE_MS = 5000;

const ScrollToTop = () => {
  const { key, pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const currentKey = useRef(key);

  // Record where the reader is, cheaply. Passive listener, rAF throttled, and
  // it only ever writes to a Map, so scrolling costs nothing extra.
  useEffect(() => {
    currentKey.current = key;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        positions.set(currentKey.current, window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);

  useEffect(() => {
    if (hash) {
      // The target may not exist yet: routes are lazy loaded, and on pages fed
      // by the API (a course page and its guide) it arrives with the data. Keep
      // looking each frame until it appears, and give up quietly at the
      // deadline rather than scrolling somewhere arbitrary.
      // Once found it is held in place while the page above it is still
      // growing (course content and images land after it), until it has stayed
      // put for a few frames; the reader scrolling takes over at once.
      let raf;
      let stable = 0;
      let userMoved = false;
      const stop = () => { userMoved = true; };
      const started = performance.now();
      const find = () => {
        if (userMoved) return;
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          const top = el.getBoundingClientRect().top;
          const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          if (Math.abs(top - offset) > 2) {
            el.scrollIntoView({ block: 'start' });
            stable = 0;
          } else if (++stable >= 20) {
            return;
          }
        }
        if (performance.now() - started < HASH_DEADLINE_MS) raf = requestAnimationFrame(find);
      };
      ['wheel', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, stop, { passive: true, once: true }));
      raf = requestAnimationFrame(find);
      return () => {
        cancelAnimationFrame(raf);
        ['wheel', 'touchstart', 'keydown'].forEach((t) => window.removeEventListener(t, stop));
      };
    }

    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return undefined;
    }

    const target = positions.get(key);
    if (!target) return undefined;

    // Keep trying until the document is tall enough to reach the old position.
    let raf;
    const started = performance.now();
    const attempt = () => {
      const reachable = document.documentElement.scrollHeight - window.innerHeight;
      if (reachable >= target) {
        window.scrollTo({ top: target, left: 0, behavior: 'instant' });
        return;
      }
      if (performance.now() - started < RESTORE_DEADLINE_MS) {
        raf = requestAnimationFrame(attempt);
      }
    };
    raf = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(raf);
  }, [key, pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
