import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Upper Section: Brand + Newsletter */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo__badge">
                <span className="footer-logo__dot" />
              </span>
              <span className="footer-logo__text">
                Blog<span className="footer-logo__accent">Web</span>
              </span>
            </Link>
            <p className="footer-desc">
              A modern publishing platform designed for writers, thinkers, and creators to share their ideas with the world.
            </p>
          </div>
        </div>

        {/* Middle Section: Link Columns */}
        <div className="footer-grid">
          <div className="footer-column">
            <h4 className="footer-column__title">Platform</h4>
            <ul className="footer-column__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/all-blogs">Explore Blogs</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column__title">Account</h4>
            <ul className="footer-column__links">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Get Started</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column__title">Legal</h4>
            <ul className="footer-column__links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BlogWeb, Inc. All rights reserved.</p>
          <div className="footer-bottom__links">
            <Link to="/privacy">Privacy</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
            <span>•</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;