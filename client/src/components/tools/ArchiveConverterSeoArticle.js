import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  Monitor,
  Package,
  Server,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the archive converter.
 *
 * Written against what ArchiveConverter.js actually does, and the whole
 * article is organised around one idea the format-pair pages never state:
 * what survives a ZIP / TAR / TAR.GZ re-pack and what does not. File bytes
 * and nested paths are carried through; Unix modes, ownership and
 * modification times are reset; symlinks become empty files; empty folders
 * survive in TAR but vanish in ZIP; non-Latin names are only safe when the
 * target is ZIP. Section 1 says all of that up front, because a developer
 * who discovers it after deploying will not come back.
 *
 * Three formats in, three out, one archive per run, no password field and
 * no compression choice. "RAR", "7Z", "password-protected ZIP" and a bare
 * ".gz" are all searched for and all fail here, so section 6 sends each of
 * them somewhere honest rather than pretending. The long-tail term that
 * qualifies "zip to tar converter" by where the processing runs was declined
 * outright: it asks for a description we do not publish. "no file size
 * limit" is used, because nothing in the code caps the size, with the caveat
 * that a multi-gigabyte archive can still fail to complete.
 */
export default function ArchiveConverterSeoArticle() {
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
        Free <span className="text-orange-600 dark:text-orange-400">ZIP to TAR.GZ Converter</span>: What Survives the Trip Between ZIP, TAR and TAR.GZ
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A ZIP arrives and the deployment script only accepts a tarball. A
        .tar.gz comes back from a Linux host and the person who needs it is on
        Windows, looking at a file Explorer will not open. This{' '}
        <strong>zip to tar.gz converter</strong> exists for that hand-off: drop
        in a ZIP, TAR or TAR.GZ, pick the other format, download. What makes
        this guide different is that it tells you exactly what is kept and what
        is not &mdash; file contents and folder paths yes, Unix permissions and
        timestamps no &mdash; because an honest{' '}
        <strong>archive converter</strong> is worth more than one that says
        &ldquo;preserves structure&rdquo; and stops there.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/archive-converter.webp"
            alt="Free zip to tar.gz converter - re-pack ZIP, TAR and TAR.GZ archives in either direction"
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
              Three formats, any direction: ZIP for the Windows desk, TAR.GZ for
              the Linux server, plain TAR when nothing needs compressing.
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
            ['#what-survives', '1. What a ZIP to TAR.GZ Converter Keeps, and What It Drops'],
            ['#how-to-convert', '2. How to Convert ZIP to TAR.GZ Online (and Back)'],
            ['#three-formats', '3. ZIP vs TAR vs TAR.GZ: Which One the Other Side Wants'],
            ['#windows-mac', '4. Cannot Open a TAR.GZ on Windows or a TGZ on Mac'],
            ['#server-wants', '5. The File Is ZIP but the Server Wants TAR.GZ'],
            ['#not-supported', '6. What This Tool Will Not Do, and Where to Go Instead'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Archive Converter'],
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
      <section id="what-survives" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a ZIP to TAR.GZ Converter Keeps, and What It Drops
        </h3>
        <p>
          An archive is a container. Inside a ZIP or a tarball sit ordinary
          files with their paths, plus bookkeeping: who owned each one, its
          permission bits, when it was last modified. Converting means opening
          every entry in one container and writing it into another. The contents
          travel perfectly. The bookkeeping does not always fit, and this is the
          part most tools leave out.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Carried through exactly
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every file&rsquo;s bytes, unchanged. Every nested path, so
              src/lib/utils.js stays src/lib/utils.js, including the long names
              some tar tools write. If a tool once flattened your tree, this is
              a{' '}
              <strong>tar.gz to zip converter that keeps folder structure</strong>
              , and it keeps it in every direction.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Reset or dropped
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Unix permission bits, ownership and modification times. TAR and
              TAR.GZ output gets standard file and folder modes and the moment of
              conversion as the timestamp; ZIP output carries no Unix modes at
              all. Symbolic and hard links become empty files. Empty folders
              survive in TAR but are not written to ZIP.
            </p>
          </div>
        </div>
        <p>
          None of that matters for documents, images, a website backup or a
          source tree you intend to read. It matters if the archive carries
          scripts a deploy step will run, in which case set the executable bit
          again on the far side. Better to know before converting than after.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert ZIP to TAR.GZ Online (and Back)
        </h3>
        <p>
          No account, no email, no daily quota. If you searched{' '}
          <strong>how to convert zip to tar.gz</strong> and found command-line
          tutorials, this is the version without a terminal. To{' '}
          <strong>convert zip to tar.gz online</strong> with the tool above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Drop in one archive', 'A .zip, .tar, .tar.gz or .tgz. The extension decides how the file is read, so a tarball renamed to .zip will not parse. The panel reports how many items it found.'],
            ['Pick the target format', 'ZIP, TAR or TAR.GZ from the dropdown. Converting to the same format as the input is allowed and simply re-packs.'],
            ['Convert and download', 'The result downloads under the original name with the new extension, and the status line confirms the size. Press New for the next archive.'],
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
          The same steps cover <strong>tar.gz to zip</strong>,{' '}
          <strong>tar to zip</strong> and every other pairing. You{' '}
          <strong>convert tar.gz to zip without extracting</strong> to a folder
          and zipping it back up, which is where manual attempts land files one
          level too deep. With no login, it is also the plain answer to{' '}
          <strong>convert tar to zip without signup</strong>.
        </p>
      </section>

      {/* 3 */}
      <section id="three-formats" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500 shrink-0" />
          3. ZIP vs TAR vs TAR.GZ: Which One the Other Side Wants
        </h3>
        <p>
          The three formats solve one problem two different ways, and the
          difference tells you which to choose.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>ZIP</strong> compresses each file separately and then
            bundles them. Windows Explorer, macOS Finder and both phone
            operating systems open it with a double-click. The container is
            standardised as{' '}
            <a
              href="https://www.iso.org/standard/60101.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              ISO/IEC 21320-1
            </a>
            .
          </li>
          <li>
            <strong>TAR</strong> only bundles. It lays files end to end in the
            ustar layout defined by the{' '}
            <a
              href="https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pax.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              POSIX pax specification
            </a>
            , with no compression, so a .tar is roughly the size of its
            contents. It records Unix permissions, which is why Linux tooling
            prefers it.
          </li>
          <li>
            <strong>TAR.GZ</strong> (also written .tgz) is that same tarball
            compressed as one stream with gzip, the format described in{' '}
            <a
              href="https://www.rfc-editor.org/rfc/rfc1952"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              IETF RFC 1952
            </a>
            . Compressing the whole bundle at once usually beats ZIP on many
            small similar files, so source releases ship this way.
          </li>
        </ul>
        <p>
          Rule of thumb: a desktop user wants ZIP; a Linux server, container
          build or package registry wants TAR.GZ; plain TAR suits contents that
          are already compressed. To shrink an uncompressed tarball, the tool
          will <strong>convert tar to tar.gz online</strong> in the same steps.
        </p>
      </section>

      {/* 4 */}
      <section id="windows-mac" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-6 h-6 text-orange-500 shrink-0" />
          4. Cannot Open a TAR.GZ on Windows, or a TGZ Will Not Open on Mac
        </h3>
        <p>
          You <strong>can&rsquo;t open a tar.gz file on Windows</strong> because
          older versions of Explorer do not know the format: no
          &ldquo;Extract All&rdquo; entry, a blank icon, a double-click that
          asks which program to use. A{' '}
          <strong>tar.gz not recognized by Windows Explorer</strong> is not
          corrupt. It is a format Explorer never learned.
        </p>
        <p>
          The usual advice is a third-party archive utility, which is fine at
          home and often not an option on a locked-down work PC. That is where
          the search{' '}
          <strong>how to convert tar.gz to zip on Windows without extra tools</strong>{' '}
          comes from. The alternative is to change the file rather than the
          setup: convert the tarball to ZIP here and Explorer opens it like any
          other ZIP. The same fix applies to a{' '}
          <strong>tar.gz downloaded from GitHub</strong>: source archives and
          release assets are usually tarballs, and someone who just wants the
          files inside is better served by a{' '}
          <strong>tgz to zip converter online free</strong> than by a terminal.
        </p>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">
          On a Mac
        </h4>
        <p>
          macOS usually handles tarballs, but not always cleanly. A{' '}
          <strong>tgz file won&rsquo;t open on Mac</strong> when a mail client
          or chat app mangled the extension, or a policy blocks unknown
          archives. Converting to ZIP removes the ambiguity. The reverse also
          comes up: a Mac user who must{' '}
          <strong>convert zip to tar on Mac without terminal</strong> because a
          Linux host insists. Same tool, opposite dropdown choice.
        </p>
        <p>
          And if you need to{' '}
          <strong>send a tar.gz to someone who uses Windows</strong>, convert it
          to ZIP before attaching it and save them the support question.
        </p>
      </section>

      {/* 5 */}
      <section id="server-wants" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-6 h-6 text-orange-500 shrink-0" />
          5. The File Is ZIP but the Server Wants TAR.GZ
        </h3>
        <p>
          A hosting panel, an upload form or a CI job rejects your ZIP and asks
          for a tarball. When the{' '}
          <strong>file is ZIP but the server wants tar.gz</strong>, the
          conversion is the whole job, with three cases worth spelling out:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Deploy bundles and container contexts.</strong> Convert the
            ZIP to TAR.GZ and upload. If the bundle includes scripts the server
            will execute, the executable bit is not carried over, so add a chmod
            step in the pipeline.
          </li>
          <li>
            <strong>An npm tarball for a non-npm consumer.</strong> npm pack
            produces a .tgz many people cannot open. To{' '}
            <strong>convert npm pack tgz to zip</strong>, drop it in and choose
            ZIP; the package folder inside is preserved.
          </li>
          <li>
            <strong>A WordPress backup the migration plugin refuses.</strong>{' '}
            Hosts export backups as tar.gz while several importers want ZIP.
            When you <strong>convert a WordPress backup tar.gz to zip</strong>,
            the layout the importer expects survives; only timestamps reset.
          </li>
        </ul>
      </section>

      {/* 6 */}
      <section id="not-supported" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Tool Will Not Do, and Where to Go Instead
        </h3>
        <p>
          A converter that lists twenty formats and quietly fails on most is
          worse than one that names its limits. These are the limits.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>RAR, 7Z, CAB, ISO, BZ2, XZ and other containers</strong> are
            not accepted, and renaming the extension does not help; the file
            reports a parse error. Extract those with the utility that made
            them, then use{' '}
            <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
              create archive
            </Link>{' '}
            to build a ZIP, TAR or TAR.GZ from the loose files.
          </li>
          <li>
            <strong>A bare .gz that is not a tarball.</strong> A single gzipped
            file such as backup.sql.gz has no entries to re-pack, so it fails to
            parse. Only .tar.gz and .tgz are tarballs.
          </li>
          <li>
            <strong>Password-protected ZIPs.</strong> There is no password
            field; remove the password in the tool that set it first.
          </li>
          <li>
            <strong>One archive at a time.</strong> There is no batch mode or
            multi-select; press New and drop the next one.
          </li>
          <li>
            <strong>No compression level control.</strong> There is no
            &ldquo;store&rdquo; or &ldquo;ultra&rdquo; option. To make the
            contents smaller, shrink them first with the{' '}
            <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image compressor
            </Link>
            ,{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>{' '}
            or{' '}
            <Link to="/tools/video-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              video compressor
            </Link>
            , then archive the result.
          </li>
          <li>
            <strong>No file listing or preview.</strong> The panel shows an item
            count, not the entries; to see or pull out individual files, use{' '}
            <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
              extract archive
            </Link>
            .
          </li>
          <li>
            <strong>Non-Latin file names into TAR.</strong> Names with Chinese,
            Arabic, Cyrillic or emoji characters are written correctly to ZIP but
            can be garbled in TAR and TAR.GZ output. For such archives, choose
            ZIP as the target.
          </li>
        </ul>
        <p>
          On size: if an <strong>online converter says the file is too large</strong>{' '}
          for a tar.gz, the cap is that site&rsquo;s business model, not the
          format. Nothing here imposes one. Genuinely enormous archives, many
          gigabytes, can still fail to complete; then extract, split the
          contents into a few folders, and re-archive each with{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive
          </Link>
          .
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Archive Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no sign-up', 'An archive converter online free of accounts, email gates and trial counters. Every conversion, not just the first few.'],
            ['No file size limit, no quota', 'A tar.gz to zip converter no file size limit is imposed on, and no files-per-day ceiling. Convert as many archives as you have.'],
            ['Honest about what is kept', 'File bytes and folder paths survive; permissions, timestamps and links do not. You read that here, not in a bug report afterwards.'],
            ['Every direction between three formats', 'ZIP, TAR and TAR.GZ in and out, including tar to tar.gz to add compression.'],
            ['Your archives stay private', 'Nothing you convert is stored on our servers, retained after your session, or used for training or analytics.'],
            ['One step, no extract-and-rezip', 'The archive is re-packed directly, so nothing lands one folder too deep.'],
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
          It is one of a set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free file tools
          </Link>{' '}
          on the same terms. The{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists every format pairing we cover, so for a document or media
          conversion rather than an archive one, start there.
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
              'How do I use a zip to tar.gz converter without signing up?',
              'Drop the ZIP into the panel at the top of this page, choose TAR.GZ from the dropdown, and press Convert & Download. There is no account, no email step and no quota. The file downloads under its original name with a .tar.gz extension.',
            ],
            [
              'Does converting tar.gz to zip lose file permissions?',
              'Yes. ZIP output carries no Unix permission bits, so executable flags, ownership and modification times from the tarball are gone. Going the other way, TAR and TAR.GZ output gets standard file and folder modes with the conversion time as the timestamp. File contents and folder paths are unaffected. If a script must be executable after the trip, set that bit again on the receiving machine.',
            ],
            [
              'Why are empty folders missing after converting tar to zip?',
              'ZIP output is written from file entries only, so a folder with nothing in it has nothing to write and disappears. Empty folders are kept when the target is TAR or TAR.GZ. If they matter, put a small placeholder file in each before archiving, the same trick version control users rely on.',
            ],
            [
              "Can't open a tar.gz file on Windows — do I really need an archive utility?",
              'No. Convert the tar.gz to ZIP here and Windows Explorer opens it with a double-click, Extract All included. That is the practical route on a work PC where a third-party utility is not allowed. If you would rather keep the tarball as it is, an archive utility is the other option.',
            ],
            [
              'Can I convert a RAR or 7Z file with this tool?',
              'Not here. Only ZIP, TAR, TAR.GZ and TGZ are read, and renaming a RAR to .zip does not change what is inside. Extract it with the utility that created it, then use our create archive tool to build a ZIP or tarball from the files.',
            ],
            [
              'Why did my .gz file fail to parse?',
              'Because a bare .gz is a single compressed file, not an archive with entries inside. Only .tar.gz and .tgz are tarballs the converter can open. A file such as database.sql.gz needs a gzip utility, not a converter.',
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
          Need something other than a re-pack? The{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          hands you the files inside,{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            create archive
          </Link>{' '}
          builds a new one from loose files, and the{' '}
          <Link to="/tools/file-renamer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file renamer
          </Link>{' '}
          tidies names before you bundle them. To understand why servers prefer
          tarballs and how a deploy pipeline fits together, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers packaging and deployment from the beginning.
        </p>
      </div>
    </article>
  );
}
