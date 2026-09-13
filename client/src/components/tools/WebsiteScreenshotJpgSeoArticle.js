import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AppWindow,
  ArrowRight,
  Camera,
  Check,
  Code2,
  HelpCircle,
  Layers,
  MonitorSmartphone,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Website JPG Screenshot tool.
 *
 * Written against what WebsiteScreenshotJpg.js actually does, which rules
 * out most of what the neighbouring keywords assume.
 *
 * URL mode produces an above-the-fold viewport capture: the preset sets the
 * width and the height is a crop, not a scroll. "Full page screenshot" is the
 * single biggest expectation in this space and the tool does not serve it, so
 * section 7 and the FAQ say so plainly rather than letting the reader find
 * out from a truncated image.
 *
 * "Custom Size" is a fixed 1280x800 preset — there are no width/height
 * inputs — so section 3 describes it as a fifth preset, never as free
 * dimensions. "Mobile view" is a width choice only, with no device emulation,
 * so the mobile paragraph warns that sites which detect the device rather
 * than the width may still serve their desktop layout.
 *
 * Declined outright: "without watermark" and "no capture limit" are promised
 * only for HTML mode, where the image is built entirely from the pasted
 * snippet. URL captures come from an outside capture service whose output,
 * marks and limits the code does not control, so the article says so. URL
 * captures of pages behind logins, cookie walls or bot blocks are not promised
 * at all; that reader is routed to HTML mode. PNG, PDF, batch, API and
 * uploading an existing image are each sent to the tool that does them.
 *
 * The word "browser" appears in this file only as the name of the painted
 * window frame ("Add Clean Browser Window Frame" is the checkbox label). It
 * never describes where or how a capture is produced.
 */
export default function WebsiteScreenshotJpgSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">Website Screenshot JPG</span>: Capture Any Page as a Framed, Sized, Shareable Image
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A screenshot is rarely the end of the job. It goes into a portfolio, a
        README, a slide or a client email, and each wants a specific width, a
        sensible file size and something that looks finished. This{' '}
        <strong>website screenshot JPG</strong> tool is built around exactly
        that. Type an address or paste an HTML snippet,
        pick a viewport from full HD down to iPhone width, decide whether a dark
        window frame with the URL is painted on, and set the{' '}
        <strong>JPEG quality</strong> while the result card shows the exact
        pixel size and kilobytes before you download.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/website-jpg-screenshot.webp"
            alt="Website screenshot JPG - capture a web page at a chosen viewport with a window frame and adjustable JPEG quality"
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
              Viewport, frame and quality chosen up front, so the JPG that
              comes out is the one you wanted to share.
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
            ['#what-you-get', '1. What a Website Screenshot JPG From This Tool Contains'],
            ['#how-to', '2. How to Take a Screenshot of a Website as JPG'],
            ['#viewports', '3. Five Viewports: 1920x1080 Down to 390x844'],
            ['#browser-frame', '4. Showing Your Website in a Portfolio With a Window Frame'],
            ['#quality', '5. JPEG Quality: How to Reduce Screenshot File Size'],
            ['#html-sandbox', '6. Paste HTML, Get a JPG'],
            ['#limits', '7. What This Tool Does Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Website Screenshot Tool'],
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
          1. What a Website Screenshot JPG From This Tool Contains
        </h3>
        <p>
          There are two ways into this <strong>website JPG screenshot</strong>{' '}
          tool. <strong>Capture Live URL</strong> takes an address and returns
          a <strong>url to jpg</strong> capture of the page as a first-time
          visitor sees it. <strong>Custom HTML Sandbox</strong>{' '}
          takes pasted markup and returns a picture of the rendered result. Both
          end in the same place: a JPEG file with a download link.
        </p>
        <p>
          The URL capture is an <strong>above the fold screenshot of a website</strong>.
          The preset sets the width the page is laid out at, and the preset
          height is where the capture is cut off. You get the first screen, the
          part a visitor sees before scrolling, which is what a thumbnail, slide
          or portfolio card usually wants.
        </p>
        <p>
          On top, if you leave the checkbox ticked, sits a dark window frame
          carrying the URL. When people search for how to{' '}
          <strong>convert website to JPG image</strong>, this is the version
          that arrives ready to paste somewhere.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Take a Screenshot of a Website as JPG (Step-by-Step)
        </h3>
        <p>
          This is a <strong>website screenshot generator with no signup</strong>:
          no account and no email step. To turn a <strong>webpage to JPG</strong>{' '}
          with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Enter the address', 'Keep Capture Live URL selected and paste the address. The https:// prefix is added if you leave it off; an address that cannot be parsed is flagged before anything runs.'],
            ['Pick viewport, frame and quality', 'Choose one of the five device presets, decide whether to keep the window frame, and set JPG Image Quality anywhere from 30% to 100%. The default is 90%.'],
            ['Capture and download', 'Press Capture JPG Screenshot. The result card shows the exact pixel dimensions and real file size in KB, a preview and a Download JPG button.'],
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
          The filename is built from the address and the preset, something like{' '}
          <code>docs_example_com_1366x768.jpg</code>. If the preview is not what
          you wanted, change a setting and capture again. That is the whole
          workflow of this <strong>free website screenshot tool online</strong>.
        </p>
      </section>

      {/* 3 */}
      <section id="viewports" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorSmartphone className="w-6 h-6 text-orange-500 shrink-0" />
          3. Take a Screenshot of a Website on Different Screen Sizes
        </h3>
        <p>
          The five preset buttons are the only size control; each sets a width
          and a crop height. Width is what changes the layout: a responsive site
          collapses its navigation and stacks its columns depending on how wide
          the{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Glossary/Viewport"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            viewport
          </a>{' '}
          is.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Desktop 1080p, 1920&times;1080.</strong> The default, and the
            one to reach for when you need a{' '}
            <strong>website screenshot 1920x1080 JPG</strong> for a slide, a
            video thumbnail or a monitor mockup.
          </li>
          <li>
            <strong>Laptop HD, 1366&times;768.</strong> Closer to what many
            laptop users actually see.
          </li>
          <li>
            <strong>iPad Tablet, 768&times;1024.</strong> Portrait tablet width,
            where most sites switch to their intermediate layout.
          </li>
          <li>
            <strong>Mobile iPhone, 390&times;844.</strong> An{' '}
            <strong>iPhone size website screenshot at 390x844</strong>, tall
            enough to show the first full screen of a mobile layout.
          </li>
          <li>
            <strong>Custom Size, 1280&times;800.</strong> Despite the name, a
            fifth fixed preset rather than free inputs.
          </li>
        </ul>
        <p>
          A note for anyone searching <strong>screenshot website mobile view online</strong>:
          this is a width choice. A site that adapts to width shows its mobile
          layout; one that detects the device instead may still serve its
          desktop version squeezed narrow, and there is no setting to change that.
        </p>
        <p>
          One more thing to know: if the first attempt at a URL capture fails,
          a second attempt is made that does not honour the chosen preset, so
          the image can come back at a different size. The result card always
          reports the real pixel dimensions, so check it before you download.
        </p>
      </section>

      {/* 4 */}
      <section id="browser-frame" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AppWindow className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Show Your Website in a Portfolio With a Browser Window
        </h3>
        <p>
          The usual answer to <strong>how to show my website in portfolio with browser window</strong>{' '}
          is a mockup generator: screenshot, open it in another app, drag into a frame
          template, export again. Here the frame is painted on at the moment of
          capture, so that step disappears.
        </p>
        <p>
          With <strong>Add Clean Browser Window Frame</strong> ticked, a 42-pixel
          dark title bar is added above the capture: three traffic-light dots,
          a rounded address pill, and the address you entered (with https://
          added if you left it off) behind a lock symbol. The result is a{' '}
          <strong>website screenshot with a mac-style window frame</strong>, made
          online. The frame text cannot be edited; untick the box for the bare
          capture.
        </p>
        <p>
          That makes it a good fit for a{' '}
          <strong>GitHub README screenshot of a website in JPG</strong>: pick
          1280&times;800 or 1366&times;768, keep the frame, set quality around
          80%, and you have a hero image that reads as a product.
        </p>
        <p>
          Two honest limits. The frame has one style, dark, with no device bezel
          or phone mockup. And it is only drawn in URL mode, so an HTML snippet
          always comes out bare.
        </p>
      </section>

      {/* 5 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          5. JPEG Quality: How to Reduce Screenshot File Size
        </h3>
        <p>
          A JPEG, as defined by the{' '}
          <a
            href="https://www.iso.org/standard/18902.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 10918 standard
          </a>
          , trades detail for size, and the slider decides how much. It runs from
          30% to 100% and the default is a{' '}
          <strong>website screenshot JPG at quality 90</strong>, which keeps
          interface text crisp at a fraction of the size of a PNG. The result
          card reports the real size in KB, so the answer to{' '}
          <strong>how to reduce screenshot file size with JPG quality</strong>{' '}
          is to drag the slider down, capture again and read the number.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              The file is too large to attach
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A <strong>website screenshot too large in file size</strong> is
              almost always a PNG, or a maximum-quality JPEG on a big viewport.
              Drop to a smaller preset if width does not matter, then lower
              quality toward 70% and watch the KB readout.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              It looks blurry once shared
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When a <strong>screenshot of a website looks blurry when shared</strong>,
              the chat or social app has recompressed it. Send a JPG already at
              the size you want, at 85% or above, so there is less to shrink.
            </p>
          </div>
        </div>
        <p>
          There is no target-size option; for an exact kilobyte budget, hand the
          file to the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="html-sandbox" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-orange-500 shrink-0" />
          6. Paste HTML, Get a JPG: Screenshot HTML Code as an Image
        </h3>
        <p>
          Switch to <strong>Custom HTML Sandbox</strong>, paste markup with
          inline styles, press capture, and you get an image of the rendered
          result on a white background. This is the{' '}
          <strong>html to jpg online free</strong> path for people who have a
          fragment rather than a page: an{' '}
          <strong>email template HTML preview image</strong> to send a client,
          a card component for a design review, a pricing table for a slide.
        </p>
        <p>
          It is also the plainest way to <strong>convert HTML to JPG without software</strong>{' '}
          such as a design suite. You <strong>paste HTML, get a JPG</strong>,
          rendered at double pixel density so small text and thin borders stay
          sharp when scaled down.
        </p>
        <p>
          The snippet is laid out at the preset width, capped at 1280 pixels,
          and the height is whatever the content needs. When you{' '}
          <strong>screenshot HTML code as an image</strong> this way, scripts
          do not run and external stylesheets, fonts and images may not appear
          unless their host allows it, so self-contained markup with inline
          styles gives the most faithful result. Nothing you paste is retained.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Does Not Do (and Where to Go Instead)
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Full-page scrolling capture.</strong> URL mode is cropped at
            the preset height. To keep the whole page as a document, use{' '}
            <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              save web page as PDF
            </Link>
            .
          </li>
          <li>
            <strong>Pages behind a login, cookie wall or paywall.</strong> The
            capture shows what a public visitor sees. Sites that block automated
            visitors may fail with a host-restriction message; use HTML mode.
          </li>
          <li>
            <strong>Any format other than JPEG.</strong> For lossless output use
            the{' '}
            <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
              website PNG screenshot
            </Link>{' '}
            tool; to change format afterwards, the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>{' '}
            handles it.
          </li>
          <li>
            <strong>Converting a screenshot you already have.</strong> There is no
            file input. An existing grab goes through the image converter or the{' '}
            <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image compressor
            </Link>{' '}
            if size is the problem.
          </li>
          <li>
            <strong>Exact dimensions, cropping or annotation.</strong> Capture at
            the nearest preset, then finish with the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>
            .
          </li>
          <li>
            <strong>Batches, scheduled captures or an API.</strong> One address,
            one capture, one download.
          </li>
          <li>
            <strong>Private URL captures.</strong> The address you enter in URL
            mode is handed to an outside capture service to produce the image,
            so use it for public pages only. Pasted HTML is the mode to use for
            anything you would not want to share.
          </li>
        </ul>
        <p>
          On a <strong>screenshot website JPG without watermark</strong>:
          Cortexis itself adds nothing to the image except the optional window
          frame. In HTML mode the picture is built entirely from your snippet,
          so it is free of any marks. URL captures are produced by an outside
          capture service whose output, marks and usage limits Cortexis does
          not control, so that is the one promise we make only for HTML mode.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Website Screenshot Tool
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no signup', 'No account and no email step. An online website screenshot JPEG free, with the download link on the page the moment the capture finishes.'],
            ['Frame painted at capture time', 'The dark window bar with the address is part of the image the moment it is made. No mockup tool, no second export.'],
            ['Five real viewports', 'Full HD, laptop, tablet, phone and 1280x800, each giving a different layout of the same page.'],
            ['Quality slider with a live KB readout', 'Set JPEG quality from 30% to 100% and see the real file size before you download.'],
            ['HTML snippets welcome', 'Paste markup and styling and get a double-density image of the rendered result, with nothing retained.'],
            ['Nothing stored', 'Captures and pasted snippets are never stored on our servers, never retained after your session and never used for training.'],
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
          </Link>
          , so the JPG you capture here can be{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            resized
          </Link>
          ,{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compressed further
          </Link>{' '}
          or{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            converted to another format
          </Link>
          .
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
              'How do I take a website screenshot as a JPG without signing up?',
              'Type the address into the Capture Live URL box above, pick a preset and press Capture JPG Screenshot. A website screenshot JPG appears with a Download JPG button. There is no account and no email step. URL captures rely on an outside capture service, so if one fails, wait a moment and try again or switch to HTML mode.',
            ],
            [
              'Can I get a screenshot of a website without opening it myself?',
              'Yes. Enter the address and the capture comes back as an image of what a first-time public visitor would see. Pages behind a login or that block automated visitors may not capture; use HTML mode for those.',
            ],
            [
              'Does this capture the full page or only the top?',
              'Only the top. The capture is cut at the preset height, so you get the first screen a visitor sees, not a long scrolling image. To keep the whole page as a document, use the save web page as PDF tool.',
            ],
            [
              'Why is my website screenshot such a large file, and how do I make it smaller?',
              'Large screenshots are usually PNGs or maximum-quality JPEGs at full HD width. Pick a smaller preset if width does not matter, lower the quality slider toward 70%, and read the KB figure on the result card before you download.',
            ],
            [
              'Why does my screenshot look blurry after I share it?',
              'The app you shared it through recompressed it. Send a JPG already at the size you need, at 85% quality or higher, so there is less for the receiving app to shrink.',
            ],
            [
              'Can I screenshot a website in mobile view online?',
              'Choose the Mobile iPhone preset for a 390x844 capture. Sites that adapt to width show their mobile layout; a site that detects the device instead may still show its desktop version, and there is no setting to override that.',
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
          Need a different kind of capture? The{' '}
          <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website PNG screenshot
          </Link>{' '}
          tool gives you a lossless image of the same page,{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web page as PDF
          </Link>{' '}
          keeps it as a document, and the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          trims a capture to one section. If you would rather build pages than
          screenshot them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts with HTML and CSS.
        </p>
      </div>
    </article>
  );
}
