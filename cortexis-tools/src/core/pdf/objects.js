// PDF object model and syntax parser. Written from the PDF 1.7 spec (ISO 32000-1 §7).
import { latin1 } from '../bytes.js';

const NAME_CACHE = new Map();
export class Name {
  constructor(name) { this.name = name; }
  static of(name) { let n = NAME_CACHE.get(name); if (!n) { n = new Name(name); NAME_CACHE.set(name, n); } return n; }
  toString() { return '/' + this.name; }
}
export const N = Name.of;

export class Ref {
  constructor(num, gen = 0) { this.num = num; this.gen = gen; }
  toString() { return `${this.num} ${this.gen} R`; }
  get key() { return this.num; }
}

export class PDFString {
  constructor(bytes, hex = false) { this.bytes = bytes; this.hex = hex; }
  static fromText(s) {
    // Encode as PDFDocEncoding when possible (Latin-1), else UTF-16BE with BOM.
    let latin = true;
    for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 255) { latin = false; break; }
    if (latin) return new PDFString(latin1.encode(s));
    const b = new Uint8Array(2 + s.length * 2);
    b[0] = 0xfe; b[1] = 0xff;
    for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); b[2 + i * 2] = c >> 8; b[3 + i * 2] = c & 0xff; }
    return new PDFString(b);
  }
  toText() {
    const b = this.bytes;
    if (b.length >= 2 && b[0] === 0xfe && b[1] === 0xff) {
      let s = '';
      for (let i = 2; i + 1 < b.length; i += 2) s += String.fromCharCode((b[i] << 8) | b[i + 1]);
      return s;
    }
    if (b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) return new TextDecoder().decode(b.subarray(3));
    return latin1.decode(b);
  }
}

export class Dict {
  constructor(entries) { this.map = new Map(); if (entries) for (const k of Object.keys(entries)) this.set(k, entries[k]); }
  get(key) { return this.map.get(key); }
  has(key) { return this.map.has(key); }
  set(key, value) { if (value === undefined) this.map.delete(key); else this.map.set(key, value); return this; }
  delete(key) { this.map.delete(key); }
  keys() { return [...this.map.keys()]; }
  clone() { const d = new Dict(); for (const [k, v] of this.map) d.map.set(k, v); return d; }
}

export class PDFStream {
  /** @param {Dict} dict @param {Uint8Array} raw encoded bytes exactly as stored in the file */
  constructor(dict, raw) { this.dict = dict; this.raw = raw; this._decoded = undefined; }
}

export const isName = (o, n) => o instanceof Name && (n === undefined || o.name === n);
export const isNum = (o) => typeof o === 'number';
export const isDict = (o) => o instanceof Dict;
export const isStream = (o) => o instanceof PDFStream;
export const isRef = (o) => o instanceof Ref;

// ---------- Lexer ----------
const WS = new Uint8Array(256); for (const c of [0, 9, 10, 12, 13, 32]) WS[c] = 1;
const DELIM = new Uint8Array(256); for (const c of '()<>[]{}/%') DELIM[c.charCodeAt(0)] = 1;
const REGULAR = new Uint8Array(256); for (let i = 0; i < 256; i++) REGULAR[i] = !WS[i] && !DELIM[i] ? 1 : 0;

export const TOK = { NUM: 1, NAME: 2, STR: 3, DELIM: 4, KEYWORD: 5, EOF: 6 };

