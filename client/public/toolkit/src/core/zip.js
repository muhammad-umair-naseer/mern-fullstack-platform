// Archive support: ZIP reader/writer, TAR reader, GZIP wrapper. Zero dependencies.
import { concat, crc32, inflateRaw, inflateGzip, deflateRaw, utf8, latin1, le16, le32, ByteWriter } from './bytes.js';

const SIG_LOCAL = 0x04034b50, SIG_CENTRAL = 0x02014b50, SIG_EOCD = 0x06054b50, SIG_EOCD64 = 0x06064b50, SIG_EOCD64_LOC = 0x07064b50;

function dosDate(d) {
  const t = ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | ((d.getSeconds() >> 1) & 31);
  const dt = (((d.getFullYear() - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31);
  return { t, dt };
}
function fromDosDate(t, dt) {
  return new Date(1980 + (dt >> 9), ((dt >> 5) & 15) - 1, dt & 31, t >> 11, (t >> 5) & 63, (t & 31) * 2);
}
const le64 = (b, p) => Number((BigInt(le32(b, p + 4)) << 32n) | BigInt(le32(b, p)));

/** Read a ZIP archive from bytes. Returns { entries: [{name, size, compressedSize, isDir, date, method, data()}] } */
export function readZip(bytes) {
  const b = bytes;
  // locate EOCD
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 66000); i--) if (le32(b, i) === SIG_EOCD) { eocd = i; break; }
  if (eocd < 0) throw new Error('Not a ZIP file (end of central directory not found)');
  let count = le16(b, eocd + 10);
  let cdSize = le32(b, eocd + 12);
  let cdOff = le32(b, eocd + 16);
  // ZIP64
  if (count === 0xffff || cdOff === 0xffffffff || cdSize === 0xffffffff) {
    const loc = eocd - 20;
    if (loc >= 0 && le32(b, loc) === SIG_EOCD64_LOC) {
      const e64 = le64(b, loc + 8);
      if (le32(b, e64) === SIG_EOCD64) { count = le64(b, e64 + 32); cdSize = le64(b, e64 + 40); cdOff = le64(b, e64 + 48); }
    }
  }
  if (count > 1000 || cdOff + cdSize > b.length) throw new Error('Archive exceeds 1000 entries or is corrupt.');
  const entries = []; let expanded = 0;
  let p = cdOff;
  for (let i = 0; i < count && p + 46 <= b.length; i++) {
    if (le32(b, p) !== SIG_CENTRAL) break;
    const flags = le16(b, p + 8), method = le16(b, p + 10), t = le16(b, p + 12), dt = le16(b, p + 14);
    const crc = le32(b, p + 16);
    let csize = le32(b, p + 20), usize = le32(b, p + 24);
    const nlen = le16(b, p + 28), xlen = le16(b, p + 30), clen = le16(b, p + 32);
    let lho = le32(b, p + 42);
    const nameBytes = b.subarray(p + 46, p + 46 + nlen);
    const name = flags & 0x800 ? utf8.decode(nameBytes) : utf8Safe(nameBytes);
    // zip64 extra
    let xp = p + 46 + nlen; const xend = xp + xlen;
    while (xp + 4 <= xend) {
      const id = le16(b, xp), sz = le16(b, xp + 2);
      if (id === 1) { let q = xp + 4; if (usize === 0xffffffff) { usize = le64(b, q); q += 8; } if (csize === 0xffffffff) { csize = le64(b, q); q += 8; } if (lho === 0xffffffff) { lho = le64(b, q); q += 8; } }
      xp += 4 + sz;
    }
    p = xend + clen;
    expanded += usize;
    if (!Number.isSafeInteger(usize) || usize > 64 * 1024 * 1024 || expanded > 128 * 1024 * 1024 || p > b.length) throw new Error('Archive expanded-size limit exceeded (64 MB per entry, 128 MB total).');
    const entry = {
      name, size: usize, compressedSize: csize, method, crc, isDir: name.endsWith('/') || (usize === 0 && csize === 0 && name.endsWith('/')), date: fromDosDate(t, dt), encrypted: !!(flags & 1),
      data() {
        if (this.encrypted) throw new Error(`"${name}" is password-protected; encrypted ZIP entries are not supported`);
        if (le32(b, lho) !== SIG_LOCAL) throw new Error('Corrupt ZIP local header');
        const ln = le16(b, lho + 26), lx = le16(b, lho + 28);
        const start = lho + 30 + ln + lx;
        const raw = b.subarray(start, start + csize);
        if (start + csize > b.length) throw new Error('Truncated ZIP entry');
        if (method === 0 || method === 8) {
          const data = method === 0 ? raw : inflateRaw(raw, { maxOutput: Math.max(1, usize) });
          if (data.length !== usize || crc32(data) !== crc) throw new Error('ZIP entry size or checksum mismatch');
          return data;
        }
        throw new Error(`Unsupported ZIP compression method ${method} in "${name}"`);
      },
    };
    entries.push(entry);
  }
  return { entries };
}
function utf8Safe(bytes) { try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { return latin1.decode(bytes); } }

