import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pipette,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import ColourPickerSeoArticle from './ColourPickerSeoArticle';

const toHex = (v) => v.toString(16).padStart(2, '0').toUpperCase();
const hexFromRgb = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

const hslFromRgb = (r, g, b) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      default:
        h = (red - green) / d + 4;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export default function ColourPicker() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pickedColor, setPickedColor] = useState({
    r: 249,
    g: 115,
    b: 22,
    hex: '#F97316',
    rgb: 'rgb(249, 115, 22)',
    hsl: 'hsl(25, 95%, 53%)',
  });
  const [history, setHistory] = useState([]);
  const [copiedFormat, setCopiedFormat] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
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
        setErrorMsg('Please select an image file.');
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      currentPreviewRef.current = url;
      const img = new Image();
      img.onload = () => {
        setFile(selectedFile);
        setPreviewUrl(url);

        // Draw image onto interactive hidden sampling canvas
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);

          // Sample center pixel by default
          const centerX = Math.floor(img.naturalWidth / 2);
          const centerY = Math.floor(img.naturalHeight / 2);
          samplePixel(centerX, centerY, ctx);
        }
      };
      img.onerror = () => {
        setErrorMsg('Failed to open image.');
      };
      img.src = url;
    },
    [cleanupUrls]
  );

  const samplePixel = (x, y, ctx) => {
    if (!ctx) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    }
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const colorObj = {
      r,
      g,
      b,
      hex: hexFromRgb(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: hslFromRgb(r, g, b),
    };
    setPickedColor(colorObj);
    setHistory((prev) => [colorObj, ...prev.filter((c) => c.hex !== colorObj.hex)].slice(0, 10));
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = e.target.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = Math.floor((e.clientX - rect.left) * scaleX);
    const clickY = Math.floor((e.clientY - rect.top) * scaleY);
    samplePixel(clickX, clickY);
  };

  const pickWithNativeEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const res = await eyeDropper.open();
        const hex = res.sRGBHex.toUpperCase();
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const colorObj = {
          r,
          g,
          b,
          hex,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: hslFromRgb(r, g, b),
        };
        setPickedColor(colorObj);
        setHistory((prev) => [colorObj, ...prev.filter((c) => c.hex !== colorObj.hex)].slice(0, 10));
      } catch (e) {
        console.warn('EyeDropper cancelled or unsupported:', e);
      }
    } else {
      setErrorMsg('Native Screen EyeDropper is supported in Chrome/Edge. You can click on the image below to pick any color!');
    }
  };

  const copyToClipboard = (text, formatName) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(''), 2000);
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

  const handleReset = () => {
    cleanupUrls();
    setFile(null);
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
              <Pipette className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose an image or drop it here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Inspect and copy exact HEX, RGB and HSL colors from any image
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Sub-Pixel Precision Color Inspector</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden sampling canvas */}
      <canvas ref={canvasRef} className="hidden" />

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

      {/* Interactive Picker Area */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Image Display */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center justify-between space-y-4">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold"
              >
                Change Image
              </button>
            </div>

            <div className="relative max-h-[460px] max-w-full rounded-2xl overflow-hidden shadow-md cursor-crosshair group flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              <img
                src={previewUrl}
                alt="Pick color"
                onClick={handleCanvasClick}
                className="max-h-[460px] max-w-full object-contain block select-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Click anywhere on the image above to pick a color.
            </p>
          </div>

          {/* Color Values & Tools */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* EyeDropper button */}
              <button
                onClick={pickWithNativeEyeDropper}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-sm transition"
              >
                <Pipette className="w-4 h-4 text-orange-500" />
                Pick Any Screen Color (EyeDropper)
              </button>

              {/* Large Color Preview Swatch */}
              <div
                style={{ backgroundColor: pickedColor.hex }}
                className="w-full h-28 rounded-2xl shadow-inner border border-white/20 flex items-end p-3 transition-colors duration-200"
              >
                <span className="px-3 py-1 rounded-lg bg-black/40 text-white font-mono font-bold text-xs backdrop-blur-sm">
                  {pickedColor.hex}
                </span>
              </div>

              {/* Values List with 1-click Copy */}
              <div className="space-y-2.5">
                {[
                  { label: 'HEX', val: pickedColor.hex },
                  { label: 'RGB', val: pickedColor.rgb },
                  { label: 'HSL', val: pickedColor.hsl },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={() => copyToClipboard(item.val, item.label)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-orange-500/50 transition group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {item.label}
                      </span>
                      <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                        {item.val}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg text-slate-400 group-hover:text-orange-500 transition">
                      {copiedFormat === item.label ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Color History Palette */}
              {history.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Recent Colors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {history.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPickedColor(col)}
                        style={{ backgroundColor: col.hex }}
                        className="w-8 h-8 rounded-lg shadow-sm border border-slate-300 dark:border-slate-700 hover:scale-110 transition"
                        title={col.hex}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <ColourPickerSeoArticle />
    </div>
  );
}
