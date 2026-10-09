import React, { useState, useEffect, useRef } from 'react';
import { Upload, Layers, Download, RefreshCw, AlertCircle, CheckCircle2} from 'lucide-react';
import { pdfjsLib } from '../../lib/pdfCommon';
import JSZip from 'jszip';
import { validateFile } from '../../lib/fileValidation';
import { dropHandlers } from '../../lib/dropzone';

// Generate Adobe Photoshop PSD binary file (RGB 8-bit, 3 channels)
function generatePsd(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Header (26 bytes)
  const header = new Uint8Array(26);
  // '8BPS'
  header[0] = 0x38; header[1] = 0x42; header[2] = 0x50; header[3] = 0x53;
  // Version = 1 (2 bytes)
  header[4] = 0; header[5] = 1;
  // Reserved (6 bytes = 0)
  // Channels = 3 (RGB)
  header[12] = 0; header[13] = 3;
  // Height (4 bytes, big endian)
  header[14] = (height >> 24) & 0xff;
  header[15] = (height >> 16) & 0xff;
  header[16] = (height >> 8) & 0xff;
  header[17] = height & 0xff;
  // Width (4 bytes, big endian)
  header[18] = (width >> 24) & 0xff;
  header[19] = (width >> 16) & 0xff;
  header[20] = (width >> 8) & 0xff;
  header[21] = width & 0xff;
  // Depth = 8
  header[22] = 0; header[23] = 8;
  // ColorMode = 3 (RGB)
  header[24] = 0; header[25] = 3;

  // Color Mode Data Section (4 bytes = length 0)
  const colorModeData = new Uint8Array(4);

  // Image Resources Section (4 bytes = length 0)
  const imageResources = new Uint8Array(4);

  // Layer and Mask Section (4 bytes = length 0)
  const layerAndMask = new Uint8Array(4);

  // Image Data Section: Compression = 0 (Raw uncompressed data, 2 bytes)
  const compHeader = new Uint8Array([0, 0]);

  // Planar RGB data: all R bytes, then all G bytes, then all B bytes
  const pixelCount = width * height;
  const rChannel = new Uint8Array(pixelCount);
  const gChannel = new Uint8Array(pixelCount);
  const bChannel = new Uint8Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    rChannel[i] = data[i * 4];
    gChannel[i] = data[i * 4 + 1];
    bChannel[i] = data[i * 4 + 2];
  }

  return new Blob([
    header,
    colorModeData,
    imageResources,
    layerAndMask,
    compHeader,
    rChannel,
    gChannel,
    bChannel
  ], { type: 'image/vnd.adobe.photoshop' });
}

