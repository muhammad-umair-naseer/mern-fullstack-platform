// Content stream engine: tokenize operators, track the text matrix, decode fonts, extract/redact text.
import { latin1 } from '../bytes.js';
import { Parser, Name, Dict, PDFStream, PDFString, serialize, partsToBytes, findSeq } from './objects.js';
import { charWidth } from './fonts.js';

// ---------- Tokenizer ----------
/** @returns {Array<{op:string, args:any[], raw?:Uint8Array}>} */
export function tokenizeContent(bytes) {
  const parser = new Parser(bytes, 0, { contentMode: true });
  const ops = [];
  let args = [];
  for (;;) {
    const v = parser.parse();
    if (v === undefined) break;
    if (v && typeof v === 'object' && 'op' in v) {
      if (v.op === 'BI') {
        // inline image: parse key/value pairs until ID, then binary data until EI
        const d = new Dict();
        for (;;) {
          const k = parser.parse();
          if (k === undefined) break;
          if (k && typeof k === 'object' && k.op === 'ID') break;
          const val = parser.parse();
          if (k instanceof Name) d.set(k.name, val);
        }
        let p = parser.pos + 1; // single whitespace after ID
        const start = p;
        let end = -1;
        while (p < bytes.length) {
          const q = findSeq(bytes, 'EI', p);
          if (q < 0) break;
          const before = bytes[q - 1], after = bytes[q + 2];
          if ((before === 0x20 || before === 0x0a || before === 0x0d || before === 0x09) && (after === undefined || after === 0x20 || after === 0x0a || after === 0x0d || after === 0x09 || after === 0x2f || after === 0x5b || after === 0x51 || after === 0x71)) { end = q; break; }
          p = q + 2;
        }
        if (end < 0) end = bytes.length;
        ops.push({ op: 'INLINE_IMAGE', args: [d], raw: bytes.subarray(start, end - 1 > start ? end - 1 : end) });
        parser.pos = end + 2;
        args = [];
        continue;
      }
      ops.push({ op: v.op, args });
      args = [];
    } else args.push(v);
  }
  return ops;
}

export function serializeContent(ops) {
  const parts = [];
  for (const o of ops) {
    if (o.op === 'INLINE_IMAGE') {
      parts.push('BI');
      for (const [k, v] of o.args[0].map) { parts.push(' /' + k + ' '); serialize(v, null, parts); }
      parts.push(' ID '); parts.push(o.raw); parts.push(' EI\n');
      continue;
    }
    for (const a of o.args) { serialize(a, null, parts); parts.push(' '); }
    parts.push(o.op + '\n');
  }
  return partsToBytes(parts);
}

// ---------- Matrices ----------
export const mul = (m, n) => [
  m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];
export const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export const inverse = (m) => {
  const det = m[0] * m[3] - m[1] * m[2] || 1e-9;
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
};

