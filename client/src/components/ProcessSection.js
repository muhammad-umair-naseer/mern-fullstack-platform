import React from 'react';
import './ProcessSection.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import { Compass, Cpu, CloudLightning, LineChart } from 'lucide-react';

/**
 * The four stages of a client engagement.
 *
 * Every `desc` here is a promise someone will hold us to, so each one is
 * limited to what we can actually point at: a document, a link, a hand-over.
 * Anything that needed a number we could not evidence was cut rather than
 * softened — see the per-step notes below.
 *
 * `color` feeds the `--step-color` custom property the card CSS reads for its
 * hover border, numeral and icon tint, so the four values must stay distinct.
 * The icons are unchanged from the previous revision: they belong to the
 * visual design, not to the copy.
 */
const steps = [
  {
    num: '01',
    icon: Compass,
    title: 'Scope',
    // "Fixed price for a fixed scope" was dropped: no pricing model is
    // documented anywhere in this repo. What survives is narrower and true —
    // the written scope states a cost, which says nothing about how we price.
    desc: "A call, then a written scope: what we're building, what it costs, and when you'll see the first version. You sign off before we write a line of code.",
    color: '#3b82f6',
  },
  {
    num: '02',
    icon: Cpu,
    // "Weekly demos" lost its cadence. The staging link and the demos are real
    // and observable; nothing in the repo or in any client agreement fixes them
    // to a seven-day rhythm. Restore "Weekly" only once a signed engagement
    // document commits to that interval.
    title: 'Build',
    desc: "Demos on a staging link. You test real screens, not slides, and change direction while it's still cheap to.",
    color: '#f97316',
  },
  {
    num: '03',
    icon: CloudLightning,
    title: 'Launch',
    // Kept in full: every item is a thing that changes hands at hand-over, so
    // it is checkable on the day rather than a claim about the future.
    desc: 'Deployment, domain, monitoring, and a hand-over walkthrough. You receive the repository, the credentials, and the documentation.',
    color: '#8b5cf6',
  },
  {
    num: '04',
    icon: LineChart,
    title: 'Support',
    // Dropped: "a named engineer", "a response time in writing" and "a set
    // number of hours". No staffing plan, SLA or hours allowance exists to back
    // them, and each would be an individual promise to a paying customer. What
    // remains is the shape of the arrangement, which is accurate. These come
    // back the day a support contract template lands in the repo.
    desc: 'An optional ongoing arrangement after launch, covering changes and improvements to what we built.',
    color: '#10b981',
  },
];

export default function ProcessSection() {
  const scope = useRevealOnScroll();

  return (
    <section className="process-section" ref={scope} aria-labelledby="process-heading">
      <div className="container">
        <SectionHeading
          id="process-heading"
          eyebrow="Process"
          title="How a project runs"
          subtitle="Four stages. Each one ends with something you can see."
        />

        <div className="process-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="process-card" data-reveal style={{ '--step-color': step.color }}>
                <div className="process-card-header">
                  <span className="process-num">{step.num}</span>
                  <div className="process-icon-wrap">
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
                <div className="process-connector" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
