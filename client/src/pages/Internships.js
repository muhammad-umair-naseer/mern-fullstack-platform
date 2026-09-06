import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Send,
  Clock,
  Laptop,
  Check,
  FileCode
} from "lucide-react";
import API_BASE_URL from "../config";
import "./Internships.css";
import Seo from '../seo/Seo';
import { breadcrumbs, faq as faqSchema } from '../seo/schema';
import FaqSection from '../components/FaqSection';
import { faqsFor } from '../data/faqs';

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
  {
    icon: Rocket,
    title: "Real Production Projects",
    desc: "Work on live products and client applications, not just toy tutorials."
  },
  {
    icon: Award,
    title: "SECP Registered Certificate",
    desc: "Earn an officially verifiable industry certificate & recommendation letter."
  },
  {
    icon: Laptop,
    title: "Flexible Remote & Hybrid",
    desc: "Collaborate from anywhere with agile sprint reviews and daily standups."
  },
  {
    icon: ShieldCheck,
    title: "1-on-1 Senior Mentorship",
    desc: "Direct guidance, code reviews, and architecture feedback from tech leads."
  }
];

export default function Internships() {
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
      err.phone = "Phone / WhatsApp number is required";
    } else {
      const cleanDigits = formData.phone.replace(/[^\d]/g, "");
      if (cleanDigits.length < 7 || cleanDigits.length > 16) {
        err.phone = "Please enter a valid phone number (e.g. +1 555 234 5678)";
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
      const firstError = document.querySelector(".cx-field-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
        window.scrollTo({ top: 120, behavior: "smooth" });
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
        title="Software Internships in Islamabad, Free to Join"
        description="Unpaid internships in web, mobile, AI, design and QA. We never charge a fee. Real projects, mentorship from working engineers, and a free certificate."
        path="/internships"
        schema={[breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Internships', path: '/internships' }]), faqSchema(faqsFor('/internships').map((f) => ({ q: f.q, a: f.a })))]}
      />
      {/* Ambient background glows for glassmorphism */}
      <div className="cx-intern-glow-1" aria-hidden="true" />
      <div className="cx-intern-glow-2" aria-hidden="true" />
      <div className="cx-intern-glow-3" aria-hidden="true" />

      {/* Hero Header Section */}
      <section className="relative z-10 pt-16 pb-8 md:pt-20 md:pb-12 text-center max-w-4xl mx-auto px-6">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs sm:text-sm font-bold text-orange-800 ring-1 ring-orange-300 shadow-sm"
        >
          Cortexis Internship Program {new Date().getFullYear()}
        </span>

        <h1
          className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black leading-[1.08]"
        >
          Apply for{" "}
          <span className="bg-gradient-to-r from-[#ff6b00] via-[#f97316] to-[#ea580c] bg-clip-text text-transparent">
            Cortexis Internship
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-black font-semibold max-w-2xl mx-auto leading-relaxed">
          Real projects, code reviews and mentorship from the engineers who ship the work.
        </p>
      </section>

      {/* Main Portal Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {submittedData ? (
          /* ================================================================
             SUCCESS CONFIRMATION VIEW (GLASSMORPHISM)
             ================================================================ */
          <div className="max-w-2xl mx-auto cx-glass-card p-8 sm:p-12 text-center animate-fade-in">
            <div className="cx-success-badge mx-auto">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>

            <span className="mt-6 inline-block text-xs uppercase tracking-widest font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Application Received
            </span>

            <h2 className="mt-3 text-3xl font-black text-black">
              Congratulations, {submittedData.name}!
            </h2>

            <p className="mt-3 text-black font-semibold text-base leading-relaxed">
              Your application for <span className="font-extrabold text-orange-600">{submittedData.track}</span> has been submitted successfully to the Cortexis talent acquisition team.
            </p>

            {/* Application Summary Box */}
            <div className="mt-8 rounded-2xl bg-white/90 border border-slate-200 p-6 text-left shadow-sm space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500">Application Ref</span>
                <span className="font-mono font-bold text-black text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {submittedData.refId}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-bold">Selected Domain</span>
                <span className="font-extrabold text-black text-right">{submittedData.track}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-bold">Duration &amp; Mode</span>
                <span className="font-bold text-black">{submittedData.duration} · {submittedData.workMode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-bold">Contact Email</span>
                <span className="font-bold text-black">{submittedData.email}</span>
              </div>
            </div>

            {/* Next steps timeline */}
            <div className="mt-8 rounded-2xl bg-orange-50/70 border border-orange-200 p-5 text-left">
              <h4 className="font-black text-black text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" /> What Happens Next?
              </h4>
              <ol className="mt-3 space-y-2 text-xs sm:text-sm text-black font-semibold list-decimal list-inside leading-relaxed">
                <li>Our technical evaluation team reviews your profile within <strong>1–2 business days</strong>.</li>
                <li>Shortlisted candidates will receive a screening task or technical interview invite via WhatsApp/Email.</li>
                <li>Successful applicants receive the official offer letter and cohort onboarding schedule.</li>
              </ol>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/courses"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-md hover:-translate-y-0.5 transition"
              >
                Explore Free Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-black hover:bg-slate-100 transition"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             MAIN INTERNSHIP APPLICATION FORM (GLASSMORPHISM)
             ================================================================ */
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            {/* Left Column: Interactive Glassmorphism Form */}
            <div className="cx-glass-card p-6 sm:p-10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black">Internship Application Form</h2>
                  <p className="text-black font-semibold text-sm mt-1">
                    Complete all required fields (*). Fast responses guaranteed.
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 items-center justify-center text-orange-600">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>

              {serverError && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-300 p-4 text-red-700 text-sm font-bold flex items-center gap-2">
                  <span>⚠️</span> {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200/80">
                  <label htmlFor="internshipTitle" className="cx-field-label text-orange-950 font-black text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    Select Internship Track / Domain *
                  </label>
                  <p className="text-xs text-black font-semibold mb-3">
                    Choose the specialization you want to pursue at Cortexis Solution Hub.
                  </p>
                  <div className="relative">
                    <select
                      id="internshipTitle"
                      name="internshipTitle"
                      value={formData.internshipTitle}
                      onChange={handleChange}
                      className="cx-glass-input cx-glass-input-noicon cx-glass-select font-bold text-black"
                    >
                      {INTERNSHIP_TRACKS.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.internshipTitle && (
                    <p className="cx-field-error">⚠️ {errors.internshipTitle}</p>
                  )}

                  {/* Duration & Mode Row */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="duration" className="cx-field-label text-xs">
                        Preferred Duration
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon cx-glass-select text-sm font-bold"
                      >
                        <option value="6 Weeks">6 Weeks (Standard University Requirement)</option>
                        <option value="8 Weeks">8 Weeks (Extended University Requirement)</option>
                        <option value="1 Month">1 Month (Fast-Track Certificate)</option>
                        <option value="2 Months">2 Months (Standard Project Cohort)</option>
                        <option value="3 Months">3 Months (Comprehensive Program)</option>
                        <option value="Summer Internship">Summer Internship (University Credit)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="workMode" className="cx-field-label text-xs">
                        Work Preference
                      </label>
                      <select
                        id="workMode"
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon cx-glass-select text-sm font-bold"
                      >
                        <option value="Remote">Remote (Work from Anywhere)</option>
                        <option value="Hybrid">Hybrid (Flexible In-Person / Remote)</option>
                        <option value="On-Site">On-Site Studio</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal Information */}
                <div>
                  <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    Personal &amp; Contact Details
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="cx-field-label">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.name && <p className="cx-field-error">⚠️ {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="cx-field-label">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.email && <p className="cx-field-error">⚠️ {errors.email}</p>}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label htmlFor="phone" className="cx-field-label">
                        Phone / WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="e.g. +1 (555) 234-5678"
                          value={formData.phone}
                          onChange={handleChange}
                          className="cx-glass-input"
                          required
                        />
                      </div>
                      {errors.phone && <p className="cx-field-error">⚠️ {errors.phone}</p>}
                    </div>

                    {/* City / Location */}
                    <div>
                      <label htmlFor="city" className="cx-field-label">
                        City / Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="e.g. Islamabad (or Remote)"
                          value={formData.city}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Background */}
                <div>
                  <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-orange-600" />
                    Academic Background
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* University / Institute */}
                    <div>
                      <label htmlFor="university" className="cx-field-label">
                        University / College Name
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          id="university"
                          name="university"
                          placeholder="e.g. Stanford University, MIT, UC Berkeley"
                          value={formData.university}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>

                    {/* Degree & Semester */}
                    <div>
                      <label htmlFor="degree" className="cx-field-label">
                        Degree Program / Current Year
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          id="degree"
                          name="degree"
                          placeholder="e.g. BS in Computer Science (Junior Year) / Recent Graduate"
                          value={formData.degree}
                          onChange={handleChange}
                          className="cx-glass-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Skills & Portfolio Links */}
                <div>
                  <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-orange-600" />
                    Technical Skills &amp; Profile Links
                  </h3>

                  <div className="space-y-4">
                    {/* Relevant Skills */}
                    <div>
                      <label htmlFor="skills" className="cx-field-label">
                        Key Skills &amp; Tools Known *
                      </label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        placeholder="e.g. React, Node.js, TypeScript, Python, Figma, PostgreSQL"
                        value={formData.skills}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon"
                        required
                      />
                      {errors.skills && <p className="cx-field-error">⚠️ {errors.skills}</p>}
                    </div>

                    {/* Resume / Portfolio Link */}
                    <div>
                      <label htmlFor="resumeLink" className="cx-field-label">
                        Resume Link / LinkedIn / GitHub / Portfolio URL
                      </label>
                      <input
                        type="url"
                        id="resumeLink"
                        name="resumeLink"
                        placeholder="https://linkedin.com/in/johndoe or https://github.com/johndoe"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        className="cx-glass-input cx-glass-input-noicon"
                      />
                      <p className="mt-1 text-xs text-slate-500 font-semibold">
                        Make sure shared drive or portfolio link permissions are publicly accessible.
                      </p>
                    </div>

                    {/* Statement of Interest */}
                    <div>
                      <label htmlFor="coverLetter" className="cx-field-label">
                        Why are you interested in this internship? (Optional)
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={3}
                        placeholder="Tell us about your background, key projects, and what you hope to achieve during this internship..."
                        value={formData.coverLetter}
                        onChange={handleChange}
                        className="cx-glass-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-4 px-8 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>Submitting Your Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Internship Application</span>
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-black font-semibold">
                    🔒 Your information is confidential and will only be used for internship evaluation at Cortexis.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Glassmorphism Info & Perks Rail */}
            <div className="space-y-6">
              {/* Dark Glass Card: Program Highlights */}
              <div className="cx-glass-card-dark p-7">
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-black text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                  <Award className="h-3.5 w-3.5" /> Program Benefits
                </span>

                <h3 className="mt-4 text-2xl font-black text-white">Why Join Cortexis?</h3>
                <p className="mt-2 text-slate-300 text-sm font-medium leading-relaxed">
                  We don't do boring mock assignments. You will build real-world software that gets deployed to production.
                </p>

                <div className="mt-6 space-y-3.5">
                  {PERKS.map((p, i) => (
                    <div key={i} className="cx-glass-perk">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        <p.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-snug">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Light Glass Card: Eligibility & Steps */}
              <div className="cx-glass-card p-6">
                <h4 className="font-black text-black text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Eligibility Criteria
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-black font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                    Enrolled or graduated CS, IT, SE, or Design students.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                    Basic understanding of chosen tech stack.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                    Dedication to attend weekly sprint syncs.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                    Passion to build high-quality software.
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Questions?</span>
                  <Link to="/contact" className="text-orange-600 hover:underline">
                    Contact Admissions →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    <FaqSection page="/internships" title="Questions about the internships" />
    </main>
  );
}
