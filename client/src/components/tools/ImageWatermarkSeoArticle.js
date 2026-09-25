import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  Contrast,
  Grid3x3,
  HelpCircle,
  ImagePlus,
  Layers,
  ShieldCheck,
  Sparkles,
  Stamp,
} from 'lucide-react';

const linkCls = 'text-orange-600 font-semibold underline hover:text-orange-700';

/**
 * Long-form guide rendered under the Image Watermark tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Size and margin are percentages of each image's width, so one setting
 *    looks the same across a mixed batch. That answers "watermark too big on
 *    small images" directly, and few pages explain it.
 *
 * 2. Tiled plus rotation is the only placement that resists cropping, so the
 *    page says plainly when to choose it over a corner mark, with values.
 *
 * 3. Limits are stated: one layer, six shared positions, metadata not
 *    carried over, no watermark removal, no PDFs or video. Each routes to the
 *    sibling tool that does the adjacent job, where one exists.
 */
export default function ImageWatermarkSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Batch Watermark Photos Online Free</span>: Text or Logo, Corner or Tiled, One ZIP Back
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You have just finished a shoot, a product listing or a property
        walkthrough, and every picture needs the same mark before it goes
        anywhere public. Doing them one at a time is an afternoon gone. This
        guide shows how to <strong>batch watermark photos</strong> in a single
        pass with the free <strong>watermark maker</strong> above: text or a
        logo, a corner mark or an all-over pattern, and every finished file
        handed back together. It also explains which settings actually help
        when you <strong>watermark photos</strong> to deter copying, how to fix
        a mark that vanishes or gets cropped away, and &mdash; plainly &mdash;
        what the tool will not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/image-watermark.webp"
            alt="Batch watermark photos online free - a diagonal tiled watermark and a PNG logo watermark added to a set of JPG photos, ready to download as a ZIP"
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
              One setting, every photo. The mark scales with each image, so a
              full-size original and a small crop come out looking the same.
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
            ['#what-it-does', '1. What a Watermark Maker Does, and When to Batch'],
            ['#how-to-watermark', '2. How to Watermark Photos in Four Steps'],
            ['#logo-watermark', '3. Add a Logo to Photo Online, or Plain Text'],
            ['#tiled-watermark', '4. Corner, Centre or Tiled: Choosing a Placement'],
            ['#fix-problems', '5. Three Watermark Problems and How to Fix Them'],
            ['#use-cases', '6. Settings for Instagram, Etsy, Listings and Proofs'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Batch Watermark Tool'],
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
          <Stamp className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Watermark Maker Does, and When to Batch Watermark Photos
        </h3>
        <p>
          A watermark is a visible mark stamped onto a picture: your name, a
          &copy; notice, a studio logo or a web address. It tells anyone who
          sees the image where it came from and makes it less useful to someone
          who wants to pass it off as their own. It is not a lock, but a
          well-placed mark raises the effort of reuse.
        </p>
        <p>
          The reason to <strong>bulk watermark images</strong> rather than edit
          them one by one is consistency as much as speed. When you{' '}
          <strong>add a watermark to an image</strong> by hand, the size and
          position drift from picture to picture. Here you choose one set of
          settings, check it on a live preview, and the same mark lands in the
          same relative place on every file.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-watermark" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. Add Watermark to Image Online Free: How to Watermark Photos in Four Steps
        </h3>
        <ol className="space-y-3">
          <li>
            <strong>Add your images.</strong> Drop them onto the first panel,
            browse and select several at once, or paste a picture from the
            clipboard.
          </li>
          <li>
            <strong>Design the mark.</strong> Choose <em>Text</em> or{' '}
            <em>Logo image</em>. For text, pick a font (Sans, Serif, Impact or
            Mono, always bold) and a colour; for a logo, drop the file onto the
            logo panel. Then set size, opacity, position, rotation and margin,
            watching the preview update.
          </li>
          <li>
            <strong>Pick an output format.</strong> <em>Same as input</em> keeps
            PNG and WebP as they are and saves everything else as JPG, or force
            JPG, PNG or WebP. The quality slider, from 50% to 100%, applies to
            JPG and WebP output; PNG is always saved at full quality.
          </li>
          <li>
            <strong>Watermark all and download.</strong> Every photo keeps its full
            resolution, and with more than one image you get a single{' '}
            <strong>watermarked.zip</strong> beside the individual files, so you
            can <strong>watermark images and download as ZIP</strong>{' '}
            in one click. Your originals are left untouched.
          </li>
        </ol>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>What the batch does not do.</strong> It applies one mark,
            text or logo, not both at once; one position shared by every photo,
            with no dragging; four built-in fonts, with no way to add your own;
            and it does not resize or compress (run the{' '}
            <Link to="/tools/image-resizer" className="underline font-semibold">
              image resizer
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-compressor" className="underline font-semibold">
              image compressor
            </Link>{' '}
            on the results afterwards). Camera and
            copyright metadata is not carried over to the watermarked copies,
            and an animated GIF comes out as a single still frame. PDFs and
            videos are not supported: for documents, use the{' '}
            <Link to="/tools/pdf-watermark" className="underline font-semibold">
              PDF watermark tool
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 3 */}
      <section id="logo-watermark" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImagePlus className="w-6 h-6 text-orange-500 shrink-0" />
          3. Add Logo to Photo Online, or Add Text to Photo Online
        </h3>
        <p>
          If you want to add a logo to a photo online, the best
          source file is a PNG with a transparent background. That is the
          answer to <strong>how to add a logo watermark to multiple photos</strong>{' '}
          without a white box around it, and the reason to{' '}
          <strong>add PNG logo watermark to JPG</strong> photos rather than a
          flat JPG logo. If your logo only has a solid background, run it through the{' '}
          <Link to="/tools/background-remover" className={linkCls}>
            background remover
          </Link>{' '}
          first and use the transparent result.
        </p>
        <p>
          A logo is drawn at three times the width of the <em>Size</em> slider,
          with its height kept in proportion, so the default of 5% gives a logo
          about 15% as wide as each photo. Text mode is the simpler route when
          you just need to <strong>add text to photo online</strong>: a name, a
          handle or a website. It starts filled in with a &copy; symbol, the
          quickest answer if you searched{' '}
          <strong>how to add copyright symbol to photo</strong> files. Replace the
          placeholder with your name and the year. For what a notice formally
          means, the{' '}
          <a
            href="https://www.copyright.gov/circs/circ03.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            U.S. Copyright Office circular on copyright notice
          </a>{' '}
          is the clearest reference.
        </p>
      </section>

      {/* 4 */}
      <section id="tiled-watermark" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid3x3 className="w-6 h-6 text-orange-500 shrink-0" />
          4. Corner, Centre or Tiled: How to Tile a Watermark Across an Image
        </h3>
        <p>
          There are six placements: the four corners, centre and{' '}
          <em>Tiled</em>. Which one you want depends on whether the mark is
          there to credit you or to stop reuse.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>A corner mark</strong> barely interrupts the picture and
            suits portfolios where you want credit, not a barrier.
          </li>
          <li>
            <strong>A centre mark</strong> sits over the subject itself, so
            removing it means repainting the most important part of the image.
          </li>
          <li>
            <strong>Tiled</strong> repeats the mark across the whole image in a
            staggered grid: the stock-photo look, and how to{' '}
            <strong>tile a watermark across an image</strong> so that any
            sizeable crop still carries a copy of it.
          </li>
        </ul>
        <p>
          Rotation runs from &minus;90&deg; to 90&deg; and applies to tiled marks
          too, so choosing Tiled and setting around &minus;30&deg; puts a{' '}
          <strong>diagonal watermark on image</strong> after image in the batch. That makes
          this a <strong>tiled watermark generator</strong> as well as a corner
          stamp. Lower the opacity when tiling, or the copies bury the photo.
        </p>
      </section>

      {/* 5 */}
      <section id="fix-problems" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Contrast className="w-6 h-6 text-orange-500 shrink-0" />
          5. Three Watermark Problems and How to Fix Them
        </h3>
        <p>
          <strong>&ldquo;My watermark is easily cropped out.&rdquo;</strong> A
          <strong>watermark easily cropped out</strong> is nearly always a
          corner mark. Move it to Centre, or switch to Tiled with a rotation, so
          any crop still contains it.
        </p>
        <p>
          <strong>&ldquo;It disappears on some photos.&rdquo;</strong> A{' '}
          <strong>watermark not visible on dark and light photos</strong> is
          almost always white text on a bright sky or black text on a night
          scene. Keep the text white and leave <em>Dark outline for
          readability</em> switched on (it is on by default). The dark edge keeps
          white lettering readable on bright backgrounds and the fill readable
          on dark ones, across a whole mixed batch.
        </p>
        <p>
          <strong>&ldquo;It is huge on small images and tiny on big ones.&rdquo;</strong>{' '}
          A <strong>watermark too big on small images</strong> happens when a
          tool sizes the mark in fixed pixels. Here, size and margin are
          percentages of each image&rsquo;s width, so a 5% mark covers the same
          share of a large original as of a small crop.
        </p>
        <p>
          And if you are wondering <strong>how to make a transparent watermark</strong>{' '}
          that does not hide the photo, that is the <em>Opacity</em> slider,
          from 5% to 100% in steps of 5, with 60% as the starting point.
        </p>
      </section>

      {/* 6 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-orange-500 shrink-0" />
          6. Settings for Instagram, Etsy, Real Estate Listings and Client Proofs
        </h3>
        <p>
          Starting points; check the preview and adjust.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Watermark photos for Instagram</strong>: your handle in Sans,
            bottom right, size 3&ndash;5%, opacity 40&ndash;60%, outline on. 
          </li>
          <li>
            <strong>Watermark product photos for Etsy</strong> or any shop.
            A transparent PNG logo, bottom right or centre, at 30&ndash;50%
            opacity, so copied listings carry your brand.
          </li>
          <li>
            <strong>Real estate photo watermark</strong>: the agency logo in a
            lower corner with a 3% margin, applied to the whole listing set at
            once.
          </li>
          <li>
            <strong>Photography proof watermark</strong>: tiled, rotated around
            &minus;30&deg;, opacity 20&ndash;30%, with &ldquo;PROOF&rdquo; or
            your studio name. Clients can judge the shot, while the marked copy
            is much less useful to anyone who has not paid for the clean file.
          </li>
          <li>
            <strong>Watermark multiple photos on iPhone</strong>: open this page
            in Safari, tap the drop area and select several pictures. HEIC
            photos open reliably in Safari; elsewhere, convert them with the{' '}
            <Link to="/tools/heic-to-jpg" className={linkCls}>
              HEIC to JPG converter
            </Link>{' '}
            first.
          </li>
        </ul>
        <p>
          Wondering <strong>how to stop people stealing my photos</strong>{' '}
          entirely? No visible mark guarantees that, and nothing here adds an
          invisible or digital watermark. What works is a tiled mark on anything
          you would not want reused, sharing smaller versions publicly (the{' '}
          <Link to="/tools/image-resizer" className={linkCls}>
            image resizer
          </Link>{' '}
          handles that after watermarking), and keeping the unmarked originals
          to yourself.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Batch Watermark Tool
        </h3>
        <p>
          If you have ever found that a <strong>free watermark app adds its own
          branding</strong> to your pictures, or saves the batch feature for a
          paid plan, this is the difference. If you went looking for a{' '}
          <strong>free watermark tool no sign up</strong> required, this is it,
          and every line below is something you can check yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no account, no added branding', 'No sign-up and no paid tier for batches or logos. The only mark on your photos is yours.'],
            ['Whole batches, one ZIP', 'Every result at full resolution, downloaded together as watermarked.zip or one at a time.'],
            ['Scales across mixed sizes', 'Size and margin follow each image’s width, so one setting looks the same on a large original and a small crop.'],
            ['Tiled and diagonal patterns', 'Six placements plus rotation from −90° to 90° give you a subtle corner credit or a crop-proof all-over pattern.'],
            ['Your photos stay private', 'Files are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your images are never used to train any model.'],
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
          It sits alongside the rest of our{' '}
          <Link to="/tools" className={linkCls}>
            free image and document tools
          </Link>
          . Nothing here removes an existing watermark; the{' '}
          <Link to="/tools/image-blur" className={linkCls}>
            image blur tool
          </Link>{' '}
          can only obscure a region.
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
              'How do I batch watermark photos online free?',
              'Add all your photos to the tool at the top of this page, design one text or logo mark and check it on the preview of the first image. Press Watermark all and download the single ZIP, or each file separately. There is no account, no cap on a paid plan and no added branding.',
            ],
            [
              'How do I add a logo watermark to multiple photos?',
              'Set Type to Logo image, drop a PNG logo with a transparent background onto the logo panel, then add your photos and choose a position. The same logo is placed on every image at the same relative size. If your logo has a solid background, remove it with the background remover first.',
            ],
            [
              'How do I add a copyright symbol to a photo?',
              'Use Text mode, which starts with a © symbol in the field. Replace the placeholder with your name and the year, then apply it to one photo or the whole batch.',
            ],
            [
              'Can I add a text watermark and a logo at the same time?',
              'Not in one pass; each run applies one mark. Watermark the batch with your logo, then run the results again with a text mark.',
            ],
            [
              'Will the watermark look the same on photos of different sizes?',
              'Yes. Size and margin are percentages of each image’s width, so the mark covers the same share of every photo.',
            ],
            [
              'Is my camera and copyright metadata kept?',
              'No. The watermarked copies do not carry EXIF details such as camera model, date or location, and no invisible watermark is added. Keep your originals if you need that information. A side benefit is that location data is not published along with the marked copies.',
            ],
            [
              'Can this remove a watermark from a photo, or watermark a PDF or video?',
              'No. It adds marks to still images only and cannot remove an existing watermark; the image blur tool can obscure a region, but that is not removal. For documents, use the PDF watermark tool. Videos are not supported, and an animated GIF comes out as a single still frame.',
            ],
            [
              'Are my photos private?',
              'Your photos are never stored on our servers, nothing is retained after your session, and nothing is used for training.',
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
          Ready to publish? Shrink the files with the{' '}
          <Link to="/tools/image-compressor" className={linkCls}>
            image compressor
          </Link>
          , trim them to shape with the{' '}
          <Link to="/tools/image-cropper" className={linkCls}>
            image cropper
          </Link>
          , switch formats with the{' '}
          <Link to="/tools/image-converter" className={linkCls}>
            image converter
          </Link>
          , or strip location data from other pictures with the{' '}
          <Link to="/tools/exif-remover" className={linkCls}>
            EXIF remover
          </Link>
          . The{' '}
          <Link to="/tools/image-to-pdf" className={linkCls}>
            image to PDF converter
          </Link>{' '}
          bundles proofs into one file, and our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className={linkCls}>
            graphic design course
          </Link>{' '}
          teaches you to design marks like these.
        </p>
      </div>
    </article>
  );
}
