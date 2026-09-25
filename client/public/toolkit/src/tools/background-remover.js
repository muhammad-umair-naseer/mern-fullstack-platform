import { h, field, select, button, run, result, section, outName, dropzone, range, notice, checkbox, decodeToImageData, canvasToBlob, imagePreview, colorInput } from '../core/ui.js';

export function mount(root) {
  let src = null, file = null, mask = null; // mask: Uint8Array alpha per pixel (255 = keep)
  const tol = range(28, { min: 1, max: 120, format: (v) => String(v) });
  const feather = range(1.5, { min: 0, max: 8, step: 0.5, format: (v) => v + ' px' });
  const mode = select([['flood', 'Flood fill from the corners (plain/gradient backgrounds)'], ['color', 'Remove a picked colour everywhere'], ['manual', 'Manual: click regions to remove / restore']], 'flood');
  const pick = colorInput('#ffffff');
  const despeckle = checkbox('Remove small floating specks', true);
  const outFmt = select([['image/png', 'PNG (transparent)'], ['image/webp', 'WebP (transparent)']], 'image/png');
  const brush = select([['erase', 'Click: erase region'], ['restore', 'Click: restore region']], 'erase');
  const canvas = h('canvas', { style: { maxWidth: '100%', borderRadius: '8px', background: 'repeating-conic-gradient(#e6e6e6 0 25%, #fff 0 50%) 0 0/16px 16px', cursor: 'crosshair' } });
  const out = h('div'); const status = h('div.small.muted');
  const W = () => src.width, H = () => src.height;
  const colorAt = (i) => [src.data.data[i * 4], src.data.data[i * 4 + 1], src.data.data[i * 4 + 2]];
  const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  function flood(seeds, target, t, value) {
    const w = W(), hgt = H(), d = src.data.data; const seen = new Uint8Array(w * hgt); const stack = [...seeds];
    while (stack.length) { const i = stack.pop(); if (seen[i]) continue; seen[i] = 1; const c = [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]; if (dist(c, target) > t) continue; mask[i] = value; const x = i % w, y = (i / w) | 0; if (x > 0) stack.push(i - 1); if (x < w - 1) stack.push(i + 1); if (y > 0) stack.push(i - w); if (y < hgt - 1) stack.push(i + w); }
  }
  function compute() {
    if (!src) return;
    const w = W(), hgt = H(); mask = new Uint8Array(w * hgt).fill(255);
    const t = tol.getValue();
    if (mode.value === 'flood') { const corners = [0, w - 1, (hgt - 1) * w, hgt * w - 1, Math.floor(w / 2), (hgt - 1) * w + Math.floor(w / 2), Math.floor(hgt / 2) * w, Math.floor(hgt / 2) * w + w - 1]; for (const c of corners) flood([c], colorAt(c), t, 0); }
    else if (mode.value === 'color') { const hex = pick.value; const target = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]; const d = src.data.data; for (let i = 0; i < w * hgt; i++) if (dist([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]], target) <= t) mask[i] = 0; }
    if (despeckle.input.checked) despeck(w, hgt);
    render();
  }
  function despeck(w, hgt) { // remove kept components smaller than 0.05% of the image
    const minSize = Math.max(30, (w * hgt) * 0.0005); const seen = new Uint8Array(w * hgt);
    for (let s = 0; s < w * hgt; s++) { if (seen[s] || !mask[s]) continue; const comp = []; const stack = [s]; seen[s] = 1; while (stack.length) { const i = stack.pop(); comp.push(i); const x = i % w, y = (i / w) | 0; for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < hgt - 1 ? i + w : -1]) if (j >= 0 && !seen[j] && mask[j]) { seen[j] = 1; stack.push(j); } } if (comp.length < minSize) for (const i of comp) mask[i] = 0; }
  }
  function render() {
    const w = W(), hgt = H(); canvas.width = w; canvas.height = hgt;
    const ctx = canvas.getContext('2d'); const img = ctx.createImageData(w, hgt); const d = img.data, s = src.data.data;
    // feather: box blur the mask
    let m = mask; const f = feather.getValue();
    if (f > 0) { m = new Float32Array(w * hgt); const r = Math.ceil(f); const tmp = new Float32Array(w * hgt); for (let y = 0; y < hgt; y++) { let acc = 0, cnt = 0; for (let x = -r; x <= r; x++) { if (x >= 0 && x < w) { acc += mask[y * w + x]; cnt++; } } for (let x = 0; x < w; x++) { tmp[y * w + x] = acc / cnt; const add = x + r + 1, rem = x - r; if (add < w) { acc += mask[y * w + add]; cnt++; } if (rem >= 0) { acc -= mask[y * w + rem]; cnt--; } } } for (let x = 0; x < w; x++) { let acc = 0, cnt = 0; for (let y = -r; y <= r; y++) { if (y >= 0 && y < hgt) { acc += tmp[y * w + x]; cnt++; } } for (let y = 0; y < hgt; y++) { m[y * w + x] = acc / cnt; const add = y + r + 1, rem = y - r; if (add < hgt) { acc += tmp[add * w + x]; cnt++; } if (rem >= 0) { acc -= tmp[rem * w + x]; cnt--; } } } }
    for (let i = 0; i < w * hgt; i++) { d[i * 4] = s[i * 4]; d[i * 4 + 1] = s[i * 4 + 1]; d[i * 4 + 2] = s[i * 4 + 2]; d[i * 4 + 3] = Math.min(s[i * 4 + 3], m[i]); }
    ctx.putImageData(img, 0, 0);
    let kept = 0; for (let i = 0; i < mask.length; i++) if (mask[i]) kept++;
    status.textContent = `${Math.round((1 - kept / mask.length) * 100)}% of pixels removed · ${w}×${hgt}`;
  }
  canvas.addEventListener('click', (e) => { if (!src) return; const r = canvas.getBoundingClientRect(); const x = Math.floor(((e.clientX - r.left) / r.width) * W()), y = Math.floor(((e.clientY - r.top) / r.height) * H()); const i = y * W() + x; if (mode.value === 'color') { const c = colorAt(i); pick.value = '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); compute(); return; } flood([i], colorAt(i), tol.getValue(), brush.value === 'erase' ? 0 : 255); render(); });
  [tol, feather].forEach((r) => r.input.addEventListener('change', compute)); mode.addEventListener('change', compute); despeckle.input.addEventListener('change', compute); pick.addEventListener('input', compute);
  const go = button('Download', () => run(go, async () => { if (!src) throw new Error('Choose an image first.'); const blob = await canvasToBlob(canvas, outFmt.value, 0.95); out.replaceChildren(result({ title: 'Background removed', data: blob, name: outName(file, 'nobg', outFmt.value === 'image/png' ? 'png' : 'webp'), mime: outFmt.value, preview: imagePreview(blob) })); }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose image', dropzone({ accept: 'image/*', pasteImages: true, label: 'Drop a product photo, logo or screenshot (or paste)', onFiles: async ([f]) => { file = f; src = await decodeToImageData(f, { maxSide: 2200 }); compute(); } })), section('2. Settings', field('Method', mode), field('Tolerance', tol), field('Edge feathering', feather), field('Colour to remove (colour mode; click image to pick)', pick), field('Touch-up clicks', brush), despeckle, field('Output', outFmt), notice('Classic colour-based cutout (flood fill + feathering) — works best on plain, gradient or studio backgrounds. Busy backgrounds need manual touch-up clicks.'), go)), h('div', status, h('div.canvas-wrap', canvas), out)));
}
