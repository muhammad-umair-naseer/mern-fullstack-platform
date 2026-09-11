import React, { useState, useRef } from 'react';
import { RefreshCw, Download, Archive, ArrowRight, Check, AlertCircle, FileArchive } from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { validateArchiveFile, formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

const BLOCK = 512;

function writeAscii(buf, off, str, len) {
  for (let i = 0; i < len; i++) buf[off + i] = i < str.length ? str.charCodeAt(i) & 0xff : 0;
}
function octal(num, len) {
  let s = num.toString(8);
  while (s.length < len - 1) s = '0' + s;
  return s + '\0';
}
function splitPath(path) {
  if (path.length <= 100) return { name: path, prefix: '' };
  for (let i = path.length - 100; i < path.length; i++) {
    if (path[i] === '/') {
      const prefix = path.slice(0, i);
      const name = path.slice(i + 1);
      if (prefix.length <= 155 && name.length <= 100) return { name, prefix };
    }
  }
  return { name: path.slice(-100), prefix: path.slice(0, Math.min(155, path.length - 100)) };
}
function buildTarHeader(entry) {
  const h = new Uint8Array(BLOCK);
  const isDir = /\/$/.test(entry.name);
  const sp = splitPath(entry.name);
  writeAscii(h, 0, sp.name, 100);
  writeAscii(h, 100, octal(entry.mode != null ? entry.mode : isDir ? 0o755 : 0o644, 8), 8);
  writeAscii(h, 108, octal(0, 8), 8);
  writeAscii(h, 116, octal(0, 8), 8);
  writeAscii(h, 124, octal(entry.data ? entry.data.length : 0, 12), 12);
  writeAscii(h, 136, octal(entry.mtime != null ? entry.mtime : Math.floor(Date.now() / 1000), 12), 12);
  for (let s = 148; s < 156; s++) h[s] = 0x20;
  h[156] = isDir ? 0x35 : 0x30;
  writeAscii(h, 257, 'ustar\0', 6);
  writeAscii(h, 263, '00', 2);
  if (sp.prefix) writeAscii(h, 345, sp.prefix, 155);
  let sum = 0;
  for (let i = 0; i < BLOCK; i++) sum += h[i];
  const cs = octal(sum, 7);
  writeAscii(h, 148, cs, 7);
  h[148 + 6] = 0x20;
  return h;
}
function tarCreate(entries) {
  const chunks = [];
  let total = 0;
  entries.forEach((e) => {
    const header = buildTarHeader(e);
    chunks.push(header);
    total += BLOCK;
    const data = e.data || new Uint8Array(0);
    if (data.length) {
      chunks.push(data);
      total += data.length;
      const rem = data.length % BLOCK;
      if (rem) {
        const padLen = BLOCK - rem;
        chunks.push(new Uint8Array(padLen));
        total += padLen;
      }
    }
  });
  chunks.push(new Uint8Array(BLOCK * 2));
  total += BLOCK * 2;
  const out = new Uint8Array(total);
  let off = 0;
  chunks.forEach((c) => {
    out.set(c, off);
    off += c.length;
  });
  return out;
}
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
function tarParse(bytes) {
  const entries = [];
  let off = 0;
  let longName = null;
  while (off + BLOCK <= bytes.length) {
    if (isZeroBlock(bytes, off)) break;
    const name = readAscii(bytes, 0 + off, 100);
    const prefix = readAscii(bytes, 345 + off, 155);
    const size = parseOctal(bytes, 124 + off, 12);
    const type = bytes[156 + off];
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

async function streamThrough(bytes, Ctor) {
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
    parts.push(value);
    len += value.length;
  }
  const out = new Uint8Array(len);
  let o = 0;
  parts.forEach((p) => {
    out.set(p, o);
    o += p.length;
  });
  return out;
}

export default function ArchiveConverter() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('zip'); // 'zip' | 'tar' | 'tar.gz'
  const [status, setStatus] = useState('idle'); // 'idle' | 'reading' | 'converting' | 'ready' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [entries, setEntries] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleSelectFile = async (selectedFile) => {
    if (!selectedFile) return;
    setStatus('reading');
    setStatusMsg(`Reading archive ${selectedFile.name}...`);
    setFile(selectedFile);

    try {
      const name = selectedFile.name.toLowerCase();
      let extracted = [];

      if (name.endsWith('.tar.gz') || name.endsWith('.tgz')) {
        const buffer = await selectedFile.arrayBuffer();
        const uncompressed = await streamThrough(new Uint8Array(buffer), DecompressionStream);
        extracted = tarParse(uncompressed);
      } else if (name.endsWith('.tar')) {
        const buffer = await selectedFile.arrayBuffer();
        extracted = tarParse(new Uint8Array(buffer));
      } else {
        // ZIP
        const zip = await loadZipLib();
        zip.configure({ useWebWorkers: false });
        const reader = new zip.ZipReader(new zip.BlobReader(selectedFile));
        const zipEntries = await reader.getEntries();
        for (const e of zipEntries) {
          if (!e.directory) {
            const data = await e.getData(new zip.Uint8ArrayWriter());
            extracted.push({ name: e.filename, data, dir: false });
          } else {
            extracted.push({ name: e.filename, data: new Uint8Array(0), dir: true });
          }
        }
      }

      setEntries(extracted);
      setStatus('ready');
      setStatusMsg(`Loaded ${extracted.length} items from ${selectedFile.name}. Select target format.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to parse archive: ${err.message}`);
    }
  };

  const handleConvert = async () => {
    if (!entries.length || !file) return;
    setStatus('converting');
    setStatusMsg(`Converting archive to .${targetFormat}...`);

    try {
      const baseName = file.name.replace(/\.(zip|tar|tar\.gz|tgz)$/i, '');
      let outputBlob;
      let outFilename = `${baseName}.${targetFormat}`;

      if (targetFormat === 'zip') {
        const zip = await loadZipLib();
        zip.configure({ useWebWorkers: false });
        const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'), { level: 6 });
        for (const e of entries) {
          if (!e.dir) {
            await zipWriter.add(e.name, new zip.Uint8ArrayReader(e.data));
          }
        }
        outputBlob = await zipWriter.close();
      } else if (targetFormat === 'tar') {
        const tarBytes = tarCreate(entries);
        outputBlob = new Blob([tarBytes], { type: 'application/x-tar' });
      } else if (targetFormat === 'tar.gz') {
        const tarBytes = tarCreate(entries);
        const gzBytes = await streamThrough(tarBytes, CompressionStream);
        outputBlob = new Blob([gzBytes], { type: 'application/gzip' });
      }

      triggerDownload(outputBlob, outFilename);
      setStatus('ready');
      setStatusMsg(`✓ Converted and downloaded as ${outFilename} (${formatFileSize(outputBlob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Conversion failed: ${err.message}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setEntries([]);
    setStatus('idle');
    setStatusMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) handleSelectFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <FileArchive className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop ZIP, TAR, or TAR.GZ Archive</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert archives directly between formats in-memory with zero upload latency.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Select Archive
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.tar,.gz,.tgz"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Archive className="w-8 h-8 text-orange-400" />
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {entries.length} items · Original size: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                <span>Convert to:</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="bg-transparent text-orange-400 font-bold focus:outline-none uppercase"
                >
                  <option value="zip" className="bg-slate-900">ZIP (.zip)</option>
                  <option value="tar" className="bg-slate-900">TAR (.tar)</option>
                  <option value="tar.gz" className="bg-slate-900">TAR.GZ (.tar.gz)</option>
                </select>
              </div>

              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-orange-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                {status === 'converting' ? 'Converting...' : 'Convert & Download'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New
              </button>
            </div>
          </div>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            status === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {status === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
