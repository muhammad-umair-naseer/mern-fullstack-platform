import { enhance } from './pages.js';
import { setActiveNav, cameFromHere, focusHeading } from './nav.js';

/**
 * Moving around inside the game without ever reloading it.
 *
 * The game (/app) holds the race socket, so from here every page is shown in
 * this same document: the game's own pages (/app/profile, /app/garage,
 * /app/team, /app/awards, /app/signin) are screens already in the DOM, and the
 * site's pages (/, /practice..., /daily, /leaderboard..., /how, /u/..., /t/...)
 * are fetched and their <main> is shown in #screen-site. The address bar,
 * back/forward, the title, focus and scroll all behave as if they were
 * separate pages; a live lobby keeps its seat throughout. Any other address
 * is left to the browser.
 */
const APP_PAGES = { '': 'home', profile: 'profile', garage: 'garage', team: 'team', awards: 'badges', badges: 'badges', signin: 'signin' };
const REDIRECTS = { '/app/rankings': '/leaderboard', '/app/how': '/how' };
/** Old in-game addresses (#/rankings, #/profile, ...) and where they live now. */
const LEGACY = { '': '/app', rankings: '/leaderboard', how: '/how', profile: '/app/profile', garage: '/app/garage', team: '/app/team', badges: '/app/awards', awards: '/app/awards' };
const SITE = /^\/(?:|practice(?:\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)?\/?|daily\/?|leaderboard(?:\/[A-Za-z]{2})?\/?|how\/?|u\/[A-Za-z0-9_-]+\/?|t\/[a-z0-9_]+\/?|r\/[a-z0-9]+\/?)$/;
const CACHE_MS = 30000;

/** The app page an /app address names, or null. */
export function appPageOf(pathname) {
  const m = String(pathname).match(/^\/app(?:\/([a-z]+))?\/?$/);
  return m ? APP_PAGES[m[1] || ''] || null : null;
}

export class Router {
  /**
   * @param {object} o
   * @param {(page:string, url:URL)=>void} o.show      put an app screen up ('home' | 'profile' | ... | 'site')
   * @param {(url:URL)=>boolean} o.canLeave             false keeps you where you are (a race in progress)
   * @param {(page:string, url:URL, how:object)=>void} o.arrived  after an app page is shown (hash actions)
   */
  constructor({ show, canLeave = () => true, arrived = () => {} }) {
    this.show = show;
    this.canLeave = canLeave;
    this.arrived = arrived;
    this.site = document.getElementById('screen-site');
    this.cache = new Map();
    this.seq = 0;
    this.index = 0;
    this.cleanup = null;
    this.current = null;
    this.bar = null;
  }

