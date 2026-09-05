import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Crop,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { triggerDownload } from '../../lib/pdfCommon';
import ImageCropperSeoArticle from './ImageCropperSeoArticle';

const MIN_CROP = 0.05;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageDims, setImageDims] = useState({ w: 0, h: 0 });
  const [cropRect, setCropRect] = useState({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }); // relative fractions 0..1
  const [aspect, setAspect] = useState('free');
  const [status, setStatus] = useState('idle'); // 'idle' | 'ready' | 'cropping'
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const currentPreviewRef = useRef('');
  const stageRef = useRef(null);
  const dragStateRef = useRef(null);

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
        setErrorMsg('Please select an image file (JPG, PNG, WebP).');
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      currentPreviewRef.current = url;
      const img = new Image();
      img.onload = () => {
        setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
        setFile(selectedFile);
        setPreviewUrl(url);
        setCropRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
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

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (newAspect === 'free') return;
    const [rw, rh] = newAspect.split(':').map(Number);
    const targetRatio = rw / rh;
    const imgRatio = imageDims.w / imageDims.h;

    setCropRect((cur) => {
      let w = cur.w;
      let h = (w * imgRatio) / targetRatio;
      if (h > 0.95) {
        h = 0.95;
        w = (h * targetRatio) / imgRatio;
      }
      return {
        x: clamp(cur.x, 0, 1 - w),
        y: clamp(cur.y, 0, 1 - h),
        w: clamp(w, MIN_CROP, 1),
        h: clamp(h, MIN_CROP, 1),
      };
    });
  };

  // Pointer drag for moving / resizing crop box
  const onPointerDown = (e, mode) => {
    e.stopPropagation();
    e.preventDefault();
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    dragStateRef.current = {
      mode,
      startX: (e.clientX - rect.left) / rect.width,
      startY: (e.clientY - rect.top) / rect.height,
      startRect: { ...cropRect },
    };

    const onPointerMove = (moveEv) => {
      if (!dragStateRef.current || !stageRef.current) return;
      const stageBound = stageRef.current.getBoundingClientRect();
      const currentX = (moveEv.clientX - stageBound.left) / stageBound.width;
      const currentY = (moveEv.clientY - stageBound.top) / stageBound.height;
      const dx = currentX - dragStateRef.current.startX;
      const dy = currentY - dragStateRef.current.startY;
      const sr = dragStateRef.current.startRect;

      if (dragStateRef.current.mode === 'move') {
        const nextX = clamp(sr.x + dx, 0, 1 - sr.w);
        const nextY = clamp(sr.y + dy, 0, 1 - sr.h);
        setCropRect({ ...sr, x: nextX, y: nextY });
      } else if (dragStateRef.current.mode === 'se') {
        const nextW = clamp(sr.w + dx, MIN_CROP, 1 - sr.x);
        const nextH = clamp(sr.h + dy, MIN_CROP, 1 - sr.y);
        setCropRect({ ...sr, w: nextW, h: nextH });
      } else if (dragStateRef.current.mode === 'nw') {
        const nextX = clamp(sr.x + dx, 0, sr.x + sr.w - MIN_CROP);
        const nextY = clamp(sr.y + dy, 0, sr.y + sr.h - MIN_CROP);
        const nextW = sr.w + (sr.x - nextX);
        const nextH = sr.h + (sr.y - nextY);
        setCropRect({ x: nextX, y: nextY, w: nextW, h: nextH });
      }
    };

    const onPointerUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const cropAndDownload = async () => {
    if (!file || !previewUrl) return;
    setStatus('cropping');
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = previewUrl;
      });

      const srcX = Math.round(cropRect.x * img.naturalWidth);
      const srcY = Math.round(cropRect.y * img.naturalHeight);
      const srcW = Math.round(cropRect.w * img.naturalWidth);
      const srcH = Math.round(cropRect.h * img.naturalHeight);

      const canvas = document.createElement('canvas');
      canvas.width = srcW;
      canvas.height = srcH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

      const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, format, 0.95));

      const ext = format === 'image/png' ? 'png' : 'jpg';
      const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'cropped';
      triggerDownload(blob, `${base}-cropped.${ext}`);
      setStatus('ready');
    } catch (err) {
      console.error('Crop error:', err);
      setErrorMsg('Failed to crop image: ' + err.message);
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
    <div className="w-full max-w-5xl mx-auto space-y-8">
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
              <Crop className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose an image to crop
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Interactive drag-and-drop crop with aspect ratio presets
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Definition Precision Cropping Engine</span>
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

      {/* Interactive Crop Workspace */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Area */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center">
            <div
              ref={stageRef}
              className="relative max-h-[500px] max-w-full inline-block rounded-xl overflow-hidden shadow-inner select-none touch-none"
            >
              <img
                src={previewUrl}
                alt="Crop preview"
                className="max-h-[500px] max-w-full block object-contain pointer-events-none"
              />

              {/* Crop Box Window */}
              <div
                style={{
                  top: `${cropRect.y * 100}%`,
                  left: `${cropRect.x * 100}%`,
                  width: `${cropRect.w * 100}%`,
                  height: `${cropRect.h * 100}%`,
                }}
                onPointerDown={(e) => onPointerDown(e, 'move')}
                className="absolute border-2 border-orange-500 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] cursor-move transition-all duration-75"
              >
                {/* NW Resize handle */}
                <div
                  onPointerDown={(e) => onPointerDown(e, 'nw')}
                  className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-orange-500 rounded-full cursor-nwse-resize shadow"
                />
                {/* SE Resize handle */}
                <div
                  onPointerDown={(e) => onPointerDown(e, 'se')}
                  className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full cursor-nwse-resize shadow"
                />
                {/* Inner Rule-of-Thirds Grid */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-white/60" />
                  <div className="border-r border-white/60" />
                  <div />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Drag inside the box to reposition. Drag corner handles to resize.
            </p>
          </div>

          {/* Right Controls */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">Crop Settings</h4>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold"
                >
                  Change Image
                </button>
              </div>

              {/* Aspect Ratio Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'free', label: 'Free Form' },
                    { id: '1:1', label: '1:1 Square' },
                    { id: '4:3', label: '4:3 Photo' },
                    { id: '16:9', label: '16:9 Widescreen' },
                    { id: '9:16', label: '9:16 Story/Reel' },
                    { id: '3:2', label: '3:2 Standard' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAspectChange(item.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        aspect === item.id
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Stats */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Output Area:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">
                    {Math.round(cropRect.w * imageDims.w)} × {Math.round(cropRect.h * imageDims.h)} px
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Original:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">
                    {imageDims.w} × {imageDims.h} px
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={cropAndDownload}
              disabled={status === 'cropping'}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {status === 'cropping' ? 'Cropping...' : 'Download Cropped Image'}
            </button>
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <ImageCropperSeoArticle />
    </div>
  );
}
