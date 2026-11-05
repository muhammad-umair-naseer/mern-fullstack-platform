import React from 'react';
import { Link } from 'react-router-dom';
import {
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
 * Long-form guide rendered under the PDF to JPG tool.
 *
 * Written against what lib/pdfJpg.js actually does, which constrains several
 * things the obvious keywords would otherwise promise.
 *
 * Going out, every page is rendered through a canvas and encoded with
 * toBlob(..., 'image/jpeg', quality), then bundled with JSZip — so the output
 * is always JPEG and always a zip, even for a one-page document. "PDF to PNG"
 * is a high-volume neighbouring phrase and this tool does not serve it, so
 * section 3 sends that reader to the multi-format exporter instead of pretending.
 *
 * Coming back, each image is embedded at its natural pixel dimensions and the
 * page is created to match, so there is no A4 fitting, no margin and no
 * orientation choice. Section 5 says so plainly, because someone expecting a
 * printable A4 sheet will otherwise think the tool is broken.
 */
export default function PdfJpgSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Convert PDF to JPG</span> and Turn Images Back Into a PDF
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Sometimes a document needs to stop being a document. You want to drop a
        page into a slide deck, attach a diagram to a WhatsApp message, post a
        certificate to Instagram, or upload a scanned form to a portal that only
        takes pictures. That is when you need to{' '}
        <strong>convert PDF to JPG</strong>. The same job runs in reverse just as
        often: a folder of phone photos that has to become one tidy file. This
        guide covers both directions, the two settings that decide how the images
        come out, and the one thing about page size that surprises people.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-jpg.webp"
            alt="Hands sorting instant prints of snowy trees and fireworks across a table"
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
              Both directions in one tool: every page out as a JPG, or a set of
              photos in as a single PDF.
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
            ['#what-happens', '1. What Happens When You Convert PDF to JPG'],
            ['#how-to-convert', '2. How to Convert PDF to JPG Online Free'],
            ['#quality-and-scale', '3. Quality and Resolution: The Two Sliders'],
            ['#what-you-get', '4. What You Download: One Zip, Every Page'],
            ['#jpg-to-pdf', '5. Converting JPG to PDF: The Other Direction'],
            ['#common-jobs', '6. The Jobs People Actually Use This For'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF to JPG Converter'],
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
      <section id="what-happens" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Happens When You Convert PDF to JPG
        </h3>
        <p>
          A PDF page is a set of drawing instructions. It says where each letter
          sits, which font to draw it in, where the lines and curves go. Nothing
          in the file is a picture of the page &mdash; the picture only exists
          once something draws it.
        </p>
        <p>
          A <strong>JPG</strong> is the opposite: a fixed grid of pixels, defined
          by the{' '}
          <a
            href="https://www.iso.org/standard/18902.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 10918 JPEG standard
          </a>
          . So to <strong>convert PDF to image</strong>, the page has to be drawn
          once, at a chosen size, and that drawing saved. Three consequences
          follow, and they explain almost every question people ask about this:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The text stops being text.</strong> After conversion you
            cannot select it, search it or copy it. It is a picture of words. If
            you need the words back, that is what our{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR tool
            </Link>{' '}
            is for.
          </li>
          <li>
            <strong>Resolution is a decision, not a property.</strong> The page
            has no natural pixel size, so you choose one. That is the resolution
            slider, and it is why the same PDF can produce a crisp image or a
            soft one.
          </li>
          <li>
            <strong>Every page becomes its own file.</strong> One JPG cannot hold
            twelve pages, so a twelve-page PDF gives you twelve images.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to JPG Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark on the output. To{' '}
          <strong>convert PDF to JPG free</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in your PDF', 'Use the PDF panel above. Any length of document is accepted — there is no page cap and no file size limit.'],
            ['Set quality and scale', 'Two sliders control how the images come out. The defaults suit most jobs; section 3 explains when to move them.'],
            ['Download the zip', 'Every page arrives as a numbered JPG inside a single zip named after your document. A progress readout names each page as it goes.'],
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
          Thumbnails of the first pages appear as the conversion runs, so you can
          see the result before you download anything. If the pages look wrong,
          adjust a slider and run it again.
        </p>
      </section>

      {/* 3 */}
      <section id="quality-and-scale" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. Quality and Resolution: What the Two Sliders Actually Do
        </h3>
        <p>
          Most converters give you a single vague &ldquo;quality&rdquo; dropdown.
          There are two independent things going on here and it is worth knowing
          which one to reach for, because they fix different problems.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Resolution scale
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How large the page is drawn before it is saved. At 2&times; a
              standard page lands around 1,200 pixels wide; at 1&times; it is
              half that. Raise this when text looks soft or you intend to crop
              in. This is the slider that fixes blurry output.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              JPEG quality
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How hard each image is compressed once drawn. Lower it and files
              shrink but fine detail smudges, most visibly around small text.
              This is the slider that fixes files being too big &mdash; not the
              one that fixes blurriness.
            </p>
          </div>
        </div>
        <p>
          The pairing that catches people out is a high quality setting with a low
          scale: you get a large file that still looks soft, because the page was
          drawn small and then preserved carefully at that small size. If the
          result is not sharp enough, raise the scale first.
        </p>
        <p>
          Two related jobs this tool does not do. It writes <strong>JPG</strong>{' '}
          only, so if you specifically need <strong>PDF to PNG</strong>, WebP,
          TIFF, BMP or GIF, use the{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            multi-format page exporter
          </Link>{' '}
          instead. And it renders whole pages, so to pull out the original
          embedded photographs rather than pictures of pages, use{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="what-you-get" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Images className="w-6 h-6 text-orange-500 shrink-0" />
          4. What You Download: One Zip Containing Every Page
        </h3>
        <p>
          The download is a single zip file named after your document, holding one
          numbered JPG per page in document order. That is true whether the PDF
          has one page or four hundred.
        </p>
        <p>
          A zip for a one-page document feels like overkill, and it is worth
          knowing why it works this way: a consistent output means the same steps
          apply to every job, and a forty-page conversion arrives as one file
          rather than forty. Opening it is a double-click on
          Windows and macOS alike, and both phone operating systems handle zip
          files natively now.
        </p>
        <p>
          The images are ordinary JPGs from that point on. Attach them, upload
          them, drop them into a slide deck, or feed them straight back into the
          image panel above if you want to rebuild a document from a subset of
          pages. If you only need certain pages as images, running the PDF through
          the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          first is quicker than converting everything and deleting the rest.
        </p>
      </section>

      {/* 5 */}
      <section id="jpg-to-pdf" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileImage className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Convert JPG to PDF: The Other Direction
        </h3>
        <p>
          The second panel runs the job backwards. Select any number of images and
          they become one PDF, one image per page, in the order you added them.
          Use it to <strong>convert JPG to PDF</strong> when a portal wants a
          single document, or when a set of phone photos of a paper form needs to
          arrive as one file rather than six attachments.
        </p>
        <p>
          JPG, PNG and WebP are all accepted. PNG transparency is carried through
          as it is, which matters if you are assembling exported graphics rather
          than photographs.
        </p>
        <p>
          One thing worth setting expectations on, because it surprises people:{' '}
          <strong>each page is created at the exact pixel dimensions of the
          image it holds</strong>. A tall phone photo produces a tall narrow page;
          a wide screenshot produces a wide short one. Pages are not fitted onto
          A4 and no margin is added, so a document built from mixed images will
          have mixed page sizes. That is usually what you want for sharing on
          screen. If you need uniform paper for printing, run the result through
          the{' '}
          <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page resizer
          </Link>{' '}
          afterwards and pick A4 or Letter.
        </p>
      </section>

      {/* 6 */}
      <section id="common-jobs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          6. The Jobs People Actually Use This For
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>A portal that will not take a PDF.</strong> Plenty of
            government and university upload forms accept only JPG or PNG.
            Converting the pages is the whole fix.
          </li>
          <li>
            <strong>Getting a page into a slide deck.</strong> Dropping a JPG onto
            a slide keeps the layout exactly as designed, where copying and
            pasting the text never does.
          </li>
          <li>
            <strong>Sharing one page on WhatsApp or Instagram.</strong> An image
            previews in the chat; a PDF becomes an attachment nobody opens.
          </li>
          <li>
            <strong>Turning photographed paperwork into one file.</strong> Six
            photos of a signed form, one PDF, one attachment. This is the single
            most common use of the reverse direction.
          </li>
          <li>
            <strong>Making a page uneditable.</strong> Converting to images and
            back removes the live text layer, which is a blunt instrument but an
            effective one. For form fields and annotations specifically, the{' '}
            <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF flattener
            </Link>{' '}
            is the cleaner choice.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF to JPG Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, both directions', 'No account, no email, no trial countdown. The same tool converts each way and neither side is behind a tier.'],
            ['No page or file size limit', 'A four-hundred page manual is allowed. There is no upgrade being held back from you.'],
            ['No watermark on anything', 'Not on the JPGs, not on the rebuilt PDF. Nothing is stamped across the corner.'],
            ['You control quality and resolution', 'Two real sliders rather than a vague Low/Medium/High dropdown, so you can tune the result to the job.'],
            ['Your files stay private', 'Nothing you convert is stored, retained after your session, or used to train anything.'],
            ['See it before you download', 'Page thumbnails appear as the conversion runs, so a wrong setting costs you seconds rather than a download.'],
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
            free document tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress
          </Link>
          ,{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            password-protect
          </Link>{' '}
          the finished file without paying for any of it.
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
              'How do I convert a PDF to JPG for free without an account?',
              'Drop your PDF into the panel at the top of this page, set the quality and resolution if you want to, and download the zip. There is no sign-up, no email step and no watermark on the images. It is free every time, not free for the first few files.',
            ],
            [
              'Why did I get a zip file instead of a JPG?',
              'Because one JPG can only hold one page, so a document always produces a set of images. They are bundled into a single zip named after your PDF so a long document does not trigger dozens of separate downloads. Double-click it to open — Windows, macOS, Android and iOS all handle zip files without extra software.',
            ],
            [
              'How do I get sharper images out of a PDF?',
              'Raise the resolution scale, not the JPEG quality. Scale decides how large the page is drawn before it is saved, so it is what controls sharpness. Quality only decides how hard the finished image is compressed. A high quality setting on a low scale gives you a big file that still looks soft.',
            ],
            [
              'Can I convert a PDF to PNG instead of JPG?',
              'Not with this tool — it writes JPG. Use our PDF to PNG, WebP, TIFF, BMP and GIF exporter for other formats. Choose PNG when you need sharp edges on text and diagrams, and JPG when you need smaller files for photographs.',
            ],
            [
              'How do I turn several JPG photos into one PDF?',
              'Use the second panel on this page. Add your images in the order you want them, and they become one PDF with a page per image. JPG, PNG and WebP are all accepted, and PNG transparency is preserved.',
            ],
            [
              'Why are the pages different sizes when I convert JPG to PDF?',
              'Each page is created to match the exact dimensions of the image it contains, so a portrait phone photo makes a tall page and a wide screenshot makes a short one. Nothing is fitted to A4 and no margin is added. If you need uniform paper for printing, run the PDF through our page resizer afterwards and pick A4 or Letter.',
            ],
            [
              'Is there a limit on how many pages I can convert?',
              'No. There is no page cap, no file size limit and no daily quota. A long document simply takes longer to work through than a short one.',
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
          Need something else from the same document? The{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          pulls out a range of pages before you convert,{' '}
          <Link to="/tools/pdf-crop" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF crop
          </Link>{' '}
          trims the margins off first, and{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>{' '}
          is the one you want if the goal is editing rather than pictures. If you
          would rather understand how document and image formats work than simply
          use them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers resolution, compression and colour from the beginning.
        </p>
      </div>
    </article>
  );
}
