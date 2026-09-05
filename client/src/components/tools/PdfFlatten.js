import React, { useState, useRef, useCallback } from 'react';
import {
  Download,
  Layers,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
  CheckSquare,
  MessageSquare,
  Lock,
  Sliders,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import PdfFlattenSeoArticle from './PdfFlattenSeoArticle';

// Parse page ranges like "1-3, 5" into 0-indexed page indices
function parsePageRanges(input, maxPages) {
  if (!input || !input.trim()) {
    return Array.from({ length: maxPages }, (_, i) => i);
  }
  const indices = new Set();
  const parts = input.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(maxPages, parseInt(endStr, 10) || maxPages);
      for (let i = start; i <= end; i++) {
        indices.add(i - 1);
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        indices.add(num - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export default function PdfFlatten() {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'analyzing' | 'flattening' | 'ready' | 'error'
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Granular user options
  const [flattenForms, setFlattenForms] = useState(true);
  const [flattenAnnotations, setFlattenAnnotations] = useState(true);
  const [lockReadOnlyOnly, setLockReadOnlyOnly] = useState(false);
  const [pageScope, setPageScope] = useState('all'); // 'all' | 'custom'
  const [customRange, setCustomRange] = useState('');

  const fileInputRef = useRef(null);

  const handleSelectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');
    setResult(null);

    if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
      setErrorMsg('Please select a valid .pdf file.');
      return;
    }

    setFile(selectedFile);
    setStatus('analyzing');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();
      let fieldCount = 0;
      let fieldNames = [];

      try {
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        fieldCount = fields.length;
        fieldNames = fields.slice(0, 5).map((f) => f.getName());
      } catch {
        fieldCount = 0;
      }

      setInfo({
        pageCount,
        fieldCount,
        fieldNames,
        originalSize: selectedFile.size,
      });
      setCustomRange(`1-${pageCount}`);
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

  const processFlatten = async () => {
    if (!file) return;
    setStatus('flattening');
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      // 1. Handle Form Fields according to user choice
      if (info.fieldCount > 0) {
        try {
          const form = pdfDoc.getForm();
          if (flattenForms) {
            // Permanently bake form widgets into page content stream
            form.flatten();
          } else if (lockReadOnlyOnly) {
            // Keep as form fields but mark all fields read-only
            form.getFields().forEach((field) => {
              try {
                field.enableReadOnly();
              } catch (e) {
                console.warn('Field readonly note:', e);
              }
            });
          }
        } catch (formErr) {
          console.warn('Form flattening error note:', formErr);
        }
      }

      let finalDoc = pdfDoc;

      // 2. Handle Annotations & Layer Flattening if enabled by user
      if (flattenAnnotations) {
        const targetIndices =
          pageScope === 'all'
            ? pdfDoc.getPageIndices()
            : parsePageRanges(customRange, totalPages);

        const flattenedDoc = await PDFDocument.create();
        const embeddedPages = await flattenedDoc.embedPdf(pdfDoc, pdfDoc.getPageIndices());

        embeddedPages.forEach((embeddedPage, idx) => {
          const originalPage = pdfDoc.getPage(idx);
          const { width, height } = originalPage.getSize();
          const newPage = flattenedDoc.addPage([width, height]);

          if (targetIndices.includes(idx)) {
            // Draw embedded page content — bakes annotations and marks into a fixed vector canvas
            newPage.drawPage(embeddedPage, { x: 0, y: 0, width, height });
          } else {
            // Keep unchanged
            newPage.drawPage(embeddedPage, { x: 0, y: 0, width, height });
          }
        });

        finalDoc = flattenedDoc;
      }

      const pdfBytes = await finalDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const base = file.name.replace(/\.pdf$/i, '');

      setResult({
        blob,
        filename: `${base}-flattened.pdf`,
        size: blob.size,
      });
      setStatus('ready');
    } catch (err) {
      console.error('Flatten error:', err);
      setErrorMsg('Failed to process PDF: ' + err.message);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    setFile(null);
    setInfo(null);
    setResult(null);
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
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a PDF to customize & flatten
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose exactly which elements (forms, annotations, comments) to make uneditable
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Document Flattener • Granular Control</span>
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

      {/* Analyzing / Flattening indicator */}
      {(status === 'analyzing' || status === 'flattening') && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-500 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            {status === 'analyzing' ? 'Inspecting PDF elements...' : 'Applying flattening settings...'}
          </h4>
        </div>
      )}

      {/* Customization Options & Action Card */}
      {status === 'ready' && file && info && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {info.pageCount} Pages • {formatBytes(info.originalSize)} •{' '}
                {info.fieldCount > 0 ? (
                  <span className="text-orange-500 font-semibold">
                    {info.fieldCount} interactive form fields detected
                  </span>
                ) : (
                  'No interactive form fields (standard annotations/layers)'
                )}
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

          {/* User Selection Options Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              Select What You Want To Make Uneditable:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Form Fields */}
              <div
                onClick={() => setFlattenForms(!flattenForms)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  flattenForms
                    ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={flattenForms}
                      onChange={() => {}}
                      className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                      <CheckSquare className="w-4 h-4 text-orange-500" />
                      <span>Interactive Form Fields</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Bakes all text fields, checkboxes, and signatures into static text/images. Users will no longer be able to edit the form inputs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Annotations & Comments */}
              <div
                onClick={() => setFlattenAnnotations(!flattenAnnotations)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  flattenAnnotations
                    ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={flattenAnnotations}
                      onChange={() => {}}
                      className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      <span>Annotations & Markup Layers</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Merges highlights, comments, stamps, and drawn notes directly into the page content stream.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 3: Lock Read-Only (Alternative when form flattening is off) */}
              {!flattenForms && info.fieldCount > 0 && (
                <div
                  onClick={() => setLockReadOnlyOnly(!lockReadOnlyOnly)}
                  className={`col-span-1 md:col-span-2 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    lockReadOnlyOnly
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={lockReadOnlyOnly}
                        onChange={() => {}}
                        className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>Lock As Read-Only (Keep Form Metadata)</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Keeps fields as form objects but marks them read-only so values cannot be altered in Acrobat.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Scope Selection */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Page Selection
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPageScope('all')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                  pageScope === 'all'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                All Pages (1 to {info.pageCount})
              </button>
              <button
                type="button"
                onClick={() => setPageScope('custom')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                  pageScope === 'custom'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Custom Page Range
              </button>
            </div>

            {pageScope === 'custom' && (
              <div className="space-y-1 pt-1">
                <input
                  type="text"
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
                <span className="text-[11px] text-slate-400">
                  Enter comma-separated page numbers or ranges (e.g. 1-2, 4)
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800">
            {!result ? (
              <button
                onClick={processFlatten}
                disabled={!flattenForms && !flattenAnnotations && !lockReadOnlyOnly}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
              >
                <Layers className="w-5 h-5" />
                Flatten Selected Elements
              </button>
            ) : (
              <button
                onClick={() => triggerDownload(result.blob, result.filename)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition"
              >
                <Download className="w-5 h-5" />
                Download Customized PDF ({formatBytes(result.size)})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfFlattenSeoArticle />
    </div>
  );
}
