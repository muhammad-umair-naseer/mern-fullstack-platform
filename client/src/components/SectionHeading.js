import React from 'react';

/**
 * Premium centered section heading: a gradient eyebrow label, the title with a
 * gradient underline accent, and a subtitle. Children are marked `data-reveal`
 * so an ancestor useRevealOnScroll animates them in.
 */
export default function SectionHeading({ eyebrow, title, subtitle, id, titleClassName = 'section-title' }) {
  return (
    <div className="section-head">
      {eyebrow && (
        <span className="section-eyebrow" data-reveal>
          <span className="section-eyebrow-dot" />
          {eyebrow}
        </span>
      )}
      <h2 id={id} className={titleClassName} data-reveal>
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle" data-reveal>
          {subtitle}
        </p>
      )}
    </div>
  );
}
