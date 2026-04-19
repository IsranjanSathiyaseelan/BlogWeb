import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useBlog } from "../context/blog/BlogContext";
import Button from "../components/common/button/Button";
import "./pages.css";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { getPostBySlug } = useBlog();
  const navigate = useNavigate();

  const post = slug ? getPostBySlug(slug) : undefined;

  // Scroll to top when page opens
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

  if (!post) {
    return (
      <div className="page">
        <section className="content-panel">
          <h1>Post not found</h1>
          <p>The article you are looking for does not exist.</p>
          <Link to="/" className="text-link">
            Return to home
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Back Button */}
      <Button onClick={handleBack} className="back-button">
        ← Back
      </Button>

      <article className="article">
        <p className="article-meta">
          {post.category} · {post.readMinutes} min read · {post.publishedAt}
        </p>

        <h1>{post.title}</h1>
        <p className="article-author">By {post.author}</p>

        <img src={post.imageUrl} alt={post.title} className="article-image" />

        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
};

export default BlogPostPage;