import React, { useState } from 'react';
import {
  QrCode,
  Download,
  Wifi,
  Link,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

export default function QrGenerator() {
  const [mode, setMode] = useState('url'); // 'url' | 'text' | 'wifi' | 'contact'
  const [url, setUrl] = useState('https://cortexis.ai');
  const [text, setText] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [contact, setContact] = useState({ name: '', phone: '', email: '', org: '' });
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  /**
   * Escape a value going into a WIFI: payload.
   *
   * The Wi-Fi QR convention treats \ ; , : and " as structural, so a password
   * containing any of them silently truncates the payload and produces a code
   * that scans but will not connect. Semicolons and colons are common in
   * generated router passwords, so this was not a theoretical problem.
   */
  const escapeWifi = (value) => String(value).replace(/([\\;,:"])/g, '\\$1');

  /**
   * Escape a value going into a vCard property.
   *
   * RFC 6350 gives \ ; and , structural meaning inside a property value, and a
   * name like "Khan, Abdullah" or an org with a semicolon would otherwise split
   * into fields the reader misinterprets.
   */
  const escapeVCard = (value) => String(value).replace(/([\\;,])/g, '\\$1');

  const getQrValue = () => {
    switch (mode) {
      case 'url':
        return url.trim() || 'https://';
      case 'text':
        return text.trim() || 'Cortexis';
      case 'wifi':
        return `WIFI:T:${encryption};S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;
      case 'contact':
        // CRLF, not \n: RFC 6350 requires it, and several Android scanners
      // refuse a vCard that uses bare line feeds.
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${escapeVCard(contact.name)}`,
        `TEL:${escapeVCard(contact.phone)}`,
        `EMAIL:${escapeVCard(contact.email)}`,
        `ORG:${escapeVCard(contact.org)}`,
        'END:VCARD',
      ].join('\r\n');
      default:
        return url;
    }
  };

  const qrValue = getQrValue();

  const downloadPng = () => {
    const canvas = document.getElementById('qr-canvas-element');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `qrcode-${mode}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadSvg = () => {
    const svgEl = document.getElementById('qr-svg-element');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = `qrcode-${mode}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(svgUrl), 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Panel */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-500" />
              QR Code Content
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Vector Engine</span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'url', label: 'Website', icon: Link },
              { id: 'text', label: 'Plain Text', icon: FileText },
              { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
              { id: 'contact', label: 'vCard', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition ${
                    mode === tab.id
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Inputs */}
          <div className="space-y-4">
            {mode === 'url' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            )}

            {mode === 'text' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Text or Note
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter any text or message to encode..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            )}

            {mode === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="My Home Wi-Fi"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wireless Password"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Security Type
                  </label>
                  <select
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            )}

            {mode === 'contact' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-500">{fgColor}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-500">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Export */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col items-center justify-between space-y-6">
          <div className="w-full text-center space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">Live QR Code</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scannable by iOS & Android camera
            </p>
          </div>

          {/* Render box */}
          <div className="p-6 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center">
            {/* SVG for vector export & crisp display */}
            <QRCodeSVG
              id="qr-svg-element"
              value={qrValue}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              level="M"
              marginSize={4}
            />
            {/* Hidden canvas for high-res PNG export */}
            <div className="hidden">
              <QRCodeCanvas
                id="qr-canvas-element"
                value={qrValue}
                size={800}
                fgColor={fgColor}
                bgColor={bgColor}
                level="M"
                marginSize={4}
              />
            </div>
          </div>

          {/* Download Buttons */}
          <div className="w-full space-y-2.5">
            <button
              onClick={downloadPng}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition"
            >
              <Download className="w-4 h-4" />
              Download High-Res PNG
            </button>
            <button
              onClick={downloadSvg}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Vector SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
