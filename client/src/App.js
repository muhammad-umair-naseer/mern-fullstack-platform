import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import './App.css';
import './Pages.css';
import './theme-cosmic.css';
import './premium.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Courses = lazy(() => import('./pages/Courses'));
const Internships = lazy(() => import('./pages/Internships'));

const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const WhatsAppBot = lazy(() => import('./pages/WhatsAppBot'));
const WhatsAppPrivacy = lazy(() => import('./pages/WhatsAppPrivacy'));
const WhatsAppTerms = lazy(() => import('./pages/WhatsAppTerms'));
const WhatsAppDataDeletion = lazy(() => import('./pages/WhatsAppDataDeletion'));

export default function App() {
  return (
    <Router>
      <AnimatedBackground />
      <div className="App">
        <Navbar />
        <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/internships" element={<Internships />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/whatsapp-bot" element={<WhatsAppBot />} />
            <Route path="/whatsapp-bot/privacy" element={<WhatsAppPrivacy />} />
            <Route path="/whatsapp-bot/terms" element={<WhatsAppTerms />} />
            <Route path="/whatsapp-bot/data-deletion" element={<WhatsAppDataDeletion />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}
