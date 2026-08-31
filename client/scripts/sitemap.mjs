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
import { readdirSync, writeFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
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
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/your-bot', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
];

// Deliberately excluded: /login, /signup, /dashboard, /certificate/:code and
// everything under a lesson or quiz. They are either private, per user, or
// thin duplicates, and listing them wastes crawl budget on pages that will
// never rank.
//
// Also excluded: the 62 /tools/:slug pages while they are still in design.
// Each is a name, a one line description and a notice saying the tool is not
// built. Sixty two pages of that is thin content, and submitting them asks
// Google to rank pages that cannot answer the query. They are added below
// automatically as each tool is marked live.
//
// The bot's legal pages are excluded too: Meta requires them to exist, but
// three pages of boilerplate dilute what the site is about.
//
// /whatsapp-bot and its children are excluded as well. They still resolve,
// because those exact URLs are registered with Meta for app review, but they
// render the same component as /your-bot. Listing both would be duplicate
// content, so only the canonical path is submitted.

const iso = (d) => new Date(d).toISOString().slice(0, 10);

const courses = [];
for (const file of readdirSync(COURSES).filter((f) => f.endsWith('.js'))) {
  const mod = (await import(`${COURSES}/${file}`)).default;
  courses.push({
    path: `/learn/${mod.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: iso(statSync(`${COURSES}/${file}`).mtime),
  });
}

// A tool joins the sitemap the moment it actually works.
const { TOOLS } = await import(resolve(HERE, '../src/data/tools.js'));
const liveTools = TOOLS.filter((t) => t.isLive).map((t) => ({
  path: `/tools/${t.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

// Posts carry their own lastmod from the markdown, which is the one date
// Google actually pays attention to here.
const { POSTS } = await import(resolve(HERE, '../src/data/blog.generated.js'));
const posts = POSTS.map((p) => ({
  path: `/blog/${p.slug}`,
  priority: '0.6',
  changefreq: 'yearly',
  lastmod: p.updated || p.date,
}));

// Each service is its own page now, so each is submitted on its own.
const { SERVICES } = await import(resolve(HERE, '../src/data/services.js'));
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
  `${posts.length} posts, ${services.length} services, (${TOOLS.length - liveTools.length} tools still in design and correctly excluded) at ${SITE_URL}`
);
