import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  X,
  LayoutGrid,
  ListOrdered,
} from 'lucide-react';
import {
  validateAndInspectPdf,
  mergePdfs,
  mergePdfsByPagePlan,
  formatBytes,
  triggerDownload,
} from '../../lib/pdfMerger';

const FILE_COLORS = [
  'bg-blue-500/10 text-blue-700 border-blue-200',
  'bg-orange-500/10 text-orange-700 border-orange-200',
  'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  'bg-purple-500/10 text-purple-700 border-purple-200',
  'bg-amber-500/10 text-amber-700 border-amber-200',
  'bg-rose-500/10 text-rose-700 border-rose-200',
];

export default function PdfMerger() {
  const [entries, setEntries] = useState([]);
  const [organizeMode, setOrganizeMode] = useState('files'); // 'files' | 'pages'
  const [pagePlan, setPagePlan] = useState([]); // array of { id, entryId, fileName, fileIndex, pageIndex, pageNum }

  const [status, setStatus] = useState('idle'); // 'idle' | 'merging' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const [draggedFileIndex, setDraggedFileIndex] = useState(null);
  const [draggedPageIndex, setDraggedPageIndex] = useState(null);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const nextIdRef = useRef(1);

  // Sync pagePlan whenever valid entries change (if user hasn't heavily customized or on initial add)
  useEffect(() => {
    const valid = entries.filter((e) => e.status === 'ok');
    if (valid.length === 0) {
      setPagePlan([]);
      return;
    }

    // Build default sequential page plan
    const newPlan = [];
    valid.forEach((entry, fIdx) => {
      for (let p = 0; p < (entry.pageCount || 0); p++) {
        newPlan.push({
          id: `f${entry.id}_p${p}`,
          entryId: entry.id,
          fileName: entry.file.name,
          fileIndex: fIdx,
          pageIndex: p,
          pageDisplayNum: p + 1,
        });
      }
    });

    setPagePlan((prev) => {
      // If previous plan exists and has matching items, keep customized ordering where possible
      if (prev.length > 0) {
        const validIds = new Set(newPlan.map((x) => x.id));
        const filtered = prev.filter((p) => validIds.has(p.id));
        const existingIds = new Set(filtered.map((x) => x.id));
        const added = newPlan.filter((p) => !existingIds.has(p.id));
        return [...filtered, ...added];
      }
      return newPlan;
    });
  }, [entries]);

  const handleAddFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');

    const newItems = Array.from(files).map((file) => ({
      id: nextIdRef.current++,
      file,
      status: 'checking',
      pageCount: null,
      errorMsg: null,
    }));

    setEntries((prev) => [...prev, ...newItems]);

    // Inspect and validate each file asynchronously
    for (const item of newItems) {
      try {
        const info = await validateAndInspectPdf(item.file);
        setEntries((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: 'ok', pageCount: info.pageCount }
              : entry
          )
        );
      } catch (err) {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: 'error', errorMsg: err.message }
              : entry
          )
        );
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        handleAddFiles(droppedFiles);
      }
    },
    [handleAddFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // File sequence reordering
  const handleMoveFileUp = (index) => {
    if (index === 0) return;
    setEntries((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveFileDown = (index) => {
    if (index >= entries.length - 1) return;
    setEntries((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Drag & drop file reordering
  const handleFileDragStart = (e, index) => {
    setDraggedFileIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFileDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedFileIndex === null || draggedFileIndex === targetIndex) return;

    setEntries((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedFileIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedFileIndex(null);
  };

  // Page Plan controls (Move Left/Right, Jump, Delete)
  const handleMovePage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= pagePlan.length) return;
    setPagePlan((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleRemovePage = (index) => {
    setPagePlan((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetPagesToDefault = () => {
    const valid = entries.filter((e) => e.status === 'ok');
    const newPlan = [];
    valid.forEach((entry, fIdx) => {
      for (let p = 0; p < (entry.pageCount || 0); p++) {
        newPlan.push({
          id: `f${entry.id}_p${p}`,
          entryId: entry.id,
          fileName: entry.file.name,
          fileIndex: fIdx,
          pageIndex: p,
          pageDisplayNum: p + 1,
        });
      }
    });
    setPagePlan(newPlan);
  };

  // Page drag and drop
  const handlePageDragStart = (e, index) => {
    setDraggedPageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePageDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedPageIndex === null || draggedPageIndex === targetIndex) return;
    handleMovePage(draggedPageIndex, targetIndex);
    setDraggedPageIndex(null);
  };

  const handleClearAll = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setEntries([]);
    setPagePlan([]);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validEntries = entries.filter((e) => e.status === 'ok');
  const totalRawPages = validEntries.reduce((sum, e) => sum + (e.pageCount || 0), 0);
  const totalBytes = validEntries.reduce((sum, e) => sum + (e.file.size || 0), 0);

  const handleStartMerge = async () => {
    if (validEntries.length < 2) {
      setErrorMsg('Please add at least 2 valid PDF documents to merge.');
      return;
    }

    if (organizeMode === 'pages' && pagePlan.length === 0) {
      setErrorMsg('Please select at least 1 page in your custom page plan.');
      return;
    }

    setStatus('merging');
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: 'Starting PDF merge…' });

    abortControllerRef.current = new AbortController();

    try {
      let res;
      if (organizeMode === 'pages') {
        res = await mergePdfsByPagePlan(
          validEntries,
          pagePlan,
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
      } else {
        res = await mergePdfs(
          validEntries,
          (p) => setProgressInfo(p),
          abortControllerRef.current.signal
        );
      }
      setResult(res);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Merging was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during PDF merging.');
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
    if (!result || validEntries.length === 0) return;
    const baseName = validEntries[0].file.name.replace(/\.pdf$/i, '');
    triggerDownload(result.blob, `${baseName}-merged.pdf`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Privacy Banner */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bank-Grade Document Privacy • Zero Data Retention</span>
        </div>
      </div>

      {/* Main Interactive Container */}
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

        {/* 1. Upload / Drop Zone & Ordering Controls */}
        {status === 'idle' && (
          <div className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? 'border-orange-500 bg-orange-50/50 scale-[1.01] shadow-lg'
                  : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50/50 bg-slate-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleAddFiles(e.target.files);
                  }
                  e.target.value = '';
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <Upload className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {entries.length === 0 ? 'Choose PDF files or drag & drop here' : 'Add more PDF files'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select 2 or more <span className="font-semibold text-slate-700">.PDF</span> documents to merge in your chosen order
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Select PDF Files
              </button>
            </div>

            {/* When files are loaded: Controls & Mode Switcher */}
            {entries.length > 0 && (
              <div className="space-y-5 animate-fadeIn">
                {/* Summary Toolbar & Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">
                      {entries.length} File{entries.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {organizeMode === 'pages' ? `${pagePlan.length} Pages in Sequence` : `${totalRawPages} Total Pages`}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {formatBytes(totalBytes)}
                    </span>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrganizeMode('files')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        organizeMode === 'files'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      By File Sequence
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrganizeMode('pages')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        organizeMode === 'pages'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Page-by-Page Organizer 🔥
                    </button>
                  </div>
                </div>

                {/* ----------------- MODE A: File Order List ----------------- */}
                {organizeMode === 'files' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs text-slate-500 italic">
                        💡 Drag file cards by handle or use arrows to change file order.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add More
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {entries.map((entry, index) => (
                        <div
                          key={entry.id}
                          draggable
                          onDragStart={(e) => handleFileDragStart(e, index)}
                          onDragOver={handleFileDragOver}
                          onDrop={(e) => handleFileDrop(e, index)}
                          className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                            draggedFileIndex === index
                              ? 'opacity-40 border-dashed border-orange-500 bg-orange-50'
                              : entry.status === 'error'
                              ? 'border-rose-200 bg-rose-50/50'
                              : 'border-slate-200 hover:border-orange-300 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="cursor-grab text-slate-400 hover:text-slate-600 p-1 shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-slate-900 text-sm truncate" title={entry.file.name}>
                                {entry.file.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-xs">
                                {entry.status === 'checking' && (
                                  <span className="text-amber-600 font-medium animate-pulse">
                                    Validating document…
                                  </span>
                                )}
                                {entry.status === 'ok' && (
                                  <span className="text-slate-500 font-medium">
                                    {formatBytes(entry.file.size)} • <strong className="text-slate-800">{entry.pageCount} page{entry.pageCount === 1 ? '' : 's'}</strong>
                                  </span>
                                )}
                                {entry.status === 'error' && (
                                  <span className="text-rose-600 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {entry.errorMsg}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveFileUp(index)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === entries.length - 1}
                              onClick={() => handleMoveFileDown(index)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ml-1"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ----------------- MODE B: Visual Page-by-Page Sorter ----------------- */}
                {organizeMode === 'pages' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                      <span className="text-xs text-slate-600 font-medium">
                        ✨ Drag pages to reorder, use arrows (← →) or jump to position. Delete (🗑️) to exclude unwanted pages.
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleResetPagesToDefault}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reset Order
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Page Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-[480px] overflow-y-auto p-2 bg-slate-50/60 rounded-2xl border border-slate-200">
                      {pagePlan.map((item, index) => {
                        const colorClass = FILE_COLORS[item.fileIndex % FILE_COLORS.length];
                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handlePageDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handlePageDrop(e, index)}
                            className={`p-3 rounded-2xl bg-white border-2 shadow-sm transition-all duration-200 relative group flex flex-col justify-between ${
                              draggedPageIndex === index
                                ? 'opacity-40 border-dashed border-orange-500 scale-95'
                                : 'border-slate-200 hover:border-orange-400 hover:shadow-md'
                            }`}
                          >
                            {/* Card Top: Position Badge & Delete */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-7 h-7 rounded-xl bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shadow-orange-500/20">
                                {index + 1}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePage(index)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                  title="Exclude this page"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Card Middle: Miniature Page Mockup & Info */}
                            <div className="py-2.5 px-2 text-center bg-slate-50/70 rounded-xl border border-slate-100 mb-2.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Page Content
                              </span>
                              <span className="text-base font-black text-slate-800 block mt-0.5">
                                Pg {item.pageDisplayNum}
                              </span>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border truncate max-w-full ${colorClass}`}
                                title={item.fileName}
                              >
                                {item.fileName}
                              </span>
                            </div>

                            {/* Card Bottom: Position Controls */}
                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMovePage(index, index - 1)}
                                className="p-1 rounded text-slate-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 transition"
                                title="Move Left"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <span>Pos:</span>
                                <select
                                  value={index + 1}
                                  onChange={(e) => handleMovePage(index, Number(e.target.value) - 1)}
                                  className="px-1 py-0.5 text-xs font-bold bg-white border border-slate-200 rounded cursor-pointer text-slate-800"
                                >
                                  {pagePlan.map((_, i) => (
                                    <option key={i} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                type="button"
                                disabled={index === pagePlan.length - 1}
                                onClick={() => handleMovePage(index, index + 1)}
                                className="p-1 rounded text-slate-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-25 transition"
                                title="Move Right"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    disabled={validEntries.length < 2 || (organizeMode === 'pages' && pagePlan.length === 0)}
                    onClick={handleStartMerge}
                    className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-orange-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5"
                  >
                    <Sparkles className="w-5 h-5" />
                    {validEntries.length < 2
                      ? 'Add At Least 2 Valid PDFs to Merge'
                      : organizeMode === 'pages'
                      ? `Merge ${pagePlan.length} Pages in Custom Sequence`
                      : `Merge ${validEntries.length} Documents (${totalRawPages} Pages)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Merging Progress View */}
        {status === 'merging' && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 mx-auto flex items-center justify-center animate-pulse">
              <Layers className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Merging Documents…
              </h3>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {progressInfo.message || 'Combining pages into unified document…'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>{progressInfo.currentPage ? `Page ${progressInfo.currentPage} of ${progressInfo.totalPages}` : 'Processing'}</span>
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
                Cancel Merging
              </button>
            </div>
          </div>
        )}

        {/* 3. Results & Download View */}
        {status === 'completed' && result && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                PDFs Merged Successfully!
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
                Combined {result.fileCount} PDF documents into a single unified document with {result.totalPages} pages.
              </p>
            </div>

            {/* Summary Statistics Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Merged Files</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{result.fileCount} Documents</p>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pages</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">{result.totalPages} Pages</p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output Size</span>
                <p className="text-xl font-bold text-orange-600 mt-1">{formatBytes(result.totalSize)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <Download className="w-5 h-5" />
                Download Merged PDF
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Merge More Files
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid sm:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Page-by-Page Sorter</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Expand all pages from all files into a visual grid, drag & drop to reorder, jump positions, or delete pages.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Non-Blocking Engine</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Smart page-by-page copying processes large batches of multi-page PDFs with optimal memory management and zero latency.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">Bank-Grade Privacy & Security</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            All combining operations execute with enterprise confidentiality and zero data retention.
          </p>
        </div>
      </div>
    </div>
  );
}
