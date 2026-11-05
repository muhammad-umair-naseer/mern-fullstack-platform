import React from "react";
import Seo from '../../../seo/Seo.jsx';
import { SITE } from '../../../seo/site.js';
import { liveTools } from '../../../data/tools.js';
import { organization, breadcrumbs } from '../../../seo/schema.js';
import { COURSE_COUNT } from '../../../data/catalogue.js';
import PageHero from '../../../components/PageHero.jsx';
import AboutVisual from '../../../components/heroes/AboutVisual.jsx';
import AboutFigures, { AboutDrivers, AboutStory } from '../../../components/heroes/AboutFigures.jsx';
import { aboutDrivers, aboutStory } from '../../../assets/about/index.js';

/**
 * Four figures a visitor can check for themselves.
 *
 * These replaced "4+ Years of Excellence", "100+ Successful Projects",
 * "10+ Global Markets" and "99% Client Satisfaction". The first was flatly
 * contradicted further down this same page, which states the company was
 * incorporated on 2 September 2025 — a year old, not four. The other three
 * were unverifiable, and unverifiable numbers on an About page are the first
 * thing a serious buyer tests.
 *
 * Three of the four are countable on this site: the course files, the tools
 * that actually run (derived from the catalogue, so it rises as they ship),
 * and the SECP registration shown further down this page.
 *
 * The project count is the exception — it is the company's own figure and
 * cannot be checked from the outside, which is exactly why it is the one a
 * buyer will ask about. It is the strongest number in the row when it is true
 * and the most expensive when it is not. It displaced "12 services", which is
 * still visible as twelve pages under /services.
 */
const stats = [
  { number: "2025", label: "Incorporated in Pakistan" },
  { number: "50+", label: "Projects delivered" },
  { number: String(COURSE_COUNT), label: "Free courses, open to anyone" },
  { number: String(liveTools().length), label: "Free tools that never upload your file" },
];

// Shortened from the old cards, same meaning: "Empower businesses with
// transformative tech and train the next generation of engineers", "Be a
// trusted global partner recognized for innovation, quality, and measurable
// impact", "Transparent collaboration, agile delivery, and scalable
// engineering from day one".
const drivers = [
  { key: 'mission', title: 'Mission', text: 'Useful software, and engineers trained to build it.', photo: aboutDrivers.mission },
  { key: 'vision', title: 'Vision', text: 'A trusted partner, known for quality.', photo: aboutDrivers.vision },
  { key: 'promise', title: 'Promise', text: 'Open talk, agile delivery, code that scales.', photo: aboutDrivers.promise },
];

const principles = ['Clarity first', 'Ship fast', 'Measure impact'];

const About = () => (
  <main className="relative">
    <Seo
      title="About Us"
      description="Who Cortexis Solution Hub is: a software, training and consulting company in Pakistan building products, teaching engineers, and running free internships."
      path="/about"
      schema={[organization(), breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
    />
    {/* Was "Empowering Businesses Through Innovation": an abstract noun
        stack that could head any company's page. */}
    <PageHero
      id="about-hero-heading"
      label="About Cortexis"
      lines={['A software studio', <>in <em>Pakistan.</em></>]}
      lede="We build software, teach engineers and run free internships."
      actions={[
        { to: '/contact', label: 'Start a project', primary: true },
        { to: '/services', label: 'Explore services' },
      ]}
      visual={<AboutVisual />}
    />

    <AboutFigures items={stats} />

    <AboutDrivers items={drivers} />

    <AboutStory photo={aboutStory} chips={principles} registration={SITE.registration} />
  </main>
);

export default About;
