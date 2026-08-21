import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useIntroTimeline } from "../hooks/useIntroTimeline";
import { useCatalogueFilter } from "../hooks/useCatalogueFilter";
import { useGridReveal } from "../hooks/useGridReveal";

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
import coursesHero from "../assets/courses/courses-hero.png";

// coverKey comes from the course content file, so adding a course means adding
// its image here (or letting it fall back to the gradient below).
const COVERS = {
  "full-stack-web": fullstackImg,
  "frontend-engineering": frontendImg,
  "data-structures-algorithms": dsaImg,
  "laravel-fundamentals": laravelImg,
  "flutter-mobile": flutterImg,
  "python-development": pythonImg,
  "cpp-development": cppImg,
  "wordpress-development": wordpressImg,
  "ai-ml-essentials": aimlImg,
  "ui-ux-bootcamp": uiuxImg,
  "graphic-design-ps-ai": graphicsImg,
};

// Courses without artwork fall back to a generated cover. Keyed off the
// `accent` each content file declares, so every course still reads as distinct
// rather than a wall of identical panels. Class strings are written out in full
// because Tailwind cannot see dynamically-built names.
const ACCENTS = {
  violet: "from-violet-600 to-fuchsia-600",
  sky: "from-sky-600 to-cyan-600",
  emerald: "from-emerald-600 to-teal-600",
  amber: "from-amber-500 to-orange-600",
  fuchsia: "from-fuchsia-600 to-pink-600",
  rose: "from-rose-600 to-red-600",
  cyan: "from-cyan-600 to-blue-600",
  indigo: "from-indigo-600 to-violet-600",
  orange: "from-orange-500 to-amber-600",
};

const initials = (title) =>
  title
    .replace(/[^A-Za-z0-9 &+]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !/^(the|and|for|with|of|to|a|an)$/i.test(w))
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");

const Cover = ({ course }) => {
  const src = COVERS[course.coverKey] || COVERS[course.slug];

  if (src) {
    return (
      <img
        src={src}
        alt={course.title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    );
  }

  const gradient = ACCENTS[course.accent] || ACCENTS.violet;

  return (
    <div
      className={`relative w-full h-48 grid place-items-center bg-gradient-to-br ${gradient} overflow-hidden`}
      role="img"
      aria-label={course.title}
    >
      <span className="absolute -right-6 -bottom-8 text-[7rem] font-black text-white/10 select-none leading-none">
        {initials(course.title)}
      </span>
      <span className="relative text-white text-xl font-bold px-6 text-center drop-shadow">
        {course.title}
      </span>
    </div>
  );
};

const Courses = () => {
  const { user } = useAuth();
  const introRef = useIntroTimeline();

  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api("/learn/courses", { auth: false });
        if (!cancelled) {
          setCourses(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.category))).sort()],
    [courses]
  );

  const { q, setQ, cat, setCat, filtered } = useCatalogueFilter(
    courses,
    (c) => [c.title, c.summary, c.level, c.category]
  );

  const gridRef = useGridReveal([filtered]);

  return (
    <main className="bg-gray-50 text-gray-800">
      <header className="relative isolate">
        <div className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
          <div
            ref={introRef}
            className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <span
                data-intro
                className="inline-block text-xs font-bold tracking-wide px-3 py-1 rounded-full bg-emerald-400 text-emerald-950"
              >
                FREE COURSES &amp; CERTIFICATES
              </span>
              <h1
                data-intro
                className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
              >
                Learn online, at your own pace
              </h1>
              <p data-intro className="mt-4 text-indigo-100/90 text-lg max-w-xl">
                Read the lessons, take the quizzes, pass the final exam, and get a verifiable
                certificate. It is all online and automated, with no fees and no waiting for a
                class to start.
              </p>
              <div data-intro className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#course-list"
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-white text-indigo-700 shadow-lg hover:bg-indigo-50"
                >
                  Browse courses
                </a>
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold ring-2 ring-white/80 text-white hover:bg-white hover:text-indigo-700"
                >
                  {user ? "My learning" : "Create free account"}
                </Link>
              </div>
            </div>
            <img
              src={coursesHero}
              alt="Learners in a session"
              className="rounded-2xl shadow-2xl"
              loading="lazy"
              data-intro
            />
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 -mt-8">
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
              placeholder="Search courses, e.g. React, Python, UI/UX..."
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

      <section ref={gridRef} id="course-list" className="max-w-7xl mx-auto px-6 py-14">
        {status === "loading" && (
          <div className="py-20 grid place-items-center">
            <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-slate-500">
            Could not load the course catalogue. Please refresh the page.
          </p>
        )}

        {status === "ready" && filtered.length === 0 && (
          <p className="text-center text-slate-500">
            No courses match the current filters. Try clearing search or choosing another category.
          </p>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <article
                key={course.id}
                data-card
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <Cover course={course} />
                  <div className="absolute top-4 left-4 bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full">
                    FREE
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-indigo-200">
                    {course.duration}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                  <p className="text-slate-600 mt-2 flex-1">{course.summary}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M4 9h16" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                      {course.chapterCount} chapters
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {course.lessonCount} lessons
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">{course.level}</p>

                  <Link
                    to={`/learn/${course.slug}`}
                    className="mt-5 w-full text-center bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start learning for free
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Courses;
