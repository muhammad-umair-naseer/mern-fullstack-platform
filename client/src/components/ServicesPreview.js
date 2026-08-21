import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import './ServicesPreview.css';
import webImg from '../assets/services/web-development.webp';
import mobileImg from '../assets/services/mobile-app-development.webp';
import uiuxImg from '../assets/services/ui-ux-design.webp';

const ServicesPreview = () => {
  const scope = useRevealOnScroll();
  const services = [
    {
      title: "Web Development",
      description: "Custom web applications built with modern technologies.",
      image: webImg
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications.",
      image: mobileImg
    },
    {
      title: "UI/UX Design",
      description: "User-centered design for engaging experiences.",
      image: uiuxImg
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

        <ul className="services-row row" role="list" aria-label="Service cards">
          {services.map((service, index) => {
            const titleId = `service-title-${index}`;
            return (
              <li key={index} className="col-md-4 mb-4" role="listitem" data-reveal>
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
