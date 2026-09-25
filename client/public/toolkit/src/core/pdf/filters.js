import { inflateZlib } from '../bytes.js';

export function applyPredictor(data, params, resolve) {
  const g = (k, d) => { let v = params && params.get(k); if (resolve) v = resolve(v); return typeof v === 'number' ? v : d; };
  const pred = g('Predictor', 1);
  if (pred <= 1) return data;
  const colors = g('Colors', 1), bpc = g('BitsPerComponent', 8), columns = g('Columns', 1);
  const bpp = Math.ceil((colors * bpc) / 8);
  const rowLen = Math.ceil((colors * bpc * columns) / 8);
  if (pred === 2) { // TIFF predictor
    if (bpc === 8) {
      const rows = Math.floor(data.length / rowLen);
      for (let r = 0; r < rows; r++) { const o = r * rowLen; for (let i = bpp; i < rowLen; i++) data[o + i] = (data[o + i] + data[o + i - bpp]) & 0xff; }
    }
    return data;
  }
  // PNG predictors: each row prefixed with filter type byte
  const rows = Math.floor(data.length / (rowLen + 1));
  const out = new Uint8Array(rows * rowLen);
  let prev = new Uint8Array(rowLen);
  for (let r = 0; r < rows; r++) {
    const ft = data[r * (rowLen + 1)];
    const src = data.subarray(r * (rowLen + 1) + 1, (r + 1) * (rowLen + 1));
    const cur = out.subarray(r * rowLen, (r + 1) * rowLen);
    unfilterRow(ft, src, cur, prev, bpp);
    prev = cur;
  }
  return out;
}

export function unfilterRow(ft, src, cur, prev, bpp) {
  const n = cur.length;
  switch (ft) {
    case 0: cur.set(src); break;
    case 1: for (let i = 0; i < n; i++) cur[i] = (src[i] + (i >= bpp ? cur[i - bpp] : 0)) & 0xff; break;
    case 2: for (let i = 0; i < n; i++) cur[i] = (src[i] + prev[i]) & 0xff; break;
    case 3: for (let i = 0; i < n; i++) cur[i] = (src[i] + (((i >= bpp ? cur[i - bpp] : 0) + prev[i]) >> 1)) & 0xff; break;
    case 4: for (let i = 0; i < n; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      cur[i] = (src[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
    } break;
    default: cur.set(src);
  }
}

export function lzwDecode(data, early = 1) {
  const out = [];
  let dict = [], codeLen = 9, prev = null;
  const reset = () => { dict = []; for (let i = 0; i < 256; i++) dict.push([i]); dict.push(null, null); codeLen = 9; prev = null; };
  reset();
  let bitBuf = 0, bitCnt = 0, p = 0;
  while (true) {
    while (bitCnt < codeLen && p < data.length) { bitBuf = (bitBuf << 8) | data[p++]; bitCnt += 8; }
    if (bitCnt < codeLen) break;
    const code = (bitBuf >> (bitCnt - codeLen)) & ((1 << codeLen) - 1);
    bitCnt -= codeLen;
    if (code === 256) { reset(); continue; }
    if (code === 257) break;
    let entry;
    if (code < dict.length && dict[code]) entry = dict[code];
    else if (prev) entry = prev.concat([prev[0]]);
    else break;
    for (const b of entry) out.push(b);
    if (prev) dict.push(prev.concat([entry[0]]));
    prev = entry;
    if (dict.length + early - 1 >= 1 << codeLen && codeLen < 12) codeLen++;
  }
  return Uint8Array.from(out);
}

export function asciiHexDecode(data) {
  const out = [];
  let digit = -1;
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    if (c === 0x3e) break;
    let v;
    if (c >= 0x30 && c <= 0x39) v = c - 48; else if (c >= 0x41 && c <= 0x46) v = c - 55; else if (c >= 0x61 && c <= 0x66) v = c - 87; else continue;
    if (digit < 0) digit = v; else { out.push(digit * 16 + v); digit = -1; }
  }
  if (digit >= 0) out.push(digit * 16);
  return Uint8Array.from(out);
}

export function ascii85Decode(data) {
  const out = [];
  let tuple = [], i = 0;
  if (data[0] === 0x3c && data[1] === 0x7e) i = 2;
  for (; i < data.length; i++) {
    const c = data[i];
    if (c === 0x7e) break;
    if (c === 0x7a && tuple.length === 0) { out.push(0, 0, 0, 0); continue; }
    if (c < 0x21 || c > 0x75) continue;
    tuple.push(c - 33);
    if (tuple.length === 5) {
      let v = 0; for (const t of tuple) v = v * 85 + t;
      out.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
      tuple = [];
    }
  }
  if (tuple.length > 1) {
    const n = tuple.length;
    while (tuple.length < 5) tuple.push(84);
    let v = 0; for (const t of tuple) v = v * 85 + t;
    const bytes = [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
    for (let k = 0; k < n - 1; k++) out.push(bytes[k]);
  }
  return Uint8Array.from(out);
}

export function runLengthDecode(data) {
  const out = [];
  let i = 0;
  while (i < data.length) {
    const l = data[i++];
    if (l === 128) break;
    if (l < 128) { for (let k = 0; k <= l && i < data.length; k++) out.push(data[i++]); }
    else { const b = data[i++]; for (let k = 0; k < 257 - l; k++) out.push(b); }
  }
  return Uint8Array.from(out);
}

export const IMAGE_FILTERS = new Set(['DCTDecode', 'DCT', 'JPXDecode', 'CCITTFaxDecode', 'CCF', 'JBIG2Decode']);

/**
 * Decode a stream's data by applying its /Filter chain. Image-specific filters are left in place;
 * the returned object reports which filter (if any) remains undecoded.
 */
export function decodeStream(stream, resolve) {
  const d = stream.dict;
  let filters = resolve(d.get('Filter'));
  let params = resolve(d.get('DecodeParms') ?? d.get('DP'));
  if (!filters) return { data: stream.raw, remaining: null };
  if (!Array.isArray(filters)) { filters = [filters]; params = [params]; }
  else if (!Array.isArray(params)) params = [params];
  let data = stream.raw;
  for (let i = 0; i < filters.length; i++) {
    const f = resolve(filters[i]);
    const name = f && f.name;
    const pm = resolve(params[i]);
    switch (name) {
      case 'FlateDecode': case 'Fl': data = applyPredictor(inflateZlib(data, { partial: true }), pm, resolve); break;
      case 'LZWDecode': case 'LZW': data = applyPredictor(lzwDecode(data, pm && resolve(pm.get('EarlyChange')) === 0 ? 0 : 1), pm, resolve); break;
      case 'ASCIIHexDecode': case 'AHx': data = asciiHexDecode(data); break;
      case 'ASCII85Decode': case 'A85': data = ascii85Decode(data); break;
      case 'RunLengthDecode': case 'RL': data = runLengthDecode(data); break;
      case 'Crypt': break;
      default:
        if (IMAGE_FILTERS.has(name)) return { data, remaining: name, params: pm };
        throw new Error('Unsupported filter ' + name);
    }
  }
  return { data, remaining: null };
}
