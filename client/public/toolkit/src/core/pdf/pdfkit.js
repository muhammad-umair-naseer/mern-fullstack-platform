// High-level PDF operations built on PdfDocument.
import { latin1, deflateZlib, inflateZlib } from '../bytes.js';
import { PdfDocument, N, Dict, Ref, PDFStream, PDFString, pdfDate } from './document.js';
import { encodeWinAnsi, textWidth, standardFontDict, pdfStringLiteral, wrapText, toRoman, pickFont } from './fonts.js';
import { jpegInfo } from '../image-codecs.js';
import { rgbaToRgb, rgbaAlpha, rgbaToGray } from '../image-codecs.js';
import { tokenizeContent, serializeContent, redactOps, extractPageText, inverse, apply } from './content.js';

const f2 = (n) => (Math.round(n * 1000) / 1000).toString();

export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return [0, 0, 0];
  const v = parseInt(m[1], 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}
const rgbOp = (hex, op = 'rg') => hexToRgb(hex).map(f2).join(' ') + ' ' + op;

// ---------- Resources ----------
export function ensureFont(doc, page, fontName) {
  const fonts = doc.resourceSubDict(page, 'Font');
  const key = 'CxF' + fontName.replace(/[^A-Za-z]/g, '');
  if (!fonts.has(key)) {
    if (!doc._fontRefs) doc._fontRefs = new Map();
    if (!doc._fontRefs.has(fontName)) doc._fontRefs.set(fontName, doc.add(standardFontDict(fontName)));
    fonts.set(key, doc._fontRefs.get(fontName));
  }
  return key;
}
export function ensureExtGState(doc, page, props) {
  const gs = doc.resourceSubDict(page, 'ExtGState');
  const key = 'CxGS' + Object.entries(props).map(([k, v]) => k + String(v).replace(/[^A-Za-z0-9]/g, '')).join('');
  if (!gs.has(key)) {
    const d = new Dict({ Type: N('ExtGState') });
    for (const [k, v] of Object.entries(props)) d.set(k, typeof v === 'string' ? N(v) : v);
    gs.set(key, doc.add(d));
  }
  return key;
}
export function addXObject(doc, page, ref) {
  const xo = doc.resourceSubDict(page, 'XObject');
  const key = doc.uniqueResourceName(xo, 'CxIm');
  xo.set(key, ref);
  return key;
}

// ---------- Images ----------
/**
 * Embed an image. Accepts {jpeg: Uint8Array} or {rgba, width, height} (Uint8ClampedArray/Uint8Array).
 * @returns {Promise<{ref: Ref, width:number, height:number}>}
 */
export async function embedImage(doc, img) {
  if (img.jpeg) {
    const info = jpegInfo(img.jpeg);
    if (!info.width) throw new Error('Could not read JPEG dimensions');
    const cs = info.components === 1 ? 'DeviceGray' : info.components === 4 ? 'DeviceCMYK' : 'DeviceRGB';
    const d = new Dict({ Type: N('XObject'), Subtype: N('Image'), Width: info.width, Height: info.height, ColorSpace: N(cs), BitsPerComponent: 8, Filter: N('DCTDecode') });
    if (info.components === 4 && info.adobeInverted) d.set('Decode', [1, 0, 1, 0, 1, 0, 1, 0]);
    const ref = await doc.addStream(d, img.jpeg, { compress: false });
    return { ref, width: info.width, height: info.height };
  }
  const { width, height } = img;
  const rgba = img.rgba || img.data;
  const n = width * height;
  const rgb = rgbaToRgb(rgba, n);
  const { alpha, opaque } = rgbaAlpha(rgba, n);
  const d = new Dict({ Type: N('XObject'), Subtype: N('Image'), Width: width, Height: height, ColorSpace: N('DeviceRGB'), BitsPerComponent: 8 });
  if (!opaque) {
    const sm = await doc.addStream(new Dict({ Type: N('XObject'), Subtype: N('Image'), Width: width, Height: height, ColorSpace: N('DeviceGray'), BitsPerComponent: 8 }), alpha);
    d.set('SMask', sm);
  }
  const ref = await doc.addStream(d, rgb);
  return { ref, width, height };
}

