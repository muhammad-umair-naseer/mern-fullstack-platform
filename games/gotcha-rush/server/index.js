'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const WebSocket = require('ws');

const cfg = require('./config');
const { randomId, sanitizeText, sanitizeCountry } = require('./util');
const Player = require('./Player');
const Room = require('./Room');
const RoomManager = require('./RoomManager');
const Store = require('./store');
const { Accounts } = require('./accounts');
const { Leaderboards } = require('./leaderboards');
const { CATALOGUE } = require('./achievements');
const { Bank, LANG_META } = require('./puzzles');
const runner = require('./runner');
const { verifyRun } = require('./rush');
const cx = require('./cx');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SHARED_DIR = path.join(__dirname, '..', 'shared');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const bank = new Bank(path.resolve(__dirname, '..', cfg.BANK_FILE));
const stale = bank.checkStale();
if (stale) console.warn(`[bank] ${stale} puzzle source(s) changed since bank.json was generated — run \`npm run verify\``);

const store = new Store(path.resolve(__dirname, '..', cfg.DATA_FILE));
const accounts = new Accounts(store);
const boards = new Leaderboards(accounts);
const manager = new RoomManager({ bank, accounts, boards });
const clients = new Map();

/* ------------------------------------------------------------------ HTTP */

/**
 * Static assets and the puzzle bank are read once, gzipped once and served
 * from memory with strong ETags: a returning client gets 304s, a CDN in front
 * can cache everything, and the server's per-request work is a Map lookup.
 */
const assetCache = new Map(); // key -> { body, gz, etag, type }
function cachedAsset(key, loader, type) {
  let a = assetCache.get(key);
  if (a) return a;
  const body = loader();
  if (body == null) return null;
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  a = { body: buf, gz: zlib.gzipSync(buf, { level: 9 }), etag: `"${crypto.createHash('sha1').update(buf).digest('base64').slice(0, 20)}"`, type };
  assetCache.set(key, a);
  return a;
}

function sendAsset(req, res, a, { maxAge = cfg.STATIC_MAX_AGE, status = 200 } = {}) {
  if (req.headers['if-none-match'] === a.etag) { res.writeHead(304, { ETag: a.etag, 'Cache-Control': `public, max-age=${maxAge}` }); return res.end(); }
  const gzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(status, {
    'Content-Type': a.type, ETag: a.etag, 'Cache-Control': `public, max-age=${maxAge}`, Vary: 'Accept-Encoding',
    ...(gzip ? { 'Content-Encoding': 'gzip', 'Content-Length': a.gz.length } : { 'Content-Length': a.body.length }),
  });
  res.end(gzip ? a.gz : a.body);
}

function json(res, status, obj, maxAge = 0) {
  res.writeHead(status, { 'Content-Type': MIME['.json'], 'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store' });
  res.end(JSON.stringify(obj));
}

