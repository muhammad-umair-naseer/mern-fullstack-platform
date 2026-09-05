import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileArchive,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Palette,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to PNG / WebP / TIFF / BMP / GIF tool.
 *
 * Same skeleton as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with an icon each, benefit grid, FAQ, closing links.
 *
 * Three decisions shaped the copy, and they matter if anyone edits this later.
 *
 * First, the primary keyword is the generic "convert pdf to image" rather than
 * "pdf to png" alone. The tool ships six output formats and the JPG-specific
 * intent already has a home at /tools/pdf-jpg, so this page is aimed at the
 * generic query plus the four formats nobody else bothers to cover properly
 * (WebP, TIFF, BMP, GIF). Those are low-competition and genuinely under-served.
 *
 * Second, several fat keywords describe things this tool does not do, and none
 * of them are promised anywhere in the copy:
 *   - "pdf to animated gif" / "pdf to gif animation": the export is one still
 *     image per page. Section 3 says so outright instead of implying otherwise.
 *   - "pdf to svg" / "pdf to vector": every output format here is a pixel
 *     format. Section 1 explains the trade rather than dodging it.
 *   - "convert pdf to png 600 dpi" / custom DPI: there is no resolution box.
 *     Section 4 tells the reader the dimensions they will actually get and
 *     points at the image tools for resizing afterwards.
 *   - "batch convert multiple pdfs": one PDF at a time. Section 5 is explicit,
 *     and reframes the query around the ZIP of every page, which is the thing
 *     the tool genuinely does well.
 *   - "image to pdf" / "png to pdf": the reverse direction does not exist here.
 * Answering those honestly ranks better than promising them and generates no
 * complaint mail.
 *
 * Third, privacy is sold strictly as an outcome — nothing stored, nothing
 * retained, nothing used for training. How that is achieved is deliberately
 * absent from every line of this file.
 */
