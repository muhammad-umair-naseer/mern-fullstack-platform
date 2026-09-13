/**
 * Free tools catalogue.
 *
 * Design-stage data only — nothing here processes a file yet. Each entry drives
 * a card in /tools and a placeholder detail page. `complexity` is the 1-5 build
 * effort from the planning sheet, kept so the roadmap ordering stays visible.
 */

export const CATEGORIES = [
  { id: 'pdf', label: 'PDF', blurb: 'Merge, split, convert, secure and reshape PDF documents.' },
  { id: 'image', label: 'Image', blurb: 'Compress, resize, crop and convert images without losing control of quality.' },
  { id: 'video', label: 'Video & GIF', blurb: 'Compress, convert and turn video into shareable animation.' },
  { id: 'audio', label: 'Audio', blurb: 'Compress and convert between common audio formats.' },
  { id: 'convert', label: 'Converters', blurb: 'Move files between document, archive, font and vector formats.' },
  { id: 'web', label: 'Web', blurb: 'Capture and archive pages from a URL.' },
  { id: 'dev', label: 'Utilities', blurb: 'Small everyday helpers for developers and designers.' },
];

// 1 trivial … 5 substantial. Drives the badge colour and the roadmap order.
export const COMPLEXITY = {
  1: { label: 'Very easy', tone: 'emerald' },
  2: { label: 'Easy', tone: 'amber' },
  3: { label: 'Moderate', tone: 'orange' },
  4: { label: 'Involved', tone: 'rose' },
  5: { label: 'Advanced', tone: 'crimson' },
};

const t = (id, name, category, complexity, description, isLive = true) => ({
  id,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name,
  category,
  complexity,
  description,
  isLive,
});

