import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  Monitor,
  Receipt,
  ScanText,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Image to Text (OCR) tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Text recognition is only offered where the page reports it is
 *    available; everywhere else the tool produces a cleaned, OCR-ready PNG.
 *    The copy says so up front instead of promising copyable text to everyone.
 *
 * 2. The preparation controls (upscale, grayscale, binarize, threshold,
 *    invert) are the real value, so the problem-aware searches ("OCR not
 *    recognizing text", dark-mode screenshots, blurry photos) are answered by
 *    fixing the image, then pointing to the text tools people already have.
 *
 * 3. Everything the tool cannot do (PDF OCR, tables, batches, handwriting,
 *    HEIC, cropping, translation) is routed to a real sibling or named as
 *    unsupported. No accuracy figures or language counts anywhere.
 */
export default function ImageOcrSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">Image to Text</span> (OCR): Extract Text from an Image Privately, or Clean Up a Photo So Any OCR App Can Read It
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A screenshot of an error message, a photo of a receipt, a handout you
        do not want to retype: each is an <strong>image to text</strong> job,
        and the technology behind it is called <strong>OCR</strong>, optical
        character recognition. This guide shows how to{' '}
        <strong>extract text from an image</strong> with the free{' '}
        <strong>image to text converter</strong> above, why the same photo
        reads well in one app and returns garbage in another, and how to clean
        up a picture so the text comes out right &mdash; privately, with no
        sign-up.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/image-ocr.webp"
            alt="OCR text extraction online free - a receipt and a screenshot cleaned up in black and white so OCR can extract the text from them"
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
              Most OCR failures are image problems. Sharpen the contrast, enlarge
              small lettering, and the words come out clean.
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
            ['#what-is-ocr', '1. What Image to Text (OCR) Is, and When You Need It'],
            ['#how-to-extract', '2. How to Extract Text from an Image in Four Steps'],
            ['#prepare-image', '3. How to Prepare an Image for OCR'],
            ['#ocr-not-working', '4. OCR Not Recognizing Text? The Fixes That Work'],
            ['#copy-text-apps', '5. Copy Text from a Picture on Windows, Mac, iPhone and Chrome'],
            ['#use-cases', '6. Receipts, Invoices, Whiteboards, and What This Tool Does Not Do'],
            ['#why-cortexis', '7. Why Choose Cortexis as Your Free Image to Text Converter'],
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
      <section id="what-is-ocr" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanText className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Image to Text (OCR) Is, and When You Need It
        </h3>
        <p>
          A picture of words is still a picture: you can read it, but you
          cannot select, search or edit it. OCR decides which shapes are
          letters and hands you real characters. Whether it is a{' '}
          <strong>JPG to text</strong> job on a phone snap or a{' '}
          <strong>PNG to text</strong> job on a screenshot, the goal is text
          you can work with.
        </p>
        <p>
          Use it whenever retyping would be slow or error-prone. What few
          guides explain is that recognition quality depends more on the image
          than on the software: small, faint or light-on-dark text trips up
          every OCR tool, while a cleaned-up copy of the same picture reads
          well. That is why the tool above is built around preparation first.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-extract" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Extract Text from an Image in Four Steps
        </h3>
        <p>
          Here is <strong>how to extract text from an image</strong> with the
          tool above, one image at a time, with no account or daily limit.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the image.</strong> Drop, choose or simply paste it: a
            screenshot on your clipboard goes straight in, the quickest{' '}
            <strong>screenshot to text</strong> route there is. Very large
            images are scaled so their longest side is at most 2,500 pixels.
          </li>
          <li>
            <strong>Check the preview.</strong> By default the image is
            enlarged 2&times; and converted to pure black and white with an
            automatic threshold. The preview updates as you change settings.
          </li>
          <li>
            <strong>Adjust if needed.</strong> Tick <em>Invert</em> for light
            text on dark, try 3&times; for tiny print, or move the threshold if
            strokes break up or fill in.
          </li>
          <li>
            <strong>Get the result.</strong> Where the panel says text
            recognition is available, press <em>Recognise text</em>, then
            copy the text or download it as a file ending in{' '}
            <strong>-ocr.txt</strong>. Where it is not available, the button
            reads <em>Download prepared image</em> and gives you a clean PNG
            ending in <strong>-ocr-ready.png</strong> for the apps in section 5.
          </li>
        </ol>
        <p>
          A straight answer on that second case: built-in text recognition is
          currently offered here only in Chrome or Edge with the experimental
          web platform features setting switched on, so most visitors get the
          prepared image. The panel says which you have before you press
          anything, and your picture is never passed to an outside OCR
          service or stored on our servers.
        </p>
      </section>

      {/* 3 */}
      <section id="prepare-image" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Prepare an Image for OCR
        </h3>
        <p>
          If you have wondered <strong>how to prepare an image for OCR</strong>{' '}
          or <strong>how to improve OCR accuracy</strong>, these four
          adjustments matter most, and each is a control in the panel above.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Upscale.</strong> Recognition needs enough pixels per
            letter. If you need to <strong>upscale small text image for OCR</strong>{' '}
            work, 2&times; is the default and 3&times; helps the smallest
            print. It cannot invent detail the camera never caught.
          </li>
          <li>
            <strong>Grayscale.</strong> Removes tinted paper, coloured
            highlights and colour casts that confuse recognition.
          </li>
          <li>
            <strong>Binarize and threshold.</strong> The step people search
            for as <strong>binarize image for OCR</strong> forces every pixel
            to pure black or pure white. With the threshold slider at
            &ldquo;auto&rdquo;, the cut-off is chosen for you from the
            image&rsquo;s own light and dark tones using{' '}
            <a
              href="https://en.wikipedia.org/wiki/Otsu%27s_method"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              Otsu&rsquo;s method
            </a>
            . Set your own value from 1 to 255 instead: lower keeps only the
            darkest ink, higher keeps faint strokes. It is the most direct way
            to <strong>increase image contrast for OCR</strong>.
          </li>
          <li>
            <strong>Invert.</strong> Many readers expect dark text on a light
            page. Ticking invert flips a dark-mode screenshot or a white-on-black
            slide into that form.
          </li>
        </ul>
        <p>
          Note that once binarize or invert is on, the image is turned grey
          anyway, and the threshold only matters while binarize is ticked.
        </p>
      </section>

      {/* 4 */}
      <section id="ocr-not-working" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. OCR Not Recognizing Text? The Fixes That Work
        </h3>
        <p>
          When an app returns nothing or a string of symbols, match the
          symptom to the fix.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>OCR not recognizing text at all</strong>: Usually the text
            is too small or too faint. Upscale to 3&times;, keep binarize on
            with the threshold at auto, and check that letters are solid black
            shapes with clean gaps.
          </li>
          <li>
            <strong>OCR white text on black background</strong>: Dark-mode
            screenshots and slides defeat many readers. Tick{' '}
            <em>Invert</em> so the prepared image shows black text on white.
          </li>
          <li>
            <strong>Blurry image to text</strong>: Upscale 2&times; and nudge
            the threshold lower until letters separate. If the preview is still
            a smudge, retake the photo.
          </li>
          <li>
            <strong>Faint print, such as an old receipt</strong>: Raise the
            threshold so light grey strokes count as ink.
          </li>
          <li>
            <strong>Phone camera text tools not detecting text</strong>: The
            text features built into phones struggle with tiny lettering,
            glare and busy backgrounds too. Open the prepared image in them
            instead of the original photo.
          </li>
          <li>
            <strong>Crooked, sideways or cluttered photos</strong>: This tool
            does not crop or rotate. Trim to the text area with the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>{' '}
            and turn it upright with{' '}
            <Link to="/tools/rotate-flip-image" className="text-orange-600 font-semibold underline hover:text-orange-700">
              rotate and flip
            </Link>{' '}
            before you bring it back here.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="copy-text-apps" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-6 h-6 text-orange-500 shrink-0" />
          5. Copy Text from a Picture on Windows, Mac, iPhone and Chrome
        </h3>
        <p>
          If the panel offers you the prepared image, the text tools already
          built into your system finish the job. Open the <strong>-ocr-ready.png</strong>{' '}
          in whichever of these you have.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>How to copy text from a picture on Windows</strong>: Open
            the image full-screen, capture it with Snipping Tool on Windows 11
            and use <em>Text actions</em> to copy the words. If you use
            Microsoft&rsquo;s PowerToys, its{' '}
            <a
              href="https://learn.microsoft.com/en-us/windows/powertoys/text-extractor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              Text Extractor
            </a>{' '}
            lets you draw a box around any text on screen and copies it
            straight to the clipboard.
          </li>
          <li>
            <strong>How to copy text from an image on Mac</strong>: Open the
            file in Preview; on recent versions of macOS, Live Text lets you
            drag across the words and copy them like ordinary text.
          </li>
          <li>
            <strong>Image to text for iPhone photos</strong>: Live Text works
            in the Photos app on recent iPhones: press and hold on the words.
            If an iPhone photo will not open here, it is probably HEIC; convert
            it with{' '}
            <Link to="/tools/heic-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              HEIC to JPG
            </Link>{' '}
            first, and use{' '}
            <Link to="/tools/avif-to-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              AVIF to JPG
            </Link>{' '}
            the same way for AVIF files.
          </li>
          <li>
            <strong>Extract text from a screenshot in Chrome</strong>: Open the
            prepared image in a tab, right-click it, choose{' '}
            <em>Search image with Google</em> and select the text.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-orange-500 shrink-0" />
          6. Receipts, Invoices, Whiteboards, and What This Tool Does Not Do
        </h3>
        <p>
          A <strong>receipt photo to text</strong> job is a faint-print
          problem: raise the threshold and upscale. For{' '}
          <strong>invoice image to text</strong> work, privacy matters as much
          as accuracy, and your file is never stored on our servers. A{' '}
          <strong>whiteboard photo to text</strong> job needs the glare gone:
          crop tightly and lower the threshold so reflections turn white. For <strong>scanned image to text for students</strong>,
          a textbook page or handout usually reads well at the defaults; paste
          the result into the{' '}
          <Link to="/tools/word-counter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            word counter
          </Link>{' '}
          or tidy capitals with the{' '}
          <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            case converter
          </Link>
          .
        </p>
        <p>Just as important is what this tool does not do:</p>
        <ul className="space-y-2">
          <li>
            <strong>Scanned PDFs.</strong> It takes images only. To make a
            scanned PDF searchable, use{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>
            ; to get photos into a searchable PDF, combine them with{' '}
            <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image to PDF
            </Link>{' '}
            first.
          </li>
          <li>
            <strong>Tables and layout.</strong> The output is plain text with no
            columns or formatting, and there is no photo-to-Excel path. For
            PDFs, the{' '}
            <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Excel
            </Link>{' '}
            and{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word
            </Link>{' '}
            converters keep structure.
          </li>
          <li>
            <strong>Batches, languages and handwriting.</strong> One image at a
            time, no language setting, and handwriting is not read reliably.
          </li>
          <li>
            <strong>Translation, QR codes and barcodes.</strong> Not
            supported; our{' '}
            <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
              QR generator
            </Link>{' '}
            only creates codes.
          </li>
          <li>
            <strong>Hiding text.</strong> To obscure words in a picture, use the{' '}
            <Link to="/tools/image-blur" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image blur tool
            </Link>
            , or{' '}
            <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF redact
            </Link>{' '}
            for documents.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Choose Cortexis as Your Free Image to Text Converter
        </h3>
        <p>
          Plenty of pages advertise a <strong>photo to text converter</strong>{' '}
          or <strong>free online OCR</strong>, but few say what happens to your
          picture or let you fix a bad one. Here is why this{' '}
          <strong>image to text converter online free</strong> is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no captcha and no daily file counter.'],
            ['Fixes the image, not just the text', 'Upscale, grayscale, automatic black-and-white threshold and invert, with a live preview.'],
            ['Honest about what you get', 'You are told up front whether you will get copyable text or a prepared image. No accuracy promises.'],
            ['Your images stay private', 'Screenshots, invoices and IDs are never stored on our servers and never retained, and never shared with an outside OCR service.'],
            ['Nothing is used for training', 'Your images are never used to train any model.'],
            ['Works with the tools you already have', 'The prepared PNG is made to be opened in Snipping Tool, Preview and Live Text, with clean black text on white.'],
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
          It sits among a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free file tools
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
              'How do I convert an image to text for free?',
              'Drop, choose or paste the image into the tool above and check the preview. Where text recognition is available, press Recognise text and copy or download the result. Otherwise download the prepared image and open it in Snipping Tool, Preview or Live Text.',
            ],
            [
              'Why do I get a prepared image instead of text?',
              'Built-in text recognition is currently offered here only in Chrome or Edge with the experimental web platform features setting switched on. Everywhere else you get a cleaned, enlarged black-and-white PNG, which the text tools in Windows, macOS and iPhone read more reliably.',
            ],
            [
              'Is online OCR safe for confidential documents?',
              'It depends on the site, and many do not say what happens to your file. Here, images are never stored on our servers, never retained and never used for training.',
            ],
            [
              'Can I extract text from image files in bulk?',
              'No, it works on one image at a time, and none of our other tools batch image OCR either. For a stack of scanned pages, combine them with image to PDF and run PDF OCR on that one file.',
            ],
            [
              'Can it read text from a scanned PDF?',
              'No, it accepts images only. Use the PDF OCR tool to make a scanned PDF searchable, or combine photos with image to PDF first and then run PDF OCR on the result.',
            ],
            [
              'Can I convert a photo of a table into Excel?',
              'Not with this tool; the output is plain text without columns. If the table is in a PDF, PDF to Excel keeps rows and columns.',
            ],
            [
              'Does it read handwriting or other languages?',
              'There is no language setting, and handwriting is not read reliably. Clear printed text, such as typed pages, screenshots and receipts, gives the best results.',
            ],
            [
              'My iPhone photo will not open. What should I do?',
              'iPhone photos are often saved as HEIC, which some setups cannot open. Convert it with HEIC to JPG, then drop the JPG here; AVIF to JPG does the same for AVIF files.',
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
          Need the picture for something else? Remove location data with the{' '}
          <Link to="/tools/exif-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            EXIF remover
          </Link>
          , enlarge a low-resolution photo with the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>
          , or shrink it for email with the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>
          . If you would like to learn to program, our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          is a good start.
        </p>
      </div>
    </article>
  );
}
