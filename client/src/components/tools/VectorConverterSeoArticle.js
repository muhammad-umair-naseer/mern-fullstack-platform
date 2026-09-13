import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileImage,
  HelpCircle,
  Layers,
  Maximize2,
  Palette,
  Ruler,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the vector converter tool.
 *
 * Written against what VectorConverter.js actually does, which is narrower
 * than the route name suggests. The only vector input it reads is SVG, and the
 * only outputs are PNG, JPG, WebP and a resized copy of the same SVG. So the
 * article is built around "svg to png converter" and its neighbours, and the
 * head term "vector converter" is deliberately not promised: EPS, AI, PDF, DXF
 * and CDR are named once, honestly, as things this page does not touch, with a
 * pointer to the tools that do.
 *
 * The spine of the piece is parseSvgSize: output pixels come from the SVG's
 * own width/height (mm, cm, in, pt and pc converted at 96 px per inch), then
 * the viewBox, then 300 x 150. That single fact answers the "blurry", "too
 * small" and "comes out 300x150" searches that forums currently own, so it
 * gets section 1 rather than a footnote. withSize's repair of a missing
 * viewBox and xmlns gets its own section for the same reason.
 *
 * "png to svg converter" is mostly a vectorising intent, and rasterToSvg does
 * not vectorise — it wraps the bitmap in an <image> element. Section 7 says
 * so in the first sentence and only claims the "embed png in svg" sub-intent.
 * The resized-SVG output inherits whichever multiplier was last chosen, which
 * is a quirk rather than a feature; section 5 explains it instead of hiding it.
 */
