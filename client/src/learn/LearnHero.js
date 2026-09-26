import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PhotoVisual from '../components/PhotoVisual';
// PhotoVisual's frame, drift and chips are styled alongside PageHero.
import '../components/PageHero.css';
import './Learn.css';

/**
 * The compact hero the quiz pages open with: a back link, a mono label, the
 * title rising out of its line mask, one line of lede, a row of mono facts,
 * and a photograph in a glass frame on the right.
 *
 *   back   { to, label }
 *   label  short mono label, e.g. "Chapter 3 quiz"
 *   index  copper number shown before the label (optional)
 *   title  the headline (a course or chapter title)
 *   lede   one short sentence
 *   meta   short mono facts
 *   photo  { src, alt }
 *   chips  PhotoVisual chips, [{ value, label }]
 */
export default function LearnHero({ back, label, index, title, lede, meta = [], photo, chips = [] }) {
  const long = String(title || '').length > 28;

  return (
    <header className="lp-hero">
      <div className="lp-hero-copy">
        {back && (
          <Link to={back.to} className="lp-back">
            <ArrowLeft size={14} aria-hidden="true" /> {back.label}
          </Link>
        )}

        {label && (
          <span className="lx-label lp-label">
            {index && <span className="lx-label-num">{index}</span>}
            {label}
          </span>
        )}

        <h1 className={`lp-title${long ? ' lp-title--long' : ''}`} aria-label={title}>
          <span className="lx-line" aria-hidden="true" style={{ '--i': 0 }}>
            <span>{title}</span>
          </span>
        </h1>

        {lede && <p className="lp-lede">{lede}</p>}

        {meta.length > 0 && (
          <ul className="lp-meta">
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      {photo && (
        <div className="lp-hero-visual">
          <PhotoVisual photo={photo} ratio="5 / 4" chips={chips} />
        </div>
      )}
    </header>
  );
}
