import React from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListOrdered,
  Lock,
  Scissors,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Splitter tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with lucide icons, benefit grid, FAQ, closing link
 * block. If you edit this, keep that rhythm — the tool pages are meant to read
 * as one series.
 *
 * Five decisions drove the copy, and all five are about not overpromising.
 *
 * 1. The splitter has exactly three modes: every page, every N pages, and
 *    comma-separated custom ranges. It has no other axis. So "split pdf by
 *    bookmarks", "split pdf by chapter", "split pdf by file size (MB)" and
 *    "split pdf by content / text" are all searched for and all DECLINED here.
 *    Section 5 answers the intent behind them honestly — you can get the same
 *    result with a range list once you know the page numbers — instead of
 *    claiming a feature that does not exist and collecting complaints.
 *
 * 2. The output is always a .zip archive, even for a single range. That is a
 *    real friction point and "split pdf without zip" is a live query, so
 *    section 5 states it up front rather than letting people discover it at
 *    the download button. Being straight about it costs a bounce and saves a
 *    support email.
 *
 * 3. Encrypted PDFs are refused with a plain message — the tool cannot and does
 *    not unlock anything. Section 7 says so, and points at the protect tool for
 *    the opposite job rather than implying a password remover exists here.
 *
 * 4. splitPdf builds each output with PDFDocument.create() + copyPages(), which
 *    carries the page tree and nothing else. Bookmarks/outline, AcroForm field
 *    definitions and source metadata do NOT survive into the pieces. Sections 1
 *    and 5 say so plainly, because a reader who splits a fillable form and
 *    discovers dead fields afterwards is a complaint we chose to pre-empt.
 *
 * 5. There is no mid-run cancel in the UI: while status === 'splitting' the
 *    panel renders a progress bar and no controls at all. Nothing in this file
 *    may promise stopping a run until such a button ships. Section 7 turns that
 *    into useful advice — check your ranges before starting a long job.
 *
 * Privacy is sold strictly as an outcome: files are not stored, not retained,
 * not used for training. The mechanism is deliberately absent from this file.
 */
