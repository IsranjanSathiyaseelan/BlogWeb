import { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchAdminMetrics();
        setMetrics({ ...data, activeSessions: data.activeSessions ?? null });
      } catch {
        setError("Unable to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    const loadCharts = async () => {
      try {
        const [activity, categories, userGrowth] = await Promise.all([
          fetchAdminActivityChart(),
          fetchAdminCategoryChart(),
          fetchAdminUserGrowthChart(),
        ]);
        setActivityData(activity);
        setCategoryData(categories);
        setUserGrowthData(userGrowth);
      } catch (err) {
        console.error("Failed to load admin chart data:", err);
      }
    };

    loadMetrics();
    loadCharts();
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
            Monitor platform health, reader analytics, and system performance metrics.
          </p>
        </div>
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="admin-error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <section className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Total Users</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--blue">👥</div>
          </div>
          <p className="admin-metric-card__value">
            {loading ? <span className="admin-skeleton-pulse" /> : formatNumber(metrics?.totalUsers)}
          </p>
          <span className="admin-metric-card__subtext">Registered accounts</span>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Total Posts</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--green">📚</div>
          </div>
          <p className="admin-metric-card__value">
            {loading ? <span className="admin-skeleton-pulse" /> : formatNumber(metrics?.totalBlogs)}
          </p>
          <span className="admin-metric-card__subtext">Published articles</span>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__header">
            <p className="admin-metric-card__label">Active Sessions</p>
            <div className="admin-metric-card__icon admin-metric-card__icon--purple">⚡</div>
          </div>
          <p className="admin-metric-card__value">
            {loading ? <span className="admin-skeleton-pulse" /> : formatNumber(metrics?.activeSessions)}
          </p>
          <span className="admin-metric-card__subtext">Live active sessions</span>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className="admin-charts-section">
        <div className="admin-charts-grid">
          <ActivityTrendChart
            data={activityData}
            title="Publishing Activity"
            subtitle="Monthly growth in articles published across the platform"
          />
          <CategoryDistributionChart
            data={categoryData}
            title="Content Category Breakdown"
          />
        </div>
        <div style={{ marginTop: "24px" }}>
          <UserGrowthChart
            data={userGrowthData}
            title="User Growth & Sessions Velocity"
            subtitle="Platform signup progression over past 7 months"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;