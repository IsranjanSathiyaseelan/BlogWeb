import { Link, useParams } from "react-router-dom";
import { useBlog } from "../context/blogStore";
import "./pages.css";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { getPostBySlug } = useBlog();
  const post = slug ? getPostBySlug(slug) : undefined;

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
      <article className="article">
        <p className="article-meta">
          {post.category} · {post.readMinutes} min read · {post.publishedAt}
        </p>
        <h1>{post.title}</h1>
        <p className="article-author">By {post.author}</p>
        <img src={post.imageUrl} alt={post.title} className="article-image" />
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
};

export default BlogPostPage;