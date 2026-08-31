import React, { useId, useState } from 'react';
import { faqsFor } from '../data/faqs';
import './FaqSection.css';

const Item = ({ q, a, open, onToggle, id }) => (
  <div className={`cx-faq-item ${open ? 'is-open' : ''}`}>
    <h3 className="cx-faq-q">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-a`}
        id={`${id}-q`}
        onClick={onToggle}
      >
        <span>{q}</span>
        <span className="cx-faq-mark" aria-hidden="true" />
      </button>
    </h3>
    {/* Rendered whether open or not, because a crawler and Cmd+F should both
        find the answer. Collapsing is presentation, not content. */}
    <div className="cx-faq-a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} hidden={!open}>
      <p>{a}</p>
    </div>
  </div>
);

/**
 * Questions for one page, answered where the question actually arises.
 *
 * A visitor deciding whether to hire us should not have to leave the services
 * page to find out what a project costs.
 */
const FaqSection = ({ page, title = 'Questions people ask', className = '' }) => {
  const items = faqsFor(page);
  const base = useId();
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <section className={`cx-faq ${className}`} aria-labelledby={`${base}-h`}>
      <h2 id={`${base}-h`} className="cx-faq-title">{title}</h2>
      <div className="cx-faq-list">
        {items.map((item, i) => (
          <Item
            key={item.q}
            id={`${base}-${i}`}
            q={item.q}
            a={item.a}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
