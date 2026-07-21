import { useEffect, useState } from "react";
import { fetchAdminMetrics } from "../../api/admin";
import "./AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    revenue: number | null;
    activeSessions: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchAdminMetrics();
        setMetrics(data);
      } catch {
        setError("Unable to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <section className="admin-metrics-grid">
        <div className="admin-metric-card">
          <p className="admin-metric-card__label">Total Users</p>
          <p className="admin-metric-card__value">
            {loading ? "Loading…" : (metrics?.totalUsers ?? "—")}
          </p>
        </div>
        <div className="admin-metric-card">
          <p className="admin-metric-card__label">Revenue</p>
          <p className="admin-metric-card__value">
            {loading
              ? "Loading…"
              : metrics?.revenue != null
                ? `$${metrics.revenue}`
                : "—"}
          </p>
        </div>
        <div className="admin-metric-card">
          <p className="admin-metric-card__label">Active Sessions</p>
          <p className="admin-metric-card__value">
            {loading ? "Loading…" : (metrics?.activeSessions ?? "—")}
          </p>
        </div>
      </section>

      <section className="admin-table-section">
        <div className="admin-table-header">
          <h2 className="admin-table-title">User Management</h2>
          <p className="admin-table-subtitle">
            Review your live user data once it is available.
          </p>
        </div>

        {error ? (
          <div className="admin-error-message">{error}</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="admin-table-empty">
                    User data is available on the User Management page.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
