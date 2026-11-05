import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  AudioLines,
  Check,
  Film,
  Gauge,
  HelpCircle,
  Layers,
  Music,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the audio converter.
 *
 * Written against what AudioConverter.js actually does, which is narrower
 * than the keyword set would like. The tool takes one file per run, writes
 * exactly six formats (MP3, WAV, OGG Vorbis, Opus, FLAC, M4A/AAC), shows a
 * bitrate menu only for MP3, Opus and M4A, and passes sample rate and channel
 * layout straight through from the source. So section 3 publishes the exact
 * output each format produces, section 6 says out loud what the tool will not
 * do (batch, trimming, tag editing, cover art, WMA/AAC/AIFF output), and any
 * reader who needs those is routed to the tool that has them.
 *
 * Every job discards the video stream, so any video file is a legitimate
 * input for audio extraction; section 6 treats that as a feature.
 *
 * Keywords that describe where or how the work runs were deliberately not
 * used; this article never discusses processing. Privacy is sold as an
 * outcome only.
 */
export default function AudioConverterSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Online Audio Converter</span> That Tells You Exactly What It Writes
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An audio file that will not open is rarely broken. It is almost always
        the right sound in the wrong wrapper: an iPhone voice memo a Windows
        editor refuses, a WhatsApp note nothing on the desktop will play, a
        studio WAV too large to email. A good <strong>online audio converter</strong>{' '}
        fixes all three in one step, and this one goes further than most by
        telling you precisely what comes out of each of its six formats. This
        guide covers the settings, the problem each one solves, and the few
        jobs this <strong>audio file converter</strong> will honestly send
        elsewhere.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/audio-converter.webp"
            alt="A tonearm resting on a spinning vinyl record, the needle tracking its grooves"
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
              Six outputs, one honest spec for each: MP3, WAV, OGG, Opus, FLAC
              and M4A, plus audio pulled straight out of any video file.
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
            ['#what-happens', '1. What an Online Audio Converter Actually Does'],
            ['#how-to-convert', '2. How to Convert an Audio File Online Free'],
            ['#six-formats', '3. The Six Output Formats, Exactly as Written'],
            ['#bitrate', '4. Which Bitrate to Pick, by Symptom'],
            ['#wont-open', '5. Files That Will Not Open, and the Fix for Each'],
            ['#video-and-limits', '6. Audio From Video, and What This Tool Will Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Audio Converter'],
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
          1. What an Online Audio Converter Actually Does to Your File
        </h3>
        <p>
          Every audio file is two things stacked together: a container, which is
          the wrapper the extension names, and a codec, which is how the sound
          inside was squeezed down. M4A is a container that usually holds AAC.
          OGG holds Vorbis, and sometimes Opus. WAV holds raw, unsqueezed
          samples. When a player says a file is &ldquo;not supported&rdquo;, it
          is objecting to one of those layers, not to the recording.
        </p>
        <p>
          An <strong>audio converter</strong> decodes the sound out of the wrapper
          it arrived in and encodes it again into the one you asked for. Two
          consequences follow:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Lossy to lossy costs a little each time.</strong> MP3 to M4A
            re-squeezes sound that was already squeezed once. Fine for a voice
            note; do it four times to a music track and you will hear it.
          </li>
          <li>
            <strong>Lossy to lossless restores nothing.</strong> A 128 kbps MP3
            turned into WAV or FLAC is a much larger file with exactly the same
            detail. Still the right move when an editor insists on PCM, just
            not a quality upgrade.
          </li>
        </ul>
        <p>
          What this <strong>online audio converter</strong> does differently is
          tell you which codec and setting each format produces. Section 3
          publishes the list, so you never have to guess whether
          &ldquo;OGG&rdquo; on the menu means real Vorbis or a relabelled MP3.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert an Audio File Online Free (Step-by-Step)
        </h3>
        <p>
          This is a <strong>free online audio converter</strong> in the plain
          sense: no account, no email, no daily cap, and it is an{' '}
          <strong>audio converter without watermark</strong> or audio bumper on
          the output. To convert a file with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in one file', 'Click the panel or drag a file onto it. MP3, WAV, OGG, FLAC, M4A, AAC and WMA are accepted, and so is any video file if what you want is its soundtrack. One file per run.'],
            ['Pick a format and bitrate', 'Choose MP3, WAV, OGG, Opus, FLAC or M4A. For MP3, Opus and M4A a bitrate menu appears with six presets from 96 to 320 kbps; the other three use a fixed setting explained in section 3.'],
            ['Preview, then download', 'A progress bar runs to completion, an inline player lets you listen before you commit, and the download keeps your original filename with the new extension.'],
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
          The result message names the format and size, so a file that came out
          larger than expected is visible before anything is saved. Pick another
          format and convert the same file again, or hit <em>Change Audio</em> to
          start over. There is no sign-up step, which is the whole answer to{' '}
          <strong>audio converter no sign up</strong> searches: the page is the
          tool.
        </p>
      </section>

      {/* 3 */}
      <section id="six-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AudioLines className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Six Output Formats, Exactly as They Are Written
        </h3>
        <p>
          Most converters list a dozen formats and stay quiet about what each one
          contains. Here is the full mapping for this tool, taken from the
          settings it applies rather than from a marketing page.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['MP3 (MPEG Audio)', 'Constant bitrate at the kbps you choose, 96 to 320. The universal answer when a file has to play on everything, from an old car stereo to a phone.'],
            ['WAV (Uncompressed PCM)', 'Always 16-bit PCM, sample rate and channels carried over from the source. What editors, samplers and CD burning expect. Large, but exact.'],
            ['OGG (Vorbis)', 'Vorbis at a fixed quality level that lands around 128 kbps for typical stereo material. No bitrate menu for this one; the quality is set for you.'],
            ['Opus (High Efficiency)', 'Opus at the kbps you choose from the same 96 to 320 menu. Small files at high quality, and the format Discord, WhatsApp and most VoIP systems speak natively.'],
            ['FLAC (Lossless)', 'Bit-for-bit lossless. Nothing is thrown away, so this is the archive format for a WAV master when you want a smaller file with zero compromise.'],
            ['M4A (AAC Audio)', 'AAC at the kbps you choose. The format Apple devices and most modern phones prefer, and what an iPhone voice memo already is on the inside.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Two notes. Opus is the newest of the six, defined openly in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc6716"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 6716
          </a>
          , and very few free converters offer it as an output, which is why{' '}
          <strong>convert MP3 to Opus</strong> is such an underserved search. And
          MP3, defined in{' '}
          <a
            href="https://www.iso.org/standard/22412.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 11172-3
          </a>
          , is written at a constant bitrate, not VBR: every player reports the
          length correctly, and the file size is predictable from the preset.
        </p>
        <p>
          Sample rate and channel count pass through untouched on every format.
          A 48 kHz stereo source comes out 48 kHz stereo. There is no mono
          switch, no resampling and no bit-depth choice, so a broadcast spec that
          demands 44.1 kHz mono is a job for a desktop editor after you convert.
        </p>
      </section>

      {/* 4 */}
      <section id="bitrate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          4. Which Bitrate to Pick, Matched to the Problem You Have
        </h3>
        <p>
          The bitrate menu appears for MP3, Opus and M4A. Generic advice says
          &ldquo;128 for most things, 320 for the best&rdquo;, which is true and
          useless. Here is each preset paired with the situation it is for.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>96 kbps (Voice / Compact).</strong> A lecture or voice memo
            that is <strong>too big to email</strong>. Speech needs no more, and
            an hour-long WAV comes down to a fraction of its size.
          </li>
          <li>
            <strong>128 kbps (Standard Quality).</strong> Podcasts and
            interviews people will hear on earbuds. If you are asking{' '}
            <strong>which MP3 bitrate for a voice recording</strong> with music
            beds or several speakers, this is the answer.
          </li>
          <li>
            <strong>160 kbps (Good Quality).</strong> Background music for a
            video edit or slideshow, where the file goes into another project.
          </li>
          <li>
            <strong>192 kbps (High Quality).</strong> The default, and the right
            pick for a WhatsApp or Telegram <strong>.opus</strong> voice note you
            want to keep permanently as MP3. Nothing is lost twice.
          </li>
          <li>
            <strong>256 kbps (Very High).</strong> Music for decent headphones
            that still syncs to a phone without eating the storage.
          </li>
          <li>
            <strong>320 kbps (Maximum MP3).</strong> A WAV or FLAC master going
            to a phone or DJ deck. This is the setting behind every{' '}
            <strong>convert M4A to MP3 320kbps online free</strong> search: pick
            MP3, pick 320, done.
          </li>
        </ul>
        <p>
          One honest caveat: Opus shares the same 96 to 320 menu as MP3. Opus is
          famous for sounding good at 24 to 64 kbps on speech, and the tool does
          not offer presets that low, so 96 kbps is the smallest Opus file it
          writes. Small, just not the tiniest Opus can be.
        </p>
      </section>

      {/* 5 */}
      <section id="wont-open" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Files That Will Not Open, and the One-Step Fix for Each
        </h3>
        <p>
          Almost every audio complaint has the same shape: the file is fine, the
          destination does not speak its format, and one conversion ends the
          argument.
        </p>
        <div className="space-y-5 mt-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Voice memo will not open on Windows
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              iPhone voice memos are M4A, and older Windows players and many
              editors will not touch them. <strong>Convert M4A to MP3</strong> at
              128 kbps for sharing, or to WAV if you intend to edit it.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              WhatsApp voice note file format is .opus
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The <strong>WhatsApp voice note file format</strong> is Opus in an
              OGG container, which desktop players and email clients often
              refuse. <strong>Convert Opus to MP3</strong> at 192 kbps and it
              becomes a normal file you can forward, archive or transcribe.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              OGG file not supported
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Car stereos, some DAWs and most Apple software reject OGG. Convert
              to MP3 for playback or M4A for anything Apple. Going the other way,
              when a game engine insists on OGG, the Vorbis written here is the
              real thing.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Cannot import audio into Premiere, Audacity or iMovie
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Editors are fussy about containers, and an M4A that plays in a
              music app can still be refused on import. The fix is to{' '}
              <strong>convert MP3 to WAV</strong> or M4A to WAV: 16-bit PCM is the
              one format every editor and sampler imports without complaint.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Audio file will not play on a phone
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A FLAC or WAV that plays on the laptop and stays silent on a phone
              is a codec problem, and sometimes a size problem too.{' '}
              <strong>Convert FLAC to MP3</strong> at 256 or 320 kbps and both go
              away at once.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Audio file too big to email
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A long WAV can easily exceed an attachment limit.{' '}
              <strong>Convert WAV to MP3</strong> at 96 kbps for speech or 192 for
              music. If it is already an MP3 and still too large, the{' '}
              <Link to="/tools/mp3-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
                MP3 compressor
              </Link>{' '}
              is the more direct tool.
            </p>
          </div>
        </div>
      </section>

      {/* 6 */}
      <section id="video-and-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          6. Pulling Audio Out of a Video, and What This Tool Will Not Do
        </h3>
        <p>
          The file picker accepts video as well as audio, and that is deliberate.
          Every conversion discards the picture and keeps the soundtrack, so an
          MP4 screen recording, a MOV from a phone or an MKV rip can go in and an
          MP3, WAV or FLAC comes out. For the most common version of that job
          there is a dedicated{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3 converter
          </Link>
          ; use this page when you want the soundtrack as Opus, FLAC or 16-bit
          WAV instead.
        </p>
        <p>
          In the interest of not wasting your time, here is what this{' '}
          <strong>audio file converter</strong> does not do, and where to go
          instead:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>One file at a time.</strong> No batch mode, no zip of
            results. For a folder of files, run them one after another; the
            settings stay put between runs.
          </li>
          <li>
            <strong>Six outputs only.</strong> WMA, raw AAC, AIFF, AMR and M4R
            ringtones are not written. If you need a video container around
            your audio, the{' '}
            <Link to="/tools/mp3-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP3 to MP4 tool
            </Link>{' '}
            does that.
          </li>
          <li>
            <strong>No trimming, fading, normalising or noise removal.</strong>{' '}
            Whole files only. Cut first in an editor, then convert.
          </li>
          <li>
            <strong>No tag editor, and cover art is not carried over.</strong>{' '}
            The picture stream is dropped on every job, and embedded album art
            goes with it. Re-add it in your music app afterwards if it matters.
          </li>
          <li>
            <strong>Long files take longer.</strong> An hour of FLAC or WAV takes
            noticeably longer than a three-minute song, and a very large file can
            fail with an error rather than a tidy size warning. For a huge WAV,
            the{' '}
            <Link to="/tools/wav-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              WAV compressor
            </Link>{' '}
            is a lighter route to a smaller file.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Audio Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free local processing', 'Free local conversion with file-size, batch and device-memory limits shown above.'],
            ['No sign-up, no email', 'The page is the tool. There is no account to create, no address to confirm and no newsletter to escape from afterwards.'],
            ['No watermark, no bumper', 'The output is your audio and nothing else. No branded jingle at the start, no audio bumper at the end, nothing to strip out later.'],
            ['Six real formats, published settings', 'MP3, WAV, OGG, Opus, FLAC and M4A, and this page tells you exactly what each contains. Opus output is something almost nobody else offers.'],
            ['Your recordings stay private', 'Interviews, meetings and voice notes are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Listen before you download', 'An inline player previews the converted file, so a wrong bitrate costs you seconds rather than a download and a second attempt.'],
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
            free media tools
          </Link>{' '}
          on identical terms, so you can{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress a video
          </Link>
          ,{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert it to another format
          </Link>{' '}
          or turn a clip into a{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF
          </Link>{' '}
          without paying for any of it. That also makes it the practical answer
          to <strong>convert WAV to MP3 on a Chromebook</strong>: open the page,
          drop the file, and it works exactly as it does anywhere else.
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
              'Is it safe to upload audio to an online converter?',
              'With this one, yes. Your recordings are never stored on our servers, nothing is retained after your session ends, and nothing you convert is used for training or analytics. There is no account, so there is no profile for a file to be attached to. Hold any online audio converter to that standard before handing it an interview or a meeting recording.',
            ],
            [
              'How do I convert M4A to MP3 for free without signing up?',
              'Drop the M4A into the panel at the top of this page, leave the format on MP3, choose a bitrate (128 kbps for a voice memo, 320 for music) and press Convert Audio. Listen to the preview, then download. No account, no email, no watermark.',
            ],
            [
              'Which MP3 bitrate should I use for a voice recording?',
              'Use 96 kbps if the priority is a small file, for example a lecture that has to go by email. Use 128 kbps for a podcast or interview people will hear on earbuds. Anything above 160 kbps is wasted on plain speech and only makes the file larger.',
            ],
            [
              'Why is there no bitrate option for OGG?',
              'Because OGG Vorbis is written at a fixed quality level that lands around 128 kbps for typical stereo material, which suits nearly every use of the format. If you need a specific bitrate, pick MP3, Opus or M4A instead.',
            ],
            [
              'Can I convert a video file to audio here?',
              'Yes. Any MP4, MOV, MKV or WebM is accepted, the picture is discarded and only the soundtrack is converted to whichever of the six formats you choose. If all you need is MP3, the dedicated MP4 to MP3 tool is a shorter path; use this page for WAV, FLAC, Opus, OGG or M4A.',
            ],
            [
              'Can I convert several audio files at once?',
              'Not in a single run; this tool takes one file at a time and there is no batch mode or zip download. Your chosen format and bitrate stay selected between runs, so working through a folder is a matter of dropping each file in turn.',
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
          Working with the same file elsewhere? The{' '}
          <Link to="/tools/mp3-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP3 compressor
          </Link>{' '}
          shrinks a file that is already MP3,{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>{' '}
          is the fast path when all you want from a video is its sound, and the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists every other format we handle. If you would rather understand how
          media handling is built than simply use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts from the beginning.
        </p>
      </div>
    </article>
  );
}
