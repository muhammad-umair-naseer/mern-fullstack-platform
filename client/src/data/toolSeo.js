/**
 * Per-tool page titles and meta descriptions.
 *
 * Every tool page used to share one generated title, `${tool.name} — Free
 * ${category.label} Tool`, which produced sixty near-identical strings like
 * "PDF Splitter — Free PDF Tool". The <title> is the strongest single on-page
 * signal there is, and it was spending that signal on the word "Tool".
 *
 * These are written from the keyword research behind each tool's guide: the
 * phrase people actually type goes first, the differentiator second. Titles are
 * kept to roughly 45 characters because site.js appends " | Cortexis Solution
 * Hub" to every page, and Google truncates the pair somewhere near 60.
 *
 * Descriptions stay under 155 characters and each names a concrete benefit
 * rather than repeating the title. They deliberately never describe HOW the
 * processing works.
 *
 * A slug missing here falls back to the generated title, so adding a tool
 * cannot break the page — it simply gets the generic version until someone
 * writes it a real one.
 */
const TOOL_SEO = {
  // 46 Toolkit Additions
  'pdf-watermark': {
    title: 'PDF Watermark Online Free — Add Text or Logo Stamp',
    description: 'Add custom text or image watermark stamps to your PDF online. Adjust opacity, rotation, and placement with zero file uploads.',
  },
  'pdf-page-numbers': {
    title: 'Add Page Numbers to PDF Free — Custom Pagination',
    description: 'Insert page numbers into any position in your PDF document. Support for Arabic, Roman, and Bates numbering formats.',
  },
  'pdf-esign': {
    title: 'Sign PDF Online Free — Draw, Type or Stamp e-Sign',
    description: 'Draw or type your signature and position it on any page of your PDF. 100% private, client-side digital signing.',
  },
  'pdf-redact': {
    title: 'Redact PDF Online — Permanently Blackout Sensitive Data',
    description: 'Permanently remove and black out confidential text, CNIC numbers, and secrets from PDF content streams.',
  },
  'pdf-grayscale': {
    title: 'Convert PDF to Grayscale — Black & White PDF Tool',
    description: 'Convert color PDFs to pure grayscale to reduce printing ink costs and meet government portal document upload standards.',
  },
  'pdf-compare': {
    title: 'Compare PDF Files Online — Visual & Text Diff Tool',
    description: 'Compare two PDF documents side-by-side. Highlights added and deleted lines and detects metadata differences.',
  },
  'pdf-bookmarks': {
    title: 'PDF Bookmarks & Outline Editor — Build Clickable TOC',
    description: 'View, edit, and organize PDF outline bookmarks or automatically insert an interactive table of contents page.',
  },
  'docx-to-pdf': {
    title: 'Word to PDF Converter Online Free — DOCX to PDF',
    description: 'Convert DOCX Word documents into beautifully styled PDFs in your browser without requiring Microsoft Office.',
  },
  'xlsx-to-pdf': {
    title: 'Excel to PDF Converter — XLSX Spreadsheets to PDF',
    description: 'Turn Excel worksheets into cleanly formatted, page-aligned PDF tables without server uploads.',
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter — JPG, PNG, WebP to PDF',
    description: 'Combine multiple JPG, PNG, and WebP images into a single multi-page PDF with margins and sizing controls.',
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter Free — iPhone Photos to JPG',
    description: 'Convert Apple iPhone HEIC and HEIF photos to universal JPG or PNG format right inside your browser.',
  },
  'avif-to-jpg': {
    title: 'AVIF to JPG Converter — Convert Modern AVIF Images',
    description: 'Convert modern AVIF images to JPG, PNG, or WebP with adjustable quality and batch conversion support.',
  },
  'gif-to-mp4': {
    title: 'GIF to MP4 Video Converter — Compress Animated GIFs',
    description: 'Convert heavy animated GIFs into lightweight, fast-loading MP4 or WebM videos locally with built-in muxing.',
  },
  'webm-mp4': {
    title: 'WebM to MP4 Converter — Convert Video in Browser',
    description: 'Convert WebM screen recordings into MP4 videos and vice-versa with quality, resolution, and audio controls.',
  },
  'ogg-to-mp3': {
    title: 'OGG / Opus to MP3 Converter — Voice Note Converter',
    description: 'Convert WhatsApp voice notes (.opus / .ogg) and Telegram audio to universal WAV or M4A formats.',
  },
  'm4a-to-mp3': {
    title: 'M4A to MP3 Audio Converter — Apple Audio to WAV',
    description: 'Convert Apple Voice Memos and iTunes M4A audio files into standard WAV or AAC format with audio trimming.',
  },
  'csv-json': {
    title: 'CSV to JSON Converter & JSON to CSV Online',
    description: 'Two-way conversion between tabular CSV files and structured JSON objects with delimiter auto-detection.',
  },
  'xml-json': {
    title: 'XML to JSON Converter & JSON to XML Online Free',
    description: 'Convert legacy XML documents to clean JSON and vice-versa for API debugging and software development.',
  },
  'yaml-json': {
    title: 'YAML to JSON Converter & JSON to YAML Online',
    description: 'Convert Kubernetes configs, Docker-Compose files, and YAML documents to JSON and back with inline validation.',
  },
  'sql-csv': {
    title: 'SQL to CSV Converter & CSV to SQL INSERTs',
    description: 'Turn CSV spreadsheets into bulk SQL INSERT queries or extract database tables from SQL dumps to CSV format.',
  },
  'markdown-converter': {
    title: 'Markdown to PDF & HTML Converter Online',
    description: 'Render Markdown notes into styled HTML pages or printable PDFs with code syntax highlighting and table support.',
  },
  'archive-to-zip': {
    title: 'TAR, GZ to ZIP Converter — Repack Archives Online',
    description: 'Inspect and repack TAR, TAR.GZ, TGZ, and GZ archives into standard ZIP files directly in your browser.',
  },
  'timestamp-converter': {
    title: 'Unix Timestamp to Date Converter — Epoch Time Tool',
    description: 'Convert Unix epoch timestamps (seconds and milliseconds) to readable human dates across all timezones.',
  },
  'background-remover': {
    title: 'Free Background Remover Online — Transparent PNG Cutout',
    description: 'Remove plain and studio backgrounds from product photos and logos with tolerance and edge feathering controls.',
  },
  'favicon-generator': {
    title: 'Favicon & App Icon Generator — Multi-Size Icon Suite',
    description: 'Generate multi-size favicon.ico, 16-512px PNGs, Apple Touch icon, and site.webmanifest package.',
  },
  'exif-remover': {
    title: 'EXIF Metadata Stripper — Remove GPS from Photos',
    description: 'Inspect camera and GPS coordinates and strip all EXIF metadata from JPG, PNG, and WebP photos for privacy.',
  },
  'image-watermark': {
    title: 'Batch Image Watermark — Stamp Photos in Bulk',
    description: 'Apply copyright text or logo stamps onto multiple images in batch with opacity, rotation, and tile controls.',
  },
  'image-blur': {
    title: 'Blur & Pixelate Image Online — Censor Private Details',
    description: 'Blur, pixelate, or black out faces, license plates, and sensitive documents with an interactive brush.',
  },
  'image-ocr': {
    title: 'Image to Text OCR Online — Extract Text from Images',
    description: 'Extract editable text from screenshots, scanned documents, and photos using client-side text detection.',
  },
  'svg-optimizer': {
    title: 'SVG Optimizer Online — Minify & Clean SVG Files',
    description: 'Minify SVG files, strip Figma/Illustrator editor junk, round coordinates, and preview before and after sizes.',
  },
  'meme-generator': {
    title: 'Free Meme Generator Online — Custom Caption Maker',
    description: 'Create classic memes with custom top and bottom outlined impact captions and instant high-res PNG export.',
  },
  'jwt-decoder': {
    title: 'JWT Decoder Online — Inspect Token Header & Payload',
    description: 'Decode JWT tokens, inspect claims, verify expiration, and validate HS256/384/512 signatures without internet transmission.',
  },
  'hash-generator': {
    title: 'Hash & Checksum Generator — MD5, SHA-256, SHA-512',
    description: 'Compute MD5, SHA-1, SHA-256, SHA-512, CRC32 hashes, and HMAC checksums for text and files locally.',
  },
  'uuid-generator': {
    title: 'UUID & Secret Generator — UUID v4, v7, Password Maker',
    description: 'Generate batch UUID v4/v7, ULIDs, cryptographic random passwords, and hex API secrets using Web Crypto.',
  },
  'sql-formatter': {
    title: 'SQL Formatter & Beautifier — Format SQL Queries',
    description: 'Format, indent, and beautify messy SQL queries for MySQL, PostgreSQL, SQLite, and SQL Server.',
  },
  'css-generator': {
    title: 'CSS Visual Generators — Box Shadow, Glassmorphism, Gradients',
    description: 'Interactive visual UI generator for CSS box shadows, glassmorphism blur, linear/mesh gradients, and border radius.',
  },
  'regex-tester': {
    title: 'RegEx Tester & Explainer — Test Regular Expressions',
    description: 'Real-time regular expression tester with syntax highlighting, capture groups, and plain-English pattern explanations.',
  },
  'diff-checker': {
    title: 'Text & Code Diff Checker — Compare Text Differences',
    description: 'Compare two code or text files side-by-side. Highlights line and character additions, deletions, and unified patches.',
  },
  'url-encoder': {
    title: 'URL Encoder / Decoder & Query String Parser',
    description: 'Encode and decode URLs, query parameters, Base64 strings, and HTML entities entirely in your browser.',
  },
  'word-counter': {
    title: 'Word & Character Counter — Reading Time & Text Stats',
    description: 'Live word count, character count, sentence count, reading time, and keyword density as you type.',
  },
  'case-converter': {
    title: 'Case Converter Suite — UPPERCASE, camelCase, snake_case',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.',
  },
  'line-tools': {
    title: 'Duplicate Line Remover & Sorter — Clean Text Lists',
    description: 'Remove duplicate lines, empty lines, sort alphabetically or naturally, reverse, and filter text entries.',
  },
  'video-trimmer': {
    title: 'Video Trimmer Online — Cut MP4 & WebM Videos',
    description: 'Frame-accurate browser video trimmer. Cut clips and export MP4 or WebM without uploading video files.',
  },
  'audio-trimmer': {
    title: 'Audio Trimmer & Ringtone Maker — Cut Audio Clips',
    description: 'Trim audio files with interactive visual waveforms and fade in/out effects for custom ringtones and clips.',
  },
  'video-muter': {
    title: 'Video Audio Remover (Muter) — Mute Video Online',
    description: 'Remove audio tracks from MP4, MOV, and WebM videos losslessly in 2 seconds with zero server uploads.',
  },
  'video-speed': {
    title: 'Video Speed Adjuster — Speed Up or Slow Down Video',
    description: 'Adjust video speed from 0.25x to 4x while preserving natural audio pitch and export high quality MP4.',
  },
  'pdf-compressor': {
    title: 'Compress PDF Online Free — Reduce PDF Size',
    description:
      'Reduce PDF file size online for free. Compress to 100KB, 200KB, 500KB or 1MB for email and application portals. No sign-up, no watermark, no size limit.',
  },
  'pdf-word': {
    title: 'PDF to Word Converter — Free, No Limits',
    description:
      'Convert PDF to Word online free. Turn any PDF into an editable DOCX you can type in. No account, no watermark and no file size cap.',
  },
  'pdf-merger': {
    title: 'Merge PDF Files Online Free — Combine PDFs',
    description:
      'Combine several PDF files into one document in the order you choose. Free, unlimited, no watermark and no sign-up required.',
  },
  'pdf-splitter': {
    title: 'Split PDF Online Free — Separate PDF Pages',
    description:
      'Split a PDF into separate files or extract a page range. Free PDF splitter with no page limit, no watermark and no account needed.',
  },
  'pdf-ocr': {
    title: 'PDF OCR Free — Make a Scanned PDF Searchable',
    description:
      'Extract selectable, searchable text from scanned and image-only PDFs. Free online OCR with no sign-up and no file size limit.',
  },
  'pdf-excel': {
    title: 'PDF to Excel Free — Extract Tables to XLSX',
    description:
      'Pull tables and structured data out of a PDF into an Excel spreadsheet. Free PDF to Excel converter, no watermark, no account.',
  },
  'pdf-page-remover': {
    title: 'Delete Pages from PDF Online Free',
    description:
      'Remove unwanted pages from a PDF and keep the rest intact. Free, unlimited and no sign-up, with the result downloaded in seconds.',
  },
  'extract-pages-from-pdf': {
    title: 'Extract Pages from PDF Free — Save as New PDF',
    description:
      'Pick any pages from a PDF and save them as a brand new document. Free page extractor with no limits and no watermark.',
  },
  'pdf-jpg': {
    title: 'PDF to JPG Converter Free — And JPG to PDF',
    description:
      'Convert PDF pages into JPG images, or build a PDF from a set of JPGs. Free both ways, with no watermark and no upload limit.',
  },
  'pdf-organizer': {
    title: 'Organise PDF Pages — Reorder and Duplicate',
    description:
      'Drag PDF pages into the order you want, duplicate them or drop them. Free visual page organiser with no account required.',
  },
  'pdf-protect': {
    title: 'Password Protect a PDF Online Free',
    description:
      'Lock a PDF with a password so only the right person can open it. Free PDF encryption with no sign-up and no watermark.',
  },
  'rotate-flip-image': {
    title: 'Rotate & Flip Image Online Free – Any Angle',
    description:
      'Turn a picture by 90° or any angle and mirror it horizontally or vertically. Quarter turns are lossless, format is kept. Free, no sign-up.',
  },
  'pdf-txt-html-rtf-odt': {
    title: 'PDF to TXT, HTML, RTF or ODT – Free Converter',
    description:
      'Extract the text and headings of a PDF into plain text, HTML, RTF or an OpenDocument file, with page breaks kept. Free, no sign-up, no watermark.',
  },
  'pdf-unlock': {
    title: 'Unlock PDF – Remove Password Online Free',
    description:
      'Remove the password from a PDF you know the password to. Open or owner password, AES-256 included, no sign-up, no watermark.',
  },
  'pdf-crop': {
    title: 'Crop PDF Online Free — Trim PDF Margins',
    description:
      'Cut white space and scanner edges off every page of a PDF at once. Free PDF cropper, unlimited, no account needed.',
  },
  'pdf-rotate': {
    title: 'Rotate PDF Online Free — Fix Sideways Pages',
    description:
      'Turn PDF pages 90, 180 or 270 degrees and save them the right way up. Free, permanent rotation with no watermark.',
  },
  'pdf-flatten': {
    title: 'Flatten PDF Free — Lock Forms and Annotations',
    description:
      'Flatten form fields and annotations into fixed page content so nothing can be changed. Free PDF flattener, no sign-up.',
  },
  'make-pdf-fillable': {
    title: 'Make a PDF Fillable Free — Add Form Fields',
    description:
      'Add real text fields and checkboxes to any PDF so it can be typed into instead of printed. Free fillable PDF creator, no account.',
  },
  'pdf-resize': {
    title: 'Resize PDF Page Size Free — A4, Letter, Custom',
    description:
      'Change a PDF between A4, Letter and custom page sizes without rebuilding the document. Free PDF resizer with no limits.',
  },
  'extract-images-from-pdf': {
    title: 'Extract Images from PDF Free — Save Pictures',
    description:
      'Pull the pictures out of a PDF and save them as usable image files. Free image extractor with no watermark and no sign-up.',
  },
  'pdf-png-webp-tiff-bmp-gif': {
    title: 'PDF to PNG, WebP, TIFF, BMP and GIF — Free',
    description:
      'Export PDF pages to PNG, WebP, TIFF, BMP or GIF at full quality. Free converter, no account and no file size cap.',
  },
  'png-compressor': {
    title: 'Compress PNG Free — Keep Transparency',
    description:
      'Shrink PNG file size while transparency stays exactly as it was. Free PNG compressor with no watermark and no upload limit.',
  },
  'qr-generator': {
    title: 'Free QR Code Generator — URL, Wi-Fi, vCard',
    description:
      'Generate QR codes for a link, Wi-Fi network, contact card or plain text. Free, unlimited, no expiry and no account needed.',
  },
  'image-resizer': {
    title: 'Resize an Image Online Free — Any Dimensions',
    description:
      'Set an exact width and height, or scale by percentage, in one step. Free image resizer with no watermark and no sign-up.',
  },
  'image-cropper': {
    title: 'Crop an Image Online Free — Any Aspect Ratio',
    description:
      'Trim a picture down to the part that matters at any aspect ratio. Free online image cropper, unlimited and account-free.',
  },
  'image-enlarger': {
    title: 'Enlarge an Image Free — Upscale Low Resolution',
    description:
      'Upscale a small or low-resolution picture without it turning to mush. Free image enlarger with no watermark or sign-up.',
  },
  'colour-picker': {
    title: 'Colour Picker from Image — HEX, RGB and HSL',
    description:
      'Sample an exact colour from any image and copy it as HEX, RGB or HSL. Free colour picker, no account and no limits.',
  },
  'save-web-as-pdf': {
    title: 'Save Webpage as PDF – URL to PDF, Free',
    description:
      'Paste a URL and get the page as a text-searchable PDF with working links, or typeset pasted text. Free, no sign-up, no watermark.',
  },
  'archive-converter': {
    title: 'ZIP to TAR.GZ Converter - Free Online',
    description:
      'Convert ZIP, TAR and TAR.GZ in any direction with folder structure intact. No account, no size cap, no quota.',
  },
  'mp3-mp4': {
    title: 'MP3 to MP4 Converter - Free, No Watermark',
    description:
      'Turn any audio track and a cover image into a YouTube-ready MP4 in three clicks. No watermark, no signup, no file size cap.',
  },
  'pdf-html': {
    title: 'PDF to HTML Converter – Free, Reflowable',
    description:
      'Turn any PDF into a small, standalone HTML5 page with real headings and paragraphs that reads on a phone. Free, no signup, no watermark.',
  },
  'mp4-mp3': {
    title: 'MP4 to MP3 Converter – Free, Pick the Bitrate',
    description:
      'Extract MP3 audio from MP4, MOV, WebM or MKV, choose 128–320 kbps, and hear the result before you download. No signup, no watermark.',
  },
  'video-converter': {
    title: 'Video Converter Online Free: MP4, MOV, MKV',
    description:
      'Convert MOV, MKV, WebM, AVI, FLV or WMV to MP4 that plays on iPhone, TV and Windows, with an optional 720p or 1080p cap. Free, no watermark.',
  },
  'mp3-compressor': {
    title: 'MP3 Compressor: Reduce MP3 File Size Free',
    description:
      'Shrink an MP3 to fit email, chat or course upload caps by picking a bitrate, sample rate and mono. Free, no signup, preview before download.',
  },
  'gif-compressor': {
    title: 'GIF Compressor: Shrink GIFs Free Online',
    description:
      'Reduce GIF file size with scale, colour, frame and speed controls, compare the result side by side, and download with no watermark.',
  },
  'mp4-gif': {
    title: 'MP4 to GIF Converter – Free, No Watermark',
    description:
      'Convert MP4, MOV or WebM to a clean animated GIF with a custom colour palette, no sign up and no watermark. Trim, pick FPS and width.',
  },
  'video-compressor': {
    title: 'Video Compressor: Free, No Signup, No Cap',
    description:
      'Shrink MP4, MOV, MKV and WebM for email, chat and the web with four plain controls. No watermark, no account, honest before/after sizes.',
  },
  'gif-maker': {
    title: 'GIF Maker from Images: Photos to GIF',
    description:
      'Turn JPG, PNG or WebP photos into one animated GIF with exact size, colour and delay control. Free, no watermark, no sign-up.',
  },
  'base64-encoder-decoder': {
    title: 'Base64 Encoder Decoder – Free, Any Format',
    description:
      'Decode messy Base64 as pasted: quotes, line breaks, data URIs, URL-safe, no padding. Encode UTF-8 text or any file to Base64 or a data URI.',
  },
  'jpeg-compressor': {
    title: 'Compress JPEG Online Free, No Resizing',
    description:
      'Shrink a JPG to an exact 40-100 quality, keep its pixel dimensions, and read the new KB before you download. No signup, no watermark.',
  },
  'webp-png': {
    title: 'WebP to PNG Converter Free, No Signup',
    description:
      'Convert WebP to PNG with transparency kept and the same pixel size. Free, no watermark, no signup, and the output size shown before download.',
  },
  'image-compressor': {
    title: 'Image Compressor: Free JPG & WebP',
    description:
      'Reduce image size without resizing: pick JPG or WebP, set a 40-100 quality slider, and see the new size in KB before you download.',
  },
  'image-converter': {
    title: 'Image Converter - Free PNG, JPG, WebP, PDF',
    description:
      'Convert PNG, JPG, WebP, BMP or SVG to PNG, JPG, WebP or a pixel-exact PDF with a quality slider. No signup, no watermark.',
  },
  'pdf-spreadsheet-suite': {
    title: 'PDF to Excel, CSV, ODS – Multi-PDF Workbook',
    description:
      'Queue any number of PDFs and download one workbook with a sheet per page — as XLSX, XLS, ODS, CSV, TSV or HTML. Free, no sign-up.',
  },
  'colour-format-utilities': {
    title: 'Color Code Converter: HEX, RGB, HSL, CMYK',
    description:
      'Paste one colour, get HEX, RGB, RGBA, HSL and CMYK, click lighter or darker shades, and see which one passes WCAG AA and AAA. Free, no signup.',
  },
  'pdf-powerpoint': {
    title: 'PDF to PowerPoint Converter, Free Online',
    description:
      'Turn every PDF page into a slide that looks exactly like the original. 16:9 or 4:3, up to 300 DPI, no sign-up, no watermark.',
  },
  'pdf-psd-eps-ps': {
    title: 'PDF to PSD, EPS or PS Converter Free',
    description:
      'Export any PDF page as a flat PSD, EPS or multi-page PS at 72 to 600 DPI, free, with no sign-up and no file size limit.',
  },
  'pdf-ebook': {
    title: 'PDF to EPUB Converter - Free, Text Preview',
    description:
      'Turn a PDF into a reflowable EPUB 3, Kindle HTML, FB2, Markdown or TXT eBook, and see the extracted text before you convert.',
  },
  'file-renamer': {
    title: 'Bulk Rename Files Online, Free',
    description:
      'Bulk rename files online: find and replace, kebab-case, prefix, suffix and 01/02 numbering with a live preview. Originals untouched, ZIP out.',
  },
  'website-jpg-screenshot': {
    title: 'Website Screenshot JPG: Free URL to JPG',
    description:
      'Capture any web page as a JPG at desktop, tablet or phone width, add a window frame and set quality before you download. Free, no signup.',
  },
  'json-formatter': {
    title: 'JSON Formatter: Validate, Minify, Sort',
    description:
      'Format, validate and minify JSON free. Errors name what was expected at a line and column, not a character offset.',
  },
  'website-png-screenshot': {
    title: 'Website Screenshot PNG – Free, Framed',
    description:
      'Capture any public URL as a lossless PNG at 1920x1080, 1366x768, 768x1024 or 390x844 with a clean window frame, or render HTML to a transparent PNG.',
  },
  'file-converter-hub': {
    title: 'Free Online File Converter for Any File',
    description:
      'Convert images, audio, video, Excel and PDFs on one page. No signup, no size cap, no watermark, files never stored.',
  },
  'spreadsheet-converter': {
    title: 'Spreadsheet Converter: XLSX, CSV, ODS, JSON',
    description:
      'Convert XLSX, XLS, CSV, TSV or ODS to CSV, JSON, HTML, XLSX or ODS. Pick the exact sheet, preview it, download free with no signup.',
  },
  'vector-converter': {
    title: 'SVG to PNG Converter – Free, 1x to 4x',
    description:
      'Convert SVG to PNG, JPG or WebP at 1x–4x with transparency kept, see the exact pixel size first, and pick the JPG background colour.',
  },
  'cad-converter': {
    title: 'DXF to SVG Converter, Free, Preview First',
    description:
      'Convert DXF to SVG, PNG, PDF or JSON free with no signup. See the drawing and its entity count before you convert, so nothing goes missing unnoticed.',
  },
  'font-converter': {
    title: 'WOFF to TTF Converter Free Online',
    description:
      'Unwrap a WOFF to the original TTF or OTF, or wrap a desktop font as WOFF, with every table intact. No account, no watermark, no daily cap.',
  },
  'presentation-converter': {
    title: 'PPTX to Markdown, HTML or Text Converter',
    description:
      'Turn a PowerPoint deck into a Markdown, HTML or text outline with titles, nested bullets and speaker notes kept together. Free, no sign-up.',
  },
  'extract-archive': {
    title: 'Unzip Files Online Straight Into a Folder',
    description:
      'Unzip files online free: see every file and size first, download one entry, or extract the whole ZIP into a folder with subfolders intact.',
  },
  'create-archive': {
    title: 'Create ZIP File Online Free, No Signup',
    description:
      'Bundle files or a whole folder into one ZIP with a 0-9 compression level and store-only mode. Free, no account, folder structure kept.',
  },
  'ebook-converter': {
    title: 'Markdown to EPUB Converter With Real Chapters',
    description:
      'Turn Markdown, TXT or HTML into an EPUB 3 whose headings become chapters, or extract any EPUB to one HTML page or plain text. Free, no signup.',
  },
  'audio-converter': {
    title: 'Online Audio Converter: MP3, WAV, FLAC, Opus',
    description:
      'Convert MP3, WAV, OGG, Opus, FLAC and M4A free with a bitrate you choose. No sign-up, no watermark, recordings never stored.',
  },
  'wav-compressor': {
    title: 'WAV Compressor - Shrink WAV, Keep It WAV',
    description:
      'Free WAV compressor that reduces WAV file size by sample rate, mono mix and bit depth, tells you the exact saving, and keeps the output a WAV.',
  },
};

/** Title and description for a tool, or null when it has none written yet. */
export const toolSeo = (slug) => TOOL_SEO[slug] || null;

export default TOOL_SEO;
