import { h, field, select, number, colorInput, button, run, result, pdfPreview, section, outName, input } from '../core/ui.js';
import { pdfPicker, parsePageRange, engineNote, PdfDocument } from './_pdf-common.js';
import { addPageNumbers } from '../core/pdf/pdfkit.js';

export function mount(root) {
  let loaded = null;
  const format = select([['Page {n} of {N}', 'Page 1 of 10'], ['{n}', '1'], ['{n} / {N}', '1 / 10'], ['- {n} -', '- 1 -'], ['{prefix}{n}', 'Prefix + number (e.g. A-1)'], ['custom', 'Custom…']], 'Page {n} of {N}');
  const custom = input('text', { value: 'Page {n} of {N}', class: 'wide', placeholder: 'Use {n} number, {N} total, {p} physical page, {prefix}' });
  const customField = field('Custom format', custom, '{n} = number, {N} = total, {p} = physical page, {P} = page count, {prefix}'); customField.hidden = true;
  format.addEventListener('change', () => { customField.hidden = format.value !== 'custom'; });
  const prefix = input('text', { placeholder: 'e.g. A-', class: 'wide' });
  const style = select([['arabic', '1, 2, 3'], ['roman', 'i, ii, iii'], ['ROMAN', 'I, II, III'], ['letters', 'A, B, C'], ['pad3', '001, 002 (padded)']], 'arabic');
  const hpos = select([['center', 'Centre'], ['left', 'Left'], ['right', 'Right']], 'center');
  const vpos = select([['bottom', 'Bottom'], ['top', 'Top']], 'bottom');
  const margin = number(36, { min: 6, max: 200 });
  const fontSize = number(10, { min: 6, max: 48 });
  const font = select([['Helvetica', 'Helvetica'], ['Helvetica-Bold', 'Helvetica Bold'], ['Times-Roman', 'Times'], ['Times-Italic', 'Times Italic'], ['Courier', 'Courier']], 'Helvetica');
  const color = colorInput('#000000');
  const start = number(1, { min: 0, max: 99999 });
  const skip = number(0, { min: 0, max: 100 });
  const pages = input('text', { placeholder: 'All pages (e.g. 2-20)', class: 'wide' });
  const out = h('div');
  const go = button('Add page numbers', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const doc = PdfDocument.load(loaded.bytes);
    const idx = parsePageRange(pages.value, doc.pages.length);
    await addPageNumbers(doc, { format: format.value === 'custom' ? custom.value : format.value, prefix: prefix.value, style: style.value === 'pad3' ? 'arabic' : style.value, pad: style.value === 'pad3' ? 3 : 0, h: hpos.value, v: vpos.value, margin: Number(margin.value), fontSize: Number(fontSize.value), fontName: font.value, color: color.value, start: Number(start.value), skip: Number(skip.value), pages: idx });
    const bytes = await doc.save();
    out.replaceChildren(engineNote(), result({ title: 'Numbered PDF', data: bytes, name: outName(loaded.file, 'numbered', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; } })),
      section('2. Numbering', field('Format', format), customField, h('div.grid2', field('Style', style), field('Prefix (for {prefix})', prefix)), h('div.grid2', field('Horizontal', hpos), field('Vertical', vpos)), h('div.grid2', field('Margin (pt)', margin), field('Font size', fontSize)), h('div.grid2', field('Font', font), field('Colour', color)), h('div.grid2', field('Start at', start), field('Skip first N pages (cover)', skip)), field('Only these pages', pages), go)),
    h('div', out)));
}
