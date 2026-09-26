import { cxAuth } from './cx-auth.js';
import { flag } from './countries.js';

/**
 * The site's chrome: one navbar, one footer, the account control and the
 * phone menu, the same on every page and inside the game.
 *
 * The server paints the same navbar and footer (server/pages.js) as they look
 * to someone not signed in, so the first paint is already final and a page
 * reads without scripts; mountChrome() rebuilds both on start-up and keeps
 * the account parts in step with cx-auth.js (signed in, signed out, a
 * sign-in in progress, another tab changing it).
 *
 *   Navbar   brand · Home, Paragraphs, Today, Rankings, How to play ·
 *            account (Sign in, or avatar + name opening a small menu) · Play now
 *   Phone    brand · Play now · menu button opening a full-height sheet
 *   Footer   grouped links, the account links, Back to Cortexis, a credit line
 */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const NAV = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'practice', href: '/practice', label: 'Paragraphs' },
  { key: 'daily', href: '/daily', label: 'Today' },
  { key: 'leaderboard', href: '/leaderboard', label: 'Rankings' },
  { key: 'how', href: '/how', label: 'How to play' },
];
const YOU = [
  { key: 'profile', href: '/app/profile', label: 'Your stats', icon: 'gauge' },
  { key: 'garage', href: '/app/garage', label: 'Garage', icon: 'car' },
  { key: 'team', href: '/app/team', label: 'Team', icon: 'shield' },
  { key: 'badges', href: '/app/awards', label: 'Awards', icon: 'award', count: true },
];
const YOU_KEYS = new Set([...YOU.map((y) => y.key), 'signin']);

const P = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  menu: '<path d="M4 8h16M4 16h11"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  gauge: '<path d="M4.5 17a9 9 0 1 1 15 0"/><path d="M12 13l4.5-4.5"/><circle cx="12" cy="13" r="1.4"/>',
  car: '<path d="M3 17v-4l2-5h14l2 5v4M3 17h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 8 21l4-2 4 2-1-7.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  out: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  ext: '<path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
};
const svg = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name]}</svg>`;

const devSite = () => `${location.protocol}//${location.hostname}:3000`;
const siteUrl = () => (cxAuth.config && cxAuth.config.siteUrl) || devSite();
/** Links that leave the game: inside the website's frame they replace the website page, not the frame. */
const outTarget = (newTab) => (cxAuth.state.embedded ? ' target="_top"' : newTab ? ' target="_blank" rel="noopener"' : '');

let mounted = null;
let activeKey = '';

/* ------------------------------------------------------------ markup */

function barHtml() {
  const links = NAV.map((n) => `<a href="${n.href}" data-nav="${n.key}"><span>${n.label}</span></a>`).join('');
  return `
    <a class="brand" href="/" data-nav="home" aria-label="TypeDash, home"><span class="bolt">${svg('bolt', 'i fill')}</span><span class="brand-word">Type<em>Dash</em></span></a>
    <nav class="mainnav" id="mainnav" aria-label="Main">${links}</nav>
    <div class="topbar-right">
      <div class="acct" id="acct"></div>
      <a class="nav-cta" href="/app" data-nav="app"><span>Play now</span><i aria-hidden="true"></i></a>
      <button class="menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navsheet">${svg('menu')}</button>
    </div>
    <div class="acct-menu" id="acct-menu" hidden></div>`;
}

function avatar(s, cls = '') {
  const letter = (String(s.name || 'P').trim()[0] || 'P').toUpperCase();
  return `<span class="avatar ${cls}" aria-hidden="true"><b>${esc(letter)}</b><i class="avatar-flag">${flag(s.country)}</i></span>`;
}

function youLinks(cls) {
  return YOU.map((y) => `<a class="${cls}" href="${y.href}" data-nav="${y.key}">${svg(y.icon)}<span>${y.label}</span>${y.count ? '<small data-ach-count></small>' : ''}</a>`).join('');
}

