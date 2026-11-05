import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { loadPdfForRemoval, removePagesFromPdf } from '../../../lib/pdfPageRemover.js';
import { renderOrganizerThumbnail } from '../../../lib/pdfOrganizer.js';
import { formatBytes, triggerDownload } from '../../../lib/pdfCommon.js';

export default function PdfPageRemover() {
  const [file, setFile] = useState(null);
  const [fileBytes, setFileBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [removedIndices, setRemovedIndices] = useState(new Set());

  const [status, setStatus] = useState('idle'); // 'idle' | 'ready' | 'processing' | 'completed' | 'error'
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

    try {
      const data = await loadPdfForRemoval(selectedFile);
      setFile(selectedFile);
      setFileBytes(data.fileBytes);
      setPdfDoc(data.pdfDoc);
      setNumPages(data.numPages);
      setRemovedIndices(new Set());
      setStatus('ready');
    } catch (err) {
      setFile(null);
      setErrorMsg(err.message || 'Could not load PDF document.');
    }
  }, []);

  // Render thumbnails
  useEffect(() => {
    if (status === 'ready' && pdfDoc && numPages > 0) {
      for (let p = 1; p <= numPages; p++) {
        const canvas = canvasRefs.current[p];
        if (canvas) {
          renderOrganizerThumbnail(pdfDoc, p, canvas, 0, 0.35).catch((err) =>
            console.warn('Thumbnail render error:', err)
          );
        }
      }
    }
  }, [status, pdfDoc, numPages]);

  const toggleRemove = (index) => {
    setRemovedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const removeOdd = () => {
    const odds = new Set();
    for (let i = 0; i < numPages; i++) {
      if ((i + 1) % 2 !== 0) odds.add(i);
    }
    setRemovedIndices(odds);
  };

  const removeEven = () => {
    const evens = new Set();
    for (let i = 0; i < numPages; i++) {
      if ((i + 1) % 2 === 0) evens.add(i);
    }
    setRemovedIndices(evens);
  };

  const clearMarks = () => {
    setRemovedIndices(new Set());
  };

  const handleRemove = async () => {
    if (!fileBytes || removedIndices.size === 0) return;
    if (removedIndices.size >= numPages) {
      setErrorMsg('Cannot remove all pages from the document.');
      return;
    }

    setStatus('processing');
    setErrorMsg('');

    try {
      const res = await removePagesFromPdf(
        fileBytes,
        removedIndices,
        numPages,
        file.name,
        (p) => setProgressInfo(p)
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Error occurred while removing pages.');
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
    setRemovedIndices(new Set());
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  };

  const remainingCount = numPages - removedIndices.size;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <Trash2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF Page Remover</h2>
            <p className="text-xs text-slate-400">Click unwanted pages to strike them out and remove them</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Lossless Page Trimmer • Instant Output</span>
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
              Select or Drop your PDF to delete pages
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Visual page striker. Click on any page to mark it for deletion, then save your clean PDF.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {/* Page Strikethrough Grid */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatBytes(file.size)} • Total: {numPages} • Marked to Delete:{' '}
                  <strong className="text-rose-600 font-bold">{removedIndices.size}</strong> • Remaining:{' '}
                  <strong className="text-emerald-600 font-bold">{remainingCount}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={removeOdd}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Mark Odd Pages
                </button>
                <button
                  onClick={removeEven}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Mark Even Pages
                </button>
                <button
                  onClick={clearMarks}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Clear Marks
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-3 border border-slate-200 rounded-2xl bg-slate-50/50">
              {Array.from({ length: numPages }, (_, i) => i).map((idx) => {
                const isRemoved = removedIndices.has(idx);
                const pageNum = idx + 1;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleRemove(idx)}
                    className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md ${
                      isRemoved
                        ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-400/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative transition-all ${
                        isRemoved ? 'opacity-40 grayscale' : ''
                      }`}
                    >
                      <canvas
                        ref={(el) => {
                          canvasRefs.current[pageNum] = el;
                        }}
                        className="w-full h-full object-contain"
                      />
                      {isRemoved && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-900/20">
                          <X className="w-12 h-12 text-rose-600 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${isRemoved ? 'text-rose-600 line-through' : 'text-slate-700'}`}>
                        Page {pageNum}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isRemoved ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isRemoved ? 'DELETE' : 'KEEP'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            {status === 'processing' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Removing pages…'}
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
            {status !== 'processing' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={removedIndices.size === 0 || remainingCount <= 0}
                  className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete {removedIndices.size} Page{removedIndices.size === 1 ? '' : 's'} & Save PDF
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
              <h3 className="text-2xl font-bold text-slate-900">Pages Removed Successfully!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Removed <strong>{result.removedCount}</strong> unwanted page{result.removedCount === 1 ? '' : 's'}.{' '}
                Your new document contains <strong>{result.remainingCount}</strong> pages.
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
                Download Cleaned PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Remove Pages from Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
