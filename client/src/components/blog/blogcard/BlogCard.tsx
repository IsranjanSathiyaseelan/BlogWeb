import { Link } from "react-router-dom";
import type { BlogCardProps } from "../../../types/ui";
import BlogCover from "../blogcover/BlogCover";
import "./BlogCard.css";

const BlogCard = ({
  title,
  description,
  link,
  category,
  publishedAt,
  readMinutes,
  layout = "vertical",
  postId,
  isDummy,
}: BlogCardProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt));

  const cardClassName = ["blogcard", `blogcard--${layout}`].join(" ");

  return (
    <article className={cardClassName}>
      <Link to={link} className="blogcard__link" aria-label={`Read ${title}`}>
        {/* Media / Generated Cover */}
        <div className="blogcard__media">
          <BlogCover
            variant="card"
            title={title}
            category={category}
            postId={postId ?? title}
          />
          <div className="blogcard__media-overlay" />
          {category && <span className="blogcard__tag-floating">{category}</span>}
        </div>

        {/* Card Body */}
        <div className="blogcard__content">
          <div className="blogcard__header">
            <div className="blogcard__tags-row">
              {category && <span className="blogcard__tag">{category}</span>}
              {isDummy && (
                <span className="blogcard__tag blogcard__tag--dummy">
                  Demo Story
                </span>
              )}
            </div>
            <h3 className="blogcard__title">
              <span>{title}</span>
              <svg
                className="blogcard__arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </h3>
          </div>

          <p className="blogcard__description">{description}</p>

          {/* Footer Metadata */}
          <div className="blogcard__footer">
            <div className="blogcard__meta" aria-label="Post metadata">
              <time dateTime={publishedAt}>{formattedDate}</time>
              <span className="blogcard__dot" aria-hidden="true">•</span>
              <span>{readMinutes} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