function acctControlHtml(s) {
  if (s.status === 'signed-in') {
    return `<button class="acct-btn" id="acct-btn" type="button" aria-expanded="false" aria-controls="acct-menu">
      ${avatar(s)}<span class="acct-name">${esc(s.name)}</span>${svg('chevron', 'i chev')}</button>`;
  }
  if (s.busy) return '<span class="acct-busy" role="status"><i aria-hidden="true"></i>Signing in</span>';
  return '<a class="acct-signin" href="/app/signin" data-nav="signin">Sign in</a>';
}

function acctMenuHtml(s) {
  if (s.status !== 'signed-in') return '';
  return `
    <div class="acct-head">${avatar(s, 'lg')}<span class="acct-who"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(cxAuth.countryName(s.country))}</small></span></div>
    <div class="acct-links">${youLinks('menu-item')}</div>
    <div class="acct-acts">
      <a class="menu-item" href="/app/profile#country" data-act="country">${svg('globe')}<span>Change country</span></a>
      <button class="menu-item" type="button" data-act="signout">${svg('out')}<span>Sign out</span></button>
    </div>`;
}

function sheetHtml(s) {
  const links = NAV.map((n, i) => `<a class="ns-link" href="${n.href}" data-nav="${n.key}" style="--k:${i}">${n.label}</a>`).join('');
  const who = s.status === 'signed-in'
    ? `<div class="ns-who">${avatar(s, 'lg')}<span class="acct-who"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(cxAuth.countryName(s.country))}</small></span></div>
       <div class="ns-you">${youLinks('ns-chip')}</div>
       <div class="ns-acts">
         <a class="ns-act" href="/app/profile#country" data-act="country">${svg('globe')}Change country</a>
         <button class="ns-act" type="button" data-act="signout">${svg('out')}Sign out</button>
       </div>`
    : `<div class="ns-guest">
         <a class="btn ns-signin" href="/app/signin" data-nav="signin">Sign in</a>
         <a class="ns-act" href="${esc(cxAuth.signupUrl)}"${outTarget(true)}>Create a Cortexis account</a>
       </div>
       <div class="ns-you">${youLinks('ns-chip')}</div>`;
  return `
    <div class="ns-inner">
      <nav class="ns-nav" aria-label="Pages">${links}</nav>
      <section class="ns-account" aria-label="Your account">${who}</section>
      <a class="btn primary big ns-play" href="/app" data-nav="app">Play now</a>
    </div>`;
}

function footerHtml(s) {
  const cc = s.country && s.country !== 'UN' ? s.country : null;
  const account = s.status === 'signed-in'
    ? `<a href="/app/profile">Your stats</a><a href="/app/garage">Garage</a><a href="/app/awards">Awards</a><button class="tdf-link" type="button" data-act="signout">Sign out</button>`
    : `<a href="/app/signin">Sign in</a><a href="${esc(cxAuth.signupUrl)}"${outTarget(true)}>Create an account</a><a href="/app/profile">Your stats</a>`;
  return `
    <div class="tdf-top">
      <div class="tdf-brand">
        <a class="brand foot-brand" href="/"><span class="bolt">${svg('bolt', 'i fill')}</span><span class="brand-word">Type<em>Dash</em></span></a>
        <a class="tdf-back" href="${esc(siteUrl())}"${outTarget(false)}>${svg('back')}<span>Back to Cortexis</span></a>
      </div>
      <nav class="tdf-cols" aria-label="Footer">
        <div class="tdf-col"><p class="tdf-h">Play</p><a href="/app">Race people</a><a href="/practice">Paragraphs</a><a href="/daily">Today's paragraph</a></div>
        <div class="tdf-col"><p class="tdf-h">Rankings</p><a href="/leaderboard">World</a>${cc ? `<a href="/leaderboard/${cc}">${esc(cxAuth.countryName(cc))}</a>` : ''}<a href="/how">How to play</a></div>
        <div class="tdf-col" data-foot-account><p class="tdf-h">Account</p>${account}</div>
      </nav>
    </div>
    <div class="tdf-base">
      <p>A Cortexis game, made in Islamabad.</p>
    </div>`;
}

/* ------------------------------------------------------------- mount */

/**
 * Build the chrome and wire it. `app` adds the install button the game uses.
 * Safe to call twice (the second call returns the first mount).
 */
