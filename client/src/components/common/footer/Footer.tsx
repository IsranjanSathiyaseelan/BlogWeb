import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" aria-label="Site Footer">
      <div className="footer-container">
        {/* Upper Section: Brand & Newsletter */}
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="BlogWeb Home">
              <span className="footer-logo__badge" aria-hidden="true">
                <svg
                  className="footer-logo__icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                  <line x1="17.5" y1="15" x2="9" y2="15" />
                </svg>
              </span>
              <span className="footer-logo__text">
                Blog<span className="footer-logo__accent">Web</span>
              </span>
            </Link>
            <p className="footer-desc">
              A thoughtfully curated publishing platform designed for writers,
              engineers, and thinkers to share architectural clarity and deep technical essays.
            </p>
          </div>

          {/* Newsletter Subscription Box */}
          <div className="footer-newsletter">
            <span className="footer-newsletter__badge">Newsletter</span>
            <h4 className="footer-newsletter__title">Stay in the architectural loop</h4>
            <p className="footer-newsletter__desc">
              Receive hand-crafted engineering essays, design breakdowns, and deep technical insights weekly.
            </p>
            {subscribed ? (
              <div className="footer-newsletter__success" role="alert">
                <span className="success-icon" aria-hidden="true">✓</span>
                <span>You are subscribed. Welcome to the reader community!</span>
              </div>
            ) : (
              <form className="footer-newsletter__form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="footer-newsletter__input"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="footer-newsletter__btn">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section: Link Columns Grid */}
        <div className="footer-grid">
          {/* Column 1: Platform */}
          <div className="footer-column">
            <h4 className="footer-column__title">Platform</h4>
            <ul className="footer-column__links">
              <li><Link to="/">Home Feed</Link></li>
              <li><Link to="/all-blogs">Explore Archive</Link></li>
              <li><Link to="/about">Editorial Manifesto</Link></li>
            </ul>
          </div>

          {/* Column 2: Topics */}
          <div className="footer-column">
            <h4 className="footer-column__title">Featured Topics</h4>
            <ul className="footer-column__links">
              <li><Link to="/all-blogs">AI &amp; Machine Learning</Link></li>
              <li><Link to="/all-blogs">Web Development</Link></li>
              <li><Link to="/all-blogs">Software Engineering</Link></li>
              <li><Link to="/all-blogs">Cloud &amp; DevOps</Link></li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div className="footer-column">
            <h4 className="footer-column__title">Account</h4>
            <ul className="footer-column__links">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Get Started</Link></li>
              <li><Link to="/dashboard">Writer Dashboard</Link></li>
              <li><Link to="/myblog">My Articles</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Contact */}
          <div className="footer-column">
            <h4 className="footer-column__title">Legal &amp; Trust</h4>
            <ul className="footer-column__links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Preferences</Link></li>
              <li><a href="mailto:support@blogweb.io">Contact Editorial</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} BlogWeb. Crafted with care for engineers, thinkers, and creators.
          </p>

          <div className="footer-bottom__actions">
            <div className="footer-bottom__links">
              <Link to="/privacy">Privacy</Link>
              <span className="footer-sep" aria-hidden="true">•</span>
              <Link to="/terms">Terms</Link>
              <span className="footer-sep" aria-hidden="true">•</span>
              <Link to="/cookies">Cookies</Link>
              <span className="footer-sep" aria-hidden="true">•</span>
              <a href="mailto:support@blogweb.io">Contact</a>
            </div>

            <button
              type="button"
              className="footer-back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
