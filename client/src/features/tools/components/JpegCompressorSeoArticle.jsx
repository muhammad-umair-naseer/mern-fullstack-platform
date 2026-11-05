import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileImage,
  Gauge,
  HelpCircle,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the JPEG compressor route.
 *
 * The route mounts the shared converter hub, and "compressing a JPEG" is the
 * image-in, JPG-out path of that hub with the quality slider set below 100.
 * That shapes the article in four ways the obvious keywords would fight.
 *
 * The slider is the whole product: an explicit 40-100% quality number in 5%
 * steps, defaulting to 90, with pixel dimensions left exactly as they were.
 * So the guide is built around choosing that number and reading the KB it
 * produces, rather than around a headline percentage nobody can honestly
 * promise for an arbitrary photo.
 *
 * Every pass is a full lossy re-encode and every scrap of metadata is
 * dropped, so "reduce jpg file size without losing quality" is answered
 * truthfully (nothing here is lossless) and "does compressing a jpeg remove
 * exif data" gets a flat yes. Both are still used as headings because the
 * honest answer is what the searcher needs.
 *
 * Declined outright: bulk or drag-and-drop compression (one file, chosen by
 * click), a target-size mode ("compress to 200 KB" is taught as a
 * slider-and-check loop instead), resizing, transparency preservation, and
 * HEIC input, which the hub does not treat as an image at all. "Unlimited"
 * and "no file size limit" are claimed only as the absence of quotas and
 * accounts, not as a guarantee that a very large image will always finish.
 */
