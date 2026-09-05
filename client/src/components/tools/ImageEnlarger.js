import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  X,
} from 'lucide-react';
import { formatBytes, triggerDownload, yieldToMain } from '../../lib/pdfCommon';
import ImageEnlargerSeoArticle from './ImageEnlargerSeoArticle';

const MAX_PIXELS = 25000000; // 25 Megapixels output ceiling

// Apply local clarity / unsharp sharpening kernel on pixel data
function applyClarityFilter(ctx, width, height) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const src = new Uint8ClampedArray(imgData.data);
  const dst = imgData.data;
  const clamp = (v) => Math.max(0, Math.min(255, v));

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const top = idx - width * 4;
      const bot = idx + width * 4;
      const left = idx - 4;
      const right = idx + 4;

      for (let c = 0; c < 3; c++) {
        // 5*center - top - bot - left - right
        dst[idx + c] = clamp(
          src[idx + c] * 5 - src[top + c] - src[bot + c] - src[left + c] - src[right + c]
        );
      }
      dst[idx + 3] = src[idx + 3];
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

export default function ImageEnlarger() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(2); // 2x or 4x
  const [enhance, setEnhance] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'enlarging' | 'ready'
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const currentPreviewRef = useRef('');
  const currentResultRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (currentPreviewRef.current) {
      URL.revokeObjectURL(currentPreviewRef.current);
      currentPreviewRef.current = '';
    }
    if (currentResultRef.current) {
      URL.revokeObjectURL(currentResultRef.current);
      currentResultRef.current = '';
    }
    setPreviewUrl('');
    setResult(null);
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupUrls();

      if (!selectedFile.type.startsWith('image/')) {
        setErrorMsg('Please select an image file (JPG, PNG, WebP).');
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      currentPreviewRef.current = url;
      const img = new Image();
      img.onload = () => {
        setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
        setFile(selectedFile);
        setPreviewUrl(url);
        setStatus('ready');
      };
      img.onerror = () => {
        setErrorMsg('Failed to open image.');
      };
      img.src = url;
    },
    [cleanupUrls]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleSelectFile(dropped);
    },
    [handleSelectFile]
  );

  const processEnlarge = async () => {
    if (!file || !previewUrl) return;
    setStatus('enlarging');
    setErrorMsg('');
    await yieldToMain();

    try {
      const targetW = origDims.w * scale;
      const targetH = origDims.h * scale;

      if (targetW * targetH > MAX_PIXELS) {
        throw new Error(
          `Enlarged image (${targetW}×${targetH}px) exceeds the 25 megapixel output limit. Try 2× scaling, or crop the image first.`
        );
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      if (enhance) {
        applyClarityFilter(ctx, targetW, targetH);
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, format, 0.95)
      );

      if (currentResultRef.current) {
        URL.revokeObjectURL(currentResultRef.current);
      }
      const outUrl = URL.createObjectURL(blob);
      currentResultRef.current = outUrl;

      const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
      const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'upscaled';

      setResult({
        blob,
        url: outUrl,
        size: blob.size,
        w: targetW,
        h: targetH,
        filename: `${base}-${scale}x.${ext}`,
      });
      setStatus('ready');
    } catch (err) {
      console.error('Enlarge error:', err);
      setErrorMsg(err.message || 'Failed to enlarge image.');
      setStatus('ready');
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setFile(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Zone */}
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-orange-500/60 bg-white/60 dark:bg-slate-900/60 shadow-xl backdrop-blur-xl'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleSelectFile(e.target.files[0]);
              e.target.value = '';
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose an image to enlarge
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Upscale resolution 2× or 4× with optional edge enhancement
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Quality Resolution Upscaler • Crisp Edge Enhancement</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="ml-auto hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Settings & Processing */}
      {file && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Original: {origDims.w} × {origDims.h} px • {formatBytes(file.size)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4" />
              Change Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scale factor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Upscale Factor
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { factor: 2, label: '2× Upscale' },
                  { factor: 4, label: '4× Ultra' },
                ].map((s) => (
                  <button
                    key={s.factor}
                    onClick={() => setScale(s.factor)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition ${
                      scale === s.factor
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="image/png">PNG (Maximum Quality)</option>
                <option value="image/jpeg">JPG (Standard Web)</option>
                <option value="image/webp">WebP (Modern Compact)</option>
              </select>
            </div>

            {/* Clarity enhancement toggle */}
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={enhance}
                  onChange={(e) => setEnhance(e.target.checked)}
                  className="rounded accent-orange-500 w-4 h-4"
                />
                <span>Apply Clarity & Edge Filter</span>
              </label>
            </div>
          </div>

          {/* Action / Result */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={processEnlarge}
              disabled={status === 'enlarging'}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {status === 'enlarging'
                ? 'Upscaling Image...'
                : `Enlarge to ${origDims.w * scale} × ${origDims.h * scale} px`}
            </button>

            {result && (
              <button
                onClick={() => triggerDownload(result.blob, result.filename)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition"
              >
                <Download className="w-5 h-5" />
                Download Enlarged Image ({result.w}×{result.h}px • {formatBytes(result.size)})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <ImageEnlargerSeoArticle />
    </div>
  );
}
