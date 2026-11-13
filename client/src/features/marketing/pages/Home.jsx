import React, { Suspense } from 'react';
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
    <main className="home-page-container">
      <Seo
        title="Cortexis Solution Hub | Software, Training and Consulting in Pakistan" bare
        description="Custom web, mobile and AI software built in Pakistan, plus free online courses with certificates and free internships. Talk to the team that writes the code."
        path="/"
        schema={[organization(), website()]}
      />
      <Hero />
      <TechMarquee />
      {/* One Suspense boundary per section below the fold: hydrating the
          prerendered page, React commits each boundary on its own, so their
          effects run as separate short tasks instead of one long one. Nothing
          here suspends; the fallbacks are never shown. */}
      <Suspense fallback={null}><ServicesPreview /></Suspense>
      <Suspense fallback={null}><ValueProposition /></Suspense>
      <Suspense fallback={null}><Gallery /></Suspense>
      <Suspense fallback={null}><ProcessSection /></Suspense>
      <Suspense fallback={null}><Academy /></Suspense>
      <Suspense fallback={null}><Testimonials /></Suspense>
      <Suspense fallback={null}><CtaBanner /></Suspense>
    </main>
  );
};

export default Home;