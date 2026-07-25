import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useBlog } from "../context/blog/BlogContext";
import { getMyPosts } from "../api/posts";
import Button from "../components/common/button/Button";
import type { BlogFormState, BlogPost } from "../types/blog";
import "./pages.css";
import "./MyBlogs.css";

const INITIAL_FORM: BlogFormState = {
  title: "",
  excerpt: "",
  category: "Product",
  readMinutes: "5",
  content: "",
};

const MyBlogs: React.FC = () => {
  const { user, loading } = useAuth();
  const { createPost, updatePost, deletePost } = useBlog();

  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(INITIAL_FORM);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    const loadMyPosts = async () => {
      setLoadingPosts(true);
      setError("");

      try {
        const posts = await getMyPosts();
        if (isMounted) setUserPosts(posts);
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError("Unable to load your blog posts.");
        }
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    loadMyPosts();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading || loadingPosts) {
    return (
      <div className="page myblogs">
        <div className="myblogs-skeleton" aria-label="Loading content studio">
          <div className="skeleton-box skeleton-box--form" />
          <div className="skeleton-grid">
            <div className="skeleton-box skeleton-box--card" />
            <div className="skeleton-box skeleton-box--card" />
            <div className="skeleton-box skeleton-box--card" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError("");
  };

  const addOrUpdateLocalPosts = (updatedPost: BlogPost) => {
    setUserPosts((current) => {
      const existingIndex = current.findIndex(
        (item) => item.id === updatedPost.id,
      );
      if (existingIndex >= 0) {
        return current.map((item) =>
          item.id === updatedPost.id ? updatedPost : item,
        );
      }
      return [updatedPost, ...current];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.content.trim()) return;

    setSubmitting(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim() || "Product",
      readMinutes: Number(form.readMinutes) || 5,
      content: form.content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (editingId !== null) {
        const updatedPost = await updatePost(editingId, payload);
        addOrUpdateLocalPosts(updatedPost);
      } else {
        const createdPost = await createPost(payload);
        addOrUpdateLocalPosts(createdPost);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Unable to save the post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id: number) => {
    const post = userPosts.find((item) => item.id === id);
    if (!post) return;

    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readMinutes: String(post.readMinutes),
      content: post.content.join("\n\n"),
    });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) {
      return;
    }

    const previousPosts = [...userPosts];
    // Optimistic Removal
    setUserPosts((current) => current.filter((post) => post.id !== id));

    try {
      await deletePost(id);
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      // Revert Optimistic Change
      setUserPosts(previousPosts);
      setError("Unable to delete the post. Please try again.");
    }
  };

  return (
    <div className="page myblogs">
      {/* Form Editor */}
      <div ref={formRef} className="blog-manager-container">
        <form onSubmit={handleSubmit} className="blog-manager__form">
          <div className="blog-manager__header">
            <div className="blog-manager__title-group">
              <span
                className={`blog-manager__badge ${
                  editingId ? "blog-manager__badge--editing" : ""
                }`}
              >
                {editingId ? "Editing Mode" : "New Post"}
              </span>
              <h2>{editingId ? "Update Article" : "Write a New Article"}</h2>
            </div>
          </div>

          {error && (
            <div
              className="blog-manager__error"
              role="alert"
              aria-live="polite"
            >
              <svg
                width="18"
                height="18"
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

          <div className="blog-manager__fields">
            {/* Title Input */}
            <div className="blog-manager__field blog-manager__field--hero">
              <label htmlFor="article-title" className="visually-hidden">
                Article Title
              </label>
              <input
                id="article-title"
                className="input-title"
                placeholder="Article Title..."
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            {/* Metadata Bar (Category & Read Time) */}
            <div className="blog-manager__meta-bar">
              <div className="blog-manager__field">
                <label htmlFor="category-select">Category</label>
                <div className="input-with-icon">
                  <span className="input-icon" aria-hidden="true">
                    🏷️
                  </span>
                  <input
                    id="category-select"
                    placeholder="e.g. Engineering, Design"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="blog-manager__field">
                <label htmlFor="read-time-input">Read Time (minutes)</label>
                <div className="input-with-icon">
                  <span className="input-icon" aria-hidden="true">
                    ⏱️
                  </span>
                  <input
                    id="read-time-input"
                    type="number"
                    min={1}
                    value={form.readMinutes}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        readMinutes: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Excerpt Input */}
            <div className="blog-manager__field">
              <div className="field-label-row">
                <label htmlFor="excerpt-input">Summary Excerpt</label>
                <span className="field-hint" id="excerpt-hint">
                  {form.excerpt.length}/200 chars
                </span>
              </div>
              <textarea
                id="excerpt-input"
                rows={2}
                maxLength={200}
                aria-describedby="excerpt-hint"
                placeholder="Write a brief preview summary that will show on post cards..."
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                required
              />
            </div>

            {/* Main Content Body */}
            <div className="blog-manager__field">
              <div className="field-label-row">
                <label htmlFor="content-input">Article Body</label>
                <span className="field-hint">Supports line breaks</span>
              </div>
              <textarea
                id="content-input"
                className="input-content"
                rows={10}
                placeholder="Start writing your article body here..."
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="blog-manager__footer">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={submitting}
              >
                Discard Changes
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Publish Article"}
            </Button>
          </div>
        </form>
      </div>

      {/* Published Posts Grid */}
      <section className="content-panel">
        <div className="section-head section-head--between">
          <div>
            <h2>Your published posts</h2>
            <p>Manage and track articles you've authored.</p>
          </div>
          {userPosts.length > 0 && (
            <span className="myblogs-count-pill">{userPosts.length} Posts</span>
          )}
        </div>

        {userPosts.length === 0 ? (
          <div className="myblogs__empty">
            <div className="myblogs__empty-icon" aria-hidden="true">
              ✍️
            </div>
            <h3>No articles published yet</h3>
            <p>Use the editor above to craft your first post!</p>
          </div>
        ) : (
          <div className="blog-manager__list">
            {userPosts.map((post: BlogPost) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card__content">
                  <div className="blog-card__top">
                    <span className="blog-card__meta">{post.category}</span>
                    <span className="blog-card__readtime">
                      ⏱ {post.readMinutes} min read
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>

                <div className="blog-card__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBlogs;
