'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const cfg = require('./config');
const { randomId, sanitizeText, sanitizeCountry, sanitizeSkin } = require('./util');
const Player = require('./Player');
const RoomManager = require('./RoomManager');
const Store = require('./store');
const { Accounts } = require('./accounts');
const { Leaderboards } = require('./leaderboards');
const { CATALOGUE } = require('./achievements');
const passages = require('./passages');
const solo = require('./solo');
const { Daily } = require('./daily');
const { Ghosts } = require('./ghosts');
const { Shares } = require('./share');
const { Seasons } = require('./seasons');
const { Teams } = require('./teams');
const { Notify } = require('./notify');
const og = require('./og');
const pages = require('./pages');
const progression = require('./progression');
const countries = require('./countries');
const { dayKey } = require('./accounts');
const cx = require('./cx');
const { ipOf, PerIp, Sockets } = require('./limits');

// Must match public/js/skins.js. Skins are cosmetic; the server only validates the id.
const SKINS = ['dash', 'bolt', 'hatch', 'muscle', 'flame', 'pickup', 'rocket', 'checker', 'nova'];

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

const store = new Store(path.resolve(__dirname, '..', cfg.DATA_FILE));
const accounts = new Accounts(store);
const boards = new Leaderboards(accounts);
const manager = new RoomManager({ accounts, boards });
const daily = new Daily(store, accounts);
const ghosts = new Ghosts(store);
manager.ghosts = ghosts;
const shares = new Shares(store, { keep: cfg.SHARE_KEEP });
manager.shares = shares;
const teams = new Teams(store, accounts);
boards.register('teams', { label: 'Teams', windows: ['season', 'week', 'all'], format: 'points', rows: (win, live) => teams.rows(win, live) });
boards.register('countries', { label: 'Countries', windows: ['week', 'season', 'today'], format: 'points', rows: (win, live) => teams.countryRows(win, live) });
const notify = new Notify(store, accounts, { daily });
notify.start();
const seasons = new Seasons(store, accounts);
seasons.check();
seasons.onArchived = (s) => { teams.archiveSeason(s.key, s.number, boards.live.bind(boards)); boards.invalidate(); pageCache.clear(); };
const seasonTimer = setInterval(() => seasons.check(), 60000);
seasonTimer.unref?.();
const clients = new Map();

// per-IP limits (server/config.js): sockets open, rooms asked for, guests minted
const sockets = new Sockets(cfg.SOCKETS_PER_IP);
const roomAsks = new PerIp(cfg.ROOMS_PER_IP_PER_MIN, 60 * 1000);
const guestMints = new PerIp(cfg.GUESTS_PER_IP_PER_HOUR, 60 * 60 * 1000);
setInterval(() => { roomAsks.sweep(); guestMints.sweep(); }, 5 * 60 * 1000).unref();

// Signed-in (Cortexis) players are the ranked ones; a guest who signs in brings
// their daily entries, ghosts and team place along (accounts.merge).
ghosts.rankedId = (id) => accounts.isRankedId(id);
accounts.onMerge = (guest, into) => {
  daily.moveEntries(guest.id, into);
  ghosts.handOver(guest, into);
  teams.handOver(guest, into);
};

/** Where a new or signing-in player is from: a CDN header, else the browser's own guess. */
const firstCountry = (req, guess) => cx.headerCountry(req) || cx.guessCountry(guess);

