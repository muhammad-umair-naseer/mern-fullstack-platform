import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BlogFaq = ({ faqs = [] }) => {
  const [openIndexes, setOpenIndexes] = useState([0]); // Open first item by default

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="cx-lv-in my-12 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/60 to-white p-6 sm:p-8 shadow-sm">
      {/* Section Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Answers & Clarity
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-0 p-0">
            Frequently Asked Questions
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
          {faqs.length} Questions
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-orange-300 bg-white shadow-sm ring-1 ring-orange-400/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold text-slate-900">
                  {faq.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                    isOpen
                      ? 'bg-orange-600 text-white rotate-180'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-3">
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 m-0 whitespace-pre-line font-normal">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BlogFaq;
