import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Expand,
  Gauge,
  HelpCircle,
  Layers,
  Maximize2,
  Palette,
  Printer,
  Shield,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image Enlarger tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, six benefit cards, FAQ. Five decisions are worth recording,
 * because each was made against the search data rather than with it.
 *
 * 1. "AI image upscaler", "AI enlarge image", "unblur photo", "remove blur",
 *    "face restoration" and "8x upscale" are the biggest, richest phrases in
 *    this entire cluster and we can serve NONE of them. The tool enlarges by
 *    high-quality interpolation and applies a fixed clarity/edge kernel. It
 *    invents no detail, restores no faces and repairs no blur. Section 3
 *    answers the question behind those searches honestly instead of promising
 *    a model we do not have. An honest page keeps its rankings; a lying one
 *    collects refund emails.
 *
 * 2. The 25-megapixel output ceiling is real and it bites at 4x, so it gets
 *    its own section rather than a footnote. 25 MP / 16 means a 4x run needs a
 *    source under roughly 1.56 MP; 2x needs one under 6.25 MP. Those numbers
 *    are arithmetic from MAX_PIXELS in the component, not marketing figures.
 *    The guard tests targetW * targetH, not the factor, so a source over
 *    6.25 MP is refused at BOTH settings — section 4 says so plainly rather
 *    than implying 2x is always a way out. Section 4 exists so "why can't I
 *    upscale 4x" lands somewhere useful.
 *
 * 3. There is no custom width/height field and no DPI field. "Resize image to
 *    exact dimensions" and "enlarge image to 300 DPI" are therefore declined
 *    and redirected — the first to the image resizer, the second to an honest
 *    explanation in section 6 that DPI is metadata and pixel count is the
 *    thing that decides whether a print holds up.
 *
 * 4. Privacy is sold strictly as an outcome — nothing stored, nothing
 *    retained, nothing used for training. The mechanism is deliberately absent
 *    from every sentence in this file.
 *
 * 5. Enlarging and downloading are two separate presses in the component:
 *    processEnlarge only sets result state, and a second button performs the
 *    download. Section 2 and the FAQ describe both presses, because a reader
 *    who walks away after the first one gets no file.
 */
