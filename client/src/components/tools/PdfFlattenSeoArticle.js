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
 * Three decisions shaped the copy, and they matter if anyone edits it later.
 *
 * First, the tool has three switches, not one, and the article is organised
 * around them: flatten form fields, flatten annotations and markup, or keep
 * the fields as form objects and mark them read-only. Most of the search
 * traffic here ("make pdf uneditable", "flatten pdf form") is really one of
 * those three jobs described in the searcher's own words, so section 4 maps
 * the phrasing onto the switch rather than assuming the reader knows the
 * vocabulary.
 *
 * Second, two high-volume keywords are deliberately NOT promised.
 *   - "redact pdf" / "black out text in pdf". Flattening bakes an annotation's
 *     appearance into fixed page content; it does not delete the characters
 *     underneath, and the text stays selectable. Promising redaction here
 *     would be a data-leak waiting to happen, so section 6 answers the
 *     question honestly and sends the reader elsewhere instead.
 *   - "flatten only pages 3-5". The page-range control exists in the panel,
 *     but form flattening is a whole-document operation and the rebuilt output
 *     is fixed throughout, so section 5 tells people to split, flatten and
 *     merge if they genuinely need a partly interactive file. Answering the
 *     question beats ranking for a promise the output does not keep.
 *   - "flatten pdf to reduce file size" is also declined: nothing in the tool
 *     compresses, and flattening can make a file larger. The compressor is
 *     linked instead.
 *
 * Third, privacy is sold as an outcome only — files are not stored, not
 * queued, not retained, not used for training. How that is achieved is
 * deliberately absent from the page.
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
        How to <span className="text-orange-600 dark:text-orange-400">Flatten a PDF</span>: Lock Forms, Comments and Markup Into Fixed Pages
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You filled in the form, saved it, emailed it &mdash; and the person at
        the other end opened a blank one. Or your reviewer&rsquo;s comments
        drifted, or the signature vanished on print. All of that is one problem
        wearing different hats: parts of your document are still <em>live</em>
        rather than printed onto the page. To <strong>flatten a PDF</strong> is
        to bake those live parts into fixed page content so what you see is what
        everybody sees. This guide covers how to{' '}
        <strong>flatten a PDF online free</strong>, which switch to use to{' '}
        <strong>make a PDF uneditable</strong>, and the one thing flattening is
        very often mistaken for.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/flatten-pdf.webp"
            alt="Flatten a PDF online free - PDF flattener baking interactive form fields, comments and markup layers into fixed page content"
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
              From a live, editable form to a fixed page: flatten fields,
              annotations and markup into content that travels intact.
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
          PDFs. When you <strong>flatten a PDF</strong>, the floating layer stops
          floating: form values and markup become part of the fixed page content
          instead of objects sitting on top of it. The result is a document
          whose appearance no longer depends on which reader opens it, and whose
          fields nobody can type over. In everyday language, this is how you{' '}
          <strong>make a PDF uneditable</strong> and how you{' '}
          <strong>flatten a PDF form</strong> so the answers stay put.
        </p>
        <p>
          The tool at the top of this page does exactly that, and it lets you
          choose which parts of the stack to press down.
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
          familiar, flattening is the fix:
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
            <strong>Comments and highlights shift or disappear</strong> when a
            reviewed document moves between apps.
          </li>
          <li>
            <strong>Someone changed your numbers.</strong> An invoice or a quote
            went out with fields that were still typeable, so the total was not
            actually final.
          </li>
          <li>
            <strong>A stamp or drawn signature does not survive</strong> the trip
            to the other side.
          </li>
        </ul>
        <p>
          The searches behind these read like{' '}
          <em>&ldquo;pdf form shows blank when emailed&rdquo;</em>,{' '}
          <em>&ldquo;stop people editing my pdf&rdquo;</em> or{' '}
          <em>&ldquo;merge comments into pdf&rdquo;</em>. Every one of them ends
          at the same operation: <strong>flatten PDF annotations</strong> and
          form fields into fixed content, then send that file instead.
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
            ['Select your PDF', 'Drop a .pdf onto the panel or click to browse. Anything that is not a PDF is turned away with a plain message rather than a mystery failure.'],
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
          The inspection step is worth a second of attention. If it reports{' '}
          <em>no interactive form fields</em>, your document is not a fillable
          form &mdash; it is ordinary pages with annotations or markup, and the
          second switch is the one that matters. If it counts fields, you have a
          real <strong>fillable PDF</strong> and the first switch is yours.
          Output is a single PDF, with no watermark and no cap on how many
          documents you run.
        </p>
      </section>

      {/* 4 */}
      <section id="options" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-orange-500 shrink-0" />
          4. Choosing What to Flatten: Forms, Markup or a Read-Only Lock
        </h3>
        <p>
          Most tools give you one button. This one gives you three choices,
          because &ldquo;make it uneditable&rdquo; means three different things
          depending on what is in the file.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-orange-500 shrink-0" /> Interactive form fields
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Bakes text boxes, checkboxes, radio buttons and signature widgets
              into the page. The typed answers stay visible; the boxes stop
              being typeable. This is the switch for{' '}
              <strong>flatten a filled PDF form</strong>.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500 shrink-0" /> Annotations &amp; markup layers
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Rebuilds every page as fixed content so highlights, stamps,
              comments and drawn notes are part of the page rather than objects
              hovering over it. This is <strong>flatten PDF layers</strong> in
              the sense most reviewers mean it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500 shrink-0" /> Lock as read-only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Offered when a form is detected and you have turned field
              flattening off. Fields stay real form objects &mdash; keeping their
              names and structure for systems that read them &mdash; but are
              marked read-only so the values cannot be altered.
            </p>
          </div>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Which one do you actually want?
        </h4>
        <p>
          Sending a finished, filled form to a client, a landlord or a
          university? Flatten the fields. Circulating a reviewed draft whose
          markup must arrive exactly as drawn? Flatten the annotations. If a
          downstream system still needs to read the field names but nobody
          should change what is in them, use the read-only lock instead.
          Ticking both of the first two is the common case, and is what the
          tool starts with. The button stays disabled until at least one choice
          is made, so you never download a copy identical to the original.
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
          custom range typed as <code>1-3, 5</code>. It is worth being straight
          about what to expect from it. Treat the flattened file as fixed
          throughout: form flattening is document-wide by the nature of a PDF
          form, because fields belong to the document rather than to a page, so
          freezing them freezes them everywhere.
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
          Two more expectations worth setting. Bookmarks and clickable links are
          themselves interactive objects, so a flattened document is a document
          without them &mdash; that is the trade you are making for a page that
          renders identically everywhere. And if a page arrives with an odd
          orientation, straighten it with the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          before you flatten, not after.
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
          If you draw a black box over a name and flatten the file, the black
          box becomes permanent page content &mdash; and the name underneath is
          still there in the document&rsquo;s text, still selectable, still
          copyable by anyone who tries. <strong>Flattening hides nothing.</strong>{' '}
          It fixes appearance, not secrecy. To genuinely remove sensitive
          content, delete the pages that carry it with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>
          , or rasterise the affected pages by exporting them through the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          and rebuilding from images.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Flattening is not a password
        </h4>
        <p>
          A flattened PDF cannot be typed into, but anyone can still open, copy
          and forward it. If the requirement is{' '}
          <strong>stop people editing a PDF</strong> in the access-control sense,
          add a password with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect tool
          </Link>{' '}
          as well: flatten first, protect second. A document already locked with
          a password may not open here at all &mdash; if it fails, the tool says
          so plainly rather than handing you a broken file.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Flattening is not signing, and does not shrink files
        </h4>
        <p>
          Baking a drawn signature into the page keeps its <em>picture</em>; it
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
            ['Granular control, not one button', 'Flatten form fields, flatten annotations and markup, or lock fields read-only. You decide which layer stops being editable.'],
            ['It inspects before it acts', 'Page count, file size and the number of interactive fields are reported up front, so you know whether you have a form or just markup.'],
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no countdown. The tool you are using is the whole product.'],
            ['No watermark and no size limit', 'A flattened contract comes out clean, at any page count, as many times as you need.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['An honest account of the result', 'We tell you that flattening is not redaction and not encryption before you rely on it, rather than after something goes out.'],
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
          built on the same terms, and it works on a phone as readily as on a
          laptop &mdash; there is nothing to install and nothing to sign up for.
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
              'Open the tool at the top of this page, select your .pdf, tick whether you want form fields, annotations or both made uneditable, and download the result. There is no sign-up, no email verification, no watermark and no daily limit. The file saves as your original name with -flattened added.',
            ],
            [
              'Why does my filled PDF form look blank when I send it?',
              'Because the answers are still live field values sitting above the page rather than part of it, and the recipient’s reader is not drawing them. Flattening the form fields writes those values into the page content, so the document looks the same to everyone who opens or prints it.',
            ],
            [
              'Does flattening a PDF make the text uneditable?',
              'It makes the interactive parts uneditable: form fields can no longer be typed into and markup can no longer be moved or deleted. The underlying page text is still text, so it remains selectable and searchable. That is a feature for accessibility and search, but it means flattening is not a way to hide anything.',
            ],
            [
              'Is flattening the same as redacting a PDF?',
              'No, and this is the one that catches people out. A black box drawn over a name and then flattened is a permanent black box with the name still readable underneath in the document’s text. Use page removal or an image-based rebuild if content genuinely has to be gone.',
            ],
            [
              'Can I flatten only certain pages of a PDF?',
              'Treat the output as fixed across the whole document — form fields belong to the document rather than to individual pages, so freezing them freezes them everywhere. If you need part of a file interactive, split it, flatten the piece that should be frozen, and merge the two back together.',
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
          . If you would rather understand how document processing works than
          simply use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the file and document APIs behind tools like this one.
        </p>
      </div>
    </article>
  );
}