export class Lexer {
  constructor(bytes, pos = 0) { this.b = bytes; this.pos = pos; }
  skipWs() {
    const b = this.b;
    for (;;) {
      while (this.pos < b.length && WS[b[this.pos]]) this.pos++;
      if (this.pos < b.length && b[this.pos] === 0x25) { // % comment
        while (this.pos < b.length && b[this.pos] !== 0x0a && b[this.pos] !== 0x0d) this.pos++;
      } else return;
    }
  }
  /** @returns {{t:number, v:any, pos:number}} */
  next() {
    this.skipWs();
    const b = this.b, start = this.pos;
    if (this.pos >= b.length) return { t: TOK.EOF, v: null, pos: start };
    const c = b[this.pos];
    // number
    if ((c >= 0x30 && c <= 0x39) || c === 0x2b || c === 0x2d || c === 0x2e) {
      let p = this.pos;
      while (p < b.length && REGULAR[b[p]]) p++;
      const s = latin1.decode(b.subarray(this.pos, p));
      this.pos = p;
      const m = /^[+-]*(\d+\.?\d*|\.\d+)/.exec(s);
      if (m) {
        let v = parseFloat(m[1]);
        if ((s.match(/-/g) || []).length % 2 === 1) v = -v;
        if (isNaN(v)) v = 0;
        return { t: TOK.NUM, v, pos: start };
      }
      return { t: TOK.KEYWORD, v: s, pos: start };
    }
    if (c === 0x2f) { // /Name
      let p = this.pos + 1;
      while (p < b.length && REGULAR[b[p]]) p++;
      let s = latin1.decode(b.subarray(this.pos + 1, p));
      this.pos = p;
      if (s.includes('#')) s = s.replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      return { t: TOK.NAME, v: s, pos: start };
    }
    if (c === 0x28) return { t: TOK.STR, v: this.literalString(), pos: start };
    if (c === 0x3c) {
      if (b[this.pos + 1] === 0x3c) { this.pos += 2; return { t: TOK.DELIM, v: '<<', pos: start }; }
      return { t: TOK.STR, v: this.hexString(), pos: start };
    }
    if (c === 0x3e) {
      if (b[this.pos + 1] === 0x3e) { this.pos += 2; return { t: TOK.DELIM, v: '>>', pos: start }; }
      this.pos++; return { t: TOK.DELIM, v: '>', pos: start }; // stray
    }
    if (c === 0x5b || c === 0x5d || c === 0x7b || c === 0x7d) { this.pos++; return { t: TOK.DELIM, v: String.fromCharCode(c), pos: start }; }
    if (c === 0x29) { this.pos++; return this.next(); } // stray ')'
    let p = this.pos;
    while (p < b.length && REGULAR[b[p]]) p++;
    if (p === this.pos) p++;
    const kw = latin1.decode(b.subarray(this.pos, p));
    this.pos = p;
    return { t: TOK.KEYWORD, v: kw, pos: start };
  }
  literalString() {
    const b = this.b;
    let depth = 0, p = this.pos;
    const out = [];
    p++; depth = 1;
    while (p < b.length) {
      let c = b[p++];
      if (c === 0x5c) { // backslash
        c = b[p++];
        switch (c) {
          case 0x6e: out.push(10); break; // n
          case 0x72: out.push(13); break; // r
          case 0x74: out.push(9); break; // t
          case 0x62: out.push(8); break; // b
          case 0x66: out.push(12); break; // f
          case 0x0d: if (b[p] === 0x0a) p++; break; // line continuation
          case 0x0a: break;
          default:
            if (c >= 0x30 && c <= 0x37) {
              let v = c - 0x30;
              for (let k = 0; k < 2 && b[p] >= 0x30 && b[p] <= 0x37; k++) v = v * 8 + (b[p++] - 0x30);
              out.push(v & 0xff);
            } else out.push(c);
        }
      } else if (c === 0x28) { depth++; out.push(c); }
      else if (c === 0x29) { depth--; if (depth === 0) break; out.push(c); }
      else out.push(c);
    }
    this.pos = p;
    return new PDFString(Uint8Array.from(out), false);
  }
  hexString() {
    const b = this.b;
    let p = this.pos + 1;
    const out = [];
    let digit = -1;
    while (p < b.length && b[p] !== 0x3e) {
      const c = b[p++];
      let v;
      if (c >= 0x30 && c <= 0x39) v = c - 0x30;
      else if (c >= 0x41 && c <= 0x46) v = c - 0x37;
      else if (c >= 0x61 && c <= 0x66) v = c - 0x57;
      else continue;
      if (digit < 0) digit = v; else { out.push(digit * 16 + v); digit = -1; }
    }
    if (digit >= 0) out.push(digit * 16);
    this.pos = p + 1;
    return new PDFString(Uint8Array.from(out), true);
  }
}

