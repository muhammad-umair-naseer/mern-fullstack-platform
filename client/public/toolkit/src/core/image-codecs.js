// Minimal image codecs written from the specs: PNG (decode + encode), JPEG (header parse), ICO (write).
import { inflateZlib, deflateZlib, crc32, be32, be16, ByteWriter, concat } from './bytes.js';
import { unfilterRow } from './pdf/filters.js';

// ---------- PNG ----------
export function isPng(b) { return b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47; }

/** Iterate PNG chunks: {type, data, offset, length} */
export function* pngChunks(b) {
  let p = 8;
  while (p + 8 <= b.length) {
    const len = be32(b, p);
    const type = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7]);
    yield { type, data: b.subarray(p + 8, p + 8 + len), offset: p, length: len };
    p += 12 + len;
    if (type === 'IEND') break;
  }
}

/**
 * Decode a PNG into RGBA. Supports bit depths 1-16, color types 0/2/3/4/6, non-interlaced.
 * @returns {{width:number,height:number,data:Uint8ClampedArray}}
 */
export function decodePng(b) {
  if (!isPng(b)) throw new Error('Not a PNG file');
  let width = 0, height = 0, depth = 8, ctype = 0, interlace = 0, palette = null, trns = null;
  const idat = [];
  for (const c of pngChunks(b)) {
    if (c.type === 'IHDR') { width = be32(c.data, 0); height = be32(c.data, 4); depth = c.data[8]; ctype = c.data[9]; interlace = c.data[12]; }
    else if (c.type === 'PLTE') palette = c.data;
    else if (c.type === 'tRNS') trns = c.data;
    else if (c.type === 'IDAT') idat.push(c.data);
  }
  if (interlace) throw new Error('Interlaced PNG not supported by the built-in decoder');
  const raw = inflateZlib(concat(idat));
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  const bpp = Math.max(1, (channels * depth) >> 3);
  const rowLen = Math.ceil((width * channels * depth) / 8);
  const out = new Uint8ClampedArray(width * height * 4);
  let prev = new Uint8Array(rowLen);
  const cur = new Uint8Array(rowLen);
  const maxv = (1 << depth) - 1;
  for (let y = 0; y < height; y++) {
    const off = y * (rowLen + 1);
    if (off + 1 + rowLen > raw.length) break;
    unfilterRow(raw[off], raw.subarray(off + 1, off + 1 + rowLen), cur, prev, bpp);
    // sample reader
    const sample = (i) => { // i-th sample in row
      if (depth === 8) return cur[i];
      if (depth === 16) return cur[i * 2];
      const bitPos = i * depth, byte = cur[bitPos >> 3], shift = 8 - depth - (bitPos & 7);
      const v = (byte >> shift) & maxv;
      return ctype === 3 ? v : Math.round((v * 255) / maxv);
    };
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      switch (ctype) {
        case 0: { const g = sample(x); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = trns && depth <= 8 && g === ((be16(trns, 0) * 255) / maxv | 0) ? 0 : 255; break; }
        case 2: { out[o] = sample(x * 3); out[o + 1] = sample(x * 3 + 1); out[o + 2] = sample(x * 3 + 2); out[o + 3] = 255; if (trns && depth === 8 && out[o] === trns[1] && out[o + 1] === trns[3] && out[o + 2] === trns[5]) out[o + 3] = 0; break; }
        case 3: { const i = sample(x); out[o] = palette[i * 3]; out[o + 1] = palette[i * 3 + 1]; out[o + 2] = palette[i * 3 + 2]; out[o + 3] = trns && i < trns.length ? trns[i] : 255; break; }
        case 4: { const g = sample(x * 2); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = sample(x * 2 + 1); break; }
        case 6: { out[o] = sample(x * 4); out[o + 1] = sample(x * 4 + 1); out[o + 2] = sample(x * 4 + 2); out[o + 3] = sample(x * 4 + 3); break; }
      }
    }
    prev.set(cur);
  }
  return { width, height, data: out };
}

function pngChunk(type, data) {
  const w = new ByteWriter(data.length + 12);
  w.u32be(data.length).str(type).bytes(data);
  const crcBytes = w.buf.subarray(4, 8 + data.length);
  w.u32be(crc32(crcBytes));
  return w.result();
}

/** Encode RGBA pixels to PNG (8-bit RGBA, filter 0 / Sub heuristic-free for simplicity, zlib via CompressionStream). */
export async function encodePng(width, height, rgba) {
  const rowLen = width * 4;
  const raw = new Uint8Array((rowLen + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowLen + 1)] = 1; // Sub filter compresses photos noticeably better than None
    const src = rgba.subarray(y * rowLen, (y + 1) * rowLen);
    const dst = raw.subarray(y * (rowLen + 1) + 1, (y + 1) * (rowLen + 1));
    for (let i = 0; i < rowLen; i++) dst[i] = (src[i] - (i >= 4 ? src[i - 4] : 0)) & 0xff;
  }
  const z = await deflateZlib(raw);
  const ihdr = new ByteWriter(13);
  ihdr.u32be(width).u32be(height).u8(8).u8(6).u8(0).u8(0).u8(0);
  return concat([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngChunk('IHDR', ihdr.result()), pngChunk('IDAT', z), pngChunk('IEND', new Uint8Array(0))]);
}