export default function JpegCompressorSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Compress JPEG</span> Files to an Exact Quality Without Resizing Them
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A photo that will not attach, a scan that a portal refuses, a product
        shot that makes a page crawl: the fix is almost always the same. You need
        to <strong>compress JPEG</strong> files down to a size the other end will
        accept, without touching the picture&rsquo;s dimensions and without paying
        for the privilege. This guide explains why the file was so large to begin
        with, what the quality slider on our <strong>JPEG compressor</strong> is
        actually doing at each step, and how to{' '}
        <strong>reduce JPEG file size</strong> to a specific KB figure when a form
        hands you a hard limit.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/jpeg-compressor.webp"
            alt="Hands holding a mirrorless camera with a mountain shot framed on its rear screen"
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
              Pick a quality number from 40 to 100, read the KB it produces, and
              download. The width and height never change.
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
            ['#why-so-big', '1. Why Is My JPEG File So Big?'],
            ['#how-to-compress', '2. How to Compress a JPEG Online Free'],
            ['#quality-slider', '3. What the JPEG Quality Percentage Means'],
            ['#target-size', '4. Making a JPEG Smaller in KB: Under 1 MB and Other Targets'],
            ['#convert-and-compress', '5. PNG, WebP, BMP or GIF to a Compressed JPG in One Step'],
            ['#metadata', '6. What Compression Removes: EXIF, GPS and Colour Profiles'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free JPEG Compressor'],
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
      <section id="why-so-big" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Is My JPEG File So Big?
        </h3>
        <p>
          A JPEG is a grid of pixels, saved according to the{' '}
          <a
            href="https://www.iso.org/standard/18902.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 10918 JPEG standard
          </a>
          , and its size on disk comes down to three things: how many pixels
          there are, how much fine detail was kept when it was saved, and whether
          it is really a JPEG at all. If you have ever wondered{' '}
          <strong>why is my JPEG file so big</strong>, one of those three is the
          answer.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Pixel count.</strong> A phone camera records far more pixels
            than any screen or email preview will ever show, and every one of
            them has to be stored.
          </li>
          <li>
            <strong>Saved quality.</strong> Cameras write JPEGs at a generous
            quality so nothing is lost before you decide what to do with the
            picture. That is the right default for a camera and the wrong one for
            an attachment.
          </li>
          <li>
            <strong>It is not a JPEG.</strong> A surprising share of &ldquo;my{' '}
            <strong>JPG is too large to upload</strong>&rdquo; problems turn out
            to be PNG screenshots, WebP downloads or old BMP scans, and simply
            re-saving them as JPG is the entire fix. Section 5 covers that.
          </li>
        </ul>
        <p>
          The practical point is that a picture can be made much smaller without
          changing its width or height, purely by deciding how much fine detail
          to keep. That decision is the quality slider.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress a JPEG Online Free (Step-by-Step)
        </h3>
        <p>
          The panel at the top of this page is our universal converter, and the
          JPG button inside it is the <strong>compress JPG</strong> path. No
          account, no email, no watermark. Here is{' '}
          <strong>how to compress a JPEG</strong> with it:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your image', 'Click the panel and pick one file. JPG, JPEG, PNG, WebP, GIF, BMP and SVG are recognised as images, and the panel shows the starting size in MB.'],
            ['Click JPG and set the quality', 'After a .jpg is chosen the panel pre-selects a different format, so click the JPG button yourself. An Image Quality slider then appears, from 40% to 100%, starting at 90%.'],
            ['Convert and read the KB', 'Press Convert to JPG. The result card shows the new size in KB beside a Download button. Still too large? Drop the slider a step and run it again.'],
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
          The tool works on one image at a time, so a folder of holiday photos
          means repeating the three steps for each one; there is no bulk mode
          that applies one setting to a whole batch. The output is named after
          the original with a .jpg extension. For the wider set of image
          formats, including PNG and WebP output, the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            general image compressor
          </Link>{' '}
          works the same way with the same one-file-at-a-time flow.
        </p>
      </section>

      {/* 3 */}
      <section id="quality-slider" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. What Does the JPEG Quality Percentage Mean?
        </h3>
        <p>
          Every JPEG is saved by discarding fine detail the eye is bad at
          noticing, and the quality number decides how aggressively that happens.
          So <strong>what does JPEG quality percentage mean</strong> in practice?
          At 100 almost nothing is thrown away and the file is large. As the
          number falls the file shrinks, and eventually the loss shows as blotchy
          patches in smooth areas and halos around sharp edges. Our slider moves
          in 5% steps between 40 and 100, which is why you can{' '}
          <strong>compress JPEG 90 quality</strong> exactly rather than picking
          from a vague Low, Medium or High.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              90 to 100: keep it safe
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The default of 90 is where most photographs lose weight without
              any change you would spot at normal viewing size. Use it for
              portfolio images, listing photos and anything that might be
              printed.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              70 to 85: the everyday range
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Where email attachments, web pages and social uploads usually
              live. Detail loss is there if you zoom in on a flat sky, and
              invisible on a phone screen.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              40 to 65: size at any cost
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For a hard KB cap on an ID photo or a form upload where the
              picture only has to be legible. Expect visible artefacts; the
              slider stops at 40 because below that a photo stops looking like
              one.
            </p>
          </div>
        </div>
        <p>
          People ask about <strong>JPEG quality 80 vs 90 file size</strong> as if
          there were a fixed exchange rate. There is not: the saving from any one
          step depends on the picture. A photo full of foliage shrinks differently
          from a flat product shot on white. The reliable way to find out is the
          one this tool is built for: run it at 90, note the KB, run it at 80,
          compare.
        </p>
        <p>
          The honest answer to{' '}
          <strong>how to reduce JPG file size without losing quality</strong> is
          that no re-save of a JPEG is truly lossless, including this one. The
          sensible approach is a single pass at the highest quality that meets
          your size target, never repeated compression of an already compressed
          file. At 90 the difference from the original is, for a photograph, not
          something you will find without a side-by-side and a magnifier. That is
          as close to &ldquo;without losing quality&rdquo; as any JPEG tool can
          honestly get.
        </p>
      </section>

      {/* 4 */}
      <section id="target-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Make a JPEG Smaller in KB: Under 1 MB and Other Targets
        </h3>
        <p>
          Most size problems arrive as a limit set by someone else. A visa portal
          wants a passport photo under a few hundred KB, a job site says{' '}
          <strong>image exceeds maximum file size</strong>, an email client
          refuses the attachment and you are searching for{' '}
          <strong>photo too big to email</strong> at eleven at night. The job is
          the same in every case: get the number below the cap.
        </p>
        <p>
          This tool has no &ldquo;shrink to exactly this size&rdquo; box, so{' '}
          <strong>how to make a JPEG smaller in KB</strong> is a short loop
          rather than a single click. Start at 90 and read the KB on the result
          card. Too big? Move the slider down a step or two and convert again,
          always from the original rather than the previous output. Because the
          pixel width and height are never touched, you are trading only fine
          detail against size, and you stop the moment the number is under the
          line.
        </p>
        <p>
          To <strong>compress JPEG to under 1MB</strong> from a typical phone
          photo, the default 90 is often enough on its own, and 80 or 75 usually
          is when it is not. Passport-style caps in the low hundreds of KB are
          harder: if the slider reaches 40 and you are still over, the picture
          has too many pixels for that budget. Run it through the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          first, then bring the smaller version back here for a final pass at a
          higher quality. Fewer pixels at 85 will look far better than every
          pixel at 40.
        </p>
        <p>
          When the requirement runs the other way, and you must{' '}
          <strong>reduce JPEG size without resizing</strong> because a print shop
          or marketplace insists on the original dimensions, this is exactly the
          right tool. A 4000-pixel-wide file goes in and a 4000-pixel-wide file
          comes out, simply lighter. If you need to trim edges rather than shrink
          the whole thing, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          handles that separately.
        </p>
      </section>

      {/* 5 */}
      <section id="convert-and-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          5. PNG, WebP, BMP or GIF to a Compressed JPG in One Step
        </h3>
        <p>
          Because the JPG button accepts any recognised image, converting and
          compressing happen together. This is the fix for the searcher whose{' '}
          <strong>screenshot PNG is too large</strong> and wants to{' '}
          <strong>convert PNG to JPG to reduce file size</strong>: choose the
          PNG, click JPG, set a quality and download. For a photo-heavy screenshot
          the change of format alone often does more than any amount of slider
          fiddling afterwards.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Compress WebP to JPG.</strong> Images saved from the web
            increasingly arrive as WebP, which many upload forms still reject.
            Choosing JPG here gives you a file everything accepts, at the quality
            you set. For a PNG that must stay a PNG, use the{' '}
            <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
              WebP to PNG converter
            </Link>
            .
          </li>
          <li>
            <strong>BMP to JPG compress.</strong> BMP files from old scanners and
            paint programs store every pixel uncompressed, which is why a small
            scan can weigh tens of megabytes. Re-saving as JPG at 90 is usually a
            dramatic reduction with no visible change.
          </li>
          <li>
            <strong>GIF to JPG first frame.</strong> A GIF becomes a still JPG of
            its first frame only; the animation is not carried across. That is
            handy for a thumbnail and useless if you wanted the movement, in
            which case the{' '}
            <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF compressor
            </Link>{' '}
            is built for animated files.
          </li>
          <li>
            <strong>SVG to JPG.</strong> Vector drawings are saved as pixels at
            their own stated size. Fine for a preview; keep the SVG for anything
            you will scale up later.
          </li>
        </ul>
        <p>
          One side effect catches people out. JPEG has no notion of transparency,
          so any see-through area in a PNG, WebP or GIF comes out as solid black
          in the JPG. If your graphic has a transparent background you want to
          keep, it needs to stay PNG or WebP, and the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          is the tool for shrinking it. For any other format pairing, the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          covers the full set.
        </p>
      </section>

      {/* 6 */}
      <section id="metadata" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Compression Removes: EXIF, GPS and Colour Profiles
        </h3>
        <p>
          <strong>Does compressing a JPEG remove EXIF data?</strong> With this
          tool, always. The output carries only the pixels: no camera make and
          model, no shutter and aperture values, no capture timestamp, no GPS
          coordinates, no embedded colour profile and no XMP editing history.
          There is no option to keep any of it.
        </p>
        <p>
          For most people that is a quiet benefit: a phone photo can otherwise
          carry the exact spot it was taken, and stripping that before it goes to
          a marketplace listing or a public forum is sensible. Orientation is the
          one piece of camera information that is honoured rather than discarded,
          so a picture shot sideways is written the right way up. For
          photographers who need the shooting data, or designers relying on an
          embedded colour profile for print, this is the wrong tool, and it is
          better to know that before rather than after.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Formats this path does not accept
        </h4>
        <p>
          Images are recognised by file extension, and only PNG, JPG, JPEG, WebP,
          GIF, BMP and SVG count. A <strong>HEIC</strong> or HEIF photo straight
          off a recent iPhone is not treated as an image at all; the panel labels
          it a document and the output is not a usable picture. Share or export
          the photo as JPEG from the phone first, then compress that JPEG here.
          The same applies to AVIF, TIFF, PSD and camera RAW files.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free JPEG Compressor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Compress JPEG online free, every time', 'No trial count and no premium tier holding back a better setting. The same slider is there for your first file and your five-hundredth.'],
            ['Compress JPG without signup', 'The download is not held behind an account, an email confirmation or a newsletter box. Choose, convert, download.'],
            ['Compress JPEG with no watermark', 'Nothing is stamped on the corner of the picture and nothing is written into the file besides the pixels you asked for.'],
            ['A real quality number, not a preset', 'Forty to one hundred in steps of five, defaulting to ninety. You choose the trade-off and the KB readout tells you what it cost.'],
            ['Dimensions never touched', 'The output has exactly the width and height of the input, so print sizes and listing requirements that depend on pixel dimensions are unaffected.'],
            ['Your files stay private', 'Nothing you compress is stored on our servers, retained after your session, or used for training or analytics. Metadata is stripped as a matter of course.'],
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
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free image and document tools
          </Link>{' '}
          on the same terms. If what you actually have is a heavy PDF full of
          photos, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          applies the same idea to every page at once, and{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG
          </Link>{' '}
          pulls the pages out as images if a portal wants pictures rather than a
          document.
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
              'How do I compress a JPEG online for free without signing up?',
              'Click the panel at the top of this page, choose your JPG, click the JPG output button, set the quality slider and press Convert. The result card shows the new size in KB and a Download button. There is no account, no email step and no watermark.',
            ],
            [
              'Why did the panel select PNG when I uploaded a JPG?',
              'The converter pre-selects a format different from the one you started with, and for a .jpg that happens to be PNG. Click the JPG button yourself; the quality slider only appears once JPG or WebP is selected. Converting a JPG to PNG would make it larger, not smaller.',
            ],
            [
              'Can I compress a JPEG to an exact size, like 200 KB or under 1 MB?',
              'Not in one click. There is a quality slider, not a target-size box, so you set a quality, read the KB on the result card and adjust. Start at 90 and step down until the number is under your limit. If even 40 is not enough, reduce the pixel dimensions with our image resizer first, then compress the smaller file at a higher quality.',
            ],
            [
              'Can I compress several JPG files at once?',
              'No. This tool takes one image at a time, and each one needs the JPG button and the slider set before converting. There is no bulk mode here, so a folder of photos means repeating the steps for each file. The slider keeps the last value you set, which makes the repeats quick.',
            ],
            [
              'Does compressing a JPEG remove EXIF data?',
              'Yes, always, with this tool. Camera details, timestamp, GPS location, colour profile and editing history are all dropped, and there is no setting to keep them. Orientation is applied so the picture stays upright. If you need the metadata preserved, this is not the right tool for that file.',
            ],
            [
              'Why did my transparent PNG turn black after converting to JPG?',
              'JPEG cannot store transparency, so any see-through area is filled with black. If the transparent background matters, keep the file as PNG or WebP and shrink it with the PNG compressor instead of converting it.',
            ],
            [
              'Is this a JPEG compressor with no file size limit, and is the free JPEG compressor unlimited?',
              'There is no daily quota, no per-file cap set by us, no account tier and no count limit. Extremely large images from high-megapixel cameras can occasionally fail to produce a result; if that happens, run the picture through the image resizer first and try again.',
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
          Working on other kinds of file? The{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          does for MP4 what this page does for photos, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          goes the other way when a picture is too small rather than too big, and
          the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR generator
          </Link>{' '}
          turns a link to the finished image into something printable. If you
          would rather understand how compression, resolution and colour work
          than simply move a slider, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          starts from the beginning.
        </p>
      </div>
    </article>
  );
}
