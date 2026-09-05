import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Crop,
  FileArchive,
  HelpCircle,
  Images,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF image extractor.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page H1, anchored TOC, H3
 * sections, benefit cards, FAQ, closing link block.
 *
 * The important thing for anyone editing this later is what the tool really
 * does, because the headline keyword and the actual behaviour do not line up
 * neatly and the copy has to bridge that gap honestly.
 *
 * The extractor walks every page of the PDF and produces one PNG per page at
 * twice the page's native point grid. It does NOT reach into the file and pull
 * out each embedded image object at whatever resolution it was originally
 * stored at. So the following high-volume phrases were deliberately NOT
 * promised anywhere in this article:
 *
 *   - "extract images from pdf at original quality / original DPI"
 *   - "extract only the photos, not the text"
 *   - "extract embedded JPEGs from a PDF"
 *   - "extract images from specific pages only"
 *   - "extract images from multiple PDFs at once"
 *   - any choice of output format other than PNG, or any DPI setting
 *
 * Section 3 exists precisely because "get one photo out of a PDF" is the
 * intent behind a large share of those searches. Rather than lie about it, the
 * section explains what the export contains and routes the reader to the image
 * cropper to isolate the picture they actually wanted. Answering the question
 * ranks better than faking the feature, and it does not generate complaints.
 *
 * Privacy is sold as an outcome only — files are not stored, not retained, not
 * used for training. How that is achieved is deliberately absent.
 */
