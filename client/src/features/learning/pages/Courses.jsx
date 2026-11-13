import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Award, Search, X } from "lucide-react";
import { api, prerendered } from "../../../lib/api.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useCatalogueFilter } from "../../../hooks/useCatalogueFilter.jsx";
import { useGridReveal } from "../../../hooks/useGridReveal.jsx";
import Seo from "../../../seo/Seo.jsx";
import { breadcrumbs, itemList, faq as faqSchema } from "../../../seo/schema.js";
import PageHero from "../../../components/PageHero.jsx";
import CoursesVisual, { CourseCover } from "../../../components/heroes/CoursesVisual.jsx";
import FaqSection from "../../../components/FaqSection.jsx";
import { faqsFor } from "../../../data/faqs.js";
import { COURSE_COUNT } from "../../../data/catalogue.js";
import { courseCover } from "../../../data/courseCovers.js";
import Photo from '../../../components/Photo.jsx';

// Every course has its own photograph (data/courseCovers.js). A course added
// before its photo falls back to the typographic cover. Both are decorative:
// the card's title sits right under them.
const coverOf = (course) => courseCover(course.slug) || courseCover(course.coverKey);

const Cover = ({ course, number }) => {
  const photo = coverOf(course);

  if (photo) {
    return <Photo src={photo.src} srcSet={photo.srcSet} avifSrcSet={photo.avifSrcSet} sizes="(max-width: 760px) 88vw, (max-width: 1100px) 45vw, 30vw" alt="" loading="lazy" decoding="async" />;
  }

  return <CourseCover course={course} number={number} wide />;
};

// The closing tile takes whatever the last row leaves, so the grid always
// ends square. Class names are spelled out for Tailwind's scanner.
const SPAN_LG = ['lg:col-span-3', 'lg:col-span-2', 'lg:col-span-1'];
const SPAN_SM = ['sm:col-span-2', 'sm:col-span-1'];

const CertificateTile = ({ count, signedIn }) => {
  const ref = useRef(null);

  // The seal turns only while the tile is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-off', !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <aside
      ref={ref}
      data-card
      className={`cv-end ${SPAN_LG[count % 3]} ${SPAN_SM[count % 2]}`}
      aria-label="Certificates"
    >
      <div className="cv-seal lx-glass" aria-hidden="true">
        <svg className="cv-seal-ring" viewBox="0 0 120 120">
          <defs>
            <path id="cv-end-seal-path" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
          </defs>
          <text>
            <textPath href="#cv-end-seal-path" textLength="268" lengthAdjust="spacing">
              Verifiable certificate · Free course ·
            </textPath>
          </text>
        </svg>
        <Award className="cv-seal-icon" size={26} strokeWidth={1.4} />
      </div>
      <div className="cv-end-copy">
        <p className="cv-end-title">
          Finish one. <em>Get certified.</em>
        </p>
        <Link to={signedIn ? '/dashboard' : '/signup'} className="btn lx-btn">
          {signedIn ? 'My learning' : 'Create free account'}
          <span className="lx-btn-disc" aria-hidden="true">
            <ArrowUpRight size={15} />
          </span>
        </Link>
      </div>
    </aside>
  );
};

