import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Lock,
  ShieldCheck,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
} from 'lucide-react';
import { protectPdf } from '../../lib/pdfProtect';
import { formatBytes, triggerDownload } from '../../lib/pdfCommon';

export default function PdfProtect() {
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showUserPw, setShowUserPw] = useState(false);
  const [showOwnerPw, setShowOwnerPw] = useState(false);

  // Permissions
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(true);
  const [allowModify, setAllowModify] = useState(false);
  const [allowAnnotate, setAllowAnnotate] = useState(false);

  const [status, setStatus] = useState('idle'); // 'idle' | 'encrypting' | 'completed' | 'error'
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
      setErrorMsg('Please select a valid .pdf file.');
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

  const handleProtect = async () => {
    if (!file) return;
    if (!userPassword.trim()) {
      setErrorMsg('Please enter a password to protect and lock the PDF.');
      return;
    }

    setStatus('encrypting');
    setErrorMsg('');
    setProgressInfo({ progress: 10, message: 'Generating cryptographic keys…' });

    abortControllerRef.current = new AbortController();

    try {
      const res = await protectPdf(
        file,
        {
          userPassword,
          ownerPassword: ownerPassword || userPassword,
          allowPrint,
          allowCopy,
          allowModify,
          allowAnnotate,
        },
        (p) => setProgressInfo(p),
        abortControllerRef.current.signal
      );
      setResult(res);
      setStatus('completed');
    } catch (err) {
      if (abortControllerRef.current?.signal?.aborted) {
        setStatus('idle');
        setErrorMsg('Protection was cancelled.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Error occurred while protecting PDF.');
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
    setFile(null);
    setUserPassword('');
    setOwnerPassword('');
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
            <Lock className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-base">PDF Protect & Password Locker</h2>
            <p className="text-xs text-slate-400">Add password protection and permission restrictions to your PDF</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Bank-Grade Encryption • Military-Grade Privacy</span>
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
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select or Drop your PDF to encrypt & protect
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Lock your PDF with a password using 128-bit standard PDF encryption. Nothing is retained.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition">
              <FileText className="w-4 h-4" />
              Choose PDF File
            </div>
          </div>
        )}

        {/* Password and Options Form */}
        {file && status !== 'completed' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base break-all">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatBytes(file.size)} • Target: Password Encrypted PDF
                  </p>
                </div>
              </div>

              {status !== 'encrypting' && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                >
                  Change file
                </button>
              )}
            </div>

            {/* Inputs */}
            {status !== 'encrypting' && (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* User Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      User Password <span className="text-rose-500">*</span> (Required to Open)
                    </label>
                    <div className="relative">
                      <input
                        type={showUserPw ? 'text' : 'password'}
                        placeholder="Enter password to unlock PDF"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-orange-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUserPw(!showUserPw)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showUserPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Anyone opening the PDF will be asked for this password.
                    </p>
                  </div>

                  {/* Owner Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Owner Password (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type={showOwnerPw ? 'text' : 'password'}
                        placeholder="Password to change permissions"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-orange-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOwnerPw(!showOwnerPw)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showOwnerPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Leave empty to use the same password.
                    </p>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Permissions & Security Restrictions
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-orange-300 transition">
                      <input
                        type="checkbox"
                        checked={allowPrint}
                        onChange={(e) => setAllowPrint(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-800">Allow Printing</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-orange-300 transition">
                      <input
                        type="checkbox"
                        checked={allowCopy}
                        onChange={(e) => setAllowCopy(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-800">Allow Copying Text & Graphics</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-orange-300 transition">
                      <input
                        type="checkbox"
                        checked={allowModify}
                        onChange={(e) => setAllowModify(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-800">Allow Modifying Document</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-orange-300 transition">
                      <input
                        type="checkbox"
                        checked={allowAnnotate}
                        onChange={(e) => setAllowAnnotate(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-800">Allow Comments & Annotations</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            {status === 'encrypting' && (
              <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    {progressInfo.message || 'Encrypting…'}
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
            {status !== 'encrypting' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProtect}
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Encrypt & Protect PDF
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
              <h3 className="text-2xl font-bold text-slate-900">PDF Protected Successfully!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Your password protection has been applied. Keep your password safe as it cannot be recovered.
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
                Download Protected PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Protect Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
