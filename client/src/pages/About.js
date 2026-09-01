import React from "react";
import { Link } from "react-router-dom";
import { Rocket, Target, Eye, ShieldCheck, Award, FolderCheck, Globe2, Smile, ArrowRight, Sparkles } from "lucide-react";
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import hero from "../assets/hero About.webp";
import aboutMission from "../assets/our mission About.webp";
import aboutVision from "../assets/our vision About.webp";
import aboutPromise from "../assets/our promise About.webp";
import aboutStory from "../assets/our story About.webp";
import Seo from '../seo/Seo';
import { SITE } from '../seo/site';
import { organization, breadcrumbs } from '../seo/schema';

/**
 * Four figures a visitor can check for themselves.
 *
 * These replaced "4+ Years of Excellence", "100+ Successful Projects",
 * "10+ Global Markets" and "99% Client Satisfaction". The first was flatly
 * contradicted three sections further down this same page, which states the
 * company was incorporated on 2 September 2025 — a year old, not four. The
 * other three were unverifiable, and unverifiable numbers on an About page are
 * the first thing a serious buyer tests.
 *
 * Three of the four are countable on this site: 23 course files, 2 tools that
 * actually run, and the SECP registration shown further down this page. If one
 * changes, change it here.
 *
 * The project count is the exception — it is the company's own figure and
 * cannot be checked from the outside, which is exactly why it is the one a
 * buyer will ask about. It is the strongest number in the row when it is true
 * and the most expensive when it is not. It displaced "12 services", which is
 * still visible as twelve pages under /services.
 */
const stats = [
  { icon: Award, number: "Since 2025", label: "SECP-registered company" },
  { icon: FolderCheck, number: "50+", label: "Projects delivered" },
  { icon: Globe2, number: "23", label: "Free courses, open to anyone" },
  { icon: Smile, number: "2", label: "Free tools that never upload your file" },
];

const drivers = [
  { icon: Target, img: aboutMission, title: "Our Mission", text: "Empower businesses with transformative tech and train the next generation of engineers." },
  { icon: Eye, img: aboutVision, title: "Our Vision", text: "Be a trusted global partner recognized for innovation, quality, and measurable impact." },
  { icon: ShieldCheck, img: aboutPromise, title: "Our Promise", text: "Transparent collaboration, agile delivery, and scalable engineering from day one." },
];

