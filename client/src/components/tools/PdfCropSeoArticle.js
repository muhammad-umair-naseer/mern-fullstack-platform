import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Crop,
  HelpCircle,
  Layers,
  Printer,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Crop tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, benefit grid, FAQ, closing link block.
 *
 * Four decisions drove the copy, and anyone editing this later should keep
 * them.
 *
 * 1. The tool sets a page's crop box. It does not delete the trimmed strip
 *    from the file. That distinction is the whole reason section 5 exists.
 *    "Redact pdf", "permanently remove content from pdf" and "crop pdf to
 *    hide confidential text" are large, tempting phrases and every one of them
 *    is declined here, in writing, because promising them would be both false
 *    and dangerous. We answer the question behind the query instead. Section 4
 *    therefore says "hide", never "remove", and never uses a sensitive example
 *    such as a draft stamp or a confidentiality strip.
 *
 * 2. Only the crop box is set. The media box, trim box, bleed box and art box
 *    keep their original values, so any consumer that reads the underlying
 *    sheet size still sees the full page. The article says "viewers and
 *    printers that follow the crop box, which is most of them" and never
 *    "all viewers" or "every serious viewer".
 *
 * 3. The "Trim 12%" button is a fixed preset, not content analysis. So
 *    "auto detect white margins" and "automatically crop pdf borders" are not
 *    claimed anywhere. The controls are four percentage sliders, capped at 40%
 *    a side, applied either to every page or to the page on screen — that is
 *    exactly what the article describes and nothing more.
 *
 * 4. Changing page dimensions to a named paper size is the resize tool's job,
 *    not this one's, so "crop pdf to A4" is deliberately routed to
 *    /tools/pdf-resize rather than half-answered here.
 *
 * No timing figures, no benchmarks and no superlatives about third-party
 * rendering: nothing in the component measures any of that.
 *
 * Privacy is stated as an outcome only — files are not stored, not retained,
 * not used for training. The mechanism is deliberately absent throughout.
 */
