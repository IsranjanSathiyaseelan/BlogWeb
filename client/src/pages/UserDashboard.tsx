import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Blog, User } from "../types/dashboard";
import Button from "../components/common/button/Button";
import useAuth from "../hooks/useAuth";
import { getUserDashboard } from "../api/dashboard";
import "./pages.css";
import "./UserDashboard.css";

const UserDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    const loadDashboard = async () => {
      setLoadingDashboard(true);
      setError("");

      try {
        const data = await getUserDashboard();
        if (isMounted) {
          setDashboardUser(data.user);
          setPosts(data.blogs);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError("Unable to load your dashboard metrics. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoadingDashboard(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

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

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    targetPath: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(targetPath);
    }
  };

  if (loading || loadingDashboard) {
    return (
      <div className="admin-page-container">
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

  return (
    <div className="admin-page-container">
      {/* Metrics Section */}
      <section className="content-panel">
        <div className="section-head">
          <h2>Overview & Analytics</h2>
          <p>Key indicators and growth for your publishing profile.</p>
        </div>

        {error ? (
          <div className="blog-manager__error" role="alert" aria-live="polite">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
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
                <span className="dashboard-card__label">Member Since</span>
                <div className="dashboard-card__icon-wrapper">
                  <span className="dashboard-card__icon" aria-hidden="true">
                    📅
                  </span>
                </div>
              </div>

              <p className="dashboard-card__value">
                {formatDate(dashboardUser?.createdAt)}
              </p>
              <span className="dashboard-card__subtext">Active account</span>
            </div>

            <div className="dashboard-card dashboard-card--highlight">
              <div className="dashboard-card__header">
                <span className="dashboard-card__label">
                  Total Articles Published
                </span>
                <div className="dashboard-card__icon-wrapper">
                  <span className="dashboard-card__icon" aria-hidden="true">
                    ✍️
                  </span>
                </div>
              </div>

              <p className="dashboard-card__value">{posts.length}</p>
              <span className="dashboard-card__subtext">
                {posts.length === 1
                  ? "1 article live"
                  : `${posts.length} articles live`}
              </span>
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
                <th style={{ width: "40%" }}>Title</th>
                <th style={{ width: "20%" }}>Published</th>
                <th style={{ width: "40%" }}>Excerpt Preview</th>
              </tr>
            </thead>

            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-table-empty">
                    <div className="dashboard-empty-state">
                      <div
                        className="dashboard-empty-state__icon"
                        aria-hidden="true"
                      >
                        📝
                      </div>

                      <h3>No articles yet</h3>

                      <p>
                        You haven't published any content yet. Start sharing
                        your insights today!
                      </p>

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate("/myblog")}
                      >
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
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/myblog")}
                    onKeyDown={(e) => handleRowKeyDown(e, "/myblog")}
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
                      {post.content.slice(0, 110)}
                      {post.content.length > 110 ? "…" : ""}
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
