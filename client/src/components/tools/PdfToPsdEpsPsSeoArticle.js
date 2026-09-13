import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Files,
  HelpCircle,
  Layers,
  Printer,
  Ruler,
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to PSD / EPS / PS tool.
 *
 * Written against what PdfToPsdEpsPs.js actually writes, which is narrower
 * than the head keywords imply and the article says so rather than hiding it.
 *
 * Every page is rendered to pixels at 72, 150, 300 or 600 DPI and saved as a
 * flat 8-bit RGB image: a single-image PSD with no layers, an EPS carrying one
 * raster per file, or one multi-page PS. Nothing is vector, nothing is
 * layered, nothing is CMYK, and there is no transparency. "pdf to psd" is
 * mostly searched by people hoping for layers, so section 1 settles that in
 * the first paragraph and section 7 routes the vector, CMYK and editable-text
 * readers elsewhere instead of pretending.
 *
 * Three code-backed facts no one else publishes get their own sections: the
 * bytes-per-pixel size math (3 for PSD, 6 for EPS/PS), the EPS/PS bounding
 * box being written in pixel units so a 300 DPI export places at 4.17x page
 * size, and the PSD carrying no resolution resource so Photoshop reports it
 * at 72 ppi. Section 5 also owns the grey-box EPS placeholder honestly: the
 * file has no preview header and this tool cannot add one.
 *
 * The PS output sets no media size, so "feed it straight to a PostScript
 * printer" is only true at 72 DPI; section 5 and the FAQ say so. Declined
 * keywords: any phrasing that describes where the processing happens
 * (privacy here is sold as an outcome only) and any promise of
 * drag-and-drop, since the panel is click-to-browse.
 */
export default function PdfToPsdEpsPsSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">PDF to PSD</span>, EPS or PostScript Without Photoshop or Illustrator
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A designer wants your brochure page as a Photoshop file. A print shop
        asks for EPS at 300 DPI. An old print server refuses anything that is
        not PostScript. Each is the same request wearing a different extension,
        and each starts with a <strong>PDF to PSD</strong>,{' '}
        <strong>PDF to EPS</strong> or <strong>PDF to PS</strong> conversion.
        This guide explains what the tool above actually writes, which is a
        flat print-resolution snapshot of each page, why that is right for most
        of these jobs, and the handful of cases where something else will serve
        you better.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-psd-eps-ps.webp"
            alt="Convert PDF to PSD, EPS or PS free - export PDF pages as flat Photoshop and PostScript files"
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
              One PDF page, three design-industry formats: a flat PSD, a
              raster EPS, or a multi-page PostScript file.
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
            ['#what-you-get', '1. What a PDF to PSD, EPS or PS Export Really Is'],
            ['#how-to-convert', '2. How to Convert PDF to PSD, EPS or PS Online Free'],
            ['#which-format', '3. PSD vs EPS vs PS: Which One to Choose'],
            ['#dpi-and-size', '4. Resolution and File Size: The Math Behind the Numbers'],
            ['#placing-output', '5. Placing the Result: Why It Comes in Large'],
            ['#multi-page', '6. Multi-Page PDFs: Per-Page ZIP or One PostScript File'],
            ['#wrong-tool', '7. When This Is the Wrong Tool'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF to PSD Converter'],
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
      <section id="what-you-get" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a PDF to PSD, EPS or PS Export Really Is
        </h3>
        <p>
          Start with the sentence every other converter buries: the output is a{' '}
          <strong>flat raster snapshot</strong> of the page, drawn at the
          resolution you pick and saved as a single 8-bit RGB image. The PSD
          has one background image and zero layers. The EPS carries one bitmap
          and no paths. The PS file is a sequence of those bitmaps, one per
          page.
        </p>
        <p>
          A PDF, as defined by{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          , is a set of drawing instructions: text runs, fonts, vector paths
          and embedded images. A snapshot keeps the look and discards the
          structure. That is why <strong>Photoshop opens a PDF as one flat
          layer</strong>, and why a <strong>PDF opens as an image in Photoshop
          and you can&rsquo;t edit the text</strong>: Photoshop rasterizes PDF
          pages on import too. The layers people expect were never in the PDF.
        </p>
        <p>
          A flat snapshot is right surprisingly often: it locks a design against
          font substitution, drops cleanly into a mockup, and cannot be
          accidentally reflowed. What it cannot give you is editable text,
          vectors, CMYK or transparency; section 7 covers those.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to PSD, EPS or PS Online Free (Step-by-Step)
        </h3>
        <p>
          This is a <strong>PDF to PSD converter free online</strong> with no
          account and no watermark, and the same panel doubles as a{' '}
          <strong>PDF to EPS converter online free</strong> and a{' '}
          <strong>PDF to PS converter online</strong>. The job is three choices
          and a button:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your PDF', 'Click the panel above and pick one PDF. It is checked for a genuine PDF header first, so a renamed or corrupted file is caught immediately.'],
            ['Pick format, scope and DPI', 'Target Format is EPS, PSD or PS. Export Scope is the previewed page or every page. Resolution is 72, 150, 300 or 600 DPI. Prev and Next move the preview.'],
            ['Export and download', 'Press Export. A progress bar tracks multi-page jobs, and the download button shows the finished size in megabytes.'],
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
          Two limits, stated up front: the panel takes one PDF at a time, and it
          cannot open a password-protected PDF. You get a load error rather than
          a password prompt, so take the password off with the{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF unlocker
          </Link>{' '}
          first.
        </p>
      </section>

      {/* 3 */}
      <section id="which-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. PSD vs EPS vs PS: Which One to Choose
        </h3>
        <p>
          All three hold the same pixels. Pick by where the file is going, not
          by which sounds most professional.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              PSD for Photoshop
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              An 8-bit RGB Photoshop document with the page as its background.
              Ideal for a <strong>PDF page to flat PSD for a mockup</strong>,
              or when a designer asks for &ldquo;the PSD&rdquo; to build on.
              This is <strong>how to convert PDF to PSD without Photoshop</strong>.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              EPS for placing and printing
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Encapsulated PostScript, EPSF 3.0, one page per file. Choose it
              when a template, portal or vendor insists on .eps and you need
              to <strong>convert PDF to EPS without Illustrator</strong>. It
              places and prints, but carries no paths to edit.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              PS for PostScript workflows
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Plain PostScript, LanguageLevel 3, every page in one file. This
              is the <strong>PDF to PostScript converter</strong> option when
              you need to <strong>convert PDF to PS without Ghostscript</strong>{' '}
              or a command line. Read section 5 before sending it to a printer.
            </p>
          </div>
        </div>
        <p>
          EPS and PS are written as 7-bit text with the image data in
          hexadecimal, which is why they are twice the size of the PSD. To{' '}
          <strong>convert PDF to PostScript Level 3</strong> specifically: both
          declare LanguageLevel 3 in their header.
        </p>
      </section>

      {/* 4 */}
      <section id="dpi-and-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          4. Resolution and File Size: The Math Behind the Numbers
        </h3>
        <p>
          The DPI menu sets sharpness and file size together. Because nothing
          here is compressed, the size is arithmetic: a PSD stores three bytes
          per pixel, an EPS or PS six, since each byte becomes two hex
          characters. For a Letter page:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>72 DPI</strong>: 612 &times; 792 pixels, about 1.5 MB as a
            PSD and 3 MB as an EPS. Screen quality, and the only setting where
            a PostScript file matches its physical page size unadjusted.
          </li>
          <li>
            <strong>150 DPI</strong>, the default: 1275 &times; 1650 pixels,
            roughly 6 MB as a PSD and 12 MB as an EPS. Crisp for proofs and
            mockups.
          </li>
          <li>
            <strong>300 DPI</strong>: 2550 &times; 3300 pixels, around 25 MB as
            a PSD and 50 MB as an EPS. The setting for{' '}
            <strong>convert PDF to PSD 300 DPI</strong> requests and print
            vendors.
          </li>
          <li>
            <strong>600 DPI</strong>: 5100 &times; 6600 pixels, over 100 MB as
            a PSD and over 200 MB as an EPS or PS, per page. A{' '}
            <strong>PDF to PSD 600 DPI</strong> export works for a single page,
            but a long document at this setting can grow past what the export
            can hold and fail. Try one page first.
          </li>
        </ul>
        <p>
          That answers the <strong>converted PSD file huge size</strong>{' '}
          complaint: a 25 MB PSD from a 200 KB PDF is what uncompressed
          print-resolution pixels weigh. If a smaller picture of the page is
          enough, our{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          produces the same view at a fraction of the size.
        </p>
      </section>

      {/* 5 */}
      <section id="placing-output" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          5. Placing the Result: Why It Comes in Large and How to Fix It
        </h3>
        <p>
          The files record pixel dimensions, not physical ones, and the three
          formats react to that differently.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          EPS placed too large in Illustrator after converting from PDF
        </h4>
        <p>
          The EPS bounding box is written in pixel units, and PostScript treats
          those as points. At 72 DPI that is the true page size. Above it the
          placed graphic is oversized by DPI &divide; 72: about twice the page
          at 150 DPI, 4.17 times at 300, 8.33 times at 600. The fix is one
          scale step in the host application: 48%, 24% or 12% respectively. The
          pixels are untouched.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          The PSD opens at 72 pixels per inch
        </h4>
        <p>
          The PSD carries no resolution tag, so Photoshop typically reports it
          at 72 ppi and a 300 DPI export shows a canvas around 35 by 46 inches.
          Open Image Size, untick Resample, and type the DPI you exported at.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Printer only accepts PostScript files, not PDF
        </h4>
        <p>
          The PS file sets no media size, so a print server that images it as-is
          will draw a 150 DPI page at more than double Letter and clip it. Going
          straight to a printer, export at 72 DPI. Going through a viewer or RIP
          that can fit a page to its media, export at 300 DPI and let it scale.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          EPS file shows a grey box in Word
        </h4>
        <p>
          An EPS can carry a preview thumbnail for applications that cannot
          interpret PostScript. This one does not, so a word processor that
          relies on the preview shows a grey placeholder. The file is not
          broken; it images correctly wherever PostScript is rendered. But for
          a picture inside a document or slide, EPS was never the right
          container: use our{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PNG, WebP, TIFF, BMP and GIF exporter
          </Link>{' '}
          and place that instead.
        </p>
      </section>

      {/* 6 */}
      <section id="multi-page" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Files className="w-6 h-6 text-orange-500 shrink-0" />
          6. Multi-Page PDFs: Per-Page ZIP or One PostScript File
        </h3>
        <p>
          A PSD holds one image and EPS is single-page by definition, so with
          All Pages selected those two exports arrive as a ZIP with one file per
          page, numbered in document order. That is the direct answer to{' '}
          <strong>convert each PDF page to separate EPS files</strong>: pick
          EPS, pick All Pages, and no splitting is needed.
        </p>
        <p>
          PostScript was built for whole documents, so the PS export writes
          every page into one file with proper page markers. To{' '}
          <strong>convert a multi-page PDF to a single PS file</strong>, that
          is the setting. There is no page-range option, so for a run of pages,
          pull them out first with{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="wrong-tool" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          7. When This Is the Wrong Tool
        </h3>
        <p>
          Honest routing beats a disappointing download.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Editable text or layers.</strong> No converter can invent
            Photoshop layers from a PDF. For the words, use{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word
            </Link>
            ; for the embedded photographs,{' '}
            <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract images from PDF
            </Link>
            .
          </li>
          <li>
            <strong>A vector EPS.</strong> To <strong>rasterize PDF to EPS</strong>{' '}
            is exactly what this does; to keep the curves, it is not.
            Illustrator opens PDF pages directly with paths intact, and our{' '}
            <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              vector converter
            </Link>{' '}
            handles jobs that start from a vector file such as SVG rather than
            a PDF.
          </li>
          <li>
            <strong>PDF to EPS for a LaTeX figure.</strong> Modern LaTeX
            engines take PDF figures natively, and a raster EPS will not scale
            cleanly in a journal PDF. Use the original PDF as the figure.
          </li>
          <li>
            <strong>CMYK, spot colours or an ICC profile.</strong> Output is
            sRGB. Before you{' '}
            <strong>send a PDF to a print shop as EPS at 300 DPI</strong>,
            confirm the vendor accepts RGB raster; press-ready separations must
            come from the original artwork.
          </li>
          <li>
            <strong>Transparency or the reverse direction.</strong> Pages are
            rendered on white with no alpha channel, and PSD, EPS or PS to PDF
            is not offered here; the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>{' '}
            covers the common raster image formats instead.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF to PSD Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no sign-up', 'A PDF to PSD converter with no signup, no email, no trial countdown and no daily allowance. Every export is free, not just the first few.'],
            ['No file size limit or page cap', 'No quota on how large the PDF is or how many pages it has. The only ceiling is the size of the export itself at very high DPI, which section 4 lets you predict.'],
            ['Three formats, one panel', 'PSD, EPS and PS from the same preview and settings, so a job that needs two of them is a menu change, not a second tool.'],
            ['Real DPI choices', 'Four explicit resolutions from 72 to 600 DPI instead of a vague quality dropdown, with the size of each spelled out here.'],
            ['Your documents stay private', 'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training or analytics.'],
            ['Honest about the output', 'Flat raster, sRGB, pixel-unit sizing: every limitation is written here before you download, not learned from a confused client.'],
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
          It lives among a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress
          </Link>{' '}
          the source PDF,{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            flatten
          </Link>{' '}
          its form fields, or{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            rotate
          </Link>{' '}
          a sideways page before you export it.
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
              'How do I convert PDF to PSD without Photoshop?',
              'Click the panel at the top of this page, choose your PDF, set Target Format to PSD, pick a DPI and press Export. You get a Photoshop document with the page as a flat background image, with no sign-up and no watermark. Set the resolution in Image Size without resampling, because the file carries pixels but no ppi tag.',
            ],
            [
              'Will the PSD have layers I can edit?',
              'No. A PDF does not contain Photoshop layers, so no converter can produce them; the export is one flattened image. For the text, use PDF to Word. For the photographs, use extract images from PDF. For the vector shapes, open the PDF in Illustrator, which keeps its paths.',
            ],
            [
              'Why does my EPS place at four times the page size in Illustrator?',
              'Because the bounding box is written in pixels and PostScript reads pixels as points, so a 300 DPI export is 4.17 times larger than the page. Scale it to 24% after placing; 48% for 150 DPI, 12% for 600. Only the nominal size changes.',
            ],
            [
              'Why does the EPS show as a grey box in Word?',
              'The EPS has no embedded preview thumbnail, and applications that cannot interpret PostScript rely on one. The file is fine and images correctly in Illustrator, Photoshop or any PostScript-aware viewer. For a picture you can see inside a Word document, export the page as PNG or JPG instead.',
            ],
            [
              'Can I convert PDF to PS for a printer that only accepts PostScript?',
              'Yes, with one caution. The PS file does not declare a page size, so a printer that images it as-is will print a 150 DPI page more than twice too large and clip it. Export at 72 DPI if the file goes straight to the printer, or at 300 DPI if it passes through a viewer or RIP that can fit the page to the paper.',
            ],
            [
              'Is there a file size limit, and can I convert a whole document?',
              'No file size limit, no page cap and no daily quota. Choose All Pages with PSD or EPS for a ZIP with one file per page, or PS for a single multi-page PostScript document. At 600 DPI on a long document the export itself can become too large to finish, so test one page first.',
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
          Need a different shape of the same page? The{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            multi-format page exporter
          </Link>{' '}
          gives you PNG, WebP, TIFF, BMP or GIF, the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          brings an oversized export down to template dimensions, and{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR
          </Link>{' '}
          puts searchable text back into a scan. To understand raster, vector,
          resolution and colour rather than work around them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers Photoshop and Illustrator from the first layer up.
        </p>
      </div>
    </article>
  );
}
