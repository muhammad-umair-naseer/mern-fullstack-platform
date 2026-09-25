import { h, field, select, button, run, result, pdfPreview, section, outName, dropzone, fileChip, readAs, number, decodeToImageData, range, notice, blobBytes, canvasToBlob } from '../core/ui.js';
import { PdfBuilder, embedImage, PAGE_SIZES } from '../core/pdf/pdfkit.js';
import { PdfDocument } from '../core/pdf/document.js';
import { isJpeg } from '../core/image-codecs.js';
import { engineNote } from './_pdf-common.js';

export function mount(root) {
  let files = []; const list = h('div');
  const pageSize = select([['fit', 'Fit each page to the image'], ['A4', 'A4'], ['Letter', 'US Letter'], ['Legal', 'Legal'], ['A5', 'A5'], ['A3', 'A3']], 'A4');
  const orientation = select([['auto', 'Auto (match image)'], ['portrait', 'Portrait'], ['landscape', 'Landscape']], 'auto');
  const margin = number(24, { min: 0, max: 100 });
  const fit = select([['contain', 'Fit inside margins'], ['fill', 'Fill page (crop)'], ['actual', 'Actual size (96 dpi)']], 'contain');
  const quality = range(85, { min: 40, max: 100, step: 5, format: (v) => v + '%' });
  const recompress = select([['keep', 'Keep JPEG as-is, PNG lossless'], ['jpeg', 'Recompress all as JPEG (smaller)']], 'keep');
  const renderList = () => list.replaceChildren(...files.map((f, i) => h('div.chip', h('span.chip-name', `${i + 1}. ${f.name}`), h('button.chip-x', { title: 'Move up', onClick: () => { if (i) { [files[i - 1], files[i]] = [files[i], files[i - 1]]; renderList(); } } }, '↑'), h('button.chip-x', { title: 'Remove', onClick: () => { files.splice(i, 1); renderList(); } }, '×'))));
  const out = h('div');
  const go = button('Create PDF', () => run(go, async () => {
    if (!files.length) throw new Error('Add at least one image.');
    const doc = PdfDocument.create();
    for (const f of files) {
      let img;
      const bytes = await readAs(f);
      if (isJpeg(bytes) && recompress.value === 'keep') { const d = await decodeToImageData(f); img = { jpeg: bytes, width: d.width, height: d.height }; }
      else {
        const d = await decodeToImageData(f, { maxSide: 4000 });
        if (recompress.value === 'jpeg') { const blob = await canvasToBlob(d.canvas, 'image/jpeg', quality.getValue() / 100); img = { jpeg: await blobBytes(blob), width: d.width, height: d.height }; }
        else img = { rgba: d.data.data, width: d.width, height: d.height };
      }
      const emb = await embedImage(doc, img);
      let pw, ph;
      const m = Number(margin.value);
      if (pageSize.value === 'fit') { pw = emb.width * 0.75 + m * 2; ph = emb.height * 0.75 + m * 2; }
      else { [pw, ph] = PAGE_SIZES[pageSize.value]; const land = orientation.value === 'landscape' || (orientation.value === 'auto' && emb.width > emb.height); if (land) [pw, ph] = [ph, pw]; }
      const page = doc.addPage({ width: pw, height: ph });
      const aw = pw - m * 2, ah = ph - m * 2;
      let w, hh;
      if (fit.value === 'actual') { w = emb.width * 0.75; hh = emb.height * 0.75; }
      else { const s = fit.value === 'fill' ? Math.max(aw / emb.width, ah / emb.height) : Math.min(aw / emb.width, ah / emb.height); w = emb.width * s; hh = emb.height * s; }
      const x = m + (aw - w) / 2, y = m + (ah - hh) / 2;
      const { addXObject } = await import('../core/pdf/pdfkit.js');
      const key = addXObject(doc, page, emb.ref);
      let ops = `q ${w.toFixed(2)} 0 0 ${hh.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /${key} Do Q`;
      if (fit.value === 'fill') ops = `q ${m} ${m} ${aw.toFixed(2)} ${ah.toFixed(2)} re W n ${ops} Q`;
      await doc.setPageContent(page, ops);
    }
    const pdf = await doc.save();
    out.replaceChildren(engineNote(), result({ title: 'PDF from images', data: pdf, name: files.length === 1 ? outName(files[0], '', 'pdf') : 'images.pdf', mime: 'application/pdf', preview: pdfPreview(pdf) }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Add images', dropzone({ accept: 'image/*,.svg', multiple: true, pasteImages: true, label: 'Drop images (JPG, PNG, WebP, GIF, BMP, SVG) — or paste', onFiles: (fs) => { files.push(...fs); renderList(); } }), list), section('2. Layout', h('div.grid2', field('Page size', pageSize), field('Orientation', orientation)), h('div.grid2', field('Margin (pt)', margin), field('Fit', fit)), field('Image encoding', recompress), field('JPEG quality', quality), go)), h('div', out)));
}