// Generate Encapsulated PostScript (EPS Level 3)
function generateEps(canvas, title = 'Document') {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Convert RGB pixels to ASCII Hex
  let hexStream = '';
  const totalPixels = width * height;
  for (let i = 0; i < totalPixels; i++) {
    const r = data[i * 4].toString(16).padStart(2, '0');
    const g = data[i * 4 + 1].toString(16).padStart(2, '0');
    const b = data[i * 4 + 2].toString(16).padStart(2, '0');
    hexStream += r + g + b;
    if (i % 24 === 23) hexStream += '\n';
  }

  const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Cortexis Modern Web Suite
%%Title: ${title}
%%Pages: 1
%%BoundingBox: 0 0 ${width} ${height}
%%HiResBoundingBox: 0 0 ${width} ${height}
%%LanguageLevel: 3
%%DocumentData: Clean7Bit
%%EndComments
%%BeginProlog
%%EndProlog
%%Page: 1 1
gsave
0 0 translate
${width} ${height} scale
/picstr ${width * 3} string def
${width} ${height} 8 [${width} 0 0 -${height} 0 ${height}]
{currentfile picstr readhexstring pop}
false 3
colorimage
${hexStream}
grestore
showpage
%%Trailer
%%EOF`;

  return new Blob([eps], { type: 'application/postscript' });
}

// Generate Multi-Page PostScript (PS Level 3)
function generatePs(canvases, title = 'Document') {
  const numPages = canvases.length;
  let body = '';

  canvases.forEach((canvas, idx) => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let hexStream = '';
    const totalPixels = width * height;
    for (let i = 0; i < totalPixels; i++) {
      const r = data[i * 4].toString(16).padStart(2, '0');
      const g = data[i * 4 + 1].toString(16).padStart(2, '0');
      const b = data[i * 4 + 2].toString(16).padStart(2, '0');
      hexStream += r + g + b;
      if (i % 24 === 23) hexStream += '\n';
    }

    body += `%%Page: ${idx + 1} ${idx + 1}
gsave
0 0 translate
${width} ${height} scale
/picstr ${width * 3} string def
${width} ${height} 8 [${width} 0 0 -${height} 0 ${height}]
{currentfile picstr readhexstring pop}
false 3
colorimage
${hexStream}
grestore
showpage
`;
  });

  const ps = `%!PS-Adobe-3.0
%%Creator: Cortexis Web Suite
%%Title: ${title}
%%Pages: ${numPages}
%%LanguageLevel: 3
%%DocumentData: Clean7Bit
%%EndComments
${body}
%%Trailer
%%EOF`;

  return new Blob([ps], { type: 'application/postscript' });
}

export default function PdfToPsdEpsPs() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [format, setFormat] = useState('eps'); // eps, ps, psd
  const [dpi, setDpi] = useState(150);
  const [currentPage, setCurrentPage] = useState(1);
  const [scope, setScope] = useState('single'); // single, all

  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [result, previewUrl]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    setPdfDoc(null);
    setLoading(true);

    const validation = await validateFile(selected, 'pdf');
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    setFile(selected);

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setCurrentPage(1);

      // Render page 1 preview
      await renderPagePreview(doc, 1);
    } catch (err) {
      setError('Failed to load PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPagePreview = async (doc, pageNum) => {
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.85));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePageChange = async (p) => {
    if (!pdfDoc) return;
    const pageNum = Math.max(1, Math.min(pdfDoc.numPages, p));
    setCurrentPage(pageNum);
    await renderPagePreview(pdfDoc, pageNum);
  };

  const handleConvert = async () => {
    if (!pdfDoc || !file) return;
    setConverting(true);
    setProgress(0);
    setError(null);

    try {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const scale = dpi / 72;
      let blob;
      let outName;

      if (scope === 'single') {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        if (format === 'psd') {
          blob = generatePsd(canvas);
          outName = `${baseName}_page${currentPage}.psd`;
        } else if (format === 'eps') {
          blob = generateEps(canvas, `${baseName} - Page ${currentPage}`);
          outName = `${baseName}_page${currentPage}.eps`;
        } else if (format === 'ps') {
          blob = generatePs([canvas], `${baseName} - Page ${currentPage}`);
          outName = `${baseName}_page${currentPage}.ps`;
        }

        canvas.width = 0; canvas.height = 0;
      } else {
        // Multi-page batch
        const numPages = pdfDoc.numPages;

        if (format === 'ps') {
          // Single multi-page PS file
          const canvases = [];
          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;
            canvases.push(canvas);
            setProgress(Math.round((i / numPages) * 70));
            await new Promise(r => setTimeout(r, 0));
          }
          blob = generatePs(canvases, baseName);
          outName = `${baseName}.ps`;
          canvases.forEach(c => { c.width = 0; c.height = 0; });
        } else {
          // PSD or EPS zip package
          const zip = new JSZip();
          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            const pageBlob = format === 'psd' ? generatePsd(canvas) : generateEps(canvas, `Page ${i}`);
            zip.file(`${baseName}_p${i}.${format}`, pageBlob);

            canvas.width = 0; canvas.height = 0;
            setProgress(Math.round((i / numPages) * 80));
            await new Promise(r => setTimeout(r, 0));
          }
          blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
          outName = `${baseName}_${format.toUpperCase()}_pages.zip`;
        }
      }

      setProgress(100);
      const url = URL.createObjectURL(blob);
      setResult({ url, name: outName, size: blob.size });
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="text-indigo-400" /> PDF → PSD, EPS, PS Converter
        </h2>
        <p className="text-slate-400 text-sm">
          Export PDF documents to professional design formats (Adobe Photoshop PSD, Encapsulated PostScript EPS, and PostScript PS).
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        {...dropHandlers((f) => handleFileChange({ target: { files: [f], value: "" } }))}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          file ? 'border-indigo-500/50 bg-indigo-950/10' : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
        <p className="text-white font-medium text-lg">
          {file ? file.name : 'Drop PDF here or click to browse'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {pdfDoc ? `${pdfDoc.numPages} Pages • ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Validated with %PDF- header check • Client-side generation'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-6 text-indigo-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Rendering PDF viewport…</span>
        </div>
      )}

      {/* PDF Controls & Preview */}
      {pdfDoc && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {previewUrl && (
              <div className="flex flex-col items-center justify-center border border-slate-800 rounded-xl p-3 bg-black/40">
                <img src={previewUrl} alt="Preview" className="max-h-56 rounded-lg object-contain shadow-lg" />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 text-xs"
                  >
                    Prev
                  </button>
                  <span className="text-xs text-slate-400">Page {currentPage} of {pdfDoc.numPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pdfDoc.numPages}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Target Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="eps">EPS (Encapsulated PostScript Level 3)</option>
                    <option value="psd">PSD (Adobe Photoshop Document)</option>
                    <option value="ps">PS (PostScript Document)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Export Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="single">Current Page (Page {currentPage})</option>
                    <option value="all">All Pages ({pdfDoc.numPages} pages)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">Resolution / DPI</label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value={72}>72 DPI (Standard Web Preview)</option>
                    <option value={150}>150 DPI (Recommended / Crisp)</option>
                    <option value={300}>300 DPI (High-Resolution Print Quality)</option>
                    <option value={600}>600 DPI (Ultra Precision)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Encoding {format.toUpperCase()} data stream…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleConvert}
              disabled={converting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {converting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {converting ? 'Exporting…' : `Export to ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">{result.name}</p>
              <p className="text-emerald-400/80 text-xs">{(result.size / 1024 / 1024).toFixed(2)} MB • Ready for Adobe Creative Cloud & Print</p>
            </div>
          </div>
          <a
            href={result.url}
            download={result.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download {format.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}
