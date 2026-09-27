import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Globe,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  User
} from "lucide-react";
import API_BASE_URL from "../config";
import "./Internships.css";
import Seo from '../seo/Seo';
import { breadcrumbs, faq as faqSchema } from '../seo/schema';
import FaqSection from '../components/FaqSection';
import { faqsFor } from '../data/faqs';
import PageHero from '../components/PageHero';
import InternshipsVisual from '../components/heroes/InternshipsVisual';
import { photos, reel } from '../assets/lux';
import { internshipsDeskPhoto } from '../assets/unique';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const INTERNSHIP_TRACKS = [
  { id: "mern", title: "Full-Stack Web Development (MERN Stack)", category: "Web & Full-Stack" },
  { id: "frontend", title: "Frontend Engineering (React, Next.js, Tailwind)", category: "Web & Full-Stack" },
  { id: "backend", title: "Backend & API Engineering (Node.js, Express, PostgreSQL)", category: "Web & Full-Stack" },
  { id: "aiml", title: "AI / Machine Learning & Data Science (Python, PyTorch)", category: "AI & Data" },
  { id: "python", title: "Python & Automation Tools Development", category: "AI & Data" },
  { id: "mobile", title: "Mobile App Development (Flutter & React Native)", category: "Mobile" },
  { id: "uiux", title: "UI/UX Design & Product Prototyping (Figma)", category: "Design" },
  { id: "marketing", title: "Digital Marketing, SEO & Growth Hacking", category: "Marketing" },
  { id: "wordpress", title: "WordPress & E-Commerce Engineering", category: "CMS" },
  { id: "cpp", title: "C++ Software Engineering & Algorithms", category: "Systems" },
  { id: "database", title: "Database Engineering & SQL Administration", category: "Data" },
  { id: "qa", title: "Software Quality Assurance (QA & Automated Testing)", category: "QA" }
];

const PERKS = [
  { title: "Real production projects", desc: "Live products, not toy tutorials." },
  { title: "SECP registered certificate", desc: "Free and verifiable, with a recommendation letter." },
  { title: "Remote or hybrid", desc: "Standups and sprint reviews, from anywhere." },
  { title: "1-on-1 senior mentorship", desc: "Code reviews from tech leads." }
];

const ELIGIBILITY = [
  "CS, IT, SE or Design students and graduates",
  "The basics of your chosen stack",
  "Time for weekly sprint syncs",
  "Care for well-built software"
];

const deskPhoto = internshipsDeskPhoto;
// The hero uses the reel's 1800px cut of the team photograph: the 700px
// cut in photos.internships is too small for the tall hero frame and turns
// soft on high-density screens.
const teamShot = reel.find((r) => r.caption === "Internships");
const heroPhoto = teamShot ? { src: teamShot.src, alt: photos.internships.alt } : photos.internships;
const pad = (n) => String(n).padStart(2, "0");
// The track as the select shows it: its name without the stack in brackets,
// so it fits a phone. The full title is still what is sent.
const shortTrack = (title) => title.replace(/\s*\(.*\)\s*$/, "");

