'use strict';
/**
 * The English chain: paragraphs open in order. Paragraph 1 is always open,
 * each one after it opens once every paragraph before it is done, and a
 * paragraph you have finished stays open. Practice on a locked paragraph is
 * refused and records nothing; the daily never is. A guest's progress follows
 * them into their Cortexis account, and /api/passages, the pages and the
 * profile all carry the same order. Also: a day keeps the paragraph it has.
 */
process.env.PORT = '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/lock.json';
process.env.SOLO_START_SLACK_MS = '60000';   // no need to sleep through the start-stamp check
delete process.env.PRACTICE_LOCK;             // the real rule
delete process.env.GAME_SSO_SECRET;           // sign in with the development secret
require('fs').rmSync(process.env.DATA_FILE, { force: true });
const assert = require('assert');
const WebSocket = require('ws');
const cx = require('../server/cx');
const cfg = require('../server/config');
const passages = require('../server/passages');
const { dayKey } = require('../server/accounts');
const { challengeFor } = require('../server/daily');
const { server, accounts, daily } = require('../server/index.js');

const { CHAIN } = passages;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

class C {
  constructor(url, name) {
    this.ws = new WebSocket(url); this.name = name; this.account = null; this.result = null; this.errors = [];
    this.ready = new Promise((res) => this.ws.on('open', res));
    this.ws.on('message', (raw) => {
      const m = JSON.parse(raw);
      if (m.type === 'account') this.account = m;
      if (m.type === 'race_result') this.result = m;
      if (m.type === 'error') this.errors.push(m);
    });
    this.ready.then(() => this.send({ type: 'hello', name, country: 'PK' }));
  }
  send(o) { this.ws.send(JSON.stringify(o)); }
  async until(p, t = 5000, label = '?') { const t0 = Date.now(); while (Date.now() - t0 < t) { if (p(this)) return; await wait(15); } throw new Error(`timeout: ${label} (${this.name})`); }
  get acc() { return accounts.accounts[this.account.id]; }
  close() { this.ws.close(); }
}

/** A plausible run: `chars` typed evenly, sampled every 250 ms. */
function runFor(p, { mode = 'practice', finished = true } = {}) {
  const len = p.text.length;
  const chars = finished ? len : Math.floor(len / 2);
  const time = Math.ceil((chars / cfg.MAX_CPS) * 1000) + 1500;
  const timeline = [];
  for (let t = 250; t < time; t += 250) timeline.push([t, Math.min(chars, Math.floor((chars * t) / time))]);
  timeline.push([time, chars]);
  return { type: 'solo_done', mode, passageId: p.id, chars, finished, time, keystrokes: chars, errors: 0, golden: 0, goldenTotal: 3, bestCombo: chars, nitros: 0, score: 1000, timeline };
}

/** Start and submit a run the way the browser does; resolves with the result (throws on a refusal). */
async function play(c, p, opts = {}) {
  c.result = null; c.errors = [];
  c.send({ type: 'solo_start', passageId: p.id, mode: opts.mode || 'practice' });
  await wait(30);
  c.send(runFor(p, opts));
  await c.until((x) => x.result || x.errors.length, 5000, `run ${p.id}`);
  if (c.errors.length) throw new Error(`${p.id} refused: ${c.errors[0].message}`);
  return c.result;
}

/** A practice start the server must refuse; resolves with the refusal. */
async function refusal(c, p) {
  c.result = null; c.errors = [];
  c.send({ type: 'solo_start', passageId: p.id, mode: 'practice' });
  await c.until((x) => x.errors.length, 3000, `refusal of ${p.id}`);
  return c.errors[0];
}

async function signIn(sub, c) {
  const res = await fetch(`http://localhost:${server.address().port}/api/auth/cortexis`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ gameToken: cx.signGameToken({ sub, name: 'Lock Tester' }), accountId: c.account.id, token: c.account.token, country: 'PK' }),
  });
  assert.strictEqual(res.status, 200);
  return res.json();
}

