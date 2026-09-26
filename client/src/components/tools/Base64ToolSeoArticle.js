import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Binary,
  Braces,
  Check,
  FileCode2,
  HelpCircle,
  Layers,
  Link2,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Base64 encoder / decoder.
 *
 * Written against what Base64Tool.js actually does, which shapes the article
 * around one idea the head-term pages never explain: what the decoder puts up
 * with, the one thing it refuses, and why that refusal is useful.
 *
 * Decoding strips every character outside the Base64 alphabet before it
 * looks at the string, so line-wrapped MIME blocks, quoted JSON values,
 * data: URIs and unpadded base64url all decode with no toggle. The only error
 * is a cleaned length with a remainder of 1 when divided by 4, which is
 * truncation rather than padding. Sections 3 and 4 are built on that split,
 * because the "incorrect padding" searcher needs to know which case they are in.
 *
 * Encoding is UTF-8 in and standard or URL-safe alphabet out, and a single
 * uploaded file can be prefixed as a data URI. Section 6 says plainly that the
 * prefix applies to files only, because the checkbox does not touch typed text.
 *
 * Declined on purpose: "base64 to image", "base64 to pdf" and the file-shaped
 * half of "base64 converter online". The decoder shows text; it does not
 * rebuild a binary file, preview it, or offer a charset choice. JWT decoding is
 * served only as "paste one segment" because there is no header/payload split.
 */
