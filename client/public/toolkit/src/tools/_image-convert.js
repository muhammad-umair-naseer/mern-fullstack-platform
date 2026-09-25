// Shared "decode with the browser, re-encode with canvas" converter used by HEIC and AVIF tools.
import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, canvasToBlob, loadImage, imagePreview, fmtBytes } from '../core/ui.js';
import { writeZip } from '../core/zip.js';

export function imageConverter(root, { accept, label, formats = [['image/jpeg', 'JPG'], ['image/png', 'PNG'], ['image/webp', 'WebP']], intro = null, supportNote = null, decodeHint }) {
  let files = []; const chips = h('div');
  const format = select(formats, formats[0][0]);
  const quality = range(90, { min: 40, max: 100, step: 5, format: (v) => v + '%' });
  const bg = select([['#ffffff', 'White'], ['#000000', 'Black'], ['transparent', 'Transparent (PNG/WebP)']], '#ffffff');
  const out = h('div');
  const go = button('Convert', () => run(go, async () => {
    if (!files.length) throw new Error('Add files first.');
    const results = []; const errors = [];
    for (const f of files) {
      try {
        const img = await loadImage(f);
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (format.value === 'image/jpeg' || bg.value !== 'transparent') { ctx.fillStyle = bg.value === 'transparent' ? '#ffffff' : bg.value; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(c, format.value, quality.getValue() / 100);
        if (blob.type !== format.value) throw new Error(`${format.value} output is not available here — try PNG or JPG.`);
        results.push({ file: f, blob, width: c.width, height: c.height });
      } catch (e) { errors.push(`${f.name}: ${decodeHint && /decode/i.test(e.message) ? decodeHint : e.message}`); }
    }
    out.replaceChildren();
    if (errors.length) out.append(h('div.error', h('strong', `${errors.length} file(s) could not be converted. `), h('ul', errors.map((e) => h('li', e)))));
    const ext = format.value === 'image/jpeg' ? 'jpg' : format.value === 'image/png' ? 'png' : 'webp';
    for (const r of results) out.append(result({ title: `${r.width}×${r.height}`, data: r.blob, name: outName(r.file, '', ext), mime: format.value, note: `from ${fmtBytes(r.file.size)}`, preview: imagePreview(r.blob) }));
    if (results.length > 1) { const entries = []; for (const r of results) entries.push({ name: outName(r.file, '', ext), data: new Uint8Array(await r.blob.arrayBuffer()), level: 0 }); const zip = await writeZip(entries); out.prepend(result({ title: `All ${results.length} images as ZIP`, data: zip, name: `converted-${ext}.zip`, mime: 'application/zip' })); }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Add images', intro, dropzone({ accept, multiple: true, label, onFiles: (fs) => { files.push(...fs); chips.replaceChildren(...files.map((f, i) => fileChip(f, () => { files.splice(i, 1); f.chip?.remove(); }))); } }), chips), section('2. Output', field('Format', format), field('Quality (JPG/WebP)', quality), field('Background for transparent areas', bg), supportNote, go)), h('div', out)));
}
