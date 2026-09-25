// Shared helpers for the PDF tools (loading, page wireframes, region drawing).
import { PdfDocument, PdfError } from '../core/pdf/document.js';
import { tokenizeContent, walkText } from '../core/pdf/content.js';
import { h, readAs, fileChip, notice } from '../core/ui.js';
export { PdfDocument };

export async function loadPdf(file) {
  const bytes = await readAs(file);
  try { return { doc: PdfDocument.load(bytes), bytes }; }
  catch (e) { if (e instanceof PdfError || /encrypt/i.test(String(e.message))) throw new Error(e.message); throw new Error('Could not parse this PDF: ' + e.message); }
}
export function pdfPicker({ onLoad, label = 'Drop a PDF here or click to browse', multiple = false }) {
  const holder = h('div');
  const chips = h('div');
  const zone = dropzoneLazy({ accept: '.pdf,application/pdf', multiple, label, onFiles: async (files) => { chips.replaceChildren(); holder.querySelectorAll('.error').forEach((e) => e.remove()); try { const loaded = []; for (const f of files) { const r = await loadPdf(f); chips.append(fileChip(f)); loaded.push({ file: f, ...r }); } await onLoad(multiple ? loaded : loaded[0]); } catch (e) { holder.prepend(h('div.error', String(e.message || e))); } } });
  holder.append(zone, chips);
  return holder;
}
import { dropzone } from '../core/ui.js';
function dropzoneLazy(o) { return dropzone(o); }

/** Parse "1,3-5,8" into 0-based indices (validated). */
export function parsePageRange(str, count) {
  if (!str || !str.trim()) return null;
  const out = new Set();
  for (const part of str.split(/[,\s]+/).filter(Boolean)) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!m) throw new Error(`Invalid page range "${part}"`);
    let a = parseInt(m[1], 10), b = m[2] ? parseInt(m[2], 10) : a;
    if (a > b) [a, b] = [b, a];
    for (let i = a; i <= b; i++) if (i >= 1 && i <= count) out.add(i - 1);
  }
  return [...out].sort((x, y) => x - y);
}

