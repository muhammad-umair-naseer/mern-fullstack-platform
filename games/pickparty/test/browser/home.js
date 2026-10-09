'use strict';
// Home page entries for the Auction mode: the mode card leads to Categories
// with Auction preselected, the play sheet offers it when no mode is chosen,
// and the Friends page offers it for private tables.
const assert = require('assert');
const { run } = require('./_lib');

run('home auction entries', async ({ page, shot }) => {
  const p = await page();
  assert.ok(await p.$('#home article.mode[data-mode="auction"] a.btn[href="#/categories/auction"]'), 'home has an Auction card leading to Categories');
  await p.click('nav.sitenav a[href="#/friends"]');
  await p.waitForSelector('#friends:not([hidden])');
  const seg = await p.$$eval('#friends [data-newmode]', (els) => els.map((e) => e.dataset.newmode));
  assert.ok(seg.includes('auction'), 'friends segment offers Auction: ' + JSON.stringify(seg));
  await p.click('nav.sitenav a[href="#/categories"]');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  await p.fill('#cat-search', 'rappers');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Rappers")');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#play[open]');
  assert.ok(await p.$('#play [data-play="quick-auction"]'), 'play sheet offers an Auction quick match');
  await shot(p, 'play-sheet');
  await p.click('#play [data-play="quick-auction"]');
  await p.waitForSelector('#lobby:not([hidden])');
  const sub = await p.$eval('#t-sub', (e) => e.textContent.trim());
  assert.ok(/^Auction/.test(sub), 'lobby subtitle names the mode: ' + sub);
  await p.waitForFunction(() => /Rappers/.test(document.querySelector('.lobby-topics')?.textContent || ''), null, { timeout: 3000 });
  const how = await p.$eval('#lobby .how', (e) => e.textContent);
  assert.ok(/20 coins/.test(how), 'lobby explains the auction rules: ' + how.slice(0, 80));
  await shot(p, 'auction-lobby');
});
