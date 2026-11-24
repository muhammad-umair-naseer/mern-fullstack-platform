import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer-core';

const slug = 'chatgpt-advertising-benefits-costs-2026';
const route = `/blog/${slug}`;
const canonical = `https://cortexissolutionhub.com${route}`;
const out = resolve('test-results/chatgpt-release');
const root = resolve('build');
await mkdir(out, { recursive: true });
const report = { static: {}, browser: [], destinations: [] };
const html = await readFile(resolve(root, `blog/${slug}/index.html`), 'utf8');
const doc = new JSDOM(html).window.document;
const schemas = [...doc.scripts].filter(n => n.type === 'application/ld+json').map(n => JSON.parse(n.textContent));
const manifest = JSON.parse(await readFile(resolve(root, 'prerender-manifest.json'), 'utf8'));
assert.equal(manifest.complete, true, 'Release must have a full prerender');
assert.ok(manifest.routes.includes(route));
assert.equal(doc.querySelectorAll('h1').length, 1);
assert.ok(doc.getElementById('root').firstElementChild, 'Article must be prerendered for hydration');
assert.equal(doc.querySelectorAll('link[rel=canonical]').length, 1);
assert.equal(doc.querySelector('link[rel=canonical]').href, canonical);
assert.equal(doc.querySelectorAll('meta[name=description]').length, 1);
assert.ok(doc.title.length <= 60);
assert.equal(doc.querySelectorAll('.cx-author-card').length, 0);
assert.ok(!doc.body.textContent.includes('Peer-reviewed for Accuracy'));
assert.ok(doc.querySelector('.cx-md').textContent.length > 10000);
assert.ok(!doc.querySelector('.cx-md').textContent.includes('\uFFFD'));
assert.ok(!doc.querySelector('.cx-md').textContent.includes('â€™'));
const article = schemas.find(s => s['@type'] === 'Article');
assert.equal(article.author['@type'], 'Organization');
assert.equal(article.mainEntityOfPage, canonical);
assert.ok(schemas.some(s => s['@type'] === 'BreadcrumbList'));
const faq = schemas.find(s => s['@type'] === 'FAQPage');
assert.equal(faq.mainEntity.length, 6);
const schemaText = faq.mainEntity.map(q => q.acceptedAnswer.text.replace(/\s+/g, ' ').trim());
const visibleText = [...doc.querySelectorAll('.cx-faq-a')].map(n => n.textContent.replace(/\s+/g, ' ').trim());
assert.deepEqual(schemaText, visibleText, 'Schema must match rendered FAQ text');
for (const a of doc.querySelectorAll('.cx-share a')) assert.ok(decodeURIComponent(a.href).includes(canonical));
assert.ok((await readFile(resolve(root, 'sitemap.xml'), 'utf8')).includes(canonical));
const images = [...doc.images].filter(n => n.src.includes('/blog/chatgpt-advertising/'));
assert.equal(images.length, 3);
const imageFiles = [];
for (const image of images) {
  assert.ok(image.alt.length > 20);
  const file = await readFile(resolve(root, image.getAttribute('src').slice(1)));
  assert.equal(file.subarray(0, 4).toString(), 'RIFF');
  assert.equal(file.subarray(8, 12).toString(), 'WEBP');
  imageFiles.push({ path: image.getAttribute('src'), bytes: file.length, alt: image.alt });
}
report.static = { fullPrerender: manifest.complete, routes: manifest.routes.length, title: doc.title, titleLength: doc.title.length, descriptionLength: doc.querySelector('meta[name=description]').content.length, canonical, imageFiles, faqMatchesVisibleText: true, authorBoxAbsent: true, sourceHtmlHasArticle: true };
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.json':'application/json', '.xml':'application/xml', '.ico':'image/x-icon' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside build');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(4301, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:4301';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true });
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setCacheEnabled(false);
    await page.setViewport({ width, height: 900 });
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:width === 390 ? 'no-preference' : 'reduce'}]);
    await page.evaluateOnNewDocument(() => {
      // Exercise real-visitor hydration rather than the build-only webdriver path.
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.auditVitals = { lcp: 0, cls: 0, shifts: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.auditVitals.lcp = e.startTime; }).observe({ type:'largest-contentful-paint', buffered:true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) { window.auditVitals.cls += e.value; window.auditVitals.shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>({element:s.node?.outerHTML?.slice(0,180),previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))}); } }).observe({ type:'layout-shift', buffered:true });
    });
    assert.equal((await page.goto(base + route + '/', {waitUntil:'networkidle0'})).status(), 200);
    const initialVitals = await page.evaluate(() => structuredClone(window.auditVitals));
    assert.ok(initialVitals.cls < 0.1, `Initial layout shift too high at ${width}: ${initialVitals.cls}`);
    await page.screenshot({path:resolve(out, `top-${width}.png`)});
    for (const img of await page.$$('img[src*="/blog/chatgpt-advertising/"]')) { await img.scrollIntoView(); await img.evaluate(n => n.decode()); }
    const data = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
      const body = document.querySelector('.cx-md');
      return { width:innerWidth, overflow:document.documentElement.scrollWidth > innerWidth, duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i), authorCards:document.querySelectorAll('.cx-author-card').length, images:[...document.querySelectorAll('img[src*="/blog/chatgpt-advertising/"]')].map(n=>({complete:n.complete,width:n.naturalWidth})), fontSize:getComputedStyle(body).fontSize, vitals:window.auditVitals, links:[...document.querySelectorAll('.cx-share a')].map(n=>decodeURIComponent(n.href)) };
    });
    assert.equal(data.overflow, false, `Horizontal overflow at ${width}`);
    assert.deepEqual(data.duplicateIds, []);
    assert.equal(data.authorCards, 0);
    assert.ok(data.images.every(n=>n.complete && n.width === 1200));
    assert.ok(parseFloat(data.fontSize) >= 16);
    assert.ok(data.links.every(n=>n.includes(canonical)));
    const question = await page.$('.cx-faq button[aria-expanded]');
    await question.focus(); await page.keyboard.press('Enter');
    assert.equal(await question.evaluate(n=>n.getAttribute('aria-expanded')), 'true');
    await page.keyboard.press('Enter');
    assert.equal(await question.evaluate(n=>n.getAttribute('aria-expanded')), 'false');
    if (width === 390 || width === 1440) {
      await page.$eval('#how-much-does-chatgpt-advertising-cost', n=>n.scrollIntoView({behavior:'instant',block:'start'}));
      await page.screenshot({path:resolve(out, `pricing-${width}.png`)});
    }
    assert.deepEqual(errors, [], 'Hydration/runtime errors');
    report.browser.push({...data,initialVitals,errors,keyboardFaq:true});
    await page.close();
  }
  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.goto(base + route + '/', {waitUntil:'networkidle0'});
  const plain = await nojs.$eval('.cx-md', n=>n.textContent);
  assert.ok(plain.includes('PKR 2,100') && plain.includes('How Do ChatGPT Ads Work?'));
  report.noJavaScriptArticle = true;
  const paths = [...new Set([...doc.querySelectorAll('.cx-md a')].map(n=>n.getAttribute('href')).filter(h=>h.startsWith('/')))];
  for (const path of ['/blog', ...paths]) {
    const response = await fetch(base + path + '/');
    assert.equal(response.status, 200);
    const content = new JSDOM(await response.text()).window.document;
    assert.ok(content.querySelector('h1'));
    assert.ok(!content.body.textContent.includes('That post is not here'));
    if (path === '/blog') assert.ok([...content.links].some(n=>n.getAttribute('href')===route));
    report.destinations.push({path,status:response.status,title:content.title});
  }
  report.passed = true;
  console.log(JSON.stringify({passed:true,widths:report.browser.map(n=>n.width),static:report.static,noJavaScriptArticle:true,localLinks:report.destinations.length},null,2));
} finally {
  await writeFile(resolve(out, 'production-audit.json'), JSON.stringify(report,null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
