'use strict';
/**
 * Abuse limits: requests that used to crash the server get an answer instead,
 * and one address cannot fill it with sockets, guest accounts, rooms or
 * messages. The limits are set low here (server/config.js reads them from env).
 */
process.env.PORT = '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/limits.json';
process.env.SOCKETS_PER_IP = '6';
process.env.GUESTS_PER_IP_PER_HOUR = '4';
process.env.ROOMS_PER_IP_PER_MIN = '2';
process.env.MSG_BURST = '10';
process.env.MSG_PER_SEC = '2';
process.env.WS_MAX_PAYLOAD = '2048';
require('fs').rmSync(process.env.DATA_FILE, { force: true });
const assert = require('assert');
const http = require('http');
const WebSocket = require('ws');
const { server, accounts, manager } = require('../server/index.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Raw HTTP, so a malformed path goes out exactly as written. */
const raw = (port, method, path, body) => new Promise((resolve) => {
  const req = http.request({ port, method, path, headers: body != null ? { 'content-type': 'application/json' } : {} }, (res) => {
    let text = '';
    res.on('data', (d) => (text += d));
    res.on('end', () => resolve({ status: res.statusCode, body: text }));
  });
  req.on('error', (e) => resolve({ status: 0, body: e.message }));
  req.end(body);
});

class C {
  constructor(url, creds = null) {
    this.ws = new WebSocket(url); this.msgs = []; this.closed = null; this.account = null;
    this.ws.on('message', (m) => { const x = JSON.parse(m); this.msgs.push(x); if (x.type === 'account') this.account = x; });
    this.ws.on('close', (code) => { this.closed = code; });
    this.ws.on('error', () => {});
    this.ready = new Promise((r) => { this.ws.on('open', r); this.ws.on('close', r); });
    this.creds = creds;
  }
  send(o) { if (this.ws.readyState === 1) this.ws.send(typeof o === 'string' ? o : JSON.stringify(o)); }
  hello() { this.send({ type: 'hello', name: 'Limits', ...(this.creds || {}) }); }
  close() { this.ws.close(); }
}

(async () => {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const port = server.address().port;
  const url = `ws://localhost:${port}`;
  const alive = async () => (await raw(port, 'GET', '/healthz')).status === 200;

  /* ---------------- requests that used to crash the process ---------------- */
  for (const path of ['/%E0%A4%A', '/%', '/api/auth/%zz', '/practice/%E0']) {
    const r = await raw(port, 'GET', path);
    assert.strictEqual(r.status, 400, `${path} -> 400`);
    assert.ok(await alive(), `still up after ${path}`);
  }
  for (const cat of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
    const r = await raw(port, 'GET', `/api/board?category=${cat}`);
    assert.strictEqual(r.status, 200, `board ${cat} answers`);
    assert.ok(await alive(), `still up after category=${cat}`);
  }
  for (const body of ['null', '[1]', '"x"', '7', '{bad']) {
    const r = await raw(port, 'POST', '/api/auth/cortexis', body);
    assert.strictEqual(r.status, 400, `cortexis body ${body} -> 400`);
    assert.ok(!/at |\/Users\//.test(r.body), 'no stack or path in the answer');
  }
  assert.ok(await alive());
  console.log('✓ bad percent-escapes, prototype board names and non-object bodies get 400/200, never a crash');

  /* ---------------- guests per address ---------------- */
  const before = accounts.size;
  const guests = [];
  for (let i = 0; i < 5; i++) { const c = new C(url); await c.ready; c.hello(); guests.push(c); await wait(60); }
  await wait(150);
  assert.strictEqual(accounts.size - before, 4, 'four guests minted, the fifth refused');
  const refused = guests[4];
  assert.ok(refused.msgs.some((m) => m.type === 'error' && /Too many new players/.test(m.message)), 'the fifth is told why');
  assert.strictEqual(refused.closed, 1013, 'and its socket closed (1013)');
  // an existing player still signs in from the same address
  const back = new C(url, { accountId: guests[0].account.id, token: guests[0].account.token });
  await back.ready; back.hello(); await wait(150);
  assert.ok(back.account && back.account.created === false && back.account.id === guests[0].account.id, 'a returning player is never limited');
  console.log('✓ guest accounts: GUESTS_PER_IP_PER_HOUR new ones per address; returning players unaffected');

  /* ---------------- rooms per address ---------------- */
  const host = guests[0];
  const roomsBefore = manager.stats().rooms;
  for (let i = 0; i < 3; i++) { host.send({ type: 'create' }); await wait(80); }
  await wait(100);
  assert.ok(host.msgs.some((m) => m.type === 'error' && /Too many rooms/.test(m.message)), 'third room in a minute refused');
  assert.ok(manager.stats().rooms - roomsBefore <= 1, 'a player holds one room at a time anyway');
  guests[1].send({ type: 'quick' }); await wait(100);
  assert.ok(guests[1].msgs.some((m) => m.type === 'error' && /Too many races started/.test(m.message)), 'the limit is per address, across players');
  console.log('✓ rooms: ROOMS_PER_IP_PER_MIN create / quick-match asks per address');

  /* ---------------- sockets per address ---------------- */
  for (const c of guests) c.close();
  back.close();
  await wait(200);
  const socks = [];
  for (let i = 0; i < 8; i++) { const c = new C(url); await c.ready; socks.push(c); }
  await wait(100);
  assert.strictEqual(socks.filter((c) => c.ws.readyState === 1).length, 6, 'SOCKETS_PER_IP open at once');
  assert.ok(socks.filter((c) => c.closed === 1013).length === 2, 'the rest refused with 1013');
  socks[0].close(); await wait(150);
  const again = new C(url); await again.ready; await wait(50);
  assert.strictEqual(again.ws.readyState, 1, 'a slot frees when a socket closes');
  for (const c of socks) c.close();
  again.close();
  await wait(200);
  console.log('✓ sockets: SOCKETS_PER_IP per address, freed on close');

  /* ---------------- message rate and size ---------------- */
  const m = new C(url, { accountId: guests[0].account.id, token: guests[0].account.token });
  await m.ready; m.hello(); await wait(600);   // the bucket refills while we wait
  m.msgs.length = 0;
  for (let i = 0; i < 30; i++) m.send({ type: 'ping', t: i });
  await wait(200);
  const pongs = m.msgs.filter((x) => x.type === 'pong').length;
  assert.ok(pongs >= 10 && pongs <= 12, `a burst of 30 gets MSG_BURST answers (${pongs})`);
  await wait(1100);
  m.msgs.length = 0;
  m.send({ type: 'ping', t: 99 }); await wait(100);
  assert.ok(m.msgs.some((x) => x.type === 'pong'), 'refilled at MSG_PER_SEC');
  m.send(JSON.stringify({ type: 'chat', text: 'x'.repeat(4000) }));
  await wait(150);
  assert.strictEqual(m.closed, 1009, 'a message over WS_MAX_PAYLOAD closes the socket (1009)');
  assert.ok(await alive());
  console.log('✓ messages: MSG_BURST then MSG_PER_SEC per socket; WS_MAX_PAYLOAD enforced');

  console.log('\nALL LIMIT TESTS PASSED');
  process.exit(0);
})().catch((e) => { console.error('\nTEST FAILED:', e); process.exit(1); });
