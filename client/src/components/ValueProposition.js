import React from 'react';
import './ValueProposition.css';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import { 
  Code2, 
  Bot, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: Code2,
    badge: 'Precision Code',
    title: 'Custom Software Architecture',
    desc: 'Bespoke, enterprise-grade software engineered without bloat. Modular microservices and scalable APIs designed to handle millions of requests flawlessly.',
    highlights: ['Microservices & Event-Driven', 'Multi-Tenant Scale', 'Clean Architecture'],
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  {
    icon: Bot,
    badge: 'AI & Automation',
    title: 'Autonomous AI Integration',
    desc: 'Transform manual operations into intelligent, self-operating systems with custom LLM agents, smart workflow automation, and proprietary RAG pipelines.',
    highlights: ['Custom Autonomous Agents', 'RAG & Vector Knowledge Bases', 'Intelligent Robotic Automation'],
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.15)',
  },
  {
    icon: Zap,
    badge: 'Fast Delivery',
    title: 'High-Velocity Execution',
    desc: 'Ship production-ready solutions in weeks instead of months. Our agile engineering sprints and continuous deployment pipelines guarantee rapid time-to-market.',
    highlights: ['Automated CI/CD Workflows', 'Rapid MVP Prototyping', 'Zero-Downtime Releases'],
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.15)',
  },
  {
    icon: ShieldCheck,
    badge: 'Enterprise Grade',
    title: 'Bank-Grade Security & SLA',
    desc: 'Built-in zero-trust security models, SOC2/GDPR compliance preparedness, and 99.99% uptime architectures to protect your mission-critical data.',
    highlights: ['Zero-Trust Architecture', 'End-to-End Encryption', '24/7 Dedicated Reliability'],
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
];

export default function ValueProposition() {
  const scope = useRevealOnScroll();

  return (
    <section className="value-prop-section" ref={scope} aria-labelledby="value-prop-heading">
      <div className="container">
        <SectionHeading
          id="value-prop-heading"
          eyebrow="Why Choose Cortexis"
          title="Architecting Intelligence, Engineered for Scale"
          subtitle="We bridge the gap between ambitious business vision and bulletproof technical execution with modern software and autonomous AI."
        />

        <div className="value-grid">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx} 
                className="value-card" 
                data-reveal
                style={{ '--accent-color': p.color, '--accent-glow': p.glow }}
              >
                <div className="value-card-top">
                  <div className="value-icon-box">
                    <Icon className="value-icon" size={26} />
                  </div>
                  <span className="value-badge">{p.badge}</span>
                </div>

                <h3 className="value-title">{p.title}</h3>
                <p className="value-desc">{p.desc}</p>

                <div className="value-highlights">
                  {p.highlights.map((h, i) => (
                    <span key={i} className="highlight-tag">
                      <span className="tag-dot" /> {h}
                    </span>
                  ))}
                </div>

                <div className="value-card-footer">
                  <Link to="/services" className="value-link">
                    Explore capabilities <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Core Metrics Banner */}
        <div className="impact-metrics-banner" data-reveal>
          <div className="impact-col">
            <span className="impact-num">99.99%</span>
            <span className="impact-lbl">Uptime & System Reliability</span>
          </div>
          <div className="impact-divider" />
          <div className="impact-col">
            <span className="impact-num">50+</span>
            <span className="impact-lbl">Enterprise Systems Deployed</span>
          </div>
          <div className="impact-divider" />
          <div className="impact-col">
            <span className="impact-num">10x</span>
            <span className="impact-lbl">Operational Efficiency with AI</span>
          </div>
          <div className="impact-divider" />
          <div className="impact-col">
            <span className="impact-num">24/7</span>
            <span className="impact-lbl">Direct Engineering Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
