import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  HelpCircle,
  Layers,
  Palette,
  Scissors,
  ShieldCheck,
  Smile,
  Sparkles,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Meme Generator tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. It is a caption tool, not a template library. The page says so up front
 *    and never implies a catalogue of famous templates exists.
 *
 * 2. The craft is explained: why Impact with an outline one eighth of the
 *    font size reads on any background, why size is a share of the width,
 *    and when JPG beats PNG.
 *
 * 3. Every adjacent job (animated memes, cropping, HEIC, file size, faces)
 *    is routed to the sibling tool that actually does it.
 */
export default function MemeGeneratorSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Meme Generator</span> for Your Own Pictures: Top Text, Bottom Text, and a Clean Download
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A screenshot that deserves a punchline. A photo of the office printer,
        jammed again. All of them are the same small job:
        put a caption on a picture and save it. This guide shows how to{' '}
        <strong>make a meme</strong> with the free <strong>meme generator</strong>{' '}
        above, why the classic white-and-black lettering reads so well, how to
        pick between JPG and PNG, and &mdash; plainly &mdash; what this{' '}
        <strong>meme maker</strong> does not do, with the tool to use instead.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/meme-generator.webp"
            alt="Two friends laughing together at something on a phone"
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
              Your picture, two captions, the classic lettering. The preview
              updates as you type, and the download carries no watermark.
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
            ['#what-it-is', '1. What This Meme Creator Does, and When to Use It'],
            ['#how-to-make', '2. How to Make a Meme in Four Steps'],
            ['#meme-font', '3. What Font Do Memes Use? Impact, Outline and Size'],
            ['#readable-text', '4. Meme Text Hard to Read? Outlines and White Bars'],
            ['#jpg-or-png', '5. JPG or PNG, and a Meme Too Big to Send'],
            ['#limits', '6. What the Meme Maker Does Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Meme Generator'],
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
      <section id="what-it-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smile className="w-6 h-6 text-orange-500 shrink-0" />
          1. What This Meme Creator Does, and When to Use It
        </h3>
        <p>
          This <strong>meme creator</strong> makes the classic two-caption
          meme: one line of text across the top of a picture, one across the
          bottom, in bold lettering that stays readable over almost anything.
          You bring the picture: a photo, a screenshot, or a copied image
          pasted straight in. There is no gallery of famous
          templates to scroll through, and that is deliberate: most people
          searching for a <strong>custom meme generator</strong> to{' '}
          <strong>upload image</strong> files of their own already have the
          exact picture they want and just need the words on it.
        </p>
        <p>
          It is also a quick way to <strong>add text to image online</strong>{' '}
          when the job is a short, bold caption: a{' '}
          <strong>caption generator for pictures</strong> in the literal sense.
          You write the caption; it sets it in the right place.
        </p>
        <p>Where it earns its place:</p>
        <ul className="space-y-2">
          <li>
            <strong>A reaction image for a team chat.</strong> As a{' '}
            <strong>reaction meme maker for work Slack</strong> threads, it
            turns a screenshot of a failed build into a shared laugh, with no
            account to create.
          </li>
          <li>
            <strong>Lessons and slides.</strong> Teachers looking for a{' '}
            <strong>classroom meme maker for teachers</strong> get a page that
            needs no sign-up for them or their students, and the result drops
            into any slide deck as an ordinary picture.
          </li>
          <li>
            <strong>Personal photos.</strong> A friend&apos;s face is exactly
            the kind of file you would rather not hand to a site that keeps it.
            Files here are never stored on our servers.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-make" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Make a Meme in Four Steps
        </h3>
        <p>
          Here is <strong>how to make a meme</strong> with the tool above. The
          same steps answer <strong>how to make a meme with your own picture</strong>,
          because your own picture is the only kind it uses.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the picture.</strong> Drop it on the panel marked{' '}
            <em>Drop a template image (or paste)</em>, choose it from your
            files, or paste an image you have copied. That last route makes it
            a fast <strong>meme generator from screenshot</strong>: take the
            screenshot, copy it, paste, done. JPG, PNG and WebP all work.
          </li>
          <li>
            <strong>Type the captions.</strong> Fill in <em>Top text</em> and{' '}
            <em>Bottom text</em>. Leave either field empty to drop that caption
            entirely. Long lines wrap onto a new line on their own, centred.
          </li>
          <li>
            <strong>Adjust the look.</strong> Pick a font, move the{' '}
            <em>Size</em> slider, change the text and outline colours, switch{' '}
            <em>UPPERCASE</em> on or off, or tick the white-bar option for the
            modern style. The preview redraws on every keystroke, so what you
            see is what you will download.
          </li>
          <li>
            <strong>Download.</strong> Choose JPG or PNG under <em>Output</em>{' '}
            and press <em>Download meme</em>. The file keeps your original name
            with <strong>-meme</strong> added, so a photo called cat.jpg comes
            back as cat-meme.jpg.
          </li>
        </ol>
        <p>
          Wondering <strong>how to add text to a picture on iPhone</strong>?
          Open this page in Safari, tap the drop
          panel to pick a photo from your library, type the captions, and save
          the download to Photos. If an iPhone photo in HEIC format refuses to
          open, run it through the{' '}
          <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            HEIC to JPG converter
          </Link>{' '}
          first, then come back.
        </p>
      </section>

      {/* 3 */}
      <section id="meme-font" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          3. What Font Do Memes Use? Impact, Outline and Size
        </h3>
        <p>
          If you have ever asked <strong>what font do memes use</strong>, the
          answer for the classic format is{' '}
          <a
            href="https://learn.microsoft.com/en-us/typography/font-list/impact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Impact
          </a>
          : a tall, heavy, condensed typeface that packs a lot of words into a
          narrow line. It is the default here, which makes this an{' '}
          <strong>impact font meme generator</strong> out of the box, and it is
          what gives a <strong>top text bottom text generator</strong> its
          recognisable look. Impact ships with Windows and macOS but is missing
          on some phones and Linux systems; where it is not available, Arial
          Black or another heavy sans-serif stands in, which keeps the bold
          look even if the letter shapes differ slightly. The preview always
          shows exactly the lettering you will download.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Type className="w-5 h-5 text-orange-500 shrink-0" /> Four fonts
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Impact (classic), Arial Black, Comic Sans and a serif, all set in
              bold. Want the ironic look? Choose Comic Sans and it becomes a{' '}
              <strong>comic sans meme generator</strong>. The serif suits a
              mock-serious, newspaper-headline joke.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-500 shrink-0" /> Size as a share of width
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The Size slider runs from 4% to 20% of the picture&apos;s width,
              starting at 10%. Because it is a proportion, a caption looks the
              same on a small screenshot and a large photo.
            </p>
          </div>
        </div>
        <p>
          The other half of the look is the outline. To learn{' '}
          <strong>how to put white text with black outline on image</strong>{' '}
          files, there is nothing to learn: the defaults are white text and a
          black outline, and the outline is fixed at one eighth of the font
          size with rounded corners, so it scales with the text and never looks
          spiky. You can change both colours, but the classic pairing is
          classic for a reason.
        </p>
      </section>

      {/* 4 */}
      <section id="readable-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Meme Text Hard to Read? Outlines and White Bars
        </h3>
        <p>
          The commonest complaint is{' '}
          <strong>meme text hard to read on image</strong> backgrounds, such as
          white letters vanishing into a bright sky. The outline fixes most of
          it, because every letter carries its own contrasting edge. If your
          caption still blends in:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Shorten the caption.</strong> Two lines at most per caption
            is a good rule. Fewer words let you raise the size, and bigger
            letters get a thicker outline automatically.
          </li>
          <li>
            <strong>Switch to white bars.</strong> Tick{' '}
            <em>Add white bars for captions (modern style)</em>. A white band
            is added above and below the picture and the text becomes plain
            black on white, so it cannot clash with the photo at all.
          </li>
        </ul>
        <p>
          That option is also how you get a <strong>meme with white bar
          caption on top</strong>, with the joke above the picture. Type the joke in{' '}
          <em>Top text</em>, leave <em>Bottom text</em> empty, and tick the
          box. The bars are sized to the text, and in this mode the colour
          pickers are ignored because the lettering is always black.
        </p>
        <p>
          One honest catch: the white-bar mode always adds a band both above
          and below the picture, even when one caption is empty. For a
          caption-on-top-only look, download the meme and trim the empty
          bottom band with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          . It takes a few seconds and leaves a clean, single-caption image.
        </p>
        <p>
          A few writing habits help as much as any setting. Put the set-up in
          the top caption and the punchline in the bottom one, so the eye reads
          the joke in order. Leave the subject&rsquo;s face clear of text: a
          smaller size or the white-bar mode keeps both captions off the
          picture entirely. And read the preview at arm&rsquo;s length, the way
          it will appear in a chat thread, before you download.
        </p>
      </section>

      {/* 5 */}
      <section id="jpg-or-png" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-6 h-6 text-orange-500 shrink-0" />
          5. JPG or PNG, and a Meme Too Big to Send
        </h3>
        <p>
          JPG is the default and the right choice for photos, because it
          keeps files small. Choose PNG for screenshots and flat artwork, where
          JPG can smudge sharp text. A{' '}
          <strong>meme generator PNG download</strong> is lossless, as defined
          in the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>
          , so the captions stay crisp, but the file is usually larger.
        </p>
        <p>
          Pictures larger than 1600 pixels on their longest side are scaled
          down to 1600 before the captions go on, which already keeps most
          memes a sensible size. If you still hit a{' '}
          <strong>meme too big to send on Discord</strong> or another chat
          size limit, save as JPG, then squeeze it further with the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          or the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>
          , where you control the quality. Need WebP or another format? The{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          handles that in one more step.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scissors className="w-6 h-6 text-orange-500 shrink-0" />
          6. What the Meme Maker Does Not Do
        </h3>
        <p>
          It is a focused tool. Here is what it leaves to others:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Animated memes.</strong> If you want a{' '}
            <strong>gif meme maker with text</strong>, this is not it: the
            result is always a single still picture, and an animated GIF is
            captioned as its first frame only. To animate stills, caption each
            frame here and combine them with the{' '}
            <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF maker
            </Link>
            . To turn a video moment into a GIF, cut the clip with the{' '}
            <Link to="/tools/video-trimmer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video trimmer
            </Link>{' '}
            and convert it with the{' '}
            <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
              MP4 to GIF converter
            </Link>
            .
          </li>
          <li>
            <strong>A template library or AI captions.</strong> There is no
            catalogue of famous meme pictures and no joke suggestions: you
            bring the image and write the words. A saved template image works
            like any other picture.
          </li>
          <li>
            <strong>Framing the picture.</strong> There is no crop or rotate
            step. Trim the frame with the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>
            , straighten it with{' '}
            <Link to="/tools/rotate-flip-image" className="text-orange-600 font-semibold underline hover:text-orange-700">
              rotate and flip
            </Link>
            , or change its dimensions with the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            before captioning.
          </li>
          <li>
            <strong>More than two captions.</strong> Text sits at fixed top
            and bottom positions, with no dragging, stickers or speech
            bubbles.
          </li>
          <li>
            <strong>Privacy edits.</strong> To hide a face or a name in a
            screenshot, use{' '}
            <Link to="/tools/image-blur" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image blur
            </Link>{' '}
            first. To cut out a subject, use the{' '}
            <Link to="/tools/background-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              background remover
            </Link>
            ; to stamp your own handle on the finished meme, the{' '}
            <Link to="/tools/image-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image watermark
            </Link>{' '}
            tool.
          </li>
          <li>
            <strong>Full resolution and re-editing.</strong> Large photos are
            scaled to 1600 pixels on the longest side; the{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>{' '}
            can make the result bigger afterwards. A downloaded meme cannot be
            reopened with editable captions; while the page is still open, just
            change the text and download again, otherwise add the original
            picture again and retype it.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Meme Generator
        </h3>
        <p>
          Searching for a <strong>meme generator free online</strong> tends to
          surface pages that stamp their logo on your picture or ask for an
          account. If you searched for a{' '}
          <strong>meme generator no watermark</strong> option, this is it, with
          no sign-up and no catch.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['A meme generator with no watermark', 'The download is exactly what the preview shows: your picture and your captions, with no logo or badge added to a corner.'],
            ['A meme maker without signup', 'No account, no email and no card. The tool on this page is the whole product, and it is free every time.'],
            ['A private meme maker', 'Your pictures are never stored on our servers and nothing is retained after you leave, which matters for personal photos and work screenshots.'],
            ['Nothing is used for training', 'Your images and captions are never used for training. A photo of your family stays yours.'],
            ['The authentic classic look', 'Impact in bold, white on a black outline scaled to the text, plus the modern white-bar style in one tick.'],
            ['Instant preview, sensible files', 'The preview updates as you type, and the download is a JPG or PNG named after your original with -meme added.'],
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
            free image and file tools
          </Link>{' '}
          built on the same terms. Before sharing a photo, the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>{' '}
          strips its location details.
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
              'Is this meme generator really free, with no watermark?',
              'Yes. There is no account, no payment and no daily limit, and the downloaded meme carries no logo or watermark.',
            ],
            [
              'How do I remove the watermark another meme site added?',
              'This tool does not erase watermarks from a finished meme. The clean fix is to start from the original picture, add the same captions here, and download a copy with no watermark at all. If the mark sits at the very edge, the image cropper can trim it off.',
            ],
            [
              'Does it have popular meme templates?',
              'No. This meme maker captions a picture you supply rather than offering a template library. If you already have a template image saved, drop it in or paste it and add your text in the usual way.',
            ],
            [
              'What font do memes use, and can I change it?',
              'Classic memes use Impact in bold white with a black outline, and that is the default here. You can switch to Arial Black, Comic Sans or a serif, and change both the text and outline colours.',
            ],
            [
              'How do I make a meme from a screenshot?',
              'Copy the screenshot and paste it onto the drop panel at the top of the page. Type your captions, choose PNG under Output to keep text sharp, and press Download meme.',
            ],
            [
              'Can I make an animated GIF meme?',
              'Not with this tool. It always produces a single still picture, and an animated GIF is used as its first frame only. To animate, caption several stills here and combine them with the GIF maker, or turn a video clip into a GIF with the video trimmer and the MP4 to GIF converter.',
            ],
            [
              'Why is my meme smaller than my original photo?',
              'Pictures larger than 1600 pixels on their longest side are scaled down to 1600 before captions are added, which keeps files easy to share. The image enlarger can make it bigger afterwards.',
            ],
            [
              'My meme is too big to send in a chat app. What can I do?',
              'Save it as JPG rather than PNG, which is usually smaller for photos. If it is still over the limit, run it through the image compressor or JPEG compressor and lower the quality until it fits.',
            ],
            [
              'Is it safe to caption personal photos here?',
              'Your pictures are never stored on our servers, nothing is retained, and nothing is used for training. To strip location data from a photo first, use the EXIF remover.',
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
          Meme finished? Turn a series of captioned stills into a looping GIF with the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>
          , shrink a stubborn PNG with the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>
          , or collect a class set into one handout with the{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF converter
          </Link>
          . To design your own graphics from scratch, our{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers the typography and contrast that make a meme readable.
        </p>
      </div>
    </article>
  );
}
