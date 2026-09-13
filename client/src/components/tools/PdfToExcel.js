import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Plus,
  Sparkles,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { convertPdfsToExcel } from '../../lib/pdfToExcel';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';
import { SHEET_FORMATS } from '../../lib/pdfToExcel';

/**
 * @param {{ suite?: boolean }} props  /tools/pdf-excel renders the Excel-only
 *   tool; /tools/pdf-spreadsheet-suite sets `suite` and gets a format chooser
 *   (XLSX, XLS, ODS, CSV, TSV, HTML).
 */
export default function PdfToExcel({ suite = false }) {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('xlsx');
  const [activePreviewSheet, setActivePreviewSheet] = useState(0);

  const [status, setStatus] = useState('idle'); // 'idle' | 'converting' | 'completed' | 'error'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFiles = useCallback((selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setErrorMsg('');

    const validPdfs = Array.from(selectedFiles).filter((f) => /\.pdf$/i.test(f.name));
    if (validPdfs.length === 0) {
      setErrorMsg('Please select valid .pdf files.');
      return;
    }

    setFiles((prev) => [...prev, ...validPdfs]);
    setStatus('idle');
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files;
      if (dropped && dropped.length > 0) handleSelectFiles(dropped);
    },
    [handleSelectFiles]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('converting');
    setErrorMsg('');
    setProgressInfo({ progress: 5, message: 'Parsing PDF tables & structure…' });

    abortControllerRef.current = new AbortController();

    try {
      const res = await convertPdfsToExcel(
        files,
        (p) => setProgressInfo(p),
        abortControllerRef.current.signal,
        { format: suite ? format : 'xlsx' }
      );
      setResult(res);
      setActivePreviewSheet(0);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Conversion was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Error converting PDF to Excel spreadsheet.');
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
    setFiles([]);
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
            <FileSpreadsheet className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF → Excel Converter</h2>
            <p className="text-xs text-slate-400">{suite ? 'Extract tables and structured data into XLSX, XLS, ODS, CSV, TSV or HTML' : 'Extract tables and structured data into editable .xlsx spreadsheets'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Structured Data Parser • Native Spreadsheet Export</span>
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
        {files.length === 0 && (
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
              multiple
              onChange={(e) => handleSelectFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop PDF files to convert to Excel
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Extracts data and tables into an editable Microsoft Excel (.xlsx) file right on your computer.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileSpreadsheet className="w-4 h-4" />
              Choose PDF Documents
            </div>
          </div>
        )}

        {/* Files List & Converter */}
        {files.length > 0 && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">
                  {files.length} Document{files.length === 1 ? '' : 's'} Queued
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total Size: {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}
                </p>
              </div>

              {status !== 'converting' && (
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
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={(e) => handleSelectFiles(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="p-2 rounded-lg bg-orange-100 text-orange-600 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <div className="text-sm font-semibold text-slate-800 truncate">{file.name}</div>
                      <div className="text-xs text-slate-500">{formatBytes(file.size)}</div>
                    </div>
                  </div>

                  {status !== 'converting' && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            {status === 'converting' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Extracting tables to spreadsheet…'}
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

            {suite && status !== 'converting' && (
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
                <label htmlFor="sheet-format" className="block text-sm font-semibold text-slate-800 mb-2">
                  Output format
                </label>
                <select
                  id="sheet-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                >
                  {Object.entries(SHEET_FORMATS).map(([key, f]) => (
                    <option key={key} value={key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            {status !== 'converting' && (
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
                  <FileSpreadsheet className="w-4 h-4" />
                  {suite ? `Convert to ${SHEET_FORMATS[format].ext.toUpperCase()}` : 'Convert to Excel (.xlsx)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed View with Live Table Preview */}
        {status === 'completed' && result && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Spreadsheet Ready!</h3>
                  <p className="text-xs text-slate-600">
                    Generated <strong>{result.sheetCount}</strong> sheet{result.sheetCount === 1 ? '' : 's'}.{' '}
                    All data and tables parsed into Excel columns.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download .{result.ext || 'xlsx'} File
                </button>
              </div>
            </div>

            {/* Spreadsheet Tabs & Preview */}
            {result.previewData?.length > 0 && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <div className="flex items-center gap-1 p-2 bg-slate-200/80 overflow-x-auto">
                  {result.previewData.map((sheet, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActivePreviewSheet(sIdx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        activePreviewSheet === sIdx
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sheet.sheetName}
                    </button>
                  ))}
                </div>

                <div className="max-h-72 overflow-auto bg-white">
                  <table className="w-full text-xs font-mono border-collapse">
                    <tbody>
                      {result.previewData[activePreviewSheet]?.data?.slice(0, 50).map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-200 text-slate-400 text-center font-bold select-none w-8">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 border border-slate-200 text-slate-800 whitespace-nowrap">
                              {cell || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Convert Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
