'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const cfg = require('./config');
const Store = require('./store');
const { Accounts, cleanName, cleanCountry, CATALOGUE, AVATARS, AVATAR_UNLOCKS } = require('./accounts');
const { Boards, META } = require('./boards');
const Ratings = require('./ratings');
const Bank = require('./bank');
const RoomManager = require('./RoomManager');
const Scoring = require('../shared/scoring');

const ROOT = path.join(__dirname, '..');
const topics = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared', 'topics.json'), 'utf8'));

const store = new Store(cfg.DATA_FILE);
const accounts = new Accounts(store);
const boards = new Boards(accounts);
const ratings = new Ratings(store, topics);
const bank = new Bank(topics, ratings);
const manager = new RoomManager({ bank, ratings, accounts });

/* ---------------- static files, served from memory ---------------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const files = new Map();

function loadStatic() {
  files.clear();
  const add = (urlPath, abs) => {
    const body = fs.readFileSync(abs);
    const type = TYPES[path.extname(abs)] || 'application/octet-stream';
    files.set(urlPath, { body, gz: zlib.gzipSync(body, { level: 9 }), type, etag: '"' + crypto.createHash('sha1').update(body).digest('hex').slice(0, 16) + '"' });
  };
  const walk = (dir, prefix) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, f.name);
      if (f.isDirectory()) walk(abs, prefix + f.name + '/');
      else add(prefix + f.name, abs);
    }
  };
  walk(path.join(ROOT, 'public'), '/');
  add('/shared/scoring.js', path.join(ROOT, 'shared', 'scoring.js'));
  files.set('/', files.get('/index.html'));
}
loadStatic();

function sendBuf(req, res, { body, gz, type, etag }, extra = {}) {
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, { ETag: etag }); return res.end(); }
  const useGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, {
    'Content-Type': type, ETag: etag, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding',
    'X-Content-Type-Options': 'nosniff', ...(useGz ? { 'Content-Encoding': 'gzip' } : {}), ...extra,
  });
  res.end(req.method === 'HEAD' ? undefined : useGz ? gz : body);
}

const cx = require('./cx');

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
  return accounts.all().filter((a) => !a.mergedInto).map((a) => ({
    id: a.id, name: a.name, country: a.country, cortexisUserId: cortexisUser(a.id),
    points: a.points || 0, played: a.matches || 0, wins: a.wins || 0,
    streak: (a.streak && a.streak.cur) || 0, bestStreak: (a.streak && a.streak.best) || 0,
    extra: { soloBest: a.soloBest || 0, soloRuns: a.soloRuns || 0, topicsWon: a.topics || 0 },
    createdAt: a.created || null, lastSeen: null,
  }));
}

const liveAccount = (id) => { const a = accounts.get(id); return a && !a.mergedInto ? a : null; };
const sockets = (id) => [...wss.clients].filter((ws) => ws.player && ws.player.account && ws.player.account.id === id);

// Admin edit: {name, country, points}, each optional, checked like the game checks its own.
function adminEdit(acc, body) {
  const out = {};
  if (body.name !== undefined) {
    out.name = cleanName(body.name);
    if (out.name.length < 2) return 'Name needs at least 2 characters.';
  }
  if (body.country !== undefined) {
    out.country = cleanCountry(body.country);
    if (body.country && !out.country) return 'Country must be a 2-letter code, or empty for none.';
  }
  if (body.points !== undefined) {
    out.points = typeof body.points === 'string' && body.points.trim() ? Number(body.points) : body.points;
    if (!Number.isSafeInteger(out.points) || out.points < 0) return 'Points must be a whole number, 0 or more.';
  }
  if (!Object.keys(out).length) return 'Nothing to change.';
  if (out.name !== undefined) acc.name = out.name;
  if (out.country !== undefined) acc.country = out.country;
  if (out.points !== undefined) acc.points = out.points;
  boards.cache.clear();
  store.save();
  for (const ws of sockets(acc.id)) {
    const p = ws.player;
    if (p.room && p.room.state === 'lobby') p.room.updateIdentity(p);
  }
  return null;
}

// Admin delete: the account, the guests folded into it and every token that
// opens them. A connected player is dropped; their browser reconnects with a
// token that no longer works and is handed a fresh guest.
function adminDelete(acc) {
  const gone = new Set([acc.id, ...accounts.all().filter((a) => a.mergedInto && a.mergedInto === acc.id).map((a) => a.id)]);
  for (const id of gone) delete accounts.accounts[id];
  for (const [h, id] of Object.entries(accounts.tokens)) if (gone.has(id)) delete accounts.tokens[h];
  for (const id of gone) for (const ws of sockets(id)) {
    manager.leave(ws.player);
    ws.player.account = null;
    ws.close(4001, 'account removed');
  }
  boards.cache.clear();
  store.save();
}

async function handleAdmin(req, res, pathname) {
  if (!adminAllowed(req)) return json(res, 401, { error: 'Admin token required.' });
  if (pathname === '/api/admin/players') {
    if (req.method !== 'GET') return json(res, 405, { error: 'GET only.' });
    return json(res, 200, { players: adminPlayers() });
  }
  let id = null;
  try { id = decodeURIComponent((/^\/api\/admin\/players\/([^/]+)$/.exec(pathname) || [])[1] || ''); } catch { /* bad escape */ }
  if (!id) return json(res, 404, { error: 'Not found.' });
  if (req.method !== 'PATCH' && req.method !== 'DELETE') return json(res, 405, { error: 'PATCH or DELETE only.' });
  const acc = liveAccount(id);
  if (!acc) return json(res, 404, { error: 'No such player.' });
  if (req.method === 'DELETE') { adminDelete(acc); return json(res, 200, { ok: true }); }
  if (Number(req.headers['content-length']) > 10 * 1024) return json(res, 400, { error: 'Request body too large.' });
  let body;
  try { body = await readBody(req, 10 * 1024); } catch { return json(res, 400, { error: 'Bad request body.' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json(res, 400, { error: 'Bad request body.' });
  const err = adminEdit(acc, body);
  if (err) return json(res, 400, { error: err });
  return json(res, 200, { player: adminPlayers().find((p) => p.id === acc.id) });
}

function json(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(obj));
}

function readBody(req, limit = 24000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

function signInWithCortexis(body, req) {
  let claims;
  try {
    claims = cx.verifyGameToken(body && body.gameToken);
  } catch (err) {
    return { status: err.code === 'config' ? 503 : 401, body: { error: err.message, code: err.code || 'invalid' } };
  }
  const guest = body.token ? accounts.byToken(body.token) : null;
  const out = accounts.bindCortexis(claims, {
    guest,
    country: cx.headerCountry(req) || cx.guessCountry(body.country),
    nickname: cx.nicknameFrom(claims.name),
  });
  return {
    status: 200,
    body: { id: out.account.id, token: out.token, created: out.created, merged: out.merged, profile: accounts.public(out.account) },
  };
}

// Solo runs happen entirely in the browser; this re-grades the full answer
// log against the exact bank version the browser played with.
async function settleSolo(req, res) {
  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { error: 'Bad request body.' }); }
  const acc = accounts.byToken(body.token);
  if (!acc) return json(res, 401, { error: 'Unknown player. Reload the page.' });
  const rankOf = bank.rankOf(body.v);
  if (!rankOf) return json(res, 409, { error: 'The topic list was updated during your run. Your next run will count.' });
  const log = Array.isArray(body.log) ? body.log : [];
  if (log.some((e) => !e || !(e.ms >= 400))) return json(res, 400, { error: 'Run log failed validation.' });
  const result = Scoring.soloRun(log, rankOf);
  if (result.error) return json(res, 400, { error: 'Run log failed validation.' });
  const now = Date.now();
  const played = log.reduce((a, e) => a + e.ms, 0);
  if (acc.lastSoloAt && now - acc.lastSoloAt < played - 3000) return json(res, 429, { error: 'Runs are arriving faster than they can be played.' });
  acc.lastSoloAt = now;
  const r = accounts.settleSolo(acc, result);
  return json(res, 200, { ...result, points: r.points, best: r.best, unlocked: r.unlocked, profile: accounts.public(acc) });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }
  if (url.pathname === '/api/admin/players' || url.pathname.startsWith('/api/admin/players/')) return handleAdmin(req, res, url.pathname);
  if (url.pathname === '/api/bank' && (req.method === 'GET' || req.method === 'HEAD')) {
    return sendBuf(req, res, { body: bank.json, gz: bank.gz, type: 'application/json', etag: bank.etag });
  }
  if (url.pathname === '/api/auth/config') return json(res, 200, cx.siteConfig(req));
  if (url.pathname === '/api/auth/cortexis' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch { return json(res, 400, { error: 'Bad request body.' }); }
    const out = signInWithCortexis(body || {}, req);
    return json(res, out.status, out.body);
  }
  if (url.pathname === '/api/solo' && req.method === 'POST') return settleSolo(req, res);
  if (url.pathname === '/healthz') return json(res, 200, { ok: true, ...manager.stats(), bank: bank.version });
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed.' });
  if (cfg.DEV) loadStatic();
  const f = files.get(url.pathname);
  if (!f) return json(res, 404, { error: 'Not found.' });
  sendBuf(req, res, f);
});

