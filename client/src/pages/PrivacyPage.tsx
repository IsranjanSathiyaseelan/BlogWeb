import { useEffect } from "react";
import "./pages.css";

const PrivacyPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page">
      <section className="content-panel article">
        <h1>Privacy Policy</h1>
        <p className="article-meta">Last updated: April 2026</p>

        <p>
          This Privacy Policy explains how BlogWeb collects, uses, and protects
          your personal information when you use our platform.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect personal information that you provide directly to us,
          such as your name, email address, and any content you create or share
          on the platform.
        </p>
        <p>
          We may also collect limited technical data automatically, such as your
          browser type, device information, and usage activity, to help improve
          our services.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, operate, and maintain the platform</li>
          <li>Improve user experience and develop new features</li>
          <li>Communicate with you about updates or important notices</li>
          <li>Ensure security and prevent misuse of the service</li>
        </ul>

        <h2>Data Protection</h2>
        <p>
          We take reasonable technical and organizational measures to protect
          your personal information from unauthorized access, loss, or misuse.
          However, no method of transmission over the internet is completely
          secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may have the right to access, update, or delete your personal
          information. If you wish to exercise these rights, please contact us.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;