import { PDFDocument, PDFRef } from 'pdf-lib';
import { md5, rc4, PAD, concatBytes } from './pdfCrypto';

const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Removes password protection from a PDF whose password you know.
 *
 * Works on the raw bytes rather than through pdf-lib's object model, because
 * pdf-lib cannot load an encrypted file that stores objects in object streams
 * (it inflates them before anything can decrypt them, and fails). So: read the
 * trailer, find the /Encrypt dictionary, derive the file key from the
 * password, walk every indirect object decrypting its strings and streams,
 * drop /Encrypt from every trailer, and hand the clean bytes to pdf-lib for a
 * tidy re-save with a fresh cross-reference table.
 *
 * Supports the standard security handler in every revision that exists:
 *   R2       RC4 40-bit
 *   R3       RC4 40–128-bit
 *   R4       RC4 or AES-128 via crypt filters
 *   R5 / R6  AES-256 (Adobe extension level 3 and ISO 32000-2)
 * Both the user (open) password and the owner (permissions) password unlock
 * the file. Certificate-based (public-key) encryption is not a password and
 * is rejected with a clear message.
 */

// ------------------------------------------------------------------ lexing

const isWhite = (c) => c === 0x20 || c === 0x0a || c === 0x0d || c === 0x09 || c === 0x0c || c === 0x00;
const isDelim = (c) =>
  c === 0x28 || c === 0x29 || c === 0x3c || c === 0x3e || c === 0x5b || c === 0x5d ||
  c === 0x7b || c === 0x7d || c === 0x2f || c === 0x25;
const isRegular = (c) => !isWhite(c) && !isDelim(c);
const ascii = (buf, start, end) => String.fromCharCode.apply(null, buf.subarray(start, end));

class Lexer {
  constructor(buf, pos) {
    this.buf = buf;
    this.pos = pos;
  }

  skipWs() {
    const { buf } = this;
    while (this.pos < buf.length) {
      const c = buf[this.pos];
      if (isWhite(c)) this.pos++;
      else if (c === 0x25) {
        while (this.pos < buf.length && buf[this.pos] !== 0x0a && buf[this.pos] !== 0x0d) this.pos++;
      } else break;
    }
  }

  /** Next token: { kind, start, end, value }. */
  next() {
    this.skipWs();
    const { buf } = this;
    const start = this.pos;
    if (start >= buf.length) return { kind: 'eof', start, end: start };
    const c = buf[start];

    if (c === 0x28) return this.literalString(start);
    if (c === 0x3c) {
      if (buf[start + 1] === 0x3c) return this.tok('dictOpen', start, start + 2);
      return this.hexString(start);
    }
    if (c === 0x3e) {
      if (buf[start + 1] === 0x3e) return this.tok('dictClose', start, start + 2);
      return this.tok('junk', start, start + 1);
    }
    if (c === 0x5b) return this.tok('arrOpen', start, start + 1);
    if (c === 0x5d) return this.tok('arrClose', start, start + 1);
    if (c === 0x7b || c === 0x7d) return this.tok('junk', start, start + 1);
    if (c === 0x2f) {
      let end = start + 1;
      while (end < buf.length && isRegular(buf[end])) end++;
      const raw = ascii(buf, start + 1, end);
      const value = raw.replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      return this.tok('name', start, end, value);
    }
    let end = start;
    while (end < buf.length && isRegular(buf[end])) end++;
    if (end === start) return this.tok('junk', start, start + 1);
    const word = ascii(buf, start, end);
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) return this.tok('num', start, end, parseFloat(word));
    return this.tok('kw', start, end, word);
  }

  tok(kind, start, end, value) {
    this.pos = end;
    return { kind, start, end, value };
  }

  literalString(start) {
    const { buf } = this;
    let depth = 0;
    let i = start;
    for (; i < buf.length; i++) {
      const c = buf[i];
      if (c === 0x5c) i++;
      else if (c === 0x28) depth++;
      else if (c === 0x29 && --depth === 0) break;
    }
    return this.tok('str', start, i + 1, { hex: false, cStart: start + 1, cEnd: i });
  }

  hexString(start) {
    const { buf } = this;
    let i = start + 1;
    while (i < buf.length && buf[i] !== 0x3e) i++;
    return this.tok('str', start, i + 1, { hex: true, cStart: start + 1, cEnd: i });
  }
}

