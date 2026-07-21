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
  authorId: number;
  publishedAt: Date;
}) => ({
  id: String(post.id),
  title: post.title,
  content: post.content,
  userId: String(post.authorId),
  createdAt: post.publishedAt,
});

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
        authorId: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return res.status(200).json({
      user: sanitizeUser(user),
      blogs: posts.map(formatBlog),
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return res.status(500).json({ error: "Unable to fetch dashboard" });
  }
};
