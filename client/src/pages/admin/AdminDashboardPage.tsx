import { useEffect, useState } from "react";
import { fetchAdminMetrics } from "../../api/admin";
import { getPosts } from "../../api/posts";
import type { AdminStats } from "../../types/dashboard";
import type { BlogPost } from "../../types/blog";
import "./AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<AdminStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [metricsData, posts] = await Promise.all([
          fetchAdminMetrics(),
          getPosts(),
        ]);

        setMetrics(metricsData);
        setRecentBlogs(posts.slice(0, 5));
      } catch {
        setError("Unable to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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
          <p className="admin-metric-card__label">Total Blogs</p>
          <p className="admin-metric-card__value">
            {loading ? "Loading…" : (metrics?.totalBlogs ?? "—")}
          </p>
        </div>
      </section>

      <section className="admin-table-section">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Recent Blog Posts</h2>
          <p className="admin-table-subtitle">
            Review the latest blog posts published on the platform.
          </p>
        </div>

        {error ? (
          <div className="admin-error-message">{error}</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {recentBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-table-empty">
                      No recent posts available.
                    </td>
                  </tr>
                ) : (
                  recentBlogs.map((post) => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{post.author}</td>
                      <td>{post.category}</td>
                      <td>{new Date(post.publishedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
