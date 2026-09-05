import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Crop,
  Frame,
  HelpCircle,
  Layers,
  Ratio,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image Cropper tool.
 *
 * Same skeleton as PdfWordSeoArticle: one H2 beneath the page's H1, an
 * anchored table of contents, H3 sections with icons, a benefit grid, an FAQ
 * and a closing link block. Four decisions shaped the copy and they matter to
 * anyone editing it later.
 *
 * First, every claim traces back to ImageCropper.js. The tool takes one image
 * at a time, offers Free Form plus 1:1, 4:3, 16:9, 9:16 and 3:2, gives a move
 * drag and exactly two resize handles, refuses a selection smaller than five
 * percent of a side, shows a live pixel readout of the selection against the
 * original, and returns PNG for a PNG input or high-quality JPEG for
 * everything else, named "<original>-cropped.<ext>". Nothing beyond that is
 * promised anywhere below.
 *
 * Second, the quality language is scoped to the format. Only the PNG path is
 * pixel-for-pixel; every other input is re-encoded once as JPEG at quality
 * 0.95, so the article says "re-encoded once at high quality" and never
 * "lossless" or "never blurs". A JPG original takes a second generation and
 * the copy admits it, because a reader comparing files can measure this.
 *
 * Third, there are two resize handles, not four — top-left and bottom-right.
 * The other two corners belong to the move area. Every place the article used
 * to say "the corners" now names the two that actually resize, because a
 * reader who grabs the top-right corner finds out in one second.
 *
 * Fourth, the aspect presets are described as setting the frame rather than
 * locking it, because the code lets a handle move freely afterwards, and
 * several fat keywords name things this cropper genuinely cannot do: "crop
 * image to circle", "rotate and straighten a photo", "batch crop multiple
 * images", "crop image to an exact file size in KB", "crop and resize to exact
 * dimensions" and "crop a PDF". None are promised. Section 6 answers the
 * question behind each and points at the tool that actually handles it.
 *
 * Privacy is stated as an outcome only — files are not stored, not retained,
 * not used for training. How that happens is deliberately absent.
 */
