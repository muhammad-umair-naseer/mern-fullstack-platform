import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Fingerprint,
  HelpCircle,
  KeyRound,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';

const LINK = 'text-orange-600 font-semibold underline hover:text-orange-700';

/**
 * Long-form guide rendered under the Hash Generator tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Most searchers want to check a download against a published checksum,
 *    so the Compare box (which matches whichever of the six rows fits) leads.
 *
 * 2. Hashing is one-way. "Decrypt MD5" is answered plainly: it cannot be done,
 *    here or anywhere honest.
 *
 * 3. Limits are stated: six algorithms only, one file at a time, HMAC keys are
 *    text only, and very large ISOs are better checked from a terminal.
 */
export default function HashGeneratorSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Hash Generator</span> Guide: MD5, SHA-256, CRC32 and HMAC, and How to Verify a File Checksum
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You downloaded an installer or a disk image, and the page you got it
        from lists a long string of letters and numbers beside the link. Is
        your copy the same file they published? A <strong>hash generator</strong>{' '}
        answers that in seconds. The tool above works as an{' '}
        <strong>md5 hash generator</strong>, a <strong>sha256 hash generator</strong>{' '}
        and a <strong>checksum calculator</strong> at the same time: it shows
        MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC32 for any text or file
        together, and tells you which one matches the <strong>sha256 checksum</strong>{' '}
        (or any other checksum) you paste in. This guide covers the exact
        steps, what to do when a checksum does not match, HMAC signatures for
        developers, and the honest limits.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/hash-generator.webp"
            alt="Free online hash generator showing MD5, SHA-1, SHA-256, SHA-512 and CRC32 checksums of a file, with a matching sha256 checksum highlighted"
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
              Six digests side by side. Paste the checksum you were given and
              the row that matches turns green.
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
            ['#what-is-a-hash', '1. What a Hash Generator Does, and When You Need One'],
            ['#verify-checksum', '2. How to Verify a File Checksum in Three Steps'],
            ['#which-algorithm', '3. Which Hash Algorithm Is This? A Length Cheat Sheet'],
            ['#does-not-match', '4. Checksum Does Not Match: Causes and Fixes'],
            ['#hmac', '5. HMAC SHA256 Generator for Webhooks and APIs'],
            ['#command-line', '6. The Command-Line Equivalents, and the Limits'],
            ['#why-cortexis', '7. Why Use the Cortexis Hash Generator'],
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
      <section id="what-is-a-hash" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Hash Generator Does, and When You Need One
        </h3>
        <p>
          A hash is a fixed-length fingerprint of some data. Feed the same
          bytes in and you always get the same digest out; change a single
          byte and the digest changes completely. That makes a hash the
          quickest way to answer &ldquo;are these two things identical?&rdquo;
          without comparing them byte by byte.
        </p>
        <p>
          People reach for an <strong>online hash generator free</strong> of
          sign-ups for a handful of everyday jobs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Checking a download.</strong> Operating system images,
            installers and firmware usually ship with a published checksum so
            you can <strong>verify the ISO checksum SHA256</strong> value before
            flashing a USB stick or installing.
          </li>
          <li>
            <strong>Matching a legacy value.</strong> Older sites, cache keys
            and asset pipelines still list MD5 or SHA-1, which is when an{' '}
            <strong>md5 checksum tool</strong> or a{' '}
            <strong>sha1 hash generator</strong> earns its keep.
          </li>
          <li>
            <strong>Archives and ROMs.</strong> ZIP files and game ROM lists
            record CRC32 values, so a <strong>crc32 calculator</strong> tells
            you whether your copy is the listed one.
          </li>
          <li>
            <strong>Code and configuration.</strong> Developers paste a string
            to get its SHA-256 or use the <strong>sha512 hash generator</strong>{' '}
            row for a longer digest.
          </li>
        </ul>
        <p>
          Switch the <em>Source</em> menu to <em>Text</em> and the digests
          update as you type; switch it to <em>File</em> and drop in any file
          type. The SHA family is defined in the NIST standard{' '}
          <a
            href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            FIPS 180-4
          </a>
          , which is why a correct SHA-256 is identical from every tool that
          implements it properly.
        </p>
      </section>

      {/* 2 */}
      <section id="verify-checksum" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Verify a File Checksum in Three Steps
        </h3>
        <p>
          Here is <strong>how to verify a file checksum</strong> with the tool
          above. The same steps are <strong>how to check sha256 of a file</strong>,
          and equally <strong>how to get md5 hash of a file</strong>, because
          every algorithm is calculated at once.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose File and add your download.</strong> Set{' '}
            <em>Source</em> to <em>File</em>, then drop the file on the panel
            or click to pick it. Its name and size appear so you know you
            chose the right one.
          </li>
          <li>
            <strong>Paste the published checksum.</strong> Copy only the hex
            string from the download page into <em>Compare with</em>. Upper or
            lower case does not matter.
          </li>
          <li>
            <strong>Look for the green row.</strong> If your file matches, the
            row for the right algorithm turns green and gets a tick after its
            name. No green row means no match, and section 4 explains what to
            do next.
          </li>
        </ol>
        <p>
          That is the whole of the <strong>file hash checker online</strong>{' '}
          workflow, and it is also the easiest way to{' '}
          <strong>compare two hashes online</strong>: paste one, and the tool
          checks it against every digest it just produced. Each row has its own{' '}
          <em>Copy</em> button if you need to paste a value elsewhere.
        </p>
        <p>
          It works the same way on any system, which covers two common
          searches. If you need a <strong>sha256 checksum on Windows without
          the command line</strong>, you do not have to learn certutil or
          PowerShell. And if you want to <strong>check a file hash on Mac
          online</strong> rather than typing shasum into Terminal, the steps
          above are all there is to it.
        </p>
      </section>

      {/* 3 */}
      <section id="which-algorithm" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          3. Which Hash Algorithm Is This? A Length Cheat Sheet
        </h3>
        <p>
          Download pages do not always say which algorithm they used. If you
          are asking <strong>which hash algorithm is this</strong>, the quick
          answer is that you do not need to know: the Compare box checks all
          six rows and lights up the one that fits. If you are curious anyway,
          the length of the hex string gives it away:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 not-prose my-6">
          {[
            ['CRC32', '8 hex characters'],
            ['MD5', '32 hex characters'],
            ['SHA-1', '40 hex characters'],
            ['SHA-256', '64 hex characters'],
            ['SHA-384', '96 hex characters'],
            ['SHA-512', '128 hex characters'],
          ].map(([name, len]) => (
            <div
              key={name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <p className="font-bold text-slate-900 dark:text-white text-base">{name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{len}</p>
            </div>
          ))}
        </div>
        <p>
          Some places publish a digest in Base64 instead of hex, most often
          for web integrity attributes and API headers. Tick{' '}
          <em>Show Base64 too</em> and each digest also appears in Base64,
          which is the quick route from <strong>sha256 to base64</strong>. The
          Compare box matches hex values only, so compare a Base64 value by
          eye against the line under the hex.
        </p>
        <p>
          SHA-3, SHA-224, BLAKE2, BLAKE3, RIPEMD-160, xxHash and CRC32C are not
          among the six. If a publisher uses one of those, this tool cannot
          check it, and the command-line tools in section 6 are the better
          route.
        </p>
      </section>

      {/* 4 */}
      <section id="does-not-match" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          4. Checksum Does Not Match: Causes and Fixes
        </h3>
        <p>
          When the <strong>checksum does not match</strong>, the file is not
          byte-for-byte the one the publisher hashed. Before assuming the
          worst, run through the ordinary causes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Extra characters in the paste.</strong> Many checksum
            files put the file name after the hash. Paste only the hex string,
            with no name, label or line break.
          </li>
          <li>
            <strong>The wrong file or version.</strong> A different edition,
            architecture or release has a different checksum. Check the name
            beside the hash against the file you downloaded.
          </li>
          <li>
            <strong>An incomplete download.</strong> A dropped connection can
            leave a file that looks right but is short. Compare the size shown
            on the file chip with the size on the download page, and download
            again.
          </li>
          <li>
            <strong>Text that is not quite the same.</strong> In Text mode the
            tool hashes exactly what is in the box. A trailing space or new
            line, which some terminal commands add without asking, gives a
            different digest.
          </li>
        </ul>
        <p>
          That is also <strong>how to tell if a download is corrupted</strong>:
          a mismatch after a fresh download from the official page means
          something is wrong with the copy, and you should not install it. A
          hash tells you <em>that</em> two files differ, not <em>where</em>. To
          see which lines changed between two texts, use the{' '}
          <Link to="/tools/diff-checker" className={LINK}>
            diff checker
          </Link>
          ; for two versions of a document, the{' '}
          <Link to="/tools/pdf-compare" className={LINK}>
            PDF compare tool
          </Link>{' '}
          shows the differences page by page.
        </p>
      </section>

      {/* 5 */}
      <section id="hmac" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          5. HMAC SHA256 Generator for Webhooks and APIs
        </h3>
        <p>
          An HMAC is a hash mixed with a secret key, defined in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc2104"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            RFC 2104
          </a>
          . Payment platforms and code hosts use it to sign webhook payloads,
          and many APIs use it to sign requests. If your signature check keeps
          failing, an <strong>hmac sha256 generator</strong> lets you work out
          the expected value by hand.
        </p>
        <p>
          Here is <strong>how to generate HMAC SHA256</strong> with the tool:
          paste the exact message body into the text box and type the secret
          into <em>HMAC key</em>. Every row becomes its keyed version
          (HMAC-MD5, HMAC-SHA-1, HMAC-SHA-256, HMAC-SHA-384 and HMAC-SHA-512),
          and the CRC32 row disappears because CRC has no keyed form. For an{' '}
          <strong>hmac sha256 webhook signature test</strong>, paste the
          signature from the request header into <em>Compare with</em>; if it
          is hex and your inputs are right, the HMAC-SHA-256 row turns green.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>The key is read as plain text.</strong> If your secret is
            given in hex or Base64, the result will not match what your server
            computes from the decoded bytes. The same goes for the message:
            hex or Base64 input is hashed as the characters you see. The{' '}
            <Link to="/tools/base64-encoder-decoder" className={LINK}>
              Base64 encoder and decoder
            </Link>{' '}
            can turn a Base64 value into readable text first when that is what
            it holds.
          </p>
        </div>
        <p>
          This row gives you a raw digest; it does not check a whole token. To
          read the header and claims of a JSON Web Token, use the{' '}
          <Link to="/tools/jwt-decoder" className={LINK}>
            JWT decoder
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="command-line" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-orange-500 shrink-0" />
          6. The Command-Line Equivalents, and the Limits
        </h3>
        <p>
          If you prefer a terminal, every major system has a built-in command
          that produces the same values:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Windows (Command Prompt):</strong>{' '}
            <code>certutil -hashfile yourfile.iso SHA256</code>
          </li>
          <li>
            <strong>Windows (PowerShell):</strong>{' '}
            <code>Get-FileHash yourfile.iso -Algorithm SHA256</code>
          </li>
          <li>
            <strong>macOS:</strong> <code>shasum -a 256 yourfile.iso</code>
          </li>
          <li>
            <strong>Linux:</strong> <code>sha256sum yourfile.iso</code>
          </li>
        </ul>
        <p>
          The terminal is also the right choice for the jobs this tool does
          not do. It hashes one file at a time, and the Compare box takes a
          single checksum, so it cannot check a whole SHA256SUMS or .md5 list
          line by line. It cannot hash a file from a web address. Very large
          files, such as multi-gigabyte ISO images, may be slow or fail to
          open, and there is no progress bar, so for those the commands above
          are more dependable. Password hashing schemes such as bcrypt, scrypt,
          Argon2 and PBKDF2 are not offered either.
        </p>
        <p>
          It also helps to know what a hash is not. Hashing is not encoding:
          if you need text in Base64 or percent-encoded for a URL, use the{' '}
          <Link to="/tools/base64-encoder-decoder" className={LINK}>
            Base64 tool
          </Link>{' '}
          or the{' '}
          <Link to="/tools/url-encoder" className={LINK}>
            URL encoder
          </Link>
          . And if you searched for a random hash for an ID or token, the{' '}
          <Link to="/tools/uuid-generator" className={LINK}>
            UUID generator
          </Link>{' '}
          produces genuinely random identifiers, whereas a hash is always the
          same for the same input.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Hash Generator
        </h3>
        <p>
          Many hash pages cover a single algorithm, so if you are not sure
          which one a checksum uses you end up trying several sites. Here is
          what is different, stated so you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Six digests at once', 'MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC32 appear together for every text or file, each with its own Copy button.'],
            ['Compare without guessing', 'Paste a published checksum and the matching row turns green with a tick, whichever algorithm the publisher chose.'],
            ['HMAC on the same page', 'Add a key and every row becomes its HMAC version, so testing a webhook signature needs no second tool.'],
            ['Your files stay private', 'Files and text are never stored on our servers and nothing you enter is retained after your session.'],
            ['Nothing is used for training', 'What you hash is never used for training. A private document stays yours by policy.'],
            ['Hex, uppercase or Base64', 'Switch to uppercase hex to match a listing exactly, or show each digest in Base64 for headers and integrity attributes.'],
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
          <Link to="/tools" className={LINK}>
            free developer and file tools
          </Link>{' '}
          built on the same terms, with no account and no sign-up.
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
              'Can you decrypt an MD5 hash?',
              'No. A hash is one-way: it is a fingerprint of the data, not an encrypted copy of it, so there is nothing to decrypt. Sites that claim to reverse MD5 are looking up hashes of common words they have already stored, which only works for short, guessable inputs. This tool does not attempt that.',
            ],
            [
              'Is MD5 secure?',
              'For spotting accidental corruption in a download, MD5 still does the job. For anything where someone might deliberately forge a match, such as signatures or certificates, it is considered broken, and it should never be used to store passwords. Prefer SHA-256 when you have the choice, and use a dedicated password hashing scheme such as bcrypt or Argon2 for passwords.',
            ],
            [
              'How do I check the SHA-256 of an ISO file?',
              'Set Source to File, drop the ISO on the panel and paste the SHA-256 value from the download page into Compare with. If the SHA-256 row turns green, your copy matches. For very large images that are slow to open here, the sha256sum, shasum or certutil command gives the same value.',
            ],
            [
              'What is a CRC32 checksum used for?',
              'CRC32 is a short 8-character checksum used to catch accidental errors, and it is the value ZIP archives and many ROM and firmware lists record. Drop the file here to get the CRC32 checksum of a file online and compare it with the listing. It is not designed to resist deliberate tampering, so use SHA-256 for that.',
            ],
            [
              'Can I hash several files at once?',
              'No, the tool takes one file at a time and the Compare box accepts a single checksum. To check a SHA256SUMS or .md5 list with many entries, the sha256sum or md5sum command with its check option is the faster route. For one or two files, drop each in turn.',
            ],
            [
              'Why does my HMAC not match what my server produces?',
              'The most common reasons are a key given in hex or Base64, since the HMAC key box reads plain text only, and a message that differs slightly, such as reformatted JSON or a missing trailing newline. Paste the raw body exactly as it was received. Also check that you are comparing against the HMAC-SHA-256 row and that the header value is hex rather than Base64.',
            ],
            [
              'Is it safe to hash a private file here?',
              'Your files and text are never stored on our servers, nothing is retained, and nothing is used for training. A digest cannot be turned back into the file, though a hash of a short, common word or password can be guessed by trying likely inputs, so treat hashes of secrets with the same care as the secrets themselves.',
            ],
            [
              'Does it support SHA-3 or bcrypt?',
              'No. It calculates MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC32, plus HMAC versions of the first five. SHA-3, SHA-224, BLAKE2, BLAKE3, RIPEMD-160 and password hashes such as bcrypt, scrypt, Argon2 and PBKDF2 are not available.',
            ],
          ].map(([q, a]) => (
            <div key={q}>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{q}</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
        <p>
          For the formal background on why MD5 is no longer trusted for
          security, see{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc6151"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            RFC 6151
          </a>
          .
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">
          Checksum verified and ready for the next step? Open a downloaded
          archive with the{' '}
          <Link to="/tools/extract-archive" className={LINK}>
            archive extractor
          </Link>
          , tidy an API response with the{' '}
          <Link to="/tools/json-formatter" className={LINK}>
            JSON formatter
          </Link>
          , read a Unix time from a log with the{' '}
          <Link to="/tools/timestamp-converter" className={LINK}>
            timestamp converter
          </Link>
          , or test a pattern with the{' '}
          <Link to="/tools/regex-tester" className={LINK}>
            regex tester
          </Link>
          . And if you would rather understand how signatures and checksums
          fit into real applications, our free{' '}
          <Link to="/learn/full-stack-web" className={LINK}>
            full-stack web development course
          </Link>{' '}
          covers the authentication and API groundwork behind tools like this
          one.
        </p>
      </div>
    </article>
  );
}
