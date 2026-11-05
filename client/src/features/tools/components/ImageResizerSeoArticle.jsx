import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  Lock,
  Maximize2,
  Palette,
  Scaling,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image Resizer tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, benefit grid, FAQ, closing link block.
 *
 * Three decisions shaped the copy, and they matter if anyone edits it later.
 *
 * First, every claim is read off ImageResizer.js. The tool takes one image at a
 * time, clamps width and height to 1-10000 px, offers an aspect-ratio lock, five
 * dimension presets (Original, 1080x1080, 1080x1920, 1280x720, 1920x1080), three
 * output formats (JPG, PNG, WebP) and a 10-100 quality slider that is hidden for
 * PNG. Nothing outside that list is promised anywhere on the page.
 *
 * Second, several fat keywords describe things this tool does not do, so section
 * 6 answers them honestly instead of pretending. "Resize image to 20kb" and
 * "compress image to 100kb" want a target-file-size box: there isn't one, there
 * is a quality slider, and the section says so. "Bulk resize images" wants batch:
 * it is one image per run. "Resize image in cm / inches / 300 DPI" wants print
 * units: the inputs are pixels only. "Enlarge without losing quality" is a
 * different job and is pointed at the Image Enlarger. Answering the question
 * behind the keyword ranks; promising the feature generates complaints.
 *
 * Third, privacy is sold strictly as an outcome - files are not stored, not
 * retained, not used for training. The mechanism is deliberately absent from
 * every sentence in this file.
 */
