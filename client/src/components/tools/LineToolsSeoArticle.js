import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  ListChecks,
  ListFilter,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Line Tools page.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. It defines what counts as a duplicate (case, surrounding spaces, blank
 *    lines, first versus last copy), because that is where other pages leave
 *    people with surprising results.
 *
 * 2. The three sorts are shown side by side on one small list, so "10 before
 *    2" is answered with an example rather than a description.
 *
 * 3. Actions do not chain, and the page says so, with recipes. Comparing two
 *    lists, pattern filtering and column work are routed to the sibling tools.
 */
export default function LineToolsSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Remove Duplicate Lines</span> and Sort Lines Alphabetically: Clean Any List in Seconds
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A mailing list pasted together from three exports. A keyword sheet
        where one phrase appears with different capitals. A column of URLs
        full of blank rows. The job is the same: every entry once, in a
        sensible order, without opening a spreadsheet. This guide shows how to{' '}
        <strong>remove duplicate lines</strong>,{' '}
        <strong>remove duplicates from a list</strong> and{' '}
        <strong>sort lines alphabetically</strong> with a free{' '}
        <strong>duplicate line remover</strong>, explains exactly what counts
        as a duplicate, and names the jobs another tool does better.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/line-tools.webp"
            alt="Remove duplicate lines online free - a messy list of emails, keywords and URLs cleaned into unique lines sorted alphabetically"
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
              Paste a list, press one button, copy the result. Fourteen
              one-click actions for deduping, sorting and tidying lines.
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
            ['#what-counts', '1. What Counts as a Duplicate Line'],
            ['#how-to-remove', '2. How to Remove Duplicate Lines in a Text File'],
            ['#sorting', '3. Sort Lines Alphabetically, Naturally or by Number'],
            ['#not-removed', '4. Why Duplicate Lines Were Not Removed'],
            ['#other-actions', '5. Shuffle, Reverse, Number, Join and Count'],
            ['#real-lists', '6. Emails, Keywords, URLs, and What It Cannot Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Duplicate Line Remover'],
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
      <section id="what-counts" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Counts as a Duplicate Line
        </h3>
        <p>
          Many pages that <strong>remove duplicate lines</strong> never say
          what &ldquo;duplicate&rdquo; means, which is why the results so
          often surprise people. Here it is decided by three checkboxes above
          the buttons, and all three start switched on.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Case-insensitive', 'Apple, apple and APPLE count as the same line. Switch it off when capitals carry meaning, as in product codes.'],
            ['Trim whitespace first', 'Spaces and tabs at the start and end of each line are ignored, so "date" and "  date  " match. Switch it off to keep indentation.'],
            ['Keep first occurrence', 'When a line repeats, the first copy stays in its original position. Untick it to keep the last copy instead, useful when later entries are newer.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <Check className="w-5 h-5 text-orange-500 shrink-0" /> {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Matching is always of whole lines, after those rules apply. Blank
          lines count too, so several empty rows collapse into one; press{' '}
          <em>Remove empty lines</em> if you want none. Removing duplicates
          never sorts your list.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-remove" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Remove Duplicate Lines in a Text File
        </h3>
        <p>
          Here is <strong>how to remove duplicate lines in a text file</strong>{' '}
          or a pasted block: the quickest way to <strong>remove duplicate lines online free</strong>.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your text.</strong> Paste it into the box, or drop a{' '}
            <strong>.txt</strong>, <strong>.csv</strong> or <strong>.md</strong>{' '}
            file onto the panel. Windows and Unix line endings both work.
          </li>
          <li>
            <strong>Check the three options.</strong> The defaults (ignore
            case, trim spaces, keep the first copy) suit most lists.
          </li>
          <li>
            <strong>Press Remove duplicates.</strong> The cleaned list appears
            in the Result pane with a note such as &ldquo;3 duplicate line(s)
            removed.&rdquo;
          </li>
          <li>
            <strong>Copy or download.</strong> Use Copy to paste it elsewhere,
            or Download to save it as <strong>lines.txt</strong>.
          </li>
        </ol>
        <p>
          A one-column CSV works the same way, an easy route to{' '}
          <strong>unique lines from a CSV file</strong>. With several columns,
          rows match only when every field matches; see section 6.
        </p>
      </section>

      {/* 3 */}
      <section id="sorting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowDownAZ className="w-6 h-6 text-orange-500 shrink-0" />
          3. Sort Lines Alphabetically, Naturally or by Number
        </h3>
        <p>
          If you are wondering <strong>how to sort a list alphabetically</strong>{' '}
          without Excel or Word, paste it and press <em>Sort A &rarr; Z</em>,
          or <em>Sort Z &rarr; A</em> for the reverse. That is all it takes to{' '}
          <strong>alphabetize a list online</strong>. The comparison respects
          accented letters and, with case-insensitive on, treats capitals and
          lower case alike. But this <strong>sort text lines online</strong>{' '}
          tool offers five orderings, because alphabetical order is not always
          what you mean. Take four lines, <em>10</em>, <em>9</em>, <em>100</em>{' '}
          and <em>apple</em>:
        </p>
        <div className="overflow-x-auto not-prose my-6">
          <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
              <tr>
                <th className="p-3 text-left">Button</th>
                <th className="p-3 text-left">Result</th>
                <th className="p-3 text-left">Use it for</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-semibold">Sort A &rarr; Z</td>
                <td className="p-3">10, 100, 9, apple</td>
                <td className="p-3">Names, words, plain text</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-semibold">Natural sort</td>
                <td className="p-3">9, 10, 100, apple</td>
                <td className="p-3">Filenames, versions, chapters</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-semibold">Numeric sort</td>
                <td className="p-3">apple, 9, 10, 100</td>
                <td className="p-3">Lines that start with a number</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-semibold">Sort Z &rarr; A</td>
                <td className="p-3">apple, 9, 100, 10</td>
                <td className="p-3">Reverse alphabetical lists</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-semibold">Sort by length</td>
                <td className="p-3">9, 10, 100, apple</td>
                <td className="p-3">Grouping short and long entries</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          That first row is the <strong>sort numbers 10 before 2 problem</strong>:
          alphabetical order compares character by character. <em>Natural sort</em>{' '}
          reads runs of digits as whole numbers, so it is the one to use to{' '}
          <strong>natural sort filenames online</strong>: file2 lands before
          file10. <em>Numeric sort</em> reads only the number at the start of
          each line, including decimals and negatives; a line that does not
          begin with a number counts as zero, which is why apple jumps to the
          top.
        </p>
        <p>
          Finally, <em>Sort by length</em> lets you{' '}
          <strong>sort lines by length</strong>, shortest first, with ties
          broken alphabetically: handy for separating short and long-tail
          keywords.
        </p>
      </section>

      {/* 4 */}
      <section id="not-removed" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Why Duplicate Lines Were Not Removed
        </h3>
        <p>
          Two lines look the same but both survive? There are three common
          causes, and each has a fix here.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Capitals differ.</strong> If you need to{' '}
            <strong>remove duplicates, ignore case</strong> differences and
            leave the Case-insensitive box ticked. It is on by default here,
            so there is nothing to remember to switch on.
          </li>
          <li>
            <strong>Hidden spaces.</strong> The case of{' '}
            <strong>duplicate lines not removed because of trailing spaces</strong>{' '}
            is the most common one of all: a space or tab at the end of one copy
            makes it a different line. Trim whitespace first handles this, and{' '}
            <em>Trim lines</em> on its own cleans every line whatever the
            checkbox says.
          </li>
          <li>
            <strong>The wrong copy was kept.</strong> Duplicates were removed,
            but you wanted the newest entry. For{' '}
            <strong>keep last occurrence, remove duplicates</strong> with the
            Keep first occurrence box unticked; each surviving line then sits
            where its last copy was.
          </li>
        </ul>
        <p>
          Used to doing this with a text editor plugin or a macro? This page
          gives the same result, and the three switches make the matching
          rules visible instead of buried in a settings menu.
        </p>
      </section>

      {/* 5 */}
      <section id="other-actions" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-orange-500 shrink-0" />
          5. Shuffle, Reverse, Number, Join and Count
        </h3>
        <p>
          The other buttons cover the jobs that usually send people to a
          spreadsheet.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Shuffle.</strong> Use it to{' '}
            <strong>randomize list order online</strong>, whether you need to{' '}
            <strong>shuffle a list of names for a random order</strong> of
            presentations or a prize draw. Press again for a new order.
          </li>
          <li>
            <strong>Reverse order.</strong> The answer to{' '}
            <strong>how to reverse the order of lines</strong>: the last line
            comes first, flipping a log without sorting it.
          </li>
          <li>
            <strong>Number lines.</strong> The easy way to{' '}
            <strong>add line numbers to text online</strong>: each line gets
            &ldquo;1. &rdquo;, &ldquo;2. &rdquo; and so on, padded so the
            numbers stay aligned past line 9.
          </li>
          <li>
            <strong>Add prefix/suffix.</strong> Type text into the Prefix and
            Suffix fields to <strong>add a prefix and suffix to each line</strong>:
            quotes around every value, a domain in front of every path, a comma
            after every entry.
          </li>
          <li>
            <strong>Remove empty lines.</strong> Deletes blank and
            whitespace-only rows when you just need to{' '}
            <strong>remove empty lines online</strong>.
          </li>
          <li>
            <strong>Join with commas.</strong> Here is{' '}
            <strong>how to convert a list to comma separated</strong> text: the
            non-empty lines become one line, separated by a comma and a space.
          </li>
          <li>
            <strong>Count occurrences.</strong> This is{' '}
            <strong>how to count duplicate lines</strong>: each distinct line is
            listed once after a count and a tab, most frequent first. With
            case-insensitive on, lines are shown in lower case.
          </li>
        </ul>
        <p>
          Developers will recognise this as{' '}
          <code>sort | uniq -c</code>, so this page doubles as{' '}
          <strong>Linux sort uniq online</strong>. One difference is worth
          knowing: as the{' '}
          <a
            href="https://www.gnu.org/software/coreutils/manual/html_node/uniq-invocation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GNU uniq manual
          </a>{' '}
          explains, <code>uniq</code> only merges adjacent repeats, so it
          needs <code>sort</code> first. Remove duplicates finds repeats
          anywhere in the list, with no sorting step.
        </p>
      </section>

      {/* 6 */}
      <section id="real-lists" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. Emails, Keywords, URLs, and What It Cannot Do
        </h3>
        <p>
          To <strong>remove duplicate emails from a list</strong> before an
          import, keep case-insensitive on, since in practice mailbox providers
          generally treat capitals in addresses as the same. To{' '}
          <strong>remove duplicate keywords from a list</strong>, the defaults
          are right too. To{' '}
          <strong>remove duplicate URLs from a list</strong>, think before
          ignoring case, because URL paths can be case-sensitive;
          untick the box if both versions should stay.
        </p>
        <p>
          Each button starts from the input box, not the previous result. To
          dedupe then sort, press Remove duplicates, copy the result back into
          the box, then press a sort. Here is what the tool does not do, and
          where to go instead.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Compare two lists</strong> to find lines in one but not the
            other: use the{' '}
            <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              diff checker
            </Link>
            .
          </li>
          <li>
            <strong>Filter by keyword or pattern</strong>, or find and replace
            inside lines: build and test the pattern in the{' '}
            <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
              regex tester
            </Link>
            .
          </li>
          <li>
            <strong>Sort or dedupe by one column</strong> of a CSV: this tool
            works on whole lines, so use the{' '}
            <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
              CSV to JSON converter
            </Link>{' '}
            or the{' '}
            <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              spreadsheet converter
            </Link>{' '}
            for column work.
          </li>
          <li>
            <strong>Open Excel, Word or PDF files</strong>: only .txt, .csv
            and .md can be dropped in. Copying a column or a block of text
            and pasting it into the box works fine. To turn a whole workbook
            into CSV, use the{' '}
            <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              spreadsheet converter
            </Link>
            ; to get plain text out of a PDF, use the{' '}
            <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to TXT converter
            </Link>
            .
          </li>
          <li>
            <strong>Change capitalisation</strong>: case-insensitive only
            affects matching; the{' '}
            <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              case converter
            </Link>{' '}
            makes text upper, lower or title case.
          </li>
          <li>
            <strong>Count words or characters</strong>: Count occurrences
            counts repeated lines, so use the{' '}
            <Link to="/tools/word-counter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              word counter
            </Link>
            .
          </li>
          <li>
            <strong>Not covered anywhere yet</strong>: other join delimiters,
            splitting a comma list into lines, repeated words inside a line,
            and a separate list of the removed duplicates.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Duplicate Line Remover
        </h3>
        <p>
          Plenty of pages offer a box and a button. Here is what this one
          does differently.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no daily limit. The tool at the top of this page is the whole product.'],
            ['Clear matching rules', 'Case, surrounding spaces and first-or-last copy are three visible switches, so you always know why a line stayed or went.'],
            ['Fourteen actions on one page', 'Dedupe, five sorts, shuffle, reverse, numbering, prefix and suffix, trim, count and join, without hopping between sites.'],
            ['Your lists stay private', 'Customer emails and internal logs are never stored on our servers, and nothing is retained once you close the page.'],
            ['Nothing is used for training', 'Your text is never used to train any model. A mailing list stays yours by policy.'],
            ['Honest about limits', 'Where another tool does the job better, such as comparing two lists, this page says so and links straight to it.'],
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
            free text and file tools
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
              'How do I remove duplicate lines from a list for free?',
              'Paste the list into the tool at the top of this page, or drop a .txt, .csv or .md file on it, and press Remove duplicates. Copy the result or download it as lines.txt; there is no account and no daily cap.',
            ],
            [
              'Does removing duplicates change the order of my list?',
              'No. Each surviving line stays in the position of the copy that was kept, the first one by default or the last one if you untick Keep first occurrence. To sort as well, copy the result back into the box and press a sort button.',
            ],
            [
              'Why does sorting put 10 before 2?',
              'Alphabetical sorting compares text one character at a time, and the character 1 comes before 2. Use Natural sort to read numbers inside lines as whole numbers, or Numeric sort when each line begins with a number.',
            ],
            [
              'Is the duplicate check case-sensitive?',
              'Not by default. Case-insensitive is ticked when the page opens, so Apple and apple count as one line. Untick it when capitals matter.',
            ],
            [
              'How do I see how many times each line appears?',
              'Press Count occurrences. Every distinct line is listed once with its count, most frequent first, much like sort | uniq -c.',
            ],
            [
              'Can I compare two lists and find what is missing?',
              'Not with this tool; it works on one list at a time. Paste both lists into the diff checker to see which lines appear in one but not the other.',
            ],
            [
              'Can I remove duplicates based on one column of a CSV?',
              'No. Each row is compared as a whole line, so it works well for a one-column CSV but not for matching on a single field. For column work, use the CSV to JSON converter or the spreadsheet converter.',
            ],
            [
              'Is it safe to paste a customer email list here?',
              'Your text is never stored on our servers, nothing is retained after you close the page, and it is never used for training. The cleaned list you copy or download is yours alone.',
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
          <ListFilter className="inline w-4 h-4 text-orange-500 mr-1.5 align-[-2px]" />
          List clean and ready for the next step? Turn it into structured data
          with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , tidy the result with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , or encode a list of links safely with the{' '}
          <Link to="/tools/url-encoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            URL encoder
          </Link>
          . And if you would like to write list-cleaning scripts of your own,
          our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          covers working with text and files from the ground up.
        </p>
      </div>
    </article>
  );
}
