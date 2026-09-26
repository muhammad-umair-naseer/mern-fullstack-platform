import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CaseSensitive,
  Check,
  Code,
  Eraser,
  HelpCircle,
  Layers,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Case Converter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The exact rules are spelled out: which small words Title Case keeps
 *    lowercase, that acronyms and proper nouns are flattened in Title and
 *    Sentence case, and how the code cases split words. Rival pages list the
 *    buttons and stop.
 *
 * 2. Writers and developers are served on one page, so the naming-convention
 *    section sits beside the headline and caps-lock sections.
 *
 * 3. What it cannot do (formatted documents, file names, URL encoding, line
 *    work, word counts) is routed to the sibling tool that does it.
 */
export default function CaseConverterSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">Case Converter</span> Guide: Uppercase to Lowercase, Title Case, camelCase and What Every Button Really Does
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A paragraph typed with Caps Lock on. A headline you are unsure how to capitalise. A spreadsheet header that must become a variable name. All the same small job, and a good <strong>case converter</strong> does it in the time it
        takes to paste. This guide shows how to <strong>convert case</strong>{' '}
        with the tool above, from <strong>uppercase to lowercase</strong> and{' '}
        <strong>lowercase to uppercase</strong> through to a{' '}
        <strong>title case converter</strong> and a{' '}
        <strong>sentence case converter</strong> for writing, and the naming conventions developers use. It also says exactly what each option does to your words, and where to check the result.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/case-converter.webp"
            alt="Worn wooden letterpress blocks sorted into the compartments of a type case"
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
              One piece of text, eighteen ways to write it. Pick a case and the
              result updates as you type.
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
            ['#what-it-does', '1. What a Case Converter Does: All 18 Options'],
            ['#how-to-convert', '2. How to Convert Case in Three Steps'],
            ['#title-sentence', '3. Title Case and Sentence Case: The Exact Rules'],
            ['#naming-conventions', '4. camelCase vs snake case vs kebab case'],
            ['#fix-messy-text', '5. Fix Caps Lock, Extra Spaces and Pasted PDF Text'],
            ['#limits', '6. What It Does Not Do, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Use the Cortexis Case Converter'],
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
          <CaseSensitive className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Case Converter Does: All 18 Options
        </h3>
        <p>
          A case converter rewrites the capitals in a piece of text by a rule, so you never retype it. This one is a{' '}
          <strong>text case converter online free</strong> of accounts and
          limits, with eighteen options on one row of buttons. They fall into
          four families.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Type className="w-5 h-5 text-orange-500 shrink-0" /> For writing
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              UPPERCASE, lowercase, Title Case, Sentence case and Capitalized
              Case. The last one is the quickest way to{' '}
              <strong>capitalize first letter of each word online</strong>,
              which suits lists of names, product lines and table headings.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-orange-500 shrink-0" /> For code and the web
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE,
              dot.case, path/case, Train-Case and Slug (url-safe). Each joins your words into one name.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0" /> For fun
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              aLtErNaTiNg makes this an{' '}
              <strong>alternating caps generator SpongeBob mocking text</strong>{' '}
              fans will recognise. InVeRsE cAsE flips every letter, and Reverse
              is a <strong>reverse text generator</strong> for puzzles, jokes
              and testing.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Eraser className="w-5 h-5 text-orange-500 shrink-0" /> For cleaning
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Remove extra spaces collapses doubled spaces and tabs and trims line ends, keeping blank lines.
            </p>
          </div>
        </div>
        
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert Case in Three Steps
        </h3>
        <ol className="space-y-3">
          <li>
            <strong>Add your text.</strong> Paste or type into the Text box, or
            drop a <strong>.txt</strong> or <strong>.md</strong> file onto the
            panel above it. A dropped file replaces whatever was in the box.
          </li>
          <li>
            <strong>Pick a case.</strong> Title Case is selected to begin with.
            Click another and the Result box changes immediately, and again with every keystroke.
          </li>
          <li>
            <strong>Copy or download.</strong> Press <em>Copy</em> to put the
            result on your clipboard, or <em>Download</em> to save it as{' '}
            <strong>converted.txt</strong>. Your original stays in the Text box.
          </li>
        </ol>
        <p>
          The page works the same on a phone, where keyboards have no change-case command. To{' '}
          <strong>change text case on iPhone or Android</strong>, copy the text, paste it here, pick a case and copy it back.
        </p>
      </section>

      {/* 3 */}
      <section id="title-sentence" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          3. Title Case and Sentence Case: The Exact Rules
        </h3>
        <p>
          If you are wondering <strong>how to make a title in title case</strong>,
          the common convention is to capitalise the important words and leave
          short connecting words lowercase. Our Title Case capitalises the first
          letter of every word except this fixed list, which stays lowercase
          unless it is the very first word of the text: <em>a, an, the, and,
          but, or, nor, for, so, yet, at, by, in, of, on, to, up, as, vs, via,
          per</em>. So &ldquo;the art of war&rdquo; becomes &ldquo;The Art of
          War&rdquo;. 
        </p>
        <p>
          <strong>Why is my title case wrong?</strong> Usually for one of three reasons:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Acronyms and brand names are flattened.</strong> Every word
            outside the small-word list gets one capital and the rest lowercase,
            so NASA becomes Nasa and iPhone becomes Iphone. There is no
            exceptions list, so fix these by hand afterwards.
          </li>
          <li>
            <strong>It follows no named style guide.</strong> AP, APA, Chicago
            and MLA each have their own rules. This tool does not capitalise the
            last word or the word after a colon, both of which several guides
            require, so &ldquo;what to look out for&rdquo; ends with a lowercase
            &ldquo;for&rdquo;.
          </li>
          <li>
            <strong>Only the start of the whole text counts as a start.</strong>{' '}
            If you convert several headings at once, a line beginning with
            &ldquo;the&rdquo; or &ldquo;a&rdquo; keeps it lowercase. Convert headings one at a time.
          </li>
        </ul>
        <p>
          Sentence case lowercases everything first, then capitalises the first
          letter of the text, of each new line, and each word after . ! or ? plus a space. Ideal for shouty text, but proper nouns and the pronoun
          &ldquo;I&rdquo; come out lowercase, and an abbreviation such as
          &ldquo;e.g.&rdquo; can trigger a capital where you did not want one.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Check before you paste.</strong> After Title Case or
            Sentence case, scan for names of people and places, acronyms, brand
            names with unusual capitals, the word &ldquo;I&rdquo;, and the last
            word of a headline. 
          </p>
        </div>
      </section>

      {/* 4 */}
      <section id="naming-conventions" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-500 shrink-0" />
          4. camelCase vs snake case vs kebab case
        </h3>
        <p>
          The <strong>camelcase vs snake case vs kebab case</strong> question is mostly about where a name will live:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>camelCase</strong> (userFirstName) for variables and most JSON fields. The tool is a{' '}
            <strong>camelcase converter</strong> for any phrase or identifier.
          </li>
          <li>
            <strong>PascalCase</strong> (UserProfileCard) for types and
            components. Use it as a <strong>pascal case converter for class
            names</strong>: type the phrase, copy the name.
          </li>
          <li>
            <strong>snake_case</strong> (user_first_name) for Python functions
            and database columns. The Python style guide,{' '}
            <a
              href="https://peps.python.org/pep-0008/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              PEP 8
            </a>
            , recommends it alongside UPPER_CASE constants.
          </li>
          <li>
            <strong>CONSTANT_CASE</strong> (MAX_RETRY_COUNT) for constants and
            environment variables. Pick it and you have a{' '}
            <strong>constant case converter screaming snake case</strong> back
            at you.
          </li>
          <li>
            <strong>kebab-case</strong> (main-nav-item) for CSS class names, file
            names and web addresses. Use it as a{' '}
            <strong>kebab case converter</strong> and Train-Case when each word
            needs a capital.
          </li>
        </ul>
        <p>
          <strong>How to convert camelCase to snake case:</strong> paste the
          camelCase name and choose snake_case. The tool splits words at every
          lowercase-to-capital hump and at acronym boundaries, so XMLHttpRequest
          becomes xml_http_request. It also splits on any character that is not
          a letter or digit, which makes it a reliable{' '}
          <strong>snake case converter</strong> when you need to{' '}
          <strong>convert column names to snake_case</strong>: &ldquo;Order
          Date (UTC)&rdquo; becomes order_date_utc. Two cautions: apostrophes are dropped, so &ldquo;don&rsquo;t&rdquo; becomes don_t, and several lines collapse into one name. Convert one header at a time, or use{' '}
          <Link to="/tools/line-tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            line tools
          </Link>{' '}
          for work that goes line by line.
        </p>
        <p>
          Slug (url-safe) is the <strong>slug generator</strong> for a web
          address. To <strong>convert blog title to URL slug without
          accents</strong>, paste the title and pick Slug: &ldquo;Caf&eacute;
          Cr&egrave;me Recipes&rdquo; becomes cafe-creme-recipes. Accents are
          separated from their letters by standard{' '}
          <a
            href="https://unicode.org/reports/tr15/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            Unicode normalisation
          </a>{' '}
          and removed, then anything outside a to z and 0 to 9 becomes a
          hyphen. Titles in non-Latin scripts such as Arabic or Chinese therefore produce an empty or partial slug; write those by hand.
        </p>
      </section>

      {/* 5 */}
      <section id="fix-messy-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eraser className="w-6 h-6 text-orange-500 shrink-0" />
          5. Fix Caps Lock, Extra Spaces and Pasted PDF Text
        </h3>
        <p>
          Here is the <strong>accidentally typed in caps lock fix</strong>. If
          your paragraph reads &ldquo;hELLO, tHANKS FOR YOUR EMAIL&rdquo;,
          choose InVeRsE cAsE and every letter flips back. If it is all capitals, Sentence case gives you normal writing; then restore any names.
        </p>
        <p>
          <strong>Shift F3 not working in Word?</strong> That Word shortcut cycles case, but many laptops need the Fn key held too. Otherwise, paste the text here, convert it and copy it back. If you are asking <strong>how to change case in Google
          Docs</strong>, it has a built-in capitalisation option under the
          Format menu; for sentence case or any code case, which it does not
          offer, use this page and paste the result back. The pasted passage arrives as plain text, so re-apply any bold or links.
        </p>
        <p>
          On <strong>how to remove extra spaces from text</strong>: pick Remove
          extra spaces. It is the fix when{' '}
          <strong>text copied from PDF has extra spaces</strong>, doubled gaps, stray tabs or trailing spaces.
          It does not rejoin a sentence that the PDF broke across two lines, and
          it keeps blank lines, so paragraphs stay separate.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. What It Does Not Do, and Where to Go Instead
        </h3>
        <p>
          A case converter changes letters. Neighbouring jobs belong elsewhere:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Formatted documents.</strong> It reads .txt and .md and
            returns plain text, so it cannot change case inside a Word or PDF
            file while keeping the layout. To get text out of a PDF first, use
            the{' '}
            <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to text converter
            </Link>
            ; for scans and screenshots, the{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image to text
            </Link>{' '}
            tool.
          </li>
          <li>
            <strong>Renaming files.</strong> To make file names lowercase or kebab-case, use the{' '}
            <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              file renamer
            </Link>
            .
          </li>
          <li>
            <strong>URL encoding.</strong> The slug option makes a tidy path
            segment, not an encoded query value. For that, the{' '}
            <Link to="/tools/url-encoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
              URL encoder
            </Link>
            .
          </li>
          <li>
            <strong>Counting, patterns and comparing.</strong> For word and
            character totals, the{' '}
            <Link to="/tools/word-counter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              word counter
            </Link>
            ; to find or replace words by pattern, the{' '}
            <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
              regex tester
            </Link>{' '}
            (its replacements insert the text you type and cannot change
            capitals, so to recase one part of a passage, paste only that part
            here); to see exactly what changed, the{' '}
            <Link to="/tools/diff-checker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              diff checker
            </Link>
            .
          </li>
        </ul>
        <p>
          It also does not keep acronyms intact, apply AP or Chicago rules, rename JSON keys (the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          only tidies JSON), show every case side by side, or make fancy Unicode fonts.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Case Converter
        </h3>
        <p>
          Here is what is different, stated so you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no account', 'No sign-up, no email and no daily limit. The tool at the top of the page is the whole product.'],
            ['Writers and developers on one page', 'Title and Sentence case sit beside camelCase, snake_case and slugs: eighteen options in one row.'],
            ['Rules you can predict', 'This guide lists the small words Title Case keeps lowercase and how code cases split words.'],
            ['Your text stays private', 'What you paste is never stored on our servers and nothing is retained after you close the page.'],
            ['Nothing is used for training', 'Your drafts, emails and code are never used to train anything.'],
            ['Live, with copy and download', 'The result updates as you type, copies in one click and saves as a .txt file.'],
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
            free text and file tools
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
              'How to change uppercase to lowercase without retyping?',
              'Paste the text into the case converter above and choose lowercase, or Sentence case for normal capitals at the start of each sentence. Then press Copy and paste it back.',
            ],
            [
              'Which words does Title Case leave lowercase?',
              'Short words such as a, an, the, and, but, or, of, on, to and per stay lowercase unless they start the text. It does not follow a named style guide such as AP or Chicago.',
            ],
            [
              'Why did NASA turn into Nasa?',
              'Title Case, Sentence case and Capitalized Case give each word one capital and lowercase the rest, with no exceptions list for acronyms. Fix those words by hand afterwards.',
            ],
            [
              'How do I turn a column header into a snake_case name?',
              'Paste the header and choose snake_case; spaces and punctuation become word breaks. Convert headers one at a time, because several lines are joined into a single name.',
            ],
            [
              'Can I convert a whole Word document or PDF and keep the formatting?',
              'No. It reads pasted text or a .txt or .md file and returns plain text, so formatting is not kept. For a PDF, extract the text with the PDF to text converter first.',
            ],
            [
              'Does the slug option work for non-English titles?',
              'Accented Latin letters lose their accents and are kept. Letters from other scripts, such as Arabic or Chinese, are dropped because the slug keeps only a to z, digits and hyphens.',
            ],
            [
              'Is my text stored or used for training?',
              'No. What you paste is never stored on our servers, nothing is retained after you leave, and it is never used for training.',
            ],
            [
              'Can it count words or sort lines while converting?',
              'Not in the same step. Use the word counter for word, character and sentence totals, and line tools for sorting, removing duplicates or numbering lines.',
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
          Working with data rather than prose? Reshape tables with the{' '}
          <Link to="/tools/csv-json" className="text-orange-600 font-semibold underline hover:text-orange-700">
            CSV to JSON converter
          </Link>
          , tidy queries with the{' '}
          <Link to="/tools/sql-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SQL formatter
          </Link>
          , or turn notes into a web page with the{' '}
          <Link to="/tools/markdown-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Markdown converter
          </Link>
          . Curious about writing the code itself? Our free{' '}
          <Link to="/learn/python-development" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Python development course
          </Link>{' '}
          is a good next step.
        </p>
      </div>
    </article>
  );
}
