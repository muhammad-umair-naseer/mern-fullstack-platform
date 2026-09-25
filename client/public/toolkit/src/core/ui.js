// Shared UI helpers. Framework-free, tiny, and used by every tool module.
import { fmtBytes, stripExt } from './bytes.js';
export { fmtBytes, stripExt };

/** Hyperscript-ish element builder: h('div.cls#id', {attrs}, ...children) */
export function h(spec, props, ...children) {
  if (props && (props instanceof Node || typeof props === 'string' || Array.isArray(props))) { children.unshift(props); props = null; }
  const [tag, ...rest] = spec.split(/(?=[.#])/);
  const el = document.createElement(tag || 'div');
  for (const r of rest) { if (r[0] === '.') el.classList.add(r.slice(1)); else if (r[0] === '#') el.id = r.slice(1); }
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list' && k !== 'form' && typeof v !== 'object') { try { el[k] = v; } catch { el.setAttribute(k, v); } }
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}
export function append(el, children) {
  for (const c of children.flat(Infinity)) { if (c == null || c === false) continue; el.append(c instanceof Node ? c : document.createTextNode(String(c))); }
  return el;
}
export const clear = (el) => { el.replaceChildren(); return el; };

// ---------- notifications ----------
let toastHost = null;
export function toast(msg, kind = 'info', ms = 3800) {
  if (!toastHost) { toastHost = h('div.toasts'); document.body.append(toastHost); }
  const t = h('div.toast', { class: kind }, msg);
  toastHost.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
  return t;
}
export function errorBox(err) { console.error(err); return h('div.error', h('strong', 'Something went wrong. '), String(err && err.message ? err.message : err)); }
export function notice(msg, kind = 'note') { return h('div.notice', { class: kind }, msg); }

// ---------- files ----------
export function readAs(file, kind = 'bytes') {
  if (kind === 'text') return file.text();
  if (kind === 'url') return Promise.resolve(URL.createObjectURL(file));
  return file.arrayBuffer().then((b) => new Uint8Array(b));
}
export function dropzone({ accept = '', multiple = false, onFiles, label = 'Drop files here or click to browse', hint = '', pasteImages = false, compact = false } = {}) {
  const input = h('input', { type: 'file', accept, multiple, style: { display: 'none' } });
  const zone = h('div.dropzone', { class: compact ? 'compact' : '', tabindex: 0, role: 'button', 'aria-label': label });
  const inner = h('div.dz-inner', h('div.dz-icon', '⬆'), h('div.dz-label', label), hint ? h('div.dz-hint', hint) : null, h('div.dz-hint', accept ? 'Accepted: ' + accept.split(',').map((s) => s.trim()).join(', ') : ''));
  zone.append(inner);
  const emit = (files) => { const list = [...files].filter(Boolean); if (!list.length) return; try { onFiles(multiple ? list : list.slice(0, 1)); } catch (e) { toast(String(e.message || e), 'error'); } };
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('change', () => { emit(input.files); input.value = ''; });
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('over'); emit(e.dataTransfer.files); });
  if (pasteImages) window.addEventListener('paste', (e) => { const files = [...(e.clipboardData?.files || [])]; if (files.length) emit(files); });
  zone.append(input);
  zone.setLabel = (t) => { inner.querySelector('.dz-label').textContent = t; };
  return zone;
}
export function fileChip(file, onRemove) {
  return h('div.chip', h('span.chip-name', file.name), h('span.chip-size', fmtBytes(file.size)), onRemove ? h('button.chip-x', { type: 'button', title: 'Remove', onClick: onRemove }, '×') : null);
}
export function download(data, name, mime = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
/** Result card with a download button + optional preview. */
export function result({ title, data, name, mime, note, preview = null, extra = null }) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const card = h('div.result',
    h('div.result-head', h('div', h('div.result-title', title || name), h('div.result-meta', name, ' · ', fmtBytes(blob.size), note ? ' · ' + note : '')), h('div.row', extra, h('a.btn.primary', { href: url, download: name }, 'Download'))),
    preview ? h('div.result-preview', preview) : null);
  card.blob = blob; card.url = url;
  return card;
}

// ---------- fields ----------
export function field(label, control, help) { const id = control.id || (control.id = 'f' + Math.random().toString(36).slice(2, 8)); return h('label.field', { for: id }, h('span.field-label', label), control, help ? h('span.field-help', help) : null); }
export function select(options, value, onChange) {
  const s = h('select', options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v, selected: String(v) === String(value) }, l); }));
  if (onChange) s.addEventListener('change', () => onChange(s.value));
  return s;
}
export function input(type, props = {}) { return h('input', { type, ...props }); }
export function number(value, { min, max, step = 1, onChange } = {}) { const i = h('input', { type: 'number', value, min, max, step }); if (onChange) i.addEventListener('input', () => onChange(Number(i.value))); return i; }
export function range(value, { min = 0, max = 100, step = 1, onChange, format = (v) => v } = {}) {
  const out = h('span.range-val', format(value));
  const i = h('input', { type: 'range', value, min, max, step });
  i.addEventListener('input', () => { out.textContent = format(Number(i.value)); onChange && onChange(Number(i.value)); });
  const wrap = h('div.range', i, out); wrap.input = i; wrap.getValue = () => Number(i.value); wrap.setValue = (v) => { i.value = v; out.textContent = format(v); };
  return wrap;
}
export function checkbox(label, checked = false, onChange) { const c = h('input', { type: 'checkbox', checked }); if (onChange) c.addEventListener('change', () => onChange(c.checked)); const l = h('label.check', c, h('span', label)); l.input = c; return l; }
export function textarea(props = {}) { return h('textarea', { spellcheck: false, ...props }); }
export function button(label, onClick, cls = '') { return h('button.btn', { type: 'button', class: cls, onClick }, label); }
export function colorInput(value = '#000000', onChange) { const c = h('input', { type: 'color', value }); if (onChange) c.addEventListener('input', () => onChange(c.value)); return c; }
export function row(...children) { return h('div.row', children); }
export function grid(...children) { return h('div.grid2', children); }
export function section(title, ...children) { return h('section.card', title ? h('h3', title) : null, children); }

