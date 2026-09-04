import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  Zap,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  X,
  Sliders,
  Flame,
} from 'lucide-react';
import {
  compressPdf,
  validatePdfFile,
  formatBytes,
  COMPRESSION_LEVELS,
  triggerDownload,
} from '../../lib/pdfCompressor';
import PdfCompressorSeoArticle from './PdfCompressorSeoArticle';

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('high'); // 'low' | 'medium' | 'high' | 'extreme' | 'custom'
  const [customQuality, setCustomQuality] = useState(25);
  const [customDimension, setCustomDimension] = useState(650);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [status, setStatus] = useState('idle'); // 'idle' | 'compressing' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');
    try {
      await validatePdfFile(selectedFile);
      setFile(selectedFile);
      setStatus('idle');
      setResult(null);
    } catch (err) {
      setFile(null);
      setErrorMsg(err.message || 'Please select a valid .pdf document.');
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) {
        handleSelectFile(dropped);
      }
    },
    [handleSelectFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleStartCompression = async (forcedLevel) => {
    if (!file) return;

    const activeLevel = forcedLevel || (isCustomMode
      ? { quality: customQuality / 100, maxDimension: customDimension }
      : level);

    setStatus('compressing');
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: 'Discovering PDF streams and embedded images…' });

    abortControllerRef.current = new AbortController();

    try {
      const res = await compressPdf(
        file,
        activeLevel,
        (p) => setProgressInfo(p),
        abortControllerRef.current.signal
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Compression was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during compression.');
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
    if (!result || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(result.blob, `${base}-compressed.pdf`);
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Privacy Notice Pill */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bank-Grade Document Privacy • Zero Data Retention</span>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 backdrop-blur-md relative overflow-hidden">
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-rose-500 hover:text-rose-700 transition"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Upload / Drop Zone (when not in compressing / completed state) */}
        {status === 'idle' && !file && (
          <div className="space-y-8">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                isDragOver
                  ? 'border-orange-500 bg-orange-50/50 scale-[1.01] shadow-lg'
                  : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50/50 bg-slate-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleSelectFile(e.target.files[0]);
                }}
              />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <Upload className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Choose a PDF or drag & drop here
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Strictly accepts standard <span className="font-semibold text-slate-700">.PDF</span> documents
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Select PDF File
              </button>
            </div>

            {/* Compression Level Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Compression Level Preset
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {isCustomMode ? 'Use Standard Presets' : 'Custom Sliders'}
                </button>
              </div>

              {!isCustomMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.values(COMPRESSION_LEVELS).map((lvl) => {
                    const isSelected = level === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setLevel(lvl.id)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all relative ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/5 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-slate-900 flex items-center gap-1">
                            {lvl.id === 'extreme' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                            {lvl.name}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{lvl.description}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Image Quality: {customQuality}%</span>
                      <span className="text-slate-500">(Lower = Smaller file size)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={customQuality}
                      onChange={(e) => setCustomQuality(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Max Resolution: {customDimension}px</span>
                      <span className="text-slate-500">(Downscales large images/scans)</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="1800"
                      step="50"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. File Selected View (Configure & Start) */}
        {file && status === 'idle' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Selected File Details Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-base" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Original File Size: <span className="text-slate-900 font-semibold">{formatBytes(file.size)}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="self-start sm:self-center text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Choose Different File
              </button>
            </div>

            {/* Compression Level Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Select Compression Level
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {isCustomMode ? 'Use Standard Presets' : 'Custom Sliders'}
                </button>
              </div>

              {!isCustomMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.values(COMPRESSION_LEVELS).map((lvl) => {
                    const isSelected = level === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setLevel(lvl.id)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all relative ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/5 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-slate-900 flex items-center gap-1">
                            {lvl.id === 'extreme' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                            {lvl.name}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{lvl.description}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Image Quality: {customQuality}%</span>
                      <span className="text-slate-500">(Lower = Smaller file size)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={customQuality}
                      onChange={(e) => setCustomQuality(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Max Resolution: {customDimension}px</span>
                      <span className="text-slate-500">(Downscales large images/scans)</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="1800"
                      step="50"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleStartCompression()}
                className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5" />
                Compress PDF Now
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 3. Compression Progress View */}
        {status === 'compressing' && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 mx-auto flex items-center justify-center animate-pulse">
              <Layers className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Compressing Your PDF…
              </h3>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {progressInfo.message || 'Processing document structure and embedded images…'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>{progressInfo.current ? `Image ${progressInfo.current} of ${progressInfo.total}` : 'Optimising streams'}</span>
                <span className="text-orange-600">{progressInfo.progress}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 ease-out"
                  style={{ width: `${progressInfo.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition"
              >
                Cancel Compression
              </button>
            </div>
          </div>
        )}

        {/* 4. Results & Download View */}
        {status === 'completed' && result && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {result.reduction > 0 ? 'PDF Compressed Successfully!' : 'Optimization Completed'}
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
                {result.reduction > 0
                  ? `Your file has been compressed by ${result.reduction}% with crystal-clear text quality preserved.`
                  : 'The embedded content is already optimized or vector-based.'}
              </p>
            </div>

            {/* Size Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original Size</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{formatBytes(result.originalSize)}</p>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compressed Size</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">{formatBytes(result.compressedSize)}</p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Saved</span>
                <p className="text-xl font-bold text-orange-600 mt-1">
                  {result.reduction > 0 ? `-${result.reduction}%` : '0%'}
                </p>
              </div>
            </div>

            {/* Document Composition Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                <span className="text-slate-800 font-semibold">Document Breakdown:</span>
                <span>
                  {result.totalPages} page(s) • {result.totalImages} embedded image(s) found • {result.processedImages} recompressed
                </span>
              </div>
              {result.totalImages === 0 && (
                <p className="text-slate-500">
                  ℹ️ This PDF consists primarily of vector text/paths and embedded fonts. Vector graphics and selectable text are losslessly preserved.
                </p>
              )}
              {result.reduction <= 60 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                  <span className="text-amber-800 font-medium">
                    Need even smaller file size? Recompress with <strong>Extreme Compression (15% quality / 500px)</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartCompression('extreme')}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition shrink-0 flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Compress with Extreme Mode
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Compress Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid sm:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Smart Image Optimization</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Finds and compresses heavy photos, background scans, and graphics while keeping document text 100% crisp and readable.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Fast & Smooth Processing</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Efficiently handles multi-page documents and large PDF files smoothly without lag, queues, or long waiting times.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Extreme Compression Mode</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Shrink heavy scanned pages and large documents by up to 80%–90% with custom quality and dimension sliders.
          </p>
        </div>
      </div>

      {/* Complete SEO Master Guide & Knowledge Base */}
      <PdfCompressorSeoArticle />
    </div>
  );
}
