import { h, section, textarea, dropzone, readAs, textOutput, button, row, copyButton } from '../core/ui.js';

const words = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const SMALL = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'vs', 'via', 'per']);
export const CASES = {
  'UPPERCASE': (s) => s.toUpperCase(),
  'lowercase': (s) => s.toLowerCase(),
  'Title Case': (s) => s.replace(/\S+/g, (w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : cap(w))),
  'Sentence case': (s) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L}|\n\s*\p{L})/gu, (m) => m.toUpperCase()),
  'Capitalized Case': (s) => s.replace(/\S+/g, cap),
  'camelCase': (s) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join(''),
  'PascalCase': (s) => words(s).map(cap).join(''),
  'snake_case': (s) => words(s).map((w) => w.toLowerCase()).join('_'),
  'kebab-case': (s) => words(s).map((w) => w.toLowerCase()).join('-'),
  'CONSTANT_CASE': (s) => words(s).map((w) => w.toUpperCase()).join('_'),
  'dot.case': (s) => words(s).map((w) => w.toLowerCase()).join('.'),
  'path/case': (s) => words(s).map((w) => w.toLowerCase()).join('/'),
  'Train-Case': (s) => words(s).map(cap).join('-'),
  'aLtErNaTiNg': (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(''),
  'InVeRsE cAsE': (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(''),
  'Reverse': (s) => [...s].reverse().join(''),
  'Slug (url-safe)': (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  'Remove extra spaces': (s) => s.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim(),
};
export function mount(root) {
  const inp = textarea({ rows: 8, value: 'the quick brown fox jumps over the lazy dog. it was a sunny day!' });
  const out = h('div'); const pills = h('div.pill-list');
  let current = 'Title Case';
  const run = () => { [...pills.children].forEach((b) => b.classList.toggle('on', b.textContent === current)); out.replaceChildren(textOutput(CASES[current](inp.value), { name: 'converted.txt', rows: 8 })); };
  for (const k of Object.keys(CASES)) pills.append(h('button', { onClick: () => { current = k; run(); } }, k));
  inp.addEventListener('input', run);
  root.append(h('div.tool', section('Text', dropzone({ accept: '.txt,.md', compact: true, label: 'Drop a text file or type below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); run(); } }), inp), section('Convert to', pills), section('Result', out)));
  run();
}
