import Button from "../components/common/button/Button";
import { useNavigate } from "react-router-dom";
import "./pages.css";
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

      <section className="content-panel">
        <h1>About BlogWeb</h1>

        <p>
          BlogWeb is a clean, focused platform built for sharing practical ideas
          about product development, software engineering, and modern digital
          experiences. Our goal is to provide content that is not only insightful
          but immediately useful for real-world projects.
        </p>

        <p>
          We publish actionable guides, deep dives, and thoughtful perspectives
          for engineers, designers, and ambitious builders who want to improve
          their craft. Whether you're learning the basics or refining advanced
          skills, BlogWeb is designed to support continuous growth.
        </p>

        <p>
          This project is also a demonstration of a well-structured React
          application. It showcases reusable components, route-based navigation,
          and shared state management using modern development practices.
        </p>

        <p>Key features of BlogWeb include:</p>

        <ul>
          <li>Well-organized blog posts with clean UI</li>
          <li>Built using modern React patterns and best practices</li>
          <li>Reusable components for scalability</li>
          <li>Route-based page navigation</li>
          <li>Responsive design for all devices</li>
        </ul>

        <p>
          BlogWeb is more than just a blog - it’s a learning project, a knowledge
          hub, and a foundation you can build upon to create your own full-stack
          applications.
        </p>

        <p>
          We believe in simplicity, clarity, and building things that matter.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;