import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileImage,
  HelpCircle,
  Layers,
  MapPin,
  MonitorX,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the HEIC to JPG tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. HEIC only opens where the system supports HEIF. Safari on Mac, iPhone
 *    and iPad does; Chrome and Firefox on Windows and Linux currently do not.
 *    The page says so up front and turns it into the most useful section:
 *    why a HEIC file will not open, and the iPhone setting that stops the
 *    problem at the source.
 *
 * 2. Side effects are stated plainly: location, date and camera details are
 *    removed, only the main still of a Live Photo or burst is converted, and
 *    HDR brightness is not kept. Resolution never changes.
 *
 * 3. Follow-on jobs (PDF, smaller files, cropping, other formats) are routed
 *    to the sibling tools that actually do them.
 */
export default function HeicToJpgSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">HEIC to JPG</span>: Why iPhone Photos Won&rsquo;t Open, the Setting That Fixes It, and What Changes
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A job portal that rejects the photo of your ID. A relative on a Windows
        laptop who sees a blank icon where your holiday pictures should be.
        Both come
        back to one file extension. This guide explains how to{' '}
        <strong>convert HEIC to JPG</strong> for free, one photo or a whole
        folder at once, why a <strong>HEIC file is not opening</strong> for the
        people you send it to, how to stop your iPhone creating HEIC in the
        first place, and &mdash; honestly &mdash; where the{' '}
        <strong>HEIC converter</strong> on this page works and where it does not.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/heic-to-jpg.webp"
            alt="A woman photographing white hydrangea blooms in a garden with her phone"
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
              Same photo, same pixel size, a format every phone, PC and website
              accepts. Several at once come back as a single ZIP.
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
            ['#what-is-heic', '1. What Is a HEIC File, and Why Are My iPhone Photos HEIC?'],
            ['#how-to-convert', '2. How to Convert HEIC to JPG in Three Steps'],
            ['#not-opening', '3. HEIC File Not Opening? Where It Works and Where It Does Not'],
            ['#iphone-setting', '4. How to Change iPhone Photos From HEIC to JPG'],
            ['#quality', '5. HEIC vs JPG Quality: JPG, PNG or WebP?'],
            ['#what-changes', '6. What Is Kept, and What Is Removed'],
            ['#why-cortexis', '7. Why Use Cortexis for HEIC to JPG'],
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
      <section id="what-is-heic" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Is a HEIC File, and Why Are My iPhone Photos HEIC?
        </h3>
        <p>
          If you are asking <strong>what is a HEIC file</strong>, the short
          answer is: a photo stored in HEIF, the High Efficiency Image File
          Format, with the <strong>.heic</strong> extension Apple uses. The
          reason <strong>why your iPhone photos are HEIC</strong> is space:
          Apple made it the default camera format because it stores a photo of
          similar quality in a smaller file than JPG. Apple explains the format
          and its settings in{' '}
          <a
            href="https://support.apple.com/en-us/116944"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Apple&rsquo;s guide to HEIF and HEVC media
          </a>
          .
        </p>
        <p>
          The same container is also written with a <strong>.heif</strong>{' '}
          extension by some Android phones and cameras, so{' '}
          <strong>HEIF to JPG</strong> is the same job with a different label;
          the tool accepts both. On Apple products HEIC just works; the trouble
          starts when a photo leaves them &mdash; emailed to a Windows user or
          dropped into a form that expects JPG. That is when you need to{' '}
          <strong>convert HEIC to JPG</strong>.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert HEIC to JPG in Three Steps
        </h3>
        <p>
          Here is how to go from <strong>HEIC to JPG</strong> with the tool at
          the top of this page. It is a <strong>free HEIC to JPG converter</strong>{' '}
          with no sign-up, no watermark and no daily cap.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your photos.</strong> Drop HEIC or HEIF files onto the
            panel marked <em>Drop HEIC / HEIF photos</em>, or click it to pick
            them. Each appears as a chip you can remove.
          </li>
          <li>
            <strong>Choose the output.</strong> JPG is selected already. You
            can switch to PNG or WebP, move the quality slider (40 to 100
            percent, 90 by default) and pick a background colour for
            transparent areas. For camera photos the defaults are right.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert</em>. Each
            photo gets its own card showing its pixel size, a preview and a
            download named after the original, so <em>IMG_0412.heic</em>{' '}
            becomes <em>IMG_0412.jpg</em>.
          </li>
        </ol>
        <p>
          To <strong>batch convert HEIC to JPG</strong>, simply add every photo
          before pressing Convert. When two or more succeed, an extra card
          offers them all as one ZIP. Photos that cannot be read are listed
          separately and the rest still convert.
        </p>
      </section>

      {/* 3 */}
      <section id="not-opening" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorX className="w-6 h-6 text-orange-500 shrink-0" />
          3. HEIC File Not Opening? Where It Works and Where It Does Not
        </h3>
        <p>
          A <strong>HEIC file not opening</strong> almost always means the
          program in front of you lacks HEIF support. That is also why{' '}
          <strong>Chrome can&rsquo;t open HEIC</strong> on most computers: drag
          one into a Chrome tab on Windows and you get a download prompt or a
          blank page rather than a picture.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Works here
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>HEIC to JPG in Safari</strong> on a Mac, iPhone or iPad,
              and on other systems with HEIF support. For{' '}
              <strong>HEIC to JPG on Mac</strong> it handles a whole batch in
              one pass and hands the results back as a single ZIP.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> Does not work here yet
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Chrome, Edge and Firefox on Windows or Linux currently cannot
              open HEIC. The tool does not pretend otherwise: a file it cannot
              read is named, with a pointer to Safari or to the iPhone setting
              in the next section.
            </p>
          </div>
        </div>
        <p>
          So <strong>how to open HEIC files on Windows</strong> when the photos
          are already there? Ask the sender to re-share them as JPG (the next
          section shows the one-time setting), or convert them in Safari on a
          Mac, iPhone or iPad and pass the JPGs across.
        </p>
      </section>

      {/* 4 */}
      <section id="iphone-setting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Change iPhone Photos From HEIC to JPG
        </h3>
        <p>
          The best conversion is the one you never need. If you regularly send
          photos to people or sites that choke on HEIC, here is{' '}
          <strong>how to change iPhone photos from HEIC to JPG</strong> for good:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Save new photos as JPG.</strong> Open Settings &rarr;
            Camera &rarr; Formats and choose <em>Most Compatible</em>. From
            then on the camera writes JPG. The trade-off is larger files, so
            storage fills faster.
          </li>
          <li>
            <strong>Convert when copying to a computer.</strong> Settings
            &rarr; Photos &rarr; Transfer to Mac or PC, set to{' '}
            <em>Automatic</em>. Photos copied over a cable then arrive as JPG
            while the originals on the phone stay HEIC.
          </li>
          <li>
            <strong>Already-taken photos.</strong> Settings only affect what
            happens next. For pictures already in your library, the answer to{' '}
            <strong>how to convert HEIC to JPG on iPhone</strong> is to open
            this page in Safari on the phone, choose the photos and download
            the JPGs or the ZIP.
          </li>
        </ul>
        <p>
          Sharing sometimes converts for you, which is why one picture can
          arrive as HEIC by one route and JPG by another. When you{' '}
          <strong>convert iPhone photos to JPG for email</strong> yourself, you
          know exactly what the recipient gets.
        </p>
      </section>

      {/* 5 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          5. HEIC vs JPG Quality: JPG, PNG or WebP?
        </h3>
        <p>
          The worry behind most <strong>HEIC vs JPG quality</strong> searches is
          that converting will make photos worse. Resolution is never touched:
          whatever pixel size the HEIC has, the JPG has the same, and each
          result card shows that size so you can check. What the slider
          controls is JPG compression; at the default 90 percent most photos
          are hard to tell apart from the original.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>JPG</strong> &mdash; right for sharing, forms and social
            posts. For <strong>HEIC to JPG without
            losing quality</strong> you can see, push the slider to 95 or 100
            percent.
          </li>
          <li>
            <strong>PNG</strong> &mdash; <strong>HEIC to PNG</strong> gives a
            lossless copy, but camera photos as PNG are very large; use it only
            when something specifically asks for PNG.
          </li>
          <li>
            <strong>WebP</strong> &mdash; <strong>HEIC to WebP</strong> suits
            web publishers who want smaller images for a site. Some setups
            cannot save WebP; when that happens the tool says so for that
            file, and the route is to convert to JPG here, then turn the JPG
            into WebP with the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>
            .
          </li>
        </ul>
        <p>
          The tool does not shrink photos to a target size or smaller
          dimensions. If a form caps uploads at a file size, convert here, then
          use the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>{' '}
          or the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          . Need AVIF, TIFF, GIF or BMP instead? The{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          covers those, starting from the JPG you make here.
        </p>
      </section>

      {/* 6 */}
      <section id="what-changes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Is Kept, and What Is Removed
        </h3>
        <p>
          The picture itself comes through at full resolution. Four things do
          not, so check before deleting originals:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Photo details are removed.</strong> The date taken, GPS
            location and camera model are not copied into the JPG. Going from{' '}
            <strong>HEIC to JPG to remove location data</strong> before posting
            a photo of your home is a genuine plus; for an archive sorted by
            date, keep the HEIC originals.
          </li>
          <li>
            <strong>Live Photos become stills.</strong> Only the main image is
            converted; the short video clip, extra burst frames and depth data
            are left out.
          </li>
          <li>
            <strong>HDR brightness is flattened.</strong> The extra brightness
            data newer iPhones store for HDR screens is not kept.
          </li>
          <li>
            <strong>It is one-way.</strong> There is no JPG to HEIC option here
            or anywhere in the toolkit.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Photos of documents?</strong> For <strong>HEIC to PDF</strong>,
            convert the pages to JPG here, then put them in order with{' '}
            <Link to="/tools/image-to-pdf" className="font-semibold underline">
              image to PDF
            </Link>
            . Straighten or trim them first with the{' '}
            <Link to="/tools/image-cropper" className="font-semibold underline">
              image cropper
            </Link>{' '}
            or{' '}
            <Link to="/tools/rotate-flip-image" className="font-semibold underline">
              rotate and flip
            </Link>
            , since this tool does neither.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis for HEIC to JPG
        </h3>
        <p>
          There is no shortage of pages offering a{' '}
          <strong>HEIC to JPG converter online free</strong>. Here is what
          is different, stated so you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no sign-up', 'No account, no email, no watermark and no limit on how many photos you convert in a day.'],
            ['Whole batches in one go', 'Add a batch of HEIC or HEIF photos and download them together as one ZIP. A file that fails is listed by name; the rest still convert.'],
            ['Full resolution, your choice of quality', 'Pixel size never changes. JPG, PNG or WebP, with a quality slider from 40 to 100 percent and a sensible 90 percent default.'],
            ['Your photos stay private', 'Your photos are never stored on our servers and nothing is retained once you are done.'],
            ['Never used for training', 'Your photos are never used to train AI models.'],
            ['Honest about limits', 'Where HEIC cannot be opened, you are told plainly, with the iPhone setting that removes the need to convert at all.'],
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
          built on the same terms. Got AVIF photos rather than HEIC? The{' '}
          <Link to="/tools/avif-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            AVIF to JPG converter
          </Link>{' '}
          is the tool for those.
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
              'How do I convert HEIC to JPG for free?',
              'Add your HEIC or HEIF photos to the tool at the top of this page, leave the format on JPG and press Convert. Download each photo, or the ZIP when there are several. There is no account, no watermark and no daily limit.',
            ],
            [
              'Why will my HEIC file not open in Chrome or on Windows?',
              'HEIC needs HEIF support, and Chrome, Edge and Firefox on Windows or Linux currently do not have it, so this tool cannot read HEIC there either. Use Safari on a Mac, iPhone or iPad, or ask the sender to switch their camera to Most Compatible so future photos arrive as JPG.',
            ],
            [
              "I can't upload HEIC photos to website forms. What should I do?",
              'Many forms, job portals and marketplaces only accept JPG or PNG and reject HEIC outright. Convert the photo to JPG here and upload that instead. If the site also caps file size, run the JPG through the JPEG compressor afterwards.',
            ],
            [
              'How do I convert HEIC to JPG for Instagram or Facebook upload?',
              'Most social apps accept photos straight from your iPhone, but some older apps and desktop upload pages mishandle HEIC. Convert to JPG at the default 90 percent quality and post the JPG.',
            ],
            [
              'Does converting HEIC to JPG lose quality?',
              'Resolution never changes, and at the default 90 percent quality most photos look the same as the original. Raise the slider to 95 or 100 percent if you want the most detail and do not mind larger files. For a lossless copy, choose PNG instead.',
            ],
            [
              'Does the JPG keep the date, location and camera details?',
              'No. The date taken, GPS location and camera model are removed during conversion. That is useful when sharing photos publicly, but keep the HEIC originals if you rely on those details to sort an archive.',
            ],
            [
              'How do I stop my iPhone taking HEIC photos?',
              'Go to Settings > Camera > Formats and choose Most Compatible, and new photos are saved as JPG. To keep HEIC on the phone but get JPG on your computer, set Settings > Photos > Transfer to Mac or PC to Automatic instead.',
            ],
            [
              'Can I convert HEIC to PNG, WebP or another format?',
              'PNG and WebP are in the Format menu next to JPG. If WebP cannot be saved on your setup, the tool tells you; convert to JPG instead and use the image converter for WebP, AVIF, TIFF, GIF or BMP.',
            ],
            [
              'Can I convert JPG back to HEIC?',
              'No. This tool only goes from HEIC and HEIF to JPG, PNG or WebP, and no other tool on the site creates HEIC files. Keep your HEIC originals if you may want them later.',
            ],
            [
              'Can I turn HEIC photos into a PDF?',
              'Not in one step. Convert the photos to JPG here, then combine them with the image to PDF tool, which lets you set the page order.',
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
          Converted and ready for the next step? Shrink a batch for email with
          the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>
          , cut a product shot out of its background with the{' '}
          <Link to="/tools/background-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            background remover
          </Link>
          , or strip location details from photos taken on other cameras with
          the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>
          . And if you would rather learn to edit photos than only convert
          them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          is a good place to start.
        </p>
      </div>
    </article>
  );
}
