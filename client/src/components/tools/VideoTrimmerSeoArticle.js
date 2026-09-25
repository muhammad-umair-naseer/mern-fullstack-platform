import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clapperboard,
  Crosshair,
  HelpCircle,
  Layers,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Video Trimmer tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Precision is the selling point, so the keyframe problem is explained in
 *    plain words: "instant" cutters snap to the nearest keyframe, this one
 *    lands on the frame you chose and takes a little longer to do it.
 *
 * 2. The how-to uses the real control labels (Set start = player time,
 *    Trim & export, Keep audio) so the page and the tool agree line by line.
 *
 * 3. Limits are stated and routed: one range per run, MP4 or WebM only, no
 *    cropping, no merging. Each gap points to the sibling tool that covers it.
 */
export default function VideoTrimmerSeoArticle() {
  const link = 'text-orange-600 font-semibold underline hover:text-orange-700';

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
        How to <span className="text-orange-600 dark:text-orange-400">Trim Video Online Free</span>: A Frame-Accurate Video Cutter for MP4 and WebM Clips
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Twenty seconds of fumbling before the recording starts. A two-hour
        stream with one moment worth keeping. A phone clip too long for the
        group chat. Each is the same small job: you want to{' '}
        <strong>trim video</strong> down to the part that matters. This guide
        shows how to <strong>trim video online free</strong> with the{' '}
        <strong>video trimmer</strong> above, why its cut lands on the exact
        frame when many a <strong>video cutter</strong> misses by a second,
        which settings keep your quality, and &mdash; honestly &mdash; which
        jobs belong to a different tool.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/video-trimmer.webp"
            alt="Trim video online free - a video cutter timeline with start and end markers selecting one clip from a longer MP4 recording, no watermark"
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
              Pick a start, pick an end, export. The clip begins on the frame
              you chose, not on the nearest one that was convenient.
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
            ['#what-it-does', '1. What a Video Trimmer Does, and When to Cut Video'],
            ['#how-to-trim', '2. How to Trim a Video in Four Steps'],
            ['#frame-accurate', '3. Why Other Video Cutters Miss the Frame'],
            ['#export-settings', '4. MP4 Trimmer Settings That Keep the Quality'],
            ['#situations', '5. WhatsApp, Reels, Screen Recordings and Gameplay'],
            ['#troubleshooting', '6. Won’t Open, No Sound, MP4 Unavailable: Fixes'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Video Trimmer'],
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
          <Scissors className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Video Trimmer Does, and When to Cut Video
        </h3>
        <p>
          To trim a video is to keep one continuous stretch of it and drop
          everything before and after. The result is a new, shorter file and
          your original is left alone. That covers most reasons people want to{' '}
          <strong>cut video</strong>: dead air at the start, a long ending, or
          one highlight inside an hour-long recording.
        </p>
        <p>
          Think of it as a <strong>free video clip maker from video</strong>{' '}
          you already have: a lecture, a meeting, a match. It exports{' '}
          <strong>one range per run</strong>, so for three highlights you run it
          three times. It does not join clips, add music, text or filters, or
          crop and rotate the picture. It is a precise cutter, not an editor,
          which is why it takes seconds to learn.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-trim" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Trim a Video in Four Steps
        </h3>
        <p>
          Here is <strong>how to trim a video</strong>, or{' '}
          <strong>how to cut part of a video</strong> when you only want the
          middle, using the controls as they are labelled. No account and no
          watermark.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the video.</strong> Drop an MP4, WebM, MOV or MKV
            file on <em>1. Choose video</em>. Its dimensions and length appear,
            and the end point is set to the full duration.
          </li>
          <li>
            <strong>Find your start and end.</strong> Scrub the preview to the
            first frame you want and press <em>Set start = player time</em>, then
            to the last and press <em>Set end = player time</em>. Or drag the
            sliders, or type seconds into <em>Start (s)</em> and{' '}
            <em>End (s)</em>.
          </li>
          <li>
            <strong>Pick the export settings.</strong> Choose{' '}
            <strong>MP4</strong>, <strong>Original</strong> resolution, the frame
            rate closest to your source (30 fps suits most phone recordings),
            and leave <em>Keep audio</em> ticked.
          </li>
          <li>
            <strong>Trim and download.</strong> Press <em>Trim &amp; export</em>.
            The result card shows the clip&rsquo;s start, end and length,
            whether it has sound, and a preview. The download has{' '}
            <strong>-trimmed</strong> added to its name.
          </li>
        </ol>
        <p>
          That is also <strong>how to cut a clip from a long video</strong>{' '}
          such as a stream: typing the seconds is often faster than scrubbing
          an hour-long timeline.
        </p>
      </section>

      {/* 3 */}
      <section id="frame-accurate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why Other Video Cutters Miss the Frame
        </h3>
        <p>
          If you have searched <strong>video trimmer not frame accurate</strong>,
          you have met the keyframe problem. Compressed video such as{' '}
          <a
            href="https://www.itu.int/rec/T-REC-H.264"
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            H.264 (the ITU standard behind most MP4 files)
          </a>{' '}
          stores a full picture, a keyframe, only now and then; the frames
          between are stored as changes. A cut that copies the file without
          rebuilding it can only begin cleanly on a keyframe, so an
          &ldquo;instant&rdquo; cutter quietly moves your start to the nearest
          one, and the clip can begin noticeably earlier or later than the
          moment you picked.
        </p>
        <p>
          The other symptom has its own search: <strong>why does trimmed video start with frozen frame</strong>.
          When a copied cut starts between keyframes, the player has no full
          picture to show, so it holds a stuck image or black until the next
          keyframe, while the sound runs on.
        </p>
        <p>
          This tool re-encodes the range you choose rather than copying it,
          which makes it a <strong>frame accurate video cutter online</strong>:
          the first frame of your clip is the frame you picked, with no frozen
          opening. The honest tradeoff is time, and the output is a fresh
          encode rather than a bit-for-bit slice of the original. For sharing,
          the right frame is what matters.
        </p>
      </section>

      {/* 4 */}
      <section id="export-settings" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          4. MP4 Trimmer Settings That Keep the Quality
        </h3>
        <p>
          The four settings under <em>3. Export</em> decide how your clip looks
          and sounds.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Format: MP4 or WebM.</strong> MP4 is the default and the
            one for phones and social media; export works in Chrome, Edge and
            Safari 16.4 or later. As an <strong>mp4 trimmer</strong>, that is{' '}
            <strong>how to trim an MP4 file</strong>: load, set the range, keep
            MP4. WebM is the open format from the{' '}
            <a
              href="https://www.webmproject.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              WebM Project
            </a>
            ; a WebM export takes about as long as the clip itself runs.
          </li>
          <li>
            <strong>Resolution: Original, 1080p, 720p or 480p.</strong> These
            only ever shrink the picture and keep its shape. To{' '}
            <strong>trim video and reduce resolution to 720p</strong> in one
            pass, choose 720p.
          </li>
          <li>
            <strong>Frame rate: 30, 24, 60 or 15 fps.</strong> Match your
            source: 30 for most phone and screen recordings, 60 for gameplay,
            24 for film-rate footage.
          </li>
          <li>
            <strong>Keep audio.</strong> Ticked by default. Untick it for a
            silent clip.
          </li>
        </ul>
        <p>
          To <strong>cut video without losing quality</strong> you can notice,
          choose Original resolution and your recording&rsquo;s frame rate. A
          lower rate than the source loses smoothness; a higher one adds
          nothing.
        </p>
      </section>

      {/* 5 */}
      <section id="situations" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-orange-500 shrink-0" />
          5. WhatsApp, Reels, Screen Recordings and Gameplay
        </h3>
        <p>
          <strong>Video too long to send on WhatsApp?</strong> Messaging apps
          limit length and file size. Trim to the moment that matters and
          export MP4 at 720p. Still too heavy? Use the{' '}
          <Link to="/tools/video-compressor" className={link}>
            video compressor
          </Link>
          {' '}after trimming.
        </p>
        <p>
          To <strong>trim video for Instagram Reel</strong> posts, set a range
          within Instagram&rsquo;s current length limit and export MP4. The
          trimmer does not crop landscape footage to vertical 9:16, so film
          vertically if the Reel must fill the screen.
        </p>
        <p>
          To <strong>trim screen recording</strong> files, cut the seconds
          spent starting and stopping the recorder. You can{' '}
          <strong>trim WebM video</strong> and still export MP4, or convert a
          finished WebM with the{' '}
          <Link to="/tools/webm-mp4" className={link}>
            WebM to MP4 converter
          </Link>
          .
        </p>
        <p>
          To <strong>cut gameplay clip MP4</strong> highlights from a long
          session, type the seconds into the boxes and choose 60 fps if you
          recorded at 60.
        </p>
        <p>
          <strong>Trim iPhone video on PC</strong>: copy the clip across and
          load it here. If it was recorded in HEVC and will not open, convert
          it to a standard MP4 with the{' '}
          <Link to="/tools/video-converter" className={link}>
            video converter
          </Link>{' '}
          first. <strong>How to trim a video on Chromebook</strong> is the
          same four steps, since MP4 export is supported in Chrome. And for{' '}
          <strong>how to trim a video on Windows without software</strong>{' '}
          you have to buy, open this page in Chrome or Edge, where MP4 export
          is available, and follow the steps above. No paid editor and no
          trial that stamps a watermark.
        </p>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. Won&rsquo;t Open, No Sound, MP4 Unavailable: Fixes
        </h3>
        <p>
          <strong>MOV file won&rsquo;t open in Chrome or Firefox?</strong>{' '}
          iPhones often record in HEVC (H.265), which Chrome and Firefox
          often cannot play, while Safari usually can; AVI and WMV are
          similar. Convert the file to a standard MP4 with the{' '}
          <Link to="/tools/video-converter" className={link}>
            video converter
          </Link>{' '}
          and load the MP4 here.
        </p>
        <p>
          <strong>Trimmed video has no sound?</strong> Check that{' '}
          <em>Keep audio</em> was ticked. If it was, the result card says{' '}
          <em>no audio</em> when the source&rsquo;s sound track could not be
          read, and the picture exports without it. Converting the source to a
          standard MP4 with the video converter and trimming that copy may
          bring the sound back. If you only wanted the sound, the{' '}
          <Link to="/tools/mp4-mp3" className={link}>
            MP4 to MP3 converter
          </Link>{' '}
          handles that instead.
        </p>
        <p>
          <strong>MP4 unavailable?</strong> MP4 export works in Chrome, Edge
          and Safari 16.4 or later. Elsewhere, including Firefox, export WebM
          and convert it afterwards.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>&ldquo;End must be after start&rdquo;</strong> means the
            end point sits at or before the start; press{' '}
            <em>Set end = player time</em> again further along.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Video Trimmer
        </h3>
        <p>
          Plenty of sites offer a <strong>video cutter online</strong>; many
          want an account, stamp a logo on the result or push a full editor
          for a ten-second job. If you searched for a{' '}
          <strong>video trimmer no watermark</strong> after the last one
          branded your clip, this one never does. It is also a{' '}
          <strong>private video trimmer</strong>: your files are never stored
          on our servers and nothing is retained once you are done. Here is
          what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Video trimmer, no watermark', 'Nothing is stamped on your clip, ever.'],
            ['Free, with no account', 'No sign-up and no card, just load a video and trim.'],
            ['Cuts on the exact frame', 'The clip starts where you set it, with no frozen opening.'],
            ['Your footage stays private', 'Files are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your videos are never used to train models, by policy.'],
            ['Controls that match the job', 'Set points from the player or by the second, choose format, size and frame rate, then preview.'],
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
          <Link to="/tools" className={link}>
            free file tools
          </Link>{' '}
          built on the same terms. Audio only? The{' '}
          <Link to="/tools/audio-trimmer" className={link}>
            audio trimmer
          </Link>{' '}
          trims MP3 and WAV files.
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
              'How do I trim a video online for free?',
              'Load the video into the tool at the top of this page, set the start and end with the Set start and Set end buttons or by typing seconds, and press Trim & export. There is no account and no watermark, and your original file is left untouched.',
            ],
            [
              'Is my video private when I trim it here?',
              'Your files are never stored on our servers and nothing is retained after your session. Videos are never used for training.',
            ],
            [
              'Can I cut several parts out of one video at once?',
              'Not in one run. The trimmer exports one continuous range each time, so run it once per clip you want. It does not join clips, so it cannot remove a middle section and close the gap.',
            ],
            [
              'Does trimming reduce video quality?',
              'Every clip is re-encoded so that the cut lands on the exact frame, which means it is never a bit-for-bit copy of the source. Choosing Original resolution and the frame rate closest to your source keeps the clip as close to the original as the tool allows. If you need a smaller file afterwards, use the video compressor.',
            ],
            [
              'Can I trim a YouTube video by pasting its link?',
              'No. The tool works on a video file you already have, not on a web address. Load a file you have the right to use.',
            ],
            [
              'Can I save the clip as MOV or as a GIF?',
              'The trimmer outputs MP4 or WebM. For MOV and other containers, convert the trimmed clip with the video converter. For a looping animation, use the MP4 to GIF converter or the GIF maker.',
            ],
            [
              'How do I make the trimmed clip small enough for Discord or email?',
              'Choosing 720p or 480p makes the clip lighter, but the trimmer does not aim for a target file size. Run the finished clip through the video compressor for that.',
            ],
            [
              'Can I mute the video or change its speed while trimming?',
              'You can untick Keep audio for a silent clip. To mute a full-length video use the video muter, to pull the sound out as an MP3 use the MP4 to MP3 converter, and to speed a clip up or slow it down use the video speed tool.',
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
          Clip trimmed and ready for the next step? Shrink it for sharing with
          the{' '}
          <Link to="/tools/video-compressor" className={link}>
            video compressor
          </Link>
          , turn it into a looping animation with the{' '}
          <Link to="/tools/mp4-gif" className={link}>
            MP4 to GIF converter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/gif-maker" className={link}>
            GIF maker
          </Link>
          , silence it with the{' '}
          <Link to="/tools/video-muter" className={link}>
            video muter
          </Link>
          , keep only the sound with the{' '}
          <Link to="/tools/mp4-mp3" className={link}>
            MP4 to MP3 converter
          </Link>
          , or change its pace with the{' '}
          <Link to="/tools/video-speed" className={link}>
            video speed tool
          </Link>
          . Curious how tools like this are built? Our free{' '}
          <Link to="/learn/full-stack-web" className={link}>
            full-stack web development course
          </Link>{' '}
          starts there.
        </p>
      </div>
    </article>
  );
}
