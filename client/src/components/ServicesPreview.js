import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import './ServicesPreview.css';
import customSoftwareImg from '../assets/services/custom-software-development.webp';
import aiAutomationImg from '../assets/services/ai-automation.webp';
import saasImg from '../assets/services/saas-platform-development.webp';

const ServicesPreview = () => {
  const scope = useRevealOnScroll();
  const services = [
    {
      title: "Custom Software",
      description: "Enterprise-grade bespoke software and scalable cloud architecture.",
      image: customSoftwareImg
    },
    {
      title: "AI Automation",
      description: "Intelligent autonomous agents and automated LLM workflows.",
      image: aiAutomationImg
    },
    {
      title: "SaaS Platform Development",
      description: "High-growth multi-tenant SaaS platforms built for scale.",
      image: saasImg
    }
  ];

  return (
    <section className="services-container" aria-labelledby="services-heading" ref={scope}>
      <div className="container">
        <SectionHeading
          id="services-heading"
          eyebrow="What we do"
          title="Our Services"
          subtitle="Outcome-focused solutions delivered by experienced engineers and designers"
        />

        <ul className="services-row row" aria-label="Service cards">
          {services.map((service, index) => {
            const titleId = `service-title-${index}`;
            return (
              <li key={index} className="col-md-4 mb-4" data-reveal>
                <Link to="/services" className="card service-preview-card h-100 service-link" aria-labelledby={titleId}>
                  <div className="service-media">
                    <img src={service.image} className="card-img-top" alt="" loading="lazy" />
                    <span className="visually-hidden">{service.title}</span>
                  </div>
                  <div className="card-body">
                    <h3 id={titleId} className="card-title">{service.title}</h3>
                    <p className="card-text">{service.description}</p>
                    <span className="service-cta">Learn more</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="text-center" data-reveal>
          <Link to="/services" className="btn-view-all">View All Services</Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