export default function ImageCropperSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 13 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Crop an Image Online Free</span>: Aspect Ratios, Quality and Getting the Frame Right
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Almost every photograph contains a better photograph hiding inside it. A
        stranger walking through the left edge, a metre of empty ceiling, a
        profile picture that insists on being square when your shot is not. A
        good <strong>image cropper</strong> is the quickest fix in all of
        editing: you draw a rectangle around the part you want and the rest is
        gone. This guide covers how to <strong>crop a photo online</strong>{' '}
        properly &mdash; choosing an aspect ratio, keeping the picture sharp,
        framing it so it looks deliberate &mdash; and it is honest about the
        handful of jobs a <strong>free online image cropper</strong> should not
        pretend to do.
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
            src="/blog/image-cropper.webp"
            alt="Crop an image online free - interactive image cropper with a drag handle selection and 1:1, 4:3 and 16:9 aspect ratio presets"
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
              Drag a box around what matters, pick a ratio if you need one, and
              download the trimmed picture cut from the original at its full
              resolution.
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
            ['#what-cropping-does', '1. What Cropping Actually Does to a Picture'],
            ['#how-to-crop', '2. How to Crop an Image Online Free (Step-by-Step)'],
            ['#aspect-ratios', '3. Aspect Ratios: Square, 16:9, 9:16 and the Rest'],
            ['#quality-and-formats', '4. Cropping Without Losing Quality: JPG, PNG and Transparency'],
            ['#composition', '5. Framing: How to Crop a Photo So It Looks Deliberate'],
            ['#limits', '6. What This Cropper Will Not Do (and What To Use Instead)'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Image Cropper'],
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
      <section id="what-cropping-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crop className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Cropping Actually Does to a Picture
        </h3>
        <p>
          Cropping is subtraction. When you <strong>crop an image</strong>, you
          keep the rectangle you drew and discard every pixel outside it. The
          rectangle you keep is taken from the original at full resolution; a
          PNG comes back untouched, and everything else is saved as a
          high-quality JPEG, so it is re-encoded once at near-original quality.
          Nothing is stretched, squashed or scaled to fit a new size. That
          distinction &mdash; between removing pixels and rescaling them &mdash;
          explains most of what people find confusing about cropping, so it is
          worth sitting with for a moment.
        </p>
        <p>
          It explains, first, why <strong>cropping is not resizing</strong>.
          Resizing has to invent or throw away detail to reach a new dimension,
          and that is what genuinely softens a picture. Cropping does no such
          arithmetic: the part you keep stays at its original scale, one pixel
          of your file to one pixel of the result. It also explains the one real
          cost of cropping hard. Take a small corner out of a modest photo and
          nothing has been scaled, but what is left simply has far fewer pixels,
          so blown up on a large screen it will look soft. Crop from a big
          original wherever you can.
        </p>
        <p>
          The panel above tells you exactly where you stand while you drag. The{' '}
          <strong>Output Area</strong> readout shows the pixel dimensions of the
          picture you are about to download, and <strong>Original</strong> shows
          what you started with. If the first number is dropping below what you
          need for a banner or a print, you will see it happening rather than
          discovering it afterwards. The selection cannot be shrunk below five
          percent of a side, which stops an accidental drag from producing a
          twenty-pixel thumbnail nobody wanted.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-crop" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Crop an Image Online Free (Step-by-Step)
        </h3>
        <p>
          There is no account, no email and no trial countdown. To{' '}
          <strong>crop an image online free</strong> with the tool at the top of
          this page, three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your picture', 'Drop a JPG, PNG or WebP onto the panel, or click to browse and pick one. A crop box appears over the image straight away, set a comfortable distance in from every edge.'],
            ['Frame the shot', 'Drag inside the box to slide the frame around, and pull the round handle at the top-left or bottom-right to make it bigger or smaller. A rule-of-thirds grid sits inside the box to help you line things up.'],
            ['Download the result', 'Press Download Cropped Image. The trimmed picture saves as your original filename with "-cropped" on the end, ready to post, print or attach.'],
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
          One detail is worth knowing before you start pulling at the frame:
          there are two round handles, not four. They sit at the{' '}
          <strong>top-left and bottom-right</strong> corners, and between them
          they reach any rectangle you want, because either one changes both the
          width and the height. The other two corners belong to the move area,
          so grabbing the top-right or bottom-left slides the whole box instead
          of resizing it.
        </p>
        <p>
          The whole thing runs on touch as happily as it does with a mouse, so{' '}
          <strong>cropping a picture on your phone</strong> works the same way
          and needs nothing installed from an app store. Changed your mind about
          the file? <strong>Change Image</strong> in the settings panel clears
          it and hands you a fresh picker. Nothing is watermarked, nothing is
          capped at three images a day, and there is no queue to sit in.
        </p>
      </section>

      {/* 3 */}
      <section id="aspect-ratios" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ratio className="w-6 h-6 text-orange-500 shrink-0" />
          3. Aspect Ratios: Square, 16:9, 9:16 and the Rest
        </h3>
        <p>
          Most of the time people are not really searching for a cropper. They
          are searching for a shape &mdash; a square avatar, a wide header, a
          tall story frame &mdash; because something has told them their picture
          is the wrong one. The tool gives you six choices, five fixed shapes
          plus <strong>Free Form</strong> for when nothing is dictating terms.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['1:1 Square', 'Profile pictures, avatars and grid thumbnails. This is the setting behind every "how to make an image square" search, and it is one click.'],
            ['16:9 Widescreen', 'Video thumbnails, presentation slides, website hero images and anything destined for a television-shaped frame.'],
            ['9:16 Story or Reel', 'The full-height vertical frame used by stories, reels and shorts. Turns a landscape photo into a portrait one by choosing which slice survives.'],
            ['4:3 Photo', 'The classic compact-camera and tablet shape. Safe, familiar, and what most photo print sizes were built around.'],
            ['3:2 Standard', 'The proportion of 35mm film and most DSLR sensors, which is also why 6x4 prints fit it without trimming.'],
            ['Free Form', 'No shape imposed at all. Drag the top-left or bottom-right handle wherever the picture wants it — best for trimming a distraction off one edge.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Frame className="w-4 h-4 text-orange-500 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          One honest note about how the presets behave
        </h4>
        <p>
          Picking a ratio reshapes the crop box to that proportion in real image
          pixels, so a 1:1 selection genuinely produces a square file rather than
          a square-looking box over a rectangular picture. What it does not do is
          weld the handles shut afterwards. Drag one and you are back to free
          form. The workflow that avoids surprises is simple: size the box
          roughly first, then apply the ratio, then move the box into position
          with the inside drag rather than the two handles. If you do resize
          afterwards and want the shape back, tap the preset once more and check
          the <strong>Output Area</strong> figures agree with the ratio you asked
          for.
        </p>
      </section>

      {/* 4 */}
      <section id="quality-and-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          4. Cropping Without Losing Quality: JPG, PNG and Transparency
        </h3>
        <p>
          &ldquo;<strong>Crop image without losing quality</strong>&rdquo; is one
          of the most searched phrases in this category, and the honest answer
          comes in two halves. The first half is the reassuring one: your crop is
          taken from the original picture at its full resolution, not from the
          shrunken preview you were dragging over. Select half of a
          4000-pixel-wide photo and you get a file at the full 2000-pixel width,
          re-saved at high quality. Nothing is downscaled on the way out.
        </p>
        <p>
          The second half is the part most tools skip: what happens on the way
          out depends entirely on the format you arrived with. Here is the whole
          rule.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Put a PNG in
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>You get a PNG back</li>
              <li>Transparent areas stay transparent</li>
              <li>Flat colour, logos and screenshots stay crisp</li>
              <li>No new compression artefacts introduced</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> Put anything else in
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>JPG, WebP, BMP and GIF all come back as high-quality JPG</li>
              <li>Re-encoded once at near-original quality &mdash; a JPG original therefore takes a second generation, at a level you will not see at normal viewing size</li>
              <li>Perfect for photographs, which is what JPG was designed for</li>
              <li>Transparency is not carried into a JPG &mdash; start from PNG if you need it</li>
              <li>An animated GIF returns a single still frame, not an animation</li>
            </ul>
          </div>
        </div>
        <p>
          That second generation sounds worse than it is. JPG is a lossy format
          by design, and every save writes a slightly different approximation of
          the same picture; at the quality level used here, finding the
          difference means flicking between two files at heavy magnification,
          not looking at a post. The rule that follows is about repetition
          rather than panic: <strong>always crop from the original</strong>, not
          from yesterday&rsquo;s crop of it. One generation is invisible. Six,
          stacked, are not.
        </p>
        <p>
          If you are cropping a logo, an icon or a screenshot with a see-through
          background, keep it as a PNG on the way in. Transparency is written
          into the format itself as an alpha channel, described in the{' '}
          <a
            href="https://www.w3.org/TR/png-3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>
          , and a JPG has no equivalent to hold it in. This is the answer to{' '}
          <strong>crop PNG keep transparent background</strong>: the format you
          arrive with decides the format you leave with, and the PNG route is
          the one that comes back pixel-for-pixel.
        </p>
        <p>
          One useful side effect worth knowing about: the cropped file comes out
          clean of the original&rsquo;s embedded camera metadata, so the location
          tag, device model and timestamp your phone quietly wrote into the photo
          do not travel with the version you post. If your cropped photograph
          then needs to be smaller on disk for an upload limit, run it through
          the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          afterwards rather than cropping harder than the picture deserves.
        </p>
      </section>

      {/* 5 */}
      <section id="composition" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Frame className="w-6 h-6 text-orange-500 shrink-0" />
          5. Framing: How to Crop a Photo So It Looks Deliberate
        </h3>
        <p>
          Anyone can cut the edges off a picture. The difference between a crop
          that helps and a crop that looks accidental is where you put what is
          left, and there are four habits that do most of the work.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Use the grid inside the box
        </h4>
        <p>
          The faint nine-square grid drawn inside the crop frame is the{' '}
          <strong>rule of thirds</strong>. Put your subject on one of the two
          vertical lines rather than dead centre, and put a horizon on the top or
          bottom line rather than slicing the frame in half. It is a guideline
          rather than a law, but a centred subject with a horizon through its
          middle is the single most common reason a snapshot feels flat.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Cut the dead space, not the story
        </h4>
        <p>
          Most photographs that need <strong>trimming the edges off</strong> have
          the same problem: too much sky, too much floor, or a stranger at the
          margin. Take those out. Do not keep going until the subject is jammed
          against the frame, though &mdash; a person needs a little room in the
          direction they are facing or the picture feels claustrophobic.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Crop for the place it is going
        </h4>
        <p>
          A picture that will be displayed as a circular avatar should be
          <strong> cropped square with the face slightly high</strong>, because
          the corners will be cut away by the site that shows it. A header image
          gets cropped wide and forgiving in the middle, since narrow screens
          crop the sides again on their own. Decide the destination before you
          decide the rectangle.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Never crop the only copy
        </h4>
        <p>
          The download arrives as a new file &mdash; your original name with{' '}
          <em>-cropped</em> on the end, and a .png or .jpg extension depending on
          what you put in &mdash; so your untouched picture stays where it was.
          Keep it: you can always crop the full-size original again, but you can
          never put back pixels you threw away two crops ago.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Cropper Will Not Do (and What To Use Instead)
        </h3>
        <p>
          This is a rectangular cropper for one picture at a time, and it is
          better to say so plainly than to let you discover it after you have
          added your picture. Here are the jobs people arrive looking for that
          belong somewhere else.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Crop an image to a circle or a shape.</strong> Selections here
            are rectangles. Round avatars are almost always produced by the site
            displaying them, which masks a square picture into a circle, so a 1:1
            crop is the correct thing to upload.
          </li>
          <li>
            <strong>Rotate or straighten a crooked photo.</strong> There is no
            rotation control, so a tilted horizon stays tilted. Straighten it in
            a photo editor first, then crop the result here.
          </li>
          <li>
            <strong>Batch crop multiple images at once.</strong> One picture at a
            time, deliberately &mdash; a single rectangle applied blindly across
            twenty different photographs beheads about half of them.
          </li>
          <li>
            <strong>Crop to an exact file size in KB.</strong> Cropping shrinks a
            file as a side effect, never to a target. Crop for composition here,
            then hit a size target with the{' '}
            <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PNG and JPG compressor
            </Link>
            .
          </li>
          <li>
            <strong>Crop and resize to exact pixel dimensions.</strong> You choose
            a region, not an output size. If a form demands exactly 800&times;600,
            crop to the right shape here and then set the numbers in the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            . If the crop left you with fewer pixels than you need, the{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>{' '}
            can scale it back up.
          </li>
          <li>
            <strong>Crop a PDF page.</strong> A document is not an image. Trim
            margins with the{' '}
            <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF crop tool
            </Link>
            , or pull pictures out of a document with{' '}
            <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract images from PDF
            </Link>{' '}
            and crop them here.
          </li>
        </ul>
        <p>
          Three messages are worth recognising if one appears. &ldquo;Please
          select an image file (JPG, PNG, WebP)&rdquo; means the file you chose is
          not a picture at all &mdash; usually a PDF or a document that needs one
          of the tools above. &ldquo;Failed to open image&rdquo; means the file is
          a picture in name but cannot be displayed, which most often happens with
          an iPhone HEIC shot that has not been exported as JPG, or with a file
          that was damaged in transfer. &ldquo;Failed to crop image&rdquo; is the
          rarest of the three and usually means the picture is larger than the
          device you are working on can handle in one piece; scale it down with
          the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          and crop the smaller copy.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Cropper
        </h3>
        <p>
          Plenty of sites will <strong>crop a picture online</strong>. Most make
          it quietly annoying until you pay for the version that does not. Here
          is the difference, stated plainly enough that you can check every line
          yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no trial attached', 'No account, no email address, no card and no seven-day countdown. What you are using is the entire product.'],
            ['No watermark on your picture', 'The cropped image comes out clean. Nothing is stamped in a corner and nothing is added along an edge.'],
            ['Cut from the full-size original', 'The crop is taken from your picture at its native size rather than from the preview you dragged over, so nothing is scaled down on the way out.'],
            ['Your images stay private', 'Files are never stored on our servers, never retained after your visit, and never used to train or analyse anything.'],
            ['No daily limit and no file size limit imposed', 'Crop one photo or fifty. There is no counter ticking down and no tier above this one. Very large images are limited only by what your device can handle.'],
            ['An honest account of the limits', 'We tell you what the tool does not do before you spend time on it, rather than after you have spent time on it.'],
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
          built on the same terms, so once a picture is the right shape you can
          carry straight on to{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            resizing
          </Link>{' '}
          it or sampling a{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour out of it
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
              'How do I crop an image online free without signing up?',
              'Open the cropper at the top of this page, add your picture, drag the box around the part you want to keep, and press download. There is no account step, no email verification and no watermark on the result. It is free every time, not free for the first few images.',
            ],
            [
              'Does cropping reduce the quality of my photo?',
              'Barely. The crop is taken at full original resolution and a PNG is returned pixel-for-pixel; other formats are saved as a high-quality JPG, which re-compresses the image once at a level that is not visible at normal viewing size. The bigger change is dimensions: crop away most of a picture and what is left has far fewer pixels, so it will look soft if you then blow it up on a large screen.',
            ],
            [
              'How do I resize the crop box?',
              'With the two round handles, at the top-left and the bottom-right corners of the box. Dragging either one moves that corner and reshapes the whole rectangle; dragging anywhere else inside the box, including the other two corners, slides the frame without changing its size.',
            ],
            [
              'How do I make an image square for a profile picture?',
              'Choose the 1:1 Square preset, slide the box so the face sits slightly above centre, and download. Sites that show round avatars mask a square image into a circle themselves, so a square crop is exactly what you should be uploading.',
            ],
            [
              'What file types can I crop, and what do I get back?',
              'JPG, PNG, WebP, BMP and GIF all work. A PNG comes back as a PNG with its transparency intact; every other format comes back as a high-quality JPG, which is the right choice for photographs. That means the file extension can change — a .webp goes in and a .jpg comes out. An animated GIF returns a single still frame.',
            ],
            [
              'Can I crop several pictures at the same time?',
              'Not here. The tool works on one image at a time, because a single rectangle applied across a batch of different photographs usually ruins most of them. Crop them individually and each one gets the frame it actually needs.',
            ],
            [
              'Are my pictures safe when I crop them?',
              'Your files are never stored on our servers, never kept after your session, and never used for training or analytics. The cropped copy that downloads also arrives without the original camera metadata, so the location and device details your phone recorded do not travel with the version you share.',
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
          Need something else from the same picture? The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          sets exact dimensions, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          rescues a shot that came out too small, the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          gets it under an upload limit, and the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code generator
          </Link>{' '}
          turns a link into something scannable. If you would rather learn to
          frame and finish images properly than fix them one at a time, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers composition, cropping and export settings from the beginning.
        </p>
      </div>
    </article>
  );
}
