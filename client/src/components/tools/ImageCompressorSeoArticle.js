import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileWarning,
  Gauge,
  HelpCircle,
  ImageDown,
  Layers,
  Ruler,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the image compressor route.
 *
 * The route is served by the shared ConverterHub, and its image branch has no
 * separate "compress" mode: what it offers is a choice of output format and,
 * for JPG and WebP only, a 40-100% quality slider. Dimensions are never
 * touched and the result card prints the new size in KB. The article is built
 * around exactly those three facts, because they are what the searcher for
 * "reduce image size without resizing" actually wants and what the head-term
 * competitors gloss over with magic percentages.
 *
 * Keywords deliberately not promised: "compress jpg to 100kb" (there is no
 * target-size box, so section 3 describes the manual slider-and-read loop
 * instead), "compress image without losing quality" (JPG and WebP always
 * discard something; the honest answer is the 90-100 end of the slider, not a
 * lossless mode), and any variant of PNG or GIF compression (the PNG target is
 * a plain lossless re-save that rarely shrinks anything, and the GIF target
 * is not a real GIF encoder). Section 4 sends those readers to the PNG and GIF
 * compressors rather than pretending. HEIC, AVIF, TIFF and RAW are not
 * recognised as images at all, and batch, previews and progress readouts do
 * not exist for this path, so none of them are mentioned as features.
 */
