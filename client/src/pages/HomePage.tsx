import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/blogcard/BlogCard";
import BlogCover from "../components/blog/blogcover/BlogCover";
import Button from "../components/common/button/Button";
import { useBlog } from "../context/blog/BlogContext";
import type { BlogPost } from "../types/blog";
import "./pages.css";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { posts, categories } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featuredStory = posts[0];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="page home-page home-minimal">
      {/* REDESIGNED MODERN HERO HEADER */}
      <section className="home-hero-modern">
        <div className="home-hero-backdrop" aria-hidden="true">
          <div className="home-hero-glow home-hero-glow--1" />
          <div className="home-hero-glow home-hero-glow--2" />
        </div>

        <div className="home-hero-container">
          <div className="home-hero-badge">
            <span className="home-hero-badge-dot" />
            <span>Curated Editorial Insights</span>
          </div>

          <h1 className="home-hero-title">
            Where thoughtful ideas <br />
            <span className="home-hero-gradient-text">meet modern execution.</span>
          </h1>
          
          <p className="home-hero-subtitle">
            Explore battle-tested engineering post-mortems, design patterns, and practical guides written by builders for builders.
          </p>

          {/* Floating Search & Category Filter Bar */}
          <div className="home-filter-dock">
            <div className="home-search-box">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search articles by title, keyword, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="home-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="home-category-chips">
              <button
                type="button"
                className={`category-chip ${
                  selectedCategory === "All" ? "category-chip--active" : ""
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                All Stories <span className="chip-count">({posts.length})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${
                    selectedCategory === cat ? "category-chip--active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT ARTICLE (Shown when no search/category filter active) */}
      {!searchQuery && selectedCategory === "All" && featuredStory && (
        <section className="home-spotlight content-panel">
          <div className="spotlight-badge">Featured Story</div>
          <div className="spotlight-card" onClick={() => navigate(`/blog/${featuredStory.slug}`)}>
            <div className="spotlight-image-wrapper">
              <BlogCover
                variant="spotlight"
                title={featuredStory.title}
                category={featuredStory.category}
                postId={featuredStory.id}
              />
            </div>
            <div className="spotlight-details">
              <div className="spotlight-meta">
                <span className="spotlight-category">{featuredStory.category}</span>
                <span>&bull;</span>
                <span>{featuredStory.publishedAt}</span>
                <span>&bull;</span>
                <span>{featuredStory.readMinutes} min read</span>
              </div>
              <h2 className="spotlight-title">{featuredStory.title}</h2>
              <p className="spotlight-excerpt">{featuredStory.excerpt}</p>
              <div className="spotlight-author">
                <span>By <strong>{featuredStory.author}</strong></span>
                <span className="read-more-link">Read Story &rarr;</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN BLOG FEED GRID */}
      <section className="home-blogs-feed content-panel">
        <div className="feed-header">
          <h2>
            {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
          </h2>
          <span className="result-counter">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="home-empty-feed">
            <div className="empty-icon">📖</div>
            <h3>No blogs match your filter</h3>
            <p>Try clearing your search term or select a different category.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="card-grid">
            {filteredPosts.map((post: BlogPost) => (
              <BlogCard
                key={post.id}
                title={post.title}
                description={post.excerpt}
                category={post.category}
                publishedAt={post.publishedAt}
                readMinutes={post.readMinutes}
                layout="vertical"
                link={`/blog/${post.slug}`}
                postId={post.id}
                isDummy={post.isDummy}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;