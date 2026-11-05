import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clapperboard,
  Clock,
  Gauge,
  HelpCircle,
  Layers,
  ListChecks,
  Music,
  ShieldCheck,
  Turtle,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Video Speed tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Numbers are arithmetic, not claims: the preset list is the real one and
 *    the length table is simply source length divided by the rate.
 *
 * 2. Pitch is the problem behind half the searches, so it gets its own
 *    section. Voices always keep their pitch; there is no chipmunk mode.
 *
 * 3. The limits are stated plainly (whole clip only, fixed presets, slow
 *    motion repeats frames) and each one is routed to the sibling that helps.
 */
export default function VideoSpeedSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Change Video Speed Online</span>: Speed Up Video or Slow Down Video While Voices Keep Their Pitch
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A lecture you would happily watch at one and a half times. A screen
        recording that drags. A golf swing you want to see frame by frame.
        Each is the same job: you want to{' '}
        <strong>change video speed online</strong> and download a file that
        plays at the new pace in any player. This guide shows how to{' '}
        <strong>speed up video</strong> or <strong>slow down video</strong>{' '}
        with a free <strong>video speed changer</strong>, what each speed does
        to the length, why voices stay natural, and &mdash; honestly &mdash;
        what the tool will not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/video-speed.webp"
            alt="A camera on a slider and tripod set to film a time-lapse of sunset over a hillside town"
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
              Pick a speed from 0.25× to 4×. Picture and sound are retimed
              together, and voices keep their normal pitch.
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
            ['#what-it-does', '1. What a Video Speed Changer Does, and What It Does Not'],
            ['#how-to', '2. How to Speed Up a Video or Slow It Down in Four Steps'],
            ['#speed-table', '3. Every Speed Preset and What It Does to Length'],
            ['#pitch', '4. Slow Down Video Without Changing Pitch'],
            ['#choppy', '5. Why Is My Slow Motion Video Choppy?'],
            ['#recipes', '6. Recipes: Lectures, Timelapses, Reels and Sports'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Video Speed Changer'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Video Speed Changer Does, and What It Does Not
        </h3>
        <p>
          A player&rsquo;s speed button only changes how <em>you</em> watch.
          A <strong>video speed changer</strong> writes a new file with the
          speed built in, which is the answer to{' '}
          <strong>how to change playback speed of a video file permanently</strong>:
          send it anywhere and it plays at the speed you chose.
        </p>
        <p>
          The tool above retimes the whole clip, picture and sound together, at
          one of eight presets. It accepts MP4, WebM, MOV and MKV files and
          exports MP4 or WebM. Some MOV and MKV files use codecs that will not
          open here; if one refuses, convert it to MP4 with the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          first.
        </p>
        <p>What it deliberately does not do, and where to go instead:</p>
        <ul className="space-y-2">
          <li>
            <strong>Change only one scene.</strong> The whole clip always
            changes. Cut the part you want with the{' '}
            <Link to="/tools/video-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video trimmer
            </Link>{' '}
            first, then change its speed here.
          </li>
          <li>
            <strong>Custom values, ramps or reverse.</strong> There is no 1.1×,
            no 8× or 16×, no speed curve and no backwards playback. None of our
            tools does these today.
          </li>
          <li>
            <strong>Audio-only files.</strong> An MP3 or WAV cannot be sped up
            here. The{' '}
            <Link to="/tools/audio-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              audio trimmer
            </Link>{' '}
            cuts audio but does not change its speed.
          </li>
          <li>
            <strong>Online videos by link.</strong> It works on a file you
            have, not on a streaming page.
          </li>
          <li>
            <strong>Make the file smaller or change its format.</strong> A speed
            change is not compression. To fit an email or sharing size limit, use the{' '}
            <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video compressor
            </Link>
            ; to turn MOV into MP4 at the same speed, use the{' '}
            <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video converter
            </Link>
            .
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Speed Up a Video or Slow It Down in Four Steps
        </h3>
        <p>
          Here is <strong>how to speed up a video</strong>, and equally{' '}
          <strong>how to slow down a video</strong>, with the{' '}
          <strong>video speed controller online</strong> at the top of this
          page. There is no account and no watermark.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose your video.</strong> Drop it on the panel or pick it
            from your files. Its size and length appear, such as
            &ldquo;1920×1080, 0:42.00&rdquo;.
          </li>
          <li>
            <strong>Pick a speed.</strong> Below 1× slows the clip, above 1×
            speeds it up. The list starts on 2×.
          </li>
          <li>
            <strong>Set the output.</strong> Resolution can stay on Original or
            drop to 1080p, 720p or 480p; it only ever scales down. Frame rate
            is 30 fps by default, with 24 and 60 available. Leave{' '}
            <em>Keep audio</em> ticked for sound, and choose MP4 or WebM.
          </li>
          <li>
            <strong>Apply and download.</strong> Press <em>Apply speed</em>.
            You get a preview, the file size, a note saying whether the audio
            was kept, and a download named like{' '}
            <strong>holiday-2x.mp4</strong>. MP4 results also show the new
            length. Your original file is left untouched.
          </li>
        </ol>
        <p>
          <strong>MP4 or WebM?</strong> MP4 is the better default. It plays
          almost everywhere and makes this an{' '}
          <strong>mp4 speed changer</strong> that gives you MP4 back. MP4 export
          needs Chrome 94+, Edge 94+ or Safari 16.4+; elsewhere, pick WebM
          instead. A WebM export takes as long as the finished video runs: a
          30-second clip slowed to 0.25× takes about two minutes to export, so
          keep the page open until it finishes. If you need to{' '}
          <strong>change WebM video speed</strong>, you can bring a WebM in and
          take an MP4 out.
        </p>
      </section>

      {/* 3 */}
      <section id="speed-table" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500 shrink-0" />
          3. Every Speed Preset and What It Does to Length
        </h3>
        <p>
          The new length is the original divided by the speed. For a
          one-minute clip:
        </p>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
              <tr>
                <th className="text-left p-3">Speed</th>
                <th className="text-left p-3">60-second clip becomes</th>
                <th className="text-left p-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              {[
                ['0.25×', '4:00', 'Frame-level study of a movement'],
                ['0.5×', '2:00', 'Sports replays, learning choreography'],
                ['0.75×', '1:20', 'A gentle slow-down for fast speech'],
                ['1.25×', '0:48', 'Trimming slack from a talk'],
                ['1.5×', '0:40', 'Lectures and tutorials'],
                ['2×', '0:30', 'Screen recordings, fitting a time limit'],
                ['3×', '0:20', 'Long demos and walkthroughs'],
                ['4×', '0:15', 'Timelapse-style clips'],
              ].map(([s, len, use]) => (
                <tr key={s} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-3 font-semibold">{s}</td>
                  <td className="p-3">{len}</td>
                  <td className="p-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          So <strong>how to make a video 2x speed</strong> is simply the 2×
          preset: every second of the original becomes half a second, sound
          included. There is no 1× option, because a copy at the same speed
          is not a speed change; if you only need a different format, use the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/webm-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WebM to MP4 converter
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="pitch" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-orange-500 shrink-0" />
          4. Slow Down Video Without Changing Pitch
        </h3>
        <p>
          Play sound faster and its pitch rises; play it slower and voices sink
          into a growl. That is why people search for ways to{' '}
          <strong>slow down video without changing pitch</strong> and to{' '}
          <strong>speed up video without chipmunk voice</strong>.
        </p>
        <p>
          With <em>Keep audio</em> ticked, the sound is time-stretched instead
          of simply played faster or slower. It lasts as long as the new
          picture while voices keep their pitch: a teacher at 1.5× sounds like the same
          teacher talking briskly, and a song at 0.5× stays in its key.
        </p>
        <p>
          Because picture and sound are retimed together, you avoid the{' '}
          <strong>sped up video audio out of sync</strong> problem that comes
          from changing them separately. Pitch is always preserved, so there is
          no deliberate chipmunk effect, and if your file&rsquo;s audio cannot
          be read, the result says &ldquo;no audio&rdquo;. Want silence? Untick{' '}
          <em>Keep audio</em>, or use the dedicated{' '}
          <Link to="/tools/video-muter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video muter
          </Link>
          .
        </p>
      </section>

      {/* 5 */}
      <section id="choppy" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Turtle className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why Is My Slow Motion Video Choppy?
        </h3>
        <p>
          A <strong>slow motion video</strong> needs more frames than the
          original ever had. Film a scene at 30 frames a second, slow it to
          0.25×, and each real frame has to fill four times as long. This tool
          repeats real frames rather than inventing new ones, so at 0.25× with
          30 fps output each source frame appears about four times. Motion
          steps rather than glides. That is the honest answer to{' '}
          <strong>why is my slow motion video choppy</strong>: no new detail
          was ever recorded between those frames.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>For smoother slow motion, start with more frames.</strong>{' '}
            A clip shot at 120 fps, slowed to 0.25× with 30 fps output, shows
            a different real frame every time. Choosing 60 fps output for
            ordinary footage adds no detail. AI frame interpolation is not
            offered.
          </p>
        </div>
        <p>
          For studying technique the stepped look helps: each position holds
          long enough to see. For a cinematic feel, try 0.5× or 0.75×.
        </p>
      </section>

      {/* 6 */}
      <section id="recipes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-orange-500 shrink-0" />
          6. Recipes: Lectures, Timelapses, Reels and Sports
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>Speed up lecture video 1.5x to download and rewatch.</strong>{' '}
            Choose 1.5× and MP4. A 90-minute recording becomes 60 minutes, and
            the lecturer still sounds like themselves. Very long or
            high-resolution recordings can take a long time to export; choosing
            720p or 480p, or splitting the lecture into parts with the video
            trimmer, keeps each job manageable.
          </li>
          <li>
            <strong>Make timelapse from video online.</strong> Use 4×; an hour
            of sunset becomes 15 minutes. Since 4× is the ceiling, trim dull
            stretches first for more.
          </li>
          <li>
            <strong>Speed up screen recording footage.</strong> 2× or 3× turns
            a slow walkthrough into something people finish.
          </li>
          <li>
            <strong>Slow motion video for sports analysis.</strong> 0.5× for a
            swing or a serve; 0.25× to hold each position. Trim the clip to the
            single rep or play first, so the replay is only the moment you want
            to study.
          </li>
          <li>
            <strong>Slow down dance video to learn choreography.</strong> 0.75×
            or 0.5× keeps the music in its key, so you still hear the beat you
            are counting. Start at 0.5× to learn the steps, then make a 0.75×
            copy to practise closer to tempo.
          </li>
          <li>
            <strong>Video too long for TikTok? Speed up</strong> by dividing
            the clip&rsquo;s length by the limit and picking the next preset
            up: a 90-second clip needs 1.5× to fit 60 seconds. The same maths
            helps you <strong>speed up video for Instagram Reels</strong>.
          </li>
          <li>
            <strong>Speed up iPhone video without an app.</strong> Open this
            page in Safari on the phone, choose the clip from your library,
            pick a speed and download the result. MP4 export needs Safari 16.4
            or later; on older versions choose WebM. iPhone clips are usually MOV files. To{' '}
            <strong>speed up MOV video online</strong>, drop it in and export
            MP4. If a clip will not open, convert it with the video converter
            first.
          </li>
        </ul>
        <p>
          Finished clip too big to send? Shrink it with the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          . Want the sped-up moment as a looping GIF? Use{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF
          </Link>{' '}
          or the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Video Speed Changer
        </h3>
        <p>
          Many pages promise to <strong>speed up video online free</strong>{' '}
          or <strong>slow down video online free</strong>, then demand an
          account or stamp a logo on the export. Not here.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Video speed changer, no watermark', 'No logo, no end card and no sign-up. What you preview is what you download.'],
            ['Voices keep their pitch', 'Audio is time-stretched rather than sped up, so speech sounds natural at 0.5× and at 2×, and sound stays in sync with picture.'],
            ['Eight clear presets', 'From 0.25× slow motion to 4× timelapse. The new length is simply the original divided by the speed, so there is no guesswork.'],
            ['A private video speed changer', 'Files are never stored on our servers, and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your footage is never used for training. Family clips and client work stay yours.'],
            ['MP4 or WebM, your choice', 'Export a widely playable MP4 or a WebM, at the original size or scaled down to 1080p, 720p or 480p, at 24, 30 or 60 fps.'],
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
          MP4 files normally use{' '}
          <a
            href="https://www.itu.int/rec/T-REC-H.264"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            H.264, the ITU video standard
          </a>{' '}
          nearly every phone, laptop and TV understands, and WebM follows the
          open format published by the{' '}
          <a
            href="https://www.webmproject.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            WebM Project
          </a>
          . It is one of our{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free media tools
          </Link>
          , all built on the same terms.
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
              'How do I change video speed online for free?',
              'Choose your video in the tool above, pick a speed from 0.25× to 4×, and press Apply speed. Preview the result, then download a file named with the speed, such as clip-2x.mp4. There is no account and no watermark.',
            ],
            [
              'Will the voices sound like chipmunks when I speed up a video?',
              'No. With Keep audio ticked, the sound is time-stretched so it fits the new length while voices keep their normal pitch. That applies to slowing down too, so speech never drops into a deep growl. Pitch is always preserved, so the tool cannot make a chipmunk effect on purpose either.',
            ],
            [
              'Can I speed up only part of a video?',
              'Not in one step, because the whole clip always changes speed. Cut the section you want with the video trimmer, then bring that piece here and change its speed.',
            ],
            [
              'Can I choose a custom speed like 1.1× or 8×?',
              'No. The speeds are fixed presets: 0.25×, 0.5×, 0.75×, 1.25×, 1.5×, 2×, 3× and 4×. For a faster timelapse than 4×, trim out the quiet stretches first so the remaining footage is shorter.',
            ],
            [
              'Why does my slow motion look choppy?',
              'Slowing ordinary footage has to stretch the frames it already has, so at 0.25× each frame is shown several times. This tool repeats real frames and does not invent new ones. Footage recorded at a high frame rate slows down far more smoothly.',
            ],
            [
              'Why does WebM take so long to export?',
              'A WebM export takes as long as the finished video runs: a 30-second clip slowed to 0.25× takes about two minutes. MP4 export is not tied to the running time in the same way, so it is the better choice where it is available.',
            ],
            [
              'Is it private to change video speed here?',
              'Your videos are never stored on our servers, and nothing is retained after your session. Your footage is never used for training.',
            ],
            [
              'How do I speed up an iPhone video without an app?',
              'Open this page in Safari, choose the clip from your photo library, pick a speed such as 2×, and press Apply speed. Download the MP4, then save it from the Files app to Photos if you want it in your library. MP4 export needs Safari 16.4 or later; on an older version, choose WebM instead.',
            ],
            [
              'Can I make the sped-up video smaller or turn it into a GIF?',
              'Not in this tool, which only changes speed, resolution and frame rate. Choosing 720p or 480p gives a smaller file, but for a real size reduction run the result through the video compressor, and for a looping GIF use MP4 to GIF or the GIF maker.',
            ],
            [
              'Can I change the speed of an MP3 or a YouTube video?',
              'No to both. This tool works on a video file you already have, not on a link, and it does not change the speed of audio-only files. The audio trimmer can cut an MP3 or WAV, but none of our tools changes audio speed today.',
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
          Next step? Pull the soundtrack out with{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>
          , turn a GIF into a clip you can retime with{' '}
          <Link to="/tools/gif-to-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF to MP4
          </Link>
          , or make the file smaller with the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          . Want to build tools like this? Try our{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
