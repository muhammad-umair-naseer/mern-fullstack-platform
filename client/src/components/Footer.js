import React from "react";
import { Link } from "react-router-dom";
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import "./Footer.css";

/**
 * Site footer.
 *
 * Three columns rather than five: the previous version carried twelve links
 * across four navigation blocks, which buried the ones people actually use.
 * Legal and the WhatsApp Bot pages moved to the bottom bar, where they are
 * still reachable without competing with the main navigation.
 */
const Footer = () => {
  const revealRef = useRevealOnScroll();

  return (
    <footer className="footer" aria-labelledby="footer-heading" ref={revealRef}>
      <div className="footer-container">
        <h2 id="footer-heading" className="visually-hidden">Site footer</h2>

        <div className="footer-content" role="presentation">
          <section className="footer-section" data-reveal>
            <h3 className="footer-brand">Cortexis Solution Hub Pvt Ltd</h3>
            <p>Software, training and consulting for teams in Pakistan and beyond.</p>
            <ul className="footer-social" aria-label="Social links">
              <li><a className="social-link" href="https://www.facebook.com/profile.php" aria-label="Facebook">Fb</a></li>
              <li><a className="social-link" href="https://www.instagram.com/cortexis.solution.hub" aria-label="Instagram">Ig</a></li>
              <li><a className="social-link" href="https://www.linkedin.com/company/cortexis-solution-hub" aria-label="LinkedIn">In</a></li>
            </ul>
          </section>

          <nav className="footer-section" aria-label="Explore" data-reveal>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/internships">Internships</Link></li>
              <li><Link to="/tools">Free Tools</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </nav>

          <section className="footer-section" aria-label="Contact information" data-reveal>
            <h4>Contact</h4>
            <address className="contact-block">
              <p><a className="contact-link" href="mailto:cortexis.solution.hub@gmail.com">cortexis.solution.hub@gmail.com</a></p>
              <p><a className="contact-link" href="tel:+923475769500">+92 347 5769500</a></p>
              <p>Islamabad, Pakistan</p>
            </address>
          </section>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cortexis Solution Hub Pvt Ltd. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Legal and secondary">
            <Link to="/whatsapp-bot">WhatsApp Bot</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
