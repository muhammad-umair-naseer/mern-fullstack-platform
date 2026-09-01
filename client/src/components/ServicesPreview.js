import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import './ServicesPreview.css';
import webDevImg from '../assets/services/web-development.webp';
import aiAutomationImg from '../assets/services/ai-automation.webp';
import saasImg from '../assets/services/saas-platform-development.webp';

/**
 * Home-page teaser for the twelve services.
 *
 * Deliberately not a map over data/services.js: this section groups the
 * catalogue into the three things a visitor actually arrives looking for
 * ("web and mobile" spans two services, "SaaS and e-commerce" spans two more),
 * so the copy here is editorial rather than a slice of the data file. Each card
 * still lands on a real /services/<slug> page, and those slugs are the ones
 * slugify() produces in data/services.js — keep them in sync if a title there
 * ever changes.
 *
 * The artwork is unchanged from the previous revision at the client's request.
 * If the first card's custom-software image should instead match the page it
 * now links to, serviceImage('web-development') in data/serviceImages.js already
 * has that asset.
 */
const ServicesPreview = () => {
  const scope = useRevealOnScroll();
  const services = [
    {
      title: "Web and mobile applications",
      description:
        "Internal tools, customer portals, booking systems, dashboards, and the mobile apps that go with them. Built to your workflow and delivered with the code.",
      image: webDevImg,
      to: "/services/web-development"
    },
    {
      title: "AI automation",
      description:
        "WhatsApp chatbots, document extraction, and LLM-powered workflows that take real, repetitive work off your team's plate.",
      image: aiAutomationImg,
      to: "/services/ai-automation"
    },
    {
      title: "SaaS and e-commerce platforms",
      description:
        "From first version to paying customers: multi-tenant architecture, billing, admin panels, storefronts, and the unglamorous parts that make a product sellable.",
      image: saasImg,
      to: "/services/saas-platform-development"
    }
  ];

  return (
    <section className="services-container" aria-labelledby="services-heading" ref={scope}>
      <div className="container">
        {/*
          The brief's subtitle read "Every project gets a senior engineer, a
          written scope, and a weekly demo." The weekly demo and the seniority
          of the assigned engineer are promises about how we staff and run a
          project, and nothing in the repo or the company's own material backs
          either one, so both are dropped. What survives is what we hand over,
          which the per-service deliverables in data/services.js do evidence:
          source code, documentation and a written spec. If a published,
          contractual delivery cadence or staffing commitment ever exists, this
          is the line to put it back into.
        */}
        <SectionHeading
          id="services-heading"
          eyebrow="Services"
          title="What we build"
          subtitle="Applications, automations and platforms built around the way you already work — handed over with the source code, the documentation and a written scope of what was built."
        />

        <ul className="services-row row" aria-label="Service cards">
          {services.map((service, index) => {
            const titleId = `service-title-${index}`;
            return (
              <li key={service.to} className="col-md-4 mb-4" data-reveal>
                <Link to={service.to} className="card service-preview-card h-100 service-link" aria-labelledby={titleId}>
                  <div className="service-media">
                    {/* alt is empty on purpose: the link is already named by the
                        card title via aria-labelledby, so alt text here would
                        make a screen reader announce the card twice. */}
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
          <Link to="/services" className="btn-view-all">All services</Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
