import { h, field, select, button, run, result, section, dropzone, notice, checkbox, decodeToImageData, canvasToBlob, blobBytes, input, colorInput, range, textOutput } from '../core/ui.js';
import { encodeIco } from '../core/image-codecs.js';
import { writeZip } from '../core/zip.js';

export function mount(root) {
  let src = null;
  const name = input('text', { value: 'Cortexis', class: 'wide' }), short = input('text', { value: 'Cortexis', class: 'wide' });
  const theme = colorInput('#2e6bff'), bgc = colorInput('#ffffff');
  const pad = range(0, { min: 0, max: 30, format: (v) => v + '%' });
  const roundBg = checkbox('Fill background colour behind transparent icons (needed for iOS/maskable)', true);
  const radius = range(0, { min: 0, max: 50, format: (v) => v + '% corner radius' });
  const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512];
  const grid = h('div.thumbs'); const out = h('div');
  const draw = (size, { fill = true } = {}) => { const c = document.createElement('canvas'); c.width = c.height = size; const ctx = c.getContext('2d'); if (fill && roundBg.input.checked) { ctx.fillStyle = bgc.value; const r = (radius.getValue() / 100) * size; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, size, size, r) : ctx.rect(0, 0, size, size); ctx.fill(); } const p = (pad.getValue() / 100) * size; const s = size - p * 2; const iw = src.width, ih = src.height; const sc = Math.min(s / iw, s / ih); const w = iw * sc, hh = ih * sc; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(src.canvas, (size - w) / 2, (size - hh) / 2, w, hh); return c; };
  const preview = () => { if (!src) return; grid.replaceChildren(...[16, 32, 48, 180, 512].map((s) => h('div.thumb', h('img', { src: draw(s).toDataURL(), style: { width: Math.min(80, s * 2) + 'px', height: Math.min(80, s * 2) + 'px', imageRendering: s <= 32 ? 'pixelated' : 'auto' } }), `${s}×${s}`))); };
  [theme, bgc, pad.input, radius.input].forEach((el) => el.addEventListener('input', preview)); roundBg.input.addEventListener('change', preview);
  const go = button('Generate ZIP', () => run(go, async () => {
    if (!src) throw new Error('Choose a source image first (ideally a square PNG/SVG ≥ 512px).');
    const files = [];
    const pngs = {};
    for (const s of sizes) { const blob = await canvasToBlob(draw(s), 'image/png'); pngs[s] = await blobBytes(blob); }
    for (const s of [16, 32, 48, 96, 192, 512]) files.push({ name: `favicon-${s}x${s}.png`, data: pngs[s] });
    files.push({ name: 'apple-touch-icon.png', data: pngs[180] });
    files.push({ name: 'android-chrome-192x192.png', data: pngs[192] }, { name: 'android-chrome-512x512.png', data: pngs[512] });
    files.push({ name: 'favicon.ico', data: encodeIco([{ size: 16, png: pngs[16] }, { size: 32, png: pngs[32] }, { size: 48, png: pngs[48] }]) });
    const manifest = { name: name.value, short_name: short.value, icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }], theme_color: theme.value, background_color: bgc.value, display: 'standalone', start_url: '/' };
    files.push({ name: 'site.webmanifest', data: JSON.stringify(manifest, null, 2) });
    const html = `<link rel="icon" href="/favicon.ico" sizes="32x32">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">\n<meta name="theme-color" content="${theme.value}">`;
    files.push({ name: 'README.txt', data: `Copy every file to your site root (/) and add this to <head>:\n\n${html}\n` });
    const zip = await writeZip(files);
    out.replaceChildren(result({ title: 'Favicon package', data: zip, name: 'favicons.zip', mime: 'application/zip', note: `${files.length} files` }), h('div.card', h('h3', 'HTML snippet for <head>'), textOutput(html, { name: 'favicon-snippet.html', rows: 8 })));
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('1. Source image', dropzone({ accept: 'image/*,.svg', pasteImages: true, label: 'Drop a square logo (PNG/SVG/JPG, 512px or larger)', onFiles: async ([f]) => { src = await decodeToImageData(f, { maxSide: 1024 }); preview(); } })), section('2. Options', h('div.grid2', field('App name (manifest)', name), field('Short name', short)), h('div.grid2', field('Theme colour', theme), field('Background colour', bgc)), field('Padding', pad), field('Corner radius', radius), roundBg, notice('Generates favicon.ico (16/32/48 multi-size, built with the toolkit\'s own ICO writer), PNG icons up to 512px, apple-touch-icon and a web manifest.'), go)), h('div', h('h3', 'Preview'), grid, out)));
}
