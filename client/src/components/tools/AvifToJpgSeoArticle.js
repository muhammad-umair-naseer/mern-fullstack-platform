import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileImage,
  HelpCircle,
  Layers,
  MonitorSmartphone,
  Printer,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the AVIF to JPG tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Most visitors arrive with a file that will not open or an upload form
 *    that rejects it. Section 1 explains the format and the reason first.
 *
 * 2. The trade-offs are stated plainly: JPG is lossy, metadata is dropped,
 *    HDR becomes 8-bit, an animated AVIF gives one frame, pixel size is kept.
 *
 * 3. What the tool does not do (reverse direction, resizing, target sizes,
 *    PDF, HEIC) is routed to the sibling tool that does.
 */
export default function AvifToJpgSeoArticle() {
  const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

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
        How to Convert <span className="text-orange-600 dark:text-orange-400">AVIF to JPG</span>, PNG or WebP: Why the File Won&rsquo;t Open, the Right Settings, and What Changes
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You saved a picture from a website and it came down as <em>.avif</em>.
        Windows Photos shows an error, the print shop&rsquo;s order form refuses
        it, and the marketplace listing wants a JPG. This guide shows how to{' '}
        <strong>convert AVIF to JPG</strong> for free, when{' '}
        <strong>AVIF to PNG</strong> or WebP is the better choice, which quality
        setting to pick, and exactly what an <strong>AVIF converter</strong>{' '}
        keeps and loses along the way. Whether you search for{' '}
        <strong>AVIF to JPEG</strong> or <strong>AVIF to JPG</strong>, it is the
        same file and the same fix.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/avif-to-jpg.webp"
            alt="AVIF to JPG converter online free - batch converting AVIF images to high quality JPG, PNG and WebP files with a white background for transparent areas"
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
              Same pixel size in, a JPG, PNG or WebP out, and one ZIP when
              there is a whole batch.
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
            ['#what-is-avif', '1. What Is an AVIF File, and Why Won’t It Open?'],
            ['#how-to-convert', '2. How to Convert AVIF to JPG in Three Steps'],
            ['#pick-format', '3. AVIF to JPG, AVIF to PNG or AVIF to WebP?'],
            ['#quality', '4. AVIF to JPG Without Losing Quality: What Changes'],
            ['#platforms', '5. Windows 10, Mac, iPhone and Chromebook'],
            ['#situations', '6. Printing, Email, Photoshop and Animated AVIF'],
            ['#why-cortexis', '7. Why Use Cortexis to Convert AVIF'],
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
      <section id="what-is-avif" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Is an AVIF File, and Why Won&rsquo;t It Open?
        </h3>
        <p>
          If you are asking <strong>what is an AVIF file</strong>: it is a
          still-image format built on the AV1 video codec and published by the
          Alliance for Open Media in the{' '}
          <a
            href="https://aomediacodec.github.io/av1-avif/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            AV1 Image File Format (AVIF) specification
          </a>
          . It packs a photo into a smaller file than a comparable JPG, supports
          transparency, and can carry HDR and wide colour. That is why so many
          websites now serve their pictures as AVIF.
        </p>
        <p>
          Plenty of everyday software has not caught up, which explains
          nearly every <strong>AVIF file won&rsquo;t open</strong> complaint:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Windows Photos can&rsquo;t open AVIF</strong> on many
            machines, usually because the AV1 video extension it relies on is
            missing.
          </li>
          <li>
            <strong>Images saving as AVIF instead of JPG.</strong> When a site
            serves AVIF, &ldquo;Save image as&rdquo; stores exactly that. A{' '}
            <strong>Google Images download AVIF to JPG</strong> conversion is
            the usual fix, in the same three steps.
          </li>
          <li>
            <strong>Website won&rsquo;t accept AVIF upload?</strong>{' '}
            Marketplaces, job portals, forums and print services often accept
            only JPG and PNG.
          </li>
          <li>
            <strong>Older editors and office suites</strong> show a blank box or
            an &ldquo;unsupported format&rdquo; message.
          </li>
        </ul>
        <p>
          If you searched &ldquo;how to open AVIF file&rdquo;, a codec pack or
          viewer fixes one computer. Converting gives you a file that opens
          everywhere, for everyone you send it to.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert AVIF to JPG in Three Steps
        </h3>
        <p>
          Here is <strong>how to convert AVIF to JPG</strong> with the tool
          above. It is also <strong>how to save AVIF image as JPG</strong>{' '}
          copies from any site: save the picture, then run it through.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your AVIF images.</strong> Drop them onto the panel or
            click it to choose files. Each shows as a removable chip.
          </li>
          <li>
            <strong>Choose the output.</strong> Format defaults to JPG. The
            quality slider runs from 40% to 100% in steps of 5 and starts at
            90%. For images with see-through areas, pick the fill: white,
            black, or transparent (PNG and WebP only).
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert</em>. Each
            image gets a card with a preview, its pixel size and a download.
            The file keeps its original name with a new extension.
          </li>
        </ol>
        <p>
          That makes it a <strong>bulk AVIF to JPG converter</strong> as well:
          convert more than one file and an extra card, &ldquo;All N images as
          ZIP&rdquo;, appears at the top, downloading everything as{' '}
          <strong>converted-jpg.zip</strong> (or -png, -webp). If any file
          fails, the rest still convert and the failures are listed by name.
          Your AVIF files are never stored on our servers, and nothing is
          retained once the conversion is done.
        </p>
      </section>

      {/* 3 */}
      <section id="pick-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. AVIF to JPG, AVIF to PNG or AVIF to WebP?
        </h3>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['JPG for sharing', 'Opens in every photo viewer, email client, upload form and print kiosk. Best for photos. It has no transparency, so see-through areas are filled with white or black.'],
            ['PNG for editing', 'Lossless, so nothing is lost on the way out of this tool, and it keeps transparency. Pick it for logos, screenshots, cut-outs and anything you will keep editing.'],
            ['WebP for the web', 'An AVIF to WebP converter is what you want when a CMS or theme rejects AVIF but still wants a small, modern file with optional transparency.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <Check className="w-5 h-5 text-orange-500 shrink-0" /> {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          The <strong>AVIF to JPG transparent background white</strong> case
          is common: a product cut-out for a white listing page. Leave the
          background on White, the default. Choosing &ldquo;Transparent&rdquo; with JPG
          still gives white, because JPG cannot store transparency; switch to
          PNG if you need it kept. Some older Safari versions cannot produce
          WebP, and the tool tells you so and suggests PNG or JPG instead.
        </p>
      </section>

      {/* 4 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. AVIF to JPG Without Losing Quality: What Changes
        </h3>
        <p>
          Pages promising <strong>AVIF to JPG without losing quality</strong>{' '}
          skip a detail: JPG is a lossy format, so any JPG is a fresh
          approximation of the picture. For an{' '}
          <strong>AVIF to JPG high quality</strong> result, keep the slider around
          85 to 90% for photos you will share, and go higher for images you
          will print or crop. Expect the JPG to be larger than the AVIF you
          started with in most cases, because AVIF is the more compact format. If you need
          truly lossless output, choose PNG.
        </p>
        <p>What stays the same, and what does not:</p>
        <ul className="space-y-2">
          <li>
            <strong>Pixel size is kept.</strong> A 1920&times;1080 AVIF becomes
            a 1920&times;1080 JPG. Nothing is scaled; to make it smaller, use
            the{' '}
            <Link to="/tools/image-resizer" className={linkClass}>
              image resizer
            </Link>{' '}
            afterwards.
          </li>
          <li>
            <strong>Metadata is removed.</strong> EXIF, GPS location, camera
            details, XMP and embedded colour profiles do not carry over, and
            nothing can restore them. To see what a file holds first, the{' '}
            <Link to="/tools/exif-remover" className={linkClass}>
              EXIF remover
            </Link>{' '}
            shows it.
          </li>
          <li>
            <strong>HDR becomes standard range.</strong> A 10-bit or 12-bit HDR
            AVIF comes out as an 8-bit sRGB image, tone-mapped to fit.
          </li>
          <li>
            <strong>Animation becomes one frame.</strong> An animated AVIF
            gives a single still image, not the whole sequence.
          </li>
        </ul>
        <p>
          Need a JPG under a set size for a form? Convert here, then use the{' '}
          <Link to="/tools/jpeg-compressor" className={linkClass}>
            JPEG compressor
          </Link>{' '}
          to squeeze it further than the slider allows.
        </p>
      </section>

      {/* 5 */}
      <section id="platforms" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorSmartphone className="w-6 h-6 text-orange-500 shrink-0" />
          5. Windows 10, Mac, iPhone and Chromebook
        </h3>
        <p>
          The steps are the same everywhere: current Chrome, Firefox, Edge
          and Safari (16.4 or later) all open AVIF.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>How to convert AVIF to JPG on Windows 10:</strong> open this
            page in Chrome, Edge or Firefox and convert. You get a JPG that
            Photos, Paint and Office open, with no extension to hunt for.
          </li>
          <li>
            <strong>How to convert AVIF to JPG on Mac:</strong> use this page in
            Safari, Chrome or Firefox. It handles a whole folder in one go and
            gives you a single ZIP, without a round of Preview exports.
          </li>
          <li>
            <strong>AVIF to JPG on iPhone:</strong> in Safari on iOS 16.4 or
            later, tap the drop area, choose the AVIF from Files or Photos,
            and save the JPG for Messages or social apps.
          </li>
          <li>
            <strong>Convert AVIF to JPG on Chromebook:</strong> the page works
            in Chrome as it is.
          </li>
        </ul>
        <p>
          If a file shows &ldquo;this AVIF file could not be opened
          here&rdquo;, update to a current version first; Safari before 16.4
          cannot read AVIF at all. If it still fails, the file is probably
          damaged or not really AVIF, and downloading it again usually helps.
        </p>
      </section>

      {/* 6 */}
      <section id="situations" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          6. Printing, Email, Photoshop and Animated AVIF
        </h3>
        <p>
          <strong>Convert AVIF to JPG for printing</strong> with the slider at
          95 or 100%; pixel size is unchanged, so the print is as sharp as the
          original allows. Want the images as one printable document? Convert here, then gather
          the JPGs with{' '}
          <Link to="/tools/image-to-pdf" className={linkClass}>
            image to PDF
          </Link>
          .
        </p>
        <p>
          Pick <strong>AVIF to JPG for email attachment</strong> use, since
          JPG is the format every mail app previews inline. Around 85% keeps the file
          friendly for inboxes; for tighter limits, run it through the{' '}
          <Link to="/tools/image-compressor" className={linkClass}>
            image compressor
          </Link>
          .
        </p>
        <p>
          <strong>AVIF to PNG for Photoshop</strong> or any older editor is the
          right call when you plan to edit, because PNG is lossless. To crop or
          straighten, use the{' '}
          <Link to="/tools/image-cropper" className={linkClass}>
            image cropper
          </Link>{' '}
          or{' '}
          <Link to="/tools/rotate-flip-image" className={linkClass}>
            rotate and flip
          </Link>{' '}
          tools after converting, since this page does neither.
        </p>
        <p>
          <strong>Animated AVIF to JPG</strong> gives you one still frame,
          which is fine for a thumbnail. This tool cannot keep the animation or
          turn it into a GIF or MP4. If you have the original clip or its
          frames, the{' '}
          <Link to="/tools/gif-maker" className={linkClass}>
            GIF maker
          </Link>{' '}
          and{' '}
          <Link to="/tools/video-converter" className={linkClass}>
            video converter
          </Link>{' '}
          are the route for moving images.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis to Convert AVIF
        </h3>
        <p>
          There is no shortage of pages offering an <strong>AVIF to JPG
          converter online free</strong>. Here is what this one does
          differently, stated so you can check each point yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no account', 'No sign-up, no email and no files-per-day counter. Convert one AVIF or a whole folder as often as you like.'],
            ['Batch with one ZIP', 'Add as many AVIF images as you need. Each gets its own preview and download, and a single ZIP collects the lot.'],
            ['Your images stay private', 'Your photos are never stored on our servers and nothing is retained once you leave the page.'],
            ['Never used for training', 'Your images are never used to train AI models. What you convert stays yours.'],
            ['You control quality', 'A slider from 40% to 100%, starting at a sensible 90%, plus JPG, PNG or WebP output and a white or black fill for transparent areas.'],
            ['Honest about trade-offs', 'Same pixel size, original file names kept, and the page tells you upfront that metadata, HDR and animation frames do not carry over.'],
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
          <Link to="/tools" className={linkClass}>
            free file tools
          </Link>{' '}
          built on the same terms. Have iPhone photos in HEIC instead? The{' '}
          <Link to="/tools/heic-to-jpg" className={linkClass}>
            HEIC to JPG converter
          </Link>{' '}
          is the sister page for those.
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
              'How do I convert AVIF to JPG for free?',
              'Drop your AVIF files onto the tool at the top of this page, leave the format on JPG, and press Convert. Download each JPG from its card, or the ZIP when you convert several.',
            ],
            [
              'Why won’t my AVIF file open?',
              'Many programs, including Windows Photos without the AV1 video extension, older editors and some upload forms, cannot read AVIF yet. Converting it to JPG or PNG gives you a file that opens in any app.',
            ],
            [
              'Does converting AVIF to JPG lose quality?',
              'A little, because JPG is a lossy format. At 85 to 90% on the slider the difference is usually hard to see in normal viewing, and 95 to 100% is best for printing. If you need a lossless copy, choose PNG as the output instead.',
            ],
            [
              'Why are my images saving as AVIF instead of JPG?',
              'The website you saved from serves its pictures as AVIF, so “Save image as” stores the file in that format, whatever you name it. Renaming the extension to .jpg does not change the data inside. Drop the saved file onto the tool above with the format left on JPG, and you get a real JPG that any app accepts.',
            ],
            [
              'Can I convert many AVIF files at once?',
              'Yes. Add as many AVIF images as you like and press Convert once. Every image gets its own download, and a ZIP of all of them appears at the top.',
            ],
            [
              'What happens to transparent areas in an AVIF?',
              'JPG cannot store transparency, so transparent areas are filled with white by default, or black if you choose it. To keep the transparency, pick PNG or WebP output and set the background to Transparent.',
            ],
            [
              'Will the JPG keep my photo’s EXIF data and location?',
              'No. EXIF, GPS, camera details and embedded colour profiles are removed during conversion, and they cannot be added back afterwards. The picture itself keeps its full pixel size.',
            ],
            [
              'Can I convert JPG or PNG to AVIF here?',
              'Not on this page, which only reads AVIF. Use the image converter for other directions between image formats. For iPhone HEIC photos, the HEIC to JPG converter is the right tool.',
            ],
            [
              'Is it safe to convert private photos here?',
              'Your images are never stored on our servers, nothing is retained after you leave, and nothing is used for training. The converted file is yours to download and keep.',
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
          Converted and ready for the next step? Change other formats with the{' '}
          <Link to="/tools/image-converter" className={linkClass}>
            image converter
          </Link>
          , turn a WebP into a PNG with the{' '}
          <Link to="/tools/webp-png" className={linkClass}>
            WebP to PNG tool
          </Link>
          , or shrink a batch of JPGs with the{' '}
          <Link to="/tools/jpeg-compressor" className={linkClass}>
            JPEG compressor
          </Link>
          . And if you would like to design images rather than only convert
          them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className={linkClass}>
            graphic design course
          </Link>{' '}
          covers Photoshop and Illustrator from the ground up.
        </p>
      </div>
    </article>
  );
}
