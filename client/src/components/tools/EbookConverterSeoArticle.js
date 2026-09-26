import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListTree,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the eBook converter.
 *
 * Written against what EbookConverter.js actually does, which is narrower
 * than the head term "ebook converter" implies. Going in, it accepts .md,
 * .txt, .html and .htm and writes EPUB 3. Coming back, it accepts .epub and
 * writes one HTML page or one .txt. That is the whole surface: no PDF, no
 * MOBI or AZW3, no DOCX, no cover image, no packaged images, no batch. The
 * article says so in section 1 rather than burying it, and routes the PDF
 * searcher to /tools/pdf-ebook.
 *
 * The angle is chapters, because that is the thing the tool does that the
 * keywords keep asking about. Every h1/h2 becomes its own chapter file and
 * a TOC entry in both the EPUB 3 nav document and the EPUB 2 NCX. In a .txt,
 * a single line of 80 characters or fewer that does not end in punctuation
 * is promoted to a heading. Section 3 documents both rules with a before and
 * after, which is what the "one long chapter" and "no chapter breaks"
 * searches are really asking for.
 *
 * Section 4 lists the Markdown subset honestly: headings, lists, rules,
 * bold, italic, code spans and links. No fenced code, blockquotes, tables,
 * images or nested lists. It also notes that the extension check is
 * case-sensitive, so a .MD file is treated as plain text.
 *
 * Section 6 is honest about extraction: original CSS is dropped, images are
 * not carried across, and the heading on the extracted HTML page is a generic
 * label rather than the book title.
 *
 * Declined keywords: "epub 3 converter browser based" and "epub to txt
 * privacy local" both describe where the work runs, which the house style
 * does not discuss; privacy is sold as an outcome only. "how to make an epub
 * from markdown without pandoc" is answered as "without a command-line
 * toolchain" and the tool name itself is not used, because the article
 * names no other converter.
 */
