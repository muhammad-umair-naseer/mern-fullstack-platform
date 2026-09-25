// Generates one static, crawlable page per tool at tools/<slug>/index.html (+ sitemap.xml, robots.txt).
// Usage: node scripts/build-pages.mjs [--site https://your-domain.com/path-where-index.html-lives]
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { TOOLS, CATEGORIES } from '../src/registry.js';

const siteArg = process.argv.indexOf('--site');
// Canonicals point at the main site's /tools/<slug>, the page that carries the guide.
const SITE = (siteArg > 0 ? process.argv[siteArg + 1] : process.env.SITE_URL || 'https://cortexissolutionhub.com').replace(/\/$/, '');
const shell = readFileSync('tool.html', 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
if (existsSync('tools')) rmSync('tools', { recursive: true });
let n = 0;
for (const t of TOOLS) {
  const cat = CATEGORIES.find((c) => c.id === t.category);
  const title = `${t.name} — Free Online Tool | Cortexis`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: t.name, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', description: t.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, url: `${SITE}/tools/${t.slug}`, publisher: { '@type': 'Organization', name: 'Cortexis Solution Hub (Pvt.) Ltd.' } };
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(t.description)}">\n<link rel="canonical" href="${SITE}/tools/${t.slug}">\n<meta property="og:title" content="${esc(t.name)} — Cortexis Tools">\n<meta property="og:description" content="${esc(t.description)}">\n<meta property="og:type" content="website">\n<meta name="keywords" content="${esc(t.keywords)}">\n<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`)
    .replace(/href="assets\//g, 'href="../../assets/')
    .replace(/src="src\//g, 'src="../../src/')
    .replace(/href="\.\/"/g, 'href="../../"')
    .replace('<body>', `<body data-slug="${t.slug}" data-base="../../">`)
    .replace('<div class="tool-head" id="tool-head"></div>', `<div class="tool-head" id="tool-head"><noscript><h1>${esc(t.name)}</h1><p>${esc(t.description)}</p><p>Please enable JavaScript to use this tool.</p></noscript></div>`)
    .replace('<div id="tool-root"></div>', `<div id="tool-root"></div>\n<section class="card" style="margin-top:24px"><h3>About ${esc(t.name)}</h3><p>${esc(t.description)} Part of the ${esc(cat ? cat.name : '')} in the Cortexis Free Online Toolkit. Your files are never stored or retained, and no account is needed.</p><p>Related tools: ${TOOLS.filter((x) => x.category === t.category && x.slug !== t.slug).slice(0, 6).map((x) => `<a href="../${x.slug}/">${esc(x.name)}</a>`).join(' · ')}</p></section>`);
  mkdirSync(`tools/${t.slug}`, { recursive: true });
  writeFileSync(`tools/${t.slug}/index.html`, html);
  n++;
}
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, ...TOOLS.map((t) => `${SITE}/tools/${t.slug}/`)];
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Generated ${n} tool pages, sitemap.xml and robots.txt for ${SITE}`);
