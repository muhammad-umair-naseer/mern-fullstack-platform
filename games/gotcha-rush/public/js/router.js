import { ROUTES, NOT_FOUND, match, normalize, indexOf, resolveHash } from './routes.js';

/**
 * History API router for the page shell.
 *
 * Every destination is a <section class="page"> inside #pages. A route change
 * swaps sections in the same document, so the WebSocket, a waiting lobby and
 * a Solo Rush engine all live on. With the View Transitions API the old page
 * leaves and the new one arrives in the direction of travel (nav order) while
 * the header stays put and the nav ink slides to the new item; without it the
 * new page plays a CSS entrance. Focus moves to the new page's heading, new
 * pages start at the top, and back/forward restore where you were.
 *
 * The arena is not a route. While a match runs (`isLocked()`), links are inert
 * and back/forward only move the page underneath, which `refresh()` shows
 * again when the match is left.
 */
const STATIC = /^\/(api|js|css|img|shared)\//;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createRouter({ onEnter = () => {}, onCode = () => {}, isLocked = () => false, savedTab = () => null } = {}) {
  const sections = new Map([...ROUTES, NOT_FOUND].map((r) => [r, document.getElementById(r.id)]));
  const topbar = document.querySelector('.topbar');
  const navToggle = document.getElementById('nav-toggle');
  const html = document.documentElement;
  let current = null;
  let vtSeq = 0;
  let activeVT = null;
  let pressAt = null;
  // While a page change plays, Chrome hit-tests the whole page as <html>, so a quick second click would
  // be lost. A press finishes the change at once, and the click goes to whatever is under the pointer.
  document.addEventListener('pointerdown', (e) => {
    if (!activeVT) return;
    activeVT.skipTransition();
    pressAt = [e.clientX, e.clientY];
  }, true);
  document.addEventListener('click', (e) => {
    if (!pressAt) return;
    const [x, y] = pressAt;
    pressAt = null;
    if (e.target !== html || !e.isTrusted) return;
    const el = document.elementFromPoint(x, y);
    if (!el || el === html || el === document.body) return;
    e.stopPropagation();
    el.click();
  }, true);
  let saveTimer = 0;

  try { history.scrollRestoration = 'manual'; } catch (_) { /* old browser */ }

  const routeFor = (pathname) => match(pathname) || NOT_FOUND;
  const headingOf = (route) => sections.get(route)?.querySelector('h1');
  const state = () => (history.state && typeof history.state === 'object' ? history.state : {});

  function markNav(route) {
    for (const a of document.querySelectorAll('.nav a, .sheet-nav a, .foot-links a[href^="/"], a.acct-signin')) {
      if (route.path !== null && normalize(a.pathname) === route.path && !a.dataset.flash) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    document.body.dataset.route = route.key;
  }

  function swap(route, scroll) {
    for (const [r, el] of sections) if (el) el.hidden = r !== route;
    current = route;
    markNav(route);
    if (route === NOT_FOUND) {
      const p = document.getElementById('nf-path');
      if (p) p.textContent = JSON.stringify(location.pathname.slice(0, 40));
    }
    if (isLocked()) return;   // the arena keeps its own scroll and title
    document.title = route.title;
    window.scrollTo(0, scroll || 0);
  }

  function flashTarget(selector, focus) {
    const el = document.querySelector(selector);
    if (!el || !el.offsetParent) return;
    const r = el.getBoundingClientRect();
    if (r.top < 72 || r.bottom > window.innerHeight - 8) el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    if (focus) el.focus({ preventScroll: true });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1400);
  }

  function render(route, { scroll = 0, animate = false, focus = false, flash = null, initial = false } = {}) {
    const from = current;
    const section = sections.get(route);
    const enter = () => {
      onEnter(route, section, { initial, from });
      if (focus && !flash) headingOf(route)?.focus({ preventScroll: true });
    };
    const after = () => { if (flash) flashTarget(flash, focus); };

    if (!animate || !from || from === route || isLocked()) {
      swap(route, scroll);
      enter();
      after();
      return;
    }
    const dir = indexOf(route) >= indexOf(from) ? 'forward' : 'back';
    const oldEl = sections.get(from);

    if (typeof document.startViewTransition === 'function' && document.visibilityState === 'visible') {
      const seq = ++vtSeq;
      html.dataset.vt = dir;
      oldEl.style.viewTransitionName = 'page-out';
      try {
        const vt = document.startViewTransition(() => {
          oldEl.style.viewTransitionName = '';
          swap(route, scroll);
          section.style.viewTransitionName = 'page-in';
          enter();
        });
        activeVT = vt;
        vt.finished.catch(() => {}).finally(() => {
          if (activeVT === vt) activeVT = null;
          section.style.viewTransitionName = '';
          oldEl.style.viewTransitionName = '';
          if (seq === vtSeq) { delete html.dataset.vt; after(); }
        });
        return;
      } catch (_) {
        oldEl.style.viewTransitionName = '';
        delete html.dataset.vt;
      }
    }
    // no View Transitions: the new page plays its own entrance
    swap(route, scroll);
    section.dataset.dir = dir;
    section.classList.remove('page-enter');
    void section.offsetWidth;
    section.classList.add('page-enter');
    section.addEventListener('animationend', function done(e) {
      if (e.target !== section) return;
      section.classList.remove('page-enter');
      section.removeEventListener('animationend', done);
    });
    enter();
    after();
  }

  function saveScroll() {
    try { history.replaceState({ ...state(), scroll: window.scrollY }, ''); } catch (_) { /* throttled */ }
  }

  /** Navigate to a path (optionally with a #hash); `flash` is a selector to point at once the page is up. */
  function go(href, { replace = false, flash = null } = {}) {
    const url = new URL(href, location.href);
    const hash = resolveHash(url.hash, savedTab());
    if (hash && !hash.code) return go(hash.path, { replace, flash: flash || hash.flash || null });
    const route = hash && hash.code ? routeFor('/play-with-friends') : routeFor(url.pathname);
    const target = `${route.path || url.pathname}${hash && hash.code ? `#${hash.code}` : ''}`;
    if (hash && hash.code) onCode(hash.code);

    if (route === current && !replace) {
      if (location.pathname + location.hash !== target) history.replaceState({ ...state(), scroll: window.scrollY }, '', target);
      if (flash) flashTarget(flash, true);
      else {
        window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
        headingOf(route)?.focus({ preventScroll: true });
      }
      return;
    }
    clearTimeout(saveTimer);
    if (replace) history.replaceState({ scroll: 0 }, '', target);
    else { saveScroll(); history.pushState({ scroll: 0 }, '', target); }
    render(route, { animate: true, focus: true, flash });
  }

  /*
   * Small menus in the header ("More" and the account menu): any element with
   * [data-drop] holding a button and a [data-drop-menu]. One open at a time;
   * a click outside, Escape, Tab out or choosing an item closes it.
   */
  const drops = [...document.querySelectorAll('[data-drop]')].map((root) => {
    const btn = root.querySelector('[data-drop-btn]');
    const menu = root.querySelector('[data-drop-menu]');
    const items = () => [...menu.querySelectorAll('a[href], button:not([disabled])')].filter((x) => x.offsetParent !== null);
    const d = {
      root,
      get open() { return root.classList.contains('open'); },
      set(open, { focus = false } = {}) {
        if (open) for (const other of drops) if (other !== d) other.set(false);
        root.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open && focus) requestAnimationFrame(() => items()[0]?.focus());
      },
    };
    btn.addEventListener('click', () => d.set(!d.open));
    btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); d.set(true, { focus: true }); } });
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const list = items();
      const i = list.indexOf(document.activeElement);
      list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length]?.focus();
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a[href], button')) d.set(false); });
    root.addEventListener('focusout', (e) => { if (e.relatedTarget && !root.contains(e.relatedTarget)) d.set(false); });
    return d;
  });
  const openDrop = () => drops.find((d) => d.open);
  document.addEventListener('pointerdown', (e) => { for (const d of drops) if (d.open && !d.root.contains(e.target)) d.set(false); });

  // the phone menu: a sheet under the header with every page, the account and Play
  const sheet = document.getElementById('menu-sheet');
  const sheetOpen = () => !!topbar && topbar.classList.contains('open');
  function setSheet(open) {
    if (!topbar || open === sheetOpen()) return;
    topbar.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    if (sheet) sheet.inert = !open;
    for (const id of ['main', 'site-foot']) document.getElementById(id)?.toggleAttribute('inert', open);   // Tab stays in the menu
    if (open) requestAnimationFrame(() => sheet?.querySelector('a[aria-current="page"], a[href]')?.focus({ preventScroll: true }));
  }
  if (sheet) sheet.inert = true;

  function closeMenu() {
    for (const d of drops) d.set(false);
    setSheet(false);
  }

  // links: every same-origin page link is handled in the document
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (href === '#top' || href === '#main') {
      e.preventDefault();
      if (href === '#top') window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
      else headingOf(current)?.scrollIntoView({ block: 'start' });
      headingOf(current)?.focus({ preventScroll: true });
      return;
    }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || STATIC.test(url.pathname) || url.pathname === '/healthz') return;
    e.preventDefault();
    closeMenu();
    if (isLocked()) return;   // the match owns the screen; Leave is the way out
    go(url.pathname + url.hash, { flash: a.dataset.flash || null });
  });

  // phone menu
  navToggle?.addEventListener('click', () => setSheet(!sheetOpen()));
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setSheet(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const d = openDrop();
    if (d) { d.set(false); d.root.querySelector('[data-drop-btn]')?.focus(); }
    else if (sheetOpen()) { setSheet(false); navToggle?.focus(); }
  });

  window.addEventListener('popstate', (e) => {
    closeMenu();
    const hash = resolveHash(location.hash, savedTab());
    if (hash && !hash.code) { go(hash.path, { replace: true, flash: hash.flash || null }); return; }   // an old #section link
    const route = hash && hash.code ? routeFor('/play-with-friends') : routeFor(location.pathname);
    if (hash && hash.code) {
      onCode(hash.code);
      if (route.path !== normalize(location.pathname)) history.replaceState({ scroll: 0 }, '', `${route.path}#${hash.code}`);
    }
    const scroll = e.state && typeof e.state.scroll === 'number' ? e.state.scroll : 0;
    render(route, { animate: true, focus: true, scroll });
  });

  // remember where each page was scrolled to, for back/forward
  window.addEventListener('scroll', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveScroll, 250);
  }, { passive: true });

  function start() {
    const hash = resolveHash(location.hash, savedTab());
    let route = routeFor(location.pathname);
    let flash = null;
    if (hash && hash.code) {
      route = routeFor('/play-with-friends');
      history.replaceState({ scroll: 0 }, '', `${route.path}#${hash.code}`);
      onCode(hash.code);
    } else if (hash) {
      route = routeFor(hash.path);
      flash = hash.flash || null;
      history.replaceState({ scroll: 0 }, '', hash.path);
    } else if (route.path && location.pathname !== route.path) {
      history.replaceState({ scroll: 0 }, '', route.path + location.search);   // "/Rankings/" -> "/rankings"
    } else {
      history.replaceState({ ...state(), scroll: 0 }, '');
    }
    render(route, { initial: true, flash });
  }

  /** Show the current page again, e.g. after leaving a match. */
  function refresh() {
    const route = routeFor(location.pathname);
    render(route, { scroll: 0 });
    document.title = route.title;
  }

  return { start, go, refresh, closeMenu, get current() { return current; } };
}
