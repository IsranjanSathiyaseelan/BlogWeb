
import { useCallback, useEffect, useState } from "react";

import { fetchAdminMetrics } from "../../api/admin";

import {
  fetchAdminActivityChart,
  fetchAdminCategoryChart,
  fetchAdminUserGrowthChart,
} from "../../api/charts";

import type {
  AdminMonthlyActivityPoint,
  CategoryPoint,
  UserGrowthPoint,
} from "../../api/charts";

import {
  ActivityTrendChart,
  CategoryDistributionChart,
  UserGrowthChart,
} from "../../components/common/charts/DashboardCharts";

import "./AdminDashboardPage.css";

interface MetricsData {
  totalUsers: number;
  totalBlogs?: number;
  activeSessions: number | null;
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [activityData, setActivityData] = useState<AdminMonthlyActivityPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [metricsRes, activity, categories, userGrowth] =
        await Promise.all([
          fetchAdminMetrics(),
          fetchAdminActivityChart(),
          fetchAdminCategoryChart(),
          fetchAdminUserGrowthChart(),
        ]);

      setMetrics({
        ...metricsRes,
        activeSessions: metricsRes.activeSessions ?? null,
      });

      setActivityData(activity);
      setCategoryData(categories);
      setUserGrowthData(userGrowth);

    } catch (err) {
      console.error("Dashboard loading failed:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatNumber = (value: number | null | undefined) => {
    return value == null ? "—" : value.toLocaleString("en-US");
  };

  return (
    <main className="admin-dashboard-page">

      {/* Header */}
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-label">
            ADMINISTRATION
          </span>

          <h1>Dashboard Overview</h1>

          <p>
            Monitor your platform performance, users, and publishing activity.
          </p>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="admin-error-message" role="alert">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="admin-metrics-section">
        <div className="admin-section-heading">
          <h2>Platform Statistics</h2>
          <p>Overview of your platform's key metrics.</p>
        </div>

        <div className="admin-metrics-grid">

          <article className="admin-metric-card">
            <div className="admin-metric-icon blue">
              <span>👥</span>
            </div>

            <span className="admin-metric-label">
              Total Registered Users
            </span>

            <h3>
              {loading ? "..." : formatNumber(metrics?.totalUsers)}
            </h3>

            <p>Platform-wide user registrations</p>
          </article>

          <article className="admin-metric-card">
            <div className="admin-metric-icon green">
              <span>📚</span>
            </div>

            <span className="admin-metric-label">
              Published Posts
            </span>

            <h3>
              {loading ? "..." : formatNumber(metrics?.totalBlogs)}
            </h3>

            <p>Total public blog articles</p>
          </article>

          <article className="admin-metric-card">
            <div className="admin-metric-icon purple">
              <span>⚡</span>
            </div>

            <span className="admin-metric-label">
              Active Sessions
            </span>

            <h3>
              {loading ? "..." : formatNumber(metrics?.activeSessions)}
            </h3>

            <p>Current user connections</p>
          </article>

        </div>
      </section>

      {/* Analytics */}
      <section className="admin-charts-section">
        <div className="admin-section-heading">
          <h2>Platform Analytics</h2>
          <p>Monitor publishing trends and user growth.</p>
        </div>

        <div className="admin-charts-grid">

          <div>
            <ActivityTrendChart
              data={activityData}
              title="Publishing Activity"
              subtitle="Monthly articles published"
            />
          </div>

          <div>
            <CategoryDistributionChart
              data={categoryData}
              title="Content Category Breakdown"
            />
          </div>

        </div>

        <div >
          <UserGrowthChart
            data={userGrowthData}
            title="User Growth & Sessions"
            subtitle="Platform signup progression over the past 7 months"
          />
        </div>
      </section>

    </main>
  );
};

export default AdminDashboardPage;
