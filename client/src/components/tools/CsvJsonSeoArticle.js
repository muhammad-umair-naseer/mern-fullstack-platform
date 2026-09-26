import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  Braces,
  Check,
  Columns3,
  Hash,
  HelpCircle,
  Layers,
  Sheet,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the CSV to JSON tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The typing rules are stated exactly (what becomes a number, a boolean or
 *    null, and why 007 and 16+ digit IDs stay strings), because that is what
 *    people only find out after a bad import.
 *
 * 2. Flattening is shown with the real column names it produces
 *    (address.city, tags.0), with the switch on and off.
 *
 * 3. Limits are named and routed: no NDJSON, no XLSX, no unflatten, first row
 *    is always the header.
 */
export default function CsvJsonSeoArticle() {
  const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

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
        The Two-Way <span className="text-orange-600 dark:text-orange-400">CSV to JSON Converter</span> Guide: Typed Values, Nested Data, and the Delimiter Trap
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A spreadsheet export a developer needs as an array. An API response a
        manager wants as a table. A European Excel file full of semicolons.
        Same job, different directions. This guide shows how to turn <strong>CSV to JSON</strong> and <strong>JSON to CSV</strong>{' '}
        with the free <strong>CSV to JSON converter</strong> above, exactly which
        values become numbers and which stay text, what happens to nested
        objects, and where the tool stops.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/csv-json.webp"
            alt="Birch magazine holders on a shelf with papers filed upright in neat rows"
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
              Rows become objects keyed by the header, and nested keys become
              columns like address.city, in whichever direction you need.
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
            ['#what-it-does', '1. CSV to JSON and JSON to CSV: What Each Direction Gives You'],
            ['#how-to-csv-json', '2. How to Convert CSV to JSON in Four Steps'],
            ['#how-to-json-csv', '3. How to Convert JSON to CSV, Nested Data Included'],
            ['#types', '4. CSV to JSON: Keep Leading Zeros, Type Numbers and Booleans'],
            ['#delimiters', '5. Semicolons, Tabs and the CSV That Opens in One Column'],
            ['#excel-sheets', '6. JSON to Excel, Google Sheets, and Excel to JSON'],
            ['#why-cortexis', '7. Why Use the Cortexis CSV to JSON Converter'],
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
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          1. CSV to JSON and JSON to CSV: What Each Direction Gives You
        </h3>
        <p>
          CSV is a table written as text: one line per row, values separated
          by a delimiter, usually with a header line naming the columns. Its
          rules are loosely written down in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4180"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            RFC 4180
          </a>
          . JSON, defined in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc8259"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            RFC 8259
          </a>
          , is what code and APIs speak, with real numbers, booleans and
          nesting.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Braces className="w-5 h-5 text-orange-500 shrink-0" /> CSV &rarr; JSON
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The first row is the header; every later row becomes one object
              keyed by those names, in a JSON array saved as data.json.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Sheet className="w-5 h-5 text-orange-500 shrink-0" /> JSON &rarr; CSV
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Each object becomes a row, every key becomes a column, and nested
              values flatten into readable column names, saved as data.csv.
            </p>
          </div>
        </div>
        <p>
          People look for a <strong>CSV JSON converter two way</strong> so the
          data can go back without a second site; here both directions sit
          behind the <em>Conversion</em> menu. What it does not do: read or
          write Excel workbooks, parse JSON Lines, rebuild nesting from dotted
          headers, or filter and sort rows. Where another Cortexis tool does
          the job, it is named below; where none does, the guide says so.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-csv-json" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert CSV to JSON in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert CSV to JSON</strong>, with no account.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your data.</strong> Drop a .csv, .tsv or .txt file, or
            paste rows into the text box over the sample.
          </li>
          <li>
            <strong>Pick CSV &rarr; JSON.</strong> Leave <em>Delimiter</em> on
            Auto-detect; it tries comma, semicolon, tab and pipe and picks the
            most consistent.
          </li>
          <li>
            <strong>Set typing and layout.</strong> Keep{' '}
            <em>Convert numbers/booleans</em> on for typed values. Keep{' '}
            <em>Pretty-print JSON</em> on for two-space indentation, or turn
            it off to{' '}
            <strong>minify JSON from CSV</strong> into a single compact line.
          </li>
          <li>
            <strong>Convert, then copy or download.</strong> Press{' '}
            <em>Convert</em>. A note shows the record and column count.
          </li>
        </ol>
        <p>
          That is how you <strong>convert CSV to JSON array of objects</strong>{' '}
          form for front-end code, fixtures or a mock endpoint. Quoting is
          handled properly, so a{' '}
          <strong>CSV with commas in fields to JSON</strong> converts cleanly:
          &ldquo;12 Mall Road, Lahore&rdquo; stays one value, doubled quotes
          become one, and line breaks inside quoted cells are kept. A leading
          byte order mark is removed so the first key stays clean.
        </p>
      </section>

      {/* 3 */}
      <section id="how-to-json-csv" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Convert JSON to CSV, Nested Data Included
        </h3>
        <p>
          For <strong>how to convert JSON to CSV</strong>, paste the JSON or
          drop a .json file, switch to JSON &rarr; CSV and press{' '}
          <em>Convert</em>. The <strong>JSON to CSV converter</strong> accepts
          three shapes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>A JSON array to CSV.</strong> A top-level array of objects
            gives one row per object. An array of plain values becomes a
            single column named <em>value</em>.
          </li>
          <li>
            <strong>API response JSON to CSV.</strong> When the list is wrapped,
            as in <code>{'{"data": [...]}'}</code>, the first array of objects
            inside is used, so no hand-trimming.
          </li>
          <li>
            <strong>A single object.</strong> Anything else becomes one row.
          </li>
        </ul>
        <p>
          <strong>Nested JSON to CSV</strong> is where most converters get
          vague. With <em>Flatten nested objects</em> on (the default), the tool
          will <strong>flatten JSON to CSV</strong> using dot-path column names:{' '}
          <code>{'{"address": {"city": "Karachi"}}'}</code> becomes a column
          called <em>address.city</em>, and{' '}
          <code>{'{"tags": ["new", "vip"]}'}</code> becomes <em>tags.0</em> and{' '}
          <em>tags.1</em>. Turn flattening off and each nested value is kept
          as a JSON string in one cell.
        </p>
        <p>
          The header collects every key across all records in first-seen
          order, so a missing field leaves a blank cell rather than shifting
          columns. Values containing the delimiter, quotes or line breaks, or
          starting or ending with a space, are quoted. Lines end with a plain
          line feed.
        </p>
        <p>
          What JSON &rarr; CSV does not do: it will not explode a nested array
          into extra rows (one order with three items stays one row, with
          columns such as items.0.sku and items.1.sku), and it has no way to
          pick, sort or filter columns and rows. For that kind of reshaping,
          open the CSV in a spreadsheet afterwards. It also converts one file
          per press of <em>Convert</em>, so batches are done one at a time.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Getting an invalid JSON error when converting to CSV?</strong>{' '}
            The input must be one complete JSON document. Usual culprits: a
            trailing comma, single quotes, a partial copy, or JSON Lines (one
            object per line), which this tool does not read. To find the
            broken spot, use the{' '}
            <Link to="/tools/json-formatter" className={linkClass}>
              JSON formatter
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 4 */}
      <section id="types" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-6 h-6 text-orange-500 shrink-0" />
          4. CSV to JSON: Keep Leading Zeros, Type Numbers and Booleans
        </h3>
        <p>
          Everything in CSV is text, so a converter must decide what becomes a
          number. Guess too eagerly and ZIP codes lose digits. The exact rules
          with <em>Convert numbers/booleans</em> on:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Plain numbers</strong> such as 29 or 3.75 become JSON
            numbers, provided they are shorter than 16 characters.
          </li>
          <li>
            <strong>true, false, TRUE and FALSE</strong> become booleans;{' '}
            <strong>null and NULL</strong> become null.
          </li>
          <li>
            <strong>Values with leading zeros</strong>, such as 007 or 04210,
            stay strings, which is the whole answer to{' '}
            <strong>CSV to JSON keep leading zeros</strong>: no extra step.
          </li>
          <li>
            <strong>Long digit strings</strong> of 16 characters or more stay
            strings, so IDs are never silently rounded.
          </li>
          <li>
            <strong>Empty cells</strong> become an empty string.
          </li>
        </ul>
        <p>
          Want <strong>CSV to JSON numbers as strings</strong> everywhere?
          Untick the option and every value comes through exactly as written.
        </p>
      </section>

      {/* 5 */}
      <section id="delimiters" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Columns3 className="w-6 h-6 text-orange-500 shrink-0" />
          5. Semicolons, Tabs and the CSV That Opens in One Column
        </h3>
        <p>
          In many European locales Excel saves CSV with semicolons, because
          the comma is the decimal separator. Auto-detect handles{' '}
          <strong>semicolon CSV to JSON</strong> untouched, and{' '}
          <strong>TSV to JSON</strong> too: rows copied from a spreadsheet are
          tab-separated and paste straight in. If detection guesses wrong,
          pick the delimiter by hand.
        </p>
        <p>
          The reverse symptom, searched as &ldquo;<strong>CSV opens in one
          column Excel</strong>&rdquo;, is a delimiter mismatch. Going JSON
          &rarr; CSV, the <em>Delimiter</em> menu sets the output separator
          (Auto-detect means comma). Choose Semicolon for{' '}
          <strong>JSON to CSV with semicolon delimiter</strong> output that
          opens in columns under a European locale.
        </p>
      </section>

      {/* 6 */}
      <section id="excel-sheets" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sheet className="w-6 h-6 text-orange-500 shrink-0" />
          6. JSON to Excel, Google Sheets, and Excel to JSON
        </h3>
        <p>
          <strong>How to open JSON file in Excel</strong>: convert it to CSV
          here, then open the CSV. That is the practical route for{' '}
          <strong>JSON to Excel</strong>. The CSV has no byte order mark, so
          double-clicking can garble accented letters; import it through
          Excel&rsquo;s Data tab with UTF-8 selected, or make a real workbook
          with the{' '}
          <Link to="/tools/spreadsheet-converter" className={linkClass}>
            spreadsheet converter
          </Link>
          , which handles XLSX and ODS.
        </p>
        <p>
          For <strong>JSON to CSV Google Sheets</strong> imports, download
          data.csv and use File &rarr; Import.
        </p>
        <p>
          And <strong>how to convert Excel to JSON</strong>: save the sheet as
          CSV, then run it through CSV &rarr; JSON. Row one is always the
          header; blank header cells become col1, col2, and a duplicate name
          overwrites the earlier column, so rename duplicates first. Output is
          always a flat array; dotted headers stay literal key names.
        </p>
        <p>
          Working with other formats? XML goes through the{' '}
          <Link to="/tools/xml-json" className={linkClass}>
            XML to JSON converter
          </Link>
          , YAML through the{' '}
          <Link to="/tools/yaml-json" className={linkClass}>
            YAML to JSON converter
          </Link>
          , and SQL INSERT statements through the{' '}
          <Link to="/tools/sql-csv" className={linkClass}>
            SQL to CSV tool
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis CSV to JSON Converter
        </h3>
        <p>
          Plenty of pages offer <strong>JSON to CSV online</strong>. Few say
          what they do to your data. Here is ours.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Two directions, one page', 'CSV to JSON and JSON to CSV share one panel. Switch the Conversion menu and convert again.'],
            ['Typing rules you can predict', 'Numbers, booleans and nulls are typed; leading zeros and 16+ character IDs stay strings; one checkbox keeps everything as text.'],
            ['Nested data made readable', 'Nested objects and arrays flatten to columns like address.city and tags.0, or stay as JSON strings.'],
            ['Real CSV quoting', 'Commas, quotes and line breaks inside cells are handled, and semicolon, tab and pipe files are recognised.'],
            ['Your data stays private', 'Files are never stored on our servers and nothing is retained after your session.'],
            ['Never used for training', 'What you convert is never fed into training data. Free to use, with no sign-up.'],
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
          <Link to="/tools" className={linkClass}>
            free data and file tools
          </Link>{' '}
          built on the same terms. To compare two exports, use the{' '}
          <Link to="/tools/diff-checker" className={linkClass}>
            diff checker
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
              'Is this CSV to JSON converter free?',
              'Yes. It is CSV to JSON online free, with no account needed. Paste or drop your CSV, press Convert, then copy or download data.json.',
            ],
            [
              'Why did my ZIP codes or IDs lose their leading zeros elsewhere, and will they here?',
              'Many converters turn anything numeric-looking into a number, dropping leading zeros. Here, values starting with a zero followed by more digits stay strings, as do digit strings of 16 characters or more. To keep every value as text, untick Convert numbers/booleans.',
            ],
            [
              'How do I turn nested JSON into CSV columns?',
              'Choose JSON to CSV and leave Flatten nested objects on. A nested object becomes dot-path columns such as address.city, and an array becomes indexed columns such as tags.0 and tags.1. Arrays are not expanded into extra rows.',
            ],
            [
              'Why does it say Invalid JSON?',
              'The input must be one complete, valid JSON document, and the message includes the parser reason. Trailing commas, single quotes, truncated copies and JSON Lines files are the usual causes. The JSON formatter helps you find the exact spot.',
            ],
            [
              'Can it convert my API response JSON to CSV if the list is inside a data key?',
              'Yes. If the top level is an object that wraps an array of objects, such as a data or results key, the first such array is used automatically. Other top-level objects become a single row.',
            ],
            [
              'How do I use CSV to JSON output in React, Node or TypeScript code?',
              'The download is a standard JSON array of objects, one per row, keyed by your header names. Save data.json into your project and import it, or paste the copied text into JSON.parse. Turn off Pretty-print JSON for a single compact line that is easy to drop into a fixture or mock response.',
            ],
            [
              'Can I get an Excel XLSX file directly?',
              'Not from this tool, which outputs plain CSV. Import that CSV through the Excel Data tab with UTF-8 chosen, or convert it to XLSX with the spreadsheet converter.',
            ],
            [
              'My CSV has no header row. What happens?',
              'The first row is always read as the column names, so your first record would become the keys. Add a header line before converting. Also rename any duplicate column names, because a later column with the same name overwrites the earlier one.',
            ],
            [
              'Is it safe to convert customer or financial data?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training. You can also paste only the columns you need.',
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
          Converted and ready for the next step? Tidy the JSON with the{' '}
          <Link to="/tools/json-formatter" className={linkClass}>
            JSON formatter
          </Link>
          , encode a payload with the{' '}
          <Link to="/tools/base64-encoder-decoder" className={linkClass}>
            Base64 encoder and decoder
          </Link>
          , turn a report into a shareable document with the{' '}
          <Link to="/tools/xlsx-to-pdf" className={linkClass}>
            XLSX to PDF converter
          </Link>
          , or pull a table out of a PDF with the{' '}
          <Link to="/tools/pdf-excel" className={linkClass}>
            PDF to Excel converter
          </Link>
          . And if you would rather write conversions like this yourself, our
          free{' '}
          <Link to="/learn/python-development" className={linkClass}>
            Python development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>{' '}
          both cover the data-handling groundwork behind tools like this one.
        </p>
      </div>
    </article>
  );
}
