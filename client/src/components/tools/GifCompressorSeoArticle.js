import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Film,
  Gauge,
  HelpCircle,
  Layers,
  Scaling,
  Shrink,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the GIF Compressor tool.
 *
 * Written against what GifCompressor.js actually does. The tool has exactly
 * four controls — scale (20–100%, default 80%), palette colours (8–256 per
 * frame, default 128), frame dropping (keep all / 1 in 2 / 1 in 3 / 1 in 4)
 * and playback speed (0.75x–2x) — all applied in one re-encode. The article is
 * built around what each of those does to the byte count and the order to pull
 * them in, because that is the thing competing pages leave out.
 *
 * The genuinely distinctive behaviour is in planFrames(): when frames are
 * dropped, their delays are summed onto the preceding kept frame, so the loop
 * keeps its length and only gets choppier. Section 4 is about that, and about
 * the speed multiplier being applied in the same pass with a 20 ms floor.
 *
 * Two things the code cannot do are said plainly rather than hidden: every
 * frame is flattened onto an opaque black background (transparent stickers
 * come out with a black backdrop), and there is no target-size or lossy-level
 * mode, so the "256 KB emoji" and "under the Discord cap" readers get an
 * honest iterate-and-read-the-size workflow instead of a promise. The keyword
 * that describes where the processing runs ("... based gif compressor") is
 * declined outright, because the implementation is not described anywhere in
 * house copy. "Compress gif without losing quality" is served with the caveat
 * that the default run is lossy on two axes and scale must go to 100% first.
 * "GIF loads slowly on website" is answered by routing to the video compressor,
 * since this tool does not convert formats.
 */
