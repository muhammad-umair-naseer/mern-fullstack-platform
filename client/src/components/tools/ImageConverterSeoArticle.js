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
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the image converter route.
 *
 * ConverterHub serves several routes; this article is written only against
 * its image branch, which is narrower than the "image converter" phrase
 * suggests. It takes one PNG, JPG, WebP, GIF, BMP or SVG at a time and writes
 * PNG, JPG, WebP or a single-page PDF, with a 40-100% quality slider that
 * only applies to JPG and WebP.
 *
 * The angle is that a conversion is a re-encode rather than a rename: the
 * picture is decoded from its real bytes and written out fresh. That one
 * fact explains the problem-shaped searches this page is meant to catch —
 * why a renamed file still fails an upload form, why a transparent PNG turns
 * black as a JPG (no matte fill exists, so section 5 says so instead of
 * pretending), and why EXIF/GPS metadata does not survive.
 *
 * Declined on purpose: HEIC and TIFF input, GIF output (the target exists in
 * the UI but produces PNG bytes, so it is never promised here), animated GIF
 * preservation, batch conversion, resize/crop during conversion, a target
 * file size, and the "without uploading to server" phrasing — privacy is sold
 * as an outcome only. Each of those questions is answered honestly and routed
 * to the tool that does the job.
 */
