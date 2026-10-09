/**
 * Generates public/sitemap.xml from the routes and the real course content.
 *
 *   node scripts/sitemap.mjs
 *
 * Reading the courses from the content files rather than a hand written list is
 * the point: 23 course pages get added, removed and renamed by other work, and
 * a sitemap that lists pages which 404 is worse than no sitemap at all.
 *
 * Set SITE_URL in the environment to override the domain.
 */
import { readdirSync, writeFileSync, statSync, existsSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

const HERE = dirname(fileURLToPath(import.meta.url));
const COURSES = resolve(HERE, '../../server/src/content/courses');
const OUT = resolve(HERE, '../public/sitemap.xml');

const SITE_URL = (process.env.SITE_URL || process.env.REACT_APP_SITE_URL || 'https://cortexissolutionhub.com')
  .replace(/\/$/, '');

// priority is a hint about relative importance within this site, not a ranking
// factor. changefreq is advisory. Both are cheap to get roughly right.
const STATIC = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/courses', priority: '0.9', changefreq: 'weekly' },
  { path: '/internships', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/games', priority: '0.7', changefreq: 'monthly' },
  { path: '/games/typedash', priority: '0.6', changefreq: 'monthly' },
  { path: '/games/gotcha-rush', priority: '0.6', changefreq: 'monthly' },
  { path: '/games/pickparty', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/your-bot', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
];

const iso = (d) => new Date(d).toISOString().slice(0, 10);

const courses = [];
if (existsSync(COURSES)) {
  for (const file of readdirSync(COURSES).filter((f) => f.endsWith('.js'))) {
  const mod = (await import(pathToFileURL(`${COURSES}/${file}`).href)).default;
  courses.push({
    path: `/learn/${mod.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: iso(statSync(`${COURSES}/${file}`).mtime),
  });
  }
}

// A tool joins the sitemap the moment it actually works.
const { TOOLS } = await import(pathToFileURL(resolve(HERE, '../src/data/tools.js')).href);
// IMPLEMENTED, not isLive. isLive is editorial and true for all 62; this is
// the set that has a component behind it. Submitting a page that renders no
// tool is how a site earns a thin-content problem, and it is slow to undo.
const { IMPLEMENTED } = await import(pathToFileURL(resolve(HERE, '../src/data/tools.js')).href);
const liveTools = TOOLS.filter((t) => IMPLEMENTED.has(t.slug)).map((t) => ({
  path: `/tools/${t.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

// Posts carry their own lastmod from the markdown, which is the one date
// Google actually pays attention to here.
const { POSTS } = await import(pathToFileURL(resolve(HERE, '../src/data/blog.generated.js')).href);
// A post with a home is rendered on that page, which is listed already.
const posts = POSTS.filter((p) => !p.home).map((p) => ({
  path: `/blog/${p.slug}`,
  priority: '0.6',
  changefreq: 'yearly',
  lastmod: p.updated || p.date,
}));

// Each service is its own page now, so each is submitted on its own.
const { SERVICES } = await import(pathToFileURL(resolve(HERE, '../src/data/services.js')).href);
const services = SERVICES.map((s) => ({
  path: `/services/${s.slug}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

const urls = [...STATIC, ...courses, ...liveTools, ...posts, ...services];
const today = iso(Date.now());

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">'.replace('www.sitemap.org', 'www.sitemaps.org'),
  ...urls.map((u) =>
    [
      '  <url>',
      `    <loc>${SITE_URL}${u.path}</loc>`,
      `    <lastmod>${u.lastmod || today}</lastmod>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync(OUT, xml);
console.log(
  `sitemap.xml written: ${urls.length} urls — ${courses.length} courses, ${liveTools.length} live tools ` +
  `${posts.length} posts, ${services.length} services, (${TOOLS.length - liveTools.length} tools not yet implemented and correctly excluded) at ${SITE_URL}`
);
