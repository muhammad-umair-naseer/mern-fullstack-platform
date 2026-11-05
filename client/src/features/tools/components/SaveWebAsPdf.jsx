import { confirmRemoteCapture } from '../../../lib/captureConsent.js';
import React, { useState } from 'react';
import {
  Download,
  Globe,
  ShieldCheck,
  AlertCircle,
  X,
  Link2,
  FileText,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { triggerDownload } from '../../../lib/pdfCommon.js';

const starterBody = `Paste or write the article or webpage text you wish to save as a clean PDF document.

Features & Benefits:
• Converts webpage text into an organized, publication-ready PDF.
• Includes custom title, subtitle, source URL timestamp, and automatic multi-page pagination.
• Private by default: nothing is stored and nothing is retained.`;

/**
 * Two ways to a PDF. "From a URL" renders the live page — layout, images,
 * links — through a capture service and hands back a real, text-searchable
 * PDF; the address is the only thing sent. "From text" typesets pasted
 * content with jsPDF, for a paywalled or login-only page you can copy but the
 * service cannot reach.
 */
const CAPTURE_API = 'https://api.microlink.io/';

export default function SaveWebAsPdf() {
  const [mode, setMode] = useState('url'); // 'url' | 'text'
  const [pageUrl, setPageUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [title, setTitle] = useState('Saved Web Article');
  const [subtitle, setSubtitle] = useState('Clean Printable Archive');
  const [sourceUrl, setSourceUrl] = useState('');
  const [body, setBody] = useState(starterBody);
  const [paperSize, setPaperSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const addWrappedText = (pdf, text, x, y, maxWidth, lineHeight, pageHeight, margin) => {
    const paragraphs = text.split('\n');
    let cursor = y;
    paragraphs.forEach((paragraph, _index) => {
      const lines = pdf.splitTextToSize(paragraph || ' ', maxWidth);
      lines.forEach((line) => {
        if (cursor > pageHeight - margin - 15) {
          pdf.addPage();
          cursor = margin + 10;
        }
        pdf.text(line, x, cursor);
        cursor += lineHeight;
      });
      cursor += lineHeight * 0.4;
    });
    return cursor;
  };

  const captureUrlAsPdf = async () => {
    let clean = pageUrl.trim();
    if (clean && !/^https?:\/\//i.test(clean)) clean = `https://${clean}`;
    let parsed;
    try {
      parsed = new URL(confirmRemoteCapture(clean));
    } catch (error) {
      setErrorMsg(error.message);
      return;
    }
    setErrorMsg('');
    setIsCapturing(true);
    try {
      const params = new URLSearchParams({
        url: parsed.href,
        pdf: 'true',
        meta: 'false',
        'pdf.format': paperSize === 'letter' ? 'Letter' : 'A4',
        'pdf.landscape': String(orientation === 'landscape'),
        'pdf.printBackground': 'true',
        'pdf.margin': '12mm',
      });
      const res = await fetch(`${CAPTURE_API}?${params}`);
      if (res.status === 429) {
        throw new Error('Today’s capture allowance for your connection is used up. Try again tomorrow, or paste the page text into the other tab.');
      }
      const json = await res.json().catch(() => ({}));
      const pdfUrl = json?.data?.pdf?.url;
      if (json.status !== 'success' || !pdfUrl) {
        throw new Error(
          json?.message || 'That page could not be captured. It may block automated visitors or need a login — paste its text into the other tab instead.'
        );
      }
      const pdfRes = await fetch(pdfUrl);
      if (!pdfRes.ok) throw new Error('The captured PDF could not be downloaded. Please try again.');
      const blob = await pdfRes.blob();
      const host = parsed.hostname.replace(/^www\./, '');
      const slug = parsed.pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60);
      triggerDownload(blob, `${host}${slug ? '-' + slug : ''}.pdf`);
    } catch (err) {
      setErrorMsg(err.message || 'Capture failed.');
    } finally {
      setIsCapturing(false);
    }
  };

  const generateAndDownloadPdf = async () => {
    if (!body.trim()) {
      setErrorMsg('Please enter or paste some content to create a PDF.');
      return;
    }
    setErrorMsg('');
    setIsGenerating(true);

    try {
      const isLandscape = orientation === 'landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'pt',
        format: paperSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = margin + 15;

      // Header Banner Accent Line
      pdf.setDrawColor(249, 115, 22);
      pdf.setLineWidth(3);
      pdf.line(margin, cursorY, margin + 40, cursorY);
      cursorY += 20;

      // Title
      if (title.trim()) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(22);
        pdf.setTextColor(15, 23, 42);
        const titleLines = pdf.splitTextToSize(title.trim(), contentWidth);
        pdf.text(titleLines, margin, cursorY);
        cursorY += titleLines.length * 26 + 6;
      }

      // Subtitle
      if (subtitle.trim()) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(100, 116, 139);
        const subLines = pdf.splitTextToSize(subtitle.trim(), contentWidth);
        pdf.text(subLines, margin, cursorY);
        cursorY += subLines.length * 16 + 10;
      }

      // Metadata Bar (URL & Date)
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      const meta = [
        sourceUrl ? `Source: ${sourceUrl}` : '',
        `Archived: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      ].filter(Boolean).join(' • ');

      if (meta) {
        pdf.text(meta, margin, cursorY);
        cursorY += 16;
      }

      // Divider
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.8);
      pdf.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 20;

      // Body Content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10.5);
      pdf.setTextColor(30, 41, 59);
      addWrappedText(pdf, body, margin, cursorY, contentWidth, 16, pageHeight, margin);

      // Add clean page numbers to bottom
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 20,
          { align: 'center' }
        );
      }

      const safeName = (title.trim() || 'web-clipping')
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const blob = pdf.output('blob');
      triggerDownload(blob, `${safeName || 'web-clipping'}.pdf`);
    } catch (err) {
      setErrorMsg(`Failed to generate PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="ml-auto hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Composer Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500" />
              Save a Webpage as PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Capture a live page from its address, or typeset pasted text into a clean PDF
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Nothing stored, nothing retained</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[
            ['url', Link2, 'From a URL'],
            ['text', FileText, 'From text'],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                mode === key
                  ? 'bg-orange-500 border-orange-500 text-white shadow'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-400'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {mode === 'url' && (
          <div className="space-y-1.5">
            <label htmlFor="save-web-url" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Webpage address
            </label>
            <input
              id="save-web-url"
              type="url"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && captureUrlAsPdf()}
              placeholder="https://example.com/article"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The page is rendered as a reader sees it — layout, images and clickable links — into a text-searchable PDF.
              Pages behind a login or paywall cannot be reached this way; use the text tab for those.
            </p>
          </div>
        )}

        {mode === 'text' && (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Article / Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Web Architecture Overview"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subtitle or Topic
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Summary & Technical Notes"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Source URL (Optional reference link)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        {/* Body content textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Page Content / Article Text
          </label>
          <textarea
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the webpage text or article content here..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-sans leading-relaxed"
          />
        </div>

        {/* Paper & Orientation */}
        </>)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paper Size
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="a4">A4 (Standard 210 × 297 mm)</option>
              <option value="letter">US Letter (8.5 × 11 in)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={mode === 'url' ? captureUrlAsPdf : generateAndDownloadPdf}
            disabled={isGenerating || isCapturing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {mode === 'url'
              ? isCapturing ? 'Capturing page…' : 'Save Webpage as PDF'
              : isGenerating ? 'Building PDF...' : 'Download Printable PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
