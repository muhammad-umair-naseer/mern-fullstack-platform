import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FlipHorizontal2,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  RotateCw,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Rotate & Flip Image tool.
 *
 * Same shape as the other tool guides. Facts stated match RotateFlipImage.js:
 * 90° steps are lossless and swap width and height; a free angle enlarges the
 * canvas to the bounding box with transparent (PNG/WebP) or coloured corners;
 * the output keeps the input format for PNG/JPEG/WebP and otherwise becomes
 * PNG; no batch, no auto-straighten, no EXIF handling, first frame only for
 * animated files.
 */
export default function RotateFlipImageSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Rotate or Flip an Image</span> Online Without Losing a Pixel
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A phone photo that lands sideways in a form. A scan that came out upside
        down. A selfie the front camera mirrored, a logo that needs to face the
        other way, an iron-on design that has to be printed backwards. All of
        these are a turn or a mirror away from right, and none of them should
        cost you an editor, an account or a recompressed file. This guide
        explains how to <strong>rotate an image online</strong> by 90° steps or
        by any angle, how to <strong>flip an image</strong> horizontally or
        vertically, what each operation does to the pixels and the file, and
        why the photo was sideways in the first place.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/rotate-flip-image.webp"
            alt="Rotate and flip online free - a sideways snapshot turned upright by 90 degrees and a logo mirrored horizontally, with transparent corners on a custom angle"
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
              Quarter turns are exact. A free angle keeps the whole picture and
              gives you the corners to decide. A flip is a mirror, not a turn.
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
            ['#rotate-vs-flip', '1. Rotate, Flip, Mirror: Which One You Need'],
            ['#how-to', '2. How to Rotate or Flip an Image in Three Steps'],
            ['#quarter-turns', '3. Why 90° Turns Lose Nothing'],
            ['#free-angle', '4. Straightening With a Custom Angle: What Happens to the Corners'],
            ['#sideways-photo', '5. Why Your Phone Photo Was Sideways'],
            ['#format', '6. What the File Comes Back As'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Image Rotator'],
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
      <section id="rotate-vs-flip" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FlipHorizontal2 className="w-6 h-6 text-orange-500 shrink-0" />
          1. Rotate, Flip, Mirror: Which One You Need
        </h3>
        <p>
          Three words, two operations. <strong>Rotating</strong> turns the
          picture around its centre, the way you would turn a print on a
          table: a sideways photo becomes upright, an upside-down scan rights
          itself. <strong>Flipping</strong> &mdash; the same thing as{' '}
          <strong>mirroring</strong> &mdash; reflects it, the way a mirror
          does: text runs backwards, a person&rsquo;s left hand becomes their
          right. No amount of rotating produces a mirror image, and no flip
          produces a turn, which is why the tool keeps them as separate
          controls that you can combine.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-orange-500 shrink-0" /> You want to rotate when…
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The picture is on its side or upside down; a horizon or a scanned
              page is slightly crooked; a portrait shot should be landscape for
              a slide. Words in the picture still read normally after a
              rotation &mdash; they are just turned.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FlipHorizontal2 className="w-5 h-5 text-orange-500 shrink-0" /> You want to flip when…
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A selfie came out mirrored; a product should face into the page
              rather than off it; a design is going onto an iron-on transfer or
              a stencil and must print backwards; a texture needs to tile
              symmetrically. Horizontal swaps left and right; vertical swaps
              top and bottom.
            </p>
          </div>
        </div>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Rotate or Flip an Image in Three Steps
        </h3>
        <ol className="space-y-3">
          <li>
            <strong>Add the image.</strong> Drop it on the panel at the top of
            this page or click to choose it. PNG, JPG, WebP, GIF, BMP and SVG
            all work; you will see it with its pixel size underneath.
          </li>
          <li>
            <strong>Turn or mirror it.</strong> Press <em>90° left</em> or{' '}
            <em>90° right</em> as many times as you need; two presses is a
            180° turn. Drag the fine-angle slider for anything in between.
            Press <em>Horizontal</em> or <em>Vertical</em> to flip, and combine
            them freely &mdash; a 90° turn plus a flip is perfectly legal. The
            preview follows every change, and the readout shows what size the
            result will be.
          </li>
          <li>
            <strong>Download.</strong> The button names the format you will
            get. Changed your mind? <em>Undo all changes</em> puts the picture
            back as it came in without reloading it.
          </li>
        </ol>
        <p>
          The download is rendered from the original pixels, not from the
          preview, so it is always full resolution however small the preview
          looked on your screen. The same page works to{' '}
          <strong>rotate an image on a phone</strong>; the slider is happy to
          be dragged with a thumb.
        </p>
      </section>

      {/* 3 */}
      <section id="quarter-turns" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCw className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why 90° Turns Lose Nothing
        </h3>
        <p>
          A quarter turn moves every pixel to a new whole-number position and
          nothing else. No pixel is blended with its neighbour, nothing is
          estimated; the grid simply turns with the picture. That is why a
          1200 × 800 photo becomes exactly 800 × 1200 and why people asking
          how to <strong>rotate a PNG without losing quality</strong> can stop
          worrying: for a PNG the turn is perfectly lossless, and the file
          comes back as a PNG.
        </p>
        <p>
          JPEG deserves one honest sentence. A JPEG has to be decoded to
          pixels and encoded again on the way out, and JPEG encoding is lossy
          by nature, so a <strong>rotated JPG</strong> is re-encoded at high
          quality rather than being bit-identical. In practice, one pass at
          the quality used here is invisible on a photograph; it is repeated
          round trips through many tools that eventually show. If a file is
          going to be edited several more times, do the rotation last, or
          work in PNG until the final save. Flips are the same story: a
          mirror is a pure re-ordering of pixels, so PNG and WebP flips are
          exact and JPEG flips cost one careful re-encode.
        </p>
      </section>

      {/* 4 */}
      <section id="free-angle" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Straightening With a Custom Angle: What Happens to the Corners
        </h3>
        <p>
          Turn a rectangle by anything other than a multiple of 90° and it no
          longer fits in a rectangle of the same size. Something has to give,
          and there are two schools. One crops in until no empty corner shows
          &mdash; and quietly throws away the edges of your picture. The other
          keeps every pixel and enlarges the canvas to the turned picture&rsquo;s
          bounding box, leaving four empty triangles in the corners. This tool
          takes the second road, because throwing away part of a photo is a
          decision you should make deliberately, with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          , not a side effect of straightening it.
        </p>
        <p>
          So when you <strong>straighten an image</strong> by a few degrees,
          the readout shows the new, slightly larger size and a{' '}
          <em>Corners</em> setting appears. For PNG and WebP the corners are
          transparent by default, which is what you want for a logo or a
          sticker that will sit on a coloured background. Untick that, or work
          with a JPEG, and you choose a fill colour instead &mdash; white for
          a scan, or the exact colour of the page it will sit on. A small
          angle also means resampling, so unlike a quarter turn it is not
          pixel-exact; keep it to the correction you need and no more.
        </p>
      </section>

      {/* 5 */}
      <section id="sideways-photo" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why Your Phone Photo Was Sideways
        </h3>
        <p>
          The commonest reason anyone searches for this tool: a photo looked
          fine on the phone and arrived on its side in a web form, an email or
          a document. Phones do not usually turn the pixels when you hold the
          camera sideways. They save the picture the way the sensor saw it and
          add a note in the file&rsquo;s metadata &mdash; the orientation tag
          in the EXIF block described by the{' '}
          <a
            href="https://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            EXIF standard
          </a>{' '}
          &mdash; that says &ldquo;display this turned 90° clockwise&rdquo;. Your
          phone reads the note. A great many uploaders, older programs and
          some websites ignore it, and show you the raw, sideways pixels.
        </p>
        <p>
          The fix is to make the pixels themselves upright, so no reader has
          to honour a note. Rotate the photo here by 90° in the direction that
          rights it and download; the output is a fresh image with the turn
          baked into the pixels and no orientation tag left to be ignored.
          That is also why the tool shows the image as decoded rather than
          guessing from the tag: you see exactly what the misbehaving website
          saw, and you fix exactly that.
        </p>
      </section>

      {/* 6 */}
      <section id="format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. What the File Comes Back As
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>PNG stays PNG</strong>, transparency and all. JPEG stays
            JPEG. WebP stays WebP. Anything else &mdash; GIF, BMP, SVG &mdash;
            comes back as a PNG, which keeps every pixel of it.
          </li>
          <li>
            <strong>Pixel size</strong> is swapped for quarter turns and
            enlarged to the bounding box for other angles; it is never scaled.
            Need it smaller or larger afterwards? That is the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            ; need it lighter, the{' '}
            <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image compressor
            </Link>
            .
          </li>
          <li>
            <strong>Animated files</strong> are treated as a single picture:
            only the first frame is rotated.
          </li>
          <li>
            <strong>Metadata is not carried over.</strong> The output is a
            fresh image, which is exactly why the orientation problem above
            goes away &mdash; and also why camera details and location are not
            in the file, which is usually welcome.
          </li>
          <li>
            <strong>The name tells you what was done</strong>:{' '}
            <em>photo-rot90.jpg</em>, <em>logo-fliph.png</em>,{' '}
            <em>scan-rot270-flipv.png</em>. Your original is never touched.
          </li>
        </ul>
        <p>
          One thing this page does not do is rotate a PDF; a document is
          turned page by page with the{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate tool
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Rotator
        </h3>
        <p>
          Any number of pages will <strong>rotate a picture online</strong>.
          Here is what this one does that most do not, stated so you can check
          each line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card and no watermark. The tool on this page is the entire product.'],
            ['Quarter turns are exact', 'A 90° or 180° turn moves pixels without blending them, so PNG and WebP come back bit-for-bit as sharp as they went in.'],
            ['Any angle, corners your way', 'A 1° slider for straightening, with the whole picture kept and the corners transparent or filled with a colour you pick — never silently cropped.'],
            ['Same format out as in', 'PNG stays PNG with its transparency, JPEG stays JPEG, WebP stays WebP. No surprise conversion to a format you did not ask for.'],
            ['Your pictures stay private', 'Images are never stored on our servers, never queued, never logged and never retained after your session, and never used for training.'],
            ['You see the size before you download', 'The readout shows source and output dimensions as you work, so a swapped or enlarged canvas is never a surprise.'],
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
            free image and document tools
          </Link>{' '}
          built on the same terms, so the picture you turn here can be
          cropped, resized, converted and compressed without paying for any of
          it either.
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
              'How do I rotate an image online for free?',
              'Drop the image on the panel at the top of this page, press 90° left or 90° right until it is the right way up (or drag the slider for a custom angle), and download. There is no account, no watermark and no limit on how many pictures you turn.',
            ],
            [
              'How do I flip or mirror an image?',
              'Add the image and press Horizontal to swap left and right, or Vertical to swap top and bottom. Both can be on at once, and both combine with rotation. A horizontal flip is what un-mirrors a front-camera selfie and what you need before printing an iron-on transfer.',
            ],
            [
              'Does rotating lose quality?',
              'A 90°, 180° or 270° turn loses nothing: pixels move, none are blended. PNG and WebP come back exactly as sharp; a JPEG is re-encoded once at high quality, which is invisible on a photo. A custom angle involves resampling, so keep it to the correction you need.',
            ],
            [
              'Why does a small angle make the image bigger and add empty corners?',
              'A rectangle turned by a few degrees no longer fits its old frame. Rather than crop your picture without asking, the tool enlarges the canvas to fit the whole turned image and leaves the four corners to you: transparent for PNG and WebP, or filled with a colour you choose. Crop afterwards with the image cropper if you want a clean rectangle.',
            ],
            [
              'Why was my phone photo sideways in the first place?',
              'Phones usually store the pixels as the sensor saw them and add an orientation note in the file’s metadata. Your phone honours the note; many websites and older programs ignore it and show the raw sideways pixels. Rotating here bakes the turn into the pixels themselves, so every reader shows it upright.',
            ],
            [
              'What format will I get back?',
              'The one you gave: PNG stays PNG with transparency, JPEG stays JPEG, WebP stays WebP. GIF, BMP and SVG come back as PNG. The pixel size is swapped for quarter turns and otherwise enlarged to fit; it is never scaled down.',
            ],
            [
              'Can I rotate several images at once?',
              'One at a time. Each picture is shown, turned and checked individually so a wrong direction is caught before the download rather than after it has been applied to twenty files.',
            ],
            [
              'Are my images kept anywhere?',
              'No. Images are never stored on our servers, never queued or logged, and never retained after your session or used for training. The rotated copy is a new file; your original is left exactly as it was.',
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
          Upright at last? Trim it with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          , change its format with the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>
          , or scale it up with the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>
          . And if you would rather understand how pixels and canvases work
          than only push them around, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          starts there.
        </p>
      </div>
    </article>
  );
}
