import { Request, Response } from "express";
import { initializeDb, pool } from "../config/db";

const runBlogQuery = async (queryText: string, values: unknown[] = []) => {
  try {
    return await pool.query(queryText, values);
  } catch (error: any) {
    if (error?.code === "42P01") {
      await initializeDb();
      return pool.query(queryText, values);
    }

    throw error;
  }
};

// ----------------------
// Slug helpers
// ----------------------
const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const generateUniqueSlug = async (title: string) => {
  const baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await runBlogQuery(
      `SELECT id FROM blog_posts WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (existing.rowCount === 0) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

// ----------------------
// Format response
// ----------------------
const formatPost = (row: any) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  author: row.author_name ?? `Author ${row.author_id}`,
  authorId: row.author_id,
  publishedAt: row.published_at?.toISOString().split("T")[0] || "",
  readMinutes: row.read_minutes,
  category: row.category,
  featured: row.featured,
});

// ----------------------
// Get all posts
// ----------------------
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const result = await runBlogQuery(
      `SELECT bp.*, u.name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       ORDER BY bp.published_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows.map(formatPost));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch posts" });
  }
};

// ----------------------
// Get post by slug
// ----------------------
export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await runBlogQuery(
      `SELECT bp.*, u.name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       WHERE bp.slug = $1 LIMIT 1`,
      [slug]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(formatPost(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch post" });
  }
};

// ----------------------
// Create post
// ----------------------
export const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, excerpt, content, readMinutes, category, featured = false } = req.body;

    if (!title || !excerpt || !content || typeof readMinutes !== "number" || !category) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    const slug = await generateUniqueSlug(title);

    const result = await runBlogQuery(
      `INSERT INTO blog_posts (slug, title, excerpt, content, image_url, author_id, read_minutes, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *, (SELECT name FROM users WHERE id = $6) AS author_name`,
      [slug, title, excerpt, content, "", user.id, readMinutes, category, featured]
    );

    res.status(201).json(formatPost(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create post" });
  }
};

// ----------------------
// Update post
// ----------------------
export const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = Number(req.params.id);

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid id" });

    const existingPost = await runBlogQuery(
      `SELECT * FROM blog_posts WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (existingPost.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = existingPost.rows[0];

    if (post.author_id !== user.id && user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updates = req.body;
    const slug = updates.title
      ? await generateUniqueSlug(updates.title)
      : post.slug;

    const result = await runBlogQuery(
      `UPDATE blog_posts SET
         title = COALESCE($1, title),
         slug = COALESCE($2, slug),
         excerpt = COALESCE($3, excerpt),
         content = COALESCE($4, content),
        read_minutes = COALESCE($5, read_minutes),
        category = COALESCE($6, category),
        featured = COALESCE($7, featured),
         updated_at = NOW()
       WHERE id = $8
       RETURNING *, (SELECT name FROM users WHERE id = author_id) AS author_name`,
      [
        updates.title,
        slug,
        updates.excerpt,
        updates.content,
        updates.readMinutes,
        updates.category,
        updates.featured,
        id,
      ]
    );

    res.json(formatPost(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update post" });
  }
};

// ----------------------
// Delete post
// ----------------------
export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = Number(req.params.id);

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid id" });

    const existingPost = await runBlogQuery(
      `SELECT * FROM blog_posts WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (existingPost.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = existingPost.rows[0];

    if (user.role !== "ADMIN" && post.author_id !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await runBlogQuery(`DELETE FROM blog_posts WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete post" });
  }
};