export default function ImageCompressorSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to Use a Free <span className="text-orange-600 dark:text-orange-400">Image Compressor</span> to Reduce Image Size Without Resizing
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An upload form says the file is too big. An email bounces over the
        attachment limit. A screenshot that should be a few hundred kilobytes
        is somehow eleven megabytes. Each is the same job: keep the picture,
        lose the bulk. A good <strong>image compressor</strong> does that with
        two decisions, the output format and a quality number, and this page
        explains both honestly. It shows how to{' '}
        <strong>compress an image</strong> so it fits wherever it has to go,
        why the pixel dimensions never change here, and what a smaller file
        quietly gives up along the way.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/image-compressor.webp"
            alt="Free image compressor - reduce image size to JPG or WebP with a quality slider and no resizing"
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
              One image in, a format choice, a quality number, and the new size
              in KB before you download.
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
            ['#what-compression-means', '1. What Compressing an Image Actually Means Here'],
            ['#how-to-compress', '2. How to Compress an Image Online Free'],
            ['#quality-slider', '3. JPG Quality vs File Size: What the Slider Trades Away'],
            ['#png-too-big', '4. Why Is My PNG So Big? Screenshots, BMPs and the Format Fix'],
            ['#no-resizing', '5. Reduce Image Size Without Resizing: Dimensions Never Change'],
            ['#what-changes', '6. What Re-encoding Quietly Changes: Transparency, EXIF, Formats'],
            ['#common-jobs', '7. The Jobs People Actually Use This For'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Image Compressor'],
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
      <section id="what-compression-means" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Compressing an Image Actually Means Here
        </h3>
        <p>
          Most tools that promise to <strong>reduce image size</strong> sell it
          as a magic button. There is no magic. A file gets smaller because the
          pixels are stored in a format that discards detail the eye rarely
          notices, or because there are fewer pixels to store. This tool does
          the first and never the second.
        </p>
        <p>
          The three formats that matter behave differently.{' '}
          <strong>JPG</strong>, defined by the{' '}
          <a
            href="https://www.iso.org/standard/18902.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 10918 JPEG standard
          </a>
          , is lossy: it discards fine detail for a much smaller file, and a
          quality number decides how much. <strong>WebP</strong>, specified
          in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9649"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 9649
          </a>
          , does the same trick more efficiently and keeps transparency.{' '}
          <strong>PNG</strong>, per the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>
          , is lossless: every pixel is stored exactly, which is why a PNG of a
          photograph is so much bigger than the same photograph as a JPG.
        </p>
        <p>
          So the rule for this page is short. To make an image file smaller
          here, you re-encode it as JPG or WebP and choose a quality between 40
          and 100. Everything below is about using those two levers well.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress an Image Online Free (Step-by-Step)
        </h3>
        <p>
          This is an <strong>image compressor online free</strong> in the plain
          sense: no account, no email, no watermark. Here is{' '}
          <strong>how to compress an image</strong> with the panel above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose one image', 'Click the panel and pick a PNG, JPG, JPEG, WebP, GIF, BMP or SVG. One image per run. Its size in MB appears under the filename.'],
            ['Pick JPG or WebP', 'The default output is simply a format different from the one you gave, so choose JPG or WebP yourself. Only those two unlock the quality slider.'],
            ['Set quality, convert, read the KB', 'Move the slider from 40% to 100%, press convert, and the result card shows the new filename and size in KB. Too big? Lower the slider and run it again.'],
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
          One detail that catches people out: a file ending in{' '}
          <strong>.jpeg</strong> defaults to PNG as its output, the one choice
          that will not shrink it. Click JPG or WebP before you convert. The
          output keeps your original name with the new extension.
        </p>
      </section>

      {/* 3 */}
      <section id="quality-slider" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. JPG Quality vs File Size: What the Slider Trades Away
        </h3>
        <p>
          The slider runs from 40% to 100% in steps of five and starts at 90%.
          It appears only when JPG or WebP is selected, because those are where
          the number means something.{' '}
          <strong>JPG quality vs file size</strong> is a question of what you
          are prepared to lose. Each band costs something different.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              90 to 100: nearly invisible
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The default. Fine texture in skin and foliage survives. Stay here
              for a portfolio or a print proof.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              70 to 85: the everyday setting
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The file drops noticeably and the picture still looks right on a
              screen. The band for email, chat and portal uploads.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              40 to 65: visible, but small
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Blocky patches appear around sharp edges and small text. Fine for
              a thumbnail or a form that only needs the picture to exist.
            </p>
          </div>
        </div>
        <p>
          The same slider governs WebP, so if you searched for a{' '}
          <strong>webp quality slider online</strong> rather than a preset,
          this is one. People also ask how to{' '}
          <strong>compress image without losing quality free</strong>. Every
          JPG and WebP save discards something; that is how they get small. Sit
          at 90 or above and the loss is real but hard to find. No mode keeps
          every pixel and also shrinks the file, and we would rather say so
          than sell it.
        </p>
        <p>
          The other common search is <strong>compress jpg to 100kb</strong> or
          another exact figure. There is no box to type a target into. Instead,
          run a short loop: choose JPG, try 80, read the size in the result
          card, drop the slider by ten and run again until the number lands. If
          you are at 40 and still over, the pixel dimensions are the problem,
          and that is a job for the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="png-too-big" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageDown className="w-6 h-6 text-orange-500 shrink-0" />
          4. Why Is My PNG So Big? Screenshots, BMPs and the Format Fix
        </h3>
        <p>
          <strong>Why is my PNG so big?</strong> Because PNG keeps every pixel
          exactly: ideal for a flat-colour logo, terrible for a screenshot full
          of photographs and gradients. A{' '}
          <strong>screenshot file size too large</strong> to paste into a ticket
          is almost always a PNG holding photographic content. BMP is worse,
          essentially uncompressed, which is why an old scanner can hand you a
          picture the size of a short video.
        </p>
        <p>
          The fix is the format decision. To{' '}
          <strong>convert PNG to JPG to reduce size</strong>, choose JPG and a
          quality around 80. To <strong>convert PNG to WebP online</strong>, or
          to <strong>compress a PNG screenshot to WebP for a website</strong>,
          choose WebP, which also keeps transparent areas; the{' '}
          <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WebP to PNG converter
          </Link>{' '}
          gets you back if a client cannot open it. A{' '}
          <strong>BMP to JPG compress</strong> job works the same way: BMP is an
          accepted input, so pick JPG, set the quality and download.
        </p>
        <p>
          Two things this page will not do. Choosing PNG as the output is a
          lossless re-save with no quality control, and it typically comes out
          the same size or larger. If the file has to stay a PNG, the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          is the right page. And the GIF output is not a real GIF encoder: an
          animated GIF is flattened to its first frame and comes back as a
          still with a .gif name. For an animation, use the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          instead.
        </p>
      </section>

      {/* 5 */}
      <section id="no-resizing" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          5. Reduce Image Size Without Resizing: Dimensions Never Change
        </h3>
        <p>
          Plenty of tools quietly shrink the pixel dimensions to hit a smaller
          number. This one never does. The output has exactly the width and
          height of the input, whichever format or quality you choose. If you
          searched for <strong>reduce image size without resizing</strong> or{' '}
          <strong>compress image without changing dimensions</strong>, that is
          the promise, built in rather than an option to tick.
        </p>
        <p>
          It also answers the nervous version,{' '}
          <strong>how to make a JPEG smaller without cropping</strong>. Nothing
          is cut off; the frame you gave is the frame you get back, only
          lighter. Fewer pixels or a different framing are separate jobs with
          their own pages: the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          for dimensions, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          for framing, and the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          when a small picture has to go the other way.
        </p>
      </section>

      {/* 6 */}
      <section id="what-changes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileWarning className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Re-encoding Quietly Changes: Transparency, EXIF and Formats
        </h3>
        <p>
          A smaller file is a rewritten file, and a rewrite has side effects
          that surprise people.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>JPG has no transparency.</strong> If your{' '}
            <strong>JPG transparent background turns black when compressing</strong>,
            this is why: the format has nowhere to store a see-through pixel,
            so those areas are painted black, with no warning. For a logo or
            any cut-out graphic, choose WebP, which keeps transparency and
            still shrinks the file.
          </li>
          <li>
            <strong>Metadata is removed.</strong> People ask{' '}
            <strong>does compressing an image remove EXIF data</strong>, and
            here the answer is yes, always. Camera model, capture time, GPS
            location and colour profile do not come through, and there is no
            switch to keep them. For most people that is a quiet privacy win;
            a photographer who needs the capture data should keep the original.
          </li>
          <li>
            <strong>Some formats are not recognised.</strong> HEIC and HEIF from
            newer phones, AVIF, TIFF, RAW and ICO are not treated as images
            here, and the run will not give you back a usable image. Save the
            picture as a JPG from whatever app opened it, then bring that JPG
            here.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="common-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          7. The Jobs People Actually Use This For
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Image too large to upload.</strong> A visa portal or a job
            board rejects the photo. Choose JPG, set 80, read the KB, and try 70
            if it is still over. The dimensions the portal asked for are
            untouched.
          </li>
          <li>
            <strong>Photo file size too big to email.</strong> A handful of
            phone pictures blows past an attachment limit. Run each one at 75
            and they go as an ordinary message rather than a link.
          </li>
          <li>
            <strong>&ldquo;Image exceeds maximum file size&rdquo;.</strong> The
            error copied out of a web form. The form means kilobytes, not
            pixels, so the quality slider is the lever, not the resizer.
          </li>
          <li>
            <strong>Make a picture smaller in KB</strong> for a government or
            employer form that caps a passport photo. Use the loop from section
            3 and stop when the result card shows a number the form accepts.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Image Compressor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no sign-up wall', 'An image compressor with no signup step, no email capture and no trial counter.'],
            ['No watermark on the output', 'A free JPG compressor with no watermark, ever. The picture that comes back is your picture, not an advertisement.'],
            ['A real quality slider', 'A 40 to 100 dial for both JPG and WebP, rather than a Low, Medium or High preset that hides what it is doing.'],
            ['Dimensions are never touched', 'Width and height come out exactly as they went in, so nothing bound for print or a strict portal is silently downscaled.'],
            ['Your files stay private', 'Nothing you compress is stored on our servers, retained after your session, or used for training or analytics.'],
            ['You see the size before you download', 'The result card prints the new size in KB next to the filename, so you know whether it will pass.'],
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
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert between image formats
          </Link>
          ,{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            work a JPEG down further
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            shrink the PDF
          </Link>{' '}
          the picture ends up inside, all without paying.
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
              'How do I compress an image online for free without signing up?',
              'Click the panel at the top of this page, choose one image, pick JPG or WebP, set the quality slider and press convert. No account, no email step, no watermark. The result card shows the new size in KB and a download button, and it is free every time.',
            ],
            [
              'Why did my PNG not get any smaller?',
              'Because you chose PNG as the output. PNG is lossless and this page saves it without optimisation, so it usually comes back the same size or bigger. To reduce image size from a PNG, choose JPG or WebP. If it must stay a PNG, use our PNG compressor.',
            ],
            [
              'Can I compress a JPG to exactly 100 KB?',
              'Not by typing a target, because there is no target-size box. Choose JPG, run it at 80, read the KB in the result card, then lower the slider in steps until the figure is under 100 KB. Still over at 40%? The picture has too many pixels for that budget; the image resizer is the next step.',
            ],
            [
              'Does compressing an image remove EXIF data?',
              'Here, yes, without exception. The output is a fresh file, so camera details, capture time, GPS location and colour profile are not carried across, and there is no option to keep them. Useful when sharing personal photos; if you need the metadata, keep the original.',
            ],
            [
              'Why did my transparent background turn black?',
              'You chose JPG, which has no way to store transparency, so every see-through pixel is filled with black. Run the original again and choose WebP, which keeps the transparent areas and still produces a small file.',
            ],
            [
              'Can I compress several images at once?',
              'No. This page handles one image per run and produces one download, with no multi-select and no zip. The upside is that every image gets its own quality decision and its own size readout.',
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
          Need a different job done? The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          changes the pixel dimensions when the slider is not enough, the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          handles format changes where size is not the point, and the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          does for clips what this page does for stills. If you would rather
          understand why a JPG at 70 looks the way it does, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers compression, colour and resolution from the beginning.
        </p>
      </div>
    </article>
  );
}
