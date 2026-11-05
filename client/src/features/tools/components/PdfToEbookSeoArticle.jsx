import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  FileText,
  HelpCircle,
  Layers,
  ListOrdered,
  Scissors,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to eBook tool.
 *
 * Written against what PdfToEbook.js actually does, which is narrower than
 * the phrase "PDF to eBook" suggests and shapes the whole article.
 *
 * The tool reads the text layer of a PDF and nothing else. No images, no
 * fonts, no bold or italic, no real chapter detection: each PDF page becomes
 * one block of text with a "Page N" heading, and that is true in every one of
 * the five output formats. Section 6 says so plainly, because a reader who
 * expects a facsimile of a textbook will otherwise think the tool is broken,
 * and "pdf to epub images missing" is answered as an FAQ that routes to the
 * image extractor rather than pretended away.
 *
 * The "Kindle" option writes Kindle-source HTML with mbp:pagebreak markers,
 * not a .mobi or .azw3 binary. Section 4 and the FAQ are explicit about that
 * so "convert pdf to kindle format" is served honestly.
 *
 * The one thing the tool does that the obvious keywords never mention is the
 * Extracted Text Preview: the first three pages appear as text the moment the
 * PDF is chosen, which is how a reader finds out whether a scanned PDF will
 * come out empty before they convert anything. Section 2 is built around it.
 *
 * Two research keywords were declined because serving them would require
 * either describing the implementation or naming a third-party product, and
 * house rules forbid both. Their intent (privacy, no desktop software) is
 * answered as an outcome only.
 *
 * The PDF protect tool only locks PDFs, so a password-protected input is
 * answered honestly (remove the password at its source) rather than routed
 * to a tool that cannot unlock it.
 */