/** Collect visible words/images on a page in *visual* coordinates (fractions of displayed page, top-left origin). */
export function pageLayout(doc, page) {
  const g = doc.pageGeometry(page);
  const m = doc.visualMatrix(page);
  // inverse of the visual matrix maps user space -> visual space
  const det = m[0] * m[3] - m[1] * m[2];
  const inv = [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  const toVis = (x, y) => [inv[0] * x + inv[2] * y + inv[4], inv[1] * x + inv[3] * y + inv[5]];
  const items = [];
  let ops;
  try { ops = tokenizeContent(doc.pageContent(page)); } catch { return { items, width: g.width, height: g.height }; }
  let cur = null;
  const flush = () => { if (cur && cur.text.trim()) items.push(cur); cur = null; };
  walkText(doc, page, ops, (gl) => {
    const [x0, y0] = toVis(gl.box[0], gl.box[1]), [x1, y1] = toVis(gl.box[2], gl.box[3]);
    const box = { x: Math.min(x0, x1) / g.width, y: 1 - Math.max(y0, y1) / g.height, w: Math.abs(x1 - x0) / g.width, h: Math.abs(y1 - y0) / g.height };
    if (gl.image) { items.push({ image: true, ...box }); return; }
    const size = (gl.fontSize || 10) / g.height;
    if (cur && Math.abs(box.y - cur.y) < size * 0.4 && box.x - (cur.x + cur.w) < size * 0.5 * (g.height / g.width) && box.x >= cur.x - 0.001) {
      cur.text += gl.text || (gl.isSpace ? ' ' : ''); cur.w = Math.max(cur.w, box.x + box.w - cur.x); cur.h = Math.max(cur.h, box.h);
    } else { flush(); cur = { text: gl.text || ' ', ...box, size }; }
  });
  flush();
  return { items, width: g.width, height: g.height };
}

/**
 * Interactive page box: shows a wireframe of the page, lets the user draw/move/resize rectangles.
 * opts: { mode:'draw'|'place', rects:[{x,y,w,h}] (fractions), fixedAspect:number|null, onChange(rects), blackFill }
 */
export function pageBox(doc, page, opts = {}) {
  const { items, width, height } = pageLayout(doc, page);
  const maxW = opts.maxWidth || 560;
  const scale = Math.min(maxW / width, 720 / height);
  const W = Math.round(width * scale), H = Math.round(height * scale);
  const box = h('div.page-box', { style: { width: W + 'px', height: H + 'px', overflow: 'hidden' } });
  for (const it of items) {
    if (it.image) box.append(h('div', { style: { position: 'absolute', left: it.x * W + 'px', top: it.y * H + 'px', width: Math.max(2, it.w * W) + 'px', height: Math.max(2, it.h * H) + 'px', background: '#e3e7f0', border: '1px solid #c9d1e0', pointerEvents: 'none' } }));
    else box.append(h('span', { style: { position: 'absolute', left: it.x * W + 'px', top: it.y * H + 'px', fontSize: Math.max(4, it.size * H * 0.9) + 'px', lineHeight: 1, whiteSpace: 'pre', color: '#333', pointerEvents: 'none', fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0', transformOrigin: 'left top', width: it.w * W + 'px', overflow: 'hidden' } }, it.text));
  }
  const rects = opts.rects || [];
  const marks = [];
  const emit = () => opts.onChange && opts.onChange(rects.slice());
  const clamp = (r) => { r.w = Math.max(0.005, Math.min(1, r.w)); r.h = Math.max(0.005, Math.min(1, r.h)); r.x = Math.max(0, Math.min(1 - r.w, r.x)); r.y = Math.max(0, Math.min(1 - r.h, r.y)); };
  const renderMarks = () => {
    for (const m of marks) m.remove(); marks.length = 0;
    rects.forEach((r, idx) => {
      const el = h('div.mark', { class: opts.blackFill ? 'black' : '', style: { left: r.x * W + 'px', top: r.y * H + 'px', width: r.w * W + 'px', height: r.h * H + 'px' } });
      if (opts.label) el.append(h('span', { style: { position: 'absolute', left: '2px', top: '2px', fontSize: '10px', color: opts.blackFill ? '#fff' : '#0f1b3d', pointerEvents: 'none' } }, typeof opts.label === 'function' ? opts.label(r, idx) : opts.label));
      const x = h('div.x', { title: 'Remove', onPointerdown: (e) => { e.stopPropagation(); rects.splice(idx, 1); renderMarks(); emit(); } }, '×');
      const rz = h('div.rz');
      el.append(x, rz);
      // move
      el.addEventListener('pointerdown', (e) => {
        if (e.target === rz || e.target === x) return;
        e.preventDefault(); e.stopPropagation();
        const sx = e.clientX, sy = e.clientY, ox = r.x, oy = r.y;
        const move = (ev) => { r.x = ox + (ev.clientX - sx) / W; r.y = oy + (ev.clientY - sy) / H; clamp(r); el.style.left = r.x * W + 'px'; el.style.top = r.y * H + 'px'; };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); emit(); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
      rz.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        const sx = e.clientX, sy = e.clientY, ow = r.w, oh = r.h;
        const move = (ev) => { r.w = ow + (ev.clientX - sx) / W; if (opts.fixedAspect) r.h = (r.w * W) / opts.fixedAspect / H; else r.h = oh + (ev.clientY - sy) / H; clamp(r); el.style.width = r.w * W + 'px'; el.style.height = r.h * H + 'px'; };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); emit(); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
      box.append(el); marks.push(el);
    });
  };
  if (opts.mode === 'draw') {
    let drawing = null;
    box.addEventListener('pointerdown', (e) => {
      if (e.target !== box && !e.target.matches('span, div[style*="pointer-events: none"]')) return;
      const rb = box.getBoundingClientRect();
      const x = (e.clientX - rb.left) / W, y = (e.clientY - rb.top) / H;
      drawing = { x, y, w: 0.001, h: 0.001, sx: x, sy: y };
      rects.push(drawing); renderMarks();
      const move = (ev) => { const cx = (ev.clientX - rb.left) / W, cy = (ev.clientY - rb.top) / H; drawing.x = Math.min(cx, drawing.sx); drawing.y = Math.min(cy, drawing.sy); drawing.w = Math.abs(cx - drawing.sx); drawing.h = Math.abs(cy - drawing.sy); clamp(drawing); renderMarks(); };
      const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); if (drawing.w < 0.004 || drawing.h < 0.004) { rects.splice(rects.indexOf(drawing), 1); renderMarks(); } delete drawing.sx; delete drawing.sy; drawing = null; emit(); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    });
  } else if (opts.mode === 'place') {
    box.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.mark')) return;
      const rb = box.getBoundingClientRect();
      const r = { w: opts.placeW || 0.3, h: opts.placeH || 0.1 };
      r.x = (e.clientX - rb.left) / W - r.w / 2; r.y = (e.clientY - rb.top) / H - r.h / 2; clamp(r);
      if (!opts.multiple) rects.length = 0;
      rects.push(r); renderMarks(); emit();
    });
  }
  renderMarks();
  box.rects = rects; box.rerender = renderMarks; box.scaleInfo = { W, H, width, height };
  return box;
}

export function pageSelector(count, current, onChange) {
  const sel = h('select', Array.from({ length: count }, (_, i) => h('option', { value: i, selected: i === current }, `Page ${i + 1} of ${count}`)));
  sel.addEventListener('change', () => onChange(Number(sel.value)));
  return sel;
}
export const engineNote = () => notice('Done. Your file stays private — nothing is stored or retained.', 'ok');
