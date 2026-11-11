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
        { label: "My Blogs", to: "/myblog" },
      ]
    : baseNavItems;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scroll when mobile overlay menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`navbar-wrapper ${scrolled ? "navbar-wrapper--scrolled" : ""}`}
      >
        <nav className="navbar" aria-label="Main Navigation">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="BlogWeb Homepage">
            <span className="navbar-logo__badge" aria-hidden="true">
              <svg
                className="navbar-logo__icon"
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

          {/* Desktop User / Auth Actions */}
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
                  aria-label="Log out of account"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="navbar-auth-group">
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
              </div>
            )}
          </div>

          {/* Mobile Burger Toggle Button */}
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

      {/* Redesigned Mobile Fullscreen Overlay Menu */}
      <div
        className={`mobile-overlay-menu ${menuOpen ? "mobile-overlay-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__glow" aria-hidden="true" />
        
        <div className="mobile-menu__inner">
          {/* Top Brand / Close Bar */}
          <div className="mobile-menu__top">
            <Link
              to="/"
              className="navbar-logo"
              onClick={() => setMenuOpen(false)}
            >
              <span className="navbar-logo__badge" aria-hidden="true">
                <svg
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
              <span className="navbar-logo__text">
                Blog<span className="navbar-logo__accent">Web</span>
              </span>
            </Link>

            <button
              type="button"
              className="mobile-menu__close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* User Profile Card (If Logged In) */}
          {user && (
            <div className="mobile-menu__profile-card">
              <div className="mobile-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="mobile-user-info">
                <span className="mobile-user-name">{user.name}</span>
                <span className="mobile-user-status">Active Contributor</span>
              </div>
            </div>
          )}

          {/* Staggered Navigation Link Stack */}
          <ul className="mobile-menu__links">
            {navItems.map((item: NavItem, i: number) => (
              <li
                key={item.label}
                style={{ "--i": i } as DrawerAnimationStyle}
                className="mobile-menu__item"
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `mobile-menu__link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="mobile-menu__link-arrow">→</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Footer Actions / Auth Stack */}
          <div className="mobile-menu__footer">
            {user ? (
              <Button
                type="button"
                variant="secondary"
                className="mobile-menu__btn mobile-menu__btn--logout"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Log Out of Account
              </Button>
            ) : (
              <div className="mobile-menu__auth-stack">
                <Button
                  type="button"
                  variant="ghost"
                  className="mobile-menu__btn mobile-menu__btn--signin"
                  onClick={() => {
                    setIsSignInOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="mobile-menu__btn mobile-menu__btn--signup"
                  onClick={() => {
                    setIsSignUpOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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