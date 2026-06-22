import { Request, Response } from "express";
import { pool } from "../config/db";

const sanitizeUser = (row: any) => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  createdAt:
    typeof row.created_at === "string"
      ? new Date(row.created_at)
      : row.created_at?.toISOString
      ? new Date(row.created_at)
      : new Date(),
});

const formatBlog = (row: any) => ({
  id: String(row.id),
  title: row.title,
  content: row.content,
  userId: String(row.author_id),
  createdAt:
    typeof row.created_at === "string"
      ? new Date(row.created_at)
      : row.created_at?.toISOString
      ? new Date(row.created_at)
      : new Date(),
});

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userResult = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1`,
      [user.id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const blogResult = await pool.query(
      `SELECT id, title, content, author_id, created_at
       FROM blog_posts
       WHERE author_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    return res.status(200).json({
      user: sanitizeUser(userResult.rows[0]),
      blogs: blogResult.rows.map(formatBlog),
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return res.status(500).json({ error: "Unable to fetch dashboard" });
  }
};
