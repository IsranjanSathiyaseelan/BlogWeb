import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo-mark">B</span>
          <span className="admin-sidebar__title">BlogWeb Console</span>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Main Menu</div>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            User Management
          </NavLink>
        </nav>

        {/* Sidebar Footer / Account Actions */}
        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-content">
        <header className="admin-topnav">
          <div className="admin-topnav__left">
            <span className="admin-topnav__title">Admin Portal</span>
          </div>

          <div className="admin-topnav__right">
            <div className="admin-topnav__status">
              <span className="admin-status-dot" />
              <span>System Operational</span>
            </div>
          </div>
        </header>

        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;