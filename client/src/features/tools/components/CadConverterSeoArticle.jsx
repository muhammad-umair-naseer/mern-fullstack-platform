import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  DraftingCompass,
  Eye,
  FileCode,
  HelpCircle,
  Layers,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the CAD converter tool.
 *
 * Written against what CadConverter.js actually does, which is narrower than
 * the phrase "CAD converter" suggests. The parser reads the ENTITIES section of
 * an ASCII DXF and recognises LINE, CIRCLE, ARC, TEXT and MTEXT only. Everything
 * else — polylines, splines, blocks, hatches, dimensions — is skipped, and a
 * file with nothing recognisable falls back to a plain 100-unit square rather
 * than an error. Section 4 says all of this out loud, because "dxf converted
 * to svg missing lines" and "dxf to svg blank output" are exactly the questions
 * the searcher has, and the honest answer is more useful than a vague promise.
 *
 * Outputs are also narrower than their labels. Arcs are drawn in the viewport
 * but not written to the SVG. The PNG is a fixed 800x500 capture of the
 * viewport, grid included. The PDF is that same capture placed on a page — a
 * printable snapshot, not a vector or scale-accurate plot. Section 5 is
 * careful to call them that.
 *
 * Declined outright: DWG in any direction ("cad converter online" and much of
 * "dxf converter" are really DWG queries and get routed to the honest answer),
 * anything INTO a CAD format, 3D formats, layer preservation, high-resolution
 * or custom-size PNG, and batch. "convert dxf to svg for cricut" is answered
 * with a warning rather than a promise, because most cut files are polylines.
 */
