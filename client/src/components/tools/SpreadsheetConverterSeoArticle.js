import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Braces,
  Check,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the spreadsheet converter tool.
 *
 * Written against what SpreadsheetConverter.js actually does. The tool reads
 * one xlsx, xls, csv, tsv or ods file and writes csv, tsv, json, html, xlsx
 * or ods. The thing it does that nobody else on the results page talks about
 * is the sheet picker: CSV, TSV, JSON and HTML are always exactly one sheet,
 * the tool shows you which one before you download, and XLSX/ODS can be the
 * selected tab alone or the whole workbook. So section 1 is about that
 * decision and the problem-shaped queries ("only saves first sheet", "lost
 * all my other tabs") are answered there, not buried in the FAQ.
 *
 * Three things the keywords would like to promise and the code does not do.
 * There is no XLS output, so "xlsx to xls" is declined and section 5 says
 * so. JSON dates come out as Excel serial numbers because the reader does
 * not resolve them, so section 4 explains the serial rather than pretending
 * they are ISO strings. And cell styling, charts, macros and comments are
 * dropped on every output, which section 6 states plainly because a finance
 * user who loses their colour coding will otherwise think the tool broke.
 * Privacy is sold as an outcome only (nothing stored, nothing retained),
 * never as a description of where the work happens.
 */
export default function SpreadsheetConverterSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">Spreadsheet Converter</span>: XLSX, CSV, ODS, TSV, JSON and HTML, One Sheet at a Time
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Every spreadsheet eventually has to leave the program it was made in. A
        supplier wants CSV, a developer wants JSON, a LibreOffice user wants
        ODS. A <strong>spreadsheet converter</strong> handles all of that, but
        nobody explains what happens to a workbook with five tabs when the
        output format can only hold one. This guide is built around that
        question: how to <strong>convert xlsx to csv</strong> from the exact
        sheet you mean, what an <strong>excel to csv converter</strong> throws
        away, and why your dates might turn into five-digit numbers.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/spreadsheet-converter.webp"
            alt="Free spreadsheet converter - convert XLSX, XLS, CSV, TSV and ODS to CSV, JSON, HTML, XLSX or ODS with a sheet picker"
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
              Five inputs, six outputs, and a live preview of the exact sheet
              you are about to download.
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
            ['#which-sheet', '1. Which Sheet Ends Up in the File'],
            ['#how-to-convert', '2. How to Use the Free Online Spreadsheet Converter'],
            ['#output-formats', '3. The Six Output Formats and When to Pick Each'],
            ['#excel-to-json', '4. Excel to JSON: An Array of Objects, and the Date Problem'],
            ['#xls-ods-suites', '5. Old XLS Files, ODS and Moving Between Office Suites'],
            ['#what-is-lost', '6. What Does Not Survive the Conversion'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Spreadsheet Converter'],
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
      <section id="which-sheet" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          1. Which Sheet Ends Up in the File
        </h3>
        <p>
          A workbook is a folder of tables. CSV, TSV, JSON and HTML are not:
          each is one flat table, so converting to any of them means something
          has to decide which tab survives. Excel decides silently, writing
          whichever sheet was active when you hit Save As. That is the whole
          story behind{' '}
          <strong>excel to csv only saves first sheet</strong> and{' '}
          <strong>csv lost all my other tabs</strong>: the other tabs were
          never lost, they were never written.
        </p>
        <p>
          This tool makes the decision visible. With more than one sheet, a{' '}
          <strong>Sheet</strong> dropdown appears and the live preview redraws
          to show the tab you picked. To{' '}
          <strong>export one sheet from excel workbook to csv</strong>, or to{' '}
          <strong>convert second sheet of xlsx to csv online</strong>, choose
          it, check the preview and convert. For the other tabs, change the
          dropdown and convert again; the file stays loaded.
        </p>
        <p>
          XLSX and ODS can hold many sheets, so they offer a second choice. By
          default only the selected sheet is written, into a fresh single-tab
          workbook, the quickest way to{' '}
          <strong>split multi sheet excel into single sheet xlsx</strong>. Tick{' '}
          <strong>Export All Sheets</strong> and the whole workbook is written
          instead.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use the Free Online Spreadsheet Converter (Step-by-Step)
        </h3>
        <p>
          It is an <strong>excel to csv converter no signup</strong> required,
          no email step, no watermark. Three steps cover every direction, so
          this is <strong>how to convert xlsx to csv</strong> and every other
          pairing:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in your spreadsheet', 'XLSX, XLS, CSV, TSV and ODS are accepted. The tool reports the size and sheet count and previews the first sheet.'],
            ['Pick the sheet and the format', 'Choose CSV, Excel, JSON, OpenDocument, TSV or HTML table. With several tabs, pick one from the Sheet menu and the preview follows.'],
            ['Convert and download', 'Press Convert & Download. The file arrives named after your original with the new extension. Change the format or sheet and press again.'],
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
          No size cap is written into the tool, which matters if another
          converter has turned a large export away. It is an{' '}
          <strong>xlsx to csv converter no file size limit</strong> in the
          plain sense; a large export simply takes longer to read. Press{' '}
          <strong>New</strong> to load the next file.
        </p>
      </section>

      {/* 3 */}
      <section id="output-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Six Output Formats and When to Pick Each
        </h3>
        <p>
          Four of the six are flat single-sheet text formats; two are full
          workbooks.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['CSV (.csv)', 'The universal import format. Cell text arrives as it displays in the source, so a date shown as 12/03/2024 stays 12/03/2024.'],
            ['TSV (.tsv)', 'CSV with tabs instead of commas. Convert excel to tsv when your values contain commas and the receiving tool splits them wrongly.'],
            ['JSON (.json)', 'An array of objects, one per row, keyed by the header row. The shape a developer wants for a fixture file. Section 4 has the details.'],
            ['HTML Table (.html)', 'An unstyled page holding one table. Convert excel sheet to html table when the rows need to go into an email, a CMS or a docs page.'],
            ['Excel (.xlsx)', 'A modern workbook. The output for xls to xlsx and csv to xlsx, and the tsv to xlsx converter online route for tab-delimited exports.'],
            ['OpenDocument (.ods)', 'The native LibreOffice format. A csv to ods converter online for a Linux desk, or for a portal that specifies ODS.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          A word on CSV, the format that causes the most arguments. There is a
          specification,{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4180"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 4180
          </a>
          , but almost every program bends it. The CSV and TSV written here use
          a plain line feed between rows and no byte-order mark, which is what
          import scripts expect. Excel on Windows sometimes misreads accented
          characters in such a file; if so, open it through Excel&rsquo;s Data
          import and choose UTF-8. Input and output are independent, so the{' '}
          <strong>ods to csv converter free online</strong> direction works
          like every other pairing.
        </p>
      </section>

      {/* 4 */}
      <section id="excel-to-json" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          4. Excel to JSON: An Array of Objects, and the Date Problem
        </h3>
        <p>
          If &ldquo;<strong>need excel data as json for my app</strong>&rdquo;
          brought you here, the JSON output is built the way most code expects.
          The first row of the selected sheet becomes the property names, every
          row below becomes one object, and the file is one array of those
          objects, valid against{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-404/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-404
          </a>
          . That is the meaning of{' '}
          <strong>convert excel to json array of objects</strong>, and this{' '}
          <strong>xlsx to json converter online free</strong> produces it with
          nothing to configure.
        </p>
        <p>
          Numbers stay numbers and a TRUE cell is a boolean. An empty cell
          becomes <code>null</code> so every object has the same keys, and
          blank rows are dropped. A blank header becomes <code>__EMPTY</code>{' '}
          and a duplicate gets a <code>_1</code> suffix, so tidy the header row
          first.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Excel dates showing as numbers in JSON
        </h4>
        <p>
          Excel stores a date as a serial number counting days from the end of
          1899 and formats it as a date only for display. CSV and TSV carry the
          displayed text, so dates look like dates there. JSON carries the raw
          value, so a date cell arrives as its serial: <code>45123</code> is
          16 July 2023. The tool does not translate this, and it is better to
          know now than in production. The fix is one line: add the serial as
          days to 30 December 1899. Or format the column as text
          before converting and the string comes through. Afterwards, our{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          validates the file.
        </p>
      </section>

      {/* 5 */}
      <section id="xls-ods-suites" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-orange-500 shrink-0" />
          5. Old XLS Files, ODS and Moving Between Office Suites
        </h3>
        <p>
          Often the problem is not the file but the program. Three situations
          recur.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Old XLS file won&rsquo;t open in Excel
        </h4>
        <p>
          Excel 97-2003 files use a binary layout that current versions treat
          with suspicion, and some corporate policies refuse them. The answer
          to{' '}
          <strong>how to convert xls to xlsx without excel</strong> is to load
          the .xls here and choose Excel (.xlsx). One honest limit: the tool
          reads legacy XLS but does not write it, so xlsx to xls is not on the
          menu. For someone on a very old Excel, send CSV instead.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Excel file won&rsquo;t open in LibreOffice
        </h4>
        <p>
          The cause is usually something Excel-specific bolted onto the
          workbook. To <strong>convert xlsx to ods</strong>, choose
          OpenDocument, tick Export All Sheets if you want every tab, and
          download. ODS is standardised as ISO/IEC 26300, and LibreOffice opens
          its own format without the guesswork it applies to XLSX. To{' '}
          <strong>convert ods to xlsx online</strong> for a colleague on Office,
          flip the dropdown.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Convert XLSX to CSV on a Mac without Excel
        </h4>
        <p>
          Excel is not on every Mac. To <strong>convert xlsx to csv on mac without excel</strong>{' '}
          and get exactly the sheet you asked for, load the workbook here, pick
          the tab from the Sheet dropdown and choose CSV; the same route gives
          you TSV or JSON, which a spreadsheet program may not offer at all.
        </p>
      </section>

      {/* 6 */}
      <section id="what-is-lost" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Does Not Survive the Conversion
        </h3>
        <p>
          A converter that claims to carry everything across is not telling the
          truth. This tool moves{' '}
          <strong>cell values</strong>, plus formula text for XLSX output. It
          does not move the following, on any output:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cell styling.</strong> Fonts, colours, fills, borders,
            column widths and conditional formatting are dropped. The values
            are right; the paint is gone.
          </li>
          <li>
            <strong>Charts, images and pivot tables.</strong> These sit on top
            of a sheet rather than inside its cells.
          </li>
          <li>
            <strong>Macros, data validation, comments and hyperlinks.</strong>{' '}
            None of these travel with the cell data, so a macro-driven
            workbook comes out as plain values.
          </li>
          <li>
            <strong>Password-protected workbooks.</strong> An encrypted file
            cannot be read. Remove the password in the original program first.
          </li>
        </ul>
        <p>
          Two scope limits. It takes one file at a time; drop several and the
          first is loaded. And it does not read or write PDF; if your table is
          trapped in one, start with{' '}
          <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Excel
          </Link>{' '}
          or the wider{' '}
          <Link to="/tools/pdf-spreadsheet-suite" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to spreadsheet suite
          </Link>
          , then bring the result here. If you end up with one CSV per sheet,
          the{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive creator
          </Link>{' '}
          bundles them into a single zip.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Spreadsheet Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['One page, every pairing', 'Five inputs and six outputs on one page, not a page per format pair. Load once, export as often as you like.'],
            ['You choose the sheet', 'A Sheet dropdown and a live preview of the exact tab you are exporting, before the download.'],
            ['Whole workbook or one tab', 'For XLSX and ODS output, keep every sheet with one checkbox, or write just the selected tab.'],
            ['No file size limit, no signup', 'No account, no email, no daily quota and no size cap written into the tool.'],
            ['Your data stays private', 'Your spreadsheets are never stored on our servers, never retained after your session, never used for training or analytics.'],
            ['Honest about what it drops', 'Values and formulas move; styling, charts and macros do not. We say so here, up front.'],
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
          It is one of a set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document and data tools
          </Link>{' '}
          on the same terms; the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists them all, and the{' '}
          <Link to="/tools/presentation-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            presentation converter
          </Link>{' '}
          covers slide decks.
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
              'Is this spreadsheet converter really free with no signup?',
              'Yes. No account, no email gate, no trial period, no watermark. It is free every time.',
            ],
            [
              'Why does Excel to CSV only save the first sheet?',
              'A CSV can only hold one table, and Excel writes whichever sheet was active when you saved. Nothing was deleted; the other tabs were simply not written. Load the workbook here, pick each tab from the Sheet dropdown and convert.',
            ],
            [
              'How do I convert the second sheet of an XLSX to CSV online?',
              'Load the file, choose the second sheet from the Sheet dropdown, and press Convert & Download with CSV selected. The preview shows that sheet before you download.',
            ],
            [
              'Why are my Excel dates showing as numbers in the JSON?',
              'Excel stores dates as serial numbers counting days from 30 December 1899, and JSON output keeps the raw value, so 45123 is 16 July 2023. Add the serial as days to that date in your code, or format the column as text before converting. CSV and TSV carry the displayed text instead.',
            ],
            [
              'Will my formatting, charts and macros come through?',
              'Cell values come through on every output, and formulas in XLSX output. Fonts, colours, borders, charts, pivot tables, comments and macros do not.',
            ],
            [
              'Is there a file size limit, and do you keep my spreadsheet?',
              'No size cap is written into the tool and there is no daily quota. Your files are never stored on our servers, nothing is retained once your session ends, and nothing is used for analytics or training.',
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
          Working with the same data elsewhere? The{' '}
          <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Excel converter
          </Link>{' '}
          gets a table out of a PDF before you start, the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          checks the export you just made, and the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          tidies a batch of per-sheet CSVs. If you would rather build the app
          that consumes the JSON than just produce it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts at the first line of code.
        </p>
      </div>
    </article>
  );
}