// ---------- Glyph names (subset of the Adobe Glyph List) ----------
const AGL = {};
(() => {
  const ascii = 'space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash zero one two three four five six seven eight nine colon semicolon less equal greater question at'.split(' ');
  ascii.forEach((n, i) => (AGL[n] = 32 + i));
  for (let i = 0; i < 26; i++) { AGL[String.fromCharCode(65 + i)] = 65 + i; AGL[String.fromCharCode(97 + i)] = 97 + i; }
  Object.assign(AGL, { bracketleft: 91, backslash: 92, bracketright: 93, asciicircum: 94, underscore: 95, grave: 96, braceleft: 123, bar: 124, braceright: 125, asciitilde: 126,
    quoteright: 0x2019, quoteleft: 0x2018, quotedblleft: 0x201c, quotedblright: 0x201d, quotesinglbase: 0x201a, quotedblbase: 0x201e, endash: 0x2013, emdash: 0x2014, bullet: 0x2022, ellipsis: 0x2026, dagger: 0x2020, daggerdbl: 0x2021, fi: 0xfb01, fl: 0xfb02, ff: 0xfb00, ffi: 0xfb03, ffl: 0xfb04, germandbls: 0xdf, Euro: 0x20ac, trademark: 0x2122, copyright: 0xa9, registered: 0xae, degree: 0xb0, plusminus: 0xb1, multiply: 0xd7, divide: 0xf7, section: 0xa7, paragraph: 0xb6, periodcentered: 0xb7, guillemotleft: 0xab, guillemotright: 0xbb, guilsinglleft: 0x2039, guilsinglright: 0x203a, exclamdown: 0xa1, questiondown: 0xbf, cent: 0xa2, sterling: 0xa3, yen: 0xa5, currency: 0xa4, brokenbar: 0xa6, florin: 0x192, onehalf: 0xbd, onequarter: 0xbc, threequarters: 0xbe, mu: 0xb5, nbspace: 0xa0, nonbreakingspace: 0xa0, minus: 0x2212, fraction: 0x2044, perthousand: 0x2030, circumflex: 0x2c6, tilde: 0x2dc, caron: 0x2c7, macron: 0xaf, breve: 0x2d8, dotaccent: 0x2d9, ring: 0x2da, ogonek: 0x2db, hungarumlaut: 0x2dd, cedilla: 0xb8, dieresis: 0xa8, acute: 0xb4, dotlessi: 0x131, Lslash: 0x141, lslash: 0x142, OE: 0x152, oe: 0x153, Scaron: 0x160, scaron: 0x161, Zcaron: 0x17d, zcaron: 0x17e, Ydieresis: 0x178, logicalnot: 0xac, ordfeminine: 0xaa, ordmasculine: 0xba, onesuperior: 0xb9, twosuperior: 0xb2, threesuperior: 0xb3, eth: 0xf0, Eth: 0xd0, thorn: 0xfe, Thorn: 0xde, ydieresis: 0xff, AE: 0xc6, ae: 0xe6, Oslash: 0xd8, oslash: 0xf8, Ccedilla: 0xc7, ccedilla: 0xe7, Ntilde: 0xd1, ntilde: 0xf1 });
  const acc = { grave: 0, acute: 1, circumflex: 2, tilde: 3, dieresis: 4, ring: 5 };
  const table = { A: [0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5], E: [0xc8, 0xc9, 0xca, null, 0xcb], I: [0xcc, 0xcd, 0xce, null, 0xcf], O: [0xd2, 0xd3, 0xd4, 0xd5, 0xd6], U: [0xd9, 0xda, 0xdb, null, 0xdc], Y: [null, 0xdd], a: [0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5], e: [0xe8, 0xe9, 0xea, null, 0xeb], i: [0xec, 0xed, 0xee, null, 0xef], o: [0xf2, 0xf3, 0xf4, 0xf5, 0xf6], u: [0xf9, 0xfa, 0xfb, null, 0xfc], y: [null, 0xfd, null, null, 0xff] };
  for (const l of Object.keys(table)) for (const a of Object.keys(acc)) { const c = table[l][acc[a]]; if (c) AGL[l + a] = c; }
})();
export function glyphToUnicode(name) {
  if (AGL[name] !== undefined) return AGL[name];
  let m = /^uni([0-9A-Fa-f]{4})/.exec(name); if (m) return parseInt(m[1], 16);
  m = /^u([0-9A-Fa-f]{4,6})$/.exec(name); if (m) return parseInt(m[1], 16);
  m = /^(?:g|cid|c|G)(\d+)$/.exec(name); if (m) return -1;
  if (name.length === 1) return name.charCodeAt(0);
  return -1;
}