export default function PdfCropSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Crop a PDF Online</span>: Trim Margins, Headers and Dead Whitespace
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Some documents waste half the paper they sit on. A scanned book carries
        two inches of grey around every page, a report prints with margins wide
        enough to write a second report in, and a slide deck exported to PDF
        arrives ringed in white. When you <strong>crop a PDF online</strong> you
        are not editing the words &mdash; you are redrawing the edge of the page
        so only the part you care about is shown. This guide covers how to{' '}
        <strong>trim PDF margins</strong> properly, what the{' '}
        <strong>free PDF cropper</strong> above can and cannot do, and the one
        thing about cropping that almost nobody explains.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-crop.webp"
            alt="Crop a PDF online free - trimming wide margins and headers from PDF pages with a live crop boundary preview"
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
              Four sliders, a live boundary, and a tighter page: trim the
              margins off every page of a PDF at once.
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
            ['#what-cropping-does', '1. What Cropping a PDF Actually Changes'],
            ['#how-to-crop', '2. How to Crop a PDF Online Free (Step-by-Step)'],
            ['#controls', '3. The Crop Controls, Explained'],
            ['#headers-and-scans', '4. Headers, Footers and Scanned Edges'],
            ['#hidden-not-deleted', '5. What Cropping Does Not Do'],
            ['#print-kindle-slides', '6. Cropping for Print, E-Readers and Slides'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Cropper'],
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
      <section id="what-cropping-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Cropping a PDF Actually Changes
        </h3>
        <p>
          Every page in a PDF carries more than one rectangle. There is the
          media box, which is the sheet the page was authored on, and there is
          the crop box, which is the window a reader is told to display and a
          printer is told to print. They usually sit on top of one another,
          which is why most people never learn the difference. Cropping moves
          the second one inwards and leaves the first one exactly where it was.
          The description of these boxes is part of{' '}
          <a
            href="https://www.iso.org/standard/51502.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000, the published PDF specification
          </a>
          , so a crop box is a standard construct rather than a private
          extension, and mainstream viewers follow it rather than needing the
          tool that made the file.
        </p>
        <p>
          That has a consequence worth understanding before you touch a slider.
          When you <strong>crop PDF pages</strong> here, nothing is redrawn,
          re-photographed or re-encoded. The text stays real text, still
          selectable and still searchable. Vector diagrams stay razor sharp at
          any zoom. Fonts stay embedded. You are changing the frame, not the
          picture, which is why the result is genuinely a{' '}
          <strong>crop without losing quality</strong> rather than the soft,
          slightly grey imitation you get from tools that flatten a page to an
          image first.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The visible page gets smaller.</strong> Viewers and printers
            that follow the crop box &mdash; which is most of them &mdash; show
            and print only the new area. Some software reads the underlying
            sheet size instead, so the occasional thumbnailer, page-size readout
            or print pipeline will still report the original dimensions.
          </li>
          <li>
            <strong>The content is untouched.</strong> No character is deleted,
            no image is recompressed, no layer is rasterised.
          </li>
          <li>
            <strong>The file stays a normal PDF.</strong> It merges, splits,
            prints and uploads exactly like the original did.
          </li>
        </ul>
        <p>
          That first bullet is the honest half of the story, and it is worth a
          sentence more. Because only the display window moves, a cropped page
          is best thought of as the same sheet of paper with a smaller frame
          drawn on it. In day-to-day reading, printing and sharing you will see
          the tighter page; in the rare tool that measures the sheet rather than
          the frame, you will see the original size. If you need the page
          dimensions themselves rewritten to a named format, that is a different
          job and the{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF resize tool
          </Link>{' '}
          is the one to use.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-crop" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Crop a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>crop a PDF online free</strong> with the tool at the top of
          this page, three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Open your PDF', 'Drag a .pdf onto the panel above or click to browse. Anything that is not a PDF is refused straight away with a plain message rather than a silent failure, and the first page appears as a preview with the page count beside it.'],
            ['Set the four margins', 'Pull the top, right, bottom and left sliders until the orange boundary sits where you want the new page edge. Step through the pages to check the crop suits the whole document, not just page one.'],
            ['Download the cropped PDF', 'Press download and the file arrives named after the original with -cropped on the end, so the source file on your desk is never overwritten or confused with the new one.'],
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
          There is no watermark on the output, no queue, no daily cap and no
          size ceiling on the file you bring. If you decide halfway through that
          you picked the wrong document, &ldquo;Change PDF&rdquo; clears
          everything and starts again.
        </p>
      </section>

      {/* 3 */}
      <section id="controls" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Crop Controls, Explained
        </h3>
        <p>
          The controls are deliberately small in number, because a crop with
          four honest numbers behind it is easier to repeat than a rectangle you
          dragged by eye.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Four percentage sliders, capped at 40%
        </h4>
        <p>
          Top, right, bottom and left each move independently from 0% to 40%.
          The figures are percentages of that page&rsquo;s own width and height,
          not fixed millimetres, so a document mixing portrait and landscape
          sheets gets a proportional trim on every one rather than a crop that
          fits the first page and ruins the rest. The 40% ceiling is a guard
          rail: past that point you are no longer trimming a margin, you are
          deleting the page. As a backstop, a setting that would leave a sliver
          only a few millimetres across leaves that page untouched &mdash; with
          the 40% cap in place you are unlikely ever to hit it.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Two presets and a live boundary
        </h4>
        <p>
          &ldquo;Trim 12%&rdquo; sets all four sides to twelve percent in one
          tap, which is a sensible starting point for the standard fat margins
          on an office report. &ldquo;Reset (0%)&rdquo; puts everything back to
          zero. Between them and the preview you can find a{' '}
          <strong>trim PDF whitespace</strong> setting in a few seconds. The
          orange rectangle over the page is not decoration &mdash; it is the
          output area, updating as you drag, so what you see framed is what the
          downloaded file will show.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          All pages, or just this one
        </h4>
        <p>
          The tick box decides scope. Leave it on and you{' '}
          <strong>crop all pages in a PDF at once</strong> with the same
          measurements, which is what you want for a scanned book or a long
          report. Turn it off and only the page currently on screen is cropped,
          which is the fix when one landscape chart or one badly scanned sheet
          is the odd one out. Page arrows let you inspect any page before you
          commit.
        </p>
      </section>

      {/* 4 */}
      <section id="headers-and-scans" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crop className="w-6 h-6 text-orange-500 shrink-0" />
          4. Headers, Footers and Scanned Edges
        </h3>
        <p>
          Three jobs account for most of the traffic to a tool like this one,
          and each has its own approach.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Hiding a header or footer from view
        </h4>
        <p>
          A running header or a page-number band lives in a predictable ribbon
          at the top or bottom of the sheet. Raise the top slider a few percent
          at a time until the boundary excludes it and the band stops showing on
          every page &mdash; it is hidden from the visible window, not deleted
          from the file, which is why section 5 below is worth reading before
          you use this on anything sensitive. Do check the first and last pages
          though: title pages and appendices often sit differently from the
          body, and a ribbon that clears the header on page 40 can eat the title
          on page 1.
        </p>
        <p>
          If what you actually need is the header gone from the file rather than
          out of frame, no crop of any kind will do it, here or anywhere else
          &mdash; the honest answer is that you need the source document, or a
          proper redaction workflow, and this tool does not claim to be either.
          What it does do well is make a long, repetitively headed document
          pleasant to read and print, with the same measurements applied to
          every page in one pass.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Getting rid of black borders on a scanned PDF
        </h4>
        <p>
          Scanners photograph the lid as well as the page, which is where those
          dark bands and skewed grey edges come from. Nudging all four sliders
          together will <strong>crop scanned PDF margins</strong> off the whole
          document and make it far more pleasant to read. If the scan is also
          crooked or sideways, straighten the orientation first with the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          and crop afterwards &mdash; cropping a rotated page and then rotating
          it produces a frame in the wrong place. If the scan has no searchable
          text yet, the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          will add one.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Killing the white space around a small block of text
        </h4>
        <p>
          Certificates, receipts, tickets and single-paragraph letters often sit
          marooned in the middle of an A4 sheet. Cropping tight to the content
          means it fills the screen on a phone instead of appearing as a stamp
          in a field of white. This is the most satisfying use of the tool: four
          sliders and a download.
        </p>
      </section>

      {/* 5 */}
      <section id="hidden-not-deleted" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. What Cropping Does Not Do
        </h3>
        <p>
          This is the section other cropping pages leave out, and it is the most
          important one on this page.
        </p>
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25 not-prose my-6">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600 shrink-0" />
            Cropping hides content. It does not delete it.
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The trimmed strip is outside the visible window, not out of the
            file. Anyone who widens the crop box again can see it. Never use
            cropping to conceal a signature, an address, a salary line, a draft
            or confidentiality marking, or any other sensitive detail &mdash;
            that is redaction, it is a different job, and this tool does not
            claim to do it.
          </p>
        </div>
        <p>
          Everything else on the honest list is smaller, but worth knowing
          before you start rather than after.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>There is no automatic white-margin detection.</strong> The
            12% button is a one-tap preset, not an analysis of your page. You
            set the numbers; the preview tells you whether they are right.
          </li>
          <li>
            <strong>Cropping will not shrink your file.</strong> The hidden
            content is still stored, so the size barely moves. For that, use the{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>
            .
          </li>
          <li>
            <strong>It is not a page-size converter.</strong> If you need pages
            scaled to a named paper size, the{' '}
            <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF resize tool
            </Link>{' '}
            is the right one for A4 and Letter.
          </li>
          <li>
            <strong>One document at a time, and one set of measurements.</strong>{' '}
            You can apply a crop to every page or to a single page, but not a
            different crop to each page in one pass, and not to a folder of
            files in bulk.
          </li>
          <li>
            <strong>Password-protected files must be unlocked first.</strong> An
            encrypted PDF cannot be opened for editing, and the crop will fail
            with an error rather than silently producing a broken file.
          </li>
        </ul>
        <p>
          If the goal is genuinely to get rid of pages rather than margins, the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          deletes whole pages, and the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          keeps only the range you want.
        </p>
      </section>

      {/* 6 */}
      <section id="print-kindle-slides" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          6. Cropping for Print, E-Readers and Slides
        </h3>
        <p>
          The reason to <strong>remove margins from a PDF</strong> is usually
          not tidiness. It is that something downstream is treating those
          margins as content.
        </p>
        <p>
          <strong>On an e-reader,</strong> a PDF is shown as a fixed page rather
          than reflowing text, so a small screen spends a third of itself on
          empty paper and the type comes out unreadably small. Cropping the
          margins away lets the remaining text fill the display, which is the
          simplest way to <strong>crop a PDF for Kindle</strong> or any six-inch
          reader without converting the file to another format. How much any
          particular device zooms the result is the device&rsquo;s business, so
          try one cropped chapter before you commit a whole library.
        </p>
        <p>
          <strong>In print,</strong> a printer adds its own unprintable margin
          to whatever margin the document already has, and the result is a
          shrunken block floating high on the sheet. Trimming the document
          margin first gives the printer room to scale the content up. It also
          helps with slide decks exported at 16:9 onto portrait paper &mdash;
          trim the empty bands above and below and the print dialog&rsquo;s
          fit-to-page has more to work with.
        </p>
        <p>
          <strong>For reuse,</strong> a tightly cropped page drops into a
          presentation or a document without a white halo around it. If you need
          the page as a picture rather than a PDF, run the cropped file through
          the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          and the exported image inherits the tighter frame. Working with photos
          instead of documents? The{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          handles JPG and PNG directly.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Cropper
        </h3>
        <p>
          Plenty of sites will <strong>crop PDF files</strong>. Most make it
          irritating until you pay. Here is the difference, stated plainly
          enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no trial attached', 'No account, no email, no card and no seven-day countdown. The tool on this page is the entire product.'],
            ['No watermark on the output', 'Your cropped PDF comes out clean. Nothing is stamped across the page and nothing is appended to the end.'],
            ['No size or page limit', 'Crop a two-page receipt or a six-hundred-page scanned volume. There is no tier above this one to upsell you to.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Quality is never traded away', 'Text stays selectable, vectors stay sharp and images are not recompressed. Cropping costs you nothing in fidelity.'],
            ['We tell you the limits', 'Cropping hides rather than deletes, and we say so on the page instead of letting you find out later.'],
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
          built on the same terms, so a cropped file can go straight on to be{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merged
          </Link>{' '}
          with others or{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            reordered
          </Link>{' '}
          without paying for any of it.
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
              'How do I crop a PDF online for free without signing up?',
              'Open the cropper at the top of this page, drop your PDF in, move the four margin sliders until the orange boundary frames what you want, and download the result. There is no account step, no email verification and no watermark. It is free every time, not free for the first three files.',
            ],
            [
              'Can I crop all the pages in a PDF at once?',
              'Yes. The scope tick box is on by default, so one set of measurements is applied to every page in the document in a single pass. Untick it and only the page you are currently previewing is cropped, which is useful when one page in a long file is the odd one out.',
            ],
            [
              'Does cropping a PDF reduce the file size?',
              'Barely. Cropping changes the visible boundary of the page rather than removing anything from the file, so the content outside the new edge is still stored. If you need a smaller file, use our PDF compressor instead, either before or after cropping.',
            ],
            [
              'Is cropped content permanently deleted from the PDF?',
              'No, and this matters. The trimmed area is hidden, not destroyed, and someone who widens the crop box can bring it back. Never crop a document to conceal confidential information such as signatures, addresses or figures.',
            ],
            [
              'Can I crop out a header or a stamp before sending the file to someone?',
              'You can stop it being displayed, and for a tidier read or a cleaner print that is usually all you want. You cannot use it to keep that band away from a determined recipient, because the strip is still inside the file and reappears if the crop box is widened. If the marking is sensitive, do not crop it: get a clean copy of the source document instead.',
            ],
            [
              'Will the cropped page report a smaller page size everywhere?',
              'Not necessarily. Cropping moves the display window, so viewers and printers that follow the crop box show and print the tighter page, while software that reads the underlying sheet size may still report the original dimensions. If it is the page dimensions themselves you need changed, the PDF resize tool is the right one.',
            ],
            [
              'Will cropping make my PDF blurry or unselectable?',
              'No. Nothing is re-rendered, so text remains real searchable text, vector graphics stay sharp at any zoom, and photographs are not recompressed. The page frame changes and the quality does not.',
            ],
            [
              'Why can I only trim up to 40% from each side?',
              'It is a deliberate limit. A crop beyond forty percent per side stops being a margin trim and starts being page destruction. There is also a backstop that leaves a page alone if the settings would reduce it to a sliver a few millimetres across, though with the 40% cap you are unlikely ever to reach it. If you want to lose whole pages, the page remover or the splitter is the right tool.',
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
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          straightens sideways scans before you crop them, the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page extractor
          </Link>{' '}
          pulls a chapter out into its own file, and the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flattener
          </Link>{' '}
          settles a form into a fixed document. If you would rather understand
          layout and composition than only click through it, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers framing, margins and page structure from the ground up.
        </p>
      </div>
    </article>
  );
}
