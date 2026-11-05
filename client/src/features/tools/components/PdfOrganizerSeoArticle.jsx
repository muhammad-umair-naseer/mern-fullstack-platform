import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Check,
  ClipboardList,
  Copy,
  HelpCircle,
  Layers,
  LayoutGrid,
  RotateCw,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Organizer tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with icons, benefit grid, FAQ, closing link block.
 *
 * Four decisions shaped the copy, and they matter if anyone edits this later.
 *
 * First, the primary keyword is "organize PDF pages" because it matches the
 * tool name and the slug, but the phrases people actually type are "reorder",
 * "rearrange" and "change page order". Those run through the H3s and the FAQ
 * as first-class terms rather than as afterthoughts.
 *
 * Second, keywords declined. "Drag and drop pdf pages to reorder" is a big
 * phrase and the tool does NOT do it — pages move one position at a time with
 * left/right buttons, and only the file itself can be dropped. Section 3 says
 * so plainly instead of promising a gesture that does not exist. Also declined:
 * merging two PDFs, splitting into separate files, inserting blank pages,
 * adding page numbers, editing text, multi-page block moves, and opening
 * password-protected files. Section 7 answers the intent behind each and points
 * at the right tool. A page that answers honestly outranks one that lies, and
 * it generates no complaints.
 *
 * Third, two capability claims were removed after a source read and must not
 * come back. (a) The thumbnail is NOT a preview of the saved rotation:
 * renderOrganizerThumbnail passes the user's rotation straight into
 * page.getViewport({ scale, rotation }), and in pdfjs-dist that REPLACES the
 * page's intrinsic /Rotate, while saveOrganizedPdf ADDS the user's rotation to
 * the stored one. For a page that arrived already rotated the two disagree, so
 * no sentence here promises the grid confirms the finished orientation — the
 * article tells the reader to check the saved file instead. Fix the render call
 * to pass `page.rotate + rotation` and the promise can come back. (b) The OCR
 * tool returns a plain-text file, not a searchable PDF — pdfOcr.js returns
 * { combinedText, pages, pageCount } and PdfOcr.js downloads it as a .txt. No
 * wording here may suggest the scan itself becomes selectable.
 *
 * Fourth, privacy is sold strictly as an outcome — files are not stored, not
 * queued, not retained, not used for training. The mechanism is deliberately
 * absent from every line of this file, and so is any reference to where the
 * user's original copy physically sits.
 *
 * Internal links: /tools is deliberate and approved for these articles — the
 * route exists (App.js) and is on the linkable list — alongside /tools/<slug>
 * and /learn/<slug>. Nothing else is linked internally.
 */
