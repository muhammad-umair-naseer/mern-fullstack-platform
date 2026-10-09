'use strict';
// Pages and navigation: a clean home, five routed pages with working back
// navigation, mode cards that preselect a mode on Categories, Friends with
// invite links, Profile editing in place, and a tab bar on phones.
const assert = require('assert');
const { run } = require('./_lib');

run('pages and navigation', async ({ page, shot, base }) => {
  const p = await page();
  assert.ok(await p.$('#home article.mode[data-mode="auction"]'), 'home has the Auction mode card');
  assert.strictEqual(await p.$eval('#home', (h) => !!h.querySelector('#cat-grid, #rank-list, #ach-grid, #join-form')), false, 'home carries no category grid, rankings, achievements or join form');
  const links = await p.$$eval('nav.sitenav a', (as) => as.map((a) => a.getAttribute('href')));
  assert.deepStrictEqual(links, ['#/', '#/categories', '#/friends', '#/rankings', '#/profile'], 'five nav links: ' + JSON.stringify(links));
  await shot(p, 'home');

  // categories via the nav, back returns home
  await p.click('nav.sitenav a[href="#/categories"]');
  await p.waitForSelector('#categories:not([hidden]) #cat-grid .cat', { timeout: 5000 });
  assert.strictEqual(new URL(p.url()).hash, '#/categories', 'route in the address bar');
  assert.ok(await p.$eval('nav.sitenav a[href="#/categories"]', (a) => a.getAttribute('aria-current') === 'page'), 'active link is marked');
  await shot(p, 'categories');
  await p.goBack();
  await p.waitForSelector('#home:not([hidden])');

  // rankings and profile pages; profile edits in place
  await p.click('nav.sitenav a[href="#/rankings"]');
  await p.waitForSelector('#rankings:not([hidden]) #rank-list');
  await shot(p, 'rankings');
  await p.click('nav.sitenav a[href="#/profile"]');
  await p.waitForSelector('#profile:not([hidden]) #pf-name');
  await p.fill('#pf-name', 'Navi');
  await p.click('#pf-save');
  await p.waitForFunction(() => document.querySelector('#me-name')?.textContent === 'Navi', null, { timeout: 3000 });
  assert.ok(await p.$('#profile #ach-grid li'), 'achievements live on the profile page');
  await shot(p, 'profile');

  // a mode card preselects its mode on Categories; a category then starts that game
  await p.click('nav.sitenav a[href="#/"]');
  await p.waitForSelector('#home:not([hidden])');
  await p.click('#home article.mode[data-mode="auction"] a.btn');
  await p.waitForSelector('#categories:not([hidden])');
  assert.strictEqual(new URL(p.url()).hash, '#/categories/auction');
  assert.strictEqual(await p.$eval('#cat-mode [aria-checked="true"]', (b) => b.dataset.mode), 'auction', 'mode preselected');
  await p.fill('#cat-search', 'rappers');
  await p.click('#cat-grid .cat:not([hidden]):has-text("Rappers")');
  await p.click('#picks-bar [data-act="play"]');
  await p.waitForSelector('#lobby:not([hidden])', { timeout: 5000 });
  assert.ok(/^Auction/.test(await p.$eval('#t-sub', (e) => e.textContent.trim())), 'landed in an auction lobby');
  await p.click('#t-leave');
  await p.waitForSelector('#home:not([hidden])');

  // friends page: start a table; a guest's invite link lands in that lobby
  await p.click('nav.sitenav a[href="#/friends"]');
  await p.waitForSelector('#friends:not([hidden]) #create-btn');
  await p.click('#friends [data-newmode="mind"]');
  await p.click('#create-btn');
  await p.waitForSelector('#lobby:not([hidden])');
  const code = await p.$eval('.lobby-code b', (b) => b.textContent.trim());
  const guest = await page();
  await guest.goto(`${base}/?join=${code}`, { waitUntil: 'domcontentloaded' });
  await guest.waitForSelector('#lobby:not([hidden])', { timeout: 8000 });
  assert.strictEqual(await guest.$eval('.lobby-code b', (b) => b.textContent.trim()), code, 'invite link joins the table');
  await shot(p, 'friends-lobby');

  // phones get a bottom tab bar instead of top links
  const ph = await page({ width: 390, height: 844 });
  const vis = await ph.evaluate(() => ({ tabbar: getComputedStyle(document.querySelector('nav.tabbar')).display !== 'none', toplinks: getComputedStyle(document.querySelector('nav.sitenav')).display !== 'none', scrollW: document.documentElement.scrollWidth, innerW: innerWidth }));
  assert.ok(vis.tabbar && !vis.toplinks && vis.scrollW <= vis.innerW, 'phone shows the tab bar, hides top links, no overflow: ' + JSON.stringify(vis));
  await shot(ph, 'phone-home');
});
