import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  ArrowRightLeft,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileCode,
  Sparkles,
  X,
} from 'lucide-react';
import { convertPdfToDocx, convertDocxToPdf } from '../../lib/pdfWord';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';

export default function PdfWord() {
  const [file, setFile] = useState(null);
  const [direction, setDirection] = useState(null); // 'pdf2docx' | 'docx2pdf'
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');
    const ext = selectedFile.name.toLowerCase().split('.').pop();
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMsg('Please select a valid .pdf or .docx file.');
      return;
    }
    setFile(selectedFile);
    setDirection(ext === 'pdf' ? 'pdf2docx' : 'docx2pdf');
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

  const handleConvert = async () => {
    if (!file || !direction) return;

    setStatus('processing');
    setErrorMsg('');
    setProgressInfo({ progress: 5, message: 'Starting conversion…' });

    abortControllerRef.current = new AbortController();

    try {
      let outputBlob;
      let outName;
      const baseName = file.name.replace(/\.[^.]+$/, '');

      if (direction === 'pdf2docx') {
        outputBlob = await convertPdfToDocx(
          file,
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
        outName = `${baseName}.docx`;
      } else {
        outputBlob = await convertDocxToPdf(
          file,
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
        outName = `${baseName}.pdf`;
      }

      setResult({
        blob: outputBlob,
        filename: outName,
        size: outputBlob.size,
      });
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Conversion was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during conversion.');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleDownload = () => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
  };

  const handleReset = () => {
    setFile(null);
    setDirection(null);
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
            <ArrowRightLeft className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF ↔ Word Converter</h2>
            <p className="text-xs text-slate-400">Convert PDF to DOCX and DOCX back to PDF</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Client-Side • Fast & Secure</span>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block">Conversion Notice</strong>
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
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleSelectFile(e.target.files?.[0])}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop your PDF or Word document here
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Auto-detects format. Converts PDF to editable DOCX or DOCX to PDF right on your device.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose File
            </div>
          </div>
        )}

        {/* File Selected & Ready */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {direction === 'pdf2docx' ? <FileText className="w-6 h-6" /> : <FileCode className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatBytes(file.size)} • Target:{' '}
                    <strong className="text-orange-600 uppercase font-semibold">
                      {direction === 'pdf2docx' ? 'DOCX (Word)' : 'PDF'}
                    </strong>
                  </p>
                </div>
              </div>

              {status !== 'processing' && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              )}
            </div>

            {/* Processing Progress */}
            {status === 'processing' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Converting…'}
                  </span>
                  <span className="font-bold text-orange-600">{progressInfo.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressInfo.progress}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCancel}
                    className="text-xs text-slate-500 hover:text-rose-600 font-medium transition"
                  >
                    Cancel conversion
                  </button>
                </div>
              </div>
            )}

            {/* Convert Button */}
            {status !== 'processing' && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Convert to {direction === 'pdf2docx' ? 'Word (.docx)' : 'PDF'}
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
              <h3 className="text-2xl font-bold text-slate-900">Conversion Finished!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Your file is ready. Processed in your browser with zero data loss.
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-xs text-slate-700 font-medium shadow-sm">
                <span>{result.filename}</span>
                <span>•</span>
                <span>{formatBytes(result.size)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={handleDownload}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Converted File
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Convert Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
