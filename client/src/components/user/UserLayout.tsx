import React, { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./UserLayout.css";

const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {isSidebarOpen && (
        <div className="dashboard-overlay" onClick={closeSidebar} />
      )}

      <aside className={`dashboard-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Link to="/" onClick={closeSidebar}>
            <span className="brand-name">BlogWeb</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
            end
          >
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/myblog"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span>My Articles</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main-wrapper">
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>

          <div className="header-right">
            {user && (
              <div className="user-profile-badge">
                <div className="avatar-wrapper">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="status-indicator"></span>
                </div>

                <div className="user-details">
                  <span className="user-name">{user.name || "User"}</span>
                  {user.email && (
                    <span className="user-email">{user.email}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
