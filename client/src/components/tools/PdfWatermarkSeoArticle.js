import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  Grid3x3,
  HelpCircle,
  Image,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stamp,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Watermark tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Recipes over blurbs. Every recipe maps onto a real control (font, auto
 *    size, rotation, opacity, position, page range, "Place behind page
 *    content") so a reader can reproduce it exactly.
 *
 * 2. Removability is stated plainly. A watermark is ordinary page content;
 *    flatten plus protect raises the bar, nothing makes it permanent.
 *
 * 3. The limits are routed, not hidden: encrypted files go to the unlocker,
 *    photos to the image watermark tool, Word files to DOCX to PDF, numbering
 *    to the page-number tool, and non-Latin text to a logo image.
 */
export default function PdfWatermarkSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Add a Watermark to a PDF</span>: Text or Logo, Tiled or Centred, Over or Behind the Page
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A contract draft that must not be mistaken for the signed version. A
        passport scan a landlord asked for. A proposal that should carry your
        logo on every page. Each one is the same small job: you want to{' '}
        <strong>add a watermark to a PDF</strong> before it leaves your hands.
        This guide shows how to <strong>watermark a PDF</strong> for free with
        the tool above, gives four recipes that match its real settings, explains
        what opacity, rotation and &ldquo;behind the content&rdquo; actually do,
        and is honest about the one thing every <strong>PDF watermark</strong>{' '}
        shares: a determined person can remove it.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-watermark.webp"
            alt="Add watermark to PDF online free - a diagonal CONFIDENTIAL text watermark and a transparent PNG logo stamped across PDF pages"
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
              A word or a logo, on every page or only some, faint enough to read
              through and clear enough to notice.
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
            ['#what-is', '1. What a PDF Watermark Is, and When to Use One'],
            ['#how-to', '2. How to Add a Watermark to a PDF in Four Steps'],
            ['#recipes', '3. Four Recipes: Draft, Confidential, ID Copy, Logo'],
            ['#settings', '4. Watermark PDF Settings: Behind, Transparent, Tiled'],
            ['#specific-pages', '5. Specific Pages, Stacked Marks and the Limits'],
            ['#removable', '6. Can a PDF Watermark Be Removed? The Honest Answer'],
            ['#why-cortexis', '7. Why Use Cortexis to Watermark a PDF'],
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
      <section id="what-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a PDF Watermark Is, and When to Use One
        </h3>
        <p>
          A <strong>PDF watermark</strong> is a word or an image drawn onto the
          pages of a document, usually large, faint and at an angle, so that
          anyone who opens, prints or forwards the file sees it. It is a label,
          not a lock. It tells the reader what the document is or who it belongs
          to, and a screenshot or printout carries that message with it.
        </p>
        <p>
          Use one when a working version must not pass for the final, when a
          brief should not travel further, when an identity scan should be
          useless for anything but its one purpose, or when a quote or CV should
          be recognisably yours wherever it ends up. If what you
          need to mark is a photo rather than a document, the{' '}
          <Link to="/tools/image-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image watermark tool
          </Link>{' '}
          does the same for JPG and PNG files.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Add a Watermark to a PDF in Four Steps
        </h3>
        <p>
          Here is <strong>how to add a watermark to a PDF</strong> with the tool
          above. There is no account to create and no trial to start, which also
          answers <strong>how to watermark a PDF without Acrobat</strong>: you
          need nothing beyond this page.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your PDF.</strong> Drop it onto the panel or click to
            browse.
          </li>
          <li>
            <strong>Choose text or a logo.</strong> Under <em>Type</em>, pick{' '}
            <em>Text watermark</em> and type your word (it starts as
            CONFIDENTIAL), or pick <em>Image / logo watermark</em> and drop in a
            PNG, JPG or SVG.
          </li>
          <li>
            <strong>Set the look.</strong> Pick a position, an opacity and a
            rotation; for text, a font, size and colour. Leave <em>Pages</em>{' '}
            blank to mark every page, or type a range such as 1,3-5.
          </li>
          <li>
            <strong>Apply and download.</strong> Press <em>Apply watermark</em>,
            check the inline preview, and download the file named{' '}
            <strong>-watermarked.pdf</strong>. Your original is left untouched.
          </li>
        </ol>
        <p>
          Because it is an <strong>add watermark to PDF online</strong> page
          rather than an app, it works the same way to{' '}
          <strong>watermark a PDF on iPhone</strong>, Android or a desktop.
        </p>
      </section>

      {/* 3 */}
      <section id="recipes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Stamp className="w-6 h-6 text-orange-500 shrink-0" />
          3. Four Recipes: Draft, Confidential, ID Copy, Logo
        </h3>
        <p>
          Exact settings for the four jobs people bring here most.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Stamp className="w-5 h-5 text-orange-500 shrink-0" /> Draft or confidential stamp
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For <strong>how to add a draft watermark to PDF</strong> files, or{' '}
              <strong>how to add a confidential watermark to PDF</strong>{' '}
              reports: type DRAFT or CONFIDENTIAL, keep Helvetica Bold, Auto size,
              Centre, 45° and 30% opacity. That is the classic{' '}
              <strong>diagonal watermark PDF</strong> readers recognise at a
              glance, and the text underneath stays legible.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Grid3x3 className="w-5 h-5 text-orange-500 shrink-0" /> ID copy for a landlord or bank
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>watermark an ID copy PDF for a landlord</strong>, type
              something like &ldquo;COPY - Rental application only&rdquo;, choose{' '}
              <em>Tiled (repeat)</em>, Auto size and 25 to 35% opacity. A tiled
              mark leaves no clean corner to crop out.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Image className="w-5 h-5 text-orange-500 shrink-0" /> Logo behind a proposal
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>add a logo to a PDF</strong>, switch to{' '}
              <em>Image / logo watermark</em>, drop in your logo, set Logo size
              to about 40% of page width, Centre, 0° rotation, 15 to 20% opacity,
              and tick <em>Place behind page content</em>. The logo sits under the
              text like letterhead.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> Resume or portfolio mark
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>watermark a resume PDF</strong> without spoiling it, use
              your name or site in Helvetica at 24 pt, Bottom right, 0°, 40%
              opacity.
            </p>
          </div>
        </div>
        <p>
          A <strong>stamp COPY on PDF</strong> job is the first recipe with a
          different word: COPY or SAMPLE. And to{' '}
          <strong>add a DO NOT COPY watermark to PDF</strong> handouts, use the
          tiled recipe with that phrase, so every part of every page carries it.
        </p>
      </section>

      {/* 4 */}
      <section id="settings" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          4. Watermark PDF Settings: Behind, Transparent, Tiled
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Opacity (5 to 100%).</strong> This is the answer to{' '}
            <strong>how to make a watermark transparent in PDF</strong> files.
            The default is 30%; 15 to 20% suits a logo.
          </li>
          <li>
            <strong>Place behind page content.</strong> This is{' '}
            <strong>how to put a watermark behind text in PDF</strong> pages.
            The mark is drawn underneath the existing content. One caveat: on a scanned page, the whole page is a single
            picture, so a mark placed behind it is hidden. Leave the box
            unticked for scans and lower the opacity instead.
          </li>
          <li>
            <strong>Rotation (-90° to 90°).</strong> 45° is the default and gives
            the diagonal look; 0° suits corner marks and logos.
          </li>
          <li>
            <strong>Position.</strong> Centre, six edge and corner presets, or{' '}
            <em>Tiled (repeat)</em>. A <strong>tiled watermark PDF</strong>{' '}
            repeats the mark on a fixed grid spaced about a third of the
            page&rsquo;s longer side apart.
          </li>
          <li>
            <strong>Font size.</strong> <em>Auto (fit diagonal)</em> scales the
            text to span most of the page diagonal, or to fit a tile; fixed sizes
            run from 24 to 120 pt.
          </li>
        </ul>
        <p>
          If you already have a <strong>watermark covering text in a PDF</strong>{' '}
          you made, run the tool again on your original file, not the marked
          one, with lower opacity, the behind option, or a corner position. To{' '}
          <strong>add a transparent PNG logo watermark to PDF</strong> pages, use
          a PNG with a transparent background: no white box appears.
        </p>
      </section>

      {/* 5 */}
      <section id="specific-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          5. Specific Pages, Stacked Marks and the Limits
        </h3>
        <p>
          For <strong>how to add a watermark to specific pages in a PDF</strong>,
          type the pages into the <em>Pages</em> box: 1 for the cover only, 2-10
          for the body, or 1,3-5 for a mix. Numbers past the last page are ignored.
        </p>
        <p>
          Each run applies one watermark. To stack two, such as a logo in the
          corner and a DRAFT stamp across the middle, run the tool again on the
          downloaded file. The things it does not do, stated plainly:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>One PDF per run.</strong> There is no batch mode.
          </li>
          <li>
            <strong>Preset positions only.</strong> No dragging, custom
            coordinates or tile-spacing control.
          </li>
          <li>
            <strong>One line of text, built-in fonts only.</strong> No custom
            fonts and no multi-line text.
          </li>
          <li>
            <strong>No dynamic fields.</strong> Dates, recipient names and Bates
            numbers are not generated. For numbering, the{' '}
            <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF page numbers tool
            </Link>{' '}
            is the right one.
          </li>
          <li>
            <strong>PDFs only.</strong> Convert a Word file first with{' '}
            <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              DOCX to PDF
            </Link>{' '}
            or a spreadsheet with{' '}
            <Link to="/tools/xlsx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              XLSX to PDF
            </Link>
            , then watermark the result.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>PDF watermark text showing wrong characters?</strong> The
            five fonts cover Western European letters only, so Chinese, Japanese,
            Arabic, Cyrillic or emoji come out garbled. Save your text as a PNG
            image and use the logo mode instead.
          </p>
        </div>
      </section>

      {/* 6 */}
      <section id="removable" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Can a PDF Watermark Be Removed? The Honest Answer
        </h3>
        <p>
          Yes. <strong>Can a PDF watermark be removed</strong> is a fair
          question, and every honest answer is the same: a watermark is ordinary
          content drawn onto the page, as the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>{' '}
          PDF specification defines page content, and anyone with a capable PDF
          editor and enough patience can edit it out. That is true of marks made
          by any tool. What a watermark does well is deter casual misuse and
          make the purpose of a copy obvious.
        </p>
        <p>You can raise the bar in two ways:</p>
        <ul className="space-y-2">
          <li>
            <strong>Flatten it.</strong> Run the watermarked file through{' '}
            <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF flatten
            </Link>{' '}
            so form fields and annotations are merged into the page, leaving
            fewer separate pieces for someone to strip away.
          </li>
          <li>
            <strong>Restrict editing.</strong> Then add an owner password with the{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF password protector
            </Link>
            , which limits editing in readers that honour it.
          </li>
        </ul>
        <p>
          This tool does not remove watermarks, and no sibling tool does; the{' '}
          <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF redact tool
          </Link>{' '}
          can black out a region, which is a different thing. And if you{' '}
          <strong>cannot add a watermark to a password protected PDF</strong>,
          that is expected: encrypted files are refused with &ldquo;This PDF is
          encrypted&rdquo;. Remove the password with the{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF unlocker
          </Link>
          , watermark the copy, and protect it again if needed.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis to Watermark a PDF
        </h3>
        <p>
          Many pages promise to <strong>watermark PDF online free</strong>, then
          cap files per day or lock logo marks behind a plan. Here is what this{' '}
          <strong>PDF watermark tool</strong> offers instead.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no sign-up', 'A free PDF watermark without sign up: no account, no email and no card. Text and logo marks are both included.'],
            ['Text or logo, your choice', 'Type a word in one of five fonts and any colour, or drop in a PNG, JPG or SVG logo with its transparency kept.'],
            ['Real control over the look', 'Opacity from 5 to 100%, rotation from -90° to 90°, eight positions including a tiled pattern, and an option to sit behind the content.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after your session, which matters for contracts, CVs and ID copies.'],
            ['Nothing is used for training', 'Your documents are never used to train any model, and nothing is kept once you have your file.'],
            ['Text stays text', 'The mark becomes part of the page itself, not a floating layer, and any text that was selectable and searchable before stays that way.'],
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
              'How do I add a watermark to a PDF for free?',
              'Add your PDF to the tool at the top of this page, choose a text or logo watermark, set position, opacity and rotation, and press Apply watermark. Download the file named -watermarked.pdf. Your original is left as it was.',
            ],
            [
              'Is it safe to upload a PDF to watermark online?',
              'Your files are never stored on our servers and nothing is retained after your session. Your documents are never used for training. That said, remember that a watermark labels a copy; it does not lock it, so add a password with the PDF password protector if the file itself needs guarding.',
            ],
            [
              'Why does my watermark text show wrong characters?',
              'The built-in fonts cover Latin letters only, so Chinese, Japanese, Arabic, Cyrillic and emoji come out garbled. Save the text as a PNG image and use the Image / logo watermark mode instead.',
            ],
            [
              'Why does it say my PDF is encrypted?',
              'The file has password protection, which the watermark tool cannot open. Remove the password with the PDF unlocker, watermark the unlocked copy, then add a password again with the PDF password protector if you need one.',
            ],
            [
              'Can I watermark only some pages?',
              'Yes. Type the pages in the Pages box, for example 1 or 1,3-5, and leave it blank for every page.',
            ],
            [
              'Can I watermark several PDFs at once?',
              'No. The tool handles one PDF per run and there is no batch option. Combine them first with the PDF merger if one marked document suits you.',
            ],
            [
              'My watermark hides the text underneath. How do I fix it?',
              'Run the tool again on your unmarked original with a lower opacity, such as 20%, or tick Place behind page content. On scanned pages, lower the opacity instead, because a mark behind a scan is hidden by the scanned image.',
            ],
            [
              'Can I watermark a photo or a Word document here?',
              'This tool takes PDFs only. For JPG or PNG photos, use the image watermark tool. For Word or Excel files, convert them with DOCX to PDF or XLSX to PDF first, then watermark the PDF.',
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
          Marked and ready to send? Join several documents with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , shrink a heavy scan with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , or sign the final version with the{' '}
          <Link to="/tools/pdf-esign" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF e-sign tool
          </Link>
          . To design a logo worth watermarking, try our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
