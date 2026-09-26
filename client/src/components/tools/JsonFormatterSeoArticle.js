import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Braces,
  Check,
  Gauge,
  Hash,
  HelpCircle,
  Layers,
  ScanSearch,
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the JSON formatter tool.
 *
 * Written against what JsonFormatter.js actually does. The tool is a strict
 * validator and pretty-printer with an unusually good error message: instead
 * of a character offset it names what was expected and gives a line and
 * column. That is the whole angle. Sections 3 and 4 are built around the
 * eight messages the tool can actually produce, mapping each to the
 * real-world mistake behind it, because those are the queries people type
 * before they know they want a formatter. The locator has a ninth string,
 * "Invalid number", but it is unreachable: number parsing is only entered on
 * a digit or minus sign, so the article does not list it.
 *
 * Several neighbouring keywords are deliberately not promised. There is no
 * repair mode (a trailing comma or single quote is reported, not fixed), no
 * JSON5 or comment support, no tree view, no JSON-to-CSV/XML/YAML conversion,
 * no file picker or URL loading, no JSON Schema check and no diff. Where a
 * question implies one of those, the answer says so plainly.
 *
 * Section 7 is the honest caveat none of the ranking pages carry: formatting
 * re-serialises the data, so integers above 2^53 are rounded, "1.0" becomes
 * 1, "1e2" becomes 100 and duplicate keys collapse to the last value.
 */
