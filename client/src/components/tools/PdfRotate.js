import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  RotateCw,
  RotateCcw,
  ShieldCheck,
  RotateCw as RefreshIcon,
  Sparkles,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { pdfjsLib, formatBytes, triggerDownload, yieldToMain } from '../../lib/pdfCommon';

export default function PdfRotate() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'rendering' | 'ready' | 'processing'
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPages, setSelectedPages] = useState(new Set());

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

  const handleSelectFile = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupPreviews();
      setPages([]);
      setSelectedPages(new Set());

      if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
        setErrorMsg('Please select a valid .pdf file.');
        return;
      }

      setFile(selectedFile);
      setStatus('rendering');
      setProgress(10);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const renderedPages = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          setProgress(Math.round(15 + (pageNum / totalPages) * 80));
          await yieldToMain();

          const page = await pdf.getPage(pageNum);
          const initialRotation = page.rotate || 0;
          const viewport = page.getViewport({ scale: 0.5 }); // Lightweight thumbnail
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { alpha: false });
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          await page.render({ canvasContext: context, viewport }).promise;

          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
          const url = URL.createObjectURL(blob);
          pagePreviewsRef.current.push(url);

          renderedPages.push({
            pageNumber: pageNum,
            originalRotation: initialRotation,
            rotation: 0, // Additional user rotation in degrees (0, 90, 180, 270)
            url,
          });

          canvas.width = 0;
          canvas.height = 0;
        }

        setPages(renderedPages);
        setProgress(100);
        setStatus('ready');
      } catch (err) {
        console.error('PDF Render Error:', err);
        setErrorMsg(err.message || 'Could not load PDF pages.');
        setStatus('idle');
      }
    },
    [cleanupPreviews]
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

  const rotateSinglePage = (pageNumber, delta) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.pageNumber === pageNumber) {
          const nextRotation = (p.rotation + delta + 360) % 360;
          return { ...p, rotation: nextRotation };
        }
        return p;
      })
    );
  };

  const rotateAllPages = (delta) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + delta + 360) % 360,
      }))
    );
  };

  const rotateSelectedPages = (delta) => {
    if (selectedPages.size === 0) {
      rotateAllPages(delta);
      return;
    }
    setPages((prev) =>
      prev.map((p) => {
        if (selectedPages.has(p.pageNumber)) {
          return { ...p, rotation: (p.rotation + delta + 360) % 360 };
        }
        return p;
      })
    );
  };

  const togglePageSelect = (pageNumber) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedPages.size === pages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(pages.map((p) => p.pageNumber)));
    }
  };

  const applyAndDownload = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const docPages = pdfDoc.getPages();

      pages.forEach((p, idx) => {
        if (p.rotation !== 0 && docPages[idx]) {
          const currentRotation = docPages[idx].getRotation().angle;
          docPages[idx].setRotation(degrees((currentRotation + p.rotation) % 360));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const base = file.name.replace(/\.pdf$/i, '');
      triggerDownload(blob, `${base}-rotated.pdf`);
      setStatus('ready');
    } catch (err) {
      console.error('Rotate Save Error:', err);
      setErrorMsg('Failed to save rotated PDF: ' + err.message);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    cleanupPreviews();
    setFile(null);
    setPages([]);
    setSelectedPages(new Set());
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
              <RotateCw className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PDF file to rotate
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Rotate single pages or the entire document permanently
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Lossless Rotation Engine • High-Precision Output</span>
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
            Loading preview for {file?.name}...
          </h4>
          <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% loaded</p>
        </div>
      )}

      {/* Grid of Pages & Controls */}
      {(status === 'ready' || status === 'processing') && file && (
        <div className="space-y-6">
          {/* Top action toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {pages.length} page{pages.length === 1 ? '' : 's'} ({formatBytes(file.size)})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedPages.size > 0
                  ? `${selectedPages.size} page(s) selected`
                  : 'Click pages to select specific ones, or rotate all'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                {selectedPages.size === pages.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={() => rotateSelectedPages(-90)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Rotate Left 90°
              </button>
              <button
                onClick={() => rotateSelectedPages(90)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Rotate Right 90°
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition"
                title="Change File"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
              <button
                onClick={applyAndDownload}
                disabled={status === 'processing'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {status === 'processing' ? 'Saving PDF...' : 'Download Rotated PDF'}
              </button>
            </div>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pages.map((p) => {
              const isSelected = selectedPages.has(p.pageNumber);
              return (
                <div
                  key={p.pageNumber}
                  onClick={() => togglePageSelect(p.pageNumber)}
                  className={`group relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 cursor-pointer overflow-hidden p-3 flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/25 shadow-lg bg-orange-500/5'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm'
                  }`}
                >
                  {/* Selection Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : p.pageNumber}
                    </span>
                  </div>

                  {/* Thumbnail with CSS Transform rotation */}
                  <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden my-2">
                    <img
                      src={p.url}
                      alt={`Page ${p.pageNumber}`}
                      style={{
                        transform: `rotate(${p.rotation}deg)`,
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      className="max-h-full max-w-full object-contain rounded shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  {/* Per-card controls */}
                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => rotateSinglePage(p.pageNumber, -90)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                      title="Rotate 90° Left"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">
                      {p.rotation !== 0 ? `${p.rotation}°` : '0°'}
                    </span>
                    <button
                      onClick={() => rotateSinglePage(p.pageNumber, 90)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                      title="Rotate 90° Right"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
