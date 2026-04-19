import { Link } from "react-router-dom";
import "./pages.css";
import { useEffect } from "react";

const NotFoundPage = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="auth-page">
      <section className="content-panel article" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p>The page you requested could not be found.</p>
        <Link to="/" className="text-link">
          Go to homepage
        </Link>
      </section>
    </div>
  );
};

export default NotFoundPage;