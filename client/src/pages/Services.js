import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { useCatalogueFilter } from "../hooks/useCatalogueFilter";
import { useGridReveal } from '../hooks/useGridReveal';
import { useModalIntro } from '../hooks/useModalIntro';


import heroImg from "../assets/services/services-hero.webp";
import { SERVICES } from '../data/services';
import { serviceImage } from '../data/serviceImages';
import Seo from '../seo/Seo';
import { organization, breadcrumbs } from '../seo/schema';





const categories = ["All", "Development", "Design", "Marketing", "AI/ML"];

export default function Services() {
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(false);
  const closeBtnRef = useRef(null);

  const services = SERVICES.map((s) => ({ ...s, image: serviceImage(s.slug) }));

  const introRef = useIntroTimeline();
  const panelRef = useModalIntro(show);

  const { q, setQ, cat, setCat, filtered } = useCatalogueFilter(
    services,
    (s) => [s.title, s.description, s.category]
  );

  const gridRef = useGridReveal([filtered]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && show && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  const handleOpen = (service) => {
    setActive(service);
    setShow(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtnRef.current?.focus());
  };

  const handleClose = () => {
    setShow(false);
    setActive(null);
    document.body.style.overflow = "";
  };

  const backToServices = () => {
    setShow(false);
    setActive(null);
    document.body.style.overflow = "";
    setTimeout(() => {
      const el = document.getElementById("services");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 pt-0 mt-0 [padding-block-start:0!important] [margin-block-start:0!important]">
      <Seo
        title="Software Development and Consulting Services"
        description="Web and mobile development, AI and automation, cloud and DevOps, UI/UX design and technical training, delivered by an Islamabad based engineering team."
        path="/services"
        schema={[organization(), breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])]}
      />
      {/* Hero with absolute gradient to cover any header gap */}
      <section ref={introRef} id="services-hero" className="relative isolate -translate-y-px pt-[env(safe-area-inset-top)]"> <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700" /> <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(255,255,255,0.08),transparent)]" aria-hidden="true" /> <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center text-white min-h-[clamp(24rem,40vh,34rem)] md:min-h-[clamp(30rem,48vh,40rem)] py-12"> {/* content */}
          <div>
            <h1
              data-intro
              className="mt-0 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              Explore Our Services
            </h1>
            <p
              data-intro
              className="mt-4 text-indigo-100/90 text-lg max-w-xl"
            >
              Strategy, design, development and cloud. End to end solutions built to accelerate growth.
            </p>
            <div
              data-intro
              className="mt-6 flex flex-wrap gap-3"
            >
              <a
                href="#services"
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50"
              >
                View Services
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 text-white hover:bg-white hover:text-indigo-700"
              >
                Talk to Advisor
              </a>
            </div>
          </div>

          <img
            data-intro
            src={heroImg}
            alt="Team collaborating on solutions"
            className="rounded-2xl shadow-2xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 mt-0">
        <div className="rounded-2xl bg-white shadow-md p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-slate-300"
              placeholder="Search services, e.g. React, Cloud, SEO..."
            />
          </div>
          <div className="flex gap-2 overflow-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border ${
                  cat === c
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section ref={gridRef} id="services" className="max-w-7xl mx-auto px-6 py-14">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500">
            No services match your filters. Try clearing search or picking another category.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((service, idx) => (
                <article
                  key={`${service.title}-${idx}`}
                  data-card
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {service.category}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mt-2 flex-1">{service.description}</p>
                    {/* A real link, not only a modal trigger. The modal stays for quick
                        browsing, but each service has a URL now, so a crawler can reach it
                        and a person can send it to someone. */}
                    <Link
                      to={`/services/${service.slug}`}
                      className="mt-5 block w-full rounded-lg bg-indigo-600 py-2.5 text-center font-medium text-white transition hover:bg-indigo-700"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={() => handleOpen(service)}
                      className="mt-2 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Quick look
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Routes out of this page.
          Services linked nowhere except contact, which wastes the page: a
          visitor deciding whether to hire us is also the person who might take
          a course or send an intern, and a crawler needs paths between these
          sections to see them as one site. */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-black">Not ready to start a project?</h2>
          <p className="mt-2 text-black font-medium max-w-2xl">
            There is more than one way to work with us. Learn the skills yourself, send us
            someone to train, or use the free tools we have already built.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            <Link
              to="/courses"
              className="group block rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-bold text-black group-hover:text-orange-700">Free courses</h3>
              <p className="mt-1 text-sm text-black font-medium">
                Twenty three courses, twelve chapters each, with a verifiable certificate.
              </p>
            </Link>
            <Link
              to="/internships"
              className="group block rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-bold text-black group-hover:text-orange-700">Free internships</h3>
              <p className="mt-1 text-sm text-black font-medium">
                Real projects in Islamabad, mentored by the engineers who ship them. Unpaid, and we never charge a fee.
              </p>
            </Link>
            <Link
              to="/tools"
              className="group block rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-bold text-black group-hover:text-orange-700">Free tools</h3>
              <p className="mt-1 text-sm text-black font-medium">
                Converters, formatters and generators, free and with no sign up.
              </p>
            </Link>
          </div>
        </div>
      </section>


      {/* Modal */}
      {show && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-title"
          aria-describedby="service-desc"
        >
          <div
            ref={panelRef}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-xl">
              <h3 id="service-title" className="text-xl font-semibold">
                {active?.title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                aria-label="Close service details"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <img
                src={active?.image}
                alt={active?.title}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
              <p id="service-desc" className="mt-4 text-slate-700">
                {active?.description}
              </p>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Features</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {active?.features?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Sample Deliverables</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {active?.deliverables?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={active ? `/services/${active.slug}` : "/services"}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Full details
                </Link>
                <Link to="/contact" className="px-5 py-2.5 rounded-lg border border-indigo-600 text-indigo-700 hover:bg-indigo-50">
                  Discuss This Service
                </Link>
                <button
                  type="button"
                  onClick={backToServices}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Back to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