// ---------- Placement helpers ----------
/** Convert a rect given as fractions of the displayed page (x,y from top-left, w,h) into visual points. */
export function fracToVisual(doc, page, frac) {
  const g = doc.pageGeometry(page);
  return { x: frac.x * g.width, y: (1 - frac.y - frac.h) * g.height, w: frac.w * g.width, h: frac.h * g.height, pageW: g.width, pageH: g.height };
}
/** Visual rect (points, origin bottom-left) -> user-space rect. */
export function visualRectToUser(doc, page, r) {
  const m = doc.visualMatrix(page);
  const pts = [apply(m, r.x, r.y), apply(m, r.x + r.w, r.y), apply(m, r.x, r.y + r.h), apply(m, r.x + r.w, r.y + r.h)];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
const cmVisual = (doc, page) => doc.visualMatrix(page).map(f2).join(' ') + ' cm';

function textOps(fontKey, fontName, size, color, text, x, y, angleDeg = 0, align = 'left', opacityKey = null) {
  const bytes = encodeWinAnsi(text);
  const w = textWidth(text, fontName, size);
  const rad = (angleDeg * Math.PI) / 180, c = Math.cos(rad), s = Math.sin(rad);
  const dx = align === 'center' ? -w / 2 : align === 'right' ? -w : 0;
  return `${opacityKey ? '/' + opacityKey + ' gs ' : ''}BT /${fontKey} ${f2(size)} Tf ${rgbOp(color)} ${f2(c)} ${f2(s)} ${f2(-s)} ${f2(c)} ${f2(x)} ${f2(y)} Tm ${f2(dx)} 0 Td ${pdfStringLiteral(bytes)} Tj ET`;
}

// ---------- Watermark ----------
/**
 * opts: { text, fontName, fontSize|'auto', color, opacity, angle, position:'center'|'tile'|{x,y}(fractions), image:{ref,width,height}, imageScale, behind, pages:[indices] }
 */
export async function addWatermark(doc, opts) {
  const pages = opts.pages ? opts.pages.map((i) => doc.pages[i]).filter(Boolean) : doc.pages;
  for (const page of pages) {
    const g = doc.pageGeometry(page);
    const gsKey = ensureExtGState(doc, page, { CA: opts.opacity ?? 0.3, ca: opts.opacity ?? 0.3 });
    let ops = `q ${cmVisual(doc, page)} /${gsKey} gs `;
    const angle = opts.angle ?? 45;
    const positions = [];
    if (opts.position === 'tile') {
      const step = opts.tileStep || Math.max(g.width, g.height) / 3;
      for (let y = step / 2; y < g.height + step; y += step) for (let x = step / 2; x < g.width + step; x += step) positions.push([x, y]);
    } else if (opts.position && typeof opts.position === 'object') positions.push([opts.position.x * g.width, (1 - opts.position.y) * g.height]);
    else positions.push([g.width / 2, g.height / 2]);
    if (opts.image) {
      const key = addXObject(doc, page, opts.image.ref);
      const scale = opts.imageScale ?? 0.5;
      const iw = g.width * scale, ih = (iw * opts.image.height) / opts.image.width;
      for (const [x, y] of positions) {
        const rad = (angle * Math.PI) / 180, c = Math.cos(rad), s = Math.sin(rad);
        ops += `q ${f2(c)} ${f2(s)} ${f2(-s)} ${f2(c)} ${f2(x)} ${f2(y)} cm ${f2(iw)} 0 0 ${f2(ih)} ${f2(-iw / 2)} ${f2(-ih / 2)} cm /${key} Do Q `;
      }
    } else {
      const fontName = opts.fontName || 'Helvetica-Bold';
      const fontKey = ensureFont(doc, page, fontName);
      let size = opts.fontSize;
      if (!size || size === 'auto') {
        const diag = opts.position === 'tile' ? (opts.tileStep || Math.max(g.width, g.height) / 3) * 0.9 : Math.hypot(g.width, g.height) * 0.7;
        size = Math.max(8, Math.min(200, (diag / Math.max(1, textWidth(opts.text || ' ', fontName, 1))) * 0.9));
      }
      for (const [x, y] of positions) ops += textOps(fontKey, fontName, size, opts.color || '#888888', opts.text || '', x, y - size * 0.35, angle, 'center') + ' ';
    }
    ops += 'Q';
    if (opts.behind) await doc.wrapPageContent(page, ops + '\nq', 'Q');
    else await doc.wrapPageContent(page, 'q', 'Q\n' + ops);
  }
}

// ---------- Page numbers ----------
/**
 * opts: { format:'Page {n} of {N}', style:'arabic'|'roman'|'ROMAN'|'letters', start:1, skip:0, h:'center', v:'bottom', margin:36, fontName, fontSize, color, pages:[indices] }
 */
export async function addPageNumbers(doc, opts = {}) {
  const all = doc.pages;
  const idx = opts.pages || all.map((_, i) => i);
  const skip = opts.skip || 0;
  const total = idx.length - skip;
  let counter = opts.start ?? 1;
  const fmtNum = (n) => (opts.style === 'roman' ? toRoman(n).toLowerCase() : opts.style === 'ROMAN' ? toRoman(n) : opts.style === 'letters' ? String.fromCharCode(64 + ((n - 1) % 26) + 1).repeat(Math.ceil(n / 26)) : opts.pad ? String(n).padStart(opts.pad, '0') : String(n));
  for (let k = 0; k < idx.length; k++) {
    if (k < skip) continue;
    const page = all[idx[k]];
    const g = doc.pageGeometry(page);
    const fontName = opts.fontName || 'Helvetica';
    const size = opts.fontSize || 10;
    const fontKey = ensureFont(doc, page, fontName);
    const label = (opts.format || 'Page {n} of {N}').replace(/\{n\}/g, fmtNum(counter)).replace(/\{N\}/g, fmtNum(opts.start != null ? opts.start + total - 1 : total)).replace(/\{p\}/g, String(k + 1)).replace(/\{P\}/g, String(idx.length)).replace(/\{prefix\}/g, opts.prefix || '');
    const m = opts.margin ?? 36;
    const x = opts.h === 'left' ? m : opts.h === 'right' ? g.width - m : g.width / 2;
    const y = opts.v === 'top' ? g.height - m - size * 0.7 : m;
    const ops = `q ${cmVisual(doc, page)} ${textOps(fontKey, fontName, size, opts.color || '#000000', label, x, y, 0, opts.h === 'left' ? 'left' : opts.h === 'right' ? 'right' : 'center')} Q`;
    await doc.wrapPageContent(page, 'q', 'Q\n' + ops);
    counter++;
  }
}

// ---------- Stamp (signature / image / text) ----------
/** Place an image at a visual rect (points, origin bottom-left) on a page. */
export async function stampImage(doc, page, image, rect, { opacity = 1 } = {}) {
  const key = addXObject(doc, page, image.ref);
  const gs = opacity < 1 ? '/' + ensureExtGState(doc, page, { CA: opacity, ca: opacity }) + ' gs ' : '';
  const ops = `q ${cmVisual(doc, page)} ${gs}${f2(rect.w)} 0 0 ${f2(rect.h)} ${f2(rect.x)} ${f2(rect.y)} cm /${key} Do Q`;
  await doc.wrapPageContent(page, 'q', 'Q\n' + ops);
}
export async function stampText(doc, page, text, { x, y, fontName = 'Helvetica', fontSize = 12, color = '#000000', angle = 0, align = 'left' }) {
  const key = ensureFont(doc, page, fontName);
  const ops = `q ${cmVisual(doc, page)} ${textOps(key, fontName, fontSize, color, text, x, y, angle, align)} Q`;
  await doc.wrapPageContent(page, 'q', 'Q\n' + ops);
}

// ---------- Grayscale ----------
/**
 * Convert pages to grayscale. Vector content is desaturated with a Saturation blend layer (supported by
 * Acrobat, Chrome, Firefox/pdf.js, Preview). Raw (Flate) images are rewritten as DeviceGray; JPEG images are
 * converted when a decodeJpeg(bytes)->{width,height,rgba} callback is supplied (the browser can do this).
 */
export async function grayscalePdf(doc, { convertImages = true, decodeJpeg = null, pages = null } = {}) {
  const list = pages ? pages.map((i) => doc.pages[i]) : doc.pages;
  const seen = new Set();
  const stats = { pages: 0, images: 0 };
  for (const page of list) {
    stats.pages++;
    const g = doc.pageGeometry(page);
    const gs = ensureExtGState(doc, page, { BM: 'Saturation', CA: 1, ca: 1 });
    const [x0, y0, x1, y1] = g.box;
    const box = `${f2(x0 - 2)} ${f2(y0 - 2)} ${f2(x1 - x0 + 4)} ${f2(y1 - y0 + 4)} re f`;
    // opaque white backdrop first (so the blend has something to desaturate against), then a Saturation layer on top
    await doc.wrapPageContent(page, `q 1 g ${box} Q\nq`, `Q\nq /${gs} gs 0.5 g ${box} Q`);
    // make sure the page has a non-isolated, non-knockout transparency group so the blend sees page content
    page.dict.set('Group', new Dict({ S: N('Transparency'), CS: N('DeviceRGB'), I: false, K: false }));
    if (convertImages) stats.images += await convertPageImages(doc, page, decodeJpeg, seen);
  }
  return stats;
}
async function convertPageImages(doc, page, decodeJpeg, seen) {
  let converted = 0;
  const res = doc.resolve(page.dict.get('Resources')) || page.resources;
  const xo = res instanceof Dict ? doc.resolve(res.get('XObject')) : null;
  if (!(xo instanceof Dict)) return 0;
  for (const [name, ref] of xo.map) {
    const stm = doc.resolve(ref);
    if (!(stm instanceof PDFStream)) continue;
    const key = ref instanceof Ref ? ref.num : stm;
    if (seen.has(key)) continue;
    seen.add(key);
    const d = stm.dict;
    if (doc.resolve(d.get('Subtype'))?.name !== 'Image') continue;
    if (d.has('SMask') === false && d.has('ImageMask')) continue;
    const cs = doc.resolve(d.get('ColorSpace'));
    const bpc = doc.resolve(d.get('BitsPerComponent'));
    const w = doc.resolve(d.get('Width')), h = doc.resolve(d.get('Height'));
    let gray = null;
    try {
      const { data, remaining } = doc.streamData(stm);
      if (remaining === 'DCTDecode' || remaining === 'DCT') {
        if (!decodeJpeg) continue;
        const img = await decodeJpeg(data);
        if (!img) continue;
        gray = rgbaToGray(img.rgba || img.data, img.width * img.height);
      } else if (!remaining && bpc === 8 && cs instanceof Object && cs.name === 'DeviceRGB' && data.length >= w * h * 3) {
        gray = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) gray[i] = (data[i * 3] * 299 + data[i * 3 + 1] * 587 + data[i * 3 + 2] * 114) / 1000;
      } else if (!remaining && bpc === 8 && cs instanceof Object && cs.name === 'DeviceCMYK' && data.length >= w * h * 4) {
        gray = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) { const k = data[i * 4 + 3]; gray[i] = 255 - Math.min(255, (data[i * 4] * 299 + data[i * 4 + 1] * 587 + data[i * 4 + 2] * 114) / 1000 * (1 - k / 255) + k); }
      } else continue;
    } catch { continue; }
    if (!gray) continue;
    const nd = new Dict({ Type: N('XObject'), Subtype: N('Image'), Width: w, Height: h, ColorSpace: N('DeviceGray'), BitsPerComponent: 8 });
    if (d.has('SMask')) nd.set('SMask', d.get('SMask'));
    if (d.has('Interpolate')) nd.set('Interpolate', d.get('Interpolate'));
    const raw = await deflateZlib(gray);
    nd.set('Filter', N('FlateDecode'));
    nd.set('Length', raw.length);
    if (ref instanceof Ref) doc.set(ref, new PDFStream(nd, raw));
    else xo.set(name, doc.add(new PDFStream(nd, raw)));
    converted++;
  }
  return converted;
}

