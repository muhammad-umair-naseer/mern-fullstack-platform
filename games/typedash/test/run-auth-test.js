'use strict';
/* Cortexis sign-in against an in-process server: game-token verification,
   binding to cx_<id>, merging a guest once (stats, daily entry, ghosts, team),
   guests kept off every board, country from a CDN header or the browser's
   guess, profile pages for cx_ ids, and sign-out. */
process.env.PORT = '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/auth.json';
delete process.env.RANK_GUESTS;   // the real rule: only signed-in players are ranked
delete process.env.GAME_SSO_SECRET;
require('fs').rmSync(process.env.DATA_FILE, { force: true });
const assert = require('assert');
const http = require('http');
const WebSocket = require('ws');
const cx = require('../server/cx');
const passages = require('../server/passages');
const { server, accounts, boards, daily, ghosts, teams, seasons, shares } = require('../server/index.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let base;
let wsUrl;

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get(`${base}${path}`, { headers }, (res) => {
      let raw = '';
      res.on('data', (d) => { raw += d; });
      res.on('end', () => resolve({ status: res.statusCode, body: raw }));
    }).on('error', reject);
  });
}

async function post(path, body, headers = {}) {
  const res = await fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}

class C {
  constructor(headers = {}) {
    this.ws = new WebSocket(wsUrl, { headers });
    this.msgs = [];
    this.ready = new Promise((res) => this.ws.on('open', res));
    this.ws.on('message', (raw) => this.msgs.push(JSON.parse(raw)));
  }
  send(o) { this.ws.send(JSON.stringify(o)); }
  async next(type, ms = 3000) {
    const t0 = Date.now();
    for (;;) {
      const i = this.msgs.findIndex((m) => m.type === type);
      if (i >= 0) return this.msgs.splice(i, 1)[0];
      if (Date.now() - t0 > ms) throw new Error(`timeout waiting for ${type}`);
      await wait(15);
    }
  }
  close() { this.ws.close(); }
}

const race = { rank: 1, wpm: 82, accuracy: 99, errors: 1, finished: true, chars: 220, golden: 2, goldenTotal: 3, bestCombo: 60, nitros: 1, score: 1400, lane: 0, racers: 4, humans: 1, ranked: true, lang: 'en', category: 'prose' };
const run = (passageId, wpm) => ({ passageId, finished: true, verified: true, wpm, accuracy: 98, time: 30000, errors: 1, timeline: [[0, 0], [10000, 60], [20000, 120], [30000, 180]] });
const rows = (cat, win = 'all') => { boards.invalidate(); return boards.rows(cat, win, 'global'); };

