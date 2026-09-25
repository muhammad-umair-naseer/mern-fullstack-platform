/**
 * Invariants of the tool catalogue that have broken production pages before:
 * a slug in the live set with no route behind it, a live tool without its
 * guide, meta or FAQ data, a guide pointing at a banner that does not exist.
 * These are data checks, so they run in milliseconds without rendering.
 */
import fs from 'fs';
import path from 'path';
import { TOOLS, IMPLEMENTED, NEW_TOOLKIT_SLUGS } from './tools';
import ARTICLES from './toolArticles';
import TOOL_SEO from './toolSeo';
import TOOL_FAQS from './toolFaqs';

const read = (rel) => fs.readFileSync(path.join(__dirname, rel), 'utf8');
const toolDetail = read('../pages/ToolDetail.js');
const slugs = TOOLS.map((t) => t.slug);
const live = [...IMPLEMENTED];
// The 46 toolkit tools render through ToolkitRunner from a module under
// public/toolkit/src/tools; they have no guide yet, so the guide invariants
// below apply to the React tools only. Their own invariant is the last test.
const toolkit = new Set(NEW_TOOLKIT_SLUGS);
const guided = live.filter((s) => !toolkit.has(s));

describe('tool catalogue', () => {
  test('slugs are unique', () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test('every live slug is a catalogue tool', () => {
    expect(live.filter((s) => !slugs.includes(s))).toEqual([]);
  });

  test('every catalogue tool has a component routed in ToolDetail', () => {
    // Toolkit tools share one route through ToolkitRunner; the rest need a case.
    expect(slugs.filter((s) => !toolkit.has(s) && !toolDetail.includes(`case '${s}':`))).toEqual([]);
  });

  test('every live React tool has a guide, meta and FAQ data', () => {
    const missing = guided
      .map((s) => ({
        slug: s,
        guide: Boolean(ARTICLES[s]),
        meta: Boolean(TOOL_SEO[s]?.title && TOOL_SEO[s]?.description),
        faqs: (TOOL_FAQS[s] || []).length >= 4,
      }))
      .filter((r) => !(r.guide && r.meta && r.faqs));
    expect(missing).toEqual([]);
  });

  test('meta titles and descriptions fit a search result', () => {
    const bad = live
      .filter((s) => TOOL_SEO[s])
      .map((s) => ({ slug: s, t: TOOL_SEO[s].title.length, d: TOOL_SEO[s].description.length }))
      .filter((r) => r.t < 15 || r.t > 70 || r.d < 50 || r.d > 160);
    expect(bad).toEqual([]);
  });

  test('every guide banner exists in public/blog', () => {
    const dir = path.join(__dirname, '../components/tools');
    const missing = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('SeoArticle.js'))
      .flatMap((f) => [...read(`../components/tools/${f}`).matchAll(/src="\/blog\/([^"]+\.webp)"/g)].map((m) => [f, m[1]]))
      .filter(([, img]) => !fs.existsSync(path.join(__dirname, '../../public/blog', img)));
    expect(missing).toEqual([]);
  });

  test('every guided tool has its social card in public/blog/og', () => {
    const missing = Object.keys(ARTICLES).filter(
      (s) => !fs.existsSync(path.join(__dirname, '../../public/blog/og', `${s}.jpg`))
    );
    expect(missing).toEqual([]);
  });

  test('every toolkit tool has its module under public/toolkit/src/tools', () => {
    const dir = path.join(__dirname, '../../public/toolkit/src/tools');
    const missing = [...toolkit].filter((s) => !fs.existsSync(path.join(dir, `${s}.js`)));
    expect(missing).toEqual([]);
  });
});
