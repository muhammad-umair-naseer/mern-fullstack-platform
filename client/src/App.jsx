import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import RouteTransition from './components/RouteTransition';
import SilkBackdrop from './components/SilkBackdrop';
import ClaudeAnnouncementBar from './components/ClaudeAnnouncementBar';
import './Pages.css';
import './theme-cosmic.css';
import './premium.css';
// The stylesheets shared by several lazy-loaded pages, loaded once here so
// no page chunk carries them: with each chunk importing them in its own
// order, the production build refused the conflicting orders. No two of
// these define the same selector, so this order is free to be any order.
import './features/learning/components/motion.css';
import './components/PageHero.css';
import './features/learning/components/Learn.css';
import './features/learning/components/ProgressBar.css';
import './features/learning/components/Markdown.css';
import './features/learning/components/Quiz.css';
import './features/learning/components/TopicQuiz.css';
import './features/learning/components/LessonView.css';
import './features/learning/components/CourseOutline.css';
import './features/learning/components/ToolCard.css';
import './components/FaqSection.css';
import ScrollToTop from './components/ScrollToTop';

const NotFound = lazy(() => import('./features/marketing/pages/NotFound.jsx'));
const Home = lazy(() => import('./features/marketing/pages/Home.jsx'));
const About = lazy(() => import('./features/marketing/pages/About.jsx'));
const Services = lazy(() => import('./features/marketing/pages/Services.jsx'));
const Courses = lazy(() => import('./features/learning/pages/Courses.jsx'));
const Internships = lazy(() => import('./features/forms/pages/Internships.jsx'));

const Contact = lazy(() => import('./features/forms/pages/Contact.jsx'));
const Terms = lazy(() => import('./features/marketing/pages/Terms.jsx'));
const Privacy = lazy(() => import('./features/marketing/pages/Privacy.jsx'));
const YourBot = lazy(() => import('./features/marketing/pages/YourBot.jsx'));
const YourBotPrivacy = lazy(() => import('./features/marketing/pages/YourBotPrivacy.jsx'));
const YourBotTerms = lazy(() => import('./features/marketing/pages/YourBotTerms.jsx'));
const YourBotDataDeletion = lazy(() => import('./features/marketing/pages/YourBotDataDeletion.jsx'));

// Learning platform
const Login = lazy(() => import('./features/auth/pages/AuthForm.jsx').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./features/auth/pages/AuthForm.jsx').then((m) => ({ default: m.Signup })));
const Dashboard = lazy(() => import('./features/learning/pages/Dashboard.jsx'));
const CourseOutline = lazy(() => import('./features/learning/pages/CourseOutline.jsx'));
const LessonView = lazy(() => import('./features/learning/pages/LessonView.jsx'));
const ChapterQuiz = lazy(() => import('./features/learning/pages/ChapterQuiz.jsx'));
const FinalExam = lazy(() => import('./features/learning/pages/FinalExam.jsx'));
const CertificateView = lazy(() => import('./features/learning/pages/CertificateView.jsx'));

// Free tools catalogue
const Tools = lazy(() => import('./features/tools/pages/Tools.jsx'));
const ToolDetail = lazy(() => import('./features/tools/pages/ToolDetail.jsx'));
const ServiceDetail = lazy(() => import('./features/marketing/pages/ServiceDetail.jsx'));
const Faq = lazy(() => import('./features/marketing/pages/Faq.jsx'));
const Blog = lazy(() => import('./features/blog/pages/Blog.jsx'));
const BlogPost = lazy(() => import('./features/blog/pages/BlogPost.jsx'));

// Playground & multiplayer games
const Games = lazy(() => import('./features/games/pages/Games.jsx'));
const GameFrame = lazy(() => import('./features/games/pages/GameFrame.jsx'));

export default function App() {
  return (
    <Router>
      {/* Must sit inside Router: it reads the current location. */}
      <ScrollToTop />
      <AuthProvider>
      <div className="App">
        <SilkBackdrop />
        <ClaudeAnnouncementBar />
        <Navbar />
        <RouteTransition>
        <Suspense
          fallback={
            <div className="lx-route-loading" role="status" aria-label="Loading page">
              <span />
            </div>
          }
        >
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

            {/* Playground & multiplayer games */}
            <Route path="/games" element={<Games />} />
            <Route path="/games/:gameId" element={<GameFrame />} />

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

            {/* Navigation aliases & clean 301-style client redirects */}
            <Route path="/yourbot" element={<Navigate to="/your-bot" replace />} />
            <Route path="/automations" element={<Navigate to="/your-bot" replace />} />
            <Route path="/apply" element={<Navigate to="/internships" replace />} />
            <Route path="/apply-now" element={<Navigate to="/internships" replace />} />
            <Route path="/internship" element={<Navigate to="/internships" replace />} />

            {/* Catch-all fallback to Home */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </RouteTransition>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
  );
}
