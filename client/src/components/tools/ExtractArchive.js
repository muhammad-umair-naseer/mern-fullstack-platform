import React, { useState, useRef } from 'react';
import { Archive, Download, File, Folder, FolderArchive, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { loadZipLib } from '../../lib/dynamicVendor';
import { validateArchiveFile, formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

export default function ExtractArchive() {
  const [file, setFile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [downloadingIdx, setDownloadingIdx] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleProcessArchive = async (selectedFile) => {
    if (!selectedFile) return;
    setStatus('loading');
    setStatusMsg(`Reading archive ${selectedFile.name}...`);
    setEntries([]);

    const val = await validateArchiveFile(selectedFile);
    if (!val.valid) {
      setStatus('error');
      setStatusMsg(val.error);
      return;
    }

    try {
      const zip = await loadZipLib();
      zip.configure({ useWebWorkers: false });

      const reader = new zip.ZipReader(new zip.BlobReader(selectedFile));
      const list = await reader.getEntries();

      if (!list || !list.length) {
        setStatus('error');
        setStatusMsg('Archive contains no files or could not be read.');
        return;
      }

      setFile(selectedFile);
      setEntries(list);
      setStatus('ready');
      setStatusMsg(`Successfully loaded ${list.length} items from ${selectedFile.name}.`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(`Failed to unpack archive: ${err.message}`);
    }
  };

  const handleDownloadSingle = async (entry, idx) => {
    if (entry.directory) return;
    setDownloadingIdx(idx);
    try {
      const zip = await loadZipLib();
      const blob = await entry.getData(new zip.BlobWriter());
      const filename = entry.filename.split('/').pop() || 'file';
      triggerDownload(blob, filename);
    } catch (err) {
      alert(`Error extracting file: ${err.message}`);
    } finally {
      setDownloadingIdx(null);
    }
  };

  const handleDownloadAll = async () => {
    const fileEntries = entries.filter((e) => !e.directory);
    if (!fileEntries.length) return;

    if (window.showDirectoryPicker) {
      try {
        const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
        const zip = await loadZipLib();

        for (const entry of fileEntries) {
          const parts = entry.filename.split('/').filter(Boolean);
          const fname = parts.pop();
          let currentDir = dir;
          for (const sub of parts) {
            currentDir = await currentDir.getDirectoryHandle(sub, { create: true });
          }
          const fileHandle = await currentDir.getFileHandle(fname, { create: true });
          const writable = await fileHandle.createWritable();
          await entry.getData(writable);
        }
        alert(`Successfully extracted ${fileEntries.length} files to folder.`);
      } catch (err) {
        if (err.name !== 'AbortError') {
          alert(`Extraction error: ${err.message}`);
        }
      }
    } else {
      // Sequentially trigger downloads
      for (let i = 0; i < fileEntries.length; i++) {
        await handleDownloadSingle(fileEntries[i], i);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setEntries([]);
    setStatus('idle');
    setStatusMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalUncompressed = entries.reduce((a, e) => a + (e.uncompressedSize || 0), 0);
  const fileCount = entries.filter((e) => !e.directory).length;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Upload Zone */}
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
            if (e.dataTransfer.files?.[0]) handleProcessArchive(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <FolderArchive className="w-14 h-14 text-orange-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-100">Drop ZIP or Archive File Here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Inspect, browse, and extract files from ZIP archives 100% locally in your browser.
          </p>

          <button className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition">
            Choose Archive
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.tar,.gz,.tgz,.7z"
            onChange={(e) => e.target.files?.[0] && handleProcessArchive(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active File Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <Archive className="w-8 h-8 text-orange-400" />
              <div>
                <h4 className="font-bold text-sm text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {fileCount} files ({formatFileSize(totalUncompressed)} uncompressed) · Archive size: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                Extract All
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Archive
              </button>
            </div>
          </div>

          {/* Entries Table */}
          <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5 truncate max-w-md">
                  {entry.directory ? (
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-orange-400 shrink-0" />
                  )}
                  <span className={`font-mono truncate ${entry.directory ? 'text-amber-200' : 'text-slate-200'}`}>
                    {entry.filename}
                  </span>
                </div>

                {!entry.directory && (
                  <div className="flex items-center gap-3 ml-2 shrink-0">
                    <span className="text-slate-500 font-mono">
                      {formatFileSize(entry.uncompressedSize || 0)}
                    </span>
                    <button
                      onClick={() => handleDownloadSingle(entry, idx)}
                      disabled={downloadingIdx === idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white font-medium text-[11px] transition"
                    >
                      {downloadingIdx === idx ? 'Extracting...' : 'Download'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status banner */}
      {status === 'error' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
