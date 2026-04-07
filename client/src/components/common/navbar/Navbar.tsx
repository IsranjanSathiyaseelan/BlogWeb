import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "MyBlog", to: "/myblog" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo__dot" />
          BlogWeb
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <Link to="/signin" className="navbar-signin">
            Sign in
          </Link>
          <Link to="/signup" className="navbar-signin">
            Sign up
          </Link>
        </div>

        {/* Mobile Burger */}
        <button
          className={`navbar-burger ${menuOpen ? "navbar-burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-drawer__links">
          {navItems.map((item, i) => (
            <li key={item.label} style={{ "--i": i } as React.CSSProperties}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mobile-drawer__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mobile-drawer__footer">
          <Link
            to="/signin"
            className="mobile-drawer__signin"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="mobile-drawer__signin"
            onClick={() => setMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;