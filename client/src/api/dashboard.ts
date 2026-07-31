import { getCurrentUser } from "./auth";
import { getMyPosts } from "./posts";
import type { Blog, User } from "../types/dashboard";

const normalizePost = (post: any): Blog => ({
  id: String(post.id),
  title: post.title,
  content: Array.isArray(post.content) ? post.content.join("\n\n") : String(post.content),
  userId: String(post.authorId ?? post.author_id ?? ""),
  createdAt: post.publishedAt
    ? new Date(post.publishedAt)
    : post.published_at
    ? new Date(post.published_at)
    : new Date(),
});

import api from "./axios";

export const getUserDashboard = async () => {
  try {
    const { data } = await api.get("/dashboard");
    const user: User = {
      id: String(data.user.id),
      name: data.user.name,
      email: data.user.email,
      createdAt: new Date(data.user.createdAt ?? Date.now()),
    };

    return {
      user,
      blogs: (data.blogs || []).map(normalizePost),
      monthlyActivity: data.monthlyActivity as Array<{ month: string; articles: number; views: number }>,
      categoryDistribution: data.categoryDistribution as Array<{ category: string; count: number; color: string }>,
    };
  } catch {
    // Fallback to client aggregation if endpoint fails
    const [userResponse, posts] = await Promise.all([
      getCurrentUser(),
      getMyPosts(),
    ]);

    const user: User = {
      id: String(userResponse.user.id),
      name: userResponse.user.name,
      email: userResponse.user.email,
      createdAt: new Date(userResponse.user.createdAt ?? Date.now()),
    };

    return {
      user,
      blogs: posts.map(normalizePost),
    };
  }
};