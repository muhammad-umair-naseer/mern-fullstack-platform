import React from 'react';
import { Link } from 'react-router-dom';
import { FAQS, FAQ_PAGES, faqsFor } from '../data/faqs';
import FaqSection from '../components/FaqSection';
import Seo from '../seo/Seo';
import { breadcrumbs, faq as faqSchema } from '../seo/schema';

const Faq = () => (
  <main className="bg-gray-50 text-gray-800 min-h-screen">
    <Seo
      title="Questions about our courses, internships, tools and work"
      description="Straight answers on what the courses cost, whether the internships are paid, where your files go, what a project costs, and whether WhatsApp will ban your number."
      path="/faq"
      schema={[
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]),
        faqSchema(FAQS.map((f) => ({ q: f.q, a: f.a }))),
      ]}
    />

    <header className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-700 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Questions</h1>
        <p className="mt-3 text-lg text-indigo-100/90">
          The things people actually ask, answered plainly. Where the honest answer is no, it
          says no.
        </p>
      </div>
    </header>

    {FAQ_PAGES.map(({ path, label }) =>
      faqsFor(path).length ? (
        <div key={path} className="border-b border-slate-200 last:border-0">
          <FaqSection page={path} title={label} />
          <div className="max-w-3xl mx-auto px-6 pb-10 -mt-10">
            <Link to={path} className="text-sm font-bold text-orange-700 hover:underline">
              Go to {label.toLowerCase()} &rarr;
            </Link>
          </div>
        </div>
      ) : null
    )}

    <section className="max-w-3xl mx-auto px-6 py-14 text-center">
      <h2 className="text-xl font-bold text-black">Something we have not answered?</h2>
      <p className="mt-2 text-black font-medium">
        Ask us directly. A real person reads it.
      </p>
      <Link
        to="/contact"
        className="mt-5 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Get in touch
      </Link>
    </section>
  </main>
);

export default Faq;
