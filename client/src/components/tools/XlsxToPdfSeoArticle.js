import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Columns3,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  ListChecks,
  Printer,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Excel to PDF tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The lead complaint for this search is cut-off columns. The tool always
 *    scales each sheet to the page width, so that is the headline promise.
 *
 * 2. It is a data export, not a copy of Excel's look. Formatting, charts and
 *    number formats are dropped, and the page says so before anyone converts.
 *
 * 3. Limits are routed honestly: .xls/.ods go through the spreadsheet
 *    converter first, page numbers and watermarks are added afterwards.
 */
export default function XlsxToPdfSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">Excel to PDF</span> With Every Column on the Page: Sheets, Page Setup and What Carries Over
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You send a spreadsheet as a PDF and the reply comes back: &ldquo;the
        last three columns are on page four.&rdquo; That is the most common
        complaint about turning <strong>Excel to PDF</strong>, and it is the
        one this tool is built around. Every sheet is scaled to the width of
        the page, rows run on downwards, and the header row repeats at the top
        of each page. This guide shows how to <strong>convert Excel to PDF</strong>{' '}
        for free, what each page-setup option does, how to pick which sheets go
        in, and, plainly, what an <strong>xlsx to PDF</strong> export like this
        keeps and what it leaves behind.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/xlsx-to-pdf.webp"
            alt="A hand holding printed charts over a desk with a notebook, calculator and laptop"
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
              Each sheet becomes its own titled section, fitted to the page
              width, with the header row on every page.
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
            ['#what-it-does', '1. Excel to PDF: What You Get and When to Use It'],
            ['#how-to-convert', '2. How to Convert Excel to PDF in Four Steps'],
            ['#columns-cut-off', '3. Columns Cut Off? Fit All Columns on One Page'],
            ['#page-setup', '4. Landscape, A3, US Letter and Text Size'],
            ['#sheets-headers', '5. Multiple Sheets, Selected Sheets and Header Rows'],
            ['#what-carries-over', '6. What Carries Over, and What Does Not'],
            ['#why-cortexis', '7. Why Use Cortexis for Excel to PDF'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-orange-500 shrink-0" />
          1. Excel to PDF: What You Get and When to Use It
        </h3>
        <p>
          This is an <strong>xlsx to PDF converter</strong> for the data in a
          workbook. One .xlsx or .xlsm file goes in; one PDF comes out, with
          each chosen sheet on a new page under its name, laid out as a clean
          table. Text wraps
          inside its cell instead of running into the next one, a column that
          holds only numbers is right-aligned so figures line up, and dates
          print as dates.
        </p>
        <p>
          It suits the moments when the figures matter more than the styling: a
          budget for a manager without Excel, a price list for a client, a
          register to print, a year-end export to archive. If you want to{' '}
          <strong>print a spreadsheet as a PDF table for sharing</strong>, readable
          anywhere and hard to edit by accident, this is the job it does. It is
          also a plain <strong>spreadsheet to PDF converter</strong> for anyone
          who received an .xlsx attachment and needs to read or forward it.
        </p>
        <p>
          The .xlsx format itself is the Office Open XML workbook defined in{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-376
          </a>
          , so files saved from Excel or LibreOffice open the same way. For{' '}
          <strong>Google Sheets xlsx to PDF</strong>, download the sheet as .xlsx
          and drop it here. <strong>Excel to PDF on Chromebook</strong> follows
          the same four steps as on any other computer or a phone.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert Excel to PDF in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert Excel to PDF</strong> with the tool
          above. No account is needed, and your workbook itself is not changed.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the workbook.</strong> Drop an .xlsx or .xlsm file on
            the &ldquo;Choose Excel workbook&rdquo; panel. A pill appears for
            every sheet, labelled with its name and row count.
          </li>
          <li>
            <strong>Pick the sheets.</strong> All pills start switched on. Click
            any you want to leave out, such as a lookup or scratch tab.
          </li>
          <li>
            <strong>Set up the page.</strong> Landscape A4 and 8pt text are the
            defaults. Change the orientation, the page size, the font size, the
            repeating header row and the gridlines if you need to.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert to PDF</em>.
            A preview appears with a download button, and the file is named
            after your workbook with a .pdf extension.
          </li>
        </ol>
        <p>
          Need to <strong>convert Excel to PDF without Excel installed</strong>,
          or is <strong>Excel save as PDF not working</strong> on a locked-down
          work laptop? All you need is the .xlsx file itself, and it is never
          stored on our servers once the PDF is made.
        </p>
      </section>

      {/* 3 */}
      <section id="columns-cut-off" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Columns3 className="w-6 h-6 text-orange-500 shrink-0" />
          3. Columns Cut Off? Fit All Columns on One Page
        </h3>
        <p>
          When <strong>Excel to PDF columns are cut off</strong>, it is because
          the sheet is wider than the paper. Excel then tiles it: the left-hand
          columns on page one, the rest on later pages, so the{' '}
          <strong>Excel PDF splits into multiple pages</strong> nobody can read
          side by side. The usual fix is a trip through Page Layout to set
          scaling to &ldquo;Fit All Columns on One Page&rdquo;.
        </p>
        <p>
          Here that is simply how the table is built. Column widths follow the
          length of each column&rsquo;s content, then the whole table is scaled
          to the page width. Columns never spill sideways; the table only grows
          downwards, which is exactly what <strong>Excel to PDF fit all columns
          on one page</strong> means.
        </p>
        <p>
          The trade-off: a very wide sheet gets narrow columns and more wrapped
          lines. A bigger page, covered next, usually fixes that.
        </p>
      </section>

      {/* 4 */}
      <section id="page-setup" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-orange-500 shrink-0" />
          4. Landscape, A3, US Letter and Text Size
        </h3>
        <p>
          Every option sits under &ldquo;Page setup&rdquo;, visible before you
          convert.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Orientation.</strong> Landscape is the default, since most
            spreadsheets are wide. That answers{' '}
            <strong>how to save Excel as PDF landscape</strong> with no extra
            step. Switch to portrait for narrow lists.
          </li>
          <li>
            <strong>Page size.</strong> A4, US Letter, A3 and Legal. Choose{' '}
            <strong>Excel to PDF US Letter size</strong> for North American
            printers. For a very wide sheet, <strong>xlsx to PDF A3 landscape</strong>{' '}
            gives the columns far more room.
          </li>
          <li>
            <strong>Font size.</strong> From 5pt to 14pt, 8pt by default.{' '}
            <strong>Excel to PDF text too small</strong>? Raise it, and pair it
            with A3 so the table still fits.
          </li>
          <li>
            <strong>Draw gridlines.</strong> On by default. Excel usually prints
            without them; here you get <strong>Excel to PDF with gridlines</strong>{' '}
            ruling every cell, which makes long rows easier to follow. Turn it
            off for a lighter look.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="sheets-headers" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          5. Multiple Sheets, Selected Sheets and Header Rows
        </h3>
        <p>
          <strong>How to convert multiple Excel sheets to one PDF</strong>: leave
          every pill on. Each sheet starts on a fresh page with its name as a
          bold heading, so a reader can tell &ldquo;Q1&rdquo; from
          &ldquo;Q2&rdquo; at a glance, and all of them land in a single file.
        </p>
        <p>
          <strong>How to convert only selected sheets of Excel to PDF</strong>:
          click off the tabs you want to leave out, such as a rates table or a
          sheet of notes. Switch every pill off and all sheets are exported.
        </p>
        <p>
          <strong>How to repeat header row on every page in PDF from
          Excel</strong>: it is already on. &ldquo;First row is a header (repeat
          on each page)&rdquo; shades the first row and redraws it at the top
          of each page as the rows continue. Untick it if row one is data
          rather than column titles.
        </p>
      </section>

      {/* 6 */}
      <section id="what-carries-over" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Carries Over, and What Does Not
        </h3>
        <p>
          Cell values carry over, and so do formula results, as the value Excel
          last saved; nothing is recalculated, so a script-generated workbook
          that was never calculated can show blank formula cells. Dates are
          formatted and TRUE and FALSE stay as words. Long decimals are rounded
          to four places. A macro workbook works too: you can{' '}
          <strong>convert xlsm to PDF</strong> and its values export as normal.
        </p>
        <p>What does not come through:</p>
        <ul className="space-y-2">
          <li>
            <strong>Excel&rsquo;s look.</strong> Fills, fonts, colours, borders,
            merged cells, conditional formatting and your column widths are
            replaced by one plain, consistent table style.
          </li>
          <li>
            <strong>Charts and pictures.</strong> Charts, images, shapes and
            sparklines are left out. Only cell values export.
          </li>
          <li>
            <strong>Number formats.</strong> 25% prints as 0.25 and $1,234.50 as
            1234.5. Only dates keep a format.
          </li>
          <li>
            <strong>Columns past 40.</strong> Each sheet is cut to its first 40
            columns, and there is no warning when that happens. If a sheet is
            wider, split it across two sheets in your spreadsheet app first. You
            also cannot choose a cell range, a print area or hidden columns; the
            whole sheet goes in, so trim unwanted pages afterwards with the{' '}
            <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF page remover
            </Link>
            .
          </li>
          <li>
            <strong>Other file types.</strong> Old .xls, .ods, .numbers and .csv
            files are not accepted. Resave them as .xlsx, or run them through
            the{' '}
            <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              spreadsheet converter
            </Link>{' '}
            first. Password-protected workbooks will not open either; remove the
            password in your spreadsheet app, convert, then lock the PDF with the{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF password protector
            </Link>
            .
          </li>
          <li>
            <strong>Headers, footers and page numbers.</strong> Excel&rsquo;s
            page headers and footers are not carried over, and the PDF has no
            page numbers of its own. Add them afterwards with the{' '}
            <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
              page numbers tool
            </Link>
            .
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <Printer className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>When to use Excel&rsquo;s own Save as PDF instead.</strong>{' '}
            If the PDF has to look exactly like the sheet, with its colours,
            currency formats, merged titles and charts, export from Excel with
            its print settings. No tool on this site keeps Excel&rsquo;s
            formatting. Use this one when you want readable data that fits the
            page.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use Cortexis for Excel to PDF
        </h3>
        <p>
          Plenty of pages offer an <strong>Excel to PDF converter online free</strong>.
          Few show you the page setup or tell you what is lost. Here is what is
          different, so you can check each line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['No sign-up, no watermark', 'Excel to PDF, no sign up, no watermark: no account, no email and nothing stamped on your pages.'],
            ['Every column fits', 'Each sheet is scaled to the page width, so columns are never cut off or pushed onto extra pages.'],
            ['Page setup you can see', 'Orientation, four page sizes, font size, repeating header and gridlines are all on the page, with sensible defaults.'],
            ['Choose your sheets', 'One pill per sheet with its row count. Leave out helper tabs and keep the rest in one PDF.'],
            ['Your figures stay private', 'Files are never stored on our servers and nothing is retained after your session, which matters for payroll and client data.'],
            ['Never used for training', 'Your workbooks are never used to train models. A budget stays yours.'],
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
          That makes it a sensible way to <strong>convert Excel budget to PDF
          securely</strong>, or payroll and client sheets. It sits among our other{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>
          . To lock the finished PDF with a password, use the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>
          ; to number its pages, the{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page numbers tool
          </Link>
          ; to mark it as a draft, the{' '}
          <Link to="/tools/pdf-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF watermark tool
          </Link>
          .
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
              'How do I convert Excel to PDF for free?',
              'Drop your .xlsx file on the tool at the top of this page, choose the sheets, check the page setup and press Convert to PDF. You get a preview and a download named after your workbook. There is no account and no watermark on your pages.',
            ],
            [
              'Why are my columns cut off when I save Excel as PDF?',
              'The sheet is wider than the page, so Excel tiles the extra columns onto later pages. This tool always scales each sheet to the page width, so every column appears on the same page. For very wide sheets, choose A3 landscape so the text stays readable.',
            ],
            [
              'Can I convert Excel to PDF without Excel installed?',
              'Yes. You only need the .xlsx file, not Excel or an Office licence, so it suits an attachment opened on a Chromebook, a shared PC or a phone.',
            ],
            [
              'Does it keep my Excel formatting and charts?',
              'No. Colours, fonts, borders, merged cells, conditional formatting, number formats and charts are dropped, and each sheet is redrawn as a plain gridded table. If the PDF must look exactly like the sheet, use Save as PDF inside Excel instead.',
            ],
            [
              'How does Excel to PDF on iPhone work?',
              'Open this page on the iPhone, tap the file panel and pick the .xlsx from the Files app. The finished PDF downloads and shares like any other file.',
            ],
            [
              'Will it open .xls, .csv or .ods files?',
              'No, only .xlsx and .xlsm workbooks are accepted. Resave the file as .xlsx in your spreadsheet app, or convert it with the spreadsheet converter, then bring it back here.',
            ],
            [
              'Can I put several workbooks into one PDF?',
              'Not in one step; it converts one workbook at a time. Convert each, then combine the PDFs with the PDF merger. Sheets from the same workbook already share one PDF.',
            ],
            [
              'Is it safe to convert payroll or client spreadsheets here?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training. If the PDF itself needs protecting before you send it, add a password with the PDF password protector.',
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
          Need to trim the result? Drop pages with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          or keep just a few with{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF
          </Link>
          , and join several exports with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          . Going the other way, the{' '}
          <Link to="/tools/pdf-excel" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Excel converter
          </Link>{' '}
          turns a PDF table back into a spreadsheet. Reports written in Word
          go through{' '}
          <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Word to PDF
          </Link>
          , and photos or scans through{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF
          </Link>
          . To automate spreadsheet work, try our{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
