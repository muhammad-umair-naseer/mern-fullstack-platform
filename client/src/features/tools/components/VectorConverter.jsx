import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shapes, Download, AlertCircle, Check} from 'lucide-react';
import { formatFileSize } from '../../../lib/fileValidation.js';
import { triggerDownload } from '../../../lib/pdfCommon.js';
import { dropHandlers } from '../../../lib/dropzone.js';

const UNIT = { px: 1, pt: 96 / 72, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96, '': 1 };

function toPx(v) {
  const m = /^\s*([\d.]+)\s*(px|pt|pc|mm|cm|in)?\s*$/i.exec(v || '');
  return m ? parseFloat(m[1]) * (UNIT[(m[2] || '').toLowerCase()] || 1) : null;
}
function attr(tag, name) {
  const m = new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag);
  return m ? m[2] : null;
}
function rootTag(svg) {
  const m = /<svg\b[^>]*>/i.exec(svg);
  return m ? m[0] : null;
}
function parseSvgSize(svg) {
  const tag = rootTag(svg) || '';
  const vbRaw = attr(tag, 'viewBox');
  let vb = null;
  if (vbRaw) {
    const p = vbRaw.trim().split(/[\s,]+/).map(parseFloat);
    if (p.length === 4 && p.every(isFinite)) vb = p;
  }
  let w = toPx(attr(tag, 'width'));
  let h = toPx(attr(tag, 'height'));
  if ((!w || !h) && vb) {
    if (!w && !h) {
      w = vb[2];
      h = vb[3];
    } else if (!w) w = (h * vb[2]) / vb[3];
    else h = (w * vb[3]) / vb[2];
  }
  if (!w || !h) {
    w = w || 300;
    h = h || 150;
  }
  return { width: Math.round(w), height: Math.round(h), viewBox: vb };
}

