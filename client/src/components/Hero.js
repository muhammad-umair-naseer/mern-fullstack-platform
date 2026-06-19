import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="hero-content">
        <h1 id="hero-heading">Transforming Ideas into Digital Reality</h1>
        <p className="hero-subtitle">
          Dummy Company delivers software, training, and consulting that help teams ship faster and grow with confidence.
        </p>
        <div className="hero-buttons" role="group" aria-label="Primary actions">
          <Link to="/services" className="btn btn-primary cta">Explore Services</Link>
          <Link to="/contact" className="btn btn-secondary cta-alt">Talk to an Expert</Link>
        </div>
      </div>
      <div className="hero-image" role="img" aria-label="Abstract workspace background"></div>
    </section>
  );
};

export default Hero;
