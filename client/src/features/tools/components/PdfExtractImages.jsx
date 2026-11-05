import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  FileArchive,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import JSZip from 'jszip';
import { pdfjsLib, formatBytes, triggerDownload, yieldToMain } from '../../../lib/pdfCommon.js';

export default function PdfExtractImages() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'extracting' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef(null);
  const imagePreviewsRef = useRef([]);

  const cleanupPreviews = useCallback(() => {
    imagePreviewsRef.current.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    imagePreviewsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupPreviews();
  }, [cleanupPreviews]);

  const handleSelectFile = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupPreviews();
      setImages([]);

      if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
        setErrorMsg('Please select a valid .pdf file.');
        return;
      }

      setFile(selectedFile);
      setStatus('extracting');
      setProgress(5);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const extracted = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          setProgress(Math.round(10 + (pageNum / totalPages) * 75));
          await yieldToMain();

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 }); // Crisp render
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { alpha: true });
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          await page.render({ canvasContext: context, viewport }).promise;

          // Convert canvas to blob
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            const url = URL.createObjectURL(blob);
            imagePreviewsRef.current.push(url);
            extracted.push({
              id: `${pageNum}-${Date.now()}-${Math.random()}`,
              pageNumber: pageNum,
              width: canvas.width,
              height: canvas.height,
              size: blob.size,
              blob,
              url,
              name: `${selectedFile.name.replace(/\.pdf$/i, '')}-page-${pageNum}.png`,
            });
          }

          // Clean canvas
          canvas.width = 0;
          canvas.height = 0;
        }

        setImages(extracted);
        setProgress(100);
        setStatus('ready');
      } catch (err) {
        console.error('Extraction error:', err);
        setErrorMsg(err.message || 'Failed to extract images from PDF.');
        setStatus('error');
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

  const downloadSingleImage = (img) => {
    triggerDownload(img.blob, img.name);
  };

  const downloadAllZip = async () => {
    if (!images.length) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('extracted-images');
      images.forEach((img) => {
        folder.file(img.name, img.blob);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const base = file ? file.name.replace(/\.pdf$/i, '') : 'document';
      triggerDownload(content, `${base}-all-images.zip`);
    } catch (err) {
      setErrorMsg('Failed to create ZIP file: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    cleanupPreviews();
    setFile(null);
    setImages([]);
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
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PDF file or drop it here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Turn every page of your PDF into a downloadable PNG
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Every Page Exported as a High-Resolution PNG</span>
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

      {/* Extracting Progress */}
      {status === 'extracting' && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-500 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Extracting images from {file?.name}...
          </h4>
          <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% completed</p>
        </div>
      )}

      {/* Results View */}
      {status === 'ready' && file && (
        <div className="space-y-6">
          {/* Top action bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {formatBytes(file.size)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {images.length} high-resolution image{images.length === 1 ? '' : 's'} extracted
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
              >
                <RotateCcw className="w-4 h-4" />
                Change PDF
              </button>
              <button
                onClick={downloadAllZip}
                disabled={isZipping || images.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition disabled:opacity-50"
              >
                <FileArchive className="w-4 h-4" />
                {isZipping ? 'Creating ZIP...' : 'Download All (ZIP)'}
              </button>
            </div>
          </div>

          {/* Grid of Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-orange-500/50"
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={img.url}
                    alt={`Page ${img.pageNumber}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Page {img.pageNumber}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {img.width}×{img.height}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadSingleImage(img)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
