import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  CaseSensitive,
  Check,
  FolderArchive,
  Hash,
  HelpCircle,
  Layers,
  ListOrdered,
  MonitorSmartphone,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the File Renamer tool.
 *
 * Written against what FileRenamer.js actually does, which is narrower than
 * the head keywords ("bulk rename files", "batch rename files") imply. Those
 * phrases are owned by desktop software that renames in place with regex,
 * sort orders and metadata tokens. This tool does none of that: it takes a
 * batch of files, applies a fixed chain of rules (plain-text find and replace,
 * a letter-case mode, optional 01/02 numbering, prefix, suffix, new extension)
 * and hands back renamed copies in a single ZIP. Originals are untouched.
 *
 * So the article leans on the three things the code does that the crowded
 * "rename online" field never says out loud: the kebab-case and snake_case
 * modes (the web-safe filename job developers actually search for), the
 * automatic -1/-2 de-duplication that stops a batch overwriting itself inside
 * the ZIP, and the copies-not-in-place model framed as the safety feature it
 * is. Section 7 lists the limits plainly.
 *
 * Declined on purpose: regex find/replace (the code has a branch, the UI
 * never enables it), any control over numbering start, step, padding or
 * position, sorting or reordering before numbering, folder structure, EXIF or
 * date-based names, and the idea that changing an extension converts the
 * file. "Find and replace in file names bulk" is answered as plain text only,
 * and the extension keyword is routed to the real converters.
 */
