/* The page routes: deep links, path clean-up, and the old one-page #hash and
   invite links, which must keep landing on the right page. Run via npm test. */
import assert from 'node:assert';
import { ROUTES, NOT_FOUND, normalize, match, resolveHash } from '../public/js/routes.js';

const paths = ROUTES.map((r) => r.path);
assert.deepStrictEqual(paths, ['/', '/play-with-friends', '/how-it-works', '/rankings', '/achievements', '/progress', '/rivals', '/under-the-hood', '/sign-in']);
assert.strictEqual(new Set(ROUTES.map((r) => r.id)).size, ROUTES.length, 'one section per route');
for (const [raw, want] of [['/Rankings/', '/rankings'], ['/index.html', '/'], ['', '/'], ['//how-it-works//', '/how-it-works'], ['/progress?x=1', '/progress']]) assert.strictEqual(normalize(raw), want, raw);
assert.strictEqual(match('/PROGRESS').id, 'page-progress');
assert.strictEqual(match('/nope'), null);
assert.ok(NOT_FOUND.id === 'page-404');
console.log(`✓ routes: ${paths.length} pages, paths normalised`);

const cases = [
  ['#play-now', null, { path: '/', flash: '#btn-quick' }],
  ['#how-it-works', null, { path: '/how-it-works' }],
  ['#under-the-hood', null, { path: '/under-the-hood' }],
  ['#home-panel', null, { path: '/progress' }],
  ['#home-panel', 'boards', { path: '/rankings' }],
  ['#home-panel', 'ach', { path: '/achievements' }],
  ['#home-panel', 'rivals', { path: '/rivals' }],
  ['#top', null, { path: '/' }],
  ['#K7QXP', null, { path: '/play-with-friends', code: 'K7QXP' }],
  ['#k7qxp', null, { path: '/play-with-friends', code: 'K7QXP' }],
  ['#main', null, null],            // the skip link is not a room code (codes never contain I or O)
  ['#rivals', null, { path: '/rivals' }],
  ['#sign-in', null, { path: '/sign-in' }],
  ['#%E0%A4%A', null, null],
  ['', null, null],
];
for (const [hash, tab, want] of cases) assert.deepStrictEqual(resolveHash(hash, tab), want, `${hash} (${tab})`);
console.log(`✓ old links: ${cases.length} #hash and invite forms resolve to their pages`);

// the server answers every page path with the app, and serves the page's photo as WebP
process.env.PORT = '0';
process.env.DATA_FILE ||= '/tmp/gotcha-test/routes.json';
const { server } = await import('../server/index.js');
await new Promise((r) => (server.listening ? r() : server.once('listening', r)));
const base = `http://localhost:${server.address().port}`;
for (const p of [...paths, '/rankings/', '/no/such/page']) {
  const res = await fetch(base + p);
  assert.strictEqual(res.status, 200, p);
  assert.ok((await res.text()).includes('id="pages"'), `${p} serves the app`);
}
// every page is reachable from the header nav (wide screens show the last four under "More"), the phone
// menu and the footer; signing in lives on the account control instead of the page links
const html = await (await fetch(base + '/')).text();
const navHtml = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
const sheetHtml = html.match(/<nav class="sheet-nav"[\s\S]*?<\/nav>/)[0];
const footHtml = html.match(/<nav class="foot-links"[\s\S]*?<\/nav>/)[0];
const pagePaths = paths.filter((x) => x !== '/sign-in');
for (const p of pagePaths) assert.ok(navHtml.includes(`href="${p}"`), `header nav links ${p}`);
for (const p of pagePaths) assert.ok(sheetHtml.includes(`href="${p}"`), `phone menu links ${p}`);
for (const p of paths) assert.ok(footHtml.includes(`href="${p}"`), `footer links ${p}`);
assert.ok(/<a class="acct-signin" href="\/sign-in"/.test(html), 'the header offers Sign in');
assert.ok(!/id="level-pill"|class="id-chip"/.test(html), 'no guest/level chip in the header');
assert.ok(!/<section id="screen-home"[\s\S]*?<input[\s\S]*?<\/section>/.test(html.match(/<section id="screen-home"[\s\S]*?<\/section>/)[0]), 'no identity fields on the home page');
console.log(`✓ nav: ${pagePaths.length} pages in the header and phone menu, ${paths.length} in the footer, Sign in on the account control`);
const img = await fetch(`${base}/img/friends-720.webp`);
assert.strictEqual(img.headers.get('content-type'), 'image/webp');
console.log('✓ server: every page path serves the app, photos as image/webp');
console.log('\nROUTE TESTS PASSED');
process.exit(0);
