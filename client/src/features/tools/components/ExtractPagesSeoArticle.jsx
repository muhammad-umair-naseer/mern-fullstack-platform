import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Extract Pages from PDF tool.
 *
 * Same skeleton as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with a lucide icon each, benefit grid, FAQ, closing
 * cross-links. Copy it if you add another one of these.
 *
 * Four decisions shaped the copy, and they matter if anyone edits it later.
 *
 * First, the tool copies pages rather than re-rendering them, so the output is a
 * genuine lossless subset of the original — same vectors, same fonts, same
 * embedded images. Section 4 leans on that hard because "extract pages from pdf
 * without losing quality" is a real and very winnable query, and here we can
 * answer it honestly instead of hedging.
 *
 * Second, four high-volume neighbours were deliberately NOT promised, because
 * the code does not do them. "Split pdf into multiple files" produces many
 * files; this produces exactly one, so section 1 draws the distinction and sends
 * that intent to the splitter. "Delete pages from pdf" is the inverse operation
 * and belongs to the page remover. "Reorder pages" is impossible here — the
 * selection is always written out in ascending page order regardless of the
 * order you click, so section 3 says so plainly and points at the organiser.
 * "Extract text/images from pdf" is a different output type entirely. Each of
 * those gets an honest sentence rather than a promise; a page that answers the
 * question outranks a page that lies about it and generates no complaints.
 *
 * Third, the finish line is a RESULT PANEL, not an automatic download. In
 * ExtractPages.js handleExtract only sets result + status 'completed'; the file
 * reaches disk solely through the "Download Extracted PDF" button, which is the
 * only caller of handleDownload. Never write "downloads automatically" here.
 * For the same reason the organiser is described as moving pages with the
 * left/right arrow buttons it actually has — PdfOrganizer.js has no page
 * drag-and-drop, only a file dropzone.
 *
 * Fourth, privacy is sold as an outcome only — files are not stored, not queued,
 * not retained, not used for training. How that is achieved is deliberately
 * absent from every line of this file.
 */
