import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Film,
  HelpCircle,
  Layers,
  Palette,
  Scaling,
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the MP4 to GIF tool.
 *
 * Written against what Mp4ToGif.js actually exposes, which is four controls
 * (start time, clip duration, 10/12/15/24 FPS, 320/480/640/800 px) and a
 * fixed output recipe: a 256-colour palette built from the clip's own frames,
 * ordered dithering, Lanczos downscaling, infinite loop. Section 3 spends its
 * time on the palette because that is what separates a clean GIF from a
 * grainy one and no converter page on the results says which method it uses.
 *
 * Things the obvious keywords would promise that the code does not do, and
 * that the article therefore says plainly instead: there is no target file
 * size or size estimate before rendering (section 5 teaches which control to
 * turn and hands finished GIFs to the GIF compressor); there is no custom
 * width, crop, play-once option or visual trimmer; one file at a time.
 *
 * The privacy outcome is stated (nothing stored, nothing retained); how the
 * conversion is carried out is not described anywhere in the article.
 */
export default function Mp4ToGifSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">MP4 to GIF</span> Without the Grain, the Muddy Colours or the Bloated File
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A video is the wrong thing to paste into a README, a chat window or a
        pull request. It needs a player, it needs a click, and half the places
        you want to share it will not embed it at all. That is why people still
        convert <strong>MP4 to GIF</strong>: a GIF plays everywhere, loops on
        its own and asks nothing of the viewer. The catch is that most{' '}
        <strong>video to GIF</strong> converters hand back something grainy,
        washed out or too large to send. This guide explains why, how the{' '}
        <strong>MP4 to GIF converter</strong> above avoids it, and which of its
        four controls to turn when the file comes out big.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/mp4-gif.webp"
            alt="Convert MP4 to GIF free - turn a video clip into a clean animated GIF with a custom colour palette"
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
              Pick a start time, a duration, a frame rate and a width. The colour
              palette is built from your clip every time.
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
            ['#what-happens', '1. What Actually Happens When You Convert Video to GIF'],
            ['#how-to-convert', '2. How to Convert MP4 to GIF Online Free'],
            ['#palette', '3. Why Your GIF Looks Grainy or Washed Out'],
            ['#four-controls', '4. The Four Controls: Start, Duration, FPS, Width'],
            ['#file-size', '5. GIF Too Big to Send? Which Control to Turn'],
            ['#formats-and-jobs', '6. MOV, WebM, Screen Recordings and Real Jobs'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free MP4 to GIF Converter'],
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
          1. What Actually Happens When You Convert Video to GIF
        </h3>
        <p>
          An MP4 is compressed video plus a soundtrack. A GIF is a stack of
          still images, each shown for a set delay, with a flag that says
          whether to loop. The format is defined in the{' '}
          <a
            href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GIF89a specification
          </a>
          , which dates from 1990. Three things follow, and they explain
          almost every complaint about the results:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The sound is gone.</strong> A GIF has no audio track. If
            the soundtrack is the part you want, the{' '}
            <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to MP3 tool
            </Link>{' '}
            pulls it out as a separate file.
          </li>
          <li>
            <strong>Every frame is limited to 256 colours.</strong> Your video
            can show millions. Which 256 survive, and how the missing ones are
            faked, is the whole difference between a clean GIF and a grainy one.
          </li>
          <li>
            <strong>Every frame costs.</strong> Video stores only what changed
            between frames; a GIF stores each frame plainly, so it is often
            bigger than the clip it came from. Size is decided by how many
            frames you keep and how large each one is.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert MP4 to GIF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no watermark stamped across the corner.
          To <strong>convert MP4 to GIF free online</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your video', 'Click the panel and choose an MP4, MOV, WebM, MKV or AVI file. The clip length appears under the filename.'],
            ['Set the clip and the look', 'Type a start time and a duration in seconds, then pick a frame rate (10, 12, 15 or 24 FPS) and a width (320, 480, 640 or 800 px). The defaults of 12 FPS and 480 px suit most jobs.'],
            ['Convert and download', 'Press Convert Video to GIF. A progress bar runs while the palette is built, then the GIF previews with its file size beside it. Download it, named after your video.'],
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
          The preview plays inline, so you can judge motion and colour before
          saving. If the file is bigger than you wanted, change a setting and
          convert again. It works on one video at a time, and it is an{' '}
          <strong>MP4 to GIF converter with no sign up</strong> in the plain
          sense: nothing to register for and no trial that runs out.
        </p>
      </section>

      {/* 3 */}
      <section id="palette" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why Does My GIF Look Grainy or Washed Out? The Palette Problem
        </h3>
        <p>
          Since each frame can only use 256 colours, somebody has to decide
          which 256. The lazy answer is a fixed, general-purpose palette: the
          same spread of reds, greens and blues for every clip, so a sunset
          gets the same colour budget as a spreadsheet. The result is the
          familiar muddy GIF, with banded skies and skin tones drifting towards
          orange or grey.
        </p>
        <p>
          The tool above reads through your clip first and builds a{' '}
          <strong>custom 256-colour palette</strong> from the colours that
          actually appear, then draws the GIF using that palette. This is the
          two-pass method people who make GIFs for a living use, and it is why
          a blue-and-white interface gets its 256 colours spent on blues and
          whites rather than on purples it never needed.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Why does my GIF look grainy?
        </h4>
        <p>
          Grain is usually dithering, not the palette. Dithering fakes a colour
          the palette lacks by mixing dots of two it has. The common kind,
          error-diffusion, scatters those dots differently on every frame, so a
          still background crawls with noise once the GIF plays. That is the
          speckled <strong>grainy GIF</strong> people complain about. This tool
          uses <strong>ordered dithering</strong> at its finest setting: the
          pattern is fixed, so a still background stays still. On a very smooth
          gradient you may notice a faint regular texture instead; for
          interfaces, text and most footage that is the better side of the
          trade.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Why do the GIF colours look wrong after converting a video?
        </h4>
        <p>
          Almost always a generic palette. When a converter has no colour close
          to the one in your frame it substitutes the nearest it has, and a
          whole region shifts. A palette built from the clip has the colours
          that matter. If a GIF from elsewhere has shifted colours, re-render
          it from the original video; they cannot be put back afterwards.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Why is my GIF from a video blurry?
        </h4>
        <p>
          Nearly every clip is scaled down on the way to GIF, and the resampler
          decides whether edges stay crisp. Cheap resampling softens everything.
          This tool scales with <strong>Lanczos resampling</strong>, which keeps
          edges and small text sharp at the same width; if you were searching
          for <strong>MP4 to GIF with Lanczos</strong> scaling, this is it. The
          other cause of blur is converting a GIF that was already a GIF; always
          start from the video.
        </p>
        <p>
          That is the honest answer to{' '}
          <strong>how to convert MP4 to GIF without losing quality</strong>: you
          cannot escape the 256-colour limit, but a per-clip palette, stable
          dithering and sharp downscaling give you the best GIF the format
          allows, which is what <strong>MP4 to GIF high quality</strong> means
          in practice.
        </p>
      </section>

      {/* 4 */}
      <section id="four-controls" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. The Four Controls: Start Time, Duration, Frame Rate and Width
        </h3>
        <p>
          The palette, dithering and loop are fixed, so the four fields you
          have are the ones that decide size and smoothness.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Start time (seconds)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Where the GIF begins. Leave it at 0 for the opening of the clip,
              or type 42 to begin at the 42-second mark. There is no scrubber,
              so find the timestamp in your player if you are unsure.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Clip duration (seconds)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How many seconds to keep; it defaults to ten or the whole video,
              whichever is shorter. The field suggests a maximum of sixty;
              longer values are accepted but make very large GIFs. Setting it
              to 0 keeps everything from the start time to the end.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Frame rate: 10, 12, 15 or 24 FPS
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Frames kept per second. <strong>12 FPS</strong> is the GIF
              standard and the default. Drop to 10 for a smaller file, 15 for
              smoother motion, 24 for short cinematic clips where size does not
              matter.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Width: 320, 480, 640 or 800 px
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Width of the finished GIF; height follows to keep the aspect
              ratio. <strong>480 px</strong> is the conventional GIF width and
              the default. 800 px is the largest offered, and there is no
              custom value between the presets.
            </p>
          </div>
        </div>
        <p>
          Start time and duration together are how you{' '}
          <strong>convert part of a video to GIF</strong>: a two-minute demo
          where only the login step matters becomes a six-second GIF by typing
          the timestamp and 6. For the{' '}
          <strong>first five seconds of a video</strong>, leave start at 0 and
          set duration to 5. Trimming by feel means run, watch, adjust by a
          second, run again.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Why does my GIF look choppy after conversion?
        </h4>
        <p>
          Too few frames per second for the motion. Ten is fine for a cursor
          moving around a settings page and wrong for a camera pan, which
          stutters at that rate. Step up to 15 FPS and shorten the duration to
          pay for it.
        </p>
        <p>
          What the controls do not cover: no crop, no colour-count slider, and
          no way to stop the GIF looping. It always plays on repeat, which is
          what a README or a chat expects. If the frame needs cropping, do it
          in your video editor before converting, since a still-image cropper
          would keep only one frame of the animation. To bring the finished
          file down further without re-rendering, the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          is the separate tool for that.
        </p>
      </section>

      {/* 5 */}
      <section id="file-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scaling className="w-6 h-6 text-orange-500 shrink-0" />
          5. GIF Too Big to Send? Which Control to Turn
        </h3>
        <p>
          First, the honest part: there is no target-size box and no estimate
          before rendering. You see the size beside the preview, and if it is
          over the limit for wherever you are posting, you change a setting and
          render again. When a <strong>video to GIF file is too large</strong>,
          the controls are not equal. In order of how much they help:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Width first.</strong> Halving the width roughly quarters
            the pixels in every frame, because height falls with it. Going
            from 800 to 480, or 480 to 320, is the biggest saving available.
          </li>
          <li>
            <strong>Duration second.</strong> Size scales almost directly with
            length. A GIF that makes its point in four seconds does not need
            ten.
          </li>
          <li>
            <strong>Frame rate third.</strong> 12 to 10 FPS trims a sixth of
            the frames for a small loss in smoothness. It helps, but less than
            the other two.
          </li>
        </ul>
        <p>
          For <strong>MP4 to GIF for Discord</strong> and similar chat apps,
          which cap attachment size, the usual recipe is 480 or 320 px at 10
          or 12 FPS and a clip of a few seconds; check the reported size and go
          a step smaller if you are over. An{' '}
          <strong>MP4 to GIF for a GitHub README</strong> follows the same
          logic: 640 px at 12 FPS reads well, and short keeps the repository
          light.
        </p>
        <p>
          If you already have a finished GIF that is <strong>too big to send</strong>{' '}
          and no longer have the video, this tool cannot help, because it only
          accepts video; take the GIF to the{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          instead. If the video itself is unwieldy, the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          shrinks that first.
        </p>
      </section>

      {/* 6 */}
      <section id="formats-and-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          6. MOV to GIF, WebM to GIF and Screen Recordings
        </h3>
        <p>
          MP4 is in the name, but the tool accepts MP4, MOV, WebM, MKV and AVI,
          with the same palette treatment for all of them:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>MOV to GIF.</strong> Mac and iPhone screen recordings are
            saved as MOV. Pick the file as it is; there is no need to convert
            it to MP4 first.
          </li>
          <li>
            <strong>WebM to GIF.</strong> Screen captures made from a web page
            and clips saved out of many chat apps come out as WebM. Select it
            directly.
          </li>
          <li>
            <strong>MKV and AVI.</strong> Accepted and converted, though the
            duration readout may stay blank; check the length in your own
            player first.
          </li>
        </ul>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Screen recording to GIF, and the other jobs this gets used for
        </h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A bug report.</strong> Turning a{' '}
            <strong>screen recording into a GIF</strong> means the reproduction
            plays inline in the issue. Trim to the seconds that show the fault,
            480 px, 12 FPS.
          </li>
          <li>
            <strong>A README demo.</strong> A short loop of the feature working
            does more than three paragraphs, and Lanczos scaling keeps
            interface text legible at 640 px.
          </li>
          <li>
            <strong>A reaction clip.</strong> Two seconds from a longer video,
            320 px, done.
          </li>
        </ul>
        <p>
          To build a GIF from still images rather than a video, use the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>
          . For a single still of a website rather than a recording, the{' '}
          <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website screenshot tool
          </Link>{' '}
          is quicker than recording and converting.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free MP4 to GIF Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['A palette built from your clip', 'Every GIF gets its own 256 colours chosen from the frames it contains, not a generic spread. It is the difference between clean and muddy.'],
            ['No watermark, ever', 'Nothing is stamped on the output. The GIF you download is the GIF you made, corner to corner.'],
            ['No sign up, no trial', 'No account, no email, no daily allowance that runs out after the third file. It is free each time.'],
            ['Real controls, honestly labelled', 'Start time, duration, four frame rates and four widths, with what each does to file size explained rather than hidden behind a Low/Medium/High dropdown.'],
            ['Your video stays private', 'Your files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['See the size before you save', 'The GIF previews inline with its file size beside it, so a setting that came out too big costs a re-render, not a rejected attachment.'],
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
            free media tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress the GIF
          </Link>
          ,{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert the video
          </Link>{' '}
          to another container or{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            shrink the source
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
              'How do I convert MP4 to GIF for free without signing up?',
              'Select your video in the panel at the top of this page, set a start time and duration, choose a frame rate and width, and press convert. The GIF previews with its size and downloads named after your video. No account, no email step, no watermark, and free every time.',
            ],
            [
              'How do I make a GIF from a video that does not look grainy?',
              'Start from the original video rather than an existing GIF, and use a converter that builds the palette from your clip instead of a generic one. The tool here does that on every run, with a fixed dithering pattern rather than a random one, so still backgrounds stay still instead of crawling with speckle.',
            ],
            [
              'Why does my GIF look choppy after conversion?',
              'The frame rate is too low for the motion. 10 FPS suits slow interface recordings; a camera pan or fast action needs 15. Raise the frame rate and, if the file grows too much, shorten the clip to compensate.',
            ],
            [
              'My GIF is too big to send. What should I change?',
              'Reduce the width first, then the duration, then the frame rate. There is no target-size setting, so check the size beside the preview and re-render a step smaller if you are over. If all you have is a finished GIF and no video, use our GIF compressor, because this tool only accepts video input.',
            ],
            [
              'Can I convert only part of a video to GIF?',
              'Yes. Type the start time in seconds and the number of seconds to keep. For the first five seconds, leave start at 0 and set duration to 5. There is no visual trimmer, so find the timestamp in your player and adjust after watching the preview.',
            ],
            [
              'Can I convert MOV or WebM to GIF, not just MP4?',
              'Yes. MP4, MOV, WebM, MKV and AVI are all accepted, so a Mac or iPhone screen recording and a WebM screen capture both work as they are.',
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
          Working on the same clip? The{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>{' '}
          takes the finished GIF further down, the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>{' '}
          builds one from still frames instead, the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          tames the source file, and{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>{' '}
          rescues the audio a GIF has to leave behind. If you would rather
          understand colour palettes, dithering and resampling than simply rely
          on them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers all three from the beginning.
        </p>
      </div>
    </article>
  );
}