export default function Base64ToolSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 7 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        The Free <span className="text-orange-600 dark:text-orange-400">Base64 Encoder Decoder</span> That Takes the String Exactly As You Found It
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Most of the time you meet Base64 by accident: a token in a config
        file, a blob inside an API response, a wall of letters in the raw
        source of an email, an image that has become text inside a stylesheet.
        You want to <strong>base64 decode</strong> it and read what it says, or{' '}
        <strong>base64 encode</strong> something of your own for a header or a
        request body. This <strong>base64 encoder decoder</strong> does both,
        and it accepts the string in whatever messy shape you copied it, so you
        spend no time cleaning quotes and line breaks before it cooperates.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/base64-encoder-decoder.webp"
            alt="Rows of punched cards whose patterns of holes encode data as characters"
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
              Two modes, one page: text or a file in as Base64, or a pasted
              string out as readable text.
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
            ['#what-base64-is', '1. What a Base64 Encoder Decoder Actually Does'],
            ['#how-to-decode', '2. How to Decode Base64 to Text (Step-by-Step)'],
            ['#paste-it-messy', '3. Paste It Messy: What the Decoder Tolerates'],
            ['#padding-vs-truncation', '4. Incorrect Padding vs Invalid Length'],
            ['#encode-text', '5. Encoding Text: UTF-8, Emoji and URL-Safe Output'],
            ['#file-to-data-uri', '6. Convert a File to Base64 or a Data URI'],
            ['#weird-characters', '7. Why Decoded Text Shows Weird Characters'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Base64 Converter'],
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
      <section id="what-base64-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Binary className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Base64 Encoder Decoder Actually Does
        </h3>
        <p>
          Base64 is neither encryption nor compression. It is a way of writing
          any sequence of bytes using only 64 safe characters: A to Z, a to z,
          0 to 9 and two symbols. The standard alphabet is defined in{' '}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc4648"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 4648
          </a>
          , along with the URL-safe variant that swaps the two symbols for a
          hyphen and an underscore.
        </p>
        <p>
          It exists because email, JSON, HTTP headers and configuration files
          carry text and choke on raw binary. Base64 lets a PDF, an image or a
          certificate travel through them as plain letters, at the cost of
          growing by roughly a third. Every three bytes become four characters,
          and a trailing <code>=</code> or <code>==</code> pads the last group
          when the input does not divide evenly by three.
        </p>
        <p>
          A <strong>base64 encoder decoder</strong> therefore has two jobs:
          turn text or a file into that alphabet, and turn the alphabet back
          into readable text. What separates a good one from a frustrating one
          is how it handles characters outside ASCII, whether it reads the
          URL-safe alphabet, and how much cleaning it demands first.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-decode" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Decode Base64 to Text (Step-by-Step)
        </h3>
        <p>
          No account, no email, no output hidden behind a sign-up. To{' '}
          <strong>base64 decode online</strong>, here is the whole process:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Switch to Decode', 'Click "Decode from Base64" at the top of the tool. The input pane relabels itself.'],
            ['Paste the string', 'Paste it as you found it, quotes, line breaks, data: prefix and all. The decoded result appears on the right at once; there is no submit button.'],
            ['Copy the result', 'Press Copy and the readable text is on your clipboard. A character and byte count above the input lets you sanity-check what you pasted.'],
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
          That is all there is to <strong>how to decode base64 to text</strong>.
          If the Base64 lives in a text file, the Upload File button in decode
          mode places its contents in the input. If the result turns out to be
          JSON, which it often is, paste it into the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          to indent it into something a person can read.
        </p>
      </section>

      {/* 3 */}
      <section id="paste-it-messy" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-orange-500 shrink-0" />
          3. Paste It Messy: What the Decoder Tolerates Without Being Asked
        </h3>
        <p>
          The usual reason for a <strong>base64 string not decoding</strong>{' '}
          is not the Base64 but the packaging around it: quotation marks from a
          JSON value, line breaks from an email, a{' '}
          <code>data:image/png;base64,</code> prefix from a stylesheet. Strict
          decoders reject all of that. This one discards every character
          outside the Base64 alphabet before it starts, so the following all
          decode with no option to toggle and no hand-cleaning:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Line breaks and whitespace
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Email and certificate tooling wraps Base64 at 76 columns. To{' '}
              <strong>base64 decode with line breaks</strong> in place, paste
              the whole block; newlines, tabs and spaces are ignored. It is a{' '}
              <strong>base64 decoder that ignores whitespace</strong> by
              default, not by setting.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Quotes from JSON and code
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>decode base64 from a JSON API response</strong>, copy
              the value with its quotes and trailing comma. None of those are
              in the alphabet, so they are dropped.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              URL-safe and unpadded strings
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Need to <strong>base64 decode a url safe string</strong>? Hyphens
              and underscores are read as the characters they stand in for, and
              you can <strong>decode base64 without padding</strong> because
              missing <code>=</code> signs are inferred.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Full data: URIs
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>decode a data URI to text</strong>, paste the entire{' '}
              <code>data:text/plain;base64,...</code> value. Everything up to
              the comma is skipped as the prefix.
            </p>
          </div>
        </div>
        <p>
          Two jobs this makes easy. To{' '}
          <strong>decode base64 from an email MIME attachment</strong>, open the
          raw message source, copy the encoded part between the blank line and
          the boundary marker, and paste. To{' '}
          <strong>base64url decode a JWT payload online</strong>, paste just the
          middle segment between the two dots and the claims appear as JSON.
          The tool decodes one segment at a time, does not split a whole token
          for you, and never verifies a signature.
        </p>
      </section>

      {/* 4 */}
      <section id="padding-vs-truncation" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          4. Incorrect Padding vs Invalid Length: Which Strings Can Be Saved
        </h3>
        <p>
          If you arrived here after a <strong>base64 incorrect padding</strong>{' '}
          error, most often a Python <code>binascii.Error</code>, one question
          matters: is the string merely unpadded, or is it missing data? A
          strict decoder gives the same complaint for both. They are not the
          same problem, and this page tells them apart.
        </p>
        <p>
          Base64 works in groups of four characters. Stripped of padding, a
          valid string leaves a remainder of 0, 2 or 3 when divided by four,
          and adding the <code>=</code> signs back restores it perfectly. This
          decoder does that silently, so an <strong>incorrect padding</strong>{' '}
          error elsewhere usually means the string decodes here with no fuss,
          and the fix in your own code is to append <code>=</code> until the
          length is a multiple of four.
        </p>
        <p>
          A remainder of 1 is different. No arrangement of bytes can produce
          it, because one leftover character carries six bits and a byte needs
          eight. A character is genuinely missing, and padding cannot help.
          That is the one case this tool refuses, with the banner{' '}
          <em>Invalid Base64 input string length</em>. If you are chasing a{' '}
          <strong>base64 invalid length error</strong> and this page shows it
          too, stop adding padding: the string was cut off when it was copied,
          logged or stored, and only the source has a complete copy. That makes
          the decoder a quick diagnostic: decodes here, fixable; length banner,
          truncated.
        </p>
      </section>

      {/* 5 */}
      <section id="encode-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Braces className="w-6 h-6 text-orange-500 shrink-0" />
          5. Encoding Text: UTF-8, Emoji and URL-Safe Output
        </h3>
        <p>
          Switch to <em>Encode to Base64</em>, type or paste, and the encoded
          string appears on the right. Copy takes it to your clipboard;
          Download saves it as a <code>.txt</code> file. This is the everyday{' '}
          <strong>base64 encode</strong> job: a username and password pair for
          a Basic authentication header, a credential for a YAML secret.
        </p>
        <p>
          The detail that matters is the character set. Text is encoded as
          UTF-8, so when you need to{' '}
          <strong>base64 encode UTF-8 text with emoji</strong>, or Arabic,
          Hindi, Chinese, Cyrillic or accented European characters, the output
          is a correct encoding any UTF-8-aware decoder will turn back into the
          original. Many simple encoders fail on anything outside Latin-1; this
          one does not, and the round trip is exact.
        </p>
        <p>
          Tick <em>URL-Safe (- and _)</em> to <strong>convert text to base64
          url safe</strong> form: the two symbols become hyphen and underscore
          and trailing padding is dropped, the shape query strings, JWT
          segments and filenames expect. The same box applies to files. When
          unsure, the standard alphabet with padding is what most APIs assume.
        </p>
      </section>

      {/* 6 */}
      <section id="file-to-data-uri" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-orange-500 shrink-0" />
          6. Convert a File to Base64 or a Data URI
        </h3>
        <p>
          To <strong>convert a file to base64 online</strong>, stay in encode
          mode and use the Upload File button in the corner of the input pane. Any single
          file of any type is accepted, and the full Base64 string fills the
          output for you to copy or download as a <code>.txt</code> file named
          after the original.
        </p>
        <p>
          Tick <em>Data URI prefix</em> before choosing the file and the output
          starts with <code>data:&lt;type&gt;;base64,</code>, falling back to{' '}
          <code>application/octet-stream</code> when the type is unknown. That
          is the complete <strong>file to base64 data URI</strong> string, ready
          for an HTML <code>src</code>, a CSS <code>url()</code> or a Markdown
          image, in the form set out by{' '}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc2397"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            RFC 2397
          </a>
          . One honest caveat: the checkbox applies to uploaded files only.
          Typed text is encoded bare, so for a data URI of plain text, add the
          prefix yourself.
        </p>
        <p>
          To <strong>encode an image to a data URI</strong> for a stylesheet or
          an email template, shrink it first with the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          or change its format with the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>
          , because Base64 adds a third to whatever you feed it. To{' '}
          <strong>base64 encode a PDF for an API request</strong>, run it
          through the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          first, then encode without the prefix; document APIs want the bare
          string in a JSON field. One file at a time; there is no batch mode.
        </p>
      </section>

      {/* 7 */}
      <section id="weird-characters" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Decoded Text Shows Weird Characters
        </h3>
        <p>
          When <strong>base64 decoded text shows weird characters</strong>, a
          row of question-mark diamonds or symbols with the odd readable word
          between them, the decode did not fail. The bytes it produced are
          simply not text. Three usual causes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The content is a binary file.</strong> A string beginning{' '}
            <code>JVBERi0</code> is a PDF, <code>iVBORw0</code> a PNG,{' '}
            <code>/9j/</code> a JPEG, <code>UEsDB</code> a zip. This page
            identifies what you have; it does not rebuild or preview the file,
            so keep the string for the system that expects it.
          </li>
          <li>
            <strong>The original was not UTF-8.</strong> Text from an older
            single-byte character set decodes with replacement characters where
            the accented letters were. The tool decodes as UTF-8 only, with no
            charset picker, so a Windows-1252 or Latin-1 source needs a decoder
            that lets you choose.
          </li>
          <li>
            <strong>The string is corrupt in the middle.</strong> A character
            dropped or altered mid-string shifts everything after it, so
            readable text turns to noise at one point. Section 4 catches a
            dropped character only when it leaves the length one short of a
            group of four; a substitution slips through unnoticed.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Base64 Converter Online
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no sign-up, ever', 'If you searched base64 encode online free no signup, this is it. No account, no email, no output blurred until you register.'],
            ['Decodes what you actually copied', 'Quotes, newlines, data: prefixes, URL-safe characters and missing padding are all handled without an option to find and tick.'],
            ['Tells padding from truncation', 'Unpadded strings decode silently. Only a string with bytes genuinely missing is refused, so the error means something.'],
            ['Correct UTF-8 both ways', 'Emoji and every non-Latin script encode and decode as the characters you started with.'],
            ['Files to data URIs in one click', 'Any single file becomes a Base64 string or a complete data: URI with the type filled in.'],
            ['Nothing is kept', 'Whatever you paste or encode is never stored on our servers, never retained after your session, and never used for training.'],
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
          It is one of a set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free developer and document tools
          </Link>{' '}
          on the same terms, with the{' '}
          <Link to="/tools/colour-format-utilities" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour format utilities
          </Link>
          ,{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR generator
          </Link>{' '}
          and{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          a click away.
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
              'Is this base64 encoder decoder really free with no sign-up?',
              'Yes. Both directions, text and files, with no account, no email step and no cap on how often you use it. It is a free online base64 encoder every time, not free for the first few strings.',
            ],
            [
              'Why does my base64 string give an incorrect padding error?',
              'Strict decoders insist the length be a multiple of four, even when only the trailing = signs are missing. Paste it here: if it decodes, the string was just unpadded, and appending = until the length divides by four fixes it in your code. If this page also refuses it, the string is truncated and padding cannot repair it.',
            ],
            [
              'Does it decode URL-safe Base64 and JWT segments?',
              'Yes. Hyphen and underscore are accepted alongside the standard alphabet and missing padding is inferred, which covers base64url. Paste the middle segment of a JWT to read its claims as JSON. It decodes one segment at a time and does not verify signatures.',
            ],
            [
              'Can I turn a Base64 string back into an image or a PDF file?',
              'Not on this page. The decoder shows the result as text, which suits tokens, JSON and configuration values but does not rebuild a binary file. Keep the string and supply it to the system that expects the file.',
            ],
            [
              'How do I convert an image or PDF to a Base64 data URI?',
              'In encode mode, tick Data URI prefix, then click Upload File and choose the file. The output is the full data:type;base64, string with the type filled in. Leave the box unticked for the bare string most APIs want in a JSON field. The prefix applies to uploaded files only.',
            ],
            [
              'Why does the decoded output show question marks or boxes?',
              'Because the bytes are not text: the string holds a binary file, the original was in a character set other than UTF-8, or the string was altered in the middle. Section 7 explains how to tell which. The tool decodes as UTF-8 only and offers no charset choice.',
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
          Working on the same payload? The{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          tidies what you just decoded, the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          brings an icon down to a size worth inlining, and{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive
          </Link>{' '}
          bundles several files into one before you encode it. To understand
          how encodings, headers and tokens fit together rather than simply use
          them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers HTTP, authentication and data formats from the beginning.
        </p>
      </div>
    </article>
  );
}
