// Image extras: GIF decoder (LZW, frames, disposal), EXIF reader, metadata strippers (JPEG/PNG/WebP), SVG optimizer.
import { be16, be32, le16, le32, latin1, concat, ByteWriter } from '../bytes.js';
import { pngChunks, stripPngMetadata, stripJpegMetadata, isPng, isJpeg } from '../image-codecs.js';
import { parseXml, serializeXml } from '../xml.js';

// ---------------- GIF ----------------
export function isGif(b) { return b.length > 6 && latin1.decode(b.subarray(0, 3)) === 'GIF'; }
/** Decode all frames into RGBA canvases. Returns { width, height, frames:[{rgba, delay(ms)}], loop } */
export function decodeGif(b, { maxFrames = 5000 } = {}) {
  if (!isGif(b)) throw new Error('Not a GIF file');
  const width = le16(b, 6), height = le16(b, 8);
  const packed = b[10]; let p = 13;
  let gct = null;
  if (packed & 0x80) { const n = 2 << (packed & 7); gct = b.subarray(p, p + n * 3); p += n * 3; }
  const bgIndex = b[11];
  const frames = []; let loop = 0;
  const canvas = new Uint8ClampedArray(width * height * 4);
  let prevCanvas = null;
  let gce = { delay: 100, transparent: -1, disposal: 0 };
  const readSubBlocks = () => { const parts = []; while (p < b.length) { const n = b[p++]; if (!n) break; parts.push(b.subarray(p, p + n)); p += n; } return concat(parts); };
  while (p < b.length && frames.length < maxFrames) {
    const sig = b[p++];
    if (sig === 0x3b) break; // trailer
    if (sig === 0x21) { // extension
      const label = b[p++];
      if (label === 0xf9) { const size = b[p++]; const flags = b[p]; const delay = le16(b, p + 1) * 10; const ti = b[p + 3]; p += size; p++; gce = { delay: delay < 20 ? 100 : delay, transparent: flags & 1 ? ti : -1, disposal: (flags >> 2) & 7 }; }
      else if (label === 0xff) { const size = b[p++]; const app = latin1.decode(b.subarray(p, p + size)); p += size; const data = readSubBlocks(); if (app.startsWith('NETSCAPE') && data.length >= 3) loop = le16(data, 1); }
      else { p++; while (p < b.length) { const n = b[p - 1]; if (!n) break; p += n; p++; } p--; readSubBlocks(); }
      continue;
    }
    if (sig !== 0x2c) break; // image descriptor expected
    const ix = le16(b, p), iy = le16(b, p + 2), iw = le16(b, p + 4), ih = le16(b, p + 6); const ipacked = b[p + 8]; p += 9;
    let lct = gct;
    if (ipacked & 0x80) { const n = 2 << (ipacked & 7); lct = b.subarray(p, p + n * 3); p += n * 3; }
    const interlaced = !!(ipacked & 0x40);
    const minCode = b[p++];
    const data = readSubBlocks();
    const indices = lzwDecode(data, minCode, iw * ih);
    if (gce.disposal === 3) prevCanvas = canvas.slice();
    // draw
    const rowOrder = [];
    if (interlaced) { for (const [start, step] of [[0, 8], [4, 8], [2, 4], [1, 2]]) for (let r = start; r < ih; r += step) rowOrder.push(r); } else for (let r = 0; r < ih; r++) rowOrder.push(r);
    for (let k = 0; k < ih; k++) {
      const r = rowOrder[k];
      const y = iy + r; if (y >= height) continue;
      for (let x = 0; x < iw; x++) {
        const px = ix + x; if (px >= width) continue;
        const idx = indices[k * iw + x];
        if (idx === gce.transparent || !lct) continue;
        const o = (y * width + px) * 4;
        canvas[o] = lct[idx * 3]; canvas[o + 1] = lct[idx * 3 + 1]; canvas[o + 2] = lct[idx * 3 + 2]; canvas[o + 3] = 255;
      }
    }
    frames.push({ rgba: canvas.slice(), delay: gce.delay });
    // dispose
    if (gce.disposal === 2) { for (let y = iy; y < Math.min(height, iy + ih); y++) canvas.fill(0, (y * width + ix) * 4, (y * width + Math.min(width, ix + iw)) * 4); }
    else if (gce.disposal === 3 && prevCanvas) canvas.set(prevCanvas);
    gce = { delay: 100, transparent: -1, disposal: 0 };
  }
  return { width, height, frames, loop, bgIndex };
}
function lzwDecode(data, minCode, pixelCount) {
  const out = new Uint8Array(pixelCount);
  const clear = 1 << minCode, eoi = clear + 1;
  let codeSize = minCode + 1, dictSize = eoi + 1;
  const prefix = new Int32Array(4096), suffix = new Uint8Array(4096), lengths = new Uint16Array(4096);
  for (let i = 0; i < clear; i++) { prefix[i] = -1; suffix[i] = i; lengths[i] = 1; }
  let bitBuf = 0, bitCnt = 0, pos = 0, op = 0, prev = -1;
  const stack = new Uint8Array(4097);
  while (op < pixelCount) {
    while (bitCnt < codeSize && pos < data.length) { bitBuf |= data[pos++] << bitCnt; bitCnt += 8; }
    if (bitCnt < codeSize) break;
    const code = bitBuf & ((1 << codeSize) - 1); bitBuf >>>= codeSize; bitCnt -= codeSize;
    if (code === clear) { codeSize = minCode + 1; dictSize = eoi + 1; prev = -1; continue; }
    if (code === eoi) break;
    let entry = code, first;
    if (code >= dictSize) { if (prev < 0) break; entry = prev; } // KwKwK case handled below
    // walk the chain into the stack
    let n = 0; let c = entry;
    if (code >= dictSize) { // code == dictSize: prev string + its first char
      c = prev; while (c >= 0) { stack[n++] = suffix[c]; c = prefix[c]; } // reversed prev
      first = stack[n - 1]; // first char of prev
      // string = prev + first
      for (let i = n - 1; i >= 0; i--) { if (op < pixelCount) out[op++] = stack[i]; }
      if (op < pixelCount) out[op++] = first;
    } else {
      while (c >= 0) { stack[n++] = suffix[c]; c = prefix[c]; }
      first = stack[n - 1];
      for (let i = n - 1; i >= 0; i--) { if (op < pixelCount) out[op++] = stack[i]; }
    }
    if (prev >= 0 && dictSize < 4096) { prefix[dictSize] = prev; suffix[dictSize] = first; lengths[dictSize] = lengths[prev] + 1; dictSize++; if (dictSize === 1 << codeSize && codeSize < 12) codeSize++; }
    prev = code >= dictSize ? dictSize - 1 : code;
  }
  return out;
}

