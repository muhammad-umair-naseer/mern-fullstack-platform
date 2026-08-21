import React from 'react';
import Hero from '../components/Hero';
import ServicesPreview from '../components/ServicesPreview';
import CoursesPreview from '../components/CoursesPreview';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
      <ServicesPreview />
      <CoursesPreview />
      <Testimonials />
    </div>
  );
};

export default Home;