export default function EbookConverterSeoArticle() {
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
        The <span className="text-orange-600 dark:text-orange-400">Markdown to EPUB Converter</span> That Turns Your Headings Into Real Chapters
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Most text-to-ebook tools produce a file that opens, then shows one
        endless chapter with no way to jump around. This{' '}
        <strong>markdown to epub converter</strong> is built around the opposite
        idea: every heading in your file becomes a chapter with its own entry in
        the table of contents, so the book navigates properly on an e-reader or
        a Kindle. It takes <strong>Markdown, plain text or HTML</strong> in and
        writes a standards-correct EPUB 3 out, and it runs the trip in reverse,
        turning an EPUB into one clean HTML page or a plain <strong>.txt</strong>.
        This guide explains exactly how the chapters are decided.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/ebook-converter.webp"
            alt="Hands holding an e-reader open to a page of text in a meadow of tall grass"
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
              Headings in, chapters out: a Markdown or text file becomes an EPUB
              with a working table of contents.
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
            ['#what-it-does', '1. What This eBook Converter Does (and Does Not)'],
            ['#how-to-build', '2. How to Convert Markdown, TXT or HTML to EPUB Free'],
            ['#chapters', '3. How Chapters Are Decided: Headings Become the TOC'],
            ['#markdown-support', '4. Which Markdown Is Supported, and What Happens to HTML'],
            ['#kindle-and-validity', '5. Why the EPUB Opens on Kindle and Passes as Valid'],
            ['#epub-to-text', '6. EPUB to TXT and EPUB to HTML: The Other Direction'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Markdown to EPUB Converter'],
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
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          1. What This eBook Converter Does (and Does Not)
        </h3>
        <p>
          The phrase <strong>ebook converter</strong> covers a lot of ground.
          This tool has two jobs:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Build an EPUB</strong> from a <strong>.md</strong>,{' '}
            <strong>.txt</strong>, <strong>.html</strong> or .htm file, with
            your title and author and one chapter per heading.
          </li>
          <li>
            <strong>Extract an EPUB</strong> into a single HTML page or a plain
            .txt file, in reading order.
          </li>
        </ul>
        <p>
          The mode is chosen from the extension: an .epub gets the extract
          options, anything else gets the build form. Equally important is what
          it is not. It is not a general <strong>epub converter</strong> in the
          any-format-to-any-format sense. It does not read or write PDF, MOBI,
          AZW3 or DOCX, adds no cover image, does not package images, and cannot
          open a DRM-protected book. If your starting point is a PDF, the{' '}
          <Link to="/tools/pdf-ebook" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to eBook tool
          </Link>{' '}
          is the one you want; for everything else, start at the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>
          .
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-build" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert Markdown, TXT or HTML to EPUB Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark, no file cap. Whether you want a{' '}
          <strong>free markdown to epub converter online</strong>, a{' '}
          <strong>txt to epub converter online free no signup</strong>, or an{' '}
          <strong>html to epub converter free</strong> of gates, the steps are
          the same:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your file', 'Click the panel above and select one .md, .txt, .html or .htm file. The title fills in from the filename.'],
            ['Set title and author', 'Both go into the EPUB metadata, which is what your reader shows on the shelf. The title also names the download.'],
            ['Build and download', 'One click writes the EPUB and a status line confirms the finished size.'],
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
          That is the whole answer to{' '}
          <strong>how to make an EPUB from Markdown without a command-line
          toolchain</strong>: no flags, no templates, no build step. What
          decides the result is how your file is formatted, which is what the
          next two sections cover.
        </p>
      </section>

      {/* 3 */}
      <section id="chapters" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListTree className="w-6 h-6 text-orange-500 shrink-0" />
          3. How Chapters Are Decided: Your Headings Become the Table of Contents
        </h3>
        <p>
          An EPUB is a set of chapter files plus a table of contents that
          points at them. When someone says{' '}
          <strong>my ebook has no chapter breaks</strong>, or their{' '}
          <strong>epub table of contents is not showing chapters</strong>, the
          converter found no chapter boundary and wrote the book as one file.
        </p>
        <p>
          This tool uses one rule:{' '}
          <strong>every top-level or second-level heading starts a new chapter</strong>.
          In Markdown that is a line beginning with <code>#</code> or{' '}
          <code>##</code>; in HTML it is <code>&lt;h1&gt;</code> or{' '}
          <code>&lt;h2&gt;</code>. The heading text becomes the chapter name in
          the table of contents and each chapter is written as its own file.
          Text before the first heading becomes an opening chapter titled after
          the book. With no headings at all, the whole file becomes one chapter.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          The plain-text rule, with a before and after
        </h4>
        <p>
          A .txt file has no headings, so the tool infers them. Paragraphs are
          split on blank lines, and any block that is{' '}
          <strong>a single line of 80 characters or fewer, not ending in a
          full stop, comma, question mark, exclamation mark, semicolon or
          colon</strong>, is promoted to a chapter heading:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Before: no navigation
            </h4>
            <pre className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
{`It was a cold morning when the letter arrived.
She read it twice before putting it down.
Chapter two. The road north was empty...`}
            </pre>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
              No blank lines, no short unpunctuated line on its own. The whole
              story becomes one chapter.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              After: three chapters in the TOC
            </h4>
            <pre className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
{`Chapter One

It was a cold morning when the letter arrived.
She read it twice before putting it down.

Chapter Two

The road north was empty...`}
            </pre>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
              Each title sits alone between blank lines with no closing
              punctuation, so each one becomes a chapter.
            </p>
          </div>
        </div>
        <p>
          This is the fix for <strong>fanfiction txt to epub</strong> jobs, a
          novel draft, or any saved story where the{' '}
          <strong>txt file shows as one long chapter on Kindle</strong>. For a{' '}
          <strong>markdown to epub with table of contents</strong> that maps to
          your outline, use <code>#</code> for parts and <code>##</code> for
          chapters; <code>###</code> and below stay as headings inside a
          chapter, because only the first two levels split.
        </p>
      </section>

      {/* 4 */}
      <section id="markdown-support" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          4. Which Markdown Is Supported, and What Happens to HTML
        </h3>
        <p>
          The <strong>markdown to epub</strong> path understands the everyday
          subset most writing uses. It is better to know the edges now than in
          the finished book.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Supported
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Headings from <code>#</code> to <code>######</code>, unordered
              lists with <code>-</code>, <code>*</code> or <code>+</code>,
              ordered lists with <code>1.</code> or <code>1)</code>, horizontal
              rules, paragraphs, <strong>bold</strong>, <em>italic</em>, inline{' '}
              <code>code</code> spans and <code>[links](url)</code>.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Not supported
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Fenced code blocks, blockquotes, tables, images, nested lists and
              raw HTML inside the Markdown. Those lines come through as plain
              text, unstyled.
            </p>
          </div>
        </div>
        <p>
          Name the file with a lowercase <strong>.md</strong> extension; an
          uppercase .MD is handled as plain text, and the same goes for .HTML.
          One file at a time: there is no batch mode and no preview before
          the download. This also makes the tool a
          clean route for <strong>Obsidian notes to EPUB</strong>: vault notes
          are ordinary Markdown, and a merged note with <code>##</code>{' '}
          headings reads on an e-reader as a properly chaptered book.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          When you convert an HTML file to EPUB
        </h4>
        <p>
          To <strong>convert an HTML file to EPUB</strong>, only the body of the
          page is used, and chapters split on <code>&lt;h1&gt;</code> and{' '}
          <code>&lt;h2&gt;</code> as above. Images are not packaged into the
          book, so a saved article with photographs arrives as text with gaps.
          A tidy export from a notes app converts more cleanly than a full page
          saved from a website; to keep a web page as a document, the{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web page as PDF tool
          </Link>{' '}
          is the better fit.
        </p>
      </section>

      {/* 5 */}
      <section id="kindle-and-validity" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why the EPUB Opens on Kindle and Passes as Valid
        </h3>
        <p>
          Two searches share one frustration:{' '}
          <strong>send to kindle epub not supported</strong> and{' '}
          <strong>epub file won&rsquo;t open, invalid</strong>. Both are usually
          a packaging problem. An EPUB is a zip archive with strict rules about
          what is inside and in what order, defined by the{' '}
          <a
            href="https://www.w3.org/TR/epub-33/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C EPUB 3.3 specification
          </a>
          . Hand-zipped folders break those rules and readers reject the file.
          The package this tool writes follows the specification deliberately:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The mimetype entry comes first and is stored uncompressed</strong>,
            the first thing any reader checks.
          </li>
          <li>
            <strong>A container file</strong> points at the package document,
            which carries your title, author, a unique identifier and a
            timestamp.
          </li>
          <li>
            <strong>Two tables of contents</strong>: the EPUB 3 navigation
            document modern readers use, and the NCX table that EPUB 2 readers
            and older devices expect. Both list the same chapters.
          </li>
          <li>
            <strong>One XHTML file per chapter</strong> in reading order, plus a
            small readable stylesheet.
          </li>
        </ul>
        <p>
          Send to Kindle accepts EPUB, which is why{' '}
          <strong>markdown to epub for Kindle</strong> no longer needs a MOBI
          step, and real chapter entries are what make the Kindle table of
          contents appear. To see the finished file inside, the{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          will open it like any zip.
        </p>
      </section>

      {/* 6 */}
      <section id="epub-to-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-orange-500 shrink-0" />
          6. EPUB to TXT and EPUB to HTML: The Other Direction
        </h3>
        <p>
          Select an .epub and the tool becomes an{' '}
          <strong>epub to txt converter online free</strong> of any signup, or an{' '}
          <strong>epub to html converter online</strong>, depending on the
          output you choose. It walks the book&rsquo;s spine and joins every
          chapter in reading order, so both EPUB 2 and EPUB 3 books work.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Single-file HTML
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              One page, each chapter in its own section, with a simple readable
              stylesheet. This is how to{' '}
              <strong>convert an EPUB to a single HTML file</strong> rather
              than a folder of fragments. The original CSS and fonts are not
              carried across, image tags survive but the image files do not,
              and the heading at the top of the page is a generic label you
              can edit.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Plain text
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every tag stripped, list items turned into bullets, paragraphs
              separated by a blank line and chapters by a wider gap. Bold,
              italic, footnote links and images are dropped. This is the answer
              to{' '}
              <strong>how to extract text from an EPUB</strong> when what you
              need is words, not layout.
            </p>
          </div>
        </div>
        <p>
          Plain text lets you{' '}
          <strong>copy text from an EPUB without a reader app</strong> that
          blocks selection, and it is the cleanest way to{' '}
          <strong>convert an EPUB to plain text for text to speech</strong> or
          translation. It cannot open a DRM-protected book: a locked file either fails
          with a read error or yields unreadable content. For a book you have as a PDF, the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-html" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to HTML converter
          </Link>{' '}
          gets the text out.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Markdown to EPUB Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Headings become chapters, documented', 'The one rule that decides your table of contents is written down on this page, not hidden behind an upload button.'],
            ['A spec-correct EPUB 3 package', 'Stored mimetype first, container file, package document, EPUB 3 nav and EPUB 2 NCX fallback. It is built to open on old readers, new readers and Kindle.'],
            ['Free, no signup, no watermark', 'No account, no email, no daily quota, no trial countdown. Both directions, neither behind a tier.'],
            ['Both directions in one place', 'Build an EPUB from Markdown, text or HTML, or take an EPUB apart into one HTML page or clean plain text.'],
            ['Your books stay private', 'Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.'],
            ['Honest about its limits', 'No PDF, no MOBI, no cover, no images. The page says so and points you to the right tool instead.'],
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
          </Link>
          : the{' '}
          <Link to="/tools/pdf-ebook" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to eBook converter
          </Link>
          , the{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive creator
          </Link>{' '}
          and the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          are a click away when a chaptered EPUB is only part of the job.
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
              'Is this markdown to epub converter really free with no signup?',
              'Yes. Choose a .md file, set the title and author, and download the EPUB. No account, no email step, no watermark, no size limit and no cap on how many times you use it.',
            ],
            [
              'Why does my EPUB table of contents show only one chapter?',
              'Because no chapter boundaries were found. Chapters split on # and ## in Markdown, or h1 and h2 in HTML. In a .txt file a chapter title must sit alone between blank lines, be 80 characters or fewer, and not end in punctuation.',
            ],
            [
              'Can I create an EPUB from a text file with no headings at all?',
              'You can, but the whole file becomes one chapter named after the book title. Add short unpunctuated title lines between blank lines wherever you want a break.',
            ],
            [
              'Will the EPUB work with Send to Kindle?',
              'Send to Kindle accepts EPUB, and the package this tool writes follows the EPUB 3 specification: stored mimetype first, container file, package document, EPUB 3 nav and EPUB 2 NCX. Files rejected as "not supported" are usually missing one of those.',
            ],
            [
              'Can it convert PDF to EPUB, or make a MOBI or AZW3 file?',
              'No. It accepts .md, .txt, .html, .htm and .epub, and writes EPUB, HTML or TXT. For a PDF, use our PDF to eBook tool. It also does not add a cover, package images, or set a metadata language other than English.',
            ],
            [
              'How do I extract text from an EPUB without a reader app?',
              'Choose the .epub, pick Plain Text Document, and download the .txt. Chapters arrive in reading order with tags stripped. It cannot open a DRM-protected book.',
            ],
            [
              'Are my files stored anywhere?',
              'No. Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.',
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
          Different starting point? The{' '}
          <Link to="/tools/pdf-ebook" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to eBook converter
          </Link>{' '}
          handles PDFs, the{' '}
          <Link to="/tools/pdf-html" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to HTML tool
          </Link>{' '}
          produces a page you can turn into a book here, and the{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          looks inside any EPUB. If you would rather understand how HTML and
          document structure actually work than just use them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts with exactly that.
        </p>
      </div>
    </article>
  );
}
