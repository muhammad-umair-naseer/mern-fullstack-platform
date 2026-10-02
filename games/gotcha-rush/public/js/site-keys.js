import { cxAuth } from './cx-auth.js';

/**
 * Typing while the game sits inside the website.
 *
 * On the website the game is a frame inside the site's page. One click on the
 * page around it (a heading, the background, the announcement bar) moves the
 * keyboard to the website, and from then on this document neither sees nor
 * can recover the keys: letters simply vanish. So while the game is taking
 * typed input it tells the website (cortexis:typing), the website forwards
 * keys pressed on its page (client/src/pages/GameFrame.js), and they arrive
 * here as cortexis:key, but only from the parent window and only from the
 * website origins this game is configured for. Each one is confirmed
 * (cortexis:key-done) once applied: the website hands the keyboard back only
 * when nothing is still on its way, so a forwarded key can never land after
 * one typed straight into the game.
 */
const embedded = (() => {
  try {
    return window.self !== window.top;
  } catch (_) {
    return true;
  }
})();

let lastSent = null;

/** Tell the website whether keys pressed on its page belong to the game right now. */
export function tellSiteTyping(active) {
  if (!embedded || lastSent === Boolean(active)) return;
  lastSent = Boolean(active);
  cxAuth.ready.then((conf) => {
    for (const origin of (conf && conf.parentOrigins) || []) {
      try {
        window.parent.postMessage({ type: 'cortexis:typing', active: lastSent }, origin);
      } catch (_) {
        /* not that parent */
      }
    }
  });
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
