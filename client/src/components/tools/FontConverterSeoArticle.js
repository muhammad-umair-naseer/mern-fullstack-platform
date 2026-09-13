import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Globe,
  HelpCircle,
  Layers,
  Monitor,
  Package,
  Scale,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the font converter.
 *
 * Written against what FontConverter.js actually does. "Lossless" is only
 * ever said about the WOFF wrap and unwrap paths. TTF <-> OTF is a rebuild
 * that drops hinting, kerning and non-standard tables, and section 6 says so.
 * WOFF2 is detected but never read or written; section 5 states the boundary.
 * The readout shows name, detected format, size and glyph count only. The
 * preview box does not render the selected font, so no live-preview claim
 * appears. Choosing OTF or TTF for a WOFF input is ignored in favour of the
 * WOFF's own flavour, and the article says so.
 */
export default function FontConverterSeoArticle() {
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
        Free <span className="text-orange-600 dark:text-orange-400">WOFF to TTF Converter</span>: Unwrap a Web Font, or Wrap a Desktop Font for the Web
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You saved a font from a website and it arrived as a .woff file that
        Windows will not install, Font Book ignores and Figma refuses. Or you
        own a perfectly good TTF and a performance audit is complaining that it
        is too heavy to serve. Both problems have the same fix. A WOFF is your
        original font in a compressed wrapper, and this{' '}
        <strong>WOFF to TTF converter</strong> takes the wrapper off, or puts it
        on, without touching the tables inside. This guide covers{' '}
        <strong>WOFF to TTF</strong>, <strong>TTF to WOFF</strong> and{' '}
        <strong>OTF to WOFF</strong>, why the result is byte-exact, and the two
        jobs this tool honestly does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/font-converter.webp"
            alt="WOFF to TTF converter free online - unwrap a web font to an installable TTF or OTF, or wrap a desktop font as WOFF"
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
              One file in, one file out: WOFF becomes the TTF or OTF it was made
              from, and TTF or OTF becomes a WOFF ready for @font-face.
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
            ['#what-is-woff', '1. What a WOFF File Is, and Why It Will Not Install'],
            ['#how-to-convert', '2. How to Use the WOFF to TTF Converter Free Online'],
            ['#lossless', '3. Is WOFF to TTF Lossless? Unwrapping to the Original Tables'],
            ['#ttf-to-woff', '4. TTF to WOFF and OTF to WOFF: Preparing a Font for a Website'],
            ['#woff-vs-woff2', '5. WOFF 1.0 vs WOFF2, and the Format This Tool Does Not Read'],
            ['#ttf-otf', '6. TTF to OTF and Back: A Rebuild, Not a Wrap'],
            ['#where-it-gets-stuck', '7. Windows, Font Book, Figma, PowerPoint: Where WOFF Fonts Get Stuck'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Font Converter'],
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
      <section id="what-is-woff" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a WOFF File Is, and Why It Will Not Install
        </h3>
        <p>
          A TrueType or OpenType font is a small archive of named tables:
          glyph outlines, character map, kerning, hinting instructions and a
          name table. A desktop operating system knows that structure, which is
          why a .ttf or .otf installs with a double-click.
        </p>
        <p>
          The{' '}
          <a
            href="https://www.w3.org/TR/WOFF/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C WOFF 1.0 specification
          </a>{' '}
          defines a different container around the same tables. Each table is
          compressed on its own, a directory records where it sits and how big
          the original was, and a short header marks the file as a web font.
          Nothing inside is re-drawn. It is, quite literally, your font in a
          zip.
        </p>
        <p>
          That is also why a <strong>font file won&rsquo;t open</strong> when it
          is a WOFF. Windows, macOS, Word, Photoshop and Figma all expect the
          plain table directory, not the compressed one, so the Install button
          is missing, the file shows as an unknown type, or Font Book silently
          does nothing. If you <strong>downloaded a font from a website and it
          is .woff</strong>, nothing is broken. It simply needs unwrapping, and
          that is the whole job of the tool above.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use the WOFF to TTF Converter Free Online
        </h3>
        <p>
          No account, no email, no watermark, no daily quota. If you searched
          for a <strong>woff to ttf converter free online</strong> because the
          usual names wanted a sign-up or capped you after a few files, here is
          <strong> how to convert WOFF to TTF</strong> with the panel at the top
          of this page:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose the font file', 'Click the picker and select one .woff, .ttf or .otf. The format is read from the bytes at the front of the file, not the extension, so a mislabelled file is identified correctly.'],
            ['Check the readout', 'The tool shows the detected format, file size, the font’s full name and its glyph count before anything is converted. If a WOFF was chosen, the target flips to TTF automatically.'],
            ['Convert and download', 'Press the button and the file downloads under the original name with the new extension. A status line confirms the output format and size.'],
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
          One detail worth knowing before you pick a target. When the input is
          a WOFF, the output extension follows what the WOFF was made from: a
          wrapped TrueType font comes back as .ttf and a wrapped CFF OpenType
          font comes back as .otf, whichever of the two you selected. That is
          deliberate. The tables inside decide what the file really is, and
          giving a CFF font a .ttf name would only confuse the installer. So{' '}
          <strong>convert WOFF to OTF</strong> and convert WOFF to TTF are the
          same action; the font itself picks the right answer.
        </p>
        <p>
          There is no batch mode. The tool takes one file at a time, so run
          each weight of a family through in turn, then bundle the results with
          the{' '}
          <Link to="/tools/create-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive creator
          </Link>{' '}
          if you need to pass them on.
        </p>
      </section>

      {/* 3 */}
      <section id="lossless" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-500 shrink-0" />
          3. Is WOFF to TTF Lossless? Unwrapping to the Original Tables
        </h3>
        <p>
          Yes, and it is worth being precise about why, because plenty of
          converters say &ldquo;lossless&rdquo; without explaining it. Here the
          word is literal.
        </p>
        <p>
          Going from WOFF to TTF or OTF, each table is inflated back to the
          length the WOFF directory recorded for it, the TrueType or OpenType
          directory is rebuilt with the correct padding and search fields, and
          every table keeps the checksum it carried in the WOFF, which is the
          checksum the original desktop font had. The glyph outlines, the
          hinting programs, the kerning, the GSUB and GPOS feature tables, the
          character map and the name table all come out as the same bytes that
          went in when the WOFF was made. If you want to{' '}
          <strong>unwrap a WOFF to the original TTF</strong>, this is the way
          to do it that leaves nothing to take on trust.
        </p>
        <p>
          Two things are not restored. Table order is normalised to
          alphabetical, which every font engine accepts. And a WOFF may carry an
          optional metadata block with licensing text; that block is not part of
          the font and is not carried into the TTF. The licence itself still
          applies to you, which raises the question of where the file goes.
        </p>
        <p>
          Your font file is never stored on our servers and nothing is retained
          once your session ends, which matters when a
          foundry EULA forbids handing the font to third parties. If you need
          an <strong>OTF to WOFF converter for a licensed font</strong> and
          privacy is the reason you have not used the big-name sites, this is
          the honest answer.
        </p>
      </section>

      {/* 4 */}
      <section id="ttf-to-woff" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500 shrink-0" />
          4. TTF to WOFF and OTF to WOFF: Preparing a Font for a Website
        </h3>
        <p>
          The other direction is the front-end developer&rsquo;s job. A desktop
          TTF is often far heavier than it needs to be for the web, and if you have ever seen a
          performance report complain that a <strong>TTF font is too big for
          the website</strong>, the fix it is hinting at is the compressed web
          format. <strong>How to convert TTF to WOFF for a website</strong>:
          choose the file, leave the target on WOFF 1.0, and download. An OTF
          goes the same way, so <strong>OTF to WOFF</strong> is the same
          three clicks for the CFF fonts foundries usually sell.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Every table is wrapped, none are rewritten
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Each table is compressed on its own and stored with its original
              length and checksum. Hinting instructions, kerning, OpenType
              features and the character map are carried through untouched, so
              this is <strong>TTF to WOFF without losing hinting</strong> in the
              strict sense: the hinting bytes are the ones you started with.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              A table is stored raw if compressing it would not help
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The WOFF specification allows any table to be stored
              uncompressed, and the tool does that whenever compression would
              make a table larger rather than smaller. Fonts that are already
              tightly packed keep their size instead of growing.
            </p>
          </div>
        </div>
        <p>
          That second rule answers a surprisingly common question:{' '}
          <strong>why is my WOFF bigger than the TTF?</strong> It happens when
          most of the font&rsquo;s weight is in tables that do not compress
          well, typically CFF outlines the foundry already optimised. Those are
          stored as they are, and the WOFF directory is a little longer per
          table than the TrueType one, so the finished file can land a fraction
          above the original. Nothing has gone wrong; the font simply had no
          slack to take up.
        </p>
        <p>
          Reference the WOFF in an @font-face rule as you would any web font.
          To inline it as a data URI instead, the{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder
          </Link>{' '}
          turns the file into a string you can paste straight into the CSS.
        </p>
      </section>

      {/* 5 */}
      <section id="woff-vs-woff2" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          5. WOFF 1.0 vs WOFF2: Which to Convert To, and the Format This Tool Does Not Read
        </h3>
        <p>
          <strong>WOFF 1.0 vs WOFF2, which should you convert to?</strong> WOFF2
          uses stronger compression and produces smaller files, and it is the
          better choice when your build pipeline can generate it. WOFF 1.0 is
          the older, simpler container, accepted everywhere WOFF2 is and in a
          few more places, and it can be wrapped and unwrapped with the original
          tables intact. As a quick embed, or a fallback source next to a WOFF2
          in the same @font-face rule, it is a perfectly respectable choice.
        </p>
        <p>
          Be clear about the boundary, though. <strong>This tool reads and
          writes WOFF 1.0 only.</strong> It recognises a WOFF2 file when it sees
          one, but it cannot open it and cannot produce one. Anyone searching
          for a <strong>WOFF2 to TTF converter</strong> will not get that here,
          and it is better to say so than to let you find out after clicking
          Convert. EOT, SVG fonts, TrueType collections and Type 1 are outside
          its scope as well.
        </p>
        <p>
          If your real need is a different kind of file altogether, the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists every converter on the site by input type.
        </p>
      </section>

      {/* 6 */}
      <section id="ttf-otf" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          6. TTF to OTF and OTF to TTF: A Rebuild, Not a Wrap
        </h3>
        <p>
          The dropdown also offers TTF and OTF as targets for a font that is
          already a TTF or OTF, and this path works differently. There is no
          wrapper to add or remove; the two formats differ in how outlines are
          stored, so the font is parsed and a new file is written from that
          parsed model.
        </p>
        <p>
          That is a rebuild, and a rebuild is not lossless. The outlines are
          re-encoded as CFF curves, TrueType hinting instructions are not
          carried over, and kerning, positioning and other non-standard tables
          are dropped. The result is a valid font with the same glyphs, names,
          character map and basic metrics, and it is saved under whichever
          extension you chose even though the outlines inside are CFF. It is
          fine for a quick test but not for production if hinting and kerning
          matter. Use this path only when you
          specifically need a re-serialised file, and the WOFF paths whenever a
          byte-exact copy is the point.
        </p>
        <p>
          Whatever the path, the readout on selection is worth a look on its
          own. If you have ever needed to <strong>check the glyph count of a
          font file online</strong> before deciding whether a free download
          really covers the accented characters you need, the panel shows the
          full name, the detected format and the number of glyphs the moment a
          file is chosen, with no conversion required.
        </p>
      </section>

      {/* 7 */}
      <section id="where-it-gets-stuck" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-6 h-6 text-orange-500 shrink-0" />
          7. Windows, Font Book, Figma, PowerPoint: Where WOFF Fonts Get Stuck
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Can&rsquo;t install a WOFF font on Windows.</strong> The
            right-click menu shows no Install entry because Windows does not
            treat .woff as a font. Convert it to TTF or OTF and the entry
            appears. No registry edits, no renaming the extension, which never
            works because the bytes inside are still compressed.
          </li>
          <li>
            <strong>WOFF font not showing in Font Book on Mac.</strong> Font
            Book either ignores the drag or reports the file as invalid. The
            fix is the same unwrap. To{' '}
            <strong>convert WOFF to TTF on Mac without software</strong>, open
            this page, choose the file, download the .ttf and double-click it.
          </li>
          <li>
            <strong>Figma won&rsquo;t accept a WOFF font.</strong> The desktop
            app reads fonts from the operating system, and the system only
            lists what it could install. Unwrap to TTF or OTF, install it, and
            it turns up in the font list on the next launch.
          </li>
          <li>
            <strong>Converting a brand font from WOFF to TTF for
            PowerPoint.</strong> Agencies often deliver only the web kit.
            Unwrap each weight, install them, and Office will offer them like
            any other family. Check the licence covers desktop use.
          </li>
          <li>
            <strong>Convert WOFF to TTF without fontTools or Python.</strong>{' '}
            The forum answer is usually a command-line script. If you do not
            have a Python setup and do not want one for a single font, this
            page does the same unwrap with the same result.
          </li>
        </ul>
        <p>
          The one case this does not cover is a font saved from a site that
          only served WOFF2; that needs a WOFF2-aware tool, as section 5
          explains.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Font Converter
        </h3>
        <p>
          &ldquo;<strong>Font converter</strong>&rdquo; means two different
          things: a fancy-text styler that swaps letters for lookalike Unicode
          symbols, or a file format tool. This is the second kind. If you
          searched for a{' '}
          <strong>free font converter with no signup and no watermark</strong>{' '}
          and meant files, here is what you get:
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, every time', 'No account, no email, no trial countdown and no daily conversion cap. The tenth font converts on the same terms as the first.'],
            ['Byte-exact on the WOFF paths', 'Wrapping and unwrapping keep every table and its checksum intact. Hinting, kerning and OpenType features come through exactly as the foundry made them.'],
            ['Your font is never stored on our servers', 'The file is not stored, not retained after your session and not used for training or analytics. A licensed font stays your business.'],
            ['Format read from the bytes, not the name', 'A .ttf that is really a WOFF, or an .otf that is really TrueType, is identified correctly and the right output is produced.'],
            ['The font is inspected before you commit', 'Full name, file size, glyph count and detected format appear on selection, so you know what you have before converting.'],
            ['Honest about its limits', 'No WOFF2, no batch, no CSS kit. The page says so up front rather than letting a dropdown promise what the tool cannot deliver.'],
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
            free file tools
          </Link>{' '}
          on the same terms, so the logo that came with the brand font can go
          through the{' '}
          <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            vector converter
          </Link>
          , the brand palette through the{' '}
          <Link to="/tools/colour-format-utilities" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour format utilities
          </Link>
          , and the hero image through the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
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
              'Is this WOFF to TTF converter really free, with no account?',
              'Yes. Choose the file, press Convert, and the TTF or OTF downloads. There is no sign-up, no email step, no watermark and no limit on how many fonts you convert in a day.',
            ],
            [
              'Is WOFF to TTF lossless?',
              'Yes. A WOFF 1.0 is the original font’s tables, each compressed separately. Unwrapping restores every table with its original checksum, so outlines, hinting, kerning and OpenType features are the same bytes the foundry shipped. Only the optional metadata block, which is not part of the font, is left behind.',
            ],
            [
              'Why did I get an .otf when I asked for a .ttf?',
              'Because the font inside the WOFF has CFF outlines, which is what an .otf is. The output extension follows what the font really is, since naming a CFF font .ttf would only make installers reject it. The reverse is also true: a wrapped TrueType font always comes back as .ttf.',
            ],
            [
              'Why is my WOFF bigger than the TTF it came from?',
              'Any table that would grow under compression is stored raw, and the WOFF directory is slightly longer per table than the TrueType one. A font whose tables were already tightly packed therefore comes out nearly the same size, occasionally a fraction larger. The file is still correct; there was simply nothing left to squeeze.',
            ],
            [
              'Can I convert WOFF2 to TTF here?',
              'No. This tool reads and writes WOFF 1.0 only. It will recognise a WOFF2 file but cannot open it. If a website only served WOFF2, you will need a tool built for that format. EOT, SVG fonts and TrueType collections are outside its scope as well.',
            ],
            [
              'Does converting OTF to TTF keep the hinting and kerning?',
              'No, and it is important to know that. TTF to OTF and OTF to TTF are rebuilt from parsed outlines rather than wrapped, so hinting instructions and kerning tables are not carried over. Use that path only when you specifically need a re-serialised file. The WOFF directions are the ones that are byte-exact.',
            ],
            [
              'Can I install the converted font on Windows or Mac straight away?',
              'Yes. The downloaded .ttf or .otf is an ordinary desktop font. Double-click it and choose Install on Windows, or open it with Font Book on macOS. It then appears in Word, PowerPoint, Photoshop and Figma like any other font, provided the licence allows desktop use.',
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
          Fonts rarely travel alone. The{' '}
          <Link to="/tools/extract-archive" className="text-orange-600 font-semibold underline hover:text-orange-700">
            archive extractor
          </Link>{' '}
          opens the zip the foundry sent, the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          handles the logo files that came with it, and the{' '}
          <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website screenshot tool
          </Link>{' '}
          captures how the type actually renders on a live page. If you would
          rather understand @font-face, loading strategy and the rest of the
          front-end toolkit than just fix one file, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers web fonts in the CSS module.
        </p>
      </div>
    </article>
  );
}