// ---------- Object parser ----------
export class Parser {
  /**
   * @param {Uint8Array} bytes
   * @param {number} pos
   * @param {{ resolveLength?: (obj:any)=>number, allowStreams?: boolean, contentMode?: boolean }} opts
   */
  constructor(bytes, pos = 0, opts = {}) {
    this.lex = new Lexer(bytes, pos);
    this.b = bytes;
    this.opts = opts;
    this.buf = [];
  }
  get pos() { return this.buf.length ? this.buf[0].pos : this.lex.pos; }
  set pos(p) { this.buf = []; this.lex.pos = p; }
  peek(i = 0) { while (this.buf.length <= i) this.buf.push(this.lex.next()); return this.buf[i]; }
  take() { return this.buf.length ? this.buf.shift() : this.lex.next(); }

  /** Parse one object. In content mode, keywords are returned as {op:string}. */
  parse() {
    const tok = this.take();
    switch (tok.t) {
      case TOK.EOF: return undefined;
      case TOK.NUM: {
        if (!this.opts.contentMode && Number.isInteger(tok.v) && tok.v >= 0) {
          const t1 = this.peek(0), t2 = this.peek(1);
          if (t1.t === TOK.NUM && Number.isInteger(t1.v) && t2.t === TOK.KEYWORD && t2.v === 'R') {
            this.take(); this.take();
            return new Ref(tok.v, t1.v);
          }
        }
        return tok.v;
      }
      case TOK.NAME: return Name.of(tok.v);
      case TOK.STR: return tok.v;
      case TOK.DELIM:
        if (tok.v === '[') {
          const arr = [];
          for (;;) {
            const p = this.peek(0);
            if (p.t === TOK.EOF) break;
            if (p.t === TOK.DELIM && p.v === ']') { this.take(); break; }
            if (p.t === TOK.DELIM && (p.v === '>>' || p.v === '}')) { this.take(); continue; }
            if (p.t === TOK.KEYWORD && (p.v === 'endobj' || p.v === 'endstream')) break;
            const v = this.parse();
            if (v !== undefined) arr.push(v);
          }
          return arr;
        }
        if (tok.v === '<<') {
          const d = new Dict();
          for (;;) {
            const p = this.peek(0);
            if (p.t === TOK.EOF) break;
            if (p.t === TOK.DELIM && p.v === '>>') { this.take(); break; }
            if (p.t === TOK.KEYWORD && (p.v === 'endobj' || p.v === 'stream' || p.v === 'endstream')) break;
            if (p.t !== TOK.NAME) { this.take(); if (p.t === TOK.DELIM && (p.v === '[' || p.v === '<<')) { this.buf.unshift(p); this.parse(); } continue; }
            this.take();
            const p2 = this.peek(0);
            if (p2.t === TOK.DELIM && p2.v === '>>') { this.take(); break; }
            const v = this.parse();
            if (v !== undefined) d.set(p.v, v);
          }
          if (this.opts.allowStreams !== false && !this.opts.contentMode) {
            const p = this.peek(0);
            if (p.t === TOK.KEYWORD && p.v === 'stream') { this.take(); return this.readStream(d, p.pos + 6); }
          }
          return d;
        }
        if (tok.v === '{') { const arr = []; for (;;) { const p = this.peek(0); if (p.t === TOK.EOF) break; if (p.t === TOK.DELIM && p.v === '}') { this.take(); break; } arr.push(this.parse()); } return arr; }
        return { op: tok.v }; // stray delimiters
      case TOK.KEYWORD:
        if (tok.v === 'true') return true;
        if (tok.v === 'false') return false;
        if (tok.v === 'null') return null;
        return { op: tok.v, pos: tok.pos };
    }
  }

  readStream(dict, afterKeyword) {
    const b = this.b;
    let p = afterKeyword;
    if (b[p] === 0x0d) p++;
    if (b[p] === 0x0a) p++;
    const start = p;
    let len = dict.get('Length');
    if (len instanceof Ref && this.opts.resolveLength) { try { len = this.opts.resolveLength(len); } catch { len = undefined; } }
    let end = -1;
    if (typeof len === 'number' && len >= 0 && start + len <= b.length) {
      // validate: "endstream" must follow (after optional whitespace)
      let q = start + len;
      let k = 0;
      while (k < 4 && q < b.length && (b[q] === 0x0d || b[q] === 0x0a || b[q] === 0x20 || b[q] === 0x09)) { q++; k++; }
      if (matchAt(b, q, 'endstream')) end = start + len;
    }
    if (end < 0) {
      // search for "endstream"
      let q = findSeq(b, 'endstream', start);
      if (q < 0) q = b.length;
      end = q;
      if (b[end - 1] === 0x0a) end--;
      if (b[end - 1] === 0x0d) end--;
    }
    const raw = b.subarray(start, end);
    // skip past endstream
    let q = findSeq(b, 'endstream', end);
    this.pos = q < 0 ? b.length : q + 9;
    return new PDFStream(dict, raw);
  }
}

