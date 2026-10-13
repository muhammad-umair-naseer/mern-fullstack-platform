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
import { fileURLToPath, pathToFileURL } from 'url';
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

const findChrome = () => {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : null,
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[0];
};

const CHROME = findChrome();

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

// Preload local courses so prerendering never fails even if backend API is offline
const courseMap = new Map();
const courseList = [];
if (existsSync(COURSES)) {
  for (const f of (await readdir(COURSES)).filter((x) => x.endsWith('.js'))) {
    try {
      const mod = (await import(pathToFileURL(`${COURSES}/${f}`).href)).default;
      if (mod && mod.slug) {
        courseMap.set(mod.slug, mod);
        courseList.push({
          id: mod.slug,
          slug: mod.slug,
          title: mod.title,
          category: mod.category,
          level: mod.level,
          duration: mod.duration,
          accent: mod.accent,
          coverKey: mod.coverKey,
          summary: mod.summary,
          description: mod.description,
          chapterCount: mod.chapters?.length || 0,
          lessonCount: mod.chapters?.reduce((acc, c) => acc + (c.lessons?.length || 0), 0) || 0,
        });
      }
    } catch {
      // ignore
    }
  }
}

let apiReachable = false;
try {
  const probe = await fetch(`${API_TARGET}/api/learn/courses`, { signal: AbortSignal.timeout(2500) });
  if (probe.ok) {
    const { data } = await probe.json();
    console.log(`API reachable at ${API_TARGET} (${data.length} courses)`);
    apiReachable = true;
  }
} catch {
  console.log(`Note: Backend API at ${API_TARGET} is offline. Using local in-memory course repository for prerendering (${courseList.length} courses loaded).`);
}

// A static server that falls back to index.html, the way the real host must be
// configured for a single page app.
const server = createServer(async (req, res) => {
  const raw = req.url || '/';

  // Answer API calls either via upstream or in-memory fallback
  if (raw.startsWith('/api/')) {
    if (apiReachable) {
      try {
        const upstream = await fetch(API_TARGET + raw, {
          method: req.method,
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(4000),
        });
        if (upstream.ok) {
          const body = Buffer.from(await upstream.arrayBuffer());
          res.writeHead(upstream.status, {
            'Content-Type': upstream.headers.get('content-type') || 'application/json',
          });
          return res.end(body);
        }
      } catch {
        // Fall through to local fallback
      }
    }

    const cleanPath = raw.split('?')[0];
    if (cleanPath === '/api/learn/courses' || cleanPath === '/api/learn/courses/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ data: courseList }));
    }

    if (cleanPath.startsWith('/api/learn/courses/')) {
      const slug = cleanPath.replace('/api/learn/courses/', '').split('/')[0];
      const course = courseMap.get(slug);
      if (course) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ data: course }));
      }
    }

    if (cleanPath.startsWith('/api/auth/me')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Unauthenticated' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ data: [] }));
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

if (!CHROME || !existsSync(CHROME)) {
  console.warn(`⚠️ Chrome executable not found for prerendering. Skipping prerender step.`);
  server.close();
  process.exit(0);
}

const routes = [
  '/', '/about', '/services', '/courses', '/internships', '/tools',
  '/contact', '/terms', '/privacy', '/your-bot', '/blog', '/faq', '/games',
  '/games/typedash', '/games/gotcha-rush', '/games/pickparty',
];

for (const [slug] of courseMap) {
  routes.push(`/learn/${slug}`);
}

// Every post gets its own static page. This is the whole reason posts live as
// markdown in the repo rather than in a database: the full text ends up in the
// HTML by construction, so a crawler never has to run JavaScript to read one.
const { POSTS } = await import(pathToFileURL(resolve(HERE, '../src/data/blog.generated.js')).href);
for (const post of POSTS) routes.push(`/blog/${post.slug}`);

// Every service is its own page now, so every service gets prerendered.
const { SERVICES } = await import(pathToFileURL(resolve(HERE, '../src/data/services.js')).href);
for (const service of SERVICES) routes.push(`/services/${service.slug}`);

// The tools that have code behind them. These are the only tool pages in the
// sitemap, and until now they were the only sitemap entries shipping an empty
// shell to a crawler that does not run JS. The other sixty are catalogue
// entries with no component yet: they are noindexed at runtime and must stay
// out of here, or the prerenderer would bake sixty near-identical thin pages
// into the build.
const { TOOLS, IMPLEMENTED } = await import(pathToFileURL(resolve(HERE, '../src/data/tools.js')).href);
for (const tool of TOOLS) {
  if (IMPLEMENTED.has(tool.slug)) routes.push(`/tools/${tool.slug}`);
}

let browser;
try {
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    // The scroll pass on the heaviest pages can exceed the 180 s default when
    // several tabs share a small CI or container CPU.
    protocolTimeout: 300000,
  });
} catch (err) {
  console.warn(`⚠️ Could not launch Chrome (${err.message}). Skipping prerender step.`);
  server.close();
  process.exit(0);
}

let written = 0;
const failed = [];

// Routes render in parallel tabs. Each one is independent — its own page, its
// own scroll, its own file — so N tabs finish in roughly 1/N of the time, and
// a 120-route build stops being the slowest step of every image build.
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY) || 4);

const renderRoute = async (route) => {
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

    // Drive the page to the bottom before snapshotting.
    //
    // Every scroll-driven animation on this site writes its start state from
    // JavaScript — opacity 0 for the reveal hook, a clip-path and a translate
    // for the footer's scrub. Serialising at scroll position 0 freezes those
    // start states into the static HTML, which then ships a page whose content
    // is invisible or half-clipped to anyone whose JS never runs. Scrolling to
    // the end first leaves every one of them at its finished state, so the
    // snapshot is the page as it is meant to look.
    //
    // Stepping rather than jumping: a single scrollTo skips the intermediate
    // triggers, and ScrollTrigger only advances the ones it actually passes.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
      // Bounded: a page whose height keeps growing (or a starved tab) must not
      // scroll forever. 400 steps is well past the longest page on the site.
      const deadline = Date.now() + 60000;
      for (let y = 0, steps = 0; y < document.documentElement.scrollHeight && steps < 400 && Date.now() < deadline; y += step, steps += 1) {
        window.scrollTo(0, y);
        await frame();
        await frame();
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      // Two frames for the last trigger to settle, then let the slowest
      // entrance (image reveals run 1.3s) and any smoothed scrub reach their
      // end values.
      await frame();
      await new Promise((r) => setTimeout(r, 1500));
    });

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
      return;
    }
    // Two titles means a crawler picks the first, which may be the wrong page's.
    if (check.titles !== 1 || check.descs !== 1) {
      failed.push(`${route}: ${check.titles} title tags and ${check.descs} descriptions, expected 1 of each`);
      return;
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
};

// A route that fails once (almost always a timeout under CPU contention) gets
// a second, solo attempt after the pool drains, before it counts as failed.
const queue = [...routes];
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    for (let route = queue.shift(); route !== undefined; route = queue.shift()) await renderRoute(route);
  })
);
const retry = failed.splice(0).map((f) => f.split(':')[0]);
for (const route of retry) {
  process.stdout.write(`  retrying ${route}\n`);
  await renderRoute(route);
}

await browser.close();
server.close();

console.log(`\nprerendered ${written}/${routes.length} routes`);
if (failed.length) {
  console.log('failed:');
  failed.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
