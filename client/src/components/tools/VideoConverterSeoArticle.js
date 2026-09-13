import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clapperboard,
  Film,
  Gauge,
  HelpCircle,
  Layers,
  MonitorPlay,
  Settings2,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the video converter tool.
 *
 * Written against what VideoConverter.js actually does, which shapes the
 * article more than the keyword list would on its own.
 *
 * Every job is a full re-encode with fixed settings per format: MP4, MOV and
 * MKV come out as H.264 (CRF 23, yuv420p) with 128 kbps AAC, and MP4/MOV get
 * faststart; WebM is VP8 with Opus; AVI is MPEG-4 Part 2 with MP3. There is no
 * remux or stream-copy path, so the piece never promises "without losing
 * quality" and section 7 says so outright. The output list is exactly those
 * five formats — FLV and WMV are accepted in but never written out — and there
 * is no MP3, WAV or GIF output, so those readers are sent to the sibling tools.
 *
 * The resolution control is a maximum height (480/720/1080) that only ever
 * downscales, so section 6 is about capping, never enlarging, and the "too
 * big for WhatsApp" reader is routed to the video compressor, which has an
 * adjustable quality slider this tool does not.
 *
 * The angle is the output profile rather than the format list: H.264 + AAC +
 * yuv420p + faststart is precisely the recipe that makes a file play on an
 * iPhone, a smart TV, Windows and Safari, and stream before it has finished
 * downloading, so the symptom-shaped searches are answered by explaining that
 * recipe rather than by listing extensions.
 *
 * Declined: the "no file size limit" phrase is not promised — there is no cap
 * or quota, but multi-gigabyte files are outside what the tool is built for,
 * and the FAQ says that plainly. The "private video converter" phrase that
 * asserts where the files stay is also not used verbatim; privacy is sold as
 * an outcome (never stored on our servers, never retained, never used for
 * training) and nothing more. Selecting a file is click-to-choose only, so the
 * steps never mention dragging.
 */
