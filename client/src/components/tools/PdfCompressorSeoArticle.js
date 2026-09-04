import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Zap,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Flame,
  Smartphone,
  Check,
} from 'lucide-react';

export default function PdfCompressorSeoArticle() {
  return (
    <article className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-xl text-slate-800 dark:text-slate-200 prose prose-slate max-w-none">
      {/* Header Badge & Meta */}
      <div className="flex flex-wrap items-center gap-3 not-prose mb-6">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20">
          Complete Master Guide
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Published by Cortexis Document Research Lab • 12 min read
        </span>
      </div>

      {/* Main Heading (H2 in component hierarchy under Tool H1) */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight not-prose mb-4">
        The Ultimate Guide to <span className="text-orange-600 dark:text-orange-400">Compress PDF Online</span>: How to Reduce PDF File Size Without Losing Quality
      </h2>

      <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
        Large PDF documents are one of the most common friction points in modern digital communication. Whether you are attempting to upload a university assignment, submit government job applications with strict <strong>100KB limits</strong>, send multiple business proposals via email, or archive scanned financial statements, file size restrictions can halt your productivity. Finding a reliable <strong>pdf compressor</strong> that can <strong>reduce pdf size</strong> dramatically while preserving razor-sharp text and clear imagery is essential.
      </p>

      {/* Featured WebP Infographic Banner */}
      <div className="my-8 not-prose">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/blog/how-to-compress-pdf-online.webp"
            alt="Compress PDF online free - reduce PDF file size tool interface"
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
            width="1200"
            height="675"
          />
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Smart PDF Optimization: Reduce file size for email, portals, and web sharing while keeping document quality high.</span>
          </div>
        </div>
      </div>

      {/* Interactive Table of Contents */}
      <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 not-prose">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-lg">
          <Layers className="w-5 h-5 text-orange-500" />
          <span>Table of Contents</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          <li>
            <a href="#what-is-pdf-compression" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              1. What is PDF Compression & How It Works
            </a>
          </li>
          <li>
            <a href="#step-by-step-guide" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              2. How to Reduce PDF File Size Online Free
            </a>
          </li>
          <li>
            <a href="#exact-target-sizes" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              3. Target Sizes: 50KB, 100KB, 200KB, 500KB & 1MB
            </a>
          </li>
          <li>
            <a href="#scanned-pdf-compression" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              4. Compressing Heavy Scanned PDFs Over 100MB
            </a>
          </li>
          <li>
            <a href="#compress-pdf-for-email" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              5. Compress PDF for Email & Application Portals
            </a>
          </li>
          <li>
            <a href="#mobile-and-desktop" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              6. Reduce PDF Size on Mobile (iOS/Android) & Mac
            </a>
          </li>
          <li>
            <a href="#why-cortexis-is-best" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              7. Why Cortexis is the Best Free PDF Compressor
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition">
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              8. Frequently Asked Questions (FAQ)
            </a>
          </li>
        </ul>
      </nav>      {/* Section 1 */}
      <section id="what-is-pdf-compression" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
          1. What is PDF Compression and How Does It Work?
        </h3>
        <p>
          A Portable Document Format (PDF) file is a universal document architecture based on international{' '}
          <a
            href="https://www.iso.org/standard/75839.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-semibold underline hover:text-orange-700"
          >
            ISO 32000 Standards
          </a>
          . Inside each PDF file, there are several different types of content: text fonts, vector graphics, document metadata, form fields, and embedded images.
        </p>
        <p>
          When documents are created or scanned, they often contain oversized photos, uncompressed background graphics, and redundant data. A dedicated <strong>pdf compression tool</strong> optimizes these elements to <strong>shrink pdf</strong> file size safely:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Smart Image Optimization:</strong> High-resolution photos and document scans that take up unnecessary megabytes are resized to web and email standards (72 to 150 DPI) without losing text readability.
          </li>
          <li>
            <strong>Lossless Text & Font Handling:</strong> Letters, numbers, vector curves, and typography are preserved cleanly so your text stays sharp at every zoom level.
          </li>
          <li>
            <strong>Removing Redundant Data:</strong> Unneeded file history, duplicate embedded assets, and hidden cache data are cleared to <strong>decrease pdf size</strong> efficiently.
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section id="step-by-step-guide" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500 shrink-0" />
          2. How to Reduce PDF File Size Online for Free (Step-by-Step)
        </h3>
        <p>
          Using Cortexis to <strong>compress pdf online free</strong> is straightforward, fast, and requires zero technical knowledge or account creation. Follow these 3 simple steps to <strong>make pdf smaller</strong> in seconds:
        </p>

        <div className="grid md:grid-cols-3 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative flex flex-col">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-4">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Upload Your PDF</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Drag and drop your PDF file into the upload box above, or click <strong>"Choose PDF File"</strong>. Supports files from 1MB up to <strong>over 100MB</strong>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative flex flex-col">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-4">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Select Compression Level</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Choose from <strong>Standard</strong> (balanced clarity & size), <strong>Strong</strong> (recommended for email & web uploads), or <strong>Extreme</strong> (shrinks scanned PDFs by up to 90%).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative flex flex-col">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-4">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">Instant Download</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Click <strong>"Compress PDF"</strong>. Once processed, view the exact percentage reduction and click <strong>"Download Compressed PDF"</strong> with zero watermark.
            </p>
          </div>
        </div>

        <p>
          Need to <strong>compress multiple pdf files at once</strong>? You can optimize individual files and merge them into a single streamlined portfolio using our{' '}
          <Link to="/tools/pdf-merger" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Merger Tool
          </Link>{' '}
          or divide multi-page documents into targeted chapters with the{' '}
          <Link to="/tools/pdf-splitter" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Splitter Tool
          </Link>
          . As a <strong>free unlimited pdf compressor</strong> with <strong>no limit</strong>, Cortexis allows you to <strong>compress pdf unlimited size</strong> and process unlimited documents back-to-back with zero waiting queues.
        </p>
      </section>

      {/* Section 3 */}
      <section id="exact-target-sizes" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          3. Achieving Exact Target File Sizes: 50KB, 100KB, 200KB, 300KB, 500KB & 1MB
        </h3>
        <p>
          Government portals (such as civil service recruitment, FPSC, PPSC, NTS, passport offices, and visa immigration services), academic admission boards, and job application systems frequently reject documents that exceed strict thresholds. If you need to <strong>reduce pdf size to 100kb</strong> or <strong>convert pdf to smaller size</strong> without font blurring, our <strong>pdf minimizer</strong> and <strong>pdf size reducer</strong> gives you exact control:
        </p>

        {/* Target Table */}
        <div className="overflow-x-auto not-prose my-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Target Size</th>
                <th className="p-3.5">Initial File Size</th>
                <th className="p-3.5">Recommended Preset</th>
                <th className="p-3.5">Target Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-orange-600 dark:text-orange-400">Compress PDF to 50KB</td>
                <td className="p-3.5">200KB – 1MB</td>
                <td className="p-3.5">Extreme Mode (15% Q / 500px)</td>
                <td className="p-3.5">CNIC scans, passport photo cards, signature uploads</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-orange-600 dark:text-orange-400">Compress PDF to 100KB</td>
                <td className="p-3.5">1MB – 5MB</td>
                <td className="p-3.5">Strong Mode (30% Q / 800px)</td>
                <td className="p-3.5">Government job portals, FPSC/PPSC, university admissions</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-orange-600 dark:text-orange-400">Compress PDF to 200KB</td>
                <td className="p-3.5">2MB – 8MB</td>
                <td className="p-3.5">Strong Mode (45% Q / 1000px)</td>
                <td className="p-3.5">Scholarship dossiers, CVs with photo headshots</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-orange-600 dark:text-orange-400">Compress PDF to 300KB - 500KB</td>
                <td className="p-3.5">5MB – 15MB</td>
                <td className="p-3.5">Standard Mode (60% Q / 1200px)</td>
                <td className="p-3.5">Legal affidavits, tax returns, bank statements</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-orange-600 dark:text-orange-400">Reduce PDF Size Below 1MB</td>
                <td className="p-3.5">10MB – 50MB+</td>
                <td className="p-3.5">Standard or Strong Mode</td>
                <td className="p-3.5">Corporate brochures, annual reports, multi-page contracts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Whether your goal is to <strong>compress pdf 1mb to 100kb</strong>, <strong>shrink pdf size online</strong>, or <strong>resize pdf file online</strong>, Cortexis ensures you <strong>reduce pdf file size without losing quality</strong>. Vector typography and embedded hyperlinks remain intact while image bitrates are compressed with high efficiency.
        </p>
      </section>

      {/* Section 4 */}
      <section id="scanned-pdf-compression" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500 shrink-0" />
          4. How to Compress Scanned PDF Documents and Heavy Files Over 100MB
        </h3>
        <p>
          Office multifunction printers and mobile scanner apps (like Adobe Scan, CamScanner, or Apple Notes) frequently save scans as uncompressed high-resolution bitmap images. A 10-page document scanned at 300 DPI in 24-bit RGB color can easily result in a <strong>compress large pdf file</strong> dilemma reaching 60MB to 120MB in size. When you need to <strong>compress pdf over 100mb</strong> or <strong>compress large pdf files free</strong> without application crashes, Cortexis serves as your high-efficiency <strong>compress pdf free online tool</strong>.
        </p>
        <p>
          When you <strong>compress scanned pdf</strong> files or <strong>reduce size of pdf document</strong> with Cortexis:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Automatic Scan Detection:</strong> Identifies uncompressed scanner bitmaps and optimizes page layers cleanly.
          </li>
          <li>
            <strong>Adaptive Quality Control:</strong> Keeps letter edges dark and sharp while reducing bulky background scanner noise.
          </li>
          <li>
            <strong>Smooth Large Document Handling:</strong> Multi-page scanned documents and heavy files process reliably without freezing.
          </li>
          <li>
            <strong>100% Free PDF Compressor No Watermark:</strong> All generated downloads remain completely clean with zero added stamps, headers, or watermarks.
          </li>
        </ul>
        <p>
          If your scanned document contains interactive forms that need to be made uneditable or signed, you can also use our{' '}
          <Link to="/tools/pdf-flatten" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF Flatten Tool
          </Link>{' '}
          or rebuild interactive text inputs with our{' '}
          <Link to="/tools/make-pdf-fillable" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Make PDF Fillable Tool
          </Link>
          .
        </p>
      </section>

      {/* Section 5 */}
      <section id="compress-pdf-for-email" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500 shrink-0" />
          5. How to Compress PDF for Email Attachments and Application Portals
        </h3>
        <p>
          Most major email service providers impose strict message payload limits:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Gmail:</strong> Maximum 25MB total attachment limit.</li>
          <li><strong>Microsoft Outlook / Office 365:</strong> 20MB to 25MB default limit.</li>
          <li><strong>Yahoo Mail & ProtonMail:</strong> 25MB message cap.</li>
        </ul>
        <p>
          When an email client attaches a binary file like a PDF, it encodes the file using <strong>Base64 encoding</strong>, which increases the nominal file size by approximately <strong>33%</strong>! This means an 18MB PDF file will frequently bounce because Base64 expands it to over 24MB.
        </p>
        <p>
          To reliably <strong>compress pdf for email</strong>, target a maximum file size of <strong>5MB to 10MB</strong>. Using Cortexis <strong>Strong Compression Mode</strong> reduces typical 20MB–50MB presentation decks down to 3MB–6MB, ensuring your recipient receives the attachment immediately without relying on external cloud download links that often expire or get blocked by corporate firewalls.
        </p>
      </section>

      {/* Section 6 */}
      <section id="mobile-and-desktop" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500 shrink-0" />
          6. How to Reduce PDF Size on Mobile (iPhone & Android) and Mac / Windows
        </h3>
        <p>
          Whether you are using a mobile device on the go or a desktop workstation, Cortexis is fully responsive and compatible across all major platforms:
        </p>

        <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-500" />
              How to Reduce PDF Size on Mobile (iOS & Android)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              1. Open Safari, Chrome, or Firefox on your smartphone.<br />
              2. Navigate to <code>/tools/pdf-compressor</code>.<br />
              3. Tap <strong>"Choose PDF File"</strong> and select from your Files app, Downloads, or Google Drive.<br />
              4. Select your preferred compression level and tap <strong>Compress</strong>.<br />
              5. Tap <strong>Download</strong> to save the optimized PDF directly to your device storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Reduce PDF Size Mac Free & Windows PC
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              1. Drag any PDF directly from Finder (Mac) or File Explorer (Windows).<br />
              2. Adjust fine-grain quality sliders if you need custom dimension caps.<br />
              3. Process without installing bulky desktop software or third-party plugins.<br />
              4. Download compressed files in one click with zero watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7 */}
      <section id="why-cortexis-is-best" className="scroll-mt-24 space-y-4 mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
          7. Why Cortexis is the Best Free PDF Compressor (Comparison Matrix)
        </h3>
        <p>
          Many online PDF tools lure users with promises of "free compression" only to hit them with restrictive daily document limits, mandatory subscription paywalls, forced email registration, or branding watermarks stamped across their pages. When searching for the <strong>best free pdf compressor</strong>, <strong>free pdf compressor no limit</strong>, or a solution to <strong>shrink pdf file size</strong>, Cortexis stands out as the premier <strong>compress pdf online high quality</strong> platform and <strong>pdf compressor without losing quality</strong>.
        </p>
        <p>
          Cortexis was engineered with an unwavering commitment to <strong>Bank-Grade Document Privacy</strong>, <strong>Zero Data Retention</strong>, and <strong>Unlimited Free Processing</strong>. Here is how Cortexis compares to typical online alternatives:
        </p>

        {/* Feature Matrix Table */}
        <div className="overflow-x-auto not-prose my-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Feature & Capability</th>
                <th className="p-3.5 text-orange-400">Cortexis Free PDF Compressor</th>
                <th className="p-3.5">Standard Online Compressors</th>
                <th className="p-3.5">Paid Desktop Software</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">100% Free Unlimited Usage</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Yes (Unlimited)
                </td>
                <td className="p-3.5 text-rose-500">Often capped (2-3 files/day on free tiers)</td>
                <td className="p-3.5 text-rose-500">Requires expensive license</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">No Watermark on Output</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> 100% Clean Output
                </td>
                <td className="p-3.5 text-amber-600">Free tiers often stamp watermarks</td>
                <td className="p-3.5 text-emerald-600">Clean</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">Zero Account / Sign-Up Required</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Instant Access
                </td>
                <td className="p-3.5 text-rose-500">Often forces email sign-up</td>
                <td className="p-3.5 text-slate-500">Requires local installation</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">Zero Data Retention / Privacy Isolation</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Complete Isolation
                </td>
                <td className="p-3.5 text-slate-500">Stored on third-party cloud servers</td>
                <td className="p-3.5 text-emerald-600">Local processing</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">Extreme 90%+ Compression Mode</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Included Free
                </td>
                <td className="p-3.5 text-rose-500">Often locked behind paid tiers</td>
                <td className="p-3.5 text-emerald-600">Included</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold">Large Files Support (100MB+)</td>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Supported Free
                </td>
                <td className="p-3.5 text-rose-500">Strict 15MB–25MB free caps</td>
                <td className="p-3.5 text-emerald-600">Supported</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          In addition to PDF optimization, explore our full suite of professional developer and creative tools, including{' '}
          <Link to="/tools/pdf-word" className="text-orange-600 font-semibold underline hover:text-orange-700">
            PDF to Word Converter
          </Link>
          ,{' '}
          <Link to="/tools/extract-images-from-pdf" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Extract Images from PDF
          </Link>
          , and our specialized software engineering and technology courses at{' '}
          <Link to="/courses" className="text-orange-600 font-semibold underline hover:text-orange-700">
            Cortexis Training Academy
          </Link>
          .
        </p>
      </section>

      {/* Section 8: FAQ */}
      <section id="faq" className="scroll-mt-24 space-y-6 mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0" />
          8. Frequently Asked Questions (FAQ) About PDF Compression
        </h3>

        <div className="space-y-4 not-prose">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Will compressing my PDF reduce text sharpness or make it unreadable?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No. Our compression engine distinguishes between vector text typography and embedded bitmap images. All typography, TrueType/OpenType font structures, and vector curves remain 100% sharp and scalable at any zoom level. Only heavy raster photographs and background scans are optimized.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              How can I compress a PDF to exactly 100KB for government job or visa applications?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Select <strong>"Strong Compression"</strong> or <strong>"Extreme Compression"</strong> mode. If the file is still slightly above 100KB, use the custom resolution slider to limit maximum image dimensions to 800px or 600px. This guarantees meeting 100KB requirements for portal submissions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Are my confidential files and documents safe when using this tool?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes, absolutely. Cortexis operates with strict <strong>zero data retention</strong> policies. Your documents are never stored, indexed, or shared with third parties. Once processing is complete and you download your file, no persistent record remains on any server.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Can I compress password-protected PDF files?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To compress an encrypted PDF, you must first unlock the document by entering the password. Once unlocked and optimized, you can re-apply bank-grade encryption using our{' '}
              <Link to="/tools/pdf-protect" className="text-orange-600 font-semibold underline hover:text-orange-700">
                PDF Protect & Password Locker Tool
              </Link>
              .
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Is there any limit on how many PDF files I can compress per day?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No. There are zero daily caps, zero document limits, and no hidden subscriptions. You can compress as many PDF documents as you need, completely free of charge.
            </p>
          </div>
        </div>
      </section>

      {/* Author & Footer Note */}
      <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 not-prose">
        <p>© 2026 Cortexis Solution Hub Pvt Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-orange-600 transition">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-orange-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-orange-600 transition">Contact Support</Link>
        </div>
      </footer>
    </article>
  );
}
