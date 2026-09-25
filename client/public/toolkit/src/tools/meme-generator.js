import { h, field, select, button, run, result, section, dropzone, notice, decodeToImageData, canvasToBlob, imagePreview, colorInput, input, range, checkbox, outName } from '../core/ui.js';

export function mount(root) {
  let src = null, file = null;
  const top = input('text', { value: 'WHEN THE BUILD PASSES', class: 'wide' }), bottom = input('text', { value: 'ON THE FIRST TRY', class: 'wide' });
  const font = select([['Impact, "Arial Black", "Helvetica Neue", sans-serif', 'Impact (classic)'], ['"Arial Black", Arial, sans-serif', 'Arial Black'], ['"Comic Sans MS", "Chalkboard SE", sans-serif', 'Comic Sans'], ['Georgia, serif', 'Serif']], 'Impact, "Arial Black", "Helvetica Neue", sans-serif');
  const size = range(10, { min: 4, max: 20, format: (v) => v + '%' });
  const fill = colorInput('#ffffff'), stroke = colorInput('#000000');
  const upper = checkbox('UPPERCASE', true);
  const pad = checkbox('Add white bars for captions (modern style)', false);
  const outFmt = select([['image/jpeg', 'JPG'], ['image/png', 'PNG']], 'image/jpeg');
  const canvas = h('canvas', { style: { maxWidth: '100%', borderRadius: '8px' } }); const out = h('div');
  const wrap = (ctx, text, maxW) => { const words = text.split(/\s+/); const lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; };
  const render = () => {
    if (!src) return; const W = src.width; const fs = (size.getValue() / 100) * W; const bar = pad.input.checked ? fs * 2.4 : 0;
    canvas.width = W; canvas.height = src.height + (pad.input.checked ? bar * 2 : 0); const ctx = canvas.getContext('2d');
    if (pad.input.checked) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(src.canvas, 0, pad.input.checked ? bar : 0);
    ctx.font = `bold ${fs}px ${font.value}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = fs / 8; ctx.strokeStyle = pad.input.checked ? 'transparent' : stroke.value; ctx.fillStyle = pad.input.checked ? '#000' : fill.value;
    const draw = (text, yStart, fromBottom) => { const t = upper.input.checked ? text.toUpperCase() : text; const lines = wrap(ctx, t, W * 0.92); lines.forEach((ln, i) => { const y = fromBottom ? yStart - (lines.length - 1 - i) * fs * 1.1 : yStart + i * fs * 1.1; if (!pad.input.checked) ctx.strokeText(ln, W / 2, y); ctx.fillText(ln, W / 2, y); }); };
    ctx.textBaseline = 'top'; if (top.value) draw(top.value, pad.input.checked ? bar / 2 - fs * 0.6 : fs * 0.3, false);
    ctx.textBaseline = 'bottom'; if (bottom.value) draw(bottom.value, canvas.height - (pad.input.checked ? bar / 2 - fs * 0.6 : fs * 0.3), true);
  };
  [top, bottom, size.input, fill, stroke].forEach((el) => el.addEventListener('input', render)); [font, outFmt].forEach((el) => el.addEventListener('change', render)); [upper, pad].forEach((c) => c.input.addEventListener('change', render));
  const go = button('Download meme', () => run(go, async () => { if (!src) throw new Error('Choose an image first.'); const blob = await canvasToBlob(canvas, outFmt.value, 0.92); out.replaceChildren(result({ title: 'Meme', data: blob, name: outName(file, 'meme', outFmt.value === 'image/png' ? 'png' : 'jpg'), mime: outFmt.value })); }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose image', dropzone({ accept: 'image/*', pasteImages: true, label: 'Drop a template image (or paste)', onFiles: async ([f]) => { file = f; src = await decodeToImageData(f, { maxSide: 1600 }); render(); } })), section('2. Captions', field('Top text', top), field('Bottom text', bottom), h('div.grid2', field('Font', font), field('Size', size)), h('div.grid2', field('Text colour', fill), field('Outline colour', stroke)), upper, pad, field('Output', outFmt), go)), h('div', h('div.canvas-wrap', canvas), out)));
}