export function matchAt(b, pos, s) {
  if (pos + s.length > b.length) return false;
  for (let i = 0; i < s.length; i++) if (b[pos + i] !== s.charCodeAt(i)) return false;
  return true;
}
export function findSeq(b, s, from = 0, to = b.length) {
  const c0 = s.charCodeAt(0);
  const end = Math.min(to, b.length) - s.length;
  for (let i = from; i <= end; i++) {
    if (b[i] !== c0) continue;
    let ok = true;
    for (let k = 1; k < s.length; k++) if (b[i + k] !== s.charCodeAt(k)) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}
export function findSeqBackward(b, s, from = b.length) {
  const c0 = s.charCodeAt(0);
  for (let i = Math.min(from, b.length - s.length); i >= 0; i--) {
    if (b[i] !== c0) continue;
    let ok = true;
    for (let k = 1; k < s.length; k++) if (b[i + k] !== s.charCodeAt(k)) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}

// ---------- Serializer ----------
function fmtNum(v) {
  if (Number.isInteger(v)) return String(v);
  let s = v.toFixed(4);
  s = s.replace(/\.?0+$/, '');
  if (s === '-0') s = '0';
  return s;
}
function escName(n) {
  let s = '';
  for (let i = 0; i < n.length; i++) {
    const c = n.charCodeAt(i);
    if (c < 0x21 || c > 0x7e || DELIM[c] || c === 0x23) s += '#' + c.toString(16).padStart(2, '0');
    else s += n[i];
  }
  return s;
}
function fmtString(str) {
  const b = str.bytes;
  let printable = true;
  for (let i = 0; i < b.length; i++) if (b[i] < 0x20 || b[i] > 0x7e) { printable = false; break; }
  if (!printable || str.hex) { let s = '<'; for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0'); return s + '>'; }
  let s = '(';
  for (let i = 0; i < b.length; i++) {
    const c = b[i];
    if (c === 0x28 || c === 0x29 || c === 0x5c) s += '\\';
    s += String.fromCharCode(c);
  }
  return s + ')';
}

/**
 * Serialize an object to PDF syntax. refMap (optional) renumbers references.
 * Streams are serialized as "dict stream\n...\nendstream" with Length patched.
 */
export function serialize(obj, refMap, out) {
  const parts = out || [];
  const w = (s) => parts.push(s);
  const rec = (o) => {
    if (o === null || o === undefined) w('null');
    else if (typeof o === 'boolean') w(o ? 'true' : 'false');
    else if (typeof o === 'number') w(fmtNum(o));
    else if (o instanceof Name) w('/' + escName(o.name));
    else if (o instanceof Ref) w(`${refMap ? refMap(o) : o.num} 0 R`);
    else if (o instanceof PDFString) w(fmtString(o));
    else if (Array.isArray(o)) { w('['); o.forEach((x, i) => { if (i) w(' '); rec(x); }); w(']'); }
    else if (o instanceof PDFStream) {
      const d = o.dict.clone(); d.set('Length', o.raw.length);
      rec(d); w('\nstream\n'); parts.push(o.raw); w('\nendstream');
    }
    else if (o instanceof Dict) {
      w('<<');
      let first = true;
      for (const [k, v] of o.map) { if (v === undefined) continue; w((first ? '' : ' ') + '/' + escName(k) + ' '); rec(v); first = false; }
      w('>>');
    }
    else if (o && typeof o === 'object' && 'op' in o) w(o.op);
    else w('null');
  };
  rec(obj);
  return parts;
}

/** Flatten serialize() parts (strings + Uint8Arrays) into bytes. */
export function partsToBytes(parts) {
  const chunks = [];
  let str = '';
  for (const p of parts) {
    if (typeof p === 'string') str += p;
    else { if (str) { chunks.push(latin1.encode(str)); str = ''; } chunks.push(p); }
  }
  if (str) chunks.push(latin1.encode(str));
  let n = 0; for (const c of chunks) n += c.length;
  const out = new Uint8Array(n); let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}
