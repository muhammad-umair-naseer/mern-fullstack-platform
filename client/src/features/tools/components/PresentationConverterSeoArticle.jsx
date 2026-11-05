import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ListTree,
  MessageSquareText,
  Presentation,
  ScanSearch,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the presentation converter.
 *
 * Written against what PresentationConverter.js actually does, which is
 * narrower than the tool's name suggests. It reads one .pptx and writes a text
 * outline — HTML, Markdown or plain text — built from slide titles, bullets
 * with their indent level, and speaker notes. It does not convert between
 * presentation formats, so "pptx to ppt", "ppt to pptx", "pptx to odp" and
 * "keynote to pptx" are declined outright; the catalogue blurb promising that
 * is not repeated here. It also does not render slides, extract images, read
 * table cells, charts or SmartArt, or carry bold and italic through, so the
 * article says so in section 6 rather than letting the reader discover it.
 *
 * The angle is the gap in PowerPoint's own Outline View and RTF export, which
 * drop text placed in manually inserted text boxes. extractSlide() scans every
 * <p:sp> shape regardless of whether it is a placeholder, so this tool keeps
 * that text. That is the one honest, specific advantage, and the problem-aware
 * keywords cluster around it, so section 3 is built on it.
 *
 * The plain-text export drops speaker notes and indentation. "Export
 * powerpoint speaker notes to text file" is therefore answered by pointing at
 * the Markdown export, which is itself a plain text file, rather than the .txt
 * option that would lose the notes.
 */
