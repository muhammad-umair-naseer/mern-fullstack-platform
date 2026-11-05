import ToolSafetyBoundary from '../components/ToolSafetyBoundary.jsx';
import NotFound from '../../marketing/pages/NotFound.jsx';
import React, { Suspense, lazy } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toolBySlug, toolsIn, CATEGORIES, COMPLEXITY, isImplemented, NEW_TOOLKIT_SLUGS } from '../../../data/tools.js';
import { toolSeo } from '../../../data/toolSeo.js';
import { toolFaqs } from '../../../data/toolFaqs.js';
import { toolArticle } from '../../../data/toolArticles.jsx';
import PageHero from '../../../components/PageHero.jsx';
import ToolDetailVisual from '../../../components/heroes/ToolDetailVisual.jsx';
import ToolCard from '../components/ToolCard.jsx';
import PrivacyComparisonTable from '../components/PrivacyComparisonTable.jsx';
import '../../learning/components/ToolCard.css';
import Seo from '../../../seo/Seo.jsx';
import { breadcrumbs, softwareApplication, faq, howTo } from '../../../seo/schema.js';
const ToolkitRunner = lazy(() => import('../components/ToolkitRunner.jsx'));
const PdfCompressor = lazy(() => import('../components/PdfCompressor.jsx'));
const PdfMerger = lazy(() => import('../components/PdfMerger.jsx'));
const PdfWord = lazy(() => import('../components/PdfWord.jsx'));
const PdfSplitter = lazy(() => import('../components/PdfSplitter.jsx'));
const PdfOcr = lazy(() => import('../components/PdfOcr.jsx'));
const PdfToExcel = lazy(() => import('../components/PdfToExcel.jsx'));
const PdfPageRemover = lazy(() => import('../components/PdfPageRemover.jsx'));
const ExtractPages = lazy(() => import('../components/ExtractPages.jsx'));
const PdfJpg = lazy(() => import('../components/PdfJpg.jsx'));
const PdfOrganizer = lazy(() => import('../components/PdfOrganizer.jsx'));
const PdfProtect = lazy(() => import('../components/PdfProtect.jsx'));
const PdfUnlock = lazy(() => import('../components/PdfUnlock.jsx'));
const PdfExtractImages = lazy(() => import('../components/PdfExtractImages.jsx'));
const PdfRotate = lazy(() => import('../components/PdfRotate.jsx'));
const PdfFlatten = lazy(() => import('../components/PdfFlatten.jsx'));
const PdfFormBuilder = lazy(() => import('../components/PdfFormBuilder.jsx'));
const PdfCrop = lazy(() => import('../components/PdfCrop.jsx'));
const PdfResize = lazy(() => import('../components/PdfResize.jsx'));
const PdfPngWebp = lazy(() => import('../components/PdfPngWebp.jsx'));
const PngCompressor = lazy(() => import('../components/PngCompressor.jsx'));
const QrGenerator = lazy(() => import('../components/QrGenerator.jsx'));
const ImageResizer = lazy(() => import('../components/ImageResizer.jsx'));
const ImageCropper = lazy(() => import('../components/ImageCropper.jsx'));
const RotateFlipImage = lazy(() => import('../components/RotateFlipImage.jsx'));
const ImageEnlarger = lazy(() => import('../components/ImageEnlarger.jsx'));
const ColourPicker = lazy(() => import('../components/ColourPicker.jsx'));
const SaveWebAsPdf = lazy(() => import('../components/SaveWebAsPdf.jsx'));

