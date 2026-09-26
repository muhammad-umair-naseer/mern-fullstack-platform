'use strict';
const cfg = require('./config');
const { CATALOGUE } = require('./achievements');
const { STAGES, CHAIN } = require('./passages');
const { nameOf } = require('./countries');
const { siteConfig } = require('./cx');

/**
 * Server-rendered pages: the home page, the paragraphs, today's paragraph,
 * the rankings, how to play, share pages, player and team profiles. Every
 * one is plain, crawlable HTML inside one shared frame (navbar, footer,
 * stylesheets, one module), and every one is cheap string assembly: nothing
 * here holds a socket or runs a tick.
 *
 * The frame is shared with the game itself (/app): `navbar()` and `footer()`
 * are substituted into public/index.html, so there is exactly one navbar.
 * The game loads these pages into its own document when you move around
 * inside it (see public/js/router.js), which is why each page's content lives
 * in <main id="main"> and needs nothing from its <head> to work.
 *
 * Pictures that move (cars, the typing caret, the podium) are placeholders
 * here (`data-car`, `data-replay`, ...) that public/js/pages.js brings to life.
 */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (n) => Number(n || 0).toLocaleString('en-US');
const fmtTime = (ms) => { const s = Math.max(0, ms || 0) / 1000; const m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`; };
const place = (r) => (r === 1 ? '1st' : r === 2 ? '2nd' : r === 3 ? '3rd' : `${r}th`);
const flag = (code) => (!code || code === 'UN' || code.length !== 2 ? '🌍' : String.fromCodePoint(...code.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)));
const plural = (n, one, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`;
/** JSON for a data-* attribute. */
const attrJson = (v) => esc(JSON.stringify(v));

const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%2316130F'/%3E%3Cpath d='M36 9 17 35h12l-3 20 21-27H35l4-19z' fill='%23D08A5A'/%3E%3C/svg%3E";
const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap';

/**
 * Inline in every <head>: mark that scripts run, and when you arrive by the
 * browser's back button run the page transition the other way round.
 */
const HEAD_SCRIPT = "document.documentElement.classList.add('js');addEventListener('pagereveal',function(e){var n=window.navigation,a=n&&n.activation;if(!e.viewTransition||!a||a.navigationType!=='traverse'||!a.from||!a.entry||a.entry.index>=a.from.index)return;var r=document.documentElement;r.classList.add('vt-back');e.viewTransition.finished.finally(function(){r.classList.remove('vt-back')})});";

/* ------------------------------------------------------------- icons */

const svg = (d, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  menu: '<path d="M4 8h16M4 16h11"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
};

/** A padlock whose shackle can swing open (the unlock animation turns `.shackle`). */
const LOCK = '<svg class="lock-i" viewBox="0 0 24 24" aria-hidden="true"><path class="shackle" d="M8 11V7.6a4 4 0 0 1 8 0V11"/><rect x="5" y="11" width="14" height="10" rx="2.6"/></svg>';

/* ------------------------------------------------- the English chain */

/**
 * The browser's half of the English chain on the server pages. Pages are
 * cached and do not know who is looking, so the markup arrives in a new
 * visitor's state (paragraph 1 open, the rest locked). This runs inline, right
 * after that markup and before the first paint, and repaints it from the
 * progress the game keeps in this browser (the cached profile's `done`); the
 * game runs it again when it shows a page itself (js/router.js). The rule is
 * passages.js's: 1 is always open, the rest open in order, finished ones stay
 * open. It is sent as source, so it must not reach outside itself.
 */
function paintChain(script) {
  const root = script.parentElement;
  const lockOn = script.dataset.lock !== 'off';
  // back here from the browser's back/forward cache: you may have typed since, so paint again
  if (document.readyState === 'loading') addEventListener('pageshow', (e) => { if (e.persisted) paintChain(script); });
  let has = new Set();
  try {
    const profile = JSON.parse(localStorage.getItem('td_profile_cache_v1') || 'null');
    if (profile && Array.isArray(profile.done)) has = new Set(profile.done);
  } catch (_) { /* no storage: a new visitor */ }

  // the set page: every paragraph in order, each done, next, open or locked
  const items = [...root.querySelectorAll('[data-chain-list] li[data-n]')];
  let next = null;
  let missing = 0;       // the last paragraph so far that is still to do
  let count = 0;
  for (const li of items) {
    let state = 'open';
    if (has.has(li.dataset.id)) { state = 'done'; count++; } else if (!next) { state = 'next'; next = li; } else if (lockOn) state = 'locked';
    if (state === 'locked') li.querySelector('[data-need]').textContent = missing;
    if (state !== 'done') missing = Number(li.dataset.n);
    li.dataset.state = state;
    li.classList.remove('unlocking', 'ps-play');
  }
  if (!items.length) count = has.size;

  for (const bar of root.querySelectorAll('[data-chain-progress]')) {
    const total = Number(bar.dataset.total) || 1;
    const n = Math.min(total, count);
    bar.querySelector('b').textContent = n;
    bar.style.setProperty('--p', (n / total).toFixed(4));
  }

  const cta = root.querySelector('[data-chain-cta]');
  if (cta && count) {
    cta.href = next ? `/app#practice/${next.dataset.id}` : '/app#practice';
    cta.firstChild.nodeValue = next ? `Type paragraph ${next.dataset.n}` : 'Type a random one';
  }

  // coming back after finishing one: the newly opened card unlocks on screen
  if (items.length) {
    const at = next ? Number(next.dataset.n) : items.length + 1;
    let seen = 0;
    try { seen = Number(localStorage.getItem('td_chain_seen_v1')) || 0; localStorage.setItem('td_chain_seen_v1', String(at)); } catch (_) { /* no storage */ }
    if (next && lockOn && seen && at > seen && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      next.classList.add('unlocking');   // held on its first frame (the card as it was, locked) until it is in view
      const play = () => setTimeout(() => next.classList.add('ps-play'), 420);
      if (!('IntersectionObserver' in window)) play();
      else {
        const io = new IntersectionObserver((seenNow) => { if (seenNow.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.6 });
        io.observe(next);
      }
    }
  }

  // one paragraph's page: its start button, or the lock and the way to it
  const gate = root.querySelector('[data-chain-gate]');
  if (gate) {
    const before = gate.dataset.before ? gate.dataset.before.split(' ') : [];
    const need = has.has(gate.dataset.id) ? null : before.find((id) => !has.has(id));
    gate.dataset.state = lockOn && need ? 'locked' : 'open';
    if (need) {
      const link = gate.querySelector('[data-gate-next]');
      link.href = `/app#practice/${need}`;
      link.querySelector('b').textContent = before.indexOf(need) + 1;
    }
  }
}

/** The inline script that runs paintChain where it stands. */
const paintScript = () => `<script data-paint${cfg.PRACTICE_LOCK ? '' : ' data-lock="off"'}>(${paintChain})(document.currentScript)</script>`;

/** "0 of N done" and a slim bar; paintChain fills in the player's own count. */
const chainProgress = (cls = '', i = null) => `<span class="chain-prog ${cls}" data-chain-progress data-total="${CHAIN.length}" style="--p:0${i == null ? '' : `;--i:${i}`}"><span class="cp-text"><b>0</b> of ${CHAIN.length} done</span><i class="cp-bar" aria-hidden="true"><i></i></i></span>`;

/** A car drawn in pencil: the empty seat on a podium or a board. */
const PENCIL_CAR = '<svg class="pencil-car" viewBox="0 0 122 52" aria-hidden="true"><path d="M6 33 C6 27 10 24 16 23 L34 21 L46 10 C49 7 53 6 58 6 L84 6 C89 6 93 8 96 12 L104 21 L113 24 C117 25 119 28 119 32 L119 36 C119 39 117 40 114 40 L11 40 C8 40 6 38 6 36 Z"/><circle cx="30" cy="40" r="8.5"/><circle cx="92" cy="40" r="8.5"/></svg>';

/* ------------------------------------------------------------- the frame */

/** Where each navbar item points, and the key pages mark themselves with (the list in public/js/nav.js). */
const NAV = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'practice', href: '/practice', label: 'Paragraphs' },
  { key: 'daily', href: '/daily', label: 'Today' },
  { key: 'leaderboard', href: '/leaderboard', label: 'Rankings' },
  { key: 'how', href: '/how', label: 'How to play' },
];

