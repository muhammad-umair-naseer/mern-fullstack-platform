import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Gauge,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Minimize2,
  Palette,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Long-form guide rendered under the PNG Compressor tool.
 *
 * Same shape as PdfWordSeoArticle: H2 under the page's H1, anchored contents,
 * H3 sections, six benefit cards, FAQ. Three decisions are worth recording for
 * whoever edits this next, because each one was made against the search data
 * rather than with it.
 *
 * 1. "Compress PNG to 100KB" / "compress PNG to 20KB" is a big, cheap-to-rank
 *    cluster and we do NOT have a target-size field. The tool offers three
 *    fixed modes and nothing else. So section 5 answers the question behind the
 *    keyword — how to actually land near a number using the modes and the image
 *    resizer — instead of promising an input that does not exist. Same reason
 *    section 6 exists: "bulk compress PNG" and "PNG to JPG" are both high
 *    volume, both outside what this tool does, and both better served by an
 *    honest paragraph than by a claim that generates complaints.
 *
 * 2. Every mode claim traces to the component. Lossless leaves pixel data
 *    untouched and falls back to the original file if a re-encode would come
 *    out larger; Balanced and Maximum Shrink coarsen the three colour channels
 *    and leave the alpha byte alone, which is why "keeps transparency" is
 *    stated flatly rather than hedged. Output is always a .png named
 *    <name>-min.png. One file at a time. No size cap in the code, so none is
 *    claimed and none is denied.
 *
 * 3. Privacy is sold strictly as an outcome — nothing stored, nothing retained,
 *    nothing used for training. The mechanism is deliberately absent from every
 *    sentence in this file.
 */