export function mountChrome({ app = false } = {}) {
  if (mounted) return mounted;
  const bar = document.getElementById('topbar');
  if (!bar) return { close() {} };
  bar.classList.add('tb');
  bar.innerHTML = barHtml();

  const sheet = document.createElement('div');
  sheet.className = 'navsheet';
  sheet.id = 'navsheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Menu');
  bar.after(sheet);

  let foot = document.querySelector('.site-foot');
  if (!foot) { foot = document.createElement('footer'); (document.querySelector('main') || bar).after(foot); }
  foot.className = 'site-foot tdf';

  // the game offers "Install TypeDash" here once the browser allows it (main.js holds this node)
  let install = null;
  if (app) {
    install = document.createElement('button');
    install.className = 'tdf-install';
    install.id = 'install-btn';
    install.type = 'button';
    install.hidden = true;
    install.innerHTML = `${svg('download')}Install TypeDash`;
  }

  const acct = $('#acct', bar);
  const menu = $('#acct-menu', bar);
  const menuBtn = $('#menu-btn', bar);

  /* the account menu (desktop) */
  const setMenu = (open, { focus = false } = {}) => {
    const btn = $('#acct-btn', bar);
    if (open && !btn) return;
    menu.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open && focus) { const first = menu.querySelector('.menu-item'); if (first) first.focus(); }
    if (!open && btn && menu.contains(document.activeElement)) btn.focus();
  };

  /* the phone sheet */
  let lastFocus = null;
  const setSheet = (open) => {
    if (open === !sheet.hidden) return;
    if (open) {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      document.documentElement.classList.add('ns-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      menuBtn.innerHTML = svg('close');
      const first = sheet.querySelector('.ns-link');
      if (first) first.focus({ preventScroll: true });
    } else {
      sheet.hidden = true;
      document.documentElement.classList.remove('ns-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      menuBtn.innerHTML = svg('menu');
      if (sheet.contains(document.activeElement) || document.activeElement === document.body) (lastFocus && lastFocus.isConnected ? lastFocus : menuBtn).focus({ preventScroll: true });
    }
  };
  menuBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(false); setSheet(sheet.hidden); });
  // the sheet only exists on narrow screens: widening the window closes it
  const wide = window.matchMedia('(min-width: 901px)');
  const onWide = () => { if (wide.matches) setSheet(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide);

  acct.addEventListener('click', (e) => {
    const btn = e.target.closest('#acct-btn');
    if (!btn) return;
    e.stopPropagation();
    setMenu(menu.hidden, { focus: e.detail === 0 });
  });
  acct.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && e.target.closest('#acct-btn')) { e.preventDefault(); setMenu(true, { focus: true }); }
  });
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('.menu-item')];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    const to = e.key === 'ArrowDown' ? items[(i + 1) % items.length] : e.key === 'ArrowUp' ? items[(i - 1 + items.length) % items.length] : e.key === 'Home' ? items[0] : e.key === 'End' ? items[items.length - 1] : null;
    if (to) { e.preventDefault(); to.focus(); }
    if (e.key === 'Tab') setMenu(false);
  });

  // clicks anywhere: close what is open, run the account actions
  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]');
    if (act && act.dataset.act === 'signout') { e.preventDefault(); setMenu(false); setSheet(false); signOut(); return; }
    if (!menu.hidden && (!menu.contains(e.target) || e.target.closest('a, button'))) setMenu(false);
    if (!sheet.hidden && e.target.closest('#navsheet a, #navsheet button')) setSheet(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!menu.hidden) setMenu(false); if (!sheet.hidden) { setSheet(false); menuBtn.focus(); } }
    if (e.key === 'Tab' && !sheet.hidden) {
      // keep focus inside the sheet and its close button
      const stops = [menuBtn, ...sheet.querySelectorAll('a[href], button:not([disabled])')];
      const i = stops.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); stops[stops.length - 1].focus(); } else if (!e.shiftKey && (i === stops.length - 1 || i < 0)) { e.preventDefault(); stops[0].focus(); }
    }
  });

  let lastKey = '';
  const render = () => {
    const s = cxAuth.state;
    const key = `${s.status}|${s.name}|${s.country}|${s.busy}|${cxAuth.config ? 1 : 0}`;
    if (key === lastKey) return;
    lastKey = key;
    const menuOpen = !menu.hidden;
    const hadFocus = acct.contains(document.activeElement);
    acct.innerHTML = acctControlHtml(s);
    menu.innerHTML = acctMenuHtml(s);
    if (menuOpen) setMenu(s.status === 'signed-in');
    foot.innerHTML = footerHtml(s);
    if (install) $('.tdf-base', foot).appendChild(install);
    const sheetOpen = !sheet.hidden;
    sheet.innerHTML = sheetHtml(s);
    if (sheetOpen) { const first = sheet.querySelector('.ns-link'); if (first) first.focus({ preventScroll: true }); }
    if (hadFocus) { const c = acct.querySelector('button, a'); if (c) c.focus(); }
    setActiveNav(activeKey);
    paintCounts();
  };
  render();
  cxAuth.onChange(render);
  cxAuth.ready.then(() => { lastKey = ''; render(); });

  mounted = { close: () => { setMenu(false); setSheet(false); }, render };
  return mounted;
}

