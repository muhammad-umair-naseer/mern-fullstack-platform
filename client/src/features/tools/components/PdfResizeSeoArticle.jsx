import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Frame,
  HelpCircle,
  Layers,
  Maximize2,
  Printer,
  Ruler,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Resize tool.
 *
 * Same shape as PdfWordSeoArticle, which is the house reference: an H2 beneath
 * the page's H1, an anchored table of contents, H3 sections carrying icons, a
 * benefit grid, an FAQ and a closing link block.
 *
 * Four decisions shaped this copy. Anyone editing it later should keep them.
 *
 * 1. "Resize PDF" is a split-intent keyword and a large slice of its volume is
 *    wrong for this tool. Half the people typing it mean "make the file smaller
 *    in megabytes" — resize pdf to 100kb, resize pdf for upload, reduce pdf
 *    size online. This tool changes page geometry, not byte count, and a
 *    geometry change can leave the file marginally heavier. Section 6 exists
 *    purely to answer that intent honestly and hand those visitors to the
 *    compressor. Compression is never promised anywhere on this page.
 *
 * 2. Keywords deliberately declined. Custom dimensions in mm or inches: the
 *    tool ships six fixed presets and has no numeric field, so section 3 says
 *    so and points at crop. Batch resizing of multiple PDFs: the picker takes
 *    one file per run. Resizing selected pages only: every page in the document
 *    is rebuilt, there is no range input. Rotating page content ninety degrees:
 *    orientation changes the shape of the sheet, it does not spin the artwork —
 *    promising otherwise would generate a steady stream of "my landscape page
 *    has enormous side margins" complaints, so section 5 states the difference
 *    plainly and links to the rotate tool.
 *
 * 3. Section 5 also admits what does not survive the rebuild: links, comments
 *    and form fields are not carried onto the new pages. Better said here than
 *    discovered afterwards.
 *
 * 4. Privacy is sold strictly as an outcome — nothing stored, nothing retained,
 *    nothing used for training. The mechanism is never described.
 */
