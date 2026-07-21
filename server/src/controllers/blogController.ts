import { Request, Response } from "express";
import { prisma } from "../config/prisma";

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
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

// ----------------------
// Format response
// ----------------------
type PostWithAuthor = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: number;
  author: { name: string } | null;
  publishedAt: Date;
  readMinutes: number;
  category: string;
  featured: boolean;
};

const formatPost = (post: PostWithAuthor) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author?.name ?? `Author ${post.authorId}`,
  authorId: post.authorId,
  publishedAt: post.publishedAt.toISOString().split("T")[0],
  readMinutes: post.readMinutes,
  category: post.category,
  featured: post.featured,
});

const postWithAuthorInclude = { author: { select: { name: true } } };

// ----------------------
// Get all posts
// ----------------------
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const posts = await prisma.blogPost.findMany({
      include: postWithAuthorInclude,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
    });

    res.json(posts.map(formatPost));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch posts" });
  }
};

// ----------------------
// Get current user's posts
// ----------------------
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const posts = await prisma.blogPost.findMany({
      where: { authorId: Number(user.id) },
      include: postWithAuthorInclude,
      orderBy: { publishedAt: "desc" },
    });

    res.json(posts.map(formatPost));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch your posts" });
  }
};

// ----------------------
// Get post by slug
// ----------------------
export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: postWithAuthorInclude,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(formatPost(post));
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

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        imageUrl: "",
        authorId: Number(user.id),
        readMinutes,
        category,
        featured,
      },
      include: postWithAuthorInclude,
    });

    res.status(201).json(formatPost(post));
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

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== Number(user.id) && user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updates = req.body;
    const slug = updates.title
      ? await generateUniqueSlug(updates.title)
      : undefined;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: updates.title ?? undefined,
        slug,
        excerpt: updates.excerpt ?? undefined,
        content: updates.content ?? undefined,
        readMinutes: updates.readMinutes ?? undefined,
        category: updates.category ?? undefined,
        featured: updates.featured ?? undefined,
      },
      include: postWithAuthorInclude,
    });

    res.json(formatPost(post));
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

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (user.role !== "ADMIN" && existingPost.authorId !== Number(user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.blogPost.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete post" });
  }
};
