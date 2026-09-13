import { lazy } from 'react';

/**
 * The long-form guide under each tool, keyed by slug.
 *
 * Guides used to be mounted inside each tool component, which broke the moment
 * one component started serving several URLs: ConverterHub answers five slugs,
 * PdfToHtml two, and PdfProtect both /pdf-protect and /pdf-unlock. A guide
 * mounted in the component appears identically on every one of those pages —
 * duplicate content across distinct URLs, which is the one thing a search
 * engine reliably punishes. Keying by slug here means each URL gets its own
 * guide regardless of which component draws the tool.
 *
 * Lazy, because the guides are large — 25 of them is several megabytes of JSX
 * — and none of it is needed until the tool itself has rendered. The
 * prerenderer waits for the network to go idle before it snapshots, so the
 * chunk is in the static HTML regardless.
 *
 * To add a guide: write the component, add one line here. Nothing else.
 */
const ARTICLES = {
  'pdf-compressor': lazy(() => import('../components/tools/PdfCompressorSeoArticle')),
  'pdf-merger': lazy(() => import('../components/tools/PdfMergerSeoArticle')),
  'pdf-word': lazy(() => import('../components/tools/PdfWordSeoArticle')),
  'pdf-splitter': lazy(() => import('../components/tools/PdfSplitterSeoArticle')),
  'pdf-ocr': lazy(() => import('../components/tools/PdfOcrSeoArticle')),
  'pdf-excel': lazy(() => import('../components/tools/PdfToExcelSeoArticle')),
  'pdf-page-remover': lazy(() => import('../components/tools/PdfPageRemoverSeoArticle')),
  'extract-pages-from-pdf': lazy(() => import('../components/tools/ExtractPagesSeoArticle')),
  'pdf-jpg': lazy(() => import('../components/tools/PdfJpgSeoArticle')),
  'pdf-organizer': lazy(() => import('../components/tools/PdfOrganizerSeoArticle')),
  'pdf-protect': lazy(() => import('../components/tools/PdfProtectSeoArticle')),
  'pdf-unlock': lazy(() => import('../components/tools/PdfUnlockSeoArticle')),
  'extract-images-from-pdf': lazy(() => import('../components/tools/PdfExtractImagesSeoArticle')),
  'pdf-rotate': lazy(() => import('../components/tools/PdfRotateSeoArticle')),
  'pdf-flatten': lazy(() => import('../components/tools/PdfFlattenSeoArticle')),
  'make-pdf-fillable': lazy(() => import('../components/tools/PdfFormBuilderSeoArticle')),
  'pdf-crop': lazy(() => import('../components/tools/PdfCropSeoArticle')),
  'pdf-resize': lazy(() => import('../components/tools/PdfResizeSeoArticle')),
  'pdf-png-webp-tiff-bmp-gif': lazy(() => import('../components/tools/PdfPngWebpSeoArticle')),
  'png-compressor': lazy(() => import('../components/tools/PngCompressorSeoArticle')),
  'qr-generator': lazy(() => import('../components/tools/QrGeneratorSeoArticle')),
  'image-resizer': lazy(() => import('../components/tools/ImageResizerSeoArticle')),
  'image-cropper': lazy(() => import('../components/tools/ImageCropperSeoArticle')),
  'rotate-flip-image': lazy(() => import('../components/tools/RotateFlipImageSeoArticle')),
  'image-enlarger': lazy(() => import('../components/tools/ImageEnlargerSeoArticle')),
  'colour-picker': lazy(() => import('../components/tools/ColourPickerSeoArticle')),
  'save-web-as-pdf': lazy(() => import('../components/tools/SaveWebAsPdfSeoArticle')),
  'archive-converter': lazy(() => import('../components/tools/ArchiveConverterSeoArticle')),
  'audio-converter': lazy(() => import('../components/tools/AudioConverterSeoArticle')),
  'base64-encoder-decoder': lazy(() => import('../components/tools/Base64ToolSeoArticle')),
  'cad-converter': lazy(() => import('../components/tools/CadConverterSeoArticle')),
  'colour-format-utilities': lazy(() => import('../components/tools/ColorUtilitiesSeoArticle')),
  'create-archive': lazy(() => import('../components/tools/CreateArchiveSeoArticle')),
  'ebook-converter': lazy(() => import('../components/tools/EbookConverterSeoArticle')),
  'extract-archive': lazy(() => import('../components/tools/ExtractArchiveSeoArticle')),
  'file-converter-hub': lazy(() => import('../components/tools/FileConverterHubSeoArticle')),
  'file-renamer': lazy(() => import('../components/tools/FileRenamerSeoArticle')),
  'font-converter': lazy(() => import('../components/tools/FontConverterSeoArticle')),
  'gif-compressor': lazy(() => import('../components/tools/GifCompressorSeoArticle')),
  'gif-maker': lazy(() => import('../components/tools/GifMakerSeoArticle')),
  'image-compressor': lazy(() => import('../components/tools/ImageCompressorSeoArticle')),
  'image-converter': lazy(() => import('../components/tools/ImageConverterSeoArticle')),
  'jpeg-compressor': lazy(() => import('../components/tools/JpegCompressorSeoArticle')),
  'json-formatter': lazy(() => import('../components/tools/JsonFormatterSeoArticle')),
  'mp3-compressor': lazy(() => import('../components/tools/Mp3CompressorSeoArticle')),
  'mp3-mp4': lazy(() => import('../components/tools/Mp3ToMp4SeoArticle')),
  'mp4-gif': lazy(() => import('../components/tools/Mp4ToGifSeoArticle')),
  'mp4-mp3': lazy(() => import('../components/tools/Mp4ToMp3SeoArticle')),
  'pdf-ebook': lazy(() => import('../components/tools/PdfToEbookSeoArticle')),
  'pdf-html': lazy(() => import('../components/tools/PdfHtmlSeoArticle')),
  'pdf-txt-html-rtf-odt': lazy(() => import('../components/tools/PdfTxtHtmlRtfOdtSeoArticle')),
  'pdf-powerpoint': lazy(() => import('../components/tools/PdfToPptxSeoArticle')),
  'pdf-psd-eps-ps': lazy(() => import('../components/tools/PdfToPsdEpsPsSeoArticle')),
  'pdf-spreadsheet-suite': lazy(() => import('../components/tools/PdfSpreadsheetSuiteSeoArticle')),
  'presentation-converter': lazy(() => import('../components/tools/PresentationConverterSeoArticle')),
  'spreadsheet-converter': lazy(() => import('../components/tools/SpreadsheetConverterSeoArticle')),
  'vector-converter': lazy(() => import('../components/tools/VectorConverterSeoArticle')),
  'video-compressor': lazy(() => import('../components/tools/VideoCompressorSeoArticle')),
  'video-converter': lazy(() => import('../components/tools/VideoConverterSeoArticle')),
  'wav-compressor': lazy(() => import('../components/tools/WavCompressorSeoArticle')),
  'webp-png': lazy(() => import('../components/tools/WebpPngSeoArticle')),
  'website-jpg-screenshot': lazy(() => import('../components/tools/WebsiteScreenshotJpgSeoArticle')),
  'website-png-screenshot': lazy(() => import('../components/tools/WebsiteScreenshotPngSeoArticle')),
};

/** The guide component for a slug, or null when none has been written. */
export const toolArticle = (slug) => ARTICLES[slug] || null;

export default ARTICLES;
