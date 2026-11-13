import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { COURSE_COUNT } from '../data/catalogue';
import { academyTeamPhoto } from '../assets/unique';
import { academyPhoto } from '../assets/home';
import './Academy.css';

/**
 * The learning side of the company, which the home page otherwise mentions
 * only as a number in the hero.
 *
 * Every line is a description of how the platform actually behaves: each
 * course is twelve chapters of four topics, every topic ends in a three
 * question quiz, every chapter in a test, the course in a final exam, and the
 * certificate carries a code that /certificate/:code checks publicly without
 * an account. The action lines link to /courses.
 */
const facts = [
  { k: '12', v: 'chapters in every course' },
  { k: '3', v: 'question quiz after every topic' },
  { k: '1', v: 'certificate, verifiable online' },
];

export default function Academy() {
  const scope = useRevealOnScroll();

  return (
    <section className="lx-academy" ref={scope} aria-labelledby="academy-heading">
      <div className="lx-wrap lx-academy-grid">
        <div className="lx-academy-media">
          <div className="lx-frame lx-academy-main" data-reveal-media>
            <div className="lx-academy-drift" data-parallax="4">
              <img src={academyPhoto.src} srcSet={academyPhoto.srcSet} sizes="(max-width: 760px) 90vw, 45vw" alt={academyPhoto.alt} loading="lazy" decoding="async" width={academyPhoto.w} height={academyPhoto.h} />
            </div>
          </div>
          <div className="lx-academy-inset" data-parallax="10">
            <div className="lx-frame lx-academy-inset-frame" data-reveal-media>
              <img src={academyTeamPhoto.src} srcSet={academyTeamPhoto.srcSet} sizes="(max-width: 760px) 50vw, 25vw" alt={academyTeamPhoto.alt} loading="lazy" decoding="async" width="900" height="675" />
            </div>
          </div>
        </div>

        <div className="lx-academy-copy">
          <span className="lx-label" data-reveal><span className="lx-label-num">04</span>Learn with us</span>
          <h2 id="academy-heading" className="lx-h2" data-reveal>
            {COURSE_COUNT} free courses, <em>verifiable certificates.</em>
          </h2>

          <dl className="lx-academy-facts">
            {facts.map((f) => (
              <div key={f.v} data-reveal>
                <dt className="tabular">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="lx-academy-actions" data-reveal>
            <Link to="/courses" className="btn lx-btn">
              Browse the courses
              <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
            </Link>
            <Link to="/courses" className="lx-link">
              Free certified courses, start learning <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