function withSize(svg, w, h) {
  const tag = rootTag(svg);
  if (!tag) throw new Error('Not an SVG document');
  const size = parseSvgSize(svg);
  let t = tag.replace(/\s(width|height)\s*=\s*(["']).*?\2/gi, '');
  if (!attr(tag, 'viewBox')) t = t.replace(/^<svg/i, `<svg viewBox="0 0 ${size.width} ${size.height}"`);
  if (!/xmlns\s*=/.test(t)) t = t.replace(/^<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  t = t.replace(/^<svg/i, `<svg width="${w}" height="${h}"`);
  return svg.replace(tag, t);
}

function rasterToSvg(dataUrl, w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n  <image width="${w}" height="${h}" href="${dataUrl}" xlink:href="${dataUrl}"/>\n</svg>\n`;
}

export default function VectorConverter() {
  const [file, setFile] = useState(null);
  const [isSvg, setIsSvg] = useState(true);
  const [svgContent, setSvgContent] = useState('');
  const [origDims, setOrigDims] = useState({ width: 300, height: 150 });
  const [scale, setScale] = useState(2); // 1x, 2x, 4x
  const [targetFormat, setTargetFormat] = useState('png'); // 'png' | 'jpeg' | 'webp' | 'svg'
  const [bgColor, setBgColor] = useState('#ffffff');
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [previewBlobUrl, setPreviewBlobUrl] = useState('');

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef('');

  const cleanupUrls = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    setPreviewBlobUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleSelectFile = async (f) => {
    if (!f) return;
    cleanupUrls();
    setFile(null);
    setStatus('loading');
    setStatusMsg(`Loading ${f.name}...`);

    const name = f.name.toLowerCase();
    const svgMode = name.endsWith('.svg') || f.type.includes('svg');
    setIsSvg(svgMode);

    try {
      if (svgMode) {
        const text = await f.text();
        const dims = parseSvgSize(text);
        setSvgContent(text);
        setOrigDims(dims);
        setTargetFormat('png');

        const blob = new Blob([text], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        setPreviewBlobUrl(url);
      } else {
        // Raster image -> convert to SVG
        const url = URL.createObjectURL(f);
        previewUrlRef.current = url;
        setPreviewBlobUrl(url);
        const img = new Image();
        img.onload = () => {
          setOrigDims({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = url;
        setTargetFormat('svg');
      }

      setFile(f);
      setStatus('ready');
      setStatusMsg(`Loaded ${f.name} (${formatFileSize(f.size)})`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to parse file: ${err.message}`);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('converting');
    setStatusMsg('Rendering vector conversion...');

    try {
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const W = Math.round(origDims.width * scale);
      const H = Math.round(origDims.height * scale);

      if (isSvg) {
        if (targetFormat === 'svg') {
          const sizedSvg = withSize(svgContent, W, H);
          const blob = new Blob([sizedSvg], { type: 'image/svg+xml' });
          triggerDownload(blob, `${baseName}_${W}x${H}.svg`);
        } else {
          // Render to Canvas
          const sizedSvg = withSize(svgContent, W, H);
          const svgBlob = new Blob([sizedSvg], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);

          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = svgUrl;
          });

          const canvas = document.createElement('canvas');
          canvas.width = W;
          canvas.height = H;
          const ctx = canvas.getContext('2d');

          if (targetFormat === 'jpeg') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, W, H);
          }
          ctx.drawImage(img, 0, 0, W, H);
          URL.revokeObjectURL(svgUrl);

          const mime = targetFormat === 'jpeg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';
          canvas.toBlob((blob) => {
            canvas.width = 0;
            canvas.height = 0;
            triggerDownload(blob, `${baseName}.${targetFormat}`);
          }, mime, 0.92);
        }
      } else {
        // Raster to SVG wrapper
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          const svg = rasterToSvg(dataUrl, origDims.width, origDims.height);
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          triggerDownload(blob, `${baseName}.svg`);
        };
        reader.readAsDataURL(file);
      }

      setStatus('ready');
      setStatusMsg(`✓ Converted to .${targetFormat}`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Conversion failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          {...dropHandlers(handleSelectFile)}
          className="border-2 border-dashed border-slate-700/80 bg-slate-950/40 hover:border-slate-600 rounded-3xl p-10 text-center cursor-pointer transition"
        >
          <Shapes className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">Drop SVG Vector or Raster Image</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert SVG vectors to high-resolution PNG, JPG, or WebP at any scale, or wrap raster images in SVG.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Vector / Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml,image/png,image/jpeg,image/webp"
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
                  {origDims.width} × {origDims.height} px · {formatFileSize(file.size)}
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-slate-400 hover:text-white">
                Change File
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none uppercase"
                >
                  {isSvg ? (
                    <>
                      <option value="png">PNG (Lossless / Transparent)</option>
                      <option value="jpeg">JPG / JPEG (Compact)</option>
                      <option value="webp">WebP (Modern Web)</option>
                      <option value="svg">Resized SVG (.svg)</option>
                    </>
                  ) : (
                    <option value="svg">SVG Vector Container (.svg)</option>
                  )}
                </select>
              </div>

              {isSvg && targetFormat !== 'svg' && (
                <div>
                  <label className="text-slate-400 block mb-1">Export Scaling</label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="1">1x ({origDims.width} × {origDims.height})</option>
                    <option value="2">2x Retina ({origDims.width * 2} × {origDims.height * 2})</option>
                    <option value="3">3x HD ({origDims.width * 3} × {origDims.height * 3})</option>
                    <option value="4">4x Ultra ({origDims.width * 4} × {origDims.height * 4})</option>
                  </select>
                </div>
              )}

              {isSvg && targetFormat === 'jpeg' && (
                <div>
                  <label className="text-slate-400 block mb-1">Background Fill</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-slate-300">{bgColor}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {status === 'converting' ? 'Rendering...' : `Convert & Download .${targetFormat}`}
              </button>
            </div>
          </div>

          {previewBlobUrl && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Vector Preview
              </span>
              <img
                src={previewBlobUrl}
                alt="Vector Preview"
                className="max-h-64 mx-auto rounded-xl object-contain border border-slate-800 p-2 bg-slate-900/50"
              />
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