export default function VideoConverterSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">Video Converter Online Free</span>: Convert to MP4, MOV, MKV, WebM and AVI That Actually Play
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A video that plays perfectly on one device and refuses on the next is
        almost never broken. It is wrapped in a container or encoded with a codec
        that the second device does not understand. A{' '}
        <strong>video converter online free</strong> fixes that by rewriting the
        file into a format the stubborn device does accept, which nearly always
        means you need to <strong>convert video to MP4</strong>. This guide
        explains what a <strong>video converter</strong> really changes, the exact
        output profile this tool produces and why that profile cures the most
        common playback complaints, how to cap resolution in the same pass, and
        what the tool honestly will not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/video-converter.webp"
            alt="Video converter online free - convert MOV, MKV, WebM, AVI, FLV and WMV to MP4 with an optional 480p, 720p or 1080p cap"
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
              Seven formats in, five formats out, and an optional resolution cap
              applied in the same pass.
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
            ['#container-vs-codec', '1. What a Video Converter Actually Changes'],
            ['#how-to-convert', '2. How to Use This Video Converter Online Free'],
            ['#compatibility-recipe', '3. The Compatibility Recipe: H.264, AAC, yuv420p, Faststart'],
            ['#output-formats', '4. The Five Output Formats and When to Pick Each'],
            ['#playback-problems', '5. Fixing Playback on iPhone, Smart TV, Windows and Safari'],
            ['#resolution-cap', '6. Capping Resolution at 480p, 720p or 1080p'],
            ['#limits', '7. What This Tool Does Not Do (and Where to Go Instead)'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Video Converter'],
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
      <section id="container-vs-codec" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Video Converter Actually Changes
        </h3>
        <p>
          The extension on a video file names its <strong>container</strong>, not
          its contents. MP4, MOV, MKV, WebM and AVI are all boxes. Inside each box
          are separate streams &mdash; a video stream, an audio stream, sometimes
          subtitles &mdash; and each stream is written in a{' '}
          <strong>codec</strong>: H.264, HEVC, VP8, VP9, AV1 for pictures; AAC,
          MP3, Opus for sound.
          A player has to understand both the box and every codec inside it
          before anything appears on screen.
        </p>
        <p>
          That split explains almost every &ldquo;it won&rsquo;t play&rdquo;
          complaint. An MKV with H.264 inside is refused by an iPhone because iOS
          does not open Matroska boxes, even though it plays H.264 happily. An
          MP4 with 10-bit HEVC inside opens on an older laptop, plays the sound,
          and shows a black frame, because the box was fine and the video codec
          was not. MDN keeps a plain-language{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            guide to web video codecs
          </a>{' '}
          that is worth ten minutes if you want the full picture.
        </p>
        <p>
          A proper <strong>online video converter</strong> therefore has to be
          able to change both layers at once: put the streams in a new box, and
          re-encode them into codecs the target device supports. This tool always
          does both, which is what makes it a fix for compatibility problems
          rather than a rename with extra steps.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use This Video Converter Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark on the result. If you were looking
          for a <strong>video converter no sign up</strong> required, this is
          one, and it is free every time rather than free for a trial. To
          convert a file with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your video', 'Click the panel above and pick the file. MP4, MOV, MKV, WebM, AVI, FLV and WMV are all accepted as input, one file per run.'],
            ['Pick a format and a max height', 'Choose MP4, WebM, MKV, MOV or AVI as the target. Leave the resolution on Original, or cap it at 480p, 720p or 1080p in the same pass.'],
            ['Convert, preview, download', 'A progress bar tracks the job. The finished video plays inline so you can check it, then one click saves it under your original file name with the new extension.'],
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
          The readout after conversion shows the size of the new file next to the
          format you chose, so you can see straight away whether a 720p cap
          brought a large clip down to something sendable. If the result is not
          what you wanted, change the settings and run it again; the original is
          untouched.
        </p>
      </section>

      {/* 3 */}
      <section id="compatibility-recipe" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Compatibility Recipe: H.264, AAC, yuv420p and Faststart
        </h3>
        <p>
          Most converter pages never tell you what codec comes out. It matters
          more than the extension. When you choose MP4, MOV or MKV here, the
          result is always the same four-part profile, and each part closes off
          a specific way for a file to fail.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              H.264 video
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The most widely supported video codec there is. Phones, smart
              TVs, games consoles, slide-deck apps and web players in everyday
              use all decode it. If you were searching for a way to
              convert video to H.264 MP4 online because a CMS or learning
              platform demands it, this is that.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              AAC audio at 128 kbps
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The audio codec the MP4 family was designed around. Sources with
              Opus, Vorbis, FLAC or multichannel audio that an iPhone or TV
              refuses are rewritten to plain stereo AAC, which everything plays.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              yuv420p pixel format
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The one nobody mentions. Screen recorders and editors often export
              10-bit or 4:4:4 colour, which many hardware decoders cannot handle.
              That is the classic cause of a video that plays sound but shows no
              picture. Forcing 8-bit 4:2:0 removes it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Faststart for MP4 and MOV
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The index that tells a player where every frame lives is moved to
              the front of the file. Without it, a video uploaded to a website
              will not play until it is fully downloaded. With it, playback
              starts as soon as the first bytes arrive.
            </p>
          </div>
        </div>
        <p>
          The quality setting behind that profile is fixed at{' '}
          <strong>CRF 23</strong>, the standard general-purpose level for H.264.
          It is not a lossless copy, and section 7 explains why that distinction
          matters, but for anything destined for a phone, a TV, a chat app or a
          web page it is the right trade between size and sharpness.
        </p>
      </section>

      {/* 4 */}
      <section id="output-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          4. The Five Output Formats and When to Pick Each
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>MP4 (H.264 / AAC)</strong> &mdash; the default and almost
            always the right answer. Choose it to{' '}
            <strong>convert MOV to MP4</strong> from an iPhone or Mac,{' '}
            <strong>convert MKV to MP4</strong> for a TV or phone,{' '}
            <strong>convert WebM to MP4</strong> from a screen recording, or{' '}
            <strong>convert AVI to MP4</strong> from an old camcorder.
          </li>
          <li>
            <strong>MOV (QuickTime)</strong> &mdash; the same H.264/AAC streams
            in Apple&rsquo;s container. Use it to <strong>convert MP4 to MOV</strong>{' '}
            when iMovie, Final Cut or a Mac-based client&rsquo;s workflow asks for
            QuickTime specifically.
          </li>
          <li>
            <strong>MKV (Matroska)</strong> &mdash; again H.264/AAC, in the
            container media-server and archive setups prefer. Pick it when the
            destination is a home media library rather than a device.
          </li>
          <li>
            <strong>WebM (VP8 / Opus)</strong> &mdash; the royalty-free web pair
            defined in{' '}
            <a
              href="https://www.rfc-editor.org/rfc/rfc6386"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              RFC 6386
            </a>{' '}
            and RFC 6716. Developers <strong>convert MP4 to WebM</strong> for a
            lighter background loop or a second source in a video tag.
          </li>
          <li>
            <strong>AVI (MPEG-4 Part 2 / MP3)</strong> &mdash; a legacy target
            for older Windows editors and hardware that predate H.264. Only choose
            it when something specifically demands AVI.
          </li>
        </ul>
        <p>
          On the input side the list is wider than the output side. Flash-era
          downloads and Windows Movie Maker exports are both accepted, so you can{' '}
          <strong>convert FLV to MP4 online</strong> or{' '}
          <strong>convert WMV to MP4</strong> from the same panel. Those two are input-only: the tool reads them but does not write
          them, and it does not write 3GP, TS, M4V, HEVC, VP9 or AV1 either.
        </p>
      </section>

      {/* 5 */}
      <section id="playback-problems" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorPlay className="w-6 h-6 text-orange-500 shrink-0" />
          5. Fixing Playback on iPhone, Smart TV, Windows and Safari
        </h3>
        <p>
          Nearly every playback complaint has the same answer &mdash; convert to
          MP4 with the recipe from section 3 &mdash; but it helps to know which
          layer was the problem, because it tells you the fix is real rather than
          a guess.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Video won&rsquo;t play on iPhone</h4>
        <p>
          Someone sent an MKV, AVI, WMV or WebM and iOS shows a grey box. iOS
          only opens MP4 and MOV containers with H.264 or HEVC inside. Convert to
          MP4 here and AirDrop, email or iMessage the result. This is also how
          you <strong>convert video for iPhone without iTunes</strong>: the MP4
          that comes out is the universal iOS profile.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">MKV won&rsquo;t play on TV</h4>
        <p>
          Smart TVs and USB media players are picky about containers and even
          pickier about audio. An MKV that refuses to open, or opens silently, is
          usually carrying a codec the TV has no decoder for. MP4 with H.264 and
          stereo AAC is the profile TV makers most commonly document as supported.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">MOV file won&rsquo;t open on Windows</h4>
        <p>
          An iPhone clip lands on a Windows PC and the default player, Teams or
          PowerPoint will not touch it. Newer iPhones record HEVC inside MOV, and
          Windows often lacks the HEVC decoder. Converting to MP4 rewrites the
          video as H.264, which Windows plays out of the box.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">WebM not playing in Safari</h4>
        <p>
          Screen recorders and chat apps save WebM, and Safari, iMessage and
          most video editors ignore it. Convert WebM to MP4 and it will play on
          the Mac, on the phone and drop into any editor.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Video plays sound but no picture</h4>
        <p>
          The container was accepted, the audio decoded, and the video codec or
          pixel format was not. 10-bit HEVC and 4:4:4 screen captures are the
          usual culprits. Converting to MP4 here forces H.264 in yuv420p, which
          is exactly the case this recipe was chosen to cure. The same steps
          work if you need to <strong>convert MOV to MP4 on a Chromebook</strong>:
          choose the file, pick MP4, convert.
        </p>
      </section>

      {/* 6 */}
      <section id="resolution-cap" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          6. Capping Resolution at 480p, 720p or 1080p in the Same Pass
        </h3>
        <p>
          The second dropdown is a <strong>maximum height</strong>, and the word
          maximum is doing real work. Pick 720p and a 4K or 1080p source is
          scaled down to 720 pixels tall with its aspect ratio kept and the width
          adjusted to match. Pick 1080p on a source that is already 720p and
          nothing changes; the tool never enlarges a video, because upscaling
          only makes a soft file bigger.
        </p>
        <p>
          This is what makes it possible to <strong>convert video to 720p online</strong>{' '}
          and change format in one job rather than two. A phone or drone clip
          that needs to become a standard file is a single run: choose MP4, choose
          1080p, and you <strong>convert 4K video to 1080p MP4 online free, no
          watermark</strong>, with the H.264/AAC profile that every editor and
          player accepts. Leave the setting on Original to keep 4K as it is.
        </p>
        <p>
          A resolution cap also shrinks the file, often substantially, but it is
          a blunt instrument for that job. If your real problem is a{' '}
          <strong>video too big to send on WhatsApp</strong> and you are happy
          with the format, use the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          instead. It has an adjustable quality slider and a width-based
          downscale, so you can dial in a target size rather than picking from
          three heights.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Does Not Do (and Where to Go Instead)
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>It is not lossless.</strong> Every job re-encodes the video at
            the fixed quality described in section 3. There is no
            change-the-container-only mode, so &ldquo;convert without losing
            quality&rdquo; is not a promise made here. At CRF 23 the difference
            is invisible for ordinary footage, but a master file for archiving
            should be kept in its original form.
          </li>
          <li>
            <strong>No quality, bitrate, frame-rate or codec choice.</strong>{' '}
            Settings are fixed per format. That keeps the tool predictable; it
            also means you cannot ask for HEVC, VP9, AV1, 60 fps or a specific
            bitrate.
          </li>
          <li>
            <strong>No audio extraction and no GIF.</strong> To pull the
            soundtrack out as MP3, use{' '}
            <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to MP3
            </Link>
            ; to turn a clip into an animation, use{' '}
            <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to GIF
            </Link>{' '}
            or the{' '}
            <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF maker
            </Link>
            .
          </li>
          <li>
            <strong>No trimming, merging, cropping, rotating or subtitles.</strong>{' '}
            It converts the whole file as it is.
          </li>
          <li>
            <strong>One file per run.</strong> There is no batch mode. Convert
            a second file by choosing it after the first has finished.
          </li>
          <li>
            <strong>No links or cloud imports.</strong> Files come from your file
            picker, not from a URL.
          </li>
          <li>
            <strong>No hard &ldquo;no file size limit&rdquo; promise.</strong>{' '}
            If you searched for an{' '}
            <strong>online video converter no file size limit</strong> after
            hitting a cap elsewhere: there is no cap, quota or paid tier written
            into this tool, but it is built for ordinary clips, not multi-gigabyte
            recordings, and a file of that size may fail to finish. Hundreds of
            megabytes is the comfortable range.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Video Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['A free online video converter with no tier', 'No account, no email, no daily count and no watermark held back for paying users. Every conversion is the full conversion.'],
            ['A free video converter no watermark, ever', 'Nothing is stamped across the corner of your video, not on the preview and not on the download.'],
            ['It tells you what comes out', 'H.264, AAC, yuv420p, faststart. You know the exact profile before you convert, which is the difference between fixing a playback problem and hoping.'],
            ['Format change and resolution cap in one pass', 'Choose MP4 and 720p together instead of running two tools and re-encoding twice.'],
            ['Your videos stay private', 'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training or analytics.'],
            ['Preview before you download', 'The converted video plays inline with its size shown beside it, so a wrong setting costs seconds rather than a download.'],
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
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress
          </Link>{' '}
          the result, convert its{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio
          </Link>{' '}
          separately, or find any other format pair through the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
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
              'Is this video converter online free, or free for the first few files?',
              'Free every time. There is no account, no email step, no daily quota and no paid tier with the real features behind it. Choose a file, pick a format, convert, download.',
            ],
            [
              'Does the converted video have a watermark?',
              'No. Nothing is added to the picture at any stage. What you download is your video in the new format and nothing else.',
            ],
            [
              'Which format should I choose if I just want the video to play everywhere?',
              'MP4. It comes out as H.264 video with AAC audio in yuv420p with faststart, which is the profile iPhones, Android phones, smart TVs, Windows, PowerPoint and every web player accept. Only choose MOV, MKV, WebM or AVI when something specifically asks for it.',
            ],
            [
              'Why does my video play sound but no picture, and will converting fix it?',
              'The player understood the container and the audio but not the video codec or pixel format, which is common with 10-bit HEVC and 4:4:4 screen captures. Converting to MP4 here rewrites the video as 8-bit H.264 in yuv420p, which is exactly the fix.',
            ],
            [
              'Will converting lose quality?',
              'Every conversion re-encodes the video at a fixed quality setting (CRF 23 for H.264), so it is not a bit-for-bit copy. For ordinary footage the difference is not visible, but keep your original if it is a master file, and do not convert the same clip repeatedly.',
            ],
            [
              'Is there a file size limit?',
              'There is no cap or quota written into the tool, but it is built for ordinary clips rather than multi-gigabyte recordings, and a file of that size may not finish. Hundreds of megabytes is the comfortable range. Capping the resolution at 720p in the same pass makes the output considerably smaller.',
            ],
            [
              'Can I convert a video to MP3 or GIF with this tool?',
              'Not here; this tool writes MP4, WebM, MKV, MOV and AVI only. Use our MP4 to MP3 tool to pull out the soundtrack and MP4 to GIF to make an animation. Both are free on the same terms.',
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
          Need something else from the same clip? The{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          shrinks a file that is already in the right format,{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF
          </Link>{' '}
          turns a few seconds into a looping animation,{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>{' '}
          keeps only the sound, and{' '}
          <Link to="/tools/mp3-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP3 to MP4
          </Link>{' '}
          goes the other way when a platform insists on a video. If you would
          rather understand how video is served on the web than simply convert
          it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers media formats, the video tag and streaming from the ground up.
        </p>
      </div>
    </article>
  );
}
