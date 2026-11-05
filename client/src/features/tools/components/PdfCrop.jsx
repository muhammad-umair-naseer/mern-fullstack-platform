import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Crop,
  ShieldCheck,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { pdfjsLib, triggerDownload } from '../../../lib/pdfCommon.js';

export default function PdfCrop() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [insets, setInsets] = useState({ top: 10, right: 10, bottom: 10, left: 10 }); // percentage
  const [applyAll, setApplyAll] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle' | 'rendering' | 'ready' | 'processing'
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const pdfDocRef = useRef(null);
  const currentUrlRef = useRef('');

  const cleanupCurrentPreview = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = '';
    }
    setPreviewUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupCurrentPreview();
  }, [cleanupCurrentPreview]);

  const renderCurrentPagePreview = useCallback(
    async (pdf, pageNum) => {
      setStatus('rendering');
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
        cleanupCurrentPreview();
        const url = URL.createObjectURL(blob);
        currentUrlRef.current = url;
        setPreviewUrl(url);
        setStatus('ready');
      } catch (err) {
        console.error('Page render error:', err);
        setErrorMsg('Error rendering page preview.');
        setStatus('ready');
      }
    },
    [cleanupCurrentPreview]
  );

  const handleSelectFile = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupCurrentPreview();

      if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
        setErrorMsg('Please select a valid .pdf file.');
        return;
      }

      setFile(selectedFile);
      setStatus('rendering');

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        await renderCurrentPagePreview(pdf, 1);
      } catch (err) {
        console.error('PDF Load Error:', err);
        setErrorMsg(err.message || 'Could not load PDF document.');
        setStatus('idle');
      }
    },
    [cleanupCurrentPreview, renderCurrentPagePreview]
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || !pdfDocRef.current) return;
    setCurrentPage(newPage);
    renderCurrentPagePreview(pdfDocRef.current, newPage);
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

  const autoTrimMargins = () => {
    setInsets({ top: 12, right: 12, bottom: 12, left: 12 });
  };

  const resetCrop = () => {
    setInsets({ top: 0, right: 0, bottom: 0, left: 0 });
  };

  const applyCropAndDownload = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const topRatio = insets.top / 100;
      const rightRatio = insets.right / 100;
      const bottomRatio = insets.bottom / 100;
      const leftRatio = insets.left / 100;

      const pagesToCrop = applyAll ? pages : [pages[currentPage - 1]];

      pagesToCrop.forEach((p) => {
        const { width, height } = p.getSize();
        const cropX = width * leftRatio;
        const cropY = height * bottomRatio;
        const cropWidth = width * (1 - leftRatio - rightRatio);
        const cropHeight = height * (1 - topRatio - bottomRatio);

        if (cropWidth > 10 && cropHeight > 10) {
          p.setCropBox(cropX, cropY, cropWidth, cropHeight);
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const base = file.name.replace(/\.pdf$/i, '');
      triggerDownload(blob, `${base}-cropped.pdf`);
      setStatus('ready');
    } catch (err) {
      console.error('Crop Error:', err);
      setErrorMsg('Failed to crop PDF: ' + err.message);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    cleanupCurrentPreview();
    setFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    pdfDocRef.current = null;
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
            accept=".pdf,application/pdf"
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
                Choose a PDF to crop
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Trim margins, remove headers/footers or crop pages visually
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Precision Vector Engine • Lossless Output</span>
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

      {/* Crop Workspace */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Preview Box */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center justify-between space-y-4">
            {/* Page Navigation */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>{file.name}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => changePage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => changePage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Canvas Preview with Crop Box Overlay */}
            <div className="relative max-w-full max-h-[480px] aspect-[3/4] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2">
              {previewUrl && (
                <div className="relative max-h-full max-w-full">
                  <img
                    src={previewUrl}
                    alt="Page preview"
                    className="max-h-[440px] max-w-full object-contain rounded shadow"
                  />
                  {/* Crop overlay highlight */}
                  <div
                    style={{
                      top: `${insets.top}%`,
                      right: `${insets.right}%`,
                      bottom: `${insets.bottom}%`,
                      left: `${insets.left}%`,
                    }}
                    className="absolute border-2 border-orange-500 bg-orange-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] pointer-events-none transition-all duration-150"
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Orange boundary shows the cropped output area.
            </p>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Crop className="w-4 h-4 text-orange-500" />
                  Crop Margins
                </h4>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold"
                >
                  Change PDF
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-3">
                {['top', 'right', 'bottom', 'left'].map((side) => (
                  <div key={side} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                      <span>{side} Margin</span>
                      <span className="font-mono text-orange-500">{insets[side]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={insets[side]}
                      onChange={(e) =>
                        setInsets({ ...insets, [side]: Number(e.target.value) })
                      }
                      className="w-full accent-orange-500"
                    />
                  </div>
                ))}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={autoTrimMargins}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Trim 12%
                </button>
                <button
                  onClick={resetCrop}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Reset (0%)
                </button>
              </div>

              {/* Scope */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={applyAll}
                    onChange={(e) => setApplyAll(e.target.checked)}
                    className="rounded accent-orange-500 w-4 h-4"
                  />
                  <span>Apply crop to all {totalPages} pages</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={applyCropAndDownload}
              disabled={status === 'processing'}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {status === 'processing' ? 'Cropping...' : 'Download Cropped PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
