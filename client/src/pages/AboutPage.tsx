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
      {/* Dynamic Background Mesh */}
      <div className="about-mesh-bg" aria-hidden="true">
        <div className="about-mesh-glow about-mesh-glow--one" />
        <div className="about-mesh-glow about-mesh-glow--two" />
      </div>

      {/* Top Navigation Back Action */}
      <div className="about-page__nav">
        <button onClick={handleBack} className="about-back-btn" aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Editorial Hero Banner */}
      <header className="about-editorial-hero">
        <div className="about-eyebrow-container">
          <span className="about-pill">MANIFESTO</span>
          <span className="about-meta-text">Published for Builders</span>
        </div>
        <h1 className="about-editorial-title">
          We curate clarity in an <br />
          <span className="about-gradient-headline">age of digital noise.</span>
        </h1>
        <p className="about-editorial-lead">
          BlogWeb strips away the clutter of traditional content platforms. Built specifically for engineers and designers who value deep focus, high-signal writing, and exceptional code architecture.
        </p>
      </header>

      {/* Bento Grid Core System */}
      <section className="about-bento-grid">
        {/* Bento Cell 1: Large Visual Showcase */}
        <div className="about-bento-card about-bento-card--primary">
          <div className="about-bento-card__header">
            <span className="about-bento-tag">The Philosophy</span>
            <h3>Engineered for Maximum Retention</h3>
          </div>
          <p className="about-bento-text">
            Every pixel, margin, and typography scale has been tuned to support sustained cognitive flow. No flashing banners, no tracking bloat—just pure architectural ideas.
          </p>
          <div className="about-bento-graphic-preview">
            <div className="about-code-snippet">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <code>import &#123; focus, clarity &#125; from "@blogweb/core";</code>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Velocity / Metrics */}
        <div className="about-bento-card about-bento-card--dark">
          <div className="about-bento-card__header">
            <span className="about-bento-tag about-bento-tag--light">Performance</span>
            <h3>Lightning Fast Access</h3>
          </div>
          <div className="about-stat-row">
            <div className="about-stat-metric">
              <span className="about-metric-num">0.1s</span>
              <span className="about-metric-label">Load Latency</span>
            </div>
            <div className="about-stat-metric">
              <span className="about-metric-num">100%</span>
              <span className="about-metric-label">Responsive Flow</span>
            </div>
          </div>
          <p className="about-bento-subtext">Optimized client-side navigation powered by modern React routing infrastructure.</p>
        </div>

        {/* Bento Cell 3: Community Focus */}
        <div className="about-bento-card about-bento-card--feature">
          <div className="about-bento-card__header">
            <span className="about-bento-tag">Ecosystem</span>
            <h3>Built by practitioners, for practitioners</h3>
          </div>
          <p className="about-bento-text">
            Our contributors are active software engineers and frontend architects sharing real-world production post-mortems and patterns.
          </p>
          <div className="about-bento-actions">
            <Button type="button" onClick={() => navigate("/signup")}>
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Pillars Section */}
      <section className="about-pillars-section">
        <div className="about-section-header">
          <span className="about-eyebrow">Pillars of Execution</span>
          <h2>Three rules we never compromise on</h2>
        </div>

        <div className="about-pillars-grid">
          <article className="about-pillar-card">
            <div className="about-pillar-icon-box">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3>Zero Friction</h3>
            <p>From the moment you load a post, text is scannable, typography is crisp, and context is immediately clear.</p>
          </article>

          <article className="about-pillar-card">
            <div className="about-pillar-icon-box">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3>Verified Patterns</h3>
            <p>Every piece of advice or technical breakdown has been stress-tested in actual production environments.</p>
          </article>

          <article className="about-pillar-card">
            <div className="about-pillar-icon-box">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </div>
            <h3>Modular Systems</h3>
            <p>Designed using scalable component architecture, ensuring smooth adaptations across every viewport width.</p>
          </article>
        </div>
      </section>

      {/* Modern Floating CTA Footer */}
      <section className="about-floating-cta">
        <div className="about-cta-content">
          <span className="about-pill about-pill--accent">Get Started Today</span>
          <h2>Ready to transform how you read and build?</h2>
          <p>Explore hundreds of tactical engineering articles and join our growing network.</p>
        </div>
        <div className="about-cta-action-group">
          <Button type="button" onClick={() => navigate("/")}>
            Explore Articles
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/signup")}>
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;