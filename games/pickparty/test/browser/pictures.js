'use strict';
// Item pictures: a solo Pizza toppings board shows photos where the bank has
// them, keeps the emoji where it doesn't, and falls back to the emoji when a
// picture fails to load.
const assert = require('assert');
const { run } = require('./_lib');

run('item pictures', async ({ page, shot }) => {
  const p = await page();
  await p.click('nav.sitenav a[href="#/categories"]');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  await p.fill('#cat-search', 'pizza');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Pizza toppings")');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#play[open]');
  await p.click('#play [data-play="solo"]');
  await p.waitForSelector('#solo:not([hidden])');
  await p.waitForFunction(() => document.querySelectorAll('#s-board .tile').length === 16, null, { timeout: 8000 });
  await p.waitForFunction(() => [...document.querySelectorAll('#s-board .tile .art.has-img img')].some((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 });
  const counts = await p.evaluate(() => ({
    withImg: document.querySelectorAll('#s-board .tile .art.has-img img').length,
    emojiOnly: [...document.querySelectorAll('#s-board .tile .art:not(.has-img) .art-emoji')].filter((e) => e.textContent.trim()).length,
    total: document.querySelectorAll('#s-board .tile .art').length,
  }));
  assert.strictEqual(counts.total, 16, 'every tile has an art area');
  assert.ok(counts.withImg >= 1 && counts.emojiOnly >= 1, 'photos where available, emoji elsewhere: ' + JSON.stringify(counts));
  await shot(p, 'pizza-board');
  // once pictures have loaded, a re-render must not flash them back to emoji
  await p.waitForFunction(() => [...document.querySelectorAll('#s-board .tile .art img')].every((i) => i.complete), null, { timeout: 20000 });
  const flash = await p.evaluate(() => {
    const count = () => document.querySelectorAll('#s-board .tile .art.has-img').length;
    const before = count();
    document.querySelector('#s-board .tile').click(); // selecting a card re-renders the whole board
    return { before, after: count() };
  });
  assert.ok(flash.before >= 1 && flash.after === flash.before, 'loaded pictures stay in picture mode across a re-render: ' + JSON.stringify(flash));
  // a picture that fails to load falls back to the emoji
  await p.evaluate(() => { const img = document.querySelector('#s-board .tile .art.has-img img'); img.src = 'https://upload.wikimedia.org/does-not-exist-' + Date.now() + '.jpg'; });
  await p.waitForFunction(() => document.querySelectorAll('#s-board .tile .art.has-img img').length < 16 && [...document.querySelectorAll('#s-board .tile .art')].some((a) => !a.classList.contains('has-img') && a.querySelector('img')), null, { timeout: 5000 });
});