export default function PdfResizeSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Resize PDF Page Size</span>: The Complete Guide to Paper Formats, Orientation and Scaling
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Every page in a PDF carries a fixed width and height, and that pair of
        numbers decides how the document prints, how it binds, and whether a
        submission portal accepts it at all. When a file arrives as US Letter
        and the printer expects A4, or a scan comes back at some odd
        in-between measurement, what you need is to{' '}
        <strong>resize PDF page size</strong> rather than rewrite the content
        inside it. The tool above will <strong>change PDF page size</strong> to
        six standard formats, set orientation, and let you decide how the
        existing artwork sits on the new sheet. This guide covers every option
        &mdash; and the one job the phrase <strong>resize PDF</strong> is
        constantly mistaken for.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-resize.webp"
            alt="A paper trimmer with a measuring guide beside a sheet of paper and wooden pegs"
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
              One document, one target format: rebuild every page of a PDF onto
              A4, US Letter, US Legal, A3, A5 or Tabloid stock.
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
            ['#what-it-does', '1. What Changing a PDF Page Size Actually Does'],
            ['#how-to', '2. How to Resize PDF Page Size Online Free'],
            ['#paper-sizes', '3. The Six Paper Sizes, and When to Use Each'],
            ['#fit-fill-stretch', '4. Fit, Fill or Stretch: Placing Your Content'],
            ['#orientation', '5. Portrait, Landscape and Auto Orientation'],
            ['#not-file-size', '6. Page Size Is Not File Size: Read This First'],
            ['#troubleshooting', '7. Troubleshooting: When a Resize Goes Wrong'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF Page Resizer'],
            ['#faq', '9. Frequently Asked Questions (FAQ)'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Changing a PDF Page Size Actually Does
        </h3>
        <p>
          A PDF page is a rectangle with a declared width and height measured in
          points &mdash; seventy-two points to the inch, a unit inherited from
          typesetting long before anybody had a screen to look at. An A4 page is
          595 by 842 points. US Letter is 612 by 792. Those two are close enough
          to look identical in a viewer and different enough to spoil a print
          run, which is the single most common reason people go looking for a
          way to <strong>change PDF page size</strong> in the first place.
        </p>
        <p>
          When you resize, a fresh document is built at your chosen dimensions
          and each original page is placed onto it as one scalable unit. That
          distinction matters more than it sounds: the page is not
          re-photographed and not flattened into a picture, so text stays real
          text you can select and search, and line art stays crisp at any scale.
          Only the size of the sheet changes, and how large the content sits on
          it. That is why a proper <strong>PDF page resizer</strong> beats the
          old trick of printing to PDF at a different paper setting, which
          quietly re-renders everything and softens the type.
        </p>
        <p>
          Three things hold true of every run. Every page in the document is
          processed, so there is no page range to pick. Every page comes out at
          the same dimensions unless you leave orientation on Auto and the
          source itself was mixed. And your original is never altered: the
          result arrives as a separate file named after the source with the
          format appended, so <em>report.pdf</em> becomes{' '}
          <em>report-a4.pdf</em>.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2 flex items-center gap-2">
          <Printer className="w-5 h-5 text-orange-500 shrink-0" />
          When you actually need to resize a PDF
        </h4>
        <p>
          Most people never think about page geometry until something refuses
          to cooperate. These are the situations that send people looking for a
          way to <strong>resize PDF pages</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A document made in the wrong region.</strong> A file
            authored in the United States prints on Letter; a European or Asian
            printer is loaded with A4. Sending it as-is means clipped margins or
            a shrink-to-fit box in the print dialog nobody remembers to tick.
            Convert the geometry once and it prints correctly everywhere.
          </li>
          <li>
            <strong>A portal that demands A4.</strong> University submissions,
            visa applications, tender documents and job portals routinely
            specify a paper format and reject anything else. Setting the target
            explicitly is the fastest way to <strong>convert PDF to A4</strong>{' '}
            without touching the content.
          </li>
          <li>
            <strong>Pages that keep changing size.</strong> A file assembled
            from several sources often mixes formats, so the viewer jumps on
            every scroll and the printer switches trays halfway through. Forcing
            one size and one orientation gives you a document where{' '}
            <strong>all pages are the same size</strong> from cover to close.
          </li>
          <li>
            <strong>A booklet, poster or an odd-sized scan.</strong> Pushing a
            report onto A5 makes it read like a printed programme, and a chart
            onto A3 makes it legible across a table. Scans, which arrive at
            whatever size the sensor decided, become normal documents again.
            This is the quickest way to <strong>scale PDF to fit page</strong>{' '}
            for a format you never designed for.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Resize PDF Page Size Online Free (Step-by-Step)
        </h3>
        <p>
          There is no account, no email and no trial countdown. To{' '}
          <strong>resize a PDF online free</strong> with the tool at the top of
          this page, three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PDF', 'Drag a .pdf onto the panel or click to browse. The document is read the moment it lands, and the panel reports its page count and file size so you can confirm the right file loaded.'],
            ['Set the three options', 'Choose a target paper size from the six presets, set orientation to portrait, landscape or auto, then decide how the content should sit on the new sheet: fit, fill or stretch.'],
            ['Resize and download', 'Press the button. The rebuilt document downloads named after your original with the chosen format appended.'],
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
          One document at a time, as many times as you like. There is no daily
          cap, no page ceiling and no watermark on the output, so a four-page
          covering letter and a four-hundred-page manual are handled on the same
          terms. To compare two settings, resize once, then press{' '}
          <em>Change File</em> and run it again &mdash; nothing is counted.
        </p>
      </section>

      {/* 3 */}
      <section id="paper-sizes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Six Paper Sizes, and When to Use Each
        </h3>
        <p>
          The tool offers six targets: the formats that genuinely turn up in
          office and print work, covering nearly every request to move a
          document onto European or North American stock. They are the same
          standard page sizes the web platform recognises for printing, as
          documented in{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            MDN&rsquo;s reference for the CSS page size descriptor
          </a>
          , so a document resized here lines up with what a print stylesheet
          expects to find.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['A4 — 210 × 297 mm', 'The international default: reports, CVs, invoices, submissions and almost every government portal outside North America. If in doubt, pick this.'],
            ['US Letter — 8.5 × 11 in', 'The North American office standard. Wider and shorter than A4, which is why a Letter document printed on an A4 tray loses its side margins.'],
            ['US Legal — 8.5 × 14 in', 'Three inches taller than Letter. Contracts, affidavits and anything with long signature blocks that would spill onto an extra sheet.'],
            ['A3 — 297 × 420 mm', 'Double A4. Posters, drawings, dense spreadsheets and anything a room has to read at once.'],
            ['A5 — 148 × 210 mm', 'Half of A4. Booklets, programmes, flyers and handouts that should feel like a pamphlet rather than a memo.'],
            ['Tabloid — 11 × 17 in', 'The North American large format, sometimes called ledger. Newsletters, wide charts and tables that refuse to sit on Letter.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Worth being straight about the boundary: those six are presets, not a
          text box. There is no field for typing arbitrary millimetres, so if
          you need a <strong>custom PDF page size</strong> for a specialist
          press job, this is not the tool for it. What you can do instead is
          trim the sheet to an exact region with the{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop tool
          </Link>
          , which works from the boundary you draw rather than from a fixed
          list, and is the honest route to a non-standard shape.
        </p>
      </section>

      {/* 4 */}
      <section id="fit-fill-stretch" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Maximize2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Fit, Fill or Stretch: Placing Your Content
        </h3>
        <p>
          A4 and Letter are not the same shape, so moving content from one to
          the other means something has to give. The{' '}
          <strong>Content Placement</strong> setting decides what, and it is the
          option people most often get wrong on the first attempt.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Fit', 'Scales the page until all of it sits inside the new sheet, keeps proportions exactly and centres the result. Nothing is lost or distorted, though you may get a thin band of white space on two edges. The default, and right nine times out of ten.'],
            ['Fill', 'Scales the page up until it covers the sheet edge to edge, keeping proportions. The overflow is trimmed away, so content near the outer edges can be cut. Good for full-bleed artwork, poor for page numbers or margin notes.'],
            ['Stretch', 'Forces the page to the new dimensions exactly, ignoring proportions. Nothing is cropped or padded, but the artwork is squashed or pulled to match and text looks subtly wrong. Use it only when the two shapes are already close.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          If your goal is to <strong>fit a PDF to A4</strong> for printing
          without losing a single word, Fit is the setting every time. Choose
          Fill only when you designed to the bleed and know the outer few
          millimetres are expendable, and Stretch only where an edge must match
          precisely and slight distortion is acceptable.
        </p>
      </section>

      {/* 5 */}
      <section id="orientation" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Frame className="w-6 h-6 text-orange-500 shrink-0" />
          5. Portrait, Landscape and Auto Orientation
        </h3>
        <p>
          Orientation controls the shape of the finished sheet. Set{' '}
          <strong>Portrait</strong> and every page comes out tall,{' '}
          <strong>Landscape</strong> and every page comes out wide. Leave it on{' '}
          <strong>Auto</strong> and each page keeps the orientation it already
          had, judged page by page &mdash; what you want for a report that mixes
          upright text with wide data tables.
        </p>
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25 not-prose my-6">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            Orientation reshapes the page. It does not spin the artwork.
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Set a portrait document to Landscape and you get landscape sheets
            with your upright content centred on them between two wide margins
            &mdash; not content turned through ninety degrees. If what you
            actually want is to turn sideways pages the right way up, that is a
            rotation job, and the{' '}
            <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF rotate tool
            </Link>{' '}
            is built for exactly that.
          </p>
        </div>
        <p>
          One honest note on what carries across. Because each page is rebuilt
          onto fresh stock, everything visible &mdash; text, images, vector art,
          colour &mdash; comes through intact, but the interactive furniture on
          top of it does not: clickable links, comments and fillable form fields
          are not carried into the resized document. If you need a form
          afterwards, rebuild it with{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            make PDF fillable
          </Link>
          , and if you were trying to lock a completed form&rsquo;s answers into
          the page instead, the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flatten tool
          </Link>{' '}
          is the correct step to run first.
        </p>
      </section>

      {/* 6 */}
      <section id="not-file-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Page Size Is Not File Size: Read This First
        </h3>
        <p>
          A large share of the people searching <strong>resize PDF</strong> do
          not want different paper at all. They want fewer megabytes, because a
          portal rejected the file or a mail server bounced the attachment. Two
          different jobs wearing the same word, so they are worth separating
          before you waste an afternoon.
        </p>
        <p>
          Changing page dimensions removes no content whatsoever. Every glyph,
          every image and every path is still in the document, simply drawn at a
          different scale &mdash; so the resized file lands at broadly the same
          weight as the original and can occasionally be a touch heavier. If the
          goal is to <strong>reduce PDF file size</strong>, this is the wrong
          tool and no setting on it will help you. Here is where to go instead.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>To make the file lighter in MB</strong> &mdash; use the{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>
            . That is the tool built to bring a document under an upload limit.
          </li>
          <li>
            <strong>To make the document shorter</strong> &mdash; drop the pages
            you do not need with the{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF page remover
            </Link>
            , or keep only the range that matters using{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages from PDF
            </Link>
            .
          </li>
          <li>
            <strong>To trim white space or a scanner border</strong> &mdash;
            that is cropping rather than resizing, and the{' '}
            <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
              crop tool
            </Link>{' '}
            handles it precisely.
          </li>
          <li>
            <strong>To shrink an image rather than a document</strong> &mdash;
            the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            changes pixel dimensions, which is the closest equivalent of this
            tool in the image world.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          7. Troubleshooting: When a Resize Goes Wrong
        </h3>
        <p>
          Four things account for nearly every failed run, and all four have a
          short answer.
        </p>
        <div className="space-y-5 mt-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              &ldquo;Please select a valid .pdf file&rdquo;
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The tool takes PDFs and nothing else. A .docx, a .jpg or a .pptx
              is refused at the door rather than mangled. If you have an image
              you want on A4, turn it into a PDF first.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              The document will not open at all
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Almost always a password. An encrypted PDF cannot be
              restructured until it is unlocked, so remove the protection,
              resize the file, then re-apply security with the{' '}
              <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
                PDF protect tool
              </Link>
              . A corrupt file gives the same result, and re-exporting it from
              its source usually fixes that.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              The content is smaller than expected, with white bands
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              That is Fit doing its job: because the source and target shapes
              differ, proportional scaling leaves a margin on two edges. It is
              the trade for losing nothing. If the outer edge of the page is
              expendable, switch to Fill.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              I only wanted some of the pages changed
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Every page is rebuilt, so there is no page-range option. The
              workaround: pull the pages you want out with the{' '}
              <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
                PDF splitter
              </Link>
              , resize that piece on its own, and put the document back together
              with the{' '}
              <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
                PDF merger
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF Page Resizer
        </h3>
        <p>
          Plenty of sites will <strong>resize PDF pages</strong>. Most make it
          deliberately awkward until you hand over a card. Here is what is
          different here, written plainly enough that you can check every line
          against the tool itself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no trial attached', 'No account, no email, no card and no seven-day countdown. This is the whole product, not a sample of it.'],
            ['No file size or page limit', 'Resize a two-page letter or a four-hundred-page manual on the same terms. There is no tier above this one to be sold.'],
            ['No watermark on the result', 'Your resized PDF comes out clean. Nothing is stamped across the pages and nothing is appended to the last one.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session and never used to train anything. No file is kept, queued or logged.'],
            ['Quality survives the resize', 'Pages are rescaled as documents rather than pictures, so text stays selectable and line art stays sharp at the new dimensions.'],
            ['Straight answers about the limits', 'We say plainly what this tool does not do — custom sizes, compression, cropping, page ranges — and point you at the right one.'],
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
          built on identical terms, so once your pages are the right shape you
          can{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            reorder them
          </Link>
          , turn them into images, or lock the finished document down without
          paying for any of it.
        </p>
      </section>

      {/* 9 */}
      <section id="faq" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          9. Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-6 mt-4">
          {[
            [
              'How do I resize PDF page size for free without signing up?',
              'Add your PDF to the tool above, pick a paper size, an orientation and a content placement, then press resize. The finished document downloads immediately, with no account, no email verification and no watermark.',
            ],
            [
              'Will resizing a PDF make the file smaller in megabytes?',
              'No. Changing the page dimensions discards no content, so the file weighs roughly the same afterwards and can be slightly heavier. If you need a smaller upload, use the PDF compressor — that is the tool for file size rather than page size.',
            ],
            [
              'Can I resize a PDF to a custom size in millimetres or inches?',
              'Not here. The tool offers six fixed presets — A4, US Letter, US Legal, A3, A5 and Tabloid — with no field for arbitrary dimensions. For an exact non-standard shape, cropping to a boundary you draw gets closer than any preset.',
            ],
            [
              'How do I make all the pages in a PDF the same size?',
              'Choose your target format and set orientation to Portrait or Landscape rather than Auto. Every page is then rebuilt at identical dimensions, which fixes documents that jump size as you scroll and stops a printer switching trays mid-job.',
            ],
            [
              'Does resizing blur the text or reduce quality?',
              'It should not. Pages are rescaled as documents rather than converted into images, so text stays selectable and line art stays sharp. The one setting that visibly changes appearance is Stretch, which ignores proportions to match the sheet exactly.',
            ],
            [
              'Are my files safe when I resize a PDF here?',
              'Your documents are never stored on our servers, never retained once your session ends and never used for training or analytics. Nothing is kept, queued or logged.',
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
          turns finished pages into images for a deck,{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web page as PDF
          </Link>{' '}
          captures an article you can then push onto A4, and the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          gets the text back into an editable file when the layout needs rewriting
          rather than rescaling. If you would rather understand the rules behind
          print geometry than simply apply them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers page formats, bleed and scaling from the ground up.
        </p>
      </div>
    </article>
  );
}
