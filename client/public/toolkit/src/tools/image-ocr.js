import { createLocalOcrWorker, recognizeWithBudget } from '../core/ocr.js';
import { h, field, select, button, run, result, section, dropzone, notice, decodeToImageData, canvasToBlob, textOutput, range, checkbox, imagePreview, outName } from '../core/ui.js';

export function mount(root) {
  let src = null, file = null; const controller = new AbortController();
  const hasDetector = true;
  const threshold = range(0, { min: 0, max: 255, format: (v) => (v ? String(v) : 'auto') });
  const invert = checkbox('Invert (light text on dark background)', false);
  const upscale = select([[1, '1×'], [2, '2× (recommended for small text)'], [3, '3×']], 2);
  const grayscale = checkbox('Convert to grayscale', true);
  const binarize = checkbox('Binarize (black & white)', true);
  const canvas = h('canvas', { style: { maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--line)' } });
  const out = h('div');
  const preprocess = () => {
    if (!src) return; const f = Math.min(Number(upscale.value), Math.sqrt(16000000 / (src.width * src.height))); canvas.width = src.width * f; canvas.height = src.height * f; const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(src.canvas, 0, 0, canvas.width, canvas.height);
    if (!grayscale.input.checked && !binarize.input.checked && !invert.input.checked) return;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height); const d = img.data; let hist = new Uint32Array(256);
    for (let i = 0; i < d.length; i += 4) { const g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000; d[i] = d[i + 1] = d[i + 2] = g; hist[g | 0]++; }
    let t = threshold.getValue(); if (binarize.input.checked && !t) { // Otsu
      const total = d.length / 4; let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i]; let sumB = 0, wB = 0, max = 0; for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = total - wB; if (!wF) break; sumB += i * hist[i]; const mB = sumB / wB, mF = (sum - sumB) / wF; const v = wB * wF * (mB - mF) ** 2; if (v > max) { max = v; t = i; } } }
    for (let i = 0; i < d.length; i += 4) { let g = d[i]; if (binarize.input.checked) g = g > t ? 255 : 0; if (invert.input.checked) g = 255 - g; d[i] = d[i + 1] = d[i + 2] = g; }
    ctx.putImageData(img, 0, 0);
  };
  [threshold.input, upscale].forEach((el) => el.addEventListener('input', preprocess)); [invert, grayscale, binarize].forEach((c) => c.input.addEventListener('change', preprocess)); upscale.addEventListener('change', preprocess);
  const go = button(hasDetector ? 'Recognise text' : 'Download prepared image', () => run(go, async () => {
    if (!src) throw new Error('Choose an image first.');
    if (hasDetector) {
      const worker = await createLocalOcrWorker('eng');
      try { const { data } = await recognizeWithBudget(worker, canvas, { signal: controller.signal }); out.replaceChildren(notice('Recognition completed locally. Review extracted text for mistakes.', 'ok'), textOutput(data.text, { name: outName(file, 'ocr', 'txt') })); }
      finally { await worker.terminate(); }
    } else { const blob = await canvasToBlob(canvas, 'image/png'); out.replaceChildren(result({ title: 'OCR-ready image', data: blob, name: outName(file, 'ocr-ready', 'png'), mime: 'image/png', preview: imagePreview(blob) })); }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Choose image', dropzone({ accept: 'image/*', pasteImages: true, label: 'Drop a photo or scan of text (or paste)', onFiles: async ([f]) => { file = f; src = await decodeToImageData(f, { maxSide: 2500 }); preprocess(); } })), section('2. Pre-processing', field('Upscale', upscale), grayscale, binarize, field('Threshold', threshold), invert, hasDetector ? notice('Text recognition is available here — nothing you add is stored or sent anywhere.', 'ok') : notice('Text recognition is not available here, and no third-party OCR service is used. The prepared (upscaled, binarised) image can be downloaded and pasted into any OCR-capable app (Google Lens, macOS Preview, Windows Snipping Tool).', 'warn'), go)), h('div', h('div.canvas-wrap', canvas), out)));
  return () => controller.abort();
}
