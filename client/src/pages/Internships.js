import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InternshipForm from "../pages/InternshipForm";



// hero image for header
import heroImg from "../assets/internships/internships-hero.png";

// card images (ensure files exist under src/assets/internships/)
import webDevImg from "../assets/internships/web-development-intern.png";
import mernImg from "../assets/internships/mern-fullstack-intern.png";
import frontendImg from "../assets/internships/frontend-intern.png";
import uiuxImg from "../assets/internships/ui-ux-intern.png";
import dataSciImg from "../assets/internships/data-science-intern.png";
import marketingImg from "../assets/internships/digital-marketing-intern.png";
import graphicImg from "../assets/internships/graphic-design-intern.png";
import pythonImg from "../assets/internships/python-intern.png";
import wordpressImg from "../assets/internships/wordpress-intern.png";
import cppImg from "../assets/internships/cpp-intern.png";
import mobileImg from "../assets/internships/mobile-intern.png";
import mysqlImg from "../assets/internships/mysql-database-intern.png";
import aiImg from "../assets/internships/ai-ml-intern.png";




const categories = [
  "All",
  "Web",
  "Mobile",
  "Data",
  "DevOps",
  "Cloud",
  "Security",
  "Design",
  "Marketing",
  "WordPress",
  "C++",
  "Python"
];

const Internships = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const closeBtnRef = useRef(null);

  const internships = [
    {
      title: "Web Development Intern",
      category: "Web",
      duration: "1 month",
      stipend: "No",
      description:
        "Build responsive interfaces with HTML and CSS while focusing primarily on JavaScript fundamentals, DOM APIs, fetch/JSON, and component patterns; optional exposure to React and tooling.",
      image: webDevImg
        
    },
    {
      title: "Full‑Stack Development (MERN) Intern",
      category: "Full‑Stack",
      duration: "1 month",
      stipend: "No",
      description:
        "End‑to‑end product work using MongoDB, Express.js, React, and Node.js: build REST APIs, integrate MongoDB, create React UIs, and deploy with environment config and Git workflows.",
      image: mernImg
       
    },
    {
      title: "Front-End Development Intern",
      category: "Development",
      duration: "1 month",
      stipend: "No",
      description:
        "Build responsive UIs with HTML, CSS, and JavaScript; learn React fundamentals, version control, and accessibility best practices.",
      image: frontendImg
    
    },
    {
      title: "AI/ML Intern",
      category: "AI/ML",
      duration: "1 month",
      stipend: "No",
      description:
        "Work on data pipelines and model prototyping with Python and SQL; implement supervised/unsupervised models, evaluate with proper metrics, and ship small Proof‑of‑Concepts using notebooks and APIs.",
      image: aiImg

    },

    {
      title: "UI/UX Design Intern",
      category: "Design",
      duration: "1 month",
      stipend: "No",
      description:
        "Learn design thinking, create wireframes, and develop prototypes for our clients.",
      image: uiuxImg

    },
    {
      title: "Data Science Intern",
      category: "Data",
      duration: "1 month",
      stipend: "No",
      description:
        "Work with our data team to analyze datasets and build predictive models.",
      image: dataSciImg
    },
    {
      title: "Digital Marketing Intern",
      category: "Marketing",
      duration: "1 month",
      stipend: "No",
      description:
        "Learn SEO, content marketing, and social media strategies while working on real campaigns.",
      image: marketingImg

    },
    {
      title: "Graphic Design Intern",
      category: "Design",
      duration: "1 month",
      stipend: "No",
      description:
        "Create visual concepts to communicate ideas that inspire, inform, and captivate consumers.",
      image: graphicImg
       
    },
    {
      title: "Python Development Intern",
      category: "Python",
      duration: "1 month",
      stipend: "No",
      description:
        "Develop applications using Python, Django, and Flask frameworks. Work on AI/ML projects.",
      image: pythonImg

    },
    {
      title: "WordPress Development Intern",
      category: "WordPress",
      duration: "1 month",
      stipend: "No",
      description:
        "Build and customize WordPress websites, themes, and plugins for various clients.",
      image: wordpressImg
    
    },
    {
      title: "C++ Programming Intern",
      category: "C++",
      duration: "1 month",
      stipend: "No",
      description:
        "Work on system software, game development, or high-performance applications using C++.",
      image: cppImg

    },
    {
      title: "Mobile App Development Intern",
      category: "Mobile",
      duration: "1 month",
      stipend: "No",
      description:
        "Develop native or cross-platform mobile applications for iOS and Android platforms.",
      image: mobileImg

    },
    {
      title: "MySQL Database Intern",
      category: "Data",
      duration: "1 month",
      stipend: "No",
      description:
        "Design relational schemas, write and optimize MySQL queries (JOINs, indexes, transactions), and assist with backups, restores, and performance tuning using EXPLAIN and Slow Query Log.",
      image: mysqlImg

    }



  ];

  const filtered = useMemo(() => {
    const qx = q.trim().toLowerCase();
    return internships.filter((i) => {
      const matchesCat = cat === "All" || i.category === cat;
      const matchesQ =
        !qx ||
        i.title.toLowerCase().includes(qx) ||
        i.description.toLowerCase().includes(qx) ||
        i.category.toLowerCase().includes(qx);
      return matchesCat && matchesQ;
    });
  }, [q, cat, internships]);

  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setShowForm(true);
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);
    document.body.style.overflow = "hidden";
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedInternship(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
              >
                Internships at Cortexis Solution Hub
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-4 text-indigo-100/90 text-lg max-w-xl"
              >
                Gain real-world experience, mentorship, and a strong portfolio. Apply to roles that match your skills and ambitions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <a href="#open-roles" className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50">
                  View Open Roles
                </a>
                <a href="/contact" className="inline-flex items-center px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 text-white hover:bg-white hover:text-indigo-700">
                  Talk to HR
                </a>
              </motion.div>
            </div>
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={heroImg}
              alt="Interns collaborating"
              className="rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="rounded-2xl bg-white shadow-md p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /></svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-slate-300"
                placeholder="Search roles, e.g. React, UI/UX, Data..."
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border ${cat === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="open-roles" className="max-w-7xl mx-auto px-6 py-14">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500"
            >
              No internships match the current filters. Try clearing search or choosing another category.
            </motion.p>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((internship, idx) => (
                <motion.article
                  key={`${internship.title}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: (idx % 6) * 0.06 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-indigo-200">
                      {internship.duration}
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Stipend: {internship.stipend}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{internship.title}</h3>
                    <p className="text-slate-600 mt-2 flex-1">{internship.description}</p>
                    <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /></svg>
                        {internship.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4.5v9L12 21 3 16.5v-9L12 3z" stroke="currentColor" strokeWidth="1.6" /></svg>
                        {internship.category}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApplyClick(internship)}
                      className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="internship-apply-heading"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseForm();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0e1124] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100"
          >
            <div className="sticky top-0 bg-[#0e1124] border-b border-white/10 p-4 flex justify-between items-center rounded-t-xl">
              <h3 id="internship-apply-heading" className="text-xl font-semibold text-white">
                Apply for {selectedInternship?.title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                aria-label="Close internship form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <InternshipForm
                internshipTitle={selectedInternship?.title}
                onClose={handleCloseForm}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Internships;
