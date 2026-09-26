import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FolderTree,
  Gauge,
  HelpCircle,
  Laptop,
  Layers,
  Mail,
  Package,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Create Archive tool.
 *
 * Written against what CreateArchive.js actually does, which is narrower than
 * the generic name suggests and narrower than the keyword set would like.
 *
 * The tool writes ZIP and nothing else. "Create archive" pulls in 7z, RAR and
 * TAR searches; section 7 sends TAR readers to the archive converter and says
 * plainly that 7z, RAR and ISO are not produced anywhere on the site. It has
 * no password option, so "password protect zip" is answered honestly and not
 * promised. It cannot split into volumes, so the email section talks about
 * shrinking the contents first instead.
 *
 * The angle is the compression level slider, because it is the one control
 * here that people searching "why is my zip file not smaller" and "zip taking
 * forever" actually need: level 0 stores already-compressed media without
 * wasting time, level 9 earns its keep on text, code and spreadsheets.
 *
 * Two behaviours from the code shape the folder section: nested paths are
 * kept only when a folder is picked with the Add Folder button (drag-and-drop
 * takes loose files), and the queue does not de-duplicate, so adding the same
 * file twice fails the build with "File already exists". Both are stated so
 * the reader does not think the tool is broken.
 */
export default function CreateArchiveSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 11 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Create ZIP File Online</span> and Pick the Right Compression Level
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Twelve photos, a folder of contracts, a whole project of source code
        &mdash; at some point every batch of files needs to become one file.
        Any tool that lets you <strong>create zip file online</strong> will
        package them; this <strong>free online zip creator</strong> also gives
        you a control most tools hide: a compression level from 0 to 9,
        including a store-only mode. This guide explains what each level does,
        why zipping photos rarely shrinks them, how to keep a folder&rsquo;s
        structure intact, and the handful of things a ZIP cannot do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/create-archive.webp"
            alt="A bundle of old letters tied with string beside sepia photographs, an ink pen and bottle"
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
              Files or an entire folder in, one named ZIP out &mdash; with the
              compression level under your control.
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
            ['#what-a-zip-does', '1. What a ZIP File Actually Does'],
            ['#how-to-create', '2. How to Create ZIP File Online Free'],
            ['#compression-level', '3. Compression Level 0 vs 9: What the Slider Changes'],
            ['#folders', '4. Convert a Folder to ZIP and Keep Its Structure'],
            ['#email-and-sharing', '5. Sending Multiple Files as One Attachment'],
            ['#other-devices', '6. Zipping Files on a Chromebook, Work PC or iPad'],
            ['#limits', '7. What This Tool Does Not Do'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Online Zip Creator'],
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
      <section id="what-a-zip-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a ZIP File Actually Does
        </h3>
        <p>
          A ZIP is a container. It takes any number of files, remembers each
          one&rsquo;s name and folder path, optionally squeezes each one with a
          compression method called DEFLATE, and writes the lot into a single
          file. The container format is standardised as{' '}
          <a
            href="https://www.iso.org/standard/60101.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 21320-1
          </a>{' '}
          and the compression method is defined in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc1951"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 1951
          </a>
          , which is why a ZIP made here opens on Windows, macOS, Android,
          iOS and Linux alike.
        </p>
        <p>Two things follow from that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>ZIP is lossless.</strong> DEFLATE finds repetition and
            writes it more compactly; unzipping restores every byte exactly.
            Nothing is resampled, recoloured or trimmed. You can{' '}
            <strong>zip photos for email without losing quality</strong>{' '}
            because quality is never touched.
          </li>
          <li>
            <strong>Packaging and shrinking are separate jobs.</strong> A ZIP
            always packages. Whether it also shrinks depends entirely on what
            is inside, which is the subject of section 3 and the reason the
            level slider exists.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-create" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Create ZIP File Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no watermark and no trial counter. To{' '}
          <strong>zip files online</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add files or a folder', 'Click Add Files to pick any number of files of any type, or Add Folder to pull in a whole folder including its sub-folders. Loose files can also be dragged onto the panel. Keep adding — everything queues up in one list.'],
            ['Name it and set a level', 'Type an archive name (the .zip ending is added for you) and slide the compression level. 6 is a sensible default; section 3 tells you when 0 or 9 is the better choice.'],
            ['Create and download', 'Press Create & Download ZIP Archive. A progress bar names each file as it goes, and the finished ZIP downloads on its own with a note of its final size and item count.'],
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
          The queue shows every item&rsquo;s path and size with a running
          total. Remove a mistake with the cross beside it, or start over with
          Clear All. Because items accumulate, this is a genuine{' '}
          <strong>online zip file maker</strong> for mixed batches: a folder
          from one place, three stray files from another, and you{' '}
          <strong>zip multiple files into one file online</strong> in a
          single pass.
        </p>
      </section>

      {/* 3 */}
      <section id="compression-level" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. Compression Level 0 vs 9: What the Slider Actually Changes
        </h3>
        <p>
          Most tools hide this setting or fix it at one value. The{' '}
          <strong>zip compression level 0 vs 9 difference</strong> is simple:
          DEFLATE only removes repetition, and a higher level searches harder
          for it and takes longer. If there is repetition to find, the effort
          pays off. If there is not, the file comes out the same size.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Level 0 &mdash; Store Only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Files are packaged exactly as they are, with no compression pass
              at all. This is the fastest way to bundle JPG, PNG, MP4,
              MP3 and PDF files, because those formats are already compressed
              internally and DEFLATE cannot squeeze them further.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Levels 1&ndash;6 &mdash; Fast to Balanced
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A light or moderate search for repetition. Good for mixed
              batches where you do not know what is inside, or for a quick
              hand-off where a few extra kilobytes do not matter. Level 6 is
              the default.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Levels 7&ndash;9 &mdash; Max
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The hardest search. Worth it for text, source code, CSV exports,
              SVG, logs, JSON and XML, and older Office documents, all of
              which are full of repetition. Slower, but the archive can end up
              a fraction of the original size.
            </p>
          </div>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Why is my zip file not smaller?
        </h4>
        <p>
          Because the files inside were already compressed before you started.
          A JPEG had its redundancy removed by the camera, an MP4 by the
          encoder, a PDF by whatever produced it. Zipping them again finds
          almost nothing, so <strong>zipping photos doesn&rsquo;t reduce
          size</strong> at any level. The ZIP is still one file instead of
          forty, but for those formats it is a packager, not a shrinker. If the
          goal is smaller photos, run them through the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          first and then zip the results at level 0.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Why is the zip taking forever on large files?
        </h4>
        <p>
          Same cause, opposite symptom. When you <strong>zip large files</strong>{' '}
          that are already compressed at level 6 or 9, all the time goes into
          a search that finds nothing. Slide the level to 0 instead. If you
          want to <strong>create a zip with no compression, store only</strong>{' '}
          is the setting made for video folders, photo shoots and music
          libraries.
        </p>
      </section>

      {/* 4 */}
      <section id="folders" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Zip a Folder and Keep the Folder Structure
        </h3>
        <p>
          To <strong>convert folder to ZIP online</strong>, use the Add
          Folder button rather than dragging. That walks every sub-folder and
          records each file with its relative path, so{' '}
          <code>project/src/index.js</code> lands in the archive at exactly
          that path and the tree comes back when the recipient unzips. That is
          the whole answer to{' '}
          <strong>zip folder keep folder structure online</strong>: pick the
          folder with the button, and the structure is kept.
        </p>
        <p>
          Drag-and-drop is different: dropping files onto the panel adds those
          files at the top level of the archive, and dropping a folder does
          not walk its contents. If you drop a folder and see fewer items than
          you expected, that is why &mdash; use Add Folder instead.
        </p>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Zipping a source code folder without node_modules
        </h4>
        <p>
          Add a whole project folder and the queue fills with thousands of
          entries under <code>node_modules</code>, <code>.git</code> or{' '}
          <code>build</code>. The cleanest route is to add the project&rsquo;s
          sub-folders one at a time (<code>src</code>, <code>public</code>,
          config files) and leave the heavy directories out; every row also
          has a remove button. Zip source at level 9 &mdash; code is the
          format DEFLATE likes most.
        </p>
      </section>

      {/* 5 */}
      <section id="email-and-sharing" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Send Multiple Files as One Attachment
        </h3>
        <p>
          Email clients will not attach a folder, and most chat apps and web
          portals want a single file. When you need to{' '}
          <strong>send multiple files as one attachment</strong>, zip them. If
          you were searching for{' '}
          <strong>how to attach a folder to an email</strong>: Add Folder,
          name the archive, create it, and attach the one ZIP that downloads.
          The recipient double-clicks it and gets your folder back.
        </p>
        <p>
          The same move covers the other phrasing people use: to{' '}
          <strong>combine files into one download</strong> for a client or a
          colleague, package them here and share the single ZIP through
          whatever channel you already use.
        </p>
        <p>
          Attachment size limits are where people get stuck, and a ZIP will
          not rescue you if the contents are already compressed; this tool
          cannot split an archive into multi-part volumes either. What works
          is shrinking the contents before packaging:{' '}
          <Link to="/tools/jpeg-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress the JPEGs
          </Link>
          ,{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress the video
          </Link>{' '}
          or{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress the PDFs
          </Link>
          , then zip the smaller files at level 0. If a batch of PDFs is really
          one document, the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>{' '}
          may be the better single attachment than a ZIP.
        </p>
      </section>

      {/* 6 */}
      <section id="other-devices" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Laptop className="w-6 h-6 text-orange-500 shrink-0" />
          6. How to Zip Files on a Chromebook, a Locked-Down Work PC or an iPad
        </h3>
        <p>
          Every operating system can make a ZIP with a right-click, until it
          cannot: the machine is managed by an IT department, or it is a
          tablet. Any of them can open this page. Three cases come up
          constantly:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>How to zip files on a Chromebook.</strong> Open this page,
            Add Files or Add Folder from your Files app, and download the
            ZIP. Nothing to enable first.
          </li>
          <li>
            <strong>Can&rsquo;t zip a folder on a work computer with no admin
            rights.</strong> If the built-in right-click option has been
            removed or disabled by policy, you can still{' '}
            <strong>make a zip file online free</strong> here, because
            nothing on the machine needs to change.
          </li>
          <li>
            <strong>Zip files on an iPad without an app.</strong> Add Files
            works on iPhone and iPad with as many files as you like. The Add
            Folder button is not available on iOS, so there you add files
            individually and they sit at the top level of the archive.
          </li>
        </ul>
        <p>
          The common thread is that you <strong>zip files online</strong>{' '}
          the same way on every platform, and the ZIP you get is a standard
          one that opens anywhere.
        </p>
      </section>

      {/* 7 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          7. What This Tool Does Not Do
        </h3>
        <p>
          A tool called Create Archive invites assumptions, so here is the
          honest list, each with its proper answer elsewhere.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>ZIP only.</strong> It does not write 7z, RAR, TAR, TAR.GZ
            or ISO. If you need TAR or TAR.GZ, build the ZIP here and run it
            through the{' '}
            <Link to="/tools/archive-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              archive converter
            </Link>
            ; 7z, RAR and ISO are not produced by any tool on this site.
          </li>
          <li>
            <strong>No password.</strong> There is no option to password-protect
            the archive. For a sensitive PDF, protect the document itself with the{' '}
            <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF protect tool
            </Link>{' '}
            before zipping it.
          </li>
          <li>
            <strong>No extraction.</strong> This builds archives; it does not
            open them. To unzip, preview or pull files out of an existing
            archive, use{' '}
            <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract archive
            </Link>
            .
          </li>
          <li>
            <strong>No duplicate paths.</strong> Add the same file twice and
            the build stops with a{' '}
            <strong>&ldquo;File already exists&rdquo; error</strong>. Remove
            the repeated row and run it again. If two different files share a
            name, rename one with the{' '}
            <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              file renamer
            </Link>{' '}
            first.
          </li>
          <li>
            <strong>No multi-part volumes, no share links.</strong> The output
            is one ZIP that downloads to you. Section 5 covers what to do about
            attachment limits.
          </li>
        </ul>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Online Zip Creator
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Zip files online without signup', 'No account, no email address, no trial that expires. Open the page and start adding files.'],
            ['Zip files online, no quota', 'No file count cap and no daily quota imposed by the tool. A very large batch takes longer to build, and past a certain size the build can fail, so split a multi-gigabyte collection into more than one archive.'],
            ['A real compression level', 'A 0–9 slider with an explicit store-only mode, so already-compressed media is packaged instantly and text is squeezed hard.'],
            ['Folder structure preserved', 'Add Folder keeps every sub-folder path exactly as it was, so the archive unzips into the same tree you started with.'],
            ['Your files stay private', 'Nothing you package is stored on our servers, retained after your session, or used for training or analytics.'],
            ['Mixed batches in one pass', 'Add a folder, then more files, then another folder. Everything queues into one list, and you can remove any row before building.'],
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
          on the same terms, so what you are about to package can be
          compressed, converted or renamed first, free.
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
              'How do I create a zip file online without signing up?',
              'Use the panel at the top of this page: Add Files or Add Folder, name the archive, choose a compression level and press Create & Download ZIP Archive. There is no account, no email step and no watermark, and it is free every time rather than for the first few archives.',
            ],
            [
              'Why is my zip file not smaller than the files I put in?',
              'Because those files were already compressed. JPG, PNG, MP4, MP3 and most PDFs had their redundancy removed by the program that made them, so ZIP compression finds almost nothing left to take out. To make photos or video genuinely smaller, run them through our image or video compressor first, then zip the results at level 0.',
            ],
            [
              'Does zipping photos reduce their quality?',
              'No. ZIP is lossless at every level, including 9. Unzipping gives back every byte of every photo exactly as it went in. It also means zipping will not make photos smaller, for the reason above — but it will never make them worse.',
            ],
            [
              'What is the difference between compression level 0 and 9?',
              'Level 0 stores files with no compression pass, which is fastest and right for media that is already compressed. Level 9 searches hardest for repetition and is worth the extra time on text, code, CSV, SVG and older Office documents. Level 6, the default, is a reasonable middle for a mixed batch.',
            ],
            [
              'How do I zip a whole folder and keep its sub-folders?',
              'Use the Add Folder button rather than drag-and-drop. It reads every folder inside the one you pick and records each file with its full relative path, so the archive unzips into the same tree. Dropping a folder onto the panel does not walk its contents; the button does.',
            ],
            [
              'I got a "File already exists" error when creating the archive. What went wrong?',
              'Two items in the queue have the same path, usually because the same file was added twice. The queue does not skip or rename duplicates, so the build stops. Remove the repeated row with the cross beside it and press Create again. If two different files share a name, rename one before adding it.',
            ],
            [
              'Can I add a password, or make a RAR or 7z instead of a ZIP?',
              'Not with this tool. It writes standard ZIP archives only, with no password option. Our archive converter can turn the ZIP into TAR or TAR.GZ, but 7z and RAR are not produced here. To protect a sensitive PDF, apply a password to the document with our PDF protect tool before you zip it.',
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
          Working in the other direction, or with a different container? The{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          opens a ZIP you have been sent, the{' '}
          <Link to="/tools/archive-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive converter
          </Link>{' '}
          moves between ZIP, TAR and TAR.GZ, and the{' '}
          <Link to="/tools/mp3-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            MP3 compressor
          </Link>{' '}
          shrinks a music folder properly before you package it. If you would
          rather understand how file formats, compression and packaging work
          under the hood than simply use them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers it from the beginning.
        </p>
      </div>
    </article>
  );
}
