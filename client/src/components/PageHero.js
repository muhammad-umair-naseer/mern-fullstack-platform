import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import './PageHero.css';

/**
 * The hero every inner page opens with.
 *
 * Deliberately short on words: a small numbered label, a headline of a few
 * words set as explicit lines (each rises out of its own mask), at most one
 * line of lede, and up to two actions. Everything else a page wants to say at
 * the top goes into `visual`: an animated or photographic element on the
 * right, which is where the page shows rather than tells.
 *
 * The entrance is CSS keyframes (see index.css), so the prerendered HTML
 * reaches its finished state with or without JavaScript.
 *
 * Props
 *   index     "01"-style number shown in copper before the label (optional)
 *   label     small mono label, a word or two
 *   lines     array of headline lines; strings or nodes, <em> for the italic
 *             copper phrase. Keep the whole headline under ~6 words.
 *   lede      one short sentence (optional)
 *   actions   [{ to | href, label, primary }], max two
 *   back      { to, label } small back link above the label (optional)
 *   meta      array of short strings shown as mono tags under the lede
 *   visual    node for the right column (see PhotoVisual for the default)
 *   align     'split' (default) or 'center' (no visual)
 *   id        heading id for aria-labelledby
 *   children  anything that must sit under the actions (rare)
 */
export default function PageHero({
  index,
  label,
  lines = [],
  lede,
  actions = [],
  back,
  meta,
  visual,
  align = 'split',
  id = 'page-hero-heading',
  children,
}) {
  const text = lines
    .map((l) => (typeof l === 'string' ? l : textOf(l)))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <section className={`lx-ph lx-ph--${visual && align === 'split' ? 'split' : 'center'}`} aria-labelledby={id}>
      <div className="lx-wrap lx-ph-grid">
        <div className="lx-ph-copy">
          {back && (
            <Link to={back.to} className="lx-ph-back">
              <ArrowLeft size={14} aria-hidden="true" /> {back.label}
            </Link>
          )}

          {label && (
            <span className="lx-label lx-ph-label">
              {index && <span className="lx-label-num">{index}</span>}
              {label}
            </span>
          )}

          <h1 id={id} className="lx-ph-title" aria-label={text}>
            {/* The space between lines is invisible (each line is a block)
                but keeps textContent readable for crawlers and share cards. */}
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && ' '}
                <span className="lx-line" aria-hidden="true" style={{ '--i': i }}>
                  <span>{line}</span>
                </span>
              </React.Fragment>
            ))}
          </h1>

          {lede && <p className="lx-ph-lede">{lede}</p>}

          {meta && meta.length > 0 && (
            <ul className="lx-ph-meta">
              {meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}

          {actions.length > 0 && (
            <div className="lx-ph-actions">
              {actions.slice(0, 2).map((a) => {
                const inner = a.primary ? (
                  <>
                    {a.label}
                    <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
                  </>
                ) : (
                  <>
                    {a.label} <ArrowRight size={16} aria-hidden="true" />
                  </>
                );
                const cls = a.primary ? 'btn lx-btn' : 'lx-link';
                if (a.to) {
                  return (
                    <Link key={a.label} to={a.to} className={cls}>
                      {inner}
                    </Link>
                  );
                }
                return (
                  <a key={a.label} href={a.href} className={cls} {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {inner}
                  </a>
                );
              })}
            </div>
          )}

          {children}
        </div>

        {visual && align === 'split' && <div className="lx-ph-visual">{visual}</div>}
      </div>
    </section>
  );
}

// Flattens a React node to its text, so the h1's accessible name reads as one
// sentence while its visual lines are split into masks.
function textOf(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node.props) return textOf(node.props.children);
  return '';
}
