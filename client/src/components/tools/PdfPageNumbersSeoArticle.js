import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Hash,
  HelpCircle,
  Layers,
  ListOrdered,
  Scale,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Page Numbers tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Recipes over feature lists. Searchers arrive with a specific job (a
 *    thesis, a proposal with a cover, a discovery production), so each of
 *    those gets the exact settings that produce it.
 *
 * 2. The {n}, {N}, {p}, {P} and {prefix} tokens are explained, including how
 *    the total behaves when a cover is skipped, because that is the question
 *    behind "page numbers don't match".
 *
 * 3. Limits are stated plainly and routed: one file per run, 3-digit padding,
 *    Western Latin text only, no mirrored odd/even placement.
 */
const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

export default function PdfPageNumbersSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Add Page Numbers to PDF</span> Files: Page X of Y, Roman Numerals, Skipped Covers and Bates Labels
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A thesis with i, ii, iii front matter. A proposal whose cover should
        carry no number. A discovery production labelled ABC-001. A board pack
        that reads &ldquo;Page 3 of 18&rdquo;. Each is the same task: you need
        to <strong>add page numbers to PDF</strong> documents that already
        exist. This guide shows how to <strong>number PDF pages</strong> for
        free, with exact settings for each job, fixes for the usual problems,
        and an honest list of what the tool will not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-page-numbers.webp"
            alt="Add page numbers to PDF online free - add page numbers to thesis PDF roman and arabic, Page X of Y footer, and Bates numbering with prefix and leading zeros"
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
              An unnumbered cover, roman front matter, and a body that reads
              Page 1 of N.
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
            ['#what-it-does', '1. What PDF Page Numbers Are, and Why Yours Are Missing'],
            ['#how-to', '2. How to Add Page Numbers to a PDF in Four Steps'],
            ['#page-x-of-y', '3. Page X of Y, Starting From Page 2, and Custom Footer Text'],
            ['#thesis', '4. Roman and Arabic Numbering for a Thesis or Report'],
            ['#bates', '5. Bates Numbering PDF Files: Prefixes, Zeros and Exhibits'],
            ['#fixes', '6. When PDF Page Numbers Go Wrong, and Which Tool Comes First'],
            ['#why-cortexis', '7. Why Number Your PDF Pages With Cortexis'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          1. What PDF Page Numbers Are, and Why Yours Are Missing
        </h3>
        <p>
          There are two kinds of <strong>PDF page numbers</strong>. One is the
          position your viewer shows in its toolbar, which appears nowhere on
          the paper. The other is text printed on the page itself, usually in
          the footer, which survives printing and sharing.{' '}
          <strong>PDF page numbers not showing</strong> on paper? You have the
          first kind and need the second.
        </p>
        <p>
          This tool adds the second kind. It stamps a visible label onto each
          page you choose and gives you a new file. Existing text, images and
          links are kept as they are, so searchable text stays searchable, and
          on rotated pages the number still sits upright.
        </p>
        <p>
          It does not change the labels in your viewer&rsquo;s page box or
          build a table of contents; for chapter navigation, use the{' '}
          <Link to="/tools/pdf-bookmarks" className={linkClass}>
            PDF bookmarks tool
          </Link>{' '}
          after numbering. The PDF format, defined in{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            ISO 32000-2
          </a>
          , treats viewer labels and printed text as separate things.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Add Page Numbers to a PDF in Four Steps
        </h3>
        <p>
          Here is <strong>how to add page numbers to a PDF</strong> with the
          tool above, the whole process to{' '}
          <strong>add page numbers to PDF online free</strong>, with no account
          and no sign-up.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the PDF.</strong> Drop one file onto the panel or
            click to browse.
          </li>
          <li>
            <strong>Pick a format and style.</strong> Format sets the wording:
            Page 1 of 10 (the default), 1, 1 / 10, {'- 1 -'}, prefix
            plus number, or Custom. Style sets the numerals: 1, 2, 3; i, ii,
            iii; I, II, III; A, B, C; or 001, 002.
          </li>
          <li>
            <strong>Place it.</strong> Horizontal is Centre, Left or Right;
            Vertical is Bottom or Top, and Top is{' '}
            <strong>how to add page numbers to PDF in header</strong> position.
            Margin, font size, one of five standard fonts and a colour finish
            the look.
          </li>
          <li>
            <strong>Set the range and download.</strong> Start at, Skip first N
            pages and Only these pages decide which pages are numbered. Press{' '}
            <em>Add page numbers</em>, check the preview, and download the copy
            ending in <strong>-numbered.pdf</strong>.
          </li>
        </ol>
        <p>
          The same page works to <strong>add page numbers to PDF on iPhone</strong>{' '}
          or iPad (pick the file from Files, save the download back there). To{' '}
          <strong>add page numbers to PDF on Mac</strong> without paid PDF
          software, open this page in Safari or Chrome, choose the file from
          Finder, and the numbered copy lands in Downloads, with no account
          or subscription.
        </p>
      </section>

      {/* 3 */}
      <section id="page-x-of-y" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-6 h-6 text-orange-500 shrink-0" />
          3. Page X of Y, Starting From Page 2, and Custom Footer Text
        </h3>
        <p>
          The most asked question is <strong>how to add Page X of Y to PDF</strong>{' '}
          footers with a correct total. The default format does it, and skipped
          pages are not counted, so the total is the last number printed, not
          the length of the file.
        </p>
        <p>
          That is exactly <strong>how to add page numbers to PDF starting from
          page 2</strong>. Set Skip first N pages to 1. The cover gets nothing,
          the second page reads Page 1 of 11 in a twelve-page file, and the last
          page reads Page 11 of 11. If you would rather the first body page say
          2, set Start at to 2 as well; the total follows, so the last page
          reads Page 12 of 12.
        </p>
        <p>
          For <strong>PDF footer page numbers custom text</strong> is easy:
          choose Custom and type any wording around these placeholders:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>{'{n}'}</strong> &mdash; the number for this page, in the
            style you picked.
          </li>
          <li>
            <strong>{'{N}'}</strong> &mdash; the last number that will be
            printed, in the same style, so Page i of iv works.
          </li>
          <li>
            <strong>{'{p}'}</strong> and <strong>{'{P}'}</strong> &mdash; this
            page&rsquo;s position within the pages you selected, and how many
            you selected.
          </li>
          <li>
            <strong>{'{prefix}'}</strong> &mdash; the Prefix box text, such as A-.
          </li>
        </ul>
        <p>
          So <em>Confidential &ndash; Page {'{n}'} of {'{N}'}</em> gives a
          labelled footer. For a large diagonal stamp instead, the{' '}
          <Link to="/tools/pdf-watermark" className={linkClass}>
            PDF watermark tool
          </Link>{' '}
          is the right tool.
        </p>
      </section>

      {/* 4 */}
      <section id="thesis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          4. Roman and Arabic Numbering for a Thesis or Report
        </h3>
        <p>
          Many universities want an unnumbered title page, lower-case roman
          front matter, and chapters from 1. This is{' '}
          <strong>how to add roman numerals page numbers PDF</strong> theses
          need, plus arabic ones in the same file: to{' '}
          <strong>add page numbers to thesis PDF roman and arabic</strong>, you
          run the tool twice on one file. Say the title is page 1,
          front matter is pages 2 to 5 and chapter one starts on page 6.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>First pass, front matter.</strong> Only these pages: 2-5.
            Style: i, ii, iii. Format: 1 (the bare number). Start at: 1.
            Download the numbered file.
          </li>
          <li>
            <strong>Second pass, the body.</strong> Choose the file you just
            downloaded. Only these pages: 6-9999 (numbers past the last page
            are ignored). Style: 1, 2, 3. Start at: 1. Download again.
          </li>
        </ol>
        <p>
          Neither pass selects the title page, so it stays blank.
        </p>
        <p>
          Numbers follow the pages as they sit in the file, so move a
          misplaced appendix with the{' '}
          <Link to="/tools/pdf-organizer" className={linkClass}>
            PDF organizer
          </Link>{' '}
          and drop stray blank pages with the{' '}
          <Link to="/tools/pdf-page-remover" className={linkClass}>
            page remover
          </Link>{' '}
          first. Writing in Word? Convert with{' '}
          <Link to="/tools/docx-to-pdf" className={linkClass}>
            DOCX to PDF
          </Link>{' '}
          before numbering.
        </p>
      </section>

      {/* 5 */}
      <section id="bates" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          5. Bates Numbering PDF Files: Prefixes, Zeros and Exhibits
        </h3>
        <p>
          <strong>Bates numbering PDF</strong> productions gives every page a
          unique sequential identifier, usually a party code plus a number.
          Here is <strong>how to Bates stamp a PDF</strong> here, a practical
          route to <strong>Bates numbering online free</strong>:
        </p>
        <ol className="space-y-3">
          <li>
            Choose the format <em>Prefix + number</em> and type your code in
            Prefix, for example ABC-.
          </li>
          <li>
            Choose the style <em>001, 002 (padded)</em>. That gives{' '}
            <strong>Bates numbering with prefix and leading zeros</strong>:
            ABC-001, ABC-002 and so on.
          </li>
          <li>
            Set Horizontal to Right for the usual lower right corner.
          </li>
          <li>
            For a second volume, set Start at to follow on from the first.
          </li>
        </ol>
        <p>
          Two limits: padding is fixed at three digits, so ABC-000001 is not
          available, and one file is numbered per run, so a sequence does not
          continue across PDFs by itself. Combine them first with the{' '}
          <Link to="/tools/pdf-merger" className={linkClass}>
            PDF merger
          </Link>{' '}
          and number the result once, or run each file with its own Start at
          value.
        </p>
        <p>
          To <strong>add exhibit numbers to PDF</strong> filings, use Custom
          with <em>Exhibit 4 &ndash; Page {'{n}'} of {'{N}'}</em>. The exhibit
          name is literal text you type, so run each exhibit file separately
          with its own label. Be careful with the letters style: it changes on
          every page (A, B, C), so it suits lettered pages, not one exhibit
          letter held across a whole file. Check your court&rsquo;s rules for
          placement.
        </p>
      </section>

      {/* 6 */}
      <section id="fixes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. When PDF Page Numbers Go Wrong, and Which Tool Comes First
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>PDF page numbers don&rsquo;t match.</strong> The viewer
            says page 3, the footer says 1, because a cover and contents come
            first. That is expected. To make them agree, set Skip to 0 and
            Start at to 1.
          </li>
          <li>
            <strong>Page numbers covering text? PDF margin is the fix.</strong>{' '}
            Raise the margin, lower the font size, or switch to Top. On dark
            pages pick a contrasting colour; there is no background box.
          </li>
          <li>
            <strong>Cannot add page numbers to PDF password protected
            files.</strong> Encrypted files are refused. Remove the password
            you know with{' '}
            <Link to="/tools/pdf-unlock" className={linkClass}>
              PDF unlock
            </Link>
            , number the copy, then lock it again with{' '}
            <Link to="/tools/pdf-protect" className={linkClass}>
              PDF protect
            </Link>{' '}
            if needed.
          </li>
          <li>
            <strong>Old numbers already printed.</strong> They cannot be
            removed here; black them out with{' '}
            <Link to="/tools/pdf-redact" className={linkClass}>
              PDF redact
            </Link>{' '}
            first, then number.
          </li>
          <li>
            <strong>Add page numbers to scanned PDF pages.</strong> Works as
            normal. For searchable text too, run{' '}
            <Link to="/tools/pdf-ocr" className={linkClass}>
              PDF OCR
            </Link>{' '}
            as a separate step.
          </li>
          <li>
            <strong>Add page numbers to merged PDF files.</strong> Merge
            first, number once, and the sequence runs straight through.
          </li>
          <li>
            <strong>Add page numbers to PDF specific pages only.</strong> Type
            ranges such as 2-20 or 1,3-5 in Only these pages. Pages outside
            the range get no number and are not counted in the total.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Other limits.</strong> Every page gets the same position,
            so mirrored outer-edge book numbering is not available. Labels use
            Western Latin characters only, so Arabic, Chinese or Cyrillic text
            is not supported. Spreadsheets need{' '}
            <Link to="/tools/xlsx-to-pdf" className="underline font-semibold">
              XLSX to PDF
            </Link>{' '}
            first.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Number Your PDF Pages With Cortexis
        </h3>
        <p>
          Most pages offering a <strong>PDF page number tool</strong> give you
          position and font, then stop. Here is what this one adds.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no watermark on your document. The tool on this page is the whole product.'],
            ['A total that is actually right', 'Skipped cover pages are not counted, so Page X of Y ends on the true last number. Start at shifts the total with it.'],
            ['Five numbering styles', 'Arabic, lower and upper roman, letters, and zero-padded 001. Two passes give a thesis roman front matter and an arabic body.'],
            ['Bates and exhibit labels', 'A free-text prefix, padded numbers and a Start at value up to 99999 cover prefixed production labels and exhibit stamps.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after your session, which matters for legal, HR and medical papers.'],
            ['Nothing is used for training', 'Your documents are never used for training. The original stays yours, and the numbered copy is a new file.'],
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
          See our other{' '}
          <Link to="/tools" className={linkClass}>
            free PDF and file tools
          </Link>
          .
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
              'How do I add page numbers to a PDF for free?',
              'Choose your PDF in the tool above, pick a format such as Page 1 of 10, set the position, and press Add page numbers. Download the copy ending in -numbered.pdf, with no account needed.',
            ],
            [
              'How do I leave the cover page without a number?',
              'Set Skip first N pages to 1. The cover gets no label and is not counted, so the Page X of Y total stays correct.',
            ],
            [
              'Can I use roman numerals for the front matter and normal numbers for the rest?',
              'Yes, in two passes. Number the front matter with Only these pages and the i, ii, iii style, then load that download and number the body with 1, 2, 3 starting at 1. A title page left out of both passes stays unnumbered.',
            ],
            [
              'Can I do Bates numbering like ABC-001?',
              'Yes. Choose Prefix + number, type ABC- in Prefix, and pick the padded 001, 002 style. Padding is fixed at three digits, so six or eight digit Bates numbers are not available.',
            ],
            [
              'Will the numbers continue across several PDFs?',
              'Not automatically, because one file is numbered per run. Merge the files first and number the result once, or give each file a Start at value that follows on from the previous one.',
            ],
            [
              'Why are my page numbers covering text?',
              'Some documents have content close to the page edge. Increase the margin, reduce the font size, or move the numbers to the top, then rerun on your original.',
            ],
            [
              'Can I number a password protected PDF?',
              'Not while it is encrypted. If you know the password, remove it with PDF unlock, add the numbers, then add a password again with PDF protect if needed.',
            ],
            [
              "PDF page numbers don't match the viewer. How do I fix it?",
              'The viewer counts every page from the cover, while the printed footer starts wherever you told it to. If you want them to agree, rerun on your original with Skip first N pages set to 0 and Start at set to 1. If the mismatch is deliberate, such as an unnumbered cover, it is expected and correct.',
            ],
            [
              'How do I add page numbers to PDF specific pages only?',
              'Type the pages in Only these pages, for example 2-20 or 1,3-5, and leave it blank for every page. The first selected page shows the Start at value, and pages outside the range stay blank and are not counted in the total.',
            ],
            [
              'Can I add page numbers on a Mac without paid PDF software?',
              'Yes. Open this page in Safari or Chrome on your Mac, choose the PDF, and download the numbered copy. There is no account, subscription or watermark.',
            ],
            [
              'Is it safe to number legal or confidential documents here?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training. The numbered copy is a new file; your original is unchanged.',
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
          <ListOrdered className="inline w-4 h-4 text-orange-500 mr-1 align-[-2px]" />
          Numbered and ready? Shrink it with the{' '}
          <Link to="/tools/pdf-compressor" className={linkClass}>
            PDF compressor
          </Link>
          , pull out a chapter with the{' '}
          <Link to="/tools/pdf-splitter" className={linkClass}>
            PDF splitter
          </Link>
          , sign the final page with{' '}
          <Link to="/tools/pdf-esign" className={linkClass}>
            PDF eSign
          </Link>
          , or turn scattered photos into a document with{' '}
          <Link to="/tools/image-to-pdf" className={linkClass}>
            image to PDF
          </Link>{' '}
          before numbering. To build tools like this, try our free{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
