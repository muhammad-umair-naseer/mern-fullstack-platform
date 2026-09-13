import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileSpreadsheet,
  FolderOpen,
  Globe,
  HelpCircle,
  Layers,
  ShieldAlert,
  Sparkles,
  Tag,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF to Spreadsheet Suite tool.
 *
 * This route renders the same component as /tools/pdf-excel, and that page
 * already owns the single-file "pdf to excel" job. To keep the two pages off
 * one query, this one is built around the multi-file behaviour:
 * any number of PDFs queued, one .xlsx back, one worksheet
 * per page, each tab prefixed with the source filename, previewed tab by tab
 * before download. Consolidation jobs (a year of statements, a stack of
 * reports) are the framing, and the "spreadsheet" family of phrases is
 * answered by positioning .xlsx as the file Sheets, LibreOffice and Numbers
 * all open.
 *
 * Three things the keywords want that the code does not do, and how each is
 * handled rather than promised:
 *
 * - "merge multiple pdf invoices into one excel file" reads as one ledger of
 *   line items. The output is a gridded worksheet per page with headers and
 *   footers included, so section 4 says so and shows the paste-together step.
 * - "pdf to google sheets" and CSV/ODS output do not exist; the only format is
 *   .xlsx. Section 6 gives the import route and sends CSV seekers to the
 *   spreadsheet converter.
 * - Scanned pages produce a single placeholder cell. Section 7 and the FAQ
 *   route that reader to the OCR tool.
 *
 * The "without <paid desktop editor>" keyword names a competitor product, so
 * it is answered as "without paid desktop software" and never quoted.
 *
 * Two failure modes pre-empted in copy: queueing the same file twice produces
 * duplicate sheet names and fails the run, and sheet names are cut at 31
 * characters, so two long, similar filenames can collide.
 */
export default function PdfSpreadsheetSuiteSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Convert Multiple PDF to Excel</span> in One Workbook, a Sheet Per Page
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        One PDF into one spreadsheet is a solved problem. The job that still
        eats afternoons is the pile: twelve monthly statements, a quarter of
        supplier invoices, a folder of reports that all belong in the same
        workbook. This tool is built for the pile. Queue as many files as you
        like, <strong>convert multiple PDF to Excel</strong> in one run, and
        download a single .xlsx with a worksheet for every page, each tab named
        after its source file. This <strong>PDF to spreadsheet</strong> guide
        covers what you get, how tabs are named, what needs tidying, and how to
        open the result in Google Sheets, LibreOffice or Numbers.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-spreadsheet-suite.webp"
            alt="Convert multiple PDF to Excel free - several PDFs queued into one .xlsx workbook with a worksheet per page"
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
              Many PDFs in, one workbook out: every page becomes a tab carrying
              the name of the file it came from.
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
            ['#one-workbook', '1. What You Get When You Convert Multiple PDF to Excel'],
            ['#how-to', '2. How to Convert Multiple PDF Files to Excel at Once'],
            ['#sheet-names', '3. How the Tabs and the File Are Named'],
            ['#consolidation', '4. Statements, Reports and Invoices'],
            ['#cleanup', '5. Tidying the Result'],
            ['#other-apps', '6. Google Sheets, LibreOffice or Numbers'],
            ['#limits', '7. What This Tool Will Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free PDF to Spreadsheet Converter'],
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
      <section id="one-workbook" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-orange-500 shrink-0" />
          1. What You Get When You Convert Multiple PDF to Excel Here
        </h3>
        <p>
          Most tools that <strong>convert multiple PDF to Excel</strong> hand
          back one spreadsheet per PDF: the same pile in a different format.
          Here the whole queue goes into a single workbook:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>One .xlsx for the entire batch</strong>, whether you queue
            two PDFs or forty.
          </li>
          <li>
            <strong>One worksheet per page.</strong> A three-page statement gives
            three tabs rather than one long dump. If you searched for{' '}
            <strong>convert pdf to excel each page separate sheet</strong>, this
            is that.
          </li>
          <li>
            <strong>The source filename on every tab.</strong> A page from{' '}
            <em>March_statement.pdf</em> becomes <em>March_statement_Page_1</em>,
            so you never lose track of which file a sheet came from.
          </li>
          <li>
            <strong>A preview before you download.</strong> Every sheet appears
            as a clickable tab showing its first fifty rows.
          </li>
        </ul>
        <p>
          Each sheet holds the page&rsquo;s text laid out on a grid by position,
          which is why a clean table comes through clean, and why headers,
          footers and paragraphs land in cells too. Section 5 covers the tidy-up.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert Multiple PDF Files to Excel at Once
        </h3>
        <p>
          If you are <strong>tired of retyping PDF tables into Excel</strong>,
          this is the whole routine, with no account, no watermark, no daily cap
          and no paid desktop software:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Queue every PDF', 'Drop the files into the panel above or pick them from the chooser. “Add more” keeps adding; the X beside a file removes it. No file-count or size limit.'],
            ['Convert to Excel (.xlsx)', 'One click runs the whole queue. The progress readout names each file as it goes; cancel is available between files.'],
            ['Preview, then download', 'Click through the sheet tabs to check the result, then download. A single file is named after that PDF; a batch is extracted-tables.xlsx.'],
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
          One warning: do not add the same file twice. Two copies produce
          identical tab names, which a workbook cannot hold, so the run stops
          with an error. Remove the duplicate and run again.
        </p>
      </section>

      {/* 3 */}
      <section id="sheet-names" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-6 h-6 text-orange-500 shrink-0" />
          3. How the Tabs and the File Are Named
        </h3>
        <p>
          The filenames you feed in decide how readable a sixty-tab workbook is.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              One PDF in the queue
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tabs are <em>Page_1</em>, <em>Page_2</em> and so on, and the
              workbook takes the PDF&rsquo;s own name. A page with no readable
              text gets a short tab such as <em>p3</em> holding a scanned-image
              note.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Two or more PDFs
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every tab is prefixed with its source filename:{' '}
              <em>Q1_report_Page_1</em>, <em>Q2_report_Page_1</em>. The workbook
              is <em>extracted-tables.xlsx</em>; rename it once downloaded.
            </p>
          </div>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          The 31-character rule
        </h4>
        <p>
          Excel caps worksheet names at 31 characters, so long names are cut.
          Two filenames that differ only after the cut, say{' '}
          <em>Northern_Region_Sales_Report_January</em> and{' '}
          <em>Northern_Region_Sales_Report_February</em>, collide and the run
          fails. Shorten them first, or use the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          to put the distinguishing part at the front.
        </p>
      </section>

      {/* 4 */}
      <section id="consolidation" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-orange-500 shrink-0" />
          4. Statements, Reports and Invoices: What Consolidation Looks Like
        </h3>
        <p>
          Three searches bring most people here:{' '}
          <strong>combine several pdf statements into one excel workbook</strong>,{' '}
          <strong>convert 12 monthly pdf reports into one xlsx workbook</strong>{' '}
          and <strong>merge multiple pdf invoices into one excel file free</strong>.
          They are one job with different paperwork, and it pays to be precise
          about what this tool does for it.
        </p>
        <p>
          What it does: puts every page of every document into one labelled
          workbook in the order you queued them. A year of statements is twelve
          files in and one file out, with tabs from <em>Jan_statement_Page_1</em>{' '}
          to <em>Dec_statement_Page_2</em>, replacing twelve separate
          conversions.
        </p>
        <p>
          What it does not do: build a single ledger. The output is a tab per
          page, each tab the whole page with header and footer included, and
          there is no field detection or invoice template. The honest workflow
          is to convert the batch here, then paste the table rows from each tab
          under one another on a summary sheet. With the tabs labelled and side
          by side, that is minutes rather than an afternoon. Sort the summary by
          date and the repeated header text drops to the bottom for one delete.
        </p>
      </section>

      {/* 5 */}
      <section id="cleanup" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Tidying the Result: Text Numbers, Drifted Rows, Stacked Columns
        </h3>
        <p>
          Every tool that lifts data out of a PDF leaves some tidying behind,
          because the{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 PDF specification
          </a>{' '}
          has no concept of a cell. Three symptoms cover nearly every complaint.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          PDF to Excel numbers showing as text
        </h4>
        <p>
          Every cell is written as text, including numbers, currency and dates,
          so nothing is mangled on the way through. It also means SUM returns
          zero until you convert. Select the column, choose Data &rarr; Text to
          Columns and click Finish; the column turns numeric. For one cell,{' '}
          <em>=VALUE(A2)</em> does the same.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          PDF table converts to Excel but rows are misaligned
        </h4>
        <p>
          Column drift comes from right-aligned numbers or wrapped cell text: a
          value that starts slightly further right gets its own column and
          everything after it shifts. Find the mostly blank column, move its
          strays left and delete it. Wrapped text appears as an extra row
          holding only the overflow; merge it into the row above.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          PDF table pasted into Excel all in one column
        </h4>
        <p>
          This is what copying from a PDF viewer does, because the clipboard
          carries text with no column breaks. Converting the file here keeps the
          columns, since horizontal position is what the grid is built from.
          Multi-column layouts, rotated text and side-by-side tables are the
          hard cases: their text is gridded into one sheet, and for those pages{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>{' '}
          may get you closer.
        </p>
      </section>

      {/* 6 */}
      <section id="other-apps" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          6. Opening the Workbook in Google Sheets, LibreOffice or Numbers
        </h3>
        <p>
          &ldquo;Suite&rdquo; does not mean a menu of output formats. The tool
          writes exactly one, .xlsx, the Office Open XML format standardised as{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-376
          </a>
          . That single format is why it works as a{' '}
          <strong>PDF to spreadsheet converter</strong> for people who never
          touch Excel. If you searched{' '}
          <strong>how to open pdf data in google sheets libreoffice or numbers</strong>,
          the route is convert here, then open the file.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Sheets.</strong> File &rarr; Import &rarr; Upload the
            .xlsx; every tab comes through with its name. That is the practical
            answer to <strong>pdf to google sheets free without account</strong>:
            no account is needed here.
          </li>
          <li>
            <strong>LibreOffice Calc.</strong> Open the file directly; Text to
            Columns lives under its Data menu too.
          </li>
          <li>
            <strong>Apple Numbers.</strong> Double-click the .xlsx and it imports
            one sheet per tab.
          </li>
        </ul>
        <p>
          If a system insists on CSV or ODS, run the tidied .xlsx through the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>
          . CSV holds one sheet, so export the summary sheet.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Will Not Do (and Where to Go Instead)
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Scanned pages.</strong> The cause of{' '}
            <strong>scanned pdf to excel not working no text</strong> is that an
            image of a table has no text to grid, so the page becomes one
            placeholder cell. Run it through{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>{' '}
            first, then queue the result here.
          </li>
          <li>
            <strong>Page ranges.</strong> Every page of every file is converted.
            For pages 3 to 7 only, pull them out with{' '}
            <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract pages from PDF
            </Link>{' '}
            or drop the rest with the{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              page remover
            </Link>
            .
          </li>
          <li>
            <strong>Formatting.</strong> Borders, fills, fonts, column widths and
            merged cells are not carried over; you style the values yourself.
          </li>
          <li>
            <strong>Password-protected files</strong> cannot be read. Remove the
            password in the app that set it first.
          </li>
          <li>
            <strong>One continuous sheet.</strong> Tab-per-page is the only
            layout; section 4 covers pasting tabs together.
          </li>
        </ul>
        <p>
          For a single PDF, the{' '}
          <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Excel
          </Link>{' '}
          page covers the one-file case in more depth.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free PDF to Spreadsheet Converter
        </h3>
        <p>
          A search for a <strong>batch PDF to Excel converter free</strong> of
          charge usually ends at a pricing page. Here batch is the default.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Unlimited batch, no file cap', 'Queue two files or two hundred. No per-day quota, no “first five files free”. An unlimited PDF to Excel converter, free of tiers.'],
            ['No signup, no watermark', 'PDF to XLSX with no signup and no watermark, every time. No email gate before the download.'],
            ['One workbook, one tab per page', 'The whole queue lands in a single .xlsx with the source filename on every tab: PDF to Excel, one worksheet per page, free.'],
            ['Preview before you download', 'Read the first fifty rows of every sheet before you commit to a file, so a bad batch costs seconds.'],
            ['Your files stay private', 'Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.'],
            ['Opens anywhere', 'Standard .xlsx that Google Sheets, LibreOffice Calc, Apple Numbers and Excel all read.'],
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
          on the same terms:{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            split
          </Link>{' '}
          the PDFs first, or visit the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          for the next step.
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
              'How do I convert multiple PDF to Excel at once for free?',
              'Queue every PDF in the panel at the top of this page and click Convert to Excel. The batch becomes one .xlsx workbook with a worksheet for every page. No account, no email step, no watermark, no file cap.',
            ],
            [
              'Can I get a PDF to spreadsheet free online without signing up?',
              'Yes. Nothing here asks for an email address or a login, and the download is the finished .xlsx with no watermark. It opens in Excel, Google Sheets, LibreOffice Calc and Numbers.',
            ],
            [
              'Excel’s Get Data from PDF only imports the first page. Does this fix it?',
              'Excel’s own import treats each detected table as a separate query and it is easy to load only the first. This tool converts every page of every file with no selection step, so a twenty-page statement gives you twenty tabs.',
            ],
            [
              'How do I extract tables from a PDF to a spreadsheet without paid software?',
              'Convert the PDF here. Each page’s text is placed on a grid by position, so a real table arrives with rows and columns intact; delete the header and footer rows once the file is open. No desktop PDF editor or subscription is involved.',
            ],
            [
              'Why are my numbers showing as text after PDF to Excel conversion?',
              'Every cell is written as text so nothing is altered on the way through, so formulas ignore the values until you convert them. Select the column, run Data → Text to Columns and click Finish, or use =VALUE() on a single cell.',
            ],
            [
              'Can I convert a scanned PDF to Excel with this tool?',
              'Not directly. A scanned page is a picture with no text to place in cells, so it comes through as one placeholder cell. Run the file through our PDF OCR tool first, then convert the OCR output here.',
            ],
            [
              'Is there a bulk PDF to XLSX option with no file limit?',
              'This is it. No limit on files in the queue, no size limit per file and no daily quota. Just keep filenames short enough that 31-character tab names stay distinct, and do not queue the same file twice.',
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
          Working the same pile further? The{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>{' '}
          puts pages in order before you convert,{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          shrinks the originals for archiving, and{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF protect
          </Link>{' '}
          locks the statements once the numbers are in a workbook. To automate
          this kind of data wrangling instead of repeating it monthly, our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          starts with exactly this sort of file and spreadsheet work.
        </p>
      </div>
    </article>
  );
}
