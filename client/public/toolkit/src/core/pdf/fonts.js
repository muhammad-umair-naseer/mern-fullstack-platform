// Standard 14 font metrics (from the Adobe AFM files) so we can draw text without embedding fonts.
import { N, Dict } from './objects.js';

// Widths for character codes 32..126 (WinAnsi), in 1/1000 em.
const HELVETICA = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];
const HELVETICA_BOLD = [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584];
// Widths for WinAnsi 160..255 (Latin-1 supplement) — Helvetica and Helvetica-Bold
const HELV_HI = [278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500];
const HELVB_HI = [278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556];

// WinAnsiEncoding: map Unicode -> byte for the 128..159 range (the rest is Latin-1)
const WINANSI_HIGH = { 0x20ac: 128, 0x201a: 130, 0x0192: 131, 0x201e: 132, 0x2026: 133, 0x2020: 134, 0x2021: 135, 0x02c6: 136, 0x2030: 137, 0x0160: 138, 0x2039: 139, 0x0152: 140, 0x017d: 142, 0x2018: 145, 0x2019: 146, 0x201c: 147, 0x201d: 148, 0x2022: 149, 0x2013: 150, 0x2014: 151, 0x02dc: 152, 0x2122: 153, 0x0161: 154, 0x203a: 155, 0x0153: 156, 0x017e: 158, 0x0178: 159 };
const WINANSI_HIGH_W = { 128: [556, 556], 130: [222, 278], 131: [556, 556], 132: [333, 500], 133: [1000, 1000], 134: [556, 556], 135: [556, 556], 136: [333, 333], 137: [1000, 1000], 138: [667, 667], 139: [333, 333], 140: [1000, 1000], 142: [611, 611], 145: [222, 278], 146: [222, 278], 147: [333, 500], 148: [333, 500], 149: [350, 350], 150: [556, 556], 151: [1000, 1000], 152: [333, 333], 153: [1000, 1000], 154: [500, 556], 155: [333, 333], 156: [944, 944], 158: [500, 500], 159: [667, 667] };

export const FONTS = {
  Helvetica: { base: 'Helvetica', widths: HELVETICA, hi: HELV_HI, bold: 0 },
  'Helvetica-Bold': { base: 'Helvetica-Bold', widths: HELVETICA_BOLD, hi: HELVB_HI, bold: 1 },
  'Helvetica-Oblique': { base: 'Helvetica-Oblique', widths: HELVETICA, hi: HELV_HI, bold: 0 },
  'Helvetica-BoldOblique': { base: 'Helvetica-BoldOblique', widths: HELVETICA_BOLD, hi: HELVB_HI, bold: 1 },
  Courier: { base: 'Courier', mono: 600 },
  'Courier-Bold': { base: 'Courier-Bold', mono: 600 },
  'Courier-Oblique': { base: 'Courier-Oblique', mono: 600 },
  'Courier-BoldOblique': { base: 'Courier-BoldOblique', mono: 600 },
  'Times-Roman': { base: 'Times-Roman', widths: HELVETICA.map((w) => Math.round(w * 0.93)), hi: HELV_HI, bold: 0 },
  'Times-Bold': { base: 'Times-Bold', widths: HELVETICA_BOLD.map((w) => Math.round(w * 0.93)), hi: HELVB_HI, bold: 1 },
};

const REPLACEMENTS = { 0x2010: 45, 0x2011: 45, 0x2012: 45, 0x00a0: 32, 0x2009: 32, 0x200a: 32, 0x2002: 32, 0x2003: 32, 0x3000: 32, 0x2212: 45, 0x00ad: 45 };

/** Encode a JS string to WinAnsi bytes; unsupported characters become '?'. */
export function encodeWinAnsi(text) {
  const out = new Uint8Array(text.length);
  let n = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0);
    let b;
    if (c < 128) b = c;
    else if (c >= 160 && c < 256) b = c;
    else if (WINANSI_HIGH[c] !== undefined) b = WINANSI_HIGH[c];
    else if (REPLACEMENTS[c] !== undefined) b = REPLACEMENTS[c];
    else b = 63;
    if (c < 32 && c !== 9) b = 32;
    out[n++] = b;
  }
  return out.subarray(0, n);
}

export function charWidth(fontName, code) {
  const f = FONTS[fontName] || FONTS.Helvetica;
  if (f.mono) return f.mono;
  if (code >= 32 && code <= 126) return f.widths[code - 32];
  if (code >= 160 && code <= 255) return f.hi[code - 160];
  if (WINANSI_HIGH_W[code]) return WINANSI_HIGH_W[code][f.bold];
  return 500;
}

/** Width of text in points at the given size. */
export function textWidth(text, fontName, size) {
  const bytes = encodeWinAnsi(text);
  let w = 0;
  for (let i = 0; i < bytes.length; i++) w += charWidth(fontName, bytes[i]);
  return (w * size) / 1000;
}

/** Build a font dictionary for a standard 14 font. */
export function standardFontDict(fontName) {
  const f = FONTS[fontName] || FONTS.Helvetica;
  return new Dict({ Type: N('Font'), Subtype: N('Type1'), BaseFont: N(f.base), Encoding: N('WinAnsiEncoding') });
}

/** Escape bytes for a PDF literal string inside a content stream. */
export function pdfStringLiteral(bytes) {
  let s = '(';
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i];
    if (c === 0x28 || c === 0x29 || c === 0x5c) s += '\\' + String.fromCharCode(c);
    else if (c < 32 || c > 126) s += '\\' + c.toString(8).padStart(3, '0');
    else s += String.fromCharCode(c);
  }
  return s + ')';
}

export function pickFont({ bold = false, italic = false, mono = false } = {}) {
  if (mono) return bold && italic ? 'Courier-BoldOblique' : bold ? 'Courier-Bold' : italic ? 'Courier-Oblique' : 'Courier';
  return bold && italic ? 'Helvetica-BoldOblique' : bold ? 'Helvetica-Bold' : italic ? 'Helvetica-Oblique' : 'Helvetica';
}

/** Greedy word-wrap. Returns array of lines. */
export function wrapText(text, fontName, size, maxWidth) {
  const lines = [];
  for (const para of String(text).split(/\r?\n/)) {
    const words = para.split(/(\s+)/);
    let line = '';
    for (const w of words) {
      if (!w) continue;
      const candidate = line + w;
      if (textWidth(candidate, fontName, size) <= maxWidth || !line.trim()) {
        if (!line.trim() && textWidth(w, fontName, size) > maxWidth) {
          // break the long word by characters
          let chunk = '';
          for (const ch of w) {
            if (textWidth(chunk + ch, fontName, size) > maxWidth && chunk) { lines.push(chunk); chunk = ''; }
            chunk += ch;
          }
          line = chunk;
        } else line = candidate;
      } else { lines.push(line.replace(/\s+$/, '')); line = w.trimStart(); }
    }
    lines.push(line.replace(/\s+$/, ''));
  }
  return lines;
}

export function toRoman(n) {
  if (n <= 0 || n >= 4000) return String(n);
  const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = '';
  for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
  return s;
}
