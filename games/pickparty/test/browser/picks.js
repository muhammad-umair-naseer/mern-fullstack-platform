'use strict';
// Pick all three topics: on Categories with a mode chosen, taps select up to
// three categories in order, a picks bar shows them, and Play opens a lobby
// whose topic list is exactly those three.
const assert = require('assert');
const { run } = require('./_lib');

run('pick all three topics', async ({ page, shot }) => {
  const p = await page();
  await p.click('#home article.mode[data-mode="auction"] a.btn');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  for (const name of ['Rappers', 'NBA players', 'Anime shows']) {
    await p.fill('#cat-search', name.toLowerCase().slice(0, 5));
    await p.click(`#cat-grid .cat:not([hidden]):has-text("${name}")`);
  }
  await p.fill('#cat-search', '');
  const badges = await p.$$eval('#cat-grid .cat .cat-no', (els) => els.map((e) => e.closest('.cat').querySelector('b').textContent + '=' + e.textContent));
  assert.deepStrictEqual(badges.sort(), ['Anime shows=3', 'NBA players=2', 'Rappers=1'].sort(), 'selected cards are numbered in pick order: ' + JSON.stringify(badges));
  const chips = await p.$$eval('#picks-bar .pick-chip', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
  assert.strictEqual(chips.length, 3, 'picks bar lists the three picks: ' + JSON.stringify(chips));
  // a fourth tap is refused, tapping a selected card removes it, and the next pick takes the freed slot
  await p.fill('#cat-search', 'candy');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Candy")');
  assert.strictEqual(await p.$$eval('#picks-bar .pick-chip', (els) => els.length), 3, 'no fourth pick');
  await p.fill('#cat-search', 'nba');
  await p.click('#cat-grid .cat:not([hidden]):has-text("NBA players")');
  await p.fill('#cat-search', 'candy');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Candy")');
  await p.fill('#cat-search', '');
  const order = await p.$$eval('#picks-bar .pick-chip', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
  assert.ok(/Rappers/.test(order[0]) && /Anime/.test(order[1]) && /Candy/.test(order[2]), 'removing a pick shifts the others up: ' + JSON.stringify(order));
  await shot(p, 'picks-bar');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#lobby:not([hidden])');
  await p.waitForFunction(() => document.querySelectorAll('.lobby-topics .topic-slot').length === 3, null, { timeout: 3000 });
  const slots = await p.$$eval('.lobby-topics .topic-slot', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
  assert.ok(/Rappers/.test(slots[0]) && /Anime shows/.test(slots[1]) && /Candy/.test(slots[2]), 'the lobby plays exactly the three picks in order: ' + JSON.stringify(slots));
  assert.ok(/^Auction/.test(await p.$eval('#t-sub', (e) => e.textContent.trim())), 'in the chosen mode');
  await shot(p, 'lobby');
});