function readBody(req, limit = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (d) => { raw += d; if (raw.length > limit) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

/** A JSON object body; anything else (bad JSON, null, an array) throws. */
async function readJson(req, limit) {
  const body = JSON.parse(await readBody(req, limit));
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
  return body;
}

/** A handler failed: log it here, tell the caller nothing about why. */
function serverError(res, err) {
  console.error('[http]', err);
  if (!res.headersSent) sendJson(res, 500, { error: 'Server error.' });
  else res.destroy();
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

/**
 * Sign in with a Cortexis game token (see server/cx.js). The browser also
 * sends the guest credentials it was playing under, so that guest's progress
 * is folded into the Cortexis account once. Answers with this game's own
 * session credentials for the cx_ account, stored like a guest's.
 */
function signInWithCortexis(body, req) {
  let claims;
  try {
    claims = cx.verifyGameToken(body && body.gameToken);
  } catch (err) {
    return { status: err.code === 'config' ? 503 : 401, body: { error: err.message, code: err.code || 'invalid' } };
  }
  const g = body.accountId && Object.prototype.hasOwnProperty.call(accounts.accounts, body.accountId) ? accounts.accounts[body.accountId] : null;
  const guest = g && body.token && accounts.tokenMatches(g, body.token) ? g : null;
  const out = accounts.bindCortexis(claims, {
    guest,
    country: firstCountry(req, body.country),
    nickname: cx.nicknameFrom(claims.name, cfg.MAX_NAME_LEN),
  });
  resetCaches();
  if (manager.onRaceSettled) manager.onRaceSettled();
  return {
    status: 200,
    body: { id: out.account.id, token: out.token, created: out.created, merged: out.merged, profile: accounts.profile(out.account), standings: boards.standings(out.account) },
  };
}

async function handleAuth(req, res, urlPath) {
  if (urlPath === '/api/auth/config') return sendJson(res, 200, cx.siteConfig(req));
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'POST only.' });
  let body;
  try { body = await readJson(req); } catch (_) { return sendJson(res, 400, { error: 'Bad request body.' }); }
  if (urlPath === '/api/auth/cortexis') {
    const out = signInWithCortexis(body, req);
    return sendJson(res, out.status, out.body);
  }
  if (urlPath === '/api/auth/signout') {
    const acc = body.accountId && Object.prototype.hasOwnProperty.call(accounts.accounts, body.accountId) ? accounts.accounts[body.accountId] : null;
    return sendJson(res, 200, { ok: true, revoked: acc ? accounts.revoke(acc, body.token) : false });
  }
  return sendJson(res, 404, { error: 'not found' });
}

/** Public origin for absolute URLs: configured, else what the proxy / client asked for. */
function originOf(req) {
  if (cfg.PUBLIC_ORIGIN) return cfg.PUBLIC_ORIGIN;
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  return `${proto}://${host}`;
}

/** Everything a profile page or card needs, from the account record. */
function profileView(acc) {
  const level = progression.levelForPoints(acc.points);
  const row = boards.rows('points', 'all', 'global').find((r) => r.id === acc.id);
  return {
    id: acc.id, name: acc.name, country: acc.country, skin: acc.skin, level, title: progression.titleFor(level),
    points: acc.points, bestWpm: acc.bestWpm, bestCombo: acc.bestCombo, wins: acc.wins, races: acc.races, streak: acc.streak,
    worldRank: row ? row.rank : null, achievements: acc.achievements || [], solo: acc.solo || { finished: 0 },
  };
}

function sendHtml(res, status, html, cacheControl = 'no-cache') {
  res.writeHead(status, { 'Content-Type': MIME['.html'], 'Cache-Control': cacheControl });
  res.end(html);
}

/** A social card: PNG when the rasteriser is installed (cached), else the SVG itself. */
function sendCard(res, key, svg, ttlMs, cacheControl) {
  const buf = og.png(key, svg, ttlMs);
  if (buf) {
    res.writeHead(200, { 'Content-Type': MIME['.png'], 'Content-Length': buf.length, 'Cache-Control': cacheControl });
    return res.end(buf);
  }
  res.writeHead(200, { 'Content-Type': MIME['.svg'], 'Cache-Control': cacheControl });
  res.end(svg);
}

// Today's daily challenge is a board like any other; its rows come from daily.js.
boards.register('daily', { label: 'Today', windows: ['today'], format: 'wpm', rows: () => daily.rows() });
daily.onChange = () => manager.onRaceSettled && manager.onRaceSettled();

// The passage catalogue is static for the life of the process: build the
// response once so practice mode can pull it over plain HTTP with caching.
const PASSAGES_BODY = JSON.stringify({
  bonusWords: cfg.BONUS_WORDS,
  langs: passages.LANGS,
  categories: passages.CATEGORIES,
  stages: passages.STAGES,
  passages: passages.PASSAGES.map(({ id, title, lang, category, words, text, stage }) => ({ id, title, lang, category, words, text, stage })),
  chain: passages.CHAIN.map((p) => p.id),   // English paragraphs in the order they open (passages.js)
  lock: cfg.PRACTICE_LOCK,
});

/** Room options a client may ask for (language + mode), validated. */
const roomOpts = (msg) => ({
  lang: passages.isLang(msg && msg.lang) ? msg.lang : 'en',
  category: passages.isCategory(msg && msg.category) ? msg.category : 'prose',
});
const CATALOGUE_KEY = require('crypto').createHash('sha1').update(PASSAGES_BODY).digest('hex').slice(0, 16);
const PASSAGES_ETAG = `"${CATALOGUE_KEY}"`;

/**
 * Practice on an English paragraph the player has not opened yet? Returns the
 * refusal to send, or null. The daily is never locked (the caller skips it).
 */
function lockRefusal(player, passage) {
  if (!cfg.PRACTICE_LOCK) return null;
  const next = passages.lockOf(passage, player.account ? player.account.done : []);
  if (!next) return null;
  return { type: 'error', message: `Finish paragraph ${next.chain} first.`, solo: true, locked: true, passageId: passage.id, next: next.id, nextNo: next.chain };
}

// index.html is static except for the absolute URLs search engines and link
// unfurlers need; substitute the origin once per host and keep the result.
const INDEX_PATH = path.join(PUBLIC_DIR, 'index.html');
let indexSrc = { mtime: 0, text: '' };
const indexCache = new Map();
function indexHtml(origin) {
  const mtime = fs.statSync(INDEX_PATH).mtimeMs;   // re-read when the file changes (dev loop, hot deploys)
  if (mtime !== indexSrc.mtime) {
    indexSrc = { mtime, text: fs.readFileSync(INDEX_PATH, 'utf8') };
    indexCache.clear();
  }
  let html = indexCache.get(origin);
  if (!html) {
    // one navbar and footer for the whole site: the game gets the same markup as every page
    html = indexSrc.text
      .replace(/__ORIGIN__/g, origin)
      .replace(/__CATALOGUE__/g, CATALOGUE_KEY)   // the game asks for /api/passages?v=<this>: a new catalogue is never read from a stale cache
      .replace('<!--TD:NAV-->', pages.navbar())
      .replace('<!--TD:FOOT-->', pages.footer({ origin }));
    indexCache.set(origin, html);
    if (indexCache.size > 20) indexCache.delete(indexCache.keys().next().value);
  }
  return html;
}

// Server-rendered pages are cheap string assembly, but crawlers arrive in
// bursts: keep each rendered page for a short while.
const pageCache = new Map();
function cachedPage(key, ttlMs, render) {
  const hit = pageCache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.html;
  const html = render();
  pageCache.set(key, { at: Date.now(), html });
  if (pageCache.size > 500) pageCache.delete(pageCache.keys().next().value);
  return html;
}

/** Countries that have at least one ranked player (drives country pages and the sitemap). */
let countriesCache = { at: 0, list: [] };
function countriesWithPlayers() {
  if (Date.now() - countriesCache.at > 300000) {
    const set = new Set();
    for (const a of accounts.all) if (a.points > 0 && countries.isCountry(a.country)) set.add(a.country);
    countriesCache = { at: Date.now(), list: [...set].sort() };
  }
  return countriesCache.list;
}

function sitemapUrls() {
  const urls = [
    { path: '/', changefreq: 'daily', priority: 1 },
    { path: '/daily', changefreq: 'daily', priority: 0.9 },
    { path: '/practice', changefreq: 'weekly', priority: 0.8 },
    { path: '/leaderboard', changefreq: 'hourly', priority: 0.8 },
    { path: '/how', changefreq: 'monthly', priority: 0.6 },
  ];
  for (const c of countriesWithPlayers()) urls.push({ path: `/leaderboard/${c}`, changefreq: 'daily', priority: 0.6 });
  for (const set of pages.practiceSets(passages.PASSAGES, passages.LANGS, passages.CATEGORIES)) urls.push({ path: set.path, changefreq: 'weekly', priority: 0.75 });
  for (const p of passages.PASSAGES) urls.push({ path: `/practice/${p.id}`, changefreq: 'weekly', priority: 0.7 });
  for (const r of boards.rows('points', 'all', 'global').slice(0, 100)) urls.push({ path: `/u/${r.id}`, changefreq: 'weekly', priority: 0.4 });
  return urls;
}

/* ------------------------------------------------------------- HTTP */

/* ---------------------------------------------- admin portal: players
   For the Cortexis admin portal: list, edit and delete players. The website API mints the
   token (signed with GAME_SSO_SECRET, admin audience) for an admin only;
   a player's sign-in token is refused here. */
function adminAllowed(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  try { cx.verifyGameToken(m[1], { audience: cx.ADMIN_AUDIENCE }); return true; } catch (_) { return false; }
}
const cortexisUser = (id) => (String(id).startsWith('cx_') ? Number(String(id).slice(3)) || null : null);
function adminPlayers() {
  return accounts.all.filter((a) => !a.mergedInto).map((a) => ({
    id: a.id, name: a.name, country: a.country, cortexisUserId: cortexisUser(a.id),
    points: a.points || 0, played: a.races || 0, wins: a.wins || 0,
    streak: a.streak || 0, bestStreak: a.bestStreak || 0,
    extra: { bestWpm: a.bestWpm || 0, practiceRuns: (a.solo && a.solo.runs) || 0, dailyBest: (a.daily && a.daily.best) || 0 },
    createdAt: a.createdAt || null, lastSeen: a.lastSeen || null,
  }));
}

const liveAccount = (id) => (Object.prototype.hasOwnProperty.call(accounts.accounts, id) && !accounts.accounts[id].mergedInto ? accounts.accounts[id] : null);

/**
 * Every copy of a player's name and flag kept outside the account: rival
 * rows, daily entries (and the leader's replay), ghosts, past season tables.
 * `fn(row)` edits a copy in place, or returns 'drop' to remove it.
 */
function eachCopy(id, fn) {
  for (const a of accounts.all) if (a.rivals && a.rivals[id] && fn(a.rivals[id]) === 'drop') delete a.rivals[id];
  for (const [day, rec] of Object.entries(daily.data)) {
    if (!rec.entries[id]) continue;
    const leader = daily.rankOf(day, id) === 1;
    if (fn(rec.entries[id]) === 'drop') { delete rec.entries[id]; if (leader) delete rec.leaderGhost; } else if (leader && rec.leaderGhost) fn(rec.leaderGhost);
  }
  const pb = ghosts.data.pb[id];
  if (pb) for (const [pid, g] of Object.entries(pb)) if (fn(g) === 'drop') delete pb[pid];
  if (pb && !Object.keys(pb).length) delete ghosts.data.pb[id];
  for (const [pid, g] of Object.entries(ghosts.data.wr)) if (g.accountId === id && fn(g) === 'drop') delete ghosts.data.wr[pid];
  for (const s of Object.values(seasons.data)) s.top = s.top.filter((r) => r.id !== id || fn(r) !== 'drop');
}

/** Admin edit: { name, country, points }, each optional, checked like the game checks its own. */
function adminEdit(acc, body) {
  const out = {};
  if (body.name !== undefined) {
    out.name = sanitizeText(body.name, cfg.MAX_NAME_LEN);
    if (!out.name) return 'Name cannot be empty.';
  }
  if (body.country !== undefined) {
    out.country = String(body.country || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(out.country)) return 'Country must be a 2-letter code (UN for none).';
  }
  if (body.points !== undefined) {
    out.points = typeof body.points === 'string' && body.points.trim() ? Number(body.points) : body.points;
    if (!Number.isSafeInteger(out.points) || out.points < 0) return 'Points must be a whole number, 0 or more.';
  }
  if (!Object.keys(out).length) return 'Nothing to change.';
  accounts.setIdentity(acc, { name: out.name, country: out.country });
  // the browser still holds the old name and country; this makes the next hello take the account's instead
  if (out.name || out.country) acc.adminIdentity = true;
  if (out.points !== undefined) acc.points = out.points;
  eachCopy(acc.id, (row) => { if (out.name) row.name = out.name; if (out.country) row.country = out.country; });
  for (const p of clients.values()) {
    if (!p.account || p.account.id !== acc.id) continue;
    if (out.name) p.name = out.name;
    if (out.country) p.country = out.country;
    if (out.name || out.country) p.send({ type: 'renamed', name: acc.name, country: acc.country });
    if (p.room) p.room.broadcastState();
  }
  daily.touch();
  resetCaches();
  manager.onRaceSettled();
  return null;
}

/** Admin delete: the account, guests folded into it, its team place, shares and every copy above; a connected player starts over as a guest. */
function adminDelete(acc) {
  const gone = [acc, ...accounts.all.filter((a) => a.mergedInto === acc.id)];
  for (const a of gone) {
    teams.leave(a);
    eachCopy(a.id, () => 'drop');
    for (const [sid, sh] of Object.entries(shares.data)) if (sh.accountId === a.id) delete shares.data[sid];
    for (const [rid, r] of shares.results) if (r.accountId === a.id) shares.results.delete(rid);
    delete accounts.accounts[a.id];
  }
  for (const p of clients.values()) {
    if (!p.account || !gone.includes(p.account)) continue;
    p.account = null;            // nothing more is recorded against it
    p.tag = null;
    manager.leave(p);
    p.ws.close(4001, 'account removed');   // the browser reconnects and is handed a fresh guest
  }
  daily.touch();
  resetCaches();
  manager.onRaceSettled();
}

async function handleAdmin(req, res, urlPath) {
  if (!adminAllowed(req)) return sendJson(res, 401, { error: 'Admin token required.' });
  if (urlPath === '/api/admin/players') {
    if (req.method !== 'GET') return sendJson(res, 405, { error: 'GET only.' });
    return sendJson(res, 200, { players: adminPlayers() });
  }
  const m = /^\/api\/admin\/players\/([^/]+)$/.exec(urlPath);
  if (!m) return sendJson(res, 404, { error: 'not found' });
  if (req.method !== 'PATCH' && req.method !== 'DELETE') return sendJson(res, 405, { error: 'PATCH or DELETE only.' });
  const acc = liveAccount(m[1]);
  if (!acc) return sendJson(res, 404, { error: 'No such player.' });
  if (req.method === 'DELETE') { adminDelete(acc); return sendJson(res, 200, { ok: true }); }
  if (Number(req.headers['content-length']) > 10 * 1024) return sendJson(res, 400, { error: 'Request body too large.' });
  let body;
  try { body = await readJson(req, 10 * 1024); } catch (_) { return sendJson(res, 400, { error: 'Bad request body.' }); }
  const err = adminEdit(acc, body);
  if (err) return sendJson(res, 400, { error: err });
  return sendJson(res, 200, { player: adminPlayers().find((p) => p.id === acc.id) });
}

function serveStatic(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent((req.url || '/').split('?')[0]); } catch (_) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });   // a bad percent-escape: answer it, never throw
    return res.end('Bad request');
  }

  if (urlPath === '/api/admin/players' || urlPath.startsWith('/api/admin/players/')) {
    return handleAdmin(req, res, urlPath).catch((err) => serverError(res, err));
  }

  if (urlPath.startsWith('/api/auth/')) {
    return handleAuth(req, res, urlPath).catch((err) => serverError(res, err));
  }
  if (urlPath === '/api/stats') {
    const body = JSON.stringify({
      online: clients.size, ...manager.stats(), accounts: accounts.size, uptime: Math.round(process.uptime()),
      embeds: store.data.embedRefs || {},
    });
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
    return res.end(body);
  }
  if (urlPath.startsWith('/api/board')) {
    const q = new URLSearchParams((req.url.split('?')[1] || ''));
    const body = JSON.stringify(boards.board(q.get('category') || 'points', q.get('window') || 'all', (q.get('scope') || 'global').toUpperCase(), null));
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
    return res.end(body);
  }
  /* ---- pages search engines can read (leaderboard, practice, daily, robots, sitemap) ---- */
  const origin = originOf(req);
  let m;
  if (urlPath === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    return res.end(pages.robots(origin));
  }
  if (urlPath === '/sitemap.xml') {
    const xml = cachedPage(`sitemap:${origin}`, 600000, () => pages.sitemap(origin, sitemapUrls()));
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' });
    return res.end(xml);
  }
  if (urlPath === '/leaderboard' || urlPath === '/leaderboard/' || (m = urlPath.match(/^\/leaderboard\/([A-Za-z]{2})\/?$/))) {
    const scope = m ? m[1].toUpperCase() : 'global';
    if (scope !== 'global' && !countries.isCountry(scope)) return sendHtml(res, 404, pages.notFoundPage(origin, urlPath));
    const html = cachedPage(`lb:${origin}:${scope}`, 30000, () => pages.leaderboardPage({
      origin, scope,
      top: { points: boards.rows('points', 'all', scope).slice(0, 25), season: boards.rows('points', 'season', scope).slice(0, 25), wpm: boards.rows('wpm', 'all', scope).slice(0, 10), streak: boards.rows('streak', 'all', scope).slice(0, 10) },
      teams: scope === 'global' ? boards.rows('teams', 'season', 'global').slice(0, 10) : null,
      countryRows: scope === 'global' ? boards.rows('countries', 'week', 'global').slice(0, 10) : null,
      countries: countriesWithPlayers(),
      dailyRows: scope === 'global' ? boards.rows('daily', 'today', 'global').slice(0, 10) : null,
      season: seasons.summary(boards),
    }));
    return sendHtml(res, 200, html, 'public, max-age=30');
  }
  if (urlPath === '/practice' || urlPath === '/practice/') {
    const html = cachedPage(`practice:${origin}`, 60000, () => pages.practiceIndexPage({ origin, passages: passages.PASSAGES, records: ghosts.records(), langs: passages.LANGS, categories: passages.CATEGORIES }));
    return sendHtml(res, 200, html, 'public, max-age=60');
  }
  if ((m = urlPath.match(/^\/practice\/(lang|drill)\/([a-z0-9-]+)\/?$/))) {
    const sets = pages.practiceSets(passages.PASSAGES, passages.LANGS, passages.CATEGORIES);
    const wanted = m[1] === 'lang' ? m[2] : m[2];
    const set = sets.find((x) => x.key === wanted && x.kind === (m[1] === 'lang' ? 'language' : 'drill'));
    if (!set) return sendHtml(res, 404, pages.notFoundPage(origin, urlPath));
    const html = cachedPage(`practice-set:${origin}:${set.key}`, 60000, () => pages.practiceSetPage({ origin, set, records: ghosts.records(), allSets: sets }));
    return sendHtml(res, 200, html, 'public, max-age=60');
  }
  if ((m = urlPath.match(/^\/practice\/([a-z0-9-]+)\/?$/))) {
    const p = passages.byId(m[1]);
    if (!p) return sendHtml(res, 404, pages.notFoundPage(origin, urlPath));
    // neighbours: English paragraphs step through the chain (6 sits between 5 and 7), the rest through the catalogue
    const list = p.chain ? passages.CHAIN : passages.PASSAGES;
    const i = list.indexOf(p);
    const html = cachedPage(`practice:${origin}:${p.id}`, 60000, () => pages.practicePage({
      origin, passage: p, record: ghosts.wr(p.id), prev: list[i - 1] || null, next: list[i + 1] || null,
      langs: passages.LANGS, categories: passages.CATEGORIES,
    }));
    return sendHtml(res, 200, html, 'public, max-age=60');
  }
  if (urlPath === '/embed' || urlPath === '/embed/') {
    const q = new URLSearchParams(req.url.split('?')[1] || '');
    const ref = sanitizeText(q.get('ref'), 80).toLowerCase().replace(/[^a-z0-9.\-:]/g, '');
    if (ref) {
      const refs = store.data.embedRefs || (store.data.embedRefs = {});
      if (refs[ref] != null || Object.keys(refs).length < 200) { refs[ref] = (refs[ref] || 0) + 1; store.touch(); }
    }
    const html = cachedPage(`embed:${origin}:${q.get('passage') || ''}`, 60000, () => pages.embedPage({ origin, passage: passages.byId(q.get('passage')) }));
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache', 'Content-Security-Policy': 'frame-ancestors *' });
    return res.end(html);
  }
  if (urlPath === '/embed.js') {
    res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' });
    return fs.createReadStream(path.join(PUBLIC_DIR, 'embed-loader.js')).pipe(res);
  }
  if (urlPath === '/daily' || urlPath === '/daily/') {
    const html = cachedPage(`daily:${origin}:${dayKey()}`, 30000, () => {
      const today = daily.summary();
      const y = new Date(Date.now() - 86400000);
      const yRows = daily.rows(dayKey(y)).slice(0, 10);
      const yc = daily.challenge(dayKey(y));
      return pages.dailyPage({ origin, today, yesterday: { number: yc.number, title: yc.passage.title, top: yRows.map((r) => ({ ...r, wpm: r.value })) } });
    });
    return sendHtml(res, 200, html, 'public, max-age=30');
  }

  /* ---- share pages, profiles and social cards ---- */
  if ((m = urlPath.match(/^\/r\/([a-z0-9]{6,12})\/?$/))) {
    const s = shares.get(m[1]);
    if (!s) return sendHtml(res, 404, pages.notFoundPage(originOf(req), urlPath));
    shares.viewed(m[1]);
    return sendHtml(res, 200, pages.sharePage(s, m[1], originOf(req)));
  }
  if ((m = urlPath.match(/^\/u\/((?:p_[A-Za-z0-9_-]{6,24})|(?:cx_[A-Za-z0-9_-]{1,40}))\/?$/))) {
    const acc = accounts.accounts[m[1]];
    if (!acc) return sendHtml(res, 404, pages.notFoundPage(originOf(req), urlPath));
    return sendHtml(res, 200, pages.profilePage(profileView(acc), originOf(req)));
  }
  if ((m = urlPath.match(/^\/og\/r\/([a-z0-9]{6,12})\.png$/))) {
    const s = shares.get(m[1]);
    if (!s) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
    return sendCard(res, `r:${m[1]}`, og.resultCard(s, originOf(req)), 365 * 86400000, 'public, max-age=31536000, immutable');
  }
  if ((m = urlPath.match(/^\/og\/u\/((?:p_[A-Za-z0-9_-]{6,24})|(?:cx_[A-Za-z0-9_-]{1,40}))\.png$/))) {
    const acc = accounts.accounts[m[1]];
    if (!acc) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
    const p = profileView(acc);
    return sendCard(res, `u:${acc.id}:${acc.points}:${acc.races}:${acc.name}:${acc.skin}`, og.profileCard(p, originOf(req)), 600000, 'public, max-age=600');
  }
  if (urlPath === '/og/site.png') {
    const o = originOf(req);
    return sendCard(res, `site:${o}`, og.siteCard(o), 365 * 86400000, 'public, max-age=86400');
  }
  if (urlPath === '/og/daily.png') {
    const d = daily.summary();
    return sendCard(res, `daily:${d.day}:${d.players}:${d.top[0] ? d.top[0].wpm : 0}`, og.dailyCard(d, originOf(req)), 300000, 'public, max-age=300');
  }
  if ((m = urlPath.match(/^\/api\/team\/(t_[a-z0-9]{6})$/))) {
    const t = teams.get(m[1]);
    res.writeHead(t ? 200 : 404, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(t ? teams.view(t, boards) : { error: 'Unknown team' }));
  }
  if ((m = urlPath.match(/^\/t\/(t_[a-z0-9]{6})\/?$/))) {
    const t = teams.get(m[1]);
    if (!t) return sendHtml(res, 404, pages.notFoundPage(origin, urlPath));
    return sendHtml(res, 200, cachedPage(`team:${origin}:${t.id}`, 30000, () => pages.teamPage(teams.view(t, boards), origin)), 'public, max-age=30');
  }
  if (urlPath === '/api/push/key') {
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'public, max-age=3600' });
    return res.end(JSON.stringify({ key: notify.publicKey }));
  }
  if (urlPath === '/api/season') {
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'public, max-age=60' });
    return res.end(JSON.stringify(seasons.summary(boards, new URLSearchParams(req.url.split('?')[1] || '').get('me') || null)));
  }
  if (urlPath === '/api/ghost') {
    const q = new URLSearchParams(req.url.split('?')[1] || '');
    const id = q.get('passage') || '';
    const me = q.get('me') || null;
    const body = passages.byId(id)
      ? { passageId: id, wr: ghosts.pub(ghosts.wr(id), me), pb: me ? ghosts.pub(ghosts.pb(me, id), me) : null }
      : { error: 'Unknown passage' };
    res.writeHead(passages.byId(id) ? 200 : 404, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(body));
  }
  if (urlPath === '/api/records') {
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'public, max-age=30' });
    return res.end(JSON.stringify({ records: ghosts.records() }));
  }
  if (urlPath === '/api/daily') {
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(daily.summary(new URLSearchParams(req.url.split('?')[1] || '').get('me') || null)));
  }
  if (urlPath === '/api/passages') {
    if (req.headers['if-none-match'] === PASSAGES_ETAG) { res.writeHead(304); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'public, max-age=3600', ETag: PASSAGES_ETAG });
    return res.end(PASSAGES_BODY);
  }
  if (urlPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  if (urlPath === '/' || urlPath === '/index.html' || urlPath === '/splash') {
    const html = cachedPage(`home:${origin}`, 60000, () => pages.homePage({ origin, passages: passages.PASSAGES.length, langs: Object.keys(passages.LANGS).length, racers: cfg.MAX_PLAYERS }));
    return sendHtml(res, 200, html);
  }
  if (urlPath === '/how' || urlPath === '/how/') return sendHtml(res, 200, cachedPage(`how:${origin}`, 600000, () => pages.howPage({ origin })), 'public, max-age=300');
  // the game and its own pages (your stats, garage, team, awards) are one document
  if (urlPath === '/app' || urlPath === '/app/' || /^\/app\/(profile|garage|team|awards|badges|signin)\/?$/.test(urlPath)) return sendHtml(res, 200, indexHtml(origin));
  // pages that used to live inside the game moved to their own addresses
  if ((m = urlPath.match(/^\/app\/(rankings|how)\/?$/))) {
    res.writeHead(301, { Location: m[1] === 'rankings' ? '/leaderboard' : '/how' });
    return res.end();
  }
  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Unknown path: still load the app (so nothing dead-ends), but say 404 so
      // search engines never index junk URLs as pages.
      return sendHtml(res, 404, indexHtml(origin));
    }
    const ext = path.extname(filePath).toLowerCase();
    // Code (css/js/manifest) must never be served stale: the browser revalidates
    // every time and gets a cheap 304 while nothing has changed. Only art that
    // rarely changes is allowed to sit in the cache.
    const longLived = /^\/(icons|fonts|img)\//.test(urlPath);
    const tag = `W/"${stat.size.toString(16)}-${Math.round(stat.mtimeMs).toString(36)}"`;
    const lastModified = stat.mtime.toUTCString();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': longLived ? 'public, max-age=31536000, immutable' : 'no-cache',
      ETag: tag,
      'Last-Modified': lastModified,
    };
    if (req.headers['if-none-match'] === tag || req.headers['if-modified-since'] === lastModified) {
      res.writeHead(304, headers);
      return res.end();
    }
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
}

