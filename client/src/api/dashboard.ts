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

export const getUserDashboard = async () => {
  const [userResponse, posts] = await Promise.all([
    getCurrentUser(),
    getMyPosts(),
  ]);

  const user: User = {
    id: userResponse.user.id,
    name: userResponse.user.name,
    email: userResponse.user.email,
    createdAt: new Date(userResponse.user.createdAt ?? Date.now()),
  };

  return {
    user,
    blogs: posts.map(normalizePost),
  };
};