// WinAnsi 128..159 to unicode (the rest of 128..255 is Latin-1)
const WINANSI_HI = [0x20ac, 0x81, 0x201a, 0x192, 0x201e, 0x2026, 0x2020, 0x2021, 0x2c6, 0x2030, 0x160, 0x2039, 0x152, 0x8d, 0x17d, 0x8f, 0x90, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x2dc, 0x2122, 0x161, 0x203a, 0x153, 0x9d, 0x17e, 0x178];
const MACROMAN_HI = [196, 197, 199, 201, 209, 214, 220, 225, 224, 226, 228, 227, 229, 231, 233, 232, 234, 235, 237, 236, 238, 239, 241, 243, 242, 244, 246, 245, 250, 249, 251, 252, 0x2020, 176, 162, 163, 167, 0x2022, 182, 223, 174, 169, 0x2122, 180, 168, 0x2260, 198, 216, 0x221e, 177, 0x2264, 0x2265, 165, 181, 0x2202, 0x2211, 0x220f, 960, 0x222b, 170, 186, 0x2126, 230, 248, 191, 161, 172, 0x221a, 402, 0x2248, 0x2206, 171, 187, 0x2026, 160, 192, 195, 213, 338, 339, 0x2013, 0x2014, 0x201c, 0x201d, 0x2018, 0x2019, 247, 0x25ca, 255, 376, 0x2044, 164, 0x2039, 0x203a, 0xfb01, 0xfb02, 0x2021, 183, 0x201a, 0x201e, 0x2030, 194, 202, 193, 203, 200, 205, 206, 207, 204, 211, 212, 0xf8ff, 210, 218, 219, 217, 305, 0x2c6, 0x2dc, 175, 0x2d8, 0x2d9, 0x2da, 184, 0x2dd, 0x2db, 0x2c7];

// ---------- CMap parsing (ToUnicode + embedded encodings) ----------
function bytesToInt(b) { let v = 0; for (let i = 0; i < b.length; i++) v = v * 256 + b[i]; return v; }
function strToCodes(bytes) { const out = []; for (let i = 0; i + 1 < bytes.length; i += 2) out.push((bytes[i] << 8) | bytes[i + 1]); if (bytes.length === 1) out.push(bytes[0]); return out; }

export function parseCMap(bytes) {
  const cmap = { codespace: [], single: new Map(), ranges: [] }; // single: code -> string|cid ; ranges: [lo, hi, dst(base string or cid), nbytes]
  const ops = tokenizeContent(bytes);
  for (let i = 0; i < ops.length; i++) {
    const o = ops[i];
    if (o.op === 'endcodespacerange') {
      for (let k = 0; k + 1 < o.args.length; k += 2) { const lo = o.args[k], hi = o.args[k + 1]; if (lo instanceof PDFString) cmap.codespace.push({ n: lo.bytes.length, lo: bytesToInt(lo.bytes), hi: bytesToInt(hi.bytes) }); }
    } else if (o.op === 'endbfchar') {
      for (let k = 0; k + 1 < o.args.length; k += 2) { const src = o.args[k], dst = o.args[k + 1]; if (src instanceof PDFString) cmap.single.set(bytesToInt(src.bytes), dst instanceof PDFString ? String.fromCharCode(...strToCodes(dst.bytes)) : dst instanceof Name ? String.fromCodePoint(Math.max(0, glyphToUnicode(dst.name))) : dst); }
    } else if (o.op === 'endbfrange') {
      for (let k = 0; k + 2 < o.args.length; k += 3) {
        const lo = o.args[k], hi = o.args[k + 1], dst = o.args[k + 2];
        if (!(lo instanceof PDFString)) continue;
        const l = bytesToInt(lo.bytes), h = bytesToInt(hi.bytes);
        if (Array.isArray(dst)) dst.forEach((d, j) => { if (d instanceof PDFString) cmap.single.set(l + j, String.fromCharCode(...strToCodes(d.bytes))); });
        else if (dst instanceof PDFString) cmap.ranges.push({ lo: l, hi: h, dst: strToCodes(dst.bytes), n: lo.bytes.length });
      }
    } else if (o.op === 'endcidrange') {
      for (let k = 0; k + 2 < o.args.length; k += 3) { const lo = o.args[k], hi = o.args[k + 1], dst = o.args[k + 2]; if (lo instanceof PDFString && typeof dst === 'number') cmap.ranges.push({ lo: bytesToInt(lo.bytes), hi: bytesToInt(hi.bytes), cid: dst, n: lo.bytes.length }); }
    } else if (o.op === 'endcidchar') {
      for (let k = 0; k + 1 < o.args.length; k += 2) { const src = o.args[k], dst = o.args[k + 1]; if (src instanceof PDFString) cmap.single.set(bytesToInt(src.bytes), dst); }
    }
  }
  return cmap;
}
function cmapLookup(cmap, code) {
  if (cmap.single.has(code)) return cmap.single.get(code);
  for (const r of cmap.ranges) if (code >= r.lo && code <= r.hi) {
    if (r.cid !== undefined) return r.cid + (code - r.lo);
    const d = r.dst.slice(); d[d.length - 1] += code - r.lo; return String.fromCharCode(...d);
  }
  return undefined;
}