export default function PdfOrganizerSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab &bull; 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Organize PDF Pages</span>: Reorder, Rotate, Duplicate and Delete
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A PDF almost never arrives in the order you need it. The scanner fed the
        stack backwards, the appendix ended up ahead of the summary, one page
        came out sideways, and there are two blank sheets in the middle. None of
        that is a content problem &mdash; it is a page problem. This guide covers
        how to <strong>organize PDF pages</strong> properly: how to{' '}
        <strong>reorder PDF pages</strong>, spin a single sheet the right way up,
        copy a page you need twice, and drop the ones you do not need &mdash;
        then save a clean document. Free, with no account and no watermark.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-organizer.webp"
            alt="A hand arranging blank sticky notes into a neat grid on a grey wall"
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
              Every page as a thumbnail: move it, turn it, copy it or remove it,
              then save the document back out in your order.
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
            ['#what-it-does', '1. What It Means to Organize PDF Pages'],
            ['#how-to', '2. How to Rearrange Pages in a PDF, Step by Step'],
            ['#reorder', '3. Reordering: Moving a Page to Where It Belongs'],
            ['#rotate', '4. Rotating a Single Page That Came Out Sideways'],
            ['#duplicate-delete', '5. Duplicating and Deleting Pages'],
            ['#real-jobs', '6. Six Real Jobs This Tool Fixes'],
            ['#limits', '7. What This Tool Will Not Do (And Where to Go)'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF Page Organizer'],
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
          <LayoutGrid className="w-6 h-6 text-orange-500 shrink-0" />
          1. What It Means to Organize PDF Pages
        </h3>
        <p>
          There are two completely different kinds of PDF editing, and confusing
          them is why so many people give up. One is content editing: changing a
          word, moving a logo, retyping a figure. The other is page editing:
          treating each page as a card in a deck and dealing the deck again. A{' '}
          <strong>PDF page organizer</strong> does the second kind, and the second
          kind is what most people actually need.
        </p>
        <p>
          It works because of how the format is built. Under the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 specification that defines PDF
          </a>
          , a document is a numbered sequence of independent page objects. Page
          four does not know it is page four; it simply sits fourth in a list. So{' '}
          <strong>changing the page order in a PDF</strong> is not a rewrite, it
          is a re-listing, and nothing inside any page is touched or degraded in
          the process.
        </p>
        <p>The tool above gives you four page-level operations:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Move</strong> &mdash; shift any page one position earlier or
            later, as many times as it takes, until the running order is the one
            you want.
          </li>
          <li>
            <strong>Rotate</strong> &mdash; turn one individual page ninety
            degrees at a time without touching its neighbours.
          </li>
          <li>
            <strong>Duplicate</strong> &mdash; drop a second identical copy of a
            page directly after the original.
          </li>
          <li>
            <strong>Delete</strong> &mdash; remove a page from the output
            entirely.
          </li>
        </ul>
        <p>
          When you save, a fresh PDF is assembled from your arrangement and is
          ready to download as{' '}
          <code className="text-sm">yourfile-organized.pdf</code> &mdash; a
          success panel appears with the new file name and its size, and the file
          reaches you when you press the download button. Your original file is
          left exactly as it was; the organizer only ever writes a separate copy.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Rearrange Pages in a PDF, Step by Step
        </h3>
        <p>
          No sign-up, no email, no trial counter. To{' '}
          <strong>rearrange pages in a PDF online free</strong> with the tool at
          the top of this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Open your document', 'Drop a .pdf onto the panel or click to browse for one. Anything that is not a PDF is refused with a plain message rather than a silent failure, and the file name and size appear once it loads.'],
            ['Arrange the grid', 'Every page appears as a numbered thumbnail. Move, rotate, copy or remove pages in any combination. The counter at the top shows exactly how many pages the finished document will contain.'],
            ['Save and download', 'Press save. A progress readout names the page being written as it goes, then your organized PDF is ready to download with the new page order baked in.'],
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
          Nothing is committed until you press save, so you can experiment freely
          &mdash; and if you make a mess of it, cancel and load the file again to
          start from a clean deck. There is no queue, no daily cap and no
          watermark stamped across the result, which is the usual catch when you{' '}
          <strong>organize PDF pages online free</strong> elsewhere.
        </p>
      </section>

      {/* 3 */}
      <section id="reorder" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-orange-500 shrink-0" />
          3. Reordering: How to Move a Page to Where It Belongs
        </h3>
        <p>
          Each thumbnail carries a left arrow and a right arrow. Left swaps the
          page with the one before it, right swaps it with the one after, and the
          numbers on every card update immediately so you are always looking at
          the real running order rather than a plan of it. The arrows switch
          themselves off at the ends, because the first page cannot move earlier
          and the last cannot move later.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Why the arrows and not a drag gesture
        </h4>
        <p>
          Worth being straight about, since it is the first thing people look for:
          you <em>drop the file</em> onto the tool, but you do not drag the
          thumbnails around. Pages move one step at a time, by button. It is a
          deliberate trade &mdash; a tap is precise on a phone screen and never
          drops a page into the wrong slot, where a drag on a five-across grid
          frequently does. Moving a page from position twelve to position two is
          ten taps, and the thumbnail travels with your clicks so you can see it
          arriving.
        </p>
        <p>
          That arithmetic is worth knowing before you start, because it decides
          the best route through a big job. Nudging one page a few slots is
          trivial. Rebuilding the order of a long document one swap at a time is
          not, and the honest advice is to shorten the document first.
        </p>
        <p>
          For the most common <strong>reorder PDF pages</strong> job of all
          &mdash; a stack fed into a scanner the wrong way up, so the document
          runs from the last sheet to the first &mdash; work from the front:
          walk the final page to the start, then the next one, and the reversal
          unwinds itself. Be realistic about the size of that job, though: since
          each tap moves a page a single position, fully reversing a long scan is
          a great many taps, and it grows sharply with the page count. If the
          document is more than a handful of pages, it is usually faster to pull
          out the section you actually need with the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page extractor
          </Link>{' '}
          first and organize the short version, or to feed the stack back through
          the scanner the right way round and organize what comes out.
        </p>
      </section>

      {/* 4 */}
      <section id="rotate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCw className="w-6 h-6 text-orange-500 shrink-0" />
          4. Rotating a Single Page That Came Out Sideways
        </h3>
        <p>
          One landscape chart in a portrait report. A phone photo of a receipt
          that insists on lying on its side. A page the feeder grabbed at an
          angle. These are the cases where whole-document rotation is useless,
          because turning every page to fix one leaves you with thirty broken
          ones.
        </p>
        <p>
          The rotate button on each thumbnail turns <em>that page only</em>, by
          ninety degrees clockwise per tap. Tap twice for a hundred and eighty to
          fix an upside-down sheet, three times for the counter-clockwise
          quarter turn, four times to land back where you started. The turn you
          ask for is applied on top of whatever orientation the page was already
          stored with, so a page that was authored as landscape keeps its
          landscape base and your quarter turn is added to it rather than
          replacing it.
        </p>
        <p>
          One practical note, because it saves a wasted save. The grid thumbnail
          is there to tell you <em>which</em> page you are working on and how many
          turns you have asked for &mdash; treat it as a handle on the page, not
          as a proof sheet of the finished document. If a page arrived with an
          orientation already baked into it, the surest check is the saved file
          itself: press save, open the downloaded PDF, and confirm the page reads
          the right way up. If it does not, load the file back into the organizer
          and add the remaining quarter turns &mdash; the operation is loss-free,
          so there is no penalty for a second pass.
        </p>
        <p>
          This is the honest answer to <strong>how to rotate one page in a PDF</strong>{' '}
          without a paid editor: per-page, permanent, and saved into the file
          rather than being a temporary view setting that reverts the moment
          somebody else opens the document. If instead you want every page in the
          file turned the same way, the dedicated{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          does the whole document in one action.
        </p>
      </section>

      {/* 5 */}
      <section id="duplicate-delete" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Copy className="w-6 h-6 text-orange-500 shrink-0" />
          5. Duplicating and Deleting Pages
        </h3>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">
          Duplicating a page
        </h4>
        <p>
          The copy button places a second identical copy of a page immediately
          after the original, and the page counter goes up by one. It is the
          quickest way to repeat a signature sheet for a second signatory, put a
          terms page after every section of a proposal, or produce two of the
          same ticket in one file for printing. The copy inherits the rotation
          the page had at the moment you made it, and from then on the two are
          independent &mdash; rotate or move one and the other stays put. You can
          duplicate the same page as many times as the job needs.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Deleting a page
        </h4>
        <p>
          The bin icon removes a page from the output. This is how you{' '}
          <strong>delete pages from a PDF</strong> when a scanner has fed in
          blank backs of double-sided sheets, when a fax cover page is riding
          along at the front, or when an internal comments page must not go to
          the client. There is one deliberate guard rail: the last remaining page
          cannot be deleted, and the tool tells you so, because a PDF with zero
          pages is not a valid document and no reader would open it.
        </p>
        <p>
          Remember that deleting only affects the new file you are about to save.
          Your original is untouched. If removing pages is the entire job and you
          have no reordering to do, the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          is the faster route, and the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          is better still when you want the removed pages kept as a separate
          document rather than thrown away.
        </p>
      </section>

      {/* 6 */}
      <section id="real-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-orange-500 shrink-0" />
          6. Six Real Jobs This Tool Fixes
        </h3>
        <p>
          Most people arrive here describing a symptom rather than naming a tool.
          These are the six that come up again and again. The small ones &mdash;
          turning a single sideways page, dropping a blank sheet, copying a
          signature page &mdash; really are a few taps and a save. The big ones,
          like reversing a whole scan, are the same few taps repeated a great many
          times, because every move is one position; plan those the way section 3
          suggests rather than expecting a single button.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['The scan came out backwards', 'A stack fed face-up runs from the last page to the first. Walk pages forward from the end until the order reads correctly, then save. Expect a lot of taps on a long document — shortening it first is usually quicker.'],
            ['One page is on its side', 'A landscape table or a phone-camera page sits sideways. Rotate that single page, then check the saved file, and leave every other page alone.'],
            ['Blank sheets in the middle', 'Double-sided scanning captures the empty backs. Delete each blank thumbnail and the page count drops as you go.'],
            ['The appendix is in the wrong place', 'Annexes landed ahead of the summary. Walk each annex page to the end one position at a time — or pull the body pages out with the page extractor first if the annex is long.'],
            ['A page needs to appear twice', 'Signature sheets, terms pages and duplicate tickets. Copy the page and the second one lands directly behind the first.'],
            ['A tender pack in a fixed order', 'Bid documents must follow a numbered checklist. Arrange the grid to match the checklist and save it once, correctly.'],
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
          All six start the same way and finish the same way, which is the point
          of a visual grid: you are not typing page ranges into a box and hoping,
          you are looking at the document and fixing what is wrong.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Will Not Do (And Where to Go Instead)
        </h3>
        <p>
          Knowing the edges saves you ten minutes of poking at buttons that are
          not there. This is a page organizer, not a general PDF editor.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>It works on one document at a time.</strong> To pull pages
            from two files into one running order, join them first with the{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF merger
            </Link>
            , then organize the combined file here.
          </li>
          <li>
            <strong>It does not split one PDF into several files.</strong> It
            always saves a single document. Use the{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              splitter
            </Link>{' '}
            for that.
          </li>
          <li>
            <strong>It does not edit what is printed on a page.</strong> No text
            changes, no inserted blank pages, no added page numbers or stamped
            headers. Pages move as whole units.
          </li>
          <li>
            <strong>It moves one page at a time.</strong> There is no
            multi-select and no way to grab a block of pages and slide it
            somewhere else in one go. Each card has its own move, rotate,
            duplicate and delete buttons, and each move is a single position.
          </li>
          <li>
            <strong>It cannot open a password-protected file.</strong> If the
            document is encrypted the tool reports that it cannot open the file
            and nothing is loaded into the grid. Remove the restriction with the
            owner password first &mdash; and if you need to <em>add</em>{' '}
            protection to the finished file, the{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF protect tool
            </Link>{' '}
            does that after you save.
          </li>
          <li>
            <strong>Bookmarks may not survive.</strong> The output is assembled
            fresh from your arrangement, so a document outline built for the old
            page order is not carried across. Page content, orientation and
            quality are preserved exactly.
          </li>
        </ul>
        <p>
          One more honest note: the pages themselves are copied, not re-encoded,
          so image quality never drops. If the saved file is still too large for
          a mail server, run it through the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          afterwards. And if the document is a scan whose text you cannot select,
          the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            OCR tool
          </Link>{' '}
          reads the text off the scanned pages and hands you a plain-text file of
          what it found, page by page, which you can copy out or download as a
          .txt. It is the right answer when you need the words &mdash; to search
          them, quote them or paste them into a report. It does not change the
          PDF itself: your scan comes back from the organizer as the same picture
          of a page it always was, in the order you put it in.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF Page Organizer
        </h3>
        <p>
          Plenty of sites will let you <strong>move pages in a PDF</strong>. Most
          of them make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email address, no card and no seven-day countdown. The tool on this page is the whole product.'],
            ['No watermark on the output', 'Your organized PDF comes out clean. Nothing is stamped across the pages and nothing is appended at the end.'],
            ['Every page as a real thumbnail', 'You work from pictures of your pages with live numbering, not from a page-range box you have to guess at.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['No size or page limits', 'Organize a three-page letter or a three-hundred-page manual. There is no tier above this one to upsell you to.'],
            ['Four operations in one pass', 'Reorder, rotate, duplicate and delete in a single sitting, then save once — instead of running four separate tools.'],
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
          built on the same terms, so the finished file can be merged, protected,
          compressed or converted next without paying for any of it.
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
              'How do I organize PDF pages for free without a paid PDF editor?',
              'Open the organizer at the top of this page and load your PDF. Every page appears as a thumbnail you can move, rotate, copy or delete, and saving gives you a new document in your chosen order. There is no sign-up, no watermark and no trial period, so no paid editor is involved at any point.',
            ],
            [
              'Can I drag and drop the thumbnails to reorder them?',
              'You drag and drop the file itself onto the tool, but pages are reordered with the left and right arrow buttons on each thumbnail rather than by dragging them around the grid. Each tap moves a page one position and the numbering updates instantly, which is more precise on a phone and never drops a page in the wrong place.',
            ],
            [
              'My scanned document is in reverse order. How do I fix it?',
              'Load it into the organizer and walk the last page forward to the front, then the next one, and so on. The thumbnails renumber as you go so you can see the order correcting itself. Since each tap moves a page a single position, a full reversal is a lot of taps on a long file — for anything beyond a handful of pages it is quicker to re-scan the stack the right way round, or to extract the section you actually need first and organize that.',
            ],
            [
              'Can I rotate just one page instead of the whole document?',
              'Yes. The rotate button on a thumbnail turns that page only, ninety degrees clockwise per tap, and the turn is added on top of the orientation the page was already stored with. Every other page is left exactly as it was. Open the saved PDF once to confirm the page reads the right way up, and add another quarter turn in a second pass if it needs one. To turn an entire document instead, use the dedicated PDF rotate tool.',
            ],
            [
              'Does reordering pages reduce the quality of my PDF?',
              'No. Pages are copied into the new document as they are, not re-rendered or re-compressed, so text stays sharp and images keep their original quality. The file size of the result tracks the pages you kept, since deleted pages are simply not carried over.',
            ],
            [
              'Are my documents safe when I organize them?',
              'Your files are never stored on our servers, never retained after your session, and never used for training or analytics. No file is kept, queued or logged, and your original document is left untouched — the tool always saves a separate organized copy.',
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
          Once the order is right, keep going with the same document: the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          joins it to another file, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          turns the finished pages into images, and the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          hands you an editable draft when the text itself needs changing. If you
          would rather understand how document tooling is built than simply use
          it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          walks through the file and document APIs behind tools like this one.
        </p>
      </div>
    </article>
  );
}
