import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  Eye,
  FileImage,
  HelpCircle,
  Layers,
  ListChecks,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the EXIF Remover tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Lead with "see what your photo gives away, then remove it", because the
 *    tool shows GPS, camera model, serial number and timestamps before it
 *    strips anything.
 *
 * 2. Be exact per format about which blocks go and which stay, including the
 *    ICC colour profile checkbox, and say plainly that the picture itself is
 *    not touched.
 *
 * 3. State the limits: all-or-nothing removal, the Orientation side effect,
 *    and no HEIC, AVIF, RAW, video, PDF or office files, each routed to the
 *    sibling tool that helps where one exists.
 */
export default function ExifRemoverSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Remove EXIF Data</span> from Photos: See What Your Picture Gives Away, Then Wipe It Without Losing Quality
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A photo of a sofa you are selling. A picture of your kids in the garden
        sent to a relative. A screenshot posted to a forum. Each one can carry
        more than the picture: the exact spot where it was taken, the date and
        time, the phone or camera model, sometimes even its serial number or
        your name. This guide shows you how to <strong>remove EXIF data</strong>{' '}
        for free, how to use the tool above as an <strong>EXIF viewer</strong>{' '}
        so you can see what is there first, what an <strong>EXIF remover</strong>{' '}
        takes out of JPG, PNG and WebP files, and where a general{' '}
        <strong>metadata remover</strong> stops, so you know when you need a
        different tool.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/exif-remover.webp"
            alt="A hand pressing a red pin into a street map, marking an exact location"
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
              First you see the location, camera and timestamps a photo carries.
              Then one click removes them, and the picture stays exactly as it was.
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
            ['#what-exif-is', '1. What EXIF Data Is and What It Reveals'],
            ['#check-location', '2. How to Check If a Photo Has Location Data'],
            ['#how-to-remove', '3. How to Remove EXIF Data in Three Steps'],
            ['#per-format', '4. What Is Removed from JPG, PNG and WebP'],
            ['#when-to-clean', '5. When to Remove Metadata from a Photo'],
            ['#fixes', '6. Common Problems, Limits and Their Fixes'],
            ['#why-cortexis', '7. Why Choose the Cortexis EXIF Remover'],
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
      <section id="what-exif-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-orange-500 shrink-0" />
          1. What EXIF Data Is and What It Reveals
        </h3>
        <p>
          EXIF is labelled information that cameras and phones write into a
          photo when it is taken: exposure, aperture, ISO, lens. It now holds
          far more personal details too, and other metadata sits beside it.
          XMP comes from editing software, IPTC carries press captions and
          credits, and PNG files keep their own text notes.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" /> Where and when
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              GPS latitude, longitude and altitude, plus the date and time
              taken. A picture taken at home with location on carries your
              address in all but name.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500 shrink-0" /> Who and with what
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Make, model, lens, editing software, and on many cameras a
              serial number, owner name and copyright line that tie separate
              photos back to one person.
            </p>
          </div>
        </div>
        <p>
          So, <strong>can someone find my location from a photo</strong>? If
          the file still holds GPS tags, yes: anyone with the original can
          read the coordinates and drop them onto a map. And if you are asking{' '}
          <strong>&ldquo;why does my photo show my camera serial number?&rdquo;</strong>,
          many cameras simply record it as standard, and it stays until
          something removes it.
        </p>
      </section>

      {/* 2 */}
      <section id="check-location" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Check If a Photo Has Location Data
        </h3>
        <p>
          This tool shows you the evidence first. Add a photo and a card
          appears with its name and size. If it carries GPS, a warning shows
          the coordinates to five decimal places, for example{' '}
          <em>Contains GPS location: 51.50072, -0.12462 (N/W)</em>. That is the
          fastest answer to <strong>how to check if a photo has location data</strong>.
        </p>
        <p>
          The card then lists the metadata blocks found (EXIF, XMP, IPTC or an
          ICC colour profile) and a table of up to 40 named tags, such as
          Model, DateTimeOriginal, LensModel, BodySerialNumber,
          CameraOwnerName and the GPS fields. PNG text notes appear as{' '}
          <em>PNG:</em> plus their key. You can use the page purely as a free{' '}
          <strong>EXIF viewer</strong> and never strip anything.
        </p>
      </section>

      {/* 3 */}
      <section id="how-to-remove" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Remove EXIF Data in Three Steps
        </h3>
        <p>
          Whether you are searching <strong>how to remove location from photo</strong>{' '}
          files or <strong>how to remove metadata from a JPG</strong>, the
          steps are the same. You can <strong>remove EXIF data online free</strong>{' '}
          here, with no account and no watermark.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your images.</strong> Drop JPG, PNG or WebP files onto
            the panel, pick them, or paste from the clipboard. Each gets its
            own metadata card.
          </li>
          <li>
            <strong>Keep the colour profile.</strong> The{' '}
            <em>Keep colour profile (ICC)</em> box is ticked by default. It
            keeps colours accurate and is not personal information.
          </li>
          <li>
            <strong>Strip and download.</strong> Press <em>Strip metadata</em>.
            Each file comes back with its new size, a preview and a note of
            what was removed, named with <strong>clean</strong> added so it
            sits beside your original.
          </li>
        </ol>
        <p>
          Need a <strong>bulk EXIF remover</strong>? Add many photos in step
          one. With two or more cleaned, you also get one{' '}
          <strong>cleaned-images.zip</strong>, handy for sellers listing
          several items or journalists clearing a whole assignment.
        </p>
      </section>

      {/* 4 */}
      <section id="per-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          4. What Is Removed from JPG, PNG and WebP
        </h3>
        <p>
          Re-saving a JPEG through an editor can soften it slightly each time. This tool removes the metadata blocks
          and leaves the image data exactly as it was. That is the honest
          answer to <strong>how to remove EXIF data without losing quality</strong>.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>JPG and JPEG</strong> &mdash; EXIF and XMP go, along with
            IPTC press data and embedded comments, so you can{' '}
            <strong>remove XMP and IPTC metadata from images</strong> in the
            same pass as EXIF. The ICC colour profile stays if the box is
            ticked.
          </li>
          <li>
            <strong>PNG</strong> &mdash; text notes, embedded EXIF, the
            modified time and the embedded colour profile go; transparency,
            gamma and animation stay. This is{' '}
            <strong>how to remove metadata from PNG</strong> files, and the
            easy way to <strong>remove metadata from screenshot PNG</strong>{' '}
            images. The ICC checkbox does not apply to PNG.
          </li>
          <li>
            <strong>WebP</strong> &mdash; the EXIF and XMP sections are
            removed, the colour profile is kept, and animations still play.
            That is how to <strong>remove metadata from WebP</strong>.
          </li>
        </ul>
        <p>
          To <strong>remove EXIF but keep color profile</strong> accuracy, as
          designers usually want, leave the ICC box ticked. For PNG text and
          metadata chunk definitions, the{' '}
          <a
            href="https://www.w3.org/TR/png/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C PNG specification
          </a>{' '}
          is the reference.
        </p>
      </section>

      {/* 5 */}
      <section id="when-to-clean" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          5. When to Remove Metadata from a Photo
        </h3>
        <p>
          People often ask <strong>does Instagram remove EXIF data</strong>.
          Large social networks generally say they strip location from
          posted photos, but you cannot check that, and it can change. Other
          channels often deliver the original file, metadata included:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Email and messaging apps.</strong> If you{' '}
            <strong>remove metadata from photos before sending by email or WhatsApp document</strong>,
            the recipient gets a clean file. A photo sent as a document or in
            original quality usually arrives untouched.
          </li>
          <li>
            <strong>Marketplaces and forums.</strong>{' '}
            <strong>Strip EXIF before selling on eBay or Marketplace</strong>{' '}
            when items were photographed at home.
          </li>
          <li>
            <strong>Dating apps.</strong> To <strong>anonymize photos for dating profile</strong>{' '}
            pictures, remove GPS, dates and camera details so a match cannot
            work out where you live.
          </li>
          <li>
            <strong>iPhone photos.</strong> To <strong>remove GPS data from iPhone photo</strong>{' '}
            files, which are usually HEIC, convert with the{' '}
            <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              HEIC to JPG converter
            </Link>{' '}
            first, then strip the JPG here.
          </li>
        </ul>
        <p>
          Quick privacy checklist: GPS location, date taken, serial number,
          and any owner or copyright name. If the card shows one you do not
          want public, strip the file.
        </p>
      </section>

      {/* 6 */}
      <section id="fixes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Common Problems, Limits and Their Fixes
        </h3>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Photo rotated after removing EXIF?</strong> Many cameras
            use an Orientation tag to tell viewers to turn the picture. It is
            part of EXIF, so it goes too. Open the clean copy in the{' '}
            <Link to="/tools/rotate-flip-image" className="font-semibold underline">
              rotate and flip tool
            </Link>{' '}
            and turn it upright for good.
          </p>
        </div>
        <p>
          <strong>Windows Remove Properties and Personal Information not working?</strong>{' '}
          If the built-in option seems to leave details behind, such as XMP
          notes, this tool removes EXIF, XMP, IPTC and comments from a JPG
          together, and the card shows you what was there beforehand.
        </p>
        <p>
          Removal is all or nothing apart from the colour profile, and fields
          cannot be edited. Some jobs need another tool:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>AVIF</strong> &mdash; convert with the{' '}
            <Link to="/tools/avif-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              AVIF to JPG converter
            </Link>
            , then strip.
          </li>
          <li>
            <strong>TIFF, GIF and BMP</strong> &mdash; convert with the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>{' '}
            first. RAW files such as CR2, NEF and ARW are not supported here.
          </li>
          <li>
            <strong>Videos</strong> &mdash; not covered. The{' '}
            <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video converter
            </Link>{' '}
            may drop some tags, though that is not guaranteed.
          </li>
          <li>
            <strong>PDFs, Word and Excel files</strong> &mdash; no tool here
            removes document metadata such as the author. The{' '}
            <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF redact tool
            </Link>{' '}
            hides visible content on the page, which is a different job.
          </li>
          <li>
            <strong>Visible details</strong> &mdash; faces or number plates
            are in the image itself. Hide them with the{' '}
            <Link to="/tools/image-blur" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image blur tool
            </Link>
            , and use{' '}
            <Link to="/tools/image-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image OCR
            </Link>{' '}
            to find readable text you might have missed.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Choose the Cortexis EXIF Remover
        </h3>
        <p>
          Comparing an <strong>EXIF data remover tool</strong>, a{' '}
          <strong>metadata remover online</strong> or a{' '}
          <strong>GPS location remover photo online</strong>? Here is what is
          different, so you can check each point yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['See it before you strip it', 'Every photo shows its GPS coordinates, metadata blocks and up to 40 named tags before anything is removed. You know exactly what you are getting rid of.'],
            ['Quality untouched', 'Only the metadata is removed. The picture is never recompressed, so a clean copy looks identical to the original.'],
            ['Colours kept right', 'The ICC colour profile is kept by default for JPG and always for WebP, so clean photos do not shift colour on other screens.'],
            ['Batch with one ZIP', 'Clean many JPG, PNG and WebP files at once and download them together as cleaned-images.zip.'],
            ['Your photos stay private', 'Files are never stored on our servers and nothing is retained. Your photos are never used for training.'],
            ['Free, honest limits', 'No sign-up and no watermark. Where a format or job is out of scope, the page says so and points you to the tool that helps.'],
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
          built on the same terms. For smaller files, the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>
          ,{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JPEG compressor
          </Link>{' '}
          and{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          go further than stripping.
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
              'How do I remove EXIF data from a photo for free?',
              'Add the JPG, PNG or WebP file to the tool above, leave the colour profile box ticked and press Strip metadata. Download the copy with "clean" in its name, with no account or watermark.',
            ],
            [
              'Does removing EXIF data reduce image quality?',
              'No. The tool removes the metadata blocks and leaves the image data exactly as it was, so the picture is not recompressed. The clean file is usually a little smaller only because the metadata is gone.',
            ],
            [
              'Can someone find my location from a photo I send?',
              'Yes, if the file still contains GPS tags and they receive the original. Add the photo here first; if it has a location, a warning shows the coordinates. Stripping the file removes them.',
            ],
            [
              'Does Instagram remove EXIF data?',
              'Large social networks generally say they remove location from posted photos, but you cannot check that and policies change. Email and files sent as documents often pass the original on, so cleaning first is safer.',
            ],
            [
              'Why is my photo rotated after removing EXIF?',
              'The camera used an Orientation tag to tell viewers to turn the picture, and that tag is part of EXIF. Open the clean copy in the rotate and flip tool and turn it upright.',
            ],
            [
              'Can I remove only the GPS location and keep the camera settings?',
              'Not with this tool. Removal is all or nothing, except that you can keep the ICC colour profile. It also cannot edit fields such as the date or copyright; it only shows and removes metadata.',
            ],
            [
              'How do I remove GPS data from an iPhone photo?',
              'iPhones usually save photos as HEIC, which this tool does not open. Convert the photo with the HEIC to JPG converter, then add the JPG here and press Strip metadata.',
            ],
            [
              'Can it remove metadata from videos, PDFs or Word files?',
              'No. It works with JPG, PNG and WebP images only. No tool here removes PDF or office metadata, and the video converter may drop some video tags without a guarantee.',
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
          Photos clean and ready to share? Resize them for a listing with the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          , add your own mark with the{' '}
          <Link to="/tools/image-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image watermark tool
          </Link>
          , or collect several into one document with the{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF converter
          </Link>
          . And if you want to understand how photos, colour profiles and
          image files really work, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers the groundwork.
        </p>
      </div>
    </article>
  );
}
