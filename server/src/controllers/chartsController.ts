import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CATEGORY_COLORS = [
  "#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4",
];

/** Returns the last N month labels ending at the current month */
const buildMonthWindow = (count: number = 7): string[] => {
  const now = new Date();
  const result: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(MONTH_NAMES[d.getMonth()]);
  }
  return result;
};

/** Groups posts by category and returns a colour-coded distribution array */
const buildCategoryDistribution = (
  posts: Array<{ category: string | null }>
) => {
  const map: Record<string, number> = {};
  posts.forEach((p) => {
    const cat = p.category || "General";
    map[cat] = (map[cat] || 0) + 1;
  });
  return Object.entries(map).map(([category, count], idx) => ({
    category,
    count,
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));
};

// ─── Admin Chart Methods ───────────────────────────────────────────────────────

/**
 * GET /admin/charts/activity
 * Monthly articles published, estimated views, new users, and sessions.
 */
export const getAdminActivityChart = async (_req: Request, res: Response) => {
  try {
    const [allUsers, allPosts] = await Promise.all([
      prisma.user.findMany({ select: { createdAt: true } }),
      prisma.blogPost.findMany({ select: { publishedAt: true } }),
    ]);

    const months = buildMonthWindow(7);

    const monthlyActivity = months.map((m) => {
      const articles = allPosts.filter(
        (p) => MONTH_NAMES[p.publishedAt.getMonth()] === m
      ).length;
      const users = allUsers.filter(
        (u) => MONTH_NAMES[u.createdAt.getMonth()] === m
      ).length;
      return {
        month: m,
        articles,
        users,
        sessions: Math.max(users * 4, articles * 5),
      };
    });

    return res.json({ monthlyActivity });
  } catch (error) {
    console.error("getAdminActivityChart error:", error);
    return res.status(500).json({ error: "Unable to fetch activity chart data" });
  }
};

/**
 * GET /admin/charts/categories
 * Count of posts grouped by category across the entire platform.
 */
export const getAdminCategoryChart = async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({ select: { category: true } });
    const categoryDistribution = buildCategoryDistribution(posts);
    return res.json({ categoryDistribution });
  } catch (error) {
    console.error("getAdminCategoryChart error:", error);
    return res.status(500).json({ error: "Unable to fetch category chart data" });
  }
};

/**
 * GET /admin/charts/user-growth
 * Monthly new user registrations and estimated session counts.
 */
export const getAdminUserGrowthChart = async (_req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({ select: { createdAt: true } });
    const months = buildMonthWindow(7);

    const userGrowth = months.map((m) => {
      const users = allUsers.filter(
        (u) => MONTH_NAMES[u.createdAt.getMonth()] === m
      ).length;
      return {
        month: m,
        users,
        sessions: Math.max(users * 4, 2),
      };
    });

    return res.json({ userGrowth });
  } catch (error) {
    console.error("getAdminUserGrowthChart error:", error);
    return res.status(500).json({ error: "Unable to fetch user growth chart data" });
  }
};

// ─── User Chart Methods ────────────────────────────────────────────────────────

/**
 * GET /dashboard/charts/activity
 * Monthly articles published and estimated views for the authenticated user.
 */
export const getUserActivityChart = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user;
    if (!reqUser?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const posts = await prisma.blogPost.findMany({
      where: { authorId: Number(reqUser.id) },
      select: { publishedAt: true },
    });

    const months = buildMonthWindow(7);

    const monthlyActivity = months.map((m) => {
      const articles = posts.filter(
        (p) => MONTH_NAMES[p.publishedAt.getMonth()] === m
      ).length;
      return {
        month: m,
        articles,
      };
    });

    return res.json({ monthlyActivity });
  } catch (error) {
    console.error("getUserActivityChart error:", error);
    return res.status(500).json({ error: "Unable to fetch user activity chart data" });
  }
};

/**
 * GET /dashboard/charts/categories
 * Count of posts grouped by category for the authenticated user.
 */
export const getUserCategoryChart = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user;
    if (!reqUser?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const posts = await prisma.blogPost.findMany({
      where: { authorId: Number(reqUser.id) },
      select: { category: true },
    });

    const map: Record<string, number> = {};
    posts.forEach((p) => {
      const cat = p.category?.trim() || "Uncategorized";
      map[cat] = (map[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(map).map(([category, count], idx) => ({
      category,
      count,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

    return res.json({ categoryDistribution });
  } catch (error) {
    console.error("getUserCategoryChart error:", error);
    return res.status(500).json({ error: "Unable to fetch user category chart data" });
  }
};
