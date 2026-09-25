import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  Binary,
  CalendarClock,
  Check,
  Clock,
  Globe,
  HelpCircle,
  History,
  Layers,
  ShieldCheck,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Unix Timestamp Converter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The unit is the real problem. The tool auto-detects seconds,
 *    milliseconds, microseconds and nanoseconds and says which it chose, so
 *    the page teaches the digit-count rule and the 1970 / year-57000 bugs.
 *
 * 2. Timezone honesty. An epoch value has no zone; the display zone only
 *    changes how it reads, and a typed string needs an offset to mean another
 *    zone. The fixed zone list is named rather than implied to be complete.
 *
 * 3. Limits are stated: one value at a time, no custom formats, no code
 *    snippets, no manual unit override. JWT readers are routed to jwt-decoder.
 */
export default function TimestampConverterSeoArticle() {
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
        The <span className="text-orange-600 dark:text-orange-400">Unix Timestamp Converter</span> Guide: Epoch to Date and Back, in Any Unit and the Right Time Zone
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A log line says <code>1758600000</code>. An API returns{' '}
        <code>1758600000123</code>. A database column holds a number with
        nineteen digits. All three count time since 1970, and all three are
        useless once you misread the unit. This guide explains what <strong>Unix time</strong>{' '}
        is, how to use a <strong>unix timestamp converter</strong> to turn a{' '}
        <strong>timestamp to date</strong> and a date back into a timestamp,
        how to tell seconds from milliseconds at a glance, and why a converted
        time sometimes lands in 1970, in the year 57,000, or a few hours off.
        The <strong>epoch converter</strong> above does both directions and
        names the unit it detected.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/timestamp-converter.webp"
            alt="Unix timestamp converter online free - converting epoch time in seconds, milliseconds, microseconds or nanoseconds to a readable date in UTC, IST or Pakistan time"
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
              One number, four possible units, any number of time zones. The
              converter tells you which unit it read, then shows the date.
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
            ['#what-is-unix-time', '1. What Unix Time Is, and the Current Unix Timestamp'],
            ['#timestamp-to-date', '2. How to Convert a Unix Timestamp to Date'],
            ['#date-to-timestamp', '3. Date to Unix Timestamp: ISO 8601, RFC 2822 and the Picker'],
            ['#seconds-or-milliseconds', '4. Seconds or Milliseconds? The Digit-Count Rule'],
            ['#wrong-year', '5. Timestamp Shows 1970 or the Wrong Year'],
            ['#time-zones', '6. Epoch Time Converter With Timezone: Why Hours Go Missing'],
            ['#why-cortexis', '7. Why Use the Cortexis Epoch Converter'],
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
      <section id="what-is-unix-time" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Unix Time Is, and the Current Unix Timestamp
        </h3>
        <p>
          <strong>Unix time</strong> is the number of seconds that have passed
          since 00:00:00 UTC on 1 January 1970, a moment known as the Unix
          epoch. The definition comes from the POSIX standard, and the{' '}
          <a
            href="https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Open Group&rsquo;s POSIX base definitions
          </a>{' '}
          spell out exactly how &ldquo;seconds since the epoch&rdquo; is
          counted. Being one plain integer, the same everywhere, it is how
          databases, logs, tokens and APIs record when something happened.
        </p>
        <p>
          The first card on the tool shows the <strong>current unix
          timestamp</strong> in seconds, ticking every second. That answers the
          most common version of <strong>how to get current epoch time</strong>:
          press <em>Copy</em> for a test, config file or API call, or{' '}
          <em>Use now</em> to load it into the converter below as a date.
        </p>
      </section>

      {/* 2 */}
      <section id="timestamp-to-date" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert a Unix Timestamp to Date
        </h3>
        <p>
          Here is <strong>how to convert unix timestamp to date</strong> with
          this <strong>epoch to date converter online free</strong> of
          accounts and limits.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Paste the number</strong> into the <em>Timestamp &rarr;
            Date</em> field. Commas, underscores and spaces are ignored, so{' '}
            <code>1,758,600,000</code> and <code>1_758_600_000</code> both work,
            and so do negative values for dates before 1970.
          </li>
          <li>
            <strong>Check the detected unit.</strong> The first result row says
            whether the value was read as seconds, milliseconds, microseconds
            or nanoseconds.
          </li>
          <li>
            <strong>Pick a display timezone.</strong> It starts on your own
            zone; switch to UTC or another zone and the date re-renders.
          </li>
          <li>
            <strong>Read the result:</strong> your chosen zone, UTC, ISO 8601,
            relative time such as &ldquo;3 hours ago&rdquo;, day of year (UTC),
            and the value in seconds and milliseconds.
          </li>
        </ol>
        <p>
          Anything that is not a number shows a clear &ldquo;Not a
          number&rdquo; error rather than a silent wrong date.
        </p>
        <p>
          Two readings deserve a note. The <em>Relative</em> row rounds to the
          nearest sensible unit and treats a month as 30 days and a year as 365,
          so treat &ldquo;4 months ago&rdquo; as a quick sense check, not an exact
          count; the UTC and ISO 8601 rows are the precise values. And a number
          so large or so negative that it falls outside the supported calendar
          range, hundreds of thousands of years away, does not produce a new
          date, so if the result does not change after you paste, check for a
          stray extra digit or two.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>One value at a time.</strong> There is no batch mode for a
            column pasted from a log or CSV, no custom output patterns such as
            YYYY-MM-DD HH:mm, and no ready-made code snippets. To tidy a pasted
            list before converting values one by one, the{' '}
            <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
              line tools
            </Link>{' '}
            can dedupe, sort and trim it first.
          </p>
        </div>
      </section>

      {/* 3 */}
      <section id="date-to-timestamp" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-orange-500 shrink-0" />
          3. Date to Unix Timestamp: ISO 8601, RFC 2822 and the Picker
        </h3>
        <p>
          The <em>Date &rarr; Timestamp</em> card is the{' '}
          <strong>date to unix timestamp converter</strong>, and it covers{' '}
          <strong>how to convert date to epoch</strong> two ways.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>The date and time picker</strong> accepts a calendar date
            and a time down to the second. It reads what you pick in your own
            time zone, the one your system clock is set to.
          </li>
          <li>
            <strong>The text field</strong> takes a date string. Paste an{' '}
            <a
              href="https://www.iso.org/iso-8601-date-and-time-format.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              ISO 8601
            </a>{' '}
            value from an API, such as <code>2025-09-23T04:00:00Z</code>, for{' '}
            <strong>iso 8601 to unix timestamp</strong>, or an email or HTTP
            header style date such as{' '}
            <code>Tue, 23 Sep 2025 04:00:00 +0000</code> for{' '}
            <strong>rfc 2822 date to timestamp</strong>.
          </li>
        </ul>
        <p>
          Either way you get Unix seconds, Unix milliseconds, ISO 8601 in UTC,
          the date in your display zone and a relative reading; an unreadable
          string shows &ldquo;Unrecognised date&rdquo;. Building a{' '}
          <strong>discord timestamp unix time</strong> tag like{' '}
          <code>&lt;t:1758600000:F&gt;</code>? Copy the seconds row and drop
          it between the colons.
        </p>
      </section>

      {/* 4 */}
      <section id="seconds-or-milliseconds" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Binary className="w-6 h-6 text-orange-500 shrink-0" />
          4. Seconds or Milliseconds? The Digit-Count Rule
        </h3>
        <p>
          Different systems count the same moment in different units, which is
          the whole answer to <strong>why is epoch time 10 digits vs 13
          digits</strong>. For any date in the present era, the length gives
          it away:
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['10 digits: seconds', 'Classic Unix time. Shell date +%s, Python int(time.time()), PHP time(), most SQL epoch functions and JWT claims.'],
            ['13 digits: milliseconds', 'Date.now() in web code, Java System.currentTimeMillis() and many web APIs. This is what a milliseconds to date converter is for.'],
            ['16 digits: microseconds', 'Common in database internals, tracing and analytics exports. A microsecond timestamp converter just divides by a million first.'],
            ['19 digits: nanoseconds', 'Go UnixNano(), Python time.time_ns() and many observability tools. A nanosecond timestamp to date is the same moment with nine extra digits.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          That is <strong>how to tell if timestamp is seconds or
          milliseconds</strong> by eye, and it is exactly what the converter
          does for you, so a <strong>Date.now() to date</strong> lookup is
          just a paste. Two honest caveats. Precision finer than one
          millisecond is dropped when microseconds or nanoseconds are shown as
          a date. And a seconds value of 10<sup>11</sup> or more, which would
          be a date beyond the year 5138, is read as milliseconds; there is no
          switch to force a different unit.
        </p>
      </section>

      {/* 5 */}
      <section id="wrong-year" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-orange-500 shrink-0" />
          5. Timestamp Shows 1970 or the Wrong Year
        </h3>
        <p>
          When a <strong>timestamp shows 1970</strong>, the cause is almost
          always a seconds value being treated as milliseconds. Take{' '}
          <code>1758600000</code>, which is 23 September 2025 at 04:00 UTC.
          Hand it to code that expects milliseconds and it becomes about 1.76
          million seconds after the epoch: 21 January 1970. Exactly 1 January
          1970 usually means a zero or empty value slipped through.
        </p>
        <p>
          The mirror image is a <strong>timestamp converts to wrong
          year</strong>, far in the future. Treat the millisecond value{' '}
          <code>1758600000123</code> as seconds and you land in the year
          57,697.
        </p>
        <p>
          The fix is to paste the raw number here and read the{' '}
          <em>Detected unit</em> row. If it says milliseconds and your code
          skips a division by 1,000, or says seconds and your code passes it to
          a milliseconds function, you have found the line to change.
        </p>
      </section>

      {/* 6 */}
      <section id="time-zones" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          6. Epoch Time Converter With Timezone: Why Hours Go Missing
        </h3>
        <p>
          An epoch value has no time zone. <code>1758600000</code> is one
          instant everywhere; only the way it is written changes. That is the
          key to a <strong>unix timestamp wrong timezone</strong> complaint:
          the number is right, and the reading was done in a zone you did not
          expect. For comparing server logs, read the{' '}
          <strong>unix timestamp to UTC</strong> row, which never changes.
        </p>
        <p>
          As an <strong>epoch time converter with timezone</strong>, the tool
          lets you choose UTC, your own zone, Asia/Karachi, Asia/Riyadh,
          Asia/Dubai, Europe/London, Europe/Berlin, America/New_York,
          America/Los_Angeles, Asia/Kolkata, Asia/Tokyo or Australia/Sydney.
          For <strong>unix timestamp to Pakistan time</strong>, choose
          Asia/Karachi: <code>1758600000</code> reads as Tuesday, 23 September
          2025 at 09:00:00 GMT+5. For an <strong>epoch to IST converter</strong>,
          choose Asia/Kolkata: 09:30:00 GMT+5:30.
        </p>
        <p>
          Going the other way needs one extra step. The picker and any typed
          string without an offset are read in your own zone, not the display
          zone, and a date-only string such as <code>2025-09-23</code> is read
          as midnight UTC. To find the epoch value for 9am in New York while
          sitting in Karachi, type the offset yourself:{' '}
          <code>2025-09-23T09:00:00-04:00</code>. The zone list is fixed; other
          zones and manual display offsets are not available.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Epoch Converter
        </h3>
        <p>
          The hard part of reading a timestamp is rarely the arithmetic; it is
          knowing which unit and which zone you are looking at. This converter
          is built around answering both.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Unit shown, not assumed', 'Seconds, milliseconds, microseconds and nanoseconds are detected by size, and the result says which one was used, so a 1970 or far-future date never goes unexplained.'],
            ['Both directions, one screen', 'Timestamp to date and date to timestamp sit side by side, with a live current Unix time counter, Copy and Use now above them.'],
            ['More than one reading', 'Your chosen zone, UTC, ISO 8601, relative time, day of year, and the value in both seconds and milliseconds, all at once.'],
            ['Accepts messy input', 'Thousands separators, underscores, spaces and negative pre-1970 values are fine. ISO 8601 and RFC 2822 strings convert too.'],
            ['Your data stays private', 'Nothing you enter is ever stored on our servers or retained, and it is never used for training.'],
            ['Genuinely free', 'No sign-up, no email, no daily counter and no paywall. The tool on this page is the whole product.'],
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
          What it does not do is worth saying as plainly. It does not
          calculate the difference between two timestamps or add days to a
          date, and it reads only the Unix epoch, not spreadsheet serial dates
          or Windows FILETIME. For a token, the{' '}
          <Link to="/tools/jwt-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JWT decoder
          </Link>{' '}
          reads the whole thing, and for IDs that embed a time, the{' '}
          <Link to="/tools/uuid-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            UUID generator
          </Link>{' '}
          is the right tool. It is one of a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free developer tools
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
              'How do I convert a Unix timestamp to a date for free?',
              'Paste the number into the Timestamp to Date field at the top of this page. The unit is detected automatically and the date appears in UTC, ISO 8601 and your chosen display timezone, with no account or limit.',
            ],
            [
              'How can I tell if a timestamp is in seconds or milliseconds?',
              'Count the digits: 10 for seconds, 13 for milliseconds, 16 for microseconds and 19 for nanoseconds, for any date in the present era. The converter applies the same rule and shows the unit it used in the Detected unit row.',
            ],
            [
              'Why does my timestamp convert to January 1970?',
              'A seconds value was almost certainly treated as milliseconds, which lands it a few weeks after the epoch. An exact 1 January 1970 usually means the value was zero or empty. Paste the raw number here to see its real unit and date.',
            ],
            [
              'Why is my converted time a few hours off?',
              'The timestamp itself has no time zone, so the number is fine and the reading was done in a different zone than you expected. Compare the UTC row with the zone row, and when converting a typed date, add an offset such as +05:00 if you mean a zone other than your own.',
            ],
            [
              'How do I convert Date.now() to a date?',
              'Date.now() returns milliseconds since 1970, a 13-digit number such as 1758600000123. Paste it into the Timestamp to Date field and the Detected unit row reads milliseconds, with the date shown in UTC, ISO 8601 and your display zone. In your own code, pass the value straight to new Date(value); if it was divided by 1,000 to get seconds, multiply it back first or the date lands in January 1970.',
            ],
            [
              'How do I read the exp claim of a JWT as a date?',
              'The exp, iat and nbf claims are Unix timestamps in seconds, so a jwt exp timestamp to date lookup is a simple paste here. To read the whole token, use the JWT decoder.',
            ],
            [
              'What is the Year 2038 problem?',
              'Systems that store Unix time as a signed 32-bit integer can only count up to 2,147,483,647 seconds, which is 19 January 2038 at 03:14:07 UTC. One second later the value overflows and can wrap to 1901. Paste 2147483647 here to see the boundary; the fix belongs in the software that stores the value.',
            ],
            [
              'Can I convert a negative Unix timestamp?',
              'Yes. A negative unix timestamp counts backwards from 1970, so -31536000 is 1 January 1969 at midnight UTC. Paste it with the minus sign and it converts like any other value.',
            ],
            [
              'Does Unix time include leap seconds?',
              'No. Unix time treats every day as exactly 86,400 seconds and ignores leap seconds, which is why it maps cleanly onto calendar dates. For everyday conversions this makes no visible difference.',
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
          Working through an API response? Tidy it with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , reshape an export with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , match timestamps in log lines with the{' '}
          <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
            regex tester
          </Link>
          , or tidy a query on an epoch column with the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>
          . And if you would rather write this kind of date handling yourself,
          our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          and{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          cover the date and time handling behind tools like this one.
        </p>
      </div>
    </article>
  );
}
