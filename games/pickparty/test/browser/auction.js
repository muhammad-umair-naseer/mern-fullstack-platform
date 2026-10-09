'use strict';
// Auction table: open a Comfort food table in Auction mode with two bots,
// bid through the block, see your bid lead, see a sale land with its price.
const assert = require('assert');
const { run } = require('./_lib');

run('auction table', async ({ page, shot }) => {
  const p = await page();
  await p.click('nav.sitenav a[href="#/categories"]');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  await p.fill('#cat-search', 'pizza');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Pizza toppings")');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#play[open]');
  await p.click('#play [data-play="create"]');
  await p.waitForSelector('#lobby:not([hidden])');
  await p.click('#lobby [data-act="mode"][data-mode="auction"]');
  await p.waitForFunction(() => /Auction/.test(document.querySelector('#t-sub')?.textContent || ''), null, { timeout: 3000 });
  await p.click('[data-act="bot"]'); await p.click('[data-act="bot"]');
  await p.waitForFunction(() => document.querySelectorAll('.lobby-seat:not(.empty)').length === 3, null, { timeout: 3000 });
  await p.click('[data-act="start"]');

  await p.waitForSelector('#tray.block', { timeout: 15000 });
  assert.ok(await p.$('.tile.is-lot'), 'the current lot glows on the board');
  const faceDown = await p.$$eval('#board .tile.is-facedown', (els) => ({ n: els.length, named: els.filter((e) => /[A-Za-z]{3,}/.test(e.textContent)).length }));
  assert.deepStrictEqual(faceDown, { n: 15, named: 0 }, 'the fifteen lots still to come are face-down with no names: ' + JSON.stringify(faceDown));
  const amounts = await p.$$eval('#tray.block [data-bid]', (els) => els.map((b) => Number(b.dataset.bid)));
  assert.ok(amounts.length >= 1 && amounts[0] === 1, 'first bid button opens at 1: ' + JSON.stringify(amounts));
  await p.click('#tray.block [data-bid]:not([disabled])');
  await p.waitForFunction(() => /You lead at \d+/.test(document.querySelector('#ticker-msg')?.textContent || ''), null, { timeout: 5000 });
  await shot(p, 'block');
  // on a lot with a picture, the block shows it with a credit toggle
  await p.waitForFunction(() => document.querySelector('#tray.block .block-art .art.has-img img')?.naturalWidth > 0 || document.querySelector('#tray.block .art-credit-btn') === null, null, { timeout: 20000 }).catch(() => {});
  const creditBtn = await p.$('#tray.block .art-credit-btn');
  if (creditBtn) {
    await creditBtn.click();
    const credit = await p.$eval('#tray.block .art-credit', (e) => ({ hidden: e.hidden, text: e.textContent }));
    assert.ok(!credit.hidden && /Photo: .+, .+, via Wikimedia Commons/.test(credit.text), 'credit toggle reveals author and licence: ' + JSON.stringify(credit));
    await shot(p, 'block-credit');
  }
  const purse = await p.$eval('#tray.block .block-purse', (e) => e.textContent);
  assert.ok(/\d+/.test(purse), 'block shows your purse: ' + purse);

  await p.waitForSelector('.lineups .mini .price', { timeout: 40000 });
  const price = await p.$eval('.lineups .mini .price', (e) => e.textContent.trim());
  assert.ok(/^\d+$/.test(price), 'lineup card carries its price: ' + price);
  const tilePrice = await p.$eval('.tile.is-taken .tile-price', (e) => e.textContent.trim());
  assert.strictEqual(tilePrice, price, 'sold tile shows the same price');
  const coins = await p.$$eval('.lineups .seat-score small', (els) => els.map((e) => e.textContent));
  assert.ok(coins.every((t) => /coins/.test(t)), 'every seat shows its purse: ' + JSON.stringify(coins));
  await shot(p, 'sold');

  // the reveal: every row's total is its card values plus pocket change
  await p.waitForSelector('.auction-reveal', { timeout: 90000 });
  await p.waitForFunction(() => document.querySelectorAll('.auction-reveal .ar-row.is-shown').length === 3, null, { timeout: 10000 });
  const rows = await p.$$eval('.auction-reveal .ar-row', (els) => els.map((r) => ({
    total: Number(r.dataset.total),
    cards: [...r.querySelectorAll('.ar-card')].map((c) => Number(c.dataset.value)),
    change: Number(r.querySelector('.ar-change').dataset.change),
  })));
  assert.strictEqual(rows.length, 3, 'one reveal row per seat');
  for (const row of rows) assert.strictEqual(row.total, row.cards.reduce((x, y) => x + y, 0) + row.change, 'row total = values + change: ' + JSON.stringify(row));
  assert.ok(await p.$('#sheet .ar-winner'), 'the reveal names the topic winner');
  await shot(p, 'reveal');
});