(async () => {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const base = `http://localhost:${server.address().port}`;
  const url = `ws://localhost:${server.address().port}`;
  const get = async (path) => (await fetch(base + path)).text();
  const N = CHAIN.length;
  const today = dayKey();

  // today already has a paragraph stored (as if first served before the catalogue grew):
  // a far one, and not the one today's pool would draw
  const far = [CHAIN[N - 2], CHAIN[N - 3]].find((p) => p.id !== challengeFor(today).passage.id);
  const after = CHAIN[far.chain];                                   // the paragraph right after it
  daily.data[today] = { passageId: far.id, entries: {}, plays: 0 };

  /* ---------------- one order everywhere ---------------- */
  assert.ok(N >= 8, `enough English paragraphs to test with (${N})`);
  assert.deepStrictEqual(CHAIN.map((p) => p.chain), CHAIN.map((_, i) => i + 1), 'numbered 1..N');
  assert.ok(passages.PASSAGES.every((p) => !!p.chain === passages.inChain(p)), 'every English paragraph, and only those, is in the chain');
  for (let i = 1; i < N; i++) assert.ok(CHAIN[i - 1].stage <= CHAIN[i].stage, 'easiest stage first');
  const api = JSON.parse(await get('/api/passages'));
  assert.deepStrictEqual(api.chain, CHAIN.map((p) => p.id), '/api/passages carries the chain');
  assert.strictEqual(api.lock, true, 'and says the lock is on');
  const set = await get('/practice/lang/en');
  const cards = [...set.matchAll(/<li class="ps" data-id="([^"]+)" data-n="(\d+)" data-state="(\w+)"/g)];
  assert.deepStrictEqual(cards.map((m) => m[1]), api.chain, 'the English set lists them in chain order');
  assert.deepStrictEqual(cards.map((m) => Number(m[2])), CHAIN.map((p) => p.chain), 'numbered on the page');
  assert.deepStrictEqual([...new Set(cards.slice(1).map((m) => m[3]))], ['locked'], 'a new visitor sees the rest locked');
  assert.strictEqual(cards[0][3], 'next', '...and paragraph 1 up next');
  assert.ok(set.includes(`<b>0</b> of ${N} done`) && !set.includes('Nothing is locked'), 'progress instead of "Nothing is locked"');
  assert.ok(/data-id="[^"]+" data-n="2"[\s\S]*?Finish <b data-need>1<\/b> to unlock/.test(set), 'paragraph 2 says what opens it');
  assert.ok(set.includes('<script data-paint>'), 'the page repaints your own progress before it shows');
  assert.ok((await get(`/practice/${CHAIN[1].id}`)).includes('data-state="locked"'), 'a locked paragraph page keeps its text but not its start button');
  assert.ok((await get(`/practice/${CHAIN[0].id}`)).includes('data-state="open"'), 'paragraph 1 can be typed');
  assert.ok((await get('/practice')).includes(`of ${N} done`), 'the English card on /practice shows progress too');
  assert.ok(!(await get('/practice/lang/es')).includes('data-chain'), 'other languages are never locked');
  console.log(`✓ one order everywhere: ${N} English paragraphs, #1 "${CHAIN[0].title}", /api/passages, set page, paragraph pages, /practice`);

  /* ---------------- a fresh player ---------------- */
  const a = new C(url, 'Umair');
  await a.until((c) => c.account, 4000, 'account');
  assert.deepStrictEqual(a.account.profile.done, [], 'profile.done is present (empty)');
  assert.strictEqual(passages.lockOf(CHAIN[0], []), null, '#1 is always open');
  assert.strictEqual(passages.lockOf(CHAIN[1], []), CHAIN[0], '#2 waits for #1');
  const es = passages.list({ lang: 'es' })[3];
  const code = passages.list({ category: 'code' })[3];
  assert.ok(!passages.lockOf(es, []) && !passages.lockOf(code, []), 'other languages and the drills are never locked');
  let no = await refusal(a, CHAIN[1]);
  assert.deepStrictEqual([no.message, no.locked, no.next, no.nextNo], ['Finish paragraph 1 first.', true, CHAIN[0].id, 1], 'a locked practice start is refused');
  await play(a, es);
  console.log('✓ a fresh player: only #1 is open; #2 is refused ("Finish paragraph 1 first."); Spanish is open');

  /* ---------------- an unfinished run opens nothing ---------------- */
  let r = await play(a, CHAIN[0], { finished: false });
  assert.strictEqual(r.solo.finished, false);
  assert.strictEqual(r.solo.opened, null, 'nothing opened');
  assert.deepStrictEqual(r.profile.done, []);
  assert.strictEqual((await refusal(a, CHAIN[1])).next, CHAIN[0].id, '#2 still waits');
  console.log('✓ a run left unfinished opens nothing');

  /* ---------------- finishing #1 opens #2 ---------------- */
  r = await play(a, CHAIN[0]);
  assert.deepStrictEqual(r.solo.opened, { id: CHAIN[1].id, n: 2, title: CHAIN[1].title }, 'the result says #2 opened');
  assert.deepStrictEqual(r.profile.done, [CHAIN[0].id], 'and the profile carries it');
  r = await play(a, CHAIN[0]);
  assert.strictEqual(r.solo.opened, null, 'typing #1 again opens nothing new');
  no = await refusal(a, CHAIN[2]);
  assert.strictEqual(no.message, 'Finish paragraph 2 first.', '#3 waits for #2');
  console.log('✓ finishing #1 opens #2 (and only #2)');

  /* ---------------- the daily, on a far paragraph ---------------- */
  const dApi = JSON.parse(await get('/api/daily'));
  assert.strictEqual(dApi.passage.id, far.id, 'a day keeps the paragraph it has stored');
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  assert.strictEqual(daily.challenge(tomorrow).passage.id, challengeFor(tomorrow).passage.id, 'a new day draws from the full pool');
  r = await play(a, far, { mode: 'daily' });
  assert.ok(r.daily && r.daily.counted, `today's paragraph (#${far.chain}) is never locked`);
  assert.strictEqual(r.solo.opened, null, 'it opens nothing after it');
  assert.ok(r.profile.done.includes(far.id), 'but it stays open to replay');
  await play(a, far);
  no = await refusal(a, after);
  assert.deepStrictEqual([no.message, no.next], ['Finish paragraph 2 first.', CHAIN[1].id], `#${after.chain} is still locked`);
  console.log(`✓ the daily on #${far.chain} counted, #${far.chain} replays in practice, #${after.chain} stays locked`);

  /* ---------------- a refused run records nothing; the daily is never refused ---------------- */
  const acc = a.acc;
  const before = { runs: acc.solo.runs, chars: acc.chars, done: acc.done.length };
  a.errors = []; a.result = null;
  a.send(runFor(after));                                           // practice, straight to the result
  await a.until((c) => c.errors.length, 3000, 'solo_done refusal');
  assert.ok(a.errors[0].locked && a.errors[0].next === CHAIN[1].id, 'a locked practice result is refused');
  await wait(150);
  assert.strictEqual(a.result, null, 'no result');
  assert.deepStrictEqual({ runs: acc.solo.runs, chars: acc.chars, done: acc.done.length }, before, 'nothing recorded');
  r = await play(a, after, { mode: 'daily' });                     // the daily is never refused, whatever the paragraph
  assert.ok(r.daily && r.daily.reason === 'not-today' && !a.errors.length, 'a daily run is taken (it just is not today\'s)');
  console.log('✓ refused practice results record nothing; daily runs are never refused');

  /* ---------------- a guest's progress survives sign-in ---------------- */
  const b = new C(url, 'Sara');
  await b.until((c) => c.account, 4000, 'account');
  await play(b, CHAIN[0]);
  await play(b, CHAIN[1]);
  let out = await signIn('7001', b);
  assert.ok(out.created && out.merged);
  assert.deepStrictEqual(new Set(out.profile.done), new Set([CHAIN[0].id, CHAIN[1].id]), 'the first guest brings #1 and #2');
  const aDone = [...a.acc.done];
  out = await signIn('7001', a);
  assert.ok(!out.created && out.merged, 'a second guest folds into the same account');
  assert.deepStrictEqual(new Set(out.profile.done), new Set([CHAIN[0].id, CHAIN[1].id, ...aDone]), 'the two sets are joined');
  const cxAcc = accounts.accounts.cx_7001;
  assert.strictEqual(passages.lockOf(CHAIN[2], cxAcc.done), null, '#3 is open to the account');
  assert.strictEqual(passages.lockOf(CHAIN[3], cxAcc.done), CHAIN[2], '#4 waits for #3');
  console.log(`✓ sign-in joins a guest's paragraphs with the account's (${cxAcc.done.length} done)`);

  a.close(); b.close();
  await wait(100);
  console.log('\nALL LOCK TESTS PASSED');
  process.exit(0);
})().catch((e) => { console.error('\nTEST FAILED:', e); process.exit(1); });
