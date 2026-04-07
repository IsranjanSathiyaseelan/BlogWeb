import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogCart.css";

interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  link: string;
}

const BlogCard = ({
  title,
  description,
  imageUrl,
  author,
  link,
}: BlogCardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div
      ref={cardRef}
      className="blogcard"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <span
        className="blogcard-tooltip"
        style={{
          top: position.y + 10,
          left: position.x + 10,
          opacity: tooltipVisible ? 1 : 0,
          transform: tooltipVisible ? "scale(1)" : "scale(0.6)",
        }}
      >
        Author: {author}
      </span>

      <Link to={link}>
        <img className="blogcard-image" src={imageUrl} alt={title} />
      </Link>

      <div className="blogcard-content">
        <Link to={link}>
          <h5 className="blogcard-title">{title}</h5>
        </Link>
        <p className="blogcard-description">{description}</p>
        <Link to={link} className="blogcard-readmore">
          Read more
          <svg
            className="blogcard-arrow"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
