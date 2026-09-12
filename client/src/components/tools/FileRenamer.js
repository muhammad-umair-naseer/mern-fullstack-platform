import React, { useState, useMemo, useRef } from 'react';
import { FileEdit, Download, Trash2, AlertTriangle} from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { triggerDownload } from '../../lib/pdfCommon';

function splitName(filename) {
  const dot = filename.lastIndexOf('.');
  if (dot <= 0) return { base: filename, ext: '' };
  return { base: filename.slice(0, dot), ext: filename.slice(dot) };
}

function toTitle(s) {
  return s.replace(/([^\s_-]+)/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function toKebab(s) {
  return s.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}
function toSnake(s) {
  return s.trim().toLowerCase().replace(/[\s-]+/g, '_').replace(/_+/g, '_');
}

function applyCase(s, mode) {
  switch (mode) {
    case 'lower':
      return s.toLowerCase();
    case 'upper':
      return s.toUpperCase();
    case 'title':
      return toTitle(s);
    case 'kebab':
      return toKebab(s);
    case 'snake':
      return toSnake(s);
    default:
      return s;
  }
}

function pad(num, width) {
  let s = String(num);
  while (s.length < width) s = '0' + s;
  return s;
}

function transformBase(base, index, o) {
  let s = base;
  if (o.findText) {
    if (o.useRegex) {
      try {
        const re = new RegExp(o.findText, o.regexFlags || 'g');
        s = s.replace(re, o.replaceText || '');
      } catch (e) {}
    } else {
      s = s.split(o.findText).join(o.replaceText || '');
    }
  }

  if (o.caseMode && o.caseMode !== 'none') {
    s = applyCase(s, o.caseMode);
  }

  if (o.trimSpaces) s = s.trim();

  if (o.numberingEnabled) {
    const num = pad(o.numberStart + index * o.numberStep, o.numberPad);
    if (o.numberPos === 'prefix') s = `${num}${o.numberSep}${s}`;
    else if (o.numberPos === 'replace') s = num;
    else s = `${s}${o.numberSep}${num}`;
  }

  if (o.prefix) s = o.prefix + s;
  if (o.suffix) s = s + o.suffix;

  return s;
}

export default function FileRenamer() {
  const [files, setFiles] = useState([]); // array of File
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseMode, setCaseMode] = useState('none');
  const [newExt, setNewExt] = useState('');
  const [numberingEnabled, setNumberingEnabled] = useState(false);
  const [numberStart] = useState(1);
  const [numberStep] = useState(1);
  const [numberPad] = useState(2);
  const [numberPos] = useState('suffix');
  const [numberSep] = useState('_');
  const [autoFixCollisions] = useState(true);
  const [status, setStatus] = useState('idle');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleAddFiles = (fileList) => {
    if (!fileList || !fileList.length) return;
    const added = Array.from(fileList);
    setFiles((prev) => [...prev, ...added]);
  };

  const previewRows = useMemo(() => {
    const opts = {
      prefix,
      suffix,
      findText,
      replaceText,
      caseMode,
      newExt,
      numberingEnabled,
      numberStart,
      numberStep,
      numberPad,
      numberPos,
      numberSep,
      autoFixCollisions,
    };

    const rows = files.map((f, i) => {
      const parts = splitName(f.name);
      const newBase = transformBase(parts.base, i, opts);
      let ext = parts.ext;
      if (newExt.trim()) {
        ext = newExt.startsWith('.') ? newExt : `.${newExt}`;
      }
      let output = newBase + ext;
      if (!output || output === '.') output = f.name;
      return { original: f.name, output, file: f };
    });

    const seen = {};
    rows.forEach((r) => {
      const k = r.output.toLowerCase();
      seen[k] = (seen[k] || 0) + 1;
    });

    const counters = {};
    rows.forEach((r) => {
      const k = r.output.toLowerCase();
      r.collision = seen[k] > 1;
      if (r.collision && autoFixCollisions) {
        counters[k] = (counters[k] || 0) + 1;
        if (counters[k] > 1) {
          const p = splitName(r.output);
          r.output = `${p.base}-${counters[k] - 1}${p.ext}`;
          r.autofixed = true;
        }
      }
    });

    return rows;
  }, [
    files,
    prefix,
    suffix,
    findText,
    replaceText,
    caseMode,
    newExt,
    numberingEnabled,
    numberStart,
    numberStep,
    numberPad,
    numberPos,
    numberSep,
    autoFixCollisions,
  ]);

  const handleExportZip = async () => {
    if (!previewRows.length) return;
    setStatus('exporting');
    try {
      const zip = await loadZipLib();
      zip.configure({ useWebWorkers: false });
      const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));

      for (const row of previewRows) {
        await zipWriter.add(row.output, new zip.BlobReader(row.file));
      }

      const blob = await zipWriter.close();
      triggerDownload(blob, 'renamed_files.zip');
      setStatus('idle');
    } catch (err) {
      alert(`Export error: ${err.message}`);
      setStatus('idle');
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Drag & Drop files */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files?.length) handleAddFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
          isDragOver
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <FileEdit className="w-10 h-10 text-orange-400 mx-auto mb-2 animate-pulse" />
        <h4 className="text-sm font-bold text-slate-100">Drop files here to batch rename</h4>
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition"
          >
            Add Files
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            handleAddFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Rules Config Matrix */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Renaming Rules & Pattern</h4>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. Doc_"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Suffix</label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="e.g. _v1"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Find</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="text to replace"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Replace With</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="replacement"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <label className="text-slate-400 block mb-1">Letter Case</label>
            <select
              value={caseMode}
              onChange={(e) => setCaseMode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="none">No change</option>
              <option value="lower">lowercase</option>
              <option value="upper">UPPERCASE</option>
              <option value="title">Title Case</option>
              <option value="kebab">kebab-case</option>
              <option value="snake">snake_case</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Change Extension</label>
            <input
              type="text"
              value={newExt}
              onChange={(e) => setNewExt(e.target.value)}
              placeholder="e.g. jpg or png"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer w-full text-slate-300">
              <input
                type="checkbox"
                checked={numberingEnabled}
                onChange={(e) => setNumberingEnabled(e.target.checked)}
                className="rounded bg-slate-800 border-slate-600 text-orange-500 focus:ring-orange-500"
              />
              <span>Sequential Numbering</span>
            </label>
          </div>
        </div>
      </div>

      {/* Live Preview List */}
      {previewRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{previewRows.length} files queued for rename</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiles([])}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {previewRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono items-center"
              >
                <span className="text-slate-400 truncate">{row.original}</span>
                <div className="flex items-center justify-between text-emerald-400 truncate">
                  <span className="truncate">{row.output}</span>
                  {row.collision && !autoFixCollisions && (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 ml-1" title="Duplicate name" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleExportZip}
            disabled={status === 'exporting'}
            className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {status === 'exporting' ? 'Packaging ZIP Archive...' : 'Download Renamed Files (ZIP)'}
          </button>
        </div>
      )}
    </div>
  );
}
