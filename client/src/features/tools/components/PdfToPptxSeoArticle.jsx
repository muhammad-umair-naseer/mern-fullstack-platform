import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  Presentation,
  Settings2,
  ShieldAlert,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to PowerPoint tool.
 *
 * Written against what PdfToPptx.js actually does, which shapes this article
 * more than most. Every page is drawn as a lossless PNG and placed as one
 * full-slide picture, so the deck looks exactly like the PDF and none of it is
 * text you can edit in PowerPoint. Most searchers for the head term expect
 * editable slides, so the guide is built around the trade instead: fidelity
 * over editability, which is what the problem-aware queries (fonts changed,
 * text boxes everywhere, looks different in PowerPoint) are really asking
 * for. "Editable" is never promised, even though the tool's own subtitle
 * says it; PDF to Word is where that reader is sent.
 *
 * Declined on purpose: the privacy-mechanism keyword variants (house rule
 * against describing where the work happens — privacy is sold as an outcome
 * only), and "powerpoint won't open converted pptx" (the package ships
 * without a slide master and has not been verified across every PowerPoint
 * build, so the article never claims it opens cleanly everywhere). Google
 * Slides is mentioned as a format match, not a tested promise.
 *
 * Also fixed by the code: no page selection (every page becomes a slide, in
 * order), no password-protected input, one file per run, .pptx only, and the
 * page picture is stretched to the chosen ratio rather than letterboxed, so
 * portrait pages distort. Sections 4 and 5 say all of that plainly, because a
 * reader who expected a fitted A4 page will otherwise think the tool is broken.
 */
