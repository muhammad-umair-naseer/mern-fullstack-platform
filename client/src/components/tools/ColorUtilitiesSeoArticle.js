import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Contrast,
  Droplets,
  Eye,
  HelpCircle,
  Layers,
  Palette,
  Printer,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the colour format utilities tool.
 *
 * Written against what ColorUtilities.js actually does, which is three jobs
 * on one colour: convert it, make tints and shades of it, and check it against
 * a background for WCAG AA and AAA. Every page-one competitor does one of those
 * jobs, so the article is built around the loop that only happens when they
 * sit together — click a shade, watch the ratio and all five codes recompute.
 *
 * The defaults tell the story. Brand orange #F97316 on #0F172A comes out at
 * 6.37:1, which passes AA and fails AAA, and the first tint up (#FA8F45) lands
 * at 7.72:1 and passes both. Section 6 walks exactly that, with the real numbers
 * from the code rather than a tidier invented pair.
 *
 * Several neighbouring keywords are answered honestly instead of promised.
 * "hsl to hex converter with alpha" — the HEX row drops alpha and only the RGBA
 * row keeps it, so section 3 says so. "color contrast ratio calculator hex" —
 * the text colour takes any hex, but the background is chosen with the swatch
 * picker only, so section 5 explains that flow rather than pretending both
 * sides are paste-in fields. CMYK is the mathematical conversion, not an ICC
 * proof, and section 7 says so plainly for anyone sending work to print. The
 * check covers normal-text AA and AAA only; large-text and UI-component
 * thresholds are not claimed anywhere. Named CSS colours, modern
 * space-separated syntax, oklch, HSV, Pantone and colour harmonies are also
 * outside the code and are not mentioned as features.
 */
export default function ColorUtilitiesSeoArticle() {
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
        <span className="text-orange-600 dark:text-orange-400">Color Code Converter</span> for HEX, RGB, HSL and CMYK, With Shades and a WCAG Contrast Check
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A colour rarely stays in one format for long. The brand guide gives you
        a hex code, the stylesheet wants <strong>hex to rgb</strong>, the design
        token is in HSL, and the printer wants CMYK. Then an accessibility audit
        says the same colour is hard to read. This{' '}
        <strong>color code converter</strong> handles all of that on one screen:
        paste one value, read it in five formats, pick a lighter or darker
        version, and see whether it passes WCAG against your background before
        you copy anything. This guide walks the exact case the tool opens with.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/colour-format-utilities.webp"
            alt="Thread swatches graded from yellow through magenta to teal on labelled cards"
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
              One colour in, five formats out, nine swatches to choose from, and
              an AA/AAA verdict for whichever one you click.
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
            ['#five-formats', '1. What a Color Code Converter Gives You'],
            ['#how-to-convert', '2. How to Convert HEX to RGB, HSL and CMYK'],
            ['#alpha', '3. Transparency: 8-Digit HEX, RGBA and HSLA'],
            ['#tints-and-shades', '4. Lighter and Darker Versions of a Colour'],
            ['#contrast', '5. How to Check Colour Contrast for Accessibility'],
            ['#find-a-passing-shade', '6. Finding the Shade of Your Brand Colour That Passes'],
            ['#cmyk-for-print', '7. CMYK for Print: What the Numbers Mean'],
            ['#why-cortexis', '8. Why Cortexis Is the Best Free Colour Converter'],
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
      <section id="five-formats" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a Color Code Converter Actually Gives You
        </h3>
        <p>
          Every format describes the same colour from a different angle, and
          each is the native language of a different tool, which is why a{' '}
          <strong>color converter</strong> never stops being useful. The tool
          above returns five rows for whatever you paste, each with a copy
          button:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>HEX</strong> &mdash; six characters, two each for red, green
            and blue, shown in uppercase. The form brand guides and most
            stylesheets use.
          </li>
          <li>
            <strong>RGB</strong> &mdash; the same three channels as whole numbers
            from 0 to 255, written as <code>rgb(249, 115, 22)</code>.
          </li>
          <li>
            <strong>RGBA</strong> &mdash; RGB plus an opacity from 0 to 1. This is
            the row that keeps any transparency you entered; section 3 explains
            why that matters.
          </li>
          <li>
            <strong>HSL</strong> &mdash; hue in degrees, saturation and lightness
            as percentages. The friendliest format for nudging a colour lighter
            or less intense without guessing.
          </li>
          <li>
            <strong>CMYK</strong> &mdash; cyan, magenta, yellow and black as
            percentages, the way ink is specified for print.
          </li>
        </ul>
        <p>
          That is <strong>hex to rgb hsl cmyk all at once</strong>, from one
          field, rather than a chain of single-purpose pages. It is also a{' '}
          <strong>colour converter</strong> in the spelling we use across the
          site &mdash; a <strong>colour code converter</strong> for UK,
          Australian and Pakistani readers who search that way and find mostly
          US-built tools that do not.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert HEX to RGB, HSL and CMYK (Step-by-Step)
        </h3>
        <p>
          No account, no email, no feature held back for a paid tier. To use
          this <strong>free online color converter</strong>:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Paste or pick a colour', 'Type a value into the text field at the top, or click the swatch beside it to open a picker. HEX with or without the hash, rgb(), rgba(), hsl() and hsla() are all accepted.'],
            ['Read the five rows', 'HEX, RGB, RGBA, HSL and CMYK update as you type; there is no convert button to press.'],
            ['Copy the one you need', 'Each row has its own copy button. A green tick confirms the value is on your clipboard, ready to paste into a stylesheet, a design token or a print brief.'],
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
          On what the field accepts: three-digit shorthand like{' '}
          <code>#F73</code> is expanded, letter case does not matter, and{' '}
          <code>rgb()</code> and <code>hsl()</code> want commas between the
          numbers with a percent sign on saturation and lightness, the classic
          form shown in the{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            MDN reference for CSS colour values
          </a>
          . The newer space-separated syntax, named colours such as{' '}
          <code>tomato</code>, and the <code>oklch()</code> family are not
          recognised; an unrecognised value shows the default orange rather than
          an error, so a sudden orange swatch means the input needs a second
          look.
        </p>
        <p>
          This is also the answer to <strong>how to convert hex to hsl</strong>{' '}
          and to <strong>convert hex to rgb without Photoshop</strong>: no
          design software is needed to read a brand colour in another format.
          A common case is <strong>Tailwind color to HSL</strong>, where a
          palette hex needs to become an HSL custom property; paste the hex,
          copy the HSL row, done.
        </p>
      </section>

      {/* 3 */}
      <section id="alpha" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="w-6 h-6 text-orange-500 shrink-0" />
          3. Transparency: 8-Digit HEX, RGBA and HSLA
        </h3>
        <p>
          The most frequent confusion we see is <strong>rgba not working in
          hex</strong>. A plain six-character hex has nowhere to put opacity.
          Transparency lives as the fourth number of <code>rgba()</code>, or as
          a seventh and eighth character on the end of a hex, defined in the{' '}
          <a
            href="https://www.w3.org/TR/css-color-4/#hex-notation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C CSS Color Module Level 4
          </a>
          . Figma exports and design-token files often use that eight-character form.
        </p>
        <p>
          The tool reads both. Paste <code>#F97316CC</code> and the RGBA row
          gives you the decimal opacity, the practical answer to{' '}
          <strong>8 digit hex to rgba</strong>. An <code>hsla()</code> value
          carries its opacity into the RGBA row the same way.
        </p>
        <p>
          One honest limit for anyone searching for an{' '}
          <strong>hsl to hex converter with alpha</strong>: the HEX row is
          always the six-character form. Opacity survives in the RGBA row but is
          not written back out as an eight-character hex, and the contrast
          check in section 5 ignores it. If your destination only takes a hex,
          copy the RGBA and set the opacity separately where you paste it.
        </p>
      </section>

      {/* 4 */}
      <section id="tints-and-shades" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Make Lighter and Darker Versions of a Hex Colour
        </h3>
        <p>
          Beneath the converted values sits a strip of nine swatches: four
          tints, your colour in the middle, four shades. Tints are mixed toward
          white in even steps, shades toward black, and hovering shows the hex.
          It is the quickest way to{' '}
          <strong>make lighter and darker versions of a hex color</strong> that
          stay recognisably the same colour.
        </p>
        <p>
          The everyday use is buttons. A developer who wants the{' '}
          <strong>hover color darker than the button color</strong>, and the
          pressed state darker again, takes the first and second shade and knows
          they belong to the same family. The tints do the same job for
          backgrounds, badges and highlights built from one brand colour.
        </p>
        <p>
          What makes this a{' '}
          <strong>tint and shade generator with contrast checker</strong> built
          in, rather than a stand-alone strip, is that each swatch is a button.
          Click one and it becomes the new base colour: the five formats
          recompute, the strip re-centres, and the contrast verdict updates.
          Section 6 puts that to work. The steps are fixed at four each way and
          the strip does not build complementary or triadic harmonies, so treat
          it as a lightness ladder rather than a palette generator.
        </p>
      </section>

      {/* 5 */}
      <section id="contrast" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Check Colour Contrast for Accessibility
        </h3>
        <p>
          If you have ever thought <strong>my text colour is hard to read on
          the background</strong>, or an audit report says the site fails a
          contrast check, the number you need is the contrast ratio. It compares
          how bright the text is against the background and writes the answer as
          something like 6.37 : 1; a bigger first number means easier reading.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              What is a 4.5:1 contrast ratio?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The minimum for ordinary body text under WCAG 2.1 Level AA,
              success criterion 1.4.3. Below it, people with moderate low vision
              and anyone reading a dim phone in daylight start losing letters.
              It is the threshold most audits and legal requirements point at.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              AA vs AAA: what is the difference?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              AAA raises the bar to 7:1 for normal text under criterion 1.4.6,
              the enhanced level for readers with more significant vision loss.
              AA is what most projects must meet; AAA is what you aim for on
              long-form reading and public-sector content when the brand allows.
            </p>
          </div>
        </div>
        <p>
          The definitions come from the{' '}
          <a
            href="https://www.w3.org/TR/WCAG21/#contrast-minimum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C Web Content Accessibility Guidelines 2.1
          </a>
          , and the tool uses the formula that specification describes. To{' '}
          <strong>check color contrast for accessibility</strong>: enter the
          text colour in the main field, choose the background with the small
          swatch picker in the contrast panel, and read the ratio and the two
          PASS/FAIL cards. A preview box renders a heading and a line of body
          text in your colours so you can judge it by eye as well.
        </p>
        <p>
          Two things so the result is used correctly. First, this is a{' '}
          <strong>WCAG contrast checker free</strong> of any paywall, and it
          covers normal-sized text at AA and AAA. The lower thresholds WCAG
          allows for large headings, and the separate rule for icons and form
          borders, are not reported, so a FAIL here for a large bold heading may
          still be acceptable under the large-text rule. Second, the background
          is set with the picker only; there is no second paste-in field. If you
          wanted a <strong>color contrast ratio calculator</strong> for two hex
          codes, paste the text hex, pick the background, and the ratio reads
          the same.
        </p>
      </section>

      {/* 6 */}
      <section id="find-a-passing-shade" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Contrast className="w-6 h-6 text-orange-500 shrink-0" />
          6. Which Shade of Your Colour Passes WCAG? A Worked Example
        </h3>
        <p>
          This is the job the tool was built for, and why the converter, the
          swatches and the checker share one screen. The situation is familiar:
          a <strong>brand colour fails contrast on a dark background</strong>,
          or a light one, and you may not change the brand. What you may do is
          use a slightly lighter or darker version. The question is which one.
        </p>
        <p>
          Take the colours the tool opens with, which are our own: orange{' '}
          <code>#F97316</code> as text on dark navy <code>#0F172A</code>. If you
          searched for <strong>orange on dark blue contrast ratio</strong>, the
          answer for that pair is 6.37 : 1. That passes AA, so body text in this
          orange on that navy is acceptable. It fails AAA, which needs 7:1.
          Suppose this is a long reading page and you want the enhanced level.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Read the verdict', 'With the defaults loaded, the panel shows 6.37 : 1, AA PASS, AAA FAIL. The preview box shows the orange heading on navy so you can see what 6.37 looks like.'],
            ['Click the next tint', 'The swatch immediately left of centre is the first tint, #FA8F45. Click it. It becomes the base colour, the five rows update, and the ratio jumps to 7.72 : 1 — AA PASS, AAA PASS.'],
            ['Copy the codes', 'The HEX row now reads #FA8F45 and the HSL, RGB and CMYK rows describe the same colour. Copy whichever your stylesheet or design token needs. Every code you copy is one that has already passed.'],
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
          The loop runs the other way too. Flip the background to white and the
          original orange drops to 2.8 : 1, failing AA outright; that is the
          orange-on-white problem behind a great many{' '}
          <strong>why does my website fail accessibility contrast</strong>{' '}
          searches. Click down through the shades instead, and each click tells
          you whether you have gone dark enough. Because the strip re-centres on
          whatever you click, you can keep stepping until the card turns green.
        </p>
        <p>
          The tool does not pick the passing shade for you; you click and read,
          because the nearest passing value is not always the one that looks
          right beside the rest of the palette. If the starting colour is in a
          logo or screenshot, the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          reads a hex from an image, and you can paste it straight in here.
        </p>
      </section>

      {/* 7 */}
      <section id="cmyk-for-print" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500 shrink-0" />
          7. CMYK for Print: What the Numbers Mean and What They Do Not
        </h3>
        <p>
          When you need to <strong>convert RGB to CMYK for printing</strong>, or
          want a <strong>hex to CMYK converter free</strong> of charge because a
          print shop asked for ink percentages, the CMYK row gives you them
          without any design software. Our default orange reads{' '}
          <code>cmyk(0%, 54%, 91%, 2%)</code>.
        </p>
        <p>
          Read those numbers for what they are: the standard mathematical
          conversion from screen values to ink percentages. It is a good
          estimate for a brief or a quote request. It is not a colour-managed
          proof. Presses use ICC profiles for specific paper stocks and inks,
          and the percentages a production tool produces under a profile can
          differ from these. Bright, saturated screen colours in particular sit
          outside what ink can reach, and no formula fixes that. For a
          commercial press, hand the print shop the hex as well and expect the
          values to be adjusted.
        </p>
        <p>
          If the print job also involves artwork, the{' '}
          <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            vector converter
          </Link>{' '}
          handles SVG, EPS and PDF logo files.
        </p>
      </section>

      {/* 8 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          8. Why Cortexis Is the Best Free Colour Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Three jobs on one colour', 'Conversion, tints and shades, and a WCAG check share one screen and one input, so a click on a swatch updates everything at once.'],
            ['Colour converter with no signup', 'No account, no email, no Pro tier holding the contrast check or the swatches behind a subscription. Every feature is the free version.'],
            ['Five formats from one paste', 'HEX, RGB, RGBA, HSL and CMYK together, each with its own copy button, from hex, rgb(), rgba(), hsl() or hsla() as input.'],
            ['Transparency is understood', 'Eight-character hex and rgba() opacity are read and carried into the RGBA row, which many single-purpose converters drop.'],
            ['A real WCAG 2.1 verdict', 'The ratio uses the formula from the W3C specification and reports AA and AAA for normal text, with a preview so you can judge by eye as well.'],
            ['Nothing is kept', 'Colour values are not stored on our servers, not retained after your session, and never used for analytics or training. Paste an unreleased brand colour with a clear conscience.'],
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
          If you searched for a <strong>color converter no signup</strong>{' '}
          could gate, this is it, and it sits alongside a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free developer and design tools
          </Link>{' '}
          on the same terms. The{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>{' '}
          tidies the design-token file you are pasting into, and the{' '}
          <Link to="/tools/base64-encoder-decoder" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Base64 encoder
          </Link>{' '}
          handles the inline SVG icons that sit beside the colours.
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
              'Is this color code converter free, and do I need to sign up?',
              'It is free and there is no account, email or trial. The five-format conversion, the tints and shades, and the WCAG contrast check are all available with nothing held back for a paid tier.',
            ],
            [
              'What is a 4.5:1 contrast ratio and is it enough?',
              'It is the minimum contrast WCAG 2.1 requires between ordinary body text and its background to meet Level AA, the level most audits and regulations point at. The enhanced AAA level requires 7:1. The tool shows both cards, so you can see which level a pair meets.',
            ],
            [
              'Which shade of my color passes WCAG without changing the brand?',
              'Enter your brand colour, set the background with the picker in the contrast panel, and click through the tints or shades in the swatch strip. Each click makes that swatch the active colour and updates the ratio and the AA and AAA cards, so you stop at the first one that turns green and copy its codes.',
            ],
            [
              'Why does rgba not work in a hex code?',
              'A six-character hex has no room for opacity. Transparency belongs in the fourth value of rgba() or in an eight-character hex like #F97316CC. This tool reads both and shows the opacity in the RGBA row, but its HEX row is always the six-character form, so copy the RGBA when you need the transparency kept.',
            ],
            [
              'Can I use the CMYK value for a professional print job?',
              'Use it as an estimate. The CMYK row is the standard mathematical conversion, not a colour-managed one, so a print shop working under an ICC profile may land on different percentages. Give them the hex as well and expect adjustment for the press.',
            ],
            [
              'Does the contrast checker cover large text and buttons?',
              'It reports AA and AAA for normal-sized text only. WCAG allows a lower ratio for large headings and has a separate rule for icons and form borders, and neither is shown here, so check the criterion that applies to your element.',
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
          Working on the rest of the design? The{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          pulls a hex out of any image,{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>{' '}
          shrinks the graphics those colours sit behind,{' '}
          <Link to="/tools/font-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            font converter
          </Link>{' '}
          gets the typeface into web formats, and the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR generator
          </Link>{' '}
          gives you a code in the same brand colour. If you would rather
          understand colour models and contrast from the ground up, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers RGB, CMYK and accessible palettes from the first lesson.
        </p>
      </div>
    </article>
  );
}
