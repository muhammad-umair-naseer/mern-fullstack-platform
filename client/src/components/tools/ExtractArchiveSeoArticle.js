import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FolderArchive,
  FolderOpen,
  HelpCircle,
  Layers,
  ListTree,
  ShieldAlert,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Extract Archive tool.
 *
 * Written against what ExtractArchive.js actually does, which is narrower
 * than the file picker suggests. The picker admits .tar, .gz, .tgz and .7z,
 * but only ZIP is ever unpacked; the rest stop at "Failed to unpack archive".
 * Section 5 says so plainly and routes TAR and TAR.GZ to the archive converter
 * (which does read them), and "unzip online tar gz 7z" is deliberately not a
 * phrase this article chases.
 *
 * Two more research keywords were declined because they describe where the
 * work runs, which this article never does; their intent (privacy, and a real
 * folder on disk) is served in sections 3 and 7 as outcomes only.
 *
 * Password-protected ZIPs list correctly but every download fails with
 * "File contains encrypted entry". There is no password field, so the FAQ
 * answers that exact error string honestly instead of implying an unlock.
 *
 * The genuine differentiator is the shape of the output: on Chrome, Edge and
 * ChromeOS desktop, Extract All writes into a folder you choose with the
 * subfolder tree intact; on Firefox, Safari and every iPhone it falls back to
 * one download per file with paths flattened. Section 3 leads with the first
 * and is candid about the second, because the pages this competes with claim
 * everything works everywhere.
 */
