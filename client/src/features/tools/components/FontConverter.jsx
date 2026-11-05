import React, { useState, useRef } from 'react';
import { Type, Download, AlertCircle, Check} from 'lucide-react';
import { loadOpenTypeLib } from '../../../lib/dynamicVendor.js';
import { formatFileSize } from '../../../lib/fileValidation.js';
import { triggerDownload } from '../../../lib/pdfCommon.js';

function u32(b, o) {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
}
function u16(b, o) {
  return (b[o] << 8) | b[o + 1];
}
function tag(b, o) {
  return String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
}
function pad4(n) {
  return (n + 3) & ~3;
}
function w32(b, o, v) {
  b[o] = v >>> 24;
  b[o + 1] = (v >>> 16) & 255;
  b[o + 2] = (v >>> 8) & 255;
  b[o + 3] = v & 255;
}
function w16(b, o, v) {
  b[o] = (v >>> 8) & 255;
  b[o + 1] = v & 255;
}
function wtag(b, o, t) {
  for (let i = 0; i < 4; i++) b[o + i] = t.charCodeAt(i);
}

function detectFont(b) {
  const t = tag(b, 0);
  if (t === 'wOFF') return 'woff';
  if (t === 'wOF2') return 'woff2';
  if (t === 'OTTO') return 'otf';
  if (t === 'true' || u32(b, 0) === 0x00010000) return 'ttf';
  return 'unknown';
}

function parseSfnt(b) {
  const flavor = u32(b, 0);
  const n = u16(b, 4);
  if (n > 256 || 12 + n * 16 > b.length) throw new Error('Invalid font directory');
  const tables = [];
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16;
    tables.push({
      tag: tag(b, o),
      checksum: u32(b, o + 4),
      offset: u32(b, o + 8),
      length: u32(b, o + 12),
    });
  }
  tables.forEach((t) => {
    if (t.offset + t.length > b.length) throw new Error('Truncated font table');
    t.data = b.subarray(t.offset, t.offset + t.length);
  });
  return { flavor, tables };
}

function buildSfnt(flavor, tables) {
  const n = tables.length;
  const sorted = tables.slice().sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  const dirSize = 12 + 16 * n;
  let total = dirSize;
  sorted.forEach((t) => {
    total += pad4(t.data.length);
  });
  const out = new Uint8Array(total);
  let es = 1;
  let sr = 16;
  while (es * 2 <= n) {
    es *= 2;
    sr *= 2;
  }
  const log2 = Math.round(Math.log(es) / Math.LN2);
  w32(out, 0, flavor);
  w16(out, 4, n);
  w16(out, 6, sr);
  w16(out, 8, log2);
  w16(out, 10, n * 16 - sr);
  let off = dirSize;
  sorted.forEach((t, i) => {
    const d = 12 + i * 16;
    wtag(out, d, t.tag);
    w32(out, d + 4, t.checksum);
    w32(out, d + 8, off);
    w32(out, d + 12, t.data.length);
    out.set(t.data, off);
    off += pad4(t.data.length);
  });
  return out;
}

async function streamCompress(bytes, Ctor) {
  const s = new Ctor('deflate');
  const w = s.writable.getWriter();
  w.write(bytes);
  w.close();
  const r = s.readable.getReader();
  const parts = [];
  let len = 0;
  while (true) {
    const { done, value } = await r.read();
    if (done) break;
    parts.push(value);
    len += value.length;
    if (len > 32 * 1024 * 1024) { await r.cancel(); throw new Error('Expanded font exceeds 32 MB.'); }
  }
  const out = new Uint8Array(len);
  let p = 0;
  parts.forEach((c) => {
    out.set(c, p);
    p += c.length;
  });
  return out;
}

async function woffEncode(sfntBytes) {
  const f = parseSfnt(sfntBytes);
  const n = f.tables.length;
  const compList = await Promise.all(
    f.tables.map(async (t) => {
      try {
        const c = await streamCompress(t.data, CompressionStream);
        return c.length < t.data.length ? c : t.data;
      } catch (e) {
        return t.data;
      }
    })
  );

  const sorted = f.tables.map((t, i) => ({ t, c: compList[i] })).sort((a, b) => (a.t.tag < b.t.tag ? -1 : 1));
  const dir = 44 + 20 * n;
  let total = dir;
  let sfntSize = 12 + 16 * n;
  sorted.forEach((e) => {
    total += pad4(e.c.length);
    sfntSize += pad4(e.t.data.length);
  });

  const out = new Uint8Array(total);
  wtag(out, 0, 'wOFF');
  w32(out, 4, f.flavor);
  w32(out, 8, total);
  w16(out, 12, n);
  w32(out, 16, sfntSize);
  w16(out, 20, 1);
  w16(out, 22, 0);

  let off = dir;
  sorted.forEach((e, i) => {
    const d = 44 + 20 * i;
    wtag(out, d, e.t.tag);
    w32(out, d + 4, off);
    w32(out, d + 8, e.c.length);
    w32(out, d + 12, e.t.data.length);
    w32(out, d + 16, e.t.checksum);
    out.set(e.c, off);
    off += pad4(e.c.length);
  });
  return out;
}