export default function PdfToPptxSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">PDF to PowerPoint</span> That Keeps the Exact Look of Every Page
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You have a PDF and a meeting. Rebuilding forty pages by hand is not an
        option, and the last time you tried a <strong>pdf to powerpoint</strong>{' '}
        converter it handed back a deck with every line in its own text box and
        half the fonts swapped. This tool takes the other road. It turns each
        page into one slide that looks exactly like the original &mdash; a{' '}
        <strong>pdf to pptx converter</strong> built for fidelity rather than
        editing. This guide explains what you get, the two settings that matter,
        and the honest limits of a picture-based deck.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-powerpoint.webp"
            alt="A projector and laptop on a table facing a seated audience in a bright room"
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
              Every page becomes one slide, in order, at 16:9 or 4:3, with the
              layout untouched.
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
            ['#what-you-get', '1. What PDF to PowerPoint Means Here: Slides You See, Not Edit'],
            ['#how-to-convert', '2. How to Convert PDF to PowerPoint Free Online'],
            ['#formatting', '3. Why Converters Mess Up Formatting, and Why This One Cannot'],
            ['#settings', '4. 16:9 or 4:3, and 150, 200 or 300 DPI'],
            ['#limits', '5. What This Tool Will Not Do, and Where to Go Instead'],
            ['#common-jobs', '6. The Jobs People Actually Use This For'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF to PowerPoint Converter'],
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
      <section id="what-you-get" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Presentation className="w-6 h-6 text-orange-500 shrink-0" />
          1. What PDF to PowerPoint Means Here: Slides You See, Not Edit
        </h3>
        <p>
          There are two very different things a <strong>pdf to powerpoint</strong>{' '}
          converter can mean by &ldquo;convert&rdquo;. The first tries to
          reverse-engineer the page: it guesses which letters were a paragraph,
          which lines were a table, which font was used, and rebuilds each guess
          as a PowerPoint object. The second draws the page exactly as a PDF
          viewer would and places that drawing on a slide. This tool does the
          second. Every page becomes one slide, in order, and every slide holds
          a single picture that fills it edge to edge.
        </p>
        <p>
          That matters because a PDF, as defined in the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 standard
          </a>
          , is a set of drawing instructions, not a document with paragraphs.
          It records where each glyph sits, not that the glyphs form a bullet
          list. Reconstructing the list is guesswork, and the guesses are what
          break. Drawing the page is not, which is why the output here looks
          identical to the original. The deck is written as a standard .pptx,
          the Office Open XML package described in{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-376
          </a>
          .
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The text is not selectable or editable.</strong> The slide is
            a picture of words. To change the words, edit the source and convert
            again, or use{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word
            </Link>{' '}
            when the goal is editing rather than presenting.
          </li>
          <li>
            <strong>Nothing is rearranged.</strong> Fonts, spacing, tables,
            charts and backgrounds stay exactly where they were.
          </li>
          <li>
            <strong>Every page becomes a slide.</strong> A forty-page report is a
            forty-slide deck; to convert part of it, trim the PDF first (section
            5).
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to PowerPoint Free Online (Step-by-Step)
        </h3>
        <p>
          No account, no email address and no watermark on the slides. Here is{' '}
          <strong>how to convert PDF to PowerPoint</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your PDF', 'Click the panel above and select a .pdf. The file is checked to be a genuine PDF, then thumbnails of the first four pages appear along with the page count.'],
            ['Pick a ratio and a quality', '16:9 for modern screens or 4:3 for older equipment; 150, 200 or 300 DPI depending on how sharp the slides need to be. Section 4 covers when to change the defaults.'],
            ['Convert and download', 'One button, a progress bar, and a .pptx named after your PDF. The result panel shows the file size and slide count before you save it.'],
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
          The steps are the same on a Mac as on Windows. If you arrived here
          searching for <strong>how to convert pdf to pptx on mac</strong> or for
          a way to <strong>convert pdf to powerpoint without adobe</strong>,
          nothing here depends on Acrobat, on which version of Office you own,
          or on the operating system in front of you.
        </p>
      </section>

      {/* 3 */}
      <section id="formatting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why Converters Mess Up Formatting, and Why This One Cannot
        </h3>
        <p>
          The most common complaint about <strong>pdf to ppt</strong> conversion
          is not that it fails. It is that it succeeds and the result is
          unusable. Search for{' '}
          <strong>pdf to powerpoint converter messed up formatting</strong> and
          the same three symptoms come up, all with one cause: the converter
          tried to turn drawn glyphs back into live objects.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Text boxes everywhere
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              An editable conversion has to decide where one paragraph ends and
              the next begins. When it cannot, it makes every line its own text
              box, and the slide looks fine until you click on it. That cannot
              happen here, because there are no text boxes. The slide is one
              picture.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Fonts changed
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A PDF can embed its fonts; PowerPoint uses whatever is available
              where the deck is opened. Recreate the text in a font that is not
              there and PowerPoint substitutes another, line widths change, and
              the layout collapses. A rendered slide carries the letterforms as
              pixels, so no font is ever looked up.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Looks different in PowerPoint
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tables become misaligned grids, charts lose their labels, logos
              drift. Something was interpreted between the file and the slide.
              Here nothing is, so what the PDF viewer shows is what the slide
              shows.
            </p>
          </div>
        </div>
        <p>
          If your search was <strong>pdf to ppt text boxes everywhere</strong>,{' '}
          <strong>pdf to powerpoint fonts changed</strong> or{' '}
          <strong>pdf looks different in powerpoint</strong>, you have met the
          first kind of converter. The trade in one sentence: an editable
          conversion gives you objects that may not look right; a rendered
          conversion gives you slides that always look right and cannot be
          edited. Anyone typing{' '}
          <strong>pdf to powerpoint keep exact layout</strong> already knows
          which side they are on.
        </p>
      </section>

      {/* 4 */}
      <section id="settings" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. 16:9 or 4:3, and 150, 200 or 300 DPI: The Two Settings
        </h3>
        <p>
          Two dropdowns: one decides the shape of the deck, the other its size.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Slide aspect ratio
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              16:9 is the default and the right choice for any modern projector,
              laptop or television; the slide measures 13.333 by 7.5 inches, the
              same widescreen size PowerPoint itself creates. Choose 4:3, at 10
              by 7.5 inches, for older projectors, some lecture halls, or when
              the slides will be pasted into an existing 4:3 deck.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Render quality
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              150 DPI is compact and sharp enough for on-screen use. 200 DPI is
              the balance for large screens and slides people will zoom into.
              300 DPI is for decks that will be printed or shown on a very large
              display: small text stays crisp, and the file grows to match.
            </p>
          </div>
        </div>
        <p>
          So <strong>pdf to powerpoint 16:9</strong> at 150 DPI is the everyday
          setting, <strong>pdf to powerpoint 4:3</strong> is for the older room,
          and <strong>pdf to powerpoint 300 dpi</strong> is for a deck that has
          to survive a print run. Every slide picture is stored as lossless PNG
          rather than JPEG, so fine text never smudges; the cost is that a 300
          DPI deck of a long document is a large file.
        </p>
        <p>
          <strong>One thing to check before you convert: the shape of your
          pages.</strong> The picture on each slide is stretched to fill the
          slide, not letterboxed. A landscape PDF exported from a slide deck
          already matches 16:9 or 4:3 and comes out perfectly. A portrait A4 or
          Letter page matches neither and will be widened to fit; the text stays
          readable, but the proportions are visibly off. For portrait documents,
          4:3 is the closer fit. If the pages must keep their exact proportions,
          export them with{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG
          </Link>{' '}
          and place each picture on a slide yourself. If landscape pages are
          stored sideways, run the file through{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate
          </Link>{' '}
          first so the slides come out upright.
        </p>
      </section>

      {/* 5 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          5. What This Tool Will Not Do, and Where to Go Instead
        </h3>
        <p>
          A converter that is honest about its limits saves you an afternoon.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>It does not produce editable text, shapes or tables.</strong>{' '}
            Every slide is a picture. If the point is to edit,{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word
            </Link>{' '}
            gives you live text to copy into PowerPoint.
          </li>
          <li>
            <strong>It does not run OCR.</strong> A scanned PDF stays a scan.
            Run{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>{' '}
            if the document itself needs a text layer.
          </li>
          <li>
            <strong>It does not let you pick pages.</strong> Every page becomes
            a slide, always, in order. To convert only chapter three, use{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages from PDF
            </Link>{' '}
            or the{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF splitter
            </Link>{' '}
            first, or drop the pages you do not want with the{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              page remover
            </Link>
            , then convert the shorter file. The{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>{' '}
            changes the running order.
          </li>
          <li>
            <strong>It does not open password-protected PDFs.</strong> An
            encrypted file shows &ldquo;Failed to load PDF&rdquo;; you need an
            unlocked copy.
          </li>
          <li>
            <strong>It converts one PDF at a time and writes .pptx only.</strong>{' '}
            No batch mode, no .ppt, .odp or Keynote output; for those, open the
            .pptx in your presentation software and use Save As.
          </li>
          <li>
            <strong>It adds no theme, transitions or speaker notes.</strong>{' '}
            For a branded template, paste the slides into your existing deck.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="common-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. The Jobs People Actually Use This For
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Presenting a PDF without rebuilding it.</strong> When you
            need to <strong>present a pdf in powerpoint</strong> &mdash; a
            report, a proposal, a portfolio &mdash; the fastest route is a deck
            that looks exactly like the document.
          </li>
          <li>
            <strong>Lecture handouts into a deck.</strong> People who want to{' '}
            <strong>convert lecture pdf to powerpoint</strong> want one page per
            slide and nothing moved. That is the exact{' '}
            <strong>convert pdf to slides one page per slide</strong> mapping
            this tool produces.
          </li>
          <li>
            <strong>Inserting PDF pages as pictures, minus the manual work.</strong>{' '}
            The usual advice for a deck that must match the PDF is to export
            each page as an image and insert them one at a time; that is the{' '}
            <strong>insert pdf pages into powerpoint as images</strong> routine,
            and this tool does all of it in one pass.
          </li>
          <li>
            <strong>Slides that cannot be quietly altered.</strong> Some people
            search <strong>pdf to pptx as images not editable</strong> on
            purpose: pricing sheets, terms, signed proposals. A picture slide
            cannot have a number nudged in a text box.
          </li>
          <li>
            <strong>Confidential material.</strong> For{' '}
            <strong>pdf to powerpoint confidential documents</strong> &mdash;
            legal bundles, financial statements, HR files &mdash; the question
            is what happens to the file. Nothing you convert is stored on our
            servers, retained after your session, or used for training or
            analytics.
          </li>
          <li>
            <strong>Getting into Google Slides.</strong> People looking for{' '}
            <strong>pdf to powerpoint for google slides</strong> need a .pptx,
            because that is the file type the import dialog asks for, and .pptx
            is what this tool writes. Check the first slide after importing, as
            with any converted file.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF to PowerPoint Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free online, with no daily cap', 'Searching for pdf to ppt unlimited free usually means a tool stopped you at the second file. There is no quota here, no trial countdown and no upgrade being withheld.'],
            ['No sign-up and no watermark', 'No account, no email, no stamp across the corner of every slide. A pdf to ppt converter no watermark should mean exactly that, and here it does.'],
            ['No page or file size limit', 'If a free tier rejected your file, this is pdf to powerpoint no file size limit in practice: no cap on pages and no size ceiling; a big file simply takes longer than a small one.'],
            ['Slides that match the PDF exactly', 'Because every slide is a rendered picture, fonts, tables and layouts cannot shift. What you saw in the PDF is what you present.'],
            ['Real settings, not a vague dropdown', 'Two named ratios and three named resolutions in DPI, so you can match the deck to the room and the file size to the job.'],
            ['Your files stay private', 'Nothing you convert is stored on our servers, retained after your session, or used to train anything.'],
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
          It sits with a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress
          </Link>{' '}
          the source,{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          two documents, or{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            password-protect
          </Link>{' '}
          the original afterwards, all free.
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
              'Is this a pdf to powerpoint free online tool with no sign up?',
              'Yes. Choose your PDF in the panel at the top of this page, pick a ratio and a quality, and download the .pptx. There is no account, no email step, no watermark and no daily limit. It is free every time, not free for the first few files.',
            ],
            [
              'Can I edit the text after I convert PDF to PowerPoint?',
              'No. Each slide is a single picture of the page, which is why the layout, fonts and tables come through exactly as designed. If you need live text to edit, convert the document with PDF to Word instead and copy what you need into PowerPoint.',
            ],
            [
              'Why does my portrait page look stretched on the slide?',
              'Because the page picture is stretched to fill the whole slide rather than fitted inside it, and a portrait A4 or Letter page is a different shape from a 16:9 or 4:3 slide. Choose 4:3 for the closer fit, or export the pages with PDF to JPG and insert them onto slides yourself.',
            ],
            [
              'Which DPI should I choose: 150, 200 or 300?',
              '150 DPI for a deck shown on a screen or emailed, 200 DPI for large displays or slides people will zoom into, and 300 DPI for anything that will be printed. Higher DPI means sharper small text and a larger file, because the slides are stored as lossless PNG.',
            ],
            [
              'Can I convert only some pages of my PDF?',
              'Not inside this tool; every page becomes a slide, in order. Use extract pages from PDF, the PDF splitter or the page remover first to make a shorter document, then convert that.',
            ],
            [
              'Does it work with scanned PDFs, and does it do OCR?',
              'A scanned PDF converts like any other, one page per slide, and looks exactly as the scan looked. No OCR is run, so the text on the slides is not selectable or searchable; if the document needs a text layer, run it through PDF OCR separately.',
            ],
            [
              'Will the .pptx open in Google Slides or Keynote?',
              'The file is written as a standard .pptx, the same type PowerPoint saves and the one Google Slides and Keynote import. Open the result and check the first slide before you rely on it, which is good practice with any converted deck.',
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
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          reorders pages before they become slides,{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          joins several documents into one deck-to-be,{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG
          </Link>{' '}
          exports single pages as images for a slide you build by hand, and{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>{' '}
          is the one you want when editing matters more than fidelity. To
          understand resolution, aspect ratio and colour rather than simply set
          them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers them from the beginning.
        </p>
      </div>
    </article>
  );
}