export default function PdfToEbookSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        Free <span className="text-orange-600 dark:text-orange-400">PDF to EPUB Converter</span>: Turn a PDF Into a Reflowable eBook
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A PDF on a six-inch screen is a page designed for paper, shrunk until the
        words are the size of grains of rice. An eBook flows to fit whatever is
        reading it. This <strong>PDF to EPUB converter</strong> takes a PDF with
        selectable text and rebuilds it as a genuine EPUB 3 book, or as
        Kindle-ready HTML, FictionBook 2, Markdown or plain text. Before it
        converts anything it shows you the text it found, so you know in seconds
        whether your <strong>PDF to eBook</strong> job will work. This guide
        covers what is kept, what is dropped, and how to get a book that files
        correctly in your library.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-ebook.webp"
            alt="A hand holding an e-reader open to a page of text on a sandy beach"
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
              One PDF in, five eBook formats out: EPUB 3, Kindle HTML, FB2,
              Markdown and plain text, with a text preview before you commit.
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
            ['#why-reflow', '1. Why a PDF Will Not Reflow on a Kindle or E-Reader'],
            ['#text-preview', '2. See the Text Before You Convert'],
            ['#how-to-convert', '3. How to Convert PDF to EPUB Online Free'],
            ['#output-formats', '4. Five Formats From One PDF'],
            ['#chapters-metadata', '5. Chapters, Title and Author'],
            ['#what-it-drops', '6. What the Converter Keeps and What It Drops'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF to EPUB Converter'],
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
      <section id="why-reflow" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why a PDF Will Not Reflow on a Kindle or E-Reader
        </h3>
        <p>
          If you have ever searched for <strong>pdf text too small on kindle</strong>{' '}
          or wondered why you <strong>can&rsquo;t change font size in a PDF on an
          e-reader</strong>, the answer is the same. A PDF fixes every letter to
          a position on a page of a fixed size, so a small screen can only give
          you tiny text or sideways scrolling. A <strong>PDF won&rsquo;t reflow on Kindle</strong>{' '}
          because nothing in the file says which words form a paragraph; there is
          only where each glyph was printed.
        </p>
        <p>
          An EPUB is built the other way round. It stores the text as marked-up
          prose and the device lays it out for its own screen and font, the way
          a web page adapts to a phone. That is what reflowable means, and why
          the fix is a format change. The current standard is EPUB 3, defined by
          the{' '}
          <a
            href="https://www.w3.org/TR/epub-33/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C EPUB 3.3 specification
          </a>
          , and it is what this tool writes: a proper package with a navigation
          document and metadata, not a renamed zip. The trade is that text has to
          be separated from its layout. A novel loses almost nothing; a page of
          dense tables loses a great deal. Section 6 draws that boundary.
        </p>
      </section>

      {/* 2 */}
      <section id="text-preview" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-orange-500 shrink-0" />
          2. See the Text Before You Convert: Is Your PDF Scanned or Real Text?
        </h3>
        <p>
          The most common failure with any <strong>PDF to eBook converter</strong>{' '}
          is a book that opens perfectly and contains nothing, because the PDF
          was a scan: photographs of paper with no text layer. People search{' '}
          <strong>pdf to epub blank pages no text</strong> after the fact.
        </p>
        <p>
          This tool warns you first. The moment you choose a PDF, an{' '}
          <strong>Extracted Text Preview</strong> shows the first three hundred
          characters of each of the first three pages. If you see your opening
          sentences, the PDF has a text layer. If a page reads{' '}
          <em>&lt;No text extracted on this page&gt;</em>, it is an image, and if
          all three say it, the whole document almost certainly is. It is the
          quickest answer to{' '}
          <strong>how to tell if a PDF is scanned or has text</strong>.
        </p>
        <p>
          The preview also shows reading order, so a tangled two-column page is
          visible before you convert all of it. For a scanned document, the route
          is our{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>
          , which adds a text layer; bring the result back here and the preview
          will show real text.
        </p>
      </section>

      {/* 3 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Convert PDF to EPUB Online Free (Step-by-Step)
        </h3>
        <p>
          This is a <strong>PDF to EPUB converter free online</strong> in the plain
          sense: no account, no email, no watermark and no daily quota. If you
          want <strong>PDF to EPUB with no signup</strong>, here is the process:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your PDF', 'Click the panel above and pick a single PDF. It is checked for a genuine PDF header, then the page count, size and text preview appear.'],
            ['Set format and details', 'Pick EPUB, Kindle HTML, FB2, Markdown or plain text, choose page-per-chapter or a single chapter, and type the title and author.'],
            ['Convert and download', 'A progress bar runs through the pages as the file is built. The finished book appears with its size, named after your PDF, ready to download.'],
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
          The tool takes one PDF at a time, chosen by clicking the panel or
          dragging a file onto it. A password-protected or encrypted PDF
          will not open here at all: it fails at the loading step with a
          &ldquo;Failed to load PDF&rdquo; message. Take the password off with
          the{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF unlocker
          </Link>{' '}
          and choose that copy instead. Since <strong>how to convert PDF to EPUB</strong> is
          three clicks, step two is where your attention should go.
        </p>
      </section>

      {/* 4 */}
      <section id="output-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          4. Five Formats From One PDF: EPUB 3, Kindle HTML, FB2, Markdown, TXT
        </h3>
        <p>
          The text is read once and you pick what it is written into.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              EPUB 3.0
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The default, and right for Kobo, Apple Books, PocketBook and every
              modern reading app. A true <strong>PDF to EPUB 3</strong> package:
              mimetype entry first, a container file, an OPF manifest with your
              title and author, and a nav.xhtml table of contents.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Kindle HTML
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Choose this to <strong>convert PDF to Kindle format</strong> the
              way self-publishers do: one HTML file with a title block, an author
              line and an <code>mbp:pagebreak</code> marker between pages. It is
              Kindle-source HTML meant for Amazon&rsquo;s own Kindle publishing
              tools to finish, not a finished .mobi or .azw3.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              FB2 (FictionBook 2.0)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The format PocketBook and many Eastern European readers prefer.
              This is a <strong>PDF to FB2 converter online free</strong> that
              writes real FictionBook XML with title-info, author, language and
              one section per page, so it files properly.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Markdown and plain text
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Two side doors. Pick Markdown to{' '}
              <strong>convert PDF to Markdown</strong>: a title, an author line
              and a <code>## Page N</code> heading over each page. Pick TXT to{' '}
              <strong>convert PDF to a text file online</strong> with a header
              and page separators. Neither reconstructs lists, tables or links.
            </p>
          </div>
        </div>
        <p>
          If you searched <strong>PDF to Kindle HTML with mbp:pagebreak</strong>{' '}
          on purpose: yes, that is the marker used. To simply read on a Kindle,
          choose EPUB, which Amazon&rsquo;s Send to Kindle service supports.
        </p>
      </section>

      {/* 5 */}
      <section id="chapters-metadata" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          5. Chapters, Title and Author: The Options That Decide How the Book Files
        </h3>
        <p>
          Two settings besides the format decide how the book behaves in a
          library.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Chapter division
        </h4>
        <p>
          <em>Split into Chapters by PDF Page</em> gives you{' '}
          <strong>PDF to EPUB with one chapter per page</strong>: each page
          becomes its own file with an entry in the EPUB table of contents, so
          you can jump to page 143 of a manual. <em>Single Continuous
          Chapter</em> writes one file with a small &ldquo;Page N&rdquo;
          subheading between pages, which reads more like a novel. The choice
          only affects the EPUB.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Book title and author name
        </h4>
        <p>
          A book that shows up as <em>scan_final_v3</em> by <em>Unknown Author</em>{' '}
          is why people search{' '}
          <strong>PDF to EPUB set title and author metadata</strong>. The two
          text fields fix it: the values go into the EPUB metadata, the FB2
          title-info, the Kindle HTML title block and the Markdown and text
          headers. Ampersands, quotes and angle brackets are escaped, so{' '}
          <em>Q&amp;A: &lt;Notes&gt;</em> will not break the file. Language is
          always written as English and cannot be changed here.
        </p>
      </section>

      {/* 6 */}
      <section id="what-it-drops" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scissors className="w-6 h-6 text-orange-500 shrink-0" />
          6. What the Converter Keeps and What It Drops
        </h3>
        <p>
          This is a <strong>text-only PDF to EPUB converter</strong>, and it is
          better to know what that means than to find out from the result.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Kept: every word with a text layer, in page order,</strong>{' '}
            written under a heading for that page.
          </li>
          <li>
            <strong>Dropped: images, figures, diagrams, tables and the cover.</strong>{' '}
            No cover image is generated either. If a figure matters, pull it out
            with{' '}
            <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract images from PDF
            </Link>
            .
          </li>
          <li>
            <strong>Dropped: fonts, bold, italic, headings, footnotes and links.</strong>{' '}
            All text becomes plain paragraphs, and your reader&rsquo;s own font
            setting takes over.
          </li>
          <li>
            <strong>Not reconstructed: paragraphs and real chapters.</strong> Each
            PDF page becomes one block of text; line breaks collapse into spaces
            in EPUB, FB2 and Kindle HTML and survive in Markdown and TXT.
            Bookmarks are not read, so &ldquo;chapters&rdquo; are pages.
          </li>
          <li>
            <strong>Not cleaned: running headers, footers and page numbers.</strong>{' '}
            Hyphenated words are not rejoined, and multi-column pages can
            interleave.
          </li>
        </ul>
        <p>
          For a novel, a thesis, a contract or{' '}
          <strong>lecture notes as a PDF to EPUB for your phone</strong>, none of
          that is a deal-breaker. If you need a designed layout intact, our{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page resizer
          </Link>{' '}
          keeps it a PDF; for an editable document,{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>{' '}
          is the better direction, and if the source is already an EPUB, the{' '}
          <Link to="/tools/ebook-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            eBook converter
          </Link>{' '}
          covers it.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF to EPUB Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['You see the text before you convert', 'The first three pages appear as extracted text the moment you pick the file. A scanned PDF announces itself before you have converted a page.'],
            ['Five formats from one PDF', 'EPUB 3, Kindle HTML, FB2, Markdown and plain text from the same file, with the same title and author in each.'],
            ['A real EPUB 3 package', 'Mimetype-first, container file, OPF metadata and a nav.xhtml table of contents. It opens as a book with a contents menu.'],
            ['Free, no signup, no watermark, unlimited', 'No account, no email step, nothing stamped into the book and no daily count. File-size and device-memory limits apply.'],
            ['Your files stay private', 'Your PDF and the book made from it are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Metadata and structure you control', 'Type the title and author, and choose page-per-chapter navigation or one continuous chapter.'],
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
          on the same terms. To leave pages out of the book, run the PDF through
          the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          first.
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
              'How do I convert a PDF to EPUB for free with no signup?',
              'Click the panel at the top of this page, choose your PDF, leave the format on EPUB 3.0 and convert. No account, no email step, no watermark, and free every time rather than for the first few files.',
            ],
            [
              'Why did my PDF to EPUB come out with blank pages and no text?',
              'Almost always because the PDF is a scan with no text layer. If the Extracted Text Preview reads “No text extracted on this page”, run the PDF through our PDF OCR tool first.',
            ],
            [
              'Does this convert PDF to real Kindle MOBI or AZW3?',
              'No. The Kindle option writes Kindle-source HTML with a page-break marker between pages, the kind of source file Amazon’s Kindle publishing tools take in, not a finished .mobi or .azw3. To simply read on a Kindle, choose EPUB, which Amazon’s Send to Kindle service supports.',
            ],
            [
              'Why are the images missing from my PDF to EPUB conversion?',
              'Because this is a text-only converter: photographs, figures, diagrams, tables and the cover are not carried into any format. Pull the pictures out with our extract images from PDF tool, or keep the document as a PDF if layout matters.',
            ],
            [
              'Can I convert a PDF to FB2 for a PocketBook?',
              'Yes. Choose FB2 (FictionBook 2.0). The output is genuine FictionBook XML with your title and author and one section per PDF page, which PocketBook devices and FB2 reading apps open as a book with a contents list.',
            ],
            [
              'Is there a file size or page limit for converting a large PDF to EPUB?',
              'There is no artificial cap: no page count, no megabyte ceiling and no daily quota. The progress bar walks through every page, so a long document simply takes longer to finish.',
            ],
            [
              'Will the chapters in my EPUB match the chapters in the PDF?',
              'No. The converter does not read bookmarks or detect headings, so “chapters” are PDF pages titled Page 1, Page 2 and so on. Split into Chapters by PDF Page puts each in the contents menu; Single Continuous Chapter gives one flowing file.',
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
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          gives a scanned PDF the text layer this converter needs,{' '}
          <Link to="/tools/pdf-html" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to HTML
          </Link>{' '}
          is the choice when the destination is a web page, and the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          shrinks the original. To understand how EPUB packages, XHTML and
          Markdown fit together rather than simply use them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts with the markup every eBook is built from.
        </p>
      </div>
    </article>
  );
}
