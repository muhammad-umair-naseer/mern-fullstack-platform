import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Check,
  FileSearch,
  FileType,
  HelpCircle,
  Languages,
  Layers,
  ScanText,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF OCR tool.
 *
 * Same shape as PdfWordSeoArticle: an H2 beneath the page H1, an anchored
 * table of contents, H3 sections with icons, six benefit cards and an FAQ.
 *
 * Four decisions shaped this copy. Anyone editing it should keep them.
 *
 * 1. The single biggest keyword in this space is "searchable PDF" — people
 *    search for "make scanned pdf searchable", "ocr pdf to searchable pdf",
 *    "convert scanned pdf to searchable pdf". We DO NOT promise that, because
 *    the tool does not do it. It reads the pages and hands back recognised
 *    text: an on-screen panel, a copy button and a .txt download. It does not
 *    write a text layer back into the original PDF and re-emit the file.
 *    Section 3 exists purely to answer that query honestly rather than to sell
 *    against it. A page that explains the difference keeps the traffic and
 *    generates no complaints; a page that lies about it earns a refund inbox.
 *
 * 2. Likewise declined: "image to text", "jpg to text", "photo to text",
 *    "ocr pdf to word", "ocr pdf to excel". The dropzone takes one .pdf and
 *    nothing else, and the only output is plain text. Those queries are
 *    handled by pointing at the right tool, not by implying we do it here.
 *
 * 3. Privacy is stated as an outcome only — files are not stored, not queued,
 *    not retained, not used for training. How that is achieved is deliberately
 *    absent from every line of this file.
 *
 * 4. NO CANCEL IS PROMISED ANYWHERE, and nothing here invites a 200-page run.
 *    PdfOcr.js builds an AbortController but never calls .abort(), and every
 *    button in the component is gated behind `status !== 'scanning'`, so a run
 *    in progress has no on-screen control at all. Earlier drafts of this file
 *    sold "you can cancel at any point" in step 3 and a benefit card titled
 *    "Progress you can see, and cancel". Both were false and both are gone. If
 *    a stop button is ever wired to abortControllerRef.current.abort() and
 *    rendered while scanning, the claim may come back — not before. The same
 *    reason governs the long-document copy: performPdfOcr walks every page in
 *    order, rendering at scale 2.0 and recognising each canvas, so a very long
 *    document is a long run the user cannot escape. Section 7 says so and
 *    points at the splitter instead of cheering for a 200-page report.
 *
 * Everything factual here traces to PdfOcr.js and lib/pdfOcr.js: one .pdf per
 * run, a filename-only .pdf check at the dropzone, nine selectable recognition
 * languages, per-page progress messages, page-delimited combined text, a copy
 * button and a "<name>-ocr-text.txt" download. No size cap and no page cap
 * appear anywhere in the code, so the article says there is none — with the
 * practical caveat above, and claims nothing further. The copy button calls
 * navigator.clipboard.writeText without awaiting it, so the copy claim is
 * worded as an action, never as a guarantee, and the .txt download is named as
 * the dependable route.
 */
