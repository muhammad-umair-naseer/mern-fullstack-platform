import React, { useEffect, useId, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Bot, Wrench, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import './Navbar.css';

const DIGITAL_SOLUTIONS = [
  {
    to: '/your-bot',
    label: 'Automations',
    subLabel: 'Your Bot',
    desc: 'Official WhatsApp & Instagram business automation',
    icon: Bot,
    badge: 'Meta API',
  },
  {
    to: '/tools',
    label: 'General Tools',
    subLabel: '109 Free Tools',
    desc: 'Client-side PDF, image, audio, video & code utilities',
    icon: Wrench,
    badge: '109 Tools',
  },
  {
    to: '/games',
    label: 'Playground',
    subLabel: 'Multiplayer Arena',
    desc: 'Real-time coding quizzes & competitive typing sprints',
    icon: Gamepad2,
    badge: 'Live',
  },
];

/**
 * Sticky ivory bar with reorganized navigation:
 * Home -> Services -> Blog -> Digital Solutions (Dropdown) -> Courses -> Apply Now -> About
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const menuId = useId();
  const { pathname } = useLocation();
  const introRef = useIntroTimeline('[data-intro]', { y: -10, stagger: 0.05, duration: 0.8 });

  const isSolutionsActive =
    pathname.startsWith('/your-bot') ||
    pathname.startsWith('/whatsapp-bot') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/games');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open, handle Escape key
  useEffect(() => {
    document.documentElement.classList.toggle('lx-lock', open);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSolutionsOpen(false);
      }
    };
    if (open || solutionsOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, solutionsOpen]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 180);
  };

  const close = () => {
    setOpen(false);
    setSolutionsOpen(false);
  };

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
            {/* 1. Home */}
            <li style={{ '--i': 0 }}>
              <NavLink to="/" end className="nav-link" onClick={close} data-intro>
                Home
              </NavLink>
            </li>

            {/* 2. Services */}
            <li style={{ '--i': 1 }}>
              <NavLink to="/services" className="nav-link" onClick={close} data-intro>
                Services
              </NavLink>
            </li>

            {/* 3. Blog */}
            <li style={{ '--i': 2 }}>
              <NavLink to="/blog" className="nav-link" onClick={close} data-intro>
                Blog
              </NavLink>
            </li>

            {/* 4. Digital Solutions (Dropdown) */}
            <li
              ref={dropdownRef}
              className={`nav-dropdown-item${solutionsOpen ? ' is-open' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ '--i': 3 }}
            >
              {/* Desktop Trigger */}
              <button
                type="button"
                className={`nav-link nav-dropdown-trigger${isSolutionsActive ? ' active' : ''}`}
                onClick={() => setSolutionsOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={solutionsOpen}
                data-intro
              >
                <span>Digital Solutions</span>
                <ChevronDown size={14} className={`nav-chevron${solutionsOpen ? ' is-flipped' : ''}`} aria-hidden="true" />
              </button>

              {/* Desktop Dropdown Flyout */}
              <div className={`nav-dropdown-flyout${solutionsOpen ? ' is-visible' : ''}`} role="menu">
                <div className="nav-dropdown-inner">
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-eyebrow">Solutions & Ecosystem</span>
                    <span className="nav-dropdown-count">3 Hubs</span>
                  </div>

                  <div className="nav-dropdown-list">
                    {DIGITAL_SOLUTIONS.map((sol) => {
                      const Icon = sol.icon;
                      return (
                        <Link
                          key={sol.to}
                          to={sol.to}
                          className="nav-dropdown-card"
                          onClick={close}
                          role="menuitem"
                        >
                          <span className="nav-card-icon" aria-hidden="true">
                            <Icon size={18} />
                          </span>
                          <span className="nav-card-content">
                            <span className="nav-card-top">
                              <span className="nav-card-title">{sol.label}</span>
                              <span className="nav-card-badge">{sol.badge}</span>
                            </span>
                            <span className="nav-card-desc">{sol.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Sub-Menu Expansion */}
              <div className="nav-mobile-sub">
                <button
                  type="button"
                  className="nav-mobile-toggle"
                  onClick={() => setMobileSolutionsOpen((v) => !v)}
                >
                  <span className="nav-mobile-tag">Ecosystem Hubs</span>
                  <ChevronDown size={18} className={`nav-chevron${mobileSolutionsOpen ? ' is-flipped' : ''}`} />
                </button>
                {mobileSolutionsOpen && (
                  <div className="nav-mobile-sub-list">
                    {DIGITAL_SOLUTIONS.map((sol) => (
                      <Link
                        key={sol.to}
                        to={sol.to}
                        className="nav-mobile-sub-link"
                        onClick={close}
                      >
                        <span className="nav-mobile-sub-title">{sol.label}</span>
                        <span className="nav-mobile-sub-badge">{sol.subLabel}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>

            {/* 5. Courses */}
            <li style={{ '--i': 4 }}>
              <NavLink to="/courses" className="nav-link" onClick={close} data-intro>
                Courses
              </NavLink>
            </li>

            {/* 6. Apply Now (Internships Form) */}
            <li style={{ '--i': 5 }}>
              <NavLink to="/internships" className="nav-link nav-apply-now" onClick={close} data-intro>
                <span>Apply Now</span>
                <span className="nav-apply-pulse" aria-hidden="true" />
              </NavLink>
            </li>

            {/* 7. About */}
            <li style={{ '--i': 6 }}>
              <NavLink to="/about" className="nav-link" onClick={close} data-intro>
                About
              </NavLink>
            </li>
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
