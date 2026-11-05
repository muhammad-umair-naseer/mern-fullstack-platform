import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AppWindow,
  ArrowRight,
  Check,
  Code2,
  Focus,
  HelpCircle,
  Layers,
  MonitorSmartphone,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Website Screenshot PNG tool.
 *
 * Written against what WebsiteScreenshotPng.js actually does, which is two
 * different jobs behind one button. URL mode captures a public page at one of
 * four named viewports (plus a fixed 1280x800 "Custom Size") and can paint a
 * dark window frame with traffic-light dots and an address bar above it. The
 * HTML sandbox renders pasted markup at 1x, 2x or 3x with a transparent
 * background. The two modes do not share features: the frame is URL-only, the
 * resolution select and transparency are sandbox-only, and the article says so
 * every time one of those options comes up, because the settings panel shows
 * both controls regardless of mode and people will otherwise assume they apply.
 *
 * URL captures are above-the-fold only, so "full page" and "whole website on
 * mac" are answered honestly as no. "Custom Size" is not custom, so the article
 * calls it a fifth fixed preset. The mobile preset narrows the width and nothing
 * else, so it is sold as a narrow-viewport capture rather than device emulation.
 * Cookie banners cannot be dismissed, and section 7 plus the FAQ say so.
 *
 * Declined keywords: "html2canvas online tool" and "screenshot website without
 * opening it" both describe how or where the capture runs rather than what
 * the reader gets, so neither appears.
 */
