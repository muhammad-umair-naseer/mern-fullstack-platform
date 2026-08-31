import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import './App.css';
import './Pages.css';
import './theme-cosmic.css';
import './premium.css';
import ScrollToTop from './components/ScrollToTop';

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

// Learning platform
const Login = lazy(() => import('./pages/AuthForm').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/AuthForm').then((m) => ({ default: m.Signup })));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseOutline = lazy(() => import('./pages/CourseOutline'));
const LessonView = lazy(() => import('./pages/LessonView'));
const ChapterQuiz = lazy(() => import('./pages/ChapterQuiz'));
const FinalExam = lazy(() => import('./pages/FinalExam'));
const CertificateView = lazy(() => import('./pages/CertificateView'));

// Free tools catalogue
const Tools = lazy(() => import('./pages/Tools'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Faq = lazy(() => import('./pages/Faq'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

export default function App() {
  return (
    <Router>
      {/* Must sit inside Router: it reads the current location. */}
      <ScrollToTop />
      <AuthProvider>
      <AnimatedBackground />
      <div className="App">
        <Navbar />
        <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
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

            {/* Free tools */}
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:slug" element={<ToolDetail />} />

            {/* Learning platform */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/learn/:slug" element={<CourseOutline />} />
            {/* Public so a code can be checked by anyone, account or not */}
            <Route path="/certificate/:code" element={<CertificateView />} />

            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/learn/:slug/lesson/:lessonId" element={<RequireAuth><LessonView /></RequireAuth>} />
            <Route path="/learn/:slug/quiz/:chapterId" element={<RequireAuth><ChapterQuiz /></RequireAuth>} />
            <Route path="/learn/:slug/final" element={<RequireAuth><FinalExam /></RequireAuth>} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
  );
}