// one bad request must never take the server (and every race on it) down
const server = http.createServer((req, res) => {
  try { serveStatic(req, res); } catch (err) { serverError(res, err); }
});
const wss = new WebSocket.Server({ server, maxPayload: cfg.WS_MAX_PAYLOAD });

/* -------------------------------------------------------- WebSocket */

function broadcastAll(msg) {
  const str = JSON.stringify(msg);
  for (const p of clients.values()) p.sendRaw(str);
}

/**
 * After a race settles, boards are stale. Invalidate the cache and push a
 * refreshed copy of whichever board each client is currently looking at,
 * throttled so a busy server isn't re-sorting for every finished race.
 */
let boardPushTimer = null;
manager.onRaceSettled = () => {
  boards.invalidate();
  if (boardPushTimer) return;
  boardPushTimer = setTimeout(() => {
    boardPushTimer = null;
    boards.invalidate();
    for (const p of clients.values()) {
      if (!p.watching) continue;
      const { category, window: win, scope } = p.watching;
      p.send(boards.board(category, win, scope, p.account ? p.account.id : null));
    }
  }, cfg.BOARD_PUSH_MS);
  boardPushTimer.unref?.();
};

function handle(player, msg) {
  switch (msg.type) {
    case 'ping':
      return player.send({ type: 'pong', t: msg.t, st: Date.now() });

    case 'hello': {
      const typed = sanitizeText(msg.name, cfg.MAX_NAME_LEN);
      player.country = sanitizeCountry(msg.country);
      player.skin = sanitizeSkin(msg.skin, SKINS);

      // resolve (or mint) the persistent account behind this browser: on the
      // first hello, or when the browser now holds different credentials (it
      // just signed in with Cortexis)
      let created = false;
      if (!player.account || (msg.accountId && msg.accountId !== player.account.id)) {
        if (!accounts.find(msg.accountId, msg.token) && !guestMints.take(player.ip)) {
          player.send({ type: 'error', message: 'Too many new players from your network. Try again later.' });
          return player.ws.close(1013, 'Too many new players from this address');
        }
        const out = accounts.login(msg.accountId, msg.token, { country: player.ipCountry || cx.guessCountry(msg.countryGuess) || cx.guessCountry(msg.country) });
        player.account = out.account;
        created = out.created;
        player.send({
          type: 'account',
          id: out.account.id,
          token: out.token,            // only sent when the account is minted
          created,
          profile: accounts.profile(out.account),
          standings: boards.standings(out.account),
        });
      }
      // a brand-new player takes the country found at first contact; after that the player's own pick wins
      if (created) player.country = player.account.country;
      // a Cortexis player keeps their nickname when the browser has none to offer
      const keepName = accounts.isCortexis(player.account) && (!typed || /^Guest(-\w+)?$/i.test(typed));
      player.name = keepName ? player.account.name : typed || 'Guest-' + player.id.slice(0, 3);
      // an admin renamed this account: its name and country win once, and the browser stores them
      if (player.account.adminIdentity) {
        delete player.account.adminIdentity;
        player.name = player.account.name;
        player.country = player.account.country;
        player.send({ type: 'renamed', name: player.name, country: player.country });
      }
      accounts.setIdentity(player.account, { name: player.name, country: player.country, skin: player.skin });
      const team = teams.of(player.account);
      player.tag = team ? team.tag : null;

      player.send({ type: 'hello_ok', player: player.info() });
      if (team) player.send({ type: 'team', team: teams.view(team, boards) });
      if (player.room) player.room.broadcastState();
      return;
    }

    case 'signout': {
      // back to a fresh guest: the next hello (without credentials) mints one
      if (player.account) accounts.revoke(player.account, msg.token);
      player.account = null;
      player.tag = null;
      return player.send({ type: 'signed_out' });
    }

    case 'board': {
      const category = typeof msg.category === 'string' ? msg.category : 'points';
      const win = typeof msg.window === 'string' ? msg.window : 'all';
      const scope = String(msg.scope || 'global').toUpperCase();
      player.watching = { category, window: win, scope };
      return player.send(boards.board(category, win, scope, player.account ? player.account.id : null));
    }

    case 'quick':
      if (!roomAsks.take(player.ip)) return player.send({ type: 'error', message: 'Too many races started. Wait a minute.' });
      manager.quickMatch(player, roomOpts(msg));
      return;

    case 'create':
      if (!roomAsks.take(player.ip)) return player.send({ type: 'error', message: 'Too many rooms made. Wait a minute.' });
      manager.createPrivate(player, roomOpts(msg));
      return;

    case 'join':
      try {
        manager.join(player, msg.code);
      } catch (err) {
        player.send({ type: 'error', message: err.message });
      }
      return;

    case 'leave':
      manager.leave(player);
      player.send({ type: 'left' });
      return;

    case 'start':
      if (player.room) player.room.hostStart(player, !!msg.bots);
      return;

    case 'progress':
      if (player.room) player.room.handleProgress(player, msg);
      return;

    case 'chat':
      if (player.room) player.room.handleChat(player, msg.text);
      return;

    case 'emote':
      if (player.room) player.room.handleEmote(player, msg.e);
      return;

    case 'rev':
      if (player.room) player.room.handleRev(player);
      return;

    /* Practice runs are computed in the browser; see server/solo.js. */
    case 'solo_start': {
      const p = passages.byId(msg && msg.passageId);
      if (!p) return player.send({ type: 'error', message: 'Unknown passage.' });
      const refusal = msg.mode !== 'daily' && lockRefusal(player, p);
      if (refusal) return player.send(refusal);
      solo.stamp(player, msg);
      return;
    }

    case 'solo_done': {
      if (!player.account) return player.send({ type: 'error', message: 'Say hello first.' });
      const v = solo.validate(msg, solo.takeStamp(player));
      if (!v.ok) return player.send({ type: 'error', message: v.reason, solo: true });
      // a locked English paragraph in practice: nothing is recorded
      const refusal = v.r.mode !== 'daily' && lockRefusal(player, passages.byId(v.r.passageId));
      if (refusal) return player.send(refusal);
      // ghosts first: "beat the record" is judged against what stood before this run
      const g = ghosts.consider(player.account, v.r);
      const kind = ['wr', 'pb', 'leader', 'rival'].includes(msg.pacerKind) ? msg.pacerKind : 'wpm';
      v.r.beatGhost = v.r.finished && ((kind === 'wr' && !!g.prevWr && v.r.wpm > g.prevWr.wpm) || (kind === 'pb' && !!g.prevPb && v.r.wpm > g.prevPb.wpm) || ((kind === 'leader' || kind === 'rival') && v.r.beatPacer));
      v.r.setWr = g.wr;
      const out = accounts.recordSolo(player.account, v.r);
      if (out.streakEvent && manager.onRaceSettled) manager.onRaceSettled();
      let dailyOut = null;
      if (v.r.mode === 'daily') {
        dailyOut = daily.record(player.account, v.r);
        out.unlocked.push(...accounts.unlock(player.account, { ...v.r, solo: true, daily: dailyOut }, ['daily']));
      }
      const resultId = v.r.finished ? shares.remember(player.account.id, {
        kind: v.r.mode === 'daily' ? 'daily' : 'practice', name: player.name, country: player.country, skin: player.skin, color: '#4cc9f0',
        wpm: v.r.wpm, accuracy: v.r.accuracy, time: v.r.time, passageId: v.r.passageId, passageTitle: v.r.passageTitle,
        dailyNumber: dailyOut ? dailyOut.number : null, rank: dailyOut && dailyOut.counted ? dailyOut.rank : null, of: dailyOut && dailyOut.counted ? dailyOut.of : null,
        pacer: v.r.pacerWpm ? { kind: kind === 'wpm' ? 'wpm' : 'ghost', wpm: v.r.pacerWpm, won: v.r.beatPacer, name: sanitizeText(msg.pacerName, 24) || null } : null,
      }) : null;
      player.send({
        type: 'race_result',
        resultId,
        daily: dailyOut,
        solo: {
          mode: v.r.mode, passageId: v.r.passageId, passageTitle: v.r.passageTitle,
          wpm: v.r.wpm, accuracy: v.r.accuracy, time: v.r.time, chars: v.r.chars, finished: v.r.finished,
          verified: v.r.verified, improved: out.improved, best: out.best, runs: out.runs,
          opened: out.opened,                // { id, n, title } when this run opened the next English paragraph
          pacerWpm: v.r.pacerWpm, beatPacer: v.r.beatPacer,
          ghost: { wr: g.wr, pb: g.pb, beat: v.r.beatGhost, prevWr: g.prevWr, kind },
        },
        points: 0,
        ranked: false,
        streak: out.streak,
        bestStreak: out.bestStreak,
        streakEvent: out.streakEvent,
        unlocked: out.unlocked,
        profile: accounts.profile(player.account),
        standings: boards.standings(player.account),
        series: [],
      });
      return;
    }

    /* Push reminders: the browser hands us its subscription; we keep at most a few per account. */
    case 'push_subscribe': {
      if (!player.account) return player.send({ type: 'error', message: 'Say hello first.' });
      try {
        const n = notify.subscribe(player.account, msg.subscription, msg.prefs || {}, msg.tzOffset);
        player.send({ type: 'push', subscribed: true, devices: n, prefs: player.account.pushPrefs });
      } catch (err) {
        player.send({ type: 'error', message: err.message });
      }
      return;
    }
    case 'push_unsubscribe': {
      if (!player.account) return;
      const n = notify.unsubscribe(player.account, typeof msg.endpoint === 'string' ? msg.endpoint : null);
      player.send({ type: 'push', subscribed: n > 0, devices: n, prefs: player.account.pushPrefs || null });
      return;
    }

    /* Teams: create / join by invite / leave / refresh. Tags show in every lobby. */
    case 'team_create':
    case 'team_join':
    case 'team_leave':
    case 'team_info':
    case 'team_rotate': {
      if (!player.account) return player.send({ type: 'error', message: 'Say hello first.' });
      try {
        let team = null;
        if (msg.type === 'team_create') team = teams.create(player.account, { name: msg.name, tag: msg.tag });
        else if (msg.type === 'team_join') team = teams.join(player.account, msg.code);
        else if (msg.type === 'team_leave') team = (teams.leave(player.account), null);
        else if (msg.type === 'team_rotate') team = teams.rotateInvite(player.account);
        else team = teams.of(player.account);
        const unlocked = msg.type === 'team_create' || msg.type === 'team_join' ? accounts.unlock(player.account, {}, ['team']) : [];
        player.tag = team ? team.tag : null;
        boards.invalidate();
        player.send({ type: 'team', team: team ? teams.view(team, boards) : null, unlocked, profile: accounts.profile(player.account) });
        if (player.room) player.room.broadcastState();
      } catch (err) {
        player.send({ type: 'error', message: err.message, team: true });
      }
      return;
    }

    /* Turn a settled result into a public share page + card. */
    case 'share': {
      if (!player.account) return player.send({ type: 'error', message: 'Say hello first.' });
      const id = shares.create(player.account.id, msg.resultId);
      if (!id) return player.send({ type: 'error', message: 'Nothing to share — that result has expired. Race again!' });
      const s = shares.get(id);
      const url = `${player.origin}/r/${id}`;
      return player.send({ type: 'share', id, url, image: `${player.origin}/og/r/${id}.png`, text: Shares.text(s, url), kind: s.kind });
    }

    default:
      return;
  }
}

