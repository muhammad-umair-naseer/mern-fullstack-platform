import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Braces,
  Check,
  Globe,
  HelpCircle,
  Layers,
  Link2,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the URL Encoder / Decoder tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The real question is which encoding to use. Component, full URL and
 *    form encoding are the three modes people mix up, so section 1 lays
 *    them side by side on the sample URL the tool opens with.
 *
 * 2. Troubleshooting gets its own sections: "URI malformed", + versus %20
 *    and double encoding (%2520) are what bring most people here.
 *
 * 3. The limits are stated plainly (no Base64url decode, no file input, no
 *    Punycode reverse, no per-line bulk mode, no query editing) and routed
 *    to the sibling tool where one exists.
 */
const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

export default function UrlEncoderSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">URL Encoder Decoder</span>: How to URL Encode, URL Decode and Get Percent Encoding Right
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A search link that breaks at an ampersand. A redirect that loses half
        its address. A shared link full of %20 that nobody can read. All three
        come down to <strong>percent encoding</strong>, the rule that decides
        which characters a web address may hold as they are and which must be
        written as % plus two hex digits. This guide shows how to{' '}
        <strong>url encode</strong> and <strong>url decode</strong> with the{' '}
        <strong>url encoder decoder</strong> above, which encoding suits each
        job, and how to fix the errors that bring most people here.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/url-encoder.webp"
            alt="URL encoder decoder online free - percent encoding a search link with spaces and commas, decoding it back and parsing its query string into key and value pairs"
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
              Paste a link, pick an operation, and the result updates as you
              type &mdash; with every query parameter laid out underneath.
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
            ['#which-encoding', '1. Percent Encoding: Component, Full URL or Form?'],
            ['#how-to-encode', '2. How to URL Encode and URL Decode in Three Steps'],
            ['#spaces', '3. %20 vs + in a URL, and the Vanishing Plus Sign'],
            ['#errors', '4. URI Malformed, %2520 and Other Broken Links'],
            ['#query-parser', '5. The Query String Parser: UTM Links and Redirects'],
            ['#other-modes', '6. Base64url, HTML Entities, Punycode and the Limits'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free URL Encoder Decoder'],
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
      <section id="which-encoding" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-orange-500 shrink-0" />
          1. Percent Encoding: Component, Full URL or Form?
        </h3>
        <p>
          A web address allows only a small set of characters, and some have
          jobs: <code>?</code> starts the query,{' '}
          <code>&amp;</code> separates parameters, <code>=</code> joins a key to
          its value and <code>#</code> starts the fragment. Percent encoding,
          defined in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc3986"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            RFC 3986
          </a>
          , replaces any other character with its UTF-8 bytes written as{' '}
          <code>%XX</code>. A space becomes <code>%20</code>, a comma{' '}
          <code>%2C</code>. What people get wrong is how much of the text to
          encode, the question behind{' '}
          <strong>encodeURIComponent vs encodeURI</strong>. The tool offers
          both, plus form encoding; its sample shows the difference:{' '}
          <code>https://cortexis.pk/search?q=free tools&amp;lang=en&amp;tags=pdf,image#top</code>.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Encode component', 'Escapes everything except A to Z, a to z, 0 to 9 and - _ . ! ~ * \' ( ). Use it for one value, or for a URL placed inside another URL. It is the default.'],
            ['Encode full URL', 'Keeps / ? # & = : intact and escapes only what cannot appear at all. On the sample, "free tools" becomes "free%20tools" and the link still works.'],
            ['Form encoding', 'Component encoding, except spaces become + instead of %20: the format HTML forms submit.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          The rule of thumb: encode the pieces, not the whole. Run a complete
          address through component encoding and its slashes are escaped too,
          so it stops being a link. Encode each value on its own, and an
          ampersand inside a company name can no longer start a new parameter.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-encode" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to URL Encode and URL Decode in Three Steps
        </h3>
        <p>
          <strong>How to encode a URL</strong> and{' '}
          <strong>how to decode a URL encoded string</strong> from a log take
          the same steps, with no account to create.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Paste your text.</strong> Replace the sample with your
            link, value or encoded string. The box is one piece of text, so a
            line break becomes <code>%0A</code> when encoded.
          </li>
          <li>
            <strong>Choose the operation.</strong> Pick an Encode mode or
            Form encoding to encode; Decode or Form decode to read. The output
            refreshes as you type, with no convert button.
          </li>
          <li>
            <strong>Copy or download.</strong> Use Copy to grab the result, or
            Download to save it as <code>output.txt</code>.
          </li>
        </ol>
        <p>
          A common case is <strong>how to pass a URL as a query parameter</strong>:
          a login link carrying a return address such as{' '}
          <code>?next=https://example.com/a?b=1</code>. Encode only the inner
          address with Encode component and place it after <code>next=</code>;
          its <code>?</code> and <code>=</code> are escaped, so the outer link
          keeps one query. Likewise, to <strong>url encode for an API request
          with curl</strong>, encode each parameter value before adding it to
          the command.
        </p>
        <p>
          Encoding works on UTF-8 bytes, so you can{' '}
          <strong>encode emoji or Arabic and Urdu text in a URL</strong>: each
          character becomes two to four <code>%XX</code> groups, and Decode
          restores the original script.
        </p>
      </section>

      {/* 3 */}
      <section id="spaces" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          3. %20 vs + in a URL, and the Vanishing Plus Sign
        </h3>
        <p>
          <strong>How to encode spaces in a URL</strong> has two correct
          answers, which is exactly why it causes trouble. In the path and in
          general percent encoding a space is <code>%20</code>. In form data,
          the <strong>application/x-www-form-urlencoded</strong> format web forms
          use when a form is submitted, a space is <code>+</code>. So{' '}
          <strong>%20 vs + in a URL</strong> is really a question about who
          will read the value: use <code>%20</code> anywhere in a link, and{' '}
          <code>+</code> only when you are building a form body. The Form
          encoding mode is a ready <strong>form urlencoded encoder</strong> for
          that second case.
        </p>
        <p>
          The flip side: a <strong>plus sign in a URL turns into a space</strong>{' '}
          when a phone number like <code>+923001234567</code> is sent unescaped
          and read as form data. Encode the value first, which turns{' '}
          <code>+</code> into <code>%2B</code>.
        </p>
        <p>
          The decoder respects that difference: plain Decode keeps a literal{' '}
          <code>+</code>, while Form decode turns every <code>+</code> into a
          space, as a submitted form would. If a result looks wrong, try the
          other one.
        </p>
        <p>
          And if you are asking <strong>why does my link have %20</strong>:
          nothing is broken. The link contained a space, written the only way
          a web address can hold one. Choose Decode to read it normally.
        </p>
      </section>

      {/* 4 */}
      <section id="errors" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          4. URI Malformed, %2520 and Other Broken Links
        </h3>
        <p>
          The <strong>URI malformed error from decodeURIComponent</strong> means
          the text contains a <code>%</code> that is not followed by a valid
          encoded byte. The tool shows the same message as a red line and
          leaves your previous output in place. There are two usual causes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>A lone percent sign.</strong> Text such as{' '}
            <code>50% off</code> was never encoded. Encode it instead, which
            turns the percent sign into <code>%25</code>.
          </li>
          <li>
            <strong>A legacy character set.</strong> Older systems wrote
            characters like &eacute; as a single byte, <code>%E9</code>,
            instead of the UTF-8 pair <code>%C3%A9</code>. This decoder reads
            UTF-8 only, and no tool here converts those strings; fix them at
            the source.
          </li>
        </ul>
        <p>
          A <strong>double encoded URL with %2520</strong> is the other classic.
          It happens when an already encoded value is encoded again: the{' '}
          <code>%</code> of <code>%20</code> becomes <code>%25</code>, giving{' '}
          <code>%2520</code>. To undo it, run Decode, paste the output back
          into the input and Decode again. There is no one-click repair, but
          you can watch each layer come off.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>A URL with special characters not working?</strong> The
            usual culprit is an unescaped <code>&amp;</code>, <code>#</code>,
            space or non-English letter inside a value. Encode the value with
            Encode component, or the whole address with Encode full URL.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="query-parser" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          5. The Query String Parser: UTM Links and Redirects
        </h3>
        <p>
          Under the input sits a <strong>query string parser</strong>. For a
          complete address starting with <code>https://</code>, the Parsed URL
          panel lists protocol, host, path and hash, then every query key
          beside its decoded value. For the sample you see <code>q</code> set to{' '}
          <em>free tools</em>, <code>lang</code> set to <em>en</em> and{' '}
          <code>tags</code> set to <em>pdf,image</em>, with <em>#top</em> as the
          hash.
        </p>
        <p>
          That makes it quick to <strong>decode a UTM tracking link</strong>:
          paste a long campaign URL and read <code>utm_source</code>,{' '}
          <code>utm_medium</code> and <code>utm_campaign</code> as plain
          words. Developers use it to{' '}
          <strong>decode an OAuth redirect_uri parameter</strong>, the callback
          address encoded inside a login link, and compare it with the one
          registered for the app.
        </p>
        <p>
          The panel reads; it does not edit, so removing tracking tags means
          rebuilding the link yourself. It also needs an absolute
          address: a relative path or a bare string like <code>a=1&amp;b=2</code>{' '}
          shows &ldquo;Input is not an absolute URL, so there is nothing to
          parse&rdquo;. Put any full address in front of a bare query, such as{' '}
          <code>https://example.com/?a=1&amp;b=2</code>, and it parses. The
          parsing follows the{' '}
          <a
            href="https://url.spec.whatwg.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            WHATWG URL Standard
          </a>
          , the specification that defines how web addresses are read today. If
          a parameter carries JSON, copy its decoded value into the{' '}
          <Link to="/tools/json-formatter" className={linkClass}>
            JSON formatter
          </Link>{' '}
          to read it properly indented.
        </p>
      </section>

      {/* 6 */}
      <section id="other-modes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          6. Base64url, HTML Entities, Punycode and the Limits
        </h3>
        <p>
          The same menu covers neighbouring escapes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Base64 encode and decode</strong>, UTF-8 aware, so non-Latin
            text survives the round trip.
          </li>
          <li>
            <strong>Base64url encode online</strong>: the URL-safe variant used
            in tokens, with <code>-</code> and <code>_</code> in place of{' '}
            <code>+</code> and <code>/</code> and no <code>=</code> padding.
          </li>
          <li>
            <strong>HTML entity encoder decoder</strong>: encoding escapes{' '}
            <code>&amp; &lt; &gt; &quot; &#39;</code> and the backtick, and turns
            non-ASCII letters into numeric entities. Decoding understands named
            and numeric entities alike, which is how to{' '}
            <strong>unescape HTML entities like {'&amp;'} and {'&quot;'}</strong>{' '}
            in text exported from a CMS or an email.
          </li>
          <li>
            <strong>Punycode converter</strong>: turns an{' '}
            <strong>IDN domain to Punycode</strong>, the <code>xn--</code>{' '}
            ASCII form that DNS and registrars expect.
          </li>
        </ul>
        <p>What it does not do, and where to go instead:</p>
        <ul className="space-y-2">
          <li>
            It encodes Base64url but does not decode it; URL-safe strings fail
            in Base64 decode. For token segments use the{' '}
            <Link to="/tools/jwt-decoder" className={linkClass}>
              JWT decoder
            </Link>
            , and for files or images the{' '}
            <Link to="/tools/base64-encoder-decoder" className={linkClass}>
              Base64 encoder and decoder
            </Link>
            , since this tool takes text only.
          </li>
          <li>
            Punycode is one-way: <code>xn--</code> names are not converted back
            to Unicode here, and no other Cortexis tool does it either. Keep a
            note of the original spelling when you convert a domain.
          </li>
          <li>
            The Parsed URL panel is read-only, so stripping tracking tags or
            changing a value means editing the link in the input box and
            watching the table update, rather than ticking parameters off.
          </li>
          <li>
            There is no line-by-line bulk mode. The{' '}
            <Link to="/tools/line-tools" className={linkClass}>
              line tools
            </Link>{' '}
            can tidy and de-duplicate the list first.
          </li>
          <li>
            It does not escape for JSON, SQL or regular expressions; the{' '}
            <Link to="/tools/regex-tester" className={linkClass}>
              regex tester
            </Link>{' '}
            and{' '}
            <Link to="/tools/sql-formatter" className={linkClass}>
              SQL formatter
            </Link>{' '}
            serve those jobs. It does not shorten links, though the{' '}
            <Link to="/tools/qr-generator" className={linkClass}>
              QR code generator
            </Link>{' '}
            will turn the finished address into a scannable code.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free URL Encoder Decoder
        </h3>
        <p>
          Plenty of pages offer a <strong>url encoder online free</strong> or a{' '}
          <strong>url decoder online</strong>. What matters is whether the
          page tells you which mode you need, and whether it leaves your data
          as you typed it.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Both directions, one page', 'Encode and decode share one menu, and the output updates as you type. No sign-up.'],
            ['The right encoding for each job', 'Component, full URL and form encoding are separate modes, with a note saying which characters each keeps.'],
            ['Honest about + and %20', 'Decode keeps a literal plus sign; Form decode turns it into a space. You choose, instead of the tool guessing and changing your data.'],
            ['A query string parser built in', 'Every parameter is laid out as key and decoded value, so tracking links and redirects read at a glance.'],
            ['Private by policy', 'Nothing you paste is stored on our servers, retained, or used for training.'],
            ['More than percent encoding', 'Form encoding, Base64 and Base64url, HTML entities and Punycode sit behind the same menu as the URL modes.'],
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
          It is a <strong>URL encoder that never stores what you paste</strong>,
          and one of a wider set of{' '}
          <Link to="/tools" className={linkClass}>
            free developer and file tools
          </Link>{' '}
          offered on the same terms.
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
              'What is the difference between URL encoding and URL decoding?',
              'URL encoding turns characters a web address cannot hold, such as spaces and ampersands, into %XX codes. URL decoding reverses it, so free%20tools becomes free tools again.',
            ],
            [
              'Should I use encodeURIComponent or encodeURI?',
              'Use Encode component for a single value or an address placed inside another address. Use Encode full URL to keep a complete link working, since it leaves / ? # & = and : alone.',
            ],
            [
              'Is a space %20 or + in a URL?',
              'In a link, a space is %20. In form data sent as application/x-www-form-urlencoded, it is +. Use Form encoding only for form bodies.',
            ],
            [
              'Is there a form urlencoded encoder for application/x-www-form-urlencoded bodies?',
              'Yes. Choose Form encoding: it escapes each value like Encode component, then writes spaces as + instead of %20, which is what an application/x-www-form-urlencoded body expects. Encode each key and value separately and join them with = and &. Form decode reverses it, turning + back into a space.',
            ],
            [
              'How do I unescape HTML entities like &amp; and &quot;?',
              'Paste the text and choose HTML entities decode. Named entities such as &amp; and &quot; and numeric ones such as &#39; turn back into & and " and \', so text copied from a CMS export or an email reads normally again.',
            ],
            [
              'Why does my plus sign turn into a space?',
              'The receiving side reads the value as form data, where + means a space. Encode it first so the plus becomes %2B. When decoding, plain Decode keeps a plus as a plus.',
            ],
            [
              'How do I fix a URI malformed error?',
              'The text contains a % that is not a valid encoded byte, such as a literal 50% or a legacy code like %E9. Encode the raw text if it was never encoded; legacy character sets need fixing at their source.',
            ],
            [
              'How do I fix %2520 in a link?',
              'That is a double encoded space. Decode the string, paste the output back in and Decode again; each pass removes one layer.',
            ],
            [
              'Can it decode Base64url or a JWT?',
              'It encodes Base64url but does not decode it. Use the JWT decoder for token segments and the Base64 encoder and decoder for other Base64 work, including files.',
            ],
            [
              'Is it safe to paste links that contain tokens?',
              'Yes. Links, tokens and text you paste are never stored on our servers, nothing is retained, and nothing is used for training. Treat the decoded output with the same care as the original link.',
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
          Next, fingerprint a value with the{' '}
          <Link to="/tools/hash-generator" className={linkClass}>
            hash generator
          </Link>
          , create unique IDs for parameters with the{' '}
          <Link to="/tools/uuid-generator" className={linkClass}>
            UUID generator
          </Link>
          , or compare two URLs with the{' '}
          <Link to="/tools/diff-checker" className={linkClass}>
            diff checker
          </Link>
          . To learn how requests and query strings fit together, try our free{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
