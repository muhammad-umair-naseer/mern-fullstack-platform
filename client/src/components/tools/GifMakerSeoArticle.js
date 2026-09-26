import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Film,
  HelpCircle,
  Images,
  Layers,
  Palette,
  Scaling,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the GIF Maker tool.
 *
 * Written against what GifMaker.js actually does, which rules several of the
 * obvious keywords out. The tool takes still images only — no video, no URL,
 * no screen recording — so "gif maker" and "animated gif maker" are used as
 * vocabulary but the article never chases the video-first reading of them,
 * and the MP4 question is routed to the video to GIF converter instead.
 *
 * It also adds no text, stickers or effects, and it does not trim, reverse or
 * re-time an existing animated GIF (a GIF dropped in contributes its first
 * frame only). Neither is promised. "Rotating gif" for product listings is
 * framed honestly as photos shot from several angles played as frames, not a
 * 360 spin effect. "Unlimited" is stated as "no imposed cap" rather than a
 * guarantee, because very large sets of very large images take longer.
 *
 * Two things the code does that the article leans on: frames are appended in
 * the order they finish loading rather than the order they were picked, so
 * section 2 tells the reader to check the numbering and use the arrows; and
 * the letterbox background is fixed black with no transparency in the output,
 * which section 3 says plainly so nobody expects a transparent GIF.
 *
 * The angle is the three settings that decide bytes and look — dimensions,
 * Max Colors, frame delay — because competitors show a speed slider and a
 * button and never say which knob to turn when the file comes out at 8 MB.
 */