export default function PdfExtractImagesSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Extract Images From a PDF</span>: The Complete Guide to Getting Pictures Out of a Document
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A PDF hands you a finished page and nothing else. The chart you need for
        a slide deck, the product shot buried on page nine, the diagram in an
        old manual, the signature block at the bottom of a contract &mdash;
        every one of them is in there, sealed inside a format designed for
        printing rather than for lifting things back out. This guide covers how
        to <strong>extract images from PDF</strong> pages as clean, sharp{' '}
        <strong>PNG files</strong>, exactly what the export contains, and how to
        isolate one picture once you have it. Free, no account, no watermark, no
        daily cap.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/extract-images-from-pdf.webp"
            alt="Extract images from PDF online free - a PDF document turning into a grid of downloadable high-resolution PNG page images"
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
            width="1200"
            height="675"
            onError={(e) => {
              e.currentTarget.closest('.not-prose').style.display = 'none';
            }}
          />
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>
              Every page of your PDF, rendered as a high-resolution PNG you can
              download one at a time or all at once as a ZIP.
            </span>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#what-you-get', '1. What You Actually Get From the Extractor'],
            ['#how-to', '2. How to Extract Images From a PDF Online Free'],
            ['#single-photo', '3. Getting One Photo Out of a Page'],
            ['#png-quality', '4. Resolution, PNG and Transparency'],
            ['#zip-download', '5. Downloading Every Image at Once'],
            ['#troubleshooting', '6. When Nothing Comes Out: Common Problems'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Image Extractor'],
            ['#faq', '8. Frequently Asked Questions (FAQ)'],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1 */}
      <section id="what-you-get" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Images className="w-6 h-6 text-orange-500 shrink-0" />
          1. What You Actually Get From the Extractor
        </h3>
        <p>
          Being precise about this first saves a wasted five minutes. The tool
          at the top of this page takes one PDF and gives you back{' '}
          <strong>one image per page</strong>, rendered at high resolution and
          saved as a PNG. A twenty-page report becomes twenty PNGs, each one the
          complete page as it appears on screen: photographs, charts, logos,
          rules and the text around them, all in a single picture.
        </p>
        <p>
          That is a different thing from dissecting the file object by object,
          and most people searching for how to{' '}
          <strong>get images out of a PDF</strong> actually want this behaviour
          without realising it. When you need a figure for a presentation or a
          diagram to drop into a document, a faithful full-page render is the
          fastest route there and it never comes back distorted, recoloured or
          stripped of the caption that explained it.
        </p>
        <p>Concretely, each extracted image carries:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A predictable filename.</strong> Every file is named for
            your document and its page, as <code>yourfile-page-3.png</code>, so
            a folder of them sorts sensibly instead of becoming image1, image2.
          </li>
          <li>
            <strong>Its pixel dimensions.</strong> The grid prints the exact
            width and height of every image before you download anything.
          </li>
          <li>
            <strong>A live thumbnail.</strong> You see each page as a preview
            card and pick the ones you want, rather than downloading a bundle
            blind.
          </li>
        </ul>
        <p>
          There is no page-range picker, no format dropdown and no quality
          slider. Every page is processed and the output is <strong>PNG</strong>,
          which keeps the result predictable.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Extract Images From a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          There is no sign-up, no email and no trial countdown. To{' '}
          <strong>extract images from a PDF online free</strong>, three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PDF', 'Drag a .pdf onto the panel above or click to browse for one. Anything that is not a PDF is refused straight away with a plain message rather than a silent failure.'],
            ['Watch it work through the pages', 'Extraction starts by itself — there is no second button to hunt for. A progress bar counts up as each page becomes an image.'],
            ['Download what you need', 'Every page appears as a preview card with its dimensions. Take one PNG at a time, or press Download All to get the whole set as a single ZIP.'],
          ].map(([title, body], i) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col"
            >
              <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                {i + 1}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          That is the entire process to <strong>save PDF pages as images</strong>.
          There is no queue, <strong>no watermark</strong> stamped across the
          corner of the result, and no counter ticking down toward a paywall. If
          you want to work on a different document afterwards, the{' '}
          <em>Change PDF</em> button clears everything and returns you to an
          empty panel.
        </p>
      </section>

      {/* 3 */}
      <section id="single-photo" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crop className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Get One Photo Out of a PDF Page
        </h3>
        <p>
          This is the question behind an enormous share of searches like{' '}
          <strong>extract pictures from PDF</strong> or &ldquo;how do I{' '}
          <strong>copy an image out of a PDF</strong>&rdquo;. You want the
          photograph on page four, not the paragraph above it.
        </p>
        <p>
          What you get is the whole of page four as a high-resolution PNG.
          Isolating the photograph from that is a thirty-second follow-up step,
          not a dead end:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Extract the pages here and download the single PNG containing the
            image you want.
          </li>
          <li>
            Open our{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              free image cropper
            </Link>{' '}
            and trim away everything around the picture.
          </li>
          <li>
            If the result needs to be a specific size for a slide, a listing or
            a print job, finish it in the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            .
          </li>
        </ol>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Why not just pull the embedded file out directly?
        </h4>
        <p>
          Because what is embedded is very often not what you think it is. One
          photograph on a printed page can be stored as several tiles stitched
          together, wrapped in a separate transparency mask, or colour managed
          in a space your editor will not open. A page render sidesteps all of
          that: what you see in the document is what lands in the PNG, correctly
          composed and in the right colours. For reusing a figure, that is the
          more useful result almost every time.
        </p>
        <p>
          If your goal is the opposite &mdash; you want the pages themselves as
          separate documents rather than as pictures &mdash; use the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF tool
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          instead, both of which keep everything as editable, selectable PDF.
        </p>
      </section>

      {/* 4 */}
      <section id="png-quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          4. Resolution, PNG and Transparency
        </h3>
        <p>
          A PDF measures itself in points, not pixels &mdash; the page has a
          physical size and no inherent resolution at all. Something has to
          decide how many pixels a page becomes, and this tool renders at double
          the page&rsquo;s native scale. A standard A4 or US Letter page comes
          out around 1,200 by 1,550 pixels or larger: comfortably sharp for
          slides, documents and screen reading, and fine for everyday print.
        </p>
        <p>
          You do not have to guess. The exact dimensions of every page are
          printed on its card before you download it, so you can check a figure
          is big enough for its destination in advance.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Why the output is PNG
        </h4>
        <p>
          PNG is a lossless raster format defined by the{' '}
          <a
            href="https://www.w3.org/TR/2003/REC-PNG-20031110/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>
          , and two of its properties matter here. It introduces no compression
          artefacts around text and line art &mdash; exactly what a document
          page is full of, and exactly what grows fuzzy halos in a heavily
          compressed photo format. And it carries a full alpha channel, so
          transparency in the original artwork survives rather than being
          flattened onto an unwanted white rectangle. That is why the tool{' '}
          <strong>extracts PDF pages as PNG</strong>.
        </p>
        <p>
          The trade is file size: a lossless page image is larger than a
          compressed one. If a folder of dozens gets unwieldy, run them through
          the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          afterwards, or convert them with the{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG, WebP, TIFF, BMP and GIF converter
          </Link>{' '}
          if you specifically need a different format. Where you want ordinary
          photographic page images rather than lossless ones, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          is the better starting point.
        </p>
      </section>

      {/* 5 */}
      <section id="zip-download" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileArchive className="w-6 h-6 text-orange-500 shrink-0" />
          5. Downloading Every Image at Once
        </h3>
        <p>
          Clicking through forty pages one at a time is nobody&rsquo;s idea of a
          good afternoon, so the results bar carries a{' '}
          <strong>Download All (ZIP)</strong> button. It gathers every extracted
          PNG into one archive named after your document, with the images
          tidied into a folder inside it so they do not spill everywhere when
          you unzip.
        </p>
        <p>
          The naming is the useful part. Because every file is{' '}
          <code>yourfile-page-1.png</code>, <code>yourfile-page-2.png</code> and
          so on, the archive opens in reading order without you renaming a
          thing &mdash; unlike the generic numbering most other online tools
          hand back when you <strong>convert PDF pages to images</strong> in
          bulk.
        </p>
        <p>
          You can mix the two freely: take the three pages you actually need as
          individual PNGs, and only reach for the ZIP if you want the lot.
        </p>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
          6. When Nothing Comes Out: Common Problems
        </h3>
        <p>
          Extraction is reliable, but a handful of situations trip people up.
          All of them are recognisable from the message you get.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /> &ldquo;Please select a valid .pdf file&rdquo;
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The tool takes PDFs and only PDFs. A .docx, a .pptx or an image
              file is turned away at the door.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /> &ldquo;Failed to extract images from PDF&rdquo;
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Usually a password-protected or damaged document. A file that
              demands a password cannot be read until it is removed, and a PDF
              truncated by a failed download has nothing complete to render.
            </p>
          </div>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          The scanned document question
        </h4>
        <p>
          If your PDF came from a scanner or a phone camera, every page is
          already a photograph and extraction works perfectly &mdash; it is how
          most people <strong>convert a scanned PDF to images</strong>. What you
          will not get is selectable text, because there was never any text
          there. If you need words rather than pictures, use our{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          instead, which reads the letters in the pixels and builds a real,
          searchable text layer.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Very long or very heavy documents
        </h4>
        <p>
          There is <strong>no file size limit</strong> and no page cap. A
          three-hundred page manual will genuinely take a while, and a laptop
          will get through it more calmly than a phone will, because rendering
          that many pages at high resolution is real work. If you only want a section, trim the
          document with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>{' '}
          or the splitter first and extract from the short version. If an
          extracted page came out smaller than you hoped for a print job, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          can scale it up.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Image Extractor
        </h3>
        <p>
          Plenty of sites will <strong>extract images from a PDF document</strong>.
          Most of them make the free version deliberately annoying until you
          reach for a card, or cap you at three files a day. This one is a{' '}
          <strong>free PDF image extractor</strong> with no paid tier behind it.
          Here is what is different, stated plainly enough that you can check
          every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email address, no credit card and no seven-day trial. The tool on this page is the whole product, every time you come back.'],
            ['No file size or page limit', 'Extract from a two-page invoice or a three-hundred page manual. There is no tier above this one waiting to be sold to you.'],
            ['No watermark on any image', 'Your PNGs come out clean. Nothing is stamped across the corner and no branding is baked into the page.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['Filenames that make sense', 'Every image is named for its source document and its page number, so a folder of them stays readable months later.'],
            ['An honest description of the result', 'We tell you exactly what the export contains before you spend time on it, instead of promising a feature and letting you discover the gap.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          It sits inside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document and image tools
          </Link>{' '}
          built on the same terms, so once the pictures are out you can crop,
          resize, compress or convert them without paying for any of it.
        </p>
      </section>

      {/* 8 */}
      <section id="faq" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          8. Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-6 mt-4">
          {[
            [
              'How do I extract images from a PDF for free without software?',
              'Open the tool at the top of this page and add your PDF. Every page becomes a downloadable PNG, with nothing to install, no account to create and no watermark. Take the images one by one from the preview grid or grab the whole set as a ZIP.',
            ],
            [
              'Can I extract just one picture instead of the whole page?',
              'The export gives you complete pages as PNG files, so the photograph you want arrives along with the rest of its page. Download that page, then use our free image cropper to trim away everything around the picture. It takes about thirty seconds and gives you the image correctly composed and in the right colours.',
            ],
            [
              'What quality are the extracted images?',
              'Each page is rendered at double its native scale, which puts a typical A4 or Letter page comfortably above 1,200 pixels wide. The exact width and height is shown on every card before you download, so you can confirm it is large enough for a slide or a print job.',
            ],
            [
              'Why did nothing come out of my PDF?',
              'Two likely causes. The file is password-protected, in which case the password has to be removed before anything can read it, or the document is damaged or incomplete from a failed download. In both cases the tool tells you rather than handing you an empty result.',
            ],
            [
              'Is there a limit on file size or number of pages?',
              'No. There is no size cap, no page cap and no daily limit on how many documents you run through it. Very long documents simply take longer, and a laptop will work through a large manual faster than a phone will.',
            ],
            [
              'Are my files safe when I extract images from a PDF?',
              'Your documents are never stored on our servers, never kept after your session and never used for training or analytics. No file is queued, logged or retained.',
            ],
          ].map(([q, a]) => (
            <div key={q}>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{q}</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">
          Need something else from the same document? The{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          gives you smaller photographic page images, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          shrinks the original file before you send it on, the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          joins several documents into one, and the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          finishes any picture you pull out of a page. If you would rather learn
          to work with images properly than fix them one at a time, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers raster formats, resolution and compression from the ground up.
        </p>
      </div>
    </article>
  );
}
