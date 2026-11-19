import assert from 'node:assert/strict';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import puppeteer from 'puppeteer-core';
import { POSTS } from '../src/data/blog.generated.js';
import { parseBlogContent } from '../src/lib/blogParser.js';

const slug = 'gta-6-how-to-play-pc-requirements-price';
const canonical = `https://cortexissolutionhub.com/blog/${slug}`;
const referrers = ['are-gpu-prices-going-to-drop-after-nvidia-controversy', 'free-coding-games-in-your-browser', 'sketch-and-guess-online-drawing-game'];
const post = POSTS.find(p => p.slug === slug);
const output = resolve(process.env.GTA_AUDIT_OUTPUT || '../../release-gta6-2026-11-18');
await mkdir(output, { recursive: true });
// CSS is checked by Chromium below; jsdom cannot parse every modern CSS rule.
const domOptions = { virtualConsole: new VirtualConsole() };
const document = new JSDOM(await readFile(`build/blog/${slug}/index.html`, 'utf8'), domOptions).window.document;
assert.equal(document.querySelectorAll('h1').length, 1);
assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
assert.equal(document.querySelector('link[rel="canonical"]').href, canonical);
assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
assert.ok(![...document.querySelectorAll('meta[name="robots"]')].some(n => /noindex/i.test(n.content)));
assert.ok(document.body.textContent.includes('PKR 23,569.12'));
assert.ok(document.body.textContent.includes('PC-readiness worksheet'));
assert.equal(POSTS.filter(p => p.slug === slug).length, 1);
assert.ok(!POSTS.some(p => p.slug !== slug && p.body.trim() === post.body.trim()), 'No exact duplicate article');
const sitemap = new JSDOM(await readFile('build/sitemap.xml', 'utf8'), { contentType: 'text/xml' }).window.document;
assert.equal([...sitemap.querySelectorAll('loc')].filter(n => n.textContent === canonical).length, 1);
for (const referrer of referrers) {
  const source = POSTS.find(p => p.slug === referrer);
  assert.ok(!source.home, 'Referrer must have its own canonical article URL');
  assert.ok(source.body.includes(`](/blog/${slug})`), 'Contextual Markdown link, not just related-post chrome');
  assert.ok([...sitemap.querySelectorAll('loc')].some(n => n.textContent === `https://cortexissolutionhub.com/blog/${referrer}`));
  const doc = new JSDOM(await readFile(`build/blog/${referrer}/index.html`, 'utf8'), domOptions).window.document;
  assert.ok(doc.querySelector(`.cx-md a[href="/blog/${slug}"]`));
  assert.ok(![...doc.querySelectorAll('meta[name="robots"]')].some(n => /noindex/i.test(n.content)));
}
const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent));
const faq = schemas.find(s => s['@type'] === 'FAQPage');
assert.deepEqual(faq.mainEntity.map(q => q.name), parseBlogContent(post.body).faqs.map(q => q.question));
const images = [...document.querySelectorAll('img[src*="/blog/gta-6/"]')];
assert.equal(images.length, 3);
for (const img of images) {
  assert.equal(img.getAttribute('width'), '1200');
  assert.equal(img.getAttribute('height'), '675');
  assert.ok((await stat(`public${img.getAttribute('src')}`)).size < 150 * 1024);
}
assert.equal(images.filter(i => i.loading === 'lazy' || i.getAttribute('loading') === 'lazy').length, 2);
assert.equal(Math.round((79.99 * 280 * 1.03 + 500) * 100) / 100, 23569.12);
assert.equal(Math.round((99.99 * 280 * 1.03 + 500) * 100) / 100, 29337.12);

const base = process.env.BLOG_PREVIEW_URL || 'http://127.0.0.1:3011';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const checks = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewport({ width, height: 900 });
    // Production boot normally excludes webdriver from hydration; simulate a visitor.
    await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const response = await page.goto(`${base}/blog/${slug}/`, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200);
    assert.ok((await response.text()).includes('PC-readiness worksheet'), 'Static content survives without rendering JS');
    const rendered = await page.evaluate(() => ({
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(n => n.href),
      descriptions: document.querySelectorAll('meta[name="description"]').length,
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.deepEqual(rendered.canonical, [canonical]);
    assert.equal(rendered.descriptions, 1);
    assert.equal(rendered.h1, 1);
    assert.equal(rendered.overflow, false);
    const faqButton = await page.$('.cx-faq button[aria-expanded]');
    await faqButton.click();
    assert.equal(await faqButton.evaluate(el => el.getAttribute('aria-expanded')), 'true');
    for (const img of await page.$$('img[src*="/blog/gta-6/"]')) {
      await img.scrollIntoView();
      await img.evaluate(el => el.decode());
    }
    assert.deepEqual(errors, []);
    checks.push({ width, ...rendered, errors });
    await page.close();
  }
} finally { await browser.close(); }
const report = { passed: true, canonical, incomingContextualLinks: referrers, faqs: faq.mainEntity.length, images: images.length, checks, indexingNote: 'Indexability checked; actual Google indexing requires Search Console.' };
await writeFile(resolve(output, 'seo-followup-qa.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