/**
 * The navbar and footer exactly as public/js/nav.js draws them for someone
 * who is not signed in, so the first paint is already the final chrome and a
 * page reads the same without scripts. The account slot stays empty: only
 * the script knows who you are, and the bar's grid keeps everything else
 * still when it fills in.
 */
function navbar({ active = null } = {}) {
  const cur = (key) => (key === active ? ' aria-current="page"' : '');
  const main = NAV.map((n) => `<a href="${n.href}" data-nav="${n.key}"${cur(n.key)}><span>${n.label}</span>${n.key === active ? '<i class="nav-caret" aria-hidden="true"></i>' : ''}</a>`).join('');
  return `<header class="topbar tb" id="topbar">
    <a class="brand" href="/" data-nav="home"${cur('home')} aria-label="TypeDash, home"><span class="bolt">${svg(I.bolt, 'i fill')}</span><span class="brand-word">Type<em>Dash</em></span></a>
    <nav class="mainnav" id="mainnav" aria-label="Main">${main}</nav>
    <div class="topbar-right">
      <div class="acct" id="acct"></div>
      <a class="nav-cta" href="/app" data-nav="app"><span>Play now</span><i aria-hidden="true"></i></a>
      <button class="menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navsheet">${svg(I.menu)}</button>
    </div>
    <div class="acct-menu" id="acct-menu" hidden></div>
  </header>`;
}

/** The website's links for a page served at `origin`, by the same rules as /api/cx/config. */
function siteOf(origin) {
  let u = null;
  try { u = new URL(origin); } catch (_) { /* no origin: localhost */ }
  return siteConfig(u && { headers: { host: u.host, 'x-forwarded-proto': u.protocol.slice(0, -1) } });
}

function footer({ origin } = {}) {
  const site = siteOf(origin);
  return `<footer class="site-foot tdf">
    <div class="tdf-top">
      <div class="tdf-brand">
        <a class="brand foot-brand" href="/"><span class="bolt">${svg(I.bolt, 'i fill')}</span><span class="brand-word">Type<em>Dash</em></span></a>
        <a class="tdf-back" href="${esc(site.siteUrl)}">${svg(I.back)}<span>Back to Cortexis</span></a>
      </div>
      <nav class="tdf-cols" aria-label="Footer">
        <div class="tdf-col"><p class="tdf-h">Play</p><a href="/app">Race people</a><a href="/practice">Paragraphs</a><a href="/daily">Today's paragraph</a></div>
        <div class="tdf-col"><p class="tdf-h">Rankings</p><a href="/leaderboard">World</a><a href="/how">How to play</a></div>
        <div class="tdf-col" data-foot-account><p class="tdf-h">Account</p><a href="/app/signin">Sign in</a><a href="${esc(site.signupUrl)}" target="_blank" rel="noopener">Create an account</a><a href="/app/profile">Your stats</a></div>
      </nav>
    </div>
    <div class="tdf-base">
      <p>A Cortexis game, made in Islamabad.</p>
    </div>
  </footer>`;
}

/**
 * The document around a page. `nav` marks the active navbar item; `page`
 * names the page for its styles; the body goes into <main id="main">.
 */
function layout({ origin, path, title, description, image, imageAlt, body, jsonLd = null, noindex = false, nav = null, page = 'page', ogType = 'website', preload = null }) {
  const url = origin + path;
  const img = image || `${origin}/og/site.png`;
  return `<!DOCTYPE html>
<html lang="en" data-doc="site">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(url)}">
  ${noindex ? '<meta name="robots" content="noindex">' : ''}
  <meta name="theme-color" content="#FAF8F4">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="TypeDash">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(img)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(imageAlt || title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(img)}">
  <link rel="icon" href="${ICON}">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/demo.css">
  <link rel="stylesheet" href="/css/site.css">
  ${preload ? `<link rel="preload" as="image" href="${esc(preload)}" type="image/webp">` : ''}
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
  <script>${HEAD_SCRIPT}</script>
</head>
<body class="page-body">
  <canvas id="bg" aria-hidden="true"></canvas>
  <a class="skip" href="#main">Skip to the page</a>
  ${navbar({ active: nav })}
  <main id="main" class="site-main" data-page="${esc(page)}" data-nav="${esc(nav || '')}" data-title="${esc(title)}">${body}</main>
  ${footer({ origin })}
  <div id="toasts" class="toasts" aria-live="polite"></div>
  <script type="module" src="/js/site.js"></script>
</body>
</html>`;
}

