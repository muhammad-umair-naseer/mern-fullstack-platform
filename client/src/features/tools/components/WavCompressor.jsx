import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Volume2, Download, AlertCircle, Check} from 'lucide-react';
import { validateAudioFile, formatFileSize } from '../../../lib/fileValidation.js';

function readString(dv, off, len) {
  let s = '';
  for (let i = 0; i < len; i++) s += String.fromCharCode(dv.getUint8(off + i));
  return s;
}

function parseWav(arrayBuffer) {
  const dv = new DataView(arrayBuffer);
  if (readString(dv, 0, 4) !== 'RIFF' || readString(dv, 8, 4) !== 'WAVE') {
    throw new Error('Not a valid RIFF/WAVE file');
  }
  let off = 12;
  let fmt = null;
  let dataOff = -1;
  let dataLen = 0;
  while (off + 8 <= dv.byteLength) {
    const id = readString(dv, off, 4);
    const size = dv.getUint32(off + 4, true);
    const body = off + 8;
    if (id === 'fmt ') {
      fmt = {
        audioFormat: dv.getUint16(body, true),
        channels: dv.getUint16(body + 2, true),
        sampleRate: dv.getUint32(body + 4, true),
        bitsPerSample: dv.getUint16(body + 14, true),
      };
    } else if (id === 'data') {
      dataOff = body;
      dataLen = size;
    }
    off = body + size + (size & 1);
  }
  if (!fmt) throw new Error('Missing fmt chunk');
  if (dataOff < 0) throw new Error('Missing data chunk');
  if (dataLen > dv.byteLength - dataOff) dataLen = dv.byteLength - dataOff;

  const bytesPerSample = fmt.bitsPerSample / 8;
  const frameSize = bytesPerSample * fmt.channels;
  const frames = Math.floor(dataLen / frameSize);
  const isFloat = fmt.audioFormat === 3;

  function readSample(frame, ch) {
    const pos = dataOff + frame * frameSize + ch * bytesPerSample;
    if (fmt.bitsPerSample === 16) return dv.getInt16(pos, true) / 32768;
    if (fmt.bitsPerSample === 8) return (dv.getUint8(pos) - 128) / 128;
    if (fmt.bitsPerSample === 24) {
      const b0 = dv.getUint8(pos);
      const b1 = dv.getUint8(pos + 1);
      const b2 = dv.getUint8(pos + 2);
      let v = (b2 << 16) | (b1 << 8) | b0;
      if (v & 0x800000) v -= 0x1000000;
      return v / 8388608;
    }
    if (fmt.bitsPerSample === 32) {
      return isFloat ? dv.getFloat32(pos, true) : dv.getInt32(pos, true) / 2147483648;
    }
    throw new Error(`Unsupported bit depth: ${fmt.bitsPerSample}`);
  }

  return {
    sampleRate: fmt.sampleRate,
    channels: fmt.channels,
    bitsPerSample: fmt.bitsPerSample,
    frames,
    readSample,
    dataBytes: dataLen,
  };
}

function writeWavHeader(dv, rate, ch, bits, frames) {
  const bytesPer = bits / 8;
  const blockAlign = ch * bytesPer;
  const dataSize = frames * blockAlign;
  const writeStr = (off, s) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  dv.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); // PCM
  dv.setUint16(22, ch, true);
  dv.setUint32(24, rate, true);
  dv.setUint32(28, rate * blockAlign, true);
  dv.setUint16(32, blockAlign, true);
  dv.setUint16(34, bits, true);
  writeStr(36, 'data');
  dv.setUint32(40, dataSize, true);
}

function processWav(src, opts) {
  const outRate = opts.sampleRate || src.sampleRate;
  const outCh = opts.mono ? 1 : src.channels;
  const outBits = opts.bitDepth || 16;
  const srcCh = src.channels;
  const ratio = src.sampleRate / outRate;
  const outFrames = Math.max(1, Math.round(src.frames / ratio));

  function srcMixed(frame, ch) {
    if (opts.mono) {
      let sum = 0;
      for (let c = 0; c < srcCh; c++) sum += src.readSample(frame, c);
      return sum / srcCh;
    }
    return src.readSample(frame, ch < srcCh ? ch : srcCh - 1);
  }

  const bytesPer = outBits / 8;
  const out = new ArrayBuffer(44 + outFrames * outCh * bytesPer);
  const dv = new DataView(out);
  writeWavHeader(dv, outRate, outCh, outBits, outFrames);

  const downFactor = ratio > 1 ? Math.floor(ratio) : 1;
  let writePos = 44;

  for (let f = 0; f < outFrames; f++) {
    const srcPos = f * ratio;
    for (let ch = 0; ch < outCh; ch++) {
      let v;
      if (downFactor > 1) {
        let acc = 0;
        let cnt = 0;
        const startI = Math.floor(srcPos);
        for (let k = 0; k < downFactor; k++) {
          const idx = startI + k;
          if (idx < src.frames) {
            acc += srcMixed(idx, ch);
            cnt++;
          }
        }
        v = cnt ? acc / cnt : 0;
      } else {
        const i0 = Math.floor(srcPos);
        const i1 = Math.min(i0 + 1, src.frames - 1);
        const frac = srcPos - i0;
        v = srcMixed(i0, ch) * (1 - frac) + srcMixed(i1, ch) * frac;
      }

      v = Math.min(1, Math.max(-1, v));
      if (outBits === 16) dv.setInt16(writePos, Math.round(v * 32767), true);
      else if (outBits === 8) dv.setUint8(writePos, Math.round(v * 127) + 128);
      writePos += bytesPer;
    }
  }

  return new Blob([out], { type: 'audio/wav' });
}

