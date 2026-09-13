import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileVideo,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Music,
  Palette,
  Share2,
  Sparkles,
  Video,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the MP3 to MP4 tool.
 *
 * Written against what Mp3ToMp4.js actually does, which is narrower than the
 * keyword set would like. The tool takes one audio track, one optional still
 * image, a choice of three frame sizes and a background colour, and produces
 * one MP4. That is the whole feature list, so the article sells the one thing
 * competitors never state: exactly what is inside the file you download and
 * why YouTube and Instagram accept it first time.
 *
 * Keywords that ask for the rendering recipe or for a description of where
 * the work happens are deliberately not served; their underlying intent
 * (privacy, not needing a video editor) is answered without that phrasing.
 *
 * Things the obvious phrases would promise and the code does not do, each
 * stated plainly rather than glossed: no 9:16 vertical frame (section 7 sends
 * Reels and Shorts users to the square preset as the closest fit), no
 * waveform or animation, no reading of the album art embedded in the MP3, no
 * trimming, and audio is always re-encoded to AAC 128 kbps, which matters to
 * the WAV and FLAC searcher in section 6. The background colour only applies
 * when there is no cover image; behind a cover the bars are always black.
 */
export default function Mp3ToMp4SeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">MP3 to MP4 Converter</span> That Tells You Exactly What You Get
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        YouTube will not take a song. Instagram will not take a podcast episode.
        Both want video, and the fastest way to give them one is to pair your
        track with a picture. That is the whole job of an{' '}
        <strong>MP3 to MP4 converter</strong>: one audio file, one still image or
        a plain colour, one MP4 that plays everywhere. This guide walks through
        how to <strong>convert MP3 to MP4 with image</strong> in three clicks,
        how your cover art is fitted into the frame, what the finished file
        actually contains, and the handful of things this{' '}
        <strong>audio to video converter</strong> deliberately does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/mp3-mp4.webp"
            alt="MP3 to MP4 converter - turn an audio track and a cover image into a YouTube-ready video"
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
              One track, one picture, one MP4 the exact length of the song.
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
            ['#why-video', '1. Why You Cannot Upload an MP3 to YouTube or Instagram'],
            ['#how-to-convert', '2. How to Convert MP3 to MP4 Online Free'],
            ['#cover-art', '3. Adding an Image: How Your Cover Art Is Fitted'],
            ['#frame-and-colour', '4. 720p, 1080p or Square, and the Solid Colour Option'],
            ['#what-you-get', '5. The Exact MP4 You Download'],
            ['#other-formats', '6. WAV, FLAC and M4A: An Audio to Video Converter for Any Track'],
            ['#platforms', '7. Podcasts on YouTube, Songs on Instagram, and the Vertical Question'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free MP3 to MP4 Converter'],
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
      <section id="why-video" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why You Cannot Upload an MP3 to YouTube or Instagram
        </h3>
        <p>
          If you have searched <strong>can&rsquo;t upload MP3 to YouTube</strong>{' '}
          or stared at a <strong>YouTube audio file not supported</strong> message
          in YouTube Studio, nothing is wrong with your file. YouTube is a video
          platform and its uploader only accepts video containers. An MP3 has no
          picture track, so it is refused before anything else is checked.
          Instagram is stricter still: there is no audio upload at all, which is
          why <strong>Instagram doesn&rsquo;t support audio files</strong> is such a
          common search from musicians posting their first single.
        </p>
        <p>
          The fix is the same on both platforms. <strong>How to upload audio to
          YouTube</strong> really means how to wrap the audio in a video: give the
          track a picture to sit under for its whole duration, save the pair as
          an MP4, and upload that. The picture can be your album cover, a podcast
          logo, a photo, or simply a flat colour. The tool at the top of this
          page does exactly this and nothing more, which is why it is quick.
        </p>
        <p>
          The reverse job, pulling the sound out of a video you already have, is
          a different tool. If you have an MP4 and want the MP3, use our{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3 extractor
          </Link>{' '}
          instead.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert MP3 to MP4 Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark, no video editor to learn. Here is{' '}
          <strong>how to convert MP3 to MP4</strong> with the panel above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your audio track', 'Click the first panel and pick an MP3, WAV, FLAC, OGG, M4A or AAC file. One track per run. The tool checks that it is genuinely audio before going further.'],
            ['Add a cover image, or skip it', 'Click the second panel for a JPG, PNG or WebP. A thumbnail confirms the choice. Leave it empty and you get a solid colour frame instead, in any colour you pick.'],
            ['Pick a frame size and render', 'Choose 720p, 1080p or square 1:1, press Convert, and watch the percentage climb. The finished video plays in the page before you download it.'],
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
          The download is named after your audio file with{' '}
          <code>_video.mp4</code> on the end, so <code>single.mp3</code> comes
          back as <code>single_video.mp4</code>. If the preview shows the wrong
          colour or the wrong frame shape, change the setting and press Convert
          again; nothing has been committed until you click Download.
        </p>
      </section>

      {/* 3 */}
      <section id="cover-art" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500 shrink-0" />
          3. Convert MP3 to MP4 With an Image: How Your Cover Art Is Fitted
        </h3>
        <p>
          The most common complaint about tools that{' '}
          <strong>add image to MP3 to make video</strong> is what they do to the
          picture. Album covers are square. YouTube frames are 16:9. Something has
          to give, and most converters either stretch the cover sideways until
          faces look wide, or crop the top and bottom off it. Neither is what a
          musician wants when they <strong>turn MP3 into video with album
          cover</strong>.
        </p>
        <p>
          This tool does the third thing. The image is scaled to fit inside the
          frame with its proportions untouched, centred, and the leftover space
          on either side is filled with black bars. A square cover in a 1080p
          frame comes out as a full-height square in the middle with black
          pillars left and right. A wide banner in the square preset gets black
          bands above and below. If you searched <strong>MP3 to MP4 keep aspect
          ratio no stretching</strong>, this is the behaviour you were looking
          for.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Want the image to fill the frame?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Make the image the same shape as the frame before you start. A
              1920&times;1080 picture fills a 1080p video edge to edge with no
              bars at all. Our image cropper can cut a 16:9 or 1:1 region out of
              any photo in a few seconds.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              The bars are always black
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The background colour picker only appears when there is no cover
              image, and it only applies to that case. Behind a picture, the
              padding is black. If you want coloured margins around your art,
              build them into the image first with a resizer or editor.
            </p>
          </div>
        </div>
        <p>
          Two things to know about the image itself. First, the tool does not
          read the artwork embedded inside the MP3&rsquo;s tags; you supply the
          picture as a separate file, which also means you can use a different
          one from what the music player shows. Second, JPG, PNG and WebP are the
          formats to use; a GIF is accepted but only its first frame is used,
          and BMP and TIFF are rejected. Run those through the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          first, and use the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          or{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          if you want the cover shaped to the frame.
        </p>
      </section>

      {/* 4 */}
      <section id="frame-and-colour" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          4. 720p, 1080p or Square, and the Solid Colour Option
        </h3>
        <p>
          There are three frame sizes and they cover the two shapes that matter
          for a still-image video.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>1280&times;720 (720p HD, 16:9).</strong> The default. Fine
            for YouTube, quick to render, and the sensible choice for long
            recordings where the picture never changes anyway.
          </li>
          <li>
            <strong>1920&times;1080 (1080p Full HD, 16:9).</strong> Pick this
            when your cover art is high resolution and you want YouTube to offer
            a 1080p playback option. It takes longer to render than 720p
            because every frame carries more picture.
          </li>
          <li>
            <strong>1080&times;1080 (Square 1:1).</strong> Made for Instagram
            feed posts and any other place a square sits better than a
            widescreen frame. Searchers after <strong>MP3 to MP4 1080p square
            Instagram</strong> output want this one.
          </li>
        </ul>
        <p>
          If you have no artwork, do not settle for a black screen. Leave the
          cover panel empty and a colour picker appears, with a hex field beside
          it so you can type a brand colour exactly. The default is a dark navy,
          but a <strong>MP3 to MP4 solid color background</strong> can be anything
          from white to neon. Our{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          will pull the exact hex value out of a logo or photo if you want the
          frame to match.
        </p>
      </section>

      {/* 5 */}
      <section id="what-you-get" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileVideo className="w-6 h-6 text-orange-500 shrink-0" />
          5. The Exact MP4 You Download
        </h3>
        <p>
          Most converter pages say &ldquo;MP4&rdquo; and leave it there, which
          is why people end up with files that YouTube accepts but a phone will
          not play, or files far larger than they need to be. Here is the
          output of this tool, every time, with no hidden quality tier:
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['H.264 video', 'The most widely supported video codec there is. Encoded with a still-image tuning, so a picture that never changes costs almost nothing per second.'],
            ['yuv420p pixel format', 'The colour layout every player, phone and platform understands. Skipping it is a common reason a converted MP4 plays on a desktop but shows a black screen on a phone.'],
            ['AAC audio at 128 kbps', 'The audio is always re-encoded to AAC, the standard companion to H.264 inside MP4. Section 6 explains what that means for WAV and FLAC sources.'],
            ['Exactly as long as the track', 'The video ends when the audio ends. No trailing seconds of silence, no cut-off ending.'],
            ['Streams from the first second', 'The file index is placed at the front, so the preview and any web player start immediately instead of waiting for the whole download.'],
            ['Small on disk', 'A still image plus a compressed audio track produces a file not much bigger than the audio alone. If you searched "video file too big after MP3 to MP4", a video editor export was the problem, not the format.'],
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
          That H.264 plus AAC pairing inside an MP4 container is the combination
          YouTube lists in its own upload guidance and the one MDN&rsquo;s{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            web video codec guide
          </a>{' '}
          recommends for the broadest playback compatibility. If you searched{' '}
          <strong>MP3 to MP4 H264 AAC YouTube recommended settings</strong>, the
          honest answer is that the codecs and container match, the audio
          bitrate here is fixed at 128 kbps rather than YouTube&rsquo;s higher
          suggested figure, and YouTube accepts and plays the file without
          complaint. Frame rate, video bitrate and codec profile are not
          adjustable; for a still image none of them change what you see. If you
          need a different container or codec afterwards, the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          takes the MP4 from here.
        </p>
      </section>

      {/* 6 */}
      <section id="other-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-orange-500 shrink-0" />
          6. WAV, FLAC and M4A: An Audio to Video Converter for Any Track
        </h3>
        <p>
          The name says MP3, but the audio panel takes MP3, WAV, FLAC, OGG, M4A
          and AAC, so you can <strong>convert WAV to MP4</strong> straight from a
          studio master without making an MP3 first, and a{' '}
          <strong>convert M4A to MP4 video for YouTube</strong> job from an
          iPhone Voice Memo needs no extra step either.
        </p>
        <p>
          One caveat matters to anyone bringing a lossless file. The audio inside
          the MP4 is always re-encoded to AAC at 128 kbps. A WAV or a{' '}
          <strong>FLAC to MP4 with cover art</strong> conversion therefore
          produces a lossy soundtrack, and a 320 kbps MP3 comes out at 128 kbps
          too. For a YouTube upload that is rarely a problem, because YouTube
          re-encodes everything it receives anyway. For an archive of your
          master, keep the original; the MP4 is for publishing, not preserving.
          There is no audio quality setting to change this, and there is no
          trimming, fade or looping, so cut the track before you bring it here.
        </p>
        <p>
          It is also worth knowing that the audio track makes up almost the
          entire size of the finished MP4, so the size of the download is set
          by the length of the recording, not by the frame size. Bring the best
          copy of the track you have: converting a WAV to a lossy format with
          the{' '}
          <Link to="/tools/wav-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            WAV compressor
          </Link>{' '}
          or the{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio converter
          </Link>{' '}
          before you start adds a second lossy pass on top of the AAC re-encode
          and does not make the MP4 any smaller, so only do it when the file is
          too large to work with in its original form.
        </p>
      </section>

      {/* 7 */}
      <section id="platforms" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-orange-500 shrink-0" />
          7. Podcasts on YouTube, Songs on Instagram, and the Vertical Question
        </h3>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Upload a podcast to YouTube with a static image
        </h4>
        <p>
          A podcast episode with a logo is the classic use of this tool, and the
          cheapest way to give a show a YouTube presence. Use 720p: the image
          never moves, so the extra pixels of 1080p buy nothing, and an hour-long
          episode renders faster at the smaller frame. The tool sets no file
          size cap and no duration cap, so a long episode is allowed; it simply
          takes longer than a three-minute single.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          How to post a song on Instagram with a picture
        </h4>
        <p>
          Choose the square 1:1 preset, add your cover, render, download, and
          post the MP4 from the Instagram app. The square frame fills a feed post
          edge to edge. Instagram now treats every video post as a Reel, and a
          square video in the Reels player is shown with empty space above and
          below it, which is fine for most releases.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          What about Reels, TikTok and Shorts?
        </h4>
        <p>
          Those want a vertical 9:16 frame, and this tool does not offer one.
          The three presets are two widescreen sizes and one square, so the
          square is the closest fit and it uploads to all three platforms; it
          just will not fill a phone screen top to bottom. There is also no
          waveform, visualiser, text overlay or animation, which is a deliberate
          trade for a tool that finishes in one click. If you need motion, a
          short looping{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF
          </Link>{' '}
          cannot carry sound, so a video editor is the right tool for that job.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free MP3 to MP4 Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['MP3 to MP4 converter free online, every time', 'No trial, no daily quota, no premium tier holding back the 1080p preset. Every option on the panel is available to everyone.'],
            ['MP3 to MP4 no watermark', 'Nothing is stamped on the video, in any corner, at any size. What you preview is exactly what you download.'],
            ['MP3 to MP4 converter no signup', 'No account and no email address. Open the page, choose a file, press Convert.'],
            ['MP3 to MP4 converter no file size limit', 'The tool enforces no cap on file size or duration. A two-hour mix is allowed; it takes longer, that is all.'],
            ['Your files stay private', 'Your audio and artwork are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['You know exactly what you get', 'H.264, yuv420p, AAC 128 kbps, video the length of the track, art fitted without stretching. Written down here rather than discovered after upload.'],
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
            compress the video
          </Link>
          ,{' '}
          <Link to="/tools/mp3-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            shrink the MP3
          </Link>{' '}
          or{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            cut a GIF preview
          </Link>{' '}
          from the result without paying for any of it.
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
              'Is this MP3 to MP4 converter free, and does it add a watermark?',
              'Free every time, with no account and no watermark. There is no premium version of the tool with more presets or a higher limit; the panel above is the whole thing.',
            ],
            [
              'Why can’t I upload an MP3 to YouTube directly?',
              'YouTube only accepts video files, and an MP3 has no picture track, so the uploader rejects it with a format-not-supported message. Convert it to an MP4 with a cover image or a solid colour using the tool above and the same upload goes through.',
            ],
            [
              'Will my album cover be stretched or cropped?',
              'Neither. The image is scaled to fit inside the frame with its proportions intact and centred, and any leftover space is filled with black bars. If you want no bars, crop the image to the same shape as the frame first, 16:9 for 720p and 1080p or 1:1 for the square preset.',
            ],
            [
              'Can I make a vertical video for Reels, TikTok or Shorts?',
              'Not in a 9:16 frame; the tool offers 720p, 1080p and square 1:1 only. The square preset uploads to all three platforms and is the closest fit, but it will not fill a phone screen from top to bottom.',
            ],
            [
              'Does the audio quality change when I convert WAV or FLAC to MP4?',
              'Yes. The audio inside the MP4 is always re-encoded to AAC at 128 kbps, so a lossless WAV or FLAC becomes lossy and a 320 kbps MP3 is reduced to 128 kbps. That is fine for publishing to YouTube or Instagram, which re-encode everything anyway, but keep your original master separately.',
            ],
            [
              'Is there a file size or length limit?',
              'The tool enforces no file size cap and no duration cap. Long recordings and the 1080p preset take longer to render, so 720p is the quicker choice for an hour-long podcast, but there is no size at which the tool turns a file away.',
            ],
            [
              'Why is my converted video file so big, and how do I shrink it?',
              'From this tool it should not be: a still image encoded with H.264 adds very little on top of the audio, so the MP4 is close to the size of a 128 kbps audio track of the same length. If a video editor gave you a huge file, converting here again from the original audio is the simplest fix, and our video compressor can reduce any MP4 further.',
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
          Going the other way, or somewhere nearby? The{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3 extractor
          </Link>{' '}
          pulls the sound back out of a video, the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          shrinks the finished MP4 for messaging apps, the{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio converter
          </Link>{' '}
          changes the track&rsquo;s format before you begin, and the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          shapes the artwork to the frame. If you would rather understand how
          the web serves media than simply use the tools, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers how files, formats and players fit together from the beginning.
        </p>
      </div>
    </article>
  );
}
