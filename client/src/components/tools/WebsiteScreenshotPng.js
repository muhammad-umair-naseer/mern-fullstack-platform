import React, { useState, useEffect, useRef } from 'react';
import { Globe, Image as ImageIcon, Download, RefreshCw, AlertCircle, CheckCircle2, Monitor, Smartphone, Tablet, Sliders, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';

const DEVICE_PRESETS = [
  { id: 'desktop', label: 'Desktop 1080p', width: 1920, height: 1080, icon: Monitor },
  { id: 'laptop', label: 'Laptop HD', width: 1366, height: 768, icon: Monitor },
  { id: 'tablet', label: 'iPad Tablet', width: 768, height: 1024, icon: Tablet },
  { id: 'mobile', label: 'Mobile iPhone', width: 390, height: 844, icon: Smartphone },
  { id: 'custom', label: 'Custom Size', width: 1280, height: 800, icon: Sliders },
];

export default function WebsiteScreenshotPng() {
  const [mode, setMode] = useState('url'); // 'url' or 'html'
  const [url, setUrl] = useState('https://github.com');
  const [htmlCode, setHtmlCode] = useState('<div style="padding:40px;background:linear-gradient(135deg,#0284c7,#0369a1);color:white;font-family:sans-serif;min-height:300px;border-radius:12px;text-align:center;"><h1>🚀 High-Resolution PNG Capture</h1><p>Pixel-perfect lossless rendering for design and presentations.</p></div>');
  const [preset, setPreset] = useState('desktop');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [scale, setScale] = useState(2); // 1x, 2x Retina
  const [includeBrowserFrame, setIncludeBrowserFrame] = useState(true);

  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const renderSandboxRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handlePresetSelect = (p) => {
    setPreset(p.id);
    setWidth(p.width);
    setHeight(p.height);
  };

  const handleCapture = async () => {
    setError(null);
    setCapturing(true);

    try {
      let finalCanvas;

      if (mode === 'html') {
        if (!renderSandboxRef.current) throw new Error('Render container not ready');
        const container = renderSandboxRef.current;
        container.style.width = `${Math.min(width, 1280)}px`;

        const captured = await html2canvas(container, {
          scale: scale,
          useCORS: true,
          logging: false,
          backgroundColor: null // supports transparency
        });
        finalCanvas = captured;
      } else {
        let cleanUrl = url.trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }

        try {
          new URL(cleanUrl);
        } catch {
          throw new Error('Invalid URL format. Please enter a valid web address (e.g. https://example.com)');
        }

        const snapshotUrl = `https://image.thum.io/get/width/${width}/crop/${height}/noanimate/${encodeURIComponent(cleanUrl)}`;

        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => {
            const fallbackUrl = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
            img.src = fallbackUrl;
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Could not capture external website due to remote CORS policies. Try HTML sandbox mode for offline rendering.'));
          };
          img.src = snapshotUrl;
        });

        const canvas = document.createElement('canvas');
        const frameHeaderHeight = includeBrowserFrame ? 42 : 0;
        canvas.width = (img.naturalWidth || width);
        canvas.height = (img.naturalHeight || height) + frameHeaderHeight;
        const ctx = canvas.getContext('2d');

        if (includeBrowserFrame) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, 0, canvas.width, frameHeaderHeight);

          // Buttons
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(20, 21, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.arc(38, 21, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.beginPath(); ctx.arc(56, 21, 6, 0, Math.PI * 2); ctx.fill();

          // Address bar
          ctx.fillStyle = '#0f172a';
          ctx.roundRect(80, 8, canvas.width - 160, 26, 6);
          ctx.fill();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '12px system-ui, sans-serif';
          ctx.fillText(`🔒 ${cleanUrl}`, 95, 25);
        }

        ctx.drawImage(img, 0, frameHeaderHeight);
        finalCanvas = canvas;
      }

      const blob = await new Promise(res => finalCanvas.toBlob(res, 'image/png'));
      const domainName = mode === 'url' ? url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').slice(0, 30) : 'web_capture';
      const outName = `${domainName}_${width}x${height}.png`;
      const resultUrl = URL.createObjectURL(blob);

      setResult({
        url: resultUrl,
        name: outName,
        size: blob.size,
        width: finalCanvas.width,
        height: finalCanvas.height
      });
    } catch (err) {
      setError(err.message || 'Failed to capture PNG screenshot');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="text-sky-400" /> Website PNG Screenshot Generator
        </h2>
        <p className="text-slate-400 text-sm">
          Generate pixel-perfect lossless PNG screenshots of websites and mockups with Retina 2x scale and browser frames.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 w-fit">
        <button
          onClick={() => setMode('url')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'url' ? 'bg-sky-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Capture Live URL
        </button>
        <button
          onClick={() => setMode('html')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'html' ? 'bg-sky-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Custom HTML Sandbox
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
        {mode === 'url' ? (
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Target Website URL</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">HTML & CSS Snippet</label>
            <textarea
              rows={4}
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        {/* Device presets */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Viewport Preset</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DEVICE_PRESETS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all ${
                    preset === p.id
                      ? 'border-sky-500 bg-sky-500/10 text-white font-medium'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{p.label}</span>
                  <span className="text-[10px] text-slate-500">{p.width}x{p.height}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Render Resolution</label>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
            >
              <option value={1}>1x Standard DPI</option>
              <option value={2}>2x Retina Ultra-Sharp (Recommended)</option>
              <option value={3}>3x Max Precision</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="frameTogglePng"
              checked={includeBrowserFrame}
              onChange={(e) => setIncludeBrowserFrame(e.target.checked)}
              className="w-4 h-4 rounded accent-sky-500"
            />
            <label htmlFor="frameTogglePng" className="text-slate-300 text-sm select-none cursor-pointer">
              Add Clean Browser Window Frame
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCapture}
            disabled={capturing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
          >
            {capturing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            {capturing ? 'Generating PNG…' : 'Capture Lossless PNG'}
          </button>
        </div>
      </div>

      {/* Hidden sandbox */}
      {mode === 'html' && (
        <div className="overflow-hidden h-0 w-0">
          <div
            ref={renderSandboxRef}
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          />
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-sky-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">{result.name}</p>
                <p className="text-sky-400/80 text-xs">
                  {result.width} × {result.height} px • {(result.size / 1024 / 1024).toFixed(2)} MB Lossless PNG
                </p>
              </div>
            </div>
            <a
              href={result.url}
              download={result.name}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-sky-500/20"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          </div>

          <div className="flex justify-center rounded-xl overflow-hidden border border-slate-800 bg-black/40 p-2">
            <img src={result.url} alt="Screenshot Preview" className="max-h-96 w-auto rounded-lg shadow-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