// Newly Integrated Client-Side Tools
const Base64Tool = lazy(() => import('../components/Base64Tool.jsx'));
const ColorUtilities = lazy(() => import('../components/ColorUtilities.jsx'));
const CreateArchive = lazy(() => import('../components/CreateArchive.jsx'));
const ExtractArchive = lazy(() => import('../components/ExtractArchive.jsx'));
const JsonFormatter = lazy(() => import('../components/JsonFormatter.jsx'));
const SpreadsheetConverter = lazy(() => import('../components/SpreadsheetConverter.jsx'));
const ArchiveConverter = lazy(() => import('../components/ArchiveConverter.jsx'));
const FileRenamer = lazy(() => import('../components/FileRenamer.jsx'));
const GifCompressor = lazy(() => import('../components/GifCompressor.jsx'));
const GifMaker = lazy(() => import('../components/GifMaker.jsx'));
const WavCompressor = lazy(() => import('../components/WavCompressor.jsx'));
const AudioConverter = lazy(() => import('../components/AudioConverter.jsx'));
const Mp3Compressor = lazy(() => import('../components/Mp3Compressor.jsx'));
const Mp3ToMp4 = lazy(() => import('../components/Mp3ToMp4.jsx'));
const Mp4ToGif = lazy(() => import('../components/Mp4ToGif.jsx'));
const Mp4ToMp3 = lazy(() => import('../components/Mp4ToMp3.jsx'));
const VideoCompressor = lazy(() => import('../components/VideoCompressor.jsx'));
const VideoConverter = lazy(() => import('../components/VideoConverter.jsx'));
const EbookConverter = lazy(() => import('../components/EbookConverter.jsx'));
const FontConverter = lazy(() => import('../components/FontConverter.jsx'));
const PdfToHtml = lazy(() => import('../components/PdfToHtml.jsx'));
const PresentationConverter = lazy(() => import('../components/PresentationConverter.jsx'));
const VectorConverter = lazy(() => import('../components/VectorConverter.jsx'));
const CadConverter = lazy(() => import('../components/CadConverter.jsx'));
const PdfToEbook = lazy(() => import('../components/PdfToEbook.jsx'));
const PdfToPptx = lazy(() => import('../components/PdfToPptx.jsx'));
const PdfToPsdEpsPs = lazy(() => import('../components/PdfToPsdEpsPs.jsx'));
const WebsiteScreenshotJpg = lazy(() => import('../components/WebsiteScreenshotJpg.jsx'));
const WebsiteScreenshotPng = lazy(() => import('../components/WebsiteScreenshotPng.jsx'));
const ConverterHub = lazy(() => import('../components/ConverterHub.jsx'));

// The hero's one line under the headline. Most descriptions already fit in
// twelve words and are used as they are; these are the longer ones, cut down
// by hand so nothing they say is lost or overstated.
const SHORT_LEDE = {
  'pdf-word': 'Convert a PDF to editable Word, and Word back to PDF.',
  'pdf-jpg': 'Turn PDF pages into JPGs, or JPGs into a PDF.',
  'pdf-unlock': 'Unlock a PDF you already have the password for.',
  'pdf-txt-html-rtf-odt': 'Extract PDF text into TXT, HTML, RTF or ODT.',
  'pdf-ebook': 'Convert a PDF into an EPUB, FB2, Markdown or HTML e-book.',
  'pdf-spreadsheet-suite': 'Extract PDF tables into XLSX, XLS, ODS, CSV, TSV or HTML.',
  'image-compressor': 'Shrink JPG and WebP images with a quality slider.',
  'image-converter': 'Convert images to PNG, JPG, WebP, GIF or PDF.',
  'rotate-flip-image': 'Rotate an image by any angle, or flip it.',
  'ebook-converter': 'Build an EPUB from text, Markdown or HTML, or unpack one.',
  'vector-converter': 'Export SVG to PNG, JPG or WebP, or resize an SVG.',
  'website-png-screenshot': 'Capture a webpage as a PNG from its URL.',
  'website-jpg-screenshot': 'Capture a webpage as a JPG from its URL.',
  'save-web-as-pdf': 'Turn a webpage into a text-searchable PDF from its URL.',
  'colour-picker': 'Pick a colour from an image or screen, in HEX and RGB.',
  'pdf-bookmarks': 'View, edit or build the bookmarks outline of a PDF.',
  'heic-to-jpg': 'Convert iPhone HEIC/HEIF photos to JPG or PNG.',
  'm4a-to-mp3': 'Convert M4A audio and voice memos to WAV or AAC, with trimming.',
  'sql-csv': 'Turn CSV into SQL INSERT statements, or SQL dumps into CSV.',
  'archive-to-zip': 'Repack TAR, TAR.GZ, TGZ and GZ archives into ZIP files.',
  'jwt-decoder': 'Decode a JWT, check its expiry and verify its signature.',
};

const ledeFor = (tool) =>
  SHORT_LEDE[tool.slug] || (tool.description.split(/\s+/).length <= 12 ? tool.description : undefined);