export default function ImageEnlargerSeoArticle() {
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
        How to Use a Free <span className="text-orange-600 dark:text-orange-400">Image Enlarger</span> to Upscale a Small or Low-Resolution Photo
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A picture that looked perfectly sharp on a phone screen can fall apart
        the moment somebody asks for it bigger &mdash; a marketplace listing
        rejects it, a print shop says the resolution is too low, a slide deck
        stretches it into mush. A good <strong>image enlarger</strong> rebuilds
        that picture at two or four times its original size and optionally
        runs an edge pass over the result so it lands crisp rather than soft.
        This guide covers how to{' '}
        <strong>enlarge an image without losing quality</strong>,
        what an <strong>image upscaler</strong> can genuinely do, what no tool
        anywhere can do, and how to choose the right output format.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/image-enlarger.webp"
            alt="A loupe magnifying colour negatives on a lightbox beside a film holder"
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
              From a small, low-resolution original to a clean 2&times; or
              4&times; enlargement you can download as PNG, JPG or WebP.
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
            ['#what-happens', '1. What Actually Happens When You Enlarge an Image'],
            ['#how-to-enlarge', '2. How to Enlarge an Image Online Free'],
            ['#quality', '3. Enlarging Without Losing Quality: The Honest Version'],
            ['#scale-limits', '4. 2x, 4x and the Size Ceiling Explained'],
            ['#formats', '5. Choosing PNG, JPG or WebP for the Enlarged File'],
            ['#print-screens', '6. Enlarging for Print, Posters and 4K Screens'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Image Enlarger'],
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
      <section id="what-happens" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Actually Happens When You Enlarge an Image
        </h3>
        <p>
          A photograph is a grid of coloured squares. A 600 &times; 400 picture
          holds exactly 240,000 of them, and that number is fixed the instant
          the shutter closes. Stretch it across a page and you are not adding
          squares &mdash; you are asking each existing one to cover more area,
          which is why edges go blocky and text goes fuzzy.
        </p>
        <p>
          To genuinely <strong>increase image resolution</strong>, new pixels
          have to be created and given sensible colours. That is what an{' '}
          <strong>image upscaler</strong> does: it maps the original grid onto a
          larger one and calculates each new pixel from its neighbours, so a
          diagonal line stays a line rather than a staircase. The tool above
          then runs an optional clarity and edge pass over the result, which
          pulls back the softness any enlargement introduces.
        </p>
        <p>Two things are worth knowing before you run it:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>You see the real numbers first.</strong> The panel reports
            the original width, height and file size on selection, and the
            button spells out the exact dimensions you are about to produce.
          </li>
          <li>
            <strong>The original is untouched.</strong> You get a new file with
            the scale appended, so <em>logo.png</em> comes back as{' '}
            <em>logo-2x.png</em>.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-enlarge" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Expand className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Enlarge an Image Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial countdown. To{' '}
          <strong>enlarge an image online free</strong> with the tool above,
          three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your picture', 'Drop a JPG, PNG or WebP onto the panel above, or click to browse. One image at a time. The tool reads its true dimensions and shows them alongside the file size, so you know what you are starting from.'],
            ['Pick 2x or 4x', 'Choose the upscale factor, choose PNG, JPG or WebP for the output, and leave the clarity and edge filter on unless your picture is a soft portrait or a smooth gradient.'],
            ['Enlarge and download', 'Press the button — it names the exact target size — then press the download button that appears, and the file saves with the scale in its filename. No watermark, no queue, no cap on how many you run.'],
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
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          When the image enlarger tells you something is wrong
        </h4>
        <p>
          The tool tells you when something is wrong rather than failing
          silently, and there is only a short list of things it will object to.
          Select something that is not a picture and it asks for a JPG, PNG or
          WebP instead. If a file claims to be an image but is truncated or
          unreadable, you are told it could not be opened rather than left
          staring at a spinner. If the enlargement you asked for would land
          over the 25-megapixel output limit, it says so before doing any work
          and prints the exact dimensions it would have had to produce &mdash;
          section 4 covers that ceiling and how to get under it. Anything else
          that goes wrong mid-run surfaces as a plain failure message instead
          of a half-finished file.
        </p>
        <p>
          The size limit and the general failure message both leave your
          picture loaded, so you can drop the factor, change the format and run
          it again without starting over; the two selection messages are simply
          asking you for a different file, which the <em>Change Image</em>
          button gives you. Any of them clears with the &times; on its right.
        </p>
        <p>
          If your picture is currently inside a PDF, pull it out first with the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF tool
          </Link>
          , then bring the result back here to enlarge it.
        </p>
      </section>

      {/* 3 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Enlarge an Image Without Losing Quality: The Honest Version
        </h3>
        <p>
          Search for an <strong>image enlarger</strong> and every result
          promises a miracle. Knowing this in advance saves an afternoon of
          disappointment: nothing can put back detail that was never recorded.
          If a number plate is unreadable in the original, it is unreadable at
          4&times;. Enlargement redistributes what exists and smooths the joins;
          it does not invent facts about the world.
        </p>
        <p>
          What it does do well is remove the blocky staircase you get from
          stretching a small picture, handing you a large file with clean edges.
          Here is the honest split.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Enlarges beautifully
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Logos, icons and flat graphic shapes</li>
              <li>Screenshots and interface captures</li>
              <li>Charts, diagrams and line art</li>
              <li>Clean, well-lit product photographs</li>
              <li>Anything already sharp that just needs to be larger</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> Will not be rescued
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Motion blur or a missed focus</li>
              <li>Faces from a tiny thumbnail crop</li>
              <li>Heavy grain from a night photograph</li>
              <li>Text that is already illegible</li>
              <li>Badly over-compressed images full of blocky artefacts</li>
            </ul>
          </div>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          When to switch the clarity filter off
        </h4>
        <p>
          The <strong>clarity and edge filter</strong> is on by default, and it
          is the right default for most work &mdash; it stops an enlargement
          looking washed out, and it is why{' '}
          <strong>upscaled screenshots</strong> and logos come out looking
          deliberate. But sharpening amplifies whatever it finds, noise
          included. On a grainy photo, a soft portrait or a heavily compressed
          JPG, it makes the grain crisper too. If your first result looks harsh
          or speckled, untick the box and run it again.
        </p>
      </section>

      {/* 4 */}
      <section id="scale-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Maximize2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. 2&times;, 4&times; and Why a Very Large Photo Refuses to Go 4&times;
        </h3>
        <p>
          The tool offers two fixed factors. <strong>2&times; upscale</strong>{' '}
          doubles width and height, quadrupling the pixel count &mdash; a 1000
          &times; 800 picture becomes 2000 &times; 1600.{' '}
          <strong>4&times; upscale</strong> quadruples each side, so the same
          picture becomes 4000 &times; 3200 and carries sixteen times as many
          pixels.
        </p>
        <p>
          That growth is why there is a ceiling. Output is capped at 25
          megapixels, and the check is on the finished size rather than on the
          factor you chose &mdash; so it applies to 2&times; exactly as it does
          to 4&times;. If the run you asked for would breach it, the tool stops
          before doing any work, names the size it would have had to produce,
          and points you at the smaller factor or at cropping first. Nothing is
          half-produced or silently truncated. In practice:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>At 4&times;</strong>, your source needs to be under roughly
            1.5 megapixels &mdash; about 1250 &times; 1250, or a 1600 &times;
            900 frame. That is exactly the range 4&times; is built for.
          </li>
          <li>
            <strong>At 2&times;</strong>, your source can be up to roughly 6.25
            megapixels &mdash; about 2500 &times; 2500.
          </li>
          <li>
            <strong>Above roughly 6.25 megapixels</strong>, the tool declines
            both factors &mdash; the output would breach the ceiling either
            way, so there is no smaller setting left to fall back to. Crop the
            frame down first, or reach for the resizer if what you actually
            need is a specific set of dimensions.
          </li>
        </ul>
        <p>
          Hit the cap and need a specific output size? The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          takes exact width and height values, which the enlarger deliberately
          does not &mdash; it works in whole-number multiples. And if only part
          of the frame matters, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          will cut it down first, bringing the pixel count under the ceiling so
          you can go 4&times; on the part you care about. That crop-then-enlarge
          order is the most useful trick on this page, and it is the only route
          through when even 2&times; is refused: get the source under 6.25
          megapixels and the doubling goes ahead.
        </p>
      </section>

      {/* 5 */}
      <section id="formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          5. Choosing PNG, JPG or WebP for the Enlarged File
        </h3>
        <p>
          You pick the output format before running the enlargement, and the
          choice changes both the file size and what survives. PNG stores the
          enlargement exactly as it was produced; JPG and WebP compress it, at
          a high quality setting you never have to configure.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>PNG</strong> is the maximum-quality option, and the one for
            logos, screenshots, diagrams and anything with a transparent
            background, because transparency is preserved exactly. It is defined
            by{' '}
            <a
              href="https://www.w3.org/TR/png-3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              the W3C PNG specification
            </a>
            , which is why a PNG opens identically everywhere. The trade is
            size: a 4&times; PNG of a photograph is a heavy file.
          </li>
          <li>
            <strong>JPG</strong> is the standard web choice for photographs and
            produces a far smaller file. It has no concept of transparency, so
            if your picture has a transparent background, pick PNG or WebP.
          </li>
          <li>
            <strong>WebP</strong> is the modern compact option &mdash; it keeps
            transparency and usually lands smallest of the three, which makes it
            the right pick for an <strong>upscaled image for a website</strong>.
          </li>
        </ul>
        <p>
          If a PNG comes out heavier than you want to publish, run it through
          the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          afterwards to bring the weight down while keeping the transparency.
          And if the picture you want to enlarge is currently trapped in a
          document, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          and the{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG, WebP, TIFF, BMP and GIF converter
          </Link>{' '}
          will get you a picture file to start from.
        </p>
      </section>

      {/* 6 */}
      <section id="print-screens" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          6. Enlarging for Print, Posters and 4K Screens
        </h3>
        <p>
          &ldquo;My image is too low resolution to print&rdquo; is one of the
          most common reasons anybody goes looking for a{' '}
          <strong>picture enlarger</strong>, and there is a piece of arithmetic
          behind it that almost nobody explains.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          DPI is not a setting, it is a division sum
        </h4>
        <p>
          There is no DPI field here, and that is deliberate rather than
          missing. DPI is just the pixel count divided by the physical size you
          print at. A print shop asking for 300 DPI on an 8 &times; 10 inch
          print is asking for 2400 &times; 3000 pixels; feed it a 1200 &times;
          1500 original and you are at 150 DPI, which is why it was rejected.
          Run that same original at 2&times; and you land on exactly 2400
          &times; 3000. The enlargement changes the answer, not a metadata
          field.
        </p>
        <p>
          The same maths covers screens. A 1920 &times; 1080 frame enlarged
          2&times; becomes 3840 &times; 2160, which is precisely a{' '}
          <strong>4K image</strong> &mdash; the honest route to{' '}
          <strong>upscale an image to 4K</strong> for a presentation background
          or a television display. One caveat: a print is held at
          arm&rsquo;s length while a screenshot is inspected at 100%, so print
          forgives an enlargement far more readily than a monitor does. Judge
          the result at the size it will actually be seen.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Enlarger
        </h3>
        <p>
          Plenty of sites will <strong>upscale an image</strong>. Most make it
          deliberately irritating until you pay, and several stamp the result.
          Here is what is different, stated plainly enough to check.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no seven-day countdown. The tool you are using is the whole product.'],
            ['No watermark on the enlargement', 'Your upscaled picture comes out clean. Nothing is stamped across the corner and nothing is added along the edge.'],
            ['No daily limit', 'Enlarge one picture or forty. There is no counter quietly ticking down and no tier above this one to upsell you to.'],
            ['Your pictures stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['You choose the output format', 'PNG, JPG or WebP, decided before you run it, with transparency preserved on the two formats that support it.'],
            ['An honest description of the result', 'We tell you what enlarges cleanly and what cannot be rescued, before you spend time on it rather than after.'],
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
          It sits in a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free image and document tools
          </Link>{' '}
          built on the same terms, so once a picture is the size you need you
          can crop it, compress it, or lift its exact shades with the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          without paying for any of it.
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
              'How do I enlarge an image without losing quality?',
              'Use the image enlarger at the top of this page: select your picture, pick 2x or 4x, press Enlarge, then press the download button that appears. It rebuilds the picture at the larger size and, with the clarity filter left on, runs an edge pass so it stays crisp instead of going blocky. What it cannot do is add detail that was never in the original.',
            ],
            [
              'Why does my picture look blurry or pixelated when I make it bigger?',
              'Because stretching a picture asks each existing pixel to cover more space. A 600-pixel-wide image shown at 1800 pixels wide has every pixel doing the work of three, which reads as a blocky staircase on edges. Enlarging it properly creates real new pixels instead, which is why the result beats dragging a corner in a document.',
            ],
            [
              'Why can I not upscale my photo 4x?',
              'Output is capped at 25 megapixels, so a 4x run needs a source under roughly 1.5 megapixels — around 1250 x 1250 pixels. Above that the tool tells you before doing any work and names the size it would have had to produce. The same ceiling governs 2x: past roughly 6.25 megapixels both factors are declined, because either output would breach it. Cropping is the way through — cut the frame down to the part that matters and the enlargement runs on the smaller piece.',
            ],
            [
              'Is this an AI image upscaler?',
              'No, and it is worth saying so directly. It is a high-quality resolution upscaler with an optional clarity and edge filter. It does not generate new detail, reconstruct faces, remove blur or repair an out-of-focus shot. For making a sharp picture larger it works excellently; for rescuing a ruined one, no honest tool will help.',
            ],
            [
              'What image formats can I enlarge, and what do I get back?',
              'Feed it a JPG, PNG or WebP, one picture at a time. The enlargement comes back as PNG for maximum quality and transparency, JPG for a smaller photographic file, or WebP for the most compact option. The download is named after your original with the scale added, so photo.jpg becomes photo-2x.png.',
            ],
            [
              'Are my photos safe when I enlarge them here?',
              'Your pictures are not stored on our servers, not retained after your session, and never used for training or analytics. Nothing you enlarge is kept, queued or logged.',
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
          Same picture, different job? Use the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          when you need an exact width and height, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          to cut down to the part that matters first, the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          to get the file light enough to publish, or the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code generator
          </Link>{' '}
          when the graphic you need does not exist yet. To understand image
          quality rather than fight it, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers resolution, formats and preparing artwork for print.
        </p>
      </div>
    </article>
  );
}
