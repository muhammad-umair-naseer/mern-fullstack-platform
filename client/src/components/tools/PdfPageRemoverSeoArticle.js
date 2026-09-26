import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListChecks,
  Scissors,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Page Remover tool.
 *
 * Shaped to match PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with icons, benefit cards, FAQ, closing link block.
 *
 * Four decisions drove the copy, and they matter if anyone edits this later.
 *
 * First, the primary keyword is "delete pages from PDF" rather than the tool's
 * own name. Nobody searches "pdf page remover" in volume; they search for the
 * action. "Remove pages from PDF" is carried as the close second throughout,
 * because the two phrases split the same intent almost evenly.
 *
 * Second, several fat keywords describe things this tool genuinely does not do,
 * and none of them are promised:
 *   - "remove blank pages from pdf automatically" — there is no blank-page
 *     detector. Section 3 answers the intent honestly instead: the page grid
 *     makes blanks obvious on sight, and the odd/even shortcuts sweep up the
 *     scanner artefacts that cause most of those searches.
 *   - "delete pages from password protected pdf" — an encrypted file will not
 *     open, so the FAQ says so plainly rather than sending people into a loop.
 *   - "remove text from a pdf page" / redaction — this deletes whole pages, not
 *     content inside one. Section 6 draws that line.
 *   - "delete pages from multiple pdfs at once" — one document per run.
 *   - "delete a range of pages" — there is no shift-click range gesture and no
 *     "pages 12-18" box; the grid has one click handler per tile, so the copy
 *     says click each page in the block and watch the Remaining counter.
 *   - reordering and rotating — those belong to the organizer and rotate tools,
 *     which are linked instead of imitated.
 * A page that answers the question outranks a page that lies about it, and it
 * does not generate complaint mail.
 *
 * Third, two behaviours in the component are easy to describe wrongly, so they
 * are described exactly:
 *   - Marking every page does not raise a message. The delete button is
 *     disabled while nothing would remain, so it greys out and goes dead.
 *   - The trimmed file is assembled as a new document around the kept pages,
 *     so form definitions and signatures do not survive. Section 5 says so.
 *
 * Fourth, privacy is sold strictly as an outcome — files are not stored, not
 * retained, not used for training. How any of it works is deliberately absent.
 */