/** Build a ZIP file. files: [{name, data:Uint8Array, date?, store?}] -> Uint8Array */
export async function writeZip(files, { level = 'deflate', comment = '' } = {}) {
  const parts = [], central = [];
  let offset = 0;
  const now = new Date();
  for (const f of files) {
    const nameBytes = utf8.encode(f.name.replace(/\\/g, '/'));
    const data = f.data instanceof Uint8Array ? f.data : f.data == null ? new Uint8Array(0) : utf8.encode(String(f.data));
    const isDir = f.name.endsWith('/');
    let method = 0, payload = data;
    if (!isDir && level !== 'store' && data.length > 0 && !f.store) {
      const d = await deflateRaw(data);
      if (d.length < data.length) { method = 8; payload = d; }
    }
    const crc = crc32(data);
    const { t, dt } = dosDate(f.date || now);
    const zip64 = data.length >= 0xffffffff || payload.length >= 0xffffffff || offset >= 0xffffffff;
    const lh = new ByteWriter(30 + nameBytes.length + (zip64 ? 20 : 0));
    lh.u32le(SIG_LOCAL).u16le(zip64 ? 45 : 20).u16le(0x800).u16le(method).u16le(t).u16le(dt).u32le(crc)
      .u32le(zip64 ? 0xffffffff : payload.length).u32le(zip64 ? 0xffffffff : data.length).u16le(nameBytes.length).u16le(zip64 ? 20 : 0).bytes(nameBytes);
    if (zip64) lh.u16le(1).u16le(16).u64le(data.length).u64le(payload.length);
    const localBytes = lh.result();
    parts.push(localBytes, payload);
    const ch = new ByteWriter(46 + nameBytes.length + (zip64 ? 28 : 0));
    ch.u32le(SIG_CENTRAL).u16le(zip64 ? 45 : 20).u16le(zip64 ? 45 : 20).u16le(0x800).u16le(method).u16le(t).u16le(dt).u32le(crc)
      .u32le(zip64 ? 0xffffffff : payload.length).u32le(zip64 ? 0xffffffff : data.length).u16le(nameBytes.length).u16le(zip64 ? 28 : 0).u16le(0).u16le(0).u16le(0)
      .u32le(isDir ? 0x10 : 0).u32le(zip64 ? 0xffffffff : offset).bytes(nameBytes);
    if (zip64) ch.u16le(1).u16le(24).u64le(data.length).u64le(payload.length).u64le(offset);
    central.push(ch.result());
    offset += localBytes.length + payload.length;
  }
  const cdStart = offset;
  const cd = concat(central);
  const commentBytes = utf8.encode(comment);
  const needs64 = files.length >= 0xffff || cdStart >= 0xffffffff || cd.length >= 0xffffffff;
  const tail = [];
  if (needs64) {
    const e = new ByteWriter(56 + 20);
    e.u32le(SIG_EOCD64).u64le(44).u16le(45).u16le(45).u32le(0).u32le(0).u64le(files.length).u64le(files.length).u64le(cd.length).u64le(cdStart);
    e.u32le(SIG_EOCD64_LOC).u32le(0).u64le(cdStart + cd.length).u32le(1);
    tail.push(e.result());
  }
  const eocd = new ByteWriter(22 + commentBytes.length);
  eocd.u32le(SIG_EOCD).u16le(0).u16le(0).u16le(needs64 ? 0xffff : files.length).u16le(needs64 ? 0xffff : files.length).u32le(needs64 ? 0xffffffff : cd.length).u32le(needs64 ? 0xffffffff : cdStart).u16le(commentBytes.length).bytes(commentBytes);
  tail.push(eocd.result());
  return concat([...parts, cd, ...tail]);
}

// ---------------- TAR ----------------
const octal = (b, p, n) => { let s = latin1.decode(b.subarray(p, p + n)).replace(/\0.*$/s, '').trim(); if (b[p] & 0x80) { let v = 0; for (let i = 1; i < n; i++) v = v * 256 + b[p + i]; return v; } return s ? parseInt(s, 8) || 0 : 0; };
const cstr = (b, p, n) => utf8Safe(b.subarray(p, p + n)).replace(/\0.*$/s, '');

