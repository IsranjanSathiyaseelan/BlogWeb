import { useMemo, useState } from "react";
import BlogCard from "../components/blog/blogcard/BlogCard";
import Button from "../components/common/button/Button";
import { useBlog } from "../context/blog/BlogContext";
import "./pages.css";

const HomePage = () => {
  const { posts, featuredPosts, categories } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visiblePosts = useMemo(() => {
    if (selectedCategory === "All") {
      return posts;
    }

    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="page">
      <section className="hero-banner">
        <p className="hero-kicker">Fresh stories every week</p>
        <h1>Insights on building products, teams, and careers.</h1>
        <p>
          BlogWeb curates practical writing from modern builders. Read what
          matters, skip what does not.
        </p>
      </section>

      <section className="content-section">
        <div className="section-head">
          <h2>Featured</h2>
        </div>
        <div className="card-grid">
          {featuredPosts.map((post) => (
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
      </section>

      <section className="content-section">
        <div className="section-head">
          <h2>Latest posts</h2>
          <div className="chip-group" role="tablist" aria-label="Filter posts">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="outline"
                className={`chip ${
                  selectedCategory === category ? "chip-active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="card-grid">
          {visiblePosts.map((post) => (
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
      </section>
    </div>
  );
};

export default HomePage;
