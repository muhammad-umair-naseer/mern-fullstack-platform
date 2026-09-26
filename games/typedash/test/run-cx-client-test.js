'use strict';
/**
 * Cortexis sign-in in the browser (public/js/cx-auth.js) against a stand-in
 * website: email + password sign-in and its error cases, the guest merged on
 * sign-in, sign-out, the country guessed from the time zone, and the embed
 * handshake with the website's frame (tokens only from the configured origin,
 * the site's sign-out passed on, a sign-out inside the game respected).
 * Gotcha Rush ships the same module (see its test/auth-test.js parity check).
 */
process.env.PORT = '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/cx-client.json';
delete process.env.RANK_GUESTS;
delete process.env.GAME_SSO_SECRET;
const fs = require('fs');
const http = require('http');
try { fs.unlinkSync(process.env.DATA_FILE); } catch (_) { /* fresh start */ }
const assert = require('assert');
const puppeteer = require('puppeteer-core');
const cx = require('../server/cx');
const { server, accounts } = require('../server/index.js');
const CHROME = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => fs.existsSync(p));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const listen = (srv) => new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv.address().port)));

/** A stand-in for the Cortexis website: its login + game-token API, and a page that frames the game. */
function fakeSite(gameOrigin) {
  const SESSION = 'site-session-901';
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  const send = (res, status, obj) => { res.writeHead(status, { 'Content-Type': 'application/json', ...cors }); res.end(JSON.stringify(obj)); };
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
    if (url.pathname === '/mint') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(cx.signGameToken({ sub: url.searchParams.get('sub') || '902', name: 'Framed Player' }));
    }
    if (url.pathname === '/parent') {
      // answers the game's need-token; ?push=1 also pushes a token unasked on load
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(`<!doctype html><title>site</title><iframe src="${gameOrigin}/how" width="900" height="600"></iframe><script>
        const GAME = ${JSON.stringify(gameOrigin)};
        const q = new URLSearchParams(location.search);
        const frame = document.querySelector('iframe');
        const give = async () => { const t = await (await fetch('/mint?sub=' + (q.get('sub') || '902'))).text(); frame.contentWindow.postMessage({ type: 'cortexis:game-token', token: t }, GAME); window.given = (window.given || 0) + 1; };
        addEventListener('message', (e) => { if (e.origin === GAME && e.source === frame.contentWindow && e.data && e.data.type === 'cortexis:need-token') { window.asked = (window.asked || 0) + 1; give(); } });
        if (q.get('push')) frame.addEventListener('load', () => setTimeout(give, 300));
        window.signOutGame = () => frame.contentWindow.postMessage({ type: 'cortexis:signed-out' }, GAME);
      </script>`);
    }
    let raw = '';
    req.on('data', (d) => { raw += d; });
    req.on('end', () => {
      const body = raw ? JSON.parse(raw) : {};
      if (url.pathname === '/api/auth/login') {
        if (body.email === 'pending@example.com') return send(res, 403, { needsVerification: true, email: body.email, message: 'Confirm your email first' });
        if (body.email === 'busy@example.com') return send(res, 429, { message: 'Too many sign-in attempts' });
        if (body.email === 'learner@example.com' && body.password === 'right-password') return send(res, 200, { token: SESSION, user: { id: 901, name: 'Direct Player Naseer' } });
        return send(res, 401, { message: 'Invalid email or password' });
      }
      if (url.pathname === '/api/auth/game-token') {
        if (req.headers.authorization !== `Bearer ${SESSION}`) return send(res, 401, { message: 'Not signed in' });
        return send(res, 200, { token: cx.signGameToken({ sub: '901', name: 'Direct Player Naseer' }), user: { id: 901, name: 'Direct Player Naseer' }, expiresIn: 600 });
      }
      return send(res, 404, { message: 'not found' });
    });
  });
}

const creds = (key = 'td_account_v1') => new Function(`try { return JSON.parse(localStorage.getItem('${key}')); } catch (_) { return null; }`);
const cxCall = (fn, ...args) => new Function('args', `return import('/js/cx-auth.js').then(({ cxAuth }) => (${fn})(cxAuth, ...args));`);

