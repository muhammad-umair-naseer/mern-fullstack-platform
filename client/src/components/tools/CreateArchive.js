import React, { useState, useRef } from 'react';
import { FolderPlus, FilePlus, Archive, Trash2, Download, Check, AlertCircle } from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

export default function CreateArchive() {
  const [files, setFiles] = useState([]); // array of { file, path, size }
  const [archiveName, setArchiveName] = useState('cortexis_archive.zip');
  const [compLevel, setCompLevel] = useState(6); // 0..9
  const [status, setStatus] = useState('idle'); // 'idle' | 'building' | 'done' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleAddFiles = (fileList, isFolder = false) => {
    if (!fileList || !fileList.length) return;
    const newItems = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const relPath = isFolder && f.webkitRelativePath ? f.webkitRelativePath : f.name;
      newItems.push({ file: f, path: relPath, size: f.size });
    }
    setFiles((prev) => [...prev, ...newItems]);
    setStatus('idle');
    setStatusMsg('');
  };

  const handleRemoveItem = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setFiles([]);
    setStatus('idle');
    setStatusMsg('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) {
      handleAddFiles(e.dataTransfer.files, false);
    }
  };

  const totalBytes = files.reduce((acc, x) => acc + x.size, 0);

  const handleBuildArchive = async () => {
    if (!files.length) return;
    setStatus('building');
    setProgress(0);
    setStatusMsg('Initializing archive builder...');

    try {
      const zip = await loadZipLib();
      zip.configure({ useWebWorkers: false });

      const name = (archiveName.trim() || 'archive.zip').replace(/\.zip$/i, '') + '.zip';
      const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'), {
        level: compLevel,
        bufferedWrite: true,
        keepOrder: true,
      });

      let processedBytes = 0;
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setStatusMsg(`Adding ${i + 1}/${files.length}: ${item.path}`);

        // Snapshot the running total for this file's progress callback: the
        // closure should report against the bytes finished before this file
        // started, not whatever the loop variable holds when it fires.
        const doneBefore = processedBytes;
        await zipWriter.add(item.path, new zip.BlobReader(item.file), {
          onprogress: (curr) => {
            const overall = totalBytes ? Math.round(((doneBefore + curr) / totalBytes) * 100) : 50;
            setProgress(Math.min(98, overall));
          },
        });

        processedBytes += item.size;
        setProgress(totalBytes ? Math.round((processedBytes / totalBytes) * 100) : 100);
      }

      setStatusMsg('Finalizing compressed archive...');
      const blob = await zipWriter.close();
      setProgress(100);
      setStatus('done');
      setStatusMsg(`Archive created successfully (${formatFileSize(blob.size)}) with ${files.length} item(s).`);

      triggerDownload(blob, name);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to build archive: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Top Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
          isDragOver
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <Archive className="w-12 h-12 text-orange-400 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-100">Drop files or entire folders here</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Package any document, media or code files directly in your browser without uploading to any server.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition"
          >
            <FilePlus className="w-4 h-4" />
            Add Files
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <FolderPlus className="w-4 h-4 text-emerald-400" />
            Add Folder
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            handleAddFiles(e.target.files, false);
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory="true"
          directory=""
          multiple
          onChange={(e) => {
            handleAddFiles(e.target.files, true);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Settings Row */}
      <div className="grid sm:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1.5">Output Archive Name</label>
          <input
            type="text"
            value={archiveName}
            onChange={(e) => setArchiveName(e.target.value)}
            placeholder="archive.zip"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-400">Compression Level</label>
            <span className="text-xs font-mono text-orange-400 font-semibold">
              {compLevel === 0 ? '0 (Store Only)' : compLevel <= 3 ? `${compLevel} (Fast)` : compLevel <= 6 ? `${compLevel} (Balanced)` : `${compLevel} (Max)`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="9"
            value={compLevel}
            onChange={(e) => setCompLevel(Number(e.target.value))}
            className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
            <span>
              {files.length} items queued · Total {formatFileSize(totalBytes)}
            </span>
            <button
              onClick={handleClear}
              className="text-rose-400 hover:text-rose-300 font-semibold transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {files.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <span className="font-mono text-slate-300 truncate max-w-md">{item.path}</span>
                <div className="flex items-center gap-3 ml-2 shrink-0">
                  <span className="text-slate-500 font-mono">{formatFileSize(item.size)}</span>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress & Status */}
          {status === 'building' && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>{statusMsg}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === 'done' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleBuildArchive}
              disabled={status === 'building'}
              className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {status === 'building' ? 'Compressing & Creating ZIP...' : 'Create & Download ZIP Archive'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
