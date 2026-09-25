import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  FileText,
  GitCompare,
  HelpCircle,
  Layers,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Diff Checker tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The output is explained, not just produced. Most pages on the first
 *    screen of results never say how to read a unified diff or what the
 *    whitespace toggles really do, so sections 3 and 4 do exactly that.
 *
 * 2. The limits are stated plainly: line-based, single inline column, no
 *    merge, and the patch ignores the whitespace and case toggles. Each limit
 *    routes to the sibling tool that fixes it where one exists.
 *
 * 3. The worked examples (essay, config, SQL, CSV, lists) mirror the long-tail
 *    searches, so each visitor finds their own situation by name.
 */
export default function DiffCheckerSeoArticle() {
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
        How to Use a <span className="text-orange-600 dark:text-orange-400">Diff Checker</span> to Compare Text and Code: Reading the Changes, Cutting the Noise, and Saving a Patch
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An editor sends back your essay with &ldquo;a few small tweaks&rdquo;.
        A config file worked yesterday and does not today. A colleague pastes a
        query that is almost, but not quite, the one you wrote. Each time the
        question is the same: what exactly changed? A{' '}
        <strong>diff checker</strong> answers it in seconds. This guide shows how
        to <strong>compare text</strong> and code with the free{' '}
        <strong>text compare</strong> tool above, how to read and quieten the
        result, how to save it as a patch, and &mdash; honestly &mdash; when a
        different <strong>diff tool</strong> is the better choice.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/diff-checker.webp"
            alt="Online diff checker free - comparing two versions of text and code with added and removed lines highlighted word by word, ready to download diff as patch file"
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
              Removed lines on one side of the gutter, added lines on the other,
              and the exact words that changed marked inside each line.
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
            ['#what-is-a-diff', '1. What a Diff Checker Does, and When You Need One'],
            ['#how-to-compare', '2. How to Compare Two Text Files in Four Steps'],
            ['#cut-the-noise', '3. Ignore Whitespace, Ignore Case, and Word-Level Marks'],
            ['#unified-diff', '4. How to Read a Unified Diff and Download a Patch'],
            ['#worked-examples', '5. Worked Examples: Essays, Configs, SQL, CSV and Lists'],
            ['#use-something-else', '6. What It Does Not Do, and What to Use Instead'],
            ['#why-cortexis', '7. Why Use the Cortexis Diff Checker'],
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
      <section id="what-is-a-diff" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Diff Checker Does, and When You Need One
        </h3>
        <p>
          A diff checker takes an original and a modified copy of the same
          text and shows the smallest set of lines you would remove and add to
          turn one into the other. Everything else is marked unchanged.
        </p>
        <p>
          Reach for a <strong>text difference finder</strong> whenever reading
          both versions would take longer than the answer is worth: an edited
          draft, a changed config file, a snippet under review, or this
          week&rsquo;s export. As a <strong>code compare tool online</strong> it
          works for any language, because it compares plain lines of text. The
          result is one inline view with two line-number gutters, so you always
          know where a change sits in each file.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compare" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compare Two Text Files in Four Steps
        </h3>
        <p>
          Here is <strong>how to compare two text files</strong>, or two pasted
          passages, with the tool above. It is an{' '}
          <strong>online diff checker free</strong> of accounts, sign-ups and
          usage counters.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the original.</strong> Paste it under <em>Original</em>,
            or drop a file onto <em>Drop file A</em>. Any plain-text file works:
            code, CSV, JSON, logs, config and Markdown.
          </li>
          <li>
            <strong>Add the modified version.</strong> Paste it under{' '}
            <em>Modified</em>, or drop it onto <em>Drop file B</em>. For a{' '}
            <strong>file compare online</strong> that is all; the result updates
            as you type, with no Compare button.
          </li>
          <li>
            <strong>Tune the view.</strong> Tick <em>Ignore whitespace</em> or{' '}
            <em>Ignore case</em>, and pick word-level, character-level or
            lines-only highlighting. Sides the wrong way round? <em>Swap</em>{' '}
            flips them.
          </li>
          <li>
            <strong>Read the summary and export.</strong> A status line counts
            lines removed, added and unchanged, or says the two texts are
            identical. The <em>Unified diff</em> panel can be copied or
            downloaded as <strong>changes.patch</strong>.
          </li>
        </ol>
        <p>
          That is the whole method to <strong>compare two texts online free</strong>.
          The page is responsive, so you can <strong>compare text on phone or
          tablet</strong> screens the same way; pasting is usually quicker there.
        </p>
      </section>

      {/* 3 */}
      <section id="cut-the-noise" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-orange-500 shrink-0" />
          3. Ignore Whitespace, Ignore Case, and Word-Level Marks
        </h3>
        <p>
          The commonest complaint about any diff is noise: a one-word edit
          buried under lines that only look different. Three controls fix it.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-500 shrink-0" /> Diff ignore whitespace
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Collapses runs of spaces or tabs to one space and trims each line
              before matching. Re-indented code and trailing spaces stop
              showing up as changes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> Compare text ignore case
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Treats upper and lower case as the same while matching lines. Use
              it for a heading changed to title case or SQL keywords rewritten
              in capitals.
            </p>
          </div>
        </div>
        <p>
          <strong>Why does diff show whole file changed?</strong> Usually every
          line differs invisibly: the file was re-indented, or trailing spaces
          were added or stripped. Tick <em>Ignore whitespace</em> and the flood
          shrinks to the real edits. Differing line endings are not a cause
          here, because Windows and Unix line breaks are both recognised. The
          toggle cannot fix re-wrapped text, where the line breaks themselves
          moved; those lines genuinely are different.
        </p>
        <p>
          When a <strong>diff shows changes but lines look identical</strong>,
          switch <em>Inline highlighting</em> to <em>Character-level</em>. A{' '}
          <strong>character level diff online</strong> marks the exact
          characters that differ, exposing a double space, a curly quote or a
          zero typed as a capital O. For prose, <em>Word-level inline marks</em>{' '}
          gives a cleaner <strong>word by word text comparison</strong>. Inline
          marks appear when a removed line is directly followed by its
          replacement, which is how most edits look.
        </p>
      </section>

      {/* 4 */}
      <section id="unified-diff" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Read a Unified Diff and Download a Patch
        </h3>
        <p>
          Below the visual comparison sits a read-only panel in the standard
          unified diff format, the same layout described in the{' '}
          <a
            href="https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GNU diffutils manual
          </a>
          . Here is <strong>how to read a unified diff</strong>:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>--- original</strong> and <strong>+++ modified</strong> name
            the two sides.
          </li>
          <li>
            <strong>@@ lines</strong> open each hunk, a block of changes, and
            give the starting line and length of that block in each file.
          </li>
          <li>
            Lines starting with <strong>-</strong> were removed, lines starting
            with <strong>+</strong> were added, and lines starting with a space
            are context: three unchanged lines around each change so the patch
            can find its place.
          </li>
        </ul>
        <p>
          That is also <strong>how to create a patch file from two files</strong>{' '}
          without a terminal. Press <em>Download</em> to save changes.patch, or{' '}
          <em>Copy</em> to paste it into a ticket. Standard tools
          such as{' '}
          <a
            href="https://git-scm.com/docs/git-apply"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            git apply
          </a>{' '}
          and <em>patch</em> understand the format, which makes this a handy{' '}
          <strong>diff checker for code review without git</strong>: compare
          the snippet before and after, and send the patch.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>The patch is always strict.</strong> Ignore whitespace and
            Ignore case change only the visual view. The unified diff is
            computed on the exact text, spacing and capitalisation included.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="worked-examples" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          5. Worked Examples: Essays, Configs, SQL, CSV and Lists
        </h3>
        <p>
          <strong>Compare two versions of an essay.</strong> Paste the first
          draft as the original and the revised draft as the modified text,
          then choose word-level marks. Each rewritten sentence shows the old
          wording marked as removed and the new wording highlighted. This is the
          quickest answer to <strong>how to find differences between two
          documents</strong> after an editor or teacher has worked on your
          text. Keep paragraphs wrapped the same way in both drafts, so one
          edit does not ripple through the lines after it.
        </p>
        <p>
          <strong>Find what changed in a config file.</strong> Drop the last
          working version onto file A and the current one onto file B, tick{' '}
          <em>Ignore whitespace</em>, and the changed setting is usually the
          only highlighted line. Character-level marks catch a single altered
          digit in a port number.
        </p>
        <p>
          <strong>Compare two SQL queries online.</strong> Tick both toggles.
          If one query is on a single line and the other spans many, tidy both
          with the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>{' '}
          first, and the join or filter that changed will stand out.
        </p>
        <p>
          <strong>Compare two CSV files online.</strong> Each row is a line, so
          the diff lists rows added and removed between two exports. It
          compares text, not cells, so a re-ordered column makes every row
          differ.
        </p>
        <p>
          <strong>How to compare two lists for differences.</strong> If the
          lists are not in the same order, sort and de-duplicate both with the{' '}
          <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            line tools
          </Link>{' '}
          first; the diff then shows exactly which items appear in only one
          list.
        </p>
      </section>

      {/* 6 */}
      <section id="use-something-else" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Route className="w-6 h-6 text-orange-500 shrink-0" />
          6. What It Does Not Do, and What to Use Instead
        </h3>
        <p>
          A line diff is right for plain text and wrong for a few common jobs.
          Here is where to go instead.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>PDF documents.</strong> A PDF is not plain text, so dropping
            one here gives meaningless output. Use the{' '}
            <Link to="/tools/pdf-compare" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compare tool
            </Link>
            , or extract the text first with the{' '}
            <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to TXT converter
            </Link>{' '}
            and diff the two text files.
          </li>
          <li>
            <strong>Word .docx files.</strong> These are packaged files, not
            text. Copy the text out of each document and paste it in.
          </li>
          <li>
            <strong>JSON with different key order or formatting.</strong> The
            diff compares lines, not meaning. To{' '}
            <strong>compare JSON files online</strong> reliably, run both
            through the{' '}
            <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JSON formatter
            </Link>{' '}
            so they share the same layout, then compare. Keys that were merely
            reordered will still show as removed and added lines.
          </li>
          <li>
            <strong>Spreadsheets as cells.</strong> Turn each sheet into CSV
            with the{' '}
            <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              spreadsheet converter
            </Link>
            , then compare the text. Images and whole folders are not
            supported.
          </li>
          <li>
            <strong>Merging, side-by-side columns and similarity scores.</strong>{' '}
            There is no merge, the view is one inline column with unchanged
            sections shown in full, and there is no similarity or plagiarism
            score. For word statistics, the{' '}
            <Link to="/tools/word-counter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              word counter
            </Link>{' '}
            helps.
          </li>
          <li>
            <strong>Saved or shared links.</strong> Diffs are not saved or given
            a link. Copy the patch or download changes.patch to keep a record.
          </li>
        </ul>
        <p>
          There is no hard size limit, but very large files that differ on
          almost every line can feel slow; compare the relevant section
          instead.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Diff Checker
        </h3>
        <p>
          Many sites compare two texts. Fewer explain the result or give you a
          usable patch. Here is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no daily limit. Paste two texts and the answer is already on screen.'],
            ['A private diff checker', 'Contracts, configs with secrets and unreleased code are never stored on our servers, and nothing you compare is retained.'],
            ['Never used for training', 'What you paste is never used to train any model. Your drafts and code stay yours.'],
            ['Updates as you type', 'No Compare button. Edit either side or change an option and the result refreshes at once.'],
            ['Word or character precision', 'Inline marks show the exact words or characters that changed inside a line, not just which line changed.'],
            ['A real patch file', 'A standard unified diff with three lines of context, ready to copy or download as changes.patch.'],
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
            free developer and document tools
          </Link>{' '}
          built on the same terms, from the{' '}
          <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
            regex tester
          </Link>{' '}
          to the{' '}
          <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            case converter
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
              'How do I compare two texts online for free?',
              'Paste the original into the Original box and the new version into the Modified box, or drop a text file onto each. The comparison appears immediately, with the changed words highlighted, and there is no account or limit.',
            ],
            [
              'Is it safe to compare confidential text here?',
              'Yes. Nothing you paste or drop is stored on our servers, nothing is retained, and nothing is used for training. Diffs are never saved or shared through links.',
            ],
            [
              'Why does the diff show the whole file as changed?',
              'Most often the file was re-indented or trailing spaces changed, so every line differs invisibly. Tick Ignore whitespace and only the real edits remain. Re-wrapped text, where the line breaks moved, genuinely differs and cannot be hidden.',
            ],
            [
              'Can I ignore whitespace and capitalisation?',
              'Yes. Ignore whitespace collapses runs of spaces and tabs and trims each line, and Ignore case treats upper and lower case as equal. Both affect the visual comparison only; the unified patch is always computed on the exact text.',
            ],
            [
              'How do I download the diff as a patch file?',
              'Press Download in the Unified diff panel to save changes.patch in the standard unified format, or Copy to take the text. Tools such as git apply and patch can read it.',
            ],
            [
              'Can I compare PDF or Word documents?',
              'Not directly, because both are packaged formats rather than plain text. For PDFs, use the PDF compare tool or extract the text with the PDF to TXT converter first. For Word files, copy the text out of each document and paste it in.',
            ],
            [
              'How do I compare two JSON files that are formatted differently?',
              'Run both through the JSON formatter so they share the same indentation and layout, then paste them here. The diff compares lines rather than meaning, so keys that were only reordered will still appear as changes.',
            ],
            [
              'How do I compare two lists for differences?',
              'Here is how to compare two lists for differences when they are in a different order: sort and de-duplicate both with the line tools first, then paste one list into each box. Items found in only one list show as removed or added lines. There is no ignore-line-order option, so unsorted lists show more changes than really exist.',
            ],
            [
              'How do I find what changed in a config file?',
              'To find what changed in a config file, drop the last working copy onto Drop file A and the current copy onto Drop file B. Tick Ignore whitespace so re-indentation drops out, and switch to character-level marks to catch a single altered value. Configs with secrets are never stored on our servers, and nothing is retained.',
            ],
            [
              'Can I compare two versions of an essay?',
              'Yes. To compare two versions of an essay, paste the first draft as the original and the revised draft as the modified text, then choose word-level marks. Every reworded sentence shows the old wording removed and the new wording highlighted. Keep paragraphs wrapped the same way in both drafts so one edit does not ripple through the following lines.',
            ],
            [
              'Does it merge changes or show two columns side by side?',
              'No. It shows one inline column with separate line numbers for each version, and it has no merge or copy-across. To carry edits over, apply the downloaded patch with a tool that supports patches.',
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
          Found the change and need the next step? Tidy a payload with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , turn a CSV export into JSON with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , check a string&rsquo;s fingerprint with the{' '}
          <Link to="/tools/hash-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            hash generator
          </Link>
          , or compare the text of two PDFs with the{' '}
          <Link to="/tools/pdf-compare" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compare tool
          </Link>
          . To learn the developer workflow behind it, try our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