export default function WavCompressor() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [targetRate, setTargetRate] = useState(22050);
  const [toMono, setToMono] = useState(true);
  const [bitDepth, setBitDepth] = useState(16);
  const [status, setStatus] = useState('idle'); // 'idle' | 'reading' | 'compressing' | 'ready' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [compBlobUrl, setCompBlobUrl] = useState('');
  const [compSize, setCompSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const compUrlRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (compUrlRef.current) {
      URL.revokeObjectURL(compUrlRef.current);
      compUrlRef.current = '';
    }
    setCompBlobUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = async (selectedFile) => {
    if (!selectedFile) return;
    cleanupUrls();
    setFile(null);
    setParsed(null);
    setStatus('reading');
    setStatusMsg(`Parsing WAV audio header ${selectedFile.name}...`);

    const val = await validateAudioFile(selectedFile, ['wav']);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const wav = parseWav(buffer);
      setParsed(wav);
      setFile(selectedFile);
      setTargetRate(Math.min(wav.sampleRate, 22050));
      setStatus('idle');
      setStatusMsg(`Loaded ${wav.sampleRate} Hz · ${wav.channels === 1 ? 'Mono' : 'Stereo'} · ${wav.bitsPerSample}-bit.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to parse WAV file: ${err.message}`);
    }
  };

  const handleCompress = () => {
    if (!parsed || !file) return;
    setStatus('compressing');
    setStatusMsg('Downsampling and compressing PCM data...');

    try {
      const blob = processWav(parsed, {
        sampleRate: Number(targetRate),
        mono: toMono,
        bitDepth: Number(bitDepth),
      });

      if (compUrlRef.current) URL.revokeObjectURL(compUrlRef.current);
      const url = URL.createObjectURL(blob);
      compUrlRef.current = url;
      setCompBlobUrl(url);
      setCompSize(blob.size);

      const saved = Math.round((1 - blob.size / file.size) * 100);
      setStatus('ready');
      setStatusMsg(
        saved > 0
          ? `✓ Compressed by ${saved}% (${formatFileSize(file.size)} → ${formatFileSize(blob.size)})`
          : `✓ Re-encoded WAV (${formatFileSize(blob.size)})`
      );
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Compression failed: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!compBlobUrl || !file) return;
    const baseName = file.name.replace(/\.wav$/i, '');
    const a = document.createElement('a');
    a.href = compBlobUrl;
    a.download = `${baseName}_compressed.wav`;
    document.body.appendChild(a);
    a.click();
    a.remove();
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
          <Volume2 className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop WAV Audio File Here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Losslessly compress WAV audio by lowering sample rate, mixing to mono, or reducing bit depth.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose WAV File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".wav,audio/wav,audio/x-wav"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {parsed?.sampleRate} Hz · {parsed?.channels === 1 ? 'Mono' : 'Stereo'} · {parsed?.bitsPerSample}-bit · {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  cleanupUrls();
                  setFile(null);
                  setParsed(null);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Change Audio
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Sample Rate</label>
                <select
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="8000">8,000 Hz (Voice / Smallest)</option>
                  <option value="11025">11,025 Hz (Low Quality)</option>
                  <option value="16000">16,000 Hz (Speech standard)</option>
                  <option value="22050">22,050 Hz (Balanced - Halved)</option>
                  <option value="32000">32,000 Hz (FM Quality)</option>
                  <option value="44100">44,100 Hz (CD Quality)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Channel Configuration</label>
                <select
                  value={toMono ? 'mono' : 'keep'}
                  onChange={(e) => setToMono(e.target.value === 'mono')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="mono">Mix to Mono (Cuts size 50%)</option>
                  <option value="keep">Keep Original Channels</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bit Depth</label>
                <select
                  value={bitDepth}
                  onChange={(e) => setBitDepth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="16">16-bit (Standard PCM)</option>
                  <option value="8">8-bit Unsigned (Cuts size 50%)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompress}
                disabled={status === 'compressing'}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4" />
                {status === 'compressing' ? 'Compressing WAV...' : 'Compress WAV Audio'}
              </button>
            </div>
          </div>

          {/* Player & Download */}
          {compBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Compressed Audio Preview ({formatFileSize(compSize)})
                </span>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download WAV
                </button>
              </div>
              <audio controls src={compBlobUrl} className="w-full rounded-xl bg-slate-900" />
            </div>
          )}
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
