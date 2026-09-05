import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  Crosshair,
  Droplet,
  HelpCircle,
  Layers,
  Monitor,
  Palette,
  Pipette,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Colour Picker tool.
 *
 * Same skeleton as PdfWordSeoArticle: H2 beneath the page's H1, anchored TOC,
 * H3 sections, six benefit cards, FAQ, closing link block.
 *
 * Three decisions shaped the copy and are worth knowing before anyone edits it.
 *
 * First, the tool samples exactly one pixel. It does not cluster, average or
 * rank anything. So the very high volume phrases around "colour palette
 * generator from image", "dominant colour extractor" and "get the top 5 colours
 * in a photo" are deliberately NOT promised anywhere on this page. Section 6
 * answers the intent behind them honestly instead — you build a palette by
 * hand, and the ten-slot recent-colours strip is what makes that quick. A page
 * that sets the right expectation ranks and keeps ranking; a page that promises
 * automatic extraction earns a bounce and a complaint.
 *
 * Second, declined for the same reason: CMYK and Pantone (the tool emits HEX,
 * RGB and HSL only), alpha/transparency values (the alpha channel is not read),
 * colour-name lookup, and WCAG contrast checking. Each is a real search term
 * and each would be a lie. The screen eyedropper is described with its actual
 * limit — Chrome and Edge — because that is what the tool itself says when it
 * is unavailable.
 *
 * Third, privacy is sold strictly as an outcome: images are not stored, not
 * retained, not used for training. How that is achieved is intentionally absent
 * from every line of this file.
 */
