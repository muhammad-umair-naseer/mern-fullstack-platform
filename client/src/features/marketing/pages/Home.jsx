import React from 'react';
import Hero from '../../../components/Hero.jsx';
import TechMarquee from '../../../components/TechMarquee.jsx';
import ValueProposition from '../../../components/ValueProposition.jsx';
import ServicesPreview from '../../../components/ServicesPreview.jsx';
import ProcessSection from '../../../components/ProcessSection.jsx';
import Academy from '../../../components/Academy.jsx';
import Gallery from '../../../components/Gallery.jsx';
import CtaBanner from '../../../components/CtaBanner.jsx';
import Testimonials from '../../../components/Testimonials.jsx';
import Seo from '../../../seo/Seo.jsx';
import { organization, website } from '../../../seo/schema.js';

const Home = () => {
  return (
    <div className="home-page-container">
      <Seo
        title="Cortexis Solution Hub | Software, Training and Consulting in Pakistan" bare
        description="Custom web, mobile and AI software built in Pakistan, plus free online courses with certificates and free internships. Talk to the team that writes the code."
        path="/"
        schema={[organization(), website()]}
      />
      <Hero />
      <TechMarquee />
      <ServicesPreview />
      <ValueProposition />
      <Gallery />
      <ProcessSection />
      <Academy />
      <Testimonials />
      <CtaBanner />
    </div>
  );
};

export default Home;