// ---------- Font loading ----------
/**
 * Build a decoder for a font dict: splits a string into codes, maps to widths (1/1000 text space) and unicode.
 */
export function loadFont(doc, fontDict) {
  const R = (o) => doc.resolve(o);
  const f = { type0: false, codeLen: 1, widths: new Map(), defaultWidth: 500, toUnicode: null, encodingMap: null, type3Scale: null, encodingCMap: null };
  if (!(fontDict instanceof Dict)) return f;
  const subtype = R(fontDict.get('Subtype'))?.name;
  const tu = R(fontDict.get('ToUnicode'));
  if (tu instanceof PDFStream) { try { f.toUnicode = parseCMap(doc.streamData(tu).data); } catch { } }
  if (subtype === 'Type0') {
    f.type0 = true; f.codeLen = 2;
    const enc = R(fontDict.get('Encoding'));
    if (enc instanceof PDFStream) { try { f.encodingCMap = parseCMap(doc.streamData(enc).data); const cs = f.encodingCMap.codespace; if (cs.length && cs.every((c) => c.n === 1)) f.codeLen = 1; } catch { } }
    const desc = R((R(fontDict.get('DescendantFonts')) || [])[0]);
    if (desc instanceof Dict) {
      f.defaultWidth = R(desc.get('DW')) ?? 1000;
      const W = R(desc.get('W'));
      if (Array.isArray(W)) {
        for (let i = 0; i < W.length;) {
          const a = R(W[i++]);
          const b = R(W[i++]);
          if (Array.isArray(b)) { b.forEach((w, j) => f.widths.set(a + j, R(w))); }
          else { const w = R(W[i++]); if (typeof w === 'number') for (let c = a; c <= b && c - a < 65536; c++) f.widths.set(c, w); }
        }
      }
    }
    return f;
  }
  // simple fonts
  const fc = R(fontDict.get('FirstChar')) ?? 0;
  const widths = R(fontDict.get('Widths'));
  const fd = R(fontDict.get('FontDescriptor'));
  const missing = fd instanceof Dict ? R(fd.get('MissingWidth')) || 0 : 0;
  if (Array.isArray(widths) && widths.length) { widths.forEach((w, i) => { w = R(w); if (typeof w === 'number') f.widths.set(fc + i, w); }); f.defaultWidth = missing; }
  else {
    const base = (R(fontDict.get('BaseFont'))?.name || 'Helvetica').replace(/^[A-Z]{6}\+/, '');
    const std = /Courier|Mono/i.test(base) ? 'Courier' : /Bold/i.test(base) ? 'Helvetica-Bold' : 'Helvetica';
    f.stdFont = std; f.defaultWidth = std === 'Courier' ? 600 : 500;
  }
  if (subtype === 'Type3') {
    const fm = R(fontDict.get('FontMatrix'));
    if (Array.isArray(fm)) f.type3Scale = R(fm[0]) * 1000;
  }
  // encoding
  const enc = R(fontDict.get('Encoding'));
  let baseName = enc instanceof Name ? enc.name : enc instanceof Dict ? R(enc.get('BaseEncoding'))?.name : null;
  const symbolic = fd instanceof Dict && ((R(fd.get('Flags')) || 0) & 4) && !(baseName);
  const map = new Array(256);
  for (let c = 0; c < 256; c++) map[c] = c;
  if (baseName === 'WinAnsiEncoding' || (!baseName && !symbolic)) for (let c = 128; c < 160; c++) map[c] = WINANSI_HI[c - 128];
  else if (baseName === 'MacRomanEncoding') for (let c = 128; c < 256; c++) map[c] = MACROMAN_HI[c - 128];
  if (enc instanceof Dict) {
    const diff = R(enc.get('Differences'));
    if (Array.isArray(diff)) {
      let code = 0;
      for (const item of diff) { const v = R(item); if (typeof v === 'number') code = v; else if (v instanceof Name) { const u = glyphToUnicode(v.name); if (u >= 0) map[code] = u; code++; } }
    }
  }
  f.encodingMap = map;
  return f;
}