/** A photograph in a page hero: warm, cropped by its frame, never the thing you read. */
function photo(name, alt = '', { eager = true, w = 1600, h = 1066 } = {}) {
  return `<img class="pg-photo-img" src="/img/${name}-1600.webp" srcset="/img/${name}-800.webp 800w, /img/${name}-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 60vw" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/** Title set as lines that rise out of a mask on arrival (see .hero-title in site.css). */
const heroTitle = (lines, cls = '') => {
  const list = Array.isArray(lines) ? lines : [lines];
  return `<h1 class="hero-title ${cls}" tabindex="-1">${list.map((l, i) => `<span class="ln" style="--i:${i}"><span>${l}</span></span>`).join('')}</h1>`;
};

/* ------------------------------------------------------------- boards */

/**
 * A board as lanes: each row's car sits as far along its lane as its score
 * is of the leader's, so the list reads as a race at a glance.
 */
function lanes(rows, fmt, { showCountry = true, href = (r) => `/u/${r.id}`, empty = 'Nobody here yet. One race puts you on the board.', label = '' } = {}) {
  if (!rows || !rows.length) {
    return `<div class="board-open">
      <div class="open-lane" aria-hidden="true">${PENCIL_CAR}</div>
      <p>${esc(empty)}</p>
    </div>`;
  }
  const lead = Math.max(1, ...rows.map((r) => r.value || 0));
  return `<ol class="lanes"${label ? ` aria-label="${esc(label)}"` : ''}>${rows.map((r) => `
    <li class="lane-row${r.rank <= 3 ? ` p${r.rank}` : ''}" data-id="${esc(r.id)}" style="--f:${Math.max(0.04, (r.value || 0) / lead).toFixed(3)}">
      <span class="lr-rank">${r.rank}</span>
      <span class="lr-who">${showCountry ? `<span class="lr-flag">${flag(r.country)}</span>` : ''}<a href="${esc(href(r))}">${esc(r.name)}</a></span>
      <span class="lr-road" aria-hidden="true"><span class="lr-car" data-car="${esc(r.skin && r.skin !== 'flag' ? r.skin : 'dash')}"></span></span>
      <span class="lr-val">${esc(fmt(r.value, r))}</span>
    </li>`).join('')}</ol>`;
}

/** The three steps. DOM order is rank order; CSS stands them 2 · 1 · 3. */
function podium(rows, fmt, { href = (r) => `/u/${r.id}`, showCountry = true } = {}) {
  const slot = (r, i) => (r ? `
    <li class="pd pd${i + 1}" data-id="${esc(r.id)}">
      <span class="pd-car" data-car="${esc(r.skin || 'dash')}" aria-hidden="true"></span>
      <span class="pd-who">${showCountry ? `<span class="pd-flag">${flag(r.country)}</span>` : ''}<a href="${esc(href(r))}">${esc(r.name)}</a></span>
      <span class="pd-val">${esc(fmt(r.value, r))}</span>
      <span class="pd-step"><b>${i + 1}</b></span>
    </li>` : `
    <li class="pd pd${i + 1} open">
      <span class="pd-car" aria-hidden="true">${PENCIL_CAR}</span>
      <span class="pd-who"><span>Open seat</span></span>
      <span class="pd-val">&nbsp;</span>
      <span class="pd-step"><b>${i + 1}</b></span>
    </li>`);
  return `<ol class="podium-row" aria-label="Top three">${[0, 1, 2].map((i) => slot(rows[i] || null, i)).join('')}</ol>`;
}

/* ------------------------------------------------------------- home */

function homePage({ origin, passages = 0, langs = 0, racers = 5 }) {
  const title = 'TypeDash — a typing race against real people';
  const description = `A free typing race you play in the browser: a short paragraph appears, you type it, and whoever finishes first wins. Paragraphs in ${langs} languages, a new one every day, worldwide rankings. No sign-up.`;
  const body = `
  <section class="hm-hero" data-hero>
    <div class="hm-copy">
      ${heroTitle(['Type fast.', '<em>Finish first.</em>'], 'hm-title')}
      <p class="pg-lead hero-late" style="--i:2">Up to ${racers} people, one paragraph, about a minute.</p>
      <div class="pg-cta hero-late" style="--i:3">
        <a class="btn primary big-cta" href="/app">Play now</a>
        <a class="text-link" href="/practice">See the paragraphs</a>
      </div>
    </div>
    <div class="hm-stage hero-media" aria-hidden="true">
      <div class="hm-glow"></div>
      <div data-td-demo></div>
      <span class="float f1"><b>✦</b>+250 bonus word</span>
      <span class="float f2"><b>2×</b>points for a clean run</span>
    </div>
  </section>

  <section class="hm-modes" aria-label="Ways to play">
    <a class="mode" href="/app">
      <span class="art" aria-hidden="true"><span class="art-lanes" data-lanes><i data-skin="bolt" data-paint="#B8612E"></i><i data-skin="hatch" data-paint="#3E6A82"></i><i data-skin="muscle" data-paint="#8E3B35"></i></span></span>
      <span class="mode-foot"><span><b>Race people</b><small>Up to ${racers}, live</small></span><span class="go" aria-hidden="true"></span></span>
    </a>
    <a class="mode" href="/practice">
      <span class="art" aria-hidden="true"><span class="art-solo"><span class="line"><i style="--k:0;width:22%"></i><i style="--k:1;width:14%"></i><i style="--k:2;width:30%"></i><i style="--k:3;width:18%"></i></span><span class="line"><i style="--k:4;width:16%"></i><i style="--k:5;width:26%"></i><i style="--k:6;width:12%"></i><i style="--k:7;width:22%"></i></span><span class="line"><i style="--k:8;width:28%"></i><i style="--k:9;width:18%"></i><i style="--k:10;width:10%"></i></span><span class="pacer me">you<span><b></b></span></span><span class="pacer">robot<span><b></b></span></span></span></span>
      <span class="mode-foot"><span><b>On your own</b><small>${passages} paragraphs in ${langs} languages</small></span><span class="go" aria-hidden="true"></span></span>
    </a>
    <a class="mode" href="/daily">
      <span class="art" aria-hidden="true"><span class="art-cal"><span class="leaf"><small>today</small><b>1</b></span><span class="star s1">✦</span><span class="star s2">✦</span><span class="star s3">✦</span></span></span>
      <span class="mode-foot"><span><b>Today's paragraph</b><small>The same one for everyone</small></span><span class="go" aria-hidden="true"></span></span>
    </a>
  </section>

  <section class="hm-closer">
    <h2>How fast are you?</h2>
    <a class="btn primary big-cta" href="/app">Play now</a>
    <div class="parade" data-parade aria-hidden="true"></div>
  </section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', name: 'TypeDash', url: `${origin}/` },
    { '@type': 'VideoGame', name: 'TypeDash', url: `${origin}/app`, description: 'A typing race you play in the browser: a short paragraph appears, you type it, and whoever finishes first wins.', applicationCategory: 'Game', operatingSystem: 'Any', gamePlatform: 'Web browser', playMode: ['MultiPlayer', 'SinglePlayer'], genre: 'Typing', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  ] };
  return layout({ origin, path: '/', title, description, body, jsonLd, nav: 'home', page: 'home' });
}

/* ------------------------------------------------------------- share page */

function shareMeta(s) {
  const who = s.name || 'A racer';
  if (s.kind === 'daily') {
    return {
      title: `${who} typed today's paragraph #${s.dailyNumber} at ${s.wpm} words a minute on TypeDash`,
      description: `${s.rank ? `#${s.rank} of ${num(s.of)} today · ` : ''}${s.accuracy}% accuracy · ${fmtTime(s.time)}. Same passage for everyone, one scored attempt a day. Your turn.`,
      cta: { href: '/app#daily', label: "Play today's daily" },
    };
  }
  if (s.kind === 'practice') {
    return {
      title: `${who} typed ${s.wpm} WPM on “${s.passageTitle || 'a TypeDash paragraph'}”`,
      description: `${s.accuracy}% accuracy in ${fmtTime(s.time)}. Race their ghost on the same passage — free, no sign-up.`,
      cta: { href: s.passageId && s.accountId ? `/app#practice/${s.passageId}/ghost/${s.accountId}` : '/app#practice', label: 'Beat my ghost' },
    };
  }
  return {
    title: `${who} came ${place(s.rank)} of ${s.of} at ${s.wpm} WPM in a TypeDash race`,
    description: `${s.accuracy}% accuracy · ${s.time ? fmtTime(s.time) : 'did not finish'}${s.ranked ? ` · +${num(s.points)} ranked points` : ''}. Five cars, one passage, live. Can you beat them?`,
    cta: { href: '/app', label: 'Race now' },
  };
}

function sharePage(s, id, origin) {
  const meta = shareMeta(s);
  const image = `${origin}/og/r/${id}.png`;
  const body = `
  <section class="share-hero" data-hero>
    <figure class="share-frame hero-media"><img class="share-img" src="${esc(image)}" alt="${esc(meta.title)}" width="1200" height="630" fetchpriority="high"></figure>
    <div class="share-copy">
      <h1 class="share-title hero-late" tabindex="-1" style="--i:1">${esc(meta.title)}</h1>
      <div class="pg-cta hero-late" style="--i:2"><a class="btn primary big-cta" href="${esc(meta.cta.href)}">${esc(meta.cta.label)}</a><a class="text-link" href="/">What is TypeDash?</a></div>
    </div>
  </section>`;
  return layout({ origin, path: `/r/${id}`, title: meta.title, description: meta.description, image, body, page: 'share' });
}

/* ------------------------------------------------------------- profile page */

