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

const t = (id, name, category, complexity, description, isLive = false) => ({
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
  t(23, 'PDF Unlock', 'pdf', 4, 'Remove restrictions from PDFs you are authorised to open.'),
  t(25, 'PDF Crop', 'pdf', 3, 'Trim unnecessary margins and areas from PDF pages.'),
  t(27, 'PDF Rotate', 'pdf', 1, 'Rotate pages by 90°, 180° or 270°.'),
  t(29, 'PDF Flatten', 'pdf', 4, 'Flatten forms, annotations and layers into fixed page content.'),
  t(31, 'PDF Resize', 'pdf', 3, 'Change the page size and layout of a PDF.'),
  t(33, 'Extract Images from PDF', 'pdf', 3, 'Pull embedded images out of a PDF as usable original files.'),
  t(35, 'PDF → PNG, WebP, TIFF, BMP, GIF', 'pdf', 4, 'Export PDF pages to a range of image formats.'),
  t(37, 'PDF → TXT, HTML, RTF, ODT', 'pdf', 4, 'Convert PDF content into text, document and web formats.'),
  t(52, 'PDF → PSD, EPS, PS', 'pdf', 5, 'Export PDF content to professional graphics and print formats.'),
  t(54, 'PDF → PowerPoint', 'pdf', 5, 'Convert PDF pages and content into an editable PPT or PPTX deck.'),
  t(56, 'PDF → eBook', 'pdf', 4, 'Convert a PDF into Kindle and other eBook formats such as AZW3 and MOBI.'),
  t(58, 'PDF → Spreadsheet Suite', 'pdf', 5, 'Extract tables and structured PDF data into spreadsheet formats.'),
  t(61, 'PDF → HTML', 'pdf', 4, 'Convert PDF content into a web-compatible HTML representation.'),

  // -------------------------------------------------------------- Image
  t(39, 'Image Compressor', 'image', 2, 'Reduce the file size of JPG, PNG and WebP images.'),
  t(41, 'Image Resizer', 'image', 2, 'Change the width, height and dimensions of an image.'),
  t(43, 'Image Cropper', 'image', 1, 'Crop an image down to the portion you actually want.'),
  t(45, 'Image Converter', 'image', 3, 'Convert between JPG, PNG, WebP, BMP, TIFF and more.'),
  t(47, 'JPEG Compressor', 'image', 2, 'Optimise and compress JPEG images specifically.'),
  t(49, 'PNG Compressor', 'image', 2, 'Shrink PNG files while keeping transparency intact.'),
  t(51, 'WebP ↔ PNG', 'image', 1, 'Convert between WebP and PNG in either direction.'),
  t(53, 'Image Enlarger', 'image', 4, 'Upscale a small or low-resolution image, optionally with AI enhancement.'),
  t(55, 'Rotate & Flip Image', 'image', 1, 'Rotate an image, or flip it horizontally or vertically.'),

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
  t(26, 'Archive Converter', 'convert', 4, 'Convert ZIP, TAR, 7Z and other archives between formats.'),
  t(28, 'Create Archive', 'convert', 2, 'Package files and folders into a ZIP, 7Z or TAR archive.'),
  t(30, 'Extract Archive', 'convert', 2, 'Pull files out of a ZIP, 7Z or TAR archive.'),
  t(32, 'eBook Converter', 'convert', 4, 'Convert between EPUB, MOBI, AZW3 and other eBook formats.'),
  t(34, 'Spreadsheet Converter', 'convert', 4, 'Convert between XLS, XLSX, CSV, ODS and similar formats.'),
  t(36, 'Presentation Converter', 'convert', 4, 'Convert between PPT, PPTX, ODP and other presentation formats.'),
  t(38, 'CAD Converter', 'convert', 5, 'Convert CAD drawings into supported CAD and vector formats.'),
  t(40, 'Vector Converter', 'convert', 4, 'Convert between SVG, EPS, AI and other vector formats.'),
  t(42, 'Font Converter', 'convert', 4, 'Convert between TTF, OTF, WOFF and WOFF2 font formats.'),
  t(62, 'File Converter Hub', 'convert', 4, 'One interface for converting across many supported document and media formats.'),

  // ---------------------------------------------------------------- Web
  t(22, 'Website PNG Screenshot', 'web', 4, 'Capture a full webpage from a URL as a PNG image.'),
  t(24, 'Website JPG Screenshot', 'web', 4, 'Generate a screenshot of any website in JPG format.'),
  t(60, 'Save Web as PDF', 'web', 4, 'Convert a webpage into a printable, downloadable PDF.'),

  // ---------------------------------------------------------- Utilities
  t(44, 'JSON Formatter', 'dev', 1, 'Turn messy or minified JSON into readable, properly indented output.'),
  t(46, 'Base64 Encoder & Decoder', 'dev', 1, 'Encode text and files to Base64, and decode Base64 back again.'),
  t(48, 'File Renamer', 'dev', 1, 'Bulk rename multiple files using rules and patterns.'),
  t(50, 'Colour & Format Utilities', 'dev', 1, 'Small everyday operations for common file and data transformations.'),
  t(57, 'Colour Picker', 'dev', 1, 'Pick an exact colour from an image or the screen and get its HEX and RGB values.'),
  t(59, 'QR Generator', 'dev', 1, 'Generate QR codes for a URL, text, Wi-Fi network or contact card.'),
];

/**
 * The tools that actually run.
 *
 * Every number and every sentence about the tools on this site is derived from
 * this, never typed out. The site is not deploying until all 62 are built, so
 * any hardcoded count would be wrong on one side of that date or the other —
 * "2 tools live" is wrong at launch, and "all tools are live" is wrong today.
 * Flipping an isLive flag above updates the hero stat, the About figure and the
 * footer line together, and none of them can drift from the catalogue.
 */
export const liveTools = () => TOOLS.filter((x) => x.isLive);
export const allToolsLive = () => TOOLS.every((x) => x.isLive);

/** The one sentence used wherever the tools are summarised. */
export const toolsBlurb = () => {
  const live = liveTools().length;
  if (live === TOOLS.length) return 'Every tool is free, and nothing you open leaves your device.';
  return `${live} of ${TOOLS.length} live, free to use.`;
};

export const toolBySlug = (slug) => TOOLS.find((x) => x.slug === slug);
export const toolsIn = (categoryId) => TOOLS.filter((x) => x.category === categoryId);
