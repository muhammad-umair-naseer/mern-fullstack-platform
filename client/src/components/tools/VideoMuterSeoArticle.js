import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Film,
  HelpCircle,
  Layers,
  Music,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Sparkles,
  VolumeX,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Video Muter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. MP4, MOV and M4V are muted by deleting the audio track and copying the
 *    video stream unchanged. That is the headline, because most pages claim
 *    "no quality loss" without saying what they actually do to the file.
 *
 * 2. WebM and MKV are the honest exception: they come out as a new MP4 at
 *    30 fps. Said plainly, in its own section, so nobody is surprised.
 *
 * 3. Everything the tool cannot do (partial muting, keeping the audio,
 *    replacing music, picking a language track, batches) is routed to the
 *    sibling tool that does it, or stated as not covered.
 */
export default function VideoMuterSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Remove Audio from Video</span> Without Losing Quality: Mute a Video, Keep Every Frame
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A family clip with a stranger&rsquo;s phone call in the background. A
        drive filmed with a copyrighted song playing. A screen recording that
        caught your microphone.
        Each one needs the same fix: a <strong>video without sound</strong>{' '}
        that looks exactly like the original. This guide shows how to{' '}
        <strong>remove audio from video</strong> for free, why{' '}
        <strong>mute video</strong> files from a phone come out bit-for-bit
        identical apart from the missing soundtrack, where the one exception
        lies, and which tool to reach for when you need to{' '}
        <strong>remove sound from video</strong> in only part of a clip.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/video-muter.webp"
            alt="A vintage film projector with two reels threaded, standing against a pale wall"
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
              The soundtrack goes. The picture stays exactly as it was
              recorded, frame for frame.
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
            ['#what-muting-is', '1. What It Means to Mute a Video, and When You Need To'],
            ['#how-to-remove-audio', '2. How to Remove Audio from a Video in Three Steps'],
            ['#lossless', '3. Remove Audio from MP4 and MOV Without Re-encoding'],
            ['#exceptions', '4. WebM, MKV and What This Tool Does Not Do'],
            ['#devices', '5. iPhone, Android, Windows and Mac'],
            ['#real-jobs', '6. Copyright Claims, Dashcams and Private Conversations'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Audio Remover'],
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
      <section id="what-muting-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <VolumeX className="w-6 h-6 text-orange-500 shrink-0" />
          1. What It Means to Mute a Video, and When You Need To
        </h3>
        <p>
          A video file holds separate tracks for picture and sound. When you <strong>mute video</strong>{' '}
          in a player, the sound track is still there and simply not played.
          When you <strong>remove sound from video</strong> properly, the sound
          track is taken out of the file, so anyone who opens the copy gets a <strong>video without sound</strong>.
          There is nothing to switch back on.
        </p>
        <p>
          Use one when viewers should see what happened but not hear it, or
          when the soundtrack is a copyright risk or just wind.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-remove-audio" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Remove Audio from a Video in Three Steps
        </h3>
        <p>
          Here is <strong>how to remove audio from a video</strong> with the
          tool above. There are no settings to get wrong.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the video.</strong> Drop it on the panel or pick it
            from your files. MP4, M4V, MOV, WebM and MKV are all accepted. For
            MP4 and MOV a readout lists each track, the duration and whether
            there is audio to remove.
          </li>
          <li>
            <strong>Press Remove audio.</strong> That is the only control. For
            MP4, M4V and MOV the job finishes almost instantly. For WebM and MKV
            a progress bar shows the new copy being made.
          </li>
          <li>
            <strong>Preview and download.</strong> The muted video plays right
            on the page so you can confirm it is silent, then downloads with{' '}
            <strong>-muted</strong> added to the name. Your original is untouched.
          </li>
        </ol>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 not-prose flex gap-3">
          <ScanSearch className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>How to check it worked.</strong> Load the muted copy back
            into the tool. The Tracks line should no longer list a sound track,
            and the Audio line should read &ldquo;none&rdquo;. If you try to
            mute it again, you will be told the file has no audio track. That
            is proof the sound is gone from the file, not merely turned down.
          </p>
        </div>
      </section>

      {/* 3 */}
      <section id="lossless" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500 shrink-0" />
          3. Remove Audio from MP4 and MOV Without Re-encoding
        </h3>
        <p>
          Most phones and cameras save MP4 or MOV, and for those files this
          tool will <strong>remove audio from video without re-encoding</strong>.
          Every sound track is deleted from the file&rsquo;s index, the
          timing tables are corrected to match, and the video stream is copied
          byte for byte. Same codec, same resolution, same frame rate, same
          bitrate, same quality. That is how you <strong>remove audio without losing quality</strong>.
        </p>
        <p>
          Fragmented files, which some cameras and recorders write, are handled
          too. The track structure these formats share is documented in Apple&rsquo;s{' '}
          <a
            href="https://developer.apple.com/documentation/quicktime-file-format"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            QuickTime File Format reference
          </a>
          .
        </p>
        <p>
          To <strong>remove audio from MP4</strong>, you get an MP4 back. To{' '}
          <strong>remove audio from MOV file</strong> recordings, such as
          iPhone or QuickTime clips, you get a MOV back, so nothing downstream
          has to change. The file shrinks only by the size of the soundtrack
          it lost; if you need it smaller than that, run the muted copy
          through the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="exceptions" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. WebM, MKV and What This Tool Does Not Do
        </h3>
        <p>
          You can <strong>remove audio from WebM</strong> and{' '}
          <strong>remove audio from MKV</strong> files here too, but the
          result is different and you should know how. These containers are
          not MP4 or MOV, so the picture is rebuilt into a new MP4 at 30 frames
          per second, with no sound. That copy is re-encoded, so a 60 fps clip comes out at 30. On some setups the
          silent copy is saved as WebM rather than MP4. Other formats, such as AVI, work only
          if they can play on this page at all. To convert first instead, use the{' '}
          <Link to="/tools/webm-mp4" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WebM to MP4 converter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>
          .
        </p>
        <p>What this tool deliberately does not do, and where to go instead:</p>
        <ul className="space-y-2">
          <li>
            <strong>Mute only part of a clip.</strong> Every audio track is
            removed for the whole video; there is no time range. To drop a
            section entirely, cut it out with the{' '}
            <Link to="/tools/video-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video trimmer
            </Link>
            .
          </li>
          <li>
            <strong>Keep the sound as a separate file.</strong> To save it as
            MP3 first, use{' '}
            <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to MP3
            </Link>{' '}
            or the{' '}
            <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              audio converter
            </Link>
            .
          </li>
          <li>
            <strong>Replace the music, isolate a voice or cut background
            noise.</strong> None of these is offered here or by a sibling tool.
          </li>
          <li>
            <strong>Choose which language track to keep, or batch several
            files.</strong> All sound tracks go, and it is one video per run.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="devices" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          5. iPhone, Android, Windows and Mac
        </h3>
        <p>
          The same three steps work everywhere; only the way you pick the file
          changes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>How to mute a video on iPhone:</strong> open this page,
            tap the panel, choose the clip from Photos, then save the muted MOV
            back to Photos or Files. The speaker toggle in the Photos editor
            is an edit that can be reverted, and sharing with the &ldquo;All Photos Data&rdquo;
            option can pass that edit history on, letting the recipient undo it.
          </li>
          <li>
            <strong>How to remove sound from a video on Android:</strong> tap
            the panel, pick the clip from your gallery or files, and the muted
            MP4 lands in your downloads, ready to share from any app.
          </li>
          <li>
            <strong>How to remove audio from video on Windows:</strong> drag
            the file from File Explorer onto the panel; the MP4 you get back
            has not been exported again.
          </li>
          <li>
            <strong>How to remove audio from video on Mac:</strong> drag it in
            from Finder. MOV files from QuickTime or iMovie stay MOV, with the
            picture untouched.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="real-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-orange-500 shrink-0" />
          6. Copyright Claims, Dashcams and Private Conversations
        </h3>
        <p>
          <strong>Remove copyrighted music from video</strong> before
          posting to YouTube or Instagram, or after a claim has already
          landed. This works when the music is the only audio you can lose; removing
          just the song while keeping speech is not something this tool does. A{' '}
          <strong>silent video for Instagram Reels background</strong> is the
          other side of the same job: mute the clip here, then pick a trending
          sound inside the app.
        </p>
        <p>
          <strong>Mute screen recording</strong> files that captured your
          microphone or a notification chime by mistake; screen recorders
          often save WebM, so expect the re-encoded MP4 described above.
          Drivers who <strong>remove audio from dashcam video</strong> before
          sending it to an insurer share the road, not the conversation. The same goes when you{' '}
          <strong>mute security camera footage</strong> from a doorbell or CCTV
          system before passing it on.
        </p>
        <p>
          If you need to <strong>remove background conversation from video before posting</strong>,
          removing all sound is the dependable way; no filter can leave a name
          half audible. It is also the
          answer to <strong>video muted but sound still plays after sharing</strong>.
          A player toggle or an undoable edit in a photo app hides the audio;
          it does not delete it, and the recipient can get it back. A copy made
          here has no audio track to restore.
        </p>
        <p>
          Hit a size cap elsewhere? When a <strong>video too large</strong> for{' '}
          other sites to accept is the problem, note that no file-size cap is set
          here, and long phone recordings in MP4 or MOV go through the same
          quick track removal as short ones.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Audio Remover from Video
        </h3>
        <p>
          Plenty of pages offer to <strong>mute video online</strong>. Many
          stamp the export or quietly re-encode while promising no quality loss. Here is what this{' '}
          <strong>audio remover from video</strong> does instead, so you can
          <strong> remove audio from video online free</strong> and check
          every claim yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Truly lossless for MP4 and MOV', 'The sound track is deleted and the video stream copied byte for byte. Same codec, resolution, frame rate and bitrate as the original.'],
            ['No watermark, no account', 'Remove audio from video with no watermark, no sign-up, no email and no export limit. The tool on this page is the whole product.'],
            ['Honest about the exception', 'WebM and MKV are re-encoded to MP4 at 30 fps, and the tool says so before you press anything.'],
            ['Your videos stay private', 'Files are never stored on our servers and nothing is retained after your session, so you can remove audio from a video privately.'],
            ['Never used for training', 'Your footage is never used for training. A family clip or a dashcam recording stays yours.'],
            ['Proof it worked', 'The track readout shows audio before and none after, and the preview lets you hear the silence first.'],
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
          built on the same terms. Need the clip faster or slower once it is
          silent? The{' '}
          <Link to="/tools/video-speed" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video speed changer
          </Link>{' '}
          picks up where this page stops.
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
              'How do I remove audio from a video for free?',
              'Add the video to the tool at the top of this page, press Remove audio, and download the copy with -muted in its name. There is no account, no watermark and no export limit, and your original file is left unchanged.',
            ],
            [
              'Does removing audio reduce the video quality?',
              'Not for MP4, M4V or MOV. The sound track is deleted and the video stream is copied byte for byte, so codec, resolution, frame rate and bitrate stay identical. WebM and MKV are the exception: they are re-encoded to MP4 at 30 fps, which is a new, lossy copy.',
            ],
            [
              'Can I mute just one part of a video?',
              'No. Every audio track is removed for the whole clip, and there is no way to mute a time range or a single word. If the section can go entirely, cut it out with the video trimmer instead.',
            ],
            [
              'Can I keep the audio as a separate file?',
              'Not with this tool, because muting discards the sound. Save the audio first with the MP4 to MP3 converter or the audio converter, then mute the video here.',
            ],
            [
              'Will a MOV file from my iPhone stay a MOV?',
              'Yes. MOV input comes back as MOV and MP4 or M4V input as MP4, with the picture untouched.',
            ],
            [
              'Why could someone still hear a video I muted on my phone?',
              'A mute toggle in a player or an undoable edit in a photo app only hides the audio, and sharing the original data can bring it back. A copy made here has no audio track at all, so there is nothing for the recipient to restore.',
            ],
            [
              'Can I replace the soundtrack with new music?',
              'Not here, and no sibling tool adds music either. Mute the clip here, then add a sound in the app you are posting to, such as Instagram Reels.',
            ],
            [
              'My video is too large for other sites. Can I still remove the audio?',
              'Yes. No file-size cap is set here, so a video too large for other services to accept can still have its audio removed. Long MP4 and MOV recordings go through the same quick track removal as short clips, with no re-encoding. If you also need the result smaller, run the muted copy through the video compressor.',
            ],
            [
              'Is there an easier way than command-line software to strip the audio track?',
              'Yes. Command-line tools can drop the sound and copy the video stream, but you have to know the right commands. Here it is one button: for MP4, M4V and MOV the result is the same lossless stream copy, with the picture untouched and nothing to type.',
            ],
            [
              'Is it safe to mute dashcam or security camera footage here?',
              'Your videos are never stored on our servers, nothing is retained after your session, and footage is never used for training. Keep the original, since a muted copy cannot get its sound back.',
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
          Silent clip ready for its next step? Turn it into a looping
          animation with{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF
          </Link>{' '}
          or the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>
          , shorten it with the{' '}
          <Link to="/tools/video-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video trimmer
          </Link>
          , or shrink it for email with the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>
          . If you would rather learn to build web tools, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          is a good place to start building tools like this yourself.
        </p>
      </div>
    </article>
  );
}
