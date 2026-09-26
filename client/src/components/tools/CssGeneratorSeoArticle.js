import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Box,
  Check,
  Droplets,
  HelpCircle,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Square,
  Type,
} from 'lucide-react';

/**
 * Long-form guide rendered under the CSS Generator tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Five effects live on one page, so each gets its own section that
 *    explains why the output looks the way it does (layered shadows, the
 *    solid gradient fallback, the 8-value blob radius), not only the syntax.
 *
 * 2. The glass section is a troubleshooting section: the reasons a frosted
 *    blur fails to show are what people actually search for.
 *
 * 3. Limits are stated exactly (one shadow, three stops, px radius, CSS text
 *    only) and colour work is routed to the colour tools.
 */
export default function CssGeneratorSeoArticle() {
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
        The Free <span className="text-orange-600 dark:text-orange-400">CSS Generator</span> for Box Shadows, Glassmorphism, Gradients, Border Radius and Text Shadows
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        A card that needs a softer shadow, a panel that should look like frosted glass, a heading that wants a glow: each is a few lines of CSS, and each is quicker to get right with a slider than by guessing numbers. This <strong>CSS generator</strong> puts five on one page: a <strong>box shadow generator</strong>,
        a <strong>glassmorphism generator</strong>, a{' '}
        <strong>CSS gradient generator</strong>, a{' '}
        <strong>border radius generator</strong> and a{' '}
        <strong>text shadow generator</strong>. This guide explains what each one writes, how to fix effects that refuse to show up, and &mdash; just as plainly &mdash; what the tool does not do.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/css-generator.webp"
            alt="A ceramic ring and a blank card on a wooden tray, their soft shadows falling across linen"
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
              Five effects, one page. Drag a slider, watch the preview, copy
              the rule or save it as a .css file.
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
            ['#what-it-does', '1. What a CSS Generator Does, and What This One Leaves Out'],
            ['#how-to-use', '2. How to Use the CSS Generator in Four Steps'],
            ['#box-shadow', '3. Box Shadow Generator: Layered, Inset and Never Harsh'],
            ['#glassmorphism', '4. Glassmorphism Generator and Fixing backdrop-filter'],
            ['#gradient', '5. CSS Gradient Generator: Linear, Radial, Conic'],
            ['#radius-text', '6. Border Radius Generator and Text Shadow Generator'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free CSS Generator'],
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
      <section id="what-it-does" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a CSS Generator Does, and What This One Leaves Out
        </h3>
        <p>
          A <strong>CSS generator</strong> is a visual editor for properties that are tedious to write by hand: several numbers in a fixed order, colours with transparency, effects you cannot judge until you see them. You move controls, the preview updates, and the finished declaration is ready to paste. It is the right tool when you know the look you want but not the numbers that produce it.
        </p>
        <p>
          This page is a{' '}
          <strong>CSS visual generator tool</strong> with five tabs &mdash;
          Box shadow, Glassmorphism, Gradient, Border radius and Text shadow
          &mdash; because those are the effects a typical card or heading needs, and styling one should not mean visiting four sites.
        </p>
        <p>What it does not do:</p>
        <ul className="space-y-2">
          <li>
            <strong>One shadow per tab.</strong> Layering splits one shadow into softer copies, but there is no free list of unrelated shadows.
          </li>
          <li>
            <strong>Up to three gradient colours.</strong> No repeating
            gradients, and radial gradients are always a circle at the centre.
          </li>
          <li>
            <strong>CSS text only.</strong> No image export, and no Tailwind, SCSS or React style objects. Animations, transitions, keyframes, clip-path, <code>filter: drop-shadow()</code> for transparent images, and formatting or minifying an existing stylesheet are outside it too.
          </li>
          <li>
            <strong>No neumorphism or liquid-glass presets.</strong> The five tabs cover the effects listed above; soft-UI styles have to be built by hand from two opposite box shadows.
          </li>
          <li>
            <strong>No colour conversion.</strong> For HEX, RGB and HSL
            conversion use the{' '}
            <Link to="/tools/colour-format-utilities" className="text-orange-600 font-semibold underline hover:text-orange-700">
              colour format utilities
            </Link>
            , and to lift a colour from an image, the{' '}
            <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
              colour picker
            </Link>
            .
          </li>
        </ul>
      </section>

      {/* 2 */}
      <section id="how-to-use" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Square className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Use the CSS Generator in Four Steps
        </h3>
        <p>
          Every tab works the same way, with no account or sign-up.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Pick a tab.</strong> Choose the effect you are building.
            Each opens with sensible defaults.
          </li>
          <li>
            <strong>Adjust the settings.</strong> Every slider, colour picker and checkbox updates the preview and the code instantly.
          </li>
          <li>
            <strong>Check the CSS box.</strong> The output is plain, readable CSS, with colours written as <code>rgba()</code> wherever opacity matters.
          </li>
          <li>
            <strong>Copy or download.</strong> <em>Copy</em> puts the rule on
            your clipboard and confirms with &ldquo;Copied&rdquo;.{' '}
            <em>Download</em> saves it as a small .css file named after the
            tab: shadow.css, glass.css, gradient.css, radius.css or
            textShadow.css.
          </li>
        </ol>
        <p>
          If you searched <strong>download CSS file from generator</strong>, that button is the answer: the saved file holds the same declarations as the box, ready to drop into a project.
        </p>
      </section>

      {/* 3 */}
      <section id="box-shadow" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Box className="w-6 h-6 text-orange-500 shrink-0" />
          3. Box Shadow Generator: Layered, Inset and Never Harsh
        </h3>
        <p>
          If you are learning <strong>how to add box shadow in CSS</strong>,
          the property takes its values in a fixed order: horizontal offset,
          vertical offset, blur, spread, then colour, with the optional word{' '}
          <code>inset</code> in front. The tab maps one control to each:{' '}
          <em>Offset X</em> and <em>Offset Y</em>, <em>Blur</em>,{' '}
          <em>Spread</em>, <em>Colour</em> with a separate <em>Opacity</em>{' '}
          slider, and an <em>Inset</em> checkbox. The syntax is defined in the W3C{' '}
          <a
            href="https://www.w3.org/TR/css-backgrounds-3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            CSS Backgrounds and Borders specification
          </a>
          , which covers <code>border-radius</code> as well.
        </p>
        <p>
          When a <strong>box shadow looks harsh or ugly</strong>, the cause is usually one dark shadow doing the job real light spreads across several softer ones. The{' '}
          <em>Layering</em> dropdown fixes that. Choose &ldquo;Two layers
          (soft)&rdquo; or &ldquo;Three layers (smooth)&rdquo; and your one
          shadow becomes a stack: each layer takes a growing share of the
          offset and blur, and the opacity is divided between them. A crisp close shadow plus a wide faint one is <strong>how to make a smooth
          layered box shadow</strong> without juggling three lines by hand.
        </p>
        <p>
          Tick <em>Inset</em> and the same tab becomes an{' '}
          <strong>inset box shadow generator</strong>, drawing the shadow
          inside the edge. That is the look of a sunken text field or a pressed button. And if you wanted a{' '}
          <strong>CSS box shadow generator online free</strong> of sign-ups and limits, this tab is it.
        </p>
      </section>

      {/* 4 */}
      <section id="glassmorphism" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="w-6 h-6 text-orange-500 shrink-0" />
          4. Glassmorphism Generator and Fixing backdrop-filter
        </h3>
        <p>
          <strong>How to make a glassmorphism effect in CSS</strong> comes down to a semi-transparent tint, a blur on whatever sits behind the element, a faint border and rounded corners. This <strong>glassmorphism CSS generator</strong> sets all
          four with <em>Backdrop blur</em>, <em>Tint colour</em>,{' '}
          <em>Tint opacity</em>, <em>Border opacity</em>, <em>Radius</em> and{' '}
          <em>Saturation</em>, and adds a soft drop shadow. The preview sits over a fixed colourful gradient so you can see the frosting.
        </p>
        <p>
          Two details are fixed rather than adjustable. The border is always a one-pixel white line, so <em>Border opacity</em> controls how bright that edge looks, not its colour. The drop shadow is the same soft navy shadow every time; if you want a different one, build it in the Box shadow tab and swap the <code>box-shadow</code> line. You also cannot load your own photo behind the preview, so test the final look on your real page, where the content behind the panel is what the blur works on.
        </p>
        <p>
          It is a quick way to get <strong>glassmorphism card CSS for dashboard</strong> panels, modals and floating navigation bars.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed space-y-2">
            <p>
              <strong>backdrop-filter not working?</strong> Check these in order.
            </p>
            <p>
              <strong>Nothing behind it.</strong> The blur only affects what is behind the element; over a flat white page, glass looks like a white box.
            </p>
            <p>
              <strong>The tint is too opaque.</strong> A high tint opacity hides the blurred content. Lower it.
            </p>
            <p>
              <strong>An ancestor is in the way.</strong> A parent with a filter, opacity below 1 or its own backdrop-filter can limit what the child blurs. Move the element out, or remove the effect from the parent.
            </p>
            <p>
              <strong>Safari.</strong> For the common{' '}
              <strong>Safari backdrop-filter blur not working</strong> report,
              older Safari versions only recognise the prefixed property. The
              output includes both <code>backdrop-filter</code> and{' '}
              <code>-webkit-backdrop-filter</code>, so keep both lines.
            </p>
          </div>
        </div>
      </section>

      {/* 5 */}
      <section id="gradient" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          5. CSS Gradient Generator: Linear, Radial, Conic
        </h3>
        <p>
          <strong>How to create a gradient background in CSS</strong>: set{' '}
          <code>background</code> to a gradient function. The <em>Type</em> dropdown chooses among the
          three functions defined in the W3C{' '}
          <a
            href="https://www.w3.org/TR/css-images-3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            CSS Images specification
          </a>{' '}
          and its successor draft:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Linear</strong> &mdash; colours blend along a line turned by the <em>Angle</em> slider, 0 to 360 degrees.
          </li>
          <li>
            <strong>Radial</strong> &mdash; a circle spreading from the centre; shape and position are fixed, and the Angle slider has no effect here.
          </li>
          <li>
            <strong>Conic</strong> &mdash; colours sweep around the centre like a clock hand. As a <strong>conic gradient generator</strong>,
            the tab uses the same Angle slider to set where the sweep starts.
          </li>
        </ul>
        <p>
          Tick <em>Three colours</em> for a{' '}
          <strong>three colour linear gradient CSS with middle stop</strong>:
          Colour 3 becomes the middle colour and the <em>Middle stop position</em> slider moves it between start and end. Three stops is the maximum.
        </p>
        <p>
          The first line of every output is a solid <code>background</code>{' '}
          in Colour 1, followed by the gradient. That is the standard{' '}
          <strong>CSS gradient fallback</strong>: any older renderer that cannot read the gradient line skips it and keeps the solid colour. This tool writes CSS only; the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          handles existing images, and the{' '}
          <Link to="/tools/svg-optimizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SVG optimizer
          </Link>{' '}
          tidies SVG files you already have.
        </p>
      </section>

      {/* 6 */}
      <section id="radius-text" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-orange-500 shrink-0" />
          6. Border Radius Generator and Text Shadow Generator
        </h3>
        <p>
          <strong>How to make rounded corners in CSS</strong>: give{' '}
          <code>border-radius</code> one value for all four corners, or four
          values in the order top left, top right, bottom right, bottom left.
          The <strong>border radius generator</strong> has a slider for each
          corner, 0 to 100 pixels, with <em>Link all corners</em> on by
          default. Untick it to shape each corner separately. Normal mode writes pixels only.
        </p>
        <p>
          Tick <em>Organic blob (8-value syntax)</em> and the tab becomes a{' '}
          <strong>CSS blob shape generator</strong>. The sliders switch to
          percentages and the output uses the slash form of{' '}
          <code>border-radius</code>, with four horizontal radii before the
          slash and four vertical ones after it. Each corner becomes a different ellipse, giving a soft, irregular shape; unlink the corners for the most organic results.
        </p>
        <p>
          The <strong>text shadow generator</strong> previews your own <em>Sample text</em> with a <em>Preset</em>.{' '}
          <em>Custom</em> gives you offset, blur, colour and opacity sliders.
          The other four ignore the offset and blur sliders and write a
          ready-made stack:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Neon glow</strong> &mdash; widening halos in your colour, the classic{' '}
            <strong>neon text effect CSS generator</strong> result.
          </li>
          <li>
            <strong>Emboss</strong> &mdash; a light edge and a dark edge, the usual{' '}
            <strong>emboss text effect CSS</strong>. Its two colours are fixed, so the Colour picker does not change it.
          </li>
          <li>
            <strong>Long shadow</strong> &mdash; twelve stepped, fading layers, the flat-design{' '}
            <strong>long shadow text CSS</strong>.
          </li>
          <li>
            <strong>Outline</strong> &mdash; four one-pixel shadows, producing{' '}
            <strong>outline text CSS with text-shadow</strong> in your chosen colour.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free CSS Generator
        </h3>
        <p>
          Here is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Five effects on one page', 'Box shadow, glassmorphism, gradient, border radius and text shadow behind one tab row, so a whole card is styled in one place.'],
            ['Output that explains itself', 'Plain, readable CSS with rgba() colours, the prefixed backdrop-filter line for Safari and a solid fallback before every gradient.'],
            ['Shadows that look real', 'Layering turns one heavy shadow into two or three softer ones, the fix for a cheap-looking shadow.'],
            ['Genuinely free, no account', 'No sign-up and no usage counter. Copy the rule or download a .css file.'],
            ['Your work stays private', 'Your settings and the CSS you create are never stored on our servers and nothing is retained after your session.'],
            ['Nothing is used for training', 'What you design here is never fed into training data. Your styles stay yours.'],
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
            free developer and design tools
          </Link>{' '}
          built on the same terms. Turning a finished design into a site
          icon? The{' '}
          <Link to="/tools/favicon-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            favicon generator
          </Link>{' '}
          picks up where this page stops.
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
              'Is this CSS generator free to use?',
              'Yes. All five generators are free, with no account and no limit on how many rules you create. Copy the CSS or download it as a .css file as often as you like.',
            ],
            [
              'Why does my box shadow look harsh, and how do I soften it?',
              'Lower the opacity, raise the blur, and set Layering to "Two layers (soft)" or "Three layers (smooth)". The tab splits your shadow into a crisp close layer and softer outer ones.',
            ],
            [
              'Why is my backdrop-filter blur not showing?',
              'There may be nothing behind the element to blur, the tint may be too opaque, or a parent with its own filter, opacity or backdrop-filter may be limiting it. For Safari, keep the -webkit-backdrop-filter line the generator includes.',
            ],
            [
              'Can I add more than three colours to a gradient?',
              'No. The gradient tab supports two or three colours, with a movable middle stop when you choose three. Repeating gradients and custom radial shapes are not available; extra stops can be added to the copied CSS by hand.',
            ],
            [
              'Can I export the gradient or shape as an image?',
              'No, the tool writes CSS text only, as a copied rule or a downloaded .css file. To convert an image you already have between formats, use the image converter, and to tidy an SVG file, use the SVG optimizer.',
            ],
            [
              'Does it output Tailwind classes or SCSS?',
              'No. The output is standard CSS only, with no Tailwind classes, SCSS variables or React style objects. The plain CSS can be adapted to any of them.',
            ],
            [
              'Can I build several different box shadows in one rule?',
              'Only through layering. The shadow tab turns one shadow into two or three softer copies, but cannot combine unrelated shadows with different colours. Generate each one and join them with commas in a single box-shadow declaration.',
            ],
            [
              'Can I preview the glass effect over my own background image?',
              'No. The glass preview always sits over the same colourful gradient. Copy the CSS and check it on your own page, where the real content behind the panel is what gets blurred.',
            ],
            [
              'Does it generate neumorphism or animation CSS?',
              'No. There are no neumorphism presets and no animation, transition or keyframe output. For a soft-UI look, pair a light and a dark box shadow by hand using two runs of the Box shadow tab.',
            ],
            [
              'How do I convert colours to HEX, RGB or HSL for these settings?',
              'The output writes HEX, or rgba() where opacity is involved. For converting between HEX, RGB and HSL, use the colour format utilities, and to take an exact colour from an image, use the colour picker tool.',
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
          On to the rest of the build? Tidy an API response with the{' '}
          <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            JSON formatter
          </Link>
          , test a pattern with the{' '}
          <Link to="/tools/regex-tester" className="text-orange-600 font-semibold underline hover:text-orange-700">
            regex tester
          </Link>
          , or capture the finished page with the{' '}
          <Link to="/tools/website-png-screenshot" className="text-orange-600 font-semibold underline hover:text-orange-700">
            website screenshot tool
          </Link>
          . To write this CSS from memory, our free{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers styling from the ground up, and the{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          teaches the colour behind a good-looking card.
        </p>
      </div>
    </article>
  );
}
