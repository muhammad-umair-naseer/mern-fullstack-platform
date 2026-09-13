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
    title: 'Save a Webpage as PDF Free — Printable Copy',
    description:
      'Turn any webpage into a clean, printable PDF you can keep. Free web to PDF converter with no watermark and no sign-up.',
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
    title: 'Base64 Encoder Decoder – Free Online Tool',
    description:
      'Decode Base64 as you copied it, quotes, line breaks and data: prefixes included, or encode text and files to Base64 and data URIs for free.',
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
    title: 'Convert Multiple PDF to Excel, One Workbook',
    description:
      'Queue any number of PDFs and download one .xlsx with a worksheet per page, named by source file. Free, no signup, no watermark.',
  },
  'colour-format-utilities': {
    title: 'Color Code Converter: HEX, RGB, HSL, CMYK',
    description:
      'Convert one colour to HEX, RGB, HSL and CMYK, make tints and shades, and find the version that passes WCAG AA or AAA. Free, no signup.',
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
      'Rename a whole batch of files at once with live preview, kebab-case, numbering and duplicate-safe output in a ZIP. Originals untouched.',
  },
  'website-jpg-screenshot': {
    title: 'Website Screenshot JPG: Free Online Capture',
    description:
      'Capture any web page as a framed JPG at desktop, laptop, tablet or phone width, with the file size shown before you download.',
  },
  'json-formatter': {
    title: 'JSON Formatter: Validate, Minify, Sort',
    description:
      'Paste JSON and get a formatted result plus an error that names what was expected at a line and column. Free, no sign-up, nothing stored.',
  },
  'website-png-screenshot': {
    title: 'Website Screenshot PNG – Free, Framed',
    description:
      'Capture any URL as a lossless PNG at 1920x1080, 1366x768, 768x1024 or 390x844 with a clean window frame, or render HTML to a transparent 3x image.',
  },
  'file-converter-hub': {
    title: 'Free Online File Converter for Any File',
    description:
      'Convert images, audio, video, spreadsheets and PDFs on one page. No signup, no size cap, no watermark, and files are never stored.',
  },
  'spreadsheet-converter': {
    title: 'Spreadsheet Converter: XLSX, CSV, ODS, JSON',
    description:
      'Convert XLSX, XLS, CSV, TSV or ODS to CSV, JSON, HTML, XLSX or ODS and pick exactly which sheet you export. Free, no signup, no size cap.',
  },
  'vector-converter': {
    title: 'SVG to PNG Converter – Free, 1x to 4x',
    description:
      'Turn any SVG into a sharp PNG, JPG or WebP at the exact pixel size you see before you click. No signup, no watermark.',
  },
  'cad-converter': {
    title: 'DXF to SVG Converter, Free, No Signup',
    description:
      'Preview your DXF and count its entities before converting to SVG, PNG, PDF or JSON. Free, no account, files never stored.',
  },
  'font-converter': {
    title: 'WOFF to TTF Converter Free Online',
    description:
      'Unwrap a WOFF into the installable TTF or OTF it came from, or wrap a desktop font for the web. Free, no signup, no watermark.',
  },
  'presentation-converter': {
    title: 'PPTX to Markdown, HTML or Text Converter',
    description:
      'Pull every slide title, bullet and speaker note out of a PowerPoint deck as Markdown, HTML or plain text. Free, no sign-up, no watermark.',
  },
  'extract-archive': {
    title: 'Unzip Files Online Free, Straight Into a Folder',
    description:
      'See every file inside a ZIP before extracting, download just one, or extract all into a real folder with subfolders kept. Free, no signup.',
  },
  'create-archive': {
    title: 'Create ZIP File Online Free – Level 0 to 9',
    description:
      'Bundle files or a whole folder into one ZIP, keep sub-folders intact, and pick store-only for photos and video so it finishes fast.',
  },
  'ebook-converter': {
    title: 'Markdown to EPUB Converter Free Online',
    description:
      'Turn Markdown, TXT or HTML into an EPUB with real chapters and a working table of contents, or extract any EPUB to text or HTML.',
  },
  'audio-converter': {
    title: 'Online Audio Converter: MP3, WAV, FLAC, Opus',
    description:
      'Convert audio to MP3, WAV, OGG, Opus, FLAC or M4A free, with the bitrate you choose and no sign-up, watermark or limits. Files are never stored.',
  },
  'wav-compressor': {
    title: 'WAV Compressor – Reduce WAV File Size Free',
    description:
      'Shrink any WAV by exactly 50%, 75% or 87.5% and keep it a WAV. Free, no signup, no watermark, and you know the file size before you download.',
  },
};

/** Title and description for a tool, or null when it has none written yet. */
export const toolSeo = (slug) => TOOL_SEO[slug] || null;

export default TOOL_SEO;
