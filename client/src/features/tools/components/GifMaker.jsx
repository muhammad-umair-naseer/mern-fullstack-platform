import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Download, Sparkles, AlertCircle, Check, Film } from 'lucide-react';
import { loadGifEncLib } from '../../../lib/dynamicVendor.js';
import { formatFileSize } from '../../../lib/fileValidation.js';

export default function GifMaker() {
  const [frames, setFrames] = useState([]); // array of { url, img, name, size }
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(320);
  const [delay, setDelay] = useState(250); // ms
  const [fit, setFit] = useState('contain'); // 'contain' | 'cover' | 'stretch'
  const [bgColor] = useState('#000000');
  const [maxColors, setMaxColors] = useState(256);
  const [loop, setLoop] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle' | 'building' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const resultUrlRef = useRef('');

  const cleanupFrames = useCallback(() => {
    frames.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
    });
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
  }, [frames]);

  useEffect(() => {
    return () => cleanupFrames();
  }, [cleanupFrames]);

  const handleAddFiles = (fileList) => {
    if (!fileList || !fileList.length) return;
    const imgFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!imgFiles.length) return;

    imgFiles.forEach((f) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        setFrames((prev) => {
          const next = [...prev, { url, img, name: f.name, size: f.size }];
          if (prev.length === 0) {
            setWidth(img.naturalWidth || 480);
            setHeight(img.naturalHeight || 320);
          }
          return next;
        });
      };
      img.src = url;
    });
  };

  const handleMove = (idx, direction) => {
    setFrames((prev) => {
      const next = [...prev];
      const target = idx + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[target];
      next[target] = tmp;
      return next;
    });
  };

  const handleRemove = (idx) => {
    setFrames((prev) => {
      const target = prev[idx];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const drawFrame = (ctx, img, W, H, fitMode, bg) => {
    ctx.clearRect(0, 0, W, H);
    if (fitMode !== 'stretch') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (fitMode === 'stretch') {
      ctx.drawImage(img, 0, 0, W, H);
      return;
    }
    const scale = fitMode === 'cover' ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  };

  const handleCreateGif = async () => {
    if (!frames.length) return;
    setStatus('building');
    setProgress(0);
    setStatusMsg(`Encoding ${frames.length} frames into GIF...`);

    try {
      const gifenc = await loadGifEncLib();
      const W = Math.max(1, width);
      const H = Math.max(1, height);

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const encoder = gifenc.GIFEncoder();

      for (let i = 0; i < frames.length; i++) {
        drawFrame(ctx, frames[i].img, W, H, fit, bgColor);
        const imgData = ctx.getImageData(0, 0, W, H).data;
        const palette = gifenc.quantize(imgData, maxColors);
        const index = gifenc.applyPalette(imgData, palette);
        encoder.writeFrame(index, W, H, {
          palette,
          delay: Math.max(20, delay),
          repeat: loop ? 0 : -1,
        });

        setProgress(Math.round(((i + 1) / frames.length) * 100));
        await new Promise((r) => setTimeout(r, 0));
      }

      encoder.finish();
      const bytes = encoder.bytes();
      const blob = new Blob([bytes], { type: 'image/gif' });

      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlobUrl(url);
      setResultSize(blob.size);

      // Free canvas
      canvas.width = 0;
      canvas.height = 0;

      setStatus('ready');
      setStatusMsg(`✓ Created animation.gif (${formatFileSize(blob.size)}) with ${frames.length} frames.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to build GIF: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = 'animated.gif';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files?.length) handleAddFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
          isDragOver
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <Film className="w-10 h-10 text-orange-400 mx-auto mb-2 animate-pulse" />
        <h4 className="text-sm font-bold text-slate-100">Drop images here to create an animated GIF</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Add JPG, PNG, or WebP images, reorder frames, and customize timing and size.
        </p>

        <div className="mt-3 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Images
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleAddFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Frame Gallery / Reorder */}
      {frames.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>{frames.length} Frame(s) Selected</span>
            <button
              onClick={() => {
                cleanupFrames();
                setFrames([]);
                setResultBlobUrl('');
              }}
              className="text-rose-400 hover:text-rose-300 font-medium"
            >
              Clear Frames
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto p-2 bg-slate-950/70 rounded-2xl border border-slate-800 custom-scrollbar">
            {frames.map((fr, idx) => (
              <div
                key={idx}
                className="relative w-24 h-28 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-between p-1.5 shrink-0 group"
              >
                <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-orange-400">
                  #{idx + 1}
                </span>
                <img src={fr.url} alt={`Frame ${idx + 1}`} className="w-full h-16 object-contain rounded-lg mt-1" />
                <div className="flex items-center justify-between w-full gap-1 pt-1">
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px]"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-500 text-[10px]"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === frames.length - 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px]"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Settings Matrix */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Animation Properties</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Dimensions (W × H)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-center text-slate-200"
                  />
                  <span className="text-slate-500">×</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-center text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Frame Delay (ms)</label>
                <input
                  type="number"
                  step="50"
                  min="20"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image Fit</label>
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  <option value="contain">Contain (Letterbox)</option>
                  <option value="cover">Cover (Crop)</option>
                  <option value="stretch">Stretch to Fit</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Colors</label>
                <select
                  value={maxColors}
                  onChange={(e) => setMaxColors(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  <option value="64">64 (Compact)</option>
                  <option value="128">128 (Balanced)</option>
                  <option value="256">256 (High Quality)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-orange-500 focus:ring-orange-500"
                />
                Loop Animation Forever
              </label>

              <button
                onClick={handleCreateGif}
                disabled={status === 'building'}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {status === 'building' ? `Building GIF (${progress}%)...` : 'Generate Animated GIF'}
              </button>
            </div>
          </div>

          {/* Generated Result Preview */}
          {resultBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Generated GIF Preview ({width}×{height} · {formatFileSize(resultSize)})
              </span>
              <img
                src={resultBlobUrl}
                alt="Generated Animated GIF"
                className="max-h-72 mx-auto rounded-2xl border border-slate-800 object-contain shadow-2xl"
              />
              <div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Animated GIF
                </button>
              </div>
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
