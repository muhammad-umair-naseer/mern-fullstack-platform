import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CaseUpper,
  Check,
  Database,
  HelpCircle,
  Layers,
  ListOrdered,
  Minimize2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the SQL Formatter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The before/after example is the tool's real output for its own sample
 *    query, so a visitor can check every claim against the panel above.
 *
 * 2. The formatter reflows text; it does not validate, pick a dialect or run
 *    anything. Those limits are stated plainly and routed to siblings where
 *    one exists (sql-csv, diff-checker, json-formatter, case-converter).
 *
 * 3. The two real edge cases of Minify (spaces inside quoted strings, # read
 *    as a comment) get their own warning, because that is the question behind
 *    "why does my formatter change my query".
 */
export default function SqlFormatterSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">SQL Formatter</span> and Beautifier: Format SQL, Pretty Print Long Queries and Minify Them Back to One Line
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A query copied out of a log as one endless line. A statement your
        ORM printed while you chased a bug. Both are readable again in
        seconds with a good <strong>SQL formatter</strong>. This guide
        shows how to <strong>format SQL</strong> with the free{' '}
        <strong>SQL beautifier</strong> above, what the <strong>SQL pretty
        print</strong> output actually looks like, how to go the other way
        with the <strong>SQL minifier</strong>, and, just as usefully, what a
        formatter can and cannot do for a query that is broken.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/sql-formatter.webp"
            alt="SQL formatter online free - a one-line SQL query beautified into indented clauses with uppercase keywords, ready to copy or download"
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
              One line in, one clause per line out. Choose the keyword case and
              the indent, then copy the result or save it as query.sql.
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
            ['#what-it-does', '1. What a SQL Formatter Does, With a Real Before and After'],
            ['#how-to-format', '2. How to Format a SQL Query in Four Steps'],
            ['#keyword-case', '3. Uppercase or Lowercase Keywords, Tabs or Spaces'],
            ['#minify', '4. How to Minify a SQL Query to a Single Line'],
            ['#messy-queries', '5. Reading an Unreadable One-Line or ORM Query'],
            ['#limits', '6. What It Will Not Do, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Use the Cortexis SQL Formatter'],
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
          1. What a SQL Formatter Does, With a Real Before and After
        </h3>
        <p>
          A SQL formatter re-lays out a query so its structure is visible:
          clauses on their own lines, conditions indented, keywords in one
          consistent case. Tables, columns, values and logic stay exactly as
          you wrote them.
        </p>
        <p>The tool&rsquo;s sample query, as most people receive it:</p>
        <pre className="not-prose my-4 p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
          {`select u.id, u.name, count(o.id) as orders, sum(o.total) as revenue from users u left join orders o on o.user_id = u.id where u.created_at >= '2026-01-01' and u.status in ('active','trial') group by u.id, u.name having sum(o.total) > 1000 order by revenue desc limit 50;`}
        </pre>
        <p>What Format produces with the default settings:</p>
        <pre className="not-prose my-4 p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs sm:text-sm overflow-x-auto">
          {`SELECT u.id,
  u.name,
  count(o.id) AS orders,
  sum(o.total) AS revenue
FROM users u
LEFT JOIN orders o
  ON o.user_id = u.id
WHERE u.created_at >= '2026-01-01'
  AND u.status IN('active', 'trial')
GROUP BY u.id, u.name
HAVING sum(o.total) > 1000
ORDER BY revenue DESC
LIMIT 50;`}
        </pre>
        <p>
          Each SELECT item gets its own line, so a missing column jumps out.
          Every major clause and JOIN starts a new line; AND, OR, ON, WHEN,
          THEN and ELSE are indented; subqueries opening with{' '}
          <code>(SELECT</code> and CASE blocks are indented inside their
          parent; and statements are separated by a blank line. That is what
          makes it useful to <strong>format SQL with joins and
          subqueries</strong>: the nesting you had to count brackets for
          becomes something you can see.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Format a SQL Query in Four Steps
        </h3>
        <p>
          If you are wondering <strong>how to format a SQL query</strong>{' '}
          without opening an editor or signing up for anything, this is the
          whole process with the <strong>SQL formatter online free</strong>{' '}
          tool at the top of the page.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Paste the query or drop a file.</strong> Paste into the
            SQL box, or drop a .sql or .txt file on the panel above it. A
            dropped file is read and formatted straight away, which makes this
            the quickest way to <strong>format a SQL file online</strong>.
          </li>
          <li>
            <strong>Pick the keyword case.</strong> UPPERCASE keywords is the
            default; lowercase keywords and Keep as typed are the other two
            choices.
          </li>
          <li>
            <strong>Pick the indent.</strong> 2 spaces, 4 spaces or Tab, to
            match the files already in your project.
          </li>
          <li>
            <strong>Format, then copy or download.</strong> Press Format. The
            Result panel shows the output with a Copy button and a Download
            button that saves it as <strong>query.sql</strong>.
          </li>
        </ol>
        <p>
          The same four steps serve a <strong>PostgreSQL query formatter</strong>,
          a <strong>MySQL query beautifier</strong> for statements lifted from
          a slow-query log or an admin panel, and a <strong>SQLite query
          formatter</strong> for app queries. One general ruleset covers all
          three, including backtick and square-bracket identifiers,{' '}
          <code>::</code> casts and <code>$$</code> bodies; there is no
          dialect menu.
        </p>
      </section>

      {/* 3 */}
      <section id="keyword-case" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CaseUpper className="w-6 h-6 text-orange-500 shrink-0" />
          3. Uppercase or Lowercase Keywords, Tabs or Spaces
        </h3>
        <p>
          The first rule in almost every <strong>SQL style guide</strong> is{' '}
          <strong>keyword case</strong>, and teams argue about it more than it
          deserves. SQL keywords are case-insensitive, as the{' '}
          <a
            href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            PostgreSQL documentation on lexical structure
          </a>{' '}
          states, so the choice is purely about reading. Uppercase makes the
          skeleton stand out from table and column names; lowercase is
          quieter.
        </p>
        <p>
          That is the whole answer to <strong>how to uppercase SQL
          keywords</strong>: choose UPPERCASE keywords and press Format.
          Prefer the other style? Choose lowercase keywords and the tool works
          as a <strong>SQL formatter with lowercase keywords</strong>. Keep as
          typed fixes only the layout. Function names such as count, and your
          table and column names, always keep the case you gave them.
        </p>
        <p>
          <strong>SQL indentation, tabs or spaces</strong>: match the rest of
          the repository. Need a <strong>SQL formatter with a 4 spaces
          indent</strong>? Choose 4 spaces. Settling both choices once lets you{' '}
          <strong>beautify SQL for code review</strong>: a pull request diff
          then shows changed logic, not reshuffled whitespace.
        </p>
      </section>

      {/* 4 */}
      <section id="minify" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Minimize2 className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Minify a SQL Query to a Single Line
        </h3>
        <p>
          Sometimes you need the opposite: a query that fits in a string
          literal, a config value or a log line. That is <strong>how to minify a SQL query</strong> here: paste
          it and press Minify instead of Format. It is the quickest way to{' '}
          <strong>convert multi-line SQL to a single line</strong>, and it also
          doubles as a way to <strong>remove comments from SQL</strong>,
          because both <code>--</code> and <code>{'/* */'}</code> comments are
          dropped. The download is named <strong>query.min.sql</strong>.
        </p>
        <p>This is the sample query after pressing Minify:</p>
        <pre className="not-prose my-4 p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
          {`select u.id,u.name,count(o.id)as orders,sum(o.total)as revenue from users u left join orders o on o.user_id = u.id where u.created_at >= '2026-01-01' and u.status in('active','trial')group by u.id,u.name having sum(o.total)> 1000 order by revenue desc limit 50;`}
        </pre>
        <p>
          Two things are worth noticing. Minify leaves keywords in the case
          you typed them, because the Keyword case setting applies to Format
          only; if you want uppercase keywords on a single line, press Format
          first, copy the result back into the SQL box, then press Minify.
          And spaces next to brackets and commas are removed, which is why{' '}
          <code>count(o.id)as orders</code> looks cramped. Databases read that
          the same way, but if a human will see the line, a formatted copy
          next to it saves them some squinting.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Two edge cases to know before you minify.</strong> Space
            collapsing also applies inside quoted strings, so a literal like
            &lsquo;a&nbsp;&nbsp;,&nbsp;&nbsp;b&rsquo; becomes &lsquo;a,b&rsquo;. If a
            string value depends on its exact spacing, keep the formatted
            version instead. And <code>#</code> is always read as a MySQL-style
            comment, so a PostgreSQL query that uses <code>#</code> as an
            operator will lose the rest of that line. Format keeps comments;
            Minify does not.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="messy-queries" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          5. Reading an Unreadable One-Line or ORM Query
        </h3>
        <p>
          The classic complaint: a <strong>SQL query, unreadable, one
          line</strong> of several hundred characters, usually{' '}
          <strong>ORM-generated SQL that is hard to read</strong>. Once it is formatted, this
          checklist finds most problems fast:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Count the JOIN lines.</strong> An unexpected extra join,
            a common cause of duplicated rows, is easy to spot.
          </li>
          <li>
            <strong>Read the WHERE block top to bottom.</strong> Each AND and
            OR sits on its own indented line. Check whether an OR needs
            brackets it does not have.
          </li>
          <li>
            <strong>Scan the SELECT list.</strong> One column per line shows
            what the ORM actually fetched.
          </li>
        </ul>
        <p>
          If your editor&rsquo;s <strong>SQL formatter is not working</strong>,
          paste the text here: it lays out whatever it is given rather than
          rejecting it. It is also a
          practical <strong>SQL formatter for data analysts</strong> who want
          reporting queries tidy before sharing them with colleagues.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          6. What It Will Not Do, and Where to Go Instead
        </h3>
        <p>
          Why does a SQL formatter change my query? Here, Format only changes
          whitespace and keyword case, so results are identical; the two
          Minify edge cases above are the exceptions. Just as important is
          what this tool does not attempt:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>It does not validate SQL.</strong> It lays out words,
            strings and symbols; it does not check grammar. A broken query
            comes out neatly indented and still broken, with no error or line
            number. Run it against your database to find the fault.
          </li>
          <li>
            <strong>It does not run, explain or optimise queries</strong> or
            connect to a database.
          </li>
          <li>
            <strong>It has no dialect selector, syntax highlighting, line-width
            limit, comma-first style or alias alignment.</strong> Commas inside
            a function call in the SELECT list also start a new line.
          </li>
          <li>
            <strong>It does not recase table or column names.</strong> For
            that, paste the names into the{' '}
            <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              case converter
            </Link>
            .
          </li>
          <li>
            <strong>Comparing two versions of a query?</strong> The{' '}
            <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              diff checker
            </Link>{' '}
            shows them side by side.
          </li>
          <li>
            <strong>Turning INSERT statements into a spreadsheet?</strong> The{' '}
            <Link to="/tools/sql-csv" className="text-orange-600 font-semibold underline hover:text-orange-700">
              SQL to CSV converter
            </Link>{' '}
            handles INSERT to CSV and back again.
          </li>
          <li>
            <strong>A JSON column or payload inside the query?</strong> Copy
            the value into the{' '}
            <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JSON formatter
            </Link>
            .
          </li>
          <li>
            <strong>SQL inside Python or Java strings</strong> is not
            unwrapped; copy the query out first. To percent-encode it, the{' '}
            <Link to="/tools/url-encoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
              URL encoder
            </Link>{' '}
            does that part.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis SQL Formatter
        </h3>
        <p>
          Choosing an <strong>online SQL beautifier</strong> or a{' '}
          <strong>SQL query formatter tool</strong> for everyday use? Here is
          what this one offers.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no account', 'No sign-up, no email, no daily limit. Paste, press Format and copy.'],
            ['Format and minify together', 'Beautify a query for reading or collapse it to one comment-free line for embedding, from the same box, with separate query.sql and query.min.sql downloads.'],
            ['Your queries stay private', 'Queries often hold table names, customer IDs or credentials. They are never stored on our servers and nothing is retained after your session.'],
            ['Never used for training', 'Your SQL is never used to train any model. A production query stays yours.'],
            ['Your style, not ours', 'UPPERCASE, lowercase or keep-as-typed keywords, with 2-space, 4-space or tab indentation, to match your team style guide.'],
            ['Honest about its limits', 'It reflows rather than validates, and says so. Where another job needs another tool, this page names it.'],
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
            free developer and document tools
          </Link>
          . Testing the pattern behind a LIKE or REGEXP
          filter? The{' '}
          <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
            regex tester
          </Link>{' '}
          shows matches as you type.
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
              'How do I format a SQL query for free?',
              'Paste the query into the SQL box at the top of this page or drop a .sql file on it, choose the keyword case and indent, and press Format. Copy the result or download it as query.sql. There is no account and no daily limit.',
            ],
            [
              'Why does a SQL formatter change my query, and does it change the results?',
              'No. Format changes only whitespace and the case of SQL keywords, and SQL keywords are case-insensitive, so the query returns the same results. Table names, column names, function names and string values are left as you typed them.',
            ],
            [
              'Will the formatter tell me if my SQL has an error?',
              'No. It lays out the text it is given without checking the grammar, so an invalid query comes out tidy but still invalid. Run the query against your database to see the error and its position.',
            ],
            [
              'Can I choose MySQL, PostgreSQL or SQL Server formatting?',
              'There is one general ruleset rather than a dialect menu. It understands backtick, double-quote and square-bracket identifiers, :: casts and $$ bodies, so everyday MySQL, PostgreSQL, SQLite and SQL Server queries format well. Features specific to one dialect are laid out by the same general rules.',
            ],
            [
              'How do I convert a multi-line SQL query to a single line?',
              'Paste it and press Minify. Comments are removed and spacing is collapsed, giving one line you can download as query.min.sql. Check string values with meaningful spacing, because spaces inside quotes are collapsed too.',
            ],
            [
              'Why did Minify remove part of my PostgreSQL query?',
              'The # character is always treated as the start of a MySQL-style comment, so anything after it on that line is dropped. If your query uses # as a PostgreSQL operator, use the formatted output instead of the minified one.',
            ],
            [
              'Is it safe to paste production queries here?',
              'Your SQL is never stored on our servers, nothing is retained after your session, and it is never used for training. That matters when a query contains table names, customer IDs or connection details.',
            ],
            [
              'Can it turn INSERT statements into a CSV file?',
              'Not this tool. The SQL to CSV converter turns INSERT statements into CSV rows and CSV back into INSERT statements. Format the query here first if you want to read it before converting.',
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
          Working with the data your queries return? Convert exports with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , reshape files with the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>
          , or sort and de-duplicate ID lists with the{' '}
          <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            line tools
          </Link>
          . And if you want to write the queries as well as tidy them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          are a good next step.
        </p>
      </div>
    </article>
  );
}
