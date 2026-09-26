import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eraser,
  HelpCircle,
  Layers,
  Palette,
  PenLine,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wand2,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Background Remover tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. This is a colour-based cutout, not an AI subject detector, and the page
 *    says so. The pitch is the job colour cutouts do best: logos, signatures,
 *    icons, screenshots and product shots on plain or gradient backdrops.
 *
 * 2. Every control is described by what it fixes (halos, white inside
 *    letters, stray specks) rather than by how it works.
 *
 * 3. The limits are stated plainly (no AI for hair or busy scenes, no new
 *    background, one image at a time, 2200 px longest side, PNG or WebP only,
 *    no undo) with a route to the sibling tool for each next step.
 */
export default function BackgroundRemoverSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Remove White Background from Logo</span> Files and Make Any Plain Background Transparent
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A logo stuck in a white rectangle on a dark website header. A
        signature that covers the line it should sit on. A product shot whose
        grey backdrop clashes with every other listing. Each is one job: take
        out a plain background and keep the artwork crisp. This guide shows how to{' '}
        <strong>remove white background from logo</strong> files for free, how
        to <strong>make background transparent</strong> in signatures, icons and
        product photos, how to fix the halos and white letter holes that other
        tools leave behind, and &mdash; honestly &mdash; when a different kind
        of <strong>background remover</strong> is the better choice.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/background-remover.webp"
            alt="A small still life set on a white backdrop under studio lights, ready for a clean cut-out"
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
              The checkerboard is empty space. Whatever sits on it is what you
              download, ready for any colour behind it.
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
            ['#what-it-does', '1. What a Background Remover Does, and Which Kind You Need'],
            ['#how-to-remove', '2. How to Remove White Background from a Logo in Four Steps'],
            ['#inside-letters', '3. The White Inside Letters, and Removing Any Single Colour'],
            ['#halos-and-boxes', '4. Halos, White Boxes and PNGs That Are Not Transparent'],
            ['#signatures-products', '5. Signatures, Product Photos and Screenshots'],
            ['#limits', '6. What It Does Not Do, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Use Cortexis to Remove a Logo Background'],
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
          <Wand2 className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Background Remover Does, and Which Kind You Need
        </h3>
        <p>
          To <strong>remove background from image</strong> files means turning
          background pixels into empty space. The result is an image with a{' '}
          <strong>transparent background</strong>, saved in a format that can
          hold transparency: PNG or WebP. A JPG cannot, which is why so many
          logos arrive with a white rectangle attached.
        </p>
        <p>
          AI removers guess where a person or object is, which helps with hair
          but often goes wrong on lettering: thin strokes get eaten, crisp edges
          go soft, and the white inside an O stays behind. The tool on this page
          is a <strong>colour-based cutout</strong> instead. It removes pixels
          because they match the background, which makes it predictable on
          logos, signatures, icons, screenshots and product photos on plain or
          gradient backgrounds &mdash; a <strong>logo background remover</strong>{' '}
          and <strong>transparent PNG maker</strong> with the controls to get
          those images clean.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-remove" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Remove White Background from a Logo in Four Steps
        </h3>
        <p>
          Here is <strong>how to remove white background from logo</strong>{' '}
          images, and <strong>how to make a PNG transparent</strong> when it
          has a solid fill.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the image.</strong> Drop a logo, product photo or
            screenshot onto the panel, or paste it. PNG, JPG and WebP all work;
            for an animated GIF, only the first frame is used.
          </li>
          <li>
            <strong>Keep the default method.</strong> <em>Flood fill from the
            corners</em> removes the background that touches the edges of the
            picture and leaves the logo alone. The preview appears on a
            checkerboard, and a status line tells you what share of the image
            has been cleared and the size you will download. If you would rather
            start with nothing removed and choose each area yourself, pick{' '}
            <em>Manual: click regions to remove / restore</em> instead.
          </li>
          <li>
            <strong>Tune the two sliders.</strong> <em>Tolerance</em> (1 to 120,
            default 28) decides how different from the background a pixel can be
            and still go; <em>Edge feathering</em> (0 to 8 px) softens the cut
            edge. Raise tolerance if a light rim remains, lower it if the logo
            starts disappearing.
          </li>
          <li>
            <strong>Touch up, then download.</strong> Click any leftover patch to
            erase it, or switch to <em>Click: restore region</em> and click a
            part you want back. Choose <em>PNG (transparent)</em> or{' '}
            <em>WebP (transparent)</em> and press <em>Download</em>.
          </li>
        </ol>
        <p>
          Set the sliders first and touch up last: moving a slider rebuilds the
          cutout and clears earlier clicks, and there is no undo.
        </p>
      </section>

      {/* 3 */}
      <section id="inside-letters" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          3. The White Inside Letters, and Removing Any Single Colour
        </h3>
        <p>
          The most common complaint about a{' '}
          <strong>background remover not removing white inside letters</strong>{' '}
          has a simple cause. The white inside an O, A, e or a closed shape is
          not connected to the outside background, so working inward from the
          edges never reaches it. Two fixes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Click the holes.</strong> In flood mode, click each enclosed
            white area to erase it.
          </li>
          <li>
            <strong>Switch to colour mode.</strong> Choose{' '}
            <em>Remove a picked colour everywhere</em>. Every pixel close to white
            disappears, inside letters included.
          </li>
        </ul>
        <p>
          Colour mode is also the answer to{' '}
          <strong>how to remove a colour from an image</strong> in general. To{' '}
          <strong>remove black background from image transparent</strong>,
          pick the black and raise tolerance until the dark edge noise goes. To{' '}
          <strong>remove green screen background from image online</strong>,
          click the green and adjust; green reflected onto the subject&rsquo;s
          edges stays. One caution: colour mode removes that colour everywhere,
          so white text inside a design goes too. In that case stay in flood
          mode and click only the holes.
        </p>
      </section>

      {/* 4 */}
      <section id="halos-and-boxes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Halos, White Boxes and PNGs That Are Not Transparent
        </h3>
        <p>
          A <strong>white halo around logo after removing background</strong>{' '}
          comes from edge pixels that are part logo and part white. On a dark
          header they show as a pale rim. Raise <em>Tolerance</em> a few steps
          so more of them go, and keep <em>Edge feathering</em> low, around 0 to
          1 px, for crisp logos; add more only if the edge looks jagged. The{' '}
          <em>Remove small floating specks</em> option clears stray dots that
          noisy JPG backgrounds leave.
        </p>
        <p>
          If another remover <strong>ruined your logo edges</strong>, rounding
          sharp corners or eating thin strokes and serifs, start again from the
          original file here. A colour cutout guesses nothing, so thin strokes
          stay exactly as drawn; keep feathering at 0 to 1 px for the crispest
          edge.
        </p>
        <p>
          <strong>Why does my logo have a white box?</strong> Almost always
          because the file is a JPG, or a PNG saved with an opaque white fill.
          Neither has empty space for the colour behind to show through. And if your <strong>PNG is not transparent when
          downloaded</strong> from somewhere else, showing a grey-and-white
          checkerboard wherever it goes, the checkerboard itself was painted
          into the pixels. That file was never transparent. Load it here, raise{' '}
          <em>Tolerance</em> until both shades of the fake checkerboard clear,
          then click any squares that remain.
          The{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>{' '}
          describes the alpha channel that real transparency depends on.
        </p>
      </section>

      {/* 5 */}
      <section id="signatures-products" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500 shrink-0" />
          5. Signatures, Product Photos and Screenshots
        </h3>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <PenLine className="w-5 h-5 text-orange-500 shrink-0" /> Signatures
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For <strong>how to remove background from signature</strong>{' '}
              photos, shoot plain paper in even light and use colour mode.
              Click the paper to pick its real shade, then raise tolerance until
              the grey goes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500 shrink-0" /> Product photos
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Flood mode checks each corner and edge against its own colour, so
              it can <strong>remove gradient background from image</strong>{' '}
              files shot in a studio sweep. Keep the product clear of the frame
              edge.
            </p>
          </div>
        </div>
        <p>
          To <strong>remove white background from signature for PDF</strong>{' '}
          use, download the PNG and place it in your document; to sign a PDF
          file directly, the{' '}
          <Link to="/tools/pdf-esign" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF e-sign tool
          </Link>{' '}
          is built for that. Sellers learning{' '}
          <strong>how to remove background from product photo</strong> files
          for a shop should process each shot the same way, then trim the empty
          edges with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          and match sizes with the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          . That is how to <strong>remove background from product photo for Etsy or
          Shopify</strong> listings with a consistent look.
        </p>
        <p>
          To <strong>remove background from screenshot</strong> images, paste
          them in; flat interface backgrounds rarely need tuning. When you
          need to <strong>make logo transparent for website header</strong>{' '}
          use, choose the <strong>transparent background WebP</strong> output
          for a lighter file on the page, or PNG where you need the widest
          support. Google documents the format&rsquo;s transparency support in
          its{' '}
          <a
            href="https://developers.google.com/speed/webp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            WebP developer guide
          </a>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eraser className="w-6 h-6 text-orange-500 shrink-0" />
          6. What It Does Not Do, and Where to Go Instead
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>People, pets, hair and busy scenes.</strong> There is no AI
            subject detection; for a portrait in a living room, an AI cutout
            tool is the better choice, and we do not offer one.
          </li>
          <li>
            <strong>A new background.</strong> It makes the background
            transparent and stops there. To soften part of a photo, use{' '}
            <Link to="/tools/image-blur" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image blur
            </Link>
            ; to place your new transparent logo over another image, use the{' '}
            <Link to="/tools/image-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image watermark tool
            </Link>
            .
          </li>
          <li>
            <strong>Full size above 2200 px.</strong> Images longer than 2200 px
            on their longest side are scaled down to that size. The{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>{' '}
            can scale the result up afterwards, and the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            sets exact dimensions.
          </li>
          <li>
            <strong>JPG, SVG or ICO output.</strong> You get PNG or WebP. For an
            icon, the{' '}
            <Link to="/tools/favicon-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
              favicon generator
            </Link>{' '}
            takes the PNG; for other raster formats use the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>
            , bearing in mind that JPG will fill the transparency in again.
          </li>
          <li>
            <strong>Batches, undo, brush size or zoom.</strong> One image per
            run, and touch-ups are whole-region clicks rather than a pixel
            eraser. Moving any slider, changing the method or the colour
            rebuilds the cutout and discards earlier clicks, so settle the
            settings first.
          </li>
          <li>
            <strong>Smaller files and iPhone photos.</strong> Shrink the result
            with the{' '}
            <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PNG compressor
            </Link>
            . If a HEIC photo will not open, convert it with{' '}
            <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              HEIC to JPG
            </Link>{' '}
            first. Video and animated GIF frames are not supported.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis to Remove a Logo Background
        </h3>
        <p>
          Plenty of pages promise a <strong>background remover online free</strong>,
          then ask for an account before the full-size download. Here is what is
          different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['No watermark, no sign-up', 'A background remover with no watermark, no sign-up, no credits and no preview-only download.'],
            ['Built for logos and lettering', 'Remove white background online free without losing thin strokes, and clear the white inside letters with one setting instead of an afternoon of clicks.'],
            ['Controls you can see', 'Tolerance, edge feathering, colour picking, speck clean-up and click to erase or restore, so you can fix a cutout rather than start again.'],
            ['Predictable results', 'Pixels go because they match the background, not because a model guessed. Run the same logo twice and you get the same edge.'],
            ['Your images stay private', 'Files are never stored on our servers and nothing is retained after your session, which matters for unreleased logos and signatures.'],
            ['Nothing is used for training', 'Your logos, signatures and product photos are never fed into training data. They stay yours by policy, not by luck.'],
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
          built on the same terms, and it works the same on a Chromebook, a Mac
          or a Windows PC.
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
              'How do I remove the white background from a logo for free?',
              'Add the logo to the tool at the top of this page and keep the default flood-fill method, which clears the white around the logo. Switch to colour mode if white remains inside letters, then download a transparent PNG or WebP.',
            ],
            [
              'Why is there still white inside the letters of my logo?',
              'The white inside letters such as O, A and e is enclosed, so it is not connected to the outer background. Click each hole to erase it, or switch to Remove a picked colour everywhere, which removes that white wherever it appears.',
            ],
            [
              'How do I get rid of the white halo around my logo?',
              'Raise the Tolerance slider a few steps so the pale edge pixels are removed too, and keep Edge feathering low for crisp artwork. Check the result on a dark colour before using it.',
            ],
            [
              'Can it remove the background from photos of people or pets?',
              'Not well. It separates areas by colour rather than recognising subjects, so hair and cluttered scenes need many manual clicks. It is designed for logos, signatures, icons, screenshots and product shots on plain or gradient backgrounds.',
            ],
            [
              'Can I replace the background with a different colour or picture?',
              'No. It makes the background transparent and nothing more. Place the transparent PNG over any colour in your design software, or use the image watermark tool to lay it over another picture.',
            ],
            [
              'What file formats can I download?',
              'PNG or WebP, both with a transparent background. JPG cannot hold transparency, so converting the result to JPG fills the empty areas again. For a website icon, take the PNG to the favicon generator.',
            ],
            [
              'Is there a size limit?',
              'Images larger than 2200 px on their longest side are scaled down to 2200 px, and the download is that size. The image enlarger can scale it up afterwards.',
            ],
            [
              'How do I remove a background on a Chromebook?',
              'Open this page in Chrome on your Chromebook, add the image and download the transparent PNG or WebP. There is no app to buy and no account to create, and the controls work exactly as they do on a Mac or Windows PC.',
            ],
            [
              'Is it safe to use with an unreleased logo or my signature?',
              'Yes. Your files are never stored on our servers, nothing is retained after your session, and nothing is ever used for training.',
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
          Transparent and ready for the next step? Trim the empty margins with
          the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          , make the file lighter with the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>
          , or tidy a vector version of your logo with the{' '}
          <Link to="/tools/svg-optimizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SVG optimizer
          </Link>
          . And if you would rather design logos than only clean them up, our
          free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers layers, masks and transparency from the ground up.
        </p>
      </div>
    </article>
  );
}
