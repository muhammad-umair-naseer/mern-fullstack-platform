import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  MousePointerClick,
  Save,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Rotate tool.
 *
 * Shaped like PdfWordSeoArticle: one H2 beneath the page H1, an anchored table
 * of contents, H3 sections with icons, a benefits block and an FAQ.
 *
 * Four decisions drove the copy, and they matter if anyone edits this later.
 *
 * First, the tool rotates in 90 degree steps only, because a PDF page carries a
 * rotation attribute the format defines as a multiple of 90. Two fat keyword
 * clusters therefore had to be declined rather than promised: "rotate pdf by 45
 * degrees" / "rotate pdf any angle", and the much larger "deskew pdf" /
 * "straighten crooked scanned pdf" family. Section 6 answers the question
 * behind both honestly instead of pretending. A crooked scan is a content
 * problem; page rotation cannot fix it, and saying so ranks better than a
 * promise that produces refund emails.
 *
 * Second, "batch rotate multiple pdf files" was also declined. The tool takes
 * one document at a time, though it will rotate every page inside that document
 * in one action, which is what most of those searchers actually want. Section 3
 * makes that distinction rather than burying it.
 *
 * Third, the copy is scoped to what the code actually guarantees. Two limits
 * are stated out loud rather than papered over, because both are real:
 *   - the save path rewrites the document properties block (producer name and
 *     modified date), so "nothing added" was replaced with "no watermark, no
 *     advertising page, no page content redrawn";
 *   - the save path regenerates form field appearances, so the lossless promise
 *     is scoped to page content and the form caveat is spelled out in
 *     sections 5 and 7 and in the FAQ.
 * No speed figure is claimed anywhere: the preview lays out every page before
 * the controls appear, so a long scan is honestly described as taking a minute.
 *
 * Fourth, privacy is sold strictly as an outcome. Files are not stored, not
 * queued, not retained, not used for training. How that is achieved is
 * deliberately absent from this file.
 */
