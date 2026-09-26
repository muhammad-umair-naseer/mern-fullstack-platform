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
  Lock,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF Protect tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, benefit grid, FAQ. Four decisions shaped the copy and they are
 * worth knowing before anyone edits it.
 *
 * 1. The tool ADDS protection. It does not remove it. "Remove password from
 *    pdf", "unlock pdf" and "pdf password recovery" are far bigger search terms
 *    than "password protect pdf"; the first two belong to /tools/pdf-unlock,
 *    which this guide links to, and "recovery" is declined honestly in
 *    section 5 — a lost password cannot be recovered by us, which is what the
 *    tool's own success screen tells the user.
 *
 * 2. No bit-strength is quoted anywhere in this article, and no adequacy claim
 *    is made either. Encryption strength claims ("AES-256", "bank-grade") are
 *    the easiest thing in this category to overstate, so the copy says only
 *    what is verifiably true — the file carries the PDF standard's own password
 *    security handler, so common desktop and mobile readers prompt for the
 *    password — and stops there. It must never tell a reader that the password
 *    alone is sufficient for genuinely sensitive material, and section 3 says
 *    the opposite on purpose. Compatibility is described as "common desktop and
 *    mobile readers", never as every reader on every platform, and e-readers
 *    are deliberately not listed: many refuse protected PDFs outright.
 *
 * 3. Section 5 states the real behaviour for an already-locked input: it is
 *    accepted, not refused, and the file that comes back opens with no
 *    password at all. That warning is the whole reason the paragraph exists —
 *    do not shorten it back into a bullet that reads like a guard rail.
 *
 * 4. Privacy is sold as an outcome only: files are not stored, not queued, not
 *    retained, never used for training. How that is achieved is absent on
 *    purpose and must stay absent.
 *
 * Section 6 (protect last) exists because it is the single most common support
 * question in this shape: an encrypted PDF cannot be fed back into the merge,
 * compress or convert tools, so ordering matters.
 *
 * Heading note: this article's H2 is the page's second H2, because the tool
 * panel emits one at PdfProtect.js:131. That is the house pattern across every
 * tool guide and is not this file's to fix; if it is ever addressed, the tool
 * panel heading should be demoted across all tool components at once.
 */
