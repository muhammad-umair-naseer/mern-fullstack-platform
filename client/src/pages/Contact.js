import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact`, formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (e2) {
      setSubmitStatus('error');
      console.error(e2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chips = [
    { label: 'Email', value: 'cortexis.solution.hub@gmail.com', href: 'mailto:cortexis.solution.hub@gmail.com' },
    { label: 'Phone', value: '+92347-5769500', href: 'tel:+92347-5769500' },
    { label: 'Address', value: 'Islamabad, Pakistan', href: 'https://maps.google.com/?q=Islamabd' }
  ];

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      {/* Left gradient rail — brand gradient */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[36vw] min-w-[320px] max-w-[560px] -skew-x-6 origin-left bg-gradient-to-br from-brand-indigo-700 to-brand-blue-700 shadow-2xl"></div>

      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[480px_1fr] items-start gap-10 px-6">
          {/* Rail content */}
          <div className="relative -skew-x-6">
            <div className="skew-x-6 sticky top-10">
              <div className="rounded-3xl bg-white/10 text-white backdrop-blur p-7 shadow-xl ring-1 ring-white/25">
                <h1 className="text-4xl font-extrabold leading-tight">Contact Cortexis Solution Hub</h1>
                <p className="text-white/90 mt-2">Response within one business day (PKT). Let’s make something remarkable.</p>
              </div>

              <div className="mt-6 grid gap-4">
                {chips.map((c, i) => (
                  <a key={i} href={c.href} className="skew-x-6 group rounded-2xl bg-white/10 text-white backdrop-blur p-4 shadow-lg ring-1 ring-white/20 hover:ring-white/40 transition">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2" />
                          <path d="M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold">{c.label}</p>
                        <p className="text-white/90 text-sm group-hover:text-white">{c.value}</p>
                      </div>
                    </div>
                  </a>
                ))}

                {/* Optional map preview (replace with real static map key or image) */}
             
              </div>
            </div>
          </div>

          {/* Form card — brand surfaces/buttons */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-white p-6 sm:p-8 shadow-cardLg ring-1 ring-slate-200"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Project brief</h2>
              <p className="text-slate-600">Tell us about goals, users, and timelines.</p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-4 rounded-xl bg-emerald-50 text-emerald-700 p-4">
                Thanks! A specialist will reach out shortly.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 rounded-xl bg-rose-50 text-rose-700 p-4">
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ahsan Raza"
                    className={`mt-1 w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-rose-400' : 'border-slate-300'} focus:ring-4 focus:ring-brand-sky-400/60 outline-none`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ahsan.raza@gmail.com"
                    className={`mt-1 w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-rose-400' : 'border-slate-300'} focus:ring-4 focus:ring-brand-sky-400/60 outline-none`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-sky-400/60 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Website redesign inquiry"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-sky-400/60 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share scope, users, tech stack, and deadlines…"
                  className={`mt-1 w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-rose-400' : 'border-slate-300'} focus:ring-4 focus:ring-brand-sky-400/60 outline-none`}
                />
                {errors.message && <p className="mt-1 text-sm text-rose-600">{errors.message}</p>}
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                disabled={isSubmitting}
                type="submit"
                className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-brand-blue-600 text-white font-semibold shadow-cardLg hover:bg-brand-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </motion.button>
            </form>
          </motion.section>
        </div>
      </section>
    </main>
  );
};

export default Contact;
