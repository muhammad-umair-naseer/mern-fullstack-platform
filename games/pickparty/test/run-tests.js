'use strict';
// Spins up the real server with short timers and drives it with real
// WebSocket clients. No mocks: rooms, bots, scoring, accounts, boards,
// solo settlement and the crowd-rating publisher are all exercised.
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const WebSocket = require('ws');
const Scoring = require('../shared/scoring');

const DATA = '/tmp/pickparty-test/db.json';
fs.rmSync(path.dirname(DATA), { recursive: true, force: true });

const env = {
  ...process.env, PORT: '0', DATA_FILE: DATA,
  LOBBY_WAIT_MS: '700', INTRO_MS: '150', TURN_MS: '1200', AWAY_TURN_MS: '150', PICK_GAP_MS: '40',
  VOTE_MS: '1200', ROUND_RESULT_MS: '150', SECRET_MS: '1500', REVEAL_STEP_MS: '60', TOPIC_END_MS: '150',
  MATCH_END_MS: '500', BOT_MIN_MS: '40', BOT_MAX_MS: '120', RATINGS_PUBLISH_MS: '1200',
  BID_MS: '600', BID_EXTEND_MS: '300', BID_MAX_MS: '1500', SOLD_MS: '80', AUCTION_REVEAL_STEP_MS: '40',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Client {
  constructor(port, name) { this.port = port; this.name = name; this.msgs = []; this.room = null; this.auto = true; this.token = null; }
  connect(token) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`ws://localhost:${this.port}`);
      this.ws.on('open', () => this.send({ type: 'hello', token, tz: -300, country: 'PK' }));
      this.ws.on('error', reject);
      this.ws.on('message', (d) => {
        const m = JSON.parse(d);
        this.msgs.push(m);
        if (m.type === 'welcome') {
          this.token = m.token; this.profile = m.profile;
          if (m.fresh) this.send({ type: 'profile', name: this.name, country: 'PK' });
          resolve(m);
        }
        if (m.type === 'room') { this.room = m.room; this.play(m.room); }
        if (m.type === 'room_closed') this.room = null;
      });
    });
  }
  send(o) { this.ws.send(JSON.stringify(o)); }
  close() { this.ws.close(); }
  play(r) {
    if (!this.auto || !r.match || !r.match.topic) return;
    const T = r.match.topic;
    if (r.phase === 'draft' && T.turnSid === r.you) {
      const free = T.layout.filter((o) => T.taken[o] === undefined);
      this.send({ type: 'pick', opt: free[0] });
    }
    if (r.phase === 'vote' && !T.myVote && !this.voted) {
      const target = T.roundPicks.find((p) => p.sid !== r.you);
      if (target) { this.voted = true; this.send({ type: 'vote', sid: target.sid }); }
    }
    if (r.phase !== 'vote') this.voted = false;
    if (r.phase === 'secret' && T.mind === r.you && !T.mindReady && !this.sentSecret) {
      this.sentSecret = true;
      this.send({ type: 'secret', loves: T.layout.slice(0, 3), dud: T.layout[3] });
    }
    if (r.phase !== 'secret') this.sentSecret = false;
  }
  until(pred, ms, label) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      const iv = setInterval(() => {
        const hit = this.msgs.find(pred);
        if (hit) { clearInterval(iv); resolve(hit); }
        else if (Date.now() - t0 > ms) { clearInterval(iv); reject(new Error(`timeout: ${label} (${this.name})`)); }
      }, 20);
    });
  }
}

async function http(port, p, opts = {}) {
  const res = await fetch(`http://localhost:${port}${p}`, opts);
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, headers: res.headers, body };
}

const TOPIC_COUNT = 88, OPTIONS_PER_TOPIC = 16;
const CULTURES = ['d', 'g', 'n', 'm']; // desi, global, neutral (anyone's), mixed items

// The content bank is hand-written data, so check its shape before the
// server boots: a malformed topic would only show up mid-match otherwise.
// Emoji 14.0 and 15.0 code points: they render as a blank box on iOS 15 /
// macOS 12 and older Android, and a dud card nobody can read is no dud at all.
const TOO_NEW_EMOJI = [
  [0x1FAE0, 0x1FAE8], [0x1FAF0, 0x1FAF8], [0x1FA75, 0x1FA77], [0x1FA7B, 0x1FA7C], [0x1FA87, 0x1FA88],
  [0x1FAA9, 0x1FAAF], [0x1FAB7, 0x1FABF], [0x1FAC3, 0x1FAC5], [0x1FACE, 0x1FACF], [0x1FAD7, 0x1FADB],
  [0x1F6DC, 0x1F6DF], [0x1F7F0, 0x1F7F0],
];
const tooNew = (emoji) => [...emoji].some((ch) => { const cp = ch.codePointAt(0); return TOO_NEW_EMOJI.some(([a, b]) => cp >= a && cp <= b); });

