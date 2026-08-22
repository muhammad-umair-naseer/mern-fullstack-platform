import React from 'react';
import './ProcessSection.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import { Compass, Cpu, CloudLightning, LineChart } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Compass,
    title: 'Discover & Architect',
    desc: 'We analyze your business requirements, define the technical blueprint, design database schemas, and create high-fidelity system specifications.',
    color: '#3b82f6',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'Agile Engineering',
    desc: 'Our engineers build clean, modular, test-driven software and custom AI pipelines with regular sprint demos and live staging environments.',
    color: '#f97316',
  },
  {
    num: '03',
    icon: CloudLightning,
    title: 'Deploy & Automate',
    desc: 'Automated CI/CD pipelines, containerized cloud infrastructure, and intelligent agentic workflows are deployed with zero downtime.',
    color: '#8b5cf6',
  },
  {
    num: '04',
    icon: LineChart,
    title: 'Scale & Optimize',
    desc: 'Real-time telemetry, 24/7 SLA monitoring, load testing, and continuous feature evolution keep your platform ahead of competition.',
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
          eyebrow="How We Deliver"
          title="Our Proven Engineering Framework"
          subtitle="From initial concept to enterprise-scale deployment, our transparent four-stage methodology ensures on-time, high-impact delivery."
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