// ---------- Redaction ----------
/**
 * rects: [{x,y,w,h}] as fractions of the displayed page (top-left origin).
 * Draws opaque boxes and removes the text underneath (best effort; text inside form XObjects is only covered).
 */
export async function redactPage(doc, pageIndex, rects, { color = '#000000', removeText = true } = {}) {
  const page = doc.pages[pageIndex];
  const userRects = rects.map((r) => visualRectToUser(doc, page, fracToVisual(doc, page, r)));
  let removed = 0;
  if (removeText) {
    const content = doc.pageContent(page);
    const ops = tokenizeContent(content);
    const result = redactOps(doc, page, ops, userRects);
    removed = result.removed;
    if (removed) await doc.setPageContent(page, serializeContent(result.ops));
    // drop annotations that intersect (links, text annotations that could leak content)
    const annots = doc.resolve(page.dict.get('Annots'));
    if (Array.isArray(annots)) {
      const keep = annots.filter((a) => {
        const ad = doc.resolve(a);
        const rect = ad instanceof Dict ? doc.numArray(ad.get('Rect'), 4) : null;
        if (!rect) return true;
        const r = [Math.min(rect[0], rect[2]), Math.min(rect[1], rect[3]), Math.max(rect[0], rect[2]), Math.max(rect[1], rect[3])];
        return !userRects.some((u) => r[2] > u[0] && r[0] < u[2] && r[3] > u[1] && r[1] < u[3]);
      });
      page.dict.set('Annots', keep);
    }
  }
  let ops = `q ${cmVisual(doc, page)} ${rgbOp(color)} `;
  for (const r of rects) { const v = fracToVisual(doc, page, r); ops += `${f2(v.x)} ${f2(v.y)} ${f2(v.w)} ${f2(v.h)} re f `; }
  ops += 'Q';
  await doc.wrapPageContent(page, 'q', 'Q\n' + ops);
  return { removed };
}