function profilePage(p, origin) {
  const title = `${p.name} · Level ${p.level} ${p.title} on TypeDash`;
  const description = `${num(p.points)} ranked points · best ${p.bestWpm} WPM · ${num(p.wins)} wins in ${num(p.races)} races${p.worldRank ? ` · #${num(p.worldRank)} in the world` : ''}${p.streak > 0 ? ` · ${p.streak}-day streak` : ''}.`;
  const image = `${origin}/og/u/${p.id}.png`;
  const have = new Set(p.achievements);
  const ach = CATALOGUE.filter((a) => have.has(a.id));
  const stat = (v, l) => `<div class="figure"><b>${esc(v)}</b><span>${esc(l)}</span></div>`;
  const body = `
  <section class="pg-hero who-hero" data-hero>
    <div class="pg-copy">
      <p class="who-flag hero-late" style="--i:0"><span class="flag-disc">${flag(p.country)}</span>Level ${p.level} ${esc(p.title)}</p>
      ${heroTitle(esc(p.name), 'who-name')}
      <div class="figures hero-late" style="--i:2">
        ${stat(p.bestWpm, 'best words a minute')}${stat(num(p.points), 'points')}${stat(p.worldRank ? `#${num(p.worldRank)}` : '—', 'in the world')}
      </div>
      <div class="pg-cta hero-late" style="--i:3"><a class="btn primary big-cta" href="/app">Race ${esc(p.name)}</a></div>
    </div>
    <div class="showroom hero-media" aria-hidden="true">
      <span class="spot"></span>
      <span class="show-car" data-car="${esc(p.skin || 'dash')}"></span>
      <span class="floor"></span>
    </div>
  </section>
  <section class="pg-band">
    <div class="figures wide">
      ${stat(num(p.wins), 'wins')}${stat(num(p.races), 'races')}${stat(p.streak, 'days in a row')}${stat(p.bestCombo, 'best run of right letters')}${stat(num(p.solo.finished), 'goes on their own')}
    </div>
    ${ach.length ? `<h2 class="band-title">Awards <small>${ach.length} of ${CATALOGUE.length}</small></h2><div class="ach-grid">${ach.map((a) => `<div class="ach got" title="${esc(a.desc)}"><span class="ach-icon">${a.icon}</span><span class="ach-name">${esc(a.name)}</span></div>`).join('')}</div>` : ''}
  </section>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: { '@type': 'Person', name: p.name, identifier: p.id, url: `${origin}/u/${p.id}` },
  };
  return layout({ origin, path: `/u/${p.id}`, title, description, image, body, jsonLd, page: 'profile' });
}

/* ------------------------------------------------------------- rankings */

/**
 * /leaderboard and /leaderboard/:country. Every board is on the page (one
 * tab each), so search engines read them all; the first one with anybody on
 * it opens. `top` carries the rows per category.
 */
function leaderboardPage({ origin, scope, top, countries, dailyRows, season, teams, countryRows }) {
  const global = scope === 'global';
  const cname = global ? null : nameOf(scope);
  const title = global ? 'Fastest people on TypeDash · typing speed rankings' : `Fastest typists in ${cname} · TypeDash`;
  const description = global
    ? `The top ranked racers on TypeDash by points, typing speed (WPM) and daily streak, worldwide. Updated live after every race.`
    : `The top ranked TypeDash racers from ${cname} by points, typing speed (WPM) and daily streak. Updated live after every race.`;
  const path = global ? '/leaderboard' : `/leaderboard/${scope}`;
  const pts = (v) => `${num(v)} pts`;
  const tabs = [
    { id: 'season', label: 'Season', title: `Season ${season ? season.number : ''}, points this month`, rows: top.season || [], fmt: pts },
    { id: 'points', label: 'All time', title: 'Points, all time', rows: top.points || [], fmt: pts },
    { id: 'wpm', label: 'Fastest', title: 'Fastest, best words a minute', rows: top.wpm || [], fmt: (v) => `${v} a min` },
    { id: 'streak', label: 'Days in a row', title: 'Most days in a row', rows: top.streak || [], fmt: (v) => `${v} ${v === 1 ? 'day' : 'days'}` },
  ];
  if (global && dailyRows) tabs.push({ id: 'daily', label: 'Today', title: "Today's paragraph, fastest", rows: dailyRows, fmt: (v) => `${v} a min`, empty: "Nobody has finished today's paragraph yet." });
  if (global && teams) tabs.push({ id: 'teams', label: 'Teams', title: 'Teams, this season', rows: teams, fmt: pts, href: (t) => `/t/${t.id}`, country: false, empty: 'No teams on the board yet. Make one from your Team page.' });
  if (global && countryRows) tabs.push({ id: 'countries', label: 'Countries', title: 'Countries, this week', rows: countryRows, fmt: pts, href: (c) => `/leaderboard/${c.country}`, empty: 'No points this week yet.' });
  const open = (tabs.find((t) => t.rows.length) || tabs[0]).id;
  const lead = (top.season && top.season.length ? top.season : top.points) || [];
  const daysLeft = season ? Math.max(0, Math.ceil((season.endsAt - Date.now()) / 86400000)) : null;
  const heading = global ? 'Rankings' : `Fastest in ${esc(cname)}`;
  const links = countries.filter((c) => c !== scope).map((c) => `<a class="chip-btn" href="/leaderboard/${esc(c)}">${flag(c)} ${esc(nameOf(c) || c)}</a>`).join('');
  const body = `
  <section class="pg-hero lb-hero" data-hero>
    <figure class="pg-photo lb-photo hero-media" aria-hidden="true">${photo('rankings', '', { h: 1131 })}</figure>
    <div class="pg-copy lb-copy">
      ${global ? '' : `<p class="crumb hero-late" style="--i:0"><a href="/leaderboard">Rankings</a><span class="flag-disc">${flag(scope)}</span></p>`}
      ${heroTitle(heading)}
      <p class="pg-lead hero-late" style="--i:2">${season ? `Season ${season.number} ends in ${plural(daysLeft, 'day')}.` : 'Updated after every race.'}</p>
    </div>
    <div class="lb-podium hero-late" style="--i:2">${podium(lead, (v) => pts(v), { showCountry: global })}</div>
  </section>

  <section class="lb-boards" data-tabs>
    <div class="tabs lb-tabs" role="tablist" aria-label="Boards">${tabs.map((t) => `<button class="tab${t.id === open ? ' on' : ''}" role="tab" type="button" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${t.id === open}" tabindex="${t.id === open ? 0 : -1}" data-cat="${t.id}">${t.label}</button>`).join('')}</div>
    ${tabs.map((t) => `<div class="lb-panel" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}"${t.id === open ? '' : ' hidden'}>
      <h2 class="sr-only">${esc(t.title)}</h2>
      ${lanes(t.rows, t.fmt, { showCountry: global && t.country !== false, href: t.href, empty: t.empty, label: t.label })}
    </div>`).join('')}
  </section>

  ${global && season && season.past.length ? `<section class="pg-band past">
    <h2 class="band-title">Past seasons</h2>
    <div class="past-seasons">${season.past.map((s) => `
      <div class="past-season"><b>Season ${s.number}</b><span class="passage-meta">${esc(s.key)}, ${plural(s.players, 'person', 'people')}</span>
        <ol>${s.top.map((t) => `<li><span class="lr-flag">${flag(t.country)}</span><a href="/u/${esc(t.id)}">${esc(t.name)}</a> <small>${num(t.points)}</small></li>`).join('')}</ol></div>`).join('')}</div>
  </section>` : ''}
  ${links ? `<section class="pg-band countries"><h2 class="band-title">The fastest in each country</h2><div class="chips wrap">${links}</div></section>` : ''}
  <section class="pg-closer"><a class="btn primary big-cta" href="/app">Race for a place</a></section>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: global ? 'Fastest people on TypeDash' : `Fastest people in ${cname}`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: top.points.length,
    itemListElement: top.points.slice(0, 25).map((r) => ({ '@type': 'ListItem', position: r.rank, name: r.name, url: `${origin}/u/${r.id}` })),
  };
  return layout({ origin, path, title, description, body, jsonLd, nav: 'leaderboard', page: 'leaderboard', preload: '/img/rankings-1600.webp' });
}

/* ------------------------------------------------------------- paragraphs */

/** The key a set of paragraphs lives under: a language code, or a drill type. */
const setKeyOf = (p) => (p.category === 'prose' ? p.lang : p.category);
const setPathOf = (p) => (p.category === 'prose' ? `/practice/lang/${p.lang}` : `/practice/drill/${p.category}`);

/** Everything grouped into the sets the chooser offers, in the catalogue's own order. */
function practiceSets(passages, langs = {}, categories = {}) {
  const sets = [];
  for (const p of passages) {
    const key = setKeyOf(p);
    let set = sets.find((x) => x.key === key);
    if (!set) {
      const isDrill = p.category !== 'prose';
      sets.push((set = {
        key,
        path: setPathOf(p),
        kind: isDrill ? 'drill' : 'language',
        name: isDrill ? (categories[p.category] || { name: p.category }).name : (langs[p.lang] || { native: p.lang }).native,
        english: isDrill ? '' : (langs[p.lang] || { name: p.lang }).name,
        note: isDrill ? (categories[p.category] || { desc: '' }).desc : '',
        lang: p.lang,
        items: [],
      }));
    }
    set.items.push(p);
  }
  for (const set of sets) set.stages = new Set(set.items.map((p) => p.stage || 1)).size;
  return sets;
}