/** Raw bytes of a string token, escapes and hex decoded. */
const stringBytes = (buf, tok) => {
  const { hex, cStart, cEnd } = tok.value;
  const out = [];
  if (hex) {
    let hi = -1;
    for (let i = cStart; i < cEnd; i++) {
      const c = buf[i];
      let v;
      if (c >= 0x30 && c <= 0x39) v = c - 0x30;
      else if (c >= 0x41 && c <= 0x46) v = c - 0x37;
      else if (c >= 0x61 && c <= 0x66) v = c - 0x57;
      else continue;
      if (hi < 0) hi = v;
      else {
        out.push((hi << 4) | v);
        hi = -1;
      }
    }
    if (hi >= 0) out.push(hi << 4);
    return Uint8Array.from(out);
  }
  for (let i = cStart; i < cEnd; i++) {
    const c = buf[i];
    if (c === 0x5c) {
      const n = buf[++i];
      if (n === 0x6e) out.push(0x0a);
      else if (n === 0x72) out.push(0x0d);
      else if (n === 0x74) out.push(0x09);
      else if (n === 0x62) out.push(0x08);
      else if (n === 0x66) out.push(0x0c);
      else if (n >= 0x30 && n <= 0x37) {
        let v = n - 0x30;
        for (let k = 0; k < 2 && buf[i + 1] >= 0x30 && buf[i + 1] <= 0x37; k++) v = (v << 3) | (buf[++i] - 0x30);
        out.push(v & 0xff);
      } else if (n === 0x0d) {
        if (buf[i + 1] === 0x0a) i++;
      } else if (n === 0x0a) {
        /* line continuation */
      } else out.push(n);
    } else if (c === 0x0d) {
      out.push(0x0a);
      if (buf[i + 1] === 0x0a) i++;
    } else out.push(c);
  }
  return Uint8Array.from(out);
};

// ----------------------------------------------------------------- parsing

/**
 * Recursive-descent parse of one PDF value. Every node keeps its byte range so
 * the caller can splice replacements back into the file.
 */
const parseValue = (lex) => {
  const tok = lex.next();
  switch (tok.kind) {
    case 'num': {
      // "n g R" is an indirect reference; look ahead without committing.
      const save = lex.pos;
      const t2 = lex.next();
      if (t2.kind === 'num' && Number.isInteger(t2.value)) {
        const t3 = lex.next();
        if (t3.kind === 'kw' && t3.value === 'R') {
          return { t: 'ref', num: tok.value, gen: t2.value, start: tok.start, end: t3.end };
        }
      }
      lex.pos = save;
      return { t: 'num', v: tok.value, start: tok.start, end: tok.end };
    }
    case 'name':
      return { t: 'name', v: tok.value, start: tok.start, end: tok.end };
    case 'str':
      return { t: 'str', tok, start: tok.start, end: tok.end };
    case 'arrOpen': {
      const items = [];
      for (;;) {
        lex.skipWs();
        if (lex.buf[lex.pos] === 0x5d) {
          lex.pos++;
          break;
        }
        if (lex.pos >= lex.buf.length) break;
        const v = parseValue(lex);
        if (v.t === 'eof') break;
        if (v.t === 'kw' && (v.v === 'endobj' || v.v === 'stream' || v.v === 'endstream')) {
          lex.pos = v.start;
          break;
        }
        items.push(v);
      }
      return { t: 'arr', items, start: tok.start, end: lex.pos };
    }
    case 'dictOpen': {
      const entries = [];
      for (;;) {
        const k = lex.next();
        if (k.kind === 'dictClose' || k.kind === 'eof') break;
        if (k.kind !== 'name') {
          if (k.kind === 'kw' && (k.value === 'endobj' || k.value === 'stream')) {
            lex.pos = k.start;
            break;
          }
          continue; // tolerate junk
        }
        const v = parseValue(lex);
        entries.push({ key: k.value, keyStart: k.start, value: v });
      }
      const node = { t: 'dict', entries, start: tok.start, end: lex.pos };
      node.get = (key) => entries.find((e) => e.key === key)?.value;
      return node;
    }
    case 'kw':
      return { t: 'kw', v: tok.value, start: tok.start, end: tok.end };
    case 'eof':
      return { t: 'eof', start: tok.start, end: tok.end };
    default:
      return { t: 'junk', start: tok.start, end: tok.end };
  }
};

