import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  MessageSquare,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Flatten tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections, six benefit cards, FAQ, closing link block.
 *
 * The copy is written against what PdfFlatten.js actually does. Read that file
 * before editing a word of this one, because several obvious-sounding claims
 * are false for this implementation:
 *
 *   - The "Annotations & Markup Layers" switch rebuilds each page with
 *     embedPdf() + drawPage(). pdf-lib's PDFPageEmbedder copies only Contents
 *     and Resources into the form XObject; /Annots is never read. So that
 *     option DELETES highlights, sticky notes, stamps and ink markup rather
 *     than baking them in. Filled field values survive only when the form
 *     switch ran first, because form.flatten() pushes the widget appearance
 *     XObjects into the page content stream before the rebuild happens.
 *     Never describe this option as preserving markup.
 *   - The read-only lock (option 3) is destroyed by that same rebuild:
 *     finalDoc = flattenedDoc has no AcroForm, so the fields and their values
 *     both vanish unless the annotations switch is off. The dependency is
 *     stated explicitly in the card.
 *   - The page-range control is dead code: both branches of the
 *     targetIndices check call the identical drawPage(). Section 5 says so.
 *   - Rotation set by the rotate tool lives in /Rotate. The rebuild sizes
 *     pages from getSize() (MediaBox) and writes no /Rotate, so rotating
 *     before flattening loses the rotation. The advice is flatten first.
 *   - Both loads pass ignoreEncryption: true, so an encrypted file produces
 *     unusable output with no warning. Never promise a graceful failure.
 *
 * Keywords deliberately NOT promised: "flatten pdf comments/annotations" (the
 * tool removes them), "redact pdf" (nothing is removed from the text layer and
 * the covering markup is not even kept), "flatten only pages 3-5" (inert
 * control), "flatten pdf to reduce file size" (nothing compresses). Each is
 * answered honestly in its section instead of being sold.
 *
 * Privacy is sold as an outcome only — files are not stored, not queued, not
 * retained, not used for training. How that is achieved is deliberately absent.
 */
