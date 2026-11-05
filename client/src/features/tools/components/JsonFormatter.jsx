import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, AlignLeft, Minimize2, ArrowUpDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { triggerDownload } from '../../../lib/pdfCommon.js';
import { formatFileSize } from '../../../lib/fileValidation.js';

function posToLineCol(text, pos) {
  if (pos == null || pos < 0) return null;
  let line = 1;
  let col = 1;
  for (let i = 0; i < pos && i < text.length; i++) {
    if (text[i] === '\n') {
      line++;
      col = 1;
    } else col++;
  }
  return { line, col };
}

function locateJsonError(text) {
  let i = 0;
  const n = text.length;
  function ws() {
    while (i < n) {
      const c = text[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') i++;
      else break;
    }
  }
  function fail(msg) {
    const e = new Error(msg);
    e.index = i;
    throw e;
  }
  function value() {
    ws();
    const c = text[i];
    if (c === '{') return obj();
    if (c === '[') return arr();
    if (c === '"') return str();
    if (c === '-' || (c >= '0' && c <= '9')) return num();
    if (text.substr(i, 4) === 'true') {
      i += 4;
      return;
    }
    if (text.substr(i, 5) === 'false') {
      i += 5;
      return;
    }
    if (text.substr(i, 4) === 'null') {
      i += 4;
      return;
    }
    fail(c === undefined ? 'Unexpected end of input' : `Unexpected token '${c}'`);
  }
  function obj() {
    i++;
    ws();
    if (text[i] === '}') {
      i++;
      return;
    }
    while (true) {
      ws();
      if (text[i] !== '"') fail('Expected property name in double quotes');
      str();
      ws();
      if (text[i] !== ':') fail("Expected ':' after property name");
      i++;
      value();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === '}') {
        i++;
        return;
      }
      fail("Expected ',' or '}'");
    }
  }
  function arr() {
    i++;
    ws();
    if (text[i] === ']') {
      i++;
      return;
    }
    while (true) {
      value();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === ']') {
        i++;
        return;
      }
      fail("Expected ',' or ']'");
    }
  }
  function str() {
    i++;
    while (i < n) {
      const c = text[i++];
      if (c === '"') return;
      if (c === '\\') {
        const e = text[i++];
        if (e === 'u') i += 4;
      }
    }
    fail('Unterminated string');
  }
  function num() {
    const s = i;
    if (text[i] === '-') i++;
    while (i < n && text[i] >= '0' && text[i] <= '9') i++;
    if (text[i] === '.') {
      i++;
      while (i < n && text[i] >= '0' && text[i] <= '9') i++;
    }
    if (text[i] === 'e' || text[i] === 'E') {
      i++;
      if (text[i] === '+' || text[i] === '-') i++;
      while (i < n && text[i] >= '0' && text[i] <= '9') i++;
    }
    if (i === s) fail('Invalid number');
  }
  try {
    value();
    ws();
    if (i < n) fail('Unexpected trailing characters');
    return null;
  } catch (e) {
    return { index: e.index != null ? e.index : i, message: e.message };
  }
}

function parseJsonSafe(text) {
  if (!text || !text.trim()) return { empty: true };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    const loc = locateJsonError(text);
    if (loc) {
      const lc = posToLineCol(text, loc.index);
      return {
        ok: false,
        error: `${loc.message} (Line ${lc?.line || 1}, Col ${lc?.col || 1})`,
        line: lc?.line,
        col: lc?.col,
      };
    }
    return { ok: false, error: err.message };
  }
}

function sortKeysDeep(val) {
  if (Array.isArray(val)) return val.map(sortKeysDeep);
  if (val && typeof val === 'object') {
    const out = {};
    Object.keys(val)
      .sort()
      .forEach((k) => {
        out[k] = sortKeysDeep(val[k]);
      });
    return out;
  }
  return val;
}

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('{\n  "cortexis": "secure",\n  "tools": 33,\n  "offline": true\n}');
  const [indent, setIndent] = useState('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const parsedResult = useMemo(() => parseJsonSafe(jsonInput), [jsonInput]);

  const formattedOutput = useMemo(() => {
    if (!parsedResult.ok) return '';
    const val = sortKeys ? sortKeysDeep(parsedResult.value) : parsedResult.value;
    const ind = indent === 'tab' ? '\t' : Number(indent) || 2;
    return JSON.stringify(val, null, ind);
  }, [parsedResult, sortKeys, indent]);

  const stats = useMemo(() => {
    if (!parsedResult.ok || parsedResult.empty) return null;
    let keys = 0;
    let maxDepth = 0;
    function walk(v, d) {
      if (d > maxDepth) maxDepth = d;
      if (Array.isArray(v)) v.forEach((x) => walk(x, d + 1));
      else if (v && typeof v === 'object') {
        Object.keys(v).forEach((k) => {
          keys++;
          walk(v[k], d + 1);
        });
      }
    }
    walk(parsedResult.value, 0);
    return {
      keys,
      depth: maxDepth,
      bytes: new Blob([jsonInput]).size,
    };
  }, [parsedResult, jsonInput]);

  const handleMinify = () => {
    if (!parsedResult.ok) return;
    setJsonInput(JSON.stringify(parsedResult.value));
  };

  const handlePrettify = () => {
    if (!parsedResult.ok) return;
    const ind = indent === 'tab' ? '\t' : Number(indent) || 2;
    setJsonInput(JSON.stringify(parsedResult.value, null, ind));
  };

  const handleCopy = () => {
    const textToCopy = formattedOutput || jsonInput;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = formattedOutput || jsonInput;
    if (!text) return;
    const blob = new Blob([text], { type: 'application/json' });
    triggerDownload(blob, 'formatted.json');
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrettify}
            disabled={!parsedResult.ok}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Format
          </button>
          <button
            onClick={handleMinify}
            disabled={!parsedResult.ok}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
            Minify
          </button>

          <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-orange-400 focus:outline-none"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <label className="flex items-center gap-2 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
            />
            <ArrowUpDown className="w-3 h-3 text-orange-400" />
            Sort Keys A-Z
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!jsonInput}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!jsonInput}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            Download
          </button>
        </div>
      </div>

      {/* Live Syntax Status / Error Display */}
      {parsedResult.empty ? (
        <div className="text-xs text-slate-500 italic">Enter JSON to format and validate...</div>
      ) : parsedResult.ok ? (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid JSON</span>
          </div>
          {stats && (
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>{stats.keys} keys</span>
              <span>Depth {stats.depth}</span>
              <span>{formatFileSize(stats.bytes)}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{parsedResult.error}</span>
        </div>
      )}

      {/* Editor & Preview Panes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            JSON Input
          </span>
          <textarea
            rows={15}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500/60 transition resize-none custom-scrollbar"
          />
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Formatted Output
          </span>
          <textarea
            rows={15}
            readOnly
            value={formattedOutput}
            placeholder="Formatted output appears here..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 focus:outline-none resize-none custom-scrollbar"
          />
        </div>
      </div>
    </div>
  );
}
