import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  Check,
  CheckSquare,
  HelpCircle,
  Layers,
  Lock,
  MousePointerClick,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Tag,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Make PDF Fillable tool.
 *
 * Same shape as PdfWordSeoArticle: an H2 beneath the page's H1, an anchored
 * table of contents, H3 sections with H4 sub-points, a benefit grid, an FAQ
 * and a closing link block.
 *
 * Four decisions shaped the copy. They all matter if anyone edits this later.
 *
 * First, the builder places exactly two AcroForm widgets: text fields and
 * checkboxes. That is the entire set. The fattest keywords in this space are
 * "add signature to pdf", "pdf dropdown field", "radio buttons in pdf" and
 * "calculated form fields", and the tool does none of them, so none of them
 * are promised anywhere on the page. Section 7 exists solely to answer those
 * searchers straight and send them somewhere that actually helps. A page that
 * says "not this, but here is what does work" outranks a page that lies, and
 * it generates no support mail.
 *
 * Second, "fill out pdf form online" is a far bigger query than "make pdf
 * fillable" and is a completely different job — this tool creates the blanks,
 * it does not type into them. That split is stated in the lead, in section 1
 * and again in the FAQ so nobody arrives with the wrong expectation.
 *
 * Third, a placed field can be renamed, resized and deleted, but not dragged
 * to a new spot. Rather than hide that, section 4 turns it into a working
 * method: place, check, delete and re-place. Honest beats vague.
 *
 * Fourth, duplicate field names are the one save error a normal user will
 * genuinely hit — pressing Quick Form Template twice does it. Section 4 teaches
 * around it instead of leaving people staring at an error they cannot read.
 *
 * Privacy is sold strictly as an outcome: files are not stored, not retained,
 * not used for training. How that is achieved is deliberately absent.
 */
