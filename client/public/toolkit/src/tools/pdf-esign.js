import { h, field, select, number, colorInput, button, run, result, pdfPreview, section, outName, input, checkbox, dropzone, decodeToImageData, canvasToBlob, notice } from '../core/ui.js';
import { pdfPicker, pageBox, pageSelector, engineNote, PdfDocument } from './_pdf-common.js';
import { stampImage, stampText, embedImage, fracToVisual } from '../core/pdf/pdfkit.js';

export function mount(root) {
  let loaded = null, pageIdx = 0, placements = []; // {page, rect:{x,y,w,h}, kind:'sig'|'date'|'text'}
  let sigCanvas = null; // trimmed signature canvas
  // --- signature pad ---
  const pad = h('canvas.sig-pad', { width: 600, height: 200 });
  const pctx = pad.getContext('2d');
  const padColor = colorInput('#0f1b3d');
  const clearPad = () => { pctx.clearRect(0, 0, pad.width, pad.height); strokes = []; };
  let strokes = [], cur = null;
  const pos = (e) => { const r = pad.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * pad.width, ((e.clientY - r.top) / r.height) * pad.height]; };
  pad.addEventListener('pointerdown', (e) => { e.preventDefault(); pad.setPointerCapture(e.pointerId); cur = [pos(e)]; strokes.push(cur); });
  pad.addEventListener('pointermove', (e) => { if (!cur) return; const p = pos(e); cur.push(p); const [a, b] = cur.slice(-2); pctx.strokeStyle = padColor.value; pctx.lineWidth = 3.2; pctx.lineCap = 'round'; pctx.lineJoin = 'round'; pctx.beginPath(); pctx.moveTo(a[0], a[1]); pctx.lineTo(b[0], b[1]); pctx.stroke(); });
  pad.addEventListener('pointerup', () => { cur = null; });
  pad.addEventListener('pointercancel', () => { cur = null; });
  // --- typed signature ---
  const typed = input('text', { placeholder: 'Type your name', class: 'wide', value: '' });
  const typedFont = select([['"Brush Script MT", "Segoe Script", "Snell Roundhand", cursive', 'Script'], ['Georgia, "Times New Roman", serif', 'Serif'], ['"Comic Sans MS", "Chalkboard SE", sans-serif', 'Casual'], ['Impact, "Arial Black", sans-serif', 'Bold']], '"Brush Script MT", "Segoe Script", "Snell Roundhand", cursive');
  const typedColor = colorInput('#0f1b3d');
  const typedPreview = h('canvas', { width: 600, height: 160, style: { width: '100%', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' } });
  const renderTyped = () => { const c = typedPreview.getContext('2d'); c.clearRect(0, 0, 600, 160); c.fillStyle = typedColor.value; c.font = `64px ${typedFont.value}`; c.textBaseline = 'middle'; c.fillText(typed.value || 'Signature', 20, 80); };
  typed.addEventListener('input', renderTyped); typedFont.addEventListener('change', renderTyped); typedColor.addEventListener('input', renderTyped); renderTyped();
  // --- uploaded ---
  let uploaded = null;
  const upZone = dropzone({ accept: 'image/*', compact: true, label: 'Drop a signature image (PNG with transparency works best)', onFiles: async ([f]) => { const d = await decodeToImageData(f, { maxSide: 1200 }); uploaded = d.canvas; upZone.setLabel('Loaded: ' + f.name + ' ✓'); } });
  const mode = select([['draw', 'Draw'], ['type', 'Type'], ['upload', 'Upload image']], 'draw');
  const panes = { draw: h('div', pad, h('div.row', field('Ink colour', padColor), button('Clear', clearPad))), type: h('div', field('Name', typed), h('div.grid2', field('Style', typedFont), field('Colour', typedColor)), typedPreview), upload: h('div', upZone) };
  const paneHost = h('div', panes.draw);
  mode.addEventListener('change', () => paneHost.replaceChildren(panes[mode.value]));
  const removeWhite = checkbox('Make white background transparent (uploads/typed)', true);
  // --- placement ---
  const sigW = number(30, { min: 5, max: 90 });
  const dateText = input('text', { value: new Date().toISOString().slice(0, 10), class: 'wide' });
  const extraText = input('text', { placeholder: 'e.g. Muhammad Umair — Director', class: 'wide' });
  const fontSize = number(11, { min: 6, max: 36 });
  const kind = select([['sig', 'Signature'], ['date', 'Date'], ['text', 'Text line']], 'sig');
  const boxHost = h('div.muted', 'Load a PDF to place your signature.');
  const pageSel = h('div');
  const status = h('div.small.muted');
  const rebuild = () => {
    if (!loaded) return;
    const doc = loaded.doc;
    const page = doc.pages[pageIdx];
    const rects = placements.filter((p) => p.page === pageIdx).map((p) => p.rect);
    const box = pageBox(doc, page, { mode: 'place', rects, multiple: true, placeW: kind.value === 'sig' ? sigW.value / 100 : 0.2, placeH: kind.value === 'sig' ? ((sigW.value / 100) * (sigAspect() > 0 ? 1 / sigAspect() : 0.35) * (doc.pageGeometry(page).width / doc.pageGeometry(page).height)) : 0.03, fixedAspect: kind.value === 'sig' ? sigAspect() : null, label: (r) => r.kind === 'date' ? 'DATE' : r.kind === 'text' ? 'TEXT' : 'SIGN', onChange: (rs) => {
      placements = placements.filter((p) => p.page !== pageIdx).concat(rs.map((r) => ({ page: pageIdx, rect: r, kind: r.kind || kind.value })));
      for (const r of rs) if (!r.kind) r.kind = kind.value;
      status.textContent = `${placements.length} placement(s) on ${new Set(placements.map((p) => p.page + 1)).size} page(s). Click the page to add, drag to move, corner to resize.`;
    } });
    boxHost.replaceChildren(box);
    pageSel.replaceChildren(pageSelector(doc.pages.length, pageIdx, (i) => { pageIdx = i; rebuild(); }));
  };
  const sigAspect = () => { const c = currentSig(); return c ? c.width / c.height : 2.8; };
  function currentSig() {
    if (mode.value === 'draw') { if (!strokes.length) return null; return trim(pad); }
    if (mode.value === 'type') { if (!typed.value.trim()) return null; return trim(typedPreview, true); }
    return uploaded ? (removeWhite.input.checked ? whiteToAlpha(uploaded) : uploaded) : null;
  }
  const out = h('div');
  const go = button('Sign & download', () => run(go, async () => {
    if (!loaded) throw new Error('Choose a PDF first.');
    if (!placements.length) throw new Error('Click on the page preview to place the signature.');
    const doc = PdfDocument.load(loaded.bytes);
    const sig = currentSig();
    let embedded = null;
    for (const p of placements) {
      const page = doc.pages[p.page];
      const vis = fracToVisual(doc, page, p.rect);
      if (p.kind === 'sig') {
        if (!sig) throw new Error('Draw, type or upload a signature first.');
        if (!embedded) { const ctx = sig.getContext('2d'); const d = ctx.getImageData(0, 0, sig.width, sig.height); embedded = await embedImage(doc, { rgba: d.data, width: d.width, height: d.height }); }
        await stampImage(doc, page, embedded, vis);
      } else {
        await stampText(doc, page, p.kind === 'date' ? dateText.value : extraText.value || ' ', { x: vis.x, y: vis.y + vis.h * 0.2, fontName: 'Helvetica', fontSize: Number(fontSize.value), color: '#000000' });
      }
    }
    const bytes = await doc.save();
    out.replaceChildren(engineNote(), result({ title: 'Signed PDF', data: bytes, name: outName(loaded.file, 'signed', 'pdf'), mime: 'application/pdf', preview: pdfPreview(bytes) }));
  }, out), 'primary big');
  root.append(h('div.tool.two',
    h('div.stack', section('1. Choose PDF', pdfPicker({ onLoad: (l) => { loaded = l; pageIdx = 0; placements = []; rebuild(); } })),
      section('2. Your signature', field('Method', mode), paneHost, removeWhite),
      section('3. Place on page', h('div.grid2', field('What to place', kind), field('Signature width (% of page)', sigW)), h('div.grid2', field('Date text', dateText), field('Text line', extraText)), field('Text size (pt)', fontSize), notice('Signatures are drawn into the page content (a visible, flattened signature — not a cryptographic digital signature).'), go)),
    h('div', h('div.row', pageSel, status), boxHost, out)));
  kind.addEventListener('change', rebuild); sigW.addEventListener('input', rebuild);
}
function trim(canvas, whiteBg = false) {
  const ctx = canvas.getContext('2d'); const { width, height } = canvas; const d = ctx.getImageData(0, 0, width, height).data;
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; const solid = whiteBg ? d[i + 3] > 10 : d[i + 3] > 10; if (solid) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  if (x1 < x0) return null;
  const pad = 6; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(width - 1, x1 + pad); y1 = Math.min(height - 1, y1 + pad);
  const c = document.createElement('canvas'); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1; c.getContext('2d').drawImage(canvas, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  return c;
}
function whiteToAlpha(canvas) {
  const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height; const ctx = c.getContext('2d'); ctx.drawImage(canvas, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height); const d = img.data;
  for (let i = 0; i < d.length; i += 4) { const lum = (d[i] + d[i + 1] + d[i + 2]) / 3; if (lum > 235) d[i + 3] = 0; else if (lum > 180) d[i + 3] = Math.round(((235 - lum) / 55) * 255); }
  ctx.putImageData(img, 0, 0); return c;
}
