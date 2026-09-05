import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Download,
  HelpCircle,
  Layers,
  Palette,
  QrCode,
  RefreshCw,
  ScanLine,
  Sparkles,
  Wifi,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the QR code generator.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored table of
 * contents, H3 sections, six benefit cards, FAQ, closing link block.
 *
 * Four decisions shaped the copy, and they matter to anyone editing it later.
 *
 * First, the article promises only the four modes the component actually
 * renders: URL, plain text, Wi-Fi (SSID + password + WPA/WEP/open) and a
 * VERSION:3.0 vCard carrying name, phone and email. The vCard writer keeps an
 * ORG field in state but renders no input for it, so nothing here mentions a
 * company name on a contact card. Exports are exactly two: an 800px PNG and a
 * vector SVG, both named qrcode-<mode>.
 *
 * Second, and this is the important one: "dynamic qr code", "editable qr
 * code", "qr code with logo", "trackable qr code", "qr code scanner" and
 * "bulk qr code generator" are all high-volume phrases and not one of them
 * describes this tool. It writes static symbols at a fixed medium error
 * correction level, with no logo slot, no scan counter, no batch input and no
 * decoding. Sections 3 and 7 answer the question behind those searches
 * honestly instead of pretending. A page that answers ranks; a page that
 * over-promises just collects complaints.
 *
 * Third, "qr code for a pdf" is a recurring query and the honest answer is a
 * redirect, not a feature — a symbol carries text, never a file. That sits as
 * a sub-point in section 3 rather than being quietly ignored.
 *
 * Fourth, privacy is stated as an outcome only: nothing typed here is stored,
 * kept or logged, and no Wi-Fi password or phone number is retained. How that
 * is achieved is deliberately absent from every line of this file.
 */
