import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, Upload} from 'lucide-react';
import { formatFileSize } from '../../lib/fileValidation';
import { triggerDownload } from '../../lib/pdfCommon';

const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function buildLookup() {
  const l = new Uint8Array(256);
  for (let i = 0; i < TABLE.length; i++) l[TABLE.charCodeAt(i)] = i;
  l['-'.charCodeAt(0)] = 62;
  l['_'.charCodeAt(0)] = 63;
  return l;
}
const LK = buildLookup();

export function bytesToBase64(bytes, urlSafe = false) {
  let out = '';
  let i;
  const len = bytes.length;
  for (i = 0; i < len - 2; i += 3) {
    out += TABLE[bytes[i] >> 2];
    out += TABLE[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    out += TABLE[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    out += TABLE[bytes[i + 2] & 63];
  }
  if (i < len) {
    out += TABLE[bytes[i] >> 2];
    if (i === len - 1) {
      out += TABLE[(bytes[i] & 3) << 4] + '==';
    } else {
      out += TABLE[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      out += TABLE[(bytes[i + 1] & 15) << 2] + '=';
    }
  }
  if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return out;
}

export function base64ToBytes(str) {
  const clean = str.replace(/[^A-Za-z0-9+/\-_]/g, '');
  const pad = clean.length % 4;
  if (pad === 1) throw new Error('Invalid Base64 input string length');
  const eq = (str.match(/=+$/) || [''])[0].length;
  const full = clean.length + (pad ? 4 - pad : 0);
  const outLen = (full / 4) * 3 - (pad ? 4 - pad : eq);
  const bytes = new Uint8Array(Math.max(0, outLen));
  let p = 0;
  let i;
  for (i = 0; i + 3 < clean.length; i += 4) {
    const n =
      (LK[clean.charCodeAt(i)] << 18) |
      (LK[clean.charCodeAt(i + 1)] << 12) |
      (LK[clean.charCodeAt(i + 2)] << 6) |
      LK[clean.charCodeAt(i + 3)];
    bytes[p++] = (n >> 16) & 255;
    bytes[p++] = (n >> 8) & 255;
    bytes[p++] = n & 255;
  }
  const rem = clean.length - i;
  if (rem === 2) {
    const n2 = (LK[clean.charCodeAt(i)] << 18) | (LK[clean.charCodeAt(i + 1)] << 12);
    bytes[p++] = (n2 >> 16) & 255;
  } else if (rem === 3) {
    const n3 =
      (LK[clean.charCodeAt(i)] << 18) |
      (LK[clean.charCodeAt(i + 1)] << 12) |
      (LK[clean.charCodeAt(i + 2)] << 6);
    bytes[p++] = (n3 >> 16) & 255;
    bytes[p++] = (n3 >> 8) & 255;
  }
  return bytes.subarray(0, p);
}

export default function Base64Tool() {
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [dataUriMode, setDataUriMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileMime, setFileMime] = useState('application/octet-stream');
  const [, setFileSize] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProcessText = useCallback(
    (text, isEncode, isUrlSafe) => {
      setErrorMsg('');
      if (!text) {
        setOutputVal('');
        return;
      }
      try {
        if (isEncode) {
          const enc = new TextEncoder().encode(text);
          const b64 = bytesToBase64(enc, isUrlSafe);
          setOutputVal(b64);
        } else {
          // Decode
          let cleanText = text.trim();
          if (cleanText.startsWith('data:') && cleanText.includes(',')) {
            cleanText = cleanText.split(',')[1];
          }
          const bytes = base64ToBytes(cleanText);
          const decoded = new TextDecoder().decode(bytes);
          setOutputVal(decoded);
        }
      } catch (err) {
        setErrorMsg('Error processing text: ' + err.message);
      }
    },
    []
  );

  const handleTextChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    handleProcessText(val, mode === 'encode', urlSafe);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setFileName(file.name);
    setFileSize(file.size);
    setFileMime(file.type || 'application/octet-stream');

    try {
      if (mode === 'encode') {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const b64 = bytesToBase64(bytes, urlSafe);
        const prefix = dataUriMode
          ? `data:${file.type || 'application/octet-stream'};base64,`
          : '';
        setOutputVal(prefix + b64);
      } else {
        const text = await file.text();
        setInputVal(text);
        handleProcessText(text, false, urlSafe);
      }
    } catch (err) {
      setErrorMsg('Failed to read file: ' + err.message);
    }
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutput = () => {
    if (!outputVal) return;
    if (mode === 'encode') {
      const blob = new Blob([outputVal], { type: 'text/plain;charset=utf-8' });
      triggerDownload(blob, `${fileName || 'base64-encoded'}.txt`);
    } else {
      try {
        let raw = outputVal;
        if (raw.startsWith('data:') && raw.includes(',')) {
          raw = raw.split(',')[1];
        }
        const bytes = base64ToBytes(raw);
        const blob = new Blob([bytes], { type: fileMime });
        triggerDownload(blob, fileName ? `decoded_${fileName}` : 'decoded_binary_file');
      } catch (err) {
        const blob = new Blob([outputVal], { type: 'text/plain;charset=utf-8' });
        triggerDownload(blob, 'decoded_text.txt');
      }
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => {
              setMode('encode');
              handleProcessText(inputVal, true, urlSafe);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
              mode === 'encode'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => {
              setMode('decode');
              handleProcessText(inputVal, false, urlSafe);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
              mode === 'decode'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => {
                setUrlSafe(e.target.checked);
                handleProcessText(inputVal, mode === 'encode', e.target.checked);
              }}
              className="rounded bg-slate-900 border-slate-600 text-orange-500 focus:ring-orange-500"
            />
            URL-Safe (- and _)
          </label>
          {mode === 'encode' && (
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
              <input
                type="checkbox"
                checked={dataUriMode}
                onChange={(e) => setDataUriMode(e.target.checked)}
                className="rounded bg-slate-900 border-slate-600 text-orange-500 focus:ring-orange-500"
              />
              Data URI prefix
            </label>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input / Drop zone */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {mode === 'encode' ? 'Raw Input' : 'Base64 Input'}
            </span>
            {inputVal && (
              <span className="text-xs text-slate-500">
                {inputVal.length} chars ({formatFileSize(new Blob([inputVal]).size)})
              </span>
            )}
          </div>
          <div className="relative">
            <textarea
              rows={12}
              value={inputVal}
              onChange={handleTextChange}
              placeholder={
                mode === 'encode'
                  ? 'Paste text or drag & drop a file here...'
                  : 'Paste Base64 encoded string here...'
              }
              className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-slate-200 focus:outline-none focus:border-orange-500/60 transition resize-none"
            />
            {/* Drop file trigger */}
            <label className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>Upload File</span>
              <input type="file" onChange={handleFileDrop} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Result'}
            </span>
            {outputVal && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadOutput}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium ml-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            )}
          </div>
          <textarea
            rows={12}
            readOnly
            value={outputVal}
            placeholder="Result will appear here..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-emerald-300 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
