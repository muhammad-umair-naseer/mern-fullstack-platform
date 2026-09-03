import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  ScanText,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import { performPdfOcr } from '../../lib/pdfOcr';
import { formatBytes } from '../../lib/pdfCommon';

export default function PdfOcr() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');

    if (!/\.pdf$/i.test(selectedFile.name)) {
      setErrorMsg('Please select a valid .pdf file.');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setResult(null);
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

  const handleStartOcr = async () => {
    if (!file) return;

    setStatus('scanning');
    setErrorMsg('');
    setProgressInfo({ progress: 5, message: 'Initializing OCR Engine…' });

    abortControllerRef.current = new AbortController();

    try {
      const res = await performPdfOcr(
        file,
        { language },
        (p) => setProgressInfo(p),
        abortControllerRef.current.signal
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('OCR scan was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Error occurred during OCR extraction.');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCopy = () => {
    if (!result?.combinedText) return;
    navigator.clipboard.writeText(result.combinedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!result?.combinedText || !file) return;
    const blob = new Blob([result.combinedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const base = file.name.replace(/\.pdf$/i, '');
    a.href = url;
    a.download = `${base}-ocr-text.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const handleReset = () => {
    setFile(null);
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
            <ScanText className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF OCR & Text Extractor</h2>
            <p className="text-xs text-slate-400">Extract readable, searchable text from scanned or image PDFs</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Client-Side • In-Browser Tesseract</span>
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
              Select or Drop your Scanned PDF here
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Our in-browser OCR scanner extracts all text from images and paper scans with zero server uploads.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <ScanText className="w-4 h-4" />
              Choose Scanned PDF
            </div>
          </div>
        )}

        {/* File Config & Action */}
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
                    {formatBytes(file.size)} • OCR Language:{' '}
                    <strong className="text-orange-600 uppercase font-semibold">{language}</strong>
                  </p>
                </div>
              </div>

              {status !== 'scanning' && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              )}
            </div>

            {/* Language Selector */}
            {status !== 'scanning' && (
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Document Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white font-semibold focus:outline-orange-500"
                >
                  <option value="eng">English (eng)</option>
                  <option value="spa">Spanish (spa)</option>
                  <option value="fra">French (fra)</option>
                  <option value="deu">German (deu)</option>
                  <option value="ita">Italian (ita)</option>
                  <option value="por">Portuguese (por)</option>
                  <option value="ara">Arabic (ara)</option>
                  <option value="urd">Urdu (urd)</option>
                  <option value="hin">Hindi (hin)</option>
                </select>
              </div>
            )}

            {/* Progress */}
            {status === 'scanning' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Scanning pages…'}
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
            {status !== 'scanning' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartOcr}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <ScanText className="w-4 h-4" />
                  Run OCR Text Extraction
                </button>
              </div>
            )}
          </div>
        )}

        {/* OCR Result View */}
        {status === 'completed' && result && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">OCR Extraction Complete!</h3>
                  <p className="text-xs text-slate-600">
                    Scanned {result.pageCount} page{result.pageCount === 1 ? '' : 's'} with high accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleDownloadText}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download .txt
                </button>
              </div>
            </div>

            {/* Extracted Text Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Recognized Text Output
              </div>
              <textarea
                readOnly
                value={result.combinedText}
                rows={12}
                className="w-full bg-slate-950/80 p-4 rounded-xl text-xs md:text-sm font-mono text-slate-200 border border-slate-800 focus:outline-none resize-y"
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Scan Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
