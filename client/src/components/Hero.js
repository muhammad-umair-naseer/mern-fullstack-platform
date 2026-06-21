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
      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 id="hero-heading" variants={item}>
          Engineering <em className="hero-gradient-text">Intelligent</em> Digital Solutions
        </motion.h1>

        <motion.p className="hero-subtitle" variants={item}>
          We build software, train talent, and deliver consulting that helps teams
          ship faster and grow with confidence.
        </motion.p>

        <motion.div className="hero-buttons" role="group" aria-label="Primary actions" variants={item}>
          <Link to="/services" className="btn btn-primary cta">Explore Services</Link>
          <Link to="/contact" className="btn btn-secondary cta-alt">Talk to an Expert</Link>
        </motion.div>

        <motion.div className="hero-coords" variants={item}>
          <div className="coord">
            <span className="num">50+</span>
            <span className="lbl">Projects Shipped</span>
          </div>
          <div className="coord">
            <span className="num">12+</span>
            <span className="lbl">Tech Stacks</span>
          </div>
          <div className="coord">
            <span className="num">24/7</span>
            <span className="lbl">Support</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