export default function PdfFormBuilderSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Make a PDF Fillable</span>: The Complete Guide to Interactive Form Fields
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Somebody sends you a form as a PDF. It has ruled lines to write on,
        little squares to tick, and nowhere at all to type. So you print it,
        fill it in by hand, photograph it on a kitchen table and send back
        something crooked and grey. The fix is to{' '}
        <strong>make a PDF fillable</strong> once, properly &mdash; drop real{' '}
        <strong>interactive form fields</strong> onto the page so that anyone who
        opens the file can click and type. This guide covers how to{' '}
        <strong>create a fillable PDF form free</strong>, where each field
        belongs, how to name fields so the answers come back usable, and what no
        honest <strong>fillable PDF creator</strong> should claim it can do.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/make-pdf-fillable.webp"
            alt="Make a PDF fillable online free - placing interactive text fields and checkboxes onto a flat PDF form"
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
              From flat page to working form: place text boxes and checkboxes
              exactly where the blanks are, then download a PDF people can
              genuinely type into.
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
            ['#what-is-fillable', '1. What a Fillable PDF Actually Is'],
            ['#how-to', '2. How to Make a PDF Fillable, Step by Step'],
            ['#field-types', '3. Text Fields and Checkboxes: Which Goes Where'],
            ['#naming-sizing', '4. Naming, Sizing and Default Values'],
            ['#scanned-forms', '5. Scanned Forms and Multi-Page Documents'],
            ['#sending', '6. Sending, Collecting and Locking the Finished Form'],
            ['#limits', '7. What This Fillable PDF Creator Will Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Fillable PDF Creator'],
            ['#faq', '9. Frequently Asked Questions (FAQ)'],
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
      <section id="what-is-fillable" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Fillable PDF Actually Is
        </h3>
        <p>
          Most forms you receive are <strong>flat PDFs</strong>. The page shows a
          line labelled &ldquo;Full name&rdquo;, but that line is just ink: a
          drawn rule with nothing behind it. Your reader has nothing to click
          because there is nothing there to click. This is the honest answer to
          the question people usually type in frustration &mdash;{' '}
          <em>why can&rsquo;t I type in this PDF?</em> &mdash; and it is not a
          fault in your reader software.
        </p>
        <p>
          An <strong>interactive PDF form</strong> is different. Alongside the
          drawn page it carries a second, invisible layer of widgets, described
          by the AcroForm model in{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000, the PDF specification
          </a>
          . Each widget has a rectangle, a type and a name. When a reader meets
          one it draws a live box, accepts a cursor and stores whatever gets
          typed under that name. Nothing about the original page is repainted or
          re-flowed; the artwork underneath is untouched.
        </p>
        <p>
          So &ldquo;<strong>convert PDF to fillable form</strong>&rdquo; is not a
          conversion at all &mdash; it is an addition. The tool at the top of this
          page shows you your document, you click where each blank sits, and the
          matching widgets are written into a fresh copy of the file. One
          distinction to be clear about before you start: this builder{' '}
          <strong>creates</strong> the blanks. It is not a form filler, and it
          does not type answers in for you. Making the form and completing the
          form are two separate jobs.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MousePointerClick className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Make a PDF Fillable, Step by Step
        </h3>
        <p>
          No account, no email address, no trial countdown. To{' '}
          <strong>create a fillable PDF online free</strong> with the builder
          above, four moves:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Open your PDF', 'Drop a .pdf onto the panel above or click to browse. Anything else is turned away with a plain message rather than a silent failure, so you always know where you stand.'],
            ['Pick a field type', 'Choose Text Field or Checkbox from the toolbar. Whichever is highlighted is what gets placed next, and you can switch between them as often as you like.'],
            ['Click where the blank is', 'Every click on the page drops a field at that spot. Use the page arrows to work through a long document — fields stay attached to the page you placed them on.'],
            ['Download the fillable PDF', 'Press download and the finished file arrives named after your original with -fillable-form on the end, so the source and the form never get confused.'],
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
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          The shortcut for standard forms
        </h4>
        <p>
          Most everyday forms open the same way: a name, an email, a date and a
          box confirming the terms. The <strong>Quick Form Template</strong>{' '}
          button lays exactly those four fields onto the page you are looking at
          in one press &mdash; three text fields and one checkbox, already named
          sensibly. Rename what you need, delete what you do not, carry on
          clicking for the rest. It turns a signup sheet or a consent form into a
          working <strong>editable PDF form</strong> in well under a minute.
        </p>
      </section>

      {/* 3 */}
      <section id="field-types" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          3. Text Fields and Checkboxes: Which Goes Where
        </h3>
        <p>
          The builder places two kinds of widget, and between them they cover the
          overwhelming majority of real paperwork. Knowing which to reach for is
          most of the skill.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-600 shrink-0" /> Use a text field for
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Names, addresses and phone numbers</li>
              <li>Dates, reference codes and invoice numbers</li>
              <li>Amounts, quantities and prices</li>
              <li>Job titles, departments and locations</li>
              <li>Short comment lines and reasons</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-sky-500/5 border border-sky-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sky-600 shrink-0" /> Use a checkbox for
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>&ldquo;I agree to the terms&rdquo; confirmations</li>
              <li>Yes / no answers on a consent form</li>
              <li>Tick lists where several answers can apply</li>
              <li>Opt-ins for a newsletter or a callback</li>
              <li>Attendance, stock and inspection sheets</li>
            </ul>
          </div>
        </div>
        <p>
          When you <strong>add text fields to a PDF</strong> they arrive as a
          wide, shallow rectangle sized for a line of writing; when you{' '}
          <strong>add a checkbox to a PDF</strong> you get a small square built to
          sit on a tick box. Both are outlined in blue with a pale tinted fill in
          the finished file, which is deliberate: it tells whoever opens the form
          exactly where they are expected to type, without anyone having to
          explain it. If a question needs one answer from several &mdash; the
          classic radio-button case &mdash; give each option its own checkbox and
          write &ldquo;tick one&rdquo; on the page. It is not elegant, but it is
          honest and it works in every reader.
        </p>
      </section>

      {/* 4 */}
      <section id="naming-sizing" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-6 h-6 text-orange-500 shrink-0" />
          4. Naming, Sizing and Default Values
        </h3>
        <p>
          Select any field you have placed and the properties panel opens on the
          right. Three things there are worth understanding properly, because
          they decide whether your form is a pleasure or a nuisance to complete.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Give every field a unique, meaningful name
        </h4>
        <p>
          The field name is the label the PDF stores your answer under, so{' '}
          <strong>PDF form field naming</strong> is not cosmetic. New fields are
          numbered for you, but <code>TextField_3</code> tells nobody anything
          later; <code>Invoice_Number</code> tells them everything. The one rule
          that bites: <strong>two fields cannot share a name</strong>. Press Quick
          Form Template twice and you will have two fields called{' '}
          <code>Full_Name</code>, and the download will stop with a save error
          instead of producing a broken form. Rename one of them and it goes
          through immediately.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Size the box to the answer
        </h4>
        <p>
          Width and height sliders stretch the selected field to sit neatly over
          the ruled line beneath it. A date wants something narrow; a full postal
          address wants the width of the page. Placement is by click, and a placed
          field is renamed, resized or removed rather than dragged, so the fastest
          way to work is to place a field, glance at it, and if it has landed
          badly delete it with its X and click again a few pixels over. Two
          seconds, and it costs nothing.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Pre-fill what you already know
        </h4>
        <p>
          Text fields take an optional default value that appears in the box the
          moment the form is opened. Put your company name, the current year or a
          standing reference in there and the person filling it in has less to
          type and less to get wrong. Leave it empty for anything genuinely
          personal. A running counter above the download button shows how many
          interactive fields the document now carries, which is the quickest way
          to check you have not missed a blank on page four.
        </p>
      </section>

      {/* 5 */}
      <section id="scanned-forms" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-orange-500 shrink-0" />
          5. Scanned Forms and Multi-Page Documents
        </h3>
        <p>
          A great many of the forms that need this treatment were paper first.
          Somebody scanned an application pack, or a supplier emailed a
          photographed sheet, and now it has to be completed on screen. Good
          news: to <strong>turn a scanned form into a fillable PDF</strong> you do
          not need any text in the file at all. Fields are positioned by where you
          click on the page, not by any text underneath, so a pure image scan
          takes fields exactly as happily as a typeset document.
        </p>
        <p>
          What a scan will not give you is searchable content, and that matters if
          you ever want to find the form again or copy a paragraph out of it. Run
          the file through our{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free PDF OCR tool
          </Link>{' '}
          first to add a real text layer, then come back here and place the
          fields. The order matters: OCR first, fields second.
        </p>
        <p>
          Long documents are handled a page at a time. The arrows step through the
          file, the page counter tells you where you are, and every field stays
          bound to the page it was placed on &mdash; page seven&rsquo;s fields do
          not wander onto page eight. If only part of a long pack actually needs
          completing, it is usually calmer to pull those sheets out first with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          or{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract the pages you need
          </Link>
          , build the form on those, and{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          the pack back together afterwards.
        </p>
      </section>

      {/* 6 */}
      <section id="sending" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500 shrink-0" />
          6. Sending, Collecting and Locking the Finished Form
        </h3>
        <p>
          Your download is an ordinary PDF that anyone can open in any reader on
          any operating system. Nothing needs installing at the other end and
          nobody needs an account to fill it in. Send it by email, attach it to a
          ticket, put it on a shared drive: it works the same everywhere, which is
          the entire reason forms live in this format.
        </p>
        <p>
          Ask people to type their answers, save the file and send it back. Two
          things are worth telling them, because they are where returned forms go
          wrong most often. First, answers must be saved with the document &mdash;
          a built-in preview window sometimes discards typing on close, so
          downloading the file and opening it in a proper reader is the safe
          route. Second, remind them to save under a new name, so ten replies do
          not all arrive called the same thing.
        </p>
        <p>
          When a completed form comes back and you want it fixed as final &mdash;
          for an archive, an audit trail or a client record &mdash; run it through
          the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flattener
          </Link>
          . Flattening burns the answers into the page so they can no longer be
          edited or cleared, which is the correct way to{' '}
          <strong>lock a filled PDF form</strong>. If the contents are sensitive,{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            add a password
          </Link>{' '}
          before it goes anywhere, and if the finished pack is too heavy for a
          mail server, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          will bring it down to size.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ban className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Fillable PDF Creator Will Not Do
        </h3>
        <p>
          Every tool has an edge, and knowing where this one sits saves you a
          wasted afternoon. Here is the honest list, along with what to do
          instead.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>It does not fill forms in.</strong> If you arrived wanting to{' '}
            <em>complete</em> a form somebody sent you, open it in your usual PDF
            reader &mdash; if it already has fields, you can type straight away.
            This builder is for creating the fields in the first place.
          </li>
          <li>
            <strong>No signature fields.</strong> Digital signature widgets and
            certificate-based signing are outside what this tool places. A common
            workaround is a text field labelled for a typed name plus a dated
            confirmation checkbox, which is enough for a great many internal
            processes but is not a cryptographic signature and should not be
            described as one.
          </li>
          <li>
            <strong>No dropdowns, radio groups or list boxes.</strong> Text fields
            and checkboxes are the full set. Multiple-choice questions are handled
            with one checkbox per option, as described above.
          </li>
          <li>
            <strong>No calculations, validation rules or required fields.</strong>{' '}
            Nothing in the finished form adds up a column or refuses to submit
            until a box is filled. If you need arithmetic on the answers, collect
            them and work in a spreadsheet &mdash; our{' '}
            <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Excel converter
            </Link>{' '}
            is built for exactly that handover.
          </li>
          <li>
            <strong>It does not rewrite the page underneath.</strong> Fields sit
            on top of your document; the existing wording, logos and layout are
            left exactly as they are. To change the words themselves, convert the
            file with the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word tool
            </Link>
            , edit it there, and bring the result back.
          </li>
          <li>
            <strong>Password-protected files must be unlocked first.</strong> A
            document that will not open without a password cannot be read here,
            and you will be told so plainly rather than left waiting.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Fillable PDF Creator
        </h3>
        <p>
          Plenty of sites will <strong>make a PDF fillable free</strong> right up
          to the moment you press download. Here is what is different, stated
          plainly enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no trial attached', 'No account, no email, no card and no seven-day countdown. What you are using is the whole product, not a preview of one.'],
            ['No watermark on your form', 'The PDF you download is clean. Nothing is stamped across the page and nothing is appended to the last sheet.'],
            ['Real AcroForm fields, not pictures', 'The output carries genuine interactive widgets that any standard reader recognises, so people can type into it and save their answers.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your visit and never used to train or analyse anything.'],
            ['No page or file count limits', 'Build one form or forty, on a two-page consent slip or a hundred-page pack. There is no counter quietly ticking down.'],
            ['A straight account of the limits', 'We tell you what the builder places and what it does not before you invest an hour in it, rather than after.'],
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
          built on the same terms, so once the form exists you can{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            reorder its pages
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            straighten a sideways scan
          </Link>{' '}
          without paying for any of it.
        </p>
      </section>

      {/* 9 */}
      <section id="faq" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          9. Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-6 mt-4">
          {[
            [
              'How do I make a PDF fillable for free without Acrobat?',
              'Open the builder at the top of this page, drop your PDF in, choose Text Field or Checkbox, and click on the page wherever a blank belongs. Press download and you have a fillable PDF. There is no sign-up, no watermark and no desktop software involved.',
            ],
            [
              'Why can I not type in the PDF somebody sent me?',
              'Because it is a flat document. The lines and boxes you can see are drawn artwork with no interactive fields behind them, so there is nothing for your reader to put a cursor in. Run it through this tool, place fields over those blanks, and the copy you download will accept typing.',
            ],
            [
              'Can I use this to fill out a form instead of creating one?',
              'No, and it is worth being clear about it. This tool adds the empty fields to a document. Filling one in happens in whatever PDF reader you already use, once the form has fields. Making the form and completing the form are two different jobs.',
            ],
            [
              'Can I add a signature box, a dropdown or radio buttons?',
              'Not at present. The builder places text fields and checkboxes only. For a multiple-choice question, give each option its own checkbox and write "tick one" beside it. For sign-off, a named text field alongside a dated confirmation checkbox covers most everyday approvals, though it is not a cryptographic signature.',
            ],
            [
              'Will my fillable PDF work in every PDF reader?',
              'Yes. The fields written into your file are standard interactive form widgets defined by the PDF specification, so any mainstream reader on desktop, phone or tablet will display them and accept typing.',
            ],
            [
              'Why did my download fail with a save error?',
              'Almost always because two fields share a name — pressing Quick Form Template twice is the usual cause. Every field in a document needs its own identifier. Select one of the duplicates, give it a different name in the properties panel, and the download will complete.',
            ],
            [
              'Are my documents safe when I build a form?',
              'Your files are not stored on our servers, not retained once your session ends, and never used for training or analytics. Nothing you open here is kept, queued or logged.',
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
          Need something else from the same paperwork? Use the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flattener
          </Link>{' '}
          to lock a completed form, the{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF cropper
          </Link>{' '}
          to trim the margins off a badly scanned sheet, the{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            web page to PDF tool
          </Link>{' '}
          to turn an online form into a document you can build on, or the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code generator
          </Link>{' '}
          to put a link to your form on a printed poster. If you would rather
          understand how document tooling is built than simply use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the file and document APIs sitting behind tools like this one.
        </p>
      </div>
    </article>
  );
}
