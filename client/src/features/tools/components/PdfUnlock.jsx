import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  LockOpen,
  KeyRound,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
} from 'lucide-react';
import { unlockPdf } from '../../../lib/pdfUnlock.js';
import { formatBytes, triggerDownload } from '../../../lib/pdfCommon.js';

/**
 * Removes the password from a PDF you already know the password to. Either
 * the open password or the owner (permissions) password unlocks it; the file
 * is re-saved with no encryption at all, so it opens anywhere without a prompt.
 */
export default function PdfUnlock() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'unlocking' | 'completed'
  const [progressInfo, setProgressInfo] = useState({ progress: 0, message: '' });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSelectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg('');
    if (!/\.pdf$/i.test(selectedFile.name)) {
      setErrorMsg('Please select a .pdf file.');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleSelectFile(dropped);
    },
    [handleSelectFile]
  );

  const handleUnlock = async () => {
    if (!file) return;
    setErrorMsg('');
    setStatus('unlocking');
    setProgressInfo({ progress: 0, message: 'Starting…' });
    abortControllerRef.current = new AbortController();
    try {
      const out = await unlockPdf(file, password, setProgressInfo, abortControllerRef.current.signal);
      const blob = new Blob([out.bytes], { type: 'application/pdf' });
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '') + '-unlocked.pdf',
        role: out.role,
        method: out.method,
      });
      setStatus('completed');
    } catch (err) {
      if (err?.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setErrorMsg(err?.message || 'Could not unlock this PDF.');
      setStatus('idle');
    }
  };

  const handleCancel = () => abortControllerRef.current?.abort();

  const handleDownload = () => {
    if (result) triggerDownload(result.blob, result.filename);
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    setProgressInfo({ progress: 0, message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <LockOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF Unlock &amp; Password Remover</h2>
            <p className="text-xs text-slate-400">Remove the password from a PDF you have the password for</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <KeyRound className="w-4 h-4" />
          <span>Open or owner password • Nothing retained</span>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block">Could not unlock</strong>
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-600 transition" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
              onChange={(e) => handleSelectFile(e.target.files?.[0])}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <LockOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Select or drop the locked PDF</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Enter its password once and download a copy that opens without one. Works with the open password or the owner password.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">{file.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{formatBytes(file.size)} • Password-protected PDF</p>
                </div>
              </div>
              {status !== 'unlocking' && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              )}
            </div>

            {status !== 'unlocking' && (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                <label htmlFor="pdf-unlock-password" className="block text-sm font-semibold text-slate-800">
                  PDF password
                </label>
                <div className="relative">
                  <input
                    id="pdf-unlock-password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="The password that opens this PDF"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    autoComplete="off"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Some PDFs open without a password but block printing or copying. Leave this empty for those — the
                  restrictions are removed along with the lock.
                </p>
              </div>
            )}

            {status === 'unlocking' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Unlocking…'}
                  </span>
                  <span className="font-bold text-orange-600">{progressInfo.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressInfo.progress}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleCancel} className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {status !== 'unlocking' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlock}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <LockOpen className="w-4 h-4" />
                  Unlock PDF
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'completed' && result && (
          <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">PDF Unlocked</h3>
              <p className="text-sm text-slate-600 mt-1">
                The {result.method} protection is gone. This copy opens without a password and has no
                printing or copying restrictions.
                {result.role === 'owner' && ' You used the owner password.'}
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
                Download Unlocked PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Unlock Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
