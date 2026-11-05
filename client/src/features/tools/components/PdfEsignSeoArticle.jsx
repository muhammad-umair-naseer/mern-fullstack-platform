import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  Eraser,
  FileSignature,
  HelpCircle,
  Layers,
  PenLine,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PDF e-Sign tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The tool stamps a visible, flattened signature. It is not a
 *    certificate-based digital signature, and it does not send documents to
 *    other signers. Section 6 says so plainly and explains when that matters.
 *
 * 2. The white-box problem gets its own section, because the transparency
 *    option is the thing that makes an added signature image look real.
 *
 * 3. Date and name lines, and placements across several pages, are covered
 *    step by step, since that is what most forms actually ask for.
 */
export default function PdfEsignSeoArticle() {
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
        How to <span className="text-orange-600 dark:text-orange-400">Sign a PDF Online Free</span>: Draw, Type or Upload Your Signature, Add the Date, and Know What Kind of Signature You Made
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A lease that needs your signature by tonight, a permission slip, an
        NDA from a new client: somebody sent a PDF with a line at the bottom,
        and print, sign and scan is the last thing you want to do. This guide shows how to{' '}
        <strong>sign a PDF online free</strong> with the tool above: create an{' '}
        <strong>electronic signature</strong> by drawing, typing or adding a
        picture of your own, put it exactly on the line, add the date and your
        name, and download a clean signed copy. It also explains, without the
        usual blur, what an <strong>e sign PDF</strong> result is legally and
        when you need something stronger.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/pdf-esign.webp"
            alt="A hand signing a printed agreement with a silver pen on a wooden desk"
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
              Draw it, type it or bring a photo of it. Click where it goes, add
              the date, and download the signed copy.
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
            ['#what-it-is', '1. What It Means to Sign a PDF Online'],
            ['#how-to-sign', '2. How to Sign a PDF Online Free in Three Steps'],
            ['#three-methods', '3. Draw, Type or Upload: Choosing Your Signature'],
            ['#white-box', '4. Fixing the White Box Around a Signature'],
            ['#date-and-pages', '5. Adding the Date, a Name Line and Several Pages'],
            ['#legal', '6. Electronic Signature vs Digital Signature'],
            ['#why-cortexis', '7. Why Sign Your PDFs with Cortexis'],
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
      <section id="what-it-is" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSignature className="w-6 h-6 text-orange-500 shrink-0" />
          1. What It Means to Sign a PDF Online
        </h3>
        <p>
          To <strong>sign PDF</strong> documents electronically means putting
          your mark on the page as you would with a pen. When you{' '}
          <strong>sign PDF online</strong> here, your signature becomes part
          of the page: it prints like the rest of the document and looks the
          same in every PDF reader.
        </p>
        <p>
          This is the right tool whenever the person asking for your signature
          simply needs to see it on the page. That covers most everyday
          paperwork: rental agreements, consent forms, school slips, invoices,
          and non-disclosure agreements. It is also the fastest answer to <strong>how to sign a PDF without printing</strong>,
          because the whole print, sign and scan loop disappears, and to{' '}
          <strong>how to sign a PDF without paid PDF software</strong>: there
          is no subscription and no editor to buy.
        </p>
        <p>
          It does not send a document out for other people to sign, and it
          does not attach an identity certificate. Section 6 explains when
          that matters.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-sign" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Sign a PDF Online Free in Three Steps
        </h3>
        <p>
          Here is <strong>how to add a signature to a PDF</strong> with the tool
          at the top of this page. There is no account to create and no email
          to hand over.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose the PDF.</strong> Drop it on the first panel or click
            to browse. If the file asks for a password to open, you will be told
            to remove the protection first; the{' '}
            <Link to="/tools/pdf-unlock" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF unlocker
            </Link>{' '}
            does that in a moment when you know the password.
          </li>
          <li>
            <strong>Make your signature.</strong> Pick <em>Draw</em>,{' '}
            <em>Type</em> or <em>Upload image</em> under Method.
          </li>
          <li>
            <strong>Place it and download.</strong> Leave <em>What to place</em>{' '}
            on Signature and click the page preview where the signature belongs.
            Drag the box to move it and pull its corner to resize, then press{' '}
            <em>Sign &amp; download</em>. You get a copy named{' '}
            <strong>-signed.pdf</strong>, and your original stays as it was.
          </li>
        </ol>
        <p>
          The page preview is an outline of where text and images sit rather
          than a full picture, so check the finished file&rsquo;s own preview
          before you download it.
        </p>
      </section>

      {/* 3 */}
      <section id="three-methods" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PenLine className="w-6 h-6 text-orange-500 shrink-0" />
          3. Draw, Type or Upload: Choosing Your Signature
        </h3>
        <p>
          The second panel works as a small <strong>online signature generator</strong>.
          Each method suits a different situation.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Draw</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>draw a signature on a PDF</strong>, sign across the pad
              with whatever you have. On a phone or tablet a finger works well,
              and the ink colour defaults to a dark navy that reads like a real
              pen. Press Clear to start again.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Type</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>sign a PDF with a typed name</strong>, enter it and pick
              Script, Serif, Casual or Bold, plus a colour. The styles draw on
              common system fonts, so Script may look slightly different on a
              Mac, a Windows PC or a phone. Check the live preview before you
              place it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Upload image</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To <strong>upload a signature image to a PDF</strong>, add a photo
              or scan of your handwritten signature. A PNG with a transparent
              background works best; a photo on white paper works too, as the
              next section shows.
            </p>
          </div>
        </div>
        <p>
          Drawn and typed signatures are trimmed to the ink automatically. Set{' '}
          <em>Signature width (% of page)</em> for the first box, then fine-tune
          by dragging the corner. Every signature box in the document uses the
          same signature.
        </p>
      </section>

      {/* 4 */}
      <section id="white-box" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eraser className="w-6 h-6 text-orange-500 shrink-0" />
          4. Fixing the White Box Around a Signature
        </h3>
        <p>
          The most common complaint after people <strong>add a signature to a PDF free</strong>{' '}
          elsewhere is this one: the <strong>signature has a white box on the PDF</strong>,
          a pale rectangle covering the printed line. A photo or scan keeps
          its paper background.
        </p>
        <p>
          The checkbox <em>Make white background transparent</em> is on by
          default. It turns near-white areas of an added image clear and
          fades light grey ones, so the line underneath shows through. Drawn
          and typed signatures have no background at all.
        </p>
        <p>
          This is also the quickest answer to{' '}
          <strong>how to make a transparent signature PNG</strong> worth
          keeping:
        </p>
        <ul className="space-y-2">
          <li>
            Sign on plain white paper with a dark pen.
          </li>
          <li>
            Photograph it straight on, in even light, with no shadow.
          </li>
          <li>
            Crop close to the signature with the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>{' '}
            and add it here with the checkbox left on.
          </li>
        </ul>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Coloured, lined or shadowed paper needs one more step.</strong>{' '}
            The option only clears near-white areas, so a yellow sticky note
            or a grey shadow will stay. Run the photo through the{' '}
            <Link to="/tools/background-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
              background remover
            </Link>{' '}
            first, then add the result here.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="date-and-pages" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-orange-500 shrink-0" />
          5. Adding the Date, a Name Line and Several Pages
        </h3>
        <p>
          Most forms ask for more than a signature. If you are wondering{' '}
          <strong>how to add a date to a PDF</strong>, switch{' '}
          <em>What to place</em> to Date and click beside the date line. The{' '}
          <em>Date text</em> field is filled with today&rsquo;s date in
          year-month-day form; edit it to the format your form expects, such
          as 25/09/2026 or September 25, 2026. For a printed name and title
          under the signature, switch to Text line, type something like
          &ldquo;Jane Smith, Director&rdquo;, and click where it goes. Text size
          runs from 6 to 36 points.
        </p>
        <p>
          To <strong>sign multiple pages of a PDF</strong>, use the page selector
          above the preview to move between pages and click to add a box on
          each one. The status line counts your placements and pages, so you
          can check nothing was missed. Each box is placed by hand, so you
          control where every mark lands.
        </p>
        <p>
          One detail to plan around: every signature box in a document uses
          the same signature, every date box shows the same date text, and
          every text box shows the same text line. If a contract wants your
          full signature on the last page and initials on every other page,
          do it in two rounds. First place your initials (drawn, or typed as
          the text line) on each page and download. Then add the signed copy
          back into the tool, place your full signature, date and printed
          name, and download again.
        </p>
        <p>
          To <strong>sign a lease agreement PDF online</strong>, that is the
          whole routine: initials, signature, date, printed name. The date and
          text lines are written in a standard black typeface that covers
          English and other Latin-alphabet languages. Their font and colour
          cannot be changed, and Arabic, Urdu, Chinese or Cyrillic text will
          not display in those lines. If you need your name in another
          script, write it by hand on the Draw pad so it goes onto the page
          as part of the signature image instead.
        </p>
      </section>

      {/* 6 */}
      <section id="legal" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          6. Electronic Signature vs Digital Signature
        </h3>
        <p>
          These terms are often used interchangeably. They are not the same,
          and the difference decides whether this tool is enough.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>An electronic signature</strong> is any mark that shows you
            agreed: a drawn signature, a typed name, a pasted image. That is
            what this tool produces: visible and part of the page.
          </li>
          <li>
            <strong>A digital signature</strong> is a certificate-based seal
            tied to a verified identity, checked in a reader&rsquo;s signature
            panel. No tool on this site creates one.
          </li>
        </ul>
        <p>
          <strong>Are electronic signatures legally binding?</strong> In many
          countries the simple kind is accepted for most everyday agreements.
          In the United States the{' '}
          <a
            href="https://www.govinfo.gov/app/details/PLAW-106publ229"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ESIGN Act
          </a>{' '}
          says a signature cannot be denied legal effect just because it is
          electronic, and in the European Union the{' '}
          <a
            href="https://eur-lex.europa.eu/eli/reg/2014/910/oj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            eIDAS Regulation
          </a>{' '}
          recognises simple, advanced and qualified electronic signatures.
          Rules still vary by country and document type, and wills, property
          deeds, court filings and some government forms often need a
          certificate, a witness or wet ink; if the request asks for a
          certificate signature, follow that. This guide is general
          information, not legal advice.
        </p>
        <p>
          One practical point: the signed copy can still be edited by anyone
          who has it. If you want it locked, add a password with the{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protector
          </Link>{' '}
          after signing.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Sign Your PDFs with Cortexis
        </h3>
        <p>
          Many sites promise free signing, then ask for an account or stamp
          their name on the result. If you want a{' '}
          <strong>free PDF signer with no account</strong>, here is what you get,
          stated so you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no account', 'No sign-up and no email address to hand over. The tool on this page is the whole product, with nothing to unlock later.'],
            ['No watermark on your document', 'A free esignature tool with no watermark: the only things added to your pages are the signature, date and text you placed.'],
            ['Three ways to sign', 'Draw with a finger or mouse, type your name in one of four styles, or add a photo of your real signature with the white background cleared.'],
            ['Date, name and several pages', 'Place a date, a name and title line and as many signature boxes as you need, across any pages of the document.'],
            ['Your documents stay private', 'Files are never stored on our servers and nothing is retained once you have your signed copy.'],
            ['Nothing is used for training', 'Your contracts and forms are never used for training. What you sign stays yours.'],
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
          built on the same terms. If the form has empty fields you need to
          fill before signing, the{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            fillable PDF maker
          </Link>{' '}
          adds form fields, and the{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF flattener
          </Link>{' '}
          locks the filled answers into the page.
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
              'How do I sign a PDF online for free?',
              'Add the PDF to the tool above, draw, type or add an image of your signature, and click the page preview where it belongs. Press Sign & download to save the copy named -signed.pdf, with no account and no watermark.',
            ],
            [
              'Can I sign a PDF on iPhone or Android?',
              'Yes. To sign a PDF on iPhone, or to sign a PDF on Android free, open this page, choose the file, pick Draw and sign with your finger. Placing and downloading work as on a laptop.',
            ],
            [
              'Does it work on Windows and Chromebook?',
              'Yes. To sign a PDF on Windows without paid PDF software, or sign a PDF on a Chromebook, the steps are the same as anywhere else: choose the file, make your signature, place it and download. You do not need a paid PDF editor or an account.',
            ],
            [
              'My PDF app’s fill and sign option is not working. What can I do?',
              'If the sign option is greyed out or the file will not open, the PDF is usually password-protected or secured by its sender. Remove the protection with the PDF unlocker (you need the password), then sign it here. If the app simply keeps failing, add the PDF to the tool above instead: draw, type or add an image of your signature, click where it goes and download the signed copy.',
            ],
            [
              'Is it safe to sign a PDF online here?',
              'Yes, you can sign a PDF privately here. Your files are never stored on our servers, nothing is retained after you download the signed copy, and nothing is used for training. For a sensitive contract, you can also add a password to the signed file with the PDF password protector.',
            ],
            [
              'Are electronic signatures legally binding?',
              'For most everyday agreements in many countries, yes; the US ESIGN Act and the EU eIDAS Regulation both recognise simple electronic signatures. Wills, deeds and some government forms may need more, so check what the recipient requires.',
            ],
            [
              'Is this a digital signature with a certificate?',
              'No. It is a visible electronic signature drawn into the page, not a certificate-based digital signature. If a document asks for a certificate signature, you will need a service that issues one.',
            ],
            [
              'Can I send the PDF to other people to sign?',
              'Not from this tool. It signs one PDF for you, with no invitations, reminders or audit trail. Each person can sign their own copy here and send it back.',
            ],
            [
              'Can I add different initials and a full signature in one go?',
              'Every signature box in one pass uses the same signature, and every text box the same text line. Place your initials first and download, then add that signed copy back into the tool for the full signature, date and name.',
            ],
            [
              'Can I fill in the form fields before signing?',
              'This tool places a date or a single text line where you click; it does not type into existing form boxes. To add fields to a form, use the fillable PDF maker, and use the PDF flattener to lock filled answers in place.',
            ],
            [
              'Why does my signature have a white box around it?',
              'The image still has its paper background. Keep the Make white background transparent option ticked and near-white areas become clear. For coloured or shadowed paper, use the background remover first.',
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
          Signed and ready to send? Join the signed pages with the rest of the
          pack using the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , shrink a large scanned contract for email with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>
          , or turn photos of paper forms into one PDF with the{' '}
          <Link to="/tools/image-to-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image to PDF converter
          </Link>
          . Need to change wording rather than sign it? Convert the file with the{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word converter
          </Link>
          , or hide private details before sharing with the{' '}
          <Link to="/tools/pdf-redact" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF redaction tool
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