function checkBank() {
  const topics = require('../shared/topics.json');
  assert.strictEqual(topics.length, TOPIC_COUNT, `expected ${TOPIC_COUNT} topics in shared/topics.json, got ${topics.length}`);
  const ids = new Set();
  for (const t of topics) {
    assert.ok(/^[a-z0-9]+$/.test(t.id), `topic id "${t.id}" must be lowercase alphanumeric`);
    assert.ok(!ids.has(t.id), `duplicate topic id "${t.id}"`);
    ids.add(t.id);
    assert.ok(typeof t.t === 'string' && t.t.trim(), `topic ${t.id} needs a title`);
    assert.ok(typeof t.e === 'string' && t.e.trim(), `topic ${t.id} needs an emoji`);
    assert.ok(CULTURES.includes(t.c), `topic ${t.id} needs a culture tag (d/g/n/m), got ${JSON.stringify(t.c)}`);
    assert.ok(!tooNew(t.e), `topic ${t.id}: title emoji ${t.e} too new for older phones`);
    assert.ok(Array.isArray(t.o) && t.o.length === OPTIONS_PER_TOPIC, `topic ${t.id} must have ${OPTIONS_PER_TOPIC} options, has ${t.o && t.o.length}`);
    const names = new Set();
    for (const o of t.o) {
      assert.ok(Array.isArray(o) && o.length === 2, `topic ${t.id}: every option is [name, emoji]`);
      const [name, emoji] = o;
      assert.ok(typeof name === 'string' && name.trim() && name.length <= 32, `topic ${t.id}: bad option name ${JSON.stringify(name)}`);
      assert.ok(typeof emoji === 'string' && emoji.trim() && !/[a-z0-9]/i.test(emoji), `topic ${t.id}: "${name}" needs an emoji, got ${JSON.stringify(emoji)}`);
      assert.ok(!tooNew(emoji), `topic ${t.id}: "${name}" uses an emoji (${emoji}) too new for older phones`);
      const key = name.trim().toLowerCase();
      assert.ok(!names.has(key), `topic ${t.id}: duplicate option "${name}"`);
      names.add(key);
    }
  }
  // item pictures are optional, but every entry must point at a real card and a Wikimedia thumbnail with a credit
  let artCount = 0;
  const artPath = path.join(__dirname, '..', 'shared', 'art.json');
  if (fs.existsSync(artPath)) {
    const art = JSON.parse(fs.readFileSync(artPath, 'utf8'));
    for (const [tid, opts] of Object.entries(art)) {
      assert.ok(ids.has(tid), `art.json: unknown topic ${tid}`);
      for (const [idx, e] of Object.entries(opts)) {
        const i = Number(idx);
        assert.ok(Number.isInteger(i) && i >= 0 && i < OPTIONS_PER_TOPIC, `art.json: ${tid} has a bad option index ${idx}`);
        if (e === null) continue; // looked up, no free picture
        assert.ok(/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(e.src), `art.json: ${tid}[${idx}] src must be a Wikimedia thumbnail`);
        assert.ok(typeof e.by === 'string' && e.by.trim() && typeof e.lic === 'string' && e.lic.trim(), `art.json: ${tid}[${idx}] needs by and lic`);
        artCount++;
      }
    }
  }
  const pool = (keep) => topics.filter((t) => keep.includes(t.c)).length;
  assert.ok(pool('dn') >= 40 && pool('gn') >= 40, `each pure culture needs 40+ packs (desi ${pool('dn')}, global ${pool('gn')})`);
  console.log(`✓ bank shape (${topics.length} topics × ${OPTIONS_PER_TOPIC} options, ${artCount} pictures; desi ${pool('dn')}, global ${pool('gn')}, mix ${topics.length})`);
}

// Pure scoring rules for the auction, checked before the server boots.
function checkScoring() {
  assert.deepStrictEqual([3, 4, 5, 6].map(Scoring.auctionLineup), [4, 4, 3, 2], 'lineup size by seats');
  const res = Scoring.auctionTopic([3, 1, 0, 2], { a: [{ opt: 3, price: 9 }, { opt: 2, price: 0 }], b: [{ opt: 1, price: 5 }] }, { a: 11, b: 15 });
  assert.deepStrictEqual(res.values, { 3: 40, 1: 30, 0: 20, 2: 10 }, 'value falls by 10 per rank from the top');
  assert.deepStrictEqual(res.change, { a: 55, b: 75 }, '5 points per coin left');
  assert.deepStrictEqual(res.points, { a: 105, b: 105 }, 'card values plus change');
  console.log('✓ scoring: auction rules');
}

// The picture script's title matcher: a wrong entity (an actor for a basketball player) is worse than no picture.
function checkArtMatcher() {
  const { accept, HINTS } = require('../scripts/fetch-art.js');
  const yes = [['Mushrooms', 'Mushroom', 'pizza'], ['Chicken tikka', 'Chicken tikka masala', 'pizza'], ['Oranges', 'Orange (fruit)', 'fruit'], ['Island resort', 'Resort island', 'holiday'],
    ['Steve Smith', 'Steve Smith (cricketer)', 'cricketers'], ['Burpees', 'Burpee (exercise)', 'gym'], ['Gorilla', 'Mountain gorilla', 'wild'], ['Lemon ginger tea', 'Ginger tea', 'drinks'], ['Jalapeños', 'Jalapeño', 'pizza'],
    ['Cookies', 'Cookie', 'desserts'], ['Black olives', 'Olive', 'pizza'], ['Chicken biryani', 'Biryani', 'comfort'], ['Snowfall', 'Snow', 'weather'], ['Pull-ups', 'Pull-up', 'gym'], ['Mustard', 'Mustard (condiment)', 'sauces'], ['Stand mixer', 'Mixer (appliance)', 'gadgets']];
  const no = [['Anthony Edwards', 'Anthony Edwards (actor)', 'nba'], ['Snake', 'Snake (zodiac)', 'pets'], ['Crisp autumn', 'Crisp (dessert)', 'weather'], ['Anchovies', 'Anchovies as food', 'pizza'],
    ['Historic ruins', 'Ichijōdani Asakura Family Historic Ruins', 'holiday'], ['Banana slicer', 'Banana', 'gadgets'], ['Tesla', 'Nikola Tesla', 'cars'], ['Panda', 'Panda Bear (musician)', 'wild'], ['Turtle', 'Common box turtle', 'pets']];
  for (const [name, title, topic] of yes) assert.ok(accept(name, title, HINTS[topic]), `matcher should accept "${title}" for "${name}"`);
  for (const [name, title, topic] of no) assert.ok(!accept(name, title, HINTS[topic]), `matcher should refuse "${title}" for "${name}"`);
  console.log('✓ art matcher: exact, plural, one extra word or a hinted parenthetical; nothing looser');
}

