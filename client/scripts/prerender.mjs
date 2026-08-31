/**
 * Renders every public route to static HTML after the build.
 *
 *   npm run build        (build then prerender, see package.json)
 *   node scripts/prerender.mjs
 *
 * Why this exists: Create React App ships one index.html with an empty
 * <div id="root">. Google can execute JavaScript, but it does so on a second
 * pass that is delayed and not guaranteed, and the crawlers behind LinkedIn,
 * WhatsApp, Facebook and Bing previews largely do not run it at all. So a link
 * to any page previewed as nothing and the content counted for little.
 *
 * This drives a real browser over the built site and writes what it rendered,
 * so build/courses/index.html contains the actual course list as markup. React
 * still takes over on load for real visitors.
 *
 * Routes with parameters are expanded from the real content, so the 23 course
 * pages are covered without a hand maintained list.
 */
import { createServer } from 'http';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, extname, join } from 'path';
import puppeteer from 'puppeteer-core';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = resolve(HERE, '../build');
const COURSES = resolve(HERE, '../../server/src/content/courses');
const PORT = 4173;
// A production build calls the API on its own origin, so the prerender server
// has to answer /api itself or every page renders its empty state. Point this
// at wherever the real backend is running during the build.
const API_TARGET = (process.env.PRERENDER_API || 'http://localhost:5000').replace(/\/$/, '');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
  '.pdf': 'application/pdf',
};

if (!existsSync(BUILD)) {
  console.error('No build/ directory. Run the build first.');
  process.exit(1);
}

/**
 * The shell every route is rendered from.
 *
 * This run writes its output back over build/index.html, so on a second run
 * that file already carries the home page's title and description. React
 * appends rather than replaces, so the next render would end up with two of
 * each and a crawler reads the first. Stripping them here makes prerendering
 * idempotent: run it as many times as you like and the result is identical.
 */
const SHELL = (await readFile(join(BUILD, 'index.html'), 'utf8'))
  .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
  .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
  .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
  .replace(/<meta\s+(?:property|name)="(?:og|twitter):[^"]*"[^>]*>\s*/gi, '')
  .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi, '');

// A static server that falls back to index.html, the way the real host must be
// configured for a single page app.
const server = createServer(async (req, res) => {
  const raw = req.url || '/';

  // Proxy the API rather than letting the SPA fallback answer it with HTML,
  // which is what silently produced pages full of "could not load" states.
  if (raw.startsWith('/api/')) {
    try {
      const upstream = await fetch(API_TARGET + raw, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
      });
      const body = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      });
      return res.end(body);
    } catch {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      return res.end('{"message":"prerender proxy could not reach the API"}');
    }
  }

  const url = decodeURIComponent(raw.split('?')[0]);

  // Any route without a file extension is a client route: serve the stripped
  // shell, never a previously prerendered page.
  if (!extname(url)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(SHELL);
  }

  try {
    const body = await readFile(join(BUILD, url));
    res.writeHead(200, { 'Content-Type': MIME[extname(url)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(SHELL);
  }
});

await new Promise((r) => server.listen(PORT, r));

try {
  const probe = await fetch(`${API_TARGET}/api/learn/courses`);
  if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
  const { data } = await probe.json();
  console.log(`API reachable at ${API_TARGET} (${data.length} courses)`);
} catch (err) {
  console.error(
    `\nThe API at ${API_TARGET} is not reachable (${err.message}).\n` +
    'Prerendering without it produces pages showing empty and error states, which is\n' +
    'worse than not prerendering at all. Start the server, or set PRERENDER_API.\n'
  );
  server.close();
  process.exit(1);
}

const routes = [
  '/', '/about', '/services', '/courses', '/internships', '/tools',
  '/contact', '/terms', '/privacy', '/your-bot',
];

for (const f of (await readdir(COURSES)).filter((x) => x.endsWith('.js'))) {
  const mod = (await import(`${COURSES}/${f}`)).default;
  routes.push(`/learn/${mod.slug}`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

let written = 0;
const failed = [];

for (const route of routes) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 45000,
    });
    // Give React a moment to hoist its metadata into the head.
    await page.waitForFunction('document.title && document.title.length > 0', { timeout: 10000 })
      .catch(() => {});

    const html = await page.evaluate(() => {
      // Scripts still load and run for real visitors; nothing is stripped.
      return '<!doctype html>\n' + document.documentElement.outerHTML;
    });

    // A route that rendered nothing is worse than no prerender at all, because
    // it would ship an empty page to the crawler as if it were the content.
    const check = await page.evaluate(() => ({
      text: document.body.innerText.trim().length,
      titles: document.querySelectorAll('title').length,
      descs: document.querySelectorAll('meta[name="description"]').length,
      title: document.title,
    }));
    if (check.text < 200) {
      failed.push(`${route}: only ${check.text} chars of text`);
      continue;
    }
    // Two titles means a crawler picks the first, which may be the wrong page's.
    if (check.titles !== 1 || check.descs !== 1) {
      failed.push(`${route}: ${check.titles} title tags and ${check.descs} descriptions, expected 1 of each`);
      continue;
    }

    const dir = route === '/' ? BUILD : join(BUILD, route);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html);
    written += 1;
    process.stdout.write(`  ${route.padEnd(34)} ${check.title.slice(0, 60)}\n`);
  } catch (err) {
    failed.push(`${route}: ${String(err.message).slice(0, 80)}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

console.log(`\nprerendered ${written}/${routes.length} routes`);
if (failed.length) {
  console.log('failed:');
  failed.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