function readBody(req, limit = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (d) => { raw += d; if (raw.length > limit) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

const runBucket = new Map(); // ip -> timestamps of recent Lab runs
function rateLimited(ip) {
  const now = Date.now();
  const list = (runBucket.get(ip) || []).filter((t) => now - t < 60000);
  if (list.length >= cfg.RUNNER_RATE_PER_MIN) return true;
  list.push(now);
  runBucket.set(ip, list);
  return false;
}

/** Where a new or signing-in player is from: a CDN header, else the browser's own guess. */
const firstCountry = (req, guess) => cx.headerCountry(req) || cx.guessCountry(guess);

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
  boards.invalidate();
  manager.onGameSettled && manager.onGameSettled();
  return {
    status: 200,
    body: { id: out.account.id, token: out.token, created: out.created, merged: out.merged, profile: accounts.profile(out.account), standings: boards.standings(out.account) },
  };
}

async function handleApi(req, res, urlPath) {
  if (urlPath === '/api/auth/config') {
    return json(res, 200, cx.siteConfig(req));
  }
  if (urlPath === '/api/auth/cortexis' && req.method === 'POST') {
    let body;
    try { body = JSON.parse(await readBody(req)); } catch (_) { return json(res, 400, { error: 'Bad request body.' }); }
    const out = signInWithCortexis(body || {}, req);
    return json(res, out.status, out.body);
  }
  if (urlPath === '/api/auth/signout' && req.method === 'POST') {
    let body;
    try { body = JSON.parse(await readBody(req)); } catch (_) { return json(res, 400, { error: 'Bad request body.' }); }
    const acc = body && body.accountId && Object.prototype.hasOwnProperty.call(accounts.accounts, body.accountId) ? accounts.accounts[body.accountId] : null;
    return json(res, 200, { ok: true, revoked: acc ? accounts.revoke(acc, body.token) : false });
  }
  if (urlPath === '/api/stats') {
    return json(res, 200, { online: clients.size, ...manager.stats(), accounts: accounts.size, runner: cfg.RUNNER_LIVE ? cfg.RUNNER : 'off', uptime: Math.round(process.uptime()) });
  }
  if (urlPath.startsWith('/api/board')) {
    const q = new URLSearchParams(req.url.split('?')[1] || '');
    return json(res, 200, boards.board(q.get('category') || 'points', q.get('window') || 'all', (q.get('scope') || 'global').toUpperCase(), null), 10);
  }
  if (urlPath === '/api/bank') {
    // the whole bank minus answers/explanations; cached by the client, so a
    // match round only ever needs to carry a puzzle id
    return sendAsset(req, res, cachedAsset('bank', () => JSON.stringify(bank.publicBank()), MIME['.json']), { maxAge: cfg.BANK_MAX_AGE });
  }
  if (urlPath.startsWith('/api/reveal/')) {
    const p = bank.byId.get(urlPath.slice('/api/reveal/'.length));
    if (!p) return json(res, 404, { error: 'unknown puzzle' });
    return sendAsset(req, res, cachedAsset(`reveal:${p.id}`, () => JSON.stringify(bank.reveal(p)), MIME['.json']), { maxAge: cfg.BANK_MAX_AGE });
  }
  if (urlPath.startsWith('/api/choices/')) {
    const p = bank.byId.get(urlPath.slice('/api/choices/'.length));
    if (!p) return json(res, 404, { error: 'unknown puzzle' });
    return json(res, 200, { id: p.id, choices: bank.choices(p) });
  }
  if (urlPath === '/api/rush' && req.method === 'POST') {
    // Solo Rush ran in the browser; verify the answer log and settle the account
    let body;
    try { body = JSON.parse(await readBody(req, 64 * 1024)); } catch (_) { return json(res, 400, { error: 'Bad request body.' }); }
    const { account, created } = accounts.login(body.accountId, body.token);
    if (created) return json(res, 401, { error: 'Unknown account. Reload the page and try again.' });
    const rushName = sanitizeText(body.name, cfg.MAX_NAME_LEN);
    const keepName = accounts.isCortexis(account) && /^Guest(-\w+)?$/i.test(rushName);
    if (body.name || body.country || body.avatar) accounts.setIdentity(account, { name: keepName ? null : rushName, country: sanitizeCountry(body.country), avatar: Player.AVATARS.includes(body.avatar) ? body.avatar : null });
    const run = verifyRun(bank, body);
    if (!run.rounds) return json(res, 400, { error: 'Nothing to score.', flags: run.flags });
    const out = accounts.recordGame(account, {
      mode: 'rush', rank: 1, rounds: run.rounds, correct: run.correct, bestCombo: run.bestCombo, score: run.score,
      lifelines: run.lifelines, fastestMs: run.fastestMs, langs: run.langs, racers: 1, humans: 1, ranked: true,
    });
    manager.onGameSettled && manager.onGameSettled();
    return json(res, 200, {
      type: 'game_result', mode: 'rush', score: run.score, rounds: run.rounds, correct: run.correct, bestCombo: run.bestCombo,
      fastestMs: run.fastestMs, flags: run.flags, points: out.points, ranked: out.ranked, perfect: out.perfect, streak: out.streak,
      bestStreak: out.bestStreak, streakEvent: out.streakEvent, unlocked: out.unlocked, profile: accounts.profile(account), standings: boards.standings(account), series: [],
    });
  }
  if (urlPath === '/api/puzzles') {
    return json(res, 200, { count: bank.size, generatedAt: bank.generatedAt, runtimes: bank.runtimes, puzzles: bank.puzzles.map((p) => ({ id: p.id, lang: p.lang, title: p.title, difficulty: p.difficulty, tags: p.tags })) }, cfg.BANK_MAX_AGE);
  }
  if (urlPath === '/api/run' && req.method === 'POST') {
    // The Lab: rerun an edited snippet. Only enabled when a sandboxed runner is configured.
    if (!cfg.RUNNER_LIVE || cfg.RUNNER === 'off') return json(res, 404, { error: 'Live runner is not enabled on this server.' });
    if (cfg.RUNNER === 'local' && process.env.RUNNER_LIVE_ALLOW_LOCAL !== '1') return json(res, 403, { error: 'Refusing to run untrusted code with the local runner. Use RUNNER=docker or RUNNER=judge0.' });
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';
    if (rateLimited(ip)) return json(res, 429, { error: 'Too many runs. Try again in a minute.' });
    let body;
    try { body = JSON.parse(await readBody(req)); } catch (_) { return json(res, 400, { error: 'Bad request body.' }); }
    const lang = LANG_META[body.lang] ? body.lang : null;
    const code = typeof body.code === 'string' ? body.code.slice(0, 8000) : '';
    if (!lang || !code.trim()) return json(res, 400, { error: 'Need a lang and some code.' });
    const r = await runner.run(lang, code, {});
    return json(res, 200, { ok: r.ok, stdout: r.stdout.slice(0, 8000), stderr: r.stderr.slice(0, 2000), timedOut: r.timedOut, ms: r.ms });
  }
  if (urlPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  return json(res, 404, { error: 'not found' });
}

// Code is never served stale: html, css and js revalidate on every load (a
// cheap 304 while nothing changed), so a new page never runs old styles.
// Only pictures, sounds and fonts sit in the cache.
const CODE_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest']);

function serveStatic(req, res) {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath.startsWith('/api/') || urlPath === '/healthz') return handleApi(req, res, urlPath).catch((err) => json(res, 500, { error: err.message }));

  if (urlPath === '/') urlPath = '/index.html';
  const root = urlPath.startsWith('/shared/') ? SHARED_DIR : PUBLIC_DIR;
  const rel = urlPath.startsWith('/shared/') ? urlPath.slice('/shared/'.length) : urlPath;
  let filePath = path.normalize(path.join(root, rel));
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) filePath = path.join(PUBLIC_DIR, 'index.html'); // SPA fallback
  const ext = path.extname(filePath).toLowerCase();
  const asset = cachedAsset(`file:${filePath}`, () => { try { return fs.readFileSync(filePath); } catch (_) { return null; } }, MIME[ext] || 'application/octet-stream');
  if (!asset) { res.writeHead(404); return res.end('Not found'); }
  sendAsset(req, res, asset, { maxAge: CODE_EXT.has(ext) ? 0 : cfg.STATIC_MAX_AGE });
}

