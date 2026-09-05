import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  Check,
  FileSpreadsheet,
  Files,
  HelpCircle,
  Layers,
  ScanLine,
  Sparkles,
  Table,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to Excel tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, benefit grid, FAQ. Three decisions are worth recording for
 * whoever edits this next, because each one is a keyword we deliberately did
 * not promise.
 *
 * 1. "pdf to csv converter" and "pdf to google sheets" are big terms, and the
 *    engine writes exactly one thing: a .xlsx workbook. So section 3 explains
 *    that the workbook opens in Sheets, Numbers and LibreOffice and re-saves as
 *    CSV from there, rather than claiming an output format we do not produce.
 *
 * 2. "convert pdf to excel without losing formatting" is the highest-intent
 *    phrase in the space and the honest answer is no. The converter rebuilds a
 *    grid from where text sits on the page; cell borders, fills, fonts and
 *    merged headers are not carried across. Section 4 sets that expectation
 *    up front, which is cheaper than a support inbox full of surprise.
 *
 * 3. "scanned pdf to excel" gets routed to the OCR tool instead of being
 *    promised here. A page with no text layer produces a single explanatory
 *    cell, and the article says so in plain words.
 *
 * Section 5 exists because every cell is written as text — that is what the
 * generator emits — and "numbers came through as text" is the single most
 * likely follow-up question. Answering it here beats answering it by email.
 *
 * Privacy is sold as an outcome only: nothing stored, nothing retained,
 * nothing used for training. The mechanism is deliberately absent.
 */