export default function FileRenamerSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Bulk Rename Files Online</span> Into Clean, Web-Safe, Numbered Names
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Two hundred photos called IMG_4471 to IMG_4670. A client handover where
        half the assets have spaces in their names and the rest are in
        capitals. Forty submissions all called &ldquo;Assignment 2
        (final).docx&rdquo;. None of this is hard one file at a time; all of it
        is miserable at scale. This guide shows how to{' '}
        <strong>bulk rename files online</strong> with a{' '}
        <strong>free online file renamer</strong> that previews every new name
        before you commit, resolves duplicates on its own, and returns the
        results as a ZIP while your originals stay exactly where they were.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/file-renamer.webp"
            alt="Four blank hang tags in white, kraft and black on strings, ready to be labelled"
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
              Every rule updates the preview as you type: original name on the
              left, new name on the right, one ZIP at the end.
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
            ['#copies-not-in-place', '1. Renamed Copies in a ZIP, Not In-Place Renames'],
            ['#how-to-rename', '2. How to Bulk Rename Files Online in Four Steps'],
            ['#the-rules', '3. The Rules, in the Order They Run'],
            ['#web-safe-names', '4. Web-Safe Names: kebab-case, snake_case and lowercase'],
            ['#numbering-and-duplicates', '5. Sequential Numbering and Duplicate Handling'],
            ['#any-device', '6. Chromebook, iPad, Mac and Locked-Down Work PCs'],
            ['#what-it-does-not-do', '7. What This Renamer Does Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free File Renamer'],
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
      <section id="copies-not-in-place" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderArchive className="w-6 h-6 text-orange-500 shrink-0" />
          1. Renamed Copies in a ZIP, Not In-Place Renames
        </h3>
        <p>
          Every desktop <strong>file renamer</strong> changes the names already
          in a folder; if the pattern was wrong, the damage is done. That is why
          people search for a way to{' '}
          <strong>rename files with live preview before applying</strong>{' '}
          anything.
        </p>
        <p>
          This tool takes a different route. You add files, set rules, and watch
          a two-column list update on every keystroke: original name on the left,
          proposed name on the right. One button then packs every file under its
          new name into <code>renamed_files.zip</code>. Your originals are not
          touched. You <strong>rename files and download as ZIP</strong>, then
          extract the clean set wherever it should live. The preview cannot be
          skipped, and the output opens on any operating system &mdash; or in
          our{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          if yours will not.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-rename" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Bulk Rename Files Online in Four Steps
        </h3>
        <p>
          No account, no email and no cap on the number of files. To <strong>batch rename files</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          {[
            ['Add your files', 'Drag them onto the panel or click Add Files. Any type is accepted; they queue in the order added.'],
            ['Set the rules', 'Fill in only what you need: Find and Replace With, Letter Case, Prefix, Suffix, Change Extension or Sequential Numbering. Empty fields are skipped.'],
            ['Check the preview', 'Every row shows the original name and the new one, updating as you type.'],
            ['Download the ZIP', 'Press Download Renamed Files (ZIP) and renamed_files.zip arrives with every file under its new name.'],
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
          To <strong>bulk rename files</strong> from several folders with one
          pattern, add them all at once; if each needs its own prefix, press Clear
          and run separate batches.
        </p>
      </section>

      {/* 3 */}
      <section id="the-rules" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Rules, in the Order They Run
        </h3>
        <p>
          The rules apply in a fixed sequence. Each works on the base name; the
          extension is split off at the last dot and reattached at the end.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              1. Find and Replace With
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Plain text, case-sensitive, every occurrence. Put &ldquo;IMG_&rdquo;
              in Find and leave Replace empty to delete it. This is{' '}
              <strong>find and replace in file names bulk</strong> with no
              wildcards: exactly the characters you typed.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              2. Letter Case
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              lowercase, UPPERCASE, Title Case, kebab-case or snake_case. Runs
              after Find, so Find matches the name as it was.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              3. Sequential Numbering
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A checkbox. Appends _01, _02, _03 in queue order, padded to two
              digits. Start, step and separator are fixed.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              4. Prefix and Suffix
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Added last, so they wrap the numbered result and keep the capitals
              you typed. Prefix &ldquo;ACME-&rdquo; plus numbering gives
              ACME-photo_01.
            </p>
          </div>
        </div>
        <p>
          <strong>How to add a prefix to multiple file names</strong> is therefore
          one field. <strong>How to add a suffix to file names in bulk</strong> is
          the other box &mdash; &ldquo;_v2&rdquo;, &ldquo;_final&rdquo; &mdash;
          and it lands before the extension. <strong>Change Extension</strong>{' '}
          swaps the part after the dot, which is how you{' '}
          <strong>change the file extension of multiple files at once</strong>:
          .jpeg to .jpg, .txt to .md. If the rules would leave nothing at all,
          the original name is kept.
        </p>
      </section>

      {/* 4 */}
      <section id="web-safe-names" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CaseSensitive className="w-6 h-6 text-orange-500 shrink-0" />
          4. Web-Safe Names: kebab-case, snake_case and lowercase
        </h3>
        <p>
          This is the job the tool was built for. If your <strong>file names have spaces breaking upload</strong>{' '}
          forms, image links or CMS imports, the cause is that a space is not a
          legal character in a web address. The URI syntax in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc3986"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 3986
          </a>{' '}
          allows a small set of characters unencoded; everything else must be
          percent-encoded, which is why &ldquo;Hero Banner.png&rdquo; becomes
          &ldquo;Hero%20Banner.png&rdquo; in one place and a broken link in
          another. Many web servers also treat Hero.png and hero.png as different
          files.
        </p>
        <p>
          The Letter Case menu solves both at once. To{' '}
          <strong>convert file names to kebab-case</strong>, pick that mode: the
          name is trimmed and lowercased, spaces and underscores become single
          hyphens, and runs of hyphens collapse. &ldquo;Hero Banner
          FINAL.png&rdquo; becomes hero-banner-final.png. To{' '}
          <strong>rename files to snake_case in bulk</strong> &mdash; what Python
          projects and data pipelines expect &mdash; choose snake_case and the
          same happens with underscores. Either is the quickest way to{' '}
          <strong>remove spaces from file names across multiple files</strong>.
          If you only need to{' '}
          <strong>make all file names lowercase at once</strong> and keep the
          punctuation, choose lowercase; to{' '}
          <strong>rename files to Title Case in bulk</strong>, every word gets a
          capital first letter and the rest is lowercased.
        </p>
        <p>
          A full recipe to <strong>rename files for web upload with no spaces and lowercase</strong>{' '}
          names: Find &ldquo;FINAL&rdquo; and replace with nothing, Letter Case
          kebab-case, Prefix with the campaign slug, and Change Extension to
          settle .JPG and .jpeg into one .jpg. If the images also need to be
          smaller, use the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          first and rename the output.
        </p>
      </section>

      {/* 5 */}
      <section id="numbering-and-duplicates" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-6 h-6 text-orange-500 shrink-0" />
          5. Sequential Numbering and Duplicate Handling
        </h3>
        <p>
          The classic camera problem: <strong>photos all named IMG_ and no idea how to rename them in order</strong>.
          Find &ldquo;IMG_&rdquo;, Replace with nothing, Prefix
          &ldquo;wedding-&rdquo;, tick Sequential Numbering, and IMG_4471.jpg
          becomes wedding-4471_01.jpg. That is <strong>how to rename files sequentially</strong>{' '}
          here: queue order is number order, first added is _01. The numbers are
          two digits, start at 1, step by 1, and sit at the end of the base name
          with an underscore.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          What happens when two names collide
        </h4>
        <p>
          Apply lowercase to Report.pdf and report.pdf and you have two files
          with one name. A tool that lets that through either fails or silently
          keeps one file. Here the check is always on and case-insensitive: the
          first file keeps the clean name, the second becomes report-1.pdf, the
          third report-2.pdf, with the counter before the extension. You see it
          in the preview, which is what people mean when they search for a way
          to{' '}
          <strong>rename duplicate file names automatically</strong>. Nothing is
          ever lost inside the archive.
        </p>
      </section>

      {/* 6 */}
      <section id="any-device" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorSmartphone className="w-6 h-6 text-orange-500 shrink-0" />
          6. Chromebook, iPad, Mac and Locked-Down Work PCs
        </h3>
        <p>
          People look for a{' '}
          <strong>batch file renamer with no signup</strong> because the desktop
          option is unavailable to them.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Rename files on a Chromebook, multiple at once.</strong> The
            Files app renames one item at a time. Open this page, add the files,
            and take the ZIP back.
          </li>
          <li>
            <strong>Batch rename files on an iPad.</strong> Same one-at-a-time
            limit in the Files app. The picker here accepts a multi-select, and
            Files can unpack the ZIP.
          </li>
          <li>
            <strong>You cannot add renaming software to a work computer.</strong>{' '}
            No admin rights, a locked software policy. Open this page instead;
            nothing about your files is stored or retained afterwards.
          </li>
          <li>
            <strong>Bulk rename files on a Mac without writing a workflow.</strong>{' '}
            Finder can add and replace text but offers no kebab-case, snake_case
            or lowercase mode.
          </li>
        </ul>
        <p>
          The same applies to a teacher who needs to{' '}
          <strong>rename student submissions files in bulk</strong>: Find the
          platform&rsquo;s junk prefix, replace it with nothing, Title Case the
          rest, add a suffix like &ldquo;_Wk3&rdquo;, and the cohort is
          consistent in one pass. If the export arrived as one archive, unpack it
          first; this tool does not rename files inside a ZIP.
        </p>
      </section>

      {/* 7 */}
      <section id="what-it-does-not-do" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ban className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Renamer Does Not Do
        </h3>
        <p>
          A <strong>bulk file renamer</strong> earns trust by being clear about
          its edges.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>No regular expressions.</strong> Find is plain text and
            case-sensitive. For wildcards, a desktop renamer or a shell is the
            right instrument.
          </li>
          <li>
            <strong>No numbering options.</strong> Start at 1, step by 1, two
            digits, underscore, suffix position.
          </li>
          <li>
            <strong>No sorting.</strong> Files are numbered in the order you
            added them; there is no sort by name, date or size.
          </li>
          <li>
            <strong>No folders.</strong> Every file lands in the root of the ZIP.
          </li>
          <li>
            <strong>No per-file edits.</strong> One rule set applies to the whole
            batch; a single output name cannot be hand-typed in the preview, and
            there are no saved presets or undo history.
          </li>
          <li>
            <strong>No stated size cap, but no guarantee either.</strong> A very
            large batch may fail with an &ldquo;Export error&rdquo; message; if
            that happens, split it into smaller batches.
          </li>
          <li>
            <strong>No metadata.</strong> Dates taken, ID3 tags and dimensions
            cannot appear in a name; there are no {'{name}'} or {'{date}'} tokens.
          </li>
          <li>
            <strong>Changing an extension does not convert the file.</strong>{' '}
            photo.png renamed to photo.jpg is still a PNG. For a real format
            change use the{' '}
            <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image converter
            </Link>
            ,{' '}
            <Link to="/tools/audio-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              audio converter
            </Link>{' '}
            or the{' '}
            <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
              file converter hub
            </Link>
            , then rename the output.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free File Renamer
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, every time', 'No account, no email, no trial countdown and no file cap.'],
            ['Originals are never touched', 'You get renamed copies in a ZIP. A wrong pattern costs a second look at the preview, not a folder of mangled names.'],
            ['Live preview on every keystroke', 'Original name beside new name for every file, before anything is packed.'],
            ['kebab-case and snake_case built in', 'Web-safe naming is a menu choice, not a script. Spaces, mixed case and underscores are normalised in one move.'],
            ['Duplicates resolved automatically', 'Colliding names are checked case-insensitively and given -1, -2 before the extension, so the archive never drops a file.'],
            ['Your files stay private', 'Nothing you add is stored on our servers, retained after your session, or used for training or analytics.'],
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
            free file tools
          </Link>{' '}
          on the same terms, so you can{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            build an archive
          </Link>
          ,{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            resize a batch of images
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge the renamed PDFs
          </Link>{' '}
          without paying for any of it.
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
              'How do I rename multiple files at once without installing software?',
              'Add the files to the panel at the top of this page, set your rules, check the preview and download the ZIP. There is no account to create. It is the simplest way to bulk rename files online when desktop software is out of reach.',
            ],
            [
              'Why do I get a ZIP instead of my files being renamed in place?',
              'Because the tool never modifies your originals. It packs renamed copies into renamed_files.zip so a mistake is caught in the preview rather than in your folder. Extract the ZIP where you want the clean set.',
            ],
            [
              'Can I use wildcards or a regular expression in the Find box?',
              'No. Find is plain text and case-sensitive, replacing every occurrence of exactly what you typed. Pattern matching needs a desktop renamer or a shell.',
            ],
            [
              'Can I choose where the numbering starts or how many digits it has?',
              'Not at the moment. Sequential Numbering always starts at 01, steps by 1, pads to two digits and is added as a suffix with an underscore. Add the files in the order you want them numbered.',
            ],
            [
              'What happens if two files end up with the same new name?',
              'The second gets -1 added before its extension, the third -2, and so on. The comparison ignores case, so Report.pdf and report.pdf clash. The adjusted names show in the preview, and no file is overwritten inside the ZIP.',
            ],
            [
              'Does changing the extension convert the file to that format?',
              'No. Change Extension only renames the part after the dot; the contents are unchanged. Use it to tidy .JPEG and .jpeg into .jpg. To actually convert a file, use one of the converters on the tools page.',
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
          Need the files in a different shape as well as a different name? The{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive creator
          </Link>{' '}
          packs a finished set for sending,{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          changes the format for real rather than just the label, and{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          tidies the config files beside a freshly renamed asset folder. To
          understand why kebab-case, URL encoding and case-sensitive paths matter,
          our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers them from the first module.
        </p>
      </div>
    </article>
  );
}