const About = () => {
  const introRef = useIntroTimeline();
  const statsRef = useRevealOnScroll();
  const mvpRef = useRevealOnScroll();
  const storyRef = useRevealOnScroll();

  return (
    <main className="relative text-slate-900">
      <Seo
        title="About Us"
        description="Who Cortexis Solution Hub is: a software, training and consulting company in Islamabad building products, teaching engineers, and running free internships."
        path="/about"
        schema={[organization(), breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={introRef}
        className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white py-24 md:py-28"
        aria-labelledby="about-hero-heading"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-accent/30 blur-3xl animate-blob-slow" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-magenta/25 blur-3xl animate-blob" />

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span data-intro className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/25 backdrop-blur">
              <Sparkles className="h-4 w-4" /> About Cortexis
            </span>
            <h1
              id="about-hero-heading"
              data-intro
              className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight"
            >
              Empowering Businesses Through{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ff6b00] bg-clip-text text-transparent font-black">
                Innovation
              </span>
            </h1>
            <p data-intro className="mt-5 text-lg text-indigo-100/90 max-w-xl">
              We help organizations adapt and grow by building digital products that create measurable, lasting impact.
            </p>
            <div data-intro className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-cta-white inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-full bg-transparent px-6 py-3 font-semibold text-white ring-2 ring-white/60 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                Explore services
              </Link>
            </div>
          </div>

          <div data-intro className="relative">
            {/* gradient glow behind the image */}
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-accent/40 via-brand-magenta/30 to-brand-orange-500/30 blur-2xl" />
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-tr from-brand-accent via-brand-magenta to-brand-orange-500 shadow-2xl">
              <img src={hero} alt="Cortexis team collaborating" loading="lazy" className="rounded-3xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid sm:grid-cols-2 md:grid-cols-4 gap-6" aria-label="Company statistics">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            data-reveal
            className="group relative rounded-3xl bg-white p-7 text-center shadow-card ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5"
          >
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-magenta text-white shadow-glow">
              <stat.icon className="h-6 w-6" />
            </span>
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-brand-accent to-brand-magenta bg-clip-text text-transparent">
              {stat.number}
            </h3>
            <p className="mt-1 text-slate-600">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ── What drives us ───────────────────────────────────────────── */}
      <section ref={mvpRef} className="py-16 md:py-20" aria-labelledby="mvp-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow"><span className="section-eyebrow-dot" /> Our DNA</span>
            <h2 id="mvp-heading" className="section-title">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {drivers.map((item, idx) => (
              <article key={idx} data-reveal className="group relative overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.img} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute -bottom-6 left-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-magenta text-white shadow-glow ring-4 ring-brand-ink">
                    <item.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="p-6 pt-9">
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <section ref={storyRef} className="py-16 md:py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-14 items-center" aria-labelledby="story-heading">
        <div data-reveal className="relative">
          <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-accent/30 to-brand-magenta/20 blur-2xl" />
          <img src={aboutStory} alt="The Cortexis journey" loading="lazy" className="relative rounded-3xl shadow-xl ring-1 ring-white/10" />
        </div>
        <div data-reveal>
          <span className="section-eyebrow"><span className="section-eyebrow-dot" /> Our Story</span>
          <h2 id="story-heading" className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">From a small studio to a trusted partner</h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            We began as a small studio helping local teams digitize workflows. Early wins shaped a simple playbook: keep it clear, ship quickly, and measure what matters.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Today, we collaborate with startups, enterprises, and public-sector teams to build solutions that shape industries and improve lives.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Clarity first", "Ship fast", "Measure impact"].map((chip) => (
              <span key={chip} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* A real, checkable company record.
          Several of our own articles tell readers to verify a company on the
          SECP register before trusting it, which was hollow while this page
          offered nothing to verify. Public register facts only: no director
          names, no CNICs, no personal contact details, and not the street
          address on the filing, which is a home. */}
      <section className="px-6 pb-16" aria-labelledby="registration-heading">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
          <h2 id="registration-heading" className="text-xl font-bold text-black">
            A registered company you can check
          </h2>
          <p className="mt-2 text-black font-medium">
            Anyone can confirm we exist on the {SITE.registration.authority}&rsquo;s own register.
            You do not have to take our word for it, and you should not.
          </p>

          <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Registered name</dt>
              <dd className="mt-1 font-semibold text-black">Cortexis Solution Hub (Private) Limited</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {SITE.registration.authorityShort} identification number
              </dt>
              <dd className="mt-1 font-mono font-semibold text-black">{SITE.registration.cuin}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Incorporated</dt>
              <dd className="mt-1 font-semibold text-black">2 September 2025, under the {SITE.registration.act}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Registered office</dt>
              <dd className="mt-1 font-semibold text-black">Islamabad, Pakistan</dd>
            </div>
          </dl>

          <a
            href={SITE.registration.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Look us up on the {SITE.registration.authorityShort} register
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 px-6 py-16 md:py-20 text-center text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/4 h-56 w-56 rounded-full bg-brand-accent/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-brand-magenta/25 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm ring-1 ring-white/25 backdrop-blur">
              <Rocket className="h-4 w-4" /> Let’s build together
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold">Ready to Transform Your Business?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-indigo-100/90">
              Let’s collaborate on solutions that fuel growth, unlock innovation, and create lasting impact.
            </p>
            <Link
              to="/contact"
              className="btn-cta-white mt-7 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
