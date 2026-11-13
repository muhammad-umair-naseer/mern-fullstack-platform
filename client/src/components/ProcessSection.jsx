import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { processPhoto } from '../assets/home';
import './ProcessSection.css';
import Photo from './Photo.jsx';
import { useIdleGSAP } from '../hooks/useIdleGSAP';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The four stages of a client engagement.
 *
 * Every `desc` here is a promise someone will hold us to, so each one is
 * limited to what we can actually point at: a document, a link, a hand-over.
 * Anything that needed a number we could not evidence was cut rather than
 * softened — see the per-step notes below.
 *
 * The heading and a photograph hold still on the left while the steps pass
 * on the right, and a copper rule fills beside them in step with the scroll,
 * so the reader always knows how far through the process they are.
 */
const steps = [
  {
    num: '01',
    title: 'Scope',
    // "Fixed price for a fixed scope" was dropped: no pricing model is
    // documented anywhere in this repo. What survives is narrower and true —
    // the written scope states a cost, which says nothing about how we price.
    desc: 'A call, then a written scope and cost. You sign off before any code.',
  },
  {
    num: '02',
    // "Weekly demos" lost its cadence. The staging link and the demos are real
    // and observable; nothing in the repo or in any client agreement fixes them
    // to a seven-day rhythm. Restore "Weekly" only once a signed engagement
    // document commits to that interval.
    title: 'Build',
    desc: 'Real screens on a staging link, while changes are still cheap.',
  },
  {
    num: '03',
    title: 'Launch',
    // Kept in full: every item is a thing that changes hands at hand-over, so
    // it is checkable on the day rather than a claim about the future.
    desc: 'Deployment, then the repository, credentials and documentation.',
  },
  {
    num: '04',
    title: 'Support',
    // Dropped: "a named engineer", "a response time in writing" and "a set
    // number of hours". No staffing plan, SLA or hours allowance exists to back
    // them, and each would be an individual promise to a paying customer. What
    // remains is the shape of the arrangement, which is accurate. These come
    // back the day a support contract template lands in the repo.
    desc: 'Optional ongoing changes after launch.',
  },
];

export default function ProcessSection() {
  const scope = useRevealOnScroll();

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.lx-steps-progress',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.lx-steps', start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
          }
        );

        // The step crossing the reading line, a little below the middle of
        // the screen, lights its numeral in copper while the rule fills.
        gsap.utils.toArray('.lx-step', scope.current).forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 62%',
            end: 'bottom 62%',
            toggleClass: 'is-current',
          });
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section className="lx-process" ref={scope} aria-labelledby="process-heading">
      <div className="lx-wrap lx-process-grid">
        <div className="lx-process-aside">
          <div className="lx-process-sticky">
            <span className="lx-label" data-reveal><span className="lx-label-num">03</span>Process</span>
            <h2 id="process-heading" className="lx-h2" data-reveal>
              How a project <em>runs.</em>
            </h2>
            <div className="lx-frame lx-process-photo" data-reveal-media>
              <div className="lx-process-drift" data-parallax="5">
                <Photo src={processPhoto.src} srcSet={processPhoto.srcSet} avifSrcSet={processPhoto.avifSrcSet} sizes="(max-width: 760px) 90vw, 45vw" alt={processPhoto.alt} loading="lazy" decoding="async" width={processPhoto.w} height={processPhoto.h} />
              </div>
            </div>
          </div>
        </div>

        <div className="lx-steps">
          <span className="lx-steps-rail" aria-hidden="true">
            <span className="lx-steps-progress" />
          </span>
          <ol className="lx-steps-list">
          {steps.map((step) => (
            <li key={step.num} className="lx-step" data-reveal>
              <span className="lx-step-num tabular" aria-hidden="true">{step.num}</span>
              <div>
                <h3 className="lx-step-title">{step.title}</h3>
                <p className="lx-step-desc">{step.desc}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
