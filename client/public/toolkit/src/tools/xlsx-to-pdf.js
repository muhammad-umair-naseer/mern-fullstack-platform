import { h, field, select, button, run, result, pdfPreview, section, outName, dropzone, fileChip, readAs, checkbox, number, notice } from '../core/ui.js';
import { parseXlsx, renderXlsxToPdf } from '../core/formats/office.js';
import { PdfBuilder } from '../core/pdf/pdfkit.js';
import { engineNote } from './_pdf-common.js';

export function mount(root) {
  let file = null; const chips = h('div'); let sheetsAvail = [];
  const orientation = select([['landscape', 'Landscape'], ['portrait', 'Portrait']], 'landscape');
  const pageSize = select([['A4', 'A4'], ['Letter', 'US Letter'], ['A3', 'A3'], ['Legal', 'Legal']], 'A4');
  const fontSize = number(8, { min: 5, max: 14 });
  const header = checkbox('First row is a header (repeat on each page)', true);
  const grid = checkbox('Draw gridlines', true);
  const sheetPick = h('div.pill-list');
  const out = h('div');
  const go = button('Convert to PDF', () => run(go, async () => {
    if (!file) throw new Error('Choose an .xlsx file first.');
    const { sheets, meta } = parseXlsx(await readAs(file));
    const chosen = [...sheetPick.querySelectorAll('button.on')].map((b) => b.dataset.name);
    const list = sheets.filter((s) => !chosen.length || chosen.includes(s.name));
    const b = new PdfBuilder({ pageSize: pageSize.value, landscape: orientation.value === 'landscape', margins: 36 });
    renderXlsxToPdf(b, list, { fontSize: Number(fontSize.value), headerRow: header.input.checked, gridlines: grid.input.checked });
    const pdf = await b.finish({ title: meta.title || file.name.replace(/\.xlsx$/i, '') });
    out.replaceChildren(engineNote(), result({ title: 'PDF workbook', data: pdf, name: outName(file, '', 'pdf'), mime: 'application/pdf', preview: pdfPreview(pdf) }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose Excel workbook', dropzone({ accept: '.xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', onFiles: async ([f]) => { file = f; chips.replaceChildren(fileChip(f)); try { sheetsAvail = parseXlsx(await readAs(f)).sheets; sheetPick.replaceChildren(...sheetsAvail.map((s) => h('button.on', { dataset: { name: s.name }, onClick: (e) => e.target.classList.toggle('on') }, `${s.name} (${s.rows.length} rows)`))); } catch (e) { out.replaceChildren(h('div.error', e.message)); } } }), chips, field('Sheets to include', sheetPick)), section('2. Page setup', h('div.grid2', field('Orientation', orientation), field('Page size', pageSize)), field('Font size', fontSize), header, grid, notice('Values and cached formula results are exported; charts and conditional formatting are not.'), go)), h('div', out)));
}
