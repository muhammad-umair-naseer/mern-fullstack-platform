import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Braces,
  Check,
  HelpCircle,
  Layers,
  ListChecks,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';

/**
 * Long-form guide rendered under the YAML to JSON tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Type safety is the headline. The parser follows YAML 1.2 core scalar
 *    rules, so NO, yes and on stay strings, and the JSON to YAML direction
 *    quotes the values that would otherwise change type on the way back.
 *
 * 2. Limits are a checklist, not a footnote: multi-document files, merge
 *    keys, custom tags, comments, leading zeros and 1.10-style versions, tab
 *    indentation. Each comes with the workaround.
 *
 * 3. Colon mistakes do not always raise an error (a: b: c parses as a string
 *    value), so the error section tells people to read the output, not only
 *    the message.
 */
export default function YamlJsonSeoArticle() {
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
        A Free <span className="text-orange-600 dark:text-orange-400">YAML to JSON Converter</span> That Keeps Your Types: Both Directions, Real Errors, Honest Limits
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A Kubernetes manifest a script wants as JSON, or an API response that
        belongs in a config file. Each is a quick <strong>YAML to JSON</strong>{' '}
        or <strong>JSON to YAML</strong> job, and each has the same trap: a
        converter that quietly turns the country code <code>NO</code> into{' '}
        <code>false</code>, or strips the zero from the front of a zip code.
        This guide shows how to use the <strong>YAML to JSON converter</strong>{' '}
        above in either direction, what it does with types, what its errors
        mean, and &mdash; plainly &mdash; what it cannot handle yet.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/yaml-json.webp"
            alt="A laptop showing indented code in a dark editor on a bright white desk"
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
              Same data, two notations, types and key order kept.
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
            ['#yaml-vs-json', '1. YAML vs JSON: What Converting Actually Changes'],
            ['#how-to-convert', '2. How to Convert YAML to JSON (or JSON to YAML)'],
            ['#norway-problem', '3. The YAML Norway Problem, and Why NO Stays "NO"'],
            ['#devops-files', '4. Kubernetes, Compose, Helm, Actions and OpenAPI'],
            ['#errors', '5. What Each Error Message Means and How to Fix It'],
            ['#limits', '6. What It Does Not Do, With the Workaround'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free YAML JSON Converter'],
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
      <section id="yaml-vs-json" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          1. YAML vs JSON: What Converting Actually Changes
        </h3>
        <p>
          The <strong>YAML vs JSON</strong> question is mostly about who reads
          the file. YAML uses indentation instead of brackets, allows comments
          and anchors, which is why people write configuration in it. JSON is
          stricter, with quoted strings, braces and no comments, which is why
          programs and APIs prefer it. Its grammar is set out in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc8259"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            RFC 8259
          </a>
          .
        </p>
        <p>
          Converting moves the data, not the decoration. Maps become objects,
          sequences become arrays, and scalars become strings, numbers,
          booleans or null. Comments disappear, anchors are written out in full
          wherever they were used, and key order is preserved.
        </p>
        <p>
          The tool also works as a quick <strong>YAML validator</strong> in the
          narrow sense: text that parses is well-formed, and text that does not
          gets a message, usually with a line number. It does not check the
          file against a schema.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert YAML to JSON (or JSON to YAML)
        </h3>
        <p>
          Here is <strong>how to convert YAML to JSON</strong> with the tool
          above. The input box opens with a sample Kubernetes-style service
          block, so you can press Convert first and see the shape of the
          result.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Paste or drop your file.</strong> Paste text into the box,
            or drop a single <code>.yaml</code>, <code>.yml</code>,{' '}
            <code>.json</code> or <code>.txt</code> file onto the panel. The{' '}
            <strong>yml to json</strong> case is identical; the extension makes
            no difference.
          </li>
          <li>
            <strong>Pick the direction.</strong> The Conversion menu offers{' '}
            <em>YAML &rarr; JSON</em> (the default) and <em>JSON &rarr; YAML</em>.
          </li>
          <li>
            <strong>Choose the indent.</strong> Two spaces is the default; four
            spaces is there for projects that use it. The setting applies to
            either direction, so it gives you <strong>YAML to JSON pretty print</strong>{' '}
            output and <strong>JSON to YAML 4 space indent</strong> output from
            the same menu.
          </li>
          <li>
            <strong>Convert, then copy or download.</strong> Press Convert. The
            result appears in the right-hand box with a Copy button and a
            Download button that saves <code>data.json</code> or{' '}
            <code>data.yaml</code>.
          </li>
        </ol>
        <p>
          That is also <strong>how to convert JSON to YAML</strong>: switch the
          menu, paste the JSON, press Convert. Conversion runs when you press
          the button, not on every keystroke.
        </p>
        <p>
          Inside a pipeline, a script fits better: <strong>convert YAML to JSON
          Python</strong> usually means a YAML library plus the <code>json</code>{' '}
          module, and a command-line YAML processor gives you a shell
          one-liner. Whichever you use, check which YAML version it follows:
          a library on the older 1.1 rules can turn <code>NO</code> into{' '}
          <code>false</code> where this page would not. For a one-off check,
          pasting it here is quicker.
        </p>
      </section>

      {/* 3 */}
      <section id="norway-problem" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          3. The YAML Norway Problem, and Why NO Stays &ldquo;NO&rdquo;
        </h3>
        <p>
          The <strong>YAML Norway problem</strong> is the classic surprise: a
          list of country codes goes in, and Norway comes out as{' '}
          <code>false</code>. It happens because the older YAML 1.1 rules
          treated <code>yes</code>, <code>no</code>, <code>on</code> and{' '}
          <code>off</code> as booleans. The current{' '}
          <a
            href="https://yaml.org/spec/1.2.2/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            YAML 1.2 specification
          </a>{' '}
          dropped that, and this converter follows the 1.2 core rules. If you
          have seen <strong>YAML yes no converted to true false</strong>, here
          is what you get instead:
        </p>
        <ul className="space-y-2">
          <li>
            <code>country: NO</code> becomes <code>"NO"</code> and{' '}
            <code>enabled: yes</code> becomes <code>"yes"</code>: both stay
            strings. Only <code>true</code> and <code>false</code> (in any
            capitalisation) become booleans.
          </li>
          <li>
            <code>port: 8080</code> becomes the number <code>8080</code>, as do
            hex like <code>0x1F</code>, floats and <code>.inf</code>.
          </li>
          <li>
            <code>null</code>, <code>~</code> and an empty value become{' '}
            <code>null</code>. Dates and times such as <code>22:30</code> stay
            strings.
          </li>
        </ul>
        <p>
          The reverse direction protects the round trip: JSON to YAML quotes
          strings YAML would misread, such as <code>"no"</code>,{' '}
          <code>"on"</code> or <code>"1.0"</code>, and writes multi-line strings
          as literal <code>|</code> blocks.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Unquoted numbers are still numbers.</strong> If you are
            here because of <strong>YAML leading zero removed</strong>, this is
            the rule: <code>zip: 01234</code> becomes <code>1234</code> and{' '}
            <code>version: 1.10</code> becomes <code>1.1</code>, because both
            are valid numbers. Quote them in the YAML (<code>zip: "01234"</code>)
            and they come through as strings, exactly as written.
          </p>
        </div>
      </section>

      {/* 4 */}
      <section id="devops-files" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-6 h-6 text-orange-500 shrink-0" />
          4. Kubernetes, Compose, Helm, Actions and OpenAPI
        </h3>
        <p>
          Most YAML that needs converting is configuration, and each kind has
          one detail worth knowing.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Convert Kubernetes YAML to JSON</strong> for{' '}
            <code>kubectl patch</code>, an API call or a script: a single
            manifest converts cleanly. A file with several resources separated
            by <code>---</code> needs splitting first (see section 6).
          </li>
          <li>
            <strong>Docker Compose YAML to JSON</strong>: services, ports,
            volumes and environment blocks all convert. If the file reuses
            settings with <code>&lt;&lt;: *defaults</code>, that merge is not
            expanded.
          </li>
          <li>
            <strong>Helm values YAML to JSON</strong>, for{' '}
            <code>--set-json</code> or a values schema: nested maps and lists
            keep their types, which matters for region and feature-flag values.
          </li>
          <li>
            <strong>GitHub Actions workflow YAML to JSON</strong>: the{' '}
            <code>on:</code> key stays the string <code>"on"</code> rather than
            turning into <code>true</code>, and <code>&#36;{'{{ }}'}</code>{' '}
            expressions are kept as text.
          </li>
          <li>
            <strong>OpenAPI JSON to YAML</strong>: paste a Swagger or OpenAPI
            spec, switch to JSON &rarr; YAML, and get the readable form with
            status codes such as <code>"200"</code> kept as quoted keys.
          </li>
          <li>
            <strong>Ansible YAML to JSON</strong>: playbooks and inventory
            convert for inspection; <code>yes</code>/<code>no</code> values stay
            strings, so check anything your tooling expects as a boolean.
          </li>
        </ul>
        <p>
          <strong>YAML anchors and aliases to JSON</strong> work the way you
          would hope: define <code>base: &amp;b</code> once, reference it with{' '}
          <code>*b</code>, and the JSON contains the full block in both places.
        </p>
      </section>

      {/* 5 */}
      <section id="errors" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-orange-500 shrink-0" />
          5. What Each Error Message Means and How to Fix It
        </h3>
        <p>
          Errors appear above the output box, and your input is left as it was.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Invalid YAML near line N</strong> or{' '}
            <strong>Unexpected content at line N</strong>: usually a line
            indented to a level that does not match its siblings. Line it up
            with the keys it belongs beside.
          </li>
          <li>
            <strong>Bad flow sequence</strong> or <strong>Bad flow mapping</strong>:
            an inline <code>[ ]</code> list or <code>{'{ }'}</code> map that was
            never closed, or has a stray comma.
          </li>
          <li>
            <strong>Unknown alias *name</strong>: a <code>*name</code>{' '}
            reference with no matching <code>&amp;name</code>, often a typo.
          </li>
          <li>
            <strong>Invalid JSON: &hellip;</strong>: the JSON &rarr; YAML input
            did not parse. The detail often reads like{' '}
            <strong>unexpected token in JSON at position</strong> N; look there
            for a trailing comma, single quotes or a comment.
          </li>
        </ul>
        <p>
          Two messages from other YAML tools deserve a note.{' '}
          <strong>Found character that cannot start any token</strong> (YAML
          tab) means a tab was used for indentation, which YAML forbids. This
          converter does not report tabs but mis-reads them, so replace
          indenting tabs with spaces first.{' '}
          The YAML error <strong>mapping values are not allowed here</strong> means a second
          colon on one line or a key indented under a value. Here, a line such
          as <code>a: b: c</code> does not raise an error: it becomes the string{' '}
          <code>"b: c"</code>, so glance at the output and check the nesting is
          what you meant.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          6. What It Does Not Do, With the Workaround
        </h3>
        <p>
          This converter reads a practical subset of YAML. These are the cases
          it does not handle, so you know before you rely on the output.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>YAML multiple documents to JSON.</strong> The{' '}
            <code>---</code> separators are ignored, so two documents merge into
            one object and later duplicate keys overwrite earlier ones. Split
            the file and convert each document separately.
          </li>
          <li>
            <strong>Merge keys.</strong> <code>&lt;&lt;: *base</code> is kept as
            a literal <code>"&lt;&lt;"</code> key holding the anchored map. Copy
            the shared keys into each block if you need them flattened.
          </li>
          <li>
            <strong>Custom tags.</strong> CloudFormation <code>!Ref</code>,{' '}
            <code>!GetAtt</code>, <code>!Sub</code> or <code>!!binary</code> are
            not interpreted; the tag text stays inside the string value.
          </li>
          <li>
            <strong>Comments.</strong> Dropped going to JSON, never added going
            to YAML.
          </li>
          <li>
            <strong>Schema checks.</strong> It confirms the text parses, not
            that the file is valid for Kubernetes or OpenAPI.
          </li>
          <li>
            <strong>JSON with comments or trailing commas.</strong> JSONC and
            JSON5 fail with <em>Invalid JSON</em>. The{' '}
            <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JSON formatter
            </Link>{' '}
            helps you find the offending character.
          </li>
          <li>
            <strong>Tab indentation.</strong> Tabs are not reported as an
            error and are mis-read, so replace indenting tabs with spaces
            before you convert.
          </li>
          <li>
            <strong>Leading and trailing zeros in bare numbers.</strong>{' '}
            <code>01234</code> becomes <code>1234</code> and <code>1.10</code>{' '}
            becomes <code>1.1</code>. Quote the value to keep it exactly.
          </li>
          <li>
            <strong>Batch or live conversion.</strong> One file or paste per
            press of Convert; there is no multi-file mode and no convert-as-you-type.
          </li>
          <li>
            <strong>Side-by-side comparison.</strong> To see what changed
            between two versions of a config, paste both into the{' '}
            <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              diff checker
            </Link>
            .
          </li>
        </ul>
        <p>
          For other formats, use the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , the{' '}
          <Link to="/tools/xml-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            XML to JSON converter
          </Link>{' '}
          and the{' '}
          <Link to="/tools/sql-csv" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL to CSV tool
          </Link>{' '}
          instead.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free YAML JSON Converter
        </h3>
        <p>
          Plenty of pages offer a <strong>JSON to YAML converter online</strong>;
          few say which YAML rules they follow. This one is a{' '}
          <strong>YAML JSON converter free</strong> of sign-ups, and here is
          what you can check.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email and no daily limit. The tool on this page is the whole product.'],
            ['YAML 1.2 types, stated plainly', 'NO, yes and on stay strings; only true and false are booleans. You know in advance what the JSON will contain.'],
            ['Both directions, one page', 'YAML to JSON and JSON to YAML from the same menu, with 2 or 4 space indent, and risky strings quoted on the way back.'],
            ['Your config stays private', 'Files and pasted text are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your manifests, values files and API specs are never used to train any model.'],
            ['Errors and limits you can act on', 'Messages carry a line number or alias name, and every limit comes with a workaround.'],
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
            free developer and file tools
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
              'How do I convert YAML to JSON for free?',
              'Paste your YAML or drop a .yaml or .yml file into the tool above, leave the direction on YAML to JSON and press Convert. Copy the result or download it as data.json, with no account needed.',
            ],
            [
              'Can it convert JSON to YAML as well?',
              'Yes. Switch the Conversion menu to JSON to YAML, paste the JSON and press Convert, then copy it or download data.yaml. Strings YAML would misread, such as "no" or "1.0", are quoted.',
            ],
            [
              'Will NO or yes turn into false or true?',
              'No. The converter follows YAML 1.2 core rules, so only true and false in any capitalisation become booleans. NO, yes, on and off stay strings in the JSON, which avoids the Norway problem.',
            ],
            [
              'Why did my zip code or version number change?',
              'Unquoted values that look like numbers become numbers, so 01234 becomes 1234 and 1.10 becomes 1.1. Quote the value in your YAML to keep the exact string.',
            ],
            [
              'How do I convert YAML multiple documents to JSON, such as a Kubernetes file split by ---?',
              'Not in one go. The separators are ignored, so the documents merge into one object and duplicate keys overwrite. Split the file at each --- and convert each part, then combine the results into a JSON array yourself if you need one.',
            ],
            [
              'Do I need a command-line tool to convert YAML to JSON?',
              'No. You can convert YAML to JSON online here, with no terminal command or script to write: paste or drop one file, press Convert, and copy or download the result. A command-line tool still makes more sense for converting many files at once, since this converter handles one file per click.',
            ],
            [
              'Does it check my YAML against a Kubernetes or OpenAPI schema?',
              'No. It tells you whether the text parses, which catches syntax mistakes but not a wrong field name or a missing required key. For checking the JSON side, use the JSON formatter.',
            ],
            [
              'Is it safe to paste a config that contains secrets?',
              'Your text and files are never stored on our servers, nothing is retained after your session, and nothing is used for training. As a habit, rotate any secret that has been pasted anywhere it should not be.',
            ],
            [
              'Are YAML comments kept in the JSON?',
              'No. JSON has no comment syntax, so comments are dropped when converting to JSON, and none are added going the other way.',
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
          Converted and moving on? Tidy or minify the result with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , encode a value for a Kubernetes secret with the{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder and decoder
          </Link>
          , inspect a token from your config with the{' '}
          <Link to="/tools/jwt-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JWT decoder
          </Link>
          , or compare two versions of a file with the{' '}
          <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            diff checker
          </Link>
          . To write the conversion yourself, our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          cover the data formats behind tools like this one.
        </p>
      </div>
    </article>
  );
}
