import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  FileEdit,
  Trash2,
  CheckSquare,
  Type,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  Sliders,
  PenTool,
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { pdfjsLib, triggerDownload } from '../../../lib/pdfCommon.js';

export default function PdfFormBuilder() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState([]); // [{ id, page, type: 'text'|'checkbox', name, label, x, y, w, h, defaultVal }]
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [activeTool, setActiveTool] = useState('text'); // 'text' | 'checkbox'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'saving'
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const pdfDocRef = useRef(null);
  const stageRef = useRef(null);
  const currentPreviewRef = useRef('');

  const cleanupPreview = useCallback(() => {
    if (currentPreviewRef.current) {
      URL.revokeObjectURL(currentPreviewRef.current);
      currentPreviewRef.current = '';
    }
    setPreviewUrl('');
  }, []);

  useEffect(() => {
    return () => cleanupPreview();
  }, [cleanupPreview]);

  const renderPage = useCallback(
    async (pdf, pageNum) => {
      setStatus('loading');
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
        cleanupPreview();
        const url = URL.createObjectURL(blob);
        currentPreviewRef.current = url;
        setPreviewUrl(url);
        setStatus('ready');
      } catch (err) {
        console.error('Render error:', err);
        setErrorMsg('Failed to render page preview.');
        setStatus('ready');
      }
    },
    [cleanupPreview]
  );

  const handleSelectFile = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;
      setErrorMsg('');
      cleanupPreview();
      setFields([]);
      setSelectedFieldId(null);

      if (!/\.pdf$/i.test(selectedFile.name) && selectedFile.type !== 'application/pdf') {
        setErrorMsg('Please select a valid .pdf file.');
        return;
      }

      setFile(selectedFile);
      setStatus('loading');

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        await renderPage(pdf, 1);
      } catch (err) {
        console.error('PDF load error:', err);
        setErrorMsg(err.message || 'Could not load PDF document.');
        setStatus('idle');
      }
    },
    [cleanupPreview, renderPage]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleSelectFile(dropped);
    },
    [handleSelectFile]
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || !pdfDocRef.current) return;
    setCurrentPage(newPage);
    renderPage(pdfDocRef.current, newPage);
  };

  // Click on preview to place a new form field
  const handleStageClick = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const newId = `field_${Date.now()}`;
    const isCheck = activeTool === 'checkbox';
    const newField = {
      id: newId,
      page: currentPage,
      type: activeTool,
      name: isCheck ? `Checkbox_${fields.length + 1}` : `TextField_${fields.length + 1}`,
      label: isCheck ? 'Check to agree' : 'Enter text here...',
      defaultVal: '',
      x: Math.max(0.02, Math.min(0.85, relX)),
      y: Math.max(0.02, Math.min(0.9, relY)),
      w: isCheck ? 0.05 : 0.28,
      h: isCheck ? 0.035 : 0.045,
    };

    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newId);
  };

  const updateSelectedField = (key, val) => {
    setFields((prev) =>
      prev.map((f) => (f.id === selectedFieldId ? { ...f, [key]: val } : f))
    );
  };

  const deleteSelectedField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const addQuickPresetFields = () => {
    const presets = [
      { id: `f_${Date.now()}_1`, page: currentPage, type: 'text', name: 'Full_Name', label: 'Full Name', x: 0.15, y: 0.25, w: 0.35, h: 0.045 },
      { id: `f_${Date.now()}_2`, page: currentPage, type: 'text', name: 'Email_Address', label: 'Email Address', x: 0.55, y: 0.25, w: 0.35, h: 0.045 },
      { id: `f_${Date.now()}_3`, page: currentPage, type: 'text', name: 'Date', label: 'Date', x: 0.15, y: 0.35, w: 0.2, h: 0.045 },
      { id: `f_${Date.now()}_4`, page: currentPage, type: 'checkbox', name: 'Agree_Terms', label: 'Agree to Terms', x: 0.15, y: 0.45, w: 0.05, h: 0.035 },
    ];
    setFields((prev) => [...prev, ...presets]);
  };

  const saveFillablePdf = async () => {
    if (!file) return;
    setStatus('saving');
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const docPages = pdfDoc.getPages();

      // Add each interactive field to the target page
      fields.forEach((f) => {
        const targetPage = docPages[f.page - 1];
        if (!targetPage) return;
        const { width: pageW, height: pageH } = targetPage.getSize();

        // Convert percentage fractions into PDF points coordinates (PDF origin is bottom-left)
        const pdfX = f.x * pageW;
        const pdfW = f.w * pageW;
        const pdfH = f.h * pageH;
        const pdfY = pageH - f.y * pageH - pdfH;

        if (f.type === 'text') {
          const textField = form.createTextField(f.name);
          if (f.defaultVal) textField.setText(f.defaultVal);
          textField.addToPage(targetPage, {
            x: pdfX,
            y: pdfY,
            width: pdfW,
            height: pdfH,
            borderWidth: 1,
            borderColor: rgb(0.2, 0.4, 0.8),
            backgroundColor: rgb(0.96, 0.98, 1),
          });
        } else if (f.type === 'checkbox') {
          const checkBox = form.createCheckBox(f.name);
          checkBox.addToPage(targetPage, {
            x: pdfX,
            y: pdfY,
            width: pdfW,
            height: pdfH,
            borderWidth: 1,
            borderColor: rgb(0.2, 0.4, 0.8),
            backgroundColor: rgb(0.96, 0.98, 1),
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const base = file.name.replace(/\.pdf$/i, '');
      triggerDownload(blob, `${base}-fillable-form.pdf`);
      setStatus('ready');
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg('Failed to save fillable PDF: ' + err.message);
      setStatus('ready');
    }
  };

  const handleReset = () => {
    cleanupPreview();
    setFile(null);
    setFields([]);
    setSelectedFieldId(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
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
              <FileEdit className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a flat PDF to make it fillable
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Place interactive text boxes, checkboxes, and editable form fields directly onto pages
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Interactive Form Builder • Lossless AcroForm Engine</span>
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

      {/* Builder Workspace */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Visual Interactive Canvas Area */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center space-y-4">
            {/* Top Page Toolbar */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-semibold pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => changePage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => changePage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Placement Tool Selector */}
            <div className="w-full flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 pl-2">Click to place:</span>
                <button
                  onClick={() => setActiveTool('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTool === 'text'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Text Field
                </button>
                <button
                  onClick={() => setActiveTool('checkbox')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTool === 'checkbox'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Checkbox
                </button>
              </div>

              <button
                onClick={addQuickPresetFields}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-500 transition"
              >
                + Quick Form Template
              </button>
            </div>

            {/* Interactive Canvas Overlay */}
            <div
              ref={stageRef}
              onClick={handleStageClick}
              className="relative max-w-full max-h-[520px] aspect-[3/4] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner cursor-crosshair select-none flex items-center justify-center p-2"
            >
              {previewUrl && (
                <div className="relative max-h-full max-w-full">
                  <img
                    src={previewUrl}
                    alt="Page preview"
                    className="max-h-[480px] max-w-full object-contain rounded shadow pointer-events-none"
                  />

                  {/* Field Overlay Markers for Current Page */}
                  {fields
                    .filter((f) => f.page === currentPage)
                    .map((field) => {
                      const isSelected = field.id === selectedFieldId;
                      return (
                        <div
                          key={field.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFieldId(field.id);
                          }}
                          style={{
                            top: `${field.y * 100}%`,
                            left: `${field.x * 100}%`,
                            width: `${field.w * 100}%`,
                            height: `${field.h * 100}%`,
                          }}
                          className={`absolute rounded border flex items-center justify-between px-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/20 ring-2 ring-orange-500/40 shadow-lg'
                              : 'border-blue-500/80 bg-blue-500/15 hover:bg-blue-500/25'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white truncate">
                            {field.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSelectedField(field.id);
                            }}
                            className="p-0.5 rounded hover:bg-rose-500 hover:text-white text-slate-500 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Click anywhere on the document above to insert a new interactive field.
            </p>
          </div>

          {/* Right Configuration & Export Panel */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  Field Properties
                </h4>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold"
                >
                  Change PDF
                </button>
              </div>

              {/* Selected Field Editor */}
              {selectedField ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                      {selectedField.type === 'text' ? 'Text Input' : 'Checkbox'}
                    </span>
                    <button
                      onClick={() => deleteSelectedField(selectedField.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Field Identifier Name (PDF AcroForm)
                    </label>
                    <input
                      type="text"
                      value={selectedField.name}
                      onChange={(e) => updateSelectedField('name', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {selectedField.type === 'text' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Default Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={selectedField.defaultVal}
                        onChange={(e) => updateSelectedField('defaultVal', e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-semibold">Width (%)</label>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={Math.round(selectedField.w * 100)}
                        onChange={(e) => updateSelectedField('w', Number(e.target.value) / 100)}
                        className="w-full accent-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-semibold">Height (%)</label>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={Math.round(selectedField.h * 100)}
                        onChange={(e) => updateSelectedField('h', Number(e.target.value) / 100)}
                        className="w-full accent-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-500 space-y-1">
                  <PenTool className="w-6 h-6 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    No Field Selected
                  </p>
                  <p>Click on any field on the document to edit its name or adjust its size.</p>
                </div>
              )}

              {/* Total Placed Fields Count */}
              <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Interactive Fields:
                </span>
                <span className="font-mono font-bold text-orange-500">{fields.length}</span>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={saveFillablePdf}
              disabled={status === 'saving' || fields.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {status === 'saving' ? 'Creating Fillable PDF...' : 'Download Fillable PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
