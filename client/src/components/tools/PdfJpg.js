import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sliders,
  Sparkles,
  X,
  Plus,
} from 'lucide-react';
import { convertPdfToJpg, convertJpgToPdf } from '../../lib/pdfJpg';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import PdfJpgSeoArticle from './PdfJpgSeoArticle';

export default function PdfJpg() {
  const [mode, setMode] = useState('pdf2jpg'); // 'pdf2jpg' | 'jpg2pdf'
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2.0);

  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      setErrorMsg('');

      if (mode === 'pdf2jpg') {
        const file = Array.from(files).find((f) => /\.pdf$/i.test(f.name));
        if (!file) {
          setErrorMsg('Please select a valid .pdf file.');
          return;
        }
        setPdfFile(file);
      } else {
        const images = Array.from(files).filter((f) =>
          /\.(jpe?g|png|webp)$/i.test(f.name)
        );
        if (images.length === 0) {
          setErrorMsg('Please select JPG, PNG, or WebP image files.');
          return;
        }
        setImageFiles((prev) => [...prev, ...images]);
      }
      setStatus('idle');
      setResult(null);
    },
    [mode]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files;
      if (dropped && dropped.length > 0) handleSelectFiles(dropped);
    },
    [handleSelectFiles]
  );

  const handleConvert = async () => {
    setStatus('processing');
    setErrorMsg('');
    setProgressInfo({ progress: 5, message: 'Preparing conversion…' });

    abortControllerRef.current = new AbortController();

    try {
      if (mode === 'pdf2jpg') {
        if (!pdfFile) return;
        const res = await convertPdfToJpg(
          pdfFile,
          { quality: quality / 100, scale },
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
        setResult(res);
      } else {
        if (imageFiles.length === 0) return;
        const res = await convertJpgToPdf(
          imageFiles,
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
        setResult(res);
      }
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Conversion was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Error occurred during conversion.');
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
    setPdfFile(null);
    setImageFiles([]);
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: '' });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <ImageIcon className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF ↔ JPG Converter</h2>
            <p className="text-xs text-slate-400">Convert PDF pages to JPG or convert JPG images to PDF</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>High-Resolution Page Rasterizer • Crisp Output</span>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        {/* Mode Toggle Switch */}
        {status !== 'completed' && status !== 'processing' && (
          <div className="flex justify-center">
            <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex gap-1">
              <button
                onClick={() => {
                  setMode('pdf2jpg');
                  handleReset();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  mode === 'pdf2jpg'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PDF → JPG
              </button>
              <button
                onClick={() => {
                  setMode('jpg2pdf');
                  handleReset();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  mode === 'jpg2pdf'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JPG / Images → PDF
              </button>
            </div>
          </div>
        )}

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

        {/* Dropzone for PDF -> JPG */}
        {mode === 'pdf2jpg' && !pdfFile && (
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
              onChange={(e) => handleSelectFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop your PDF to export as JPG images
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Converts each PDF page into a high-definition JPG image instantly.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {/* Dropzone for JPG -> PDF */}
        {mode === 'jpg2pdf' && imageFiles.length === 0 && (
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
              accept=".jpg,.jpeg,.png,.webp,image/*"
              multiple
              onChange={(e) => handleSelectFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop images to build a PDF
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Supports multiple JPG and PNG images. Combine into one formatted document.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <ImageIcon className="w-4 h-4" />
              Choose Images
            </div>
          </div>
        )}

        {/* PDF selected in PDF -> JPG mode */}
        {mode === 'pdf2jpg' && pdfFile && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                    {pdfFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatBytes(pdfFile.size)} • Target: High-Quality JPG Images
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

            {/* Quality Settings */}
            {status !== 'processing' && (
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  Image Quality & Resolution
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      JPEG Quality: <span className="text-orange-600 font-bold">{quality}%</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Resolution Scale: <span className="text-orange-600 font-bold">{scale}x</span>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.5"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
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
              </div>
            )}

            {/* Action */}
            {status !== 'processing' && (
              <div className="flex justify-end gap-3 pt-2">
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
                  <ImageIcon className="w-4 h-4" />
                  Convert to JPG
                </button>
              </div>
            )}
          </div>
        )}

        {/* Images selected in JPG -> PDF mode */}
        {mode === 'jpg2pdf' && imageFiles.length > 0 && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {imageFiles.length} Image{imageFiles.length === 1 ? '' : 's'} Selected
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total Size:{' '}
                  {formatBytes(imageFiles.reduce((acc, f) => acc + f.size, 0))}
                </p>
              </div>

              {status !== 'processing' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add more
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Clear
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/*"
                    multiple
                    onChange={(e) => handleSelectFiles(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* List of images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto p-2 border border-slate-200 rounded-2xl bg-slate-50/50">
              {imageFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative p-2 rounded-xl bg-white border border-slate-200 flex flex-col justify-between group"
                >
                  <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                    {idx + 1}. {file.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{formatBytes(file.size)}</div>
                  {status !== 'processing' && (
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            {status === 'processing' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Building PDF…'}
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

            {/* Action */}
            {status !== 'processing' && (
              <div className="flex justify-end gap-3 pt-2">
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
                  <FileText className="w-4 h-4" />
                  Combine into PDF
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
              <h3 className="text-2xl font-bold text-slate-900">Conversion Successful!</h3>
              <p className="text-sm text-slate-600 mt-1">
                {mode === 'pdf2jpg'
                  ? 'All pages have been converted to high-definition JPEG images.'
                  : `Successfully compiled ${result.imageCount || imageFiles.length} images into a PDF.`}
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
                Download {mode === 'pdf2jpg' ? 'JPG Files' : 'PDF Document'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Convert Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfJpgSeoArticle />
    </div>
  );
}
