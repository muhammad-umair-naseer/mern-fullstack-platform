'use strict';
/* Cortexis sign-in against an in-process server: game-token verification,
   binding to cx_<id>, merging a guest once, guests kept off the boards,
   country from a CDN header or the browser's guess, and sign-out. */
process.env.PORT = '0';
process.env.DATA_FILE = '/tmp/gotcha-test/auth.json';
delete process.env.RANK_GUESTS;   // the real rule: only signed-in players are ranked
delete process.env.GAME_SSO_SECRET;
require('fs').rmSync(process.env.DATA_FILE, { force: true });
const assert = require('assert');
const WebSocket = require('ws');
const cx = require('../server/cx');
const { server, accounts, boards } = require('../server/index.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let base;
let wsUrl;

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

const board = () => boards.board('points', 'all', 'global', null);
const game = { mode: 'match', rank: 1, rounds: 3, correct: 3, bestCombo: 3, score: 900, langs: { js: { rounds: 3, correct: 3 } }, racers: 4, humans: 1, ranked: true };

async function main() {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  base = `http://127.0.0.1:${server.address().port}`;
  wsUrl = `ws://127.0.0.1:${server.address().port}`;

  // ---------------- token verification ----------------
  const good = cx.signGameToken({ sub: '4242', name: 'Muhammad Umair Naseer' });
  assert.deepStrictEqual(cx.verifyGameToken(good).sub, '4242');
  const [h, p, s] = good.split('.');
  const flip = (x) => x.slice(0, 5) + (x[5] === 'A' ? 'B' : 'A') + x.slice(6);
  const reject = (tok, code, why) => assert.throws(() => cx.verifyGameToken(tok), (e) => e.code === code, why);
  reject(`${h}.${p}.${flip(s)}`, 'invalid', 'tampered signature');
  reject(`${h}.${Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url')), sub: '1' })).toString('base64url')}.${s}`, 'invalid', 'edited claims');
  reject(cx.signGameToken({ sub: '1', key: 'some-other-secret-entirely' }), 'invalid', 'wrong secret');
  reject(cx.signGameToken({ sub: '1', iss: 'someone-else' }), 'invalid', 'wrong issuer');
  reject(cx.signGameToken({ sub: '1', aud: 'cortexis-site' }), 'invalid', 'wrong audience');
  reject(cx.signGameToken({ sub: '1', now: Date.now() - 20 * 60000 }), 'expired', 'expired');
  const none = `${Buffer.from('{"alg":"none"}').toString('base64url')}.${p}.`;
  reject(none, 'invalid', 'alg none');
  reject('not-a-token', 'invalid', 'garbage');
  assert.strictEqual(cx.nicknameFrom('Muhammad Umair Naseer', 16), 'Muhammad Umair');
  assert.strictEqual(cx.nicknameFrom('Bartholomew-Alexander', 16), 'Bartholomew-Alex');
  console.log('✓ game tokens: signature, issuer, audience, expiry, alg all checked');

  // ---------------- site config (dev defaults follow the request's host) ----------------
  const conf = await new Promise((resolve, reject) => {
    require('http').get(`${base}/api/auth/config`, { headers: { host: '192.168.1.20:3001' } }, (res) => {
      let raw = '';
      res.on('data', (d) => { raw += d; });
      res.on('end', () => resolve(JSON.parse(raw)));
    }).on('error', reject);
  });
  assert.strictEqual(conf.siteUrl, 'http://192.168.1.20:3000');
  assert.strictEqual(conf.apiUrl, 'http://192.168.1.20:5000');
  assert.deepStrictEqual(conf.parentOrigins, ['http://192.168.1.20:3000']);
  assert.strictEqual(conf.signupUrl, 'http://192.168.1.20:3000/signup');
  assert.strictEqual(conf.ssoReady, true);
  console.log('✓ config: site, API and parent origin on the same hostname');

  // ---------------- country at first contact ----------------
  const g = new C({ 'CF-IPCountry': 'NZ' });
  await g.ready;
  await g.next('welcome');
  g.send({ type: 'hello', name: 'Umair', country: 'PK', countryGuess: 'PK', avatar: 'fox' });
  const gAcc = await g.next('account');
  assert.ok(gAcc.created && gAcc.id.startsWith('p_'), 'a guest is minted');
  assert.strictEqual(accounts.accounts[gAcc.id].country, 'NZ', 'the CDN header beats the browser guess');
  assert.strictEqual((await g.next('hello_ok')).player.country, 'NZ');
  const other = new C();
  await other.ready;
  await other.next('welcome');
  other.send({ type: 'hello', name: 'Sara', country: 'UN', countryGuess: 'JP' });
  const oAcc = await other.next('account');
  assert.strictEqual(accounts.accounts[oAcc.id].country, 'JP', 'no header: the time-zone guess');
  other.close();
  console.log('✓ country: header first, then the browser guess');

  // ---------------- guests play but are not ranked ----------------
  const guest = accounts.accounts[gAcc.id];
  accounts.recordGame(guest, game);
  boards.invalidate();
  assert.ok(guest.points > 0, 'a guest still earns points toward levels');
  assert.strictEqual(board().entries.length, 0, 'guests never appear on the boards');
  assert.ok(boards.standings(guest).every((x) => x.rank === null), 'a guest has no rank');
  const gp = accounts.profile(guest);
  assert.strictEqual(gp.signedIn, false);
  assert.strictEqual(gp.ranked, false);
  console.log(`✓ guest: ${guest.points} points, not on any board`);

  // ---------------- sign in: bind + merge ----------------
  const bad = await post('/api/auth/cortexis', { gameToken: `${h}.${p}.${flip(s)}` });
  assert.strictEqual(bad.status, 401);
  const expired = await post('/api/auth/cortexis', { gameToken: cx.signGameToken({ sub: '4242', now: Date.now() - 3600000 }) });
  assert.strictEqual(expired.status, 401);
  assert.strictEqual(expired.body.code, 'expired');
  assert.strictEqual((await post('/api/auth/cortexis', {})).status, 401, 'no token');

  const pointsBefore = guest.points;
  const bind = await post('/api/auth/cortexis', { gameToken: good, accountId: gAcc.id, token: gAcc.token, country: 'PK' });
  assert.strictEqual(bind.status, 200, JSON.stringify(bind.body));
  assert.strictEqual(bind.body.id, 'cx_4242');
  assert.ok(bind.body.token && bind.body.created && bind.body.merged);
  assert.strictEqual(bind.body.profile.name, 'Muhammad Umair', 'nickname from the Cortexis name');
  assert.strictEqual(bind.body.profile.cortexisName, 'Muhammad Umair Naseer');
  assert.strictEqual(bind.body.profile.country, 'NZ', "the guest's country carries over");
  assert.strictEqual(bind.body.profile.avatar, 'fox');
  assert.strictEqual(bind.body.profile.points, pointsBefore, 'guest points merged');
  assert.strictEqual(bind.body.profile.matches, 1);
  assert.strictEqual(bind.body.profile.signedIn, true);
  assert.strictEqual(bind.body.profile.ranked, true);
  assert.strictEqual(guest.mergedInto, 'cx_4242', 'the guest is retired');
  assert.strictEqual(accounts.login(gAcc.id, gAcc.token).created, true, "the retired guest's credentials no longer work");
  boards.invalidate();
  assert.deepStrictEqual(board().entries.map((e) => e.id), ['cx_4242'], 'only the signed-in player is ranked');
  assert.strictEqual(bind.body.standings[0].rank, 1);
  console.log('✓ bind: cx_4242 created, guest merged and retired, ranked #1');

  // same guest credentials again: merged once only
  const again = await post('/api/auth/cortexis', { gameToken: good, accountId: gAcc.id, token: gAcc.token });
  assert.strictEqual(again.status, 200);
  assert.strictEqual(again.body.created, false);
  assert.strictEqual(again.body.merged, false);
  assert.strictEqual(again.body.profile.points, pointsBefore, 'no double merge');
  assert.notStrictEqual(again.body.token, bind.body.token, 'each device gets its own session');
  console.log('✓ merge happens once; a second device gets its own session');

  // ---------------- the socket switches to the Cortexis account ----------------
  g.send({ type: 'hello', name: 'Guest', country: 'NZ', avatar: 'fox', accountId: bind.body.id, token: bind.body.token });
  const sw = await g.next('account');
  assert.strictEqual(sw.id, 'cx_4242');
  assert.strictEqual(sw.created, false);
  assert.strictEqual((await g.next('hello_ok')).player.name, 'Muhammad Umair', "a placeholder name never overwrites the nickname");
  g.send({ type: 'hello', name: 'Umi', country: 'PK', avatar: 'fox', accountId: bind.body.id, token: bind.body.token });
  assert.strictEqual((await g.next('hello_ok')).player.name, 'Umi', 'the nickname is editable');
  assert.strictEqual(accounts.accounts.cx_4242.cx.name, 'Muhammad Umair Naseer', 'the Cortexis name is kept separately');
  assert.strictEqual(accounts.accounts.cx_4242.country, 'PK', 'the player can change country');
  console.log('✓ socket: switched to cx_4242, nickname editable, Cortexis name kept');

  // ---------------- sign out: back to a fresh guest ----------------
  g.send({ type: 'signout', token: bind.body.token });
  await g.next('signed_out');
  assert.strictEqual(accounts.login('cx_4242', bind.body.token).created, true, 'the session is revoked');
  g.send({ type: 'hello', name: 'Guest', country: 'PK' });
  const fresh = await g.next('account');
  assert.ok(fresh.created && fresh.id.startsWith('p_') && fresh.token, 'a fresh guest');
  assert.strictEqual(fresh.profile.points, 0);
  const http = await post('/api/auth/signout', { accountId: 'cx_4242', token: again.body.token });
  assert.strictEqual(http.body.revoked, true, 'sign-out over HTTP revokes that device');
  assert.strictEqual(accounts.login('cx_4242', again.body.token).created, true);
  g.close();
  console.log('✓ sign-out: session revoked, fresh guest');

  // ---------------- first sight without a guest: country from the header ----------------
  const solo = await post('/api/auth/cortexis', { gameToken: cx.signGameToken({ sub: '77', name: 'Sara' }), country: 'SA' }, { 'x-vercel-ip-country': 'AE' });
  assert.strictEqual(solo.body.profile.country, 'AE');
  const solo2 = await post('/api/auth/cortexis', { gameToken: cx.signGameToken({ sub: '78', name: 'Ali' }), country: 'SA' });
  assert.strictEqual(solo2.body.profile.country, 'SA');
  console.log('✓ new Cortexis player: country from header, else the guess');

  // ---------------- admin portal: edit and delete a player ----------------
  const adminTok = cx.signGameToken({ sub: 'admin', aud: cx.ADMIN_AUDIENCE, ttlSec: 60 });
  const admin = async (method, id, body, tok = adminTok) => {
    const res = await fetch(`${base}/api/admin/players/${encodeURIComponent(id)}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${tok}` }, body: body && JSON.stringify(body) });
    return { status: res.status, body: await res.json() };
  };
  assert.strictEqual((await admin('PATCH', 'cx_77', { points: 5 }, good)).status, 401, "a player's token is refused");
  assert.strictEqual((await admin('PATCH', 'cx_77', { country: 'Saudi' })).status, 400);
  assert.strictEqual((await admin('PATCH', 'cx_77', { name: ' <> ' })).status, 400);
  assert.strictEqual((await admin('PATCH', 'nobody', { points: 5 })).status, 404);
  accounts.recordHeadToHead(accounts.accounts.cx_77, accounts.accounts.cx_4242);
  const ed = await admin('PATCH', 'cx_77', { name: 'Sara  K', country: 'ae', points: 900 });
  assert.strictEqual(ed.status, 200);
  assert.deepStrictEqual([ed.body.player.name, ed.body.player.country, ed.body.player.points], ['Sara K', 'AE', 900]);
  assert.strictEqual(accounts.accounts.cx_4242.rivals.cx_77.name, 'Sara K', "a rival's row shows the new name");
  assert.strictEqual(board().entries[0].id, 'cx_77', 'the board is recomputed');
  assert.deepStrictEqual((await admin('DELETE', 'cx_4242')).body, { ok: true });
  assert.ok(!accounts.accounts.cx_4242 && !accounts.accounts[gAcc.id], 'the account and the guest merged into it are gone');
  assert.ok(!accounts.accounts.cx_77.rivals.cx_4242, 'no rival row points at it');
  assert.ok(!board().entries.some((e) => e.id === 'cx_4242'));
  assert.strictEqual((await admin('DELETE', 'cx_4242')).status, 404);
  console.log('✓ admin: edit (name, country, points) and delete, rivals and boards kept consistent');

  // ---------------- same sign-in code as TypeDash ----------------
  // TypeDash's browser test (test/run-cx-client-test.js) drives cx-auth.js in
  // Chrome; the two copies may differ only in their storage prefix and wording.
  const fs = require('fs');
  const path = require('path');
  const td = (p) => path.join(__dirname, '..', '..', 'typedash', p);
  if (fs.existsSync(td('public/js/cx-auth.js'))) {
    const norm = (src) => src
      .replace(/Gotcha Rush|TypeDash/g, 'GAME')
      .replace(/\b(gr|td)_/g, 'P_')
      .replace(/const P = '(gr|td)';/, "const P = 'P';")
      .replace(/profile\.(avatar|skin) \|\| null/, 'profile.LOOK || null')
      .split('\n').filter((l) => !/^ \*/.test(l)).join('\n');   // doc comment wording
    const mine = fs.readFileSync(path.join(__dirname, '..', 'public/js/cx-auth.js'), 'utf8');
    assert.strictEqual(norm(mine), norm(fs.readFileSync(td('public/js/cx-auth.js'), 'utf8')), 'public/js/cx-auth.js drifted from TypeDash');
    assert.strictEqual(fs.readFileSync(path.join(__dirname, '..', 'server/cx.js'), 'utf8'), fs.readFileSync(td('server/cx.js'), 'utf8'), 'server/cx.js drifted from TypeDash');
    console.log('✓ cx-auth.js and server/cx.js match TypeDash (its browser test covers both games)');
  }

  console.log('\nAll auth checks passed.');
  server.close();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
