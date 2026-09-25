import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListOrdered,
  Palette,
  Printer,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Grayscale tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Gray is not 1-bit black and white. Searchers type "black and white" and
 *    mostly want gray, but court and fax rules sometimes mean bitmap. Section 1
 *    and section 6 say which one this tool makes.
 *
 * 2. Text and vectors keep their stored colour values and are shown gray, so
 *    a strict print-shop colour check can still flag the file. Said plainly.
 *
 * 3. JPEG photos are re-saved losslessly as gray, so the file can grow despite
 *    the option label. The size section admits it and routes to the compressor.
 */
export default function PdfGrayscaleSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Convert PDF to Grayscale</span>: A Black and White PDF for Printing, With the Text Still Text
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A forty-page slide deck with dark blue backgrounds, due at the print
        room tomorrow. A report full of coloured charts you only need to read
        on paper. A thesis appendix that the submission rules say must be
        grey. Each of these is the same job: turn a colour document into a{' '}
        <strong>grayscale PDF</strong> that still looks and behaves like the
        original. This guide shows how to <strong>convert PDF to grayscale</strong>{' '}
        for free with the tool above, what &ldquo;<strong>PDF to black and white</strong>&rdquo;
        really produces, how to grey out only some pages, why the text stays
        selectable, and &mdash; honestly &mdash; the few jobs where a{' '}
        <strong>PDF to grayscale</strong> conversion is not the answer.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-grayscale.webp"
            alt="Convert PDF to grayscale free - a colour PDF report with charts and photos turned into a black and white PDF ready for printing"
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
              Same pages, same selectable text, no colour. Choose every page or
              only the ones you name.
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
            ['#gray-vs-black-and-white', '1. Grayscale PDF vs Black and White vs Monochrome'],
            ['#how-to-convert', '2. How to Convert PDF to Black and White in Four Steps'],
            ['#some-pages', '3. Convert Only Some Pages of a PDF to Grayscale'],
            ['#printing', '4. How to Make a PDF Grayscale for Printing'],
            ['#text-and-size', '5. Selectable Text, and Why a Grayscale PDF Can Grow'],
            ['#limits', '6. Court Rules, Print Shops and Desktop Alternatives'],
            ['#why-cortexis', '7. Why Use Cortexis to Convert PDF to Grayscale'],
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
      <section id="gray-vs-black-and-white" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          1. Grayscale PDF vs Black and White vs Monochrome
        </h3>
        <p>
          People search for &ldquo;black and white&rdquo; far more often than
          for &ldquo;grayscale&rdquo;, but the two words describe different
          results, and the difference matters once in a while.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-500 shrink-0" /> Grayscale
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every colour becomes a shade of grey that matches how light or
              dark it was. Photos keep their detail, chart colours of
              different brightness stay distinguishable by tone, and black
              text stays black. This is what the tool above makes, and it is what almost
              everyone asking to <strong>remove color from PDF</strong>{' '}
              files actually wants.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" /> True 1-bit monochrome
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every pixel is pure black or pure white, with no greys at all,
              like a fax or a bitmap scan. Some court e-filing systems and
              archive rules ask for this. A <strong>PDF monochrome converter</strong>{' '}
              in that strict sense is not what this page offers; section 6
              explains what to do instead.
            </p>
          </div>
        </div>
        <p>
          So when you want to <strong>convert colour PDF to greyscale</strong>{' '}
          for reading, printing or a submission that simply says &ldquo;no
          colour&rdquo;, grey tones are the right output, and they keep far
          more of the document legible than hard black and white would.
        </p>
        <p>
          One thing to check before you rely on a grey copy: two colours of
          similar brightness can end up as near-identical greys. A chart that
          tells its series apart only by hue, say a mid red line next to a mid
          green one, may be hard to read once the colour is gone. Preview the
          converted pages, and if a chart has become ambiguous, either keep
          that page in colour with the <em>Pages</em> field (section 3) or add
          labels, patterns or line styles in the source document and export
          it again. Charts that already use labels next to each series survive
          the conversion without any help.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to Black and White in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert PDF to black and white</strong> (grey
          tones, to be exact) with the tool at the top of this page. It is a
          way to <strong>convert PDF to grayscale online free</strong>, with no
          account and no watermark added to your pages.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the PDF.</strong> Drop it onto the panel or click to
            browse. The tool takes one PDF at a time.
          </li>
          <li>
            <strong>Decide on images.</strong> The option{' '}
            <em>Convert embedded images to true grayscale</em> is on by
            default. Leave it on for a genuinely grey file; turn it off if you
            only need the pages to look grey and want the photos left as they
            were inside the file.
          </li>
          <li>
            <strong>Pick pages, or leave the field empty.</strong> Empty means
            every page. Type a list or ranges such as <code>1,3-5,8</code> to
            convert only those.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert to grayscale</em>.
            You are told how many pages were desaturated and how many images
            were converted, you get a preview, and the download is named{' '}
            <strong>-grayscale.pdf</strong> so your original is untouched.
          </li>
        </ol>
        <p>
          The steps are the same on every operating system. It is an easy way to <strong>convert PDF to grayscale on Chromebook</strong>, and a free way to{' '}
          <strong>convert PDF to grayscale on Windows 10</strong> or 11 for
          anyone without a paid PDF editor. On Android and iOS the inline
          preview is replaced by a note telling you to use the Download button
          to open the result.
        </p>
      </section>

      {/* 3 */}
      <section id="some-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          3. Convert Only Some Pages of a PDF to Grayscale
        </h3>
        <p>
          Most converters treat a document as all or nothing. The <em>Pages</em>{' '}
          field here lets you <strong>convert only some pages of a PDF to grayscale</strong>{' '}
          and leave the rest in full colour, in the same file.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Keep the charts, grey the prose.</strong> A report whose
            colour charts sit on pages 12 and 19 can have everything else
            converted by typing <code>1-11,13-18,20-40</code>.
          </li>
          <li>
            <strong>A thesis or dissertation appendix.</strong> When the rules
            ask for a <strong>grayscale PDF for thesis or court submission</strong>{' '}
            only in certain parts, name those pages and leave the rest alone.
          </li>
          <li>
            <strong>Lecture slides.</strong> To{' '}
            <strong>convert lecture slides PDF to black and white for printing</strong>,
            grey the whole deck. Dark slide backgrounds become dark grey, not
            colourless; if they still use a lot of toner, print a few test
            pages first.
          </li>
        </ul>
        <p>
          Page numbers past the end of the document are simply ignored, and
          anything the field cannot read, such as a stray letter, is reported
          as an invalid page range rather than guessed at. The page range is
          the only scope control: the whole of each chosen page is greyed, so
          there is no way to keep a single coloured logo on an otherwise grey
          page. If you would rather the colour pages became a separate file,
          pull them out with{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF
          </Link>{' '}
          before converting.
        </p>
      </section>

      {/* 4 */}
      <section id="printing" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Make a PDF Grayscale for Printing
        </h3>
        <p>
          The most common reason to search <strong>how to print PDF in black and white</strong>{' '}
          is cost: colour cartridges are expensive, and a course pack or a
          set of slides can drain them fast. The obvious answer is the
          &ldquo;grayscale&rdquo; box in the print dialog. The frustrating
          reality, familiar to anyone who has searched{' '}
          <strong>printer still printing in color when grayscale selected PDF</strong>,
          is that the setting is a request, not a guarantee. Some drivers
          ignore it, and some mix colour inks to make grey.
        </p>
        <p>
          When your <strong>PDF grayscale print is not working</strong>, the
          reliable fix is to stop asking the printer to remove the colour and
          give it a file that has none to begin with. That is{' '}
          <strong>how to make a PDF grayscale for printing</strong>:
        </p>
        <ol className="space-y-2">
          <li>Convert the PDF with the tool above, with image conversion left on.</li>
          <li>Open the <strong>-grayscale.pdf</strong> copy and check the preview looks right.</li>
          <li>Print that copy. If your printer offers a black-cartridge-only mode, use it as well.</li>
        </ol>
        <p>
          It is the simplest way to <strong>save colour ink printing PDF</strong>{' '}
          files at home or in a school print room.
        </p>
      </section>

      {/* 5 */}
      <section id="text-and-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          5. Selectable Text, and Why a Grayscale PDF Can Grow
        </h3>
        <p>
          A common complaint after using other converters is{' '}
          <strong>grayscale PDF text not selectable</strong>: the pages were
          turned into pictures, so search, copy and links stopped working and
          the text went soft when you zoomed in. This tool does not do that.
          Text, lines, shapes and links stay exactly what they were, and each
          chosen page displays and prints in greys in modern PDF viewers. The
          text remains real text that you can search and copy, and the page
          stays sharp at any zoom.
        </p>
        <p>
          Photos and other embedded images are handled differently when the
          image option is on: they are rewritten as genuine grey images, and a
          picture used on several pages is converted once. A few less common
          image formats are left as stored in the file, yet they still display
          and print grey because the whole page is greyed. The result panel
          tells you how many images were converted, so a count lower than you
          expected simply means some images fell into that group.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Why is my grayscale PDF so large?</strong> The option label
            says &ldquo;smaller file&rdquo;, and for many documents that is
            true, but JPEG photos are saved again without further quality loss,
            which can make a photo-heavy file bigger rather than smaller. If
            size matters, run the grey copy through the{' '}
            <Link to="/tools/pdf-compressor" className="font-semibold underline">
              PDF compressor
            </Link>{' '}
            afterwards.
          </p>
        </div>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          6. Court Rules, Print Shops and Desktop Alternatives
        </h3>
        <p>
          A few jobs are outside what this tool does, and it is better to know
          before you rely on it.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Strict 1-bit black and white.</strong> If a court or
            archive demands a bitmap with no grey at all, no Cortexis tool
            applies that black-or-white threshold to a PDF today. The practical
            route is to export the pages as images with{' '}
            <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to PNG, TIFF or BMP
            </Link>
            , apply a black-and-white threshold in an image editor or your
            scanner software, then rebuild the file with{' '}
            <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image to PDF
            </Link>
            . Bear in mind that this turns the text into pictures. Check your
            court&rsquo;s own filing rules first; many only ask for no colour,
            which the grey copy already meets.
          </li>
          <li>
            <strong>Commercial print preflight.</strong> The text and vector
            colour values stored in the file are unchanged; they are shown grey.
            A print shop&rsquo;s strict &ldquo;no colour&rdquo; check can still
            flag the file, and flattening it does not change that; no Cortexis
            tool rewrites those values today. Ask the print shop whether they
            can convert the file on their side, or export a grayscale PDF from
            the program that made the document. For home, office and school
            printing this makes no difference.
          </li>
          <li>
            <strong>Scans.</strong> To <strong>make a scanned PDF black and white</strong>{' '}
            and remove a yellow or blue colour cast, this tool works well,
            though the cast becomes a light grey tint rather than pure white. It
            does not clean speckle or make the scan searchable; the{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR tool
            </Link>{' '}
            does the text recognition.
          </li>
          <li>
            <strong>Locked, multiple or non-PDF files.</strong> Password-protected
            PDFs are refused, so remove the password with{' '}
            <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF unlock
            </Link>{' '}
            first. To grey several PDFs as one document, join them with the{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF merger
            </Link>
            . A Word or Excel file goes through{' '}
            <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              DOCX to PDF
            </Link>{' '}
            or{' '}
            <Link to="/tools/xlsx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              XLSX to PDF
            </Link>{' '}
            first. There are no sepia, invert or contrast controls.
          </li>
        </ul>
        <p>
          On the desktop alternatives: <strong>how to convert PDF to black and white on Mac</strong>{' '}
          usually means the built-in viewer&rsquo;s Export dialog and its gray
          tone filter, which turns pages into images, so text search and
          sharpness can suffer. Paid desktop PDF editors often include a colour
          conversion feature among their print-production tools, usually
          reserved for the paid tier rather than the free reader. If you
          already have one and need a preflight-clean file, that is the route.
          The PDF format itself, including the
          transparency and colour features that make a grey page possible, is
          defined in{' '}
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
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis to Convert PDF to Grayscale
        </h3>
        <p>
          There are plenty of places to find a <strong>black and white PDF converter online</strong>.
          Here is what makes this <strong>PDF grayscale converter</strong>{' '}
          different, stated so you can check it yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no watermark, no account', 'A free PDF grayscale tool with no watermark stamped on your pages, and no sign-up. The tool on this page is the whole product.'],
            ['Text stays real text', 'Pages are not turned into pictures, so the grey copy stays searchable, copyable and sharp at any zoom, and links keep working.'],
            ['Grey only the pages you choose', 'Type ranges such as 1,3-5,8 to convert chapters or appendices and leave colour charts in colour, all in one file.'],
            ['Photos made truly grey', 'With the image option on, embedded photos are rewritten as genuine grey images, not just displayed grey. The result tells you how many were converted.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after the conversion finishes.'],
            ['Nothing is used for training', 'Your documents are never used to train models. A contract or coursework file stays yours.'],
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
            free document tools
          </Link>{' '}
          built on the same terms.
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
              'How do I convert a PDF to grayscale for free?',
              'Add the PDF to the tool at the top of this page, leave the image option on, leave Pages empty for the whole document and press Convert to grayscale. Download the copy named -grayscale.pdf. There is no account and no watermark.',
            ],
            [
              'Do I need paid PDF software to convert a PDF to grayscale?',
              'No. In paid desktop editors the colour conversion option usually sits among the print-production tools of the paid tier. This tool does the same everyday job free: text stays selectable and photos turn grey. The one case where a paid editor is still the right choice is a print shop that runs a strict colour-free preflight check.',
            ],
            [
              'Is grayscale the same as black and white?',
              'Not quite. Grayscale uses shades of grey, so photos and charts stay readable, while strict black and white uses only pure black and pure white pixels. This tool makes grayscale, which is what most printing and "no colour" rules need.',
            ],
            [
              'Will the text in my grayscale PDF still be selectable?',
              'Yes. Text, lines and links are not turned into images, so you can still search, copy and click them, and the pages stay sharp when you zoom. Only embedded photos are rewritten, as grey images.',
            ],
            [
              'Can I convert only some pages to grayscale?',
              'Yes. Type the pages you want in the Pages field, for example 1,3-5,8, and every other page keeps its colour. The whole of each chosen page is greyed; you cannot keep a single coloured element on it.',
            ],
            [
              'Why does my printer still print in colour when grayscale is selected?',
              'The grayscale setting in a print dialog is a request that some drivers ignore or reset. Converting the PDF first gives the printer a file with no colour to print, which is the reliable fix.',
            ],
            [
              'Why is my grayscale PDF larger than the original?',
              'JPEG photos inside the PDF are saved again as grey images without further quality loss, and that can take more space than the original compressed colour version. Run the result through the PDF compressor to bring the size down.',
            ],
            [
              'Will a print shop accept the grayscale PDF as colour-free?',
              'Not always. The stored colour values of text and vector shapes are kept and displayed grey, so a strict preflight check can still flag colour. For home, office and school printing it prints grey as expected.',
            ],
            [
              'Is it safe to convert confidential PDFs?',
              'Your files are never stored on our servers and nothing is retained once the conversion is done. Documents are never used for training. Password-protected PDFs need their password removed with PDF unlock before they can be converted.',
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
          Grey copy ready? Drop pages you do not need to print with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>
          , split a long course pack into chapters with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>
          , or save single pages as images with the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>
          . And if you would like to build tools like this one yourself, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the groundwork behind them.
        </p>
      </div>
    </article>
  );
}