// ---------- Outlines ----------
export function readOutlines(doc) {
  const cat = doc.catalog;
  const root = doc.resolve(cat.get('Outlines'));
  const pageIndex = new Map(doc.pages.map((p, i) => [p.ref ? p.ref.num : -1, i]));
  const destPage = (dest) => {
    dest = doc.resolve(dest);
    if (dest instanceof PDFString || dest instanceof Object && dest.name !== undefined && !(dest instanceof Dict)) {
      // named destination
      const name = dest instanceof PDFString ? dest.toText() : dest.name;
      const names = doc.resolve(cat.get('Names'));
      const dests = doc.resolve(cat.get('Dests'));
      let found = dests instanceof Dict ? doc.resolve(dests.get(name)) : null;
      if (!found && names instanceof Dict) found = lookupNameTree(doc, doc.resolve(names.get('Dests')), name);
      dest = found;
    }
    if (dest instanceof Dict) dest = doc.resolve(dest.get('D'));
    if (Array.isArray(dest) && dest[0] instanceof Ref) return pageIndex.get(dest[0].num) ?? 0;
    if (Array.isArray(dest) && typeof dest[0] === 'number') return dest[0];
    return 0;
  };
  const walk = (ref, depth) => {
    const items = [];
    let guard = 0;
    while (ref && guard++ < 5000) {
      const it = doc.resolve(ref);
      if (!(it instanceof Dict)) break;
      const title = doc.resolve(it.get('Title'));
      let page = 0;
      if (it.has('Dest')) page = destPage(it.get('Dest'));
      else { const a = doc.resolve(it.get('A')); if (a instanceof Dict && a.has('D')) page = destPage(a.get('D')); }
      items.push({ title: title instanceof PDFString ? title.toText() : '', page, children: depth < 12 ? walk(it.get('First'), depth + 1) : [] });
      ref = it.get('Next');
    }
    return items;
  };
  return root instanceof Dict ? walk(root.get('First'), 0) : [];
}
function lookupNameTree(doc, node, name) {
  node = doc.resolve(node);
  if (!(node instanceof Dict)) return null;
  const names = doc.resolve(node.get('Names'));
  if (Array.isArray(names)) for (let i = 0; i + 1 < names.length; i += 2) { const k = doc.resolve(names[i]); if (k instanceof PDFString && k.toText() === name) return doc.resolve(names[i + 1]); }
  const kids = doc.resolve(node.get('Kids'));
  if (Array.isArray(kids)) for (const k of kids) { const r = lookupNameTree(doc, k, name); if (r) return r; }
  return null;
}
/** items: [{title, page(0-based), children:[...]}] */
export function writeOutlines(doc, items, { showOnOpen = true } = {}) {
  const cat = doc.catalog;
  if (!items.length) { cat.delete('Outlines'); if (showOnOpen === false) cat.delete('PageMode'); return; }
  const rootDict = new Dict({ Type: N('Outlines') });
  const rootRef = doc.add(rootDict);
  const build = (list, parentRef) => {
    const refs = list.map(() => doc.add(new Dict()));
    let total = 0;
    list.forEach((it, i) => {
      const page = doc.pages[Math.max(0, Math.min(doc.pages.length - 1, it.page | 0))];
      const d = new Dict({ Title: PDFString.fromText(it.title || 'Untitled'), Parent: parentRef, Dest: [page.ref, N('XYZ'), null, null, null] });
      if (i > 0) d.set('Prev', refs[i - 1]);
      if (i < list.length - 1) d.set('Next', refs[i + 1]);
      if (it.children && it.children.length) {
        const c = build(it.children, refs[i]);
        d.set('First', c.first); d.set('Last', c.last); d.set('Count', it.open === false ? -c.count : c.count);
        total += c.count;
      }
      doc.set(refs[i], d);
      total++;
    });
    return { first: refs[0], last: refs[refs.length - 1], count: total };
  };
  const b = build(items, rootRef);
  rootDict.set('First', b.first); rootDict.set('Last', b.last); rootDict.set('Count', b.count);
  cat.set('Outlines', rootRef);
  if (showOnOpen) cat.set('PageMode', N('UseOutlines'));
}