// dev convenience: forget cached files when they change on disk
if (process.env.NODE_ENV !== 'production') {
  try {
    for (const dir of [PUBLIC_DIR, SHARED_DIR]) fs.watch(dir, { recursive: true }, () => assetCache.clear());
  } catch (_) { /* recursive watch unsupported on this platform */ }
}

const server = http.createServer(serveStatic);
const wss = new WebSocket.Server({ server, maxPayload: 16 * 1024 });

/* ------------------------------------------------------------- WebSocket */

function broadcastAll(obj) {
  const raw = JSON.stringify(obj);
  for (const p of clients.values()) p.sendRaw(raw);
}

let boardPushTimer = null;
manager.onGameSettled = () => {
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

wss.on('connection', (ws, req) => {
  const player = new Player(randomId(10), ws);
  player.ipCountry = cx.headerCountry(req);   // the country header only; the IP is never kept
  clients.set(player.id, player);
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  player.send({
    type: 'welcome',
    id: player.id,
    serverTime: Date.now(),
    online: clients.size,
    achievements: CATALOGUE,
    boards: Leaderboards.meta,
    avatars: Player.AVATARS,
    langs: Object.fromEntries(Object.entries(LANG_META).map(([k, v]) => [k, { name: v.name, runtime: v.runtime, count: bank.puzzles.filter((p) => p.lang === k).length }])),
    config: { maxPlayers: cfg.MAX_PLAYERS, rounds: cfg.ROUNDS, roundMs: cfg.ROUND_MS, lab: cfg.RUNNER_LIVE && cfg.RUNNER !== 'off', rankedPrivate: cfg.RANKED_PRIVATE, puzzles: bank.size, bankVersion: bank.generatedAt },
  });
  broadcastAll({ type: 'online', n: clients.size });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (_) { return; }
    if (!msg || typeof msg.type !== 'string') return;
    try { route(player, msg); } catch (err) { console.error('[route]', msg.type, err); }
  });

  ws.on('close', () => {
    clients.delete(player.id);
    player.connected = false;
    manager.leave(player);
    broadcastAll({ type: 'online', n: clients.size });
  });
});