// ---------------- EXIF ----------------
const TAGS = { 0x010f: 'Make', 0x0110: 'Model', 0x0112: 'Orientation', 0x011a: 'XResolution', 0x011b: 'YResolution', 0x0131: 'Software', 0x0132: 'DateTime', 0x013b: 'Artist', 0x8298: 'Copyright', 0x8769: 'ExifIFD', 0x8825: 'GPSIFD', 0x829a: 'ExposureTime', 0x829d: 'FNumber', 0x8827: 'ISO', 0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized', 0x920a: 'FocalLength', 0xa002: 'PixelXDimension', 0xa003: 'PixelYDimension', 0xa405: 'FocalLengthIn35mm', 0xa430: 'CameraOwnerName', 0xa431: 'BodySerialNumber', 0xa432: 'LensSpecification', 0xa433: 'LensMake', 0xa434: 'LensModel', 0x9291: 'SubSecTimeOriginal', 0x9286: 'UserComment', 0x0001: 'GPSLatitudeRef', 0x0002: 'GPSLatitude', 0x0003: 'GPSLongitudeRef', 0x0004: 'GPSLongitude', 0x0005: 'GPSAltitudeRef', 0x0006: 'GPSAltitude', 0x0007: 'GPSTimeStamp', 0x001d: 'GPSDateStamp', 0x0011: 'GPSImgDirection' };
/** Parse EXIF from a JPEG (APP1) or a raw TIFF block. Returns { tags:{name:value}, gps:{lat,lon}|null, hasXmp, hasIptc, hasIcc } */
export function readExif(bytes) {
  const out = { tags: {}, gps: null, hasXmp: false, hasIptc: false, hasIcc: false, hasExif: false };
  let tiff = null;
  if (isJpeg(bytes)) {
    let p = 2;
    while (p + 4 < bytes.length && bytes[p] === 0xff) {
      const marker = bytes[p + 1]; const len = be16(bytes, p + 2);
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0xe1) { const head = latin1.decode(bytes.subarray(p + 4, p + 10)); if (head.startsWith('Exif')) tiff = bytes.subarray(p + 10, p + 2 + len); else if (latin1.decode(bytes.subarray(p + 4, p + 33)).startsWith('http://ns.adobe.com/xap/1.0/')) out.hasXmp = true; }
      if (marker === 0xed) out.hasIptc = true;
      if (marker === 0xe2 && latin1.decode(bytes.subarray(p + 4, p + 15)).startsWith('ICC_PROFILE')) out.hasIcc = true;
      p += 2 + len;
    }
  } else if (bytes.length > 8 && ((bytes[0] === 0x49 && bytes[1] === 0x49) || (bytes[0] === 0x4d && bytes[1] === 0x4d))) tiff = bytes;
  else if (isPng(bytes)) { for (const c of pngChunks(bytes)) { if (c.type === 'eXIf') tiff = c.data; if (c.type === 'iTXt' && latin1.decode(c.data.subarray(0, 17)) === 'XML:com.adobe.xmp') out.hasXmp = true; if (c.type === 'iCCP') out.hasIcc = true; if (c.type === 'tEXt' || c.type === 'zTXt' || c.type === 'iTXt') { const key = latin1.decode(c.data.subarray(0, c.data.indexOf(0))); out.tags['PNG:' + key] = c.type === 'tEXt' ? latin1.decode(c.data.subarray(key.length + 1)).slice(0, 200) : '(compressed text)'; } } }
  else if (isWebp(bytes)) { for (const ch of riffChunks(bytes)) { if (ch.id === 'EXIF') tiff = ch.data; if (ch.id === 'XMP ') out.hasXmp = true; if (ch.id === 'ICCP') out.hasIcc = true; } }
  if (!tiff || tiff.length < 8) return out;
  out.hasExif = true;
  const le = tiff[0] === 0x49;
  const r16 = (o) => (le ? le16(tiff, o) : be16(tiff, o)), r32 = (o) => (le ? le32(tiff, o) : be32(tiff, o));
  const readIfd = (off, into, depth) => {
    if (off + 2 > tiff.length || depth > 4) return;
    const n = r16(off);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12; if (e + 12 > tiff.length) break;
      const tag = r16(e), type = r16(e + 2), count = r32(e + 4);
      const sizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
      const size = (sizes[type] || 1) * count;
      const vo = size > 4 ? r32(e + 8) : e + 8;
      if (vo + size > tiff.length) continue;
      let val;
      if (type === 2) val = latin1.decode(tiff.subarray(vo, vo + count)).replace(/\0+$/, '');
      else if (type === 3) val = count === 1 ? r16(vo) : Array.from({ length: count }, (_, k) => r16(vo + k * 2));
      else if (type === 4 || type === 9) val = count === 1 ? r32(vo) : Array.from({ length: count }, (_, k) => r32(vo + k * 4));
      else if (type === 5 || type === 10) val = Array.from({ length: count }, (_, k) => { const a = r32(vo + k * 8), b = r32(vo + k * 8 + 4); return b ? (type === 10 ? (a | 0) / (b | 0) : a / b) : 0; }); 
      else if (type === 7 && tag === 0x9286) val = latin1.decode(tiff.subarray(vo + 8, vo + count)).replace(/\0+$/, '');
      else val = `(${count} bytes)`;
      if (Array.isArray(val) && val.length === 1) val = val[0];
      const name = TAGS[tag] || `Tag0x${tag.toString(16)}`;
      if (tag === 0x8769 || tag === 0x8825) { readIfd(typeof val === 'number' ? val : 0, into, depth + 1); continue; }
      into[name] = val;
    }
  };
  readIfd(r32(4), out.tags, 0);
  const t = out.tags;
  if (Array.isArray(t.GPSLatitude) && Array.isArray(t.GPSLongitude)) {
    const dms = (a) => a[0] + (a[1] || 0) / 60 + (a[2] || 0) / 3600;
    out.gps = { lat: dms(t.GPSLatitude) * (t.GPSLatitudeRef === 'S' ? -1 : 1), lon: dms(t.GPSLongitude) * (t.GPSLongitudeRef === 'W' ? -1 : 1) };
  }
  return out;
}