export default function ColourPickerSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab &bull; 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to Use an <span className="text-orange-600 dark:text-orange-400">Image Colour Picker</span> to Get HEX, RGB and HSL Codes From Any Photo
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You have a screenshot of a client&rsquo;s homepage, a photo of a paint
        chip, or a logo somebody emailed as a JPG, and you need the actual code
        behind one particular shade. Squinting at it will not get you there. An{' '}
        <strong>image colour picker</strong> reads the exact pixel you point at
        and hands you its <strong>HEX code</strong>, its{' '}
        <strong>RGB values</strong> and its <strong>HSL values</strong>, ready to
        paste into CSS, a design file or a paint order. This guide covers how to{' '}
        <strong>pick a colour from an image</strong> accurately, which of the
        three codes you actually want, and the two situations that quietly give
        you the wrong answer.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/colour-picker.webp"
            alt="Image colour picker tool sampling a pixel from a photo and showing its HEX, RGB and HSL colour codes"
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
              Point at any pixel in any image and copy its HEX, RGB or HSL value
              in a single click.
            </span>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#what-it-does', '1. What an Image Colour Picker Actually Reads'],
            ['#how-to-pick', '2. How to Pick a Colour From an Image'],
            ['#hex-rgb-hsl', '3. HEX, RGB or HSL: Which Code Do You Need?'],
            ['#screen-eyedropper', '4. Picking a Colour From Anywhere on Screen'],
            ['#accuracy', '5. Why the Colour Looks Right but Reads Wrong'],
            ['#palettes', '6. Building a Palette From a Photo, by Hand'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Colour Picker'],
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
          <Droplet className="w-6 h-6 text-orange-500 shrink-0" />
          1. What an Image Colour Picker Actually Reads
        </h3>
        <p>
          Every digital image is a grid of pixels, and every pixel stores three
          numbers: how much red, how much green and how much blue it contains,
          each on a scale from 0 to 255. That is the whole truth of a colour on a
          screen. A <strong>colour picker from image</strong> does one job
          extremely well &mdash; it finds the pixel you pointed at and reports
          those three numbers in the notations designers and developers actually
          use.
        </p>
        <p>
          The tool above gives you all three at once, generated from the same
          single pixel, so they always agree with each other:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>HEX</strong> &mdash; the six-character code you paste into
            CSS, Figma or a brand guideline, written in uppercase like{' '}
            <code>#F97316</code>. This is the answer to{' '}
            <strong>&ldquo;what is the hex code of this colour&rdquo;</strong>.
          </li>
          <li>
            <strong>RGB</strong> &mdash; the same colour as three plain numbers,{' '}
            <code>rgb(249, 115, 22)</code>. Useful anywhere you need to do
            arithmetic on a colour, and the format most photo editors expect.
          </li>
          <li>
            <strong>HSL</strong> &mdash; hue, saturation and lightness,{' '}
            <code>hsl(25, 95%, 53%)</code>. The human-readable one: change the
            third number and you get a lighter or darker version of the identical
            shade.
          </li>
        </ul>
        <p>
          All three notations are defined in the{' '}
          <a
            href="https://www.w3.org/TR/css-color-4/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C CSS Color Module Level 4 specification
          </a>
          , which is why a HEX code copied here behaves identically in a
          stylesheet, an email template and a design handoff. They are three ways
          of writing one colour, not three different colours.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-pick" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Pick a Colour From an Image (Step-by-Step)
        </h3>
        <p>
          No account, no email, no install. To{' '}
          <strong>get a hex code from an image</strong> with the tool at the top
          of this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your image', 'Drop a JPG, PNG, WebP, GIF, BMP or any other image onto the panel, or click to browse for one. The picker opens it immediately and samples the centre pixel so you have a value straight away.'],
            ['Click the colour you want', 'Click anywhere on the image. The crosshair reads that exact spot and the big swatch updates instantly, along with all three codes underneath it.'],
            ['Copy in one click', 'Click the HEX, RGB or HSL row to copy that value. A tick confirms it went to your clipboard. Paste it wherever you need it.'],
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
          One detail that matters more than it sounds: the value is read from
          your image at its <strong>full original resolution</strong>, not from
          the shrunk-down preview you are looking at. A 4000-pixel-wide photo
          displayed at 700 pixels still gives you the true colour of the precise
          point you clicked. If you want to work on a tighter area first, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          will trim the photo down before you sample it.
        </p>
        <p>
          Every colour you pick is also dropped into a <strong>Recent Colours</strong>{' '}
          strip that holds your last ten distinct shades. Click any swatch to
          bring it back as the active colour &mdash; handy when you are comparing
          two greys and need to flip between them.
        </p>
      </section>

      {/* 3 */}
      <section id="hex-rgb-hsl" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          3. HEX, RGB or HSL: Which Code Do You Actually Need?
        </h3>
        <p>
          People search <strong>rgb to hex</strong> and{' '}
          <strong>hex to rgb</strong> constantly, usually because a tool gave
          them one format and their software wanted another. Picking a colour
          here sidesteps that entirely &mdash; you get the conversion for free,
          because all three are produced together. Still, it helps to know which
          one to grab.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Reach for HEX when
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Writing CSS, HTML or an email template</li>
              <li>Filling in a colour field in a design tool</li>
              <li>Documenting a brand colour for someone else</li>
              <li>You need something short and unambiguous</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-sky-500/5 border border-sky-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Copy className="w-5 h-5 text-sky-600 shrink-0" /> Reach for RGB or HSL when
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Typing values into a photo editor&rsquo;s colour dialog</li>
              <li>You need to nudge a shade lighter or darker (HSL)</li>
              <li>Building a tint or shade scale from one base hue</li>
              <li>Working in code that treats colour as numbers</li>
            </ul>
          </div>
        </div>
        <p>
          HSL is the underrated one. Because the hue stays put while you move
          lightness, a single picked colour gives you an entire ramp: take{' '}
          <code>hsl(25, 95%, 53%)</code>, drop the last value to 30% and you have
          a hover state that is unmistakably the same colour. That is far more
          reliable than eyeballing a darker orange and hoping.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base mt-6">
          What this image colour picker does not output
        </h4>
        <p>
          Worth stating plainly so you do not go hunting: there is no{' '}
          <strong>CMYK</strong> conversion and no Pantone matching here. Those
          are print colour systems, they depend on ink, paper and a colour
          profile, and any web tool that claims to hand you a trustworthy CMYK
          value from a screenshot is guessing. The picker also reads the red,
          green and blue channels only &mdash; it does not report an alpha or
          transparency value.
        </p>
      </section>

      {/* 4 */}
      <section id="screen-eyedropper" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-6 h-6 text-orange-500 shrink-0" />
          4. Picking a Colour From Anywhere on Screen
        </h3>
        <p>
          Sometimes the colour you want is not in a file at all. It is in a
          window sitting next to you: a live website, a video frame, a PDF, an
          app&rsquo;s toolbar. Screenshotting it and loading the screenshot works
          fine, but there is a shortcut.
        </p>
        <p>
          The <strong>Pick Any Screen Colour</strong> button opens a full-screen{' '}
          <strong>eyedropper tool</strong>. Your cursor becomes a magnifier, you
          click any pixel anywhere on your display, and the value lands in the
          panel with its HEX, RGB and HSL codes exactly as if you had picked it
          from an image. It is the fastest answer to{' '}
          <strong>&ldquo;what colour is that on my screen&rdquo;</strong>.
        </p>
        <p>
          The honest caveat: this screen-wide eyedropper is available in Chrome
          and Edge. In Safari and Firefox the button will tell you so rather than
          failing silently, and the fix is a five-second one &mdash; take a
          screenshot, drop it in, and click the pixel. You end up in the same
          place. If your source is a document rather than a screen, our{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          turns pages into images you can sample, and the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF tool
          </Link>{' '}
          pulls out the original embedded artwork at its native quality, which is
          always the better thing to sample from.
        </p>
      </section>

      {/* 5 */}
      <section id="accuracy" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Pipette className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why the Colour Looks Right but Reads Wrong
        </h3>
        <p>
          This is the section people arrive at after picking a brand colour twice
          and getting two different codes. The picker is reporting the pixel
          faithfully every time. The pixel itself is the problem, and there are
          three usual culprits.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base mt-6">
          JPEG compression smears colours together
        </h4>
        <p>
          JPEG throws away detail to save space, and it does it by blending
          neighbouring pixels. On a flat block of brand orange you will barely
          notice, but within a few pixels of an edge &mdash; text, a logo
          outline, a border &mdash; the values shift noticeably. Always sample
          from the middle of a large flat area, never next to an edge. If you
          have a PNG of the same asset, use that; a{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compressed PNG
          </Link>{' '}
          keeps its exact colour values in a way a JPEG never does.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base mt-6">
          Resized and enlarged images invent pixels
        </h4>
        <p>
          Any image that has been scaled has had pixels interpolated &mdash;
          averaged from their neighbours. On gradients and thin details that
          average is not a colour that ever existed in the original. When you
          need a true <strong>brand colour from a logo</strong>, go and find the
          largest version of that file you can, rather than sampling a thumbnail.
          The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          and{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          are for changing dimensions after you have your colour, not before.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base mt-6">
          Transparent areas read as black
        </h4>
        <p>
          Click the see-through region of a transparent PNG and you will very
          often get <code>#000000</code>. Nothing has gone wrong &mdash; there is
          simply no colour stored at that point, so the underlying values are
          zero. If you get an unexpected pure black, you almost certainly clicked
          empty space rather than artwork. Move your click onto the visible part
          of the graphic.
        </p>
        <p>
          Two more things worth knowing. Photographs of physical objects &mdash;
          a wall, a fabric swatch, a product &mdash; carry the colour of whatever
          light was falling on them, so the code you pick describes{' '}
          <em>that photo</em>, not the object. And a display that is not
          colour-calibrated will show you something slightly different from what
          the numbers say; the numbers are still correct.
        </p>
      </section>

      {/* 6 */}
      <section id="palettes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. Building a Colour Palette From a Photo, by Hand
        </h3>
        <p>
          A lot of people searching for a{' '}
          <strong>colour palette generator from image</strong> want a machine to
          look at a photograph and announce its five defining colours. It is
          worth being straight about what this tool is: a precision instrument,
          not an automatic extractor. It reads the single pixel you point at and
          reports it exactly. It does not rank colours, cluster them or decide
          which ones matter.
        </p>
        <p>
          That turns out to be a feature rather than a shortcoming, because
          automatic extraction is famously bad at the thing you actually want. It
          returns the most <em>common</em> colours, which on a product photo is
          usually the background and three shades of shadow. The colours you
          cared about &mdash; the accent on the packaging, the exact blue of the
          sky at the horizon &mdash; are outnumbered and get dropped.
        </p>
        <p>Picking by hand takes about ninety seconds and gives you a better result:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Click your <strong>dominant colour</strong> &mdash; the largest flat
            area, usually a background or a main surface.
          </li>
          <li>
            Click two or three <strong>supporting tones</strong> from different
            regions, sampling the middle of each area rather than its edge.
          </li>
          <li>
            Click one <strong>accent</strong>: the brightest, most saturated
            thing in the frame, however small it is.
          </li>
          <li>
            Your five choices are now sitting in the Recent Colours strip. Copy
            each HEX code out in turn &mdash; and copy the HSL of your main
            colour too, because that is what lets you generate matching lighter
            and darker variants later.
          </li>
        </ol>
        <p>
          One practical note: the recent-colours strip is a working scratchpad
          for the session, not a saved library. Paste the codes somewhere durable
          before you close the tab. If colour theory is the part you want to get
          better at rather than the tooling, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers palette construction properly.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Colour Picker
        </h3>
        <p>
          Plenty of sites will give you a <strong>hex colour picker</strong>.
          Most of them wrap it in three ad units and a newsletter popup. Here is
          what is different, stated plainly enough that you can check every line
          yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with nothing behind a wall', 'No account, no email, no credit card and no trial countdown. The picker on this page is the entire product.'],
            ['Three formats from one click', 'HEX, RGB and HSL are produced together from the same pixel, so they never disagree and you never need a separate converter.'],
            ['True full-resolution sampling', 'The value comes from your image at its original size, not from the scaled preview, so a click on a huge photo is still pixel-exact.'],
            ['Your images stay private', 'Nothing you open is stored on our servers, kept after your session, or used for training or analytics.'],
            ['A screen-wide eyedropper', 'Grab a colour from a live site, a video frame or any other window without screenshotting it first, in Chrome and Edge.'],
            ['An honest account of the limits', 'We tell you where a sampled colour can mislead you — compression, scaling, transparency — instead of letting you find out later.'],
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
          It sits inside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free online tools
          </Link>{' '}
          built on the same terms, so once you have your colour you can carry on
          without paying for any of it &mdash; convert an image format with the{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG, WebP and TIFF converter
          </Link>
          , or wrap a brand colour around a{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            custom QR code
          </Link>
          .
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
              'How do I find the hex code of a colour in a picture?',
              'Drop the picture into the image colour picker at the top of this page and click the colour you want. The HEX code appears immediately, alongside the matching RGB and HSL values, and one more click copies whichever you need to your clipboard. There is no sign-up and no limit on how many colours you sample.',
            ],
            [
              'Is this colour picker free, and do I need an account?',
              'It is free with no account, no email address and no usage cap. Pick one colour or two hundred. Nothing is watermarked, metered or held back for a paid tier, because there is no paid tier.',
            ],
            [
              'Can I pick a colour from a website or a video instead of a file?',
              'Yes. Use the Pick Any Screen Colour button to open a full-screen eyedropper and click any pixel on your display, including a live page or a paused video. That screen-wide picker works in Chrome and Edge; in Safari or Firefox, take a screenshot and sample that image instead.',
            ],
            [
              'Why does the colour I picked look different from the original?',
              'Usually JPEG compression or resizing. Both blend neighbouring pixels together, so a spot near an edge or in a gradient can read a few values off. Sample from the middle of a large flat area, and use the biggest, least-compressed version of the file you have. Photographs also carry the colour of the light they were shot under.',
            ],
            [
              'Does it give me CMYK or Pantone values for printing?',
              'No. The tool outputs HEX, RGB and HSL only. CMYK and Pantone depend on ink, stock and a colour profile rather than on the pixel alone, so a screen-derived value would be a guess. For print work, take the HEX code to your printer and let them match it properly.',
            ],
            [
              'Are my images kept when I use the colour picker?',
              'No. Images are never stored on our servers, never retained after your session, and never used for training or analytics. Nothing you open here is logged or queued.',
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
          Working on the same image? The{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          trims it to the part you care about, the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          sets exact dimensions for the web, and the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          shrinks the file without touching its colours. If you would rather
          learn to build interfaces than only style them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers CSS colour, design systems and the image APIs behind tools like
          this one.
        </p>
      </div>
    </article>
  );
}