const Courses = () => {
  const { user } = useAuth();

  // Prerendered pages start from the list they were built with (lib/api.js).
  const initial = prerendered("/learn/courses");
  const [courses, setCourses] = useState(() => initial?.data ?? []);
  const [status, setStatus] = useState(initial ? "ready" : "loading");

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
        // Keep the list the page was prerendered with if the refresh fails.
        if (!cancelled && !prerendered("/learn/courses")) setStatus("error");
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

  // Catalogue numbers follow the API's order, so a cover in the hero and the
  // same course's card in the grid carry the same "Nº".
  const numberOf = useMemo(() => {
    const m = new Map();
    courses.forEach((c, i) => m.set(c.slug, i + 1));
    return m;
  }, [courses]);

  const { q, setQ, cat, setCat, filtered } = useCatalogueFilter(
    courses,
    (c) => [c.title, c.summary, c.level, c.category]
  );

  const gridRef = useGridReveal([filtered]);
  const searchRef = useRef(null);

  return (
    <main className="text-ink-2">
      <Seo
        title="Free Online Courses with Certificates"
        description="Learn web development, Python, AI, cloud, cybersecurity and design free. Twelve chapters, quizzes on every topic, and a verifiable certificate. No fees, start any time."
        path="/courses"
        schema={[
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
          ]),
          // Only describe the courses actually rendered: markup that claims
          // more than the page shows is what gets structured data penalised.
          ...(courses.length ? [itemList(courses, (c) => `/learn/${c.slug}`)] : []),
          faqSchema(faqsFor('/courses').map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />

      <PageHero
        label="Courses"
        lines={["Learn at your", <em key="em">own pace.</em>]}
        lede="Free courses, quizzes on every topic, and a verifiable certificate."
        actions={[
          { href: "#course-list", label: "Browse courses", primary: true },
          user
            ? { to: "/dashboard", label: "My learning" }
            : { to: "/signup", label: "Create free account" },
        ]}
        visual={<CoursesVisual courses={courses} total={courses.length || COURSE_COUNT} />}
      />

      {/* Claude Pro Sponsored Incentive Banner */}
      <section className="lx-wrap pt-0 pb-6" aria-label="Claude Pro incentive">
        <div className="lx-claude-course-card">
          <div className="lx-claude-course-badge">
            <span>Sponsored Study Grant</span>
          </div>
          <div className="lx-claude-course-content">
            <div className="lx-claude-course-main">
              <h2 className="lx-claude-course-title">
                Get <strong>Claude Pro</strong> for Free for 1 Month
              </h2>
              <p className="lx-claude-course-lede">
                Complete any course on Cortexis, pass the chapter quizzes, and achieve 50%+ on the final exam.
                Upon successful completion, your application for 1 month of sponsored Claude Pro will automatically be registered!
              </p>
            </div>
            <div className="lx-claude-course-steps">
              <div className="lx-claude-step-item">
                <span className="lx-claude-step-number">1</span>
                <div>
                  <h3 className="lx-claude-step-title">Study &amp; Track</h3>
                  <p className="lx-claude-step-desc">Active study time and quiz marks are automatically saved to your profile.</p>
                </div>
              </div>
              <div className="lx-claude-step-item">
                <span className="lx-claude-step-number">2</span>
                <div>
                  <h3 className="lx-claude-step-title">Pass Final Exam (50%+)</h3>
                  <p className="lx-claude-step-desc">Earn your verifiable certificate by scoring 50 marks or higher.</p>
                </div>
              </div>
              <div className="lx-claude-step-item">
                <span className="lx-claude-step-number">3</span>
                <div>
                  <h3 className="lx-claude-step-title">Applied Automatically</h3>
                  <p className="lx-claude-step-desc">Your status automatically marks &ldquo;Applied&rdquo; &amp; admin awards Claude Pro access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pages.css pads every section 3rem; zeroed here so the filter panel
          sits on the grid it filters rather than floating between sections. */}
      <section id="course-list" className="lx-wrap pt-0 pb-0" aria-label="Find a course">
        <div className="lx-glass rounded-[var(--r-lg)] p-2 md:p-2.5 flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
          {/* focus-visible:rounded-full: index.css gives every :focus-visible
              element a 4px radius, which squared the pills off on focus. The
              native search clear glyph is browser blue, so it is swapped for
              one in the house ink. */}
          <div className="relative md:w-72 shrink-0">
            <label htmlFor="course-search" className="visually-hidden">Search courses</label>
            <Search
              size={17}
              strokeWidth={1.6}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"
            />
            <input
              id="course-search"
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full h-11 pl-11 pr-11 rounded-full focus-visible:rounded-full bg-white/75 border border-[color:var(--line-strong)] text-ink placeholder:text-ink-4 transition-colors duration-200 focus:outline-none focus:border-ink focus:bg-white [&::-webkit-search-cancel-button]:appearance-none"
              placeholder="React, Python, design..."
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full focus-visible:rounded-full text-ink-3 hover:text-ink hover:bg-[color:var(--line)] transition-colors duration-200"
              >
                <X size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
          </div>
          <div
            role="group"
            aria-label="Filter by category"
            className="flex md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-0.5 [mask-image:linear-gradient(to_right,#000_82%,transparent)] md:[mask-image:none]"
          >
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`h-10 px-4 rounded-full focus-visible:rounded-full focus-visible:outline-offset-0 text-sm whitespace-nowrap border transition-colors duration-200 ${
                  cat === c
                    ? "bg-ink text-ivory border-ink"
                    : "bg-transparent text-ink-2 border-transparent hover:border-[color:var(--line-strong)] hover:bg-white/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={gridRef} className="lx-wrap pt-6 pb-20 md:pt-10 md:pb-28" aria-labelledby="course-grid-heading">
        <h2 id="course-grid-heading" className="visually-hidden">All courses</h2>

        {status === "loading" && (
          <div className="py-20 grid place-items-center" role="status">
            <div className="h-10 w-10 rounded-full border-2 border-orange-500/25 border-t-orange-600 animate-spin" aria-hidden="true" />
            <span className="visually-hidden">Loading courses</span>
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-ink-3">
            Could not load the course catalogue. Please refresh the page.
          </p>
        )}

        {status === "ready" && filtered.length === 0 && (
          <p className="text-center text-ink-3">
            No courses match. Try another search or category.
          </p>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filtered.map((course) => (
              <article
                key={course.id}
                data-card
                className="cv-item group relative flex flex-col overflow-hidden cursor-pointer"
              >
                {/* One transparent link laid over the whole card makes every
                    part of it clickable. It sits behind the visible CTA in the
                    stack, is hidden from assistive tech, and is skipped by the
                    keyboard, so the card still exposes exactly one real link. */}
                <Link
                  to={`/learn/${course.slug}`}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="absolute inset-0 z-10"
                />

                <div className="cv-item-media">
                  <Cover course={course} number={numberOf.get(course.slug)} />
                  <div className="absolute bottom-3 left-3 flex gap-1.5 text-xs">
                    <span className="bg-emerald-400 text-emerald-950 font-semibold px-2.5 py-1 rounded-full">
                      Free
                    </span>
                    <span className="lx-glass text-ink-2 font-mono px-2.5 py-1 rounded-full">
                      {course.duration}
                    </span>
                  </div>
                </div>

                {/* Margins are zeroed on purpose: Pages.css gives every h3
                    and p a bottom margin. The title is the card's one real
                    link; the overlay above makes the rest of it clickable. */}
                <div className="px-6 pt-5 pb-5 flex flex-col flex-1 gap-4">
                  <h3 className="m-0 font-display font-normal text-[1.7rem] leading-[1.05] text-ink">
                    <Link
                      to={`/learn/${course.slug}`}
                      className="relative z-20 text-inherit no-underline"
                    >
                      {course.title}
                    </Link>
                  </h3>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <p className="m-0 font-mono text-xs leading-relaxed text-ink-3">
                      {course.chapterCount} chapters ·{" "}
                      <span className="whitespace-nowrap">{course.level}</span>
                    </p>
                    <span className="cv-item-disc shrink-0" aria-hidden="true">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </article>
            ))}

            <CertificateTile count={filtered.length} signedIn={!!user} />
          </div>
        )}
      </section>

      <FaqSection page="/courses" title="Questions about the courses" />
    </main>
  );
};

export default Courses;