function route(player, msg) {
  switch (msg.type) {
    case 'ping':
      return player.send({ type: 'pong', t: msg.t, st: Date.now() });

    case 'hello': {
      const typed = sanitizeText(msg.name, cfg.MAX_NAME_LEN);
      player.country = sanitizeCountry(msg.country);
      player.avatar = Player.AVATARS.includes(msg.avatar) ? msg.avatar : 'bolt';
      // resolve the account on first hello, or when the browser now holds
      // different credentials (it just signed in with Cortexis)
      let created = false;
      if (!player.account || (msg.accountId && msg.accountId !== player.account.id)) {
        const out = accounts.login(msg.accountId, msg.token, { country: player.ipCountry || cx.guessCountry(msg.countryGuess) || cx.guessCountry(msg.country) });
        player.account = out.account;
        created = out.created;
        player.send({ type: 'account', id: out.account.id, token: out.token, created, profile: accounts.profile(out.account), standings: boards.standings(out.account) });
      }
      // a brand-new player takes the country found at first contact; after that the player's own pick wins
      if (created) player.country = player.account.country;
      // a Cortexis player keeps their nickname when the browser has none to offer
      const keepName = accounts.isCortexis(player.account) && (!typed || /^Guest(-\w+)?$/i.test(typed));
      player.name = keepName ? player.account.name : typed || 'Guest-' + player.id.slice(0, 3);
      accounts.setIdentity(player.account, { name: player.name, country: player.country, avatar: player.avatar });
      player.send({ type: 'hello_ok', player: player.info() });
      if (player.room) player.room.broadcastState();
      return;
    }

    case 'signout': {
      // back to a fresh guest: the next hello (without credentials) mints one
      if (player.account) accounts.revoke(player.account, msg.token);
      player.account = null;
      return player.send({ type: 'signed_out' });
    }

    case 'quick': {
      const r = manager.quickMatch(player, Room.LANGS.includes(msg.lang) ? msg.lang : 'mix');
      if (!r.ok) player.send({ type: 'error', message: r.error });
      return;
    }
    case 'create': {
      const r = manager.createPrivate(player, { lang: Room.LANGS.includes(msg.lang) ? msg.lang : 'mix', rounds: msg.rounds });
      if (!r.ok) player.send({ type: 'error', message: r.error });
      return;
    }
    case 'join': {
      const r = manager.join(player, msg.code);
      if (!r.ok) player.send({ type: 'error', message: r.error });
      return;
    }
    case 'leave':
      manager.leave(player);
      return player.send({ type: 'left' });
    case 'start':
      if (player.room) player.room.hostStart(player, { bots: msg.bots !== false, lang: msg.lang, rounds: msg.rounds });
      return;
    case 'answer':
      if (player.room) player.room.handleAnswer(player, msg);
      return;
    case 'lifeline':
      if (player.room) player.room.handleLifeline(player);
      return;
    case 'puzzle': { // fallback for a client whose cached bank predates this puzzle
      const p = bank.byId.get(String(msg.id));
      if (p) player.send({ type: 'puzzle', puzzle: Bank.publicView(p) });
      return;
    }
    case 'chat':
      if (player.room) player.room.handleChat(player, msg.text);
      return;
    case 'emote':
      if (player.room) player.room.handleEmote(player, msg.e);
      return;
    case 'board': {
      const category = typeof msg.category === 'string' ? msg.category : 'points';
      const win = typeof msg.window === 'string' ? msg.window : 'all';
      const scope = String(msg.scope || 'global').toUpperCase();
      player.watching = { category, window: win, scope };
      return player.send(boards.board(category, win, scope, player.account ? player.account.id : null));
    }
    default:
  }
}

// heartbeat: drop dead sockets so rooms don't wait on ghosts
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);
heartbeat.unref?.();

server.listen(cfg.PORT, cfg.HOST, () => {
  console.log(`Gotcha Rush listening on http://localhost:${cfg.PORT}  (${bank.size} puzzles, ${cfg.ROUNDS} rounds/match, lab ${cfg.RUNNER_LIVE ? cfg.RUNNER : 'off'})`);
});

module.exports = { server, wss, manager, accounts, boards, store, bank };
