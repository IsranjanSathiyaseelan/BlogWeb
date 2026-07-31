import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/blogcard/BlogCard";
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
      {/* MINIMAL HERO HEADER */}
      <section className="home-minimal-hero content-panel">
        <div className="home-minimal-hero__content">
          <h1 className="home-minimal-title">Explore Articles & Insights</h1>

          {/* Search & Category Pills */}
          <div className="home-filter-bar">
            <div className="home-search-box">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search blogs by title, category, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="home-search-clear"
                  onClick={() => setSearchQuery("")}
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
                All Stories ({posts.length})
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
            {featuredStory.imageUrl && (
              <div className="spotlight-image-wrapper">
                <img src={featuredStory.imageUrl} alt={featuredStory.title} />
              </div>
            )}
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
                imageUrl={post.imageUrl}
                category={post.category}
                publishedAt={post.publishedAt}
                readMinutes={post.readMinutes}
                layout="vertical"
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