import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  FileText,
  HelpCircle,
  Layers,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Word Counter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The counting rules are written out with examples, because that is where
 *    counts disagree and why most problem-aware visitors arrive. Every rule
 *    matches the code: hyphens and apostrophes join, commas and full stops
 *    split, a blank line starts a paragraph, "Dr." ends a sentence.
 *
 * 2. Reading time is adjustable (80 to 600 wpm, default 230) and speaking time
 *    is fixed at 150 wpm, so the worked examples use only those two figures.
 *
 * 3. The limits are stated plainly: single-word density only, no PDF or DOCX
 *    import, no readability score, raw characters for posts and meta
 *    descriptions. Each one routes to a sibling tool where one exists.
 */
export default function WordCounterSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        The Free <span className="text-orange-600 dark:text-orange-400">Word Counter</span>: Word Count, Character Count, Reading Time and the Rules Behind Every Number
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An essay with a hard limit, a bio field that cuts you off, a talk that
        must fit five minutes: each starts with the same question, and a{' '}
        <strong>word counter</strong> answers it as you type. This guide shows
        how to get an exact <strong>word count</strong> and{' '}
        <strong>character count</strong> for free, explains precisely what
        counts as a word here and why programs disagree, and covers reading
        time, speaking time, keyword density and common character limits.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/word-counter.webp"
            alt="A vintage typewriter on a wooden writing desk with notebooks and a pen"
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
              Ten figures update with every keystroke, and the rules behind each
              one are written out below.
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
            ['#what-it-counts', '1. What a Word Counter and Character Counter Measure'],
            ['#how-to-count', '2. How to Count Words in a Text in Three Steps'],
            ['#counting-rules', '3. Why Your Word Count Is Different: The Rules'],
            ['#reading-time', '4. Reading Time Calculator and Speaking Time'],
            ['#density-limits', '5. Keyword Density, Post Limits and Meta Descriptions'],
            ['#essays-limits', '6. Essays, Applications and What It Does Not Do'],
            ['#why-cortexis', '7. Why Use the Cortexis Word Counter'],
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
      <section id="what-it-counts" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Word Counter and Character Counter Measure
        </h3>
        <p>
          A limit might be in words, characters or paragraphs, so the tool
          above is also a <strong>character counter</strong>, a{' '}
          <strong>sentence counter</strong> and a{' '}
          <strong>paragraph counter</strong>, showing ten figures side by side:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Words</strong> and <strong>Characters</strong>, the two
            numbers most limits are written in.
          </li>
          <li>
            <strong>Chars (no spaces)</strong>, for the forms and style guides
            that exclude spaces, line breaks and tabs.
          </li>
          <li>
            <strong>Sentences</strong>, <strong>Paragraphs</strong> and{' '}
            <strong>Lines</strong>, for structure checks and line-based formats.
          </li>
          <li>
            <strong>Unique words</strong>, counted without regard to capital
            letters: a <strong>unique word counter</strong> for checking
            vocabulary variety.
          </li>
          <li>
            <strong>Avg word length</strong>, plus <strong>Reading time</strong>{' '}
            and <strong>Speaking time</strong> (section 4).
          </li>
        </ul>
        <p>
          Below them sit a keyword density table, your five longest words, and
          a tally against a 280-character post and a 160-character meta
          description. Every figure recalculates as you type.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-count" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Count Words in a Text in Three Steps
        </h3>
        <p>
          Here is <strong>how to count words in a text</strong> that sits in an
          email or form rather than a word processor. Searching for a{' '}
          <strong>free word count tool no sign up</strong> needed? This is a{' '}
          <strong>word counter online free</strong> of accounts, emails and usage
          caps.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your text.</strong> Clear the sample paragraph and paste
            or type. To <strong>count words in txt file</strong> form, drop a
            .txt, .md or .csv file on the strip above the box; its text replaces
            whatever was there.
          </li>
          <li>
            <strong>Set your reading speed.</strong> The field defaults to 230
            words per minute; choose anything from 80 to 600.
          </li>
          <li>
            <strong>Edit until it fits.</strong> Watch the counts move, then
            press <em>Copy text</em> to take the final version back.
          </li>
        </ol>
        <p>
          Markdown is read as plain text, so heading marks and link syntax are
          counted too. For the rendered words only, open the file in the{' '}
          <Link to="/tools/markdown-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Markdown converter
          </Link>
          , copy the text from its live preview, and paste that here. A .csv
          file is read the same way, so every comma-separated cell counts as
          its own words and each row adds a line.
        </p>
      </section>

      {/* 3 */}
      <section id="counting-rules" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          3. Why Your Word Count Is Different: The Rules
        </h3>
        <p>
          Paste one essay into three programs and you can get three numbers,
          hence searches like <strong>why is my word count different</strong>{' '}
          and <strong>word count different in Google Docs and Word</strong>.
          Each program makes its own decisions about hyphens, dashes, numbers
          and punctuation, and few publish them. Here are ours.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-orange-500 shrink-0" /> Counted as one word
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A word starts with a letter or digit and continues through
              letters, digits, apostrophes and hyphens. So &ldquo;don&rsquo;t&rdquo;,
              &ldquo;well-being&rdquo; and &ldquo;mother-in-law&rdquo; are one word
              each, with straight or curly apostrophes. Accented and non-Latin
              letters join words like any other letter.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" /> Counted as two or more
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Commas, full stops, slashes and dashes split words. &ldquo;1,500&rdquo;,
              &ldquo;3.5&rdquo;, &ldquo;U.K.&rdquo; and &ldquo;and/or&rdquo; count as
              two each, and two words joined by a long dash count separately.
              Stand-alone symbols such as &amp; are not words at all.
            </p>
          </div>
        </div>
        <p>
          So, <strong>do hyphenated words count as one word</strong>? Here,
          yes. A sentence ends at a full stop, question mark, exclamation mark
          or ellipsis followed by a space, so &ldquo;Dr. Patel&rdquo; ends one
          early. Paragraphs are separated by blank lines, so single line breaks
          do not start a new paragraph. Every line break, blank lines included,
          adds a line.
        </p>
        <p>
          On <strong>how to count characters with spaces</strong>: the{' '}
          <em>Characters</em> figure includes every space and line break, and a
          typed accented letter such as &ldquo;&eacute;&rdquo; normally counts
          once. <em>Chars (no spaces)</em> drops all
          whitespace. If a limit does not say which, assume spaces count.
        </p>
        <p>
          For a submission portal or grant form, treat that system&rsquo;s
          number as final and leave a few words of margin. Copied text can also
          lose footnotes, captions or text boxes on the way. To see what changed
          between two drafts, use the{' '}
          <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            diff checker
          </Link>
          .
        </p>
      </section>

      {/* 4 */}
      <section id="reading-time" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500 shrink-0" />
          4. Reading Time Calculator and Speaking Time
        </h3>
        <p>
          The tool doubles as a <strong>reading time calculator</strong>,
          dividing your word count by the speed you set. As a{' '}
          <strong>blog post reading time estimator</strong>, paste the finished
          post, round the figure, and you have your &ldquo;min read&rdquo;
          label.
        </p>
        <p>
          <strong>How long does it take to read 1000 words?</strong> At the
          default 230 words per minute, the tool shows 4 min 21 s. Lower the
          speed for technical material or second-language readers, raise it for
          light content, and keep one setting across a blog so labels agree.
        </p>
        <p>
          Speaking is slower than reading, so the{' '}
          <strong>speech word counter speaking time</strong> figure uses a fixed
          150 words per minute. <strong>How long is a 5 minute speech in words</strong>?
          At that pace, about 750. If you pause for slides or speak slowly,
          write shorter, and time one read-through aloud.
        </p>
      </section>

      {/* 5 */}
      <section id="density-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-orange-500 shrink-0" />
          5. Keyword Density, Post Limits and Meta Descriptions
        </h3>
        <p>
          <strong>How to check keyword density</strong>: paste your draft and
          read the <em>Keyword density</em> table. As a{' '}
          <strong>keyword density checker</strong>, it lists the twelve most
          frequent words with their count and share of all words. Common English
          filler words and words under three letters are skipped, so the table
          shows what your text is about.
        </p>
        <p>
          It counts single words only, so a two-word phrase appears as its
          halves, and the filler list is fixed and English-only. Use it as a
          sanity check that no word is crowding the page, not a target.
        </p>
        <p>
          The line below works as a <strong>tweet character counter 280</strong>{' '}
          check and a <strong>meta description character counter</strong> for
          the common 160-character guideline, showing characters left or over.
          Both use the raw count; X counts each link as 23 and CJK characters as
          two, so near the limit, trust the post box.
        </p>
        <p>
          <strong>Is the meta description too long?</strong> There is no fixed
          character rule. According to{' '}
          <a
            href="https://developers.google.com/search/docs/appearance/snippet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Google Search Central&rsquo;s guidance on snippets
          </a>
          , descriptions can be any length but are shortened to fit the
          display, which depends on width rather than characters. Staying near
          160, key point first, is a sensible habit.
        </p>
      </section>

      {/* 6 */}
      <section id="essays-limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PenLine className="w-6 h-6 text-orange-500 shrink-0" />
          6. Essays, Applications and What It Does Not Do
        </h3>
        <p>
          As an <strong>essay word counter</strong>, keep it open beside your
          draft and paste each revision in. Applicants looking for a{' '}
          <strong>word counter for college application essay 650 words</strong>{' '}
          limits need only the <em>Words</em> figure, plus a few words of margin
          in case the portal counts hyphens or numbers differently. Unpublished
          manuscripts are safe here too: text is never stored on our servers,
          nothing is retained, and nothing is used for training.
        </p>
        <p>What it does not do, and where to go instead:</p>
        <ul className="space-y-2">
          <li>
            <strong>Word documents and PDFs</strong> do not load directly; only
            .txt, .md and .csv files do. Paste the text in, or turn a PDF into
            text with the{' '}
            <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to text converter
            </Link>{' '}
            or the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word converter
            </Link>
            .
          </li>
          <li>
            <strong>Scanned pages and photos</strong> contain no text to count.
            Run them through{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image OCR
            </Link>{' '}
            first, then paste the result.
          </li>
          <li>
            <strong>Changing case or tidying lines</strong> is handled by the{' '}
            <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              case converter
            </Link>{' '}
            and{' '}
            <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
              line tools
            </Link>
            , which sort, deduplicate and trim.
          </li>
          <li>
            <strong>Grammar, spelling, plagiarism, page count, syllables and
            readability grades</strong> are not calculated, and there is no
            Cortexis tool for them yet.
          </li>
          <li>
            <strong>Chinese, Japanese and Thai</strong> have no spaces between
            words, so each unbroken run counts as one word; use the character
            count instead.
          </li>
          <li>
            <strong>Saving or exporting figures</strong>, or counting several
            files at once, is not possible.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Word Counter
        </h3>
        <p>
          Counting is easy; a count you can trust and explain is not. Here is
          what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no account', 'No sign-up, no email and no usage cap. Paste as many drafts as you like, as often as you like.'],
            ['Rules you can read', 'Every counting decision, from hyphens to abbreviations, is written out on this page, so a different number elsewhere has an explanation.'],
            ['Ten figures at once', 'Words, characters with and without spaces, sentences, paragraphs, lines, unique words, average word length, reading time and speaking time.'],
            ['Reading speed you control', 'Set anything from 80 to 600 words per minute for reading time; speaking time uses a steady 150 for scripts and talks.'],
            ['Your writing stays private', 'Text is never stored on our servers and nothing is retained after you leave, which matters for unpublished work.'],
            ['Never used for training', 'Your essays, manuscripts and drafts are never used to train any model.'],
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
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free text and document tools
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
              'How do I get a word count for my text?',
              'Paste or type the text into the box at the top of this page, or drop a .txt, .md or .csv file onto the strip above it. The word count and nine other figures appear at once and update as you edit.',
            ],
            [
              'Why is my word count different from Google Docs or Word?',
              'Each program makes its own choices about hyphens, dashes, numbers and abbreviations. Here, hyphenated words and contractions count once, while 1,500 and U.K. count as two. For a submission, treat the official system as final.',
            ],
            [
              'Does the character count include spaces?',
              'The Characters figure includes every space and line break. Chars (no spaces) leaves all of them out. If a limit does not say which it means, assume spaces are included.',
            ],
            [
              'How long does it take to read 1000 words?',
              'At the default reading speed of 230 words per minute, the tool shows 4 min 21 s. Set your own speed between 80 and 600 words per minute and the reading time updates immediately.',
            ],
            [
              'How many words is a 5 minute speech?',
              'At the tool\'s speaking pace of 150 words per minute, about 750 words. If you speak slowly, aim lower.',
            ],
            [
              'Can it check keyword phrases, or count words in a PDF?',
              'The density table covers single words only, so phrases appear as separate words. PDFs and Word files do not load directly. Convert a PDF with the PDF to text converter, or a scanned one with PDF OCR, then paste the text.',
            ],
            [
              'Will my meta description fit in search results?',
              'The tool shows characters left or over against 160, a common guideline. Results are shortened by display width, not a fixed character count, so put the key point first.',
            ],
            [
              'Is my essay or manuscript kept anywhere?',
              'No. Your text is never stored on our servers, nothing is retained after you close the page, and it is never used for training.',
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
          <FileText className="inline w-4 h-4 text-orange-500 mr-1 align-text-bottom" />
          Text counted and ready for the next step? Fix capitalisation with the{' '}
          <Link to="/tools/case-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            case converter
          </Link>
          , clean up lists with the{' '}
          <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            line tools
          </Link>
          , compare two drafts with the{' '}
          <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            diff checker
          </Link>
          , or read more writing and productivity guides on the{' '}
          <Link to="/blog" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Cortexis blog
          </Link>
          . And if you would like to build tools like this yourself, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the groundwork.
        </p>
      </div>
    </article>
  );
}
