import { useEffect, useState } from "react";
import { fetchAdminMetrics } from "../../api/admin";
import "./AdminDashboardPage.css";

interface MetricsData {
  totalUsers: number;
  activeSessions: number | null;
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
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

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "—";
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="admin-dashboard-page">
      {/* Top Banner */}
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">System Overview</h1>
          <p className="admin-dashboard-subtitle">
            Monitor overall performance and active system metrics.
          </p>
        </div>
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="admin-error-message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <section className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Total Users</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--blue">
              👥
            </div>
          </div>
          <p className="admin-metric-card__value">
            {loading ? (
              <span className="admin-skeleton-pulse" />
            ) : (
              formatNumber(metrics?.totalUsers)
            )}
          </p>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Active Sessions</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--purple">
              ⚡
            </div>
          </div>
          <p className="admin-metric-card__value">
            {loading ? (
              <span className="admin-skeleton-pulse" />
            ) : (
              formatNumber(metrics?.activeSessions)
            )}
          </p>
        </div>
      </section>

      {/* Table / User Navigation Container */}
      <section className="admin-table-section">
        <div className="admin-table-header">
          <div>
            <h2 className="admin-table-title">User Management Overview</h2>
            <p className="admin-table-subtitle">
              Detailed account controls and live user directories.
            </p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className="admin-table-empty">
                    <div className="admin-empty-icon">🛡️</div>
                    <h3>Manage Accounts & Credentials</h3>
                    <p>
                      View, edit role permissions, or revoke user sessions on
                      the primary management page.
                    </p>
                    <a href="/admin/users" className="admin-primary-btn">
                      Go to User Management →
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;