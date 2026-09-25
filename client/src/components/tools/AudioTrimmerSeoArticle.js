import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Check,
  HelpCircle,
  Layers,
  Music,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Volume2,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Audio Trimmer tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Output is WAV or M4A/AAC, never MP3. That is said up front and the
 *    visitor who truly needs MP3 is routed to the audio converter rather
 *    than discovering it after the export.
 *
 * 2. Most "ringtone maker" pages stop at the download. The 30 and 40 second
 *    presets, the .m4r rename and the reasons a ringtone does not appear on
 *    an iPhone are explained, because that is where people actually get stuck.
 *
 * 3. Limits are stated plainly: one contiguous selection, one file per run,
 *    no typed timestamps, fixed 128 kbps AAC, re-encoded rather than a
 *    lossless cut.
 */
const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

export default function AudioTrimmerSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Audio Trimmer</span> and Ringtone Maker: Cut the Part You Want, Fade It, and Export M4A or WAV
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        The chorus of a song you want as your ringtone. Twenty seconds of a
        podcast interview worth sharing. A voice note with a minute of
        fumbling before anyone speaks. All three are the same job: keep one
        stretch of sound and throw the rest away. This guide shows how to use
        the <strong>audio trimmer</strong> above as an <strong>audio cutter</strong>,
        an <strong>MP3 cutter</strong> and a <strong>ringtone maker</strong>{' '}
        in one, how to get a finished ringtone onto an iPhone or an Android
        phone, how to soften a harsh start with a fade &mdash; and, just as
        plainly, what the tool does not do and where to go instead.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/audio-trimmer.webp"
            alt="Audio trimmer and free ringtone maker online - selecting the chorus of a song on a waveform with fade in and fade out before exporting an M4A ringtone"
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
              Click the waveform to place the start and end, add a short fade,
              preview it, and export a clip that is ready for a phone.
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
            ['#what-it-does', '1. What an Audio Trimmer and Audio Cutter Do'],
            ['#how-to-trim', '2. How to Trim an Audio File in Five Steps'],
            ['#ringtone', '3. Ringtone Maker: iPhone and Android'],
            ['#fades-volume', '4. Fade In, Fade Out, Volume and Mono'],
            ['#fix-problems', '5. Fixing Four Common Problems'],
            ['#limits', '6. What This MP3 Cutter Does Not Do'],
            ['#why-cortexis', '7. Why Use the Cortexis Audio Trimmer'],
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
          <Music className="w-6 h-6 text-orange-500 shrink-0" />
          1. What an Audio Trimmer and Audio Cutter Do
        </h3>
        <p>
          An audio trimmer keeps one continuous section of a recording and
          discards the rest. Whether you call it an audio cutter or an MP3
          cutter, the question is the same: <strong>how to cut part of a
          song</strong> or recording so only the useful bit is left.
        </p>
        <p>
          The tool above opens MP3, WAV, OGG, Opus, M4A, AAC, FLAC and WebM
          audio, one file at a time. It also accepts an MP4 or WebM video and
          keeps only its sound, so you can{' '}
          <strong>cut audio from MP4 video online</strong> when all you want
          is a line of dialogue. Typical uses:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Ringtones and alerts</strong> &mdash; the hook of a song
            as a ringtone, or a short sting as a notification or alarm.
          </li>
          <li>
            <strong>Voice recordings</strong> &mdash; to <strong>cut a voice memo in
            M4A</strong>, remove the silence at the start and
            the &ldquo;is it recording?&rdquo; at the end.
          </li>
          <li>
            <strong>Lossless material</strong> &mdash;{' '}
            <strong>trim WAV file online</strong> or{' '}
            <strong>trim FLAC file online</strong> and keep the result
            lossless by exporting WAV.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-trim" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Trim an Audio File in Five Steps
        </h3>
        <p>
          Here is <strong>how to trim an audio file</strong> with the tool
          above &mdash; the whole process for anyone who wants to{' '}
          <strong>trim audio online free</strong>, with no account and no
          watermark.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the file.</strong> Drop it onto the panel. The waveform
            appears with the whole track selected.
          </li>
          <li>
            <strong>Set the start and end.</strong> Click the waveform: each
            click moves whichever handle is nearer, and the kept section is
            shaded blue. The Start and End sliders fine-tune it, and the line
            above the waveform shows the clip length in seconds.
          </li>
          <li>
            <strong>Shape it (optional).</strong> Add a fade in or fade out,
            change the volume, or tick Mono. Section 4 explains each one.
          </li>
          <li>
            <strong>Preview the selection.</strong> Press{' '}
            <em>Preview selection</em> to hear exactly what will be exported,
            fades and volume included.
          </li>
          <li>
            <strong>Choose a format and export.</strong> Pick{' '}
            <em>M4A / AAC (ringtone-friendly)</em> for a small file that plays
            on phones, or <em>WAV (lossless)</em> for editing or archiving, and
            press <em>Export</em>. A player lets you check the result before
            downloading. Your original file is never overwritten, it is never
            stored on our servers, and nothing is retained once you are done.
          </li>
        </ol>
      </section>

      {/* 3 */}
      <section id="ringtone" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          3. Ringtone Maker: iPhone and Android
        </h3>
        <p>
          For <strong>how to make a ringtone from a song</strong>, the Preset
          menu does the arithmetic. Place the start handle
          where the hook begins, then choose a preset: it sets the end that
          many seconds later (or at the end of the file). You can still
          nudge the end afterwards.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Ringtone (max 30 s)</strong> &mdash; a comfortable length
            for most ringtones, which is why people look for a{' '}
            <strong>30 second ringtone cutter</strong>.
          </li>
          <li>
            <strong>iPhone ringtone (max 40 s)</strong> &mdash; the longest
            ringtone an iPhone accepts.
          </li>
          <li>
            <strong>Notification (15 s)</strong> &mdash; for message tones and
            alerts.
          </li>
        </ul>
        <h4 className="font-bold text-slate-900 dark:text-white text-lg">
          How to make a custom ringtone for iPhone
        </h4>
        <p>
          This is the part most <strong>iPhone ringtone maker</strong> pages
          skip. To <strong>make M4R ringtone from MP3</strong> files or any
          other song you own:
        </p>
        <ol className="space-y-2">
          <li>Trim the clip with the <em>iPhone ringtone (max 40 s)</em> preset and export as M4A / AAC.</li>
          <li>Rename the downloaded file so it ends in <strong>.m4r</strong> instead of .m4a. Only the extension changes.</li>
          <li>Drag the .m4r onto the iPhone in Finder on a Mac, or use Apple Devices or iTunes on Windows. GarageBand on the iPhone can also save a clip as a ringtone.</li>
          <li>On the iPhone, open Settings, then Sounds &amp; Haptics, then Ringtone, and pick it.</li>
        </ol>
        <p>
          Apple&rsquo;s own guide to{' '}
          <a
            href="https://support.apple.com/en-us/HT201907"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            using tones and ringtones on iPhone
          </a>{' '}
          covers the Settings side in more detail.
        </p>
        <p>
          One thing to check before you rename: after export, a short note
          appears above the download. If it reads{' '}
          <em>AAC-LC</em>, the file is the standard AAC audio an iPhone
          ringtone expects. If it says the clip was saved as Opus because AAC
          was not available, reopen this page in an up-to-date version of
          Safari, Chrome or Edge and export again so you get AAC. If only WAV
          is offered, export WAV and convert it with the{' '}
          <Link to="/tools/audio-converter" className={linkClass}>
            audio converter
          </Link>{' '}
          first, then rename the M4A result to .m4r.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-lg">
          Android ringtones and notification sounds
        </h4>
        <p>
          Android is simpler: it plays M4A directly, so no rename is needed.
          Copy the file into the phone&rsquo;s <strong>Ringtones</strong> folder
          (or <strong>Notifications</strong> for an alert), then choose it under
          Settings, Sound, Ringtone; menu names vary a little between makers.
          To <strong>make a notification sound from a song on Android</strong>,
          use the 15-second preset and a short fade out.
        </p>
      </section>

      {/* 4 */}
      <section id="fades-volume" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Fade In, Fade Out, Volume and Mono
        </h3>
        <p>
          A cut in the middle of a song usually starts or ends with a click or
          a jolt, which is why an{' '}
          <strong>audio trimmer with fade in and fade out</strong> matters.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Fade in and fade out</strong> &mdash; each can be set from
            0 to 10 seconds in tenth-of-a-second steps, rising or falling in a
            straight line. For <strong>how to add fade out to audio</strong>:
            one to two seconds suits a ringtone, longer suits music.
          </li>
          <li>
            <strong>Volume</strong> &mdash; a slider from 10% to 300%, the
            simple way to <strong>boost the volume of an audio clip online</strong>{' '}
            or make an <strong>audio clip for an alarm sound</strong> that
            actually wakes you. There is no limiter, so very high settings on a
            loud track will distort.
          </li>
          <li>
            <strong>Mono</strong> &mdash; tick it to{' '}
            <strong>convert stereo to mono audio online</strong>. All channels
            are averaged into one, which suits voice recordings.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="fix-problems" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. Fixing Four Common Problems
        </h3>
        <p>
          <strong>Custom ringtone not showing up on iPhone.</strong> Usually
          the file still ends in .m4a, runs past 40 seconds, or reached the
          phone through a messaging app or cloud folder rather than Finder,
          Apple Devices, iTunes or GarageBand.
        </p>
        <p>
          <strong>iPhone ringtone too long.</strong> Re-open the original,
          choose the <em>iPhone ringtone (max 40 s)</em> preset and export
          again. If you nudge the end handle afterwards, check the clip length
          so it does not creep past the limit.
        </p>
        <p>
          <strong>Trimmed audio file bigger than original?</strong> You exported
          WAV from a compressed source such as an MP3. Uncompressed WAV can
          outweigh the whole song. Choose M4A / AAC for a
          small file, or run the
          WAV through the{' '}
          <Link to="/tools/wav-compressor" className={linkClass}>
            WAV compressor
          </Link>{' '}
          if you need to keep the format.
        </p>
        <p>
          <strong>Ringtone starts too loud or abrupt?</strong> Add a fade in of one
          to two seconds, and if the whole clip is harsh, lower the volume
          below 100%. Starting a beat before the hook helps the fade feel
          natural.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ban className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This MP3 Cutter Does Not Do
        </h3>
        <p>
          The tool opens MP3 but does not export it: the choices are M4A /
          AAC and WAV, which play on every current phone and computer. If you genuinely need an
          MP3, trim here and then use the{' '}
          <Link to="/tools/audio-converter" className={linkClass}>
            audio converter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/m4a-to-mp3" className={linkClass}>
            M4A to MP3 converter
          </Link>
          .
        </p>
        <ul className="space-y-2">
          <li>
            <strong>One continuous section, one file.</strong> You cannot
            delete a middle chunk and join the ends, or merge, crossfade or
            batch several files.
          </li>
          <li>
            <strong>No typed timestamps or zoom.</strong> Selection is by
            clicking the waveform and using the sliders.
          </li>
          <li>
            <strong>No bitrate choice.</strong> M4A is AAC at 128 kbps and WAV
            is 16-bit. To shrink a file, use the{' '}
            <Link to="/tools/mp3-compressor" className={linkClass}>
              MP3 compressor
            </Link>{' '}
            or the WAV compressor.
          </li>
          <li>
            <strong>Not a lossless cut of an MP3 or AAC file.</strong> The clip
            is re-encoded on export; for archiving, export WAV.
          </li>
          <li>
            <strong>No effects beyond fades, volume and mono.</strong> There is
            no noise reduction, EQ, normalisation, pitch or speed change.
          </li>
          <li>
            <strong>Video in, audio out.</strong> A video gives you an audio
            clip, not a shorter video. For that, use the{' '}
            <Link to="/tools/video-trimmer" className={linkClass}>
              video trimmer
            </Link>
            ; for the full soundtrack as MP3, use{' '}
            <Link to="/tools/mp4-mp3" className={linkClass}>
              MP4 to MP3
            </Link>
            .
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Audio Trimmer
        </h3>
        <p>
          Plenty of sites offer an <strong>audio cutter online</strong> or a{' '}
          <strong>free ringtone maker online</strong>; many ask for an account
          first. Here is what you get instead.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no watermark on the audio. The tool on this page is the whole product.'],
            ['Ringtone presets built in', 'Ringtone (30 s), iPhone ringtone (40 s) and Notification (15 s) set the length for you, and the M4A export is ready to rename to .m4r.'],
            ['Fades, volume and mono', 'Fades up to 10 seconds, volume from 10% to 300% and a mono downmix, all heard in the preview.'],
            ['Your recordings stay private', 'Files are never stored on our servers and nothing is retained after your session, which matters for voice memos and interviews.'],
            ['Nothing is used for training', 'Your audio is never used to train any model.'],
            ['Honest about formats', 'M4A / AAC or lossless WAV out, and no pretending otherwise about MP3.'],
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
          <Link to="/tools" className={linkClass}>
            free media and document tools
          </Link>{' '}
          built on the same terms, including the{' '}
          <Link to="/tools/video-muter" className={linkClass}>
            video muter
          </Link>{' '}
          for silencing a video.
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
              'How do I trim an audio file for free?',
              'Add the file to the audio trimmer at the top of this page, click the waveform to set the start and end, preview it, then choose M4A or WAV and press Export. There is no account and no watermark.',
            ],
            [
              'Can I export the trimmed clip as an MP3?',
              'No. It opens MP3 files but exports M4A (AAC) or WAV, which play on every current phone and computer. For an MP3, trim here and then use the audio converter or the M4A to MP3 converter.',
            ],
            [
              'How do I make a ringtone from a song for my iPhone?',
              'Place the start at the hook, choose the iPhone ringtone (max 40 s) preset, and export as M4A. Rename the file from .m4a to .m4r, add it through Finder, Apple Devices or iTunes, then pick it under Settings, Sounds and Haptics, Ringtone.',
            ],
            [
              'Why is my custom ringtone not showing up on my iPhone?',
              'The usual causes are an extension that still reads .m4a instead of .m4r, a clip longer than 40 seconds, or a transfer method that does not register ringtones. Fix the name, re-trim with the 40-second preset if needed, and add it again.',
            ],
            [
              'What do I do if my iPhone ringtone is too long?',
              'An iPhone ringtone too long for the 40-second limit will not appear in the list. Open the original song again, choose the iPhone ringtone (max 40 s) preset and export a new M4A. If you move the end handle afterwards, check the clip length shown above the waveform before you export.',
            ],
            [
              'Why is my trimmed audio file bigger than the original?',
              'You most likely exported WAV from a compressed file such as an MP3. WAV is uncompressed, so even a short clip can outweigh the whole song. Export as M4A for a small file instead.',
            ],
            [
              'Can I cut audio out of a video?',
              'Yes. Drop an MP4 or WebM video onto the tool and it keeps only the sound, which you can trim and export as M4A or WAV. The video itself is not shortened; for that, use the video trimmer.',
            ],
            [
              'Can I remove a section from the middle of a song?',
              'Not with this tool. It keeps one continuous selection and discards everything outside it, so it cannot delete a middle part and join the two ends. It also does not merge files.',
            ],
            [
              'Is it safe to trim private recordings here?',
              'Your files are never stored on our servers, and nothing is retained after your session. They are never used for training, so a voice memo or interview stays yours.',
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
          Next steps: turn an OGG recording into an MP3 with the{' '}
          <Link to="/tools/ogg-to-mp3" className={linkClass}>
            OGG to MP3 converter
          </Link>
          , turn a finished clip into a video file with{' '}
          <Link to="/tools/mp3-mp4" className={linkClass}>
            MP3 to MP4
          </Link>
          , or change the pace of a video with the{' '}
          <Link to="/tools/video-speed" className={linkClass}>
            video speed changer
          </Link>
          . To learn how tools like this are built, try our free{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
