import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  Globe,
  HelpCircle,
  Layers,
  Link2,
  Printer,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Save Web as PDF tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections with lucide icons, benefit grid, FAQ, closing links.
 *
 * Decisions that shaped this copy, and that matter if anyone edits it later.
 *
 * First, and most important: the composer above does NOT fetch a URL. You give
 * it a title, a subtitle, an optional source URL that is recorded as a citation
 * line, and the page text itself. It then typesets that into an A4 or Letter
 * PDF with a divider rule, an archived timestamp and "Page N of M" footers.
 * So the two highest-volume phrases in this niche — "url to pdf" and "website
 * screenshot to pdf" — are DECLINED. We do not promise that you paste a link
 * and get the rendered site back. Section 3 answers the intent behind those
 * queries honestly instead: it explains why a text-first archive beats a
 * screenshot for reading, citing and printing, and tells the reader plainly
 * what they need to paste. Ranking for a promise we cannot keep produces
 * bounces and complaints; ranking for the honest answer produces neither.
 *
 * Second, "save webpage as pdf with images" and "convert html to pdf" are also
 * declined for the same reason — the output is typeset text, not a rendering
 * of markup, and it carries no embedded pictures. Where a reader wants pictures
 * we give them the route that actually works: /tools/pdf-jpg has a JPG-to-PDF
 * mode (convertJpgToPdf in lib/pdfJpg.js embeds JPG and PNG through pdf-lib),
 * and the resulting PDF is what /tools/pdf-merger will accept. The merger's own
 * picker is accept=".pdf,application/pdf", so never tell a reader to hand it an
 * image directly. Note also that the image picker's filter admits .webp but the
 * embed step handles JPG and PNG only — the copy names JPG and PNG.
 *
 * Third, the font used is a standard PDF base font, so section 4 sets
 * expectations about non-Latin scripts and about proportional spacing rather
 * than letting someone discover either in the output. Same principle: say it
 * before, not after.
 *
 * Fourth, this composer makes an ordinary PDF. Nothing here is encrypted,
 * signed or flattened, so no sentence in this article may imply the output
 * cannot be edited. Section 5 sends readers who want that to /tools/pdf-protect
 * and /tools/pdf-flatten explicitly.
 *
 * Privacy is sold strictly as an outcome — nothing stored, nothing retained,
 * nothing used for training. How that is achieved is deliberately absent, and
 * the linked course is described from its own summary field, never from
 * anything about how these tools are built.
 */
