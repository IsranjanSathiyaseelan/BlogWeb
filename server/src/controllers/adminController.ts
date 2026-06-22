import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { pool } from "../config/db";
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_JWT_SECRET } from "../config/env";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = jwt.sign({ isAdmin: true, email }, ADMIN_JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to sign in admin" });
  }
};

export const getAdminMetrics = async (req: Request, res: Response) => {
  void req;
  try {
    const userCountResult = await pool.query(`SELECT COUNT(*) AS total FROM users`);
    const blogCountResult = await pool.query(`SELECT COUNT(*) AS total FROM blog_posts`);

    return res.json({
      totalUsers: Number(userCountResult.rows[0]?.total ?? 0),
      totalBlogs: Number(blogCountResult.rows[0]?.total ?? 0),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch admin metrics" });
  }
};

export const getAdminUsers = async (req: Request, res: Response) => {
  void req;
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, u.updated_at, COUNT(bp.id) AS blog_count
       FROM users u
       LEFT JOIN blog_posts bp ON bp.author_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT 100`
    );

    return res.json({
      users: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        created_at: row.created_at,
        updated_at: row.updated_at,
        blogCount: Number(row.blog_count ?? 0),
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to delete user" });
  }
};

export const verifyAdmin = async (req: Request, res: Response) => {
  const user = (req as any).user;

  return res.status(200).json({
    valid: true,
    user,
  });
};
