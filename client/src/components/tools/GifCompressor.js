import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sliders, Play, Download, Sparkles, AlertCircle, Check, FileImage } from 'lucide-react';
import { loadGifEncLib, loadGifUctLib } from '../../lib/dynamicVendor';
import { validateImageFile, formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

export default function GifCompressor() {
  const [file, setFile] = useState(null);
  const [origBlobUrl, setOrigBlobUrl] = useState('');
  const [compBlobUrl, setCompBlobUrl] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [scale, setScale] = useState(80); // 10..100
  const [maxColors, setMaxColors] = useState(128); // 2..256
  const [everyN, setEveryN] = useState(1); // 1..4 (frame skip)
  const [speed, setSpeed] = useState(1); // 0.5..2
  const [bgColor, setBgColor] = useState('#000000');
  const [status, setStatus] = useState('idle'); // 'idle' | 'decoding' | 'compressing' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [compSize, setCompSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const origUrlRef = useRef('');
  const compUrlRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (origUrlRef.current) {
      URL.revokeObjectURL(origUrlRef.current);
      origUrlRef.current = '';
    }
    if (compUrlRef.current) {
      URL.revokeObjectURL(compUrlRef.current);
      compUrlRef.current = '';
    }
    setOrigBlobUrl('');
    setCompBlobUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = async (selectedFile) => {
    if (!selectedFile) return;
    cleanupUrls();
    setFile(null);
    setDecoded(null);
    setStatus('decoding');
    setStatusMsg(`Decoding animated GIF ${selectedFile.name}...`);

    const val = await validateImageFile(selectedFile, ['gif']);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }

    try {
      await loadGifUctLib();
      const gifuct = window.gifuct || window.GIF;
      const buffer = await selectedFile.arrayBuffer();
      const gif = gifuct.parseGIF(buffer);
      const frames = gifuct.decompressFrames(gif, true);

      if (!frames || !frames.length) {
        throw new Error('No valid frames found in GIF.');
      }

      const url = URL.createObjectURL(selectedFile);
      origUrlRef.current = url;
      setOrigBlobUrl(url);
      setFile(selectedFile);
      setDecoded({ frames, width: gif.lsd.width, height: gif.lsd.height });
      setStatus('idle');
      setStatusMsg(`Decoded ${frames.length} frames (${gif.lsd.width}×${gif.lsd.height}).`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to decode GIF: ${err.message}`);
    }
  };

  const planFrames = (frames, skip, spd) => {
    const keep = {};
    for (let k = 0; k < frames.length; k++) {
      if (k % skip === 0) {
        let d = frames[k].delay || 100;
        let j = k + 1;
        while (j < frames.length && j % skip !== 0) {
          d += frames[j].delay || 0;
          j++;
        }
        keep[k] = Math.max(20, Math.round(d / spd));
      }
    }
    return keep;
  };

  const handleCompress = async () => {
    if (!decoded || !file) return;
    setStatus('compressing');
    setProgress(0);
    setStatusMsg('Compressing frames...');

    try {
      const gifenc = await loadGifEncLib();
      const frames = decoded.frames;
      const lsdW = decoded.width;
      const lsdH = decoded.height;
      const outW = Math.max(1, Math.round((lsdW * scale) / 100));
      const outH = Math.max(1, Math.round((lsdH * scale) / 100));
      const keep = planFrames(frames, everyN, speed);
      const keptCount = Object.keys(keep).length;

      const main = document.createElement('canvas');
      main.width = lsdW;
      main.height = lsdH;
      const mctx = main.getContext('2d', { willReadFrequently: true });

      const temp = document.createElement('canvas');
      const tctx = temp.getContext('2d');

      const out = document.createElement('canvas');
      out.width = outW;
      out.height = outH;
      const octx = out.getContext('2d', { willReadFrequently: true });

      const encoder = gifenc.GIFEncoder();
      let pending = null;
      let encoded = 0;

      for (let i = 0; i < frames.length; i++) {
        const fr = frames[i];

        if (pending) {
          if (pending.type === 2) mctx.clearRect(pending.dims.left, pending.dims.top, pending.dims.width, pending.dims.height);
          else if (pending.type === 3 && pending.saved) mctx.putImageData(pending.saved, 0, 0);
        }

        const saved = fr.disposalType === 3 ? mctx.getImageData(0, 0, lsdW, lsdH) : null;

        temp.width = fr.dims.width;
        temp.height = fr.dims.height;
        tctx.putImageData(new ImageData(new Uint8ClampedArray(fr.patch), fr.dims.width, fr.dims.height), 0, 0);
        mctx.drawImage(temp, fr.dims.left, fr.dims.top);

        if (keep[i] != null) {
          octx.clearRect(0, 0, outW, outH);
          octx.fillStyle = bgColor;
          octx.fillRect(0, 0, outW, outH);
          octx.drawImage(main, 0, 0, lsdW, lsdH, 0, 0, outW, outH);

          const imgData = octx.getImageData(0, 0, outW, outH).data;
          const palette = gifenc.quantize(imgData, maxColors);
          const index = gifenc.applyPalette(imgData, palette);
          encoder.writeFrame(index, outW, outH, { palette, delay: keep[i], repeat: 0 });
          encoded++;
          setProgress(Math.round((encoded / keptCount) * 100));
        }

        pending = { type: fr.disposalType, dims: fr.dims, saved };
        // yield to main thread to keep UI reactive
        if (i % 3 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      encoder.finish();
      const outputBytes = encoder.bytes();
      const blob = new Blob([outputBytes], { type: 'image/gif' });

      if (compUrlRef.current) URL.revokeObjectURL(compUrlRef.current);
      const url = URL.createObjectURL(blob);
      compUrlRef.current = url;
      setCompBlobUrl(url);
      setCompSize(blob.size);

      // Clean up canvas references
      main.width = 0;
      main.height = 0;
      out.width = 0;
      out.height = 0;

      const savedPct = Math.round((1 - blob.size / file.size) * 100);
      setStatus('ready');
      setStatusMsg(
        savedPct > 0
          ? `✓ Compressed by ${savedPct}% (${formatFileSize(file.size)} → ${formatFileSize(blob.size)})`
          : `✓ Re-encoded GIF: ${formatFileSize(blob.size)}`
      );
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Compression failed: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!compBlobUrl || !file) return;
    const baseName = file.name.replace(/\.gif$/i, '');
    const a = document.createElement('a');
    a.href = compBlobUrl;
    a.download = `${baseName}_compressed.gif`;
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
          <FileImage className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop Animated GIF Here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Reduce GIF file size by scaling, color quantization, and frame optimization right in your browser.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Select GIF File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".gif,image/gif"
            onChange={(e) => e.target.files?.[0] && handleSelectFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Matrix */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {decoded?.width}×{decoded?.height} · {decoded?.frames.length} frames · {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  cleanupUrls();
                  setFile(null);
                  setDecoded(null);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Change GIF
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Scale Resolution</span>
                  <span className="text-orange-400 font-bold">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 h-2 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Palette Colors</span>
                  <span className="text-orange-400 font-bold">{maxColors}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="256"
                  step="8"
                  value={maxColors}
                  onChange={(e) => setMaxColors(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 h-2 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Frame Dropping</span>
                  <span className="text-orange-400 font-bold">
                    {everyN === 1 ? 'Keep all' : `Keep 1 in ${everyN}`}
                  </span>
                </div>
                <select
                  value={everyN}
                  onChange={(e) => setEveryN(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="1">Keep all frames</option>
                  <option value="2">Drop every 2nd frame (2x size drop)</option>
                  <option value="3">Drop 2 of every 3 frames</option>
                  <option value="4">Drop 3 of every 4 frames</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Playback Speed</span>
                  <span className="text-orange-400 font-bold">{speed}x</span>
                </div>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="0.75">0.75x (Slower)</option>
                  <option value="1">1.0x (Normal)</option>
                  <option value="1.25">1.25x (Faster)</option>
                  <option value="1.5">1.5x (Fast)</option>
                  <option value="2">2.0x (Double Speed)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompress}
                disabled={status === 'compressing'}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {status === 'compressing' ? `Compressing (${progress}%)...` : 'Compress GIF'}
              </button>
            </div>
          </div>

          {/* Side-by-side Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Original GIF ({formatFileSize(file.size)})
              </span>
              {origBlobUrl && (
                <img
                  src={origBlobUrl}
                  alt="Original GIF"
                  className="max-h-64 mx-auto rounded-xl border border-slate-800 object-contain"
                />
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Compressed GIF {compSize > 0 && `(${formatFileSize(compSize)})`}
              </span>
              {compBlobUrl ? (
                <div className="space-y-3">
                  <img
                    src={compBlobUrl}
                    alt="Compressed GIF"
                    className="max-h-64 mx-auto rounded-xl border border-slate-800 object-contain"
                  />
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Compressed GIF
                  </button>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-xl">
                  Click 'Compress GIF' to preview result
                </div>
              )}
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