export default function SaveWebAsPdfSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Save a Webpage as a PDF</span>: The Complete Guide to Clean, Printable Web Archives
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Articles vanish. Sites redesign, paywalls drop, links rot, and the
        recipe or research paper you meant to come back to is a 404 by the time
        you need it. The fix is to <strong>save a webpage as a PDF</strong> you
        own outright. The trouble is that the usual print dialogue drags along
        the navigation bar, the cookie banner and three adverts, then slices a
        sentence in half at the page break. This guide covers how to build a{' '}
        <strong>clean printable PDF</strong> of any article instead &mdash; one
        with a real title, a cited source URL, an archive timestamp and proper
        page numbers &mdash; using a free <strong>web page to PDF</strong>{' '}
        composer with no account and no watermark.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/save-web-as-pdf.webp"
            alt="Save a webpage as a PDF online free - web article text turned into a clean printable PDF document with title, source URL and page numbers"
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
              From a cluttered web article to a typeset document: title,
              subtitle, cited source, archive date and numbered pages.
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
            ['#what-it-does', '1. What a Web-to-PDF Archive Actually Gives You'],
            ['#how-to', '2. How to Save a Webpage as a PDF in Three Steps'],
            ['#text-vs-screenshot', '3. Pasted Text vs. Screenshotting the Whole Page'],
            ['#page-setup', '4. Paper Size, Orientation and What Sets the Look'],
            ['#use-cases', '5. Six Jobs This Solves Better Than Printing'],
            ['#after', '6. What to Do With the PDF Afterwards'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Webpage to PDF Tool'],
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
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Web-to-PDF Archive Actually Gives You
        </h3>
        <p>
          A web page is elastic. It reflows on a phone, swaps its advert every
          few seconds, and depends on a stylesheet sitting on somebody else&rsquo;s
          server. A PDF is the opposite: a fixed, self-contained description of
          a finished page. The format is standardised as{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2, the Portable Document Format specification
          </a>
          , and that fixedness is the entire point of an archive. What you save
          today opens identically in five years on a machine that has never
          heard of the site it came from, because the page description travels
          inside the file rather than being fetched from anywhere.
        </p>
        <p>
          The composer above produces a fixed-layout PDF of exactly that kind.
          When you <strong>convert a web article to PDF</strong> here, the
          output is not a raw text dump. It is typeset:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A headline and subtitle.</strong> Your title is set large
            and bold at the top, with a lighter subtitle underneath for the
            topic, section or your own note about why you kept it.
          </li>
          <li>
            <strong>A citation line.</strong> The optional source URL and an
            automatic archive timestamp &mdash; the date and time you saved it
            &mdash; sit together in small italic type under the heading, exactly
            where a reference belongs.
          </li>
          <li>
            <strong>Flowing, paginated body text.</strong> Paragraphs wrap to
            the measure, break to a new page when they run out of room, and
            never get sliced through the middle of a line.
          </li>
          <li>
            <strong>Numbered pages.</strong> Every page carries a centred{' '}
            <em>Page N of M</em> footer, so a printed stack stays in order and a
            colleague can tell you which page they are querying.
          </li>
        </ul>
        <p>
          That combination &mdash; title, source, date, pagination &mdash; is
          what separates a genuine <strong>web clipping to PDF</strong> from a
          screenshot you will never be able to cite. The result is an ordinary,
          openable PDF: any reader application will display it, any printer will
          take it, and you can pass it on without asking the recipient to
          install anything.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Save a Webpage as a PDF in Three Steps
        </h3>
        <p>
          There is no sign-up, no email and no trial countdown. To{' '}
          <strong>save a webpage as a PDF free</strong> with the composer above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Clear the box, paste your text', 'On the page you want to keep, select the article body and copy it. Skip the menus, the advert blocks and the comment thread — take the words you actually want. The content box starts with sample text in it, so select everything already in the box, delete it, and paste your article in its place. Anything you leave behind is typeset into your archive along with your own words.'],
            ['Label and cite it', 'The title and subtitle fields are pre-filled too, so type over them: a real headline, and a subtitle for the topic or your reason for keeping it. Drop the page address into the source URL field. That address is printed as a reference line beside an automatic archive date, so the document says where it came from and when.'],
            ['Choose paper and download', 'Pick A4 or US Letter, portrait or landscape, then press Download Printable PDF. The file saves under a tidy filename built from your title — no watermark, no stamp, nothing appended.'],
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
          The one thing the composer insists on is content. Leave the body box
          empty and it will simply ask you to paste something in rather than
          hand you a blank document. Everything else &mdash; subtitle, source
          URL &mdash; is optional, and the fields you leave blank are quietly
          omitted from the layout instead of leaving an awkward gap. Clear the
          subtitle and no subtitle line is drawn; clear the URL and the citation
          line carries the archive date alone.
        </p>
        <p>
          It is worth saying that this doubles as a straightforward{' '}
          <strong>text to PDF converter</strong>. Meeting notes, a chunk of chat
          transcript, a policy you were sent as a wall of plain text, your own
          draft &mdash; anything you can paste comes out as a properly
          paginated, titled document.
        </p>
      </section>

      {/* 3 */}
      <section id="text-vs-screenshot" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. Pasted Text vs. Screenshotting the Whole Page
        </h3>
        <p>
          Plenty of people arrive searching for a <strong>URL to PDF</strong>{' '}
          converter &mdash; paste a link, get the whole site back, pictures,
          styling and all. Being straight with you saves a wasted attempt: that
          is not what this tool does, and the distinction is worth understanding
          because the text-first approach is usually the better archive anyway.
        </p>
        <p>
          This composer works from the words you give it. You supply the article
          text and the address; it produces a typeset document. It does not go
          and fetch the page, and it does not reproduce the site&rsquo;s layout,
          photographs, embedded video or advertising. What you get is the
          content, cleanly set, which is why a <strong>clean PDF of a web
          article without ads</strong> is the realistic description of the
          output rather than a facsimile of the site.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> What the composer produces
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Selectable, searchable body text</li>
              <li>Your own headline and subtitle</li>
              <li>A cited source URL and archive timestamp</li>
              <li>Automatic pagination with numbered pages</li>
              <li>A4 or US Letter, portrait or landscape</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> What it does not do
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Visit a link and pull the page down for you</li>
              <li>Embed the article&rsquo;s photographs or charts</li>
              <li>Reproduce the site&rsquo;s fonts, colours or columns</li>
              <li>Keep clickable hyperlinks from the original</li>
              <li>Capture video, comments or interactive widgets</li>
            </ul>
          </div>
        </div>
        <p>
          For the jobs people actually have &mdash; reading later, printing,
          quoting, filing, citing, keeping a copy before something disappears
          &mdash; the words are the substance and the site chrome is noise. If
          the pictures genuinely are the point, they have to be handled as
          picture files in their own right: save the figure from the page
          yourself, then tidy it with our{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          or{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          and keep it in the same folder as the archive.
        </p>
        <p>
          If you would rather the figure travelled inside one file, there is a
          route, and it takes one extra step that is easy to miss. Our{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF and JPG converter
          </Link>{' '}
          runs in both directions: switch it to its JPG-to-PDF mode and it turns
          your saved JPG or PNG files into a PDF, one image per page. Only then
          can the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          join that picture PDF to your text archive, because the merger takes
          PDF files and nothing else &mdash; hand it a JPG directly and its file
          picker will not accept it. Convert first, merge second, and the words
          and the figures end up as a single document.
        </p>
      </section>

      {/* 4 */}
      <section id="page-setup" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          4. Paper Size, Orientation and What Sets the Look
        </h3>
        <p>
          Two choices change the shape of the finished document, and both matter
          more than people expect once a printer is involved.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">A4 or US Letter</h4>
        <p>
          <strong>A4</strong> (210 &times; 297 mm) is the standard almost
          everywhere outside North America; <strong>US Letter</strong> (8.5
          &times; 11 in) is slightly wider and shorter. A4 belongs to the
          international paper series defined in{' '}
          <a
            href="https://www.iso.org/standard/36631.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 216
          </a>
          , the standard that fixes those millimetre dimensions and the halving
          relationship between A3, A4 and A5; US Letter sits outside that series
          and is sized in inches instead. Choose the one your printer is loaded
          with. Getting it wrong is not fatal &mdash; the document still opens
          fine &mdash; but a print driver asked to squeeze A4 onto Letter will
          shrink everything by a few percent and leave an uneven margin. If you
          are filing the PDF rather than printing it, either is fine, and A4 is
          the safer default for anything you will email internationally.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">Portrait or landscape</h4>
        <p>
          Portrait is right for nearly all prose. Reach for{' '}
          <strong>landscape</strong> when your text contains long unbroken lines
          &mdash; a list of URLs, or wide lines you would rather not see wrapped
          &mdash; because a landscape page gives each line noticeably more room
          before it breaks. That is the whole of what the choice changes: the
          width of the measure, and therefore where the wrap falls. Note that
          the document is set in a proportional font, so pasted code and columns
          of figures will not keep their alignment in either orientation. If
          exact columns matter, keep that material in a spreadsheet or a plain
          text file rather than expecting the archive to hold its shape.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">What you do not need to configure</h4>
        <p>
          Everything else is decided for you, deliberately. Margins, type sizes,
          line spacing, the accent rule above the title, the hairline divider
          under the citation line and the footer position are all fixed so that
          every document you produce looks like it came from the same shelf.
          There are no sliders to get wrong and no settings to carry between
          sessions, which is what makes a stack of these archives look
          consistent months apart. One practical note on typography: the
          composer sets text in a standard document font, which covers Latin
          script, punctuation and common symbols. Extended scripts such as
          Arabic, Hebrew, Chinese, Japanese, Korean and Devanagari are outside
          that font&rsquo;s range, so paste Latin-script text for a faithful
          result.
        </p>
      </section>

      {/* 5 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          5. Six Jobs This Solves Better Than Printing
        </h3>
        <p>
          Most people find this page because a print dialogue let them down.
          Here is where a purpose-built <strong>webpage to PDF</strong> archive
          earns its place instead.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Research and citation', 'Keep the source URL and the date you retrieved it printed on the document itself. That is precisely the metadata a reference list asks for, and it is on the page rather than in a folder name you will rename.'],
            ['Reading a long article on paper', 'A properly paginated, numbered document with generous line spacing is far kinder to read and annotate than a print-out interrupted by navigation and cookie notices.'],
            ['Course notes and study packs', 'Paste a chapter, title it by week, and build a stack of consistently formatted handouts you can bind or file.'],
            ['Records you may need later', 'Order confirmations, policy wording, terms you agreed to, a listing before it is taken down. Pasted, dated and filed as a fixed record of what the page said on the day you read it.'],
            ['Sharing with someone who cannot open the link', 'Paywalled, regionally blocked, behind a login, or simply gone. A PDF of the text is readable by anybody you send it to.'],
            ['Cleaning up messy pasted text', 'Anything that arrives as an unstructured wall of characters — an email chain, a transcript, a plain-text spec — becomes a titled, paginated document.'],
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
          A word on that fourth one, because it is the case people most often
          overstate to themselves. What the composer hands you is a normal PDF:
          fixed in layout, dated on its face, and stable to open years from now
          &mdash; but not locked. It is not encrypted, it carries no signature,
          and anyone who can open it can edit it with the right software, the
          same as any other document you email. That is fine for the ordinary
          job of remembering what a page said and when you read it. If the file
          needs to resist tampering as well as record it, do that deliberately
          as a second step: our{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protection tool
          </Link>{' '}
          encrypts the document behind a password you set, and our{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flatten tool
          </Link>{' '}
          fixes form fields and annotations into the page content so they can no
          longer be filled in or moved. For anything with legal weight, neither
          replaces a properly witnessed copy &mdash; treat the archive as your
          own contemporaneous record, which is what it genuinely is.
        </p>
      </section>

      {/* 6 */}
      <section id="after" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. What to Do With the PDF Afterwards
        </h3>
        <p>
          One archived article is rarely the end of it. A saved clipping usually
          wants to join something bigger, get smaller, or get locked, and the
          rest of the toolset handles each of those on the same free terms.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Build a dossier.</strong> Save six articles, then{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              merge them into one PDF
            </Link>{' '}
            so an entire literature review or research folder travels as a
            single file. If the running order comes out wrong, the{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>{' '}
            will reshuffle the pages.
          </li>
          <li>
            <strong>Get it under an attachment limit.</strong> A long text
            archive is small, but a merged dossier is not. The{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>{' '}
            shrinks it substantially before you attach it, and you can recompress
            harder if it is still too big &mdash; it offers preset levels plus
            manual quality and dimension controls, so you can trade image
            fidelity for size until the file fits.
          </li>
          <li>
            <strong>Keep it private.</strong> For anything with personal or
            contractual detail in it, our{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF password protection tool
            </Link>{' '}
            adds a password before you send it on.
          </li>
          <li>
            <strong>Edit or extract the text.</strong> Need to rework the
            archive rather than just read it? Run it through the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word converter
            </Link>{' '}
            and edit it as a document. And if you came here holding a{' '}
            <em>scanned</em> page rather than web text, our{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR tool
            </Link>{' '}
            will lift real text out of it first, which you can then paste into
            the composer above.
          </li>
          <li>
            <strong>Point people back at the source.</strong> Turn the original
            address into a scannable code with the{' '}
            <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
              QR code generator
            </Link>{' '}
            for a printed handout.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Webpage to PDF Tool
        </h3>
        <p>
          Plenty of sites will <strong>convert text to PDF online</strong>. Most
          of them make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough that you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email address, no card and no trial period. What you are using is the whole product, every time you come back.'],
            ['No watermark on the output', 'The PDF comes out clean. Nothing is stamped across the text and nothing is appended to the final page advertising us.'],
            ['Your documents stay private', 'Nothing you paste is stored on our servers, retained after your session, or used for training or analytics. No file is kept, queued or logged.'],
            ['Built as a document, not a dump', 'Title, subtitle, cited source, archive timestamp, automatic pagination and numbered footers come as standard rather than as a paid extra.'],
            ['No daily cap', 'Archive one article or forty in an afternoon. There is no counter quietly ticking down and no tier above this one to upsell you to.'],
            ['An honest description of the result', 'We tell you what the composer produces and what it does not before you spend time on it, rather than after you have downloaded the wrong thing.'],
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
          built on exactly the same terms, so the archive you make here can be
          split, cropped, rotated or protected later without ever meeting a
          paywall.
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
              'How do I save a webpage as a PDF for free without an account?',
              'Copy the article text, clear the sample text out of the content box in the composer at the top of this page, and paste yours in its place. Add a title and the source URL, choose A4 or Letter, and press Download Printable PDF. There is no sign-up, no email verification and no watermark on the result. It is free every time, not free for the first three files.',
            ],
            [
              'Can I just paste a link and get the whole page?',
              'No — and it is better to know that now. The composer builds your PDF from the article text you paste in. The source URL you enter is printed on the document as a reference line rather than fetched. That means you get the words, cleanly typeset and free of adverts and navigation, but not a picture of the site.',
            ],
            [
              'Will the images from the article be included?',
              'No. The output is typeset text with a title, subtitle, citation line and page numbers. If a chart or photograph matters, save it from the page yourself and tidy it with our image cropper or image resizer, then either keep it beside the archive as an image file or take the extra step of turning it into a PDF with the PDF and JPG converter in its JPG-to-PDF mode. Only once it is a PDF can the merger add it to your archive as extra pages — the merger will not accept an image file directly.',
            ],
            [
              'Can anyone edit the PDF I create here?',
              'The file is an ordinary PDF, so yes, someone with editing software can change it. Nothing here encrypts, signs or locks the document. What it does give you is a fixed, dated record of the text as you saved it. If you need the file locked as well, add a password with our PDF protect tool, or fix its fields and annotations in place with the PDF flatten tool.',
            ],
            [
              'Why does my printed web page cut off text or include the menus?',
              'Because a print dialogue reproduces the page as the site built it, adverts, sidebars and all, and the site rarely defines where a page should break. Pasting the article body into a composer sidesteps both problems: you choose what goes in, and the text is repaginated properly with numbered pages.',
            ],
            [
              'Is there a limit on how much text I can convert to PDF?',
              'There is no imposed cap and no daily limit on how many documents you build. Longer text simply produces more pages, and the footer count updates to match, so a fifty-page archive numbers itself correctly without any extra step.',
            ],
            [
              'Is what I paste kept anywhere?',
              'No. Nothing you paste is stored on our servers, nothing is retained once your session ends, and nothing is used for training or analytics. No file is kept, queued or logged.',
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
          Once your archive exists, the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          will pull out just the section you want to quote, the{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop tool
          </Link>{' '}
          tightens the margins for a reading device, the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          fixes a landscape page that ended up sideways, and the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          turns a page into an image for a slide. If you would rather understand
          how documents are built than simply build them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          takes you from raw HTML to a deployed application.
        </p>
      </div>
    </article>
  );
}
