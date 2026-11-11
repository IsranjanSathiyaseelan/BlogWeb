import "./BlogCover.css";

/* ============================================================
   GRADIENT PRESETS  (9 beautiful multi-stop gradients)
   Each entry is the full CSS linear-gradient(...) string minus
   the leading "linear-gradient(" — just the angle + stops.
============================================================ */
const GRADIENTS = [
  "135deg, #667eea 0%, #764ba2 100%", // Indigo / Violet
  "135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%", // Teal / Cyan
  "135deg, #f43f5e 0%, #ec4899 100%", // Rose / Pink
  "135deg, #f59e0b 0%, #ef4444 100%", // Amber / Orange
  "135deg, #22c55e 0%, #14b8a6 100%", // Green / Teal
  "135deg, #8b5cf6 0%, #3b82f6 100%", // Purple / Blue
  "135deg, #334155 0%, #1e293b 100%", // Slate / Dark
  "135deg, #fb923c 0%, #eab308 100%", // Coral / Gold
  "135deg, #34d399 0%, #059669 100%", // Mint / Emerald
];

/* ============================================================
   DETERMINISTIC HASH  (djb2-style on the string of postId)
   Same postId → same number every time.
============================================================ */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep it unsigned 32-bit
  }
  return hash;
}

function pickGradient(postId: number | string): string {
  const key = String(postId);
  const index = djb2Hash(key) % GRADIENTS.length;
  return GRADIENTS[index];
}

/* ============================================================
   FONT SIZES PER VARIANT
============================================================ */
const FONT_SIZES: Record<string, { title: string; badge: string }> = {
  card: { title: "1.15rem", badge: "0.7rem" },
  hero: { title: "2.4rem", badge: "0.85rem" },
  spotlight: { title: "1.55rem", badge: "0.75rem" },
};

/* ============================================================
   PROPS
============================================================ */
export interface BlogCoverProps {
  title: string;
  category?: string;
  postId: number | string;
  className?: string;
  variant?: "card" | "hero" | "spotlight";
}

/* ============================================================
   COMPONENT
============================================================ */
const BlogCover = ({
  title,
  category,
  postId,
  className = "",
  variant = "card",
}: BlogCoverProps) => {
  const gradient = pickGradient(postId);
  const { title: titleSize, badge: badgeSize } = FONT_SIZES[variant];

  const wrapperClass = [
    "blogcover",
    `blogcover--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /*
    We render everything as a single <svg> so it scales perfectly
    with any container size, is resolution-independent, and needs
    zero JavaScript for layout.

    The SVG uses a viewBox of 0 0 800 450 internally and lets CSS
    control the actual pixel size via width/height 100%.
  */
  const vw = 800;
  const vh = variant === "hero" ? 343 : variant === "spotlight" ? 400 : 450;

  return (
    <div className={wrapperClass}>
      <div className="blogcover__inner">
        <svg
          className="blogcover__svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid slice"
          aria-label={title}
          role="img"
        >
          <defs>
            <linearGradient
              id={`bcg-${postId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform={`rotate(${gradient.match(/^(\d+)deg/)?.[1] ?? "135"}, 0.5, 0.5)`}
            >
              {/* Parse the gradient string to extract colour stops */}
              {parseStops(gradient).map((stop, i) => (
                <stop
                  key={i}
                  offset={stop.offset}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
          </defs>

          {/* Background rect */}
          <rect
            width={vw}
            height={vh}
            fill={`url(#bcg-${postId})`}
          />

          {/* ── Decorative shapes (semi-transparent white) ── */}
          <g className="blogcover__shapes">
            {/* Large circle – top right */}
            <circle
              cx={vw * 0.85}
              cy={vh * 0.15}
              r={vh * 0.42}
              fill="rgba(255,255,255,0.08)"
            />
            {/* Medium circle – bottom left */}
            <circle
              cx={vw * 0.1}
              cy={vh * 0.85}
              r={vh * 0.3}
              fill="rgba(255,255,255,0.07)"
            />
            {/* Small accent circle */}
            <circle
              cx={vw * 0.5}
              cy={vh * 0.1}
              r={vh * 0.12}
              fill="rgba(255,255,255,0.1)"
            />
            {/* Blob ellipse – centre */}
            <ellipse
              cx={vw * 0.5}
              cy={vh * 0.6}
              rx={vw * 0.35}
              ry={vh * 0.22}
              fill="rgba(255,255,255,0.05)"
            />
            {/* Diagonal line set */}
            {[-60, -20, 20, 60].map((offset, i) => (
              <line
                key={i}
                x1={vw * 0.3 + offset * 2}
                y1={0}
                x2={vw * 0.7 + offset * 2}
                y2={vh}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
              />
            ))}
            {/* Tiny dot cluster – bottom right */}
            {[0, 18, 36].map((dx, i) =>
              [0, 18, 36].map((dy, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={vw * 0.9 + dx - 36}
                  cy={vh * 0.75 + dy}
                  r={2.2}
                  fill="rgba(255,255,255,0.18)"
                />
              )),
            )}
          </g>

          {/* ── Title text ── */}
          <foreignObject
            x={vw * 0.07}
            y={vh * 0.28}
            width={vw * 0.86}
            height={vh * 0.5}
          >
            <div
              className="blogcover__title-box"
              style={{ fontSize: titleSize }}
            >
              {title}
            </div>
          </foreignObject>

          {/* ── Category badge (bottom-left pill) ── */}
          {category && (
            <>
              <rect
                x={vw * 0.07}
                y={vh - 42}
                width={Math.min(category.length * 8.5 + 20, vw * 0.4)}
                height={28}
                rx={14}
                fill="rgba(255,255,255,0.22)"
              />
              <text
                x={vw * 0.07 + Math.min(category.length * 8.5 + 20, vw * 0.4) / 2}
                y={vh - 42 + 18}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={badgeSize}
                fontWeight="700"
                fontFamily="inherit"
                style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {category}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

/* ============================================================
   HELPER – parse gradient stop colours from the preset string
   e.g. "135deg, #667eea 0%, #764ba2 100%"
============================================================ */
interface ColorStop {
  color: string;
  offset: string;
}

function parseStops(gradient: string): ColorStop[] {
  // Drop the angle token ("135deg") and split on ", "
  const tokens = gradient
    .split(",")
    .map((t) => t.trim())
    .filter((t) => !t.endsWith("deg"));

  return tokens.map((token) => {
    // token: "#667eea 0%"  or  "#06b6d4 50%"
    const parts = token.split(/\s+/);
    return {
      color: parts[0],
      offset: parts[1] ?? "100%",
    };
  });
}

export default BlogCover;

