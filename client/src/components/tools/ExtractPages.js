import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText,
  Upload,
  Layers,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import {
  loadPdfForExtraction,
  renderPageThumbnail,
  parseRangeString,
  extractPagesToPdf,
} from '../../lib/extractPages';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import ExtractPagesSeoArticle from './ExtractPagesSeoArticle';

export default function ExtractPages() {
  const [file, setFile] = useState(null);
  const [fileBytes, setFileBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [rangeText, setRangeText] = useState('');

  const [status, setStatus] = useState('idle'); // 'idle' | 'loadingDoc' | 'ready' | 'extracting' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRefs = useRef({});

  const handleSelectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');

    if (!/\.pdf$/i.test(selectedFile.name)) {
      setErrorMsg('Please select a valid .pdf file.');
      return;
    }

    setStatus('loadingDoc');
    setProgressInfo({ progress: 10, message: 'Rendering page previews…' });

    try {
      const data = await loadPdfForExtraction(selectedFile);
      setFile(selectedFile);
      setFileBytes(data.fileBytes);
      setPdfDoc(data.pdfDoc);
      setNumPages(data.numPages);
      setSelectedPages(new Set([1])); // default select first page
      setStatus('ready');
    } catch (err) {
      setFile(null);
      setStatus('error');
      setErrorMsg(err.message || 'Could not load PDF document.');
    }
  }, []);

  // Render thumbnails once pages are loaded
  useEffect(() => {
    if (status === 'ready' && pdfDoc && numPages > 0) {
      for (let p = 1; p <= numPages; p++) {
        const canvas = canvasRefs.current[p];
        if (canvas) {
          renderPageThumbnail(pdfDoc, p, canvas, 0.35).catch((err) =>
            console.warn(`Thumbnail error page ${p}:`, err)
          );
        }
      }
    }
  }, [status, pdfDoc, numPages]);

  const togglePage = (p) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const handleSelectAll = () => {
    const all = new Set(Array.from({ length: numPages }, (_, i) => i + 1));
    setSelectedPages(all);
  };

  const handleSelectNone = () => {
    setSelectedPages(new Set());
  };

  const handleApplyRange = () => {
    if (!rangeText.trim()) return;
    const parsed = parseRangeString(rangeText, numPages);
    if (parsed.size === 0) {
      setErrorMsg('No valid page numbers found in that range.');
      return;
    }
    setErrorMsg('');
    setSelectedPages(parsed);
  };

  const handleExtract = async () => {
    if (!fileBytes || selectedPages.size === 0) return;

    setStatus('extracting');
    setErrorMsg('');

    try {
      const res = await extractPagesToPdf(
        fileBytes,
        selectedPages,
        file.name,
        (p) => setProgressInfo(p)
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Error extracting pages from PDF.');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
  };

  const handleReset = () => {
    setFile(null);
    setFileBytes(null);
    setPdfDoc(null);
    setNumPages(0);
    setSelectedPages(new Set());
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: '' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">Extract Pages from PDF</h2>
            <p className="text-xs text-slate-400">Select specific pages and save them as a new PDF</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>High-Precision Page Extraction • Lossless Output</span>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block">Notice</strong>
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-rose-400 hover:text-rose-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dropzone */}
        {!file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) handleSelectFile(dropped);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 md:p-14 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-orange-500 bg-orange-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleSelectFile(e.target.files?.[0])}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop your PDF to extract pages
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Visual thumbnail selection. Pick individual pages or enter ranges to create a fresh new PDF.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {/* File & Page Grid */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatBytes(file.size)} • Total Pages: {numPages} • Selected:{' '}
                  <strong className="text-orange-600 font-bold">{selectedPages.size}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Range selector */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-100/70 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-700">Select by Range:</span>
              <input
                type="text"
                placeholder="e.g. 1-3, 5, 7-10"
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-orange-500 w-48"
              />
              <button
                onClick={handleApplyRange}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
              >
                Apply Range
              </button>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[480px] overflow-y-auto p-2 border border-slate-200 rounded-2xl bg-slate-50/50">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => {
                const isSelected = selectedPages.has(p);
                return (
                  <div
                    key={p}
                    onClick={() => togglePage(p)}
                    className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <canvas
                        ref={(el) => {
                          canvasRefs.current[p] = el;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Page {p}</span>
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'border border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            {status === 'extracting' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Extracting pages…'}
                  </span>
                  <span className="font-bold text-orange-600">{progressInfo.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressInfo.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            {status !== 'extracting' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtract}
                  disabled={selectedPages.size === 0}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Extract {selectedPages.size} Page{selectedPages.size === 1 ? '' : 's'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed View */}
        {status === 'completed' && result && (
          <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Pages Extracted!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Successfully extracted <strong>{result.pageCount}</strong> selected page
                {result.pageCount === 1 ? '' : 's'} into a new PDF document.
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-xs text-slate-700 font-medium shadow-sm">
                <span>{result.filename}</span>
                <span>•</span>
                <span>{formatBytes(result.blob.size)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={handleDownload}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Extracted PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Extract Another File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete SEO Master Guide & Knowledge Base */}
      <ExtractPagesSeoArticle />
    </div>
  );
}