export default function ExtractPagesSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Extract Pages from a PDF</span>: The Complete Guide to Saving Selected Pages as a New File
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Most of the time you do not need the whole document. You need
        pages 4 to 9 of a forty-page contract, the two pages of a bank statement
        your landlord asked for, or the one chapter you are actually revising.
        Learning to <strong>extract pages from PDF</strong> files turns a heavy,
        over-sharing attachment into a small, precise one. The tool above lets
        you <strong>save selected PDF pages as a new PDF</strong> by clicking
        thumbnails or typing a range &mdash; free, with no account, no watermark
        and no size cap. This guide covers picking the right pages, what happens
        to quality, and how this differs from splitting or deleting.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/extract-pages-from-pdf.webp"
            alt="A tall stack of printed pages flagged with bright sticky tabs marking the ones to pull out"
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
              Tick the pages you want and leave the rest behind: a new PDF
              holding only the pages that matter.
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
            ['#what-it-means', '1. What Extracting Pages Actually Does'],
            ['#how-to', '2. How to Extract Pages from a PDF Online Free'],
            ['#choosing-pages', '3. Choosing Pages: Thumbnails, Ranges and Order'],
            ['#quality', '4. Quality: What Carries Over Into the New PDF'],
            ['#use-cases', '5. When Extracting Pages Is the Right Move'],
            ['#troubleshooting', '6. Troubleshooting: When Nothing Comes Out'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Page Extractor'],
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
      <section id="what-it-means" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Extracting Pages Actually Does
        </h3>
        <p>
          A PDF, as described by the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2 specification
          </a>
          , is a collection of page objects held together by a catalogue, each
          page carrying its own content, fonts and images. That structure is why
          pulling pages out is a clean operation rather than a destructive one:
          the pages you choose are copied whole into a new document, and the file
          you started with is untouched.
        </p>
        <p>
          So when you <strong>extract pages from a PDF</strong> you end up with{' '}
          <em>two</em> documents: your original, exactly as it was, and a new PDF
          holding only your selection. That matters because three
          similar-sounding jobs get confused constantly, and picking the wrong
          one wastes ten minutes.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Extracting pages</strong> keeps what you tick and produces{' '}
            <strong>one new PDF file</strong>. That is this tool.
          </li>
          <li>
            <strong>Splitting</strong> cuts a document into several separate
            files at once. If you need many outputs rather than one, the{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF splitter
            </Link>{' '}
            is the correct tool.
          </li>
          <li>
            <strong>Deleting pages</strong> is the mirror image: you name the
            pages you want <em>gone</em>. When those are the shorter list, the{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF page remover
            </Link>{' '}
            saves you a lot of clicking.
          </li>
        </ul>
        <p>
          The rule of thumb: if the pages you want to keep are fewer than the
          pages you want gone, extract. Otherwise, delete.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Extract Pages from a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No sign-up, no email, no trial. To{' '}
          <strong>extract pages from a PDF online free</strong> with the tool
          above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your PDF', 'Drop a .pdf onto the panel above or click to browse. A short "Rendering page previews" step runs, then every page appears as a thumbnail, so you see what you are choosing.'],
            ['Tick the pages you want', 'Click a thumbnail to select or deselect it. Use Select All, Clear Selection, or type a range like 1-3, 5, 7-10 and press Apply Range. Page 1 is ticked for you to begin with.'],
            ['Extract, then download', 'Press Extract. A progress readout steps through opening, extracting and saving, then a result panel shows how many pages went in and how big the new file is. Click Download Extracted PDF to save your-file-extracted.pdf.'],
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
          The last step is worth spelling out, because it is where people expect
          a file to appear on its own. Nothing is written to disk until you ask
          for it: the result panel is a checkpoint. It names the file, counts the
          extracted pages and shows the finished size, so you can confirm you
          picked the right ones before you save anything. Only then does{' '}
          <strong>Download Extracted PDF</strong> hand you the file. Beside it,{' '}
          <strong>Extract Another File</strong> clears everything and takes you
          back to an empty dropzone for the next document.
        </p>
        <p>
          The Extract button also tells you what it is about to do &mdash; it
          reads &ldquo;Extract 6 Pages&rdquo; when six thumbnails are ticked
          &mdash; which is the fastest way to catch a stray click before you run
          it. That is the entire process, whether you want to <strong>save one
          page of a PDF as a separate file</strong> or lift out a fifty-page
          chapter. No queue, no daily counter and no watermark stamped across the
          result, which is the usual catch elsewhere.
        </p>
      </section>

      {/* 3 */}
      <section id="choosing-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MousePointerClick className="w-6 h-6 text-orange-500 shrink-0" />
          3. Choosing Pages: Thumbnails, Ranges and Order
        </h3>
        <p>
          There are two ways to build a selection, and they work together.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Clicking thumbnails
        </h4>
        <p>
          Every page appears as a rendered preview in a scrollable grid, and
          clicking toggles it in or out. This is the right method when you are
          hunting for something visual &mdash; the page with the signature, the
          chart, the invoice among twenty delivery notes &mdash; because you can
          recognise it on sight. A tick badge in the corner of each card marks
          what is currently in, and the toolbar keeps a running count.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Typing a page range
        </h4>
        <p>
          The range box takes the notation you would type into a print dialog:{' '}
          <strong>1-3, 5, 7-10</strong>. Commas separate entries, a hyphen makes
          a run, and the two forms mix freely. A backwards range like 9-4 is read
          as 4 to 9 rather than rejected, and numbers past the end of the file are
          ignored, so 1-500 on a 30-page document simply gives you all 30.
          Applying a range <em>replaces</em> the current selection, so treat it as
          a starting point and fine-tune by clicking.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          One honest limit: page order
        </h4>
        <p>
          Pages are always written into the new PDF in ascending order, whatever
          order you clicked them in: selecting 9, then 2, then 5 gives a file
          reading 2, 5, 9. That is deliberate &mdash; extraction preserves the
          document&rsquo;s own sequence. If you need a different order, extract
          first and then rearrange with the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>
          , which lets you move pages left or right into any sequence you like,
          one position at a time, and can also rotate, duplicate or delete a page
          while you are in there.
        </p>
      </section>

      {/* 4 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          4. Quality: What Carries Over Into the New PDF
        </h3>
        <p>
          People searching to{' '}
          <strong>extract pages from PDF without losing quality</strong> are
          usually thinking of what happens when you screenshot a page or print it
          back out: everything goes soft and text stops being selectable. None of
          that happens here. Pages are copied across as the objects they already
          are, never re-photographed.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Carries over intact
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Selectable, searchable text</li>
              <li>Embedded fonts, exactly as they were</li>
              <li>Images at their original resolution</li>
              <li>Vector diagrams and logos, sharp at any zoom</li>
              <li>Page size, orientation and margins</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> Worth checking afterwards
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Bookmarks and the document outline</li>
              <li>Interactive form fields and their values</li>
              <li>Links pointing at pages you left behind</li>
              <li>Printed page numbers, still reading 47 on page 1</li>
            </ul>
          </div>
        </div>
        <p>
          That right-hand column is not a quality loss. Some things in a PDF
          describe the whole document rather than a page, and a new document does
          not inherit them. If your pages carry a form you still need to fill in,
          rebuild it with the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            fillable PDF tool
          </Link>
          . And because it holds fewer pages, the new file is almost always
          smaller than the original &mdash; the result panel prints that size, so
          you can check it against an upload limit before you download.
        </p>
      </section>

      {/* 5 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-orange-500 shrink-0" />
          5. When Extracting Pages Is the Right Move
        </h3>
        <p>
          Almost every reason to <strong>pull pages out of a PDF</strong> comes
          down to sending less than you were given &mdash; and it is why{' '}
          <strong>extract pages from PDF</strong> is such a common request.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Sharing without over-sharing
        </h4>
        <p>
          A bank statement or a tenancy agreement contains far more than the
          person asking for it needs. Extracting the two relevant pages is a
          privacy decision as much as a convenience one: you cannot leak what you
          never sent. It is the most common reason people search for how to{' '}
          <strong>save specific pages of a PDF</strong>.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Cutting a long document down to what matters
        </h4>
        <p>
          Course notes, manuals and annual reports are long by nature. Lifting
          out one chapter gives you something you can read on a phone, annotate
          or print. Students use it to build a revision PDF from several sources
          &mdash; extract from each, then join the results with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          .
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Getting under an upload or email limit
        </h4>
        <p>
          Portals and mail servers reject big attachments, and fewer pages means
          a smaller file &mdash; a cleaner fix than degrading the whole document.
          If the result is still too heavy, run it through the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          as a second pass.
        </p>
        <p>
          Extraction is often step one. Turn your chosen pages into images with
          the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>
          , make a scanned selection searchable with the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>
          , or lock the finished extract with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>{' '}
          before it goes anywhere.
        </p>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Troubleshooting: When Nothing Comes Out
        </h3>
        <p>
          The tool says plainly when something has gone wrong rather than handing
          you a broken file. Notices appear in a red panel above the dropzone.
          Here is what each one is telling you, and what to do about it.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          &ldquo;Please select a valid .pdf file&rdquo;
        </h4>
        <p>
          Only PDFs can be extracted from, and the check is on the file
          extension, so anything not ending in .pdf is turned away before it is
          opened at all. Note the gap that leaves: a non-PDF renamed to .pdf gets
          past this check and fails later, when the document itself is opened, so
          a photo saved as scan.pdf produces the load failure described next
          rather than this notice. If your document is really a Word file,
          convert it first with the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>
          , which runs in both directions.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          When the PDF will not open
        </h4>
        <p>
          If the file cannot be read, the notice quotes the reason the PDF reader
          itself gave, so the exact wording varies with the fault rather than
          being one fixed sentence. Two causes account for nearly all of them.
          A password-protected document reports a missing or wrong password: it
          has to be unlocked before any tool can reach its pages, so open it in
          your usual PDF reader, supply the password and save an unprotected copy
          first. A file that arrived from a half-finished download or a flaky
          email attachment reports a broken or invalid structure instead &mdash;
          there the fix is to fetch the original again from the source rather
          than to retry the same damaged copy. Either way, no partial file is
          produced; you simply get the notice and the dropzone back.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          &ldquo;No valid page numbers found in that range&rdquo;
        </h4>
        <p>
          Your range text held nothing usable as a page number. Letters, roman
          numerals, labels like &ldquo;A-4&rdquo; and numbers past the end of the
          document are discarded. Stick to digits and hyphens, and count from
          page one of the file rather than from the number printed on the page.
          Your existing selection is left alone when a range fails, so nothing is
          lost by trying again.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          The Extract button will not press
        </h4>
        <p>
          It stays disabled while zero pages are selected, which usually happens
          straight after Clear Selection; tick one thumbnail and it wakes up.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          The file never reached your downloads folder
        </h4>
        <p>
          Extraction finishing and the file being saved are two separate moments.
          If the green result panel is on screen, the new PDF exists and is
          waiting behind the <strong>Download Extracted PDF</strong> button
          &mdash; press it. Starting a new file with Extract Another File, or
          reloading the page, clears that result, so download before you move on.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Page Extractor
        </h3>
        <p>
          Plenty of sites will <strong>extract PDF pages</strong> for you. Most
          make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough to check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email address, no card and no seven-day countdown. The tool you are using is the whole product.'],
            ['See the pages before you choose', 'Every page is rendered as a thumbnail, so you pick the page you recognise rather than guessing at a number.'],
            ['Lossless output, every time', 'Pages are copied, not re-rendered. Text stays selectable, images stay sharp, fonts stay as the author embedded them.'],
            ['No watermark and no page cap', 'Extract two pages or two hundred from a file of any length. Nothing is stamped on the result.'],
            ['Check the result before you save it', 'The finished panel names the file, counts the pages and shows the size, and the download only happens when you press the button.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train anything.'],
            ['Honest about what it does not do', 'It makes one new PDF in page order, and it tells you when the splitter or page remover is the better tool.'],
            ['Part of a complete set', 'Rotate, crop, compress, protect or merge the extract afterwards without hunting for another site.'],
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
          It sits alongside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on the same terms, so once your pages are out you can{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            rotate
          </Link>
          ,{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            crop
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            combine
          </Link>{' '}
          them without paying for any of it.
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
              'How do I extract pages from a PDF for free without an account?',
              'Open the tool at the top of this page, drop your PDF in, click the page thumbnails you want or type a range like 1-3, 5, 7-10, then press Extract and click Download Extracted PDF to save the result. There is no sign-up and no watermark, and it is free every time rather than free for the first three files.',
            ],
            [
              'Can I save just one page of a PDF as a separate file?',
              'Yes. Select a single thumbnail and extract — the result is a one-page PDF named after your original with -extracted on the end, keeping the same size, fonts and images as the source page.',
            ],
            [
              'Does extracting pages change the original PDF?',
              'No. The original is never modified. Extraction writes a brand new PDF containing only the selected pages, so you end up with both documents and can go back for a different set whenever you like.',
            ],
            [
              'Will extracting pages reduce the quality of my PDF?',
              'No. Pages are copied whole rather than re-rendered or converted to images, so text stays selectable, photographs keep their resolution and vector graphics stay sharp at any zoom. The file is smaller only because it holds fewer pages.',
            ],
            [
              'Can I put the extracted pages in a custom order?',
              'Not in this tool — pages are always written out in ascending order, whichever order you clicked them. Extract them first, then move them into any order with the PDF organizer, which shifts a page one position left or right with its arrow buttons and can also rotate, duplicate or remove pages.',
            ],
            [
              'Where does the extracted file go when it is finished?',
              'Nowhere until you say so. When extraction finishes you get a result panel naming the file, counting the extracted pages and showing the new size; pressing Download Extracted PDF is what saves it, so check the summary first and download before you start another file.',
            ],
            [
              'Is there a page or file size limit, and are my files kept?',
              'There is no page limit, no size cap and no daily quota; a very long document simply takes longer to render its previews. Your files are not stored on our servers, not retained after your session, and never used for training or analytics.',
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
          Need something else from that document? Use the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          when one file is not enough, the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          when it is easier to say what should go, the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          to put pages in a new order, or the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image extractor
          </Link>{' '}
          to pull out the pictures instead of the pages. If you would rather
          understand document work from the ground up, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the document formats and file handling behind tools like this
          one.
        </p>
      </div>
    </article>
  );
}
