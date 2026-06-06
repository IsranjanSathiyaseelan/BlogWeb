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
        <div className="blogcard__media">
          <img
            src={imageUrl}
            alt={title}
            className="blogcard__image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="blogcard__content">
          {category && <span className="blogcard__tag">{category}</span>}

          <h3 className="blogcard__title">{title}</h3>

          <p className="blogcard__description">{description}</p>

          <div className="blogcard__meta" aria-label="Post metadata">
            <time dateTime={publishedAt}>{formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span>{readMinutes} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
