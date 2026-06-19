import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../config"; // ✅ use base URL

export default function InternshipForm({ internshipTitle, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    internshipTitle: internshipTitle || "",
    skills: "",
    notes: "",
    company: "" // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, internshipTitle: internshipTitle || "" }));
  }, [internshipTitle]);

  const normalizePhone = useMemo(
    () => (value) => value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, ""),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === "phone" ? normalizePhone(value) : value;
    setForm((f) => ({ ...f, [name]: next }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "phone": {
        const v = normalizePhone(value);
        const localOK = /^0[3]\d{9}$/.test(v);     // 03XXYYYYYYY
        const intlOK = /^\+92[3]\d{9}$/.test(v);   // +923XXYYYYYYY
        if (!v) error = "Phone number is required";
        else if (!(localOK || intlOK)) error = "Enter a valid PK number (e.g., 03001234567 or +923001234567)";
        break;
      }
      case "skills":
        if (!value.trim()) error = "Please list your relevant skills";
        break;
      case "notes":
        if (!value.trim()) error = "Please tell us why we should select you";
        break;
      default:
        break;
    }

    setErrors((er) => ({ ...er, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(form).forEach((key) => {
      if (key !== "internshipTitle" && key !== "company") {
        if (!validateField(key, form[key])) isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot
    if (form.company) {
      setStatus("❌ Submission blocked");
      return;
    }

    setTouched({
      name: true,
      email: true,
      phone: true,
      skills: true,
      notes: true
    });

    if (!validateForm()) {
      setStatus("Please fix the errors above");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting...");

    try {
      // Normalize PK local number to +92
      let phone = form.phone;
      if (/^0[3]\d{9}$/.test(phone)) {
        phone = "+92" + phone.slice(1);
      }

      const res = await fetch(`${API_BASE_URL}/api/internships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("✅ Application submitted successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          internshipTitle: internshipTitle || "",
          skills: "",
          notes: "",
          company: ""
        });
        setErrors({});
        setTouched({});
        // setTimeout(() => onClose?.(), 1200);
      } else {
        if (data?.errors && typeof data.errors === "object") {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        }
        setStatus("❌ " + (data.message || "Failed to submit application"));
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <div className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
        {/* Honeypot */}
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.6"/><path d="M20 21a7.5 7.5 0 1 0-16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  errors.name ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="Ayesha Siddiqui"
                required
              />
            </div>
            {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="ayesha.siddiqui@example.com"
                required
              />
            </div>
            {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number (PK) *
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v14l-4-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  errors.phone ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="03001234567 or +923001234567"
                required
              />
            </div>
            <p id="phone-help" className="mt-1 text-xs text-slate-500">
              Use Pakistani format: 03XXXXXXXXX or +92 3XXXXXXXXX
            </p>
            {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">
              Relevant Skills *
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M18 12H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <input
                type="text"
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.skills}
                aria-describedby={errors.skills ? "skills-error" : "skills-help"}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  errors.skills ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="React, Python, UI/UX, Flutter, DevOps"
                required
              />
            </div>
            <p id="skills-help" className="mt-1 text-xs text-slate-500">
              Tip: List 3–6 skills relevant to the internship.
            </p>
            {errors.skills && <p id="skills-error" className="mt-1 text-sm text-red-600">{errors.skills}</p>}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            Why should we select you? *
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? "notes-error" : "notes-help"}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
              errors.notes ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Final-year CS student at NUST, built 2 React apps and a Python API; eager to learn in a real team."
            required
          />
          <p id="notes-help" className="mt-1 text-xs text-slate-500">
            Mention studies, key projects, and your motivation.
          </p>
          {errors.notes && <p id="notes-error" className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        </div>
      </div>

      {/* Actions + Status */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white shadow-md ${
            submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </motion.button>
      </div>

      {status && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center mt-3 p-3 rounded-lg ${
          status.includes("✅")
            ? "bg-green-100 text-green-700 border border-green-200"
            : status.includes("❌")
            ? "bg-red-100 text-red-700 border border-red-200"
            : "bg-blue-100 text-blue-700 border border-blue-200"
        }`}>
          {status}
        </motion.div>
      )}
    </motion.form>
  );
}