export default function ExtractArchiveSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Unzip Files Online</span> Straight Into a Folder
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Someone sends you a ZIP. Your usual extractor refuses it, the built-in
        Extract All greys out, or you are on a locked-down work PC. That is when
        you need to <strong>unzip files online</strong>: drop the archive on a
        page, see what is inside, and take the files out. This guide covers how
        the <strong>online zip extractor</strong> above works, how it can put
        the contents into a real folder rather than a pile of downloads, how to
        pull a single file without extracting the rest, and the handful of
        archives it will honestly tell you it cannot open.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/extract-archive.webp"
            alt="Unzip files online free - list the contents of a ZIP and extract them into a folder"
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
              See every file and its size first, then download one entry or
              extract them all into a folder of your choice.
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
            ['#what-you-see', '1. What You See First: The Contents, Before Anything Is Extracted'],
            ['#how-to-unzip', '2. How to Unzip Files Online Free (Step-by-Step)'],
            ['#extract-to-folder', '3. Extract All: Straight Into a Folder, Subfolders Intact'],
            ['#one-file', '4. Only Need One File? Download It Without Extracting the Rest'],
            ['#what-it-wont-open', '5. What This Tool Will Not Open, and Where to Go Instead'],
            ['#when-zip-wont-open', '6. When a ZIP Will Not Open on Windows 11 or a Phone'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Online Zip Extractor'],
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
      <section id="what-you-see" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListTree className="w-6 h-6 text-orange-500 shrink-0" />
          1. What You See First: The Contents, Before Anything Is Extracted
        </h3>
        <p>
          A ZIP file is two things stapled together: the compressed data for each
          file, and a directory at the end listing every entry, its folder path,
          and its size once decompressed. The format is published as{' '}
          <a
            href="https://www.iso.org/standard/60101.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 21320-1
          </a>
          , and the compression most entries use is Deflate, described in{' '}
          <a
            href="https://www.rfc-editor.org/rfc/rfc1951"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            IETF RFC 1951
          </a>
          . That directory is why this tool can act as a{' '}
          <strong>zip file opener online</strong> before it does any extracting
          at all.
        </p>
        <p>
          Drop an archive in and the first thing you get is a manifest, not a
          download. The header shows the archive name, how many files it holds,
          their total size once unpacked, and the size of the archive itself.
          Below that is every entry in order: the full path of each file in
          monospace and its uncompressed size. Nothing has been decompressed yet.
          If you searched for{' '}
          <strong>how to see what&rsquo;s inside a zip file without extracting</strong>,
          this is the whole answer: look at the list, and close the page if you
          do not like what you see.
        </p>
        <p>
          Uncompressed total against archive size is worth a glance every time.
          A small ZIP that expands to something enormous is a warning sign, and
          a <strong>check zip file size uncompressed online</strong> step before
          extracting tells you whether the result will fit where you intend to
          put it.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-unzip" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Unzip Files Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email, no trial. If you want to{' '}
          <strong>unzip files online free</strong> with the tool above, the whole
          job is three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in the ZIP', 'Drag the archive onto the panel or click Choose Archive. There is no file size limit enforced, so a large download from a client or a photographer is fine.'],
            ['Read the list', 'Every entry appears with its folder path and uncompressed size. Scroll through it, check the totals in the header, and decide whether you want one file or all of them.'],
            ['Download or Extract All', 'Click Download next to a single entry, or Extract All to take everything. On Chrome and Edge you will be asked which folder to put it in; section 3 explains the rest.'],
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
          New Archive clears everything for the next file. That is the entire
          flow for anyone who needs to <strong>extract zip file online</strong>{' '}
          with <strong>no signup</strong> and nothing to pay.
        </p>
      </section>

      {/* 3 */}
      <section id="extract-to-folder" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-orange-500 shrink-0" />
          3. Extract All: Straight Into a Folder, Subfolders Intact
        </h3>
        <p>
          This is the part most extraction pages get wrong. Extract an archive
          on your desktop and you end up with a folder. Extract on most web pages
          and you end up with either a brand-new ZIP to open all over again, or
          forty separate downloads with every folder name stripped off. If you
          have ever typed{' '}
          <strong>zip extracted but folders are missing</strong> into a search
          box, that flattening is what happened to you.
        </p>
        <p>
          Here, on Chrome, Edge and a Chromebook, <strong>Extract All</strong>{' '}
          asks you to pick a folder first. Every file is then written into that
          folder with the archive&rsquo;s own structure recreated: an entry at{' '}
          <code>photos/2024/cover.jpg</code> lands as <code>cover.jpg</code>{' '}
          inside a <code>2024</code> folder, which sits inside a{' '}
          <code>photos</code> folder.
          When it finishes you get a count of the files written and a normal
          folder you can open immediately. That is what{' '}
          <strong>how to extract a zip to a folder online</strong> should mean,
          and it is why anyone asking{' '}
          <strong>how to unzip a file on Chromebook</strong> gets the best
          version of this tool.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Chrome, Edge, Opera, ChromeOS (desktop)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Extract All opens a folder picker. Choose a destination and every
              entry is written there with its subfolders preserved. Cancel the
              picker and nothing is written. This is the{' '}
              <strong>unzip online keep folder structure</strong> route.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Firefox, Safari, and every iPhone or iPad
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No folder picker is available, so Extract All delivers one
              download per file, each named by its file name alone. Folder
              paths are not kept, and you may be asked to allow multiple
              downloads. Fine for a handful of files; for hundreds, use the
              per-file Download button.
            </p>
          </div>
        </div>
        <p>
          We would rather say that clearly than let you find out after the
          fortieth download. If the folder structure matters and you are on
          Firefox or Safari, open Chrome or Edge for that one job.
        </p>
      </section>

      {/* 4 */}
      <section id="one-file" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderArchive className="w-6 h-6 text-orange-500 shrink-0" />
          4. Only Need One File? Download It Without Extracting the Rest
        </h3>
        <p>
          The most common reason to open a large archive is that you{' '}
          <strong>only need one file from a zip</strong>: the invoice out of a
          project export, one logo out of a brand pack, a single video out of a
          shoot. Extracting everything to find it wastes time and disk.
        </p>
        <p>
          Every file entry in the list has its own Download button. Click it and
          only that entry is decompressed and saved; the rest of the archive is
          untouched. This is the flow behind{' '}
          <strong>list files in zip without downloading everything</strong> and{' '}
          <strong>open zip file without extracting it online free</strong>: read
          the manifest, cherry-pick, done.
        </p>
        <p>
          One detail to know: a single download is named by the file alone. An
          entry at <code>images/logo.png</code> arrives as <code>logo.png</code>.
          If you pull several same-named files from different folders, the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          will sort them out afterwards. And once you have the files you need,
          the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          and{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          are usually the next stop before they go back out by email.
        </p>
      </section>

      {/* 5 */}
      <section id="what-it-wont-open" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          5. What This Tool Will Not Open, and Where to Go Instead
        </h3>
        <p>
          This is a <strong>ZIP extractor</strong>, and it is better to know
          the edges before you hit them.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Password-protected ZIPs list but do not download.</strong>{' '}
            The manifest appears as normal, but each Download stops with
            &ldquo;File contains encrypted entry&rdquo;. There is no password
            field; ask the sender for an unprotected copy.
          </li>
          <li>
            <strong>TAR, TAR.GZ and 7Z stop with an error.</strong> The picker
            lets you choose them, but only ZIP is unpacked, so they end at
            &ldquo;Failed to unpack archive&rdquo;. For TAR and TAR.GZ, run the
            file through our{' '}
            <Link to="/tools/archive-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              archive converter
            </Link>{' '}
            to turn it into a ZIP first, then bring it back here. 7Z has no
            route on this site yet.
          </li>
          <li>
            <strong>RAR, ISO, DMG, CAB and self-extracting EXE files are
            refused</strong> at the door with a message asking for a valid
            archive.
          </li>
          <li>
            <strong>Split archives</strong> (<code>.z01</code>,{' '}
            <code>.zip.001</code>) and entries compressed with anything other
            than the ordinary Deflate or stored methods will not extract.
            Re-zipping with default settings fixes both.
          </li>
          <li>
            <strong>Corrupt or truncated ZIPs are not repaired.</strong> A
            download that ended early will fail to list or fail on individual
            entries; re-download the original.
          </li>
        </ul>
        <p>
          None of this is hidden behind an upgrade. It is simply what the tool
          does and does not do.
        </p>
      </section>

      {/* 6 */}
      <section id="when-zip-wont-open" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-orange-500 shrink-0" />
          6. When a ZIP Will Not Open on Windows 11 or a Phone
        </h3>
        <p>
          &ldquo;<strong>Zip file won&rsquo;t open</strong>&rdquo; is one of the
          most searched archive problems, and the useful first step is a second
          opinion: drop the same file here. If the list appears with sensible
          names and sizes, the archive is fine and the fault lies with the
          extractor you tried first. If it fails to list here too, the file is
          damaged or is not really a ZIP, and no extractor will save it.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Can&rsquo;t extract zip file on Windows 11.</strong>{' '}
            Explorer&rsquo;s Extract All can grey out or stall on very long
            paths, on files marked as blocked after download, or on names with
            characters it does not like. Use this page to pull the files you
            need while you sort out the cause.
          </li>
          <li>
            <strong>Zip file not opening on phone.</strong> On Android or
            iPhone, open this page and use the per-file Download button; each
            file lands in your downloads like any other. For anyone looking to{' '}
            <strong>unzip a file on iPhone without an app</strong>: single-file
            downloads work well, Extract All becomes one download per file with
            folders flattened.
          </li>
          <li>
            <strong>How to extract a zip file without paid desktop software.</strong>{' '}
            You do not need any. Everything on this page is free with no nag
            screen and no evaluation period, which is also the answer to{' '}
            <strong>unzip online without software</strong> on a locked-down
            office PC.
          </li>
          <li>
            <strong>Unzip a large zip file online.</strong> No size limit is
            enforced here, so a very large archive that another page rejected
            is not turned away. A very large extraction takes longer than a
            small one and the page may feel unresponsive while it works; let it
            finish rather than starting again.
          </li>
        </ul>
        <p>
          If the archive was too big to send in the first place, the{' '}
          <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            video compressor
          </Link>{' '}
          is usually the fix.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Online Zip Extractor
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no signup', 'No account, no email, no trial countdown. It is a free zip extractor every time you open it, not for the first three files.'],
            ['No file size limit', 'Nothing in the tool rejects an archive for being large. The size caps other pages impose do not apply here.'],
            ['Contents first, extraction second', 'You see every path and size before anything is decompressed, so a suspicious attachment can be inspected and closed without a single file being written.'],
            ['A real folder, not a pile of downloads', 'On Chrome, Edge and ChromeOS, Extract All writes into a folder you choose with subfolders preserved, exactly like a desktop extractor.'],
            ['Your files stay private', 'Nothing you open is stored on our servers, retained after your session, or used for training or analytics.'],
            ['Honest about its limits', 'ZIP only, no password unlock, and a clear note on which platforms fall back to per-file downloads. You will not find that candour on most extraction pages.'],
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
          on the same terms, so once the archive is open you can{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            merge the PDFs
          </Link>{' '}
          inside it or push any other file through the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          without paying for any of it.
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
              'Can I unzip files online free without signing up?',
              'Yes. Drop the ZIP into the panel at the top of this page and the contents appear at once. There is no account, no email step and no limit on how many archives you open. It is free every time, not free for a trial period.',
            ],
            [
              'Why does it say "File contains encrypted entry" when I click Download?',
              'The archive is password-protected. Encrypted ZIPs still list correctly because the names and sizes are stored in the open, but the file data needs the password and this tool has no password field. Ask the sender for an unprotected copy, or open it on a desktop where you can type the password.',
            ],
            [
              'Does Extract All keep the folder structure?',
              'On Chrome, Edge, Opera and ChromeOS on a desktop, yes: you choose a folder and every entry is written there with its subfolders recreated. On Firefox, Safari and any iPhone or iPad, there is no folder picker, so Extract All produces one download per file named by the file alone, and the folder paths are not kept.',
            ],
            [
              'Is there a file size limit for the free zip extractor?',
              'No. Nothing in the tool refuses an archive for being large, so a ZIP that another page turned away for its size is not rejected here. A very large extraction simply takes longer than a small one, and the page may feel unresponsive until it finishes.',
            ],
            [
              'Why did my .tar.gz or .7z file fail with "Failed to unpack archive"?',
              'Only ZIP archives are unpacked here, even though the file picker lets you select other extensions. For TAR and TAR.GZ, convert the file to ZIP with our archive converter first and then open it on this page. There is no 7Z route on this site.',
            ],
            [
              'Can I unzip a file on my iPhone without an app?',
              'Yes, with one caveat. Open this page in Safari, drop in the ZIP, and use the Download button beside any file you need; it saves like any other download. Extract All on an iPhone becomes one download per file with folders flattened, so for a large archive the per-file route is the better one.',
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
          Going the other way? The{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive tool
          </Link>{' '}
          builds a ZIP from your files, the{' '}
          <Link to="/tools/archive-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive converter
          </Link>{' '}
          switches between ZIP, TAR and TAR.GZ, and the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          tidies up a batch of extracted files in one pass. If you would rather
          understand how file formats and the web fit together than simply use
          them, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          starts from the beginning.
        </p>
      </div>
    </article>
  );
}
