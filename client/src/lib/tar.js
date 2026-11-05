/**
 * ustar reading and gzip inflation, shared by the archive converter and the
 * extractor. Reading only: writing lives with the converter that needs it.
 */
const BLOCK = 512;

function readAscii(buf, off, len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    const b = buf[off + i];
    if (b === 0) break;
    s += String.fromCharCode(b);
  }
  return s;
}
function parseOctal(buf, off, len) {
  const s = readAscii(buf, off, len).trim();
  if (!s) return 0;
  return parseInt(s, 8) || 0;
}
function isZeroBlock(buf, off) {
  for (let i = 0; i < BLOCK; i++) if (buf[off + i] !== 0) return false;
  return true;
}
export function tarParse(bytes) {
  const entries = [];
  let off = 0;
  let longName = null;
  while (off + BLOCK <= bytes.length) {
    if (isZeroBlock(bytes, off)) break;
    const name = readAscii(bytes, 0 + off, 100);
    const prefix = readAscii(bytes, 345 + off, 155);
    const size = parseOctal(bytes, 124 + off, 12);
    const type = bytes[156 + off];
    if (!Number.isSafeInteger(size) || size < 0 || size > 64 * 1024 * 1024 || off + BLOCK + size > bytes.length || entries.length >= 1000) throw new Error('TAR entry exceeds limits or is truncated.');
    const dataOff = off + BLOCK;
    let full = prefix ? prefix + '/' + name : name;

    if (type === 0x4c) {
      longName = readAscii(bytes, dataOff, size).replace(/\0+$/, '');
      off = dataOff + Math.ceil(size / BLOCK) * BLOCK;
      continue;
    }
    if (type === 0x78 || type === 0x67) {
      off = dataOff + Math.ceil(size / BLOCK) * BLOCK;
      continue;
    }
    if (longName) {
      full = longName;
      longName = null;
    }

    const isDir = type === 0x35 || /\/$/.test(full);
    let data = null;
    if (!isDir && size > 0) data = bytes.slice(dataOff, dataOff + size);
    entries.push({ name: full, data: data || new Uint8Array(0), dir: isDir });
    off = dataOff + Math.ceil(size / BLOCK) * BLOCK;
  }
  return entries;
}

export async function streamThrough(bytes, Ctor) {
  const stream = new Ctor('gzip');
  const writer = stream.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const reader = stream.readable.getReader();
  const parts = [];
  let len = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    len += value.length;
    if (len > 128 * 1024 * 1024) { await reader.cancel(); throw new Error('Archive expansion exceeds 128 MB.'); }
    parts.push(value);
  }
  const out = new Uint8Array(len);
  let o = 0;
  parts.forEach((p) => {
    out.set(p, o);
    o += p.length;
  });
  return out;
}

/** Inflate a .gz / .tgz payload with the platform's own gzip decoder. */
export const gunzip = (bytes) => streamThrough(bytes, DecompressionStream);

/**
 * Entries of a .tar / .tar.gz / .tgz file in the shape zip.js hands back —
 * filename, directory, uncompressedSize and getData(writer) — so a UI written
 * for ZIP entries can list and download them unchanged.
 */
export async function tarEntries(file) {
  let bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = await gunzip(bytes);
  return tarParse(bytes).map((e) => ({
    filename: e.name,
    directory: e.dir,
    uncompressedSize: e.data.length,
    getData: async (writer) => {
      const blob = new Blob([e.data]);
      // zip.js writers: BlobWriter wants a Blob back; a FileSystemWritableFileStream wants bytes written.
      if (writer && typeof writer.write === 'function' && typeof writer.close === 'function') {
        await writer.write(e.data);
        await writer.close();
        return blob;
      }
      return blob;
    },
  }));
}
