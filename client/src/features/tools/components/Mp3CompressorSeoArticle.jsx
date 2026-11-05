import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  AudioLines,
  Check,
  Gauge,
  HelpCircle,
  Layers,
  Mail,
  Music,
  Settings2,
  Sparkles,
  TriangleAlert,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the MP3 Compressor tool.
 *
 * Written against what Mp3Compressor.js actually does, which is narrower than
 * the keyword set would like and shapes the whole article.
 *
 * The tool has exactly three controls: a bitrate dropdown (64 to 192 kbps), a
 * sample-rate dropdown (22,050 / 32,000 / 44,100 Hz, defaulting to 32,000) and
 * a Mix to Mono checkbox. Output is always a constant-bitrate MP3. Under a
 * constant bitrate the file size is decided by the bitrate dropdown alone, so
 * this article refuses to claim that mono halves the file or that a lower
 * sample rate shrinks it, even though the checkbox in the tool itself is
 * labelled "Cuts 50%". Sections 3 and 4 explain the real division of labour:
 * bitrate sets the size, mono and sample rate decide how good a low bitrate
 * can sound.
 *
 * There is no target-size mode, so the email and chat-app cap queries are
 * answered with size-per-minute arithmetic in the tool's own 1024-based units
 * rather than a promised "make it under 25 MB" button. The WhatsApp 16 MB
 * figure is treated as the number people search for, not asserted as the
 * app's current limit. "Free audio compressor online" is used only in the
 * file-size sense; the dynamic-range effect that shares the name is declined.
 * WAV, FLAC and M4A input is genuinely accepted, but the dedicated WAV
 * compressor and audio converter own those jobs, so those phrases route
 * there rather than competing with them.
 */
