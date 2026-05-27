import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import BlogCard from "../components/blog/blogcard/BlogCard";
import Button from "../components/common/button/Button";
import { useBlog } from "../context/blog/BlogContext";
import type { BlogPost } from "../types/blog";
import "./pages.css";
import "./HomePage.css";

const HomePage = () => {
  const { posts, categories } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const totalReadMinutes = useMemo(
    () => posts.reduce((sum, post) => sum + post.readMinutes, 0),
    [posts],
  );

  const visiblePosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const byCategory =
      selectedCategory === "All"
        ? posts
        : posts.filter((post) => post.category === selectedCategory);

    if (!normalizedQuery) return byCategory;

    return byCategory.filter((post) => {
      const searchableText =
        `${post.title} ${post.excerpt} ${post.author}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearchQuery("");
  }, []);

  return (
    <div className="page">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="hero-kicker">Fresh stories every week</p>
          <h1>Insights on building products, teams, and careers.</h1>
          <p>
            BlogWeb curates practical writing from modern builders. Read what
            matters, skip what does not.
          </p>

          <div className="hero-stats" aria-label="Blog metrics">
            <article className="hero-stat-card">
              <span className="hero-stat-label">Published Posts</span>
              <strong className="hero-stat-value">{posts.length}</strong>
            </article>
            <article className="hero-stat-card">
              <span className="hero-stat-label">Topics</span>
              <strong className="hero-stat-value">
                {categories.length - 1}
              </strong>
            </article>
            <article className="hero-stat-card">
              <span className="hero-stat-label">Reading Minutes</span>
              <strong className="hero-stat-value">{totalReadMinutes}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-head">
          <div>
            <h2>Latest posts</h2>
            <p className="result-count">
              Showing {visiblePosts.length} of {posts.length} posts
            </p>
          </div>
          <div className="home-filters">
            <label className="search-field" htmlFor="home-search">
              <span className="sr-only">Search posts</span>
              <input
                id="home-search"
                type="search"
                placeholder="Search title, author, or excerpt"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </label>

            <div
              className="chip-group"
              role="tablist"
              aria-label="Filter posts"
            >
              {categories.map((category: string) => (
                <Button
                  key={category}
                  type="button"
                  variant="outline"
                  className={`chip ${
                    selectedCategory === category ? "chip-active" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {(selectedCategory !== "All" || searchQuery.trim().length > 0) && (
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {visiblePosts.length === 0 ? (
          <div className="home-empty-state content-panel">
            <h3>No posts match your filters</h3>
            <p>Try another category or search using fewer keywords.</p>
            <Button type="button" variant="primary" onClick={clearFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="card-grid">
            {visiblePosts.map((post: BlogPost) => (
              <BlogCard
                key={post.id}
                title={post.title}
                description={post.excerpt}
                imageUrl={post.imageUrl}
                author={post.author}
                link={`/blog/${post.slug}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
