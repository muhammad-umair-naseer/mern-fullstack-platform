import { gameUrlFor } from '../../../config.js';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../../../seo/Seo.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { api } from '../../../lib/api.js';
import ServiceArticle from '../../../components/ServiceArticle.jsx';
import { POSTS } from '../../../data/blog.generated.js';
import { parseBlogContent } from '../../../lib/blogParser.js';
import { breadcrumbs, hostedArticle } from '../../../seo/schema.js';

const GAME_CONFIG = {
  'gotcha-rush': {
    title: 'Gotcha Rush',
    port: 3001,
    tagline: 'Real-Time Code Prediction Quiz & Battle Arena',
    line: 'Predict the output',
  },
  typedash: {
    title: 'TypeDash',
    port: 4001,
    tagline: 'Real-Time Multiplayer Typing Sprint & Ghost Races',
    line: 'Race the room',
  },
  pickparty: {
    title: 'PickParty',
    port: 5001,
    tagline: 'Real-Time Multiplayer Drafting Party Game: Pick, Read, Dodge',
    line: 'Draft the room',
  },
  'sketch-and-guess': {
    title: 'Sketch & Guess',
    port: 7001,
    tagline: 'Real-Time Multiplayer Drawing & Guessing Battle Arena',
    line: 'Draw & guess',
  },
};

/*
 * Dead keys on a Mac (Option+e then e is é). On this page there is no text
 * box to compose in, so the accent is put on the next letter here and the
 * game gets the finished letter, as if it had been typed in the game
 * (games' js/typing.js; a letter's plain form is accepted there too).
 * By key position on a Mac, so only there: [combining mark, the accent on its own].
 * Shift+` and the dead keys of other systems and layouts are not guessed;
 * the browser hands over the letter they make already composed.
 */
const IS_MAC = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
const DEAD_KEYS = {
  KeyE: ['\u0301', '\u00B4'],      // acute
  Backquote: ['\u0300', '`'],       // grave
  KeyI: ['\u0302', '\u02C6'],      // circumflex
  KeyU: ['\u0308', '\u00A8'],      // diaeresis
  KeyN: ['\u0303', '\u02DC'],      // tilde
};

/* How long the frame may take before the loading state offers a way out. */
const SLOW_MS = 9000;

/*
 * Scoped styles for the game host page. They use the site tokens from
 * index.css and live here because this page owns no stylesheet of its own.
 */
