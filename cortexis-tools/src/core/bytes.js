// Byte-level helpers shared by every tool. No dependencies.

export function concat(chunks) {
  let n = 0;
  for (const c of chunks) n += c.length;
  const out = new Uint8Array(n);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

export const latin1 = {
  encode(s) { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff; return b; },
  decode(b) { let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); return s; },
};
export const utf8 = {
  encode: (s) => new TextEncoder().encode(s),
  decode: (b) => new TextDecoder().decode(b),
};

export function toBase64(bytes) {
  const s = latin1.decode(bytes);
  return typeof btoa === 'function' ? btoa(s) : Buffer.from(s, 'latin1').toString('base64');
}
export function fromBase64(str) {
  const s = typeof atob === 'function' ? atob(str) : Buffer.from(str, 'base64').toString('latin1');
  return latin1.encode(s);
}
export function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return fromBase64(s);
}
export function base64UrlEncode(bytes) {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export const base64 = { encode: toBase64, decode: (s) => fromBase64(String(s).replace(/\s+/g, '')) };
export const base64url = { encode: base64UrlEncode, decode: (s) => base64UrlDecode(String(s).replace(/\s+/g, '')) };

export function hex(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, '0');
  return s;
}

// ---------- CRC32 ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
export function crc32(bytes, crc = 0) {
  crc = crc ^ -1;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

// ---------- Inflate (RFC 1951) — pure JS, tolerant of trailing garbage / truncation ----------
const LEN_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
const LEN_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
const DIST_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
const DIST_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
const CL_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

function buildHuffman(lengths) {
  const count = new Uint16Array(16), symbol = new Uint16Array(lengths.length);
  for (const l of lengths) count[l]++;
  count[0] = 0;
  const offs = new Uint16Array(16);
  for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + count[i - 1];
  for (let s = 0; s < lengths.length; s++) if (lengths[s]) symbol[offs[lengths[s]]++] = s;
  return { count, symbol };
}

class BitReader {
  constructor(data, pos = 0) { this.data = data; this.pos = pos; this.bit = 0; this.buf = 0; }
  bits(n) {
    let v = this.buf;
    while (this.bit < n) {
      if (this.pos >= this.data.length) throw new Error('inflate: unexpected end of data');
      v |= this.data[this.pos++] << this.bit;
      this.bit += 8;
    }
    this.buf = v >>> n;
    this.bit -= n;
    return v & ((1 << n) - 1);
  }
  decode(h) {
    let code = 0, first = 0, index = 0;
    for (let len = 1; len < 16; len++) {
      code |= this.bits(1);
      const c = h.count[len];
      if (code - c < first) return h.symbol[index + (code - first)];
      index += c; first += c; first <<= 1; code <<= 1;
    }
    throw new Error('inflate: bad huffman code');
  }
  alignByte() { this.bit = 0; this.buf = 0; }
}

let FIXED_LIT = null, FIXED_DIST = null;

/**
 * Inflate raw deflate data. Returns whatever was decoded even if the stream is truncated.
 * @param {Uint8Array} data
 * @param {{ start?: number, partial?: boolean }} [opts]
 */
export function inflateRaw(data, opts = {}) {
  const br = new BitReader(data, opts.start || 0);
  let out = new Uint8Array(Math.max(1024, data.length * 4));
  let o = 0;
  const grow = (need) => { if (o + need > out.length) { const n = new Uint8Array(Math.max(out.length * 2, o + need)); n.set(out.subarray(0, o)); out = n; } };
  try {
    let last = 0;
    do {
      last = br.bits(1);
      const type = br.bits(2);
      if (type === 0) {
        br.alignByte();
        if (br.pos + 4 > data.length) break;
        const len = data[br.pos] | (data[br.pos + 1] << 8);
        br.pos += 4;
        grow(len);
        const take = Math.min(len, data.length - br.pos);
        out.set(data.subarray(br.pos, br.pos + take), o);
        o += take; br.pos += take;
        if (take < len) break;
        continue;
      }
      let lit, dist;
      if (type === 1) {
        if (!FIXED_LIT) {
          const l = new Uint8Array(288);
          l.fill(8, 0, 144); l.fill(9, 144, 256); l.fill(7, 256, 280); l.fill(8, 280, 288);
          FIXED_LIT = buildHuffman(l);
          FIXED_DIST = buildHuffman(new Uint8Array(30).fill(5));
        }
        lit = FIXED_LIT; dist = FIXED_DIST;
      } else if (type === 2) {
        const nlen = br.bits(5) + 257, ndist = br.bits(5) + 1, ncode = br.bits(4) + 4;
        const cl = new Uint8Array(19);
        for (let i = 0; i < ncode; i++) cl[CL_ORDER[i]] = br.bits(3);
        const clh = buildHuffman(cl);
        const lengths = new Uint8Array(nlen + ndist);
        for (let i = 0; i < nlen + ndist;) {
          const sym = br.decode(clh);
          if (sym < 16) lengths[i++] = sym;
          else {
            let rep = 0, val = 0;
            if (sym === 16) { val = lengths[i - 1]; rep = 3 + br.bits(2); }
            else if (sym === 17) rep = 3 + br.bits(3);
            else rep = 11 + br.bits(7);
            while (rep-- && i < nlen + ndist) lengths[i++] = val;
          }
        }
        lit = buildHuffman(lengths.subarray(0, nlen));
        dist = buildHuffman(lengths.subarray(nlen));
      } else throw new Error('inflate: invalid block type');
      for (;;) {
        const sym = br.decode(lit);
        if (sym < 256) { grow(1); out[o++] = sym; }
        else if (sym === 256) break;
        else {
          const li = sym - 257;
          if (li >= 29) throw new Error('inflate: bad length');
          const len = LEN_BASE[li] + br.bits(LEN_EXTRA[li]);
          const di = br.decode(dist);
          if (di >= 30) throw new Error('inflate: bad distance');
          const d = DIST_BASE[di] + br.bits(DIST_EXTRA[di]);
          if (d > o) throw new Error('inflate: distance too far back');
          grow(len);
          for (let k = 0; k < len; k++) { out[o] = out[o - d]; o++; }
        }
      }
    } while (!last);
  } catch (e) {
    if (!opts.partial && o === 0) throw e;
  }
  return out.subarray(0, o);
}

/** Inflate zlib-wrapped data (RFC 1950). Falls back to raw deflate if the header is missing. */
export function inflateZlib(data, opts = {}) {
  let start = 0;
  // skip leading whitespace/garbage some PDF writers emit
  while (start < data.length && (data[start] === 0x0a || data[start] === 0x0d || data[start] === 0x20 || data[start] === 0x09)) start++;
  if (data.length - start >= 2) {
    const cmf = data[start], flg = data[start + 1];
    if ((cmf & 0x0f) === 8 && ((cmf << 8) | flg) % 31 === 0) return inflateRaw(data, { ...opts, start: start + 2 });
  }
  return inflateRaw(data, { ...opts, start });
}

/** Inflate gzip data (RFC 1952). */
export function inflateGzip(data) {
  if (data[0] !== 0x1f || data[1] !== 0x8b) throw new Error('not gzip');
  const flg = data[3];
  let p = 10;
  if (flg & 4) { const xlen = data[p] | (data[p + 1] << 8); p += 2 + xlen; }
  if (flg & 8) { while (data[p++] !== 0); }
  if (flg & 16) { while (data[p++] !== 0); }
  if (flg & 2) p += 2;
  return inflateRaw(data, { start: p });
}

// ---------- Deflate (via the browser/Node CompressionStream, which is built in — no library) ----------
async function compressWith(format, bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  const cs = new CompressionStream(format);
  const w = cs.writable.getWriter();
  w.write(bytes); w.close();
  const chunks = [];
  const r = cs.readable.getReader();
  for (;;) { const { value, done } = await r.read(); if (done) break; chunks.push(value); }
  return concat(chunks);
}
/** zlib-wrapped deflate (what PDF /FlateDecode and PNG expect). */
export async function deflateZlib(bytes) {
  const out = await compressWith('deflate', bytes);
  return out || storedZlib(bytes);
}
/** raw deflate (what ZIP method 8 expects). */
export async function deflateRaw(bytes) {
  const out = await compressWith('deflate-raw', bytes);
  return out || storedRaw(bytes);
}
// Fallbacks that produce valid "stored" deflate streams synchronously.
export function storedRaw(bytes) {
  const blocks = Math.max(1, Math.ceil(bytes.length / 65535));
  const out = new Uint8Array(bytes.length + blocks * 5);
  let o = 0;
  for (let i = 0; i < blocks; i++) {
    const chunk = bytes.subarray(i * 65535, (i + 1) * 65535);
    out[o++] = i === blocks - 1 ? 1 : 0;
    out[o++] = chunk.length & 0xff; out[o++] = chunk.length >> 8;
    out[o++] = ~chunk.length & 0xff; out[o++] = (~chunk.length >> 8) & 0xff;
    out.set(chunk, o); o += chunk.length;
  }
  return out;
}
function adler32(bytes) {
  let a = 1, b = 0;
  for (let i = 0; i < bytes.length; i++) { a = (a + bytes[i]) % 65521; b = (b + a) % 65521; }
  return ((b << 16) | a) >>> 0;
}
export function storedZlib(bytes) {
  const raw = storedRaw(bytes);
  const out = new Uint8Array(raw.length + 6);
  out[0] = 0x78; out[1] = 0x01;
  out.set(raw, 2);
  const ad = adler32(bytes);
  out[raw.length + 2] = ad >>> 24; out[raw.length + 3] = (ad >>> 16) & 0xff; out[raw.length + 4] = (ad >>> 8) & 0xff; out[raw.length + 5] = ad & 0xff;
  return out;
}

// ---------- File helpers (browser) ----------
export async function readBytes(file) {
  return new Uint8Array(await file.arrayBuffer());
}
export function readText(file) { return file.text(); }

export function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
  return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

export function stripExt(name) { return name.replace(/\.[^./\\]+$/, ''); }
export function extOf(name) { const m = /\.([^./\\]+)$/.exec(name); return m ? m[1].toLowerCase() : ''; }

export function be32(b, p) { return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0; }
export function be16(b, p) { return (b[p] << 8) | b[p + 1]; }
export function le32(b, p) { return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0; }
export function le16(b, p) { return b[p] | (b[p + 1] << 8); }

/** Growable byte writer. */
export class ByteWriter {
  constructor(size = 1 << 16) { this.buf = new Uint8Array(size); this.len = 0; }
  ensure(n) { if (this.len + n > this.buf.length) { const nb = new Uint8Array(Math.max(this.buf.length * 2, this.len + n)); nb.set(this.buf.subarray(0, this.len)); this.buf = nb; } }
  bytes(b) { this.ensure(b.length); this.buf.set(b, this.len); this.len += b.length; return this; }
  str(s) { return this.bytes(latin1.encode(s)); }
  u8(v) { this.ensure(1); this.buf[this.len++] = v & 0xff; return this; }
  u16be(v) { this.ensure(2); this.buf[this.len++] = (v >> 8) & 0xff; this.buf[this.len++] = v & 0xff; return this; }
  u32be(v) { this.ensure(4); this.buf[this.len++] = (v >>> 24) & 0xff; this.buf[this.len++] = (v >>> 16) & 0xff; this.buf[this.len++] = (v >>> 8) & 0xff; this.buf[this.len++] = v & 0xff; return this; }
  u64be(v) { const hi = Math.floor(v / 4294967296), lo = v >>> 0; this.u32be(hi); this.u32be(lo); return this; }
  u16le(v) { this.ensure(2); this.buf[this.len++] = v & 0xff; this.buf[this.len++] = (v >> 8) & 0xff; return this; }
  u32le(v) { this.ensure(4); this.buf[this.len++] = v & 0xff; this.buf[this.len++] = (v >>> 8) & 0xff; this.buf[this.len++] = (v >>> 16) & 0xff; this.buf[this.len++] = (v >>> 24) & 0xff; return this; }
  u64le(v) { const hi = Math.floor(v / 4294967296), lo = v >>> 0; this.u32le(lo); this.u32le(hi); return this; }
  get position() { return this.len; }
  patchU32be(pos, v) { this.buf[pos] = (v >>> 24) & 0xff; this.buf[pos + 1] = (v >>> 16) & 0xff; this.buf[pos + 2] = (v >>> 8) & 0xff; this.buf[pos + 3] = v & 0xff; }
  result() { return this.buf.slice(0, this.len); }
}
