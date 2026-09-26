'use strict';
/**
 * Real-browser test of practice mode, driven through the locally installed
 * Chrome (puppeteer-core, no download). It proves the "load on the client"
 * property directly: the page's WebSocket is instrumented and a practice run
 * must send exactly one `solo_start` and one `solo_done` and no `progress`.
 *
 *   CHROME=/path/to/chrome node test/run-browser-test.js
 */
process.env.PORT = '0';
process.env.DATA_FILE = process.env.DATA_FILE || '/tmp/typedash-test/browser.json';
const assert = require('assert');
const fs = require('fs');
try { fs.unlinkSync(process.env.DATA_FILE); } catch (_) { /* fresh start: records and accounts from earlier runs would skew the assertions */ }
const path = require('path');
const puppeteer = require('puppeteer-core');
const { server, teams } = require('../server/index.js');
const { CHAIN } = require('../server/passages.js');

const CHROME = process.env.CHROME || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => fs.existsSync(p));
const SHOTS = process.env.SHOTS || '';   // directory for screenshots (optional)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  if (!CHROME) { console.log('SKIPPED: no Chrome found (set CHROME=/path/to/chrome)'); process.exit(0); }
  await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
  const base = `http://localhost:${server.address().port}`;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  await browser.defaultBrowserContext().overridePermissions(base, ['clipboard-read', 'clipboard-write']);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()); });
  const shot = async (name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${name}.png`) }); };

  // count every message the page sends, by type; capture clipboard writes (headless Chrome cannot read them back)
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('td_onboarded', '1'); } catch (_) { /* seed: skip the first-run wizard in tests */ }
    window.__sent = {};
    window.__copied = null;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      const write = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (t) => { window.__copied = t; return write(t).catch(() => {}); };
    }
    const send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      try { const t = JSON.parse(data).type; window.__sent[t] = (window.__sent[t] || 0) + 1; } catch (_) { /* ignore */ }
      return send.call(this, data);
    };
  });
  const sent = () => page.evaluate(() => ({ ...window.__sent }));
  const state = (expr) => page.evaluate(`(() => { const S = window.TypeDash.state; return ${expr}; })()`);

  /* ---------------- first run: nothing to fill in before playing ---------------- */
  {
    const fresh = await browser.createBrowserContext();       // its own empty localStorage
    const fp = await fresh.newPage();
    await fp.goto(`${base}/app`, { waitUntil: 'networkidle0' });
    await fp.waitForFunction(() => window.TypeDash && window.TypeDash.solo.catalogue);
    const firstRun = await fp.evaluate(() => ({
      blocking: [...document.querySelectorAll('.modal')].filter((m) => !m.hidden).map((m) => m.id),
      playable: !!document.getElementById('btn-quick').offsetParent && !!document.getElementById('btn-solo').offsetParent,
      lang: document.getElementById('lang').value,
      folded: document.getElementById('options-wrap').dataset.open === 'false' && document.getElementById('friends-wrap').dataset.open === 'false',
    }));
    assert.deepStrictEqual(firstRun.blocking, [], 'a first-time visitor is not stopped by a setup dialog');
    assert.ok(firstRun.playable && firstRun.folded, 'both play buttons are ready and the extras are folded away');
    assert.ok(firstRun.lang, `a passage language is picked without asking (${firstRun.lang})`);
    await fresh.close();
    console.log(`✓ first run: no setup wizard — home is playable on the first paint (language ${firstRun.lang})`);
  }

  /* ---------------- home -> practice run ---------------- */
  await page.goto(`${base}/app`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#btn-solo');
  // who you are lives on your stats page (the footer links it for a guest); the home screen only plays
  assert.ok(await page.$eval('#guest-note', (el) => !el.hidden && /aren't ranked/.test(el.textContent)), 'a guest sees the quiet not-ranked line');
  assert.strictEqual(await page.$('#screen-home #name'), null, 'no name form on the home screen');
  await page.click('.site-foot a[href="/app/profile"]');
  await page.waitForFunction(() => location.pathname === '/app/profile' && document.getElementById('screen-profile').classList.contains('active') && !document.documentElement.dataset.transitioning, { timeout: 8000 });
  await page.type('#name', 'Tester');
  await page.keyboard.press('Enter');                       // saved when you leave the field
  await page.waitForFunction(() => localStorage.getItem('td_name') === 'Tester');
  await page.click('#topbar .nav-cta');
  await page.waitForFunction(() => location.pathname === '/app' && document.getElementById('screen-home').classList.contains('active') && !document.documentElement.dataset.transitioning, { timeout: 8000 });
  await page.select('#pacer', 'medium');
  await page.click('#btn-options');                         // the language and robot picker is folded away by default
  await page.click('#btn-options');
  assert.ok(/Paragraphs in English/.test(await page.$eval('#identity-text', (el) => el.textContent)), 'settings line names the paragraph language');
  await page.waitForFunction(() => window.TypeDash && window.TypeDash.solo.catalogue);
  const before = await sent();
  await page.click('#btn-solo');
  await page.waitForFunction(() => window.TypeDash.state.room && window.TypeDash.state.room.solo && window.TypeDash.state.room.state === 'countdown');
  assert.ok(await page.$eval('#screen-race', (el) => el.classList.contains('active')), 'race screen shown');
  assert.strictEqual(await page.$eval('#room-type', (el) => el.textContent), 'Practice');
  assert.strictEqual(await page.$eval('.lane.pacer .tag.bot', (el) => el.textContent), 'ROBOT', 'the robot lane is labelled in plain words');
  assert.strictEqual(await page.$$eval('.lane', (ls) => ls.length), 2, 'two lanes: you and the pacer');
  console.log('✓ practice run started from the home page (countdown, pacer lane)');
  await shot('01-countdown');

  await page.waitForFunction(() => window.TypeDash.state.room.state === 'racing', { timeout: 8000 });
  const passage = await state('S.passage');
  assert.ok(passage.length > 100, 'passage loaded locally');
  assert.strictEqual(await page.evaluate(() => document.activeElement && document.activeElement.id), 'hidden-input', 'typing input focused at GO');
  const t0 = Date.now();
  await page.keyboard.type(passage, { delay: 34 });            // ~29 cps: fast but under the server ceiling
  await page.waitForFunction(() => window.TypeDash.state.myFinish, { timeout: 5000 });
  const myFinish = await state('S.myFinish');
  assert.strictEqual(myFinish.rank, 1, 'beat the 55 WPM pacer');
  assert.ok(myFinish.wpm > 200, `local wpm computed (${myFinish.wpm})`);
  console.log(`✓ typed ${passage.length} chars in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${myFinish.wpm} WPM, rank ${myFinish.rank}`);
  await shot('02-finish-banner');

  await page.waitForFunction(() => !document.getElementById('results').hidden, { timeout: 5000 });
  assert.ok(!(await page.$eval('#solo-results', (el) => el.hidden)), 'practice results block visible');
  assert.ok(await page.$eval('#podium', (el) => el.hidden), 'podium hidden for practice');
  await page.waitForFunction(() => !document.documentElement.dataset.counting, { timeout: 3000 });   // the headline number counts up
  assert.strictEqual(await page.$eval('#sr-wpm', (el) => el.textContent), String(myFinish.wpm));
  assert.ok(/beat the robot \(55 words a min\)/i.test(await page.$eval('#sr-lines', (el) => el.textContent)), 'result says who won, in plain words');
  await page.waitForFunction(() => /faster|your best yet|fastest on your own/i.test(document.getElementById('sr-lines').textContent), { timeout: 5000 });
  assert.ok(/nobody on typedash has typed this paragraph faster/i.test(await page.$eval('#sr-lines', (el) => el.textContent)), 'first verified run on a paragraph sets its record');
  await page.waitForFunction(() => /Warm-up lap/.test(document.getElementById('mr-unlocks').textContent), { timeout: 5000 });
  assert.ok(/no points for typing on your own/i.test(await page.$eval('#mr-xp', (el) => el.textContent)), 'says plainly that this one earns no points');
  assert.ok(/1 go on your own so far/.test(await page.$eval('#sr-lines', (el) => el.textContent)));
  console.log('✓ results modal: local numbers, then server verdict (personal best + achievement chips)');
  await shot('03-results');

  const after = await sent();
  const delta = (t) => (after[t] || 0) - (before[t] || 0);
  assert.strictEqual(delta('progress'), 0, 'no progress messages during a practice run');
  assert.strictEqual(delta('solo_start'), 1, 'exactly one solo_start');
  assert.strictEqual(delta('solo_done'), 1, 'exactly one solo_done');
  assert.strictEqual(delta('rev'), 0, 'no rev traffic in practice');
  console.log('✓ socket traffic for the whole run:', JSON.stringify(Object.fromEntries(Object.keys(after).filter((k) => delta(k)).map((k) => [k, delta(k)]))));

  /* ---------------- share the result ---------------- */
  await page.waitForFunction(() => !document.getElementById('btn-share').hidden, { timeout: 5000 });
  await page.click('#btn-share');
  await page.waitForFunction(() => !document.getElementById('share-dialog').hidden, { timeout: 5000 });
  const shareText = await page.$eval('#share-text', (el) => el.textContent);
  assert.ok(/\/r\/[a-z0-9]{8}/.test(shareText) && /WPM/.test(shareText), `share text (${shareText})`);
  await page.waitForFunction(() => { const i = document.getElementById('share-img'); return i.complete && i.naturalWidth === 1200; }, { timeout: 10000 });
  await page.click('#share-copy-link');
  await page.waitForFunction(() => window.__copied !== null, { timeout: 3000 });
  assert.strictEqual(await page.evaluate(() => window.__copied), shareText, 'link copied to the clipboard');
  const shareUrl = shareText.match(/https?:\/\/\S+\/r\/[a-z0-9]+/)[0];
  const sharePage = await (await fetch(shareUrl)).text();
  assert.ok(sharePage.includes('og:image') && sharePage.includes('Tester typed'), 'share page live');
  await shot('03b-share');
  await page.click('#share-close');
  await page.waitForFunction(() => document.getElementById('share-dialog').hidden);
  console.log('✓ share: card rendered (1200px), link copied, /r/ page live');

  // profile on the home page reflects the run once we go back
  const profile = await page.evaluate(() => window.TypeDash.account.stats);
  assert.strictEqual(profile.solo.finished, 1);
  assert.strictEqual(profile.races, 0, 'races untouched');
  assert.strictEqual(profile.streak, 1, 'streak started by a practice run');

  /* ---------------- practice again ---------------- */
  const firstId = await state('S.room.passageId');
  await page.click('#btn-solo-again');
  await page.waitForFunction(() => window.TypeDash.state.room.state === 'countdown' && window.TypeDash.state.room.raceNo === 2);
  assert.notStrictEqual(await state('S.room.passageId'), firstId, 'a different passage the second time');
  assert.ok(await page.$eval('#results', (el) => el.hidden), 'results closed');
  console.log('✓ practice again -> new run with a different passage');

  /* ---------------- leave to home ---------------- */
  await page.click('#btn-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  assert.strictEqual(await state('S.room'), null);
  assert.strictEqual(await page.$eval('#st-races', (el) => el.textContent), '0');
  console.log('✓ leave mid-run returns home, nothing recorded');

  /* ---------------- ghost: race the world record set by the first run ---------------- */
  await page.select('#pacer', 'wr');                              // persisted; the deep link below uses it
  await page.goto('about:blank');
  await page.goto(`${base}/app#practice/${firstId}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.TypeDash && window.TypeDash.state.room && window.TypeDash.state.room.state === 'racing', { timeout: 6000 });
  assert.strictEqual(await page.$eval('.lane.ghost .tag.bot', (el) => el.textContent), 'REPLAY', 'the replay lane is labelled in plain words');
  assert.strictEqual(await page.$eval('.lane.ghost .name', (el) => el.textContent), 'Tester', "the ghost is the record holder's replay");
  const ghostPassage = await state('S.passage');
  await page.keyboard.type(ghostPassage, { delay: 60 });          // slower than the ~300 WPM record: the ghost wins
  await page.waitForFunction(() => !document.getElementById('results').hidden, { timeout: 8000 });
  assert.ok(/they were faster/i.test(await page.$eval('#results-title', (el) => el.textContent)));
  assert.ok(/Tester's run \(\d+ words a min\) was [\d.]+ s faster/.test(await page.$eval('#sr-lines', (el) => el.textContent)), 'replay verdict line');
  assert.ok(await page.$eval('.lane.ghost', (el) => el.classList.contains('finished')), 'replay lane finished');
  console.log('✓ replay: the record holder\'s car ran its timeline and won');
  await shot('07-ghost-results');
  await page.click('#btn-results-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  await page.select('#pacer', 'medium');

  // "beat my ghost" share links: /#practice/<id>/ghost/<accountId> races that account's personal best
  const accountId = await page.evaluate(() => window.TypeDash.account.id);
  await page.goto('about:blank');
  await page.goto(`${base}/app#practice/${firstId}/ghost/${accountId}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.TypeDash && window.TypeDash.state.room && window.TypeDash.state.room.state === 'racing', { timeout: 6000 });
  assert.strictEqual(await page.$eval('.lane.ghost .name', (el) => el.textContent), 'Tester', 'ghost-of-account deep link');
  await page.click('#btn-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  console.log('✓ /#practice/<id>/ghost/<account> races that player\'s ghost');

  /* ---------------- deep link: /#practice/<id> (a cold load, as from a /practice page) ---------------- */
  // English paragraphs open in order: the first run finished paragraph 1, so 2 is open now
  const second = CHAIN[1];
  await page.goto('about:blank');
  await page.goto(`${base}/app#practice/${second.id}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.TypeDash && window.TypeDash.state.room && window.TypeDash.state.room.solo, { timeout: 5000 });
  assert.strictEqual(await state('S.room.passageId'), second.id, 'deep link picked the requested passage');
  assert.ok((await page.$eval('#status', (el) => el.textContent)).includes(second.title), 'status shows the passage title');
  console.log(`✓ /#practice/${second.id} auto-starts that passage`);

  /* ---------------- race the world from practice results ---------------- */
  await page.waitForFunction(() => window.TypeDash.state.room.state === 'racing', { timeout: 5000 });
  const p2 = await state('S.passage');
  await page.keyboard.type(p2, { delay: 34 });
  await page.waitForFunction(() => !document.getElementById('results').hidden, { timeout: 6000 });
  await page.click('#btn-solo-world');
  await page.waitForFunction(() => window.TypeDash.state.room && !window.TypeDash.state.room.solo && window.TypeDash.state.room.state === 'waiting', { timeout: 6000 });
  assert.strictEqual(await page.$eval('#room-type', (el) => el.textContent), 'Ranked');
  console.log('✓ "Race the world" drops straight into public matchmaking');
  await shot('04-lobby');

  /* ---------------- daily challenge ---------------- */
  await page.click('#btn-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  await page.waitForFunction(() => /^#\d+/.test((document.querySelector('#daily-card .daily-head b') || {}).textContent || ''));
  const dailyTitle = await page.$eval('#daily-card .daily-head b', (el) => el.textContent);
  // the rankings are their own page now (/leaderboard); inside the game it opens in the same document
  await page.click('#mainnav a[data-nav="leaderboard"]');
  await page.waitForFunction(() => location.pathname === '/leaderboard' && document.querySelector('#screen-site.active .tab[data-cat="daily"]'), { timeout: 8000 });
  assert.ok(await page.$('#screen-site.active .tab[data-cat="daily"]'), 'Daily tab on the world rankings');
  await page.goBack();
  await page.waitForFunction(() => location.pathname === '/app' && document.getElementById('screen-home').classList.contains('active') && !document.documentElement.dataset.transitioning, { timeout: 8000 });
  // clickable once the page transition has handed the screen back (what a person would wait for too)
  await page.waitForFunction(() => { const b = document.getElementById('btn-daily'); if (!b) return false; const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!hit && b.contains(hit); }, { timeout: 5000 });
  assert.ok(/Have a go/.test(await page.$eval('#btn-daily', (el) => el.textContent)));
  const beforeDaily = await sent();
  await page.click('#btn-daily');
  await page.waitForFunction(() => window.TypeDash.state.room && window.TypeDash.state.room.mode === 'daily' && window.TypeDash.state.room.state === 'racing', { timeout: 6000 });
  assert.strictEqual(await page.$eval('#room-type', (el) => el.textContent), 'Daily');
  const dailyPassage = await state('S.passage');
  const apiDaily = await (await fetch(`${base}/api/daily`)).json();
  assert.strictEqual(dailyPassage, apiDaily.passage.text, "the run uses today's passage");
  assert.deepStrictEqual(await state('S.room.bonusWords'), apiDaily.bonusWords, "and today's golden words");
  await page.keyboard.type(dailyPassage, { delay: 34 });
  await page.waitForFunction(() => !document.getElementById('results').hidden, { timeout: 6000 });
  await page.waitForFunction(() => /this one counted/i.test(document.getElementById('sr-lines').textContent), { timeout: 5000 });
  assert.ok(/#1 of 1 today/.test(await page.$eval('#sr-lines', (el) => el.textContent)), 'ranked #1 of 1');
  assert.ok(/Today's paragraph · #\d+/.test(await page.$eval('#results-title', (el) => el.textContent)));
  await page.waitForFunction(() => /Daily driver/.test(document.getElementById('mr-unlocks').textContent), { timeout: 5000 });
  const afterDaily = await sent();
  assert.strictEqual((afterDaily.progress || 0) - (beforeDaily.progress || 0), 0, 'daily run streamed nothing');
  assert.strictEqual((afterDaily.solo_done || 0) - (beforeDaily.solo_done || 0), 1);
  await shot('05-daily-results');
  await page.click('#btn-results-leave');
  await page.waitForFunction(() => /You:/.test(document.getElementById('daily-card').textContent), { timeout: 5000 });
  assert.ok(/Have another go/.test(await page.$eval('#btn-daily', (el) => el.textContent)), 'card knows today is done');
  assert.ok(/#1/.test(await page.$eval('#daily-card .daily-stats', (el) => el.textContent)), 'card shows my rank');
  console.log(`✓ daily challenge (${dailyTitle}): played from the strip, counted #1, card updated`);
  await shot('06-home-after-daily');

  /* ---------------- language + mode selectors ---------------- */
  await page.waitForFunction(() => document.querySelectorAll('#lang option').length >= 7);
  await page.select('#lang', 'es');
  await page.select('#mode', 'prose');
  await page.click('#btn-solo');
  await page.waitForFunction(() => window.TypeDash.state.room && window.TypeDash.state.room.solo);
  assert.strictEqual(await state('S.room.passageLang'), 'es', 'practice honours the language selector');
  await page.click('#btn-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  await page.select('#mode', 'code');
  await page.select('#lang', 'en');
  await page.click('#btn-solo');
  await page.waitForFunction(() => window.TypeDash.state.room && window.TypeDash.state.room.solo);
  assert.strictEqual(await state('S.room.category'), 'code', 'and the mode selector');
  await page.click('#btn-leave');
  await page.waitForFunction(() => document.getElementById('screen-home').classList.contains('active'));
  await page.select('#mode', 'prose');
  console.log('✓ language and mode selectors drive practice (es prose, en code)');

  /* ---------------- English paragraphs open in order ---------------- */
  {
    const ctx = await browser.createBrowserContext();       // a new visitor
    const lp = await ctx.newPage();
    await lp.setViewport({ width: 1200, height: 900 });
    const errors = [];
    lp.on('pageerror', (e) => errors.push(String(e)));
    lp.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    // the first frame that has the list in it: your own state must already be painted there (no flash of the default)
    await lp.evaluateOnNewDocument(() => {
      const look = () => {
        const li = document.querySelectorAll('[data-chain-list] li[data-n]');
        if (li.length) window.__firstFrame = [...li].slice(0, 3).map((x) => x.dataset.state);
        else if (document.readyState === 'loading') requestAnimationFrame(look);
      };
      requestAnimationFrame(look);
    });
    const cards = () => lp.$$eval('[data-chain-list] li[data-n]', (ls) => ls.slice(0, 3).map((li) => ({ n: li.dataset.n, state: li.dataset.state, hint: li.querySelector('.ps-hint').textContent.replace(/\s+/g, ' ').trim(), unlocking: li.classList.contains('unlocking') })));
    await lp.goto(`${base}/practice/lang/en`, { waitUntil: 'networkidle0' });
    let c = await cards();
    assert.deepStrictEqual(c.map((x) => x.state), ['next', 'locked', 'locked'], 'a new visitor: 1 up next, 2 locked');
    assert.strictEqual(c[1].hint, 'Finish 1 to unlock');
    assert.ok(await lp.$eval('li[data-n="2"] .ps-lock', (el) => getComputedStyle(el).display !== 'none') && await lp.$eval('li[data-n="2"] .ps-go', (el) => getComputedStyle(el).display === 'none'), '2 shows a padlock and cannot be started');
    assert.ok(/^0 of \d+ done$/.test(await lp.$eval('.set-hero .cp-text', (el) => el.textContent)), 'progress, 0 done');

    // type paragraph 1 from its card
    await Promise.all([lp.waitForNavigation({ waitUntil: 'networkidle0' }), lp.click('li[data-n="1"] .ps-go')]);
    await lp.waitForFunction(() => window.TypeDash && window.TypeDash.state.room && window.TypeDash.state.room.state === 'racing', { timeout: 8000 });
    assert.strictEqual(await lp.evaluate(() => window.TypeDash.state.room.passageId), CHAIN[0].id);
    await lp.keyboard.type(await lp.evaluate(() => window.TypeDash.state.passage), { delay: 34 });
    await lp.waitForFunction(() => !document.getElementById('btn-solo-next').hidden, { timeout: 8000 });
    assert.ok(/Paragraph 2 unlocked/.test(await lp.$eval('#sr-lines', (el) => el.textContent)), 'the result says paragraph 2 opened');
    assert.ok(await lp.$eval('#btn-solo-next', (b) => b.classList.contains('primary') && /Next paragraph/.test(b.textContent)), 'Next paragraph is the primary button');
    assert.ok(!(await lp.$eval('#btn-solo-world', (b) => b.classList.contains('primary'))), 'one primary');
    console.log('✓ finishing paragraph 1: "Paragraph 2 unlocked", Next paragraph is the primary button');

    // inside the game the pages paint themselves too: the English card on /practice
    await lp.click('#btn-results-leave');
    await lp.click('#mainnav a[data-nav="practice"]');
    await lp.waitForFunction(() => location.pathname === '/practice' && document.querySelector('#screen-site.active .chain-prog'), { timeout: 8000 });
    assert.ok(/^1 of \d+ done$/.test(await lp.$eval('#screen-site .chain-prog .cp-text', (el) => el.textContent)), 'the English card counts 1 done');

    // back on the set page: 2 opens in front of you
    await lp.goto(`${base}/practice/lang/en`, { waitUntil: 'networkidle0' });
    assert.deepStrictEqual(await lp.evaluate(() => window.__firstFrame), ['done', 'next', 'locked'], 'the first frame with the list already shows your state (no flash)');
    c = await cards();
    assert.deepStrictEqual(c.map((x) => x.state), ['done', 'next', 'locked']);
    assert.ok(c[1].unlocking && c[2].hint === 'Finish 2 to unlock', 'the new one plays its unlock');
    await lp.$eval('li[data-n="2"]', (el) => el.scrollIntoView({ block: 'center' }));
    await lp.waitForFunction(() => document.querySelector('li[data-n="2"]').classList.contains('ps-play'), { timeout: 4000 });
    assert.ok(/^1 of \d+ done$/.test(await lp.$eval('.set-hero .cp-text', (el) => el.textContent)) && /Type paragraph 2/.test(await lp.$eval('[data-chain-cta]', (a) => a.textContent)), 'progress and the way on');
    await shot('08-chain');
    console.log('✓ /practice/lang/en: 1 done, 2 up next (unlocking), 3 locked; progress 1 done');

    // a link to a paragraph you have not opened: the notice, and the one up next
    const locked = CHAIN[5];
    await lp.goto(`${base}/app#practice/${locked.id}`, { waitUntil: 'networkidle0' });
    await lp.waitForFunction(() => !document.getElementById('lock-notice').hidden, { timeout: 6000 });
    const notice = await lp.evaluate(() => ({ title: document.getElementById('ln-title').textContent, text: document.getElementById('ln-text').textContent, go: document.getElementById('ln-go').textContent, room: !!window.TypeDash.state.room }));
    assert.deepStrictEqual(notice, { title: 'Paragraph 6 is locked', text: 'Finish paragraph 2 first.', go: 'Type paragraph 2', room: false }, 'the notice, and nothing started');
    await lp.click('#ln-go');
    await lp.waitForFunction(() => window.TypeDash.state.room && window.TypeDash.state.room.solo, { timeout: 5000 });
    assert.strictEqual(await lp.evaluate(() => window.TypeDash.state.room.passageId), CHAIN[1].id, 'it offers the one up next');
    await lp.click('#btn-leave');

    // and its page keeps the text, with the start button locked
    await lp.goto(`${base}/practice/${locked.id}`, { waitUntil: 'networkidle0' });
    const gate = await lp.$eval('[data-chain-gate]', (g) => ({ state: g.dataset.state, next: g.querySelector('[data-gate-next]').getAttribute('href'), shown: getComputedStyle(g.querySelector('.gate-locked')).display !== 'none', start: getComputedStyle(g.querySelector('.gate-open')).display !== 'none' }));
    assert.deepStrictEqual(gate, { state: 'locked', next: `/app#practice/${CHAIN[1].id}`, shown: true, start: false }, 'locked page: no start, a link to paragraph 2');
    assert.ok((await lp.$eval('.sheet-text', (el) => el.textContent)).length > 50, 'the paragraph itself is still on the page');
    assert.deepStrictEqual(errors, [], 'no console errors');
    await ctx.close();
    console.log(`✓ a link to paragraph 6 shows the lock notice and offers paragraph 2; its page keeps the text, start locked`);
  }

  /* ---------------- teams: create, then a friend joins from the invite link ---------------- */
  await page.evaluate(() => { location.hash = '#/team'; });   // an old in-game address still lands on the page
  await page.waitForFunction(() => document.getElementById('screen-team').classList.contains('active') && !document.documentElement.dataset.transitioning);
  await page.waitForSelector('#team-create-form');
  assert.strictEqual(await page.evaluate(() => location.pathname), '/app/team', 'the old #/team address moves to /app/team');
  assert.deepStrictEqual(await page.$$eval('main > .screen.active', (els) => els.map((e) => e.id)), ['screen-team'], 'module pages show one at a time');
  await page.type('#team-create-form input[name=name]', 'Speed Demons');
  await page.type('#team-create-form input[name=tag]', 'spd');
  await page.click('#team-create-form button[type=submit]');
  await page.waitForFunction(() => /\[SPD\]/.test(document.getElementById('team-card').textContent), { timeout: 5000 });
  assert.ok(/1\/\d+ members/.test(await page.$eval('#team-card', (el) => el.textContent)), 'team card shows the new team');
  const invite = Object.values(teams.data)[0].invite;
  const friend = await browser.createBrowserContext();       // a different browser = a different account
  const friendPage = await friend.newPage();
  await friendPage.goto(`${base}/app#team/${invite}`, { waitUntil: 'networkidle0' });
  await friendPage.waitForFunction(() => /\[SPD\]/.test(document.getElementById('team-card').textContent), { timeout: 6000 });
  assert.ok(/2\/\d+ members/.test(await friendPage.$eval('#team-card', (el) => el.textContent)), 'friend joined from the invite link');
  await friend.close();
  console.log('✓ teams: created from the profile card; a friend joined through /#team/<code>');

  /* ---------------- the chrome: every page from the navbar, back/forward, deep links ---------------- */
  {
    const ctx = await browser.createBrowserContext();
    const nav = await ctx.newPage();
    await nav.setViewport({ width: 1280, height: 860 });
    const errors = [];
    nav.on('pageerror', (e) => errors.push(String(e)));
    nav.on('console', (m) => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(m.text()); });
    const settled = () => nav.waitForFunction(() => !document.documentElement.dataset.transitioning, { timeout: 8000 });
    await nav.goto(`${base}/app`, { waitUntil: 'networkidle0' });
    const items = await nav.$$eval('#mainnav a[data-nav]', (as) => as.map((a) => [a.dataset.nav, a.getAttribute('href')]));
    assert.deepStrictEqual(items.map((i) => i[1]), ['/', '/practice', '/daily', '/leaderboard', '/how'], 'navbar lists every page');
    assert.strictEqual(await nav.$('#topbar .you-pill, #topbar #level-pill'), null, 'no level chip in the bar');
    assert.ok(await nav.$eval('#acct .acct-signin', (a) => a.getAttribute('href') === '/app/signin' && /Sign in/.test(a.textContent)), 'a guest sees Sign in');
    for (const [key, href] of items) {
      await nav.click(`#mainnav a[data-nav="${key}"]`);
      await nav.waitForFunction((h, k) => location.pathname === h && document.getElementById('screen-site').classList.contains('active') && document.getElementById('screen-site').dataset.page === k, { timeout: 8000 }, href, key);
      await settled();
      assert.strictEqual(await nav.$eval(`#mainnav a[data-nav="${key}"]`, (a) => a.getAttribute('aria-current')), 'page', `${href} is marked in the navbar`);
      assert.strictEqual(await nav.$$eval('#mainnav [aria-current="page"]', (as) => as.length), 1, 'one active item');
    }
    await nav.goBack(); await nav.waitForFunction(() => location.pathname === '/leaderboard', { timeout: 8000 }); await settled();
    assert.strictEqual(await nav.$eval('#mainnav a[data-nav="leaderboard"]', (a) => a.getAttribute('aria-current')), 'page', 'back lands on the previous page, marked');
    await nav.goForward(); await nav.waitForFunction(() => location.pathname === '/how', { timeout: 8000 }); await settled();
    await nav.goto(`${base}/app/garage`, { waitUntil: 'networkidle0' });
    assert.ok(await nav.$eval('#screen-garage', (el) => el.classList.contains('active')), 'deep link /app/garage opens the garage');
    await nav.goto(`${base}/leaderboard`, { waitUntil: 'networkidle0' });
    assert.ok(await nav.$eval('#acct .acct-signin', () => true) && await nav.$eval('.site-foot .tdf-back', (a) => /Back to Cortexis/.test(a.textContent)), 'server pages get the same navbar and footer');
    assert.strictEqual(await nav.$eval('#mainnav a[data-nav="leaderboard"]', (a) => a.getAttribute('aria-current')), 'page');
    assert.deepStrictEqual(errors, [], 'no console errors while moving around');
    await ctx.close();
    console.log('✓ navbar: every page opens, one active item, back/forward and deep links work, same chrome on server pages');
  }

  /* ---------------- sign-in page and the signed-in account menu ---------------- */
  {
    process.env.CORTEXIS_API_URL = base;                     // the website API is played by this test (same origin)
    const cx = require('../server/cx.js');
    const ctx = await browser.createBrowserContext();
    const si = await ctx.newPage();
    await si.setViewport({ width: 1280, height: 860 });
    await si.setRequestInterception(true);
    const logins = [];
    si.on('request', (req) => {
      const url = new URL(req.url());
      if (url.pathname === '/api/auth/login' && req.method() === 'POST') {
        const body = JSON.parse(req.postData() || '{}');
        logins.push(body.email);
        if (body.password !== 'right-password') return req.respond({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid email or password' }) });
        return req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'site-session', user: { id: 777, name: 'Umair Naseer' } }) });
      }
      if (url.pathname === '/api/auth/game-token' && req.method() === 'POST') {
        return req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: cx.signGameToken({ sub: '777', name: 'Umair Naseer' }), user: { id: 777, name: 'Umair Naseer' }, expiresIn: 600 }) });
      }
      return req.continue();
    });
    await si.goto(`${base}/app`, { waitUntil: 'networkidle0' });
    await si.click('#acct .acct-signin');
    await si.waitForFunction(() => location.pathname === '/app/signin' && document.getElementById('screen-signin').classList.contains('active') && !document.documentElement.dataset.transitioning, { timeout: 8000 });
    const page1 = await si.evaluate(() => ({
      primary: document.getElementById('si-submit').textContent.trim(),
      signup: document.getElementById('si-signup').href,
      guest: document.getElementById('si-guest').textContent.trim(),
      country: document.getElementById('si-country').value,
      active: document.querySelector('#acct .acct-signin').getAttribute('aria-current'),
    }));
    assert.strictEqual(page1.primary, 'Sign in with Cortexis');
    assert.ok(/\/signup$/.test(page1.signup), `Create a Cortexis account links to the website signup (${page1.signup})`);
    assert.strictEqual(page1.guest, 'Play as guest');
    assert.ok(/^[A-Z]{2}$/.test(page1.country), 'country is prefilled');
    assert.strictEqual(page1.active, 'page', 'Sign in is marked while on the sign-in page');
    await si.type('#si-email', 'umair@example.com');
    await si.type('#si-password', 'wrong');
    await si.click('#si-submit');
    await si.waitForFunction(() => !document.getElementById('si-error').hidden, { timeout: 5000 });
    assert.ok(/do not match/.test(await si.$eval('#si-error', (el) => el.textContent)), 'a wrong password says so, in place');
    await si.click('#si-password', { clickCount: 3 });
    await si.type('#si-password', 'right-password');
    await si.click('#si-submit');
    await si.waitForFunction(() => location.pathname === '/app' && document.getElementById('acct-btn'), { timeout: 8000 });
    await si.waitForFunction(() => /Umair/.test(document.getElementById('acct-btn').textContent));
    assert.ok(await si.$eval('#guest-note', (el) => el.hidden), 'the guest line goes once signed in');
    await si.waitForFunction(() => !document.documentElement.dataset.transitioning);
    await si.click('#acct-btn');
    const menu = await si.$eval('#acct-menu', (m) => ({ hidden: m.hidden, text: m.textContent.replace(/\s+/g, ' ') }));
    assert.ok(!menu.hidden && /Your stats/.test(menu.text) && /Change country/.test(menu.text) && /Sign out/.test(menu.text), `account menu: ${menu.text}`);
    await si.click('#acct-menu [data-act="country"]');
    await si.waitForFunction(() => location.pathname === '/app/profile' && document.activeElement && document.activeElement.id === 'country', { timeout: 8000 });
    assert.ok(/Signed in with Cortexis/.test(await si.$eval('#id-status', (el) => el.textContent)), 'your stats page says how you are signed in');
    await si.waitForFunction(() => !document.documentElement.dataset.transitioning);
    await si.click('#acct-btn');
    await si.click('#acct-menu [data-act="signout"]');
    await si.waitForFunction(() => document.querySelector('#acct .acct-signin'), { timeout: 5000 });
    assert.deepStrictEqual(logins, ['umair@example.com', 'umair@example.com']);
    await si.goto(`${base}/app/signin`, { waitUntil: 'networkidle0' });
    await si.click('#si-guest');
    await si.waitForFunction(() => location.pathname === '/app' && localStorage.getItem('td_guest_ok') === '1', { timeout: 8000 });
    await ctx.close();
    delete process.env.CORTEXIS_API_URL;
    console.log('✓ sign-in page: wrong password said in place, Cortexis sign-in lands in the game, account menu, change country, sign out, play as guest');
  }

  /* ---------------- an unknown address opens the game once, never a reload loop ---------------- */
  const stray = await (await browser.createBrowserContext()).newPage();
  let loads = 0;
  stray.on('load', () => { loads++; });
  await stray.goto(`${base}/no-such-page`, { waitUntil: 'load' });
  await wait(1500);
  assert.strictEqual(loads, 1, `unknown path loaded ${loads} times (a reload loop)`);
  assert.strictEqual(await stray.evaluate(() => location.pathname), '/app', 'unknown path settles on the game');
  await stray.browserContext().close();
  console.log('✓ unknown address: the game opens once (no reload loop)');

  assert.deepStrictEqual(pageErrors, [], 'no console/page errors');
  await browser.close();
  console.log('\nALL BROWSER TESTS PASSED');
  process.exit(0);
})().catch(async (e) => { console.error('\nTEST FAILED:', e); process.exit(1); });
