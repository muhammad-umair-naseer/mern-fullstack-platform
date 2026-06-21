import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseForm from "./CourseForm";

// 1) Import local images (ensure files exist and names have no spaces)
import fullstackImg from "../assets/courses/full-stack-web.png";
import frontendImg from "../assets/courses/frontend-engineering.png";
import dsaImg from "../assets/courses/data-structures-algorithms.png";
import laravelImg from "../assets/courses/laravel-fundamentals.png";
import flutterImg from "../assets/courses/flutter-mobile.png";
import pythonImg from "../assets/courses/python-development.png";
import cppImg from "../assets/courses/cpp-development.png";
import wordpressImg from "../assets/courses/wordpress-development.png";
import aimlImg from "../assets/courses/ai-ml-essentials.png";
import uiuxImg from "../assets/courses/ui-ux-bootcamp.png";
import graphicsImg from "../assets/courses/graphic-design-ps-ai.png";

// Optional header hero
import coursesHero from "../assets/courses/courses-hero.png";

const categories = [
  "All",
  "Web",
  
  "UI/UX",
  
  "Mobile",
  
];

const rawCourses = [
  {
    title: "Full-Stack Web Development",
    category: "Web",
    duration: "2 months",
    level: "Beginner → Advanced",
    description:
    "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.",
    image: fullstackImg
  },
  {
  title: "Frontend Engineering",
  category: "Web",
  duration: "2 months",
  level: "Beginner → Intermediate",
  description:
    "Master modern React, hooks, state management, routing, and performance patterns for production UIs.",
  image: frontendImg
},

{
  title: "Data Structures & Algorithms",
  category: "CS Core",
  duration: "2 months",
  level: "Beginner → Advanced",
  description:
    "Master time/space complexity, arrays, trees, graphs, DP, and patterns for coding interviews.",
  image: dsaImg
},
{
title: "Laravel Fundamentals",
category: "Web",
duration: "2 months",
level: "Beginner → Intermediate",
description:
"Learn MVC, routing, controllers, Blade views, migrations, and Eloquent to build real Laravel apps.",
image: laravelImg

},
{
  title: "Mobile App Development with Flutter",
  category: "Mobile",
  duration: "2 months",
  level: "Beginner → Intermediate",
  description:
    "Build cross-platform mobile apps using Google's Flutter framework.",
  image: flutterImg

},

{
  title: "Python Development",
  category: "Programming",
  duration: "2 months",
  level: "Beginner → Intermediate",
  description:
    "Python fundamentals, OOP, packaging, virtualenvs, APIs, and testing for production code.",
  image: pythonImg


},

{
title: "C++ Development",
category: "Programming",
duration: "2 months",
level: "Beginner → Intermediate",
description:
"Modern C++ syntax, OOP, STL, memory management, and build tooling to write fast, reliable native applications.",
image: cppImg

},

{
title: "WordPress Development",
category: "Web",
duration: "2 months",
level: "Beginner → Intermediate",
description:
"Set up WordPress, build custom themes and plugins, optimize performance, and harden security for production sites.",
image: wordpressImg


},

{
title: "AI & Machine Learning Essentials",
category: "AI/ML",
duration: "2 months",
level: "Beginner → Intermediate",
description:
"Core ML concepts, supervised vs unsupervised learning, model evaluation, and practical workflows with Python.",
image: aimlImg
},

{
    title: "UI/UX Design Bootcamp",
    category: "UI/UX",
    duration: "2 months",
    level: "Beginner",
    description:
      "Learn design principles, prototyping, and user research methods.",
    image: uiuxImg
      
    },
{
title: "Graphic Designing (Photoshop + Illustrator)",
category: "Design Tools",
duration: "2 months",
level: "Beginner",
description:
"Learn core graphic design workflows using Adobe Photoshop and Illustrator: layers, masks, retouching, vectors, paths, shapes, and type—exporting clean assets for web and print.",
image:graphicsImg

},
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const closeBtnRef = useRef(null);

  const courses = rawCourses;

  const filtered = useMemo(() => {
    const qx = q.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesCat = cat === "All" || c.category === cat;
      const matchesQ =
        !qx ||
        c.title.toLowerCase().includes(qx) ||
        c.description.toLowerCase().includes(qx) ||
        c.level.toLowerCase().includes(qx) ||
        c.category.toLowerCase().includes(qx);
      return matchesCat && matchesQ;
    });
  }, [q, cat, courses]);

  const openForm = (course) => {
    setSelectedCourse(course);
    setShowForm(true);
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    document.body.style.overflow = "hidden";
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCourse(null);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && showForm && closeForm();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm]);

  return (
    <main className="bg-gray-50 text-gray-800">
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
                Explore Our Courses
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-4 text-indigo-100/90 text-lg max-w-xl"
              >
                Learn in-demand skills with mentor support and real projects. Filter by category or search to find the right program.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <a href="#course-list" className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50">
                  View Courses
                </a>
                <a href="/contact" className="inline-flex items-center px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 text-white hover:bg-white hover:text-indigo-700">
                  Talk to Advisor
                </a>
              </motion.div>
            </div>
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              img src={coursesHero}
              alt="Learners in a session"
              className="rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="rounded-2xl bg-white shadow-md p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/></svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-slate-300"
              placeholder="Search courses, e.g. React, Data, UI/UX..."
            />
          </div>
          <div className="flex gap-2 overflow-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border ${
                  cat === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="course-list" className="max-w-7xl mx-auto px-6 py-14">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500"
            >
              No courses match the current filters. Try clearing search or choosing another category.
            </motion.p>
          ) : (
            <motion.div key="grid" layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((course, idx) => (
                <motion.article
                  key={`${course.title}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: (idx % 6) * 0.06 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-indigo-200">
                      {course.duration}
                    </div>
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {course.level}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-slate-600 mt-2 flex-1">{course.description}</p>
                    <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/></svg>
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6"/><path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        {course.level}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openForm(course)}
                      className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Register Now
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
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1100] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-register-heading"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0e1124] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100"
          >
            <div className="sticky top-0 bg-[#0e1124] border-b border-white/10 p-4 flex justify-between items-center rounded-t-xl">
              <h3 id="course-register-heading" className="text-xl font-semibold text-white">
                Register for {selectedCourse?.title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                aria-label="Close registration form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CourseForm
                courseTitle={selectedCourse?.title}
                onClose={closeForm}
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default Courses;

