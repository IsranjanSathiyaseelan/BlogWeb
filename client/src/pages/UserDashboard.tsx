import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Blog, User } from "../types/dashboard";
import Button from "../components/common/button/Button";
import useAuth from "../hooks/useAuth";
import { getUserDashboard } from "../api/dashboard";
import {
  fetchUserActivityChart,
  fetchUserCategoryChart,
} from "../api/charts";
import type { MonthlyActivityPoint, CategoryPoint } from "../api/charts";
import {
  ActivityTrendChart,
  CategoryDistributionChart,
} from "../components/common/charts/DashboardCharts";
import "./pages.css";
import "./UserDashboard.css";
import "./admin/AdminDashboardPage.css";

const UserDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [monthlyActivity, setMonthlyActivity] = useState<MonthlyActivityPoint[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryPoint[]>([]);
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
        const [dashboardData, activity, categories] = await Promise.all([
          getUserDashboard(),
          fetchUserActivityChart(),
          fetchUserCategoryChart(),
        ]);

        if (isMounted) {
          setDashboardUser(dashboardData.user);
          setPosts(dashboardData.blogs);
          setMonthlyActivity(activity);
          setCategoryDistribution(categories);
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
      <div className="admin-dashboard-page">
        <div className="admin-skeleton-pulse" style={{ width: "220px", height: "36px", marginBottom: "20px" }} />
        <div className="admin-metrics-grid">
          <div className="admin-metric-card" style={{ height: "120px" }} />
          <div className="admin-metric-card" style={{ height: "120px" }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard-page">
      {/* Top Banner Matching Admin Dashboard Style */}
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">
            Welcome back, {dashboardUser?.name || user.email.split("@")[0]}
          </h1>
          <p className="admin-dashboard-subtitle">
            Manage your personal articles, publishing velocity, and performance analytics.
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

      {/* Metrics Grid matching Admin Dashboard style */}
      <section className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Member Since</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--blue">
              📅
            </div>
          </div>
          <p className="admin-metric-card__value" style={{ fontSize: "1.5rem" }}>
            {formatDate(dashboardUser?.createdAt)}
          </p>
          <span className="admin-metric-card__subtext">Active contributor</span>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Articles Published</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--green">
              ✍️
            </div>
          </div>
          <p className="admin-metric-card__value">{posts.length}</p>
          <span className="admin-metric-card__subtext">
            {posts.length === 1 ? "1 article live" : `${posts.length} articles live`}
          </span>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className="admin-charts-section">
        <div className="admin-charts-grid">
          <ActivityTrendChart
            data={monthlyActivity.length > 0 ? monthlyActivity : undefined}
            title="My Publishing Activity"
            subtitle="Monthly articles published on your account"
          />
          <CategoryDistributionChart
            data={categoryDistribution}
            title="My Topics & Categories"
          />
        </div>
      </section>

      {/* Posts Table Section matching Admin Dashboard style */}
      <section className="admin-posts-section">
        <div className="admin-posts-header">
          <div>
            <h2 className="admin-table-title">Recent Articles</h2>
            <p className="admin-table-subtitle">Your latest written content and drafts.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {posts.length > 0 && (
              <span className="admin-category-badge">{posts.length} Total</span>
            )}
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/myblog")}
            >
              + Create New Post
            </Button>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "45%" }}>Title</th>
                <th style={{ width: "20%" }}>Published Date</th>
                <th style={{ width: "35%" }}>Content Preview</th>
              </tr>
            </thead>

            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="admin-table-empty">
                      <div className="admin-empty-icon">📝</div>
                      <h3>No articles yet</h3>
                      <p>
                        You haven't published any content yet. Start sharing your insights today!
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
                    className="admin-posts-row"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/myblog")}
                    onKeyDown={(e) => handleRowKeyDown(e, "/myblog")}
                    title="Click to manage post"
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong className="admin-post-title">{post.title}</strong>
                    </td>

                    <td>
                      <span className="admin-date-text">
                        {formatDate(post.createdAt)}
                      </span>
                    </td>

                    <td style={{ color: "#64748b", fontSize: "0.875rem" }}>
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
