import { cxAuth } from './cx-auth.js';

/**
 * Living inside the website's frame.
 *
 * On the website the game is a frame inside the site's page
 * (client/src/pages/GameFrame.js). Three things only the site can do for it:
 *
 * Keys. One click on the page around the game (a heading, the background,
 * the announcement bar) moves the keyboard to the website, and from then on
 * this document neither sees nor can recover the keys: letters simply
 * vanish. So while the game is taking typed input it tells the website
 * (cortexis:typing), the website forwards keys pressed on its page, and they
 * arrive here as cortexis:key, but only from the parent window and only from
 * the website origins this game is configured for. Each one is confirmed
 * (cortexis:key-done) once applied: the website hands the keyboard back only
 * when nothing is still on its way, so a forwarded key can never land after
 * one typed straight into the game.
 *
 * Height. The frame is as tall as the site's viewport allows, which on a
 * laptop is shorter than a race screen, so the bottom of the game sat cut
 * off behind a second scrollbar of its own. The game reports its height
 * (cortexis:size) and the site makes the frame that tall: one page, one
 * scroll, nothing hidden.
 *
 * Reveal. The site cannot know where the passage is inside the frame, so at
 * a countdown the game asks (cortexis:reveal) and the site scrolls its page,
 * once and only as far as needed, until that part of the frame is in view.
 */
const embedded = (() => {
  try {
    return window.self !== window.top;
  } catch (_) {
    return true;
  }
})();

/** Post to the website, whichever of its configured origins is the parent. */
function toSite(message) {
  cxAuth.ready.then((conf) => {
    for (const origin of (conf && conf.parentOrigins) || []) {
      try {
        window.parent.postMessage(message, origin);
      } catch (_) {
        /* not that parent */
      }
    }
  });
}

let lastSent = null;

/** Tell the website whether keys pressed on its page belong to the game right now. */
export function tellSiteTyping(active) {
  if (!embedded || lastSent === Boolean(active)) return;
  lastSent = Boolean(active);
  toSite({ type: 'cortexis:typing', active: lastSent });
}

/** Call `handler(key)` for each key the website forwards: one character, 'Backspace' or 'Enter'. */
export function onSiteKey(handler) {
  if (!embedded) return;
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object' || d.type !== 'cortexis:key' || typeof d.key !== 'string') return;
    if (e.source !== window.parent) return;
    if (d.key !== 'Backspace' && d.key !== 'Enter' && d.key.length !== 1) return;
    cxAuth.ready.then((conf) => {
      if (!((conf && conf.parentOrigins) || []).includes(e.origin)) return;
      handler(d.key);
      e.source.postMessage({ type: 'cortexis:key-done' }, e.origin);
    });
  });
}

/** Ask the website to scroll its page, if it must, until this element is in view. */
export function revealToSite(el) {
  if (!embedded || !el) return;
  const r = el.getBoundingClientRect();
  toSite({ type: 'cortexis:reveal', top: r.top + window.scrollY, bottom: r.bottom + window.scrollY });
}

/*
 * Keep the website's frame as tall as this document. The stylesheets stop
 * sizing screens from the viewport's height while html carries "embedded"
 * (a frame that grew with its content would otherwise chase itself upwards,
 * and the game froze while it did), so the height reported here is the
 * content's own. MAX_HEIGHT is a last guard; a change under 4px is noise.
 */
const MAX_HEIGHT = 1400;
let lastHeight = 0;
let pending = 0;

function reportSize() {
  const doc = document.documentElement;
  const height = Math.min(MAX_HEIGHT, Math.ceil(Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0)));
  if (Math.abs(height - lastHeight) <= 4) return;
  lastHeight = height;
  toSite({ type: 'cortexis:size', height });
}

if (embedded) {
  document.documentElement.classList.add('embedded');
  const schedule = () => {
    if (pending) return;
    pending = requestAnimationFrame(() => { pending = 0; reportSize(); });
  };
  const start = () => {
    reportSize();
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(document.documentElement);
    window.addEventListener('load', schedule);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
