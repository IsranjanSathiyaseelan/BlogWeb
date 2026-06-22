import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useBlog } from "../context/blog/BlogContext";
import { getMyPosts } from "../api/posts";
import Button from "../components/common/button/Button";
import type { BlogFormState, BlogPost } from "../types/blog";
import "./pages.css";
import "./MyBlogs.css";

const initialForm = {
  title: "",
  excerpt: "",
  category: "Product",
  readMinutes: "5",
  content: "",
};

const MyBlogs = () => {
  const { user, loading } = useAuth();
  const { createPost, updatePost, deletePost } = useBlog();
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);
  // const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const loadMyPosts = async () => {
      setLoadingPosts(true);
      setError("");

      try {
        const posts = await getMyPosts();
        setUserPosts(posts);
      } catch (err) {
        console.error(err);
        setError("Unable to load your blog posts.");
      } finally {
        setLoadingPosts(false);
      }
    };

    loadMyPosts();
  }, [user]);

  if (loading || loadingPosts) {
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
      content: post.content.join("\n"),
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      await deletePost(id);
      setUserPosts((current) => current.filter((post) => post.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      setError("Unable to delete the post. Please try again.");
    }
  };

  return (
    <div className="page myblogs">
      <section ref={formRef} className="content-panel blog-manager">
        <div className="blog-manager__form">
          <div className="blog-manager__header">
            <h2>{editingId ? "Edit blog post" : "Create a new blog"}</h2>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            {error && <div className="blog-manager__error">{error}</div>}
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

            <label className="blog-manager__field">
              Content
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
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

        {userPosts.length === 0 ? (
          <div className="myblogs__empty">
            <p>No posts yet. Start creating your first blog 🚀</p>
          </div>
        ) : (
          <div className="blog-manager__list">
            {userPosts.map((post: BlogPost) => (
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