/** The first sentence (or so) of the easiest paragraph in a set: what the set sounds like. */
function sampleOf(set, max = 96) {
  const first = set.items.filter((p) => (p.stage || 1) === 1)[0] || set.items[0];
  if (!first) return '';
  const t = first.text;
  const stop = t.slice(0, max).search(/[.!?;](\s|$)/);
  if (stop > 24) return t.slice(0, stop + 1);
  return t.length > max ? `${t.slice(0, max).replace(/\s+\S*$/, '')}…` : t;
}

/** The chooser: one card per language and drill, each showing a line of itself. */
function practiceIndexPage({ origin, passages, records, langs = {}, categories = {} }) {
  const sets = practiceSets(passages, langs, categories);
  const sample = passages.find((p) => p.lang === 'en' && p.category === 'prose') || passages[0];
  const langNames = Object.keys(langs).map((l) => langs[l].native);
  const title = 'Typing practice passages · TypeDash';
  // the meta description keeps the words people search for; the page itself says it plainly
  const description = `${passages.length} typing practice passages (WPM test paragraphs) in ${langNames.length} languages — ${langNames.join(', ')} — plus code and number drills, sorted into stages from easy to hard. Free, no sign-up.`;
  const typer = sets.map((s) => ({ label: s.name, lang: s.kind === 'language' ? s.lang : 'en', text: sampleOf(s, 70) }));
  const card = (set) => `
    <a class="set-card card" href="${esc(set.path)}" data-kind="${set.kind}" lang="${esc(set.kind === 'language' ? set.lang : 'en')}">
      <span class="set-name">${esc(set.name)}</span>
      <span class="set-sub">${esc(set.english && set.english !== set.name ? set.english : set.note)}</span>
      <span class="set-sample" aria-hidden="true">${esc(sampleOf(set))}</span>
      <span class="set-meta"><b>${set.items.length}</b> paragraphs<span class="stagebar" title="${set.stages} stages, easy to hard">${Array.from({ length: set.stages }, (_, i) => `<i style="--s:${i}"></i>`).join('')}</span></span>
      ${set.items.some((p) => p.chain) ? chainProgress('on-card') : ''}
    </a>`;
  const body = `
  <section class="pg-hero pr-hero" data-hero>
    <div class="pg-copy">
      ${heroTitle('Paragraphs')}
      <p class="pg-lead hero-late" style="--i:1">${passages.length} to type in ${langNames.length} languages, plus code and numbers. Each set runs from easy to hard.</p>
      <div class="pg-cta hero-late" style="--i:2"><a class="btn primary big-cta" href="/app#practice">Type a random one</a><a class="text-link" href="/daily">Today's paragraph</a></div>
    </div>
    <figure class="pg-photo pr-photo hero-media">
      ${photo('paragraphs', '')}
      <div class="typer" data-typer="${attrJson(typer)}" aria-hidden="true">
        <span class="typer-lang">${esc(typer[0].label)}</span>
        <span class="typer-text">${esc(typer[0].text)}</span>
      </div>
    </figure>
  </section>

  <section class="pr-sets" aria-label="Languages and drills">
    <div class="set-grid langs">${sets.filter((x) => x.kind === 'language').map(card).join('')}</div>
    <div class="set-grid drills">${sets.filter((x) => x.kind === 'drill').map(card).join('')}</div>
  </section>
  ${paintScript()}

  <section class="pg-band embed-band">
    <div class="embed-copy">
      <h2 class="band-title">Put a typing box on your own site</h2>
      <p>One script tag. Your visitors type a paragraph without leaving your page.</p>
      <a class="text-link" href="/embed?passage=${esc(sample ? sample.id : 'trains')}">See it working</a>
    </div>
    <pre class="embed-code"><code>&lt;script src="${esc(origin)}/embed.js" data-passage="${esc(sample ? sample.id : 'trains')}" data-pacer="50"&gt;&lt;/script&gt;</code></pre>
  </section>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TypeDash typing practice',
    itemListElement: sets.map((set, i) => ({ '@type': 'ListItem', position: i + 1, name: set.name, url: `${origin}${set.path}` })),
  };
  return layout({ origin, path: '/practice', title, description, body, jsonLd, nav: 'practice', page: 'practice', preload: '/img/paragraphs-1600.webp' });
}

/** One set: its stages side by side, easiest first; a car drives the road above them. */
function practiceSetPage({ origin, set, records, allSets }) {
  const rec = Object.fromEntries(records.map((r) => [r.passageId, r]));
  const title = `${set.name} typing practice · ${set.items.length} passages · TypeDash`;
  const chained = set.items.some((p) => p.chain);   // English: the paragraphs open in order
  const description = `${set.items.length} ${set.name} typing practice passages, sorted into ${set.stages} stages from easy to hard. Type ${chained ? 'them one after another' : 'any of them'} in your browser — free, no sign-up.`;
  const meta = (p) => {
    const r = rec[p.id];
    return `<span class="passage-meta">${p.words} words${r ? ` · fastest so far ${r.wpm} a min by ${flag(r.country)} ${esc(r.name)}` : ' · nobody has raced it yet'}</span>`;
  };
  const item = (p) => `<li><a href="/practice/${esc(p.id)}"><b>${esc(p.title)}</b></a> ${meta(p)}</li>`;
  // a numbered card; paintChain sets the player's own state (next, done, open, locked)
  const chainItem = (p) => `<li class="ps" data-id="${esc(p.id)}" data-n="${p.chain}" data-state="${p.chain === 1 ? 'next' : cfg.PRACTICE_LOCK ? 'locked' : 'open'}">
        <span class="ps-n">${p.chain}</span>
        <span class="ps-body">
          <span class="ps-flag">Up next</span>
          <a class="ps-title" href="/practice/${esc(p.id)}"><b>${esc(p.title)}</b></a>
          ${meta(p)}
          <span class="ps-hint">Finish <b data-need>${p.chain - 1}</b> to unlock</span>
          <span class="sr-only ps-done">Done</span>
        </span>
        <span class="ps-side">
          <a class="ps-go" href="/app#practice/${esc(p.id)}" aria-label="Type paragraph ${p.chain}"></a>
          <span class="ps-lock">${LOCK}</span>
        </span>
      </li>`;
  const stages = STAGES
    .map((st) => ({ st, items: set.items.filter((p) => (p.stage || 1) === st.id) }))
    .filter((x) => x.items.length);
  const first = stages[0] && stages[0].items[0];
  const others = allSets.filter((x) => x.key !== set.key);
  const body = `
  <section class="pg-hero set-hero" data-hero>
    <div class="pg-copy">
      <p class="crumb hero-late" style="--i:0"><a href="/practice">Paragraphs</a></p>
      ${heroTitle(esc(set.name))}
      <p class="pg-lead hero-late" style="--i:2">${set.items.length} paragraphs in ${plural(set.stages, 'stage')}.${chained ? '' : ' Nothing is locked.'}</p>
      ${chained ? chainProgress('hero-late', 2) : ''}
      ${first ? `<div class="pg-cta hero-late" style="--i:3"><a class="btn primary big-cta" href="/app#practice/${esc(first.id)}"${chained ? ' data-chain-cta' : ''}>Start with the first one</a></div>` : ''}
    </div>
    <div class="stage-road hero-media" data-stage-road aria-hidden="true">
      <span class="sr-track"><span class="sr-car" data-car="${set.kind === 'drill' ? 'hatch' : 'dash'}"></span></span>
      <ol class="sr-marks" style="--n:${stages.length}">${stages.map((x) => `<li><i></i>${esc(x.st.name)}</li>`).join('')}</ol>
    </div>
  </section>

  <section class="stages" style="--n:${stages.length}"${chained ? ' data-chain-list' : ''}>
    ${stages.map((x) => `<div class="stage card s${x.st.id}">
      <div class="stage-head">
        <span class="stage-no">Stage ${x.st.id}</span>
        <b>${esc(x.st.name)}</b>
        <span class="stage-note">${esc(x.st.note)}</span>
        <span class="stage-count">${plural(x.items.length, 'paragraph')}</span>
      </div>
      <ol class="passage-list${chained ? ' chain-list' : ''}">${x.items.map(chained ? chainItem : item).join('')}</ol>
    </div>`).join('')}
  </section>
  ${chained ? paintScript() : ''}

  <section class="pg-band">
    <h2 class="band-title">Other languages and drills</h2>
    <div class="chips wrap">${others.map((o) => `<a class="chip-btn" href="${esc(o.path)}">${esc(o.name)} <small>${o.items.length}</small></a>`).join('')}</div>
  </section>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${set.name} typing practice`,
    itemListElement: stages.flatMap((x) => x.items).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: `${origin}/practice/${p.id}` })),
  };
  return layout({ origin, path: set.path, title, description, body, jsonLd, nav: 'practice', page: 'practice-set' });
}

/** One paragraph: the text itself is the page, and it types itself at the record's pace. */
function practicePage({ origin, passage, record, prev, next, langs = {}, categories = {} }) {
  const p = passage;
  const langName = langs[p.lang] ? langs[p.lang].native : p.lang;
  const catName = categories[p.category] ? categories[p.category].name : p.category;
  const stage = STAGES[(p.stage || 1) - 1] || STAGES[0];
  const setPath = setPathOf(p);
  const setName = p.category !== 'prose' ? catName : langName;
  const title = `Typing practice: “${p.title}” (${p.words} words, ${p.lang === 'en' && p.category === 'prose' ? 'English' : `${langName}${p.category !== 'prose' ? ` · ${catName}` : ''}`}) · TypeDash`;
  const description = `${p.text.slice(0, 150).replace(/\s+\S*$/, '')}… Type this ${p.words}-word paragraph in your browser${record ? `, then race a replay of the fastest run so far (${record.wpm} words a minute)` : ''}. Free, no sign-up.`;
  // an English paragraph opens once every one before it is done: a new visitor sees it locked (paintChain knows better)
  const gate = p.chain ? ` data-chain-gate data-id="${esc(p.id)}" data-before="${esc(CHAIN.slice(0, p.chain - 1).map((x) => x.id).join(' '))}" data-state="${p.chain > 1 && cfg.PRACTICE_LOCK ? 'locked' : 'open'}"` : '';
  const body = `
  <section class="pg-hero psg-hero" data-hero>
    <div class="pg-copy">
      <p class="crumb hero-late" style="--i:0"><a href="/practice">Paragraphs</a><a href="${esc(setPath)}">${esc(setName)}</a></p>
      ${heroTitle(esc(p.title))}
      <p class="psg-meta hero-late" style="--i:2"><span class="stage-no">Stage ${stage.id}</span><b>${esc(stage.name)}</b>${p.chain ? `<span>Paragraph ${p.chain}</span>` : ''}<span>${p.words} words</span><span>${p.text.length} characters</span></p>
    </div>
  </section>

  <section class="sheet hero-media" data-replay="${attrJson({ wpm: record ? record.wpm : 0, skin: record ? record.skin : 'dash' })}">
    <blockquote class="passage-text sheet-text" lang="${esc(p.lang)}">${esc(p.text)}</blockquote>
    <div class="sheet-lane" aria-hidden="true"><span class="sheet-road"><span class="sheet-car" data-car="${esc(record ? record.skin || 'dash' : 'dash')}"></span></span><span class="sheet-wpm"><b>0</b> a min</span></div>
  </section>

  <section class="psg-actions"${gate}>
    <div class="pg-cta gate-open">
      <a class="btn primary big-cta" href="/app#practice/${esc(p.id)}">Type this paragraph</a>
      ${record ? `<a class="btn ghost-btn" href="/app#practice/${esc(p.id)}/ghost/wr">Race the record</a>` : ''}
    </div>
    ${p.chain ? `<div class="pg-cta gate-locked">
      <span class="btn big-cta lock-pill">${LOCK}Locked</span>
      <a class="text-link" href="/app#practice/${esc(CHAIN[0].id)}" data-gate-next>Finish paragraph&nbsp;<b>1</b>&nbsp;first</a>
    </div>` : ''}
    ${record
    ? `<p class="record-line"><span class="rec-label">Record</span><b>${record.wpm} a min</b><span>${flag(record.country)} ${esc(record.name)}, ${record.accuracy}% right in ${fmtTime(record.time)}</span></p>`
    : '<p class="record-line dim">No record yet. The first clean run sets it.</p>'}
  </section>
  ${p.chain ? paintScript() : ''}

  <nav class="passage-nav" aria-label="More paragraphs">
    ${prev ? `<a class="pn prev" href="/practice/${esc(prev.id)}"><small>Previous</small><b>${esc(prev.title)}</b></a>` : '<span></span>'}
    ${next ? `<a class="pn next" href="/practice/${esc(next.id)}"><small>Next</small><b>${esc(next.title)}</b></a>` : '<span></span>'}
  </nav>`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, text: p.text, wordCount: p.words, inLanguage: p.lang, url: `${origin}/practice/${p.id}`, isAccessibleForFree: true };
  return layout({ origin, path: `/practice/${p.id}`, title, description, body, jsonLd, nav: 'practice', page: 'passage' });
}

/* ------------------------------------------------------------- today */

/** /daily — today's paragraph as the hero, typed live at the leader's pace; today's board; yesterday's podium. */
function dailyPage({ origin, today, yesterday }) {
  const d = today;
  const title = `Today's paragraph #${d.number} — “${d.passage.title}” · TypeDash`;
  const leader = d.top[0] ? `Best so far: ${d.top[0].wpm} words a minute by ${d.top[0].name}.` : 'Nobody has had a go yet.';
  const description = `Today's paragraph: ${d.passage.words} words, the same one for everybody, one proper go at it. ${num(d.players)} have tried it so far. ${leader}`;
  const rows = (list) => list.map((t) => ({ id: t.id, rank: t.rank, name: t.name, country: t.country, skin: t.skin, value: t.wpm }));
  const wpm = (v) => `${v} a min`;
  const lead = d.top[0] || null;
  const body = `
  <section class="pg-hero dy-hero" data-hero>
    <div class="pg-copy dy-copy">
      <p class="dy-num hero-late" style="--i:0" aria-hidden="true">#${d.number}</p>
      ${heroTitle("Today's paragraph")}
      <p class="dy-title hero-late" style="--i:2">“${esc(d.passage.title)}”</p>
      <p class="pg-lead hero-late" style="--i:2">The same ${d.passage.words} words for everyone. Your first finished go is the one that counts.</p>
      <div class="pg-cta hero-late" style="--i:3"><a class="btn primary big-cta" href="/app#daily">Have a go</a>
        <span class="dy-clock" data-countdown="${d.endsAt}">New one in <b>${(() => { const ms = Math.max(0, d.endsAt - Date.now()); const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000); return h > 0 ? `${h}h ${m}m` : `${m}m`; })()}</b></span>
      </div>
    </div>
    <figure class="pg-photo dy-photo hero-media">
      ${photo('today', '', { h: 1200 })}
      <div class="sheet paper" data-replay="${attrJson({ wpm: lead ? lead.wpm : 0, daily: true, skin: lead ? lead.skin : 'dash', name: lead ? lead.name : '' })}">
        <blockquote class="passage-text sheet-text" lang="en">${esc(d.passage.text)}</blockquote>
        <div class="sheet-lane" aria-hidden="true"><span class="sheet-road"><span class="sheet-car" data-car="${esc(lead ? lead.skin || 'dash' : 'dash')}"></span></span><span class="sheet-wpm"><b>0</b> a min</span></div>
        <p class="sheet-who" aria-hidden="true">${lead ? `Replaying ${esc(lead.name)}, today's fastest` : 'At a steady 60 words a minute'}</p>
      </div>
    </figure>
  </section>

  <section class="pg-band dy-board">
    <h2 class="band-title">Today's top 10 <small>${plural(d.players, 'person has', 'people have')} tried it</small></h2>
    ${lanes(rows(d.top), wpm, { empty: 'Nobody yet. Finish it first and the top spot is yours.', label: "Today's top 10" })}
  </section>
  ${yesterday && yesterday.top.length ? `<section class="pg-band dy-yesterday">
    <h2 class="band-title">Yesterday <small>#${yesterday.number}, “${esc(yesterday.title)}”</small></h2>
    ${podium(rows(yesterday.top), wpm)}
  </section>` : ''}`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: `${origin}/daily`, dateModified: new Date().toISOString() };
  return layout({ origin, path: '/daily', title, description, image: `${origin}/og/daily.png`, body, jsonLd, nav: 'daily', page: 'daily', preload: '/img/today-1600.webp' });
}

/* ------------------------------------------------------------- how to play */

function howPage({ origin }) {
  const title = 'How to play TypeDash · the typing race, explained';
  const description = 'Type the paragraph and every right letter moves your car. Keep a clean run for more points, fill the boost, catch the bonus words, race a robot or a replay, and come back for one paragraph a day.';
  const step = (cls, art, name, line) => `<li class="${cls}"><span class="how-art" aria-hidden="true">${art}</span><b>${name}</b><span class="how-line">${line}</span></li>`;
  const body = `
  <section class="pg-hero how-hero" data-hero>
    <div class="pg-copy">
      ${heroTitle('How to play')}
      <p class="pg-lead hero-late" style="--i:1">Type the paragraph. Every right letter moves your car.</p>
      <div class="pg-cta hero-late" style="--i:2"><a class="btn primary big-cta" href="/app">Play now</a></div>
    </div>
    <figure class="pg-photo how-photo hero-media">
      ${photo('how', '', { h: 974 })}
      <div class="tryit" data-tryit>
        <p class="tryit-ask" id="tryit-ask">Type <b>race</b> to move the car</p>
        <div class="tryit-lane" aria-hidden="true"><span class="tryit-road"><span class="tryit-car" data-car="dash" style="--c:#B8612E"></span></span><i class="tryit-flag"></i></div>
        <label class="tryit-field"><span class="sr-only">Type the word race</span><span class="tryit-word" aria-hidden="true"><i>r</i><i>a</i><i>c</i><i>e</i></span><input class="tryit-input" type="text" maxlength="12" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-describedby="tryit-ask"></label>
        <p class="tryit-done" role="status" aria-live="polite"></p>
      </div>
    </figure>
  </section>

  <ol class="how how-steps">
    ${step('how-type', '<span class="ha-text"><i>t</i><i>y</i><i>p</i><i class="fix"><b>o</b><b>e</b></i></span><span class="ha-car" data-car="dash" style="--c:#B8612E"></span>', 'Type what you see', 'Right letters move your car. Fix the red ones.')}
    ${step('how-combo', '<span class="ha-combo"><b>12</b><small>in a row</small><em>2×</em></span>', 'Keep a clean run', 'Words in a row with no mistakes are worth more.')}
    ${step('how-boost', '<span class="ha-meter"><i></i></span><span class="ha-flame"></span>', 'Fill the boost', 'Full bar: a faster car and double points.')}
    ${step('how-gold', '<span class="ha-gold">letter<em>+250</em></span>', 'Catch the ✦ words', 'Three per paragraph. No mistakes, bonus points.')}
    ${step('how-solo', '<span class="ha-lane"><i class="me"><span data-car="dash" style="--c:#B8612E"></span></i><i class="ghost"><span data-car="dash" style="--c:#8C8378"></span></i></span>', 'Race a robot or a replay', 'Keeps your days in a row going. Points only come from real people.')}
    ${step('how-daily', '<span class="ha-cal"><small>today</small><b>1</b></span>', 'One paragraph a day', 'The same for everyone. One proper go counts.')}
    ${step('how-team', '<span class="ha-team"><i data-car="hatch" style="--c:#7E9A6D"></i><i data-car="dash" style="--c:#B8612E"></i><i data-car="muscle" style="--c:#3E6A82"></i></span>', 'Play with friends', 'A team adds up everything you all score. Your country does too.')}
  </ol>

  <details class="how-tech">
    <summary>How it works underneath</summary>
    <ul class="how-list">
      <li><b>Ten server snapshots a second</b>, stamped with server time and smoothed in your browser, so cars glide instead of jumping.</li>
      <li><b>The server checks every race.</b> Progress is validated and rate-limited, and the race clock is synced so everyone sees GO at the same moment.</li>
      <li><b>Typing on your own never touches the server while you type.</b> One result is sent at the end and checked against how fast a person can type.</li>
    </ul>
  </details>
  <section class="pg-closer"><a class="btn primary big-cta" href="/app">Play now</a></section>`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to play TypeDash', step: ['Type what you see', 'Keep a clean run', 'Fill the boost', 'Catch the bonus words', 'Race a robot or a replay', 'One paragraph a day', 'Play with friends'].map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name })) };
  return layout({ origin, path: '/how', title, description, body, jsonLd, nav: 'how', page: 'how', preload: '/img/how-1600.webp' });
}

/* ------------------------------------------------------------- robots, sitemap */

function robots(origin) {
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /og/\nDisallow: /r/\n\nSitemap: ${origin}/sitemap.xml\n`;
}

