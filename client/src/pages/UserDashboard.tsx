import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import type { Blog, User } from "../types/dashboard";
import useAuth from "../hooks/useAuth";
import { getUserDashboard } from "../api/dashboard";

import { fetchUserActivityChart, fetchUserCategoryChart } from "../api/charts";

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
  const navigate = useNavigate();

  const [dashboardUser, setDashboardUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [monthlyActivity, setMonthlyActivity] = useState<
    MonthlyActivityPoint[]
  >([]);
  const [categoryDistribution, setCategoryDistribution] = useState<
    CategoryPoint[]
  >([]);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState("");

  // Load dashboard data
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
        console.error("Failed to load user dashboard:", err);

        if (isMounted) {
          setError("Unable to load your dashboard. Please try again.");
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

  // Format dates
  const formatDate = (dateInput?: Date | string) => {
    if (!dateInput) return "—";

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle table keyboard navigation
  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    targetPath: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(targetPath);
    }
  };

  // Loading state
  if (loading || loadingDashboard) {
    return (
      <div className="admin-dashboard-page">
        <div
          className="admin-skeleton-pulse"
          style={{
            width: "220px",
            height: "36px",
            marginBottom: "20px",
          }}
        />

        <div className="admin-metrics-grid">
          <div className="admin-metric-card" style={{ height: "120px" }} />
          <div className="admin-metric-card" style={{ height: "120px" }} />
        </div>
      </div>
    );
  }

  // Authentication check
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="admin-dashboard-page">
      {/* Dashboard Header */}
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">
            Welcome back, {dashboardUser?.name || user.email.split("@")[0]}
          </h1>

          <p className="admin-dashboard-subtitle">
            Manage your articles, monitor publishing activity, and track your
            performance.
          </p>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="admin-error-message" role="alert">
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

      {/* User Statistics */}
      <section className="admin-metrics-grid">
        {/* Member Since */}
        <article className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Member Since</p>

            <div className="admin-metric-card__icon admin-metric-card__icon--blue">
              📅
            </div>
          </div>

          <p
            className="admin-metric-card__value"
            style={{ fontSize: "1.5rem" }}
          >
            {formatDate(dashboardUser?.createdAt)}
          </p>

          <span className="admin-metric-card__subtext">Active contributor</span>
        </article>

        {/* Published Articles */}
        <article className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Articles Published</p>

            <div className="admin-metric-card__icon admin-metric-card__icon--green">
              ✍️
            </div>
          </div>

          <p className="admin-metric-card__value">{posts.length}</p>

          <span className="admin-metric-card__subtext">
            {posts.length === 1
              ? "1 article published"
              : `${posts.length} articles published`}
          </span>
        </article>
      </section>

      {/* Analytics Charts */}
      <section className="admin-charts-section">
        <div className="admin-charts-grid">
          <div className="admin-chart-panel">
            <ActivityTrendChart
              data={monthlyActivity.length > 0 ? monthlyActivity : undefined}
              title="My Publishing Activity"
              subtitle="Monthly articles published on your account"
            />
          </div>

          <div className="admin-chart-panel">
            <CategoryDistributionChart
              data={categoryDistribution}
              title="My Topics & Categories"
            />
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="admin-posts-section">
        <div className="admin-posts-header">
          <div>
            <h2 className="admin-table-title">Recent Articles</h2>

            <p className="admin-table-subtitle">
              Your latest written content and drafts.
            </p>
          </div>

          {posts.length > 0 && (
            <span className="admin-category-badge">{posts.length} Total</span>
          )}
        </div>

        {/* Articles Table */}
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

                      <p>You haven't published any content yet.</p>
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

                    <td
                      style={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
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
    </main>
  );
};

export default UserDashboard;
