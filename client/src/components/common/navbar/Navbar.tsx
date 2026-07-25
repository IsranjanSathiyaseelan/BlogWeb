import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import SignIn from "../../../pages/auth/signin/SignIn";
import SignUp from "../../../pages/auth/signup/SignUp";
import useAuth from "../../../hooks/useAuth";
import type { DrawerAnimationStyle, NavItem } from "../../../types/ui";
import "./Navbar.css";

const baseNavItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Blogs", to: "/all-blogs" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems: NavItem[] = user
    ? [
        ...baseNavItems,
        { label: "Dashboard", to: "/dashboard" },
      ]
    : baseNavItems;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`navbar-wrapper ${scrolled ? "navbar--scrolled" : ""}`}
      >
        <nav className="navbar">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo__badge">
              <span className="navbar-logo__dot" />
            </span>
            <span className="navbar-logo__text">
              Blog<span className="navbar-logo__accent">Web</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="navbar-links">
            {navItems.map((item: NavItem) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "navbar-link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop User Actions */}
          <div className="navbar-actions">
            {user ? (
              <div className="navbar-user-group">
                <div className="navbar-avatar" title={user.name}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="navbar-user-name">{user.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  className="navbar-btn navbar-btn--logout"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  className="navbar-btn navbar-btn--signin"
                  onClick={() => setIsSignInOpen(true)}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="navbar-btn navbar-btn--signup"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Burger Toggle */}
          <button
            type="button"
            className={`navbar-burger ${menuOpen ? "navbar-burger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={menuOpen}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <aside
        className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer__header">
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setMenuOpen(false)}
          >
            <span className="navbar-logo__badge">
              <span className="navbar-logo__dot" />
            </span>
            <span className="navbar-logo__text">
              Blog<span className="navbar-logo__accent">Web</span>
            </span>
          </Link>
          <button
            type="button"
            className="mobile-drawer__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {user && (
          <div className="mobile-drawer__user-profile">
            <div className="mobile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="mobile-user-info">
              <span className="mobile-user-name">{user.name}</span>
              <span className="mobile-user-status">Active Account</span>
            </div>
          </div>
        )}

        <ul className="mobile-drawer__links">
          {navItems.map((item: NavItem, i: number) => (
            <li
              key={item.label}
              style={{ "--i": i } as DrawerAnimationStyle}
              className="mobile-drawer__item"
            >
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
              className="mobile-drawer__btn mobile-drawer__btn--logout"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              Log Out
            </Button>
          ) : (
            <div className="mobile-drawer__auth-stack">
              <Button
                type="button"
                variant="ghost"
                className="mobile-drawer__btn mobile-drawer__btn--signin"
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
                className="mobile-drawer__btn mobile-drawer__btn--signup"
                onClick={() => {
                  setIsSignUpOpen(true);
                  setMenuOpen(false);
                }}
              >
                Create Account
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Auth Modals */}
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
