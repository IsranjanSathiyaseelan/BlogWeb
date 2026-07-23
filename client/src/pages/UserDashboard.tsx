import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Blog, User } from "../types/dashboard";
import Button from "../components/common/button/Button";
import useAuth from "../hooks/useAuth";
import { getUserDashboard } from "../api/dashboard";
import "./pages.css";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      setLoadingDashboard(true);
      setError("");

      try {
        const data = await getUserDashboard();
        setDashboardUser(data.user);
        setPosts(data.blogs);
      } catch (err) {
        console.error(err);
        setError("Unable to load your dashboard. Please sign in again.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, [user]);

  // Safe date helper to prevent errors if API returns string dates
  const formatDate = (dateInput?: Date | string) => {
    if (!dateInput) return "—";
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  if (loading || loadingDashboard) {
    return (
      <div className="page myblogs">
        <div className="dashboard-skeleton">
          <div className="skeleton-block skeleton-block--header" />
          <div className="skeleton-grid">
            <div className="skeleton-block skeleton-block--card" />
            <div className="skeleton-block skeleton-block--card" />
          </div>
          <div className="skeleton-block skeleton-block--table" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const currentUser = dashboardUser ?? user;

  return (
    <div className="page myblogs dashboard-page">
      {/* Welcome Banner */}
      <section className="content-panel dashboard-welcome">
        <div className="dashboard-welcome__info">
          <span className="dashboard-welcome__badge">Account Dashboard</span>
          <h1>Welcome back, {currentUser.name}</h1>
          <p className="dashboard-welcome__sub">
            Signed in as <strong>{currentUser.email}</strong>
          </p>
        </div>
        <div className="myblogs__actions">
          <Button type="button" onClick={() => navigate("/myblog")}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "6px" }}
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Manage posts
          </Button>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="content-panel">
        <div className="section-head">
          <h2>Overview</h2>
          <p>Key metrics and activity for your author profile.</p>
        </div>

        {error ? (
          <div className="blog-manager__error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        ) : (
          <div className="dashboard-summary-grid">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <span className="dashboard-card__label">Account created</span>
                <span className="dashboard-card__icon">📅</span>
              </div>
              <p className="dashboard-card__value">
                {formatDate(dashboardUser?.createdAt)}
              </p>
            </div>

            <div className="dashboard-card dashboard-card--highlight">
              <div className="dashboard-card__header">
                <span className="dashboard-card__label">Total published posts</span>
                <span className="dashboard-card__icon">✍️</span>
              </div>
              <p className="dashboard-card__value">{posts.length}</p>
            </div>
          </div>
        )}
      </section>

      {/* Posts Table Section */}
      <section className="content-panel">
        <div className="section-head section-head--between">
          <div>
            <h2>Recent Articles</h2>
            <p>Your latest written content and drafts.</p>
          </div>
          {posts.length > 0 && (
            <span className="dashboard-count-badge">{posts.length} Total</span>
          )}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Title</th>
                <th style={{ width: "20%" }}>Created</th>
                <th style={{ width: "45%" }}>Excerpt</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-table-empty">
                    <div className="dashboard-empty-state">
                      <div className="dashboard-empty-state__icon">📝</div>
                      <h3>No articles found</h3>
                      <p>You haven't written or published any articles yet.</p>
                      <Button type="button" onClick={() => navigate("/myblog")}>
                        Create your first post
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="admin-table__row"
                    onClick={() => navigate("/myblog")}
                    title="Click to manage post"
                  >
                    <td className="admin-table__cell--title">
                      <strong>{post.title}</strong>
                    </td>
                    <td>
                      <span className="admin-table__date-tag">
                        {formatDate(post.createdAt)}
                      </span>
                    </td>
                    <td className="admin-table__cell--excerpt">
                      {post.content.slice(0, 120)}
                      {post.content.length > 120 ? "…" : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;