// ---------- progress / async ----------
export function progress() {
  const bar = h('div.bar'); const label = h('div.progress-label');
  const el = h('div.progress', { hidden: true }, h('div.track', bar), label);
  el.set = (frac, text) => { el.hidden = false; bar.style.width = Math.round(Math.max(0, Math.min(1, frac)) * 100) + '%'; label.textContent = text || ''; };
  el.done = () => { el.hidden = true; };
  return el;
}
/** Run an async job with button state + error handling. */
export async function run(btn, fn, out) {
  const old = btn.textContent; btn.disabled = true; btn.textContent = 'Working…';
  try { return await fn(); }
  catch (e) { if (out) { out.prepend(errorBox(e)); } else toast(String(e.message || e), 'error'); console.error(e); }
  finally { btn.disabled = false; btn.textContent = old; }
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// ---------- clipboard / text ----------
export function copyButton(getText, label = 'Copy') {
  const b = button(label, async () => { try { await navigator.clipboard.writeText(typeof getText === 'function' ? getText() : getText); b.textContent = 'Copied ✓'; setTimeout(() => (b.textContent = label), 1500); } catch { toast('Clipboard blocked by the browser', 'error'); } });
  return b;
}
export function textOutput(text, { name = 'output.txt', mime = 'text/plain', rows = 14 } = {}) {
  const ta = textarea({ readonly: true, rows, value: text, class: 'mono' });
  return h('div.text-output', ta, row(copyButton(() => ta.value), button('Download', () => download(ta.value, name, mime))));
}

// ---------- images ----------
export function loadImage(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => { resolve(img); setTimeout(() => URL.revokeObjectURL(url), 5000); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The browser could not decode this image' + (fileOrBlob.type ? ' (' + fileOrBlob.type + ')' : '') + '.')); };
    img.src = url;
  });
}
export async function decodeToImageData(fileOrBlob, { maxSide = 0 } = {}) {
  const img = await loadImage(fileOrBlob);
  let w = img.naturalWidth, hgt = img.naturalHeight;
  if (maxSide && Math.max(w, hgt) > maxSide) { const s = maxSide / Math.max(w, hgt); w = Math.round(w * s); hgt = Math.round(hgt * s); }
  const c = document.createElement('canvas'); c.width = w; c.height = hgt;
  const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0, w, hgt);
  return { image: img, canvas: c, ctx, data: ctx.getImageData(0, 0, w, hgt), width: w, height: hgt };
}
export function canvasToBlob(canvas, type = 'image/png', quality) { return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Encoding failed for ' + type))), type, quality)); }
export async function blobBytes(blob) { return new Uint8Array(await blob.arrayBuffer()); }
export function imagePreview(blobOrUrl, cls = '') { const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl); return h('img.preview', { src: url, class: cls, alt: 'preview' }); }
export function pdfPreview(bytes, height = 480) {
  // Only embed when the browser has an inline PDF viewer; otherwise an <iframe> would trigger a stray download.
  if (navigator.pdfViewerEnabled === false || /Android|iPhone|iPad/i.test(navigator.userAgent)) return h('div.notice', 'Preview is not available in this browser — use the Download button to open the PDF.');
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  return h('iframe.pdf-frame', { src: url + '#toolbar=0&view=FitH', style: { height: height + 'px' }, title: 'PDF preview' });
}

// ---------- favorites / recents (hub shelf) ----------
const LS = { fav: 'cortexis.favorites', recent: 'cortexis.recent' };
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
export const favorites = { list: () => lsGet(LS.fav), has: (s) => lsGet(LS.fav).includes(s), toggle(s) { const l = lsGet(LS.fav); const i = l.indexOf(s); if (i >= 0) l.splice(i, 1); else l.unshift(s); lsSet(LS.fav, l.slice(0, 50)); return i < 0; } };
export const recents = { list: () => lsGet(LS.recent), push(s) { const l = lsGet(LS.recent).filter((x) => x !== s); l.unshift(s); lsSet(LS.recent, l.slice(0, 12)); }, clear: () => lsSet(LS.recent, []) };

export const supports = {
  webCodecs: typeof VideoEncoder !== 'undefined',
  audioEncoder: typeof AudioEncoder !== 'undefined',
  mediaRecorder: typeof MediaRecorder !== 'undefined',
  offscreen: typeof OffscreenCanvas !== 'undefined',
  decompress: typeof DecompressionStream !== 'undefined',
};
export function outName(file, suffix, ext) { return stripExt(file.name) + (suffix ? '-' + suffix : '') + '.' + ext; }
