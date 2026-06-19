import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


import heroImg from "../assets/services/services-hero.png";
import webImg from "../assets/services/web-development.png";
import mobileImg from "../assets/services/mobile-app-development.png";
import uiuxImg from "../assets/services/ui-ux-design.png";
import marketingImg from "../assets/services/digital-marketing.png";
import ecommerceImg from "../assets/services/ecommerce-solutions.png";
import pythonImg from "../assets/services/python-development.png";
import aimlImg from "../assets/services/ai-ml-solutions.png";
import wordpressImg from "../assets/services/wordpress-development.png";



const rawServices = [
  {
    title: "Web Development",
    description: "Custom web applications and responsive websites built with cutting-edge technologies.",
    image: webImg,
    category: "Development",
    features: [
      "Responsive SPA/SSR with React/Next.js",
      "Secure APIs with Node.js/Express",
      "Testing, CI/CD and performance budgets",
    ],
    deliverables: ["Technical spec", "Staging environment", "Documentation & handover"],
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps for iOS and Android that delight users.",
    image: mobileImg,
    category: "Development",
    features: [
      "Flutter or React Native cross‑platform",
      "Native modules and offline support",
      "App Store and Play Store publishing",
    ],
    deliverables: ["Design assets", "Signed builds", "Release notes & analytics setup"],
  },
  {
  title: "WordPress Development",
  description: "Custom themes, plugins, and optimized sites powered by WordPress and WooCommerce.",
  image: wordpressImg, // import from: ../assets/services/wordpress-development.png
  category: "Development",
  features: [
    "Custom themes and Gutenberg blocks",
    "WooCommerce setup and checkout optimization",
    "Speed, SEO, security & backups",
  ],
  deliverables: [
    "Theme/plugin source",
    "Performance & SEO baseline report",
    "Admin guide & handover",
  ],
},

  {
    title: "UI/UX Design",
    description: "User-centered design to create engaging, intuitive, and accessible digital experiences.",
    image: uiuxImg,
    category: "Design",
    features: [
      "User research and personas",
      "Wireframes and interactive prototypes",
      "Design systems and accessibility",
    ],
    deliverables: ["Figma files", "Design tokens", "Usability report"],
  },

  {
    title: "Digital Marketing",
    description: "Data-driven marketing strategies to expand your online presence and reach.",
    image: marketingImg,
    category: "Marketing",
    features: ["SEO & content strategy", "Paid ads optimization", "Email and social campaigns"],
    deliverables: ["Content calendar", "KPI dashboard", "Quarterly growth report"],
  },
  {
    title: "E-Commerce Solutions",
    description: "Complete online store development with secure payment integration and inventory management.",
    image: ecommerceImg,
    category: "Development",
    features: ["Headless commerce", "Checkout optimization", "ERP/WMS integrations"],
    deliverables: ["Storefront", "CMS setup", "Payment & tax configuration"],
  },
  {
    title: "C++ Development",
    description: "High-performance applications, system software, and game development using C++.",
    image: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=1600&q=80",
    category: "Development",
    features: ["Low-latency systems", "Engine integrations", "Tooling & CI for C++"],
    deliverables: ["Profiling report", "Benchmarks", "Deployment artifacts"],
  },
  {
    title: "Python Development",
    description: "Versatile Python solutions for web development, automation, data processing, and more.",
    image: pythonImg,
    category: "Development",
    features: ["FastAPI/Django services", "Task automation", "ETL jobs"],
    deliverables: ["Service repo", "CI pipelines", "Monitoring hooks"],
  },
  {
    title: "AI/ML Solutions",
    description: "Artificial Intelligence and Machine Learning solutions to automate processes and gain insights.",
    image: aimlImg,
    category: "AI/ML",
    features: ["Model training & evaluation", "MLOps pipelines", "Responsible AI guidelines"],
    deliverables: ["Model cards", "Serving infra", "Retraining schedule"],
  }
];

const categories = ["All", "Development", "Design", "Marketing", "AI/ML"];

export default function Services() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(false);
  const closeBtnRef = useRef(null);

  const services = rawServices;

  const filtered = useMemo(() => {
    const qx = q.trim().toLowerCase();
    return services.filter((s) => {
      const mc = cat === "All" || s.category === cat;
      const mq =
        !qx ||
        s.title.toLowerCase().includes(qx) ||
        s.description.toLowerCase().includes(qx) ||
        s.category.toLowerCase().includes(qx);
      return mc && mq;
    });
  }, [q, cat, services]);

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
      {/* Hero with absolute gradient to cover any header gap */}
      <section id="services-hero" className="relative isolate -translate-y-px pt-[env(safe-area-inset-top)]"> <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700" /> <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(255,255,255,0.08),transparent)]" aria-hidden="true" /> <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center text-white min-h-[clamp(24rem,40vh,34rem)] md:min-h-[clamp(30rem,48vh,40rem)] py-12"> {/* content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-0 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              Explore Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 text-indigo-100/90 text-lg max-w-xl"
            >
              Strategy, design, development, and cloud—end‑to‑end solutions crafted to accelerate growth.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
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
            </motion.div>
          </div>

          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
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
      <section id="services" className="max-w-7xl mx-auto px-6 py-14">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-500">
              No services match your filters. Try clearing search or picking another category.
            </motion.p>
          ) : (
            <motion.div key="grid" layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((service, idx) => (
                <motion.article
                  key={`${service.title}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: (idx % 6) * 0.06 }}
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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpen(service)}
                      className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
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
                <a href="/contact" className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                  Discuss This Service
                </a>
                <button
                  type="button"
                  onClick={backToServices}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Back to Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
