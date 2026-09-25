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
    title: 'Add Watermark to PDF Free: Text or Logo, Tiled or Centred',
    description:
      'Add a text or logo watermark to any PDF free, with no sign-up. Set opacity, angle and pages, or tile it or place it behind text. Files are never stored.',
  },
  'pdf-page-numbers': {
    title: 'Add Page Numbers to PDF Free: Page X of Y, Roman, Bates',
    description:
      'Add page numbers to PDF files free: Page X of Y footers, skipped covers, roman numeral front matter and ABC-001 Bates labels. No sign-up, nothing stored.',
  },
  'pdf-esign': {
    title: 'Sign PDF Online Free: Draw, Type or Add Your Signature',
    description:
      'Sign a PDF online free: draw, type or add your signature, place it with the date and your name on any page, and download a clean copy. No account.',
  },
  'pdf-redact': {
    title: 'Redact PDF Online Free: Truly Remove Text, Then Verify',
    description:
      'Black out text in a PDF and delete it from the file, not just cover it. Find every match, check that the result is clean, and download. Free, no sign-up.',
  },
  'pdf-grayscale': {
    title: 'Convert PDF to Grayscale Free: Print-Ready Gray PDF',
    description:
      'Convert PDF to grayscale free, for every page or only the ones you pick. Text stays selectable and sharp, photos turn truly gray, and no watermark is.',
  },
  'pdf-compare': {
    title: 'Compare Two PDF Files Free: See Every Text Change',
    description:
      'Compare two PDF files free: see which pages changed, the exact words removed or added, author and date metadata, and download the diff as a patch.',
  },
  'pdf-bookmarks': {
    title: 'Add Bookmarks to PDF Free, with a Contents Page',
    description:
      'Add, edit and nest PDF bookmarks free. Paste a chapter list as Title | page, keep existing bookmarks, and add a table of contents page. No sign-up.',
  },
  'docx-to-pdf': {
    title: 'DOCX to PDF Converter: Free Word to PDF, No Sign-Up',
    description:
      'Convert DOCX to PDF free on A4, US Letter, Legal or A5 with your own margins. No account or watermark, and files are never stored on our servers.',
  },
  'xlsx-to-pdf': {
    title: 'Excel to PDF Free: Fit Every Column on the Page',
    description:
      'Convert Excel to PDF free with every column fitted to the page, the header row on each page, and your pick of sheets. No sign-up, no watermark.',
  },
  'image-to-pdf': {
    title: 'JPG to PDF: Combine Photos Into One Sharp PDF Free',
    description:
      'Turn JPG, PNG and WebP images into one PDF on A4 or Letter, with JPGs kept at full resolution. Free, no sign-up, no watermark, files never stored.',
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter: Free, Full Resolution, Batch ZIP',
    description:
      'Convert HEIC to JPG free: batch iPhone HEIC and HEIF photos to JPG, PNG or WebP at full resolution, download as one ZIP. No sign-up, no watermark.',
  },
  'avif-to-jpg': {
    title: 'AVIF to JPG Converter: Free, Batch, High Quality',
    description:
      'Convert AVIF to JPG, PNG or WebP free. Batch convert to one ZIP, pick quality from 40 to 100% and keep the original pixel size.',
  },
  'gif-to-mp4': {
    title: 'GIF to MP4 Converter: Free, No Watermark or Sign-Up',
    description:
      'Convert GIF to MP4 free, with no watermark or sign-up. Keep the original rhythm, loop short clips, and get a video Instagram, TikTok and WhatsApp accept.',
  },
  'webm-mp4': {
    title: 'WebM to MP4 Converter Free, Plus MP4 to WebM',
    description:
      'Convert WebM to MP4 free so it plays on iPhone, QuickTime and PowerPoint. Choose resolution, frame rate and quality, keep audio, no watermark.',
  },
  'ogg-to-mp3': {
    title: 'Opus to WAV & OGG to M4A Converter, Free Online',
    description:
      'Convert Opus, OGG, OGA and WebM voice notes to WAV or M4A that play anywhere. Trim, mono and normalise options. Free, and files are never stored.',
  },
  'm4a-to-mp3': {
    title: 'M4A to WAV Converter for Voice Memos and AAC, Free',
    description:
      'Convert M4A and AAC voice memos to WAV free. Trim dead air, downmix to mono, lift quiet recordings to -1 dB peak, and pick 16 or 24-bit output.',
  },
  'csv-json': {
    title: 'CSV to JSON Converter - Free, Two-Way, Nested JSON to CSV',
    description:
      'Convert CSV to JSON or JSON to CSV free. Keeps leading zeros, auto-detects semicolon and tab files, and flattens nested JSON into clean columns.',
  },
  'xml-json': {
    title: 'XML to JSON Converter, and JSON to XML, Free',
    description:
      'Convert XML to JSON and back for free. Attributes become @ keys, repeated tags become arrays, and leading zeros stay intact. Pretty-print or minify XML.',
  },
  'yaml-json': {
    title: 'YAML to JSON Converter: Free, Both Directions',
    description:
      'Convert YAML to JSON or JSON to YAML free. NO and yes stay strings, anchors expand, 2 or 4 space indent, and errors show the line to fix.',
  },
  'sql-csv': {
    title: 'CSV to SQL INSERT Converter, and SQL to CSV',
    description:
      'Turn CSV rows into INSERT statements for MySQL, PostgreSQL, SQLite or SQL Server, with CREATE TABLE, NULLs and apostrophes handled. Free, no sign-up.',
  },
  'markdown-converter': {
    title: 'Markdown to PDF & HTML Converter, Free with Live Preview',
    description:
      'Convert Markdown to PDF or HTML free. Live preview, A4 or US Letter, tables and task lists kept, plus a paste-ready HTML fragment for your blog.',
  },
  'archive-to-zip': {
    title: 'TAR.GZ to ZIP Converter: TGZ, TAR and GZ Free',
    description:
      'Convert TAR.GZ, TGZ, TAR and GZ to ZIP free. Preview contents first, merge several archives into one ZIP, no sign-up and no size cap.',
  },
  'timestamp-converter': {
    title: 'Unix Timestamp Converter: Epoch to Date and Back',
    description:
      'Convert Unix timestamps to dates and back. Auto-detects seconds, milliseconds, microseconds or nanoseconds and shows UTC, ISO 8601 and your time zone.',
  },
  'background-remover': {
    title: 'Remove White Background from Logo - Free Transparent PNG',
    description:
      'Remove the white background from a logo, signature or product photo, including inside letters. Fix halos and download a transparent PNG or WebP.',
  },
  'favicon-generator': {
    title: 'Favicon Generator: ICO, Apple Touch Icon and Manifest',
    description:
      'Turn one logo into favicon.ico, PNG icons, an apple-touch-icon and a web manifest in one ZIP, with the HTML head snippet ready to paste. Free, no sign-up.',
  },
  'exif-remover': {
    title: 'Remove EXIF Data from Photos Free, No Quality Loss',
    description:
      'Remove EXIF data and GPS location from JPG, PNG and WebP photos for free. See what each picture reveals first, then strip it with no loss in quality.',
  },
  'image-watermark': {
    title: 'Batch Watermark Photos Online Free: Text or Logo',
    description:
      'Stamp one text or logo watermark on every photo at once, corner or tiled diagonal, and download them all as a ZIP. Free, no sign-up, no added branding.',
  },
  'image-blur': {
    title: 'Blur Part of an Image Online Free: Faces, Plates, Text',
    description:
      'Blur, pixelate or black out faces, number plates, card numbers and chat names in any photo. Free, no sign-up, no watermark, and files are never stored.',
  },
  'image-ocr': {
    title: 'Image to Text (OCR): Extract Text from a Photo Free',
    description:
      'Turn a photo or screenshot into text. Enlarge, sharpen and invert faint or dark-mode images so OCR reads them. Free, no sign-up, files never stored.',
  },
  'svg-optimizer': {
    title: 'SVG Optimizer: Minify and Clean SVG Code Free',
    description:
      'Free SVG optimizer that strips Inkscape, Illustrator and Figma bloat, rounds long decimals and shows a before/after preview so nothing breaks.',
  },
  'meme-generator': {
    title: 'Meme Generator: Free Top and Bottom Text, No Watermark',
    description:
      'Free meme generator for your own pictures: classic Impact top and bottom text or white caption bars, live preview, JPG or PNG download.',
  },
  'jwt-decoder': {
    title: 'JWT Decoder: Decode, Check Expiry and Verify Signatures',
    description:
      'Free JWT decoder: paste a token to read its header and payload, see exp as a UTC date, and verify HS256, RS256 or ES256 signatures. No sign-up.',
  },
  'hash-generator': {
    title: 'Hash Generator: MD5, SHA-256, CRC32 and HMAC Free',
    description:
      'Get MD5, SHA-1, SHA-256, SHA-512 and CRC32 of any text or file at once, and paste a checksum to see which one matches. Free, no sign-up.',
  },
  'uuid-generator': {
    title: 'UUID Generator: Free v4, v7, ULID and Secret Keys',
    description:
      'Generate UUID v4, v7 and ULIDs in bulk, plus 256-bit JWT secrets, API keys and passwords. Free, no sign-up, and nothing you generate is ever stored.',
  },
  'sql-formatter': {
    title: 'SQL Formatter Online Free: Beautify and Minify SQL',
    description:
      'Paste a messy query or drop a .sql file and get clean, indented SQL. Pick uppercase or lowercase keywords and your indent, or minify it to one line.',
  },
  'css-generator': {
    title: 'CSS Generator: Box Shadow, Glass, Gradient & Radius',
    description:
      'Free CSS generator for layered box shadows, glassmorphism, gradients, blob border radius and text shadows. Live preview, then copy or download the CSS.',
  },
  'regex-tester': {
    title: 'Regex Tester: Test and Explain Regular Expressions Free',
    description:
      'Test regex free with live match highlighting, capture group tables, a replace preview and plain-English explanations of every token in your pattern.',
  },
  'diff-checker': {
    title: 'Diff Checker: Compare Two Texts or Code Free',
    description:
      'Compare two texts or code files and see changed words or characters highlighted as you type. Ignore whitespace or case, then download a .patch file.',
  },
  'url-encoder': {
    title: 'URL Encoder Decoder: Encode, Decode and Parse URLs Free',
    description:
      'Free URL encoder decoder: percent-encode or decode text, fix + vs %20, URI malformed and %2520 errors, and read every query parameter at a glance.',
  },
  'word-counter': {
    title: 'Word Counter: Free Word and Character Count Tool',
    description:
      'Count words, characters, sentences and paragraphs as you type, with reading time, speaking time and keyword density. Free, and no sign-up needed.',
  },
  'case-converter': {
    title: 'Case Converter: Upper, Lower, Title Case and camelCase',
    description:
      'Free case converter with 18 options: uppercase, lowercase, title and sentence case, camelCase, snake_case, kebab-case and URL slugs. Updates as you type.',
  },
  'line-tools': {
    title: 'Remove Duplicate Lines and Sort Text Online, Free',
    description:
      'Remove duplicate lines, sort lists A to Z or naturally, count repeats, shuffle and number lines. Paste or drop a file; free, no sign-up, nothing stored.',
  },
  'video-trimmer': {
    title: 'Trim Video Online Free: Frame-Accurate MP4 Cutter',
    description:
      'Trim video online free and cut MP4 or WebM clips on the exact frame. No watermark, no sign-up, and your files are never stored on our servers.',
  },
  'audio-trimmer': {
    title: 'Audio Trimmer: Free Ringtone Maker with Fade In and Out',
    description:
      'Cut any song or recording to the part you want, add a fade in and out, and export an M4A ringtone for iPhone or Android, or lossless WAV. Free.',
  },
  'video-muter': {
    title: 'Remove Audio from Video Online Free, No Quality Loss',
    description:
      'Remove audio from MP4, MOV or WebM videos in one click. MP4 and MOV keep every frame untouched, with no watermark, no sign-up and nothing stored.',
  },
  'video-speed': {
    title: 'Change Video Speed Online Free: 0.25x to 4x, Same Pitch',
    description:
      'Speed up or slow down any video from 0.25x to 4x and download MP4 or WebM. Voices keep their natural pitch, sound stays in sync, and there is no watermark.',
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