async function signOut() {
  const { toast } = await import('./ui.js');
  const before = cxAuth.state.name;
  await cxAuth.signOut();
  toast(before && before !== 'Guest' ? `Signed out. See you soon, ${before}.` : 'Signed out.', 'info', 2600);
}

/* ------------------------------------------------------ active state */

/** Mark the item for `key` (a data-nav value) everywhere in the chrome, and move the copper caret under it. */
export function setActiveNav(key) {
  activeKey = key || '';
  for (const a of document.querySelectorAll('#topbar [data-nav], #navsheet [data-nav]')) {
    if (a.dataset.nav === activeKey) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  const btn = document.getElementById('acct-btn');
  if (btn) btn.classList.toggle('on', YOU_KEYS.has(activeKey));
  const nav = document.getElementById('mainnav');
  if (!nav) return;
  let caret = nav.querySelector('.nav-caret');
  const target = nav.querySelector(`a[data-nav="${CSS.escape(activeKey)}"]`);
  if (!target) { if (caret) caret.remove(); return; }
  if (!caret) { caret = document.createElement('i'); caret.className = 'nav-caret'; caret.setAttribute('aria-hidden', 'true'); }
  if (caret.parentElement !== target) target.appendChild(caret);
}

/* ----------------------------------------------------------- counts */

let achText = '';
/** "3/24" beside Awards, wherever the chrome shows it. */
export function setAwardCount(text) {
  achText = text || '';
  paintCounts();
}
function paintCounts() {
  for (const n of document.querySelectorAll('[data-ach-count]')) n.textContent = achText;
}

/* ------------------------------------------------------------ helpers */

/** The profile the game last cached in this browser (server pages have no socket). */
export function cachedProfile() {
  try {
    const acc = JSON.parse(localStorage.getItem('td_account_v1') || 'null');
    const profile = JSON.parse(localStorage.getItem('td_profile_cache_v1') || 'null');
    return { id: acc && acc.id ? acc.id : null, profile: profile || null };
  } catch (_) {
    return { id: null, profile: null };
  }
}

/** How many people are on TypeDash right now, into #online when the page has one. */
export async function loadOnline() {
  const out = document.getElementById('online');
  if (!out) return;
  try {
    const r = await fetch('/api/stats', { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const s = await r.json();
    out.textContent = String(s.online);
  } catch (_) { /* leave the dash */ }
}

/** True when this document was opened by a link on TypeDash itself (not a reload, not from outside). */
export function cameFromHere() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') return false;
    return !!document.referrer && new URL(document.referrer).origin === location.origin;
  } catch (_) {
    return false;
  }
}

/** Put focus on a page's title, the way a new page should start, without scrolling. */
export function focusHeading(root) {
  const h = root && root.querySelector('h1');
  if (!h) return;
  if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
  h.focus({ preventScroll: true });
}
