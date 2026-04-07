import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/" className="footer-logo">
          <span className="footer-logo__dot" />
          BlogWeb
        </Link>
        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/signin">Sign in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BlogWeb. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
