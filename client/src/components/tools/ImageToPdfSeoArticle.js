import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileImage,
  HelpCircle,
  Images,
  Layers,
  Ruler,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image to PDF tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Quality is explained, not promised. In the default encoding JPEGs go into
 *    the PDF untouched, which answers "why is my PDF blurry" directly. The
 *    4000 px cap on other formats is stated so nobody is surprised.
 *
 * 2. Size limits are answered honestly. The only size lever here is JPEG
 *    recompression; hitting a portal limit is routed to the compressors.
 *
 * 3. The output is image-only. OCR, HEIC in other browsers, reordering after
 *    creation and several images per page are named and routed to siblings.
 */
export default function ImageToPdfSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">JPG to PDF</span>: Turn Photos, PNG Screenshots and WebP Images Into One Sharp, Well-Laid-Out PDF
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Six phone photos of a signed form. A folder of receipts due with an
        expense claim. Passport scans an embassy wants as a single A4 file.
        Every one of these is a <strong>jpg to pdf</strong> job, and every one
        goes wrong in the same few ways: pages come out blurry, the file is too
        big to send, or the pictures land sideways. This guide shows how to
        turn any <strong>image to pdf</strong> for free, whether you start with
        a <strong>photo to pdf</strong>, a <strong>png to pdf</strong> or a
        stack of mixed formats, and explains the settings that decide how
        sharp, how large and how tidy the result is.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/image-to-pdf.webp"
            alt="JPG to PDF converter online free - combining JPG, PNG and WebP photos of receipts and documents into one multi-page A4 PDF"
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
              One image per page, in the order you set, on the paper size you
              choose. Your JPGs go in exactly as they were taken.
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
            ['#what-it-does', '1. Image to PDF: What It Does and When to Use It'],
            ['#how-to-convert', '2. How to Convert JPG to PDF in Four Steps'],
            ['#page-layout', '3. JPG to PDF on A4 or Letter: Size, Margins and Fit'],
            ['#quality', '4. PNG to PDF Without Losing Quality'],
            ['#troubleshooting', '5. Blurry, Too Large or Sideways? Fixes'],
            ['#phones-and-jobs', '6. Photo to PDF on iPhone, Android and Real Jobs'],
            ['#why-cortexis', '7. Why Choose Cortexis for Image to PDF'],
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
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          1. Image to PDF: What It Does and When to Use It
        </h3>
        <p>
          A PDF keeps pages in a fixed order, prints at a known paper size and
          opens the same way for everyone. A folder of pictures does none of
          that, which is why online forms insist on a PDF even when what you
          have is a phone photo of a page.
        </p>
        <p>
          The tool at the top of this page takes one picture or many and builds
          a single PDF with one image per page. It accepts JPG, PNG, WebP, GIF,
          BMP and SVG, so the same page covers <strong>webp to pdf</strong> for
          images saved from the web and <strong>bmp to pdf</strong> for older
          scanner exports.
        </p>
        <p>
          What comes out is a PDF of pictures: text in a photographed page
          cannot be searched or copied yet. For that, run the finished file
          through{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR
          </Link>
          , or pull the words out of a single picture with{' '}
          <Link to="/tools/image-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image OCR
          </Link>
          . A PDF back into pictures is the job of the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>
          .
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert JPG to PDF in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert jpg to pdf</strong> with the tool
          above, and equally <strong>how to combine multiple pictures into one
          pdf</strong>, because the steps are the same for one image or thirty.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your images.</strong> Drop them in, pick them from your
            files, or paste one from the clipboard. Each joins a numbered list.
          </li>
          <li>
            <strong>Set the order.</strong> The list order is the page order.
            Use the up arrow on a row to move it one place earlier and the
            cross to remove it. That is all you need to{' '}
            <strong>merge jpg to pdf</strong> in the sequence your document
            needs.
          </li>
          <li>
            <strong>Choose the layout.</strong> The defaults (A4, automatic
            orientation, a small margin, fit inside margins) suit most
            documents; section 3 explains each.
          </li>
          <li>
            <strong>Create and download.</strong> Press <em>Create PDF</em>.
            On a desktop screen you get a preview; on a phone, open the file
            from the download. A single image keeps its own name with .pdf on
            the end; several are saved as <strong>images.pdf</strong>.
          </li>
        </ol>
        <p>
          That is how you <strong>combine images into one pdf</strong> instead
          of sending a dozen attachments. To add the pages to an existing PDF,
          join the two afterwards with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          .
        </p>
      </section>

      {/* 3 */}
      <section id="page-layout" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          3. JPG to PDF on A4 or Letter: Size, Margins and Fit
        </h3>
        <p>
          Four settings decide how every page looks.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Page size.</strong> A4 is the default, so{' '}
            <strong>jpg to pdf a4 size</strong> needs no change at all. US
            Letter, Legal, A5 and A3 are also offered, plus{' '}
            <em>Fit each page to the image</em>, where every page takes the
            shape of its picture.
          </li>
          <li>
            <strong>Orientation.</strong> <em>Auto</em> gives wide images a
            landscape page and tall or square ones a portrait page. Portrait or
            Landscape forces one for every page. With <em>Fit each page to the
            image</em>, orientation has no effect, because each page already
            takes the picture&rsquo;s own shape.
          </li>
          <li>
            <strong>Margin.</strong> Set in points, from 0 to 100, with 24 as
            the default. For <strong>image to pdf letter size with
            margins</strong>, choose US Letter and raise the margin until the
            white border looks right for printing.
          </li>
        </ul>
        <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
          {[
            ['Fit inside margins', 'The whole image shows, scaled and centred. Best for documents, receipts and ID pages.'],
            ['Fill page (crop)', 'The image covers the area inside the margins; overhang is trimmed. Best for photo pages.'],
            ['Actual size (96 dpi)', 'Placed at 96 pixels per inch. Good for screenshots; large photos can run off the page.'],
          ].map(([title, body]) => (
            <div key={title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Settings apply to every page, and each page holds one image, so a
          grid of photos on one sheet is not possible here. To number the
          pages, use{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page numbers
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="quality" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Images className="w-6 h-6 text-orange-500 shrink-0" />
          4. PNG to PDF Without Losing Quality
        </h3>
        <p>
          The <em>Image encoding</em> setting is the one that decides sharpness,
          and its default is the careful one: <em>Keep JPEG as-is, PNG
          lossless</em>. A JPG goes into the PDF exactly as it was saved, at
          full resolution, never compressed a second time. A common cause of{' '}
          <strong>jpg to pdf blurry</strong> results is a converter re-saving
          the photo at lower quality, and that simply does not happen in this
          mode.
        </p>
        <p>
          PNG, WebP, GIF, BMP and SVG images are stored losslessly, which
          answers <strong>how to convert png to pdf without losing
          quality</strong>. Transparency is kept too, so a <strong>transparent
          png to pdf</strong> shows your logo cleanly, not in a black or white
          box. PNG&rsquo;s alpha channel, described in the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            PNG specification
          </a>
          , is what makes that possible, and the result opens in any standard
          PDF reader; the PDF format itself is defined by{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          .
        </p>
        <p>
          One note on SVG: a vector drawing is placed on the page as a picture,
          so it looks sharp at normal viewing sizes but will not stay perfectly
          crisp if someone zooms in very far. For the rest of the formats, the
          quality you see in the original is the quality you get on the page.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Two honest limits.</strong> Non-JPEG images larger than
            4000 pixels on their longest side are scaled down to 4000; only
            untouched JPEGs keep every original pixel (with <em>Recompress all
            as JPEG</em>, JPEGs get the same 4000-pixel cap). And an animated GIF
            contributes just its first frame. To keep the motion, the{' '}
            <Link to="/tools/gif-maker" className="underline font-semibold">
              GIF maker
            </Link>{' '}
            and{' '}
            <Link to="/tools/mp4-gif" className="underline font-semibold">
              MP4 to GIF
            </Link>{' '}
            tools are the right place.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Blurry, Too Large or Sideways? Fixes
        </h3>
        <p>
          Each symptom maps to one setting or one extra step.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Blurry pages.</strong> Keep the encoding on <em>Keep JPEG
            as-is</em>. A small photo stretched onto A3 will soften; choose a
            smaller page or <em>Actual size</em>.
          </li>
          <li>
            <strong>Image to pdf file too large.</strong> Switch to <em>Recompress all as
            JPEG (smaller)</em> and lower the <em>JPEG quality</em> slider,
            which runs from 40% to 100% and starts at 85%. Recompressing drops
            transparency, so leave logos on the default.
          </li>
          <li>
            <strong>Jpg to pdf under 100kb.</strong> There is no target-size
            option here, so for a hard portal cap run the
            result through the{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>
            , or shrink the photos first with the{' '}
            <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JPEG compressor
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>
            .
          </li>
          <li>
            <strong>Image to pdf sideways.</strong> <em>Auto</em> orientation
            turns the page to suit the picture, but it does not rotate the
            picture itself. Whether a phone photo&rsquo;s saved rotation is
            honoured can differ between Safari, Chrome and Firefox, so
            straighten stubborn ones first with{' '}
            <Link to="/tools/rotate-flip-image" className="text-orange-600 font-semibold underline hover:text-orange-700">
              rotate and flip
            </Link>
            , or fix whole pages afterwards with{' '}
            <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF rotate
            </Link>
            .
          </li>
          <li>
            <strong>Heic to pdf.</strong> iPhones save photos as HEIC, and
            whether they open depends on the app you use: Safari generally
            can, Chrome and Firefox often cannot. Convert with{' '}
            <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              HEIC to JPG
            </Link>{' '}
            first; AVIF files go through{' '}
            <Link to="/tools/avif-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              AVIF to JPG
            </Link>
            .
          </li>
          <li>
            <strong>Pages in the wrong order.</strong> Before creating, use the
            up arrows. After creating, rearrange pages in the{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>
            .
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="phones-and-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          6. Photo to PDF on iPhone, Android and Real Jobs
        </h3>
        <p>
          <strong>How to convert a picture to pdf on iphone</strong> without
          the share-sheet print trick: open this page in Safari, tap the drop
          area, choose photos and press Create PDF. The same answers{' '}
          <strong>how to make a pdf from photos on android</strong>. Phones
          show a download instead of a preview.
        </p>
        <p>The situations that bring most people here:</p>
        <ul className="space-y-2">
          <li>
            <strong>Scan receipts to PDF.</strong> Add receipt photos in date
            order on A4 and attach one file to the expense claim.
          </li>
          <li>
            <strong>Convert photos to PDF for visa application.</strong>{' '}
            Many embassy portals ask for A4 with nothing cut off, which is
            exactly what the default settings give you. Check the portal&rsquo;s
            own instructions for any size cap.
          </li>
          <li>
            <strong>Homework photos to PDF.</strong> Order the handwritten
            pages and submit one file.
          </li>
          <li>
            <strong>Screenshots to PDF.</strong> PNG chat logs and slides stay
            crisp; <em>Fit each page to the image</em> avoids white space.
          </li>
        </ul>
        <p>
          Wondering <strong>is it safe to convert id to pdf online</strong>?
          Here, your files are never stored on our servers, nothing is retained
          after you finish, and nothing is used for training. For ID pages,
          add a password with{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect
          </Link>{' '}
          and strip location data from the photos with the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>
          , since a JPG kept as-is can carry its own details into the PDF.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Choose Cortexis for Image to PDF
        </h3>
        <p>
          Plenty of sites offer a <strong>jpg to pdf converter online
          free</strong>. Here is what sets this <strong>image to pdf
          converter</strong> apart.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no watermark on your pages and no daily counter.'],
            ['Your photos stay private', 'Files are never stored on our servers and nothing is retained after you finish. ID cards, passports and receipts stay yours.'],
            ['Nothing is used for training', 'Your images are never used to train anything.'],
            ['JPGs go in untouched', 'By default your JPEGs keep full resolution with no second compression.'],
            ['Real layout control', 'A4, US Letter, Legal, A5, A3 or page-fits-image, automatic orientation per picture, margins in points, and fit, fill or actual size.'],
            ['Transparency and many formats', 'JPG, PNG, WebP, GIF, BMP and SVG in one file, with transparency kept.'],
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
          It is one of our{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>
          . For Word and Excel files, use{' '}
          <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            DOCX to PDF
          </Link>{' '}
          or{' '}
          <Link to="/tools/xlsx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            XLSX to PDF
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
              'How do I convert JPG to PDF for free?',
              'Add your JPG files to the tool at the top of this page, put them in order, choose a page size and press Create PDF. There is no account, watermark or daily limit.',
            ],
            [
              'Can I combine several images into one PDF?',
              'Yes. Add as many pictures as you need and each becomes its own page, in the order shown in the list. Use the up arrow on a row to move it earlier and the cross to remove it.',
            ],
            [
              'Will my JPG to PDF come out blurry?',
              'Not with the default encoding, which keeps each JPEG exactly as saved, at full resolution. Blur often comes from low-quality recompression or stretching a small photo onto a large page.',
            ],
            [
              'How do I make the PDF smaller, for example under 100 KB?',
              'Switch Image encoding to Recompress all as JPEG and lower the JPEG quality slider. There is no target-size setting, so for a strict portal limit run the result through the PDF compressor or shrink the photos first with the JPEG compressor.',
            ],
            [
              'Does it work with iPhone HEIC photos?',
              'It depends on the app you open this page in: Safari generally opens HEIC, while Chrome and Firefox often cannot. The reliable route is to convert with HEIC to JPG first.',
            ],
            [
              'Is the PDF searchable?',
              'No. The pages are pictures, so the text in a photographed document cannot be selected or searched yet. Run the finished PDF through PDF OCR to add a text layer.',
            ],
            [
              'Is it safe to convert passport or ID photos here?',
              'Your files are never stored on our servers, nothing is retained after you finish, and nothing is used for training. For extra care, add a password with PDF protect before sending the file, and remove location data from the photos with the EXIF remover.',
            ],
            [
              'Does a transparent PNG keep its transparency?',
              'Yes, with the default encoding, PNG and WebP transparency is carried into the PDF, so a logo sits cleanly on the page. Choosing Recompress all as JPEG removes transparency, because JPEG cannot store it.',
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
          PDF made and ready for the next step? Crop the photos before you
          start with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          , tidy page edges afterwards with{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop
          </Link>
          , or pull the pictures back out with{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF
          </Link>
          . To design graphics rather than only convert them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers image formats, resolution and print layout.
        </p>
      </div>
    </article>
  );
}