/** Read a TAR (ustar/pax/gnu) archive. Returns { entries: [{name, size, isDir, date, data()}] } */
export function readTar(bytes) {
  const b = bytes;
  const entries = [];
  let p = 0, paxName = null, longName = null;
  while (p + 512 <= b.length) {
    if (b[p] === 0 && b.subarray(p, p + 512).every((x) => x === 0)) break;
    const name0 = cstr(b, p, 100), size = octal(b, p + 124, 12), mtime = octal(b, p + 136, 12), type = String.fromCharCode(b[p + 156] || 48);
    const magic = latin1.decode(b.subarray(p + 257, p + 262));
    const prefix = magic === 'ustar' ? cstr(b, p + 345, 155) : '';
    if (!Number.isSafeInteger(size) || size < 0 || size > 64 * 1024 * 1024 || p + 512 + size > b.length || entries.length >= 1000) throw new Error('TAR entry exceeds limits or is truncated.');
    const dataStart = p + 512, blocks = Math.ceil(size / 512);
    if (type === 'L') { longName = cstr(b, dataStart, size); p = dataStart + blocks * 512; continue; }
    if (type === 'x' || type === 'g') {
      const txt = utf8Safe(b.subarray(dataStart, dataStart + size));
      for (const line of txt.split('\n')) { const m = /^\d+ path=(.*)$/.exec(line); if (m) paxName = m[1]; }
      p = dataStart + blocks * 512; continue;
    }
    let name = paxName || longName || (prefix ? prefix + '/' + name0 : name0);
    paxName = longName = null;
    const isDir = type === '5' || name.endsWith('/');
    if (type === '0' || type === '\0' || type === '5' || type === '7') {
      const start = dataStart, end = dataStart + size;
      entries.push({ name, size, isDir, date: new Date(mtime * 1000), data: () => b.subarray(start, end) });
    }
    p = dataStart + blocks * 512;
  }
  return { entries };
}

export function isZip(b) { return b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5 || b[2] === 7); }
export function isGzip(b) { return b.length > 2 && b[0] === 0x1f && b[1] === 0x8b; }
export function isTar(b) { return b.length > 262 && latin1.decode(b.subarray(257, 262)) === 'ustar'; }
export function isRar(b) { return b.length > 6 && b[0] === 0x52 && b[1] === 0x61 && b[2] === 0x72 && b[3] === 0x21; }
export function is7z(b) { return b.length > 6 && b[0] === 0x37 && b[1] === 0x7a && b[2] === 0xbc && b[3] === 0xaf; }

/** Auto-detect and read an archive: zip, tar, tar.gz/tgz, gz (single file). */
export function readArchive(bytes, fileName = '') {
  if (isZip(bytes)) return { kind: 'zip', ...readZip(bytes) };
  if (isGzip(bytes)) {
    const inner = inflateGzip(bytes);
    const base = fileName.replace(/\.(t?gz|gzip)$/i, '');
    if (isTar(inner) || /\.tar$/i.test(base) || /\.tgz$/i.test(fileName)) return { kind: 'tar.gz', ...readTar(inner) };
    return { kind: 'gz', entries: [{ name: base || 'file', size: inner.length, isDir: false, date: new Date(), data: () => inner }] };
  }
  if (isTar(bytes) || /\.tar$/i.test(fileName)) return { kind: 'tar', ...readTar(bytes) };
  if (isRar(bytes)) throw new Error('RAR archives use a proprietary format that cannot be decoded natively in the browser without a third-party engine. Please extract it locally and upload the files (or a ZIP/TAR).');
  if (is7z(bytes)) throw new Error('7Z archives (LZMA) are not supported by this native engine. Please extract locally and upload the files (or a ZIP/TAR).');
  throw new Error('Unrecognised archive format. Supported: ZIP, TAR, TAR.GZ/TGZ, GZ');
}

/** Wrap bytes in a GZIP container (own header/trailer; deflate via CompressionStream). */
export async function gzip(bytes, name = '') {
  const body = await deflateRaw(bytes);
  const nameBytes = name ? utf8.encode(name) : null;
  const w = new ByteWriter(10 + (nameBytes ? nameBytes.length + 1 : 0) + body.length + 8);
  w.u8(0x1f).u8(0x8b).u8(8).u8(nameBytes ? 8 : 0).u32le(Math.floor(Date.now() / 1000)).u8(0).u8(255);
  if (nameBytes) w.bytes(nameBytes).u8(0);
  w.bytes(body).u32le(crc32(bytes)).u32le(bytes.length >>> 0);
  return w.result();
}
