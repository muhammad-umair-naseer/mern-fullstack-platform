import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <div className="footer-container">
        <h2 id="footer-heading" className="visually-hidden">Site footer</h2>

        <div className="footer-content" role="presentation">
          <section className="footer-section">
            <h3 className="footer-brand">Cortexis Solution Hub</h3>
            <p>Engineering intelligent digital solutions — software, training, and consulting — for teams across Pakistan and beyond.</p>

            <ul className="footer-social" aria-label="Social links" role="list">
              <li><a className="social-link" href="https://www.facebook.com/profile.php" aria-label="Facebook">Fb</a></li>
              <li><a className="social-link" href="https://www.instagram.com/cortexis.solution.hub" aria-label="Instagram">IG</a></li>
              <li><a className="social-link" href="https://www.linkedin.com/company/cortexis-solution-hub" aria-label="LinkedIn">in</a></li>
            </ul>
          </section>

          <nav className="footer-section" aria-label="Quick links">
            <h4>Quick Links</h4>
            <ul role="list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/courses">Courses</Link></li>
            </ul>
          </nav>

          <nav className="footer-section" aria-label="More links">
            <h4>More Links</h4>
            <ul role="list">
              <li><Link to="/internships">Internships</Link></li>
             
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>

          <section className="footer-section" aria-label="Contact information">
            <h4>Contact</h4>
            <address className="contact-block">
              <p><a className="contact-link" href="mailto:cortexis.solution.hub@gmail.com">cortexis.solution.hub@gmail.com</a></p>
              <p><a className="contact-link" href="tel:+923475769500">+92 347-5769500</a></p>
              <p>Islamabad, Pakistan</p>
            </address>
          </section>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cortexis Solution Hub Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
