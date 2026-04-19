import { useEffect } from "react";
import "./pages.css";

const CookiesPage = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="page">
      <section className="content-panel article">
        <h1>Cookie Policy</h1>
        <p className="article-meta">Last updated: April 2026</p>

        <p>
          This Cookie Policy explains how BlogWeb uses cookies and similar
          technologies to recognize you when you visit our platform. It describes
          what these technologies are, why we use them, and your choices regarding
          their use.
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help websites function efficiently and provide information
          to improve user experience, such as remembering your preferences and
          settings.
        </p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Ensure the website functions properly</li>
          <li>Remember your preferences and settings</li>
          <li>Analyze usage and improve performance</li>
          <li>Enhance security and prevent misuse</li>
        </ul>

        <h2>Types of Cookies We Use</h2>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are required for the operation of the website. Without
          them, certain features and services may not function properly.
        </p>

        <h3>Performance Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with the site by
          collecting anonymous information such as page visits and traffic
          sources.
        </p>

        <h3>Preference Cookies</h3>
        <p>
          These cookies allow the website to remember choices you make (such as
          language or region) to provide a more personalized experience.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can control or disable cookies through your browser settings.
          However, please note that disabling certain cookies may impact the
          functionality and performance of the website.
        </p>

        <h2>Your Choices</h2>
        <p>
          Most web browsers allow you to manage your cookie preferences. You can
          usually modify your browser settings to decline cookies or notify you
          when cookies are being used.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>
      </section>
    </div>
  );
};

export default CookiesPage;