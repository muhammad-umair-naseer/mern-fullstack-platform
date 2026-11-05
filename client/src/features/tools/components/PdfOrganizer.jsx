import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText,
  Upload,
  LayoutGrid,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Copy,
  Trash2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  loadPdfForOrganizing,
  renderOrganizerThumbnail,
  saveOrganizedPdf,
} from '../../../lib/pdfOrganizer.js';
import { formatBytes, triggerDownload } from '../../../lib/pdfCommon.js';

export default function PdfOrganizer() {
  const [file, setFile] = useState(null);
  const [fileBytes, setFileBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]); // array of { id, originalPageIndex, pageNumber, rotation }

  const [status, setStatus] = useState('idle'); // 'idle' | 'ready' | 'saving' | 'completed' | 'error'
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
      const data = await loadPdfForOrganizing(selectedFile);
      setFile(selectedFile);
      setFileBytes(data.fileBytes);
      setPdfDoc(data.pdfDoc);
      setPages(data.initialPages);
      setStatus('ready');
    } catch (err) {
      setFile(null);
      setErrorMsg(err.message || 'Could not load PDF document.');
    }
  }, []);

  // Render thumbnails on canvas
  useEffect(() => {
    if (status === 'ready' && pdfDoc && pages.length > 0) {
      pages.forEach((p) => {
        const canvas = canvasRefs.current[p.id];
        if (canvas) {
          renderOrganizerThumbnail(
            pdfDoc,
            p.originalPageIndex + 1,
            canvas,
            p.rotation,
            0.35
          ).catch((err) => console.warn('Thumbnail render error:', err));
        }
      });
    }
  }, [status, pdfDoc, pages]);

  const movePage = (index, dir) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const rotatePage = (id) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const duplicatePage = (index) => {
    setPages((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const newPage = {
        ...target,
        id: `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      copy.splice(index + 1, 0, newPage);
      return copy;
    });
  };

  const deletePage = (index) => {
    if (pages.length <= 1) {
      setErrorMsg('A PDF must contain at least one page.');
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fileBytes || pages.length === 0) return;

    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await saveOrganizedPdf(
        fileBytes,
        pages,
        file.name,
        (p) => setProgressInfo(p)
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Error saving organized PDF.');
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
    setPages([]);
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <LayoutGrid className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF Organizer</h2>
            <p className="text-xs text-slate-400">Reorder, rotate, duplicate, and delete pages visually</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Interactive Page Studio • High Precision</span>
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
              Select or Drop your PDF to organize pages
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Visual page organizer. Move pages around, rotate individual pages, duplicate or remove unnecessary pages.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF Document
            </div>
          </div>
        )}

        {/* Organizer Canvas */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatBytes(file.size)} • Total Output Pages:{' '}
                  <strong className="text-orange-600 font-bold">{pages.length}</strong>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Grid of Pages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-3 border border-slate-200 rounded-2xl bg-slate-50/50">
              {pages.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-orange-300 transition"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[p.id] = el;
                      }}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/70 text-white font-mono text-[10px] font-bold">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        title="Move Left"
                        disabled={idx === 0}
                        onClick={() => movePage(idx, -1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Move Right"
                        disabled={idx === pages.length - 1}
                        onClick={() => movePage(idx, 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Rotate 90°"
                        onClick={() => rotatePage(p.id)}
                        className="p-1 rounded hover:bg-orange-100 text-slate-500 hover:text-orange-600 transition"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Duplicate Page"
                        onClick={() => duplicatePage(idx)}
                        className="p-1 rounded hover:bg-emerald-100 text-slate-500 hover:text-emerald-600 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Page"
                        onClick={() => deletePage(idx)}
                        className="p-1 rounded hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            {status === 'saving' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Saving organized PDF…'}
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
            {status !== 'saving' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Save Organized PDF ({pages.length} pages)
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
              <h3 className="text-2xl font-bold text-slate-900">PDF Organized Successfully!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Your new PDF has been compiled with your exact custom ordering and page rotations.
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
                Download Organized PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Organize Another Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
