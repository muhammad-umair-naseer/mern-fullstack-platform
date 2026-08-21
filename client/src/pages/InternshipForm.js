import React from 'react';
import { useInternshipForm } from '../hooks/useInternshipForm';

/**
 * Internship application form — markup only. State, validation and submission
 * live in useInternshipForm.
 */
export default function InternshipForm({ internshipTitle, onClose }) {
  const { errors, form, handleBlur, handleChange, handleSubmit, introRef, status, submitting } = useInternshipForm(internshipTitle, onClose);

  return (
    <form
      ref={introRef}
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <div className="rounded-xl border border-white/10 bg-white/5 p-5" data-intro>
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
      <div className="flex items-center justify-between gap-3" data-intro>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform ${
            submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>

      {status && (
        <div className={`text-center mt-3 p-3 rounded-lg ${
          status.includes("✅")
            ? "bg-green-100 text-green-700 border border-green-200"
            : status.includes("❌")
            ? "bg-red-100 text-red-700 border border-red-200"
            : "bg-blue-100 text-blue-700 border border-blue-200"
        }`}>
          {status}
        </div>
      )}
    </form>
  );
}

