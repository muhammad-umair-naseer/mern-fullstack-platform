'use strict';
/* End-to-end game test against an in-process server: matchmaking, bots,
   rounds, grading, lifelines, rush mode, rankings, friendlies. Run via npm test
   (which sets short timers). */
process.env.PORT = '0';
process.env.DATA_FILE ||= '/tmp/gotcha-test/game.json';
// start from a clean slate: accounts left by a previous run would outrank this run's players
if (process.env.DATA_FILE.startsWith('/tmp/gotcha-test/')) require('fs').rmSync(process.env.DATA_FILE, { force: true });
const assert = require('assert');
const WebSocket = require('ws');
const { server, accounts } = require('../server/index.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

class C {
  constructor(url, name, country, creds = {}) {
    this.ws = new WebSocket(url); this.name = name; this.msgs = []; this.room = null; this.reveals = []; this.result = null; this.board = null; this.lifeline = null; this.account = null;
    this.ready = new Promise((res) => this.ws.on('open', res));
    this.ws.on('message', (raw) => {
      const m = JSON.parse(raw); this.msgs.push(m);
      if (m.type === 'welcome') { this.id = m.id; this.welcome = m; }
      if (m.type === 'account') this.account = m;
      if (m.type === 'room') this.room = m;
      if (m.type === 'reveal') this.reveals.push(m);
      if (m.type === 'game_result') this.result = m;
      if (m.type === 'board') this.board = m;
      if (m.type === 'lifeline') this.lifeline = m;
      if (m.type === 'error') this.error = m;
    });
    this.ready.then(() => this.send({ type: 'hello', name, country, avatar: 'fox', ...creds }));
  }
  send(o) { this.ws.send(JSON.stringify(o)); }
  async until(p, t = 30000, label = '?') { const t0 = Date.now(); while (Date.now() - t0 < t) { if (p(this)) return; await wait(20); } throw new Error(`timeout: ${label} (${this.name})`); }
  close() { this.ws.close(); }
}

/** Answer the current round with the real output (cheating via the bank, but the test needs a known-correct answer). */
function correctAnswer(bank, room) { return bank.byId.get(room.puzzleId).output; }

(async () => {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const url = `ws://localhost:${server.address().port}`;
  const { bank } = require('../server/index.js');
  assert.ok(bank.size >= 60, 'bank loaded');
  console.log(`✓ bank: ${bank.size} verified puzzles`);

  // ---------------- public match ----------------
  const a = new C(url, 'Umair', 'PK');
  const b = new C(url, 'Sara', 'PK');
  await Promise.all([a.ready, b.ready]);
  await a.until((c) => c.account && c.welcome, 4000, 'account');
  const creds = { accountId: a.account.id, token: a.account.token };
  assert.ok(a.welcome.achievements.length > 10 && a.welcome.boards.categories.length >= 6, 'welcome carries catalogue + board meta');
  a.send({ type: 'quick', lang: 'mix' }); b.send({ type: 'quick', lang: 'mix' });
  await a.until((c) => c.room && c.room.state === 'waiting', 4000, 'in lobby');
  await b.until((c) => c.room && c.room.code === a.room.code, 4000, 'same lobby');
  console.log('✓ quick match paired both players in', a.room.code);
  await a.until((c) => c.room.state === 'round', 15000, 'round 1');
  assert.ok(a.room.players.filter((p) => p.isBot).length >= 2, 'bots filled the lobby');
  assert.ok(a.room.puzzleId && a.room.lines >= 1 && !a.room.puzzle, 'round carries a puzzle id and line count only');
  assert.strictEqual(a.room.ranked, true, 'public match is ranked');
  { const pz = bank.byId.get(a.room.puzzleId); console.log(`✓ round 1: ${pz.lang} "${pz.title}" d${pz.difficulty}, ${a.room.lines} line(s) — id on the wire, code from the client bank`); }

  // round 1: A correct fast, B uses lifeline then answers wrong
  const r1 = a.room.roundNo;
  a.send({ type: 'answer', lines: correctAnswer(bank, a.room) });
  b.send({ type: 'lifeline' });
  await b.until((c) => c.lifeline, 3000, 'lifeline choices');
  assert.ok(b.lifeline.choices.length >= 3 && b.lifeline.choices.includes(correctAnswer(bank, a.room).join('\n')), 'choices contain the answer');
  const wrong = b.lifeline.choices.find((c) => c !== correctAnswer(bank, a.room).join('\n'));
  b.send({ type: 'answer', lines: wrong.split('\n') });
  await a.until((c) => c.reveals.length >= 1, 15000, 'reveal 1');
  const rev = a.reveals[0];
  assert.strictEqual(rev.roundNo, r1);
  const ra = rev.results.find((r) => r.id === a.id);
  const rb = rev.results.find((r) => r.id === b.id);
  assert.ok(ra.correct && ra.points > 0 && ra.combo === 1, 'A graded correct with points');
  assert.strictEqual(rev.firstCorrectId, a.id, 'A was first correct');
  assert.ok(ra.bonus.first > 0 && ra.bonus.speed > 0, 'first + speed bonuses applied');
  assert.ok(!rb.correct && rb.lifeline, 'B graded wrong with lifeline flagged');
  assert.ok(rev.output.length && rev.explain.length > 20, 'reveal carries output + explanation');
  console.log(`✓ reveal 1: A +${ra.points} (speed ${ra.bonus.speed}, first ${ra.bonus.first}), B +${rb.points}, standings ${rev.standings.map((s) => s.name + ':' + s.score).join(' ')}`);

  // remaining rounds: A answers correctly each time (combo builds), B times out
  let lastRound = r1;
  for (let i = 0; i < 2; i++) {
    await a.until((c) => c.room.state === 'round' && c.room.roundNo > lastRound, 20000, `round ${lastRound + 1}`);
    lastRound = a.room.roundNo;
    a.send({ type: 'answer', lines: correctAnswer(bank, a.room) });
    await a.until((c) => c.reveals.length >= lastRound, 20000, `reveal ${lastRound}`);
  }
  const rev3 = a.reveals[2];
  const ra3 = rev3.results.find((r) => r.id === a.id);
  assert.strictEqual(ra3.combo, 3, 'combo climbs to 3');
  assert.ok(ra3.bonus.combo > 1, 'combo multiplier applied');
  assert.ok(rev3.last, 'third reveal is flagged last');
  await a.until((c) => c.room.state === 'finished' && c.result, 15000, 'match finished + settled');
  assert.strictEqual(a.room.results[0].id, a.id, 'A wins the match');
  assert.ok(a.result.ranked && a.result.points > 0 && a.result.perfect, 'ranked points, perfect match');
  assert.ok(a.result.unlocked.includes('first_match') && a.result.unlocked.includes('perfect'), 'achievements unlocked');
  assert.strictEqual(a.result.streak, 1, 'streak started');
  assert.ok(a.result.profile.rivals.some((r) => r.name === 'Sara'), 'head-to-head recorded');
  assert.ok(a.result.standings.find((s) => s.category === 'points').rank === 1, 'world #1 after one match');
  console.log(`✓ finished: A won with ${a.room.results[0].score}, +${a.result.points} ranked pts, achievements ${a.result.unlocked.join(',')}`);

  // ---------------- boards ----------------
  a.send({ type: 'board', category: 'points', window: 'today', scope: 'global' });
  await a.until((c) => c.board && c.board.window === 'today', 4000, 'today board');
  assert.strictEqual(a.board.entries[0].name, 'Umair');
  a.board = null;
  a.send({ type: 'board', category: 'combo', window: 'all', scope: 'PK' });
  await a.until((c) => c.board && c.board.category === 'combo', 4000, 'combo board');
  assert.ok(a.board.entries.every((e) => e.country === 'PK') && a.board.me.value === 3, 'country combo board has my combo');
  console.log('✓ boards: today/points and PK/combo respond with my row');

  a.send({ type: 'leave' }); b.send({ type: 'leave' });
  await wait(300);

  // ---------------- client-side bank + solo rush verified over HTTP ----------------
  const http = require('http');
  const port = server.address().port;
  const get = (path, headers = {}) => new Promise((resolve, reject) => {
    http.get({ port, path, headers }, (res) => { let raw = ''; res.on('data', (d) => { raw += d; }); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: raw })); }).on('error', reject);
  });
  const post = (path, obj) => new Promise((resolve, reject) => {
    const body = JSON.stringify(obj);
    const req = http.request({ port, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => { let raw = ''; res.on('data', (d) => { raw += d; }); res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(raw) })); });
    req.on('error', reject); req.end(body);
  });
  const bankRes = await get('/api/bank');
  const pub = JSON.parse(bankRes.body);
  assert.strictEqual(pub.puzzles.length, bank.size, 'bank endpoint serves every puzzle');
  assert.ok(pub.puzzles.every((p) => p.code && p.lines >= 1 && p.output === undefined && p.explain === undefined), 'public bank carries no answers');
  assert.ok(bankRes.headers.etag && /max-age=/.test(bankRes.headers['cache-control']), 'bank is cacheable');
  const again = await get('/api/bank', { 'if-none-match': bankRes.headers.etag });
  assert.strictEqual(again.status, 304, 'ETag revalidation returns 304');
  const gz = await get('/js/main.js', { 'accept-encoding': 'gzip' });
  assert.strictEqual(gz.headers['content-encoding'], 'gzip', 'static assets served gzipped from memory');
  const scoringJs = await get('/shared/scoring.js');
  assert.ok(scoringJs.status === 200 && scoringJs.body.includes('GotchaScoring'), 'shared scoring served to the browser');
  console.log(`✓ client bank: ${pub.puzzles.length} puzzles, ${(bankRes.body.length / 1024).toFixed(0)} KB, ETag 304s, gzip on`);

  // an honest run: 2 right, 3 wrong -> 3 lives gone after 5 rounds
  const Scoring = require('../shared/scoring');
  const ids = pub.puzzles.filter((p) => p.lang === 'py').slice(0, 5).map((p) => p.id);
  const log = ids.map((id, i) => ({ id, lines: i < 2 ? bank.byId.get(id).output : ['wrong'], ms: 2500 + i * 300, lifeline: false }));
  const rushRes = await post('/api/rush', { ...creds, lang: 'py', log, clientScore: 0 });
  assert.strictEqual(rushRes.status, 200, 'rush accepted');
  const rr = rushRes.json;
  assert.strictEqual(rr.mode, 'rush');
  assert.strictEqual(rr.rounds, 5, 'five rounds scored');
  assert.strictEqual(rr.correct, 2);
  assert.ok(rr.score > 0 && rr.points > 0 && rr.profile.bestRush === rr.score && rr.profile.rushRuns === 1, 'rush stored on the account');
  const expected1 = Scoring.roundPoints({ difficulty: bank.byId.get(ids[0]).difficulty, full: true, correctLines: 1, totalLines: 1, answered: true, msLeft: Scoring.rushRoundMs(1) - 2500, roundMs: Scoring.rushRoundMs(1), comboBefore: 0, first: true, lifeline: false }).points;
  assert.ok(rr.score >= expected1, 'shared scoring rules applied');
  console.log(`✓ rush verified over HTTP: score ${rr.score}, +${rr.points} pts, best rush ${rr.profile.bestRush}`);

  // a cheating run: a 300 ms answer is cut off, later rounds ignored
  const cheat = await post('/api/rush', { ...creds, lang: 'py', log: [{ id: ids[0], lines: bank.byId.get(ids[0]).output, ms: 300 }, { id: ids[1], lines: bank.byId.get(ids[1]).output, ms: 3000 }] });
  assert.strictEqual(cheat.status, 400, 'impossible timing yields nothing to score');
  const cheat2 = await post('/api/rush', { ...creds, lang: 'py', log: [{ id: ids[3], lines: bank.byId.get(ids[3]).output, ms: 3000 }, { id: ids[3], lines: bank.byId.get(ids[3]).output, ms: 3000 }] });
  assert.strictEqual(cheat2.json.rounds, 1, 'repeated puzzle cut off after the first');
  assert.ok(cheat2.json.flags.includes('repeated puzzle'));
  const anon = await post('/api/rush', { lang: 'py', log });
  assert.strictEqual(anon.status, 401, 'unknown account rejected');
  console.log('✓ rush verification rejects impossible timing, repeats and unknown accounts');

  // the socket state is slim: puzzle ids only
  assert.ok(a.room && !('puzzle' in a.room) && a.msgs.some((m) => m.type === 'room' && typeof m.puzzleId === 'string'), 'room state carries puzzle ids, not source');

  // ---------------- private friendly ----------------
  const pointsBefore = accounts.accounts[creds.accountId].points;
  a.reveals = []; a.result = null; b.result = null;
  a.send({ type: 'create', lang: 'js', rounds: 3 });
  await a.until((c) => c.room && c.room.isPrivate && c.room.mode === 'match', 4000, 'private room');
  assert.strictEqual(a.room.ranked, false, 'private rooms are friendlies');
  b.send({ type: 'join', code: a.room.code });
  await b.until((c) => c.room && c.room.code === a.room.code, 4000, 'friend joined');
  b.send({ type: 'start', bots: false });
  await wait(400);
  assert.notStrictEqual(a.room.state, 'starting', 'only the host can start');
  a.send({ type: 'start', bots: false });
  await a.until((c) => c.room.state === 'round', 10000, 'friendly round 1');
  assert.strictEqual(a.room.players.length, 2, 'no bots when asked');
  for (let i = 1; i <= 3; i++) {
    await a.until((c) => c.room.state === 'round' && c.room.roundNo === i, 20000, `friendly round ${i}`);
    a.send({ type: 'answer', lines: correctAnswer(bank, a.room) });
    b.send({ type: 'answer', lines: ['nope'] });
    await a.until((c) => c.reveals.length === i, 20000, `friendly reveal ${i}`);
  }
  await a.until((c) => c.room.state === 'finished' && c.result, 15000, 'friendly settled');
  assert.strictEqual(a.result.ranked, false);
  assert.strictEqual(a.result.points, 0, 'no ranked points from a friendly');
  assert.strictEqual(accounts.accounts[creds.accountId].points, pointsBefore, 'global points untouched');
  assert.ok(a.result.series.find((s) => s.id === a.id).wins === 1, 'series tracked');
  assert.ok(a.result.profile.friendlies === 1, 'friendly counted');
  console.log('✓ friendly: unranked, series 1-0, streak alive');

  // ---------------- reconnect keeps identity ----------------
  a.close(); b.close();
  await wait(200);
  const back = new C(url, 'Umair', 'PK', creds);
  await back.until((c) => c.account, 4000, 're-login');
  assert.strictEqual(back.account.created, false);
  assert.strictEqual(back.account.profile.points, pointsBefore);
  console.log(`✓ reconnect resumed account: ${back.account.profile.points} pts, ${back.account.profile.correct} solved, accuracy ${back.account.profile.accuracy}%, best rush ${back.account.profile.bestRush}`);

  // ---------------- unknown room ----------------
  back.send({ type: 'join', code: 'ZZZZZ' });
  await back.until((c) => c.error, 3000, 'error');
  console.log('✓ unknown room rejected:', back.error.message);
  back.close();
  await wait(150);
  console.log('\nALL GAME TESTS PASSED');
  process.exit(0);
})().catch((e) => { console.error('\nTEST FAILED:', e); process.exit(1); });