export const TOOLS = [
  // ---------------------------------------------------------------- PDF
  t(1, 'PDF ↔ Word', 'pdf', 5, 'Convert a PDF into an editable DOC or DOCX, and turn Word files back into PDF.'),
  t(3, 'PDF Compressor', 'pdf', 3, 'Reduce PDF file size while preserving as much quality as possible.', true),
  t(5, 'PDF Merger', 'pdf', 2, 'Combine several PDF files into one document, in the order you choose.', true),
  t(7, 'PDF Splitter', 'pdf', 2, 'Divide a single PDF into multiple smaller documents.'),
  t(9, 'PDF OCR', 'pdf', 5, 'Extract selectable, searchable text from a scanned or image-based PDF.'),
  t(11, 'PDF → Excel', 'pdf', 5, 'Pull tables and structured data out of a PDF into a spreadsheet.'),
  t(13, 'PDF Page Remover', 'pdf', 2, 'Delete selected pages from a PDF.'),
  t(15, 'Extract Pages from PDF', 'pdf', 2, 'Save selected pages as a brand new PDF file.'),
  t(17, 'PDF ↔ JPG', 'pdf', 3, 'Turn PDF pages into JPG images, or build a PDF from a set of JPGs.'),
  t(19, 'PDF Organizer', 'pdf', 3, 'Reorder, duplicate and manage the pages inside a document.'),
  t(21, 'PDF Protect', 'pdf', 3, 'Lock a PDF with a password and encryption.'),
  t(23, 'PDF Unlock', 'pdf', 4, 'Remove the password and restrictions from a PDF you have the password for.'),
  t(25, 'PDF Crop', 'pdf', 3, 'Trim unnecessary margins and areas from PDF pages.'),
  t(27, 'PDF Rotate', 'pdf', 1, 'Rotate pages by 90°, 180° or 270°.'),
  t(29, 'PDF Flatten', 'pdf', 4, 'Flatten forms, annotations and layers into fixed page content.'),
  t(63, 'Make PDF Fillable', 'pdf', 3, 'Convert flat documents into editable, interactive fillable PDF forms.'),
  t(31, 'PDF Resize', 'pdf', 3, 'Change the page size and layout of a PDF.'),
  t(33, 'Extract Images from PDF', 'pdf', 3, 'Pull embedded images out of a PDF as usable original files.'),
  t(35, 'PDF → PNG, WebP, TIFF, BMP, GIF', 'pdf', 4, 'Export PDF pages to a range of image formats.'),
  t(37, 'PDF → TXT, HTML, RTF, ODT', 'pdf', 4, 'Extract PDF text and headings into a TXT, HTML, RTF or ODT document.'),
  t(52, 'PDF → PSD, EPS, PS', 'pdf', 5, 'Export PDF content to professional graphics and print formats.'),
  t(54, 'PDF → PowerPoint', 'pdf', 5, 'Turn every PDF page into a slide in a PowerPoint (PPTX) deck.'),
  t(56, 'PDF → eBook', 'pdf', 4, 'Convert a PDF into an EPUB, FB2, Markdown or HTML e-book, ready for Send to Kindle.'),
  t(58, 'PDF → Spreadsheet Suite', 'pdf', 5, 'Extract PDF tables into XLSX, XLS, ODS, CSV, TSV or an HTML table.'),
  t(61, 'PDF → HTML', 'pdf', 4, 'Convert PDF content into a web-compatible HTML representation.'),

  // -------------------------------------------------------------- Image
  t(39, 'Image Compressor', 'image', 2, 'Reduce the file size of JPG and WebP images with a quality slider.'),
  t(41, 'Image Resizer', 'image', 2, 'Change the width, height and dimensions of an image.'),
  t(43, 'Image Cropper', 'image', 1, 'Crop an image down to the portion you actually want.'),
  t(45, 'Image Converter', 'image', 3, 'Convert JPG, PNG, WebP, GIF, BMP and SVG images to PNG, JPG, WebP, GIF or PDF.'),
  t(47, 'JPEG Compressor', 'image', 2, 'Optimise and compress JPEG images specifically.'),
  t(49, 'PNG Compressor', 'image', 2, 'Shrink PNG files while keeping transparency intact.'),
  t(51, 'WebP ↔ PNG', 'image', 1, 'Convert between WebP and PNG in either direction.'),
  t(53, 'Image Enlarger', 'image', 4, 'Upscale a small or low-resolution image, optionally with AI enhancement.'),
  t(55, 'Rotate & Flip Image', 'image', 1, 'Rotate an image by 90° steps or any angle, or flip it horizontally or vertically.'),

  // ---------------------------------------------------------- Video & GIF
  t(2, 'Video Compressor', 'video', 4, 'Compress MP4, MOV and similar video into a smaller file size.'),
  t(10, 'MP4 → GIF', 'video', 4, 'Turn a selected portion of a video into an animated GIF.'),
  t(12, 'GIF Maker', 'video', 3, 'Create an animated GIF from images or video frames.'),
  t(14, 'GIF Compressor', 'video', 3, 'Reduce GIF file size while preserving the animation.'),
  t(20, 'Video Converter', 'video', 4, 'Convert between MP4, MOV, AVI, MKV, WebM and other formats.'),

  // -------------------------------------------------------------- Audio
  t(4, 'MP3 Compressor', 'audio', 3, 'Optimise MP3 bitrate and encoding to reduce file size.'),
  t(6, 'MP4 → MP3', 'audio', 3, 'Extract the audio track from a video and save it as MP3.'),
  t(8, 'MP3 → MP4', 'audio', 4, 'Turn audio into an MP4 video paired with an image or visual.'),
  t(16, 'WAV Compressor', 'audio', 3, 'Convert WAV audio into a smaller compressed format.'),
  t(18, 'Audio Converter', 'audio', 3, 'Convert between MP3, WAV, AAC, OGG, FLAC and others.'),

  // --------------------------------------------------------- Converters
  t(26, 'Archive Converter', 'convert', 4, 'Convert between ZIP, TAR and TAR.GZ archives.'),
  t(28, 'Create Archive', 'convert', 2, 'Package files and whole folders into a ZIP archive.'),
  t(30, 'Extract Archive', 'convert', 2, 'Pull files out of a ZIP, TAR or TAR.GZ archive.'),
  t(32, 'eBook Converter', 'convert', 4, 'Build an EPUB from text, Markdown or HTML, or unpack an EPUB to HTML or text.'),
  t(34, 'Spreadsheet Converter', 'convert', 4, 'Convert between XLS, XLSX, CSV, ODS and similar formats.'),
  t(36, 'Presentation Converter', 'convert', 4, 'Turn a PPTX deck into a structured HTML, Markdown or text outline.'),
  t(38, 'CAD Converter', 'convert', 5, 'Convert DXF drawings into SVG, PDF, PNG or a JSON entity list.'),
  t(40, 'Vector Converter', 'convert', 4, 'Export SVG to PNG, JPG or WebP at 1×–4×, resize an SVG, or wrap a bitmap as SVG.'),
  t(42, 'Font Converter', 'convert', 4, 'Convert between TTF, OTF and WOFF font formats.'),
  t(62, 'File Converter Hub', 'convert', 4, 'One interface for converting across many supported document and media formats.'),

  // ---------------------------------------------------------------- Web
  t(22, 'Website PNG Screenshot', 'web', 4, 'Capture a webpage from its URL as a PNG image at a chosen viewport size.'),
  t(24, 'Website JPG Screenshot', 'web', 4, 'Capture a webpage from its URL as a JPG image at a chosen viewport size.'),
  t(60, 'Save Web as PDF', 'web', 4, 'Turn a webpage into a text-searchable PDF from its URL, or typeset pasted text.'),

  // ---------------------------------------------------------- Utilities
  t(44, 'JSON Formatter', 'dev', 1, 'Turn messy or minified JSON into readable, properly indented output.'),
  t(46, 'Base64 Encoder & Decoder', 'dev', 1, 'Encode text and files to Base64, and decode Base64 back again.'),
  t(48, 'File Renamer', 'dev', 1, 'Bulk rename multiple files using rules and patterns.'),
  t(50, 'Colour & Format Utilities', 'dev', 1, 'Small everyday operations for common file and data transformations.'),
  t(57, 'Colour Picker', 'dev', 1, 'Pick an exact colour from an image or the screen and get its HEX and RGB values.'),
  t(59, 'QR Generator', 'dev', 1, 'Generate QR codes for a URL, text, Wi-Fi network or contact card.'),
];

