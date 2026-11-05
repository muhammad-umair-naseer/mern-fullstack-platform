import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Film,
  HardDrive,
  HelpCircle,
  Layers,
  Send,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the video compressor.
 *
 * Written against what VideoCompressor.js actually exposes: four controls
 * (a CRF slider from 20 to 36, a max-width cap of 640/1280/1920/original, a
 * frame-rate limit of 24 or 30, and an AAC audio bitrate of 64/96/128 kbps)
 * and one output, an H.264 MP4. That shape decides the article. Section 3 is
 * built around the four controls because almost nobody else explains what a
 * "quality" slider is doing to a file, and section 4 maps each real-world
 * symptom (email cap, chat cap, huge screen recording, iPhone MOV) to the
 * control that fixes it.
 *
 * Several searched phrases are deliberately not promised. There is no
 * target-size box, so "compress video 100mb to 10mb" and "under 10mb" are
 * answered as a read-the-percentage-and-rerun loop, not a guarantee. There
 * is no lossless mode, so "without losing quality" is answered honestly:
 * every run re-encodes and CRF 20 is the gentlest setting, not a copy. The
 * output is always MP4, so "compress webm video online" gets a WebM in, MP4
 * out answer. "No file size limit" is not claimed as unlimited; very large
 * files can fail and the text says so. Privacy is described only as an
 * outcome (nothing stored, retained or analysed), never as a process. And no
 * before/after ratios are quoted anywhere, because the tool
 * prints the real percentage after each run and an invented number would be
 * worse than none.
 */
