import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  HelpCircle,
  Layers,
  ListOrdered,
  ListTree,
  ShieldCheck,
  WandSparkles,
  Wrench,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Bookmarks tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool is sold as an outline editor for the PDF you already have: it
 *    keeps the existing bookmarks and its fastest path is the indented
 *    "Title | page" text import, which almost nobody else offers.
 *
 * 2. Auto-detect is described as a flat first draft built from each page's
 *    first line, not a heading parser, and scanned files are routed to OCR.
 *
 * 3. The contents page is a printed list, not links. The clickable
 *    navigation lives in the bookmarks panel, and the guide says so plainly,
 *    along with the one-page shift the contents page causes.
 */
export default function PdfBookmarksSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Add Bookmarks to PDF</span> Files, Edit the Ones Already There, and Build a PDF Table of Contents
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A 200-page report that leaves readers scrolling. A thesis bounced
        because the chapters are not bookmarked. A merged bundle with no way
        to find exhibit C. Each is fixed the same way: give the file a proper set of{' '}
        <strong>PDF bookmarks</strong>, the clickable outline that sits in a
        reader&rsquo;s side panel. This guide shows how to{' '}
        <strong>add bookmarks to PDF</strong> documents you already have,{' '}
        <strong>edit PDF bookmarks</strong> that came out wrong, paste a whole
        chapter list at once, and put a printed{' '}
        <strong>PDF table of contents</strong> at the front.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-bookmarks.webp"
            alt="Coloured paper tabs marking sections along the edge of a thick book"
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
              Chapters and sub-sections in the side panel, one click from any
              page, plus an optional contents page at the front.
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
            ['#what-are-bookmarks', '1. What PDF Bookmarks Are, and When You Need Them'],
            ['#how-to-add', '2. How to Add Bookmarks to a PDF Online Free'],
            ['#edit-bookmarks', '3. Edit PDF Bookmarks: Rename, Nest, Reorder, Remove'],
            ['#import-detect', '4. Import a Chapter List or Auto-Detect Headings'],
            ['#contents-page', '5. Add a Table of Contents to an Existing PDF'],
            ['#troubleshooting', '6. PDF Bookmarks Not Showing or Going to the Wrong Page'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Bookmark Editor'],
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
      <section id="what-are-bookmarks" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-orange-500 shrink-0" />
          1. What PDF Bookmarks Are, and When You Need Them
        </h3>
        <p>
          In the PDF specification,{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          , bookmarks are called the document outline: a tree of titles, each
          pointing at a page, that PDF readers show in a side panel. They change nothing on the page; they let a reader jump to
          &ldquo;Chapter 4&rdquo; in one click. So when a{' '}
          <strong>PDF has no table of contents</strong>, the fix is usually an
          outline, not new pages.
        </p>
        <p>Where bookmarks stop being optional:</p>
        <ul className="space-y-2">
          <li>
            <strong>Theses and dissertations.</strong> Many universities ask you to{' '}
            <strong>bookmark PDF thesis chapters</strong> and appendices in the
            submitted file.
          </li>
          <li>
            <strong>Court filings.</strong> <strong>Legal brief pdf bookmarks</strong>{' '}
            for sections and exhibits are a common e-filing requirement.
          </li>
          <li>
            <strong>Merged bundles.</strong> <strong>Add bookmarks to merged PDF</strong> files so
            each original document is one click away.
          </li>
          <li>
            <strong>Books and manuals.</strong> When you{' '}
            <strong>add chapters to PDF ebook</strong> files, bookmarks are what
            most PDF readers, on tablets as well as desktops, show as the
            chapter list.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-add" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Add Bookmarks to a PDF Online Free
        </h3>
        <p>
          The tool above lets you{' '}
          <strong>add bookmarks to PDF online free</strong>, with no account
          and no page cap, working on the finished PDF rather than the original
          Word file. The steps are the same on Windows, Mac and Linux, and you
          can <strong>add bookmarks to PDF on Chromebook</strong> the same way.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the PDF.</strong> Drop it on the first panel. Any
            bookmarks the file already has load into the{' '}
            <em>Bookmark tree</em>, up to twelve levels deep, including
            named-destination ones that some tools quietly drop.
          </li>
          <li>
            <strong>Build the tree.</strong> Press <em>+ Add bookmark</em> for a
            top-level entry, type its title and set its page in the{' '}
            <em>p.</em> box. Use <em>+ child</em> for sub-sections. Or fill the
            whole tree at once from a pasted list (section 4).
          </li>
          <li>
            <strong>Set the options.</strong> Tick{' '}
            <em>Insert a &ldquo;Table of Contents&rdquo; page at the start</em>{' '}
            for a printed contents page, and leave{' '}
            <em>Show bookmarks panel when the PDF opens</em> on.
          </li>
          <li>
            <strong>Save and download.</strong> Press <em>Save bookmarks</em>.
            You get a preview and a new file with &ldquo;bookmarks&rdquo; in
            its name; your original is left untouched.
          </li>
        </ol>
        <p>
          Password-protected PDFs cannot be opened here. Remove the password with{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Unlock
          </Link>
          , add your bookmarks, then lock it again with{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Protect
          </Link>{' '}
          if needed.
        </p>
      </section>

      {/* 3 */}
      <section id="edit-bookmarks" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListTree className="w-6 h-6 text-orange-500 shrink-0" />
          3. Edit PDF Bookmarks: Rename, Nest, Reorder, Remove
        </h3>
        <p>
          Because the existing outline is kept, this works as a full <strong>PDF bookmark editor</strong>, or{' '}
          <strong>PDF outline editor</strong> in the technical term. Every row
          has a title field, a page box and four controls.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Rename.</strong> For <strong>how to rename bookmarks in
            PDF</strong> files, click into the title and type; the fix for
            bookmarks that arrived as file names or all-capitals text.
          </li>
          <li>
            <strong>Retarget.</strong> Change the number in the <em>p.</em> box.
          </li>
          <li>
            <strong>Nest.</strong> For <strong>how to create nested bookmarks in
            PDF</strong> documents, press <em>+ child</em> on a chapter to add a sub-section beneath it.
          </li>
          <li>
            <strong>Reorder.</strong> The up and down arrows move an entry among
            its siblings. To change an entry&rsquo;s level, use the text
            import, where indentation sets it.
          </li>
          <li>
            <strong>Remove.</strong> For <strong>how to remove bookmarks from
            PDF</strong> files, press the delete button on an entry; its children go with it.
          </li>
        </ul>
        <p>
          The tree edits bookmarks, never pages. For the pages themselves, use the{' '}
          <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF organizer
          </Link>
          , the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-rotate" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF rotate
          </Link>{' '}
          first, then set the bookmarks.
        </p>
      </section>

      {/* 4 */}
      <section id="import-detect" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <WandSparkles className="w-6 h-6 text-orange-500 shrink-0" />
          4. Import a Chapter List or Auto-Detect Headings
        </h3>
        <p>
          For long documents, the second panel offers two bulk routes.
        </p>
        <p>
          <strong>Import from text.</strong> To{' '}
          <strong>import bookmarks from a text file into PDF</strong>, paste
          the list into the box, one entry per line, as{' '}
          <code>Title | page</code>. Every two spaces of indentation put an
          entry one level deeper:
        </p>
        <pre className="text-sm"><code>{`Introduction | 1
  Scope | 2
Chapter 1 | 3
  1.1 Background | 4
  1.2 Method | 9
Chapter 2 | 15`}</code></pre>
        <p>
          Press <em>Import from text</em> and the list replaces the tree as a nested outline, so import first and fine-tune after.
          The quickest route of all: copy the printed contents page of a
          report or thesis, tidy it into this format, and paste.
        </p>
        <p>
          <strong>Auto-detect headings.</strong> To{' '}
          <strong>auto generate bookmarks from PDF headings</strong>, press{' '}
          <em>Auto-detect headings</em>. It takes the first title-like line on
          each page and makes a flat list, one bookmark per page.
          Treat it as a first draft to prune, rename and nest by hand. It does not read
          font sizes or heading styles, so it will not nest anything.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Scanned files.</strong> You can still{' '}
            <strong>add bookmarks to scanned PDF</strong> files by hand or through
            the text import. Auto-detect needs real text, though, and reports
            &ldquo;No text headings detected.&rdquo; on image-only pages. Run
            the file through{' '}
            <Link to="/tools/pdf-ocr" className="font-semibold underline">
              PDF OCR
            </Link>{' '}
            first, then detect.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="contents-page" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-500 shrink-0" />
          5. Add a Table of Contents to an Existing PDF
        </h3>
        <p>
          For <strong>how to add a table of contents to an existing PDF</strong>{' '}
          without the source file, tick the contents-page option before saving
          and, if you like, change the <em>TOC page title</em>. As a{' '}
          <strong>table of contents generator for PDF</strong> files, the tool writes a new
          first page the same size as your current page one, with every
          bookmark listed beneath the title, indented by level, page number
          right-aligned.
        </p>
        <p>
          A page at the front moves every other page down by one. The tool
          shifts every bookmark to match and adds one for the contents page
          itself. The printed numbers assume the list fits on that one page, so
          for a very long outline, keep it to the top levels or skip it.
        </p>
        <p>
          Anyone wanting a{' '}
          <strong>clickable table of contents PDF</strong> gets it in the
          bookmarks panel; the contents page itself is printed text, not links.
          That is why <em>Show bookmarks panel when the PDF opens</em> matters.
          It answers{' '}
          <strong>how to make PDF open with bookmarks panel</strong> showing:
          the file asks the reader to display the outline on opening, so the
          clickable chapter list is visible straight away.
        </p>
      </section>

      {/* 6 */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. PDF Bookmarks Not Showing or Going to the Wrong Page
        </h3>
        <p>
          <strong>PDF bookmarks not showing.</strong> The outline is usually
          there, but the reader&rsquo;s side panel is closed. Open the file
          here, keep <em>Show bookmarks panel when the PDF opens</em> ticked and
          save again. Some simple viewers have no bookmarks panel at all, so
          check in a full PDF reader too.
        </p>
        <p>
          <strong>PDF bookmarks go to wrong page.</strong> The page box counts
          physical pages from the start of the file, not the numbers printed in
          the footer. With twelve pages of front matter, printed
          &ldquo;page 1&rdquo; is PDF page 13, so add that offset to your list
          before importing. To make printed numbers and PDF positions agree,
          stamp new ones with{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page numbers
          </Link>
          . Each bookmark opens the top of its page, not a spot halfway down.
        </p>
        <p>
          <strong>Bookmarks lost after converting to PDF.</strong> Word
          processors only turn headings into bookmarks when that export option
          is ticked and real heading styles are used. Rebuild the outline here
          with the text import, or convert back with{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word
          </Link>
          , fix the heading styles, and export again with{' '}
          <Link to="/tools/docx-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            DOCX to PDF
          </Link>
          .
        </p>
        <p>
          Some jobs belong elsewhere. Combine files with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          before bookmarking; split by page range with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>
          . Bookmarks are saved expanded and unstyled, and the only output is
          the PDF; for the document as text, use{' '}
          <Link to="/tools/pdf-txt-html-rtf-odt" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to TXT
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Bookmark Editor
        </h3>
        <p>
          Most free pages add bookmarks one click at a time. Here is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, no account, no caps', 'No sign-up, no page limit and no tasks-per-hour counter.'],
            ['Keeps the bookmarks you have', 'Existing outlines load into the tree, named destinations included, so you edit what is there instead of starting over.'],
            ['Paste a whole outline', 'One line per entry as Title | page, two spaces per level. A long contents list becomes a nested tree in one go.'],
            ['Contents page on request', 'A printed table of contents at the front, with bookmarks shifted to match and one added for the contents page itself.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after your session, so contracts and theses are safe to bookmark.'],
            ['Never used for training', 'Your documents are never used to train AI models, so a draft thesis or a client file stays yours.'],
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
            free PDF and file tools
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
              'How do I add bookmarks to a PDF for free?',
              'Choose the PDF in the tool above, press + Add bookmark for each section and set its title and page, then press Save bookmarks and download. There is no account and no page limit, and your original file stays as it was.',
            ],
            [
              'Can I edit bookmarks a PDF already has?',
              'Yes. Existing bookmarks load into the tree when you open the file, ready to rename, retarget, nest, reorder or delete. Saving replaces the old outline with the edited one.',
            ],
            [
              'How do I make nested bookmarks with chapters and sub-sections?',
              'Press + child on a chapter to add a sub-section under it. For many entries at once, use Import from text with one Title | page per line and two spaces of indentation for each level deeper.',
            ],
            [
              'Is the table of contents page clickable?',
              'No. The contents page lists titles and page numbers as printed text. The clickable navigation is the bookmarks panel, which includes a bookmark for the contents page itself, and the file can be set to open with that panel showing.',
            ],
            [
              'Why do my bookmarks go to the wrong page?',
              'Page numbers in the tool count physical pages from the start of the file, not the numbers printed in the footer. If the document has front matter, add that many pages to each number. The one-page shift from an added contents page is corrected for you.',
            ],
            [
              'Can it auto-generate bookmarks from a scanned PDF?',
              'Not directly, because auto-detect needs a text layer and scanned pages are only images. Run the file through PDF OCR first, then use Auto-detect headings. Manual bookmarks and the text import work on scanned files straight away.',
            ],
            [
              'How do I remove all bookmarks from a PDF?',
              'Open the file, delete each top-level bookmark so the tree is empty, then save. Deleting a parent also deletes its children, so even a deep outline clears in a few clicks.',
            ],
            [
              'How do I add bookmarks to a PDF without paid PDF software?',
              'Use the tool above: open the PDF, build the tree with + Add bookmark or a pasted Title | page list, and press Save bookmarks. It is free with no account, keeps any bookmarks the file already has, and can add a printed contents page at the front.',
            ],
            [
              'Is there a PDF bookmark editor for Mac?',
              'Yes. Open this page in Safari or Chrome on macOS and it works the same as on Windows: rename, nest and reorder bookmarks, paste a whole chapter list, and add a contents page. The result is a normal PDF that any Mac PDF reader shows with its bookmarks.',
            ],
            [
              'Why were my bookmarks lost after converting to PDF?',
              'Most word processors only turn headings into bookmarks when the bookmarks export option is ticked and the headings use real heading styles. To fix the PDF you already have, paste the chapter list into Import from text here and save; the outline is rebuilt without going back to the source file.',
            ],
            [
              'Is it safe to bookmark a confidential contract or thesis here?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training. The bookmarked copy is a new download, so the original stays where you keep it.',
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
          Bookmarked and ready to send? Shrink a large report with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , pull out just one chapter with{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages from PDF
          </Link>
          , or stamp matching numbers on every page with{' '}
          <Link to="/tools/pdf-page-numbers" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page numbers
          </Link>
          . Curious how tools like this are built? Our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          is a good start.
        </p>
      </div>
    </article>
  );
}
