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
const YourBot = lazy(() => import('./pages/YourBot'));
const YourBotPrivacy = lazy(() => import('./pages/YourBotPrivacy'));
const YourBotTerms = lazy(() => import('./pages/YourBotTerms'));
const YourBotDataDeletion = lazy(() => import('./pages/YourBotDataDeletion'));

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
            {/* Canonical product routes. */}
            <Route path="/your-bot" element={<YourBot />} />
            <Route path="/your-bot/privacy" element={<YourBotPrivacy />} />
            <Route path="/your-bot/terms" element={<YourBotTerms />} />
            <Route path="/your-bot/data-deletion" element={<YourBotDataDeletion />} />

            {/* Legacy paths kept live: these exact URLs are registered with Meta for
                WhatsApp Business Platform app review. They must keep resolving. */}
            <Route path="/whatsapp-bot" element={<YourBot />} />
            <Route path="/whatsapp-bot/privacy" element={<YourBotPrivacy />} />
            <Route path="/whatsapp-bot/terms" element={<YourBotTerms />} />
            <Route path="/whatsapp-bot/data-deletion" element={<YourBotDataDeletion />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}