export default function VideoCompressorSeoArticle() {
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
        Free <span className="text-orange-600 dark:text-orange-400">Video Compressor</span>: The Four Settings That Decide a Video&rsquo;s File Size
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A video is the largest thing most people ever try to send. The email
        bounces, the chat app refuses it, the portal times out, and the
        phone quietly fills up. A <strong>video compressor</strong> fixes that
        by rebuilding the file smaller, and the whole trick is knowing which
        of four levers to pull. This guide explains why the file got so big,
        how to <strong>compress video online free</strong> with the tool
        above, what each control actually does to the result, and how to{' '}
        <strong>reduce video size</strong> for email, chat and the web without
        making it look worse than it needs to.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/video-compressor.webp"
            alt="A cinema camera rig with a large zoom lens and an attached monitor"
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
              Quality, width, frame rate and audio bitrate: the four controls
              that decide how small a video gets, and what it costs.
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
            ['#why-so-big', '1. Why Is My Video File So Big?'],
            ['#how-to-compress', '2. How to Compress Video Online Free'],
            ['#four-settings', '3. What the Four Video Compressor Settings Do'],
            ['#which-lever', '4. Which Setting to Turn for Your Problem'],
            ['#what-you-get', '5. What You Download: Always a Playable MP4'],
            ['#what-it-does-not-do', '6. What This Tool Does Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Video Compressor'],
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
      <section id="why-so-big" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Is My Video File So Big?
        </h3>
        <p>
          A video is a stack of pictures shown quickly, plus a sound track. Its
          size is the product of four things: how many pixels each picture has,
          how many pictures there are per second, how much detail is kept in
          each one, and how much room the audio is given. That is the entire
          theory behind every <strong>video compressor</strong> ever built.
        </p>
        <p>
          Modern phones push all four upward by default. A phone shooting 4K at
          60 frames per second produces four times the pixels of 1080p and
          twice the frames of ordinary video. Screen recorders do the same,
          capturing a full monitor at high frame rates. None of that is wrong
          for filming; it is simply more than an email attachment can carry.
        </p>
        <p>
          The format matters too. The result you download here is an{' '}
          <strong>H.264</strong> video with AAC audio inside an MP4 container,
          the combination that plays almost everywhere. The codec itself is
          defined in ISO/IEC 14496-10, and Mozilla&rsquo;s{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            web video codec guide on MDN
          </a>{' '}
          is a readable explanation of how codecs trade file size against
          detail.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress Video Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no watermark on the result. This is a{' '}
          <strong>video compressor with no signup</strong>, and the steps to{' '}
          <strong>compress video</strong> with the tool above are:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Select your video', 'Click the panel above and choose an MP4, MOV, MKV, WebM or AVI. One file at a time; the original size is shown at once.'],
            ['Set the four controls', 'Compression level, max width, frame rate limit and audio bitrate. The defaults suit most sharing jobs; section 3 explains when to move each one.'],
            ['Compress and download', 'A progress bar runs to 100%, the result plays in a preview, and the message states the exact percentage saved. Download it as name_compressed.mp4.'],
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
          Play the preview before you download. If it is still too large,
          raise the compression level or lower the width and run it again; a
          wrong guess costs you one more run and nothing else. Long,
          high-resolution clips take a while, and the percentage keeps moving
          so you can see it is working.
        </p>
      </section>

      {/* 3 */}
      <section id="four-settings" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-orange-500 shrink-0" />
          3. What the Four Video Compressor Settings Actually Do
        </h3>
        <p>
          Most tools hide everything behind a Low / Medium / High dropdown,
          which is convenient until it does not work. Here the four levers are
          exposed by name, and each one fixes a different problem.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Compression level (CRF 20 to 36)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              CRF is the constant rate factor, the standard H.264 quality dial.
              Lower keeps more detail and makes a bigger file; higher makes a
              smaller one. The slider labels the ranges: 20 to 23 High Quality,
              24 to 28 Balanced, 29 to 36 Smallest File Size. Default 28.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Max width (downscale only)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Caps the picture at 640, 1280 or 1920 pixels wide, or leaves it
              alone. It only ever shrinks: a 4K source capped at 1920 becomes
              1080p, a 720p source capped at 1920 stays 720p. The aspect ratio
              is always preserved. The default is 1280.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Frame rate limit (original, 24 or 30)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Sets the output frame rate. A 60 fps screen recording or phone
              clip brought to 30 has half as many pictures to store. Note that
              it sets the rate rather than only capping it, so leave it on
              Original if your source is already below 24.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Audio bitrate (64, 96 or 128 kbps)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The sound track is always rebuilt as AAC at the rate you choose.
              128 suits music, 96 is the default, 64 is plenty for speech. On
              a talking-head or screen recording the audio can be a surprising
              share of the total, so this is not the afterthought it looks like.
            </p>
          </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          What CRF should I use for video compression?
        </h4>
        <p>
          Start at 28 and look at the preview. For a clip that will be watched
          full-screen and judged on how it looks, drop to 23 or 24. For
          anything going into a chat or an email, 30 to 34 is fine and the
          saving is large. The honest answer to{' '}
          <strong>h264 crf 28 file size</strong> questions is that no fixed
          number exists: a static slide deck and a handheld sports clip at the
          same CRF produce wildly different files, because CRF fixes the
          quality and lets the size fall where it falls. The tool tells you the
          real figure the moment a run finishes.
        </p>
        <p>
          Two things people ask about the other levers. Yes, you can{' '}
          <strong>reduce video frame rate to lower file size</strong>, and on
          60 fps material it is one of the biggest single wins, at the cost of
          slightly less fluid fast motion. And yes, you can{' '}
          <strong>lower audio bitrate to reduce video size</strong>; on a
          voice recording, 64 kbps is close to free in audible terms.
        </p>
      </section>

      {/* 4 */}
      <section id="which-lever" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Send className="w-6 h-6 text-orange-500 shrink-0" />
          4. Video Too Large to Send? Which Setting to Turn for Your Problem
        </h3>
        <p>
          The same four controls, arranged by the situation that brought you
          here. One caveat applies to all: there is no box where you type a
          target size. You pick settings, read the percentage the tool reports,
          and go a step further if you need to. Two runs is normal.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Video file over the 25 MB email limit.</strong> To{' '}
            <strong>compress video for email</strong>, set width to 1280, CRF
            to 30, audio to 96 and frame rate to 30. Still over the line? Push
            CRF to 34. Attachments are watched in a small window, so 720p
            loses nothing that matters.
          </li>
          <li>
            <strong>Compress video for Discord under 10 MB.</strong> The
            hardest common target. Use 640 or 1280 width, CRF 34 to 36, 24 fps
            and 64 kbps audio. A long clip may not fit at any setting; the
            readout tells you immediately whether it did.
          </li>
          <li>
            <strong>Reduce video size for WhatsApp</strong> or any chat app.
            1280 width, CRF 30, 30 fps. Chat apps process large videos their
            own way; sending a file you have already sized keeps the decision
            in your hands.
          </li>
          <li>
            <strong>iPhone video too big to send.</strong> Phone MOV files are
            large and do not open everywhere. Leave width at 1280 or 1920, CRF
            at 28, and the output is an MP4 that plays on almost anything the
            recipient owns. One run covers{' '}
            <strong>convert MOV to MP4 and compress</strong> together.
          </li>
          <li>
            <strong>Screen recording file too large.</strong> Recordings are
            captured at full monitor resolution and often 60 fps. Cap the width
            at 1280 (or 1920 if text must stay crisp), set 30 fps, and choose
            64 kbps audio if it is narration. These shrink the most.
          </li>
          <li>
            <strong>Compress 4K video to 1080p.</strong> Set width to 1920 and
            leave the rest at default. Dropping 4K to 1080p removes three
            quarters of the pixels before the quality dial does anything. To{' '}
            <strong>reduce video resolution to 720p online</strong>, pick 1280
            instead.
          </li>
        </ul>
        <p>
          If you searched <strong>how to make a video file smaller</strong>{' '}
          with no particular destination in mind, the defaults already do most
          of the work: 1280 wide, CRF 28, original frame rate, 96 kbps audio.
        </p>
      </section>

      {/* 5 */}
      <section id="what-you-get" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          5. What You Download: Always a Playable MP4
        </h3>
        <p>
          Whatever you put in, the file you get back is an H.264 MP4 with AAC
          audio, written so it can start playing before it has fully loaded on
          a web page. H.264 MP4 is the combination that almost every phone,
          media player, chat app and office suite opens, and a compressed file
          the recipient cannot play has not solved anything.
        </p>
        <p>
          That answers three searches in one. To{' '}
          <strong>compress MKV to MP4 online</strong>, select the MKV; the
          container swap happens as part of the run. The same is true if you
          want to <strong>compress WebM video online</strong>: WebM goes in,
          MP4 comes out, and if you need a WebM back for a specific reason the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          is the right tool. And an iPhone MOV becomes an MP4 in the same
          pass, which is usually the point.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Can you compress video without losing quality?
        </h4>
        <p>
          Not with this tool, and not with any tool that rebuilds the video,
          whatever the marketing says. Every run re-encodes both picture and
          sound. CRF 20 is the gentlest setting and very hard to tell from the
          source at normal viewing size, but it is a new encode, not a copy.
          What we can promise is that you choose how much is lost, and you see
          the result before you keep it.
        </p>
        <p>
          One more honest detail. If your source was already efficiently
          encoded, the result can come out the same size or larger. When that
          happens the tool says <strong>Re-encoded MP4</strong> and shows the
          size, rather than claiming a saving it did not make.
        </p>
      </section>

      {/* 6 */}
      <section id="what-it-does-not-do" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Tool Does Not Do (and Where to Go Instead)
        </h3>
        <p>
          This tool does one thing, so it is worth being clear about the edges.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>No target-size box.</strong> You cannot type 10 MB and get
            10 MB. You choose settings and the tool reports what they produced.
            Section 4 gives starting points for the common caps.
          </li>
          <li>
            <strong>No trimming, cropping, rotating or muting.</strong> The
            audio track is always kept and rebuilt as AAC. If what you actually
            need is the sound on its own, the{' '}
            <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to MP3 extractor
            </Link>{' '}
            pulls it out.
          </li>
          <li>
            <strong>MP4 only.</strong> No H.265, VP9, AV1, MOV or MKV output.
            For a different container, compress here, then use the{' '}
            <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video converter
            </Link>
            .
          </li>
          <li>
            <strong>One file at a time.</strong> Download the first, click
            Change Video, pick the next.
          </li>
          <li>
            <strong>Very large files can fail.</strong> There is no size cap
            written into the tool and no daily quota, but a multi-gigabyte
            file or a long 4K clip may fail partway or take a very long time.
            We would rather say that than promise unlimited.
          </li>
          <li>
            <strong>Not for looping clips.</strong> For a reaction clip, the{' '}
            <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to GIF converter
            </Link>{' '}
            is the better fit, and the{' '}
            <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF compressor
            </Link>{' '}
            shrinks the result.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Video Compressor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no signup', 'No account, no email, no trial that expires. It is free every time, not free for the first three files.'],
            ['No watermark, ever', 'A video compressor with no watermark should be the norm. Nothing is stamped on the picture, not in the corner and not on the first frame.'],
            ['Four real controls', 'CRF, width, frame rate and audio bitrate by name, with the ranges shown. Not a vague quality dropdown.'],
            ['An honest readout', 'The exact percentage saved, before and after sizes, and a plain Re-encoded MP4 message when a source was already as small as it could be.'],
            ['Your files stay private', 'Nothing you compress is stored on our servers, retained after your session, or used to train anything or feed analytics.'],
            ['Plays everywhere', 'Every result is an H.264 MP4 with AAC audio, so MOV, MKV and WebM sources come out universally playable.'],
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
          on the same terms, so you can shrink the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            images
          </Link>
          ,{' '}
          <Link to="/tools/mp3-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio
          </Link>{' '}
          and{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            documents
          </Link>{' '}
          going into the same message without paying for any of it.
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
              'How do I compress a video online for free without signing up?',
              'Click the panel at the top of this page, choose your MP4, MOV, MKV, WebM or AVI, adjust the settings or leave the defaults, and press Compress Video. No account, no email step, no watermark. Play the preview, then download the MP4.',
            ],
            [
              'Can I compress a video from 100 MB to 10 MB?',
              'Often, but there is no box to type the target into. Set width to 1280 or 640, CRF to 34 or higher, frame rate to 24 and audio to 64 kbps, then read the percentage the tool reports. Phone footage and screen recordings shrink a great deal; a clip that is already compact may not get there at any setting.',
            ],
            [
              'Is there a file size limit on this video compressor?',
              'No cap is written into the tool and there is no daily quota, so it is a free video compressor with no file size limit in the ordinary sense. The honest caveat is that multi-gigabyte files and long 4K clips can fail partway or take a long time. Capping the width at 1280 helps those complete.',
            ],
            [
              'Will compressing lose quality?',
              'Yes, some. Every run rebuilds the picture and sound, and there is no lossless option. CRF 20 keeps the most detail; 28 is a sensible middle; 36 is visibly softer but very small. You see the preview before you download, so nothing is lost that you did not choose to lose.',
            ],
            [
              'Does it convert MOV or MKV to MP4 as well as compressing?',
              'Yes. Whatever container goes in, an H.264 MP4 with AAC audio comes out. That makes it a one-step fix for an iPhone MOV that will not send or an MKV recording that will not play on a phone. For a format other than MP4, run the result through the video converter afterwards.',
            ],
            [
              'Can I compress MP4 without a watermark, free and unlimited?',
              'No watermark, free, and no limit on how many files you run or how often. The only practical constraints are one file at a time and that very large files may not complete. There is no counter ticking down and no upgrade being held back.',
            ],
            [
              'Why did it say Re-encoded MP4 instead of showing a percentage?',
              'Because the result was not smaller than the source, which happens when the original was already efficiently encoded at a similar resolution. Raise the CRF, lower the max width, or reduce the audio bitrate and run again. If it still does not shrink, the file was already as small as its content allows.',
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
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          changes the format once it is small,{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>{' '}
          turns a few seconds of it into a loop, and the{' '}
          <Link to="/tools/mp3-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP3 to MP4 tool
          </Link>{' '}
          goes the other way when sound needs to become a video. If you would
          rather understand how media on the web is built than simply use it,
          our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how web pages load, stream and display video from the ground up.
        </p>
      </div>
    </article>
  );
}