export default function WebsiteScreenshotPngSeoArticle() {
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
        How to Take a <span className="text-orange-600 dark:text-orange-400">Website Screenshot PNG</span> From a URL or From Raw HTML
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A page you built, a landing page for a case study, an email design
        that needs sign-off: sooner or later each has to become a picture.
        This is a <strong>website screenshot PNG</strong> tool with two ways
        in: paste a link and capture the page at an exact device viewport with
        a clean window frame painted in, or paste HTML and CSS and get a sharp,
        transparent image back. It is a{' '}
        <strong>free website screenshot online</strong> with no signup and no
        watermark, and this guide covers what each mode does, what it does not,
        and which to reach for.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/website-png-screenshot.webp"
            alt="A man browsing a web page on a tablet beside a cup of black coffee"
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
              Two inputs, one output: a live URL framed like a window, or a
              pasted HTML snippet rendered at 2x with a transparent background.
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
            ['#what-you-get', '1. What a Website Screenshot PNG Gives You'],
            ['#how-to-capture', '2. How to Screenshot a Website as PNG (Step-by-Step)'],
            ['#viewport-presets', '3. Viewport Presets: 1920x1080, 1366x768, 768x1024, 390x844'],
            ['#browser-frame', '4. The Clean Window Frame'],
            ['#html-sandbox', '5. The HTML Sandbox: Convert HTML to PNG'],
            ['#sharpness', '6. Blurry Screenshots and the Resolution Setting'],
            ['#limits', '7. Limits Worth Knowing Before You Start'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Website Screenshot Generator'],
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
      <section id="what-you-get" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Website Screenshot PNG Gives You
        </h3>
        <p>
          A <strong>website screenshot PNG</strong> is a fixed picture of a page
          saved in the format defined by the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C Portable Network Graphics specification
          </a>
          . PNG matters for two reasons. It is lossless, so the thin lines and
          small type of most web pages come through without the smudging a JPG
          adds around edges. And it carries an alpha channel, so an image can
          have a genuinely transparent background.
        </p>
        <p>
          That makes a <strong>lossless PNG website capture</strong> the right
          choice for portfolios, slide decks, documentation and bug reports.
          When you need a smaller file for a chat message, the{' '}
          <Link to="/tools/website-jpg-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website JPG screenshot
          </Link>{' '}
          tool is the same capture with a different output.{' '}
          <strong>URL to PNG</strong> here is the sharp, unaltered version.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-capture" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Screenshot a Website as PNG (Step-by-Step)
        </h3>
        <p>
          This is <strong>how to screenshot a website PNG</strong> without an
          account, an email step or a trial. Leave the toggle on Capture Live
          URL and:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Paste the address', 'Type or paste the page URL. If you leave off https:// it is added for you, and an address that is not a valid URL is refused with a clear message.'],
            ['Pick a viewport and the frame', 'Choose a device preset, then decide whether you want the clean window frame painted above the page. It is on by default.'],
            ['Capture and download', 'Press Capture Lossless PNG. A result card shows the filename, pixel dimensions and file size with a preview, and Download PNG saves it.'],
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
          The file is named after the domain and the preset, so example.com at
          the desktop preset arrives as example_com_1920x1080.png. That is a{' '}
          <strong>website screenshot no signup</strong> from start to finish.
        </p>
      </section>

      {/* 3 */}
      <section id="viewport-presets" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorSmartphone className="w-6 h-6 text-orange-500 shrink-0" />
          3. Viewport Presets: 1920x1080, 1366x768, 768x1024 and 390x844
        </h3>
        <p>
          Captures usually look wrong because they were taken at whatever size
          the person&rsquo;s own screen happened to be. A{' '}
          <strong>website screenshot generator</strong> with named presets fixes
          that: everyone captures at the same width.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Desktop 1080p — 1920x1080', 'The answer to how to screenshot a website at 1920x1080 when your own monitor is a different size: the full-HD layout most designs are signed off against.'],
            ['Laptop HD — 1366x768', 'A website screenshot 1366x768 shows the width many laptops still use, where cramped navigation and overflowing hero text appear first.'],
            ['iPad Tablet — 768x1024', 'An iPad 768x1024 website screenshot is the classic portrait tablet width, where most breakpoints flip from columns to a stacked layout.'],
            ['Mobile iPhone — 390x844', 'A website screenshot 390x844 iPhone viewport capture is the logical width of recent iPhones, and how to screenshot a website in mobile view without a phone.'],
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
          Two honest notes. The fifth button, labelled Custom Size, is a fixed
          1280x800 preset rather than inputs you can type into. And the mobile
          preset narrows the viewport width; it does not pretend to be a phone,
          so a site that picks its layout from the device rather than the width
          may still serve its desktop version.
        </p>
      </section>

      {/* 4 */}
      <section id="browser-frame" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AppWindow className="w-6 h-6 text-orange-500 shrink-0" />
          4. The Clean Window Frame: A Mockup in the Same Click
        </h3>
        <p>
          A raw capture of your own screen shows your tabs, bookmarks bar and
          extension icons. That is the &ldquo;screenshot shows my bookmarks bar
          and tabs&rdquo; problem, and the usual fix is two-step: capture, then
          hand it to a second tool to have chrome drawn around it.
        </p>
        <p>
          Here it is one checkbox. With Add Clean Browser Window Frame ticked, a{' '}
          <strong>website screenshot with browser frame</strong> comes out with
          a dark 42-pixel header above the page: three traffic-light dots, a
          rounded address bar, and the page&rsquo;s own URL beside a padlock.
          It is the{' '}
          <strong>screenshot website with mac window frame PNG</strong> look
          that case studies and pitch decks use, without the second tool.
        </p>
        <p>
          The frame is a fixed design: no choice of style, colour, padding or
          backdrop. Untick the box and you get the bare page. It belongs to URL
          mode only; HTML sandbox captures come out unframed, because a
          component would look odd inside a window.
        </p>
      </section>

      {/* 5 */}
      <section id="html-sandbox" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-orange-500 shrink-0" />
          5. The HTML Sandbox: Convert HTML to PNG Online
        </h3>
        <p>
          Switch to Custom HTML Sandbox and the address field becomes a code
          box. Paste HTML and CSS, press capture, and you get an image of
          exactly that markup. This is how to{' '}
          <strong>convert HTML to PNG online</strong> and how to{' '}
          <strong>render an HTML snippet to an image</strong> when you want a
          picture of a component, a card or a pricing table rather than a whole
          live site.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Transparent by default
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Anything you do not give a background stays transparent: HTML to
              PNG with a transparent background, ready to drop onto a slide
              without a white rectangle around it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Sized by content, sharpened by scale
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Width comes from the preset, capped at 1280; height comes from the
              markup itself. Render Resolution at 1x, 2x or 3x multiplies both,
              so a 2x Retina screenshot of HTML is one setting away.
            </p>
          </div>
        </div>
        <p>
          The sandbox is where a marketer takes a{' '}
          <strong>screenshot of an HTML email template to PNG</strong> for
          approval. Images can be inlined as data URIs with the{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder
          </Link>{' '}
          so the snippet is self-contained.
        </p>
        <p>
          Three things to know. Script tags in pasted markup do not run, so a
          snippet that builds itself on load captures empty. Images hosted on
          another site may come out blank unless that host permits embedding.
          And a few newer CSS effects, backdrop blur among them, are not
          reproduced.
        </p>
      </section>

      {/* 6 */}
      <section id="sharpness" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Focus className="w-6 h-6 text-orange-500 shrink-0" />
          6. Why Does My Website Screenshot Look Blurry?
        </h3>
        <p>
          Almost always because it was captured at one pixel per point and is
          viewed on a screen that shows two, so the image is stretched and text
          goes soft. The same thing is behind &ldquo;screenshot too small for presentation&rdquo;:
          projected onto a wall, a standard-density capture is short of pixels.
        </p>
        <p>
          The fix is to capture with more pixels to begin with, and here the two
          modes differ. In the HTML sandbox the Render Resolution select does
          exactly this: 2x doubles the pixel dimensions, 3x triples them. The
          dropdown is visible in URL mode too, but it does not apply there; a
          live URL comes back at standard density at the preset&rsquo;s width, plus
          the frame header if you added it.
        </p>
        <p>
          If a URL capture needs to be larger, pick the biggest preset that
          suits the layout; failing that, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          can scale it up, though enlargement never recovers detail that was not
          captured.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          7. Limits Worth Knowing Before You Start
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Above the fold only.</strong> A URL capture is the viewport
            you chose, cropped to that height. It is not a full-page scroll.
          </li>
          <li>
            <strong>Public pages only.</strong> Anything behind a login or a
            paywall, or a work-in-progress build that has not been published,
            cannot be captured from its URL. If you have the markup, the sandbox
            is the way through.
          </li>
          <li>
            <strong>Cookie banners stay.</strong> If you are searching
            &ldquo;screenshot website cookie banner in the way&rdquo;, the
            honest answer is that this tool cannot dismiss them. Crop the
            capture afterwards with the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>
            , or paste the page&rsquo;s markup into the sandbox if it is yours.
          </li>
          <li>
            <strong>No delay, no element targeting, no batch.</strong> One URL,
            one capture. There is no timer, no selector, and no list of
            addresses to run overnight.
          </li>
          <li>
            <strong>PNG out, nothing else.</strong> For a document rather than
            an image, see{' '}
            <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              save web as PDF
            </Link>
            . A finished PNG can be converted later with the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>
            .
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Website Screenshot Generator
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Two inputs, one tool', 'Capture a live URL or render pasted HTML from the same page. HTML-to-image is not a separate product.'],
            ['Frame baked in, same click', 'The clean window frame is painted into the PNG as part of the capture, not by a second mockup tool afterwards.'],
            ['Website screenshot no watermark', 'Nothing is stamped across the corner and no tier removes it. The image you download is the image.'],
            ['Named device viewports', 'Four real sizes — 1920x1080, 1366x768, 768x1024 and 390x844 — so a whole team captures at the same width.'],
            ['Honest about its limits', 'Above-the-fold URL captures, sandbox-only Retina scaling and a fixed frame are written down here, not discovered after the download.'],
            ['Nothing kept', 'Cortexis does not store your captures or pasted markup. Nothing is retained after your session and nothing is ever used for training.'],
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
            free image and document tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress it
          </Link>
          ,{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            resize it
          </Link>{' '}
          or{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            crop it
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
              'How do I take a website screenshot PNG for free without signing up?',
              'Paste the address into the Capture Live URL field above, pick a viewport preset, choose whether you want the window frame, and press Capture Lossless PNG. No account, no email step, no watermark, and free every time rather than for the first few captures.',
            ],
            [
              'Can I take a screenshot of a whole website, top to bottom?',
              'Not with this tool. URL captures are cropped to the height of the preset you choose, so you get the top of the page as it fits that viewport. For a record of a page as a document, save web as PDF is the neighbouring option.',
            ],
            [
              'Why does my website screenshot look blurry?',
              'Because it was captured at standard density and is viewed on a high-density display. In the HTML sandbox, set Render Resolution to 2x or 3x for two or three times the pixels. A live URL comes back at standard density whatever you select there, so choose the largest preset that suits the layout.',
            ],
            [
              'How do I screenshot a website in mobile view without a phone?',
              'Choose the Mobile iPhone preset for 390x844, or iPad Tablet for 768x1024. Sites that pick their layout from the viewport width will show their phone or tablet layout; sites that decide from the device itself may still show the desktop version, because the preset changes the width only.',
            ],
            [
              'The cookie banner is covering the page. Can the tool remove it?',
              'No. Consent popups are captured as they appear and there is no option to dismiss them. Crop the capture afterwards with the image cropper, or, if the page is yours, paste its markup into the HTML sandbox and leave the banner out.',
            ],
            [
              'Can I get a transparent background on a website screenshot?',
              'In the HTML sandbox, yes: any area of your markup without a background is saved as transparent PNG. Live URL captures are always opaque, because a real page has a background of its own.',
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
          Need a different output from the same page? The{' '}
          <Link to="/tools/website-jpg-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website JPG screenshot
          </Link>{' '}
          tool gives a smaller file for chat and email,{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web as PDF
          </Link>{' '}
          is the one for a document, and{' '}
          <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WebP to PNG
          </Link>{' '}
          handles captures you were given in that format. To learn how the pages
          you capture are built, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web course
          </Link>{' '}
          starts with HTML, CSS and the breakpoints these presets are designed
          around.
        </p>
      </div>
    </article>
  );
}
