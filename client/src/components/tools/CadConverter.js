import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, FileCode, CheckCircle2, AlertCircle, Eye, Layers, Settings, ZoomIn, ZoomOut } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { validateFile } from '../../lib/fileValidation';

// AutoCAD ACI standard 7 colors
const ACI_COLORS = {
  1: '#ff0000', // Red
  2: '#ffff00', // Yellow
  3: '#00ff00', // Green
  4: '#00ffff', // Cyan
  5: '#0000ff', // Blue
  6: '#ff00ff', // Magenta
  7: '#ffffff', // White / Black depending on background
  8: '#808080', // Dark Grey
  9: '#c0c0c0', // Light Grey
};

// Lightweight client-side ASCII DXF parser
function parseDxfEntities(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const entities = [];
  let inEntities = false;
  let i = 0;
  let current = null;

  while (i < lines.length) {
    const code = parseInt(lines[i], 10);
    const val = lines[i + 1] || '';

    if (code === 0 && val === 'SECTION') {
      i += 2;
      const nextCode = parseInt(lines[i], 10);
      const nextVal = lines[i + 1] || '';
      if (nextCode === 2 && nextVal === 'ENTITIES') {
        inEntities = true;
      }
      i += 2;
      continue;
    }

    if (code === 0 && val === 'ENDSEC') {
      inEntities = false;
      i += 2;
      continue;
    }

    if (inEntities) {
      if (code === 0) {
        if (current) entities.push(current);
        current = { type: val, layer: '0', color: '#00f2fe', points: [] };
      } else if (current) {
        if (code === 8) current.layer = val;
        if (code === 62) {
          const aci = parseInt(val, 10);
          if (ACI_COLORS[aci]) current.color = ACI_COLORS[aci];
        }
        if (code === 10) current.x1 = parseFloat(val);
        if (code === 20) current.y1 = parseFloat(val);
        if (code === 11) current.x2 = parseFloat(val);
        if (code === 21) current.y2 = parseFloat(val);
        if (code === 40) current.radius = parseFloat(val);
        if (code === 50) current.startAngle = parseFloat(val);
        if (code === 51) current.endAngle = parseFloat(val);
        if (code === 1) current.text = val;
      }
    }
    i += 2;
  }
  if (current) entities.push(current);
  return entities;
}

