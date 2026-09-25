import { h, field, button, run, result, pdfPreview, section, outName, notice, checkbox, colorInput, input } from '../core/ui.js';
import { pdfPicker, pageBox, pageSelector, engineNote, PdfDocument } from './_pdf-common.js';
import { redactPage } from '../core/pdf/pdfkit.js';
import { extractPageText } from '../core/pdf/content.js';

export function mount(root) {
  let loaded = null, pageIdx = 0; const rectsByPage = new Map();
  const boxHost = h('div.muted', 'Load a PDF, then drag on the page to draw black boxes.');
  const pageSel = h('div'); const status = h('div.small.muted');
  const color = colorInput('#000000');
  const removeText = checkbox('Remove underlying text (true redaction)', true);
  const search = input('text', { placeholder: 'Find text to redact (exact, case-insensitive)', class: 'wide' });
  const rebuild = () => {
    if (!loaded) return;
    const doc = loaded.doc, page = doc.pages[pageIdx];
    if (!rectsByPage.has(pageIdx)) rectsByPage.set(pageIdx, []);
    const box = pageBox(doc, page, { mode: 'draw', rects: rectsByPage.get(pageIdx), blackFill: true, onChange: () => { const n = [...rectsByPage.values()].reduce((a, r) => a + r.length, 0); status.textContent = `${n} region(s) across ${[...rectsByPage.entries()].filter(([, r]) => r.length).length} page(s).`; } });
    boxHost.replaceChildren(box);
    pageSel.replaceChildren(pageSelector(doc.pages.length, pageIdx, (i) => { pageIdx = i; rebuild(); }));
  };
  const findBtn = button('Mark all matches', () => run(findBtn, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const q = search.value.trim().toLowerCase(); if (!q) throw new Error('Type the text to find.');
    const { pageLayout } = await import('./_pdf-common.js');
    let total = 0;
    loaded.doc.pages.forEach((page, i) => {
      const { items } = pageLayout(loaded.doc, page);
      for (const it of items) { if (it.image) continue; const t = it.text.toLowerCase(); let from = 0; let k; while ((k = t.indexOf(q, from)) >= 0) { const frac = k / t.length, fw = q.length / t.length; if (!rectsByPage.has(i)) rectsByPage.set(i, []); rectsByPage.get(i).push({ x: it.x + it.w * frac - 0.002, y: it.y - it.h * 0.15, w: it.w * fw + 0.004, h: it.h * 1.3 }); total++; from = k + q.length; } }
    });
    if (!total) throw new Error('No matches found (text may be an image or outlined).');
    rebuild(); status.textContent = `Marked ${total} match(es). Review each page before applying.`;
  }));
  const out = h('div');
  const go = button('Apply redaction', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const doc = PdfDocument.load(loaded.bytes);
    let removed = 0, pagesDone = 0;
    for (const [i, rects] of rectsByPage) { if (!rects.length) continue; const r = await redactPage(doc, i, rects.map((x) => ({ x: x.x, y: x.y, w: x.w, h: x.h })), { color: color.value, removeText: removeText.input.checked }); removed += r.removed; pagesDone++; }
    if (!pagesDone) throw new Error('Draw at least one region.');
    const bytes = await doc.save();
    // verify
    let leak = false;
    if (removeText.input.checked && search.value.trim()) { const check = PdfDocument.load(bytes); const q = search.value.trim().toLowerCase(); for (const p of check.pages) if (extractPageText(check, p).toLowerCase().includes(q)) leak = true; }
    out.replaceChildren(engineNote(), notice(`${pagesDone} page(s) redacted, ${removed} text glyph(s) permanently removed.` + (leak ? ' Warning: the search text still appears elsewhere — mark those areas too.' : search.value.trim() && removeText.input.checked ? ' Verified: the search text no longer appears in the document text.' : ''), leak ? 'warn' : 'ok'), result({ title: 'Redacted PDF', data: bytes, name: outName(loaded.file, 'redacted', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; pageIdx = 0; rectsByPage.clear(); rebuild(); } })),
      section('2. Mark regions', notice('Drag on the page to draw a box. Text under the box is deleted from the file, then a solid rectangle is painted. Images under the box are covered, and links/annotations there are removed.'), field('Find text', h('div.row', search, findBtn)), h('div.grid2', field('Box colour', color)), removeText, go)),
    h('div', h('div.row', pageSel, status), boxHost, out)));
}