export default function PresentationConverterSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        <span className="text-orange-600 dark:text-orange-400">PPTX to Markdown</span>, HTML or Plain Text: Get Every Word Out of a PowerPoint Deck
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A slide deck is a terrible place to keep words. They are locked one
        screen at a time behind a layout, and the moment you want them somewhere
        else &mdash; a study document, a wiki page, a prompt for an AI assistant
        &mdash; you are clicking through slides copying boxes one by one. This
        tool turns a <strong>PPTX to Markdown</strong>, a structured HTML page
        or a plain text outline in one pass, keeping slide titles, the bullet
        hierarchy and the speaker notes together. It is the quickest way to{' '}
        <strong>extract text from PowerPoint</strong> without opening PowerPoint.
        This guide covers what comes out, what PowerPoint&rsquo;s own export
        silently leaves behind, and what this tool deliberately does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/presentation-converter.webp"
            alt="A man presenting a sales chart on a large wall screen to his colleagues"
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
              One deck in, one outline out: titles, nested bullets and speaker
              notes as Markdown, HTML or plain text.
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
            ['#what-it-does', '1. What This Tool Actually Does With a Deck'],
            ['#how-to-convert', '2. How to Convert PPTX to Markdown Online Free'],
            ['#text-boxes', '3. The Text PowerPoint’s Own Outline Export Leaves Out'],
            ['#speaker-notes', '4. Getting Speaker Notes Out Without Slide Images'],
            ['#three-outputs', '5. Markdown, HTML or Plain Text: Which to Pick'],
            ['#what-it-skips', '6. What Is Skipped, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PPTX to Markdown Converter'],
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
          <Presentation className="w-6 h-6 text-orange-500 shrink-0" />
          1. What This Tool Actually Does With a Deck
        </h3>
        <p>
          A <strong>.pptx</strong> file is not one opaque blob. It is a package
          of parts described by the{' '}
          <a
            href="https://ecma-international.org/publications-and-standards/standards/ecma-376/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ECMA-376 Office Open XML standard
          </a>
          , with a separate part for each slide, another for each slide&rsquo;s
          notes page, and a list at the front giving the slide order. Every
          piece of text you typed onto a slide lives in one of those parts as a
          shape with paragraphs inside it, each carrying its own indent level.
        </p>
        <p>
          This tool reads those parts in the deck&rsquo;s own slide order and
          builds a text outline: for each slide, the title, then every non-empty
          paragraph from every text shape with its indent level, then the
          speaker notes. It writes the result as one of three files: a{' '}
          <strong>Markdown outline</strong>, a <strong>structured HTML page</strong>
          , or a <strong>plain text outline</strong>.
        </p>
        <p>
          That is the whole job. It does not draw the slides, does not carry
          images or charts across, and is not a{' '}
          <strong>presentation format converter</strong> &mdash; it will not
          turn a PPTX into PPT, ODP or Keynote. If the goal is the words, this
          is the right page; if the goal is a different presentation file,
          section 6 explains why we do not pretend otherwise.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert PPTX to Markdown Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no watermark and no slide cap. To use the{' '}
          <strong>PPTX to Markdown converter online free</strong> at the top of
          this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your .pptx', 'Click the panel above and pick one PowerPoint file. It has to be a .pptx rather than a legacy .ppt; section 6 covers older files.'],
            ['Check the preview', 'The tool reports how many slides it found and shows a live preview of the outline, so you can confirm it read the deck you expected.'],
            ['Pick a format and download', 'Choose Markdown (.md), Structured Web HTML (.html) or Plain Text (.txt) and press download. The file is named after your deck.'],
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
          Once the deck is loaded you can switch format and download again as
          often as you like. Markdown opens in any text editor and pastes
          cleanly into a notes app, a wiki or a chat window, which is why{' '}
          <strong>PowerPoint to Markdown</strong> is the export most people come
          here for; <strong>PPTX to TXT</strong> is the one to pick when you
          want the flattest possible dump. Nothing you convert is stored on our
          servers or kept after your session ends.
        </p>
      </section>

      {/* 3 */}
      <section id="text-boxes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanSearch className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Text PowerPoint&rsquo;s Own Outline Export Leaves Out
        </h3>
        <p>
          If you have already tried to <strong>copy all text from PowerPoint at
          once</strong>, you have probably met Outline View, File &gt; Export
          &gt; Create Handouts &gt; Outline Only, or saving the deck as RTF.
          They share one limitation: they only see text inside{' '}
          <em>placeholders</em> &mdash; the title and body boxes that come with
          a slide layout. Anything typed into a text box or shape you inserted
          yourself is not outline text as PowerPoint understands it, so it
          vanishes from the export.
        </p>
        <p>
          That is why searches like{' '}
          <strong>PowerPoint outline view missing text boxes</strong> and{' '}
          <strong>PowerPoint export outline only text boxes not included</strong>{' '}
          are so common. The deck looks complete on screen; the outline is
          missing the callout beside the chart, the caption under the photo and
          the three-column comparison built from separate boxes.
        </p>
        <p>
          This tool does not use the placeholder distinction to decide what to
          keep. It scans every text shape on every slide &mdash; layout
          placeholders and manually inserted boxes alike, including boxes inside
          a group &mdash; and takes every non-empty paragraph. The title becomes
          the heading and everything else becomes a bullet beneath it, in the
          order the shapes appear. The outline you download carries every text
          box&rsquo;s words, not just the subset PowerPoint considers real
          outline text.
        </p>
        <p>
          One honest side effect of reading everything: subtitles, footers and
          date fields are ordinary text shapes too, so a visible footer appears
          as a bullet, and hidden slides are included because a hidden slide is
          still a slide in the file. Both are seconds of tidying, which is a
          better problem than text that never arrived.
        </p>
      </section>

      {/* 4 */}
      <section id="speaker-notes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquareText className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Get Speaker Notes Out of PowerPoint Without Slide Images
        </h3>
        <p>
          The other thing people want from a deck is the notes pane: a
          lecturer&rsquo;s script, a colleague&rsquo;s talking points, the
          sources tucked below a chart. PowerPoint&rsquo;s answer is Export to
          Word, which produces a table with a thumbnail of each slide, its
          number and the notes beside it. If what you wanted was{' '}
          <strong>PowerPoint notes to Word without slide images</strong> &mdash;
          just the words, in order &mdash; that leaves you deleting a column of
          pictures by hand.
        </p>
        <p>
          Here, the notes are attached to their slide in the output. In the{' '}
          <strong>Markdown outline</strong> they arrive as a quoted
          &ldquo;Notes:&rdquo; line beneath the bullets; in the HTML page they
          sit in a highlighted block at the bottom of each slide card. Either
          way you <strong>get speaker notes out of PowerPoint</strong> already
          paired with the slide they belong to, with no thumbnails and no table
          to dismantle. The slide-number field PowerPoint stores on every notes
          page is dropped, so there is no stray &ldquo;7&rdquo; at the end of
          each note. It is <strong>PPTX to Markdown with speaker notes</strong>,
          not notes as a separate document.
        </p>
        <p>
          One thing to know first: the plain text export does <em>not</em>{' '}
          include notes. To{' '}
          <strong>export PowerPoint speaker notes to a text file</strong>, pick
          Markdown. A .md file is a plain text file &mdash; the{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc7763"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            text/markdown media type is defined in IETF RFC 7763
          </a>{' '}
          &mdash; and it opens in exactly the same editors, with the notes kept.
        </p>
      </section>

      {/* 5 */}
      <section id="three-outputs" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListTree className="w-6 h-6 text-orange-500 shrink-0" />
          5. Markdown, HTML or Plain Text: Which Output to Pick
        </h3>
        <p>
          The three formats share the same source outline but differ in what
          they keep, so the choice depends on where the text is going next.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Markdown Outline (.md)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The deck name as a top-level heading, then a second-level heading
              per slide (&ldquo;Slide 4: Title&rdquo;), bullets indented two
              spaces per level, and a &ldquo;Notes:&rdquo; blockquote where
              notes exist. Best for Obsidian, Notion, wikis, READMEs and AI
              prompts.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Structured Web HTML (.html)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A single self-contained, dark-themed page with one card per
              slide, real nested lists for the bullet levels, line breaks kept
              inside paragraphs, and a highlighted speaker notes block. Best
              for reading a deck as a web page or sharing one scrollable page.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Plain Text Outline (.txt)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;SLIDE 4: Title&rdquo; followed by one bulleted line per
              paragraph. No indentation and no speaker notes. Best when you
              want to convert PPTX to a plain text bullet outline &mdash; titles
              and bullets in order and nothing else.
            </p>
          </div>
        </div>
        <p>
          Two long-tail questions answer themselves here. Yes,{' '}
          <strong>PPTX to Markdown preserves bullet indentation</strong>: every
          paragraph&rsquo;s indent level is read from the slide and written as
          two spaces per level, so a sub-bullet stays a sub-bullet. And yes,{' '}
          <strong>PPTX to HTML</strong> here means an outline on one page
          &mdash; every slide&rsquo;s text in one scrollable document &mdash;
          not a slide-by-slide replica. Because that HTML is complete in one
          file, you can turn it into a printable document with{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web page as PDF
          </Link>{' '}
          if a PDF of the outline is what someone asked for.
        </p>
        <p>
          The Markdown export is also the answer to{' '}
          <strong>paste PowerPoint into ChatGPT</strong> or any other AI
          assistant: a heading per slide, bullets under it and the notes quoted
          beneath gives the model the structure of the talk in one prompt
          instead of twelve copy-pastes. Students turning{' '}
          <strong>lecture slides to Markdown notes</strong> for Obsidian or
          Notion get a file that drops straight into a knowledge base with the
          slide numbers intact.
        </p>
      </section>

      {/* 6 */}
      <section id="what-it-skips" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. What Is Skipped, and Where to Go Instead
        </h3>
        <p>
          The promise is &ldquo;every word in every text shape&rdquo;, and its
          edges are worth stating plainly.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Tables, charts and SmartArt are not read.</strong> Their text
            is stored differently from an ordinary text shape, so a slide that
            is one big table comes out with its title and nothing else. The same
            goes for embedded spreadsheets and other objects.
          </li>
          <li>
            <strong>Images are not extracted.</strong> Text that only exists
            inside a picture &mdash; a screenshot, a photographed whiteboard
            &mdash; is invisible here. If the deck is really a set of scanned
            pages, save it as a PDF from your presentation app and run it
            through{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>{' '}
            instead.
          </li>
          <li>
            <strong>Formatting is not carried across.</strong> Bold, italic,
            colour, font size and hyperlinks are dropped, and so are layouts,
            themes, backgrounds, animations and transitions. The output is plain
            text with structure.
          </li>
          <li>
            <strong>Only .pptx is accepted.</strong> A legacy binary .ppt, an
            OpenDocument .odp or a Keynote .key is refused with a &ldquo;Could
            not read PPTX&rdquo; message. Save it as .pptx from your
            presentation app first and it will read normally.
          </li>
          <li>
            <strong>One deck at a time.</strong> There is no batch mode; loading
            a second file replaces the first.
          </li>
        </ul>
        <p>
          And the big one: this is not a <strong>PowerPoint format converter</strong>.
          It will not produce a PPT, ODP, Keynote or Google Slides file, and it
          will not build slides from a Markdown outline in reverse. We do not
          currently offer format-to-format presentation conversion, and we would
          rather say so than route you to a page that cannot do it. If you have
          a PDF and want an editable deck,{' '}
          <Link to="/tools/pdf-powerpoint" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PowerPoint
          </Link>{' '}
          is the tool for it. The broader{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists everything else we convert.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PPTX to Markdown Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no sign-up', 'A PowerPoint to text converter online free, no sign up, no email and no trial that expires. Every deck, every time.'],
            ['Unlimited, with no watermark', 'Extract supported PPTX text locally within the displayed limits. Original slide designs, media and animations are not preserved.'],
            ['Reads the text boxes PowerPoint skips', 'Manually inserted text boxes, grouped shapes and layout placeholders are all read, so the outline matches what the slide shows.'],
            ['Speaker notes stay with their slide', 'Notes are attached beneath the slide they belong to in Markdown and HTML — no thumbnails, no Word table, no stray slide numbers.'],
            ['Bullet hierarchy survives', 'Indent levels become nested lists in HTML and two-space indentation in Markdown, so sub-points do not collapse into one flat list.'],
            ['Your deck stays private', 'Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.'],
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
            free document tools
          </Link>{' '}
          on the same terms; the{' '}
          <Link to="/tools/spreadsheet-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            spreadsheet converter
          </Link>{' '}
          and{' '}
          <Link to="/tools/ebook-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            ebook converter
          </Link>{' '}
          do the equivalent job for spreadsheets and ebooks.
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
              'How do I convert PPTX to Markdown for free?',
              'Choose your .pptx in the panel at the top of this page, wait for the slide count and preview, select Markdown Outline (.md) from the dropdown and press download. No account, no email, no watermark, and it works the same on the hundredth deck as the first.',
            ],
            [
              'Can I read a PPTX without PowerPoint?',
              'Yes. This page lets you read PPTX without PowerPoint or any Office licence. Load the .pptx and the preview shows every slide’s title, bullets and notes as a scrollable outline. Download the HTML version to keep a readable copy, or Markdown if you want to edit it.',
            ],
            [
              'Does PPTX to Markdown keep speaker notes?',
              'Yes, in Markdown and HTML. Each slide’s notes are placed directly under that slide as a quoted “Notes:” line in Markdown or a highlighted block in HTML. The plain text (.txt) export does not include notes, so choose Markdown if you specifically need notes in a text file.',
            ],
            [
              'Why does PowerPoint’s outline export miss some of my text?',
              'Outline View, RTF export and Create Handouts > Outline Only read only placeholder text — the title and body boxes that come with a layout. Text boxes you inserted yourself are not outline content to PowerPoint, so they are dropped. This tool reads every text shape on the slide, placeholder or not.',
            ],
            [
              'Can I convert PowerPoint to HTML without PowerPoint?',
              'Yes. Choose Structured Web HTML and you get a single self-contained page with one card per slide, nested lists for the bullets and a speaker notes block. It is a text outline on one page, not a visual copy of the slides, so design and images are not included.',
            ],
            [
              'Does it convert PPTX to PPT, ODP or Keynote?',
              'No. This tool extracts text; it does not convert between presentation formats or produce PDF, images or a new slideshow. For a different presentation file, use Save As in your presentation app. If you have a PDF and want an editable deck, use our PDF to PowerPoint tool.',
            ],
            [
              'Will tables and charts on my slides be included?',
              'No. Only text inside ordinary text shapes and placeholders is read. Text in tables, charts, SmartArt and embedded objects is skipped, as is text that only exists inside an image. A slide that is entirely a table comes out as just its title.',
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
          Got the outline and need to go further? The{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          tidies structured data you are pasting alongside it,{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>{' '}
          handles the deck someone sent you as a PDF instead, and{' '}
          <Link to="/tools/pdf-html" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to HTML
          </Link>{' '}
          does for documents what this page does for slides. If you would rather
          understand how HTML and Markdown are built than simply generate them,
          our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts with the structure of a web page and goes on from there.
        </p>
      </div>
    </article>
  );
}
