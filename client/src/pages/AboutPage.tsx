import Button from "../components/common/button/Button";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import "./AboutPage.css";
import { useEffect } from "react";

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="about-page">
      {/* Top Navigation Action */}
      <div className="about-page__nav">
        <button onClick={handleBack} className="about-back-btn" aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__copy">
          <span className="about-eyebrow">
            <span className="about-eyebrow__dot" />
            Who we are
          </span>
          <h1 className="about-hero__title">
            Our <span className="about-gradient-text">Story</span>
          </h1>
          <p className="about-lead">
            BlogWeb is a focused publishing space for practical ideas, thoughtful product work, and modern engineering habits that help builders ship with clarity.
          </p>

          <div className="about-hero__actions">
            <Button type="button" onClick={() => navigate("/")}>
              Explore the blog
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/signup")}
            >
              Join community
            </Button>
          </div>
        </div>

        {/* Hero Glass Panel */}
        <aside className="about-hero__panel" aria-label="BlogWeb highlights">
          <div className="about-hero__panel-top">
            <span className="about-hero__pill">Built for builders</span>
            <h3>Designing for useful reading</h3>
            <p>
              Clear structure, readable layouts, and a calm visual system keep the focus on ideas instead of interface noise.
            </p>
          </div>

          <div className="about-hero__stats">
            <article className="about-stat-card">
              <span className="about-stat-card__label">Readable</span>
              <strong>Fast scanning</strong>
            </article>
            <article className="about-stat-card">
              <span className="about-stat-card__label">Focused</span>
              <strong>Practical topics</strong>
            </article>
            <article className="about-stat-card">
              <span className="about-stat-card__label">Responsive</span>
              <strong>Mobile first</strong>
            </article>
          </div>
        </aside>
      </section>

      {/* Core Values Section */}
      <section className="about-values">
        <div className="about-section-head">
          <span className="about-eyebrow">Core values</span>
          <h2>What shapes the experience</h2>
        </div>

        <div className="about-values__grid">
          <article className="about-value-card">
            <span className="about-value-card__index">01</span>
            <h3>Clarity</h3>
            <p>
              Strong typography and structured content make it easier to scan, read, and remember what matters.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-card__index">02</span>
            <h3>Usefulness</h3>
            <p>
              We focus on practical ideas that readers can apply immediately in their own products and workflows.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-card__index">03</span>
            <h3>Consistency</h3>
            <p>
              Reusable components, responsive behavior, and a cohesive visual system keep the experience dependable.
            </p>
          </article>
        </div>
      </section>

      {/* Mission Split Section */}
      <section className="about-split">
        <div className="about-split__copy">
          <span className="about-eyebrow">Our mission</span>
          <h2>Help readers build better products with fewer distractions.</h2>
          <p>
            We publish concise, actionable content for engineers, designers, and product-minded builders. Each article is written to be useful in the real world, not just impressive on paper.
          </p>
          <p>
            The result is a calmer reading experience with clear hierarchy, purposeful spacing, and a layout that gives each idea room to land.
          </p>
        </div>

        <div className="about-split__visual" aria-hidden="true">
          <div className="about-visual-card about-visual-card--main">
            <span className="about-visual-card__eyebrow">Editorial focus</span>
            <strong>Clarity over clutter</strong>
            <p>
              Every page is designed to guide attention without overwhelming the reader.
            </p>
          </div>
          <div className="about-visual-card about-visual-card--accent">
            <span className="about-visual-card__eyebrow">Experience</span>
            <strong>Polished interactions</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;