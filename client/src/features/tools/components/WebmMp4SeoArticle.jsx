import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clapperboard,
  Film,
  Globe,
  HelpCircle,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the WebM to MP4 tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool works both ways, so MP4 to WebM gets its own section rather
 *    than a footnote. Web developers searching for it are a real audience.
 *
 * 2. Every conversion re-encodes. The copy says so and explains what the
 *    Resolution, Frame rate and Quality controls actually change, instead of
 *    promising "no quality loss".
 *
 * 3. Limits are stated plainly (one file per run, MP4 or WebM only, no
 *    upscaling, no subtitles or extra audio tracks) and each is routed to the
 *    sibling tool that does the job, where one exists.
 */
export default function WebmMp4SeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">WebM to MP4</span> (and MP4 to WebM): Formats, Settings and Fixes for Videos That Won&rsquo;t Play
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A screen recording that refuses to open on an iPhone. A clip QuickTime
        rejects and WhatsApp will not send. Usually the file ends in{' '}
        <em>.webm</em>, and the fix is the same: turn the <strong>WebM to MP4</strong>. This guide shows how to{' '}
        <strong>convert WebM to MP4</strong> for free, what the resolution,
        frame rate and quality settings really do, how to go the other way
        with <strong>MP4 to WebM</strong> for a website, and &mdash; honestly
        &mdash; what this <strong>WebM converter</strong> leaves to other tools.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/webm-mp4.webp"
            alt="A phone on a small tripod recording the sea from a beach"
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
              Same video, different wrapper and codecs. MP4 plays almost
              everywhere; WebM is built for the web page.
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
            ['#webm-vs-mp4', '1. WebM vs MP4: What Each Format Is For'],
            ['#how-to-convert', '2. How to Convert WebM to MP4 in Four Steps'],
            ['#settings', '3. Converting WebM to MP4 Without Losing Quality'],
            ['#mp4-to-webm', '4. MP4 to WebM for a Website, Plus MOV and MKV'],
            ['#fix-playback', '5. Why Won’t My WebM Play? Fixes That Work'],
            ['#use-cases', '6. Screen Recordings, OBS, WhatsApp, PowerPoint, iMovie'],
            ['#why-cortexis', '7. Why Use Cortexis for WebM to MP4'],
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
      <section id="webm-vs-mp4" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          1. WebM vs MP4: What Each Format Is For
        </h3>
        <p>
          Both are containers wrapping a video and an audio stream; what
          differs is the codecs inside and who supports them. The{' '}
          <strong>webm vs mp4</strong> question is really about where the
          video goes next.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500 shrink-0" /> WebM
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              An open, royalty-free format from the{' '}
              <a
                href="https://www.webmproject.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold underline hover:text-orange-700"
              >
                WebM Project
              </a>
              , usually carrying VP8 or VP9 video with Opus or Vorbis audio.
              Built for web pages, it is the default of many screen
              recorders. Pick it for video on your own site.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-orange-500 shrink-0" /> MP4
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The everyday format of phones, TVs, editors and messaging apps,
              normally holding{' '}
              <a
                href="https://www.itu.int/rec/T-REC-H.264"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold underline hover:text-orange-700"
              >
                H.264
              </a>{' '}
              video with AAC audio. Pick it whenever the video has to be
              played, edited, presented or sent to somebody else.
            </p>
          </div>
        </div>
        <p>
          That split explains the frustration. Photos, QuickTime Player,
          iMovie, many smart TVs and most social platforms expect MP4. A WebM
          is not broken; the player was simply never taught it.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert WebM to MP4 in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert WebM to MP4</strong> with the tool
          above. No account, no sign-up and no watermark stamped on the
          result.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the video.</strong> Drop it onto{' '}
            <em>1. Choose video</em>. Its dimensions and running time appear,
            confirming it was read correctly.
          </li>
          <li>
            <strong>Confirm the output.</strong> A WebM is pre-set to{' '}
            <em>MP4 (H.264/VP9 + AAC/Opus)</em>; anything else is pre-set to
            WebM.
          </li>
          <li>
            <strong>Adjust if needed.</strong> The settings are explained
            below; the defaults suit most recordings.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert</em>,
            play the preview, then save. The download keeps the original name,
            and the result card shows the new size and whether audio was
            kept.
          </li>
        </ol>
        <p>
          MP4 output is available in Chrome 94 or later, Edge, and Safari
          16.4 or later; in Firefox and older versions the tool says so and
          offers WebM instead. That makes <strong>how to convert WebM to MP4 on Windows</strong>{' '}
          a matter of opening this page in Chrome or Edge, and{' '}
          <strong>how to convert WebM to MP4 on Mac</strong> a matter of using
          an up-to-date Safari or Chrome.
        </p>
        <p>
          Before you press Convert, it helps to know what you want the MP4
          for. Sending a clip in a chat app? 720p with a medium Quality is a
          sensible start. Editing it further or presenting it on a big
          screen? Keep Original resolution and push Quality up. You can
          always convert again with different settings if the first result
          is too large or too soft, and the preview lets you check before
          you save anything.
        </p>
      </section>

      {/* 3 */}
      <section id="settings" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. Converting WebM to MP4 Without Losing Quality
        </h3>
        <p>
          Every conversion here re-encodes the video. Nothing is copied
          across untouched, so the honest version of{' '}
          <strong>webm to mp4 without losing quality</strong> is &ldquo;without
          losing quality you can see&rdquo;, and the settings decide how close
          you get.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Resolution.</strong> <em>Original</em> keeps the source
            size. 1080p, 720p, 480p and 360p scale down only, never up, so a
            720p recording set to 1080p stays 720p. Choosing{' '}
            <strong>webm to mp4 720p</strong> is the simplest way to get a
            smaller file for sharing.
          </li>
          <li>
            <strong>Frame rate.</strong> <em>Auto</em> uses 30; 24, 25 and 60
            are also available. Use 60 for gameplay.
          </li>
          <li>
            <strong>Quality.</strong> A 1 to 10 slider, tiny to max. Higher
            means a sharper picture and a bigger file; good or high keeps
            small on-screen text crisp.
          </li>
          <li>
            <strong>Keep audio.</strong> On by default. Untick it for a
            silent clip.
          </li>
        </ul>
        <p>
          For the most faithful copy, keep Original resolution and high or
          max Quality. The MP4 carries H.264 wherever available, which is
          what <strong>webm to mp4 h264</strong> searchers need; otherwise VP9
          inside MP4 is used, and if neither exists the tool tells you.
        </p>
        <p>
          File got bigger? Screen-recorder WebMs are often lean, and a high
          Quality setting can give the MP4 more bitrate than the source had.
          Lower the slider or resolution, or use the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          when you need to hit a particular size.
        </p>
      </section>

      {/* 4 */}
      <section id="mp4-to-webm" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          4. MP4 to WebM for a Website, Plus MOV and MKV
        </h3>
        <p>
          The same page is an <strong>MP4 to WebM converter online</strong>.
          If you are working out{' '}
          <strong>how to convert MP4 to WebM for website</strong> use, the
          usual pattern is to offer both files in one video tag, WebM first
          and MP4 as the fallback, so every visitor gets a version their
          player understands.
        </p>
        <p>
          Choose an MP4 and the output is already set to{' '}
          <em>WebM (VP8/VP9 + Opus)</em>. Two differences from MP4 output:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>It runs in real time.</strong> A WebM takes as long to
            produce as the video takes to play, and the tool reminds you:
            &ldquo;WebM is recorded in real time (duration = video
            length).&rdquo; A three-minute clip takes about three minutes.
          </li>
          <li>
            <strong>Quality is fixed.</strong> WebM output uses one fixed
            target bitrate, so the Quality slider has no effect. Resolution,
            frame rate and Keep audio still apply. To make the WebM lighter,
            lower the resolution.
          </li>
        </ul>
        <p>
          Input is not limited to MP4. <strong>MOV to WebM</strong> works for
          most iPhone and Mac clips, and <strong>MKV to WebM</strong> works
          when the MKV holds widely supported codecs. If a file uses a codec
          or container the tool cannot read, it tells you plainly rather
          than producing a broken result. For those files, and for
          any target other than MP4 or WebM, the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          covers MOV, AVI, MKV and more.
        </p>
      </section>

      {/* 5 */}
      <section id="fix-playback" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why Won&rsquo;t My WebM Play? Fixes That Work
        </h3>
        <p>
          If you are asking <strong>why won&rsquo;t my WebM play</strong>,
          the answer is almost always support, not damage. These are the
          cases people run into most.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>WebM not playing on iPhone.</strong> Photos and many iOS
            apps do not accept WebM. The converted MP4 behaves like any other
            video.
          </li>
          <li>
            <strong>QuickTime can't open WebM.</strong> QuickTime Player
            on a Mac has no WebM support, so the file is not damaged. Convert it
            to an H.264 MP4 and it opens straight away.
          </li>
          <li>
            <strong>Can't upload WebM to Instagram?</strong> Instagram
            and most social apps expect MP4, so the post is rejected. Convert
            to MP4 first, choosing 1080p or 720p, then post the new file.
          </li>
          <li>
            <strong>WebM no sound after converting.</strong> Check first that{' '}
            <em>Keep audio</em> was ticked. If it was and the result card says
            &ldquo;no audio&rdquo;, the soundtrack used a codec that could not
            be read, and it was dropped rather than stopping the whole job. Try
            again in an up-to-date Chrome or Edge, or try the sound on its
            own with the{' '}
            <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              audio converter
            </Link>{' '}
            if the sound is all you need.
          </li>
        </ul>
        <p>
          Searching <strong>how to open WebM file</strong> types at all? Drag
          one into Chrome, Edge or Firefox to watch it; to send, edit or
          present it, convert it.
        </p>
      </section>

      {/* 6 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-orange-500 shrink-0" />
          6. Screen Recordings, OBS, WhatsApp, PowerPoint, iMovie
        </h3>
        <p>
          People <strong>convert screen recording WebM to MP4</strong> files
          because the recorder chose WebM and the next person cannot open
          it. Specific situations:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>OBS WebM to MP4.</strong> Converting an OBS WebM gives
            an MP4 that most video editors will import.
          </li>
          <li>
            <strong>WebM to MP4 for WhatsApp.</strong> WhatsApp sends MP4
            reliably. 720p and a medium Quality keep the clip small enough to
            share comfortably.
          </li>
          <li>
            <strong>WebM to MP4 for PowerPoint.</strong> Microsoft recommends
            MP4 with H.264 video and AAC audio for embedded video, which is
            what this produces wherever H.264 and AAC are available. Insert the
            converted MP4 into your slide instead of the WebM.
          </li>
          <li>
            <strong>WebM to MP4 for iMovie.</strong> iMovie and Final Cut do
            not import WebM. Convert at Original resolution and high Quality
            so the edit starts from the best copy.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>What this tool does not do.</strong> It converts one video
            per run, only between MP4 and WebM. It cannot trim (use the{' '}
            <Link to="/tools/video-trimmer" className="font-semibold underline">video trimmer</Link>{' '}
            first), change speed (the{' '}
            <Link to="/tools/video-speed" className="font-semibold underline">video speed changer</Link>
            ), make a GIF (<Link to="/tools/mp4-gif" className="font-semibold underline">MP4 to GIF</Link>{' '}
            or the <Link to="/tools/gif-maker" className="font-semibold underline">GIF maker</Link>
            ), or pull out just the sound (<Link to="/tools/mp4-mp3" className="font-semibold underline">MP4 to MP3</Link>
            ). It does not upscale, keep subtitles, chapters or extra audio
            tracks, or fetch videos from a link: you need the video file
            itself.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis for WebM to MP4
        </h3>
        <p>
          Plenty of pages offer a <strong>WebM to MP4 converter online
          free</strong>, then cap sizes, demand sign-ups or brand the output.
          Here is what you get instead.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no watermark', 'No account, no email and no logo on the result. This is a free WebM to MP4 converter without watermark in the plain sense: the video you download is only your video.'],
            ['Both directions on one page', 'WebM to MP4 for playback and editing, MP4 to WebM for your website, with the output pre-set to the format you most likely want.'],
            ['No size cap from us', 'Anyone searching WebM to MP4 no file size limit has usually been turned away elsewhere. We set no file size cap and no sign-up wall. Long, high-resolution recordings take longer; if one struggles, trim it first with the video trimmer.'],
            ['Real control over quality', 'Resolution, frame rate, a ten-step Quality slider and a Keep audio switch, with a preview player before you save.'],
            ['Your recordings stay private', 'Screen recordings often show work content. Files are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your videos are never used to train anything. What you convert stays yours.'],
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
            free file tools
          </Link>{' '}
          built on the same terms. Going the other way with an animation?{' '}
          <Link to="/tools/gif-to-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF to MP4
          </Link>{' '}
          turns a heavy GIF into a light video.
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
              'How do I convert WebM to MP4 for free?',
              'Choose the WebM in the tool at the top of this page, leave the output on MP4 and press Convert. Preview the result and download it. There is no account, no watermark and no charge.',
            ],
            [
              'Will converting WebM to MP4 reduce quality?',
              'Every conversion re-encodes the video, so it is never a bit-for-bit copy. Keep Resolution on Original and set Quality to high or max, and the difference is very hard to see.',
            ],
            [
              'Why does my WebM not play on iPhone or in QuickTime?',
              'Photos and QuickTime Player do not support WebM, so the file is not damaged, just unsupported. Converting it to an H.264 MP4 makes it open on iPhone, iPad and Mac like any other video.',
            ],
            [
              'My converted video has no sound. What happened?',
              'Either Keep audio was unticked, or the soundtrack used a codec that could not be read, so it was dropped and the result is labelled no audio. Tick Keep audio and try again in an up-to-date Chrome or Edge.',
            ],
            [
              'Can I convert MP4 to WebM here too?',
              'Yes. Choose an MP4 and the output switches to WebM automatically. WebM output takes as long as the video plays and uses a fixed bitrate, so the Quality slider does not change it.',
            ],
            [
              'Why is MP4 not offered when I open the page?',
              'Creating MP4 needs Chrome 94 or later, Edge, or Safari 16.4 or later. Elsewhere, such as Firefox, the tool offers WebM only and says so. Open the page in Chrome, Edge or Safari to get MP4.',
            ],
            [
              'Can I convert several WebM files at once, or make the file smaller?',
              'The tool handles one video per run. To reach a specific size, for email or chat limits, convert first and then use the video compressor, which is built for that job.',
            ],
            [
              'Is it safe to convert private screen recordings?',
              'Yes. Your videos are never stored on our servers, nothing is retained after your session, and nothing is ever used for training.',
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
          Converted and ready for the next step? Shrink it for email with the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          , cut it down with the{' '}
          <Link to="/tools/video-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video trimmer
          </Link>
          , silence it with the{' '}
          <Link to="/tools/video-muter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video muter
          </Link>
          , or keep only the soundtrack with{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>
          . Audio-only WebM or OGG files belong in{' '}
          <Link to="/tools/ogg-to-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            OGG to MP3
          </Link>{' '}
          or the{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio converter
          </Link>
          . And if you want to build video pages of your own, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the HTML5 video groundwork.
        </p>
      </div>
    </article>
  );
}
