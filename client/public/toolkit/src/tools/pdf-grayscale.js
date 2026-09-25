import { h, field, button, run, result, pdfPreview, section, outName, checkbox, notice, input, decodeToImageData } from '../core/ui.js';
import { pdfPicker, parsePageRange, engineNote, PdfDocument } from './_pdf-common.js';
import { grayscalePdf } from '../core/pdf/pdfkit.js';

export function mount(root) {
  let loaded = null;
  const convertImages = checkbox('Convert embedded images to true grayscale (smaller file, slower)', true);
  const pages = input('text', { placeholder: 'All pages (e.g. 1-3)', class: 'wide' });
  const out = h('div');
  const go = button('Convert to grayscale', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    const doc = PdfDocument.load(loaded.bytes);
    const stats = await grayscalePdf(doc, { convertImages: convertImages.input.checked, pages: parsePageRange(pages.value, doc.pages.length), decodeJpeg: async (bytes) => { const d = await decodeToImageData(new Blob([bytes], { type: 'image/jpeg' })); return { width: d.width, height: d.height, rgba: d.data.data }; } });
    const bytes = await doc.save();
    out.replaceChildren(engineNote(), notice(`Pages desaturated: ${stats?.pages ?? doc.pages.length}. Images converted: ${stats?.images ?? 0}.`, 'ok'), result({ title: 'Grayscale PDF', data: bytes, name: outName(loaded.file, 'grayscale', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; } })), section('2. Options', convertImages, field('Pages', pages), notice('Vector graphics and text are desaturated with a blend layer (supported by all modern viewers); images are rewritten as DeviceGray.'), go)),
    h('div', out)));
}