// ---------------- WebP ----------------
export function isWebp(b) { return b.length > 12 && latin1.decode(b.subarray(0, 4)) === 'RIFF' && latin1.decode(b.subarray(8, 12)) === 'WEBP'; }
export function* riffChunks(b) { let p = 12; while (p + 8 <= b.length) { const id = latin1.decode(b.subarray(p, p + 4)); const size = le32(b, p + 4); yield { id, start: p, data: b.subarray(p + 8, p + 8 + size), size }; p += 8 + size + (size & 1); } }
export function stripWebpMetadata(b) {
  const keep = [];
  let vp8x = null;
  for (const c of riffChunks(b)) { if (c.id === 'EXIF' || c.id === 'XMP ') continue; if (c.id === 'VP8X') vp8x = c; keep.push(c); }
  const parts = [];
  for (const c of keep) {
    const w = new ByteWriter(8 + c.size + (c.size & 1));
    w.str(c.id).u32le(c.size);
    if (c.id === 'VP8X') { const d = c.data.slice(); d[0] &= ~(0x08 | 0x04); w.bytes(d); } else w.bytes(c.data);
    if (c.size & 1) w.u8(0);
    parts.push(w.result());
  }
  const body = concat(parts);
  const head = new ByteWriter(12); head.str('RIFF').u32le(body.length + 4).str('WEBP');
  return concat([head.result(), body]);
}
export function webpInfo(b) { for (const c of riffChunks(b)) { if (c.id === 'VP8X') return { width: 1 + (c.data[4] | (c.data[5] << 8) | (c.data[6] << 16)), height: 1 + (c.data[7] | (c.data[8] << 8) | (c.data[9] << 16)), animated: !!(c.data[0] & 2), alpha: !!(c.data[0] & 16) }; if (c.id === 'VP8 ') return { width: le16(c.data, 6) & 0x3fff, height: le16(c.data, 8) & 0x3fff }; if (c.id === 'VP8L') { const bits = le32(c.data, 1); return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, alpha: !!((bits >> 28) & 1) }; } } return null; }

