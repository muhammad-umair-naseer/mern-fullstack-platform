import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Check,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Merger tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with icons, benefit grid, FAQ, closing link block.
 *
 * Three decisions shaped the copy, and they matter if anyone edits this later.
 *
 * First, the merger's real differentiator is the page-by-page organiser, not
 * the merge itself. Every free tool concatenates files; this one explodes
 * every page of every file into one grid you can reorder, jump around and
 * delete from before the merge runs. So section 3 carries the "combine
 * specific pages from multiple pdfs" and "merge pdf in custom order" intent,
 * which is lower volume than the head term but far less contested and far
 * closer to a completed job.
 *
 * Second, keywords deliberately NOT promised, because the code cannot do them:
 *   - "merge password protected pdf" — validateAndInspectPdf loads without
 *     ignoreEncryption specifically to reject encrypted files up front, with
 *     the message "Password-protected — please remove password before
 *     merging." Section 4 answers the query honestly instead of claiming it.
 *   - "combine jpg/word/excel into one pdf" — the picker accepts .pdf only and
 *     the validator re-checks the extension and the %PDF- header. Section 4
 *     points at the converters rather than pretending this tool takes images.
 *     The JPG-to-PDF route named there is real: PdfJpg.js has a 'jpg2pdf' mode
 *     backed by convertJpgToPdf in lib/pdfJpg.js.
 *   - "merge pdf with bookmarks / table of contents" — pages are copied, an
 *     outline tree is not rebuilt, so nothing here promises bookmarks.
 *   - "compress merged pdf" / "reduce size while merging" — there is no
 *     compression stage, so section 6 sends people to the compressor instead.
 *   - "make the merged scan searchable" — the OCR tool (lib/pdfOcr.js) returns
 *     { combinedText, pages, pageCount } and PdfOcr.js downloads that as a
 *     .txt file. It does NOT write a text layer back into the PDF. Section 6
 *     therefore promises a text file, never a searchable PDF.
 *   - "save any web page as pdf" — SaveWebAsPdf.js fetches nothing. It renders
 *     pasted text plus title/subtitle/sourceUrl through jsPDF. Section 4 says
 *     exactly that and does not imply URL capture.
 *   - page thumbnails: the organiser cards show page number and source file
 *     name, not a rendered preview of the page. The copy says "cards", never
 *     "thumbnails" or "previews".
 *
 * Third, privacy is sold strictly as an outcome — files are not stored, not
 * queued, not retained, not used for training. How that happens is absent by
 * design and must stay absent. The only ceiling stated anywhere is the memory
 * one in FAQ 2 and section 7, which is a real limit users hit on very large
 * batches (mergePdfsByPagePlan preloads every source document before copying).
 *
 * Note on headings: this file must contain exactly one h2 (the guide title).
 * The page H1 lives in ToolDetail, which also renders the Related Tools h2.
 * Do not promote any h4 in here to an h3 or h2.
 */
