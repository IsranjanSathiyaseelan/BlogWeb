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
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">BlogWeb Admin</div>

        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
            }
          >
            User Management
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
            }
          >
            Settings
          </NavLink>
          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="admin-main-content">
        <header className="admin-topnav">
          <div className="admin-topnav__title">Admin Dashboard</div>
          <div className="admin-topnav__status">Secure admin area</div>
        </header>

        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
