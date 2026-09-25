import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixture, save, qpdfCheck, pdfText, has, sh } from './_helpers.mjs';
import { PdfDocument } from '../../src/core/pdf/document.js';
import * as K from '../../src/core/pdf/pdfkit.js';
import { extractPageText } from '../../src/core/pdf/content.js';
import { decodePng } from '../../src/core/image-codecs.js';

const load = (f) => PdfDocument.load(fixture(f));
test('parses classic, object-stream, linearized, uncompressed and rotated fixtures; round-trips text', async () => {
  for (const f of ['classic.pdf', 'objstm.pdf', 'linearized.pdf', 'uncompressed.pdf', 'rotated.pdf', 'sample.pdf', 'outlines.pdf']) {
    const doc = load(f);
    assert.ok(doc.pages.length >= 1, f);
    const before = doc.pages.map((p) => extractPageText(doc, p)).join('\n');
    const out = await doc.save();
    const p = save('rt-' + f, out); qpdfCheck(p);
    const d2 = PdfDocument.load(out);
    assert.equal(d2.pages.length, doc.pages.length);
    assert.equal(d2.pages.map((p) => extractPageText(d2, p)).join('\n'), before, 'text preserved ' + f);
  }
  const c = load('classic.pdf');
  assert.match(extractPageText(c, c.pages[0]), /Secret: 12345-6789012-3/);
});
test('watermark (text, tiled, image behind) on normal and rotated pages', async () => {
  const doc = load('classic.pdf');
  await K.addWatermark(doc, { text: 'CONFIDENTIAL', opacity: 0.25, angle: 45, color: '#ff0000' });
  const p = save('wm.pdf', await doc.save()); qpdfCheck(p);
  const t = pdfText(p); if (t !== null) assert.match(t.replace(/[\s|]/g, ''), /CONFIDENTIAL/);
  const d2 = load('rotated.pdf'); await K.addWatermark(d2, { text: 'DRAFT', position: 'tile', opacity: 0.2, fontSize: 24 }); qpdfCheck(save('wm-tile.pdf', await d2.save()));
  const d3 = load('sample.pdf'); const png = decodePng(fixture('alpha.png'));
  const img = await K.embedImage(d3, { rgba: png.data, width: png.width, height: png.height });
  await K.addWatermark(d3, { image: img, opacity: 0.4, imageScale: 0.4, behind: true }); qpdfCheck(save('wm-img.pdf', await d3.save()));
});
test('page numbers with formats, skip and roman style', async () => {
  const doc = load('rotated.pdf'); await K.addPageNumbers(doc, { format: 'Page {n} of {N}', h: 'right', v: 'bottom' });
  const p = save('pn.pdf', await doc.save()); qpdfCheck(p);
  const t = pdfText(p); if (t !== null) { assert.match(t, /Page 1 of 3/); assert.match(t, /Page 3 of 3/); }
  const d2 = load('sample.pdf'); await K.addPageNumbers(d2, { format: '{prefix}{n}', prefix: 'p. ', style: 'roman', skip: 1, v: 'top' });
  const t2 = pdfText(save('pn2.pdf', await d2.save())); if (t2 !== null) { assert.match(t2, /p\. i/); assert.doesNotMatch(t2, /p\. ii/); }
});
test('stamp image + text (e-sign) and metadata', async () => {
  const doc = load('classic.pdf');
  const jimg = await K.embedImage(doc, { jpeg: fixture('color.jpg') });
  await K.stampImage(doc, doc.pages[0], jimg, { x: 40, y: 40, w: 120, h: 80 }, { opacity: 0.8 });
  await K.stampText(doc, doc.pages[1], 'Signed by Umair', { x: 60, y: 60, fontSize: 12 });
  K.setMetadata(doc, { title: 'Signed', author: 'Cortexis' });
  const out = await doc.save(); const p = save('sign.pdf', out); qpdfCheck(p);
  const d2 = PdfDocument.load(out); assert.equal(K.getMetadata(d2).title, 'Signed');
  const t = pdfText(p); if (t !== null) assert.match(t, /Signed by Umair/);
  if (has('pdfimages')) assert.match(sh(`pdfimages -list "${p}"`), /image/);
});
test('grayscale: white backdrop + saturation layer + DeviceGray images', async () => {
  const doc = load('sample.pdf');
  const stats = await K.grayscalePdf(doc, { convertImages: true });
  assert.ok(stats.pages >= 1);
  const p = save('gray.pdf', await doc.save()); qpdfCheck(p);
  if (has('pdftoppm') && has('python3')) {
    sh(`pdftoppm -r 30 -png -f 1 -l 1 "${p}" "${p}.g"`);
    const spread = sh(`python3 -c "from PIL import Image; im=Image.open('${p}.g-1.png').convert('RGB'); print(max(max(px)-min(px) for px in im.getdata()))" 2>/dev/null`);
    assert.ok(Number(spread) <= 8, 'rendered page should be gray, channel spread ' + spread);
  }
});
test('redaction removes text under the box and keeps the rest', async () => {
  const doc = load('classic.pdf');
  const page = doc.pages[0];
  // locate the secret via the page layout helper (same code path the redact tool uses)
  const { pageLayout } = await import('../../src/tools/_pdf-common.js');
  const { items } = pageLayout(doc, page);
  const hit = items.find((it) => !it.image && it.text.includes('Secret'));
  assert.ok(hit, 'layout finds the secret line');
  const frac = hit.text.indexOf('12345') / hit.text.length;
  const rect = { x: hit.x + hit.w * frac - 0.002, y: hit.y - hit.h * 0.15, w: hit.w * (1 - frac) + 0.004, h: hit.h * 1.3 };
  const r = await K.redactPage(doc, 0, [rect], { removeText: true });
  assert.ok(r.removed > 0, 'glyphs removed');
  const out = await doc.save(); qpdfCheck(save('redact.pdf', out));
  const d2 = PdfDocument.load(out); const t = extractPageText(d2, d2.pages[0]);
  assert.doesNotMatch(t, /12345-6789012-3/);
  assert.match(t, /Hello page 1/);
});
test('outlines read/write round-trip + TOC page inserted at the front', async () => {
  const doc = load('outlines.pdf');
  const items = K.readOutlines(doc);
  assert.ok(items.length >= 2 && items.some((i) => i.children.length), JSON.stringify(items));
  const before = doc.pages.length;
  const b = new K.PdfBuilder({ doc });
  b.text('Table of Contents', { fontName: 'Helvetica-Bold', size: 20 });
  b.flushPage(); await Promise.all(b.pendingStreams);
  doc.movePage(doc.pages.length - 1, 0);
  const shifted = JSON.parse(JSON.stringify(items)); const shift = (l) => l.forEach((i) => { i.page += 1; shift(i.children); }); shift(shifted);
  K.writeOutlines(doc, [{ title: 'Contents', page: 0, children: [] }, ...shifted]);
  const out = await doc.save(); const p = save('toc.pdf', out); qpdfCheck(p);
  const d2 = PdfDocument.load(out);
  assert.equal(d2.pages.length, before + 1);
  assert.match(extractPageText(d2, d2.pages[0]), /Table of Contents/);
  const back = K.readOutlines(d2); assert.equal(back[0].title, 'Contents'); assert.equal(back[1].page, items[0].page + 1);
});
test('PdfBuilder: text, rich runs, bullets, table with header repeat, images', async () => {
  const b = new K.PdfBuilder({ pageSize: 'A4', margins: 50 });
  b.text('Report', { fontName: 'Helvetica-Bold', size: 20, spaceAfter: 10 });
  b.rich([{ text: 'Bold ', bold: true }, { text: 'italic ', italic: true }, { text: 'mono', mono: true }], { size: 11, spaceAfter: 6 });
  for (let i = 0; i < 3; i++) b.rich([{ text: 'bullet ' + i }], { indent: 18, bullet: { text: '•', offset: 12 } });
  const png = decodePng(fixture('color.png'));
  await b.image({ rgba: png.data, width: png.width, height: png.height }, { width: 120 });
  b.table([['Name', 'Qty', 'Price'], ...Array.from({ length: 60 }, (_, i) => [`Item ${i}`, String(i), (i * 1.5).toFixed(2)])], { fontSize: 9, aligns: ['left', 'right', 'right'] });
  const out = await b.finish({ title: 'Builder test' });
  const p = save('builder.pdf', out); qpdfCheck(p);
  const d = PdfDocument.load(out); assert.ok(d.pages.length >= 2, 'table spans pages');
  const t = pdfText(p); if (t !== null) { assert.match(t, /Report/); assert.match(t, /Item 59/); }
});
