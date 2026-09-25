import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('./client/node_modules/puppeteer-core');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findChrome = () => {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : null,
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
};

const chromePath = findChrome();
console.log('Using browser executable:', chromePath);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cortexis Solution Hub - Comprehensive Tools & Converters Roadmap</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 13px;
  }

  /* Cover / Header */
  .header-card {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 70%, #0369a1 100%);
    color: #ffffff;
    padding: 32px 30px;
    border-radius: 14px;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px rgba(30, 27, 75, 0.25);
  }

  .brand-tag {
    display: inline-block;
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid rgba(56, 189, 248, 0.4);
    color: #38bdf8;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    margin-bottom: 12px;
  }

  .header-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.25;
    margin-bottom: 8px;
    color: #ffffff;
  }

  .header-subtitle {
    font-size: 14px;
    color: #bae6fd;
    font-weight: 400;
    max-width: 680px;
    line-height: 1.5;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .meta-item .meta-label {
    font-size: 10px;
    color: #93c5fd;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }

  .meta-item .meta-val {
    font-size: 12px;
    color: #ffffff;
    font-weight: 700;
    margin-top: 2px;
  }

  /* Section Styling */
  .section {
    margin-bottom: 24px;
    page-break-inside: avoid;
  }

  .section-break-after {
    page-break-after: always;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 14px;
  }

  .section-badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 13px;
    color: #ffffff;
  }

  .badge-pdf { background: #dc2626; }
  .badge-convert { background: #0284c7; }
  .badge-image { background: #059669; }
  .badge-dev { background: #7c3aed; }
  .badge-audio { background: #d97706; }
  .badge-text { background: #475569; }
  .badge-plan { background: #0f172a; }

  .section-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
  }

  .section-desc {
    font-size: 12px;
    color: #64748b;
    margin-left: auto;
    font-style: italic;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
    margin-bottom: 12px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    color: #334155;
    text-align: left;
    padding: 8px 10px;
    font-weight: 700;
    border-bottom: 1.5px solid #cbd5e1;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-child(even) {
    background: #fafbfc;
  }

  .tool-name {
    font-weight: 700;
    color: #0f172a;
  }

  .badge-priority {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .pri-high {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .pri-med {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .pri-normal {
    background: #e0f2fe;
    color: #075985;
    border: 1px solid #bae6fd;
  }

  .tech-pill {
    display: inline-block;
    background: #f1f5f9;
    color: #475569;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    border: 1px solid #e2e8f0;
  }

  /* Callout Card */
  .callout-box {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 12px 14px;
    border-radius: 0 8px 8px 0;
    margin: 14px 0;
    font-size: 12px;
    color: #334155;
  }

  .callout-box strong {
    color: #1e40af;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 14px 0 20px 0;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    text-align: center;
  }

  .stat-number {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.1;
  }

  .stat-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    margin-top: 4px;
  }

  .footer-note {
    text-align: center;
    font-size: 10.5px;
    color: #94a3b8;
    margin-top: 24px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
  }
</style>
</head>
<body>

  <!-- Cover Header -->
  <div class="header-card">
    <span class="brand-tag">Cortexis Solution Hub</span>
    <h1 class="header-title">Comprehensive Tools & Converters Roadmap</h1>
    <p class="header-subtitle">
      Master catalog and architectural blueprint for expanding the Cortexis Free Online Toolkit ahead of the end-of-month production deployment.
    </p>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Current Toolkit</div>
        <div class="meta-val">62 Implemented Tools</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Proposed Additions</div>
        <div class="meta-val">+42 High-Value Utilities</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Target Architecture</div>
        <div class="meta-val">100% Client-Side / WASM</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Target Deployment</div>
        <div class="meta-val">End of Month 2026</div>
      </div>
    </div>
  </div>

  <!-- Key Summary Metrics -->
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-number" style="color: #dc2626;">+7</div>
      <div class="stat-label">Essential PDF Tools</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: #0284c7;">+16</div>
      <div class="stat-label">Missing Converters</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: #059669;">+8</div>
      <div class="stat-label">Image & Graphics Tools</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: #7c3aed;">+11</div>
      <div class="stat-label">Developer & Text Tools</div>
    </div>
  </div>

  <div class="callout-box">
    <strong>Strategic Advantage:</strong> Cortexis leverages client-side WebAssembly, Canvas, and pure JS engines (<code>pdf-lib</code>, <code>tesseract.js</code>, <code>ffmpegEngine.js</code>). Adding these recommended utilities does <em>not</em> increase server RAM or cloud compute overhead, ensuring infinite scalability and zero privacy liability.
  </div>

  <!-- Section 1: PDF Tools Expansion -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-pdf">P</div>
      <h2 class="section-title">1. High-Demand Missing PDF Tools</h2>
      <span class="section-desc">Critical additions for business, academic & legal workflows</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 24%;">Tool Name</th>
          <th style="width: 44%;">Utility & Key Features</th>
          <th style="width: 18%;">Library / Engine</th>
          <th style="width: 14%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">PDF Watermark Adder</td>
          <td>Add text (Confidential, Draft) or PNG/JPG logo stamps to all or selected pages with opacity, angle, and position controls.</td>
          <td><span class="tech-pill">pdf-lib</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Add Page Numbers to PDF</td>
          <td>Insert page numbers ("Page 1 of N", Arabic, Roman) with custom position, margins, fonts, and starting number.</td>
          <td><span class="tech-pill">pdf-lib</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">PDF e-Sign (Sign PDF)</td>
          <td>Draw signature on canvas, type signature, or upload stamp image; drag-and-drop to position on any page and export.</td>
          <td><span class="tech-pill">HTML5 Canvas + pdf-lib</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">PDF Redact / Blackout</td>
          <td>Permanently black out sensitive data (CNIC, tax IDs, credit cards) so confidential information cannot be highlighted or extracted.</td>
          <td><span class="tech-pill">pdf-lib (DrawRect)</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">PDF to Grayscale (B&W)</td>
          <td>Convert color PDFs to pure grayscale to reduce print ink costs and meet government portal upload guidelines.</td>
          <td><span class="tech-pill">pdfjs-dist + Canvas</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Compare PDFs (Visual Diff)</td>
          <td>Side-by-side comparison of two revisions of a document, highlighting added/removed text and visual differences.</td>
          <td><span class="tech-pill">pdfjs-dist + Pixelmatch</span></td>
          <td><span class="badge-priority pri-normal">Tier 3</span></td>
        </tr>
        <tr>
          <td class="tool-name">PDF Bookmarks / TOC Builder</td>
          <td>Add or edit PDF bookmarks, outlines, and interactive table of contents for long documents and ebooks.</td>
          <td><span class="tech-pill">pdf-lib Outlines</span></td>
          <td><span class="badge-priority pri-normal">Tier 3</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-break-after"></div>

  <!-- Section 2: Missing Converters -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-convert">C</div>
      <h2 class="section-title">2. Essential Missing Converters (Document, Media & Data)</h2>
      <span class="section-desc">Highest Google search volume queries in the tools industry</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 26%;">Converter Name</th>
          <th style="width: 42%;">Transformation & Purpose</th>
          <th style="width: 18%;">Technology</th>
          <th style="width: 14%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">Word to PDF (DOCX → PDF)</td>
          <td>Direct conversion of Word documents into styled, printable PDFs without requiring Microsoft Office.</td>
          <td><span class="tech-pill">mammoth + jspdf</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Excel to PDF (XLSX → PDF)</td>
          <td>Convert spreadsheets and tables into formatted, page-aligned PDF documents.</td>
          <td><span class="tech-pill">xlsx + jspdf-autotable</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Image to PDF (JPG/PNG → PDF)</td>
          <td>Combine multiple receipts, photos, or scans into a single, clean multi-page PDF document.</td>
          <td><span class="tech-pill">pdf-lib</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">HEIC / HEIF to JPG/PNG</td>
          <td>Convert iPhone photos (HEIC) to universal JPG/PNG formats. (Massive search traffic on Windows/Android).</td>
          <td><span class="tech-pill">heic2any (Client WASM)</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">AVIF to JPG / PNG / WebP</td>
          <td>Convert modern AVIF images to standard formats for legacy browser and editor compatibility.</td>
          <td><span class="tech-pill">HTML5 Canvas ImageBitmap</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">GIF to MP4 Converter</td>
          <td>Compress heavy 20MB animated GIFs into 500KB ultra-fast MP4 videos for web embedding.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">WEBM to MP4 / MP4 to WEBM</td>
          <td>Convert browser screen recordings and OBS clips into universally playable MP4 files and vice-versa.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">OGG / OPUS to MP3</td>
          <td>Convert WhatsApp voice notes (.opus / .ogg) and Telegram audio into universally playable MP3 files.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">M4A / AAC to MP3</td>
          <td>Convert Apple voice memos and iTunes audio files to standard MP3.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">CSV ↔ JSON Converter</td>
          <td>Two-way conversion between tabular CSV data and nested/array JSON objects with instant download.</td>
          <td><span class="tech-pill">PapaParse / Native JS</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">XML ↔ JSON Converter</td>
          <td>Convert legacy XML documents to clean JSON and vice-versa for API debugging.</td>
          <td><span class="tech-pill">fast-xml-parser</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">YAML ↔ JSON Converter</td>
          <td>Convert Kubernetes / Docker-Compose YAML configurations into JSON and vice-versa.</td>
          <td><span class="tech-pill">yaml package</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">SQL to CSV / CSV to SQL</td>
          <td>Convert SQL dump results to spreadsheet CSV, or CSV tables into bulk SQL <code>INSERT INTO</code> statements.</td>
          <td><span class="tech-pill">Native JS Parser</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Markdown to PDF / HTML</td>
          <td>Live markdown editor that compiles and prints clean documentation with syntax-highlighted code.</td>
          <td><span class="tech-pill">react-markdown + jspdf</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">RAR / 7Z to ZIP Converter</td>
          <td>Extract or re-pack uncompressed/proprietary archives into standard cross-platform ZIP files.</td>
          <td><span class="tech-pill">libarchive.js (WASM)</span></td>
          <td><span class="badge-priority pri-normal">Tier 3</span></td>
        </tr>
        <tr>
          <td class="tool-name">Unix Timestamp to Date</td>
          <td>Convert epoch milliseconds/seconds to human dates across all timezones and vice-versa.</td>
          <td><span class="tech-pill">Native Date API</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Section 3: Image & Graphics Tools -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-image">I</div>
      <h2 class="section-title">3. Missing High-Demand Image & Graphics Tools</h2>
      <span class="section-desc">E-commerce, privacy and design utilities</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 26%;">Tool Name</th>
          <th style="width: 44%;">Utility & Key Features</th>
          <th style="width: 16%;">Technology</th>
          <th style="width: 14%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">AI Background Remover</td>
          <td>1-click background removal for product photos and portraits entirely inside the browser using WebAssembly.</td>
          <td><span class="tech-pill">@imgly/bg-removal</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · High</span></td>
        </tr>
        <tr>
          <td class="tool-name">Favicon & App Icon Suite</td>
          <td>Upload 1 logo → generates 16x16, 32x32, 180x180 Apple Touch, 192x192, 512x512 PWA icons + <code>site.webmanifest</code> zip.</td>
          <td><span class="tech-pill">Canvas + JSZip</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Photo EXIF Privacy Stripper</td>
          <td>Read and wipe GPS coordinates, camera serial numbers, and personal metadata from JPEG/PNG photos before uploading.</td>
          <td><span class="tech-pill">exif-js / piexifjs</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Image Watermark & Batch Stamp</td>
          <td>Apply custom copyright text or logo image overlays onto photos in bulk with opacity and position controls.</td>
          <td><span class="tech-pill">HTML5 Canvas</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Blur / Censor / Pixelate Tool</td>
          <td>Easily blur or pixelate faces, car license plates, and sensitive documents with a brush or rectangle tool.</td>
          <td><span class="tech-pill">Canvas Image Filters</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Image OCR (Image to Text)</td>
          <td>Standalone dedicated tool to extract text from screenshots, invoices, and photos. (<code>tesseract.js</code> already installed).</td>
          <td><span class="tech-pill">tesseract.js</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">SVG Optimizer & Cleaner</td>
          <td>Minify SVG code, strip editor metadata (Illustrator/Figma artifacts), and clean path data for faster web load.</td>
          <td><span class="tech-pill">svgo in browser</span></td>
          <td><span class="badge-priority pri-normal">Tier 3</span></td>
        </tr>
        <tr>
          <td class="tool-name">Meme Generator</td>
          <td>Classic meme templates + custom upload with editable top/bottom impact captions and instant PNG export.</td>
          <td><span class="tech-pill">Canvas Context2D</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-break-after"></div>

  <!-- Section 4: Developer & Code Tools -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-dev">D</div>
      <h2 class="section-title">4. Developer & Code Utilities (DevToys / CyberChef Style)</h2>
      <span class="section-desc">Essential for developers, devops engineers, and QA teams</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 26%;">Tool Name</th>
          <th style="width: 44%;">Utility & Key Features</th>
          <th style="width: 16%;">Technology</th>
          <th style="width: 14%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">JWT Decoder & Inspector</td>
          <td>Decode JWT Header, Payload, Claims, and Expiration timestamps in browser without exposing secret tokens over internet.</td>
          <td><span class="tech-pill">Native Base64URL</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Hash & Checksum Generator</td>
          <td>Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes for pasted text or uploaded files for integrity checks.</td>
          <td><span class="tech-pill">Web Crypto API</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">UUID / GUID & Secret Generator</td>
          <td>Generate batch v4 UUIDs, NanoIDs, cryptographic random hex tokens, and strong passwords.</td>
          <td><span class="tech-pill">crypto.randomUUID()</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">SQL Formatter & Beautifier</td>
          <td>Beautify messy SQL queries for MySQL, PostgreSQL, SQLite, and Oracle with indentation and keyword capitalization.</td>
          <td><span class="tech-pill">sql-formatter</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">CSS Visual Generator Suite</td>
          <td>Interactive visual UI generators for: (1) Multi-layer Box Shadows, (2) Glassmorphism, (3) Mesh & Linear Gradients.</td>
          <td><span class="tech-pill">React + CSS Variables</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">RegEx Tester & Explainer</td>
          <td>Real-time regular expression evaluation with color-coded capture groups and cheat-sheet library.</td>
          <td><span class="tech-pill">RegExp JS Engine</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Text & Code Diff Checker</td>
          <td>Side-by-side visual difference highlighter showing additions, deletions, and line changes between two files.</td>
          <td><span class="tech-pill">diff / jsdifflib</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">URL Encoder / Decoder</td>
          <td>Clean component URL encoder, decoder, and query string parameter parser.</td>
          <td><span class="tech-pill">encodeURIComponent</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Section 5: Text, Video & Audio Utilities -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-audio">A</div>
      <h2 class="section-title">5. Missing Text, Video & Audio Quick Tools</h2>
      <span class="section-desc">Streamlining everyday content creation and media editing</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 26%;">Tool Name</th>
          <th style="width: 44%;">Utility & Key Features</th>
          <th style="width: 16%;">Technology</th>
          <th style="width: 14%;">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">Word & Character Counter</td>
          <td>Live word count, character count, sentence count, reading time (WPM), speaking time, and keyword density.</td>
          <td><span class="tech-pill">Pure React Engine</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Case Converter Suite</td>
          <td>Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and Sentence case.</td>
          <td><span class="tech-pill">String Regex</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Duplicate Line Remover & Sorter</td>
          <td>Clean up email lists, IDs, and raw text by stripping duplicates, blank lines, and sorting alphabetically.</td>
          <td><span class="tech-pill">Set / Array Sort</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Video Trimmer / Cutter</td>
          <td>Slice start and end times of MP4/MOV videos with visual scrub slider and export trimmed video.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Audio Trimmer / Ringtone Maker</td>
          <td>Trim audio tracks with waveform preview to create custom ringtones and clips.</td>
          <td><span class="tech-pill">Web Audio API / FFmpeg</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
        <tr>
          <td class="tool-name">Video Audio Remover (Muter)</td>
          <td>Strip audio track completely from video clips in 2 seconds.</td>
          <td><span class="tech-pill">ffmpegEngine.js (-an)</span></td>
          <td><span class="badge-priority pri-high">Tier 1 · Urgent</span></td>
        </tr>
        <tr>
          <td class="tool-name">Video Speed Adjuster</td>
          <td>Speed up or slow down videos (0.5x, 0.75x, 1.25x, 1.5x, 2x) preserving audio pitch.</td>
          <td><span class="tech-pill">ffmpegEngine.js</span></td>
          <td><span class="badge-priority pri-med">Tier 2</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-break-after"></div>

  <!-- Section 6: Phased Roadmap & Deployment Readiness -->
  <div class="section">
    <div class="section-header">
      <div class="section-badge badge-plan">R</div>
      <h2 class="section-title">6. Implementation Roadmap & Production Deployment Checklist</h2>
      <span class="section-desc">Timeline leading to end-of-month deployment</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Phase</th>
          <th style="width: 50%;">Deliverables & Scope</th>
          <th style="width: 30%;">Status / Target</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tool-name">Phase 1 (Days 1–3)<br><small style="color: #64748b;">Fast High-Value Wins</small></td>
          <td>
            • PDF Watermark, Page Numberer, and e-Signature Tool (using existing <code>pdf-lib</code>).<br>
            • Word to PDF & Image to PDF converters.<br>
            • JWT Decoder, Hash Generator, UUID Generator, and Word/Case Converters.<br>
            • Favicon & App Icon Suite.
          </td>
          <td><strong style="color: #059669;">Ready for immediate build</strong></td>
        </tr>
        <tr>
          <td class="tool-name">Phase 2 (Days 4–7)<br><small style="color: #64748b;">Media & Converters</small></td>
          <td>
            • Video Trimmer, Audio Muter, and OGG-to-MP3 converter (using <code>ffmpegEngine.js</code>).<br>
            • CSV ↔ JSON, XML ↔ JSON, and Timestamp converters.<br>
            • Standalone Image OCR (using existing <code>tesseract.js</code>).<br>
            • Text Diff Checker and SQL Beautifier.
          </td>
          <td><strong style="color: #0284c7;">Scheduled for mid-sprint</strong></td>
        </tr>
        <tr>
          <td class="tool-name">Phase 3 (Days 8–10)<br><small style="color: #64748b;">Advanced Features</small></td>
          <td>
            • AI Background Remover (client-side WASM).<br>
            • CSS Generator Suite (Shadows, Gradients, Glassmorphism).<br>
            • Photo EXIF Privacy Stripper & Censor/Blur Tool.<br>
            • Favorites & "Recently Used" LocalStorage shelf on <code>/tools</code> page.
          </td>
          <td><strong style="color: #7c3aed;">Scheduled pre-deployment</strong></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 18px;">
      <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
        Production Deployment Technical Checklist:
      </h3>
      <table style="font-size: 11px;">
        <thead>
          <tr>
            <th style="width: 28%;">Checkpoint</th>
            <th style="width: 52%;">Action Required</th>
            <th style="width: 20%;">Deployment Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tool-name">Docker Chromium Setup</td>
            <td><code>Dockerfile</code> uses Alpine for <code>npm run prerender</code>. Must ensure <code>apk add chromium</code> & <code>ENV CHROME_PATH=/usr/bin/chromium-browser</code> are set.</td>
            <td><strong style="color: #dc2626;">High (Build Failure)</strong></td>
          </tr>
          <tr>
            <td class="tool-name">PostgreSQL Data Volume</td>
            <td>Ensure <code>cortexis_pg_data</code> volume persistence and configure automated daily <code>pg_dump</code> cron backup on the host.</td>
            <td><strong style="color: #d97706;">Medium (Data Loss)</strong></td>
          </tr>
          <tr>
            <td class="tool-name">Redis & BullMQ Durability</td>
            <td>Redis password & volatile-lru policy verified in <code>docker-compose.yml</code>. Ensure email worker stays healthy.</td>
            <td><strong style="color: #059669;">Low (Verified)</strong></td>
          </tr>
          <tr>
            <td class="tool-name">Client Error Boundaries</td>
            <td>Wrap tool view with <code>&lt;ErrorBoundary&gt;</code> to catch malformed files gracefully without crashing the React root tree.</td>
            <td><strong style="color: #d97706;">Medium (UX Glitch)</strong></td>
          </tr>
          <tr>
            <td class="tool-name">Sitemap & SEO Sync</td>
            <td>Run <code>node scripts/sitemap.mjs</code> after registering new tool slugs to update <code>sitemap.xml</code> with high SEO rankings.</td>
            <td><strong style="color: #059669;">Low (Organic Growth)</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-note">
      Document generated for Cortexis Solution Hub · Platform Architecture & Deployment Roadmap · Confidential & Proprietary
    </div>
  </div>

</body>
</html>
`;

async function generatePdf() {
  console.log('Launching browser to generate PDF...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve(__dirname, 'Cortexis_Useful_Tools_and_Converters_Guide.pdf');
  console.log('Rendering PDF to:', outputPath);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm',
    }
  });

  await browser.close();
  console.log('PDF successfully generated at:', outputPath);
}

generatePdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
