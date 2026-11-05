import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Code,
  Eye,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Markdown Converter tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Every limit is stated: emoji and non-Latin text print as "?" in the PDF,
 *    images only embed as data: URLs, links in the PDF are styled but not
 *    clickable. Each one comes with the route that works instead.
 *
 * 2. The two HTML outputs are explained as different jobs (a styled page to
 *    share, a fragment to paste into a blog editor), which page one rarely does.
 *
 * 3. Finishing steps the converter does not do (page numbers, watermark,
 *    merge, password) are routed to the sibling PDF tools.
 */

export default function MarkdownConverterSeoArticle() {
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
        How to Convert <span className="text-orange-600 dark:text-orange-400">Markdown to PDF</span> and HTML: Live Preview, Clean Output, and Exactly What Survives
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A README for a client, meeting notes a manager wants as a PDF, an AI
        answer full of hash signs and asterisks: each is the same job, turning
        plain text with a little markup into something people can read. This guide shows how to convert{' '}
        <strong>Markdown to PDF</strong> and <strong>Markdown to HTML</strong>{' '}
        for free, how the <strong>markdown converter</strong> above handles
        tables, task lists and code, which features carry into each output,
        and &mdash; plainly &mdash; what to do about the few things that do not.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/markdown-converter.webp"
            alt="A typeset book page with a red pilcrow and a heading set in a clean serif"
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
              Write or drop Markdown on one side, watch it render on the other,
              then download it as a PDF, a styled HTML page or a paste-ready
              fragment.
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
            ['#open-md-file', '1. What a Markdown Converter Does, and How to Open an MD File'],
            ['#how-to-convert', '2. How to Convert Markdown to PDF in Four Steps'],
            ['#markdown-to-html', '3. Markdown to HTML: Styled Page or Blog Fragment'],
            ['#what-survives', '4. What Survives Into Each Output'],
            ['#fix-problems', '5. Images Not Showing, Emoji Turning Into Question Marks'],
            ['#real-situations', '6. README, Obsidian, AI Answers and Phones'],
            ['#why-cortexis', '7. Why Use the Cortexis Markdown Converter'],
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
      <section id="open-md-file" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Markdown Converter Does, and How to Open an MD File
        </h3>
        <p>
          Markdown is plain text with a handful of conventions: a line starting
          with <code>#</code> is a heading, words wrapped in <code>**</code>{' '}
          are bold, a line starting with a dash is a bullet. The conventions are
          described in the{' '}
          <a
            href="https://spec.commonmark.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            CommonMark specification
          </a>
          , and the tables, strikethrough and checkboxes most people use today
          come from the{' '}
          <a
            href="https://github.github.com/gfm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            GitHub Flavored Markdown spec
          </a>
          . A converter turns
          them into real formatting.
        </p>
        <p>
          It is also the answer if you searched{' '}
          <strong>how to open MD file</strong> attachments. If your <strong>MD file shows symbols instead of formatting</strong>,
          nothing is broken: you opened it in a plain text editor, which shows
          the raw markup. Drop the file onto the tool above (it accepts{' '}
          <code>.md</code>, <code>.markdown</code> and <code>.txt</code>) and the{' '}
          <strong>Live preview</strong> panel renders it immediately. Used this
          way, the page is a <strong>markdown viewer online</strong>; type in
          the left-hand box and it becomes a <strong>markdown previewer</strong>{' '}
          that re-renders on every keystroke.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert Markdown to PDF in Four Steps
        </h3>
        <p>
          Here is <strong>how to convert Markdown to PDF</strong>, or{' '}
          <strong>MD to PDF</strong> if you think in file extensions, with the
          tool above. No account and no daily limit.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your Markdown.</strong> Paste it into the editor, which
            starts with a short sample you can overwrite, or drop a file on the
            panel labelled <em>Drop a .md file or edit below</em>. Dropping a
            file also fills the Title field with its name.
          </li>
          <li>
            <strong>Check the preview.</strong> Headings, lists, tables and code
            blocks appear formatted on the right. If something looks wrong
            here, fix it in the text now.
          </li>
          <li>
            <strong>Choose the output settings.</strong> Leave{' '}
            <em>Convert to</em> on <strong>PDF</strong>, pick{' '}
            <strong>A4</strong> or <strong>US Letter</strong> for the page size,
            and set the <em>Base font size</em> anywhere from 8 to 16 (11 is the
            default). The Title becomes both the file name and the title stored
            in the PDF.
          </li>
          <li>
            <strong>Convert and download.</strong> Press <em>Convert</em>. A
            preview of the finished PDF appears with a download button, and the
            file is named after your title.
          </li>
        </ol>
        <p>
          That also covers <strong>how to print a Markdown file</strong>: pick
          the paper size your printer uses, convert, and print the PDF.
        </p>
      </section>

      {/* 3 */}
      <section id="markdown-to-html" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-500 shrink-0" />
          3. Markdown to HTML: Styled Page or Blog Fragment
        </h3>
        <p>
          <strong>How to convert Markdown to HTML</strong> depends on where the
          HTML is going, and this is where most pages that call themselves a{' '}
          <strong>Markdown to HTML converter online</strong> stop short. There
          are two HTML results:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" /> HTML page (standalone)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A complete <code>.html</code> file with its own stylesheet built
              in: readable widths, styled tables and code, and colours that
              follow the reader&rsquo;s light or dark setting. This is{' '}
              <strong>Markdown to HTML with CSS</strong> in one file you can
              email, attach or host. The styling is fixed; custom themes are
              not offered.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-orange-500 shrink-0" /> HTML fragment
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Just the body markup, with no page wrapper and no styles, shown
              as source and saved as <code>fragment.html</code>. Use it as a{' '}
              <strong>Markdown to HTML fragment for blog</strong> posts: paste
              it into a CMS and it takes on your site&rsquo;s styling.
            </p>
          </div>
        </div>
        <p>
          Either way, this is a full <strong>MD to HTML converter</strong>.
          Headings get anchor ids, so you can link straight
          to a section. A <strong>Markdown table to HTML</strong> becomes a
          proper <code>&lt;table&gt;</code> with a header row, and the column
          alignment you set with colons in the separator line is kept. Inline
          HTML passes through into both HTML outputs.
        </p>
      </section>

      {/* 4 */}
      <section id="what-survives" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          4. What Survives Into Each Output
        </h3>
        <p>
          Here is the specific list. Every output handles headings,
          paragraphs, bold, italic, <code>~~strikethrough~~</code>, inline code,
          links, blockquotes, fenced and indented code blocks, horizontal rules,
          and nested ordered and unordered lists. Tables work everywhere, with
          a header row.
        </p>
        <p>
          <strong>Markdown task list to PDF</strong> works too: <code>- [x]</code>{' '}
          and <code>- [ ]</code> items print with <code>[x]</code> and{' '}
          <code>[ ]</code> markers in front of each line, so a checklist stays
          readable on paper. In the HTML outputs they become real (read-only)
          checkboxes, ticked or empty.
        </p>
        <p>The honest differences between the outputs:</p>
        <ul className="space-y-2">
          <li>
            <strong>Links in the PDF are styled, not clickable.</strong> They
            look like links, but a reader cannot click through. The HTML outputs keep working links.
          </li>
          <li>
            <strong>Table cells in the PDF are plain text.</strong> Bold or a
            link inside a cell prints without its formatting.
          </li>
          <li>
            <strong>Raw HTML becomes plain text in the PDF,</strong> while the
            HTML outputs keep it.
          </li>
          <li>
            <strong>No syntax highlighting,</strong> math, diagrams, footnotes,
            front matter or automatic table of contents. Those extras are not
            rendered, so keep them out of documents you plan to convert here.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="fix-problems" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500 shrink-0" />
          5. Images Not Showing, Emoji Turning Into Question Marks
        </h3>
        <p>
          <strong>Markdown to PDF images not showing.</strong> Images linked by
          a web address or a relative path (<code>![logo](images/logo.png)</code>)
          are not included, so the PDF shows the image&rsquo;s alt text in
          brackets instead. If you are wondering{' '}
          <strong>how to embed image in Markdown PDF</strong> output, the
          answer is a data URL: the image written out as text inside the
          Markdown. The{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder
          </Link>{' '}
          turns an image into one, and running it through the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          first keeps the text shorter. Put the image on its own line and it
          embeds in the PDF, scaled down if it is very large. Data-URL images
          do not display in the two HTML outputs, so they appear in the PDF
          only. If your document is really a set of pictures, the{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF converter
          </Link>{' '}
          is the better fit.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Markdown to PDF emoji not showing?</strong> The PDF uses
            standard fonts that cover Western European Latin text only. Emoji,
            and scripts such as Urdu, Arabic, Chinese or Cyrillic, print as{' '}
            <code>?</code>. Even the sample&rsquo;s tick marks do this. Choose{' '}
            <em>HTML page (standalone)</em> instead and every character is
            kept; once that page is published at a web address, the{' '}
            <Link to="/tools/save-web-as-pdf" className="font-semibold underline">
              save web page as PDF
            </Link>{' '}
            tool can produce a PDF from it.
          </p>
        </div>
        <p>
          <strong>Command-line Markdown to PDF not working?</strong> If a
          desktop converter keeps stopping on missing packages or font errors,
          paste the same Markdown into the editor above, check the preview and
          press <em>Convert</em>. There are no extra packages or settings files
          to get right first.
        </p>
      </section>

      {/* 6 */}
      <section id="real-situations" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. README, Obsidian, AI Answers and Phones
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>README to PDF.</strong> For a <strong>GitHub README to
            PDF</strong>, open the file in the repository, view it raw, copy
            everything and paste it here. Images referenced by path need the
            data-URL step above.
          </li>
          <li>
            <strong>Obsidian notes to PDF.</strong> Obsidian notes are ordinary
            Markdown files, so drop one in. Wiki-style <code>[[links]]</code>{' '}
            and plugin syntax are not standard Markdown and print as written.
          </li>
          <li>
            <strong>ChatGPT Markdown to PDF.</strong> Use the copy button on an
            AI answer to get the Markdown, paste it into the editor, set a
            title and convert.
          </li>
          <li>
            <strong>Markdown to PDF A4.</strong> A4 is the default; US Letter
            is one click away.
          </li>
          <li>
            <strong>Markdown to PDF on iPhone.</strong> The page works the same
            on a phone: paste the text, or pick the file from the Files app,
            then convert and save the PDF.
          </li>
        </ul>
        <p>
          The converter makes one clean PDF at a time. For finishing touches,
          hand the result to the{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page numbers
          </Link>{' '}
          tool, the{' '}
          <Link to="/tools/pdf-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF watermark
          </Link>{' '}
          tool, the{' '}
          <Link to="/tools/pdf-bookmarks" className="text-orange-600 font-semibold underline hover:text-orange-700">
            bookmarks editor
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>
          . Converting several files? Do them one by one, then join them with
          the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Use the Cortexis Markdown Converter
        </h3>
        <p>
          Plenty of sites offer a <strong>Markdown to PDF converter online
          free</strong>. Here is what you get.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no watermark and no files-per-day counter. The tool on this page is the whole product.'],
            ['Three outputs from one editor', 'A PDF, a styled standalone HTML page and a paste-ready HTML fragment, all from the same text and the same live preview.'],
            ['Your notes stay private', 'Files are never stored on our servers and nothing is retained once you are done.'],
            ['Nothing is used for training', 'Your documents are never used to train anything. Internal docs and drafts stay yours.'],
            ['Tables and checklists that work', 'Pipe tables with header rows and alignment, nested lists and ticked or empty task boxes all carry into the output.'],
            ['Limits stated up front', 'Emoji, remote images and PDF links are explained on this page with a workaround for each, so nothing surprises you after the download.'],
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
            free document tools
          </Link>{' '}
          built on the same terms, so the <strong>convert MD to PDF
          privately</strong> promise holds for the finishing tools too.
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
              'How do I convert Markdown to PDF for free?',
              "Paste your Markdown or drop a .md file into the tool at the top of this page, check the live preview, choose A4 or US Letter and press Convert. The PDF downloads under the title you set.",
            ],
            [
              'Markdown to PDF images not showing: how do I fix it?',
              "Images linked by a web address or file path are not included, so the PDF shows their alt text in brackets. To embed one, convert the image to a data URL with the Base64 encoder and place it on its own line in the Markdown. Data-URL images embed in the PDF output only.",
            ],
            [
              'Why do emoji show as question marks in the PDF?',
              "The PDF uses standard fonts that cover Western European Latin characters, so emoji and scripts such as Urdu, Arabic, Chinese and Cyrillic print as a question mark. The standalone HTML page keeps every character. If you need a PDF of that text, publish the HTML page and use the save web page as PDF tool.",
            ],
            [
              'Can I convert Markdown to Word?',
              "Not directly. Convert your Markdown to PDF here, then open the result in the PDF to Word converter to get an editable document.",
            ],
            [
              'What is the difference between the HTML page and the HTML fragment?',
              "The HTML page is a complete file with its own stylesheet, including light and dark colours, ready to open or share on its own. The fragment is only the body markup with no styles, meant for pasting into a blog editor or site template that already has its own design.",
            ],
            [
              'Are links clickable in the PDF?',
              "Links are coloured and underlined in the PDF but are not clickable. Share the standalone HTML page when readers need to follow links.",
            ],
            [
              'Can I convert a PDF back to Markdown?',
              "This tool only goes from Markdown to PDF or HTML. To get the text out of a PDF, use the PDF to text and HTML converter, or the PDF OCR tool if the pages are scans. HTML back to Markdown is not offered.",
            ],
            [
              'How do I turn Obsidian notes to PDF?',
              "Obsidian notes are plain Markdown files, so drop the .md file onto the tool, set a title and convert. Wiki-style [[links]] and plugin syntax are not standard Markdown and print exactly as written, so tidy them first if they matter.",
            ],
            [
              'How do I convert a ChatGPT Markdown answer to PDF?',
              "Use the copy button under the answer to get it as Markdown, paste it into the editor and press Convert. Headings, lists, tables and code blocks keep their formatting; emoji in the answer print as a question mark in the PDF.",
            ],
            [
              'Does Markdown to PDF on iPhone work?',
              "Yes. Open this page in Safari, paste your text or pick the .md file from the Files app, then convert and save the PDF to Files or share it straight on.",
            ],
            [
              'Can I convert MD to PDF privately?',
              "Yes. Your files are never stored on our servers and nothing is retained once you finish. They are never used for training either, so internal docs and private notes stay yours.",
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
          PDF ready? Turn it into an editable file with the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>
          , pull the text back out with the{' '}
          <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to text converter
          </Link>
          , or turn the same Markdown into an EPUB with the{' '}
          <Link to="/tools/ebook-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            ebook converter
          </Link>
          , or check length with the{' '}
          <Link to="/tools/word-counter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            word counter
          </Link>
          . To build pages like these yourself, try our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
