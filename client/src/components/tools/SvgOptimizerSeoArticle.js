import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Check,
  Code,
  Eraser,
  Eye,
  FileCode,
  Gauge,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the SVG Optimizer tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. Every checkbox is explained in plain English against the sample export
 *    the tool loads with, because the usual toggle names mean nothing to a
 *    designer.
 *
 * 2. The two ways an optimiser can hurt you are stated plainly: low precision
 *    distorts curves and cut lines, and removing <title>/<desc> removes the
 *    graphic's accessible name.
 *
 * 3. It is a focused cleaner, not a path rewriter. What it does not do is
 *    listed, with the sibling tool for each job where one exists.
 */
export default function SvgOptimizerSeoArticle() {
  const linkClass = 'text-orange-600 font-semibold underline hover:text-orange-700';

  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 10 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to Use an <span className="text-orange-600 dark:text-orange-400">SVG Optimizer</span>: Strip Editor Bloat, Round the Numbers, and Keep the Drawing Intact
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You exported a simple checkmark icon and found a wall of namespaces, metadata and coordinates like 60.000000. An <strong>SVG optimizer</strong> removes everything the
        drawing does not need, so the file gets smaller and the code becomes
        something you can read. This guide shows how to{' '}
        <strong>optimize SVG</strong> files for free, what each option really
        removes, how far to round the numbers before curves start to wobble,
        and when to keep the parts an automatic cleaner would throw away.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/svg-optimizer.webp"
            alt="SVG optimizer online free - minify SVG code, remove Inkscape and Illustrator metadata and compare the before and after preview of an icon"
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
              Same icon, less code. The Before and After previews sit side by
              side so you can confirm nothing changed but the size.
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
            ['#why-so-big', '1. Why Is My SVG File So Big?'],
            ['#how-to-optimize', '2. How to Optimize SVG Online Free in Four Steps'],
            ['#what-each-option-does', '3. What the SVG Cleaner Removes, Option by Option'],
            ['#precision', '4. Decimal Precision and Accessible Names: The Two Trade-offs'],
            ['#workflows', '5. Icons, Inline HTML, Logos and Cutting Machines'],
            ['#limits', '6. What This SVG Minifier Does Not Do'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free SVG Compressor'],
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
      <section id="why-so-big" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Is My SVG File So Big?
        </h3>
        <p>
          <strong>SVG file too large</strong> for a shape that looks trivial? The drawing is rarely the cause. Design software writes the file for itself first, and the weight is in everything around the drawing:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Editor bookkeeping.</strong> If your <strong>Inkscape SVG
            has extra code</strong>, it is usually a <code>sodipodi:namedview</code>{' '}
            block, <code>inkscape:label</code> attributes on every layer and a
            string of namespace declarations. No website needs any of it.
          </li>
          <li>
            <strong>Illustrator SVG export bloated?</strong> It typically carries a generator comment,{' '}
            <code>data-name</code> on groups, <code>enable-background</code> and{' '}
            <code>xml:space=&quot;preserve&quot;</code>. Figma and Sketch add their own versions.
          </li>
          <li>
            <strong>Metadata.</strong> An RDF block, an XML declaration and a DOCTYPE.
          </li>
          <li>
            <strong>Over-precise numbers.</strong> 48.123456 where 48.123 draws the same thing.
          </li>
          <li>
            <strong>Inline styles and defaults.</strong> Values such as{' '}
            <code>fill-opacity:1</code> that are already the default.
          </li>
        </ul>
        <p>
          That is the short answer to <strong>why is my SVG file so big</strong>.
          The tool above loads with a small Inkscape icon that has most of these problems; press Optimise on it to watch them disappear.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-optimize" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Optimize SVG Online Free in Four Steps
        </h3>
        <p>
          Here is <strong>how to reduce SVG file size</strong> with the{' '}
          <strong>SVG optimizer online free</strong> at the top of this page.
          No account, no daily limit.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your SVG.</strong> Drop a <code>.svg</code> file onto
            the &ldquo;Drop an SVG file&rdquo; panel, or paste the markup
            straight into the text box. Pasting is the quickest way to{' '}
            <strong>minify SVG online</strong>.
          </li>
          <li>
            <strong>Check the options.</strong> Eight cleaning options are
            ticked by default and suit most files. Decimal precision starts at
            3. Tick <em>Pretty print output</em> if you want readable,
            indented code instead of one compact line.
          </li>
          <li>
            <strong>Press Optimise.</strong> You get the size before, the size
            after and the percentage saved, next to Before and After previews
            of the drawing.
          </li>
          <li>
            <strong>Compare, then copy or download.</strong> If the After image
            matches the Before image, use <em>Copy</em> to paste the code into
            your project, or <em>Download</em> to{' '}
            <strong>compress SVG online</strong> into a new file named{' '}
            <code>yourfile.min.svg</code>. Your original is not touched.
          </li>
        </ol>
        <p>
          A quick look at the two previews beats finding a broken icon after
          it has gone live. If the size barely moves, the file was already
          lean; the savings come from editor data, metadata and long
          decimals, so a hand-written SVG has less to lose than a fresh
          export.
        </p>
      </section>

      {/* 3 */}
      <section id="what-each-option-does" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eraser className="w-6 h-6 text-orange-500 shrink-0" />
          3. What the SVG Cleaner Removes, Option by Option
        </h3>
        <p>
          Here is what this <strong>SVG cleaner</strong> does with each option.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Remove unused IDs.</strong> Editors give every shape an ID
            such as <code>path1</code>. This option drops them, but keeps any
            ID that something else points to: a gradient or clip path
            referenced with <code>url(#...)</code>, a <code>&lt;use&gt;</code>{' '}
            link, or a selector inside a <code>&lt;style&gt;</code> block. That
            is the safe way to <strong>remove unused IDs from SVG</strong>{' '}
            code.
          </li>
          <li>
            <strong>Remove comments.</strong> Generator notes and other comments.
          </li>
          <li>
            <strong>Remove &lt;metadata&gt;, &lt;title&gt;, &lt;desc&gt;.</strong>{' '}
            This is <strong>how to remove metadata from SVG</strong> files in
            one click. It also removes titles and descriptions, which is
            covered in the next section.
          </li>
          <li>
            <strong>Remove editor data.</strong> Elements and attributes in the
            Inkscape, Sodipodi, Illustrator, Adobe, Sketch, Figma, Serif, Krita
            and RDF namespaces, plus <code>enable-background</code>,{' '}
            <code>data-name</code> and <code>xml:space=&quot;preserve&quot;</code>{' '}
            outside text. Use it to <strong>remove Inkscape metadata from
            SVG</strong> exports and to <strong>optimize Figma SVG
            export</strong> files.
          </li>
          <li>
            <strong>Remove default attribute values.</strong> Values that
            change nothing, such as <code>fill-opacity=&quot;1&quot;</code>,{' '}
            <code>stroke-width=&quot;1&quot;</code>,{' '}
            <code>stroke-miterlimit=&quot;4&quot;</code> or{' '}
            <code>display=&quot;inline&quot;</code>.
          </li>
          <li>
            <strong>Collapse empty and attribute-less groups.</strong> Removes empty groups and unwraps groups with no attributes.
          </li>
          <li>
            <strong>Round numbers.</strong> Rounds path data, points,
            transforms, the viewBox and sizes to your chosen precision, tidies
            the spacing inside path data and drops transforms that do nothing.
          </li>
          <li>
            <strong>Convert style=&quot;&quot; to attributes.</strong> This is{' '}
            <strong>how to remove inline styles from SVG</strong> shapes:{' '}
            <code>style=&quot;fill:#2e6bff&quot;</code> becomes{' '}
            <code>fill=&quot;#2e6bff&quot;</code>, which your own stylesheet
            can override. A style is converted only when every declaration is a presentation property such as fill or stroke; anything else stays as written.
          </li>
        </ul>
        <p>
          A few things happen every time: the XML declaration, DOCTYPE and the
          redundant <code>version</code> attribute go, whitespace between tags
          is collapsed, and six-digit hex colours written as attributes are
          lower-cased or shortened (<code>#FFFFFF</code> becomes{' '}
          <code>#fff</code>). Colours inside a <code>style</code> value or a{' '}
          <code>&lt;style&gt;</code> block are left as written. And if your goal is{' '}
          <strong>how to clean up SVG code</strong> for hand editing rather
          than for size, tick <em>Pretty print output</em>. It turns the tool
          into an <strong>SVG pretty print formatter</strong> that indents each
          element by two spaces, so a minified file becomes readable again.
        </p>
      </section>

      {/* 4 */}
      <section id="precision" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          4. Decimal Precision and Accessible Names: The Two Trade-offs
        </h3>
        <p>
          Two settings can change the result, and they are why people search{' '}
          <strong>SVG looks different after optimizing</strong>.
        </p>
        <p>
          <strong>Precision.</strong> To <strong>reduce SVG decimal
          precision</strong>, set the Decimal precision field anywhere from 0
          to 8. The default of 3 is a safe choice for icons and logos drawn on
          a small grid. Large illustrations can often go down to 1 or 2. Too low, and curves develop flat spots and joins stop meeting. If the After preview shows any of that, raise the precision
          and press Optimise again.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 not-prose flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Title and description are accessibility, not bloat.</strong>{' '}
            The metadata option is on by default and also removes{' '}
            <code>&lt;title&gt;</code> and <code>&lt;desc&gt;</code>. For an icon that works as a button, a chart, or a logo that is a link&rsquo;s only label, those elements are its accessible name, which screen readers announce, so untick the option for those files. The{' '}
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 dark:text-amber-200 font-semibold underline"
            >
              WCAG guidance on non-text content
            </a>{' '}
            explains when an image needs a text alternative.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section id="workflows" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-500 shrink-0" />
          5. Icons, Inline HTML, Logos and Cutting Machines
        </h3>
        <p>
          <strong>How to optimize SVG for web</strong> use depends on where the
          file ends up. Four situations cover most searches.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Icon sets.</strong> To <strong>optimize SVG icons for website</strong> use, keep every option on at precision 3, run each icon
            through, and confirm the previews. Untick the metadata option for
            any icon that needs a title.
          </li>
          <li>
            <strong>Inline code.</strong> To <strong>minify SVG for inline
            HTML</strong>, leave pretty print off and use Copy. For a React
            component, note that the output is still SVG markup, not JSX:
            attributes such as <code>stroke-width</code> and{' '}
            <code>class</code> keep their SVG spelling, so rename them to{' '}
            <code>strokeWidth</code> and <code>className</code> when you paste
            the code into a component. Converting styles to attributes makes the icon easier to recolour from CSS, and the{' '}
            <Link to="/tools/colour-format-utilities" className={linkClass}>
              colour format utilities
            </Link>{' '}
            help when a brand colour arrives in a different notation.
          </li>
          <li>
            <strong>Website logos.</strong> Clean them here, then embed them as a data
            URI with the{' '}
            <Link to="/tools/base64-encoder-decoder" className={linkClass}>
              Base64 encoder
            </Link>{' '}
            or percent-encode the markup with the{' '}
            <Link to="/tools/url-encoder" className={linkClass}>
              URL encoder
            </Link>
            .
          </li>
          <li>
            <strong>Cutting files.</strong> To <strong>optimize SVG for Cricut or laser cutter</strong> projects, remove the editor data and metadata but
            keep precision at 3 or higher. Cut lines follow the path exactly, so a rounding error can become a notch in vinyl or wood.
          </li>
        </ul>
        <p>
          Working on a client logo under NDA is also covered: your files are
          never stored on our servers and nothing is retained after your
          session.
        </p>
      </section>

      {/* 6 */}
      <section id="limits" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ban className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This SVG Minifier Does Not Do
        </h3>
        <p>
          This <strong>SVG minifier</strong> is a focused cleaner. It does not redraw your artwork:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>No path rewriting.</strong> It does not merge paths,
            convert shapes into paths, simplify curves, minify CSS inside{' '}
            <code>&lt;style&gt;</code> or delete hidden elements. If a file
            is still heavy after cleaning, the weight is usually in the path
            data itself, and redrawing or simplifying it in your design
            software is the fix.
          </li>
          <li>
            <strong>One file at a time.</strong> There is no batch mode for a
            folder of icons, and no other tool on the site does it either, so
            a large icon set means one run per file.
          </li>
          <li>
            <strong>No JSX output.</strong> It returns SVG markup, not a
            ready-made React component; attribute names need renaming by
            hand, as described above.
          </li>
          <li>
            <strong>SVG out only.</strong> For a PNG or JPG version, use the{' '}
            <Link to="/tools/vector-converter" className={linkClass}>
              vector converter
            </Link>
            , which also moves between SVG, EPS, AI and PDF; DXF and DWG
            drawings belong in the{' '}
            <Link to="/tools/cad-converter" className={linkClass}>
              CAD converter
            </Link>
            . For site icons and app icons, the{' '}
            <Link to="/tools/favicon-generator" className={linkClass}>
              favicon generator
            </Link>{' '}
            builds the set for you.
          </li>
          <li>
            <strong>No SVGZ.</strong> It does not produce gzip-compressed{' '}
            <code>.svgz</code> files, and the{' '}
            <Link to="/tools/create-archive" className={linkClass}>
              archive creator
            </Link>{' '}
            makes ZIP or TAR archives rather than SVGZ. Most web servers can
            compress SVG as they send it, so a clean plain SVG is usually all
            a website needs.
          </li>
          <li>
            <strong>Not for photos.</strong> PNG, JPEG and WebP files are
            compressed differently; use the{' '}
            <Link to="/tools/image-compressor" className={linkClass}>
              image compressor
            </Link>
            ,{' '}
            <Link to="/tools/png-compressor" className={linkClass}>
              PNG compressor
            </Link>{' '}
            or{' '}
            <Link to="/tools/jpeg-compressor" className={linkClass}>
              JPEG compressor
            </Link>
            . Tracing a raster image into an SVG is outside this tool, and no
            other tool on the site traces either. Resizing the drawing or
            changing its viewBox is also out of scope; the{' '}
            <Link to="/tools/image-resizer" className={linkClass}>
              image resizer
            </Link>{' '}
            and{' '}
            <Link to="/tools/image-cropper" className={linkClass}>
              image cropper
            </Link>{' '}
            handle raster images, while an SVG&rsquo;s size is best changed
            in the editor that made it.
          </li>
        </ul>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free SVG Compressor
        </h3>
        <p>
          Plenty of pages call themselves an <strong>SVG compressor</strong>; few explain their toggles or show the result first.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Options in plain English', 'Every checkbox says what it removes, and this guide explains each one. No cryptic setting names to decode.'],
            ['Before and After preview', 'Both versions of the drawing appear side by side with the size saved, so you can confirm nothing changed before you copy.'],
            ['Precision you control', 'Choose 0 to 8 decimal places. Keep detail for cutting files, or round harder for large illustrations.'],
            ['References kept safe', 'IDs used by gradients, clip paths, use links and style rules survive, so fills and masks keep working.'],
            ['Your files stay private', 'Files are never stored on our servers, nothing is retained after your session, and nothing is used for training.'],
            ['Free, no account', 'No sign-up, no watermark and no daily counter. Paste, optimise, copy, repeat.'],
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
          <Link to="/tools" className={linkClass}>
            free file tools
          </Link>
          . If you want to know what each element in the output means, the{' '}
          <a
            href="https://www.w3.org/TR/SVG2/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            W3C SVG 2 specification
          </a>{' '}
          is the definitive reference.
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
              'How do I reduce SVG file size for free?',
              'Paste the SVG code or drop the file into the tool at the top of this page, leave the default options on and press Optimise. Compare the previews, then copy the result or download it as a .min.svg file.',
            ],
            [
              'Will optimizing change how my SVG looks?',
              'It should not. The one setting that can change the shape is decimal precision: set it too low and curves or thin details can shift. Compare the Before and After previews, and raise the precision if anything moved.',
            ],
            [
              'What decimal precision should I use?',
              'The default of 3 suits icons, logos and most web graphics. Large illustrations can often use 1 or 2 with no visible change. For files going to a cutting machine, keep 3 or higher, because the machine follows the path exactly.',
            ],
            [
              'How do I remove Inkscape or Illustrator data from an SVG?',
              'Keep the Remove editor data option ticked. It strips Inkscape, Sodipodi, Illustrator, Adobe, Sketch, Figma and similar namespaced elements and attributes, plus data-name, enable-background and xml:space="preserve" outside text.',
            ],
            [
              'Does it remove the title and description from my SVG?',
              'Yes, by default, because the metadata option covers title and desc too. Those elements give the graphic an accessible name that screen readers announce, so untick the option for icons, charts or logos that need a label.',
            ],
            [
              'Can I make minified SVG readable again?',
              'Yes. Paste the minified code, tick Pretty print output and press Optimise. The output is indented two spaces per level.',
            ],
            [
              'Can it convert my SVG to PNG or optimize many files at once?',
              'No. It outputs SVG only and works on one file per run. For PNG, JPG or other formats, use the vector converter; for a set of favicons from one SVG, use the favicon generator.',
            ],
            [
              'Is it safe to optimize a client logo here?',
              'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training.',
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
          <Eye className="w-4 h-4 inline-block text-orange-500 mr-1.5 align-[-2px]" />
          Want to see exactly what changed? Paste the original and optimised
          code into the{' '}
          <Link to="/tools/diff-checker" className={linkClass}>
            diff checker
          </Link>
          . Converting raster images between formats? Use the{' '}
          <Link to="/tools/image-converter" className={linkClass}>
            image converter
          </Link>
          . Styling icons? Try the{' '}
          <Link to="/tools/css-generator" className={linkClass}>
            CSS generator
          </Link>
          . If you want to draw better vectors in the first place, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className={linkClass}>
            graphic design course
          </Link>{' '}
          covers Illustrator, and the{' '}
          <Link to="/learn/full-stack-web" className={linkClass}>
            full-stack web development course
          </Link>{' '}
          shows how to use SVG well in real sites.
        </p>
      </div>
    </article>
  );
}