// A match request may name up to TOPICS_PER_MATCH topics in play order (`topics`); the older single `topic` still works.
const topicsOf = (msg) => (Array.isArray(msg.topics) ? msg.topics : msg.topic ? [msg.topic] : []);

/* ---------------- WebSocket protocol ---------------- */
const wss = new WebSocketServer({ server, maxPayload: 8 * 1024 });
const EMOTES = ['👏', '😂', '🔥', '😱', '🤔', '💀'];

wss.on('connection', (ws) => {
  const player = {
    ws, account: null, room: null, sid: null, tz: 0, tokens: 40, last: Date.now(), lastEmote: 0,
    send(obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); },
  };
  ws.player = player;   // the admin portal finds a player's sockets by account
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    // token bucket: 40 burst, 8/s refill
    const now = Date.now();
    player.tokens = Math.min(40, player.tokens + ((now - player.last) / 1000) * 8);
    player.last = now;
    if (player.tokens < 1) return;
    player.tokens -= 1;
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (!msg || typeof msg.type !== 'string') return;
    try { handle(player, msg); } catch (e) { console.error('[ws]', e); }
  });

  ws.on('close', () => { if (player.room) player.room.detach(player); });
});

function handle(p, msg) {
  if (msg.type === 'ping') return p.send({ type: 'pong', t: msg.t, s: Date.now() });
  if (msg.type === 'hello') {
    const { account, token, fresh } = accounts.login(msg.token);
    p.account = account;
    p.tz = msg.tz;
    if (fresh && msg.country) accounts.setIdentity(account, { country: msg.country });
    const visit = accounts.visit(account, msg.tz);
    p.send({
      type: 'welcome', token, fresh, profile: accounts.public(account), visit,
      bankVersion: bank.version, catalogue: CATALOGUE, avatars: AVATARS, avatarUnlocks: AVATAR_UNLOCKS,
      boards: META, serverTime: Date.now(), topicsPerMatch: cfg.TOPICS_PER_MATCH,
      config: { turnMs: cfg.TURN_MS, voteMs: cfg.VOTE_MS, maxSeats: cfg.MAX_SEATS, minSeats: cfg.MIN_SEATS, topics: cfg.TOPICS_PER_MATCH },
    });
    manager.tryRejoin(p);
    return;
  }
  if (!p.account) return;
  const room = p.room;

  switch (msg.type) {
    case 'profile':
      accounts.setIdentity(p.account, { name: msg.name, country: msg.country, avatar: msg.avatar });
      p.send({ type: 'profile', profile: accounts.public(p.account) });
      if (room && room.state === 'lobby') room.updateIdentity(p);
      break;
    case 'quick': manager.quick(p, msg.mode, topicsOf(msg), msg.culture, msg.rounds); break;
    case 'create': manager.create(p, msg.mode, topicsOf(msg), msg.culture, msg.rounds); break;
    case 'join': {
      const r = manager.join(p, msg.code);
      if (r.error) p.send({ type: 'error', msg: r.error });
      break;
    }
    case 'leave':
      manager.leave(p);
      p.send({ type: 'room_closed', reason: 'left' });
      break;
    case 'host': if (room) room.host(p, msg.action, msg.arg); break;
    case 'pick': if (room && room.m) room.pick(p.sid, msg.opt); break;
    case 'bid': if (room && room.m) room.bid(p.sid, msg.amount, msg.lot); break;
    case 'vote': if (room && room.m) room.castVote(p.sid, msg.sid); break;
    case 'secret': if (room && room.m) room.setSecret(p.sid, { loves: msg.loves, dud: msg.dud }); break;
    case 'emote': {
      const now = Date.now();
      if (room && EMOTES.includes(msg.e) && now - p.lastEmote > 1200) { p.lastEmote = now; room.emote(p.sid, msg.e); }
      break;
    }
    case 'board': {
      const scope = String(msg.scope || 'GLOBAL').toUpperCase();
      p.send(boards.board(String(msg.category || 'points'), String(msg.window || 'all'), scope, p.account.id));
      break;
    }
  }
}

// Drop dead sockets; publish learned crowd ratings on a slow cadence.
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

const publisher = setInterval(() => {
  if (bank.maybePublish()) {
    const msg = JSON.stringify({ type: 'bank', v: bank.version });
    for (const ws of wss.clients) if (ws.readyState === 1) ws.send(msg);
  }
}, cfg.RATINGS_PUBLISH_MS);

function shutdown() {
  clearInterval(heartbeat);
  clearInterval(publisher);
  try { store.flush(); } catch (e) { console.error(e); }
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(cfg.PORT, () => {
  const { port } = server.address();
  if (process.send) process.send({ port });
  console.log(`PickParty on http://localhost:${port}`);
});

module.exports = { server, manager, bank, accounts, ratings, store };
