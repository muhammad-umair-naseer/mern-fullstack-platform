import { h, field, select, button, run, result, section, outName, dropzone, range, notice, decodeToImageData, canvasToBlob, imagePreview } from '../core/ui.js';

export function mount(root) {
  let src = null, file = null; const regions = []; // {x,y,w,h} in image px
  const effect = select([['blur', 'Blur'], ['pixelate', 'Pixelate'], ['black', 'Black box'], ['white', 'White box']], 'blur');
  const strength = range(12, { min: 2, max: 60, format: (v) => String(v) });
  const outFmt = select([['image/jpeg', 'JPG'], ['image/png', 'PNG'], ['image/webp', 'WebP']], 'image/jpeg');
  const canvas = h('canvas', { style: { maxWidth: '100%', borderRadius: '8px', cursor: 'crosshair', touchAction: 'none' } });
  const out = h('div'); const status = h('div.small.muted', 'Load an image, then drag to draw regions.');
  const render = () => {
    if (!src) return; const ctx = canvas.getContext('2d'); canvas.width = src.width; canvas.height = src.height; ctx.drawImage(src.canvas, 0, 0);
    for (const r of regions) applyEffect(ctx, r);
    ctx.save(); ctx.strokeStyle = '#2e6bff'; ctx.lineWidth = Math.max(1, src.width / 400); ctx.setLineDash([6, 4]); for (const r of regions) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.restore();
    status.textContent = `${regions.length} region(s). Drag to add; click a region to remove it.`;
  };
  const applyEffect = (ctx, r) => {
    if (r.w < 2 || r.h < 2) return;
    const s = strength.getValue();
    if (effect.value === 'black' || effect.value === 'white') { ctx.fillStyle = effect.value === 'black' ? '#000' : '#fff'; ctx.fillRect(r.x, r.y, r.w, r.h); return; }
    if (effect.value === 'pixelate') { const px = Math.max(2, Math.round(s)); const tmp = document.createElement('canvas'); tmp.width = Math.max(1, Math.round(r.w / px)); tmp.height = Math.max(1, Math.round(r.h / px)); const tc = tmp.getContext('2d'); tc.imageSmoothingEnabled = false; tc.drawImage(src.canvas, r.x, r.y, r.w, r.h, 0, 0, tmp.width, tmp.height); ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, r.x, r.y, r.w, r.h); ctx.restore(); return; }
    // blur: draw region through a filter, with a padded source to avoid edge fade
    const tmp = document.createElement('canvas'); tmp.width = r.w; tmp.height = r.h; const tc = tmp.getContext('2d');
    if ('filter' in tc) { tc.filter = `blur(${s}px)`; tc.drawImage(src.canvas, r.x - s, r.y - s, r.w + s * 2, r.h + s * 2, -s, -s, r.w + s * 2, r.h + s * 2); ctx.drawImage(tmp, r.x, r.y); }
    else { const px = Math.max(2, Math.round(s / 2)); const t2 = document.createElement('canvas'); t2.width = Math.max(1, Math.round(r.w / px)); t2.height = Math.max(1, Math.round(r.h / px)); t2.getContext('2d').drawImage(src.canvas, r.x, r.y, r.w, r.h, 0, 0, t2.width, t2.height); ctx.drawImage(t2, 0, 0, t2.width, t2.height, r.x, r.y, r.w, r.h); }
  };
  let drag = null;
  const pt = (e) => { const b = canvas.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * canvas.width, ((e.clientY - b.top) / b.height) * canvas.height]; };
  canvas.addEventListener('pointerdown', (e) => { if (!src) return; e.preventDefault(); canvas.setPointerCapture(e.pointerId); const [x, y] = pt(e); drag = { x, y, w: 0, h: 0, sx: x, sy: y }; regions.push(drag); });
  canvas.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = pt(e); drag.x = Math.min(x, drag.sx); drag.y = Math.min(y, drag.sy); drag.w = Math.abs(x - drag.sx); drag.h = Math.abs(y - drag.sy); render(); });
  canvas.addEventListener('pointerup', (e) => { if (!drag) return; if (drag.w < 4 && drag.h < 4) { regions.pop(); const [x, y] = pt(e); const hit = regions.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h); if (hit >= 0) regions.splice(hit, 1); } drag = null; render(); });
  effect.addEventListener('change', render); strength.input.addEventListener('input', render);
  const go = button('Download', () => run(go, async () => { if (!src) throw new Error('Choose an image first.'); const c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const ctx = c.getContext('2d'); ctx.drawImage(src.canvas, 0, 0); for (const r of regions) applyEffect(ctx, r); const blob = await canvasToBlob(c, outFmt.value, 0.92); out.replaceChildren(result({ title: 'Censored image', data: blob, name: outName(file, 'censored', outFmt.value === 'image/png' ? 'png' : outFmt.value === 'image/webp' ? 'webp' : 'jpg'), mime: outFmt.value, preview: imagePreview(blob) })); }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose image', dropzone({ accept: 'image/*', pasteImages: true, onFiles: async ([f]) => { file = f; src = await decodeToImageData(f, { maxSide: 3000 }); regions.length = 0; render(); } })), section('2. Effect', field('Effect', effect), field('Strength', strength), field('Output', outFmt), button('Clear regions', () => { regions.length = 0; render(); }), notice('Pixels inside each region are irreversibly replaced in the exported file — the original is never modified.'), go)), h('div', status, h('div.canvas-wrap', canvas), out)));
}
