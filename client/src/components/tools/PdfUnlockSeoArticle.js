import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  KeyRound,
  Layers,
  LockOpen,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Unlock tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool removes a password you KNOW. "Forgot pdf password" and "open
 *    pdf without password" are enormous search terms and every competitor
 *    page quietly requires the password while the headline implies otherwise.
 *    Section 5 answers that visitor honestly rather than baiting them.
 *
 * 2. Encryption schemes are named (RC4 40-bit, RC4 128-bit, AES-128, AES-256)
 *    because that is what the code handles and because other tools bounce
 *    AES-256 files. No strength or "military-grade" language anywhere.
 *
 * 3. Side effects are stated plainly: permissions go, signatures become
 *    invalid, everything else is kept. Nobody on page one says any of that.
 */
export default function PdfUnlockSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Unlock a PDF</span> and Remove Its Password: The Two Locks, the Password You Have, and What Changes
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A bank statement that demands your date of birth every single time. A
        payslip that opens but refuses to print. A contract a colleague locked
        before leaving, password still on a sticky note. Every one of these is
        the same job: you know the password, you are tired of typing it, and
        you want a copy that simply opens. This guide explains how to{' '}
        <strong>unlock a PDF</strong> and <strong>remove the password from a PDF</strong>{' '}
        for free, which of the two passwords a locked file can carry you actually
        need, what happens to the document when the lock comes off, and &mdash;
        honestly &mdash; what to do when the password is one you never had.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/unlock-pdf.webp"
            alt="An open padlock with its keys still in the lock on a pale surface"
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
              One password opens the file, another sets its rules. Either one
              unlocks it here, and the copy you download carries neither.
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
            ['#two-locks', '1. Locked to Open, or Locked to Print? The Two Passwords'],
            ['#how-to-unlock', '2. How to Unlock a PDF Online Free in Three Steps'],
            ['#what-it-removes', '3. Which PDF Encryption It Removes'],
            ['#what-changes', '4. What Changes in the File, and What Is Kept'],
            ['#forgot-password', '5. Forgot the PDF Password? The Honest Answer'],
            ['#print-to-pdf', '6. Why Not Just Print It to a New PDF?'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Unlocker'],
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
      <section id="two-locks" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          1. Locked to Open, or Locked to Print? The Two Passwords
        </h3>
        <p>
          The PDF format lets a document carry two different passwords, and
          knowing which one you are holding explains almost every confusing
          thing about a <strong>password protected PDF</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <LockOpen className="w-5 h-5 text-orange-500 shrink-0" /> The open password
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The one a reader asks for before showing a single page. Bank
              statements, payslips, insurance documents and exam results usually
              use this, often with a pattern the sender told you about &mdash;
              a date of birth, the last digits of an account, a customer ID.
              If your file will not open at all, this is the password you have.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" /> The owner password
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Sometimes called the permissions password. The file opens
              normally, but printing, copying text, editing or commenting is
              greyed out and the reader shows a &ldquo;secured&rdquo; badge.
              This is the <strong>unlock secured PDF</strong> case &mdash; and
              very often there is no open password on the file at all.
            </p>
          </div>
        </div>
        <p>
          The tool at the top of this page accepts either. Type the open
          password if you have that; type the owner password if that is the one
          you were given. And for a file that opens fine but will not print or
          copy, leave the password field <strong>empty</strong> &mdash; the
          restrictions are removed along with the lock. The document does not
          need to be locked twice for you to end up with one that is not locked
          at all.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-unlock" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Unlock a PDF Online Free in Three Steps
        </h3>
        <p>
          Here is how to <strong>remove a password from a PDF file</strong>{' '}
          with the tool above. No account, no counter of files used today, and
          the result is a separate file so your original is untouched.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add the locked PDF.</strong> Drop it onto the panel or
            choose it from your files. The name and size appear so you can
            confirm it is the right document.
          </li>
          <li>
            <strong>Type the password.</strong> The open password or the owner
            password &mdash; whichever you have. Use the eye icon to check what
            you typed; passwords are case-sensitive and a stray space at the
            end is the commonest reason a correct-looking password fails. For
            a file that opens but blocks printing or copying, leave the field
            blank.
          </li>
          <li>
            <strong>Unlock and download.</strong> Press <em>Unlock PDF</em>. The
            success screen tells you which password matched and which
            encryption was removed, and the download is named{' '}
            <strong>-unlocked.pdf</strong> so it sits beside the original rather
            than replacing it.
          </li>
        </ol>
        <p>
          If the password is wrong you are told so plainly and can try again
          immediately. If the file was never locked in the first place, the
          tool says that too instead of handing you a pointless copy. The same
          page works to <strong>unlock a PDF on a phone</strong> or a tablet;
          the only thing that changes is how you pick the file.
        </p>
      </section>

      {/* 3 */}
      <section id="what-it-removes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LockOpen className="w-6 h-6 text-orange-500 shrink-0" />
          3. Which PDF Encryption It Removes
        </h3>
        <p>
          PDF password protection has been revised several times since the
          format was standardised, and a surprising number of{' '}
          <strong>PDF password remover</strong> pages only handle the older
          ones, bouncing newer files with a vague &ldquo;strong encryption
          cannot be removed&rdquo;. This tool handles every revision of the
          standard password scheme described in{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-2
          </a>
          , the current PDF specification, and in the earlier editions it
          replaced:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>RC4 40-bit</strong> &mdash; the original scheme, still
            produced by some older generators and by simple locking tools.
          </li>
          <li>
            <strong>RC4 128-bit</strong> &mdash; the long-standing default of
            the 2000s, still common in bank statements and payslips.
          </li>
          <li>
            <strong>AES-128</strong> &mdash; introduced with PDF 1.6 and the
            most common scheme in files locked over the last decade.
          </li>
          <li>
            <strong>AES-256</strong> &mdash; both the interim Adobe version and
            the final ISO one, including passwords containing accented or
            non-Latin characters. This is the one that other tools most often
            refuse.
          </li>
        </ul>
        <p>
          Files whose objects are packed into compressed object streams &mdash;
          the modern layout Acrobat and most generators now write &mdash; are
          handled the same way as the older layout. You do not need to know or
          check any of this; it is listed so you can stop wondering whether
          your particular file is &ldquo;the kind that works&rdquo;. If it opens
          with a password, it is.
        </p>
        <p>
          Two things are deliberately outside this tool. A PDF encrypted to a{' '}
          <strong>digital certificate</strong> rather than a password can only
          be opened by whoever holds that certificate, and a document governed
          by a rights-management system (the kind some corporate and publishing
          platforms issue) is not password-protected in the ordinary sense at
          all. Both are reported to you by name rather than as a mysterious
          failure.
        </p>
      </section>

      {/* 4 */}
      <section id="what-changes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          4. What Changes in the File, and What Is Kept
        </h3>
        <p>
          &ldquo;Unlocking&rdquo; sounds like flipping a switch, so it is worth
          being exact about what the downloaded copy is. The encryption is
          removed entirely &mdash; not replaced with a blank password, removed
          &mdash; and with it every permission restriction. The unlocked file
          can be opened, printed, copied from, edited and annotated by anyone
          who has it, in any reader, with no prompt. That is the point, and it
          is also the reason to think for a second before sending the unlocked
          copy anywhere the locked one was not meant to go.
        </p>
        <p>
          Everything else is kept. Pages, text, images, fonts, bookmarks,
          links, form fields and their values, comments, and the document
          metadata all come through as they were. The file is re-written to
          produce a clean structure, so its byte layout and often its exact size
          differ from the original; its content does not. If you later want to{' '}
          <strong>unlock a PDF for editing</strong>, this is the copy to open
          in your editor &mdash; and the copy to hand to the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          or the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            page remover
          </Link>{' '}
          when only part of it needs to go anywhere, since a locked file cannot
          be split at all.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Digital signatures do not survive.</strong> A signature
            certifies the exact bytes it was applied to. Re-writing the file
            &mdash; which any unlock, on any tool, has to do &mdash; means a
            reader will report the signature as invalid or the document as
            modified. If the signature matters, keep the signed, locked original
            and treat the unlocked copy as a working copy.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="forgot-password" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500 shrink-0" />
          5. Forgot the PDF Password? The Honest Answer
        </h3>
        <p>
          A great many people arrive at pages like this one searching{' '}
          <strong>how to open a password protected PDF without the password</strong>.
          Every tool on the first page of results, including this one, needs
          the password. The headlines rarely say so. Here is the plain version:
          this tool does not guess, recover or crack anything. A wrong password
          is refused, and there is nothing about your file or your attempt for
          us to look up, because nothing is kept.
        </p>
        <p>
          What actually works when you have <strong>forgotten a PDF password</strong>{' '}
          is unglamorous but effective:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Read the covering message again.</strong> Banks, insurers,
            payroll providers and exam boards almost always state the pattern
            in the email or SMS that delivered the file: date of birth in a
            particular format, a customer number, the first four letters of a
            name in capitals plus a year. The pattern is usually the same for
            every document they send you.
          </li>
          <li>
            <strong>Ask the sender for a fresh copy.</strong> A colleague can
            re-send an unlocked version in a minute; an organisation can
            usually re-issue the document to your registered address.
          </li>
          <li>
            <strong>Check the source system.</strong> The same statement is
            normally downloadable, unlocked, from the account portal it came
            from.
          </li>
          <li>
            <strong>Be wary of &ldquo;password recovery&rdquo; downloads.</strong>{' '}
            Software promising to crack a password you do not know is at best
            slow guessing against a file you would then have uploaded to a
            stranger, and at worst not what it claims to be. Guidance such as{' '}
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              NIST SP 800-63B
            </a>{' '}
            exists precisely because a decent password is not meant to be
            recoverable by a third party.
          </li>
        </ul>
        <p>
          Once you have the password, the three steps above take less time than
          reading this section did.
        </p>
      </section>

      {/* 6 */}
      <section id="print-to-pdf" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Why Not Just Print It to a New PDF?
        </h3>
        <p>
          The most common workaround for a <strong>secured PDF</strong> is to
          open it, choose Print, and save as a new PDF. It works, in the sense
          that a file comes out, and it is why many how-to articles stop there.
          What it produces is a picture of the document rather than the
          document. Bookmarks vanish. Links stop being clickable. Form fields
          become flat drawings of boxes. Any text layer is regenerated by the
          print engine, so searching and copying become unreliable, and file
          size frequently balloons because every page is re-rasterised. On a
          phone or a locked-down work machine the print route may not exist at
          all.
        </p>
        <p>
          Unlocking keeps the document as a document. Bookmarks, links, form
          fields and the original text survive because nothing is re-drawn
          &mdash; the encryption is simply taken off the file that was already
          there. It is also the only route that works when the restriction you
          are fighting is the print restriction itself. And if a picture of a
          page really is what you need &mdash; a preview for an email, a slide
          &mdash; the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          makes one on purpose, at a resolution you choose, from the unlocked
          copy.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Unlocker
        </h3>
        <p>
          Plenty of sites will <strong>unlock a PDF online</strong>. Most make
          you work for it first, or hedge about what they can open. Here is
          what is different, stated so you can check every line yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card and no two-files-a-day counter. The tool on this page is the entire product.'],
            ['Every revision, AES-256 included', 'RC4 40-bit, RC4 128-bit, AES-128 and both AES-256 versions all unlock. Files that other pages refuse as "strong encryption" open here.'],
            ['Open password or owner password', 'Whichever you have works, and a file that opens but will not print unlocks with the field left blank. You are told which password matched.'],
            ['Your documents stay private', 'Files are never stored on our servers, never queued, never logged and never retained after your session.'],
            ['Nothing is used for training', 'Your documents are never fed into training data or analytics. A statement or contract stays yours by policy, not by luck.'],
            ['Keeps the real document', 'Bookmarks, links, form fields and the original text layer survive, unlike the print-to-PDF workaround. Your original is left alone; the unlocked copy is a new file.'],
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
          built on the same terms. Need the lock back on later, with a password
          of your own choosing? The{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>{' '}
          is the other half of this page.
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
              'How do I unlock a PDF for free?',
              'Add the locked PDF to the tool at the top of this page, type its password, press Unlock PDF and download the copy named -unlocked.pdf. There is no account, no watermark and no daily limit, and the original file is left exactly as it was.',
            ],
            [
              'Can you unlock a PDF without knowing the password?',
              'No, and neither can any other page on the first screen of results, whatever the headline says. The tool needs the open password or the owner password. A wrong password is refused with a clear message, and nothing about your file or attempt is kept. If you have lost the password, check the message that delivered the file for the pattern the sender used, ask for a fresh copy, or download the document again from the portal it came from.',
            ],
            [
              'My PDF opens fine but I cannot print or copy from it. Do I need a password?',
              'Usually not. That file has an owner password setting permissions but no open password. Add it to the tool, leave the password field empty and press Unlock PDF. The restrictions are removed and the copy prints, copies and edits normally.',
            ],
            [
              'Does it remove AES-256 encryption?',
              'Yes. Every revision of the standard PDF password scheme is handled: RC4 40-bit, RC4 128-bit, AES-128 and both versions of AES-256, including passwords with accented or non-Latin characters. The success screen names the scheme that was removed.',
            ],
            [
              'Will unlocking change my document?',
              'The encryption and the permission restrictions are removed; pages, text, images, bookmarks, links, form fields, comments and metadata are kept. The file is re-written with a clean structure, so its byte layout and often its exact size differ from the original, but the content is the same. One genuine side effect: an existing digital signature will show as invalid, because a signature covers the exact bytes it was applied to.',
            ],
            [
              'Is it safe to unlock a bank statement or a contract here?',
              'Your files are never stored on our servers, never queued or logged, and never retained after your session, and they are never used for training or analytics. Remember that the unlocked copy opens for anyone who has it, so keep it where the locked one was meant to stay.',
            ],
            [
              'Can I set a new password instead of just removing the old one?',
              'Not in the same step. Unlock the file here, then put it through the PDF password protector, which lets you choose a fresh open password, a separate owner password and exactly which permissions to allow.',
            ],
            [
              'Why does it say my PDF is not password-protected?',
              'Because the file has no encryption on it — it already opens without a password. If a reader still refuses to show it, the block is coming from somewhere else: a viewer app with its own lock, a download that was actually a login page, or a document issued through a rights-management platform, which is not a password and is reported as such.',
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
          Unlocked and ready for the next step? Combine several statements
          with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , shrink a scanned contract with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , or turn the document into an editable file with the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>
          . And if you would rather understand how document security works
          than only use it, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers the authentication and file-handling groundwork behind tools
          like this one.
        </p>
      </div>
    </article>
  );
}