export default function PdfProtectSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Password Protect a PDF</span>: Passwords, Permissions and What a Lock Really Buys You
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A PDF travels further than you ever intended. It gets forwarded, printed,
        dropped into a shared drive and attached to a reply you were never copied
        on. A password on the file itself puts a door in the middle of that
        chain: whoever ends up holding the document still has to know something
        before they can read a word of it. This guide covers how to{' '}
        <strong>password protect a PDF</strong>, what an{' '}
        <strong>open password</strong> and an <strong>owner password</strong>{' '}
        each control, which permissions you can switch off, and &mdash; just as
        important &mdash; what a <strong>locked PDF</strong> does not protect you
        from.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/password-protect-pdf.webp"
            alt="A handmade paper envelope sealed shut with an orange wax seal"
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
              One password to open the file, one to change its rules, and four
              switches deciding what a reader is allowed to do with it.
            </span>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          {[
            ['#two-passwords', '1. The Two Passwords Every PDF Can Carry'],
            ['#how-to-protect', '2. How to Password Protect a PDF Online Free'],
            ['#permissions', '3. Printing, Copying and Editing Permissions'],
            ['#choosing-a-password', '4. Choosing a Password You Will Not Lose'],
            ['#what-it-cannot-do', '5. What This Tool Will Not Do'],
            ['#workflow-order', '6. Protect Last: Where Locking Fits in a Workflow'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PDF Password Protector'],
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
      <section id="two-passwords" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          1. The Two Passwords Every PDF Can Carry
        </h3>
        <p>
          Most people think a PDF has one password. It has room for two, and they
          do completely different jobs. The distinction is written into the
          format itself &mdash; the standard security handler described in{' '}
          <a
            href="https://www.iso.org/standard/51502.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000-1, the published PDF specification
          </a>{' '}
          &mdash; so the lock you add here is the format&rsquo;s own standard
          password security rather than anything proprietary, and the common
          desktop and mobile readers prompt for the password rather than needing
          something installed first.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500 shrink-0" /> User password (to open)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The one everybody means by &ldquo;a password on the PDF&rdquo;.
              Without it the document will not open at all &mdash; no preview, no
              thumbnail, no text. The tool above requires this one; leave it empty
              and it will tell you so rather than producing an unlocked file.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" /> Owner password (to change the rules)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The permissions password. It governs who may lift the restrictions
              you set &mdash; re-enable printing, allow copying, remove the lock
              entirely. It is optional here, and if you leave it blank the tool
              reuses your open password.
            </p>
          </div>
        </div>
        <p>
          That default is worth pausing on, because it decides whether your
          restrictions mean anything. If both passwords are identical, everyone
          you gave the open password to can also change the permissions. When you
          genuinely want to <strong>restrict PDF permissions</strong> &mdash;
          share a report that may be read but not reprinted, say &mdash; set a{' '}
          <strong>separate owner password</strong> and keep it to yourself. When
          you simply want the file unreadable to strangers, one password is
          enough and the second field can stay empty.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-protect" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Password Protect a PDF Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no trial counter. To{' '}
          <strong>add a password to a PDF</strong> with the tool at the top of
          this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PDF', 'Drop a .pdf onto the panel or click to browse. One document at a time, and only .pdf is accepted — anything with the wrong extension is turned away before you type a password.'],
            ['Set the password and rules', 'Type the password readers will need to open the file. Add a separate owner password if you want to, then tick the four permission switches to suit the document.'],
            ['Download the locked file', 'Press Encrypt & Protect. Your document arrives back named after the original with -protected on the end, so the locked copy never overwrites your working one.'],
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
          That is the whole job. Nothing is stamped across the pages, no trial
          badge is appended, and there is no queue to sit in. The result is an
          ordinary PDF that happens to be locked, so it opens on a phone, a
          laptop or a work machine with nothing to install. If you need to{' '}
          <strong>password protect a PDF on a phone</strong>, the same page does
          it &mdash; there is no separate app and no store detour.
        </p>
        <p>
          The extension check is a name check, not an inspection of the contents,
          so a file that is a PDF in name only &mdash; a renamed document, or a
          download that was truncated on the way in &mdash; gets as far as the
          password screen. When the document then turns out not to be readable,
          the tool reports the error and stops. You get a message rather than a
          broken download, which is the outcome that matters, but it is worth
          knowing that a damaged file is caught at that point rather than at the
          door.
        </p>
      </section>

      {/* 3 */}
      <section id="permissions" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          3. Printing, Copying and Editing: What Each Permission Controls
        </h3>
        <p>
          Beneath the password fields sit four switches. They are how you{' '}
          <strong>stop someone editing your PDF</strong> or{' '}
          <strong>disable copying text from a PDF</strong> without hiding the
          document from the people who are meant to read it.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Allow printing</strong> &mdash; on by default. Switch it off
            for a document you want read on screen and not left on an office
            printer tray.
          </li>
          <li>
            <strong>Allow copying text &amp; graphics</strong> &mdash; on by
            default. Switch it off and readers cannot select and paste your
            wording elsewhere, which is the usual request for quotations,
            proposals and course material.
          </li>
          <li>
            <strong>Allow modifying the document</strong> &mdash; off by default,
            and the one that makes a{' '}
            <strong>read-only PDF</strong> read-only. Signed letters, invoices
            and final contracts belong here.
          </li>
          <li>
            <strong>Allow comments &amp; annotations</strong> &mdash; off by
            default. Turn it on when you are circulating a draft for markup and
            still want the underlying text left alone.
          </li>
        </ul>
        <div className="not-prose my-6 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/25">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> An honest word about permissions
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Permission flags are instructions carried inside the file and
            honoured by reader software. Mainstream readers respect them, which
            covers virtually everyone you will ever send a document to. They are
            not a physical barrier, though: anyone determined enough can still
            photograph a page or retype a sentence. Treat restrictions as a clear
            statement of intent that stops honest accidents, and treat the open
            password as the part that actually keeps the file shut to a casual
            recipient.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
            Where the material would genuinely damage someone if it went astray,
            do not let the password on the file be the only control standing
            between it and the wrong reader. Send the document through a channel
            you actually trust, keep the distribution list as short as the job
            allows, and say plainly in the covering message that it is not to be
            forwarded. A file password is one layer among several, and the
            sensible way to use it is as the layer that stops an accident &mdash;
            not as the reason you stopped thinking about the other layers.
          </p>
        </div>
      </section>

      {/* 4 */}
      <section id="choosing-a-password" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-orange-500 shrink-0" />
          4. Choosing a Password You Will Not Lose
        </h3>
        <p>
          A lock is only as good as the key, and the most common failure in this
          whole category is not a broken password &mdash; it is a forgotten one.
          Once a PDF is encrypted there is no reset link, no security question and
          no back door. We cannot recover it, because nothing about your file or
          your password is kept.
        </p>
        <p>
          Length beats decoration. Modern guidance from the{' '}
          <a
            href="https://pages.nist.gov/800-63-3/sp800-63b.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            NIST Digital Identity Guidelines (SP 800-63B)
          </a>{' '}
          moved away from forced symbol-and-number recipes and towards long,
          memorable passphrases, because a four-word phrase is both harder to
          guess and far easier to remember than a mangled eight-character
          scramble. Three practical rules:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Use a passphrase, not a word.</strong> Four unrelated words
            beat a name with a birthday appended.
          </li>
          <li>
            <strong>Never reuse an account password.</strong> A{' '}
            <strong>PDF password</strong> is travelling with the file to whoever
            you send it to; it should not be the same string that opens your
            email.
          </li>
          <li>
            <strong>Send the password separately.</strong> Emailing a locked
            <strong> confidential PDF</strong> and its password in the same
            message defeats the entire exercise. Send one by mail and the other by
            message or phone.
          </li>
        </ol>
        <p>
          Keep the unprotected original somewhere safe as well. The tool writes a
          new <strong>-protected.pdf</strong> file rather than replacing your
          source document, precisely so that a forgotten password costs you an
          inconvenience rather than the content.
        </p>
      </section>

      {/* 5 */}
      <section id="what-it-cannot-do" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          5. What This Tool Will Not Do
        </h3>
        <p>
          Plenty of people arrive at a page like this one searching for the
          opposite job, so it is fairer to say plainly what is out of scope than
          to let you find out halfway through.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">It adds protection, never removes it</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>No unlocking here &mdash; that is a separate tool</li>
              <li>No password recovery or cracking</li>
              <li>An already-locked PDF cannot be re-protected</li>
              <li>No way for us to open what you have locked</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">And a few things it is not pretending to be</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>No redaction — hidden text stays in the file</li>
              <li>No expiry dates or revocable links</li>
              <li>No digital signatures or certificates</li>
              <li>One document per run, not a batch queue</li>
            </ul>
          </div>
        </div>
        <p>
          The third point on that first list needs spelling out, because it is
          the one that costs people work. An{' '}
          <strong>already-locked PDF cannot be re-protected</strong>, and the
          tool does not stop you trying: feed one in and you will get a file back
          that no password opens &mdash; not the password it already had, and not
          the new one you just typed. Nothing about that copy can be undone
          afterwards. So if you need to change the password on a protected
          document, or change which permissions it carries, start from an
          unlocked copy: either the unprotected original, or the output of the{' '}
          <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF unlocker
          </Link>
          , which takes the current password and hands back a copy with no lock
          on it. Then protect that copy here. If the original is gone and the
          password with it, whoever locked the file in the first place is the
          only route back to a version anyone can work with.
        </p>
        <p>
          The redaction point deserves a sentence of its own too, because it
          catches out serious organisations. Drawing a black box over a
          paragraph, or covering it with a shape, hides it from your eyes and not
          from the file. A password stops the wrong people opening the document;
          it does nothing about sensitive text still sitting inside it. If a
          section must not exist, delete the page with the{' '}
          <Link to="/tools/pdf-page-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF page remover
          </Link>{' '}
          or rebuild the document from only the pages you want using{' '}
          <Link to="/tools/extract-pages-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract pages
          </Link>{' '}
          before you lock it.
        </p>
      </section>

      {/* 6 */}
      <section id="workflow-order" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          6. Protect Last: Where Locking Fits in a Document Workflow
        </h3>
        <p>
          Encryption is the final step, not the first. A locked PDF is a closed
          box as far as these tools are concerned &mdash; none of them can merge,
          compress, convert or reorder a file they cannot open. Do the shaping
          first and the locking afterwards, and you will never have to undo your
          own security to make one small change.
        </p>
        <p>A sensible order for a document going out to a client:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Assemble the pack with the{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF merger
            </Link>{' '}
            and put the sections in order with the{' '}
            <Link to="/tools/pdf-organizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF organizer
            </Link>
            .
          </li>
          <li>
            Do your editing while the file is still open &mdash; pull the text
            into Word with the{' '}
            <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF to Word converter
            </Link>{' '}
            if wording needs changing, or fix a filled form with the{' '}
            <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF flattener
            </Link>
            .
          </li>
          <li>
            Get it under the mail server&rsquo;s attachment limit with the{' '}
            <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF compressor
            </Link>
            , since compression here cannot run once the file is encrypted.
          </li>
          <li>
            Then come back here and{' '}
            <strong>encrypt the PDF before emailing it</strong>.
          </li>
        </ol>
        <p>
          This is also the answer to a question we get in a dozen phrasings:{' '}
          <em>why will your other tools not read my file?</em> If a document
          refuses to load anywhere on this site, check whether a password was put
          on it at some earlier stage. Start again from the unprotected original,
          make the changes, and lock the finished copy last.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PDF Password Protector
        </h3>
        <p>
          Any number of sites will <strong>lock a PDF with a password</strong>.
          Most turn it into an obstacle course of accounts, counters and upsells
          first. Here is what is different, stated plainly enough that you can
          check every line for yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, no account', 'No sign-up, no email, no card and no seven-day countdown. The tool on this page is the entire product.'],
            ['Real permission control', 'Printing, copying, modifying and annotating are four separate switches, not one blunt "secure" checkbox you cannot inspect.'],
            ['Your documents stay private', 'Files are never stored on our servers, never queued, never logged and never retained after your session.'],
            ['Nothing is used for training', 'Your documents are never fed into training data or analytics. A confidential file stays confidential by policy, not by luck.'],
            ['No watermark, no imposed limit', 'The protected PDF comes back clean, with nothing stamped across the pages, and there is no page count or file-size cap imposed as policy. Very large or image-heavy documents are the honest exception — heavy files are heavy work, and one may not get through.'],
            ['Your original is left alone', 'The lock is written to a new -protected.pdf copy, so you always keep an unencrypted master to work from.'],
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
          It sits inside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free document tools
          </Link>{' '}
          built on exactly the same terms, so the file you lock today was
          assembled, trimmed and shrunk without paying for any of it either.
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
              'How do I password protect a PDF for free without installing anything?',
              'Add your PDF to the tool at the top of this page, type the password that will be needed to open it, choose which permissions to allow, and download the protected copy. There is no account, no watermark and nothing to install — and it is free every time, not free for the first three files.',
            ],
            [
              'What is the difference between the user password and the owner password?',
              'The user password is required to open the document at all. The owner password governs who may change the restrictions you set, such as re-enabling printing or copying. If you leave the owner field empty, your open password is used for both — which is fine for simple secrecy, but set a different owner password if you want your permission settings to hold.',
            ],
            [
              'Can you remove a password from a PDF or recover one I have forgotten?',
              'Not with this tool, which only adds protection. Removing a password you know is the job of the PDF unlocker elsewhere on this site: give it the open or owner password and it returns a copy with no lock. Recovering a password you have forgotten is not possible here or anywhere else on our site — there is no back door, and nothing about your file or your password is kept, so there is nothing for us to look up. Always keep the unprotected original; the tool deliberately saves the locked version as a separate -protected.pdf file for that reason.',
            ],
            [
              'How do I stop people copying text or printing my PDF?',
              'Untick "Allow copying text & graphics" and "Allow printing" before you lock the file. Those restrictions are carried inside the document and honoured by mainstream PDF readers. They stop casual reuse rather than a determined person with a camera, so treat them as a statement of intent and let the open password do the work of keeping the file shut.',
            ],
            [
              'Is it safe to password protect a confidential document here?',
              'Your files are never stored on our servers, never queued or logged, and never retained after your session, and they are never used for training or analytics. Nothing you protect is kept. Send the password to your recipient through a different channel than the file itself, and for material that would be damaging in the wrong hands keep the distribution list short rather than relying on the file password alone.',
            ],
            [
              'Can I change the password on a PDF that is already protected?',
              'Yes, in two steps. Putting the locked file straight through this tool will not work — what comes back opens with neither the old password nor the new one, and that copy cannot be repaired. Instead, remove the current password with the PDF unlocker first, then lock the unlocked copy here with the password and permissions you now want. Keep an unprotected copy safe for the next time the terms change.',
            ],
            [
              'Will a password protected PDF open on a phone or on someone else’s computer?',
              'In the common readers, yes. The lock is the PDF format’s own standard password security, so mainstream desktop and mobile readers on phones, tablets and laptops recognise it and simply ask your recipient for the password, with nothing special to install at the other end. More limited viewers — some e-reader devices and lightweight in-app previewers among them — may decline to open a protected file at all rather than prompting, so if your recipient reads on a device like that, expect to send the unlocked document by another route.',
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
          Preparing the document before you lock it? Use the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF splitter
          </Link>{' '}
          to send only the section that concerns your reader, the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            fillable PDF builder
          </Link>{' '}
          to add form fields first, or the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          when a preview image is all anyone needs. And if you would rather
          understand document security than only use it, our free{' '}
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
