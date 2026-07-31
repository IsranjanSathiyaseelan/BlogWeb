import { Request, Response } from "express";
import { prisma } from "../config/prisma";

const sanitizeUser = (user: { id: number; name: string; email: string; createdAt: Date }) => ({
  id: String(user.id),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const formatBlog = (post: {
  id: number;
  title: string;
  content: string;
  category?: string | null;
  authorId: number;
  publishedAt: Date;
}) => ({
  id: String(post.id),
  title: post.title,
  content: post.content,
  category: post.category || "Uncategorized",
  userId: String(post.authorId),
  createdAt: post.publishedAt,
});

const CATEGORY_COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user;

    if (!reqUser?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(reqUser.id) },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await prisma.blogPost.findMany({
      where: { authorId: Number(reqUser.id) },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        authorId: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    // Dynamically calculate Topics & Categories distribution for this user
    const categoryMap: Record<string, number> = {};
    posts.forEach((p) => {
      const cat = p.category?.trim() || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryMap).map(([category, count], idx) => ({
      category,
      count,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

    return res.status(200).json({
      user: sanitizeUser(user),
      blogs: posts.map(formatBlog),
      categoryDistribution,
      topics: categoryDistribution,
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return res.status(500).json({ error: "Unable to fetch dashboard" });
  }
};
