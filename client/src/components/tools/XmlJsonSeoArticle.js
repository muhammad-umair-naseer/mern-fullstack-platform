import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Braces,
  Check,
  FileCode,
  HelpCircle,
  Layers,
  ListTree,
  Repeat,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the XML to JSON tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Lead with the mapping. Developers need to know the shape of the JSON
 *    before they write code against it, so the exact rules (@ attributes,
 *    #text, arrays only when repeated, coercion, leading zeros kept) are
 *    published with the sample document and its real output.
 *
 * 2. The traps are stated plainly: the array-of-one problem, dropped comments
 *    and DOCTYPE, merged mixed text, kept namespace prefixes, a forgiving
 *    parser that never flags malformed XML, and JSON keys that are not legal
 *    XML names.
 *
 * 3. Anything the tool cannot do is routed honestly: JSON validation to
 *    json-formatter, YAML to yaml-json, CSV to csv-json, diffs to diff-checker.
 */
export default function XmlJsonSeoArticle() {
  const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';
  const preClass =
    'not-prose text-xs sm:text-sm leading-relaxed p-4 rounded-2xl bg-slate-950 text-slate-100 overflow-x-auto border border-slate-800';

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
        The Free <span className="text-orange-600 dark:text-orange-400">XML to JSON Converter</span>, and JSON to XML: The Exact Mapping, the Traps, and the Fixes
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A SOAP response your new app cannot read. A product feed exported as
        XML when your script expects JSON. A legacy system that will only
        accept XML, fed from an API that only speaks JSON. Converting{' '}
        <strong>XML to JSON</strong> and <strong>JSON to XML</strong> sounds
        like a single click, and it is, but the part that matters is the shape
        you get back. This guide explains exactly how the{' '}
        <strong>xml to json converter</strong> above maps attributes, text and
        repeated elements, how to go the other way, and where the classic traps are.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/xml-json.webp"
            alt="Hands typing code on a laptop at a wooden table beside a latte and wildflowers"
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
              Attributes keep an @ prefix, text becomes #text, and repeated
              elements become arrays. The rules are fixed, so the output is
              predictable.
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
            ['#what-it-does', '1. XML to JSON: What It Is and When You Need It'],
            ['#how-to-convert', '2. How to Convert XML to JSON in Four Steps'],
            ['#the-mapping', '3. How XML Attributes Are Represented in JSON'],
            ['#json-to-xml', '4. JSON to XML, Pretty-Print and Minify'],
            ['#common-problems', '5. Fixing the Common XML to JSON Problems'],
            ['#real-files', '6. SOAP, RSS, Sitemaps and Other Real Files'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free XML JSON Converter'],
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
          <FileCode className="w-6 h-6 text-orange-500 shrink-0" />
          1. XML to JSON: What It Is and When You Need It
        </h3>
        <p>
          XML and JSON both describe structured data, but they think about it
          differently. XML, defined by the{' '}
          <a
            href="https://www.w3.org/TR/xml/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            W3C XML 1.0 specification
          </a>
          , has elements, attributes, text and ordering. JSON, defined by{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc8259"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            RFC 8259
          </a>
          , has only objects, arrays, strings, numbers, booleans and null. Every
          converter has to decide how attributes, text and repeated tags should
          look in JSON.
        </p>
        <p>
          You need <strong>xml to json</strong> when the data arrives as XML
          but the thing that consumes it wants JSON: a modern front end reading
          a legacy API, a script processing an export, a colleague who searches{' '}
          <strong>how to open XML file as JSON</strong> because the tags are hard to read. You need <strong>json to xml</strong> for the
          reverse: a gateway or older system that accepts XML only. This page
          handles both directions in one place.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert XML to JSON in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert XML to JSON</strong> with the tool
          above. There is no account and no sign-up; it is an{' '}
          <strong>xml to json online free</strong> tool in the plain sense.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your XML.</strong> Paste it into the input box, or drop
            a .xml, .json or .txt file onto the area marked &ldquo;Drop a file
            or paste below&rdquo;; that is the whole job when you need to{' '}
            <strong>convert XML file to JSON</strong> rather than pasted text.
          </li>
          <li>
            <strong>Choose the conversion.</strong> Pick <em>XML &rarr; JSON</em>{' '}
            in the Conversion menu. The same menu offers <em>JSON &rarr; XML</em>,{' '}
            <em>Pretty-print XML</em> and <em>Minify XML</em>.
          </li>
          <li>
            <strong>Decide on typing.</strong> Leave{' '}
            <em>Convert numbers/booleans</em> ticked to get real JSON numbers,
            true, false and null; untick it to keep every value as a string.
          </li>
          <li>
            <strong>Convert, then copy or download.</strong> Press{' '}
            <em>Convert</em>. The result appears in the output box with Copy and
            Download buttons; the download is named <strong>data.json</strong>.
          </li>
        </ol>
      </section>

      {/* 3 */}
      <section id="the-mapping" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListTree className="w-6 h-6 text-orange-500 shrink-0" />
          3. How XML Attributes Are Represented in JSON: The Exact Rules
        </h3>
        <p>
          If you are asking <strong>how are XML attributes represented in JSON</strong>,
          here the answer is fixed and published. This is the tool&rsquo;s sample
          document beside its real output:
        </p>
        <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
          <pre className={preClass}>{`<?xml version="1.0"?>
<order id="42">
  <customer>Ayesha</customer>
  <item sku="A1" qty="2">Notebook</item>
  <item sku="B7" qty="1">Pen</item>
</order>`}</pre>
          <pre className={preClass}>{`{
  "order": {
    "@id": 42,
    "customer": "Ayesha",
    "item": [
      { "@sku": "A1", "@qty": 2, "#text": "Notebook" },
      { "@sku": "B7", "@qty": 1, "#text": "Pen" }
    ]
  }
}`}</pre>
        </div>
        <ul className="space-y-2">
          <li>
            <strong>The root element becomes the single top-level key</strong>{' '}
            (here, <code>order</code>).
          </li>
          <li>
            <strong>Attributes become keys prefixed with @</strong>, so{' '}
            <code>id=&quot;42&quot;</code> becomes <code>&quot;@id&quot;</code>.
            Nothing is dropped, which is why people searching{' '}
            <strong>xml to json losing attributes</strong> end up here.
          </li>
          <li>
            <strong>Text goes under #text</strong> only when the element also
            has attributes or child elements. An element with nothing but text,
            like <code>customer</code>, becomes a plain value.
          </li>
          <li>
            <strong>Repeated siblings become an array</strong>; a single child
            stays an object.
          </li>
          <li>
            <strong>Namespace prefixes stay in the key</strong>: an element
            written <code>ns:c</code> becomes the key <code>&quot;ns:c&quot;</code>.
            That is the whole story for <strong>xml to json with attributes and namespaces</strong>.
          </li>
          <li>
            <strong>CDATA is kept as text.</strong> Comments, processing
            instructions, the XML declaration and the DOCTYPE are dropped.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section id="json-to-xml" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Repeat className="w-6 h-6 text-orange-500 shrink-0" />
          4. JSON to XML, Pretty-Print and Minify
        </h3>
        <p>
          As a <strong>json to xml converter</strong>, the tool reverses the
          same conventions. Here is <strong>how to convert JSON to XML</strong>:
          paste the JSON, choose <em>JSON &rarr; XML</em>, pick a root name and
          press Convert.
        </p>
        <ul className="space-y-2">
          <li>
            An object with exactly one key uses that key as the root element.
          </li>
          <li>
            Any other object, or a top-level array, is wrapped in the root
            chosen in <em>Root element name</em>: root, data, document or
            items. That is the answer to the{' '}
            <strong>json array to xml root element</strong> question: each
            array entry is written as an <code>&lt;item&gt;</code> inside it.
          </li>
          <li>
            Keys starting with @ become attributes and <code>#text</code>{' '}
            becomes element text.
          </li>
          <li>
            The output is indented two spaces, begins with a UTF-8 XML
            declaration, and downloads as <strong>data.xml</strong>. Invalid
            JSON is reported with &ldquo;Invalid JSON&rdquo; and the reason.
          </li>
        </ul>
        <p>
          The tool doubles as an <strong>xml formatter</strong>. Choose{' '}
          <em>Pretty-print XML</em> for an <strong>xml pretty print online</strong>{' '}
          result: a single-line blob comes back indented two spaces per level
          with text trimmed. <em>Minify XML</em> writes the document without
          adding indentation. Be aware that this <strong>xml minify</strong>{' '}
          mode keeps whitespace already sitting between tags rather than
          stripping it, and both modes drop the DOCTYPE.
        </p>
      </section>

      {/* 5 */}
      <section id="common-problems" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          5. Fixing the Common XML to JSON Problems
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>Xml to json single element not array:</strong> An order
            with one <code>item</code> gives an object; with two it gives an
            array. This tool cannot force a tag to always be an array, so in
            your code wrap a lone object in an array before looping.
          </li>
          <li>
            <strong>Xml to json numbers converted to strings:</strong> Tick{' '}
            <em>Convert numbers/booleans</em> and plain decimal numbers, true,
            false and null become real JSON types. Untick it if you want
            everything as text.
          </li>
          <li>
            <strong>Xml to json leading zeros removed:</strong> Not here. A
            value such as <code>007</code>, a postcode or an account ID stays a
            string even with typing on, so nothing is silently rewritten.
          </li>
          <li>
            <strong>Xml to json #text.</strong> The <code>#text</code> key
            appears only where an element has both text and attributes or
            children. When an element mixes text and tags, all its text is joined into one{' '}
            <code>#text</code> and the original ordering is lost.
          </li>
          <li>
            <strong>Json to xml invalid element name:</strong> JSON keys with
            spaces or a leading digit are written through unchanged, which
            produces invalid XML. Rename those keys in the JSON first; the tool
            does not sanitise them.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>This is not an XML validator.</strong> The parser is
            forgiving: unclosed or mismatched tags are converted quietly rather
            than reported, and there is no XSD schema or DTD check, no XPath and
            no XSLT. For the JSON side, the{' '}
            <Link to="/tools/json-formatter" className="underline font-semibold">
              JSON formatter
            </Link>{' '}
            validates and beautifies the result.
          </p>
        </div>
      </section>

      {/* 6 */}
      <section id="real-files" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          6. SOAP Responses, RSS Feeds, Sitemaps and Other Real Files
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>SOAP response xml to json:</strong> Paste the whole
            envelope. Prefixed names such as <code>soap:Envelope</code> and{' '}
            <code>soap:Body</code> survive as keys, so your code walks down to
            the payload using those exact names.
          </li>
          <li>
            <strong>RSS feed xml to json:</strong> Save or copy the feed, then
            paste or drop it in. Each <code>item</code>{' '}
            becomes an array entry once there are two or more. The tool does not
            fetch URLs, so it cannot pull a live feed for you.
          </li>
          <li>
            <strong>Sitemap xml to json:</strong> The <code>url</code> entries
            become an array of objects with <code>loc</code> and{' '}
            <code>lastmod</code> values, easy to loop over in a link
            check. The namespace declaration on <code>urlset</code> comes
            through as an <code>@xmlns</code> key, and dates stay strings.
          </li>
          <li>
            <strong>Android strings xml to json:</strong> Each{' '}
            <code>string</code> element carries a <code>@name</code> and a{' '}
            <code>#text</code>, so the key and translation sit side by side,
            ready to reshape for a translation workflow.
          </li>
          <li>
            <strong>Maven pom xml to json:</strong> Two or more dependencies
            become an array of objects with groupId, artifactId and version; a
            POM with a single dependency gives one object instead. Comments in
            the POM are dropped.
          </li>
        </ul>
        <p>
          Need a different format next? For <strong>xml to yaml</strong>,
          convert here to JSON, then paste the result into the{' '}
          <Link to="/tools/yaml-json" className={linkClass}>
            YAML to JSON converter
          </Link>{' '}
          and switch it to JSON to YAML. For a spreadsheet, turn a flat JSON
          array into rows with the{' '}
          <Link to="/tools/csv-json" className={linkClass}>
            CSV to JSON converter
          </Link>
          , then finish in the{' '}
          <Link to="/tools/spreadsheet-converter" className={linkClass}>
            spreadsheet converter
          </Link>
          . To see what changed between two exports, the{' '}
          <Link to="/tools/diff-checker" className={linkClass}>
            diff checker
          </Link>{' '}
          compares them line by line.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free XML JSON Converter
        </h3>
        <p>
          Plenty of pages offer an <strong>xml json converter</strong>. Few tell
          you what the output will look like. Here is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Both directions on one page', 'XML to JSON, JSON to XML, pretty-print and minify share one input box, so a round trip needs no second website.'],
            ['A documented, predictable mapping', 'Attributes use @, text uses #text, repeated elements become arrays. The rules are published above, so you can code against them.'],
            ['Types handled carefully', 'Numbers, true, false and null become real JSON types when you want them, while values like 007 keep their leading zeros as strings.'],
            ['Your data stays private', 'Files and pasted text are never stored on our servers and nothing is retained after your session, which matters for API responses and customer exports.'],
            ['Nothing is used for training', 'Your XML and JSON are never used to train any model.'],
            ['Honest about its limits', 'No validation, no XSD, no XPath, no URL fetching, and we say so. Where another tool does the job, this guide links to it.'],
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
          <Link to="/tools" className={linkClass}>
            free developer and document tools
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
              'How do I convert XML to JSON for free?',
              'Paste your XML into the tool at the top of this page, or drop in an .xml file, choose XML to JSON and press Convert. Copy the result or download it as data.json. There is no account and no sign-up.',
            ],
            [
              'How are XML attributes shown in the JSON?',
              'Each attribute becomes a key with an @ prefix, so id="42" turns into "@id". When the same element also has text, that text is stored under #text next to the attributes.',
            ],
            [
              'Why is one element an object and another an array?',
              'Repeated sibling elements become an array, while a single element stays an object. This is the array-of-one problem, and the tool cannot force a tag to always be an array. Handle it in your code by wrapping a lone object in an array before looping over it.',
            ],
            [
              'Will numbers and leading zeros be kept correctly?',
              'With Convert numbers/booleans ticked, plain decimal numbers, true, false and null become real JSON types. Values with leading zeros, such as 007 or many postcodes, stay strings so they are never altered.',
            ],
            [
              'Can I convert JSON back to XML?',
              'Yes. Choose JSON to XML, pick a root name if needed, and press Convert. Keys starting with @ become attributes, #text becomes element text, and a top-level array is wrapped in your chosen root with each entry written as an item element.',
            ],
            [
              'How do I use the converted JSON in my code?',
              'Copy the output or download data.json, then read it with your language\'s standard JSON parser, such as JSON.parse in a web app or json.loads in Python. Access attributes by their @ keys, for example order["@id"]. Wherever a tag can appear once or many times, wrap a lone object in an array before looping.',
            ],
            [
              'Does the tool check whether my XML is valid?',
              'No. The parser is forgiving and converts unclosed or mismatched tags without reporting them, and there is no XSD schema or DTD check. If validity matters, check the XML against its schema first. To validate the JSON result, use the JSON formatter.',
            ],
            [
              'Can it load XML from a URL or an RSS feed address?',
              'No. Input is pasted text or a file you add. Save the feed, sitemap or API response first, then paste or drop it into the tool.',
            ],
            [
              'Is it safe to convert API responses or customer data here?',
              'Your files and pasted text are never stored on our servers, nothing is retained after your session, and nothing is ever used for training. The result is yours to copy or download.',
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
          Next step? Validate the JSON with the{' '}
          <Link to="/tools/json-formatter" className={linkClass}>
            JSON formatter
          </Link>
          , encode a value for a request with the{' '}
          <Link to="/tools/base64-encoder-decoder" className={linkClass}>
            Base64 encoder and decoder
          </Link>{' '}
          or the{' '}
          <Link to="/tools/url-encoder" className={linkClass}>
            URL encoder
          </Link>
          , or turn SQL INSERT statements into CSV rows with the{' '}
          <Link to="/tools/sql-csv" className={linkClass}>
            SQL to CSV converter
          </Link>
          . Browse other formats in the{' '}
          <Link to="/tools/file-converter-hub" className={linkClass}>
            file converter hub
          </Link>
          , or learn to build tools like this in our free{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