export default function PdfPageRemoverSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Delete Pages From a PDF</span>: The Complete Page Removal Guide
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Almost every PDF arrives with something you did not ask for. A cover
        sheet, a fax confirmation, four blank backs from a duplex scanner, the
        terms-and-conditions appendix nobody reads. Being able to{' '}
        <strong>delete pages from a PDF</strong> is the difference between
        sending a clean six-page document and apologising for a
        twenty-three-page one. The tool above lets you{' '}
        <strong>remove pages from a PDF free</strong>, by eye, with a thumbnail
        of every page in front of you &mdash; no account, no watermark and no
        size cap. This guide covers how <strong>PDF page removal</strong> works,
        which pages to strike, and where it stops.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-page-remover.webp"
            alt="Hands crumpling a sheet of paper over a desk scattered with discarded pages"
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
              Every page as a thumbnail: click the ones you do not want, keep
              the rest, and download a trimmed PDF.
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
            ['#what-happens', '1. What Happens When You Delete Pages From a PDF'],
            ['#how-to-delete', '2. How to Delete Pages From a PDF Online Free'],
            ['#blank-pages', '3. Blank Pages, Duplicates and Scanner Junk'],
            ['#which-pages', '4. First, Last, Ranges, Odd and Even Pages'],
            ['#quality-limits', '5. Quality, Limits and What Does Not Carry Over'],
            ['#delete-vs-extract', '6. Delete, Split or Extract: Choosing Correctly'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Page Remover'],
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
          1. What Happens When You Delete Pages From a PDF
        </h3>
        <p>
          A PDF is not one long scroll that has been chopped into sections. Under
          the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 standard that defines the format
          </a>
          , a document is a catalogue of independent page objects, each carrying
          its own content, fonts and dimensions. That structure is the reason{' '}
          <strong>PDF page deletion</strong> is such a clean operation compared
          with almost anything else you can do to a document.
        </p>
        <p>
          When you <strong>remove pages from a PDF</strong> here, the pages you
          kept are carried into a fresh document exactly as they were and the
          marked ones are simply left behind. Three consequences follow, and all
          three are worth knowing before you start:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Nothing is re-rendered or re-compressed.</strong> Text stays
            selectable, images keep their original resolution, and a page you
            keep looks pixel-for-pixel identical afterwards. This is a{' '}
            <strong>lossless page trim</strong>, not a conversion.
          </li>
          <li>
            <strong>Order is preserved.</strong> Kept pages stay in their
            original sequence and are renumbered to close the gaps, so deleting
            page 4 of ten leaves you a nine-page document, not one with a hole
            in it.
          </li>
          <li>
            <strong>The original file is untouched.</strong> You get a separate
            download named after the original with <code>-removed</code>
            appended, so the document you started with stays exactly as it was
            if you change your mind.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-delete" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Delete Pages From a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          There is no sign-up, no email and no trial countdown. To{' '}
          <strong>delete pages from a PDF online free</strong> with the tool at
          the top of this page, three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your PDF', 'Drop a .pdf onto the panel above or click to browse. Every page in the document is drawn as a thumbnail, so you are choosing from what you can see rather than guessing at page numbers.'],
            ['Mark what goes', 'Click any page to strike it out — it greys, gets a red cross, and flips from KEEP to DELETE. Click again to spare it. A running count shows how many are marked and how many remain.'],
            ['Save the trimmed PDF', 'Press delete and download the result. The file keeps your original name with -removed on the end, so the source document is never overwritten.'],
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
          Nothing is committed until you press the button. Marking a page is
          reversible right up to that moment, and a <em>Clear Marks</em> control
          resets every selection at once if you have talked yourself into
          deleting half the document. There is no watermark stamped across the
          output, which is the usual catch when you{' '}
          <strong>remove pages from a PDF without paid desktop software</strong>{' '}
          elsewhere. The button itself tells you what it is about to do &mdash;
          it reads <em>Delete 3 Pages &amp; Save PDF</em>, with the real number
          in it &mdash; so a mis-click is visible before it costs you anything,
          and <em>Cancel</em> puts you back at the start with the file cleared.
        </p>
      </section>

      {/* 3 */}
      <section id="blank-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          3. Removing Blank Pages, Duplicates and Scanner Junk
        </h3>
        <p>
          The most common reason anyone goes looking for a way to{' '}
          <strong>remove blank pages from a PDF</strong> is a document feeder.
          Scan a stack of single-sided sheets with duplex switched on and you
          get a perfect, useless empty page behind every real one. Photocopiers
          do the same thing. So do fax gateways, which add a cover sheet nobody
          wanted at the front.
        </p>
        <p>
          Worth being straight about: there is no automatic blank-page detector
          here. Auto-detection is a genuinely unreliable trick &mdash; a page
          carrying nothing but a faint scanner shadow, a page number or a
          watermark is not blank by any measurable test, yet it is exactly the
          page you meant to bin, and a detector that guesses will eventually
          throw away a page you needed. Two things make the manual route faster
          than the automatic one in practice:
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Every page is shown as a thumbnail
        </h4>
        <p>
          The grid renders a thumbnail of the whole document, scrolling on for as
          long as the document runs. An empty page is unmistakable at a glance
          &mdash; it is the white rectangle in a wall of text &mdash; and
          clicking it takes about as long as reading a checkbox would. You are
          never asked to translate a page number into a page: you scroll, you
          see the junk, you click it.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Odd and even shortcuts handle the duplex case in one click
        </h4>
        <p>
          When the blanks are the backs of single-sided sheets, they are not
          scattered &mdash; they are every second page. <strong>Mark Even
          Pages</strong> strikes 2, 4, 6 and so on across the entire document;{' '}
          <strong>Mark Odd Pages</strong> does the same for 1, 3, 5. One click
          selects them all, and you can then un-click any individual page that
          turned out to have content on it before saving. That control covers the
          usual duplex-scanner case behind{' '}
          <strong>delete every other page from a PDF</strong> searches, whatever
          the page count. Note that the two shortcuts replace your selection
          rather than adding to it, so press the one you want first and hand-pick
          afterwards.
        </p>
        <p>
          If the underlying problem is that a scan has no searchable text at all,
          trimming it will not fix that. Run it through the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free PDF OCR tool
          </Link>{' '}
          to add a real text layer first, then come back and remove the junk
          pages.
        </p>
      </section>

      {/* 4 */}
      <section id="which-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          4. Deleting the First Page, the Last Page, a Range or Every Other Page
        </h3>
        <p>
          Most page removal jobs are one of five shapes. All five are handled by
          the same grid, and knowing which one you are in saves clicking around.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600 shrink-0" /> Single-page jobs
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li><strong>Delete the first page of a PDF</strong> — cover sheets, fax headers, title slides</li>
              <li><strong>Remove the last page of a PDF</strong> — stray signature or terms page</li>
              <li>A single duplicate caused by a double feed</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500 shrink-0" /> Multi-page jobs
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li><strong>Delete a range of pages from a PDF</strong> — click each page in the block; the Remaining counter confirms the count</li>
              <li><strong>Delete multiple pages from a PDF at once</strong> — scattered pages, any order</li>
              <li><strong>Remove every other page</strong> — one odd or even click</li>
            </ul>
          </div>
        </div>
        <p>
          Ranges deserve a note. There is no &ldquo;pages 12&ndash;18&rdquo; text
          box, no shift-click and no drag across the grid: every page is its own
          click. That is a deliberate trade rather than an oversight. Typed
          ranges are where mistakes live &mdash; people count from a printed page
          number instead of a document page number, forget that the cover shifts
          everything by one, and delete the wrong seven pages. Clicking
          thumbnails removes that entire class of error, because you are looking
          at the page you are about to destroy. For a long consecutive block,
          click the first page of the block and work along it &mdash; seven pages
          means seven clicks &mdash; and the running <em>Marked to Delete</em>{' '}
          and <em>Remaining</em> counters tell you whether you have hit the right
          number before you commit. If you lose your place, <em>Clear Marks</em>{' '}
          resets the whole selection and you start the block again.
        </p>
        <p>
          One hard rule the tool will not let you break: you cannot delete every
          page, because a PDF with no pages is not a document. Mark them all and
          the delete button simply greys out and stops responding &mdash; no
          message appears, so if the button has gone dead, that is why. Un-mark
          any one page and it comes back immediately. Leave at least one page
          standing; if what you actually want is the pages rather than the
          document, that is an extraction job and section 6 points you at the
          right tool.
        </p>
      </section>

      {/* 5 */}
      <section id="quality-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. Quality, Limits and What Does Not Carry Over
        </h3>
        <p>
          People searching for how to{' '}
          <strong>remove pages from a PDF without losing quality</strong> are
          usually worried about the wrong thing. Kept pages are copied whole, so
          there is no quality question to answer: fonts, vector graphics, image
          resolution and page dimensions all survive untouched. What is worth
          knowing is the document-level things most likely to change, because the
          trimmed file is a new document assembled around the pages you kept.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Survives exactly
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Selectable, searchable text</li>
              <li>Image resolution and vector artwork</li>
              <li>Page size, orientation and rotation</li>
              <li>Reading order of the pages you keep</li>
              <li>Embedded fonts and layout</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> Worth checking afterwards
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Fillable form fields, which may stop behaving as a form</li>
              <li>Digital signatures, which any edit invalidates</li>
              <li>Bookmark and outline trees, which point at page positions</li>
              <li>Document properties such as title and author</li>
              <li>Internal cross-references to deleted pages</li>
              <li>Printed page numbers, which do not renumber themselves</li>
              <li>Encrypted files, which will not open at all</li>
            </ul>
          </div>
        </div>
        <p>
          Two of those deserve more than a bullet. An interactive PDF keeps its
          fields in a form definition that belongs to the document rather than to
          any single page, and a trimmed file is built fresh around the pages you
          kept &mdash; so a fillable form can come back with its boxes drawn but
          no longer registered as a form to type into. Open the result and click
          a field before you send it on. If the fields do need rebuilding, our{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            make PDF fillable tool
          </Link>{' '}
          will put them back. Digital signatures are simpler and stricter: any
          edit at all invalidates a signature, which is precisely what signing is
          for. Trim first, then sign, never the other way round.
        </p>
        <p>
          Encryption catches people out most often. A{' '}
          <strong>password protected PDF</strong> cannot be trimmed here &mdash;
          the document will refuse to load and you will get a notice that it
          could not be opened, rather than a silent failure. Remove the
          protection in whatever application applied it, trim the file, and if
          you want it locked again afterwards our{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>{' '}
          will put a password back on the finished document.
        </p>
        <p>
          On size: there is no file size cap and no page limit, and no daily
          allowance ticking down. One document at a time, as many documents as
          you like. A four-hundred-page file naturally takes a moment longer to
          draw all its thumbnails than a ten-page one, but nothing artificial
          stops you. A progress bar reports each stage of the save &mdash;
          opening the document, extracting the pages you kept, writing the
          revised file &mdash; and the finished panel tells you exactly how many
          pages went and how many remain, so you can check the arithmetic before
          you download.
        </p>
      </section>

      {/* 6 */}
      <section id="delete-vs-extract" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scissors className="w-6 h-6 text-orange-500 shrink-0" />
          6. Delete, Split, Extract or Reorder: Which One You Actually Want
        </h3>
        <p>
          Four different jobs get described with the same words, and picking the
          wrong tool wastes ten minutes. Here is the distinction in one line
          each.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Deleting pages</strong> keeps the document and throws away
            the pages you do not want. One file out, shorter than the one you
            put in. That is this tool.
          </li>
          <li>
            <strong>Extracting pages</strong> keeps the pages and throws away the
            document &mdash; you want chapter three as its own file and do not
            care about the rest. Use the{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages tool
            </Link>
            .
          </li>
          <li>
            <strong>Splitting</strong> cuts one document into several, all of
            them kept. The{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF splitter
            </Link>{' '}
            handles that.
          </li>
          <li>
            <strong>Reordering or rotating</strong> changes the sequence or the
            angle without losing anything. That is the{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>{' '}
            and the{' '}
            <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF rotate tool
            </Link>
            .
          </li>
        </ul>
        <p>
          One more line worth drawing, because it is a frequent misunderstanding:
          removing a page removes the entire page. It is not a way to{' '}
          <strong>delete text from a PDF page</strong> or to redact a paragraph
          while keeping the rest of the sheet. If a sensitive line sits in the
          middle of a page you need, deleting that page is the only thing this
          tool can offer, and that is usually not what you want.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Page Remover
        </h3>
        <p>
          Plenty of sites will <strong>delete PDF pages online</strong>. Most of
          them make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough that you can check every line
          yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no seven-day countdown. The tool you are using is the whole product.'],
            ['You see the page before you cut it', 'A thumbnail of every page in the document, with a clear DELETE or KEEP label on each. No typing page numbers and hoping.'],
            ['No watermark on the output', 'Your trimmed PDF comes out clean. Nothing is stamped across it and nothing is appended to the last page.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['No size cap and no daily limit', 'Trim a two-page memo or a four-hundred-page manual, as often as you like. There is no tier above this one to upsell you to.'],
            ['Odd and even in one click', 'The duplex-scanner problem — an empty page behind every real one — is a single control rather than two hundred clicks.'],
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
          built on the same terms, so once the junk pages are gone you can{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          the trimmed file with another one, or{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress it
          </Link>{' '}
          to get under an email limit, without paying for any of it.
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
              'How do I delete pages from a PDF for free without software?',
              'Open the page remover at the top of this page, drop your PDF in, click the thumbnails of the pages you do not want, and download the result. There is nothing to install, no account to create and no watermark on the file you get back. It is free every time, not free for the first three documents.',
            ],
            [
              'Can I remove blank pages from a PDF automatically?',
              'Not automatically, and that is on purpose — a page holding only a page number or a faint scanner shadow is not technically blank, so an automatic detector would eventually bin something you needed. Instead, every page is shown as a thumbnail so blanks are obvious on sight, and if they came from a duplex scanner the Mark Even Pages control selects all of them in one click.',
            ],
            [
              'How do I delete a range of pages, such as 12 to 18?',
              'Click each page in the block. There is no range box and no shift-click shortcut: pages 12 to 18 means seven clicks on seven thumbnails. It sounds slower than typing a range and in practice it is safer, because the Marked to Delete and Remaining counters let you confirm the count before you save, and you are looking at each page as you strike it rather than trusting a number.',
            ],
            [
              'Will deleting pages reduce the quality of my PDF?',
              'No. The pages you keep are copied across whole, so text stays selectable, images keep their original resolution and the layout is unchanged. The file usually gets smaller simply because it contains fewer pages, not because anything was compressed.',
            ],
            [
              'Can I trim a fillable form or a signed PDF?',
              'You can trim it, but check the result. The trimmed file is a new document built around the pages you kept, so an interactive form can come back with its fields no longer working as a form, and a digital signature will be invalidated because any edit to a signed PDF invalidates it. For forms, rebuild the fields with our make PDF fillable tool; for signatures, trim first and sign afterwards.',
            ],
            [
              'Can I delete pages from a password protected PDF?',
              'No. An encrypted document will not open, and you will get a notice that the document could not be opened rather than a silent failure. Remove the password in the application that set it, trim the file here, then re-apply protection with our PDF protect tool if you still need it locked.',
            ],
            [
              'What happens if I try to delete every page?',
              'The delete button simply greys out and stops responding once every page is marked, because a PDF has to contain at least one page to be a valid document. No message is shown — the button just goes dead. Un-mark any one page and it comes back, and the rest saves normally.',
            ],
            [
              'Is my document safe when I remove pages from it?',
              'Your files are never stored on our servers, never retained after your session, and never used for training or analytics. Nothing you trim is kept, queued or logged.',
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
          Need something else from the same document? Use the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          to reorder what is left, the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages tool
          </Link>{' '}
          to pull a chapter out as its own file, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to turn the surviving pages into images, or the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          if you need to edit the text. If you would rather understand how
          document processing works than simply use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the file and document APIs behind tools like this one.
        </p>
      </div>
    </article>
  );
}
