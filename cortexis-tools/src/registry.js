// Central registry of every tool. Used by the hub page, the tool shell and the static page generator.
export const CATEGORIES = [
  { id: 'pdf', name: 'PDF tools', blurb: 'Edit, protect and organise PDFs with a built-in PDF engine.' },
  { id: 'convert', name: 'Converters', blurb: 'Documents, images, media, data and archives — converted in your browser.' },
  { id: 'image', name: 'Image tools', blurb: 'Privacy, branding and icon utilities for images.' },
  { id: 'dev', name: 'Developer tools', blurb: 'Everyday utilities for developers, with zero network requests.' },
  { id: 'text', name: 'Text & media', blurb: 'Text clean-up and quick audio/video edits.' },
];

export const TOOLS = [
  // ---- PDF ----
  { slug: 'pdf-watermark', name: 'PDF Watermark', category: 'pdf', description: 'Stamp text or an image watermark on every page — tiled, centred or custom placed, with opacity and rotation.', keywords: 'watermark stamp pdf text image tile' },
  { slug: 'pdf-page-numbers', name: 'PDF Page Numbers', category: 'pdf', description: 'Add page numbers in any position and format (1, i, A, "Page 1 of 10"), skipping cover pages if needed.', keywords: 'page numbers pagination bates pdf' },
  { slug: 'pdf-esign', name: 'PDF e-Sign', category: 'pdf', description: 'Draw, type or upload a signature and place it (plus a date and text) on any page of a PDF.', keywords: 'sign signature esign draw pdf' },
  { slug: 'pdf-redact', name: 'PDF Redact / Blackout', category: 'pdf', description: 'Permanently black out regions of a PDF — the underlying text is removed, not just covered.', keywords: 'redact blackout censor remove text pdf' },
  { slug: 'pdf-grayscale', name: 'PDF to Grayscale', category: 'pdf', description: 'Convert a colour PDF to grayscale for cheaper printing — images are converted, vector content desaturated.', keywords: 'grayscale black white print pdf convert' },
  { slug: 'pdf-compare', name: 'Compare PDFs', category: 'pdf', description: 'Find what changed between two PDF versions: text differences, page counts, size and metadata, side by side.', keywords: 'compare diff pdf versions' },
  { slug: 'pdf-bookmarks', name: 'PDF Bookmarks / TOC', category: 'pdf', description: 'View, edit or build the bookmark tree (outline) of a PDF and add a clickable table of contents.', keywords: 'bookmarks outline toc table of contents pdf' },
  // ---- Converters ----
  { slug: 'docx-to-pdf', name: 'DOCX to PDF', category: 'convert', description: 'Convert Word documents to PDF entirely in your browser — headings, lists, tables and images are preserved.', keywords: 'word docx pdf convert document' },
  { slug: 'xlsx-to-pdf', name: 'XLSX to PDF', category: 'convert', description: 'Turn Excel workbooks into clean PDF tables, one section per sheet, in portrait or landscape.', keywords: 'excel xlsx pdf spreadsheet convert' },
  { slug: 'image-to-pdf', name: 'Image to PDF', category: 'convert', description: 'Combine JPG, PNG, WebP, GIF, BMP or SVG images into one PDF with page size, margins and fit options.', keywords: 'jpg png webp image pdf combine merge' },
  { slug: 'heic-to-jpg', name: 'HEIC to JPG / PNG', category: 'convert', description: "Convert iPhone HEIC/HEIF photos to JPG or PNG using your browser's native decoder.", keywords: 'heic heif iphone jpg png convert' },
  { slug: 'avif-to-jpg', name: 'AVIF to JPG / PNG / WebP', category: 'convert', description: 'Convert AVIF images to JPG, PNG or WebP with adjustable quality — batch supported.', keywords: 'avif jpg png webp convert' },
  { slug: 'gif-to-mp4', name: 'GIF to MP4', category: 'convert', description: 'Turn animated GIFs into small MP4 (or WebM) videos with a built-in GIF decoder and MP4 muxer.', keywords: 'gif mp4 video convert animation' },
  { slug: 'webm-mp4', name: 'WEBM ↔ MP4', category: 'convert', description: 'Convert WebM to MP4 or MP4 to WebM in the browser, with resolution and quality controls.', keywords: 'webm mp4 convert video' },
  { slug: 'ogg-to-mp3', name: 'OGG / OPUS Converter', category: 'convert', description: 'Convert OGG and Opus audio to WAV or M4A (AAC) — decoding happens locally.', keywords: 'ogg opus mp3 wav m4a aac audio convert' },
  { slug: 'm4a-to-mp3', name: 'M4A / AAC Converter', category: 'convert', description: 'Convert M4A and AAC audio to WAV or M4A with trimming and normalisation.', keywords: 'm4a aac mp3 wav audio convert' },
  { slug: 'csv-json', name: 'CSV ↔ JSON', category: 'convert', description: 'Convert CSV to JSON (array of objects) and JSON to CSV with delimiter detection and nested flattening.', keywords: 'csv json convert data' },
  { slug: 'xml-json', name: 'XML ↔ JSON', category: 'convert', description: 'Convert XML to JSON and back with a predictable attribute/text mapping.', keywords: 'xml json convert data' },
  { slug: 'yaml-json', name: 'YAML ↔ JSON', category: 'convert', description: 'Convert YAML to JSON and JSON to YAML, with validation errors shown inline.', keywords: 'yaml yml json convert config' },
  { slug: 'sql-csv', name: 'SQL ↔ CSV', category: 'convert', description: 'Turn CSV data into INSERT statements (MySQL, PostgreSQL, SQLite, SQL Server) or extract rows from SQL dumps to CSV.', keywords: 'sql insert csv convert database' },
  { slug: 'markdown-converter', name: 'Markdown to PDF / HTML', category: 'convert', description: 'Render Markdown into a styled HTML page or a PDF — code blocks, tables and task lists included.', keywords: 'markdown md html pdf convert readme' },
  { slug: 'archive-to-zip', name: 'Archive to ZIP', category: 'convert', description: 'Repack TAR, TAR.GZ, TGZ and GZ archives (or any files) into a ZIP, and inspect archive contents.', keywords: 'zip tar gz tgz rar 7z archive extract' },
  { slug: 'timestamp-converter', name: 'Unix Timestamp ↔ Date', category: 'convert', description: 'Convert Unix timestamps (seconds/milliseconds) to readable dates in any timezone, and back.', keywords: 'unix timestamp epoch date time convert' },
  // ---- Image ----
  { slug: 'background-remover', name: 'Background Remover', category: 'image', description: 'Remove plain or gradient backgrounds from product photos and logos with tolerance, edge feathering and manual touch-up.', keywords: 'background remove transparent png cutout' },
  { slug: 'favicon-generator', name: 'Favicon & App Icon Generator', category: 'image', description: 'Generate favicon.ico, PNG icons (16–512px), Apple touch icon and a web manifest — downloaded as a ZIP with HTML snippet.', keywords: 'favicon icon ico apple touch manifest pwa' },
  { slug: 'exif-remover', name: 'EXIF / Metadata Remover', category: 'image', description: 'See what your photos reveal (GPS, camera, dates) and strip all metadata from JPG, PNG and WebP losslessly.', keywords: 'exif metadata gps privacy strip remove' },
  { slug: 'image-watermark', name: 'Batch Image Watermark', category: 'image', description: 'Add a text or logo watermark to many images at once — position, tiling, opacity, size — and download as ZIP.', keywords: 'watermark batch images logo text' },
  { slug: 'image-blur', name: 'Blur / Censor / Pixelate', category: 'image', description: 'Blur, pixelate or black out faces, plates and private details by drawing regions on the image.', keywords: 'blur pixelate censor face privacy' },
  { slug: 'image-ocr', name: 'Image to Text (OCR)', category: 'image', description: "Extract text from images with the browser's built-in text detector, or prepare scans for OCR.", keywords: 'ocr text recognition image scan' },
  { slug: 'svg-optimizer', name: 'SVG Optimizer', category: 'image', description: 'Minify SVG files: strip editor metadata, round coordinates, clean styles — with a live before/after preview.', keywords: 'svg optimize minify svgo' },
  { slug: 'meme-generator', name: 'Meme Generator', category: 'image', description: 'Classic top/bottom text memes with outlined Impact-style captions, custom colours and sizes.', keywords: 'meme generator caption text image' },
  // ---- Dev ----
  { slug: 'jwt-decoder', name: 'JWT Decoder', category: 'dev', description: 'Decode JWT header and payload, check expiry, and verify HS256/384/512 signatures with a secret — all offline.', keywords: 'jwt token decode verify auth' },
  { slug: 'hash-generator', name: 'Hash & Checksum Generator', category: 'dev', description: 'MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC32 for text or files, with HMAC support.', keywords: 'hash md5 sha256 checksum hmac crc32' },
  { slug: 'uuid-generator', name: 'UUID & Secret Generator', category: 'dev', description: 'Generate UUID v4/v7, ULIDs, random passwords, API keys, hex/base64 secrets using the Web Crypto API.', keywords: 'uuid ulid password secret random generator' },
  { slug: 'sql-formatter', name: 'SQL Formatter', category: 'dev', description: 'Beautify or minify SQL with consistent keyword casing and indentation.', keywords: 'sql format beautify minify' },
  { slug: 'css-generator', name: 'CSS Visual Generators', category: 'dev', description: 'Box shadows, glassmorphism, gradients, border radius and text shadows — tweak visually, copy the CSS.', keywords: 'css shadow glassmorphism gradient generator' },
  { slug: 'regex-tester', name: 'Regex Tester & Explainer', category: 'dev', description: 'Test regular expressions live with match highlighting, groups, replace preview and a plain-English explanation.', keywords: 'regex regular expression test explain' },
  { slug: 'diff-checker', name: 'Text / Code Diff Checker', category: 'dev', description: 'Compare two texts line by line with inline character highlighting and unified diff export.', keywords: 'diff compare text code' },
  { slug: 'url-encoder', name: 'URL Encoder / Decoder', category: 'dev', description: 'Encode/decode URLs and components, parse query strings, and Base64 / HTML-entity encode.', keywords: 'url encode decode query string base64' },
  // ---- Text & media ----
  { slug: 'word-counter', name: 'Word & Character Counter', category: 'text', description: 'Words, characters, sentences, paragraphs, reading time and keyword density as you type.', keywords: 'word count character count reading time' },
  { slug: 'case-converter', name: 'Case Converter Suite', category: 'text', description: 'UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT_CASE and more.', keywords: 'case convert upper lower camel snake kebab' },
  { slug: 'line-tools', name: 'Duplicate Line Remover & Sorter', category: 'text', description: 'Remove duplicate or empty lines, sort (A–Z, natural, numeric, by length), shuffle, reverse, trim and number lines.', keywords: 'duplicate lines remove sort shuffle text' },
  { slug: 'video-trimmer', name: 'Video Trimmer', category: 'text', description: 'Cut a clip out of a video and export MP4 (or WebM) — frame-accurate, no upload.', keywords: 'video trim cut clip mp4' },
  { slug: 'audio-trimmer', name: 'Audio Trimmer / Ringtone Maker', category: 'text', description: 'Trim audio with a waveform, add fades, and export WAV or M4A — perfect for ringtones.', keywords: 'audio trim ringtone cut fade' },
  { slug: 'video-muter', name: 'Video Audio Muter', category: 'text', description: 'Remove the audio track from MP4/MOV losslessly (no re-encoding), or from any video by re-encoding.', keywords: 'mute video remove audio' },
  { slug: 'video-speed', name: 'Video Speed Adjuster', category: 'text', description: 'Speed up or slow down a video (0.25×–4×) with pitch-preserving audio and MP4 export.', keywords: 'video speed fast slow motion' },
];
export const byCategory = (id) => TOOLS.filter((t) => t.category === id);
export const findTool = (slug) => TOOLS.find((t) => t.slug === slug);