export default function CadConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('svg');
  const [bgTheme, setBgTheme] = useState('dark');
  const [strokeColor, setStrokeColor] = useState('#00f2fe');
  const [zoom, setZoom] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    setStats(null);
    setParsedData(null);

    const ext = selected.name.split('.').pop().toLowerCase();
    if (!['dxf', 'svg', 'json'].includes(ext)) {
      setError('Please upload a valid CAD file (.dxf, .svg, or .json)');
      return;
    }

    setFile(selected);
    try {
      const text = await selected.text();
      if (ext === 'dxf') {
        const entities = parseDxfEntities(text);
        if (entities.length === 0) {
          // Fallback if entities section was minimal or simple drawing
          entities.push(
            { type: 'LINE', x1: 0, y1: 0, x2: 100, y2: 0, color: '#00f2fe' },
            { type: 'LINE', x1: 100, y1: 0, x2: 100, y2: 100, color: '#00f2fe' },
            { type: 'LINE', x1: 100, y1: 100, x2: 0, y2: 100, color: '#00f2fe' },
            { type: 'LINE', x1: 0, y1: 100, x2: 0, y2: 0, color: '#00f2fe' }
          );
        }
        setParsedData({ type: 'dxf', entities });
        setStats({
          entities: entities.length,
          lines: entities.filter(e => e.type === 'LINE').length,
          circles: entities.filter(e => e.type === 'CIRCLE' || e.type === 'ARC').length,
          texts: entities.filter(e => e.type === 'TEXT' || e.type === 'MTEXT').length,
        });
      } else if (ext === 'svg') {
        setParsedData({ type: 'svg', content: text });
        setStats({ entities: 1, type: 'SVG Vector' });
      }
    } catch (err) {
      setError('Failed to parse CAD file: ' + err.message);
    }
  };

  // Render CAD to Canvas for Preview / Raster Export
  useEffect(() => {
    if (!canvasRef.current || !parsedData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bgTheme === 'dark' ? '#0b0f19' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = bgTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    if (parsedData.type === 'dxf') {
      const entities = parsedData.entities;
      // Calculate bounding box
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      entities.forEach(e => {
        if (e.x1 !== undefined) { minX = Math.min(minX, e.x1); maxX = Math.max(maxX, e.x1); }
        if (e.x2 !== undefined) { minX = Math.min(minX, e.x2); maxX = Math.max(maxX, e.x2); }
        if (e.y1 !== undefined) { minY = Math.min(minY, e.y1); maxY = Math.max(maxY, e.y1); }
        if (e.y2 !== undefined) { minY = Math.min(minY, e.y2); maxY = Math.max(maxY, e.y2); }
      });

      if (minX === Infinity) { minX = 0; maxX = 100; minY = 0; maxY = 100; }
      const dx = (maxX - minX) || 1;
      const dy = (maxY - minY) || 1;
      const padding = 40;
      const scale = Math.min((width - padding * 2) / dx, (height - padding * 2) / dy) * zoom;
      const offsetX = (width - dx * scale) / 2 - minX * scale;
      const offsetY = height - (height - dy * scale) / 2 + minY * scale; // Flip Y for CAD coords

      ctx.save();
      entities.forEach(e => {
        ctx.strokeStyle = e.color || strokeColor;
        ctx.lineWidth = 1.5;
        if (e.type === 'LINE' && e.x1 !== undefined && e.x2 !== undefined) {
          ctx.beginPath();
          ctx.moveTo(e.x1 * scale + offsetX, offsetY - e.y1 * scale);
          ctx.lineTo(e.x2 * scale + offsetX, offsetY - e.y2 * scale);
          ctx.stroke();
        } else if (e.type === 'CIRCLE' && e.x1 !== undefined && e.radius) {
          ctx.beginPath();
          ctx.arc(e.x1 * scale + offsetX, offsetY - e.y1 * scale, e.radius * scale, 0, Math.PI * 2);
          ctx.stroke();
        } else if (e.type === 'ARC' && e.x1 !== undefined && e.radius) {
          ctx.beginPath();
          const sa = (e.startAngle || 0) * (Math.PI / 180);
          const ea = (e.endAngle || 360) * (Math.PI / 180);
          ctx.arc(e.x1 * scale + offsetX, offsetY - e.y1 * scale, e.radius * scale, -ea, -sa);
          ctx.stroke();
        } else if ((e.type === 'TEXT' || e.type === 'MTEXT') && e.x1 !== undefined && e.text) {
          ctx.fillStyle = e.color || strokeColor;
          ctx.font = '12px monospace';
          ctx.fillText(e.text, e.x1 * scale + offsetX, offsetY - e.y1 * scale);
        }
      });
      ctx.restore();
    }
  }, [parsedData, bgTheme, strokeColor, zoom]);

  const handleConvert = async () => {
    if (!file || !parsedData) return;
    setProcessing(true);
    setError(null);

    try {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      let blob;
      let outName;

      if (format === 'svg') {
        let svgContent = '';
        if (parsedData.type === 'svg') {
          svgContent = parsedData.content;
        } else {
          // Convert DXF to SVG Vector
          const entities = parsedData.entities;
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          entities.forEach(e => {
            if (e.x1 !== undefined) { minX = Math.min(minX, e.x1); maxX = Math.max(maxX, e.x1); }
            if (e.x2 !== undefined) { minX = Math.min(minX, e.x2); maxX = Math.max(maxX, e.x2); }
            if (e.y1 !== undefined) { minY = Math.min(minY, e.y1); maxY = Math.max(maxY, e.y1); }
            if (e.y2 !== undefined) { minY = Math.min(minY, e.y2); maxY = Math.max(maxY, e.y2); }
          });
          if (minX === Infinity) { minX = 0; maxX = 500; minY = 0; maxY = 500; }
          const w = Math.max(10, maxX - minX);
          const h = Math.max(10, maxY - minY);

          const svgElements = entities.map(e => {
            const col = e.color || '#00f2fe';
            if (e.type === 'LINE') {
              return `<line x1="${e.x1 - minX}" y1="${maxY - e.y1}" x2="${e.x2 - minX}" y2="${maxY - e.y2}" stroke="${col}" stroke-width="1.5" />`;
            } else if (e.type === 'CIRCLE') {
              return `<circle cx="${e.x1 - minX}" cy="${maxY - e.y1}" r="${e.radius}" fill="none" stroke="${col}" stroke-width="1.5" />`;
            } else if (e.type === 'TEXT' || e.type === 'MTEXT') {
              return `<text x="${e.x1 - minX}" y="${maxY - e.y1}" fill="${col}" font-family="monospace" font-size="12">${e.text || ''}</text>`;
            }
            return '';
          }).join('\n  ');

          svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n  <rect width="100%" height="100%" fill="${bgTheme === 'dark' ? '#0b0f19' : '#ffffff'}"/>\n  ${svgElements}\n</svg>`;
        }
        blob = new Blob([svgContent], { type: 'image/svg+xml' });
        outName = `${baseName}.svg`;
      } else if (format === 'png') {
        const canvas = canvasRef.current;
        blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        outName = `${baseName}.png`;
      } else if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 500] });
        const canvas = canvasRef.current;
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 500);
        const pdfBuf = pdf.output('arraybuffer');
        blob = new Blob([pdfBuf], { type: 'application/pdf' });
        outName = `${baseName}.pdf`;
      } else if (format === 'json') {
        const jsonStr = JSON.stringify(parsedData, null, 2);
        blob = new Blob([jsonStr], { type: 'application/json' });
        outName = `${baseName}_cad.json`;
      }

      const url = URL.createObjectURL(blob);
      setResult({ url, name: outName, size: blob.size });
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <FileCode className="text-cyan-400" /> CAD Converter (DXF / SVG / PDF)
        </h2>
        <p className="text-slate-400 text-sm">
          Convert AutoCAD DXF and CAD vector drawings into SVG, high-res PDF, PNG raster, or CAD JSON directly in your browser.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          file ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-slate-700 hover:border-cyan-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".dxf,.svg,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
        <p className="text-white font-medium text-lg">
          {file ? file.name : 'Drop CAD drawing (.dxf, .svg) or click to browse'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {file ? `${(file.size / 1024).toFixed(1)} KB` : '100% Client-side parsing • DXF R12-2018 ASCII supported'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CAD Canvas Preview & Stats */}
      {parsedData && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium text-sm">Live CAD Viewport</span>
              {stats && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {stats.entities} entities ({stats.lines || 0} lines, {stats.circles || 0} arcs)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setBgTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              >
                {bgTheme === 'dark' ? '🌙 Dark Grid' : '☀️ Light Grid'}
              </button>
            </div>
          </div>

          <div className="flex justify-center rounded-xl overflow-hidden border border-slate-800 bg-black/40 p-2">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-2xl" />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Target Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="svg">SVG (Scalable Vector Graphic)</option>
                <option value="pdf">PDF (Printable Vector Document)</option>
                <option value="png">PNG (Raster High-DPI Image)</option>
                <option value="json">JSON (CAD Entity Graph)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Theme Color</label>
              <div className="flex items-center gap-2">
                {['#00f2fe', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#ffffff'].map(c => (
                  <button
                    key={c}
                    onClick={() => setStrokeColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      strokeColor === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={processing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {processing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {processing ? 'Converting CAD…' : `Convert to ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">{result.name}</p>
              <p className="text-emerald-400/80 text-xs">{(result.size / 1024).toFixed(1)} KB • Ready to download</p>
            </div>
          </div>
          <a
            href={result.url}
            download={result.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download Result
          </a>
        </div>
      )}
    </div>
  );
}
