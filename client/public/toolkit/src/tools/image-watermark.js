import { h, field, select, button, run, result, section, outName, dropzone, fileChip, range, notice, decodeToImageData, canvasToBlob, imagePreview, colorInput, input, checkbox, number } from '../core/ui.js';
import { writeZip } from '../core/zip.js';

export function mount(root) {
  let files = [], logo = null; const chips = h('div'); const out = h('div'); const previewHost = h('div.preview-box');
  const kind = select([['text', 'Text'], ['logo', 'Logo image']], 'text');
  const text = input('text', { value: '© Cortexis', class: 'wide' });
  const font = select([['Arial, Helvetica, sans-serif', 'Sans'], ['Georgia, serif', 'Serif'], ['Impact, "Arial Black", sans-serif', 'Impact'], ['"Courier New", monospace', 'Mono']], 'Arial, Helvetica, sans-serif');
  const color = colorInput('#ffffff'); const stroke = checkbox('Dark outline for readability', true);
  const size = range(5, { min: 1, max: 30, format: (v) => v + '% of width' });
  const opacity = range(60, { min: 5, max: 100, step: 5, format: (v) => v + '%' });
  const position = select([['br', 'Bottom right'], ['bl', 'Bottom left'], ['tr', 'Top right'], ['tl', 'Top left'], ['c', 'Centre'], ['tile', 'Tiled']], 'br');
  const angle = range(0, { min: -90, max: 90, step: 5, format: (v) => v + '°' });
  const margin = range(3, { min: 0, max: 15, format: (v) => v + '%' });
  const outFmt = select([['same', 'Same as input'], ['image/jpeg', 'JPG'], ['image/png', 'PNG'], ['image/webp', 'WebP']], 'same');
  const quality = range(90, { min: 50, max: 100, step: 5, format: (v) => v + '%' });
  const logoZone = dropzone({ accept: 'image/*', compact: true, label: 'Drop logo (PNG with transparency)', onFiles: async ([f]) => { logo = (await decodeToImageData(f, { maxSide: 1500 })).canvas; logoZone.setLabel('Logo: ' + f.name + ' ✓'); preview(); } });
  const apply = (canvas) => {
    const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
    ctx.save(); ctx.globalAlpha = opacity.getValue() / 100;
    const s = (size.getValue() / 100) * W; const m = (margin.getValue() / 100) * W;
    let mw, mh; if (kind.value === 'text') { ctx.font = `bold ${s}px ${font.value}`; mw = ctx.measureText(text.value).width; mh = s; } else if (logo) { mw = s * 3; mh = (mw * logo.height) / logo.width; } else { ctx.restore(); return; }
    const drawAt = (x, y) => { ctx.save(); ctx.translate(x + mw / 2, y + mh / 2); ctx.rotate((angle.getValue() * Math.PI) / 180); if (kind.value === 'text') { ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; if (stroke.input.checked) { ctx.lineWidth = Math.max(1, s / 12); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(text.value, 0, 0); } ctx.fillStyle = color.value; ctx.fillText(text.value, 0, 0); } else ctx.drawImage(logo, -mw / 2, -mh / 2, mw, mh); ctx.restore(); };
    if (position.value === 'tile') { for (let y = -mh; y < H + mh; y += mh * 3) for (let x = -mw; x < W + mw; x += mw * 1.8) drawAt(x, y); }
    else { const x = position.value.includes('l') ? m : position.value.includes('r') ? W - m - mw : (W - mw) / 2; const y = position.value.includes('t') ? m : position.value.includes('b') ? H - m - mh : (H - mh) / 2; drawAt(x, y); }
    ctx.restore();
  };
  let firstImg = null;
  const preview = async () => { if (!firstImg) return; const c = document.createElement('canvas'); c.width = firstImg.width; c.height = firstImg.height; c.getContext('2d').drawImage(firstImg.canvas, 0, 0); apply(c); previewHost.replaceChildren(h('img', { src: c.toDataURL('image/jpeg', 0.8), style: { maxHeight: '380px', maxWidth: '100%' } })); };
  [text, color, size.input, opacity.input, angle.input, margin.input].forEach((el) => el.addEventListener('input', preview)); [kind, font, position].forEach((el) => el.addEventListener('change', preview)); stroke.input.addEventListener('change', preview);
  const go = button('Watermark all', () => run(go, async () => {
    if (!files.length) throw new Error('Add images first.');
    const results = [];
    for (const f of files) { const d = await decodeToImageData(f); apply(d.canvas); const type = outFmt.value === 'same' ? (/png|webp/.test(f.type) ? f.type : 'image/jpeg') : outFmt.value; const blob = await canvasToBlob(d.canvas, type, quality.getValue() / 100); const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'; results.push({ f, blob, name: outName(f, 'watermarked', ext), type }); }
    out.replaceChildren();
    if (results.length > 1) out.append(result({ title: `All ${results.length} images (ZIP)`, data: await writeZip(await Promise.all(results.map(async (r) => ({ name: r.name, data: new Uint8Array(await r.blob.arrayBuffer()), store: true })))), name: 'watermarked.zip', mime: 'application/zip' }));
    for (const r of results) out.append(result({ title: r.f.name, data: r.blob, name: r.name, mime: r.type, preview: results.length <= 3 ? imagePreview(r.blob) : null }));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Add images', dropzone({ accept: 'image/*', multiple: true, pasteImages: true, onFiles: async (fs) => { files.push(...fs); chips.replaceChildren(...files.map((f) => fileChip(f))); if (!firstImg) { firstImg = await decodeToImageData(files[0], { maxSide: 1200 }); preview(); } } }), chips), section('2. Watermark', field('Type', kind), field('Text', text), h('div.grid2', field('Font', font), field('Colour', color)), stroke, field('Logo', logoZone), field('Size', size), field('Opacity', opacity), h('div.grid2', field('Position', position), field('Rotation', angle)), field('Margin', margin), h('div.grid2', field('Output format', outFmt), field('Quality', quality)), go)), h('div', h('h3', 'Preview (first image)'), previewHost, out)));
}
