import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  EyeOff,
  Fingerprint,
  Grid3x3,
  HelpCircle,
  Layers,
  Route,
  ScanFace,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image Blur tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Blur is sold as a privacy job, not a design effect: faces, plates, card
 *    numbers, addresses and chat names before a photo is shared.
 *
 * 2. Regions are drawn by hand and the page says so, then teaches the choice
 *    other pages skip: a solid box for text and numbers, soft blur for faces.
 *
 * 3. Limits are stated plainly (rectangles only, one effect for all regions,
 *    one image at a time, 3000 px cap) with honest routes to sibling tools.
 */
export default function ImageBlurSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Blur Part of an Image Online</span>: Hide Faces, Plates and Private Details Before You Share
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A sports day photo full of other people&rsquo;s children. A car
        listing with a readable number plate. A group chat screenshot showing
        everyone&rsquo;s name. Each needs the same job before it goes
        anywhere: you want to <strong>blur part of an image online</strong>{' '}
        and be sure the hidden part stays hidden. This guide shows how to{' '}
        <strong>blur image</strong> areas, <strong>pixelate image</strong>{' '}
        regions or cover them with a solid box, which of those effects to pick
        for a <strong>blur face</strong> job versus a card number, and what to
        do about the details a <strong>censor image</strong> step cannot reach.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/image-blur.webp"
            alt="Dried flowers seen only as soft blurred shadows through frosted glass panes"
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
              Soft blur for faces, a solid box for numbers. You draw every
              region yourself, so nothing is hidden that you did not choose.
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
            ['#what-it-is', '1. Blur, Pixelate or Censor an Image: What It Is For'],
            ['#how-to-blur', '2. How to Blur Part of a Picture in Four Steps'],
            ['#choose-effect', '3. Blur Face or Black Box? Match the Effect to the Risk'],
            ['#situations', '4. Faces, Plates, Cards, Addresses and Chat Screenshots'],
            ['#not-private', '5. Hidden Is Not the Same as Private'],
            ['#limits', '6. What the Tool Does Not Do, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Image Censor Tool'],
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
          <EyeOff className="w-6 h-6 text-orange-500 shrink-0" />
          1. Blur, Pixelate or Censor an Image: What It Is For
        </h3>
        <p>
          Blurring a whole photo is a style choice. Blurring one part of it is
          a privacy choice: you want to share the picture without also sharing
          a face, a plate or a number that was never yours to publish. So this
          tool works on regions. You pick the rectangles to hide and everything
          else stays sharp.
        </p>
        <p>
          It offers four effects, and they are not interchangeable:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Blur</strong> &mdash; a soft smear that keeps the colour
            of the area and looks natural over a face.
          </li>
          <li>
            <strong>Pixelate</strong> &mdash; the familiar mosaic of square
            blocks, obviously &ldquo;censored&rdquo;.
          </li>
          <li>
            <strong>Black box</strong> &mdash; a solid black rectangle. Nothing
            of the original shows through.
          </li>
          <li>
            <strong>White box</strong> &mdash; a solid white rectangle, the
            cleanest choice for a scanned form or a light screenshot.
          </li>
        </ul>
        <p>
          Use it whenever a picture is about to leave your hands: a post, a
          listing, a support ticket, a report. If you only need to cut away an
          edge rather than hide something inside the frame, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          is the simpler fix.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-blur" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Blur Part of a Picture in Four Steps
        </h3>
        <p>
          Here is <strong>how to blur part of a picture</strong> with the tool
          above. The same steps answer{' '}
          <strong>how to pixelate part of an image</strong> and{' '}
          <strong>how to black out text in an image</strong>; only the effect
          you choose in step three changes.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the image.</strong> Drop it on the panel, click to
            choose it, or paste a screenshot from your clipboard.
          </li>
          <li>
            <strong>Drag to draw regions.</strong> Drag a rectangle over each
            thing to hide, as many as you like. The dashed blue outline shows
            only in the preview, not in the saved file. Click inside a region
            to remove it, or press <em>Clear regions</em> to start over.
          </li>
          <li>
            <strong>Choose the effect and strength.</strong> Pick Blur,
            Pixelate, Black box or White box. The <strong>Strength</strong>{' '}
            slider runs from 2 to 60: softness for Blur, block size for
            Pixelate, no effect on the solid boxes. Regions update as you move
            it.
          </li>
          <li>
            <strong>Pick a format and download.</strong> Choose JPG, PNG or
            WebP and press <em>Download</em>. The file is saved with{' '}
            <strong>-censored</strong> added to its name, beside your untouched
            original.
          </li>
        </ol>
        <p>
          A simple format rule: JPG for photos, PNG for screenshots, where
          crisp text matters. PNG is also the answer for a{' '}
          <strong>pixelate face PNG online</strong> job for a slide. Need a
          smaller file afterwards? The{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          handles that as a separate step.
        </p>
      </section>

      {/* 3 */}
      <section id="choose-effect" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid3x3 className="w-6 h-6 text-orange-500 shrink-0" />
          3. Blur Face or Black Box? Match the Effect to the Risk
        </h3>
        <p>
          This is the decision most guides skip. People ask{' '}
          <strong>can blurred text be unblurred</strong> because they have seen
          it happen. The honest answer: a light blur or a fine mosaic over
          text can leave enough shape for a determined reader to guess the
          words, especially a predictable format like a card number.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ScanFace className="w-5 h-5 text-orange-500 shrink-0" /> Faces and scenery
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Blur looks the most natural here. Raise the strength until
              someone who knows the person could not recognise them, and draw
              the rectangle a little larger than the head.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-orange-500 shrink-0" /> Text, numbers and plates
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Use Black box or White box, which carry nothing of what was
              underneath. If you prefer a mosaic, use Pixelate at high strength
              so each block covers several characters.
            </p>
          </div>
        </div>
        <p>
          So, <strong>is pixelating a license plate safe</strong>? With small
          blocks, not reliably, because a plate has a known layout. With large
          blocks, or better a black box, the plate is gone. Whichever effect
          you use, the pixels in each region are permanently replaced in the
          download; nobody receiving it can switch the effect off.
        </p>
      </section>

      {/* 4 */}
      <section id="situations" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          4. Faces, Plates, Cards, Addresses and Chat Screenshots
        </h3>
        <p>
          The same four steps cover very different jobs, each with its own
          best setting.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Blur faces of children in photos before posting:</strong>{' '}
            draw a region over each face you have no permission to share and
            use Blur at a generous strength. This is{' '}
            <strong>how to blur a face in a photo</strong> without making it
            look vandalised. The photo is never stored on our servers and
            nothing is retained after you download it.
          </li>
          <li>
            <strong>Blur license plate for car sale listing:</strong> one
            rectangle per plate, Black box or strong Pixelate. The same works
            for any <strong>blur license plate online</strong> job on a street
            or dashcam still.
          </li>
          <li>
            <strong>Blur credit card number in photo:</strong> receipts and
            unboxing shots catch card digits more often than people notice.
            Cover number, expiry and name with a Black box.
          </li>
          <li>
            <strong>Blur address on package photo:</strong> box the whole
            shipping label, not just the street line.
          </li>
          <li>
            <strong>Censor names in chat screenshot:</strong> this is{' '}
            <strong>how to hide personal information in a screenshot</strong>:
            paste it in, box every name, avatar and number, and export as
            PNG.
          </li>
          <li>
            <strong>Blur part of an image on iPhone:</strong> open this page in
            Safari, add the photo from your library, and
            draw regions with a finger. If a HEIC photo will not open, convert it with{' '}
            <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              HEIC to JPG
            </Link>{' '}
            first.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="not-private" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. Hidden Is Not the Same as Private
        </h3>
        <p>
          When you set out to <strong>anonymize photo online</strong>, the
          visible part is only half the job. Phone photos usually carry EXIF
          metadata, which can include the device and the GPS location of the
          shot. A blurred face in a file that records a home address has not
          protected much. De-identification guidance such as{' '}
          <a
            href="https://nvlpubs.nist.gov/nistpubs/ir/2015/NIST.IR.8053.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            NIST IR 8053
          </a>
          {' '}makes the same point: identifying information hides in more
          places than the obvious one.
        </p>
        <p>
          This tool is for what people can see. For what the file itself
          records, use the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>
          , which strips location and camera data and shows what was removed.
          Run both before posting anything sensitive.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Check the whole frame before you download.</strong> The
            tool hides exactly what you mark. Reflections, name badges and
            text on a screen in the background are what most often slip
            through.
          </p>
        </div>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Route className="w-6 h-6 text-orange-500 shrink-0" />
          6. What the Tool Does Not Do, and Where to Go Instead
        </h3>
        <p>
          A tool you trust with private photos should be clear about its
          edges.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>No automatic face or plate detection.</strong> You draw
            every region, so nothing is guessed and nothing you wanted to keep
            is blurred by mistake. The flip side is that a face you did not
            mark stays visible, so scan crowds and backgrounds carefully. No
            tool on this site detects faces or plates automatically.
          </li>
          <li>
            <strong>Rectangles only, one effect for all.</strong> There is no
            brush, circle or lasso, and every region shares one effect and
            strength. For a mix, download one pass as PNG, load that copy and
            add the next effect, then pick your final format on the last pass.
            Saving the in-between copy as PNG avoids compressing a photo twice.
          </li>
          <li>
            <strong>One still image at a time.</strong> No batch mode and no
            video blur.
          </li>
          <li>
            <strong>Large images are capped.</strong> A picture whose longest
            side is over 3000 px is scaled down to 3000 px. For exact
            dimensions afterwards, use the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            or the{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>
            .
          </li>
          <li>
            <strong>No portrait-style background blur.</strong> The{' '}
            <Link to="/tools/background-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              background remover
            </Link>{' '}
            removes a background rather than blurring it.
          </li>
          <li>
            <strong>Not for PDFs.</strong> This tool can{' '}
            <strong>redact image online</strong> files, but for text inside a
            document use{' '}
            <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF redact
            </Link>
            .
          </li>
          <li>
            <strong>No unblurring.</strong> The effect is deliberately
            permanent, and no tool here recovers hidden detail.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Image Censor Tool
        </h3>
        <p>
          Whether you searched to <strong>blur face in photo online free</strong>{' '}
          or to <strong>pixelate image online</strong>, many pages end in a
          full editor that wants an account or stamps a logo on the export.
          Here is what this <strong>image censor tool</strong> offers instead.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['A blur tool without sign up', 'No account and no email. Open the page, mark the image, download it.'],
            ['Blur image without watermark', 'The downloaded file carries your picture and the regions you drew, with no logo or stamp added.'],
            ['Four effects, one decision', 'Soft blur for a face, a black box for a card number, and a white box to white out part of image online forms and scans.'],
            ['Your photos stay private', 'Images are never stored on our servers and nothing is retained once you are done.'],
            ['Nothing is used for training', 'Your photos are never used to train anything. A picture of your child or your car stays yours.'],
            ['You stay in control', 'Every region is drawn by hand, the effect is permanent in the download, and your original file is left untouched.'],
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
            free image and document tools
          </Link>{' '}
          built on the same terms. To add your own mark instead, the{' '}
          <Link to="/tools/image-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image watermark tool
          </Link>{' '}
          is the companion to this page.
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
              'How do I blur part of an image online for free?',
              'Add the image to the tool above, drag a rectangle over each area to hide, choose an effect and press Download. The file is saved with -censored in its name, with no account, watermark or charge.',
            ],
            [
              'Can I blur a face without it looking odd?',
              'Yes. Use Blur, draw the rectangle slightly larger than the head, and raise the strength until the person is unrecognisable. Blur keeps the colours of the area, so it sits more naturally than a black box.',
            ],
            [
              'Can blurred text be unblurred?',
              'Weak blur or fine pixelation over text can sometimes be guessed, especially numbers in a known format. For text, card numbers and plates, use Black box or White box, which leave nothing behind. Every effect permanently replaces the hidden pixels in the download.',
            ],
            [
              'Does the tool detect faces or license plates automatically?',
              'No. You draw every region by hand, so nothing is blurred by guesswork, but anything you do not mark stays visible. Check the whole photo for faces, plates and text before downloading.',
            ],
            [
              'Is my photo stored anywhere?',
              'No. Your images are never stored on our servers, nothing is retained, and nothing is used for training. For extra privacy, remove location data with the EXIF remover before sharing.',
            ],
            [
              'Can I use different effects on different regions?',
              'Not in one pass; the effect and strength apply to every region. To mix them, download with the first effect as PNG, load that copy, and add the rest with the second.',
            ],
            [
              'Why is my downloaded image smaller than the original?',
              'Images whose longest side is over 3000 px are scaled down to 3000 px. Smaller images keep their size. For exact dimensions, use the image resizer.',
            ],
            [
              'Can I blur faces in a video or several photos at once?',
              'No. The tool edits one still image at a time. For several photos, repeat the steps for each; no tool on this site currently blurs video.',
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
          Censored and ready to share? Strip location data with the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>
          , convert the result with the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>
          , open an AVIF photo first with{' '}
          <Link to="/tools/avif-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            AVIF to JPG
          </Link>
          , or turn a set of censored pictures into one document with{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF
          </Link>
          . To learn retouching in a full editor, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers selections and masks from the ground up.
        </p>
      </div>
    </article>
  );
}
