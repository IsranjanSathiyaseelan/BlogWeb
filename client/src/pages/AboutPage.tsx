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
    <div className="page">
      <Button onClick={handleBack} className="back-button">
        ← Back
      </Button>

      <section className="about-hero content-panel">
        <div className="about-hero__copy">
          <p className="about-eyebrow">Who we are</p>
          <h1>Our Story</h1>
          <p className="about-lead">
            BlogWeb is a focused publishing space for practical ideas,
            thoughtful product work, and modern engineering habits that help
            builders ship with clarity.
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
              Join the community
            </Button>
          </div>
        </div>

        <aside className="about-hero__panel" aria-label="BlogWeb highlights">
          <div className="about-hero__panel-top">
            <span className="about-hero__pill">Built for builders</span>
            <strong>Designing for useful reading</strong>
            <p>
              Clear structure, readable layouts, and a calm visual system keep
              the focus on ideas instead of interface noise.
            </p>
          </div>

          <div className="about-hero__stats">
            <article>
              <span>Readable</span>
              <strong>Fast scanning</strong>
            </article>
            <article>
              <span>Focused</span>
              <strong>Practical topics</strong>
            </article>
            <article>
              <span>Responsive</span>
              <strong>Mobile first</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="about-split content-panel">
        <div className="about-split__copy">
          <p className="about-section-label">Our mission</p>
          <h2>Help readers build better products with fewer distractions.</h2>
          <p>
            We publish concise, actionable content for engineers, designers, and
            product-minded builders. Each article is written to be useful in the
            real world, not just impressive on paper.
          </p>
          <p>
            The result is a calmer reading experience with clear hierarchy,
            purposeful spacing, and a layout that gives each idea room to land.
          </p>
        </div>

        <div className="about-split__visual" aria-hidden="true">
          <div className="about-visual-card about-visual-card--main">
            <span className="about-visual-card__eyebrow">Editorial focus</span>
            <strong>Clarity over clutter</strong>
            <p>
              Every page is designed to guide attention without overwhelming the
              reader.
            </p>
          </div>
          <div className="about-visual-card about-visual-card--accent">
            <span className="about-visual-card__eyebrow">Experience</span>
            <strong>Polished interactions</strong>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="section-head about-values__head">
          <div>
            <p className="about-section-label">Core values</p>
            <h2>What shapes the experience</h2>
          </div>
        </div>

        <div className="about-values__grid">
          <article className="about-value-card content-panel">
            <span className="about-value-card__index">01</span>
            <h3>Clarity</h3>
            <p>
              Strong typography and structured content make it easier to scan,
              read, and remember what matters.
            </p>
          </article>

          <article className="about-value-card content-panel">
            <span className="about-value-card__index">02</span>
            <h3>Usefulness</h3>
            <p>
              We focus on practical ideas that readers can apply immediately in
              their own products and workflows.
            </p>
          </article>

          <article className="about-value-card content-panel">
            <span className="about-value-card__index">03</span>
            <h3>Consistency</h3>
            <p>
              Reusable components, responsive behavior, and a cohesive visual
              system keep the experience dependable.
            </p>
          </article>
        </div>
      </section>

<section className="about-team content-panel">
  <div className="section-head about-team__head">
    <div>
      <p className="about-section-label">Meet the creator</p>
      <h2>The person behind the publication</h2>
    </div>

    <p className="about-team__intro">
      Every article, feature, and design decision is crafted independently from research and writing to development and user experience with a commitment to thoughtful storytelling and quality digital publishing.
    </p>
  </div>

  <div className="about-team__grid">
    <article className="about-team-card">
      <div className="about-team-card__avatar">
        <span>IR</span>
      </div>

      <div className="about-team-card__content">
        <h3>Isranjan</h3>
        <p className="about-team-card__role">
          Founder · Designer · Developer
        </p>

        <p className="about-team-card__bio">
          Builds and maintains the publication, combining design, engineering,
          and editorial thinking to create a fast, accessible, and engaging
          reading experience.
        </p>
      </div>
    </article>
  </div>
</section>

      <section className="about-cta content-panel">
        <div>
          <p className="about-section-label">Next step</p>
          <h2>Want to keep reading?</h2>
          <p>
            Explore the latest stories or create an account to join the
            community of builders and readers.
          </p>
        </div>

        <div className="about-cta__actions">
          <Button type="button" onClick={() => navigate("/")}>
            Browse posts
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/signup")}
          >
            Get started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