async function woffDecode(b) {
  if (tag(b, 0) !== 'wOFF') throw new Error('Not a WOFF file');
  const flavor = u32(b, 4);
  const n = u16(b, 12);
  if (n > 256 || 44 + n * 20 > b.length || u32(b,16) > 64 * 1024 * 1024) throw new Error('Invalid or oversized WOFF directory');
  const entries = [];
  for (let i = 0; i < n; i++) {
    const d = 44 + 20 * i;
    entries.push({
      tag: tag(b, d),
      offset: u32(b, d + 4),
      compLength: u32(b, d + 8),
      origLength: u32(b, d + 12),
      checksum: u32(b, d + 16),
    });
  }

  const tables = await Promise.all(
    entries.map(async (e) => {
      if (e.origLength > 32 * 1024 * 1024 || e.offset + e.compLength > b.length) throw new Error('Invalid or oversized font table');
      const raw = b.subarray(e.offset, e.offset + e.compLength);
      const data = e.compLength < e.origLength ? await streamCompress(raw, DecompressionStream) : raw.slice();
      if (data.length !== e.origLength) throw new Error('Font table size mismatch');
      return { tag: e.tag, checksum: e.checksum, data };
    })
  );

  return { flavor, bytes: buildSfnt(flavor, tables) };
}

export default function FontConverter() {
  const [file, setFile] = useState(null);
  const [detectedType, setDetectedType] = useState('');
  const [targetType, setTargetType] = useState('woff'); // 'woff' | 'ttf' | 'otf'
  const [fontInfo, setFontInfo] = useState(null);
  const [previewText, setPreviewText] = useState('Sphinx of black quartz, judge my vow 1234567890');
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleSelectFile = async (f) => {
    if (!f) return;
    setDetectedType('unknown');
    setFile(f);
    setStatus('loading');
    setStatusMsg(`Inspecting font ${f.name}...`);

    try {
      const buffer = await f.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const kind = detectFont(bytes);
      if (kind === 'woff2' || kind === 'unknown') throw new Error('Unsupported font. Choose a valid TTF, OTF or WOFF 1 file. WOFF2 decoding is unavailable.');
      setDetectedType(kind);

      if (kind === 'woff') setTargetType('ttf');
      else setTargetType('woff');

      try {
        const opentype = await loadOpenTypeLib();
        if (opentype) {
          const font = opentype.parse(buffer);
          setFontInfo({
            name: font.names?.fullName?.en || font.names?.fontFamily?.en || f.name,
            glyphs: font.numGlyphs || font.glyphs?.length || 0,
            weight: font.names?.fontSubfamily?.en || 'Regular',
          });
        }
      } catch (e) {
        setFontInfo({ name: f.name, glyphs: 'N/A', weight: 'Standard' });
      }

      setStatus('ready');
      setStatusMsg(`Detected format: ${kind.toUpperCase()} (${formatFileSize(f.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Could not parse font: ${err.message}`);
    }
  };

  const handleConvert = async () => {
    if (!file || !['ttf','otf','woff'].includes(detectedType)) return;
    setStatus('converting');
    setStatusMsg(`Converting font to .${targetType}...`);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      let outputBlob = null;
      let outExt = targetType;

      if (targetType === 'woff') {
        let sfnt = bytes;
        if (detectedType === 'woff') {
          const decoded = await woffDecode(bytes);
          sfnt = decoded.bytes;
        }
        const woff = await woffEncode(sfnt);
        outputBlob = new Blob([woff], { type: 'font/woff' });
      } else {
        // Converting from WOFF to TTF/OTF
        if (detectedType === 'woff') {
          const decoded = await woffDecode(bytes);
          const isOtf = decoded.flavor === 0x4f54544f;
          outExt = isOtf ? 'otf' : 'ttf';
          outputBlob = new Blob([decoded.bytes], { type: isOtf ? 'font/otf' : 'font/ttf' });
        } else {
          // TTF <-> OTF repack
          const opentype = await loadOpenTypeLib();
          const font = opentype.parse(buffer);
          const outArr = font.toArrayBuffer();
          outExt = detectFont(new Uint8Array(outArr));
          if (!['otf','ttf'].includes(outExt)) throw new Error('Font encoder returned an invalid format.');
          outputBlob = new Blob([outArr], { type: 'font/' + outExt });
        }
      }

      triggerDownload(outputBlob, `${baseName}.${outExt}`);
      setStatus('ready');
      setStatusMsg(`✓ Converted to .${outExt} (${formatFileSize(outputBlob.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Font conversion failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <Type className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Upload Font (TTF, OTF, WOFF)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Losslessly repack web fonts between TTF, OTF, and WOFF 1.0 with zero server uploads.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Font File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{fontInfo?.name || file.name}</h4>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} · Type: {detectedType.toUpperCase()} {fontInfo?.glyphs && `· ${fontInfo.glyphs} glyphs`}
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-white">
                Change Font
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Convert to Format</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="woff">WOFF 1.0 (Web Font - Compressed)</option>
                  <option value="ttf">TTF (TrueType Font)</option>
                  <option value="otf">OTF (OpenType Font)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Custom Preview Sample</label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Visual Sample Preview */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Typography Preview</span>
              <p className="text-lg text-slate-100 font-serif tracking-wide">{previewText}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {status === 'converting' ? 'Converting Font...' : `Convert & Download .${targetType}`}
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
