import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/blogcard/BlogCard";
import Button from "../components/common/button/Button";
import { useBlog } from "../context/blog/BlogContext";
import type { BlogPost } from "../types/blog";
import "./pages.css";
import "./AllBlogs.css";

const AllBlogs = () => {
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");

  const visiblePosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => {
      const searchableText =
        `${post.title} ${post.excerpt} ${post.author}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [posts, searchQuery]);

  const searchId = "allblogs-search";

  return (
    <div className="page allblogs-page">
      <section className="allblogs-hero content-panel">
        <div className="allblogs-hero__copy">
          <p className="allblogs-eyebrow">All blogs</p>
          <h1>Search every story in one dedicated place.</h1>
          <p className="allblogs-subtitle">
            Browse the full archive and jump straight to the post you need with
            a single clean search field.
          </p>
        </div>

        <div className="allblogs-hero__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Back home
          </Button>
        </div>
      </section>

      <section className="allblogs-search content-panel">
        <div className="allblogs-search__head">
          <p className="allblogs-label">Search</p>
          <p className="allblogs-result-count">
            Showing {visiblePosts.length} of {posts.length} posts
          </p>
        </div>

        <form
          className="allblogs-search-bar"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="allblogs-search-field" htmlFor={searchId}>
            <input
              id={searchId}
              type="search"
              placeholder="Search posts"
              value={searchQuery}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(event.target.value)
              }
              autoComplete="off"
              aria-label="Search posts"
            />
          </label>
        </form>
      </section>

      {visiblePosts.length === 0 ? (
        <div className="allblogs-empty-state content-panel">
          <h3>No results found</h3>
          <p>Try a different search term to find another post.</p>
          <Button
            type="button"
            variant="primary"
            onClick={() => setSearchQuery("")}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="allblogs-grid">
          {visiblePosts.map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              title={post.title}
              description={post.excerpt}
              imageUrl={post.imageUrl}
              category={post.category}
              publishedAt={post.publishedAt}
              readMinutes={post.readMinutes}
              layout={post.featured ? "horizontal" : "vertical"}
              link={`/blog/${post.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