export default function PdfSplitterSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Split a PDF</span> into Multiple Files: The Complete Guide
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        One file, two hundred pages, and the only part anybody needs is chapter
        four. That is the situation almost everyone is in when they go looking
        for a way to <strong>split a PDF</strong>. Whether you need to{' '}
        <strong>separate PDF pages into individual files</strong>, cut a long
        scan into manageable chunks, or pull a single invoice out of a merged
        batch, the job is the same: one document in, several smaller documents
        out. This guide covers how to <strong>split PDF pages online free</strong>,
        which of the three modes fits your file, the exact range syntax that
        works, what carries across into the pieces and what does not, and the
        handful of things a splitter honestly cannot do.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-splitter.webp"
            alt="Split a PDF online free - one large PDF document divided into several smaller separate PDF files"
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
              One long document in, a folder of clean smaller PDFs out — page by
              page, in fixed chunks, or by the exact ranges you name.
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
            ['#what-splitting-is', '1. What Splitting a PDF Actually Does'],
            ['#how-to-split', '2. How to Split a PDF Online Free'],
            ['#split-modes', '3. The Three Split Modes, and When to Use Each'],
            ['#page-ranges', '4. How to Split a PDF by Page Range'],
            ['#zip-output', '5. What You Get Back, and What Splitting Cannot Do'],
            ['#split-vs-extract', '6. Split, Extract or Delete? Choosing the Right Tool'],
            ['#edge-cases', '7. Locked, Scanned and Very Large PDFs'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF Splitter'],
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
      <section id="what-splitting-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Splitting a PDF Actually Does
        </h3>
        <p>
          A PDF is a container. Under the{' '}
          <a
            href="https://www.iso.org/standard/51502.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-1 specification
          </a>
          , the file holds a catalogue of page objects along with the fonts,
          images and resources those pages point at. Pages are not glued
          together in sequence the way a printed book is bound; they are entries
          in a list.
        </p>
        <p>
          That is why you can <strong>split PDF into separate files</strong>{' '}
          without any loss of quality at all. Nothing is re-rendered, re-encoded
          or squashed. Each output document is built fresh and the pages you
          selected are copied into it whole, carrying their text, vectors and
          images exactly as they were. A 12&nbsp;MB report cut into twelve
          single-page files gives you twelve pages that look identical to the
          originals, because the page content <em>is</em> the original page
          content.
        </p>
        <p>
          What travels is the page and everything drawn on it. What does not
          travel is the document-level furniture wrapped around those pages. A
          bookmark or outline tree, the field definitions that make a form
          fillable, and the source file&rsquo;s own metadata are not copied into
          the smaller documents. In practice that means a bookmarked manual
          splits cleanly but the pieces open without a bookmark panel, and a
          fillable form splits into pages that still look right but no longer
          behave as fields. If the interactivity is the point, split a copy,
          keep the full file as your master, and rebuild the inputs on the piece
          you need with the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            fillable PDF tool
          </Link>
          .
        </p>
        <p>
          It is also worth being clear that splitting never touches your source.
          The PDF you selected is read, not rewritten, so the complete original
          document survives the split exactly as it was &mdash; which is what
          makes the &ldquo;split a copy, keep the master&rdquo; habit costless.
          If you wanted the opposite &mdash; one long file rather than several
          short ones &mdash; the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          runs this process in reverse.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-split" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Split a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>split a PDF online free</strong> with the tool above, there
          are three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your PDF', 'Drop a .pdf onto the panel above or click to browse. The document is read straight away and the total page count appears next to the filename, so you know exactly what you are working with before choosing anything.'],
            ['Choose a split mode', 'Pick every page, every N pages, or your own list of page ranges. The Every Page card tells you how many single-page files it will produce, and the range box arrives pre-filled with a working example sized to your document.'],
            ['Download the results', 'Press Split PDF. The progress readout names each document as it is built — "Creating split document 3 of 12 (pages 5-8)" — and when the run finishes, one button hands you everything as a single archive.'],
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
          That is the entire flow. There is no page limit, no file size ceiling
          and no watermark stamped across the output &mdash; the usual catch
          with a free tier elsewhere. Every split document comes out clean. The
          one thing worth doing before you press the button is reading your
          ranges back to yourself, because a run goes through to the end once it
          starts; if you mistype a boundary, the fix is to split again rather
          than to interrupt.
        </p>
      </section>

      {/* 3 */}
      <section id="split-modes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scissors className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Three Split Modes, and When to Use Each
        </h3>
        <p>
          Most people arrive knowing the outcome they want but not the word for
          it. Here is how the three modes map onto the jobs people actually
          describe.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Every Page', 'Turns an N-page document into N single-page PDFs. This is the one you want when you need to separate PDF pages into individual files — a batch of scanned certificates, a run of invoices, or a set of forms that each need to go to a different person.'],
            ['Every N Pages', 'Cuts the document into equal chunks of the size you type: every 2 pages, every 10, every 50. Ideal for double-sided scans, statement bundles where each record is a fixed number of pages, or breaking a huge manual into email-sized pieces. The last chunk simply holds whatever is left over.'],
            ['Custom Ranges', 'You name the exact pages. Type something like 1-3, 5, 7-10 and you get three documents back. This is the mode for splitting a PDF in half, pulling one chapter out, or carving a report into its real sections rather than arbitrary ones.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          A common question is how to <strong>split a PDF in half</strong>. There
          are two clean ways: set custom ranges to something like{' '}
          <code>1-20, 21-40</code> for a forty-page file, or use every N pages
          with N set to half the total. Both produce two documents; the range
          version is safer if the halves are not exactly even. Every N pages
          always starts counting from page one, so an odd total leaves a short
          final chunk rather than an error &mdash; a 41-page file split every 20
          gives you 1&ndash;20, 21&ndash;40 and a one-page tail.
        </p>
      </section>

      {/* 4 */}
      <section id="page-ranges" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Split a PDF by Page Range
        </h3>
        <p>
          Custom ranges are the most powerful mode and the one worth learning
          properly, because it is how you <strong>split PDF by page number</strong>{' '}
          with real precision. The syntax is deliberately small.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A hyphen makes a span.</strong> <code>4-9</code> produces one
            document containing pages four through nine inclusive.
          </li>
          <li>
            <strong>A bare number makes a single-page document.</strong>{' '}
            <code>12</code> gives you page twelve on its own.
          </li>
          <li>
            <strong>Commas separate the outputs.</strong> Each comma-separated
            entry becomes its own file, so <code>1-3, 5, 7-10</code> returns
            three documents, not one combined extract.
          </li>
          <li>
            <strong>Order is yours to set.</strong> The entries are processed in
            the order you type them, so you control which output is first.
          </li>
          <li>
            <strong>A repeated entry does not give you two copies.</strong> Each
            output is named after the pages it holds, so{' '}
            <code>1-3, 1-3</code> resolves to a single{' '}
            <code>report-pages-1-3.pdf</code> inside the archive &mdash;
            identical entries share a filename. If you genuinely want the same
            pages twice, save the archive and duplicate the file yourself.
          </li>
          <li>
            <strong>A span has to run forwards.</strong> <code>9-4</code> is
            rejected rather than silently reversed; write <code>4-9</code> and
            reorder the finished documents afterwards if you need them the other
            way round.
          </li>
        </ul>
        <p>
          Page numbers are counted from one and refer to the physical sheets in
          the file, not to any printed number in the footer &mdash; a report
          whose body starts at &ldquo;page 1&rdquo; after four sheets of front
          matter is page five here. If you name a page the document does not
          have, the tool refuses the range and tells you how many pages it
          actually has rather than quietly producing something wrong. It does the
          same for anything it cannot parse, with an example of the correct
          format. Nothing is created until the whole list validates, so a typo in
          the fourth entry costs you a retype, not a bad archive.
        </p>
      </section>

      {/* 5 */}
      <section id="zip-output" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Archive className="w-6 h-6 text-orange-500 shrink-0" />
          5. What You Get Back, and What Splitting Cannot Do
        </h3>
        <p>
          Splitting produces several files, so the download arrives as a single{' '}
          <strong>.zip archive</strong> rather than fourteen separate save
          prompts in a row. Inside it, every document is named after your
          original with the pages appended &mdash;{' '}
          <code>report-page-7.pdf</code> for a single page,{' '}
          <code>report-pages-1-3.pdf</code> for a span &mdash; so a folder of
          extracts is still readable a month later. Windows, macOS, Android and
          iOS all open zip archives without extra software.
        </p>
        <p>
          One thing to set expectations on: the archive is used even when you
          asked for a single range, so if you specifically wanted a{' '}
          <strong>PDF split without zip</strong>, you will still unzip one file.
          It is a small step and it keeps the output predictable.
        </p>
        <p>Being straight about the limits, because these are all real searches:</p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> This tool does
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Split every page into its own PDF</li>
              <li>Split into fixed chunks of any size</li>
              <li>Split by custom page ranges</li>
              <li>Carry page content across untouched</li>
              <li>Name each output by its page numbers</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> This tool does not
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Split by bookmark or chapter automatically</li>
              <li>Carry bookmarks, form fields or metadata into the outputs</li>
              <li>Split by target file size in MB</li>
              <li>Split on matching text or a keyword</li>
              <li>Open password-protected documents</li>
              <li>Reorder pages inside an output file</li>
            </ul>
          </div>
        </div>
        <p>
          The second line in that right-hand column is the one people are most
          often surprised by, so it is worth repeating in full: page content
          &mdash; text, vectors and images &mdash; is carried across untouched,
          but document-level extras do not survive the split. The outline tree
          that draws a bookmark panel, the field definitions behind a fillable
          form, and the title, author and keyword metadata attached to the source
          file are not copied into the smaller documents. Nothing is damaged;
          those things simply live at the document level rather than on any
          particular page, and each piece is a new document.
        </p>
        <p>
          If you came looking to <strong>split a PDF by chapter</strong>, the
          practical route is to open the document, note the page each chapter
          begins on, and type those boundaries as custom ranges. It takes a
          minute and gives you cleaner results than automatic detection usually
          does, because you decide where a section really starts &mdash; and
          since a bookmark panel would not have survived into the pieces anyway,
          reading the boundaries off it once is the whole cost.
        </p>
      </section>

      {/* 6 */}
      <section id="split-vs-extract" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. Split, Extract or Delete? Choosing the Right Tool
        </h3>
        <p>
          Three different jobs get described with the same words, and picking the
          wrong one wastes a download. Here is the distinction in one line each.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Split</strong> when you want several documents out of one.
            That is this page.
          </li>
          <li>
            <strong>Extract</strong> when you want one new document containing a
            selection of pages, kept together. Use the{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages tool
            </Link>{' '}
            &mdash; it is the right answer to &ldquo;I need pages 3, 8 and 15 in
            one file&rdquo;.
          </li>
          <li>
            <strong>Delete</strong> when you want the same document minus a few
            pages. The{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF page remover
            </Link>{' '}
            handles that in one pass.
          </li>
          <li>
            <strong>Reorder or rotate</strong> when the pages are right but the
            sequence is not. The{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>{' '}
            and the{' '}
            <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
              rotate tool
            </Link>{' '}
            cover those.
          </li>
        </ul>
        <p>
          A useful pattern: split a long document here, work on the piece you
          care about, then merge the finished parts back together. Page-by-page
          work such as OCR or compression finishes sooner on a ten-page piece
          than on a four-hundred-page file, simply because there is less to go
          through &mdash; and if a step goes wrong, you redo one section instead
          of the whole manual.
        </p>
      </section>

      {/* 7 */}
      <section id="edge-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500 shrink-0" />
          7. Locked, Scanned and Very Large PDFs
        </h3>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Password-protected documents
        </h4>
        <p>
          An encrypted PDF cannot be split until it is unlocked, and the tool
          will say so in plain words rather than failing mysteriously. Open the
          file in your usual reader with the password, save an unprotected copy,
          and split that. Once your smaller documents exist you can put
          protection back on any of them with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password tool
          </Link>
          .
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Scanned documents
        </h4>
        <p>
          Scans split perfectly well &mdash; a page is a page whether it holds
          text or a photograph of text. What you will not get is searchable
          output, because there was nothing searchable to begin with. If you need
          to find things in the pieces afterwards, run them through the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          to add a real text layer.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Large and very long files
        </h4>
        <p>
          There is no size cap and no page cap. Very long documents take
          proportionally longer &mdash; a <strong>large PDF split</strong> of
          several hundred pages is several hundred documents to build, one after
          another &mdash; and the progress readout names each one as it goes, so
          you can see the run moving rather than guessing. Two practical notes
          for a job that size: a run continues to the end once it has started, so
          check your mode and your ranges before pressing the button, and it is
          worth leaving the page alone until the archive is ready. If the
          resulting pieces are still too large to email, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          is the next step.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF Splitter
        </h3>
        <p>
          Plenty of sites will <strong>split PDF files</strong>. Most make it
          deliberately irritating until you pay. Here is what is different,
          stated plainly enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, every time', 'No account, no email address, no card and no trial that expires on Friday. The tool above is the whole product.'],
            ['No file size or page limit', 'Split a four-page memo or a six-hundred-page manual. There is no premium tier waiting above this one.'],
            ['No watermark on any output', 'Every split document comes out clean. Nothing is stamped across the pages and nothing is appended at the end.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Page quality is untouched', 'Pages are copied, not re-rendered, so each smaller PDF is visually identical to the source. Document-level extras such as bookmarks and form fields do not carry over.'],
            ['Sensible filenames', 'Outputs are named after your document and the pages they contain, so the archive still makes sense weeks later.'],
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
          built on exactly the same terms, so nothing you start here ends at a
          paywall halfway through.
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
              'How do I split a PDF into multiple files for free?',
              'Open the splitter at the top of this page, select your PDF, choose every page, every N pages or custom ranges, and download the results. There is no sign-up, no watermark and no limit on how often you do it.',
            ],
            [
              'How do I split a PDF into separate pages?',
              'Choose the Every Page mode. A forty-page document becomes forty single-page PDFs, each named after the original file plus its page number, delivered together in one archive.',
            ],
            [
              'Can I split a PDF by a specific page range?',
              'Yes. Pick Custom Ranges and type something like 1-3, 5, 7-10. Each comma-separated entry becomes its own document, so that example returns three files. Identical entries share a filename, so repeating the same range does not produce a second copy. Out-of-range page numbers are refused with a message telling you how many pages the document actually has.',
            ],
            [
              'Do bookmarks and form fields survive the split?',
              'No. Page content is carried across untouched, but bookmarks, the outline tree, fillable form fields and the source file’s metadata are not copied into the smaller documents. Keep the full original as your master if you need any of them, and rebuild inputs on a piece with the fillable PDF tool.',
            ],
            [
              'Why do my split files download as a zip?',
              'Splitting produces several documents, and a single archive is the reliable way to hand them all over at once. Every phone, tablet and desktop opens zip files without extra software, and the PDFs inside are ordinary PDFs.',
            ],
            [
              'Does splitting reduce the quality of my PDF?',
              'No. Pages are copied into the new documents rather than re-rendered or re-compressed, so text stays sharp and images stay exactly as they were. Your original file is not modified either.',
            ],
            [
              'Is there a limit on how big the PDF can be?',
              'There is no size cap and no page cap. A longer document simply takes proportionally longer, and the progress readout names each split document as it is built. A run carries on to the end once it starts, so it is worth checking your ranges before you begin a very long job.',
            ],
            [
              'Is it safe to split confidential documents here?',
              'Your files are not stored on our servers, not retained after your session, and never used for training or analytics. Nothing you split is kept, queued or logged.',
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
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          to put the pieces back together, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to turn a page into an image, or the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          to make a section editable. If you would rather build tools like these
          than simply use them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how document tools like this one are designed and built.
        </p>
      </div>
    </article>
  );
}
