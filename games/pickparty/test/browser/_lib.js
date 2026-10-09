'use strict';
// Shared bits for the browser checks. They drive the installed Chrome through
// playwright-core. By default each check forks its own server with short
// timers (so a whole auction topic plays out in seconds); set BASE_URL to
// point them at a running server instead. Exit non-zero on the first failure.
const path = require('path');
const fs = require('fs');
const os = require('os');
const { fork } = require('child_process');
const { chromium } = require('playwright-core');

const SHOTS = path.join(__dirname, 'shots');
const FAST = {
  LOBBY_WAIT_MS: '2000', INTRO_MS: '800', TURN_MS: '2500', VOTE_MS: '2500', ROUND_RESULT_MS: '800', SECRET_MS: '3000',
  TOPIC_END_MS: '1200', MATCH_END_MS: '4000', BOT_MIN_MS: '300', BOT_MAX_MS: '900',
  BID_MS: '1500', BID_EXTEND_MS: '700', BID_MAX_MS: '4000', SOLD_MS: '450', AUCTION_REVEAL_STEP_MS: '300',
};

async function startServer() {
  if (process.env.BASE_URL) return { base: process.env.BASE_URL, stop() {} };
  const data = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pickparty-browser-')), 'db.json');
  const srv = fork(path.join(__dirname, '..', '..', 'server', 'index.js'), { env: { ...process.env, ...FAST, PORT: '0', DATA_FILE: data }, stdio: ['ignore', 'ignore', 'inherit', 'ipc'] });
  const port = await new Promise((r) => srv.on('message', (m) => m.port && r(m.port)));
  return { base: `http://localhost:${port}`, stop() { srv.kill('SIGTERM'); } };
}

async function run(name, fn) {
  fs.mkdirSync(SHOTS, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  const ctx = {
    browser, errors, base: server.base,
    async page(viewport = { width: 1280, height: 900 }) {
      const p = await (await browser.newContext({ viewport })).newPage();
      p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
      p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      await p.goto(server.base + '/', { waitUntil: 'domcontentloaded' });
      await p.waitForFunction(() => document.querySelector('#conn')?.textContent === 'Online', null, { timeout: 10000 });
      return p;
    },
    shot: (p, label) => p.screenshot({ path: path.join(SHOTS, `${name}-${label}.png`) }),
  };
  let failed = false;
  try {
    await fn(ctx);
    if (errors.length) throw new Error('browser errors: ' + JSON.stringify(errors));
    console.log(`✓ ${name}`);
  } catch (e) {
    failed = true;
    console.error(`✗ ${name}: ${e.message}`);
  } finally {
    await browser.close();
    server.stop();
  }
  process.exit(failed ? 1 : 0);
}

module.exports = { run };
