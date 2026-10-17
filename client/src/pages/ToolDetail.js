import React, { Suspense } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toolBySlug, toolsIn, CATEGORIES, COMPLEXITY, isImplemented, NEW_TOOLKIT_SLUGS } from '../data/tools';
import { toolSeo } from '../data/toolSeo';
import { toolFaqs } from '../data/toolFaqs';
import { toolArticle } from '../data/toolArticles';
import PageHero from '../components/PageHero';
import ToolDetailVisual from '../components/heroes/ToolDetailVisual';
import ToolCard from '../components/tools/ToolCard';
import PrivacyComparisonTable from '../components/tools/PrivacyComparisonTable';
import '../learn/ToolCard.css';
import Seo from '../seo/Seo';
import { breadcrumbs, softwareApplication, faq, howTo } from '../seo/schema';
import ToolkitRunner from '../components/tools/ToolkitRunner';
import PdfCompressor from '../components/tools/PdfCompressor';
import PdfMerger from '../components/tools/PdfMerger';
import PdfWord from '../components/tools/PdfWord';
import PdfSplitter from '../components/tools/PdfSplitter';
import PdfOcr from '../components/tools/PdfOcr';
import PdfToExcel from '../components/tools/PdfToExcel';
import PdfPageRemover from '../components/tools/PdfPageRemover';
import ExtractPages from '../components/tools/ExtractPages';
import PdfJpg from '../components/tools/PdfJpg';
import PdfOrganizer from '../components/tools/PdfOrganizer';
import PdfProtect from '../components/tools/PdfProtect';
import PdfUnlock from '../components/tools/PdfUnlock';
import PdfExtractImages from '../components/tools/PdfExtractImages';
import PdfRotate from '../components/tools/PdfRotate';
import PdfFlatten from '../components/tools/PdfFlatten';
import PdfFormBuilder from '../components/tools/PdfFormBuilder';
import PdfCrop from '../components/tools/PdfCrop';
import PdfResize from '../components/tools/PdfResize';
import PdfPngWebp from '../components/tools/PdfPngWebp';
import PngCompressor from '../components/tools/PngCompressor';
import QrGenerator from '../components/tools/QrGenerator';
import ImageResizer from '../components/tools/ImageResizer';
import ImageCropper from '../components/tools/ImageCropper';
import RotateFlipImage from '../components/tools/RotateFlipImage';
import ImageEnlarger from '../components/tools/ImageEnlarger';
import ColourPicker from '../components/tools/ColourPicker';
import SaveWebAsPdf from '../components/tools/SaveWebAsPdf';

// Newly Integrated Client-Side Tools
import Base64Tool from '../components/tools/Base64Tool';
import ColorUtilities from '../components/tools/ColorUtilities';
import CreateArchive from '../components/tools/CreateArchive';
import ExtractArchive from '../components/tools/ExtractArchive';
import JsonFormatter from '../components/tools/JsonFormatter';
import SpreadsheetConverter from '../components/tools/SpreadsheetConverter';
import ArchiveConverter from '../components/tools/ArchiveConverter';
import FileRenamer from '../components/tools/FileRenamer';
import GifCompressor from '../components/tools/GifCompressor';
import GifMaker from '../components/tools/GifMaker';
import WavCompressor from '../components/tools/WavCompressor';
import AudioConverter from '../components/tools/AudioConverter';
import Mp3Compressor from '../components/tools/Mp3Compressor';
import Mp3ToMp4 from '../components/tools/Mp3ToMp4';
import Mp4ToGif from '../components/tools/Mp4ToGif';
import Mp4ToMp3 from '../components/tools/Mp4ToMp3';
import VideoCompressor from '../components/tools/VideoCompressor';
import VideoConverter from '../components/tools/VideoConverter';
import EbookConverter from '../components/tools/EbookConverter';
import FontConverter from '../components/tools/FontConverter';
import PdfToHtml from '../components/tools/PdfToHtml';
import PresentationConverter from '../components/tools/PresentationConverter';
import VectorConverter from '../components/tools/VectorConverter';
import CadConverter from '../components/tools/CadConverter';
import PdfToEbook from '../components/tools/PdfToEbook';
import PdfToPptx from '../components/tools/PdfToPptx';
import PdfToPsdEpsPs from '../components/tools/PdfToPsdEpsPs';
import WebsiteScreenshotJpg from '../components/tools/WebsiteScreenshotJpg';
import WebsiteScreenshotPng from '../components/tools/WebsiteScreenshotPng';
import ConverterHub from '../components/tools/ConverterHub';

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

  if (!tool) {
    return (
      <main>
        <PageHero
          align="center"
          label="Free tools"
          lines={['No such', <em key="t">tool.</em>]}
          lede="That tool is not in the catalogue."
          actions={[{ to: '/tools', label: 'All free tools', primary: true }]}
        />
      </main>
    );
  }

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
        {renderToolComponent()}

        {/* High Information Gain Architecture & Privacy Comparison for AEO & GEO */}
        {live && <PrivacyComparisonTable toolName={tool.name} />}

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
