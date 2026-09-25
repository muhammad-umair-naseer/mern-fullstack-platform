/**
 * Invariants of the tool catalogue that have broken production pages before:
 * a slug in the live set with no route behind it, a live tool without its
 * guide, meta or FAQ data, a guide pointing at a banner that does not exist.
 * These are data checks, so they run in milliseconds without rendering.
 */
import fs from 'fs';
import path from 'path';
import { TOOLS, IMPLEMENTED } from './tools';
import ARTICLES from './toolArticles';
import TOOL_SEO from './toolSeo';
import TOOL_FAQS from './toolFaqs';

const read = (rel) => fs.readFileSync(path.join(__dirname, rel), 'utf8');
const toolDetail = read('../pages/ToolDetail.js');
const slugs = TOOLS.map((t) => t.slug);
const live = [...IMPLEMENTED];

describe('tool catalogue', () => {
  test('slugs are unique', () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test('every live slug is a catalogue tool', () => {
    expect(live.filter((s) => !slugs.includes(s))).toEqual([]);
  });

  test('every catalogue tool has a component routed in ToolDetail', () => {
    expect(slugs.filter((s) => !toolDetail.includes(`case '${s}':`))).toEqual([]);
  });

  test('every live tool has a guide, meta and FAQ data', () => {
    const missing = live
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
});
