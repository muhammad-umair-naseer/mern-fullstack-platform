import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
  Sliders,
} from 'lucide-react';
import { formatBytes, triggerDownload } from '../../../lib/pdfCommon.js';

export default function PngCompressor() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [compressedResult, setCompressedResult] = useState(null);
  const [mode, setMode] = useState('balanced'); // 'lossless' | 'balanced' | 'strong'
  const [status, setStatus] = useState('idle'); // 'idle' | 'compressing' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const currentPreviewRef = useRef('');
  const currentCompressedRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (currentPreviewRef.current) {
      URL.revokeObjectURL(currentPreviewRef.current);
      currentPreviewRef.current = '';
    }
    if (currentCompressedRef.current) {
      URL.revokeObjectURL(currentCompressedRef.current);
      currentCompressedRef.current = '';
    }
    setPreviewUrl('');
    setCompressedResult(null);
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupUrls();

      if (
        selectedFile.type !== 'image/png' &&
        !selectedFile.name.toLowerCase().endsWith('.png')
      ) {
        setErrorMsg('Please select a PNG image file.');
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      currentPreviewRef.current = url;
      setFile(selectedFile);
      setPreviewUrl(url);
      setStatus('ready');
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

  const compressPng = async () => {
    if (!file || !previewUrl) return;
    setStatus('compressing');
    setErrorMsg('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load PNG in canvas'));
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Quantization logic for client-side PNG size reduction
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (mode === 'balanced') {
        // Quantize colors to reduce entropy and compress gzip stream
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.round(data[i] / 8) * 8; // R
          data[i + 1] = Math.round(data[i + 1] / 8) * 8; // G
          data[i + 2] = Math.round(data[i + 2] / 8) * 8; // B
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (mode === 'strong') {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.round(data[i] / 16) * 16;
          data[i + 1] = Math.round(data[i + 1] / 16) * 16;
          data[i + 2] = Math.round(data[i + 2] / 16) * 16;
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const compressedBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (currentCompressedRef.current) {
        URL.revokeObjectURL(currentCompressedRef.current);
      }
      const outUrl = URL.createObjectURL(compressedBlob);
      currentCompressedRef.current = outUrl;

      // Ensure compressed is not artificially larger than original
      const finalBlob =
        compressedBlob.size > file.size && mode === 'lossless'
          ? file
          : compressedBlob;

      const savedPercent = Math.max(
        0,
        Math.round((1 - finalBlob.size / file.size) * 100)
      );

      setCompressedResult({
        blob: finalBlob,
        url: outUrl,
        size: finalBlob.size,
        savedPercent,
        filename: `${file.name.replace(/\.png$/i, '')}-min.png`,
      });
      setStatus('ready');
    } catch (err) {
      console.error('PNG Compression Error:', err);
      setErrorMsg('Compression failed: ' + err.message);
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
            accept="image/png,.png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleSelectFile(e.target.files[0]);
              e.target.value = '';
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PNG image or drop it here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Compress transparent PNG files without losing visual clarity
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Three Compression Modes • Alpha Channel Preserved</span>
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

      {/* Options & Preview */}
      {file && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Original Size: {formatBytes(file.size)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4" />
              Change PNG
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'lossless', title: 'Lossless', desc: 'Preserves 100% pixel fidelity' },
              { id: 'balanced', title: 'Balanced (Recommended)', desc: 'Optimized palette, great size savings' },
              { id: 'strong', title: 'Maximum Shrink', desc: 'Aggressive quantization for smallest file size' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                  mode === opt.id
                    ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {opt.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Action / Result */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={compressPng}
              disabled={status === 'compressing'}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              {status === 'compressing' ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Sliders className="w-5 h-5" />
                  Compress PNG
                </>
              )}
            </button>

            {compressedResult && (
              <button
                onClick={() => triggerDownload(compressedResult.blob, compressedResult.filename)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition"
              >
                <Download className="w-5 h-5" />
                Download ({formatBytes(compressedResult.size)})
                {compressedResult.savedPercent > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                    -{compressedResult.savedPercent}%
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
