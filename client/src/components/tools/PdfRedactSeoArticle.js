import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  EyeOff,
  FileWarning,
  HelpCircle,
  Layers,
  ListChecks,
  Scale,
  ScanSearch,
  ShieldCheck,
  SquareDashedMousePointer,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Redact tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. A black box is not a redaction. The page says exactly what the tool
 *    does to the file (text under a box is deleted, links there removed,
 *    a clean file written, the search term re-checked) and what it does not.
 *
 * 2. Every limit is stated with a route: scanned pages are only covered,
 *    metadata and bookmarks stay, search is exact, encrypted files are refused.
 *
 * 3. A checking routine (search, copy, select-all) is given so the reader
 *    can confirm any redaction, from any tool, before sending it.
 */
export default function PdfRedactSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Redact PDF Online Free</span>: Black Out Text, Truly Remove It, and Check Nothing Leaks
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        An account number on a bank statement. A client&rsquo;s name in a
        court filing. When you <strong>redact a PDF</strong>, the goal is not
        to make the words harder to see; it is to make them gone. Plenty of
        files have been &ldquo;redacted&rdquo; with a drawn rectangle, only for
        the hidden text to be copied straight out from underneath. This guide shows how to{' '}
        <strong>black out text in a PDF</strong> so the words are deleted from
        the file, how to find every copy of a name at once, how to prove the
        result is clean, and &mdash; just as plainly &mdash; which kinds of
        content a box cannot remove and where to go for those.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-redact.webp"
            alt="Redact PDF online free - black boxes permanently removing names and account numbers from a confidential PDF document to anonymize it before sharing"
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
              The box is the part you see. The part that matters is that the
              text underneath is no longer in the file.
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
            ['#what-is-redaction', '1. What PDF Redaction Is, and Why a Black Box Is Not Enough'],
            ['#how-to-redact', '2. How to Redact a PDF Online Free in Four Steps'],
            ['#find-all', '3. How to Redact All Instances of a Word in a PDF'],
            ['#what-it-removes', '4. What Is Removed, What Is Covered, What Stays'],
            ['#check-redaction', '5. How to Check If a PDF Is Properly Redacted'],
            ['#use-cases', '6. Bank Statements, Legal Files, Medical Records and FOIA'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Redaction Tool'],
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
      <section id="what-is-redaction" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <EyeOff className="w-6 h-6 text-orange-500 shrink-0" />
          1. What PDF Redaction Is, and Why a Black Box Is Not Enough
        </h3>
        <p>
          <strong>PDF redaction</strong> means permanently removing information
          from a document before someone else sees it. On paper that was a
          marker pen. In a PDF it is two separate jobs, and most{' '}
          <strong>redaction failure PDF</strong> stories come from doing only
          the first one.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" /> Covering
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A rectangle is drawn on top of the words. The page looks
              redacted, but the text is still underneath: search finds it and
              copy and paste lifts it out.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" /> Removing
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The characters under the box are deleted from the page, then
              the box is painted where they were. Nothing is left to search,
              copy or uncover. This is true redaction, and the default here.
            </p>
          </div>
        </div>
        <p>
          If the text must be unreadable to the next person who opens the
          file, you need a <strong>PDF redaction tool</strong> that removes
          it, and a way to check that it did.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-redact" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SquareDashedMousePointer className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Redact a PDF Online Free in Four Steps
        </h3>
        <p>
          Here is <strong>how to redact a PDF</strong> with the tool at the top
          of this page. It is a <strong>free PDF redactor with no sign-up</strong>:
          no account, no trial, no daily limit, and no need for paid desktop
          software.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the PDF.</strong> Drop it onto the panel or click to
            browse, one file at a time. A password-protected file must be
            unlocked first; the{' '}
            <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF unlocker
            </Link>{' '}
            removes it if you know the password.
          </li>
          <li>
            <strong>Mark the regions.</strong> Drag on the page preview to draw
            a box over each thing to hide, and use the page selector to move
            between pages. A status line counts your regions.
          </li>
          <li>
            <strong>Pick the box colour.</strong> Black is the default. Choose
            white if you want to <strong>white out text in a PDF</strong> so
            the gap blends into the page; the text underneath is removed
            either way.
          </li>
          <li>
            <strong>Apply and download.</strong> Press <em>Apply redaction</em>.
            You see how many characters were permanently removed, and the file
            downloads as <strong>-redacted.pdf</strong>, leaving your original
            untouched.
          </li>
        </ol>
        <p>
          <em>Remove underlying text (true redaction)</em> is ticked from the
          start. Untick it only for a cover-only box you can take off later;
          for anything leaving your hands, leave it on.
        </p>
      </section>

      {/* 3 */}
      <section id="find-all" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanSearch className="w-6 h-6 text-orange-500 shrink-0" />
          3. How to Redact All Instances of a Word in a PDF
        </h3>
        <p>
          Drawing every box by hand is how names get missed. Type the name into <em>Find text</em> and press{' '}
          <em>Mark all matches</em>: a box is placed over every match on every
          page, and you are told how many were found. Then page through and
          look at each one before you apply, because a match is exactly the
          text you typed and nothing more.
        </p>
        <p>
          The search is literal and ignores case, so &ldquo;smith&rdquo;
          finds &ldquo;SMITH&rdquo;. It does not match patterns, so it cannot
          find &ldquo;every email address&rdquo;; search for each specific
          value instead. A phrase stored in separate pieces may be missed, so
          try its single words too. No matches usually means the words are
          part of an image or were converted to shapes.
        </p>
      </section>

      {/* 4 */}
      <section id="what-it-removes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileWarning className="w-6 h-6 text-orange-500 shrink-0" />
          4. What Is Removed, What Is Covered, What Stays
        </h3>
        <p>
          Knowing <strong>how to remove sensitive information from a PDF</strong>{' '}
          starts with knowing what happens under each box.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Text is deleted.</strong> Every character overlapping a box
            is removed, with its space kept so the line does not shift. The
            file is written fresh, so the old words are not hiding in an
            earlier saved version inside it.
          </li>
          <li>
            <strong>Links and comments are removed</strong> wherever they
            overlap a box.
          </li>
          <li>
            <strong>Images are covered, not erased.</strong> A photo, signature
            image or scanned page under a box is painted over, but its pixels
            remain in the file. For a scanned document, convert the pages with{' '}
            <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to JPG
            </Link>
            , paint over the details with a black box in{' '}
            <Link to="/tools/image-blur" className="text-orange-600 font-semibold underline hover:text-orange-700">
              Image Blur
            </Link>
            , which replaces the pixels in the exported image, and rebuild the file with{' '}
            <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
              Image to PDF
            </Link>
            . To make scanned words findable first, run{' '}
            <Link to="/tools/pdf-ocr" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF OCR
            </Link>
            .
          </li>
          <li>
            <strong>Form fields are a special case.</strong> Values outside
            your boxes are kept, and some text in reusable page parts is only
            covered. Bake fields into the page with the{' '}
            <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF flattener
            </Link>{' '}
            before redacting.
          </li>
          <li>
            <strong>Metadata, bookmarks and attachments stay.</strong> The
            author, title, bookmark names and any attached files come through
            unchanged. Bookmark titles can be renamed with the{' '}
            <Link to="/tools/pdf-bookmarks" className="text-orange-600 font-semibold underline hover:text-orange-700">
              bookmark editor
            </Link>
            ; check document properties yourself before sending.
          </li>
        </ul>
        <p>
          If a whole page should go rather than be blacked out, the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>{' '}
          deletes it outright. Boxes here are always solid colour, with no
          blur or pixelate effect; if you want a blurred look, export the page
          as an image and use the Image Blur tool mentioned above. Several PDFs
          need redacting? The tool takes one file at a time, so work through
          them in turn and run the checks below on each.
        </p>
      </section>

      {/* 5 */}
      <section id="check-redaction" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Check If a PDF Is Properly Redacted
        </h3>
        <p>
          If you have ever found <strong>redacted text still visible when copied</strong>,
          or a <strong>black box PDF text still searchable</strong> with a
          simple find, you have seen a cover-only redaction. This tool checks
          its own work: with your search term still in the box and true
          redaction on, the finished file is re-read and you get either{' '}
          <em>Verified: the search text no longer appears</em> or a warning to
          mark the remaining areas. That check covers the search term only,
          not areas you boxed by hand, so test those yourself.
        </p>
        <p>Then run three checks of your own on the downloaded copy:</p>
        <ol className="space-y-2">
          <li>
            <strong>Search.</strong> Press Ctrl+F (Cmd+F on a Mac) in any PDF
            reader and search each redacted word. It should find nothing.
          </li>
          <li>
            <strong>Copy and paste.</strong> Drag-select across a black box,
            copy, and paste into a plain text editor. You should get blank
            space, not the hidden words.
          </li>
          <li>
            <strong>Select all.</strong> Press Ctrl+A, copy, paste, and read
            the result for anything you meant to remove.
          </li>
        </ol>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Can a redacted PDF be unredacted?</strong> Text removed with
            true redaction on cannot be recovered from the new file, because
            it is no longer in it. A cover-only box can be lifted off, and an
            image under a box can be extracted, so scanned pages need the image
            route in section 4.
          </p>
        </div>
        <p>
          To see every change, open both versions in{' '}
          <Link to="/tools/pdf-compare" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Compare
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="use-cases" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          6. Bank Statements, Legal Files, Medical Records and FOIA
        </h3>
        <p>
          The same four steps cover very different jobs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Redact bank statement PDF files.</strong> A landlord wants
            proof of income, not your account number. Search the number to
            mark each copy, then box transactions by hand.
          </li>
          <li>
            <strong>Redact names from legal documents (PDF).</strong> For discovery
            or a public filing, search each party&rsquo;s name, review every
            match, and run the three checks above.
          </li>
          <li>
            <strong>Redact medical records PDF files for HIPAA.</strong> The{' '}
            <a
              href="https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              HHS de-identification guidance
            </a>{' '}
            lists which patient identifiers count. Scanned charts need the
            image route in section 4.
          </li>
          <li>
            <strong>Redact PDF files for a FOIA request.</strong> Records officers
            removing exempt passages before release can find the rules and
            exemptions at{' '}
            <a
              href="https://www.foia.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              FOIA.gov
            </a>
            ; this tool handles the removal itself.
          </li>
          <li>
            <strong>Redact resume PDF personal information</strong>, such as
            your home address and phone number, before posting it: a white box
            keeps the layout clean.
          </li>
          <li>
            <strong>Anonymize a PDF document</strong> for research or a case
            study by searching each name, place and ID in turn.
          </li>
        </ul>
        <p>
          It works the same when you <strong>redact a PDF on a Mac</strong>{' '}
          or <strong>redact a PDF on a Chromebook</strong>: choose the file,
          draw, apply. On a Mac, open this page in Safari or Chrome and you can
          redact without buying paid PDF software.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Redaction Tool
        </h3>
        <p>
          Many pages offer to <strong>blackout PDF online</strong> or{' '}
          <strong>censor PDF online</strong>. Few say what happens to the text
          under the box, and fewer check the result.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['True redaction by default', 'Text under every box is deleted from the file, not just hidden, and overlapping links and comments are removed with it.'],
            ['Verified, not hoped', 'The finished file is re-read for your search term, and you are told plainly whether it is gone or still appears elsewhere.'],
            ['Find and mark every match', 'Type a name or number once and every copy on every page is boxed for you to review.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'Your statements, filings and records are never used for training.'],
            ['Free, no sign-up, honest limits', 'No account, trial or daily cap. What the tool cannot remove is listed on this page, with the tool that can.'],
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
          It sits alongside the rest of our{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>
          . Want the redacted copy locked before you send it? Add a password
          with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>
          .
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
              'How do I redact a PDF online for free?',
              'Choose the PDF in the tool above, drag boxes over what you want hidden, and press Apply redaction. The file downloads as a new copy ending in -redacted.pdf, with no account or daily limit.',
            ],
            [
              'Is the text actually removed, or just covered?',
              'With Remove underlying text left ticked, which is the default, every character under a box is deleted from the file before the box is painted. Links and comments overlapping the box are removed too. Unticking the option gives a cover-only box that can be taken off later.',
            ],
            [
              'Why can I still copy or search text after blacking it out elsewhere?',
              'Because a drawn rectangle only covers the words; the text is still in the file underneath. Redact the file again here with true redaction on, then confirm with a search and a copy and paste test.',
            ],
            [
              'Why is my PDF redaction not working?',
              'If the text can still be searched or copied, the box only covered it: redact again here with Remove underlying text ticked. If Find text says no matches, the words are part of an image or were turned into shapes, so draw the box by hand or use the scanned-page route. If the file is refused, it is encrypted and needs unlocking first; if a phrase is missed, search its single words.',
            ],
            [
              'How do I redact a PDF without paid PDF software?',
              'Use the tool at the top of this page. It is free with no account or trial: choose the PDF, draw boxes or mark every match of a word, and apply. The text under each box is deleted from the file, the same true redaction paid editors offer.',
            ],
            [
              'Can I redact every mention of a name at once?',
              'Yes. Type it into Find text and press Mark all matches to box every exact match on every page, ignoring case. Review each page before applying, and search for single words too, since a phrase stored in pieces can be missed.',
            ],
            [
              'Can it find emails, phone numbers or card numbers automatically?',
              'No. The search is exact text only, with no pattern matching. Search for each specific value you need hidden, or draw boxes over them by hand.',
            ],
            [
              'Does it work on scanned PDFs?',
              'A scanned page is an image, so a box covers it but the pixels stay in the file. Convert the pages with PDF to JPG, black out the details with Image Blur, and rebuild with Image to PDF. PDF OCR can make scanned text searchable first.',
            ],
            [
              'Does redacting remove the author name and other metadata?',
              'No. Document properties, bookmarks and attachments are kept as they are. Bookmark titles can be changed with the bookmark editor, and you should check the file properties before sharing.',
            ],
            [
              'Can I redact a password-protected PDF?',
              'Not directly. Encrypted files are refused with a message asking you to remove the protection first. Unlock it with the PDF unlocker if you know the password, redact, then add a new password with the PDF password protector if you need one.',
            ],
            [
              'Is it safe to redact confidential files here?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training. The original stays untouched, and only the redacted copy is downloaded.',
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
          Redacted and ready to send? Trim the file with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , pull out only the pages you need with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>
          , join several redacted files with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , or mark a copy as confidential with the{' '}
          <Link to="/tools/pdf-watermark" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF watermark tool
          </Link>
          . Curious how tools like this are built? Try our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
