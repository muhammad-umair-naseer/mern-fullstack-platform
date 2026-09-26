import React from 'react';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import ValueProposition from '../components/ValueProposition';
import ServicesPreview from '../components/ServicesPreview';
import ProcessSection from '../components/ProcessSection';
import Academy from '../components/Academy';
import Gallery from '../components/Gallery';
import CtaBanner from '../components/CtaBanner';
import Testimonials from '../components/Testimonials';
import Seo from '../seo/Seo';
import { organization, website } from '../seo/schema';

const Home = () => {
  return (
    <div className="home-page-container">
      <Seo
        title="Cortexis Solution Hub | Software, Training and Consulting in Islamabad" bare
        description="Custom web, mobile and AI software built in Islamabad, plus free online courses with certificates and free internships. Talk to the team that writes the code."
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