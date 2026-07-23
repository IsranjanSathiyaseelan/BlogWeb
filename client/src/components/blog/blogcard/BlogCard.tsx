import { Link } from "react-router-dom";
import type { BlogCardProps } from "../../../types/ui";
import "./BlogCard.css";

const BlogCard = ({
  title,
  description,
  imageUrl,
  link,
  category,
  publishedAt,
  readMinutes,
  layout = "vertical",
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
        {/* Media / Cover Image */}
        <div className="blogcard__media">
          <img
            src={imageUrl}
            alt={title}
            className="blogcard__image"
            loading="lazy"
            decoding="async"
          />
          <div className="blogcard__media-overlay" />
          {category && <span className="blogcard__tag-floating">{category}</span>}
        </div>

        {/* Card Body */}
        <div className="blogcard__content">
          <div className="blogcard__header">
            {category && <span className="blogcard__tag">{category}</span>}
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