export default function PngCompressorSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header badge & meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        How to <span className="text-orange-600 dark:text-orange-400">Compress PNG</span> Files Without Losing Transparency
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        PNG is the format you reach for when an image has to sit on top of
        something else &mdash; a logo over a coloured header, a product cut-out,
        a screenshot with a soft shadow. It is also the format that quietly
        turns a simple graphic into a two-megabyte page-weight problem. A good{' '}
        <strong>PNG compressor</strong> fixes that without flattening the
        transparent edges you chose PNG for in the first place. This guide
        covers how to <strong>compress PNG</strong> files properly, what each
        mode actually changes, and what to do when you need to{' '}
        <strong>reduce PNG file size</strong> down to a particular number.
      </p>

      {/* Featured WebP banner. Hides itself if the asset is missing rather than
          shipping a broken image icon. */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">

          <img
            src="/blog/png-compressor.webp"
            alt="Rows of die-cut lightbulb stickers filled with coloured crystal illustrations"
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
              A smaller PNG with the same transparent background: pick a mode,
              compress, and download a lighter file under the same name.
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
            ['#why-png-is-big', '1. Why Your PNG File Is So Large'],
            ['#how-to-compress', '2. How to Compress a PNG Online Free'],
            ['#modes', '3. Lossless, Balanced or Maximum Shrink'],
            ['#transparency', '4. Compressing PNG Without Losing Transparency'],
            ['#target-size', '5. Getting a PNG Down to a Specific Size'],
            ['#wrong-format', '6. When PNG Is the Wrong Format for the Job'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free PNG Compressor'],
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
      <section id="why-png-is-big" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-orange-500 shrink-0" />
          1. Why Your PNG File Is So Large
        </h3>
        <p>
          People are often surprised that a plain logo weighs more than a
          detailed photograph. The reason is that PNG is a lossless format by
          design. As the{' '}
          <a
            href="https://www.w3.org/TR/png-3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            W3C Portable Network Graphics specification
          </a>{' '}
          sets out, the format stores an exact record of every pixel, plus an
          optional alpha channel that records how transparent each of those
          pixels is. Nothing is thrown away, ever. That fidelity is the whole
          point of PNG, and it is also the whole reason your file is big.
        </p>
        <p>
          Two things drive the size up more than anything else. The first is the
          number of distinct colours in the image: a screenshot with a gradient,
          a drop shadow or a photographic element contains thousands of
          near-identical shades that the format has to describe individually.
          The second is transparency, because every pixel now carries a fourth
          value alongside its red, green and blue. Export a 3000-pixel-wide
          banner with a soft transparent fade and a{' '}
          <strong>large PNG file</strong> of several megabytes is the ordinary
          result rather than the exception.
        </p>
        <p>
          So when people look for a way to <strong>make a PNG smaller</strong>,
          what they are really asking is how to reduce that colour variety
          without anyone noticing. The three modes on the tool above are three
          answers to the question &ldquo;how much are you willing to give
          up?&rdquo;
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-compress" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Compress a PNG Online Free (Step-by-Step)
        </h3>
        <p>
          There is no account, no email and no trial period. Using the{' '}
          <strong>PNG optimiser</strong> above to{' '}
          <strong>compress PNG online free</strong> takes three steps:
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          {[
            ['Add your PNG', 'Drag a .png onto the panel above or click to browse. Only PNG files are accepted — anything else is turned away with a plain message rather than a silent failure — and the original file size is shown as soon as it loads.'],
            ['Pick a compression mode', 'Choose Lossless, Balanced or Maximum Shrink. Balanced is the recommended default and is the right answer for most logos, icons, screenshots and web graphics.'],
            ['Download the smaller file', 'Press compress. The download button shows the new file size and the percentage saved, and the file arrives named after your original with -min added.'],
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
          That is the whole workflow to <strong>shrink a PNG file</strong>. You
          can change your mind freely: pick a different mode and compress the
          same image again. Nothing is queued, nothing is watermarked, and the
          output is a normal .png that opens anywhere a PNG opens &mdash; on a
          phone as happily as on a laptop, with nothing to install.
        </p>
      </section>

      {/* 3 */}
      <section id="modes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-6 h-6 text-orange-500 shrink-0" />
          3. Lossless, Balanced or Maximum Shrink: Which Mode to Use
        </h3>
        <p>
          The three buttons are the only decision you have to make, and the
          difference between them is simply how much colour detail each one is
          allowed to simplify.
        </p>
        <div className="grid md:grid-cols-3 gap-5 not-prose my-6">
          {[
            ['Lossless', 'Every pixel comes through untouched. This is the mode for photographs, artwork, medical or legal imagery, and anything you will edit again later. Because nothing is simplified, the savings are the most modest of the three — and if a rewrite would produce a bigger file than you started with, you get your original size back instead. You never leave with a larger file than you arrived with.'],
            ['Balanced', 'Colour values are snapped onto a coarser ladder, which removes the near-duplicate shades that inflate a file without contributing anything you can see. This is the recommended setting and the one to use for logos, icons, UI screenshots, illustrations and almost every web image.'],
            ['Maximum Shrink', 'The same idea pushed considerably harder for the smallest file. Flat graphics and simple icons hold up well. Smooth gradients and photographic areas may show faint banding, so check the result before you ship it — this is the mode to reach for when a size limit is non-negotiable.'],
          ].map(([title, body]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p>
          A practical rule: flat colour and hard edges can be pushed as far as
          the tool will go; gradients and photographs should stay on Balanced;
          and if you cannot afford a single altered pixel, use{' '}
          <strong>lossless PNG compression</strong>. There is no cost to trying
          all three &mdash; the saved percentage is shown on the download button
          each time, so you can compare before committing.
        </p>
      </section>

      {/* 4 */}
      <section id="transparency" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Compress PNG Without Losing Transparency
        </h3>
        <p>
          This is the failure that sends most people looking for a different
          tool. You run a logo through an optimiser, open the result, and the
          transparent background has turned into a white box &mdash; or worse, a
          black one. It is the single most common complaint about image
          compression, and it usually happens because the file was quietly
          converted to a format with no alpha channel at all. Anyone trying to{' '}
          <strong>compress PNG without losing quality</strong> or transparency
          runs into it sooner or later.
        </p>
        <p>
          That cannot happen here. A PNG goes in and a PNG comes out, and the
          alpha value of every pixel is carried through untouched in all three
          modes. Only the colour information is simplified. So when you{' '}
          <strong>compress a transparent PNG</strong>, the cut-out edges, the
          soft feathered shadow and the fully clear background all arrive
          exactly as they left &mdash; there is no white rectangle waiting for
          you when you drop the file onto a coloured page.
        </p>
        <p>
          Two related things worth knowing. First, the pixel dimensions of your
          image are never changed by compressing it: a 2400 &times; 1200 PNG
          stays 2400 &times; 1200. If you also want it physically smaller, run
          it through the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          first, which is usually the bigger win of the two. Second, the
          compressed copy is a clean re-write of the picture, so incidental
          metadata from your camera or design app is not carried into the
          output &mdash; useful if you are publishing an image and would rather
          not publish where it came from.
        </p>
      </section>

      {/* 5 */}
      <section id="target-size" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Minimize2 className="w-6 h-6 text-orange-500 shrink-0" />
          5. &ldquo;Compress PNG to 100KB&rdquo;: Hitting a Specific Size
        </h3>
        <p>
          A lot of people arrive needing to{' '}
          <strong>compress PNG to 100KB</strong>, or to 200KB, or under whatever
          ceiling a job portal, a marketplace listing or a university upload
          form has set. Being straight about it: this tool has three modes and
          no target-size box. You cannot type a number and have a file appear at
          exactly that weight, and any tool promising that is guessing
          repeatedly behind the scenes until it lands close enough.
        </p>
        <p>
          What works instead is a short, reliable sequence:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Compress on <strong>Balanced</strong> first and read the new size on
            the download button. For most graphics this alone clears the limit.
          </li>
          <li>
            If it is still over, try <strong>Maximum Shrink</strong> on the same
            file and compare the two numbers.
          </li>
          <li>
            Still over? The problem is dimensions, not compression. A
            4000-pixel-wide image cannot become a 100KB PNG while staying
            4000 pixels wide. Cut the width down with the{' '}
            <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image resizer
            </Link>{' '}
            &mdash; or crop away what you do not need with the{' '}
            <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
              image cropper
            </Link>{' '}
            &mdash; then bring the smaller version back here and compress it.
          </li>
        </ol>
        <p>
          Halving an image&rsquo;s width removes three quarters of its pixels,
          which is a far larger lever than any compression setting. Resize
          first, compress second, and you will land under almost any limit
          without the picture looking mangled.
        </p>
      </section>

      {/* 6 */}
      <section id="wrong-format" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500 shrink-0" />
          6. When PNG Is the Wrong Format for the Job
        </h3>
        <p>
          Sometimes the honest answer to &ldquo;why is this file still
          enormous?&rdquo; is that it should never have been a PNG. The format
          is superb for flat colour, sharp text, screenshots and anything with a
          transparent background, and a poor choice for a photograph, which has
          no flat areas to exploit and no transparency to protect.
        </p>
        <p>
          If your image is a holiday photo, a portrait or a product shot with a
          solid background, the real fix is a different format rather than a
          harder compression setting. This tool deliberately keeps PNG in and
          PNG out; it does not quietly convert your file to something else
          behind your back, because a tool that silently changes a format is how
          transparency gets destroyed in the first place.
        </p>
        <p>
          Two other limits worth stating plainly, since both are common
          searches when people set out to{' '}
          <strong>optimise images for a website</strong>. There is no{' '}
          <strong>bulk PNG compression</strong> here: the
          tool handles one image at a time, deliberately, so you always see the
          before and after size for the specific file in front of you. And there
          is no size cap or daily quota written into it &mdash; a very large
          image simply takes a little longer to work through than a small one.
          If what you are actually trying to slim down is a document rather than
          a picture, the{' '}
          <Link to="/tools/pdf-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF compressor
          </Link>{' '}
          is the right tool, and if you need the pictures out of a document
          first, use{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            extract images from PDF
          </Link>{' '}
          and compress them here afterwards.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free PNG Compressor
        </h3>
        <p>
          Plenty of sites will <strong>optimise a PNG</strong> for you. Most of
          them make it deliberately irritating until you pay. Here is what is
          different, stated plainly enough that you can check every line
          yourself.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Genuinely free, with no trial', 'No account, no email address, no credit card and no countdown to an upgrade prompt. The tool on this page is the entire product.'],
            ['Transparency survives every mode', 'The alpha channel is carried through untouched whether you choose Lossless, Balanced or Maximum Shrink. No white box, no black box, no surprises.'],
            ['No watermark on the output', 'Your image comes back clean. Nothing is stamped into a corner and nothing is added along an edge.'],
            ['Your files stay private', 'Images are never stored on our servers, never retained after your visit, and never used to train or analyse anything.'],
            ['You see the result before you commit', 'The original size, the new size and the percentage saved are all on screen, so you can switch modes and compare rather than guess.'],
            ['Lossless really means lossless', 'Choose that mode and no pixel is altered — and if a rewrite would end up larger than your original, you keep the original size instead.'],
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
            free document and image tools
          </Link>{' '}
          built on the same terms, so once an image is compressed you can{' '}
          <Link to="/tools/image-enlarger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            scale it up
          </Link>
          , pull a hex value out of it with the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>
          , or turn a link into a{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code
          </Link>{' '}
          without paying for any of it.
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
              'How do I compress a PNG for free without losing quality?',
              'Add your image to the compressor at the top of this page and choose the Lossless mode. Every pixel is preserved exactly, so the picture is identical to the one you started with. The savings are more modest than the other two modes, and if a rewrite would produce a larger file you simply keep your original size — you never end up worse off.',
            ],
            [
              'Will compressing a PNG remove the transparent background?',
              'No. A PNG goes in and a PNG comes out, and the transparency of every pixel is carried through in all three modes. Only colour information is simplified, so cut-outs, soft shadows and fully clear backgrounds all survive intact.',
            ],
            [
              'Can I compress a PNG to an exact file size like 100KB?',
              'Not directly — there is no target-size field, only three modes. In practice, compress on Balanced, check the size shown on the download button, and step up to Maximum Shrink if you are still over. If it will not come down far enough, the image is simply too many pixels wide: resize it first, then compress the smaller version.',
            ],
            [
              'Is there a file size limit or a daily limit?',
              'There is no size cap and no daily quota. Compress one image or forty. A very large image takes a little longer to work through than a small one, which is the only practical difference.',
            ],
            [
              'Can I compress several PNG files at once?',
              'Not in one pass — the tool takes one image at a time so that you always see the exact before and after size for that file. Use the Change PNG button to move straight on to the next one; there is nothing to reload and no counter running down.',
            ],
            [
              'Are my images safe when I compress them?',
              'Your files are never stored on our servers, never retained after your session, and never used for training or analytics. Nothing you compress is kept, queued or logged.',
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
          Working on the same set of images? Use the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>{' '}
          to bring the dimensions down before compressing, the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>{' '}
          to cut away what you do not need, or the{' '}
          <Link to="/tools/pdf-jpg" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to JPG converter
          </Link>{' '}
          to turn document pages into images in the first place. If you would
          rather understand image formats than simply use a tool, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers colour, compression and export settings from the ground up.
        </p>
      </div>
    </article>
  );
}