wss.on('connection', (ws, req) => {
  const ip = ipOf(req, cfg.TRUST_PROXY);
  if (!sockets.add(ip)) return ws.close(1013, 'Too many connections from this address');
  ws.on('close', () => sockets.remove(ip));
  const player = new Player({ id: randomId(10), ws });
  player.ip = ip;   // for the per-IP limits only; never stored
  player.tokens = cfg.MSG_BURST;
  player.tokensAt = Date.now();
  player.ipCountry = cx.headerCountry(req);   // the country header only; the IP is never kept
  player.origin = originOf(req);
  clients.set(player.id, player);
  ws.isAlive = true;

  player.send({
    type: 'welcome',
    id: player.id,
    serverTime: Date.now(),
    online: clients.size,
    achievements: CATALOGUE,
    boards: boards.meta(),
    config: { maxPlayers: cfg.MAX_PLAYERS, tickMs: cfg.TICK_MS, rankedPrivate: cfg.RANKED_PRIVATE },
  });
  broadcastAll({ type: 'online', n: clients.size });

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (data) => {
    // token bucket: MSG_BURST at once, refilled at MSG_PER_SEC; the rest is dropped
    const now = Date.now();
    player.tokens = Math.min(cfg.MSG_BURST, player.tokens + ((now - player.tokensAt) / 1000) * cfg.MSG_PER_SEC);
    player.tokensAt = now;
    if (player.tokens < 1) return;
    player.tokens -= 1;
    let msg;
    try { msg = JSON.parse(data); } catch (_) { return; }
    if (!msg || typeof msg.type !== 'string') return;
    try {
      handle(player, msg);
    } catch (err) {
      console.error('[handle]', err);
      player.send({ type: 'error', message: 'Something went wrong on the server.' });
    }
  });

  ws.on('close', () => {
    manager.leave(player);
    clients.delete(player.id);
    broadcastAll({ type: 'online', n: clients.size });
  });

  ws.on('error', () => { /* handled by close */ });
});

// Liveness: drop sockets that stop answering pings (mobile sleep, dead NAT, ...)
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);
heartbeat.unref();

// a stray promise rejection is logged, not allowed to stop the process
process.on('unhandledRejection', (err) => console.error('[unhandledRejection]', err));

server.listen(cfg.PORT, () => {
  console.log(`TypeDash listening on http://localhost:${cfg.PORT}  (tick ${cfg.TICK_MS} ms, ${cfg.MAX_PLAYERS} racers/room)`);
});

/** Test hook: forget every rendered page and derived list. */
function resetCaches() {
  pageCache.clear();
  countriesCache = { at: 0, list: [] };
  boards.invalidate();
}

module.exports = { server, wss, manager, accounts, boards, store, daily, ghosts, shares, seasons, teams, notify, _pageCache: pageCache, _resetCaches: resetCaches };