export default function ImageResizerSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">Resize Image Online Free</span>: The Complete Guide to Width, Height and Dimensions
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An image is almost never the size you actually need. A phone camera hands
        you 4000 pixels of holiday photo; the upload box wants 1080. Whenever you
        need to <strong>change the width and height of an image</strong>, the job
        is the same: pick new dimensions, keep the shape honest, and export
        something a website, a form or a feed will accept. This guide explains
        how to <strong>resize an image</strong>, what an{' '}
        <strong>image resizer</strong> can and cannot do for you, and which
        settings actually matter.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">

          <img
            src="/blog/image-resizer.webp"
            alt="Framed photographs in three different sizes hung together on a pale wall"
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
              Set an exact width and height in pixels, keep the aspect ratio
              locked, and download the resized image as JPG, PNG or WebP.
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
            ['#what-changes', '1. What Actually Changes When You Resize an Image'],
            ['#how-to', '2. How to Resize an Image Online Free (Step-by-Step)'],
            ['#aspect-ratio', '3. Aspect Ratio: Resize Image Width and Height Without Stretching'],
            ['#presets', '4. Instagram, YouTube and Full HD Presets'],
            ['#format-quality', '5. JPG, PNG or WebP: Format and Quality'],
            ['#limits', '6. What This Image Resizer Will Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Image Resizer'],
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
      <section id="what-changes" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Actually Changes When You Resize an Image
        </h3>
        <p>
          A photograph is a grid of coloured squares. A 4000 &times; 3000 picture
          holds twelve million of them. When you{' '}
          <strong>change image dimensions</strong> you change how many squares
          that grid contains, so the picture is rebuilt to fit the new count.
          That single fact explains most of the surprises people meet with an{' '}
          <strong>image size converter</strong>, starting with the confusion
          between three things that sound identical and are not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Dimensions</strong> are width and height in pixels &mdash;
            1920 &times; 1080. This is what a form means by &ldquo;maximum 1600px
            wide&rdquo;, and it is what the tool above controls directly.
          </li>
          <li>
            <strong>File size</strong> is how many kilobytes the file occupies.
            It follows from the dimensions, the format and the quality setting
            rather than being typed in as a number.
          </li>
          <li>
            <strong>Aspect ratio</strong> is the relationship between the two
            &mdash; 16:9, 1:1, 4:5. Break it and faces go tall and thin, which is
            the giveaway of a badly resized image.
          </li>
        </ul>
        <p>
          Halving the width and height removes roughly three quarters of the
          pixels, so a resize is usually the most effective way to{' '}
          <strong>reduce image size</strong> before anything else is tried. The
          original dimensions and file size appear the moment you pick an image,
          so you can see what you are starting from.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Resize an Image Online Free (Step-by-Step)
        </h3>
        <p>
          There is no account, no email and no trial countdown. To{' '}
          <strong>resize a photo online free</strong> with the tool at the top of
          this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your image', 'Drag a JPG, PNG or WebP onto the panel, or click to browse. The original width, height and file size appear straight away.'],
            ['Set the dimensions', 'Type a width or a height in pixels, or tap a preset. With the ratio lock on, the second number follows the first.'],
            ['Pick a format and download', 'Choose JPG, PNG or WebP, set the quality if it applies, and download. The file is named after your original with the new dimensions appended.'],
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
          That is the whole job. The download button carries the exact output
          size, so a button reading <em>Download Resized Image (1080&times;1350)</em>{' '}
          tells you precisely what you are about to get. Nothing is stamped
          across the picture and no counter is ticking down. If the picture is
          the wrong shape rather than the wrong size, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free image cropper
          </Link>{' '}
          is the better starting point &mdash; cropping removes the parts you do
          not want, resizing keeps everything and rescales it.
        </p>
      </section>

      {/* 3 */}
      <section id="aspect-ratio" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500 shrink-0" />
          3. Aspect Ratio: Resize Image Width and Height Without Stretching
        </h3>
        <p>
          The <strong>Maintain Aspect Ratio</strong> lock is on by default and
          should usually stay that way. With it engaged, a new width recalculates
          the height from the original proportions and a new height recalculates
          the width, so you can{' '}
          <strong>resize image to specific width</strong> &mdash; 800 px for a
          blog image, 1200 px for a hero &mdash; and trust the other number to
          look after itself.
        </p>
        <p>
          Turn the lock off and the two boxes become independent. That is how you{' '}
          <strong>resize image to exact dimensions</strong> when a specification
          leaves no choice: a marketplace demanding a square thumbnail, a form
          wanting a fixed pixel box. Know the trade, because it is the most
          common reason people dislike their result. If the target shape does not
          match the original, an unlocked resize squashes the picture to fit
          &mdash; text leans, circles turn into ovals, faces widen.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Keep the lock on when
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>You only care about one dimension, such as a maximum width</li>
              <li>The picture contains people, products or type</li>
              <li>You are making a smaller copy of the same photo</li>
              <li>You want the picture to look untouched, only lighter</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> Unlock it only when
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>A rule demands two fixed numbers and will not budge</li>
              <li>The subject is a flat texture, pattern or colour field</li>
              <li>The distortion is small enough that nobody will notice</li>
              <li>You have already cropped the picture to the right shape</li>
            </ul>
          </div>
        </div>
        <p>
          The reliable route to a specific shape is two steps: crop to the ratio
          you need, then resize to the pixel numbers. The crop decides the
          composition, the resize decides the scale.
        </p>
      </section>

      {/* 4 */}
      <section id="presets" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Maximize2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Instagram, YouTube and Full HD Presets
        </h3>
        <p>
          Most resizing is done to satisfy somebody else&rsquo;s specification,
          so the four common ones are one tap away. A preset fills in both boxes,
          and a fifth button marked <strong>Original</strong> puts the true
          dimensions back.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Instagram Post &mdash; 1080 &times; 1080.</strong> The square
            feed size, and the safest general social thumbnail.
          </li>
          <li>
            <strong>Instagram Story &mdash; 1080 &times; 1920.</strong> Full
            vertical 9:16, also the right starting point for a Reel cover.
          </li>
          <li>
            <strong>YouTube Thumbnail &mdash; 1280 &times; 720.</strong> Classic
            16:9, which doubles as a default for a blog header or email banner.
          </li>
          <li>
            <strong>Full HD &mdash; 1920 &times; 1080.</strong> Standard screen
            size for wallpapers, slide backgrounds and hero images.
          </li>
        </ul>
        <p>
          Presets set dimensions, not shape. Tap a square preset on a 4:3 photo
          with the ratio lock on and your proportions are kept rather than
          silently distorted, so crop to a square first if a true square is what
          you need. Every number stays editable afterwards, anywhere from 1 to
          10000 pixels &mdash; a preset is a starting point, not a cage.
        </p>
      </section>

      {/* 5 */}
      <section id="format-quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          5. JPG, PNG or WebP: Choosing a Format and a Quality
        </h3>
        <p>
          The resized picture comes back in one of three formats, and the choice
          changes both the file size and what survives.
        </p>
        <p>
          <strong>JPG</strong> is the default and the right answer for
          photographs. It discards fine detail you are unlikely to see in
          exchange for a much smaller file, and the quality slider decides how
          aggressive that trade is. It cannot store transparency.{' '}
          <strong>PNG</strong> keeps every pixel exactly as it was and supports
          transparency, which makes it correct for logos, screenshots and
          diagrams &mdash; the{' '}
          <a
            href="https://www.w3.org/TR/png-3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>{' '}
          defines it as a lossless format, which is why no quality slider appears
          when you select it. <strong>WebP</strong> is the modern option: usually
          the smallest of the three at a comparable appearance.
        </p>
        <p>
          The <strong>quality slider</strong> runs from 10 to 100 and starts at a
          deliberately conservative 90. For a photograph, 80 to 90 is generally
          indistinguishable from the original at normal viewing size while
          cutting the file substantially; below about 60 you start to see blocky
          patches in skies and gradients. The slider applies to JPG and WebP
          only, and disappears when PNG is selected.
        </p>
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 not-prose my-6">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            One trap worth avoiding
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Exporting a transparent PNG as JPG loses the transparency, because
            the format cannot record it. If your picture has a see-through
            background, keep PNG or WebP as the output format.
          </p>
        </div>
        <p>
          If your goal is a lighter file rather than different dimensions, the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          is the tool for that job, and the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          will pull exact hex values out of the picture if you are matching a
          background.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Image Resizer Will Not Do
        </h3>
        <p>
          Every tool has edges, and it saves time to know them first. These are
          the requests people arrive with that this tool answers differently.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;Resize my image to exactly 20 KB&rdquo;
        </h4>
        <p>
          There is no target-file-size box here. You get dimensions and a quality
          slider, and the kilobytes follow from both. In practice that is enough:
          halve the width, drop the quality to 70, and most photos land under a
          typical upload limit. Check the downloaded file and, if it is still too
          heavy, take another few hundred pixels off the width.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;Resize a hundred images at once&rdquo;
        </h4>
        <p>
          This is a single-image tool: one picture in, one resized file out. That
          is deliberate &mdash; the presets, the ratio lock and the quality
          slider all assume you are looking at one picture and deciding about it.
          For the images that actually matter, one at a time gives better
          results.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;Enlarge a small image without losing quality&rdquo;
        </h4>
        <p>
          You can type numbers larger than the original, but be realistic:
          detail that was never captured cannot be restored, and a small picture
          blown up is a soft picture. When the goal is specifically to{' '}
          <strong>enlarge an image</strong>, use the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>
          , which is built for the upscaling case and adds a sharpening pass
          designed for it.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;Resize in centimetres, inches or 300 DPI for print&rdquo;
        </h4>
        <p>
          The boxes are pixels only, so convert first: multiply the physical size
          by the DPI you have been asked for. A 4 &times; 6 inch photo at 300 DPI
          is 1200 &times; 1800 pixels; a 3.5 &times; 4.5 cm passport picture at
          300 DPI is roughly 413 &times; 531. The output carries no embedded DPI
          tag and no original camera metadata, which is a quiet privacy benefit
          &mdash; location and camera details do not travel with the resized
          copy.
        </p>
        <p>
          Two smaller edges: the tool works on still images, so an animated GIF is
          not preserved as an animation, and anything that is not an image file
          is refused with a clear message rather than a silent failure. If your
          picture is trapped inside a document, pull it out first with the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF tool
          </Link>
          , and if it is the page rather than the picture that needs to change
          size, that is the{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF resize tool
          </Link>{' '}
          instead.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scaling className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Resizer
        </h3>
        <p>
          Plenty of sites will <strong>resize a picture online</strong>. Most of
          them make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough that you can check every line
          yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no seven-day countdown. The tool above is the whole product.'],
            ['No watermark on the output', 'The resized picture comes back clean. Nothing is stamped into a corner or added along an edge.'],
            ['Exact pixel control', 'Any width and height from 1 to 10000 pixels, with a ratio lock you can switch off when a specification demands two fixed numbers.'],
            ['Your images stay private', 'Files are never stored on our servers, never retained after your session, and never used to train or analyse anything.'],
            ['Three output formats', 'JPG, PNG or WebP from the same picture, with a quality slider for the two formats where quality is a real trade.'],
            ['No daily limit', 'Resize one image or forty. There is no counter running down and no tier above this one.'],
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
            free document and image tools
          </Link>{' '}
          built on the same terms, so a picture can be cropped, resized,
          compressed and dropped into a document without a payment screen
          appearing anywhere along the way.
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
              'How do I resize an image online for free without an account?',
              'Add your JPG, PNG or WebP to the tool at the top of this page, type the width and height you need or tap a preset, pick an output format and download. There is no sign-up and no watermark on the result. It is free every time, not free for the first three pictures.',
            ],
            [
              'How do I resize image dimensions without losing quality?',
              'Leave the aspect ratio locked so the picture is not stretched, and keep the quality slider at 90 or above. Making a picture smaller looks excellent because pixels are discarded rather than invented. Choose PNG for a genuinely lossless copy, at the cost of a larger file.',
            ],
            [
              'Can I resize an image to an exact width and height in pixels?',
              'Yes, anywhere from 1 to 10000 pixels. If the shape you are asking for does not match the original, switch off the ratio lock first and expect the picture to be squashed to fit. Cropping to the right shape before resizing avoids that.',
            ],
            [
              'How do I make an image smaller in KB for an upload form?',
              'Reduce the dimensions first, since that has the biggest effect, then lower the quality slider to around 70 and export as JPG or WebP. There is no box for a target size in kilobytes, so check the downloaded file and take another pass if needed.',
            ],
            [
              'What size should an image be for Instagram or YouTube?',
              'Presets cover the common ones: 1080 by 1080 for a square Instagram post, 1080 by 1920 for a Story, 1280 by 720 for a YouTube thumbnail and 1920 by 1080 for Full HD. Crop to the right shape first if your original is a different ratio.',
            ],
            [
              'Are my photos safe when I resize them here?',
              'Your images are not stored on our servers, not retained after your session, and never used for training or analytics. Nothing you resize is kept, queued or logged.',
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
          Working on the same picture? Use the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          to fix the shape before you set the size, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          when a picture needs to go up rather than down, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to turn document pages into pictures, or the{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG, WebP and TIFF converter
          </Link>{' '}
          when you need a different image format out of a document. If you would
          rather learn to make the artwork than only resize it, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers composition, formats and export settings from the beginning.
        </p>
      </div>
    </article>
  );
}
