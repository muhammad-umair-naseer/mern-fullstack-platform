import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  ListChecks,
  Regex,
  Replace,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Regex Tester tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool tests the JavaScript flavour only. That is stated up front and
 *    again in the limits section, with the PCRE and Python syntax that will
 *    fail here, so nobody debugs a PHP pattern against the wrong rules.
 *
 * 2. The problem-aware searches (only one match, multiline not working,
 *    greedy versus lazy, invalid regular expression) get a section of their
 *    own, because those are the questions a tester alone does not answer.
 *
 * 3. Limits are honest: no saving or sharing, no code generation, no
 *    step-by-step debugger, no d or v flags, and a runaway pattern on large
 *    text can hang the page. Sibling tools are named where one genuinely helps.
 */
export default function RegexTesterSeoArticle() {
  const code = 'px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-700 dark:text-orange-300 text-[0.9em] font-mono';
  const link = 'text-orange-600 font-semibold underline hover:text-orange-700';

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
        How to Use a <span className="text-orange-600 dark:text-orange-400">Regex Tester</span>: Live Matches, Capture Groups, Replace Previews and Plain-English Explanations
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A form that rejects a good email address. A log search that returns
        one line instead of forty. Each is a <strong>regex</strong> problem,
        and each is quicker to solve when you can see exactly what the pattern
        matches. This guide shows how to use
        the free <strong>regex tester</strong> above as a{' '}
        <strong>regular expression tester</strong>, a{' '}
        <strong>regex checker</strong> and a <strong>regex explainer</strong>{' '}
        in one screen, how to fix the usual reasons a{' '}
        <strong>regex is not working</strong>, and &mdash; honestly &mdash;
        what it does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/regex-tester.webp"
            alt="A hand writing notes beside printed text marked up with yellow and pink highlighters"
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
              Type a pattern, paste some text, and every match, group and
              replacement updates as you type.
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
            ['#what-is', '1. What a Regex Tester Is, and When You Need One'],
            ['#how-to-test', '2. How to Test a Regex in Four Steps'],
            ['#groups-replace', '3. Capture Groups, Named Groups and Regex Replace'],
            ['#not-working', '4. Regex Not Working? The Five Usual Causes'],
            ['#examples', '5. Worked Examples: Emails, Phones, Dates and Logs'],
            ['#limits', '6. What This Regex Checker Does Not Do'],
            ['#why-cortexis', '7. Why Use the Cortexis Regex Tester'],
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
      <section id="what-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Regex className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Regex Tester Is, and When You Need One
        </h3>
        <p>
          A regular expression, or <strong>regex</strong>, is a compact pattern
          that describes text: &ldquo;one or more digits&rdquo;, &ldquo;a word
          followed by an @ sign&rdquo;, &ldquo;anything between two square
          brackets&rdquo;. A pattern that is slightly wrong still runs &mdash; it just
          matches the wrong thing.
        </p>
        <p>
          A <strong>regular expression tester</strong> shows you the result straight away instead of
          after another edit-and-rerun cycle.
          This one is a <strong>javascript regex tester</strong>: it follows
          the JavaScript regular expression rules exactly, so what matches here
          is what matches in your front-end code and in Node. The rules are
          defined in the{' '}
          <a
            href="https://tc39.es/ecma262/"
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            ECMAScript language specification
          </a>
          , and the{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            MDN regular expressions guide
          </a>{' '}
          is the friendliest reference to them.
        </p>
        <p>
          Use it to write a new pattern, to check an inherited one, to learn
          (it suits <strong>regex for beginners</strong> because every token is
          explained), or for a quick <strong>regex replace online</strong>.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-test" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Test a Regex in Four Steps
        </h3>
        <p>
          Here is <strong>how to test a regex</strong> with the tool above, which opens
          with a working example filled in.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Type the pattern.</strong> Write it as you would between
            the two slashes of a regex literal. The{' '}
            <strong>regex cheat sheet</strong> underneath has 18 clickable
            tokens, from <code className={code}>{String.raw`\d`}</code> and{' '}
            <code className={code}>[^abc]</code> to named groups and
            lookbehind, which append themselves to your pattern.
          </li>
          <li>
            <strong>Pick the flags.</strong> Six checkboxes: g (global, on by
            default), i (ignore case), m (multiline), s (dotAll), u (unicode)
            and y (sticky). The d (indices) and v (unicodeSets) flags are not
            offered.
          </li>
          <li>
            <strong>Paste your test string.</strong> Use real samples, including a
            few values that should <em>not</em> match.
          </li>
          <li>
            <strong>Read the results.</strong> The{' '}
            <strong>regex match highlighter</strong> marks every match in
            yellow (an empty match shows as &empty;), the Matches panel gives
            the count and a table of each match, its index and its groups, and
            the Explanation panel describes the pattern token by token.
          </li>
        </ol>
        <p>
          Everything updates on every keystroke, so the fastest way to
          understand a pattern is to delete a piece and watch what changes.
        </p>
      </section>

      {/* 3 */}
      <section id="groups-replace" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Replace className="w-6 h-6 text-orange-500 shrink-0" />
          3. Capture Groups, Named Groups and Regex Replace
        </h3>
        <p>
          Wrap part of a pattern in parentheses and it
          becomes a capture group; that is the whole answer to{' '}
          <strong>how to use capture groups in regex</strong>. The Groups
          column lists them as <code className={code}>$1=</code>,{' '}
          <code className={code}>$2=</code> and so on; a group that did not
          take part shows a dash. Use <code className={code}>(?:...)</code> to
          group without capturing.
        </p>
        <p>
          Names are kinder than numbers. That is <strong>how to use named groups in javascript regex</strong>:
          write <code className={code}>{String.raw`(?<year>\d{4})`}</code> and
          the table shows <code className={code}>year=2026</code> alongside the
          numbered form. Refer back to it inside the same pattern with{' '}
          <code className={code}>{String.raw`\k<year>`}</code>.
        </p>
        <p>
          The Replace section shows{' '}
          <strong>how to replace with regex in javascript</strong> before you
          write any code. It behaves exactly like{' '}
          <code className={code}>String.replace</code> with the same flags:
        </p>
        <ul className="space-y-2">
          <li>
            <code className={code}>$1</code>, <code className={code}>$2</code>{' '}
            insert numbered groups, <code className={code}>{'$<name>'}</code>{' '}
            inserts a named one, and <code className={code}>{'$&'}</code>{' '}
            inserts the whole match.
          </li>
          <li>
            Without the g flag, only the <strong>first</strong> match is
            replaced, just as in code.
          </li>
          <li>
            The result can be copied, or downloaded as{' '}
            <strong>replaced.txt</strong>. To see exactly what changed, put the
            original and the result side by side in the{' '}
            <Link to="/tools/diff-checker" className={link}>
              diff checker
            </Link>
            .
          </li>
        </ul>
        <p>
          JavaScript replacements cannot change letter case the way{' '}
          <code className={code}>{String.raw`\U`}</code> does in other
          flavours; for that, run the output through the{' '}
          <Link to="/tools/case-converter" className={link}>
            case converter
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="not-working" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Regex Not Working? The Five Usual Causes
        </h3>
        <p>
          When a <strong>regex is not working</strong>, one small rule is
          usually doing something you did not expect.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>The regex only matches the first occurrence:</strong> This
            is the missing g flag. Without g (or y), a JavaScript regex stops
            after one match. Untick g in the tool and watch the count drop to
            one.
          </li>
          <li>
            <strong>Regex multiline not working:</strong> Without m,{' '}
            <code className={code}>^</code> and <code className={code}>$</code>{' '}
            match only the start and end of the whole text. Without s,
            the dot will not cross a newline. Tick m for per-line anchors, s
            for patterns that span lines.
          </li>
          <li>
            <strong>Regex greedy vs lazy:</strong>{' '}
            <code className={code}>{'<.*>'}</code> on{' '}
            <code className={code}>{'<b>hi</b>'}</code> matches the entire
            string, because <code className={code}>*</code> takes as much as it
            can. Add a question mark, <code className={code}>{'<.*?>'}</code>,
            and it matches each tag on its own. The explainer labels these
            &ldquo;(lazy)&rdquo;.
          </li>
          <li>
            <strong>Backslashes lost in a string:</strong> A pattern that works
            here may fail in{' '}
            <code className={code}>new RegExp(&quot;...&quot;)</code>: inside a string,{' '}
            <code className={code}>{String.raw`\d`}</code> must be written{' '}
            <code className={code}>{String.raw`\\d`}</code>.
          </li>
          <li>
            <strong>Invalid regular expression error in JavaScript:</strong> A
            message such as &ldquo;Unterminated group&rdquo; or &ldquo;Nothing
            to repeat&rdquo; means the pattern cannot be read. The tool shows that exact{' '}
            <strong>invalid regular expression error</strong> in red as you
            type, so the culprit is whatever you just added &mdash; often an
            unbalanced parenthesis.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Watch for runaway patterns.</strong> Nested quantifiers
            such as <code>(a+)+</code> can take an extremely long time on text
            that almost matches, a problem known as catastrophic backtracking.
            The tool does not warn about it, and on large text the page can
            stop responding, so test risky patterns on a short sample first.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="examples" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          5. Worked Examples: Emails, Phones, Dates and Logs
        </h3>
        <p>
          Starting points to paste in and adapt, not universal answers.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Email regex tester:</strong>{' '}
            <code className={code}>{String.raw`[\w.+-]+@[\w-]+\.[\w.-]+`}</code>{' '}
            finds everyday addresses; wrap it in <code className={code}>^</code>{' '}
            and <code className={code}>$</code> to validate. No short pattern
            accepts every legal address, so aim to catch typos and confirm by
            email.
          </li>
          <li>
            <strong>Phone number regex test:</strong>{' '}
            <code className={code}>{String.raw`\+?\d[\d\s-]{7,14}\d`}</code>{' '}
            allows an optional plus and spaces or hyphens. Paste the formats
            your users really type and adjust the range.
          </li>
          <li>
            <strong>Regex for date format dd/mm/yyyy:</strong>{' '}
            <code className={code}>{String.raw`^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$`}</code>{' '}
            checks the shape (tick m for one date per line). It still accepts
            31/02/2026, because a regex checks format, not the calendar, so
            confirm real dates in your own code. To turn dates into Unix
            timestamps or view them in another time zone, use the{' '}
            <Link to="/tools/timestamp-converter" className={link}>
              timestamp converter
            </Link>
            .
          </li>
          <li>
            <strong>Extract text between two strings with a regex:</strong>{' '}
            <code className={code}>{String.raw`START(.*?)END`}</code> captures
            the middle in group 1; tick s if it spans lines.{' '}
            <code className={code}>{String.raw`(?<=\[)[^\]]*(?=\])`}</code>{' '}
            matches only text inside square brackets &mdash; a quick{' '}
            <strong>regex lookbehind javascript</strong> check. Lookbehind is
            standard JavaScript and works here, both{' '}
            <code className={code}>{'(?<=...)'}</code> and{' '}
            <code className={code}>{'(?<!...)'}</code>.
          </li>
          <li>
            <strong>Regex tester for log files:</strong>{' '}
            <code className={code}>{String.raw`^(?<time>\S+ \S+) (?<level>ERROR|WARN) (?<msg>.*)$`}</code>{' '}
            with g and m pulls fields out of every matching line. Logs often hold customer
            details; pasted text is never stored on our servers.
          </li>
          <li>
            <strong>Regex unicode property escapes test:</strong>{' '}
            <code className={code}>{String.raw`\p{L}+`}</code> matches words
            in any script, where{' '}
            <code className={code}>{String.raw`\w`}</code> only knows unaccented
            Latin letters. It needs the u flag.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Regex Checker Does Not Do
        </h3>
        <p>
          Here is where this <strong>regex checker</strong> stops.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>JavaScript flavour only.</strong> PCRE, PHP, Python, Java,
            Go and .NET patterns are not emulated. Possessive quantifiers,
            atomic groups <code className={code}>{'(?>...)'}</code>, inline
            modifiers like <code className={code}>(?i)</code> and anchors such
            as <code className={code}>{String.raw`\A`}</code> or{' '}
            <code className={code}>{String.raw`\Z`}</code> will error or behave
            differently.
          </li>
          <li>
            <strong>No saving, sharing or code generation.</strong> No permalinks,
            no pattern library, and it cannot write code or build a regex from
            examples.
          </li>
          <li>
            <strong>No step-by-step debugger.</strong> No step counts, no d
            or v flags, and only each match&rsquo;s start index. The table lists
            the first 200 matches; the count covers all.
          </li>
          <li>
            <strong>Paste, not files.</strong> For line work on a whole file,
            such as removing duplicates or sorting,{' '}
            <Link to="/tools/line-tools" className={link}>
              line tools
            </Link>{' '}
            accepts a dropped text file.
          </li>
          <li>
            <strong>No test suites.</strong> Keep should-match and
            should-not-match lines in one test string, or compare outputs in
            the{' '}
            <Link to="/tools/diff-checker" className={link}>
              diff checker
            </Link>
            .
          </li>
        </ul>
        <p>
          The explainer is a helper, not a full parser, and ignores flags. If a
          pattern arrives URL-encoded or inside escaped JSON, decode it with the{' '}
          <Link to="/tools/url-encoder" className={link}>
            URL encoder
          </Link>{' '}
          or the{' '}
          <Link to="/tools/json-formatter" className={link}>
            JSON formatter
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Regex Tester
        </h3>
        <p>
          Plenty of pages offer a <strong>regex tester online free</strong>.
          Here is what this one does differently.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Exact JavaScript results', 'A match here is a match in your front-end code and in Node. No flavour switch to set wrongly.'],
            ['Everything on one screen', 'Highlighted matches, a group table with numbered and named captures, a replace preview and an explanation, all updating as you type.'],
            ['Explained in plain English', 'Every token is described in words, indented to show nesting.'],
            ['Your text stays private', 'Test strings and patterns are never stored on our servers and nothing is retained.'],
            ['Nothing is used for training', 'What you paste is never used to train any model.'],
            ['Free, no account', 'No sign-up, no email, no daily limit.'],
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
          <Link to="/tools" className={link}>
            free developer and document tools
          </Link>{' '}
          built on the same terms. If you have cleaned up a block of text with a
          replacement and want to know how long it is now, paste the result
          into the{' '}
          <Link to="/tools/word-counter" className={link}>
            word counter
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
              'How do I test a regex online for free?',
              'Type the pattern into the Pattern field of the tool at the top of this page, tick the flags you need and paste some sample text. Matches are highlighted as you type, with a group table and an explanation.',
            ],
            [
              'Why does my regex only match the first occurrence?',
              'The g (global) flag is missing. Without g or y, a JavaScript regex stops after the first match. Tick g in the tool, or add it after the closing slash in your code.',
            ],
            [
              'Why is my regex multiline not working?',
              'Without the m flag, ^ and $ match only the start and end of the whole text, not of each line. Without the s flag, the dot does not match a newline, so a pattern cannot run across lines. Tick m for per-line anchors and s for patterns that span lines.',
            ],
            [
              'What does this regex mean?',
              'Paste it into the Pattern field and read the Explanation panel, which describes each token in plain English and indents groups to show nesting. It is a helper rather than a full parser, so it ignores flags.',
            ],
            [
              'Does it support lookbehind and named groups?',
              'Yes. Lookbehind, both positive and negative, and named groups are part of the JavaScript standard and work here. Named groups appear in the Matches table as name=value and can be used in a replacement with $<name>.',
            ],
            [
              'Can I test PHP, Python or PCRE regex here?',
              'No. The tool follows JavaScript regex rules only, so syntax such as possessive quantifiers, atomic groups, inline modifiers like (?i) or the \\A and \\Z anchors will error or behave differently. For those, test in that language.',
            ],
            [
              'Is it safe to paste logs or customer data?',
              'Test strings and patterns are never stored on our servers, nothing is retained after your session, and none of it is used for training. As with any tool, paste only what you need: a few representative lines usually test a pattern as well as a whole log.',
            ],
            [
              'Can I save or share a pattern?',
              'Not from this tool; there are no permalinks and no saved library. Copy the pattern somewhere safe, and download the replace result as replaced.txt.',
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
          Tidy a
          query with the{' '}
          <Link to="/tools/sql-formatter" className={link}>
            SQL formatter
          </Link>
          , turn a spreadsheet export into structured data with the{' '}
          <Link to="/tools/csv-json" className={link}>
            CSV to JSON converter
          </Link>
          , or inspect a token with the{' '}
          <Link to="/tools/jwt-decoder" className={link}>
            JWT decoder
          </Link>
          . And if you would rather write patterns like these in real
          applications, our free{' '}
          <Link to="/learn/full-stack-web" className={link}>
            full-stack web development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/python-development" className={link}>
            Python development course
          </Link>{' '}
          cover the everyday code where patterns like these end up.
        </p>
      </div>
    </article>
  );
}
