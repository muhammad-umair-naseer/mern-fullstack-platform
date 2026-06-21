import React from 'react';
import { Link } from 'react-router-dom';
import './ServicesPreview.css';
import webImg from '../assets/services/web-development.png';
import mobileImg from '../assets/services/mobile-app-development.png';
import uiuxImg from '../assets/services/ui-ux-design.png';

const ServicesPreview = () => {
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
    <section className="services-container" aria-labelledby="services-heading">
      <div className="container">
        <h2 id="services-heading" className="section-title">Our Services</h2>
        <p className="section-subtitle">Outcome-focused solutions delivered by experienced engineers and designers</p>

        <ul className="services-row row" role="list" aria-label="Service cards">
          {services.map((service, index) => {
            const titleId = `service-title-${index}`;
            return (
              <li key={index} className="col-md-4 mb-4" role="listitem">
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

        <div className="text-center">
          <Link to="/services" className="btn-view-all">View All Services</Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