export default function PdfFlattenSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Flatten a PDF</span>: Lock Filled Form Fields Into Fixed Pages
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You filled in the form, saved it, emailed it &mdash; and the person at
        the other end opened a blank one. Or the figures in your quote were
        still typeable when they arrived, so nothing about the total was
        final. Both are the same problem wearing different hats: your answers
        are still <em>live</em> field data rather than printed onto the page.
        To <strong>flatten a PDF</strong> is to bake those values into fixed
        page content so what you see is what everybody sees. This guide covers
        how to <strong>flatten a PDF online free</strong>, which switch to use
        to <strong>make a PDF uneditable</strong>, exactly what this tool does
        not carry across, and the one thing flattening is very often mistaken
        for.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/flatten-pdf.webp"
            alt="Pressed flowers laid flat across the pages of an open old book"
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
              From a live, editable form to a fixed page: filled answers become
              page content that travels intact.
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
            ['#what-is-flattening', '1. What It Means to Flatten a PDF'],
            ['#symptoms', '2. The Symptoms That Bring People Here'],
            ['#how-to-flatten', '3. How to Flatten a PDF Online Free'],
            ['#options', '4. Choosing What to Flatten: Forms, Markup or a Read-Only Lock'],
            ['#page-range', '5. Flattening Part of a Document'],
            ['#not-redaction', '6. What Flattening Is Not: Redaction, Encryption, Signing'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Flattener'],
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
      <section id="what-is-flattening" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What It Means to Flatten a PDF
        </h3>
        <p>
          A PDF page is not one thing. Underneath, it is a stack. At the bottom
          sits the page content stream &mdash; the fixed description of glyphs,
          lines and images that makes up the printed page. Floating above it are
          <em> annotations</em>: form fields you can type into, highlights,
          sticky notes, stamps, freehand markup and signature widgets. The{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2 specification that defines PDF
          </a>{' '}
          treats those two layers as genuinely separate objects, and every PDF
          reader is free to draw the floating ones its own way &mdash; or not
          at all.
        </p>
        <p>
          That freedom is the source of nearly every complaint about shared
          forms. When you <strong>flatten a PDF form</strong> here, the values
          you typed stop floating: they are written into the fixed page content
          and the fields themselves are removed. The result is a document whose
          answers appear the same in every reader, and that nobody can type
          over. In everyday language, this is how you{' '}
          <strong>make a PDF uneditable</strong> so the answers stay put.
        </p>
        <p>
          One thing to be straight about from the start, because it decides
          whether this is the right tool for your file. The second switch,{' '}
          <em>Annotations &amp; Markup Layers</em>, does not fold markup into
          the page. It rebuilds each page from the page content alone, so the
          file you download contains that content and nothing else. Comments,
          highlights, sticky notes, stamps and drawn ink are separate objects,
          and they are not carried into the rebuilt document. If your file
          carries review markup you need to keep,{' '}
          <strong>leave that switch off</strong> &mdash; section 4 explains
          what each switch is genuinely for, and section 2 covers what to do
          about markup instead.
        </p>
      </section>

      {/* 2 */}
      <section id="symptoms" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          2. The Symptoms That Bring People Here
        </h3>
        <p>
          Most people looking for a <strong>PDF flattener</strong> do not arrive
          knowing the word. They arrive with a symptom. If any of these sound
          familiar, flattening the form fields is the fix:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Your filled PDF form appears blank</strong> to the recipient,
            or on a phone, or in a mail client&rsquo;s preview pane. The values
            are there as live field data, but that reader is not drawing them.
          </li>
          <li>
            <strong>The form prints empty</strong> even though the screen shows
            your answers. Some print paths render page content only.
          </li>
          <li>
            <strong>Someone changed your numbers.</strong> An invoice or a quote
            went out with fields that were still typeable, so the total was not
            actually final.
          </li>
          <li>
            <strong>A signature field looks filled on your screen</strong> but
            not on theirs. A signature <em>widget</em> is a form field, so
            flattening the fields writes its appearance into the page for good.
          </li>
          <li>
            <strong>A reviewer keeps editing the copy you sent.</strong> Once
            the fields are gone there is nothing left to type into, so the
            version you circulated is the version that stays.
          </li>
        </ul>
        <p>
          The searches behind these read like{' '}
          <em>&ldquo;pdf form shows blank when emailed&rdquo;</em>,{' '}
          <em>&ldquo;stop people editing my pdf&rdquo;</em> or{' '}
          <em>&ldquo;flatten filled pdf form&rdquo;</em>. Every one of them ends
          at the same operation: write the field values into fixed page content,
          then send that file instead.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          If your symptom is about comments and markup, read this first
        </h4>
        <p>
          A different crowd arrives searching{' '}
          <em>&ldquo;merge comments into pdf&rdquo;</em> or{' '}
          <em>&ldquo;flatten pdf annotations&rdquo;</em>, usually because
          highlights drifted or a stamp did not survive a trip between apps.
          That is a real problem, but this tool is not its answer, and it is
          worth saying so before you run a contract through it. Nothing here
          converts a comment, a highlight, a stamp or a drawn note into page
          content. The markup switch discards those objects instead, so a
          reviewed document comes back clean of them.
        </p>
        <p>
          If the markup has to survive, the dependable route is to export a
          fixed copy from whichever app you added the comments in &mdash; most
          readers and review tools have a print-to-PDF or &ldquo;export with
          markup&rdquo; path that renders annotations into the page. Failing
          that, turning the pages into images with the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          and rebuilding from those images gives you a page that cannot lose
          anything it is already showing. Check the exported image actually
          contains your markup before you rely on it, and keep the original
          either way.
        </p>
      </section>

      {/* 3 */}
      <section id="how-to-flatten" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Flatten a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>flatten a PDF online free</strong> with the panel above, three
          steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your PDF', 'Drop a .pdf onto the panel or click to browse. A file that is not named .pdf is turned away straight away with a plain message.'],
            ['Read the inspection', 'The tool reports the page count, the file size and how many interactive form fields it found, so you know what you are dealing with before you commit.'],
            ['Choose and flatten', 'Tick what should become uneditable, press flatten, and download the finished file. It saves as your original name with -flattened added.'],
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
          The inspection step is worth a second of attention, because it tells
          you whether the main switch has anything to act on. If it counts
          fields, you have a real <strong>fillable PDF</strong> and the form
          switch is yours. If it reports <em>no interactive form fields</em>,
          your document is not a fillable form, and ticking the form switch will
          not change it &mdash; there is nothing to bake in, so the file comes
          back as it went in. Output is a single PDF, with no watermark and no
          cap on how many documents you run.
        </p>
        <p>
          One caveat on what you feed it. A password-protected PDF is not
          supported, and it does not announce itself &mdash; see section 6
          before you try one.
        </p>
      </section>

      {/* 4 */}
      <section id="options" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-orange-500 shrink-0" />
          4. Choosing What to Flatten: Forms, Markup or a Read-Only Lock
        </h3>
        <p>
          Most tools give you one button. This one gives you three switches, and
          they do genuinely different things &mdash; different enough that the
          wrong combination can cost you content. Read the three cards before
          you tick.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-orange-500 shrink-0" /> Interactive form fields
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Writes the current value of every text box, checkbox, radio button
              and signature widget into the page, then removes the fields
              themselves. The typed answers stay visible; the boxes stop being
              typeable. This is the switch for{' '}
              <strong>flatten a filled PDF form</strong>, and it is the one most
              people came for. It does nothing if the file has no fields.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500 shrink-0" /> Annotations &amp; markup layers
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Rebuilds every page from its page content, producing a document
              that holds that content and nothing else. Understand what that
              means before ticking it: comments, highlights, sticky notes,
              stamps, drawn ink, link areas and bookmarks are separate objects,
              and they are <strong>not</strong> carried into the rebuilt file.
              Leave it off if your document carries markup worth keeping.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500 shrink-0" /> Lock as read-only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Appears when a form is detected and you have turned field
              flattening off. Fields stay real form objects, keeping their names
              and structure for systems that read them, but are marked read-only
              so the values cannot be altered.{' '}
              <strong>
                Untick &ldquo;Annotations &amp; Markup Layers&rdquo; as well
              </strong>{' '}
              &mdash; the rebuild that switch performs removes the form
              entirely, taking the field names and the filled values with it.
            </p>
          </div>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Which one do you actually want?
        </h4>
        <p>
          Sending a finished, filled form to a client, a landlord or a
          university? Tick the form fields switch and untick the markup one.
          That combination is the safest default for the common job: your
          answers become permanent page content, and anything else the document
          carries &mdash; bookmarks, clickable links, review notes &mdash; is
          left alone. If a downstream system still needs to read the field
          names but nobody should change what is in them, use the read-only
          lock instead, with the markup switch off.
        </p>
        <p>
          Both of the first two switches start ticked. That default suits a
          plain filled form with no markup and no links, and it costs you
          something on any other file, so it is worth a deliberate second of
          thought rather than a straight run. The flatten button is enabled as
          soon as any one switch is on, which is not the same as those settings
          having an effect on your particular document &mdash; on a file with no
          form fields and the markup switch off, there is nothing for the tool
          to change.
        </p>
        <p>
          Going the other direction? If you need to <em>create</em> the fields
          rather than freeze them, the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            make PDF fillable tool
          </Link>{' '}
          builds the form, and you come back here when it is filled in.
        </p>
      </section>

      {/* 5 */}
      <section id="page-range" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          5. Flattening Part of a Document
        </h3>
        <p>
          The panel includes a page selection control &mdash; all pages, or a
          custom range typed as <code>1-3, 5</code>. Here is the honest position
          on it: <strong>it does not currently change the output</strong>. The
          range you type produces the same file as leaving it on all pages, for
          every document, whether or not it contains form fields. Treat the
          result as flattened throughout and ignore the control until it earns
          its place.
        </p>
        <p>
          If you genuinely need a file where some pages stay interactive and
          others are frozen, do it in three moves rather than one:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Use the{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF splitter
            </Link>{' '}
            to separate the pages you want frozen from the ones you do not.
          </li>
          <li>Flatten only that piece here.</li>
          <li>
            Rejoin the two with the{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF merger
            </Link>
            , then check the order in the{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              page organizer
            </Link>
            .
          </li>
        </ol>
        <p>
          Worth remembering that a PDF form is a document-level structure rather
          than a per-page one, so even a working range would not let you freeze
          the fields on page two and leave page three fillable. Splitting first
          is the reliable answer to that request in any tool.
        </p>
        <p>
          Two more expectations worth setting, both tied to the markup switch.
          Bookmarks and clickable links are themselves interactive objects, so
          the rebuild that switch performs returns a document without them
          &mdash; that is the trade you make for it, and it is another reason to
          leave the switch off when you only need the fields frozen. And if a
          page arrives with an odd orientation,{' '}
          <strong>flatten first and straighten afterwards</strong> with the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>
          , not the other way round. A rotation applied before flattening is not
          preserved by the rebuild, and the page comes back at its original
          orientation.
        </p>
      </section>

      {/* 6 */}
      <section id="not-redaction" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Flattening Is Not: Redaction, Encryption or Signing
        </h3>
        <p>
          This section exists because getting it wrong leaks information, and a
          lot of people arrive searching for one thing while describing another.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Flattening is not redaction
        </h4>
        <p>
          Suppose you draw a black box over a name and flatten the file. Two
          things go wrong, and the second is worse than most people expect.
          First, flattening never touches the text layer, so the name is still
          in the document, still selectable and still copyable. Second, the box
          you drew is markup, and the markup switch does not preserve markup
          &mdash; so the box is not in the file you download at all. The page
          comes back with the name sitting there in the open, uncovered.{' '}
          <strong>Flattening hides nothing, and here it uncovers.</strong> Never
          use it as a redaction step. To genuinely remove sensitive content,
          delete the pages that carry it with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>
          , or rasterise the affected pages by exporting them through the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          and rebuilding from images &mdash; then open the result and confirm
          with your own eyes that the content is gone before it leaves your
          hands.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Flattening is not a password
        </h4>
        <p>
          A flattened PDF cannot be typed into, but anyone can still open, copy
          and forward it. If the requirement is{' '}
          <strong>stop people editing a PDF</strong> in the access-control
          sense, add a password with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>{' '}
          as well: flatten first, protect second. That order matters, because a
          document that <em>already</em> carries a password is not supported
          here and will not tell you so. It does not refuse the file and it does
          not raise an error &mdash; it runs, and hands you an output that your
          reader is likely to be unable to open. Remove the password first,
          wherever the file was protected, then flatten the unlocked copy.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Flattening is not signing, and does not shrink files
        </h4>
        <p>
          Baking a signature field into the page keeps its <em>picture</em>; it
          does not create a cryptographic digital signature, and flattening a
          document that already carries one will invalidate it. Nor is
          flattening a compression step &mdash; a flattened file is sometimes
          slightly larger. If size is the goal, run the result through the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Flattener
        </h3>
        <p>
          Plenty of sites will <strong>flatten a PDF free</strong> and then find
          a way to make it awkward. Here is what is different, stated plainly
          enough that you can check every line against the tool above.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Switches, not one blind button', 'Flatten the form fields, rebuild the pages, or lock fields read-only. You decide which part of the document stops being editable, and you are told what each choice costs.'],
            ['It inspects before it acts', 'Page count, file size and the number of interactive fields are reported up front, so you know whether you have a real form or ordinary pages before you commit.'],
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no countdown. The tool you are using is the whole product.'],
            ['No watermark; file limits apply', 'Use small documents within the displayed limits and inspect the exported forms and annotations.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['An honest account of the result', 'We tell you what this tool does not keep, that flattening is not redaction, and that an encrypted file will not work here — before you rely on it, rather than after something goes out.'],
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
          The last card is the one we would defend hardest. A flattener that
          quietly drops something you needed is worse than one that refuses the
          job, so this page tells you where the edges are. It sits inside a
          wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on the same terms, and it works on a phone as readily as on a
          laptop, with nothing to install and nothing to sign up for.
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
              'How do I flatten a PDF for free without an account?',
              'Open the tool at the top of this page, select your .pdf, tick the switches for what should become uneditable, and download the result. There is no sign-up, no email verification, no watermark and no daily limit. The file saves as your original name with -flattened added.',
            ],
            [
              'Why does my filled PDF form look blank when I send it?',
              'Because the answers are still live field values sitting above the page rather than part of it, and the recipient’s reader is not drawing them. Flattening the form fields writes those values into the page content and removes the fields, so the document looks the same to everyone who opens or prints it.',
            ],
            [
              'Does this tool merge comments and highlights into the page?',
              'No, and this is the most important thing to know before running a reviewed document through it. The annotations and markup option rebuilds each page from the page content alone, so comments, highlights, sticky notes, stamps and drawn ink are not carried into the file you download. If you need markup preserved, leave that switch off and export a fixed copy from the app you commented in, or turn the pages into images and rebuild from those.',
            ],
            [
              'Does flattening a PDF make the text uneditable?',
              'It makes the interactive parts uneditable: form fields can no longer be typed into, because they are no longer there. The underlying page text is still text, so it remains selectable and searchable. That is a feature for accessibility and search, but it means flattening is not a way to hide anything.',
            ],
            [
              'Is flattening the same as redacting a PDF?',
              'No, and this one catches people out badly. Flattening does not remove the text under a black box — and the box itself, being markup, is not preserved either, so you can end up with the name fully visible and nothing covering it. Use page removal or an image-based rebuild if content genuinely has to be gone, and check the output yourself before sending it.',
            ],
            [
              'Can I flatten only certain pages of a PDF?',
              'Not at the moment. The page range control is in the panel but it does not change the output — the file comes back flattened throughout whatever you type. If you need part of a document to stay interactive, split it, flatten the piece that should be frozen, and merge the two back together.',
            ],
            [
              'Why did my rotated pages come back the wrong way round?',
              'Because a rotation is stored as a page property, and the rebuild that the markup switch performs does not carry it over. Flatten first and rotate afterwards, and the orientation sticks.',
            ],
            [
              'Are my documents safe when I flatten them?',
              'Your files are not stored on our servers, not queued, not logged and not retained after your session, and nothing you flatten is used for training or analytics. Contracts, medical forms and signed agreements are exactly the sort of file this tool is for.',
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
          Need something else from the same document? Build the form first with
          the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            fillable PDF creator
          </Link>
          , add a password afterwards with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>
          , make a scanned agreement searchable with{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR
          </Link>
          , or trim the finished file down with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          . If you would rather understand document work than simply use it, our
          free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how document formats and file handling work.
        </p>
      </div>
    </article>
  );
}
