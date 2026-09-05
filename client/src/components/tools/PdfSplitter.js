import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  Scissors,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { splitPdf, parseRanges, chunkEveryN, everyPageSeparate } from '../../lib/pdfSplitter';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import PdfSplitterSeoArticle from './PdfSplitterSeoArticle';

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState('each'); // 'each' | 'everyN' | 'ranges'
  const [everyN, setEveryN] = useState(2);
  const [rangesInput, setRangesInput] = useState('');

  const [status, setStatus] = useState('idle'); // 'idle' | 'splitting' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');

    if (!/\.pdf$/i.test(selectedFile.name)) {
      setErrorMsg('Please select a valid .pdf file.');
      return;
    }

    try {
      const bytes = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();

      setFile(selectedFile);
      setTotalPages(count);
      setRangesInput(`1-${Math.min(3, count)}, ${Math.min(4, count)}`);
      setStatus('idle');
      setResult(null);
    } catch (err) {
      setFile(null);
      setErrorMsg(
        err.message.includes('encrypted')
          ? 'This PDF is password protected. Please unlock it before splitting.'
          : 'Could not read PDF document.'
      );
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

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;

    let computedRanges = [];
    try {
      if (splitMode === 'each') {
        computedRanges = everyPageSeparate(totalPages);
      } else if (splitMode === 'everyN') {
        computedRanges = chunkEveryN(totalPages, parseInt(everyN, 10));
      } else if (splitMode === 'ranges') {
        computedRanges = parseRanges(rangesInput, totalPages);
      }
    } catch (validationErr) {
      setErrorMsg(validationErr.message);
      return;
    }

    setStatus('splitting');
    setErrorMsg('');
    setProgressInfo({ progress: 5, message: 'Initiating split operation…' });

    abortControllerRef.current = new AbortController();

    try {
      const res = await splitPdf(
        file,
        computedRanges,
        (p) => setProgressInfo(p),
        abortControllerRef.current.signal
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Splitting was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred while splitting the PDF.');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: '' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <Scissors className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF Splitter</h2>
            <p className="text-xs text-slate-400">Extract pages, split into chunks or individual files</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise PDF Splitter • Zero Data Retention</span>
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
            onDrop={handleDrop}
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
              Select or Drop your PDF document to split
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Split into individual single-page documents, fixed size chunks, or custom page intervals.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {/* File Configured */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatBytes(file.size)} • Total Pages:{' '}
                    <strong className="text-orange-600 font-semibold">{totalPages}</strong>
                  </p>
                </div>
              </div>

              {status !== 'splitting' && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              )}
            </div>

            {/* Split Mode Selector */}
            {status !== 'splitting' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Split Mode
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Mode 1: Each page */}
                  <div
                    onClick={() => setSplitMode('each')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      splitMode === 'each'
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                        {splitMode === 'each' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">Every Page</strong>
                    </div>
                    <p className="text-xs text-slate-500">
                      Creates {totalPages} individual PDF files (1 page each).
                    </p>
                  </div>

                  {/* Mode 2: Every N pages */}
                  <div
                    onClick={() => setSplitMode('everyN')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      splitMode === 'everyN'
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                        {splitMode === 'everyN' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">Every N Pages</strong>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Group into equal page chunks.</p>
                    {splitMode === 'everyN' && (
                      <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs font-semibold text-slate-700">Pages per file:</span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={everyN}
                          onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-16 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg focus:outline-orange-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mode 3: Custom Ranges */}
                  <div
                    onClick={() => setSplitMode('ranges')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      splitMode === 'ranges'
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                        {splitMode === 'ranges' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">Custom Ranges</strong>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Specify exact page ranges.</p>
                    {splitMode === 'ranges' && (
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="e.g. 1-3, 5, 7-10"
                          value={rangesInput}
                          onChange={(e) => setRangesInput(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-orange-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Splitting Progress */}
            {status === 'splitting' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Splitting…'}
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
            {status !== 'splitting' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSplit}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  Split PDF
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
              <h3 className="text-2xl font-bold text-slate-900">PDF Split Successfully!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Created <strong>{result.count}</strong> split document{result.count === 1 ? '' : 's'}{' '}
                bundled inside a single zip archive.
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
                Download Split Files (.zip)
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Split Another PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfSplitterSeoArticle />
    </div>
  );
}
