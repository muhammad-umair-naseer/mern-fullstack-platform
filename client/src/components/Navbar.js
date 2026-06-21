import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar" role="banner">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="Cortexis Solution Hub Pvt Ltd home">
          <span className="nav-logo-badge">
            <BrandLogo size={38} />
          </span>
          <span className="nav-logo-wrap">
            <span className="nav-logo-text">Cortexis</span>
            <span className="nav-logo-sub">Solution Hub</span>
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
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          <Link to="/courses" className="nav-link" onClick={closeMenu}>Courses</Link>
          <Link to="/internships" className="nav-link" onClick={closeMenu}>Internships</Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          <Link to="/contact" className="nav-link nav-cta" onClick={closeMenu}>Contact Us</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
