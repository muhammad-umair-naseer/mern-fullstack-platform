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
const { ipOf, PerIp, Sockets } = require('./limits');

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

// A JSON object body; bad JSON, null or an array rejects.
function readBody(req, limit = 24000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
        resolve(body);
      } catch (e) { reject(e); }
    });
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

/* ---------------- Crowd read (solo), dealt by the server ----------------
   The bank the browser has carries no crowd ranking. The server keeps one run
   per account: it opens each topic on its own clock, grades the picks against
   the ranking the run started with, and only then shows that topic's ranking.
   The run is scored from the server's own log, once.
     start {token}             -> {run}
     topic {token, run, t}     -> {timer}
     pick  {token, run, f, d}  -> soloTopic result + {r, lives}
     /api/solo {token, run}    -> settlement */
const soloRuns = new Map();   // account id -> run
const SOLO_IDLE_MS = 30 * 60 * 1000;
const SOLO_LATE_MS = 2500;    // network time: a pick sent as the browser's clock ran out still counts

function closeTopic(run, f, d) {
  const c = run.cur;
  run.cur = null;
  const rank = bank.rankOf(run.v)(c.t);
  const took = Date.now() - c.at;
  const late = took > c.timer + SOLO_LATE_MS;
  const e = { t: c.t, f: late ? [-1, -1, -1] : f, d: late ? -1 : d, ms: Math.max(400, Math.min(took, c.timer)) };
  const res = Scoring.soloTopic(rank, e.f, e.d, e.ms, c.timer, run.combo);
  run.combo = res.combo;
  if (!res.survive) run.lives--;
  run.log.push(e);
  return { ...res, r: rank, lives: run.lives };
}

async function soloStep(req, res, step) {
  let body;
  try { body = await readBody(req, 4000); } catch { return json(res, 400, { error: 'Bad request body.' }); }
  const acc = accounts.byToken(body.token);
  if (!acc) return json(res, 401, { error: 'Unknown player. Reload the page.' });
  const now = Date.now();
  if (step === 'start') {
    for (const [id, r] of soloRuns) if (now - r.touched > SOLO_IDLE_MS) soloRuns.delete(id);
    const run = { id: crypto.randomBytes(18).toString('base64url'), v: bank.version, log: [], lives: Scoring.RULES.SOLO_LIVES, combo: 0, cur: null, touched: now };
    soloRuns.set(acc.id, run);   // starting again drops this account's previous run
    return json(res, 200, { run: run.id });
  }
  const run = soloRuns.get(acc.id);
  if (!run || run.id !== body.run) return json(res, 409, { error: 'This run is not open on the server any more.' });
  const rankOf = bank.rankOf(run.v);
  if (!rankOf) { soloRuns.delete(acc.id); return json(res, 409, { error: 'The topic list was updated during your run. Your next run will count.' }); }
  run.touched = now;
  if (step === 'topic') {
    if (run.cur) closeTopic(run, [-1, -1, -1], -1);   // an open topic left unanswered is a miss
    if (run.lives <= 0 || run.log.length >= Scoring.RULES.SOLO_MAX_TOPICS) return json(res, 409, { error: 'This run is over.' });
    if (typeof body.t !== 'string' || !rankOf(body.t) || run.log.some((e) => e.t === body.t)) return json(res, 400, { error: 'Unknown or repeated topic.' });
    run.cur = { t: body.t, at: now, timer: Scoring.soloTimer(run.log.length) };
    return json(res, 200, { timer: run.cur.timer });
  }
  if (step === 'pick') {
    if (!run.cur) return json(res, 409, { error: 'No topic is open.' });
    const n = rankOf(run.cur.t).length;
    const f = Array.isArray(body.f) ? body.f.slice(0, 3) : [];
    const all = [...f, body.d];
    const real = all.filter((x) => x >= 0);
    if (f.length !== 3 || !all.every((x) => Number.isInteger(x) && x >= -1 && x < n) || new Set(real).size !== real.length) return json(res, 400, { error: 'Bad picks.' });
    return json(res, 200, closeTopic(run, f, body.d));
  }
  return json(res, 404, { error: 'Not found.' });
}

