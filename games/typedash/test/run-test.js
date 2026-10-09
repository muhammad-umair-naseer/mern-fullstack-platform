'use strict';
/**
 * End-to-end protocol test. Boots the server on a random port, drives real
 * WebSocket clients through public matchmaking, a full race, private rooms,
 * join-by-code, chat and the anti-cheat ceiling.
 *
 * Run with shortened timers:
 *   LOBBY_WAIT_MS=1500 COUNTDOWN_MS=1200 RESULTS_MS=1500 node test/run-test.js
 */
process.env.PORT = process.env.PORT || '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/race.json';
const assert = require('assert');
const WebSocket = require('ws');
const { server, accounts } = require('../server/index.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

class Client {
  constructor(url, name, country = 'PK') {
    this.ws = new WebSocket(url);
    this.name = name;
    this.msgs = [];
    this.room = null;
    this.snaps = 0;
    this.finished = [];
    this.chats = [];
    this.errors = [];
    this.ready = new Promise((res) => this.ws.on('open', res));
    this.ws.on('message', (raw) => {
      const m = JSON.parse(raw);
      this.msgs.push(m);
      if (m.type === 'welcome') this.id = m.id;
      if (m.type === 'account') this.accountId = m.id;
      if (m.type === 'room') this.room = m;
      if (m.type === 'snap') this.snaps++;
      if (m.type === 'finished') this.finished.push(m);
      if (m.type === 'chat') this.chats.push(m);
      if (m.type === 'error') this.errors.push(m);
    });
    this.ready.then(() => this.send({ type: 'hello', name, country }));
  }
  send(o) { this.ws.send(JSON.stringify(o)); }
  async until(pred, timeout = 15000, label = 'condition') {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      if (pred(this)) return;
      await wait(25);
    }
    throw new Error(`Timed out waiting for ${label} (${this.name})`);
  }
  close() { this.ws.close(); }
}

