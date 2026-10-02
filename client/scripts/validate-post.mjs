// node scripts/validate-post.mjs <file.md>
// Checks one post without touching the generated module, so many can be
// validated in parallel without racing on the same output file.
import { readFileSync, existsSync } from 'fs';

const file = process.argv[2];
if (!existsSync(file)) { console.log(`FAIL: no such file ${file}`); process.exit(1); }
const raw = readFileSync(file, 'utf8');
const errs = [];

const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
if (!m) { console.log('FAIL: missing --- frontmatter block'); process.exit(1); }
const meta = {};
for (const line of m[1].split(/\r?\n/)) {
  if (!line.trim()) continue;
  const at = line.indexOf(':');
  if (at === -1) { errs.push(`cannot parse frontmatter line "${line}"`); continue; }
  meta[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
}
const body = raw.slice(m[0].length);

for (const k of ['title', 'description', 'date']) if (!meta[k]) errs.push(`frontmatter missing "${k}"`);
if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) errs.push(`date must be YYYY-MM-DD, got "${meta.date}"`);
if (meta.description && meta.description.length > 155) errs.push(`description is ${meta.description.length} chars, max 155`);
if (meta.title && meta.title.length > 65) errs.push(`title is ${meta.title.length} chars, Google truncates past ~60`);

const words = body.trim().split(/\s+/).filter(Boolean).length;
if (words < 700) errs.push(`body is ${words} words, needs at least 700`);
if (words > 2200) errs.push(`body is ${words} words, over 2200`);
if (!/^##\s/m.test(body)) errs.push('needs at least one "## " subheading');
if ((body.match(/```/g) || []).length % 2) errs.push('unbalanced code fence');
if (/—|–/.test(raw)) errs.push('no em or en dashes anywhere, write the sentence properly');

// Links must point at pages that exist. 60 of the 62 tools do not.
const REAL = ['/services','/courses','/internships','/tools','/your-bot','/contact','/about','/blog',
  '/tools/pdf-compressor','/tools/pdf-merger','/games','/games/typedash','/games/gotcha-rush'];
for (const link of body.match(/\]\((\/[^)]*)\)/g) || []) {
  const path = link.slice(2, -1).split('#')[0];
  const okLink = REAL.includes(path) || /^\/learn\/[a-z0-9-]+$/.test(path) || /^\/blog\/[a-z0-9-]+$/.test(path);
  if (!okLink) errs.push(`links to ${path}, which does not exist`);
}
if (!(body.match(/\]\(\//g) || []).length) errs.push('no internal links at all');

// Invented numbers are the failure mode that matters most here.
const FABRICATION = [
  [/\b\d{1,3}% of (businesses|companies|users|people|students)\b/i, 'invented statistic'],
  [/\b(studies|research) shows?\b/i, 'unsourced "studies show"'],
  [/\baccording to (a )?(recent )?(study|survey|report)\b/i, 'unsourced study reference'],
];
for (const [re, why] of FABRICATION) if (re.test(body)) errs.push(`${why}: remove it or attribute it`);

if (errs.length) { console.log('FAIL'); errs.forEach((e) => console.log('  - ' + e)); process.exit(1); }
console.log(`PASS ${file.split('/').pop()} — ${words} words, ${(body.match(/\]\(\//g) || []).length} internal links${String(meta.draft).toLowerCase()==='true'?', DRAFT':''}`);