export default function PdfToExcelSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Convert PDF to Excel</span>: Pulling Tables and Data Into a Real Spreadsheet
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Every finance team, every research assistant and every analyst has done
        it at least once: opened a PDF full of figures and started retyping them
        into a spreadsheet, cell by cell. It is slow, and it introduces errors
        you will not notice until a total looks wrong. A{' '}
        <strong>PDF to Excel converter</strong> reads the numbers off the page
        and rebuilds them as rows and columns you can sort, filter and sum. This
        guide covers how to <strong>extract tables from PDF</strong>, what the{' '}
        <strong>.xlsx</strong> output actually looks like, which layouts convert
        cleanly, and the two things that trip people up most.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-excel.webp"
            alt="Convert PDF to Excel online free - extracting a table of figures from a PDF report into an editable XLSX spreadsheet"
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
              From a fixed page of figures to a live spreadsheet: rows, columns
              and one worksheet per page, ready to sort and calculate.
            </span>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#what-it-does', '1. What a PDF to Excel Conversion Really Does'],
            ['#how-to', '2. How to Convert PDF to Excel Online Free'],
            ['#output', '3. What You Get: Sheets, Columns and File Names'],
            ['#accuracy', '4. Which Tables Convert Cleanly and Which Need Tidying'],
            ['#numbers-as-text', '5. Why Your Numbers Arrive as Text (and the Fix)'],
            ['#scanned', '6. Scanned PDFs, Bank Statements and Invoices'],
            ['#batch', '7. Converting Several PDFs Into One Workbook'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF to Excel Converter'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a PDF to Excel Conversion Really Does
        </h3>
        <p>
          A PDF does not contain a table. This surprises people, so it is worth
          saying plainly. What a PDF contains is a list of instructions: put this
          glyph at this coordinate, in this font, at this size. When you look at
          a printed quarterly report you see columns, but the file has no idea
          that a column exists. There is no row, no header, no cell &mdash; only
          ink placed at positions.
        </p>
        <p>
          A spreadsheet is the exact opposite. An{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            .xlsx file is an ECMA-376 Office Open XML workbook
          </a>
          , a structured package that describes sheets, rows and addressable
          cells. Nothing about position, everything about structure.
        </p>
        <p>
          So a <strong>PDF to XLSX conversion</strong> is a reconstruction, not
          a format swap. The converter reads the text on each page along with
          where it sits, groups items that share a baseline into rows, works out
          where the columns are by finding the vertical alignments that text
          repeatedly starts from, and writes the result into a worksheet.
          Columns that end up empty are dropped so you are not left with a
          spreadsheet full of blank gaps. That is how you{' '}
          <strong>convert a PDF table to Excel</strong> without typing anything.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PDF to Excel Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial period. To{' '}
          <strong>convert PDF to Excel free</strong> with the tool at the top of
          this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PDFs', 'Drop one or more .pdf files onto the panel, or click to browse. Anything that is not a PDF is refused with a clear notice rather than failing silently halfway through.'],
            ['Run the extraction', 'Press convert. A progress readout names the file being processed and shows how far along the queue it is, so a long batch never leaves you guessing.'],
            ['Preview, then download', 'The parsed grid appears on screen with a tab per worksheet so you can check it before committing. Then download the .xlsx and open it anywhere.'],
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
          The preview step is the part most <strong>online PDF to Excel</strong>{' '}
          tools skip, and it is the most useful one. Seeing the first fifty rows
          of each sheet before you download tells you in two seconds whether the
          column detection landed the way you hoped, which saves opening a
          spreadsheet only to discover it needs work.
        </p>
      </section>

      {/* 3 */}
      <section id="output" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-orange-500 shrink-0" />
          3. What You Actually Get: Sheets, Columns and File Names
        </h3>
        <p>
          Knowing the shape of the output in advance makes it far easier to work
          with. Here is exactly what lands in your downloads folder.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>One worksheet per page.</strong> A fourteen-page report
            becomes a workbook with fourteen tabs, named{' '}
            <em>Page_1</em> through <em>Page_14</em>. Nothing is merged across
            pages, so a table that runs over three pages arrives as three sheets
            you can stack yourself.
          </li>
          <li>
            <strong>A single .xlsx file.</strong> The download is one Excel
            workbook, named after your PDF. Convert <em>Q3-summary.pdf</em> and
            you get <em>Q3-summary.xlsx</em>.
          </li>
          <li>
            <strong>Rows in reading order.</strong> Lines are written top to
            bottom and left to right, exactly as they appear on the page.
          </li>
          <li>
            <strong>No empty filler columns.</strong> Column positions that
            never hold a value are removed before the sheet is written.
          </li>
        </ul>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Can I get a CSV, or open it in Google Sheets?
        </h4>
        <p>
          People search for a <strong>PDF to CSV converter</strong> constantly,
          so let us be exact: this tool produces .xlsx and only .xlsx. That is
          not the limitation it sounds like. An .xlsx workbook opens natively in
          Excel, Google Sheets, LibreOffice Calc, Apple Numbers and every
          serious data tool, and any of them will re-save a sheet as CSV in two
          clicks. Upload the workbook to Drive and Sheets converts it on open,
          which is how you get <strong>PDF to Google Sheets</strong> without a
          separate service in the middle.
        </p>
      </section>

      {/* 4 */}
      <section id="accuracy" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-6 h-6 text-orange-500 shrink-0" />
          4. Which Tables Convert Cleanly, and Which Need Tidying
        </h3>
        <p>
          Search <strong>convert PDF to Excel without losing formatting</strong>{' '}
          and every result promises a flawless copy. The truthful answer is more
          useful. Because a PDF stores position rather than structure, a
          converter has to infer the grid, and inference works beautifully on
          some layouts and imperfectly on others. Knowing which is which before
          you start is worth more than a promise.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> Extracts reliably
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Machine-generated tables with consistent alignment</li>
              <li>Financial statements, price lists and ledgers</li>
              <li>Exported reports from accounting or database systems</li>
              <li>Single-line rows with one value per column</li>
              <li>Every character of text, including symbols and currency marks</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> Needs a tidy-up
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Merged cells and stacked, multi-level headers</li>
              <li>Cells whose text wraps onto a second line</li>
              <li>Borders, shading, fonts and cell colours</li>
              <li>Rotated or vertical column labels</li>
              <li>Footnotes and captions sitting inside the table area</li>
            </ul>
          </div>
        </div>
        <p>
          The pattern is consistent: <strong>data</strong> comes across, styling
          does not. Cell borders and fills are visual decoration in the source
          page and there is nothing structural to carry over, so expect a plain
          grid and restyle it in seconds with Excel&rsquo;s own table formatting.
          If your document is mostly prose with the occasional figure rather
          than a genuine grid, the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>{' '}
          will give you a better starting point than a spreadsheet ever could.
        </p>
      </section>

      {/* 5 */}
      <section id="numbers-as-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-500 shrink-0" />
          5. Why Your Numbers Arrive as Text (and How to Fix It in 20 Seconds)
        </h3>
        <p>
          This is the question people ask straight after their first conversion,
          usually phrased as <em>&ldquo;why won&rsquo;t my extracted column
          add up?&rdquo;</em> Here is what is happening and how to solve it.
        </p>
        <p>
          Values are written into the workbook exactly as they were read from
          the page, which means they arrive as text rather than as numbers. That
          is deliberate and it is the safe default: it protects long reference
          codes from losing their leading zeros, keeps order numbers from being
          reinterpreted as dates, and preserves currency symbols and thousands
          separators precisely as printed. The trade is that{' '}
          <strong>SUM</strong> will return zero until you convert the column.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Three ways to turn the column into real numbers
        </h4>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Text to Columns.</strong> Select the column, open the Data
            tab, choose Text to Columns and click Finish without changing
            anything. Excel re-reads the column and converts what it can.
          </li>
          <li>
            <strong>Paste Special.</strong> Copy an empty cell, select the
            column, and use Paste Special with the Multiply operation. Every
            value is coerced to a number in one pass.
          </li>
          <li>
            <strong>A VALUE formula.</strong> In a helper column, use{' '}
            <em>=VALUE(A2)</em> and fill down &mdash; the safest option when
            some rows should stay as text.
          </li>
        </ol>
        <p>
          If your figures include currency symbols or non-breaking spaces, strip
          those first with find-and-replace, then convert. Two minutes of this
          once beats retyping a hundred rows.
        </p>
      </section>

      {/* 6 */}
      <section id="scanned" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-orange-500 shrink-0" />
          6. Scanned PDFs, Bank Statements and Invoices
        </h3>
        <p>
          If a page comes back holding a single cell that says there is no
          extractable text, your PDF is a scan. It is not a failure of the
          conversion &mdash; it is the tool telling you the truth instead of
          handing you an empty workbook and letting you find out later.
        </p>
        <p>
          A document that came from a scanner, a photocopier or a phone camera
          contains photographs of pages. Your eyes read the numbers; the file
          holds only pixels. There is no text to position, so there is no grid
          to rebuild. To <strong>convert a scanned PDF to Excel</strong>, take
          two steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Run the file through our{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              free PDF OCR tool
            </Link>{' '}
            to recognise the characters and add a real text layer.
          </li>
          <li>Bring the result back here and extract it to a spreadsheet.</li>
        </ol>
        <p>
          One honest caveat: OCR quality depends entirely on the scan. A clean,
          straight 300 DPI scan of a printed{' '}
          <strong>bank statement to Excel</strong> job reads well; a tilted
          photo of a crumpled receipt will not, and no tool anywhere changes
          that. For <strong>invoice data extraction</strong>, scan flat, scan
          bright, and always check totals against the original. A
          password-protected PDF also cannot be read until the password is
          removed in the application that set it.
        </p>
      </section>

      {/* 7 */}
      <section id="batch" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Files className="w-6 h-6 text-orange-500 shrink-0" />
          7. Converting Several PDFs Into One Workbook
        </h3>
        <p>
          Twelve monthly reports in the same format is a common shape of work,
          and doing them one at a time is tedious. Add all of them at once and
          you get a single workbook back. Each page of each document becomes its
          own sheet, and the tab name carries the source filename as a prefix so
          you always know which report a sheet came from. That makes{' '}
          <strong>batch PDF to Excel</strong> conversion a single operation
          rather than twelve.
        </p>
        <p>
          Two practical notes. Excel caps worksheet names at 31 characters, so
          very long filenames are shortened in the tab label &mdash; the data
          itself is untouched. And when you convert more than one document
          together, the download is named for the batch rather than for any one
          file. If you only need pages 40 to 60 of a long annual report, pull
          them out first with the{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page extractor
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>
          . A shorter input means fewer sheets to sift through and a workbook
          that opens faster.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF to Excel Converter
        </h3>
        <p>
          Plenty of sites will <strong>convert PDF to spreadsheet</strong>. Most
          make it deliberately awkward until you pay. Here is the difference,
          stated so you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no trial', 'No account, no email address, no card and no countdown. What you are using is the whole product, not a sampler.'],
            ['No file size limit', 'A two-page invoice or a 400-page annual report. There is no premium tier above this one to upsell you to.'],
            ['No watermark, no row cap', 'Free converters love to give you the first ten rows. Your workbook comes out complete and unstamped.'],
            ['Your documents stay private', 'Files are never stored on our servers, never retained after your session, and never used for training or analytics.'],
            ['Preview before you download', 'Check the parsed grid sheet by sheet on screen first, so a bad extraction costs you seconds rather than a wasted download.'],
            ['An honest account of the result', 'We tell you which layouts convert cleanly and which need a tidy-up before you spend time on it, not after.'],
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
          It sits inside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on identical terms, so you can{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          a stack of reports into one file before extracting, or{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            reorder the pages
          </Link>{' '}
          so the sheets arrive in the order you want them.
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
              'How do I convert PDF to Excel for free without signing up?',
              'Open the converter at the top of this page, add your PDF, run the extraction and download the .xlsx. There is no account, no email verification, no watermark and no row limit on the output. It is free every time, not free for the first few files.',
            ],
            [
              'Why is my whole table crammed into one column?',
              'That usually means the source table separates its columns with spaces rather than by aligning text at consistent positions, so there is no repeated alignment to detect. Convert it anyway, then use Text to Columns in Excel with space as the delimiter — between the two steps you will still get there far faster than retyping.',
            ],
            [
              'Can I convert a scanned PDF or a photo of a table into Excel?',
              'Not directly, because a scan holds no text to extract and you will see a note saying so on those pages. Run the file through our free PDF OCR tool first to create a text layer, then bring it back here. Results depend on scan quality, so check the figures against the original.',
            ],
            [
              'Does it export to CSV or straight into Google Sheets?',
              'The download is an .xlsx workbook. Google Sheets, Excel, LibreOffice and Numbers all open that format directly, and any of them will save it out as CSV in a couple of clicks if that is what you need next.',
            ],
            [
              'Is there a limit on file size or how many PDFs I can convert?',
              'No. There is no size cap and no daily quota. Larger documents simply take longer to work through, and a laptop will get through a very long report faster than a phone will.',
            ],
            [
              'Are my documents safe when I convert them?',
              'Your files are never stored on our servers, never queued or logged, and nothing is retained once your session ends. Your documents are never used for training or analytics.',
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
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          gets a heavy report under an upload limit, the{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image extractor
          </Link>{' '}
          pulls out embedded charts and logos, and the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          turns a page into a picture you can drop into a slide deck. If you
          would rather automate this kind of data work than click through it,
          our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          covers the spreadsheet and file-handling libraries that sit behind
          tools like this one.
        </p>
      </div>
    </article>
  );
}
