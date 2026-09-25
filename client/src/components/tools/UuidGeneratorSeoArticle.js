import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Database,
  Fingerprint,
  HelpCircle,
  KeyRound,
  Layers,
  ListOrdered,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the UUID Generator tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The page is sold as the one place for every random value a developer
 *    needs (v4, v7, ULID, secrets, API keys, passwords, PINs), because most
 *    ranking pages only do UUIDs.
 *
 * 2. The v7 and ULID same-millisecond ordering caveat is stated, because the
 *    code has no monotonic counter and nobody else says it.
 *
 * 3. The gaps (v1/v3/v5, braces and uppercase, validation, decoding) are
 *    named and routed to case-converter, line-tools and timestamp-converter.
 */
export default function UuidGeneratorSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">UUID Generator</span> Guide: v4, v7, ULID, GUIDs, Secrets and Passwords in Bulk
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A migration needs a primary key, a test fixture needs two hundred IDs,
        and a new auth setup wants a signing secret. Most sites handle only one
        of those jobs. This page is a{' '}
        <strong>UUID generator</strong>, a <strong>GUID generator</strong> and a{' '}
        <strong>random password generator</strong> in one place: it makes
        version 4 and version 7 UUIDs, ULIDs, 256-bit secrets, prefixed API keys,
        passwords and PINs, one at a time or in batches. Below: which ID type to
        choose, how to get it, and what the tool does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/uuid-generator.webp"
            alt="Free online UUID generator making bulk UUID v4, UUID v7 and ULID values alongside a 256-bit JWT secret key and a prefixed API key"
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
              One page for every random value a project needs: IDs that sort,
              IDs that do not, and secrets that should never be guessed.
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
            ['#what-is-a-uuid', '1. What a UUID Is, and the UUID vs GUID Difference'],
            ['#how-to-generate', '2. How to Generate a UUID, or a Thousand, in Four Steps'],
            ['#v4-vs-v7', '3. UUID v4 vs v7 vs ULID for Database Keys'],
            ['#secrets-and-keys', '4. JWT Secrets, API Keys and 256-bit Keys'],
            ['#passwords-and-pins', '5. Random Passwords and PINs'],
            ['#limits', '6. What This UUID Generator Does Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free UUID Generator'],
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
      <section id="what-is-a-uuid" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a UUID Is, and the UUID vs GUID Difference
        </h3>
        <p>
          A UUID (universally unique identifier) is a 128-bit value written as
          32 hexadecimal characters in five groups, 8-4-4-4-12. It lets any
          system create an ID on its own, with no central counter, and still
          be confident nobody else will create the same one. The
          format is defined in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9562"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            RFC 9562
          </a>
          , which replaced the older RFC 4122 and added version 7.
        </p>
        <p>
          The <strong>UUID vs GUID difference</strong> is only a name: GUID (globally unique identifier) is Microsoft&rsquo;s
          name for the same 128-bit format, and a .NET <code>Guid</code> or SQL
          Server <code>uniqueidentifier</code> accepts a standard UUID string as
          is. Windows tools often show GUIDs uppercase inside braces; section 6
          shows how to convert to that style.
        </p>
        <p>
          <strong>Are UUIDs really unique?</strong> Not by guarantee, but by
          probability. A version 4 UUID carries 122 random bits (the other six
          mark the version and variant), so an accidental repeat is not a
          practical concern if the random source is good. Real collisions come
          from weak generators, not the format.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-generate" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Generate a UUID, or a Thousand, in Four Steps
        </h3>
        <p>
          If you are wondering <strong>how to generate a UUID</strong> without
          opening a terminal, this is the quickest route: an{' '}
          <strong>online UUID generator free</strong> of sign-ups, with output
          ready the moment the page opens.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Pick the type.</strong> The default is <em>UUID v4 (random)</em>;
            switch to <em>UUID v7 (time-ordered)</em> or <em>ULID</em> for IDs
            that sort by creation time, or to a secret, key, password or PIN.
          </li>
          <li>
            <strong>Set how many.</strong> <em>How many</em> starts at five. As
            a <strong>bulk UUID generator</strong>, it lets you{' '}
            <strong>generate 1000 UUIDs</strong> for seed data: type 1000.
          </li>
          <li>
            <strong>Regenerate if needed.</strong> Each click draws a fresh
            batch.
          </li>
          <li>
            <strong>Copy or download.</strong> <em>Copy all</em> copies the
            list, one value per line; <em>Download .txt</em>{' '}
            saves a text file named after the type, such as{' '}
            <code>uuid4.txt</code>.
          </li>
        </ol>
        <p>
          For JSON or insert statements, pair the list with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>
          .
        </p>
      </section>

      {/* 3 */}
      <section id="v4-vs-v7" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-orange-500 shrink-0" />
          3. UUID v4 vs v7 vs ULID for Database Keys
        </h3>
        <p>
          The <strong>UUID v4 vs v7</strong> question usually follows a
          problem: a table keyed on random UUIDs grows, and someone searches{' '}
          <strong>UUID primary key slow insert</strong>. The cause is the key
          itself. A B-tree index keeps keys in order, random values land all
          over it, and the index fragments.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-orange-500 shrink-0" /> UUID v4
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Fully random, revealing nothing about when it was made. Use the{' '}
              <strong>UUID v4 generator</strong> for public IDs and anywhere
              order does not matter.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500 shrink-0" /> UUID v7
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The first 48 bits are a millisecond timestamp and the rest is
              random, so new keys land at the end of the index. The{' '}
              <strong>UUID v7 generator</strong> fixes slow inserts in the
              standard format.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-orange-500 shrink-0" /> ULID
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              26 uppercase characters: a 10-character timestamp then 16 random
              ones. The <strong>ULID generator</strong> suits logs, file names
              and URLs.
            </p>
          </div>
        </div>
        <p>
          <strong>ULID vs UUID</strong> comes down to where the ID will live.
          If the column is a native <code>uuid</code> type, choose v7: it
          stores in 16 bytes like any UUID. If the ID travels as text, ULID is
          shorter and sorts as a plain string. So when you need to{' '}
          <strong>generate UUID for Postgres primary key</strong> columns or
          seed SQL, v7 pastes straight into a <code>uuid</code> column.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Same-millisecond ordering is not guaranteed.</strong> v7
            values and ULIDs made in the same millisecond share a timestamp
            and differ only in their random part, so a batch sorts across
            milliseconds but not strictly within one. Indexes do not mind; if
            you need strict creation order, keep a sequence column.
          </p>
        </div>
      </section>

      {/* 4 */}
      <section id="secrets-and-keys" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          4. JWT Secrets, API Keys and 256-bit Keys
        </h3>
        <p>
          A UUID is an identifier, not a secret: part of it is fixed, and IDs
          end up in logs and URLs, so never sign tokens with one. For secrets, dedicated options produce raw
          random bytes with a <em>Size</em> of 16, 32 or 64 bytes (32 by
          default).
        </p>
        <ul className="space-y-2">
          <li>
            <strong>How to generate a JWT secret key:</strong>{' '}
            <a
              href="https://www.rfc-editor.org/rfc/rfc7518#section-3.2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              RFC 7518
            </a>{' '}
            requires an HS256 key of at least 256 bits. As a{' '}
            <strong>JWT secret generator</strong>, choose{' '}
            <em>Base64url secret</em> at 32 bytes.
          </li>
          <li>
            <strong>256-bit keys.</strong> A{' '}
            <strong>secret key generator 256 bit</strong> means 32 random
            bytes, here as <em>Hex secret</em> (64 characters) or{' '}
            <em>Base64 secret</em>. As a{' '}
            <strong>random hex string generator</strong>, the size sets the
            byte length.
          </li>
          <li>
            <strong>openssl rand -base64 32 online.</strong> That command
            prints 32 random bytes in Base64; <em>Base64 secret</em> at 32 bytes
            is the equivalent without a terminal. It is also the{' '}
            <strong>NextAuth secret generator</strong> you need for an{' '}
            <code>AUTH_SECRET</code> value.
          </li>
          <li>
            <strong>Base64url random string generator:</strong> Base64url
            swaps the two characters that clash with URLs, so the token goes in
            a link or cookie without escaping.
          </li>
        </ul>
        <p>
          For <strong>how to generate a random API key</strong>, the{' '}
          <em>API key (prefix_base62)</em> option follows the familiar{' '}
          <strong>Stripe-style API key format, sk_</strong> plus 32 letters and
          digits, with <code>sk</code>, <code>pk</code>, <code>ctx</code> or{' '}
          <code>api</code> as the prefix. A prefix makes a leaked key easy to
          spot in a log. Use this <strong>API key generator</strong> for test
          keys and seeding environments; in production, store a hash of each
          key rather than the key, which the{' '}
          <Link to="/tools/hash-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            hash generator
          </Link>{' '}
          can produce.
        </p>
      </section>

      {/* 5 */}
      <section id="passwords-and-pins" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          5. Random Passwords and PINs
        </h3>
        <p>
          <em>Password</em> offers a length of 4 to 128 characters (default
          20) and lowercase, uppercase, digit and symbol sets, each character
          picked without bias. A line under the list estimates the bits of
          entropy and labels it weak, good or strong.
        </p>
        <p>
          The fifth checkbox makes this a{' '}
          <strong>password generator without ambiguous characters</strong>. It
          removes <code>0 O 1 l I |</code>, which look alike in many fonts and
          trip people up when a password is read aloud. It is on by default,
          and the strength estimate ignores it, so read that figure as
          slightly generous.
        </p>
        <p>
          As a <strong>random PIN generator</strong>, <em>Numeric PIN</em> uses
          the same length slider and produces evenly distributed digits.
        </p>
        <p>
          <strong>Is it safe to generate passwords online?</strong> It depends
          on what the site does with them. Here, generated values are never
          stored on our servers, never logged, never retained and never used
          for training. Put each one straight into a password manager.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This UUID Generator Does Not Do
        </h3>
        <p>
          The honest gaps, and where to go instead:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>No v1, v3, v5 or NIL UUIDs.</strong> Only v4, v7 and ULID
            are offered; name-based v5 IDs need a UUID library in your code.
          </li>
          <li>
            <strong>No uppercase, braced or hyphen-free formatting.</strong>{' '}
            Output is always lowercase 8-4-4-4-12. For a Microsoft-style GUID,
            run the list through the{' '}
            <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              case converter
            </Link>{' '}
            to uppercase it, then use the prefix and suffix option in{' '}
            <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
              line tools
            </Link>{' '}
            to wrap each line in <code>{'{'}</code> and <code>{'}'}</code>.
            To strip the hyphens, paste the list into the{' '}
            <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
              regex tester
            </Link>
            , match <code>-</code> with the global flag and replace it with
            nothing.
          </li>
          <li>
            <strong>No validation or decoding.</strong> It cannot check a UUID
            or read the timestamp in a v7 UUID or ULID; once you have the
            millisecond value, the{' '}
            <Link to="/tools/timestamp-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              timestamp converter
            </Link>{' '}
            turns it into a readable date.
          </li>
          <li>
            <strong>No NanoID, CUID or Snowflake IDs</strong>, and no custom
            alphabets or custom API key prefixes beyond the four listed.
          </li>
          <li>
            <strong>No hashing, signing or key pairs.</strong> It creates
            random values. Hash with the hash generator, and inspect tokens
            with the{' '}
            <Link to="/tools/jwt-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JWT decoder
            </Link>
            . RS256 or ES256 key pairs are outside this tool.
          </li>
          <li>
            <strong>No vault or breach check</strong>, and no rating of a
            password you type in.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free UUID Generator
        </h3>
        <p>
          Most UUID pages do only UUIDs. Here is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Every random value in one place', 'UUIDs, ULIDs, secrets, API keys, passwords and PINs share one page and one set of buttons.'],
            ['Large batches, no cap to fight', 'Ask for five or a thousand, then copy the list or download it as a text file.'],
            ['Cryptographically secure randomness', 'Every value comes from a cryptographically secure source, with characters picked without bias.'],
            ['Honest about v7 and ULID', 'Both sort by creation time, and we say plainly that order within one millisecond is not guaranteed.'],
            ['Nothing is kept', 'Generated IDs, secrets and passwords are never stored on our servers, never logged, never retained and never used for training.'],
            ['Free, with no account', 'No sign-up, no email and no daily limit.'],
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
            free developer and file tools
          </Link>{' '}
          built on the same terms: free, no account, and nothing you make is
          kept.
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
              'How do I generate a UUID for free?',
              'Open the tool at the top of this page and a batch of version 4 UUIDs is already waiting. Change the type or the How many box, then press Copy all or Download .txt.',
            ],
            [
              'Is a GUID the same as a UUID?',
              'Yes. GUID is Microsoft\'s name for the same 128-bit identifier, and a standard UUID string works in a .NET Guid or SQL Server uniqueidentifier column. For the uppercase braced style, use the case converter and line tools.',
            ],
            [
              'Should I use UUID v4 or v7 for a primary key?',
              'For a database primary key, v7 is usually better, because its leading timestamp keeps new rows near the end of the index. Use v4 when the ID is public and should reveal nothing about when it was created. Both fit the same column type.',
            ],
            [
              'Can two UUIDs ever be the same?',
              'In theory yes, in practice no, as long as the random source is secure. Real collisions come from weak random number generators, not from the format, and every value here uses a cryptographically secure source.',
            ],
            [
              'Are v7 UUIDs and ULIDs generated here strictly in order?',
              'They sort correctly across milliseconds, but values made within the same millisecond are ordered by their random part. That keeps indexes healthy but is not a strict sequence, so keep a separate sequence column if exact order matters.',
            ],
            [
              'How long should a JWT HS256 secret be?',
              'At least 256 bits, which is 32 random bytes, as the JWA specification requires. Choose Base64url secret or Base64 secret at 32 bytes. Do not use a UUID as a signing secret.',
            ],
            [
              'Can it make uppercase or braced GUIDs, or v5 UUIDs?',
              'Not directly. Output is always lowercase with hyphens, so uppercase it with the case converter, add braces with the prefix and suffix option in line tools, and remove hyphens with a replace in the regex tester. Version 1, 3 and 5 UUIDs are not offered.',
            ],
            [
              'Do you keep the passwords and secrets I generate?',
              'No. Generated values are never stored on our servers, never logged, never retained and never used for training. Copy what you need into a password manager before you leave, because it cannot be recovered later.',
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
          Building the rest of the stack? Tidy a response with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , encode a payload with the{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder and decoder
          </Link>
          , test a validation pattern with the{' '}
          <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
            regex tester
          </Link>
          , or share a Wi-Fi password as a scannable code with the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code generator
          </Link>
          . To learn how IDs, secrets and auth fit together, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers it from the ground up.
        </p>
      </div>
    </article>
  );
}
