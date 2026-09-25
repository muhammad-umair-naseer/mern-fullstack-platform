import { h, button, run, section, notice, checkbox, fmtBytes, textOutput } from '../core/ui.js';
import { pdfPicker } from './_pdf-common.js';
import { extractPageText } from '../core/pdf/content.js';
import { getMetadata } from '../core/pdf/pdfkit.js';
import { diffLines, diffWords, unifiedDiff } from '../core/formats/data.js';

export function mount(root) {
  let a = null, b = null;
  const ignoreWs = checkbox('Ignore whitespace differences', true);
  const ignoreCase = checkbox('Ignore case', false);
  const out = h('div');
  const go = button('Compare', () => run(go, async () => {
    if (!a || !b) throw new Error('Choose both PDFs first.');
    const textOf = (l) => l.doc.pages.map((p) => { try { return extractPageText(l.doc, p); } catch { return ''; } });
    const ta = textOf(a), tb = textOf(b);
    const ma = getMetadata(a.doc), mb = getMetadata(b.doc);
    const summary = h('div.stats', stat(a.doc.pages.length, 'Pages (A)'), stat(b.doc.pages.length, 'Pages (B)'), stat(fmtBytes(a.file.size), 'Size (A)'), stat(fmtBytes(b.file.size), 'Size (B)'));
    const metaRows = ['title', 'author', 'subject', 'creator', 'producer', 'creationDate', 'modDate'].filter((k) => ma[k] || mb[k]).map((k) => h('tr', h('td', k), h('td', { style: ma[k] !== mb[k] ? { color: 'var(--err)' } : null }, ma[k] || '—'), h('td', { style: ma[k] !== mb[k] ? { color: 'var(--err)' } : null }, mb[k] || '—')));
    const pages = Math.max(ta.length, tb.length);
    const pageCards = []; let changedPages = 0, ins = 0, del = 0;
    const opts = { ignoreWhitespace: ignoreWs.input.checked, ignoreCase: ignoreCase.input.checked };
    for (let i = 0; i < pages; i++) {
      const A = ta[i] ?? '', B = tb[i] ?? '';
      const d = diffLines(A, B, opts);
      const changed = d.some((o) => o.type !== 'eq');
      if (!changed) continue;
      changedPages++;
      const rows = [];
      for (let k = 0; k < d.length; k++) {
        const o = d[k];
        if (o.type === 'eq') { rows.push(h('div.l', h('span.n', ''), h('span.n', ''), h('span', o.a))); continue; }
        if (o.type === 'del' && d[k + 1]?.type === 'ins') { const w = diffWords(o.a, d[k + 1].b); rows.push(h('div.l.del', h('span.n', '−'), h('span.n', ''), h('span', w.filter((x) => x.type !== 'ins').map((x) => (x.type === 'del' ? h('mark.del', x.a) : x.a))))); rows.push(h('div.l.ins', h('span.n', ''), h('span.n', '+'), h('span', w.filter((x) => x.type !== 'del').map((x) => (x.type === 'ins' ? h('mark.ins', x.b) : x.a ?? x.b))))); del++; ins++; k++; continue; }
        if (o.type === 'del') { del++; rows.push(h('div.l.del', h('span.n', '−'), h('span.n', ''), h('span', o.a))); }
        else { ins++; rows.push(h('div.l.ins', h('span.n', ''), h('span.n', '+'), h('span', o.b))); }
      }
      pageCards.push(h('div.card', h('h3', `Page ${i + 1}` + (ta[i] === undefined ? ' (only in B)' : tb[i] === undefined ? ' (only in A)' : '')), h('div.diff', rows)));
    }
    const unified = ta.map((t, i) => unifiedDiff(t, tb[i] ?? '', { fileA: `A page ${i + 1}`, fileB: `B page ${i + 1}` })).filter((u) => u.split('\n').length > 2).join('\n\n');
    out.replaceChildren(summary, notice(changedPages ? `${changedPages} page(s) differ · ${del} line(s) removed · ${ins} line(s) added.` : 'The extracted text of both documents is identical.', changedPages ? 'warn' : 'ok'), metaRows.length ? h('div.card', h('h3', 'Metadata'), h('table.data', h('thead', h('tr', h('th', 'Field'), h('th', a.file.name), h('th', b.file.name))), h('tbody', metaRows))) : null, ...pageCards, changedPages ? h('div.card', h('h3', 'Unified diff (text)'), textOutput(unified, { name: 'pdf-diff.patch' })) : null);
  }, out), 'primary big');
  root.append(h('div.tool',
    h('div.grid2', section('Original (A)', pdfPicker({ onLoad: (l) => { a = l; }, label: 'Drop the original PDF' })), section('Revised (B)', pdfPicker({ onLoad: (l) => { b = l; }, label: 'Drop the revised PDF' }))),
    h('div.row', ignoreWs, ignoreCase, go),
    notice('Comparison is based on the text layer of each page (scanned PDFs without text will show no differences).'),
    out));
}
const stat = (v, l) => h('div.stat', h('b', String(v)), h('span', l));
