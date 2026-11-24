import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { POSTS } from '../src/data/blog.generated.js';
import { parseBlogContent } from '../src/lib/blogParser.js';

const slug = 'chatgpt-advertising-benefits-costs-2026';
const base = process.env.BLOG_PREVIEW_URL || 'http://127.0.0.1:3000';
const output = resolve('test-results/chatgpt-blog');
await mkdir(output, { recursive: true });
const post = POSTS.find(p => p.slug === slug);
const parsed = parseBlogContent(post.body);
assert.equal(parsed.faqs.length, 6);
assert.ok(post.description.length <= 155);
assert.ok(!(post.body.includes('Publisher’s SEO') || post.body.includes('Cache Review')));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true });
const report = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const response = await page.goto(`${base}/blog/${slug}/`, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.cx-md');
    await page.screenshot({ path: resolve(output, `chatgpt-blog-${width}.png`) });
    for (const img of await page.$$('img[src*="/blog/chatgpt-advertising/"]')) {
      await img.scrollIntoView();
      await img.evaluate(el => el.decode());
    }
    const data = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(n => n.href),
      descriptions: [...document.querySelectorAll('meta[name="description"]')].map(n => n.content),
      overflow: document.documentElement.scrollWidth > innerWidth,
      tables: document.querySelectorAll('.cx-md-table').length,
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent)),
      images: [...document.querySelectorAll('img[src*="/blog/chatgpt-advertising/"]')].map(n => ({ src: n.getAttribute('src'), alt: n.alt, loading: n.loading, naturalWidth: n.naturalWidth, width: n.getAttribute('width'), height: n.getAttribute('height') })),
      internalLinks: [...document.querySelectorAll('.cx-md a[href^="/"]')].map(n => n.getAttribute('href')),
      faqLinks: document.querySelectorAll('.cx-faq a[href^="https://"]').length,
      authorCards: document.querySelectorAll('.cx-author-card').length,
      shareLinks: [...document.querySelectorAll('.cx-share a')].map(n => decodeURIComponent(n.href)),
    }));
    assert.equal(data.h1, 1);
    assert.equal(data.title, post.seoTitle);
    assert.equal(data.authorCards, 0);
    assert.ok(data.shareLinks.every(href => href.includes(`https://cortexissolutionhub.com/blog/${slug}`) && !href.includes('localhost')));
    assert.deepEqual(data.canonical, [`https://cortexissolutionhub.com/blog/${slug}`]);
    assert.deepEqual(data.descriptions, [post.description]);
    assert.equal(data.overflow, false);
    assert.equal(data.images.length, 3);
    assert.ok(data.images.every(i => i.naturalWidth === 1200 && i.width === '1200' && i.height === '675' && i.alt.length > 20));
    assert.equal(data.images.filter(i => i.loading === 'lazy').length, 2);
    assert.equal(data.tables, 3);
    assert.equal(data.faqLinks, 4, 'FAQ references must render as links, not raw Markdown');
    const article = data.schemas.find(s => s['@type'] === 'Article');
    assert.equal(article.author['@type'], 'Organization');
    assert.equal(article.author.name, 'Cortexis Solution Hub');
    const faq = data.schemas.find(s => s['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 6);
    assert.ok(faq.mainEntity.every(q => !q.acceptedAnswer.text.includes('](')));
    assert.ok(data.schemas.some(s => s['@type'] === 'BreadcrumbList'));
    for (const item of parsed.toc) assert.ok(await page.$(`#${item.id}`));
    const question = await page.$('.cx-faq button[aria-expanded]');
    await question.click();
    assert.equal(await question.evaluate(el => el.getAttribute('aria-expanded')), 'true');
    assert.deepEqual(errors, []);
    report.push({ width, ...data, errors });
    await page.close();
  }
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.goto(`${base}/blog/`, { waitUntil: 'networkidle0' });
  assert.ok(await page.$(`a[href="/blog/${slug}"]`));
  for (const path of [...new Set(report[0].internalLinks)]) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200);
    assert.ok(!(await page.$eval('main', n => n.innerText)).includes('That post is not here'));
  }
  await page.goto(`${base}/blog/gta-6-how-to-play-pc-requirements-price/`, { waitUntil: 'networkidle0' });
  const existingAuthor = await page.$$eval('script[type="application/ld+json"]', nodes => nodes.map(n => JSON.parse(n.textContent)).find(s => s['@type'] === 'Article').author);
  assert.equal(existingAuthor['@type'], 'Person');
  assert.equal(existingAuthor.name, 'Umair');
  console.log(JSON.stringify({ passed: true, widths: report.map(r => r.width), images: 3, faqs: 6, internalLinks: 4, existingAuthorPreserved: true }));
} finally {
  await writeFile(resolve(output, 'qa.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