(async () => {
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const game = `http://127.0.0.1:${server.address().port}`;
  const site = fakeSite(game);
  const sitePort = await listen(site);
  const siteUrl = `http://127.0.0.1:${sitePort}`;
  const rogue = fakeSite(game);
  const rogueUrl = `http://localhost:${await listen(rogue)}`;   // another origin, not configured
  process.env.CORTEXIS_SITE_URL = siteUrl;                     // read per request by /api/auth/config

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: /headless-shell/.test(CHROME || '') ? 'shell' : true, args: ['--mute-audio'] });
  const errors = [];
  const fresh = async (tz) => {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    if (tz) await page.emulateTimezone(tz);
    return page;
  };
  const run = (page, fn, ...args) => page.evaluate(cxCall(fn), args);

  try {
    /* ---------------- country from the time zone ---------------- */
    for (const [tz, cc] of [['Asia/Karachi', 'PK'], ['America/Sao_Paulo', 'BR'], ['Asia/Calcutta', 'IN'], ['Europe/Berlin', 'DE']]) {
      const p = await fresh(tz);
      await p.goto(`${game}/how`, { waitUntil: 'domcontentloaded' });
      assert.strictEqual(await run(p, (a) => a.guessCountry()), cc, `${tz} -> ${cc}`);
      await p.browserContext().close();
    }
    console.log('✓ country: time zone -> PK, BR, IN (legacy name), DE');

    /* ---------------- direct sign-in, email + password ---------------- */
    const page = await fresh('Asia/Karachi');
    // a guest who has already raced on this browser
    const g = accounts.login(null, null);
    Object.assign(g.account, { points: 640, races: 4, wins: 1, name: 'Speedy', country: 'PK' });
    await page.goto(`${game}/how`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((c) => localStorage.setItem('td_account_v1', JSON.stringify(c)), { id: g.account.id, token: g.token });

    const conf = await run(page, (a) => a.ready.then(() => ({ config: a.config, signup: a.signupUrl, choice: a.needsChoice, state: a.state })));
    assert.strictEqual(conf.config.apiUrl, siteUrl, 'the API is the configured website');
    assert.strictEqual(conf.signup, `${siteUrl}/signup`, '"Create a Cortexis account" goes to the website');
    assert.deepStrictEqual(conf.config.parentOrigins, [siteUrl]);
    assert.strictEqual(conf.state.status, 'guest');
    assert.strictEqual(conf.state.embedded, false);
    assert.strictEqual(conf.choice, true, 'a visitor who has not chosen is asked');

    const [empty, first, overlap] = await run(page, (a) => Promise.all([
      a.signIn('', ''),
      a.signIn('learner@example.com', 'nope'),
      a.signIn('learner@example.com', 'nope'),
    ]));
    assert.strictEqual(empty.reason, 'invalid', 'empty form');
    assert.strictEqual(first.reason, 'invalid');
    assert.strictEqual(overlap.reason, 'busy', 'a second attempt while one is running is refused');
    const wrong = await run(page, (a) => a.signIn('learner@example.com', 'nope'));
    assert.strictEqual(wrong.reason, 'invalid', JSON.stringify(wrong));
    const pending = await run(page, (a) => a.signIn('pending@example.com', 'whatever'));
    assert.strictEqual(pending.reason, 'unverified');
    assert.strictEqual(pending.email, 'pending@example.com', 'the address to confirm is handed back');
    const busy = await run(page, (a) => a.signIn('busy@example.com', 'whatever'));
    assert.strictEqual(busy.reason, 'rate-limited');
    assert.strictEqual((await page.evaluate(creds())).id, g.account.id, 'failed attempts leave the guest alone');

    await page.evaluate(() => import('/js/cx-auth.js').then(({ cxAuth }) => { window.events = []; cxAuth.onChange((s, reason, d) => window.events.push({ reason, via: d && d.via, merged: d && d.merged })); }));
    const ok = await run(page, (a) => a.signIn('  learner@example.com ', 'right-password'));
    assert.ok(ok.ok, JSON.stringify(ok));
    assert.strictEqual(ok.state.status, 'signed-in');
    assert.strictEqual(ok.state.id, 'cx_901');
    assert.strictEqual(ok.state.cortexisName, 'Direct Player Naseer');
    assert.strictEqual(ok.state.ranked, true);
    assert.strictEqual(ok.merged, true, 'the guest this browser played as is merged');
    assert.strictEqual(ok.created, true);
    const events = await page.evaluate(() => window.events);
    assert.ok(events.some((e) => e.reason === 'signed-in' && e.via === 'direct' && e.merged), JSON.stringify(events));
    const stored = await page.evaluate(creds());
    assert.strictEqual(stored.id, 'cx_901', 'the game session is stored where the game reads it');
    const acc = accounts.accounts.cx_901;
    assert.ok(acc && acc.points === 640 && acc.races === 4, 'guest progress on the account');
    assert.strictEqual(accounts.accounts[g.account.id].mergedInto, 'cx_901');
    assert.ok(accounts.tokenMatches(acc, stored.token), 'the stored token is a live session');
    console.log('✓ direct sign-in: errors mapped (invalid, unverified, rate-limited); guest merged into cx_901');

    const out = await run(page, (a) => a.signOut());
    assert.strictEqual(out.status, 'guest');
    assert.strictEqual(await page.evaluate(creds()), null, 'credentials cleared (the game mints a fresh guest)');
    assert.ok(!accounts.tokenMatches(acc, stored.token), 'the device session is revoked on the game server');
    assert.ok((await page.evaluate(() => window.events)).some((e) => e.reason === 'signed-out'));
    const guestPick = await run(page, (a) => { a.playAsGuest(); return { choice: a.needsChoice, state: a.state }; });
    assert.strictEqual(guestPick.choice, false, '"Play as guest" is remembered');
    assert.strictEqual(guestPick.state.guestChosen, true);
    await page.browserContext().close();
    console.log('✓ sign-out: session revoked, credentials cleared; "Play as guest" remembered');

    /* ---------------- inside the website's frame ---------------- */
    const host = await fresh();
    const frameOf = async (p) => { for (let i = 0; i < 80; i++) { const f = p.frames().find((x) => x.url().startsWith(game)); if (f) return f; await wait(100); } throw new Error('no game frame'); };
    const idIn = async (p) => (await frameOf(p)).evaluate(creds());
    await host.goto(`${siteUrl}/parent?sub=902`, { waitUntil: 'load' });
    let f = await frameOf(host);
    await f.waitForFunction(() => { try { return JSON.parse(localStorage.getItem('td_account_v1')).id === 'cx_902'; } catch (_) { return false; } }, { timeout: 8000 });
    assert.ok((await host.evaluate(() => window.asked)) >= 1, 'the game asked the website for a token');
    assert.strictEqual((await f.evaluate(() => JSON.parse(localStorage.getItem('td_cx_v1')))).via, 'embed');
    const embedState = await f.evaluate(cxCall((a) => a.state), []);
    assert.strictEqual(embedState.embedded, true);
    assert.strictEqual(embedState.status, 'signed-in');
    console.log('✓ frame: the game asked the website and signed in as cx_902 without a prompt');

    // the same account again (a reload): no second exchange
    const sessionsBefore = accounts.accounts.cx_902.sessions.length;
    await f.evaluate(() => location.reload());
    await wait(1500);
    assert.strictEqual(accounts.accounts.cx_902.sessions.length, sessionsBefore, 'already signed in: no new session per page load');

    // the website signs out: so does the game
    await host.evaluate(() => window.signOutGame());
    f = await frameOf(host);
    await f.waitForFunction(() => { try { const c = JSON.parse(localStorage.getItem('td_account_v1')); return !c || !c.id.startsWith('cx_'); } catch (_) { return true; } }, { timeout: 5000 });
    assert.strictEqual(accounts.accounts.cx_902.sessions.length, sessionsBefore - 1, 'that session is revoked');
    // ...and signs back in on the next load, since the player did not choose to leave
    await f.evaluate(() => location.reload());
    f = await frameOf(host);
    await f.waitForFunction(() => { try { return JSON.parse(localStorage.getItem('td_account_v1')).id === 'cx_902'; } catch (_) { return false; } }, { timeout: 8000 });
    console.log('✓ frame: the website\'s sign-out signs the game out; the next load signs back in');

    // the player signs out inside the game: the website does not undo it on this visit
    await f.evaluate(cxCall((a) => a.signOut()), []);
    await f.evaluate(() => location.reload());
    await wait(2000);
    const afterOptOut = await idIn(host);
    assert.ok(!afterOptOut || !afterOptOut.id.startsWith('cx_'), `stayed signed out, got ${afterOptOut && afterOptOut.id}`);
    assert.ok((await host.evaluate(() => window.given)) >= 3, 'the website did offer a token again');
    await host.browserContext().close();
    console.log('✓ frame: a sign-out inside the game sticks for the visit');

    /* ---------------- a page on another origin cannot sign the player in ---------------- */
    const evil = await fresh();
    await evil.goto(`${rogueUrl}/parent?sub=666&push=1`, { waitUntil: 'load' });
    const evilFrame = await frameOf(evil);
    await wait(2500);
    assert.ok(await evilFrame.evaluate(() => performance.getEntriesByType('resource').some((r) => r.name.endsWith('/js/cx-auth.js'))), 'the framed page runs cx-auth.js (so the refusal is real)');
    assert.ok((await evil.evaluate(() => window.given)) >= 1, 'the rogue page pushed a valid token');
    assert.strictEqual(await evil.evaluate(() => window.asked || 0), 0, 'the game never asks an unconfigured origin');
    const rogueId = await idIn(evil);
    assert.ok(!rogueId || rogueId.id !== 'cx_666', 'the token from another origin is ignored');
    assert.ok(!accounts.accounts.cx_666, 'no account was bound');
    await evil.browserContext().close();
    console.log('✓ frame: tokens from an unconfigured origin are ignored');

    /* ---------------- the website unreachable ---------------- */
    process.env.CORTEXIS_API_URL = 'http://127.0.0.1:9';   // nothing listens on the discard port
    const offline = await fresh();
    await offline.goto(`${game}/how`, { waitUntil: 'domcontentloaded' });
    const net = await run(offline, (a) => a.signIn('learner@example.com', 'right-password'));
    assert.strictEqual(net.reason, 'network', JSON.stringify(net));
    delete process.env.CORTEXIS_API_URL;
    await offline.browserContext().close();
    console.log('✓ website unreachable: a network error, never a crash');

    const relevant = errors.filter((e) => /cx-auth/.test(e));
    assert.deepStrictEqual(relevant, [], 'no cx-auth page errors');
    if (errors.length) console.log(`  (page errors outside cx-auth: ${errors.length}, first: ${errors[0].slice(0, 120)})`);
    console.log('\nALL CORTEXIS CLIENT TESTS PASSED');
    await browser.close();
    site.close(); rogue.close(); server.close();
    process.exit(0);
  } catch (err) {
    console.error('\nTEST FAILED:', err);
    await browser.close().catch(() => {});
    process.exit(1);
  }
})();
