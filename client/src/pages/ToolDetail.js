import React, { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toolBySlug, toolsIn, CATEGORIES, COMPLEXITY, isImplemented } from '../data/tools';
import { toolSeo } from '../data/toolSeo';
import { toolFaqs } from '../data/toolFaqs';
import { toolArticle } from '../data/toolArticles';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import Seo from '../seo/Seo';
import { breadcrumbs, softwareApplication, faq } from '../seo/schema';
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

const TONE = {
  emerald: 'bg-emerald-500/12 text-emerald-700 ring-emerald-600/25',
  amber: 'bg-amber-500/12 text-amber-700 ring-amber-600/25',
  orange: 'bg-orange-500/12 text-orange-700 ring-orange-600/25',
  rose: 'bg-rose-500/12 text-rose-700 ring-rose-600/25',
  crimson: 'bg-red-600/12 text-red-800 ring-red-700/25',
};

export default function ToolDetail() {
  const { slug } = useParams();
  const introRef = useIntroTimeline();
  const tool = toolBySlug(slug);

  if (!tool) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No such tool</h1>
        <p className="mt-3 text-slate-600">That tool is not in the catalogue.</p>
        <Link to="/tools" className="mt-6 inline-block text-orange-600 font-semibold hover:underline">
          Back to all tools
        </Link>
      </main>
    );
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const meta = COMPLEXITY[tool.complexity];
  const related = toolsIn(tool.category).filter((x) => x.id !== tool.id).slice(0, 6);

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

  const renderToolComponent = () => {
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
      case 'pdf-txt-html-rtf-odt':
        return <PdfToHtml />;
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
        return <PdfToExcel />;
      case 'rotate-flip-image':
        return <ImageCropper />;

      default:
        break;
    }
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-slate-200">
        <span className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 text-2xl mx-auto">
          ⏳
        </span>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Tool in Active Development</h2>
        <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
          This tool is planned on our roadmap. When it ships it will be completely free with enterprise security,
          zero account requirements, and zero watermarks. Tell us if you need this tool prioritized.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition"
          >
            Request this tool
          </Link>
          <Link
            to="/tools"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
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
        noindex={!live}
        schema={[
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Free Tools', path: '/tools' },
            { name: tool.name, path: `/tools/${tool.slug}` },
          ]),
          // Only claim to be an application once the tool actually runs.
          ...(live ? [softwareApplication(tool, category.label)] : []),
          ...(faqs.length ? [faq(faqs)] : []),
        ]}
      />
      {/* Header Banner */}
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div ref={introRef} className="max-w-5xl mx-auto px-6 py-14 md:py-18">
            <Link to="/tools" data-intro className="text-sm text-slate-300 hover:text-white transition flex items-center gap-1">
              ← Back to all free tools
            </Link>
            <div data-intro className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 shadow-sm">
                FREE FOR EVERYONE
              </span>
              {live && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PRO UTILITY SUITE
                </span>
              )}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white">
                {category?.label || 'Utility'}
              </span>
              {!live && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${TONE[meta?.tone] || ''}`}
                >
                  {meta?.label} to build
                </span>
              )}
            </div>
            <h1 data-intro className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              {tool.name}
            </h1>
            <p data-intro className="mt-3 text-base md:text-lg max-w-2xl text-slate-300">
              {tool.description}
            </p>
          </div>
        </div>
      </header>

      {/* Main Tool Content */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        {renderToolComponent()}

        {/* The long-form guide, keyed by slug rather than mounted inside the
            tool. One component can serve several URLs and each URL needs its
            own guide, or they all carry the same text. */}
        {Article && (
          <Suspense fallback={null}>
            <Article />
          </Suspense>
        )}

        {/* Related Tools */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Related {category?.label || 'Pro'} Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/tools/${r.slug}`}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 hover:border-orange-400/40 transition block group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition">
                      {r.name}
                    </h3>
                    {isImplemented(r.slug) && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
