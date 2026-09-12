import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Scaling,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  X,
  Lock,
  Unlock,
} from 'lucide-react';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';

const PRESETS = [
  { label: 'Original', w: 0, h: 0 },
  { label: 'Instagram Post (1080×1080)', w: 1080, h: 1080 },
  { label: 'Instagram Story (1080×1920)', w: 1080, h: 1920 },
  { label: 'YouTube Thumbnail (1280×720)', w: 1280, h: 720 },
  { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
];

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState('idle'); // 'idle' | 'resizing' | 'ready'
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const currentPreviewRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (currentPreviewRef.current) {
      URL.revokeObjectURL(currentPreviewRef.current);
      currentPreviewRef.current = '';
    }
    setPreviewUrl('');
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
        setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      currentPreviewRef.current = url;
      const img = new Image();
      img.onload = () => {
        setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setFile(selectedFile);
        setPreviewUrl(url);
        setStatus('ready');
      };
      img.onerror = () => {
        setErrorMsg('Failed to read image.');
      };
      img.src = url;
    },
    [cleanupUrls]
  );

  const handleWidthChange = (val) => {
    const newW = Math.max(1, Math.min(10000, Number(val) || 1));
    setWidth(newW);
    if (lockRatio && originalDims.w > 0) {
      const ratio = originalDims.h / originalDims.w;
      setHeight(Math.round(newW * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const newH = Math.max(1, Math.min(10000, Number(val) || 1));
    setHeight(newH);
    if (lockRatio && originalDims.h > 0) {
      const ratio = originalDims.w / originalDims.h;
      setWidth(Math.round(newH * ratio));
    }
  };

  const applyPreset = (p) => {
    if (p.w === 0) {
      setWidth(originalDims.w);
      setHeight(originalDims.h);
    } else {
      setWidth(p.w);
      setHeight(p.h);
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleSelectFile(dropped);
    },
    [handleSelectFile]
  );

  const resizeAndDownload = async () => {
    if (!file || !previewUrl) return;
    setStatus('resizing');
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, format, quality / 100)
      );

      const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
      const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
      triggerDownload(blob, `${base}-${width}x${height}.${ext}`);
      setStatus('ready');
    } catch (err) {
      console.error('Resize error:', err);
      setErrorMsg('Failed to resize image: ' + err.message);
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
              <Scaling className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose an image to resize
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Change width, height, aspect ratio and format, with sharp results at any size
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Fidelity Resizing • PNG, JPG and WebP Output</span>
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

      {/* Configuration & Preview */}
      {file && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Original: {originalDims.w} × {originalDims.h} px • {formatBytes(file.size)}
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

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quick Dimensions Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Width / Height inputs with lock button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Width (pixels)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Height (pixels)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 sm:pt-0">
              <button
                onClick={() => setLockRatio(!lockRatio)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-xs font-semibold transition ${
                  lockRatio
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>Maintain Aspect Ratio</span>
              </button>
            </div>
          </div>

          {/* Format & Quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="image/jpeg">JPG (Standard Web)</option>
                <option value="image/png">PNG (Lossless Transparency)</option>
                <option value="image/webp">WebP (Modern Compact)</option>
              </select>
            </div>

            {format !== 'image/png' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Quality</span>
                  <span className="font-mono text-orange-500">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-orange-500 mt-2"
                />
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={resizeAndDownload}
              disabled={status === 'resizing'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {status === 'resizing' ? 'Resizing...' : `Download Resized Image (${width}×${height})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
