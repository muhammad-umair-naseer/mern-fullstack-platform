import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const introRef = useIntroTimeline('[data-intro]', { y: -16, stagger: 0.08, duration: 0.5 });

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar" role="banner">
      <div className="nav-container" ref={introRef}>
        <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="Cortexis Solution Hub Pvt Ltd home" data-intro>
          <span className="nav-logo-badge">
            <BrandLogo size={38} />
          </span>
          <span className="nav-logo-wrap">
            <span className="nav-logo-text">Cortexis</span>
            <span className="nav-logo-sub">Solution Hub Pvt Ltd</span>
          </span>
        </Link>

        <button
          className="nav-icon"
          aria-label="Toggle navigation menu"
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
          type="button"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id={menuId} aria-label="Primary">
          <Link to="/" className="nav-link" onClick={closeMenu} data-intro>Home</Link>
          <Link to="/services" className="nav-link" onClick={closeMenu} data-intro>Services</Link>
          <Link to="/courses" className="nav-link" onClick={closeMenu} data-intro>Courses</Link>
          <Link to="/internships" className="nav-link" onClick={closeMenu} data-intro>Internships</Link>
          <Link to="/about" className="nav-link" onClick={closeMenu} data-intro>About Us</Link>
          <Link to="/contact" className="nav-link nav-cta" onClick={closeMenu} data-intro>Contact Us</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