const walkStrings = (node, out) => {
  if (!node) return out;
  if (node.t === 'str') out.push(node);
  else if (node.t === 'arr') node.items.forEach((i) => walkStrings(i, out));
  else if (node.t === 'dict') node.entries.forEach((e) => walkStrings(e.value, out));
  return out;
};

const findAll = (buf, needle, from = 0) => {
  const n = needle.length;
  const first = needle[0];
  const hits = [];
  for (let i = buf.indexOf(first, from); i !== -1; i = buf.indexOf(first, i + 1)) {
    let ok = true;
    for (let k = 1; k < n; k++) {
      if (buf[i + k] !== needle[k]) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(i);
  }
  return hits;
};

const bytesOf = (s) => Uint8Array.from(s, (ch) => ch.charCodeAt(0));
const OBJ = bytesOf('obj');
const ENDSTREAM = bytesOf('endstream');
const TRAILER = bytesOf('trailer');

/** Offsets of every "n g obj" header, keyed "n" -> [{ gen, headerStart, bodyStart }]. */
const indexObjects = (buf) => {
  const index = new Map();
  for (const at of findAll(buf, OBJ)) {
    if (isRegular(buf[at + 3] ?? 0x20)) continue; // "object" inside a word
    // walk back: ws, digits (gen), ws, digits (num), and a delimiter/ws before that
    let i = at - 1;
    while (i >= 0 && isWhite(buf[i])) i--;
    if (i < 0 || !(buf[i] >= 0x30 && buf[i] <= 0x39)) continue;
    const genEnd = i + 1;
    while (i >= 0 && buf[i] >= 0x30 && buf[i] <= 0x39) i--;
    const genStart = i + 1;
    if (i < 0 || !isWhite(buf[i])) continue;
    while (i >= 0 && isWhite(buf[i])) i--;
    if (i < 0 || !(buf[i] >= 0x30 && buf[i] <= 0x39)) continue;
    const numEnd = i + 1;
    while (i >= 0 && buf[i] >= 0x30 && buf[i] <= 0x39) i--;
    if (i >= 0 && isRegular(buf[i])) continue;
    const numStart = i + 1;
    const num = parseInt(ascii(buf, numStart, numEnd), 10);
    const gen = parseInt(ascii(buf, genStart, genEnd), 10);
    if (!index.has(num)) index.set(num, []);
    index.get(num).push({ num, gen, headerStart: numStart, bodyStart: at + 3 });
  }
  return index;
};

/** Parses the object whose header starts at `entry`; returns value, stream bounds and end. */
const parseObject = (buf, entry, index) => {
  const lex = new Lexer(buf, entry.bodyStart);
  const value = parseValue(lex);
  let stream = null;
  lex.skipWs();
  if (value.t === 'dict' && ascii(buf, lex.pos, lex.pos + 6) === 'stream') {
    let p = lex.pos + 6;
    if (buf[p] === 0x0d) p++;
    if (buf[p] === 0x0a) p++;
    const dataStart = p;

    let lengthNode = value.get('Length');
    let length = null;
    if (lengthNode?.t === 'ref') {
      const target = index.get(lengthNode.num)?.slice(-1)[0];
      if (target) {
        const v = parseValue(new Lexer(buf, target.bodyStart));
        if (v.t === 'num') length = v.v;
      }
    } else if (lengthNode?.t === 'num') length = lengthNode.v;

    let dataEnd = null;
    if (length !== null && length >= 0 && dataStart + length <= buf.length) {
      let q = dataStart + length;
      while (q < buf.length && isWhite(buf[q])) q++;
      if (ascii(buf, q, q + 9) === 'endstream') dataEnd = dataStart + length;
    }
    if (dataEnd === null) {
      // /Length lied; trust the endstream keyword instead.
      const hit = findAll(buf, ENDSTREAM, dataStart)[0];
      if (hit === undefined) throw new Error('Malformed PDF: a stream never ends.');
      let e = hit;
      if (buf[e - 1] === 0x0a) e--;
      if (buf[e - 1] === 0x0d) e--;
      dataEnd = e;
    }
    stream = { dataStart, dataEnd, lengthNode };
    lex.pos = dataEnd;
    lex.skipWs();
    if (ascii(buf, lex.pos, lex.pos + 9) === 'endstream') lex.pos += 9;
  }
  lex.skipWs();
  if (ascii(buf, lex.pos, lex.pos + 6) === 'endobj') lex.pos += 6;
  return { value, stream, end: lex.pos };
};

// ------------------------------------------------------------------ crypto

/**
 * The subset of SASLprep (RFC 4013) that matters for a password: drop the
 * characters it maps to nothing (soft hyphen, zero-width joiners, BOM…),
 * normalise the odd spaces to U+0020, then NFKC. Revision 6 hashes the
 * prepared UTF-8, so a soft hyphen typed by accident must not change the key.
 */
const saslprep = (s) =>
  s
    .replace(/[\u00ad\u034f\u1806\u180b-\u180d\u200b-\u200d\u2060\ufe00-\ufe0f\ufeff]/g, '')
    .replace(/[\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g, ' ')
    .normalize('NFKC');
const utf8 = (s) => new TextEncoder().encode(saslprep(s));
const latin1 = (s) => Uint8Array.from(s, (ch) => ch.charCodeAt(0) & 0xff);
const padLegacy = (pwBytes) => {
  const out = new Uint8Array(32);
  const n = Math.min(pwBytes.length, 32);
  out.set(pwBytes.subarray(0, n));
  out.set(PAD.subarray(0, 32 - n), n);
  return out;
};
const equalBytes = (a, b, n = a.length) => {
  if (b.length < n) return false;
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return false;
  return true;
};
const xorKey = (key, i) => key.map((b) => b ^ i);

const subtle = () => {
  const s = (typeof window !== 'undefined' ? window : global).crypto?.subtle; // eslint-disable-line no-undef
  if (!s) throw new Error('This browser does not expose the Web Crypto API needed for AES.');
  return s;
};
const sha = (bits, data) => subtle().digest(`SHA-${bits}`, data).then((d) => new Uint8Array(d));
const aesKey = (raw, usage) => subtle().importKey('raw', raw, { name: 'AES-CBC' }, false, [usage]);

/** AES-CBC decrypt with PKCS#7 padding — the normal case for strings and streams. */
const aesCbcDecrypt = async (raw, iv, data) =>
  new Uint8Array(await subtle().decrypt({ name: 'AES-CBC', iv }, await aesKey(raw, 'decrypt'), data));

/**
 * AES-CBC decrypt of block-aligned data with NO padding. Web Crypto insists on
 * padding, so append one block that decrypts to a valid pad: X such that
 * AES⁻¹(X) ⊕ C_last = 0x10×16, i.e. X = AES(0x10×16 ⊕ C_last), which is the
 * first block of CBC-encrypting a pad block with IV = C_last.
 */
const aesCbcDecryptNoPad = async (raw, iv, data) => {
  if (data.length === 0) return data;
  const cLast = data.length >= 16 ? data.subarray(data.length - 16) : iv;
  const padBlock = new Uint8Array(16).fill(0x10);
  const enc = new Uint8Array(await subtle().encrypt({ name: 'AES-CBC', iv: cLast }, await aesKey(raw, 'encrypt'), padBlock));
  return aesCbcDecrypt(raw, iv, concatBytes([data, enc.subarray(0, 16)]));
};

/** AES-128-CBC encrypt with no padding of block-aligned data (drops the pad block). */
const aesCbcEncryptNoPad = async (raw, iv, data) => {
  const enc = new Uint8Array(await subtle().encrypt({ name: 'AES-CBC', iv }, await aesKey(raw, 'encrypt'), data));
  return enc.subarray(0, data.length);
};

/** ISO 32000-2 Algorithm 2.B (revision 6); plain SHA-256 for revision 5. */
const hash2B = async (pw, salt, udata, revision) => {
  let k = await sha(256, concatBytes([pw, salt, udata]));
  if (revision === 5) return k;
  for (let i = 0; ; i++) {
    const unit = concatBytes([pw, k, udata]);
    const k1 = new Uint8Array(unit.length * 64);
    for (let j = 0; j < 64; j++) k1.set(unit, j * unit.length);
    const e = await aesCbcEncryptNoPad(k.subarray(0, 16), k.subarray(16, 32), k1);
    let sum = 0;
    for (let j = 0; j < 16; j++) sum += e[j];
    const mod = sum % 3;
    k = await sha(mod === 0 ? 256 : mod === 1 ? 384 : 512, e);
    if (i >= 63 && e[e.length - 1] <= i - 31) break;
  }
  return k.subarray(0, 32);
};

/** Derives the file key from either password, or returns null when neither matches. */
const deriveFileKey = async (enc, password, idBytes) => {
  const { R, keyBytes, O, U, P, encryptMetadata } = enc;

  if (R >= 5) {
    const pw = utf8(password).subarray(0, 127);
    // user password
    if (equalBytes(await hash2B(pw, U.subarray(32, 40), new Uint8Array(0), R), U, 32)) {
      const ik = await hash2B(pw, U.subarray(40, 48), new Uint8Array(0), R);
      return { key: await aesCbcDecryptNoPad(ik, new Uint8Array(16), enc.UE), role: 'user' };
    }
    // owner password
    const u48 = U.subarray(0, 48);
    if (equalBytes(await hash2B(pw, O.subarray(32, 40), u48, R), O, 32)) {
      const ik = await hash2B(pw, O.subarray(40, 48), u48, R);
      return { key: await aesCbcDecryptNoPad(ik, new Uint8Array(16), enc.OE), role: 'owner' };
    }
    return null;
  }

  const pBytes = Uint8Array.from([P & 0xff, (P >> 8) & 0xff, (P >> 16) & 0xff, (P >>> 24) & 0xff]);
  const keyFromPadded = (padded) => {
    let k = md5(concatBytes([padded, O.subarray(0, 32), pBytes, idBytes, R >= 4 && !encryptMetadata ? Uint8Array.from([0xff, 0xff, 0xff, 0xff]) : new Uint8Array(0)]));
    if (R >= 3) for (let i = 0; i < 50; i++) k = md5(k.subarray(0, keyBytes));
    return k.subarray(0, keyBytes);
  };
  const checkUser = (key) => {
    if (R === 2) return equalBytes(rc4(key, PAD), U, 32);
    let x = rc4(key, md5(concatBytes([PAD, idBytes])));
    for (let i = 1; i <= 19; i++) x = rc4(xorKey(key, i), x);
    return equalBytes(x, U, 16);
  };

  const pw = latin1(password);
  const asUser = keyFromPadded(padLegacy(pw));
  if (checkUser(asUser)) return { key: asUser, role: 'user' };

  // Owner password: recover the user password from /O, then proceed as above.
  let ok = md5(padLegacy(pw));
  if (R >= 3) for (let i = 0; i < 50; i++) ok = md5(ok);
  ok = ok.subarray(0, keyBytes);
  let userPadded = O.subarray(0, 32);
  if (R === 2) userPadded = rc4(ok, userPadded);
  else for (let i = 19; i >= 0; i--) userPadded = rc4(xorKey(ok, i), userPadded);
  const asOwner = keyFromPadded(userPadded);
  if (checkUser(asOwner)) return { key: asOwner, role: 'owner' };
  return null;
};

const SALT = Uint8Array.from([0x73, 0x41, 0x6c, 0x54]);
const objectKey = (fileKey, num, gen, method) => {
  if (method === 'aesv3') return fileKey;
  const extra = Uint8Array.from([num & 0xff, (num >> 8) & 0xff, (num >> 16) & 0xff, gen & 0xff, (gen >> 8) & 0xff]);
  const k = md5(concatBytes([fileKey, extra, method === 'aesv2' ? SALT : new Uint8Array(0)]));
  return k.subarray(0, Math.min(fileKey.length + 5, 16));
};

const decryptData = async (data, key, method) => {
  if (method === 'none' || data.length === 0) return data;
  if (method === 'rc4') return rc4(key, data);
  if (data.length < 16) return data;
  const iv = data.subarray(0, 16);
  let body = data.subarray(16);
  body = body.subarray(0, body.length - (body.length % 16));
  if (body.length === 0) return new Uint8Array(0);
  try {
    return await aesCbcDecrypt(key, iv, body);
  } catch {
    // Bad padding in the wild: decrypt without the check and strip by hand.
    const plain = await aesCbcDecryptNoPad(key, iv, body);
    const pad = plain[plain.length - 1];
    return pad >= 1 && pad <= 16 ? plain.subarray(0, plain.length - pad) : plain;
  }
};

// ------------------------------------------------------------ the main event

const readEncryptDict = (buf, dict, index) => {
  const num = (k, d) => {
    const v = dict.get(k);
    return v?.t === 'num' ? v.v : d;
  };
  const str = (k) => {
    const v = dict.get(k);
    return v?.t === 'str' ? stringBytes(buf, v.tok) : null;
  };
  const filter = dict.get('Filter');
  if (filter?.t === 'name' && filter.v !== 'Standard') {
    throw new Error(
      /PubSec/i.test(filter.v)
        ? 'This PDF is locked with a digital certificate rather than a password. Only the certificate holder can open it.'
        : `This PDF uses a rights-management system (${filter.v}) rather than a password. Only the system that issued it can open it.`
    );
  }
  const V = num('V', 0);
  const R = num('R', V >= 4 ? 4 : 2);
  let keyBits = num('Length', 40);
  let stmMethod = 'rc4';
  let strMethod = 'rc4';

  if (V >= 4) {
    const cf = dict.get('CF');
    const methodFor = (nameKey) => {
      const n = dict.get(nameKey);
      const name = n?.t === 'name' ? n.v : 'Identity';
      if (name === 'Identity') return 'none';
      const f = cf?.t === 'dict' ? cf.get(name) : null;
      const cfm = f?.t === 'dict' ? f.get('CFM') : null;
      const fl = f?.t === 'dict' ? f.get('Length') : null;
      if (fl?.t === 'num') keyBits = fl.v <= 40 ? fl.v * 8 : fl.v;
      const m = cfm?.t === 'name' ? cfm.v : 'None';
      return m === 'AESV2' ? 'aesv2' : m === 'AESV3' ? 'aesv3' : m === 'V2' ? 'rc4' : 'none';
    };
    stmMethod = methodFor('StmF');
    strMethod = methodFor('StrF');
  }
  if (stmMethod === 'aesv2' || strMethod === 'aesv2') keyBits = 128;
  if (R >= 5) keyBits = 256;
  const keyBytes = R === 2 ? 5 : Math.max(5, Math.min(32, keyBits >> 3));

  const em = dict.get('EncryptMetadata');
  return {
    V,
    R,
    keyBytes,
    stmMethod,
    strMethod,
    O: str('O') ?? new Uint8Array(32),
    U: str('U') ?? new Uint8Array(32),
    OE: str('OE'),
    UE: str('UE'),
    P: num('P', -1) | 0,
    encryptMetadata: !(em?.t === 'kw' && em.v === 'false'),
  };
};

/**
 * @param {File|Blob} file
 * @param {string} password
 * @param {(info: {progress:number, message:string}) => void} [onProgress]
 * @param {AbortSignal} [signal]
 * @returns {Promise<{bytes: Uint8Array, role: 'user'|'owner', method: string, normalized: boolean}>}
 */
export async function unlockPdf(file, password, onProgress, signal) {
  const check = () => {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  };
  onProgress?.({ progress: 5, message: 'Reading document…' });
  const buf = new Uint8Array(await file.arrayBuffer());
  check();

  // 1. Every trailer (classic and cross-reference stream) — to find /Encrypt
  //    and /ID, and later to strip /Encrypt from each of them.
  const index = indexObjects(buf);
  const trailers = [];
  for (const at of findAll(buf, TRAILER)) {
    const d = parseValue(new Lexer(buf, at + 7));
    if (d.t === 'dict') trailers.push({ dict: d, objNum: null });
  }
  const parsed = new Map(); // "num:gen@offset" -> parsed object, so nothing is parsed twice
  for (const entries of index.values()) {
    for (const e of entries) {
      const lex = new Lexer(buf, e.bodyStart);
      // cheap peek: only dicts can be xref streams
      lex.skipWs();
      if (buf[lex.pos] !== 0x3c || buf[lex.pos + 1] !== 0x3c) continue;
      const obj = parseObject(buf, e, index);
      parsed.set(e.headerStart, obj);
      const type = obj.value.get?.('Type');
      if (type?.t === 'name' && type.v === 'XRef') trailers.push({ dict: obj.value, objNum: e.num });
    }
  }

  let encryptRef = null;
  let encryptDict = null;
  let idBytes = new Uint8Array(0);
  for (const { dict } of trailers) {
    const e = dict.get('Encrypt');
    if (e?.t === 'ref') encryptRef = e;
    else if (e?.t === 'dict') encryptDict = e;
    const id = dict.get('ID');
    if (id?.t === 'arr' && id.items[0]?.t === 'str') idBytes = stringBytes(buf, id.items[0].tok);
  }
  if (encryptRef) {
    const target = index.get(encryptRef.num)?.slice(-1)[0];
    if (!target) throw new Error('Malformed PDF: the encryption dictionary is missing.');
    encryptDict = parseObject(buf, target, index).value;
  }
  if (!encryptDict || encryptDict.t !== 'dict') {
    throw new Error('This PDF is not password-protected. It already opens without a password.');
  }
  const enc = readEncryptDict(buf, encryptDict, index);

  // 2. The key. Try the password as the open password, then as the owner password.
  onProgress?.({ progress: 15, message: 'Checking password…' });
  const derived = await deriveFileKey(enc, password, idBytes);
  check();
  if (!derived) {
    throw new Error('Wrong password. Check for typos, caps lock, and stray spaces — passwords are case-sensitive.');
  }
  const { key: fileKey, role } = derived;

  // 3. Walk every object, decrypting strings and streams in place.
  const edits = []; // { start, end, bytes }
  const seenHeaders = new Set();
  const all = [...index.values()].flat().sort((a, b) => a.headerStart - b.headerStart);
  let cursor = 0;
  let done = 0;
  for (const e of all) {
    if (e.headerStart < cursor) continue; // "n g obj" bytes inside a previous stream
    if (seenHeaders.has(e.headerStart)) continue;
    seenHeaders.add(e.headerStart);
    const obj = parsed.get(e.headerStart) ?? parseObject(buf, e, index);
    cursor = obj.end;
    if (++done % 200 === 0) {
      onProgress?.({ progress: 20 + Math.round((70 * done) / all.length), message: `Decrypting ${done} of ${all.length} objects…` });
      await yieldToMain();
      check();
    }

    const dict = obj.value.t === 'dict' ? obj.value : null;
    const type = dict?.get('Type');
    const typeName = type?.t === 'name' ? type.v : null;
    const isEncryptObj = encryptRef && e.num === encryptRef.num;
    if (isEncryptObj || typeName === 'XRef') continue;

    for (const s of walkStrings(obj.value, [])) {
      const raw = stringBytes(buf, s.tok);
      if (!raw.length) continue;
      const plain = await decryptData(raw, objectKey(fileKey, e.num, e.gen, enc.strMethod), enc.strMethod);
      edits.push({ start: s.start, end: s.end, bytes: bytesOf(`<${Array.from(plain, (b) => b.toString(16).padStart(2, '0')).join('')}>`) });
    }

    if (obj.stream) {
      const filter = dict.get('Filter');
      const names = filter?.t === 'name' ? [filter.v] : filter?.t === 'arr' ? filter.items.map((i) => i.v) : [];
      const identityCrypt = names.includes('Crypt');
      const skipMetadata = typeName === 'Metadata' && !enc.encryptMetadata;
      if (identityCrypt || skipMetadata) continue;
      const { dataStart, dataEnd, lengthNode } = obj.stream;
      const plain = await decryptData(buf.subarray(dataStart, dataEnd), objectKey(fileKey, e.num, e.gen, enc.stmMethod), enc.stmMethod);
      edits.push({ start: dataStart, end: dataEnd, bytes: plain });
      if (lengthNode && plain.length !== dataEnd - dataStart) {
        edits.push({ start: lengthNode.start, end: lengthNode.end, bytes: bytesOf(String(plain.length)) });
      }
    }
  }

  // 4. Drop /Encrypt from every trailer.
  for (const { dict } of trailers) {
    const entry = dict.entries.find((x) => x.key === 'Encrypt');
    if (entry) edits.push({ start: entry.keyStart, end: entry.value.end, bytes: new Uint8Array(0) });
  }

  // 5. Splice.
  edits.sort((a, b) => a.start - b.start);
  const parts = [];
  let at = 0;
  for (const ed of edits) {
    if (ed.start < at) continue; // overlapping edit (should not happen); keep the first
    parts.push(buf.subarray(at, ed.start), ed.bytes);
    at = ed.end;
  }
  parts.push(buf.subarray(at));
  const decrypted = concatBytes(parts);
  check();

  // 6. Let pdf-lib rebuild the cross-reference table so every reader is happy.
  onProgress?.({ progress: 92, message: 'Rebuilding document…' });
  const method = enc.R >= 5 ? 'AES-256' : enc.stmMethod === 'aesv2' ? 'AES-128' : `RC4 ${enc.keyBytes * 8}-bit`;
  try {
    const doc = await PDFDocument.load(decrypted, { ignoreEncryption: true, updateMetadata: false });
    // The now-orphaned encryption dictionary would otherwise ride along.
    if (encryptRef) doc.context.delete(PDFRef.of(encryptRef.num, encryptRef.gen));
    const bytes = await doc.save({ useObjectStreams: false });
    onProgress?.({ progress: 100, message: 'Done' });
    return { bytes, role, method, normalized: true };
  } catch {
    onProgress?.({ progress: 100, message: 'Done' });
    return { bytes: decrypted, role, method, normalized: false };
  }
}
