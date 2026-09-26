import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import './TableOfContents.css';

/**
 * The article's contents: a warm glass panel with one numbered row per
 * section. Choosing a row scrolls to the heading, and the heading briefly
 * glows copper so the eye lands on it.
 */
const TableOfContents = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Restart the glow even if the same heading is chosen twice in a row.
    element.classList.remove('cx-toc-flash');
    void element.offsetWidth;
    element.classList.add('cx-toc-flash');
    element.addEventListener('animationend', () => element.classList.remove('cx-toc-flash'), { once: true });
  };

  return (
    <nav className="cx-toc cx-lv-in" aria-labelledby="cx-toc-title">
      <div className="cx-toc-head">
        <h2 id="cx-toc-title" className="cx-toc-title">Contents</h2>
        <span className="cx-toc-count tabular">{String(items.length).padStart(2, '0')}</span>
      </div>

      <ol className="cx-toc-list">
        {items.map((item, index) => (
          <li key={item.id || index} style={{ '--i': index }}>
            <button type="button" className="cx-toc-row" onClick={() => scrollToHeading(item.id)}>
              <span className="cx-toc-num tabular">{String(index + 1).padStart(2, '0')}</span>
              <span className="cx-toc-text">{item.title}</span>
              <ArrowDownRight className="cx-toc-go" size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