(async () => {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const url = `ws://localhost:${server.address().port}`;
  console.log(`server on ${url}`);

  /* ---------------- public quick match + full race ---------------- */
  const a = new Client(url, 'Alice', 'PK');
  const b = new Client(url, 'Bob', 'SA');
  await Promise.all([a.ready, b.ready]);
  a.send({ type: 'quick' });
  await a.until((c) => c.room && c.room.state === 'waiting', 5000, 'Alice in lobby');
  b.send({ type: 'quick' });
  await b.until((c) => c.room && c.room.code === a.room.code, 5000, 'Bob matched into same room');
  console.log('✓ quick match put both players in room', a.room.code);
  const c = new Client(url, 'Carol', 'TR');
  await c.ready;
  c.send({ type: 'quick' });
  await c.until((x) => x.room && x.room.code === a.room.code && x.accountId, 5000, 'Carol matched into same room');

  await a.until((c) => c.room.state === 'countdown', 8000, 'countdown');
  assert.ok(a.room.passage && a.room.passage.length > 50, 'passage delivered on countdown');
  assert.ok(a.room.players.length >= 4, `bots filled the room (${a.room.players.length} racers)`);
  console.log('✓ lobby auto-started with bots:', a.room.players.map((p) => p.name).join(', '));

  await a.until((c) => c.room.state === 'racing', 8000, 'racing');
  const passage = a.room.passage;

  // Alice types honestly at ~80 WPM; Bob tries to cheat by jumping to the end.
  const cps = (80 * 5) / 60;
  let ac = 0;
  let frac = 0;
  const aliceTimer = setInterval(() => {
    frac += cps / 10;
    const n = Math.floor(frac);
    frac -= n;
    ac = Math.min(passage.length, ac + n);
    a.send({ type: 'progress', c: ac, t: ac, k: ac, e: 0 });
    if (ac >= passage.length) clearInterval(aliceTimer);
  }, 100);

  // Carol races ahead at ~200 WPM, then her connection drops halfway
  let cc = 0;
  const carolTimer = setInterval(() => {
    cc = Math.min(passage.length, cc + 2);
    c.send({ type: 'progress', c: cc, t: cc, k: cc, e: 0 });
    if (cc >= passage.length / 2) { clearInterval(carolTimer); c.ws.terminate(); }
  }, 120);

  await wait(300);
  b.send({ type: 'progress', c: passage.length, t: passage.length, k: passage.length, e: 0 });
  await wait(300);
  const bobSnap = [...b.msgs].reverse().find((m) => m.type === 'snap');
  const bobP = bobSnap.p.find((p) => p.id === b.id);
  assert.ok(bobP.c < passage.length / 2, `anti-cheat clamped Bob to ${bobP.c}/${passage.length}`);
  assert.ok(!bobP.f, 'Bob did not finish by teleporting');
  console.log(`✓ anti-cheat: teleport clamped to ${bobP.c} chars`);

  // chat while racing
  b.send({ type: 'chat', text: 'gl hf <script>x</script>' });
  await a.until((c) => c.chats.length > 0, 3000, 'chat delivered');
  assert.ok(!a.chats[0].text.includes('<'), 'chat sanitised');
  console.log('✓ chat delivered & sanitised:', JSON.stringify(a.chats[0].text));

  await a.until((c) => c.finished.some((f) => f.id === c.id), 60000, 'Alice finished');
  const myFinish = a.finished.find((f) => f.id === a.id);
  assert.ok(myFinish.wpm >= 65 && myFinish.wpm <= 95, `Alice WPM plausible (${myFinish.wpm}, target 80)`);
  console.log(`✓ Alice finished #${myFinish.rank} at ${myFinish.wpm} WPM in ${(myFinish.time / 1000).toFixed(1)}s`);
  assert.ok(a.snaps > 10, `snapshots streamed (${a.snaps})`);

  // the race clock: from the first finish on, every snapshot carries the server's end time
  await b.until((x) => x.finished.length > 0, 60000, 'first racer home');
  const first = b.finished[0];
  const firstAt = b.msgs.lastIndexOf(first);
  await b.until((x) => x.msgs.slice(firstAt).some((m) => m.type === 'snap'), 3000, 'snapshot after the first finish');
  const endSnap = b.msgs.slice(firstAt).find((m) => m.type === 'snap');
  const expectEnd = b.room.startAt + first.time + Number(process.env.AFTER_FIRST_FINISH_MS);
  assert.strictEqual(endSnap.e, expectEnd, `race end sent with the snapshot (${endSnap.e} vs ${expectEnd})`);
  assert.ok(!b.msgs.slice(0, firstAt).some((m) => m.type === 'snap' && m.e), 'no end time before anyone finished');
  console.log(`✓ race clock: ${first.id === a.id ? 'Alice' : 'a bot'} home, race ends ${endSnap.e - endSnap.t} ms later by the server's clock`);

  await a.until((c) => c.room.state === 'finished', 90000, 'race finished');
  const endedAt = a.room.serverTime;
  assert.ok(endedAt >= endSnap.e && endedAt < endSnap.e + 1000, `race ended on the announced time (${endedAt - endSnap.e} ms after)`);
  assert.strictEqual(a.room.results.length, a.room.players.length, 'results cover every racer');
  assert.ok(a.room.results.every((r) => r.rank >= 1), 'everyone ranked');
  console.log('✓ results:', a.room.results.map((r) => `#${r.rank} ${r.name} ${r.wpm}wpm`).join(' | '));

  // Carol was furthest along when she dropped, and still comes last
  const carol = a.room.results.find((r) => r.id === c.id);
  assert.ok(carol && carol.dropped && !carol.finished, 'dropped racer kept in the results, marked dropped');
  assert.strictEqual(carol.rank, a.room.results.length, 'dropped racer placed last');
  assert.ok(a.room.results.some((r) => !r.dropped && !r.finished && r.progress < carol.progress), 'placed below a connected racer who had typed less');
  const carolAcc = accounts.accounts[c.accountId];
  assert.strictEqual(carolAcc.races, 1, 'dropped racer settled');
  assert.strictEqual(carolAcc.wins + carolAcc.podiums, 0, 'no win or podium for a dropped racer');
  assert.strictEqual(carolAcc.points, 0, 'no ranked points for leaving mid race');
  // in a two-racer room the one who left is 2nd by number, and still gets no podium
  const pair = accounts.login(null, null).account;
  accounts.recordRace(pair, { rank: 2, wpm: 90, accuracy: 99, finished: false, dropped: true, chars: 300, golden: 0, bestCombo: 80, nitros: 0, racers: 2, humans: 2, ranked: true });
  assert.strictEqual(pair.wins + pair.podiums + pair.points, 0, 'a racer who left gets no podium or points in a small room');
  console.log(`✓ dropped racer placed last (#${carol.rank}, ${Math.round(carol.progress * 100)}% typed), settled with ${carolAcc.points} points and no podium`);

  const settled = [...a.msgs].reverse().find((m) => m.type === 'race_result');
  assert.ok(settled && settled.ranked && settled.points > 0, 'ranked points awarded for a public race');
  assert.strictEqual(settled.streak, 1, 'daily streak opened');
  assert.ok(settled.profile.bestWpm >= 65, 'best WPM stored on the account');
  console.log(`✓ race settled: +${settled.points} points, streak ${settled.streak}, ${settled.unlocked.length} achievements`);

  await a.until((c) => c.room.state === 'waiting', 10000, 'room reset for next race');
  assert.ok(a.room.players.every((p) => !p.isBot), 'bots removed between races');
  assert.ok(!a.room.players.some((p) => p.id === c.id), 'dropped racer removed between races');
  console.log('✓ room cycled back to waiting, bots removed');

  a.send({ type: 'leave' });
  b.send({ type: 'leave' });
  await a.until((c) => c.msgs.some((m) => m.type === 'left'), 3000, 'left ack');

  /* ---------------- private room + join by code ---------------- */
  const h = new Client(url, 'Host', 'AE');
  const g = new Client(url, 'Guest', 'IN');
  await Promise.all([h.ready, g.ready]);
  h.send({ type: 'create' });
  await h.until((c) => c.room && c.room.isPrivate, 3000, 'private room created');
  const code = h.room.code;
  g.send({ type: 'join', code: code.toLowerCase() });
  await g.until((c) => c.room && c.room.code === code, 3000, 'guest joined by code (case-insensitive)');
  assert.strictEqual(h.room.hostId, h.id, 'creator is host');
  console.log('✓ private room', code, 'created and joined by code');

  g.send({ type: 'start', bots: true });
  await wait(200);
  assert.ok(g.errors.some((e) => /host/i.test(e.message)), 'non-host cannot start');
  assert.strictEqual(h.room.state, 'waiting', 'still waiting');
  h.send({ type: 'start', bots: true });
  await h.until((c) => c.room.state === 'countdown', 3000, 'host started countdown');
  assert.ok(h.room.players.length >= 3, 'bots added on request');
  console.log('✓ only host can start; bots added on request');

  const x = new Client(url, 'Late', 'US');
  await x.ready;
  x.send({ type: 'join', code: 'ZZZZZ' });
  await x.until((c) => c.errors.length > 0, 3000, 'bad code error');
  console.log('✓ unknown room code rejected:', JSON.stringify(x.errors[0].message));

  for (const c of [a, b, h, g, x]) c.close();
  await wait(200);
  console.log('\nALL TESTS PASSED');
  process.exit(0);
})().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