export default function GifCompressorSeoArticle() {
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
        How to Use a <span className="text-orange-600 dark:text-orange-400">GIF Compressor</span> Without Wrecking the Animation
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An animated GIF is one of the least efficient ways to store moving
        pictures, which is why a five-second screen recording can weigh more than
        the video it was captured from. When a chat app or a website rejects the
        file, a <strong>GIF compressor</strong> is the fix, but most tools hide
        what they are doing behind a single quality slider. This one gives you
        four separate controls and shows the result beside the original before
        you download. This guide explains what each control does to the byte
        count, the order to pull them in to <strong>compress a GIF</strong> with
        the least visible damage, and the two things the tool will not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/gif-compressor.webp"
            alt="A woman at a cafe table laughing at something playing on her phone"
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
              Four levers, one re-encode: scale, palette colours, frame dropping
              and playback speed, with the original and the result side by side.
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
            ['#why-so-big', '1. Why Is My GIF So Big?'],
            ['#how-to-compress', '2. How to Compress a GIF Online Free'],
            ['#four-controls', '3. The Four Controls and What Each Does to Bytes'],
            ['#keeps-length', '4. Dropping Frames Without Shortening the Loop'],
            ['#without-losing-quality', '5. Compressing a GIF Without Losing Quality'],
            ['#platform-limits', '6. Getting Under a Platform Limit'],
            ['#cannot-do', '7. What This Tool Does Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free GIF Compressor'],
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
      <section id="why-so-big" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Is My GIF So Big?
        </h3>
        <p>
          GIF is old. The version still in use is defined by the{' '}
          <a
            href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GIF89a specification
          </a>{' '}
          from 1989, and nothing about it was designed with video in mind. Three
          properties of the format explain almost every oversized file:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Every frame is a whole picture.</strong> GIF has no idea of
            motion. A recording at thirty frames per second stores thirty
            pictures for every second of animation. Frame count is the first
            multiplier.
          </li>
          <li>
            <strong>Pixels multiply, not add.</strong> Doubling both width and
            height quadruples the pixels in every one of those frames. A capture
            at full monitor resolution carries several times the pixels of the
            same clip scaled to fit a chat window.
          </li>
          <li>
            <strong>At most 256 colours, compressed by repetition.</strong> Each
            frame is limited to 256 colours and packed with a dictionary-style
            compression that rewards repeated runs of the same value. Gradients
            and photographic footage have little repetition, so there is little
            to squeeze.
          </li>
        </ul>
        <p>
          So when someone asks <strong>why is my GIF so big</strong>, the answer
          is nearly always too many frames, too many pixels per frame, or content
          the format was never meant to hold. Those are the three things the
          controls below act on, and it is why a <strong>GIF optimizer</strong>{' '}
          with a single quality number cannot tell you which one is the culprit.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress a GIF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark. To{' '}
          <strong>compress a GIF online free</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in the GIF', 'One animated GIF at a time. The tool decodes it and reports the frame count and pixel dimensions next to the original size, so you know what you are working with before you touch a slider.'],
            ['Set the four controls', 'Scale starts at 80% and palette colours at 128; frame dropping and playback speed start at keep-all and 1x. Section 3 explains what each one costs and saves.'],
            ['Compress, compare, download', 'The result appears beside the original with both sizes and a status line stating the percentage saved. The download is named after your file with _compressed added.'],
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
          The settings stay live after a run. If the result is too soft or too
          choppy, move one control and press Compress again without selecting
          the file a second time. That loop of adjust, compress, compare is the
          whole technique behind <strong>how to make a GIF smaller</strong>{' '}
          without guessing, and a progress percentage keeps you informed while a
          long GIF works through.
        </p>
      </section>

      {/* 3 */}
      <section id="four-controls" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Four Controls and What Each One Does to Bytes
        </h3>
        <p>
          Each control attacks a different multiplier from section 1, and one
          of them does not reduce bytes at all.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Scaling className="w-4 h-4 text-orange-500 shrink-0" />
              Scale Resolution (20% to 100%)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Shrinks width and height by a percentage. Because pixels multiply,
              the saving is bigger than the number suggests: 80% keeps roughly
              two thirds of the pixels, 50% keeps a quarter. This is the
              strongest lever by a wide margin, and the cost is softness rather
              than missing motion or wrong colours.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-orange-500 shrink-0" />
              Palette Colours (8 to 256)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Sets the maximum colours per frame in steps of eight. Every frame
              gets its own palette fitted to its own content. This is{' '}
              <strong>how to reduce colours in a GIF</strong>: interface
              captures often survive 64 without visible change; photographs and
              gradients start banding sooner.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-500 shrink-0" />
              Frame Dropping (keep all, 1 in 2, 1 in 3, 1 in 4)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Keeps every frame, every second, every third or every fourth. This
              is the control people mean when they search{' '}
              <strong>reduce GIF frame rate online</strong>. Halving the frames
              roughly halves the picture data, but it is also the first thing a
              viewer notices, which is why it comes last.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500 shrink-0" />
              Playback Speed (0.75x to 2x)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Divides every frame&rsquo;s display time by the multiplier, with a
              floor of 20 milliseconds because very short delays are ignored by
              most viewers. This changes timing only. It does not remove a
              single byte.
            </p>
          </div>
        </div>
        <p>
          The recommended order is scale first, colours second, frames last.
          Scale removes the most data for the least visible damage, colour
          reduction is often invisible on interface recordings, and frame
          dropping is the one to reach for only when the first two have not got
          you under the limit.
        </p>
      </section>

      {/* 4 */}
      <section id="keeps-length" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-orange-500 shrink-0" />
          4. Dropping Frames Without Shortening or Speeding Up the Loop
        </h3>
        <p>
          Here is the detail most guides on{' '}
          <strong>how to drop frames from a GIF to reduce size</strong> skip. A
          GIF frame carries its own delay. If a tool simply deletes every second
          frame and leaves the survivors with their original delays, a
          four-second loop becomes a two-second loop playing at double speed.
        </p>
        <p>
          This tool does it differently. When a frame is dropped, its delay is
          added onto the frame kept before it, so that frame holds the screen
          for as long as it and its dropped neighbours did together. The total
          duration of the loop is unchanged. At 1 in 2 the animation gets a
          little choppier, at 1 in 4 noticeably so, but it never gets shorter
          or faster on its own. If you have been searching for a{' '}
          <strong>GIF compressor that keeps animation length</strong>, this is
          that behaviour, provided the original frames carry their own timing,
          which is the normal case.
        </p>
        <p>
          The flip side is that if you <em>do</em> want it faster, you do not
          need a second tool. To <strong>speed up a GIF and reduce size</strong>{' '}
          together, choose 1.5x or 2x alongside your scale and colour settings
          and both changes land in one re-encode. Other sites split &ldquo;speed
          changer&rdquo; and &ldquo;optimizer&rdquo; into separate steps; here
          they are the same button.
        </p>
        <p>
          And if the result is a <strong>GIF that is choppy after
          compression</strong>, frame dropping is the setting to back off. Move
          it up one step and take the missing bytes from scale or colours
          instead. Choppiness is almost always the frame control and almost
          never the other three.
        </p>
      </section>

      {/* 5 */}
      <section id="without-losing-quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Compress a GIF Without Losing Quality
        </h3>
        <p>
          Honesty first: the default run is not lossless. Scale starts at 80%
          and colours at 128, which suits most jobs but does change the picture.
          To <strong>compress a GIF without losing quality</strong> as far as the
          format allows, push scale to 100% and colours to 256, then run it
          once. That gives you a clean re-encode as the baseline.
        </p>
        <p>
          From there, walk the colour slider down in steps and compare the two
          previews each time. Interface recordings, terminal sessions and flat
          illustrations usually hold up well below 128 because they only ever
          used a handful of colours. Stop at the first setting where you see
          banding in a gradient or speckling in a shadow, go back up one step,
          and only then touch scale, and only then frames.
        </p>
        <p>
          If the source is a photograph or real video footage rather than a
          screen capture, GIF is the wrong container for &ldquo;no loss&rdquo;
          in the first place; the 256-colour limit already costs quality before
          any slider moves. Consider whether a short MP4 from the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          would serve the destination better, and reserve GIF for where only a
          GIF will play.
        </p>
      </section>

      {/* 6 */}
      <section id="platform-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shrink className="w-6 h-6 text-orange-500 shrink-0" />
          6. Getting Under a Platform Limit: Discord, Slack, Email, GitHub
        </h3>
        <p>
          Most people arrive at a <strong>GIF compressor</strong> because
          something said no. The fix is the same adjust-and-compare loop aimed at
          whatever ceiling the platform enforces. There is no target-size mode
          here, so you read the size after each run and stop when it is under
          the line.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>GIF too big for Discord.</strong> Discord caps attachment
            size by account tier, and a screen recording clears it easily. For{' '}
            <strong>how to reduce GIF file size for Discord</strong>: scale to
            about 60%, colours to 64, run, and read the status line. Add frame
            dropping only if that is still over.
          </li>
          <li>
            <strong>GIF emoji too large (the 256 KB ceiling).</strong> Custom
            emoji have tiny limits and usually a fixed pixel size. Use the
            decoded dimensions shown after you drop the file to work out the
            percentage: a 512-pixel-wide source needs 25% to land at 128. Then
            cut colours hard; 32 or fewer is fine at that size.
          </li>
          <li>
            <strong>GIF won&rsquo;t upload, file too large.</strong> Slack,
            Twitter, WhatsApp and most forums each set their own ceiling.
            Whatever the number, scale and colours get you most of the way, and
            the preview tells you whether the result still reads.
          </li>
          <li>
            <strong>Compress a GIF for Slack.</strong> Chat GIFs are viewed
            small, so scale is nearly free; halving a desktop recording rarely
            costs anything a colleague will notice.
          </li>
          <li>
            <strong>Compress a GIF for an email signature.</strong> Mail clients
            punish heavy signatures. Reduce colours aggressively on a flat logo
            animation and consider dropping frames, since a signature loop is
            glanced at, not watched.
          </li>
          <li>
            <strong>Compress a GIF for a GitHub README.</strong> Scale a demo
            recording to the width the README actually renders at, cut colours
            to 64 (terminal and editor captures survive this well), and keep
            frames intact so cursor motion stays smooth. The same recipe covers
            any <strong>screen recording GIF</strong>.
          </li>
          <li>
            <strong>GIF loads slowly on a website.</strong> Compressing helps,
            but the honest advice for a hero animation is that a short, muted
            MP4 is a fraction of the weight. If you still have the source video,
            run it through the{' '}
            <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video compressor
            </Link>{' '}
            instead; if you only have the GIF, use this tool and keep it off
            the first screen.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="cannot-do" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Does Not Do
        </h3>
        <p>
          A tool page that only lists the good news wastes your time when your
          job is one of the exceptions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Transparency is not preserved.</strong> Every frame is
            flattened onto a solid black background, so a sticker-style GIF with
            a see-through backdrop comes out with black behind it. Keep the
            original for those.
          </li>
          <li>
            <strong>No target-size mode and no lossy-level slider.</strong> You
            cannot type &ldquo;under 8 MB&rdquo; and have the settings found for
            you, and there is no &ldquo;lossy&rdquo; number that smears the pixel
            data itself. Savings come only from scale, colours and frames.
          </li>
          <li>
            <strong>One GIF at a time, GIF in and GIF out.</strong> No batch
            mode and no format conversion. To turn a video into a GIF, use the{' '}
            <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to GIF converter
            </Link>
            ; to build one from still images, the{' '}
            <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF maker
            </Link>
            . A single-frame GIF still works here as a one-frame animation; for
            a JPEG, PNG or WebP, use the{' '}
            <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image compressor
            </Link>
            .
          </li>
          <li>
            <strong>The output always loops forever</strong>, even if the
            original played once, and comment and metadata blocks are not
            carried across.
          </li>
          <li>
            <strong>No cropping, trimming or exact pixel sizes.</strong> Scale
            is a percentage only and frame dropping is a fixed 1-in-N pattern.
            For a precise width on a still image, use the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            .
          </li>
        </ul>
        <p>
          One more honest behaviour worth naming. If the re-encode does not end
          up smaller, the status line says &ldquo;Re-encoded GIF&rdquo; with the
          new size instead of pretending a saving happened. The FAQ explains
          when that occurs and what to change.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free GIF Compressor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['No watermark, no signup', 'The download is your GIF and nothing else. No account, no email step, no logo in the corner: a GIF compressor with no watermark and no signup, in the plain sense of those words.'],
            ['Unlimited and free every time', 'No daily quota, no file-count cap and no paid tier. One GIF at a time, as many times as you need, on the same terms every visit.'],
            ['Four real controls, not one vague slider', 'Scale, colours, frames and speed are separate, so you take bytes from the place that costs the least and leave the rest alone.'],
            ['The loop keeps its length', 'Dropped frames hand their time to the frame before them, so a four-second animation stays four seconds. Choppier, never shorter.'],
            ['Speed and compression in one pass', 'Change the playback speed in the same run as the size reduction instead of bouncing between two separate tools.'],
            ['Your files stay private', 'Nothing you compress is stored on our servers, retained after your session, or used for training or analytics.'],
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
            free image and video tools
          </Link>{' '}
          on the same terms, so the same visit can{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress a PNG
          </Link>
          ,{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            shrink a JPEG
          </Link>{' '}
          or{' '}
          <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert WebP to PNG
          </Link>{' '}
          without paying for any of it.
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
              'How do I reduce GIF size for Discord?',
              'Drop the GIF in, set scale to around 60% and colours to 64, and press Compress. If the reported size is still over the cap for your account, lower the scale another step before you touch frame dropping, since softness is less noticeable in a chat window than choppy motion. There is no automatic target-size mode, so expect two or three runs.',
            ],
            [
              'Why did my GIF get bigger after compressing?',
              'Because the original was already tightly optimised. Well-made GIFs store only the parts of each frame that changed; this tool writes each kept frame in full, so a file that relied on that trick can grow when nothing else is reduced. When that happens the status line says Re-encoded GIF rather than claiming a saving. Lower the scale or the colour count and it will come in under the original.',
            ],
            [
              'Why is my GIF choppy after compression, and how do I fix it?',
              'Choppiness is the frame dropping control, almost without exception. Move it one step towards Keep all frames and take the bytes you need from scale or colours instead. The loop length is preserved when frames are dropped, so choppiness is the only cost; the animation is not being sped up.',
            ],
            [
              'Does this GIF compressor keep the animation the same length?',
              'Yes. When a frame is dropped, its display time is added to the frame kept before it, so the total duration is unchanged at 1 in 2, 1 in 3 or 1 in 4. If you want it faster or slower, use the playback speed control, which applies in the same run. Speed alone does not reduce the file size.',
            ],
            [
              'Can I compress a GIF on a Mac without extra software?',
              'Yes. Open this page on macOS, drop the GIF in and download the result. There is no image editor to buy and no platform-specific step; the process is identical on Windows and Linux. A very long, full-resolution recording is better trimmed at the source before you compress it.',
            ],
            [
              'Does it keep transparency?',
              'No. Every frame is flattened onto a solid black background, so a transparent sticker-style GIF comes out with black behind it. Keep the original for anything that needs a see-through backdrop. Opaque GIFs, which is nearly every screen recording and reaction GIF, are unaffected.',
            ],
            [
              'Is it really a free GIF compressor with no watermark and no limits?',
              'Yes. There is no account, no email, no watermark on the output and no daily quota. It handles one GIF per run, and you can run it as many times as you like. The download is a plain animated GIF named after your original with _compressed added.',
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
          Working with animation from the other end? The{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF converter
          </Link>{' '}
          turns a clip into a GIF at a sensible size to begin with, the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>{' '}
          builds one from still frames, and the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          handles the static formats around it. If you would rather understand
          how palettes, frame timing and compression work than simply use them,
          our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers colour, resolution and file formats from the beginning.
        </p>
      </div>
    </article>
  );
}