async function main() {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  base = `http://127.0.0.1:${server.address().port}`;
  wsUrl = `ws://127.0.0.1:${server.address().port}`;

  // ---------------- token verification ----------------
  const good = cx.signGameToken({ sub: '4242', name: 'Muhammad Umair Naseer' });
  assert.strictEqual(cx.verifyGameToken(good).sub, '4242');
  const [h, p, s] = good.split('.');
  const flip = (x) => x.slice(0, 5) + (x[5] === 'A' ? 'B' : 'A') + x.slice(6);
  const reject = (tok, code, why) => assert.throws(() => cx.verifyGameToken(tok), (e) => e.code === code, why);
  reject(`${h}.${p}.${flip(s)}`, 'invalid', 'tampered signature');
  reject(cx.signGameToken({ sub: '1', key: 'some-other-secret-entirely' }), 'invalid', 'wrong secret');
  reject(cx.signGameToken({ sub: '1', iss: 'someone-else' }), 'invalid', 'wrong issuer');
  reject(cx.signGameToken({ sub: '1', aud: 'cortexis-site' }), 'invalid', 'wrong audience');
  reject(cx.signGameToken({ sub: '1', now: Date.now() - 20 * 60000 }), 'expired', 'expired');
  reject(`${Buffer.from('{"alg":"none"}').toString('base64url')}.${p}.`, 'invalid', 'alg none');
  console.log('✓ game tokens: signature, issuer, audience, expiry, alg all checked');

  const conf = JSON.parse((await get('/api/auth/config', { host: 'phone.lan:4001' })).body);
  assert.deepStrictEqual([conf.siteUrl, conf.apiUrl, conf.parentOrigins[0]], ['http://phone.lan:3000', 'http://phone.lan:5000', 'http://phone.lan:3000']);
  console.log('✓ config: site, API and parent origin on the same hostname');

  // ---------------- a guest, country from the header ----------------
  const g = new C({ 'X-Country-Code': 'nz' });
  await g.ready;
  await g.next('welcome');
  g.send({ type: 'hello', name: 'Umair', country: 'PK', countryGuess: 'PK', skin: 'bolt' });
  const gAcc = await g.next('account');
  await g.next('hello_ok');
  assert.ok(gAcc.created && gAcc.id.startsWith('p_'));
  const guest = accounts.accounts[gAcc.id];
  assert.strictEqual(guest.country, 'NZ', 'the CDN header beats the browser guess');
  const o = new C();
  await o.ready;
  await o.next('welcome');
  o.send({ type: 'hello', name: 'Sara', country: 'UN', countryGuess: 'JP' });
  assert.strictEqual(accounts.accounts[(await o.next('account')).id].country, 'JP', 'no header: the time-zone guess');
  o.close();
  console.log('✓ country: header first, then the browser guess');

  // ---------------- guests play everything, rank nowhere ----------------
  accounts.recordRace(guest, race);
  const today = daily.today().passage.id;
  const dOut = daily.record(guest, run(today, 70));
  assert.ok(dOut.counted, "a guest's daily run is kept");
  assert.strictEqual(dOut.rank, null, '...but not ranked');
  const other = passages.PASSAGES.find((x) => x.id !== today).id;
  const gh = ghosts.consider(guest, run(other, 90));
  assert.ok(gh.pb && !gh.wr, 'a guest sets a personal best, not a world record');
  teams.create(guest, { name: 'Speed Demons', tag: 'SPD' });
  assert.ok(guest.points > 0);
  for (const cat of ['points', 'wpm', 'streak']) assert.strictEqual(rows(cat).length, 0, `no guest on ${cat}`);
  assert.strictEqual(rows('daily', 'today').length, 0, 'no guest on the daily board');
  assert.strictEqual(rows('teams', 'season').length, 0, "a guest's points do not count for a team");
  assert.strictEqual(rows('countries', 'week').length, 0, '...or a country');
  assert.strictEqual(ghosts.records().length, 0);
  assert.strictEqual(accounts.profile(guest).ranked, false);
  const lb = await get('/leaderboard');
  assert.ok(lb.status === 200 && !lb.body.includes('>Umair<'), 'the leaderboard page lists no guests');
  console.log(`✓ guest: ${guest.points} points, daily run, ghost and team, on no board`);

  // ---------------- sign in: bind + merge ----------------
  assert.strictEqual((await post('/api/auth/cortexis', { gameToken: `${h}.${p}.${flip(s)}` })).status, 401);
  const pts = guest.points;
  const bind = await post('/api/auth/cortexis', { gameToken: good, accountId: gAcc.id, token: gAcc.token, country: 'PK' });
  assert.strictEqual(bind.status, 200, JSON.stringify(bind.body));
  const me = bind.body.profile;
  assert.strictEqual(bind.body.id, 'cx_4242');
  assert.ok(bind.body.created && bind.body.merged && bind.body.token);
  assert.deepStrictEqual([me.name, me.cortexisName, me.country, me.skin], ['Muhammad Umair', 'Muhammad Umair Naseer', 'NZ', 'bolt']);
  assert.deepStrictEqual([me.points, me.races, me.bestWpm, me.signedIn, me.ranked], [pts, 1, 82, true, true]);
  assert.ok(me.team && guest.team === null, 'team handed over');
  assert.strictEqual(guest.mergedInto, 'cx_4242');
  assert.strictEqual(accounts.login(gAcc.id, gAcc.token).created, true, "the retired guest's credentials no longer work");
  assert.deepStrictEqual(rows('points').map((r) => r.id), ['cx_4242']);
  assert.deepStrictEqual(rows('daily', 'today').map((r) => r.id), ['cx_4242'], 'the daily entry moved');
  assert.strictEqual(ghosts.pb('cx_4242', other).wpm, 90, 'the personal best moved');
  const team = teams.get(me.team);
  assert.ok(team && team.members.includes('cx_4242') && team.ownerId === 'cx_4242' && !team.members.includes(gAcc.id), 'the team place moved');
  assert.strictEqual(rows('teams', 'season')[0].tag, 'SPD');
  assert.strictEqual(rows('countries', 'week')[0].id, 'NZ');
  assert.ok(ghosts.consider(accounts.accounts.cx_4242, run(other, 95)).wr, 'a signed-in player sets the world record');
  console.log('✓ bind: cx_4242 created; stats, daily entry, ghost and team merged; ranked everywhere');

  const again = await post('/api/auth/cortexis', { gameToken: good, accountId: gAcc.id, token: gAcc.token });
  assert.deepStrictEqual([again.body.created, again.body.merged, again.body.profile.points], [false, false, pts], 'merged once only');
  const page = await get('/u/cx_4242');
  assert.ok(page.status === 200 && page.body.includes('Muhammad Umair'), 'profile page for a cx_ id');
  console.log('✓ merge happens once; /u/cx_4242 renders');

  // ---------------- socket switches, then signs out ----------------
  g.send({ type: 'hello', name: 'Guest', country: 'NZ', skin: 'bolt', accountId: bind.body.id, token: bind.body.token });
  const sw = await g.next('account');
  assert.deepStrictEqual([sw.id, sw.created], ['cx_4242', false]);
  const ok = await g.next('hello_ok');
  assert.strictEqual(ok.player.name, 'Muhammad Umair', 'a placeholder name never overwrites the nickname');
  assert.strictEqual(ok.player.tag, 'SPD', 'the team tag follows the account');
  g.send({ type: 'signout', token: bind.body.token });
  await g.next('signed_out');
  assert.strictEqual(accounts.login('cx_4242', bind.body.token).created, true, 'the session is revoked');
  g.send({ type: 'hello', name: 'Guest', country: 'NZ' });
  const fresh = await g.next('account');
  assert.ok(fresh.created && fresh.id.startsWith('p_') && fresh.profile.points === 0, 'a fresh guest');
  assert.strictEqual((await post('/api/auth/signout', { accountId: 'cx_4242', token: again.body.token })).body.revoked, true);
  g.close();
  console.log('✓ sign-out: session revoked, fresh guest');

  // ---------------- admin portal: edit and delete a player ----------------
  const adminTok = cx.signGameToken({ sub: 'admin', aud: cx.ADMIN_AUDIENCE, ttlSec: 60 });
  const admin = async (method, id, body, tok = adminTok) => {
    const res = await fetch(`${base}/api/admin/players/${encodeURIComponent(id)}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${tok}` }, body: body && JSON.stringify(body) });
    return { status: res.status, body: await res.json() };
  };
  const sara = (await post('/api/auth/cortexis', { gameToken: cx.signGameToken({ sub: '77', name: 'Sara' }) })).body;
  teams.join(accounts.accounts.cx_77, team.invite);
  accounts.recordHeadToHead(accounts.accounts.cx_77, accounts.accounts.cx_4242);
  seasons.data['2026-01'] = { key: '2026-01', number: 1, players: 2, top: [{ id: 'cx_4242', name: 'Muhammad Umair', country: 'NZ', points: 9, rank: 1 }, { id: 'cx_77', name: 'Sara', country: 'PK', points: 5, rank: 2 }] };
  shares.data.testshare = { accountId: 'cx_4242', name: 'Muhammad Umair', wpm: 80 };
  assert.strictEqual((await admin('PATCH', 'cx_4242', { points: 5 }, good)).status, 401, "a player's token is refused");
  assert.strictEqual((await admin('PATCH', 'cx_4242', { points: -5 })).status, 400);
  assert.strictEqual((await admin('PATCH', 'nobody', { points: 5 })).status, 404);
  const ed = await admin('PATCH', 'cx_4242', { name: 'Umi', country: 'gb', points: 1000 });
  assert.deepStrictEqual([ed.status, ed.body.player.name, ed.body.player.country, ed.body.player.points], [200, 'Umi', 'GB', 1000]);
  assert.strictEqual(rows('points')[0].name, 'Umi', 'the board is recomputed');
  assert.strictEqual(daily.rows(require('../server/accounts').dayKey())[0].name, 'Umi', 'the daily entry shows the new name');
  assert.strictEqual(ghosts.wr(other).name, 'Umi', '...and the world record');
  assert.strictEqual(accounts.accounts.cx_77.rivals.cx_4242.name, 'Umi', "...and the rival's row");
  assert.deepStrictEqual((await admin('DELETE', 'cx_4242')).body, { ok: true });
  assert.ok(!accounts.accounts.cx_4242 && !accounts.accounts[gAcc.id], 'the account and the guest merged into it are gone');
  assert.ok(!accounts.accounts.cx_77.rivals.cx_4242, 'no rival row points at it');
  assert.ok(!daily.rows(require('../server/accounts').dayKey()).some((r) => r.id === 'cx_4242') && !ghosts.data.pb.cx_4242 && !ghosts.wr(other), 'daily entry and ghosts removed');
  assert.deepStrictEqual([team.members, team.ownerId], [['cx_77'], 'cx_77'], 'the team carries on without it');
  assert.deepStrictEqual(seasons.data['2026-01'].top.map((r) => r.id), ['cx_77'], 'off the past season table');
  assert.ok(!shares.data.testshare, 'its shared results are gone');
  assert.ok(!rows('points').some((r) => r.id === 'cx_4242'));
  assert.strictEqual((await admin('DELETE', 'cx_4242')).status, 404);
  assert.ok(sara.id === 'cx_77');
  console.log('✓ admin: edit (name, country, points) and delete; boards, daily, ghosts, team, seasons, rivals kept consistent');

  console.log('\nAll auth checks passed.');
  server.close();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