(async () => {
  try { checkBank(); checkScoring(); checkArtMatcher(); } catch (e) { console.error('✗', e.message); console.log('\nFAILED'); process.exit(1); }
  const srv = fork(path.join(__dirname, '..', 'server', 'index.js'), { env, stdio: ['ignore', 'ignore', 'inherit', 'ipc'] });
  const port = await new Promise((r) => srv.on('message', (m) => m.port && r(m.port)));
  // a crash in the runner must not leave the forked server behind holding the pipe open
  process.on('uncaughtException', (e) => { console.error('✗ uncaught:', e.stack || e.message); srv.kill('SIGTERM'); process.exit(1); });
  let failed = false;
  try {
    /* ---------- static + bank ---------- */
    const home = await http(port, '/');
    assert.strictEqual(home.status, 200);
    assert.ok(/PickParty/.test(home.body), 'index served');
    const bank = await http(port, '/api/bank');
    assert.strictEqual(bank.status, 200);
    assert.strictEqual(bank.body.topics.length, TOPIC_COUNT);
    assert.ok(bank.body.topics.every((t) => Array.isArray(t.a) && t.a.length === OPTIONS_PER_TOPIC), 'bank carries art slots');
    const etag = bank.headers.get('etag');
    const again = await http(port, '/api/bank', { headers: { 'If-None-Match': etag } });
    assert.strictEqual(again.status, 304, 'bank revalidates with 304');
    console.log(`✓ static + bank (${bank.body.topics.length} topics, etag ${etag})`);

    /* ---------- Crowd pleaser quick match: 2 humans + bots ---------- */
    const A = new Client(port, 'Alice'), B = new Client(port, 'Bilal');
    await A.connect(); await B.connect();
    assert.ok(A.token && A.token.length >= 20, 'token issued');
    A.send({ type: 'quick', mode: 'crowd' });
    await sleep(80);
    B.send({ type: 'quick', mode: 'crowd' });
    const started = await A.until((m) => m.type === 'room' && m.room.match, 4000, 'crowd match starts');
    assert.strictEqual(started.room.seats.length, 4, 'topped up to 4 seats with bots');
    assert.strictEqual(started.room.seats.filter((s) => s.bot).length, 2);
    assert.ok(started.room.seats.some((s) => s.sid === B.room.you), 'both humans at one table');
    const votePhase = await A.until((m) => m.type === 'room' && m.room.phase === 'vote', 8000, 'vote phase');
    assert.strictEqual(votePhase.room.match.topic.roundPicks.length, 4, 'each seat drafted once in round 1');
    const rr = await A.until((m) => m.type === 'room' && m.room.phase === 'round_result', 6000, 'round result');
    const totalVotes = Object.values(rr.room.match.topic.roundResult.tally).reduce((a, b) => a + b, 0);
    assert.strictEqual(totalVotes, 4, 'all four seats voted');
    const dud = await A.until((m) => m.type === 'room' && m.room.phase === 'draft' && m.room.match.topic.dud, 15000, 'dud round');
    assert.strictEqual(dud.room.match.topic.round, 3);
    const resA = await A.until((m) => m.type === 'result', 60000, 'crowd settlement');
    const resB = await B.until((m) => m.type === 'result', 3000, 'crowd settlement B');
    const end = A.msgs.filter((m) => m.type === 'room' && m.room.phase === 'match_end').pop();
    const m = end.room.match;
    assert.strictEqual(m.standings.length, 4);
    const cardsTotal = Object.values(m.cards).reduce((a, b) => a + b, 0);
    assert.ok(cardsTotal >= 3, 'every topic awarded at least one card');
    // lineups: 4 picks each in the last topic, 16 tiles → all taken
    assert.strictEqual(Object.keys(m.topic.taken).length, 16, 'board fully drafted');
    assert.ok(resA.ranked && resA.points > 0 && resB.points > 0, 'ranked points awarded');
    assert.strictEqual(resA.profile.matches, 1);
    assert.ok(resA.unlocked.includes('first_match'));
    console.log(`✓ crowd pleaser: ${m.topics || 3} topics, A place ${resA.place + 1} +${resA.points}, B place ${resB.place + 1} +${resB.points}`);

    /* ---------- crowd model learns from human votes ---------- */
    const pub = await A.until((m) => m.type === 'bank', 4000, 'ratings published');
    assert.notStrictEqual(pub.v, bank.body.v, 'human votes moved the crowd ranking');
    const bank2 = await http(port, '/api/bank');
    assert.notStrictEqual(bank2.body.v, bank.body.v, 'served bank carries the learned ranking');
    console.log(`✓ crowd ratings learned and republished (${bank.body.v} → ${pub.v})`);

    /* ---------- private Mind reader table ---------- */
    await A.until((m) => m.type === 'room_closed', 3000, 'public table closes after match');
    A.msgs = []; B.msgs = [];
    A.send({ type: 'create', mode: 'crowd' });
    const lobby = await A.until((m) => m.type === 'room' && m.room.code, 2000, 'private lobby');
    const code = lobby.room.code;
    A.send({ type: 'host', action: 'mode', arg: 'auction' });
    await A.until((m) => m.type === 'room' && m.room.mode === 'auction', 2000, 'auction mode accepted');
    A.send({ type: 'host', action: 'mode', arg: 'mind' });
    B.send({ type: 'join', code: code.toLowerCase() });
    await A.until((m) => m.type === 'room' && m.room.seats.length === 2 && m.room.mode === 'mind', 2000, 'B joined, mode mind');
    // topic picks: only the host chooses; bogus and duplicate ids are dropped; everyone sees them
    B.send({ type: 'host', action: 'topics', arg: ['rappers'] }); // not host: ignored
    await sleep(150);
    assert.deepStrictEqual(A.room.picks, [], 'non-host cannot pick topics');
    assert.strictEqual(A.room.maxPicks, 3, 'lobby says how many topics a match has');
    A.send({ type: 'host', action: 'topics', arg: ['rappers', 'nope', 'nba', 'rappers', 'anime', 'films'] });
    await A.until((m) => m.type === 'room' && m.room.picks && m.room.picks.length === 3, 2000, 'host picks topics');
    assert.deepStrictEqual(A.room.picks, ['rappers', 'nba', 'anime'], 'picks are valid, unique and capped at the match size');
    await B.until((m) => m.type === 'room' && m.room.picks && m.room.picks[0] === 'rappers', 2000, 'guest sees the picks');
    A.send({ type: 'host', action: 'topics', arg: ['rappers', 'nba'] });
    await A.until((m) => m.type === 'room' && m.room.picks && m.room.picks.length === 2, 2000, 'host trims a pick');
    B.send({ type: 'host', action: 'start' }); // not host: ignored
    A.send({ type: 'host', action: 'start' }); // only 2 seats: refused
    await sleep(150);
    assert.ok(!A.room.match, 'cannot start below 3 seats; non-host cannot start');
    A.send({ type: 'host', action: 'add_bot' });
    await A.until((m) => m.type === 'room' && m.room.seats.length === 3, 2000, 'bot added');
    A.send({ type: 'host', action: 'start' });
    const sec = await A.until((m) => m.type === 'room' && m.room.phase === 'secret', 3000, 'secret phase');
    const mindSid = sec.room.match.topic.mind;
    assert.strictEqual(sec.room.match.topic.id, 'rappers', 'first topic is the first pick');
    // secrecy: only the Mind ever sees the secret before the reveal
    await A.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.mindReady, 4000, 'secret set');
    for (const c of [A, B]) {
      const leaks = c.msgs.filter((x) => x.type === 'room' && x.room.match && x.room.match.topic && x.room.match.topic.secret && x.room.you !== x.room.match.topic.mind);
      assert.strictEqual(leaks.length, 0, 'secret never sent to non-Mind seats');
    }
    const rev = await A.until((m) => m.type === 'room' && m.room.phase === 'reveal', 10000, 'reveal');
    const T = rev.room.match.topic;
    const guessers = Object.keys(T.lineups).filter((s) => s !== mindSid);
    assert.ok(guessers.every((s) => T.lineups[s].length === 3), 'each guesser drafted 3');
    assert.strictEqual(T.lineups[mindSid].length, 0, 'Mind does not draft');
    const recomputed = Scoring.mindTopic({ loves: T.reveal.loves, dud: T.reveal.dud }, Object.fromEntries(guessers.map((s) => [s, T.lineups[s].map((x) => x.opt)])), mindSid);
    assert.deepStrictEqual(recomputed.points, T.reveal.points, 'reveal points match shared scoring');
    const mres = await A.until((m) => m.type === 'result', 40000, 'mind settlement');
    assert.strictEqual(mres.ranked, false, 'private tables are friendly (unranked)');
    assert.strictEqual(mres.points, 0);
    const second = A.msgs.find((m) => m.type === 'room' && m.room.match && m.room.match.t === 1);
    const third = A.msgs.find((m) => m.type === 'room' && m.room.match && m.room.match.t === 2);
    assert.strictEqual(second && second.room.match.topic.id, 'nba', 'second topic is the second pick');
    assert.ok(third && !['rappers', 'nba'].includes(third.room.match.topic.id), 'empty slot is filled with a different random topic');
    A.msgs = [];
    const back = await A.until((m) => m.type === 'room' && m.room.phase === 'lobby' && m.room.code === code && !m.room.match, 3000, 'private table returns to lobby');
    assert.strictEqual(back.room.seats.length, 3, 'same table, same seats');
    assert.deepStrictEqual(back.room.picks, [], 'picks reset for the next match');
    console.log(`✓ mind reader (private ${code}): reveal ${JSON.stringify(T.reveal.points)}, busted ${T.reveal.busted.length}`);
    A.send({ type: 'leave' }); B.send({ type: 'leave' });
    await sleep(100);

    /* ---------- rejoin after a dropped socket ---------- */
    A.msgs = [];
    A.auto = false;
    A.send({ type: 'quick', mode: 'crowd' });
    await A.until((m) => m.type === 'room' && m.room.match, 4000, 'rejoin test match');
    const sidBefore = A.room.you;
    const tokenA = A.token;
    A.close();
    await sleep(200);
    const A2 = new Client(port, 'Alice');
    await A2.connect(tokenA);
    const rj = await A2.until((m) => m.type === 'room' && m.room.match, 3000, 'seat restored');
    assert.strictEqual(rj.room.you, sidBefore, 'same seat after reconnect');
    assert.strictEqual(A2.profile.matches, 1, 'same account');
    console.log('✓ reconnect restores the seat mid-match');
    A2.send({ type: 'leave' });

    /* ---------- boards ---------- */
    A2.send({ type: 'board', category: 'points', window: 'all', scope: 'global' });
    const brd = await A2.until((m) => m.type === 'board', 2000, 'board');
    assert.ok(brd.entries.length >= 2 && brd.you && brd.you.rank >= 1);
    A2.send({ type: 'board', category: 'points', window: 'week', scope: 'PK' });
    const brd2 = await A2.until((m) => m.type === 'board' && m.scope === 'PK', 2000, 'country board');
    assert.ok(brd2.entries.every((e) => e.country === 'PK'));
    console.log(`✓ boards: global ${brd.entries.map((e) => e.name + ' ' + e.v).join(', ')}`);

    /* ---------- solo settlement (run graded server-side) ---------- */
    const bk = (await http(port, '/api/bank')).body;
    const rankOf = (id) => (bk.topics.find((t) => t.id === id) || {}).r || null;
    const log = [];
    bk.topics.slice(0, 5).forEach((t, i) => {
      const good = i < 3; // three perfect reads, then two misses → 1 life left
      const f = good ? t.r.slice(0, 3) : t.r.slice(13, 16);
      const d = good ? t.r[15] : t.r[0];
      log.push({ t: t.id, f, d, ms: 2500 });
    });
    const local = Scoring.soloRun(log, rankOf);
    const solo = await http(port, '/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: B.token, v: bk.v, log }) });
    assert.strictEqual(solo.status, 200, JSON.stringify(solo.body));
    assert.strictEqual(solo.body.total, local.total, 'server grade = browser grade');
    assert.strictEqual(solo.body.lives, 1);
    assert.strictEqual(solo.body.perfect, 3);
    assert.ok(solo.body.unlocked.includes('perfect_read'));
    const fast = await http(port, '/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: B.token, v: bk.v, log }) });
    assert.strictEqual(fast.status, 429, 'cannot replay a run instantly');
    const bad = await http(port, '/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: A.token, v: bk.v, log: [{ ...log[0], f: [1, 1, 2] }] }) });
    assert.strictEqual(bad.status, 400, 'duplicate picks rejected');
    const stale = await http(port, '/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: A.token, v: 'nope', log }) });
    assert.strictEqual(stale.status, 409);
    const noacc = await http(port, '/api/solo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'x'.repeat(30), v: bk.v, log }) });
    assert.strictEqual(noacc.status, 401);
    console.log(`✓ solo: ${local.total} pts graded identically on server, +${solo.body.points} ranked`);

    /* ---------- pick a category first: quick matches are keyed by it, tables are seeded with it ---------- */
    const C = new Client(port, 'Cyrus'), D = new Client(port, 'Dua'), E = new Client(port, 'Esa'), F = new Client(port, 'Fahad');
    await C.connect(); await D.connect(); await E.connect(); await F.connect();
    C.auto = D.auto = E.auto = F.auto = false;
    C.send({ type: 'quick', mode: 'crowd', topic: 'rappers' });
    const cRoom = await C.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'C lobby');
    assert.strictEqual(cRoom.room.picks[0], 'rappers', 'public lobby leads with the chosen category');
    assert.strictEqual(cRoom.room.picks.length, 3, 'public lobby shows the whole topic list up front');
    D.send({ type: 'quick', mode: 'crowd', topic: 'rappers' });
    await D.until((m) => m.type === 'room' && m.room.id === cRoom.room.id, 2000, 'same category, same table');
    E.send({ type: 'quick', mode: 'crowd', topic: 'anime' });
    const eRoom = await E.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'E lobby');
    assert.notStrictEqual(eRoom.room.id, cRoom.room.id, 'a different category gets a different table');
    assert.strictEqual(eRoom.room.picks[0], 'anime');
    F.send({ type: 'quick', mode: 'crowd', topic: 'not-a-topic' });
    const fRoom = await F.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'F lobby');
    assert.ok(fRoom.room.picks.length === 3 && !fRoom.room.picks.includes('not-a-topic'), 'unknown category falls back to random topics');
    const cStart = await C.until((m) => m.type === 'room' && m.room.match, 4000, 'category match starts');
    assert.strictEqual(cStart.room.match.topic.id, 'rappers', 'first topic played is the chosen category');
    for (const c of [C, D, E, F]) c.send({ type: 'leave' });
    await sleep(100);
    C.msgs = [];
    C.send({ type: 'create', mode: 'mind', topic: 'nba' });
    const cPriv = await C.until((m) => m.type === 'room' && m.room.code, 2000, 'private table from a category');
    assert.deepStrictEqual(cPriv.room.picks, ['nba'], 'private lobby opens with the category in slot 1');
    assert.strictEqual(cPriv.room.mode, 'mind');
    C.send({ type: 'leave' });
    await sleep(50);
    C.send({ type: 'create', mode: 'auction' });
    await C.until((m) => m.type === 'room' && m.room.code && m.room.mode === 'auction', 2000, 'auction table created');
    C.send({ type: 'leave' });
    await sleep(50);
    console.log('✓ category first: quick match keyed by topic, tables seeded with it');

    /* ---------- pick all three: a topic list is honoured in order, shared by a matching list, joined by a matching first topic ---------- */
    const P = new Client(port, 'Parisa'), Q = new Client(port, 'Qasim'), R2 = new Client(port, 'Rida');
    await P.connect(); await Q.connect(); await R2.connect();
    P.auto = Q.auto = R2.auto = false;
    const welcomeP = P.msgs.find((m) => m.type === 'welcome');
    assert.strictEqual(welcomeP.topicsPerMatch, 3, 'welcome tells the browser how many topics a match has');
    P.send({ type: 'quick', mode: 'crowd', topics: ['rappers', 'nope', 'nba', 'anime', 'films'] });
    const pRoom = await P.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'P lobby');
    assert.deepStrictEqual(pRoom.room.picks, ['rappers', 'nba', 'anime'], 'all three picks are kept, in order, bogus dropped, extras cut');
    Q.send({ type: 'quick', mode: 'crowd', topics: ['rappers', 'nba', 'anime'] });
    await Q.until((m) => m.type === 'room' && m.room.id === pRoom.room.id, 2000, 'same list, same table');
    R2.send({ type: 'quick', mode: 'crowd', topics: ['rappers'] });
    await R2.until((m) => m.type === 'room' && m.room.id === pRoom.room.id, 2000, 'same first topic joins that table too');
    const pStart = await P.until((m) => m.type === 'room' && m.room.match, 5000, 'three-pick match starts');
    assert.strictEqual(pStart.room.match.topic.id, 'rappers', 'opens on the first pick');
    for (const c of [P, Q, R2]) c.send({ type: 'leave' });
    await sleep(100);
    P.msgs = [];
    P.send({ type: 'create', mode: 'auction', topics: ['candy', 'cars'] });
    const pPriv = await P.until((m) => m.type === 'room' && m.room.code, 2000, 'private table from a list');
    assert.deepStrictEqual(pPriv.room.picks, ['candy', 'cars'], 'private lobby opens with the list in slots 1 and 2');
    P.send({ type: 'leave' }); await sleep(50);
    console.log('✓ pick all three: topic lists honoured for quick matches and tables');

    /* ---------- culture: desi / global / mix pools for random topics, matchmaking and picks ---------- */
    const bankC = (await http(port, '/api/bank')).body;
    const cultureOf = Object.fromEntries(bankC.topics.map((t) => [t.id, t.c]));
    assert.ok(bankC.topics.every((t) => CULTURES.includes(t.c)), 'bank carries culture tags');
    const S1 = new Client(port, 'Sana'), S2 = new Client(port, 'Sami'), S3 = new Client(port, 'Sara');
    await S1.connect(); await S2.connect(); await S3.connect();
    S1.auto = S2.auto = S3.auto = false;
    S1.send({ type: 'quick', mode: 'crowd', culture: 'desi' });
    const dRoom = await S1.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'desi lobby');
    assert.strictEqual(dRoom.room.culture, 'desi', 'lobby knows its culture');
    assert.ok(dRoom.room.picks.length === 3 && dRoom.room.picks.every((id) => 'dn'.includes(cultureOf[id])), 'a desi table draws only desi or neutral packs: ' + dRoom.room.picks.map((id) => cultureOf[id]).join(''));
    S2.send({ type: 'quick', mode: 'crowd', culture: 'global' });
    const gRoom = await S2.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'global lobby');
    assert.notStrictEqual(gRoom.room.id, dRoom.room.id, 'a global player does not land at a desi table');
    assert.ok(gRoom.room.picks.every((id) => 'gn'.includes(cultureOf[id])), 'a global table draws only global or neutral packs');
    S3.send({ type: 'quick', mode: 'crowd', culture: 'mix' });
    await S3.until((m) => m.type === 'room' && (m.room.id === dRoom.room.id || m.room.id === gRoom.room.id), 2000, 'a mix player takes any open seat');
    for (const c of [S1, S2, S3]) c.send({ type: 'leave' });
    await sleep(100);
    S1.msgs = [];
    S1.send({ type: 'create', mode: 'crowd', culture: 'desi', topics: ['cricketers', 'nba'] });
    const dPriv = await S1.until((m) => m.type === 'room' && m.room.code, 2000, 'desi private table');
    assert.deepStrictEqual(dPriv.room.picks, ['cricketers'], 'picks outside the culture are dropped');
    S1.send({ type: 'host', action: 'topics', arg: ['nba', 'weather'] });
    await S1.until((m) => m.type === 'room' && m.room.picks.length === 1 && m.room.picks[0] === 'weather', 2000, 'host picks are filtered by culture too');
    S1.send({ type: 'host', action: 'culture', arg: 'mix' });
    await S1.until((m) => m.type === 'room' && m.room.culture === 'mix', 2000, 'host can switch the culture');
    S1.send({ type: 'leave' }); await sleep(50);
    console.log('✓ culture: desi/global/mix pools drive random fills, matchmaking and picks');

    /* ---------- match length: 1, 2 or 3 topics, chosen by the player, matched on, ended on ---------- */
    const L1 = new Client(port, 'Laila'), L2 = new Client(port, 'Luqman');
    await L1.connect(); await L2.connect();
    L1.auto = true; L2.auto = false;
    L1.send({ type: 'quick', mode: 'crowd', rounds: 1, topics: ['candy'] });
    const oneRoom = await L1.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'one-topic lobby');
    assert.strictEqual(oneRoom.room.maxPicks, 1, 'lobby shows one topic slot');
    assert.deepStrictEqual(oneRoom.room.picks, ['candy'], 'and the one pick fills it');
    L2.send({ type: 'quick', mode: 'crowd', rounds: 2 });
    const twoRoom = await L2.until((m) => m.type === 'room' && m.room.state === 'lobby', 2000, 'two-topic lobby');
    assert.notStrictEqual(twoRoom.room.id, oneRoom.room.id, 'a two-topic player does not join a one-topic table');
    assert.strictEqual(twoRoom.room.picks.length, 2, 'a two-topic public table draws two');
    const oneEnd = await L1.until((m) => m.type === 'room' && m.room.phase === 'match_end', 30000, 'one-topic match ends');
    assert.strictEqual(oneEnd.room.match.total, 1, 'the match was one topic long');
    L2.send({ type: 'leave' }); await sleep(100); L1.msgs = [];
    L1.send({ type: 'create', mode: 'crowd', rounds: 2, topics: ['candy', 'cars', 'anime'] });
    const twoPriv = await L1.until((m) => m.type === 'room' && m.room.code, 3000, 'two-topic private table');
    assert.deepStrictEqual([twoPriv.room.maxPicks, twoPriv.room.picks], [2, ['candy', 'cars']], 'a shorter table keeps only as many picks as it plays');
    L1.send({ type: 'host', action: 'rounds', arg: 3 });
    await L1.until((m) => m.type === 'room' && m.room.maxPicks === 3, 2000, 'host can lengthen the match');
    L1.send({ type: 'host', action: 'rounds', arg: 9 });
    await sleep(100);
    assert.strictEqual(L1.room.maxPicks, 3, 'length is capped at the server maximum');
    L1.send({ type: 'leave' }); await sleep(50);
    console.log('✓ match length: 1, 2 or 3 topics');
    L1.close(); L2.close();
    S1.close(); S2.close(); S3.close();
    P.close(); Q.close(); R2.close();
    C.close(); D.close(); E.close(); F.close();

    /* ---------- auction table: lots, bids, sales ---------- */
    const G = new Client(port, 'Gul'), H = new Client(port, 'Hira'), I = new Client(port, 'Imran');
    await G.connect(); await H.connect(); await I.connect();
    G.auto = H.auto = I.auto = false;
    G.send({ type: 'create', mode: 'auction', topic: 'comfort' });
    const gl = await G.until((m) => m.type === 'room' && m.room.code, 2000, 'auction lobby');
    H.send({ type: 'join', code: gl.room.code }); I.send({ type: 'join', code: gl.room.code });
    await G.until((m) => m.type === 'room' && m.room.seats.length === 3, 2000, 'H and I joined');
    const gSid = G.room.you, hSid = H.room.you;
    G.send({ type: 'host', action: 'start' });
    const lot0 = await G.until((m) => m.type === 'room' && m.room.phase === 'bid', 3000, 'first lot opens');
    const T0 = lot0.room.match.topic;
    assert.strictEqual(T0.id, 'comfort', 'auction opens on the chosen category');
    assert.strictEqual(T0.lot.i, 0); assert.strictEqual(T0.lot.opt, T0.layout[0], 'lots follow the shuffled layout');
    assert.ok(T0.layout.length === 16 && T0.layout.slice(1).every((o) => o === -1), 'lots that have not opened yet are face-down in the snapshot');
    assert.deepStrictEqual(Object.values(T0.purses), [20, 20, 20], 'everyone starts with 20 coins');
    assert.strictEqual(T0.lineupSize, 4, 'four cards each at three seats');
    G.send({ type: 'bid', amount: 0 }); G.send({ type: 'bid', amount: '5' }); G.send({ type: 'bid', amount: 2.5 });
    await sleep(60);
    assert.strictEqual(G.room.match.topic.lot.top, null, 'zero, string and fractional bids are refused');
    H.send({ type: 'bid', amount: 3 });
    await G.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.lot && m.room.match.topic.lot.top && m.room.match.topic.lot.top.sid === hSid && m.room.match.topic.lot.top.amount === 3, 2000, 'H leads at 3');
    G.send({ type: 'bid', amount: 2 }); G.send({ type: 'bid', amount: 25 }); H.send({ type: 'bid', amount: 4 });
    await sleep(60);
    assert.strictEqual(G.room.match.topic.lot.top.amount, 3, 'under-bid, over-purse and self-raise are refused');
    G.send({ type: 'bid', amount: 4 });
    const sold = await G.until((m) => m.type === 'room' && m.room.phase === 'sold' && m.room.match.topic.sold.length === 1, 3000, 'first lot sold');
    const Ts = sold.room.match.topic, s0 = Ts.sold[0];
    assert.deepStrictEqual(s0, { opt: T0.lot.opt, sid: gSid, price: 4 }, 'the top bid takes the card at its price');
    assert.strictEqual(Ts.purses[gSid], 16, 'buyer pays');
    assert.deepStrictEqual(Ts.lineups[gSid], [{ opt: s0.opt, price: 4, kind: 'bid' }], 'card lands in the lineup with its price');
    assert.strictEqual(Ts.taken[s0.opt], gSid, 'sold tile is marked on the board');
    G.send({ type: 'bid', amount: 9 }); // between lots: ignored
    const lot1 = await G.until((m) => m.type === 'room' && m.room.phase === 'bid' && m.room.match.topic.lot && m.room.match.topic.lot.i === 1, 3000, 'second lot opens');
    assert.strictEqual(lot1.room.match.topic.lot.top, null, 'a bid sent between lots never lands on the next lot');
    assert.ok(lot1.room.match.topic.layout[1] >= 0 && lot1.room.match.topic.layout.slice(2).every((o) => o === -1), 'opening a lot reveals it and nothing beyond it');
    assert.strictEqual(lot1.room.match.topic.purses[gSid], 16, 'nor does it charge anyone');
    console.log('✓ auction: lots open in order, bids validated, sale lands with its price');

    G.send({ type: 'bid', amount: 2, lot: 0 }); // names the lot that just closed
    await sleep(60);
    assert.strictEqual(G.room.match.topic.lot.top, null, 'a bid naming a stale lot is refused');
    G.send({ type: 'bid', amount: 2, lot: 1 });
    await G.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.lot && m.room.match.topic.lot.i === 1 && m.room.match.topic.lot.top && m.room.match.topic.lot.top.sid === gSid && m.room.match.topic.lot.top.amount === 2, 2000, 'a bid naming the current lot is accepted');

    /* ---------- auction: a leader who drops still buys; leftovers, reveal, scoring ---------- */
    H.send({ type: 'bid', amount: 3 });
    await G.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.lot && m.room.match.topic.lot.i === 1 && m.room.match.topic.lot.top && m.room.match.topic.lot.top.sid === hSid, 2000, 'H leads lot 2');
    H.close(); // socket drops while leading
    const sold2 = await G.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.sold.length === 2, 4000, 'second lot sold');
    assert.deepStrictEqual(sold2.room.match.topic.sold[1], { opt: sold2.room.match.topic.layout[1], sid: hSid, price: 3 }, 'a leader who drops still buys the card');
    const rv = await G.until((m) => m.type === 'room' && m.room.phase === 'reveal', 20000, 'auction reveal');
    const Tr = rv.room.match.topic;
    assert.ok(rv.room.seats.find((x) => x.sid === hSid).away, 'dropped seat is away, match went on');
    for (const sid of Object.keys(Tr.lineups)) {
      assert.strictEqual(Tr.lineups[sid].length, Tr.lineupSize, 'every lineup is full at the reveal');
      assert.ok(Tr.purses[sid] >= 0 && Tr.lineups[sid].reduce((a, c) => a + c.price, 0) <= 20, 'nobody overspends');
    }
    assert.strictEqual(Tr.lineups[gSid].filter((c) => c.kind === 'free').length, 3, 'empty slots are filled with free leftovers');
    assert.strictEqual(Tr.sold.length + Tr.unsold.length + Object.values(Tr.lineups).flat().filter((c) => c.kind === 'free').length, 16, 'sold + free + still unsold = the board');
    const ladder = Object.values(Tr.reveal.values).sort((a, b) => b - a);
    assert.deepStrictEqual(ladder, Array.from({ length: 16 }, (_, i) => 160 - i * 10), 'card values run 160 down to 10 by crowd rank');
    for (const sid of Object.keys(Tr.lineups)) {
      const expect = Tr.lineups[sid].reduce((a, c) => a + Tr.reveal.values[c.opt], 0) + Tr.purses[sid] * 5;
      assert.strictEqual(Tr.reveal.points[sid], expect, 'reveal points = card values + 5 per coin left');
      assert.strictEqual(Tr.tscore[sid], expect, 'topic score is the reveal score');
    }
    console.log(`✓ auction: leftovers, reveal ${JSON.stringify(Tr.reveal.points)}`);
    for (const c of [G, I]) c.send({ type: 'leave' });
    await sleep(100);
    G.close(); I.close();

    /* ---------- auction: when nobody can bid any more, the rest of the deck passes at once ---------- */
    const K = new Client(port, 'Kiran'), L = new Client(port, 'Laiba'), M = new Client(port, 'Moiz');
    await K.connect(); await L.connect(); await M.connect();
    K.auto = L.auto = M.auto = false;
    K.send({ type: 'create', mode: 'auction' });
    const kl = await K.until((m) => m.type === 'room' && m.room.code, 2000, 'dead-lot lobby');
    L.send({ type: 'join', code: kl.room.code }); M.send({ type: 'join', code: kl.room.code });
    await K.until((m) => m.type === 'room' && m.room.seats.length === 3, 2000, 'L and M joined');
    K.send({ type: 'host', action: 'start' });
    await K.until((m) => m.type === 'room' && m.room.phase === 'bid', 3000, 'dead-lot first lot');
    K.send({ type: 'bid', amount: 20 }); // all in: K is broke after this
    await K.until((m) => m.type === 'room' && m.room.match && m.room.match.topic.sold.length === 1, 3000, 'K buys the first card');
    L.close(); M.close(); // the only seats with coins are gone
    const tDead = Date.now();
    const rvDead = await K.until((m) => m.type === 'room' && m.room.phase === 'reveal', 8000, 'dead-lot reveal');
    assert.ok(Date.now() - tDead < 3000, `remaining lots pass at once when nobody can bid (took ${Date.now() - tDead} ms)`);
    assert.strictEqual(rvDead.room.match.topic.unsold.length + Object.values(rvDead.room.match.topic.lineups).flat().filter((c) => c.kind === 'free').length, 15, 'the other fifteen cards passed and filled lineups for free');
    console.log('✓ auction: unbiddable lots pass immediately');
    K.send({ type: 'leave' }); await sleep(50); K.close();

    /* ---------- auction at six seats: lineups of 2, bots buy, 4 cards stay on the board ---------- */
    const J = new Client(port, 'Jawad'); await J.connect(); J.auto = false;
    J.send({ type: 'create', mode: 'auction', topic: 'rappers' });
    await J.until((m) => m.type === 'room' && m.room.code, 2000, 'six-seat lobby');
    for (let k = 0; k < 5; k++) J.send({ type: 'host', action: 'add_bot' });
    await J.until((m) => m.type === 'room' && m.room.seats.length === 6, 2000, 'five bots added');
    J.send({ type: 'host', action: 'start' });
    const rv6 = await J.until((m) => m.type === 'room' && m.room.phase === 'reveal', 45000, 'six-seat reveal');
    const T6 = rv6.room.match.topic;
    assert.strictEqual(T6.lineupSize, 2, 'two cards each at six seats');
    assert.ok(Object.values(T6.lineups).every((l) => l.length === 2), 'all six lineups full');
    assert.strictEqual(Object.keys(T6.taken).length, 12, 'twelve cards owned, four stay on the board');
    assert.ok(T6.sold.some((x) => rv6.room.seats.find((s) => s.sid === x.sid).bot), 'bots bought at least one card');
    console.log(`✓ auction: six seats, ${T6.sold.length} sold, bots bidding`);
    J.send({ type: 'leave' }); await sleep(50); J.close();

    B.close(); A2.close();
  } catch (e) {
    failed = true;
    console.error('✗', e.message);
    if (e.stack) console.error(e.stack.split('\n').slice(1, 4).join('\n'));
  } finally {
    srv.kill('SIGTERM');
  }
  console.log(failed ? '\nFAILED' : '\nAll server tests passed');
  process.exit(failed ? 1 : 0);
})();