export default function PdfOcrSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">OCR a PDF</span>: Pull Real Text Out of Any Scanned Document
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You open a scanned contract, press Ctrl+F, search for a name you know is
        on page four, and get nothing. The document looks like text. To the
        software it is a photograph. That is the exact problem a{' '}
        <strong>PDF OCR</strong> tool solves: optical character recognition
        looks at the picture of a page and works out which letters it is looking
        at, so you can finally{' '}
        <strong>extract text from a scanned PDF</strong> instead of retyping it.
        This guide covers how to <strong>OCR a PDF free</strong>, which
        languages are supported, what you get back, and the one thing that
        decides whether the result is excellent or unusable.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. The alt text describes the real output —
          copyable plain text, not a searchable file. Section 3 and the FAQ both
          turn that promise down, so the alt must not make it. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-ocr.webp"
            alt="PDF OCR tool extracting the recognised text of a scanned document as copyable plain text"
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
              From a flat scan to words you can work with: optical character
              recognition turns pictures of letters back into real, readable
              text.
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
            ['#what-is-ocr', '1. What OCR Actually Does to a PDF'],
            ['#how-to-ocr', '2. How to OCR a PDF Online Free'],
            ['#searchable-pdf', '3. Searchable PDF vs Extracted Text'],
            ['#languages', '4. OCR in Nine Languages'],
            ['#scan-quality', '5. Scan Quality: The One Thing That Decides Accuracy'],
            ['#what-next', '6. What to Do With the Extracted Text'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF OCR Tool'],
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
      <section id="what-is-ocr" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What OCR Actually Does to a PDF
        </h3>
        <p>
          There are two completely different things people call a PDF, and
          almost every frustration in this area comes from not knowing which one
          you are holding.
        </p>
        <p>
          A <strong>digital PDF</strong> — exported from Word, a design tool or
          a web page — carries a text layer. Under the visible page there is a
          real list of characters with real positions, which is why you can
          select a sentence, copy it, and search the file. The{' '}
          <a
            href="https://www.iso.org/standard/51502.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-1 specification that defines PDF
          </a>{' '}
          treats that text layer as optional, and that single word explains
          everything that follows.
        </p>
        <p>
          A <strong>scanned PDF</strong> has no such layer. A scanner, a
          photocopier or a phone camera produced an image of a page and wrapped
          it in a PDF container. Your eyes see paragraphs; the file contains
          pixels and nothing else. Search finds nothing, selection highlights
          nothing, and a converter looking for text finds an empty shelf. This
          is why people end up searching for{' '}
          <strong>why can&rsquo;t I copy text from my PDF</strong> or{' '}
          <strong>PDF text not selectable</strong> — the text was never there.
        </p>
        <p>
          Optical character recognition is the bridge. An <strong>OCR
          scanner</strong> examines the shapes on each page, matches them
          against learned letterforms, and outputs the characters they
          represent, mapped to standard{' '}
          <a
            href="https://home.unicode.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Unicode code points
          </a>{' '}
          so accented letters, Arabic script and Devanagari all come out as
          themselves rather than as question marks. The result is real text you
          can copy, search, translate, paste into an email or feed into anything
          else. That is the entire job of the tool at the top of this page.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-ocr" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to OCR a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>convert a scanned PDF to text</strong> with the tool above,
          four steps:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Select your scanned PDF', 'Drop one .pdf onto the panel above or click to browse. Non-PDF files are turned away at the dropzone rather than failing partway through a run. It is one document per run, so pick the scan you want first.'],
            ['Choose the document language', 'Pick the language the document is actually written in from the dropdown. This matters more than people expect, and section 4 explains why.'],
            ['Run the extraction', 'Press the button. A progress readout names the page being rendered and the page being recognised, with a percentage beside it, so a long document never looks like it has stalled. A run goes through to the last page once it starts, so if you are unsure about the scan quality, try a short document first.'],
            ['Copy or download the text', 'The recognised text appears in a panel you can read and scroll. Press copy to put it on the clipboard — paste it once to confirm it landed — or download it as a .txt file named after your original document, which is the dependable route for anything long.'],
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
          Every page of the document is scanned, not just the first, and the
          output is delimited page by page so you always know which paragraph
          came from where. There is no watermark and no daily counter: one
          document per run, and as many runs as you care to do, which is the
          usual catch with a free tier elsewhere.
        </p>
      </section>

      {/* 3 */}
      <section id="searchable-pdf" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-orange-500 shrink-0" />
          3. Searchable PDF vs Extracted Text: Which One You Get
        </h3>
        <p>
          This is the most searched question in the whole category and it
          deserves a straight answer rather than a slogan, because the two
          outcomes people ask for are genuinely different things.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> What this tool gives you
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>The full recognised text of every page, on screen</li>
              <li>Page-by-page delimiters so nothing loses its place</li>
              <li>A copy button for the whole text in one press</li>
              <li>A .txt download named after your original file</li>
              <li>Text you can search, edit, translate or reuse anywhere</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> What it does not do
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Rewrite the original PDF with an invisible text layer</li>
              <li>Return a .docx, .xlsx or formatted output file</li>
              <li>Accept a JPG, PNG or photo on its own</li>
              <li>Take more than one document per run, or queue a batch</li>
              <li>Stop a scan once it has started, or resume a part-finished one</li>
              <li>Reproduce columns, tables or images as layout</li>
              <li>Open a password-protected or encrypted PDF</li>
            </ul>
          </div>
        </div>
        <p>
          So if you searched for{' '}
          <strong>make a scanned PDF searchable</strong> and what you actually
          need is the words — to quote them, index them, translate them, paste
          them into a case file or check whether a clause exists — this tool is
          exactly the right one and it is free. If you specifically need the
          original PDF handed back with a hidden text layer welded underneath
          the scan, that is a different operation and we would rather tell you
          now than after you have waited for a scan to finish.
        </p>
        <p>
          One related point worth knowing: if your PDF is <em>not</em> a scan —
          if you can already select the text with your cursor — you do not need
          OCR at all. Send it to the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          instead, which reads the existing text layer directly and rebuilds it
          as editable paragraphs. That route is faster and more accurate,
          because nothing has to be guessed from pixels.
        </p>
      </section>

      {/* 4 */}
      <section id="languages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Languages className="w-6 h-6 text-orange-500 shrink-0" />
          4. OCR in Nine Languages
        </h3>
        <p>
          Recognition is not language-neutral. The engine is deciding between
          letterforms that look alike, and knowing which alphabet and which
          vocabulary it is reading changes what it picks. Run a French document
          under English and accented characters get mangled; run an Urdu
          document under English and you get nonsense. Choosing the right
          language in the dropdown is the cheapest accuracy improvement
          available to you.
        </p>
        <p>The tool above supports nine recognition languages:</p>
        <div className="grid sm:grid-cols-3 gap-3 not-prose my-6">
          {[
            ['English', 'eng'],
            ['Spanish', 'spa'],
            ['French', 'fra'],
            ['German', 'deu'],
            ['Italian', 'ita'],
            ['Portuguese', 'por'],
            ['Arabic', 'ara'],
            ['Urdu', 'urd'],
            ['Hindi', 'hin'],
          ].map(([name, code]) => (
            <div
              key={code}
              className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
              <span className="text-xs font-mono text-orange-600 dark:text-orange-400 uppercase">{code}</span>
            </div>
          ))}
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Arabic, Urdu and Hindi OCR
        </h4>
        <p>
          Right-to-left and Indic scripts are where most free tools quietly give
          up, so it is worth calling out that <strong>Arabic OCR</strong>,{' '}
          <strong>Urdu OCR</strong> and <strong>Hindi OCR</strong> are all
          selectable here at no cost. Connected Arabic and Urdu letterforms are
          harder to recognise than separated Latin type, and a clean scan
          matters even more for them than it does for English, but the support
          is real and the output comes back as proper Unicode you can paste
          into any editor.
        </p>
        <p>
          One document, one language per run. A genuinely bilingual page — an
          English contract with Urdu annotations, say — is best handled by
          running it twice and keeping the good half of each result, or by
          pulling the relevant pages out first with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          and scanning each part under its own language.
        </p>
      </section>

      {/* 5 */}
      <section id="scan-quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-orange-500 shrink-0" />
          5. Scan Quality: The One Thing That Decides Accuracy
        </h3>
        <p>
          No optical character recognition on earth reads what is not legible.
          If you can barely make out a word yourself, the engine will not do
          better. The difference between an almost-perfect result and a page of
          gibberish is almost never the tool — it is the source. A few habits
          that change the outcome dramatically:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Scan at 300 DPI or higher.</strong> Below roughly 200 DPI
            the strokes that separate an &ldquo;e&rdquo; from a &ldquo;c&rdquo;
            stop existing, and no amount of processing invents them back.
          </li>
          <li>
            <strong>Keep the page straight.</strong> A few degrees of skew costs
            real accuracy, and nothing downstream can undo it — re-scan the page
            squarely if you still have the paper, because a tilted line of type
            is the single most common cause of a mangled result on an otherwise
            clean document.
          </li>
          <li>
            <strong>Turn sideways pages the right way up.</strong> That is a
            different problem from skew, and a fixable one. If a page came out
            of the scanner a full 90 or 180 degrees out, the{' '}
            <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF rotate tool
            </Link>{' '}
            turns it upright in quarter turns and saves the corrected file, and
            you scan that here instead.
          </li>
          <li>
            <strong>Light it evenly.</strong> Phone photos are the worst case:
            shadow across the gutter, glare on glossy paper, one corner
            brighter than the rest. Flat, even light beats an expensive camera.
          </li>
          <li>
            <strong>Prefer printed type to handwriting.</strong> Recognition is
            trained on typeset letterforms. Handwritten notes, signatures and
            stylised display fonts are unreliable and should be treated as a
            bonus rather than an expectation.
          </li>
          <li>
            <strong>Crop away the noise.</strong> Black scanner borders, a desk
            edge or half the facing page all give the engine extra shapes to
            misread. The{' '}
            <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF crop tool
            </Link>{' '}
            trims them out first.
          </li>
        </ul>
        <p>
          And always proofread. Even a clean scan will occasionally swap a 1 for
          an l or an O for a 0. For a quotation, an invoice figure or a legal
          reference, read the output against the page before you rely on it.
          Anyone advertising a guaranteed accuracy percentage on arbitrary
          documents is describing a marketing number, not a measured one.
        </p>
      </section>

      {/* 6 */}
      <section id="what-next" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileType className="w-6 h-6 text-orange-500 shrink-0" />
          6. What to Do With the Extracted Text
        </h3>
        <p>
          Plain text is the most portable thing a document can become, which is
          why it is the output here. Once you have it, everything downstream is
          easy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Editing.</strong> Paste it into Word, Google Docs,
            LibreOffice or Pages and format it however you like. This is the
            practical answer to <strong>scanned PDF to Word</strong> — get the
            words out, then style them once rather than fighting a converter&rsquo;s
            guess at your layout.
          </li>
          <li>
            <strong>Searching an archive.</strong> Run your scans through one at
            a time, keep each .txt file beside its PDF under the same name, and
            a folder of dead images becomes grep-able, indexable and quotable.
            There is no queue here, so this is a working session rather than a
            batch job — but it only has to be done once per document, and the
            .txt files are the thing you search from then on.
          </li>
          <li>
            <strong>Translation and summarising.</strong> Text pastes cleanly
            into any translation or assistant tool. Images do not.
          </li>
          <li>
            <strong>Data entry.</strong> If the scan is a table of figures, the
            recognised text gives you the numbers to work from. For PDFs that
            already carry a real text layer, the{' '}
            <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Excel tool
            </Link>{' '}
            is the better starting point because it is built around grid
            structure.
          </li>
          <li>
            <strong>Accessibility and compliance.</strong> A scan is invisible
            to a screen reader. Extracted text is not, so recognising a document
            is often the first step in making it usable at all.
          </li>
        </ul>
        <p>
          If the pictures matter as much as the words — figures in a paper,
          stamps on a form, photographs in a report — the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF tool
          </Link>{' '}
          pulls those out separately, and the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          turns whole pages into images you can drop into a slide deck.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanText className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF OCR Tool
        </h3>
        <p>
          Plenty of sites will <strong>OCR a PDF online</strong>. Most make it
          deliberately irritating until you pay: three pages free, a watermark,
          an email wall, a daily counter. Here is what is different, stated
          plainly enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email address, no credit card and no trial that expires. What you are using is the whole product.'],
            [
              'No page limit, no file size cap',
              <>
                There is no page limit and no file size cap coded into the tool
                — though a very long document is a long run, so work in sections
                if you are scanning hundreds of pages. The{' '}
                <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
                  PDF splitter
                </Link>{' '}
                breaks a big report into parts you can scan one after another.
              </>,
            ],
            ['Nine recognition languages', 'English, Spanish, French, German, Italian, Portuguese, Arabic, Urdu and Hindi — including the right-to-left and Indic scripts most free tools skip.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or profile anything.'],
            ['Progress you can see', 'A live readout names the page being rendered and the page being recognised, with a percentage, instead of an anonymous spinner that tells you nothing about where a long document has got to.'],
            ['Clean, usable output', 'Every page recognised and delimited, then a copy button or a .txt download named after your file. No watermark, no stamped footer, no locked preview.'],
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
          built on the same terms, so a scan you have just recognised can also
          be{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merged
          </Link>
          ,{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            reordered
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compressed
          </Link>{' '}
          without paying for any of it.
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
              'How do I OCR a PDF for free without installing anything?',
              'Open the tool at the top of this page, drop in one scanned PDF, choose the document language and run it. The recognised text appears on screen with a copy button and a .txt download. There is no sign-up, no watermark and no cap on how many documents you run — they simply go through one at a time rather than as a batch.',
            ],
            [
              'Why can I not select or search the text in my PDF?',
              'Because the page is an image, not text. Scanners, photocopiers and phone cameras produce a picture of the page wrapped in a PDF container, so there is nothing for search or selection to find. Optical character recognition reads those pixels and gives you the characters back.',
            ],
            [
              'Does this give me back a searchable PDF file?',
              'No, and it is worth being precise about that. It gives you the recognised text: on screen, with a copy button, and as a .txt download. It does not rewrite your original PDF with a hidden text layer inside it. If the words are what you need, this is the right tool; if you specifically need the PDF itself rebuilt with a text layer, that is a different operation.',
            ],
            [
              'Can I stop a scan once it has started?',
              'Not from the panel — once a run begins it works through to the last page, and there is no pause or resume. In practice that only matters on very long documents, which is the reason to split a hundred-page report into sections and scan them one part at a time rather than committing to the whole thing in one go. A short test document is also a cheap way to check the scan quality and the language setting before you start something big.',
            ],
            [
              'How long does a long document take?',
              'It depends on the page count and how dense each page is, and we will not quote a figure we have not measured on your file. What we can tell you is the shape of it: pages are handled one after another in order, so the time grows with the number of pages rather than staying flat, and the progress readout names the page it is on so you can judge the pace after the first few. For anything in the hundreds of pages, split it first.',
            ],
            [
              'Which languages can it recognise?',
              'Nine: English, Spanish, French, German, Italian, Portuguese, Arabic, Urdu and Hindi. Pick the one your document is actually written in before you run it, because recognising a French or Urdu page under English settings is the most common cause of a poor result.',
            ],
            [
              'Can I OCR a JPG, PNG or a photo of a page?',
              'Not directly — the dropzone takes .pdf files and nothing else, and the only output is plain text. If your source is a photo or an image, place it into a PDF first and then run it here.',
            ],
            [
              'Are my scanned documents private?',
              'Yes. Your files are never stored on our servers, never retained after your session, and never used for training or analytics. Nothing you scan is kept, queued or logged.',
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
          Working through a pile of scans? The{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          breaks a long document into manageable parts you can scan one at a
          time, the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          turns pages that came in sideways back upright in quarter turns, and
          the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          brings a heavy scan under an email limit once you are done. If you
          would rather understand how machines learn to read letterforms than
          simply use a tool that does, our free{' '}
          <Link to="/learn/ai-ml-essentials" className="text-orange-600 font-semibold underline hover:text-orange-700">
            AI and machine learning essentials course
          </Link>{' '}
          covers the pattern-recognition ideas that sit underneath optical
          character recognition.
        </p>
      </div>
    </article>
  );
}
