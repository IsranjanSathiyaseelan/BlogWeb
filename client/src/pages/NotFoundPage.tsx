import { Link } from "react-router-dom";
import "./pages.css";

const NotFoundPage = () => {
  return (
    <div className="page">
      <section className="content-panel">
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