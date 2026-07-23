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
    title: "Editorial Clarity",
    description:
      "Thoughtful typography and wide breathing room keep the reading experience calm and premium.",
  },
  {
    icon: "search",
    title: "Fast Discovery",
    description:
      "Contextual search and structured categories help readers pinpoint insights without friction.",
  },
  {
    icon: "device",
    title: "Responsive Flow",
    description:
      "Fluid layouts and touch-first elements scale effortlessly across phones, tablets, and desktops.",
  },
  {
    icon: "layers",
    title: "Modular Design System",
    description:
      "Cohesive tokens for spacing, cards, and buttons ensure visually unified UI across all pages.",
  },
];

const FeatureIcon = ({ name }: { name: FeatureIconName }) => {
  switch (name) {
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    case "device":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="14" height="20" x="5" y="2" rx="3" />
          <path d="M12 18h.01" />
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
      {/* HERO SECTION */}
      <section className="home-hero content-panel">
        <div className="home-hero__copy">
          <div className="home-hero__badge">
            <span className="home-hero__badge-dot" />
            <span>Editorial Platform</span>
          </div>
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
              Explore All Stories
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/about")}
            >
              Our Story &rarr;
            </Button>
          </div>

          <div className="home-hero__stats" aria-label="Blog metrics">
            <article>
              <strong>{posts.length}</strong>
              <span>Published Stories</span>
            </article>
            <article>
              <strong>{Math.max(categories.length - 1, 0)}</strong>
              <span>Core Topics</span>
            </article>
            <article>
              <strong>{totalReadMinutes}m</strong>
              <span>Total Reading</span>
            </article>
          </div>
        </div>

        {/* HERO GRAPHIC / MOCKUP */}
        <div className="home-hero__visual" aria-label="Editorial dashboard preview">
          <div className="home-dashboard">
            <div className="home-dashboard__chrome">
              <span className="dots"><i /><i /><i /></span>
              <strong className="home-dashboard__tag">Featured Preview</strong>
            </div>

            <div className="home-dashboard__feature">
              <span className="home-dashboard__label">Spotlight</span>
              <h2>{featuredStory?.title ?? "Ship with clarity and confidence."}</h2>
              <p className="home-dashboard__meta">
                {featuredStory?.category ?? "Product"} &bull; {featuredStory?.readMinutes ?? 6} min read
              </p>
            </div>

            <div className="home-dashboard__grid">
              <article>
                <span>Weekly Readers</span>
                <strong>{Math.max(posts.length * 12, 48)}k+</strong>
              </article>
              <article>
                <span>Top Category</span>
                <strong>{categories[1] ?? "Design"}</strong>
              </article>
            </div>

            <div className="home-dashboard__stories">
              {supportingStories.length > 0 ? (
                supportingStories.map((post: BlogPost) => (
                  <article key={post.id} className="home-dashboard__story-item">
                    <span className="story-category">{post.category}</span>
                    <strong className="story-title">{post.title}</strong>
                  </article>
                ))
              ) : (
                <article className="home-dashboard__story-item">
                  <span className="story-category">Reading List</span>
                  <strong className="story-title">New stories published every week.</strong>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="home-values">
        <div className="section-head home-values__head">
          <p className="home-section-label">Design Standards</p>
          <h2>Everything is crafted to feel premium and effortless.</h2>
        </div>

        <div className="home-values__grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="home-value-card content-panel">
              <div className="home-value-card__icon">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS / SPLIT SECTION */}
      <section className="home-split content-panel">
        <div className="home-split__copy">
          <p className="home-section-label">User Experience</p>
          <h2>Discovery feels deliberate, not overwhelming.</h2>
          <p>
            Our home interface guides readers with intentional structure, letting
            content stand out without intrusive banners or cognitive clutter.
          </p>

          <div className="home-split__steps">
            <article>
              <span className="step-num">01</span>
              <div>
                <strong>Scan the Hero</strong>
                <p>Grasp the platform’s core identity and value proposition in seconds.</p>
              </div>
            </article>
            <article>
              <span className="step-num">02</span>
              <div>
                <strong>Curated Insights</strong>
                <p>Browse high-impact featured articles directly from the home feed.</p>
              </div>
            </article>
            <article>
              <span className="step-num">03</span>
              <div>
                <strong>Full Archive</strong>
                <p>Dive deep into categorized topic libraries whenever you're ready.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="home-split__visual" aria-hidden="true">
          <div className="home-split__graphic">
            <div className="home-split__graphic-bar home-split__graphic-bar--lg" />
            <div className="home-split__graphic-bar home-split__graphic-bar--md" />
            <div className="home-split__graphic-bar home-split__graphic-bar--sm" />
          </div>
          <div className="home-split__quote">
            <strong>"Crafted with editorial restraint."</strong>
            <p>
              Generous whitespace, refined typography, and purposeful motion keep focus on key ideas.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED POSTS */}
      <section className="home-featured content-panel">
        <div className="section-head home-featured__head">
          <div>
            <p className="home-section-label">Curated Selection</p>
            <h2>Latest stories from the archive</h2>
            <p className="result-count">
              Displaying {featuredPosts.length} top-rated articles
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => navigate("/all-blogs")}>
            View All Blogs &rarr;
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