export default function JsonFormatterSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">JSON Formatter</span>: Format, Validate and Minify, With an Error That Tells You Where
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Most of the time you reach for a <strong>JSON formatter</strong> because
        something is wrong. An API response arrived as one unreadable line, a
        config file refuses to load, or your program printed &ldquo;Unexpected
        token in JSON at position 847&rdquo; and you have no idea which line
        that is. This tool is a <strong>JSON validator</strong> and{' '}
        <strong>JSON beautifier</strong> in one pane, and its error message
        names what the parser expected at a line and column rather than a
        character offset. This guide covers each message, the mistake behind it, and the
        minify, indent and sort options once the data is valid.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/json-formatter.webp"
            alt="Cleanly indented code on a screen, one property per line with values in colour"
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
              Paste on the left, read the formatted result on the right, and get
              a named error with a line and column when something is broken.
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
            ['#what-valid-json-means', '1. What a JSON Formatter Checks: Valid JSON Means Strict JSON'],
            ['#how-to-format', '2. How to Format JSON Online Free (Step-by-Step)'],
            ['#line-and-column', '3. Why Is My JSON Invalid? A JSON Formatter With Line and Column Error Reporting'],
            ['#error-messages', '4. The Eight Error Messages and the Mistake Behind Each'],
            ['#minify-indent-sort', '5. Minify, 4-Space or Tab Indent, and Sorting Keys'],
            ['#keys-depth-bytes', '6. Keys, Depth and Bytes: The Readout on Valid JSON'],
            ['#what-formatting-changes', '7. What Formatting Changes: Large Numbers, Duplicate Keys and Escapes'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free JSON Formatter'],
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
      <section id="what-valid-json-means" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a JSON Formatter Checks: Valid JSON Means Strict JSON
        </h3>
        <p>
          JSON looks forgiving because it looks like code. The format itself is
          not. It is defined by{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc8259"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 8259
          </a>{' '}
          and{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-404/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-404
          </a>
          , and the grammar is small: objects, arrays, double-quoted strings,
          numbers, <code>true</code>, <code>false</code> and <code>null</code>.
          Nothing else.
        </p>
        <p>
          That small grammar is why so much pasted text fails. The things a
          Python dictionary or a code-style object literal allow &mdash; single
          quotes, unquoted keys, a comma after the last item, a comment, a{' '}
          <code>NaN</code> &mdash; are all invalid JSON. This{' '}
          <strong>JSON validator</strong> checks strictly against the standard
          and reports the first thing it cannot accept. It does not quietly
          allow JSON5 or comments, and it does not repair what it finds; it
          tells you where the standard was broken so you can fix the source.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Format JSON Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, nothing gated behind a plan. If you searched for{' '}
          <strong>how to format JSON</strong>, this is the whole process with the{' '}
          <strong>free online JSON formatter</strong> above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Paste your JSON', 'Replace the sample in the left-hand box with your own text. Validation runs as you type.'],
            ['Read the banner', 'Green means valid, with a count of keys, the nesting depth and the size in bytes. Red means invalid, with a named reason and a line and column.'],
            ['Format, copy or download', 'The right-hand pane shows the pretty-printed result. Click Format to rewrite your input at the chosen indent, Copy for the clipboard, or Download to save formatted.json.'],
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
          The input is a text box, so this is a paste-and-read tool rather than a
          file picker. Open the .json file in any editor, select all, copy and
          paste; if the export arrived zipped, run it through{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract archive
          </Link>{' '}
          first. That is also the answer to <strong>JSON pretty print online</strong>:
          console output copied out of a log formats the same way as a saved file.
        </p>
      </section>

      {/* 3 */}
      <section id="line-and-column" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanSearch className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why Is My JSON Invalid? A JSON Formatter With Line and Column Error Reporting
        </h3>
        <p>
          The error most programs print when JSON fails to parse is some form of{' '}
          <strong>&ldquo;Unexpected token in JSON at position 847&rdquo;</strong>.
          Position 847 is a character offset from the start of the text. Nobody
          counts 847 characters by hand, and a minified response has no line
          breaks to help. Most tools you paste it into either repeat the offset
          or show a bare &ldquo;Invalid JSON&rdquo;.
        </p>
        <p>
          This tool converts the failure into a{' '}
          <strong>JSON parse error line number</strong> and column, counted from
          1 the way editors count, and pairs it with a statement of what the
          parser was expecting at that spot. A typical message reads{' '}
          <code>Expected ',' or '&#125;' (Line 4, Col 3)</code>. That is a{' '}
          <strong>JSON formatter with line and column error</strong> reporting,
          built for the moment you already know something is wrong and need to
          know where.
        </p>
        <p>
          Two caveats. The position is where the parser gave up, which can be one
          character after the real mistake: a missing comma is reported at the
          start of the next key, not the end of the previous value. And a few
          rarer faults &mdash; an invalid backslash escape, a leading zero, a
          raw line break inside a string &mdash; are reported in the
          parser&rsquo;s own wording rather than the tool&rsquo;s.
        </p>
      </section>

      {/* 4 */}
      <section id="error-messages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
          4. The Eight Error Messages and the Mistake Behind Each
        </h3>
        <p>
          Each message maps to one or two habits that produce it.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            [
              "Expected property name in double quotes",
              'The usual message when the text came from code. You pasted an object literal from your source code or a Python dict, so the keys are unquoted or single-quoted. The rule is blunt: single quotes are not valid anywhere in JSON, so every key and string needs double quotes. It also appears when a trailing comma follows the last property, because the parser then expects another key and finds a closing brace.',
            ],
            [
              "Expected ',' or '}'",
              'Two properties with no comma between them, or an object never closed. If the column points at the start of a key, the comma is missing from the line above.',
            ],
            [
              "Expected ',' or ']'",
              'The array version of the same fault: two items with nothing between them, or a bracket never closed.',
            ],
            [
              "Expected ':' after property name",
              'A key with no colon after it. Usually a typo, or YAML or a key=value config that was never JSON.',
            ],
            [
              'Unterminated string',
              'A string that opened and never closed. Usually an unescaped double quote inside a value, or a response cut off mid-string.',
            ],
            [
              'Unexpected end of input',
              'The text stopped where a value should begin: after a colon or a comma with nothing following. A response truncated mid-structure lands here or on Unterminated string; one cut off just after a value is reported as Expected \',\' or \'}\' instead.',
            ],
            [
              "Unexpected token 'X'",
              'A character that cannot start a value: a comment marker, NaN or undefined, a stray letter, or a trailing comma in an array followed by the closing bracket.',
            ],
            [
              'Unexpected trailing characters',
              'A complete document followed by more text: two responses pasted back to back, a bracket typed twice, or debug output after the data.',
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 font-mono">
                {title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          The pattern is the same throughout: JSON is stricter than the language
          you copied it from. The tool is deliberately a reporter rather than a
          repairer, so what you copy out is only ever a reformatting of data
          that was already correct.
        </p>
      </section>

      {/* 5 */}
      <section id="minify-indent-sort" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-orange-500 shrink-0" />
          5. Minify, 4-Space or Tab Indent, and Sorting Keys
        </h3>
        <p>
          Once the banner is green, three controls decide what the output looks
          like. None of them change the data, which is the whole{' '}
          <strong>JSON minify vs beautify difference</strong>: the same values
          with different whitespace, read identically by any parser.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Minify
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Click Minify and every line break and indent is removed. This is how
              to minify JSON for an environment variable or an HTTP body, and it
              is what people mean by &ldquo;convert JSON to one line&rdquo;.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Indent: 2, 4 or tab
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Two spaces is the default. Pick 4 spaces when a style guide demands
              it, or format JSON with tabs when the codebase indents that way.
              The output pane updates as soon as you change the selection.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Sort Keys A-Z
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Reorders every object&rsquo;s keys alphabetically at every level of
              nesting, arrays included. Capital letters sort before lowercase.
              Off by default, so original key order is otherwise preserved.
            </p>
          </div>
        </div>
        <p>
          If you need to <strong>sort JSON keys alphabetically online</strong> it
          is almost always because two files holding the same data will not
          diff cleanly. Run both through the tool with Sort Keys on and the same
          indent, and any remaining difference in a line-by-line compare is a
          real change in the values. There is no built-in diff; the sorted
          output is what you paste into whatever compare tool you already use.
        </p>
        <p>
          This <strong>JSON minifier online</strong> offers no custom indent
          width beyond 2, 4 and tab, and no compact mode that keeps short arrays
          on one line. If the JSON has to go into a URL or a data attribute,
          minify here and then run the result through our{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="keys-depth-bytes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          6. Keys, Depth and Bytes: The Readout on Valid JSON
        </h3>
        <p>
          When the input is valid, the green banner carries three figures people
          otherwise write a script for.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Keys</strong> is the total number of object keys in the whole
            document, counted at every level and inside every array. To{' '}
            <strong>count keys in JSON online</strong> and sanity-check an
            export, this is the number.
          </li>
          <li>
            <strong>Depth</strong> is the deepest level of nesting, with the root
            value at 0. A flat object of strings has depth 1; an object holding an
            array of objects has depth 3. Use it as a{' '}
            <strong>JSON nesting depth checker</strong> before sending data to
            an API, database or search index that caps how deep a document may go.
          </li>
          <li>
            <strong>Size</strong> is the byte length of what you pasted. Compare
            it before and after Minify to see what whitespace was costing you.
          </li>
        </ul>
        <p>
          This is a text box, not a viewer for very large documents. Ordinary API
          responses and config files are fine; a multi-megabyte paste will be
          slow to scroll, and there is no tree view to navigate it.
        </p>
      </section>

      {/* 7 */}
      <section id="what-formatting-changes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-6 h-6 text-orange-500 shrink-0" />
          7. What Formatting Changes: Large Numbers, Duplicate Keys and Escapes
        </h3>
        <p>
          Formatting is not a find-and-replace on whitespace. The text is read
          into real values and written back out, and that round trip normalises
          a few things. Most pretty-printers do this; few say so.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Whole numbers above 2<sup>53</sup> lose precision.</strong>{' '}
            If you searched <strong>JSON large number precision lost formatter</strong>{' '}
            because a nineteen-digit ID came out with different final digits,
            this is why. The precision available for JSON numbers is a limit RFC 8259
            itself warns about. The fix at the source is to send long IDs as
            strings.
          </li>
          <li>
            <strong>Number spelling is canonicalised.</strong> <code>1.0</code>{' '}
            comes out as <code>1</code>, <code>1e2</code> as <code>100</code>.
            The value is unchanged; the text is not.
          </li>
          <li>
            <strong>Duplicate keys collapse.</strong> If an object lists the same
            key twice, only the last value survives, which is also how most
            parsers treat the file.
          </li>
          <li>
            <strong>Unicode escapes become characters.</strong> A{' '}
            <code>{'\\u00e9'}</code> in the input is written back as <code>é</code>;
            the string is identical, simply no longer escaped.
          </li>
        </ul>
        <p>
          None of this matters for reading a response. It matters if the
          formatted text is going back into a system that compares bytes or
          signs payloads; there, treat the output as a readable view, not a
          replacement.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free JSON Formatter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['An error you can act on', 'Eight specific messages naming what the parser expected, each with a line and column instead of a character offset.'],
            ['Free, with no sign-up', 'Searching for a JSON formatter no signup required? This is it: no email step and no output held behind a plan. Format, minify, copy and download are all available every time.'],
            ['Private by default', 'A JSON formatter online private enough for real work. Nothing you paste is stored on our servers, retained after your session, or used for training.'],
            ['Tab and 4-space indent', 'Pick 2, 4 or tab to match whatever style guide the file has to satisfy.'],
            ['Deep key sorting', 'Sort Keys A-Z reorders every object at every level, which turns two differently-ordered files into something you can diff line by line.'],
            ['Keys, depth and size at a glance', 'The valid-state banner reports key count, nesting depth and byte size without a script.'],
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
          on the same terms, so you can{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            encode and decode Base64
          </Link>
          ,{' '}
          <Link to="/tools/colour-format-utilities" className="text-orange-600 font-semibold underline hover:text-orange-700">
            convert colour formats
          </Link>{' '}
          or{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            generate a QR code
          </Link>{' '}
          without paying for any of it.
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
              'Is this JSON formatter free and does it need an account?',
              'Yes and no, respectively. It is a free online JSON formatter with no sign-up, no email and no plan that unlocks the download.',
            ],
            [
              'Why does my JSON say "unexpected token in JSON at position" and how do I find that line?',
              'The position is a character offset, which is useless without counting. Paste the same text into the tool above and the red banner reports a line and column instead, along with what the parser expected there.',
            ],
            [
              'Why are single quotes not valid in JSON?',
              'Because the standard only defines double-quoted strings. Single quotes are legal in Python and in most languages\' object literals, which is why text copied from code fails with "Expected property name in double quotes". Change the quotes at the source; the tool reports the fault but does not rewrite it.',
            ],
            [
              'Does a trailing comma break JSON?',
              'Yes. A comma after the last property or array item is a JSON trailing comma error, even though most programming languages allow it. In an object it is reported as "Expected property name in double quotes" at the closing brace; in an array it is reported as an unexpected token at the closing bracket.',
            ],
            [
              'What does "unexpected end of JSON input" mean?',
              'The text ended before every open bracket or brace was closed: a truncated response, a clipped log line, or a copy that missed its last line. Paste it into the tool and it reports where the text ran out, as "Unexpected end of input" if it stopped before a value or "Expected \',\' or \'}\'" if it stopped after one. Either way the line and column point at the very end, and the bracket that never closed is somewhere above.',
            ],
            [
              'Can I format JSON with 4 spaces or tabs instead of 2?',
              'Yes. The Indent selector offers 2 spaces, 4 spaces or Tab. Click Format to rewrite your input at that width, then Copy or Download.',
            ],
            [
              'Can it fix broken JSON, show a tree view or convert to CSV?',
              'No. It validates strictly and reports the first error; it does not repair trailing commas, single quotes, comments or JSON5. Both panes are plain text with no tree view or syntax colouring, and there is no conversion to CSV, XML or YAML. If you want to download formatted JSON file output rather than copy it, the Download button writes the formatted text as formatted.json.',
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
          Working with the data that surrounds JSON? The{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder and decoder
          </Link>{' '}
          unpacks the encoded payloads that hide inside a response,{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          brings a folder of exported .json files into one naming scheme, and{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive
          </Link>{' '}
          bundles them into a single zip before you hand them over. To understand the APIs behind the data rather than simply tidy it, our
          free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          builds and consumes JSON APIs from the first project onward.
        </p>
      </div>
    </article>
  );
}