export default function QrGeneratorSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 9 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to Use a Free <span className="text-orange-600 dark:text-orange-400">QR Code Generator</span>: URLs, Wi-Fi, Text and Contact Cards
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A small square of black and white has become the shortest distance
        between a printed page and a phone. Menus, posters, packaging, wedding
        invitations, guest Wi-Fi cards, conference badges &mdash; all of them
        lean on the same trick. A good <strong>QR code generator</strong> should
        take fifteen seconds to use, hand back a file sharp enough to print, and
        ask for nothing in return. That is what the tool above does:{' '}
        <strong>create a QR code online free</strong>, choose your colours, and
        download a high-resolution PNG or a <strong>QR code SVG</strong> vector.
        No account, no watermark, no expiry date.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/qr-code-generator.webp"
            alt="Free QR code generator creating a scannable QR code for a website URL, a Wi-Fi network and a vCard contact card"
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
              One generator, four kinds of code: a link, a note, a wireless
              network and a contact card &mdash; each exported as PNG or vector
              SVG.
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
            ['#what-is-a-qr-code', '1. What a QR Code Actually Contains'],
            ['#how-to-create', '2. How to Make a QR Code in Three Steps'],
            ['#four-types', '3. The Four Types of QR Code You Can Generate'],
            ['#wifi-qr', '4. How to Make a Wi-Fi QR Code for Guests'],
            ['#png-or-svg', '5. PNG or SVG: Which Download Do You Need?'],
            ['#colours-scanning', '6. Colours, Contrast and Why Some Codes Fail'],
            ['#static-vs-dynamic', '7. Static vs Dynamic QR Codes: The Honest Version'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free QR Code Generator'],
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
      <section id="what-is-a-qr-code" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a QR Code Actually Contains
        </h3>
        <p>
          People picture a QR code as a link that lives on the internet somewhere. It
          is not. The text you type is physically encoded in the pattern of
          squares itself, and nothing is looked up when it is scanned. The camera
          reads the modules, reconstructs the characters and hands them to the
          phone, which decides what to do &mdash; open a page, join a network,
          offer to save a contact.
        </p>
        <p>
          That pattern is not a Cortexis invention. It is defined by{' '}
          <a
            href="https://www.iso.org/standard/62021.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO/IEC 18004, the international standard for QR Code symbology
          </a>
          , which specifies the finder patterns, the encoding modes and the
          Reed&ndash;Solomon error correction that lets a damaged code still
          scan. Every conforming reader follows the same rules, which is why a
          code made here works in the stock camera app on iOS and Android with no
          reader app in between.
        </p>
        <p>
          Three consequences follow, and between them they explain most questions
          people ask about how to <strong>make a QR code</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>The content is fixed once you print it.</strong> Change the
            destination and you need a new code &mdash; see section 7.
          </li>
          <li>
            <strong>Longer text means a denser code.</strong> A short link gives a
            chunky, forgiving pattern; three paragraphs give a fine mesh that
            must be printed larger.
          </li>
          <li>
            <strong>Error correction buys damage tolerance.</strong> Codes here are
            generated at the standard medium level, so a scuffed corner usually
            still scans.
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-create" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Make a QR Code in Three Steps
        </h3>
        <p>
          No sign-up, no email capture, no trial countdown. To{' '}
          <strong>generate a QR code free</strong> with the panel above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Pick the code type', 'Choose Website, Plain Text, Wi-Fi or vCard. The form underneath changes to ask for exactly the fields that type needs.'],
            ['Fill in and restyle', 'Type your link, message, network or contact details. The preview redraws as you type, and two pickers set the foreground and background colour.'],
            ['Download PNG or SVG', 'One button gives an 800 by 800 pixel PNG. The other gives a vector SVG that stays sharp at any size, from a business card to a shop window.'],
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
          That is the whole flow. The preview is live, so you never download
          something you have not seen. Before anything goes to a printer, point
          your own camera at the code on screen &mdash; ten seconds of testing
          has saved a lot of reprints.
        </p>
      </section>

      {/* 3 */}
      <section id="four-types" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Four Types of QR Code You Can Generate
        </h3>
        <p>
          A phone knows whether to open a page or join a network because the
          encoded text follows a recognised convention. The generator writes
          those conventions for you, so a stray character never breaks one.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Website: a QR code for a link
        </h4>
        <p>
          The most common request. Paste any address and you have a{' '}
          <strong>QR code for a website link</strong> &mdash; a landing page, a{' '}
          <strong>restaurant menu QR code</strong>, a review page, a booking
          form, a social profile. Include the <code>https://</code> prefix so
          every reader treats it as a link rather than plain text. This is what
          people search for as a <strong>URL to QR code converter</strong>.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          What about a QR code for a PDF or an image?
        </h4>
        <p>
          Worth clearing up, because it is asked constantly: no QR code contains a
          file. A symbol holds a short run of text, so a twelve-page document
          cannot fit inside one. A <strong>QR code for a PDF</strong> is really a
          code pointing at an address where that PDF lives. Put the document
          somewhere it can be reached, then paste that address into the Website
          tab. If it is slow to open on a phone, run it through our{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          first.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Plain text: a note, a code, a serial number
        </h4>
        <p>
          Anything typed here is encoded verbatim and shown to whoever scans it:
          asset tags, shelf labels, a table number, a discount code, a caption on
          a museum display. Nothing opens; the words simply appear. If the text
          runs long, print the square generously, because a dense pattern needs
          more area to stay legible.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          Wi-Fi: join the network without typing a password
        </h4>
        <p>
          Enter the network name, the password and the security type, and the tool
          writes the standard Wi-Fi credential string that phone cameras
          recognise. Section 4 covers it properly, because it is the most useful
          thing on this page for cafes and holiday lets.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">
          vCard: a scannable contact card
        </h4>
        <p>
          The contact mode builds a{' '}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc2426"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            vCard 3.0 record, the format specified in RFC 2426
          </a>
          , holding a full name, a phone number and an email address. Scanning it
          prompts the phone to save a contact with those fields filled in, which
          makes a genuinely useful <strong>QR code for a business card</strong>,
          email signature or conference badge. Keep the number in full
          international form and it will dial correctly from anywhere.
        </p>
      </section>

      {/* 4 */}
      <section id="wifi-qr" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wifi className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Make a Wi-Fi QR Code for Guests
        </h3>
        <p>
          If you run a cafe, a rental or a waiting room, this replaces the
          laminated card with the password on it. A{' '}
          <strong>Wi-Fi QR code generator</strong> encodes three things: the
          network name, the password, and the security type your router uses.
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Network name (SSID).</strong> Type it exactly as it appears in
            the list of networks, capitals and spaces included. A mismatched
            character is the main reason a Wi-Fi code silently fails.
          </li>
          <li>
            <strong>Password.</strong> Enter the passphrase. The field is masked as
            you type, and punctuation such as semicolons and colons is handled
            properly rather than cutting the code short.
          </li>
          <li>
            <strong>Security type.</strong> WPA/WPA2/WPA3 for any modern router,
            WEP only for ancient hardware, or None for an open network.
          </li>
        </ol>
        <p>
          Download the PNG, print it, put it on the wall. A guest points a camera
          at it and the phone offers to join &mdash; nobody mistaking a lowercase
          l for a 1.
        </p>
        <p>
          One caution: anyone who can see the square can join the network, so treat
          it as you would the password written on a card &mdash; fine for a guest
          network, not the one your accounts live on. What you type is never
          stored on our servers and never logged; the credentials exist only in
          the image you download.
        </p>
      </section>

      {/* 5 */}
      <section id="png-or-svg" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-6 h-6 text-orange-500 shrink-0" />
          5. PNG or SVG: Which Download Do You Need?
        </h3>
        <p>
          Two buttons, two very different files, and picking the wrong one is the
          usual cause of a blurry code on a printed flyer.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" /> High-resolution PNG
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>800 &times; 800 pixels, well above screen size</li>
              <li>Opens anywhere, no special software</li>
              <li>Right for slides, emails, social posts, web pages</li>
              <li>Fine for labels and cards</li>
              <li>Enlarging far past 800px softens the edges</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/25">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600 shrink-0" /> Vector SVG
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <li>Mathematically perfect at any size</li>
              <li>Right for posters, banners, packaging, signage</li>
              <li>Opens in professional design software</li>
              <li>Tiny file, no resolution to run out of</li>
              <li>Razor sharp on a shop window</li>
            </ul>
          </div>
        </div>
        <p>
          The rule of thumb: if a printer is involved and the code will be bigger
          than a postcard, take the <strong>SVG QR code download</strong>. For a
          screen, the PNG is simpler and already sharp enough. The{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/SVG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            MDN reference on SVG
          </a>{' '}
          explains why a vector never pixelates. Need the PNG at another size? The{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          will scale it, the{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image enlarger
          </Link>{' '}
          pushes it larger for a poster proof, and the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>{' '}
          shrinks it for an email footer.
        </p>
      </section>

      {/* 6 */}
      <section id="colours-scanning" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          6. Colours, Contrast and Why Some QR Codes Fail to Scan
        </h3>
        <p>
          The two colour pickers let you match a brand palette instead of settling
          for black on white, which is why people look for a{' '}
          <strong>custom colour QR code generator</strong>. Used carelessly it
          produces a square no camera will read, and the cause is almost always
          one of five things.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Not enough contrast.</strong> Navy on white is perfect; mid-grey
            on beige is a coin toss. Keep the foreground dark and the background
            light.
          </li>
          <li>
            <strong>Inverted colours.</strong> A light pattern on a dark ground
            confuses many readers. Keep the pattern the darker of the two.
          </li>
          <li>
            <strong>Printed too small.</strong> Start at two centimetres across for
            a short link, larger for longer content or a distance scan.
          </li>
          <li>
            <strong>The quiet zone was cropped.</strong> Every code needs a clear
            margin. Both downloads include it &mdash; do not crop it away.
          </li>
          <li>
            <strong>Reflective or curved surfaces.</strong> Gloss varnish and
            tight curves scatter the pattern. Matt stock scans far better.
          </li>
        </ul>
        <p>
          To pull exact hex values out of a logo before styling the code, the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker tool
          </Link>{' '}
          will give you them, and the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          helps place the finished code inside an artwork frame. Test the real
          printed piece before you order five thousand of them.
        </p>
      </section>

      {/* 7 */}
      <section id="static-vs-dynamic" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-orange-500 shrink-0" />
          7. Static vs Dynamic QR Codes: The Honest Version
        </h3>
        <p>
          Many sites advertise a <strong>dynamic QR code</strong> &mdash; one whose
          destination you can change later, with a dashboard counting scans. It
          is worth knowing what that is, because the marketing rarely says.
        </p>
        <p>
          A dynamic code does not encode your link at all. It encodes a short
          redirect address owned by the company that made it. Every scan travels
          through their system, which is how they change the destination and
          count visits. It also means the code dies the day that service shuts
          down or decides your free plan has expired &mdash; and printed codes
          tend to outlive the startups behind them.
        </p>
        <p>
          The codes generated here are <strong>static QR codes</strong>: your
          content is encoded directly into the pattern, with nobody in the
          middle. No scan tracking, no redirect, no expiry, no account to lapse.
          A code you print today still works in ten years. The honest trade is that
          it is not <strong>editable after printing</strong> &mdash; if the
          destination changes you generate a new one in fifteen seconds. For a
          menu, a Wi-Fi network or a contact card, that trade is usually the
          right way round. If you genuinely need analytics or a re-pointable
          link, encode an address you control and change the redirect at your
          end: same flexibility, without handing your printed material to
          somebody else&rsquo;s subscription.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free QR Code Generator
        </h3>
        <p>
          Plenty of sites will <strong>create a QR code online</strong>. Most
          make it quietly awkward until you subscribe. Here is what is different,
          stated plainly enough that you can check every line.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free with no account', 'No sign-up, no email address, no card, no seven-day trial. The generator on this page is the whole product.'],
            ['Codes that never expire', 'Your content is encoded in the pattern itself. No redirect to go dark, no plan to lapse.'],
            ['No watermark or branding', 'The PNG and SVG contain your code and nothing else. No logo in the corner, no promotional strip.'],
            ['Vector output included free', 'The SVG is not held back for a premium tier. Print at any size, badge to billboard.'],
            ['Nothing you type is kept', 'Links, notes, Wi-Fi passwords and contact details are never stored on our servers, never logged and never used for analytics or training.'],
            ['Unlimited codes', 'Generate one code or two hundred. No daily counter ticking down.'],
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
            free document and image tools
          </Link>{' '}
          built on the same terms, so once the code exists you can build the thing
          it goes on without paying for any of it.
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
              'Is this QR code generator really free, and do the codes expire?',
              'Yes to the first and no to the second. There is no account, no trial and no payment step. Your content is encoded directly into the pattern rather than pointing at a redirect we control, so a code you print today keeps working.',
            ],
            [
              'How do I make a QR code for my Wi-Fi password?',
              'Choose the Wi-Fi tab, type the network name exactly as it appears in the list of networks, enter the password, and pick WPA/WPA2/WPA3 unless your router is very old. Download the PNG and print it. Guests point a camera at it and the phone offers to join.',
            ],
            [
              'Can I add my logo to the middle of the QR code?',
              'Not in this tool. It produces a clean standards-compliant symbol in your chosen colours, which is the version most likely to scan first time on every phone. If you need a logo, open the downloaded SVG in a design program and add it there, small and clear of the three corner squares, then test before printing.',
            ],
            [
              'Why will my QR code not scan?',
              'Nearly always contrast, size or the margin. Keep the pattern much darker than the background, print it at least a couple of centimetres across, and never crop the clear border the download includes. Glossy or curved surfaces also scatter the pattern.',
            ],
            [
              'Can I change where the QR code points after I have printed it?',
              'No, and neither can any static code: the destination is physically part of the pattern. If your link may change, encode an address you control and update the redirect at your end, or generate a fresh code here.',
            ],
            [
              'Is it safe to put my phone number or Wi-Fi password in?',
              'What you type is never stored on our servers, never retained after your visit and never used for analytics or training. Do remember that a printed code is readable by anyone who can see it, so treat one with the care you would give the printed details themselves.',
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
          Building the thing the code goes on? Turn a page into a printable sheet
          with{' '}
          <Link to="/tools/save-web-as-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            save web page as PDF
          </Link>
          , combine your flyer pages with the{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF merger
          </Link>
          , turn a finished design into a shareable image with the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>
          , or lock the final artwork with{' '}
          <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF password protection
          </Link>
          . And if you would rather design the poster around the code than fight a
          template, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course in Photoshop and Illustrator
          </Link>{' '}
          covers layout, contrast and print-ready artwork from scratch.
        </p>
      </div>
    </article>
  );
}