/** Strip metadata from JPEG/PNG/WebP. Returns {bytes, changed, kind} */
export function stripMetadata(bytes, { keepIcc = true } = {}) {
  if (isJpeg(bytes)) { const r = stripJpegMetadata(bytes, { keepIcc }); return { bytes: r.bytes, removed: r.removed, kind: 'jpeg' }; }
  if (isPng(bytes)) { const r = stripPngMetadata(bytes); return { bytes: r.bytes || r, removed: r.removed || [], kind: 'png' }; }
  if (isWebp(bytes)) return { bytes: stripWebpMetadata(bytes), kind: 'webp' };
  return null;
}

// ---------------- SVG optimizer ----------------
const EDITOR_NS = /^(xmlns:)?(inkscape|sodipodi|adobe|illustrator|sketch|figma|serif|krita|dc|cc|rdf|ns\d+|xlink)$/i;
const DEFAULTS = { 'fill-opacity': '1', 'stroke-opacity': '1', opacity: '1', 'stroke-width': '1', 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter', 'stroke-miterlimit': '4', 'fill-rule': 'nonzero', 'clip-rule': 'nonzero', 'font-style': 'normal', 'font-weight': 'normal', overflow: 'visible', x: '0', y: '0', rx: '0', ry: '0', 'stroke-dasharray': 'none', 'stroke-dashoffset': '0', display: 'inline', visibility: 'visible' };
export function optimizeSvg(src, { precision = 3, removeIds = true, removeComments = true, removeMetadata = true, removeEditorData = true, removeDefaults = true, removeEmptyGroups = true, roundNumbers = true, minifyStyles = true, pretty = false, removeViewBoxSize = false, keepIdsRe = null } = {}) {
  const doc = parseXml(src);
  const before = src.length;
  const round = (n) => { const v = parseFloat(n); if (!Number.isFinite(v)) return n; const s = Number(v.toFixed(precision)).toString(); return s === '-0' ? '0' : s; };
  const numRe = /-?\d*\.?\d+(?:[eE][-+]?\d+)?/g;
  const roundStr = (s) => s.replace(numRe, (m) => round(m));
  const usedIds = new Set();
  const collectRefs = (node) => { if (node.type !== 'element' && node.type !== 'document') return; if (node.attrs) for (const [k, v] of Object.entries(node.attrs)) { const m = /url\(#([^)]+)\)/.exec(v); if (m) usedIds.add(m[1]); if ((k === 'href' || k === 'xlink:href') && v.startsWith('#')) usedIds.add(v.slice(1)); if (k === 'style') for (const mm of v.matchAll(/url\(#([^)]+)\)/g)) usedIds.add(mm[1]); } for (const c of node.children || []) { if (c.type === 'text' && node.name === 'style') for (const mm of c.text.matchAll(/url\(#([^)]+)\)|#([A-Za-z_][\w-]*)/g)) usedIds.add(mm[1] || mm[2]); collectRefs(c); } };
  collectRefs(doc);
  const visit = (node, parent) => {
    node.children = (node.children || []).filter((c) => {
      if (c.type === 'comment') return !removeComments;
      if (c.type === 'pi' || c.type === 'cdata') return true;
      if (c.type === 'text') { if (parent && ['text', 'tspan', 'style', 'script', 'title', 'desc', 'pre', 'textPath'].includes(node.name)) return true; return c.text.trim() !== ''; }
      if (c.type !== 'element') return true;
      const ln = c.name.includes(':') ? c.name.slice(c.name.indexOf(':') + 1) : c.name;
      const prefix = c.name.includes(':') ? c.name.slice(0, c.name.indexOf(':')) : '';
      if (removeMetadata && (ln === 'metadata' || ln === 'title' && false || ln === 'desc' && false)) return false;
      if (removeEditorData && prefix && EDITOR_NS.test(prefix)) return false;
      if (ln === 'title' && removeMetadata) return false;
      if (ln === 'desc' && removeMetadata) return false;
      return true;
    });
    for (const c of node.children) {
      if (c.type !== 'element') continue;
      for (const k of Object.keys(c.attrs)) {
        const v = c.attrs[k];
        const pfx = k.includes(':') ? k.slice(0, k.indexOf(':')) : '';
        if (removeEditorData && ((pfx && EDITOR_NS.test(pfx) && pfx !== 'xlink') || (k.startsWith('xmlns:') && EDITOR_NS.test(k.slice(6)) && k !== 'xmlns:xlink') || k === 'xml:space' && v === 'preserve' && !['text', 'tspan'].includes(c.name) || k === 'enable-background' || k === 'data-name')) { delete c.attrs[k]; continue; }
        if (removeDefaults && k in DEFAULTS && v.trim() === DEFAULTS[k] && !(k === 'x' && c.name === 'svg') && !(k === 'y' && c.name === 'svg')) { delete c.attrs[k]; continue; }
        if (k === 'id' && removeIds && !usedIds.has(v) && !(keepIdsRe && keepIdsRe.test(v))) { delete c.attrs[k]; continue; }
        if (k === 'version' && c.name === 'svg') { delete c.attrs[k]; continue; }
        if (k === 'style') {
          let st = v.split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const [p, ...r] = s.split(':'); return [p.trim(), r.join(':').trim()]; }).filter(([p, val]) => !(removeDefaults && p in DEFAULTS && val === DEFAULTS[p]));
          if (minifyStyles) { st = st.filter(([p]) => !EDITOR_NS.test(p.split('-')[0] === '' ? '' : p.split('-')[0]) || true); const stAttrs = st.filter(([p]) => /^(fill|stroke|opacity|fill-opacity|stroke-opacity|stroke-width|stroke-linecap|stroke-linejoin|fill-rule|clip-rule|stroke-dasharray|font-size|font-family|font-weight|transform|display|visibility)$/.test(p)); if (stAttrs.length === st.length) { for (const [p, val] of st) if (!(p in c.attrs)) c.attrs[p] = val; delete c.attrs.style; continue; } }
          if (!st.length) { delete c.attrs.style; continue; }
          c.attrs.style = st.map(([p, val]) => p + ':' + val).join(';');
          continue;
        }
        if (roundNumbers && (k === 'd' || k === 'points' || k === 'transform' || k === 'viewBox' || /^(x|y|x1|y1|x2|y2|cx|cy|r|rx|ry|width|height|stroke-width|font-size|opacity|offset|stdDeviation|dx|dy|k\d)$/.test(k))) {
          let nv = roundStr(v);
          if (k === 'd') nv = nv.replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').replace(/\s*([MmLlHhVvCcSsQqTtAaZz])\s*/g, '$1').replace(/ -/g, '-').trim();
          if (k === 'points') nv = nv.replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').trim();
          if (k === 'transform') { nv = nv.replace(/\s+/g, ' ').replace(/\s*([(),])\s*/g, '$1'); if (/^translate\(0(,0)?\)$|^scale\(1(,1)?\)$|^rotate\(0\)$|^matrix\(1,0,0,1,0,0\)$/.test(nv)) { delete c.attrs[k]; continue; } }
          c.attrs[k] = nv; continue;
        }
        if (/^#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i.test(v)) c.attrs[k] = ('#' + v[1] + v[3] + v[5]).toLowerCase();
        else if (/^#[0-9a-f]{6}$/i.test(v)) c.attrs[k] = v.toLowerCase();
      }
      visit(c, node);
    }
    if (removeEmptyGroups) node.children = node.children.filter((c) => !(c.type === 'element' && (c.name === 'g' || c.name === 'defs') && !c.children.length && !Object.keys(c.attrs).some((k) => k === 'id')));
    // collapse <g> with no attributes into parent
    if (removeEmptyGroups) { const nc = []; for (const c of node.children) { if (c.type === 'element' && c.name === 'g' && Object.keys(c.attrs).length === 0) nc.push(...c.children); else nc.push(c); } node.children = nc; }
  };
  visit(doc, null);
  doc.declaration = null; doc.doctype = null;
  let out = serializeXml(doc, { indent: pretty ? '  ' : null, declaration: false }).trim();
  if (!pretty) out = out.replace(/>\s+</g, '><');
  return { svg: out, before, after: out.length };
}