// The run is over: score the server's log for it, once.
async function settleSolo(req, res) {
  let body;
  try { body = await readBody(req, 4000); } catch { return json(res, 400, { error: 'Bad request body.' }); }
  const acc = accounts.byToken(body.token);
  if (!acc) return json(res, 401, { error: 'Unknown player. Reload the page.' });
  const run = soloRuns.get(acc.id);
  if (!run || run.id !== body.run) return json(res, 409, { error: 'This run is not open on the server any more.' });
  soloRuns.delete(acc.id);
  const rankOf = bank.rankOf(run.v);
  if (!rankOf) return json(res, 409, { error: 'The topic list was updated during your run. Your next run will count.' });
  if (run.cur) closeTopic(run, [-1, -1, -1], -1);
  const result = Scoring.soloRun(run.log, rankOf);
  if (result.error) return json(res, 400, { error: 'Nothing to score.' });
  const now = Date.now();
  const played = run.log.reduce((a, e) => a + e.ms, 0);
  if (acc.lastSoloAt && now - acc.lastSoloAt < played - 3000) return json(res, 429, { error: 'Runs are arriving faster than they can be played.' });
  acc.lastSoloAt = now;
  const r = accounts.settleSolo(acc, result, cfg.SOLO_POINTS_PER_DAY);
  return json(res, 200, { ...result, points: r.points, best: r.best, capped: r.capped, unlocked: r.unlocked, profile: accounts.public(acc) });
}

async function route(req, res) {
  let url;
  try { url = new URL(req.url, 'http://x'); } catch { return json(res, 400, { error: 'Bad request.' }); }
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
    const out = signInWithCortexis(body, req);
    return json(res, out.status, out.body);
  }
  if (url.pathname === '/api/solo' && req.method === 'POST') return settleSolo(req, res);
  const solo = /^\/api\/solo\/(start|topic|pick)$/.exec(url.pathname);
  if (solo && req.method === 'POST') return soloStep(req, res, solo[1]);
  if (url.pathname === '/healthz') return json(res, 200, { ok: true, ...manager.stats(), bank: bank.version });
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed.' });
  if (cfg.DEV) loadStatic();
  const f = files.get(url.pathname);
  if (!f) return json(res, 404, { error: 'Not found.' });
  sendBuf(req, res, f);
}

// One bad request must never take the server down: anything a handler throws ends that request only.
const server = http.createServer((req, res) => {
  route(req, res).catch((e) => {
    console.error('[http]', e);
    if (res.headersSent) res.destroy(); else json(res, 500, { error: 'Server error.' });
  });
});

// A match request may name up to TOPICS_PER_MATCH topics in play order (`topics`); the older single `topic` still works.
const topicsOf = (msg) => (Array.isArray(msg.topics) ? msg.topics : msg.topic ? [msg.topic] : []);

/* ---------------- WebSocket protocol ---------------- */
const wss = new WebSocketServer({ server, maxPayload: cfg.WS_MAX_PAYLOAD });

// per-IP limits (server/config.js): sockets open, rooms asked for, guests minted
const perIpSockets = new Sockets(cfg.SOCKETS_PER_IP);
const roomAsks = new PerIp(cfg.ROOMS_PER_IP_PER_MIN, 60 * 1000);
const guestMints = new PerIp(cfg.GUESTS_PER_IP_PER_HOUR, 60 * 60 * 1000);
const EMOTES = ['👏', '😂', '🔥', '😱', '🤔', '💀'];

wss.on('connection', (ws, req) => {
  const ip = ipOf(req, cfg.TRUST_PROXY);
  if (!perIpSockets.add(ip)) return ws.close(1013, 'Too many connections from this address');
  ws.on('close', () => perIpSockets.remove(ip));
  const player = {
    ws, ip, account: null, room: null, sid: null, tz: 0, tokens: cfg.MSG_BURST, last: Date.now(), lastEmote: 0,
    send(obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); },
  };
  ws.player = player;   // the admin portal finds a player's sockets by account
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    // token bucket: MSG_BURST at once, refilled at MSG_PER_SEC; the rest is dropped
    const now = Date.now();
    player.tokens = Math.min(cfg.MSG_BURST, player.tokens + ((now - player.last) / 1000) * cfg.MSG_PER_SEC);
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
    if (!accounts.byToken(msg.token) && !guestMints.take(p.ip)) {
      p.send({ type: 'error', msg: 'Too many new players from your network. Try again later.' });
      return p.ws.close(1013, 'Too many new players from this address');
    }
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
    case 'quick':
    case 'create':
      if (!roomAsks.take(p.ip)) { p.send({ type: 'error', msg: 'Too many tables started. Wait a minute.' }); break; }
      manager[msg.type](p, msg.mode, topicsOf(msg), msg.culture, msg.rounds);
      break;
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

const sweeper = setInterval(() => { roomAsks.sweep(); guestMints.sweep(); }, 5 * 60 * 1000);

const publisher = setInterval(() => {
  if (bank.maybePublish()) {
    const msg = JSON.stringify({ type: 'bank', v: bank.version });
    for (const ws of wss.clients) if (ws.readyState === 1) ws.send(msg);
  }
}, cfg.RATINGS_PUBLISH_MS);

function shutdown() {
  clearInterval(heartbeat);
  clearInterval(publisher);
  clearInterval(sweeper);
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
