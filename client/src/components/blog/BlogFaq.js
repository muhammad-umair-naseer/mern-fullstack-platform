import React from 'react';
import FaqSection from '../FaqSection';

/** A post's own questions, in the same folded list as the rest of the site. */
const BlogFaq = ({ faqs = [] }) => {
  if (!faqs.length) return null;

  return (
    <div className="cx-lv-in">
      <FaqSection
        className="cx-faq--inset"
        title={
          <>
            Questions, <em>answered</em>
          </>
        }
        items={faqs.map((f) => ({ q: f.question, a: f.answer }))}
      />
    </div>
  );
};

export default BlogFaq;
