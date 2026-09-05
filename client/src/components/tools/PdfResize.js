import React, { useState, useRef, useCallback } from 'react';
import {
  Scaling,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  X,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import PdfResizeSeoArticle from './PdfResizeSeoArticle';

const MM_TO_PT = 72 / 25.4;
const IN_TO_PT = 72;

const PRESETS = {
  a4: { name: 'A4 (210 × 297 mm)', width: 210 * MM_TO_PT, height: 297 * MM_TO_PT },
  letter: { name: 'US Letter (8.5 × 11 in)', width: 8.5 * IN_TO_PT, height: 11 * IN_TO_PT },
  legal: { name: 'US Legal (8.5 × 14 in)', width: 8.5 * IN_TO_PT, height: 14 * IN_TO_PT },
  a3: { name: 'A3 (297 × 420 mm)', width: 297 * MM_TO_PT, height: 420 * MM_TO_PT },
  a5: { name: 'A5 (148 × 210 mm)', width: 148 * MM_TO_PT, height: 210 * MM_TO_PT },
  tabloid: { name: 'Tabloid (11 × 17 in)', width: 11 * IN_TO_PT, height: 17 * IN_TO_PT },
};

export default function PdfResize() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [preset, setPreset] = useState('a4');
  const [orientation, setOrientation] = useState('auto'); // 'auto' | 'portrait' | 'landscape'
  const [scalingMode, setScalingMode] = useState('fit'); // 'fit' | 'fill' | 'stretch'
  const [status, setStatus] = useState('idle'); // 'idle' | 'analyzing' | 'resizing' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleSelectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');

    if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
      setErrorMsg('Please select a valid .pdf file.');
      return;
    }

    setFile(selectedFile);
    setStatus('analyzing');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setStatus('ready');
    } catch (err) {
      console.error('PDF Analysis error:', err);
      setErrorMsg(err.message || 'Could not read PDF document.');
      setStatus('error');
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleSelectFile(dropped);
    },
    [handleSelectFile]
  );

  const processResize = async () => {
    if (!file) return;
    setStatus('resizing');
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const targetPdf = await PDFDocument.create();

      const targetPreset = PRESETS[preset] || PRESETS.a4;
      let targetW = targetPreset.width;
      let targetH = targetPreset.height;

      const pageIndices = sourcePdf.getPageIndices();
      const embeddedPages = await targetPdf.embedPdf(sourcePdf, pageIndices);

      embeddedPages.forEach((embeddedPage, idx) => {
        const sourcePage = sourcePdf.getPage(idx);
        const { width: srcW, height: srcH } = sourcePage.getSize();

        // Determine orientation
        let isLandscape = false;
        if (orientation === 'landscape') isLandscape = true;
        else if (orientation === 'portrait') isLandscape = false;
        else isLandscape = srcW > srcH;

        const pageW = isLandscape ? Math.max(targetW, targetH) : Math.min(targetW, targetH);
        const pageH = isLandscape ? Math.min(targetW, targetH) : Math.max(targetW, targetH);

        const newPage = targetPdf.addPage([pageW, pageH]);

        let drawW = pageW;
        let drawH = pageH;
        let drawX = 0;
        let drawY = 0;

        if (scalingMode === 'fit') {
          const scale = Math.min(pageW / srcW, pageH / srcH);
          drawW = srcW * scale;
          drawH = srcH * scale;
          drawX = (pageW - drawW) / 2;
          drawY = (pageH - drawH) / 2;
        } else if (scalingMode === 'fill') {
          const scale = Math.max(pageW / srcW, pageH / srcH);
          drawW = srcW * scale;
          drawH = srcH * scale;
          drawX = (pageW - drawW) / 2;
          drawY = (pageH - drawH) / 2;
        }

        newPage.drawPage(embeddedPage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      });

      const pdfBytes = await targetPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const base = file.name.replace(/\.pdf$/i, '');
      triggerDownload(blob, `${base}-${preset}.pdf`);
      setStatus('ready');
    } catch (err) {
      console.error('Resize error:', err);
      setErrorMsg('Failed to resize PDF: ' + err.message);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
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
              <Scaling className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PDF to resize
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Scale and reformat pages to A4, US Letter, A3 or custom print sizes
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>High-Precision Page Resizer • Vector Scaling</span>
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

      {/* Options Panel */}
      {file && status !== 'analyzing' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {pageCount} Page{pageCount === 1 ? '' : 's'} • {formatBytes(file.size)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4" />
              Change File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Paper Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Page Size
              </label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
              >
                {Object.entries(PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="auto">Auto (Match Original)</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* Scaling Mode */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Content Placement
              </label>
              <select
                value={scalingMode}
                onChange={(e) => setScalingMode(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="fit">Fit (Proportional with Margins)</option>
                <option value="fill">Fill (Crop to Match Edge)</option>
                <option value="stretch">Stretch (Fit Page Exactly)</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={processResize}
              disabled={status === 'resizing'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Scaling className="w-5 h-5" />
              {status === 'resizing' ? 'Resizing PDF...' : 'Resize & Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfResizeSeoArticle />
    </div>
  );
}