const CSS = `
.gf { --gf-bar: 68px; position: relative; padding: 0 var(--gutter) 28px; }
.gf-bar { display: flex; align-items: center; gap: 16px; height: var(--gf-bar); max-width: 1360px; margin: 0 auto; }
.gf-back { display: inline-flex; align-items: center; gap: 10px; height: 40px; padding: 0 16px 0 12px; border-radius: 999px; border: 1px solid var(--line-strong); color: var(--ink); font-size: 0.9rem; font-weight: 500; text-decoration: none; transition: border-color var(--dur-base) var(--ease-out-expo), background-color var(--dur-base) var(--ease-out-expo); }
.gf-back:hover { border-color: var(--ink); background: var(--paper); }
.gf-back svg { width: 15px; height: 15px; transition: transform var(--dur-base) var(--ease-out-expo); }
.gf-back:hover svg { transform: translate3d(-3px, 0, 0); }
.gf-title { display: flex; align-items: baseline; gap: 12px; min-width: 0; margin-right: auto; }
.gf-title h1 { margin: 0; font-size: clamp(1.5rem, 1.2rem + 0.9vw, 2rem); line-height: 1; white-space: nowrap; }
.gf-title h1 em { font-style: italic; color: var(--copper); }
.gf-line { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.74rem; color: var(--ink-3); white-space: nowrap; }
.gf-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #62805A; }
.gf-dot::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; border: 1px solid #62805A; animation: gf-ring 2.2s var(--ease-out-expo) infinite; }
.gf-dot.is-wait { background: var(--copper-2); }
.gf-dot.is-wait::after { border-color: var(--copper-2); }
.gf-dot.is-off { background: #A5452F; }
.gf-dot.is-off::after { display: none; }
.gf-actions { display: flex; align-items: center; gap: 8px; }
.gf-icon { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line-strong); background: transparent; color: var(--ink); cursor: pointer; transition: border-color var(--dur-base) var(--ease-out-expo), background-color var(--dur-base) var(--ease-out-expo); }
.gf-icon:hover { border-color: var(--ink); background: var(--paper); }
.gf-icon svg { width: 17px; height: 17px; }
.gf-icon.is-spin svg { animation: gf-spin 0.8s var(--ease-out-expo); }
.gf-open { padding: 0.6rem 0.6rem 0.6rem 1.2rem; font-size: 0.9rem; }
.gf-stage { position: relative; max-width: 1360px; height: calc(100svh - var(--nav-h) - var(--gf-bar) - 28px); min-height: 560px; margin: 0 auto; border-radius: 24px; overflow: hidden; background: var(--ivory); border: 1px solid var(--glass-edge); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), var(--shadow-float); animation: gf-rise 0.9s var(--ease-out-expo) both; }
.gf-stage:fullscreen { max-width: none; height: 100vh; border-radius: 0; border: 0; }
.gf-stage:-webkit-full-screen { max-width: none; width: 100%; height: 100%; border-radius: 0; border: 0; }
.gf-stage iframe { display: block; width: 100%; height: 100%; border: 0; opacity: 0; transition: opacity 0.6s var(--ease-out-expo); }
.gf-stage.is-ready iframe { opacity: 1; }
.gf-state { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px; text-align: center; background: radial-gradient(60% 60% at 50% 45%, rgba(245, 230, 216, 0.7), rgba(250, 248, 244, 0) 70%), var(--ivory); transition: opacity 0.5s var(--ease-out-expo), visibility 0.5s; }
.gf-state.is-gone { opacity: 0; visibility: hidden; pointer-events: none; }
.gf-mark { position: relative; width: 76px; height: 76px; display: grid; place-items: center; }
.gf-mark::before, .gf-mark::after { content: ""; position: absolute; inset: -14px; border-radius: 50%; border: 1px solid rgba(184, 97, 46, 0.35); animation: gf-ring 2s var(--ease-out-expo) infinite; }
.gf-mark::after { animation-delay: 1s; border-color: rgba(22, 19, 15, 0.14); }
.gf-mark svg { width: 64px; height: 64px; border-radius: 18px; box-shadow: 0 18px 36px -16px rgba(22, 19, 15, 0.55); animation: gf-float 3.2s var(--ease-in-out) infinite; }
.gf-mark .gf-cursor { animation: gf-blink 1.1s steps(1) infinite; }
.gf-state h2 { margin: 6px 0 0; font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.8rem); line-height: 1.05; }
.gf-state p { margin: 0; max-width: 40ch; font-size: 0.95rem; color: var(--ink-3); }
.gf-state code { white-space: nowrap; font-family: var(--font-mono); font-size: 0.82rem; padding: 3px 8px; border-radius: 6px; background: var(--sand); color: var(--ink); }
.gf-bar-load { width: 160px; height: 2px; margin-top: 6px; border-radius: 2px; background: rgba(22, 19, 15, 0.08); overflow: hidden; }
.gf-bar-load i { display: block; width: 40%; height: 100%; background: var(--copper-2); animation: gf-slide 1.4s var(--ease-in-out) infinite; }
.gf-state-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 22px; margin-top: 8px; }
.gf-off svg.gf-plug { width: 88px; height: 88px; }
.gf-off .gf-plug .gf-spark { animation: gf-blink 1.6s steps(1) infinite; }
/* the game's own guide, read under the game */
.gf .svd-article { padding-top: clamp(3rem, 2rem + 4vw, 5.5rem); }
.gf .svd-article-cover { display: none; } /* a picture of the game, right under the game itself: kept for sharing only */
.gf-missing { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 48px var(--gutter); text-align: center; }
.gf-missing h1 { margin: 0; font-size: var(--text-h2); }
.gf-missing p { margin: 0 0 8px; color: var(--ink-3); }
@keyframes gf-rise { from { opacity: 0; transform: translate3d(0, 18px, 0); } to { opacity: 1; transform: none; } }
@keyframes gf-ring { from { opacity: 0.55; transform: scale(0.7); } to { opacity: 0; transform: scale(1.6); } }
@keyframes gf-float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -6px, 0); } }
@keyframes gf-blink { 50% { opacity: 0; } }
@keyframes gf-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes gf-slide { from { transform: translateX(-110%); } to { transform: translateX(260%); } }
@media (max-width: 720px) {
  .gf { --gf-bar: 60px; padding: 0 10px 10px; }
  .gf-bar { gap: 8px; padding: 0 4px; }
  .gf-back { width: 40px; padding: 0; justify-content: center; }
  .gf-back span, .gf-line-text, .gf-open-label { display: none; }
  .gf-title h1 { font-size: 1.45rem; }
  .gf-open { width: 40px; height: 40px; min-height: 0; padding: 0; }
  .gf-open .lx-btn-disc { margin: 0; background: transparent; color: var(--ivory); }
  .gf-stage { height: calc(100svh - var(--nav-h) - var(--gf-bar) - 10px); min-height: 520px; border-radius: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .gf *, .gf *::before, .gf *::after { animation: none !important; transition-duration: 0.01ms !important; }
}
`;