export default function VectorConverterSeoArticle() {
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
        The <span className="text-orange-600 dark:text-orange-400">SVG to PNG Converter</span> Guide: Where the Pixels Come From
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An SVG has no pixels. It is a list of shapes, and it only becomes a
        picture when something draws it at a particular size. That is why people
        search for an <strong>SVG to PNG converter</strong> and then complain the
        result is blurry, tiny, or 300 by 150 for no obvious reason. This guide
        explains how the tool above decides the output size, how the 1x to 4x
        multiplier gives you a <strong>high resolution PNG for free</strong>,
        what the <strong>SVG to JPG</strong> background fill is for, and why the{' '}
        <strong>PNG to SVG</strong> direction is an embedded bitmap rather than a
        trace.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/vector-converter.webp"
            alt="SVG to PNG converter free - export SVG as PNG, JPG or WebP at 1x, 2x, 3x or 4x with transparency"
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
              One SVG in, a PNG, JPG, WebP or resized SVG out, with the exact
              pixel size shown before you convert.
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
            ['#where-pixels-come-from', '1. Where the PNG Pixel Size Actually Comes From'],
            ['#how-to-convert', '2. How to Use the SVG to PNG Converter'],
            ['#scale', '3. 1x to 4x: Fixing Blurry and Too-Small PNGs'],
            ['#formats', '4. PNG, JPG or WebP: Transparency and Background Fill'],
            ['#viewbox-repair', '5. Missing viewBox, Missing xmlns and the Resized SVG'],
            ['#fonts-and-limits', '6. Fonts, foreignObject and What This Tool Does Not Do'],
            ['#png-to-svg', '7. PNG to SVG: An Embedded Bitmap, Not a Trace'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free SVG to PNG Converter'],
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
      <section id="where-pixels-come-from" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          1. Where the PNG Pixel Size Actually Comes From
        </h3>
        <p>
          Every question about <strong>SVG to PNG</strong> output size has the
          same answer: the size comes from the SVG itself. When you load a file,
          the tool reads the root <code>&lt;svg&gt;</code> tag and works out a
          base width and height in this order:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Declared width and height.</strong> If the root tag carries
            both, those are the base size. Physical units are honoured: mm, cm,
            in, pt and pc are converted at 96 pixels per inch, the ratio fixed by
            the{' '}
            <a
              href="https://www.w3.org/TR/css-values-3/#absolute-lengths"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              W3C CSS Values and Units specification
            </a>
            . A value with no unit is pixels. So an A4 artboard declared as{' '}
            <code>210mm</code> by <code>297mm</code> becomes a 794 by 1123 pixel
            base, which is the whole answer to{' '}
            <strong>SVG to PNG mm to pixels 96 DPI</strong>.
          </li>
          <li>
            <strong>The viewBox.</strong> If width and height are missing, the
            third and fourth viewBox numbers are used instead. If only one is
            missing, the other is derived from the viewBox aspect ratio.
          </li>
          <li>
            <strong>300 by 150.</strong> With no usable width, height or viewBox,
            the base size falls back to 300 by 150 pixels, the standard default
            for an SVG with no declared dimensions. If your{' '}
            <strong>SVG to PNG comes out 300x150</strong>, this is why: the file
            does not say how big it is, and nothing in it lets a converter guess.
          </li>
        </ul>
        <p>
          Percentage widths are not a size, so those files fall through to the
          viewBox and then to the default. The parsed base size is printed under
          the file name the moment it loads.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use the SVG to PNG Converter (Step-by-Step)
        </h3>
        <p>
          If you searched for an{' '}
          <strong>SVG to PNG converter no signup no watermark</strong>, this is
          one, and it is how to{' '}
          <strong>convert SVG to PNG without desktop vector software</strong>{' '}
          when all you need is the picture:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your SVG', 'Click the panel above and pick a .svg file. The parsed width and height appear under the file name, with a preview of the source.'],
            ['Pick a format and a multiplier', 'PNG, JPG, WebP or Resized SVG. The Export Scaling dropdown lists 1x to 4x with the exact output pixel size beside each.'],
            ['Convert and download', 'One click renders the file and downloads it as yourname.png, .jpeg or .webp. Change a setting and run it again for another size.'],
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
          The tool works on one file at a time, and there is no daily cap.
        </p>
      </section>

      {/* 3 */}
      <section id="scale" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Maximize2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. 1x to 4x: How to Convert SVG to PNG Without Losing Quality
        </h3>
        <p>
          When an <strong>SVG converted to PNG is blurry</strong>, the SVG is
          almost never at fault. A logo declared at 120 by 40 exports as a 120 by
          40 PNG, and any screen showing it larger has to stretch those pixels.
          The same thing is behind an <strong>SVG exported PNG too small</strong>:
          the file said small, and the tool did what the file said.
        </p>
        <p>
          The fix is the Export Scaling multiplier, which draws the artwork
          larger before it is saved. Because the source is vector, every
          multiplier is equally crisp: no upscaling, only more pixels spent on
          the same curves. That is the honest way to{' '}
          <strong>convert SVG to PNG without losing quality</strong>, and it is
          what <strong>SVG to PNG high resolution free</strong> searches are
          really asking for.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              2x Retina and 3x HD
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>convert SVG to PNG 2x Retina</strong> style, pick 2x:
              a 200 by 100 SVG becomes a 400 by 200 PNG that stays sharp on
              high-density screens. 3x covers the densest phone displays. Name
              them @2x and @3x and they slot straight into an app asset
              catalogue.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              4x Ultra for print and large displays
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              An <strong>SVG 4x export for print</strong> turns a 600 by 400
              artboard into 2400 by 1600 pixels, and the dropdown prints that
              number so you can check it against the print spec first.
            </p>
          </div>
        </div>
        <p>
          The multiplier is the only size control; there is no custom pixel
          width or DPI field. For a size that is not a whole multiple, export at
          the nearest larger multiplier and pass the PNG through the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          4. PNG, JPG or WebP: Transparency and the Background Fill
        </h3>
        <p>
          The difference between the three raster formats is mostly what happens
          to the empty space around your artwork.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          PNG and WebP keep transparency
        </h4>
        <p>
          Choose PNG for <strong>SVG to PNG transparent background online</strong>{' '}
          jobs: anything the SVG leaves unpainted stays clear, so the logo sits
          on whatever colour the page or slide uses. PNG is lossless, which
          suits icons and diagrams with hard edges.{' '}
          <strong>SVG to WebP</strong> keeps transparency too and usually
          produces a smaller file for the same picture, which is why an{' '}
          <strong>SVG to WebP converter online free transparent</strong> search
          usually ends with a website asset. If a platform later refuses WebP,
          the{' '}
          <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WebP to PNG tool
          </Link>{' '}
          reverses it.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          JPG cannot be transparent, so you choose the fill
        </h4>
        <p>
          JPEG has no alpha channel. When an <strong>SVG to JPG converter</strong>{' '}
          leaves transparent areas undefined they typically come out black,
          which is the whole story behind{' '}
          <strong>SVG to JPG background turns black</strong>. Here, the moment
          you pick JPG a Background Fill colour picker appears, set to white by
          default. That is <strong>SVG to JPG online free white background</strong>{' '}
          in one step, and because it is a picker rather than a checkbox it
          also covers <strong>SVG to JPG custom background color</strong>{' '}
          requests: set a brand hex value (our{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          helps if you only have the colour on screen) and the JPG is filled
          with it before the artwork is drawn on top.
        </p>
        <p>
          The fill picker appears only for JPG. JPG and WebP are written at a
          fixed high-quality setting with no slider, so if the file needs to be
          smaller afterwards the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>{' '}
          is the next stop.
        </p>
      </section>

      {/* 5 */}
      <section id="viewbox-repair" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Missing viewBox, Missing xmlns and the Resized SVG Output
        </h3>
        <p>
          <strong>Why does my SVG have no width and height?</strong> Usually
          because the design tool that exported it was told to make it
          responsive, so it takes its size from wherever it is placed. Inline
          SVG copied from a web page often lacks an <code>xmlns</code> attribute
          too. Both display fine where they came from and both cause trouble as
          standalone images.
        </p>
        <p>
          The forum thread titled{' '}
          <strong>SVG missing viewBox not rendering PNG</strong> has a simple
          cause: with no width, height or viewBox there is no scale at all.
          Before rendering, the tool repairs the root tag. Existing width and
          height are removed, a{' '}
          <code>viewBox="0 0 W H"</code> is injected from the parsed base size if
          one is missing, the SVG namespace is added if absent, and the scaled
          width and height are written in. The{' '}
          <a
            href="https://www.w3.org/TR/SVG2/coords.html#ViewBoxAttribute"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C SVG 2 specification
          </a>{' '}
          defines the viewBox as the mapping from the drawing's own coordinates
          to the rendered area, which is why a file without one cannot be
          scaled.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Resized SVG: add a viewBox and resize the width and height online
        </h4>
        <p>
          The fourth output option skips the raster stage and downloads the
          repaired SVG itself. Use it to{' '}
          <strong>add viewBox to SVG online</strong> or to{' '}
          <strong>resize SVG width and height online</strong> without opening
          an editor. Paths, ids, styles and comments are untouched; only the
          root tag changes.
        </p>
        <p>
          One thing to know: the resized SVG uses whichever multiplier was last
          chosen in Export Scaling, 2x unless you changed it, and the file name
          shows the result, for example <code>logo_800x400.svg</code>. For the
          original size, choose PNG first, set 1x, then switch back.
        </p>
      </section>

      {/* 6 */}
      <section id="fonts-and-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Fonts, foreignObject and What This Tool Does Not Do
        </h3>
        <p>
          When an <strong>SVG won't render as PNG text missing font</strong> is
          the complaint, the cause is a font referenced by URL. Linked fonts,
          stylesheets and images are not loaded during conversion, so text in a
          web font falls back to a substitute and text in an icon font can
          vanish. The fix is to convert text to outlines before exporting, or to
          embed the font data inside the SVG; the{' '}
          <Link to="/tools/font-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            font converter
          </Link>{' '}
          can prepare the font file for that.
        </p>
        <p>
          SVGs that embed HTML through <code>&lt;foreignObject&gt;</code>, or
          that reference resources on other domains, are not supported and stop
          with a &ldquo;Conversion failed&rdquo; message.
        </p>
        <p>
          A few honest limits. The route is named vector converter, but the only
          vector input it reads is SVG. It does not convert EPS, AI, PDF, DXF,
          CDR, WMF or EMF; for EPS and PostScript files start with{' '}
          <Link to="/tools/pdf-psd-eps-ps" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF, PSD, EPS and PS conversion
          </Link>
          , and for CAD drawings use the{' '}
          <Link to="/tools/cad-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CAD converter
          </Link>
          . It does not output PDF, ICO or GIF, minify SVG markup, or crop, pad
          and recolour. Input is limited to SVG, PNG, JPG and WebP; the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          covers other raster formats.
        </p>
      </section>

      {/* 7 */}
      <section id="png-to-svg" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          7. PNG to SVG: An Embedded Bitmap, Not a Trace
        </h3>
        <p>
          Most people typing <strong>PNG to SVG converter</strong> want their
          bitmap turned into editable paths, and this tool does not do that. It
          does not trace, vectorise or detect shapes. What it does is the less
          glamorous job: <strong>embed PNG in SVG file without tracing</strong>.
          Load a PNG, JPG or WebP and the single output option, &ldquo;SVG Vector
          Container&rdquo;, wraps the unchanged pixels in an{' '}
          <code>&lt;svg&gt;</code> element at the image's natural width and
          height.
        </p>
        <p>
          That is the right answer for a content system that only accepts .svg
          uploads. The picture is exactly as sharp as the source and the file is
          somewhat larger, because the pixels are stored as text. It will not
          work for a cutting machine, an embroidery file or path editing in a
          vector app. If the real goal is a bigger, cleaner raster, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          is the closer fit.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free SVG to PNG Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['See the pixel size before you convert', 'The 1x to 4x options each show the exact output width and height, so there is no guessing and no second attempt.'],
            ['Physical units handled correctly', 'Artboards declared in mm, cm, in, pt or pc are converted at the standard 96 pixels per inch, so a print-sized SVG comes out predictably.'],
            ['Repairs size-less and namespace-less SVGs', 'A missing viewBox or xmlns is fixed on the way through, so inline SVGs copied from a web page still export at the right size.'],
            ['You choose the JPG background', 'A real colour picker, defaulting to white, so transparent areas become the colour you want instead of black.'],
            ['No signup, no watermark, no quota', 'Nothing is gated behind an account, nothing is stamped on the output, and the hundredth file costs the same as the first.'],
            ['Your files stay private', 'Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.'],
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
          on the same terms, including an{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          for trimming the exported PNG.
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
              'Is this SVG to PNG converter free, with no signup and no watermark?',
              'Yes. Choose the file, pick a format and multiplier, and download. There is no account, no email step, no watermark and no daily limit.',
            ],
            [
              'Why is my SVG converted to PNG blurry or too small?',
              'Because the PNG was made at the size the SVG declares, and that size is often small. Choose 2x, 3x or 4x in Export Scaling; the artwork is drawn larger rather than stretched.',
            ],
            [
              'Why does my SVG to PNG come out 300x150?',
              'The SVG has no usable width, height or viewBox, so it falls back to the standard 300 by 150 default. Add a viewBox in your design tool, or export at 4x to get a 1200 by 600 PNG from the file as it is.',
            ],
            [
              'Why does the background turn black when I convert SVG to JPG?',
              'JPEG cannot store transparency, so converters that do not fill the empty areas leave them black. This tool shows a Background Fill picker whenever JPG is selected, white by default, so the JPG comes out on any colour you choose.',
            ],
            [
              'Can I convert PNG to SVG with this tool?',
              'Only as an embedded bitmap. The PNG is wrapped in an SVG container at its natural size; it is not traced into paths and the result is not editable vector art.',
            ],
            [
              'Can it convert EPS, AI or PDF to SVG or PNG?',
              'No. SVG is the only vector input it reads. Use the PDF, PSD, EPS and PS tool for EPS and PostScript files and the CAD converter for CAD drawings.',
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
          Need a different kind of picture from a different kind of file? The{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          swaps between raster formats,{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG
          </Link>{' '}
          renders document pages as images, and the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          brings a 4x export down to a sensible size for the web. To understand
          vectors, rasters and resolution rather than simply convert between
          them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          starts with exactly that.
        </p>
      </div>
    </article>
  );
}