  start() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const st = history.state && typeof history.state.i === 'number' ? history.state : { i: 0 };
    this.index = st.i;
    history.replaceState({ ...st, i: this.index }, '');
    document.addEventListener('click', (e) => this.onClick(e));
    window.addEventListener('popstate', (e) => {
      const i = e.state && typeof e.state.i === 'number' ? e.state.i : this.index + 1;
      const back = i < this.index;
      this.index = i;
      this.route(location.href, { push: false, back, y: e.state && e.state.y });
    });
    // a hash typed or set by hand (e.g. #/team) arrives here too; route() ignores repeats
    window.addEventListener('hashchange', () => this.route(location.href, { push: false }));
    return this.route(location.href, { push: false, initial: true });
  }

  /** Go somewhere from code: `router.go('/app')`. */
  go(href, opts = {}) { return this.route(href, { push: true, ...opts }); }

  onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !this.handles(url)) return;
    e.preventDefault();
    this.route(url.href, { push: true });
  }

  handles(url) {
    return !!(appPageOf(url.pathname) || REDIRECTS[url.pathname.replace(/\/$/, '')] || SITE.test(url.pathname));
  }

  async route(href, { push = false, replace = false, back = false, initial = false, y = null } = {}) {
    let url = new URL(href, location.href);
    // an old in-game address: rewrite it and carry on
    const legacy = appPageOf(url.pathname) && url.hash.match(/^#\/([a-z]*)\/?$/i);
    if (legacy && LEGACY[legacy[1].toLowerCase()] != null) {
      url = new URL(LEGACY[legacy[1].toLowerCase()], location.href);
      replace = true; push = false;
    }
    const redirect = REDIRECTS[url.pathname.replace(/\/$/, '')];
    if (redirect) { url = new URL(redirect, location.href); replace = true; push = false; }
    if (!this.handles(url)) {
      // the server answers unknown paths with this document (and a 404): loading it
      // again would loop forever, so an unknown first address opens the game instead
      if (!initial) { location.assign(url.href); return false; }
      url = new URL('/app', location.href);
      replace = true;
    }

    const key = url.pathname + url.search + url.hash;
    if (!initial && !push && !replace && this.current === key) return true;
    if (!initial && !this.canLeave(url)) {
      if (!push && this.current) history.pushState({ i: ++this.index }, '', this.current);   // a back button that could not leave: stay put
      return false;
    }
    if (push) {
      history.replaceState({ ...(history.state || {}), i: this.index, y: window.scrollY }, '');
      history.pushState({ i: ++this.index }, '', key);
    } else if (replace || initial) {
      history.replaceState({ ...(history.state || {}), i: this.index }, '', key);
    }
    this.current = key;
    const seq = ++this.seq;
    const page = appPageOf(url.pathname);

    if (page) {
      await this.swap(() => { this.leaveSite(); this.show(page, url); }, { back, initial });
      if (seq !== this.seq) return true;
      this.settle(initial, y, page === 'home' ? null : `#screen-${page}`);
      this.arrived(page, url, { initial });
      return true;
    }

    const html = await this.fetchPage(url, seq);
    if (html == null || seq !== this.seq) return false;
    await this.swap(() => this.inject(html, url), { back, initial });
    if (seq !== this.seq) return true;
    this.settle(initial, y, '#screen-site');
    return true;
  }

  async fetchPage(url, seq) {
    const key = url.pathname + url.search;
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.html;
    const slow = setTimeout(() => this.loading(true), 180);
    try {
      const r = await fetch(key, { headers: { Accept: 'text/html' }, credentials: 'same-origin' });
      const html = await r.text();
      if (!/<main[^>]+id="main"/.test(html)) throw new Error('not a page');
      this.cache.set(key, { at: Date.now(), html });
      if (this.cache.size > 24) this.cache.delete(this.cache.keys().next().value);
      return html;
    } catch (_) {
      if (seq === this.seq) location.assign(url.href);   // offline or odd: let the browser try
      return null;
    } finally {
      clearTimeout(slow);
      this.loading(false);
    }
  }

  /** Put a fetched page's <main> into #screen-site and bring it to life. */
  inject(html, url) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const main = doc.getElementById('main');
    this.leaveSite();
    this.site.innerHTML = main ? main.innerHTML : '';
    this.site.dataset.page = main ? main.dataset.page || '' : '';
    this.show('site', url);
    document.title = doc.title || 'TypeDash';
    setActiveNav(main ? main.dataset.nav || '' : '');
    this.cleanup = enhance(this.site);
  }

  leaveSite() {
    if (this.cleanup) { try { this.cleanup(); } catch (_) { /* ignore */ } this.cleanup = null; }
  }

  /** Run a DOM change as a view transition where the browser has them. */
  async swap(update, { back = false, initial = false } = {}) {
    const root = document.documentElement;
    if (initial || !document.startViewTransition || document.visibilityState !== 'visible') { update(); return; }
    root.classList.toggle('vt-back', back);
    let vt;
    try { vt = document.startViewTransition(update); } catch (_) { update(); root.classList.remove('vt-back'); return; }
    // while the page slides in, clicks land on the transition, not the page: say so (tests wait on it)
    root.dataset.transitioning = '1';
    vt.finished.finally(() => { root.classList.remove('vt-back'); delete root.dataset.transitioning; });
    try { await vt.updateCallbackDone; } catch (_) { /* the update itself threw: nothing more to do */ }
  }

  /** New page: top of the page and focus on its title. Back: where you were. */
  settle(initial, y, scope) {
    // a first load keeps the browser's scroll; it only takes focus when a TypeDash link brought you here
    if (initial && !cameFromHere()) return;
    if (!initial) window.scrollTo({ top: typeof y === 'number' ? y : 0, left: 0, behavior: 'instant' });
    focusHeading(scope ? document.querySelector(scope) : document.getElementById('screen-home'));
  }

  loading(on) {
    if (!this.bar) {
      this.bar = document.createElement('i');
      this.bar.className = 'route-bar';
      this.bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.bar);
    }
    this.bar.classList.toggle('on', on);
  }
}