export default function PdfPngWebpSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Convert PDF to Image</span>: PNG, WebP, JPEG, TIFF, BMP and GIF From Every Page
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Sooner or later a PDF has to stop being a PDF. A slide deck wants a
        picture, not an attachment. A website wants something that loads. A print
        shop asks for TIFF and an old piece of in-house software will only open
        BMP. The tool above will <strong>convert PDF to image</strong> files in
        six formats &mdash; you can <strong>convert PDF to PNG</strong> for crisp
        text, <strong>PDF to WebP</strong> for a fast-loading page, or export
        JPEG, TIFF, BMP and GIF from the same document without paying, signing up
        or watching a watermark land on your work.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/pdf-png-webp-tiff-bmp-gif.webp"
            alt="Convert PDF to image online free - exporting PDF pages to PNG, WebP, JPEG, TIFF, BMP and GIF image files"
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
              Every page of a PDF, exported as a separate image file in the
              format your next tool actually accepts.
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
            ['#what-happens', '1. What Happens When You Convert PDF to Image'],
            ['#how-to-convert', '2. How to Convert PDF to PNG Online Free'],
            ['#choose-format', '3. PNG, WebP, JPEG, TIFF, BMP or GIF?'],
            ['#resolution', '4. Resolution, Size and Image Quality'],
            ['#every-page', '5. Exporting Every Page at Once'],
            ['#troubleshooting', '6. When It Does Not Work: Honest Limits'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF to Image Converter'],
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
      <section id="what-happens" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Happens When You Convert PDF to Image
        </h3>
        <p>
          A PDF page is a set of instructions: put this glyph here, stroke this
          line there, place this photograph in that rectangle. An image file is
          the opposite &mdash; a fixed grid of coloured pixels with no memory of
          how it was built. When you <strong>convert PDF pages to images</strong>,
          the page is drawn out exactly as it would appear on screen and then
          frozen at that size. That is all any <strong>PDF to image converter</strong>{' '}
          is really doing.
        </p>
        <p>Three consequences follow, and all three are usually what you wanted:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>One image per page.</strong> A fourteen-page document becomes
            fourteen separate files, each numbered so the order never gets lost.
          </li>
          <li>
            <strong>The page is flattened.</strong> Text, diagrams, tables,
            stamps, form fields and photographs merge into one picture. Nothing
            shifts, no font substitutes itself, and the layout you see is the
            layout everyone else sees.
          </li>
          <li>
            <strong>The text stops being text.</strong> You cannot select, search
            or edit words in the result. That is the whole point of an image, but
            it does mean this is the wrong tool if you wanted the words back.
          </li>
        </ul>
        <p>
          If it is the writing you are after rather than the picture, the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          builds a searchable text layer and the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          rebuilds it as editable paragraphs. And if you specifically want the
          photographs that were placed inside the file rather than a rendering of
          the whole page, the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF tool
          </Link>{' '}
          pulls those out on their own.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to PNG Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial counter. To{' '}
          <strong>convert PDF to PNG online free</strong> &mdash; or to any of the
          other five formats &mdash; there are three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PDF', 'Drag a .pdf onto the panel above or click to browse. Anything that is not a PDF is turned away straight off with a plain message rather than a silent failure.'],
            ['Pick the output format', 'Choose PNG, WebP, JPEG, TIFF, BMP or GIF from the format row. Every page thumbnail appears with its exact pixel dimensions, so you know what you are getting before you download anything.'],
            ['Download one page or all of them', 'Each thumbnail has its own download button for a single page, or take the whole document as one ZIP archive with every page inside, correctly numbered.'],
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
          You can switch format after the pages are ready without starting
          again, and downloads are named after your original document &mdash;{' '}
          <em>quarterly-report.pdf</em> gives you{' '}
          <em>quarterly-report-page-3.png</em>, not a folder of numbers to rename
          by hand.
        </p>
      </section>

      {/* 3 */}
      <section id="choose-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          3. PNG, WebP, JPEG, TIFF, BMP or GIF: Which Format Should You Pick?
        </h3>
        <p>
          Most converters give you one format and let you work out the
          consequences later. Six is more useful, but only if you know which one
          to reach for &mdash; whether you came here for <strong>PDF to WebP</strong>,{' '}
          <strong>PDF to TIFF</strong> for a print job, or <strong>PDF to BMP</strong>{' '}
          for a piece of software that has not been updated since 2004. Here is
          the short version.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['PNG — the safe default', 'Lossless, sharp-edged and the right choice for pages made of text, tables, line art or logos. Nothing is thrown away and transparency is preserved. Pick this unless you have a reason not to.'],
            ['WebP — the small one', 'Noticeably lighter than PNG at similar visual quality, which is why it is the sensible pick for anything that has to load on a web page. Every current mainstream viewer opens it, though software from a decade ago may not.'],
            ['JPEG — for photographic pages', 'Ideal when the page is a photograph or a scanned magazine spread. Less ideal for crisp black text, where compression can leave a faint fuzz around letter edges.'],
            ['TIFF — the print and archive format', 'Uncompressed and faithful, which is what print shops, publishers and document archives ask for. The trade is size: TIFF files are large by design.'],
            ['BMP — for legacy software', 'A plain uncompressed bitmap. Nobody picks BMP for fun, but older desktop applications and internal tools sometimes accept nothing else.'],
            ['GIF — indexed and lightweight', 'A small indexed still image, useful for simple graphics and workflows that expect a .gif. To be clear: one still frame per page, never an animation.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-500 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          A word on transparency
        </h4>
        <p>
          People searching for{' '}
          <strong>PDF to PNG with transparent background</strong> usually want a
          logo or diagram on a coloured slide without a white box around it. PNG
          and WebP both carry an alpha channel, so transparent regions survive the
          export. If the page has solid white painted into it &mdash; most do
          &mdash; that white is part of the page and comes through as white. The{' '}
          <a
            href="https://www.w3.org/TR/PNG/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>{' '}
          is the reference if you want the detail on how alpha is stored.
        </p>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          These are all pixel formats
        </h4>
        <p>
          One honest note for anyone who arrived searching for{' '}
          <strong>PDF to vector</strong> or PDF to SVG: all six outputs here are
          pixel formats. A vector conversion is a different job with a different
          set of compromises, and pretending otherwise would only waste your
          afternoon. If your PDF is line art that must scale infinitely, an image
          export is not the right ending for it.
        </p>
      </section>

      {/* 4 */}
      <section id="resolution" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Maximize2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Resolution, Size and Image Quality
        </h3>
        <p>
          The usual complaint about free converters is a blurry result: you
          paste the image into a slide, zoom in, and the text has gone soft.
        </p>
        <p>
          Here, pages are prepared above their nominal size, so a standard A4 or
          Letter page comes out at well over a thousand pixels across &mdash;
          comfortably sharp for slides, previews and most web use. You need not
          guess, either: every thumbnail shows its exact width and height in
          pixels before you download, so a{' '}
          <strong>high resolution PDF to PNG</strong> export is something you can
          verify rather than hope for. A poster-sized page produces a
          proportionally larger image, because the page itself is bigger.
        </p>
        <p>
          There is no DPI box to fiddle with, which is deliberate. When you need
          a specific pixel size, do it as a second step:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            To scale exports down to a fixed width, use the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            .
          </li>
          <li>
            To go bigger without the mush, the{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>{' '}
            handles upscaling.
          </li>
          <li>
            To keep one figure and bin the margins, the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>{' '}
            trims to the part you actually need.
          </li>
          <li>
            To make a PNG lighter before it goes on a website, the{' '}
            <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PNG compressor
            </Link>{' '}
            cuts the weight without touching the dimensions.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="every-page" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileArchive className="w-6 h-6 text-orange-500 shrink-0" />
          5. Exporting Every Page at Once
        </h3>
        <p>
          Converting a forty-page document one page at a time is nobody&rsquo;s
          idea of an afternoon, which is why people search for a way to{' '}
          <strong>batch convert PDF pages to images</strong> in the first place.
          Every page of your PDF is prepared in one pass and shown as a thumbnail
          grid, and the{' '}
          <strong>convert all PDF pages to images</strong> job finishes with a
          single ZIP download containing the lot, each file named after the
          original document and numbered in page order inside a folder named for
          the format you chose.
        </p>
        <p>
          Two practical notes. This handles one PDF per run &mdash; five files
          means five conversions. And TIFF and BMP are uncompressed, so a long
          document in either produces a genuinely large archive; for a
          hundred-page manual, PNG or WebP is kinder to your disk.
        </p>
        <p>
          If you only want a handful of pages, trim the document first rather than
          exporting everything and deleting the rest. The{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages tool
          </Link>{' '}
          pulls out a range, the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          breaks a long file into parts, and either result can be brought straight
          back here for a much shorter export.
        </p>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. When It Does Not Work: The Honest Limits
        </h3>
        <p>
          Four things account for nearly every failed attempt to{' '}
          <strong>save a PDF page as an image</strong>, and none of them need a
          support ticket.
        </p>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          &ldquo;Please select a valid .pdf file&rdquo;
        </h4>
        <p>
          The input is a PDF and only a PDF. A .docx, a .pptx or an image
          dropped on the panel is refused immediately rather than half-processed
          into something broken. It is a one-way street, too: this exports PDF
          pages as images and does not turn images back into a PDF.
        </p>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          A file that will not open at all
        </h4>
        <p>
          A password-protected or structurally damaged PDF cannot be read, and you
          will be told so plainly instead of being left staring at a spinner. Open
          it with its password and re-save an unlocked copy, then convert that.
        </p>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          A very long document takes a while
        </h4>
        <p>
          Every page is prepared, so a three-hundred-page report is real work
          and takes real time. A progress readout shows how far along it is, and
          splitting the file first is usually faster than waiting.
        </p>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Things this tool deliberately does not claim
        </h4>
        <p>
          It will not produce an animated GIF, it will not output SVG or any other
          vector format, and it does not offer a custom DPI field or a page-range
          picker &mdash; every page of the document you give it is exported. Being
          told that now is more useful than discovering it after a download.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF to Image Converter
        </h3>
        <p>
          Plenty of sites will <strong>convert PDF to image</strong> files. Most
          make it deliberately annoying until you pay. Here is the difference,
          stated plainly enough that you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Six formats, not one', 'PNG, WebP, JPEG, TIFF, BMP and GIF from the same document, switchable after the pages are ready without starting the job again.'],
            ['Genuinely free, with no trial', 'No account, no email address, no card and no seven-day countdown. What you are using is the whole product.'],
            ['No watermark on any export', 'Your images come out clean. Nothing is stamped across the corner and nothing is added to the edge.'],
            ['Every page in one ZIP', 'Take a single page or the entire document as one archive, numbered in order and named after your original file.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['Dimensions shown up front', 'Each page displays its exact pixel size before you download, so quality is something you confirm rather than gamble on.'],
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
            free document tools
          </Link>{' '}
          built on the same terms, so the same document can be{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merged
          </Link>
          ,{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            rotated
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            cropped
          </Link>{' '}
          before you export it, without any of it costing anything.
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
              'How do I convert a PDF to an image for free without signing up?',
              'Add your PDF to the tool at the top of this page, choose PNG, WebP, JPEG, TIFF, BMP or GIF, then download a single page or the whole document as a ZIP. There is no account step, no email verification and no watermark. It is free every time, not free for the first three files.',
            ],
            [
              'Which format should I use to convert PDF to image?',
              'PNG for text, tables and line art, because it is lossless and stays sharp. WebP when file size matters on a web page. JPEG for photographic pages. TIFF when a printer or archive asks for it. BMP for older software that accepts nothing else.',
            ],
            [
              'Can I convert every page of a PDF to images at once?',
              'Yes. All pages are prepared together and shown as thumbnails, and one button downloads the entire set as a ZIP archive with each file numbered in page order. One PDF is handled per run, so multiple documents mean multiple runs.',
            ],
            [
              'Why does my converted image look blurry when I zoom in?',
              'Usually because it was stretched past its natural size. Pages here are prepared above nominal size and each thumbnail shows its exact pixel dimensions before download. If you need it larger, run the export through the image enlarger rather than dragging a corner.',
            ],
            [
              'Can I make an animated GIF from a PDF?',
              'No. The GIF option produces one still image per page, not an animation. A moving sequence needs a video or animation tool instead.',
            ],
            [
              'Are my files safe when I convert a PDF to images?',
              'Your documents are never stored on our servers, never retained after your session, and never used for training or analytics. Nothing you convert is kept, queued or logged.',
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
          Need something else from the same file? The{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          is the shortcut when JPEG is all you need, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          gets a heavy document under an upload limit, and the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          fixes the page order before you export anything. If you would rather
          understand image formats than simply convert between them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers colour, compression and resolution from the ground up.
        </p>
      </div>
    </article>
  );
}