/** Decode a PDF string shown with font f into glyph records. */
export function decodeString(f, bytes) {
  const out = [];
  const n = f.codeLen;
  for (let i = 0; i < bytes.length; i += n) {
    let code = bytes[i];
    if (n === 2) code = (bytes[i] << 8) | (bytes[i + 1] || 0);
    let cid = code;
    if (f.encodingCMap) { const c = cmapLookup(f.encodingCMap, code); if (typeof c === 'number') cid = c; }
    let w = f.widths.get(f.type0 ? cid : code);
    if (w === undefined) w = f.stdFont ? charWidth(f.stdFont, code) : f.defaultWidth;
    if (f.type3Scale !== null && f.type3Scale !== undefined) w = w * f.type3Scale;
    let uni;
    if (f.toUnicode) { const u = cmapLookup(f.toUnicode, code); if (typeof u === 'string') uni = u; }
    if (uni === undefined) {
      if (f.encodingMap && !f.type0) { const u = f.encodingMap[code]; uni = u >= 0 ? String.fromCodePoint(u) : ''; }
      else uni = f.type0 ? '' : String.fromCharCode(code);
    }
    out.push({ code, cid, width: w, text: uni, isSpace: n === 1 && code === 32 });
  }
  return out;
}

// ---------- Text walker ----------
/**
 * Walk a page's content, calling visit(glyphInfo) for each glyph with its user-space bounding box.
 * Also returns the op list (mutated in place by redaction).
 */
