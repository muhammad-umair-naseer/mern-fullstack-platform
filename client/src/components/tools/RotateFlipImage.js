import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  FlipVertical2,
  Download,
  AlertCircle,
  ShieldCheck,
  X,
  Undo2,
} from 'lucide-react';
import { triggerDownload } from '../../lib/pdfCommon';

/**
 * Rotate an image by 90° steps or a free angle, and flip it horizontally or
 * vertically. Every change previews live; the download is rendered from the
 * original pixels, not the preview, so nothing is resampled twice.
 *
 * Output format follows the input (PNG stays PNG with transparency; JPEG and
 * WebP keep their type; anything else becomes PNG). A free-angle rotation
 * enlarges the canvas to fit the whole picture and fills the corners with a
 * chosen colour, or leaves them transparent for PNG/WebP.
 */
const FORMATS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

export default function RotateFlipImage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [angle, setAngle] = useState(0); // degrees, clockwise
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [fill, setFill] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const outType = FORMATS[file?.type] ? file.type : 'image/png';
  const canBeTransparent = outType !== 'image/jpeg';

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const handleSelectFile = useCallback(
    (selected) => {
      if (!selected) return;
      if (!selected.type.startsWith('image/')) {
        setErrorMsg('Please choose an image file (PNG, JPG, WebP, GIF, BMP…).');
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setDims({ w: img.naturalWidth, h: img.naturalHeight });
        setFile(selected);
        setPreviewUrl(url);
        setAngle(0);
        setFlipH(false);
        setFlipV(false);
        setErrorMsg('');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setErrorMsg('That file could not be opened as an image.');
      };
      img.src = url;
    },
    [previewUrl]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleSelectFile(e.dataTransfer.files?.[0]);
  };

  // Output size: a 90°-step rotation swaps width and height; any other angle
  // needs the bounding box of the rotated rectangle.
  const rad = (angle * Math.PI) / 180;
  const outW = Math.round(Math.abs(dims.w * Math.cos(rad)) + Math.abs(dims.h * Math.sin(rad)));
  const outH = Math.round(Math.abs(dims.w * Math.sin(rad)) + Math.abs(dims.h * Math.cos(rad)));
  const changed = angle % 360 !== 0 || flipH || flipV;

  const render = () => {
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!(transparent && canBeTransparent)) {
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, outW, outH);
    }
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -dims.w / 2, -dims.h / 2);
    return canvas;
  };

  const download = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const canvas = render();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.92));
      if (!blob) throw new Error('The image could not be encoded.');
      const base = file.name.replace(/\.[^.]+$/, '') || 'image';
      const tag = [angle % 360 ? `rot${((angle % 360) + 360) % 360}` : '', flipH ? 'fliph' : '', flipV ? 'flipv' : '']
        .filter(Boolean)
        .join('-') || 'copy';
      triggerDownload(blob, `${base}-${tag}.${FORMATS[outType]}`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl('');
    imgRef.current = null;
    setErrorMsg('');
  };

  const previewStyle = {
    transform: `rotate(${angle}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
    transition: 'transform 200ms ease',
    maxWidth: '100%',
    maxHeight: '60vh',
  };

  const Btn = ({ onClick, icon: Icon, label, active }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition ${
        active
          ? 'bg-orange-500 border-orange-500 text-white shadow-md'
          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-orange-400'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
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
              handleSelectFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25">
              <RotateCw className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose an image to rotate or flip</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Turn it by 90°, 180° or any angle; mirror it left-right or top-bottom
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Original pixels, original format, nothing retained</span>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="ml-auto hover:opacity-75" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[320px] overflow-hidden">
            <img src={previewUrl} alt="Preview" style={previewStyle} className="rounded-lg shadow" />
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {dims.w} × {dims.h} px → {outW} × {outH} px
            </p>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Rotate</p>
                <div className="grid grid-cols-2 gap-2">
                  <Btn onClick={() => setAngle((a) => a - 90)} icon={RotateCcw} label="90° left" />
                  <Btn onClick={() => setAngle((a) => a + 90)} icon={RotateCw} label="90° right" />
                </div>
                <label className="block mt-3 text-xs text-slate-600 dark:text-slate-300">
                  Fine angle: <strong>{((angle % 360) + 360) % 360}°</strong>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={((angle + 180) % 360 + 360) % 360 - 180}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full mt-1 accent-orange-500"
                  />
                </label>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Flip</p>
                <div className="grid grid-cols-2 gap-2">
                  <Btn onClick={() => setFlipH((v) => !v)} icon={FlipHorizontal2} label="Horizontal" active={flipH} />
                  <Btn onClick={() => setFlipV((v) => !v)} icon={FlipVertical2} label="Vertical" active={flipV} />
                </div>
              </div>
              {angle % 90 !== 0 && (
                <div className="pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Corners</p>
                  {canBeTransparent && (
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-orange-500" />
                      Keep corners transparent
                    </label>
                  )}
                  {!(transparent && canBeTransparent) && (
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 mt-2">
                      Fill colour
                      <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} className="h-8 w-12 rounded border border-slate-300" />
                    </label>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={download}
                disabled={busy || !changed}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg transition"
              >
                <Download className="w-5 h-5" />
                {busy ? 'Rendering…' : `Download ${FORMATS[outType].toUpperCase()}`}
              </button>
              <button
                onClick={() => {
                  setAngle(0);
                  setFlipH(false);
                  setFlipV(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Undo2 className="w-4 h-4" /> Undo all changes
              </button>
              <button onClick={reset} className="w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1">
                Choose a different image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
