import React, { useState } from "react";
import "./DashboardCharts.css";

export interface MonthlyTrendData {
  month: string;
  articles: number;
}

export interface CategoryData {
  category: string;
  count: number;
  color: string;
}

export interface UserGrowthData {
  month: string;
  users: number;
  sessions: number;
}

// Default fallback data for activity trend if none provided
const defaultTrendData: MonthlyTrendData[] = [
  { month: "Jan", articles: 3 },
  { month: "Feb", articles: 5 },
  { month: "Mar", articles: 8 },
  { month: "Apr", articles: 6 },
  { month: "May", articles: 12 },
  { month: "Jun", articles: 9 },
  { month: "Jul", articles: 15 },
];

const defaultCategoryData: CategoryData[] = [
  { category: "Technology", count: 8, color: "#2563eb" },
  { category: "Design", count: 6, color: "#8b5cf6" },
  { category: "Product", count: 5, color: "#10b981" },
  { category: "Engineering", count: 4, color: "#f59e0b" },
  { category: "Culture", count: 3, color: "#ec4899" },
];

const defaultUserGrowthData: UserGrowthData[] = [
  { month: "Jan", users: 12, sessions: 45 },
  { month: "Feb", users: 19, sessions: 80 },
  { month: "Mar", users: 28, sessions: 120 },
  { month: "Apr", users: 35, sessions: 160 },
  { month: "May", users: 52, sessions: 240 },
  { month: "Jun", users: 68, sessions: 310 },
  { month: "Jul", users: 85, sessions: 420 },
];

/* ==========================================================================
   1. Activity Trend Chart (Articles Published Monthly)
   ========================================================================== */
export const ActivityTrendChart: React.FC<{
  data?: MonthlyTrendData[];
  title?: string;
  subtitle?: string;
}> = ({
  data: inputData,
  title = "Publishing Activity",
  subtitle = "Monthly articles published",
}) => {
  const [activePoint, setActivePoint] = useState<MonthlyTrendData | null>(null);

  // Guarantee non-empty data array
  const data = inputData && inputData.length > 0 ? inputData : defaultTrendData;

  const maxArticles = Math.max(...data.map((d) => d.articles), 1);

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const denominator = data.length > 1 ? data.length - 1 : 1;

  // Compute points for SVG path safely
  const points = data.map((d, index) => {
    const x = paddingX + (index / denominator) * chartWidth;
    const y = paddingY + chartHeight - (d.articles / maxArticles) * chartHeight;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const lastPoint = points[points.length - 1] || { x: paddingX, y: paddingY };
  const firstPoint = points[0] || { x: paddingX, y: paddingY };
  const areaD = `${pathD} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`;

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">{title}</h3>
          <p className="chart-card__subtitle">{subtitle}</p>
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot--purple" /> Articles Published
          </span>
        </div>
      </div>

      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
          <defs>
            <linearGradient id="articlesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + chartHeight * ratio;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#articlesGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bars & Dots for Articles */}
          {points.map((pt, i) => {
            const barWidth = 16;
            const barHeight = (pt.data.articles / maxArticles) * (chartHeight * 0.75);
            const barX = pt.x - barWidth / 2;
            const barY = height - paddingY - barHeight;

            const isHovered = activePoint?.month === pt.data.month;

            return (
              <g key={i} className="chart-interactive-group">
                {/* Article Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  className={`chart-bar ${isHovered ? "chart-bar--active" : ""}`}
                />

                {/* Point Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : "4"}
                  fill="#ffffff"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  className="chart-dot"
                  onMouseEnter={() => setActivePoint(pt.data)}
                  onMouseLeave={() => setActivePoint(null)}
                />

                {/* Invisible hover trigger */}
                <rect
                  x={pt.x - chartWidth / (data.length * 2)}
                  y={paddingY}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setActivePoint(pt.data)}
                  onMouseLeave={() => setActivePoint(null)}
                />

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="chart-axis-text"
                >
                  {pt.data.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && (
          <div className="chart-tooltip">
            <strong>{activePoint.month}</strong>
            <div>📄 {activePoint.articles} Articles Published</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   2. Category Distribution Chart (Donut / Progress Bars)
   ========================================================================== */
export const CategoryDistributionChart: React.FC<{
  data?: CategoryData[];
  title?: string;
}> = ({ data: inputData, title = "Category Distribution" }) => {
  const isExplicitlyEmpty = Array.isArray(inputData) && inputData.length === 0;
  const data = isExplicitlyEmpty
    ? []
    : inputData && inputData.length > 0
    ? inputData
    : defaultCategoryData;

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">{title}</h3>
          <p className="chart-card__subtitle">{total} Total Articles Published</p>
        </div>
      </div>

      <div className="category-chart-body">
        {data.length === 0 ? (
          <div style={{ padding: "28px 16px", textAlign: "center", color: "#64748b", fontSize: "0.95rem" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>🏷️</span>
            No topics or categories yet. Create a post to see your category breakdown!
          </div>
        ) : (
          <div className="category-bars-list">
            {data.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.category} className="category-bar-item">
                  <div className="category-bar-item__info">
                    <span className="category-bar-item__label">
                      <span
                        className="category-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </span>
                    <span className="category-bar-item__val">
                      {item.count} {item.count === 1 ? "post" : "posts"} ({percentage}%)
                    </span>
                  </div>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   3. User Growth / Engagement Overview Chart
   ========================================================================== */
export const UserGrowthChart: React.FC<{
  data?: UserGrowthData[];
  title?: string;
  subtitle?: string;
}> = ({
  data: inputData,
  title = "User Growth",
  subtitle = "Registered users progression",
}) => {
  const chartData: UserGrowthData[] =
    inputData && inputData.length > 0 ? inputData : defaultUserGrowthData;

  const maxVal = Math.max(...chartData.map((d) => Math.max(d.users, d.sessions)), 10);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">{title}</h3>
          <p className="chart-card__subtitle">{subtitle}</p>
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot--blue" /> Active Sessions
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot--green" /> Total Users
          </span>
        </div>
      </div>

      <div className="user-growth-chart-grid">
        {chartData.map((d) => {
          const userHeight = (d.users / maxVal) * 100;
          const sessionHeight = (d.sessions / maxVal) * 100;

          return (
            <div key={d.month} className="user-growth-col">
              <div className="user-growth-bars">
                <div
                  className="user-growth-bar user-growth-bar--session"
                  style={{ height: `${sessionHeight}%` }}
                  title={`${d.sessions} sessions`}
                />
                <div
                  className="user-growth-bar user-growth-bar--user"
                  style={{ height: `${userHeight}%` }}
                  title={`${d.users} users`}
                />
              </div>
              <span className="user-growth-label">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
