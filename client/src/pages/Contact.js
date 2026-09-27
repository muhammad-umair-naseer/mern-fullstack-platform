import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight, Check } from 'lucide-react';
import API_BASE_URL from '../config';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import PageHero from '../components/PageHero';
import ContactVisual from '../components/heroes/ContactVisual';
import { contactCity } from '../assets/unique';
import Seo from '../seo/Seo';
import { organization, breadcrumbs } from '../seo/schema';

const monument = contactCity;

// An email address may wrap before its "@" on a narrow screen, never inside
// a word.
const breakable = (value) => {
  const at = value.indexOf('@');
  if (at < 1) return value;
  return (
    <>
      {value.slice(0, at)}
      <wbr />
      {value.slice(at)}
    </>
  );
};

const Contact = () => {
  const revealRef = useRevealOnScroll();
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
    { icon: MapPin, label: 'Address', value: 'Pakistan', href: 'https://maps.google.com/?q=Pakistan' }
  ];

  const perks = ['Free scoping call', 'Details kept private'];

  const inputBase = 'mt-1 w-full px-4 py-3 rounded-xl border text-ink placeholder:text-ink-4 transition focus:border-orange-600 focus:ring-4 focus:ring-orange-200/70 outline-none';
  const labelBase = 'block text-sm font-medium text-ink-2';

  return (
    <main className="relative min-h-screen overflow-x-clip text-ink">
      <Seo
        title="Contact Us"
        description="Start a project, ask about training, or apply for an internship. Tell us what you are building and the Cortexis engineering team in Pakistan will reply."
        path="/contact"
        schema={[organization(), breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <PageHero
        label="Contact"
        lines={['Tell us what', <em key="em">you’re building.</em>]}
        lede="Projects, training or internships. We reply within one business day."
        actions={[
          { href: '#contact-form', label: 'Write to us', primary: true },
          { href: 'mailto:cortexis.solution.hub@gmail.com', label: 'Email us' },
        ]}
        visual={<ContactVisual />}
      />

      <section ref={revealRef} className="relative pb-24 md:pb-32" aria-label="Contact form and details">
        <div className="lx-wrap grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-10">
          {/* ── Direct lines ─────────────────────────────────────────── */}
          <aside className="order-2 grid min-w-0 grid-cols-1 gap-6 lg:order-1 lg:sticky lg:top-28" aria-label="Direct contact details">
            <div data-reveal className="lx-contact-panel lx-contact-rail">
              <span className="lx-label">Direct</span>
              <ul className="mt-3">
                {chips.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} className="lx-contact-line">
                      <span className="lx-contact-line-icon" aria-hidden="true">
                        <c.icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className="lx-contact-line-text">
                        <span className="lx-contact-line-label">{c.label}</span>
                        <span className="lx-contact-line-value">{breakable(c.value)}</span>
                      </span>
                      <ArrowUpRight size={16} className="lx-contact-line-arrow" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="lx-contact-perks">
                {perks.map((p) => (
                  <li key={p}>
                    <Check size={13} strokeWidth={2.4} aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="lx-contact-city">
              <div className="lx-frame lx-contact-city-frame" data-reveal-media>
                <img src={monument.src} alt={monument.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption className="lx-glass lx-contact-city-tag">Pakistan Monument</figcaption>
            </figure>
          </aside>

          {/* ── Form ─────────────────────────────────────────────────────
              The hero's "Write to us" lands on this wrapper, which never
              moves: the panel inside rises on reveal, and a transformed
              target would land 16px off. The next Tab is the Name field.
              py-0 cancels the site-wide section padding in Pages.css. */}
          <section id="contact-form" className="order-1 min-w-0 py-0 lg:order-2" aria-labelledby="contact-form-title">
            <div data-reveal className="lx-contact-panel lx-contact-panel--form">
              <div className="mb-8">
                <span className="lx-label">Project brief</span>
                <h2 id="contact-form-title" className="lx-contact-title">
                  Start the <em>conversation.</em>
                </h2>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200" role="status">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Thanks! A specialist will reach out shortly.</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-rose-800 ring-1 ring-rose-200" role="alert">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelBase}>Name *</label>
                    <input
                      id="name" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Ahsan Raza" autoComplete="name"
                      aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`${inputBase} ${errors.name ? 'border-rose-500' : 'border-stone-300'}`}
                    />
                    {errors.name && <p id="name-error" className="mt-1 text-sm text-rose-700">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelBase}>Email *</label>
                    <input
                      id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                      placeholder="ahsan.raza@gmail.com" autoComplete="email"
                      aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`${inputBase} ${errors.email ? 'border-rose-500' : 'border-stone-300'}`}
                    />
                    {errors.email && <p id="email-error" className="mt-1 text-sm text-rose-700">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className={labelBase}>Phone</label>
                    <input
                      id="phone" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+92 300 1234567" autoComplete="tel" inputMode="tel"
                      className={`${inputBase} border-stone-300`}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelBase}>Subject</label>
                    <input
                      id="subject" name="subject" value={formData.subject} onChange={handleChange}
                      placeholder="Website redesign inquiry"
                      className={`${inputBase} border-stone-300`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelBase}>Message *</label>
                  <textarea
                    id="message" name="message" rows="6" value={formData.message} onChange={handleChange}
                    placeholder="Share scope, users, tech stack, and deadlines…"
                    aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`${inputBase} ${errors.message ? 'border-rose-500' : 'border-stone-300'}`}
                  />
                  {errors.message && <p id="message-error" className="mt-1 text-sm text-rose-700">{errors.message}</p>}
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn lx-btn disabled:cursor-wait disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending…' : <>Send Message <span className="lx-btn-disc" aria-hidden="true"><Send size={14} /></span></>}
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Contact;