export default function CadConverterSeoArticle() {
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
        Free <span className="text-orange-600 dark:text-orange-400">DXF to SVG Converter</span> That Shows You the Drawing First
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Every <strong>dxf to svg converter</strong> on the first page of results
        is a black box: choose a file, wait, download, and only then discover
        that half the drawing is missing. This one works the other way round. It
        renders the drawing in a viewport, counts the lines and arcs it found,
        lets you zoom and switch between a dark and light background, and only
        then writes <strong>SVG</strong>, <strong>PNG</strong>, PDF or a JSON
        entity list. This guide explains how to use it, exactly which parts of a
        DXF survive the trip, and what to do when yours does not.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/cad-converter.webp"
            alt="Two machined aluminium flanges resting on the technical drawings they were made from"
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
              Preview first, convert second: the viewport shows what was read
              from the DXF before anything is written.
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
            ['#what-is-dxf', '1. What a DXF Is and Why It Needs Converting'],
            ['#how-to-convert', '2. How to Convert DXF to SVG Online Free'],
            ['#see-inside', '3. See What Is Inside a DXF Before You Convert'],
            ['#what-survives', '4. What Survives: Entity Support, Explained Honestly'],
            ['#png-pdf-json', '5. DXF to PNG, PDF and JSON: The Other Outputs'],
            ['#not-for', '6. What This Tool Does Not Do (DWG, 3D, Cut Files)'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free DXF to SVG Converter'],
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
      <section id="what-is-dxf" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <DraftingCompass className="w-6 h-6 text-orange-500 shrink-0" />
          1. What a DXF Is and Why It Needs Converting
        </h3>
        <p>
          DXF stands for Drawing Exchange Format. It moves drawings between
          CAD programs, and in its ASCII form it is plain text: a list of
          numbered group codes, each followed by a value. Code 0 starts an
          entity, code 10 is an X coordinate, code 40 a radius, code 62 a colour
          index. Almost nothing outside a CAD program reads it, which is why a{' '}
          <strong>dxf converter</strong> exists at all.
        </p>
        <p>
          The most useful destination is <strong>SVG</strong>, the vector
          format defined by the{' '}
          <a
            href="https://www.w3.org/TR/SVG2/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C SVG 2 specification
          </a>
          , because it is also plain text made of lines, circles and text, and
          opens in web pages and design applications alike. Nothing is
          rasterised, so the result scales without going soft.
        </p>
        <p>
          People searching for a generic <strong>cad converter online</strong>{' '}
          are often disappointed because they are holding a DWG, not a DXF.
          Section 6 covers that distinction.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-convert" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Convert DXF to SVG Online Free (Step-by-Step)
        </h3>
        <p>
          No account, no email address, no daily quota and no watermark. If you
          were looking for <strong>dxf to svg no signup</strong>, or for{' '}
          <strong>dxf to svg without a cad program</strong>, this is the whole
          procedure with the <strong>free dxf to svg converter online</strong>{' '}
          above:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Choose your DXF', 'Click the panel above and pick a .dxf file. The drawing appears in the viewport with a count of the entities found.'],
            ['Check the preview', 'Zoom between 50% and 300%, flip the grid between dark and light, and compare the entity count with what you expect. The background you pick goes into the SVG.'],
            ['Convert and download', 'Leave the format on SVG, press Convert, and download a file named after your drawing. Or switch to PNG, PDF or JSON first.'],
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
          That is all there is to <strong>how to convert dxf to svg</strong>.
          The SVG has a viewBox sized to the drawing&rsquo;s bounding box, a
          background rectangle in your chosen theme, and one element per line,
          circle or text entity, each with its own colour. For a different
          vector container, the{' '}
          <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            vector converter
          </Link>{' '}
          takes it from there.
        </p>
      </section>

      {/* 3 */}
      <section id="see-inside" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-orange-500 shrink-0" />
          3. See What Is Inside a DXF Before You Convert It
        </h3>
        <p>
          Many people who land here have a{' '}
          <strong>dxf file that won&rsquo;t open</strong> when double-clicked,
          or a drawing from a contractor and no CAD licence, and the real
          question is <strong>how to see what is in a dxf file</strong>. The
          viewport answers that before you press any button.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              A viewer, not just a converter
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Choose the file and the drawing appears, auto-fitted with the CAD
              origin in the bottom-left where it belongs. If you searched for{' '}
              <strong>open dxf file without autocad</strong> or a{' '}
              <strong>free online dxf viewer</strong>, this is the
              part you wanted. It is also the answer to{' '}
              <strong>dxf preview on a Mac</strong>, where the built-in Preview
              app cannot read the format.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              An entity count you can trust
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The pill beside the viewport title reads out total entities, then
              how many are lines and how many circles or arcs. If you needed to{' '}
              <strong>count entities in a dxf file online</strong>, that tally is
              the answer, and an early warning: a count far lower than expected
              means the file leans on entity types section 4 describes.
            </p>
          </div>
        </div>
        <p>
          If nothing in the file is recognised
          &mdash; a binary DXF, an empty ENTITIES section, or only unsupported
          types &mdash; the viewport shows a plain square and the pill reads{' '}
          <em>4 entities</em>. That square is not your drawing; it means nothing
          was found, and it is the most common cause of a{' '}
          <strong>dxf to svg blank output</strong>.
        </p>
      </section>

      {/* 4 */}
      <section id="what-survives" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-orange-500 shrink-0" />
          4. What Survives: Entity Support, Explained Honestly
        </h3>
        <p>
          No converter on page one says which DXF entity types it handles,
          which is why <strong>dxf converted to svg missing lines</strong> is
          such a common search. Here is the full list for this tool.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Read and written to SVG
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>LINE</strong>, <strong>CIRCLE</strong>, <strong>TEXT</strong>{' '}
              and <strong>MTEXT</strong>, from the ENTITIES section of an{' '}
              <strong>ASCII DXF</strong> of any release. Simple 2D sketches, old
              R12 exports from plasma, CNC and embroidery software, and any
              drawing built from those primitives convert cleanly. If your search
              was <strong>dxf line circle arc text entities to svg</strong>,
              this is the sweet spot.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Previewed but not yet written
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>ARC</strong> entities are drawn in the viewport and counted
              in the pill, but are not currently written into the exported SVG.
              They do appear in the PNG and PDF, because those capture the
              viewport itself.
            </p>
          </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Skipped entirely
        </h4>
        <p>
          LWPOLYLINE, POLYLINE, SPLINE, ELLIPSE, HATCH, DIMENSION, SOLID, POINT
          and INSERT (blocks) are not read. Layers, line weights, linetypes and
          text height are not carried into the SVG. A drawing traced as one long
          polyline &mdash; how most laser and CNC cut files are built &mdash;
          will come out with that polyline missing. Explode polylines into
          individual lines in your CAD program, save as ASCII DXF, and the
          straight segments convert; any curved segments become arcs and follow
          the arc rule above.
        </p>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Why the colours change
        </h4>
        <p>
          If you found <strong>dxf colors wrong after converting to svg</strong>,
          it is down to how the colour was assigned. The tool maps AutoCAD
          Color Index values 1 through 9 &mdash; red, yellow, green, cyan, blue,
          magenta, white, dark grey and light grey. Index values above 9, true
          colour, and the very common BYLAYER setting all fall back to a default
          cyan. Assign one of the first nine index colours to the entities
          directly before you export.
        </p>
      </section>

      {/* 5 */}
      <section id="png-pdf-json" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-6 h-6 text-orange-500 shrink-0" />
          5. DXF to PNG, PDF and JSON: The Other Outputs
        </h3>
        <p>
          The target format menu offers three more outputs, all taken from the
          same preview.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>DXF to PNG.</strong> A snapshot of the viewport at its fixed
            800 by 500 pixel size, grid and background included, zoom
            respected. Right for a document or a slide, and a quick{' '}
            <strong>dxf thumbnail generator online</strong>. It is not a
            high-resolution or custom-size render; for another size use the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            or{' '}
            <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image enlarger
            </Link>
            .
          </li>
          <li>
            <strong>DXF to PDF.</strong> That same snapshot on a single
            landscape page: a printable snapshot, not a plot. It is not a vector
            PDF, carries no plot scale and is not dimensionally accurate. It is
            exactly right when you need to{' '}
            <strong>send a dxf to a client who doesn&rsquo;t have autocad</strong>,
            and the honest answer to{' '}
            <strong>convert dxf to pdf without autocad</strong>. Combine several
            with the{' '}
            <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
              PDF merger
            </Link>
            .
          </li>
          <li>
            <strong>DXF to JSON.</strong> Every entity read, as data: type,
            layer, colour, coordinates, radius, angles and text. A{' '}
            <strong>dxf to json converter</strong> for scripts and web apps that
            saves writing a group-code parser. Inspect it in the{' '}
            <Link to="/tools/json-formatter" className="text-orange-600 font-semibold underline hover:text-orange-700">
              JSON formatter
            </Link>
            .
          </li>
        </ul>
        <p>
          Switch the viewport to dark and the SVG, PNG and PDF all carry a deep
          navy background with the drawing in colour on top, which is what{' '}
          <strong>dxf to svg dark background</strong> searchers want for a slide
          or web page.
        </p>
      </section>

      {/* 6 */}
      <section id="not-for" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0" />
          6. What This Tool Does Not Do (DWG, 3D, Cut Files)
        </h3>
        <p>
          Four things it will not do, and what to do instead:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>It does not read or write DWG.</strong> DWG is AutoCAD&rsquo;s
            native binary format and is rejected at the file picker. Save as
            ASCII DXF from your CAD program first.
          </li>
          <li>
            <strong>It does not convert anything into DXF.</strong> SVG, PDF or
            image to DXF go the other way. Outputs are SVG, PNG, PDF and JSON
            only.
          </li>
          <li>
            <strong>It does not handle 3D or manufacturing formats.</strong> STEP,
            STL, IGES, OBJ, DWF and DGN are outside its scope. It is a 2D
            drawing exporter.
          </li>
          <li>
            <strong>Cricut and cut files need a check first.</strong> If you want
            to <strong>convert dxf to svg for cricut</strong>, check the entity
            count first. Cut files exported as a single polyline lose that
            geometry; files built from individual lines and circles come through
            fine.
          </li>
        </ul>
        <p>
          An SVG chosen as input is passed through unchanged and not rendered,
          so for SVG to PNG use the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>{' '}
          instead. And one file is converted at a time; there is no batch mode.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free DXF to SVG Converter
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['You see the drawing before you convert', 'A zoomable viewport with a dark or light grid shows what was read, so a bad conversion costs a glance rather than a download.'],
            ['An honest entity count', 'Lines and arcs are tallied before you commit, and this guide says exactly which entity types survive.'],
            ['Genuinely free, no signup', 'No account, no email, no daily limit and no watermark, on the first file and the hundredth.'],
            ['Four outputs from one preview', 'SVG for editing, a PNG snapshot for documents, a printable PDF for people without CAD, and JSON for code.'],
            ['Your drawings stay private', 'Your files are never stored on our servers, nothing is retained after your session, and nothing is used for training or analytics.'],
            ['Colours carried through', 'AutoCAD index colours 1 to 9 are mapped per entity, so red centre lines and yellow outlines stay that way.'],
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
          on the same terms: once you have a PNG you can{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            compress it
          </Link>
          , turn it into a WebP for the web with the{' '}
          <Link to="/tools/image-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image converter
          </Link>
          , or shrink the PDF with the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          before sending it.
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
              'Is this dxf to svg converter really free with no signup?',
              'Yes. Choose a DXF, check the preview, press Convert and download the SVG. No account, no email step, no daily quota and no watermark.',
            ],
            [
              'Why is my DXF converted to SVG missing lines?',
              'Because the missing parts were not LINE, CIRCLE, TEXT or MTEXT entities. Polylines, splines, hatches, dimensions and blocks are skipped, and arcs are previewed but not yet written to the SVG. Explode them into simple lines in your CAD program, export as ASCII DXF, and try again.',
            ],
            [
              'Why did I get a blank SVG, or just a square?',
              'A plain square with a count of 4 entities means nothing recognisable was found: a binary DXF, an empty ENTITIES section, or only unsupported entity types. Re-export from your CAD program as ASCII DXF, which fixes the first cause outright.',
            ],
            [
              'Can I open a DXF file without AutoCAD?',
              'Yes. Choose the file in the panel above and the drawing appears in the viewport, where you can zoom and switch the background without converting anything. This works on a Mac too, where the built-in Preview app cannot open DXF.',
            ],
            [
              'Is the DXF to PDF output a real vector PDF I can print to scale?',
              'No. It is a printable snapshot of the viewport on a single landscape page, ideal for sending to someone without CAD, but it carries no paper size, plot scale or units and cannot be re-imported into CAD.',
            ],
            [
              'Can I convert a DWG file here?',
              'No. DWG is rejected at the file picker, and nothing here converts into DWG or DXF either. Save the drawing as ASCII DXF from your CAD program first.',
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
          Other drawing formats? The{' '}
          <Link to="/tools/vector-converter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            vector converter
          </Link>{' '}
          handles SVG and its neighbours, the{' '}
          <Link to="/tools/pdf-psd-eps-ps" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to PSD, EPS and PS tool
          </Link>{' '}
          covers pre-press formats, and the{' '}
          <Link to="/tools/file-converter-hub" className="text-orange-600 font-semibold underline hover:text-orange-700">
            file converter hub
          </Link>{' '}
          lists everything else. To understand how vector and raster graphics
          work rather than simply convert between them, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          starts with exactly that distinction.
        </p>
      </div>
    </article>
  );
}