export default function Internships() {
  const revealRef = useRevealOnScroll();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    university: "",
    degree: "",
    internshipTitle: INTERNSHIP_TRACKS[0].title,
    duration: "1 Month",
    workMode: "Remote",
    skills: "",
    resumeLink: "",
    coverLetter: "",
    company: "" // Honeypot
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [serverError, setServerError] = useState("");

  // Once the confirmation has replaced the form, bring it into view. The
  // swap shortens the page, the footer answers that with a ScrollTrigger
  // refresh on the next frame, and a refresh cancels any smooth scroll under
  // way; so the scroll waits three frames (as on the Tools page).
  useEffect(() => {
    if (!submittedData) return undefined;
    let frame = 0;
    const later = (n) => {
      frame = requestAnimationFrame(() => {
        if (n > 1) return later(n - 1);
        const portal = document.getElementById("apply");
        if (!portal) return undefined;
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        portal.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
        return undefined;
      });
    };
    later(3);
    return () => cancelAnimationFrame(frame);
  }, [submittedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Full name is required";
    else if (formData.name.trim().length < 2) err.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) err.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = "Please enter a valid email address";

    if (!formData.phone.trim()) {
      err.phone = "Phone or WhatsApp number is required";
    } else {
      const cleanDigits = formData.phone.replace(/[^\d]/g, "");
      if (cleanDigits.length < 7 || cleanDigits.length > 16) {
        err.phone = "Please enter a valid phone number (e.g. +92 300 1234567)";
      }
    }

    if (!formData.internshipTitle) err.internshipTitle = "Please select an internship track";
    if (!formData.skills.trim()) err.skills = "Please mention your key skills or technologies";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Honeypot check
    if (formData.company) return;

    if (!validate()) {
      // The messages only exist after React renders them, and their arrival
      // lengthens the page, which the footer answers with a ScrollTrigger
      // refresh that would cancel a smooth scroll; so look three frames on.
      const later = (n) => requestAnimationFrame(() => {
        if (n > 1) return later(n - 1);
        const firstError = document.querySelector(".cx-field-error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          const field = firstError.parentElement.querySelector("input, select, textarea");
          if (field) field.focus({ preventScroll: true });
        }
        return undefined;
      });
      later(3);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        internshipTitle: formData.internshipTitle,
        resumeLink: formData.resumeLink.trim(),
        university: formData.university.trim() || undefined,
        experienceLevel: formData.degree.trim() || undefined,
        duration: `${formData.duration} (${formData.workMode})`,
        coverLetter: formData.coverLetter.trim() || `Skills: ${formData.skills}. City: ${formData.city}.`
      };

      const res = await fetch(`${API_BASE_URL}/api/internships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const refId = `CX-INT-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmittedData({
          refId,
          name: formData.name,
          email: formData.email,
          track: formData.internshipTitle,
          duration: formData.duration,
          workMode: formData.workMode
        });
      } else {
        setServerError(data.message || "Failed to submit your application. Please try again.");
      }
    } catch (err) {
      setServerError("Network connection issue. Please check your internet connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      university: "",
      degree: "",
      internshipTitle: INTERNSHIP_TRACKS[0].title,
      duration: "1 Month",
      workMode: "Remote",
      skills: "",
      resumeLink: "",
      coverLetter: "",
      company: ""
    });
    setErrors({});
    setServerError("");
  };

  return (
    <main className="cx-intern-page">
      <Seo
        title="Software Internships in Pakistan, Free to Join"
        description="Unpaid internships in web, mobile, AI, design and QA. We never charge a fee. Real projects, mentorship from working engineers, and a free certificate."
        path="/internships"
        schema={[breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Internships', path: '/internships' }]), faqSchema(faqsFor('/internships').map((f) => ({ q: f.q, a: f.a })))]}
      />

      <PageHero
        label="Internships"
        lines={['Apply for', 'Cortexis', <em key="em">Internship.</em>]}
        lede="Real projects and code reviews. Unpaid, and never a fee."
        actions={[
          { href: '#apply', label: 'Start your application', primary: true },
          { href: '#internship-faq', label: 'Questions first' }
        ]}
        visual={<InternshipsVisual photo={heroPhoto} tracks={INTERNSHIP_TRACKS} />}
      />

      {/* Main Portal Container */}
      <div id="apply" className="lx-wrap cx-portal" ref={revealRef}>
        {submittedData ? (
          /* ================================================================
             SUCCESS CONFIRMATION VIEW
             ================================================================ */
          <div className="cx-card cx-success">
            <div className="cx-success-badge">
              <Check className="h-9 w-9" strokeWidth={2.5} aria-hidden="true" />
            </div>

            <span className="lx-label cx-success-label">Application Received</span>

            <h2 className="cx-success-title">
              Congratulations, {submittedData.name}!
            </h2>

            <p className="cx-success-lede">
              Your application for <strong>{submittedData.track}</strong> is in.
            </p>

            {/* Application Summary Box */}
            <dl className="cx-summary">
              <div className="cx-summary-row cx-summary-row--ref">
                <dt>Application Ref</dt>
                <dd className="cx-summary-ref tabular">{submittedData.refId}</dd>
              </div>
              <div className="cx-summary-row">
                <dt>Selected Domain</dt>
                <dd>{submittedData.track}</dd>
              </div>
              <div className="cx-summary-row">
                <dt>Duration &amp; Mode</dt>
                <dd>{submittedData.duration} · {submittedData.workMode}</dd>
              </div>
              <div className="cx-summary-row">
                <dt>Contact Email</dt>
                <dd>{submittedData.email}</dd>
              </div>
            </dl>

            {/* Next steps timeline */}
            <div className="cx-next">
              <h3 className="cx-next-title">
                <Clock className="h-4 w-4" aria-hidden="true" /> What Happens Next?
              </h3>
              <ol className="cx-next-list">
                <li>Our technical evaluation team reviews your profile within <strong>1–2 business days</strong>.</li>
                <li>Shortlisted candidates will receive a screening task or technical interview invite via WhatsApp/Email.</li>
                <li>Successful applicants receive the official offer letter and cohort onboarding schedule.</li>
              </ol>
            </div>

            <div className="cx-success-actions">
              <Link to="/courses" className="btn lx-btn">
                Explore Free Courses
                <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
              </Link>
              <button type="button" onClick={resetForm} className="btn lx-btn-ghost">
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             MAIN INTERNSHIP APPLICATION FORM
             ================================================================ */
          <div className="cx-portal-grid">
            {/* Left Column: the form */}
            <div className="cx-card cx-form-card" data-reveal>
              <div className="cx-form-head">
                <span className="lx-label">Application</span>
                <h2 className="cx-form-title">Your <em>application.</em></h2>
                <p className="cx-form-note">Fields marked * are required.</p>
              </div>

              {serverError && (
                <div className="cx-alert" role="alert">
                  <AlertCircle size={18} aria-hidden="true" /> {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="cx-form">
                {/* Honeypot for bot spam prevention */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Section 1: Choose Your Internship Track */}
                <div className="cx-step cx-step--track">
                  <label htmlFor="internshipTitle" className="cx-step-head">
                    <span className="cx-step-num" aria-hidden="true">01</span>
                    <span>Choose a track *</span>
                  </label>
                  <select
                    id="internshipTitle"
                    name="internshipTitle"
                    value={formData.internshipTitle}
                    onChange={handleChange}
                    className="cx-glass-input cx-glass-input-noicon cx-glass-select cx-track-select"
                  >
                    {INTERNSHIP_TRACKS.map((t) => (
                      <option key={t.id} value={t.title}>
                        {shortTrack(t.title)}
                      </option>
                    ))}
                  </select>
                  {errors.internshipTitle && (
                    <p className="cx-field-error"><AlertCircle size={14} aria-hidden="true" /> {errors.internshipTitle}</p>
                  )}

                  {/* Duration & Mode Row */}
                  <div className="cx-grid-2 cx-track-row">
                    <div>
                      <label htmlFor="duration" className="cx-field-label">
                        Duration
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon cx-glass-select"
                      >
                        <option value="6 Weeks">6 weeks (for university)</option>
                        <option value="8 Weeks">8 weeks (for university)</option>
                        <option value="1 Month">1 month</option>
                        <option value="2 Months">2 months</option>
                        <option value="3 Months">3 months</option>
                        <option value="Summer Internship">Summer (university credit)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="workMode" className="cx-field-label">
                        Work mode
                      </label>
                      <select
                        id="workMode"
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon cx-glass-select"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-Site">On-site studio</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal Information */}
                <div className="cx-step">
                  <h3 className="cx-step-head">
                    <span className="cx-step-num" aria-hidden="true">02</span>
                    About you
                  </h3>

                  <div className="cx-grid-2">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="cx-field-label">
                        Full name *
                      </label>
                      <div className="cx-input-wrap">
                        <User className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="e.g. Ayesha Khan"
                          value={formData.name}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.name && <p className="cx-field-error"><AlertCircle size={14} aria-hidden="true" /> {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="cx-field-label">
                        Email *
                      </label>
                      <div className="cx-input-wrap">
                        <Mail className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="ayesha.khan@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.email && <p className="cx-field-error"><AlertCircle size={14} aria-hidden="true" /> {errors.email}</p>}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label htmlFor="phone" className="cx-field-label">
                        Phone or WhatsApp *
                      </label>
                      <div className="cx-input-wrap">
                        <Phone className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="e.g. +92 300 1234567"
                          value={formData.phone}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.phone && <p className="cx-field-error"><AlertCircle size={14} aria-hidden="true" /> {errors.phone}</p>}
                    </div>

                    {/* City / Location */}
                    <div>
                      <label htmlFor="city" className="cx-field-label">
                        City
                      </label>
                      <div className="cx-input-wrap">
                        <MapPin className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="e.g. Lahore, Karachi, Islamabad"
                          value={formData.city}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Background */}
                <div className="cx-step">
                  <h3 className="cx-step-head">
                    <span className="cx-step-num" aria-hidden="true">03</span>
                    Your studies
                  </h3>

                  <div className="cx-grid-2">
                    {/* University / Institute */}
                    <div>
                      <label htmlFor="university" className="cx-field-label">
                        University or college
                      </label>
                      <div className="cx-input-wrap">
                        <GraduationCap className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="university"
                          name="university"
                          placeholder="e.g. NUST, FAST, COMSATS"
                          value={formData.university}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>

                    {/* Degree & Semester */}
                    <div>
                      <label htmlFor="degree" className="cx-field-label">
                        Degree and year
                      </label>
                      <div className="cx-input-wrap">
                        <Globe className="cx-input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="degree"
                          name="degree"
                          placeholder="e.g. BSCS, 3rd year"
                          value={formData.degree}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Skills & Portfolio Links */}
                <div className="cx-step">
                  <h3 className="cx-step-head">
                    <span className="cx-step-num" aria-hidden="true">04</span>
                    Skills and links
                  </h3>

                  <div className="cx-stack">
                    {/* Relevant Skills */}
                    <div>
                      <label htmlFor="skills" className="cx-field-label">
                        Key skills *
                      </label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        placeholder="e.g. React, Node.js, Python, Figma"
                        value={formData.skills}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon"
                        required
                      />
                      {errors.skills && <p className="cx-field-error"><AlertCircle size={14} aria-hidden="true" /> {errors.skills}</p>}
                    </div>

                    {/* Resume / Portfolio Link */}
                    <div>
                      <label htmlFor="resumeLink" className="cx-field-label">
                        Resume, GitHub or portfolio link
                      </label>
                      <input
                        type="url"
                        id="resumeLink"
                        name="resumeLink"
                        placeholder="https://github.com/ayeshakhan"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon"
                        aria-describedby="resumeLink-hint"
                      />
                      <p id="resumeLink-hint" className="cx-field-hint">
                        Make sure the link is publicly accessible.
                      </p>
                    </div>

                    {/* Statement of Interest */}
                    <div>
                      <label htmlFor="coverLetter" className="cx-field-label">
                        Why this internship? (optional)
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={3}
                        placeholder="Projects you have built, and what you hope to learn"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        className="cx-glass-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="cx-submit-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn lx-btn cx-submit"
                  >
                    {submitting ? (
                      <>
                        <span className="cx-spinner animate-spin" aria-hidden="true" />
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <span>Submit application</span>
                        <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
                      </>
                    )}
                  </button>
                  <p className="cx-privacy">
                    <Lock size={13} aria-hidden="true" /> Used only to review your application.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: benefits and eligibility */}
            <aside className="cx-rail" aria-label="Program benefits">
              <div className="cx-rail-card" data-reveal>
                <div className="cx-rail-photo lx-frame" data-reveal-media>
                  <img src={deskPhoto.src} alt={deskPhoto.alt} loading="lazy" decoding="async" />
                </div>
                <div className="cx-rail-inner">
                  <span className="lx-label">Program benefits</span>
                  <h3 className="cx-rail-title">Why join <em>Cortexis?</em></h3>

                  <ol className="cx-perks">
                    {PERKS.map((p, i) => (
                      <li key={p.title} className="cx-perk">
                        <span className="cx-perk-num tabular" aria-hidden="true">{pad(i + 1)}</span>
                        <div>
                          <h4 className="cx-perk-title">{p.title}</h4>
                          <p className="cx-perk-desc">{p.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="cx-rail-card cx-rail-card--pad" data-reveal>
                <h4 className="cx-rail-sub">Eligibility criteria</h4>
                <ul className="cx-elig">
                  {ELIGIBILITY.map((item) => (
                    <li key={item}>
                      <span className="cx-elig-mark" aria-hidden="true"><Check size={11} strokeWidth={2.75} /></span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="cx-rail-foot">
                  <span>Questions?</span>
                  <Link to="/contact" className="lx-link">
                    Contact admissions <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <div id="internship-faq" className="cx-faq-wrap">
        <FaqSection page="/internships" title="Questions about the internships" />
      </div>
    </main>
  );
}