export default function PdfRotateSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Rotate PDF Pages</span> and Save the New Orientation for Good
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A scanner fed the page in the wrong way round. A colleague photographed a
        signed form in landscape. Somewhere in a forty-page report, three pages
        arrive on their side and everybody has to tilt their head. You can{' '}
        <strong>rotate PDF pages</strong> and keep the change &mdash; the tool
        above lets you <strong>rotate PDF online free</strong>, page by page or
        all at once, at <strong>90, 180 or 270 degrees</strong>, and downloads a
        corrected file with no watermark, no advertising page and not a pixel of
        your page content redrawn. A short document is laid out in moments; a
        long scan needs a minute to lay out its thumbnails before you can turn
        anything. This guide covers how to{' '}
        <strong>rotate and save a PDF permanently</strong>, why a rotation
        sometimes springs back, and the jobs this tool honestly cannot do.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-rotate.webp"
            alt="A printed planner lying askew on sunlit wooden boards beside a leafy plant"
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
              Turn one stubborn page or an entire document upright, then download
              a PDF that opens the right way up everywhere.
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
            ['#sideways', '1. Why PDF Pages Open Sideways in the First Place'],
            ['#how-to-rotate', '2. How to Rotate PDF Pages Online Free (Step-by-Step)'],
            ['#single-or-all', '3. Rotate One Page, a Selection, or the Whole Document'],
            ['#angles', '4. 90, 180 and 270 Degrees: Picking the Right Angle'],
            ['#permanent', '5. How to Rotate a PDF and Save It Permanently'],
            ['#limits', '6. What Page Rotation Cannot Fix'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Rotator'],
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
      <section id="sideways" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why PDF Pages Open Sideways in the First Place
        </h3>
        <p>
          Every page in a PDF carries a small instruction telling a reader how far
          to turn it before drawing it on screen. It is a single number, and{' '}
          <a
            href="https://www.iso.org/standard/51502.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-1, the standard that defines PDF
          </a>
          , requires it to be a multiple of 90, which in practice means one of
          four orientations: upright, on its left side, upside down, or on its
          right side. Readers normalise anything outside 0&ndash;359 back into
          that set, so those four are the whole practical vocabulary. There is no
          fifth way for a page to sit.
        </p>
        <p>
          Which explains most of the ways a document ends up wrong. A sheet-fed
          scanner stamps whatever orientation it was told to; a phone camera
          records the way you were holding it; a printer driver marks an exported
          spreadsheet landscape while the pages around it stay portrait. None of
          that is corruption. The text and images sit exactly where they should
          &mdash; the page is carrying the wrong number, and every viewer repeats
          the mistake. When you <strong>rotate a PDF page</strong> here, you
          correct that number rather than redrawing what is printed on it.
        </p>
        <p>
          It also explains a constant frustration. Turning a page in your PDF
          reader usually changes only the view on your screen, so close the file
          and it is sideways again. To <strong>fix a sideways PDF</strong> for
          everyone who opens it, the number has to be rewritten and the file
          saved. That is what the tool at the top of this page does.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-rotate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Rotate PDF Pages Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>rotate a PDF online free</strong>, four steps:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Add your PDF', 'Drag a .pdf onto the panel above or click to browse. Files that are not PDFs are turned away with a plain message, and a damaged PDF says on screen that it could not be read rather than failing silently. Drop several files at once and only the first one is taken.'],
            ['Wait for the pages to lay out', 'Every page is turned into a thumbnail before the controls appear, with a percentage readout as it goes. A handful of pages is quick; a long scan will sit on that progress bar for a while, so it tells you how far along it is instead of freezing on a spinner.'],
            ['Turn what needs turning', 'Each thumbnail has its own left and right buttons and a readout of the angle applied. The thumbnail turns as you press, so the orientation you see is the orientation you get.'],
            ['Download the corrected file', 'Press Download Rotated PDF. It saves under your original name with -rotated on the end, so nothing is overwritten.'],
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
          That is the entire process to <strong>rotate PDF and save</strong> the
          result. Nothing is stamped across the output, there is no waiting room
          and no email-me-the-link step. Picked the wrong document? The
          change-file button clears everything and starts again.
        </p>
      </section>

      {/* 3 */}
      <section id="single-or-all" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MousePointerClick className="w-6 h-6 text-orange-500 shrink-0" />
          3. Rotate One Page, a Selection, or the Whole Document
        </h3>
        <p>
          Most rotation jobs fall into one of three shapes, and the tool handles
          all three from the same grid of thumbnails.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Rotate a single page in a PDF
        </h4>
        <p>
          The classic case: one page in an otherwise perfect document went in
          upside down. Use the small buttons underneath that thumbnail. Nothing
          else in the file is touched, which is what you want when you need to{' '}
          <strong>rotate only one page of a PDF</strong> and leave the other
          ninety-nine alone.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Rotate several specific pages
        </h4>
        <p>
          Click any thumbnail to select it &mdash; a tick replaces the page number
          and the card highlights. Select as many as you like, then use the
          toolbar buttons to turn them together. There is a Select All button for
          the whole grid, and clicking a selected page again removes it from the
          set, so a mixed job like &ldquo;every appendix table except the last
          one&rdquo; is a few clicks rather than a chore.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Rotate all pages at once
        </h4>
        <p>
          With nothing selected, the toolbar buttons apply to the entire document,
          so you can <strong>rotate all pages in a PDF</strong> with one press. A
          note for anyone searching for a <strong>bulk PDF rotator</strong>: this
          turns every page inside one document at a stroke, but it takes one
          document at a time. With several files to correct, the fastest route is
          to{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge them into one PDF
          </Link>{' '}
          first, rotate what needs rotating, then{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            split them back apart
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="angles" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          4. 90, 180 and 270 Degrees: Picking the Right Angle
        </h3>
        <p>
          The buttons turn in 90 degree steps, and pressing repeatedly walks
          through every orientation a PDF page can hold. The readout under each
          thumbnail shows where you have got to.
        </p>
        <div className="grid sm:grid-cols-3 gap-5 not-prose my-6">
          {[
            ['Rotate PDF 90 degrees', 'One press. The fix for a landscape scan in a portrait document. Press right if the text reads bottom-to-top, left if it reads top-to-bottom.'],
            ['Rotate PDF 180 degrees', 'Two presses in the same direction. The upside-down page, where a stack went into the scanner the wrong way up. Direction is irrelevant here.'],
            ['Rotate PDF 270 degrees', 'Three presses right, or one press left. Both land in the same place, so use whichever you reach first.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Rotation is cumulative and wraps around: four presses in one direction
          returns a page to where it started, which is the quickest way to undo a
          mistake. And because the tool adds your turn on top of whatever the page
          already carried, a document part-rotated by another program still ends
          up exactly where the readout says it will.
        </p>
      </section>

      {/* 5 */}
      <section id="permanent" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Save className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Rotate a PDF and Save It Permanently
        </h3>
        <p>
          &ldquo;It keeps going back&rdquo; is the most common complaint in this
          whole category, and it almost never means the file is broken. Most
          readers and preview panes offer rotation as a viewing convenience: you
          turn the page, read it, close the window, and the setting evaporates
          because it was never written into the document. Send that file on and it
          lands sideways for the next person too.
        </p>
        <p>
          The tool above writes the change into the file itself. Press download
          and you get a PDF whose pages genuinely carry the orientation you chose,
          so it opens, prints and arrives by email the right way up. That is what
          people mean when they search for a way to{' '}
          <strong>rotate PDF permanently</strong> rather than just on screen.
        </p>
        <p>
          One advantage worth spelling out: this is a{' '}
          <strong>lossless PDF rotation</strong> of your page content. The words,
          vectors and images on each page are never redrawn or recompressed &mdash;
          only the orientation instruction is rewritten. Text stays selectable,
          quality is identical and the file size barely moves. That is not true of
          workarounds that print pages to images and reassemble them, which
          quietly flatten your text into pictures. If you do want a flattened
          document deliberately, the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flatten tool
          </Link>{' '}
          is built for exactly that.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Two honest notes about the saved file
        </h4>
        <p>
          First, document properties. Saving refreshes the file&rsquo;s own
          properties block the way any PDF editor does: the producer entry names
          the library that wrote the file and the modified date is set to now, and
          a document with no creator or creation date recorded gets those filled
          in. Your pages are untouched by that &mdash; it is the paperwork around
          them, and if you need a file whose properties are identical to the
          original, rotation of any kind is not the tool for the job.
        </p>
        <p>
          Second, fillable forms. If the document contains form fields, saving
          regenerates how those fields are drawn, so a filled-in or unusually
          styled form can come back looking slightly different, and a form whose
          fields rely on a font the document does not properly carry can fail with
          a &ldquo;Failed to save rotated PDF&rdquo; message. Ordinary text
          documents, scans and exported reports are unaffected. If a form is
          giving you trouble, flatten it first with the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flatten tool
          </Link>{' '}
          and rotate the flattened copy, or build the form afresh with{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            make PDF fillable
          </Link>{' '}
          once the orientation is right.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Page Rotation Cannot Fix
        </h3>
        <p>
          Some of the most-searched phrases in this area describe jobs page
          rotation genuinely cannot do. Better to say so here than let you
          discover it after adding a file.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Rotating a PDF by 45 degrees or any custom angle
        </h4>
        <p>
          Not possible in any PDF tool, ours included: the format records a
          page&rsquo;s orientation in whole quarter turns and nothing in between.
          Anything claiming a free-form <strong>PDF rotation angle</strong> is
          either redrawing your page as a picture inside a larger one or quietly
          rounding to the nearest 90.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Straightening a crooked or skewed scan
        </h4>
        <p>
          If a page went through the scanner at a slight tilt, the whole page is
          not sideways &mdash; the content drawn on it is at an angle. Rotating in
          90 degree steps moves the tilt around without removing it. There is no{' '}
          <strong>deskew</strong> feature here and we will not pretend otherwise.
          The realistic fix is to rescan the sheet squarely; if that is not
          possible, run the page through our{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR tool
          </Link>{' '}
          so the text at least becomes searchable, then tidy the framing with the{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop tool
          </Link>
          .
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Mirroring, flipping or reordering pages
        </h4>
        <p>
          Rotation turns a page; it does not mirror it, and 180 degrees is not a
          horizontal flip. Nor does it change the order pages appear in. To move
          pages around, use the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>
          , and to drop unwanted ones entirely use the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>
          . Password-protected documents need to be unlocked before any tool can
          read their pages, including this one.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Rotator
        </h3>
        <p>
          Rather than a comparison table nobody can verify, here is what this tool
          gives you, stated plainly enough that you can check every line yourself
          against the file you download.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, every time', 'No account, no email address, no card and no trial that expires after three documents. What you are using is the whole product.'],
            ['Per-page control, not all-or-nothing', 'Turn one page, a handful you pick by clicking, or the whole document, all from the same grid of thumbnails.'],
            ['You see the orientation before you save', 'Each page shows as a thumbnail that turns as you press, with the current angle underneath, so the orientation you see is the orientation you get.'],
            ['No watermark, no advertising page', 'Nothing is stamped across your pages and nothing is appended to the end of the document. Saving refreshes the file’s properties block the way any editor does; your page content is left as it was.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Page quality is untouched', 'Text stays selectable and images are not recompressed, because page content is never redrawn. Form field appearances are the one exception, and section 5 explains it.'],
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
        <p className="flex items-start gap-2">
          <Smartphone className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
          <span>
            It works from a phone as comfortably as from a laptop, so{' '}
            <strong>rotating a PDF on mobile</strong> needs no app store detour.
            On a phone, a 300-page document is simply a lot of thumbnails to
            scroll through, so a larger screen is easier to work through for long
            files. It sits alongside a wider set of{' '}
            <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
              free document tools
            </Link>{' '}
            built on the same terms.
          </span>
        </p>
      </section>

      {/* 8 */}
      <section id="faq" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500 shrink-0" />
          8. Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-6 mt-4">
          {[
            [
              'How do I rotate PDF pages and save them for free?',
              'Open the rotator at the top of this page, add your PDF, wait for the thumbnails to lay out, use the left and right buttons on any page you want turned, then press download. The saved file carries the new orientation, so it opens the right way up for anybody you send it to.',
            ],
            [
              'Why does my PDF go back to sideways after I rotate it?',
              'Because most readers rotate the view rather than the document, so the turn disappears when you close the window. Rotating here rewrites the orientation into the file itself, which is why the change survives sending and printing.',
            ],
            [
              'Can I rotate just one page of a PDF instead of all of them?',
              'Yes. Every thumbnail has its own rotate-left and rotate-right buttons, and the rest of the document is left exactly as it was. You can also click several pages to select them and turn only those together.',
            ],
            [
              'Can I rotate a PDF by 45 degrees or some other custom angle?',
              'No, and no PDF tool can. The format records a page’s rotation in whole quarter turns, which leaves four orientations: upright, on its left side, upside down, or on its right side. A slightly crooked page is a scanning problem rather than a rotation one, and the honest fix is to rescan it straight.',
            ],
            [
              'Does rotating a PDF reduce its quality or make the file bigger?',
              'No. Your page content is never redrawn or recompressed, only the orientation instruction changes, so text stays selectable and the file size stays essentially the same. Two things do change in the saved copy: the document properties block is refreshed with a new producer entry and modified date, and if the file contains fillable form fields their appearance is regenerated.',
            ],
            [
              'How long does a big PDF take to open in the rotator?',
              'Every page is turned into a thumbnail before the rotate controls appear, so a few pages are ready almost immediately while a several-hundred-page scan needs a minute or so on the progress bar first. Nothing is lost while you wait, and the percentage readout keeps you posted.',
            ],
            [
              'What happens if I add something that is not a PDF?',
              'A file that is not a PDF is turned away with a plain message. A file that claims to be a PDF but is damaged or is really some other format shows an on-screen message saying it could not be read, rather than failing quietly. If you drop several files at once, only the first is taken, so add documents one at a time.',
            ],
            [
              'Is my document safe when I rotate it here?',
              'Your file is never stored on our servers, never retained after your session, and never used for training or analytics. Nothing is kept, queued or logged.',
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
          Once the orientation is right, the rest of the document usually needs
          something too. Use the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          to put the pages in the right order, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          to get a heavy scan under an email limit, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to pull a corrected page out as an image, or{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect
          </Link>{' '}
          to lock the finished file before sending it. And if you would rather
          understand how document software works than only use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how software of this kind is built.
        </p>
      </div>
    </article>
  );
}