export default function Mp3CompressorSeoArticle() {
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
        Free <span className="text-orange-600 dark:text-orange-400">MP3 Compressor</span>: Reduce MP3 File Size Without Guessing
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A ten-minute recording should not be a twenty-megabyte problem. Yet that
        is exactly where people land when a lecture, an interview or a song will
        not attach to an email, upload to a course portal or send in a chat. A
        good <strong>MP3 compressor</strong> fixes it in one pass, but only if you
        know which setting actually decides the size. This guide explains the
        three controls in the tool above, gives you the arithmetic to{' '}
        <strong>reduce MP3 file size</strong> to fit a specific cap, and is
        honest about the one case where a <strong>compress MP3</strong> job cannot
        help at all.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/mp3-compressor.webp"
            alt="In-ear earphones plugged into a phone playing a track on a pale table"
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
              Three controls, one of which sets the size: bitrate, sample rate and
              a stereo-to-mono switch.
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
            ['#why-so-big', '1. Why Is My MP3 File So Big?'],
            ['#how-to-compress', '2. How to Compress an MP3 File Online Free'],
            ['#bitrate', '3. How to Reduce MP3 Bitrate: The Setting That Sets the Size'],
            ['#mono-and-sample-rate', '4. Mono and Sample Rate: What They Really Change'],
            ['#recipes', '5. Settings by Content: Voice, Lecture, Podcast, Music'],
            ['#size-caps', '6. Too Large to Email or Send? Fitting a Cap'],
            ['#when-it-wont-help', '7. When Compressing Will Not Make It Smaller'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free MP3 Compressor'],
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
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Is My MP3 File So Big?
        </h3>
        <p>
          An MP3 is a stream of sound described at a fixed budget of bits per
          second. That budget is the <strong>bitrate</strong>, written in kbps,
          and it is the single number that explains almost every &ldquo;why is my
          MP3 file so big&rdquo; question. A file recorded or exported at 320
          kbps spends five times as many bits on every second as one at 64 kbps,
          so it is five times the size, whether the sound is a symphony or one
          person talking into a phone.
        </p>
        <p>
          The format itself comes from the{' '}
          <a
            href="https://www.iso.org/standard/22412.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 11172-3 MPEG audio standard
          </a>
          , and its whole design is that you can trade bits for quality at
          encoding time. Most recording apps and export dialogs default to music
          settings: high bitrate, stereo, 44,100 Hz. That is right for an album
          and wildly generous for a voice memo. So a{' '}
          <strong>voice recording file size too big</strong> to send is almost
          never a corrupted file or a bug. It is speech saved with a music
          budget, and the fix is to re-save it with a speech budget.
        </p>
        <p>
          Two other properties travel with the file: how many channels it has
          (stereo or mono) and its sample rate. People assume all three multiply
          together to give the size. In this tool they do not, and section 4
          explains why that matters for what you tick.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress an MP3 File Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no watermark or audio stamp on the
          result. Here is <strong>how to compress an MP3 file</strong> with the
          tool at the top of this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in one audio file', 'Click the panel or drag a file onto it. MP3 is the main event, but WAV, FLAC, OGG, M4A and AAC are accepted too. One file per run.'],
            ['Pick bitrate, sample rate, mono', 'Three controls, explained in sections 3 to 5. Bitrate sets the size. The other two decide how good that size can sound.'],
            ['Preview, then download', 'A progress percentage counts up, then a player appears so you can listen before saving. The download is named after your file with _compressed added.'],
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
          When it finishes, the status line tells you what happened in plain
          numbers: &ldquo;Compressed by 62% (18.40 MB &rarr; 6.90 MB)&rdquo; or
          similar. If you are not happy with the sound, pick a higher bitrate
          from the dropdown and press Compress MP3 again; the first result is
          discarded and replaced. That is the entire workflow to{' '}
          <strong>compress MP3 online free</strong>. The rest of this guide is
          about choosing the settings well.
        </p>
      </section>

      {/* 3 */}
      <section id="bitrate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Reduce MP3 Bitrate: The One Setting That Sets the Size
        </h3>
        <p>
          The Target Bitrate dropdown offers 64, 96, 128, 160 and 192 kbps, and
          the output is written at a constant bitrate. That word{' '}
          <em>constant</em> is the key to everything: the file size is simply
          the bitrate multiplied by the duration, plus a small amount for
          headers and tags. Nothing else you tick changes it. So{' '}
          <strong>how to reduce MP3 bitrate</strong> and how to reduce MP3 size
          are the same question with the same answer: pick a lower number in
          this dropdown.
        </p>
        <p>
          The arithmetic is worth memorising because it lets you predict the
          result before you press the button. Divide kbps by eight to get
          kilobytes per second, multiply by sixty for a minute. The tool reports
          sizes in 1024-based megabytes, so these are the numbers you will
          actually see on screen:
        </p>
        <div className="overflow-x-auto not-prose my-6">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Bitrate</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Per minute</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">10 minutes</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">60 minutes</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Suits</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300">
              {[
                ['64 kbps', '0.46 MB', '4.6 MB', '27.5 MB', 'Speech, voice memos, lectures'],
                ['96 kbps', '0.69 MB', '6.9 MB', '41.2 MB', 'Podcasts with music beds'],
                ['128 kbps', '0.92 MB', '9.2 MB', '54.9 MB', 'Everyday music listening'],
                ['160 kbps', '1.14 MB', '11.4 MB', '68.7 MB', 'Music where detail matters'],
                ['192 kbps', '1.37 MB', '13.7 MB', '82.4 MB', 'Highest quality this tool writes'],
              ].map(([rate, min, ten, sixty, suits]) => (
                <tr key={rate}>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold">{rate}</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">{min}</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">{ten}</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">{sixty}</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">{suits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Read the table the other way round and it becomes a planning tool. If
          you need to <strong>convert MP3 to 64kbps</strong> for a phone system
          or a voice archive, you know a one-hour file will land a little under
          28 MB before you start. If a two-hour recording must fit somewhere
          tight, the table tells you 64 kbps is the only row that gets close,
          and section 6 finishes the sum.
        </p>
        <p>
          The dropdown stops at 192 kbps and starts at 64, so there is no 32 or
          48 kbps option and no 256 or 320 kbps option. Below 64 kbps speech
          starts to sound underwater, and a file at 256 or 320 kbps is not what
          anyone reaching for a compressor wants, so the five rows above cover
          the useful range.
        </p>
      </section>

      {/* 4 */}
      <section id="mono-and-sample-rate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Mono and Sample Rate: What They Really Change
        </h3>
        <p>
          Here is the part almost no compressor page tells you. At a fixed
          bitrate, ticking Mix to Mono or lowering the sample rate does{' '}
          <strong>not</strong> make the file smaller. Sixty-four kilobits per
          second is sixty-four kilobits per second whether they describe one
          channel or two. What these two controls change is what those bits are
          spent on, and that is exactly why they matter when the bitrate is low.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Mix to Mono
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Folds left and right into a single channel. A voice recording has
              no useful stereo information, so in stereo half the budget is
              wasted describing a second copy of the same sound. Tick this to{' '}
              <strong>convert stereo MP3 to mono</strong> and 64 kbps stops
              sounding thin, because every bit now goes to one clean channel.
              Leave it off for music, where the stereo image is the point.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Sample Rate
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How many times per second the sound is measured, which caps the
              highest pitch the file can hold. 44,100 Hz is the CD standard.
              22,050 Hz keeps everything a human voice produces and drops the
              air and hiss above it, so a low bitrate is not squandered on
              frequencies speech does not use. For music, keep 44,100.
            </p>
          </div>
        </div>
        <p>
          One default to watch: the sample-rate dropdown starts at 32,000 Hz,
          not 44,100. That is a sensible middle for podcasts and radio-style
          content, but if you are compressing music and want it to keep its
          top end, switch the dropdown to 44,100 Hz before you run. Nothing
          preserves the source rate for you automatically.
        </p>
        <p>
          A second detail for anyone who wants to{' '}
          <strong>change MP3 sample rate to 22050</strong>: at that rate the
          MP3 format tops out at 160 kbps, so pairing 22,050 Hz with the 192
          kbps option will produce a 160 kbps file. It is not a fault, and the
          pairing is an odd one anyway; half-rate audio belongs with the low
          bitrates.
        </p>
      </section>

      {/* 5 */}
      <section id="recipes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AudioLines className="w-6 h-6 text-orange-500 shrink-0" />
          5. Settings by Content: Voice, Lecture, Podcast, Music
        </h3>
        <p>
          Rather than a vague low, medium and high slider, the tool asks you to
          think about what is in the recording. That pays off, because the
          right settings for speech and the right settings for music are almost
          opposites. Here are the four combinations that cover nearly every job.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Voice memo, interview, lecture', '64 kbps, Mix to Mono ticked, 22,050 Hz. This is the mp3 compressor mono 64kbps setup people search for by name, and it is the honest answer for a lecture recording that must fit a course portal or an LMS upload cap.'],
            ['Podcast episode', '96 kbps, mono if it is one or two voices, 32,000 Hz. Reach for 128 kbps and stereo only if the episode leans on music beds. A podcast episode file too large to upload almost always responds to this.'],
            ['Music you will actually listen to', '128 to 192 kbps, Mix to Mono off, and the sample-rate dropdown switched to 44,100 Hz. This is the compress MP3 without losing quality setting; the loss is there but at 160 kbps and above it is rarely audible on ordinary speakers.'],
            ['Website background audio', '64 or 96 kbps, mono, 32,000 Hz. Ambient loops need page weight kept down more than they need a stereo image. To reduce MP3 size for website background audio, mono at a low bitrate is the standard trade.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 flex items-center gap-2">
                <Music className="w-4 h-4 text-orange-500 shrink-0" />
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          The tool also accepts files that are not MP3 yet. Drop in a studio
          export and you <strong>compress WAV to MP3</strong> in the same step;
          drop in a lossless rip and you <strong>compress FLAC to MP3 online</strong>;
          drop in an iPhone Voice Memos export and you{' '}
          <strong>shrink M4A voice memo to MP3</strong> using the voice recipe
          above. If WAV is your daily format, the dedicated{' '}
          <Link to="/tools/wav-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WAV compressor
          </Link>{' '}
          is built around it, and if you need an output other than MP3, such as
          OGG, Opus or M4A, the{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio converter
          </Link>{' '}
          is the right tool. This page writes MP3 and only MP3.
        </p>
      </section>

      {/* 6 */}
      <section id="size-caps" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-orange-500 shrink-0" />
          6. MP3 File Too Large to Email or Send? Fitting a 25 MB or 16 MB Cap
        </h3>
        <p>
          There is no &ldquo;make it under 25 MB&rdquo; box in this tool, and
          that is deliberate: a target-size mode has to guess at a bitrate for
          you, and it usually guesses badly for speech. Instead, use the table
          in section 3 and do the sum yourself. It takes ten seconds.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          An MP3 file too large to email
        </h4>
        <p>
          Gmail refuses attachments above 25 MB, and most business mail systems
          sit near that figure. To <strong>compress MP3 under 25MB for Gmail</strong>,
          divide 25 by the length in minutes to get the megabytes per minute you
          can afford, then choose the highest row in the table that fits. A
          forty-minute interview allows about 0.62 MB per minute, so 64 kbps
          (0.46 MB per minute, roughly 18 MB in total) is the row; 96 kbps would
          land around 27 MB and bounce. Ninety minutes of music at 128 kbps
          will not fit any mail system, and at that point the right move is to
          share a link rather than an attachment.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          An audio file too large for WhatsApp or another chat app
        </h4>
        <p>
          Chat apps enforce their own limits, and they change them, so check
          the message the app gave you rather than a figure from a blog. If the
          cap you are hitting is the 16 MB that people search for, the same
          arithmetic applies: to <strong>compress MP3 for WhatsApp 16MB</strong>,
          64 kbps mono carries about 34 minutes under that line and 96 kbps
          about 23. A song, at four minutes, fits comfortably even at 192 kbps,
          which tells you the file was probably a WAV or an oversized export
          rather than a real MP3 problem.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          A lecture recording for a course portal
        </h4>
        <p>
          To <strong>compress lecture recording MP3 for Canvas</strong> or any
          other learning platform, use the voice recipe from section 5. A
          two-hour lecture at 64 kbps mono comes in around 55 MB, which most
          course portals accept, and the speech stays perfectly intelligible.
          If a platform caps you tighter than that, splitting the recording is
          a better answer than dropping below 64 kbps.
        </p>
      </section>

      {/* 7 */}
      <section id="when-it-wont-help" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TriangleAlert className="w-6 h-6 text-orange-500 shrink-0" />
          7. When Compressing Will Not Make It Smaller
        </h3>
        <p>
          Every honest guide to this subject has to say it: compression cannot
          create a saving that is not there. If your source is already a 64 kbps
          mono MP3 and you ask for 64 kbps, the result will be the same size or
          fractionally larger, and you will have lost a little quality for
          nothing. This is the real reason behind &ldquo;
          <strong>MP3 won&rsquo;t get smaller after compressing</strong>&rdquo;:
          the file was already at or below the bitrate chosen.
        </p>
        <p>
          The tool does not pretend otherwise. When the output is not smaller
          than the input, the status line says &ldquo;Re-encoded MP3&rdquo; with
          the new size rather than reporting a saving. Treat that message as a
          signal to stop. Going lower than 64 kbps is not on offer, and if 64
          kbps did not shrink the file, the file is small already and the cap
          you are fighting needs a different solution: split it, or share a link.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Does compressing MP3 reduce quality?
        </h4>
        <p>
          Yes, always, and anyone who tells you otherwise is selling something.
          MP3 is a lossy format, and re-saving a lossy file throws away a little
          more every time. The honest goal is not zero loss but inaudible loss,
          and that is achievable: speech at 64 kbps mono sounds like speech,
          and music at 160 or 192 kbps is hard to tell from the original on
          normal headphones. Two things make it worse: compressing the same
          file repeatedly, and choosing a bitrate far below the content
          deserves. Keep the original, compress once from it, and pick the row
          in the table that fits rather than the smallest one.
        </p>
        <p>
          Two further limits worth knowing about. Embedded album artwork is not
          carried across, so a compressed music file arrives without its cover.
          And nothing here trims silence, cuts a section or changes loudness; it
          re-saves the whole recording at your chosen settings, no more.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free MP3 Compressor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['MP3 compressor, no signup', 'No account, no email capture, no download gated behind a trial. Drop a file and get a file back.'],
            ['Three real controls', 'An explicit bitrate list, a sample-rate list and a mono switch, so you set the result deliberately instead of dragging a quality slider and hoping.'],
            ['It tells you the truth about size', 'A percentage and a before-and-after size when the file shrank, and a plain "Re-encoded MP3" when it did not. No inflated claim either way.'],
            ['Listen before you download', 'A built-in player appears the moment the job finishes, so a bitrate that is too low costs you a re-run rather than a bad upload.'],
            ['Your files stay private', 'Nothing you compress is stored on our servers, retained after your session, or used for training or analytics.'],
            ['Takes more than MP3', 'WAV, FLAC, OGG, M4A and AAC all go in, so a studio export or a voice memo compresses in one step instead of two.'],
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
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free file tools
          </Link>{' '}
          offered on the same terms. If the sound you need to shrink is still
          inside a video, pull the track out first with{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>
          , or shrink the whole clip with the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          . And if what you are after is a <strong>free audio compressor online</strong>{' '}
          in the studio sense, the effect that evens out loud and quiet passages,
          this is not that; this page only changes file size.
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
              'How do I use an MP3 compressor without signing up?',
              'Drop your file into the panel at the top of this page, choose a bitrate, and press Compress MP3. There is no account, no email step and no watermark. It is free every time, not free for the first three files.',
            ],
            [
              'Which setting actually makes the MP3 smaller?',
              'Only the Target Bitrate dropdown. The output is written at a constant bitrate, so size is bitrate multiplied by duration. Mix to Mono and the sample rate change how good the file sounds at that bitrate, not how many megabytes it is.',
            ],
            [
              'Does compressing an MP3 reduce quality?',
              'Yes, every time, because MP3 is lossy and re-saving discards a little more. The aim is to make the loss inaudible: 64 kbps mono for speech, 160 to 192 kbps stereo at 44,100 Hz for music. Always compress from your original rather than from an earlier compressed copy.',
            ],
            [
              'Why did my MP3 not get smaller after compressing?',
              'Because it was already at or below the bitrate you chose. The status line will say "Re-encoded MP3" with the size instead of a percentage saved. Nothing lower than 64 kbps is offered, so if 64 kbps did not help, the file is already small and you need to split it or share a link instead.',
            ],
            [
              'What settings should I use for a voice recording or lecture?',
              '64 kbps, tick Mix to Mono, and set the sample rate to 22,050 Hz. Speech has no stereo information and nothing above the range that 22,050 Hz keeps, so the low bitrate is spent entirely on the voice. A one-hour recording lands a little under 28 MB.',
            ],
            [
              'How do I compress an MP3 to under 25 MB for Gmail?',
              'There is no target-size box, so use the per-minute figures: 64 kbps is about 0.46 MB per minute, 96 kbps about 0.69 and 128 kbps about 0.92. Divide 25 by your recording length in minutes and pick the highest bitrate whose per-minute figure fits under that number.',
            ],
            [
              'Can I compress a WAV, FLAC or M4A file here?',
              'Yes. WAV, FLAC, OGG, M4A and AAC are all accepted and come out as MP3. If you need a different output format, such as OGG, Opus or M4A, use our audio converter instead; and for a WAV-centred workflow, the dedicated WAV compressor is the better fit.',
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
          Working on the rest of the same project? The{' '}
          <Link to="/tools/mp3-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP3 to MP4 converter
          </Link>{' '}
          turns a finished track into a video for platforms that will not take
          audio,{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive
          </Link>{' '}
          bundles a set of episodes into one zip for sending, and the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          does for cover art what this page does for sound. If you would rather
          understand how media formats and page weight work than simply manage
          them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers assets, performance and delivery from the ground up.
        </p>
      </div>
    </article>
  );
}
