import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
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
 * contents, H3 sections with lucide icons, a benefit grid, an FAQ and a
 * closing link block. If you edit this, keep that rhythm.
 *
 * Four decisions shaped the copy, and every one of them is deliberate.
 *
 * 1. The composer does NOT go and fetch a URL. It takes a title, a subtitle,
 *    an optional source URL that is printed as a citation line, and the page
 *    text you paste in. So the two fattest phrases in this niche — "url to
 *    pdf" and "website screenshot to pdf" — are DECLINED outright. We never
 *    imply you drop a link in and get the rendered site back. Section 3
 *    answers the intent behind those searches honestly instead: why a text
 *    archive beats a screenshot for reading, citing and printing, and exactly
 *    what the reader has to paste. A page that answers the question outranks
 *    a page that lies about it, and it generates no support mail.
 *
 * 2. "Convert html to pdf" and "save webpage as pdf with images" are declined
 *    for the same reason. The output is typeset text — no markup is rendered
 *    and no pictures are carried across. Where someone clearly wants images we
 *    send them to the image tools rather than fudge it.
 *
 * 3. The document is set in a standard PDF base font, so section 4 states up
 *    front that non-Latin scripts are not the job for this tool. Say it
 *    before, not after.
 *
 * 4. Privacy is sold strictly as an OUTCOME — nothing stored, nothing
 *    retained, nothing used for training. How that is achieved is absent by
 *    design and must stay absent.
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
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Save a Webpage as a PDF</span>: The Complete Guide to Clean, Printable Web Archives
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Articles disappear. Sites redesign, links rot, paywalls close, and the
        guide you meant to read again is a 404 by the time you need it. The
        dependable fix is to <strong>save a webpage as a PDF</strong> you keep
        yourself. What makes that annoying is everything the usual print route
        drags along: the navigation, the cookie banner, three adverts and a
        footer, with a sentence sliced in half at every page break. The
        composer above takes the words you actually care about and typesets
        them into a <strong>clean, printable PDF</strong> &mdash; titled, dated,
        paginated and yours. This guide covers how a good{' '}
        <strong>web page to PDF</strong> archive is built and where its limits
        honestly sit.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/save-web-as-pdf.webp"
            alt="Save a webpage as a PDF online free - webpage to PDF converter turning a cluttered article into a clean printable PDF document"
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
              From a cluttered article to a clean archive: a titled, dated,
              page-numbered PDF containing only the words worth keeping.
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
            ['#what-it-does', '1. What the Webpage to PDF Composer Actually Does'],
            ['#how-to', '2. How to Save a Webpage as a PDF, Step by Step'],
            ['#text-vs-screenshot', '3. Text Archive or Screenshot: Which One You Want'],
            ['#page-setup', '4. Paper Size, Orientation and the Layout You Get'],
            ['#citation', '5. Source URLs, Timestamps and Citing a Page That Changes'],
            ['#use-cases', '6. Six Things Worth Saving as a PDF'],
            ['#after', '7. What to Do With the PDF Afterwards'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Webpage to PDF Tool'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          1. What the Webpage to PDF Composer Actually Does
        </h3>
        <p>
          Be clear about the shape of this tool before you use it, because that
          is what makes it good at its job. The composer above is a{' '}
          <strong>text to PDF converter</strong> built for web reading. You give
          it four things &mdash; a headline, a subtitle, an optional source link
          and the article text itself &mdash; and it returns a typeset,
          downloadable document. It does not crawl a site for you, and it is
          better for it: you decide what belongs in the archive rather than
          inheriting a menu bar and a newsletter pop-up.
        </p>
        <p>
          What comes out is a proper document rather than a text dump. Every
          file it produces carries the same furniture:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A titled cover line.</strong> Your headline is set large and
            bold at the top, with an orange accent rule above it and your
            subtitle underneath in a lighter weight.
          </li>
          <li>
            <strong>A citation bar.</strong> The source URL you supply and an
            &ldquo;Archived&rdquo; date and time are printed in small italics,
            separated by a bullet, above a hairline divider.
          </li>
          <li>
            <strong>Readable body text.</strong> Your pasted content is wrapped
            to the measure of the page at a comfortable reading size, with the
            gap between paragraphs preserved rather than flattened.
          </li>
          <li>
            <strong>Automatic pagination.</strong> Long content flows onto as
            many pages as it needs, breaking between lines instead of through
            them, and every page is stamped &ldquo;Page 3 of 11&rdquo; at the
            foot.
          </li>
        </ul>
        <p>
          The result is a real{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 PDF document
          </a>
          , the same standard your bank statements and boarding passes use, so
          it opens anywhere, prints predictably, and its text stays selectable
          and searchable rather than trapped in a picture.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Save a Webpage as a PDF, Step by Step
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>convert an article to PDF</strong> with the composer above,
          four short steps:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Copy the words you want', 'Select the article on the page you are reading and copy it. Take the headline, the body and any quotes you want to keep, and leave the navigation, the advert rails and the comment thread behind. Paste it into the content box.'],
            ['Title and describe it', 'Give the piece a title and a subtitle. These are what you will recognise in a folder six months from now, so "Q3 supplier terms" beats "Untitled". Leave a field blank and it is simply omitted from the layout.'],
            ['Set paper and orientation', 'Choose A4 or US Letter, then portrait or landscape. That is the whole configuration; margins, type size, line spacing and page breaks are already handled for you.'],
            ['Download the printable PDF', 'Press the download button and the finished file arrives named after your title — "Modern Web Architecture Overview" becomes modern-web-architecture-overview.pdf, ready to file, print or email.'],
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
          The only thing that will stop you is an empty content box, and the
          tool says so plainly rather than handing you a blank page. Everything
          else &mdash; the title, the subtitle, the source link &mdash; is
          optional. There is no queue, no watermark stamped across the result
          and no daily allowance, which is the usual catch when you{' '}
          <strong>save a web page as a PDF free</strong> elsewhere.
        </p>
      </section>

      {/* 3 */}
      <section id="text-vs-screenshot" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          3. Text Archive or Screenshot: Which One You Actually Want
        </h3>
        <p>
          Plenty of people searching for a{' '}
          <strong>website to PDF converter</strong> are really asking for one of
          two different things, and they get very different results. It is
          worth thirty seconds to work out which one you need.
        </p>
        <p>
          A <strong>visual capture</strong> photographs the rendered page:
          colours, logos, banner images, layout, adverts and all. A{' '}
          <strong>text archive</strong> &mdash; which is what this composer
          produces &mdash; keeps the words, the reading order and the paragraph
          structure, and drops everything else. Neither is better in the
          abstract. They are for different jobs.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> A text archive wins for
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Reading a long article without the clutter</li>
              <li>Printing something you can annotate by hand</li>
              <li>Quoting, citing and searching the text later</li>
              <li>Study notes, recipes, manuals and reference pages</li>
              <li>Small files that email and file cleanly</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> A visual capture wins for
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Proving exactly how a page looked on a date</li>
              <li>Design references and layout inspiration</li>
              <li>Charts, infographics and photo galleries</li>
              <li>Order confirmations where the branding matters</li>
              <li>Bug reports and visual evidence</li>
            </ul>
          </div>
        </div>
        <p>
          Since this tool is squarely on the left-hand side of that table, be
          straight about the trade: your PDF contains the text you paste, not
          the site&rsquo;s pictures, styling or clickable links. If the images
          are the point, capture them separately and prepare them with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          and the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          , then bind everything into one document with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          . That combination gives you a keepsake with both the words and the
          pictures, and you still control every part of it.
        </p>
      </section>

      {/* 4 */}
      <section id="page-setup" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          4. Paper Size, Orientation and the Layout You Get
        </h3>
        <p>
          Two settings decide the shape of the document, and both exist because
          a <strong>printable PDF</strong> has to match the paper it will
          eventually meet.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">A4 or US Letter</h4>
        <p>
          A4 measures 210 &times; 297 mm and is the default almost everywhere
          outside North America, where US Letter&rsquo;s 8.5 &times; 11 inches
          rules instead. The A series is defined by{' '}
          <a
            href="https://www.iso.org/standard/36631.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 216
          </a>
          , which is why folding an A4 sheet in half gives you an A5 with the
          same proportions. Pick whichever your printer is loaded with. Choose
          wrong and nothing breaks &mdash; you just get slightly odd margins or
          a shrink-to-fit warning at the print dialogue.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">Portrait or landscape</h4>
        <p>
          Portrait is right for nearly all prose: a narrower measure means fewer
          words per line, and fewer words per line is easier on the eye. Reach
          for landscape when your content has long unbroken strings that you
          would rather not see wrapped &mdash; code samples, command lines, wide
          reference lists &mdash; or when the archive is destined for a screen
          rather than a sheet of paper.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">What you never have to configure</h4>
        <p>
          Deliberately, there are no other knobs. Margins, type size, line
          spacing, paragraph spacing, the divider rule and the{' '}
          <strong>page numbers on your PDF</strong> are all set to values that
          read well and print well, so a good result is the default rather than
          a reward for fiddling. One honest limit to note in advance: the
          document is set in a standard Latin typeface, so English and other
          Latin-script languages typeset beautifully, while Arabic, Chinese,
          Japanese, Korean and Devanagari text is not what this composer is
          for. Knowing that now saves you a puzzled minute later.
        </p>
      </section>

      {/* 5 */}
      <section id="citation" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-orange-500 shrink-0" />
          5. Source URLs, Timestamps and Citing a Page That Changes
        </h3>
        <p>
          The source URL field looks minor and is the most useful thing on the
          panel. Fill it in and the finished document carries a line reading
          &ldquo;Source: https://example.com/article&rdquo; followed by an
          &ldquo;Archived&rdquo; stamp with the date and the time you made it.
          That single line turns a loose copy of some text into a piece of
          evidence: it says where the words came from and when they were true.
        </p>
        <p>
          This matters more than people expect. Web pages are edited silently.
          A price changes, a policy is reworded, a claim is quietly removed, and
          the version you read is gone with no trace. If you need to{' '}
          <strong>archive a news article as a PDF</strong>, keep a supplier
          policy for a dispute, or cite an online source in coursework, the
          combination of the text, the address and the timestamp is exactly
          what an assessor, an editor or a manager will ask for.
        </p>
        <p>
          Two practical notes. The address is printed as a plain reference line
          rather than a clickable link, which is what a citation wants anyway
          &mdash; it survives printing and photocopying. And the timestamp
          records the moment the document was made, so make the PDF while you
          are looking at the page rather than a week later from memory. If you
          would rather hand someone a scannable pointer back to the live page,
          generate one with the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free QR code generator
          </Link>{' '}
          and print it alongside.
        </p>
      </section>

      {/* 6 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          6. Six Things Worth Saving as a PDF
        </h3>
        <p>
          People arrive here describing a symptom rather than naming a tool:
          the print came out covered in adverts, the recipe is four screens
          long, the article might be taken down. These are the jobs the
          composer handles best.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Research and citations', 'Keep the paper, the blog post or the documentation page you are quoting, with its address and archive date attached, so your bibliography still checks out months later.'],
            ['Recipes and instructions', 'One page of ingredients and method, printable and splash-proof, instead of a phone screen that keeps dimming halfway through the method.'],
            ['Study and revision notes', 'Turn a long explainer into a clean handout you can highlight, annotate and staple into a folder before an exam.'],
            ['Policies, terms and receipts', 'Wording changes. Save the version you agreed to, dated, so a later dispute is a document rather than a memory.'],
            ['Client and team handovers', 'Paste a specification, a brief or a set of meeting notes, title it properly, and send one tidy file instead of a wall of chat messages.'],
            ['Long reads for the train', 'A titled, page-numbered document you can read end to end without a cookie banner sliding up from the bottom of the page.'],
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
      </section>

      {/* 7 */}
      <section id="after" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          7. What to Do With the PDF Afterwards
        </h3>
        <p>
          Because the output is a standard document with a genuine text layer,
          every other tool in the set will accept it happily. A few common next
          moves:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Build a dossier.</strong> Save five articles on one subject,
            then{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              merge them into a single PDF
            </Link>{' '}
            and{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              reorder the pages
            </Link>{' '}
            into a reading sequence that makes sense.
          </li>
          <li>
            <strong>Trim it down.</strong> Only need part of a long archive? The{' '}
            <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF splitter
            </Link>{' '}
            or the{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages tool
            </Link>{' '}
            will pull out the range you actually want.
          </li>
          <li>
            <strong>Get it under a size limit.</strong> Run a fat merged dossier
            through the{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>{' '}
            before attaching it to an email.
          </li>
          <li>
            <strong>Lock it before sending.</strong> Anything sensitive can be
            given a password with the{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF protect tool
            </Link>{' '}
            so only the intended reader opens it.
          </li>
          <li>
            <strong>Edit the words again.</strong> Send the archive through the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word converter
            </Link>{' '}
            and you get an editable draft you can rewrite, translate or annotate
            properly.
          </li>
        </ul>
        <p>
          One thing you will not need is optical character recognition. The text
          in these documents is real text, already selectable and searchable, so
          the{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            OCR tool
          </Link>{' '}
          is only worth reaching for when you are working with a scan or a photo
          of a page instead.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Webpage to PDF Tool
        </h3>
        <p>
          Any number of sites will offer to{' '}
          <strong>save an article as a PDF online free</strong>. Most make it
          quietly irritating until you pay. Here is what is different, stated
          plainly enough that you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no trial attached', 'No account, no email address, no card and no seven-day countdown. What you are using is the entire product, not a sampler of it.'],
            ['No watermark on your document', 'The PDF comes out clean. Nothing is stamped across the page, nothing is appended to the last one, and no logo rides along in the footer.'],
            ['No length or usage cap', 'Save a three-paragraph note or a forty-page manual, once or forty times. Nothing is counting down in the background.'],
            ['Your content stays private', 'What you paste is never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['A layout that is already right', 'Titles, citation line, divider, wrapping, paragraph spacing and "Page N of M" footers are set for you, so the first attempt is the good one.'],
            ['An honest account of the limits', 'We tell you up front that this keeps words rather than pictures, and what to use instead when you need the images too.'],
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
          built on identical terms, so whatever you need to do to the archive
          next is already there and still costs nothing.
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
              'How do I save a webpage as a PDF for free without installing anything?',
              'Copy the article text from the page you are reading, paste it into the composer at the top of this page, add a title and the source address, choose A4 or Letter, and download. There is no sign-up, no watermark and nothing to install — it is free every time, not free for the first three documents.',
            ],
            [
              'Can I just paste a link and get the whole page back?',
              'No, and we would rather say so than pretend otherwise. This composer archives the text you give it; the URL field is recorded as a citation line, not fetched. In practice that is the outcome most people were after anyway, because it leaves the adverts, menus and pop-ups behind instead of printing them.',
            ],
            [
              'Will the images from the page be included?',
              'No. The document contains your typeset text, the title block, the citation line and the page numbers. If the pictures matter, save them separately, tidy them with the image cropper and resizer, and combine everything with the PDF merger.',
            ],
            [
              'Why does my printed webpage cut off text at the edges?',
              'Printing a live page usually crops whatever sits outside the paper width, which is why sentences and table columns vanish. Building the document here avoids that: the text is wrapped to the measure of the page you chose and broken between lines, never through them.',
            ],
            [
              'Is there a limit on how much text I can save at once?',
              'There is no length cap and no daily allowance. Long content simply flows onto more pages, each one numbered, so a lengthy manual is as welcome as a short note.',
            ],
            [
              'Is the content I paste kept anywhere?',
              'No. What you paste is never stored on our servers, never queued or logged, and never retained once your session ends. Nothing is used for training or analytics.',
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
          Once the archive exists, the rest of the workbench is waiting: the{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop tool
          </Link>{' '}
          to tighten the margins for a smaller print, the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>{' '}
          to fix a landscape page in a portrait bundle, or the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to turn a page into an image for a slide deck. And if you would rather
          understand how documents are built than only use the tools, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          walks through the file and document work that sits behind pages like
          this one.
        </p>
      </div>
    </article>
  );
}
