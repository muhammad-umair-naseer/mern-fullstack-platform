import React, { useState, useRef } from 'react';
import { Download, Eye, RefreshCw, AlertCircle, Check, FileSpreadsheet } from 'lucide-react';
import { loadXlsxLib } from '../../lib/dynamicVendor';
import { formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

export default function SpreadsheetConverter() {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [outputFormat, setOutputFormat] = useState('csv'); // 'csv' | 'xlsx' | 'json' | 'tsv' | 'ods' | 'html'
  const [allSheets, setAllSheets] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'converting' | 'ready' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleProcessFile = async (selectedFile) => {
    if (!selectedFile) return;
    setStatus('loading');
    setStatusMsg(`Reading ${selectedFile.name}...`);

    try {
      const XLSX = await loadXlsxLib();
      const buffer = await selectedFile.arrayBuffer();
      const data = new Uint8Array(buffer);

      // Dense mode minimizes memory footprint for large datasets
      const wb = XLSX.read(data, { type: 'array', dense: true });
      if (!wb.SheetNames || !wb.SheetNames.length) {
        throw new Error('No valid sheets found in spreadsheet.');
      }

      setWorkbook(wb);
      setFile(selectedFile);
      setSheetNames(wb.SheetNames);
      const firstSheet = wb.SheetNames[0];
      setActiveSheet(firstSheet);

      const html = XLSX.utils.sheet_to_html(wb.Sheets[firstSheet], { editable: false });
      setPreviewHtml(html);

      setStatus('ready');
      setStatusMsg(`Loaded ${wb.SheetNames.length} sheet(s) from ${selectedFile.name}.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Could not parse spreadsheet: ${err.message}`);
    }
  };

  const handleSheetChange = (sheet) => {
    setActiveSheet(sheet);
    if (workbook && window.XLSX) {
      const html = window.XLSX.utils.sheet_to_html(workbook.Sheets[sheet], { editable: false });
      setPreviewHtml(html);
    }
  };

  const handleConvert = async () => {
    if (!workbook || !window.XLSX) return;
    setStatus('converting');
    setStatusMsg(`Converting to .${outputFormat}...`);

    try {
      const XLSX = window.XLSX;
      let blob;
      const baseName = file.name.replace(/\.[^.]+$/, '');

      if (outputFormat === 'json') {
        const ws = workbook.Sheets[activeSheet];
        const json = XLSX.utils.sheet_to_json(ws, { defval: null });
        blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      } else if (outputFormat === 'html') {
        const ws = workbook.Sheets[activeSheet];
        const html = XLSX.utils.sheet_to_html(ws);
        blob = new Blob([html], { type: 'text/html' });
      } else if (outputFormat === 'csv' || outputFormat === 'tsv') {
        const ws = workbook.Sheets[activeSheet];
        const csv = XLSX.utils.sheet_to_csv(ws, { FS: outputFormat === 'tsv' ? '\t' : ',' });
        blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
      } else {
        // xlsx or ods
        let wb = workbook;
        if (!allSheets) {
          wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, workbook.Sheets[activeSheet], activeSheet.slice(0, 31));
        }
        const wbout = XLSX.write(wb, { bookType: outputFormat, type: 'array', compression: true });
        blob = new Blob([wbout], { type: 'application/octet-stream' });
      }

      triggerDownload(blob, `${baseName}.${outputFormat}`);
      setStatus('ready');
      setStatusMsg(`✓ Successfully converted and downloaded as .${outputFormat}`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Conversion failed: ${err.message}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWorkbook(null);
    setSheetNames([]);
    setActiveSheet('');
    setPreviewHtml('');
    setStatus('idle');
    setStatusMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) handleProcessFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <FileSpreadsheet className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-100">Upload Spreadsheet (XLSX, CSV, ODS)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert between spreadsheet formats, extract JSON, or generate clean HTML tables with zero uploads.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Spreadsheet
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.tsv,.ods"
            onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} · {sheetNames.length} sheet(s)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {sheetNames.length > 1 && (
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                  <span>Sheet:</span>
                  <select
                    value={activeSheet}
                    onChange={(e) => handleSheetChange(e.target.value)}
                    className="bg-transparent text-orange-400 font-semibold focus:outline-none"
                  >
                    {sheetNames.map((s) => (
                      <option key={s} value={s} className="bg-slate-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                <span>Output Format:</span>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="bg-transparent text-orange-400 font-bold focus:outline-none uppercase"
                >
                  <option value="csv" className="bg-slate-900">CSV (.csv)</option>
                  <option value="xlsx" className="bg-slate-900">Excel (.xlsx)</option>
                  <option value="json" className="bg-slate-900">JSON (.json)</option>
                  <option value="ods" className="bg-slate-900">OpenDocument (.ods)</option>
                  <option value="tsv" className="bg-slate-900">TSV (.tsv)</option>
                  <option value="html" className="bg-slate-900">HTML Table (.html)</option>
                </select>
              </div>

              {(outputFormat === 'xlsx' || outputFormat === 'ods') && sheetNames.length > 1 && (
                <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSheets}
                    onChange={(e) => setAllSheets(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  Export All Sheets
                </label>
              )}

              <button
                onClick={handleConvert}
                disabled={status === 'converting'}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-orange-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                {status === 'converting' ? 'Converting...' : 'Convert & Download'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Data Preview ({activeSheet})
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {showPreview && (
              <div
                className="max-h-72 overflow-auto rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-xs font-mono text-slate-300 custom-scrollbar spreadsheet-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            status === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {status === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
