import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Animated brand gradient + floating orbs */}
      <div className="hero-gradient" aria-hidden="true"></div>
      <span className="hero-orb hero-orb--1" aria-hidden="true"></span>
      <span className="hero-orb hero-orb--2" aria-hidden="true"></span>
      <span className="hero-orb hero-orb--3" aria-hidden="true"></span>
      <div className="hero-overlay" aria-hidden="true"></div>

      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span className="hero-eyebrow" variants={item}>
          Cortexis Solution Hub Pvt&nbsp;Ltd
        </motion.span>

        <motion.h1 id="hero-heading" variants={item}>
          Engineering <span className="hero-gradient-text">Intelligent</span> Digital Solutions
        </motion.h1>

        <motion.p className="hero-subtitle" variants={item}>
          Cortexis Solution Hub builds software, trains talent, and delivers consulting
          that helps teams ship faster and grow with confidence.
        </motion.p>

        <motion.div className="hero-buttons" role="group" aria-label="Primary actions" variants={item}>
          <Link to="/services" className="btn btn-primary cta">Explore Services</Link>
          <Link to="/contact" className="btn btn-secondary cta-alt">Talk to an Expert</Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
