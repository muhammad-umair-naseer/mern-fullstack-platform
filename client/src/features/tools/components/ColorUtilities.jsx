import React, { useState, useMemo } from 'react';
import { Copy, Check, Palette, Eye} from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}
function round(n) {
  return Math.round(n);
}

function parseHex(s) {
  let h = s.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map((c) => c + c).join('');
  if (/^[0-9a-fA-F]{4}$/.test(h)) h = h.split('').map((c) => c + c).join('');
  if (/^[0-9a-fA-F]{6}$/.test(h)) {
    return {
      r: parseInt(h.substr(0, 2), 16),
      g: parseInt(h.substr(2, 2), 16),
      b: parseInt(h.substr(4, 2), 16),
      a: 1,
    };
  }
  if (/^[0-9a-fA-F]{8}$/.test(h)) {
    return {
      r: parseInt(h.substr(0, 2), 16),
      g: parseInt(h.substr(2, 2), 16),
      b: parseInt(h.substr(4, 2), 16),
      a: parseInt(h.substr(6, 2), 16) / 255,
    };
  }
  return null;
}

export function parseColor(input) {
  if (!input) return null;
  const s = input.trim();
  if (s[0] === '#' || /^[0-9a-fA-F]{3,8}$/.test(s)) return parseHex(s);
  const mrgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (mrgb) {
    return {
      r: clamp(+mrgb[1], 0, 255),
      g: clamp(+mrgb[2], 0, 255),
      b: clamp(+mrgb[3], 0, 255),
      a: mrgb[4] == null ? 1 : clamp(+mrgb[4], 0, 1),
    };
  }
  const mhsl = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (mhsl) {
    const rgb = hslToRgb(+mhsl[1], +mhsl[2], +mhsl[3]);
    rgb.a = mhsl[4] == null ? 1 : clamp(+mhsl[4], 0, 1);
    return rgb;
  }
  return null;
}

export function toHex(rgb, withAlpha = false) {
  const h = (n) => ('0' + round(clamp(n, 0, 255)).toString(16)).slice(-2);
  let out = '#' + h(rgb.r) + h(rgb.g) + h(rgb.b);
  if (withAlpha && rgb.a != null && rgb.a < 1) out += h(rgb.a * 255);
  return out.toUpperCase();
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
}

export function rgbToCmyk(r, g, b) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  const k = Math.min(c, Math.min(m, y));
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

function luminance(rgb) {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
    a: 1,
  };
}

function generateTintsAndShades(rgb, n = 5) {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const tints = [];
  const shades = [];
  for (let i = n; i >= 1; i--) {
    tints.push(toHex(mix(rgb, white, i / (n + 1))));
  }
  for (let j = 1; j <= n; j++) {
    shades.push(toHex(mix(rgb, black, j / (n + 1))));
  }
  return { tints, shades };
}

export default function ColorUtilities() {
  const [colorInput, setColorInput] = useState('#F97316');
  const [bgInput, setBgInput] = useState('#0F172A');
  const [copiedKey, setCopiedKey] = useState('');

  const parsed = useMemo(() => parseColor(colorInput) || { r: 249, g: 115, b: 22, a: 1 }, [colorInput]);
  const parsedBg = useMemo(() => parseColor(bgInput) || { r: 15, g: 23, b: 42, a: 1 }, [bgInput]);

  const hexVal = useMemo(() => toHex(parsed), [parsed]);
  const hslVal = useMemo(() => rgbToHsl(parsed.r, parsed.g, parsed.b), [parsed]);
  const cmykVal = useMemo(() => rgbToCmyk(parsed.r, parsed.g, parsed.b), [parsed]);
  const contrastRatio = useMemo(() => Math.round(contrast(parsed, parsedBg) * 100) / 100, [parsed, parsedBg]);
  const palette = useMemo(() => generateTintsAndShades(parsed, 4), [parsed]);

  const formats = [
    { label: 'HEX', val: hexVal },
    { label: 'RGB', val: `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` },
    { label: 'RGBA', val: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})` },
    { label: 'HSL', val: `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)` },
    { label: 'CMYK', val: `cmyk(${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%)` },
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-8">
      {/* Top Main Color Picker & Live Swatch */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div
            className="w-28 h-28 rounded-2xl shadow-xl border-2 border-white/20 transition-all duration-200"
            style={{ backgroundColor: hexVal }}
          />
          <div className="mt-4 flex items-center gap-3 w-full justify-center">
            <input
              type="color"
              value={hexVal}
              onChange={(e) => setColorInput(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-mono text-center w-28 uppercase focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Converted Values Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map((f) => (
            <div
              key={f.label}
              className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 flex items-center justify-between hover:border-slate-700 transition"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{f.label}</span>
                <p className="text-sm font-mono text-slate-200">{f.val}</p>
              </div>
              <button
                onClick={() => handleCopy(f.val, f.label)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                {copiedKey === f.label ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tints & Shades Palette */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-orange-400" />
          Harmonious Tints & Shades
        </h3>
        <div className="grid grid-cols-9 gap-1.5 rounded-2xl overflow-hidden p-2 bg-slate-950/60 border border-slate-800">
          {[...palette.tints, hexVal, ...palette.shades].map((c, i) => (
            <button
              key={i}
              onClick={() => setColorInput(c)}
              className="h-14 rounded-lg transition-transform hover:scale-105 relative group"
              style={{ backgroundColor: c }}
              title={c}
            >
              <span className="opacity-0 group-hover:opacity-100 absolute bottom-1 inset-x-0 text-[9px] font-mono text-center font-bold px-0.5 rounded bg-black/60 text-white transition">
                {c}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* WCAG Contrast Checker */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          WCAG 2.1 Accessibility & Contrast Checker
        </h3>

        <div className="grid md:grid-cols-2 gap-4 items-center">
          {/* Preview Box */}
          <div
            className="p-5 rounded-xl border border-white/10 flex flex-col justify-center gap-2 shadow-inner"
            style={{ backgroundColor: toHex(parsedBg), color: hexVal }}
          >
            <h4 className="text-lg font-bold">Sample Heading (Bold)</h4>
            <p className="text-sm">
              This preview displays foreground text color against the selected background color.
            </p>
          </div>

          {/* Contrast Score & Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Contrast Ratio:</span>
              <span className="text-2xl font-black text-orange-400">{contrastRatio} : 1</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  contrastRatio >= 4.5
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <span>AA Normal (4.5:1)</span>
                <span className="font-bold">{contrastRatio >= 4.5 ? 'PASS' : 'FAIL'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  contrastRatio >= 7.0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <span>AAA Normal (7:1)</span>
                <span className="font-bold">{contrastRatio >= 7.0 ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Background Color:</span>
              <input
                type="color"
                value={toHex(parsedBg)}
                onChange={(e) => setBgInput(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-slate-300">{toHex(parsedBg)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
