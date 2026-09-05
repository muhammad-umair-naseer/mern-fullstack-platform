import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  FileArchive,
  Image as ImageIcon,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import JSZip from 'jszip';
import { pdfjsLib, formatBytes, triggerDownload, yieldToMain } from '../../lib/pdfCommon';
import { canvasToExportBlob } from '../../lib/pdfEncoders';
import PdfPngWebpSeoArticle from './PdfPngWebpSeoArticle';

const FORMATS = [
  { value: 'png', label: 'PNG', ext: '.png', note: 'Lossless' },
  { value: 'webp', label: 'WebP', ext: '.webp', note: 'Small File' },
  { value: 'jpeg', label: 'JPEG', ext: '.jpg', note: 'Photo Quality' },
  { value: 'tiff', label: 'TIFF', ext: '.tiff', note: 'Print-Ready' },
  { value: 'bmp', label: 'BMP', ext: '.bmp', note: 'Bitmap' },
  { value: 'gif', label: 'GIF', ext: '.gif', note: 'Indexed' },
];

export default function PdfPngWebp() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [format, setFormat] = useState('png');
  const [quality] = useState(90);
  const [status, setStatus] = useState('idle'); // 'idle' | 'rendering' | 'ready' | 'exporting' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef(null);
  const pagePreviewsRef = useRef([]);

  const cleanupPreviews = useCallback(() => {
    pagePreviewsRef.current.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    pagePreviewsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupPreviews();
  }, [cleanupPreviews]);

  const renderPdfPages = useCallback(
    async (selectedFile, currentScale = 1.5) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupPreviews();
      setPages([]);

      if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
        setErrorMsg('Please select a valid .pdf file.');
        return;
      }

      setFile(selectedFile);
      setStatus('rendering');
      setProgress(5);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const rendered = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          setProgress(Math.round(10 + (pageNum / totalPages) * 80));
          await yieldToMain();

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: currentScale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { alpha: true });
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          await page.render({ canvasContext: context, viewport }).promise;

          // Quick preview blob as JPEG
          const previewBlob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.8)
          );
          const previewUrl = URL.createObjectURL(previewBlob);
          pagePreviewsRef.current.push(previewUrl);

          rendered.push({
            pageNumber: pageNum,
            width: canvas.width,
            height: canvas.height,
            previewUrl,
            canvas, // Kept in memory for instant high-quality binary encoding
          });
        }

        setPages(rendered);
        setProgress(100);
        setStatus('ready');
      } catch (err) {
        console.error('Render error:', err);
        setErrorMsg(err.message || 'Could not process PDF.');
        setStatus('error');
      }
    },
    [cleanupPreviews]
  );

  const handleSelectFile = useCallback(
    (selectedFile) => {
      renderPdfPages(selectedFile, 1.5);
    },
    [renderPdfPages]
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

  const downloadSinglePage = async (page) => {
    try {
      const selectedFmt = FORMATS.find((f) => f.value === format) || FORMATS[0];
      const blob = await canvasToExportBlob(page.canvas, format, quality / 100);
      const base = file ? file.name.replace(/\.pdf$/i, '') : 'document';
      triggerDownload(blob, `${base}-page-${page.pageNumber}${selectedFmt.ext}`);
    } catch (err) {
      setErrorMsg('Failed to export image: ' + err.message);
    }
  };

  const downloadAllZip = async () => {
    if (!pages.length) return;
    setIsZipping(true);
    setErrorMsg('');

    try {
      const zip = new JSZip();
      const folder = zip.folder(`pdf-images-${format}`);
      const selectedFmt = FORMATS.find((f) => f.value === format) || FORMATS[0];

      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        const blob = await canvasToExportBlob(p.canvas, format, quality / 100);
        const base = file ? file.name.replace(/\.pdf$/i, '') : 'document';
        folder.file(`${base}-page-${p.pageNumber}${selectedFmt.ext}`, blob);
        await yieldToMain();
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const base = file ? file.name.replace(/\.pdf$/i, '') : 'document';
      triggerDownload(content, `${base}-${format}-images.zip`);
    } catch (err) {
      setErrorMsg('ZIP Export Error: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    cleanupPreviews();
    setFile(null);
    setPages([]);
    setStatus('idle');
    setProgress(0);
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
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleSelectFile(e.target.files[0]);
              e.target.value = '';
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PDF to export as images
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Convert PDF pages to PNG, WebP, JPEG, TIFF, BMP or GIF
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Resolution Multi-Format Binary Conversion</span>
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

      {/* Rendering Progress */}
      {status === 'rendering' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-500 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Rendering pages for {file?.name}...
          </h4>
          <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% rendered</p>
        </div>
      )}

      {/* Options & Gallery */}
      {status === 'ready' && file && (
        <div className="space-y-6">
          {/* Options toolbar */}
          <div className="p-5 md:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pages.length} Pages • {formatBytes(file.size)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Change PDF
                </button>
                <button
                  onClick={downloadAllZip}
                  disabled={isZipping || pages.length === 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition disabled:opacity-50"
                >
                  <FileArchive className="w-4 h-4" />
                  {isZipping ? 'Generating ZIP...' : `Download All ${format.toUpperCase()} (ZIP)`}
                </button>
              </div>
            </div>

            {/* Format selector buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Image Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => setFormat(fmt.value)}
                    className={`p-3 rounded-2xl border text-center transition ${
                      format === fmt.value
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">{fmt.label}</div>
                    <div className="text-[10px] opacity-75">{fmt.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-orange-500/50"
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={p.previewUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Page {p.pageNumber}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {p.width}×{p.height}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadSinglePage(p)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {format.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfPngWebpSeoArticle />
    </div>
  );
}
