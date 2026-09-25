import { h, field, select, number, range, colorInput, checkbox, button, run, result, pdfPreview, section, outName, decodeToImageData, dropzone, textarea, input } from '../core/ui.js';
import { pdfPicker, parsePageRange, engineNote } from './_pdf-common.js';
import { addWatermark, embedImage } from '../core/pdf/pdfkit.js';

export function mount(root) {
  let loaded = null, image = null;
  const text = input('text', { value: 'CONFIDENTIAL', class: 'wide' });
  const font = select([['Helvetica-Bold', 'Helvetica Bold'], ['Helvetica', 'Helvetica'], ['Times-Bold', 'Times Bold'], ['Times-Roman', 'Times'], ['Courier-Bold', 'Courier Bold']], 'Helvetica-Bold');
  const size = select([['auto', 'Auto (fit diagonal)'], [24, '24'], [36, '36'], [48, '48'], [72, '72'], [96, '96'], [120, '120']], 'auto');
  const color = colorInput('#cc0000');
  const opacity = range(30, { min: 5, max: 100, step: 5, format: (v) => v + '%' });
  const angle = range(45, { min: -90, max: 90, step: 5, format: (v) => v + '°' });
  const position = select([['center', 'Centre'], ['tile', 'Tiled (repeat)'], ['tl', 'Top left'], ['tr', 'Top right'], ['bl', 'Bottom left'], ['br', 'Bottom right'], ['top', 'Top centre'], ['bottom', 'Bottom centre']], 'center');
  const imgScale = range(40, { min: 5, max: 100, step: 5, format: (v) => v + '% of page width' });
  const behind = checkbox('Place behind page content', false);
  const pages = input('text', { placeholder: 'All pages (e.g. 1,3-5)', class: 'wide' });
  const mode = select([['text', 'Text watermark'], ['image', 'Image / logo watermark']], 'text');
  const imgZone = dropzone({ accept: 'image/*', label: 'Drop a PNG/JPG/SVG logo', compact: true, onFiles: async ([f]) => { const d = await decodeToImageData(f, { maxSide: 1500 }); image = { rgba: d.data.data, width: d.width, height: d.height, name: f.name }; imgZone.setLabel('Logo: ' + f.name + ' ✓'); } });
  const textOpts = h('div', field('Watermark text', text), h('div.grid2', field('Font', font), field('Font size', size)), field('Colour', color));
  const imgOpts = h('div', { hidden: true }, field('Logo image', imgZone), field('Logo size', imgScale));
  mode.addEventListener('change', () => { textOpts.hidden = mode.value !== 'text'; imgOpts.hidden = mode.value !== 'image'; });
  const out = h('div');
  const go = button('Apply watermark', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const { doc } = await loadFresh();
    const idx = parsePageRange(pages.value, doc.pages.length);
    const posMap = { tl: { x: 0.15, y: 0.08 }, tr: { x: 0.85, y: 0.08 }, bl: { x: 0.15, y: 0.94 }, br: { x: 0.85, y: 0.94 }, top: { x: 0.5, y: 0.06 }, bottom: { x: 0.5, y: 0.95 } };
    const opts = { opacity: opacity.getValue() / 100, angle: angle.getValue(), position: posMap[position.value] || position.value, behind: behind.input.checked, pages: idx };
    if (mode.value === 'image') { if (!image) throw new Error('Choose a logo image.'); opts.image = await embedImage(doc, image); opts.imageScale = imgScale.getValue() / 100; }
    else { opts.text = text.value || ' '; opts.fontName = font.value; opts.fontSize = size.value === 'auto' ? 'auto' : Number(size.value); opts.color = color.value; }
    await addWatermark(doc, opts);
    const bytes = await doc.save();
    out.replaceChildren(engineNote(), result({ title: 'Watermarked PDF', data: bytes, name: outName(loaded.file, 'watermarked', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  async function loadFresh() { const { PdfDocument } = await import('../core/pdf/document.js'); return { doc: PdfDocument.load(loaded.bytes) }; }
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; } })), section('2. Watermark', field('Type', mode), textOpts, imgOpts, h('div.grid2', field('Position', position), field('Pages', pages)), field('Opacity', opacity), field('Rotation', angle), behind, go)),
    h('div', out)));
}
