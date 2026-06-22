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

  if (loading || loadingDashboard) {
    return (
      <div className="page myblogs">
        <section className="content-panel">
          <p>Loading your dashboard…</p>
        </section>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page myblogs">
      <section className="content-panel myblogs__header">
        <div>
          <h1>Welcome back, {dashboardUser?.name ?? user.name}</h1>
          <p>
            You are signed in as{" "}
            <strong>{dashboardUser?.email ?? user.email}</strong>.
          </p>
        </div>
        <div className="myblogs__actions">
          <Button type="button" onClick={() => navigate("/myblog")}>
            Manage your posts
          </Button>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-head">
          <h2>Your dashboard</h2>
          <p>See a summary of your recent posts and profile activity.</p>
        </div>

        {error ? (
          <div className="blog-manager__error">{error}</div>
        ) : (
          <div className="dashboard-summary-grid">
            <div className="dashboard-card">
              <p className="dashboard-card__label">Account created</p>
              <p className="dashboard-card__value">
                {dashboardUser?.createdAt.toLocaleDateString() ?? "—"}
              </p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card__label">Total posts</p>
              <p className="dashboard-card__value">{posts.length}</p>
            </div>
          </div>
        )}
      </section>

      <section className="content-panel">
        <div className="section-head">
          <h2>Your posts</h2>
          <p>Recent drafts and published posts tracked in one place.</p>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Excerpt</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-table-empty">
                    You have not published any posts yet.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.createdAt.toLocaleDateString()}</td>
                    <td>
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
