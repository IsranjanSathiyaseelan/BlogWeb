import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import SignIn from "../../../pages/auth/signin/SignIn";
import SignUp from "../../../pages/auth/signup/SignUp";
import useAuth from "../../../hooks/useAuth";
import "./Navbar.css";

type NavItem = {
  label: string;
  to: string;
};

const baseNavItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems: NavItem[] = user
    ? [...baseNavItems, { label: "MyBlog", to: "/myblog" }]
    : baseNavItems;

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
          {navItems.map((item: NavItem) => (
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
          {user ? (
            <>
              <span className="navbar-user">Hi, {user.name}</span>
              <Button
                type="button"
                variant="secondary"
                className="navbar-signin"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                className="navbar-signin"
                onClick={() => setIsSignInOpen(true)}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant="primary"
                className="navbar-signin"
                onClick={() => setIsSignUpOpen(true)}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Burger */}
        <Button
          type="button"
          variant="ghost"
          className={`navbar-burger ${menuOpen ? "navbar-burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </Button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-drawer__links">
          {navItems.map((item: NavItem, i: number) => (
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
          {user ? (
            <Button
              type="button"
              variant="secondary"
              className="mobile-drawer__signin"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                className="mobile-drawer__signin"
                onClick={() => {
                  setIsSignInOpen(true);
                  setMenuOpen(false);
                }}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant="primary"
                className="mobile-drawer__signin"
                onClick={() => {
                  setIsSignUpOpen(true);
                  setMenuOpen(false);
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <Modal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)}>
        <SignIn onClose={() => setIsSignInOpen(false)} />
      </Modal>

      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <SignUp onClose={() => setIsSignUpOpen(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
