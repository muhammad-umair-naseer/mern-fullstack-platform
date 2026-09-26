import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Database,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  ListOrdered,
  ShieldCheck,
  Sparkles,
  Table,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the CSV to SQL / SQL to CSV tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Show the actual output. The worked example is the tool's own sample
 *    converted for MySQL, PostgreSQL and SQL Server, so a reader can see the
 *    quoting, NULL, boolean and CREATE TABLE rules before pasting anything.
 *
 * 2. The rules that break imports (empty cells, leading zeros, apostrophes,
 *    booleans, batch size) get their own section, because that is what the
 *    problem-aware searches are really asking.
 *
 * 3. Limits are stated plainly: four preset table names, four dialects,
 *    INSERT only, first table only on the way back to CSV.
 */
export default function SqlCsvSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">CSV to SQL INSERT</span>, and SQL to CSV: Scripts That Import Cleanly, With Every Rule Shown
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A CRM export that has to land in a MySQL table on shared hosting. A
        backup full of INSERT statements that a manager wants in Excel. Both
        are the same job in one of two directions: <strong>CSV to SQL</strong>,
        or <strong>SQL to CSV</strong>. This guide shows how to generate{' '}
        <strong>CSV to SQL INSERT</strong> statements for MySQL, MariaDB,
        PostgreSQL, SQLite or SQL Server, what the script looks like, the rules
        that decide whether it imports first time, and how to pull rows back
        out of a dump.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/sql-csv.webp"
            alt="A card catalogue drawer pulled open to rows of index cards"
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
              Paste rows on one side, get a script on the other. Pick the
              dialect, and the quoting, NULLs and booleans follow it.
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
            ['#what-it-does', '1. CSV to SQL and SQL to CSV: What It Does, and When'],
            ['#how-to-convert', '2. How to Convert CSV to SQL INSERT Statements'],
            ['#worked-example', '3. A Worked Example Across Four Dialects'],
            ['#import-rules', '4. NULLs, Leading Zeros, Apostrophes: The Import Rules'],
            ['#batches', '5. Rows per INSERT, and When LOAD DATA Is Not Allowed'],
            ['#sql-to-csv', '6. SQL to CSV: Getting Rows Out of a Dump'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free CSV to SQL Converter'],
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
          <Database className="w-6 h-6 text-orange-500 shrink-0" />
          1. CSV to SQL and SQL to CSV: What It Does, and When
        </h3>
        <p>
          The <em>Conversion</em> menu picks the direction.{' '}
          <strong>CSV to SQL INSERT</strong> turns a header row plus data rows
          into <code>INSERT INTO</code> statements, optionally preceded by a{' '}
          <code>CREATE TABLE</code> typed from your data.{' '}
          <strong>SQL INSERT to CSV</strong> reads INSERT statements and gives
          you a file any spreadsheet opens.
        </p>
        <p>
          Reach for it when a bulk-import feature is unavailable or overkill:
          a hosted database with no file access, a fixture file for version
          control, or a <code>.sql</code> file when you needed a table. It is a <strong>sql insert statement generator from
          csv</strong>, not a database client: it never connects to your
          server, you run the script wherever you normally run SQL.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-orange-500 shrink-0" /> What it writes
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              INSERT statements, plus an optional CREATE TABLE, for MySQL and
              MariaDB, PostgreSQL, SQLite and SQL Server, from pasted text or a{' '}
              <code>.csv</code>, <code>.sql</code> or <code>.txt</code> file.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" /> What it does not
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No Oracle or DB2 output, and no UPDATE, DELETE, UPSERT or SELECT
              statements. The table name is one of four presets, and the CREATE
              TABLE has no primary key, NOT NULL or indexes.
            </p>
          </div>
        </div>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert CSV to SQL INSERT Statements
        </h3>
        <p>
          Here is <strong>how to convert csv to sql insert statements</strong>{' '}
          with the tool above. The panel starts with a small sample so you can
          see the output first.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the CSV.</strong> Paste it or drop a file onto the
            panel. The first row must be the header.
          </li>
          <li>
            <strong>Pick the dialect.</strong> <em>MySQL / MariaDB</em>,{' '}
            <em>PostgreSQL</em>, <em>SQLite</em> or <em>SQL Server</em>.
          </li>
          <li>
            <strong>Set the table and batch size.</strong> Choose a table name
            from <code>my_table</code>, <code>data</code>, <code>records</code>{' '}
            or <code>import</code>, choose 1, 100 or 1000 rows per INSERT, and
            leave <em>Include CREATE TABLE</em> ticked if the table does not
            exist yet.
          </li>
          <li>
            <strong>Convert, then copy or download.</strong> Press{' '}
            <em>Convert</em>; <em>Download</em> saves the script as{' '}
            <strong>inserts.sql</strong>.
          </li>
        </ol>
        <p>
          If your real table has another name, find-and-replace it afterwards.
          The delimiter is detected for you, so a <strong>semicolon delimited csv to
          sql</strong> job from a European-locale Excel is picked up automatically,
          and so does <strong>tab separated values to sql insert</strong>{' '}
          straight from a spreadsheet copy; comma and pipe are detected too.
          Quoted fields and line breaks inside cells follow{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4180"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            RFC 4180
          </a>
          .
        </p>
        <p>
          Wondering <strong>how to generate insert statements from Excel</strong>?
          Save the sheet as CSV first. If you only have the <code>.xlsx</code>{' '}
          or <code>.ods</code> file, the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>{' '}
          turns it into CSV, which you can then paste here.
        </p>
      </section>

      {/* 3 */}
      <section id="worked-example" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-6 h-6 text-orange-500 shrink-0" />
          3. A Worked Example Across Four Dialects
        </h3>
        <p>
          The built-in sample includes a name with both an apostrophe and a
          comma:
        </p>
        <pre className="not-prose text-sm bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto">
{`id,name,score,active
1,Ayesha,91.5,true
2,"O'Neil, Bilal",78,false`}
        </pre>
        <p>
          As <strong>csv to mysql insert online</strong> output, the same
          script you would use for <strong>csv to mariadb insert</strong>, it
          becomes:
        </p>
        <pre className="not-prose text-sm bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto">
{`CREATE TABLE \`my_table\` (
  \`id\` INTEGER,
  \`name\` VARCHAR(32),
  \`score\` DOUBLE PRECISION,
  \`active\` BOOLEAN
);
INSERT INTO \`my_table\` (\`id\`, \`name\`, \`score\`, \`active\`) VALUES
  (1, 'Ayesha', 91.5, TRUE),
  (2, 'O''Neil, Bilal', 78, FALSE);`}
        </pre>
        <p>
          For <strong>csv to postgresql insert statements</strong>, and for
          SQLite, the only change is double-quoted names. SQL Server gives a{' '}
          <strong>csv to sql server insert script</strong> with bracketed
          names and T-SQL types and booleans:
        </p>
        <pre className="not-prose text-sm bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto">
{`CREATE TABLE [my_table] (
  [id] INTEGER,
  [name] VARCHAR(32),
  [score] FLOAT,
  [active] BIT
);
INSERT INTO [my_table] ([id], [name], [score], [active]) VALUES
  (1, 'Ayesha', 91.5, 1),
  (2, 'O''Neil, Bilal', 78, 0);`}
        </pre>
        <p>
          Because <code>score</code> mixes whole and decimal numbers, it gets a
          decimal type: the <strong>csv to create table sql generator</strong>{' '}
          logic in miniature.
        </p>
      </section>

      {/* 4 */}
      <section id="import-rules" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          4. NULLs, Leading Zeros, Apostrophes: The Import Rules
        </h3>
        <p>
          Most failed imports come down to a handful of awkward values. These
          are the exact rules the converter follows.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Apostrophes are escaped.</strong> The classic{' '}
            <strong>sql insert apostrophe error single quote in string</strong>{' '}
            comes from a value like O&rsquo;Neil closing the string early. Every
            text value is wrapped in single quotes and any apostrophe inside is
            doubled: <code>{"'O''Neil'"}</code>, which all four dialects accept.
          </li>
          <li>
            <strong>Empty cells become NULL.</strong> If your{' '}
            <strong>csv import empty values not null mysql</strong> problem is
            blanks arriving as empty strings or zeros, this fixes it: an empty
            cell, or the literal text <code>null</code> or <code>NULL</code>, is
            written as SQL <code>NULL</code>.
          </li>
          <li>
            <strong>Leading zeros are kept.</strong> The{' '}
            <strong>leading zeros lost csv import sql</strong> headache happens
            when <code>007</code> or a postal code is treated as a number. Here a
            value with a leading zero stays quoted text, as does a very long
            digit string, so nothing is rounded or trimmed.
          </li>
          <li>
            <strong>Booleans follow the dialect.</strong> <code>true</code>/
            <code>TRUE</code> and <code>false</code>/<code>FALSE</code> become{' '}
            <code>TRUE</code> and <code>FALSE</code>, or <code>1</code> and{' '}
            <code>0</code> on SQL Server, which has no boolean literal.
          </li>
          <li>
            <strong>CREATE TABLE types come from the data.</strong> A column of
            whole numbers is INTEGER; any decimals make it DOUBLE PRECISION
            (FLOAT on SQL Server); all true/false values make it BOOLEAN (BIT on
            SQL Server). Everything else is VARCHAR sized from the longest
            value, between 32 and 255, or TEXT when a value runs past 255
            characters.
          </li>
        </ul>
        <p>
          One more case worth knowing: a column that mixes numbers and text,
          say mostly numeric codes with the odd <code>N/A</code>, gets a
          VARCHAR in the CREATE TABLE, but its numeric-looking values are
          still written unquoted in the INSERTs. Most databases accept that,
          but if yours is strict about types, replace placeholder text such as{' '}
          <code>N/A</code> with an empty cell before converting, so it becomes
          NULL and the column keeps a numeric type.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Check the inferred types before running.</strong> They are
            sized from the rows you pasted, so if longer values are coming
            later, widen the VARCHAR or switch it to TEXT first.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="batches" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          5. Rows per INSERT, and When LOAD DATA Is Not Allowed
        </h3>
        <p>
          <em>Rows per INSERT</em> controls how many rows share one{' '}
          <code>VALUES</code> list. <strong>1</strong> gives one statement per
          row, slowest to run but easiest to debug. <strong>100</strong>, the
          default, turns a large CSV into{' '}
          <strong>bulk insert statements with multiple rows</strong> each,
          the sensible choice for most imports. <strong>1000</strong> means
          fewer, larger statements.
        </p>
        <p>
          The 1000 setting matters for SQL Server. If you have hit the{' '}
          <strong>sql server insert values more than 1000 rows error</strong>,
          that is a documented limit on the{' '}
          <a
            href="https://learn.microsoft.com/en-us/sql/t-sql/queries/table-value-constructor-transact-sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Transact-SQL table value constructor
          </a>
          , which accepts at most 1000 rows per VALUES list. All three batch
          sizes stay within it.
        </p>
        <p>
          This also answers{' '}
          <strong>how to import csv into mysql without load data infile</strong>:
          when a host says <strong>load data infile not allowed</strong>, plain
          INSERTs still work. For <strong>csv to sql for phpMyAdmin</strong>,
          use the Import tab, or paste smaller scripts into the SQL tab. For{' '}
          <strong>how to import csv into sqlite</strong>, choose the SQLite
          dialect and run the file with the <code>sqlite3</code> command line. And for{' '}
          <strong>csv to sql seed data</strong>, the downloaded{' '}
          <code>inserts.sql</code> drops straight into a fixtures folder, and
          the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>{' '}
          will lay it out to your team&rsquo;s style.
        </p>
      </section>

      {/* 6 */}
      <section id="sql-to-csv" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-orange-500 shrink-0" />
          6. SQL to CSV: Getting Rows Out of a Dump
        </h3>
        <p>
          Set <em>Conversion</em> to <strong>SQL INSERT to CSV</strong> and the
          tool becomes a <strong>sql insert to csv converter</strong>. It reads
          every <code>INSERT INTO table (columns) VALUES (...)</code> statement,
          including multi-row VALUES lists, and merges repeated INSERTs for the
          same table. Name quoting is removed, escaped apostrophes are
          restored and NULL becomes an empty cell. The result downloads as{' '}
          <strong>rows.csv</strong>.
        </p>
        <p>
          That covers <strong>how to extract data from sql dump to csv</strong>{' '}
          without restoring the backup, and answers <strong>how to open sql file in Excel</strong>: Excel cannot read
          INSERT statements, but it opens the CSV this produces. A{' '}
          <strong>mysqldump insert to csv</strong> job works because mysqldump
          writes exactly this kind of multi-row INSERT.
        </p>
        <p>Know the limits before you start:</p>
        <ul className="space-y-2">
          <li>
            <strong>First table only.</strong> A dump with several tables
            exports the first one found; paste another table&rsquo;s INSERTs
            on their own to get it.
          </li>
          <li>
            <strong>INSERT statements only.</strong> PostgreSQL&rsquo;s{' '}
            <code>COPY ... FROM stdin</code> blocks, CREATE TABLE definitions
            and query result printouts are not read.
          </li>
          <li>
            <strong>No column list, generic headers.</strong> Without a column
            list in the INSERT, headers are named <code>col1</code>,{' '}
            <code>col2</code> and so on; rename them in your spreadsheet.
          </li>
          <li>
            <strong>Comma-separated output only.</strong> The CSV always uses
            commas, quoting a value only when it needs it. There is no
            semicolon or tab option; if your spreadsheet expects semicolons,
            use its import dialog and choose comma as the separator.
          </li>
          <li>
            <strong>Escapes.</strong> Doubled apostrophes (<code>{"''"}</code>) and
            backslash apostrophes (<code>{"\\'"}</code>) are turned back into a
            single apostrophe. Other backslash sequences, such as an escaped
            line break, are left as written, so check long text columns.
          </li>
        </ul>
        <p>
          Need JSON instead? Take the CSV to the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , then the{' '}
          <Link to="/tools/xml-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            XML converter
          </Link>{' '}
          and{' '}
          <Link to="/tools/yaml-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            YAML converter
          </Link>{' '}
          if needed. To compare two exports, use the{' '}
          <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            diff checker
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free CSV to SQL Converter
        </h3>
        <p>
          Plenty of pages offer a <strong>csv to sql converter online
          free</strong>. Few tell you what the script will contain. Here is
          what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card and no paid tier. The tool on this page is the whole product.'],
            ['Rules you can predict', 'NULLs, apostrophes, leading zeros and booleans follow the published rules above, so the script holds no surprises.'],
            ['Four dialects, done properly', 'MySQL and MariaDB, PostgreSQL, SQLite and SQL Server each get their own identifier quoting, boolean style and CREATE TABLE types.'],
            ['Both directions in one place', 'CSV to SQL and SQL to CSV share one panel, so a round trip from dump to spreadsheet and back is quick.'],
            ['Your data stays private', 'Customer lists and database dumps are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'What you paste is never used to train anything. Your records stay yours.'],
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
            free data and document tools
          </Link>{' '}
          on the same terms, from the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          to the{' '}
          <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            line tools
          </Link>{' '}
          for tidying a column of values.
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
              'How do I convert a CSV to SQL INSERT statements for free?',
              'Paste the CSV or drop the file onto the tool above, choose the dialect, table name and rows per INSERT, and press Convert. Copy the script or download it as inserts.sql, with no account needed.',
            ],
            [
              'Can I type my own table name?',
              'No. The menu offers my_table, data, records or import. Pick one, then find-and-replace it with your real table name before running the script.',
            ],
            [
              'Which databases does the generated SQL work with?',
              'MySQL and MariaDB, PostgreSQL, SQLite and SQL Server, each with its own quoting and boolean style. It does not write Oracle or DB2 scripts, and it produces INSERT and CREATE TABLE statements only.',
            ],
            [
              'Why do empty cells become NULL instead of empty strings?',
              'A blank spreadsheet cell usually means a missing value, and NULL is how SQL records one. If a column needs empty strings, edit those values in the script afterwards.',
            ],
            [
              'Will zip codes and IDs like 007 keep their leading zeros?',
              'Yes. Any value with a leading zero, and any very long string of digits, is written as quoted text, so nothing is stripped or rounded.',
            ],
            [
              'Can it read an Excel file directly?',
              'No, it reads CSV, pasted text, and .sql or .txt files. Save the workbook as CSV from Excel, or convert an .xlsx or .ods file with the spreadsheet converter, then paste the result here.',
            ],
            [
              'My SQL dump has several tables. Can I export them all to CSV?',
              'Only the first table found is exported, and the status line says how many were detected. For another table, paste only its INSERT statements and convert again.',
            ],
            [
              'How do I make bulk INSERT statements with multiple rows from a CSV?',
              'Set Rows per INSERT to 100 or 1000 and convert. Each INSERT then carries that many rows in one VALUES list, which runs much faster than one statement per row. Choose 1 only when you need to find which row a database is rejecting.',
            ],
            [
              'Can I convert CSV to SQL privately? Is it safe for customer data?',
              'Your data is never stored on our servers, never retained after your session and never used for training. The downloaded script holds your data in plain text, so keep it where the original export belongs.',
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
          Script ready? Tidy it with the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>
          , turn a workbook into the CSV this tool needs with the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>
          , or send the same rows to an API as JSON with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          . To script imports yourself, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          both cover working with SQL databases.
        </p>
      </div>
    </article>
  );
}