/**
 * Two different questions, deliberately kept apart.
 *
 * `isLive` is editorial: does the site talk about this tool as part of what it
 * offers. It is true for all 62, because the site ships once they are all built
 * and the copy is written for that day.
 *
 * IMPLEMENTED is a fact about the code: is there a component behind this slug
 * that a visitor can actually use. Only two slugs qualify, and ToolDetail.js
 * proves it — it hardcodes one branch per implemented tool.
 *
 * Everything a search engine acts on keys off IMPLEMENTED, never off isLive.
 * Marking sixty pages indexable while they render nothing would put sixty thin
 * pages into the index, and that is slow and unpleasant to undo once crawled.
 * Site-wide copy keys off isLive. So the footer can say every tool is free
 * while /tools still shows sixty as unbuilt; the gap closes as each one ships.
 *
 * TO SHIP A TOOL: add its component, add a branch in ToolDetail.js, and add its
 * slug here. Nothing else needs touching — the sitemap and the noindex follow.
 */
export const IMPLEMENTED = new Set([
  'pdf-compressor',
  'pdf-merger',
  'pdf-word',
  'pdf-splitter',
  'pdf-ocr',
  'pdf-excel',
  'pdf-page-remover',
  'extract-pages-from-pdf',
  'pdf-jpg',
  'pdf-organizer',
  'pdf-protect',
  'pdf-unlock',
  'pdf-txt-html-rtf-odt',
  'pdf-crop',
  'pdf-rotate',
  'pdf-flatten',
  'make-pdf-fillable',
  'pdf-resize',
  'extract-images-from-pdf',
  'pdf-png-webp-tiff-bmp-gif',
  'pdf-psd-eps-ps',
  'pdf-powerpoint',
  'pdf-ebook',
  'pdf-spreadsheet-suite',
  'pdf-html',
  'image-compressor',
  'image-resizer',
  'image-cropper',
  'rotate-flip-image',
  'image-converter',
  'jpeg-compressor',
  'png-compressor',
  'webp-png',
  'image-enlarger',
  'video-compressor',
  'mp4-gif',
  'gif-maker',
  'gif-compressor',
  'video-converter',
  'mp3-compressor',
  'mp4-mp3',
  'mp3-mp4',
  'wav-compressor',
  'audio-converter',
  'archive-converter',
  'create-archive',
  'extract-archive',
  'ebook-converter',
  'spreadsheet-converter',
  'presentation-converter',
  'cad-converter',
  'vector-converter',
  'font-converter',
  'file-converter-hub',
  'website-png-screenshot',
  'website-jpg-screenshot',
  'save-web-as-pdf',
  'json-formatter',
  'base64-encoder-decoder',
  'file-renamer',
  'colour-format-utilities',
  'colour-picker',
  'qr-generator',
]);

/*
 * Every catalogue slug now has real code behind it. When a new tool is added
 * to the catalogue before its component exists, leave it out of the set above
 * until the component lands; the page then shows a coming-soon state and stays
 * out of the sitemap instead of promising a tool that is not there.
 */

/** Is there real code behind this slug, or only a catalogue entry? */
export const isImplemented = (slug) => IMPLEMENTED.has(slug);

/** The tools a visitor can actually open and use right now. */
export const implementedTools = () => TOOLS.filter((x) => IMPLEMENTED.has(x.slug));

/** The editorial view: what the site says it offers. */
export const liveTools = () => TOOLS.filter((x) => x.isLive);
export const allToolsLive = () => TOOLS.every((x) => x.isLive);

/** The one sentence used wherever the tools are summarised. */
export const toolsBlurb = () => {
  const live = liveTools().length;
  if (live === TOOLS.length) return 'Professional document & media processing suite with zero data retention.';
  return `${live} of ${TOOLS.length} live, free to use.`;
};

export const toolBySlug = (slug) => TOOLS.find((x) => x.slug === slug);
export const toolsIn = (categoryId) => TOOLS.filter((x) => x.category === categoryId);
