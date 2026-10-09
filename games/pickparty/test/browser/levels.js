'use strict';
// Match length: 1, 2 or 3 topics. Chosen on Home (remembered), mirrored on
// Categories, it caps the picks and the lobby plays exactly that many.
const assert = require('assert');
const { run } = require('./_lib');

run('match length', async ({ page, shot }) => {
  const p = await page();
  assert.strictEqual(await p.$eval('#home #rounds [aria-checked="true"]', (b) => b.dataset.rounds), '3', 'three topics is the default');
  await p.click('#home #rounds [data-rounds="1"]');
  await p.click('#home article.mode[data-mode="crowd"] a.btn');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  assert.strictEqual(await p.$eval('#categories #rounds-cats [aria-checked="true"]', (b) => b.dataset.rounds), '1', 'the length carries over to Categories');
  await p.fill('#cat-search', 'candy');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Candy")');
  await p.fill('#cat-search', 'fruit');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Fruit")');
  const chips = await p.$$eval('#picks-bar .pick-chip', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
  assert.ok(chips.length === 1 && /Candy/.test(chips[0]), 'a one-topic match takes one pick and no random slot: ' + JSON.stringify(chips));
  await shot(p, 'one-topic-picks');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#lobby:not([hidden])');
  await p.waitForFunction(() => document.querySelectorAll('.lobby-topics .topic-slot').length === 1, null, { timeout: 3000 });
  assert.ok(/Candy/.test(await p.$eval('.lobby-topics', (e) => e.textContent)), 'the lobby plays just that topic');
  await shot(p, 'one-topic-lobby');
  await p.click('#t-leave');
  await p.waitForSelector('#home:not([hidden])');
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => document.querySelector('#conn')?.textContent === 'Online');
  assert.strictEqual(await p.$eval('#home #rounds [aria-checked="true"]', (b) => b.dataset.rounds), '1', 'the length is remembered across reloads');
});
