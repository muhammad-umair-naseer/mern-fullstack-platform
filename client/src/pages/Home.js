import React from 'react';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import ValueProposition from '../components/ValueProposition';
import ServicesPreview from '../components/ServicesPreview';
import ProcessSection from '../components/ProcessSection';
import CtaBanner from '../components/CtaBanner';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div className="home-page-container">
      <Hero />
      <TechMarquee />
      <ValueProposition />
      <ServicesPreview />
      <ProcessSection />
      <CtaBanner />
      <Testimonials />
    </div>
  );
};

export default Home;