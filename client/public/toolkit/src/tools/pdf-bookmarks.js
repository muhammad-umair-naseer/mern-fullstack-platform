import { h, field, button, run, result, pdfPreview, section, outName, notice, checkbox, textarea, input, number, select } from '../core/ui.js';
import { pdfPicker, engineNote, PdfDocument } from './_pdf-common.js';
import { readOutlines, writeOutlines, PdfBuilder } from '../core/pdf/pdfkit.js';
import { extractPageText } from '../core/pdf/content.js';

export function mount(root) {
  let loaded = null; let items = [];
  const tree = h('div.tree');
  const render = () => {
    tree.replaceChildren();
    const ul = (list, parentList) => h('ul', list.map((it, i) => h('li', h('div.node',
      input('text', { value: it.title, class: 'wide', onInput: (e) => { it.title = e.target.value; } }),
      h('span.small.muted', 'p.'), number(it.page + 1, { min: 1, max: loaded ? loaded.doc.pages.length : 9999, onChange: (v) => { it.page = Math.max(0, v - 1); } }),
      button('+ child', () => { (it.children ||= []).push({ title: 'New bookmark', page: it.page, children: [] }); render(); }, 'small'),
      button('↑', () => { if (i > 0) { parentList.splice(i, 1); parentList.splice(i - 1, 0, it); render(); } }, 'small'),
      button('↓', () => { if (i < parentList.length - 1) { parentList.splice(i, 1); parentList.splice(i + 1, 0, it); render(); } }, 'small'),
      button('×', () => { parentList.splice(i, 1); render(); }, 'small danger')),
      it.children && it.children.length ? ul(it.children, it.children) : null)));
    tree.append(items.length ? ul(items, items) : h('p.muted', 'No bookmarks yet. Add some, import from text, or auto-detect headings.'));
  };
  const addTop = button('+ Add bookmark', () => { items.push({ title: 'New bookmark', page: 0, children: [] }); render(); });
  const importTa = textarea({ rows: 6, placeholder: 'One per line: "Title | page". Indent with two spaces for children.\nIntroduction | 1\n  Scope | 2\nChapter 1 | 3', class: 'mono' });
  const importBtn = button('Import from text', () => {
    const lines = importTa.value.split('\n').filter((l) => l.trim());
    const stack = [{ children: [], depth: -1 }];
    for (const line of lines) { const depth = line.match(/^ */)[0].length / 2; const [t, p] = line.trim().split('|').map((s) => s.trim()); const node = { title: t || 'Untitled', page: Math.max(0, (parseInt(p, 10) || 1) - 1), children: [] }; while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop(); stack[stack.length - 1].children.push(node); stack.push({ ...node, depth }); }
    items = stack[0].children; render();
  });
  const autoBtn = button('Auto-detect headings', () => run(autoBtn, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const found = [];
    loaded.doc.pages.forEach((p, i) => { const t = extractPageText(loaded.doc, p).split('\n').map((s) => s.trim()).filter(Boolean); const first = t.find((l) => l.length > 2 && l.length < 80 && !/[.;:,]$/.test(l)); if (first) found.push({ title: first, page: i, children: [] }); });
    if (!found.length) throw new Error('No text headings detected.');
    items = found; render();
  }));
  const toc = checkbox('Insert a "Table of Contents" page at the start', false);
  const tocTitle = input('text', { value: 'Table of Contents', class: 'wide' });
  const showOnOpen = checkbox('Show bookmarks panel when the PDF opens', true);
  const out = h('div');
  const go = button('Save bookmarks', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const doc = PdfDocument.load(loaded.bytes);
    let list = JSON.parse(JSON.stringify(items));
    if (toc.input.checked) {
      // build a TOC page in a separate builder, then insert as first page; shift bookmark targets by 1
      const before = doc.pages.length;
      const b = new PdfBuilder({ doc, pageSize: doc.pages.length ? [doc.pageGeometry(doc.pages[0]).width, doc.pageGeometry(doc.pages[0]).height] : 'A4' });
      b.text(tocTitle.value || 'Contents', { fontName: 'Helvetica-Bold', size: 20, spaceAfter: 14 });
      const walk = (l, depth) => { for (const it of l) { const size = 11 - Math.min(depth, 2); b.ensure(size * 1.5); const yTop = b.y; b.rich([{ text: it.title, size }], { indent: depth * 16, spaceAfter: 4 }); b.drawText(String(it.page + 2), b.pw - b.m.right, yTop - size * 1.35 + size * 0.25 * 1.35, { size: 10, align: 'right', color: '#555555' }); walk(it.children || [], depth + 1); } };
      walk(list, 0);
      b.flushPage(); await Promise.all(b.pendingStreams);
      const added = doc.pages.length - before;
      for (let k = 0; k < added; k++) doc.movePage(before + k, k);
      const shift = (l) => l.forEach((it) => { it.page += added; shift(it.children || []); });
      shift(list);
      list.unshift({ title: tocTitle.value || 'Contents', page: 0, children: [] });
    }
    writeOutlines(doc, list, { showOnOpen: showOnOpen.input.checked });
    const bytes = await doc.save();
    out.replaceChildren(engineNote(), result({ title: 'PDF with bookmarks', data: bytes, name: outName(loaded.file, 'bookmarks', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; items = readOutlines(l.doc); render(); } })),
      section('2. Import / detect', importTa, h('div.row', importBtn, autoBtn)),
      section('3. Save', toc, field('TOC page title', tocTitle), showOnOpen, go)),
    h('div', section('Bookmark tree', tree, addTop), out)));
  render();
}