export function walkText(doc, page, ops, visit) {
  const R = (o) => doc.resolve(o);
  const res = page.resources;
  const fontsDict = res instanceof Dict ? R(res.get('Font')) : null;
  const fontCache = new Map();
  const getFont = (name) => {
    if (fontCache.has(name)) return fontCache.get(name);
    let fd = fontsDict instanceof Dict ? R(fontsDict.get(name)) : null;
    const f = loadFont(doc, fd);
    fontCache.set(name, f);
    return f;
  };
  let ctm = [1, 0, 0, 1, 0, 0];
  const stack = [];
  let tm = [1, 0, 0, 1, 0, 0], tlm = tm;
  let font = null, fontName = null, fs = 0, tc = 0, tw = 0, th = 1, tl = 0, ts = 0, tr = 0;
  const num = (v) => (typeof v === 'number' ? v : 0);
  const showText = (opIndex, arr) => {
    for (let k = 0; k < arr.length; k++) {
      const el = arr[k];
      if (typeof el === 'number') { const tx = ((-el / 1000) * fs) * th; tm = mul([1, 0, 0, 1, tx, 0], tm); continue; }
      if (!(el instanceof PDFString)) continue;
      const f = font || getFont('__none__');
      const glyphs = decodeString(f, el.bytes);
      let cursor = 0;
      for (const g of glyphs) {
        const w0 = g.width / 1000;
        const adv = (w0 * fs + tc + (g.isSpace ? tw : 0)) * th;
        const trm = mul(mul([fs * th, 0, 0, fs, 0, ts], tm), ctm);
        const p0 = apply(trm, 0, -0.22), p1 = apply(trm, w0, 0.8), p2 = apply(trm, 0, 0.8), p3 = apply(trm, w0, -0.22);
        const xs = [p0[0], p1[0], p2[0], p3[0]], ys = [p0[1], p1[1], p2[1], p3[1]];
        visit({ text: g.text, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], origin: apply(trm, 0, 0), fontSize: Math.hypot(trm[2], trm[3]), opIndex, arrIndex: k, glyphIndex: cursor, glyph: g, font: f, isSpace: g.isSpace });
        cursor += f.codeLen;
        tm = mul([1, 0, 0, 1, adv, 0], tm);
      }
    }
  };
  for (let i = 0; i < ops.length; i++) {
    const o = ops[i], a = o.args;
    switch (o.op) {
      case 'q': stack.push(ctm); break;
      case 'Q': if (stack.length) ctm = stack.pop(); break;
      case 'cm': if (a.length >= 6) ctm = mul(a.slice(0, 6).map(num), ctm); break;
      case 'BT': tm = tlm = [1, 0, 0, 1, 0, 0]; break;
      case 'Tf': fontName = a[0] instanceof Name ? a[0].name : null; fs = num(a[1]); font = fontName ? getFont(fontName) : null; break;
      case 'Td': tlm = mul([1, 0, 0, 1, num(a[0]), num(a[1])], tlm); tm = tlm; break;
      case 'TD': tl = -num(a[1]); tlm = mul([1, 0, 0, 1, num(a[0]), num(a[1])], tlm); tm = tlm; break;
      case 'Tm': if (a.length >= 6) { tlm = a.slice(0, 6).map(num); tm = tlm; } break;
      case 'T*': tlm = mul([1, 0, 0, 1, 0, -tl], tlm); tm = tlm; break;
      case 'TL': tl = num(a[0]); break;
      case 'Tc': tc = num(a[0]); break;
      case 'Tw': tw = num(a[0]); break;
      case 'Tz': th = num(a[0]) / 100; break;
      case 'Ts': ts = num(a[0]); break;
      case 'Tr': tr = num(a[0]); break;
      case 'Tj': showText(i, [a[0]]); break;
      case "'": tlm = mul([1, 0, 0, 1, 0, -tl], tlm); tm = tlm; showText(i, [a[0]]); break;
      case '"': tw = num(a[0]); tc = num(a[1]); tlm = mul([1, 0, 0, 1, 0, -tl], tlm); tm = tlm; showText(i, [a[2]]); break;
      case 'TJ': if (Array.isArray(a[0])) showText(i, a[0]); break;
      case 'Do': {
        // Form XObjects: walk recursively with their own resources & Matrix
        const xd = res instanceof Dict ? R(R(res.get('XObject'))?.get?.(a[0]?.name)) : null;
        if (xd instanceof PDFStream && R(xd.dict.get('Subtype'))?.name === 'Image') {
          const pts = [apply(ctm, 0, 0), apply(ctm, 1, 0), apply(ctm, 0, 1), apply(ctm, 1, 1)];
          const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
          visit({ image: true, text: '', box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], opIndex: i, isSpace: false });
        }
        if (xd instanceof PDFStream && R(xd.dict.get('Subtype'))?.name === 'Form' && (o._depth || 0) < 6) {
          try {
            const inner = tokenizeContent(doc.streamData(xd).data);
            const m = R(xd.dict.get('Matrix'));
            const saved = ctm;
            if (Array.isArray(m) && m.length === 6) ctm = mul(m.map(num), ctm);
            const sub = { resources: R(xd.dict.get('Resources')) || res };
            inner.forEach((io) => (io._depth = (o._depth || 0) + 1));
            walkTextWithState(doc, sub, inner, visit, ctm);
            ctm = saved;
          } catch { }
        }
        break;
      }
    }
  }
  return ops;
}
function walkTextWithState(doc, page, ops, visit, ctm) {
  // Walk a form with an initial CTM by prepending a synthetic cm op.
  walkText(doc, page, [{ op: 'cm', args: ctm }, ...ops], visit);
}

