'use strict';
// Culture setting: Desi, Global or Mix. It lives on Home and Categories, is
// remembered in the browser, filters the category grid, and a quick match
// started under it draws only from that pool and says so in the lobby.
const assert = require('assert');
const { run } = require('./_lib');

run('culture setting', async ({ page, shot, base }) => {
  const bank = await (await fetch(base + '/api/bank')).json();
  const pool = (keep) => bank.topics.filter((t) => keep.includes(t.c)).length;
  const p = await page();
  const def = await p.$eval('#home #culture [aria-checked="true"]', (b) => b.dataset.culture);
  assert.strictEqual(def, 'mix', 'mix is the default');
  const desiBtn = p.locator('#home #culture [data-culture="desi"]');
  await desiBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(async (e) => { await shot(p, 'culture-not-visible'); throw e; });
  await desiBtn.click();
  await shot(p, 'home-desi');
  await p.click('nav.sitenav a[href="#/categories"]');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat');
  assert.strictEqual(await p.$eval('#categories #culture-cats [aria-checked="true"]', (b) => b.dataset.culture), 'desi', 'the choice carries over to Categories');
  await p.click('#cats-more');
  const counts = {};
  for (const c of ['desi', 'global', 'mix']) {
    await p.click(`#categories #culture-cats [data-culture="${c}"]`);
    counts[c] = await p.$$eval('#cat-grid .cat:not([hidden]):not(.cat-surprise)', (els) => els.length);
  }
  assert.deepStrictEqual(counts, { desi: pool('dn'), global: pool('gn'), mix: bank.topics.length }, 'the grid shows each culture\'s pool: ' + JSON.stringify(counts));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => document.querySelector('#conn')?.textContent === 'Online');
  await p.click('nav.sitenav a[href="#/"]');
  await p.waitForSelector('#home:not([hidden])');
  assert.strictEqual(await p.$eval('#home #culture [aria-checked="true"]', (b) => b.dataset.culture), 'mix', 'the last choice is remembered across reloads');
  // a desi quick match: Surprise me draws only desi or neutral packs and the lobby says Desi
  await p.click('#home #culture [data-culture="desi"]');
  await p.click('#home article.mode[data-mode="crowd"] a.btn');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat-surprise');
  await p.click('#cat-grid .cat-surprise');
  await p.waitForSelector('#lobby:not([hidden])');
  await p.waitForFunction(() => document.querySelectorAll('.lobby-topics .topic-slot').length === 3, null, { timeout: 3000 });
  const tag = await p.$eval('#lobby .culture-tag', (e) => e.textContent.trim());
  assert.ok(/Desi/.test(tag), 'lobby shows the culture: ' + tag);
  const slotTitles = await p.$$eval('.lobby-topics .topic-slot b', (els) => els.map((e) => e.textContent.trim()));
  const byTitle = Object.fromEntries(bank.topics.map((t) => [t.t, t.c]));
  assert.ok(slotTitles.every((t) => 'dn'.includes(byTitle[t])), 'every topic drawn is desi or neutral: ' + JSON.stringify(slotTitles));
  await shot(p, 'desi-lobby');
});