/** Remove metadata chunks from a PNG losslessly. Returns {bytes, removed:[names]} */
export function stripPngMetadata(b) {
  const keep = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS', 'gAMA', 'cHRM', 'sRGB', 'sBIT', 'bKGD', 'pHYs', 'acTL', 'fcTL', 'fdAT']);
  const parts = [b.subarray(0, 8)];
  const removed = [];
  for (const c of pngChunks(b)) {
    if (keep.has(c.type)) parts.push(b.subarray(c.offset, c.offset + 12 + c.length));
    else removed.push(c.type);
  }
  return { bytes: concat(parts), removed };
}

// ---------- JPEG ----------
export function isJpeg(b) { return b.length > 3 && b[0] === 0xff && b[1] === 0xd8; }

/** Parse JPEG dimensions, component count and Adobe transform flag, and list segments. */
export function jpegInfo(b) {
  let p = 2;
  const info = { width: 0, height: 0, components: 3, adobeInverted: false, progressive: false, segments: [] };
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) { p++; continue; }
    const marker = b[p + 1];
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01 || marker === 0xff) { p += 2; continue; }
    if (marker === 0xd9) break;
    const len = be16(b, p + 2);
    info.segments.push({ marker, offset: p, length: len + 2 });
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2 || marker === 0xc3 || (marker >= 0xc5 && marker <= 0xcf && marker !== 0xc8 && marker !== 0xcc)) {
      info.height = be16(b, p + 5); info.width = be16(b, p + 7); info.components = b[p + 9];
      info.progressive = marker === 0xc2 || marker === 0xc6 || marker === 0xca || marker === 0xce;
    }
    if (marker === 0xee && b[p + 4] === 0x41 && b[p + 5] === 0x64 && b[p + 6] === 0x6f) { // "Adobe"
      info.adobeInverted = true;
      info.adobeTransform = b[p + 4 + 11];
    }
    if (marker === 0xda) break; // SOS: image data follows
    p += 2 + len;
  }
  return info;
}

/**
 * Losslessly remove metadata segments (EXIF/XMP/IPTC/comments) from a JPEG.
 * Keeps APP0 (JFIF), APP2 ICC profiles (needed for color accuracy) and APP14 (Adobe) by default.
 */
export function stripJpegMetadata(b, { keepIcc = true } = {}) {
  const parts = [b.subarray(0, 2)];
  const removed = [];
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) { p++; continue; }
    const marker = b[p + 1];
    if (marker === 0xd9 || marker === 0xda) { parts.push(b.subarray(p)); break; }
    if (marker >= 0xd0 && marker <= 0xd8 || marker === 0x01) { parts.push(b.subarray(p, p + 2)); p += 2; continue; }
    const len = be16(b, p + 2) + 2;
    const seg = b.subarray(p, p + len);
    let drop = false;
    if (marker === 0xe1) drop = true; // APP1: EXIF / XMP
    else if (marker === 0xe2 && !(keepIcc && String.fromCharCode(...seg.subarray(4, 11)) === 'ICC_PRO')) drop = true;
    else if (marker >= 0xe3 && marker <= 0xed) drop = true; // APP3..APP13 (IPTC in APP13)
    else if (marker === 0xfe) drop = true; // COM
    if (drop) removed.push(marker === 0xfe ? 'COM' : 'APP' + (marker - 0xe0));
    else parts.push(seg);
    p += len;
  }
  return { bytes: concat(parts), removed };
}

// ---------- ICO ----------
/** Build a favicon.ico from PNG-encoded images [{size, png}]. ICO allows PNG payloads (Vista+). */
export function encodeIco(entries) {
  const w = new ByteWriter();
  w.u16le(0).u16le(1).u16le(entries.length);
  let offset = 6 + entries.length * 16;
  for (const e of entries) {
    w.u8(e.size >= 256 ? 0 : e.size).u8(e.size >= 256 ? 0 : e.size).u8(0).u8(0).u16le(1).u16le(32).u32le(e.png.length).u32le(offset);
    offset += e.png.length;
  }
  for (const e of entries) w.bytes(e.png);
  return w.result();
}

// ---------- Pixel helpers ----------
export function rgbaToRgb(rgba, n) {
  const rgb = new Uint8Array(n * 3);
  for (let i = 0, o = 0; i < n; i++, o += 3) { rgb[o] = rgba[i * 4]; rgb[o + 1] = rgba[i * 4 + 1]; rgb[o + 2] = rgba[i * 4 + 2]; }
  return rgb;
}
export function rgbaAlpha(rgba, n) {
  const a = new Uint8Array(n);
  let opaque = true;
  for (let i = 0; i < n; i++) { a[i] = rgba[i * 4 + 3]; if (a[i] !== 255) opaque = false; }
  return { alpha: a, opaque };
}
export function rgbaToGray(rgba, n) {
  const g = new Uint8Array(n);
  for (let i = 0; i < n; i++) g[i] = (rgba[i * 4] * 299 + rgba[i * 4 + 1] * 587 + rgba[i * 4 + 2] * 114) / 1000;
  return g;
}
