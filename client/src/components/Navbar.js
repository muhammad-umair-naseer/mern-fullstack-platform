import React, { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import './Navbar.css';

// Home is the wordmark; every other destination keeps its place in the bar.
const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/courses', label: 'Courses' },
  { to: '/internships', label: 'Internships' },
  { to: '/tools', label: 'Free Tools' },
  { to: '/games', label: 'Playground' },
  { to: '/blog', label: 'Blog' },
  { to: '/your-bot', label: 'Your Bot' },
  { to: '/about', label: 'About' },
];

/**
 * Sticky ivory bar. It sits flush on the page at the top and gains a hairline
 * and a frosted ground once the page moves under it, so the hero reads as one
 * surface on arrival. Below 1080px the links move into a full-screen sheet set
 * in the display serif.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const { pathname } = useLocation();
  const introRef = useIntroTimeline('[data-intro]', { y: -10, stagger: 0.05, duration: 0.8 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change closes the sheet, and an open sheet freezes the page under it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('lx-lock', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`} role="banner">
      <div className="nav-container" ref={introRef}>
        <Link to="/" className="nav-logo" onClick={close} aria-label="Cortexis Solution Hub Pvt Ltd home" data-intro>
          <span className="nav-logo-badge">
            <BrandLogo size={38} />
          </span>
          <span className="nav-logo-wrap">
            <span className="nav-logo-text">Cortexis</span>
            <span className="nav-logo-sub">SOLUTION HUB Pvt Ltd</span>
          </span>
        </Link>

        <nav className="nav-menu" id={menuId} aria-label="Primary">
          <ul>
            {LINKS.map((l, i) => (
              <li key={l.to} style={{ '--i': i }}>
                <NavLink to={l.to} className="nav-link" onClick={close} data-intro>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-sheet-foot">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-sheet-aux" onClick={close}>My learning</Link>
                <button type="button" className="nav-sheet-aux" onClick={() => { logout(); close(); }}>
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-sheet-aux" onClick={close}>Sign in</Link>
            )}
            <Link to="/contact" className="btn lx-btn" onClick={close}>
              Start a project
              <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
            </Link>
          </div>
        </nav>

        <div className="nav-actions" data-intro>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-aux">My learning</Link>
              <button type="button" onClick={logout} className="nav-aux">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="nav-aux">Sign in</Link>
          )}
          <Link to="/contact" className="btn lx-btn nav-cta">
            Start a project
            <span className="lx-btn-disc" aria-hidden="true"><ArrowUpRight size={15} /></span>
          </Link>
        </div>

        <button
          className="nav-icon"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-controls={menuId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