// ---------- Metadata ----------
export function setMetadata(doc, { title, author, subject, keywords, creator }) {
  const info = doc.info;
  if (title !== undefined) info.set('Title', PDFString.fromText(title));
  if (author !== undefined) info.set('Author', PDFString.fromText(author));
  if (subject !== undefined) info.set('Subject', PDFString.fromText(subject));
  if (keywords !== undefined) info.set('Keywords', PDFString.fromText(keywords));
  if (creator !== undefined) info.set('Creator', PDFString.fromText(creator));
  if (!info.has('CreationDate')) info.set('CreationDate', PDFString.fromText(pdfDate(new Date())));
}
export function getMetadata(doc) {
  const info = doc.resolve(doc.trailer.get('Info'));
  const out = {};
  if (info instanceof Dict) for (const k of ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate']) { const v = doc.resolve(info.get(k)); if (v instanceof PDFString) out[k[0].toLowerCase() + k.slice(1)] = v.toText(); }
  return out;
}

// ---------- Builder for new documents ----------
export const PAGE_SIZES = { A4: [595.28, 841.89], Letter: [612, 792], Legal: [612, 1008], A3: [841.89, 1190.55], A5: [419.53, 595.28] };

export class PdfBuilder {
  constructor({ pageSize = 'A4', landscape = false, margins = 56, doc = null } = {}) {
    this.doc = doc || PdfDocument.create();
    let [w, h] = Array.isArray(pageSize) ? pageSize : PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
    if (landscape) [w, h] = [h, w];
    this.pw = w; this.ph = h;
    this.m = typeof margins === 'number' ? { top: margins, right: margins, bottom: margins, left: margins } : margins;
    this.page = null; this.ops = []; this.y = 0; this.pageCount = 0;
    this.pendingStreams = [];
  }
  get contentWidth() { return this.pw - this.m.left - this.m.right; }
  get bottom() { return this.m.bottom; }
  newPage(size) {
    this.flushPage();
    if (size) { this.pw = size[0]; this.ph = size[1]; }
    this.page = this.doc.addPage({ width: this.pw, height: this.ph });
    this.ops = [];
    this.y = this.ph - this.m.top;
    this.pageCount++;
    this.fontKeys = new Map();
    return this.page;
  }
  flushPage() {
    if (this.page && this.ops.length) {
      const page = this.page, ops = this.ops.join('\n');
      this.pendingStreams.push(this.doc.setPageContent(page, ops));
    }
  }
  ensure(h) { if (!this.page || this.y - h < this.bottom) this.newPage(); }
  font(name) {
    if (!this.page) this.newPage();
    return ensureFont(this.doc, this.page, name);
  }
  raw(ops) { if (!this.page) this.newPage(); this.ops.push(ops); }
  /** Draw a single line of text at absolute position (no wrapping). */
  drawText(text, x, y, { fontName = 'Helvetica', size = 11, color = '#000000', align = 'left', underline = false } = {}) {
    const key = this.font(fontName);
    const w = textWidth(text, fontName, size);
    const dx = align === 'center' ? -w / 2 : align === 'right' ? -w : 0;
    this.ops.push(`BT /${key} ${f2(size)} Tf ${rgbOp(color)} ${f2(x + dx)} ${f2(y)} Td ${pdfStringLiteral(encodeWinAnsi(text))} Tj ET`);
    if (underline) this.ops.push(`${rgbOp(color, 'RG')} ${f2(Math.max(0.5, size / 16))} w ${f2(x + dx)} ${f2(y - size * 0.12)} m ${f2(x + dx + w)} ${f2(y - size * 0.12)} l S`);
    return w;
  }
  /** Wrapped paragraph. */
  text(text, { fontName = 'Helvetica', size = 11, color = '#000000', align = 'left', lineHeight = 1.35, indent = 0, x = null, width = null, spaceAfter = 0, keepTogether = false } = {}) {
    const left = x ?? this.m.left + indent;
    const maxW = width ?? this.contentWidth - indent;
    const lines = wrapText(text, fontName, size, maxW);
    const lh = size * lineHeight;
    if (keepTogether) this.ensure(lh * lines.length);
    for (const line of lines) {
      this.ensure(lh);
      const ax = align === 'center' ? left + maxW / 2 : align === 'right' ? left + maxW : left;
      this.y -= lh;
      if (line) this.drawText(line, ax, this.y + lh * 0.25, { fontName, size, color, align });
    }
    this.y -= spaceAfter;
  }
  /** Mixed-style runs: [{text, bold, italic, mono, size, color, underline}] */
  rich(runs, { align = 'left', lineHeight = 1.35, indent = 0, size = 11, spaceAfter = 0, firstLineIndent = 0, bullet = null } = {}) {
    const left = this.m.left + indent, maxW = this.contentWidth - indent;
    if (typeof bullet === 'string') bullet = { text: bullet, offset: Math.max(10, indent) };
    const tokens = [];
    for (const r of runs) {
      const fontName = r.fontName || pickFont(r);
      const sz = r.size || size;
      const parts = String(r.text ?? '').split(/(\s+|\n)/);
      for (const p of parts) {
        if (!p) continue;
        if (p === '\n') { tokens.push({ br: true }); continue; }
        tokens.push({ text: p, fontName, size: sz, color: r.color || '#000000', underline: !!r.underline, w: textWidth(p, fontName, sz), space: /^\s+$/.test(p) });
      }
    }
    const lines = [];
    let line = [], lw = 0, first = true;
    const avail = () => maxW - (first ? firstLineIndent : 0);
    for (const t of tokens) {
      if (t.br) { lines.push(line); line = []; lw = 0; first = false; continue; }
      if (lw + t.w > avail() && line.length && !t.space) {
        while (line.length && line[line.length - 1].space) { lw -= line[line.length - 1].w; line.pop(); }
        lines.push(line); line = []; lw = 0; first = false;
      }
      if (t.space && !line.length) continue;
      if (t.w > avail() && !line.length) { // break a very long token
        let chunk = '', cw = 0;
        for (const ch of t.text) { const w = textWidth(ch, t.fontName, t.size); if (cw + w > avail() && chunk) { lines.push([{ ...t, text: chunk, w: cw }]); chunk = ''; cw = 0; first = false; } chunk += ch; cw += w; }
        line.push({ ...t, text: chunk, w: cw }); lw = cw; continue;
      }
      line.push(t); lw += t.w;
    }
    lines.push(line);
    const maxSize = Math.max(size, ...tokens.filter((t) => !t.br).map((t) => t.size));
    const lh = maxSize * lineHeight;
    lines.forEach((ln, i) => {
      this.ensure(lh);
      this.y -= lh;
      const lineW = ln.reduce((a, t) => a + t.w, 0);
      let x = left + (i === 0 ? firstLineIndent : 0);
      if (align === 'center') x = left + (maxW - lineW) / 2; else if (align === 'right') x = left + maxW - lineW;
      if (i === 0 && bullet) this.drawText(bullet.text, left - bullet.offset, this.y + lh * 0.25, { fontName: bullet.fontName || 'Helvetica', size, color: bullet.color || '#000000' });
      for (const t of ln) { if (!t.space) this.drawText(t.text, x, this.y + lh * 0.25, { fontName: t.fontName, size: t.size, color: t.color, underline: t.underline }); x += t.w; }
    });
    this.y -= spaceAfter;
  }
  spacer(h) { this.y -= h; if (this.y < this.bottom) this.newPage(); }
  hr({ color = '#cccccc', width = 0.5 } = {}) { this.ensure(6); this.y -= 3; this.ops.push(`${rgbOp(color, 'RG')} ${f2(width)} w ${f2(this.m.left)} ${f2(this.y)} m ${f2(this.pw - this.m.right)} ${f2(this.y)} l S`); this.y -= 3; }
  rect(x, y, w, h, { fill = null, stroke = null, lineWidth = 0.5 } = {}) {
    const ops = [];
    if (fill) ops.push(rgbOp(fill));
    if (stroke) ops.push(rgbOp(stroke, 'RG') + ` ${f2(lineWidth)} w`);
    ops.push(`${f2(x)} ${f2(y)} ${f2(w)} ${f2(h)} re ${fill && stroke ? 'B' : fill ? 'f' : 'S'}`);
    this.ops.push(ops.join(' '));
  }
  /** Embed & place an image (see embedImage input). Scales to fit width (points) keeping aspect. */
  async image(img, { width = null, height = null, align = 'left', spaceAfter = 8 } = {}) {
    const emb = await embedImage(this.doc, img);
    let w = width, h = height;
    if (!w && !h) { w = Math.min(this.contentWidth, emb.width * 0.75); }
    if (w && !h) h = (w * emb.height) / emb.width;
    if (h && !w) w = (h * emb.width) / emb.height;
    if (w > this.contentWidth) { h = (h * this.contentWidth) / w; w = this.contentWidth; }
    const maxH = this.ph - this.m.top - this.m.bottom;
    if (h > maxH) { w = (w * maxH) / h; h = maxH; }
    this.ensure(h);
    const x = align === 'center' ? this.m.left + (this.contentWidth - w) / 2 : align === 'right' ? this.pw - this.m.right - w : this.m.left;
    this.y -= h;
    const key = addXObject(this.doc, this.page, emb.ref);
    this.ops.push(`q ${f2(w)} 0 0 ${f2(h)} ${f2(x)} ${f2(this.y)} cm /${key} Do Q`);
    this.y -= spaceAfter;
    return emb;
  }
  /**
   * Table with wrapped cells. rows: string[][] ; opts: {colWidths, fontSize, header, borderColor, headerFill, cellPadding, align:[]}
   */
  table(rows, { colWidths = null, fontSize = 9, header = true, borderColor = '#999999', headerFill = '#eeeeee', cellPadding = 4, aligns = null, repeatHeader = true, fontName = 'Helvetica', maxRowHeight = 400 } = {}) {
    if (!rows.length) return;
    const cols = Math.max(...rows.map((r) => r.length));
    let widths = colWidths;
    if (!widths) {
      const maxChars = new Array(cols).fill(0);
      for (const r of rows.slice(0, 200)) r.forEach((c, i) => { const len = Math.min(60, String(c ?? '').length); if (len > maxChars[i]) maxChars[i] = len; });
      const total = maxChars.reduce((a, b) => a + Math.max(3, b), 0);
      widths = maxChars.map((c) => (Math.max(3, c) / total) * this.contentWidth);
    }
    const lh = fontSize * 1.3;
    const layoutRow = (row, isHeader) => row.map((cell, i) => wrapText(String(cell ?? ''), isHeader ? 'Helvetica-Bold' : fontName, fontSize, Math.max(4, widths[i] - cellPadding * 2)));
    const drawRow = (cellsLines, isHeader) => {
      const h = Math.min(maxRowHeight, Math.max(...cellsLines.map((l) => l.length)) * lh + cellPadding * 2);
      this.ensure(h);
      const top = this.y;
      let x = this.m.left;
      cellsLines.forEach((lines, i) => {
        const w = widths[i];
        this.rect(x, top - h, w, h, { fill: isHeader ? headerFill : null, stroke: borderColor, lineWidth: 0.4 });
        const al = aligns ? aligns[i] : 'left';
        let ty = top - cellPadding - fontSize;
        for (const line of lines) {
          if (ty < top - h + 2) break;
          const tx = al === 'right' ? x + w - cellPadding : al === 'center' ? x + w / 2 : x + cellPadding;
          this.drawText(line, tx, ty, { fontName: isHeader ? 'Helvetica-Bold' : fontName, size: fontSize, align: al });
          ty -= lh;
        }
        x += w;
      });
      this.y = top - h;
    };
    const headerLines = header ? layoutRow(rows[0], true) : null;
    const body = header ? rows.slice(1) : rows;
    if (header) drawRow(headerLines, true);
    for (const r of body) {
      const cells = layoutRow(r, false);
      const h = Math.min(maxRowHeight, Math.max(...cells.map((l) => l.length)) * lh + cellPadding * 2);
      if (this.y - h < this.bottom) { this.newPage(); if (header && repeatHeader) drawRow(headerLines, true); }
      drawRow(cells, false);
    }
    this.y -= 6;
  }
  async finish(meta = {}) {
    if (!this.page) this.newPage();
    this.flushPage();
    await Promise.all(this.pendingStreams);
    setMetadata(this.doc, { creator: 'Cortexis Tools', ...meta });
    return this.doc.save();
  }
}

export { PdfDocument, extractPageText, inverse, apply };