export default function ImageConverterSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Image Converter</span> Guide: PNG, JPG, WebP, SVG, BMP and PDF Explained
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A portal wants JPG and you have PNG. A designer sent WebP and your
        software refuses to open it. A form insists on a PDF of a picture.
        Every one of those is a job for an <strong>image converter</strong>,
        and every one is quicker than it sounds. This guide explains what
        actually happens when you <strong>convert image</strong> files from one
        format to another, which formats go in and out of the{' '}
        <strong>free online image converter</strong> above, what the quality
        slider trades, and why transparency and metadata behave the way they do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt --
              the rule bans the word "image" in alt text to prevent
              "image of a cat". Here it is the search term the alt
              attribute exists to carry, so the rule is wrong. */}
          <img
            src="/blog/image-converter.webp"
            alt="Loose curls of developed colour negative film against a pale background"
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
              PNG, JPG, WebP, BMP or SVG in; PNG, JPG, WebP or a pixel-exact
              PDF page out.
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
            ['#what-happens', '1. A Conversion Is a Re-Encode, Not a Rename'],
            ['#how-to-convert', '2. How to Convert an Image Online Free'],
            ['#formats', '3. Formats In, Formats Out'],
            ['#quality-slider', '4. The JPG Quality Slider: What Percentage to Use'],
            ['#transparency-and-metadata', '5. Transparency, Black Backgrounds and EXIF Metadata'],
            ['#image-to-pdf', '6. Convert Image to PDF at the Exact Size of the Image'],
            ['#format-errors', '7. Invalid File Format Errors and the HEIC Problem'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Image Converter'],
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
      <section id="what-happens" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. A Conversion Is a Re-Encode, Not a Rename
        </h3>
        <p>
          The most common mistake with image formats is changing the three
          letters at the end of the filename and expecting the file to change
          with them. It does not. A <strong>PNG</strong> called{' '}
          <code>photo.jpg</code> is still a PNG inside; the extension is a
          label, the format is the bytes underneath, and any checker that reads
          the bytes sees through the label. That is the whole story behind{' '}
          <strong>renamed png to jpg still not working</strong>.
        </p>
        <p>
          A real <strong>photo format converter</strong> decodes the picture
          from its genuine bytes into a grid of pixels, then writes that grid
          out again under the rules of the format you chose: the{' '}
          <a
            href="https://www.iso.org/standard/18902.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 10918 JPEG standard
          </a>{' '}
          for JPG, the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>{' '}
          for PNG. Because the content is read rather than the name, a
          mislabelled PNG comes out as a genuine JPEG that a strict form will
          accept. Three consequences follow:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Only the pixels survive.</strong> Camera metadata, GPS tags
            and colour profiles do not (section 5).
          </li>
          <li>
            <strong>The destination format sets the rules.</strong> JPG has no
            transparency, so transparent areas must become something. PNG is
            lossless, so it gets no quality slider.
          </li>
          <li>
            <strong>Only the first frame of an animation is read.</strong> For
            animated GIFs, use the{' '}
            <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF compressor
            </Link>{' '}
            or{' '}
            <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              GIF maker
            </Link>{' '}
            instead.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert an Image Online Free (Step-by-Step)
        </h3>
        <p>
          The steps are the same whether you want to know{' '}
          <strong>how to convert WebP to JPG</strong>, <strong>convert PNG to JPG</strong>{' '}
          for a form, or <strong>convert JPG to WebP</strong> for a website.
          No account, no email step, no watermark.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in one image', 'Choose a PNG, JPG, WebP, GIF, BMP or SVG in the panel above. It is recognised as an image and the outputs are listed. One file per run.'],
            ['Pick the output format', 'PNG, JPG, WebP or PDF, pre-set to a format different from the one you started with. JPG and WebP reveal a quality slider; PNG and PDF have nothing to set. A GIF button is also listed, but it does not write a true GIF file, so skip it (section 3).'],
            ['Convert and download', 'Press convert. A result card shows the new file, named after the original with the new extension, its size in kilobytes and a download link.'],
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
          If a JPG or WebP came out larger than you hoped, lower the slider and
          convert again; the original stays selected. If the job is size rather
          than format, the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          keeps the format you have.
        </p>
      </section>

      {/* 3 */}
      <section id="formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Images className="w-6 h-6 text-orange-500 shrink-0" />
          3. Formats In, Formats Out: PNG, JPG, WebP, BMP, SVG and PDF
        </h3>
        <p>
          Six inputs are recognised and four outputs are worth choosing;
          anything else is covered in section 7. A fifth button labelled GIF
          appears in the output list, but it does not produce a genuine GIF
          &mdash; the file it writes is not GIF-encoded and only carries the
          .gif name &mdash; so do not use it for anything that must open as a
          GIF. To make or shrink a real GIF, use the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>{' '}
          or{' '}
          <Link to="/tools/gif-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF compressor
          </Link>
          .
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Accepted inputs
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              PNG, JPG/JPEG, WebP, GIF (first frame only), BMP and SVG,
              recognised from the filename extension.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Written outputs
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              PNG (lossless, keeps transparency), JPG (small, no transparency,
              quality slider), WebP (small, keeps transparency, quality slider)
              and PDF (one page, sized to the picture).
            </p>
          </div>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          The conversions people run most
        </h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>WebP to JPG or PNG.</strong> The fix when a{' '}
            <strong>webp image won&rsquo;t open</strong>. Pick PNG for
            transparency or sharp edges, JPG for photographs. The{' '}
            <Link to="/tools/webp-png" className="text-orange-600 font-semibold underline hover:text-orange-700">
              WebP to PNG tool
            </Link>{' '}
            does only that, if you prefer.
          </li>
          <li>
            <strong>Convert SVG to PNG.</strong> A vector logo becomes a
            fixed-pixel picture at the size the SVG declares. There is no scale
            control; if the result is too small, run it through the{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>
            . For vector-to-vector work use the{' '}
            <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              vector converter
            </Link>
            .
          </li>
          <li>
            <strong>Convert BMP to PNG.</strong> An old Paint bitmap becomes a
            much smaller file with nothing lost; both formats store every pixel
            exactly.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section id="quality-slider" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. The JPG Quality Slider: What Percentage to Use
        </h3>
        <p>
          Choose JPG or WebP and a single slider appears, from 40% to 100% in
          steps of five, set to 90% by default. The number is not a percentage
          of file size; it is how much detail the encoder may discard. Lower
          values throw away the subtle variation the eye notices least, which
          is why files shrink while the picture still looks like the picture
          &mdash; up to a point. So, to{' '}
          <strong>jpg quality slider what percentage to use</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>90% (the default)</strong> when unsure: hard to tell from
            the original, noticeably smaller.
          </li>
          <li>
            <strong>75&ndash;85%</strong> for web images and email attachments.
            Photographs look fine; small text starts to show faint blockiness.
          </li>
          <li>
            <strong>95&ndash;100%</strong> when the picture will be edited
            again. Size climbs steeply for little visible gain.
          </li>
        </ul>
        <p>
          The slider does not aim at a target file size. If a portal says
          &ldquo;under 200 KB&rdquo;, step down until the result card fits, or
          hand the JPG to the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>
          ; PNGs go to the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>
          .
        </p>
      </section>

      {/* 5 */}
      <section id="transparency-and-metadata" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          5. Transparency, Black Backgrounds and EXIF Metadata
        </h3>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Why PNG to JPG turns the transparent background black
        </h4>
        <p>
          JPG has no concept of transparency. Every pixel must be a colour, so
          when a transparent PNG is written as a JPG the see-through areas have
          to become something, and the JPEG encoder settles them as black. That
          is the complaint behind{' '}
          <strong>png to jpg transparent background turns black</strong>, and
          the direct answer is that this tool has no option to fill
          transparency with white first; for a white-backed JPG, flatten the
          graphic onto white in an editor, then convert. The cleaner answer is
          usually not to use JPG: if the destination accepts PNG or WebP, choose
          one and the transparency comes through untouched. The same goes for{' '}
          <strong>convert WebP to PNG keep transparency</strong>; WebP alpha is
          carried straight into the PNG with nothing to set.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Metadata does not survive the conversion
        </h4>
        <p>
          A camera or phone photo carries hidden data alongside the pixels: make
          and model, exposure, date, often GPS coordinates. Because the new file
          is written from the pixels alone, none of it is carried across. If
          you wanted to <strong>remove EXIF data when converting image</strong>{' '}
          files, there is no extra step: the output has no EXIF block, no GPS
          tag and no embedded colour profile. Photographers who need that data
          should keep the original. A related side effect: a phone photo stored
          sideways with an orientation flag is written the right way up.
        </p>
      </section>

      {/* 6 */}
      <section id="image-to-pdf" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          6. Convert Image to PDF at the Exact Size of the Image
        </h3>
        <p>
          Choosing PDF creates a single page whose dimensions are exactly the
          pixel dimensions of your picture. A wide screenshot gives a landscape
          page, a tall phone photo a portrait one, decided automatically, and
          the image fills the page edge to edge: no A4 fitting, no margin, no
          white border. That is precisely what{' '}
          <strong>convert image to pdf same size as image</strong> asks for.
          For a printable sheet, run the result through the{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page resizer
          </Link>{' '}
          afterwards and pick A4 or Letter.
        </p>
        <p>
          It is one picture to one page. To <strong>convert image to PDF</strong>{' '}
          in bulk, the image panel on the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG tool
          </Link>{' '}
          takes any number of images at once, or convert each here and combine
          them with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="format-errors" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          7. &ldquo;Invalid File Format&rdquo;, &ldquo;Unsupported Image Format&rdquo; and the HEIC Problem
        </h3>
        <p>
          When an <strong>upload form says invalid file format</strong> for an
          image, or an app throws an <strong>unsupported image format error</strong>,
          it is one of three things.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The format is not on the list.</strong> The form wants JPG
            or PNG and you have WebP, BMP or SVG. Convert to one it accepts and
            the error disappears.
          </li>
          <li>
            <strong>The extension lies.</strong> Someone renamed the file and
            the checker read the real bytes. Converting writes a genuine file
            in the chosen format.
          </li>
          <li>
            <strong>The file is HEIC or HEIF.</strong> The usual cause with
            photos straight off a recent iPhone, and the one this converter
            cannot help with: HEIC is not a recognised input, so the conversion
            fails.
          </li>
        </ul>
        <p>
          For HEIC the fix lives in the phone: sharing a photo usually offers a
          &ldquo;most compatible&rdquo; option, and the camera can be set to
          capture JPG. The same honesty goes for TIFF, AVIF, ICO, PSD and
          camera RAW: none is read here and none is written. Nor is this the
          tool for animations; build one from a clip with{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF
          </Link>
          .
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Image Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Image converter, no signup', 'No account, no email, no trial that ends. Drop in a picture and convert it, every time.'],
            ['Image converter without watermark', 'Nothing is stamped on the output. The JPG, PNG, WebP or PDF you download is only your picture.'],
            ['A private image converter', 'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training or analytics. ID scans are safe here.'],
            ['No file size cap', 'A full-resolution photograph or large scan is accepted as readily as a small icon. No paid tier holds a bigger limit back.'],
            ['A real quality control', 'A 40–100% slider in steps of five, not a Low/Medium/High dropdown, with the resulting size shown before you download.'],
            ['Pixel-exact PDF pages', 'Image to PDF makes a page the exact size of the picture, no margins, orientation chosen for you.'],
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
            free image and document tools
          </Link>{' '}
          on the same terms, and for audio, video and spreadsheets the same
          panel works as a{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            universal file converter
          </Link>
          .
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
              'What is the best free image converter with no signup and no watermark?',
              'The one at the top of this page: no account, no email, no stamp on the output. It reads PNG, JPG, WebP, GIF, BMP and SVG, writes PNG, JPG, WebP or PDF one picture at a time, and your files are never stored on our servers.',
            ],
            [
              'How do I convert WebP to JPG?',
              'Choose the WebP file in the panel above, select JPG, leave the quality slider at 90% unless you need a smaller file, and press convert. If the WebP has transparent areas, choose PNG instead so they are preserved rather than filled with black.',
            ],
            [
              'I renamed a PNG to .jpg and the upload form still rejects it. Why?',
              'Renaming changes the label, not the file. The form reads the actual bytes, sees a PNG and refuses it. Convert with JPG as the output and the file is genuinely re-encoded as a JPEG, which the form will accept.',
            ],
            [
              'Why does my transparent PNG have a black background after converting to JPG?',
              'JPG cannot store transparency, so transparent pixels must become a colour, and the JPEG encoder makes them black. This tool has no fill-colour option. Convert to PNG or WebP to keep the transparency, or place the graphic on a white layer in an editor first.',
            ],
            [
              'Does converting PNG to JPG remove metadata?',
              'Yes. The output is written from the pixels alone, so camera details, dates, GPS coordinates and colour profiles are not carried across in any direction. A privacy advantage when sharing, and a reason to keep the original.',
            ],
            [
              'Can I convert HEIC photos from my iPhone here?',
              'No. HEIC is not among the formats this converter reads, so the conversion fails. Share the photo from the phone using its most-compatible option, or set the camera to capture JPG, then convert the result here.',
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
          Need the picture changed as well as converted? The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          sets exact dimensions, the{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>{' '}
          gets a photo under a portal&rsquo;s size limit, and{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG, WebP, TIFF and BMP
          </Link>{' '}
          runs the other way. To understand why formats behave as they do, our
          free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers raster and vector, compression and colour from the beginning.
        </p>
      </div>
    </article>
  );
}
