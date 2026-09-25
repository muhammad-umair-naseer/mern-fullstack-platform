import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Type,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the DOCX to PDF tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The output is a re-flowed PDF in the standard PDF fonts, not a copy of
 *    Word's pages. Readers search "why did my formatting change", so
 *    section 4 says it up front.
 *
 * 2. A "will it convert well?" checklist, because the honest answer depends
 *    on the document: headings, lists, images and simple tables do; columns,
 *    text boxes, headers, footers, styled tables and non-Latin text do not.
 *
 * 3. Every gap routes somewhere real: Word's own Save as PDF for a faithful
 *    layout, pdf-page-numbers, pdf-merger, pdf-bookmarks, pdf-protect.
 */
export default function DocxToPdfSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">DOCX to PDF</span> for Free: Steps, Page Size, and What Survives the Trip
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A job portal that only takes a PDF CV. A tutor who wants the essay as a
        PDF by midnight. A contract nobody should quietly edit. Each time you
        have a Word file and need a PDF of it. This guide shows how to turn{' '}
        <strong>DOCX to PDF</strong> and <strong>Word to PDF</strong> with no
        copy of Word to hand, which page size to pick, what comes through
        cleanly, and when Word&rsquo;s own export is the better choice. To{' '}
        <strong>convert Word to PDF</strong> right now, use the tool above.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/docx-to-pdf.webp"
            alt="DOCX to PDF converter online free - a Word document with headings, bullet points and images turned into an A4 PDF, word to PDF with images"
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
              Headings, lists, links and pictures carry over into a clean PDF,
              on A4, US Letter, Legal or A5 paper with the margins you choose.
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
            ['#what-it-does', '1. Word to PDF: What It Does and When to Use It'],
            ['#how-to-convert', '2. How to Convert DOCX to PDF in Three Steps'],
            ['#checklist', '3. Will My Document Convert Well? A Checklist'],
            ['#fonts-formatting', '4. Why Fonts and Formatting Change in the PDF'],
            ['#situations', '5. CVs, Assignments, Contracts and Chromebooks'],
            ['#troubleshooting', '6. Converter Not Working? Fixes and Next Steps'],
            ['#why-cortexis', '7. Why Use Cortexis for Word to PDF'],
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
          1. Word to PDF: What It Does and When to Use It
        </h3>
        <p>
          A .docx file is the format Word has saved in by default for years,
          defined in the{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-376 Office Open XML standard
          </a>
          . It is built to be edited, and how it looks depends on the fonts
          and program of whoever opens it. A PDF, set out in{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          , is built to be read: pages are fixed and it opens the same way
          everywhere. That is why portals, universities and legal teams ask
          for PDFs.
        </p>
        <p>
          The tool reads one .docx file and writes a fresh PDF from it: your
          paragraphs, headings, lists, links and pictures, on the paper size
          you pick. Many people search <strong>doc to PDF</strong> when they
          mean any Word file, and for a .docx that is exactly what you get. An
          old-style .doc file from
          Word 97&ndash;2003 is a different format, and so are .odt, .rtf and
          .pages files; this tool reads only .docx. Re-save the file as .docx
          from the program that opened it, or try the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          for other document formats.
        </p>
        <p>
          It suits text-led documents: letters, essays, reports, policies,
          contracts and simply laid-out CVs. If yours relies on columns or a
          designed letterhead, read section 4 first.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert DOCX to PDF in Three Steps
        </h3>
        <p>
          This is <strong>how to save a Word document as a PDF</strong> with
          the tool above. There is no account to create and your original file
          is left untouched.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the Word document.</strong> Drop the .docx onto the
            panel under <em>1. Choose Word document</em>, or pick it from your
            files. One file is converted per run; if you drop several, the
            first is used.
          </li>
          <li>
            <strong>Set up the page.</strong> Under <em>2. Page setup</em>,
            choose a <em>Page size</em>: A4 (the default), US Letter, Legal or
            A5. Then set <em>Margins (pt)</em>. The default of 56 points is
            about 2 cm on every side, and any value from 18 to 120 is accepted.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert to PDF</em>.
            A preview appears with a download named after your document.
          </li>
        </ol>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> A4 for most of the world
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If you are wondering <strong>how to convert DOCX to PDF A4 size</strong>,
              change nothing: A4 is already selected, and it is the standard
              across most of the world outside North America.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> US Letter for North America
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For <strong>DOCX to PDF US Letter</strong>, pick US Letter from
              the list before converting. Legal and A5 are there too.
            </p>
          </div>
        </div>
        <p>
          The same page answers <strong>how to convert Word to PDF on phone</strong>:
          open it on Android or iPhone, tap the panel and choose the attachment.
          Only the way you pick the file changes.
        </p>
      </section>

      {/* 3 */}
      <section id="checklist" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          3. Will My Document Convert Well? A Checklist
        </h3>
        <p>
          It depends on what is in the file. Here is what comes through.
        </p>
        <p>
          <strong>Kept well:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Headings and structure.</strong> Title and Heading 1 to 6
            styles print in bold at sizes that step down from the title, so a{' '}
            <strong>DOCX to PDF keep headings and bullet points</strong> job
            works: bulleted and numbered lists keep their nesting, numbered 1.,
            2., 3. and bulleted with round markers.
          </li>
          <li>
            <strong>Text styling.</strong> Bold, italic, underline, font size
            and colour. Code fonts such as Consolas stay monospaced.
          </li>
          <li>
            <strong>Pictures.</strong> <strong>Word to PDF with images</strong>{' '}
            works for PNG, JPEG, GIF, WebP and BMP pictures placed in the text,
            shown at the size you gave them in Word.
          </li>
          <li>
            <strong>Layout basics.</strong> Left, centre and right alignment,
            left indents, spacing after paragraphs, manual page breaks and
            &ldquo;page break before&rdquo;.
          </li>
          <li>
            <strong>Links and edits.</strong> Hyperlink text shows blue and
            underlined. Tracked insertions are kept and tracked deletions left
            out. The document title and author carry over.
          </li>
        </ul>
        <p>
          <strong>Simplified or left out:</strong> headers, footers, footnotes,
          comments, multi-column sections, text boxes and SmartArt. Tables come
          through as plain grids of text, without shading, merged cells or bold
          cells. Justified paragraphs are set left-aligned. Older EMF and WMF
          drawings, common in documents with Visio diagrams, are dropped.
        </p>
        <p>
          <strong>Five minutes of prep that pays off.</strong> Before you
          convert, accept or reject any tracked changes so the PDF shows the
          wording you agreed. Move anything important out of a header, footer
          or text box and into the body, because those areas are not carried
          across. If a table matters, keep it simple: one header row, no merged
          cells, and short cell text. Replace any EMF or WMF diagram with a PNG
          or JPEG copy of it. Finally, give the file a clear title and author in
          Word&rsquo;s document properties, since those become the PDF&rsquo;s
          own title and author.
        </p>
      </section>

      {/* 4 */}
      <section id="fonts-formatting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          4. Why Fonts and Formatting Change in the PDF
        </h3>
        <p>
          If you are asking <strong>why do fonts change when converting Word to PDF</strong>,
          here is the plain answer for this tool. It does not copy Word&rsquo;s
          pages; it lays the document out afresh using the standard PDF fonts,
          Helvetica for ordinary text and Courier for monospaced text. Your
          original typefaces are not embedded, so a CV set in a designer font
          will arrive in a clean sans-serif. Line breaks and page breaks can
          fall in different places, the usual cause of{' '}
          <strong>Word to PDF formatting changes</strong>.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Non-Latin text prints as question marks.</strong> The
            standard fonts cover Western European alphabets only. Chinese,
            Japanese, Arabic, Hebrew, Cyrillic and Greek characters, and emoji,
            appear as &ldquo;?&rdquo; in the PDF. For those documents, use
            Word&rsquo;s own export described below.
          </p>
        </div>
        <p>
          When the exact look matters (a designed letterhead, a two-column
          newsletter, a document in Arabic), the faithful route is Word itself:
          open the file, choose <em>File</em>, then <em>Save As</em> or{' '}
          <em>Export</em>, and pick PDF. That keeps the original fonts,
          headers and footers. Use this tool when Word is not available, or when
          you want a tidy PDF of a text-led document that is never stored
          on our servers.
        </p>
      </section>

      {/* 5 */}
      <section id="situations" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange-500 shrink-0" />
          5. CVs, Assignments, Contracts and Chromebooks
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Convert resume DOCX to PDF</strong>, because many application portals ask for a PDF CV.
            Keep the CV to headings, bullet points and plain text, and check
            the preview; two-column templates are simplified.
          </li>
          <li>
            <strong>Convert assignment Word to PDF for submission</strong>: pick the paper size your institution uses, keep the default
            margins unless told otherwise, and add page numbers afterwards if
            required (section 6).
          </li>
          <li>
            <strong>Convert contract DOCX to PDF privately</strong>: files are
            never stored on our servers, nothing is retained, and nothing is
            used for training. Tracked deletions are dropped, so settle the
            redline in Word first.
          </li>
          <li>
            <strong>How to convert DOCX to PDF on Chromebook?</strong> Open this
            page in Chrome, choose the .docx from your Files app or Google
            Drive, and convert. The PDF saves to your Downloads folder.
          </li>
          <li>
            <strong>How to convert Word to PDF without Microsoft Office?</strong>{' '}
            You need no copy of Word and no Office subscription: add the .docx
            above and convert. The same goes for a library PC, a borrowed laptop, or when you{' '}
            <strong>convert Word to PDF on work computer without admin rights</strong>{' '}
            and Word is missing.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. Converter Not Working? Fixes and Next Steps
        </h3>
        <p>
          When a <strong>Word to PDF converter not working</strong> is the
          problem, the message says why. <em>Choose a .docx
          file first.</em> means nothing was selected. <em>Not a Word document
          (word/document.xml missing)</em> means the file is not a real .docx:
          usually a renamed .doc, an .odt or a damaged download. Save it again
          as .docx and retry. &ldquo;?&rdquo; in place of letters means a
          script the standard fonts do not cover (section 4).
        </p>
        <p>
          To{' '}
          <strong>convert Word to PDF and add page numbers</strong>, run the
          output through{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page numbers
          </Link>
          , since Word&rsquo;s own footers are not carried across. To{' '}
          <strong>merge Word documents into one PDF</strong>, convert each
          file in turn, then combine them with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          . Want a clickable outline built from your headings? Add it with{' '}
          <Link to="/tools/pdf-bookmarks" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF bookmarks
          </Link>
          . Spreadsheets have their own tool,{' '}
          <Link to="/tools/xlsx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Excel to PDF
          </Link>
          , and slide decks go through the{' '}
          <Link to="/tools/presentation-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            presentation converter
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis for Word to PDF
        </h3>
        <p>
          Searches like <strong>word to PDF converter free</strong>,{' '}
          <strong>DOCX to PDF converter online free</strong> and{' '}
          <strong>word to PDF no sign up no watermark</strong> exist because
          so many converters add a catch after the first file. Here, instead:
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no sign-up or watermark', 'No account, no email, no card and nothing stamped on your pages. The tool on this page is the whole product.'],
            ['No daily cap', 'A free DOCX to PDF tool unlimited by daily counters: convert one file, then the next, as often as you need.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after the conversion. CVs, contracts and HR letters stay yours.'],
            ['Never used for training', 'Your documents are never used to train models, and nothing from them is kept once your PDF is ready.'],
            ['Paper and margins you control', 'A4, US Letter, Legal or A5, with margins from 18 to 120 points, and a preview before you download.'],
            ['Honest about limits', 'We tell you what is simplified (columns, text boxes, headers, styled tables) and point you to the right route when it matters.'],
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
          built on the same terms. Need the PDF locked before you send it? The{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>{' '}
          adds a password in one step.
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
              'How do I convert DOCX to PDF for free?',
              'Add the .docx to the tool above, choose a page size and margins, press Convert to PDF and download the result. There is no account, no watermark and no daily limit.',
            ],
            [
              'Is it safe to convert Word to PDF online?',
              'It depends on the site. Here your files are never stored on our servers, nothing is retained after the conversion, and your documents are never used for training. That suits CVs, contracts and HR letters.',
            ],
            [
              'Why does my PDF look different from my Word document?',
              'The PDF is laid out afresh in Helvetica and Courier, so your original typefaces are not embedded and line breaks can move. Columns, text boxes, headers and table styling are simplified. When the exact look matters, save as PDF inside Word.',
            ],
            [
              'Can I convert a .doc, .odt or Google Docs file?',
              'No, only .docx files are read. Re-save the document as .docx, or download it from Google Docs as a Word document, then convert it here.',
            ],
            [
              'My Word attachment will not open. Can I get a PDF instead?',
              'Yes. A search like "docx file won\'t open need PDF" usually means Word is not available to you, so convert the .docx here and open the PDF in any reader. If the tool says it is not a Word document, ask the sender to save it again as .docx.',
            ],
            [
              'Are images and tables kept?',
              'PNG, JPEG, GIF, WebP and BMP pictures are kept at their Word size. Tables become plain text grids without shading or merged cells. EMF and WMF drawings are left out.',
            ],
            [
              'Can I convert several Word files at once?',
              'The tool converts one file per run. Convert each document in turn, then combine the PDFs into a single file with the PDF merger.',
            ],
            [
              'Will headers, footers and page numbers carry over?',
              'No, headers, footers and footnotes are not included in the PDF. Add page numbers afterwards with the PDF page numbers tool on the finished PDF.',
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
          PDF ready? Shrink it for email with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , sign it with{' '}
          <Link to="/tools/pdf-esign" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF eSign
          </Link>
          , mark it as a draft with the{' '}
          <Link to="/tools/pdf-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF watermark
          </Link>{' '}
          tool, or go the other way and turn a PDF back into an editable file
          with the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>
          . To build tools like this yourself, try our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
