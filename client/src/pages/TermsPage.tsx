import { useEffect } from "react";
import "./pages.css";

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page">
      <section className="content-panel article">
        <h1>Terms of Service</h1>

        <p>
          These Terms of Service govern your use of BlogWeb. By accessing or using
          our platform, you agree to comply with these terms. If you do not agree,
          you should not use the service.
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing BlogWeb, creating an account, or using any part of the
          service, you acknowledge that you have read, understood, and agree to be
          bound by these Terms of Service and any applicable laws and regulations.
        </p>

        <h2>Use License</h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to access
          and use BlogWeb for personal, non-commercial purposes. This license does
          not transfer ownership of any materials or content.
        </p>

        <p>Under this license, you agree not to:</p>
        <ul>
          <li>Copy, modify, or distribute any content without permission</li>
          <li>Use the platform for commercial purposes without authorization</li>
          <li>Attempt to reverse engineer, decompile, or disrupt the platform</li>
          <li>
            Use the service in any way that violates applicable laws or regulations
          </li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          BlogWeb is provided on an “as is” and “as available” basis. We make no
          guarantees regarding the accuracy, reliability, or availability of the
          service. To the fullest extent permitted by law, we disclaim all
          warranties, express or implied, including fitness for a particular
          purpose and non-infringement.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event shall BlogWeb or its affiliates be liable for any indirect,
          incidental, or consequential damages arising from your use of the
          platform.
        </p>
      </section>
    </div>
  );
};

export default TermsPage;