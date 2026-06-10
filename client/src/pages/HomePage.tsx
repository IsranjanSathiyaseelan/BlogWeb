import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/blogcard/BlogCard";
import Button from "../components/common/button/Button";
import { useBlog } from "../context/blog/BlogContext";
import type { BlogPost } from "../types/blog";
import "./pages.css";
import "./HomePage.css";

type FeatureIconName = "spark" | "layers" | "search" | "device";

const featureCards: Array<{
  icon: FeatureIconName;
  title: string;
  description: string;
}> = [
  {
    icon: "spark",
    title: "Editorial clarity",
    description:
      "Thoughtful layouts and crisp typography keep the experience calm, premium, and easy to scan.",
  },
  {
    icon: "search",
    title: "Fast discovery",
    description:
      "Search and filters are built into the page flow so readers can find the right story without friction.",
  },
  {
    icon: "device",
    title: "Responsive by default",
    description:
      "Every section collapses naturally on mobile with breathing room, readable type, and touch-friendly actions.",
  },
  {
    icon: "layers",
    title: "Reusable system",
    description:
      "Cards, panels, buttons, and spacing scale consistently across the homepage and the rest of the app.",
  },
];

const renderFeatureIcon = (icon: FeatureIconName) => {
  switch (icon) {
    case "spark":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m12 4 7 4-7 4-7-4 7-4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m5 12 7 4 7-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m5 16 7 4 7-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="11"
            cy="11"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M16 16l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "device":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 16h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { posts, categories } = useBlog();

  const featuredStory = posts[0];
  const supportingStories = posts.slice(1, 4);
  const featuredPosts = posts.slice(0, 3);
  const totalReadMinutes = posts.reduce((sum, post) => sum + post.readMinutes, 0);

  return (
    <div className="page home-page">
      <section className="home-hero content-panel">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">Premium ideas for modern builders</p>
          <h1>Build a sharper product mind with every scroll.</h1>
          <p className="home-hero__subtitle">
            BlogWeb is a polished home for practical insights, modern design
            thinking, and product writing that feels as clear as it looks.
          </p>

          <div className="home-hero__actions">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/all-blogs")}
            >
              View All Blogs
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/about")}
            >
              Learn our story →
            </Button>
          </div>

          <div className="home-hero__stats" aria-label="Blog metrics">
            <article>
              <span>Stories</span>
              <strong>{posts.length}</strong>
            </article>
            <article>
              <span>Topics</span>
              <strong>{Math.max(categories.length - 1, 0)}</strong>
            </article>
            <article>
              <span>Read time</span>
              <strong>{totalReadMinutes} min</strong>
            </article>
          </div>
        </div>

        <div className="home-hero__visual" aria-label="Editorial dashboard preview">
          <div className="home-dashboard">
            <div className="home-dashboard__chrome">
              <span></span>
              <span></span>
              <span></span>
              <strong>Editorial dashboard</strong>
            </div>

            <div className="home-dashboard__feature">
              <p>Featured story</p>
              <h2>{featuredStory?.title ?? "Ship with clarity and confidence."}</h2>
              <span>
                {featuredStory?.category ?? "Product"} • {featuredStory?.readMinutes ?? 6} min read
              </span>
            </div>

            <div className="home-dashboard__grid">
              <article>
                <span>Weekly reads</span>
                <strong>{Math.max(posts.length * 12, 48)}</strong>
              </article>
              <article>
                <span>Top category</span>
                <strong>{categories[1] ?? "Design"}</strong>
              </article>
              <article>
                <span>Focus</span>
                <strong>Clarity</strong>
              </article>
            </div>

            <div className="home-dashboard__stories">
              {supportingStories.map((post: BlogPost) => (
                <article key={post.id}>
                  <span>{post.category}</span>
                  <strong>{post.title}</strong>
                </article>
              ))}
              {supportingStories.length === 0 && (
                <article>
                  <span>Reading list</span>
                  <strong>New stories arrive every week.</strong>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="home-values">
        <div className="section-head home-values__head">
          <div>
            <p className="home-section-label">Value proposition</p>
            <h2>Everything is designed to feel premium and effortless.</h2>
          </div>
        </div>

        <div className="home-values__grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="home-value-card content-panel">
              <div className="home-value-card__icon">{renderFeatureIcon(feature.icon)}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-split content-panel">
        <div className="home-split__copy">
          <p className="home-section-label">How it flows</p>
          <h2>Discovery feels deliberate, not crowded.</h2>
          <p>
            The homepage gives readers a strong first impression, then moves them
            through thoughtful curation and content without visual friction.
          </p>

          <div className="home-split__steps">
            <article>
              <span>01</span>
              <div>
                <strong>Scan the hero</strong>
                <p>Understand what the publication offers in a single glance.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Read the preview</strong>
                <p>See the latest posts without needing a separate browsing page.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Open the archive</strong>
                <p>Jump to the dedicated blogs page when you want the full list.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="home-split__visual" aria-hidden="true">
          <div className="home-split__graphic">
            <div className="home-split__graphic-bar home-split__graphic-bar--lg"></div>
            <div className="home-split__graphic-bar home-split__graphic-bar--md"></div>
            <div className="home-split__graphic-bar home-split__graphic-bar--sm"></div>
          </div>
          <div className="home-split__quote">
            <strong>Built to read like a high-end product page.</strong>
            <p>
              Spacing, contrast, and restraint keep the interface premium without
              feeling heavy.
            </p>
          </div>
        </div>
      </section>

      <section className="home-featured content-panel">
        <div className="section-head home-featured__head">
          <div>
            <p className="home-section-label">Featured posts</p>
            <h2>Latest stories from the archive.</h2>
            <p className="result-count">
              Showing {featuredPosts.length} spotlight posts
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => navigate("/all-blogs")}>
            View All Blogs
          </Button>
        </div>

        <div className="card-grid">
          {featuredPosts.map((post: BlogPost) => (
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
      </section>
    </div>
  );
};

export default HomePage;
