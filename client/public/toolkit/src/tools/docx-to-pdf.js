import { h, field, select, button, run, result, pdfPreview, section, outName, dropzone, fileChip, readAs, notice, decodeToImageData, number } from '../core/ui.js';
import { parseDocx, renderDocxToPdf } from '../core/formats/office.js';
import { PdfBuilder } from '../core/pdf/pdfkit.js';
import { engineNote } from './_pdf-common.js';

export function mount(root) {
  let file = null; const chips = h('div');
  const pageSize = select([['A4', 'A4'], ['Letter', 'US Letter'], ['Legal', 'Legal'], ['A5', 'A5']], 'A4');
  const margins = number(56, { min: 18, max: 120 });
  const out = h('div');
  const go = button('Convert to PDF', () => run(go, async () => {
    if (!file) throw new Error('Choose a .docx file first.');
    const bytes = await readAs(file);
    const { blocks, meta } = parseDocx(bytes);
    const b = new PdfBuilder({ pageSize: pageSize.value, margins: Number(margins.value) });
    await renderDocxToPdf(b, blocks, { decodeImage: async (img) => { if (!/png|jpe?g|gif|webp|bmp/.test(img.contentType)) return null; try { const d = await decodeToImageData(new Blob([img.data], { type: img.contentType }), { maxSide: 2000 }); return { rgba: d.data.data, width: d.width, height: d.height }; } catch { return null; } } });
    const pdf = await b.finish({ title: meta.title || file.name.replace(/\.docx$/i, ''), author: meta.creator || undefined });
    out.replaceChildren(engineNote(), notice('Layout is re-flowed by the built-in renderer with standard PDF fonts; complex Word layouts (columns, text boxes, SmartArt) are simplified.'), result({ title: 'PDF document', data: pdf, name: outName(file, '', 'pdf'), mime: 'application/pdf', preview: pdfPreview(pdf) }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose Word document', dropzone({ accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document', onFiles: ([f]) => { file = f; chips.replaceChildren(fileChip(f)); } }), chips), section('2. Page setup', h('div.grid2', field('Page size', pageSize), field('Margins (pt)', margins)), go)), h('div', out)));
}
