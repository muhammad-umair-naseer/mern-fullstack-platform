import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clapperboard,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Sparkles,
  Table,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the universal file converter hub.
 *
 * The hub is one page with five category paths, and each path has sharp edges
 * that the head keywords would happily paper over. The article is organised
 * category by category (images, audio and video, spreadsheets, documents) so
 * that every honest limit sits next to the feature it limits, rather than in
 * a footnote nobody reads.
 *
 * Things the code does not do, and which this article therefore never
 * promises: DOCX, PPTX, EPUB or any office format; OCR on scanned PDFs (text
 * layer only); every page of a PDF as an image (page 1 only, sent to the
 * PDF to JPG tool instead); CSV or JSON as a spreadsheet source (those files
 * take the document path); a true animated GIF from a still image; batch or
 * drag-and-drop; password-protected PDFs.
 *
 * Keywords that describe the mechanism rather than the outcome were declined
 * outright, along with the verify-it-yourself step the research suggested for
 * "how to check if a converter uploads my file". That last question is still
 * answered, as a retention-policy question, in section 7 and the FAQ.
 */
export default function FileConverterHubSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        The <span className="text-orange-600 dark:text-orange-400">Free Online File Converter</span> for Images, Audio, Video, Spreadsheets and PDFs
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Most people end up with five bookmarks: one site for images, another
        for audio, a third for video, a fourth for spreadsheets and a fifth
        for PDFs. This page replaces all of them with a single{' '}
        <strong>free online file converter</strong> that reads the file you
        choose, works out what kind of file it is, and shows you only the
        outputs that make sense for it. It is a{' '}
        <strong>universal file converter</strong> with no sign-up, no daily
        quota and no watermark. This guide walks through each of the five
        categories, the settings each one gives you, and, just as
        importantly, the conversions it will honestly tell you it cannot do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/file-converter-hub.webp"
            alt="A workshop wall of saws, planes, chisels and screwdrivers, a tool for every job"
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
              One page, five categories: the output buttons change to match
              whatever file you pick.
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
            ['#one-page', '1. One Page, Five Categories: What a Universal Converter Does'],
            ['#how-to-use', '2. How to Use This Free Online File Converter'],
            ['#images', '3. Images: PNG, JPG, WebP and Image to PDF'],
            ['#audio-video', '4. Audio and Video: MP3, WAV, MP4, WebM and GIF'],
            ['#spreadsheets', '5. Spreadsheets: Excel to CSV, JSON and HTML'],
            ['#documents', '6. Documents: PDF to Text, HTML and a Page Image'],
            ['#limits-privacy', '7. Size Limits, Privacy and What the Tool Refuses'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Online File Converter'],
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
      <section id="one-page" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. One Page, Five Categories: What a Universal Converter Does
        </h3>
        <p>
          A single-purpose <strong>file converter</strong> knows one trick. An{' '}
          <strong>online file converter</strong> that claims hundreds of formats
          usually handles most of them badly, or not at all on the free tier.
          This hub takes a middle path: five categories, each handled properly,
          with the limits written down. When you choose a file, the tool reads
          its extension and sorts it into one of five groups, and each group
          unlocks its own set of output buttons. The extension is the same signal
          every operating system and the{' '}
          <a
            href="https://www.iana.org/assignments/media-types/media-types.xhtml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IANA media type registry
          </a>{' '}
          use to decide what a file is, which is why a wrong extension is the
          most common reason a conversion refuses to start.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Images</strong> (PNG, JPG, WebP, GIF, BMP, SVG) can become
            PNG, JPG, WebP or a single-page PDF. A GIF button is also shown,
            but it saves a still image, not an animation.
          </li>
          <li>
            <strong>Audio</strong> (MP3, WAV, AAC, OGG, FLAC, M4A) can become
            MP3, WAV, AAC or OGG.
          </li>
          <li>
            <strong>Video</strong> (MP4, MOV, WebM, AVI, MKV) can become MP4,
            WebM, an animated GIF, or an MP3 of just the soundtrack.
          </li>
          <li>
            <strong>Spreadsheets</strong> (XLSX, XLS) can become CSV, JSON, an
            HTML table, or a re-saved XLSX.
          </li>
          <li>
            <strong>Documents</strong>: a PDF can become plain text, a simple
            HTML page, or an image of its first page; plain text, Markdown and
            HTML sources can become a PDF.
          </li>
        </ul>
        <p>
          That is the whole map. If your job is on it, the rest of this guide
          tells you exactly what you will get; if it is not, section 7 points
          you to the right specialist tool.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-use" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use This Free Online File Converter (Step-by-Step)
        </h3>
        <p>
          It is a <strong>file converter with no signup</strong>: no account, no
          email address, no trial that expires. To use the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose one file', 'Click the panel above and pick a file. The tool reads its extension, names the category it detected, and shows the file size. It works on one file at a time.'],
            ['Pick an output and a setting', 'The output buttons change to match the category. JPG and WebP get a quality slider; MP3 gets a bitrate selector. Everything else has one sensible fixed setting.'],
            ['Convert and download', 'Press Convert. A status line and progress bar report what is happening, and a green card with the new filename and its size appears when the job is done.'],
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
          The tool pre-selects an output that differs from your input, so a PNG
          defaults to JPG and an MP3 to WAV. If the wrong category appears,
          check the extension: a <code>.jpg</code> renamed to{' '}
          <code>.pdf</code> is treated as a PDF and rejected, because PDF
          sources are checked against the real PDF signature first.
        </p>
      </section>

      {/* 3 */}
      <section id="images" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500 shrink-0" />
          3. Images: PNG, JPG, WebP and Image to PDF
        </h3>
        <p>
          Pick any PNG, JPG, WebP, GIF, BMP or SVG and a preview appears
          immediately. The output choices are PNG, JPG, WebP, GIF and PDF,
          and the most useful thing here is the quality control.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              The 40&ndash;100% quality slider
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When the target is JPG or WebP, a slider appears, defaulting to
              90%. Lower it to shrink the file; raise it to keep fine detail.
              This is what lets you convert PNG to WebP and adjust the quality
              rather than accepting a fixed setting. PNG is lossless, so the
              slider is hidden for it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Image to PDF at exact pixel size
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The PDF option builds a one-page document sized to the image
              itself, landscape or portrait chosen automatically. No A4
              fitting and no margins. For uniform paper afterwards, run it
              through the{' '}
              <Link to="/tools/pdf-resize" className="text-orange-600 font-semibold underline hover:text-orange-700">
                PDF page resizer
              </Link>
              .
            </p>
          </div>
        </div>
        <p>
          Two things to know. The GIF output button saves a single still
          image under a .gif name; it is not an animation and it is not a true
          GIF encoding, so some programs may not open it. If you want a real
          animated GIF from a set of images use the{' '}
          <Link to="/tools/gif-maker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            GIF maker
          </Link>
          . And an animated GIF chosen as the source keeps only its first
          frame, whatever output you pick. The hub does not accept HEIC, AVIF,
          TIFF, PSD or camera RAW files, and it does not resize; that is the
          job of the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          . To make a JPG smaller without changing its format, pick JPG as the
          output and lower the slider.
        </p>
      </section>

      {/* 4 */}
      <section id="audio-video" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-orange-500 shrink-0" />
          4. Audio and Video: MP3, WAV, MP4, WebM and GIF
        </h3>
        <p>
          Audio and video both show a live percentage as the conversion runs.
          The first audio or video job in a session can take a moment longer
          to begin; later jobs start straight away.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Audio: MP3, WAV, AAC and OGG
        </h4>
        <p>
          Any MP3, WAV, AAC, OGG, FLAC or M4A can be written out as MP3, WAV,
          AAC or OGG. The most common request is to{' '}
          <strong>convert WAV to MP3</strong>: a voice memo or a raw recording
          that is far too big to send. When MP3 is the target, a bitrate menu
          offers 128, 192 or 320 kbps. Choose 128 for speech, 192 for most
          music and 320 when size does not matter. FLAC, M4A and WMA are not
          available as outputs; for those, the{' '}
          <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            audio converter
          </Link>{' '}
          is the dedicated tool.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          Video: MP4, WebM, animated GIF and soundtrack to MP3
        </h4>
        <p>
          MP4, MOV, WebM, AVI and MKV sources can become MP4 or WebM, which
          covers the &ldquo;my phone recorded a MOV and the website wants
          MP4&rdquo; problem. Two cross-category outputs are also here. Pick MP3
          and the tool strips the soundtrack out of the video with the same
          bitrate selector. Pick GIF to{' '}
          <strong>convert MP4 to GIF online free</strong>: the whole clip is
          rendered at ten frames per second and 480 pixels wide, a fixed recipe
          chosen to keep the file shareable.
        </p>
        <p>
          The recipe is fixed, so there is no trimming, resolution choice or
          frame-rate control here. For a GIF from a few chosen seconds, use the{' '}
          <Link to="/tools/mp4-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to GIF tool
          </Link>
          . For AVI, MOV or MKV as outputs, or for a smaller MP4 at a lower
          bitrate, the{' '}
          <Link to="/tools/video-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video converter
          </Link>{' '}
          and{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          are built for exactly that.
        </p>
      </section>

      {/* 5 */}
      <section id="spreadsheets" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-6 h-6 text-orange-500 shrink-0" />
          5. Spreadsheets: Excel to CSV, JSON and HTML
        </h3>
        <p>
          Choose an XLSX or XLS workbook and the outputs become CSV, JSON, an
          HTML table, or XLSX. This is the path for anyone who needs to{' '}
          <strong>convert Excel to CSV online</strong> for an import and does
          not have Excel open, and for any developer who wants to{' '}
          <strong>convert XLSX to JSON</strong> without writing a parser.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>CSV</strong> writes plain comma-separated rows, the form
            that database importers and spreadsheet programs expect.
          </li>
          <li>
            <strong>JSON</strong> writes an array of objects, one per row, with
            keys taken from the header row and two-space indentation. Drop it
            straight into a script, or tidy it further with the{' '}
            <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JSON formatter
            </Link>
            .
          </li>
          <li>
            <strong>HTML</strong> writes a plain table you can paste into a
            page or open for a quick look.
          </li>
        </ul>
        <p>
          The limit to know: <strong>only the first worksheet is exported</strong>
          . If the sheet you need is second in the workbook, move it to the
          front before choosing the file. And going the other way does not work
          here: a CSV or JSON file is treated as a document, not as data, so
          CSV to JSON, JSON to CSV and CSV to XLSX will not produce what you
          expect on this page. Those jobs belong to the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="documents" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. Documents: PDF to Text, HTML and a First-Page Image
        </h3>
        <p>
          PDF is the most carefully handled source on the page. The file is
          checked for a real PDF header first, and a disguised or corrupted
          file is refused with a clear message rather than a vague failure.
          From a valid PDF you can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Convert PDF to text online.</strong> Every page&rsquo;s text
            is written to a .txt file with a &ldquo;--- Page N ---&rdquo;
            marker between pages, so you can tell where each one began.
          </li>
          <li>
            <strong>Convert PDF to HTML.</strong> A simple page with a heading
            and one paragraph block per page. It is for reading and searching,
            not for reproducing layout: fonts, images, columns and tables are
            not carried over.
          </li>
          <li>
            <strong>PDF first page to PNG or JPG.</strong> Exactly what it says:
            page one, rendered at a fixed one-and-a-half times scale, saved as{' '}
            <code>name_page1.png</code>. It is the quickest way to get a cover
            image or thumbnail of a document.
          </li>
        </ul>
        <p>
          Both text outputs copy the text layer the PDF already contains. A
          scanned PDF has no text layer and will produce empty pages; for that
          you need{' '}
          <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF OCR
          </Link>
          . If you want every page as an image rather than the first, the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG tool
          </Link>{' '}
          does the whole document. The PDF and Markdown buttons still appear
          for a PDF source, but neither works: pressing Convert with one of
          them selected ends in a &ldquo;Conversion failed&rdquo; message. For
          an editable document the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          is the right tool.
        </p>
        <p>
          In the other direction, a TXT, Markdown or HTML file becomes a PDF.
          The source text is laid onto a single page as written, so Markdown
          symbols and HTML tags appear verbatim and anything beyond one page is
          cut off. It suits a short note, not a formatted report.
        </p>
      </section>

      {/* 7 */}
      <section id="limits-privacy" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Size Limits, Privacy and What the Tool Refuses
        </h3>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;File too large for online converter&rdquo;
        </h4>
        <p>
          The tool enforces no file size cap and no daily quota, which makes it
          an <strong>unlimited free file converter</strong> in the sense that
          matters: there is no tier above you. A long video takes longer and a
          very large one can still fail, in which case compress it first and
          try again. If another converter has left you watching a bar frozen at
          forty percent on a large video, the progress bar here is a live
          percentage from the encoder, so what you see is real work being done.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          &ldquo;Is it safe to upload files to online converters?&rdquo;
        </h4>
        <p>
          It is the right question to ask of any service, and the honest answer
          depends on the service&rsquo;s retention policy. Ours is short: your
          files are never stored on our servers, nothing is retained after your
          session ends, and nothing you convert is used for training or
          analytics. That makes it a <strong>private file converter</strong>{' '}
          you can use with a payslip, a contract or a family video. If a
          converter cannot state a policy that plainly, treat that as your
          answer.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          What it will not do
        </h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>No DOCX, PPTX, EPUB or other office formats.</strong> Use{' '}
            <Link to="/tools/presentation-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              presentation converter
            </Link>{' '}
            or{' '}
            <Link to="/tools/ebook-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              ebook converter
            </Link>{' '}
            for those.
          </li>
          <li>
            <strong>One file at a time.</strong> No batch, no zip of results.
            Click the panel to choose a file, or drag one onto it.
          </li>
          <li>
            <strong>No password-protected PDFs.</strong> Unlock the file first.
          </li>
          <li>
            <strong>Detection by extension only.</strong> A file with a missing
            or wrong extension lands in the document category.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Online File Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Five categories on one page', 'Images, audio, video, spreadsheets and PDFs, with the output buttons changing to fit the file you chose. One bookmark instead of five.'],
            ['No signup, no quota, no watermark', 'No account, no email, no ten-a-day limit. Every conversion is free, not free until you hit a wall.'],
            ['No file size cap', 'There is no enforced limit and no premium tier holding a bigger one back from you.'],
            ['Real settings where they matter', 'A 40 to 100 percent quality slider for JPG and WebP, and a 128, 192 or 320 kbps bitrate menu for MP3, rather than a vague Low, Medium, High.'],
            ['Your files stay private', 'Never stored on our servers, never retained after your session, never used for training or analytics.'],
            ['Honest about its limits', 'First sheet, first page, text layer only, one file at a time. Each limit is written down here, next to the tool that handles the job properly.'],
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
          It is the front door to a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free file tools
          </Link>{' '}
          on the same terms; when a fixed setting here is not enough, the
          specialist tool is a click away and none of them asks you to pay.
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
              'Is this really a free online file converter with no limit?',
              'Yes. There is no account, no daily count, no file size cap and no watermark. The only practical ceiling is that a very large video takes longer and may need compressing first. Nothing is held back for a paid tier because there is no paid tier.',
            ],
            [
              'How do I check if a converter uploads or keeps my file?',
              'Read its retention policy and see whether it says anything concrete. Ours does: your files are never stored on our servers, nothing is retained after your session, and nothing is used for training or analytics. A policy that only says "secure" without saying what happens to the file afterwards is not telling you much.',
            ],
            [
              'Is there one tool to convert images, audio, video and spreadsheets?',
              'This is that tool, one file at a time. Choose an image and you get image outputs; choose a video and you get MP4, WebM, GIF and MP3; choose a workbook and you get CSV, JSON and HTML. Batch conversion of several files in one go is not supported.',
            ],
            [
              'Why did my CSV turn into a PDF instead of JSON?',
              'CSV and JSON files are treated as documents on this page, and the only document output for them is a PDF. The spreadsheet path only starts from an XLSX or XLS workbook. For CSV to JSON, JSON to CSV or CSV to Excel, use our spreadsheet converter, which is built for exactly that.',
            ],
            [
              'How do I get the first page of a PDF as a PNG?',
              'Choose the PDF, pick PNG or JPG, and press Convert. Page one is rendered and saved with _page1 in the filename. If you need every page as an image, use our PDF to JPG tool instead.',
            ],
            [
              'Why is my PDF to text output empty?',
              'The PDF is a scan, so it holds pictures of pages rather than text. This tool copies the existing text layer only. Run the file through our PDF OCR tool first to add a text layer, then convert.',
            ],
            [
              'Does it convert Word, PowerPoint or EPUB files?',
              'No. DOCX, DOC, PPTX, ODT, RTF, EPUB and MOBI are not accepted here, and choosing one will produce a PDF of its raw contents rather than the document you expect. Use our PDF to Word, presentation converter or ebook converter for those formats.',
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
          Need more control than the hub&rsquo;s fixed settings give you? The{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          trims a picture before you convert it,{' '}
          <Link to="/tools/mp4-mp3" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP4 to MP3
          </Link>{' '}
          is the direct route for pulling audio out of a video, and{' '}
          <Link to="/tools/pdf-png-webp-tiff-bmp-gif" className="text-orange-600 font-semibold underline hover:text-orange-700">
            the multi-format PDF exporter
          </Link>{' '}
          renders every page in the format you choose. If you would rather
          understand how these formats fit together than simply convert between
          them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers JSON, CSV, image formats and media handling from the ground up.
        </p>
      </div>
    </article>
  );
}
