import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../../api/posts";
import type { BlogPost } from "../../types/blog";
import "./AdminPostsPage.css";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch admin posts:", err);
        setError("Unable to load posts list. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDeletePost = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const titleMatch = post.title.toLowerCase().includes(query);
    const categoryMatch = post.category.toLowerCase().includes(query);
    const authorMatch = post.author.toLowerCase().includes(query);
    const emailMatch = (post.authorEmail || "").toLowerCase().includes(query);
    return titleMatch || categoryMatch || authorMatch || emailMatch;
  });

  return (
    <div className="admin-posts-page">
      {/* Header */}
      <header className="admin-posts-header-banner">
        <div>
          <h1 className="admin-posts-title">Posts Management</h1>
          <p className="admin-posts-subtitle">
            View, search, and manage all published articles across the platform.
          </p>
        </div>
      </header>

      {/* Global Error */}
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

      {/* Posts Table Panel */}
      <section className="admin-posts-table-panel">
        <div className="admin-posts-table-head">
          <div className="admin-posts-count-badge">
            Showing <strong>{filteredPosts.length}</strong> of{" "}
            <strong>{posts.length}</strong> total posts
          </div>

          <div className="admin-search-box-wrapper">
            <svg
              className="admin-search-box-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="admin-search-box-input"
              placeholder="Search title, category, author, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="admin-search-box-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "32%" }}>Article Title</th>
                <th style={{ width: "15%" }}>Category</th>
                <th style={{ width: "25%" }}>Author & Email</th>
                <th style={{ width: "14%" }}>Published</th>
                <th className="text-right" style={{ width: "14%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "36px" }}>
                    <span className="admin-skeleton-pulse" style={{ width: "220px", height: "24px" }} />
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-table-empty">
                      <div className="admin-empty-icon">🔍</div>
                      <h3>No matching posts found</h3>
                      <p>
                        Try broadening your search term or clear the filter input.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="admin-posts-table-row">
                    <td>
                      <div className="admin-post-title-container">
                        <strong className="admin-post-item-title">{post.title}</strong>
                        <span className="admin-post-item-readtime">
                          {post.readMinutes} min read
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-category-pill">
                        {post.category}
                      </span>
                    </td>
                    <td>
                      <div className="admin-author-details">
                        <span className="admin-author-display-name">{post.author}</span>
                        <span className="admin-author-display-email">
                          {post.authorEmail || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-date-display">
                        {post.publishedAt}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-post-action-buttons">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-btn admin-btn--view"
                          title="View Article"
                        >
                          👁️ View
                        </a>
                        <button
                          type="button"
                          className="admin-btn admin-btn--delete"
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={deletingId === post.id}
                        >
                          {deletingId === post.id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </div>
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

export default AdminPostsPage;