// The tool's name as two headline lines, the second in italic. The break goes
// where the two halves are closest in length, with a pull towards a natural
// pause: after an arrow, "to", "as", "&" or "/".
function headline(name) {
  const w = name.split(/\s+/);
  if (w.length === 1) return [<em key="em">{name}</em>];
  let best = null;
  for (let k = 1; k < w.length; k += 1) {
    const a = w.slice(0, k).join(' ');
    const b = w.slice(k).join(' ');
    const score = Math.max(a.length, b.length) - (/^(→|↔|to|as|&|\/)$/i.test(w[k - 1]) ? 8 : 0);
    if (!best || score < best.score) best = { a, b, score };
  }
  return [best.a, <em key="em">{best.b}</em>];
}

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = toolBySlug(slug);

  if (!tool) return <NotFound />;

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const complexity = COMPLEXITY[tool.complexity];
  // The tool's neighbours in its category, wrapping round, rather than the
  // first six: with a fixed first six, every page linked to the same handful
  // and tools further down the list were never linked from anywhere. Taking
  // neighbours gives every tool inbound links from the six around it.
  const peers = toolsIn(tool.category);
  const at = peers.findIndex((x) => x.id === tool.id);
  const related = peers.length > 1
    ? [1, -1, 2, -2, 3, -3]
        .map((d) => peers[(at + d + peers.length) % peers.length])
        .filter((x, i, arr) => x.id !== tool.id && arr.findIndex((y) => y.id === x.id) === i)
        .slice(0, 6)
    : [];

  // Whether this page may be indexed, and whether it offers a working tool,
  // both depend on there being code behind the slug — not on the editorial
  // isLive flag, which is true for every tool in the catalogue.
  const live = isImplemented(tool.slug);
  const seo = toolSeo(tool.slug);
  // Only emit FAQPage markup where the guide is actually on the page. Google
  // treats structured data describing content a visitor cannot see as a
  // violation, and an unbuilt tool renders no guide.
  const faqs = live ? toolFaqs(tool.slug) : [];
  const Article = live ? toolArticle(tool.slug) : null;
  const lines = headline(tool.name);
  // A long line gets a smaller headline rather than a third line.
  const longest = Math.max(...lines.map((l) => (typeof l === 'string' ? l : l.props.children).length));

  const renderToolComponent = () => {
    if (NEW_TOOLKIT_SLUGS && NEW_TOOLKIT_SLUGS.has(tool.slug)) {
      return <ToolkitRunner slug={tool.slug} toolName={tool.name} />;
    }

    switch (tool.slug) {
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-word':
        return <PdfWord />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-ocr':
        return <PdfOcr />;
      case 'pdf-excel':
        return <PdfToExcel />;
      case 'pdf-page-remover':
        return <PdfPageRemover />;
      case 'extract-pages-from-pdf':
        return <ExtractPages />;
      case 'pdf-jpg':
        return <PdfJpg />;
      case 'pdf-organizer':
        return <PdfOrganizer />;
      case 'pdf-protect':
        return <PdfProtect />;
      case 'pdf-unlock':
        return <PdfUnlock />;
      case 'extract-images-from-pdf':
        return <PdfExtractImages />;
      case 'pdf-rotate':
        return <PdfRotate />;
      case 'pdf-flatten':
        return <PdfFlatten />;
      case 'make-pdf-fillable':
        return <PdfFormBuilder />;
      case 'pdf-crop':
        return <PdfCrop />;
      case 'pdf-resize':
        return <PdfResize />;
      case 'pdf-png-webp-tiff-bmp-gif':
        return <PdfPngWebp />;
      case 'png-compressor':
        return <PngCompressor />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'image-enlarger':
        return <ImageEnlarger />;
      case 'colour-picker':
        return <ColourPicker />;
      case 'save-web-as-pdf':
        return <SaveWebAsPdf />;

      // Suite 1: Utilities & Data
      case 'base64-encoder-decoder':
        return <Base64Tool />;
      case 'colour-format-utilities':
        return <ColorUtilities />;
      case 'create-archive':
        return <CreateArchive />;
      case 'extract-archive':
        return <ExtractArchive />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'spreadsheet-converter':
        return <SpreadsheetConverter />;

      // Suite 2: Archives, Renaming & Media
      case 'archive-converter':
        return <ArchiveConverter />;
      case 'file-renamer':
        return <FileRenamer />;
      case 'gif-compressor':
        return <GifCompressor />;
      case 'gif-maker':
        return <GifMaker />;
      case 'wav-compressor':
        return <WavCompressor />;

      // Suite 3: Audio & Video
      case 'audio-converter':
        return <AudioConverter />;
      case 'mp3-compressor':
        return <Mp3Compressor />;
      case 'mp3-mp4':
        return <Mp3ToMp4 />;
      case 'mp4-gif':
        return <Mp4ToGif />;
      case 'mp4-mp3':
        return <Mp4ToMp3 />;
      case 'video-compressor':
        return <VideoCompressor />;
      case 'video-converter':
        return <VideoConverter />;

      // Suite 4: Documents, Fonts & Presentations
      case 'ebook-converter':
        return <EbookConverter />;
      case 'font-converter':
        return <FontConverter />;
      case 'pdf-html':
        return <PdfToHtml />;
      case 'pdf-txt-html-rtf-odt':
        return <PdfToHtml formats={['txt', 'html', 'rtf', 'odt']} />;
      case 'presentation-converter':
        return <PresentationConverter />;
      case 'vector-converter':
        return <VectorConverter />;

      // Suite 5: CAD, Print Formats, Screenshots & Universal Hub
      case 'cad-converter':
        return <CadConverter />;
      case 'pdf-ebook':
        return <PdfToEbook />;
      case 'pdf-powerpoint':
        return <PdfToPptx />;
      case 'pdf-psd-eps-ps':
        return <PdfToPsdEpsPs />;
      case 'website-jpg-screenshot':
        return <WebsiteScreenshotJpg />;
      case 'website-png-screenshot':
        return <WebsiteScreenshotPng />;
      case 'file-converter-hub':
      case 'image-converter':
      case 'image-compressor':
      case 'jpeg-compressor':
      case 'webp-png':
        return <ConverterHub />;
      case 'pdf-spreadsheet-suite':
        return <PdfToExcel suite />;
      case 'rotate-flip-image':
        return <RotateFlipImage />;

      default:
        break;
    }
    return (
      <div className="lx-tool-soon">
        <span className="lx-label">Roadmap</span>
        <h2 className="lx-tool-soon-title">
          Coming <em>soon.</em>
        </h2>
        <p className="lx-tool-soon-lede">Free, no account and no watermark when it ships.</p>
        <div className="lx-tool-soon-actions">
          <Link to="/contact" className="btn lx-btn">
            Request this tool
            <span className="lx-btn-disc" aria-hidden="true">
              <ArrowUpRight size={15} />
            </span>
          </Link>
          <Link to="/tools" className="lx-link">
            Browse all tools
          </Link>
        </div>
      </div>
    );
  };

  return (
    <main className="text-slate-800 pb-20">
      <Seo
        // A written, keyword-first title where one exists. The generated
        // fallback produced sixty variations of "X — Free PDF Tool", which
        // spends the strongest signal on the page on the word "Tool".
        //
        // `bare` skips the site-wide " | Cortexis Solution Hub" suffix. At 24
        // characters it pushed these past the ~60 Google renders, and the half
        // that got truncated was the brand anyway. A short brand is appended
        // here instead, which keeps every one of these under 60.
        bare={Boolean(seo)}
        title={seo ? `${seo.title} | Cortexis` : `${tool.name} — Free ${category.label} Tool`}
        description={
          seo && live
            ? seo.description
            : live
              ? `${tool.description} Fast, secure, zero account required, and 100% watermark-free.`
              : `${tool.description} Planned as a free Cortexis tool, currently in development.`
        }
        path={`/tools/${tool.slug}`}
        // Each guided tool shares with its own card (the guide's banner as JPG,
        // made by make-og.mjs) instead of the generic site image.
        image={Article ? `/blog/og/${tool.slug}.jpg` : undefined}
        noindex={!live}
        schema={[
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Free Tools', path: '/tools' },
            { name: tool.name, path: `/tools/${tool.slug}` },
          ]),
          // Only claim to be an application once the tool actually runs.
          ...(live ? [softwareApplication(tool, category.label), howTo(tool)] : []),
          ...(faqs.length ? [faq(faqs)] : []),
        ]}
      />
      <div className={longest > 16 ? 'tdh tdh--long' : 'tdh'}>
        <PageHero
          back={{ to: '/tools', label: 'All free tools' }}
          label={category?.label || 'Utility'}
          lines={lines}
          lede={ledeFor(tool)}
          meta={!live && complexity ? [`${complexity.label} to build`] : undefined}
          actions={
            live
              ? [{ href: '#tool', label: 'Use the tool', primary: true }, ...(Article ? [{ href: '#guide', label: 'Read the guide' }] : [])]
              : [{ to: '/contact', label: 'Request this tool', primary: true }]
          }
          visual={<ToolDetailVisual tool={tool} count={peers.length} />}
        />
      </div>

      {/* Main Tool Content */}
      <section id="tool" className="lx-tool-ui max-w-5xl mx-auto px-6 relative z-10 scroll-mt-24">
        <ToolSafetyBoundary key={tool.slug} slug={tool.slug}><Suspense fallback={<p role="status">Loading tool...</p>}>{renderToolComponent()}</Suspense></ToolSafetyBoundary>

        {/* High Information Gain Architecture & Privacy Comparison for AEO & GEO */}
        {live && <PrivacyComparisonTable toolName={tool.name} slug={tool.slug} />}

        {/* The long-form guide, keyed by slug rather than mounted inside the
            tool. One component can serve several URLs and each URL needs its
            own guide, or they all carry the same text. */}
        {Article && (
          <div id="guide" className="scroll-mt-24">
            <Suspense fallback={null}>
              <Article />
            </Suspense>
          </div>
        )}

        {/* Related tools: the same compact rows as the catalogue. */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="lx-label">More {category?.label || ''} tools</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((r) => (
                <ToolCard key={r.id} tool={r} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
