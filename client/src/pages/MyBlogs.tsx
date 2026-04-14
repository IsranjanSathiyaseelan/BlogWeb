import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useBlog } from "../context/blog/BlogContext";
import Button from "../components/common/button/Button";
import type { BlogPost } from "../types/blog";
import "./pages.css";
import "./MyBlogs.css";

const initialForm = {
  title: "",
  excerpt: "",
  imageUrl: "",
  category: "Product",
  readMinutes: "5",
  content: "",
};

type BlogFormState = typeof initialForm;

const MyBlogs = () => {
  const { user, loading } = useAuth();
  const { posts, createPost, updatePost, deletePost } = useBlog();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);
  const navigate = useNavigate();

  if (loading) {
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

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.content.trim()) return;

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim() || "Product",
      readMinutes: Number(form.readMinutes) || 5,
      author: user.name,
      content: form.content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    };

    if (editingId !== null) {
      updatePost(editingId, payload);
    } else {
      createPost(payload);
    }

    resetForm();
  };

  const handleEdit = (id: number) => {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      category: post.category,
      readMinutes: String(post.readMinutes),
      content: post.content.join("\n"),
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this post? This action cannot be undone.")) {
      deletePost(id);
      if (editingId === id) resetForm();
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page myblogs">
      <Button onClick={handleBack} className="back-button">
        ← Back
      </Button>
      {/* Header */}
      <section className="content-panel myblogs__header">
        <div>
          <h1>Welcome back, {user.name}</h1>
          <p>
            You are signed in as <strong>{user.email}</strong>.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="content-panel blog-manager">
        <div className="blog-manager__form">
          <div className="blog-manager__header">
            <h2>{editingId ? "Edit blog post" : "Create a new blog"}</h2>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="blog-manager__fields">
            <label className="blog-manager__field">
              Title
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </label>

            <label className="blog-manager__field">
              Excerpt
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                required
              />
            </label>

            <div className="blog-manager__grid">
              <label className="blog-manager__field">
                Image URL
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="blog-manager__field">
                Category
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              </label>

              <label className="blog-manager__field">
                Reading minutes
                <input
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
              </label>
            </div>

            <label className="blog-manager__field">
              Content
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write each paragraph on a new line"
                required
              />
            </label>

            <Button type="submit" variant="primary">
              {editingId ? "Update Post" : "Create Post"}
            </Button>
          </form>
        </div>
      </section>

      {/* Blog List */}
      <section className="content-panel">
        <div className="section-head">
          <h2>Your blog posts</h2>
        </div>

        {posts.length === 0 ? (
          <div className="myblogs__empty">
            <p>No posts yet. Start creating your first blog 🚀</p>
          </div>
        ) : (
          <div className="blog-manager__list">
            {posts.map((post: BlogPost) => (
              <article key={post.id} className="blog-card">
                <div>
                  <p className="blog-card__meta">{post.category}</p>
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
