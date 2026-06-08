import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useBlog } from "../context/blog/BlogContext";
import Button from "../components/common/button/Button";
import "./pages.css";
import "./BlogPostPage.css";

type ContentBlock =
  | { type: "paragraph"; text: string; id: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "list"; ordered: boolean; items: string[]; id: string }
  | { type: "quote"; text: string; id: string }
  | { type: "code"; code: string; language?: string; id: string };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatPublishedDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const renderInlineContent = (text: string) => {
  const parts: ReactNode[] = [];
  const inlineCodePattern = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineCodePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <code
        key={`${match.index}-${match[1]}`}
        className="blog-post-inline-code"
      >
        {match[1]}
      </code>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const buildContentBlocks = (content: string[]): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let paragraphIndex = 0;

  content.forEach((chunk) => {
    const trimmedChunk = chunk.trim();

    if (!trimmedChunk) {
      return;
    }

    if (trimmedChunk.startsWith("```")) {
      const lines = trimmedChunk.split("\n");
      const language = lines[0].replace(/^```/, "").trim() || undefined;
      const code = lines
        .slice(1)
        .join("\n")
        .replace(/```\s*$/, "")
        .trimEnd();

      blocks.push({
        type: "code",
        code,
        language,
        id: `code-${blocks.length}`,
      });
      return;
    }

    const segments = trimmedChunk.split(/\n{2,}/);

    segments.forEach((segment) => {
      const text = segment.trim();

      if (!text) {
        return;
      }

      const headingMatch = text.match(/^(#{1,3})\s+(.*)$/);
      if (headingMatch) {
        blocks.push({
          type: "heading",
          level: headingMatch[1].length as 1 | 2 | 3,
          text: headingMatch[2].trim(),
          id: slugify(headingMatch[2].trim()) || `section-${blocks.length}`,
        });
        return;
      }

      const quoteLines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (
        quoteLines.length > 0 &&
        quoteLines.every((line) => line.startsWith(">"))
      ) {
        blocks.push({
          type: "quote",
          text: quoteLines.map((line) => line.replace(/^>\s?/, "")).join(" "),
          id: `quote-${blocks.length}`,
        });
        return;
      }

      const listLines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (
        listLines.length > 1 &&
        listLines.every((line) => /^(?:-\s+|\*\s+|\d+\.\s+)/.test(line))
      ) {
        const ordered = /^\d+\.\s+/.test(listLines[0]);

        blocks.push({
          type: "list",
          ordered,
          items: listLines.map((line) =>
            line.replace(/^(?:-\s+|\*\s+|\d+\.\s+)/, ""),
          ),
          id: `list-${blocks.length}`,
        });
        return;
      }

      blocks.push({
        type: "paragraph",
        text,
        id: `paragraph-${paragraphIndex++}`,
      });
    });
  });

  return blocks;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const { getPostBySlug } = useBlog();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const post = slug ? getPostBySlug(slug) : undefined;
  const formattedPublishedDate = post
    ? formatPublishedDate(post.publishedAt)
    : "";
  const contentBlocks = useMemo(
    () => (post ? buildContentBlocks(post.content) : []),
    [post],
  );
  const leadParagraphIndex = useMemo(
    () => contentBlocks.findIndex((block) => block.type === "paragraph"),
    [contentBlocks],
  );

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setReadingProgress(
        scrollHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
          : 0,
      );
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!copiedCodeBlock) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedCodeBlock(null), 1600);
    return () => window.clearTimeout(timeout);
  }, [copiedCodeBlock]);

  useEffect(() => {
    if (!copiedLink) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedLink(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copiedLink]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleCopyCode = async (codeBlockId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(codeBlockId);
    } catch {
      setCopiedCodeBlock(null);
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
      <div className="blog-post-progress" aria-hidden="true">
        <span style={{ width: `${readingProgress}%` }} />
      </div>

      <div className="blog-post-shell">
        <header className="blog-post-hero">
          <div className="blog-post-breadcrumbs">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="blog-post-back-button"
            >
              ← Back to blog list
            </Button>
            <Link to="/all-blogs" className="blog-post-home-link">
              All blogs
            </Link>
          </div>

          <div className="blog-post-meta-row">
            <span className="blog-post-badge">{post.category}</span>
            <span className="blog-post-badge">{post.readMinutes} min read</span>
            <span className="blog-post-badge">
              Published {formattedPublishedDate}
            </span>
          </div>

          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-dek">By {post.author}</p>
        </header>

        <div className="blog-post-layout">
          <div className="blog-post-layout-spacer" aria-hidden="true" />

          <article className="blog-post-article">
            <div className="blog-post-article-body">
              {contentBlocks.map((block) => {
                if (block.type === "heading") {
                  const HeadingTag = `h${block.level}` as const;

                  return (
                    <div
                      key={block.id}
                      className={`blog-post-heading-wrap blog-post-heading-wrap--${block.level}`}
                    >
                      <HeadingTag
                        id={block.id}
                        className={`blog-post-heading blog-post-heading--${block.level}`}
                      >
                        <span className="blog-post-heading-text">
                          {renderInlineContent(block.text)}
                        </span>
                        <a
                          className="blog-post-anchor"
                          href={`#${block.id}`}
                          aria-label={`Link to ${block.text}`}
                        >
                          #
                        </a>
                      </HeadingTag>
                    </div>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote key={block.id} className="blog-post-quote">
                      <p>{renderInlineContent(block.text)}</p>
                    </blockquote>
                  );
                }

                if (block.type === "list") {
                  const ListTag = block.ordered ? "ol" : "ul";

                  return (
                    <ListTag key={block.id} className="blog-post-list">
                      {block.items.map((item, index) => (
                        <li key={`${block.id}-${index}`}>
                          {renderInlineContent(item)}
                        </li>
                      ))}
                    </ListTag>
                  );
                }

                if (block.type === "code") {
                  return (
                    <section key={block.id} className="blog-post-code-block">
                      <div className="blog-post-code-toolbar">
                        <div className="blog-post-code-file">
                          <span className="blog-post-code-dot" />
                          <span className="blog-post-code-dot" />
                          <span className="blog-post-code-dot" />
                          <span className="blog-post-code-language">
                            {block.language ? block.language : "Code"}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          className="blog-post-copy-button"
                          onClick={() => handleCopyCode(block.id, block.code)}
                        >
                          {copiedCodeBlock === block.id ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <pre className="blog-post-pre">
                        <code>{block.code}</code>
                      </pre>
                    </section>
                  );
                }

                return (
                  <p
                    key={block.id}
                    className={
                      block.id === contentBlocks[leadParagraphIndex]?.id
                        ? "blog-post-paragraph blog-post-paragraph--lead"
                        : "blog-post-paragraph"
                    }
                  >
                    {renderInlineContent(block.text)}
                  </p>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
