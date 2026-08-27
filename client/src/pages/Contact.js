import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';
import API_BASE_URL from '../config';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import Seo from '../seo/Seo';
import { organization, breadcrumbs } from '../seo/schema';

const Contact = () => {
  const introRef = useIntroTimeline();
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
    { icon: Mail, label: 'Email', value: 'cortexis.solution.hub@gmail.com', href: 'mailto:cortexis.solution.hub@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+92 347-5769500', href: 'tel:+923475769500' },
    { icon: MapPin, label: 'Address', value: 'Islamabad, Pakistan', href: 'https://maps.google.com/?q=Islamabad' }
  ];

  const perks = [
    { icon: Clock, text: 'Reply within 1 business day' },
    { icon: ShieldCheck, text: 'Your details stay private' },
    { icon: Zap, text: 'Free, no-obligation scoping call' },
  ];

  const inputBase = 'mt-1 w-full px-4 py-3 rounded-xl border transition focus:ring-4 focus:ring-brand-sky-400/60 outline-none';

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <Seo
        title="Contact Us"
        description="Start a project, ask about training, or apply for an internship. Tell us what you are building and the Cortexis engineering team in Islamabad will reply."
        path="/contact"
        schema={[organization(), breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      {/* Floating glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-brand-magenta/15 blur-3xl" />

      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[460px_1fr] items-start gap-10 px-6">
          {/* ── Rail ─────────────────────────────────────────────────── */}
          <div className="relative">
            <div className="sticky top-24 space-y-5">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070e1e] via-[#0b1a30] to-[#0f2744] p-8 text-white shadow-2xl border border-orange-500/30">
                <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-bold text-orange-300 ring-1 ring-orange-400/40 backdrop-blur">
                    <Sparkles className="h-4 w-4 text-orange-400" /> Let’s talk
                  </span>
                  <h1 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight text-white">Contact Cortexis Solution Hub</h1>
                  <p className="mt-3 text-slate-200 font-medium">Tell us about your goals. We reply within one business day (PKT) to make something remarkable together.</p>

                  <ul className="mt-6 space-y-3">
                    {perks.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-100 font-medium">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-500/20 ring-1 ring-orange-400/30 text-orange-300">
                          <p.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm">{p.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-3">
                {chips.map((c, i) => (
                  <a key={i} href={c.href} className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-orange-400">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-glow">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">{c.label}</p>
                      <p className="truncate font-bold text-black group-hover:text-orange-600">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form ─────────────────────────────────────────────────── */}
          <section
            ref={introRef}
            className="relative rounded-3xl bg-white p-6 sm:p-9 shadow-cardLg ring-1 ring-slate-200"
          >
            <div className="mb-6" data-intro>
              <span className="section-eyebrow"><span className="section-eyebrow-dot" /> Project brief</span>
              <h2 className="mt-3 text-2xl font-extrabold text-black">Start the conversation</h2>
              <p className="mt-1 text-black font-medium">Share your goals, users and timelines. The more context you give, the better.</p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-300 ring-1 ring-emerald-400/30" role="status">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Thanks! A specialist will reach out shortly.</span>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-rose-500/10 p-4 text-rose-300 ring-1 ring-rose-400/30" role="alert">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Something went wrong. Please try again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" data-intro noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
                  <input
                    id="name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Ahsan Raza"
                    className={`${inputBase} ${errors.name ? 'border-rose-400' : 'border-slate-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email *</label>
                  <input
                    id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="ahsan.raza@gmail.com"
                    className={`${inputBase} ${errors.email ? 'border-rose-400' : 'border-slate-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    id="phone" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`${inputBase} border-slate-300`}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    id="subject" name="subject" value={formData.subject} onChange={handleChange}
                    placeholder="Website redesign inquiry"
                    className={`${inputBase} border-slate-300`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message *</label>
                <textarea
                  id="message" name="message" rows="6" value={formData.message} onChange={handleChange}
                  placeholder="Share scope, users, tech stack, and deadlines…"
                  className={`${inputBase} ${errors.message ? 'border-rose-400' : 'border-slate-300'}`}
                />
                {errors.message && <p className="mt-1 text-sm text-rose-400">{errors.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent to-brand-magenta px-7 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending…' : <>Send Message <Send className="h-4 w-4" /></>}
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Contact;
