import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Code,
  Crop,
  HelpCircle,
  Layers,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';

/**
 * Long-form guide rendered under the Favicon Generator tool.
 *
 * Same shape as the other tool guides: H2 under the page's H1, anchored
 * contents, H3 sections, benefit grid, FAQ. Three decisions shaped the copy.
 *
 * 1. The page lists the real twelve files and the real head snippet, and says
 *    which place each file serves, because that is the question most
 *    generator pages leave unanswered.
 *
 * 2. The edges are stated plainly: ICO sizes are fixed at 16/32/48, there is
 *    no SVG or text favicon, non-square logos are fitted rather than cropped,
 *    and the maskable entry reuses the 512px image. Each edge routes to the
 *    sibling tool that handles it, where one exists.
 *
 * 3. A troubleshooting section covers "favicon not showing", the largest
 *    adjacent search intent, including Google's multiple-of-48px rule.
 */
export default function FaviconGeneratorSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Solution Hub Pvt Ltd Document Research Lab • 8 min read
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        The Free <span className="text-orange-600 dark:text-orange-400">Favicon Generator</span> Guide: Every File Your Site Needs from One Logo, and How to Make It Show
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        You finished the site, opened it in a new tab, and there it is: a blank
        grey page icon where your logo should be. A <strong>favicon</strong> is
        the small picture that fixes that, in the tab, the bookmarks bar, an
        iPhone home screen and Google results. This guide shows how a{' '}
        <strong>favicon generator</strong> turns one square logo into the whole
        set in one click, what each file is for, the HTML to paste, and what to
        check when the icon will not appear. Want just a quick{' '}
        <strong>favicon maker</strong> or an <strong>ico converter</strong>? It
        does that too.
      </p>

      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/favicon-generator.webp"
            alt="A hand sketching tiny icon thumbnails in pencil across a spiral notebook"
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
              One logo in, one ZIP out: the tab icon, the home-screen icon, the
              app icons and the manifest that ties them together.
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
            ['#what-is-a-favicon', '1. What Is a Favicon, and What Size Should It Be?'],
            ['#how-to-make', '2. How to Make a Favicon in Four Steps'],
            ['#the-files', '3. The Twelve Files in the Package, and Where Each One Shows'],
            ['#add-to-site', '4. How to Add a Favicon to a Website'],
            ['#source-logo', '5. Getting the Logo Right: Square, Transparent, Rounded'],
            ['#not-showing', '6. Favicon Not Showing? The Fixes'],
            ['#why-cortexis', '7. Why Cortexis Is the Best Free Favicon Generator'],
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
      <section id="what-is-a-favicon" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500 shrink-0" />
          1. What Is a Favicon, and What Size Should It Be?
        </h3>
        <p>
          A favicon started life as one tiny favicon.ico file at the root of a
          site. Today every place that shows your site wants a different size,
          so the honest answer to <strong>what size should a favicon be</strong>{' '}
          is &ldquo;several&rdquo;.
        </p>
        <p>
          For anyone looking up <strong>favicon sizes 2026</strong>, the set
          that covers the places people actually see your icon is short:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>16 and 32px</strong> for the tab and the bookmarks bar,
            plus <strong>48px</strong>, all bundled together inside favicon.ico.
          </li>
          <li>
            <strong>48 and 96px</strong> PNGs, which meet Google&rsquo;s rule
            that a search-result favicon must be a square whose side is a
            multiple of 48px.
          </li>
          <li>
            <strong>180px</strong> for the apple-touch-icon an iPhone or iPad
            uses when someone adds your site to the home screen.
          </li>
          <li>
            <strong>192 and 512px</strong> for Android shortcuts and the web
            app manifest.
          </li>
        </ul>
        <p>
          The tool above produces every one of those from a single image.
        </p>
      </section>

      {/* 2 */}
      <section id="how-to-make" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Make a Favicon in Four Steps
        </h3>
        <p>
          Here is <strong>how to make a favicon</strong> with this{' '}
          <strong>favicon generator free online</strong>, with no account and
          no sign-up.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Add your logo.</strong> Drop a square PNG, SVG or JPG, or
            paste one from the clipboard. 512px or larger works best.
          </li>
          <li>
            <strong>Set the options.</strong> Type the app name and short name
            for the manifest, and pick a theme and background colour. Padding
            (0 to 30%) adds room around the logo; Corner radius (0 to 50%)
            rounds the background square.
          </li>
          <li>
            <strong>Check the preview.</strong> Live thumbnails at 16, 32, 48,
            180 and 512px update as you adjust, so you can judge whether the
            logo still reads at tab size.
          </li>
          <li>
            <strong>Generate the ZIP.</strong> Press <em>Generate ZIP</em> and
            download favicons.zip. A ready <strong>HTML snippet for your
            head</strong> appears alongside it, to copy or save as a file.
          </li>
        </ol>
        <p>
          Press the button with no image added and the tool asks for one,
          rather than handing you an empty package.
        </p>
      </section>

      {/* 3 */}
      <section id="the-files" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          3. The Twelve Files in the Package, and Where Each One Shows
        </h3>
        <p>
          Most pages stop at &ldquo;download your favicons&rdquo;. Here is
          exactly what is in the ZIP and why each file exists.
        </p>
        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Tabs, bookmarks and search results
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>favicon.ico</strong> holds 16, 32 and 48px versions in one
              file, so it works as a <strong>favicon.ico generator</strong> and
              a <strong>png to ico</strong> step in one go. Next to it sit
              favicon-16x16.png, favicon-32x32.png, favicon-48x48.png and
              favicon-96x96.png for tabs and Google results.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Phones, home screens and web apps
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>apple-touch-icon.png</strong> at 180x180 for iPhone and
              iPad. <strong>android-chrome-192x192.png</strong> and
              android-chrome-512x512.png for Android. favicon-192x192.png and
              favicon-512x512.png as general large icons. Then{' '}
              <strong>site.webmanifest</strong> and a README.txt.
            </p>
          </div>
        </div>
        <p>
          One run doubles as an <strong>apple touch icon generator</strong>,
          a <strong>pwa icon generator</strong> and a{' '}
          <strong>web app manifest generator</strong>. The manifest carries
          your names and colours, standalone display, a start URL of your site
          root, and the 192 and 512px icons, including a 512px maskable entry.
          If a template or console warning asked for{' '}
          <strong>android chrome 192x192 png</strong>, it is in the package under
          exactly that name. The theme colour goes into the manifest and a meta
          tag only; it does not change the pictures.
        </p>
        <p>
          It is an <strong>app icon generator</strong> for websites, not app
          stores: the largest icon is 512px, with no iOS asset catalogue or
          Android adaptive-icon XML. For other sizes, use the{' '}
          <Link to="/tools/image-resizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image resizer
          </Link>
          . The ICO sizes are fixed at 16, 32 and 48px, and no Cortexis tool
          writes an ICO at another size such as 64 or 256px. In practice that
          rarely matters: PNG icons are widely supported for larger
          sizes, so a 64px or 256px PNG from the image resizer, linked with its
          own <code>sizes</code> attribute, does the same job.
        </p>
      </section>

      {/* 4 */}
      <section id="add-to-site" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Add a Favicon to a Website
        </h3>
        <p>
          Knowing <strong>how to add a favicon to a website</strong> takes two
          moves: put the files at your site root and paste six lines into the
          page head. If you searched{' '}
          <strong>how to add favicon in html</strong>, this is the snippet the
          tool gives you:
        </p>
        <pre className="not-prose text-xs sm:text-sm p-4 rounded-xl bg-slate-950 text-slate-100 overflow-x-auto">
          {`<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#2e6bff">`}
        </pre>
        <p>
          Every path starts with a slash, so the files belong at the root, not
          a subfolder. The manifest fields follow the{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Manifest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            web app manifest reference on MDN
          </a>{' '}
          if you want to extend them.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Favicon for React app projects:</strong> replace the default
            favicon in the public folder with all twelve files, and swap the
            old icon lines in index.html for the snippet.
          </li>
          <li>
            <strong>Favicon for WordPress site without plugin:</strong> copy the
            files to the site root with your host&rsquo;s file manager and
            paste the snippet into a child theme&rsquo;s header template.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section id="source-logo" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crop className="w-6 h-6 text-orange-500 shrink-0" />
          5. Getting the Logo Right: Square, Transparent, Rounded
        </h3>
        <p>
          Most disappointing favicons come from the source image.
        </p>
        <p>
          <strong>A wide or tall logo.</strong> The tool does not crop: a
          non-square image is fitted and centred, leaving empty space. To fill
          the square, trim it first with the{' '}
          <Link to="/tools/image-cropper" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image cropper
          </Link>
          .
        </p>
        <p>
          <strong>Transparent logos.</strong> For a{' '}
          <strong>favicon from logo PNG transparent background</strong> files,
          note that the option &ldquo;Fill background colour behind transparent
          icons&rdquo; is on by default. Leave it on for the apple-touch-icon, since iOS
          shows transparent areas as black; turn it off for a see-through tab
          icon. Logo stuck on a white box? Clear it first with the{' '}
          <Link to="/tools/background-remover" className="text-orange-600 font-semibold underline hover:text-orange-700">
            background remover
          </Link>
          .
        </p>
        <p>
          <strong>Rounded or maskable icons.</strong> As a{' '}
          <strong>rounded favicon generator</strong>, the Corner radius slider
          shapes the background square while the fill is on; the logo itself
          is never clipped.
          As a <strong>maskable icon generator</strong> it is simpler: the
          maskable entry reuses the same 512px image, not a separately padded
          one. Android may cut it to a circle, so raise Padding until the logo
          sits well inside the centre.
        </p>
        <p>
          <strong>SVG to favicon.</strong> An SVG logo gives crisp PNG and ICO
          files, but no icon.svg or dark-mode variant comes out; to serve an
          SVG favicon by hand, tidy it with the{' '}
          <Link to="/tools/svg-optimizer" className="text-orange-600 font-semibold underline hover:text-orange-700">
            SVG optimizer
          </Link>
          . There is no text or emoji mode; for a letter on a coloured square,
          make the picture first with the{' '}
          <Link to="/tools/meme-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            meme generator
          </Link>
          .
        </p>
      </section>

      {/* 6 */}
      <section id="not-showing" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          6. Favicon Not Showing? The Fixes
        </h3>
        <p>
          A <strong>favicon not showing</strong> after you added it to your
          site almost always has one of these causes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Favicon not showing in Chrome.</strong> Chrome caches old
            icons stubbornly. Add a version to the links, such as{' '}
            <code>/favicon.ico?v=2</code>, and check in a private window.
          </li>
          <li>
            <strong>Wrong path.</strong> Open yoursite.com/favicon.ico
            directly; if it does not load, the files are in the wrong folder.
          </li>
          <li>
            <strong>Snippet in the wrong place.</strong> The lines must sit
            inside the head, on every page template.
          </li>
          <li>
            <strong>Favicon not showing in Google search results.</strong>{' '}
            Google wants a square icon, favours sizes in multiples of 48px,
            and must be able to crawl both the icon and your home page;
            picking up a change can take a while. The package&rsquo;s 48 and
            96px PNGs fit that size advice, but the default snippet does not
            link them, so add a line such as{' '}
            <code>&lt;link rel=&quot;icon&quot; type=&quot;image/png&quot; sizes=&quot;96x96&quot; href=&quot;/favicon-96x96.png&quot;&gt;</code>{' '}
            to your home page. The full rules are in{' '}
            <a
              href="https://developers.google.com/search/docs/appearance/favicon-in-search"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-semibold underline hover:text-orange-700"
            >
              Google&rsquo;s favicon guidelines
            </a>
            .
          </li>
          <li>
            <strong>Favicon blurry.</strong> A fuzzy tab icon usually means one
            large image is being squeezed down. The 16 and 32px files here are
            made at their real sizes, and a simpler mark stays sharper.
          </li>
          <li>
            <strong>Apple touch icon not working.</strong> If the home-screen
            shortcut shows a screenshot, the apple-touch-icon link is missing
            or the file is not at the root. If it shows a black square, the
            icon was transparent: keep the background fill on.
          </li>
        </ul>
        <p>
          The tool does not visit any live site, so it cannot check these for
          you, clear a cached icon, or fetch another site&rsquo;s favicon.
        </p>
      </section>

      {/* 7 */}
      <section id="why-cortexis" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis Is the Best Free Favicon Generator
        </h3>
        <p>
          Many pages make a favicon. Fewer tell you what you are getting. Here
          is what is different.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 not-prose my-6">
          {[
            ['Free, with no account', 'No sign-up and no watermark. Drop a logo, press one button, download the ZIP.'],
            ['The complete set in one click', 'favicon.ico, six PNG sizes, the apple-touch-icon, two Android icons, a manifest and a README, named the way templates expect.'],
            ['A snippet you can paste', 'The head markup comes with your theme colour filled in, ready to copy or save.'],
            ['Your logo stays private', 'Files are never stored on our servers and nothing is retained, so an unreleased brand stays unreleased.'],
            ['Nothing is used for training', 'Your logo and icons are never used to train anything.'],
            ['Honest about the edges', 'ICO sizes, the 512px ceiling and the shared maskable image are stated up front, with a tool for each gap.'],
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
          It belongs to a wider set of{' '}
          <Link to="/tools" className="text-orange-600 font-semibold underline hover:text-orange-700">
            free image and file tools
          </Link>{' '}
          built on the same terms, and pairs well with the{' '}
          <Link to="/tools/colour-picker" className="text-orange-600 font-semibold underline hover:text-orange-700">
            colour picker
          </Link>{' '}
          for your exact brand hex.
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
              'How do I make a favicon from my logo for free?',
              'Drop a square logo into the favicon generator at the top of this page, set the names and colours, and press Generate ZIP. You get favicon.ico, PNG icons, an apple-touch-icon, a web manifest and the HTML for your head. ',
            ],
            [
              'Can I convert a PNG to ICO here?',
              'Yes. Every package includes a favicon.ico built from your image, holding 16, 32 and 48px versions in one file. Those three sizes are fixed, and no Cortexis tool writes an ICO at another size such as 256px. For a larger icon, make a PNG at that size with the image resizer and link it with its own sizes attribute; PNG icons are widely supported.',
            ],
            [
              'What size should my source image be?',
              'A square image of 512px or larger works best, as a PNG, SVG or JPG. Anything larger is scaled to 1024px on its longest side first, still ample for the 512px icon.',
            ],
            [
              'Why does my logo have empty space around it?',
              'The tool fits a non-square image inside the square and centres it rather than cropping it. Crop it square with the image cropper first, and lower Padding to let the mark fill more of the icon.',
            ],
            [
              'Does it make an SVG favicon or a dark-mode version?',
              'No. The output is PNG and ICO files only, with no icon.svg and no dark-mode variant. The SVG optimizer can tidy an existing SVG logo to serve by hand.',
            ],
            [
              'Will the icons work when someone adds my site to their home screen?',
              'Yes, if the files are at your site root and the snippet is in the head. iPhones and iPads use the 180px apple-touch-icon, and Android uses the 192 and 512px icons listed in site.webmanifest. Keep the background fill on so the iOS icon does not show a black background.',
            ],
            [
              'Why is my favicon not showing in Google search results?',
              'Google needs a square icon, ideally at a multiple of 48px, and must be able to crawl both the icon and your home page. Link the 48 or 96px PNG from this package in your home page head, then allow time for Google to recrawl. This page cannot force an update; that happens on Google’s schedule.',
            ],
            [
              'Why is my favicon blurry?',
              'Usually one large image is being scaled down to 16 or 32px. This package draws each size separately, so link favicon-16x16.png and favicon-32x32.png as the snippet does. If it is still soft, the logo has too much detail for tab size: simplify the mark, or lower Padding so it fills more of the square.',
            ],
            [
              'Why is my apple touch icon not working?',
              'Check that apple-touch-icon.png sits at your site root and the apple-touch-icon line is in the head. A screenshot instead of your icon means Safari could not find it; a black square means the icon was transparent, so keep the background fill on. Remove the old home-screen shortcut and add it again to see the change.',
            ],
            [
              'Does it create Windows tiles or a Safari pinned-tab icon?',
              'No. The package has no mstile images, no browserconfig.xml and no pinned-tab SVG. It covers tabs, bookmarks, Google results, Apple home screens and Android.',
            ],
            [
              'Is my logo kept anywhere?',
              'No. Your files are never stored on our servers and nothing is retained after your session. They are never used for training either.',
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
          Polishing the rest of the site? Shrink images with the{' '}
          <Link to="/tools/image-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            image compressor
          </Link>
          , squeeze PNGs with the{' '}
          <Link to="/tools/png-compressor" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PNG compressor
          </Link>
          , or link to the site with the{' '}
          <Link to="/tools/qr-generator" className="text-orange-600 font-semibold underline hover:text-orange-700">
            QR code generator
          </Link>
          . To design the logo itself, our free{' '}
          <Link to="/learn/graphic-design-ps-ai" className="text-orange-600 font-semibold underline hover:text-orange-700">
            graphic design course
          </Link>{' '}
          covers it, while the{' '}
          <Link to="/learn/full-stack-web" className="text-orange-600 font-semibold underline hover:text-orange-700">
            full-stack web development course
          </Link>{' '}
          covers building the site.
        </p>
      </div>
    </article>
  );
}