export default function GifMakerSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">GIF Maker from Images</span>: How to Turn Photos Into One Animated GIF
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A folder of screenshots, a burst of phone photos, a numbered set of
        exported frames &mdash; and you want one file that plays them in order.
        That is the whole job of a <strong>GIF maker from images</strong>. Most
        tools give you a speed slider and a button and leave you to guess why
        the result is eight megabytes or why the subject jumps around between
        frames. This guide is about the three settings that actually decide how
        an <strong>animated GIF</strong> built from stills comes out: canvas
        size, colour count and frame delay. Along the way it covers how to{' '}
        <strong>turn photos into a GIF</strong> that plays once, stays small and
        does not shift every frame.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/gif-maker.webp"
            alt="Vintage photobooth strips fanned out beside an old twin-lens camera"
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
              Any number of still images in, one animated GIF out &mdash; with
              the order, timing, fit and palette under your control.
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
            ['#what-it-builds', '1. What a GIF Maker from Images Actually Builds'],
            ['#how-to-make', '2. How to Make a GIF from Pictures (Step-by-Step)'],
            ['#fit-modes', '3. Letterbox vs Crop vs Stretch: Frames That Jump Around'],
            ['#file-size', '4. Why the GIF Is Too Big, and Which Setting to Change'],
            ['#timing-and-loop', '5. Frame Delay and Looping: Too Fast, Too Slow, Play Once'],
            ['#common-jobs', '6. The Jobs People Actually Use This For'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free GIF Maker'],
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
      <section id="what-it-builds" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a GIF Maker from Images Actually Builds
        </h3>
        <p>
          An animated GIF is a stack of still pictures with a timing note
          attached to each one: show this frame, wait this long, show the next.
          That is all the format has ever been. The{' '}
          <a
            href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GIF89a specification
          </a>{' '}
          dates from 1990 and it is still what every messaging app, README and
          product page plays today. A <strong>GIF maker</strong> that starts
          from still images draws each picture onto a canvas of a fixed size,
          reduces its colours to a palette, and writes them out one after
          another with a delay between them.
        </p>
        <p>
          Three properties of the format explain nearly every question people
          bring to an <strong>animated GIF maker</strong> or an{' '}
          <strong>images to GIF</strong> converter, so they are worth stating
          before the steps:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Every frame is the same size.</strong> A GIF has one canvas.
            If your photos are different shapes, something has to decide how
            each one fits, and that decision is why subjects appear to jump
            around. Section 3 is about it.
          </li>
          <li>
            <strong>Each frame holds at most 256 colours.</strong> A photograph
            has millions. Reducing them is where grain and banding come from,
            and where a large share of the file size goes. Section 4 covers the
            trade-off.
          </li>
          <li>
            <strong>Timing is stored per frame in hundredths of a second.</strong>{' '}
            The tool above takes a delay in milliseconds and applies it to every
            frame, which is how you make the result slower, faster or
            stop-motion-like. Section 5 explains the numbers.
          </li>
        </ul>
        <p>
          One boundary to set early: this tool builds from <strong>images</strong>.
          JPG, PNG, WebP, BMP and SVG all go in; a still GIF goes in as one
          frame. If what you have is a video clip rather than pictures, the{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF converter
          </Link>{' '}
          is the right tool, and if you already have a GIF that is too large, the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          shrinks it without rebuilding.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-make" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Make a GIF from Pictures (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark on the result. Here is{' '}
          <strong>how to make a GIF from pictures</strong> with the tool above,
          from a folder of files to a download:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your images', 'Drag them onto the panel or use Add Images. Select as many as you like in one go — JPG, PNG, WebP, BMP and SVG are all accepted, and you can keep adding more afterwards.'],
            ['Check the order', 'Each image becomes a numbered thumbnail. Frames appear in the order they finish loading, not always the order you picked them, so glance at the numbers and use the left and right arrows to fix any that landed out of place.'],
            ['Set the properties and generate', 'Dimensions, frame delay, image fit, colour count and the loop checkbox sit in one panel. Press Generate, watch the percentage climb, preview the result, and download animated.gif.'],
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
          The first image you add sets the canvas: its width and height are
          copied into the Dimensions boxes. Everything after it is fitted to
          that canvas, so if you are combining a landscape shot with a set of
          portraits, add the one whose shape you want the GIF to have first, or
          simply type the dimensions you want.
        </p>
        <p>
          The preview is a real, playing GIF, so if the speed or the fit is wrong
          you see it before you download anything. Change the setting and press
          Generate again. That loop of adjust, generate, look is the fastest way
          to <strong>combine images into one animated image</strong> that looks
          the way you pictured it.
        </p>
      </section>

      {/* 3 */}
      <section id="fit-modes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scaling className="w-6 h-6 text-orange-500 shrink-0" />
          3. Letterbox vs Crop vs Stretch: Why GIF Frames Jump Around at Different Sizes
        </h3>
        <p>
          The most common complaint about a GIF built from photos is that the{' '}
          <strong>frames jump around</strong>: the subject sits centred in one
          frame, shifts left in the next, shrinks in the third. That is what
          happens when images of different shapes are forced onto one canvas
          without a rule for how. Image Fit is that rule, and the{' '}
          <strong>letterbox vs crop vs stretch</strong> choice matters because
          each one fails in a different way.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Contain (Letterbox)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Scales each image down until the whole of it fits, centres it, and
              fills the leftover space with black bars. Nothing is cut off. The
              default, and the safe choice for screenshots and diagrams where
              every edge matters.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Cover (Crop)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Scales each image up until it fills the canvas completely, then
              trims whatever overflows the edges, keeping the centre. No bars,
              no distortion, but a tall photo on a wide canvas loses its top and
              bottom. Best for photographs with the subject in the middle.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Stretch to Fit
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Forces every image to exactly the canvas size regardless of its
              shape. No bars and nothing cropped, but anything that is not
              already the right proportion is squashed or pulled. Only sensible
              when every frame already shares the canvas ratio.
            </p>
          </div>
        </div>
        <p>
          The practical rule: if all your images are the same shape, it does not
          matter which mode you pick. If they are not, decide whether you would
          rather lose the edges (Cover) or see bars (Contain), and never pick
          Stretch for a mix. Cover always keeps the centre &mdash; there is no
          option to favour the top or the left &mdash; so if the subject sits
          off-centre, run the photos through the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          first and bring them all to one shape before you build.
        </p>
        <p>
          Two things to know about the background. The letterbox bars are always
          black; there is no colour picker for them. And the output has{' '}
          <strong>no transparency</strong>: a PNG with a transparent background
          comes out with that area black, in every fit mode. If you need a
          transparent GIF or a coloured backdrop, flatten your PNGs onto the
          colour you want before adding them.
        </p>
      </section>

      {/* 4 */}
      <section id="file-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          4. GIF From Images Too Big? Which Setting to Change
        </h3>
        <p>
          A GIF made from a dozen phone photos at full size can easily be larger
          than the photos were put together, because GIF compression is weak
          compared with JPG and every frame is stored in full. When the{' '}
          <strong>GIF from images is too big</strong>, three levers decide the
          file size, and they are worth pulling in this order.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Dimensions first
        </h4>
        <p>
          Bytes scale with pixels per frame times the number of frames. Because
          the first image sets the canvas, a 4,000-pixel-wide photo produces a
          4,000-pixel-wide GIF, which nobody needs. Halving both dimensions cuts
          the pixel count to a quarter. For chat and social use, 480 to 640
          pixels wide is plenty; for a README demo, 800 is generous. There is no
          aspect lock, so type the width you want and scale the height to match.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Max Colors second: 256 vs 128 vs 64
        </h4>
        <p>
          Every frame gets its own palette, built from that frame&rsquo;s actual
          colours, at the count you choose. The{' '}
          <strong>256 colours vs 128</strong> question is a genuine trade-off:
          256 is the most the format allows and gives the smoothest gradients;
          128 is noticeably smaller and, for screenshots, flat graphics and most
          photos viewed at chat size, hard to tell apart; 64 is the compact
          option for illustrations, interface captures and anything with a
          limited palette. If a <strong>GIF from photos looks grainy</strong>,
          you have the reverse problem: the palette is too small for a
          photograph&rsquo;s gradients, and the fix is to go back up to 256.
          Skies, skin and shadows are where the banding shows first.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Frame count last
        </h4>
        <p>
          Every frame costs the same again. A thirty-frame burst with a run of
          near-identical frames can lose half of them and still read as the same
          motion; use the remove button on the ones that add nothing. If the
          file is still too large after all three, the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          takes the output and squeezes it further, which is the right order:
          build it well, then compress it.
        </p>
      </section>

      {/* 5 */}
      <section id="timing-and-loop" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-orange-500 shrink-0" />
          5. Frame Delay and Looping: Too Fast, Too Slow, Play Once
        </h3>
        <p>
          Frame Delay is the gap between one frame and the next, in{' '}
          <strong>milliseconds</strong>, and it applies to every frame in the
          animation. The default of 250 ms shows four frames a second, which
          suits a slideshow of photos. When the <strong>GIF is too fast</strong>{' '}
          and you want to <strong>slow down the frames</strong>, raise the
          number: 500 ms gives each picture half a second, 1000 ms a full
          second, which is what a before-and-after flip or a step-by-step
          walkthrough usually wants. When it drags, lower it: 100 ms is ten
          frames a second and starts to read as motion rather than a sequence.
        </p>
        <p>
          The lowest delay the tool will write is 20 ms; anything smaller is
          treated as 20, because faster timings are not honoured consistently by
          the things that display GIFs. The delay is one value for the whole
          file &mdash; there is no way to hold frame one longer than frame two.
          If a title card needs to sit on screen, add the same image two or
          three times in a row; the duplicates cost bytes but do what a longer
          delay would.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Stop motion from photos
        </h4>
        <p>
          For a <strong>stop motion GIF from photos</strong>, the classic look
          sits between 80 and 150 ms per frame. Shoot from a fixed position so
          the background stays still, keep the images the same shape so the fit
          mode has nothing to decide, and set the canvas to a modest width so a
          forty-frame sequence stays shareable.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Loop forever, or play once
        </h4>
        <p>
          By default the checkbox is on and the animation repeats without end,
          which is what a reaction GIF or a product listing wants. Untick it to{' '}
          <strong>make the GIF play only once</strong> and stop on its final
          frame &mdash; right for an email signature, a slide, or a
          before-and-after where the after should stay on screen. There is no
          &ldquo;repeat three times&rdquo; setting; it is forever or once, and
          it is written into the file at creation, so no separate tool is needed
          afterwards to stop the loop.
        </p>
      </section>

      {/* 6 */}
      <section id="common-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Images className="w-6 h-6 text-orange-500 shrink-0" />
          6. The Jobs People Actually Use This For
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A demo GIF from screenshots.</strong> Capture each step of a
            feature, add them in order, set 800 to 1200 ms so each state is
            readable, and you have a walkthrough that plays inline in a README,
            a ticket or a support reply. To{' '}
            <strong>make a GIF from screenshots</strong> that stays crisp, use
            Contain and keep the canvas at the screenshots&rsquo; own size.
          </li>
          <li>
            <strong>Converting a PNG sequence to GIF.</strong> Animators and
            motion designers export numbered frames. Add them all, confirm the
            numbering in the strip matches your file numbering (fix any that
            loaded out of turn with the arrows), and set the delay to match
            your intended frame rate: 40 ms for 25 frames a second, 33 ms for
            30 &mdash; well above the 20 ms floor.
          </li>
          <li>
            <strong>JPG to animated GIF.</strong> The everyday case: a handful of
            phone photos into one file for a group chat. Use Cover so there are
            no bars, 128 colours, and a width of 480 to 640.
          </li>
          <li>
            <strong>WebP to animated GIF from multiple images.</strong> Many
            export pipelines now produce WebP, and a lot of GIF tools quietly
            refuse it. This one accepts WebP alongside JPG and PNG, so there is
            no need to convert first. If you do have a format that will not
            load, the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>{' '}
            turns it into PNG in one step.
          </li>
          <li>
            <strong>Product photos to a rotating GIF for a listing.</strong>{' '}
            Shoot the item from six or eight angles, add them in order, and play
            them at 300 to 500 ms with the loop on. To be clear: this is your
            photos played as frames, not a generated 360 spin, so the more
            evenly you shot the turn, the smoother it looks.
          </li>
          <li>
            <strong>A before-and-after GIF from two images.</strong> Two frames,
            same crop, 1000 ms delay, loop on for a social post or loop off for
            a report where the after should stay. Crop both to the same shape
            first so nothing shifts between them.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free GIF Maker
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no watermark', 'A free GIF maker with no watermark means exactly that: nothing is stamped on the corner of the result, and there is no paid tier holding a clean version back.'],
            ['No sign-up, without ads', 'An online GIF maker with no sign-up and without ads, pop-ups or ad walls between you and the download button. Open the page, add images, generate.'],
            ['No imposed limits', 'If you are searching for a free GIF maker with unlimited frames, the honest version is: no frame cap, no file-size cap, no daily quota. A very large set of very large images simply takes longer to build, so trim the dimensions first.'],
            ['Real settings, not a vague slider', 'Exact pixel dimensions, a delay in milliseconds, three named fit modes, three palette sizes and a loop toggle, so you can tune the result to the job instead of guessing.'],
            ['Your images stay private', 'Nothing you add is stored on our servers, retained after your session, or used for training or analytics.'],
            ['See it before you download', 'The generated GIF plays in a preview with its dimensions and file size shown, so a wrong setting costs you a second run rather than a download.'],
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
            free image and media tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            resize
          </Link>{' '}
          the source photos,{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress
          </Link>{' '}
          them, or{' '}
          <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert WebP to PNG
          </Link>{' '}
          before you build, without paying for any of it.
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
              'How do I use a GIF maker from images without signing up or paying?',
              'Add your pictures to the panel at the top of this page, check the frame order, set the delay and dimensions if you want to, press Generate and download animated.gif. There is no account, no email step, no watermark and no trial that runs out.',
            ],
            [
              'Why do my GIF frames jump around when the images are different sizes?',
              'Because a GIF has one canvas and your images have several shapes, so each one is fitted differently. Pick Cover to fill the canvas and crop the edges, or Contain to keep every image whole with black bars, and avoid Stretch unless every image already has the same proportions. Cropping all the photos to one shape before adding them removes the problem entirely.',
            ],
            [
              'My GIF from images is too big. Which setting should I change?',
              'Dimensions first: the first image sets the canvas, so a full-size photo makes a full-size GIF. Type a width of 480 to 800 and scale the height to match. Then drop Max Colors from 256 to 128. Then remove frames that are nearly identical to their neighbours. If it is still too large, run the result through our GIF compressor.',
            ],
            [
              'Why does my GIF from photos look grainy or banded?',
              'A GIF frame can hold at most 256 colours and a photograph has millions, so gradients like skies and skin get stepped. Set Max Colors to 256 for photographs; 128 and 64 are for screenshots, illustrations and flat graphics where the smaller palette is not visible.',
            ],
            [
              'How do I make a GIF play only once instead of looping?',
              'Untick Loop Animation Forever before you press Generate. The GIF then plays through its frames one time and stops on the last one. The setting is written into the file itself, so it behaves the same wherever it is opened. There is no option for a specific number of repeats — it is forever or once.',
            ],
            [
              'My GIF is too fast. How do I slow down the frames?',
              'Raise the Frame Delay. It is in milliseconds and applies to every frame: 250 is four frames a second, 500 is two, 1000 holds each picture for a full second. The lowest value the tool writes is 20 ms. The delay is the same for all frames, so to hold one frame longer, add that image to the sequence more than once.',
            ],
            [
              'Can I make a GIF from a video or a YouTube link with this tool?',
              'No. This tool builds from still image files — JPG, PNG, WebP, BMP and SVG. For a video clip, use our MP4 to GIF converter instead. It also does not add captions, stickers or effects, and it does not edit an existing animated GIF: a GIF you add contributes its first frame only.',
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
          Working with moving pictures more generally? The{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF converter
          </Link>{' '}
          starts from a clip instead of stills, the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          shrinks what you have just built, and the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          is the answer when a GIF is the wrong format for the length of clip
          you have. If you would rather understand palettes, frame timing and
          image formats than simply use them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers colour, resolution and compression from the beginning.
        </p>
      </div>
    </article>
  );
}