function GameMark({ gameId }) {
  if (gameId === 'gotcha-rush') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#16130F" />
        <path d="M10 10l6 6-6 6" fill="none" stroke="#FAF8F4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path className="gf-cursor" d="M17.5 22.5h5.5" stroke="#B8612E" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (gameId === 'pickparty') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#16130F" />
        <rect x="7" y="5" width="18" height="23" rx="3" fill="#FAF8F4" transform="rotate(-8 16 16.5)" />
        <circle cx="16" cy="15.5" r="4.2" fill="#B8612E" />
      </svg>
    );
  }
  if (gameId === 'sketch-and-guess') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#16130F" />
        <path d="M9 22l3-1 11-11-2-2-11 11-1 3z" fill="#FAF8F4" />
        <path d="M20 9l3 3" stroke="#FAF8F4" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="23" r="1.8" fill="#B8612E" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#16130F" />
      <path d="M8 20h10M8 15h16M8 10h7" stroke="#FAF8F4" strokeWidth="2.2" strokeLinecap="round" />
      <path className="gf-cursor" d="M22 19v4" stroke="#B8612E" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function GameFrame() {
  const { gameId } = useParams();
  const iframeRef = useRef(null);
  const stageRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [spin, setSpin] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // The game's own height (it reports it: cortexis:size), so the frame is
  // never shorter than the game and only this page scrolls; the stage's CSS
  // height is still the floor. Full screen keeps the screen's height instead.
  const [gameHeight, setGameHeight] = useState(0);

  const config = GAME_CONFIG[gameId];
  const gameUrl = config ? gameUrlFor(config.port) : '';
  const gameOrigin = gameUrl ? new URL(gameUrl).origin : '';

  /*
   * Sign-in bridge. A visitor signed in here is signed in to the game too:
   * trade the site session for a 10-minute game token and post it to the
   * frame, only ever to the game's exact origin. The game asks again with
   * cortexis:need-token whenever it wants one; a site sign-out is passed on.
   */
  const { user } = useAuth();
  const tokenRef = useRef(null);            // { token, until, userId }
  const minting = useRef(null);             // the request in flight: a load and the game's ask share it
  const wasSignedIn = useRef(false);
  const signedInAs = useRef(null);          // the current user id, for answers that arrive late
  signedInAs.current = user ? user.id : null;
  const postToGame = useCallback((message) => {
    const win = iframeRef.current && iframeRef.current.contentWindow;
    if (win && gameOrigin) win.postMessage(message, gameOrigin);
  }, [gameOrigin]);
  const sendToken = useCallback(async () => {
    if (!user) return;
    try {
      let t = tokenRef.current;
      if (!t || t.userId !== user.id || t.until - Date.now() < 60000) {
        if (!minting.current) {
          const userId = user.id;
          minting.current = api('/auth/game-token', { method: 'POST' })
            .then((res) => ({ token: res.token, until: Date.now() + res.expiresIn * 1000, userId }))
            .finally(() => { minting.current = null; });
        }
        t = await minting.current;
        if (t.userId !== signedInAs.current) return;   // signed out, or in as someone else, meanwhile
        tokenRef.current = t;
      }
      postToGame({ type: 'cortexis:game-token', token: t.token });
    } catch {
      /* no token: the game still offers its own sign-in and guest play */
    }
  }, [user, postToGame]);
  // Whether the game is taking typed input right now (it says so: cortexis:typing),
  // and how many forwarded keys it has not yet confirmed (cortexis:key-done).
  const gameTyping = useRef(false);
  const keysInFlight = useRef(0);
  const deadKey = useRef(null); // the accent of a dead key pressed last, waiting for its letter
  // The game asks for a part of itself (a band of its own document, in px
  // from its top) to be in view: at a countdown, the passage. Scroll this
  // page the least that puts the band between the navbar and the bottom.
  const reveal = useCallback(({ top, bottom }) => {
    const frame = iframeRef.current;
    if (!frame || document.fullscreenElement || document.webkitFullscreenElement) return;
    const r = frame.getBoundingClientRect();
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;
    const y1 = r.top + Number(top);
    const y2 = r.top + Number(bottom);
    if (!(y2 > y1)) return;
    let by = 0;
    if (y2 > window.innerHeight - 16) by = y2 - window.innerHeight + 16;
    if (y1 - by < navH + 16) by = y1 - navH - 16;   // the top of the band wins over its bottom
    if (Math.abs(by) > 2) window.scrollBy({ top: by, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== gameOrigin || !iframeRef.current || e.source !== iframeRef.current.contentWindow) return;
      setIsLoaded(true);
      setHasError(false);
      if (e.data && e.data.type === 'cortexis:need-token') sendToken();
      if (e.data && e.data.type === 'cortexis:size') {
        const h = Math.ceil(Number(e.data.height));
        if (h > 0 && h <= 1400) setGameHeight(h);
      }
      if (e.data && e.data.type === 'cortexis:reveal') reveal(e.data);
      if (e.data && e.data.type === 'cortexis:typing') {
        gameTyping.current = Boolean(e.data.active);
        deadKey.current = null;   // an accent left over from the last race is not put on this one
        keysInFlight.current = 0; // a fresh start: a lost confirmation cannot keep the keyboard here
      }
      if (e.data && e.data.type === 'cortexis:key-done') {
        keysInFlight.current = Math.max(0, keysInFlight.current - 1);
        // every forwarded key has landed: the next one can go straight to the game.
        // Only when the frame lacks the focus: focusing it again blurs and
        // refocuses the game's input, which shows its "click to keep typing" cover.
        if (keysInFlight.current === 0 && gameTyping.current && document.activeElement !== iframeRef.current) iframeRef.current.focus();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [gameOrigin, sendToken, reveal]);

  /*
   * Keys pressed on this page belong to the game while it is taking typed
   * input. One click on the page around the frame moves the keyboard here,
   * where the game can neither see nor recover the keys, and the letters a
   * player types next would simply vanish. So each one is forwarded to the
   * game (games' js/site-keys.js), in order, and once the game has confirmed
   * every forwarded key the frame takes the focus back, which puts the next
   * key straight into the game; nothing can overtake a key still on its way.
   * Space no longer scrolls the page or presses a button here mid-race; form
   * fields are left alone.
   */
  useEffect(() => {
    if (!gameOrigin) return undefined;
    const forward = (frame, key) => {
      keysInFlight.current += 1;
      frame.contentWindow.postMessage({ type: 'cortexis:key', key }, gameOrigin);
    };
    const onKey = (e) => {
      const frame = iframeRef.current;
      if (!gameTyping.current || !frame || !frame.contentWindow) return;
      // Option types letters on a Mac (Option+2 is ™) and AltGr arrives as
      // Ctrl+Alt on Windows: only Cmd, Ctrl without Alt, or Alt alone off a
      // Mac (Alt+D, Alt+F, access keys) is a shortcut.
      if (e.metaKey || (e.ctrlKey && !e.altKey) || (e.altKey && !e.ctrlKey && !IS_MAC) || e.isComposing) return;
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Dead') {
        deadKey.current = (IS_MAC && !e.shiftKey && DEAD_KEYS[e.code]) || [];
        return;
      }
      if (e.key !== 'Backspace' && e.key !== 'Enter' && e.key.length !== 1) return;
      e.preventDefault();
      const accent = deadKey.current;
      deadKey.current = null;
      if (!accent || e.key === 'Enter') return forward(frame, e.key);
      if (e.key === 'Backspace') return;                          // it takes back the accent, as in a text box
      if (e.key === ' ') return accent[1] && forward(frame, accent[1]); // the accent on its own, when it is known
      const one = (e.key + (accent[0] || '')).normalize('NFC');
      if (!accent[0] || e.key.normalize('NFD').length > 1) forward(frame, e.key); // the browser composed it already
      else if (one.length === 1) forward(frame, one);
      else { forward(frame, accent[1]); forward(frame, e.key); }   // no such letter: both, as macOS types them
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [gameOrigin]);

  // Ask the game server whether it is up. An opaque no-cors request resolves
  // whenever anything answers and rejects when nothing is listening, which is
  // the one thing an iframe's load event cannot tell us.
  useEffect(() => {
    if (!config) return undefined;
    if (!gameUrl) { setHasError(true); return undefined; }
    setIsLoaded(false);
    setHasError(false);
    setIsSlow(false);
    let cancelled = false;
    let kill = null;

    const probe = () => {
      fetch(`${gameUrl}/healthz?_t=${Date.now()}`, { mode: 'no-cors' })
        .then(() => {
          if (!cancelled) {
            if (kill) clearTimeout(kill);
            setHasError(false);
          }
        })
        .catch(() => {
          // Cross-port opaque fetches may be restricted by some browser configurations;
          // allow the iframe's own load or the fallback timeout to determine true offline status.
        });
    };

    kill = setTimeout(() => {
      if (!cancelled) {
        setHasError(true);
      }
    }, 8000);

    probe();

    const slow = setTimeout(() => {
      if (!cancelled) setIsSlow(true);
    }, SLOW_MS);

    return () => {
      cancelled = true;
      if (kill) clearTimeout(kill);
      clearTimeout(slow);
    };
  }, [gameId, gameUrl, attempt, config]);

  // iPhone Safari has no element full screen, so the button only shows where it works
  const [canFullscreen, setCanFullscreen] = useState(false);
  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled));
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      wasSignedIn.current = true;
      if (isLoaded) sendToken();
    } else if (wasSignedIn.current) {
      wasSignedIn.current = false;
      tokenRef.current = null;
      postToGame({ type: 'cortexis:signed-out' });
    }
  }, [user, isLoaded, sendToken, postToGame]);

  const handleReload = useCallback(() => {
    setSpin(false);
    requestAnimationFrame(() => setSpin(true));
    gameTyping.current = false;
    keysInFlight.current = 0;
    setGameHeight(0);
    setAttempt((n) => n + 1);   // a new key remounts the iframe, which reloads the game
  }, []);

  const toggleFullscreen = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const inFull = document.fullscreenElement || document.webkitFullscreenElement;
    const call = (fn, target) => { if (!fn) return; const r = fn.call(target); if (r && r.catch) r.catch(() => {}); };
    if (!inFull) call(stage.requestFullscreen || stage.webkitRequestFullscreen, stage);
    else call(document.exitFullscreen || document.webkitExitFullscreen, document);
  };

  if (!config) {
    return (
      <main className="gf-missing">
        <style>{CSS}</style>
        <span className="lx-label">Playground</span>
        <h1>No game <em>here.</em></h1>
        <p>That game does not exist.</p>
        <Link to="/games" className="btn lx-btn">
          Back to the playground
          <span className="lx-btn-disc" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </Link>
      </main>
    );
  }

  const GAME_ARTICLE_SLUG = {
    'gotcha-rush': 'gotcha-rush-guess-the-output-game',
    typedash: 'typedash-online-typing-race-game',
    pickparty: 'pickparty-online-drafting-party-game',
    'sketch-and-guess': 'sketch-and-guess-online-drawing-game',
  };
  const path = `/games/${gameId}`;
  const article = POSTS.find((p) => p.slug === GAME_ARTICLE_SLUG[gameId] || p.home === path);
  const schema = [
    breadcrumbs([
      { name: 'Home', path: '/' },
      { name: 'Games', path: '/games' },
      { name: config.title, path },
    ]),
    ...(article ? hostedArticle(article, path, parseBlogContent(article.body).faqs) : []),
  ];
  const ready = isLoaded && !hasError;
  const dot = hasError ? 'is-off' : ready ? '' : 'is-wait';

  return (
    <main className="gf">
      <style>{CSS}</style>
      <Seo
        title={`${config.title} | Cortexis Playground`}
        description={article ? article.description : config.tagline}
        path={path}
        image={article?.image}
        schema={schema}
      />

      <div className="gf-bar">
        <Link to="/games" className="gf-back" title="Back to the playground">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>Playground</span>
        </Link>

        <div className="gf-title">
          <h1>{config.title}</h1>
          <span className="gf-line">
            <i className={`gf-dot ${dot}`} aria-hidden="true" />
            <span className="gf-line-text">{hasError ? 'Network error' : ready ? config.line : 'Connecting'}</span>
          </span>
        </div>

        <div className="gf-actions">
          <button type="button" onClick={handleReload} className={`gf-icon ${spin ? 'is-spin' : ''}`} title="Reload the game" aria-label="Reload the game" onAnimationEnd={() => setSpin(false)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.2h-3.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {canFullscreen && <button type="button" onClick={toggleFullscreen} className="gf-icon" title={isFullscreen ? 'Exit full screen' : 'Full screen'} aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}>
            {isFullscreen ? (
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 3.5V8H3.5M12 3.5V8h4.5M8 16.5V12H3.5M12 16.5V12h4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 8V3.5H8M16.5 8V3.5H12M3.5 12v4.5H8M16.5 12v4.5H12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </button>}
          <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="btn lx-btn gf-open" title="Open in a new tab">
            <span className="gf-open-label">Open in a tab</span>
            <span className="lx-btn-disc" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>
        </div>
      </div>

      <div className={`gf-stage ${ready ? 'is-ready' : ''}`} ref={stageRef} style={gameHeight && !isFullscreen ? { minHeight: `${gameHeight}px` } : undefined}>
        <div className={`gf-state ${ready || hasError ? 'is-gone' : ''}`} role="status" aria-live="polite">
          <div className="gf-mark"><GameMark gameId={gameId} /></div>
          <h2>{config.title}</h2>
          <div className="gf-bar-load" aria-hidden="true"><i /></div>
          {isSlow && <p>Still starting. If it stays here, reload or open it in a tab.</p>}
        </div>

        {hasError && (
          <div className="gf-state gf-off" role="alert">
            <svg className="gf-plug" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r="40" fill="#F5E6D8" />
              <path d="M22 50h12a6 6 0 0 0 6-6v-6H28v6a6 6 0 0 0-6 6z" fill="#16130F" />
              <path d="M31 38v-7M37 38v-7" stroke="#16130F" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M66 38H54a6 6 0 0 0-6 6v6h12v-6a6 6 0 0 0 6-6z" fill="none" stroke="#16130F" strokeWidth="2.4" strokeLinejoin="round" />
              <path className="gf-spark" d="M44 28l-2 6h4l-2 6" fill="none" stroke="#B8612E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 50c-5 0-8 3-8 8M70 38c5 0 8-3 8-8" fill="none" stroke="#16130F" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <h2>Unable to <em>connect.</em></h2>
            <p>Could not connect to the game server. Please check your network connection and try again.</p>
            <div className="gf-state-actions">
              <button type="button" onClick={handleReload} className="btn lx-btn">
                Try again
                <span className="lx-btn-disc" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 20 20"><path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.2h-3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
              <Link to="/games" className="lx-link">Back to the playground</Link>
            </div>
          </div>
        )}

        <iframe
          key={attempt}
          ref={iframeRef}
          src={gameUrl || 'about:blank'}
          title={config.title}
          allow="autoplay; fullscreen; clipboard-read; clipboard-write; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => setHasError(true)}
        />
      </div>

      {article && <ServiceArticle post={article} label={`About ${config.title}`} />}
    </main>
  );
}
