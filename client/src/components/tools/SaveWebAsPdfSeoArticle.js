import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Globe,
  HelpCircle,
  Layers,
  Link2,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Save Web as PDF tool.
 *
 * The tool has two modes and the copy follows them. "From a URL" renders the
 * live page through a capture service into a real, text-searchable PDF with
 * working links, so "save webpage as pdf", "url to pdf" and "webpage to pdf"
 * are the head terms and are promised plainly. "From text" typesets pasted
 * content with jsPDF and is positioned for what the capture cannot reach:
 * pages behind a login or paywall, emails, drafts.
 *
 * Stated limits are the real ones: a public address only; a fair-use daily
 * capture allowance per connection (the tool says so when it is used up);
 * pages are captured as they load, so infinite scroll stops where loading
 * stopped; the text mode carries no pictures.
 */
export default function SaveWebAsPdfSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Save a Webpage as a PDF</span>: From Its Address, or From Its Text
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Pages disappear. Prices change, terms get quietly rewritten, an article
        moves behind a paywall a month after you read it, a listing is taken
        down the day you need it. A PDF is the version that stays put. This
        guide covers how to <strong>save a webpage as a PDF</strong> from
        nothing but its address &mdash; layout, pictures and clickable links
        included, with text you can still search &mdash; and how to use the
        second mode, <strong>text to PDF</strong>, for pages the capture cannot
        reach: a login-only account page, a paywalled article you have open,
        an email you want to keep.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/save-web-as-pdf.webp"
            alt="A tablet showing a saved document page beside a glass of iced coffee on a wooden table"
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
              Paste the address and get the page as a reader sees it; paste the
              text and get it typeset. Either way, a PDF that stays put.
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
            ['#two-modes', '1. Two Ways In: From a URL, or From Text'],
            ['#how-to-url', '2. How to Save a Webpage as PDF From Its URL'],
            ['#what-you-get', '3. What the Captured PDF Contains'],
            ['#reach', '4. What a Capture Can and Cannot Reach'],
            ['#text-mode', '5. The Text Mode: Paste, Title, Typeset'],
            ['#vs-print', '6. Why Not Just Print to PDF From the Print Menu?'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Webpage to PDF Tool'],
            ['#faq', '8. Frequently Asked Questions (FAQ)'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1 */}
      <section id="two-modes" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          1. Two Ways In: From a URL, or From Text
        </h3>
        <p>
          The tool at the top of this page has two tabs, and choosing the right
          one is most of the job.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-orange-500 shrink-0" /> From a URL
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Paste the address of any public page. It is rendered as a
              reader sees it &mdash; layout, images, backgrounds &mdash; and
              returned as a PDF whose text is real text: searchable,
              selectable, with links that still click. This is the{' '}
              <strong>URL to PDF</strong> most people are looking for.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> From text
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Copy the words off a page you can see but the capture cannot
              &mdash; behind a login, a paywall, inside an email &mdash; give
              them a title and a source line, and get a clean typeset PDF with
              page numbers and a timestamp. No pictures, no menus, no adverts:
              the reading, and nothing else.
            </p>
          </div>
        </div>
        <p>
          Rule of thumb: if the page opens for a stranger, use the URL. If it
          only opens for you, use the text.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-url" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Save a Webpage as PDF From Its URL
        </h3>
        <ol className="space-y-3">
          <li>
            <strong>Paste the address.</strong> Copy it from the address bar
            and drop it into the box under <em>From a URL</em>. Missing the{' '}
            <code>https://</code>? It is added for you.
          </li>
          <li>
            <strong>Pick paper and orientation.</strong> A4 or US Letter,
            portrait or landscape. Portrait A4 suits articles; landscape suits
            dashboards, wide tables and anything designed for a monitor.
          </li>
          <li>
            <strong>Press Save Webpage as PDF.</strong> A few seconds later the
            file downloads, named after the site and the page, for example{' '}
            <strong>example.com-pricing.pdf</strong>. Open it anywhere.
          </li>
        </ol>
        <p>
          That is the whole of <strong>how to convert a webpage to PDF</strong>{' '}
          here. No account, no extension to add, no counter of pages used this
          month. The same steps work to <strong>save a webpage as PDF on a
          phone</strong>, where the share-to-print route is often the
          clumsiest part of the day.
        </p>
      </section>

      {/* 3 */}
      <section id="what-you-get" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          3. What the Captured PDF Contains
        </h3>
        <p>
          A URL capture is not a screenshot glued into a PDF. The page is laid
          out for print at the paper size you chose, with its backgrounds and
          images kept and a modest margin on every side, and the result is a
          proper document:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Real text.</strong> Search it, select it, copy a quotation
            out of it. Screen readers can read it. Later, the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word converter
            </Link>{' '}
            can turn it back into something editable.
          </li>
          <li>
            <strong>Working links.</strong> Hyperlinks in the page stay
            clickable in the PDF, which is what makes a saved reference page
            useful rather than merely pretty.
          </li>
          <li>
            <strong>The page as designed.</strong> Fonts, colours, images,
            columns. Long pages simply run on across as many sheets as they
            need.
          </li>
          <li>
            <strong>A file that is yours.</strong> Nothing is stored on our
            servers after your download; the address is the only thing the
            capture needs, and nothing you paste in the text mode is retained.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section id="reach" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. What a Capture Can and Cannot Reach
        </h3>
        <p>
          The capture visits the address the way a first-time visitor would,
          with none of your logins. So it reaches exactly what a stranger
          reaches: public articles, documentation, product pages, listings,
          government notices, blogs. It does not reach:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Pages behind a login</strong> &mdash; your bank, a course
            portal, an order history. Use the text mode for these.
          </li>
          <li>
            <strong>Paywalled articles</strong>, which show the capture the
            same teaser they show everyone else. If you have the article open,
            copy its text across.
          </li>
          <li>
            <strong>Pages that block automated visitors</strong> outright. You
            get a clear message rather than a blank PDF.
          </li>
          <li>
            <strong>Whatever has not loaded yet.</strong> An infinite-scroll
            feed is captured down to where it stopped loading, not to the end
            of time.
          </li>
        </ul>
        <p>
          For the public record of how a page changed over the years, the{' '}
          <a
            href="https://web.archive.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Wayback Machine
          </a>{' '}
          remains the reference; a PDF is for the copy you need to hold, cite
          and file yourself.
        </p>
        <p>
          There is also a fair-use daily allowance of captures per connection.
          It is generous for a person and tight for a script, and the tool
          tells you plainly when it is used up rather than failing quietly.
          The text mode has no such limit.
        </p>
      </section>

      {/* 5 */}
      <section id="text-mode" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          5. The Text Mode: Paste, Title, Typeset
        </h3>
        <p>
          Switch to <em>From text</em> and the page becomes a small composer.
          Give the document a title and a subtitle, paste the original address
          into the source field so the PDF records where it came from, then
          paste the body. Press the button and the text is set on A4 or Letter
          with a rule under the heading, an archived-on timestamp, and{' '}
          <em>Page N of M</em> on every sheet. Paragraph breaks are kept; the
          menus, cookie banners and related-article widgets you did not paste
          are, of course, absent.
        </p>
        <p>
          It is the right route for a <strong>paywalled article to PDF</strong>{' '}
          you are entitled to read, for turning an email thread into something
          filable, for course notes, and for the wall-of-text that arrives
          when you copy from a chat window. It carries no pictures; if an image
          matters, save it and use the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPG to PDF converter
          </Link>{' '}
          to make a page of it, then the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          to put the two together.
        </p>
      </section>

      {/* 6 */}
      <section id="vs-print" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          6. Why Not Just Print to PDF From the Print Menu?
        </h3>
        <p>
          The print dialogue can save any page to a PDF, and for a simple
          article it is fine. The failures are familiar: text cut off at the right edge,
          a cookie banner stamped across page one, the site&rsquo;s sticky
          header repeated on every sheet, dark-mode pages printed as black
          rectangles, and backgrounds dropped so that white text vanishes.
          On a phone you have to find the share sheet, then the print
          preview, then the tiny PDF option, every single time.
        </p>
        <p>
          A capture from the address sidesteps most of that. Backgrounds are
          printed, the page is fitted to the paper you asked for with real
          margins, and the whole thing happens from one box you paste into.
          When the print route is the one that mangles a page, this is the
          quickest way to a copy that looks like the page did.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Webpage to PDF Tool
        </h3>
        <p>
          There are many <strong>webpage to PDF converters</strong>. Here is
          what this one does differently, stated so you can check it.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card, no monthly page counter. The tool on this page is the entire product.'],
            ['A real PDF, not a picture', 'Text you can search and copy, links you can click, the page laid out for the paper you chose.'],
            ['Two modes, honestly labelled', 'Public page? Paste the address. Private page? Paste the text. The tool never pretends it can log in as you.'],
            ['Your material stays private', 'Nothing is stored on our servers after your download, and nothing you paste is retained or used for training.'],
            ['Paper you actually print on', 'A4 and US Letter, portrait or landscape, with margins — not a 20,000-pixel-tall image pretending to be a document.'],
            ['Clear when something is out of reach', 'A login wall, a blocked site or a used-up allowance produces a plain message, not a blank file.'],
          ].map(([title, body]) => (
            <div key={title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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
          built on the same terms. Want just a picture of the page instead?
          The{' '}
          <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website screenshot tool
          </Link>{' '}
          captures it as a PNG at the viewport size you choose.
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
              'How do I save a webpage as a PDF for free?',
              'Paste the page’s address into the From a URL box at the top of this page, choose A4 or Letter and portrait or landscape, and press Save Webpage as PDF. The file downloads a few seconds later, named after the site and the page. There is no account, no watermark and no monthly limit on pages.',
            ],
            [
              'Is the PDF a screenshot or real text?',
              'Real text. The page is laid out for print, so the words are searchable and selectable, links stay clickable, and images and backgrounds are kept. A screenshot would give you none of that.',
            ],
            [
              'Can it save a page that needs a login, or a paywalled article?',
              'No. The capture visits the address as a first-time visitor, with none of your logins, so it sees what a stranger sees. For a page only you can open, switch to From text, copy the content across, and download a typeset PDF of it instead.',
            ],
            [
              'Why did I get a message about a daily allowance?',
              'URL captures carry a fair-use daily allowance per connection. It is more than a person needs in a day and less than a script would want. It resets daily; in the meantime the From text mode has no limit at all.',
            ],
            [
              'Will the images be included?',
              'From a URL, yes — images and backgrounds are part of the capture. From text, no: that mode typesets words only. If a picture matters there, save it, turn it into a page with the JPG to PDF converter, and join the two with the PDF merger.',
            ],
            [
              'Can I edit the PDF afterwards?',
              'Anyone can open, print and copy from it; there are no restrictions on the file. To change the words, run it through the PDF to Word converter. To keep it from being changed, put a password and permissions on it with the PDF protect tool.',
            ],
            [
              'Is the address or the text I paste kept anywhere?',
              'Nothing is stored on our servers after your download. The address is the only thing a URL capture needs, and nothing you paste in the text mode is retained or used for training or analytics.',
            ],
            [
              'Does it work on a phone?',
              'Yes, and it is one of the better reasons to use it there. Paste the address, press the button, and the PDF lands in your downloads without hunting through the share sheet for a print option.',
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
          Saved the page? Keep a whole research trail in one file with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , shrink an image-heavy capture with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , or lock a sensitive one with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>
          . And if you would rather understand how pages are rendered than
          only capture them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts from exactly that.
        </p>
      </div>
    </article>
  );
}
