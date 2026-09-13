import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileCode,
  FileText,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to TXT, HTML, RTF, ODT tool.
 *
 * Same shape as the other tool guides. Facts match PdfToHtml.js with all four
 * formats enabled and lib/pdfTextExport.js: text-layer extraction (no OCR),
 * headings by font size (18pt+ / 14pt+), each visual line becomes a line or
 * paragraph, page range, four containers with the same structure. Nothing
 * about layout, images or tables is promised because none of it survives.
 */
export default function PdfTxtHtmlRtfOdtSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">PDF to Text</span>, HTML, RTF or ODT: Getting the Words Out in the Container You Actually Need
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Sometimes the layout is the point of a PDF. More often it is the
        obstacle: you want the words for a search, a script, a word processor
        that predates the PDF, an email, a LibreOffice document, or an
        assistant that reads plain text. This guide covers how to{' '}
        <strong>convert a PDF to text</strong> and to three richer containers
        &mdash; <strong>PDF to HTML</strong>, <strong>PDF to RTF</strong> and{' '}
        <strong>PDF to ODT</strong> &mdash; from the same page, what structure
        survives the trip, which format suits which job, and why a scanned PDF
        comes out empty until it has been through OCR.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-txt-html-rtf-odt.webp"
            alt="PDF to TXT, HTML, RTF and ODT converter online free - the text and headings of a PDF exported into four editable document formats"
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
              One extraction, four containers. The words and the headings
              travel; the layout stays behind on purpose.
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
            ['#which-format', '1. TXT, HTML, RTF or ODT: Which One You Need'],
            ['#how-to', '2. How to Convert a PDF to Text, HTML, RTF or ODT'],
            ['#what-survives', '3. What Survives the Trip, and What Does Not'],
            ['#scanned', '4. Scanned PDFs: Why the Output Is Empty, and the Fix'],
            ['#uses', '5. Six Jobs This Is Built For'],
            ['#docx', '6. Need Word? Use the Right Tool'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF to Text Converter'],
            ['#faq', '8. Frequently Asked Questions (FAQ)'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1 */}
      <section id="which-format" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          1. TXT, HTML, RTF or ODT: Which One You Need
        </h3>
        <p>
          All four outputs carry the same content: the document&rsquo;s text,
          with its headings recognised and marked. They differ in who can open
          them and what they can do next.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['TXT — plain text', 'Opens anywhere, forever. Headings are set off by a blank line, pages by a page-break character that editors show as a break. The right choice for search, scripts, spreadsheets, diffing two versions, or feeding a document to an assistant that reads plain text.'],
            ['HTML — a web page', 'Headings become <h1> and <h2>, everything else a paragraph, each PDF page its own section. Paste it into a site, an email, a wiki or a knowledge base. It previews on this page before you download.'],
            ['RTF — Rich Text Format', 'The lingua franca of word processors: Word of any age, WordPad, Pages, LibreOffice, Google Docs all open it. Headings are bold and larger, body text is 12 pt, and each PDF page starts on a new page. Choose this for the widest possible compatibility.'],
            ['ODT — OpenDocument Text', 'The native format of LibreOffice and OpenOffice Writer, also opened by Word and Google Docs. Real Heading 1 / Heading 2 / Text body styles, so the navigator and table of contents work the moment the file opens.'],
          ].map(([title, body]) => (
            <div key={title} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500 shrink-0" /> {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          ODT, for the record, is not a LibreOffice invention: it is the
          OpenDocument format maintained by the{' '}
          <a
            href="https://www.oasis-open.org/committees/office/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            OASIS Open Document technical committee
          </a>{' '}
          and adopted as an international standard, which is why governments
          and public bodies so often ask for it.
        </p>
        <p>
          If you are unsure: TXT when a program will read it, RTF when a person
          will, ODT when that person uses LibreOffice, HTML when it is going on
          a page.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert a PDF to Text, HTML, RTF or ODT
        </h3>
        <ol className="space-y-3">
          <li>
            <strong>Add the PDF.</strong> Drop it on the panel at the top of
            this page or click to choose it. The page count appears, and the
            page range defaults to the whole document; narrow it if you only
            want a chapter.
          </li>
          <li>
            <strong>Choose the output format.</strong> Plain text, HTML, RTF
            or ODT from the box. The button changes to say which one you are
            about to make.
          </li>
          <li>
            <strong>Convert and download.</strong> The file is named after
            the PDF with the new extension, and the status line reports how
            many pages went in and how large the result is. For HTML there is
            a preview right under the button.
          </li>
        </ol>
        <p>
          That is all there is to <strong>how to extract text from a PDF</strong>{' '}
          here. No account, no page counter, and nothing to configure that the
          extraction would not do sensibly on its own.
        </p>
      </section>

      {/* 3 */}
      <section id="what-survives" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-6 h-6 text-orange-500 shrink-0" />
          3. What Survives the Trip, and What Does Not
        </h3>
        <p>
          Being exact about this is the whole difference between a useful
          export and a disappointing one.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>The words survive</strong>, in reading order line by line,
            including accented and non-Latin characters &mdash; every output
            is Unicode-clean, and RTF carries them as the escapes Word
            expects.
          </li>
          <li>
            <strong>Headings survive as headings.</strong> Text set at 18 pt or
            larger becomes a top-level heading, 14 pt or larger a second-level
            one, so a report&rsquo;s structure is there in the navigator of
            Writer or the outline of Word, and as real heading tags in HTML. A
            heading that is merely bold at body size is treated as body text.
          </li>
          <li>
            <strong>Page boundaries survive</strong> as page breaks in RTF and
            ODT, sections in HTML, and a break character in TXT.
          </li>
          <li>
            <strong>Lines stay lines.</strong> Each visual line of the PDF
            becomes its own line or paragraph. For a report that is what you
            want; for flowing prose that was set in narrow columns, expect to
            join lines back into paragraphs in your editor, which a
            find-and-replace of line breaks does in seconds.
          </li>
          <li>
            <strong>Layout, images, tables, fonts, colours, links and form
            fields do not survive.</strong> This is a text export, not a
            layout conversion. A table comes out as its cell text in reading
            order.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section id="scanned" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Scanned PDFs: Why the Output Is Empty, and the Fix
        </h3>
        <p>
          The extraction reads the PDF&rsquo;s text layer &mdash; the actual
          characters a program placed on the page. A scanned document, a
          photographed contract or a PDF &ldquo;printed&rdquo; from an image
          has no text layer; each page is a picture of words, and a picture
          contains no characters to extract. Run one through here and you get
          a near-empty file, which is the honest result rather than a fault.
        </p>
        <p>
          The fix is optical character recognition. Put the scan through the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          first, which adds a real text layer to every page, then bring the
          result back here and export it to whichever container you need. The
          same goes for a PDF where copy-and-paste produces gibberish: that is
          a text layer with a broken font mapping, and OCR is again the route
          that recovers the words. A PDF that will not open at all because it
          is password-protected needs the{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF unlocker
          </Link>{' '}
          before anything else.
        </p>
      </section>

      {/* 5 */}
      <section id="uses" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          5. Six Jobs This Is Built For
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Feeding a document to an assistant', 'Plain text is what language tools read best. Export TXT, paste, and the headings still show where each section starts.'],
            ['Reviving a PDF in an old word processor', 'RTF opens in every version of Word ever shipped, in WordPad, and in Pages. When a colleague’s software cannot read anything newer, this is the file that works.'],
            ['Moving a document into LibreOffice', 'ODT arrives with real heading styles, so Writer’s navigator, numbering and table of contents work at once instead of after an afternoon of restyling.'],
            ['Publishing a PDF as a web page', 'HTML with h1, h2 and paragraph tags per page section, ready to paste into a site, a knowledge base or an email.'],
            ['Searching or comparing versions', 'Two TXT exports and a diff show exactly which sentences changed between revisions of a contract or a policy.'],
            ['Pulling one chapter out', 'Set the page range to the chapter you need and export only that — a fraction of the size and none of the rest.'],
          ].map(([title, body]) => (
            <div key={title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 */}
      <section id="docx" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. Need Word? Use the Right Tool
        </h3>
        <p>
          RTF and ODT both open in Word, and for a text-first document either
          is fine. But if what you actually want is a <strong>.docx</strong>{' '}
          &mdash; because a system demands that extension, or because you want
          the closest thing to the original layout &mdash; that is a different
          job and a different converter. The{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          writes DOCX directly. An e-reader wants the{' '}
          <Link to="/tools/pdf-ebook" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to eBook converter
          </Link>
          , which makes EPUB; a spreadsheet wants the{' '}
          <Link to="/tools/pdf-spreadsheet-suite" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF spreadsheet suite
          </Link>
          , which keeps tables as tables. And if HTML on its own is the whole
          job, the{' '}
          <Link to="/tools/pdf-html" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to HTML page
          </Link>{' '}
          is the same extraction with a page that talks only about that.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF to Text Converter
        </h3>
        <p>
          Plenty of sites will <strong>convert PDF to TXT</strong>. Here is
          what this page does differently, stated so you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card, no daily counter, no file-size cap set by policy. The tool on this page is the entire product.'],
            ['Four formats, one extraction', 'TXT, HTML, RTF and ODT from the same box, each written properly for the programs that open it — not four thin pages redirecting to one engine.'],
            ['Headings kept as headings', 'Real heading styles in ODT, bold larger headings in RTF, h1/h2 in HTML, spacing in TXT. Structure you can navigate, not a flat dump.'],
            ['Your documents stay private', 'Files are never stored on our servers, never queued, never logged and never retained after your session, and never used for training.'],
            ['Honest about scans', 'A scanned PDF is told apart from a text PDF and routed to OCR, rather than handing you an empty file with no explanation.'],
            ['Page range, page breaks', 'Export a chapter rather than a book, and keep page boundaries in the output so a reference like "see page 12" still means something.'],
          ].map(([title, body]) => (
            <div key={title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          It is one of a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on the same terms.
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
              'How do I convert a PDF to plain text for free?',
              'Add the PDF to the tool at the top of this page, choose Plain text in the output box, and press Convert. A .txt file named after the PDF downloads, with a blank line before each heading and a page-break character between pages. No account, no watermark, no page limit.',
            ],
            [
              'What is the difference between RTF and ODT?',
              'Both are editable word-processor documents with the same content. RTF is the older, universal format that every version of Word, WordPad and Pages opens; ODT is the native format of LibreOffice and OpenOffice, also opened by Word and Google Docs, and it carries real Heading 1 and Heading 2 styles. Pick RTF for maximum compatibility and ODT if you or your reader use LibreOffice.',
            ],
            [
              'Why is my output empty or almost empty?',
              'The PDF has no text layer — it is a scan or a photograph of a document, so there are no characters to extract. Run it through the PDF OCR tool first to add a text layer, then export it here. The same applies when copy-and-paste from the PDF gives you gibberish.',
            ],
            [
              'Are headings kept?',
              'Yes, by size: text at 18 pt or larger becomes a top heading and 14 pt or larger a subheading, in all four formats. A heading that is only bold at body size is treated as ordinary text.',
            ],
            [
              'Do images and tables come through?',
              'No. This is a text export: the words and the heading structure travel; layout, images, fonts, colours and links stay behind. A table arrives as its cell text in reading order. For a spreadsheet with tables kept as tables, use the PDF spreadsheet suite.',
            ],
            [
              'Can I convert only some pages?',
              'Yes. After adding the PDF, set the from and to page numbers before converting. Only that range is extracted, and the page breaks in the output match it.',
            ],
            [
              'Will accented or non-Latin text survive?',
              'Yes. TXT, HTML and ODT are written as UTF-8, and RTF carries every non-ASCII character as the Unicode escape Word and LibreOffice expect, so Urdu, Arabic, Chinese or accented European text opens correctly.',
            ],
            [
              'Is my PDF kept anywhere?',
              'No. Files are never stored on our servers, never queued or logged, and never retained after your session or used for training. The exported file is a new document; your PDF is left exactly as it was.',
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
          Words extracted? Keep only the pages you need first with the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page extractor
          </Link>
          , merge several sources with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , or make a scan searchable with the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>
          . And if you would rather understand how documents are parsed than
          only convert them, our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          covers text processing from the first week.
        </p>
      </div>
    </article>
  );
}
