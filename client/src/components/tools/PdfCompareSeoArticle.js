import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileDiff,
  FileSearch,
  GitCompare,
  HelpCircle,
  Layers,
  ListOrdered,
  ScanText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Compare tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool compares the TEXT LAYER, page 1 against page 1. Both failure
 *    modes people search for ("shows no differences", "shows every page
 *    changed") follow from that, so each gets its own section with the fix.
 *
 * 2. What it does not do is said plainly: no visual overlay, no marked-up PDF,
 *    no formatting or annotation changes, two files at a time.
 *
 * 3. The metadata table is sold as a real feature (which software last
 *    touched each version), because nobody on page one compares it.
 */
export default function PdfCompareSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Compare Two PDF Files</span> and See Every Text Change, Page by Page
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A contract comes back &ldquo;with a couple of small fixes&rdquo;. A
        supplier reissues an invoice. In each case you hold two versions of
        one document and one question: what changed? This guide shows how to{' '}
        <strong>compare two PDF files</strong> for free, what a{' '}
        <strong>PDF compare</strong> really checks, how to read the{' '}
        <strong>PDF diff</strong> it produces, and how to fix the two results
        that fool people most &mdash; &ldquo;no differences&rdquo; on files
        that clearly differ, and &ldquo;every page changed&rdquo; when only one
        did.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-compare.webp"
            alt="Two printed schedule sheets side by side on a desk, ready to check against each other"
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
              Original on the left, revised on the right. Only the pages that
              changed are shown, with the changed words marked inside each line.
            </span>
          </div>
        </div>
      </div>

      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#what-it-checks', '1. What a PDF Compare Actually Checks'],
            ['#how-to-compare', '2. How to Compare Two PDF Files for Differences'],
            ['#reading-results', '3. Reading the PDF Diff: Pages, Redline, Metadata, Patch'],
            ['#no-differences', '4. PDF Compare Showing No Differences? The Fix'],
            ['#every-page-changed', '5. PDF Compare Shows Every Page Changed? Line the Pages Up'],
            ['#worked-examples', '6. Contracts, Thesis Drafts and Invoices: Worked Examples'],
            ['#why-cortexis', '7. Why Use Cortexis as Your Free PDF Comparison Tool'],
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
      <section id="what-it-checks" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanText className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a PDF Compare Actually Checks
        </h3>
        <p>
          A PDF exported from a word processor or generated by accounting
          software carries a <strong>text layer</strong>: the characters you can
          select, search and copy. When you <strong>compare PDF</strong> files
          here, that text layer is what gets compared. Each page is read back
          into lines, top to bottom, and page 1 of the original is set against
          page 1 of the revision, page 2 against page 2, and so on.
        </p>
        <p>
          That makes it the right tool to <strong>compare PDF documents for
          differences</strong> in wording: a changed clause, a deleted
          paragraph, a different figure, a date that moved. Think of it as a{' '}
          <strong>PDF diff checker</strong> that accepts the PDFs themselves.
        </p>
        <p>
          Images, logos, colours, fonts, bold or italic styling and layout are
          not compared, and neither are comments, annotations, form field
          values or signatures. How text is stored in a PDF is defined in{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          , the PDF specification; a file only has comparable text if whatever
          created it wrote that text in.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compare" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compare Two PDF Files for Differences
        </h3>
        <p>
          Here is <strong>how to compare two PDF files for differences</strong>{' '}
          with the tool above &mdash; a way to <strong>compare PDF online
          free</strong>, with no account and no paid tier. It is also{' '}
          <strong>how to compare two PDF documents without paid PDF
          software</strong>: no licence and no trial.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Drop the original into &ldquo;Original (A)&rdquo;.</strong>{' '}
            The older version, the one you already agreed to.
          </li>
          <li>
            <strong>Drop the revision into &ldquo;Revised (B)&rdquo;.</strong>{' '}
            The two drop zones sit side by side, so it is clear which file is
            which.
          </li>
          <li>
            <strong>Set the two options.</strong>{' '}
            <em>Ignore whitespace differences</em> is on by default and should
            usually stay on, so a re-export that shifts spacing does not flood
            the results. <em>Ignore case</em> is off by default; switch it on
            only when capitalisation changes do not matter to you.
          </li>
          <li>
            <strong>Press Compare.</strong> The results appear below the
            button.
          </li>
        </ol>
        <p>
          The same four steps answer <strong>how to find changes in a revised
          PDF</strong> when nobody marked them, and how to{' '}
          <strong>compare PDF versions redline free</strong> of paid legal
          software.
        </p>
      </section>

      {/* 3 */}
      <section id="reading-results" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileDiff className="w-6 h-6 text-orange-500 shrink-0" />
          3. Reading the PDF Diff: Pages, Redline, Metadata, Patch
        </h3>
        <p>The results come in five parts.</p>
        <ul className="space-y-2">
          <li>
            <strong>The stats strip</strong> shows the page count and file size
            of A and B.
          </li>
          <li>
            <strong>The verdict</strong> counts pages that differ and lines
            removed and added, or states that the text is identical.
          </li>
          <li>
            <strong>The metadata table</strong> sets title, author, subject,
            creator, producer and both dates side by side, differences in red.
          </li>
          <li>
            <strong>One card per changed page.</strong> Removed lines carry a
            minus sign, added lines a plus sign, and where a line was edited,
            the changed words are highlighted inside it. Unchanged pages are
            left out, so one edit produces one card.
          </li>
          <li>
            <strong>A unified diff</strong> of the text, with Copy and Download
            buttons.
          </li>
        </ul>
        <p>
          That last part is how you <strong>export PDF differences as text</strong>{' '}
          (diff patch format). The download is a plain-text file named{' '}
          <strong>pdf-diff.patch</strong>, with each block labelled by page
          (&ldquo;A page 3&rdquo; against &ldquo;B page 3&rdquo;), in the{' '}
          <a
            href="https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            unified diff format
          </a>{' '}
          developers already read. It is the only export: there is no
          annotated PDF or highlighted comparison report, and none of our other
          tools produces one. If you need a record to send to someone, attach
          the patch file, or copy the changed lines from the page cards into
          your reply or a cover note.
        </p>
        <p>
          The metadata table is the quickest answer to{' '}
          <strong>how to see who created or modified a PDF</strong>.{' '}
          <em>Creator</em> is the application the document was written in and{' '}
          <em>Producer</em> the software that wrote the PDF. When you{' '}
          <strong>compare PDF metadata, author, producer</strong> and dates, a
          new Producer or later modification date shows a file was re-saved,
          even when the text matches. Treat these fields as a hint, not proof:
          any editor can rewrite them. Only fields that at least one file fills
          in appear in the table, and the Keywords field is not compared.
        </p>
      </section>

      {/* 4 */}
      <section id="no-differences" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-orange-500 shrink-0" />
          4. PDF Compare Showing No Differences? The Fix
        </h3>
        <p>
          The most dangerous result is a <strong>PDF compare showing no
          differences</strong> on files you can see differ. It almost always
          means they are scans: pictures of text with no text layer. Both sides
          come out empty, and two empty documents match.
        </p>
        <p>
          To test, try to select or search for a word in the PDF. If you
          cannot, there is no text layer. To <strong>compare scanned PDF documents</strong>, run
          both files through the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          first, then compare the two outputs. Expect a few stray character
          differences on poor scans.
        </p>
        <p>
          The other blocker is a lock. To <strong>compare password protected
          PDF</strong> files, remove the protection first &mdash; the tool
          refuses encrypted files. If you know the password, use{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Unlock
          </Link>{' '}
          to save an unlocked copy, then compare that copy.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>&ldquo;Identical&rdquo; means identical text.</strong> A
            matching verdict is reliable for wording, so it confirms a reprint
            says the same thing. It says nothing about a changed logo, stamp,
            signature or form field.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="every-page-changed" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          5. PDF Compare Shows Every Page Changed? Line the Pages Up
        </h3>
        <p>
          The opposite surprise: you expected one edit and the{' '}
          <strong>PDF compare shows every page changed</strong> from page 6
          onwards. Pages are matched by number, so when the revision gained or
          lost a page, everything after it sits one page off.
        </p>
        <p>
          Check the page counts in the stats strip. If they differ, line the
          files up first: delete the extra page from a working copy with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>
          , or pull matching ranges out of both files with{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF
          </Link>{' '}
          and compare section by section.
        </p>
        <p>
          Multi-column layouts can also read back in a slightly different
          order, and an early edit can push lines onto the next page. Both show
          as lines removed and re-added nearby; the highlighted words show what
          really changed.
        </p>
      </section>

      {/* 6 */}
      <section id="worked-examples" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-orange-500 shrink-0" />
          6. Contracts, Thesis Drafts and Invoices: Worked Examples
        </h3>
        <p>
          <strong>Contract version 1 against version 2.</strong> When you{' '}
          <strong>compare two versions of a contract PDF</strong>, put the copy
          you agreed to in A and the counterparty&rsquo;s return in B, with{' '}
          <em>Ignore case</em> off. Read every page card: the point is to catch
          the edit nobody mentioned.
        </p>
        <p>
          <strong>Thesis drafts.</strong> To{' '}
          <strong>compare thesis drafts</strong>, PDF exports should use the
          same template so page breaks match; otherwise compare chapter by
          chapter.
        </p>
        <p>
          <strong>A reissued invoice.</strong> When you{' '}
          <strong>compare two invoices</strong>, PDF differences show up as
          single highlighted words: a changed amount, due date or reference.
          If the text is identical but the modification date differs, the
          invoice was most likely just regenerated.
        </p>
        <p>
          <strong>One PDF and one Word file.</strong> To{' '}
          <strong>text compare PDF and Word</strong> versions, both sides must
          be the same format. Turn the Word file into a PDF with{' '}
          <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            DOCX to PDF
          </Link>{' '}
          and compare here, or convert the PDF with{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>
          . For plain text, the{' '}
          <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            diff checker
          </Link>{' '}
          is quicker.
        </p>
        <p>
          <strong>On any computer.</strong> You can{' '}
          <strong>compare two PDF files on Mac</strong>, Windows or Linux, and{' '}
          <strong>compare PDF files on Chromebook</strong>, the same way.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis as Your Free PDF Comparison Tool
        </h3>
        <p>
          Most pages offering a <strong>PDF comparison tool</strong> are a drop
          zone and a promise. If you want a <strong>free PDF compare
          tool</strong> as an alternative to paid PDF software for comparing
          files, here is what this one does.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no account', 'No sign-up, no trial and no paywall in front of the results.'],
            ['Word-level highlights', 'Edited lines show the exact words removed or added, so one altered figure stands out.'],
            ['Metadata compared too', 'Author, creator, producer and dates side by side, to show which version is which.'],
            ['A patch you can keep', 'Download the unified diff as pdf-diff.patch, labelled page by page.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your documents are never used to train any model.'],
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
          It compares two files at a time, text only, with no visual overlay.
          It is one of our{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          on the same terms.
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
              'How do I compare two PDF files for free?',
              'Drop the original into Original (A) and the revision into Revised (B), then press Compare. You get the changed pages with highlighted words, a metadata comparison and a downloadable patch.',
            ],
            [
              'How to check if two PDFs are identical?',
              'Compare them with Ignore whitespace on. If the verdict says the text is identical, the wording matches on every page. Images, stamps and signatures are not checked.',
            ],
            [
              'Can I compare PDF side by side?',
              'The two files load side by side as A and B. The result is one redline view per changed page, with removed and added lines marked, which is quicker to scan than two full pages.',
            ],
            [
              'Why does the comparison say there are no differences when the files clearly differ?',
              'The files are almost certainly scans with no text layer. Run both through the PDF OCR tool, then compare the results.',
            ],
            [
              'Can it compare images, layout or formatting?',
              'No. Only the text on each page is compared, so changes to images, fonts, styling, layout, annotations and signatures are not detected. None of our tools does a visual comparison.',
            ],
            [
              'Is it safe to put contracts into online PDF tools?',
              'It depends on what the tool keeps, so check its privacy terms before adding a confidential contract. Here, files are never stored on our servers, nothing is retained after your session, and nothing is used for training. No account is needed, so the comparison is not tied to your name either.',
            ],
            [
              'Can I download the comparison as a highlighted PDF?',
              'No. The only export is a plain-text unified diff named pdf-diff.patch, and none of our tools produces a marked-up PDF. For a visual record, screenshot the page cards.',
            ],
            [
              'Can I compare more than two PDFs at once?',
              'No. Each comparison is one original against one revision. For several drafts, compare each with the next in turn.',
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
          Next, check the outline with the{' '}
          <Link to="/tools/pdf-bookmarks" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF bookmarks tool
          </Link>
          , hide sensitive text with{' '}
          <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF redaction
          </Link>
          , sign the agreed version with{' '}
          <Link to="/tools/pdf-esign" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF eSign
          </Link>
          , or combine the final papers with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          . To learn to build tools like this, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the groundwork.
        </p>
      </div>
    </article>
  );
}