// ---------- Text extraction ----------
export function extractPageText(doc, page) {
  const glyphs = [];
  let ops;
  try { ops = tokenizeContent(doc.pageContent(page)); } catch { return ''; }
  walkText(doc, page, ops, (g) => glyphs.push(g));
  return glyphsToText(glyphs);
}
export function glyphsToText(glyphs) {
  if (!glyphs.length) return '';
  const lines = [];
  let cur = null;
  for (const g of glyphs) {
    if (g.image || (!g.text && !g.isSpace)) continue;
    const y = g.origin[1], x = g.box[0], size = g.fontSize || 10;
    if (!cur || Math.abs(y - cur.y) > size * 0.5) {
      cur = { y, items: [], lastX: null, size };
      lines.push(cur);
    }
    if (cur.lastX !== null && x - cur.lastX > size * 0.15 && !/\s$/.test(cur.items.join(''))) cur.items.push(' ');
    cur.items.push(g.text || ' ');
    cur.lastX = g.box[2];
  }
  // sort lines top-to-bottom, keep reading order for same y
  const ordered = lines.map((l, i) => ({ ...l, i })).sort((a, b) => (Math.abs(b.y - a.y) > 1 ? b.y - a.y : a.i - b.i));
  return ordered.map((l) => l.items.join('').replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

// ---------- Redaction ----------
/**
 * Remove text whose glyph boxes intersect any of the user-space rectangles [x0,y0,x1,y1].
 * Returns {ops, removedCount}. Removed glyphs are replaced by equivalent positioning so layout is preserved.
 */
export function redactOps(doc, page, ops, rects) {
  const hits = [];
  walkText(doc, page, ops, (g) => {
    if (g.image) return;
    for (const r of rects) if (g.box[2] > r[0] && g.box[0] < r[2] && g.box[3] > r[1] && g.box[1] < r[3]) { hits.push(g); break; }
  });
  let removed = 0;
  // group hits by op
  const byOp = new Map();
  for (const h of hits) { if (!byOp.has(h.opIndex)) byOp.set(h.opIndex, []); byOp.get(h.opIndex).push(h); }
  // process highest op index first so splices never shift indices we still need
  for (const opIndex of [...byOp.keys()].sort((a, b) => b - a)) {
    const list = byOp.get(opIndex);
    const o = ops[opIndex];
    if (!o || o._depth) continue; // form xobject content is not rewritten here
    const f = list[0].font;
    // Convert op into TJ form: array of strings/adjustments
    let arr;
    if (o.op === 'TJ') arr = o.args[0].slice();
    else if (o.op === 'Tj') arr = [o.args[0]];
    else if (o.op === "'") arr = [o.args[0]];
    else if (o.op === '"') arr = [o.args[2]];
    else continue;
    const newArr = [];
    for (let k = 0; k < arr.length; k++) {
      const el = arr[k];
      if (!(el instanceof PDFString)) { newArr.push(el); continue; }
      const kill = new Set(list.filter((h) => h.arrIndex === k).map((h) => h.glyphIndex));
      if (!kill.size) { newArr.push(el); continue; }
      const glyphs = decodeString(f, el.bytes);
      let keep = [];
      let cursor = 0;
      const flush = () => { if (keep.length) { newArr.push(new PDFString(Uint8Array.from(keep), el.hex)); keep = []; } };
      for (const g of glyphs) {
        if (kill.has(cursor)) { flush(); newArr.push(-g.width); removed++; }
        else for (let j = 0; j < f.codeLen; j++) keep.push(el.bytes[cursor + j]);
        cursor += f.codeLen;
      }
      flush();
    }
    // Char/word spacing of removed glyphs is not reproduced by TJ adjustments — accept minor drift.
    if (o.op === 'Tj' || o.op === 'TJ') { o.op = 'TJ'; o.args = [newArr]; }
    else if (o.op === "'") { ops[opIndex] = { op: 'T*', args: [] }; ops.splice(opIndex + 1, 0, { op: 'TJ', args: [newArr] }); }
    else if (o.op === '"') { ops[opIndex] = { op: 'Tw', args: [o.args[0]] }; ops.splice(opIndex + 1, 0, { op: 'Tc', args: [o.args[1]] }, { op: 'T*', args: [] }, { op: 'TJ', args: [newArr] }); }
  }
  return { ops, removed };
}