function sitemap(origin, urls) {
  const items = urls.map((u) => `  <url><loc>${esc(origin + u.path)}</loc>${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}${u.priority != null ? `<priority>${u.priority}</priority>` : ''}</url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

/* ------------------------------------------------------------- team page */

/** /t/:id — a team's public page. */
function teamPage(t, origin) {
  const title = `[${t.tag}] ${t.name} · TypeDash team`;
  const description = `${t.size} member${t.size === 1 ? '' : 's'} · ${num(t.season.points)} points this season${t.season.rank ? ` (#${t.season.rank} of ${t.season.of})` : ''} · ${num(t.allTime.points)} all time. Every ranked point a member earns counts for the team.`;
  const fig = (v, l) => `<div class="figure"><b>${esc(v)}</b><span>${esc(l)}</span></div>`;
  const convoy = t.members.slice(0, 5);
  const body = `
  <section class="pg-hero team-hero" data-hero>
    <div class="pg-copy">
      <p class="team-tag-big hero-late" style="--i:0">[${esc(t.tag)}]</p>
      ${heroTitle(esc(t.name), 'team-name')}
      <p class="pg-lead hero-late" style="--i:2">${t.size} of ${t.max} members. Together since ${new Date(t.createdAt).toISOString().slice(0, 10)}.</p>
      <div class="figures hero-late" style="--i:3">${fig(num(t.season.points), 'season points')}${fig(t.season.rank ? `#${t.season.rank}` : '—', 'this season')}${fig(num(t.allTime.points), 'all time')}</div>
    </div>
    <div class="convoy hero-media" aria-hidden="true">${convoy.map((m, i) => `<span class="convoy-car" style="--i:${i}" data-car="${esc(m.skin || 'dash')}"></span>`).join('')}<span class="convoy-road"></span></div>
  </section>
  ${t.trophies.length ? `<p class="trophies">${t.trophies.map((x) => `<span class="rank-chip top">Season ${x.number}, ${place(x.rank)}</span>`).join('')}</p>` : ''}
  <section class="pg-band">
    <h2 class="band-title">Members</h2>
    <table class="results-table board-table"><thead><tr><th>Who</th><th class="num">Season</th><th class="num">All time</th><th class="num">Best a min</th></tr></thead><tbody>${t.members.map((m) => `
      <tr><td><span class="lr-flag">${flag(m.country)}</span> <a href="/u/${esc(m.id)}">${esc(m.name)}</a>${m.owner ? ' <span class="tag">OWNER</span>' : ''}</td><td class="num">${num(m.season)}</td><td class="num">${num(m.points)}</td><td class="num">${m.bestWpm}</td></tr>`).join('')}</tbody></table>
  </section>
  <section class="pg-closer"><a class="btn primary big-cta" href="/app">Race them</a><a class="text-link" href="/leaderboard">Rankings</a></section>`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'SportsTeam', name: t.name, alternateName: t.tag, url: `${origin}/t/${t.id}`, memberOf: { '@type': 'Organization', name: 'TypeDash' } };
  return layout({ origin, path: `/t/${t.id}`, title, description, body, jsonLd, page: 'team' });
}

/* ------------------------------------------------------------- embed widget */

/** /embed — the widget document itself (self-contained: inline styles, one module). */
function embedPage({ origin, passage }) {
  const title = passage ? `TypeDash · “${passage.title}”` : 'TypeDash typing race';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="${ICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${FONTS}" rel="stylesheet">
  <style>
    :root { --bg: #f7f3ee; --panel: #ffffff; --b: rgba(58, 42, 25,.1); --text: #2a2521; --muted: #7a7267; --accent: #d97706; --accent2: #0d9fc4; --gold: #b45309; --red: #e04a61; }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 Inter, system-ui, sans-serif; }
    .wrap { padding: 16px 18px 14px; }
    .head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
    .brand { font: 700 1.05rem 'Space Grotesk', Inter, sans-serif; text-decoration: none; color: var(--text); display: inline-flex; gap: 6px; align-items: center; }
    .brand span { color: #f59e0b; }
    .stats { display: flex; gap: 8px; font-variant-numeric: tabular-nums; }
    .stat { padding: 4px 10px; border-radius: 999px; background: #ffffff; border: 1px solid var(--b); font-size: .8rem; color: var(--muted); }
    .stat b { color: var(--accent2); font: 700 .95rem 'Space Grotesk', Inter, sans-serif; margin-right: 4px; }
    .status { color: var(--muted); font-size: .82rem; margin: 0 0 8px; min-height: 1.3em; }
    .bars { display: grid; gap: 6px; margin: 8px 0 12px; }
    .bar { position: relative; height: 10px; border-radius: 999px; background: rgba(58, 42, 25,.08); border: 1px solid rgba(58, 42, 25,.06); overflow: hidden; }
    .bar i { display: block; height: 100%; width: 0; border-radius: 999px; transition: width .12s linear; }
    .bar.me i { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
    .bar.pacer i { background: rgba(58, 42, 25,.2); }
    .bar-label { font-size: .7rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
    .passage-wrap { position: relative; padding: 14px 16px; border-radius: 14px; background: var(--panel); border: 1px solid var(--b); cursor: text; }
    .passage { font: 1.02rem/1.8 'JetBrains Mono', ui-monospace, monospace; color: #6b6359; max-height: 190px; overflow-y: auto; user-select: none; }
    .passage .w { display: inline-block; white-space: pre; }
    .passage .c.ok { color: var(--text); }
    .passage .c.bad { color: #fff; background: rgba(224,74,97,.5); border-radius: 3px; }
    .passage .c.cur { background: rgba(217, 119, 6,.18); border-radius: 3px; box-shadow: -2px 0 0 var(--accent2); }
    .passage .w.gold .c { color: #a9820a; }
    .passage .w.gold.gold-hit .c { color: #0d7d4c; }
    .passage.locked { filter: saturate(.6); }
    .hidden-input { position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; border: 0; padding: 0; font-size: 16px; }
    .result { margin-top: 12px; padding: 14px 16px; border-radius: 14px; background: rgba(217, 119, 6,.1); border: 1px solid rgba(217, 119, 6,.35); }
    .result-grid { display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap; }
    .result-grid b { font: 700 2rem/1 'Space Grotesk', Inter, sans-serif; color: var(--accent2); }
    .result-grid span { color: var(--muted); font-size: .8rem; }
    .result p { margin: 8px 0 10px; font-size: .9rem; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 10px; border: 1px solid var(--b); background: #f0eae2; color: var(--text); font: 600 .9rem Inter, sans-serif; text-decoration: none; cursor: pointer; }
    .btn.primary { background: #f59e0b; border-color: transparent; color: #2a2521; }
    .foot { margin-top: 10px; font-size: .74rem; color: var(--muted); text-align: right; }
    .foot a { color: var(--text); }
    [hidden] { display: none !important; }
  </style>
  <!-- Linked here as well as by js/embed.js, so the first paint already has
       the current look instead of flashing the fallback colours above. -->
  <link rel="stylesheet" href="/css/embed.css">
</head>
<body>
  <div class="wrap">
    <div class="head">
      <a class="brand" href="${esc(origin)}/?ref=embed" target="_blank" rel="noopener"><span>⚡</span>TypeDash</a>
      <div class="stats"><div class="stat"><b id="e-wpm">0</b>a min</div><div class="stat"><b id="e-acc">100%</b>right</div><div class="stat"><b id="e-time">0:00.0</b></div></div>
    </div>
    <p class="status" id="e-status">Loading a paragraph…</p>
    <div class="bars">
      <div class="bar-label">You</div><div class="bar me"><i id="bar-me"></i></div>
      <div class="bar-label" id="pacer-label">Pacer</div><div class="bar pacer"><i id="bar-pacer"></i></div>
    </div>
    <div class="passage-wrap" id="passage-wrap">
      <input id="hidden-input" class="hidden-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Typing input">
      <div id="passage" class="passage locked"></div>
    </div>
    <div class="result" id="result" hidden>
      <div class="result-grid"><div><b id="r-wpm">0</b> <span>words a min</span></div><div><b id="r-acc">100%</b> <span>typed right</span></div><div><b id="r-time">0:00.0</b> <span>time</span></div></div>
      <p id="r-line"></p>
      <div class="row">
        <a class="btn primary" id="btn-play" href="${esc(origin)}/app?ref=embed" target="_blank" rel="noopener">Race other people on TypeDash</a>
        <button class="btn" id="btn-again" type="button">↻ Try again</button>
      </div>
    </div>
    <p class="foot">Race other people, today's paragraph and the fastest people at <a href="${esc(origin)}/app?ref=embed" target="_blank" rel="noopener">${esc(origin.replace(/^https?:\/\//, ''))}</a></p>
  </div>
  <script type="module" src="/js/embed.js"></script>
</body>
</html>`;
}

/* ------------------------------------------------------------- not found */

function notFoundPage(origin, path) {
  const body = `
  <section class="nf" data-hero>
    <div class="nf-lane hero-media" aria-hidden="true"><span class="nf-road"><span class="nf-car" data-car="dash"></span></span><i class="nf-finish"></i></div>
    ${heroTitle('Off the track')}
    <p class="pg-lead hero-late" style="--i:1">That link has expired or never existed.</p>
    <div class="pg-cta hero-late" style="--i:2"><a class="btn primary big-cta" href="/app">Play now</a><a class="text-link" href="/">Home</a></div>
  </section>`;
  return layout({ origin, path, title: 'Not found · TypeDash', description: 'That page does not exist.', body, noindex: true, page: 'notfound' });
}

module.exports = {
  HEAD_SCRIPT, practiceSets, navbar, footer, homePage, howPage,
  practiceSetPage, layout, sharePage, shareMeta, profilePage, leaderboardPage, practiceIndexPage, practicePage, dailyPage, teamPage, embedPage, robots, sitemap, notFoundPage, esc, num, fmtTime, flag };