export default function PdfMergerSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Merge PDF Files</span>: The Complete Guide to Combining PDFs in the Order You Choose
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Almost nothing arrives as one document. A contract comes back as four
        separate scans; an application wants your CV, your certificates and your
        ID as one attachment. To{' '}
        <strong>merge PDF files</strong> is to stop apologising for that in the
        covering email. The tool above will <strong>combine PDF files</strong>{' '}
        into one document in whatever sequence you decide &mdash; whole files in
        order, or individual pages picked out of several documents and arranged
        by hand. It is a <strong>free PDF merger</strong> with no account, no
        watermark and no daily limit, and this guide covers exactly how to use
        it, what it will refuse, and why.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/merge-pdf-files.webp"
            alt="Hands filing a stack of loose papers into one thick ring binder"
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
              Several separate PDFs in, one ordered document out &mdash; with
              every page exactly where you put it.
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
            ['#what-merging-is', '1. What Merging PDF Files Actually Does'],
            ['#how-to-merge', '2. How to Merge PDF Files Online Free'],
            ['#page-organizer', '3. Merging Page by Page in a Custom Order'],
            ['#wont-merge', '4. Why a File Will Not Merge (and the Fix)'],
            ['#use-cases', '5. The Jobs People Actually Use a PDF Merger For'],
            ['#after-the-merge', '6. After the Merge: Size, Order and Protection'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Merger'],
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
      <section id="what-merging-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Merging PDF Files Actually Does
        </h3>
        <p>
          A PDF is a container. The format described by{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2, the international standard for PDF
          </a>{' '}
          stores every page as a self-contained object carrying the fonts,
          vectors and images it needs. That is why a <strong>PDF combiner</strong>{' '}
          can exist at all: pages are portable units, so combining documents
          means lifting pages out of several containers into a new one, in a
          sequence you choose.
        </p>
        <p>
          That tells you what to expect from the output. When you{' '}
          <strong>combine multiple PDFs into one</strong> here, each page arrives
          whole: text stays selectable, diagrams stay sharp at any zoom, and
          nothing is flattened into a picture on the way through. Three things
          are true of every merge:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Nothing is re-encoded.</strong> Pages cross over as they
            are, so a merge never softens an image or blurs a scan.
          </li>
          <li>
            <strong>Order is yours, not alphabetical.</strong> Most tools stitch
            files in whatever sequence you happened to select them. Here you set
            it explicitly, and can change it as often as you like before
            anything runs.
          </li>
          <li>
            <strong>The originals are untouched.</strong> A merge produces a new
            file; the documents you started with are not modified or replaced.
          </li>
        </ul>
        <p>
          One honest note: pages keep their own dimensions, so if you{' '}
          <strong>merge PDF documents</strong> of different paper sizes the
          result contains both. Where that is not what you want, the{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page resizer
          </Link>{' '}
          will standardise the pages first.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-merge" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Merge PDF Files Online Free (Step-by-Step)
        </h3>
        <p>
          There is no sign-up, no email and no trial countdown. To{' '}
          <strong>merge PDF files online free</strong> with the tool at the top
          of this page, four steps:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Add two or more PDFs', 'Drag your files onto the panel or click to browse. Each document is checked as it arrives, with its page count and size shown on its card.'],
            ['Put them in order', 'Drag a file card by its handle, or nudge it with the arrows, until the sequence reads the way you want. Remove a mistake with the bin icon.'],
            ['Run the merge', 'Press merge. A progress readout names what is being combined and shows a percentage. Change your mind and cancel: the merge stops at the next file or page boundary, and nothing half-finished is produced or downloaded.'],
            ['Download the result', 'One combined PDF, named after the first document being merged, with "-merged" on the end. The summary shows how many documents you added, how many pages came out and how large the finished file is.'],
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
          Two valid documents is the only rule &mdash; and, if you are working
          page by page, at least one page left in the plan. Delete every card in
          the organiser and the merge button waits for you to put one back.
          Beyond that there is no daily cap on how often you can{' '}
          <strong>join PDF files</strong>, no queue and no watermark stamped
          across the output &mdash; the usual catch with a free tier elsewhere.
        </p>
      </section>

      {/* 3 */}
      <section id="page-organizer" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Merge PDF Files in a Custom Page Order
        </h3>
        <p>
          This is the part most free tools do not have. Switch from{' '}
          <em>By File Sequence</em> to the <em>Page-by-Page Organizer</em> and
          every page of every document you added expands into its own card in one
          grid. You are no longer ordering files; you are ordering pages, across
          all of them at once.
        </p>
        <p>
          Each card carries its page number and is colour-coded by the file it
          came from, so you always know where a page belongs. From there you
          can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Drag any page anywhere.</strong> Pull page three of your
            second document in front of page one of your first; the cards
            renumber themselves as you go.
          </li>
          <li>
            <strong>Nudge or jump.</strong> Arrows move a page one position; the
            position dropdown sends it straight to slot 27 in one go.
          </li>
          <li>
            <strong>Exclude pages before merging.</strong> Delete a card and
            that page is left out of the result. Work in that order &mdash; add
            every file you need first, then delete the pages you do not want
            &mdash; and the grid you end up looking at is exactly the document
            you get. This is how you{' '}
            <strong>combine specific pages from multiple PDFs</strong> in one
            pass, instead of splitting every file first.
          </li>
          <li>
            <strong>Start again cheaply.</strong> Reset order restores the
            plain sequential arrangement, deleted pages included, whenever an
            experiment goes wrong.
          </li>
        </ul>
        <p>
          One expectation to set: the cards show page numbers and file names,
          not pictures of the pages &mdash; a plan, not a preview. To see the
          pages before deciding, open the originals alongside or turn them into
          images with the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          first. Everything else &mdash; the reordering, the exclusions, the
          final sequence &mdash; comes out exactly as the grid shows it.
        </p>
      </section>

      {/* 4 */}
      <section id="wont-merge" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Why a File Will Not Merge, and How to Fix It
        </h3>
        <p>
          Every file is inspected the moment you add it, so a document that
          cannot be merged says so on its own card immediately rather than
          failing halfway through. There are three reasons for that message.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['It is password-protected', 'Encrypted PDFs are refused with a note asking you to remove the password first. That is deliberate: a locked document is locked for a reason.'],
            ['It is not really a PDF', 'A file renamed to .pdf is not a PDF. What is actually inside gets checked, so a mislabelled image or half-finished download is caught before it can spoil your output.'],
            ['It is damaged', 'Truncated downloads and files off a failing drive can be unreadable. The card names the problem, so you can drop that file and merge the rest.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          The fourth case is not an error: this is a <strong>PDF merger</strong>,
          and it takes PDFs. To <strong>combine images into one PDF</strong>, or
          to fold a Word file into a report, convert first and merge after. Use
          the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Word converter
          </Link>{' '}
          for a .docx, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPG to PDF converter
          </Link>{' '}
          to turn photos, screenshots and phone scans into PDF pages, and the{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            web-page-to-PDF tool
          </Link>
          , which turns text you paste from a page into a clean, titled PDF that
          records the source URL you give it. Then bring the results back here. Two things
          are worth knowing about that last one before you rely on it: it works
          from the text you paste rather than from a link, and what it produces
          is typeset plainly, so the original page&rsquo;s pictures and styling
          are not carried over. For a quotation, a reference or an article you
          want to keep in the pack, that is usually the point &mdash; it reads
          cleanly next to the rest of your merge. Done in this order the whole
          job takes a minute longer and behaves properly afterwards.
        </p>
      </section>

      {/* 5 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange-500 shrink-0" />
          5. The Jobs People Actually Use a PDF Merger For
        </h3>
        <p>
          Nobody wakes up wanting to merge a PDF. They want to send one
          attachment instead of nine. These are the jobs behind that.
        </p>
        <p>
          <strong>Job and university applications.</strong> Portals accept one
          file only, so CV, cover letter, certificates and references have to
          become a single document in a sensible order.
        </p>
        <p>
          <strong>Scans that arrived in pieces.</strong> A jamming feeder leaves
          you with &ldquo;scan_01&rdquo; through &ldquo;scan_07&rdquo;. Add them
          all, drag them into sequence, and the contract is whole again. If a
          page came out upside down, straighten it with the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          before you combine.
        </p>
        <p>
          <strong>Reports and reading packs.</strong> Chapters come back from
          three authors and the order changes twice before submission; reordering
          costs nothing until you press merge. The same is true of study
          material, where you{' '}
          <strong>merge PDF pages</strong> from a chapter, an article and your own
          notes into one pack in reading order.
        </p>
        <p>
          <strong>Bookkeeping and expenses.</strong> Twelve monthly statements
          become one file per quarter, and the page organiser earns its keep:
          drop the cover page every statement repeats and keep the numbers.
        </p>
      </section>

      {/* 6 */}
      <section id="after-the-merge" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. After the Merge: Size, Order and Protection
        </h3>
        <p>
          A combined document is roughly the sum of its parts, so nine merged
          scans make a large file. The merge shrinks nothing, because
          re-compressing your pages uninvited would quietly degrade them. If the
          result is too heavy for an attachment, run it through the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          afterwards, where size is the actual job and the trade-off is yours.
        </p>
        <p>
          To change the order after the fact, you need not start over. The{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          rearranges pages inside an existing file, the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>{' '}
          deletes pages you no longer want, and the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          breaks it back into parts. To pull a handful of pages out as their own
          file, the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page extractor
          </Link>{' '}
          is the quicker route.
        </p>
        <p>
          Two things are worth doing before you send. If the file holds anything
          confidential, add a password with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>
          .
        </p>
        <p>
          And if any source document was a scan, be clear about what you have.
          A scan is a picture of a page, so the merged file contains no text to
          search, select or quote, and merging does not change that in either
          direction: it neither adds text nor takes any away. What you can do is
          get the words out. The{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          reads the text off those scans and hands it back as a text file you
          can search, copy or quote from &mdash; enough to find the clause, pull
          the figure, or paste a paragraph into an email. The PDF itself comes
          back unchanged, so treat the text file as a companion to the merged
          document rather than a replacement for it: the PDF is what you send,
          the text is what you search. Where the wording matters more than the
          layout &mdash; a contract you will be quoting from, a receipt whose
          numbers you need to total &mdash; run the OCR before you merge, so you
          have both by the time the pack goes out.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Merger
        </h3>
        <p>
          Plenty of sites will <strong>merge PDF files free</strong>, and most
          make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough to check.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email, no card and no countdown to a paid tier. The tool you are using is the whole product.'],
            ['Page-level control, not just file order', 'Reorder and exclude individual pages across every document you added, in one grid, before anything runs.'],
            ['No imposed file or quantity limit', 'Merge three memos or a stack of scanned chapters. There is no ceiling put there to upsell you past and no daily counter ticking down — only the practical limit of a very large batch, which splits neatly into two merges.'],
            ['No watermark on the output', 'Your merged PDF comes out clean. Nothing is stamped across the pages and nothing is appended to the end.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['Honest about what it will not do', 'Encrypted and damaged files are named as such the moment you add them, instead of failing quietly halfway through.'],
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
          It sits in a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on the same terms, so the whole sequence &mdash; convert, merge,
          reorder, compress, protect &mdash; costs nothing at any step.
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
              'How do I merge PDF files for free without an account?',
              'Add two or more PDFs to the tool at the top of this page, drag them into the order you want, press merge and download the result. There is no sign-up, no email verification and no watermark — free every time, not free for the first two files.',
            ],
            [
              'How many PDFs can I combine at once, and is there a size limit?',
              'Two is the minimum, and nothing is capped, queued or counted — neither the number of documents nor their size. Large batches simply take longer to work through, though a very large one is limited by the memory available to your session; if a merge stalls, split it into two and merge the two results. The summary at the end tells you how many documents you added, how many pages came out and how large the finished file is.',
            ],
            [
              'Can I choose the order of pages instead of just the order of files?',
              'Yes, and this is the tool’s main advantage. Switch to the Page-by-Page Organizer and every page from every file appears as its own card. Drag them into any sequence, jump a page straight to a position, or delete the pages you do not want in the result. Add all of your files before you start deleting, so the plan you build is the plan you merge.',
            ],
            [
              'Why does it say my PDF is password-protected?',
              'Because it is encrypted, and encrypted documents are refused rather than opened. Remove the password in whatever application you normally open it with, save an unlocked copy, and merge that. You can add protection back to the finished document afterwards.',
            ],
            [
              'Will merging reduce the quality of my pages or my scans?',
              'No. Pages are carried across as they are, so text stays text, vectors stay sharp and images are not re-compressed. That also means the merged file is about as large as its parts combined — use the compressor afterwards if you need it smaller.',
            ],
            [
              'Can I make a merged stack of scans searchable?',
              'Not by merging: a scanned page is an image, and combining images gives you more images. The OCR tool reads the words off those pages and gives them back as a text file you can search, copy and quote from, while the PDF itself is unchanged. Keep the two together — send the PDF, search the text.',
            ],
            [
              'Are my files safe when I merge them?',
              'Your documents are never stored on our servers, never retained after your session, and never used for training or analytics. No file is kept, queued or logged.',
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
          Need something else from the same stack? The{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          breaks a long file back into parts, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          gets the result under an upload limit, the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          reorders pages inside it, and the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>{' '}
          locks it before you send. If you would rather understand documents than
          simply process them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how document formats like PDF are structured and handled.
        </p>
      </div>
    </article>
  );
}
